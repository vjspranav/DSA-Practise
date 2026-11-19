// Pure helpers shared by the app and scripts/verify-cpp-learn.mjs (the C++ Learn path).
// Keep this file free of browser and React imports so Node can load it.
// Contract: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md ("Lesson data", "Checker").
import { CPP_WASM_SHIM } from '../runtime/executor.js'
import { normalise, forbiddenHit } from '../foundations/grade.js'

export { normalise, forbiddenHit }

// A harness prints this on its own line before each test: cout << "\n@@TEST 1@@" << endl;
// (the leading \n makes the marker start a line even if the learner's code printed without one; endl flushes, so
// the marker survives a crash). n starts at 1 and matches tests[n-1]. Text before @@TEST 1@@ is shown, not graded.
export const testMark = n => `@@TEST ${n}@@`
export const TEST_MARK_RE = /^@@TEST (\d+)@@[ \t]*$/

// The exact C++ source sent to the compiler. No preamble: the learner writes their own #includes.
// A harness goes AFTER the learner's code (so their line numbers match the compiler output) and defines main().
export function assembleSource(lesson, userCode) {
  if (lesson.harness) return userCode + '\n' + lesson.harness + '\n' + CPP_WASM_SHIM
  return userCode + '\n' + CPP_WASM_SHIM
}

// Split stdout at the @@TEST n@@ marker lines. outputs[n-1] is the text printed during test n
// (undefined when marker n never appeared, e.g. the run crashed earlier).
export function splitTests(stdout) {
  const outputs = []
  const printed = []
  let cur = null
  for (const line of String(stdout ?? '').replace(/\r/g, '').split('\n')) {
    const m = TEST_MARK_RE.exec(line)
    if (m) { cur = Number(m[1]) - 1; outputs[cur] = []; continue }
    if (cur === null) printed.push(line)
    else outputs[cur].push(line)
  }
  return { printed: printed.join('\n'), outputs: outputs.map(o => (o ? o.join('\n') : undefined)) }
}

// Remove // and /* */ comments; string, raw-string and char literals are kept intact.
// Newlines inside block comments are kept so line numbers do not move.
export function stripComments(code) {
  let out = '', i = 0
  const n = code.length
  while (i < n) {
    const c = code[i], d = code[i + 1]
    if (c === '/' && d === '/') { while (i < n && code[i] !== '\n') i++; continue }
    if (c === '/' && d === '*') {
      i += 2
      while (i < n && !(code[i] === '*' && code[i + 1] === '/')) { if (code[i] === '\n') out += '\n'; i++ }
      i += 2; out += ' '; continue
    }
    if (c === 'R' && d === '"' && !/[A-Za-z0-9_]/.test(code[i - 1] ?? '')) {
      const m = /^R"([^()\\\s]{0,16})\(/.exec(code.slice(i, i + 24))
      if (m) {
        const close = ')' + m[1] + '"', end = code.indexOf(close, i + m[0].length)
        const stop = end < 0 ? n : end + close.length
        out += code.slice(i, stop); i = stop; continue
      }
    }
    if (c === '"') {
      let j = i + 1
      while (j < n && code[j] !== '"' && code[j] !== '\n') { if (code[j] === '\\') j++; j++ }
      out += code.slice(i, j + 1); i = j + 1; continue
    }
    if (c === "'") {
      const m = /^'(?:\\(?:x[0-9a-fA-F]+|[0-7]{1,3}|.)|[^\\'\n])'/.exec(code.slice(i, i + 12))
      if (m) { out += m[0]; i += m[0].length; continue }
    }
    out += c; i++
  }
  return out
}

// Each `require` entry is { pattern, message } with pattern a RegExp source string (no flags).
// Matched against the learner's code with comments removed. Returns [{ message, met }] in order.
export function requireResults(lesson, userCode) {
  const code = stripComments(userCode)
  return (lesson.require ?? []).map(r => ({ message: r.message, met: new RegExp(r.pattern).test(code) }))
}

// First real error of compiler output: { line, message } (message is the text after "error: "), or null.
// Works for `main.cpp:3:5: error: ...` (clang) and `fatal error: ...`. Warnings and notes are skipped.
const ERROR_RE = /^(?:.*?:\d+:\d+:\s*)?(?:fatal )?error:\s*(.*)$/
export function firstError(text) {
  for (const l of String(text ?? '').replace(/\r/g, '').split('\n')) {
    const m = ERROR_RE.exec(l.trim())
    if (m) return { line: l.trim(), message: m[1] }
  }
  return null
}

// Does the first error of the compiler output match the lesson's `errorMatch` (a RegExp source string)?
export function errorMatches(lesson, compilerText) {
  const e = firstError(compilerText)
  return !!e && new RegExp(lesson.errorMatch).test(e.message)
}

const TLE_MESSAGE = 'A test ran too long and the program was stopped.'
const row = (t, got, status, extra) => ({ name: t.name, expected: normalise(t.expected), got, status, ...extra })

// One test of a program (no harness): the whole stdout of its own run is compared with `expected`.
function programTest(t, run) {
  if (!run) return row(t, '', 'notrun')
  if (run.status === 'tle') return row(t, '', 'fail', { message: TLE_MESSAGE })
  const got = normalise(run.stdout)
  if (run.status === 'error') return row(t, got, 'fail', { message: run.message })
  return row(t, got, got === normalise(t.expected) ? 'pass' : 'fail')
}

// Tests of a harness lesson from the single run: the output after marker n is test n's. A crash or timeout ends
// the run: tests whose marker was followed by a later marker are graded, the one that was running fails with
// the message (or timeout note), and the rest are "not run".
function harnessTests(lesson, run) {
  const split = splitTests(run.stdout ?? '')
  const printed = normalise(split.printed)
  const started = split.outputs.length
  const failed = run.status === 'error' || run.status === 'tle'
  const message = run.status === 'tle' ? TLE_MESSAGE : run.message
  // The test that was running when the run stopped (the first one, if it stopped before any marker).
  const stoppedAt = failed ? Math.max(started - 1, 0) : -1
  const tests = lesson.tests.map((t, i) => {
    if (failed && i > stoppedAt) return row(t, '', 'notrun')
    if (split.outputs[i] === undefined) return failed && i === stoppedAt ? row(t, '', 'fail', { message }) : row(t, '', 'notrun')
    const got = normalise(split.outputs[i])
    if (failed && i === stoppedAt) return row(t, got, 'fail', { message })
    return row(t, got, got === normalise(t.expected) ? 'pass' : 'fail')
  })
  const firstBad = tests.find(t => t.status === 'fail')
  if (firstBad && printed) firstBad.printed = printed
  return tests
}

// Grade one attempt. `result` is { compileError } (compile failed), or { runs: [runTest result per test] } for a
// lesson without a harness (every test is its own run, with its own stdin), or ONE runTest result for a lesson
// with a harness. runTest results: { status:'ok', stdout } | { status:'error', message, stdout } | { status:'tle' }.
// Returns { compile?, tests: [{ name, status:'pass'|'fail'|'notrun', expected, got, printed?, message? }],
//           win, missing, forbidden } where `missing` lists unmet `require` messages and `forbidden` is the message
// of the first forbidden pattern found (or null); win needs all tests passing, nothing missing, nothing forbidden.
export function gradeRun(lesson, code, result) {
  const missing = requireResults(lesson, code).filter(r => !r.met).map(r => r.message)
  const forbidden = forbiddenHit(lesson, code)
  if (result.compileError !== undefined) {
    return { compile: result.compileError, tests: lesson.tests.map(t => row(t, '', 'notrun')), win: false, missing, forbidden }
  }
  const tests = lesson.harness
    ? harnessTests(lesson, result)
    : lesson.tests.map((t, i) => programTest(t, result.runs?.[i]))
  const win = tests.length > 0 && tests.every(t => t.status === 'pass') && missing.length === 0 && !forbidden
  return { tests, win, missing, forbidden }
}
