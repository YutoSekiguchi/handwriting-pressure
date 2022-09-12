import type { NextPage } from "next";
import React from "react";
import Image from "next/image";
import { usePaperDetails } from "../../hooks/contexts/paperDetailsContext";

type FolderObj = {
  ID: number,
  UID: number,
  Name: string,
  CreatedAt: string
}

type FolderIndexAndPIDObj = {
  pid: number,
  index: number
}

type Props = {
  allFolderData: FolderObj[],
  openFolderIndexAndPID: FolderIndexAndPIDObj | null,
  setOpenFolderIndexAndPID: React.Dispatch<React.SetStateAction<FolderIndexAndPIDObj | null>>,
  setDeletePaperDialogID: React.Dispatch<React.SetStateAction<number | null>>
}

const FolderList: NextPage<Props> = (props) => {
  const {allFolderData, openFolderIndexAndPID, setOpenFolderIndexAndPID, setDeletePaperDialogID} = props;

  const paperDetails: any = usePaperDetails();

  // フォルダクリック時
  const handleClickFolder = async(pid: number, i: number) => {
    await paperDetails.getPaperDetailsByPID(pid);
    setOpenFolderIndexAndPID({pid: pid, index: i});
  }

  // 削除ダイアログ
  const openDeletePaperDialog = (id: number) => {
    setDeletePaperDialogID(id);
  }
  
  return (
    <>
      {
        allFolderData.map((obj, i) => (
          <div className={`flex justify-between py-1 border-b border-gray-600 cursor-pointer ${obj.ID==openFolderIndexAndPID?.pid&&'bg-gray-800'} pl-2`} key={i} onClick={() => handleClickFolder(obj.ID, i)}>
            <div className='flex'>
              <Image src={'/folder.svg'} width={15} height={15} />
              <h6 className='pl-2 text-white'>{obj.Name.length>8?`${obj.Name.slice(0,8)}...`:obj.Name}</h6>
            </div>
            <button className='flex items-center justify-center mr-1' onClick={() => openDeletePaperDialog(obj.ID)}>
              <Image src={'/trash.svg'} width={15} height={15} />
            </button>
          </div>
        ))
      }
    </>
  );
}

export default FolderList;