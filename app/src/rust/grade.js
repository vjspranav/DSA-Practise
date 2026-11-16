// Pure helpers shared by the app and scripts/verify-rust.mjs.
// Keep this file free of browser and React imports so Node can load it.
// Contract: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" at the end).

// A harness prints this on its own line before each test: println!("\n@@TEST 1@@");
// (the leading \n guarantees the marker starts a line even if the learner's code printed without one).
// n starts at 1 and matches tests[n-1]. Whatever is printed before @@TEST 1@@ is shown but not graded.
export const testMark = n => `@@TEST ${n}@@`
export const TEST_MARK_RE = /^@@TEST (\d+)@@[ \t]*$/

// Collapse a program's output for comparison: drop \r, trailing spaces per line, and outer blank lines.
export const normalise = s =>
  String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim()

// The exact Rust source sent to the compiler: the learner's code, then the harness (if any).
// The harness goes AFTER the learner's code so their line numbers in compiler output are unchanged.
// The learner's code must not define fn main when a harness exists; the harness defines it.
export function assembleSource(lesson, userCode) {
  return lesson.harness ? userCode + '\n' + lesson.harness : userCode
}

// Split stdout at the @@TEST n@@ marker lines.
// Returns { printed, outputs } where outputs[n-1] is the text printed during test n
// (undefined if marker n never appeared, e.g. the run panicked earlier).
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

// Text of the panic from rustc/Playground stderr: the lines after "panicked at <loc>:" up to the next
// "note:" line. Returns null when the run did not panic. (The location line holds a thread id on newer
// toolchains, so it is not part of the message.)
export function panicMessage(stderr) {
  const lines = String(stderr ?? '').replace(/\r/g, '').split('\n')
  const at = lines.findIndex(l => /panicked at /.test(l))
  if (at < 0) return null
  const body = []
  for (const l of lines.slice(at + 1)) { if (/^note:/.test(l)) break; body.push(l) }
  return body.join('\n').trim()
}

// Judge one finished run against lesson.tests. `run` is { success, stdout, stderr } (the Playground reply shape).
// Returns { printed, panic, tests: [{ name, input, expected, got, status }], pass } where status is
//   'pass' | 'fail' | 'not-run'.
// Rules: with a harness, test n's output is what follows its marker. If the run failed (panic or non-zero
// exit), the last test that started is a 'fail' and every later test is 'not-run'. If a marker never
// appears in a successful run the test is 'not-run' (a harness bug the checker reports).
// Without a harness there is exactly one test and the whole stdout is compared.
export function judgeRun(lesson, run) {
  const panic = run.success ? null : (panicMessage(run.stderr) ?? 'The program stopped with a non-zero exit code.')
  let printed = ''
  const row = (t, got, status) => ({ name: t.name, input: t.input ?? null, expected: normalise(t.expected), got, status })
  let tests
  if (!lesson.harness) {
    const got = normalise(run.stdout)
    const t = lesson.tests[0]
    tests = [row(t, got, !run.success ? 'fail' : got === normalise(t.expected) ? 'pass' : 'fail')]
  } else {
    const split = splitTests(run.stdout)
    printed = normalise(split.printed)
    const started = split.outputs.length
    tests = lesson.tests.map((t, i) => {
      if (i >= started || split.outputs[i] === undefined) return row(t, '', 'not-run')
      const got = normalise(split.outputs[i])
      if (!run.success && i === started - 1) return row(t, got, 'fail')
      return row(t, got, got === normalise(t.expected) ? 'pass' : 'fail')
    })
  }
  return { printed, panic, tests, pass: tests.every(t => t.status === 'pass') }
}

// Remove // and nested /* */ comments (string, raw-string and char literals are kept intact),
// so require/forbidden patterns only see real code. Newlines inside block comments are kept.
export function stripComments(code) {
  let out = '', i = 0
  const n = code.length
  while (i < n) {
    const c = code[i], d = code[i + 1]
    if (c === '/' && d === '/') { while (i < n && code[i] !== '\n') i++; continue }
    if (c === '/' && d === '*') {
      let depth = 1; i += 2
      while (i < n && depth) {
        if (code[i] === '/' && code[i + 1] === '*') { depth++; i += 2 }
        else if (code[i] === '*' && code[i + 1] === '/') { depth--; i += 2 }
        else { if (code[i] === '\n') out += '\n'; i++ }
      }
      out += ' '; continue
    }
    if (c === 'r' && (d === '"' || d === '#') && !/[A-Za-z0-9_]/.test(code[i - 1] ?? '')) {
      const m = /^r(#*)"/.exec(code.slice(i, i + 40))
      if (m) {
        const close = '"' + m[1], end = code.indexOf(close, i + m[0].length)
        const stop = end < 0 ? n : end + close.length
        out += code.slice(i, stop); i = stop; continue
      }
    }
    if (c === '"') {
      let j = i + 1
      while (j < n && code[j] !== '"') { if (code[j] === '\\') j++; j++ }
      out += code.slice(i, j + 1); i = j + 1; continue
    }
    if (c === "'") {
      const m = /^'(?:\\(?:x[0-9a-fA-F]{2}|u\{[0-9a-fA-F_]+\}|.)|[^\\'])'/.exec(code.slice(i, i + 14))
      if (m) { out += m[0]; i += m[0].length; continue }
    }
    out += c; i++
  }
  return out
}

// Each `require` entry is { pattern, message } with pattern a RegExp source string (no flags).
// Returns [{ message, met }] in order; the UI shows them as chips.
export function requireResults(lesson, userCode) {
  const code = stripComments(userCode)
  return (lesson.require ?? []).map(r => ({ message: r.message, met: new RegExp(r.pattern).test(code) }))
}

// Message of the first `forbidden` pattern found in the learner's code, or null. A hit blocks the check.
export function forbiddenHit(lesson, userCode) {
  const code = stripComments(userCode)
  for (const f of lesson.forbidden ?? []) if (new RegExp(f.pattern).test(code)) return f.message
  return null
}

// Does compiler stderr contain the error code, e.g. hasErrorCode(stderr, 'E0502')?
export const hasErrorCode = (stderr, code) => new RegExp(`error\\[${code}\\]`).test(String(stderr ?? ''))

// First real error line of compiler stderr (`error[E0382]: borrow of moved value: ...`), or null.
// Warnings and the trailing "aborting due to" line are skipped.
export function primaryErrorLine(stderr) {
  for (const l of String(stderr ?? '').split('\n')) {
    if (/^error(\[E\d{4}\])?: /.test(l) && !/^error: aborting due to/.test(l)) return l.trim()
  }
  return null
}
