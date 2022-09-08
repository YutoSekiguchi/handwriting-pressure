import type { NextPage } from 'next'
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import Paper from 'paper'
import { ChartData } from 'chart.js'

import PaperHeader from '../../../../components/paper/Header';
import CanvasDialog from '../../../../components/paper/CanvasDialog';
import DoughnutChart from '../../../../components/paper/DoughnutChart';
import LineChart from '../../../../components/paper/LineChart';
import { lineOptions } from '../../../../utils/LineOptions';
import { useRouter } from 'next/router';
import { usePaperDetails } from '../../../../hooks/contexts/paperDetailsContext';
import { useLogs } from '../../../../hooks/contexts/logsContext';
import { useStrokes } from '../../../../hooks/contexts/strokesContext';

const pressureRangeNum = 20;

let pressureArray: number[] = [];
let aboutPressureCountArray: number[] = [...Array(pressureRangeNum+1)].map(x=>0);
let startTime: number;
let endTime: number;

type ImageDataObject = {
  url: string,
  strokeData: (string|object)[][],
  pressureArray: number[],
}

type RedoHistoryObject = {
  pressure: number,
  stroke: any,
}

const Note: NextPage = () => {
  const router = useRouter();
  const paperDetails: any = usePaperDetails();
  const logs: any = useLogs();
  const strokes: any = useStrokes();
  const isReady = router.isReady;
  const { pdid, uid } = router.query;
  const [pressure, setPressure] = useState<number[] | null | undefined>(null); // 筆圧
  const [nowConfirmPressure, setNowConfirmPressure] = useState<number|null>(null); // 1ストロークあたりの筆圧
  const [avgConfirmPressure, setAvgConfirmPressure] = useState<number|null>(null); //筆圧の平均
  const [color, setColor] = useState<string>('#000000'); // 色
  const [penWidth, setPenWidth] = useState<number>(2); // 線の太さ
  const [eraseWidth, setEraseWidth] = useState<number>(20); // 消しゴムの太さ
  const [undoable, setUndoable] = useState<boolean>(false); // undo可否
  const [redoable, setRedoable] = useState<boolean>(false); // redo可否
  const [historyList, setHistoryList] = useState<any[]>([]); // 筆跡の履歴管理（undo用）
  const [redoHistoryList, setRedoHistoryList] = useState<RedoHistoryObject[]>([]); // undoされたものを管理（redo用）
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [isDrag, setIsDrag] = useState<boolean>(false); // ペンがノートに置かれているか否か
  const [boundaryPressureValue, setBoundaryPressureValue] = useState<number>(1);
  const [mode, setMode] = useState<'pen'|'erase'>('pen'); // ペンか消しゴムか
  const [lineGraphData, setLineGraphData] = useState<any>(null); // 折れ線グラフのデータ
  const [doughnutNowPressureGraphData, setDoughnutNowPressureGraphData] = useState<ChartData<"doughnut", number[], unknown>|null>(null); // 現在の筆圧データ
  const [doughnutAvgPressureGraphData, setDoughnutAvgPressureGraphData] = useState<ChartData<"doughnut", number[], unknown>|null>(null); // 平均筆圧データ
  const [imageDataList, setImageDataList] = useState<ImageDataObject[]>([]); // ストロークごとに画像保存しているリスト
  const [showImageDataList, setShowImageDataList] = useState<ImageDataObject[]>([]); // ログで表示するための画像のリスト
  const [canvasDialog, setCanvasDialog] = useState<boolean>(false); // ログのダイアログの表示・非表示
  const [canvasDialogImageIndex, setCanvasDialogImageIndex] = useState<number>(0); // ログの何枚目かを示す数値
  const [isGetData, setIsGetData] = useState<boolean>(false); // data取得したか否か
  const [defaultBoundaryPressure, setDefaultBoundaryPressure] = useState<number|null>(null); // バーの初期値
  const canvasRef = useRef(null);
  const labels: number[] = [...Array(pressureRangeNum+1)].map((_, i) => ((pressureRangeNum-i)/pressureRangeNum)); // グラフ表示用のラベル
  const canvasBackgroundImageUrl: string = "https://celclipmaterialprod.s3-ap-northeast-1.amazonaws.com/91/01/1880191/thumbnail?1637291685"; // canvasの背景画像


	let path: paper.Path;
	let start: number;
	let duration: number;
	let interval: number;
	let segmentsToSend: any;
	let toSend: any;
  let json: any;
	let penColor: string;
  let boundaryValue: number;


  if (redoHistoryList.length > 0){
    console.log('his', typeof(redoHistoryList[0]));
    console.log(redoHistoryList);
  }


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
      console.log(canvas.width);
      console.log(canvas.height);
      // setCanvasWidth(canvas.width);
      // setCanvasHeight(canvas.height);
      // const imageData = Paper.View.context.getImageData(0, 0, width, height);

      
      let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
      // console.log(canvas.toDataURL("image/png"));
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
    startTime = performance.now();
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
      if (pressure === null || pressure === undefined) {
        setPressure([e.pressure])
      } else {
        const tmp = pressure.concat();
        tmp.push(e.pressure);
        setPressure(tmp);
      }
    }
  }

  const pointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrag(false);
    endTime = performance.now();
    let diffTime = 0;
    if (startTime!=0&&endTime!=0) {
      diffTime = Math.round((endTime - startTime)*100)/100;
      startTime = 0;
      endTime = 0;
    }
    let avgPressure;
    console.log('今回のストロークの筆圧：', pressure);
    if (pressure) {
      let sumPressure = pressure.reduce((a, b) => {
        return a + b;
      });
      avgPressure = sumPressure/pressure.length;
      console.log('sumPressure', sumPressure)
      console.log('avgPressure', avgPressure)
      const aboutAvgPressure = Math.floor((1-avgPressure)*pressureRangeNum)/pressureRangeNum;
      const pressureArrayLength = pressureArray.length;
      while (pressureArray.length==pressureArrayLength) {
        switch (e.pointerType) {
          // PCのマウスなら（マウスはPCで試しやすくするためにランダムに）
          case "mouse":
            const rand = Math.random();
            pressureArray.push(rand);
            aboutPressureCountArray[((Math.floor((1-rand) * pressureRangeNum) / pressureRangeNum))*pressureRangeNum] += 1;
            break;
          // タッチ操作なら
          case "touch":
            pressureArray.push(avgPressure);
            aboutPressureCountArray[(aboutAvgPressure)*pressureRangeNum] += 1;
            break;
          // ペン操作なら
          case "pen":
            pressureArray.push(avgPressure);
            aboutPressureCountArray[(aboutAvgPressure)*pressureRangeNum] += 1;
            break;
          default:
            pressureArray.push(avgPressure);
            aboutPressureCountArray[(aboutAvgPressure)*pressureRangeNum] += 1;
        }
      }
    }
    
    json =  Paper.project.exportJSON({ asString: false })
    console.log(json[0][1]['children']);
    if (json[0][1]["children"].length != pressureArray.length) {
      pressureArray.push(0);
      aboutPressureCountArray[0] += 1;
    }
    console.log('pressureArray', pressureArray)
    console.log(aboutPressureCountArray);


    // ストロークのデータ登録
    const strongJson = Paper.project.exportJSON({ asString: true });
    const postStrokeData = {
      UID: Number(uid),
      PDID: Number(pdid),
      Detail: strongJson,
      AvgPressure: avgPressure,
      PressureList: `${pressure}`,
      Time: diffTime,
      Mode: mode,
    }
    strokes.createStroke(postStrokeData);
    
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
    const canvas: any = canvasRef.current;
    const imageUrl: string = canvas.toDataURL("image/png");
    json =  Paper.project.exportJSON({ asString: false })
    setImageDataList((prevImageDataList) => (
      [
        ...prevImageDataList, 
        {
          url: imageUrl,
          strokeData: json,
          pressureArray: pressureArray.concat()
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

  // 筆圧折れ線グラフを書き直す
  const fixChartData = () => {
    let tmp: number[] = [...Array(pressureRangeNum+1)].map(x=>0);
      for(let i=0;i<pressureArray.length;i++) {
        const aboutAvgPressure = Math.floor((1-pressureArray[i])*pressureRangeNum)/pressureRangeNum;
        tmp[aboutAvgPressure*pressureRangeNum] += 1;
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
    if(historyList.length == 0) {
      alert('用紙に何も書かれていません');
      return;
    }
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
    setShowImageDataList((prevShowImageDataList) => (
      [
        ...prevShowImageDataList,
        imageDataList[imageDataList.length-1],
      ]
    ));
    setTimeout(async function(){
      const canvas: any = canvasRef.current;
      const imageUrl: string = canvas.toDataURL("image/png");
      json =  Paper.project.exportJSON({ asString: false })
      setImageDataList((prevImageDataList) => (
        [
          ...prevImageDataList, 
          {
            url: imageUrl,
            strokeData: json,
            pressureArray: pressureArray.concat()
          },
        ]
      ));
      
      const pdData = paperDetails.state.paperDetail;
      const stringJson = Paper.project.exportJSON({ asString: true });
      // LogをDBに登録
      const createLogData = {
        UID: pdData.UID,
        PDID: Number(pdid),
        StrokeData: stringJson,
        url: imageUrl,
        pressureList: String(pressureArray.concat()),
      }
      await logs.createLog(createLogData);
    },500);
  }

  const showDialog = (i: number) => {
    if(i<0) {
      i = 0;
    } else if(i>showImageDataList.length-1) {
      i = showImageDataList.length-1;
    }
    setCanvasDialog(true);
    setCanvasDialogImageIndex(i);
    console.log(i)
  }

  const closeDialog = (e: any) => {
    if (e.target.className == 'overlay') {
      setCanvasDialog(false);
    } else {
      return;
    }
  }

  const changeShowStroke = (data: any, pressureData: number[]) => {
    console.log(pressureArray)
    console.log(pressureData)
    Paper.project.clear();
    Paper.project.importJSON(data);
    pressureArray = pressureData.concat();
    fixChartData();
    setCanvasDialog(false);
  }

  const getData = async() => {
    await paperDetails.getPaperDetailByID(pdid);
    await logs.getLogsByPDID(pdid);
    setIsGetData(true);
  }

  const saveNote = async() => {
    console.log(pressureArray)
    const canvas: any = canvasRef.current;
    const imageUrl: string = canvas.toDataURL("image/png");
    const paperJson =  Paper.project.exportJSON({ asString: true });
    const pdData = paperDetails.state.paperDetail;
    const updateData = {
      PID: pdData.PID,
      UID: pdData.UID,
      Title: pdData.Title,
      PaperWidth: pdData.PaperWidth,
      PaperHeight: pdData.PaperHeight,
      PaperImage: imageUrl,
      PaperJson: paperJson,
      PressureList: `${pressureArray}`,
      BoundaryPressure: boundaryPressureValue,
      AvgPressure: avgConfirmPressure,
      BackgroundImage: pdData.BackgroundImage
    }
    await paperDetails.updatePaperDetail(pdid, updateData);
    alert('保存が完了しました');
    console.log('保存しました');
  }

	useEffect(() => {
    if(isReady){
      console.log(canvasWidth, canvasHeight);
      getData();
      if (canvasWidth!=0&&canvasHeight!=0) {
        Paper.setup('drawingCanvas2');
      } else {
        Paper.setup('drawingCanvas');
      }
      Paper.install(window);
      draw();
    }
    if(paperDetails.state.paperDetail.PaperJson!=null&&paperDetails.state.paperDetail.PaperJson!=''){
      Paper.project.clear();
      Paper.project.importJSON(paperDetails.state.paperDetail.PaperJson);
    }
	}, [isReady, canvasWidth, canvasHeight]);

  useEffect(() => {
    if(isReady){
      draw();
    }
  }, [color, penWidth, eraseWidth, mode])

  useEffect(() => {
    if(isGetData) {
      if((paperDetails.state.paperDetail.PaperWidth!=null&&paperDetails.state.paperDetail.PaperWidth!=0)&&(paperDetails.state.paperDetail.PaperHeight!=null&&paperDetails.state.paperDetail.PaperHeight!=0)) {
        setCanvasWidth(paperDetails.state.paperDetail.PaperWidth);
        setCanvasHeight(paperDetails.state.paperDetail.PaperHeight);
      } else {
        setCanvasWidth(1000);
        setCanvasHeight(1000);
      }
      if(paperDetails.state.paperDetail.PressureList!=null&&paperDetails.state.paperDetail.PressureList!='') {
        pressureArray = paperDetails.state.paperDetail.PressureList.split(',');
        pressureArray = pressureArray.map(Number);
        fixChartData();
      }
      if(paperDetails.state.paperDetail.BoundaryPressure!=null) {
        if (paperDetails.state.paperDetail.BoundaryPressure!=0) {
        console.log("実行された")
        setDefaultBoundaryPressure(paperDetails.state.paperDetail.BoundaryPressure*10000);
        } else {
          setDefaultBoundaryPressure(10000);
        }
      }
      console.log(logs.state.logsList);
      if(logs.state.logsList!=null&&logs.state.logsList.length>0) {
        const logDataList = logs.state.logsList;
        let tmp: any = [];
        for(var i=0; i<logDataList.length; i++) {
          console.log(logDataList[i].Url);
          const el = {
            url: logDataList[i].Url,
            strokeData: logDataList[i].StrokeData,
            pressureArray: (logDataList[i].PressureList.split(',')).map(Number)
          }
          tmp.push(el);
        }
        setShowImageDataList(tmp);
      }
    }
  }, [isGetData])


	return (
    <>
      {canvasDialog&&
        <CanvasDialog 
          closeDialog={closeDialog}
          showDialog={showDialog}
          canvasDialogImageIndex={canvasDialogImageIndex}
          canvasBackgroundImageUrl={canvasBackgroundImageUrl}
          showImageDataList={showImageDataList}
          changeShowStroke={changeShowStroke}
        />
      }
      <PaperHeader 
        setColor={setColor}
        setPenWidth={setPenWidth}
        setEraseWidth={setEraseWidth}
        setMode={setMode}
        undo={normalUndo} 
        redo={normalRedo} 
        undoable={undoable} 
        redoable={redoable}
        func={saveNote}
      />
      <div className="flex w-full h-full Canvas " id="wrapper">
        <canvas 
          ref={canvasRef}
          style={{backgroundImage: `url("${canvasBackgroundImageUrl}")`, touchAction: "none", display:`${(canvasHeight!=0&&canvasWidth!=0)? "none": "block"}`}}
          id="drawingCanvas"
          width={'1000px'}
          height={'1000px'}
          className="w-8/12 max-w-full max-h-full canvas_background_note" 
          onPointerDownCapture={pointerDown}
          onPointerMoveCapture={pointerMove}
          onPointerUpCapture={pointerUp}
        />

        <canvas 
          ref={canvasRef}
          style={{backgroundImage: `url("${canvasBackgroundImageUrl}")`, touchAction: "none", display:`${(canvasHeight!=0&&canvasWidth!=0)? "block": "none"}`}}
          id="drawingCanvas2"
          width={`${canvasWidth}px`}
          height={`${canvasHeight}px`}
          className="w-8/12 max-w-full max-h-full canvas_background_note" 
          onPointerDownCapture={pointerDown}
          onPointerMoveCapture={pointerMove}
          onPointerUpCapture={pointerUp}
        />
        
        {/* 操作UI */}
        <div className='fixed right-0 w-4/12 h-full bg-gray-900 top-12'>
          <div className='w-11/12 mx-auto mt-2 text-center bg-gray-800 h-1/3 rounded-3xl'>
            <h3 className='pt-3 font-bold text-white'>Undo/Redo</h3>
            <div className='mx-5 mt-3 rangebar'>
              {defaultBoundaryPressure&&
              <input id="large-range" type="range" defaultValue={defaultBoundaryPressure} min="0" max="10000" onChange={handleDeleteRowPressureStroke} onInput={handleDeleteRowPressureStroke} onPointerUp={rewriteStroke} />
              }
            </div>
            <div className='mx-5 chart-bar h-2/3'>
              <LineChart
                lineGraphData={lineGraphData}
                lineOptions={lineOptions}
                labels={labels}
                aboutPressureCountArray={aboutPressureCountArray}
              />
            </div>
          </div>
          <div className='flex w-full mt-2 h-1/6'>
            <DoughnutChart
              doughnutPressureGraphData={doughnutNowPressureGraphData}
              confirmPressure={nowConfirmPressure}
              title={"now"}
            />
            <DoughnutChart
              doughnutPressureGraphData={doughnutAvgPressureGraphData}
              confirmPressure={avgConfirmPressure}
              title={"avg"}
            />
          </div>
          <div className='w-11/12 mx-auto mt-2 text-center bg-gray-800 img-box-wrapper h-1/3 rounded-3xl'>
            <h3 className='my-3 font-bold text-white'>Log</h3>
            <div className='flex flex-wrap justify-start w-full overflow-y-auto img-box h-5/6'>
              {showImageDataList.map((image, i) => (
                <div key={i} className="relative w-1/3 mt-2 cursor-pointer h-1/3" onClick={() => showDialog(i)}>
                  <img src={canvasBackgroundImageUrl} className="absolute top-0 left-0 object-contain w-full h-full" />
                  <img src={image.url} className="absolute top-0 left-0 object-contain w-full h-full" />
                </div>
              ))}
            </div>
          </div>

        {/* 書いてる時の筆圧のゲージ */}
        {/* <div className='fixed w-full rangebar bottom-2'>
          <input id="large-range" type="range" defaultValue={10000} min="0" max="10000" onChange={handleDeleteRowPressureStroke} onInput={handleDeleteRowPressureStroke} onPointerUp={rewriteStroke} />
        </div> */}
        </div>
      </div>
  </>
	);
}

export default Note