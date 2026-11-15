import { wasmClang } from '../runtime/useWasmClang'
import { compileLinkOnly, runWasm } from '../runtime/executor'

// Only one compile/run talks to the worker at a time.
let chain = Promise.resolve()
export function exclusive(fn) {
  const p = chain.then(fn, fn)
  chain = p.catch(() => {})
  return p
}

// Compile + link once. Resolves { ok: true } or { ok: false, error }.
export async function compile(source) {
  const out = []
  const ok = await compileLinkOnly(wasmClang.slot.current, wasmClang.counter, source, t => out.push(t))
  // Drop first-run download chatter and the trailing exit-code line; keep the diagnostics.
  const error = out.join('').split('\n')
    .filter(l => !/^(> )?Fetching and compiling/.test(l) && !/^Error: process exited with code/.test(l))
    .join('\n').trim()
  return ok ? { ok: true } : { ok: false, error }
}

// Run the compiled module with `stdin`, giving up after limitMs. `ms` is the wall time of the run.
// A runaway program blocks the worker, so on timeout the worker is replaced.
export async function runTest(stdin, limitMs) {
  const out = []
  let timer
  const t0 = performance.now()
  const run = runWasm(wasmClang.slot.current, wasmClang.counter, stdin, (t, cls = 'stdout') => out.push({ t, cls }))
    .then(() => 'done')
  const timeout = new Promise(res => { timer = setTimeout(() => res('tle'), limitMs) })
  const outcome = await Promise.race([run, timeout])
  clearTimeout(timer)
  const ms = performance.now() - t0
  if (outcome === 'tle') {
    wasmClang.restart()
    return { status: 'tle', ms }
  }
  const err = out.find(o => o.cls !== 'stdout')
  if (err) return { status: 'error', message: err.t.trim(), stdout: out.filter(o => o.cls === 'stdout').map(o => o.t).join(''), ms }
  return { status: 'ok', stdout: out.map(o => o.t).join(''), ms }
}

// Browser is slower than native: allow generous slack.
export const limitFor = lesson => Math.max(6000, (lesson.timeLimitMs ?? 4000) * 3)
