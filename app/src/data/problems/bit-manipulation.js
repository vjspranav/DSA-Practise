const join = arr => arr.join(', ')

// ── 1. Power Set (Bit Manipulation) ─────────────────────────────────────
const powerSet = {
  id: 'power-set-bit',
  title: 'Power Set',
  difficulty: 'Medium',
  category: 'bit-manipulation',
  askedBy: 'himali',
  description: [
    'Given a set of distinct integers, return all possible subsets (the power set).',
    'Use the bit manipulation approach: for <code>n</code> elements there are <code>2ⁿ</code> subsets. For each mask from <code>0</code> to <code>2ⁿ−1</code>, bit <code>i</code> being set means element <code>i</code> is in the subset.',
  ],
  examples: [
    { input: 'nums=[1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explanation: '2³ = 8 subsets.' },
    { input: 'nums=[0]',     output: '[[],[0]]' },
  ],
  constraints: ['1 ≤ nums.length ≤ 15', 'All elements are distinct', '-10 ≤ nums[i] ≤ 10'],
  hints: [
    'Iterate mask from 0 to 2ⁿ−1. For each mask, include nums[i] whenever bit i is set.',
    'Check bit i with: (mask >> i) & 1.',
    'Total work is O(2ⁿ × n) — acceptable for n ≤ 15.',
  ],
  inputFormat: 'Line 1: space-separated integers',
  defaultCustomInput: '1 2 3',
  testCases: [
    { label: '[1,2,3]', input: 'nums=[1,2,3]', expected: '|1|1,2|1,2,3|1,3|2|2,3|3' },
    { label: '[0,1]',   input: 'nums=[0,1]',   expected: '|0|0,1|1'                   },
    { label: 'Single',  input: 'nums=[5]',      expected: '|5'                         },
    { label: '[1,2]',   input: 'nums=[1,2]',    expected: '|1|1,2|2'                   },
  ],
  cppStarter: `class Solution {
public:
    vector<vector<int>> powerSet(vector<int>& nums) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def powerSet(self, nums: List[int]) -> List[List[int]]:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmtPS = `auto fmtPS=[](vector<vector<int>> v){for(auto& s:v)sort(s.begin(),s.end());sort(v.begin(),v.end());string r="";for(int i=0;i<(int)v.size();i++){if(i)r+="|";for(int j=0;j<(int)v[i].size();j++){if(j)r+=",";r+=to_string(v[i][j]);}}return r;};`
    if (mode === 'run') return `
int main() {
    Solution sol; ${fmtPS}
    vector<int> n={1,2,3};
    string got=fmtPS(sol.powerSet(n)), exp="|1|1,2|1,2,3|1,3|2|2,3|3";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    auto fmtPS=[](vector<vector<int>> v){for(auto& s:v)sort(s.begin(),s.end());sort(v.begin(),v.end());string r="";for(int i=0;i<(int)v.size();i++){if(i)r+="|";for(int j=0;j<(int)v[i].size();j++){if(j)r+=",";r+=to_string(v[i][j]);}}return r;};
    cout<<"\\n---RESULT---\\n";
    auto ps=[&](string g,string e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){vector<int> n={1,2,3};ps(fmtPS(sol.powerSet(n)),"|1|1,2|1,2,3|1,3|2|2,3|3",1);}
    else if(tc==2){vector<int> n={0,1};ps(fmtPS(sol.powerSet(n)),"|0|0,1|1",2);}
    else if(tc==3){vector<int> n={5};ps(fmtPS(sol.powerSet(n)),"|5",3);}
    else if(tc==4){vector<int> n={1,2};ps(fmtPS(sol.powerSet(n)),"|1|1,2|2",4);}
    return 0;
}`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'1 2 3').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> n={${join(nums)}};
    auto r=sol.powerSet(n);
    for(int i=0;i<(int)r.size();i++){
        if(i)cout<<"\\n";
        cout<<"[";
        for(int j=0;j<(int)r[i].size();j++){if(j)cout<<",";cout<<r[i][j];}
        cout<<"]";
    }
    cout<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    const fmt = `def fmtPS(v): ss=[",".join(map(str,sorted(s))) for s in v]; return "|".join(sorted(ss))`
    if (mode === 'run') return `
${fmt}
sol = Solution()
got=fmtPS(sol.powerSet([1,2,3])); exp="|1|1,2|1,2,3|1,3|2|2,3|3"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
${fmt}
sol = Solution()
cases=[([1,2,3],"|1|1,2|1,2,3|1,3|2|2,3|3"),([0,1],"|0|0,1|1"),([5],"|5"),([1,2],"|1|1,2|2")]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=fmtPS(sol.powerSet(list(n))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'1 2 3').split(/\s+/).map(Number)
      return `
sol = Solution()
for s in sol.powerSet([${nums.join(',')}]): print(s)`
    }
  },
}

// ── 2. Minimum Bit Flips ─────────────────────────────────────────────────
const minBitFlips = {
  id: 'minimum-bit-flips',
  title: 'Minimum Bit Flips to Convert Number',
  difficulty: 'Easy',
  category: 'bit-manipulation',
  askedBy: 'himali',
  description: [
    'Given two integers <code>start</code> and <code>goal</code>, return the minimum number of bit flips to convert <code>start</code> to <code>goal</code>.',
    'A bit flip changes a single bit from 0 to 1 or 1 to 0.',
  ],
  examples: [
    { input: 'start=10, goal=7', output: '3', explanation: '10=1010, 7=0111. XOR=1101 → 3 differing bits.' },
    { input: 'start=3, goal=4',  output: '3', explanation: '3=011, 4=100. XOR=111 → 3 differing bits.' },
  ],
  constraints: ['0 ≤ start, goal ≤ 10⁹'],
  hints: [
    'Two bits differ exactly when their XOR is 1.',
    'Count the number of 1-bits in (start XOR goal).',
    'Use __builtin_popcount in C++ or bin().count("1") in Python.',
  ],
  inputFormat: 'Line 1: start goal',
  defaultCustomInput: '10 7',
  testCases: [
    { label: 'Example 1', input: 'start=10, goal=7',  expected: '3' },
    { label: 'Example 2', input: 'start=3, goal=4',   expected: '3' },
    { label: 'No flips',  input: 'start=5, goal=5',   expected: '0' },
    { label: '4 flips',   input: 'start=0, goal=15',  expected: '4' },
  ],
  cppStarter: `class Solution {
public:
    int minBitFlips(int start, int goal) {

    }
};`,
  pythonStarter: `class Solution:
    def minBitFlips(self, start: int, goal: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    int got=sol.minBitFlips(10,7);
    cout<<"\\n---RESULT---\\n";
    if(got==3) cout<<"RESULT:PASS:3:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:3:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1) p(sol.minBitFlips(10,7),3,1);
    else if(tc==2) p(sol.minBitFlips(3,4),3,2);
    else if(tc==3) p(sol.minBitFlips(5,5),0,3);
    else if(tc==4) p(sol.minBitFlips(0,15),4,4);
    return 0;
}`
    if (mode === 'custom') {
      const [start, goal] = (customInput.trim()||'10 7').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    cout<<sol.minBitFlips(${start},${goal})<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.minBitFlips(10,7)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[(10,7,3),(3,4,3),(5,5,0),(0,15,4)]
passed=0; res=[]
for i,(s,g,exp) in enumerate(cases,1):
    got=sol.minBitFlips(s,g); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const [start, goal] = (customInput.trim()||'10 7').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.minBitFlips(${start},${goal}))`
    }
  },
}

// ── 3. Print Prime Factors ───────────────────────────────────────────────
const printPrimeFactors = {
  id: 'print-prime-factors',
  title: 'Print Prime Factors of a Number',
  difficulty: 'Easy',
  category: 'bit-manipulation',
  askedBy: 'himali',
  description: [
    'Given a number <code>n</code>, return its distinct prime factors in sorted order.',
    'A prime factor is a prime number that divides <code>n</code> exactly.',
  ],
  examples: [
    { input: 'n=12', output: '[2,3]',  explanation: '12 = 2² × 3. Distinct prime factors: 2, 3.' },
    { input: 'n=100', output: '[2,5]', explanation: '100 = 2² × 5². Distinct prime factors: 2, 5.' },
  ],
  constraints: ['2 ≤ n ≤ 10⁶'],
  hints: [
    'Check divisibility starting from 2. Divide out all 2s first, then odd numbers from 3 to √n.',
    'If a remainder > 1 remains after the loop, it is a prime factor.',
    'This runs in O(√n).',
  ],
  inputFormat: 'Line 1: n',
  defaultCustomInput: '12',
  testCases: [
    { label: 'n=12',  input: 'n=12',  expected: '2,3'  },
    { label: 'n=100', input: 'n=100', expected: '2,5'  },
    { label: 'n=28',  input: 'n=28',  expected: '2,7'  },
    { label: 'Prime', input: 'n=97',  expected: '97'   },
  ],
  cppStarter: `class Solution {
public:
    vector<int> primeFactors(int n) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def primeFactors(self, n: int) -> List[int]:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmtV = `auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`
    if (mode === 'run') return `
int main() {
    Solution sol; ${fmtV}
    string got=fmtV(sol.primeFactors(12)), exp="2,3";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    cout<<"\\n---RESULT---\\n";
    auto ps=[&](string g,string e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1) ps(fmtV(sol.primeFactors(12)),"2,3",1);
    else if(tc==2) ps(fmtV(sol.primeFactors(100)),"2,5",2);
    else if(tc==3) ps(fmtV(sol.primeFactors(28)),"2,7",3);
    else if(tc==4) ps(fmtV(sol.primeFactors(97)),"97",4);
    return 0;
}`
    if (mode === 'custom') {
      const n = parseInt(customInput.trim()||'12')
      return `
int main() {
    Solution sol;
    auto r=sol.primeFactors(${n});
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=",".join(map(str,sol.primeFactors(12))); exp="2,3"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[(12,"2,3"),(100,"2,5"),(28,"2,7"),(97,"97")]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=",".join(map(str,sol.primeFactors(n))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const n = parseInt(customInput.trim()||'12')
      return `
sol = Solution()
print(",".join(map(str,sol.primeFactors(${n}))))`
    }
  },
}

// ── 4. Count Primes in Range ─────────────────────────────────────────────
const countPrimesRange = {
  id: 'count-primes-range',
  title: 'Count Primes in Range L to R',
  difficulty: 'Medium',
  category: 'bit-manipulation',
  askedBy: 'himali',
  description: [
    'Given two integers <code>L</code> and <code>R</code>, return the count of prime numbers in the range <code>[L, R]</code> (inclusive).',
  ],
  examples: [
    { input: 'L=1, R=10', output: '4', explanation: 'Primes: 2, 3, 5, 7.' },
    { input: 'L=10, R=20', output: '4', explanation: 'Primes: 11, 13, 17, 19.' },
  ],
  constraints: ['1 ≤ L ≤ R ≤ 10⁶'],
  hints: [
    'Build a sieve of Eratosthenes up to R. Mark all composites.',
    'Count unmarked numbers in [L, R]. A bitset or bool array works.',
    'Sieve runs in O(R log log R), counting in O(R − L + 1).',
  ],
  inputFormat: 'Line 1: L R',
  defaultCustomInput: '1 10',
  testCases: [
    { label: 'L=1 R=10',  input: 'L=1, R=10',   expected: '4' },
    { label: 'L=1 R=20',  input: 'L=1, R=20',   expected: '8' },
    { label: 'L=10 R=20', input: 'L=10, R=20',  expected: '4' },
    { label: 'L=1 R=2',   input: 'L=1, R=2',    expected: '1' },
  ],
  cppStarter: `class Solution {
public:
    int countPrimes(int l, int r) {

    }
};`,
  pythonStarter: `class Solution:
    def countPrimes(self, l: int, r: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    int got=sol.countPrimes(1,10);
    cout<<"\\n---RESULT---\\n";
    if(got==4) cout<<"RESULT:PASS:4:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:4:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1) p(sol.countPrimes(1,10),4,1);
    else if(tc==2) p(sol.countPrimes(1,20),8,2);
    else if(tc==3) p(sol.countPrimes(10,20),4,3);
    else if(tc==4) p(sol.countPrimes(1,2),1,4);
    return 0;
}`
    if (mode === 'custom') {
      const [l, r] = (customInput.trim()||'1 10').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    cout<<sol.countPrimes(${l},${r})<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.countPrimes(1,10)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==4 else 'FAIL'}:4:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[(1,10,4),(1,20,8),(10,20,4),(1,2,1)]
passed=0; res=[]
for i,(l,r,exp) in enumerate(cases,1):
    got=sol.countPrimes(l,r); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const [l, r] = (customInput.trim()||'1 10').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.countPrimes(${l},${r}))`
    }
  },
}

// ── 5. Single Number I ───────────────────────────────────────────────────
const singleNumberI = {
  id: 'single-number-i',
  title: 'Single Number — I',
  difficulty: 'Easy',
  category: 'bit-manipulation',
  askedBy: 'vjs',
  description: [
    'Given a non-empty array of integers where every element appears <strong>exactly twice</strong> except one, find that single element.',
    'Must run in <code>O(n)</code> time and <code>O(1)</code> space.',
  ],
  examples: [
    { input: 'nums=[2,2,1]',       output: '1' },
    { input: 'nums=[4,1,2,1,2]',   output: '4' },
  ],
  constraints: ['1 ≤ nums.length ≤ 3×10⁴', '-3×10⁴ ≤ nums[i] ≤ 3×10⁴'],
  hints: [
    'XOR of a number with itself is 0. XOR of a number with 0 is the number.',
    'XOR all elements — paired elements cancel out, leaving the single element.',
    'One line solution: return reduce(xor, nums).',
  ],
  inputFormat: 'Line 1: space-separated integers',
  defaultCustomInput: '2 2 1',
  testCases: [
    { label: 'Example 1', input: 'nums=[2,2,1]',     expected: '1' },
    { label: 'Example 2', input: 'nums=[4,1,2,1,2]', expected: '4' },
    { label: 'Single',    input: 'nums=[1]',          expected: '1' },
    { label: 'With 0',    input: 'nums=[0,1,0]',      expected: '1' },
  ],
  cppStarter: `class Solution {
public:
    int singleNumber(vector<int>& nums) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> n={2,2,1};
    int got=sol.singleNumber(n);
    cout<<"\\n---RESULT---\\n";
    if(got==1) cout<<"RESULT:PASS:1:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:1:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){vector<int> n={2,2,1};p(sol.singleNumber(n),1,1);}
    else if(tc==2){vector<int> n={4,1,2,1,2};p(sol.singleNumber(n),4,2);}
    else if(tc==3){vector<int> n={1};p(sol.singleNumber(n),1,3);}
    else if(tc==4){vector<int> n={0,1,0};p(sol.singleNumber(n),1,4);}
    return 0;
}`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'2 2 1').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> n={${join(nums)}};
    cout<<sol.singleNumber(n)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.singleNumber([2,2,1])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==1 else 'FAIL'}:1:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([2,2,1],1),([4,1,2,1,2],4),([1],1),([0,1,0],1)]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=sol.singleNumber(list(n)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'2 2 1').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.singleNumber([${nums.join(',')}]))`
    }
  },
}

// ── 6. XOR of Numbers in a Range ────────────────────────────────────────
const xorRange = {
  id: 'xor-range',
  title: 'XOR of Numbers in a Given Range',
  difficulty: 'Medium',
  category: 'bit-manipulation',
  askedBy: 'vjs',
  description: [
    'Given two integers <code>L</code> and <code>R</code>, return the XOR of all numbers from <code>L</code> to <code>R</code> inclusive.',
    'An O(1) solution exists using the pattern of XOR from 1 to N.',
  ],
  examples: [
    { input: 'L=1, R=5', output: '1', explanation: '1^2^3^4^5 = 1.' },
    { input: 'L=2, R=4', output: '5', explanation: '2^3^4 = 5.' },
  ],
  constraints: ['1 ≤ L ≤ R ≤ 10⁹'],
  hints: [
    'XOR(L, R) = XOR(1, R) ^ XOR(1, L−1), where XOR(1, N) is XOR of 1 to N.',
    'XOR(1, N) follows a 4-cycle: N%4==0→N, N%4==1→1, N%4==2→N+1, N%4==3→0.',
    'This gives an O(1) solution regardless of range size.',
  ],
  inputFormat: 'Line 1: L R',
  defaultCustomInput: '1 5',
  testCases: [
    { label: 'L=1 R=5', input: 'L=1, R=5', expected: '1' },
    { label: 'L=2 R=4', input: 'L=2, R=4', expected: '5' },
    { label: 'Single',  input: 'L=1, R=1', expected: '1' },
    { label: 'L=3 R=7', input: 'L=3, R=7', expected: '3' },
  ],
  cppStarter: `class Solution {
public:
    int xorRange(int l, int r) {

    }
};`,
  pythonStarter: `class Solution:
    def xorRange(self, l: int, r: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    int got=sol.xorRange(1,5);
    cout<<"\\n---RESULT---\\n";
    if(got==1) cout<<"RESULT:PASS:1:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:1:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1) p(sol.xorRange(1,5),1,1);
    else if(tc==2) p(sol.xorRange(2,4),5,2);
    else if(tc==3) p(sol.xorRange(1,1),1,3);
    else if(tc==4) p(sol.xorRange(3,7),3,4);
    return 0;
}`
    if (mode === 'custom') {
      const [l, r] = (customInput.trim()||'1 5').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    cout<<sol.xorRange(${l},${r})<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.xorRange(1,5)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==1 else 'FAIL'}:1:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[(1,5,1),(2,4,5),(1,1,1),(3,7,3)]
passed=0; res=[]
for i,(l,r,exp) in enumerate(cases,1):
    got=sol.xorRange(l,r); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const [l, r] = (customInput.trim()||'1 5').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.xorRange(${l},${r}))`
    }
  },
}

// ── 7. Single Number III ─────────────────────────────────────────────────
const singleNumberIII = {
  id: 'single-number-iii',
  title: 'Single Number — III',
  difficulty: 'Hard',
  category: 'bit-manipulation',
  askedBy: 'vjs',
  description: [
    'Given an integer array where every element appears <strong>exactly twice</strong> except for two elements which appear once, find those two elements.',
    'Return them in sorted (ascending) order. Must run in O(n) time and O(1) space.',
  ],
  examples: [
    { input: 'nums=[1,2,1,3,2,5]', output: '[3,5]', explanation: '3 and 5 each appear once.' },
    { input: 'nums=[1,3]',         output: '[1,3]' },
  ],
  constraints: ['2 ≤ nums.length ≤ 3×10⁴', '-2³¹ ≤ nums[i] ≤ 2³¹−1'],
  hints: [
    'XOR all elements to get a^b (the two single numbers XORed). a ≠ b, so a^b ≠ 0.',
    'Find any set bit in a^b (e.g. the rightmost: diff & (-diff)). This bit differs between a and b.',
    'Partition all numbers into two groups based on that bit. XOR each group — paired elements cancel, leaving a or b.',
  ],
  inputFormat: 'Line 1: space-separated integers',
  defaultCustomInput: '1 2 1 3 2 5',
  testCases: [
    { label: 'Example 1',   input: 'nums=[1,2,1,3,2,5]',   expected: '3,5'  },
    { label: 'Two only',    input: 'nums=[1,3]',            expected: '1,3'  },
    { label: 'Example 2',   input: 'nums=[2,1,3,2]',        expected: '1,3'  },
    { label: 'With zeros',  input: 'nums=[4,8,4,6,8,12]',   expected: '6,12' },
  ],
  cppStarter: `class Solution {
public:
    vector<int> singleNumberIII(vector<int>& nums) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def singleNumberIII(self, nums: List[int]) -> List[int]:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmtV = `auto fmtV=[](vector<int> v){sort(v.begin(),v.end());string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`
    if (mode === 'run') return `
int main() {
    Solution sol; ${fmtV}
    vector<int> n={1,2,1,3,2,5};
    string got=fmtV(sol.singleNumberIII(n)), exp="3,5";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    auto fmtV=[](vector<int> v){sort(v.begin(),v.end());string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    cout<<"\\n---RESULT---\\n";
    auto ps=[&](string g,string e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){vector<int> n={1,2,1,3,2,5};ps(fmtV(sol.singleNumberIII(n)),"3,5",1);}
    else if(tc==2){vector<int> n={1,3};ps(fmtV(sol.singleNumberIII(n)),"1,3",2);}
    else if(tc==3){vector<int> n={2,1,3,2};ps(fmtV(sol.singleNumberIII(n)),"1,3",3);}
    else if(tc==4){vector<int> n={4,8,4,6,8,12};ps(fmtV(sol.singleNumberIII(n)),"6,12",4);}
    return 0;
}`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'1 2 1 3 2 5').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> n={${join(nums)}};
    auto r=sol.singleNumberIII(n);
    sort(r.begin(),r.end());
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=",".join(map(str,sorted(sol.singleNumberIII([1,2,1,3,2,5])))); exp="3,5"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([1,2,1,3,2,5],"3,5"),([1,3],"1,3"),([2,1,3,2],"1,3"),([4,8,4,6,8,12],"6,12")]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=",".join(map(str,sorted(sol.singleNumberIII(list(n))))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'1 2 1 3 2 5').split(/\s+/).map(Number)
      return `
sol = Solution()
print(",".join(map(str,sorted(sol.singleNumberIII([${nums.join(',')}])))))`
    }
  },
}

// ── 8. Prime Factorisation of a Number ──────────────────────────────────
const primeFactorisation = {
  id: 'prime-factorisation',
  title: 'Prime Factorisation of a Number',
  difficulty: 'Medium',
  category: 'bit-manipulation',
  askedBy: 'vjs',
  description: [
    'Given a number <code>n</code>, return its complete prime factorisation as a sorted list of prime factors <em>with repetition</em>.',
    'For example, 12 = 2 × 2 × 3 → return [2, 2, 3].',
  ],
  examples: [
    { input: 'n=12',  output: '[2,2,3]',   explanation: '12 = 2² × 3.' },
    { input: 'n=36',  output: '[2,2,3,3]', explanation: '36 = 2² × 3².' },
  ],
  constraints: ['2 ≤ n ≤ 10⁶'],
  hints: [
    'Divide n by 2 as many times as possible. Then try all odd divisors from 3 to √n.',
    'For each divisor d that divides n, keep dividing and recording d.',
    'If n > 1 after the loop, n itself is a prime factor.',
  ],
  inputFormat: 'Line 1: n',
  defaultCustomInput: '12',
  testCases: [
    { label: 'n=12',  input: 'n=12',  expected: '2,2,3'     },
    { label: 'n=36',  input: 'n=36',  expected: '2,2,3,3'   },
    { label: 'n=84',  input: 'n=84',  expected: '2,2,3,7'   },
    { label: 'Prime', input: 'n=2',   expected: '2'          },
  ],
  cppStarter: `class Solution {
public:
    vector<int> primeFactorisation(int n) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def primeFactorisation(self, n: int) -> List[int]:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmtV = `auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`
    if (mode === 'run') return `
int main() {
    Solution sol; ${fmtV}
    string got=fmtV(sol.primeFactorisation(12)), exp="2,2,3";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    cout<<"\\n---RESULT---\\n";
    auto ps=[&](string g,string e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1) ps(fmtV(sol.primeFactorisation(12)),"2,2,3",1);
    else if(tc==2) ps(fmtV(sol.primeFactorisation(36)),"2,2,3,3",2);
    else if(tc==3) ps(fmtV(sol.primeFactorisation(84)),"2,2,3,7",3);
    else if(tc==4) ps(fmtV(sol.primeFactorisation(2)),"2",4);
    return 0;
}`
    if (mode === 'custom') {
      const n = parseInt(customInput.trim()||'12')
      return `
int main() {
    Solution sol;
    auto r=sol.primeFactorisation(${n});
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=",".join(map(str,sol.primeFactorisation(12))); exp="2,2,3"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[(12,"2,2,3"),(36,"2,2,3,3"),(84,"2,2,3,7"),(2,"2")]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=",".join(map(str,sol.primeFactorisation(n))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const n = parseInt(customInput.trim()||'12')
      return `
sol = Solution()
print(",".join(map(str,sol.primeFactorisation(${n}))))`
    }
  },
}

export const PROBLEMS = [powerSet, minBitFlips, printPrimeFactors, countPrimesRange, singleNumberI, xorRange, singleNumberIII, primeFactorisation]
