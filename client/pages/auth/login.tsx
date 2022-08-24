import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useState } from 'react'
import AuthBtn from '../../components/auth/AuthBtn';
import TextForm from '../../components/auth/TextForm';
import AppHeader from '../../components/common/AppHeader';
import { useUsers } from '../../hooks/contexts/usersContext';

const LogIn: NextPage = () => {
  const router = useRouter();
  const users: any = useUsers();
  
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setName(value);
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setPassword(value);
  }

  const moveHome = () => {
    router.push('/');
  }

  const logIn = async() => {
    if (name === '') {
      alert('名前を入力してください');
      return;
    } else if (password === '') {
      alert('パスワードを入力してください');
      return;
    }
    await users.getExamUserByNameAndPassword(name, password);
  }

  useEffect(() => {
    if(count>0){
      if(users.state.userData!=null&&Object.keys(users.state.userData).length !== 0) {
      window.location.href='/note';
      } else {
        setCount((prevCount) => prevCount + 1);
      }
    } else {
      setCount((prevCount) => prevCount + 1);
    }
  }, [users.state.userData])


  useEffect(() => {
    if(count > 1) {
      alert('名前またはパスワードが違います');
    }
  }, [count])


  return (
    <>
      <div className='fixed w-full h-full bg-gray-900'>
        <AppHeader />
        <div className='flex items-center justify-center w-full h-4/5'>
          <div className='flex flex-col w-1/2 max-w-md px-16 pt-16 authDialog rounded-3xl'>
            <h2 className='mb-6 font-bold text-center text-white align-middle'>LOGIN</h2>
            <TextForm 
              label='Name: 名前'
              type='text'
              handleChangeElement={handleChangeName}
            />

            <TextForm 
              label='Password: パスワード'
              type='password'
              handleChangeElement={handleChangePassword}
            />


            <div className='flex justify-around mb-6 mt-12'>
              <button className='px-3 py-1 text-white bg-gray-800 rounded-lg' onClick={moveHome}>
                <p className='font-bold'>Cancel</p>
              </button>
              <AuthBtn
                text="Login"
                authFunc={logIn}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogIn;