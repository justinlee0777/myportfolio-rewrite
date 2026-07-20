'use client';

import clsx from 'clsx';
import { useEffect, useState, type JSX } from 'react';

interface ProjectEntry {
  name: string;
  description: string;
  period: {
    start: number;
    end?: number;
  };
  responsibilities: Array<string>;
  tools: Array<string>;

  employer?: string;
}

const projects: Array<ProjectEntry> = [
  {
    name: 'Apptive',
    description:
      'Apptive was an e-commerce platform for small merchants to build online stores for Android and iOS. Merchants configured their apps via a merchant dashboard.',
    period: {
      start: 2016,
      end: 2017,
    },
    responsibilities: [
      'Fixed bugs and implemented feature on iOS app',
      'Built the redesigned merchant dashboard where users configured flash sales, notifications, their Shopify integrations, etc.',
    ],
    tools: ['Swift', 'Javascript / HTML / CSS', 'AngularJS'],
    employer: 'Unbound Commerce',
  },
  {
    name: 'Verify.Ninja',
    description:
      'Verify.Ninja was a dashboard for checking e-cigarette age restrictions for online purchases.',
    period: {
      start: 2016,
      end: 2017,
    },
    responsibilities: [
      'Built the Java Spring server to handle the processing of orders and license verification',
      'Built the merchant dashboard where IDs were verified for their age',
      'Honestly did a terrible job LOL; all-time fails include: - Using a Map for storing data; - Not paginating data on the frontend',
    ],
    tools: ['Java', 'Java Spring', 'Javascript / HTML / CSS', 'AngularJS'],
    employer: 'Unbound Commerce',
  },
  {
    name: 'Upscale Commerce',
    description: `Upscale Commerce was an e-commerce platform serving SAP's mid-sized businesses with mobile solutions. It began with Android and iOS apps and then transitioned into a Progressive Web App for the storefront.`,
    period: {
      start: 2017,
      end: 2023,
    },
    responsibilities: [
      'Built the merchant dashboard where users configured the look-and-feel of their apps as well as their inventory and payment systems',
      'Built the Progressive Web App where customers browsed products and checked out carts',
      'Ensured the PWA followed responsive / mobile design.',
      'Ensured the PWA was SEO-friendly',
      'Debugged the PWA for performance issues and went on many a rabbit hole on this',
      'Planned features with product owners and UI designers',
      'Managed a team of ~8-9 as Scrum Master as well as coordinating work on the merchant dashboard with international teams',
      'Pretty much the on-call guy...',
      'Wrote formal documentation for every little feature of the app, such as how to implement custom components',
      'Was release manager, basically',
      'Unit testing...',
      'Maintenance tasks i.e. upgraded Angular, handled Artifactory',
      'Monitored SonarQube, Checkmarx, other quality tools to ensure we were meeting KPIs',
      `I did everything ok lol. It was a fun job. Only thing I didn't do was system architecture, which was a beast given how big the system had gotten`,
    ],
    tools: [
      'Javascript / HTML / CSS',
      'Angular 2+',
      'Angular Universal',
      'Git',
      'Jenkins',
    ],
    employer: 'SAP',
  },
  {
    name: 'Distro',
    description:
      'Distro was a platform for HVAC manufacturers. One product streamlined cooler questionnaires, handling contractor needs so that they can get a quote on the product they needed. Another was a knowledge chatbot for new environmental regulations for coolers.',
    period: {
      start: 2023,
      end: 2024,
    },
    responsibilities: [
      'Pretty much designed / redesigned the Next.js platform. It was in a bad shape and I gave it structure',
      `Built the HVAC questionnaire that 1. took contractors' prompts 2. fed them into product calculators 3. compared the results with one another 4. prepared quotes for the coolers a contractor would want 5. sent the quote`,
      `Built the knowledge chatbot that answered prompts concerning contractors' questions on EPA regulations and designed the system to embed it on third-party sites`,
      `Built a chatbot that took users' responses and fed them to the above questionnaire`,
      `Built a knowledge ingestion pipeline to absorb a bunch of HVAC documents (literally in the thousands) so that the chatbots can answer nuanced questions on manufacturing (didn't really work because of the randomness of the chatbots but it was a neat pipeline to see in execution)`,
      `Oh and built and designed the web scrapes to get all those documents; the scrapes were in woefully bad shape before I got there, thank goodness I know web so well`,
      `Built a RAG evaluation system to judge the quality of the knowledge chunks in the system`,
      `Mentored interns, with some good and some bad advice in hindsight to be honest`,
    ],
    tools: [
      'Javascript / HTML / CSS',
      'React',
      'Next.js',
      'AWS Batch',
      'MongoDB',
      'Playwright',
      'Node.js',
    ],
    employer: 'Distro',
  },
  {
    name: 'Blog',
    description: `I'm a big lover of art like literature and music so I spun up a blog. It began with a tongue-in-cheek title like popularthoughts.blog then moved to jayleewriter.com when I decided to self-publish some books.`,
    period: {
      start: 2020,
    },
    responsibilities: [
      'Began with a Gatsby project because static-generated content was the way to go for SEO and performance',
      `Then moved to Next.js static site generator after Gatsby's decline in popularity and also kinda suckiness`,
    ],
    tools: ['Gatsby', 'Next.js'],
  },
  {
    name: 'This site',
    description: `This is my tech-oriented site. There's sadly not much on it.`,
    period: {
      start: 2023,
    },
    responsibilities: [
      'Developed this site in 2023',
      'Tinkered with AWS a lot to generate random facts daily',
      'Redesigned this site with more knowledge in React with the intent of making the architecture neater and planning for theming first',
    ],
    tools: ['Next.js', 'AWS (Lambda, DynamoDB, EC2, blah)'],
  },
  {
    name: 'Prospero',
    description: `prospero is a cute little package to render web content as a book. It's not in React; it's vanilla. For most content you can use the FlexibleBook, which will adjust to the size of the screen; for very long content like novels, prosper can run on node and divide text ahead of time for performance reasons. The next step for prospero is to expand its library.`,
    period: {
      start: 2023,
    },
    responsibilities: [
      'Developed prospero with performance in mind ex. designing it with generators, ensuring it works on Node',
      `Broke the package into modules so clients don't have to download every bit of code`,
      'Developed picture-in-picture-js to solve the problem of prospero needing to show media across pages',
    ],
    tools: ['Node.js', 'Rollup'],
  },
  {
    name: 'Author Map',
    description: `The author map is an attempt to build a literary map of America. It pulls from lists of publishers, award winners and offices to find writers of non-genre fiction and places them in a certain time period and place. The intent of the map is to analyze how Americans perceive literature and to question what comprises America's literary identity.`,
    period: {
      start: 2025,
    },
    responsibilities: [
      'Developed the three views of the map: the actual Map, a list view and a timeline view',
      'Used Playwright to automate the scraping of data',
      'Using Vite to package the whole thing as an NPM package which, I should really do that for prospero, rollup sucks',
    ],
    tools: ['Playwright', 'React', 'Vite', 'Node.js'],
  },
];

interface Props {
  entrySelector: string;

  className?: string;
}

export function Projects({ entrySelector, className }: Props): JSX.Element {
  const [onscreenElements, setOnscreenElements] = useState<Set<HTMLElement>>(
    new Set(),
  );

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        setOnscreenElements((currentElements) => {
          const newElements = new Set(currentElements);

          for (const entry of entries) {
            const entryTarget = entry.target as HTMLElement;

            if (entry.isIntersecting) {
              newElements.add(entryTarget);
            } else {
              newElements.delete(entryTarget);
            }
          }

          return newElements;
        });
      },
      { threshold: 0.5 },
    );

    const timelineEntries = document.querySelectorAll(entrySelector);

    timelineEntries.forEach((entry) => intersectionObserver.observe(entry));

    return () => {
      timelineEntries.forEach((entry) => intersectionObserver.unobserve(entry));
      intersectionObserver.disconnect();
      setOnscreenElements(new Set());
    };
  }, [setOnscreenElements]);

  let startingYear: number | undefined, endingYear: number | undefined;

  for (const yearElement of onscreenElements.values()) {
    const year = Number(yearElement.dataset.year);

    startingYear = Math.min(startingYear ?? Infinity, year);
    endingYear = Math.max(endingYear ?? -Infinity, year);
  }

  let content: JSX.Element | undefined;

  if (startingYear && endingYear) {
    const relevantProjects = projects.filter(({ period }) => {
      return startingYear <= period.start && endingYear >= period.start;
    });

    content = (
      <>
        <p>
          Within {startingYear} - {endingYear}:
        </p>
        {relevantProjects.map(
          ({
            name,
            description,
            employer,
            responsibilities,
            tools,
            period,
          }) => {
            return (
              <details key={name}>
                <summary className="projectCollapsibleSectionHeader">
                  {name} ({`${period.start}-${period.end ?? ''}`})
                </summary>
                <div className="projectContent">
                  <p>{employer ?? 'Personal'}</p>
                  <p className="projectDescription ">{description}</p>
                  <p>Responsibilities:</p>
                  <ul>
                    {responsibilities.map((responsibility, i) => (
                      <li key={i}>{responsibility}</li>
                    ))}
                  </ul>
                  <p>Tools: {tools.join(', ')}</p>
                </div>
              </details>
            );
          },
        )}
      </>
    );
  }

  return <div className={clsx('projects', className)}>{content}</div>;
}
