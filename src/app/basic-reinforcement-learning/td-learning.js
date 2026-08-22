export class TDLearning {
  V;
  learningRate;
  discountFactor;
  explorationRate;
  explorationMin;

  constructor(
    numStates,
    learningRate = 0.1,
    discountFactor = 0.99,
    explorationRate = 1,
    explorationMin = 0.01,
  ) {
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.explorationRate = explorationRate;
    this.explorationMin = explorationMin;

    this.V = Array(numStates ** 2).fill(0);
  }

  selectAction(state, env, training = true) {
    const { numActions } = env;

    if (training && Math.random() < this.explorationRate) {
      return Math.floor(Math.random() * numActions);
    } else {
      let action = 0,
        maxReward = -Infinity;

      for (let i = 0; i < numActions; i++) {
        const { state: nextState, reward, done } = env.step(state, i);

        let lookaheadReward;

        if (done) {
          lookaheadReward = reward;
        } else {
          lookaheadReward = this.discountFactor * this.V[nextState];
        }

        if (lookaheadReward > maxReward) {
          action = i;
          maxReward = lookaheadReward;
        }
      }

      return action;
    }
  }

  learn({ state, reward, done }, nextState) {
    let target;
    if (done) {
      target = reward;
    } else {
      target = reward + this.discountFactor * this.V[nextState];
    }

    const error = target - this.V[state];

    // V(s) ← V(s) + α[r + γV(s') - V(s)]
    this.V[state] += this.learningRate * error;
  }

  decayExploration() {
    this.explorationRate = Math.max(
      this.explorationMin,
      this.explorationRate * 0.995,
    );
  }
}
