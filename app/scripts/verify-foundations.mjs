#!/usr/bin/env node
// Checks every Foundations lesson with the local compiler:
//   - required fields and text limits
//   - the reference solution passes every test
//   - the unedited starter does NOT pass (so tests really test something)
// Usage: node scripts/verify-foundations.mjs [--stage 2] [--only lesson-id]
// Flags mirror the in-browser compiler (clang 8, C++14 default, exceptions off).
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { STAGES } from '../src/data/foundations/index.js'
import { assembleSource, judge, forbiddenHit } from '../src/foundations/grade.js'

const args = process.argv.slice(2)
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null }
const onlyStage = opt('--stage'), onlyId = opt('--only')
const KINDS = ['program', 'implement', 'drill', 'bugfix']
const text = html => String(html).replace(/<[^>]+>/g, '')
const dir = mkdtempSync(join(tmpdir(), 'fnd-'))
let n = 0

function build(src) {
  const cpp = join(dir, `l${++n}.cpp`), bin = join(dir, `l${n}`)
  writeFileSync(cpp, src)
  const r = spawnSync('clang++', ['-std=c++14', '-fno-exceptions', '-O1', '-w', '-o', bin, cpp], { encoding: 'utf8' })
  return r.status === 0 ? { bin } : { error: r.stderr.split('\n').slice(0, 6).join('\n') }
}
function runTests(lesson, code) {
  const b = build(assembleSource(lesson, code))
  if (b.error) return { compiled: false, error: b.error, failed: lesson.tests.map(t => t.name) }
  const failed = []
  for (const t of lesson.tests) {
    const r = spawnSync(b.bin, [], { input: t.stdin, encoding: 'utf8', timeout: lesson.timeLimitMs ?? 4000 })
    const v = r.error || r.status !== 0 ? { pass: false, got: r.error ? 'timeout' : `exit ${r.status}` } : judge(lesson, t, r.stdout)
    if (!v.pass) failed.push(`${t.name} (expected ${JSON.stringify(t.expected)}, got ${JSON.stringify(v.got)})`)
  }
  return { compiled: true, failed }
}
function shape(l) {
  const p = []
  const need = (ok, msg) => { if (!ok) p.push(msg) }
  need(/^[a-z0-9-]+$/.test(l.id ?? ''), 'id must be a lowercase slug')
  need(l.title && l.title.length <= 40, 'title missing or over 40 characters')
  need(KINDS.includes(l.kind), `kind must be one of ${KINDS.join(', ')}`)
  need(l.task && text(l.task).length <= 240, 'task missing or over 240 characters of text')
  need(Array.isArray(l.refresher) && l.refresher.length >= 1 && l.refresher.length <= 3, 'refresher needs 1 to 3 items')
  need((l.refresher ?? []).every(r => text(r).length <= 200), 'a refresher item is over 200 characters')
  need(Array.isArray(l.hints) && l.hints.length >= 2 && l.hints.length <= 3, 'hints needs 2 or 3 items')
  need(typeof l.starter === 'string', 'starter missing (use an empty string for a blank file)')
  need(typeof l.solution === 'string' && l.solution.trim(), 'solution missing')
  need(Array.isArray(l.tests) && l.tests.length >= 3, 'needs at least 3 tests')
  need((l.tests ?? []).every(t => t.name && typeof t.stdin === 'string' && typeof t.expected === 'string'), 'each test needs name, stdin, expected')
  if (l.kind === 'program') need(!l.harness, 'program lessons must not have a harness')
  else need(typeof l.harness === 'string' && l.harness.includes('@@RESULT@@') && l.harness.includes('main'), 'harness must define main() and print @@RESULT@@')
  return p
}

const seen = new Set()
let bad = 0, count = 0
STAGES.forEach((stage, si) => {
  if (onlyStage && String(si + 1) !== onlyStage) return
  for (const l of stage.lessons) {
    if (onlyId && l.id !== onlyId) continue
    count++
    const problems = shape(l)
    if (seen.has(l.id)) problems.push('duplicate id'); seen.add(l.id)
    if (!problems.length) {
      const hit = forbiddenHit(l, l.solution)
      if (hit) problems.push(`solution uses a forbidden pattern: ${hit}`)
      const sol = runTests(l, l.solution)
      if (!sol.compiled) problems.push(`solution does not compile:\n${sol.error}`)
      else if (sol.failed.length) problems.push(`solution fails: ${sol.failed.join('; ')}`)
      const st = runTests(l, l.starter)
      if (st.compiled && !st.failed.length && !forbiddenHit(l, l.starter)) problems.push('starter already passes every test')
    }
    if (problems.length) { bad++; console.log(`FAIL  ${si + 1} ${l.id ?? '(no id)'}\n      ${problems.join('\n      ')}`) }
    else console.log(`ok    ${si + 1} ${l.id}`)
  }
})
rmSync(dir, { recursive: true, force: true })
console.log(`\n${count - bad} of ${count} lessons ok`)
process.exit(bad || !count ? 1 : 0)
