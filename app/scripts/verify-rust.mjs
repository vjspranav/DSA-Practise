#!/usr/bin/env node
// Checks every Rust lesson with the locally installed rustc (edition 2021, debug build like the Playground):
//   - fields, id format, text limits, no stdin / external crates / threads / time / randomness
//   - solution compiles and passes every test; starter does not pass (fix: must fail to compile with errorCode)
//   - solution satisfies `require` and avoids `forbidden`; a fix starter must satisfy `require` too
//   - predict rounds behave exactly as stored (compile error with errorCode, or exact stdout)
//   - concept compare.rust compiles/fails per its `ok`; every C++ snippet passes clang++ -fsyntax-only
//   - teach fields (examples compile, run and print `output`), `introduces` ids exist, and the taught-before-used rule
//     (see "Teaching fields" in the spec): syntax in a migrated lesson must be introduced by it or an earlier lesson
// Usage: node scripts/verify-rust.mjs [--stage N] [--only lesson-id]
// Authoring notes (harness, require/forbidden, predict capture, C++ wrapping): end of
// docs/superpowers/specs/2026-11-15-rust-track-design.md
import { execFile } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir, cpus } from 'node:os'
import { join } from 'node:path'
import { STAGES } from '../src/data/rust/index.js'
import { SYNTAX, detectSyntax, codeSpans, syntaxIds, syntaxLabel } from '../src/rust/syntax.js'
import {
  assembleSource, judgeRun, splitTests, normalise, panicMessage,
  requireResults, forbiddenHit, hasErrorCode, primaryErrorLine, stripComments,
} from '../src/rust/grade.js'

const args = process.argv.slice(2)
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null }
const onlyStage = opt('--stage'), onlyId = opt('--only')

const KINDS = ['concept', 'predict', 'fix', 'implement', 'drill', 'bugfix']
const ALLOWED = new Set(['id', 'title', 'kind', 'task', 'refresher', 'hints', 'inCpp', 'starter', 'solution', 'harness',
  'tests', 'require', 'forbidden', 'compare', 'rounds', 'errorCode', 'gloss', 'cppUnchecked', 'cppStd', 'teach', 'introduces'])
// Stages rewritten to the teach-first format (0-based index into STAGES). Add 1, 2, ... as they are migrated.
const MIGRATED_STAGES = new Set([0, 1, 2, 3, 4, 5, 6])
for (const x of (process.env.RUST_MIGRATED ?? '').split(',')) if (x.trim() !== '' && Number.isInteger(+x)) MIGRATED_STAGES.add(+x)
const COMPILE_MS = 120000, RUN_MS = 10000

// ---------- process helpers (bounded concurrency, compile each distinct source once) ----------
const root = mkdtempSync(join(tmpdir(), 'rsl-'))
let counter = 0
const slots = Math.max(2, Math.min(6, cpus().length - 1))
let active = 0
const waiting = []
async function slot(fn) {
  if (active >= slots) await new Promise(r => waiting.push(r))
  active++
  try { return await fn() } finally { active--; waiting.shift()?.() }
}
const exec = (cmd, argv, opts) => slot(() => new Promise(resolve => {
  const child = execFile(cmd, argv, { encoding: 'utf8', maxBuffer: 16 << 20, killSignal: 'SIGKILL', ...opts }, (err, stdout, stderr) => {
    resolve({ ok: !err, code: err?.code ?? 0, timedOut: !!(err && err.killed), stdout, stderr })
  })
  child.stdin?.end()
}))

const compiled = new Map(), ran = new Map()
function compileRust(src) {
  if (!compiled.has(src)) compiled.set(src, (async () => {
    const dir = join(root, `s${++counter}`)
    mkdirSync(join(dir, 'src'), { recursive: true })
    writeFileSync(join(dir, 'src', 'main.rs'), src)
    // cwd + relative path so diagnostics say `src/main.rs`, exactly like the Playground output we store.
    const r = await exec('rustc', ['--edition', '2021', '--crate-name', 'main', '--color', 'never', '-C', 'debuginfo=0', '-o', 'main', 'src/main.rs'], { cwd: dir, timeout: COMPILE_MS })
    return { ok: r.ok, stderr: r.stderr, dir, timedOut: r.timedOut }
  })())
  return compiled.get(src)
}
// Run a compiled source. Programs that use HashMap/HashSet are run twice: the iteration order is random per
// run, so differing output means the lesson is nondeterministic.
function runRust(src) {
  if (!ran.has(src)) ran.set(src, (async () => {
    const c = await compileRust(src)
    const once = async () => {
      const r = await exec(join(c.dir, 'main'), [], { cwd: c.dir, timeout: RUN_MS })
      return { success: r.ok, stdout: r.stdout, stderr: r.stderr, timedOut: r.timedOut }
    }
    const first = await once()
    if (/\bHash(Map|Set)\b/.test(src)) {
      const second = await once()
      if (second.stdout !== first.stdout) first.nondeterministic = true
    }
    return first
  })())
  return ran.get(src)
}

// ---------- C++ snippets ----------
const CPP_PRELUDE = ['iostream', 'sstream', 'vector', 'string', 'string_view', 'algorithm', 'map', 'unordered_map', 'set', 'unordered_set',
  'queue', 'stack', 'deque', 'list', 'array', 'tuple', 'memory', 'utility', 'functional', 'numeric', 'optional', 'variant', 'iterator',
  'cstdint', 'cstddef', 'cstdio', 'cstdlib', 'cstring', 'cmath', 'climits', 'cassert', 'limits', 'stdexcept']
  .map(h => `#include <${h}>`).join('\n') + '\nusing namespace std;\n'
// Wrapping rule (three attempts, the snippet passes if ANY passes):
//   1. as is, after the prelude (a snippet with its own main, or only declarations/functions)
//   2. whole snippet inside `int main() { ... }` (statement fragments)
//   3. everything up to the last line that is exactly `}` or `};` at column 0 stays at file scope,
//      the rest goes inside `int main() { ... }` (a function followed by statements that use it)
function cppAttempts(code) {
  const out = [CPP_PRELUDE + code]
  if (!/\bmain\s*\(/.test(code)) {
    out.push(`${CPP_PRELUDE}int main() {\n${code}\n}`)
    const lines = code.split('\n')
    let cut = -1
    lines.forEach((l, i) => { if (/^\};?\s*$/.test(l)) cut = i })
    if (cut >= 0 && cut < lines.length - 1) out.push(`${CPP_PRELUDE}${lines.slice(0, cut + 1).join('\n')}\nint main() {\n${lines.slice(cut + 1).join('\n')}\n}`)
  }
  return out
}
const cppCache = new Map()
function checkCpp(code, std) {
  const key = std + '\0' + code
  if (!cppCache.has(key)) cppCache.set(key, (async () => {
    const errs = []
    for (const src of cppAttempts(code)) {
      const dir = join(root, `c${++counter}`)
      mkdirSync(dir)
      const f = join(dir, 'a.cpp')
      writeFileSync(f, src)
      const r = await exec('clang++', [`-std=c++${std}`, '-fsyntax-only', '-w', '-x', 'c++', f], { timeout: 60000 })
      if (r.ok) return null
      errs.push(r.stderr.split('\n').filter(l => /error:/.test(l)).slice(0, 2).map(l => l.replace(/^.*?:(\d+):\d+: /, 'line $1: ')).join(' | '))
    }
    return errs.join('  //  ')
  })())
  return cppCache.get(key)
}

// ---------- shape and text limits ----------
const text = html => String(html).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
const sentences = html => text(html).split(/[.!?](?:\s|$)/).filter(s => s.trim()).length
const str = v => typeof v === 'string' && v.trim() !== ''
const BANNED = [
  [/\bstdin\b|\bread_line\b|\bread_to_string\b|\bBufRead\b|\blines\(\)\s*\.\s*next\b/, 'reads stdin (the Playground has none)'],
  [/\bextern\s+crate\b/, 'uses an external crate'],
  [/\b(rand|getrandom|fastrand)::|\bRandomState\b|\bDefaultHasher\b|\bRandom\b/, 'uses randomness'],
  [/\bstd::thread\b|\bthread::|\bstd::sync::mpsc\b|\bthread_local!/, 'uses threads'],
  [/\bstd::time\b|\bInstant\b|\bSystemTime\b|\bDuration\b|\bUNIX_EPOCH\b/, 'uses time'],
  [/\bstd::(env|fs|net|process)\b/, 'uses env/fs/net/process'],
]
const ALLOWED_KINDS_NO_HINTS = ['predict']

function shape(l, stageNo) {
  const p = []
  const need = (ok, msg) => { if (!ok) p.push(msg) }
  for (const k of Object.keys(l)) need(ALLOWED.has(k), `unknown field "${k}"`)
  need(new RegExp(`^r${stageNo}-[a-z0-9]+(-[a-z0-9]+)*$`).test(l.id ?? ''), `id must be a slug starting r${stageNo}-`)
  need(str(l.title) && l.title.length <= 40, 'title missing or over 40 characters')
  need(KINDS.includes(l.kind), `kind must be one of ${KINDS.join(', ')}`)
  need(str(l.task) && text(l.task).length <= 240, 'task missing or over 240 characters of text')
  need(Array.isArray(l.refresher) && l.refresher.length >= 1 && l.refresher.length <= 3, 'refresher needs 1 to 3 items')
  need((l.refresher ?? []).every(r => str(r) && text(r).length <= 200), 'a refresher item is empty or over 200 characters')
  if (ALLOWED_KINDS_NO_HINTS.includes(l.kind)) need(l.hints === undefined, 'predict lessons have no hints')
  else {
    need(Array.isArray(l.hints) && l.hints.length >= 2 && l.hints.length <= 3, 'hints needs 2 or 3 items')
    need((l.hints ?? []).every(h => str(h) && text(h).length <= 200), 'a hint is empty or over 200 characters')
  }
  if (l.inCpp !== undefined) {
    need(l.inCpp && str(l.inCpp.code) && str(l.inCpp.note), 'inCpp needs code and note')
    need(str(l.inCpp?.note) && text(l.inCpp.note).length <= 300 && sentences(l.inCpp.note) <= 2, 'inCpp.note must be at most 2 sentences and 300 characters')
  }
  for (const key of ['require', 'forbidden']) {
    for (const r of l[key] ?? []) {
      let ok = str(r?.pattern) && str(r?.message)
      if (ok) try { new RegExp(r.pattern) } catch { ok = false }
      need(ok, `${key} entries need a valid regex "pattern" and a "message"`)
    }
  }
  need(l.introduces === undefined || (Array.isArray(l.introduces) && l.introduces.every(x => typeof x === 'string')), 'introduces must be an array of syntax ids')
  const ids = syntaxIds()
  for (const x of l.introduces ?? []) need(ids.has(x), `introduces "${x}" is not in the syntax registry (src/rust/syntax.js)`)
  const migrated = MIGRATED_STAGES.has(stageNo - 1)
  if ((migrated && l.kind === 'concept') || (l.introduces ?? []).length) need(l.teach !== undefined, 'teach is required for concept lessons and lessons that introduce syntax')
  if (migrated) need(Array.isArray(l.introduces), 'lessons in migrated stages need introduces (use [] if nothing is new)')
  if (l.teach !== undefined) {
    const t = l.teach
    need(t && typeof t === 'object' && !Array.isArray(t), 'teach must be an object')
    for (const k of Object.keys(t ?? {})) need(['body', 'examples', 'terms'].includes(k), `unknown teach field "${k}"`)
    need(Array.isArray(t?.body) && t.body.length >= 1 && t.body.length <= 5 && t.body.every(str), 'teach.body needs 1 to 5 non-empty paragraphs')
    need(Array.isArray(t?.examples) && t.examples.length >= 1 && t.examples.length <= 3, 'teach.examples needs 1 to 3 examples')
    for (const [i, e] of (t?.examples ?? []).entries()) {
      need(e && str(e.code), `teach.examples[${i}] needs code`)
      for (const k of Object.keys(e ?? {})) need(['code', 'output', 'caption', 'wrap'].includes(k), `teach.examples[${i}] has unknown field "${k}"`)
      need(e?.output === undefined || typeof e.output === 'string', `teach.examples[${i}].output must be a string`)
      need(e?.caption === undefined || str(e.caption), `teach.examples[${i}].caption must be non-empty`)
      need(e?.wrap === undefined || e.wrap === true, `teach.examples[${i}].wrap must be true when present`)
    }
    need(Array.isArray(t?.terms) && t.terms.length >= 1, 'teach.terms needs at least one entry')
    for (const [i, x] of (t?.terms ?? []).entries()) need(x && str(x.code) && str(x.meaning), `teach.terms[${i}] needs non-empty code and meaning`)
  }
  if (l.cppUnchecked !== undefined) need(l.cppUnchecked === true, 'cppUnchecked must be true when present')
  if (l.cppStd !== undefined) need([17, 20, 23].includes(l.cppStd), 'cppStd must be 17, 20 or 23')

  if (l.kind === 'predict') {
    for (const f of ['starter', 'solution', 'harness', 'tests']) need(l[f] === undefined, `predict lessons have no ${f}`)
    need(Array.isArray(l.rounds) && l.rounds.length >= 1 && l.rounds.length <= 2, 'rounds needs 1 or 2 items')
    for (const [i, r] of (l.rounds ?? []).entries()) {
      const w = `round ${i + 1}: `
      need(str(r.snippet) && /\bfn\s+main\b/.test(r.snippet), w + 'snippet must be a whole program with fn main')
      need(Array.isArray(r.choices) && r.choices.length === 3 && r.choices.every(c => str(c) && c.length <= 60), w + 'choices must be 3 strings of at most 60 characters')
      need(Number.isInteger(r.answer) && r.answer >= 0 && r.answer <= 2, w + 'answer must be 0, 1 or 2')
      need(str(r.why) && text(r.why).length <= 240, w + 'why missing or over 240 characters')
      need(typeof r.output === 'string' && r.output.trim() !== '', w + 'output missing')
      need(r.errorCode === undefined || /^E\d{4}$/.test(r.errorCode), w + 'errorCode must look like E0382')
      need(!(r.errorCode && r.panic), w + 'a round cannot have both errorCode and panic')
      need(r.panic === undefined || r.panic === true, w + 'panic must be true when present')
    }
    return p
  }

  need(typeof l.starter === 'string', 'starter missing (use an empty string for a blank file)')
  need(str(l.solution), 'solution missing')
  need(Array.isArray(l.tests) && l.tests.length >= (['implement', 'drill', 'bugfix'].includes(l.kind) ? 3 : 1), 'too few tests (implement/drill/bugfix need 3, others 1)')
  need((l.tests ?? []).every(t => str(t.name) && typeof t.expected === 'string' && (t.input === undefined || typeof t.input === 'string')), 'each test needs name and expected (input optional)')
  if (l.harness !== undefined) need(str(l.harness) && /\bfn\s+main\b/.test(l.harness) && l.harness.includes('@@TEST'), 'harness must define fn main and print @@TEST n@@ markers')
  else need((l.tests ?? []).length === 1, 'a lesson without a harness has exactly one test')
  if (l.kind === 'fix') {
    need(/^E\d{4}$/.test(l.errorCode ?? ''), 'fix lessons need errorCode like E0502')
    need(str(l.gloss) && text(l.gloss).length <= 200 && sentences(l.gloss) <= 2, 'gloss missing, over 200 characters or over 2 sentences')
  }
  if (l.kind === 'concept') {
    const c = l.compare
    need(c && c.cpp && c.rust && str(c.cpp.code) && str(c.rust.code) && typeof c.cpp.ok === 'boolean' && typeof c.rust.ok === 'boolean', 'concept needs compare.cpp and compare.rust with code and boolean ok')
    need(c && [c?.cpp?.outcome, c?.rust?.outcome].every(o => str(o) && o.length <= 60), 'compare outcomes must be short one-liners (60 characters)')
    need(c && str(c.text) && sentences(c.text) <= 2 && text(c.text).length <= 300, 'compare.text must be at most 2 sentences and 300 characters')
    need(!c?.rust?.errorCode || /^E\d{4}$/.test(c.rust.errorCode), 'compare.rust.errorCode must look like E0382')
  }
  return p
}

// ---------- lesson checks ----------
const clip = (s, n = 160) => (s.length > n ? s.slice(0, n) + '...' : s)
const q = s => JSON.stringify(clip(String(s)))
const errLines = stderr => stderr.split('\n').filter(l => /^error/.test(l)).slice(0, 4).join(' | ') || stderr.slice(0, 300)

async function exercise(l, code) {
  const src = assembleSource(l, code)
  const c = await compileRust(src)
  if (!c.ok) return { compiled: false, stderr: c.stderr }
  const run = await runRust(src)
  const v = judgeRun(l, run)
  let extra = null
  if (l.harness && run.success) {
    const n = splitTests(run.stdout).outputs.length
    if (n !== l.tests.length) extra = `harness printed ${n} @@TEST markers for ${l.tests.length} tests`
  }
  return { compiled: true, run, verdict: v, extra }
}
const failures = r => r.verdict.tests.filter(t => t.status !== 'pass')
  .map(t => t.status === 'not-run' ? `${t.name}: not run` : `${t.name}: expected ${q(t.expected)}, got ${q(t.got)}`)
  .join('; ') + (r.verdict.panic ? ` [panic: ${clip(r.verdict.panic, 100)}]` : '')

async function checkRounds(l, p) {
  for (const [i, r] of l.rounds.entries()) {
    const w = `round ${i + 1}: `
    const c = await compileRust(r.snippet)
    if (r.errorCode) {
      if (c.ok) { p.push(w + `claims ${r.errorCode} but the snippet compiles`); continue }
      if (!hasErrorCode(c.stderr, r.errorCode)) p.push(w + `compiler gave ${q(primaryErrorLine(c.stderr))}, not ${r.errorCode}`)
      if (!r.output.includes(r.errorCode)) p.push(w + `output does not contain ${r.errorCode}`)
      const first = primaryErrorLine(c.stderr)
      if (first && !r.output.includes(first)) p.push(w + `output lacks the compiler's primary line ${q(first)}`)
      continue
    }
    if (!c.ok) { p.push(w + `snippet does not compile: ${errLines(c.stderr)}`); continue }
    const run = await runRust(r.snippet)
    if (run.nondeterministic) p.push(w + 'output differs between runs (HashMap/HashSet order?)')
    if (r.panic) {
      const msg = panicMessage(run.stderr)
      if (run.success || msg === null) p.push(w + 'claims a panic but the program did not panic')
      else if (normalise(msg) !== normalise(r.output)) p.push(w + `panic message is ${q(msg)}, output says ${q(r.output)}`)
    } else if (!run.success) p.push(w + `program fails at run time: ${clip(panicMessage(run.stderr) ?? run.stderr, 120)}${run.timedOut ? ' (timeout)' : ''}`)
    else if (normalise(run.stdout) !== normalise(r.output)) p.push(w + `program prints ${q(normalise(run.stdout))} but output says ${q(normalise(r.output))}`)
  }
}

const cppUncheckedIds = []
async function checkLesson(l, stageNo) {
  const p = shape(l, stageNo)
  if (p.length) return p
  const rustCode = [l.starter, l.solution, l.harness, ...(l.rounds ?? []).map(r => r.snippet), l.compare?.rust?.code].filter(s => typeof s === 'string')
  for (const code of rustCode) {
    const clean = stripComments(code)
    for (const [re, why] of BANNED) if (re.test(clean)) p.push(`code ${why}: ${q((clean.match(re) ?? [''])[0])}`)
    // `use foo::...` where foo is not std/core/alloc/crate/self/super, a module declared here, or an enum (capitalised).
    const mods = new Set([...clean.matchAll(/\bmod\s+([a-z_][a-z0-9_]*)/g)].map(m => m[1]))
    for (const m of clean.matchAll(/\buse\s+(?:::)?([a-z_][a-z0-9_]*)\b/g)) {
      if (!['std', 'core', 'alloc', 'crate', 'self', 'super'].includes(m[1]) && !mods.has(m[1])) p.push(`code uses an external crate: ${q(m[0])}`)
    }
  }
  if (p.length) return p

  for (const [i, e] of (l.teach?.examples ?? []).entries()) {
    const src = e.wrap ? `fn main() {\n${e.code}\n}` : e.code
    const w = `teach.examples[${i}]: `
    const c = await compileRust(src)
    if (!c.ok) { p.push(w + `does not compile: ${errLines(c.stderr)}`); continue }
    const run = await runRust(src)
    if (!run.success) { p.push(w + `fails at run time: ${clip(panicMessage(run.stderr) ?? run.stderr, 120)}`); continue }
    if (run.nondeterministic) p.push(w + 'output differs between runs')
    if (e.output !== undefined && normalise(run.stdout) !== normalise(e.output)) p.push(w + `prints ${q(normalise(run.stdout))} but output says ${q(normalise(e.output))}`)
    for (const [re, why] of BANNED) if (re.test(stripComments(e.code))) p.push(w + `code ${why}`)
  }

  if (l.kind === 'predict') await checkRounds(l, p)
  else {
    const hit = forbiddenHit(l, l.solution)
    if (hit) p.push(`solution uses a forbidden pattern: ${hit}`)
    for (const r of requireResults(l, l.solution)) if (!r.met) p.push(`solution does not satisfy require: ${r.message}`)

    const sol = await exercise(l, l.solution)
    if (!sol.compiled) p.push(`solution does not compile: ${errLines(sol.stderr)}`)
    else {
      if (sol.run.nondeterministic) p.push('solution output differs between runs (HashMap/HashSet order?)')
      if (sol.extra) p.push(sol.extra)
      if (!sol.verdict.pass) p.push(`solution fails: ${failures(sol)}`)
    }

    const st = await exercise(l, l.starter)
    if (l.kind === 'fix') {
      if (st.compiled) p.push('fix starter compiles; it must fail with ' + l.errorCode)
      else if (!hasErrorCode(st.stderr, l.errorCode)) p.push(`fix starter fails with ${q(primaryErrorLine(st.stderr) ?? st.stderr.slice(0, 120))}, not ${l.errorCode}`)
      for (const r of requireResults(l, l.starter)) if (!r.met) p.push(`fix starter must satisfy require too (it is the point of the exercise): ${r.message}`)
      const sh = forbiddenHit(l, l.starter)
      if (sh) p.push(`fix starter uses a forbidden pattern: ${sh}`)
    } else if (st.compiled && st.verdict.pass && !forbiddenHit(l, l.starter) && requireResults(l, l.starter).every(r => r.met)) {
      p.push('starter already passes every test')
    }
  }

  if (l.kind === 'concept' && l.compare.rust) {
    const c = l.compare.rust
    const src = /\bfn\s+main\b/.test(c.code) ? c.code : `fn main() {\n${c.code}\n}`
    const r = await compileRust(src)
    if (c.ok && !r.ok) p.push(`compare.rust is marked ok but does not compile: ${errLines(r.stderr)}`)
    if (!c.ok && r.ok) p.push('compare.rust is marked as an error but compiles')
    if (!c.ok && !r.ok && c.errorCode && !hasErrorCode(r.stderr, c.errorCode)) p.push(`compare.rust fails with ${q(primaryErrorLine(r.stderr))}, not ${c.errorCode}`)
  }

  const cpp = []
  if (l.kind === 'concept' && l.compare.cpp.ok !== false) cpp.push(['compare.cpp', l.compare.cpp.code])
  if (l.inCpp && l.inCpp.ok !== false) cpp.push(['inCpp', l.inCpp.code])
  if (l.cppUnchecked) { if (cpp.length) cppUncheckedIds.push(l.id) }
  else for (const [what, code] of cpp) {
    const err = await checkCpp(code, l.cppStd ?? 17)
    if (err) p.push(`${what} does not pass clang++ -std=c++${l.cppStd ?? 17} -fsyntax-only (even wrapped): ${err}`)
  }
  return p
}

// ---------- main ----------
// Taught-before-used: walk the whole track in order. A lesson is checked when it has `teach` or sits in a migrated
// stage (stage 1 for now; add stage indexes here as stages 2-7 are rewritten). Un-migrated lessons contribute nothing.
const syntaxProblems = new Map()
{
  const taught = new Set()
  STAGES.forEach((stage, si) => {
    for (const l of stage.lessons) {
      if (!(MIGRATED_STAGES.has(si) || l.teach !== undefined)) continue
      for (const id of l.introduces ?? []) taught.add(id)
      const srcs = []
      for (const [i, e] of (l.teach?.examples ?? []).entries()) srcs.push([`teach.examples[${i}]`, e.code])
      if (l.compare?.rust?.code) srcs.push(['compare.rust', l.compare.rust.code])
      if (typeof l.starter === 'string') srcs.push(['starter', l.starter])
      if (typeof l.solution === 'string') srcs.push(['solution', l.solution])
      for (const [i, r] of (l.rounds ?? []).entries()) srcs.push([`round ${i + 1} snippet`, r.snippet])
      const spans = []
      for (const h of [l.task, ...(l.hints ?? [])]) for (const sp of codeSpans(h)) spans.push([h === l.task ? 'task' : 'hint', sp])
      const problems = [], reported = new Set()
      const check = (where, found) => {
        for (const [id, hit] of found) {
          if (taught.has(id) || reported.has(id)) continue
          reported.add(id)
          problems.push(`uses ${hit} (${id}) before it is taught (in ${where})`)
        }
      }
      for (const [where, code] of srcs) if (typeof code === 'string') check(where, detectSyntax(code))
      for (const [where, code] of spans) check(`<code> in ${where}`, detectSyntax(code, { span: true }))
      if (problems.length) syntaxProblems.set(l, problems)
    }
  })
}

const seen = new Set()
const jobs = []
STAGES.forEach((stage, si) => {
  for (const l of stage.lessons) {
    const dup = seen.has(l.id); seen.add(l.id)
    if (onlyStage && String(si + 1) !== onlyStage) continue
    if (onlyId && l.id !== onlyId) continue
    jobs.push({ l, si, promise: checkLesson(l, si + 1).then(p => [...p, ...(syntaxProblems.get(l) ?? []), ...(dup ? ['duplicate id'] : [])], e => [`checker crashed: ${e.stack ?? e}`]) })
  }
})
let bad = 0
for (const { l, si, promise } of jobs) {
  const problems = await promise
  if (problems.length) { bad++; console.log(`FAIL  ${si + 1} ${l.id ?? '(no id)'}\n      ${problems.join('\n      ')}`) }
  else console.log(`ok    ${si + 1} ${l.id}`)
}
rmSync(root, { recursive: true, force: true })
console.log(`\n${jobs.length - bad} of ${jobs.length} lessons ok`)
if (cppUncheckedIds.length) console.log(`${cppUncheckedIds.length} lesson(s) opted out of C++ checking (cppUnchecked): ${cppUncheckedIds.join(', ')}`)
if (!jobs.length) console.log('No lessons were checked.')
process.exit(bad || !jobs.length ? 1 : 0)
