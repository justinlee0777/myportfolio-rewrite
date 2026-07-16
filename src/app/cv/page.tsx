import './page.css';

import type { Metadata } from 'next';

import { Projects } from './Projects';
import { TimelineEntries } from './TimelineEntries';

export const metadata: Metadata = {
  title: 'Curriculum Vitae',
  description: `Some stuff I've done.`,
};

export default function CVPage() {
  const entryClassName = 'timelineEntry';

  return (
    <div className="cvPage">
      <h1>Curriculum vitae</h1>
      <TimelineEntries classes={{ entry: entryClassName }} />
      <Projects entrySelector={`.${entryClassName}`} />
    </div>
  );
}
