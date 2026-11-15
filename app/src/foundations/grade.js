// Pure helpers shared by the app and scripts/verify-foundations.mjs.
// Keep this file free of browser and React imports so Node can load it.
import { CPP_DSA_PREAMBLE, CPP_WASM_SHIM } from '../runtime/executor.js'

// Harness code prints this on its own line before the graded result.
// Anything the learner prints before it is shown to them but not graded.
export const RESULT_MARK = '@@RESULT@@'

// The exact C++ source sent to the compiler for a lesson.
// 'program' lessons get nothing added in front: the learner writes includes and main().
// CPP_WASM_SHIM goes after the learner's code, so their line numbers are unchanged.
export function assembleSource(lesson, userCode) {
  if (lesson.kind === 'program') return userCode + '\n' + CPP_WASM_SHIM
  return CPP_DSA_PREAMBLE + '\n' + userCode + '\n' + lesson.harness + '\n' + CPP_WASM_SHIM
}

export const normalise = s =>
  String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim()

// Split stdout into what the learner printed and what gets graded.
export function splitOutput(lesson, stdout) {
  if (lesson.kind === 'program') return { printed: '', result: stdout }
  const at = stdout.lastIndexOf(RESULT_MARK)
  if (at < 0) return { printed: stdout, result: '' }
  return { printed: stdout.slice(0, at), result: stdout.slice(at + RESULT_MARK.length) }
}

export function judge(lesson, test, stdout) {
  const { printed, result } = splitOutput(lesson, stdout)
  const got = normalise(result)
  return { pass: got === normalise(test.expected), got, printed: normalise(printed) }
}

const stripComments = code => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

// Returns the message of the first forbidden pattern found in the learner's code, or null.
export function forbiddenHit(lesson, userCode) {
  const code = stripComments(userCode)
  for (const f of lesson.forbidden ?? []) if (new RegExp(f.pattern).test(code)) return f.message
  return null
}
