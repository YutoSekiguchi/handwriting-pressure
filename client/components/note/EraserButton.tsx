import type { NextPage } from 'next'
import { Dispatch, SetStateAction, useState, useEffect, useCallback } from 'react';

import PenWidthButton from './PenWidthButton';

type Props = {
  setEraseWidth: Dispatch<SetStateAction<number>>,
  mode: 'pen'|'erase',
}

const EraserButton: NextPage<Props> = (props) => {
  const {setEraseWidth, mode} = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const widthButtonSizeList: number[] = [5, 10, 15, 20, 25];
  const  [clickList, setClickList] = useState<number[] | any>([0, 1].concat([...Array(widthButtonSizeList.length -2)].map(x => 0)));

  const buttonClick = (label: number, index: number) => {
    setEraseWidth(label*2)
    console.log(label, index)
    console.log(mode)
    let tmp = clickList.concat();
    for (let i=0; i<tmp.length; i++) {
      if (i == index) {
        tmp[i] = 1;
      } else {
        tmp[i] = 0;
      }
    }
    setClickList(tmp);
    setDropdownOpen(!dropdownOpen);
  }

  const closeDropDown = useCallback(() => {
    setDropdownOpen(false);
    document.removeEventListener('click', closeDropDown)
  }, []);

  const openDropDown = (e: any) => {
    setDropdownOpen(true);
    document.addEventListener('click', closeDropDown)
    e.stopPropagation()
  }

  useEffect(()=>{
    return ()=>{
      document.removeEventListener('click',closeDropDown)
    }
  },[closeDropDown])


	return (
		<>
      <button id="dropdownButton" data-dropdown-toggle="dropdown" className={`text-white ${mode=='erase'? 'bg-gray-300 dark:bg-gray-300':''} hover:bg-gray-400 focus:outline-none font-medium rounded-full text-sm px-2 py-2 text-center inline-flex items-center dark:hover:bg-gray-400`} type="button" onClick={(e) => openDropDown(e)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 199.997 200" stroke="currentColor" strokeWidth={2} style={{color: "#444"}}>
          <path d="M235.177,4027.791l38.549-38.552,83.632-83.63-77.816-77.818-83.632,83.635-38.549,38.549Zm31.834-45.265L235.735,4013.8l-64.386-64.392,31.274-31.274Z" transform="translate(-157.361 -3827.791)"/>
        </svg>
      </button>

      <div id="dropdownMenu" className={`${dropdownOpen&&clickList ? 'z-10 visible bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-100 fixed border-slate-700 border-0': 'hidden'}`}>
          <div className="py-1 text-gray-700 dark:text-gray-200 flex justify-around">
            {widthButtonSizeList.map((label, index) => (
              <div className='flex' onClick={() => buttonClick(label, index)}  key={index}>
                <PenWidthButton width={label} height={label} isChoice={clickList[index]} mode={'erase'} />
              </div>
            ))
            }
          </div>
      </div>
    </>
	);
}

export default EraserButton;