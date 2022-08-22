import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react'
import AppHeader from '../../components/common/AppHeader';
import { useUsers } from '../../hooks/contexts/usersContext';

type UserDataObject = {
  Name: string,
  Password: string,
  Gender: string,
  Age: number
}

const SignIn: NextPage = () => {
  const router = useRouter();
  const users: any = useUsers();
  
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<number|null>(null);
  
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setName(value);
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setPassword(value);
  }

  const handleChangeCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.name;
    if (value == gender) {
      setGender('');
    } else {
      setGender(value);
    }
  }

  const handleChangeAge = (e: ChangeEvent<HTMLInputElement>) => {
    const value: number = Number(e.target.value);
    setAge(value);
  }

  const moveHome = () => {
    router.push('/');
  }

  const signIn = async() => {
    if (name === '') {
      alert('名前を入力してください');
      return;
    } else if (password === '') {
      alert('パスワードを入力してください');
      return;
    } else if (gender === '') {
      alert('性別を入力してください');
      return;
    } else if (age === null) {
      alert('年齢を入力してください');
      return;
    }
    const data: UserDataObject = {
      Name: name,
      Password: password,
      Gender: gender,
      Age: age
    }
    await users.signIn(name, password, data);
  }


  return (
    <>
      <div className='fixed w-full h-full bg-gray-900'>
        <AppHeader />
        <div className='flex flex-col items-center justify-center w-full h-4/5'>
          <div className='flex flex-col w-1/2 max-w-md px-16 pt-16 authDialog rounded-3xl'>
            <h2 className='mb-6 font-bold text-center text-white align-middle'>SIGN IN</h2>
            <label htmlFor="name" className='text-white'>Name: 名前*</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              autoComplete="off"
              className='px-2 mb-3 rounded-3xl'
              onInput={handleChangeName} 
            />

            <label htmlFor="passwod" className='text-white'>Passwod: パスワード*</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              autoComplete="off"
              className='px-2 mb-3 rounded-3xl'
              onInput={handleChangePassword}
            />
            
            <h6 className='text-white'>Gender: 性別*</h6>
            <div className='flex justify-around mb-2'>
              <div>
                <input type="checkbox" id="male" name="male" style={{"accentColor": "black"}} className='scale-125' checked={gender=="male"} onChange={handleChangeCheckBox}/>
                <label htmlFor="male" className='ml-2 text-white'>male: 男性</label>
              </div>

              <div>
                <input type="checkbox" id="female" name="female" style={{"accentColor": "black"}}  className='scale-125' checked={gender=="female"} onChange={handleChangeCheckBox} />
                <label htmlFor="female" className='ml-2 text-white'>female: 女性</label>
              </div>
            </div>
            
            <label htmlFor="age" className='text-white'>Age: 年齢*</label>
            <input type="number" id="age" name="age" min="0" className='w-20 pl-3 mt-1 mb-6 text-center rounded-3xl' onChange={handleChangeAge} />

            <div className='flex justify-around mb-6'>
              <button className='px-3 py-1 text-white bg-gray-800 rounded-lg' onClick={moveHome}>
                <p className='font-bold'>Cancel</p>
              </button>
              <button className='px-3 py-1 rounded-lg bg-gray-50 text-grey-800' onClick={signIn}>
                <a href='/note' className='flex font-bold'>
                  Sign in
                  <svg version="1.1" className='w-4 ml-2' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 499.1 499.1" xmlSpace="preserve">
                    <path d="M0,249.6c0,9.5,7.7,17.2,17.2,17.2h327.6l-63.9,63.8c-6.7,6.7-6.7,17.6,0,24.3c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5
                      l93.1-93.1c6.7-6.7,6.7-17.6,0-24.3l-93.1-93.1c-6.7-6.7-17.6-6.7-24.3,0c-6.7,6.7-6.7,17.6,0,24.3l63.8,63.8H17.2
                      C7.7,232.5,0,240.1,0,249.6z"/>
                    <path d="M396.4,494.2c56.7,0,102.7-46.1,102.7-102.8V107.7C499.1,51,453,4.9,396.4,4.9H112.7C56,4.9,10,51,10,107.7V166
                      c0,9.5,7.7,17.1,17.1,17.1c9.5,0,17.2-7.7,17.2-17.1v-58.3c0-37.7,30.7-68.5,68.4-68.5h283.7c37.7,0,68.4,30.7,68.4,68.5v283.7
                      c0,37.7-30.7,68.5-68.4,68.5H112.7c-37.7,0-68.4-30.7-68.4-68.5v-57.6c0-9.5-7.7-17.2-17.2-17.2S10,324.3,10,333.8v57.6
                      c0,56.7,46.1,102.8,102.7,102.8H396.4L396.4,494.2z"/>
                  </svg>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;