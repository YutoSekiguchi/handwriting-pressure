import type { NextPage } from 'next'
import React, { ChangeEvent, useState, useEffect } from 'react'
import AuthBtn from '../../components/auth/AuthBtn';
import CancelBtn from '../../components/auth/CancelBtn';
import CheckBox from '../../components/auth/CheckBox';
import TextForm from '../../components/auth/TextForm';
import AppHeader from '../../components/common/AppHeader';
import { useUsers } from '../../hooks/contexts/usersContext';

type UserDataObject = {
  Name: string,
  Password: string,
  Gender: string,
  Age: number
}

const SignIn: NextPage = () => {
  const users: any = useUsers();
  
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<number|null>(null);
  const [count, setCount] = useState<number>(0);
  
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

  useEffect(() => {
    if(count>0){
      if(users.state.userData!=null&&Object.keys(users.state.userData).length !== 0) {
        window.location.href='/library';
      } else {
        setCount((prevCount) => prevCount + 1);
      }
    } else {
      setCount((prevCount) => prevCount + 1);
    }
  }, [users.state.userData])


  useEffect(() => {
    if(count > 1) {
      alert('サインインに失敗しました');
    }
  }, [count])

  return (
    <>
      <div className='fixed w-full h-full bg-gray-500'>
        <AppHeader />
        <div className='flex flex-col items-center justify-center w-full h-4/5'>
          <div className='flex flex-col w-1/2 max-w-md px-16 pt-16 authDialog rounded-3xl'>
            <h2 className='mb-6 font-bold text-center text-white align-middle'>SIGN IN</h2>
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
            
            <h6 className='text-white'>Gender: 性別*</h6>
            <div className='flex justify-around mb-2'>
              <div>
                <CheckBox
                  label='male: 男性'
                  checked={gender=='male'}
                  name='male'
                  handleChangeElement={handleChangeCheckBox}
                />
              </div>

              <div>
                <CheckBox
                  label='female: 女性'
                  checked={gender=='female'}
                  name='female'
                  handleChangeElement={handleChangeCheckBox}
                />
              </div>
            </div>
            
            <label htmlFor="age" className='text-white'>Age: 年齢*</label>
            <input type="number" id="age" name="age" min="0" className='w-20 pl-3 mt-1 mb-6 text-center rounded-3xl' onChange={handleChangeAge} />

            <div className='flex justify-around mb-6'>
              <CancelBtn />
              <AuthBtn
                text="Sign in"
                authFunc={signIn}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;