// C++ Learn lessons: stage 7 (part a), the STL mapped from Python: pair, tuple, sort, lambdas, map, unordered_map.
// Contract and examples: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md and
// docs/superpowers/specs/cpp-learn-lesson-examples.js. Check with: node scripts/verify-cpp-learn.mjs --stage 7
// Stages 1 to 6 are taught (vector, loops, functions, references, structs, classes, templates). Stage 7 is mostly
// implement / drill / bugfix with a C++ harness. The harness is appended after the learner's code and prints a
// @@TEST n@@ marker before each test. Printing the order of an unordered_map is never stored: keys are sorted first.
// C++14: no structured bindings, so pairs are read with .first / .second and tuples with get<0>.

// h(tests, pre): builds a harness. tests[i] is the C++ statements for test i + 1; pre holds helpers (named harness_*).
const h = (tests, pre = '') => {
  const body = tests.map((b, i) => `    cout << "\\n@@TEST ${i + 1}@@" << endl;\n    {\n${b.split('\n').map(l => '        ' + l).join('\n')}\n    }`).join('\n')
  return `${pre}int main() {\n${body}\n    return 0;\n}`
}

export const LESSONS = [
  // 1. pair
  {
    id: 'c7-pair',
    title: 'pair: two values together',
    kind: 'concept',
    task: 'Read a word and a whole number. Put them in one <code>pair</code>, then print the number doubled, a space, and the word.',
    introduces: ['include-utility', 'pair', 'pair-fields'],
    teach: {
      body: [
        `<p>Python has tuples: <code>("cat", 3)</code> holds two values under one name, and you read them with <code>p[0]</code> and <code>p[1]</code>. C++ has the same idea in a type called <code>pair</code>, from <code>#include &lt;utility&gt;</code>. You say what the two parts are: <code>pair&lt;string, int&gt; p;</code> is a pair whose first part is a <code>string</code> and whose second is an <code>int</code>. The angle brackets hold the types, like <code>vector&lt;int&gt;</code> did.</p>`,
        `<p>The two parts have fixed names, <code>first</code> and <code>second</code>, read with a dot: <code>p.first</code> and <code>p.second</code>. They are ordinary variables, so you can assign to them. To build a pair in one go write <code>make_pair("cat", 3)</code>, or use braces: <code>pair&lt;string, int&gt; p = {"cat", 3};</code>. Pairs compare like Python tuples do: first parts first, and the second parts only if the first parts are equal. That is why a vector of pairs sorts the way you expect.</p>`,
        `<p>This is the tool you will use all the time with maps, where every entry is a pair. Since this course uses C++14, you read the parts with <code>.first</code> and <code>.second</code>; there is no <code>a, b = p</code> unpacking.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <string>\n#include <utility>      // pair and make_pair\nusing namespace std;\n\nint main() {\n    pair<string, int> p = make_pair("cat", 3);   // a string and an int, together\n    cout << p.first << " " << p.second << endl;    // cat 3\n    p.second = p.second + 1;                       // the parts are ordinary variables\n    cout << p.second << endl;                      // 4\n    pair<int, int> a = {1, 9};                     // braces build one too\n    pair<int, int> b = {2, 0};\n    cout << (a < b) << endl;                       // 1: the first parts decide, 1 < 2\n    return 0;\n}',
          output: 'cat 3\n4\n1',
          caption: 'Making a pair, reading and changing its parts, and comparing two pairs.',
        },
      ],
      terms: [
        { code: 'pair<A, B>', meaning: 'two values under one name; the types are A and B' },
        { code: 'p.first, p.second', meaning: 'the first and the second part' },
        { code: 'make_pair(x, y)', meaning: 'builds a pair from two values' },
        { code: '#include <utility>', meaning: 'brings in pair' },
      ],
    },
    compare: {
      py: { code: 'p = ("cat", 3)\nprint(p[0], p[1])', outcome: 'Prints cat 3', ok: true },
      cpp: { code: 'pair<string, int> p = make_pair("cat", 3);\ncout << p.first << " " << p.second;', outcome: 'Prints cat 3 using .first and .second', ok: true },
      text: 'A Python tuple is read by index and can hold any number of parts. A C++ pair has exactly two parts with fixed types, read as <code>.first</code> and <code>.second</code>.',
    },
    refresher: [
      '<code>pair&lt;string, int&gt; p = make_pair("a", 1);</code> holds two values. Read them with <code>p.first</code> and <code>p.second</code>.',
      'Pairs compare like Python tuples: by the first part, then by the second.',
    ],
    hints: [
      'Read the word into a <code>string</code> and the number into an <code>int</code> first, then build the pair.',
      'Print <code>p.second * 2</code>, a space, then <code>p.first</code>.',
    ],
    inPython: {
      code: 'p = ("cat", 3)\nprint(p[1] * 2, p[0])',
      note: 'A tuple is read with <code>p[0]</code>. A pair uses the named parts <code>.first</code> and <code>.second</code>.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <utility>\nusing namespace std;\n\nint main() {\n    // read a word and a number, store them in a pair, print number * 2 then the word\n    return 0;\n}',
    solution: '#include <iostream>\n#include <string>\n#include <utility>\nusing namespace std;\n\nint main() {\n    string word;\n    int number;\n    cin >> word >> number;\n    pair<string, int> p = make_pair(word, number);\n    cout << p.second * 2 << " " << p.first << endl;\n    return 0;\n}',
    require: [{ pattern: 'pair\\s*<', message: 'Store the values in a pair' }, { pattern: '\\.first', message: 'Read a part with .first' }],
    tests: [
      { name: 'cat and 3', stdin: 'cat 3\n', expected: '6 cat' },
      { name: 'Larger number', stdin: 'zebra 50\n', expected: '100 zebra' },
      { name: 'Zero', stdin: 'x 0\n', expected: '0 x' },
    ],
  },

  // 2. tuple
  {
    id: 'c7-tuple',
    title: 'tuple and get<0>',
    kind: 'drill',
    task: 'Write <code>minMaxSum</code>: for a non-empty vector, return a <code>tuple</code> of its smallest value, its largest value and its sum, in that order.',
    introduces: ['include-tuple', 'tuple'],
    teach: {
      body: [
        `<p>When you need to hand back three values (a Python function can just <code>return lo, hi, total</code>), C++ has <code>tuple</code>, a pair that can have any number of parts. Include <code>&lt;tuple&gt;</code> and list the types: <code>tuple&lt;int, int, int&gt; t = make_tuple(1, 5, 9);</code>.</p>`,
        `<p>A tuple has no <code>.first</code>; the parts are numbered from 0, and you read part <em>n</em> with <code>get&lt;n&gt;(t)</code>. The number goes inside the angle brackets and must be written out: it cannot be a variable. So <code>get&lt;0&gt;(t)</code> is the first part and <code>get&lt;2&gt;(t)</code> the third. Tuples compare part by part, like Python's. (A <code>struct</code> with named fields is often clearer; a tuple is for quick one-off groups.)</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <string>\n#include <tuple>     // tuple, make_tuple, get\nusing namespace std;\n\nint main() {\n    tuple<string, int, double> t = make_tuple("pen", 3, 1.5);   // three parts, three types\n    cout << get<0>(t) << endl;     // pen: parts are counted from 0\n    cout << get<1>(t) << endl;     // 3\n    get<1>(t) = 10;                // get gives something you can assign to\n    cout << get<1>(t) * get<2>(t) << endl;   // 15\n    return 0;\n}',
          output: 'pen\n3\n15',
          caption: 'A tuple of three differently typed parts.',
        },
      ],
      terms: [
        { code: 'tuple<A, B, C>', meaning: 'a fixed group of values with those types' },
        { code: 'make_tuple(a, b, c)', meaning: 'builds a tuple' },
        { code: 'get<0>(t)', meaning: 'part number 0 of the tuple t; the number must be written out' },
      ],
    },
    refresher: [
      '<code>get&lt;0&gt;(t)</code> is the first part of a tuple, <code>get&lt;1&gt;(t)</code> the second. The index is fixed in the source.',
      'Build one with <code>make_tuple(a, b, c)</code>; the return type of the function is <code>tuple&lt;int, int, int&gt;</code>.',
    ],
    hints: [
      'Start <code>lo</code> and <code>hi</code> at <code>v[0]</code>, then loop over every value and update them and a running sum.',
      'End with <code>return make_tuple(lo, hi, sum);</code>.',
    ],
    inPython: {
      code: 'def min_max_sum(v):\n    return min(v), max(v), sum(v)\n\nprint(min_max_sum([4, 9, 2]))',
      note: 'Python returns several values as a tuple without saying so. C++ needs the <code>tuple</code> type in the signature and <code>make_tuple</code> in the return.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <tuple>\nusing namespace std;\n\n// Return (smallest, largest, sum) of a non-empty vector.\ntuple<int, int, int> minMaxSum(const vector<int>& v) {\n    return make_tuple(0, 0, 0);\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <tuple>\nusing namespace std;\n\n// Return (smallest, largest, sum) of a non-empty vector.\ntuple<int, int, int> minMaxSum(const vector<int>& v) {\n    int lo = v[0];\n    int hi = v[0];\n    int sum = 0;\n    for (int x : v) {\n        if (x < lo) {\n            lo = x;\n        }\n        if (x > hi) {\n            hi = x;\n        }\n        sum += x;\n    }\n    return make_tuple(lo, hi, sum);\n}',
    harness: h([
      'tuple<int, int, int> r = minMaxSum(vector<int>{4, 9, 2});\ncout << get<0>(r) << " " << get<1>(r) << " " << get<2>(r) << endl;',
      'tuple<int, int, int> r = minMaxSum(vector<int>{7});\ncout << get<0>(r) << " " << get<1>(r) << " " << get<2>(r) << endl;',
      'tuple<int, int, int> r = minMaxSum(vector<int>{-3, -8, 5, 0});\ncout << get<0>(r) << " " << get<1>(r) << " " << get<2>(r) << endl;',
    ]),
    require: [{ pattern: 'tuple', message: 'Return a tuple' }],
    tests: [
      { name: 'Three values', input: 'minMaxSum({4, 9, 2})', expected: '2 9 15' },
      { name: 'One value', input: 'minMaxSum({7})', expected: '7 7 7' },
      { name: 'Negatives', input: 'minMaxSum({-3, -8, 5, 0})', expected: '-8 5 -6' },
    ],
  },

  // 3. sort and iterators
  {
    id: 'c7-sort',
    title: 'sort and iterators',
    kind: 'concept',
    task: 'Read a count <code>n</code>, then <code>n</code> whole numbers. Print them in increasing order on one line, separated by single spaces.',
    introduces: ['include-algorithm', 'sort', 'iterator-begin-end'],
    teach: {
      body: [
        `<p>Python sorts a list with <code>v.sort()</code> or <code>sorted(v)</code>. In C++ sorting is a function from <code>#include &lt;algorithm&gt;</code>, and it needs to be told <em>which part</em> of the vector to sort. You give it two positions: <code>sort(v.begin(), v.end());</code> sorts the whole vector, in place, from smallest to largest.</p>`,
        `<p>A position inside a container is called an <em>iterator</em>. <code>v.begin()</code> is the position of the first item, and <code>v.end()</code> is the position <em>one past the last</em> item, a marker for "the end", not an item you can read. A range always runs from <code>begin</code> up to but not including <code>end</code>, the same way <code>range(0, n)</code> stops before <code>n</code>. You can move an iterator with <code>+</code>: <code>v.begin() + 1</code> is the second position. So <code>sort(v.begin() + 1, v.end())</code> sorts everything except the first item. Put <code>*</code> in front of an iterator to read the item it points at (the same dereference star you met with pointers): <code>*v.begin()</code> is the first value.</p>`,
        `<p>Unlike <code>sorted(v)</code>, C++'s <code>sort</code> changes the vector you give it and returns nothing. It works on anything that has an order: numbers, strings (alphabetical) and pairs.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>   // sort\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 2, 9, 1};\n    sort(v.begin(), v.end());          // sort the whole vector, in place\n    for (int x : v) {\n        cout << x << " ";\n    }\n    cout << endl;                      // 1 2 5 9\n\n    vector<int> w = {9, 4, 7, 1};\n    sort(w.begin() + 1, w.end());      // leave the first item alone\n    cout << w[0] << " " << w[1] << " " << w[3] << endl;   // 9 1 7\n    cout << *w.begin() << endl;        // * reads the item at a position: 9\n    return 0;\n}',
          output: '1 2 5 9\n9 1 7\n9',
          caption: 'Sorting the whole vector, then everything after the first item.',
        },
      ],
      terms: [
        { code: 'sort(v.begin(), v.end())', meaning: 'sorts the vector in place, smallest first' },
        { code: 'v.begin()', meaning: 'the position of the first item' },
        { code: 'v.end()', meaning: 'the position just past the last item (not readable)' },
        { code: '*it', meaning: 'the item an iterator points at' },
        { code: '#include <algorithm>', meaning: 'brings in sort and many other helpers' },
      ],
    },
    compare: {
      py: { code: 'v = [5, 2, 9, 1]\nv.sort()\nprint(v)', outcome: 'v is now [1, 2, 5, 9]', ok: true },
      cpp: { code: 'vector<int> v = {5, 2, 9, 1};\nsort(v.begin(), v.end());', outcome: 'v is now 1 2 5 9, sorted in place', ok: true },
      text: 'Both sort in place. C++ needs the start and end positions, so you can also sort just part of a vector.',
    },
    refresher: [
      '<code>sort(v.begin(), v.end());</code> sorts a vector in place, smallest first. It needs <code>#include &lt;algorithm&gt;</code>.',
      '<code>v.end()</code> is one past the last item, so a range stops before it, like <code>range(0, n)</code>.',
    ],
    hints: [
      'Read <code>n</code>, make a vector of that size, then read each number into it.',
      'Call <code>sort(v.begin(), v.end())</code> and print with a loop; put a space only between numbers.',
    ],
    inPython: {
      code: 'n = 4\nv = [5, 2, 9, 1]\nv.sort()\nprint(" ".join(str(x) for x in v))',
      note: 'Python\'s <code>sort()</code> takes no positions. C++ takes the begin and end iterators, which is what lets it sort only a slice.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    // read n and n numbers, print them sorted on one line\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) {\n        cin >> v[i];\n    }\n    sort(v.begin(), v.end());\n    for (int i = 0; i < n; i++) {\n        if (i > 0) {\n            cout << " ";\n        }\n        cout << v[i];\n    }\n    cout << endl;\n    return 0;\n}',
    require: [{ pattern: 'sort\\s*\\(', message: 'Use sort' }],
    tests: [
      { name: 'Four numbers', stdin: '4\n5 2 9 1\n', expected: '1 2 5 9' },
      { name: 'Already sorted', stdin: '3\n1 2 3\n', expected: '1 2 3' },
      { name: 'Negatives and repeats', stdin: '5\n0 -4 7 -4 2\n', expected: '-4 -4 0 2 7' },
      { name: 'One number', stdin: '1\n8\n', expected: '8' },
    ],
  },

  // 4. predict: iterators
  {
    id: 'c7-predict-iterators',
    title: 'Where is end()?',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then run it and compare.',
    introduces: [],
    refresher: [
      '<code>v.begin()</code> is the first item, <code>v.end()</code> is one past the last, and <code>end() - begin()</code> is the size.',
      'Reading <code>*v.end()</code> reads something that is not an item: undefined behaviour.',
    ],
    rounds: [
      {
        snippet: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 3, 8};\n    cout << *v.begin() << " " << v.end() - v.begin() << " " << *(v.begin() + 2) << endl;\n    return 0;\n}',
        choices: ['5 2 8', '5 3 8', '3 3 8'],
        answer: 1,
        why: '<code>*v.begin()</code> is the first item, 5. <code>end() - begin()</code> counts the items: 3. <code>begin() + 2</code> is the third position, holding 8.',
        output: '5 3 8',
      },
      {
        snippet: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 3, 8};\n    cout << *v.end() << endl;\n    return 0;\n}',
        choices: ['8, the last item', '0, an empty slot', 'Undefined: anything can happen'],
        answer: 2,
        why: '<code>end()</code> is just past the last item, so there is nothing valid to read. This is undefined behaviour: it may print junk or crash. Python would raise IndexError.',
        output: 'Undefined behaviour: anything can happen.',
        ub: true,
      },
    ],
  },

  // 5. lambda
  {
    id: 'c7-lambda',
    title: 'Lambdas: sort your way',
    kind: 'concept',
    task: 'Read a count <code>n</code>, then <code>n</code> whole numbers. Print them from largest to smallest on one line, separated by single spaces.',
    introduces: ['lambda'],
    teach: {
      body: [
        `<p>Plain <code>sort</code> goes smallest first. To sort another way, hand it a third argument: a small function that says, for two items <code>a</code> and <code>b</code>, whether <code>a</code> should come <em>before</em> <code>b</code>. C++ has an unnamed one-off function for this, called a <em>lambda</em>, just like Python's <code>lambda</code>. It looks like this: <code>[](int a, int b) { return a &gt; b; }</code>.</p>`,
        `<p>Read it in three parts. The square brackets <code>[]</code> start the lambda (they will hold captured variables in a later lesson; for now they stay empty). The parentheses list the parameters with types, as for any function. The braces hold the body, which can have several statements and a <code>return</code>. The comparison returns <code>true</code> when <code>a</code> belongs before <code>b</code>. So with <code>a &gt; b</code>, bigger numbers come first, and the vector ends up in descending order.</p>`,
        `<p>You can also keep a lambda in a variable: <code>auto isBig = [](int x) { return x &gt; 100; };</code>, then call <code>isBig(7)</code> like a function. When two items tie, <code>sort</code> may put them in either order, so spell out a tie-break when it matters.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {3, 8, 1, 6};\n    // the lambda says: a goes before b when a is larger\n    sort(v.begin(), v.end(), [](int a, int b) {\n        return a > b;\n    });\n    for (int x : v) {\n        cout << x << " ";\n    }\n    cout << endl;                              // 8 6 3 1\n\n    auto isBig = [](int x) { return x > 5; };  // a lambda kept in a variable\n    cout << isBig(7) << isBig(2) << endl;      // 10\n    return 0;\n}',
          output: '8 6 3 1\n10',
          caption: 'A descending sort, and a lambda stored in a variable.',
        },
      ],
      terms: [
        { code: '[](int a, int b) { ... }', meaning: 'an unnamed function: [] captures, () parameters, {} body' },
        { code: 'return a > b;', meaning: 'true means a goes before b' },
        { code: 'sort(begin, end, lambda)', meaning: 'sorts using your own ordering' },
      ],
    },
    compare: {
      py: { code: 'v = [3, 8, 1, 6]\nv.sort(key=lambda x: -x)\nprint(v)', outcome: 'v is now [8, 6, 3, 1]', ok: true },
      cpp: { code: 'vector<int> v = {3, 8, 1, 6};\nsort(v.begin(), v.end(), [](int a, int b) { return a > b; });', outcome: 'v is now 8 6 3 1', ok: true },
      text: 'Python\'s <code>key=</code> turns each item into a sort value. A C++ lambda is a comparison: it answers "does a go before b?", which is more flexible.',
    },
    refresher: [
      '<code>[](int a, int b) { return a &gt; b; }</code> is a lambda. Returning true means a goes before b.',
      'Pass it as the third argument: <code>sort(v.begin(), v.end(), lambda);</code>.',
    ],
    hints: [
      'Read and fill the vector as in the last lesson, then sort with a third argument.',
      'The lambda is <code>[](int a, int b) { return a &gt; b; }</code>.',
    ],
    inPython: {
      code: 'v = [3, 8, 1, 6]\nv.sort(reverse=True)\nprint(v)',
      note: 'Python has <code>reverse=True</code> for this. In C++ you say the ordering yourself with a comparison lambda.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    // read n and n numbers, print them largest first\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) {\n        cin >> v[i];\n    }\n    sort(v.begin(), v.end(), [](int a, int b) {\n        return a > b;\n    });\n    for (int i = 0; i < n; i++) {\n        if (i > 0) {\n            cout << " ";\n        }\n        cout << v[i];\n    }\n    cout << endl;\n    return 0;\n}',
    require: [{ pattern: '\\[\\s*\\]\\s*\\(', message: 'Sort with a lambda' }],
    tests: [
      { name: 'Four numbers', stdin: '4\n3 8 1 6\n', expected: '8 6 3 1' },
      { name: 'Already descending', stdin: '3\n9 5 2\n', expected: '9 5 2' },
      { name: 'Negatives', stdin: '5\n-1 -9 4 0 4\n', expected: '4 4 0 -1 -9' },
    ],
  },

  // 6. sort by key
  {
    id: 'c7-sort-key',
    title: 'Sorting like key=',
    kind: 'implement',
    task: 'Write <code>sortByLength</code>: sort a vector of strings so the shortest comes first. (The words in the tests all have different lengths.)',
    introduces: [],
    refresher: [
      'A lambda taking <code>const string&amp; a, const string&amp; b</code> avoids copying the strings. <code>a.size()</code> is the length.',
      'Return true when a belongs before b: here, when a is shorter.',
    ],
    hints: [
      'Call <code>sort(words.begin(), words.end(), ...)</code> with a lambda as the third argument.',
      'Inside the lambda: <code>return a.size() &lt; b.size();</code>.',
    ],
    inPython: {
      code: 'words = ["pear", "fig", "banana"]\nwords.sort(key=len)\nprint(words)',
      note: 'With <code>key=len</code> Python computes the length of each word. In C++ the lambda compares the two lengths itself.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Sort the words by length, shortest first.\nvoid sortByLength(vector<string>& words) {\n    sort(words.begin(), words.end());\n}',
    solution: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Sort the words by length, shortest first.\nvoid sortByLength(vector<string>& words) {\n    sort(words.begin(), words.end(), [](const string& a, const string& b) {\n        return a.size() < b.size();\n    });\n}',
    harness: h([
      'vector<string> w = {"pear", "fig", "banana"};\nsortByLength(w);\nfor (const string& s : w) {\n    cout << s << " ";\n}\ncout << endl;',
      'vector<string> w = {"a", "abcd", "abc", "ab"};\nsortByLength(w);\nfor (const string& s : w) {\n    cout << s << " ";\n}\ncout << endl;',
      'vector<string> w = {"zzz", "yy", "x"};\nsortByLength(w);\nfor (const string& s : w) {\n    cout << s << " ";\n}\ncout << endl;',
    ]),
    require: [{ pattern: '\\[\\s*\\]\\s*\\(', message: 'Use a lambda' }],
    tests: [
      { name: 'Three words', input: 'pear fig banana', expected: 'fig pear banana' },
      { name: 'Four words', input: 'a abcd abc ab', expected: 'a ab abc abcd' },
      { name: 'Longest first in the input', input: 'zzz yy x', expected: 'x yy zzz' },
    ],
  },

  // 7. captures
  {
    id: 'c7-lambda-capture',
    title: 'Lambda captures',
    kind: 'drill',
    task: 'Write <code>sortByDistance</code>: sort <code>v</code> by how far each value is from <code>target</code> (closest first). When two values are equally far, the smaller value comes first.',
    introduces: ['lambda-capture'],
    teach: {
      body: [
        `<p>A lambda is its own little function, so it cannot see the variables of the function around it. Python lambdas can (<code>lambda x: abs(x - target)</code> just uses <code>target</code>). In C++ you must say so in the square brackets, which are called the <em>capture list</em>. <code>[target]</code> copies <code>target</code> into the lambda so its body can use it. <code>[&amp;target]</code> instead lets the lambda use the original variable (a reference), so it sees later changes and can modify it. <code>[&amp;]</code> captures every variable it uses by reference, and <code>[=]</code> by copy.</p>`,
        `<p>For a sort comparison, capture by copy: <code>[target](int a, int b) { ... }</code>. The lambda can then use <code>target</code> in its body next to its own parameters. If you forget the capture, the compiler says the variable "is not captured".</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int limit = 10;\n    // [limit] copies limit into the lambda so the body can use it\n    auto isOver = [limit](int x) { return x > limit; };\n    cout << isOver(12) << isOver(3) << endl;   // 10\n\n    int calls = 0;\n    // [&calls] shares the real variable, so the lambda can change it\n    auto bump = [&calls]() { calls = calls + 1; };\n    bump();\n    bump();\n    cout << calls << endl;                     // 2\n    return 0;\n}',
          output: '10\n2',
          caption: 'Capture by copy and capture by reference.',
        },
      ],
      terms: [
        { code: '[x]', meaning: 'the lambda gets its own copy of x' },
        { code: '[&x]', meaning: 'the lambda uses the original x and can change it' },
        { code: '[&]', meaning: 'capture everything the body uses by reference' },
      ],
    },
    refresher: [
      'A lambda only sees outer variables you list in <code>[ ]</code>: <code>[target]</code> copies, <code>[&amp;target]</code> shares.',
      '<code>abs(x)</code> from <code>&lt;cmath&gt;</code> is the absolute value of an int.',
    ],
    hints: [
      'Capture <code>target</code> and compute <code>abs(a - target)</code> for both items.',
      'If the two distances are equal, return <code>a &lt; b</code>; otherwise compare the distances.',
    ],
    inPython: {
      code: 'v = [7, 1, 4, 10]\ntarget = 5\nv.sort(key=lambda x: (abs(x - target), x))\nprint(v)',
      note: 'The Python lambda reads <code>target</code> straight from the surrounding code. A C++ lambda has to capture it in its square brackets first.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\n// Sort v by distance to target, closest first; equal distances: smaller value first.\nvoid sortByDistance(vector<int>& v, int target) {\n    sort(v.begin(), v.end());\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\n// Sort v by distance to target, closest first; equal distances: smaller value first.\nvoid sortByDistance(vector<int>& v, int target) {\n    sort(v.begin(), v.end(), [target](int a, int b) {\n        int da = abs(a - target);\n        int db = abs(b - target);\n        if (da != db) {\n            return da < db;\n        }\n        return a < b;\n    });\n}',
    harness: h([
      'vector<int> v = {7, 1, 4, 10};\nsortByDistance(v, 5);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> v = {3, 7, 5, 4, 6};\nsortByDistance(v, 5);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> v = {-2, 9, 0, 3};\nsortByDistance(v, 0);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
    ]),
    require: [{ pattern: '\\[\\s*(?:target|&|=)', message: 'Capture target in the lambda' }],
    tests: [
      { name: 'Around 5', input: 'v = {7, 1, 4, 10}, target 5', expected: '4 7 1 10' },
      { name: 'Ties go to the smaller value', input: 'v = {3, 7, 5, 4, 6}, target 5', expected: '5 4 6 3 7' },
      { name: 'Around 0', input: 'v = {-2, 9, 0, 3}, target 0', expected: '0 -2 3 9' },
    ],
  },

  // 8. several keys
  {
    id: 'c7-multi-key',
    title: 'Sorting by several keys',
    kind: 'implement',
    task: 'Write <code>rankPlayers</code>: sort a vector of (name, score) pairs by score from highest to lowest. Players with the same score go in alphabetical order of name.',
    introduces: [],
    refresher: [
      'Compare the main key first. Only when the keys are equal fall back to the next key.',
      'For a pair <code>p</code> the parts are <code>p.first</code> (the name) and <code>p.second</code> (the score).',
    ],
    hints: [
      'In the lambda, first check <code>a.second != b.second</code>; if they differ, return <code>a.second &gt; b.second</code>.',
      'Otherwise return <code>a.first &lt; b.first</code>.',
    ],
    inPython: {
      code: 'players = [("bo", 5), ("al", 7), ("cy", 5)]\nplayers.sort(key=lambda p: (-p[1], p[0]))\nprint(players)',
      note: 'Python builds a tuple key and negates the score. C++ cannot negate a string, so you write the comparison in two steps.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <vector>\n#include <utility>\n#include <algorithm>\nusing namespace std;\n\n// Sort by score (highest first), then by name (A to Z).\nvoid rankPlayers(vector<pair<string, int>>& players) {\n    sort(players.begin(), players.end());\n}',
    solution: '#include <iostream>\n#include <string>\n#include <vector>\n#include <utility>\n#include <algorithm>\nusing namespace std;\n\n// Sort by score (highest first), then by name (A to Z).\nvoid rankPlayers(vector<pair<string, int>>& players) {\n    sort(players.begin(), players.end(), [](const pair<string, int>& a, const pair<string, int>& b) {\n        if (a.second != b.second) {\n            return a.second > b.second;\n        }\n        return a.first < b.first;\n    });\n}',
    harness: h([
      'vector<pair<string, int>> p = {make_pair("bo", 5), make_pair("al", 7), make_pair("cy", 5)};\nrankPlayers(p);\nfor (const pair<string, int>& x : p) {\n    cout << x.first << ":" << x.second << " ";\n}\ncout << endl;',
      'vector<pair<string, int>> p = {make_pair("zed", 1), make_pair("amy", 1), make_pair("max", 1)};\nrankPlayers(p);\nfor (const pair<string, int>& x : p) {\n    cout << x.first << ":" << x.second << " ";\n}\ncout << endl;',
      'vector<pair<string, int>> p = {make_pair("a", 2), make_pair("b", 9), make_pair("c", 2), make_pair("d", 9)};\nrankPlayers(p);\nfor (const pair<string, int>& x : p) {\n    cout << x.first << ":" << x.second << " ";\n}\ncout << endl;',
    ]),
    require: [{ pattern: '\\[\\s*\\]\\s*\\(', message: 'Use a lambda' }],
    tests: [
      { name: 'Score then name', input: 'bo 5, al 7, cy 5', expected: 'al:7 bo:5 cy:5' },
      { name: 'All tied', input: 'zed 1, amy 1, max 1', expected: 'amy:1 max:1 zed:1' },
      { name: 'Two groups of ties', input: 'a 2, b 9, c 2, d 9', expected: 'b:9 d:9 a:2 c:2' },
    ],
  },

  // 9. map
  {
    id: 'c7-map',
    title: 'map: the ordered dict',
    kind: 'concept',
    task: 'Read words until the input ends. Print each different word once, in alphabetical order, with how many times it appeared: <em>word count</em> on a line.',
    introduces: ['include-map', 'map'],
    teach: {
      body: [
        `<p>A Python <code>dict</code> maps keys to values. C++'s version is <code>map</code>, from <code>#include &lt;map&gt;</code>. You give the type of the key and of the value: <code>map&lt;string, int&gt; m;</code> maps words to whole numbers. Use it like a dict: <code>m["apple"] = 3;</code> stores, <code>m["apple"]</code> reads, and <code>m.size()</code> counts entries.</p>`,
        `<p>Two differences from a dict. First, a <code>map</code> keeps its keys <em>sorted</em>, so walking through it always goes in key order (alphabetical for strings), not insertion order. Second, if you read <code>m[key]</code> for a key that is not there, C++ <em>creates</em> it with a default value (0 for an <code>int</code>) instead of raising <code>KeyError</code>. That is handy for counting: <code>m[word]++;</code> works even the first time, because a missing count starts at 0. The next lessons come back to this carefully.</p>`,
        `<p>Each entry of a map is a <code>pair</code> of the key and the value, so a loop over the map gives you pairs: <code>for (auto&amp; kv : m)</code> and then <code>kv.first</code> is the key and <code>kv.second</code> the value. (<code>auto&amp;</code> means "whatever type the item is, without copying it".) You can also walk it with iterators: <code>for (auto it = m.begin(); it != m.end(); ++it)</code> and read <code>it-&gt;first</code> and <code>it-&gt;second</code>. The arrow <code>-&gt;</code> is the pointer arrow you know; an iterator behaves like a pointer to the pair.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <string>\n#include <map>       // map\nusing namespace std;\n\nint main() {\n    map<string, int> stock;           // string keys, int values\n    stock["pear"] = 4;\n    stock["apple"] = 7;\n    stock["pear"] = stock["pear"] + 1;   // read and update\n    for (auto& kv : stock) {          // each kv is a pair; keys come out sorted\n        cout << kv.first << " " << kv.second << endl;\n    }\n    for (auto it = stock.begin(); it != stock.end(); ++it) {\n        cout << it->first << ";";     // an iterator uses -> to reach the pair\n    }\n    cout << endl;\n    cout << stock.size() << endl;     // 2\n    return 0;\n}',
          output: 'apple 7\npear 5\napple;pear;\n2',
          caption: 'A map keeps keys in order; entries are pairs.',
        },
      ],
      terms: [
        { code: 'map<K, V>', meaning: 'a dict that keeps its keys sorted' },
        { code: 'm[key] = v;', meaning: 'stores or replaces the value for key' },
        { code: 'm[key]++', meaning: 'counts; a missing key starts at 0' },
        { code: 'for (auto& kv : m)', meaning: 'walks the entries; kv.first is the key, kv.second the value' },
        { code: 'it->first', meaning: 'the key an iterator points at' },
      ],
    },
    compare: {
      py: { code: 'd = {}\nd["a"] = 1\nprint(d["a"])', outcome: 'Prints 1', ok: true },
      cpp: { code: 'map<string, int> m;\nm["a"] = 1;\ncout << m["a"];', outcome: 'Prints 1; keys stay in sorted order', ok: true },
      text: 'The syntax is nearly the same. A C++ <code>map</code> needs its two types and always iterates in sorted key order.',
    },
    refresher: [
      '<code>map&lt;string, int&gt; m;</code>. <code>m[w]++</code> counts, because a missing int entry starts at 0.',
      'Loop with <code>for (auto&amp; kv : m)</code>; <code>kv.first</code> is the key, <code>kv.second</code> the value. A map walks in key order.',
    ],
    hints: [
      'Read with <code>while (cin &gt;&gt; word)</code> and do <code>counts[word]++;</code> for each word.',
      'Then loop over the map with <code>for (auto&amp; kv : counts)</code> and print <code>kv.first</code>, a space and <code>kv.second</code>.',
    ],
    inPython: {
      code: 'counts = {}\nfor w in ["b", "a", "b"]:\n    counts[w] = counts.get(w, 0) + 1\nfor k in sorted(counts):\n    print(k, counts[k])',
      note: 'Python needs <code>.get(w, 0)</code> to count safely and <code>sorted</code> to order the keys. A C++ <code>map</code> counts with <code>m[w]++</code> and is already sorted.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <map>\nusing namespace std;\n\nint main() {\n    // read words until the input ends, print each with its count in alphabetical order\n    return 0;\n}',
    solution: '#include <iostream>\n#include <string>\n#include <map>\nusing namespace std;\n\nint main() {\n    map<string, int> counts;\n    string word;\n    while (cin >> word) {\n        counts[word]++;\n    }\n    for (auto& kv : counts) {\n        cout << kv.first << " " << kv.second << endl;\n    }\n    return 0;\n}',
    require: [{ pattern: 'map\\s*<', message: 'Count with a map' }],
    tests: [
      { name: 'Repeated words', stdin: 'b a b c a b\n', expected: 'a 2\nb 3\nc 1' },
      { name: 'One word', stdin: 'solo\n', expected: 'solo 1' },
      { name: 'Words on several lines', stdin: 'pear\napple\npear\n', expected: 'apple 1\npear 2' },
    ],
  },

  // 10. count and find
  {
    id: 'c7-map-lookup',
    title: 'count and find',
    kind: 'drill',
    task: 'Write <code>lookupOr</code>: return the value stored for <code>key</code>, or <code>fallback</code> when the key is not in the map. It must not add the key to the map.',
    introduces: ['count-method'],
    teach: {
      body: [
        `<p>Reading <code>m[key]</code> adds the key when it is missing, which is wrong when you only want to look. To ask first, use <code>m.count(key)</code>: it gives the number of entries with that key, which for a map is <code>1</code> (present) or <code>0</code> (absent). It is C++'s <code>key in d</code>, and it changes nothing.</p>`,
        `<p>To look up and get the value in one step, use <code>m.find(key)</code>. It returns an iterator: the position of the entry if it exists, or <code>m.end()</code> if it does not. Compare with <code>== m.end()</code> to detect "not found". When it is found, <code>it-&gt;second</code> is the value. This is like <code>d.get(key)</code> returning <code>None</code>, except the "nothing" is the end position.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <string>\n#include <map>\nusing namespace std;\n\nint main() {\n    map<string, int> ages;\n    ages["ann"] = 30;\n    cout << ages.count("ann") << ages.count("bob") << endl;   // 10: present, absent\n\n    auto it = ages.find("ann");           // an iterator, or ages.end()\n    if (it != ages.end()) {\n        cout << it->second << endl;       // 30: the stored value\n    }\n    if (ages.find("bob") == ages.end()) {\n        cout << "no bob" << endl;\n    }\n    cout << ages.size() << endl;          // 1: looking never added anything\n    return 0;\n}',
          output: '10\n30\nno bob\n1',
          caption: 'count and find look without changing the map.',
        },
      ],
      terms: [
        { code: 'm.count(key)', meaning: 'how many entries have this key: 1 or 0 for a map' },
        { code: 'm.find(key)', meaning: 'an iterator to the entry, or m.end() when absent' },
        { code: 'it->second', meaning: 'the value of the entry the iterator points at' },
      ],
    },
    refresher: [
      '<code>m.count(key)</code> is 1 when present and 0 when absent. <code>m.find(key) == m.end()</code> also means absent.',
      '<code>m[key]</code> inserts a default entry when the key is missing. Use <code>count</code> or <code>find</code> to look without inserting.',
    ],
    hints: [
      'First check whether the key is present with <code>m.count(key)</code>.',
      'If it is absent return <code>fallback</code>; otherwise return the stored value.',
    ],
    inPython: {
      code: 'd = {"a": 1}\nprint(d.get("zz", 9))\nprint(len(d))',
      note: '<code>d.get(key, fallback)</code> never adds anything. In C++ <code>m[key]</code> does add the key, so you check with <code>count</code> or <code>find</code> yourself.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <map>\nusing namespace std;\n\n// Return m[key] if the key exists, otherwise fallback. Do not add the key.\nint lookupOr(map<string, int>& m, const string& key, int fallback) {\n    return m[key];\n}',
    solution: '#include <iostream>\n#include <string>\n#include <map>\nusing namespace std;\n\n// Return m[key] if the key exists, otherwise fallback. Do not add the key.\nint lookupOr(map<string, int>& m, const string& key, int fallback) {\n    if (m.count(key) == 0) {\n        return fallback;\n    }\n    return m[key];\n}',
    harness: h([
      'map<string, int> m;\nm["a"] = 1;\nm["b"] = 2;\ncout << lookupOr(m, "a", 9) << endl;',
      'map<string, int> m;\nm["a"] = 1;\nm["b"] = 2;\ncout << lookupOr(m, "zz", 9) << endl;',
      'map<string, int> m;\nm["a"] = 1;\nm["b"] = 2;\nlookupOr(m, "zz", 9);\nlookupOr(m, "yy", 9);\ncout << m.size() << endl;',
    ]),
    tests: [
      { name: 'Present key', input: 'lookupOr(m, "a", 9)', expected: '1' },
      { name: 'Absent key gives the fallback', input: 'lookupOr(m, "zz", 9)', expected: '9' },
      { name: 'Looking does not insert', input: 'm.size() after two misses', expected: '2' },
    ],
  },

  // 11. predict: m[k] inserts
  {
    id: 'c7-predict-map-insert',
    title: 'The map that grows',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then run it and compare.',
    introduces: [],
    refresher: [
      'Reading <code>m[key]</code> for a missing key inserts it with a default value (0 for an int). Python raises <code>KeyError</code>.',
      '<code>m.find(key)</code> and <code>m.count(key)</code> never change the map.',
    ],
    inPython: {
      code: 'd = {"a": 1}\nprint(d.get("zzz", 0), len(d))',
      note: '<code>d["zzz"]</code> raises KeyError and <code>.get</code> adds nothing. A C++ <code>m["zzz"]</code> silently adds the key.',
    },
    rounds: [
      {
        snippet: '#include <iostream>\n#include <string>\n#include <map>\nusing namespace std;\n\nint main() {\n    map<string, int> m;\n    m["a"] = 1;\n    int x = m["zzz"];\n    cout << x << " " << m.size() << endl;\n    return 0;\n}',
        choices: ['0 1', '0 2', 'It stops, like KeyError'],
        answer: 1,
        why: 'Reading <code>m["zzz"]</code> creates the key with the default value 0, so x is 0 and the map now has 2 entries. Python would raise KeyError here.',
        output: '0 2',
      },
      {
        snippet: '#include <iostream>\n#include <string>\n#include <map>\nusing namespace std;\n\nint main() {\n    map<string, int> m;\n    m["a"] = 1;\n    bool missing = (m.find("q") == m.end());\n    cout << missing << " " << m.size() << endl;\n    return 0;\n}',
        choices: ['0 1', '1 1', '1 2'],
        answer: 1,
        why: '<code>find</code> only looks. It returns <code>end()</code> for a missing key, so the comparison is true (printed as 1), and the map still has 1 entry.',
        output: '1 1',
      },
    ],
  },

  // 12. unordered_map
  {
    id: 'c7-unordered-map',
    title: 'unordered_map',
    kind: 'concept',
    task: 'Read words until the input ends. Count them with an <code>unordered_map</code>, then print each different word with its count, in alphabetical order.',
    introduces: ['include-unordered_map', 'unordered-map'],
    teach: {
      body: [
        `<p><code>map</code> keeps its keys sorted, which costs a little time on every lookup (it grows with the logarithm of the size). <code>unordered_map</code>, from <code>#include &lt;unordered_map&gt;</code>, skips the ordering and finds keys by hashing, which is what a Python <code>dict</code> does: a lookup takes about constant time. The code looks identical: <code>unordered_map&lt;string, int&gt; m;</code>, then <code>m[k] = v;</code>, <code>m.count(k)</code> and <code>m.find(k)</code> work exactly as before.</p>`,
        `<p>The catch is the order. Walking an <code>unordered_map</code> visits the entries in some order that you cannot predict and that can differ between compilers. (Python dicts remember insertion order, so this will surprise you.) Never rely on it. If you need a stable order, copy the keys into a <code>vector</code>, <code>sort</code> them, and print in that order. Use <code>map</code> when you need sorted keys, and <code>unordered_map</code> when you only need fast lookups.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n#include <unordered_map>   // unordered_map\nusing namespace std;\n\nint main() {\n    unordered_map<string, int> m;\n    m["pear"] = 2;\n    m["apple"] = 5;\n    m["fig"] = 1;\n    cout << m["apple"] << " " << m.count("kiwi") << endl;   // fast lookups work the same\n\n    vector<string> keys;             // the order of m is unpredictable, so\n    for (auto& kv : m) {             // copy the keys out ...\n        keys.push_back(kv.first);\n    }\n    sort(keys.begin(), keys.end());  // ... and sort them\n    for (const string& k : keys) {\n        cout << k << "=" << m[k] << " ";\n    }\n    cout << endl;\n    return 0;\n}',
          output: '5 0\napple=5 fig=1 pear=2',
          caption: 'Same code as a map, but print through sorted keys.',
        },
      ],
      terms: [
        { code: 'unordered_map<K, V>', meaning: 'a hash-based dict: fast lookups, no useful order' },
        { code: 'sort the keys first', meaning: 'copy keys into a vector and sort it to print in a stable order' },
      ],
    },
    compare: {
      py: { code: 'd = {}\nd["b"] = 1\nd["a"] = 2\nprint(list(d))', outcome: 'Prints [\'b\', \'a\'] (insertion order)', ok: true },
      cpp: { code: 'unordered_map<string, int> m;\nm["b"] = 1;\nm["a"] = 2;\nfor (auto& kv : m) {\n    cout << kv.first;\n}', outcome: 'Order is unspecified; sort the keys to print', ok: true },
      text: 'A Python dict walks in insertion order. An <code>unordered_map</code> walks in no promised order, so sort the keys when the order matters.',
    },
    refresher: [
      '<code>unordered_map</code> has the same calls as <code>map</code> but no useful order. Never print it directly.',
      'To print in a stable order: copy the keys into a vector, <code>sort</code> it, and look each key up.',
    ],
    hints: [
      'Count with <code>freq[word]++</code> in a <code>while (cin &gt;&gt; word)</code> loop.',
      'Collect <code>kv.first</code> of every entry into a <code>vector&lt;string&gt;</code>, sort it, and print each key with its count.',
    ],
    inPython: {
      code: 'freq = {}\nfor w in "b a b".split():\n    freq[w] = freq.get(w, 0) + 1\nfor k in sorted(freq):\n    print(k, freq[k])',
      note: 'Python sorts the keys with <code>sorted(freq)</code>. In C++ you copy the keys to a vector and sort that, because the map itself has no order.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    // count the words, print word and count in alphabetical order\n    return 0;\n}',
    solution: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    unordered_map<string, int> freq;\n    string word;\n    while (cin >> word) {\n        freq[word]++;\n    }\n    vector<string> keys;\n    for (auto& kv : freq) {\n        keys.push_back(kv.first);\n    }\n    sort(keys.begin(), keys.end());\n    for (const string& k : keys) {\n        cout << k << " " << freq[k] << endl;\n    }\n    return 0;\n}',
    require: [{ pattern: 'unordered_map\\s*<', message: 'Count with an unordered_map' }, { pattern: 'sort\\s*\\(', message: 'Sort the keys before printing' }],
    tests: [
      { name: 'Repeated words', stdin: 'b a b c a b\n', expected: 'a 2\nb 3\nc 1' },
      { name: 'One word', stdin: 'solo\n', expected: 'solo 1' },
      { name: 'Many different words', stdin: 'kiwi fig pear apple fig kiwi kiwi\n', expected: 'apple 1\nfig 2\nkiwi 3\npear 1' },
    ],
  },
]
