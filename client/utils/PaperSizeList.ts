type paperSizeListType = {
  size: string,
  width: number,
  height: number,
}

const paperSizeList: paperSizeListType[] = [
  {size: "A4", width: 210, height: 297},
  {size: "A5", width: 297, height: 420},
  {size: "B5", width: 182, height: 257},
  {size: "B4", width: 257, height: 364},
  {size: "A4side", width: 297, height: 210},
  {size: "A5side", width: 420, height: 297},
  {size: "B5side", width: 257, height: 182},
  {size: "B4side", width: 364, height: 257},
];

export default paperSizeList;