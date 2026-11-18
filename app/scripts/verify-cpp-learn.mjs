#!/usr/bin/env node
// Checks every C++ Learn lesson with the locally installed clang++ (-std=c++14 -fno-exceptions -O1 -w, like the
// in-browser clang 8) and python3 -I:
//   - fields, id format, text limits, no randomness / time / threads / file I/O / exceptions / C++17 features
//   - solution compiles and passes every test; starter does not pass (fix: must fail to compile with errorMatch)
//   - solution satisfies `require` and avoids `forbidden`; a fix starter must satisfy `require` too
//   - predict rounds behave exactly as stored (compile error whose first error line is in `output`, or exact stdout)
//   - teach examples compile, run and print `output`; compare.cpp / compare.py behave as their `ok` says
//   - Python snippets (compare.py, inPython) with ok !== false run under python3 -I, exit 0, within 2 seconds
//   - taught-before-used: C++ in a lesson may only use syntax ids introduced by it or an earlier lesson
// Usage: node scripts/verify-cpp-learn.mjs [--stage N] [--only lesson-id] [--file path-to-module-exporting-LESSONS]
// Env:   CPP_LEARN_ASSUME=K  treat every registry id with stage <= K as taught before the first lesson
//        (stage builders working in parallel use it to check their stage alone).
// With --file the lessons are checked in file order as one track; the stage of a lesson is read from its id
// (c1-... is stage 1). Fixture lessons with id c0-... are stage 0: exempt from the `teach` requirement.
// Contract: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md ("Lesson data", "Checker").
import { execFile } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir, cpus } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { STAGES } from '../src/data/cpp-learn/index.js'
import { SYNTAX, detectSyntax, codeSpans, syntaxIds } from '../src/cpp-learn/syntax.js'
import {
  assembleSource, gradeRun, splitTests, requireResults, forbiddenHit, firstError, errorMatches, normalise, stripComments,
} from '../src/cpp-learn/grade.js'

const args = process.argv.slice(2)
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null }
const onlyStage = opt('--stage'), onlyId = opt('--only'), filePath = opt('--file')

const KINDS = ['concept', 'predict', 'fix', 'program', 'implement', 'drill', 'bugfix']
const ALLOWED = new Set(['id', 'title', 'kind', 'task', 'refresher', 'hints', 'inPython', 'starter', 'solution', 'harness',
  'tests', 'require', 'forbidden', 'compare', 'rounds', 'errorMatch', 'gloss', 'teach', 'introduces', 'timeLimitMs', 'pyUnchecked'])
const CLANG_FLAGS = ['-std=c++14', '-fno-exceptions', '-O1', '-w']
const COMPILE_MS = 120000, DEFAULT_RUN_MS = 4000, PY_MS = 2000

// ---------- process helpers (bounded concurrency, each distinct source compiled once) ----------
const root = mkdtempSync(join(tmpdir(), 'cppl-'))
let counter = 0
const slots = Math.max(2, Math.min(6, cpus().length - 1))
let active = 0
const waiting = []
async function slot(fn) {
  if (active >= slots) await new Promise(r => waiting.push(r))
  active++
  try { return await fn() } finally { active--; waiting.shift()?.() }
}
const exec = (cmd, argv, opts = {}) => slot(() => new Promise(resolve => {
  const { input, ...rest } = opts
  const child = execFile(cmd, argv, { encoding: 'utf8', maxBuffer: 16 << 20, killSignal: 'SIGKILL', ...rest }, (err, stdout, stderr) => {
    resolve({ ok: !err, code: err?.code ?? 0, signal: err?.signal ?? null, timedOut: !!(err && err.killed), stdout, stderr })
  })
  child.stdin?.on('error', () => {})
  child.stdin?.end(input ?? '')
}))

const compiled = new Map()
// Compile in a scratch directory with the file called main.cpp, so diagnostics read `main.cpp:3:5: error: ...`.
function compileCpp(src, extra = []) {
  const key = extra.join(' ') + '\0' + src
  if (!compiled.has(key)) compiled.set(key, (async () => {
    const dir = join(root, `s${++counter}`)
    mkdirSync(dir)
    writeFileSync(join(dir, 'main.cpp'), src)
    const r = await exec('clang++', [...CLANG_FLAGS, '-fno-color-diagnostics', ...extra, '-o', 'main', 'main.cpp'], { cwd: dir, timeout: COMPILE_MS })
    return { ok: r.ok, stderr: r.stderr, dir }
  })())
  return compiled.get(key)
}
// Run a compiled program on one stdin; the result has the browser runTest shape ({status, stdout, message}).
async function runOnce(dir, stdin, limitMs) {
  const r = await exec(join(dir, 'main'), [], { cwd: dir, timeout: limitMs, input: stdin })
  if (r.timedOut) return { status: 'tle' }
  if (r.ok) return { status: 'ok', stdout: r.stdout }
  const why = r.signal ? `The program was stopped by ${r.signal}` : `The program exited with code ${r.code}`
  return { status: 'error', message: (r.stderr.trim().split('\n').slice(-1)[0] || why), stdout: r.stdout, exit: why }
}
const ranCache = new Map()
function runCpp(src, stdin, limitMs) {
  const key = `${limitMs}\0${stdin}\0${src}`
  if (!ranCache.has(key)) ranCache.set(key, (async () => {
    const c = await compileCpp(src)
    const first = await runOnce(c.dir, stdin, limitMs)
    // Printing unordered_map / unordered_set order is implementation-defined: reject programs whose output moves.
    if (first.status === 'ok' && /\bunordered_(?:map|set)\b/.test(src)) {
      const second = await runOnce(c.dir, stdin, limitMs)
      if (second.status !== 'ok' || second.stdout !== first.stdout) first.nondeterministic = true
    }
    return first
  })())
  return ranCache.get(key)
}

// ---------- Python snippets ----------
const pyCache = new Map()
function runPython(code) {
  if (!pyCache.has(code)) pyCache.set(code, (async () => {
    const r = await exec('python3', ['-I', '-c', code], { timeout: PY_MS })
    if (r.ok) return null
    if (r.timedOut) return `timed out after ${PY_MS / 1000}s`
    return (r.stderr.trim().split('\n').slice(-1)[0] || `exit ${r.code}`)
  })())
  return pyCache.get(code)
}

// ---------- C++ snippets that are fragments (compare.cpp) ----------
const PRELUDE = ['iostream', 'sstream', 'vector', 'string', 'algorithm', 'map', 'unordered_map', 'set', 'unordered_set',
  'queue', 'stack', 'deque', 'array', 'tuple', 'memory', 'utility', 'functional', 'numeric', 'iterator',
  'cstdint', 'cstddef', 'cstdio', 'cstdlib', 'cstring', 'cmath', 'climits', 'cassert', 'cctype', 'iomanip', 'limits']
  .map(h => `#include <${h}>`).join('\n') + '\nusing namespace std;\n'
// Wrapping rule (the snippet passes if ANY attempt compiles), the same three attempts as the Rust checker:
//   1. as is, after the prelude (own main, or only declarations); 2. whole snippet inside `int main() { ... }`;
//   3. everything up to the last line that is exactly `}` or `};` at column 0 at file scope, the rest in main.
function attempts(code) {
  const out = [PRELUDE + code]
  if (!/\bmain\s*\(/.test(code)) {
    out.push(`${PRELUDE}int main() {\n${code}\n}`)
    const lines = code.split('\n')
    let cut = -1
    lines.forEach((l, i) => { if (/^\};?\s*$/.test(l)) cut = i })
    if (cut >= 0 && cut < lines.length - 1) out.push(`${PRELUDE}${lines.slice(0, cut + 1).join('\n')}\nint main() {\n${lines.slice(cut + 1).join('\n')}\n}`)
  }
  return out
}
// null when some attempt compiles (syntax-only); else the error summary of every attempt.
const fragCache = new Map()
function fragmentErrors(code) {
  if (!fragCache.has(code)) fragCache.set(code, (async () => {
    const errs = []
    for (const src of attempts(code)) {
      const c = await compileCpp(src, ['-fsyntax-only'])
      if (c.ok) return { ok: true, errors: [] }
      errs.push(c.stderr)
    }
    return { ok: false, errors: errs }
  })())
  return fragCache.get(code)
}

// ---------- shape and text limits ----------
const text = html => String(html).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
const sentences = html => text(html).split(/[.!?](?:\s|$)/).filter(s => s.trim()).length
const str = v => typeof v === 'string' && v.trim() !== ''
const BANNED = [
  [/\b(?:rand|srand|random_device|mt19937|default_random_engine|uniform_int_distribution)\b/, 'uses randomness'],
  [/\b(?:chrono|clock|time|gettimeofday|sleep_for|usleep)\s*[(:<]|<chrono>|<ctime>|<time\.h>/, 'uses time'],
  [/\b(?:thread|mutex|atomic|async|future)\b|<thread>|<mutex>|<atomic>|<future>/, 'uses threads'],
  [/\b(?:fstream|ifstream|ofstream|fopen|freopen|remove|rename|system|getenv)\s*[(\s<]|<fstream>|<filesystem>/, 'uses files, processes or the environment'],
  [/\b(?:try|throw|catch)\b/, 'uses exceptions (the browser compiler has them off)'],
  [/<bits\/stdc\+\+\.h>/, 'includes <bits/stdc++.h>'],
  [/<(?:optional|variant|string_view|any|filesystem|execution)>|\bstd::(?:optional|variant|string_view|any)\b|\bnullopt\b/, 'uses a C++17 library feature (the browser compiler is C++14)'],
  [/\bauto\s*&{0,2}\s*\[|\bif\s+constexpr\b|\binline\s+(?:const|static)?\s*\w+\s+\w+\s*=/, 'uses a C++17 language feature'],
]

function shape(l, stageNo) {
  const p = []
  const need = (ok, msg) => { if (!ok) p.push(msg) }
  for (const k of Object.keys(l)) need(ALLOWED.has(k), `unknown field "${k}"`)
  need(new RegExp(`^c${stageNo}-[a-z0-9]+(-[a-z0-9]+)*$`).test(l.id ?? ''), `id must be a slug starting c${stageNo}-`)
  need(str(l.title) && l.title.length <= 40, 'title missing or over 40 characters')
  need(KINDS.includes(l.kind), `kind must be one of ${KINDS.join(', ')}`)
  need(str(l.task) && text(l.task).length <= 240, 'task missing or over 240 characters of text')
  need(Array.isArray(l.refresher) && l.refresher.length >= 1 && l.refresher.length <= 3, 'refresher needs 1 to 3 items')
  need((l.refresher ?? []).every(r => str(r) && text(r).length <= 200), 'a refresher item is empty or over 200 characters')
  if (l.kind === 'predict') need(l.hints === undefined, 'predict lessons have no hints')
  else {
    need(Array.isArray(l.hints) && l.hints.length >= 2 && l.hints.length <= 3, 'hints needs 2 or 3 items')
    need((l.hints ?? []).every(h => str(h) && text(h).length <= 200), 'a hint is empty or over 200 characters')
  }
  if (l.inPython !== undefined) {
    const ip = l.inPython
    need(ip && str(ip.code) && str(ip.note), 'inPython needs code and note')
    for (const k of Object.keys(ip ?? {})) need(['code', 'note', 'ok'].includes(k), `inPython has unknown field "${k}"`)
    need(ip?.ok === undefined || typeof ip.ok === 'boolean', 'inPython.ok must be a boolean')
    need(str(ip?.note) && text(ip.note).length <= 300 && sentences(ip.note) <= 2, 'inPython.note must be at most 2 sentences and 300 characters')
  }
  for (const key of ['require', 'forbidden']) {
    for (const r of l[key] ?? []) {
      let ok = str(r?.pattern) && str(r?.message)
      if (ok) try { new RegExp(r.pattern) } catch { ok = false }
      need(ok, `${key} entries need a valid regex "pattern" and a "message"`)
    }
  }
  need(Array.isArray(l.introduces) && l.introduces.every(x => typeof x === 'string'), 'every lesson needs introduces: an array of syntax ids (use [] if nothing is new)')
  const ids = syntaxIds()
  for (const x of l.introduces ?? []) need(ids.has(x), `introduces "${x}" is not in the syntax registry (src/cpp-learn/syntax.js)`)
  if (stageNo > 0 && ((l.introduces ?? []).length || l.kind === 'concept')) need(l.teach !== undefined, 'teach is required for concept lessons and lessons that introduce syntax')
  if (l.teach !== undefined) {
    const t = l.teach
    need(t && typeof t === 'object' && !Array.isArray(t), 'teach must be an object')
    for (const k of Object.keys(t ?? {})) need(['body', 'examples', 'terms'].includes(k), `unknown teach field "${k}"`)
    need(Array.isArray(t?.body) && t.body.length >= 1 && t.body.length <= 5 && t.body.every(str), 'teach.body needs 1 to 5 non-empty paragraphs')
    need(Array.isArray(t?.examples) && t.examples.length >= 1 && t.examples.length <= 3, 'teach.examples needs 1 to 3 examples')
    for (const [i, e] of (t?.examples ?? []).entries()) {
      need(e && str(e.code), `teach.examples[${i}] needs code`)
      for (const k of Object.keys(e ?? {})) need(['code', 'output', 'caption', 'wrap', 'stdin'].includes(k), `teach.examples[${i}] has unknown field "${k}"`)
      need(e?.output === undefined || typeof e.output === 'string', `teach.examples[${i}].output must be a string`)
      need(e?.caption === undefined || str(e.caption), `teach.examples[${i}].caption must be non-empty`)
      need(e?.stdin === undefined || typeof e.stdin === 'string', `teach.examples[${i}].stdin must be a string`)
      need(e?.wrap === undefined || e.wrap === true, `teach.examples[${i}].wrap must be true when present`)
    }
    need(Array.isArray(t?.terms) && t.terms.length >= 1, 'teach.terms needs at least one entry')
    for (const [i, x] of (t?.terms ?? []).entries()) need(x && str(x.code) && str(x.meaning), `teach.terms[${i}] needs non-empty code and meaning`)
  }
  need(l.pyUnchecked === undefined || l.pyUnchecked === true, 'pyUnchecked must be true when present')
  need(l.timeLimitMs === undefined || (Number.isInteger(l.timeLimitMs) && l.timeLimitMs >= 200 && l.timeLimitMs <= 10000), 'timeLimitMs must be an integer from 200 to 10000')

  if (l.kind === 'predict') {
    for (const f of ['starter', 'solution', 'harness', 'tests', 'errorMatch', 'gloss']) need(l[f] === undefined, `predict lessons have no ${f}`)
    need(Array.isArray(l.rounds) && l.rounds.length >= 1 && l.rounds.length <= 2, 'rounds needs 1 or 2 items')
    for (const [i, r] of (l.rounds ?? []).entries()) {
      const w = `round ${i + 1}: `
      for (const k of Object.keys(r ?? {})) need(['snippet', 'choices', 'answer', 'why', 'output', 'error', 'stdin', 'ub'].includes(k), w + `unknown field "${k}"`)
      need(str(r.snippet) && /\bint\s+main\b/.test(r.snippet), w + 'snippet must be a whole program with int main')
      need(Array.isArray(r.choices) && r.choices.length === 3 && r.choices.every(c => str(c) && c.length <= 60), w + 'choices must be 3 strings of at most 60 characters')
      need(Number.isInteger(r.answer) && r.answer >= 0 && r.answer <= 2, w + 'answer must be 0, 1 or 2')
      need(str(r.why) && text(r.why).length <= 240, w + 'why missing or over 240 characters')
      need(typeof r.output === 'string' && r.output.trim() !== '', w + 'output missing')
      need(r.error === undefined || r.error === true, w + 'error must be true when present')
      need(r.ub === undefined || r.ub === true, w + 'ub must be true when present')
      need(!(r.error && r.ub), w + 'a round cannot be both error and ub')
      need(r.stdin === undefined || typeof r.stdin === 'string', w + 'stdin must be a string')
    }
    return p
  }

  need(typeof l.starter === 'string', 'starter missing (use an empty string for a blank file)')
  need(str(l.solution), 'solution missing')
  need(Array.isArray(l.tests) && l.tests.length >= (['implement', 'drill', 'bugfix'].includes(l.kind) ? 3 : 1), 'too few tests (implement/drill/bugfix need 3, others 1)')
  if (l.harness !== undefined) {
    need(l.kind !== 'program', 'a program lesson has no harness: the learner writes the whole file')
    need(str(l.harness) && /\bint\s+main\b/.test(l.harness) && l.harness.includes('@@TEST'), 'harness must define int main and print @@TEST n@@ markers')
    need((l.tests ?? []).every(t => str(t.name) && typeof t.expected === 'string' && (t.input === undefined || typeof t.input === 'string')), 'each test needs name and expected (input is an optional label)')
    for (const t of l.tests ?? []) for (const k of Object.keys(t ?? {})) need(['name', 'expected', 'input'].includes(k), `test has unknown field "${k}"`)
  } else {
    need(['program', 'concept', 'fix'].includes(l.kind), `${l.kind} lessons need a harness`)
    need((l.tests ?? []).every(t => str(t.name) && typeof t.stdin === 'string' && typeof t.expected === 'string'), 'program tests need name, stdin and expected')
    for (const t of l.tests ?? []) for (const k of Object.keys(t ?? {})) need(['name', 'stdin', 'expected'].includes(k), `test has unknown field "${k}"`)
  }
  if (l.kind === 'fix') {
    let ok = str(l.errorMatch)
    if (ok) try { new RegExp(l.errorMatch) } catch { ok = false }
    need(ok, 'fix lessons need errorMatch: a regex source matching the first error line')
    need(str(l.gloss) && text(l.gloss).length <= 200 && sentences(l.gloss) <= 2, 'gloss missing, over 200 characters or over 2 sentences')
  } else need(l.errorMatch === undefined && l.gloss === undefined, 'errorMatch and gloss belong to fix lessons only')
  if (l.kind === 'concept') {
    const c = l.compare
    need(c && c.py && c.cpp && str(c.py.code) && str(c.cpp.code) && typeof c.py.ok === 'boolean' && typeof c.cpp.ok === 'boolean', 'concept needs compare.py and compare.cpp with code and boolean ok')
    need(c && [c?.py?.outcome, c?.cpp?.outcome].every(o => str(o) && o.length <= 60), 'compare outcomes must be short one-liners (60 characters)')
    need(c && str(c.text) && sentences(c.text) <= 2 && text(c.text).length <= 300, 'compare.text must be at most 2 sentences and 300 characters')
    for (const side of ['py', 'cpp']) for (const k of Object.keys(c?.[side] ?? {})) need(['code', 'outcome', 'ok', 'errorMatch'].includes(k), `compare.${side} has unknown field "${k}"`)
  } else need(l.compare === undefined, 'compare belongs to concept lessons only')
  return p
}

// ---------- lesson checks ----------
const clip = (s, n = 160) => (s.length > n ? s.slice(0, n) + '...' : s)
const q = s => JSON.stringify(clip(String(s)))
const errLines = stderr => stderr.split('\n').filter(l => /error:/.test(l)).slice(0, 3).map(l => l.replace(/^.*?main\.cpp:/, 'line ')).join(' | ') || stderr.slice(0, 300)
const limitOf = l => l.timeLimitMs ?? DEFAULT_RUN_MS

// Compile (once) and run an exercise the way the app does, then grade it with the shared gradeRun.
async function exercise(l, code) {
  const src = assembleSource(l, code)
  const c = await compileCpp(src)
  if (!c.ok) return { compiled: false, stderr: c.stderr, graded: gradeRun(l, code, { compileError: c.stderr }) }
  let extra = null, nondeterministic = false
  let graded
  if (l.harness) {
    const run = await runCpp(src, '', limitOf(l))
    nondeterministic = !!run.nondeterministic
    graded = gradeRun(l, code, run)
    if (run.status === 'ok') {
      const n = splitTests(run.stdout).outputs.length
      if (n !== l.tests.length) extra = `harness printed ${n} @@TEST markers for ${l.tests.length} tests`
    }
  } else {
    const runs = []
    for (const t of l.tests) { const r = await runCpp(src, t.stdin, limitOf(l)); nondeterministic ||= !!r.nondeterministic; runs.push(r) }
    graded = gradeRun(l, code, { runs })
  }
  return { compiled: true, graded, extra, nondeterministic }
}
const failures = g => g.tests.filter(t => t.status !== 'pass')
  .map(t => t.status === 'notrun' ? `${t.name}: not run` : `${t.name}: expected ${q(t.expected)}, got ${q(t.got)}${t.message ? ` [${clip(t.message, 100)}]` : ''}`)
  .join('; ')

async function checkRounds(l, p) {
  for (const [i, r] of l.rounds.entries()) {
    const w = `round ${i + 1}: `
    const c = await compileCpp(r.snippet)
    if (r.error) {
      if (c.ok) { p.push(w + 'is marked as an error round but the snippet compiles'); continue }
      const first = firstError(c.stderr)
      if (!first) { p.push(w + `compilation failed without an "error:" line: ${q(c.stderr)}`); continue }
      if (!r.output.includes(first.line)) p.push(w + `output lacks the compiler's first error line ${q(first.line)}`)
      continue
    }
    if (!c.ok) { p.push(w + `snippet does not compile: ${errLines(c.stderr)}`); continue }
    // An undefined-behaviour round must compile but is never run: nothing about its output may be stored.
    if (r.ub) continue
    const run = await runCpp(r.snippet, r.stdin ?? '', DEFAULT_RUN_MS)
    if (run.nondeterministic) p.push(w + 'output differs between runs (unordered_map/unordered_set order?)')
    if (run.status !== 'ok') p.push(w + `program ${run.status === 'tle' ? 'timed out' : `fails at run time: ${clip(run.message ?? '', 120)}`} (use "ub: true" for undefined behaviour)`)
    else if (normalise(run.stdout) !== normalise(r.output)) p.push(w + `program prints ${q(normalise(run.stdout))} but output says ${q(normalise(r.output))}`)
  }
}

async function checkLesson(l, stageNo) {
  const p = shape(l, stageNo)
  if (p.length) return p
  const cppCode = [l.starter, l.solution, l.harness, ...(l.rounds ?? []).map(r => r.snippet), l.compare?.cpp?.code,
    ...(l.teach?.examples ?? []).map(e => e.code)].filter(s => typeof s === 'string')
  for (const code of cppCode) {
    // Comments and the contents of string literals are blanked: the word "time" in a message is not a time call.
    const clean = stripComments(code).replace(/"(?:\\.|[^"\\\n])*"/g, '""')
    for (const [re, why] of BANNED) if (re.test(clean)) p.push(`code ${why}: ${q((clean.match(re) ?? [''])[0])}`)
  }
  if (p.length) return p

  for (const [i, e] of (l.teach?.examples ?? []).entries()) {
    const w = `teach.examples[${i}]: `
    const src = e.wrap ? `${PRELUDE}int main() {\n${e.code}\n}` : e.code
    const c = await compileCpp(src)
    if (!c.ok) { p.push(w + `does not compile: ${errLines(c.stderr)}`); continue }
    const run = await runCpp(src, e.stdin ?? '', DEFAULT_RUN_MS)
    if (run.status !== 'ok') { p.push(w + `fails at run time: ${clip(run.message ?? 'timed out', 120)} (an example cannot crash)`); continue }
    if (run.nondeterministic) p.push(w + 'output differs between runs')
    if (e.output !== undefined && normalise(run.stdout) !== normalise(e.output)) p.push(w + `prints ${q(normalise(run.stdout))} but output says ${q(normalise(e.output))}`)
  }

  if (l.kind === 'predict') await checkRounds(l, p)
  else {
    const hit = forbiddenHit(l, l.solution)
    if (hit) p.push(`solution uses a forbidden pattern: ${hit}`)
    for (const r of requireResults(l, l.solution)) if (!r.met) p.push(`solution does not satisfy require: ${r.message}`)

    const sol = await exercise(l, l.solution)
    if (!sol.compiled) p.push(`solution does not compile: ${errLines(sol.stderr)}`)
    else {
      if (sol.nondeterministic) p.push('solution output differs between runs (unordered_map/unordered_set order?)')
      if (sol.extra) p.push(sol.extra)
      if (!sol.graded.tests.every(t => t.status === 'pass')) p.push(`solution fails: ${failures(sol.graded)}`)
    }

    const st = await exercise(l, l.starter)
    if (l.kind === 'fix') {
      if (st.compiled) p.push(`fix starter compiles; it must fail with an error matching /${l.errorMatch}/`)
      else if (!errorMatches(l, st.stderr)) p.push(`fix starter fails with ${q(firstError(st.stderr)?.message ?? st.stderr.slice(0, 120))}, which does not match /${l.errorMatch}/`)
      for (const r of requireResults(l, l.starter)) if (!r.met) p.push(`fix starter must satisfy require too (it is the point of the exercise): ${r.message}`)
      const sh = forbiddenHit(l, l.starter)
      if (sh) p.push(`fix starter uses a forbidden pattern: ${sh}`)
    } else if (st.compiled && st.graded.tests.every(t => t.status === 'pass') && !forbiddenHit(l, l.starter) && requireResults(l, l.starter).every(r => r.met)) {
      p.push('starter already passes every test')
    }
  }

  if (l.kind === 'concept') {
    const c = l.compare.cpp
    const f = await fragmentErrors(c.code)
    if (c.ok && !f.ok) p.push(`compare.cpp is marked ok but does not compile (even wrapped): ${f.errors.map(errLines).join('  //  ')}`)
    if (!c.ok && c.errorMatch) {
      if (f.ok) p.push('compare.cpp has errorMatch but compiles')
      else if (!f.errors.some(e => errorMatches(c, e))) p.push(`compare.cpp errors do not match /${c.errorMatch}/: ${f.errors.map(errLines).join('  //  ')}`)
    }
  }

  const py = []
  if (l.kind === 'concept' && l.compare.py.ok !== false) py.push(['compare.py', l.compare.py.code])
  if (l.inPython && l.inPython.ok !== false) py.push(['inPython', l.inPython.code])
  if (!l.pyUnchecked) for (const [what, code] of py) {
    const err = await runPython(code)
    if (err) p.push(`${what} does not run under python3 -I: ${err}`)
  }
  return p
}

// ---------- the track to check ----------
let tracks // [{ stageNo, lessons: [...] }] in order
if (filePath) {
  const mod = await import(pathToFileURL(resolve(filePath)).href)
  const all = mod.LESSONS
  if (!Array.isArray(all)) { console.error(`${filePath} must export LESSONS`); process.exit(1) }
  tracks = all.map(l => ({ l, stageNo: Number(/^c(\d+)-/.exec(l.id ?? '')?.[1] ?? -1) }))
} else {
  tracks = STAGES.flatMap((s, si) => s.lessons.map(l => ({ l, stageNo: si + 1 })))
}

// ---------- the grading self-check: a crash after test 1 grades pass / fail / not run ----------
{
  const lesson = { harness: 'x', tests: [{ name: 'a', expected: '5' }, { name: 'b', expected: '6' }, { name: 'c', expected: '7' }] }
  const g = gradeRun(lesson, '', { status: 'error', message: 'boom', stdout: '\n@@TEST 1@@\n5\n\n@@TEST 2@@\n' })
  const got = g.tests.map(t => t.status).join()
  if (got !== 'pass,fail,notrun' || g.win) { console.error(`gradeRun self-check failed: ${got}`); process.exit(1) }
}

// ---------- taught-before-used ----------
// Walk the whole track in order. CPP_LEARN_ASSUME=K starts with every id of stage <= K already taught.
const syntaxProblems = new Map()
{
  const assume = Number(process.env.CPP_LEARN_ASSUME ?? 0)
  const taught = new Set(SYNTAX.filter(s => s.stage <= assume).map(s => s.id))
  for (const { l } of tracks) {
    for (const id of l.introduces ?? []) taught.add(id)
    const srcs = []
    for (const [i, e] of (l.teach?.examples ?? []).entries()) srcs.push([`teach.examples[${i}]`, e.code])
    if (l.compare?.cpp?.code) srcs.push(['compare.cpp', l.compare.cpp.code])
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
}

const seen = new Set()
const jobs = []
for (const { l, stageNo } of tracks) {
  const dup = seen.has(l.id); seen.add(l.id)
  if (onlyStage && String(stageNo) !== onlyStage) continue
  if (onlyId && l.id !== onlyId) continue
  jobs.push({ l, stageNo, promise: checkLesson(l, stageNo).then(p => [...p, ...(syntaxProblems.get(l) ?? []), ...(dup ? ['duplicate id'] : [])], e => [`checker crashed: ${e.stack ?? e}`]) })
}
let bad = 0
for (const { l, stageNo, promise } of jobs) {
  const problems = await promise
  if (problems.length) { bad++; console.log(`FAIL  ${stageNo} ${l.id ?? '(no id)'}\n      ${problems.join('\n      ')}`) }
  else console.log(`ok    ${stageNo} ${l.id}`)
}
rmSync(root, { recursive: true, force: true })
console.log(`\n${jobs.length - bad} of ${jobs.length} lessons ok`)
if (!jobs.length) console.log('No lessons were checked.')
process.exit(bad || !jobs.length ? 1 : 0)
