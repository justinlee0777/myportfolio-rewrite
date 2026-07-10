import './homepage.css';

import { useMemo } from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';

interface Project {
  description: string;
  header: string;
  thumbnail: string;
  url: string;
  imageAlt: string;
}

export const metadata: Metadata = {
  title: "Justin Lee's bag of stuff",
  description: 'A bag of web dev stuff by Justin Lee.',
};

export default function Home() {
  const projects: Array<Project> = useMemo(() => {
    return [
      {
        header: 'Author Map',
        thumbnail: '/projects/author-map.gif',
        description: 'Project for documenting American literary history.',
        imageAlt: 'A gif depicting the interactive author map.',
        url: '/author-map',
      },
      {
        header: 'Prospero',
        thumbnail: '/projects/prospero.gif',
        description: 'Render text on the web as a book.',
        url: '/prospero',
        imageAlt: 'A gif of flipping pages through Prospero.',
      },
      {
        header: 'Picture-in-Picture JS',
        thumbnail: '/projects/picture-in-picture-js.gif',
        description: 'Render media on a webpage in a draggable overlay.',
        url: '/picture-in-picture-js',
        imageAlt:
          'A gif of the picture-in-picture-js creating an overlay and moving said overlay.',
      },
      {
        header: 'Buzzword Bingo',
        thumbnail: '/projects/buzzword-bingo.png',
        description:
          'Library that takes in bingo cells and renders them as a bingosheet.',
        url: '/buzzword-bingo',
        imageAlt: 'A static image of a Buzzword Bingo sheet.',
      },
    ];
  }, []);

  return (
    <div className="projects">
      {projects.map(({ header, thumbnail, description, url, imageAlt }) => {
        return (
          <a key={header} className="project" href={url}>
            <Image
              width={200}
              height={150}
              src={thumbnail}
              alt={imageAlt}
              loading="eager"
            />
            <h4>{header}</h4>
            <p>{description}</p>
          </a>
        );
      })}
    </div>
  );
}
