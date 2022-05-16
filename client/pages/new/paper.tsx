import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react';
import * as iink from 'iink-js';



const NewPaper: NextPage = () => {

  const editorRef = useRef(null);
  const editorStyle = {
    'minWidth': '100px',
    'minHeight': '100px',
    'width': '100vw',
    // 'height': 'calc(100vh - 190px)',
    'touchAction': 'none',
    'backgroundImage': 'url(/canvas-background.png)'
  };


  const onMove = (e: any) => {
    let editor: any = editorRef.current;
    console.log(e.pressure);
    console.log(e);
  }

  useEffect(() => {
    let editor: any = editorRef.current;
    const penStyle = {
      color: '#000000',
    };
    const theme = {
      ink: {
        color: '#000000',
      }
    };
    const configuration = {
      recognitionParams: {
        type: 'MATH',
        // protocol: 'WEB_SOCKET',
        server: {
          scheme: 'https',
          host: 'webdemoapi.myscript.com',
          applicationKey: '0cb2ba66-0cf7-4111-a8e6-1de15333fde5',
          hmacKey: 'c24c4d63-0135-4218-a629-efc2ab21bb57'
        },
        riggers: {
          exportContent: "QUIET_PERIOD",
          addStrokes: "QUIET_PERIOD"
        },
        iink: {
          gesture: {
            enable: false,
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
            }
          }
        }
      }
    }
    const globalClassCSS = 'my-custom-class';
    editor = iink.register(editorRef.current, configuration, penStyle, theme, null, globalClassCSS);
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
      <div style={editorStyle} ref={editorRef} touch-action="none" onPointerMove={onMove} onPointerUp={onMove}>
      </div>
    </div>
  )
}

export default NewPaper
