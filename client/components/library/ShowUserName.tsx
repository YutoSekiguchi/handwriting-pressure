import type { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';

type Props = {
  userName: string,
  setPaperAddInput: (value: React.SetStateAction<boolean>) => void,
}

const ShowUserName: NextPage<Props> = (props) => {
  const { userName, setPaperAddInput } = props;
  
  // フォルダの追加のためにinputタグ開く
  const handleAddPaper = () => {
    setPaperAddInput(true);
  }
  
  return (
    <div className='flex items-center justify-between px-6 bg-gray-700' suppressHydrationWarning>
      <h4 className='my-2 font-bold text-center text-white'>
        {userName}<span className='text-xs font-medium'>さん</span>
      </h4>
      <button className='text-white' id="add-folder-button" onClick={handleAddPaper} >
        <Image src={'/plus.svg'} id="add-folder-button" width={10} height={10} />
      </button>
    </div>
  );
}

export default ShowUserName;