'use client';

import { useEffect, useState } from 'react';

interface Entry {
  value: number;
  counter: number;
  errors: number;
  max: number;
  done: boolean;
}

interface Values {
  ones: Entry;
  tens: Entry;
  hundreds: Entry;
  thousands: Entry;
  tenThousands: Entry;
  hundredThousands: Entry;
  millions: Entry;
  tenMillions: Entry;
  hundredMillions: Entry;
  billions: Entry;
  tenBillions: Entry;
  hundredBillions: Entry;
  trillions: Entry;
}

export function OrdersOfMagnitudePage() {
  const [mounted, setMounted] = useState(false);

  const [values, setValues] = useState<Values>({
    ones: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1,
      done: false,
    },
    tens: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 10,
      done: false,
    },
    hundreds: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e2,
      done: false,
    },
    thousands: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e3,
      done: false,
    },
    tenThousands: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e4,
      done: false,
    },
    hundredThousands: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e5,
      done: false,
    },
    millions: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e6,
      done: false,
    },
    tenMillions: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e7,
      done: false,
    },
    hundredMillions: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e8,
      done: false,
    },
    billions: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e9,
      done: false,
    },
    tenBillions: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e10,
      done: false,
    },
    hundredBillions: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e11,
      done: false,
    },
    trillions: {
      value: 0,
      counter: 0,
      errors: 0,
      max: 1e12,
      done: false,
    },
  });

  useEffect(() => {
    setMounted(true);

    const intervalId = setInterval(() => {
      setValues((current) => {
        const newValues: any = {};

        for (const entry of Object.entries(current)) {
          const [key, value] = entry as [keyof Values, Entry];

          const newValue: Entry = {
            ...value,
          };

          if (!value.done) {
            const places = Math.floor(Math.log10(value.value));

            if (++value.counter >= places) {
              if (Math.min((places - 1) * 0.05, 0) < Math.random()) {
                newValue.value = Math.min(value.max, value.value + 1);
              }
              newValue.counter = 0;
            } else {
              newValue.counter++;
            }

            if (newValue.value === newValue.max) {
              newValue.done = true;
            }
          }

          newValues[key] = newValue;
        }

        return newValues;
      });
    }, 300);

    return () => clearInterval(intervalId);
  });

  if (!mounted) {
    return <p>Loading page...</p>;
  }

  return (
    <div className="articlePage">
      <h1>Orders of Magnitude</h1>
      <time dateTime="2026-09-06">September 6, 2026</time>
      <p>
        A simple article. I have been thinking about orders of magnitude a lot
        lately.
      </p>
      <p>
        The origin of my thought comes from Fred Brooks' assertion, in 1986, in
        his lovely "Mythical Man-Month" that "There is no single development, in
        either technology or management technique, which by itself promises even
        one order of magnitude improvement in productivity, in reliability, in
        simplicity."
      </p>
      <p>
        Of course, I can imagine many AI enthusiasts will say, "Um, actually."
      </p>
      <p>
        So let's do something silly and have an actual discussion on what
        "orders of magnitude" mean.
      </p>
      <p>
        We find this discussion extremely useful in our current climate, as we
        talk about millions vs billions in liquid assets, in terms of material,
        etc. This is a particularly important topic for computer scientists, as
        the scale of things can go as low as nano (10^-9) and pico (10^-12) or
        as high as peta (10^15).
      </p>

      <p>
        <a href="https://en.wikipedia.org/wiki/Order_of_magnitude">Wikipedia</a>{' '}
        has a lovely definiton I will butcher. Basically, going up an order of
        magnitude is to multiply it by ten. If you claim to operate on a higher
        magnitude, you are 10 times more productive than you were before.
      </p>

      <p>
        We live in a numbers-heavy society now, so we don't blink an eye.
        "Math!" we say. But this is actually quite significant. "10" is not an
        arbitrary number; well, it is an arbitrary number, as we, by no control
        of our own, have 10 fingers, but in terms of scaling productivity it is
        non-trivial to scale things by a factor of 10.
      </p>

      <p>
        To illustrate this difference, I have come up with this exercise of
        counting up to an order of magnitude.
      </p>

      <p>It is trivial to count to 1.</p>
      <p>It is easy to count to 10.</p>
      <p>But I bet most people wouldn't count to 100 for no reason.</p>
      <p>
        You observe how the increase in difficulty / effort is not linear; the
        leap from 1 to 10 to 100 is dramatic.
      </p>

      <p>
        You also notice, if you try to count from 100 to 1000, you are very,
        very likely to mess up a count. Increasing an order of magnitude is also
        an increase of cost, which also includes cost <i>to correctness</i>, or
        chance of error.
      </p>

      <p>And so, this code.</p>

      <ul>
        <li>
          Every 300 milliseconds (meant to mimic human counting but also fast
          enough to not be tiringly slow) the counters go up.
        </li>
        <li>
          The amount of time needed to say the actual number increases
          proportionably to the number of places of the number. For example, to
          say "fif-teen" takes 600 milliseconds over the 300; to say "one
          hundred and twenty one" takes 900 milliseconds.
        </li>
        <li>
          As the number of places go up, the chance of error increases as well,
          modeling human memory and just mush mouth. The percentage of failure
          is min((places - 1) * 5, 0), meaning it peaks at 50% failure rate if
          it ever gets to the trillions.
        </li>
      </ul>

      {Object.values(values).map(({ max, value, done, errors }: Entry, i) => {
        return (
          <p key={i}>
            {max.toLocaleString()}: {value.toLocaleString()}{' '}
            {done && <>&#10003;</>} Failures: {errors}
          </p>
        );
      })}

      <p>
        As a note, the actual safe limit for JS (for doing mathematical
        operations precisely) is a quadrillion, so we were getting to the point
        where we had to be worried about this.
      </p>

      <p>
        You could probably calculate the actual time for these counters to
        finish, but whatever. (As of the time of writing, while drafting this
        article, it is now in the thousandth place and it's not going to enter
        the next order of magnitude for a very, very long time.) I would rather
        you see the result before your eyes to understand in the most literal
        way possible how significant an increase in magnitude is. And you can
        see the result clearly: this is hell. This is an awful task. It is
        insane for any human being to do this.
      </p>

      <p>
        Which reveals the point of computer science. Don't make humans do this,
        make computers do this. The heart of the field is working with many
        orders of magnitude greater than human comprehension. This is what I
        assume is at the heart of AI engineering (most of my experience is
        frontend-facing, I don't have any formal experience working with AI) -
        AI is figuring out ways to find patterns in lots and lots and lots of
        data.
      </p>

      <p>
        But the reason why computers are effective is that computers run on
        computer time and human beings run on human time. We figure out how to
        translate human problems into computer problems. You can't just cede all
        human problems into computer problems because ... how does that even
        make sense? It's basically saying, "If I had wheels, I'd be a wagon."
        There is some folly in building computer solutions to solve computer
        problems created by computers.
      </p>

      <p>
        (This has become a tangent) I'm not a Luddite, but when cast in this
        light it's not hard to see that the computing industry, for a while, has
        been infused with ... animal spirits, let us say. There is an obsession
        with bigger and bigger numbers, as far as assets, as far as throughput,
        as far as stored data, without questioning what those numbers are
        supposed to signify. I am of course awed by the amount of data YouTube
        can store and retrieve and the amount of data AWS can process, but these
        platforms argue they are not responsible for that data (as the nature
        and usage of data can be harmful), as it is their business to write the
        algorithms that go into the computers that do the actual computing and
        storing. It's the algorithms that are important; everything else is less
        important.
      </p>

      <p>
        This argument is absurd. A programmer is responsible for what they omit
        equally as what they add. If a programmer omits the code that makes the
        program not crash, you would bet 150% someone would hold them
        responsible for that omission. In the same sense, an omission in the
        code to filter out, say, harmful experiences for children or
        misinformation is something the programmer chooses. Let us not indulge
        in flabby philosophy: everything you choose to do and not do is your
        responsibility ("responsibility" apart from "blame"). You don't have law
        and culture and science without that burden.
      </p>

      <p>
        But I think many people intend to use orders of magnitude to so astound
        their audience so as to circumvent responsibility, as in, "how can you
        expect ordinary conduct from extraordinary numbers?" Now you are armed
        with one of the major tenets of computer science, which is inductive
        reasoning. The next step of k is k + 1; and if k is not extraordinary,
        then neither is k + 1. The whole computer science industry depends on
        the ordinariness and predictability of numbers; there is no number so
        outstanding that it defies reason, as then we wouldn't be able to rely
        on numbers for their irreason.
      </p>

      <p>
        Which is a good philosophical concept in of itself: you cannot reason
        with irreason. You can analyze the origins of irrationality and defeat
        irrationality, but never can you spin rationality out of the threads of
        irrationality. If for a given k the attributes do not maintain, you
        cannot say the same for k + 1. If one does not understand the animal
        exuberance of our world over large numbers, then one can try to
        understand the origins of that exuberance and the humanity underpinning
        it, but never should one agree with that exuberance nor should they
        provide reasons for its existence. Compromising with irreason leads to
        destruction; ask our ancestors.
      </p>

      <p>Anyway, stepping off my soapbox now.</p>

      {/* Breaking tasks off into smaller tasks */}

      <p>
        This is what Brooks was getting at: a 10-times increase in productivity
        in software development. This means what can be accomplished in 10
        minutes is done in 1, and what can be accomplished in 10 days is done in
        1. This would be incredible and signify a new era in whatever field is
        being discussed; farming had undergone this increase in scale of
        productivity.
      </p>

      <p>
        So is AI ... <i>that</i>? Personally, I don't think so. Personally, I
        have seen a 3-4x increase in productivity (due to lowering research /
        learning / lookup time), but not an actual 10x increase in productivity.
      </p>

      <p>
        Part of this comes from Brooks' argument: there is the accidental
        complexity of a program and the fundamental complexity of a program. The
        accidental complexity i.e. bugs, errors, design changes, is eliminated
        with "higher" languages and developer culture; but the fundamental
        complexity is, "What is the program <i>supposed to do</i>?" This natural
        fact-finding mission, for the time being, is still in the province of
        human beings, because all relevant problems are human problems, and only
        humans have insights into human problems. Generative AI is very good,
        but I have seen many, many people get mired in "arguing" with AI on the
        program they want to build, which argument could be resolved by ... just
        writing the darn thing yourself. The writing is not the hard part; it's
        the knowing what you're writing.
      </p>

      <p>
        However, I do think there is a psychological element to AI's usefulness.
        It does remove the <i>barrier to start</i>, as in, the natural
        hesitation someone has before embarking on a project. What I mean is,
        human beings get very bored very easily; many human beings do not start
        creative projects because they are unlikely to have some interesting
        artifact in a short amount of time. For example, few people can write a
        satisfactory chapter of a book within one or two hours; few people can
        write a program with interesting output within one or two hours; few
        people can organize ideas into a draft of an essay within one or two
        hours. AI is interesting in that it can generate something interesting
        quickly, so that even if it's not <i>remotely</i> near, you at least
        have something to work on, which is one of the prime difficulties of
        starting a project: setting up a foundation. For example, I would have
        been hesitant to start so many projects if I didn't have Gemini as a
        handy reference manual for various APIs; it has helped me learn new
        additions to ECMAScript, the philosophy of SolidJS, and how to untangle
        Wikidata's SPARQL queries because I don't want that junk in my head.
        Because a project will inevitably require information you don't know, as
        then, why are you working on that project if it's so obvious to you? AI
        is very good for research.
      </p>

      <p>
        In 1995, for "No Silver Bullet Refired", Brooks <i>did</i> identify an
        innovation that did improve development speed by 10 times, and that was
        reusable software. By breaking up software into smaller, testable and
        proven modules, development speed increased dramatically. Obviously
        modular software doesn't sound sexy, but when one mulls on it one
        realizes that this is entirely true. This site is written with React /
        Next; imagine how many hours I would have to spend writing my own
        rendering engine and dealing with my own routing. Furthermore, whenever
        you hear those "AI breaking out of containment" stories, you understand
        very quickly they do so by leveraging existing technology / packages. We
        currently do not live in a world where a single piece of technology
        increases our productivity by an order of magnitude; we instead live in
        a world where productivity increases in a more interconnected, trusting
        and professional environment.
      </p>

      <p>
        Which environment may deteriorate rapidly, who knows. I guess this is my
        one ultra-cynical article on this site.
      </p>
    </div>
  );
}
