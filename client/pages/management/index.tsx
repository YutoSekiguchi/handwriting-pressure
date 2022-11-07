import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import AppHeader from '../../components/common/AppHeader';
import { usePaperDetails } from '../../hooks/contexts/paperDetailsContext';
import { useUsers } from '../../hooks/contexts/usersContext';

const ManagementPage: NextPage = () => {
  const [checkedItems, setCheckedItems] = useState({})
  const [noteListWithPressureUndo, setNoteListWithPressureUndo] = useState([]);
  const [noteListWithNotPressureUndo, setNoteListWithNotPressureUndo] = useState([]);
  const users: any = useUsers();
  const paperDetails: any = usePaperDetails();

  const titleList = [
    "math1",
    "math2",
    "math3",
    "math4",
    "numberlink1",
    "numberlink2",
    "numberlink3",
  ]

  type ExamUserObj = {
    Name: string,
    Password: string,
    Gender: 'male'|'female',
    Age: number
  }

  const handleChangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.name]: e.target.checked
    })
    console.log(paperDetails);
  }

  useEffect(() => {
    console.log('checkedItems:', checkedItems)
  }, [checkedItems])


  useEffect(() => {
    if (paperDetails.state.paperDetailsWithPressureUndoList?.length > 0) {
      setNoteListWithPressureUndo(paperDetails.state.paperDetailsWithPressureUndoList);
    }
    if (paperDetails.state.paperDetailsWithNotPressureUndoList?.length > 0) {
      setNoteListWithNotPressureUndo(paperDetails.state.paperDetailsWithNotPressureUndoList);
    }
    console.log(paperDetails.state)
  }, [paperDetails.state])

  useEffect(() => {
    users.getAllExamUsers();
    paperDetails.getPaperDetailsWithPressureUndo();
    paperDetails.getPaperDetailsWithNotPressureUndo();
  }, [])

  return (
    <>
      <div className='fixed w-full h-full bg-gray-500 overflow-auto'>
        <AppHeader />
        <h2 className='mt-12 text-white font-bold text-center'>管理者ツール</h2>
        <div className=''>
        {
          titleList.map((title, j) => (
            <div key={j} className="w-full flex flex-wrap">
              <div className='w-1/2 mx-auto bg-gray-800 h-3/4 rounded-xl pt-6 mt-12'>
        <div className='flex flex-wrap justify-center'>
          <h2 className='text-white'>{title}</h2>
          {noteListWithPressureUndo?.length > 0&&
            noteListWithPressureUndo.map((note, i) => (
              <div key={i}>
                {String(note["Title"]).indexOf(title)!==-1&&
                <div className='mb-3 mr-4'>
                  <div className='flex items-center justify-center h-48 border border-gray-300 cursor-pointer w-36'>
                    {note["PaperImage"]!=''
                      ? <div className="relative w-full h-full">
                          <img src={note["BackgroundImage"]} className="stroke-image" />
                          <img src={note["PaperImage"]} className="stroke-image" />
                        </div>
                      : <img src={note["BackgroundImage"]} />
                    }
                  </div>
                  <div className='flex items-center justify-center'>
                    <p className='mr-2 text-center text-white'>{note["Title"]}</p>
                    {/* <button classNamプロパティ 'Title' は型 'never' に存在しません。e='flex items-center justify-center' onClick={() => openDeletePaperDetailDialog(note.ID)}>
                      <Image src={'/trash.svg'} width={15} height={15} />
                    </button> */}
                  </div>
                </div>
              }
              </div>
            ))
            }
          </div>
          </div>
          <div className='w-1/2 mx-auto bg-gray-800 h-3/4 rounded-xl pt-6 mt-12'>
        <div className='flex flex-wrap justify-center'>
        <h2 className='text-white'>{title}_no</h2>
          {noteListWithNotPressureUndo?.length > 0&&
            noteListWithNotPressureUndo.map((note, i) => (
              <div key={i}>
                {String(note["Title"]).indexOf(title)!==-1&&
                <div className='mb-3 mr-4'>
                  <div className='flex items-center justify-center h-48 border border-gray-300 cursor-pointer w-36'>
                    {note["PaperImage"]!=''
                      ? <div className="relative w-full h-full">
                          <img src={note["BackgroundImage"]} className="stroke-image" />
                          <img src={note["PaperImage"]} className="stroke-image" />
                        </div>
                      : <img src={note["BackgroundImage"]} />
                    }
                  </div>
                  <div className='flex items-center justify-center'>
                    <p className='mr-2 text-center text-white'>{note["Title"]}</p>
                    {/* <button classNamプロパティ 'Title' は型 'never' に存在しません。e='flex items-center justify-center' onClick={() => openDeletePaperDetailDialog(note.ID)}>
                      <Image src={'/trash.svg'} width={15} height={15} />
                    </button> */}
                  </div>
                </div>
              }
              </div>
            ))
            }
          </div>
          </div>
            </div>
          ))
        }
        
        </div>
        {/* <div className='w-1/2 mx-auto bg-gray-800 h-1/2 rounded-xl pt-6 my-12'>
          <h3 className="text-white font-bold text-center">ユーザごとの分析</h3>
          <div className='flex justify-center overflow-auto'>
            {
              users.state.userAllData.length > 0 &&
              <>
                {
                  users.state.userAllData.map((user: ExamUserObj, i: number) => (
                    <div key={i} className='px-2 mt-2'>
                      <input type="checkbox" name={user.Name} onChange={handleChangeItem} />
                      <label htmlFor={user.Name} className="text-white pl-2 text-xl">{user.Name}</label>
                    </div>
                  ))
                }
              </>
            }
          </div>
        </div> */}
      </div>
    </>
  );
}

export default ManagementPage;