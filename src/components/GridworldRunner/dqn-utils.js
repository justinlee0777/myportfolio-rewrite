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

class SumTree {
  constructor(capacity = 10000) {
    this.capacity = capacity;
    this.tree = new Float64Array(2 * capacity - 1);
    this.data = new Array(capacity);
    this.writePointer = 0;
    this.size = 0;
  }

  add(priority, data) {
    const i = this.writePointer + this.capacity - 1;
    this.data[this.writePointer] = data;
    this.update(i, priority);

    this.writePointer = (this.writePointer + 1) % this.capacity;
    if (this.size < this.capacity) {
      this.size++;
    }
  }

  update(i, priority) {
    const change = priority - this.tree[i];
    this.tree[i] = priority;

    let parent = Math.floor((i - 1) / 2);

    while (i > 0) {
      this.tree[parent] += change;
      i = parent;
      parent = Math.floor((i - 1) / 2);
    }
  }

  getLeaf(v) {
    let parent = 0;

    while (true) {
      const left = 2 * parent + 1;
      const right = left + 1;

      if (left >= this.tree.length) {
        break;
      }

      if (v <= this.tree[left]) {
        parent = left;
      } else {
        v -= this.tree[left];
        parent = right;
      }
    }

    const i = parent - this.capacity + 1;
    return {
      index: parent,
      priority: this.tree[parent],
      data: this.data[i],
    };
  }

  get totalPriority() {
    return this.tree[0];
  }
}

export class PrioritizedReplayBuffer {
  constructor(capacity, alpha = 0.6, beta = 0.4, betaIncrement = 0.001) {
    this.tree = new SumTree(capacity);
    this.alpha = alpha; // How much prioritization to use (0 = uniform, 1 = full)
    this.beta = beta; // Importance sampling correction factor
    this.betaIncrement = betaIncrement;
    this.epsilon = 0.01; // Small constant to avoid zero priority
    this.maxPriority = 1.0; // Initial priority for new elements
  }

  get size() {
    return this.tree.size;
  }

  add(experience) {
    this.tree.add(this.maxPriority, experience);
  }

  sample(batchSize) {
    const batch = [];
    const indices = [];
    const weights = new Float64Array(batchSize);

    const totalPriority = this.tree.totalPriority;
    const segment = totalPriority / batchSize;

    // Increment beta towards 1.0 as training progresses
    this.beta = Math.min(1.0, this.beta + this.betaIncrement);

    // Calculate max weight for normalization
    const minProb = this.epsilon ** this.alpha / totalPriority;
    const maxWeight = (1 / (this.tree.size * minProb)) ** this.beta;

    for (let i = 0; i < batchSize; i++) {
      const a = segment * i;
      const b = segment * (i + 1);
      const value = Math.random() * (b - a) + a;

      const { index, priority, data } = this.tree.getLeaf(value);

      batch.push(data);
      indices.push(index);

      // Compute Importance Sampling (IS) weight to fix bias
      const samplingProb = priority / totalPriority;
      let weight = (1 / (this.tree.size * samplingProb)) ** this.beta;
      weights[i] = weight / maxWeight; // Normalized weight
    }

    return { batch, indices, weights };
  }

  updatePriorities(indices, errors) {
    for (let i = 0; i < indices.length; i++) {
      const clippedError = Math.abs(errors[i]) + this.epsilon;
      const priority = clippedError ** this.alpha;

      this.tree.update(indices[i], priority);
      this.maxPriority = Math.max(this.maxPriority, priority);
    }
  }
}
