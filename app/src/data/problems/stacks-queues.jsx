import HistogramViz from '../../components/viz/HistogramViz'

const join = arr => arr.join(', ')

// ── 1. Trapping Rain Water ───────────────────────────────────────────────
const trappingRainWater = {
  id: 'trapping-rain-water',
  title: 'Trapping Rain Water',
  difficulty: 'Hard',
  category: 'stacks-queues',
  askedBy: 'himali',
  description: [
    'Given <code>n</code> non-negative integers representing an elevation map where each bar has width 1, compute how much water can be trapped after raining.',
  ],
  examples: [
    { input: 'height=[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
    { input: 'height=[4,2,0,3,2,5]',              output: '9' },
  ],
  constraints: ['n ≥ 0', '0 ≤ height[i] ≤ 3×10⁴'],
  hints: [
    'Two-pointer approach: maintain leftMax and rightMax. Water at position i = min(leftMax, rightMax) − height[i].',
    'Or use a monotonic stack: for each bar, pop stack while current height > stack top, water = min(heights) × width.',
    'Two-pointer is O(n) time, O(1) space.',
  ],
  inputFormat: 'Line 1: space-separated heights',
  defaultCustomInput: '0 1 0 2 1 0 1 3 2 1 2 1',
  testCases: [
    { label: 'Example 1', input: 'height=[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
    { label: 'Example 2', input: 'height=[4,2,0,3,2,5]',              expected: '9' },
    { label: 'Flat',      input: 'height=[3,3,3,3]',                  expected: '0' },
    { label: 'Valley',    input: 'height=[3,0,3]',                    expected: '3' },
  ],
  cppStarter: `class Solution {
public:
    int trap(vector<int>& height) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def trap(self, height: List[int]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> h={0,1,0,2,1,0,1,3,2,1,2,1};
    int got=sol.trap(h);
    cout<<"\\n---RESULT---\\n";
    if(got==6) cout<<"RESULT:PASS:6:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:6:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){vector<int> h={0,1,0,2,1,0,1,3,2,1,2,1};p(sol.trap(h),6,1);}
    else if(tc==2){vector<int> h={4,2,0,3,2,5};p(sol.trap(h),9,2);}
    else if(tc==3){vector<int> h={3,3,3,3};p(sol.trap(h),0,3);}
    else if(tc==4){vector<int> h={3,0,3};p(sol.trap(h),3,4);}
    return 0;
}`
    if (mode === 'custom') {
      const h = (customInput.trim()||'0 1 0 2 1 0 1 3 2 1 2 1').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> h={${join(h)}};
    cout<<sol.trap(h)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.trap([0,1,0,2,1,0,1,3,2,1,2,1])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==6 else 'FAIL'}:6:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([0,1,0,2,1,0,1,3,2,1,2,1],6),([4,2,0,3,2,5],9),([3,3,3,3],0),([3,0,3],3)]
passed=0; res=[]
for i,(h,exp) in enumerate(cases,1):
    got=sol.trap(list(h)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const h = (customInput.trim()||'0 1 0 2 1 0 1 3 2 1 2 1').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.trap([${h.join(',')}]))`
    }
  },
}

// ── 2. Asteroid Collision ────────────────────────────────────────────────
const asteroidCollision = {
  id: 'asteroid-collision',
  title: 'Asteroid Collision',
  difficulty: 'Medium',
  category: 'stacks-queues',
  askedBy: 'himali',
  description: [
    'An array of integers represents asteroids. Positive = moving right, negative = moving left. Magnitude = size.',
    'Asteroids moving in the same direction never meet. When they meet, the smaller one explodes; if equal both explode.',
    'Return the final state.',
  ],
  examples: [
    { input: 'asteroids=[5,10,-5]',   output: '[5,10]',     explanation: '-5 collides with 10 and explodes.' },
    { input: 'asteroids=[8,-8]',      output: '[]',          explanation: 'Both equal size, both explode.' },
    { input: 'asteroids=[10,2,-5]',   output: '[10]',        explanation: '-5 hits 2 (2 explodes), then -5 hits 10 (-5 explodes).' },
  ],
  constraints: ['2 ≤ asteroids.length ≤ 10⁴', '-1000 ≤ asteroids[i] ≤ 1000', 'asteroids[i] ≠ 0'],
  hints: [
    'Use a stack. Push positive asteroids.',
    'For negative: pop all smaller positives. If equal, pop and stop. If top is larger positive, the negative explodes.',
    'If stack empty or top is negative, push the negative asteroid.',
  ],
  inputFormat: 'Line 1: space-separated asteroid values',
  defaultCustomInput: '5 10 -5',
  testCases: [
    { label: 'Example 1', input: 'asteroids=[5,10,-5]',   expected: '5,10'  },
    { label: 'Both die',  input: 'asteroids=[8,-8]',      expected: ''      },
    { label: 'Example 3', input: 'asteroids=[10,2,-5]',   expected: '10'    },
    { label: 'No collide',input: 'asteroids=[-2,-1,1,2]', expected: '-2,-1,1,2' },
  ],
  cppStarter: `class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmtV = `auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`
    if (mode === 'run') return `
int main() {
    Solution sol; ${fmtV}
    vector<int> a={5,10,-5};
    string got=fmtV(sol.asteroidCollision(a)), exp="5,10";
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
    if(tc==1){vector<int> a={5,10,-5};ps(fmtV(sol.asteroidCollision(a)),"5,10",1);}
    else if(tc==2){vector<int> a={8,-8};ps(fmtV(sol.asteroidCollision(a)),"",2);}
    else if(tc==3){vector<int> a={10,2,-5};ps(fmtV(sol.asteroidCollision(a)),"10",3);}
    else if(tc==4){vector<int> a={-2,-1,1,2};ps(fmtV(sol.asteroidCollision(a)),"-2,-1,1,2",4);}
    return 0;
}`
    if (mode === 'custom') {
      const a = (customInput.trim()||'5 10 -5').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> a={${join(a)}};
    auto r=sol.asteroidCollision(a);
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=",".join(map(str,sol.asteroidCollision([5,10,-5]))); exp="5,10"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([5,10,-5],"5,10"),([8,-8],""),([10,2,-5],"10"),([-2,-1,1,2],"-2,-1,1,2")]
passed=0; res=[]
for i,(a,exp) in enumerate(cases,1):
    got=",".join(map(str,sol.asteroidCollision(list(a)))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const a = (customInput.trim()||'5 10 -5').split(/\s+/).map(Number)
      return `
sol = Solution()
print(",".join(map(str,sol.asteroidCollision([${a.join(',')}]))))`
    }
  },
}

// ── 3. Celebrity Problem ─────────────────────────────────────────────────
const celebrityProblem = {
  id: 'celebrity-problem',
  title: 'Celebrity Problem',
  difficulty: 'Medium',
  category: 'stacks-queues',
  askedBy: 'himali',
  description: [
    'In a party of <code>n</code> people, a celebrity is known by everyone but knows no one. Given a function <code>knows(a, b)</code>, find the celebrity or return -1.',
    'Minimise calls to <code>knows</code>.',
  ],
  examples: [
    { input: 'n=4, knows matrix=[[0,0,1,0],[0,0,1,0],[0,0,0,0],[0,0,1,0]]', output: '2', explanation: 'Person 2 is known by all others but knows nobody.' },
    { input: 'n=2, knows=[[1,1],[0,0]]', output: '1' },
  ],
  constraints: ['2 ≤ n ≤ 100', 'knows[i][j] is 0 or 1', 'knows[i][i] = 0'],
  hints: [
    "Stack approach: push all people. Pop two at a time — if A knows B, A can't be celebrity, push B; else push A.",
    'One candidate remains. Verify it by checking it knows no one and everyone knows it.',
    'Total calls: O(n).',
  ],
  inputFormat: 'Conceptual — use run/submit modes (knows matrix encoded as input)',
  defaultCustomInput: '',
  testCases: [
    { label: 'Example 1', input: 'n=4, celebrity=2', expected: '2'  },
    { label: 'Example 2', input: 'n=2, celebrity=1', expected: '1'  },
    { label: 'No celeb',  input: 'n=3, knows each other', expected: '-1' },
    { label: 'n=3 celeb', input: 'n=3, celebrity=2',  expected: '2'  },
  ],
  cppStarter: `class Solution {
    vector<vector<int>> mat;
    bool knows(int a, int b) { return mat[a][b]; }
public:
    int celebrity(int n, vector<vector<int>>& knows_mat) {
        mat = knows_mat;
        // find celebrity among people 0..n-1

    }
};`,
  pythonStarter: `class Solution:
    def celebrity(self, n: int, knows_mat: list) -> int:
        def knows(a, b): return knows_mat[a][b]
        # find celebrity among people 0..n-1
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<vector<int>> m={{0,0,1,0},{0,0,1,0},{0,0,0,0},{0,0,1,0}};
    int got=sol.celebrity(4,m);
    cout<<"\\n---RESULT---\\n";
    if(got==2) cout<<"RESULT:PASS:2:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:2:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){vector<vector<int>> m={{0,0,1,0},{0,0,1,0},{0,0,0,0},{0,0,1,0}};p(sol.celebrity((int)m.size(),m),2,1);}
    else if(tc==2){vector<vector<int>> m={{0,1},{0,0}};p(sol.celebrity((int)m.size(),m),1,2);}
    else if(tc==3){vector<vector<int>> m={{0,1,0},{0,0,1},{1,0,0}};p(sol.celebrity((int)m.size(),m),-1,3);}
    else if(tc==4){vector<vector<int>> m={{0,1,1},{0,0,1},{0,0,0}};p(sol.celebrity((int)m.size(),m),2,4);}
    return 0;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
m=[[0,0,1,0],[0,0,1,0],[0,0,0,0],[0,0,1,0]]
got=sol.celebrity(4,m)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==2 else 'FAIL'}:2:{got}")`
    if (mode === 'submit') return `
sol = Solution()
passed=0; res=[]
def chk(n,m,exp):
    global passed
    got=sol.celebrity(len(m),m); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[[0,0,1,0],[0,0,1,0],[0,0,0,0],[0,0,1,0]],2)
chk(2,[[0,1],[0,0]],1)
chk(3,[[0,1,0],[0,0,1],[1,0,0]],-1)
chk(4,[[0,1,1],[0,0,1],[0,0,0]],2)
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 4. LFU Cache ─────────────────────────────────────────────────────────
const lfuCache = {
  id: 'lfu-cache',
  title: 'LFU Cache',
  difficulty: 'Hard',
  category: 'stacks-queues',
  askedBy: 'himali',
  description: [
    'Design a Least Frequently Used (LFU) cache. When at capacity, evict the least frequently used key. Ties are broken by recency (LRU among LFU).',
    'Implement <code>LFUCache(capacity)</code>, <code>get(key)</code>, <code>put(key, value)</code>, all in O(1).',
  ],
  examples: [
    { input: 'LFUCache(2); put(1,1); put(2,2); get(1)→1; put(3,3); get(2)→-1; get(3)→3; put(4,4); get(1)→1; get(3)→3; get(4)→4', output: '1,-1,3,1,3,4' },
  ],
  constraints: ['0 ≤ capacity ≤ 10⁴', '0 ≤ key ≤ 10⁵', '0 ≤ value ≤ 10⁹'],
  hints: [
    'Maintain: (1) key→(value, freq) map, (2) freq→ordered list of keys (LRU order within same freq), (3) minFreq tracker.',
    'On get: increment freq, move from freq list to freq+1 list, update minFreq.',
    'On put: if at capacity, evict from minFreq list (LRU end). Insert new key with freq=1, set minFreq=1.',
  ],
  inputFormat: 'Use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'LeetCode ex', input: 'cap=2; put(1,1);put(2,2);get(1);put(3,3);get(2);get(3);put(4,4);get(1);get(3);get(4)', expected: '1,-1,3,1,3,4' },
    { label: 'Cap=1',       input: 'cap=1; put(1,1);get(1);put(2,2);get(1);get(2)',                                        expected: '1,-1,2'         },
    { label: 'Overwrite',   input: 'cap=2; put(1,1);put(1,2);get(1)',                                                      expected: '2'               },
    { label: 'LRU tie-break',input:'cap=2; put(1,1);put(2,2);get(1);get(2);put(3,3);get(1);get(2);get(3)',                expected: '1,2,1,2,3'      },
  ],
  cppStarter: `class LFUCache {
    int cap, minFreq;
    unordered_map<int,pair<int,int>> kv;        // key -> {val, freq}
    unordered_map<int,list<int>> freqList;       // freq -> LRU list of keys
    unordered_map<int,list<int>::iterator> pos;  // key -> iterator in freqList
public:
    LFUCache(int capacity) : cap(capacity), minFreq(0) {}

    int get(int key) {

    }

    void put(int key, int value) {

    }
};`,
  pythonStarter: `from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity: int):


    def get(self, key: int) -> int:


    def put(self, key: int, value: int) -> None:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    LFUCache c(2);
    c.put(1,1);c.put(2,2);
    string got=to_string(c.get(1)); c.put(3,3);
    got+=","+to_string(c.get(2));
    got+=","+to_string(c.get(3)); c.put(4,4);
    got+=","+to_string(c.get(1));
    got+=","+to_string(c.get(3));
    got+=","+to_string(c.get(4));
    string exp="1,-1,3,1,3,4";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    cout<<"\\n---RESULT---\\n";
    auto ps=[&](string g,string e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){LFUCache c(2); c.put(1,1);c.put(2,2); string g=to_string(c.get(1)); c.put(3,3); g+=","+to_string(c.get(2)); g+=","+to_string(c.get(3)); c.put(4,4); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(3)); g+=","+to_string(c.get(4)); ps(g,"1,-1,3,1,3,4",1);}
    else if(tc==2){LFUCache c(1); c.put(1,1); string g=to_string(c.get(1)); c.put(2,2); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(2)); ps(g,"1,-1,2",2);}
    else if(tc==3){LFUCache c(2); c.put(1,1); c.put(1,2); ps(to_string(c.get(1)),"2",3);}
    else if(tc==4){LFUCache c(2); c.put(1,1);c.put(2,2); string g=to_string(c.get(1)); g+=","+to_string(c.get(2)); c.put(3,3); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(2)); g+=","+to_string(c.get(3)); ps(g,"1,2,1,2,3",4);}
    return 0;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
c=LFUCache(2); c.put(1,1); c.put(2,2)
r=[c.get(1)]; c.put(3,3); r.append(c.get(2)); r.append(c.get(3)); c.put(4,4)
r.append(c.get(1)); r.append(c.get(3)); r.append(c.get(4))
got=",".join(map(str,r)); exp="1,-1,3,1,3,4"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
passed=0; res=[]
def chk(n,fn,exp):
    global passed; got=fn(); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
def t1():
    c=LFUCache(2); c.put(1,1); c.put(2,2); r=[c.get(1)]; c.put(3,3); r.append(c.get(2)); r.append(c.get(3)); c.put(4,4); r.append(c.get(1)); r.append(c.get(3)); r.append(c.get(4)); return ",".join(map(str,r))
def t2():
    c=LFUCache(1); c.put(1,1); r=[c.get(1)]; c.put(2,2); r.append(c.get(1)); r.append(c.get(2)); return ",".join(map(str,r))
def t3():
    c=LFUCache(2); c.put(1,1); c.put(1,2); return str(c.get(1))
def t4():
    c=LFUCache(2); c.put(1,1); c.put(2,2); r=[c.get(1),c.get(2)]; c.put(3,3); r.append(c.get(1)); r.append(c.get(2)); r.append(c.get(3)); return ",".join(map(str,r))
chk(1,t1,"1,-1,3,1,3,4"); chk(2,t2,"1,-1,2"); chk(3,t3,"2"); chk(4,t4,"1,2,1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 5. Stock Span ────────────────────────────────────────────────────────
const stockSpan = {
  id: 'stock-span',
  title: 'Stock Span',
  difficulty: 'Medium',
  category: 'stacks-queues',
  askedBy: 'vjs',
  description: [
    "The <strong>stock span</strong> of a stock on a given day is the maximum number of consecutive days (up to and including today) for which the stock price was less than or equal to today's price.",
    'Design a class <code>StockSpanner</code> that collects daily prices and returns the span each time <code>next(price)</code> is called.',
  ],
  examples: [
    {
      input: 'next(100)→1, next(80)→1, next(60)→1, next(70)→2, next(60)→1, next(75)→4, next(85)→6',
      output: '[1,1,1,2,1,4,6]',
      explanation: 'next(75)→4 because the last 4 prices [75,60,70,60] are all ≤ 75.',
    },
    { input: 'next(10)→1, next(4)→1, next(5)→2, next(90)→4, next(120)→5, next(80)→1', output: '[1,1,2,4,5,1]' },
  ],
  constraints: ['1 ≤ price ≤ 10⁵', 'At most 10⁴ calls to next'],
  hints: [
    'Use a monotonic stack of (price, accumulated_span) pairs.',
    'For each price, pop all smaller/equal entries and add their spans to a running counter.',
    'Push (price, counter + 1) — the +1 counts today itself.',
    'This is O(n) amortised: each element is pushed and popped at most once.',
  ],
  submitTimeLimitMs: 100,
  submitTestCount: 6,
  inputFormat: 'Line 1: space-separated prices (fed to next() in order)',
  defaultCustomInput: '100 80 60 70 60 75 85',
  testCases: [
    { label: 'LeetCode Ex 1', input: 'prices=[100,80,60,70,60,75,85]', expected: '1,1,1,2,1,4,6' },
    { label: 'LeetCode Ex 2', input: 'prices=[10,4,5,90,120,80]',      expected: '1,1,2,4,5,1'  },
    { label: 'Increasing',    input: 'prices=[1,2,3,4,5]',             expected: '1,2,3,4,5'    },
    { label: 'Decreasing',    input: 'prices=[5,4,3,2,1]',             expected: '1,1,1,1,1'    },
  ],
  cppStarter: `class StockSpanner {
public:
    StockSpanner() {

    }

    int next(int price) {

    }
};`,
  pythonStarter: `class StockSpanner:
    def __init__(self):


    def next(self, price: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    // 136 run-length-encoded runs from a real 10k-call LeetCode test case
    const runsLit = `{{1,98},{2,88},{3,107},{4,87},{5,120},{6,110},{7,105},{8,105},{9,95},{10,97},{11,105},{12,102},{13,110},{14,115},{15,87},{72,1},{15,30},{16,101},{17,97},{18,108},{19,93},{20,103},{21,96},{22,109},{23,124},{24,102},{25,87},{26,79},{27,88},{28,91},{29,88},{30,85},{31,105},{32,86},{33,108},{34,118},{35,109},{36,95},{37,92},{38,72},{50,1},{38,35},{39,98},{40,95},{41,85},{42,87},{43,101},{44,102},{45,101},{46,89},{47,70},{91,1},{47,37},{48,87},{49,109},{50,32},{38,1},{50,72},{51,106},{52,95},{53,106},{54,87},{55,100},{56,88},{57,120},{58,114},{59,106},{60,65},{82,1},{60,27},{61,111},{62,10},{73,1},{62,89},{63,106},{64,93},{65,100},{66,96},{67,102},{68,107},{69,113},{70,30},{76,1},{70,58},{71,53},{94,1},{71,41},{72,72},{15,1},{72,32},{73,54},{62,1},{73,53},{74,93},{75,91},{76,77},{70,1},{76,29},{77,65},{94,1},{77,25},{78,82},{79,109},{80,101},{81,107},{82,14},{60,1},{82,80},{83,106},{84,85},{85,100},{86,108},{87,5},{100,1},{87,92},{88,106},{89,88},{90,102},{91,94},{47,1},{91,23},{92,99},{93,101},{94,59},{71,1},{94,26},{77,1},{94,2},{95,108},{96,87},{97,96},{98,86},{99,98},{100,92},{87,1},{100,15}}`
    if (mode === 'run') return `
int main() {
    StockSpanner obj;
    vector<int> p={100,80,60,70,60,75,85};
    string got="", exp="1,1,1,2,1,4,6";
    for(int i=0;i<(int)p.size();i++){if(i) got+=","; got+=to_string(obj.next(p[i]));}
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    cout<<"\\n---RESULT---\\n";
    auto ps=[&](string g,string e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){StockSpanner obj; string g=""; for(int v:{100,80,60,70,60,75,85}){if(g.size())g+=",";g+=to_string(obj.next(v));} ps(g,"1,1,1,2,1,4,6",1);}
    else if(tc==2){StockSpanner obj; string g=""; for(int v:{10,4,5,90,120,80}){if(g.size())g+=",";g+=to_string(obj.next(v));} ps(g,"1,1,2,4,5,1",2);}
    else if(tc==3){StockSpanner obj; string g=""; for(int v:{1,2,3,4,5}){if(g.size())g+=",";g+=to_string(obj.next(v));} ps(g,"1,2,3,4,5",3);}
    else if(tc==4){StockSpanner obj; string g=""; for(int v:{5,4,3,2,1}){if(g.size())g+=",";g+=to_string(obj.next(v));} ps(g,"1,1,1,1,1",4);}
    else if(tc==5){
        vector<pair<int,int>> runs=${runsLit};
        StockSpanner obj; long long s=0;
        for(auto& r:runs) for(int i=0;i<r.second;i++) s+=obj.next(r.first);
        bool ok=(s==7874520LL); cout<<"TEST:5:"<<(ok?"PASS:":"FAIL:")<<"7874520:"<<s<<"\\n";
    }
    else if(tc==6){
        StockSpanner obj; long long s=0;
        for(int i=1;i<=10000;i++) s+=obj.next(i);
        bool ok=(s==50005000LL); cout<<"TEST:6:"<<(ok?"PASS:":"FAIL:")<<"50005000:"<<s<<"\\n";
    }
    return 0;
}`
    if (mode === 'custom') {
      const p = (customInput.trim()||'100 80 60 70 60 75 85').split(/\s+/).map(Number)
      return `
int main() {
    StockSpanner obj;
    vector<int> p={${p.join(',')}};
    for(int i=0;i<(int)p.size();i++){if(i)cout<<",";cout<<obj.next(p[i]);}cout<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    const runsLit = `[(1,98),(2,88),(3,107),(4,87),(5,120),(6,110),(7,105),(8,105),(9,95),(10,97),(11,105),(12,102),(13,110),(14,115),(15,87),(72,1),(15,30),(16,101),(17,97),(18,108),(19,93),(20,103),(21,96),(22,109),(23,124),(24,102),(25,87),(26,79),(27,88),(28,91),(29,88),(30,85),(31,105),(32,86),(33,108),(34,118),(35,109),(36,95),(37,92),(38,72),(50,1),(38,35),(39,98),(40,95),(41,85),(42,87),(43,101),(44,102),(45,101),(46,89),(47,70),(91,1),(47,37),(48,87),(49,109),(50,32),(38,1),(50,72),(51,106),(52,95),(53,106),(54,87),(55,100),(56,88),(57,120),(58,114),(59,106),(60,65),(82,1),(60,27),(61,111),(62,10),(73,1),(62,89),(63,106),(64,93),(65,100),(66,96),(67,102),(68,107),(69,113),(70,30),(76,1),(70,58),(71,53),(94,1),(71,41),(72,72),(15,1),(72,32),(73,54),(62,1),(73,53),(74,93),(75,91),(76,77),(70,1),(76,29),(77,65),(94,1),(77,25),(78,82),(79,109),(80,101),(81,107),(82,14),(60,1),(82,80),(83,106),(84,85),(85,100),(86,108),(87,5),(100,1),(87,92),(88,106),(89,88),(90,102),(91,94),(47,1),(91,23),(92,99),(93,101),(94,59),(71,1),(94,26),(77,1),(94,2),(95,108),(96,87),(97,96),(98,86),(99,98),(100,92),(87,1),(100,15)]`
    if (mode === 'run') return `
obj = StockSpanner()
prices=[100,80,60,70,60,75,85]
got=",".join(str(obj.next(p)) for p in prices); exp="1,1,1,2,1,4,6"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
passed=0; res=[]
def chk(n, prices, exp):
    global passed
    obj=StockSpanner(); got=",".join(str(obj.next(p)) for p in prices)
    ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[100,80,60,70,60,75,85],"1,1,1,2,1,4,6")
chk(2,[10,4,5,90,120,80],"1,1,2,4,5,1")
chk(3,[1,2,3,4,5],"1,2,3,4,5")
chk(4,[5,4,3,2,1],"1,1,1,1,1")
# hidden: 10k prices (real LeetCode test), verify sum of spans = 7874520
runs=${runsLit}
obj=StockSpanner(); s=sum(obj.next(v) for v,c in runs for _ in range(c))
ok=(s==7874520); passed+=ok
res.append(f"TEST:5:{'PASS' if ok else 'FAIL'}:7874520:{s}")
# TLE sense: 10k strictly increasing prices — O(n^2) naive will time out
obj=StockSpanner(); s=sum(obj.next(i) for i in range(1,10001))
ok=(s==50005000); passed+=ok
res.append(f"TEST:6:{'PASS' if ok else 'FAIL'}:50005000:{s}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:6")`
    if (mode === 'custom') {
      const p = (customInput.trim()||'100 80 60 70 60 75 85').split(/\s+/).map(Number)
      return `
obj = StockSpanner()
prices=[${p.join(',')}]
print(",".join(str(obj.next(x)) for x in prices))`
    }
  },
}

// ── 6. Largest Rectangle in a Histogram ──────────────────────────────────
const largestRectangle = {
  id: 'largest-rectangle-histogram',
  title: 'Largest Rectangle in a Histogram',
  difficulty: 'Hard',
  category: 'stacks-queues',
  askedBy: 'vjs',
  description: [
    "Given an array of integers <code>heights</code> representing the histogram's bar heights (width 1 each), return the area of the largest rectangle in the histogram.",
  ],
  examples: [
    { input: 'heights=[2,1,5,6,2,3]', output: '10', explanation: 'Rectangle of height 5, width 2 (bars 2 and 3).' },
    { input: 'heights=[2,4]',         output: '4'  },
  ],
  constraints: ['1 ≤ heights.length ≤ 10⁵', '0 ≤ heights[i] ≤ 10⁴'],
  hints: [
    'Use a monotonic increasing stack. For each bar, when you encounter a smaller bar, pop and compute area.',
    "Popped bar's width extends from the new stack top + 1 to current index − 1.",
    'Push a sentinel 0 at the end to flush the stack.',
  ],
  inputFormat: 'Line 1: space-separated heights',
  defaultCustomInput: '2 1 5 6 2 3',
  testCases: [
    { label: 'Example 1', input: 'heights=[2,1,5,6,2,3]', expected: '10' },
    { label: 'Example 2', input: 'heights=[2,4]',         expected: '4'  },
    { label: 'Single',    input: 'heights=[5]',           expected: '5'  },
    { label: 'Flat',      input: 'heights=[3,3,3,3]',     expected: '12' },
  ],
  cppStarter: `class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> h={2,1,5,6,2,3};
    int got=sol.largestRectangleArea(h);
    cout<<"\\n---RESULT---\\n";
    if(got==10) cout<<"RESULT:PASS:10:"<<got<<"\\n";
    else        cout<<"RESULT:FAIL:10:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){vector<int> h={2,1,5,6,2,3};p(sol.largestRectangleArea(h),10,1);}
    else if(tc==2){vector<int> h={2,4};p(sol.largestRectangleArea(h),4,2);}
    else if(tc==3){vector<int> h={5};p(sol.largestRectangleArea(h),5,3);}
    else if(tc==4){vector<int> h={3,3,3,3};p(sol.largestRectangleArea(h),12,4);}
    return 0;
}`
    if (mode === 'custom') {
      const h = (customInput.trim()||'2 1 5 6 2 3').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> h={${join(h)}};
    cout<<sol.largestRectangleArea(h)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.largestRectangleArea([2,1,5,6,2,3])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==10 else 'FAIL'}:10:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([2,1,5,6,2,3],10),([2,4],4),([5],5),([3,3,3,3],12)]
passed=0; res=[]
for i,(h,exp) in enumerate(cases,1):
    got=sol.largestRectangleArea(list(h)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const h = (customInput.trim()||'2 1 5 6 2 3').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.largestRectangleArea([${h.join(',')}]))`
    }
  },
}

// ── 7. Sum of Subarray Minimums ──────────────────────────────────────────
const subarrayMins = {
  id: 'sum-subarray-minimums',
  title: 'Sum of Subarray Minimums',
  difficulty: 'Medium',
  category: 'stacks-queues',
  askedBy: 'vjs',
  description: [
    'Given an array of integers <code>arr</code>, find the sum of <code>min(b)</code> for every (contiguous) subarray <code>b</code>. Return the answer modulo <code>10⁹ + 7</code>.',
  ],
  examples: [
    { input: 'arr=[3,1,2,4]', output: '17', explanation: 'Subarrays: [3]=3, [1]=1, [2]=2, [4]=4, [3,1]=1, [1,2]=1, [2,4]=2, [3,1,2]=1, [1,2,4]=1, [3,1,2,4]=1. Sum=17.' },
    { input: 'arr=[11,81,94,43,3]', output: '444' },
  ],
  constraints: ['1 ≤ arr.length ≤ 3×10⁴', '1 ≤ arr[i] ≤ 3×10⁴'],
  hints: [
    'For each element arr[i], count how many subarrays have arr[i] as their minimum. Multiply arr[i] by that count.',
    'Use monotonic stacks to find: left[i] = distance to previous smaller element, right[i] = distance to next smaller or equal.',
    'Contribution of arr[i] = arr[i] × left[i] × right[i].',
  ],
  inputFormat: 'Line 1: space-separated integers',
  defaultCustomInput: '3 1 2 4',
  testCases: [
    { label: 'Example 1', input: 'arr=[3,1,2,4]',         expected: '17'  },
    { label: 'Example 2', input: 'arr=[11,81,94,43,3]',   expected: '444' },
    { label: 'Single',    input: 'arr=[5]',                expected: '5'   },
    { label: 'Equal',     input: 'arr=[1,1,1]',            expected: '6'   },
  ],
  cppStarter: `class Solution {
public:
    int sumSubarrayMins(vector<int>& arr) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def sumSubarrayMins(self, arr: List[int]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> a={3,1,2,4};
    int got=sol.sumSubarrayMins(a);
    cout<<"\\n---RESULT---\\n";
    if(got==17) cout<<"RESULT:PASS:17:"<<got<<"\\n";
    else        cout<<"RESULT:FAIL:17:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){vector<int> a={3,1,2,4};p(sol.sumSubarrayMins(a),17,1);}
    else if(tc==2){vector<int> a={11,81,94,43,3};p(sol.sumSubarrayMins(a),444,2);}
    else if(tc==3){vector<int> a={5};p(sol.sumSubarrayMins(a),5,3);}
    else if(tc==4){vector<int> a={1,1,1};p(sol.sumSubarrayMins(a),6,4);}
    return 0;
}`
    if (mode === 'custom') {
      const a = (customInput.trim()||'3 1 2 4').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> a={${join(a)}};
    cout<<sol.sumSubarrayMins(a)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.sumSubarrayMins([3,1,2,4])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==17 else 'FAIL'}:17:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([3,1,2,4],17),([11,81,94,43,3],444),([5],5),([1,1,1],6)]
passed=0; res=[]
for i,(a,exp) in enumerate(cases,1):
    got=sol.sumSubarrayMins(list(a)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const a = (customInput.trim()||'3 1 2 4').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.sumSubarrayMins([${a.join(',')}]))`
    }
  },
}

// ── 8. Maximum Rectangle ─────────────────────────────────────────────────
const maxRectangle = {
  id: 'maximum-rectangle',
  title: 'Maximum Rectangle',
  difficulty: 'Hard',
  category: 'stacks-queues',
  askedBy: 'vjs',
  description: [
    'Given a 2D binary matrix filled with <code>0</code>s and <code>1</code>s, find the largest rectangle containing only <code>1</code>s and return its area.',
  ],
  examples: [
    { input: 'matrix=[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: '6' },
    { input: 'matrix=[["0"]]', output: '0' },
  ],
  constraints: ['rows, cols ≤ 200', 'matrix[i][j] is "0" or "1"'],
  hints: [
    'Build a histogram row by row: heights[j] = number of consecutive 1s ending at current row in column j.',
    "Apply the \"Largest Rectangle in Histogram\" solution on each row's heights.",
    'Time O(rows × cols).',
  ],
  inputFormat: 'Each line: space-separated 0s and 1s (one row of the matrix)',
  defaultCustomInput: '1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0',
  testCases: [
    { label: 'Example 1', input: 'matrix=4×5 (see description)', expected: '6' },
    { label: 'All zeros', input: 'matrix=[["0"]]',               expected: '0' },
    { label: 'All ones',  input: 'matrix=2×2 all 1s',            expected: '4' },
    { label: '1 row',     input: 'matrix=[1,0,1,1,1]',           expected: '3' },
  ],
  cppStarter: `class Solution {
public:
    int maximalRectangle(vector<vector<char>>& matrix) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<vector<char>> m={{'1','0','1','0','0'},{'1','0','1','1','1'},{'1','1','1','1','1'},{'1','0','0','1','0'}};
    int got=sol.maximalRectangle(m);
    cout<<"\\n---RESULT---\\n";
    if(got==6) cout<<"RESULT:PASS:6:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:6:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int tc; cin>>tc;
    Solution sol;
    cout<<"\\n---RESULT---\\n";
    auto p=[&](int g,int e,int n){bool ok=g==e;cout<<"TEST:"<<n<<":"<<(ok?"PASS:":"FAIL:")<<e<<":"<<g<<"\\n";};
    if(tc==1){vector<vector<char>> m={{'1','0','1','0','0'},{'1','0','1','1','1'},{'1','1','1','1','1'},{'1','0','0','1','0'}};p(sol.maximalRectangle(m),6,1);}
    else if(tc==2){vector<vector<char>> m={{'0'}};p(sol.maximalRectangle(m),0,2);}
    else if(tc==3){vector<vector<char>> m={{'1','1'},{'1','1'}};p(sol.maximalRectangle(m),4,3);}
    else if(tc==4){vector<vector<char>> m={{'1','0','1','1','1'}};p(sol.maximalRectangle(m),3,4);}
    return 0;
}`
    if (mode === 'custom') {
      const rows = customInput.trim().split('\n').map(l => l.trim().split(/\s+/).map(c => c === '1' ? "'1'" : "'0'"))
      return `
int main() {
    Solution sol;
    vector<vector<char>> m={${rows.map(r=>`{${r.join(',')}}`).join(',')}};
    cout<<sol.maximalRectangle(m)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
m=[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
got=sol.maximalRectangle(m)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==6 else 'FAIL'}:6:{got}")`
    if (mode === 'submit') return `
sol = Solution()
passed=0; res=[]
def chk(n,m,exp):
    global passed
    got=sol.maximalRectangle(m); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]],6)
chk(2,[["0"]],0)
chk(3,[["1","1"],["1","1"]],4)
chk(4,[["1","0","1","1","1"]],3)
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') {
      const rows = customInput.trim().split('\n').map(l => JSON.stringify(l.trim().split(/\s+/)))
      return `
sol = Solution()
m=[${rows.join(',')}]
print(sol.maximalRectangle(m))`
    }
  },
}

export const PROBLEMS = [trappingRainWater, asteroidCollision, celebrityProblem, lfuCache, stockSpan, largestRectangle, subarrayMins, maxRectangle]

function TrappingRainWaterViz() {
  return <HistogramViz heights={[0,1,0,2,1,0,1,3,2,1,2,1]} waterFill={true} label="Blue bars = water trapped above each column" />
}

function LargestRectangleViz() {
  return <HistogramViz heights={[2,1,5,6,2,3]} highlight={[2,3]} label="Largest rectangle = 10 (bars at index 2,3 with height 5,6)" />
}

function MaxRectangleViz() {
  const grid = [
    ["1","0","1","0","0"],
    ["1","0","1","1","1"],
    ["1","1","1","1","1"],
    ["1","0","0","1","0"],
  ]
  const highlight = new Set(["1,2","1,3","1,4","2,2","2,3","2,4"])
  const cellSize = 32
  const svgW = grid[0].length * cellSize
  const svgH = grid.length * cellSize
  return (
    <div className="viz-label-wrap">
      <div className="viz-label">Max rectangle = 6 (highlighted region)</div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="viz-grid">
        {grid.map((row, r) => row.map((cell, c) => {
          const isHL = highlight.has(`${r},${c}`)
          return (
            <g key={`${r}-${c}`}>
              <rect x={c*cellSize} y={r*cellSize} width={cellSize-2} height={cellSize-2}
                fill={cell==='0' ? 'var(--surface-3)' : isHL ? 'var(--success)' : 'var(--accent)'}
                rx={4}
              />
              <text x={c*cellSize+cellSize/2} y={r*cellSize+cellSize/2+5} textAnchor="middle"
                fontSize={13} fill="var(--text)" fontFamily="monospace">{cell}</text>
            </g>
          )
        }))}
      </svg>
    </div>
  )
}

export const VIZ = {
  'trapping-rain-water': () => <TrappingRainWaterViz />,
  'largest-rectangle-histogram': () => <LargestRectangleViz />,
  'maximum-rectangle': () => <MaxRectangleViz />,
}
