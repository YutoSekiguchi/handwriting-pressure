import type { NextPage } from 'next'

type Props = {
  width: number,
  height: number,
  isChoice: 0|1,
  mode: 'pen'|'erase',
}

const PenWidthButton: NextPage<Props> = (props) => {
  const {width, height, isChoice, mode} = props;

	return (
		<div className='flex pb-1' style={{borderBottom: `3px solid rgba(96, 165, 250, ${isChoice})`}}>
      <button className={`my-auto rounded-full ${mode=="pen"? "bg-black": "bg-gray-400"} dark:hover:bg-gray-600 cursor-pointer`} style={{width: `${width}px`, height: `${height}px`}}></button>
    </div>
	);
}

export default PenWidthButton;
