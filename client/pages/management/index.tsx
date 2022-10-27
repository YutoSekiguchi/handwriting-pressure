import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import AppHeader from '../../components/common/AppHeader';
import { usePaperDetails } from '../../hooks/contexts/paperDetailsContext';
import { useUsers } from '../../hooks/contexts/usersContext';

const ManagementPage: NextPage = () => {
  const [checkedItems, setCheckedItems] = useState({})
  const canvasRef = useRef(null);
  const users: any = useUsers();
  const paperDetails: any = usePaperDetails();

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
    users.getAllExamUsers();
    paperDetails.getPaperDetailsWithPressureUndo();
    paperDetails.getPaperDetailsWithNotPressureUndo();
  }, [])

  return (
    <>
      <div className='fixed w-full h-full bg-gray-500 overflow-auto'>
        <AppHeader />
        <h2 className='mt-12 text-white font-bold text-center'>管理者ツール</h2>
        <div className='w-3/4 mx-auto bg-gray-800 h-3/4 rounded-xl pt-6 mt-12'>

        </div>
        <div className='w-1/2 mx-auto bg-gray-800 h-1/2 rounded-xl pt-6 my-12'>
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
        </div>
      </div>
    </>
  );
}

export default ManagementPage;