type paperSizeListType = {
  size: string,
  width: number,
  height: number,
  imageUrl: string,
}

// const numberLinkWidth = 2800;
// const numberLinkHeight = 1762;
const sudokuWidth = 2960;
const sudokuHeight = 1822;
const numberLinkWidth = 1626;
const numberLinkHeight = 999;

const normalImage = "https://celclipmaterialprod.s3-ap-northeast-1.amazonaws.com/91/01/1880191/thumbnail?1637291685";

const paperSizeList: paperSizeListType[] = [
  {size: "A4", width: 210, height: 297, imageUrl: normalImage},
  // {size: "A5", width: 297, height: 420, imageUrl: normalImage},
  // {size: "B5", width: 182, height: 257, imageUrl: normalImage},
  // {size: "B4", width: 257, height: 364, imageUrl: normalImage},
  // {size: "A4side", width: 297, height: 210, imageUrl: normalImage},
  // {size: "A5side", width: 420, height: 297, imageUrl: normalImage},
  // {size: "B5side", width: 257, height: 182, imageUrl: normalImage},
  // {size: "B4side", width: 364, height: 257, imageUrl: normalImage},
  // {size: "謎解き1", width: 1922, height: 1082, imageUrl: "/question/1.png"},
  {size: "数独1", width: sudokuWidth, height: sudokuHeight, imageUrl: "/question/sudoku/1.png"},
  {size: "数独2", width: sudokuWidth, height: sudokuHeight, imageUrl: "/question/sudoku/2.png"},
  {size: "数独3", width: sudokuWidth, height: sudokuHeight, imageUrl: "/question/sudoku/3.png"},
  {size: "ナンバーリンク練習", width: numberLinkWidth, height: numberLinkHeight, imageUrl: "/question/number-link/test-numberlink.png"},
  {size: "ナンバーリンク1", width: numberLinkWidth, height: numberLinkHeight, imageUrl: "/question/number-link/numberlink1.png"},
  {size: "ナンバーリンク2", width: numberLinkWidth, height: numberLinkHeight, imageUrl: "/question/number-link/numberlink2.png"},
  {size: "ナンバーリンク3", width: numberLinkWidth, height: numberLinkHeight, imageUrl: "/question/number-link/numberlink3.png"},
];

export default paperSizeList;