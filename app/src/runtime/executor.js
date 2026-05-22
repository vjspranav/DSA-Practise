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
using namespace std;
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
  return CPP_DSA_PREAMBLE + '\n' + cleaned + '\n' + harness
}

function buildPython(userCode, problem, mode, customInput) {
  const harness = problem.buildPythonHarness(mode, customInput) ?? ''
  return userCode + '\n' + harness
}

// Parses harness output split by the ---RESULT--- sentinel.
// Each element of `lines` is { text: string, cls: string } where text is one line + \n.
// Returns { outputLines, tests, summary } where:
//   outputLines — lines before the sentinel (user program output)
//   tests       — [{ n, passed, expected, got }]
//   summary     — { passed, total } | null  (submit mode only)
export function parseOutput(lines) {
  const sentinelIdx = lines.findIndex(l => l.text.trim() === '---RESULT---')
  const outputLines = sentinelIdx >= 0 ? lines.slice(0, sentinelIdx) : lines
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
