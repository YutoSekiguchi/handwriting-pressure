import type { NextPage } from 'next'
import React, { ChangeEvent, useState, useEffect } from 'react';
import Head from 'next/head'
import AppHeader from '../../components/common/AppHeader';
import lscache from 'lscache';
import Image from 'next/image';
import { usePapers } from '../../hooks/contexts/papersContext';
import { usePaperDetails } from '../../hooks/contexts/paperDetailsContext';
import { useRouter } from 'next/router';
import DeleteDialog from '../../components/library/DeleteDialog';

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
  BoundaryPressure: number,
  AvgPressure: number,
  BackgroundImage: string,
  CreatedAt: string,
}

type FolderIndexAndPIDObj = {
  pid: number,
  index: number
}

const Library: NextPage = () => {
  const userData = lscache.get('loginUserData');
  const router = useRouter();
  const papers: any = usePapers();
  const paperDetails: any = usePaperDetails();
  const [paperAddInput, setPaperAddInput] = useState<boolean>(false); // 追加のためのinputタグを開くかどうか
  const [folderName, setFolderName] = useState<string>(''); // 追加しようとしてるフォルダの名前
  const [allFolderData, setAllFolderData] = useState<FolderObj[]>([]); // 全てのフォルダのデータ
  const [openFolderIndexAndPID, setOpenFolderIndexAndPID] = useState<FolderIndexAndPIDObj|null>(null); // 開いてるフォルダの番号(index)
  const [noteList, setNoteList] = useState<NoteObj[]>([]); // フォルダの中にあるノート一覧
  const [newNoteDialog, setNewNoteDialog] = useState<boolean>(false);
  const [noteName, setNoteName] = useState<string>('');
  const [width, setWidth] = useState<number>(210);
  const [height, setHeight] = useState<number>(297);
  const [userName, setUserName] = useState<string>('');
  const [deleteDialogID, setDeleteDialogID] = useState<number|null>(null); // 削除確認ダイアログ
  
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

  const handleNoSelectedFolder = (e: any) => {
    if (e.target.id==='folder-outer') {
      setOpenFolderIndexAndPID(null);
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
      setUserName(userData['Name']);
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


  const openDeleteDialog = (pdid: number) => {
    setDeleteDialogID(pdid);
  }

  // deleteダイアログを閉じる
  const closeDeleteDialog = (e: any) => {
    if (e.target.className == 'overlay') {
      setDeleteDialogID(null);
    } else {
      return;
    }
  }

  // ノートのサイズ選択
  const changePaperSize = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value)
    const val = e.target.value;
    switch(val) {
      case 'a4':
        setWidth(210);
        setHeight(297);
        break;
      case 'a4side':
        setWidth(297);
        setHeight(210);
        break;
      case 'a3':
        setWidth(297);
        setHeight(420);
        break;
      case 'a3side':
        setWidth(420);
        setHeight(297);
        break;
      case 'b5':
        setWidth(182);
        setHeight(257);
        break;
      case 'b5side':
        setWidth(257);
        setHeight(182);
        break;
      case 'b4':
        setWidth(257);
        setHeight(364);
        break;
      case 'b4side':
        setWidth(364);
        setHeight(257);
        break;
      default:
        setWidth(210);
        setHeight(297);
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
      PaperWidth: width,
      PaperHeight: height,
      PaperImage: '',
      PaperJson: '',
      PressureList: '',
      BoundaryPressure: 0,
      AvgPressure: 0,
      BackgroundImage: 'https://celclipmaterialprod.s3-ap-northeast-1.amazonaws.com/91/01/1880191/thumbnail?1637291685',
    }
    await paperDetails.createPaperDetail(data);
    setNoteName('');
  }

  // ノートをクリックした時
  const moveNotePage = async(pdid: number, uid: number) => {
    // window.location.href=(`/note/${pdid}/${uid}`);
    // router.push({pathname: `/note/[pdid]/[uid]`, query: { pdid: pdid, uid: uid },});
    router.replace({pathname: `/note/[pdid]/[uid]`, query: { pdid: pdid, uid: uid },});
  }


  // ノートの削除
  const handleDeletePaper = async(pdid: number) => {
    await paperDetails.deletePaperDetail(pdid);
    alert('削除しました');
    setDeleteDialogID(null);
    await paperDetails.getPaperDetailsByPID(openFolderIndexAndPID?.pid);
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

  useEffect(() => {
    if(paperDetails.state.paperDetail?.ID) {
      moveNotePage(paperDetails.state.paperDetail.ID, userData.ID);
    }
  }, [paperDetails.state.paperDetail])

	return (
    <>
      <div className='fixed w-full h-full bg-gray-800'>
        <AppHeader />
        {newNoteDialog&&
          <div className="overlay" onClick={closeNewNoteDialog}>
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

                  <div className='text-center'>
                    <h4 className='mb-1 font-bold text-center'>ノートのサイズを選択</h4>
                    <select className='px-20 py-2 text-white bg-gray-700 rounded-lg' name="size" id="size-select" onChange={changePaperSize}>
                      <option value="a4">A4</option>
                      <option value="a3">A5</option>
                      <option value="b5">B5</option>
                      <option value="b4">B4</option>
                      <option value="a4side">A4横</option>
                      <option value="a3side">A5横</option>
                      <option value="b5side">B5横</option>
                      <option value="b4side">B4横</option>
                    </select>
                  </div>
                </div>
                <button className='absolute px-3 py-1 text-white bg-gray-800 rounded-lg bottom-3' onClick={onSubmitNote}>
                  <p className='font-bold'>作成</p>
                </button>
              </div>
            </div>
          </div>
        }

        {deleteDialogID&&
          <DeleteDialog
            closeDialog={closeDeleteDialog}
            handleDeletePaper={handleDeletePaper}
            pdid={deleteDialogID}
            setDeleteDialogID={setDeleteDialogID}
          />
        }
        
        <div className="flex w-full h-full" onClick={handleClosePaperAddInput}>
          <div className='w-1/6 h-full bg-gray-900 border-r-2 border-sky-200' id="folder-outer" onClick={handleNoSelectedFolder}>
            <div className='flex-col mt-12'>
              {/* 名前とフォルダ追加ボタン */}
              <div className='flex items-center justify-between px-6 bg-gray-700' suppressHydrationWarning>
                <h4 className='my-2 font-bold text-center text-white'>
                  {userName}<span className='text-xs font-medium'>さん</span>
                </h4>
                <button className='text-white' id="add-folder-button" onClick={handleAddPaper} >
                  <Image src={'/plus.svg'} id="add-folder-button" width={10} height={10} />
                </button>
              </div>

              {/* フォルダ一覧 */}
              {allFolderData&&
                allFolderData.map((obj, i) => (
                  <div className='flex py-1 pl-10 border-b border-gray-600 cursor-pointer' key={i} onClick={() => handleClickFolder(obj.ID, i)}>
                    <Image src={'/folder.svg'} width={15} height={15} />
                    <h6 className='pl-2 text-white'>{obj.Name}</h6>
                  </div>
                ))
              }

              {/* フォルダ新規追加 */}
              {paperAddInput&&
                <div className='flex pl-10 border-b border-gray-600 cursor-pointer folder-input'>
                  <Image src={'/folder.svg'} width={15} height={15} />
                  <input type="text" onInput={changeFolderName} id="folder-input" className="w-4/5 my-1 ml-2 text-white bg-gray-700" autoFocus />
                </div>
              }
            </div>
          </div>

          <div className='w-5/6 h-full bg-gray-800'>
            <div className='flex-col h-full mx-6 mt-16'>
              {!openFolderIndexAndPID&&
                <div className='h-full mt-12 text-center'>
                  <h3 className='justify-around font-bold text-white'>〜ノートライブラリ〜</h3>
                  <div className='flex justify-center py-6 mt-12 bg-gray-900 border-8 border-white h-1/3 rounded-3xl'>
                    <img src={'/make_folder.png'} className="object-contain w-1/4" />
                    <div className='flex-col w-1/2 my-auto ml-12'>
                      <h4 className='mb-3 text-white'>〜フォルダ作成方法〜</h4>
                      <h4 className='text-left text-white'>&emsp;ユーザ名の横にあるプラスボタンをクリックして，フォルダの名前を入力することで，新しいフォルダを作成することができます</h4>
                    </div>
                  </div>

                  <div className='flex justify-center py-6 mt-12 bg-gray-900 border-8 border-white rounded-3xl h-1/3'>
                    <img src={'/make_note.png'} className="object-contain w-1/4" />
                    <div className='flex-col w-1/2 my-auto ml-12'>
                      <h4 className='mb-3 text-white'>〜ノート作成方法〜</h4>
                      <h4 className='text-left text-white'>&emsp;このプラスマークを押してノートの名前を入力することで，新規ノートを作成できます</h4>
                    </div>
                  </div>
                </div>
              }

              {openFolderIndexAndPID&&openFolderIndexAndPID.index>=0&&
                <div className='flex flex-wrap'>
                  {noteList&&
                    noteList.map((note, i) => (
                      <div className='mb-3 mr-4' key={i}>
                        <div className='flex items-center justify-center h-48 border border-gray-300 cursor-pointer w-36' onClick={() => moveNotePage(note.ID, note.UID)}>
                          {note.PaperImage!=''
                            ? <div className="relative w-full h-full">
                                <img src={note.BackgroundImage} className="stroke-image" style={{height: `${note.PaperHeight/2}px`, maxHeight: '100%', width: `${note.PaperWidth/2}px`, maxWidth: '100%'}} />
                                <img src={note.PaperImage} className="stroke-image" style={{height: `${note.PaperHeight/2}px`, maxHeight: '100%', width: `${note.PaperWidth/2}px`, maxWidth: '100%'}} />
                              </div>
                            : <img src={note.BackgroundImage} />
                          }
                        </div>
                        <div className='flex items-center justify-center'>
                          <p className='mr-2 text-center text-white'>{note.Title}</p>
                          <button className='flex items-center justify-center' onClick={() => openDeleteDialog(note.ID)}>
                            <Image src={'/trash.svg'} width={15} height={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  }
                  <div className='flex items-center justify-center h-48 border border-gray-300 border-dashed cursor-pointer w-36' onClick={createNewNote}>
                    <div className='flex items-center justify-center w-16 h-16 rounded-full bg-sky-900'>
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