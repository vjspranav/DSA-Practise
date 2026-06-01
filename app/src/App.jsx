import { useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { PROBLEMS, CATEGORIES } from './data/problems'
import { buildCode, compileLinkOnly, runWasm } from './runtime/executor'
import { usePracticeStore } from './hooks/usePracticeStore'
import Sidebar from './components/Sidebar'
import ProblemPanel from './components/ProblemPanel'
import WorkspacePanel from './components/WorkspacePanel'
import './App.css'

// JSCPP needs lodash as a global — expose it before any JSCPP import
window._ = _

// ── Runtime status ────────────────────────────────────────────────────────────
const initStatuses = { pyodide: 'loading', 'wasm-clang': 'loading' }

export default function App() {
  const [selectedProblem, setSelectedProblem] = useState(() => {
    const lastId = localStorage.getItem('dsa-last-problem')
    return PROBLEMS.find(p => p.id === lastId) ?? PROBLEMS[0]
  })
  const [language, setLanguage]               = useState('cpp')
  const [running, setRunning]                 = useState(false)
  const [runMode, setRunMode]                 = useState(null)
  const [results, setResults]                 = useState(null)
  const [statuses, setStatuses]               = useState(initStatuses)
  const [sidebarOpen, setSidebarOpen]         = useState(true)

  const pyodideRef     = useRef(null)
  const wasmClangRef   = useRef(null)   // { port, handlers, onWrite }
  const wasmClangMsgId = useRef(0)

  const setStatus = (lib, state) => setStatuses(p => ({ ...p, [lib]: state }))

  // ── Code + problem-status helpers (localStorage-backed) ──────────────────
  const { getCode, saveCode, getStatus, setStatus: setProblemStatus } = usePracticeStore()

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
      else if (id === 'compileLinkRunDone' || id === 'compileLinkOnlyDone' || id === 'runWasmDone') {
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
    const t0 = performance.now()

    try {
      if (language === 'python') {
        await runPython(full, push)
        if (mode === 'submit') {
          const elapsed = performance.now() - t0
          console.group(`[submit] ${selectedProblem.id} — ${elapsed.toFixed(0)}ms (python, batch)`)
          for (const { text } of lines) {
            const m = text.trim().match(/^TEST:(\d+):(PASS|FAIL):(.+):(.+)$/)
            if (m) console.log(`  test ${m[1]} ${m[2] === 'PASS' ? '✓' : '✗'}  expected=${m[3]}  got=${m[4]}`)
          }
          console.groupEnd()
        }
      } else if (mode === 'submit') {
        // C++ submit: compile once, run each test case separately with per-test timing
        const testCount = selectedProblem.submitTestCount ?? selectedProblem.testCases.length
        const timeLimitMs = selectedProblem.submitTimeLimitMs

        const compiled = await compileLinkOnly(wasmClangRef.current, wasmClangMsgId, full, push)
        if (compiled) {
          const testLines = []
          let totalPassed = 0

          console.group(`[submit] ${selectedProblem.id}${timeLimitMs ? ` (TLE limit ${timeLimitMs}ms/test)` : ''}`)
          for (let tc = 1; tc <= testCount; tc++) {
            const t0tc = performance.now()
            const tcLines = []
            const tcPush = (text, cls = 'stdout') => tcLines.push({ text, cls })
            await runWasm(wasmClangRef.current, wasmClangMsgId, `${tc}\n`, tcPush)
            const elapsed = performance.now() - t0tc

            const testLine = tcLines.find(l => l.text.trim().startsWith(`TEST:${tc}:`))
            if (testLine) {
              if (timeLimitMs && elapsed > timeLimitMs) {
                testLines.push({ ...testLine, text: `TEST:${tc}:FAIL:TLE:${Math.round(elapsed)}ms\n` })
                console.log(`  test ${tc} ✗ TLE  ${Math.round(elapsed)}ms`)
              } else {
                if (testLine.text.includes(':PASS:')) totalPassed++
                testLines.push(testLine)
                const m = testLine.text.trim().match(/^TEST:(\d+):(PASS|FAIL):(.+):(.+)$/)
                if (m) console.log(`  test ${tc} ${m[2] === 'PASS' ? '✓' : '✗'}  ${elapsed.toFixed(0)}ms  expected=${m[3]}  got=${m[4]}`)
              }
            }
          }
          console.groupEnd()

          push('\n---RESULT---\n')
          for (const l of testLines) lines.push(l)
          push(`SUMMARY:${totalPassed}:${testCount}\n`)
        }
      } else {
        await runWasmClang(full, push, mode)
      }
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
    while (programLines.length && !programLines[0].trim()) programLines.shift()
    for (const line of programLines) push(line + '\n', 'stdout')
  }

  // ── Problem / language switch ──────────────────────────────────────────────
  function handleProblemSelect(problem) {
    localStorage.setItem('dsa-last-problem', problem.id)
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
        categories={CATEGORIES}
        problems={PROBLEMS}
        selectedId={selectedProblem.id}
        onSelect={handleProblemSelect}
        getStatus={getStatus}
        onStatusChange={setProblemStatus}
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
        problemStatus={getStatus(selectedProblem.id)}
        onStatusChange={(s) => setProblemStatus(selectedProblem.id, s)}
      />
    </div>
  )
}
