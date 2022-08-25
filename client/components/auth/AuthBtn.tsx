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
      <button className='px-3 py-1 rounded-lg bg-gray-50 text-grey-800' onClick={authFunc}>
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