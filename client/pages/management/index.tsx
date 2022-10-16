import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import AppHeader from '../../components/common/AppHeader';
import { useUsers } from '../../hooks/contexts/usersContext';

const ManagementPage: NextPage = () => {
  const canvasRef = useRef(null);
  const users: any = useUsers();

  type ExamUserObj = {
    Name: string,
    Password: string,
    Gender: 'male'|'female',
    Age: number
  }

  useEffect(() => {
    users.getAllExamUsers();
    
  }, [])

  return (
    <>
      <div className='fixed w-full h-full bg-gray-500'>
        <AppHeader />
        <h2 className='mt-12 text-white font-bold text-center'>管理者ツール</h2>
        {
          users.state.userAllData.length > 0 &&
          <>
            {
              users.state.userAllData.map((user: ExamUserObj, i: number) => (
                <p key={i}>{user.Name}</p>
              ))
            }
          </>
        }
      </div>
    </>
  );
}

export default ManagementPage;