// DSA-complete C++ includes for wasm-clang (no bits/stdc++.h — Clang sysroot only)
export const CPP_DSA_PREAMBLE = `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <algorithm>
#include <numeric>
#include <climits>
#include <cmath>
#include <queue>
#include <stack>
#include <deque>
#include <functional>
#include <sstream>
#include <utility>
#include <iomanip>
#include <list>
using namespace std;
`

// The bundled wasm libc++ references a long-double comparison helper that the sysroot's
// runtime library does not provide, so any program using std::sort on built-in types
// (e.g. sort(v.begin(), v.end()) on ints) failed to link. Supplying it here fixes that.
export const CPP_WASM_SHIM = `
#ifdef __wasm__
extern "C" int __lttf2(long double a, long double b) {
    unsigned long long x[2], y[2];
    __builtin_memcpy(x, &a, 16);
    __builtin_memcpy(y, &b, 16);
    bool zeroA = ((x[1] << 1) | x[0]) == 0, zeroB = ((y[1] << 1) | y[0]) == 0;
    if (zeroA && zeroB) return 0;
    bool negA = x[1] >> 63, negB = y[1] >> 63;
    if (negA != negB) return negA ? -1 : 1;
    int c = x[1] != y[1] ? (x[1] < y[1] ? -1 : 1) : (x[0] != y[0] ? (x[0] < y[0] ? -1 : 1) : 0);
    return negA ? -c : c;
}
#endif
`

// Wraps user's Solution class with a test harness for execution.
// Returns the full code string ready to send to Pyodide or wasm-clang.

export function buildCode(userCode, problem, language, mode, customInput = '') {
  if (language === 'cpp') return buildCpp(userCode, problem, mode, customInput)
  return buildPython(userCode, problem, mode, customInput)
}

function buildCpp(userCode, problem, mode, customInput) {
  // Strip bits/stdc++.h (GCC-only, not in Clang sysroot) and user-facing includes
  // (starters no longer show includes; we always prepend the DSA preamble)
  const cleaned = userCode
    .replace(/#include\s*<bits\/stdc\+\+\.h>\s*\n?/g, '')
    .replace(/#include\s*<\w[^>]*>\s*\n?/g, '')
    .replace(/using\s+namespace\s+std\s*;\s*\n?/g, '')
    .trimStart()
  const harness = problem.buildCppHarness(mode, customInput) ?? ''
  return CPP_DSA_PREAMBLE + '\n' + cleaned + '\n' + harness + '\n' + CPP_WASM_SHIM
}

function buildPython(userCode, problem, mode, customInput) {
  const harness = problem.buildPythonHarness(mode, customInput) ?? ''
  return userCode + '\n' + harness
}

// Compiles + links code into a stored wasm module (no run).
// Returns true on success, false on error (error lines pushed via push).
export async function compileLinkOnly(state, msgIdRef, code, push) {
  if (!state) { push('wasm-clang not ready.\n', 'warn'); return false }
  const msgId = String(++msgIdRef.current)
  const stripAnsi = s => s.replace(/\x1b\[[0-9;]*m/g, '')
  let rawText = ''
  state.onWrite = s => { rawText += stripAnsi(s) }

  const result = await new Promise(resolve => {
    state.handlers[msgId] = resolve
    state.port.postMessage({ id: 'compileLinkOnly', data: code, responseId: msgId })
  })
  state.onWrite = null

  if (result.error) {
    const errLines = rawText.split('\n').filter(l => !l.startsWith('> clang') && !l.startsWith('> wasm-ld'))
    push(errLines.join('\n').trim() + '\n', 'stderr')
    return false
  }
  return true
}

// Runs the previously compiled wasm module with the given stdin string.
// Program output lines are pushed via push.
export async function runWasm(state, msgIdRef, stdin, push) {
  if (!state) { push('wasm-clang not ready.\n', 'warn'); return }
  const msgId = String(++msgIdRef.current)
  const stripAnsi = s => s.replace(/\x1b\[[0-9;]*m/g, '')
  let rawText = ''
  state.onWrite = s => { rawText += stripAnsi(s) }

  const result = await new Promise(resolve => {
    state.handlers[msgId] = resolve
    state.port.postMessage({ id: 'runWasm', stdin, responseId: msgId })
  })
  state.onWrite = null

  if (result.error) {
    push('[Runtime Error] ' + result.error + '\n', 'stderr')
    return
  }

  const programLines = rawText.split('\n').filter(l => !l.startsWith('>'))
  while (programLines.length && !programLines[programLines.length - 1].trim()) programLines.pop()
  while (programLines.length && !programLines[0].trim()) programLines.shift()
  for (const line of programLines) push(line + '\n', 'stdout')
}

// Parses harness output split by the ---RESULT--- sentinel.
// Each element of `lines` is { text: string, cls: string } where text is one line + \n.
// Returns { outputLines, tests, summary } where:
//   outputLines — lines before the sentinel (user program output)
//   tests       — [{ n, passed, expected, got }]
//   summary     — { passed, total } | null  (submit mode only)
export function parseOutput(lines) {
  const sentinelIdx = lines.findIndex(l => l.text.includes('---RESULT---'))
  let outputLines = sentinelIdx >= 0 ? lines.slice(0, sentinelIdx) : lines
  // Handle case where user omitted endl: "val---RESULT---" ends up on one line
  if (sentinelIdx >= 0) {
    const sl = lines[sentinelIdx]
    const prefix = sl.text.slice(0, sl.text.indexOf('---RESULT---')).trimEnd()
    if (prefix) outputLines = [...outputLines, { text: prefix + '\n', cls: sl.cls }]
  }
  const resultLines = sentinelIdx >= 0 ? lines.slice(sentinelIdx + 1) : []

  const tests = []
  let summary = null

  for (const { text } of resultLines) {
    const t = text.trim()
    const mTest = t.match(/^TEST:(\d+):(PASS|FAIL):(.+):(.+)$/)
    if (mTest) {
      tests.push({ n: parseInt(mTest[1]), passed: mTest[2] === 'PASS', expected: mTest[3], got: mTest[4] })
      continue
    }
    const mResult = t.match(/^RESULT:(PASS|FAIL):(.+):(.+)$/)
    if (mResult) {
      tests.push({ n: 1, passed: mResult[1] === 'PASS', expected: mResult[2], got: mResult[3] })
      continue
    }
    const mSum = t.match(/^SUMMARY:(\d+):(\d+)$/)
    if (mSum) summary = { passed: parseInt(mSum[1]), total: parseInt(mSum[2]) }
  }

  return { outputLines, tests, summary }
}
