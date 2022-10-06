import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import Image from "next/image";

const AppHeader: NextPage = () => {
  const router = useRouter();
  const moveHome = () => {
    router.push('/');
  }

  const moveLoginPage = () => {
    router.push('/auth/login');
  }

	return (
		<div className="fixed flex w-full h-12 mb-5 AppHeader bg-sky-900">
      <div className='flex justify-center ml-3 cursor-pointer LeftSide' onClick={moveHome}>
        <Image className='' src={'/hidoadologo.png'} width={50} height={40} />
        {/* <Image className='' src={'/title.png'} width={160} height={40} /> */}
        <h2 className='text-white'></h2>
      </div>
      <div className='mx-auto my-auto CenterSide'>

      </div>
      <div className="flex items-center RightSide">
        {(router.pathname.includes('auth')||router.pathname==='/'||router.pathname==='/detail')&&
          <button className='px-3 py-1 mr-5 text-white bg-gray-800 rounded-lg' onClick={moveLoginPage}>
            <p className='font-bold'>ログイン</p>
          </button>
        }
      </div>
		</div>
	);
}

export default AppHeader;
