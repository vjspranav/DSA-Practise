// Dev-only: runs every lesson's reference solution through the real in-browser compiler.
// Open the dev server with ?fndSelfTest=1 (or ?fndSelfTest=s3 to limit by id prefix);
// results land in window.__fndSelfTest. Driven by scripts/browser-selftest.mjs.
import { LESSONS } from '../data/foundations/index.js'
import { assembleSource, judge } from './grade.js'
import { compile, runTest, limitFor, exclusive } from '../workbench/runner.js'
import { wasmClang } from '../runtime/useWasmClang'

const sleep = ms => new Promise(r => setTimeout(r, ms))

export async function runSelfTest() {
  const out = (window.__fndSelfTest = { done: false, results: [] })
  const only = new URLSearchParams(location.search).get('fndSelfTest')
  while (!wasmClang.slot.current) await sleep(200)
  for (const l of LESSONS) {
    if (only && only !== '1' && !l.id.startsWith(only)) continue
    const r = { id: l.id, fails: [], slowestMs: 0 }
    const c = await exclusive(() => compile(assembleSource(l, l.solution)))
    if (!c.ok) r.fails.push('compile: ' + c.error.slice(0, 400))
    else for (const t of l.tests) {
      const t0 = performance.now()
      const res = await exclusive(() => runTest(t.stdin, limitFor(l)))
      r.slowestMs = Math.max(r.slowestMs, Math.round(performance.now() - t0))
      if (res.status !== 'ok') {
        r.fails.push(`${t.name}: ${res.status} ${res.message ?? ''}`.slice(0, 300))
        if (res.status === 'tle') { await sleep(500); break }
      } else {
        const v = judge(l, t, res.stdout)
        if (!v.pass) r.fails.push(`${t.name}: expected ${t.expected.slice(0, 60)} got ${v.got.slice(0, 60)}`)
      }
    }
    out.results.push(r)
  }
  out.done = true
}
