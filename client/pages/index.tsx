import type { NextPage } from 'next'
import { useState, useEffect, useRef, MutableRefObject, MouseEventHandler } from 'react';
import Head from 'next/head'
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
  const [penWidth, setPenWidth] = useState<number>(2); // 線の太さ
  const [eraseWidth, setEraseWidth] = useState<number>(20); // 消しゴムの太さ
  const [undoable, setUndoable] = useState<boolean>(false); // undo可否
  const [redoable, setRedoable] = useState<boolean>(false); // redo可否
  const [historyList, setHistoryList] = useState<any[]>([]); // 筆跡の履歴管理（undo用）
  const [redoHistoryList, setRedoHistoryList] = useState<any[]>([]); // undoされたものを管理（redo用）
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [isDrag, setIsDrag] = useState<boolean>(false); // ペンがノートに置かれているか否か
  const [boundaryPressureValue, setBoundaryPressureValue] = useState<number>(1);
  const [mode, setMode] = useState<'pen'|'erase'>('pen');
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

	let path: paper.Path;
	let start: number;
	let duration: number;
	let interval: number;
	let segmentsToSend: any;
	let toSend: any;
  let json: any;
	let penColor: string;
  let boundaryValue: number;


	const draw = () => {
    Paper.view.onMouseDown = () => {
      
      path = new paper.Path();
			penColor = color;
			
      if(mode === 'pen') {
        path.strokeColor = new Paper.Color(color);
        path.strokeCap = 'round';
        path.strokeWidth = penWidth;
      } else if (mode === 'erase') {
        path.strokeColor = new Paper.Color('white');
        path.strokeCap = 'round';
        path.strokeJoin = 'round';
        path.strokeWidth = eraseWidth;
        path.blendMode = 'destination-out';
      }
			start = Date.now();

      


      let canvas: any = canvasRef.current;
      setCanvasWidth(canvas.width);
      setCanvasHeight(canvas.height);
      // const imageData = Paper.View.context.getImageData(0, 0, width, height);

      
      let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
      // console.log(canvas.toDataURL("image/png"));
      
      // const imageData = ctx.getImageData(0, 0, 1600, 1600);
      
		};
		Paper.view.onMouseDrag = (event: any) => {
			path.add(event.point);
		};
		Paper.view.onMouseUp = () => {
			cutPath(true);
			clearInterval(interval);
      json =  Paper.project.exportJSON({ asString: false })
      console.log("aaa", json)
      setHistoryList((prevHistoryList) => ([ ...prevHistoryList, json ]))
      // json[0][1]['children'][1][1].strokeColor.push(0.3)
      // imageData.position = new paper.Point(100, 100);
		};

		const cutPath = (up: boolean = false) => {
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
    if (redoHistoryList.length > 0) {
      setRedoHistoryList([]);
      setRedoable(false);
    }
  }

  const pointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrag) { return }
    console.log(e.pressure)
    console.log("これみたい", e);
    if (e.pressure != 0) {
      setCount(count+1)
      if (pressure === null || pressure === undefined) {
        setPressure(e.pressure)
      } else {
        setPressure(pressure+e.pressure);
      }
    }
  }

  const pointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrag(false);
    console.log(pressure);
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
    
    json =  Paper.project.exportJSON({ asString: false })
    if (json[0][1]["children"].length != pressureArray.length) {
      pressureArray.push(0);
    }
    console.log('pressureArray', pressureArray)
    setPressure(null);
    setUndoable(true);
    setCount(0);
  }

  // シンプルなundo
  const normalUndo = () => {
    if (undoable) {
      const undoStrokes = historyList[historyList.length-2]; // undo後のストローク状態
      Paper.project.clear()
      Paper.project.importJSON(undoStrokes)

      // 履歴が最後の1つだったらundo不可能状態に
      if(historyList.length <= 1) {
        setUndoable(false);
      }
      // undo前の状態をredo用のListに追加
      const lastPressure = pressureArray[pressureArray.length-1];
      setRedoHistoryList(
        (prevRedoHistoryList) => (
          [
            ...prevRedoHistoryList, 
            {'stroke': historyList[historyList.length-1], 'pressure': lastPressure}
          ]
        )
      );
      // undo前の状態を削除
      setHistoryList(
        (prevHistoryList) => prevHistoryList.filter((_, index) => index < prevHistoryList.length-1)
      );
      // undo前の状態の筆圧を削除
      pressureArray.pop();
      // redo可能状態に
      setRedoable(true);
    }
  }

  // シンプルなredo
  const normalRedo = () => {
    if(redoable) {
      const redoStrokes = redoHistoryList[redoHistoryList.length-1]['stroke'];

      // redoできるものが最後の一つだった場合redo不可能状態に
      if (redoHistoryList.length === 1) {
        setRedoable(false);
      }

      // redo後undoできる状態に復活
      setHistoryList(
        (prevHistoryList) => ([...prevHistoryList, redoStrokes])
      );
      // redo後筆圧を復活
      pressureArray.push(redoHistoryList[redoHistoryList.length-1]['pressure']);
      // redo前の状態をredo用のListから削除
      setRedoHistoryList(
        (prevRedoHistoryList) => prevRedoHistoryList.filter((_, index) => index < prevRedoHistoryList.length-1)
      );
      Paper.project.clear();
      Paper.project.importJSON(redoStrokes);
      setUndoable(true);
    }
  }

  // 筆圧によった削除方法
  const handleDeleteRowPressureStroke = (e: React.ChangeEvent<HTMLInputElement>) => {
    boundaryValue = Number(e.target.value) / 10000;
    json =  Paper.project.exportJSON({ asString: false })
    let pressureDiff: number = 0;
    for (let i=0; i<pressureArray.length; i++) {
      pressureDiff = pressureArray[i] - (1-boundaryValue);
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
  }

  const rewriteStroke = () => {
    let pressureDiff: number = 0;
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
    setBoundaryPressureValue(boundaryValue);
  }

	useEffect(() => {
		Paper.setup('drawingCanvas');
		Paper.install(window);
		draw();
	}, []);

  useEffect(() => {
    draw();
  }, [color, penWidth, eraseWidth, mode])


	return (
    <>
      <PaperHeader 
        setColor={setColor}
        setPenWidth={setPenWidth}
        setEraseWidth={setEraseWidth}
        setMode={setMode}
        undo={normalUndo} 
        redo={normalRedo} 
        undoable={undoable} 
        redoable={redoable}
      />
      <div className="Canvas w-full h-full flex " id="wrapper">
        <canvas 
          ref={canvasRef}
          style={{backgroundImage: 'url("https://celclipmaterialprod.s3-ap-northeast-1.amazonaws.com/91/01/1880191/thumbnail?1637291685")', touchAction: "none"}}
          id="drawingCanvas"
          width={"5000px"}
          height={"10000px"}
          className="canvas_background_note max-w-full w-7/12 max-h-full" 
          onPointerDownCapture={pointerDown}
          onPointerMoveCapture={pointerMove}
          onPointerUpCapture={pointerUp}
        />
        
        {/* 操作UI */}
        <div className='fixed top-12 right-0 w-5/12 bg-gray-900 h-full'>
          <div className='w-4/5 mx-auto h-1/3 bg-gray-800 rounded-3xl mt-2'>
            <div className='rangebar mx-5 pt-12'>
              <input id="large-range" type="range" defaultValue={10000} min="0" max="10000" onChange={handleDeleteRowPressureStroke} onInput={handleDeleteRowPressureStroke} onPointerUp={rewriteStroke} />
            </div>
          </div>
          <div className='flex w-full h-1/3 mt-2'>
            <div className='w-2/5 mx-auto h-full bg-gray-800 rounded-3xl'>
              
            </div>
            <div className='w-2/5 mx-auto h-full bg-gray-800 rounded-3xl'>
            </div>
          </div>
        </div>

        {/* 書いてる時の筆圧のゲージ */}
        {/* <div className='rangebar fixed bottom-2 w-full'>
          <input id="large-range" type="range" defaultValue={10000} min="0" max="10000" onChange={handleDeleteRowPressureStroke} onInput={handleDeleteRowPressureStroke} onPointerUp={rewriteStroke} />
        </div> */}
      </div>
    </>
	);
}

export default Home
