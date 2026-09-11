'use client';

import { GridworldRunner } from '@/components/GridworldRunner/GridworldRunner';

export function DQNPage() {
  return (
    <div className="articlePage">
      <GridworldRunner
        allowedAlgorithms={new Set(['dqn', 'double dqn', 'per dqn'])}
      />
    </div>
  );
}
