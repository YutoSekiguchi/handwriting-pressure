import type { NextPage } from 'next'

type Props = {
  buttonText:string
}

const BackButton: NextPage<Props> = (props) => {
  const {buttonText} = props;
	return (
		<>
      <button className='ReturnButton flex'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 my-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <p className='text-blue-400 text-sm my-auto'>{buttonText}</p>
      </button>
    </>
	);
}

export default BackButton;
