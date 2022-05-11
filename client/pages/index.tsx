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
  const isDrag = useState<boolean>(false); // ペンがノートに置かれているか否か
  const canvasRef = useRef(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  }

  // ペンを動かしてる時
  const onMove = (e: React.MouseEvent<HTMLCanvasElement> | any) => {
    if (e.buttons !== 1) { return; }
    const canvas: any = canvasRef.current;
    const rect: IRect = canvas.getBoundingClientRect();
    const x = ~~(e.clientX - rect.left);
    const y = ~~(e.clientY - rect.top);
    setPressure(e.pressure);
    if (pressure) {
      draw(x, y, pressure);
    } else {
      draw(x, y, 0.3);
    }
  }

  // 描画
  const draw = (x: number, y: number, pressure?: number) => {
    if (!isDrag) { return; }
    const ctx = getContext();
    ctx.beginPath();
    ctx.globalAlpha = 1.0;
    if (lastXPos === null || lastYPos=== null) {
      ctx.moveTo(x, y);
    } else {
      ctx.moveTo(lastXPos, lastYPos);
    }
    ctx.lineTo(x, y);
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
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
            onMouseMove={onMove}
            onMouseUp={drawEnd}
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
