import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react';
import * as iink from 'iink-js';
import { List } from 'reselect/es/types';

let editor:any;
let editorElement: any;
let exports: any;


const NewPaper: NextPage = () => {
  const [pressure, setPressure] = useState<number | null | undefined>(null);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000ff");
  const [count, setCount] = useState<number>(0);
  const [sumPressure, setSumPressure] = useState<number>(0); // 1ストローク中の動かしてる間の筆圧の合計
  const editorRef = useRef(null);
  const isFirstRender = useRef<boolean>(false);
  

  // inkのテーマ
  const themes = [
    {
      name: 'Normal Gray theme',
      id: 'normal-white',
      theme: {
        ink: {
          color: '#000000',
          '-myscript-pen-width': 2
        },
        '.text': {
          'font-size': 12
        }
      }
    }, {
      name: 'Thin green theme',
      id: 'thin-green',
      theme: {
        ink: {
          color: '#2E7D32',
          '-myscript-pen-width': 1
        },
        '.text': {
          'font-size': 10
        }
      }
    }, {
      name: 'Bold red theme',
      id: 'bold-red',
      theme: {
        ink: {
          color: '#B71C1C',
          '-myscript-pen-width': 3
        },
        '.text': {
          'font-size': 14
        }
      }
    }];

  // iink-jsの設定
  const configuration = {
    recognitionParams: {
      type: 'MATH',
      protocol: 'WEBSOCKET',
      apiVersion: 'V4',
      server: {
        scheme: 'https',
        host: 'webdemoapi.myscript.com',
        applicationKey: '0cb2ba66-0cf7-4111-a8e6-1de15333fde5',
        hmacKey: 'c24c4d63-0135-4218-a629-efc2ab21bb57',
      },
      triggers: {
        exportContent: "DEMAND",
        // addStrokes: "QUIET_PERIOD"
      },
      iink: {
        gesture: {
          enable: false,
        },
        math: {
          mimeTypes: ['application/vnd.myscript.jiix', 'application/x-latex'],
          solver: {
            enable: true,
            fractionalPartDigits: 3,
            decimalSeparator: '.',
            roundingMode: 'half up',
            angleUnit: 'deg',
          },
        },
        lang: 'ja_JP',
        export: {
          jiix: {
            'bounding-box': true,
            'strokes': true,
            'style': true,
            text: {
              'chars': true,
            },
          }
        },
        text: {
          mimeTypes: ['text/plain', 'application/vnd.myscript.jiix'],
          smartGuide: false,
          margin: {
            top: 5,
            left: 0,
            right: 0,
            bottom: 0,
          },
          guides: {
            enable: false
          }
        }
      }
    }
  }
  const globalClassCSS = 'my-custom-class';

  const editorStyle = {
    'minWidth': '100px',
    'minHeight': '100px',
    'width': '100vw',
    // 'height': 'calc(100vh - 190px)',
    'touchAction': 'none',
    'backgroundImage': 'url(/canvas-background.png)'
  };

  function getTheme(themes: List, id: string) {
    return themes.filter((theme) => {
      return theme.id === id;
    })[0].theme;
  }

  const defaultTheme = 'normal-white';


  const onChange = (e: any) => {
    console.log(!e.detail.canExport);
  } 

  const onExport = (evt: any) => {
    console.log("eeeeeeee")
    if (evt.detail) {
      exports = evt.detail.exports;
      // console.log("aaaaaaa", exports)
    }
  }

  const onDown = () => {
    setIsDrag(true);
    console.log("aaaaaaaaa")
  }


  const onMove = (e: React.MouseEvent<HTMLCanvasElement> | any) => {
    if (!isDrag) {return}
    // let editor: any = editorRef.current;
    // console.log("aa", editor);
    console.log(e.pressure);
    const p = e.pressure;
    if (p !== 0) {
      setCount(count+1);
      setSumPressure(sumPressure+p);
    }
    console.log(sumPressure)
    // if (pressure) {
    //   if (pressure < 0.2) {
    //     setColor("#0000ffff");
    //   } else if (p >= 0.5) {
    //     setColor("#ff0000ff");
    //   } else {
    //     setColor("#ff0000ff");
    //   }
    // }
    console.log(color)
    // if (process.browser) {
    //   const editorElement: any = document.getElementById('editor');
    //   editorElement.addEventListener('exported', (evt: any) => {
    //     console.log("rwrwrwrwrwrw")
    //     if (evt.detail) {
    //       console.log(JSON.stringify(evt.detail))
    //       console.log(evt)
    //     }
    //   });
    // }
    // editor.export_();
  }

  const onUp = async() => {
    setIsDrag(false);
    if (count > 0) {
      const avgPressure: number = sumPressure/count;
      setPressure(avgPressure)
      console.log("avgPressure", avgPressure)
    }
    console.log(sumPressure)
    console.log(count)
    
    editorElement = editorRef.current
    editorElement.addEventListener('exported', onExport);
    setCount(0);
    setSumPressure(0);
    // if (process.browser) {
    //   const editorElement: any = document.getElementById('editor');
    //   editorElement.addEventListener('exported', (evt: any) => {
    //     console.log("rwrwrwrwrwrw")
    //     if (evt.detail) {
    //       console.log(JSON.stringify(evt.detail))
    //       console.log(evt.detail)
    //       console.log(evt)
    //     }
    //   });
    // }
  }


  const handleColor = (e: any) => {
    setColor(e.target.value)
    console.log(e.target.value, "に色を変更しました")
  }

  const checkImport = (e: any) => {
    // let editor: any = editorRef.current;
    console.log(e)
    console.log(!e.detail.canExport);
    let toImport;
    if(exports && exports['application/vnd.myscript.jiix']) {
      console.log(exports['application/vnd.myscript.jiix'])
      toImport = exports['application/vnd.myscript.jiix'];
    }
    const toImportJson = JSON.parse(toImport)
    const expressions = toImportJson["expressions"]
    console.log(toImportJson)
    if (toImportJson&&configuration.recognitionParams.type=="TEXT") {
      console.log(toImportJson["words"][0]["items"])
      console.log(toImportJson["chars"][0]["items"])
      toImportJson["words"][0]["items"].pop();
      toImportJson["chars"][0]["items"].pop();
      console.log(toImportJson)
      const toImportString = JSON.stringify(toImportJson)
      editorElement.editor.import_(toImportString, 'application/vnd.myscript.jiix');
    } else if (toImportJson&&configuration.recognitionParams.type=="MATH") {
      if (expressions[0]["operands"] && expressions[0]["operands"][0]["items"]) {
        // toImportJson["expressions"][0]["operands"][0]["items"].pop();
        // console.log(toImportJson["expressions"][0]["operands"][0]["items"])
        // console.log("operands有before", toImportJson)
        // const toImportString = JSON.stringify(toImportJson)
        // console.log("toImport",expressions[0])
        // console.log("toImportString", toImportString)
        // editorElement.editor.import_(toImportString, 'application/vnd.myscript.jiix');
        // console.log("operands有", toImportJson)
        onImport(toImportJson, toImportJson["expressions"][0]["operands"][0]["items"])
      } else if (expressions[0]) {
        // toImportJson["expressions"][0]["items"].pop();
        // console.log(toImportJson["expressions"][0]["items"])
        // console.log("シンプルbefore", toImportJson)
        // const toImportString = JSON.stringify(toImportJson)
        // console.log("toImport",expressions[0])
        // console.log("toImportString", toImportString)
        // editorElement.editor.import_(toImportString, 'application/vnd.myscript.jiix');
        // console.log("シンプル", toImportJson)
        onImport(toImportJson, toImportJson["expressions"][0]["items"])
      }
    }
  }

  const onImport = (importJson: object, items: Array<any>) => {
    console.log("importJSON", importJson)
    items.pop();
    const toImportString = JSON.stringify(importJson)
    // console.log("afterImportJSON", importJson)
    // console.log(items)
    editorElement.editor.import_(toImportString, 'application/vnd.myscript.jiix');
  }
  

  useEffect(() => {
    // let editor: any = iink.register(editorRef.current, configuration, penStyle, theme, null, globalClassCSS);
    
    editor = iink.register(editorRef.current, configuration, null, getTheme(themes, defaultTheme), null, globalClassCSS);
    editor.penStyle={
      color: "#000000ff",
      '-myscript-pen-width': 1,
    };
    console.log("Start");
    
    window.addEventListener('resize', () => { 
      editor.resize() 
    });

    isFirstRender.current = true
    return () => {
      window.removeEventListener('resize', () => { editor.resize() });
      editor.close();
    }
  }, []);

  useEffect(() => {
    if(isFirstRender.current) { // 初回レンダー判定
      isFirstRender.current = false // もう初回レンダーじゃないよ代入
    } else {
      console.log("%%%%%%%%%%%%",editor)
      editor.penStyle={
        color: color,
        '-myscript-pen-width': 1,
      };
    }
  }, [color])

  return (
    <div className="">
      <label className="label-color" htmlFor="pencolor">Color:</label>
      <input id="pencolor" className="input-field pen-color-field" type="color" defaultValue="#000000" onChange={handleColor}></input>
      <button onClick={checkImport} id="exportContent">Import</button>
      <div style={editorStyle} ref={editorRef} touch-action="none" onPointerDownCapture={onDown} onPointerMove={onMove} onPointerUpCapture={onUp} id="editor">
      </div>
      <div id="editor2" style={{width: "100%", height: "500px"}}  touch-action="none"></div>
    </div>
  )
}

export default NewPaper
