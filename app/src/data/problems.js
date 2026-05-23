// ── Problem definitions ─────────────────────────────────────────────────────
//
// Output protocol (parsed by executor.parseOutput):
//   Program output lines (cout / print) come first.
//   Then a sentinel line:  ---RESULT---
//   Then structured judgement lines:
//     Run:    RESULT:PASS:expected:got  or  RESULT:FAIL:expected:got
//     Submit: TEST:N:PASS:expected:got  or  TEST:N:FAIL:expected:got
//     Submit: SUMMARY:passed:total  (last line)
//
// Custom mode: no sentinel, raw output only.

const join = (arr) => arr.join(', ')   // JS array → C++ brace-init contents

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
      explanation: 'Each highlighted window below sums to 2.',
      visualization: {
        type: 'array-windows',
        array: [1, 0, 1, 0, 1],
        windows: [
          { range: [0, 2], color: 'teal',  label: 'sum = 2' },
          { range: [0, 3], color: 'blue',  label: 'sum = 2' },
          { range: [1, 4], color: 'mauve', label: 'sum = 2' },
          { range: [2, 4], color: 'peach', label: 'sum = 2' },
        ],
        caption: '4 non-overlapping windows — all sum to goal = 2',
      },
    },
    {
      input: 'nums = [0,0,0,0,0],  goal = 0',
      output: '15',
      explanation: 'Every subarray has sum 0. There are n×(n+1)/2 = 15 total subarrays.',
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
    'Handle the edge case where <code>goal = 0</code>: <code>atMost(−1)</code> should return 0, so guard before calling.',
  ],
  inputFormat: 'Line 1: space-separated 0s and 1s\nLine 2: goal (integer)',
  defaultCustomInput: '1 0 1 0 1\n2',
  testCases: [
    { label: 'Example 1', input: 'nums=[1,0,1,0,1], goal=2', expected: '4' },
    { label: 'Example 2', input: 'nums=[0,0,0,0,0], goal=0', expected: '15' },
    { label: 'All ones',  input: 'nums=[1,1,1,1], goal=2',   expected: '3' },
    { label: 'Mixed',     input: 'nums=[1,0,0,1,1], goal=2', expected: '4' },
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
    cout << "\\n---RESULT---\\n";
    if (got == 4) cout << "RESULT:PASS:4:" << got << "\\n";
    else          cout << "RESULT:FAIL:4:" << got << "\\n";
    return 0;
}`;
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    cout << "\\n---RESULT---\\n";
    auto chk = [&](vector<int> nums, int goal, int expected, int n) {
        int got = sol.numSubarraysWithSum(nums, goal);
        bool ok = got == expected;
        passed += ok;
        cout << "TEST:" << n << (ok ? ":PASS:" : ":FAIL:") << expected << ":" << got << "\\n";
    };
    chk({1,0,1,0,1}, 2, 4,  1);
    chk({0,0,0,0,0}, 0, 15, 2);
    chk({1,1,1,1},   2, 3,  3);
    chk({1,0,0,1,1}, 2, 4,  4);
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const nums = (lines[0] || '1 0 1 0 1').trim().split(/\s+/).filter(Boolean).map(Number);
      const goal = parseInt(lines[1] ?? '2');
      return `
int main() {
    Solution sol;
    vector<int> nums = {${join(nums)}};
    int goal = ${goal};
    cout << sol.numSubarraysWithSum(nums, goal) << "\\n";
    return 0;
}`;
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
# run
sol = Solution()
got = sol.numSubarraysWithSum([1,0,1,0,1], 2)
print("\n---RESULT---")
print(f"RESULT:{'PASS' if got == 4 else 'FAIL'}:4:{got}")`;
    if (mode === 'submit') return `
# submit
sol = Solution()
cases = [([1,0,1,0,1],2,4),([0,0,0,0,0],0,15),([1,1,1,1],2,3),([1,0,0,1,1],2,4)]
passed = 0
print("\n---RESULT---")
for i,(nums,goal,exp) in enumerate(cases,1):
    got=sol.numSubarraysWithSum(list(nums),goal); ok=got==exp; passed+=ok
    print(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print(f"SUMMARY:{passed}:{len(cases)}")`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const nums = (lines[0] || '1 0 1 0 1').trim().split(/\s+/).filter(Boolean).map(Number);
      const goal = parseInt(lines[1] ?? '2');
      return `
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
    'In one step, you can take one card from the <strong>beginning</strong> or the <strong>end</strong> of the row. You must take exactly <code>k</code> cards.',
    'Return the <strong>maximum score</strong> you can obtain.',
  ],
  examples: [
    {
      input: 'cardPoints = [1,2,3,4,5,6,1],  k = 3',
      output: '12',
      explanation: 'Take 1 from the left and 2 from the right — teal cards are selected, middle is skipped.',
      visualization: {
        type: 'array-ends',
        array: [1, 2, 3, 4, 5, 6, 1],
        leftCount: 1,
        rightCount: 2,
        caption: '1 + 6 + 1 = 12 (maximum possible with k = 3)',
      },
    },
    {
      input: 'cardPoints = [2,2,2],  k = 2',
      output: '4',
      explanation: 'Any 2 cards give score 4.',
    },
  ],
  constraints: [
    '1 ≤ cardPoints.length ≤ 10⁵',
    '1 ≤ cardPoints[i] ≤ 10⁴',
    '1 ≤ k ≤ cardPoints.length',
  ],
  hints: [
    'Instead of choosing which cards to <em>take</em>, think about which subarray you are <em>leaving behind</em>.',
    'You always leave a contiguous subarray of length <code>n − k</code>. Minimising that window\'s sum maximises your score.',
    'Use a fixed-size sliding window of length <code>n − k</code>. Track its minimum sum, then answer = totalSum − minWindowSum.',
  ],
  inputFormat: 'Line 1: space-separated card points\nLine 2: k (integer)',
  defaultCustomInput: '1 2 3 4 5 6 1\n3',
  testCases: [
    { label: 'Example 1',    input: 'cardPoints=[1,2,3,4,5,6,1], k=3', expected: '12' },
    { label: 'Example 2',    input: 'cardPoints=[2,2,2], k=2',          expected: '4'  },
    { label: 'Take all',     input: 'cardPoints=[9,7,7,9,7,7,9], k=7', expected: '55' },
    { label: 'k=1 boundary', input: 'cardPoints=[1,1000,1], k=1',       expected: '1'  },
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
    vector<int> pts = {1,2,3,4,5,6,1};
    int k = 3;
    int got = sol.maxScore(pts, k);
    cout << "\\n---RESULT---\\n";
    if (got == 12) cout << "RESULT:PASS:12:" << got << "\\n";
    else           cout << "RESULT:FAIL:12:" << got << "\\n";
    return 0;
}`;
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    cout << "\\n---RESULT---\\n";
    auto chk = [&](vector<int> pts, int k, int expected, int n) {
        int got = sol.maxScore(pts, k);
        bool ok = got == expected;
        passed += ok;
        cout << "TEST:" << n << (ok ? ":PASS:" : ":FAIL:") << expected << ":" << got << "\\n";
    };
    chk({1,2,3,4,5,6,1}, 3, 12, 1);
    chk({2,2,2},          2, 4,  2);
    chk({9,7,7,9,7,7,9},  7, 55, 3);
    chk({1,1000,1},        1, 1,  4);
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const pts = (lines[0] || '1 2 3 4 5 6 1').trim().split(/\s+/).filter(Boolean).map(Number);
      const k = parseInt(lines[1] ?? '3');
      return `
int main() {
    Solution sol;
    vector<int> pts = {${join(pts)}};
    int k = ${k};
    cout << sol.maxScore(pts, k) << "\\n";
    return 0;
}`;
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.maxScore([1,2,3,4,5,6,1], 3)
print("\n---RESULT---")
print(f"RESULT:{'PASS' if got == 12 else 'FAIL'}:12:{got}")`;
    if (mode === 'submit') return `
sol = Solution()
cases = [([1,2,3,4,5,6,1],3,12),([2,2,2],2,4),([9,7,7,9,7,7,9],7,55),([1,1000,1],1,1)]
passed = 0
print("\n---RESULT---")
for i,(pts,k,exp) in enumerate(cases,1):
    got=sol.maxScore(list(pts),k); ok=got==exp; passed+=ok
    print(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print(f"SUMMARY:{passed}:{len(cases)}")`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const pts = (lines[0] || '1 2 3 4 5 6 1').trim().split(/\s+/).filter(Boolean).map(Number);
      const k = parseInt(lines[1] ?? '3');
      return `
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
    'Given an integer array <code>nums</code> and an integer <code>k</code>, return the number of <strong>good subarrays</strong>.',
    'A subarray is <strong>good</strong> if the number of distinct integers in it is <em>exactly</em> <code>k</code>.',
  ],
  examples: [
    {
      input: 'nums = [1,2,1,2,3],  k = 2',
      output: '7',
      explanation: '<span class="hl hl-1">[1,2]</span>, <span class="hl hl-2">[2,1]</span>, <span class="hl hl-3">[1,2,1]</span>, <span class="hl hl-4">[2,1,2]</span>, <span class="hl hl-5">[1,2,1,2]</span>, <span class="hl hl-6">[2,3]</span>, <span class="hl hl-1">[1,2]</span> — seven subarrays each containing exactly 2 distinct integers.',
    },
    {
      input: 'nums = [1,2,1,3,4],  k = 3',
      output: '3',
      explanation: '<span class="hl hl-1">[1,2,1,3]</span>, <span class="hl hl-2">[2,1,3]</span>, <span class="hl hl-3">[1,3,4]</span> — three subarrays with exactly 3 distinct integers.',
    },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 2 × 10⁴',
    '1 ≤ nums[i] ≤ nums.length',
    '1 ≤ k ≤ nums.length',
  ],
  hints: [
    'Exact K distinct = atMost(K) − atMost(K − 1). Same trick as Binary Subarrays.',
    'Implement <code>atMost(k)</code>: use a frequency map. Expand right; when distinct count exceeds k, shrink left and update the map.',
    'At each right pointer, <code>right − left + 1</code> counts all valid subarrays ending at <code>right</code>.',
  ],
  inputFormat: 'Line 1: space-separated integers\nLine 2: k (integer)',
  defaultCustomInput: '1 2 1 2 3\n2',
  testCases: [
    { label: 'Example 1',    input: 'nums=[1,2,1,2,3], k=2',   expected: '7'  },
    { label: 'Example 2',    input: 'nums=[1,2,1,3,4], k=3',   expected: '3'  },
    { label: 'Single elem',  input: 'nums=[1], k=1',           expected: '1'  },
    { label: 'All same',     input: 'nums=[1,1,1,1,1], k=1',   expected: '15' },
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
    vector<int> nums = {1,2,1,2,3};
    int k = 2;
    int got = sol.subarraysWithKDistinct(nums, k);
    cout << "\\n---RESULT---\\n";
    if (got == 7) cout << "RESULT:PASS:7:" << got << "\\n";
    else          cout << "RESULT:FAIL:7:" << got << "\\n";
    return 0;
}`;
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    cout << "\\n---RESULT---\\n";
    auto chk = [&](vector<int> nums, int k, int expected, int n) {
        int got = sol.subarraysWithKDistinct(nums, k);
        bool ok = got == expected;
        passed += ok;
        cout << "TEST:" << n << (ok ? ":PASS:" : ":FAIL:") << expected << ":" << got << "\\n";
    };
    chk({1,2,1,2,3},   2, 7,  1);
    chk({1,2,1,3,4},   3, 3,  2);
    chk({1},           1, 1,  3);
    chk({1,1,1,1,1},   1, 15, 4);
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const nums = (lines[0] || '1 2 1 2 3').trim().split(/\s+/).filter(Boolean).map(Number);
      const k = parseInt(lines[1] ?? '2');
      return `
int main() {
    Solution sol;
    vector<int> nums = {${join(nums)}};
    int k = ${k};
    cout << sol.subarraysWithKDistinct(nums, k) << "\\n";
    return 0;
}`;
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.subarraysWithKDistinct([1,2,1,2,3], 2)
print("\n---RESULT---")
print(f"RESULT:{'PASS' if got == 7 else 'FAIL'}:7:{got}")`;
    if (mode === 'submit') return `
sol = Solution()
cases = [([1,2,1,2,3],2,7),([1,2,1,3,4],3,3),([1],1,1),([1,1,1,1,1],1,15)]
passed = 0
print("\n---RESULT---")
for i,(nums,k,exp) in enumerate(cases,1):
    got=sol.subarraysWithKDistinct(list(nums),k); ok=got==exp; passed+=ok
    print(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print(f"SUMMARY:{passed}:{len(cases)}")`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const nums = (lines[0] || '1 2 1 2 3').trim().split(/\s+/).filter(Boolean).map(Number);
      const k = parseInt(lines[1] ?? '2');
      return `
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
    'Given strings <code>s</code> and <code>t</code>, return the minimum contiguous substring of <code>s</code> such that <code>t</code> is a <strong>subsequence</strong> of that substring.',
    'If no such window exists return <code>""</code>. If multiple minimum-length windows exist, return the <strong>left-most</strong> one.',
  ],
  examples: [
    {
      input: 's = "abcdebdde",  t = "bde"',
      output: '"bcde"',
      explanation: 'Window <b>"bcde"</b> (indices 1–4) contains b→d→e in order. Teal cells match t; blue cells are in the window but unmatched.',
      visualization: {
        type: 'string-window',
        s: 'abcdebdde',
        t: 'bde',
        window: { start: 1, end: 4 },
        matches: [1, 3, 4],
        caption: '"bcde" length 4 — shortest window containing "bde" as a subsequence',
      },
    },
    {
      input: 's = "jmeqksfrcdcmsarqjssrqnmjgcgxabegksnfhxekrzq",  t = "sf"',
      output: '"sfr"',
      explanation: 'The first occurrence of s then f in sequence gives the window "sfr" (shortest).',
    },
  ],
  constraints: [
    '1 ≤ s.length ≤ 2 × 10⁴',
    '1 ≤ t.length ≤ 100',
    's and t consist of lowercase English letters',
  ],
  hints: [
    'Use two pointers on <code>s</code> and <code>t</code>. Scan forward until all characters of <code>t</code> are matched as a subsequence — this gives the window end.',
    'Once you have the window end, scan <em>backward</em> from that position to minimise the window start. This is the shortest window ending there.',
    'Record the minimum, then advance the start by 1 and repeat the forward scan. Overall O(|s| × |t|).',
  ],
  inputFormat: 'Line 1: s (string)\nLine 2: t (string)',
  defaultCustomInput: 'abcdebdde\nbde',
  testCases: [
    { label: 'Example 1',  input: 's="abcdebdde", t="bde"',                        expected: '"bcde"'       },
    { label: 'End match',  input: 's="xyzabc", t="abc"',                            expected: '"abc"'        },
    { label: 'Same str',   input: 's="aa", t="aa"',                                 expected: '"aa"'         },
    { label: 'Long search',input: 's="fgrqsqsnodwmxzkzxwqegkndaa", t="kzed"',      expected: '"kzxwqegknd"' },
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
    cout << "\\n---RESULT---\\n";
    if (got == "bcde") cout << "RESULT:PASS:bcde:" << got << "\\n";
    else               cout << "RESULT:FAIL:bcde:" << got << "\\n";
    return 0;
}`;
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    cout << "\\n---RESULT---\\n";
    auto chk = [&](string s, string t, string expected, int n) {
        string got = sol.minWindow(s, t);
        bool ok = got == expected;
        passed += ok;
        cout << "TEST:" << n << (ok ? ":PASS:" : ":FAIL:") << expected << ":" << got << "\\n";
    };
    chk("abcdebdde",                  "bde",  "bcde",       1);
    chk("xyzabc",                     "abc",  "abc",        2);
    chk("aa",                         "aa",   "aa",         3);
    chk("fgrqsqsnodwmxzkzxwqegkndaa", "kzed", "kzxwqegknd", 4);
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const s = (lines[0] || 'abcdebdde').trim();
      const t = (lines[1] || 'bde').trim();
      return `
int main() {
    Solution sol;
    cout << "\\"" << sol.minWindow("${s}", "${t}") << "\\"\\n";
    return 0;
}`;
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.minWindow("abcdebdde", "bde")
print("\n---RESULT---")
print(f"RESULT:{'PASS' if got == 'bcde' else 'FAIL'}:bcde:{got}")`;
    if (mode === 'submit') return `
sol = Solution()
cases = [("abcdebdde","bde","bcde"),("xyzabc","abc","abc"),("aa","aa","aa"),("fgrqsqsnodwmxzkzxwqegkndaa","kzed","kzxwqegknd")]
passed = 0
print("\n---RESULT---")
for i,(s,t,exp) in enumerate(cases,1):
    got=sol.minWindow(s,t); ok=got==exp; passed+=ok
    print(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print(f"SUMMARY:{passed}:{len(cases)}")`;
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n');
      const s = (lines[0] || 'abcdebdde').trim();
      const t = (lines[1] || 'bde').trim();
      return `
sol = Solution()
got = sol.minWindow("${s}", "${t}")
print(f'"{got}"')`;
    }
  },
}

export const PROBLEMS = [binarySubarrays, maxCards, kDistinct, minWindowSubseq]
