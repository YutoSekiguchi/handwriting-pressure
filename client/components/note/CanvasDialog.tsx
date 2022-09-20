import type { NextPage } from 'next'
import CanvasDialogSliderButton from './CanvasDialogSliderButton';

type ImageDataObject = {
  url: string,
  strokeData: (string|object)[][],
  pressureArray: number[],
  boundaryPressure: number
}

type Props = {
  closeDialog: (e: any)=>void,
  showDialog: (i: number)=>void,
  canvasDialogImageIndex: number,
  canvasBackgroundImageUrl: string,
  showImageDataList: ImageDataObject[],
  changeShowStroke: (data: any, pressureData: number[], boundaryPressure: number)=>void,
}

const CanvasDialog: NextPage<Props> = (props) => {
  const {closeDialog, showDialog, canvasDialogImageIndex, canvasBackgroundImageUrl, showImageDataList, changeShowStroke} = props;

	return (
		<div className="overlay" onClick={closeDialog}>
      <div className="overlay-content">
        <div className="w-full h-full flex justify-center items-center">
          <div className="logBackButton mr-2">
            <CanvasDialogSliderButton
              showDialog={showDialog}
              canvasDialogImageIndex={canvasDialogImageIndex}
              showImageDataList={showImageDataList}
              isBackButton={true}
            />
          </div>

          <div className='flex-col w-full h-full justify-center items-center'>
            {/* 画像表示 */}
            <div className="relative w-full h-4/5">
              <img src={canvasBackgroundImageUrl} className="absolute top-0 left-0 w-full h-full object-contain" />
              <img src={showImageDataList[canvasDialogImageIndex].url} className="absolute top-0 left-0 w-full h-full  object-contain" />
            </div>
            {/* 反映ボタン */}
            <div className='decideButton w-full h-1/5 text-center mt-6'>
              <button className='bg-gray-800 py-1 px-3 text-white rounded-lg' onClick={() => changeShowStroke(showImageDataList[canvasDialogImageIndex].strokeData, showImageDataList[canvasDialogImageIndex].pressureArray, showImageDataList[canvasDialogImageIndex].boundaryPressure)}>
                change note
              </button>
            </div>
          </div>

          <div className="logForwardButton ml-2">
            <CanvasDialogSliderButton
              showDialog={showDialog}
              canvasDialogImageIndex={canvasDialogImageIndex}
              showImageDataList={showImageDataList}
              isBackButton={false}
            />
          </div>
        </div>
        
      </div>
    </div>
	);
}

export default CanvasDialog;