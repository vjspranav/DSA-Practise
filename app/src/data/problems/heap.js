const join = arr => arr.join(', ')

// ── 1. Minimum Cost to Connect Sticks ──────────────────────────────────
const connectSticks = {
  id: 'connect-sticks',
  title: 'Minimum Cost to Connect Sticks',
  difficulty: 'Medium',
  category: 'heap',
  askedBy: 'himali',
  description: [
    'You have <code>n</code> sticks with given lengths. To connect two sticks the cost equals their combined length. Return the minimum cost to connect all sticks into one.',
  ],
  examples: [
    { input: 'sticks = [2,4,3]', output: '14', explanation: 'Connect 2+3=5 (cost 5), then 4+5=9 (cost 9). Total = 14.' },
    { input: 'sticks = [1,8,3,5]', output: '30' },
  ],
  constraints: ['1 ≤ sticks.length ≤ 10⁴', '1 ≤ sticks[i] ≤ 10⁴'],
  hints: [
    'Use a min-heap. Always merge the two smallest sticks.',
    'After merging, push the new stick back. Repeat until one stick remains.',
    'This is the same idea as Huffman encoding.',
  ],
  inputFormat: 'Line 1: space-separated stick lengths',
  defaultCustomInput: '2 4 3',
  testCases: [
    { label: 'Example 1', input: 'sticks=[2,4,3]',     expected: '14' },
    { label: 'Example 2', input: 'sticks=[1,8,3,5]',   expected: '30' },
    { label: 'Single',    input: 'sticks=[5]',          expected: '0'  },
    { label: 'Equal',     input: 'sticks=[1,1,1,1]',   expected: '8'  },
  ],
  cppStarter: `class Solution {
public:
    int connectSticks(vector<int>& sticks) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def connectSticks(self, sticks: List[int]) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> s={2,4,3};
    int got=sol.connectSticks(s);
    cout<<"\\n---RESULT---\\n";
    if(got==14) cout<<"RESULT:PASS:14:"<<got<<"\\n";
    else        cout<<"RESULT:FAIL:14:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> s,int exp,int n){
        int got=sol.connectSticks(s); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({2,4,3},14,1);
    chk({1,8,3,5},30,2);
    chk({5},0,3);
    chk({1,1,1,1},8,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const s = (customInput.trim()||'2 4 3').split(/\s+/).map(Number)
      return `
int main() {
    Solution sol;
    vector<int> s={${join(s)}};
    cout<<sol.connectSticks(s)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.connectSticks([2,4,3])
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==14 else 'FAIL'}:14:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([2,4,3],14),([1,8,3,5],30),([5],0),([1,1,1,1],8)]
passed=0; res=[]
for i,(s,exp) in enumerate(cases,1):
    got=sol.connectSticks(list(s)); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const s = (customInput.trim()||'2 4 3').split(/\s+/).map(Number)
      return `
sol = Solution()
print(sol.connectSticks([${s.join(',')}]))`
    }
  },
}

// ── 2. Find Median from Data Stream ────────────────────────────────────
const medianStream = {
  id: 'find-median-data-stream',
  title: 'Find Median from Data Stream',
  difficulty: 'Hard',
  category: 'heap',
  askedBy: 'himali',
  description: [
    'Design a data structure that supports adding integers from a stream and finding the median at any point.',
    'Implement <code>addNum(num)</code> and <code>findMedian()</code>. Median is the middle value; if even count, it\'s the average of the two middle values.',
  ],
  examples: [
    { input: 'addNum(1); addNum(2); findMedian(); addNum(3); findMedian()', output: '1.50, 2.00' },
  ],
  constraints: ['-10⁵ ≤ num ≤ 10⁵', 'At most 5×10⁴ calls'],
  hints: [
    'Use two heaps: a max-heap for the lower half, a min-heap for the upper half.',
    'Keep them balanced (size difference ≤ 1). The max-heap\'s top (or average of both tops) is the median.',
    'On addNum: add to max-heap, move max-heap top to min-heap, rebalance if min-heap is larger.',
  ],
  inputFormat: 'Sequence of operations (use run/submit modes)',
  defaultCustomInput: '',
  testCases: [
    { label: 'Three nums',  input: 'add(1),add(2),median,add(3),median', expected: '1.50,2.00'      },
    { label: 'Even count',  input: 'add(1),add(3),median',               expected: '2.00'           },
    { label: 'Odd count',   input: 'add(1),add(2),add(3),median',        expected: '2.00'           },
    { label: 'Negatives',   input: 'add(-1),add(-2),add(-3),median',     expected: '-2.00'          },
  ],
  cppStarter: `class MedianFinder {
    priority_queue<int> lo;                            // max-heap (lower half)
    priority_queue<int,vector<int>,greater<int>> hi;   // min-heap (upper half)
public:
    MedianFinder() {}

    void addNum(int num) {

    }

    double findMedian() {

    }
};`,
  pythonStarter: `import heapq

class MedianFinder:
    def __init__(self):


    def addNum(self, num: int) -> None:


    def findMedian(self) -> float:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    MedianFinder mf;
    mf.addNum(1); mf.addNum(2);
    double m1=mf.findMedian();
    mf.addNum(3);
    double m2=mf.findMedian();
    string got="",exp="1.50,2.00";
    ostringstream o1; o1<<fixed<<setprecision(2)<<m1; got+=o1.str();
    ostringstream o2; o2<<fixed<<setprecision(2)<<m2; got+=","+o2.str();
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int passed=0,total=4; vector<string> res;
    auto fmt=[](double v){ostringstream o;o<<fixed<<setprecision(2)<<v;return o.str();};
    {MedianFinder mf; mf.addNum(1);mf.addNum(2);string g=fmt(mf.findMedian());mf.addNum(3);g+=","+fmt(mf.findMedian());
     bool ok=g=="1.50,2.00";passed+=ok;res.push_back("TEST:1"+(ok?string(":PASS:"):string(":FAIL:"))+"1.50,2.00:"+g);}
    {MedianFinder mf; mf.addNum(1);mf.addNum(3);string g=fmt(mf.findMedian());
     bool ok=g=="2.00";passed+=ok;res.push_back("TEST:2"+(ok?string(":PASS:"):string(":FAIL:"))+"2.00:"+g);}
    {MedianFinder mf; mf.addNum(1);mf.addNum(2);mf.addNum(3);string g=fmt(mf.findMedian());
     bool ok=g=="2.00";passed+=ok;res.push_back("TEST:3"+(ok?string(":PASS:"):string(":FAIL:"))+"2.00:"+g);}
    {MedianFinder mf; mf.addNum(-1);mf.addNum(-2);mf.addNum(-3);string g=fmt(mf.findMedian());
     bool ok=g=="-2.00";passed+=ok;res.push_back("TEST:4"+(ok?string(":PASS:"):string(":FAIL:"))+"-2.00:"+g);}
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":4\\n";
    return passed==4?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
mf=MedianFinder(); mf.addNum(1); mf.addNum(2)
m1=mf.findMedian(); mf.addNum(3); m2=mf.findMedian()
got=f"{m1:.2f},{m2:.2f}"; exp="1.50,2.00"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
passed=0; res=[]
def chk(n,ops,exp):
    global passed
    mf=MedianFinder(); got_parts=[]
    for op,*args in ops:
        if op=="add": mf.addNum(args[0])
        else: got_parts.append(f"{mf.findMedian():.2f}")
    got=",".join(got_parts); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[("add",1),("add",2),("med",),("add",3),("med",)],"1.50,2.00")
chk(2,[("add",1),("add",3),("med",)],"2.00")
chk(3,[("add",1),("add",2),("add",3),("med",)],"2.00")
chk(4,[("add",-1),("add",-2),("add",-3),("med",)],"-2.00")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 3. Merge K Sorted Lists ─────────────────────────────────────────────
const mergeKLists = {
  id: 'merge-k-sorted-lists',
  title: 'Merge K Sorted Lists',
  difficulty: 'Hard',
  category: 'heap',
  askedBy: 'himali',
  description: [
    'Given an array of <code>k</code> sorted linked lists, merge them all into one sorted linked list and return it.',
  ],
  examples: [
    { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
    { input: 'lists = []', output: '[]' },
  ],
  constraints: ['0 ≤ k ≤ 10⁴', '0 ≤ total nodes ≤ 5×10⁴', '-10⁴ ≤ node.val ≤ 10⁴'],
  hints: [
    'Use a min-heap of size k. Initially push the head of each list.',
    'Pop the minimum node, add to result, push its next node (if any).',
    'Total complexity O(N log k) where N = total nodes.',
  ],
  inputFormat: 'Each line: space-separated values of one sorted list',
  defaultCustomInput: '1 4 5\n1 3 4\n2 6',
  testCases: [
    { label: 'Example',   input: 'lists=[[1,4,5],[1,3,4],[2,6]]', expected: '1,1,2,3,4,4,5,6' },
    { label: 'Empty',     input: 'lists=[]',                      expected: ''                 },
    { label: 'One list',  input: 'lists=[[1,2,3]]',               expected: '1,2,3'            },
    { label: 'Singles',   input: 'lists=[[3],[1],[2]]',           expected: '1,2,3'            },
  ],
  cppStarter: `struct ListNode {
    int val; ListNode* next;
    ListNode(int x):val(x),next(nullptr){}
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {

    }
};`,
  pythonStarter: `from typing import List, Optional

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        `,
  buildCppHarness(mode, customInput = '') {
    const helpers = `
ListNode* makeList(vector<int> v){ListNode* h=nullptr,*t=nullptr;for(int x:v){auto n=new ListNode(x);if(!h)h=t=n;else{t->next=n;t=n;}}return h;}
string listToStr(ListNode* h){string s;while(h){if(s.size())s+=",";s+=to_string(h->val);h=h->next;}return s;}`
    if (mode === 'run') return `
${helpers}
int main() {
    Solution sol;
    vector<ListNode*> ls={makeList({1,4,5}),makeList({1,3,4}),makeList({2,6})};
    string got=listToStr(sol.mergeKLists(ls));
    string exp="1,1,2,3,4,4,5,6";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
${helpers}
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<vector<int>> vv,string exp,int n){
        vector<ListNode*> ls; for(auto& v:vv) ls.push_back(makeList(v));
        string got=listToStr(sol.mergeKLists(ls)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({{1,4,5},{1,3,4},{2,6}},"1,1,2,3,4,4,5,6",1);
    chk({},"",2);
    chk({{1,2,3}},"1,2,3",3);
    chk({{3},{1},{2}},"1,2,3",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lists = customInput.trim().split('\n').map(l => l.trim()).filter(Boolean)
      const lsCode = lists.map(l => `makeList({${l.split(/\s+/).join(',')}})`).join(',')
      return `
${helpers}
int main() {
    Solution sol;
    vector<ListNode*> ls={${lsCode}};
    cout<<listToStr(sol.mergeKLists(ls))<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
def makeList(v):
    h=None
    for x in reversed(v): n=ListNode(x); n.next=h; h=n
    return h
def listStr(h):
    r=[]
    while h: r.append(h.val); h=h.next
    return ",".join(map(str,r))
sol=Solution()
ls=[makeList([1,4,5]),makeList([1,3,4]),makeList([2,6])]
got=listStr(sol.mergeKLists(ls)); exp="1,1,2,3,4,4,5,6"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
def makeList(v):
    h=None
    for x in reversed(v): n=ListNode(x); n.next=h; h=n
    return h
def listStr(h):
    r=[]
    while h: r.append(h.val); h=h.next
    return ",".join(map(str,r))
sol=Solution(); passed=0; res=[]
def chk(n,vv,exp):
    global passed
    ls=[makeList(v) for v in vv]
    got=listStr(sol.mergeKLists(ls)); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[[1,4,5],[1,3,4],[2,6]],"1,1,2,3,4,4,5,6")
chk(2,[],"")
chk(3,[[1,2,3]],"1,2,3")
chk(4,[[3],[1],[2]],"1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') {
      const lists = customInput.trim().split('\n').map(l => JSON.stringify(l.trim().split(/\s+/).map(Number)))
      return `
def makeList(v):
    h=None
    for x in reversed(v): n=ListNode(x); n.next=h; h=n
    return h
def listStr(h):
    r=[]
    while h: r.append(h.val); h=h.next
    return ",".join(map(str,r))
sol=Solution()
ls=[makeList(v) for v in [${lists.join(',')}]]
print(listStr(sol.mergeKLists(ls)))`
    }
  },
}

// ── 4. Hand of Straights ────────────────────────────────────────────────
const handOfStraights = {
  id: 'hand-of-straights',
  title: 'Hand of Straights',
  difficulty: 'Medium',
  category: 'heap',
  askedBy: 'himali',
  description: [
    'A player wants to rearrange a hand of cards into groups of <code>groupSize</code> consecutive cards.',
    'Return <code>true</code> if it\'s possible, <code>false</code> otherwise.',
  ],
  examples: [
    { input: 'hand=[1,2,3,6,2,3,4,7,8], groupSize=3', output: 'true',  explanation: '[1,2,3], [2,3,4], [6,7,8]' },
    { input: 'hand=[1,2,3,4,5], groupSize=4',          output: 'false', explanation: 'Cannot form groups of 4.' },
  ],
  constraints: ['1 ≤ hand.length ≤ 10⁴', '0 ≤ hand[i] ≤ 10⁹', '1 ≤ groupSize ≤ hand.length'],
  hints: [
    'Count frequencies. Use a sorted map (or sorted keys + counter).',
    'Greedily start each group from the smallest available card.',
    'If hand.length % groupSize != 0, return false immediately.',
  ],
  inputFormat: 'Line 1: space-separated card values\nLine 2: groupSize',
  defaultCustomInput: '1 2 3 6 2 3 4 7 8\n3',
  testCases: [
    { label: 'Example 1', input: 'hand=[1,2,3,6,2,3,4,7,8], groupSize=3', expected: '1' },
    { label: 'Example 2', input: 'hand=[1,2,3,4,5], groupSize=4',         expected: '0' },
    { label: 'Size 1',    input: 'hand=[1,2,3], groupSize=1',              expected: '1' },
    { label: 'Gap',       input: 'hand=[1,2,4,5], groupSize=2',            expected: '1' },
  ],
  cppStarter: `class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> h={1,2,3,6,2,3,4,7,8};
    int got=sol.isNStraightHand(h,3)?1:0;
    cout<<"\\n---RESULT---\\n";
    if(got==1) cout<<"RESULT:PASS:1:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:1:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> h,int g,int exp,int n){
        int got=sol.isNStraightHand(h,g)?1:0; bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,3,6,2,3,4,7,8},3,1,1);
    chk({1,2,3,4,5},4,0,2);
    chk({1,2,3},1,1,3);
    chk({1,2,4,5},2,1,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const h = (lines[0]||'1 2 3 6 2 3 4 7 8').trim().split(/\s+/).map(Number)
      const g = parseInt(lines[1]??'3')
      return `
int main() {
    Solution sol;
    vector<int> h={${join(h)}};
    cout<<(sol.isNStraightHand(h,${g})?1:0)<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=1 if sol.isNStraightHand([1,2,3,6,2,3,4,7,8],3) else 0
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==1 else 'FAIL'}:1:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([1,2,3,6,2,3,4,7,8],3,1),([1,2,3,4,5],4,0),([1,2,3],1,1),([1,2,4,5],2,1)]
passed=0; res=[]
for i,(h,g,exp) in enumerate(cases,1):
    got=1 if sol.isNStraightHand(list(h),g) else 0; ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const h = (lines[0]||'1 2 3 6 2 3 4 7 8').trim().split(/\s+/).map(Number)
      const g = parseInt(lines[1]??'3')
      return `
sol = Solution()
print(1 if sol.isNStraightHand([${h.join(',')}],${g}) else 0)`
    }
  },
}

// ── 5. Task Scheduler ───────────────────────────────────────────────────
const taskScheduler = {
  id: 'task-scheduler',
  title: 'Task Scheduler',
  difficulty: 'Medium',
  category: 'heap',
  askedBy: 'vjs',
  description: [
    'Given a list of CPU tasks and a cooldown <code>n</code> (same task must wait <code>n</code> intervals before running again), return the minimum number of intervals to execute all tasks.',
    'CPU can be idle during cooldown.',
  ],
  examples: [
    { input: 'tasks=["A","A","A","B","B","B"], n=2', output: '8', explanation: 'A→B→idle→A→B→idle→A→B. 8 intervals.' },
    { input: 'tasks=["A","A","A","B","B","B"], n=0', output: '6' },
  ],
  constraints: ['1 ≤ tasks.length ≤ 10⁴', '0 ≤ n ≤ 100'],
  hints: [
    'Count task frequencies. The most frequent task determines the lower bound.',
    'Formula: max(len(tasks), (maxFreq - 1) * (n + 1) + countOfMaxFreq).',
    'Alternatively: simulate with a max-heap and a cooldown queue.',
  ],
  inputFormat: 'Line 1: space-separated tasks (e.g., A B A B)\nLine 2: n',
  defaultCustomInput: 'A A A B B B\n2',
  testCases: [
    { label: 'Example 1', input: 'tasks=[A,A,A,B,B,B], n=2', expected: '8' },
    { label: 'n=0',       input: 'tasks=[A,A,A,B,B,B], n=0', expected: '6' },
    { label: 'All same',  input: 'tasks=[A,A,A], n=2',        expected: '7' },
    { label: 'Diverse',   input: 'tasks=[A,B,C,D,E,F], n=2', expected: '6' },
  ],
  cppStarter: `class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<char> t={'A','A','A','B','B','B'};
    int got=sol.leastInterval(t,2);
    cout<<"\\n---RESULT---\\n";
    if(got==8) cout<<"RESULT:PASS:8:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:8:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<char> t,int n,int exp,int tc){
        int got=sol.leastInterval(t,n); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(tc)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({'A','A','A','B','B','B'},2,8,1);
    chk({'A','A','A','B','B','B'},0,6,2);
    chk({'A','A','A'},2,7,3);
    chk({'A','B','C','D','E','F'},2,6,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const tasks = (lines[0]||'A A A B B B').trim().split(/\s+/)
      const n = parseInt(lines[1]??'2')
      return `
int main() {
    Solution sol;
    vector<char> t={${tasks.map(c=>`'${c}'`).join(',')}};
    cout<<sol.leastInterval(t,${n})<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=sol.leastInterval(list("AAABBB"),2)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==8 else 'FAIL'}:8:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[(list("AAABBB"),2,8),(list("AAABBB"),0,6),(list("AAA"),2,7),(list("ABCDEF"),2,6)]
passed=0; res=[]
for i,(t,n,exp) in enumerate(cases,1):
    got=sol.leastInterval(list(t),n); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const tasks = (lines[0]||'A A A B B B').trim().split(/\s+/)
      const n = parseInt(lines[1]??'2')
      return `
sol = Solution()
print(sol.leastInterval(${JSON.stringify(tasks)},${n}))`
    }
  },
}

// ── 6. Kth Largest Element in a Stream ────────────────────────────────
const kthLargestStream = {
  id: 'kth-largest-stream',
  title: 'Kth Largest Element in a Stream',
  difficulty: 'Medium',
  category: 'heap',
  askedBy: 'vjs',
  description: [
    'Design a class to find the <code>k</code>-th largest element in a stream of integers.',
    'Implement <code>KthLargest(k, nums)</code> constructor and <code>add(val)</code> which returns the k-th largest after inserting <code>val</code>.',
  ],
  examples: [
    { input: 'KthLargest(3,[4,5,8,2]); add(3); add(5); add(10); add(9); add(4)', output: '[4,5,5,8,8]' },
  ],
  constraints: ['1 ≤ k', '0 ≤ nums.length', '-10⁴ ≤ nums[i], val ≤ 10⁴'],
  hints: [
    'Maintain a min-heap of size k — the heap\'s top is always the k-th largest.',
    'On add: push val. If heap size > k, pop the minimum.',
    'Return heap top.',
  ],
  inputFormat: 'Use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'LeetCode ex', input: 'k=3, nums=[4,5,8,2], adds=[3,5,10,9,4]', expected: '4,5,5,8,8' },
    { label: 'k=1',         input: 'k=1, nums=[1,2], adds=[3,1,1]',           expected: '3,3,3'     },
    { label: 'Empty init',  input: 'k=1, nums=[], adds=[1,2,3]',              expected: '1,2,3'     },
    { label: 'k=2',         input: 'k=2, nums=[0], adds=[1,2,3]',             expected: '0,1,2'     },
  ],
  cppStarter: `class KthLargest {
    int k;
    priority_queue<int,vector<int>,greater<int>> pq; // min-heap of size k
public:
    KthLargest(int k, vector<int>& nums) {

    }

    int add(int val) {

    }
};`,
  pythonStarter: `import heapq
from typing import List

class KthLargest:
    def __init__(self, k: int, nums: List[int]):


    def add(self, val: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    vector<int> nums={4,5,8,2};
    KthLargest kl(3,nums);
    string got="",exp="4,5,5,8,8";
    for(int v:{3,5,10,9,4}){if(got.size())got+=",";got+=to_string(kl.add(v));}
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int passed=0,total=4; vector<string> res;
    auto run=[](int k,vector<int> n,vector<int> adds){
        KthLargest kl(k,n); string s;
        for(int v:adds){if(s.size())s+=",";s+=to_string(kl.add(v));}
        return s;
    };
    auto chk=[&](int k,vector<int> n,vector<int> a,string exp,int t){
        string got=run(k,n,a); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(t)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk(3,{4,5,8,2},{3,5,10,9,4},"4,5,5,8,8",1);
    chk(1,{1,2},{3,1,1},"3,3,3",2);
    chk(1,{},{1,2,3},"1,2,3",3);
    chk(2,{0},{1,2,3},"0,1,2",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
kl=KthLargest(3,[4,5,8,2])
got=",".join(str(kl.add(v)) for v in [3,5,10,9,4]); exp="4,5,5,8,8"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
passed=0; res=[]
def chk(n,k,nums,adds,exp):
    global passed
    kl=KthLargest(k,nums); got=",".join(str(kl.add(v)) for v in adds)
    ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,3,[4,5,8,2],[3,5,10,9,4],"4,5,5,8,8")
chk(2,1,[1,2],[3,1,1],"3,3,3")
chk(3,1,[],[1,2,3],"1,2,3")
chk(4,2,[0],[1,2,3],"0,1,2")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 7. Design Twitter ───────────────────────────────────────────────────
const designTwitter = {
  id: 'design-twitter',
  title: 'Design Twitter',
  difficulty: 'Medium',
  category: 'heap',
  askedBy: 'vjs',
  description: [
    'Design a simplified Twitter where users can post tweets, follow/unfollow other users, and see the 10 most recent tweets in their news feed.',
    'Implement: <code>postTweet(userId, tweetId)</code>, <code>getNewsFeed(userId)</code> (10 most recent from self + followees), <code>follow(followerId, followeeId)</code>, <code>unfollow(followerId, followeeId)</code>.',
  ],
  examples: [
    { input: 'postTweet(1,5); getNewsFeed(1); follow(1,2); postTweet(2,6); getNewsFeed(1); unfollow(1,2); getNewsFeed(1)', output: '[[5],[6,5],[5]]' },
  ],
  constraints: ['1 ≤ userId, followeeId ≤ 500', '0 ≤ tweetId ≤ 10⁴', 'At most 3×10⁴ calls'],
  hints: [
    'Store tweets as (timestamp, tweetId). Use a global counter for timestamps.',
    'getNewsFeed: collect tweets from userId and all followees, return top 10 by timestamp using a max-heap.',
    'follow/unfollow: maintain a set of followees per user.',
  ],
  inputFormat: 'Use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'LeetCode ex', input: 'postTweet(1,5);feed(1);follow(1,2);postTweet(2,6);feed(1);unfollow(1,2);feed(1)', expected: '[5],[6,5],[5]' },
    { label: 'Self feed',   input: 'postTweet(1,1);postTweet(1,2);feed(1)',                                            expected: '[2,1]'          },
    { label: 'No tweets',   input: 'feed(1)',                                                                           expected: '[]'             },
    { label: 'Top 10',      input: 'post 11 tweets for user 1, feed(1)',                                                expected: '[11,10,9,8,7,6,5,4,3,2]' },
  ],
  cppStarter: `class Twitter {
    int ts = 0;
    unordered_map<int, vector<pair<int,int>>> tweets; // userId -> [(ts, tweetId)]
    unordered_map<int, unordered_set<int>> following;
public:
    Twitter() {}

    void postTweet(int userId, int tweetId) {

    }

    vector<int> getNewsFeed(int userId) {

    }

    void follow(int followerId, int followeeId) {

    }

    void unfollow(int followerId, int followeeId) {

    }
};`,
  pythonStarter: `from typing import List
import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):


    def postTweet(self, userId: int, tweetId: int) -> None:


    def getNewsFeed(self, userId: int) -> List[int]:


    def follow(self, followerId: int, followeeId: int) -> None:


    def unfollow(self, followerId: int, followeeId: int) -> None:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmtFeed = `auto fmtFeed=[](vector<int> v){string s="[";for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s+"]";};`
    if (mode === 'run') return `
int main() {
    Twitter t; ${fmtFeed}
    t.postTweet(1,5);
    string got=fmtFeed(t.getNewsFeed(1));
    t.follow(1,2); t.postTweet(2,6);
    got+=","+fmtFeed(t.getNewsFeed(1));
    t.unfollow(1,2);
    got+=","+fmtFeed(t.getNewsFeed(1));
    string exp="[5],[6,5],[5]";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    int passed=0,total=4; vector<string> res;
    auto fmtFeed=[](vector<int> v){string s="[";for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s+"]";};
    {Twitter t; t.postTweet(1,5); string g=fmtFeed(t.getNewsFeed(1)); t.follow(1,2); t.postTweet(2,6); g+=","+fmtFeed(t.getNewsFeed(1)); t.unfollow(1,2); g+=","+fmtFeed(t.getNewsFeed(1));
     bool ok=g=="[5],[6,5],[5]"; passed+=ok; res.push_back("TEST:1"+(ok?string(":PASS:"):string(":FAIL:"))+"[5],[6,5],[5]:"+g);}
    {Twitter t; t.postTweet(1,1); t.postTweet(1,2); string g=fmtFeed(t.getNewsFeed(1));
     bool ok=g=="[2,1]"; passed+=ok; res.push_back("TEST:2"+(ok?string(":PASS:"):string(":FAIL:"))+"[2,1]:"+g);}
    {Twitter t; string g=fmtFeed(t.getNewsFeed(1));
     bool ok=g=="[]"; passed+=ok; res.push_back("TEST:3"+(ok?string(":PASS:"):string(":FAIL:"))+"[]:"+g);}
    {Twitter t; for(int i=1;i<=11;i++) t.postTweet(1,i); string g=fmtFeed(t.getNewsFeed(1));
     bool ok=g=="[11,10,9,8,7,6,5,4,3,2]"; passed+=ok; res.push_back("TEST:4"+(ok?string(":PASS:"):string(":FAIL:"))+"[11,10,9,8,7,6,5,4,3,2]:"+g);}
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":4\\n";
    return passed==4?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
t=Twitter(); t.postTweet(1,5)
g=[str(t.getNewsFeed(1)).replace(" ","")]
t.follow(1,2); t.postTweet(2,6); g.append(str(t.getNewsFeed(1)).replace(" ",""))
t.unfollow(1,2); g.append(str(t.getNewsFeed(1)).replace(" ",""))
got=",".join(g); exp="[5],[6,5],[5]"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
passed=0; res=[]
def chk(n,fn,exp):
    global passed; got=fn().replace(" ",""); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
def t1():
    t=Twitter(); t.postTweet(1,5); g=[str(t.getNewsFeed(1))]
    t.follow(1,2); t.postTweet(2,6); g.append(str(t.getNewsFeed(1)))
    t.unfollow(1,2); g.append(str(t.getNewsFeed(1)))
    return ",".join(g)
chk(1,t1,"[5],[6,5],[5]")
def t2():
    t=Twitter(); t.postTweet(1,1); t.postTweet(1,2); return str(t.getNewsFeed(1))
chk(2,t2,"[2,1]")
def t3():
    t=Twitter(); return str(t.getNewsFeed(1))
chk(3,t3,"[]")
def t4():
    t=Twitter()
    for i in range(1,12): t.postTweet(1,i)
    return str(t.getNewsFeed(1))
chk(4,t4,"[11,10,9,8,7,6,5,4,3,2]")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 8. Maximum Sum Combination ──────────────────────────────────────────
const maxSumCombination = {
  id: 'maximum-sum-combination',
  title: 'Maximum Sum Combination',
  difficulty: 'Medium',
  category: 'heap',
  askedBy: 'vjs',
  description: [
    'Given two integer arrays <code>A</code> and <code>B</code>, each of length <code>n</code>, find the top <code>k</code> maximum sums of pairs <code>A[i] + B[j]</code>.',
    'Return them in descending order.',
  ],
  examples: [
    { input: 'A=[3,2], B=[1,4], k=2', output: '[7,6]', explanation: 'A[0]+B[1]=7, A[0]+B[0]=6 or A[1]+B[1]=6.' },
    { input: 'A=[1,4,2,3], B=[2,5,1,4], k=3', output: '[9,8,8]' },
  ],
  constraints: ['1 ≤ n ≤ 10³', '1 ≤ A[i], B[i] ≤ 10⁴', '1 ≤ k ≤ n'],
  hints: [
    'Sort both arrays in descending order.',
    'Use a max-heap initialized with (A[0]+B[0], 0, 0). Use a visited set to avoid duplicates.',
    'Pop the max, record it, push (i+1, j) and (i, j+1) if not visited.',
  ],
  inputFormat: 'Line 1: A values\nLine 2: B values\nLine 3: k',
  defaultCustomInput: '3 2\n1 4\n2',
  testCases: [
    { label: 'Example 1', input: 'A=[3,2], B=[1,4], k=2',          expected: '7,6' },
    { label: 'Example 2', input: 'A=[1,4,2,3], B=[2,5,1,4], k=3',  expected: '9,8,8' },
    { label: 'k=1',       input: 'A=[1,2,3], B=[4,5,6], k=1',       expected: '9' },
    { label: 'All',       input: 'A=[1,2], B=[3,4], k=4',           expected: '6,5,5,4' },
  ],
  cppStarter: `class Solution {
public:
    vector<int> maxSumCombination(vector<int>& A, vector<int>& B, int k) {

    }
};`,
  pythonStarter: `from typing import List

class Solution:
    def maxSumCombination(self, A: List[int], B: List[int], k: int) -> List[int]:
        `,
  buildCppHarness(mode, customInput = '') {
    const fmtV = `auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`
    if (mode === 'run') return `
int main() {
    Solution sol; ${fmtV}
    vector<int> A={3,2}, B={1,4};
    string got=fmtV(sol.maxSumCombination(A,B,2)), exp="7,6";
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
    auto chk=[&](vector<int> A,vector<int> B,int k,string exp,int n){
        string got=fmtV(sol.maxSumCombination(A,B,k)); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({3,2},{1,4},2,"7,6",1);
    chk({1,4,2,3},{2,5,1,4},3,"9,8,8",2);
    chk({1,2,3},{4,5,6},1,"9",3);
    chk({1,2},{3,4},4,"6,5,5,4",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const A = (lines[0]||'3 2').trim().split(/\s+/).map(Number)
      const B = (lines[1]||'1 4').trim().split(/\s+/).map(Number)
      const k = parseInt(lines[2]??'2')
      return `
int main() {
    Solution sol;
    vector<int> A={${join(A)}}, B={${join(B)}};
    auto r=sol.maxSumCombination(A,B,${k});
    for(int i=0;i<(int)r.size();i++){if(i)cout<<",";cout<<r[i];}cout<<"\\n";
    return 0;
}`
    }
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
got=",".join(map(str,sol.maxSumCombination([3,2],[1,4],2))); exp="7,6"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
sol = Solution()
cases=[([3,2],[1,4],2,"7,6"),([1,4,2,3],[2,5,1,4],3,"9,8,8"),([1,2,3],[4,5,6],1,"9"),([1,2],[3,4],4,"6,5,5,4")]
passed=0; res=[]
for i,(A,B,k,exp) in enumerate(cases,1):
    got=",".join(map(str,sol.maxSumCombination(list(A),list(B),k))); ok=got==exp; passed+=ok
    res.append(f"TEST:{i}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:{len(cases)}")`
    if (mode === 'custom') {
      const lines = customInput.trim().split('\n')
      const A = (lines[0]||'3 2').trim().split(/\s+/).map(Number)
      const B = (lines[1]||'1 4').trim().split(/\s+/).map(Number)
      const k = parseInt(lines[2]??'2')
      return `
sol = Solution()
print(",".join(map(str,sol.maxSumCombination([${A.join(',')}],[${B.join(',')}],${k}))))`
    }
  },
}

export const PROBLEMS = [connectSticks, medianStream, mergeKLists, handOfStraights, taskScheduler, kthLargestStream, designTwitter, maxSumCombination]
