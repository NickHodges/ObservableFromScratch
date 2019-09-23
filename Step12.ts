module Step12 {
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

    pipe<R>(aFunction: (source: Observable<T>) => Observable<R>): Observable<R> {
      return new Observable<R>(subscriber => {
        const subscription = aFunction(this).subscribe(subscriber);
        return () => {
          subscription.unsubscribe();
        };
      });
    }
  }

  const map = <T, R>(aFunction: (value: T) => R) => (source: Observable<T>) => {
    return new Observable<R>(subscriber => {
      const subscription = source.subscribe({
        next(value: T) {
          subscriber.next(aFunction(value));
        },
        error(err: any) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    });
  };

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
      clearInterval(id);
    };
  });

  const teardown = anObservable.pipe(map(x => x + 42)).subscribe({
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
    console.log('Tearing down!');
    teardown.unsubscribe(); // This is now a Subscription
  }, 7000); // doesn't tear down right away.
}
