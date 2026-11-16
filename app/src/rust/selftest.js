// Dev-only: runs reference solutions through the REAL Rust Playground path (sequential, polite).
// Open the dev server with ?rustSelfTest=<id-prefix>&limit=8&gap=1500; results land in window.__rustSelfTest.
// Driven by scripts/browser-selftest-rust.mjs. Never imported by the production bundle.
import { LESSONS } from './lessons.js'
import { assembleSource } from './grade.js'
import { gradeReply } from './evaluate.js'
import { run } from './playground.js'

const sleep = ms => new Promise(r => setTimeout(r, ms))

// A small sample spread over the matching lessons, not the first N.
function sample(list, limit) {
  if (list.length <= limit) return list
  return Array.from({ length: limit }, (_, i) => list[Math.floor(i * list.length / limit)])
}

export async function runSelfTest() {
  const q = new URLSearchParams(location.search)
  const prefix = q.get('rustSelfTest'), limit = Number(q.get('limit')) || 8, gap = Math.max(1500, Number(q.get('gap')) || 1500)
  const out = (window.__rustSelfTest = { done: false, results: [] })
  const pool = LESSONS.filter(l => l.kind !== 'predict' && (!prefix || prefix === '1' || l.id.startsWith(prefix)))
  for (const l of sample(pool, limit)) {
    const r = { id: l.id, fails: [] }
    const t0 = performance.now()
    try {
      const reply = await run(assembleSource(l, l.solution))
      const res = gradeReply(l, l.solution, reply)
      if (!res.win) r.fails.push(res.compile ? 'compile: ' + res.compile.text.slice(0, 400) : res.tests.filter(t => t.status !== 'ok').map(t => `${t.name}: ${t.status}`).join('; ') + (res.panic ? ' panic: ' + res.panic : ''))
    } catch (e) { r.fails.push(String(e.message)) }
    r.ms = Math.round(performance.now() - t0)
    out.results.push(r)
    await sleep(gap)
  }
  out.done = true
}
