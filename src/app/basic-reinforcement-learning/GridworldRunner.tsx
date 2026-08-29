import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { GridWorld } from './gridworld';
import { QLearning } from './q-learning';
import { SARSA } from './sarsa';
import { TDLearning } from './td-learning';
import { Runner } from './run-algorithm';

interface Props {}

const actionMap: Record<number, string> = {
  0: 'Up',
  1: 'Down',
  2: 'Left',
  3: 'Right',
};

export function GridworldRunner({}: Props) {
  const [mounted, setMounted] = useState(false);

  const [algorithm, setAlgorithm] = useState<'td' | 'q' | 'sarsa'>('td');

  const [runType, setRunType] = useState<'runSequence' | 'runAll'>(
    'runSequence',
  );

  const [counter, setCounter] = useState(0);

  const counterLimit = 10;

  const [sarsaResult, setSARSAResult] = useState<{
    state: number;
    action: number;
    reward: number;
    nextState: number;
    nextAction: number;
  } | null>();

  const numStates = 6;

  const policy = useMemo(() => {
    switch (algorithm) {
      default:
      case 'td':
        return new TDLearning(numStates);
      case 'q':
        return new QLearning(numStates, 4);
      case 'sarsa':
        return new SARSA(numStates, 4);
    }
  }, [algorithm, counter]);

  const environment = useMemo(() => new GridWorld(numStates, 5), [counter]);

  useEffect(() => {
    setMounted(true);

    const runner = new Runner(environment, policy, true);

    const generator = runner.step();

    let isCurrent = true;

    (async () => {
      let result = generator.next();

      while (!result.done && isCurrent) {
        setSARSAResult(result.value);

        if (runType === 'runSequence') {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        result = generator.next();
      }
    })();

    return () => {
      generator.return(undefined);
      isCurrent = false;
    };
  }, [policy, environment, counter, runType]);

  if (!mounted) {
    return <p>Loading page...</p>;
  }

  let values: Array<string>;

  if ('V' in policy) {
    values = policy.V.map((value) => value.toFixed(3));
  } else {
    values = policy.Q.map((qValues) =>
      qValues
        .map((value, action) => `${actionMap[action]}: ${value.toFixed(3)}`)
        .join(', '),
    );
  }

  let state: number | undefined = undefined,
    nextState: number | undefined = undefined;

  if (sarsaResult) {
    ({ state, nextState } = sarsaResult);
  }

  return (
    <div className="gridContainer">
      <div className="grid">
        {Array(environment.numStates)
          .fill(undefined)
          .map((_, i) => {
            let content: ReactNode = '';

            if (i === environment.startingState) {
              content = 'Start';
            } else if (i === environment.goalPos) {
              content = 'Goal';
            } else if (environment.pits.includes(i)) {
              content = 'Pit';
            }

            return (
              <div className="cell" key={i}>
                {state === i && <div className="marker">S</div>}
                {nextState === i && <div className="marker">S'</div>}
                <p>{content}</p>
                <p>{values[i]}</p>
              </div>
            );
          })}
      </div>

      <div className="gridActions">
        <button
          onClick={() => setCounter((current) => (current + 1) % counterLimit)}
        >
          Reset
        </button>
        <select
          value={algorithm}
          onChange={(event) => setAlgorithm(event.target.value as any)}
        >
          <option value="td">TD Learning</option>
          <option value="q">Q Learning</option>
          <option value="sarsa">SARSA</option>
        </select>
        <select
          value={runType}
          onChange={(event) => setRunType(event.target.value as any)}
        >
          <option value="runSequence">Run sequentially</option>
          <option value="runAll">Run all at once</option>
        </select>
      </div>
      <p>Exploration decay (or ε): {policy.explorationRate.toFixed(3)}</p>
    </div>
  );
}
