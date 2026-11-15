// Runs one problem (Run example, Custom input or Submit) in C++ or Python and turns the output
// into a `res` object for the shared results area (workbench/Results.jsx).
import { buildCode, parseOutput } from '../runtime/executor'
import { compile, exclusive, runTest } from '../workbench/runner'
import { runPython } from './python'

// A C++ program that never returns is cut off after this long (the worker is then replaced).
// Problems with their own per-test limit are cut off a bit after it.
const HARD_MS = 8000
const hardLimit = problem => (problem.submitTimeLimitMs ? Math.max(3000, problem.submitTimeLimitMs * 20) : HARD_MS)

const toLines = stdout => stdout.split('\n').filter((l, i, a) => l !== '' || i < a.length - 1).map(text => ({ text: text + '\n', cls: 'stdout' }))
const printedText = outputLines => outputLines.map(l => l.text).join('').trim()

// What the learner's own code printed. Some harnesses print the result marker first, so also keep
// anything after it that is not a result line.
function printedOf(lines, parsed) {
  const at = lines.findIndex(l => l.text.includes('---RESULT---'))
  const after = at < 0 ? [] : lines.slice(at + 1).filter(l => !/^\s*(TEST|RESULT|SUMMARY):/.test(l.text))
  return printedText([...parsed.outputLines, ...after])
}

// Compiler errors refer to the assembled file; point them at the learner's own lines.
function mapErrors(problem, text) {
  const MARK = '\u0001'
  const offset = buildCode(MARK, problem, 'cpp', 'run').split(MARK)[0].split('\n').length - 1
  return text.replace(/(^|\n)[^\s:]*?:(\d+):(\d+):/g, (m, nl, line, col) => {
    const n = Number(line) - offset
    return n >= 1 ? `${nl}line ${n}, col ${col}:` : m
  })
}

const fault = (title, text) => ({ kind: 'compile', title, text })
const visible = (problem, i) => problem.testCases[i]
const nameOf = (problem, i) => visible(problem, i)?.label ?? `Test ${i + 1}`

// One graded test from a parsed TEST:/RESULT: line (or its absence).
function graded(problem, i, line, lines) {
  const parsed = parseOutput(lines)
  const base = { name: nameOf(problem, i), input: visible(problem, i)?.input, printed: printedOf(lines, parsed) }
  if (!line) return { ...base, status: 'error', message: 'The program did not print a result for this test. It may have ended early.' }
  return { ...base, status: line.passed ? 'ok' : 'fail', expected: line.expected, got: line.got }
}

async function runCpp(problem, mode, code, customInput) {
  const source = buildCode(code, problem, 'cpp', mode, customInput)
  return exclusive(async () => {
    const c = await compile(source)
    if (!c.ok) return fault('Compiler error', mapErrors(problem, c.error))
    if (mode === 'submit') return submitCpp(problem)

    const r = await runTest('', hardLimit(problem))
    if (r.status === 'tle') {
      return mode === 'run'
        ? { kind: 'run', test: { status: 'tle', input: visible(problem, 0)?.input, note: '(the program did not finish)' } }
        : fault('Time limit exceeded', 'The program did not finish.')
    }
    if (r.status === 'error') return fault('Runtime error', r.message)
    return fromOutput(problem, mode, toLines(r.stdout))
  })
}

async function submitCpp(problem) {
  const n = problem.submitTestCount ?? problem.testCases.length
  const soft = problem.submitTimeLimitMs
  const hard = hardLimit(problem)
  const tests = []
  let dead = false
  for (let tc = 1; tc <= n; tc++) {
    const i = tc - 1
    const base = { name: nameOf(problem, i), input: visible(problem, i)?.input }
    if (dead) { tests.push({ ...base, status: 'skipped' }); continue }
    const r = await runTest(`${tc}\n`, hard)
    if (r.status === 'tle') {
      dead = true
      tests.push({ ...base, status: 'tle', note: `(no answer within ${hard} ms; the remaining tests were not run)` })
    } else if (r.status === 'error') {
      tests.push({ ...base, status: 'error', message: r.message })
    } else {
      const lines = toLines(r.stdout)
      const t = graded(problem, i, parseOutput(lines).tests.find(x => x.n === tc), lines)
      if (soft && r.ms > soft) tests.push({ ...t, status: 'tle', note: `(took ${Math.ceil(r.ms)} ms, the limit is ${soft} ms)` })
      else tests.push(t)
    }
  }
  return checkResult(tests)
}

async function runPy(problem, mode, code, customInput) {
  const { lines, error } = await runPython(buildCode(code, problem, 'python', mode, customInput))
  const out = lines.filter(l => l.cls === 'stdout')
  if (mode === 'custom') {
    if (error) return fault('Python error', error)
    return { kind: 'custom', raw: printedText(out) }
  }
  const parsed = parseOutput(out)
  if (!parsed.tests.length && error) return fault('Python error', error)
  return fromOutput(problem, mode, out, error)
}

// Shared by C++ and Python: build `res` from the printed lines of a Run or a Python Submit.
function fromOutput(problem, mode, lines, error = null) {
  const parsed = parseOutput(lines)
  if (mode === 'custom') return { kind: 'custom', raw: printedText(lines) }
  if (mode === 'run') {
    const t = graded(problem, 0, parsed.tests[0], lines)
    return { kind: 'run', test: { ...t, printed: '' }, raw: printedOf(lines, parsed) || undefined, showGot: true }
  }
  const n = problem.submitTestCount ?? problem.testCases.length
  const tests = Array.from({ length: n }, (_, i) => {
    const line = parsed.tests.find(x => x.n === i + 1)
    return line || !error ? graded(problem, i, line, lines) : { name: nameOf(problem, i), status: 'skipped' }
  })
  return checkResult(tests)
}

const checkResult = tests => ({ kind: 'check', tests, win: tests.every(t => t.status === 'ok') })

// mode: 'run' | 'custom' | 'submit'. Never throws: failures come back as an error result.
export async function runProblem({ problem, language, mode, code, customInput }) {
  try {
    return language === 'python'
      ? await runPy(problem, mode, code, customInput)
      : await runCpp(problem, mode, code, customInput)
  } catch (err) {
    return fault('Something went wrong', String(err?.message ?? err))
  }
}
