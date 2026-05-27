const join = arr => arr.join(', ')

// ── 1. Fractional Knapsack ──────────────────────────────────────────────
const fractionalKnapsack = {
  id: 'fractional-knapsack',
  title: 'Fractional Knapsack',
  difficulty: 'Easy',
  category: 'greedy',
  askedBy: 'himali',
  description: [
    'Given weights and values of <code>n</code> items and a knapsack capacity <code>W</code>, find the maximum total value you can carry.',
    'Unlike 0/1 knapsack, you can take <strong>fractions</strong> of an item.',
  ],
  examples: [
    { input: 'W=50, val=[60,100,120], wt=[10,20,30]', output: '240.00', explanation: 'Take all of item 0 (60), all of item 1 (100), 20/30 of item 2 (80). Total = 240.' },
    { input: 'W=10, val=[500], wt=[30]', output: '166.67', explanation: 'Take 10/30 of the item: 500 × (10/30) ≈ 166.67.' },
  ],
  constraints: ['1 ≤ n ≤ 1000', '1 ≤ W ≤ 10⁶', '1 ≤ val[i], wt[i] ≤ 10⁶'],
  hints: [
    'Sort items by value/weight ratio in descending order.',
    'Greedily fill the knapsack: take as much of the best-ratio item as possible, then move to the next.',
    'If the knapsack can fit an entire item, add its full value; otherwise add a fraction.',
  ],
  inputFormat: 'Line 1: W\nLine 2: space-separated values\nLine 3: space-separated weights',
  defaultCustomInput: '50\n60 100 120\n10 20 30',
  testCases: [
    { label: 'Example 1', input: 'W=50, val=[60,100,120], wt=[10,20,30]', expected: '240.00' },
    { label: 'Fraction',  input: 'W=10, val=[500], wt=[30]',              expected: '166.67' },
    { label: 'W=0',       input: 'W=0, val=[60,100], wt=[10,20]',         expected: '0.00'   },
    { label: 'Exact fit', input: 'W=30, val=[60,100,120], wt=[10,20,30]', expected: '160.00' },
  ],
  cppStarter: `class Solution {
public:
    double fractionalKnapsack(int W, vector<int>& val, vector<int>& wt) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def fractionalKnapsack(self, W: int, val: List[int], wt: List[int]) -> float:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> val={60,100,120}, wt={10,20,30};
    double got = sol.fractionalKnapsack(50, val, wt);
    cout << "\\n---RESULT---\\n";
    if (abs(got-240.0)<0.01) cout << "RESULT:PASS:240.00:" << fixed << setprecision(2) << got << "\\n";
    else                     cout << "RESULT:FAIL:240.00:" << fixed << setprecision(2) << got << "\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4;
    vector<string> res;
    auto chk=[&](int W,vector<int> v,vector<int> w,double exp,int n){
        double got=sol.fractionalKnapsack(W,v,w);
        bool ok=abs(got-exp)<0.01; passed+=ok;
        ostringstream o; o<<fixed<<setprecision(2)<<exp; string es=o.str();
        ostringstream g; g<<fixed<<setprecision(2)<<got; string gs=g.str();
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+es+":"+gs);
    };
    chk(50,{60,100,120},{10,20,30},240.0,1);
    chk(10,{500},{30},500.0/3.0,2);
    chk(0,{60,100},{10,20},0.0,3);
    chk(30,{60,100,120},{10,20,30},160.0,4);
    cout << "\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const W = parseInt(lines[0]??'50')
      const val = (lines[1]||'60 100 120').trim().split(/\s+/).map(Number)
      const wt  = (lines[2]||'10 20 30').trim().split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> val={${join(val)}}, wt={${join(wt)}};
    cout << fixed << setprecision(2) << sol.fractionalKnapsack(${W}, val, wt) << "\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.fractionalKnapsack(50,[60,100,120],[10,20,30])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if abs(got-240.0)<0.01 else 'FAIL'}:240.00:{got:.2f}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[(50,[60,100,120],[10,20,30],240.0),(10,[500],[30],500/3),(0,[60,100],[10,20],0.0),(30,[60,100,120],[10,20,30],160.0)]
passed=0; res=[]
for i,(W,v,w,exp) in enumerate(cases,1):
    got=sol.fractionalKnapsack(W,list(v),list(w)); ok=abs(got-exp)<0.01; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp:.2f}:{got:.2f}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const W = parseInt(lines[0]??'50')
      const val = (lines[1]||'60 100 120').trim().split(/\s+/).map(Number)
      const wt  = (lines[2]||'10 20 30').trim().split(/\s+/).map(Number)
      return `
sol = Solution()
print(f"{sol.fractionalKnapsack(${W},[${val.join(',')}],[${wt.join(',')}]):.2f}")`
    }
  },
}

// ── 2. Minimum Coins ────────────────────────────────────────────────────
const minimumCoins = {
  id: 'minimum-coins',
  title: 'Minimum Coins',
  difficulty: 'Easy',
  category: 'greedy',
  askedBy: 'himali',
  description: [
    'Given coin denominations and an amount, return the minimum number of coins needed to make that amount using a greedy approach.',
    'Denominations are given in sorted order and satisfy the greedy property (each denomination divides the next).',
  ],
  examples: [
    { input: 'coins=[1,5,10,25], amount=36', output: '3', explanation: '25 + 10 + 1 = 36 using 3 coins.' },
    { input: 'coins=[1,5,10,25], amount=30', output: '2', explanation: '25 + 5 = 30 using 2 coins.' },
  ],
  constraints: ['1 ≤ coins.length ≤ 10', '1 ≤ coins[i] ≤ 10⁴', '0 ≤ amount ≤ 10⁴'],
  hints: [
    'Sort denominations in descending order.',
    'Greedily pick the largest coin that fits. Subtract it from the amount and repeat.',
    'This works when denominations are canonical (e.g., 1,5,10,25). For arbitrary denominations, use DP.',
  ],
  inputFormat: 'Line 1: space-separated coin values\nLine 2: amount',
  defaultCustomInput: '1 5 10 25\n36',
  testCases: [
    { label: 'Example 1', input: 'coins=[1,5,10,25], amount=36',  expected: '3' },
    { label: 'Example 2', input: 'coins=[1,5,10,25], amount=30',  expected: '2' },
    { label: 'Zero',      input: 'coins=[1,5,10,25], amount=0',   expected: '0' },
    { label: '4 coins',   input: 'coins=[1,5,10,25], amount=100', expected: '4' },
  ],
  cppStarter: `class Solution {
public:
    int minCoins(vector<int>& coins, int amount) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def minCoins(self, coins: List[int], amount: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> c={1,5,10,25};
    int got=sol.minCoins(c,36);
    cout<<"\\n---RESULT---\\n";
    if(got==3) cout<<"RESULT:PASS:3:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:3:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> c,int a,int exp,int n){
        int got=sol.minCoins(c,a); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,5,10,25},36,3,1);
    chk({1,5,10,25},30,2,2);
    chk({1,5,10,25},0,0,3);
    chk({1,5,10,25},100,4,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const coins = (lines[0]||'1 5 10 25').trim().split(/\s+/).map(Number)
      const amount = parseInt(lines[1]??'36')
      return `
int main() {
    Solution sol;
    vector<int> c={${join(coins)}};
    cout<<sol.minCoins(c,${amount})<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.minCoins([1,5,10,25],36)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([1,5,10,25],36,3),([1,5,10,25],30,2),([1,5,10,25],0,0),([1,5,10,25],100,4)]
passed=0; res=[]
for i,(c,a,exp) in enumerate(cases,1):
    got=sol.minCoins(list(c),a); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const coins = (lines[0]||'1 5 10 25').trim().split(/\s+/).map(Number)
      const amount = parseInt(lines[1]??'36')
      return `
sol = Solution()
print(sol.minCoins([${coins.join(',')}],${amount}))`
    }
  },
}

// ── 3. Minimum Platforms ────────────────────────────────────────────────
const minPlatforms = {
  id: 'minimum-platforms',
  title: 'Minimum Platforms (Railway Station)',
  difficulty: 'Medium',
  category: 'greedy',
  askedBy: 'himali',
  description: [
    'Given arrival and departure times of trains at a station, find the minimum number of platforms needed so no train waits.',
    'Trains arrive and depart at times given as integers (e.g., 900 = 9:00 AM).',
  ],
  examples: [
    { input: 'arr=[900,940,950,1100,1500,1800], dep=[910,1200,1120,1130,1900,2000]', output: '3',
      explanation: 'At 9:50 three trains overlap: the 9:00, 9:40, and 9:50 arrivals.' },
    { input: 'arr=[900,1100], dep=[1100,1200]', output: '1',
      explanation: 'First train departs when second arrives — 1 platform suffices.' },
  ],
  constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ arr[i] < dep[i] ≤ 2359'],
  hints: [
    'Sort arrivals and departures separately.',
    'Use two pointers: increment platform count when a train arrives before the earliest remaining departure.',
    'Track the running max of platforms needed.',
  ],
  inputFormat: 'Line 1: space-separated arrival times\nLine 2: space-separated departure times',
  defaultCustomInput: '900 940 950 1100 1500 1800\n910 1200 1120 1130 1900 2000',
  testCases: [
    { label: 'Example 1', input: 'arr=[900,940,950,1100,1500,1800], dep=[910,1200,1120,1130,1900,2000]', expected: '3' },
    { label: 'Example 2', input: 'arr=[900,1100], dep=[1100,1200]',                                      expected: '1' },
    { label: 'Single',    input: 'arr=[900], dep=[910]',                                                  expected: '1' },
    { label: 'All overlap',input: 'arr=[100,200,300,400], dep=[500,600,700,800]',                         expected: '4' },
  ],
  cppStarter: `class Solution {
public:
    int findPlatform(vector<int>& arr, vector<int>& dep) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def findPlatform(self, arr: List[int], dep: List[int]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> a={900,940,950,1100,1500,1800}, d={910,1200,1120,1130,1900,2000};
    int got=sol.findPlatform(a,d);
    cout<<"\\n---RESULT---\\n";
    if(got==3) cout<<"RESULT:PASS:3:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:3:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,vector<int> d,int exp,int n){
        int got=sol.findPlatform(a,d); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({900,940,950,1100,1500,1800},{910,1200,1120,1130,1900,2000},3,1);
    chk({900,1100},{1100,1200},1,2);
    chk({900},{910},1,3);
    chk({100,200,300,400},{500,600,700,800},4,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const arr = (lines[0]||'900 940 950 1100 1500 1800').trim().split(/\s+/).map(Number)
      const dep = (lines[1]||'910 1200 1120 1130 1900 2000').trim().split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> a={${join(arr)}}, d={${join(dep)}};
    cout<<sol.findPlatform(a,d)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.findPlatform([900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000],3),([900,1100],[1100,1200],1),([900],[910],1),([100,200,300,400],[500,600,700,800],4)]
passed=0; res=[]
for i,(a,d,exp) in enumerate(cases,1):
    got=sol.findPlatform(list(a),list(d)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const arr = (lines[0]||'900 940 950 1100 1500 1800').trim().split(/\s+/).map(Number)
      const dep = (lines[1]||'910 1200 1120 1130 1900 2000').trim().split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.findPlatform([${arr.join(',')}],[${dep.join(',')}]))`
    }
  },
}

// ── 4. Candy ────────────────────────────────────────────────────────────
const candy = {
  id: 'candy',
  title: 'Candy',
  difficulty: 'Hard',
  category: 'greedy',
  askedBy: 'himali',
  description: [
    'There are <code>n</code> children with ratings. Give each child at least 1 candy. Children with a higher rating than their immediate neighbour must receive more candies.',
    'Return the minimum total number of candies.',
  ],
  examples: [
    { input: 'ratings = [1,0,2]', output: '5', explanation: 'Give [2,1,2]. Total = 5.' },
    { input: 'ratings = [1,2,2]', output: '4', explanation: 'Give [1,2,1]. The third child does not need more than the second since ratings are equal.' },
  ],
  constraints: ['n ≥ 1', '0 ≤ ratings[i] ≤ 2×10⁴'],
  hints: [
    'Two-pass greedy: initialise all candies to 1.',
    'Left-to-right pass: if ratings[i] > ratings[i-1], candies[i] = candies[i-1] + 1.',
    'Right-to-left pass: if ratings[i] > ratings[i+1], candies[i] = max(candies[i], candies[i+1] + 1). Sum the result.',
  ],
  inputFormat: 'Line 1: space-separated ratings',
  defaultCustomInput: '1 0 2',
  testCases: [
    { label: 'Example 1', input: 'ratings=[1,0,2]',         expected: '5'  },
    { label: 'Example 2', input: 'ratings=[1,2,2]',         expected: '4'  },
    { label: 'Descending',input: 'ratings=[3,2,1]',         expected: '6'  },
    { label: 'Valley',    input: 'ratings=[1,2,3,4,3,2,1]', expected: '16' },
  ],
  cppStarter: `class Solution {
public:
    int candy(vector<int>& ratings) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def candy(self, ratings: List[int]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> r={1,0,2};
    int got=sol.candy(r);
    cout<<"\\n---RESULT---\\n";
    if(got==5) cout<<"RESULT:PASS:5:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:5:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> r,int exp,int n){
        int got=sol.candy(r); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,0,2},5,1);
    chk({1,2,2},4,2);
    chk({3,2,1},6,3);
    chk({1,2,3,4,3,2,1},16,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const ratings = (customInput.trim()||'1 0 2').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> r={${join(ratings)}};
    cout<<sol.candy(r)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = sol.candy([1,0,2])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==5 else 'FAIL'}:5:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([1,0,2],5),([1,2,2],4),([3,2,1],6),([1,2,3,4,3,2,1],16)]
passed=0; res=[]
for i,(r,exp) in enumerate(cases,1):
    got=sol.candy(list(r)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const ratings = (customInput.trim()||'1 0 2').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.candy([${ratings.join(',')}]))`
    }
  },
}

// ── 5. Jump Game ────────────────────────────────────────────────────────
const jumpGame = {
  id: 'jump-game',
  title: 'Jump Game',
  difficulty: 'Medium',
  category: 'greedy',
  askedBy: 'vjs',
  description: [
    'Given an array <code>nums</code> where <code>nums[i]</code> is your maximum jump length from index <code>i</code>, return <code>true</code> if you can reach the last index starting from index 0.',
  ],
  examples: [
    { input: 'nums = [2,3,1,1,4]', output: 'true',  explanation: 'Jump 1 step to index 1, then 3 steps to the last index.' },
    { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'You always reach index 3, which has jump 0 — you are stuck.' },
  ],
  constraints: ['1 ≤ nums.length ≤ 3×10⁴', '0 ≤ nums[i] ≤ 10⁵'],
  hints: [
    'Track the furthest index reachable at each step.',
    'At index i, update max_reach = max(max_reach, i + nums[i]).',
    'If you ever reach an index beyond max_reach, return false. If max_reach ≥ last index, return true.',
  ],
  inputFormat: 'Line 1: space-separated integers',
  defaultCustomInput: '2 3 1 1 4',
  testCases: [
    { label: 'Can reach',  input: 'nums=[2,3,1,1,4]',  expected: '1' },
    { label: 'Stuck',      input: 'nums=[3,2,1,0,4]',  expected: '0' },
    { label: 'Single',     input: 'nums=[0]',           expected: '1' },
    { label: 'Long zero',  input: 'nums=[1,1,1,1,0]',  expected: '1' },
  ],
  cppStarter: `class Solution {
public:
    bool canJump(vector<int>& nums) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> n={2,3,1,1,4};
    int got=sol.canJump(n)?1:0;
    cout<<"\\n---RESULT---\\n";
    if(got==1) cout<<"RESULT:PASS:1:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:1:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> n,int exp,int t){
        int got=sol.canJump(n)?1:0; bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(t)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({2,3,1,1,4},1,1);
    chk({3,2,1,0,4},0,2);
    chk({0},1,3);
    chk({1,1,1,1,0},1,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'2 3 1 1 4').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> n={${join(nums)}};
    cout<<(sol.canJump(n)?1:0)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = 1 if sol.canJump([2,3,1,1,4]) else 0
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==1 else 'FAIL'}:1:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([2,3,1,1,4],1),([3,2,1,0,4],0),([0],1),([1,1,1,1,0],1)]
passed=0; res=[]
for i,(n,exp) in enumerate(cases,1):
    got=1 if sol.canJump(list(n)) else 0; ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const nums = (customInput.trim()||'2 3 1 1 4').split(/\s+/).map(Number)
      return `
sol = Solution()
print(1 if sol.canJump([${nums.join(',')}]) else 0)`
    }
  },
}

// ── 6. LRU Cache ────────────────────────────────────────────────────────
const lruCache = {
  id: 'lru-cache',
  title: 'LRU Cache',
  difficulty: 'Medium',
  category: 'greedy',
  askedBy: 'vjs',
  description: [
    'Design a data structure that follows the constraints of a <strong>Least Recently Used (LRU)</strong> cache.',
    'Implement <code>LRUCache(capacity)</code>, <code>get(key)</code> (return value or -1 if missing), and <code>put(key, value)</code> (insert/update; evict LRU if at capacity).',
    'Both operations must run in <code>O(1)</code> average time.',
  ],
  examples: [
    { input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2); put(4,4); get(1); get(3); get(4)',
      output: '[1,-1,-1,3,4]',
      explanation: 'After put(3,3), key 2 is evicted (LRU). After put(4,4), key 1 is evicted.' },
  ],
  constraints: ['1 ≤ capacity ≤ 3000', '0 ≤ key, value ≤ 10⁴', 'At most 2×10⁵ calls'],
  hints: [
    'Use a doubly-linked list to track usage order (most recent at head, LRU at tail).',
    'Use a hash map from key → list node for O(1) access.',
    'On get/put: move the node to the head. On eviction: remove the tail node.',
  ],
  inputFormat: 'Sequence of operations (run mode uses hardcoded sequence)',
  defaultCustomInput: '',
  testCases: [
    { label: 'LeetCode ex', input: 'cap=2; put(1,1);put(2,2);get(1);put(3,3);get(2);put(4,4);get(1);get(3);get(4)', expected: '1,-1,-1,3,4' },
    { label: 'Cap 1',       input: 'cap=1; put(2,1);get(2);put(3,2);get(2);get(3)',                                  expected: '1,-1,2'       },
    { label: 'Overwrite',   input: 'cap=2; put(1,1);put(2,2);put(1,10);get(1)',                                      expected: '10'           },
    { label: 'Miss',        input: 'cap=2; put(1,1);get(2)',                                                          expected: '-1'           },
  ],
  cppStarter: `class LRUCache {
    int cap;
    list<pair<int,int>> lst;
    unordered_map<int, list<pair<int,int>>::iterator> mp;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {

    }

    void put(int key, int value) {

    }
};`,
  pythonStarter: `class LRUCache:
    def __init__(self, capacity: int):


    def get(self, key: int) -> int:


    def put(self, key: int, value: int) -> None:
        `,
  buildCppHarness(mode, customInput = '') {
    const seq1 = `
    LRUCache c(2);
    c.put(1,1); c.put(2,2);
    string got="";
    got+=to_string(c.get(1)); c.put(3,3);
    got+=","+to_string(c.get(2)); c.put(4,4);
    got+=","+to_string(c.get(1));
    got+=","+to_string(c.get(3));
    got+=","+to_string(c.get(4));`
    if (mode === 'run') return `
int main() {${seq1}
    cout<<"\\n---RESULT---\\n";
    string exp="1,-1,-1,3,4";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int passed=0,total=4; vector<string> res;
    {${seq1}
     string exp="1,-1,-1,3,4"; bool ok=got==exp; passed+=ok;
     res.push_back("TEST:1"+(ok?string(":PASS:"):string(":FAIL:"))+exp+":"+got);}
    {LRUCache c(1); c.put(2,1); string got=to_string(c.get(2)); c.put(3,2); got+=","+to_string(c.get(2)); got+=","+to_string(c.get(3));
     string exp="1,-1,2"; bool ok=got==exp; passed+=ok;
     res.push_back("TEST:2"+(ok?string(":PASS:"):string(":FAIL:"))+exp+":"+got);}
    {LRUCache c(2); c.put(1,1); c.put(2,2); c.put(1,10); string got=to_string(c.get(1));
     string exp="10"; bool ok=got==exp; passed+=ok;
     res.push_back("TEST:3"+(ok?string(":PASS:"):string(":FAIL:"))+exp+":"+got);}
    {LRUCache c(2); c.put(1,1); string got=to_string(c.get(2));
     string exp="-1"; bool ok=got==exp; passed+=ok;
     res.push_back("TEST:4"+(ok?string(":PASS:"):string(":FAIL:"))+exp+":"+got);}
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":4\\n";
    return passed==4?0:1;
}`
    if (mode === 'custom') return `
int main() {
    cout << "Use run/submit mode for LRU Cache" << "\\n";
    return 0;
}`
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
c = LRUCache(2)
c.put(1,1); c.put(2,2)
r = [c.get(1)]
c.put(3,3); r.append(c.get(2)); c.put(4,4)
r.append(c.get(1)); r.append(c.get(3)); r.append(c.get(4))
got=",".join(map(str,r))
exp="1,-1,-1,3,4"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
passed=0; res=[]
def chk(n,got,exp):
    global passed
    ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
c=LRUCache(2); c.put(1,1); c.put(2,2); r=[c.get(1)]; c.put(3,3); r.append(c.get(2)); c.put(4,4); r.append(c.get(1)); r.append(c.get(3)); r.append(c.get(4))
chk(1,",".join(map(str,r)),"1,-1,-1,3,4")
c=LRUCache(1); c.put(2,1); r=[c.get(2)]; c.put(3,2); r.append(c.get(2)); r.append(c.get(3))
chk(2,",".join(map(str,r)),"1,-1,2")
c=LRUCache(2); c.put(1,1); c.put(2,2); c.put(1,10)
chk(3,str(c.get(1)),"10")
c=LRUCache(2); c.put(1,1)
chk(4,str(c.get(2)),"-1")
print("\\n---RESULT---")
for r2 in res: print(r2)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `
print("Use run/submit mode for LRU Cache")`
  },
}

// ── 7. Merge Intervals ──────────────────────────────────────────────────
const mergeIntervals = {
  id: 'merge-intervals',
  title: 'Merge Intervals',
  difficulty: 'Medium',
  category: 'greedy',
  askedBy: 'vjs',
  description: [
    'Given an array of intervals, merge all overlapping intervals and return the result.',
  ],
  examples: [
    { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    { input: 'intervals = [[1,4],[4,5]]',                output: '[[1,5]]' },
  ],
  constraints: ['1 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2', '0 ≤ start ≤ end ≤ 10⁴'],
  hints: [
    'Sort intervals by start time.',
    'Iterate: if current interval overlaps with the last merged interval, extend it. Otherwise add it.',
    'Two intervals overlap if current.start ≤ merged.end.',
  ],
  inputFormat: 'Each line: start end (one interval per line)',
  defaultCustomInput: '1 3\n2 6\n8 10\n15 18',
  testCases: [
    { label: 'Example 1', input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]' },
    { label: 'Example 2', input: '[[1,4],[4,5]]',                expected: '[[1,5]]'               },
    { label: 'No overlap',input: '[[1,2],[3,4],[5,6]]',          expected: '[[1,2],[3,4],[5,6]]'   },
    { label: 'One swallows',input:'[[1,10],[2,3],[4,5]]',        expected: '[[1,10]]'               },
  ],
  cppStarter: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmt = `auto fmt=[](vector<vector<int>> v){string s="[";for(int i=0;i<(int)v.size();i++){s+="["+to_string(v[i][0])+","+to_string(v[i][1])+"]";if(i+1<(int)v.size())s+=",";}return s+"]";};`
    if (mode === 'run') return `
int main() {
    Solution sol;
    ${fmt}
    vector<vector<int>> iv={{1,3},{2,6},{8,10},{15,18}};
    string got=fmt(sol.merge(iv)), exp="[[1,6],[8,10],[15,18]]";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    ${fmt}
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<vector<int>> iv,string exp,int n){
        string got=fmt(sol.merge(iv)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({{1,3},{2,6},{8,10},{15,18}},"[[1,6],[8,10],[15,18]]",1);
    chk({{1,4},{4,5}},"[[1,5]]",2);
    chk({{1,2},{3,4},{5,6}},"[[1,2],[3,4],[5,6]]",3);
    chk({{1,10},{2,3},{4,5}},"[[1,10]]",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const pairs = customInput.trim().split('\n').map(l => l.trim().split(/\s+/).map(Number)).filter(p => p.length === 2)
      const iv = pairs.map(([a,b]) => `{${a},${b}}`).join(',')
      return `
int main() {
    Solution sol;
    vector<vector<int>> iv={${iv}};
    auto r=sol.merge(iv);
    cout<<"[";
    for(int i=0;i<(int)r.size();i++){cout<<"["<<r[i][0]<<","<<r[i][1]<<"]";if(i+1<(int)r.size())cout<<",";}
    cout<<"]\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = str(sol.merge([[1,3],[2,6],[8,10],[15,18]])).replace(" ","")
exp = "[[1,6],[8,10],[15,18]]"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
sol = Solution()
passed=0; res=[]
def chk(n,iv,exp):
    global passed
    got=str(sol.merge(iv)).replace(" ",""); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[[1,3],[2,6],[8,10],[15,18]],"[[1,6],[8,10],[15,18]]")
chk(2,[[1,4],[4,5]],"[[1,5]]")
chk(3,[[1,2],[3,4],[5,6]],"[[1,2],[3,4],[5,6]]")
chk(4,[[1,10],[2,3],[4,5]],"[[1,10]]")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') {
      const pairs = customInput.trim().split('\n').map(l => JSON.stringify(l.trim().split(/\s+/).map(Number)))
      return `
sol = Solution()
iv = [${pairs.join(',')}]
print(sol.merge(iv))`
    }
  },
}

// ── 8. Valid Parentheses ────────────────────────────────────────────────
const validParentheses = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  difficulty: 'Easy',
  category: 'greedy',
  askedBy: 'vjs',
  description: [
    'Given a string containing only <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>[</code>, <code>]</code>, determine if the input string is valid.',
    'A string is valid if every open bracket is closed by the correct type in the correct order.',
  ],
  examples: [
    { input: 's = "()"',      output: 'true'  },
    { input: 's = "()[]{}"', output: 'true'  },
    { input: 's = "(]"',      output: 'false' },
  ],
  constraints: ['1 ≤ s.length ≤ 10⁴', 's consists only of parentheses characters'],
  hints: [
    'Use a stack. Push opening brackets. On closing bracket, check if top of stack matches.',
    'If stack is empty at a closing bracket, or top does not match, return false.',
    'After scanning, return true only if the stack is empty.',
  ],
  inputFormat: 'Line 1: bracket string',
  defaultCustomInput: '()[]{}',
  testCases: [
    { label: 'Valid pair',    input: 's="()"',       expected: '1' },
    { label: 'Mixed valid',   input: 's="()[]{}"',   expected: '1' },
    { label: 'Mismatch',      input: 's="(]"',       expected: '0' },
    { label: 'Interleaved',   input: 's="([)]"',     expected: '0' },
  ],
  cppStarter: `class Solution {
public:
    bool isValid(string s) {

    }
};`,
  pythonStarter: `class Solution:
    def isValid(self, s: str) -> bool:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    int got=sol.isValid("()")?1:0;
    cout<<"\\n---RESULT---\\n";
    if(got==1) cout<<"RESULT:PASS:1:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:1:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](string s,int exp,int n){
        int got=sol.isValid(s)?1:0; bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk("()",1,1);
    chk("()[]{}",1,2);
    chk("(]",0,3);
    chk("([)]",0,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const raw = customInput.trim() || '()[]{}'
      const escaped = raw.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      return `
int main() {
    Solution sol;
    cout<<(sol.isValid("${escaped}")?1:0)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got = 1 if sol.isValid("()") else 0
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==1 else 'FAIL'}:1:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[("()",1),("()[]{}",1),("(]",0),("([)]",0)]
passed=0; res=[]
for i,(s,exp) in enumerate(cases,1):
    got=1 if sol.isValid(s) else 0; ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const raw = customInput.trim() || '()[]{}'
      const escaped = raw.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      return `
sol = Solution()
print(1 if sol.isValid("${escaped}") else 0)`
    }
  },
}

export const PROBLEMS = [fractionalKnapsack, minimumCoins, minPlatforms, candy, jumpGame, lruCache, mergeIntervals, validParentheses]
