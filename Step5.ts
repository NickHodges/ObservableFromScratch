module Step5 {
  interface Observer<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }

  function anObservable(observer: Observer<number>) {
    let i = 0;
    const id = setInterval(() => observer.next(i++), 1000);

    // resturn a basic teardown
    return () => {
      clearInterval(id);
    };
  }

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
