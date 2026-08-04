import './page.css';

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Rewriting Prospero`,
  description: `I discuss the process of rewriting Prospero, a little bit of software I wrote for rendering text on the web as a book.`,
};

export default async function RewritingProsperoPage() {
  return (
    <div className="articlePage">
      <h1>Rewriting Prospero</h1>
      <p>
        I was messing around with{' '}
        <a href="https://www.gutenberg.org/">Project Gutenberg</a> for the
        Author Map when I had the idea of uploading a bunch of texts for the
        Prospero library.
      </p>
      <p>
        For context, Prospero is software I wrote to paginate text on the web.
        What's special about it is that it works for three use cases:
      </p>
      <ul>
        <li>You can pass any pages in Prospero and it'll just work.</li>
        <li>
          You can pass in any text to Prospero and it'll just work, rendering a
          flexible book which can adjust to any dimensions.
        </li>
        <li>
          You can do the work for really large corpuses ahead-of-time on the
          server (using Playwright, which is cheating somewhat) and then pass in
          the work to Prospero on the client via an API endpoint.
        </li>
      </ul>
      <p>
        Prospero was designed to peform as well as possible, by being as lazy as
        possible through generators and working with whatever you give it.
      </p>
      <p>
        It's not a particularly novel piece of technology, but I always think of
        fun stuff to do with it, so I thought, "Well, why not revisit it."
      </p>
      <p>
        In the course of developing the Gutenberg corpus, I jotted three bullets
        that could / should be easy to tackle with Prospero and would be
        worthwhile. Here they are, in their unaltered form:
      </p>
      <ol>
        <li>A11Y tests</li>
        <li>load more pages</li>
        <li>vite</li>
      </ol>
      <p>
        With 2 potentially meaning, "Do work ahead-of-time so a client can
        instantly go to page 150 or whatever, maybe on a Worker or something."
        This was getting relevant as the Gutenberg texts are quite big and a
        reader might want to know what the final book length is.
      </p>
      <p>
        3 is easy: I moved the Author Map from rollup to vite, with vite just
        being much easier.
      </p>
      <p>
        So I set upon doing the vite task first, as it really should have been
        very, extraordinarily easy, and found it was just painfully difficult.
      </p>
      <p>
        As I looked deeper and deeper into the source code of Prospero, I also
        realized it was overengineered and kinda crap.
      </p>
      <p>So let's first look at why the move to vite was so difficult.</p>
      <h2>The Prospero move to Vite</h2>
      <p>
        Prospero has many entrypoints, probably too many. The point was to make
        sure you only got the code you wanted; tree-shaking was very important
        for its usage.
      </p>
      <p>
        Prospero really has two very important entries: the web and the server
        build. The web build should be as light as possible and not pass onto
        the client crud that took a lot of space. The server build uses
        Playwright, which hurts the web build's criteria i.e. not downloading
        heavy crud.
      </p>
      <p>
        The minute I tried to move to vite, I realized that Prospero's server
        build was not following Node's module resolution. This is huge, because
        it was logical for a program written in Node to use Node's latest tech
        and follow its best practices. Having written some large pipelines for
        Author Map and the Gutenberg corpus, I understood immediately how urgent
        this was.
      </p>
      <p>
        That is to say, this oversight wasn't clear to me years ago to FE-facing
        me.
      </p>
      <p>
        The issue was the the web and server builds were incestuous. It was not
        immediately clear what used what; everything was thrown around
        haphazardly and referenced here and there.
      </p>
      <p>
        What's worse was that it didn't <i>have</i> to be this way. The project
        went through a number of changes as I understood better the nature of
        the DOM and what, exactly, Prospero had to do. It's pretty dead simple:
        every browser is unique, so you need to do the pagination work on one's
        browser of choice. You cannot do a browser-agnostic server process, as
        the final pagination will get it wrong; hence, Playwright. The actual
        code just adds text until it senses an overflow; when an overflow is
        detected, send out the current page and wait until the client asks for
        further pages.
      </p>
      <p>
        This flow, again, is dead-simple, and the code should reflect this
        simplicity. But it didn't. And there was so much code that just made no
        sense to me.
      </p>
      <p>
        Building a project is as easy or as hard as the coders make it to be. I
        remember spending days editing file imports for a shared library in SAP,
        just to get tree-shaking right to ensure only the right amount of code
        was imported. I also transitioned the Author Map from rollup to vite in
        an afternoon. If everything is organized and the files are in clear
        locations, then the build process is very easy and you can switch to new
        and better tooling (as one ought to). If everything is disorganized,
        then welcome to hell. (I understand the concept of organization /
        disorganization is an artform and often realized after the fact.)
      </p>
      <p>
        Because building Prospero wasn't easy, it struck me that there was
        something fundamentally wrong with the code. Once it gets to that point,
        adding features / making changes would become harder and harder to do,
        and I like Prospero so I didn't want to get to the point where I no
        longer had the appetite to work on it.
      </p>

      <h2>How it was overengineered</h2>

      <p>
        The first issue with Prospero was, when I was first writing it, some
        weirdo on the internet convinced me that single-exports /
        default-exports structure was ideal for a React directory.
      </p>

      <p>
        Wrong. The whole project became a mess to read. Exports should be
        logically grouped together so you know where everything is. This was
        also mixed with the directories thrown together to not make explicit
        which were server and which were web components.
      </p>

      <p>
        When I <Link href="/rewriting-the-site">rewrote this site</Link> I
        mentioned how Next / React was perfectly adequate for this site's
        performance. As Prospero is a third-party library, React did not seem
        suitable.
      </p>
      <ol>
        <li>
          Prospero needed to be platform-agnostic, so I was not wed to React.
        </li>
        <li>
          Prospero, for my own usage, needs very little reactivity - it's
          designed to be a one-off, not needing much maintenance once it's on
          the page.
        </li>
        <li>
          The React engine is quite large, so that's extra KBs / MBs for Vue /
          Angular applications.
        </li>
      </ol>

      <p>
        As a result, I developed my own framework using JavaScript's imperative
        API. Benefit: the imperative API is super fast (obviously - it's just C
        code) and much of the API makes more sense when developed from an
        imperative standpoint (as compared to JSX's declarative philosophy).
        Con: it was basically{' '}
        <a href="https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf">
          Dijkstra's "Go To Statement Considered Harmful"
        </a>
        . The imperative API highly coupled the Book component's rendering with
        the rendering of its sub-components.
      </p>

      <p>
        Say what you will about JSX, but it's a good, condensed statement on
        what it is you intend to do. The DOM is a tree structure, and trees are
        known for their information density. The imperative API mixed with the
        inherently asynchronous nature of web work made it nightmarish to
        extend, with animations, with themes, with event listeners, etc.
      </p>

      <h2>Solid.js</h2>

      <p>
        I therefore went with Solid. Solid is famously fast and small. It's
        famous for doing the least amount of work as possible (with like fifty
        asterisks). I've always wanted to learn it, too.
      </p>

      <p>
        But in order to discuss the specific things Solid did that made me happy
        and sad, I have to discuss React, which Solid resembles.
      </p>

      <p>
        <a href="https://overreacted.io/react-as-a-ui-runtime/">
          This blog post
        </a>{' '}
        describes it perfectly. Basically, a component in React is a description
        of what you want in the DOM for a given state. When you return that JSX,
        React makes a note of what you wrote down.
      </p>

      <p>
        Then, when something triggers a change - "useEffect", "useState",
        whatever - that function is re-run and spits out new JSX. React then
        decides what changes in that JSX and changes the actual DOM with the
        diff of those changes. This is why React is so big: it's because of that
        diff checker.
      </p>

      <p>
        The principle behind Solid, from my understanding, is to use a specific
        way of processing data to listen to changes. If you explicitly tell
        Solid, "Hey, this is changing", then what happens is that the specific
        data that uses that one piece of data changes. No diff checker, no
        "hopeful" renders checking to see if anything has changed; it is very
        blunt.
      </p>

      <p>
        This is neat on paper but I found it relies on magic. The reality is
        that Solid is actually quite close to my original vision for Prospero's
        UI rendering: it's imperative. The only declarative part is JSX - as in,
        I'm not figuring out how to assign ARIA labels and event listeners to
        their imperative counterparts.
      </p>

      <p>
        But when you create a Solid component, you realize all of your code only
        runs sequentially <i>unless</i> you are working with Solid's magic,
        which is Solid's version of React hooks or wrapping everything in
        nullary functions.
      </p>

      <p>
        I actually do think it's neat that you can be super efficient and direct
        with your coding, but your brain begins to die a little when you try to
        understand the true sequence of commands the program is running as a
        result of mixing the imperative and the reactive commands.
      </p>

      <p>
        Furthermore, Solid does do compiler magic. A great example is when I was
        trying to package my components as web components (great feature from
        the Solid team, by the way) and I discovered that destructured props
        just don't work, you have to explicitly tell Solid which props you're
        using. This strikes me as a clear violation of a developer's intuition
        because ... data is data, who cares how it's declared.
      </p>

      <p>
        I think this all goes to show how intuitive React's render loop is. It's
        a unique way of thinking, but it's also "pure", it's philosophically
        consistent with itself, compared to Solid's syncretic way of doing
        things. I've literally never had any issue with developing React
        components; it was always clear to me what I could and could not do.
      </p>

      <p>
        That being said, Solid is great. Its performance is fantastic and it's
        clear <i>enough</i>.
      </p>

      <h2>Weaknesses</h2>

      <p>
        There is still one element of the new "@prospero-library" scoped package
        that makes me want to cry: the monorepo structure. This is admittedly
        one of the most backwards parts of the web and one that is poorly
        implemented, natively at least. It's a cool idea: put a group of
        packages under a logical ordering, but it really, really, really
        shouldn't be so hard to get tsconfig and your build tool of choice to
        play well with this. It's clear no tool works with monorepos in mind.
      </p>

      <p>
        Seriously, half of development time was figuring out builds, and most of
        the time I would do nothing at all and TS would somehow forget how to
        resolve the paths. Now that I know how painful it is, perhaps one day
        I'll check out nx or Lerna - but I'm not in love with learning tooling
        to do things that just aren't supported well.
      </p>

      <h2>Development time</h2>

      <p>
        I think this may have taken me literally a full work-week to finish - 40
        hours, working nights just to get it through as I wanted to work on
        other things. I knew this rewrite was going to be hell and so I plowed
        into it, not resting lest I find some incentive to give up on the thing.
      </p>

      <p>
        Because I was using a lot of new tech - Solid, Vite - I consulted
        Google's Gemini a lot, which helped me understand Solid philosophically
        and withstood every complaint I had on the pains of building a monorepo.
        I'm still not sure on how I feel on AI - I'm quite certain it doesn't
        meet Fred Brooks' criteria of reducing development time by an order of
        magnitude - but it definitely helped in discovering Solid's quirks and I
        would honestly have no idea what to do for navigating Vite / TS /
        Next.js because those can be really, really, woefully undocumented and
        obscure. At a minimum, Gemini acted as my{' '}
        <a href="https://en.wikipedia.org/wiki/Rubber_duck_debugging">
          rubber ducky
        </a>
        , helping me realize where the actual issue could be (leading to a
        dramatic revelation that Next.js can't deal with symlinks).
      </p>

      <p>
        As a reference,{' '}
        <a href="https://github.com/justinlee0777/prospero-library">
          here's the new location
        </a>{' '}
        for the prospero package, with packages available to NPM at{' '}
        <code>@prospero-library/web</code> and{' '}
        <code>@prospero-library/server</code>. At some point I need to do
        documentation and hook NPM up to GitHub but ... I'm pretty sure I'm the
        only one using it, so whatever. But it'd be fun to figure out, anyway.
      </p>
    </div>
  );
}
