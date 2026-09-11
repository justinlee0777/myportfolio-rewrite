import { DQN } from './dqn';
import { PrioritizedReplayBuffer } from './dqn-utils';

export class PrioritizedExperienceReplayDQN extends DQN {
  constructor(...args) {
    super(...args);

    this.replayBuffer = new PrioritizedReplayBuffer();
  }

  remember(state, action, reward, nextState, done) {
    this.replayBuffer.add({ state, action, reward, nextState, done });
  }

  train() {
    if (this.replayBuffer.size < this.batchSize) {
      return;
    }

    // 1. Sample from the prioritized buffer
    const { batch, indices, weights } = this.replayBuffer.sample(
      this.batchSize,
    );

    // 2. Convert raw data arrays to Tensors
    // (Wrap in tf.tidy to automatically clean up intermediate tensors)
    this.tf.tidy(() => {
      const states = this.tf.tensor2d(batch.map((d) => d.state));
      const actions = this.tf.tensor1d(
        batch.map((d) => d.action),
        'int32',
      );
      const rewards = this.tf.tensor1d(batch.map((d) => d.reward));
      const nextStates = this.tf.tensor2d(batch.map((d) => d.nextState));
      const dones = this.tf.tensor1d(
        batch.map((d) => d.done),
        'bool',
      );
      const isWeights = this.tf.tensor1d(Array.from(weights)); // Importance Sampling weights

      // 3. Calculate Target Q-Values (Standard DQN or Double DQN math)
      const nextQValues = this.targetNetwork.forward(nextStates);
      const maxNextQ = nextQValues.max(1);

      // If done, target is just reward. Otherwise, reward + gamma * maxNextQ
      const targets = this.tf.where(
        dones,
        rewards,
        rewards.add(maxNextQ.mul(this.discountFactor)),
      );

      const lossTensor = this.optimizer.minimize(
        () => {
          const currentQValues = this.qNetwork.forward(states);

          const oneHotActions = this.tf.oneHot(
            actions,
            currentQValues.shape[1],
          );

          const predictedQ = currentQValues.mul(oneHotActions).sum(1);

          const tdError = targets.sub(predictedQ);

          return tdError.square().mul(isWeights).mean();
        },
        true,
        this.qNetwork.weights,
      );

      const absoluteErrors = this.tf.tidy(() => {
        const currentQValues = this.qNetwork.forward(states);

        const oneHotActions = this.tf.oneHot(actions, currentQValues.shape[1]);

        const predictedQ = currentQValues.mul(oneHotActions).sum(1);

        return targets.sub(predictedQ).abs();
      });

      const priorities = Array.from(absoluteErrors.dataSync());

      absoluteErrors.dispose();

      this.replayBuffer.updatePriorities(indices, priorities);

      const lossValue = lossTensor.dataSync()[0];

      this.lossHistory.push(lossValue);

      this.trainingStep++;

      if (this.trainingStep % this.updateFrequency === 0) {
        this.targetNetwork.loadStateDict(this.qNetwork.model.layers);
      }
    });
  }
}
