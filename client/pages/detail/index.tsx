import type { NextPage } from 'next'
import React, { useState } from 'react';
import Head from 'next/head'
import AppHeader from '../../components/common/AppHeader';
import Image from 'next/image'
import HoverColorChangeButton from '../../components/common/HoverColorChangeButton';

const Detail: NextPage = () => {
  const imageList = [
    '/ex_1.gif',
    '/ex_2.gif',
    '/ex_3.png',
    '/ex_4.png'
  ];
  const [index, setIndex] = useState<number>(0);
  
  const handleChangeDetail = (mode: 'forward'|'ago') => {
    switch(mode) {
      case 'forward':
        switch (index) {
          case imageList.length-1:
            setIndex(0);
            break;
          default:
            setIndex((prevIndex) => prevIndex + 1);
        }
        break;
      case 'ago':
        switch (index) {
          case 0:
            setIndex(imageList.length-1);
            break;
          default:
            setIndex((prevIndex) => prevIndex - 1);
        }
        break;
    }
  }

	return (
    <>
      <div className='fixed w-full h-full bg-gray-900'>
        <AppHeader />
        <div className="w-full h-full flex justify-center items-center flex-col">
          <div className='flex justify-between items-center w-1/2 h-1/2 bg-gray-50 rounded-3xl border-2 border-gray-400 overflow-y-auto img-box'>
            <div className="logBackButton ml-2 cursor-pointer" onClick={() => handleChangeDetail('ago')}>
              <Image src={'/sliderBackButton.svg'} width={35} height={35} />
            </div>

            <div className='flex-col'>
              <h3 className='font-bold mb-6 text-center'>実験説明（{index+1}）</h3>
              <div className="w-full h-1/2 justify-center flex flex-col items-center">
                <Image src={imageList[index]} width={366} height={206} objectFit={'contain'} />
              </div>
              <div className='decideButton w-full h-1/2 mt-6 text-left mx-auto'>
                {index===0&&
                  <p className='font-bold'>1.&nbsp;ノート画面ではスタイラスペンを使って文字を書くことができます</p>
                }
                {index===1&&
                  <p className='font-bold'>2.&nbsp;<span className='text-orange-400 text-lg'>文字の太さ</span>や<span className='text-orange-400 text-lg'>色の変更</span>，<span className='text-orange-400 text-lg'>消しゴム</span>を扱うことも可能です</p>
                }
                {index===2&&
                  <p className='font-bold'>3.&nbsp;画面右上のボタンを押すことで<span className='text-orange-400 text-lg'>一つ前の状態に戻る</span>ことができます</p>
                }
                {index===3&&
                  <p className='font-bold'>4.&nbsp;文字を書くと画面右中央に円グラフが表示されます。<br />
                  &nbsp;左側の<span className='text-lg text-teal-400'>水色</span>の円グラフには<span className='text-lg text-teal-400'>直前に書いた線の筆圧</span>を0〜1の値で表示しています。<br />
                  &nbsp;右側の<span className='text-lg text-fuchsia-400'>紫色</span>の円グラフは<span className='text-lg text-fuchsia-400'>今まで書いた線の筆圧の平均</span>を0〜1の値で表示しています。</p>
                }
              </div>
            </div>

            <div className="logForwardButton mr-2 cursor-pointer" onClick={() => handleChangeDetail('forward')}>
              <Image src={'/sliderForwardButton.svg'} width={35} height={35} />
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