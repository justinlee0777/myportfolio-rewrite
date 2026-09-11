import { DQNNetwork, ReplayBuffer } from './dqn-utils';

export class DQN {
  qNetwork;
  targetNetwork;
  optimizer;
  replayBuffer;
  trainingStep = 0;
  lossHistory = [];

  constructor(
    tf,
    stateDim = 3,
    actionDim = 4,
    learningRate = 0.1,
    discountFactor = 0.99,
    explorationRate = 1,
    explorationRateMin = 0.01,
    explorationRateDecay = 0.995,
    batchSize = 128,
    updateFrequency = 1000,
  ) {
    this.tf = tf;

    this.stateDim = stateDim;
    this.actionDim = actionDim;
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.explorationRate = explorationRate;
    this.explorationRateMin = explorationRateMin;
    this.explorationRateDecay = explorationRateDecay;
    this.batchSize = batchSize;
    this.updateFrequency = updateFrequency;

    this.qNetwork = new DQNNetwork(tf, stateDim, actionDim);

    this.targetNetwork = new DQNNetwork(tf, stateDim, actionDim);

    this.targetNetwork.loadStateDict(this.qNetwork.model.layers);

    this.optimizer = tf.train.adam(learningRate);

    this.replayBuffer = new ReplayBuffer();

    this.trainingStep = 0;

    this.lossHistory = [];
  }

  remember(state, action, reward, nextState, done) {
    this.replayBuffer.add(state, action, reward, nextState, done);
  }

  train() {
    if (this.replayBuffer.size < this.batchSize) {
      return;
    }

    let [states, actions, rewards, nextStates, dones] =
      this.replayBuffer.sample(this.batchSize);

    this.tf.tidy(() => {
      states = this.tf.tensor2d(states, [states.length, this.stateDim]);
      actions = this.tf.tensor(actions, null, 'int32');
      rewards = this.tf.tensor(rewards, null, 'float32');
      nextStates = this.tf.tensor2d(nextStates, [
        nextStates.length,
        this.stateDim,
      ]);
      dones = this.tf.tensor(dones, null, 'float32');

      const targetQ = this.calculateTargetQ(rewards, nextStates, dones);

      const lossTensor = this.optimizer.minimize(
        () => {
          const qAll = this.qNetwork.forward(states);
          const actionMask = this.tf.oneHot(actions, this.actionDim);

          const qValues = qAll.mul(actionMask).sum(1);

          const loss = this.tf.losses.meanSquaredError(targetQ, qValues);

          return loss;
        },
        true,
        this.qNetwork.weights,
      );

      const lossValue = lossTensor.dataSync()[0];
      lossTensor.dispose();

      this.lossHistory.push(lossValue);

      this.trainingStep++;

      if (this.trainingStep % this.updateFrequency === 0) {
        this.targetNetwork.loadStateDict(this.qNetwork.model.layers);
      }
    });
  }

  calculateTargetQ(rewards, nextStates, dones) {
    return this.tf.tidy(() => {
      const nextQValues = this.targetNetwork.forward(nextStates);
      const maxNextQ = nextQValues.max(1);

      const notDones = this.tf.scalar(1.0).sub(dones);

      return rewards.add(maxNextQ.mul(this.discountFactor).mul(notDones));
    });
  }

  getQ(state) {
    state = this.tf.tensor([state]);
    const qValues = this.qNetwork.forward(state);
    return qValues.arraySync()[0];
  }

  selectAction(state, training = true) {
    if (training && Math.random() < this.explorationRate) {
      return Math.floor(Math.random() * this.actionDim);
    } else {
      const qValues = this.qNetwork.forward(this.tf.tensor([state]));

      return qValues.argMax(1).dataSync()[0];
    }
  }

  decayExploration() {
    this.explorationRate = Math.max(
      this.explorationRateMin,
      this.explorationRate * this.explorationRateDecay,
    );
  }
}
