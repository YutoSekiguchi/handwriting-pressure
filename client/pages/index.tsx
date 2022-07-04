import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { removeItems } from '../utils/Helpers'
import Paper from 'paper'

import PaperHeader from '../components/paper/Header';

// import draw1 from '../utils/draw1'
// interface IRect {
//   width: number;
//   height: number;
//   left: number;
//   right: number;
//   top: number;
//   bottom: number;
// }

// let imageData: any;
// var path: any;

let pressureArray: number[] = [];

const Home: NextPage = () => {

  // const [lastXPos, setLastXPos] = useState<number | null>(null); // 直前のペンのx座標
  // const [lastYPos, setLastYPos] = useState<number | null>(null); // 直前のペンのy座標
  // //////////////////////////////////////////////////////////////////////////////////////////////////
  // const [xPos, setXPos] = useState<number>(0); // ペンのx座標
  // const [yPos, setYPos] = useState<number>(0); // ペンのy座標
  // /////////////////////////////////////////////////////////////////////////////////////////////
  const [pressure, setPressure] = useState<number | null | undefined>(null); // 筆圧
  // const [tiltX, setTiltX] = useState<number | null | undefined>(null); // ペンの傾きx
  // const [tiltY, setTiltY] = useState<number | null | undefined>(null); // ペンの傾きy
  // const [red, setRed] = useState<number>(0); // 赤
  // const [blue, setBlue] = useState<number>(0); // 青
  const [color, setColor] = useState<string>('#000000');
  const [count, setCount] = useState<number>(0); // 何回moveしたか
  const [width, setWidth] = useState<number>(1.7); // 線の太さ
  const [undoable, setUndoable] = useState<boolean>(false); // undo可否
  const [redoable, setRedoable] = useState<boolean>(false); // redo可否
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(800);
  const [isDrag, setIsDrag] = useState<boolean>(false); // ペンがノートに置かれているか否か
  const canvasRef = useRef(null);

  
  
  // const BaseLineWidth = 10; // 線の太さ（基準）

  // const EpenButton = {
  //   tip: 0x1,    // left mouse, touch contact, pen contact
  //   barrel: 0x2, // right mouse, pen barrel button
  //   middle: 0x4, // middle mouse
  //   eraser: 0x20 // pen eraser button
  // }

  // const getContext = (): CanvasRenderingContext2D => {
  //   const canvas: any = canvasRef.current;

  //   return canvas.getContext('2d');
  // }

  // // ペンがノートに触れ始めた時の処理
  // const onStart = () => {
  //   setIsDrag(true);
  //   if (imageData) {
  //     const ctx = getContext();
      
  //   }
  // }

  // // ペンを動かしてる時
  // const onMove = async(e: React.MouseEvent<HTMLCanvasElement> | any) => {
  //   if (!isDrag) { return; }
  //   const canvas: any = canvasRef.current;
  //   const rect: IRect = canvas.getBoundingClientRect();
    
  //   let x = 0;
  //   let y = 0;
  //   let touch;

  //   switch (e.type) {
  //     // PCのマウスなら
  //     case "mousemove":
  //       x = ~~(e.clientX - rect.left);
  //       y = ~~(e.clientY - rect.top);
  //       break;
  //     // タッチ操作なら
  //     case "touchmove":
  //       touch = e.touches[0] || e.changedTouches[0];
  //       x = ~~(touch.clientX - rect.left);
  //       y = ~~(touch.clientY - rect.top);
  //       setPressure(e.touches[0].force);
  //       break;
  //     // タッチ操作なら
  //     case "touchstart":
  //       touch = e.touches[0] || e.changedTouches[0];
  //       x = ~~(touch.clientX - rect.left);
  //       y = ~~(touch.clientY - rect.top);
  //       setPressure(e.touches[0].force);
  //       break;
  //     case "pointermove":
  //       console.log(rect.left);
  //       console.log(rect.bottom);
  //       x = ~~(e.clientX - rect.left)*3;
  //       y = ~~(e.clientY - rect.top)*3;
  //       //////////////////////////////////////////
  //       setXPos(x);
  //       setYPos(y);
  //       ////////////////////////////////////////
  //       setPressure(e.pressure);
  //       if (e.pointerType && e.pointerType === "pen") { // ペンの傾き取得
  //         setTiltX(e.tiltX);
  //         setTiltY(e.tiltY);
  //       } else {
  //         setTiltX(1);
  //         setTiltY(1);
  //       }
  //       break;
  //   }
    
    
  //   // console.log(e);
  //   // console.log(e.touches[0].force);
  //   // console.log(e.type);
  //   // if (pressure && tiltX && tiltY) {
  //   //   // draw(x, y, pressure, tiltX, tiltY);
  //   // } else {
  //   //   // draw(x, y, 0.3);
  //   //   return
  //   // }
  // }

  // // 描画
  // // const draw = async(x: number, y: number, pressure?: number, tx?: number, ty?: number) => {
  // //   // if (!isDrag) { return; }
  // //   // const ctx = getContext();
  // //   // const BaseLineWidth = 3;
  // //   // ctx.beginPath();
  // //   // ctx.globalAlpha = 1.0;
  // //   // if (lastXPos === null || lastYPos=== null) {
  // //   //   ctx.moveTo(x, y);
  // //   // } else {
  // //   //   ctx.moveTo(lastXPos, lastYPos);
  // //   // }
  // //   // // if (lastXPos !== null && lastYPos !== null) {
  // //   // //   ctx.moveTo(lastXPos, lastYPos);
  // //   // // }
  // //   // console.log(x, y, pressure)
  // //   // ctx.lineTo(x, y);
  // //   // ctx.lineCap = "round";
  // //   // ctx.lineWidth = BaseLineWidth;  

  // //   // if (pressure != null) {
  // //   //   if (pressure > 0.5) {
  // //   //     setRed(200);
  // //   //     setBlue(50);
  // //   //   } else if (pressure < 0.15) {
  // //   //     setRed(50);
  // //   //     setBlue(200);
  // //   //   } else {
  // //   //     setRed(50);
  // //   //     setBlue(50);
  // //   //   }
  // //   // } else {
  // //   //   setRed(50);
  // //   //   setBlue(50);
  // //   // }
  // //   // ctx.strokeStyle = `rgb(${red}, 50, ${blue})`;
  // //   // ctx.stroke();
  // //   // setLastXPos(x);
  // //   // setLastYPos(y);
  // // }

  // // 描画終了
  // const drawEnd = () => {
  //   console.log("1224242")
  //   setIsDrag(false);
  //   setPressure(null);
  //   setLastXPos(null);
  //   setLastYPos(null);
  //   setXPos(0);
  //   setYPos(0);
    
  // }

  // const midPointBetween = (lastX: number, lastY: number, posX: number, posY: number) => {
  //   return {
  //     x: lastX + (posX - lastX)/2,
  //     y: lastY + (posY - lastY)/2
  //   }
  //   // return {
  //   //   x: lastX,
  //   //   y: posY
  //   // }
  // }

  // // useEffect(() => {
  // //   // 描画
  // //   const draw = async() => {
  // //     if (!isDrag) { return; }
  // //     const ctx = getContext();
  // //     const canvas: any = canvasRef.current;
  // //     Paper.setup(canvas);
  // //     draw1();
  // //     // ctx.beginPath();
  // //     // ctx.globalAlpha = 1.0;
  // //     // ctx.lineCap = "round";
  // //     // if (lastXPos === null || lastYPos === null) {
  // //     //   ctx.moveTo(xPos, yPos);
  // //     // } else {
  // //     //   ctx.moveTo(lastXPos, lastYPos);
  // //     // }
  // //     // console.log(xPos, yPos, pressure)
  // //     // console.log('last', lastXPos, lastYPos)

  // //     // if (lastXPos && lastYPos) {
  // //     //   const midPoint = await midPointBetween(lastXPos, lastYPos, xPos, yPos);
  // //     //   console.log('mid', midPoint)
  // //     //   // ctx.quadraticCurveTo(lastXPos, lastYPos, midPoint.x, midPoint.y);
        
  // //     //   // ctx.quadraticCurveTo(midPoint.x, midPoint.y, xPos, yPos);
  // //     //   //ctx.arc(midPoint.x, midPoint.y, 10, 0, 2 * Math.PI);
  // //     // }
      
  // //     // const vx: number = lastXPos? ~~(Math.abs(xPos - lastXPos))+1: 1; // ペンxの速度
  // //     // const vy: number = lastYPos? ~~(Math.abs(yPos - lastYPos))+1: 1; // ペンyの速度

  // //     // console.log("aaaaa", (vx+vy)/80);
      


  // //     // ctx.lineTo(xPos, yPos);
      
      
      
  // //     // const minusLineWidth = (vx+vy)/80 < 5 ? (vx+vy)/120: 5;
  // //     // ctx.lineWidth = pressure? BaseLineWidth - minusLineWidth: BaseLineWidth;  

  // //     // if (pressure != null) {
  // //     //   if (pressure > 0.5) {
  // //     //     setRed(200);
  // //     //     setBlue(0);
  // //     //   } else if (pressure < 0.15) {
  // //     //     setRed(0);
  // //     //     setBlue(200);
  // //     //   } else {
  // //     //     setRed(0);
  // //     //     setBlue(0);
  // //     //   }
  // //     // } else {
  // //     //   setRed(0);
  // //     //   setBlue(0);
  // //     // }
  // //     // ctx.strokeStyle = `rgb(${red}, 0, ${blue})`;
  // //     // ctx.stroke();
  // //     setLastXPos(xPos);
  // //     setLastYPos(yPos);
  // //     setCount(count+1);
  // //   };

  // //   draw();
  // // }, [xPos, yPos])

  // const draw1 = () => {
  //   // let myPath = new Paper.Path();
  
  //   // Paper.view.onMouseDown = (event) => {
  //   //   myPath.strokeColor = "black";
  //   //   myPath.strokeWidth = 3;
  //   // };
  
  //   // Paper.view.onMouseDrag = (event) => {
  //   //   myPath.add(event.point);
  //   // };
  
  //   // Paper.view.draw();
  
  // Paper.view.onMouseDown = (event) => {
  //   // If we produced a path before, deselect it:
  //   if (path) {
  //     path.selected = false;
  //   }
  
  //   // Create a new path and set its stroke color to black:
  //   path.segments = [event.point]
  //   path.strokeColor = 'black'
  //   path.strokeCap = 'round'
  //   path.strokeWidth = 2
  //     // Select the path, so we can see its segment points:
  //   path.fullySelected = true
  // }
  
  // // While the user drags the mouse, points are added to the path
  // // at the position of the mouse:
  // Paper.view.onMouseDrag = (event) => {
  //   path.add(event.point);
  
  //   // Update the content of the text item to show how many
  //   // segments it has:
  //   if (path) {
  //     path.selected = false;
  //   }
    
    
  // }
  
  // // When the mouse is released, we simplify the path:
  // Paper.view.onMouseUp = (event) => {
  //   var segmentCount = path.segments.length;
  
  //   // When the mouse is released, simplify it:
  //   path.simplify(20);
  
  //   // Select the path, so we can see its segments:
  //   path.fullySelected = true;
  
  //   var newSegmentCount = path.segments.length;
  //   var difference = segmentCount - newSegmentCount;
  //   var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
    
  //   if (path) {
  //     path.selected = false;
  //   }
    
  //   // const ctx = getContext();
  //   // imageData = ctx.getImageData(0, 0, 800, 500);
  //   // console.log('canvas:', imageData);
  //   // ctx.putImageData(imageData, 0, 0);
  // }
  // };

  // useEffect(() => {
  //   const canvas: any = canvasRef.current;
  //   Paper.setup(canvas);
  //   path = new Paper.Path();
  //   draw1();
    
  // }, []);

  // return (
  //   <div className={styles.container}>
  //     <Head>
  //       <title>Pressure Pen</title>
  //       <meta name="description" content="Generated by create next app" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>

      
  //     <main>
  //       <h1 className="my-5 text-center text-cyan-600">
  //         筆圧テスト（今の筆圧は{pressure}）
  //       </h1>


  //       <div className="my-16 mainCanvasBox">
  //         <canvas 
  //           id={styles.canvas_background_note}
  //           className="mx-auto"
  //           ref={canvasRef}
  //           width="800px"
  //           height="500px"
  //           // onMouseDown={onStart}
  //           // onMouseMove={onMove} // マウス動いた時
  //           // onMouseUp={drawEnd} // マウスが離れた時
  //           onPointerDown={onStart} // ポインター置くとき
  //           onPointerMove={onMove} // ポインター動いた時
  //           onPointerUp={drawEnd} // ポインター離した時
  //           // onTouchStart={onStart}
  //           // onTouchMove={onMove} // タッチで動かしてる時
  //           // onTouchEnd={drawEnd} // タッチを離した時
  //         >
  //         </canvas>
  //       </div>
  //     </main>

  //     {/* <footer className={styles.footer}>
  //       <a
  //         href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Powered by{' '}
  //         <span className={styles.logo}>
  //           <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
  //         </span>
  //       </a>
  //     </footer> */}
  //   </div>
  // )

  let jsons: any;
	let path: any;
	let start: any;
	let duration;
	let lastCut = 0;
	let interval: any;
	let textItem: any;
	let segmentsToSend: any;
	let toSend: any;
  let json: any;
	let penColor: string;
	let penWidth: number;

	let draw = () => {
    Paper.view.onMouseDown = function() {
      
      path = new paper.Path();
			penColor = color;
			penWidth = width;
			
			path.strokeColor = new Paper.Color(color);
      path.strokeCap = 'round';
			path.strokeWidth = penWidth;
      console.log(color)
			start = Date.now();


      let canvas: any = canvasRef.current;
      // const imageData = Paper.View.context.getImageData(0, 0, width, height);
      console.log(canvas)

      
      let ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, 1600, 1600);
      // console.log(imageData)
      
      ctx = canvas.getContext("2d");
      
      
      // console.log("bbb", raster.getImageData(0, 0, 1600, 1600))
		};
		Paper.view.onMouseDrag = function(event: any) {
			path.add(event.point);
      // console.log(imageData)
		};
		Paper.view.onMouseUp = function() {
			cutPath(true);
			clearInterval(interval);
      json =  Paper.project.exportJSON({ asString: false })
      console.log("aaa", json)
      // json[0][1]['children'][1][1].strokeColor.push(0.3)
      
      // imageData.position = new paper.Point(100, 100);
		};

		let cutPath = function(up: boolean = false) {
			duration = Date.now() - start;
			if (duration < 100) {
				duration = 100;
			}
			let segmentCount = path.segments.length;
			path.simplify(20);
			let newSegmentCount = path.segments.length;
			let difference = segmentCount - newSegmentCount;
			let percentage =
				100 - Math.round((newSegmentCount / segmentCount) * 100);
			// jsons = Paper.project.exportJSON({ asString: false });
			// let segments =
			// 	jsons[0][1]['children'][jsons[0][1]['children'].length - 1][1][
			// 		'segments'
			// 	];

			// if (lastCut != 0) {
			// 	segmentsToSend = removeItems(segments, lastCut);
			// } else {
			// 	segmentsToSend = segments;
			// }

			// if (up) {
			// 	lastCut = 0;
			// } else {
			// 	start = Date.now();
			// 	lastCut = segments.length;
			// }

			// toSend = JSON.stringify(segmentsToSend);
			// console.log(toSend, duration, penColor, penWidth);
		};
	};

  const pointerDown = () => {
    setIsDrag(true);
  }

  const pointerMove = (e: any) => {
    if (!isDrag) { return }
    console.log(e.pressure)
    console.log("これみたい", e);
    if (e.pressure != 0) {
      setCount(count+1)
      if (pressure === null) {
        setPressure(e.pressure)
      } else {
        setPressure(pressure+e.pressure);
      }
    }
  }

  const pointerUp = (e: any) => {
    setIsDrag(false);
    console.log(pressure);
    alert(pressure)
    if (pressure) {
      let avgPressure = pressure/count;
      console.log('avgPressure', avgPressure)
      console.log(e)
      console.log(e.pointerType)
      const pressureArrayLength = pressureArray.length;
      while (pressureArray.length==pressureArrayLength) {
        switch (e.pointerType) {
          // PCのマウスなら（マウスはPCで試しやすくするためにランダムに）
          case "mouse":
            pressureArray.push(Math.random());
            break;
          // タッチ操作なら
          case "touch":
            pressureArray.push(avgPressure);
            break;
          // ペン操作なら
          case "pen":
            pressureArray.push(avgPressure);
            break;
          default:
            pressureArray.push(avgPressure);
        }
      }
    }
    console.log('pressureArray', pressureArray)
    setPressure(null);
    setUndoable(true);
    setCount(0);
  }

  // シンプルなundo
  const normalUndo = () => {
    json =  Paper.project.exportJSON({ asString: false })
    // const lastStroke = json[0][1]["children"][pressureArray.length-1][1];
    let lastStroke;
    for (let i=pressureArray.length-1; i>=0; i--) {
      lastStroke = json[0][1]["children"][i][1];
      if (lastStroke.strokeColor.length <= 3) {
        lastStroke.strokeColor.push(0);
        break;
      } else if (lastStroke.strokeColor.length == 4 && lastStroke.strokeColor[3]!=0) {
        lastStroke.strokeColor[3] = 0;
        break;
      }
    }
    Paper.project.clear()
    Paper.project.importJSON(json)
    setRedoable(true);
  }

  // シンプルなredo
  const normalRedo = () => {
    json = Paper.project.exportJSON({ asString: false });
    console.log('redo', json)
    // let lastStroke = json[0][1]["children"][pressureArray.length-1][1];
    let lastStroke;
    let count: number = 0;
    for (let i=0; i<pressureArray.length; i++) {
      lastStroke = json[0][1]["children"][i][1];
      count+=1;
      if (lastStroke.strokeColor.length == 4 && lastStroke.strokeColor[3]==0) {
        lastStroke.strokeColor[3] = 1;
        break;
      }
    }
    
    if (count == pressureArray.length) {
      setRedoable(false);
    }
    Paper.project.clear();
    Paper.project.importJSON(json);
  }

  // 筆圧によった削除方法
  const handleDeleteRowPressureStroke = (e: React.ChangeEvent<HTMLInputElement>) => {
    let boundaryValue: number = Number(e.target.value) / 10000;
    json =  Paper.project.exportJSON({ asString: false })
    let pressureDiff: number = 0;
    for (let i=0; i<pressureArray.length; i++) {
      pressureDiff = pressureArray[i] - (1-boundaryValue);
      // console.log("diff", pressureDiff)
      if ((json[0][1]["children"][i][1].strokeColor.length === 4 && pressureDiff > 0.2)) {
        json[0][1]["children"][i][1].strokeColor[3] = 1;
      }
      if (pressureDiff < 0.2 && pressureDiff > 0) {
        if (json[0][1]["children"][i][1].strokeColor.length <= 3) {
          json[0][1]["children"][i][1].strokeColor.push(1-((1-pressureDiff))+0.1)
        } else if (json[0][1]["children"][i][1].strokeColor.length === 4) {
          json[0][1]["children"][i][1].strokeColor[3] = (1-((1-pressureDiff))+0.1)
        }
      }
      if (pressureArray[i] <= 1 - boundaryValue && json[0][1]["children"][i][1].strokeColor.length <= 3) {
        json[0][1]["children"][i][1].strokeColor.push(0)
      } else if (pressureArray[i] <= 1 - boundaryValue && json[0][1]["children"][i][1].strokeColor.length == 4 && json[0][1]["children"][i][1].strokeColor[3] !== 0) {
        json[0][1]["children"][i][1].strokeColor[3]=0;
      }
    }
    Paper.project.clear()
    Paper.project.importJSON(json)
    setTimeout(() => {
      boundaryValue = Number(e.target.value) / 10000;
      json =  Paper.project.exportJSON({ asString: false })
      for (let i=0; i<pressureArray.length; i++) {
        pressureDiff = pressureArray[i] - (1-boundaryValue);
        if (pressureDiff < 0.2 && pressureDiff > 0) {
          if (json[0][1]["children"][i][1].strokeColor.length <= 3) {
            json[0][1]["children"][i][1].strokeColor.push(1)
          } else if (json[0][1]["children"][i][1].strokeColor.length === 4) {
            json[0][1]["children"][i][1].strokeColor[3] = 1
          }
        }
      }
      Paper.project.clear()
      Paper.project.importJSON(json)
    }, 3000)
  }

	useEffect(() =>{
		Paper.setup('drawingCanvas');
		Paper.install(window);
		draw();
	}, []);

  useEffect(() => {
    draw();
  }, [color, width])


	return (
    <>
      <PaperHeader 
        setColor={setColor}
        setWidth={setWidth} 
        undo={normalUndo} 
        redo={normalRedo} 
        undoable={undoable} 
        redoable={redoable} 
      />
      <div className="Canvas w-full h-full">
        <canvas 
          ref={canvasRef}
          style={{ backgroundColor: "#fff", backgroundImage: 'linear-gradient(180deg, #ccc 1px, transparent 1px)', backgroundSize: "100% 4em", touchAction: "none"}}
          id="drawingCanvas"
          width="800px" 
          height="1000px"
          className="canvas_background_note mx-auto max-w-full max-h-full" 
          onPointerDownCapture={pointerDown}
          onPointerMoveCapture={pointerMove}
          onPointerUpCapture={pointerUp}
        />

        {/* 書いてる時の筆圧のゲージ */}
        {/* <div className='pressureGauge'>
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-3">
            <div className="h-4 rounded-full" style={{width: `${pressure? (pressure/count)*100: 0}%`, backgroundColor: '#53aeff'}}></div>
          </div>
        </div> */}
        <div className='rangebar fixed bottom-2 w-full'>
          <input id="large-range" type="range" defaultValue={10000} min="0" max="10000" onChange={handleDeleteRowPressureStroke} />
        </div>
      </div>
    </>
	);
}

export default Home
