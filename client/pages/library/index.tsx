import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import AppHeader from '../../components/common/AppHeader';
import lscache from 'lscache';
import { usePapers } from '../../hooks/contexts/papersContext';
import { usePaperDetails } from '../../hooks/contexts/paperDetailsContext';
import { useRouter } from 'next/router';
import DeleteDialog from '../../components/library/DeleteDialog';
import NewNoteDialog from '../../components/library/NewNoteDialog';
import ShowUserName from '../../components/library/ShowUserName';
import FolderList from '../../components/library/FolderList';
import InputNewFolder from '../../components/library/InputNewFolder';
import Explanation from '../../components/library/Explanation';
import NoteList from '../../components/library/NoteList';

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
  const [backgroundImage, setBackgroundImage] = useState<string>("https://celclipmaterialprod.s3-ap-northeast-1.amazonaws.com/91/01/1880191/thumbnail?1637291685");
  const [userName, setUserName] = useState<string>('');
  const [deletePaperDetailDialogID, setDeletePaperDetailDialogID] = useState<number|null>(null); // ノート削除確認ダイアログ
  const [deletePaperDialogID, setDeletePaperDialogID] = useState<number|null>(null); // フォルダ削除確認ダイアログ
  
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

  // uidからフォルダをとってくる
  const getPapersData = async() => {
    if(userData) {
      await papers.getPapersByUID(userData['ID']);
      setUserName(userData['Name']);
    }
  }

  const closeDialog = (state: (value: React.SetStateAction<any>) => void, val: false|null, e: any) => {
    if (e.target.className == 'overlay') {
      state(val);
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
      PaperWidth: width,
      PaperHeight: height,
      PaperImage: '',
      PaperJson: '',
      PressureList: '',
      BoundaryPressure: 0,
      AvgPressure: 0,
      BackgroundImage: backgroundImage,
      // BackgroundImage: 'https://celclipmaterialprod.s3-ap-northeast-1.amazonaws.com/91/01/1880191/thumbnail?1637291685',
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
    setDeletePaperDetailDialogID(null);
    await paperDetails.getPaperDetailsByPID(openFolderIndexAndPID?.pid);
  }

  // フォルダの削除
  const handleDeleteFolder = async(id: number) => {
    await papers.deletePaper(id);
    alert('削除しました');
    setDeletePaperDialogID(null);
    await getPapersData();
    setOpenFolderIndexAndPID(null);
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
          <NewNoteDialog
            setWidth={setWidth}
            setHeight={setHeight}
            setBackgroundImage={setBackgroundImage}
            setNoteName={setNoteName}
            closeNewNoteDialog={closeDialog}
            setNewNoteDialog={setNewNoteDialog}
            onSubmitNote={onSubmitNote}
          />
        }

        {deletePaperDetailDialogID&&
          <DeleteDialog
            closeDialog={closeDialog}
            handleDelete={handleDeletePaper}
            id={deletePaperDetailDialogID}
            setDeleteDialogID={setDeletePaperDetailDialogID}
          />
        }
        
        {deletePaperDialogID&&
          <DeleteDialog
            closeDialog={closeDialog}
            handleDelete={handleDeleteFolder}
            id={deletePaperDialogID}
            setDeleteDialogID={setDeletePaperDialogID}
          />
        }
        
        <div className="flex w-full h-full" onClick={handleClosePaperAddInput}>
          <div className='w-1/2 h-full bg-gray-900 border-r-2 border-sky-200' id="folder-outer" style={{"maxWidth": "200px"}} onClick={handleNoSelectedFolder}>
            <div className='flex-col mt-12'>
              {/* 名前とフォルダ追加ボタン */}
              <ShowUserName 
                userName={userName}
                setPaperAddInput={setPaperAddInput}
              />

              {/* フォルダ一覧 */}
              {allFolderData&&
                <FolderList
                  allFolderData={allFolderData}
                  openFolderIndexAndPID={openFolderIndexAndPID}
                  setOpenFolderIndexAndPID={setOpenFolderIndexAndPID}
                  setDeletePaperDialogID={setDeletePaperDialogID}
                />
              }

              {/* フォルダ新規追加 */}
              {paperAddInput&&
                <InputNewFolder
                  setFolderName={setFolderName}
                />
              }
            </div>
          </div>

          <div className='w-5/6 h-full bg-gray-800'>
            <div className='flex-col h-full mx-6 mt-16'>
              {!openFolderIndexAndPID&&
                <Explanation />
              }

              {openFolderIndexAndPID&&openFolderIndexAndPID.index>=0&&
                <NoteList
                  noteList={noteList}
                  moveNotePage={moveNotePage}
                  setDeletePaperDetailDialogID={setDeletePaperDetailDialogID}
                  userData={userData}
                  setNewNoteDialog={setNewNoteDialog}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </>
	);
}

export default Library