import type { NextPage } from "next";
import React from "react";
import Image from "next/image";
import ExplainImageList from "../../utils/ExplainImageList";

type Props = {
  index: number,
  setIndex?: React.Dispatch<React.SetStateAction<number>>,
}

const Explain: NextPage<Props> = (props) => {
  const { index, setIndex } = props;
  const imageList = ExplainImageList;
  const handleChangeDetail = (mode: 'forward'|'ago') => {
    if (setIndex) {
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
  }
  return (
    <>
      {setIndex&&
        <div className="ml-2 cursor-pointer logBackButton" onClick={() => handleChangeDetail('ago')}>
          <Image src={'/sliderBackButton.svg'} width={35} height={35} />
        </div>
      }

      <div className='flex-col'>
        <h3 className='mb-6 font-bold text-center text-white'>実験説明（{index+1}）</h3>
        <div className="flex flex-col items-center justify-center w-full h-1/2">
          {setIndex?
            <Image src={imageList[index]} width={366} height={206} objectFit={'contain'} />
            :
            <img src={imageList[index]} className="object-contain" width={366}></img>
          }
        </div>
        
        <div className='w-full mx-auto mt-6 text-left decideButton h-1/2'>
          {index===0&&
            <p className='font-bold text-white'>1.&nbsp;ノート画面ではスタイラスペンを使って文字を書くことができます</p>
          }
          {index===1&&
            <p className='font-bold text-white'>2.&nbsp;<span className='text-lg text-orange-400'>文字の太さ</span>や<span className='text-lg text-orange-400'>色の変更</span>，<span className='text-lg text-orange-400'>消しゴム</span>を扱うことも可能です</p>
          }
          {index===2&&
            <p className='font-bold text-white'>3.&nbsp;画面右上のボタンを押すことで<span className='text-lg text-orange-400'>一つ前の状態に戻る</span>ことができます</p>
          }
          {index===3&&
            <p className='font-bold text-white'>4.&nbsp;文字を書くと画面右中央に円グラフが表示されます。<br />
            &nbsp;左側の<span className='text-lg text-teal-400'>水色</span>の円グラフには<span className='text-lg text-teal-400'>直前に書いた線の筆圧</span>を0〜1の値で表示しています。<br />
            &nbsp;右側の<span className='text-lg text-fuchsia-400'>紫色</span>の円グラフは<span className='text-lg text-fuchsia-400'>今まで書いた線の筆圧の平均</span>を0〜1の値で表示しています。</p>
          }
          {index===4&&
            <p className='font-bold text-white'>5.&nbsp;画面右上のスライダーを動かすことで<span className='text-lg text-fuchsia-400'>筆圧の弱いストロークを削除</span>することができます<br />
            スライダーの下のグラフは<span className='text-lg text-teal-400'>横軸が筆圧（強→弱），縦軸が線の本数</span>となってるグラフです<br /><br />
            ※消しゴムの筆圧は1.0になります
            </p>
          }
          {index===5&&
            <p className='font-bold text-white'>6.&nbsp;表示されているログをクリックすることで，<span className='text-lg text-fuchsia-400'>ログに表示されている画面の操作まで一気に戻る</span>ことができます
            </p>
          }
        </div>
      </div>

      {setIndex&&
        <div className="mr-2 cursor-pointer logForwardButton" onClick={() => handleChangeDetail('forward')}>
          <Image src={'/sliderForwardButton.svg'} width={35} height={35} />
        </div>
      }
    </>
  );
}

export default Explain;