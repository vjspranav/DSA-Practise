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
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> h,int exp,int n){
        int got=sol.trap(h); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({0,1,0,2,1,0,1,3,2,1,2,1},6,1);
    chk({4,2,0,3,2,5},9,2);
    chk({3,3,3,3},0,3);
    chk({3,0,3},3,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
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
    Solution sol;
    auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,string exp,int n){
        string got=fmtV(sol.asteroidCollision(a)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({5,10,-5},"5,10",1);
    chk({8,-8},"",2);
    chk({10,2,-5},"10",3);
    chk({-2,-1,1,2},"-2,-1,1,2",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
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
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<vector<int>> m,int exp,int n){
        int got=sol.celebrity((int)m.size(),m); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({{0,0,1,0},{0,0,1,0},{0,0,0,0},{0,0,1,0}},2,1);
    chk({{0,1},{0,0}},1,2);
    chk({{0,1,0},{0,0,1},{1,0,0}},-1,3);
    chk({{0,1,1},{0,0,1},{0,0,0}},2,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
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
    int passed=0,total=4; vector<string> res;
    {LFUCache c(2); c.put(1,1);c.put(2,2); string g=to_string(c.get(1)); c.put(3,3); g+=","+to_string(c.get(2)); g+=","+to_string(c.get(3)); c.put(4,4); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(3)); g+=","+to_string(c.get(4));
     bool ok=g=="1,-1,3,1,3,4"; passed+=ok; res.push_back("TEST:1"+(ok?string(":PASS:"):string(":FAIL:"))+"1,-1,3,1,3,4:"+g);}
    {LFUCache c(1); c.put(1,1); string g=to_string(c.get(1)); c.put(2,2); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(2));
     bool ok=g=="1,-1,2"; passed+=ok; res.push_back("TEST:2"+(ok?string(":PASS:"):string(":FAIL:"))+"1,-1,2:"+g);}
    {LFUCache c(2); c.put(1,1); c.put(1,2); string g=to_string(c.get(1));
     bool ok=g=="2"; passed+=ok; res.push_back("TEST:3"+(ok?string(":PASS:"):string(":FAIL:"))+"2:"+g);}
    {LFUCache c(2); c.put(1,1);c.put(2,2); string g=to_string(c.get(1)); g+=","+to_string(c.get(2)); c.put(3,3); g+=","+to_string(c.get(1)); g+=","+to_string(c.get(2)); g+=","+to_string(c.get(3));
     bool ok=g=="1,2,1,2,3"; passed+=ok; res.push_back("TEST:4"+(ok?string(":PASS:"):string(":FAIL:"))+"1,2,1,2,3:"+g);}
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":4\\n";
    return passed==4?0:1;
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
    "The stock span of a stock on a given day is the maximum number of consecutive days (including today) for which the stock price was less than or equal to today's price.",
    'Given an array of daily prices, return the span for each day.',
  ],
  examples: [
    { input: 'prices=[100,80,60,70,60,75,85]', output: '[1,1,1,2,1,4,6]' },
    { input: 'prices=[10,4,5,90,120,80]',       output: '[1,1,2,4,5,1]'  },
  ],
  constraints: ['1 ≤ prices.length ≤ 10⁵', '1 ≤ prices[i] ≤ 10⁵'],
  hints: [
    'Use a monotonic stack of (price, span) pairs.',
    'For each price, pop all smaller/equal prices from the stack and accumulate their spans.',
    'Push current (price, accumulated_span) onto the stack.',
  ],
  inputFormat: 'Line 1: space-separated prices',
  defaultCustomInput: '100 80 60 70 60 75 85',
  testCases: [
    { label: 'Example 1', input: 'prices=[100,80,60,70,60,75,85]', expected: '1,1,1,2,1,4,6' },
    { label: 'Example 2', input: 'prices=[10,4,5,90,120,80]',       expected: '1,1,2,4,5,1'  },
    { label: 'Increasing',input: 'prices=[1,2,3,4,5]',              expected: '1,2,3,4,5'    },
    { label: 'Decreasing',input: 'prices=[5,4,3,2,1]',              expected: '1,1,1,1,1'    },
  ],
  cppStarter: `class Solution {
public:
    vector<int> calculateSpan(vector<int>& prices) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def calculateSpan(self, prices: List[int]) -> List[int]:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmtV = `auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`
    if (mode === 'run') return `
int main() {
    Solution sol; ${fmtV}
    vector<int> p={100,80,60,70,60,75,85};
    string got=fmtV(sol.calculateSpan(p)), exp="1,1,1,2,1,4,6";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> p,string exp,int n){
        string got=fmtV(sol.calculateSpan(p)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({100,80,60,70,60,75,85},"1,1,1,2,1,4,6",1);
    chk({10,4,5,90,120,80},"1,1,2,4,5,1",2);
    chk({1,2,3,4,5},"1,2,3,4,5",3);
    chk({5,4,3,2,1},"1,1,1,1,1",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const p = (customInput.trim()||'100 80 60 70 60 75 85').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> p={${join(p)}};
    auto r=sol.calculateSpan(p);
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=",".join(map(str,sol.calculateSpan([100,80,60,70,60,75,85]))); exp="1,1,1,2,1,4,6"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([100,80,60,70,60,75,85],"1,1,1,2,1,4,6"),([10,4,5,90,120,80],"1,1,2,4,5,1"),([1,2,3,4,5],"1,2,3,4,5"),([5,4,3,2,1],"1,1,1,1,1")]
passed=0; res=[]
for i,(p,exp) in enumerate(cases,1):
    got=",".join(map(str,sol.calculateSpan(list(p)))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const p = (customInput.trim()||'100 80 60 70 60 75 85').split(/\s+/).map(Number)
      return `
sol = Solution()
print(",".join(map(str,sol.calculateSpan([${p.join(',')}]))))`
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
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> h,int exp,int n){
        int got=sol.largestRectangleArea(h); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({2,1,5,6,2,3},10,1);
    chk({2,4},4,2);
    chk({5},5,3);
    chk({3,3,3,3},12,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
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
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,int exp,int n){
        int got=sol.sumSubarrayMins(a); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({3,1,2,4},17,1);
    chk({11,81,94,43,3},444,2);
    chk({5},5,3);
    chk({1,1,1},6,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
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
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<vector<char>> m,int exp,int n){
        int got=sol.maximalRectangle(m); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({{'1','0','1','0','0'},{'1','0','1','1','1'},{'1','1','1','1','1'},{'1','0','0','1','0'}},6,1);
    chk({{'0'}},0,2);
    chk({{'1','1'},{'1','1'}},4,3);
    chk({{'1','0','1','1','1'}},3,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
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
                fill={cell==='0' ? 'var(--surface0)' : isHL ? 'var(--green)' : 'var(--blue)'}
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
