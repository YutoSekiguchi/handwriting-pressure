import type { NextPage } from 'next'
import React, { ChangeEvent, useState, useEffect } from 'react';
import Head from 'next/head'
import AppHeader from '../../components/common/AppHeader';
import lscache from 'lscache';
import Image from 'next/image';
import { usePapers } from '../../hooks/contexts/papersContext';

type FolderObj = {
  ID: number,
  UID: number,
  Name: string,
  CreatedAt: string
}

const Library: NextPage = () => {
  const userData = lscache.get('loginUserData');
  const papers: any = usePapers();
  const [paperAddInput, setPaperAddInput] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  const [allFolderData, setAllFolderData] = useState<FolderObj[]>([]);
  const [openFolderIndex, setOpenFolderIndex] = useState<number>(0);
  
  const handleAddPaper = () => {
    setPaperAddInput(true);
  }

  const handleClosePaperAddInput = async(e: any) => {
    if (e.target.id !== 'add-folder-button'&&e.target.id !== 'folder-input') {
      setPaperAddInput(false);
      if (folderName!=''&&folderName!=null) {
        const data = {
          UID: userData.ID,
          Name: folderName,
        } 
        await papers.createPaper(data);
        setFolderName('');
        getPapersData();
      }
    } else {
      return;
    }
  }

  const changeFolderName = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  }

  const handleClickFolder = (pid: number, i: number) => {
    setOpenFolderIndex(i);
  }

  const getPapersData = async() => {
    await papers.getPapersByUID(userData['ID']);
  }

  useEffect(() => {
    getPapersData();
  }, [])

  useEffect(() => {
    setAllFolderData(papers.state.papersList);
  }, [papers.state])

	return (
    <>
      <div className='fixed w-full h-full bg-gray-800'>
        <AppHeader />
        <div className="w-full h-full flex" onClick={handleClosePaperAddInput}>
          <div className='w-1/6 h-full bg-gray-900 border-r-2 border-sky-200'>
            <div className='flex-col mt-12'>
              {/* 名前とフォルダ追加ボタン */}
              <div className='flex justify-between items-center bg-gray-700 px-6'>
                <h4 className='font-bold text-center text-white my-2' suppressHydrationWarning>
                  {userData&&userData.Name}
                </h4>
                <button className='text-white' id="add-folder-button" onClick={handleAddPaper} >
                  <Image src={'/plus.svg'} id="add-folder-button" width={10} height={10} />
                </button>
              </div>

              {/* フォルダ一覧 */}
              {allFolderData&&
                allFolderData.map((obj, i) => (
                  <div className='flex pl-10 cursor-pointer border-b border-gray-600 py-1' key={i} onClick={() => handleClickFolder(obj.ID, i)}>
                    <Image src={'/folder.svg'} width={15} height={15} />
                    <h6 className='text-white pl-2'>{obj.Name}</h6>
                  </div>
                ))
              }

              {/* フォルダ新規追加 */}
              {paperAddInput&&
                <div className='flex pl-10 cursor-pointer border-b border-gray-600 folder-input'>
                  <Image src={'/folder.svg'} width={15} height={15} />
                  <input type="text" onInput={changeFolderName} id="folder-input" className="bg-gray-700 text-white w-4/5 ml-2 my-1" autoFocus />
                </div>
              }
            </div>
          </div>

          <div className='w-5/6 h-full bg-gray-800'>
            <div className='flex-col mt-12'>
              {openFolderIndex==0&&<div></div>}
              {openFolderIndex>0&&
                <>
                  
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </>
	);
}

export default Library