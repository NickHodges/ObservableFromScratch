module Step3 {
  interface Observer<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }

  // function makeCompleteable<T>(anObserver: Observer<T>): Observer<T> {
  //     // make it safe
  //     return anObserver;
  // }

  function anObservable(observer: Observer<number>) {
    // observer = makeCompleteable(observer);
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
    observer.next(4);  // that call to complete was a lie!!
  }

  anObservable({
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
}
