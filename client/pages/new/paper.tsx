import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react';
import * as iink from 'iink-js';



const NewPaper: NextPage = () => {
  const [pressure, setPressure] = useState<number | null | undefined>(null);
  const [color, setColor] = useState<string>("#00ff00ff");
  const editorRef = useRef(null);

  const configuration = {
    recognitionParams: {
      type: 'MATH',
      protocol: 'WEB_SOCKET',
      server: {
        scheme: 'https',
        host: 'webdemoapi.myscript.com',
        applicationKey: '0cb2ba66-0cf7-4111-a8e6-1de15333fde5',
        hmacKey: 'c24c4d63-0135-4218-a629-efc2ab21bb57'
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
          mimeTypes: ['application/vnd.myscript.jiix', 'application/x-latex']
        },
        export: {
          jiix: {
            'bounding-box': true,
            'strokes': true,
            'style': true
          }
        },
        text: {
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
  let penStyle: object = {
    color: color,
  };
  let theme: object= {
    ink: {
      color: color,
    }
  };

  const onChange = (e: any) => {
    console.log(!e.detail.canExport);
  } 

  
  if (process.browser) {
    const editorElement: any = document.getElementById('editor');
    const exportElement: any = document.getElementById('exportContent');
    editorElement.addEventListener('exported', (evt: any) => {
      if (evt.detail) {
        console.log(JSON.stringify(evt.detail))
      }
    });
    exportElement.addEventListener('click', () => {
      exportElement.disabled = true;
      editorElement.editor.export_();
    });
  }


  const onMove = (e: React.MouseEvent<HTMLCanvasElement> | any) => {
    let editor: any = editorRef.current;
    
    console.log(e.pressure);
    const p = e.pressure
    setPressure(p);
    if (pressure) {
      if (pressure < 0.2) {
        setColor("#0000ffff");
      } else if (p >= 0.5) {
        setColor("#ff0000ff");
      } else {
        setColor("#ff0000ff");
      }
    }
    console.log(color)
    // editor.export_();
  }
  const onImport = (e: any) => {
    let editor: any = editorRef.current;
    console.log(e)
    
    // editor.export_();
  }

  useEffect(() => {
    let editor: any = editorRef.current;

    editor = iink.register(editorRef.current, configuration, penStyle, theme, null, globalClassCSS);
    console.log("aaaaaa");
    window.addEventListener('resize', () => { 
      editor.resize() 
    });

    return () => {
      window.removeEventListener('resize', () => { editor.resize() });
      editor.close();
    }
  }, []);

  return (
    <div className="">
      <button onClick={onImport} id="exportContent">Import</button>
      <div style={editorStyle} ref={editorRef} touch-action="none" onPointerMove={onMove} onPointerUp={onMove} onChange={onChange} id="editor">
      </div>
    </div>
  )
}

export default NewPaper
