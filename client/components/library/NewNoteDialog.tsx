import type { NextPage } from 'next'
import React, { ChangeEvent } from 'react'; 
import NewNoteDialogNoteSizeChoices from './NewNoteDialogNoteSizeChoices';

type Props = {
  setWidth: (value: React.SetStateAction<number>) => void,
  setHeight: (value: React.SetStateAction<number>) => void,
  setNoteName: (value: React.SetStateAction<string>) => void,
  closeNewNoteDialog:  (state: (value: React.SetStateAction<any>) => void, val: false|null, e: any) => void,
  setNewNoteDialog: (value: React.SetStateAction<boolean>) => void,
  onSubmitNote: () => Promise<void>,
}

const NewNoteDialog: NextPage<Props> = (props) => {
  const { setWidth, setHeight, setNoteName, closeNewNoteDialog, setNewNoteDialog, onSubmitNote } = props;
  // ノートの名前入力
  const changeNoteName = (e: ChangeEvent<HTMLInputElement>) => {
    setNoteName(e.target.value);
  }
  
  return (
    <div className="overlay" onClick={(event) => closeNewNoteDialog(setNewNoteDialog, false, event)}>
      <div className="overlay-content">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className='flex-col text-center'>
            <h4 className='mb-1 font-bold text-center'>ノートのタイトルを入力</h4>
            <input 
              type={"text"}
              name="noteName"
              required
              autoComplete='off'
              className='px-3 py-2 mb-6 text-center text-white bg-gray-700 rounded-lg'
              onInput={changeNoteName}
              autoFocus
            />
            <NewNoteDialogNoteSizeChoices 
              setWidth={setWidth}
              setHeight={setHeight}
            />
          </div>
          <button className='absolute px-3 py-1 text-white bg-gray-800 rounded-lg bottom-3' onClick={onSubmitNote}>
            <p className='font-bold'>作成</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewNoteDialog;