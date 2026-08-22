import { Metadata } from 'next';

import BasicReinforcementLearningPage from './BasicReinforcementLearningPage';

export const metadata: Metadata = {
  title: `Basic Reinforcement Learning`,
  description: `We have some fun with touching on some simple reinforcement learning algorithms.`,
};

export default async function Page() {
  return <BasicReinforcementLearningPage />;
}
