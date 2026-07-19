import './page.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Rewriting the Site`,
  description: `I discuss the process of rewriting the site, which, though not difficult, involved more thought than I realized.`,
};

export default async function RewritingTheSitePage() {
  return (
    <div className="articlePage">
      <h1>Rewriting the Site</h1>
      <p>
        This more-or-less started when I discovered that most browsers accepted
        the{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Nesting_selector">
          CSS nesting selector
        </a>
        , which allowed for SASS-like stylesheets natively.
      </p>
      <p>
        I had been dissatisfied with the CSS architecture for two categories of
        projects. One was the previous site, which used SASS + CSS modules. The
        SASS was for organizing CSS and the CSS modules were for ensuring there
        was no styling collision. The other category was for component packages,
        which used CSS modules also to prevent styling collision.
      </p>
      <p>
        For the latter category, this was a nightmare. It was very useful for
        developing out-of-the-box components where the client didn't have to
        download any stylesheets, but that itself became a problem: 1) it
        required a "style-inject" hack to make it work and 2) the client
        probably prefers to have a say in the download of stylesheets. Breaking
        down that number 2 into two more arguments: 1) the client has a right to
        control when and where they download certain styles and 2) CSS modules
        made it very difficult to have the components follow theming. The
        airtightness of CSS modules was far too constraining.
      </p>
      <p>
        In fact, the theming of the previous site was always busted. It required
        a series of hacks to make it work, when in reality it should've been
        bonehead simple. CSS really isn't that hard to figure out!
      </p>
      <p>
        Then there was just the reality that my sites were never complex enough
        to protect against style collision. I didn't write an analytics
        dashboard or anything. With these little projects, my way of thinking is
        that I, the author, am the primary consumer of them and therefore the
        use case I have to most cater to is logically mine. If I get emails,
        great, that's a happy problem to have; over time I have learned how easy
        it is to overthink in software development.
      </p>
      <p>
        The other big feature of CSS that helped me change my mind was{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer">
          CSS layers
        </a>
        . With full control over the importation of stylesheets, you can, in
        theory, prevent styling collisions.
      </p>
      <p>
        As I thought more and more on this, it struck me how much work would be
        required and that this was essentially a rewrite. And so I made the
        choice to rewrite the site, for a number of reasons which I will declare
        later. But one reason I found the rewrite encouraging was, the
        filesystem for the old system was crazy mangled. Again, in a fit of
        overthinking, I put a bunch of interrelated files in different folder
        paths thinking it would keep everything neat. It did not. For this site
        I got lazy and put one-off components in the same folder path as their
        page file. If I want to reuse them, I can figure out how to reuse them
        in the future. Software development: figuring out the path of least
        resistance.
      </p>
      <p>
        Usually rewrites are accompanied by the giddy sensation of, "Yippee!
        Time to learn a new software development tool!" I looked into Vue,
        SvelteKit, Astro, all sorts of static-site generators I could pad out my
        resume with and acquire all sorts of fancy FE tricks.
      </p>
      <p>And then I just went back to Next.</p>
      <p>
        I had need for a Node server and I just never had any complaints about
        Next, neither in terms of site performance or development speed. I
        believe fundamentally in clean site design and would hopefully never
        bombard my visitors with the data clusterfuck that is the NYT page.
        Furthermore, who in their right mind, with all things being equal,
        downgrade from a large, well-supported ecosystem to a smaller one?
      </p>
      <p>
        I did think about going totally vanilla but then it was just like, eh.
      </p>
      <p>
        Oh and some of my packages are in React. I could've figured out how to
        isolate them, but, again, there was no obvious gain to doing so.
      </p>
      <p>
        But hey, I was able to upgrade to the App Router stuff which, and I
        understand why people bitch about it, is pretty neat. I definitely don't
        use all of its features, but maybe some day.
      </p>
      <p>
        The other choice I made while rewriting the site was to not port over
        the unit tests. I do think unit tests are essential for a professional
        app, but two circumstances belie that word "professional": 1. the app is
        actually useful to someone and 2. you have to know what specifically the
        app is trying to accomplish, and pretty much all of my projects, so far,
        fulfill neither criteria. I'm still kinda figuring out how my own
        personal interests interact with programming, though the Author Map is
        definitely bridging the distance between those subjects.
      </p>
      <p>
        And...I think that's it. After all that decision-making, the rest of the
        task was to code, and coding is the easy part. I don't have the exact
        timeframe for how long this rewrite took, but it took maybe three weeks,
        while working on other stuff as well. Three weeks isn't really that much
        time for development, but a bean counter probably thinks differently.
      </p>
      <p>There are a number of downsides to this new system:</p>
      <ul>
        <li>
          In the old site, articles were written in Markdown. This page was
          written in plain ol' JSX, with p and li tags. I have written so much
          in Markdown, for this site and my music blog, that it's second nature
          for me, so this kinda sucks. But the move away from Markdown came from
          the fact that I ... just didn't write long-form essays on this site.
          I'm boring and don't have much to say about tech. But the other reason
          is that most of my article ideas require widgets - for example,{' '}
          <a href="/observer-pattern">The Observer Pattern piece</a> really
          needed interactive code snippets. I know there's{' '}
          <a href="https://nextjs.org/docs/pages/guides/mdx">MDX</a> but it gave
          off "one-er" smells; I didn't think I could rely on it long term.
        </li>
        <li>
          I miss the autocomplete of CSS modules. I mean, I never had the issue
          of "why is this selector not working, oh I misspelled it", but it was
          nice to have.
        </li>
        <li>
          I actually don't know if the CSS layers would be effective. I have
          used it just once for this rewrite for mobile and desktop sizes for a
          webpage. I'm not entirely sure what I would do for more complex cases,
          but maybe those complex cases won't happen.
        </li>
        <li>
          I haven't really tested the performance differences with how
          stylesheets are imported, but who knows? Maybe there's no difference.
        </li>
      </ul>
      <p>The upsides were:</p>
      <ul>
        <li>Cleaner filesystem</li>
        <li>
          So much easier developing in CSS... The BEM methodology is a neat idea
          but assiging a class name to every element just feels like fighting
          against the original design of CSS
        </li>
        <li>
          Theming actually works correctly now. The App Router can actually read
          cookies and so deliver the right theme from the server directly
        </li>
        <li>
          I also had the foresight, while getting my Master's, to set up
          automated tests for the site: accesibility, performance, responsive
          design and SAST. The site is actually passing certain metrics now,
          particularly performance
        </li>
      </ul>
      <p>
        The rewrite also gave me an excuse to cancel Random-of-the-Day.
        Basically, I had procured lists of random things, like poems or facts,
        some sourced from other APIs, some I manually added, then ran an AWS
        Lambda to draw a random item from the lists and updated a fast-to-access
        resource the client could pull from. This cost me, like, 15 bucks a
        month. It was ridiculously expensive. But I also learned that, whatever
        app you build, its quality depends on the data you have, and I wasn't
        really willing to pull / pay for a bunch of data for something as
        trivial as Random-of-the-Day, at least in the iteration it was. At that
        point, it might've even been cheaper to just give the client data
        on-demand from a Mongo database, if I could figure out how to properly
        rate-limit requests. So, good bye Random-of-the-Day, perhaps you will
        come back when I have data that is both 1) robust and 2) reliable and
        when I think of a more cost-effective way to keep you running.
      </p>

      <p>
        I hope this encourages me to write me code instead of doing lots of
        talking, though I, evidently, love talking. The lack of MD processing
        isn't that big of an issue but for this site it'd be nice to 1) think of
        much smaller coding projects going forward into the future and 2)
        letting the coding do all the talking for me. Which reveals a tenet I'm
        a big proponent of: project architecture is a major component for
        creativity, which is why architecture needs to be as clean as possible.
      </p>
    </div>
  );
}
