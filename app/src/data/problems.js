// ── Problem definitions ────────────────────────────────────────────────────
// Each problem has:
//   id, title, difficulty, description, examples, constraints, hints
//   cppStarter, pythonStarter
//   testCases (shown in UI)
//   buildCppHarness(mode, customInput) → string appended after user code
//   buildPythonHarness(mode, customInput) → string appended after user code

const p = (arr) => arr.join(', ')   // array → C++ brace init contents

// wasm-clang uses Clang sysroot (no bits/stdc++.h) — explicit DSA headers
const CPP_INCLUDES = `#include <iostream>
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
using namespace std;`

// ── 1. Binary Subarrays With Sum ────────────────────────────────────────────
const binarySubarrays = {
  id: 'binary-subarrays-sum',
  title: 'Binary Subarrays With Sum',
  difficulty: 'Medium',
  category: 'Sliding Window',
  description: [
    'Given a binary array <code>nums</code> and an integer <code>goal</code>, return the number of non-empty subarrays with a sum equal to <code>goal</code>.',
    'A <strong>subarray</strong> is a contiguous part of the array.',
  ],
  examples: [
    {
      input: 'nums = [1,0,1,0,1],  goal = 2',
      output: '4',
      explanation: 'The 4 subarrays are bolded: [<b>1,0,1</b>,0,1], [<b>1,0,1,0</b>,1], [1,<b>0,1,0,1</b>], [1,0,<b>1,0,1</b>].',
    },
    {
      input: 'nums = [0,0,0,0,0],  goal = 0',
      output: '15',
      explanation: 'Every subarray has sum 0. There are n×(n+1)/2 = 15 subarrays total.',
    },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 3 × 10⁴',
    'nums[i] is either 0 or 1',
    '0 ≤ goal ≤ nums.length',
  ],
  hints: [
    'Counting subarrays with an <em>exact</em> sum is tricky. Try converting it: exact(k) = atMost(k) − atMost(k − 1).',
    'Implement <code>atMost(k)</code> with a sliding window: expand right, shrink left whenever <code>sum > k</code>. At each right pointer, add <code>right − left + 1</code> to the count.',
    'Handle the edge case where <code>goal = 0</code> by calling <code>atMost(−1)</code> carefully — or guard the subtraction.',
  ],
  inputFormat: 'Line 1: space-separated 0s and 1s\nLine 2: goal (integer)',
  defaultCustomInput: '1 0 1 0 1\n2',
  testCases: [
    { label: 'Example 1', input: 'nums=[1,0,1,0,1], goal=2', expected: '4' },
    { label: 'Example 2', input: 'nums=[0,0,0,0,0], goal=0', expected: '15' },
    { label: 'All ones', input: 'nums=[1,1,1,1], goal=2', expected: '3' },
    { label: 'Mixed', input: 'nums=[1,0,0,1,1], goal=2', expected: '4' },
  ],
  cppStarter: `class Solution {
public:
    int numSubarraysWithSum(vector<int>& nums, int goal) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def numSubarraysWithSum(self, nums: List[int], goal: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> nums = {1, 0, 1, 0, 1};
    int goal = 2;
    int got = sol.numSubarraysWithSum(nums, goal);
    cout << got << "\\n";
    cout << (got == 4 ? "✓ Matches expected (4)" : "✗ Expected 4, got " + to_string(got)) << "\\n";
    return 0;
}`;
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    auto chk = [&](vector<int> nums, int goal, int expected, int n) {
        int got = sol.numSubarraysWithSum(nums, goal);
        bool ok = got == expected;
        passed += ok;
        if (ok) cout << "✓ Test " << n << ": passed\\n";
        else     cout << "✗ Test " << n << ": FAILED — expected: " << expected << ", got: " << got << "\\n";
    };
    chk({1,0,1,0,1}, 2, 4, 1);
    chk({0,0,0,0,0}, 0, 15, 2);
    chk({1,1,1,1},   2, 3,  3);
    chk({1,0,0,1,1}, 2, 4,  4);
    cout << "\\n" << passed << "/" << total << " tests passed\\n";
    return passed == total ? 0 : 1;
}`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const nums = (lines[0] || '1 0 1 0 1').trim().split(/\s+/).filter(Boolean).map(Number);
      const goal = parseInt(lines[1] ?? '2');
      return `
int main() {
    Solution sol;
    vector<int> nums = {${p(nums)}};
    int goal = ${goal};
    cout << sol.numSubarraysWithSum(nums, goal) << "\\n";
    return 0;
}`;
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
# ── Run (Example 1) ──
sol = Solution()
got = sol.numSubarraysWithSum([1,0,1,0,1], 2)
print(got)
print("✓ Matches expected (4)" if got == 4 else f"✗ Expected 4, got {got}")`;
    if (mode === 'submit') return `
# ── Submit ──
sol = Solution()
cases = [
    ([1,0,1,0,1], 2, 4),
    ([0,0,0,0,0], 0, 15),
    ([1,1,1,1],   2, 3),
    ([1,0,0,1,1], 2, 4),
]
passed = 0
for i, (nums, goal, expected) in enumerate(cases, 1):
    got = sol.numSubarraysWithSum(list(nums), goal)
    ok  = got == expected
    passed += ok
    print(f"{'✓' if ok else '✗'} Test {i}: {'passed' if ok else f'FAILED — expected: {expected}, got: {got}'}")
print(f"\\n{passed}/{len(cases)} tests passed")`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const nums = (lines[0] || '1 0 1 0 1').trim().split(/\s+/).filter(Boolean).map(Number);
      const goal = parseInt(lines[1] ?? '2');
      return `
# ── Custom Run ──
sol = Solution()
print(sol.numSubarraysWithSum([${nums.join(', ')}], ${goal}))`;
    }
  },
}

// ── 2. Maximum Points You Can Obtain from Cards ─────────────────────────────
const maxCards = {
  id: 'max-cards',
  title: 'Maximum Points You Can Obtain from Cards',
  difficulty: 'Medium',
  category: 'Sliding Window',
  description: [
    'There are several cards arranged in a row, each with an associated number of points given in <code>cardPoints</code>.',
    'In one step, you can take one card from the <strong>beginning</strong> or from the <strong>end</strong> of the row. You have to take exactly <code>k</code> cards.',
    'Return the <strong>maximum score</strong> you can obtain.',
  ],
  examples: [
    {
      input: 'cardPoints = [1,2,3,4,5,6,1],  k = 3',
      output: '12',
      explanation: 'Take the three cards from the right: 6 + 5 + 1 = 12. (Taking from left gives at most 1+2+3 = 6.)',
    },
    {
      input: 'cardPoints = [2,2,2],  k = 2',
      output: '4',
      explanation: 'Regardless of which two cards you take, the score is 4.',
    },
  ],
  constraints: [
    '1 ≤ cardPoints.length ≤ 10⁵',
    '1 ≤ cardPoints[i] ≤ 10⁴',
    '1 ≤ k ≤ cardPoints.length',
  ],
  hints: [
    'Instead of deciding which cards to take, think about which cards you are <em>leaving behind</em>.',
    'You always leave a contiguous subarray of length <code>n − k</code>. To maximize the cards you take, minimize this middle window\'s sum.',
    'Use a fixed-size sliding window of size <code>n − k</code>. Track the minimum window sum, then answer = totalSum − minWindowSum.',
  ],
  inputFormat: 'Line 1: space-separated card points\nLine 2: k (integer)',
  defaultCustomInput: '1 2 3 4 5 6 1\n3',
  testCases: [
    { label: 'Example 1', input: 'cardPoints=[1,2,3,4,5,6,1], k=3', expected: '12' },
    { label: 'Example 2', input: 'cardPoints=[2,2,2], k=2', expected: '4' },
    { label: 'Take all', input: 'cardPoints=[9,7,7,9,7,7,9], k=7', expected: '55' },
    { label: 'k=1 endpoints', input: 'cardPoints=[1,1000,1], k=1', expected: '1' },
  ],
  cppStarter: `class Solution {
public:
    int maxScore(vector<int>& cardPoints, int k) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def maxScore(self, cardPoints: List[int], k: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> pts = {1, 2, 3, 4, 5, 6, 1};
    int k = 3;
    int got = sol.maxScore(pts, k);
    cout << got << "\\n";
    cout << (got == 12 ? "✓ Matches expected (12)" : "✗ Expected 12, got " + to_string(got)) << "\\n";
    return 0;
}`;
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    auto chk = [&](vector<int> pts, int k, int expected, int n) {
        int got = sol.maxScore(pts, k);
        bool ok = got == expected;
        passed += ok;
        if (ok) cout << "✓ Test " << n << ": passed\\n";
        else     cout << "✗ Test " << n << ": FAILED — expected: " << expected << ", got: " << got << "\\n";
    };
    chk({1,2,3,4,5,6,1}, 3, 12, 1);
    chk({2,2,2},          2, 4,  2);
    chk({9,7,7,9,7,7,9},  7, 55, 3);
    chk({1,1000,1},        1, 1,  4);
    cout << "\\n" << passed << "/" << total << " tests passed\\n";
    return passed == total ? 0 : 1;
}`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const pts = (lines[0] || '1 2 3 4 5 6 1').trim().split(/\s+/).filter(Boolean).map(Number);
      const k = parseInt(lines[1] ?? '3');
      return `
int main() {
    Solution sol;
    vector<int> pts = {${p(pts)}};
    int k = ${k};
    cout << sol.maxScore(pts, k) << "\\n";
    return 0;
}`;
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
# ── Run (Example 1) ──
sol = Solution()
got = sol.maxScore([1,2,3,4,5,6,1], 3)
print(got)
print("✓ Matches expected (12)" if got == 12 else f"✗ Expected 12, got {got}")`;
    if (mode === 'submit') return `
# ── Submit ──
sol = Solution()
cases = [
    ([1,2,3,4,5,6,1], 3, 12),
    ([2,2,2],          2, 4),
    ([9,7,7,9,7,7,9],  7, 55),
    ([1,1000,1],        1, 1),
]
passed = 0
for i, (pts, k, expected) in enumerate(cases, 1):
    got = sol.maxScore(list(pts), k)
    ok  = got == expected
    passed += ok
    print(f"{'✓' if ok else '✗'} Test {i}: {'passed' if ok else f'FAILED — expected: {expected}, got: {got}'}")
print(f"\\n{passed}/{len(cases)} tests passed")`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const pts = (lines[0] || '1 2 3 4 5 6 1').trim().split(/\s+/).filter(Boolean).map(Number);
      const k = parseInt(lines[1] ?? '3');
      return `
# ── Custom Run ──
sol = Solution()
print(sol.maxScore([${pts.join(', ')}], ${k}))`;
    }
  },
}

// ── 3. Subarrays with K Different Integers ──────────────────────────────────
const kDistinct = {
  id: 'k-distinct-integers',
  title: 'Subarrays with K Different Integers',
  difficulty: 'Hard',
  category: 'Sliding Window',
  description: [
    'Given an integer array <code>nums</code> and an integer <code>k</code>, return the number of <strong>good subarrays</strong> of <code>nums</code>.',
    'A <strong>good subarray</strong> is one where the number of <em>distinct</em> integers is exactly <code>k</code>.',
  ],
  examples: [
    {
      input: 'nums = [1,2,1,2,3],  k = 2',
      output: '7',
      explanation: 'Subarrays with exactly 2 distinct: [1,2], [2,1], [1,2,1], [2,1,2], [1,2,1,2], [2,3], [1,2,3] — wait, seven of them.',
    },
    {
      input: 'nums = [1,2,1,3,4],  k = 3',
      output: '3',
      explanation: 'Subarrays with exactly 3 distinct: [1,2,1,3], [2,1,3], [1,3,4].',
    },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 2 × 10⁴',
    '1 ≤ nums[i] ≤ nums.length',
    '1 ≤ k ≤ nums.length',
  ],
  hints: [
    'Exactly K distinct = atMost(K) − atMost(K − 1). Same trick as Binary Subarrays.',
    'Implement <code>atMost(k)</code>: use a frequency map. Expand right; when distinct count exceeds k, shrink left and remove elements from the map.',
    'At each right pointer, <code>right − left + 1</code> counts all subarrays ending at right with ≤ k distinct elements.',
  ],
  inputFormat: 'Line 1: space-separated integers\nLine 2: k (integer)',
  defaultCustomInput: '1 2 1 2 3\n2',
  testCases: [
    { label: 'Example 1', input: 'nums=[1,2,1,2,3], k=2', expected: '7' },
    { label: 'Example 2', input: 'nums=[1,2,1,3,4], k=3', expected: '3' },
    { label: 'Single element', input: 'nums=[1], k=1', expected: '1' },
    { label: 'All same', input: 'nums=[1,1,1,1,1], k=1', expected: '15' },
  ],
  cppStarter: `class Solution {
public:
    int subarraysWithKDistinct(vector<int>& nums, int k) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def subarraysWithKDistinct(self, nums: List[int], k: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> nums = {1, 2, 1, 2, 3};
    int k = 2;
    int got = sol.subarraysWithKDistinct(nums, k);
    cout << got << "\\n";
    cout << (got == 7 ? "✓ Matches expected (7)" : "✗ Expected 7, got " + to_string(got)) << "\\n";
    return 0;
}`;
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    auto chk = [&](vector<int> nums, int k, int expected, int n) {
        int got = sol.subarraysWithKDistinct(nums, k);
        bool ok = got == expected;
        passed += ok;
        if (ok) cout << "✓ Test " << n << ": passed\\n";
        else     cout << "✗ Test " << n << ": FAILED — expected: " << expected << ", got: " << got << "\\n";
    };
    chk({1,2,1,2,3},     2, 7,  1);
    chk({1,2,1,3,4},     3, 3,  2);
    chk({1},             1, 1,  3);
    chk({1,1,1,1,1},     1, 15, 4);
    cout << "\\n" << passed << "/" << total << " tests passed\\n";
    return passed == total ? 0 : 1;
}`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const nums = (lines[0] || '1 2 1 2 3').trim().split(/\s+/).filter(Boolean).map(Number);
      const k = parseInt(lines[1] ?? '2');
      return `
int main() {
    Solution sol;
    vector<int> nums = {${p(nums)}};
    int k = ${k};
    cout << sol.subarraysWithKDistinct(nums, k) << "\\n";
    return 0;
}`;
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
# ── Run (Example 1) ──
sol = Solution()
got = sol.subarraysWithKDistinct([1,2,1,2,3], 2)
print(got)
print("✓ Matches expected (7)" if got == 7 else f"✗ Expected 7, got {got}")`;
    if (mode === 'submit') return `
# ── Submit ──
sol = Solution()
cases = [
    ([1,2,1,2,3],   2, 7),
    ([1,2,1,3,4],   3, 3),
    ([1],           1, 1),
    ([1,1,1,1,1],   1, 15),
]
passed = 0
for i, (nums, k, expected) in enumerate(cases, 1):
    got = sol.subarraysWithKDistinct(list(nums), k)
    ok  = got == expected
    passed += ok
    print(f"{'✓' if ok else '✗'} Test {i}: {'passed' if ok else f'FAILED — expected: {expected}, got: {got}'}")
print(f"\\n{passed}/{len(cases)} tests passed")`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const nums = (lines[0] || '1 2 1 2 3').trim().split(/\s+/).filter(Boolean).map(Number);
      const k = parseInt(lines[1] ?? '2');
      return `
# ── Custom Run ──
sol = Solution()
print(sol.subarraysWithKDistinct([${nums.join(', ')}], ${k}))`;
    }
  },
}

// ── 4. Minimum Window Subsequence ───────────────────────────────────────────
const minWindowSubseq = {
  id: 'min-window-subseq',
  title: 'Minimum Window Subsequence',
  difficulty: 'Hard',
  category: 'Two Pointers',
  description: [
    'Given strings <code>s</code> and <code>t</code>, return the minimum contiguous substring of <code>s</code> such that <code>t</code> appears as a <strong>subsequence</strong> of that substring.',
    'If there is no such window, return <code>""</code>. If there are multiple minimum-length windows, return the one with the <strong>left-most starting index</strong>.',
  ],
  examples: [
    {
      input: 's = "abcdebdde",  t = "bde"',
      output: '"bcde"',
      explanation: '"bcde" (length 4) is shorter than "bdde" (length 4, same length but starts later). Both contain "bde" as a subsequence.',
    },
    {
      input: 's = "jmeqksfrcdcmsarqjssrqnmjgcgxabegksnfhxekrzq",  t = "sf"',
      output: '"sfrcdcmsarqjssrqnmjgcgxabegksnf"',
      explanation: 'Find the shortest window where s and f appear in order as a subsequence.',
    },
  ],
  constraints: [
    '1 ≤ s.length ≤ 2 × 10⁴',
    '1 ≤ t.length ≤ 100',
    's and t consist of lowercase English letters',
  ],
  hints: [
    'Use two pointers: scan s forward to find the first window that contains t as a subsequence (extend right until all of t is matched).',
    'Once you have a valid window end, scan <em>backward</em> from that end to minimize the window start. This gives the shortest window ending at that position.',
    'Record the minimum window found. Then advance the start pointer by 1 and repeat the forward scan. O(|s| × |t|) overall.',
  ],
  inputFormat: 'Line 1: s (string)\nLine 2: t (string)',
  defaultCustomInput: 'abcdebdde\nbde',
  testCases: [
    { label: 'Example 1', input: 's="abcdebdde", t="bde"', expected: '"bcde"' },
    { label: 'End match', input: 's="xyzabc", t="abc"', expected: '"abc"' },
    { label: 'Same string', input: 's="aa", t="aa"', expected: '"aa"' },
    { label: 'Long search', input: 's="fgrqsqsnodwmxzkzxwqegkndaa", t="kzed"', expected: '"kzxwqegknd"' },
  ],
  cppStarter: `class Solution {
public:
    string minWindow(string s, string t) {

    }
};`,
  pythonStarter: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    string got = sol.minWindow("abcdebdde", "bde");
    cout << "\\"" << got << "\\"" << "\\n";
    cout << (got == "bcde" ? "✓ Matches expected (\\"bcde\\")" : "✗ Expected \\"bcde\\", got \\"" + got + "\\"") << "\\n";
    return 0;
}`;
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    auto chk = [&](string s, string t, string expected, int n) {
        string got = sol.minWindow(s, t);
        bool ok = got == expected;
        passed += ok;
        if (ok) cout << "✓ Test " << n << ": passed\\n";
        else     cout << "✗ Test " << n << ": FAILED — expected: \\"" << expected << "\\", got: \\"" << got << "\\"\\n";
    };
    chk("abcdebdde",                  "bde",  "bcde",       1);
    chk("xyzabc",                     "abc",  "abc",        2);
    chk("aa",                         "aa",   "aa",         3);
    chk("fgrqsqsnodwmxzkzxwqegkndaa", "kzed", "kzxwqegknd", 4);
    cout << "\\n" << passed << "/" << total << " tests passed\\n";
    return passed == total ? 0 : 1;
}`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const s = (lines[0] || 'abcdebdde').trim();
      const t = (lines[1] || 'bde').trim();
      return `
int main() {
    Solution sol;
    cout << "\\"" << sol.minWindow("${s}", "${t}") << "\\"" << "\\n";
    return 0;
}`;
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
# ── Run (Example 1) ──
sol = Solution()
got = sol.minWindow("abcdebdde", "bde")
print(f'"{got}"')
print('✓ Matches expected ("bcde")' if got == "bcde" else f'✗ Expected "bcde", got "{got}"')`;
    if (mode === 'submit') return `
# ── Submit ──
sol = Solution()
cases = [
    ("abcdebdde",                  "bde",  "bcde"),
    ("xyzabc",                     "abc",  "abc"),
    ("aa",                         "aa",   "aa"),
    ("fgrqsqsnodwmxzkzxwqegkndaa", "kzed", "kzxwqegknd"),
]
passed = 0
for i, (s, t, expected) in enumerate(cases, 1):
    got = sol.minWindow(s, t)
    ok  = got == expected
    passed += ok
    print(f"{'✓' if ok else '✗'} Test {i}: {'passed' if ok else f'FAILED — expected: \"{expected}\", got: \"{got}\"'}")
print(f"\\n{passed}/{len(cases)} tests passed")`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const s = (lines[0] || 'abcdebdde').trim();
      const t = (lines[1] || 'bde').trim();
      return `
# ── Custom Run ──
sol = Solution()
got = sol.minWindow("${s}", "${t}")
print(f'"{got}"')`;
    }
  },
}

export const PROBLEMS = [binarySubarrays, maxCards, kDistinct, minWindowSubseq]
