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
  const [pressure, setPressure] = useState<number | null | undefined>(null); // 筆圧
  const [red, setRed] = useState<number>(0);
  const [blue, setBlue] = useState<number>(0);
  const [isDrag, setIsDrag] = useState<boolean>(false); // ペンがノートに置かれているか否か
  const canvasRef = useRef(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  }

  const onStart = () => {
    setIsDrag(true);
  }

  // ペンを動かしてる時
  const onMove = (e: React.MouseEvent<HTMLCanvasElement> | any) => {
    console.log(e.buttons);
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
    }
    
    
    console.log(e);
    // console.log(e.touches[0].force);
    console.log(e.type);
    if (pressure) {
      draw(x, y, pressure);
    } else {
      // draw(x, y, 0.3);
      return
    }
  }

  // 描画
  const draw = (x: number, y: number, pressure?: number) => {
    if (!isDrag) { return; }
    const ctx = getContext();
    ctx.beginPath();
    ctx.globalAlpha = 1.0;
    // if (lastXPos === null || lastYPos=== null) {
    //   ctx.moveTo(x, y);
    // } else {
    //   ctx.moveTo(lastXPos, lastYPos);
    // }
    if (lastXPos !== null && lastYPos !== null) {
      ctx.moveTo(lastXPos, lastYPos);
    }
    console.log(x, y, pressure)
    ctx.lineTo(x, y);
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    if (pressure != null) {
      if (pressure > 0.5) {
        setRed(200);
        setBlue(50);
      } else if (pressure < 0.15) {
        setRed(50);
        setBlue(200);
      } else {
        setRed(50);
        setBlue(50);
      }
    } else {
      setRed(50);
      setBlue(50);
    }
    ctx.strokeStyle = `rgba(${red}, 50, ${blue}, 0.8)`;
    ctx.stroke();
    setLastXPos(x);
    setLastYPos(y);
  }

  // 描画終了
  const drawEnd = () => {
    setLastXPos(null);
    setLastYPos(null);
    setPressure(null);
    setRed
    setIsDrag(false);
  }

  useEffect(() => {
  })

  return (
    <div className={styles.container}>
      <Head>
        <title>Pressure Pen</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <main>
        <h1 className="text-center text-cyan-600 my-5">
          筆圧テスト（{pressure}）
        </h1>


        <div className="mainCanvasBox my-16">
          <canvas 
            id={styles.canvas_background_note}
            className="mx-auto"
            ref={canvasRef}
            // onMouseDown={onStart}
            // onMouseMove={onMove} // マウス動いた時
            // onMouseUp={drawEnd} // マウスが離れた時
            onTouchStart={onStart}
            onTouchMove={onMove} // タッチで動かしてる時
            onTouchEnd={drawEnd} // タッチを離した時
            width={"600px"}
            height={"600px"}
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
