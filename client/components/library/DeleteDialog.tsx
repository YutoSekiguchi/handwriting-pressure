import type { NextPage } from 'next'

type Props = {
  closeDialog: (e: any) => void,
  handleDelete: (pdid: number) => void,
  id: number|null,
  setDeleteDialogID: React.Dispatch<React.SetStateAction<number | null>>
}

const DeleteDialog: NextPage<Props> = (props) => {
  const {closeDialog, handleDelete, id, setDeleteDialogID} = props;
  
  return (
    <div className="overlay" onClick={closeDialog}>
      <div className="delete-overlay-content">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className='flex-col text-center'>
            <h3 className='mb-1 font-bold text-center'>本当に削除してもいいですか?
            </h3>
            <h5 className='mb-12 font-bold text-center'>※削除後は，元に戻すことはできません.</h5>
              <div className='flex items-center justify-around'>
                <button className='px-3 py-1 mr-4 text-white bg-gray-800 rounded-lg' onClick={() => {setDeleteDialogID(null)}}>
                  <p className='font-bold'>キャンセル</p>
                </button>
                {id&&
                  <button className='px-3 py-1 ml-4 text-white bg-gray-800 rounded-lg' onClick={() => handleDelete(id)}>
                    <p className='font-bold'>削除する</p>
                  </button>
                }
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteDialog;