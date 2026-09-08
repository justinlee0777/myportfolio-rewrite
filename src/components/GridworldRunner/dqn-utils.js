export class DQNNetwork {
  model;

  get weights() {
    return this.model.trainableWeights.map((w) => w.val);
  }

  constructor(tf, stateDim = 3, actionDim = 4, hiddenSize = 64) {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [stateDim],
          units: hiddenSize,
          activation: 'relu',
        }),
        tf.layers.dense({
          units: hiddenSize,
          activation: 'relu',
        }),
        tf.layers.dense({
          units: actionDim,
        }),
      ],
    });
  }

  forward(x) {
    return this.model.apply(x);
  }

  loadStateDict(layers) {
    for (let i = 0; i < this.model.layers.length; i++) {
      this.model.layers[i].setWeights(layers[i].getWeights());
    }
  }
}

export class ReplayBuffer {
  buffer = [];
  capacity;

  constructor(capacity = 10000) {
    this.capacity = capacity;
  }

  add(state, action, reward, nextState, done) {
    if (this.buffer.length >= this.capacity) {
      this.buffer.shift();
    }

    this.buffer.push({
      state,
      action,
      reward,
      nextState,
      done,
    });
  }

  sample(batchSize) {
    const { length } = this.buffer;

    if (batchSize > length) {
      throw new Error('Not enough samples in replay buffer.');
    }

    const pool = Array.from({ length }, (_, i) => i);
    const states = [],
      actions = [],
      rewards = [],
      nextStates = [],
      dones = [];

    for (let i = 0; i < batchSize; i++) {
      const randIdx = Math.floor(Math.random() * (length - i)) + i;

      const temp = pool[i];
      pool[i] = pool[randIdx];
      pool[randIdx] = temp;

      const { state, action, reward, nextState, done } = this.buffer[pool[i]];

      states.push(state);
      actions.push(action);
      rewards.push(reward);
      nextStates.push(nextState);
      dones.push(done);
    }

    return [states, actions, rewards, nextStates, dones];
  }

  get size() {
    return this.buffer.length;
  }
}
