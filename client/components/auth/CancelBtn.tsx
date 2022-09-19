import type { NextPage } from 'next'
import { useRouter } from 'next/router';

const  CancelBtn: NextPage = () => {
  const router = useRouter();
  
  const moveHome = () => {
    router.push('/');
  }

	return (
		<>
      <button className='px-3 py-1 text-white bg-gray-900 rounded-lg hover:bg-cyan-900' onClick={moveHome}>
        <p className='font-bold'>Cancel</p>
      </button>
    </>
	);
}

export default CancelBtn;