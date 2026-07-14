import './page.css';
import { Projects } from './Projects';
import { TimelineEntries } from './TimelineEntries';

export default function CVPage() {
  const entryClassName = 'timelineEntry';

  return (
    <div className="cvPage">
      <TimelineEntries classes={{ entry: entryClassName }} />
      <Projects entrySelector={`.${entryClassName}`} />
    </div>
  );
}
