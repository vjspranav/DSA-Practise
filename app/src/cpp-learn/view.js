// Pure helpers that turn gradeRun() results into what the results panel draws. No React, so Node can load it.
import { TEST_MARK_RE } from './grade.js'

// The in-browser compiler calls the file test.cc; the lessons (and their stored clang output) call it main.cpp.
const tidy = text => String(text).replace(/\btest\.cc\b/g, 'main.cpp')

const TLE = /^A test ran too long/

// gradeRun() -> the shape the shared ResultsBody draws. status: ok | fail | error (crash) | tle | skipped.
export function checkView(lesson, g) {
  const tests = g.tests.map((t, i) => {
    const spec = lesson.tests[i] ?? {}
    const status = t.status === 'pass' ? 'ok' : t.status === 'notrun' ? 'skipped' : !t.message ? 'fail' : TLE.test(t.message) ? 'tle' : 'error'
    const input = lesson.harness ? spec.input : spec.stdin
    return {
      name: t.name, status, expected: t.expected, got: t.got, printed: t.printed, message: t.message,
      note: status === 'tle' ? t.message : undefined,
      input: input == null ? undefined : String(input).replace(/\n+$/, ''),
    }
  })
  return { kind: 'check', win: g.win, tests, compile: g.compile != null ? { text: tidy(g.compile) } : null, missing: g.missing, forbidden: g.forbidden }
}

// The Run button: what the program printed, never graded. A harness prints markers; show them as plain headings.
export function runView(lesson, result) {
  if (result.compileError !== undefined) return { kind: 'run', compile: { text: tidy(result.compileError) } }
  const r = lesson.harness ? result : result.runs[0]
  const stdout = r.status === 'tle' ? '' : lesson.harness
    ? String(r.stdout ?? '').replace(/\r/g, '').split('\n').map(l => { const m = TEST_MARK_RE.exec(l); return m ? `--- test ${m[1]} ---` : l }).join('\n').replace(/^\n+/, '')
    : String(r.stdout ?? '')
  return {
    kind: 'run', raw: stdout.replace(/\s+$/, ''),
    problem: r.status === 'tle' ? 'The program ran too long and was stopped.' : r.status === 'error' ? r.message : null,
  }
}
