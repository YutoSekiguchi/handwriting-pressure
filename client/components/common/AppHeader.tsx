import type { NextPage } from 'next'
import { useState, Dispatch, SetStateAction } from 'react';

const AppHeader: NextPage = () => {


	return (
		<div className="AppHeader fixed bg-cyan-900 w-full h-12 mb-5 flex">
      <div className='LeftSide flex justify-center ml-3'>
        <h2 className='text-white'>卒論 ver 1.0.0</h2>
      </div>
      <div className='CenterSide my-auto mx-auto'>

      </div>
      <div className="RightSide flex items-center">
      <button className='bg-gray-800 py-1 px-3 text-white rounded-lg mr-5'>
        <p className='font-bold'>ログイン</p>
      </button>
      </div>
		</div>
	);
}

export default AppHeader;
