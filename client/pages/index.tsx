import type { NextPage } from 'next'
import { useState, useEffect, useRef, MutableRefObject, MouseEventHandler } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { removeItems } from '../utils/Helpers'
import Paper from 'paper'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)
ChartJS.defaults.scales.linear.min = 0;


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
let aboutPressureCountArray: number[] = [...Array(11)].map(x=>0);

type ImageDataObject = {
  url: string,
  strokeData: ImageData
}

const Home: NextPage = () => {

  // const [lastXPos, setLastXPos] = useState<number | null>(null); // 直前のペンのx座標
  // const [lastYPos, setLastYPos] = useState<number | null>(null); // 直前のペンのy座標

  // const [xPos, setXPos] = useState<number>(0); // ペンのx座標
  // const [yPos, setYPos] = useState<number>(0); // ペンのy座標

  const [pressure, setPressure] = useState<number | null | undefined>(null); // 筆圧
  const [nowConfirmPressure, setNowConfirmPressure] = useState<number|null>(null); // 1ストロークあたりの筆圧
  const [avgConfirmPressure, setAvgConfirmPressure] = useState<number|null>(null); //筆圧の平均
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
  const labels: number[] = [...Array(11)].map((_, i) => ((10-i)/10));
  const [lineGraphData, setLineGraphData] = useState<any>(null);
  const [doughnutNowPressureGraphData, setDoughnutNowPressureGraphData] = useState<any>(null);
  const [doughnutAvgPressureGraphData, setDoughnutAvgPressureGraphData] = useState<any>(null);
  const [imageDataList, setImageDataList] = useState<ImageDataObject[]>([]);
  const canvasRef = useRef(null);

  const options: {} = {
    plugins: {
      legend:{
        display:false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true
      },
      y: {
        display: false
      },
    },
  };

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
      const aboutAvgPressure = Math.floor((1-avgPressure)*10)/10;
      const pressureArrayLength = pressureArray.length;
      while (pressureArray.length==pressureArrayLength) {
        switch (e.pointerType) {
          // PCのマウスなら（マウスはPCで試しやすくするためにランダムに）
          case "mouse":
            const rand = Math.random();
            pressureArray.push(rand);
            aboutPressureCountArray[((Math.floor((1-rand) * 10) / 10))*10] += 1;
            break;
          // タッチ操作なら
          case "touch":
            pressureArray.push(avgPressure);
            aboutPressureCountArray[(aboutAvgPressure)*10] += 1;
            break;
          // ペン操作なら
          case "pen":
            pressureArray.push(avgPressure);
            aboutPressureCountArray[(aboutAvgPressure)*10] += 1;
            break;
          default:
            pressureArray.push(avgPressure);
            aboutPressureCountArray[(aboutAvgPressure)*10] += 1;
        }
      }
    }
    
    json =  Paper.project.exportJSON({ asString: false })
    if (json[0][1]["children"].length != pressureArray.length) {
      pressureArray.push(0);
      aboutPressureCountArray[0] += 1;
    }
    console.log('pressureArray', pressureArray)
    console.log(aboutPressureCountArray);
    setLineGraphData(
      {
        labels: labels,
        datasets: [
          {
            label: "筆圧",
            data: aboutPressureCountArray,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            fill: true,
          },
        ],
      }
    );
    setNowConfirmPressure(pressureArray[pressureArray.length-1]);
    setDoughnutNowPressureGraphData(
      {
        datasets: [
          {
            data: [pressureArray[pressureArray.length-1], 1-pressureArray[pressureArray.length-1]],
            backgroundColor: ["rgba(75, 192, 192, 1)", "rgba(0, 0, 0, 0)"],
            borderColor: "rgba(75, 192, 192, 0.1)",
          }
        ],
        labels: ['現在の筆圧', 'None'],
      }
    );
    
    let tmp = 0;
    for(let i=0;i<pressureArray.length;i++) {
      tmp += pressureArray[i];
    }
    const avgPressureForDoughnut = tmp/pressureArray.length;
    setAvgConfirmPressure(avgPressureForDoughnut);
    setDoughnutAvgPressureGraphData(
      {
        datasets: [
          {
            data: [avgPressureForDoughnut, 1-avgPressureForDoughnut],
            backgroundColor: ["rgba(192, 75, 192, 1)", "rgba(0, 0, 0, 0)"],
            borderColor: "rgba(192, 75, 192, 0.1)",
          }
        ],
        labels: ['今までの筆圧の平均', 'None'],
      }
    )
    setPressure(null);
    setUndoable(true);
    setCount(0);
    const canvas: any = canvasRef.current;
    const imageUrl: string = canvas.toDataURL("image/png");
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setImageDataList((prevImageDataList) => (
      [
        ...prevImageDataList, 
        {
          url: imageUrl,
          strokeData: imageData,
        },
      ]
    ));
    console.log(imageDataList);
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
      fixChartData();
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
      fixChartData();
    }
  }

  const fixChartData = () => {
    let tmp: number[] = [...Array(11)].map(x=>0);
      for(let i=0;i<pressureArray.length;i++) {
        const aboutAvgPressure = Math.floor((1-pressureArray[i])*10)/10;
        tmp[aboutAvgPressure*10] += 1;
      }
      aboutPressureCountArray = tmp;
      setLineGraphData(
        {
          labels: labels,
          datasets: [
            {
              label: "筆圧",
              data: aboutPressureCountArray,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.1)",
              fill: true,
            },
          ],
        }
      );
  }

  // 筆圧によった削除方法
  const handleDeleteRowPressureStroke = (e: React.ChangeEvent<HTMLInputElement>) => {
    boundaryValue = Number(e.target.value) / 10000;
    json =  Paper.project.exportJSON({ asString: false })
    let pressureDiff: number = 0;
    for (let i=0; i<pressureArray.length; i++) {
      pressureDiff = pressureArray[i] - (1-boundaryValue);
      if ((json[0][1]["children"][i][1].strokeColor.length === 4 && pressureDiff > 0.1)) {
        json[0][1]["children"][i][1].strokeColor[3] = 1;
      }
      if (pressureDiff < 0.1 && pressureDiff > 0) {
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
      if (pressureDiff < 0.1 && pressureDiff > 0) {
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
          className="canvas_background_note max-w-full w-8/12 max-h-full" 
          onPointerDownCapture={pointerDown}
          onPointerMoveCapture={pointerMove}
          onPointerUpCapture={pointerUp}
        />
        
        {/* 操作UI */}
        <div className='fixed top-12 right-0 w-4/12 bg-gray-900 h-full'>
          <div className='w-11/12 mx-auto h-1/3 bg-gray-800 rounded-3xl mt-2'>
            <div className='rangebar mx-5 pt-12'>
              <input id="large-range" type="range" defaultValue={10000} min="0" max="10000" onChange={handleDeleteRowPressureStroke} onInput={handleDeleteRowPressureStroke} onPointerUp={rewriteStroke} />
            </div>
            <div className='chart-bar mx-5 h-2/3'>
              {lineGraphData?
                <Line
                  data={lineGraphData}
                  options={options}
                  id="chart-key"
                />
                :
                <Line 
                  options={options}
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: '筆圧',
                        data: aboutPressureCountArray,
                        borderColor: "rgb(75, 192, 192)",
                      },
                    ],
                  }}
                />
              }
            </div>
          </div>
          <div className='flex w-full h-1/6 mt-2'>
            <div className='w-2/5 mx-auto h-full bg-gray-800 rounded-3xl justify-center items-center'>
              <h4 className='text-center text-gray-200'>now</h4>
              <h3 className='text-center text-gray-200 relative top-12'>
                {nowConfirmPressure?(Math.round(nowConfirmPressure*1000)/1000):"0.0"}
              </h3>
              <div className='chart-doughnut h-4/5 relative bottom-6'>
                {doughnutNowPressureGraphData&&
                <Doughnut
                  data={doughnutNowPressureGraphData}
                  options={
                    {
                      plugins: {
                        legend:{
                          display:false,
                        },
                      },
                      cutout: 40,
                      maintainAspectRatio: false,
                    }
                  }
                />
                }
              </div>
            </div>
            <div className='w-2/5 mx-auto h-full bg-gray-800 rounded-3xl'>
              <h4 className='text-center text-gray-200'>avg</h4>
              <h3 className='text-center text-gray-200 relative top-12'>
                {avgConfirmPressure?(Math.round(avgConfirmPressure*1000)/1000):"0.0"}
              </h3>
              <div className='chart-doughnut h-4/5 relative bottom-6'>
                {doughnutAvgPressureGraphData&&
                <Doughnut
                  data={doughnutAvgPressureGraphData}
                  options={
                    {
                      plugins: {
                        legend:{
                          display:false,
                        },
                      },
                      cutout: 40,
                      maintainAspectRatio: false,
                    }
                  }
                />
                }
              </div>
            </div>
        </div>
        <div className='w-11/12 mx-auto h-1/3 bg-gray-800 rounded-3xl mt-2'>
          {imageDataList.map((image, i) => (
            <p key={i}>{image.url}</p>
          ))}
        </div>

        {/* 書いてる時の筆圧のゲージ */}
        {/* <div className='rangebar fixed bottom-2 w-full'>
          <input id="large-range" type="range" defaultValue={10000} min="0" max="10000" onChange={handleDeleteRowPressureStroke} onInput={handleDeleteRowPressureStroke} onPointerUp={rewriteStroke} />
        </div> */}
      </div>
      </div>
    </>
	);
}

export default Home
