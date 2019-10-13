module Step9 {
  interface Observer<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }

  type Teardown = () => void;

  class Subscriber<T> implements Observer<T> {
    closed: Boolean = false; // flag to allow complete to work

    constructor(private destination: Observer<T>) {}

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
    }
    complete(): void {
      if (!this.closed) {
        this.closed = true;
        this.destination.complete();
      }
    }
  }

  class Observable<T> {
    constructor(private Init: (observer: Observer<T>) => Teardown) {}

    subscribe(observer: Observer<T>) {
      // "Buffer" against the complete call not working.
      const subscriber: Observer<T> = new Subscriber(observer);
      return this.Init(subscriber);
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

    // return a basic teardown

    return () => {
      console.log('Tearing down!');
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
    teardown();
  }, 7000); // doesn't tear down right away.
}
