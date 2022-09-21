import type { NextPage } from 'next'
import React, { ChangeEvent }  from 'react';
import paperSizeList from '../../utils/PaperSizeList';

type Props = {
  setWidth: (value: React.SetStateAction<number>) => void,
  setHeight: (value: React.SetStateAction<number>) => void,
  setBackgroundImage: (value: React.SetStateAction<string>) => void,
}

const NewNoteDialogNoteSizeChoices: NextPage<Props> = (props) => {
  const { setWidth, setHeight, setBackgroundImage } = props;

  // ノートのサイズ選択
  const changePaperSize = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    const val = e.target.value.split(',');
    const width = Number(val[0]);
    const height = Number(val[1]);
    const backgroundImage = val[2];
    setWidth(width);
    setHeight(height);
    setBackgroundImage(backgroundImage);
  }
  
  return (
    <div className='text-center'>
      <h4 className='mb-1 font-bold text-center'>ノートのサイズを選択</h4>
      <select className='px-20 py-2 text-white bg-gray-700 rounded-lg' name="size" id="size-select" onChange={changePaperSize}>
        {paperSizeList.map((size, i) => (
          <option value={[String(size.width), String(size.height), String(size.imageUrl)]} key={i}>{size.size}</option>
        ))}
      </select>
    </div>
  );
}

export default NewNoteDialogNoteSizeChoices;