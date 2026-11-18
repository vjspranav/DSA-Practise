// Dev-only: runs C++ Learn lessons through the REAL in-browser compiler (clang 8) and the same attempt()/gradeRun()
// path the workbench uses. Open the dev server with ?cppLearnSelfTest=run (or =ui to only wait for the compiler);
// optional &stage=N, &all=1, &limit=N. Results land in window.__cppLearnSelfTest. Driven by
// scripts/browser-selftest-cpp-learn.mjs. Never imported by the production bundle (main.jsx guards it with DEV).
import { LESSONS, STAGES } from './lessons.js'
import { FIXTURES } from './dev-fixtures.js'
import { attempt } from './attempt.js'
import { assembleSource, errorMatches, firstError, gradeRun } from './grade.js'
import { compile, exclusive } from '../workbench/runner.js'
import { wasmClang } from '../runtime/useWasmClang'

const sleep = ms => new Promise(r => setTimeout(r, ms))
const first = (list, f) => list.find(f)

// A default sample: the first lesson of each kind in each stage, plus `limit` more spread over the rest.
function sample(limit) {
  const picked = new Set()
  for (const s of STAGES) for (const kind of new Set(s.lessons.map(l => l.kind))) picked.add(first(s.lessons, l => l.kind === kind))
  const rest = LESSONS.filter(l => !picked.has(l))
  for (let i = 0; i < Math.min(limit, rest.length); i++) picked.add(rest[Math.floor(i * rest.length / Math.min(limit, rest.length))])
  return LESSONS.filter(l => picked.has(l))
}

export async function runSelfTest() {
  const q = new URLSearchParams(location.search)
  const out = (window.__cppLearnSelfTest = { ready: false, done: false, results: [] })
  while (!wasmClang.slot.current) await sleep(200)
  out.ready = true
  if (q.get('cppLearnSelfTest') === 'ui') return
  const stage = Number(q.get('stage')) || 0
  let pool = q.has('all') ? LESSONS : sample(Number(q.get('limit')) || 0)
  if (stage) pool = pool.filter(l => l.id.startsWith(`c${stage}-`))
  const add = (id, fails, warns = []) => out.results.push({ id, fails, warns })

  // Case 1: the reference solution passes. Case 2: fix starters fail with errorMatch; predict error rounds fail to compile.
  for (const l of pool) {
    const fails = [], warns = []
    if (l.kind !== 'predict') {
      const g = gradeRun(l, l.solution, await attempt(l, l.solution))
      if (!g.win) fails.push(g.compile ? 'solution does not compile: ' + g.compile.slice(0, 300) : 'solution: ' + g.tests.map(t => `${t.name} ${t.status}${t.message ? ' ' + t.message : ''}${t.status === 'fail' ? ` expected ${JSON.stringify(t.expected)} got ${JSON.stringify(t.got)}` : ''}`).join('; '))
    }
    if (l.kind === 'fix') {
      const c = await exclusive(() => compile(assembleSource(l, l.starter)))
      if (c.ok) fails.push('fix starter compiles, it should not')
      else if (!errorMatches(l, c.error)) fails.push(`fix starter: first error "${firstError(c.error)?.message}" does not match /${l.errorMatch}/`)
    }
    for (const [i, r] of (l.rounds ?? []).entries()) {
      if (!r.error) continue
      const c = await exclusive(() => compile(assembleSource({}, r.snippet)))
      if (c.ok) fails.push(`predict round ${i + 1}: expected a compile error, it compiled`)
      else if (firstError(c.error)?.message !== firstError(r.output)?.message) warns.push(`predict round ${i + 1}: clang 8 says "${firstError(c.error)?.message}", stored "${firstError(r.output)?.message}"`)
    }
    add(l.id, fails, warns)
  }

  // Case 3 (runner level): a runaway loop times out; a crash grades pass / fail / not run.
  const [crash, loop] = FIXTURES
  {
    const fails = []
    const run = await attempt(loop, loop.starter)
    const g = gradeRun(loop, loop.starter, run)
    if (run.status !== 'tle') fails.push(`loop: runner status ${run.status}, expected tle: ${JSON.stringify(run).slice(0, 300)}`)
    if (g.tests[0].status !== 'fail' || !/too long/.test(g.tests[0].message ?? '')) fails.push('loop: test 1 should fail with the time-limit message')
    if (g.win) fails.push('loop: should not win')
    await sleep(500)
    const ok = gradeRun(loop, loop.solution, await attempt(loop, loop.solution))
    if (!ok.win) fails.push('loop: the solution should still pass after a timeout (worker restarted)')
    add('c0-loop (tle)', fails)
  }
  {
    const fails = []
    const g = gradeRun(crash, crash.starter, await attempt(crash, crash.starter))
    const got = g.tests.map(t => t.status).join(',')
    if (got !== 'pass,fail,notrun') fails.push(`crash: statuses ${got}, expected pass,fail,notrun: ${JSON.stringify(g).slice(0, 500)}`)
    if (!g.tests[1]?.message) fails.push('crash: test 2 should carry the crash message')
    const ok = gradeRun(crash, crash.solution, await attempt(crash, crash.solution))
    if (!ok.win) fails.push('crash: the solution should pass')
    add('c0-crash (pass,fail,notrun)', fails)
  }
  out.done = true
}
