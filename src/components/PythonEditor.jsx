import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css'; 

// readOnly 속성을 새로 추가합니다 (기본값은 false)
const PythonEditor = ({ initialCode, readOnly = false }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setOutput("");
  }, [initialCode]);

  const runPython = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput("실행 중...");
    try {
      if (!window.pyodide) window.pyodide = await window.loadPyodide();
      const py = window.pyodide;
      await py.runPythonAsync(`
import sys
import io
from js import prompt
sys.stdout = io.StringIO()
def input(message=""):
    res = prompt(message)
    return res if res is not None else ""
      `);
      await py.runPythonAsync(code);
      const stdout = await py.runPythonAsync("sys.stdout.getvalue()");
      setOutput(stdout || "실행 완료");
    } catch (err) {
      setOutput(`에러:\n${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ 
      borderRadius: '12px', 
      overflow: 'hidden', 
      border: readOnly ? '1px solid #2d3748' : '1px solid #3e4451', // 읽기전용일 때 테두리 흐리게
      margin: '15px 0',
      backgroundColor: '#282c34',
      opacity: readOnly ? 0.95 : 1 // 읽기전용일 때 약간의 시각적 차이
    }}>
      <div style={{ 
        background: '#21252b', 
        padding: '10px 16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #181a1f'
      }}>
        <span style={{ color: '#abb2bf', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
          main.py {readOnly && <span style={{ color: '#e06c75', ml: 5 }}></span>}
        </span>
        <button 
          onClick={runPython} 
          disabled={isRunning}
          style={{ 
            backgroundColor: isRunning ? '#4b5563' : '#22c55e', 
            color: '#fff', border: 'none', padding: '6px 16px', 
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
          }}
        >
          {isRunning ? "실행 중..." : "실행 (Run)"}
        </button>
      </div>

      <div className="python-editor-wrapper" style={{ textAlign: 'left' }}>
        <Editor
          value={code}
          // [중요] readOnly가 true면 상태 변경을 막아서 수정을 불가능하게 만듭니다.
          onValueChange={readOnly ? () => {} : setCode}
          highlight={code => highlight(code, languages.py)}
          padding={20}
          readOnly={readOnly} // 내부 textarea 엘리먼트에도 readOnly 속성 주입
          style={{
            fontFamily: '"Fira Code", "Source Code Pro", monospace',
            fontSize: 14,
            minHeight: '120px',
            backgroundColor: '#282c34',
            color: '#abb2bf', 
            caretColor: readOnly ? 'transparent' : '#fff', // 읽기전용일 땐 커서 숨기기
          }}
        />
      </div>

      {output && (
        <div style={{ background: '#000', padding: '15px', borderTop: '1px solid #3e4451' }}>
          <div style={{ color: '#56b6c2', fontSize: '0.7rem', marginBottom: '5px', fontWeight: 'bold' }}>OUTPUT</div>
          <pre style={{ color: '#98c379', margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px', fontFamily: 'monospace' }}>
            {`> ${output}`}
          </pre>
        </div>
      )}

      <style>{`
        .python-editor-wrapper textarea {
          outline: none !important;
          color: #abb2bf !important;
        }
        .python-editor-wrapper pre {
          color: #abb2bf !important;
        }
        .token.comment { color: #5c6370; font-style: italic; }
        .token.keyword { color: #c678dd; } 
        .token.string { color: #98c379; } 
        .token.function { color: #61afef; } 
        .token.operator { color: #56b6c2; } 
        .token.number { color: #d19a66; } 
        .token.boolean { color: #d19a66; }
        .token.variable { color: #e06c75; } 
      `}</style>
    </div>
  );
};

export default PythonEditor;