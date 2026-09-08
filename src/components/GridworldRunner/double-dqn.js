import { DQN } from './dqn';

export class DoubleDQN extends DQN {
  calculateTargetQ(rewards, nextStates, dones) {
    return this.tf.tidy(() => {
      const nextQValues = this.qNetwork.forward(nextStates);

      const nextActions = nextQValues.argMax(1);

      const nextQTarget = this.targetNetwork.forward(nextStates);

      const actionMask = this.tf.oneHot(nextActions, this.actionDim);

      const nextQ = nextQTarget.mul(actionMask).sum(1);

      const notDones = this.tf.scalar(1.0).sub(dones);

      return rewards.add(nextQ.mul(this.discountFactor).mul(notDones));
    });
  }
}
