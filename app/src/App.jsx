import { useEffect, useRef, useState, useCallback } from 'react'
import _ from 'lodash'
import { PROBLEMS } from './data/problems'
import { buildCode } from './runtime/executor'
import Sidebar from './components/Sidebar'
import ProblemPanel from './components/ProblemPanel'
import WorkspacePanel from './components/WorkspacePanel'
import './App.css'

// JSCPP needs lodash as a global — expose it before any JSCPP import
window._ = _

// ── Runtime status ────────────────────────────────────────────────────────────
const initStatuses = { pyodide: 'loading', 'wasm-clang': 'loading' }

export default function App() {
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0])
  const [language, setLanguage]               = useState('cpp')
  const [running, setRunning]                 = useState(false)
  const [runMode, setRunMode]                 = useState(null)
  const [results, setResults]                 = useState(null)
  const [statuses, setStatuses]               = useState(initStatuses)
  const [sidebarOpen, setSidebarOpen]         = useState(true)

  // Per-problem, per-language code cache  { problemId: { cpp, python } }
  const [userCode, setUserCode] = useState({})

  const pyodideRef     = useRef(null)
  const wasmClangRef   = useRef(null)   // { port, handlers, onWrite }
  const wasmClangMsgId = useRef(0)

  const setStatus = (lib, state) => setStatuses(p => ({ ...p, [lib]: state }))

  // ── Code helpers ─────────────────────────────────────────────────────────
  const getCode = useCallback((problemId, lang) =>
    userCode[problemId]?.[lang] ??
    PROBLEMS.find(p => p.id === problemId)?.[`${lang}Starter`] ?? '',
  [userCode])

  const saveCode = useCallback((problemId, lang, code) =>
    setUserCode(prev => ({
      ...prev,
      [problemId]: { ...prev[problemId], [lang]: code },
    })),
  [])

  const currentCode = getCode(selectedProblem.id, language)

  // ── Pyodide ───────────────────────────────────────────────────────────────
  useEffect(() => {
    import('pyodide').then(({ loadPyodide }) =>
      loadPyodide({ indexURL: '/node_modules/pyodide/' })
    ).then(py => {
      pyodideRef.current = py
      setStatus('pyodide', 'ok')
    }).catch(() => setStatus('pyodide', 'error'))
  }, [])

  // ── wasm-clang ────────────────────────────────────────────────────────────
  useEffect(() => {
    const worker = new Worker('/wasm-clang/worker.js')
    const { port1, port2 } = new MessageChannel()
    worker.postMessage({ id: 'constructor', data: port2 }, [port2])
    const state = { port: port1, handlers: {}, onWrite: null }
    port1.onmessage = ({ data: { id, responseId, data } }) => {
      if (id === 'write') state.onWrite?.(data)
      else if (id === 'compileLinkRunDone') {
        const resolve = state.handlers[responseId]
        if (resolve) { resolve(data); delete state.handlers[responseId] }
      }
    }
    worker.onerror = () => setStatus('wasm-clang', 'error')
    wasmClangRef.current = state
    setStatus('wasm-clang', 'ok')
    return () => worker.terminate()
  }, [])

  // ── Run ───────────────────────────────────────────────────────────────────
  async function handleRun(mode, customInput = '') {
    if (running) return
    const code = getCode(selectedProblem.id, language)
    const full  = buildCode(code, selectedProblem, language, mode, customInput)
    setRunning(true)
    setRunMode(mode)
    setResults(null)

    const lines = []
    const push = (text, cls = 'stdout') => lines.push({ text, cls })

    try {
      if (language === 'python') await runPython(full, push)
      else                       await runWasmClang(full, push, mode)
    } catch (err) {
      push('[Error] ' + err.message + '\n', 'stderr')
    }

    setResults({ lines, mode })
    setRunning(false)
  }

  async function runPython(code, push) {
    const py = pyodideRef.current
    if (!py) { push('Pyodide not ready.\n', 'warn'); return }
    py.setStdout({ batched: s => push(s + '\n', 'stdout') })
    py.setStderr({ batched: s => push(s + '\n', 'stderr') })
    try {
      await py.runPythonAsync(code)
    } catch (err) {
      push((err.message || String(err)) + '\n', 'stderr')
    }
  }

  async function runWasmClang(code, push, mode) {
    const state = wasmClangRef.current
    if (!state) { push('wasm-clang not ready.\n', 'warn'); return }
    const msgId = String(++wasmClangMsgId.current)
    const stripAnsi = s => s.replace(/\x1b\[[0-9;]*m/g, '')

    // Buffer all wasm-clang output; filter out compilation command lines ("> …")
    let rawText = ''
    state.onWrite = s => { rawText += stripAnsi(s) }

    const result = await new Promise(resolve => {
      state.handlers[msgId] = resolve
      state.port.postMessage({ id: 'compileLinkRun', data: code, responseId: msgId })
    })
    state.onWrite = null

    if (result.error) {
      const errLines = rawText.split('\n').filter(l => !l.startsWith('> clang') && !l.startsWith('> wasm-ld'))
      push(errLines.join('\n').trim() + '\n', 'stderr')
      return
    }

    // Push each program output line individually so parseOutput can find the sentinel
    const programLines = rawText.split('\n').filter(l => !l.startsWith('>'))
    while (programLines.length && !programLines[programLines.length - 1].trim()) programLines.pop()
    for (const line of programLines) push(line + '\n', 'stdout')
  }

  // ── Problem / language switch ──────────────────────────────────────────────
  function handleProblemSelect(problem) {
    setSelectedProblem(problem)
    setResults(null)
  }

  function handleLanguageChange(lang) {
    setLanguage(lang)
    setResults(null)
  }

  function handleCodeChange(code) {
    saveCode(selectedProblem.id, language, code)
  }

  return (
    <div className="app-root" style={{
      gridTemplateColumns: sidebarOpen
        ? 'var(--sidebar-w) 1fr 1.3fr'
        : 'var(--sidebar-collapsed-w) 1fr 1.3fr'
    }}>
      <Sidebar
        problems={PROBLEMS}
        selectedId={selectedProblem.id}
        onSelect={handleProblemSelect}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(v => !v)}
      />
      <ProblemPanel problem={selectedProblem} />
      <WorkspacePanel
        language={language}
        onLanguageChange={handleLanguageChange}
        problem={selectedProblem}
        code={currentCode}
        onCodeChange={handleCodeChange}
        running={running}
        runMode={runMode}
        onRun={handleRun}
        results={results}
        statuses={statuses}
      />
    </div>
  )
}
