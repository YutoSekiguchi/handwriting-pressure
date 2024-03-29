import type { NextPage } from 'next'

type ImageDataObject = {
  url: string,
  strokeData: (string|object)[][],
  pressureArray: number[],
}

type Props = {
  showDialog: (i: number)=>void,
  canvasDialogImageIndex: number,
  showImageDataList: ImageDataObject[],
  isBackButton: boolean
}

const CanvasDialogSliderButton: NextPage<Props> = (props) => {
  const {showDialog, canvasDialogImageIndex, showImageDataList, isBackButton} = props;

	return (
    <button onClick={() => showDialog(isBackButton?canvasDialogImageIndex-1:canvasDialogImageIndex+1)}>
      {isBackButton?
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 200 200"><g transform="translate(-15.823 -265.198)"><path d="M115.823,265.2a100,100,0,1,0,100,100,100,100,0,0,0-100-100ZM128.5,309.54a10.887,10.887,0,0,1,7.3,19.221l-39.041,33.7,37.433,37.452a10.888,10.888,0,0,1-15.4,15.4L73.084,369.585a10.887,10.887,0,0,1,.578-15.927l47.893-41.373a10.888,10.888,0,0,1,6.943-2.745Z" fill={canvasDialogImageIndex==0?'rgb(210, 210, 210)' :'rgb(62, 82, 110)'} transform="translate(0 0)"/></g></svg>
        :
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 200 200"><g transform="translate(-15.823 -265.198)"><path d="M115.823,265.2a100,100,0,1,0,100,100,100,100,0,0,0-100-100ZM103.146,309.54a10.889,10.889,0,0,1,6.943,2.745l47.893,41.373a10.887,10.887,0,0,1,.578,15.927l-45.707,45.727a10.888,10.888,0,1,1-15.4-15.4l37.433-37.452-39.041-33.7a10.887,10.887,0,0,1,7.3-19.221Z" fill={canvasDialogImageIndex==showImageDataList.length-1?'rgb(210, 210, 210)' :'rgb(62, 82, 110)'}  transform="translate(0 0)"/></g></svg>
      }
    </button>
	);
}

export default CanvasDialogSliderButton;