import { compile, exclusive, limitFor, runTest } from '../workbench/runner.js'
import { assembleSource } from './grade.js'
import { wasmClang } from '../runtime/useWasmClang'

const ANSI = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g')

// runTest() keeps the output of a run that ends normally, but drops what a program printed before it crashed
// (runWasm returns only the error). A harness needs that text: its @@TEST n@@ markers say which tests finished
// before the crash. So listen to the worker's write events during the run and, on a crash, hand back what was
// printed, cleaned the way runWasm cleans normal output. runner.js and the runtime stay untouched.
async function runKeepingOutput(stdin, limit) {
  const state = wasmClang.slot.current
  let printed = '', inner = null
  Object.defineProperty(state, 'onWrite', {
    configurable: true,
    get: () => inner,
    set: f => { inner = f ? s => { printed += String(s).replace(ANSI, ''); f(s) } : null },
  })
  try {
    const r = await runTest(stdin, limit)
    if (r.status !== 'error' || r.stdout) return r
    const lines = printed.split('\n').filter(l => !l.startsWith('>'))
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
    while (lines.length && !lines[0].trim()) lines.shift()
    return { ...r, stdout: lines.join('\n') }
  } finally {
    delete state.onWrite
    state.onWrite = null
  }
}

// Compile the learner's code and run it in the browser. The result is what gradeRun() takes:
// { compileError } | { runs: [runTest result per test] } (no harness) | one runTest result (harness).
// `firstOnly` (the Run button) runs just the first test of a program; a harness always runs whole.
// A timeout stops the program lesson's remaining tests (the worker was replaced), so `runs` may be shorter.
export function attempt(lesson, code, firstOnly = false) {
  return exclusive(async () => {
    const c = await compile(assembleSource(lesson, code))
    if (!c.ok) return { compileError: c.error }
    const limit = limitFor(lesson)
    if (lesson.harness) return runKeepingOutput('', limit)
    const runs = []
    for (const t of firstOnly ? lesson.tests.slice(0, 1) : lesson.tests) {
      const r = await runKeepingOutput(t.stdin ?? '', limit)
      runs.push(r)
      if (r.status === 'tle') break
    }
    return { runs }
  })
}
