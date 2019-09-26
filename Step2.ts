module Step2 {
  // Declare a basic interface
  interface Observer<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }
  // decare a function that uses that interface
  function anObservable(observer: Observer<number>) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
  }
}
