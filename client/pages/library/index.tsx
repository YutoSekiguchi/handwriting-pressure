import type { NextPage } from 'next'
import React, { ChangeEvent, useState, useEffect } from 'react';
import Head from 'next/head'
import AppHeader from '../../components/common/AppHeader';
import lscache from 'lscache';
import Image from 'next/image';
import { usePapers } from '../../hooks/contexts/papersContext';
import { usePaperDetails } from '../../hooks/contexts/paperDetailsContext';
import { stringify } from 'querystring';

type FolderObj = {
  ID: number,
  UID: number,
  Name: string,
  CreatedAt: string
}

type NoteObj = {
  ID: number,
  PID: number,
  UID: number,
  Title: string,
  PaperWidth: number,
  PaperHeight: number,
  PaperImage: string,
  PaperJson: string,
  PressureList: string,
  BackgroundImage: string,
  CreatedAt: string,
}

type FolderIndexAndPIDObj = {
  pid: number,
  index: number
}

const Library: NextPage = () => {
  const userData = lscache.get('loginUserData');
  const papers: any = usePapers();
  const paperDetails: any = usePaperDetails();
  const [paperAddInput, setPaperAddInput] = useState<boolean>(false); // 追加のためのinputタグを開くかどうか
  const [folderName, setFolderName] = useState<string>(''); // 追加しようとしてるフォルダの名前
  const [allFolderData, setAllFolderData] = useState<FolderObj[]>([]); // 全てのフォルダのデータ
  const [openFolderIndexAndPID, setOpenFolderIndexAndPID] = useState<FolderIndexAndPIDObj|null>(null); // 開いてるフォルダの番号(index)
  const [noteList, setNoteList] = useState<NoteObj[]>([]); // フォルダの中にあるノート一覧
  const [newNoteDialog, setNewNoteDialog] = useState<boolean>(false);
  const [noteName, setNoteName] = useState<string>('');
  
  // フォルダの追加のためにinputタグ開く
  const handleAddPaper = () => {
    setPaperAddInput(true);
  }

  // 新規フォルダのinputタグ閉じる
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

  // フォルダの名前入力
  const changeFolderName = (e: ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  }

  // ノートの名前入力
  const changeNoteName = (e: ChangeEvent<HTMLInputElement>) => {
    setNoteName(e.target.value);
  }

  // フォルダクリック時
  const handleClickFolder = async(pid: number, i: number) => {
    await paperDetails.getPaperDetailsByPID(pid);
    setOpenFolderIndexAndPID({pid: pid, index: i});
  }

  // uidからフォルダをとってくる
  const getPapersData = async() => {
    if(userData) {
      await papers.getPapersByUID(userData['ID']);
    }
  }

  // ノートを作るためにプラスマークを押下時
  const createNewNote = async() => {
    if (userData) {
      setNewNoteDialog(true);
    }
  }

  // ノート作成ダイアログを閉じる
  const closeNewNoteDialog = (e: any) => {
    if (e.target.className == 'overlay') {
      setNewNoteDialog(false);
    } else {
      return;
    }
  }

  // ノート作成ボタン押下時
  const onSubmitNote = async() => {
    if (noteName===''||noteName===null) {
      alert('ノートの名前を入力してください');
      return;
    }
    const data = {
      PID: openFolderIndexAndPID?.pid,
      UID: userData?.ID,
      Title: noteName,
      PaperWidth: 0,
      PaaperHeight: 0,
      PaperImage: '',
      PaperJson: '',
      PressureList: '',
      BackgroundImage: '',
    }
    await paperDetails.createPaperDetail(data);
    setNoteName('');
    // window.location.href=('/note');
  }

  useEffect(() => {
    getPapersData();
  }, [])

  useEffect(() => {
    setAllFolderData(papers.state.papersList);
  }, [papers.state])

  useEffect(() => {
    setNoteList(paperDetails.state.paperDetailsList);
  }, [paperDetails.state])

	return (
    <>
      <div className='fixed w-full h-full bg-gray-800'>
        <AppHeader />
        {newNoteDialog&&
          <div className="overlay" onClick={closeNewNoteDialog}>
            <div className="overlay-content">
              <div className="w-full h-full flex justify-center items-center relative">
                <div className='flex-col'>
                  <h4 className='text-center font-bold mb-1'>ノートのタイトルを入力</h4>
                  <input 
                    type={"text"}
                    name="noteName"
                    required
                    autoComplete='off'
                    className='py-2 px-3 mb-3 rounded-lg bg-gray-700 text-white'
                    onInput={changeNoteName}
                  />
                </div>
                <button className='px-3 py-1 text-white bg-gray-800 rounded-lg absolute bottom-3' onClick={onSubmitNote}>
                  <p className='font-bold'>作成</p>
                </button>
              </div>
            </div>
          </div>
        }
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
            <div className='flex-col mt-16 mx-6 h-full'>
              {openFolderIndexAndPID&&
                <div>
                </div>
              }

              {openFolderIndexAndPID&&openFolderIndexAndPID.index>=0&&
                <div className='flex w-full h-full'>
                  {noteList&&
                    noteList.map((note, i) => (
                      <div className='mr-4 mb-2' key={i}>
                        <div className='border-gray-300 w-36 h-48 border flex items-center justify-center cursor-pointer'>
                          ここに画像
                        </div>
                        <p className='text-white text-center'>{note.Title}</p>
                      </div>
                    ))
                  }
                  <div className='border-gray-300 w-36 h-48 border-dashed border flex items-center justify-center cursor-pointer' onClick={createNewNote}>
                    <div className='rounded-full bg-sky-900 w-16 h-16 items-center flex justify-center'>
                      <Image src={'/plus.svg'} width={30} height={30} />
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
	);
}

export default Library