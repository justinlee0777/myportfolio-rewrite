import './homepage.css';

import { type JSX, useMemo } from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';

interface BaseProject {
  description: string;
  header: string;
  url: string;
}

interface ArticleProject extends BaseProject {}

interface ProjectWithImage extends BaseProject {
  thumbnail: string;
  imageAlt: string;
}

type Project = ArticleProject | ProjectWithImage;

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
      {
        header: 'Rewriting the Site',
        description: `I discuss the process of rewriting the site, which, though not difficult, involved more thought than I realized.`,
        url: '/rewriting-the-site',
      },
      {
        header: `Thoughts on the Gang of Four's Design Patterns`,
        description: `A reflection on the Gang of Four's Object-Oriented Design Patterns in the modern world.`,
        url: '/gang-of-four-design-patterns',
      },
      {
        header: `The Observer Pattern`,
        description: `Taking a stab at writing about the Observer Pattern, from the Gang of Four's (in)famous Design Patterns.`,
        url: '/observer-pattern',
      },
      {
        header: 'Knuth on Trees',
        description: `We have some fun with Donald Knuth's discussion on Trees in his famous Art of Computer Programming.`,
        url: '/knuth-on-trees',
      },
    ];
  }, []);

  return (
    <>
      <div className="projects">
        <h1>
          I'm Justin Lee. Deque University says I need an H1 here. This is that.
        </h1>
        {projects.map((project) => {
          const { header, description, url } = project;

          let thumbnail: JSX.Element | undefined;

          if ('thumbnail' in project) {
            thumbnail = (
              <Image
                width={200}
                height={150}
                src={project.thumbnail}
                alt={project.imageAlt}
                loading="eager"
                unoptimized
              />
            );
          }

          return (
            <Link key={header} className="project" href={url}>
              {thumbnail}
              <h2>{header}</h2>
              <p>{description}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
