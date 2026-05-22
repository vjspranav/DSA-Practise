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

// ── Parse submit output into structured test results ───────────────────────
// Looks for lines starting with ✓ or ✗ and a summary "N/M tests passed" line.
export function parseSubmitOutput(lines) {
  const results = []
  let summary = null

  for (const { text } of lines) {
    const t = text.trimEnd()
    if (t.startsWith('✓') || t.startsWith('✗')) {
      results.push({ passed: t.startsWith('✓'), text: t.slice(2).trim() })
    }
    const m = t.match(/(\d+)\/(\d+) tests passed/)
    if (m) summary = { passed: parseInt(m[1]), total: parseInt(m[2]) }
  }

  return { results, summary }
}
