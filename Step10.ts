module Step10 {
  interface Observer<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }

  type Teardown = () => void;

  class Subscriber<T> implements Observer<T> {
    closed: Boolean = false;

    constructor(private destination: Observer<T>, private subscription: Subscription) {
      subscription.add(() => (this.closed = true)); // if this is unsubscribed, don't let antyhing complete or error
    }

    next(value: T): void {
      if (!this.closed) {
        this.destination.next(value);
      }
    }
    error(err: any): void {
      if (!this.closed) {
        this.closed = true;
      }
      this.destination.error(err);
      // unsubscribe from the subscription so that it does it when you want to
      this.subscription.unsubscribe();
    }
    complete(): void {
      if (!this.closed) {
        this.closed = true;
        this.destination.complete();
        // unsubscribe from the subscription so that it does it when you want to
        this.subscription.unsubscribe();
      }
    }
  }

  class Subscription {
    private teardowns: Array<Teardown> = [];

    add(aTeardown: Teardown) {
      this.teardowns.push(aTeardown);
    }

    unsubscribe() {
      for (const teardown of this.teardowns) {
        teardown();
      }
      this.teardowns = [];
    }
  }

  class Observable<T> {
    constructor(private Init: (observer: Observer<T>) => Teardown) {}

    subscribe(observer: Observer<T>): Subscription {
      const subscription = new Subscription();
      const subscriber: Observer<T> = new Subscriber(observer, subscription);
      subscription.add(this.Init(subscriber));
      return subscription;
    }
  }

  const anObservable = new Observable((observer: Observer<number>) => {
    let i = 0;
    const id = setInterval(() => {
      observer.next(i++);
      if (i > 3) {
        observer.complete();
        observer.next(999999); // This doesn't work anymore.
      }
    }, 1000);

    // resturn a basic teardown

    return () => {
      console.log('tearing down');
      clearInterval(id);
    };
  });

  const teardown = anObservable.subscribe({
    next(value: number) {
      console.log(value);
    },
    error(err: any) {
      console.error(err);
    },
    complete() {
      console.log('Complete!');
    }
  });

  setTimeout(() => {
    teardown.unsubscribe(); // This is now a Subscription
  }, 7000); // should teardown despite this timer
}
