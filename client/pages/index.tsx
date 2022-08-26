import type { NextPage } from 'next'
import React from 'react';
import Head from 'next/head'
import AppHeader from '../components/common/AppHeader';
import Image from 'next/image'
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
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
            <button 
              className="px-6 py-3 mt-12 rounded-xl bg-gray-50 text-gray-800 hover:bg-sky-800 hover:text-gray-50 hover:border-2 hover:border-white hover:mt-11"
              onClick={() => {router.push('/detail')}}
            >
              <p className='font-bold'>実験説明画面へ進む</p>
            </button>
          </div>
        </div>
      </div>
    </>
	);
}

export default Home