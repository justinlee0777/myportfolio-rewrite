export const basicPattern = () => {
  class Observer {
    subscribers = [];

    add(subscriber) {
      this.subscribers = this.subscribers.concat(subscriber);
    }

    remove(subscriber) {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    }

    notify(event) {
      this.subscribers.forEach((sub) => sub.onNotify(event));
    }
  }

  class SubscriberA {
    onNotify(event) {
      console.log(`${event} A!`);
    }
  }

  class SubscriberB {
    onNotify(event) {
      console.log(`${event} B!`);
    }
  }

  const observer = new Observer();

  observer.add(new SubscriberA());
  observer.add(new SubscriberB());

  observer.notify('Hello');
};

export const realLifeExample = () => {
  class Observer {
    subscribers = [];

    add(subscriber) {
      this.subscribers = this.subscribers.concat(subscriber);
    }

    remove(subscriber) {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    }

    notify(event) {
      this.subscribers.forEach((sub) => sub.onNotify(event));
    }
  }

  class SubscriberC {
    element;
    greeting;

    constructor(element, greeting) {
      this.element = element;
      this.greeting = greeting;
    }

    onNotify(event) {
      this.render(event);
    }

    render(text) {
      this.element.textContent = `${this.greeting}, ${text}!`;
    }
  }

  // Given an existing document where our script is located...
  const observer = new Observer();

  observer.add(new SubscriberC(document.getElementById('example1'), 'Hello'));
  observer.add(new SubscriberC(document.getElementById('example2'), 'Howdy'));

  observer.notify('world');
};

export const filterExample = () => {
  class Observer {
    subscribers = [];

    add(subscriber) {
      this.subscribers = this.subscribers.concat(subscriber);
    }

    remove(subscriber) {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    }

    notify(event) {
      this.subscribers.forEach((sub) => sub.onNotify(event));
    }
  }

  class TastyObserver extends Observer {
    notify(event) {
      if (typeof event === 'string' && event.includes('tasty')) {
        super.notify(event);
      }
    }
  }

  class HungrySubscriber {
    onNotify(event) {
      if (typeof event === 'string' && !event.includes('tasty')) {
        throw new Error('I only want to eat tasty things.');
      } else {
        console.log('Yum!');
      }
    }
  }

  const observer = new TastyObserver();
  observer.add(new HungrySubscriber());

  observer.notify('tasty sandwich');
  observer.notify('nasty pasta');
  observer.notify('A ROCK');
};

export const stackOverflowExample = () => {
  class Observer {
    subscribers = [];

    add(subscriber) {
      this.subscribers = this.subscribers.concat(subscriber);
    }

    remove(subscriber) {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    }

    notify(event) {
      this.subscribers.forEach((sub) => sub.onNotify(event));
    }
  }

  class SubscriberD {
    observer;
    constructor(observer) {
      this.observer = observer;
    }

    onNotify(event) {
      const newEvent = `${event} D!`;
      console.log(newEvent);
      this.observer.notify(newEvent);
    }
  }

  const observer = new Observer();
  observer.add(new SubscriberD(observer));

  observer.notify('Hello');
};

export const shootFootExample = () => {
  class Observer {
    subscribers = [];

    add(subscriber) {
      this.subscribers = this.subscribers.concat(subscriber);
    }

    remove(subscriber) {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    }

    notify(event) {
      this.subscribers.forEach((sub) => sub.onNotify(event));
    }
  }

  class Person {
    pointingAtFeet;

    pointAtOurFoot() {
      this.pointingAtFeet = true;
    }
    shoot() {
      if (this.pointingAtFeet) {
        throw new Error('You have shot your own foot.');
      }
    }
  }

  class SubscriberE {
    person;
    constructor(person) {
      this.person = person;
    }

    onNotify() {
      this.person.pointAtOurFoot();
    }
  }

  class SubscriberF {
    person;
    constructor(person) {
      this.person = person;
    }

    onNotify() {
      this.person.shoot();
    }
  }

  const observer = new Observer();

  const person = new Person();
  observer.add(new SubscriberE(person));
  observer.add(new SubscriberF(person));

  observer.notify();
};

export const competingObserverExample = () => {
  class Observer {
    subscribers = [];

    add(subscriber) {
      this.subscribers = this.subscribers.concat(subscriber);
    }

    remove(subscriber) {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    }

    notify(event) {
      this.subscribers.forEach((sub) => sub.onNotify(event));
    }
  }

  class Human {
    currentMeal;
    satisfyingMeal;

    constructor(satisfyingMeal) {
      this.satisfyingMeal = satisfyingMeal;
    }

    isSatisfied() {
      return this.currentMeal === this.satisfyingMeal;
    }
  }

  class BurgerHuman extends Human {
    constructor() {
      super('burger');
    }
  }

  class PizzaHuman extends Human {
    constructor() {
      super('pizza');
    }
  }

  class SubscriberG {
    humans;
    constructor(humans) {
      this.humans = humans;
    }

    onNotify(event) {
      this.humans.forEach((human) => (human.currentMeal = event));
    }
  }

  const observer = new Observer();

  const burgerMan = new BurgerHuman();

  const pizzaMan = new PizzaHuman();

  observer.add(new SubscriberG([burgerMan, pizzaMan]));

  // PizzaHuman is not happy.
  observer.notify('burger');

  console.log(`Is the man who loves burgers happy? ${burgerMan.isSatisfied()}`);
  console.log(`Is the man who loves pizzas happy? ${pizzaMan.isSatisfied()}`);

  // BurgerHuman is not happy.
  observer.notify('pizza');

  console.log(`Is the man who loves burgers happy? ${burgerMan.isSatisfied()}`);
  console.log(`Is the man who loves pizzas happy? ${pizzaMan.isSatisfied()}`);
};
