import type { NextPage } from 'next'
import { useState, Dispatch, SetStateAction, MouseEventHandler } from 'react';
import BackButton from '../common/BackButton';
import ColorButton from './ColorButton';
import PenButton from './PenButton';
import EraserButton from './EraserButton';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';

type Props = {
  setColor: Dispatch<SetStateAction<string>>,
  setPenWidth: Dispatch<SetStateAction<number>>,
  setEraseWidth: Dispatch<SetStateAction<number>>,
  setMode: Dispatch<SetStateAction<'pen' | 'erase'>>,
  undo: any,
  redo: any,
  undoable: boolean,
  redoable: boolean,
  func: MouseEventHandler<HTMLButtonElement> | undefined,
}

const PaperHeader: NextPage<Props> = (props) => {

  const {setColor, setPenWidth, setEraseWidth, setMode, undo, redo, undoable, redoable, func} = props;

  let mode: 'pen'|'erase' = 'pen';
  const [nowMode, setNowMode] = useState<'pen'|'erase'>('pen');

  const colorList: string[] = ['#000000', '#808080', '#D9D9D9', '#1C8CFF', '#FF1A40', '#2BD965', '#FFDD33'];

  const  [clickList, setClickList] = useState<number[]>([1].concat([...Array(colorList.length -1)].map(x => 0)));


  const buttonClick = (label: string, index: number) => {
    setColor(label)
    let tmp = clickList;
    for (let i=0; i<clickList.length; i++) {
      if (i == index) {
        tmp[i] = 1;
      } else {
        tmp[i] = 0;
      }
    }
    penMode();
    setClickList(tmp);
  }

  // 消しゴムモードに
  const eraseMode = () => {
    mode = 'erase';
    setMode(mode);
    setNowMode(mode);
  }

  // ペンモードに
  const penMode = () => {
    mode = 'pen';
    setMode(mode);
    setNowMode(mode);
  }

	return (
		<div className="fixed flex w-full h-12 mb-5 PaperHeader bg-cyan-900">
      <div className='flex justify-center ml-3 LeftSide'>
        <BackButton buttonText='戻る' />
      </div>
      <div className='mx-auto my-auto CenterSide'>
        <div className="flex ColorChoiceButtons">
          <div className='mr-2 PenButtons' onClick={eraseMode}>
            <EraserButton setEraseWidth={setEraseWidth} mode={nowMode} />
          </div>
          <div className='mr-2 PenButtons' onClick={penMode}>
            <PenButton setPenWidth={setPenWidth} mode={nowMode} />
          </div>
          {colorList.map((label, index) => (
            <div onClick={() => buttonClick(label, index)} key={index} className='my-auto'>
              <ColorButton buttonColor={label} isChoice={clickList[index]} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center RightSide">
        <div className="flex UndoRedoButtons">
          <div className="mr-2 UndoButton" onClick={() => undo()}>
            <UndoButton undoable={undoable} />
          </div>
          <div className="RedoButton" onClick={() => redo()}>
            <RedoButton redoable={redoable} />
          </div>
        </div>
        <button className='px-3 py-1 ml-2 mr-2 bg-gray-800 rounded-lg text-gray-50' onClick={func}>
          <p>保存</p>
        </button>
      </div>
		</div>
	);
}

export default PaperHeader;
