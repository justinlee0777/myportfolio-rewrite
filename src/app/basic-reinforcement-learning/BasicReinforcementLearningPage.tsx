'use client';

import './page.css';

import { useEffect, useRef, useState } from 'react';

import { CodeExample } from '@/components/CodeExample';

import { TDLearning } from '../../components/GridworldRunner/td-learning';
import { QLearning } from '../../components/GridworldRunner/q-learning';
import { SARSA } from '../../components/GridworldRunner/sarsa';
import { GridWorld } from '../../components/GridworldRunner/gridworld';
import { Runner } from '../../components/GridworldRunner/runner';
import { GridworldRunner } from '../../components/GridworldRunner/GridworldRunner';

export default function BasicReinforcementLearningPage() {
  return (
    <div className="articlePage">
      <h1>Basic Reinforcement Learning</h1>
      <time dateTime="2026-08-21">August 21, 2026</time>

      <p>
        "Reinforcement learning" is basically "learning" with a "reinforcement"
        aspect to it: ex. teaching a child by giving them candy for good actions
        rather than giving them time-out for bad actions.
      </p>

      <p>
        Nevermind the weight a subject accumulates from its history and the
        various misunderstandings that attach itself to the name. That's the
        definition for this article.
      </p>

      <p>
        It's also instructive to look at the above definition: that doesn't mean
        you don't punish the algorithm (and that is what, indeed, we are
        training, and not anthropomorphic constructs), but if you <i>only</i>{' '}
        punish then the ultimate lesson is to do <i>nothing</i>. There{' '}
        <i>must</i> be a reinforcing aspect to the algorithm from which
        punishments are derived.
      </p>

      <p>
        Furthermore, if we are continuing our intuitive analysis of the
        definition, we can perceive that not all learning is reinforcing
        learning. For example, you don't get any reinforcement for this article,
        or, at least, no obvious reinforcement; you're likely reading it out of
        curiosity, because you have nothing better to do. In contrast,
        reinforcement learning revolves around the algorithm always having
        something better to do, which pertains to the algorithm. Again, it's
        wise to not anthropomorphize things; if an algorithm is considered
        "exploratory", it generally means that we deem its failure instructive
        for its success, so, please, go fail a bunch so you can, in theory,
        succeed a bunch.
      </p>

      <p>
        I guess you can argue that reading random-ass articles is part of an
        "exploratory" approach to accumulating knowledge, but, whatever; in the
        strictest sense we can't classify all learning as reinforcement
        learning, because we don't really know why and how Homo Sapiens is
        compelled to learn. There are in fact two other categories of learning:
        Supervised Learning and Unsupervised Learning. For the sake of extending
        the metaphor, Supervised Learning is telling a child to do exactly as I
        do, if only because you trust me entirely; Unsupervised Learning is
        yelling at a child, PLAY! NOW!
      </p>

      <p>
        As a note, I am by no means an expert in machine learning, and I really
        know nothing about Supervised and Unsupervised Learning; I'd just
        thought it'd be fun to consolidate some concepts I knew.
      </p>

      <h2>TD Learning</h2>

      <p>Alright. We begin with TD Learning:</p>

      <CodeExample code={TDLearning} hideRunner />

      <p>
        As I mull on this topic - and I reiterate I am not an expert - I realize
        there are probably many ways to explain reinforcement learning and the
        way I was taught may puzzle people taught something different. I keep
        trying to find something essential in it all that conveys the concept
        intuitively, because I'm a humanities nerd in a math field, as a result
        of forces I don't understand (though math is arguably part of the
        humanities, it just depends on what specific aspects of math you are
        interacting with ex. formal logic).
      </p>

      <p>Formally, this is how Bellman Optimality is defined:</p>

      <p>
        <code>V*(s) = max_a Σ[p(s', r | s, a) * (r + γ * V*(s'))]</code>
      </p>

      <p>
        In prose, this can possibly be translated to: "For the given next state
        and reward, multiply the reward for the next state with the discount
        factor, and take this product and derive a sum of the current reward.
        Then, multiply this sum by the likelihood the current action will result
        in the next state (this is 1 if the next state is guaranteed given the
        taken action). Find the maximum value possible for this next
        state-reward pair. This is the value of the current state."
      </p>

      <p>
        Rather than looking at this topic from a perspective of "input -&gt;
        output", let's look at the comment I put in the code, which is not my
        formulation but what was taught me by my instructor:
      </p>

      <p>
        <code>V(s) ← V(s) + α[r + γV(s') - V(s)]</code>
      </p>

      <p>
        Very simply, the value of the current state is the sum of 1. its current
        value and 2. the reward for the next state plus the difference between
        this state's value and the next state, which is the calculation of
        "error".
      </p>

      <p>
        This is the thing about machine learning: machines are inevitably
        trained on so much data, it's very easy to get lost in the aggregate
        when the aggregate is composed of many little, identical operations.
      </p>

      <p>
        The coefficients of α and γ are arguably unimportant for understanding
        the heart of this equation. α is the learning rate; you want the
        algorithm to be somewhat skeptical of what it's currently learning, as
        it may be led to believe it is the most important thing in the world.
        This is essentially saying, "Believe, like, a tenth of what you
        learned." γ is the discount factor, which is also, in anthropomorphic
        terms, a healthy dose of skepticism: it is asking, "Do you value the
        rewards for the future, or the present?" Generally discount factor is
        high, but it's not 1, as the algorithm doesn't want to completely
        discredit its present condition.
      </p>

      <p>
        Again, though, these are arguably unimportant. These are just controls
        meant to match the idiosyncrasies of a particular environment. The heart
        of the equation is in how the rewards / states relate to one another.
      </p>

      <p>
        <code>r + V(s') - V(s)</code> is the actual learning. <code>r</code> is
        the reward for the current state. <code>V(s)</code> is how valuable the
        algorithm <i>thinks</i> the state is; <code>r</code> is "objective",{' '}
        <code>V(s)</code> is "subjective". <code>V(s')</code> is how valuable
        the algorithms thinks the <i>next</i> state is. All taken together, this
        means in English prose: "How good is this current state, and will this
        state take me to a better one?" There are four answers: 1. this current
        state is good and the next state is also good. 2. The current state is
        good, but the next state is not that good. 3. The current state is bad,
        but the next state will lead me to a better one. 4. The current state is
        bad, and the next state is not going anywhere better.
      </p>

      <p>
        You can see where this leads to: these three variables describe a path.
        2. means: "Hey, it doesn't hurt to stay here, and maybe this is where I
        actually want to be going forward, unless something better pops up." 3.
        means: "Uh oh, this is bad, I need to move out of here." 4. means: "I
        don't know why I came here, if I could go back in the past I would tell
        myself to not come here." 1. means: "I'm delusional." This is a joke,
        but it doesn't hurt to inspect why the algorithm has suddenly found the
        golden solution to all of its problems.
      </p>

      <p>The path describes changes in time: "temporal".</p>

      <p>
        What was just described was the learning step. The step where the
        algorithm "takes action" is simpler: choose the action that leads to the
        best state. In the beginning our algorithm knows nothing, so it just
        takes random actions until we decide to take the training wheels off.
      </p>

      <h2>Q Learning</h2>

      <p>Before we have some fun, let's look at the other algorithms.</p>

      <CodeExample code={QLearning} hideRunner />

      <p>
        This is Q Learning. This is the equation I have copied down:{' '}
        <code>Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)]</code>
      </p>

      <p>
        Analyze the relationships between the variables. The major difference
        between TD Learning and Q Learning is the introduction of <code>a</code>
        , the actual action taken. The key difference is that Q Learning heavily
        couples state and action together, assigning values to state-action
        pairs.
      </p>

      <p>
        You would not be wrong to ask, "What's the difference in their results?"
        I'll be upfront: I don't know either. Obviously, they're semantically
        different: instead of answering, "Where do I want to go?" Q Learning
        answers, "What do I want to do?" But "What I want to do" is answered
        significantly by "Where do I want to go?" I imagine this can be answered
        by experimenting with many environments, but I want to do other things
        besides Reinforcement Learning all day.
      </p>

      <h2>SARSA</h2>

      <p>
        "State-Action-Reward-State-Action", with the last "State-Action"
        implying "Next State-Next Action". It means prediction is built into the
        model.
      </p>

      <CodeExample code={SARSA} hideRunner />

      <p>
        And the algorithm:{' '}
        <code>Q(s,a) ← Q(s,a) + α[r + γ Q(s',a') - Q(s,a)]</code>
      </p>

      <p>
        We see SARSA resembles Q Learning greatly. Eagle-eyed or patient readers
        will see the difference: SARSA is essentially TD-Learning but with
        state-action pairs instead of just state.
      </p>

      <p>
        So the only real difference between this and TD Learning is that more
        needs to be memorized; TD Learning memorizes values for <code>n</code>{' '}
        states, and SARSA memorizes values for <code>n * a</code> states. This
        does matter the more data you're using, but chips keep getting smaller
        and smaller a la Moore's Law so, whatever.
      </p>

      <p>
        The difference with Q Learning comes from that <code>max</code> function
        above: Q Learning assigns values from what it <i>currently</i> knows; if
        it knows nothing about a certain state-action pair at the time of
        learning, then it judges poorly, and crap input -&gt; crap output. In
        contrast, SARSA tries to be predictive and determines what action it
        would take if it <i>did</i> take on the next state, and figure out from
        there if that action would be good. In theory, SARSA is supputating on
        less information.
      </p>

      <p>
        But their results are ultimately the same, given enough information.
      </p>

      <p>
        SARSA and TD Learning are considered on-policy: they only want to find
        out the best policy. Q Learning is off-policy: it is only interested in
        what it is currently perceiving.
      </p>

      <p>
        But, again, the examples provided here are not enough to distinguish
        them in terms of their actual results.
      </p>

      <h2>Environment</h2>

      <p>We're going to run these on the classic GridWorld environment:</p>

      <CodeExample code={GridWorld} hideRunner />

      <ul>
        <li>Algorithm can go up, right, down, left.</li>
        <li>If you fall into a pit, -1 points.</li>
        <li>If you enter the goal, +10 points.</li>
        <li>
          In a slight variation from traditional GridWorld, if you walk, -0.01
          points. This is to encourage the algorithm to not take so many steps.
        </li>
      </ul>

      <h2>Runner</h2>

      <CodeExample code={Runner} hideRunner />

      <p>
        I do believe the code explains itself; however, special note should be
        made of the second invocation of <code>"selectAction"</code>. This is
        just for SARSA and unnecessary for TD Learning and Q Learning; however,
        the code <i>should</i> be designed such that this is superfluous.
        However, as the runner is also a significant aspect of the overall
        algorithm, this difference should be noted.
      </p>

      <p>
        Whenever I write these code samples, I want them to be as dead-simple as
        possible, keeping only the fundamental logic. This Runner is much more
        complicated than it needs to be for rendering reasons. My apologies.
      </p>

      <p>Alright, time for fun stuff.</p>

      <GridworldRunner allowedAlgorithms={new Set(['td', 'q', 'sarsa'])} />

      <p>This is a mesmerizing screensaver.</p>

      <p>
        If I had a penchant for education at all, I would find an environment
        where these algorithms actually differ. Instead, I am just having fun.
        So it is what it is.
      </p>

      <p>
        I'm hoping to do another article on DQN in the future, if only for the
        heck of it.
      </p>
    </div>
  );
}
