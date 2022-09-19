import type { NextPage } from 'next'
import Image from 'next/image'
import { MouseEventHandler } from 'react'

type Props = {
  text: string,
  authFunc: MouseEventHandler<HTMLButtonElement>,
}

const AuthBtn: NextPage<Props> = (props) => {
  const {text, authFunc} = props;
	return (
		<>
      <button className='px-3 py-1 text-gray-800 rounded-lg bg-gray-100 hover:bg-rose-200' onClick={authFunc}>
        <p className='flex font-bold'>
          {text}
          &nbsp;
          <Image src={"/login.svg"} width={20} height={20} />
        </p>
      </button>
    </>
	);
}

export default AuthBtn;