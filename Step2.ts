module Step2 {
  interface Observer<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }

  function anObservable(observer: Observer<number>) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
  }
}
