'use client';

import { CodeExample } from '@/components/CodeExample';

import {
  basicPattern,
  realLifeExample,
  filterExample,
  stackOverflowExample,
  shootFootExample,
  competingObserverExample,
} from './observer-pattern';

export function ObserverPatternPage() {
  return (
    <div className="observerPatternPage">
      <h1>The Observer Pattern</h1>
      <p>
        I wrote this as a thought experiment on how to rewrite the Gang of
        Four's articles. Observer is one of my favorites and is a favorite of
        the web's, and fairly simple to wrap one's head around.
      </p>
      <hr />
      <p>Given:</p>
      <pre>
        <CodeExample code={basicPattern} />
      </pre>
      <p>We observe printed to the console:</p>
      <pre>
        <code>
          <p>Hello A!</p>
          <p>Hello B!</p>
        </code>
      </pre>
      <p>A real-life example:</p>
      <pre>
        <CodeExample code={realLifeExample}>
          <table>
            <thead>
              <tr>
                <th>Example 1</th>
                <th>Example 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="example1"></td>
                <td id="example2"></td>
              </tr>
            </tbody>
          </table>
        </CodeExample>
      </pre>
      <p>
        We observe that the text in two locations on our page has changed to
        'Hello, world!' and 'Howdy, world!' This is essentially how popular
        frameworks as Angular and React work.
      </p>
      <pre>
        <CodeExample code={filterExample} />
      </pre>
      <p>Observe the console printing:</p>
      <pre>
        <code>Yum!</code>
      </pre>
      <p>only once.</p>
      <p>
        Furthermore, the code above will not halt the main program flow. This
        concept is useful for subscribers who require specific data and
        observers who filter data. (That being said, you should always
        validate/assert data.) Indeed, this is crucial to the popular global
        storage package, Redux.
      </p>
      <p>Weaknesses:</p>
      <pre>
        <CodeExample code={stackOverflowExample} />
      </pre>
      <p>
        We observe the above will cause a stack overflow error. Note this
        becomes more pernicious based on the complexity of the{' '}
        <code>notify</code> method.
      </p>
      <pre>
        <CodeExample code={shootFootExample} />
      </pre>
      <p>
        Because our observers are called sequentially, we observe that, as a
        result of <code>SubscriberE</code> being called before{' '}
        <code>SubscriberF</code> (and this is always the case), we have shot our
        own foot.
      </p>
      <pre>
        <CodeExample code={competingObserverExample} />
      </pre>
      <p>
        The observers do not care who they are serving. Therefore, they do not
        understand the needs of the people subscribing to them. There is no way
        to make the entire system happy and a better design is needed.
      </p>
      <p>
        Do not attempt to use concurrency to solve this problem, by attempting
        to put each observer "on an equal footing". This will cause much, much
        worse issues.
      </p>
      <p>
        Observers should work with systems closed from one another. Hence,
        encapsulation is a hard requirement.
      </p>
      <p>My (personal) thoughts:</p>
      <p>
        I do not advise using the Observer pattern for doing work at the highest
        level possible i.e. at the very root of a program. By this I mean, if we
        can imagine a program as a tree of components, with components at the
        root of the tree being used directly by the client and every leaf used
        by a higher level component, the Observer pattern should only be used at
        the lowest levels possible.
      </p>
      <p>
        The pattern is aptly named, in the sense that we observe the sun is
        setting or, upon entering the door, the house smelling nice. These are{' '}
        <em>observations</em>. We can change what we are doing (as in the case
        for night time, I may call delivery) or we can do nothing (the house
        smelling nice denotes a nice-tasting dinner, which dinner I would have
        eaten regardless of nice-tasting-ness or not).
      </p>
      <p>
        It is not wise to make observers observe exceptional events, for
        exceptional events should be handled exceptionally. I do not observe a
        bear in my house, for example, because the time I take observing may
        cost me dearly.
      </p>
      <p>
        Let's use Amazon as an example. Amazon tracks everything you do on a
        page. If it sees you linger on an item, it will update its user
        interface to recommend you more things like that item. This is
        more-or-less the Observer pattern. This user interface, in the grander
        scheme of things, is unimportant. It can error out by 1) not updating,
        2) showing the wrong product, or 3) not showing anything at all. At its
        worst, this error may cost Amazon a potential sale.
      </p>
      <p>
        It would be extremely unwise if product recommendations affected the
        cart - users being able to see their cart, check out, give Amazon money,
        etc. That's real, not potential, money being lost. If product
        recommendations are truly necessary, there needs to be a reconciliation
        mechanism built that should <em>not</em> be incorporated into an
        Observer pattern. The Observer pattern should not fix itself by throwing
        more, quote-unquote "correct", events. Amusingly, I have seen many carts
        implemented this way.
      </p>
      <p>
        It's fine to build an emergency mechanism, to warn the observer of its
        bad data, so long as it is truly for emergencies. The entire system
        should halt and work on reconciling the emergency rather than moving
        along while the emergency is being worked through. Then again, the
        programmer should not throw emergency-causing data into the observer.
        That is the rub.
      </p>
    </div>
  );
}
