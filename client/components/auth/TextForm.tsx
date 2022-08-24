import type { NextPage } from 'next'
import { FormEventHandler } from 'react'

type Props = {
  label: string
  type: string,
  handleChangeElement: FormEventHandler<HTMLInputElement>
}

const TextForm: NextPage<Props> = (props) => {
  const {label, type, handleChangeElement} = props;
	return (
		<>
      <label htmlFor='key' className='text-white'>{label}</label>
      <input 
        type={type}
        name='key'
        required 
        autoComplete="off"
        className='px-2 mb-3 rounded-3xl'
        onInput={handleChangeElement} 
      />
    </>
	);
}

export default TextForm;