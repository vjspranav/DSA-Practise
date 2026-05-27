const join = arr => arr.join(', ')

// ── 1. Koko Eating Bananas ──────────────────────────────────────────────
const kokoEating = {
  id: 'koko-eating-bananas',
  title: 'Koko Eating Bananas',
  difficulty: 'Medium',
  category: 'binary-search',
  askedBy: 'himali',
  description: [
    'Koko loves to eat bananas. There are <code>n</code> piles of bananas; the <code>i-th</code> pile has <code>piles[i]</code> bananas. The guards will be back in <code>h</code> hours.',
    'Koko can decide her bananas-per-hour eating speed <code>k</code>. Each hour she eats from one pile (at most <code>k</code> bananas). If the pile has fewer, she finishes it and waits.',
    'Return the minimum integer <code>k</code> such that she can eat all bananas within <code>h</code> hours.',
  ],
  examples: [
    { input: 'piles = [3,6,7,11],  h = 8', output: '4', explanation: 'At speed 4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours.' },
    { input: 'piles = [30,11,23,4,20],  h = 5', output: '30', explanation: 'Each pile must be finished in exactly 1 hour, so k must be at least max(piles) = 30.' },
  ],
  constraints: [
    '1 ≤ piles.length ≤ 10⁴',
    'piles.length ≤ h ≤ 10⁹',
    '1 ≤ piles[i] ≤ 10⁹',
  ],
  hints: [
    'The answer lies in [1, max(piles)]. Binary search on the speed.',
    'For a candidate speed k, compute total hours = Σ ceil(pile / k). If hours ≤ h, k might be feasible — try lower.',
    'Use integer ceiling: ceil(a/b) = (a + b - 1) / b.',
  ],
  inputFormat: 'Line 1: space-separated pile sizes\nLine 2: h (integer)',
  defaultCustomInput: '3 6 7 11\n8',
  testCases: [
    { label: 'Example 1',  input: 'piles=[3,6,7,11], h=8',        expected: '4'  },
    { label: 'Example 2',  input: 'piles=[30,11,23,4,20], h=5',   expected: '30' },
    { label: 'h=6 case',   input: 'piles=[30,11,23,4,20], h=6',   expected: '23' },
    { label: 'Single pile',input: 'piles=[1000000000], h=2',       expected: '500000000' },
  ],
  cppStarter: `class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {

    }
};`,
  pythonStarter: `from typing import List
import math

class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> piles = {3,6,7,11};
    int got = sol.minEatingSpeed(piles, 8);
    cout << "\\n---RESULT---\\n";
    if (got == 4) cout << "RESULT:PASS:4:" << got << "\\n";
    else          cout << "RESULT:FAIL:4:" << got << "\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed = 0, total = 4;
    vector<string> res;
    auto chk = [&](vector<int> p, int h, int exp, int n) {
        int got = sol.minEatingSpeed(p, h);
        bool ok = got == exp; passed += ok;
        res.push_back("TEST:" + to_string(n) + (ok?":PASS:":":FAIL:") + to_string(exp) + ":" + to_string(got));
    };
    chk({3,6,7,11},      8,         4, 1);
    chk({30,11,23,4,20}, 5,        30, 2);
    chk({30,11,23,4,20}, 6,        23, 3);
    chk({1000000000},    2, 500000000, 4);
    cout << "\\n---RESULT---\\n";
    for (auto& s : res) cout << s << "\\n";
    cout << "SUMMARY:" << passed << ":" << total << "\\n";
    return passed == total ? 0 : 1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const piles = (lines[0]||'3 6 7 11').trim().split(/\s+/).map(Number)
      const h = parseInt(lines[1]??'8')
      return `
int main() {
    Solution sol;
    vector<int> piles = {${join(piles)}};
    cout << sol.minEatingSpeed(piles, ${h}) << "\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.minEatingSpeed([3,6,7,11], 8)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==4 else 'FAIL'}:4:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases = [([3,6,7,11],8,4),([30,11,23,4,20],5,30),([30,11,23,4,20],6,23),([1000000000],2,500000000)]
passed=0; res=[]
for i,(p,h,exp) in enumerate(cases,1):
    got=sol.minEatingSpeed(list(p),h); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const piles = (lines[0]||'3 6 7 11').trim().split(/\s+/).map(Number)
      const h = parseInt(lines[1]??'8')
      return `
sol = Solution()
print(sol.minEatingSpeed([${piles.join(',')}], ${h}))`
    }
  },
}

// ── 2. Aggressive Cows ──────────────────────────────────────────────────
const aggressiveCows = {
  id: 'aggressive-cows',
  title: 'Aggressive Cows',
  difficulty: 'Medium',
  category: 'binary-search',
  askedBy: 'himali',
  description: [
    'Given <code>n</code> stall positions and <code>k</code> cows, place the cows in stalls so that the <strong>minimum distance</strong> between any two cows is <strong>maximised</strong>.',
    'Return that maximum possible minimum distance.',
  ],
  examples: [
    { input: 'stalls = [1,2,4,8,9],  k = 3', output: '3', explanation: 'Place cows at positions 1, 4, 9. Distances: 3 and 5. Minimum is 3.' },
    { input: 'stalls = [1,2,3],  k = 2',     output: '2', explanation: 'Place cows at 1 and 3.' },
  ],
  constraints: [
    '2 ≤ k ≤ n ≤ 10⁵',
    '0 ≤ stalls[i] ≤ 10⁹',
    'All stall positions are distinct',
  ],
  hints: [
    'Sort the stall positions. Binary search on the minimum distance (range: [1, stalls[n-1] - stalls[0]]).',
    'For a candidate distance d, greedily place cows: start at stalls[0], then place the next cow at the first stall ≥ prev + d. Count placements.',
    'If you can place ≥ k cows with minimum gap d, try a larger d.',
  ],
  inputFormat: 'Line 1: space-separated stall positions\nLine 2: k (integer)',
  defaultCustomInput: '1 2 4 8 9\n3',
  testCases: [
    { label: 'Example 1',  input: 'stalls=[1,2,4,8,9], k=3', expected: '3' },
    { label: 'Example 2',  input: 'stalls=[1,2,3], k=2',     expected: '2' },
    { label: 'All k cows', input: 'stalls=[1,2,4,8,9], k=5', expected: '1' },
    { label: 'Large gap',  input: 'stalls=[1,10,20,30], k=2',expected: '29' },
  ],
  cppStarter: `class Solution {
public:
    int aggressiveCows(vector<int>& stalls, int k) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def aggressiveCows(self, stalls: List[int], k: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> s = {1,2,4,8,9};
    int got = sol.aggressiveCows(s, 3);
    cout << "\\n---RESULT---\\n";
    if (got==3) cout << "RESULT:PASS:3:" << got << "\\n";
    else        cout << "RESULT:FAIL:3:" << got << "\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<int> s,int k,int exp,int n){
        int got=sol.aggressiveCows(s,k); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,4,8,9},3,3,1);
    chk({1,2,3},2,2,2);
    chk({1,2,4,8,9},5,1,3);
    chk({1,10,20,30},2,29,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const s = (lines[0]||'1 2 4 8 9').trim().split(/\s+/).map(Number)
      const k = parseInt(lines[1]??'3')
      return `
int main() {
    Solution sol;
    vector<int> s = {${join(s)}};
    cout << sol.aggressiveCows(s, ${k}) << "\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.aggressiveCows([1,2,4,8,9], 3)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases = [([1,2,4,8,9],3,3),([1,2,3],2,2),([1,2,4,8,9],5,1),([1,10,20,30],2,29)]
passed=0; res=[]
for i,(s,k,exp) in enumerate(cases,1):
    got=sol.aggressiveCows(list(s),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const s = (lines[0]||'1 2 4 8 9').trim().split(/\s+/).map(Number)
      const k = parseInt(lines[1]??'3')
      return `
sol = Solution()
print(sol.aggressiveCows([${s.join(',')}], ${k}))`
    }
  },
}

// ── 3. Find Peak Element ───────────────────────────────────────────────
const findPeak = {
  id: 'find-peak-element',
  title: 'Find Peak Element',
  difficulty: 'Medium',
  category: 'binary-search',
  askedBy: 'himali',
  description: [
    'A peak element is one that is strictly greater than its neighbours. Given an integer array <code>nums</code>, find a peak element and return its index.',
    'Assume <code>nums[-1] = nums[n] = -∞</code>. You may return the index of any peak.',
    'Must run in <code>O(log n)</code> time.',
  ],
  examples: [
    { input: 'nums = [1,2,3,1]', output: '2', explanation: '3 is a peak (3 > 2 and 3 > 1).' },
    { input: 'nums = [1,2,1,3,5,6,4]', output: '5', explanation: '6 (index 5) is one valid peak; index 1 is another.' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 1000',
    '-2³¹ ≤ nums[i] ≤ 2³¹ - 1',
    'nums[i] ≠ nums[i+1] for all valid i',
  ],
  hints: [
    'Binary search: if nums[mid] < nums[mid+1], a peak must exist in the right half (the element at mid+1 is larger, so the right side is "uphill").',
    'Otherwise a peak exists in the left half (including mid).',
    'The search converges to a single peak index in O(log n).',
  ],
  inputFormat: 'Line 1: space-separated integers',
  defaultCustomInput: '1 2 3 1',
  testCases: [
    { label: 'Single peak',  input: 'nums=[1,2,3,1]', expected: '2' },
    { label: 'Left peak',    input: 'nums=[3,1]',     expected: '0' },
    { label: 'Right peak',   input: 'nums=[1,3]',     expected: '1' },
    { label: 'One element',  input: 'nums=[1]',       expected: '0' },
  ],
  cppStarter: `class Solution {
public:
    int findPeakElement(vector<int>& nums) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> nums = {1,2,3,1};
    int got = sol.findPeakElement(nums);
    cout << "\\n---RESULT---\\n";
    if (got==2) cout << "RESULT:PASS:2:" << got << "\\n";
    else        cout << "RESULT:FAIL:2:" << got << "\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<int> n,int exp,int t){
        int got=sol.findPeakElement(n); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(t)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,3,1},2,1);
    chk({3,1},0,2);
    chk({1,3},1,3);
    chk({1},0,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'1 2 3 1').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> nums = {${join(nums)}};
    cout << sol.findPeakElement(nums) << "\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.findPeakElement([1,2,3,1])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==2 else 'FAIL'}:2:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases = [([1,2,3,1],2),([3,1],0),([1,3],1),([1],0)]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=sol.findPeakElement(list(n)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'1 2 3 1').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.findPeakElement([${nums.join(',')}]))`
    }
  },
}

// ── 4. Search in Rotated Sorted Array ──────────────────────────────────
const searchRotated = {
  id: 'search-rotated-sorted-array',
  title: 'Search in Rotated Sorted Array',
  difficulty: 'Medium',
  category: 'binary-search',
  askedBy: 'vjs',
  description: [
    'An integer array <code>nums</code> sorted in ascending order has been rotated at an unknown pivot. Given <code>nums</code> and a <code>target</code>, return the index of <code>target</code> or <code>-1</code> if not present.',
    'Must run in <code>O(log n)</code> time.',
  ],
  examples: [
    { input: 'nums = [4,5,6,7,0,1,2],  target = 0', output: '4' },
    { input: 'nums = [4,5,6,7,0,1,2],  target = 3', output: '-1' },
  ],
  constraints: [
    '1 ≤ nums.length ≤ 5000',
    '-10⁴ ≤ nums[i], target ≤ 10⁴',
    'All values are unique',
  ],
  hints: [
    'At any mid point, one half is always sorted. Determine which half.',
    'If left half is sorted (nums[lo] ≤ nums[mid]) and target is in [nums[lo], nums[mid]], search left; else search right.',
    'Mirror logic for the right half.',
  ],
  inputFormat: 'Line 1: space-separated integers\nLine 2: target',
  defaultCustomInput: '4 5 6 7 0 1 2\n0',
  testCases: [
    { label: 'Example 1', input: 'nums=[4,5,6,7,0,1,2], target=0', expected: '4'  },
    { label: 'Not found', input: 'nums=[4,5,6,7,0,1,2], target=3', expected: '-1' },
    { label: 'One elem',  input: 'nums=[1], target=0',              expected: '-1' },
    { label: 'Two elems', input: 'nums=[1,3], target=3',            expected: '1'  },
  ],
  cppStarter: `class Solution {
public:
    int search(vector<int>& nums, int target) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> nums = {4,5,6,7,0,1,2};
    int got = sol.search(nums, 0);
    cout << "\\n---RESULT---\\n";
    if (got==4) cout << "RESULT:PASS:4:" << got << "\\n";
    else        cout << "RESULT:FAIL:4:" << got << "\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<int> n,int t,int exp,int tc){
        int got=sol.search(n,t); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(tc)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({4,5,6,7,0,1,2},0,4,1);
    chk({4,5,6,7,0,1,2},3,-1,2);
    chk({1},0,-1,3);
    chk({1,3},3,1,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const nums = (lines[0]||'4 5 6 7 0 1 2').trim().split(/\s+/).map(Number)
      const target = parseInt(lines[1]??'0')
      return `
int main() {
    Solution sol;
    vector<int> nums = {${join(nums)}};
    cout << sol.search(nums, ${target}) << "\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.search([4,5,6,7,0,1,2], 0)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==4 else 'FAIL'}:4:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases = [([4,5,6,7,0,1,2],0,4),([4,5,6,7,0,1,2],3,-1),([1],0,-1),([1,3],3,1)]
passed=0; res=[]
for i,(n,t,exp) in enumerate(cases,1):
    got=sol.search(list(n),t); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const nums = (lines[0]||'4 5 6 7 0 1 2').trim().split(/\s+/).map(Number)
      const target = parseInt(lines[1]??'0')
      return `
sol = Solution()
print(sol.search([${nums.join(',')}], ${target}))`
    }
  },
}

// ── 5. Painters Partition Problem ───────────────────────────────────────
const paintersPartition = {
  id: 'painters-partition',
  title: 'Painters Partition Problem',
  difficulty: 'Hard',
  category: 'binary-search',
  askedBy: 'vjs',
  description: [
    'Given <code>n</code> boards of lengths and <code>k</code> painters, each painter paints a contiguous section. Every painter takes 1 unit of time per unit of board length.',
    'All painters work simultaneously. Return the <strong>minimum time</strong> to paint all boards.',
  ],
  examples: [
    { input: 'boards = [10,20,30,40],  k = 2', output: '60', explanation: 'Painter 1: [10,20,30] = 60. Painter 2: [40] = 40. Max = 60.' },
    { input: 'boards = [10,20,30,40],  k = 4', output: '40', explanation: 'One painter per board. Time = max board = 40.' },
  ],
  constraints: [
    '1 ≤ k ≤ n ≤ 10⁵',
    '1 ≤ boards[i] ≤ 10⁶',
  ],
  hints: [
    'Binary search on the answer (time). Range: [max(boards), sum(boards)].',
    'For a given time t, greedily check: how many painters are needed? Assign each painter as many boards as possible without exceeding t.',
    'If painters needed ≤ k, t is feasible — try lower.',
  ],
  inputFormat: 'Line 1: space-separated board lengths\nLine 2: k (integer)',
  defaultCustomInput: '10 20 30 40\n2',
  testCases: [
    { label: 'Example 1',  input: 'boards=[10,20,30,40], k=2', expected: '60' },
    { label: 'Example 2',  input: 'boards=[10,20,30,40], k=4', expected: '40' },
    { label: '2 painters', input: 'boards=[7,2,5,10,8], k=2',  expected: '18' },
    { label: '1 painter',  input: 'boards=[5,5,5,5], k=1',     expected: '20' },
  ],
  cppStarter: `class Solution {
public:
    int minTime(vector<int>& boards, int k) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def minTime(self, boards: List[int], k: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> b = {10,20,30,40};
    int got = sol.minTime(b, 2);
    cout << "\\n---RESULT---\\n";
    if (got==60) cout << "RESULT:PASS:60:" << got << "\\n";
    else         cout << "RESULT:FAIL:60:" << got << "\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<int> b,int k,int exp,int n){
        int got=sol.minTime(b,k); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({10,20,30,40},2,60,1);
    chk({10,20,30,40},4,40,2);
    chk({7,2,5,10,8},2,18,3);
    chk({5,5,5,5},1,20,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const b = (lines[0]||'10 20 30 40').trim().split(/\s+/).map(Number)
      const k = parseInt(lines[1]??'2')
      return `
int main() {
    Solution sol;
    vector<int> b = {${join(b)}};
    cout << sol.minTime(b, ${k}) << "\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.minTime([10,20,30,40], 2)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==60 else 'FAIL'}:60:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases = [([10,20,30,40],2,60),([10,20,30,40],4,40),([7,2,5,10,8],2,18),([5,5,5,5],1,20)]
passed=0; res=[]
for i,(b,k,exp) in enumerate(cases,1):
    got=sol.minTime(list(b),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const b = (lines[0]||'10 20 30 40').trim().split(/\s+/).map(Number)
      const k = parseInt(lines[1]??'2')
      return `
sol = Solution()
print(sol.minTime([${b.join(',')}], ${k}))`
    }
  },
}

// ── 6. Magic Powder ─────────────────────────────────────────────────────
const magicPowder = {
  id: 'magic-powder',
  title: 'Magic Powder',
  difficulty: 'Medium',
  category: 'binary-search',
  askedBy: 'vjs',
  description: [
    'You are baking cookies. Each batch requires <code>a[i]</code> units of ingredient <code>i</code>. You have <code>b[i]</code> units of ingredient <code>i</code> and <code>k</code> bags of magic powder (each bag replaces 1 unit of any ingredient).',
    'Return the maximum number of complete cookie batches you can bake.',
  ],
  examples: [
    { input: 'a = [2,1,4],  b = [11,3,16],  k = 1', output: '4', explanation: 'Batch 4 needs 8,4,16. You have 11,3,16 — only 1 unit of ingredient 2 short. Use 1 bag of magic powder.' },
    { input: 'a = [2,1,4],  b = [11,3,16],  k = 0', output: '3', explanation: 'Without powder: min(11/2, 3/1, 16/4) = min(5,3,4) = 3.' },
  ],
  constraints: [
    '1 ≤ n ≤ 10⁵',
    '0 ≤ k ≤ 10⁹',
    '1 ≤ a[i] ≤ 10⁹',
    '0 ≤ b[i] ≤ 10⁹',
  ],
  hints: [
    'Binary search on the number of batches m.',
    'For m batches, total magic powder needed = Σ max(0, m*a[i] − b[i]). If this ≤ k, m batches are feasible.',
    'Watch for overflow: use long long for intermediate products.',
  ],
  inputFormat: 'Line 1: n k\nLine 2: a[0] … a[n-1]\nLine 3: b[0] … b[n-1]',
  defaultCustomInput: '3 1\n2 1 4\n11 3 16',
  testCases: [
    { label: 'Example 1',  input: 'a=[2,1,4], b=[11,3,16], k=1', expected: '4' },
    { label: 'No powder',  input: 'a=[2,1,4], b=[11,3,16], k=0', expected: '3' },
    { label: 'Plenty',     input: 'a=[1,1,1], b=[3,3,3], k=3',   expected: '4' },
    { label: 'All powder', input: 'a=[5], b=[0], k=10',           expected: '2' },
  ],
  cppStarter: `class Solution {
public:
    long long maxBatches(vector<long long>& a, vector<long long>& b, long long k) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def maxBatches(self, a: List[int], b: List[int], k: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<long long> a={2,1,4}, b={11,3,16};
    long long got = sol.maxBatches(a, b, 1);
    cout << "\\n---RESULT---\\n";
    if (got==4) cout << "RESULT:PASS:4:" << got << "\\n";
    else        cout << "RESULT:FAIL:4:" << got << "\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0, total=4;
    vector<string> res;
    auto chk=[&](vector<long long> a,vector<long long> b,long long k,long long exp,int n){
        long long got=sol.maxBatches(a,b,k); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({2,1,4},{11,3,16},1,4,1);
    chk({2,1,4},{11,3,16},0,3,2);
    chk({1,1,1},{3,3,3},3,4,3);
    chk({5},{0},10,2,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const [,k] = (lines[0]||'3 1').trim().split(/\s+/).map(Number)
      const a = (lines[1]||'2 1 4').trim().split(/\s+/).map(Number)
      const b = (lines[2]||'11 3 16').trim().split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<long long> a={${join(a)}}, b={${join(b)}};
    cout << sol.maxBatches(a, b, ${k}) << "\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.maxBatches([2,1,4],[11,3,16],1)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==4 else 'FAIL'}:4:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases = [([2,1,4],[11,3,16],1,4),([2,1,4],[11,3,16],0,3),([1,1,1],[3,3,3],3,4),([5],[0],10,2)]
passed=0; res=[]
for i,(a,b,k,exp) in enumerate(cases,1):
    got=sol.maxBatches(list(a),list(b),k); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const [,k] = (lines[0]||'3 1').trim().split(/\s+/).map(Number)
      const a = (lines[1]||'2 1 4').trim().split(/\s+/).map(Number)
      const b = (lines[2]||'11 3 16').trim().split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.maxBatches([${a.join(',')}],[${b.join(',')}],${k}))`
    }
  },
}

export const PROBLEMS = [kokoEating, aggressiveCows, findPeak, searchRotated, paintersPartition, magicPowder]
