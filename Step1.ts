module Step1 {
  // Normal array
  const anArray = [1, 2, 3];
  // Typical array behavior
  const mappedArrary = anArray.map(value => value + 1); // returns [2,3,4]
  //can string together calls, because methods return an array
  const mapFilterArray = anArray.map(x => x * 2).filter(y => y % 2 === 0); // returns [2, 4, 6]

  // can easily write our own functions......
  type mapFunction<T> = (n: T) => T;

  function map<T>(aArray: Array<T>, aMapFunction: mapFunction<T>): Array<T> {
    const result: Array<T> = [];

    for (let i = 0; aArray.length, i++; ) {
      result.push(aMapFunction(aArray[i]));
    }

    return result;
  }
}
