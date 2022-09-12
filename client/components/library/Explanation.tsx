import type { NextPage } from "next";
import React from "react";
import Image from "next/image";

const Explanation: NextPage = () => {
  return (
    <div className='h-full mt-12 text-center'>
      <h3 className='justify-around font-bold text-white'>〜ノートライブラリ〜</h3>
      <div className='flex justify-center py-6 mt-12 bg-gray-900 border-8 border-white h-1/3 rounded-3xl'>
        <img src={'/make_folder.png'} className="object-contain w-1/4" />
        <div className='flex-col w-1/2 my-auto ml-12'>
          <h4 className='mb-3 text-white'>〜フォルダ作成方法〜</h4>
          <h4 className='text-left text-white'>&emsp;ユーザ名の横にあるプラスボタンをクリックして，フォルダの名前を入力することで，新しいフォルダを作成することができます</h4>
        </div>
      </div>

      <div className='flex justify-center py-6 mt-12 bg-gray-900 border-8 border-white rounded-3xl h-1/3'>
        <img src={'/make_note.png'} className="object-contain w-1/4" />
        <div className='flex-col w-1/2 my-auto ml-12'>
          <h4 className='mb-3 text-white'>〜ノート作成方法〜</h4>
          <h4 className='text-left text-white'>&emsp;このプラスマークを押してノートの名前を入力することで，新規ノートを作成できます</h4>
        </div>
      </div>
    </div>
  );
}

export default Explanation;