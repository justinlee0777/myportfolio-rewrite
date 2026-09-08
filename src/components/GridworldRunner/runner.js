export class Runner {
  environment;
  policy;
  training;

  constructor(environment, policy, training = false) {
    this.environment = environment;
    this.policy = policy;
    this.training = training;
  }

  *step() {
    for (let i = 0; i < 500; i++) {
      let state = this.environment.startingState,
        done = false,
        totalReward = 0;

      for (let j = 0; j < 300; j++) {
        const action = this.policy.selectAction(
          state,
          this.environment,
          this.training,
        );

        const result = this.environment.step(state, action);

        const { state: nextState, reward } = result;

        ({ done } = result);

        const nextAction = this.policy.selectAction(
          state,
          this.environment,
          this.training,
        );

        yield { state, action, reward, nextState, nextAction };

        this.policy.learn(
          { state, action, reward, done },
          nextState,
          nextAction,
        );

        state = nextState;

        totalReward += reward;

        if (done) {
          break;
        }
      }

      this.policy.decayExploration();
    }
  }
}
