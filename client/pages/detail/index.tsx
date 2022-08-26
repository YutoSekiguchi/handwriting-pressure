import type { NextPage } from 'next'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head'
import AppHeader from '../../components/common/AppHeader';
import Image from 'next/image'
import { useRouter } from 'next/router';
import HoverColorChangeButton from '../../components/common/HoverColorChangeButton';

const Detail: NextPage = () => {
  const router = useRouter();
	return (
    <>
      <div className='fixed w-full h-full bg-gray-900'>
        <AppHeader />
        <div className="w-full h-full flex justify-center items-center flex-col">
          <div className='flex justify-between items-center w-1/2 h-1/2 bg-gray-400 rounded-3xl'>
            <div className="logBackButton ml-2">
            <Image src={'/sliderBackButton.svg'} width={30} height={30} />
            </div>

            <div className='flex-col'>
              {/* 画像表示 */}
              <div className="relative w-full h-1/2">
                <Image src={"/ex_1.gif"} width={366} height={206} />
              </div>
              {/* 反映ボタン */}
              <div className='decideButton w-full h-1/2 text-center mt-6'>
                <button className='bg-gray-800 py-1 px-3 text-white rounded-lg'>
                  change note
                </button>
              </div>
            </div>

            <div className="logForwardButton mr-2">
              <Image src={'/sliderForwardButton.svg'} width={30} height={30} />
            </div>
          </div>

          <div className='w-1/2 flex justify-center'>
            <HoverColorChangeButton 
              url='/auth/signin'
              margin='mr-12'
              hoverMargin='mr-11'
              hoverBackgroundColor='bg-sky-800'
              backgroundColor='bg-sky-200'
              text='SignIn'
            />
            <HoverColorChangeButton 
              url='/auth/login'
              margin='ml-12'
              hoverMargin='ml-11'
              hoverBackgroundColor='bg-fuchsia-600'
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