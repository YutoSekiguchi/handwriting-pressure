import type { NextPage } from "next";
import React from "react";
import Explain from '../detail/Explain';

type Props = {
  setShowExplainDialog: React.Dispatch<React.SetStateAction<number | null>>,
  showExplainDialog: number
}

const ExplainDialog: NextPage<Props> = (props) => {
  const { setShowExplainDialog, showExplainDialog } = props;
  const closeDialog = (e: any) => {
    if (e.target.className == 'overlay') {
      setShowExplainDialog(null);
    } else {
      return;
    }
  }
  return (
    <div className="overlay" onClick={closeDialog}>
      <div className="overlay-content bg-gray-700">
        <div className="flex items-center justify-center w-full h-full">
          {/* 画像表示 */}
          <Explain 
            index={showExplainDialog}
          />
        </div>
      </div>
    </div>
  );
}

export default ExplainDialog;