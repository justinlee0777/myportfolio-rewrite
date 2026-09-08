export class DQNRunner {
  environment;
  policy;
  training;

  constructor(environment, policy, training = false) {
    this.environment = environment;
    this.policy = policy;
    this.training = training;
  }

  *step() {
    for (let i = 0; i < 5000; i++) {
      let state = this.environment.startingState,
        done = false,
        totalReward = 0;

      for (let j = 0; j < 300; j++) {
        const action = this.policy.selectAction(
          this.environment.getPos(state),
          this.training,
        );

        const result = this.environment.step(state, action);

        const { state: nextState, reward } = result;

        ({ done } = result);

        const nextAction = this.policy.selectAction(
          this.environment.getPos(nextState),
          this.training,
        );

        yield { state, action, reward, nextState, nextAction };

        this.policy.remember(
          this.environment.getPos(state),
          action,
          reward,
          this.environment.getPos(nextState),
          done,
        );

        state = nextState;

        totalReward += reward;

        this.policy.train();

        if (done) {
          break;
        }
      }

      this.policy.decayExploration();
    }
  }
}
