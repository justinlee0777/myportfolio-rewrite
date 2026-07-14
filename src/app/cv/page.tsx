import { Fragment } from 'react';
import './page.css';
import { Projects } from './Projects';

interface CVEntry {
  year: number;
  events: Array<string>;
}

const entries: Array<CVEntry> = [
  {
    year: 2025,
    events: [
      `Began studying for the GRE to pursue Master's in Computer Science`,
      `Enrolled into the City College of New York`,
      `Debut release of Oklou's "choke enough"`,
    ],
  },
  {
    year: 2023,
    events: [
      'Affected by SAP layoff',
      'Fullstack Engineer at startup Distro',
      `Debut release of Hotline TNT's "Cartwheel"`,
    ],
  },
  {
    year: 2021,
    events: [
      'Undertook training for Scrum Master and received certification for level I',
      'James Webb Telescope is launched',
      `Debut release of Turnstile's "GLOW ON"`,
    ],
  },
  {
    year: 2017,
    events: [
      'Unbound Commerce MA team "Acqui-hired" by SAP to develop Upscale Commerce',
      'Frontend Engineer at SAP in Boston, MA',
      'The Great American Eclipse',
      `Debut release of Jay-Z's "4:44"`,
    ],
  },
  {
    year: 2016,
    events: [
      'Graduated Rensselaer Polytechnic Institute',
      'Full-stack Engineer at Unbound Commerce in Newton, MA',
      'Election of Donald Trump',
      'The 2016 Rio De Janeiro Olympics',
      `Debut release of David Bowie's "★"`,
    ],
  },
  {
    year: 2012,
    events: [
      'Took Computer Graphics, using OpenGL',
      'Admitted into Rensselaer Polytechnic Institute',
      `NASA's Curiosity Rover lands on Mars`,
      'The world ends, as the Mayans in their wisdom predicted',
      `Debut release of Fiona Apple's "The Idler Wheel ... +20 other words"`,
    ],
  },
  {
    year: 2011,
    events: [
      `Began AP Java, where I learned Java and developed my first video game`,
      `The formal release of Minecraft`,
      `Debut release of Destroyer's "Kaputt"`,
    ],
  },
  {
    year: 2010,
    events: [
      `Created computer animations using Alice`,
      `The first successful trapping of antimatter`,
      `Debut release of "Chuck Person's Eccojam's Vol. 1"`,
    ],
  },
  {
    year: 2008,
    events: [
      `Begin attendance at the Bronx High School of Science`,
      `Election of Barack Obama`,
      `The 2008 Beijing Olympics`,
      `Debut release of Kanye West's "808s & Heartbreak"`,
    ],
  },
  {
    year: 1994,
    events: [
      `I'm born. Yaaaay`,
      'The Playstation is born',
      `Debut release of Hole's "Live Through This"`,
    ],
  },
];

export default function CVPage() {
  const entryClassName = 'timelineEntry';

  return (
    <div className="cvPage">
      <div className="timelineEntries">
        {entries.map(({ year, events }) => {
          return (
            <div className={entryClassName} key={year} data-year={year}>
              <h4 className="timelineYear">{year}</h4>
              <div className="timelineBullet"></div>
              {events.map((event, i) => {
                return (
                  <Fragment key={i}>
                    <div className="timelineBisector"></div>
                    <div className="timelineDetails">{event}</div>
                  </Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
      <Projects entrySelector={`.${entryClassName}`} />
    </div>
  );
}
