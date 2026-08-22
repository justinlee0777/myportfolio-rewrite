export class SARSA {
  Q;
  learningRate;
  discountFactor;
  explorationRate;
  explorationMin;

  constructor(
    numStates,
    numActions,
    learningRate = 0.1,
    discountFactor = 0.99,
    explorationRate = 1,
    explorationMin = 0.01,
  ) {
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.explorationRate = explorationRate;
    this.explorationMin = explorationMin;

    this.Q = Array(numStates ** 2)
      .fill(undefined)
      .map(() => Array(numActions).fill(0));
  }

  selectAction(state, env, training = true) {
    const { numActions } = env;

    if (training && Math.random() < this.explorationRate) {
      return Math.floor(Math.random() * numActions);
    } else {
      let action = 0,
        maxReward = -Infinity;

      for (let i = 0; i < numActions; i++) {
        const value = this.Q[state][i];

        if (value > maxReward) {
          action = i;
          maxReward = value;
        }
      }

      return action;
    }
  }

  learn({ action, state, reward, done }, nextState, nextAction) {
    let nextQ;

    if (done) {
      nextQ = 0;
    } else {
      nextQ = this.Q[nextState][nextAction];
    }

    const error = reward + this.discountFactor * nextQ - this.Q[state][action];

    // Q(s,a) ← Q(s,a) + α[r + γ Q(s',a') - Q(s,a)]
    this.Q[state][action] += this.learningRate * error;
  }

  decayExploration() {
    this.explorationRate = Math.max(
      this.explorationMin,
      this.explorationRate * 0.995,
    );
  }
}
