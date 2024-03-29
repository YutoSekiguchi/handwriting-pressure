import type { NextPage } from 'next'
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import Paper from 'paper'
import { ChartData } from 'chart.js'

import PaperHeader from '../../../../components/note/Header';
import CanvasDialog from '../../../../components/note/CanvasDialog';
import DoughnutChart from '../../../../components/note/DoughnutChart';
import LineChart from '../../../../components/note/LineChart';
import { lineOptions } from '../../../../utils/LineOptions';
import { useRouter } from 'next/router';
import { usePaperDetails } from '../../../../hooks/contexts/paperDetailsContext';
import { useLogs } from '../../../../hooks/contexts/logsContext';
import { useStrokes } from '../../../../hooks/contexts/strokesContext';
import ExplainDialog from '../../../../components/note/ExplainDialog';
import LoadingScreen from '../../../../components/common/LoadingScreen';
import { useUsePressureUndo } from '../../../../hooks/contexts/usePressureUndo';
import QuestionMarkButton from '../../../../components/common/QuestionMarkButton';

const pressureRangeNum = 20;

let pressureArray: number[] = [];
let isShowStrokeList: number[] = []; // ストローク表示するか否かの値をlistで格納(表示:1，非表示:0)
let aboutPressureCountArray: number[] = [...Array(pressureRangeNum+1)].map(x=>0);
let startTime: number;
let endTime: number;
let stringJson: string;

type ImageDataObject = {
  url: string,
  strokeData: (string|object)[][],
  pressureArray: number[],
  isShowStrokeList: number[],
}

type ShowImageDataObject = {
  url: string,
  strokeData: (string|object)[][],
  pressureArray: number[],
  boundaryPressure: number,
  isShowStrokeList: number[],
}

type RedoHistoryObject = {
  pressure: number,
  stroke: any,
  isShowStroke: number,
}

const Note: NextPage = () => {
  const router = useRouter();
  const paperDetails: any = usePaperDetails();
  const logs: any = useLogs();
  const strokes: any = useStrokes();
  const usePressureUndo: any = useUsePressureUndo();
  const isReady = router.isReady;
  const { pdid, uid } = router.query;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
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
  const [showImageDataList, setShowImageDataList] = useState<ShowImageDataObject[]>([]); // ログで表示するための画像のリスト
  const [logBoundaryValue, setLogBoundaryValue] = useState<number|null>(null); // 押したログのboundaryValueを保持
  const [canvasDialog, setCanvasDialog] = useState<boolean>(false); // ログのダイアログの表示・非表示
  const [canvasDialogImageIndex, setCanvasDialogImageIndex] = useState<number>(-1); // ログの何枚目かを示す数値
  const [decidedLogIndex, setDecidedLogIndex] = useState<number>(-1); // どのログをundoしたか保持
  const [isGetData, setIsGetData] = useState<boolean>(false); // data取得したか否か
  const [defaultBoundaryPressure, setDefaultBoundaryPressure] = useState<number|null>(null); // バーの初期値
  const [showExplainDialog, setShowExplainDialog] = useState<number|null>(null); // 実験説明ダイアログ
  const [canvasBackgroundImageUrl, setCanvasBackgroundImageUrl] = useState<string>("https://celclipmaterialprod.s3-ap-northeast-1.amazonaws.com/91/01/1880191/thumbnail?1637291685"); // canvasの背景画像
  const canvasRef = useRef(null);
  const labels: number[] = [...Array(pressureRangeNum+1)].map((_, i) => (Math.round((1-(pressureRangeNum-i)/pressureRangeNum)*100)/100)); // グラフ表示用のラベル


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
      avgPressure = 1;
      if (mode == "pen") {
        avgPressure = sumPressure/pressure.length;
      }
      console.log('sumPressure', sumPressure)
      console.log('avgPressure', avgPressure)
      const aboutAvgPressure = Math.floor((avgPressure)*pressureRangeNum)/pressureRangeNum;
      const pressureArrayLength = pressureArray.length;
      while (pressureArray.length==pressureArrayLength) {
        switch (e.pointerType) {
          // PCのマウスなら（マウスはPCで試しやすくするためにランダムに）
          case "mouse":
            const rand = mode=="pen"? Math.random(): 1;
            pressureArray.push(rand);
            aboutPressureCountArray[((Math.floor((rand) * pressureRangeNum) / pressureRangeNum))*pressureRangeNum] += 1;
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
    
    isShowStrokeList.push(1); // 配列に表示情報を挿入

    json =  Paper.project.exportJSON({ asString: false })
    if (json[0][1]["children"].length != pressureArray.length) {
      pressureArray.push(0);
      aboutPressureCountArray[0] += 1;
    }

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
      Save: 0,
    }
    strokes.createStroke(postStrokeData);
    
    // Lineグラフデータ登録
    setLineData(labels, "筆圧", aboutPressureCountArray);
    
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
    stringJson = Paper.project.exportJSON({ asString: true })
    setImageDataList((prevImageDataList) => (
      [
        ...prevImageDataList, 
        {
          url: imageUrl,
          strokeData: json,
          pressureArray: pressureArray.concat(),
          isShowStrokeList: isShowStrokeList.concat(),
        },
      ]
    ));
    console.log("今のモードは", mode)
  }

  // シンプルなundo
  const normalUndo = async() => {
    if (undoable) {
      console.log("his", historyList)
      console.log("before undo is show stroke rist", isShowStrokeList);

      if(historyList.length <= 2) {
        setUndoable(false);
      }
      
      const undoStrokes = historyList.length > 1? 
        historyList[historyList.length-2]: 
        null; // undo後のストローク状態
      const stIsShowStroke = isShowStrokeList[isShowStrokeList.length-1]
      Paper.project.clear()
      if(historyList.length > 1) {
        for (let i=0; i<undoStrokes[0][1]["children"].length; i++) {
          if (isShowStrokeList[i] == 0) {
            if (undoStrokes[0][1]["children"][i][1].strokeColor.length <= 3) {
              undoStrokes[0][1]["children"][i][1].strokeColor.push(0);
            } else {
              undoStrokes[0][1]["children"][i][1].strokeColor[3] = 0;
            }
          }
        }
      }
      Paper.project.importJSON(undoStrokes)
      

      // 履歴が最後の1つだったらundo不可能状態に
      // if(historyList.length <= 1) {
      //   setUndoable(false);
      // }
      // undo前の状態をredo用のListに追加
      const lastPressure = pressureArray[pressureArray.length-1];
      setRedoHistoryList(
        (prevRedoHistoryList) => (
          [
            ...prevRedoHistoryList, 
            {
              'stroke': historyList[historyList.length-1],
              'pressure': lastPressure, 
              'isShowStroke': stIsShowStroke
            }
          ]
        )
      );
      // undo前の状態を削除
      setHistoryList(
        (prevHistoryList) => prevHistoryList.filter((_, index) => index < prevHistoryList.length-1)
      );
      // undo前の状態の筆圧を削除
      pressureArray.pop();
      // undo前の状態の表示の有無の削除
      isShowStrokeList.pop();
      // redo可能状態に
      setRedoable(true);
      fixChartData();
      stringJson = Paper.project.exportJSON({ asString: true });
    }
  }

  // シンプルなredo
  const normalRedo = () => {
    if(redoable) {
      const redoStrokes = redoHistoryList[redoHistoryList.length-1]['stroke'];

      console.log("redoStrokes", redoStrokes);
      for (let i=0; i<redoStrokes[0][1]["children"].length; i++) {
        console.log(i)
        if (isShowStrokeList[i] == 0) {
          if (redoStrokes[0][1]["children"][i][1].strokeColor.length <= 3) {
            redoStrokes[0][1]["children"][i][1].strokeColor.push(0);
          } else {
            redoStrokes[0][1]["children"][i][1].strokeColor[3] = 0;
          }
        }
      }

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
      isShowStrokeList.push(redoHistoryList[redoHistoryList.length-1]['isShowStroke']);
      // redo前の状態をredo用のListから削除
      setRedoHistoryList(
        (prevRedoHistoryList) => prevRedoHistoryList.filter((_, index) => index < prevRedoHistoryList.length-1)
      );
      Paper.project.clear();
      Paper.project.importJSON(redoStrokes);
      setUndoable(true);
      fixChartData();
      stringJson = Paper.project.exportJSON({ asString: true });
      console.log(isShowStrokeList)
    }
  }

  // 筆圧折れ線グラフを書き直す
  const fixChartData = () => {
    let tmp: number[] = [...Array(pressureRangeNum+1)].map(x=>0);
      for(let i=0;i<pressureArray.length;i++) {
        const aboutAvgPressure = Math.floor((pressureArray[i])*pressureRangeNum)/pressureRangeNum;
        tmp[aboutAvgPressure*pressureRangeNum] += 1;
      }
    aboutPressureCountArray = tmp;
    setLineData(labels, "筆圧", aboutPressureCountArray);
  }

  // グラフデータ登録
  const setLineData = (labels: number[], label: string, data: number[]) => {
    setLineGraphData(
      {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
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
    if(imageDataList.length == 0) {
      alert('エラーが発生しました（001）\n用紙にストロークを記述することでこのエラーは解消します.');
      return;
    }
    boundaryValue = Number(e.target.value) / 10000;
    json =  Paper.project.exportJSON({ asString: false })
    let pressureDiff: number = 0;
    for (let i=0; i<pressureArray.length; i++) {
      if (isShowStrokeList[i] == 0) {
        json[0][1]["children"][i][1].strokeColor[3]=0;
        continue 
      }
      pressureDiff = pressureArray[i] - (boundaryValue);
      if ((json[0][1]["children"][i][1].strokeColor.length === 4 && pressureDiff > 0.1)) {
        json[0][1]["children"][i][1].strokeColor[3] = 1;
      }
      if (pressureDiff < 0.1 && pressureDiff >= 0) {
        if (json[0][1]["children"][i][1].strokeColor.length <= 3) {
          json[0][1]["children"][i][1].strokeColor.push((1-(1-pressureDiff))+0.1)
        } else if (json[0][1]["children"][i][1].strokeColor.length === 4) {
          json[0][1]["children"][i][1].strokeColor[3] = ((1-(1-pressureDiff))+0.1)
        }
      }
      if (pressureArray[i] <= boundaryValue && json[0][1]["children"][i][1].strokeColor.length <= 3) {
        json[0][1]["children"][i][1].strokeColor.push(0)
      } else if (pressureArray[i] <= boundaryValue && json[0][1]["children"][i][1].strokeColor.length == 4 && json[0][1]["children"][i][1].strokeColor[3] !== 0) {
        json[0][1]["children"][i][1].strokeColor[3]=0;
      }
    }
    Paper.project.clear()
    Paper.project.importJSON(json)
  }

  const rewriteStroke = () => {
    console.log("boundaryValue", boundaryValue);
    console.log("boundaryPressureValue", boundaryPressureValue)
    let pressureDiff: number = 0;
    json =  Paper.project.exportJSON({ asString: false })
    for (let i=0; i<pressureArray.length; i++) {
      pressureDiff = pressureArray[i] - (boundaryValue);
      if(json[0][1]["children"][i][1].strokeColor[3] == 0) {
        isShowStrokeList[i] = 0;
      }
      if (json[0][1]["children"][i][1].strokeColor[3] !== 0 && pressureDiff < 0.1 && pressureDiff >= 0) {
        if (json[0][1]["children"][i][1].strokeColor.length <= 3) {
          json[0][1]["children"][i][1].strokeColor.push(1)
        } else if (json[0][1]["children"][i][1].strokeColor.length === 4) {
          json[0][1]["children"][i][1].strokeColor[3] = 1
        }
      }
    }
    Paper.project.clear()
    Paper.project.importJSON(json);
    const boundaryPressureValueBeforeUndo = boundaryPressureValue;
    setShowImageDataList((prevShowImageDataList) => (
      [
        ...prevShowImageDataList,
        {...imageDataList[imageDataList.length-1], ...{boundaryPressure: boundaryPressureValueBeforeUndo}}
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
            pressureArray: pressureArray.concat(),
            isShowStrokeList: isShowStrokeList.concat(),
          },
        ]
      ));

      const pdData = paperDetails.state.paperDetail;
      // const stringJson = Paper.project.exportJSON({ asString: true });
      // LogをDBに登録
      const createLogData = {
        UID: pdData.UID,
        PDID: Number(pdid),
        StrokeData: stringJson,
        Url: `${imageDataList[imageDataList.length-1].url}`,
        PressureList: String(pressureArray.concat()),
        IsShowStrokeList: String(isShowStrokeList.concat()),
        Save: 0,
        BoundaryPressure: 1-boundaryValue,
        BoundaryPressureBeforeUndo: 1-boundaryPressureValueBeforeUndo,
      }
      const createUsePressureUndoData = {
        UID: pdData.UID,
        PDID: Number(pdid),
        Pressure: 1-boundaryValue,
        Count: 0
      }
      await logs.createLog(createLogData);
      setBoundaryPressureValue(boundaryValue);
      await usePressureUndo.createUsePressureUndo(createUsePressureUndoData);
      stringJson = Paper.project.exportJSON({ asString: true });
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
  }

  const closeDialog = (e: any) => {
    if (e.target.className == 'overlay') {
      setCanvasDialog(false);
    } else {
      return;
    }
  }

  const changeShowStroke = (data: any, pressureData: number[], boundaryPressureBeforeUndo: number, _isShowStrokeList: number[], index: number) => {
    setLogBoundaryValue(boundaryPressureBeforeUndo);
    Paper.project.clear();
    Paper.project.importJSON(data);
    pressureArray = pressureData.concat();
    isShowStrokeList = _isShowStrokeList.concat();
    fixChartData();
    setCanvasDialog(false);
    setDefaultBoundaryPressure(null);
    setDecidedLogIndex(index);
    setBoundaryPressureValue(1-boundaryPressureBeforeUndo);
    setUndoable(false);
    setHistoryList([data]);
    setRedoable(false);
    setRedoHistoryList([]);
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
      IsShowStrokeList: `${isShowStrokeList}`,
      BoundaryPressure: boundaryPressureValue,
      AvgPressure: avgConfirmPressure,
      BackgroundImage: pdData.BackgroundImage
    }
    await paperDetails.updatePaperDetail(pdid, updateData);
    await strokes.updateStroke(pdid);
    await logs.updateLogs(pdid);
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
    if(historyList.length < 1) {
      setUndoable(false);
    }
  }, [historyList])

  useEffect(() => {
    if(defaultBoundaryPressure==null&&logBoundaryValue!=null) {
      const tmp = logBoundaryValue*10000;
      setDefaultBoundaryPressure(tmp);
      console.log(logBoundaryValue);
      console.log("↑logの筆圧バーの値")
      console.log(tmp)
    } else {
      setDefaultBoundaryPressure(1);
    }
  }, [defaultBoundaryPressure])

  useEffect(() => {
    if(isGetData) {
      if((paperDetails.state.paperDetail.PaperWidth!=null&&paperDetails.state.paperDetail.PaperWidth!=0)&&(paperDetails.state.paperDetail.PaperHeight!=null&&paperDetails.state.paperDetail.PaperHeight!=0)) {
        setCanvasWidth(paperDetails.state.paperDetail.PaperWidth);
        setCanvasHeight(paperDetails.state.paperDetail.PaperHeight);
        setCanvasBackgroundImageUrl(paperDetails.state.paperDetail.BackgroundImage);
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
          setDefaultBoundaryPressure(paperDetails.state.paperDetail.BoundaryPressure*10000);
        } else {
          setDefaultBoundaryPressure(1);
        }
      }
      if (paperDetails.state.paperDetail.IsShowStrokeList!=null&&paperDetails.state.paperDetail.IsShowStrokeList!='') {
        isShowStrokeList = paperDetails.state.paperDetail.IsShowStrokeList.split(',');
        isShowStrokeList = isShowStrokeList.map(Number);
      }
      console.log(logs.state.logsList);
      if(logs.state.logsList!=null&&logs.state.logsList.length>0) {
        const logDataList = logs.state.logsList;
        let tmp: any = [];
        for(var i=0; i<logDataList.length; i++) {
          const el = {
            url: logDataList[i].Url,
            strokeData: logDataList[i].StrokeData,
            pressureArray: (logDataList[i].PressureList.split(',')).map(Number),
            boundaryPressure: logDataList[i].BoundaryPressureBeforeUndo,
            isShowStrokeList: (logDataList[i].IsShowStrokeList.split(',')).map(Number)
          }
          tmp.push(el);
        }
        setShowImageDataList(tmp);
      }
      // 未保存のストロークの削除
      // strokes.deleteNotSaveStrokes(pdid);
      // 未保存のログの削除
      // logs.deleteNotSaveLogs(pdid);
      setTimeout(async function(){
        setIsLoaded(true);
      }, 1000);
    }
  }, [isGetData])


	return (
    <>
      <Head>
        <title>卒論：ノート</title>
      </Head>
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
      {showExplainDialog&&
        <ExplainDialog 
          setShowExplainDialog={setShowExplainDialog}
          showExplainDialog={showExplainDialog}
        />
      }

      {!isLoaded&&
        <LoadingScreen />
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
        setShowExplainDialog={setShowExplainDialog}
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
          style={{backgroundImage: `url("${canvasBackgroundImageUrl}")`, touchAction: "none", display:`${(canvasHeight!=0&&canvasWidth!=0)? "block": "none"}`, backgroundSize: "contain"}}
          id="drawingCanvas2"
          width={`${canvasWidth}px`}
          height={`${canvasHeight}px`}
          className="w-8/12 max-w-full max-h-full canvas_background_note mt-12" 
          onPointerDownCapture={pointerDown}
          onPointerMoveCapture={pointerMove}
          onPointerUpCapture={pointerUp}
        />
        
        {/* 操作UI */}
        {(paperDetails.state.paperDetail.Title&&paperDetails.state.paperDetail.Title.slice(-3) != "_no")?
        <div className='fixed right-0 w-4/12 h-full bg-gray-900 top-12'>
          <div className='w-11/12 mx-auto mt-2 text-center bg-gray-800 h-1/3 rounded-3xl'>
            <h3 className='pt-3 font-bold text-white'>Undo/Redo&nbsp;<span onClick={() => setShowExplainDialog(4)}><QuestionMarkButton /></span></h3>
            <div className='mx-5 mt-3 rangebar'>
              {defaultBoundaryPressure&&
              <input 
                id="large-range" 
                type="range" 
                defaultValue={defaultBoundaryPressure} 
                min="0" 
                max="10000" 
                // onChange={handleDeleteRowPressureStroke} 
                onInput={handleDeleteRowPressureStroke} 
                onPointerUpCapture={rewriteStroke}
              />
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
              setShowExplainDialog={setShowExplainDialog}
            />
            <DoughnutChart
              doughnutPressureGraphData={doughnutAvgPressureGraphData}
              confirmPressure={avgConfirmPressure}
              title={"avg"}
              setShowExplainDialog={setShowExplainDialog}
            />
          </div>
          <div className='w-11/12 mx-auto mt-2 text-center bg-gray-800 img-box-wrapper h-1/3 rounded-3xl'>
            <h3 className='my-3 font-bold text-white'>Log&nbsp;<span onClick={() => setShowExplainDialog(5)}><QuestionMarkButton /></span></h3>
            <div className='flex flex-wrap justify-start w-full overflow-y-auto img-box h-5/6'>
              {showImageDataList.map((image, i) => (
                <div key={i} className={`relative w-1/3 mt-2 mb-2 cursor-pointer h-1/3 ${decidedLogIndex==i? 'bg-purple-300 bg-opacity-20 border-2 border-gray-500': ''}`} onClick={() => showDialog(i)}>
                  <img src={canvasBackgroundImageUrl} className={`absolute top-0 h-full left-0 object-contain w-full`} />
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
        :<div className='fixed right-0 w-4/12 h-full bg-gray-900 top-12'></div>
        }
      </div>
  </>
	);
}

export default Note