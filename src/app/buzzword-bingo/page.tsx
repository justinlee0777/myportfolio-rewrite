import './page.css';

import { Metadata } from 'next';

import { BuzzwordBingo } from './BuzzwordBingoClient';

export const metadata: Metadata = {
  title: 'Buzzword Bingo Generator',
  description: 'Web app to generate buzzword bingo sheets.',
};

export default function BuzzwordBingoPage() {
  return (
    <div className="buzzwordBingoContent">
      <h1>Buzzword bingo</h1>
      <main>
        <BuzzwordBingo
          defaultFiles={[
            {
              name: 'Baseball',
              path: '/bingosheets/baseball-bingo.txt',
            },
            {
              name: 'Key and Peele',
              path: '/bingosheets/key-peele-bingo.txt',
            },
          ]}
        />
      </main>
    </div>
  );
}
