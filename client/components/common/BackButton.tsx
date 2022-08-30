import type { NextPage } from 'next'

type Props = {
  buttonText:string
}

const BackButton: NextPage<Props> = (props) => {
  const {buttonText} = props;
	return (
		<>
      <button className='flex ReturnButton'>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 my-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <a href="/library" className='my-auto text-sm text-blue-400'>{buttonText}</a>
      </button>
    </>
	);
}

export default BackButton;
