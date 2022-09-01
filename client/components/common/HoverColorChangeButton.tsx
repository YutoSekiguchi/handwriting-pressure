import type { NextPage } from 'next'
import React from 'react';
import { useRouter } from 'next/router';

type Props = {
  url: string,
  margin: string,
  hoverMargin: string,
  hoverBackgroundColor: string,
  backgroundColor: string,
  text: string
}

const HoverColorChangeButton: NextPage<Props> = (props) => {
  const {url, margin, hoverMargin, hoverBackgroundColor, backgroundColor, text} = props;
  const router = useRouter();
	return (
    <>
      <button 
        className={`px-6 py-3 mt-12 rounded-xl ${backgroundColor} text-gray-800 ${hoverBackgroundColor} hover:text-gray-50 hover:border-2 hover:border-white hover:mt-11 ${margin} ${hoverMargin}`}
        onClick={() => {router.push(`${url}`)}}
      >
        <p className='font-bold'>{text}</p>
      </button>
    </>
	);
}

export default HoverColorChangeButton