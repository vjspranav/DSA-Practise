// Turns a Playground reply into what the results area shows. Pure: no React, no network.
import { judgeRun, requireResults, TEST_MARK_RE } from './grade'
import { rustcText } from './playground'

// concept and fix steps show Compiles + tests + require chips; the other kinds show "Test n" chips.
export const isChipped = lesson => lesson.kind === 'concept' || lesson.kind === 'fix'

const CHIP = {
  ok: { status: 'ok', icon: 'check_circle' },
  bad: { status: 'fail', icon: 'cancel' },
  skip: { status: 'skipped', icon: 'remove_circle' },
}
const chip = (label, kind, extra) => ({ name: label, label, ...CHIP[kind], static: true, ...extra })

export const errorCodeOf = stderr => /error\[(E\d{4})\]/.exec(stderr)?.[1] ?? null

function compileFailure(lesson, reply) {
  const text = rustcText(reply.stderr)
  const compile = { text, code: errorCodeOf(text) }
  if (!isChipped(lesson)) return { kind: 'check', win: false, tests: null, compile }
  const rest = [...lesson.tests.map(t => t.name), ...(lesson.require ?? []).map(r => r.message)]
  return { kind: 'check', win: false, compile, tests: [chip('Compiles', 'bad'), ...rest.map(n => chip(n, 'skip'))] }
}

const ICON = { ok: 'check_circle', skipped: 'remove_circle', fail: 'cancel', error: 'cancel' }

function mapTest(t, panic, chipped) {
  const status = t.status === 'pass' ? 'ok' : t.status === 'not-run' ? 'skipped' : panic ? 'error' : 'fail'
  return { ...t, status, icon: ICON[status], message: panic ?? undefined, ...(chipped ? { label: t.name } : {}) }
}

// Grade one finished run. Returns the results object for the Workbench.
export function gradeReply(lesson, code, reply) {
  if (!reply.compiled) return compileFailure(lesson, reply)
  const judged = judgeRun(lesson, reply)
  const panic = judged.panic && (reply.timedOut ? 'The program ran too long and was stopped.' : judged.panic)
  // The panic belongs to the last test that started.
  const at = panic ? judged.tests.findLastIndex(t => t.status !== 'not-run') : -1
  const chipped = isChipped(lesson)
  const tests = judged.tests.map((t, i) => mapTest(t, i === at ? panic : null, chipped))
  const firstBad = tests.find(t => t.status === 'fail' || t.status === 'error')
  if (firstBad && judged.printed) firstBad.printed = judged.printed
  const reqs = requireResults(lesson, code)
  const reqChips = reqs.map(r => chip(r.message, r.met ? 'ok' : 'bad'))
  const win = judged.pass && reqs.every(r => r.met)
  return {
    kind: 'check', win, compile: null, panic,
    tests: chipped ? [chip('Compiles', 'ok'), ...tests, ...reqChips] : [...tests, ...reqChips],
    unmet: reqs.filter(r => !r.met).map(r => r.message),
  }
}

// "Run": show the program's output. Marker lines of a lesson's test harness are not shown.
export function runOutput(lesson, reply) {
  if (!reply.compiled) return { kind: 'run', compile: { text: rustcText(reply.stderr), code: errorCodeOf(reply.stderr) } }
  const judged = judgeRun(lesson, reply)
  const text = reply.stdout.split('\n').filter(l => !TEST_MARK_RE.test(l)).join('\n').replace(/^\n+/, '').trimEnd()
  const panic = judged.panic && (reply.timedOut ? 'The program ran too long and was stopped.' : judged.panic)
  return { kind: 'run', text, panic }
}
