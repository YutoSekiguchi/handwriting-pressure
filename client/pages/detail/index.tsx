import type { NextPage } from 'next'
import React, { useState } from 'react';
import Head from 'next/head'
import AppHeader from '../../components/common/AppHeader';
import HoverColorChangeButton from '../../components/common/HoverColorChangeButton';
import Explain from '../../components/detail/Explain';

const Detail: NextPage = () => {
  const [index, setIndex] = useState<number>(0);
  
	return (
    <>
      <div className='fixed w-full h-full bg-gray-900'>
        <AppHeader />
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className='flex items-center justify-between w-1/2 overflow-y-auto border-2 border-gray-400 h-1/2 bg-gray-50 rounded-3xl img-box'>
            <Explain
              index={index}
              setIndex={setIndex}
            />
          </div>

          <div className='flex justify-center w-1/2'>
            <HoverColorChangeButton 
              url='/auth/signin'
              margin='mr-12'
              hoverMargin='hover:mr-11'
              hoverBackgroundColor='hover:bg-sky-800'
              backgroundColor='bg-sky-200'
              text='SignIn'
            />
            <HoverColorChangeButton 
              url='/auth/login'
              margin='ml-12'
              hoverMargin='hover:ml-11'
              hoverBackgroundColor='hover:bg-fuchsia-600'
              backgroundColor='bg-fuchsia-200'
              text='LogIn'
            />
          </div>
        </div>
      </div>
    </>
	);
}

export default Detail