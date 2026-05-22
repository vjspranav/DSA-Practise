import { useRef, useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import { parseSubmitOutput } from '../runtime/executor'

const LANG_LABEL = { cpp: 'C++', python: 'Python' }
const MONACO_LANG = { cpp: 'cpp', python: 'python' }

export default function WorkspacePanel({
  language, onLanguageChange,
  problem,
  code, onCodeChange,
  running, runMode,
  onRun, onSubmit,
  results,
  statuses,
}) {
  const editorRef = useRef(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const [resultsOpen, setResultsOpen] = useState(false)

  // Sync results panel open state
  useEffect(() => { if (results) setResultsOpen(true) }, [results])
  // Reset custom input when problem changes
  useEffect(() => {
    setCustomInput(problem?.defaultCustomInput ?? '')
    setCustomOpen(false)
  }, [problem?.id])

  const handleMount = (editor) => {
    editorRef.current = editor
    editor.setValue(code)
  }

  const handleEditorChange = (val) => {
    onCodeChange(val ?? '')
  }

  // Update editor content when code prop changes (problem/language switch)
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== code) {
      editorRef.current.setValue(code)
    }
  }, [code])

  const submitOutput = results?.mode === 'submit' ? parseSubmitOutput(results.lines) : null

  const statusReady = language === 'python'
    ? statuses.pyodide === 'ok'
    : statuses['wasm-clang'] === 'ok'

  return (
    <div className="workspace">
      {/* Workspace Header */}
      <div className="workspace-header">
        <div className="lang-toggle">
          {['cpp', 'python'].map(lang => (
            <button
              key={lang}
              className={`lang-btn ${language === lang ? 'active' : ''}`}
              onClick={() => onLanguageChange(lang)}
              disabled={running}
            >
              {LANG_LABEL[lang]}
            </button>
          ))}
        </div>

        <div className="action-btns">
          <button
            className="btn btn-run"
            onClick={() => { setCustomOpen(false); onRun('run') }}
            disabled={running || !statusReady}
            title={!statusReady ? 'Runtime loading…' : 'Run example'}
          >
            {running && runMode === 'run' ? <span className="spinner" /> : '▶'}
            Run
          </button>
          <button
            className="btn btn-submit"
            onClick={() => { setCustomOpen(false); onRun('submit') }}
            disabled={running || !statusReady}
            title={!statusReady ? 'Runtime loading…' : 'Run all test cases'}
          >
            {running && runMode === 'submit' ? <span className="spinner" /> : '⚡'}
            Submit
          </button>
          <button
            className={`btn btn-custom ${customOpen ? 'active' : ''}`}
            onClick={() => setCustomOpen(v => !v)}
            disabled={running}
          >
            ⌨ Custom
          </button>
        </div>

        <div className="runtime-pills">
          {[
            { key: 'pyodide', label: 'Py' },
            { key: 'wasm-clang', label: 'C++' },
          ].map(({ key, label }) => (
            <span key={key} className={`rt-pill ${statuses[key]}`}>
              {label} {statuses[key] === 'ok' ? '✓' : statuses[key] === 'error' ? '✗' : '…'}
            </span>
          ))}
        </div>
      </div>

      {/* Custom Input Drawer */}
      {customOpen && (
        <div className="custom-drawer">
          <div className="custom-drawer-header">
            <span className="custom-label">Custom Input</span>
            <span className="custom-format">{problem?.inputFormat}</span>
          </div>
          <textarea
            className="custom-textarea"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder={problem?.defaultCustomInput}
            spellCheck={false}
          />
          <button
            className="btn btn-run custom-run-btn"
            onClick={() => onRun('custom', customInput)}
            disabled={running || !statusReady}
          >
            {running && runMode === 'custom' ? <span className="spinner" /> : '▶'}
            Run Custom
          </button>
        </div>
      )}

      {/* Monaco Editor */}
      <div className="editor-area">
        <Editor
          language={MONACO_LANG[language]}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 4,
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            padding: { top: 16, bottom: 16 },
          }}
          onMount={handleMount}
          onChange={handleEditorChange}
        />
      </div>

      {/* Results Panel */}
      {results && resultsOpen && (
        <div className="results-panel">
          <div className="results-header">
            <span className="results-title">
              {results.mode === 'submit' ? 'Test Results' : results.mode === 'custom' ? 'Custom Output' : 'Output'}
            </span>
            {submitOutput?.summary && (
              <span className={`summary-badge ${submitOutput.summary.passed === submitOutput.summary.total ? 'all-pass' : 'some-fail'}`}>
                {submitOutput.summary.passed}/{submitOutput.summary.total} passed
              </span>
            )}
            <button className="close-results" onClick={() => setResultsOpen(false)}>✕</button>
          </div>

          <div className="results-body">
            {results.mode === 'submit' && submitOutput?.results.length > 0 ? (
              <div className="test-result-list">
                {submitOutput.results.map((r, i) => (
                  <div key={i} className={`tr-item ${r.passed ? 'pass' : 'fail'}`}>
                    <span className="tr-icon">{r.passed ? '✓' : '✗'}</span>
                    <span className="tr-text">{r.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="raw-output">
                {results.lines.map((o, i) => (
                  <span key={i} className={`out-${o.cls}`}>{o.text}</span>
                ))}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
