'use client';

import { Fragment, useState } from 'react';

import type { JSX, ReactNode } from 'react';

interface YoutubePlayerTrigger {
  type: 'youtubePlayerTrigger';
  link: string;
  text: string;
}

type EntryType = YoutubePlayerTrigger;

interface CVEntry {
  year: number;
  events: Array<string | EntryType>;
}

const entries: Array<CVEntry> = [
  {
    year: 2025,
    events: [
      `Began studying for the GRE to pursue Master's in Computer Science`,
      `Enrolled into the City College of New York`,
      {
        text: `Debut release of Oklou's "choke enough"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/NQEI03FlJjw?si=fr8eYdFSwILU2Otu',
      },
    ],
  },
  {
    year: 2023,
    events: [
      'Affected by SAP layoff',
      'Fullstack Engineer at startup Distro',
      {
        text: `Debut release of Hotline TNT's "Cartwheel"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/jRvJCORiRc4?si=AXTp3APOWV91Mbt8',
      },
    ],
  },
  {
    year: 2021,
    events: [
      'Undertook training for Scrum Master and received certification for level I',
      'James Webb Telescope is launched',
      {
        text: `Debut release of Low's "HEY WHAT"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/sebDnwlEnPs?si=bxrck3f6-axgQQUW',
      },
    ],
  },
  {
    year: 2017,
    events: [
      'Unbound Commerce MA team "Acqui-hired" by SAP to develop Upscale Commerce',
      'Frontend Engineer at SAP in Boston, MA',
      'The Great American Eclipse',
      {
        text: `Debut release of Jlin's "Black Origami"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/VLBBQA7thBU?si=9gkolirGR2DyPDz0',
      },
    ],
  },
  {
    year: 2016,
    events: [
      'Graduated Rensselaer Polytechnic Institute',
      'Full-stack Engineer at Unbound Commerce in Newton, MA',
      'Election of Donald Trump',
      'The 2016 Rio De Janeiro Olympics',
      {
        text: `Debut release of Angel Olsen's "MY WOMAN"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/OfdTo4wLFM4?si=bdNwynquD1AYmV6I',
      },
    ],
  },
  {
    year: 2012,
    events: [
      'Took Computer Graphics, using OpenGL',
      'Admitted into Rensselaer Polytechnic Institute',
      `NASA's Curiosity Rover lands on Mars`,
      'The world ends, as the Mayans in their wisdom predicted',
      {
        text: `Debut release of Ty Segall Band's "Slaughterhouse"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/_9uAKdkWuhU?si=rfHBq0FK-3JUVasK',
      },
    ],
  },
  {
    year: 2011,
    events: [
      `Began AP Java, where I learned Java and developed my first video game`,
      `The formal release of Minecraft`,
      {
        text: `Debut release of Atlas Sound's "Parallax"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/bLtzyDhxsRk?si=ZWvJqEqI7cqNgMQF',
      },
    ],
  },
  {
    year: 2010,
    events: [
      `Created computer animations using Alice`,
      `The first successful trapping of antimatter`,
      {
        text: `Debut release of "Chuck Person's Eccojam's Vol. 1"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/unN7QvSWSTo?si=DRKykC-932uhdmmO',
      },
    ],
  },
  {
    year: 2008,
    events: [
      `Begin attendance at the Bronx High School of Science`,
      `Election of Barack Obama`,
      `The 2008 Beijing Olympics`,
      {
        text: `Debut release of Flying Lotus's "Los Angeles"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/fS7XPtFTvb8?si=bSGr-LLcBMdvRy5E',
      },
    ],
  },
  {
    year: 1994,
    events: [
      `I'm born. Yaaaay`,
      'The Playstation is born',
      {
        text: `Debut release of Nas's "Illmatic"`,
        type: 'youtubePlayerTrigger',
        link: 'https://www.youtube.com/embed/e5PnuIRnJW8?si=LkdZYhxOGSAU5fWs',
      },
    ],
  },
];

interface Props {
  classes?: {
    entry?: string;
  };
}

export function TimelineEntries({ classes }: Props): JSX.Element {
  const [youtubeVideo, setYoutubeVideo] = useState(
    'https://www.youtube.com/embed/LB5YkmjalDg?si=RkC90Yxw8IkcTKEQ',
  );

  return (
    <>
      <div className="timelineEntries">
        {entries.map(({ year, events }) => {
          return (
            <div className={classes?.entry} key={year} data-year={year}>
              <h2 className="timelineYear">{year}</h2>
              <div className="timelineBullet"></div>
              {events.map((event, i) => {
                let detailsElement: ReactNode;

                if (typeof event === 'string') {
                  detailsElement = event;
                } else {
                  detailsElement = (
                    <button onClick={() => setYoutubeVideo(event.link)}>
                      {event.text}
                    </button>
                  );
                }

                return (
                  <Fragment key={i}>
                    <div className="timelineBisector"></div>
                    <div className="timelineDetails">{detailsElement}</div>
                  </Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
      <iframe
        className="videoPlayer"
        src={youtubeVideo}
        title="YouTube video player"
        aria-hidden
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </>
  );
}
