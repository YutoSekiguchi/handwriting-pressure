import type { NextPage } from 'next'
import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import BackButton from '../common/BackButton';
import ColorButton from './ColorButton';
import PenButton from './PenButton';
import EraserButton from './EraserButton';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';

type Props = {
  setColor: Dispatch<SetStateAction<string>>,
  setWidth: Dispatch<SetStateAction<number>>,
  setMode: Dispatch<SetStateAction<'pen' | 'erase'>>,
  undo: any,
  redo: any,
  undoable: boolean,
  redoable: boolean,
}

const PaperHeader: NextPage<Props> = (props) => {

  const {setColor, setWidth, setMode, undo, redo, undoable, redoable} = props;

  let mode: 'pen'|'erase';

  const colorList: string[] = ['#000000', '#808080', '#D9D9D9', '#1C8CFF', '#FF1A40', '#2BD965', '#FFDD33'];

  const  [clickList, setClickList] = useState<number[] | any>([1].concat([...Array(colorList.length -1)].map(x => 0)));


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
    setClickList(tmp);
  }

  // 消しゴムモードに
  const eraseMode = () => {
    mode = 'erase';
    setMode(mode);
  }

  // ペンモードに
  const penMode = () => {
    mode = 'pen';
    setMode(mode);
  }

	useEffect(() =>{
	}, []);
	return (
		<div className="PaperHeader fixed bg-slate-200 w-full h-12 mb-5 flex">
      <div className='LeftSide flex justify-center ml-3'>
        <BackButton buttonText='戻る' />
      </div>
      <div className='CenterSide my-auto mx-auto'>
        <div className="ColorChoiceButtons flex">
          <div className='PenButtons mr-2' onClick={eraseMode}>
            <EraserButton setWidth={setWidth} />
          </div>
          <div className='PenButtons mr-2' onClick={penMode}>
            <PenButton setWidth={setWidth} />
          </div>
          {colorList.map((label, index) => (
            <div onClick={() => buttonClick(label, index)} key={index} className='my-auto'>
              <ColorButton buttonColor={label} isChoice={clickList[index]} />
            </div>
          ))}
        </div>
      </div>
      <div className="RightSide flex items-center">
        <div className="UndoRedoButtons flex">
          <div className="UndoButton mr-2" onClick={() => undo()}>
            <UndoButton undoable={undoable} />
          </div>
          <div className="RedoButton" onClick={() => redo()}>
            <RedoButton redoable={redoable} />
          </div>
        </div>
      </div>
		</div>
	);
}

export default PaperHeader;
