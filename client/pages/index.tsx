import type { NextPage } from 'next'
import React from 'react';
import Head from 'next/head'
import AppHeader from '../components/common/AppHeader';
import Image from 'next/image'
import HoverColorChangeButton from '../components/common/HoverColorChangeButton';

const Home: NextPage = () => {
	return (
    <>
      <div className='fixed w-full h-full bg-gray-500'>
        <AppHeader />
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className='relative w-1/2 bg-gray-800 border-2 h-1/2 rounded-3xl border-sky-200'>
            <div className='flex-col items-center justify-center'>
              <h2 className='mt-2 mb-6 font-bold text-center text-white'>実験システム</h2>
              <h3 className='mx-6 leading-snug text-white'>このシステムは，重要度や自信度，後で消す予定のものに対して<strong className='text-orange-300'>筆圧</strong>を変化させることで，重要度や自信度の低いものを簡単に消すことができるシステムです。</h3>
            </div>
            <div className='w-4/5 mx-auto mt-12'>
              <Image src={'/top-ex.png'} className="" width={1200} height={300} />
            </div>
          </div>

          <div>
            <HoverColorChangeButton
              url='/detail'
              margin='ml-0'
              hoverMargin='hover:ml-0'
              hoverBackgroundColor='hover:bg-sky-800'
              backgroundColor='bg-gray-50'
              text='実験説明画面へ進む'
            />
          </div>
        </div>
      </div>
    </>
	);
}

export default Home