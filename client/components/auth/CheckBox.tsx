import type { NextPage } from 'next'
import { FormEventHandler } from 'react'

type Props = {
  label: string,
  checked: boolean,
  handleChangeElement: FormEventHandler<HTMLInputElement>,
  name: 'male'|'female'
}

const CheckBox: NextPage<Props> = (props) => {
  const {label, checked, handleChangeElement, name} = props;
	return (
		<>
      <input type="checkbox" name={name} style={{"accentColor": "black"}} className='scale-125' checked={checked} onChange={handleChangeElement} />
      <label htmlFor={name} className='ml-2 text-white'>{label}</label>
    </>
	);
}

export default CheckBox;