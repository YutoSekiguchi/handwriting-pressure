import type { NextPage } from 'next'
import CanvasDialogSliderButton from './CanvasDialogSliderButton';

type ImageDataObject = {
  url: string,
  strokeData: (string|object)[][],
  pressureArray: number[],
  boundaryPressure: number,
  isShowStrokeList: number[],
}

type Props = {
  closeDialog: (e: any)=>void,
  showDialog: (i: number)=>void,
  canvasDialogImageIndex: number,
  canvasBackgroundImageUrl: string,
  showImageDataList: ImageDataObject[],
  changeShowStroke: (data: any, pressureData: number[], boundaryPressure: number, isShowStrokeList :number[], index: number)=>void,
}

const CanvasDialog: NextPage<Props> = (props) => {
  const {closeDialog, showDialog, canvasDialogImageIndex, canvasBackgroundImageUrl, showImageDataList, changeShowStroke} = props;

	return (
		<div className="overlay" onClick={closeDialog}>
      <div className="overlay-content bg-gray-50">
        <div className="flex items-center justify-center w-full h-full">
          <div className="mr-2 logBackButton">
            <CanvasDialogSliderButton
              showDialog={showDialog}
              canvasDialogImageIndex={canvasDialogImageIndex}
              showImageDataList={showImageDataList}
              isBackButton={true}
            />
          </div>

          <div className='flex-col items-center justify-center w-full h-full'>
            {/* 画像表示 */}
            <div className="relative w-full h-4/5">
              <img src={canvasBackgroundImageUrl} className="absolute top-0 left-0 object-contain w-full h-full" />
              <img src={showImageDataList[canvasDialogImageIndex].url} className="absolute top-0 left-0 object-contain w-full h-full" />
            </div>
            {/* 反映ボタン */}
            <div className='w-full mt-6 text-center decideButton h-1/5'>
              <button
                className='px-3 py-1 text-white bg-gray-800 rounded-lg'
                onClick={() => changeShowStroke(
                  showImageDataList[canvasDialogImageIndex].strokeData, 
                  showImageDataList[canvasDialogImageIndex].pressureArray, 
                  showImageDataList[canvasDialogImageIndex].boundaryPressure,
                  showImageDataList[canvasDialogImageIndex].isShowStrokeList,
                  canvasDialogImageIndex
                )}
              >
                change note
              </button>
            </div>
          </div>

          <div className="ml-2 logForwardButton">
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