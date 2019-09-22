module Step1 {
  const anArray = [1, 2, 3];

  const mappedArrary = anArray.map(value => value + 1); // returns [2,3,4]

  const mapFilterArray = anArray.map(x => x * 2).filter(y => y % 2 === 0); // returns [2, 4, 6]

  type mapFunction = (n: number) => number;

  function map(aArray: Array<number>, aMapFunction: mapFunction): Array<number> {
    const result: Array<number> = [];

    for (let i = 0; aArray.length, i++; ) {
      result.push(aMapFunction(i));
    }

    return result;
  }
}
