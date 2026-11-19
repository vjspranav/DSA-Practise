// C++ Learn lessons: stage 7 (part b), the STL mapped from Python: sets, stack / queue / deque, priority_queue,
// binary search helpers, <algorithm> and <numeric> helpers, two bugfixes and practice.
// Contract: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md. Check: node scripts/verify-cpp-learn.mjs --stage 7
// Never print an unordered_set / unordered_map order. The bugfix starters are built so their wrong behaviour is
// deterministic (skipped elements, a comparator that answers true for equal items); no stored output is undefined.

// h(tests, pre): builds a harness. tests[i] is the C++ statements for test i + 1; pre holds helpers (named harness_*).
const h = (tests, pre = '') => {
  const body = tests.map((b, i) => `    cout << "\\n@@TEST ${i + 1}@@" << endl;\n    {\n${b.split('\n').map(l => '        ' + l).join('\n')}\n    }`).join('\n')
  return `${pre}int main() {\n${body}\n    return 0;\n}`
}

export const LESSONS = [
  // 13. set
  {
    id: 'c7-set',
    title: 'set: unique and sorted',
    kind: 'concept',
    task: 'Read whole numbers until the input ends. On the first line print the different numbers in increasing order, separated by spaces. On the second line print how many different numbers there were.',
    introduces: ['include-set', 'set', 'insert-method'],
    teach: {
      body: [
        `<p>A Python <code>set</code> holds each value once. C++'s <code>set</code> (from <code>#include &lt;set&gt;</code>) does too, with one big difference: it keeps its items <em>sorted</em>. You name the item type: <code>set&lt;int&gt; s;</code>. Add with <code>s.insert(x)</code> (adding a value that is already there does nothing), ask with <code>s.count(x)</code> (1 if present, 0 if not, like <code>x in s</code>), and get the number of items with <code>s.size()</code>.</p>`,
        `<p>A loop over a set, <code>for (int x : s)</code>, always visits the items from smallest to largest. In Python, printing a set gives no promised order, so this is a bonus. The price is speed: inserting and looking up take time that grows slowly with the logarithm of the size, a little slower than a hash set (next lesson).</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <set>       // set\nusing namespace std;\n\nint main() {\n    set<int> s;\n    s.insert(5);\n    s.insert(2);\n    s.insert(5);                  // already there: nothing happens\n    s.insert(9);\n    cout << s.size() << endl;     // 3\n    cout << s.count(2) << s.count(7) << endl;   // 10: present, absent\n    for (int x : s) {             // always sorted\n        cout << x << " ";\n    }\n    cout << endl;                 // 2 5 9\n    return 0;\n}',
          output: '3\n10\n2 5 9',
          caption: 'A set drops repeats and keeps order.',
        },
      ],
      terms: [
        { code: 'set<T>', meaning: 'unique items, kept sorted' },
        { code: 's.insert(x)', meaning: 'adds x; does nothing if it is already there' },
        { code: 's.count(x)', meaning: '1 if x is in the set, else 0' },
        { code: 's.size()', meaning: 'how many items' },
      ],
    },
    compare: {
      py: { code: 's = {5, 2, 5, 9}\nprint(len(s), 2 in s)', outcome: 'Prints 3 True; no order promised', ok: true },
      cpp: { code: 'set<int> s = {5, 2, 5, 9};\ncout << s.size() << s.count(2);', outcome: 'Prints 31; items stay sorted', ok: true },
      text: 'The two behave alike for membership. A C++ <code>set</code> is also ordered, and <code>count</code> replaces <code>in</code>.',
    },
    refresher: [
      '<code>set&lt;int&gt; s;</code> <code>s.insert(x);</code> adds, <code>s.count(x)</code> asks, <code>s.size()</code> counts. Items stay sorted.',
      'Read until the input ends with <code>while (cin &gt;&gt; x)</code>.',
    ],
    hints: [
      'Insert each number you read into a <code>set&lt;int&gt;</code>.',
      'Print the set with a range-for loop (use a flag so no space comes first), then print <code>s.size()</code>.',
    ],
    inPython: {
      code: 'nums = [3, 1, 3, 2]\ns = sorted(set(nums))\nprint(*s)\nprint(len(s))',
      note: 'Python needs <code>sorted(set(...))</code> to get the sorted unique values. A C++ <code>set</code> is that already.',
    },
    starter: '#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    // read numbers, print the distinct ones sorted, then how many there are\n    return 0;\n}',
    solution: '#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    set<int> s;\n    int x;\n    while (cin >> x) {\n        s.insert(x);\n    }\n    bool first = true;\n    for (int v : s) {\n        if (!first) {\n            cout << " ";\n        }\n        cout << v;\n        first = false;\n    }\n    cout << endl;\n    cout << s.size() << endl;\n    return 0;\n}',
    require: [{ pattern: 'set\\s*<', message: 'Use a set' }],
    tests: [
      { name: 'Repeats', stdin: '3 1 3 2\n', expected: '1 2 3\n3' },
      { name: 'All the same', stdin: '4 4 4\n', expected: '4\n1' },
      { name: 'Negatives', stdin: '0 -5 9 -5 0\n', expected: '-5 0 9\n3' },
    ],
  },

  // 14. unordered_set
  {
    id: 'c7-unordered-set',
    title: 'unordered_set',
    kind: 'drill',
    task: 'Write <code>hasDuplicate</code>: return true when some value appears more than once in the vector, using an <code>unordered_set</code> of the values seen so far.',
    introduces: ['include-unordered_set', 'unordered-set'],
    teach: {
      body: [
        `<p><code>unordered_set</code> (from <code>#include &lt;unordered_set&gt;</code>) is the hash-based set, the one Python's <code>set</code> really is. It has the same calls as <code>set</code>: <code>insert</code>, <code>count</code>, <code>size</code>. The difference is that lookups take about constant time and the items have no useful order. Never print it straight from a loop; sort first if you must show it.</p>`,
        `<p>Use it as a "have I seen this before?" memory: for each value, ask <code>seen.count(x)</code>; if the answer is 1 you have found a repeat, otherwise remember it with <code>seen.insert(x)</code>.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <unordered_set>   // unordered_set\nusing namespace std;\n\nint main() {\n    unordered_set<int> seen;\n    seen.insert(4);\n    seen.insert(4);                 // a repeat is ignored\n    seen.insert(7);\n    cout << seen.size() << endl;    // 2\n    cout << seen.count(4) << seen.count(9) << endl;   // 10\n    return 0;\n}',
          output: '2\n10',
          caption: 'Same calls as set, with no order.',
        },
      ],
      terms: [
        { code: 'unordered_set<T>', meaning: 'a hash set: fast lookups, no useful order' },
      ],
    },
    refresher: [
      '<code>seen.count(x)</code> is 1 if x was inserted before, else 0. <code>seen.insert(x)</code> remembers x.',
      'Return as soon as you meet a value that is already in the set.',
    ],
    hints: [
      'Loop over the vector. For each value, check <code>seen.count(x)</code> first.',
      'If it is already there return <code>true</code>; otherwise insert it. After the loop return <code>false</code>.',
    ],
    inPython: {
      code: 'def has_duplicate(v):\n    seen = set()\n    for x in v:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n\nprint(has_duplicate([1, 2, 1]))',
      note: 'The same algorithm. <code>x in seen</code> becomes <code>seen.count(x)</code> and <code>add</code> becomes <code>insert</code>.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\n// True when some value appears more than once.\nbool hasDuplicate(const vector<int>& v) {\n    return false;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\n// True when some value appears more than once.\nbool hasDuplicate(const vector<int>& v) {\n    unordered_set<int> seen;\n    for (int x : v) {\n        if (seen.count(x) == 1) {\n            return true;\n        }\n        seen.insert(x);\n    }\n    return false;\n}',
    harness: h([
      'cout << hasDuplicate(vector<int>{1, 2, 3, 1}) << endl;',
      'cout << hasDuplicate(vector<int>{1, 2, 3}) << endl;',
      'cout << hasDuplicate(vector<int>{}) << hasDuplicate(vector<int>{5, 5}) << endl;',
    ]),
    require: [{ pattern: 'unordered_set\\s*<', message: 'Use an unordered_set' }],
    tests: [
      { name: 'A repeat at the end', input: 'hasDuplicate({1, 2, 3, 1})', expected: '1' },
      { name: 'No repeat', input: 'hasDuplicate({1, 2, 3})', expected: '0' },
      { name: 'Empty, then a pair', input: 'hasDuplicate({}) and hasDuplicate({5, 5})', expected: '01' },
    ],
  },

  // 15. multiset and erase
  {
    id: 'c7-multiset',
    title: 'multiset and erase',
    kind: 'drill',
    task: 'Write <code>removeOne</code>: remove a single copy of <code>x</code> from the multiset and return true, or return false when <code>x</code> is not in it.',
    introduces: ['multiset', 'erase-method'],
    teach: {
      body: [
        `<p>A <code>multiset</code> (also in <code>&lt;set&gt;</code>) is a <code>set</code> that allows repeats: it keeps every copy and stays sorted. <code>ms.count(x)</code> now tells you how many copies there are. Python has no direct match; the closest is a sorted list or <code>collections.Counter</code>.</p>`,
        `<p>To delete, use <code>erase</code>, and watch which form you pick. <code>ms.erase(x)</code> with a <em>value</em> removes <em>every</em> copy of x. <code>ms.erase(it)</code> with an <em>iterator</em> removes just that one entry. To remove a single copy, find one first: <code>auto it = ms.find(x);</code>, check it is not <code>ms.end()</code>, then <code>ms.erase(it);</code>. <code>erase</code> works on <code>vector</code>, <code>set</code> and <code>map</code> too.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    multiset<int> ms = {3, 1, 3, 2, 3};\n    cout << ms.size() << " " << ms.count(3) << endl;   // 5 3\n\n    auto it = ms.find(3);       // the first 3\n    ms.erase(it);               // removes just that one entry\n    cout << ms.count(3) << endl;   // 2\n\n    ms.erase(3);                // removes every remaining 3\n    cout << ms.size() << endl;     // 2\n    return 0;\n}',
          output: '5 3\n2\n2',
          caption: 'Erase by iterator removes one entry; erase by value removes them all.',
        },
      ],
      terms: [
        { code: 'multiset<T>', meaning: 'a sorted collection that keeps repeats' },
        { code: 'ms.erase(x)', meaning: 'by value: removes every copy of x' },
        { code: 'ms.erase(it)', meaning: 'by iterator: removes only that entry' },
      ],
    },
    refresher: [
      '<code>ms.erase(value)</code> removes all copies. <code>ms.erase(it)</code> removes one entry.',
      '<code>ms.find(x)</code> is the position of one copy, or <code>ms.end()</code> if there is none.',
    ],
    hints: [
      'Use <code>auto it = ms.find(x);</code>. If it equals <code>ms.end()</code>, return false.',
      'Otherwise <code>ms.erase(it);</code> and return true. Do not erase by value.',
    ],
    inPython: {
      code: 'from collections import Counter\nc = Counter([3, 1, 3, 2])\nc[3] -= 1\nprint(c[3])',
      note: 'A <code>Counter</code> lowers one count. A C++ <code>multiset</code> stores every copy, so you erase one entry through an iterator.',
    },
    starter: '#include <iostream>\n#include <set>\nusing namespace std;\n\n// Remove one copy of x. Return true if one was removed, false if x was not there.\nbool removeOne(multiset<int>& ms, int x) {\n    ms.erase(x);\n    return true;\n}',
    solution: '#include <iostream>\n#include <set>\nusing namespace std;\n\n// Remove one copy of x. Return true if one was removed, false if x was not there.\nbool removeOne(multiset<int>& ms, int x) {\n    auto it = ms.find(x);\n    if (it == ms.end()) {\n        return false;\n    }\n    ms.erase(it);\n    return true;\n}',
    harness: h([
      'multiset<int> ms = {3, 1, 3, 2};\nbool r = removeOne(ms, 3);\ncout << r << " " << ms.size() << " " << ms.count(3) << endl;',
      'multiset<int> ms = {3, 1, 3, 2};\nbool r = removeOne(ms, 9);\ncout << r << " " << ms.size() << " " << ms.count(9) << endl;',
      'multiset<int> ms = {5, 5, 5};\nbool r = removeOne(ms, 5);\ncout << r << " " << ms.size() << " " << ms.count(5) << endl;',
    ]),
    require: [{ pattern: 'erase\\s*\\(', message: 'Use erase' }],
    tests: [
      { name: 'Remove one of two', input: '{3, 1, 3, 2}, removeOne 3', expected: '1 3 1' },
      { name: 'Absent value', input: '{3, 1, 3, 2}, removeOne 9', expected: '0 4 0' },
      { name: 'Three copies', input: '{5, 5, 5}, removeOne 5', expected: '1 2 2' },
    ],
  },

  // 16. stack and queue
  {
    id: 'c7-stack-queue',
    title: 'stack and queue',
    kind: 'concept',
    task: 'Write <code>isBalanced</code>: given a string of the brackets <code>( ) [ ] { }</code>, return true when every bracket is closed by the right kind in the right order.',
    introduces: ['include-stack', 'include-queue', 'stack', 'queue', 'stack-ops'],
    teach: {
      body: [
        `<p>In Python a plain list is a stack (<code>append</code> and <code>pop</code>) and <code>collections.deque</code> is a queue. C++ has them as their own types. <code>stack&lt;T&gt;</code> from <code>#include &lt;stack&gt;</code> works last in, first out: <code>st.push(x)</code> puts x on top, <code>st.top()</code> looks at the top, <code>st.pop()</code> removes it, and <code>st.empty()</code> and <code>st.size()</code> ask about it.</p>`,
        `<p>One surprise for Python programmers: <code>pop()</code> returns <em>nothing</em>. You read the value with <code>top()</code> first and then call <code>pop()</code>. And calling <code>top()</code> or <code>pop()</code> on an empty stack is undefined behaviour, where Python's <code>[].pop()</code> raises an error, so check <code>empty()</code> first.</p>`,
        `<p><code>queue&lt;T&gt;</code> from <code>#include &lt;queue&gt;</code> works first in, first out: <code>q.push(x)</code> adds at the back, <code>q.front()</code> looks at the oldest item, <code>q.pop()</code> removes it. It also has <code>back()</code>, <code>empty()</code> and <code>size()</code>. Queues drive the breadth-first searches in stage 8.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <string>\n#include <stack>     // stack\n#include <queue>     // queue\nusing namespace std;\n\nint main() {\n    stack<int> st;\n    st.push(1);\n    st.push(2);\n    st.push(3);\n    cout << st.top() << endl;                  // 3: the last one in\n    st.pop();                                  // removes 3, returns nothing\n    cout << st.top() << " " << st.size() << endl;   // 2 2\n\n    queue<string> q;\n    q.push("a");\n    q.push("b");\n    cout << q.front() << endl;                 // a: the first one in\n    q.pop();\n    cout << q.front() << " " << q.empty() << endl;  // b 0\n    return 0;\n}',
          output: '3\n2 2\na\nb 0',
          caption: 'A stack gives back the newest item, a queue the oldest.',
        },
      ],
      terms: [
        { code: 'stack<T>', meaning: 'last in, first out' },
        { code: 'st.push(x) / st.top() / st.pop()', meaning: 'add, look at the top, remove the top (pop returns nothing)' },
        { code: 'queue<T>', meaning: 'first in, first out' },
        { code: 'q.push(x) / q.front() / q.pop()', meaning: 'add at the back, look at the front, remove the front' },
      ],
    },
    compare: {
      py: { code: 'st = [1, 2, 3]\nprint(st.pop())', outcome: 'Prints 3; pop returns the item', ok: true },
      cpp: { code: 'stack<int> st;\nst.push(1);\nst.push(3);\ncout << st.top();\nst.pop();', outcome: 'Prints 3; pop returns nothing', ok: true },
      text: 'Python\'s <code>pop()</code> removes and returns the item. C++ splits it in two: <code>top()</code> reads, <code>pop()</code> removes.',
    },
    refresher: [
      '<code>st.top()</code> reads the newest item, <code>st.pop()</code> removes it and returns nothing. Check <code>st.empty()</code> first.',
      'A queue is first in, first out: <code>q.front()</code> reads the oldest item, <code>q.pop()</code> removes it.',
    ],
    hints: [
      'Push every opening bracket. On a closing bracket, the top of the stack must be its partner.',
      'If a closing bracket arrives while the stack is empty, or the top does not match, return false. At the end return <code>st.empty()</code>.',
    ],
    inPython: {
      code: 'st = []\nst.append("(")\nprint(st[-1])\nst.pop()',
      note: 'A Python list is a stack with <code>append</code>, <code>[-1]</code> and <code>pop</code>. C++ names those <code>push</code>, <code>top</code> and <code>pop</code>.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\n// True when every bracket in s is closed correctly.\nbool isBalanced(const string& s) {\n    return true;\n}',
    solution: '#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\n// True when every bracket in s is closed correctly.\nbool isBalanced(const string& s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == \'(\' || c == \'[\' || c == \'{\') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                return false;\n            }\n            char open = st.top();\n            st.pop();\n            if ((c == \')\' && open != \'(\') || (c == \']\' && open != \'[\') || (c == \'}\' && open != \'{\')) {\n                return false;\n            }\n        }\n    }\n    return st.empty();\n}',
    harness: h([
      'cout << isBalanced("([]{})") << endl;',
      'cout << isBalanced("([)]") << endl;',
      'cout << isBalanced("(()") << isBalanced(")(") << isBalanced("") << endl;',
      'cout << isBalanced("{[()()]}") << isBalanced("]") << endl;',
    ]),
    require: [{ pattern: 'stack\\s*<', message: 'Use a stack' }],
    tests: [
      { name: 'Nested and balanced', input: '"([]{})"', expected: '1' },
      { name: 'Wrong order', input: '"([)]"', expected: '0' },
      { name: 'Unclosed, backwards, empty', input: '"(()", ")(", ""', expected: '001' },
      { name: 'Deep, then a lone closer', input: '"{[()()]}", "]"', expected: '10' },
    ],
  },

  // 17. deque
  {
    id: 'c7-deque',
    title: 'deque: both ends',
    kind: 'concept',
    task: 'Write <code>rotateLeft</code>: move the front item to the back, <code>k</code> times, so <code>{1,2,3,4}</code> rotated left by 1 becomes <code>{2,3,4,1}</code>.',
    introduces: ['include-deque', 'deque'],
    teach: {
      body: [
        `<p>A <code>vector</code> is fast to change at its back and slow at its front. A <code>deque</code> ("double-ended queue", from <code>#include &lt;deque&gt;</code>) is fast at both ends. It is C++'s <code>collections.deque</code>: <code>d.push_back(x)</code> and <code>d.push_front(x)</code> add at either end, <code>d.pop_back()</code> and <code>d.pop_front()</code> remove from either end, and <code>d.front()</code> and <code>d.back()</code> read them. It also supports <code>d[i]</code>, <code>d.size()</code> and <code>d.empty()</code> like a vector.</p>`,
        `<p>Python's <code>appendleft</code> and <code>popleft</code> are <code>push_front</code> and <code>pop_front</code> here. As with stack and queue, the <code>pop</code> functions return nothing: read with <code>front()</code> or <code>back()</code> first.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <deque>      // deque\nusing namespace std;\n\nint main() {\n    deque<int> d = {2, 3};\n    d.push_front(1);                       // 1 2 3\n    d.push_back(4);                        // 1 2 3 4\n    cout << d.front() << d.back() << endl; // 14\n    d.pop_front();                         // 2 3 4\n    d.pop_back();                          // 2 3\n    cout << d.size() << " " << d[1] << endl;   // 2 3\n    return 0;\n}',
          output: '14\n2 3',
          caption: 'Adding and removing at both ends.',
        },
      ],
      terms: [
        { code: 'deque<T>', meaning: 'a sequence that is quick to change at both ends' },
        { code: 'push_front / push_back', meaning: 'add at the front / back (appendleft / append)' },
        { code: 'pop_front / pop_back', meaning: 'remove from the front / back; they return nothing' },
      ],
    },
    compare: {
      py: { code: 'from collections import deque\nd = deque([2, 3])\nd.appendleft(1)\nprint(d.popleft())', outcome: 'Prints 1; popleft returns it', ok: true },
      cpp: { code: 'deque<int> d = {2, 3};\nd.push_front(1);\ncout << d.front();\nd.pop_front();', outcome: 'Prints 1; pop_front returns nothing', ok: true },
      text: 'The calls line up one to one, with new names. In C++ you read the end first and then pop it.',
    },
    refresher: [
      '<code>d.front()</code> reads the first item, <code>d.pop_front()</code> removes it, <code>d.push_back(x)</code> adds at the end.',
      '<code>pop_front</code> returns nothing. Read the item with <code>front()</code> before you pop it.',
    ],
    hints: [
      'Repeat <code>k</code> times: copy <code>d.front()</code> into a variable, <code>pop_front()</code>, then <code>push_back</code> the copy.',
      'A for loop <code>for (int i = 0; i &lt; k; i++)</code> does the repeating.',
    ],
    inPython: {
      code: 'from collections import deque\nd = deque([1, 2, 3, 4])\nd.rotate(-1)\nprint(list(d))',
      note: 'Python\'s deque has <code>rotate</code> built in. In C++ you do it yourself with <code>front</code>, <code>pop_front</code> and <code>push_back</code>.',
    },
    starter: '#include <iostream>\n#include <deque>\nusing namespace std;\n\n// Move the front item to the back, k times.\nvoid rotateLeft(deque<int>& d, int k) {\n}',
    solution: '#include <iostream>\n#include <deque>\nusing namespace std;\n\n// Move the front item to the back, k times.\nvoid rotateLeft(deque<int>& d, int k) {\n    for (int i = 0; i < k; i++) {\n        int x = d.front();\n        d.pop_front();\n        d.push_back(x);\n    }\n}',
    harness: h([
      'deque<int> d = {1, 2, 3, 4};\nrotateLeft(d, 1);\nfor (size_t i = 0; i < d.size(); i++) {\n    cout << d[i] << " ";\n}\ncout << endl;',
      'deque<int> d = {1, 2, 3, 4};\nrotateLeft(d, 3);\nfor (size_t i = 0; i < d.size(); i++) {\n    cout << d[i] << " ";\n}\ncout << endl;',
      'deque<int> d = {5, 6};\nrotateLeft(d, 0);\nfor (size_t i = 0; i < d.size(); i++) {\n    cout << d[i] << " ";\n}\ncout << endl;',
    ]),
    require: [{ pattern: 'pop_front\\s*\\(', message: 'Use pop_front' }],
    tests: [
      { name: 'Rotate by 1', input: '{1,2,3,4}, k = 1', expected: '2 3 4 1' },
      { name: 'Rotate by 3', input: '{1,2,3,4}, k = 3', expected: '4 1 2 3' },
      { name: 'Rotate by 0', input: '{5,6}, k = 0', expected: '5 6' },
    ],
  },

  // 18. priority_queue
  {
    id: 'c7-priority-queue',
    title: 'priority_queue and heapq',
    kind: 'concept',
    task: 'Write <code>sumOfSmallest</code>: return the sum of the <code>k</code> smallest values in the vector (<code>k</code> is never more than its size). Use a min-heap.',
    introduces: ['include-functional', 'priority-queue', 'greater'],
    teach: {
      body: [
        `<p>A priority queue always hands you the most important item next. Python's <code>heapq</code> is a <em>min</em>-heap: the smallest item comes out first, using <code>heappush</code> and <code>heappop</code> on a plain list. C++'s <code>priority_queue</code> (from <code>#include &lt;queue&gt;</code>) is the opposite by default, a <em>max</em>-heap: <code>pq.top()</code> is the <em>largest</em> item. You use <code>pq.push(x)</code>, <code>pq.top()</code>, <code>pq.pop()</code>, <code>pq.empty()</code> and <code>pq.size()</code>; as before, <code>pop</code> returns nothing.</p>`,
        `<p>To get a min-heap like <code>heapq</code>, give it three template arguments: <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; pq;</code>. They are the item type, the container it stores items in (always a <code>vector</code> here), and the ordering. <code>greater&lt;int&gt;</code> (from <code>#include &lt;functional&gt;</code>) flips the order so the smallest item is on top. It is wordy but you can copy it as is. The old Python trick of pushing negative numbers to fake a max-heap is not needed in C++: the max-heap is the default.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <queue>        // priority_queue\n#include <functional>   // greater\nusing namespace std;\n\nint main() {\n    priority_queue<int> big;                 // max-heap: largest on top\n    big.push(5);\n    big.push(1);\n    big.push(9);\n    cout << big.top() << endl;               // 9\n\n    priority_queue<int, vector<int>, greater<int>> small;   // min-heap, like heapq\n    small.push(5);\n    small.push(1);\n    small.push(9);\n    cout << small.top() << endl;             // 1\n    small.pop();                             // removes the 1\n    cout << small.top() << " " << small.size() << endl;     // 5 2\n    return 0;\n}',
          output: '9\n1\n5 2',
          caption: 'The default is a max-heap; greater<int> makes a min-heap.',
        },
      ],
      terms: [
        { code: 'priority_queue<int>', meaning: 'a max-heap: top() is the largest' },
        { code: 'priority_queue<int, vector<int>, greater<int>>', meaning: 'a min-heap: top() is the smallest (like heapq)' },
        { code: 'push / top / pop', meaning: 'add, look at the best item, remove it (pop returns nothing)' },
        { code: '#include <functional>', meaning: 'brings in greater' },
      ],
    },
    compare: {
      py: { code: 'import heapq\nh = []\nheapq.heappush(h, 5)\nheapq.heappush(h, 1)\nprint(h[0])', outcome: 'Prints 1: heapq is a min-heap', ok: true },
      cpp: { code: 'priority_queue<int> q;\nq.push(5);\nq.push(1);\ncout << q.top();', outcome: 'Prints 5: the default is a max-heap', ok: true },
      text: 'The same two pushes give the opposite answer. Add <code>greater&lt;int&gt;</code> to a C++ priority queue to get <code>heapq</code>\'s behaviour.',
    },
    refresher: [
      '<code>priority_queue&lt;int&gt;</code> has the largest on top. For the smallest on top: <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>.',
      '<code>top()</code> reads the best item and <code>pop()</code> removes it, returning nothing.',
    ],
    hints: [
      'Make a min-heap and push every value of the vector into it.',
      'Then repeat <code>k</code> times: add <code>pq.top()</code> to a sum and call <code>pq.pop()</code>.',
    ],
    inPython: {
      code: 'import heapq\nv = [7, 2, 9, 4]\nheapq.heapify(v)\nprint(heapq.heappop(v) + heapq.heappop(v))',
      note: 'Python turns the list into a min-heap in place. C++ builds a separate <code>priority_queue</code> and you choose max or min with the type.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <functional>\nusing namespace std;\n\n// Sum of the k smallest values of v.\nint sumOfSmallest(const vector<int>& v, int k) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <functional>\nusing namespace std;\n\n// Sum of the k smallest values of v.\nint sumOfSmallest(const vector<int>& v, int k) {\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int x : v) {\n        pq.push(x);\n    }\n    int sum = 0;\n    for (int i = 0; i < k; i++) {\n        sum += pq.top();\n        pq.pop();\n    }\n    return sum;\n}',
    harness: h([
      'cout << sumOfSmallest(vector<int>{7, 2, 9, 4}, 2) << endl;',
      'cout << sumOfSmallest(vector<int>{5, 5, 1}, 3) << endl;',
      'cout << sumOfSmallest(vector<int>{-4, 10, -6, 3}, 2) << endl;',
    ]),
    require: [{ pattern: 'priority_queue\\s*<', message: 'Use a priority_queue' }, { pattern: 'greater\\s*<', message: 'Use greater<int> for a min-heap' }],
    tests: [
      { name: 'Two smallest', input: 'sumOfSmallest({7, 2, 9, 4}, 2)', expected: '6' },
      { name: 'All of them', input: 'sumOfSmallest({5, 5, 1}, 3)', expected: '11' },
      { name: 'Negatives', input: 'sumOfSmallest({-4, 10, -6, 3}, 2)', expected: '-10' },
    ],
  },

  // 19. lower_bound / upper_bound
  {
    id: 'c7-bisect',
    title: 'lower_bound and upper_bound',
    kind: 'concept',
    task: 'Write <code>countInRange</code>: for a sorted vector, return how many values are at least <code>lo</code> and at most <code>hi</code>. Use binary search, not a loop over all values.',
    introduces: ['lower-bound'],
    teach: {
      body: [
        `<p>Python's <code>bisect</code> module searches a sorted list in logarithmic time: <code>bisect_left(v, x)</code> is the first index where <code>x</code> could go, and <code>bisect_right</code> is the one after the last equal item. C++ names them <code>lower_bound</code> and <code>upper_bound</code>. They are in <code>&lt;algorithm&gt;</code> and take the range and the value: <code>lower_bound(v.begin(), v.end(), x)</code>. The vector must already be sorted.</p>`,
        `<p>They return an <em>iterator</em>, a position, not an index. <code>lower_bound</code> is the first item that is <em>not less than</em> <code>x</code> (the first x, if present), and <code>upper_bound</code> is the first item <em>greater than</em> <code>x</code>. If there is no such item the result is <code>v.end()</code>. To turn a position into an index, subtract the start: <code>lower_bound(v.begin(), v.end(), x) - v.begin()</code>. The number of copies of <code>x</code> is the difference between the two results. <code>binary_search(v.begin(), v.end(), x)</code> just answers true or false.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>   // lower_bound, upper_bound, binary_search\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 3, 3, 5, 8};       // must be sorted\n    cout << lower_bound(v.begin(), v.end(), 3) - v.begin() << " ";   // 1: first 3\n    cout << upper_bound(v.begin(), v.end(), 3) - v.begin() << " ";   // 3: just after the last 3\n    cout << lower_bound(v.begin(), v.end(), 4) - v.begin() << " ";   // 3: where a 4 would go\n    cout << lower_bound(v.begin(), v.end(), 9) - v.begin() << endl;  // 5: past the end\n    cout << binary_search(v.begin(), v.end(), 5) << endl;            // 1: found\n    return 0;\n}',
          output: '1 3 3 5\n1',
          caption: 'Positions turned into indexes by subtracting begin().',
        },
      ],
      terms: [
        { code: 'lower_bound(b, e, x)', meaning: 'position of the first item that is not less than x (bisect_left)' },
        { code: 'upper_bound(b, e, x)', meaning: 'position of the first item greater than x (bisect_right)' },
        { code: 'it - v.begin()', meaning: 'turns a position into an index' },
        { code: 'binary_search(b, e, x)', meaning: 'true if x is in the sorted range' },
      ],
    },
    compare: {
      py: { code: 'import bisect\nv = [1, 3, 3, 5, 8]\nprint(bisect.bisect_left(v, 3))', outcome: 'Prints 1, an index', ok: true },
      cpp: { code: 'vector<int> v = {1, 3, 3, 5, 8};\ncout << (lower_bound(v.begin(), v.end(), 3) - v.begin());', outcome: 'Prints 1, after turning the position into an index', ok: true },
      text: '<code>bisect_left</code> and <code>lower_bound</code> find the same spot. C++ returns an iterator, so subtract <code>v.begin()</code> to get the index.',
    },
    refresher: [
      '<code>lower_bound</code> is the first item not less than x; <code>upper_bound</code> is the first item greater than x. Both need a sorted range.',
      'Subtract <code>v.begin()</code> from the result to get an index.',
    ],
    hints: [
      'Values from <code>lo</code> up to <code>hi</code> start at <code>lower_bound(..., lo)</code> and stop at <code>upper_bound(..., hi)</code>.',
      'The answer is the distance between those two iterators: subtract one from the other.',
    ],
    inPython: {
      code: 'import bisect\nv = [1, 3, 3, 5, 8]\nprint(bisect.bisect_right(v, 5) - bisect.bisect_left(v, 3))',
      note: 'Same idea with <code>bisect_right</code> and <code>bisect_left</code>. In C++ these are <code>upper_bound</code> and <code>lower_bound</code> on iterators.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Count the values x of the sorted vector with lo <= x <= hi.\nint countInRange(const vector<int>& v, int lo, int hi) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Count the values x of the sorted vector with lo <= x <= hi.\nint countInRange(const vector<int>& v, int lo, int hi) {\n    auto first = lower_bound(v.begin(), v.end(), lo);\n    auto last = upper_bound(v.begin(), v.end(), hi);\n    return last - first;\n}',
    harness: h([
      'cout << countInRange(vector<int>{1, 3, 3, 5, 8}, 3, 5) << endl;',
      'cout << countInRange(vector<int>{1, 3, 3, 5, 8}, 4, 4) << endl;',
      'cout << countInRange(vector<int>{1, 3, 3, 5, 8}, 0, 100) << endl;',
      'cout << countInRange(vector<int>{}, 1, 2) << endl;',
    ]),
    require: [{ pattern: 'lower_bound', message: 'Use lower_bound' }, { pattern: 'upper_bound', message: 'Use upper_bound' }],
    tests: [
      { name: 'Includes both ends', input: '{1,3,3,5,8}, 3..5', expected: '3' },
      { name: 'Nothing in range', input: '{1,3,3,5,8}, 4..4', expected: '0' },
      { name: 'Everything', input: '{1,3,3,5,8}, 0..100', expected: '5' },
      { name: 'Empty vector', input: '{}, 1..2', expected: '0' },
    ],
  },

  // 20. reverse, min_element, max_element
  {
    id: 'c7-reverse-minmax',
    title: 'reverse, min_element, max_element',
    kind: 'concept',
    task: 'Read a count <code>n</code> and then <code>n</code> numbers (n is at least 1). Print the numbers in reverse order on the first line, then the smallest and the largest, separated by a space, on the second.',
    introduces: ['reverse', 'min-max-element'],
    teach: {
      body: [
        `<p>More helpers from <code>&lt;algorithm&gt;</code>, all taking a begin and an end position. <code>reverse(v.begin(), v.end());</code> reverses the vector in place, like <code>v.reverse()</code> in Python (not <code>v[::-1]</code>, which makes a copy).</p>`,
        `<p><code>min_element(v.begin(), v.end())</code> and <code>max_element(...)</code> return an <em>iterator</em> to the smallest and largest item, not the value itself. Put a <code>*</code> in front to read the value: <code>*min_element(v.begin(), v.end())</code>. Subtract <code>v.begin()</code> to get the index instead. They need a non-empty range: on an empty vector the result is <code>end()</code>, and reading it with <code>*</code> is undefined behaviour. Python's <code>min(v)</code> would raise an error there.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {4, 9, 2, 7};\n    reverse(v.begin(), v.end());                       // in place\n    cout << v[0] << " " << v[3] << endl;               // 7 4\n    cout << *min_element(v.begin(), v.end()) << endl;  // 2: * reads the value\n    cout << *max_element(v.begin(), v.end()) << endl;  // 9\n    cout << max_element(v.begin(), v.end()) - v.begin() << endl;   // 2: its index now\n    return 0;\n}',
          output: '7 4\n2\n9\n2',
          caption: 'The helpers return positions; star reads the value, subtracting begin() gives the index.',
        },
      ],
      terms: [
        { code: 'reverse(b, e)', meaning: 'reverses the range in place' },
        { code: 'min_element(b, e)', meaning: 'iterator to the smallest item' },
        { code: 'max_element(b, e)', meaning: 'iterator to the largest item' },
        { code: '*it', meaning: 'the value an iterator points at' },
      ],
    },
    compare: {
      py: { code: 'v = [4, 9, 2, 7]\nprint(min(v), max(v))', outcome: 'Prints 2 9, the values', ok: true },
      cpp: { code: 'vector<int> v = {4, 9, 2, 7};\ncout << *min_element(v.begin(), v.end());', outcome: 'Prints 2; the call returns a position, * reads it', ok: true },
      text: 'Python\'s <code>min</code> gives the value. C++\'s <code>min_element</code> gives a position, so you add <code>*</code>.',
    },
    refresher: [
      '<code>reverse(v.begin(), v.end());</code> reverses in place. <code>*min_element(v.begin(), v.end())</code> is the smallest value.',
      'Do not use <code>*</code> on the result of an empty range: undefined behaviour.',
    ],
    hints: [
      'Read the numbers into a vector, then call <code>reverse</code> on it and print it.',
      'Print <code>*min_element(...)</code>, a space and <code>*max_element(...)</code> on the second line.',
    ],
    inPython: {
      code: 'v = [4, 9, 2, 7]\nv.reverse()\nprint(v, min(v), max(v))',
      note: 'The same three jobs. In C++ they take iterator ranges, and the min and max come back as positions you dereference with <code>*</code>.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    // read n numbers; print them reversed, then the min and the max\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) {\n        cin >> v[i];\n    }\n    reverse(v.begin(), v.end());\n    for (int i = 0; i < n; i++) {\n        if (i > 0) {\n            cout << " ";\n        }\n        cout << v[i];\n    }\n    cout << endl;\n    cout << *min_element(v.begin(), v.end()) << " " << *max_element(v.begin(), v.end()) << endl;\n    return 0;\n}',
    require: [{ pattern: 'reverse\\s*\\(', message: 'Use reverse' }, { pattern: 'min_element', message: 'Use min_element' }, { pattern: 'max_element', message: 'Use max_element' }],
    tests: [
      { name: 'Four numbers', stdin: '4\n4 9 2 7\n', expected: '7 2 9 4\n2 9' },
      { name: 'One number', stdin: '1\n5\n', expected: '5\n5 5' },
      { name: 'Negatives', stdin: '3\n-1 -8 0\n', expected: '0 -8 -1\n-8 0' },
    ],
  },

  // 21. accumulate, count, find
  {
    id: 'c7-accumulate',
    title: 'accumulate, count, find',
    kind: 'concept',
    task: 'Read <code>n</code>, then <code>n</code> numbers, then a target <code>t</code>. Print three lines: the sum of the numbers, how many times <code>t</code> appears, and the index of its first appearance (or -1 if it is absent).',
    introduces: ['include-numeric', 'accumulate', 'count-algo', 'find-algo'],
    teach: {
      body: [
        `<p>Three more helpers that work on a range. <code>accumulate(v.begin(), v.end(), 0)</code> from <code>#include &lt;numeric&gt;</code> adds up the items, like <code>sum(v)</code>. The third argument is the starting value, and it also decides the <em>type</em> of the answer: starting from the int <code>0</code> keeps adding as ints, so a sum of doubles would be cut down to whole numbers at every step. Start from <code>0.0</code> for doubles and <code>0LL</code> (a <code>long long</code> zero) when the total may not fit in an int.</p>`,
        `<p><code>count(v.begin(), v.end(), x)</code> returns how many items equal <code>x</code>, like <code>v.count(x)</code>. <code>find(v.begin(), v.end(), x)</code> returns an iterator to the first item equal to <code>x</code>, or <code>v.end()</code> if there is none. That is a mix of <code>x in v</code> and <code>v.index(x)</code>: compare with <code>v.end()</code> to test, subtract <code>v.begin()</code> for the index. They scan item by item, so use them on small data, not instead of a set or map.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>   // count, find\n#include <numeric>     // accumulate\nusing namespace std;\n\nint main() {\n    vector<int> v = {4, 7, 4, 1};\n    cout << accumulate(v.begin(), v.end(), 0) << endl;    // 16: the sum\n    cout << count(v.begin(), v.end(), 4) << endl;         // 2\n    auto it = find(v.begin(), v.end(), 7);\n    if (it != v.end()) {\n        cout << it - v.begin() << endl;                   // 1: its index\n    }\n    vector<double> d = {0.5, 1.5};\n    cout << accumulate(d.begin(), d.end(), 0) << " ";     // 1: starting from int 0 cuts every step down\n    cout << accumulate(d.begin(), d.end(), 0.0) << endl;  // 2\n    return 0;\n}',
          output: '16\n2\n1\n1 2',
          caption: 'The starting value of accumulate sets the type of the total.',
        },
      ],
      terms: [
        { code: 'accumulate(b, e, 0)', meaning: 'the sum of the range, starting from 0' },
        { code: 'count(b, e, x)', meaning: 'how many items equal x' },
        { code: 'find(b, e, x)', meaning: 'iterator to the first x, or e when absent' },
        { code: '#include <numeric>', meaning: 'brings in accumulate' },
      ],
    },
    compare: {
      py: { code: 'v = [4, 7, 4, 1]\nprint(sum(v), v.count(4), v.index(7))', outcome: 'Prints 16 2 1', ok: true },
      cpp: { code: 'vector<int> v = {4, 7, 4, 1};\ncout << accumulate(v.begin(), v.end(), 0);\ncout << count(v.begin(), v.end(), 4);\ncout << find(v.begin(), v.end(), 7) - v.begin();', outcome: 'Prints 16, 2 and 1', ok: true },
      text: 'Each Python one-liner has a C++ function over a range. <code>find</code> returns a position, so you compare with <code>end()</code> or subtract <code>begin()</code>.',
    },
    refresher: [
      '<code>accumulate(v.begin(), v.end(), 0)</code> sums (needs <code>&lt;numeric&gt;</code>). The last argument sets the type: use <code>0.0</code> or <code>0LL</code> when needed.',
      '<code>find(...)</code> gives <code>v.end()</code> when the value is absent. <code>it - v.begin()</code> is the index.',
    ],
    hints: [
      'Read the numbers into a vector, then the target. Print the three answers one per line.',
      'For the index: <code>auto it = find(...);</code> then if <code>it == v.end()</code> print -1, else print <code>it - v.begin()</code>.',
    ],
    inPython: {
      code: 'v = [4, 7, 4, 1]\nt = 7\nprint(sum(v))\nprint(v.count(t))\nprint(v.index(t) if t in v else -1)',
      note: '<code>v.index(t)</code> raises an error when t is absent, so Python needs the <code>in</code> check first. C++ <code>find</code> returns <code>end()</code> instead.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    // read n numbers and a target; print the sum, the count of the target, its first index or -1\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) {\n        cin >> v[i];\n    }\n    int t;\n    cin >> t;\n    cout << accumulate(v.begin(), v.end(), 0) << endl;\n    cout << count(v.begin(), v.end(), t) << endl;\n    auto it = find(v.begin(), v.end(), t);\n    if (it == v.end()) {\n        cout << -1 << endl;\n    } else {\n        cout << it - v.begin() << endl;\n    }\n    return 0;\n}',
    require: [{ pattern: 'accumulate\\s*\\(', message: 'Use accumulate' }, { pattern: 'count\\s*\\(', message: 'Use count' }, { pattern: '(?<![.\\w])find\\s*\\(', message: 'Use find' }],
    tests: [
      { name: 'Target present twice', stdin: '4\n4 7 4 1\n4\n', expected: '16\n2\n0' },
      { name: 'Target once', stdin: '4\n4 7 4 1\n7\n', expected: '16\n1\n1' },
      { name: 'Target absent', stdin: '3\n1 2 3\n9\n', expected: '6\n0\n-1' },
    ],
  },

  // 22. unique + erase
  {
    id: 'c7-unique-erase',
    title: 'unique and erase',
    kind: 'drill',
    task: 'Write <code>dedupe</code>: return the distinct values of the vector in increasing order. Use <code>sort</code>, then <code>unique</code> with <code>erase</code>.',
    introduces: ['unique-algo'],
    teach: {
      body: [
        `<p>Python removes repeats with <code>sorted(set(v))</code>. The classic C++ way is three steps on the vector itself. First <code>sort</code> it, so equal values sit side by side. Then <code>unique(v.begin(), v.end())</code> squeezes each run of equal neighbours down to one item. The odd part: <code>unique</code> cannot shrink the vector (it only moves items), so it returns an iterator to the new logical end, and the leftover tail is junk. Finally <code>erase</code> cuts that tail off: <code>v.erase(unique(v.begin(), v.end()), v.end());</code>.</p>`,
        `<p>This two-iterator form of <code>erase</code> removes the whole range from the first position up to, but not including, the second. Remember the three words as a unit: sort, unique, erase. (A <code>set</code> also removes repeats, but this keeps a vector.)</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {3, 1, 3, 2, 1};\n    sort(v.begin(), v.end());                      // 1 1 2 3 3: equals are neighbours now\n    v.erase(unique(v.begin(), v.end()), v.end());  // drop the repeated tail\n    for (int x : v) {\n        cout << x << " ";\n    }\n    cout << endl;                                  // 1 2 3\n    cout << v.size() << endl;                      // 3\n    return 0;\n}',
          output: '1 2 3\n3',
          caption: 'Sort, unique, erase.',
        },
      ],
      terms: [
        { code: 'unique(b, e)', meaning: 'squeezes runs of equal neighbours; returns the new end' },
        { code: 'v.erase(first, last)', meaning: 'removes the items from first up to (not including) last' },
      ],
    },
    refresher: [
      '<code>v.erase(unique(v.begin(), v.end()), v.end());</code> removes repeated neighbours. Sort first so equal values are neighbours.',
      '<code>unique</code> only moves items: it is <code>erase</code> that shortens the vector.',
    ],
    hints: [
      'The vector is passed by value, so you may change it. Sort it first.',
      'Then <code>v.erase(unique(v.begin(), v.end()), v.end());</code> and return <code>v</code>.',
    ],
    inPython: {
      code: 'def dedupe(v):\n    return sorted(set(v))\n\nprint(dedupe([3, 1, 3, 2, 1]))',
      note: 'Python does it in one expression. C++ does it in place in three steps.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// The distinct values of v, in increasing order.\nvector<int> dedupe(vector<int> v) {\n    return v;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// The distinct values of v, in increasing order.\nvector<int> dedupe(vector<int> v) {\n    sort(v.begin(), v.end());\n    v.erase(unique(v.begin(), v.end()), v.end());\n    return v;\n}',
    harness: h([
      'vector<int> r = dedupe(vector<int>{3, 1, 3, 2, 1});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = dedupe(vector<int>{7, 7, 7});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << r.size() << endl;',
      'vector<int> r = dedupe(vector<int>{});\ncout << r.size() << endl;',
      'vector<int> r = dedupe(vector<int>{-1, 5, -1, 0, 5});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
    ]),
    require: [{ pattern: 'unique\\s*\\(', message: 'Use unique' }, { pattern: 'erase\\s*\\(', message: 'Use erase' }],
    tests: [
      { name: 'Mixed repeats', input: 'dedupe({3, 1, 3, 2, 1})', expected: '1 2 3' },
      { name: 'All equal', input: 'dedupe({7, 7, 7})', expected: '7 1' },
      { name: 'Empty', input: 'dedupe({})', expected: '0' },
      { name: 'Negatives', input: 'dedupe({-1, 5, -1, 0, 5})', expected: '-1 0 5' },
    ],
  },

  // 23. bugfix: erase while iterating
  {
    id: 'c7-fix-erase',
    title: 'Erase while looping',
    kind: 'bugfix',
    task: '<code>removeEvens</code> should delete every even number from the vector, but some evens survive. Fix it.',
    introduces: [],
    refresher: [
      '<code>erase</code> shifts the later items left and makes the iterator you used unreliable. Using it afterwards is undefined behaviour.',
      '<code>it = v.erase(it);</code> hands back an iterator to the item that moved into the gap. Only step forward with <code>++it</code> when you did not erase.',
    ],
    hints: [
      'After a successful erase, the next item is now at the same position. Stepping forward skips it.',
      'Make the loop header <code>for (auto it = v.begin(); it != v.end();)</code> with no step, then either <code>it = v.erase(it);</code> or <code>++it;</code> in the body.',
    ],
    inPython: {
      code: 'v = [2, 4, 6, 7]\nfor x in v:\n    if x % 2 == 0:\n        v.remove(x)\nprint(v)',
      note: 'Python has the same trap: changing a list while looping over it skips items. Build a new list or loop over a copy.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Delete every even number from v.\nvoid removeEvens(vector<int>& v) {\n    for (auto it = v.begin(); it != v.end(); ++it) {\n        if (*it % 2 == 0) {\n            v.erase(it);\n        }\n    }\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Delete every even number from v.\nvoid removeEvens(vector<int>& v) {\n    for (auto it = v.begin(); it != v.end();) {\n        if (*it % 2 == 0) {\n            it = v.erase(it);\n        } else {\n            ++it;\n        }\n    }\n}',
    harness: h([
      'vector<int> v = {1, 2, 3, 4, 5};\nremoveEvens(v);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> v = {2, 4, 6, 7};\nremoveEvens(v);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> v = {1, 3};\nremoveEvens(v);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> v = {8, 8, 8, 1};\nremoveEvens(v);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
    ]),
    require: [{ pattern: 'erase\\s*\\(', message: 'Keep using erase' }],
    tests: [
      { name: 'Separated evens', input: '{1, 2, 3, 4, 5}', expected: '1 3 5' },
      { name: 'Evens side by side', input: '{2, 4, 6, 7}', expected: '7' },
      { name: 'No evens', input: '{1, 3}', expected: '1 3' },
      { name: 'Repeated even', input: '{8, 8, 8, 1}', expected: '1' },
    ],
  },

  // 24. bugfix: a bad comparator
  {
    id: 'c7-fix-comparator',
    title: 'The comparator that says yes too often',
    kind: 'bugfix',
    task: '<code>byLength</code> is the comparison used to sort words by length, but it also answers true for two words of equal length. Fix it.',
    introduces: [],
    refresher: [
      'A sort comparison must say true only when a goes strictly before b. For equal items it must say false.',
      'With <code>&lt;=</code> the comparison is true for an item against itself. <code>sort</code> then may crash, loop forever or give junk: undefined behaviour.',
    ],
    hints: [
      'Test <code>byLength("abc", "abc")</code> in your head. What should it answer?',
      'Change the <code>&lt;=</code> to <code>&lt;</code>.',
    ],
    inPython: {
      code: 'words = ["bb", "a", "cc"]\nwords.sort(key=len)\nprint(words)',
      note: 'Python\'s <code>key=</code> cannot be inconsistent. A C++ comparison can, and a bad one is undefined behaviour, so rule out <code>&lt;=</code>.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// True when a should come before b: shorter words first.\nbool byLength(const string& a, const string& b) {\n    return a.size() <= b.size();\n}',
    solution: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// True when a should come before b: shorter words first.\nbool byLength(const string& a, const string& b) {\n    return a.size() < b.size();\n}',
    harness: h([
      'cout << byLength("ab", "abc") << endl;',
      'cout << byLength("abc", "abc") << endl;',
      'cout << byLength("abcd", "ab") << endl;',
      'vector<string> w = {"pear", "fig", "banana", "kiwis!!"};\nsort(w.begin(), w.end(), byLength);\nfor (const string& s : w) {\n    cout << s << " ";\n}\ncout << endl;',
    ]),
    tests: [
      { name: 'Shorter first', input: 'byLength("ab", "abc")', expected: '1' },
      { name: 'Equal lengths are not before each other', input: 'byLength("abc", "abc")', expected: '0' },
      { name: 'Longer is not first', input: 'byLength("abcd", "ab")', expected: '0' },
      { name: 'Sorting with it', input: 'sort of pear fig banana kiwis!!', expected: 'fig pear banana kiwis!!' },
    ],
  },

  // 25. practice: top k frequent
  {
    id: 'c7-practice-top-k',
    title: 'Practice: most frequent',
    kind: 'implement',
    task: 'Write <code>topK</code>: return the <code>k</code> most frequent values of the vector, most frequent first. When two values are equally frequent, the smaller value comes first.',
    introduces: [],
    refresher: [
      'Count with an <code>unordered_map&lt;int, int&gt;</code>, then copy the (count, value) pairs into a vector to sort them.',
      'Sort with a lambda: higher count first, and on a tie the smaller value first.',
    ],
    hints: [
      'Loop over the map with <code>for (auto&amp; kv : freq)</code> and push <code>make_pair(kv.second, kv.first)</code> into a <code>vector&lt;pair&lt;int, int&gt;&gt;</code>.',
      'Sort it with the two-key lambda, then copy the <code>second</code> of the first <code>k</code> pairs into the result.',
    ],
    inPython: {
      code: 'from collections import Counter\nv = [1, 1, 1, 2, 2, 3]\nitems = sorted(Counter(v).items(), key=lambda p: (-p[1], p[0]))\nprint([x for x, c in items[:2]])',
      note: 'The same plan: count, sort by (-count, value), take k. C++ writes the two-key comparison out in a lambda.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <utility>\n#include <algorithm>\n#include <unordered_map>\nusing namespace std;\n\n// The k most frequent values, most frequent first; ties: smaller value first.\nvector<int> topK(const vector<int>& v, int k) {\n    vector<int> result;\n    return result;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <utility>\n#include <algorithm>\n#include <unordered_map>\nusing namespace std;\n\n// The k most frequent values, most frequent first; ties: smaller value first.\nvector<int> topK(const vector<int>& v, int k) {\n    unordered_map<int, int> freq;\n    for (int x : v) {\n        freq[x]++;\n    }\n    vector<pair<int, int>> items;\n    for (auto& kv : freq) {\n        items.push_back(make_pair(kv.second, kv.first));\n    }\n    sort(items.begin(), items.end(), [](const pair<int, int>& a, const pair<int, int>& b) {\n        if (a.first != b.first) {\n            return a.first > b.first;\n        }\n        return a.second < b.second;\n    });\n    vector<int> result;\n    for (int i = 0; i < k; i++) {\n        result.push_back(items[i].second);\n    }\n    return result;\n}',
    harness: h([
      'vector<int> r = topK(vector<int>{1, 1, 1, 2, 2, 3}, 2);\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = topK(vector<int>{4, 4, 5, 5, 6}, 2);\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = topK(vector<int>{7}, 1);\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = topK(vector<int>{3, 3, 2, 2, 1, 1}, 3);\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
    ]),
    require: [{ pattern: 'sort\\s*\\(', message: 'Sort the counted pairs' }],
    tests: [
      { name: 'Clear winners', input: '{1,1,1,2,2,3}, k = 2', expected: '1 2' },
      { name: 'Tie goes to the smaller value', input: '{4,4,5,5,6}, k = 2', expected: '4 5' },
      { name: 'One value', input: '{7}, k = 1', expected: '7' },
      { name: 'Everything tied', input: '{3,3,2,2,1,1}, k = 3', expected: '1 2 3' },
    ],
  },

  // 26. practice: two sum
  {
    id: 'c7-practice-two-sum',
    title: 'Practice: two sum',
    kind: 'implement',
    task: 'Write <code>twoSum</code>: find two different positions <code>i &lt; j</code> whose values add up to <code>target</code>, and return them as a pair <code>(i, j)</code>. Return <code>(-1, -1)</code> when there is no such pair. The tests have at most one answer.',
    introduces: [],
    refresher: [
      'Walk the vector once. Keep an <code>unordered_map</code> from a value to the index where you saw it.',
      'For each <code>v[j]</code>, the partner you need is <code>target - v[j]</code>. If the map has it, you have the answer.',
    ],
    hints: [
      'For each index <code>j</code>, compute <code>need = target - v[j]</code> and check <code>seen.count(need)</code>.',
      'If found, return <code>make_pair(seen[need], j)</code>. Otherwise store <code>seen[v[j]] = j</code>. After the loop return <code>make_pair(-1, -1)</code>.',
    ],
    inPython: {
      code: 'def two_sum(v, target):\n    seen = {}\n    for j, x in enumerate(v):\n        if target - x in seen:\n            return seen[target - x], j\n        seen[x] = j\n    return -1, -1\n\nprint(two_sum([2, 7, 11, 15], 9))',
      note: 'Python returns a tuple; C++ returns a <code>pair</code>. The map lookups use <code>count</code> and <code>[]</code> instead of <code>in</code> and indexing.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <utility>\n#include <unordered_map>\nusing namespace std;\n\n// Indices (i, j), i < j, with v[i] + v[j] == target, or (-1, -1).\npair<int, int> twoSum(const vector<int>& v, int target) {\n    return make_pair(-1, -1);\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <utility>\n#include <unordered_map>\nusing namespace std;\n\n// Indices (i, j), i < j, with v[i] + v[j] == target, or (-1, -1).\npair<int, int> twoSum(const vector<int>& v, int target) {\n    unordered_map<int, int> seen;\n    for (int j = 0; j < static_cast<int>(v.size()); j++) {\n        int need = target - v[j];\n        if (seen.count(need) == 1) {\n            return make_pair(seen[need], j);\n        }\n        seen[v[j]] = j;\n    }\n    return make_pair(-1, -1);\n}',
    harness: h([
      'pair<int, int> r = twoSum(vector<int>{2, 7, 11, 15}, 9);\ncout << r.first << " " << r.second << endl;',
      'pair<int, int> r = twoSum(vector<int>{3, 2, 4}, 6);\ncout << r.first << " " << r.second << endl;',
      'pair<int, int> r = twoSum(vector<int>{1, 2, 3}, 100);\ncout << r.first << " " << r.second << endl;',
      'pair<int, int> r = twoSum(vector<int>{3, 3}, 6);\ncout << r.first << " " << r.second << endl;',
    ]),
    require: [{ pattern: 'unordered_map\\s*<', message: 'Use an unordered_map' }],
    tests: [
      { name: 'First two', input: '{2, 7, 11, 15}, 9', expected: '0 1' },
      { name: 'Middle and last', input: '{3, 2, 4}, 6', expected: '1 2' },
      { name: 'No pair', input: '{1, 2, 3}, 100', expected: '-1 -1' },
      { name: 'Equal values', input: '{3, 3}, 6', expected: '0 1' },
    ],
  },
]
