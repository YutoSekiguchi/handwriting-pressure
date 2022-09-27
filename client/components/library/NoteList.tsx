import type { NextPage } from "next";
import React from "react";
import Image from "next/image";

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

type Props = {
  noteList: NoteObj[],
  moveNotePage: (pdid: number, uid: number) => Promise<void>,
  setDeletePaperDetailDialogID: (value: React.SetStateAction<number | null>) => void,
  userData: any,
  setNewNoteDialog: (value: React.SetStateAction<boolean>) => void,
}

const NoteList: NextPage<Props> = (props) => {
  const { noteList, moveNotePage, setDeletePaperDetailDialogID, userData, setNewNoteDialog } = props;

  const openDeletePaperDetailDialog = (id: number) => {
    setDeletePaperDetailDialogID(id);
  }

  // ノートを作るためにプラスマークを押下時
  const createNewNote = async() => {
    if (userData) {
      setNewNoteDialog(true);
    }
  }
  
  return (
    <>
      <div className='flex flex-wrap'>
        {noteList&&
          noteList.map((note, i) => (
            <div className='mb-3 mr-4' key={i}>
              <div className='flex items-center justify-center h-48 border border-gray-300 cursor-pointer w-36' onClick={() => moveNotePage(note.ID, note.UID)}>
                {note.PaperImage!=''
                  ? <div className="relative w-full h-full">
                      <img src={note.BackgroundImage} className="stroke-image" />
                      <img src={note.PaperImage} className="stroke-image" />
                    </div>
                  : <img src={note.BackgroundImage} />
                }
              </div>
              <div className='flex items-center justify-center'>
                <p className='mr-2 text-center text-white'>{note.Title}</p>
                <button className='flex items-center justify-center' onClick={() => openDeletePaperDetailDialog(note.ID)}>
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
    </>
  );
}

export default NoteList;