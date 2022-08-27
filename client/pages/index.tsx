import type { NextPage } from 'next'
import React from 'react';
import Head from 'next/head'
import AppHeader from '../components/common/AppHeader';
import Image from 'next/image'
import HoverColorChangeButton from '../components/common/HoverColorChangeButton';

const Home: NextPage = () => {
	return (
    <>
      <div className='fixed w-full h-full bg-gray-900'>
        <AppHeader />
        <div className="w-full h-full flex justify-center items-center flex-col">
          <div className='w-1/2 h-1/2 bg-gray-800 rounded-3xl border-2 border-sky-200 relative'>
            <div className='flex-col'>
              <h2 className='font-bold text-center text-white my-2'>実験システム</h2>
              <h3 className='text-white ml-6'>この実験では〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜。</h3>
            </div>
            <div className='absolute bottom-2 right-2'>
              <Image src={'/pen.gif'} width={150} height={150} />
            </div>
          </div>

          <div>
            <HoverColorChangeButton
              url='/detail'
              margin='ml-0'
              hoverMargin='ml-0'
              hoverBackgroundColor='bg-sky-800'
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