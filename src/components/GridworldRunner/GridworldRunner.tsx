import './GridworldRunner.css';

import * as tf from '@tensorflow/tfjs';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { GridWorld } from './gridworld';
import { QLearning } from './q-learning';
import { SARSA } from './sarsa';
import { TDLearning } from './td-learning';
import { Runner } from './runner';
import { DQNRunner } from './dqn-runner';
import { DQN } from './dqn';

export type Algorithm = 'td' | 'q' | 'sarsa' | 'dqn';

const AlgorithmMapping: {
  [key in Algorithm]: string;
} = {
  td: 'TD Learning',
  q: 'Q Learning',
  sarsa: 'SARSA',
  dqn: 'DQN',
};

interface Props {
  allowedAlgorithms: Set<Algorithm>;
}

export function GridworldRunner({ allowedAlgorithms }: Props) {
  const [mounted, setMounted] = useState(false);

  const [tfInitialized, setTFInitialized] = useState(false);

  const algorithms = [...allowedAlgorithms.values()];

  const [algorithm, setAlgorithm] = useState<Algorithm>(algorithms[0]);

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

  useEffect(() => {
    if (!tfInitialized) {
      async function initializeTF() {
        await tf.ready();

        setTFInitialized(true);
      }

      initializeTF();
    }
  }, [tfInitialized, setTFInitialized]);

  const policy = useMemo(() => {
    switch (algorithm) {
      default:
      case 'td':
        return new TDLearning(numStates);
      case 'q':
        return new QLearning(numStates, 4);
      case 'sarsa':
        return new SARSA(numStates, 4);
      case 'dqn':
        if (tfInitialized) {
          return new DQN(tf, 2, 4);
        }
    }
  }, [algorithm, counter, tfInitialized]);

  const environment = useMemo(() => new GridWorld(numStates, 5), [counter]);

  const runner = useMemo(() => {
    if (!policy) {
      return;
    }

    switch (algorithm) {
      case 'td':
      case 'q':
      case 'sarsa':
        return new Runner(environment, policy, true);
      case 'dqn':
        return new DQNRunner(environment, policy, true);
    }
  }, [environment, policy]);

  useEffect(() => {
    setMounted(true);

    if (!runner) {
      return;
    }

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
  }, [runner, counter, runType]);

  if (!(mounted && policy)) {
    return <p>Loading page...</p>;
  }

  let values: Array<ReactNode>;

  if ('V' in policy) {
    values = policy.V.map((value) => value.toFixed(3));
  } else if ('Q' in policy) {
    values = policy.Q.map((qValues) => (
      <>
        <div className="qValue up">{qValues[0].toFixed(3)}</div>
        <div className="qValue down">{qValues[1].toFixed(3)}</div>
        <div className="qValue left">{qValues[2].toFixed(3)}</div>
        <div className="qValue right">{qValues[3].toFixed(3)}</div>
      </>
    ));
  } else {
    values = Array.from({ length: environment.numStates }, (_, i) => {
      const qValues = policy.getQ(environment.getPos(i));

      return (
        <>
          <div className="qValue up">{qValues[0].toFixed(3)}</div>
          <div className="qValue down">{qValues[1].toFixed(3)}</div>
          <div className="qValue left">{qValues[2].toFixed(3)}</div>
          <div className="qValue right">{qValues[3].toFixed(3)}</div>
        </>
      );
    });
  }

  let state: number | undefined = undefined,
    nextState: number | undefined = undefined;

  if (sarsaResult) {
    ({ state, nextState } = sarsaResult);
  }

  return (
    <div className="gridworldRunner">
      <div className="grid">
        {Array(environment.numStates)
          .fill(undefined)
          .map((_, i) => {
            let content: ReactNode = '';

            if (i === environment.startingState) {
              content = 'St';
            } else if (i === environment.goalPos) {
              content = 'G';
            } else if (environment.pits.includes(i)) {
              content = 'P';
            }

            return (
              <div className="cell" key={i}>
                {state === i && <div className="marker">S</div>}
                {nextState === i && <div className="marker">S'</div>}
                <p>
                  <b>{content}</b>
                </p>
                <div>{values[i]}</div>
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
          {algorithms.map((algorithm) => (
            <option key={algorithm} value={algorithm}>
              {AlgorithmMapping[algorithm]}
            </option>
          ))}
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
