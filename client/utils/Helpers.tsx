export const removeItems = (input: [], item: number) => {
  let arr:[] = [];
  for (let i = item - 1; i < input.length; i++) {
      arr.push(input[i]);
  }
  return arr;
}