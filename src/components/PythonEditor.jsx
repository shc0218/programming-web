import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

const PythonEditor = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runPython = async () => {
    setLoading(true);
    setOutput("실행 중...");
    try {
      const pyodide = await window.loadPyodide();
      await pyodide.runPythonAsync(`import sys, io\nsys.stdout = io.StringIO()`);
      await pyodide.runPythonAsync(code);
      const stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      setOutput(stdout || "실행 완료 (출력 없음)");
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: '#1e1e1e', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' }}>main.py</span>
        <button 
          onClick={runPython} 
          disabled={loading}
          style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? "..." : "실행하기"}
        </button>
      </div>
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={code => highlight(code, languages.py)}
        padding={20}
        style={{ fontFamily: '"Fira Code", monospace', fontSize: 14, backgroundColor: '#282c34', color: '#abb2bf', minHeight: '120px' }}
      />
      {output && (
        <div style={{ background: '#000', padding: '16px', borderTop: '1px solid #333' }}>
          <div style={{ color: '#666', fontSize: '0.7rem', marginBottom: '8px', textTransform: 'uppercase' }}>Console Output</div>
          <pre style={{ color: '#a7ffeb', margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px' }}>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default PythonEditor;