type paperSizeListType = {
  size: string,
  width: number,
  height: number,
  imageUrl: string,
}

const normalImage = "https://celclipmaterialprod.s3-ap-northeast-1.amazonaws.com/91/01/1880191/thumbnail?1637291685";

const paperSizeList: paperSizeListType[] = [
  {size: "A4", width: 210, height: 297, imageUrl: normalImage},
  {size: "A5", width: 297, height: 420, imageUrl: normalImage},
  {size: "B5", width: 182, height: 257, imageUrl: normalImage},
  {size: "B4", width: 257, height: 364, imageUrl: normalImage},
  {size: "A4side", width: 297, height: 210, imageUrl: normalImage},
  {size: "A5side", width: 420, height: 297, imageUrl: normalImage},
  {size: "B5side", width: 257, height: 182, imageUrl: normalImage},
  {size: "B4side", width: 364, height: 257, imageUrl: normalImage},
  {size: "Exam1", width: 1922, height: 1082, imageUrl: "/question/1.png"},
  {size: "Exam6", width: 2038, height: 1748, imageUrl: "/question/6.png"}
];

export default paperSizeList;