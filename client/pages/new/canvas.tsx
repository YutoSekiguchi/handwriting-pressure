import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react';
import CanvasDraw from "react-canvas-draw";



const NewCanvas: NextPage = () => {

  const [color, setColor] = useState<string>("#" + Math.floor(Math.random() * 16777215).toString(16))
  const [radius, setRadius] = useState<number>(2)
  const editorRef = useRef(null);
  const handleShowData = () => {
    let editor: any = editorRef.current;
    console.log(editor.getSaveData());
  }

  const handleChangeColor = () => {
    setColor("#" + Math.floor(Math.random() * 16777215).toString(16)+"55")
  }

  const onMove = () => {
    setRadius(Math.floor(Math.random() * 5))
  }

  return (
    <div className="" onPointerMove={onMove}>
      <CanvasDraw
        
        ref={editorRef}
        brushColor={color}
        brushRadius={radius}
        
      />
      <button onClick={handleShowData}>show</button>
      <button onClick={handleChangeColor}>changeCOlor</button>
    </div>
  )
}

export default NewCanvas
