import type { NextPage } from 'next'
import { Dispatch, SetStateAction, useState } from 'react';

import PenWidthButton from './PenWidthButton';

type Props = {
  setWidth: Dispatch<SetStateAction<number>>,
}

const PenButton: NextPage<Props> = (props) => {
  const {setWidth} = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const widthButtonSizeList: number[] = [5, 10, 15, 20, 25];
  const  [clickList, setClickList] = useState<number[] | any>([1].concat([...Array(widthButtonSizeList.length -1)].map(x => 0)));

  const buttonClick = (label: number, index: number) => {
    setWidth(label/5)
    console.log(label, index)
    let tmp = clickList.concat();
    for (let i=0; i<tmp.length; i++) {
      if (i == index) {
        tmp[i] = 1;
      } else {
        tmp[i] = 0;
      }
    }
    setClickList(tmp);
  }


	return (
		<>
      <button id="dropdownButton" data-dropdown-toggle="dropdown" className="text-white bg-gray-300 hover:bg-gray-400 focus:outline-none font-medium rounded-full text-sm px-2 py-2 text-center inline-flex items-center dark:bg-gray-300 dark:hover:bg-gray-400" type="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{color: "#444"}}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <div id="dropdownMenu" className={`${dropdownOpen&&clickList ? 'z-10 visible bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-100 fixed border-slate-700 border-0': 'hidden'}`}>
          <div className="py-1 text-gray-700 dark:text-gray-200 flex justify-around">
            {widthButtonSizeList.map((label, index) => (
              <div className='flex' onClick={() => buttonClick(label, index)}  key={index}>
                <PenWidthButton width={label} height={label} isChoice={clickList[index]} />
              </div>
            ))
            }
          </div>
      </div>
    </>
	);
}

export default PenButton;