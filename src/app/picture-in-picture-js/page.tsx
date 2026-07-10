import 'picture-in-picture-js/index.css';
import './page.css';

import type { Metadata } from 'next';
import Link from 'next/link';
import { TowerOfBabel } from './TowerOfBabel';

export const metadata: Metadata = {
  title: 'Picture-in-Picture JS',
  description:
    'Demo for a library that can render elements in a moveable overlay.',
};

export default function PictureInPictureJSPage() {
  return (
    <div className="pictureInPictureJSPage">
      <h1>Picture-in-Picture JS</h1>
      <p>
        <a href="https://github.com/justinlee0777/picture-in-picture-js">
          Picture-in-Picture JS
        </a>{' '}
        is a library that can take any arbitrary element on the page and puts it
        in an overlay.
      </p>
      <p>
        There{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API">
          are
        </a>{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Picture-in-Picture_API">
          two
        </a>{' '}
        browser-native alternatives you can use, but the usage is either limited
        or poorly supported across browsers.
      </p>
      <p>
        I had a need to develop this solution for{' '}
        <Link href="/prospero">prospero</Link> specifically but it&apos;s still
        applicable for traditional web.
      </p>
      <p>{`Say we are discussing Bruegel the Elder's "Tower of Babel".`}</p>
      <p>
        <TowerOfBabel />
      </p>
      <p>
        {`We are then reading the following passage by Juan Benet in the essay
          "The Construction of the Tower of Babel"`}
        :
      </p>
      <p>
        &quot;The tower is shown on a calm day, the sky furrowed with the odd
        innocuous cloud that sieves the light of morning, evading, thereby, a
        profusion of scattered shadows; judging by those cast, albeit timidly,
        by the counterforts, one may assume the midday hour is near. At this
        moment, the King of Babylon casts a gaze over his works (contemplating
        them, like Phillip II in the Escorial, from the elevation of a nearby
        hill), in the company of the master builder who presents him to a number
        of stonemasons who kneel, paying him homage. Here the incident
        concludes; both by its setting in the foreground, in perfect obedience
        to the rule of <i>repoussoir</i>, as well as by the size of the figures,
        the group composed of the royal entourage and the stonemasons aids the
        artist in minimizing the anecdotal and placing all the emphasis on the
        sovereign edifice that occupies nearly the whole of the landscape, from
        the earth to the sky, the seaside to the ramparts.
      </p>
      <p>
        {`... Brueghel's tower soars up not in the midst of the Babylonian
          deserts or on the banks of the Euphrates, but rather on the coast of a
          wealthy country with fertile soil, on the outskirts of a seaport
          graced with a harbor of some significance; part of it is borne by a
          rocky cliff that no doubt hemmed in the city at one of its extremes,
          at the foot of which a castle and a fortified gate were constructed
          some time prior; by the number of parish churches and the length of
          the outer walls, we may suppose we are looking at a city of some
          thirty to fifty thousand people, larger than Alkmaar and smaller than
          Antwerp; it is crossed by a navigable river that Brueghel's fancy has
          made to empty into the sea through a tunnel hollowed out in the
          promontory, or else through a gorge carved through the same and later
          covered by the tower."`}
      </p>
      <p>
        {`Rather than scrolling up and down constantly, wouldn't it be useful to
          have the image on hand to verify Benet's argument?`}
      </p>
      <p>
        You can see how this would be useful for Medium-style articles or blog
        posts, where a video is meant to accompany the text.
      </p>
    </div>
  );
}
