import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
interface IRect {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const Home: NextPage = () => {

  const [lastXPos, setLastXPos] = useState<number | null>(null); // 直前のペンのx座標
  const [lastYPos, setLastYPos] = useState<number | null>(null); // 直前のペンのy座標
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const [xPos, setXPos] = useState<number>(0); // ペンのx座標
  const [yPos, setYPos] = useState<number>(0); // ペンのy座標
  /////////////////////////////////////////////////////////////////////////////////////////////
  const [pressure, setPressure] = useState<number | null | undefined>(null); // 筆圧
  const [tiltX, setTiltX] = useState<number | null | undefined>(null); // ペンの傾きx
  const [tiltY, setTiltY] = useState<number | null | undefined>(null); // ペンの傾きy
  const [red, setRed] = useState<number>(0); // 赤
  const [blue, setBlue] = useState<number>(0); // 青
  const [isDrag, setIsDrag] = useState<boolean>(false); // ペンがノートに置かれているか否か
  const canvasRef = useRef(null);
  const BaseLineWidth = 7; // 線の太さ（基準）

  const EpenButton = {
    tip: 0x1,    // left mouse, touch contact, pen contact
    barrel: 0x2, // right mouse, pen barrel button
    middle: 0x4, // middle mouse
    eraser: 0x20 // pen eraser button
  }

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  }

  // ペンがノートに触れ始めた時の処理
  const onStart = () => {
    setIsDrag(true);
  }

  // ペンを動かしてる時
  const onMove = async(e: React.MouseEvent<HTMLCanvasElement> | any) => {
    // if (!isDrag) { return; }
    const canvas: any = canvasRef.current;
    const rect: IRect = canvas.getBoundingClientRect();
    
    let x = 0;
    let y = 0;
    let touch;

    switch (e.type) {
      // PCのマウスなら
      case "mousemove":
        x = ~~(e.clientX - rect.left);
        y = ~~(e.clientY - rect.top);
        break;
      // タッチ操作なら
      case "touchmove":
        touch = e.touches[0] || e.changedTouches[0];
        x = ~~(touch.clientX - rect.left);
        y = ~~(touch.clientY - rect.top);
        setPressure(e.touches[0].force);
        break;
      // タッチ操作なら
      case "touchstart":
        touch = e.touches[0] || e.changedTouches[0];
        x = ~~(touch.clientX - rect.left);
        y = ~~(touch.clientY - rect.top);
        setPressure(e.touches[0].force);
        break;
      case "pointermove":
        console.log(rect.left);
        console.log(rect.bottom);
        x = ~~(e.clientX - rect.left)*3;
        y = ~~(e.clientY - rect.top)*3;
        //////////////////////////////////////////
        setXPos(x);
        setYPos(y);
        ////////////////////////////////////////
        setPressure(e.pressure);
        if (e.pointerType && e.pointerType === "pen") { // ペンの傾き取得
          setTiltX(e.tiltX);
          setTiltY(e.tiltY);
        } else {
          setTiltX(1);
          setTiltY(1);
        }
        break;
    }
    
    
    console.log(e);
    // console.log(e.touches[0].force);
    console.log(e.type);
    // if (pressure && tiltX && tiltY) {
    //   // draw(x, y, pressure, tiltX, tiltY);
    // } else {
    //   // draw(x, y, 0.3);
    //   return
    // }
  }

  // 描画
  // const draw = async(x: number, y: number, pressure?: number, tx?: number, ty?: number) => {
  //   // if (!isDrag) { return; }
  //   // const ctx = getContext();
  //   // const BaseLineWidth = 3;
  //   // ctx.beginPath();
  //   // ctx.globalAlpha = 1.0;
  //   // if (lastXPos === null || lastYPos=== null) {
  //   //   ctx.moveTo(x, y);
  //   // } else {
  //   //   ctx.moveTo(lastXPos, lastYPos);
  //   // }
  //   // // if (lastXPos !== null && lastYPos !== null) {
  //   // //   ctx.moveTo(lastXPos, lastYPos);
  //   // // }
  //   // console.log(x, y, pressure)
  //   // ctx.lineTo(x, y);
  //   // ctx.lineCap = "round";
  //   // ctx.lineWidth = BaseLineWidth;  

  //   // if (pressure != null) {
  //   //   if (pressure > 0.5) {
  //   //     setRed(200);
  //   //     setBlue(50);
  //   //   } else if (pressure < 0.15) {
  //   //     setRed(50);
  //   //     setBlue(200);
  //   //   } else {
  //   //     setRed(50);
  //   //     setBlue(50);
  //   //   }
  //   // } else {
  //   //   setRed(50);
  //   //   setBlue(50);
  //   // }
  //   // ctx.strokeStyle = `rgb(${red}, 50, ${blue})`;
  //   // ctx.stroke();
  //   // setLastXPos(x);
  //   // setLastYPos(y);
  // }

  // 描画終了
  const drawEnd = () => {
    setIsDrag(false);
    setPressure(null);
    setLastXPos(null);
    setLastYPos(null);
    setXPos(0);
    setYPos(0);
  }

  const midPointBetween = (lastX: number, lastY: number, posX: number, posY: number) => {
    return {
      x: lastX + (posX - lastX)/2,
      y: lastY + (posY - lastY)/2
    }
  }

  useEffect(() => {
    // 描画
    const draw = () => {
      if (!isDrag) { return; }
      const ctx = getContext();
      
      ctx.beginPath();
      ctx.globalAlpha = 1.0;
      if (lastXPos === null || lastYPos === null) {
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.moveTo(lastXPos, lastYPos);
      }
      console.log(xPos, yPos, pressure)
      console.log('last', lastXPos, lastYPos)

      if (lastXPos && lastYPos) {
        const midPoint = midPointBetween(lastXPos, lastYPos, xPos, yPos);
        console.log('mid', midPoint)
        ctx.quadraticCurveTo(lastXPos, lastYPos, midPoint.x, midPoint.y);
        
        // ctx.quadraticCurveTo(midPoint.x, midPoint.y, xPos, yPos);
      }
      
      const vx: number = lastXPos? ~~(Math.abs(xPos - lastXPos))+1: 1; // ペンxの速度
      const vy: number = lastYPos? ~~(Math.abs(yPos - lastYPos))+1: 1; // ペンyの速度

      console.log("aaaaa", (vx+vy)/80);
      
      ctx.lineTo(xPos, yPos);
      
      ctx.lineCap = "round";
      
      const minusLineWidth = (vx+vy)/80 < 5 ? (vx+vy)/80: 5;
      ctx.lineWidth = pressure? BaseLineWidth - minusLineWidth: BaseLineWidth;  

      if (pressure != null) {
        if (pressure > 0.5) {
          setRed(200);
          setBlue(0);
        } else if (pressure < 0.15) {
          setRed(0);
          setBlue(200);
        } else {
          setRed(0);
          setBlue(0);
        }
      } else {
        setRed(0);
        setBlue(0);
      }
      ctx.strokeStyle = `rgb(${red}, 0, ${blue})`;
      ctx.stroke();
      setLastXPos(xPos);
      setLastYPos(yPos);
    };

    draw();
  }, [xPos, yPos])

  return (
    <div className={styles.container}>
      <Head>
        <title>Pressure Pen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <main>
        <h1 className="my-5 text-center text-cyan-600">
          筆圧テスト（今の筆圧は{pressure}）
        </h1>


        <div className="my-16 mainCanvasBox">
          <canvas 
            id={styles.canvas_background_note}
            className="mx-auto"
            ref={canvasRef}
            // onMouseDown={onStart}
            // onMouseMove={onMove} // マウス動いた時
            // onMouseUp={drawEnd} // マウスが離れた時
            onPointerDown={onStart} // ポインター置くとき
            onPointerMove={onMove} // ポインター動いた時
            onPointerUp={drawEnd} // ポインター離した時
            // onTouchStart={onStart}
            // onTouchMove={onMove} // タッチで動かしてる時
            // onTouchEnd={drawEnd} // タッチを離した時
            width={"2700px"}
            height={"2700px"}
          >
            Your browser does not support the canvas element.
          </canvas>
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}

export default Home
