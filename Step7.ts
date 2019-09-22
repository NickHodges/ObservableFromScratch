module Step3 {
  interface Observer<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }

  type Teardown = () => void;

  // no safety guarantees yet
  class Observable<T> {
    constructor(private Init: (observer: Observer<T>) => Teardown) {}

    subscribe(observer: Observer<T>) {
      return this.Init(observer);
    }
  }

  const anObservable = new Observable((observer: Observer<number>) => {
    let i = 0;
    const id = setInterval(() => {
      observer.next(i++);
      if (i > 3) {
        observer.complete();
      }
    }, 1000);

    // resturn a basic teardown

    return () => {
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
  }, 3200);
}
