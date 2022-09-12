import type { NextPage } from 'next';
import React, { ChangeEvent } from 'react';
import Image from 'next/image';

type Props = {
  setFolderName: React.Dispatch<React.SetStateAction<string>>
}

const InputNewFolder: NextPage<Props> = (props) => {
  const {setFolderName} = props;

  // フォルダの名前入力
  const changeFolderName = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  }
  
  return (
    <div className='flex pl-2 border-b border-gray-600 cursor-pointer folder-input'>
      <Image src={'/folder.svg'} width={15} height={15} />
      <input type="text" onInput={changeFolderName} id="folder-input" className="w-4/5 my-1 ml-2 text-white bg-gray-700" autoFocus />
    </div>
  );
}

export default InputNewFolder;