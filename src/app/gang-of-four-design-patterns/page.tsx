import './page.css';

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Thoughts on the Gang of Four's Design Patterns`,
  description: `A reflection on the Gang of Four's Object-Oriented Design Patterns in the modern world.`,
};

export default function DesignPatternsPage() {
  return (
    <div className="articlePage">
      <h1>The Gang of Four's Design Patterns</h1>
      <p>
        I have four classics on writing programs: Andrew Hunt and David Thomas's
        "The Pragmatic Programmer", Eric Gamma, Richard Helm, Ralph Johnson and
        John Vlissides', otherwise known as the Gang of Four's, "Design
        Patterns: Elements of Reusable Object-Oriented Software", Fred Brooks'
        "The Mythical Man-Month: Essays on Software Engineering", and the first
        volume of Donald Knuth's "The Art of Computer Programming".
      </p>
      <p>
        "Pragmatic Programmer" is still as useful for my career as it was when I
        began. It's not a book couched in technical knowledge; the content is
        merely a repetition of one axiom, "When it comes to software, anything
        goes." It exhorts the reader to acquire as much technical knowledge as
        possible in the hopes that it will save their projects, and, failing
        that, to have the humility to accept inevitable failure and to learn
        from it. We forget this occasionally, and because we forget this we also
        forget to add to our and others' banks of knowledge on how to correct
        our mistakes. This is the history of programming, which is still very
        new.
      </p>
      <p>
        I have not gotten too far into Knuth, but I find his writing moving.
      </p>
      <p>
        "Mythical Man-Month" is a great read, even though many professionals
        writing software nowadays are unlikely to understand some of Brooks'
        observations, particularly with scheduling jobs on the OS. Some may not
        be working for organizations in similar size to the ones Brooks worked
        for. Some of his data and consequent conclusion seem suspicious.
        Nevertheless, it poses lots of philosophical arguments on how software
        should be built, and is worth a lot of thinking over. And Brooks is
        simply an engaging writer.
      </p>
      <p>
        "Design Patterns" is useless. Which is odd, as it's considered a
        classic.
      </p>
      <p>If I had to rank the books in datedness, it would be:</p>
      <p>
        Art of Programming &gt; Pragmatic Programmer &gt; Man-Month &gt; Design
        Patterns
      </p>
      <p>In terms of usefulness:</p>
      <p>
        Art of Programming &gt; Pragmatic Programmer ~ Man-Month &gt; Design
        Patterns
      </p>
      <p>In terms of writing quality:</p>
      <p>Man-Month ~ Programming ~ Programmer &gt;&gt; Design Patterns</p>
      <p>In terms of wordy title:</p>
      <p>Programmer &gt; Programming &gt; Man-Month &gt; Design Patterns</p>
      <p>
        To be fair, I'm a web developer. But, to be fair, web applications have
        only grown in complexity. Fine, fine, perhaps Google's Developer
        Platform or Amazon Web Services' dashboard are not fair examples, but
        take one look at, say, the{' '}
        <Link href="https://www.nytimes.com/">New York Times' site</Link>,
        Facebook, or the website of your bank of choice. Web devs will beat the
        drum that the best user experience is a simple one, but, for whatever
        reason, we're building complex web applications. And we're writing
        applications with complicated I/O mechanisms. So even if a book is meant
        for C++ or Java, I do think it is fair for developer of all spades to
        evaluate it, unless the content, up-front, is about the language or
        compiler in particular.
      </p>
      <p>
        In the prologue to Knuth's work, he states: "It should be mentioned
        immediately that the reader should <em>not</em> expect to read an
        algorithm as if it were part of a novel; such an attempt would make it
        pretty difficult to understand what is going on. An algorithm must be
        seen to be believed, and the best way to learn what an algorithm is all
        about is to try it." This approach does not help "Design Patterns" at
        all. I made a serious attempt to write out the code examples in the
        section "Creational Patterns" and I was struck by the fact that the
        resulting maze does not work, or results in code smells. An example of
        the latter comes from the Abstract Factory pattern, where clients can
        create mazes with bombs. It's a neat idea, but to actually configure
        which rooms or walls have bombs requires downcasting <code>Wall</code>{' '}
        into <code>BombedWall</code>. If I have to know what walls I'm
        installing into a maze, what complexity does the pattern save me, then?
      </p>
      <p>
        The work suffers from logorrhea, or, in simpler terms, the work is
        rambling. In multiple parts it feels as if the book senses it is losing
        its audience and so summarizes and justifies what it has just done,
        which in turn loses the audience all the more.
      </p>
      <p>
        I want to clarify that I understand the context in which "Design
        Patterns" was written, but that doesn't protect it from its uselessness.
        Firstly, as the book reads like a manual, it loses any historical
        interest. I suppose it's interesting to see what technology and what
        products were common in the days of the book's writing, but it doesn't
        go into depth on these topics. Secondly, a frequent defense of the book
        is that it was useful when certain languages did not support certain
        features, in which case the obsolescence of the book is all the more
        poignantly argued. In the same sense we are not interested in the
        classical elements, we really shouldn't be interested in these
        over-designed patterns.
      </p>
      <p>
        My ultimate feeling towards the book is that its main content i.e. the
        code is described in an inefficient language: English. Code is the best
        way to describe good code. The worst part of the patterns is that we
        hide their explicability behind names, really jargon, and the names
        point to, ugh, more jargon. If we're looking at this in an even deeper
        way, code should really be described in the language of logic, thus
        cementing the idea that code is an expression of human thinking. So said
        Diogenes:{' '}
        <Link href="https://en.wikipedia.org/wiki/Zeno's_paradoxes#Proposed_solutions">
          <em>solvitur ambulando</em>
        </Link>
        , or, "[good software] is solved by walking."
      </p>
      <p>
        So saying, the issue with "Design Patterns" is in how it arrives at its
        conclusions - in that it rambles and never gets there - and not in the
        concept of patterns themselves.{' '}
        <Link href="https://www.martinfowler.com/eaaCatalog/">
          Martin Fowler
        </Link>{' '}
        deals with them in "Catalog of Patterns of Enterprise Application
        Architecture". Immediately he's got it right because he makes the
        "Enterprise" part explicit, understanding the solution is tightly
        coupled with the problem. (What's the solution to the Gordian Knot? If
        it was made of carbon fibers, a sword wouldn't do.) There are two nice
        things about his patterns: 1) they're all simple i.e. local, and 2)
        reading their descriptions is more valuable than knowing their names.
        The irony of object-oriented programming is that Alan Kay, one of the
        designers of Smalltack, an early OOP,{' '}
        <Link href="http://userpage.fu-berlin.de/~ram/pub/pub_jf47ht81Ht/doc_kay_oop_en">
          thought it was an efficient way of grouping various calculations
          together
        </Link>
        . Nothing more than that.
      </p>
      <p>
        I shouldn't say "Design Patterns" is <em>entirely</em> useless, because
        it fulfills an existential purpose: the fact that it exists means you{' '}
        <em>can</em> organize code as encapsulated objects. And indeed it has
        been useful to me in this way, where I consider deeply whether code
        should be organized in a class, instead of a namespace or a set of
        functions. But there's another issue: why <em>object</em>-oriented
        programming? Why does the programmer need a metaphor to the real world
        to help make decisions for a digital world? Again, misleads on top of
        misleads.
      </p>
      <p>
        A possible solution to the book's problems is to begin each design
        pattern with a case study and then undergo theoretical considerations -
        why, when, how of the pattern - in the remainder of the chapter. Indeed,
        this is the layout of "Pragmatic Programmer". And, in fact, this is how
        I structure essays. I put a fair amount of thought into writing, despite
        my asides and over-fondness for wordplay. Everyone can recall a high
        school English class of their distant memory where it was said that
        writing begins with the most interesting information and then peters out
        into specifics, which is also interesting but less so to a general
        audience. The other reason to structure sections this way is that
        theory, after all, is theory, and so being unproven should be considered
        and not followed.
      </p>
      <p>
        On a final note for this topic, it's neat that{' '}
        <Link href="https://refactoring.guru/design-patterns">
          Refactoring Guru
        </Link>{' '}
        has a page for design patterns, but there is still the issue that the
        explanation is not in code. At least it has images, which are slightly
        better than text.
      </p>
      <p>
        I think others have noted how dangerous these patterns are. As Paul
        Graham has{' '}
        <Link href="http://www.paulgraham.com/icad.html">mentioned</Link>, "The
        shape of a program should reflect only the problem it needs to solve.
        Any other regularity in the code is a sign, to me at least, that I'm
        using abstractions that aren't powerful enough - often that I'm
        generating by hand the expansions of some macro that I need to write."
        Keep in mind the authors of "Design Patterns" exhort their reader to
        "use [patterns] and look for other patterns that fit the way you
        design." What they really mean is, Analyze how others code (good advice,
        BTW), but the fear is that this stinks of confirmation bias: Look at
        everything as if they are design patterns so that you can confirm that
        design patterns are indeed real.
      </p>
      <p>
        Last thought on this essay in general: programmers act occasionally like
        lawyers. We often deal with language and what words really mean, mostly
        because we are taking the physical things the words represent and trying
        to understand their relationships with others. Programmers like to
        litigate, argue, complain. As I do in this essay. But there's a part of
        me that thinks we shouldn't encourage this part of our trade. The real
        fear is that we hand-wave actual complexity as an issue of "semantics" -
        which means erasing some of the reality the problem actually poses.
        We're seeing this with AI as we speak now, where the machines being
        trained don't actually care about the content they are creating and
        occasionally spreading straight-up lies. So to say: I fear "Design
        Patterns" is an overly legal book. It's too wordy, for a profession that
        is usually obsessed with saying the least. It may be wise to refactor
        "Design Patterns".
      </p>
    </div>
  );
}
