import type { NextPage } from 'next'
import { useRouter } from 'next/router'

type Props = {
  buttonText:string
}

const BackButton: NextPage<Props> = (props) => {
  const router = useRouter();
  const {buttonText} = props;
  const moveLibraryPage = () => {
    window.location.href = '/library'
  }
	return (
		<>
      <button className='flex ReturnButton' onClick={moveLibraryPage}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 my-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <p className='my-auto text-sm text-blue-400'>{buttonText}</p>
      </button>
    </>
	);
}

export default BackButton;
