import './page.css';

import type { Metadata } from 'next';
import { AuthorMapClient } from './AuthorMapClient';
import {
  Author,
  AuthorGroup,
  AuthorMapProps,
  BirthEvent,
  CityCoordinates,
  DeathEvent,
  MajorEvent,
  MilestoneEvent,
  TimelineEvent,
} from 'author-map-ui/models';

export const metadata: Metadata = {
  title: 'Author Map',
  description: 'Interactive map of American literature.',
};

export default async function AuthorMapPage() {
  const json: {
    authors: Array<Author>;
    birthEvents: Array<BirthEvent>;
    deathEvents: Array<DeathEvent>;
    milestoneEvents: Array<MilestoneEvent>;
    timelineEvents: Array<TimelineEvent>;
    cityCoordinates: Array<CityCoordinates>;
    majorEvents: Array<MajorEvent>;
    stateCensus: AuthorMapProps['stateCensus'];
    entriesIntoUnion: AuthorMapProps['entriesIntoUnion'];
    authorGroups: Array<AuthorGroup>;
  } = (await import('../../../data/author-map/data.json')) as any;

  const {
    authors,
    authorGroups,
    birthEvents,
    deathEvents,
    milestoneEvents,
    timelineEvents,
    majorEvents,
    cityCoordinates,
    stateCensus,
    entriesIntoUnion,
  } = json;

  return (
    <div className="authorMapPage">
      <AuthorMapClient
        authors={authors}
        groups={authorGroups}
        timeline={[
          ...birthEvents,
          ...deathEvents,
          ...milestoneEvents,
          ...timelineEvents,
          ...majorEvents,
        ]}
        cityCoordinates={cityCoordinates}
        stateCensus={stateCensus}
        entriesIntoUnion={entriesIntoUnion}
      />
    </div>
  );
}
