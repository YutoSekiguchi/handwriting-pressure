import type { NextPage } from 'next'

type Props = {
  buttonColor: string,
  isChoice: number,
}

const ColorButton: NextPage<Props> = (props) => {
  const {buttonColor, isChoice} = props;

	return (
		<>
      <button className='ColorButton w-5 h-5 rounded-full mx-1' style={{backgroundColor: `${buttonColor}`, border: "1px solid gray", boxShadow: `0 0 ${8*isChoice}px #000`}}></button>
    </>
	);
}

export default ColorButton;
