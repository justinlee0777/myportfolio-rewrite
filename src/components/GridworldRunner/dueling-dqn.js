import { DQN } from './dqn';
import { DuelingDQNNetwork } from './dqn-utils';

export class DuelingDQN extends DQN {
  constructor(tf, stateDim = 3, actionDim = 4, ...args) {
    super(tf, stateDim, actionDim, ...args);

    this.qNetwork = new DuelingDQNNetwork(tf, stateDim, actionDim);

    this.targetNetwork = new DuelingDQNNetwork(tf, stateDim, actionDim);

    this.targetNetwork.loadStateDict(this.qNetwork.model.layers);
  }
}
