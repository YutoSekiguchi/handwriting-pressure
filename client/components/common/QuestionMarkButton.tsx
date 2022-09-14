import type { NextPage } from "next";
import Image from "next/image";

const QuestionMarkButton: NextPage = () => {
  return (
    <Image 
      className='cursor-pointer'
      src={'/question-mark.svg'}
      width={16}
      height={16}
    />
  );
}

export default QuestionMarkButton;