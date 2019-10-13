module Step6 {
  interface Observer<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }

  function anObservable(observer: Observer<number>) {
    let i = 0;
    const id = setInterval(() => {
      observer.next(i++);
      if (i > 3) {
        observer.complete();
        // This won't work, because there isn't a good way to maintain
        // state, etc.
      }
    }, 1000);

    // return a basic teardown
    // but now there is no way to make sure that this
    // happens if there is an error or complete is called
    return () => {
      clearInterval(id);
    };
  }

  // But, this is the basic pattern:
  // 1.  You have a function
  // 2.  You pass in an Observer
  // 3.  You return a teardown function

  const teardown = anObservable({
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
