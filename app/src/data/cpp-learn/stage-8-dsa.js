// C++ Learn lessons: stage 8, DSA basics (DSA-lite; the path ends by pointing at Revise and Problems).
// Contract: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md. Check: node scripts/verify-cpp-learn.mjs --stage 8
// Mostly implement / bugfix lessons with a harness. Stages 1 to 7 are taught: vectors, pointers, struct, queue, stack,
// pair, sort, maps and the algorithm helpers. Nothing here prints an unordered container's order, and no stored
// output is undefined behaviour.

// h(tests, pre): builds a harness. tests[i] is the C++ statements for test i + 1; pre holds helpers (named harness_*).
const h = (tests, pre = '') => {
  const body = tests.map((b, i) => `    cout << "\\n@@TEST ${i + 1}@@" << endl;\n    {\n${b.split('\n').map(l => '        ' + l).join('\n')}\n    }`).join('\n')
  return `${pre}int main() {\n${body}\n    return 0;\n}`
}

// Shared harness helpers for the linked list lessons.
const LIST_HELPERS = `Node* harness_build(const vector<int>& vals) {
    Node* head = nullptr;
    Node* tail = nullptr;
    for (int x : vals) {
        Node* n = new Node;
        n->val = x;
        n->next = nullptr;
        if (head == nullptr) {
            head = n;
        } else {
            tail->next = n;
        }
        tail = n;
    }
    return head;
}

void harness_print(Node* head) {
    for (Node* cur = head; cur != nullptr; cur = cur->next) {
        cout << cur->val << " ";
    }
    cout << "end" << endl;
}

void harness_free(Node* head) {
    while (head != nullptr) {
        Node* next = head->next;
        delete head;
        head = next;
    }
}

`

export const LESSONS = [
  // 1. Big-O
  {
    id: 'c8-big-o',
    title: 'Big-O: how work grows',
    kind: 'concept',
    task: 'Read <code>n</code>. Print three numbers, one per line: how many times a plain loop over <code>n</code> items runs; how many pairs <code>(i, j)</code> with <code>i &lt; j</code> a nested loop visits; and how many times <code>n</code> can be halved (whole-number division by 2) before it reaches 1.',
    introduces: [],
    teach: {
      body: [
        `<p><em>Big-O</em> describes how the work of an algorithm grows as the input gets bigger, ignoring small constant factors. If a loop touches each of <code>n</code> items once, the work grows in step with <code>n</code>: it is <em>O(n)</em>. Double the input and the work doubles. Two nested loops over all pairs do about <code>n * n</code> steps: <em>O(n²)</em>, so doubling the input makes it four times slower. Something that halves the problem each step, like binary search, needs only about <code>log₂ n</code> steps: <em>O(log n)</em>. Reading one item by index is <em>O(1)</em>: it takes the same time however large the vector is.</p>`,
        `<p>At n = 1,000,000 the difference is huge: O(log n) is about 20 steps, O(n) is a million, O(n log n) about 20 million, and O(n²) is a trillion, which is far too slow. A computer does very roughly 100 million simple steps a second, so this is how you decide in advance whether an idea can work. C++ runs those steps much faster than Python, but a better Big-O beats a faster language: an O(n²) program in C++ still loses to an O(n log n) one in Python on big input.</p>`,
        `<p>The containers you just met have Big-O costs too. Searching a vector with <code>find</code> is O(n). A <code>set</code> or <code>map</code> lookup is O(log n). An <code>unordered_set</code> or <code>unordered_map</code> lookup is about O(1). <code>sort</code> is O(n log n). Python's <code>x in list</code> is O(n) and <code>x in set</code> is O(1), the same story.</p>`,
      ],
      examples: [
        {
          code: 'int n = 8;\nint single = 0;\nfor (int i = 0; i < n; i++) {           // n steps: O(n)\n    single++;\n}\nint pairs = 0;\nfor (int i = 0; i < n; i++) {           // about n * n / 2 steps: O(n^2)\n    for (int j = i + 1; j < n; j++) {\n        pairs++;\n    }\n}\nint halves = 0;\nint m = n;\nwhile (m > 1) {                         // n -> 4 -> 2 -> 1: log n steps\n    m = m / 2;\n    halves++;\n}\ncout << single << " " << pairs << " " << halves << endl;',
          output: '8 28 3',
          caption: 'Counting steps shows the growth: 8, 28 and 3 for n = 8.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'O(1)', meaning: 'the same work whatever the size' },
        { code: 'O(log n)', meaning: 'the problem halves every step' },
        { code: 'O(n)', meaning: 'one pass over the data' },
        { code: 'O(n log n)', meaning: 'a good sort' },
        { code: 'O(n²)', meaning: 'nested loops over all pairs' },
      ],
    },
    compare: {
      py: { code: 'total = 0\nfor i in range(1000):\n    total += i\nprint(total)', outcome: '1000 steps: O(n)', ok: true },
      cpp: { code: 'int total = 0;\nfor (int i = 0; i < 1000; i++) {\n    total += i;\n}\ncout << total;', outcome: '1000 steps: also O(n), but faster', ok: true },
      text: 'Big-O describes the algorithm, not the language. C++ runs each step faster, but the number of steps grows the same way.',
    },
    refresher: [
      'One loop over n items is O(n). A loop nested in a loop over all pairs is O(n²). Halving each step is O(log n).',
      'Pairs with <code>i &lt; j</code>: start the inner loop at <code>j = i + 1</code>.',
    ],
    hints: [
      'Use three counters, one per measurement. The first loop is <code>for (int i = 0; i &lt; n; i++)</code>.',
      'For pairs, make the inner loop start at <code>i + 1</code>. For halving, loop <code>while (m &gt; 1)</code> and set <code>m = m / 2</code>.',
    ],
    inPython: {
      code: 'n = 8\nm, halves = n, 0\nwhile m > 1:\n    m //= 2\n    halves += 1\nprint(halves)',
      note: 'The idea is language-independent. Counting steps in code shows how fast the work grows.',
    },
    starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // print: the single-loop count, the pair count (i < j), the number of halvings\n    return 0;\n}',
    solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int single = 0;\n    for (int i = 0; i < n; i++) {\n        single++;\n    }\n    int pairs = 0;\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            pairs++;\n        }\n    }\n    int halves = 0;\n    int m = n;\n    while (m > 1) {\n        m = m / 2;\n        halves++;\n    }\n    cout << single << endl;\n    cout << pairs << endl;\n    cout << halves << endl;\n    return 0;\n}',
    tests: [
      { name: 'n = 8', stdin: '8\n', expected: '8\n28\n3' },
      { name: 'n = 1', stdin: '1\n', expected: '1\n0\n0' },
      { name: 'n = 10', stdin: '10\n', expected: '10\n45\n3' },
      { name: 'n = 100', stdin: '100\n', expected: '100\n4950\n6' },
    ],
  },

  // 2. binary search
  {
    id: 'c8-binary-search',
    title: 'Binary search by hand',
    kind: 'implement',
    task: 'Write <code>binarySearch</code>: return the index of <code>target</code> in the sorted vector, or -1 if it is not there. Do it with a loop that halves the range, not with <code>lower_bound</code>.',
    introduces: [],
    teach: {
      body: [
        `<p>To find a number in a <em>sorted</em> vector, look at the middle item. If it is the target, done. If the target is smaller, it can only be in the left half; if larger, in the right half. Throw the other half away and repeat. Each step halves the range, so even a million items take about 20 steps: O(log n). You keep two indexes, <code>lo</code> and <code>hi</code>, for the part still possible, and the loop runs while that part is not empty: <code>while (lo &lt;= hi)</code>.</p>`,
        `<p>Compute the middle as <code>lo + (hi - lo) / 2</code>, not <code>(lo + hi) / 2</code>: the second can overflow an <code>int</code> when the indexes are huge. After checking <code>v[mid]</code>, move <code>lo = mid + 1</code> or <code>hi = mid - 1</code> (never leave <code>lo = mid</code>, which can loop forever). Use <code>int</code> indexes here: <code>hi</code> becomes -1 for an empty vector, which an unsigned <code>size_t</code> cannot hold.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 3, 5, 7, 9, 11};\n    int target = 7;\n    int lo = 0;\n    int hi = static_cast<int>(v.size()) - 1;\n    int found = -1;\n    while (lo <= hi) {                    // while some range is still possible\n        int mid = lo + (hi - lo) / 2;     // the middle, without overflow\n        if (v[mid] == target) {\n            found = mid;\n            break;\n        } else if (v[mid] < target) {\n            lo = mid + 1;                 // the target is to the right\n        } else {\n            hi = mid - 1;                 // the target is to the left\n        }\n    }\n    cout << found << endl;                // 3\n    return 0;\n}',
          output: '3',
          caption: 'Halve the range until the target is found or the range is empty.',
        },
      ],
      terms: [
        { code: 'lo, hi', meaning: 'the first and last index still possible' },
        { code: 'mid = lo + (hi - lo) / 2', meaning: 'the middle index, safe from overflow' },
        { code: 'lo = mid + 1 / hi = mid - 1', meaning: 'drop the half that cannot hold the target' },
      ],
    },
    refresher: [
      'Keep <code>lo</code> and <code>hi</code> as <code>int</code>. Loop while <code>lo &lt;= hi</code>; look at <code>mid = lo + (hi - lo) / 2</code>.',
      'Move past the middle: <code>lo = mid + 1</code> or <code>hi = mid - 1</code>. Return -1 when the loop ends.',
    ],
    hints: [
      'Start with <code>lo = 0</code> and <code>hi = static_cast&lt;int&gt;(v.size()) - 1</code>.',
      'Compare <code>v[mid]</code> with <code>target</code>: equal returns <code>mid</code>; smaller moves <code>lo</code>; larger moves <code>hi</code>.',
    ],
    inPython: {
      code: 'def binary_search(v, target):\n    lo, hi = 0, len(v) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if v[mid] == target:\n            return mid\n        if v[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\nprint(binary_search([1, 3, 5], 5))',
      note: 'The same loop. In C++ the middle is computed as <code>lo + (hi - lo) / 2</code> because <code>int</code> can overflow, which Python integers cannot.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Index of target in the sorted vector, or -1.\nint binarySearch(const vector<int>& v, int target) {\n    return -1;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Index of target in the sorted vector, or -1.\nint binarySearch(const vector<int>& v, int target) {\n    int lo = 0;\n    int hi = static_cast<int>(v.size()) - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (v[mid] == target) {\n            return mid;\n        }\n        if (v[mid] < target) {\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n    return -1;\n}',
    harness: h([
      'cout << binarySearch(vector<int>{1, 3, 5, 7, 9, 11}, 7) << endl;',
      'cout << binarySearch(vector<int>{1, 3, 5, 7, 9, 11}, 1) << " " << binarySearch(vector<int>{1, 3, 5, 7, 9, 11}, 11) << endl;',
      'cout << binarySearch(vector<int>{1, 3, 5, 7, 9, 11}, 4) << endl;',
      'cout << binarySearch(vector<int>{}, 4) << " " << binarySearch(vector<int>{4}, 4) << endl;',
    ]),
    forbidden: [{ pattern: 'lower_bound|upper_bound|binary_search', message: 'Write the halving loop yourself' }],
    tests: [
      { name: 'Found in the middle', input: '{1,3,5,7,9,11}, 7', expected: '3' },
      { name: 'First and last items', input: '{1,3,5,7,9,11}, 1 and 11', expected: '0 5' },
      { name: 'Absent value', input: '{1,3,5,7,9,11}, 4', expected: '-1' },
      { name: 'Empty and single item', input: '{}, 4 and {4}, 4', expected: '-1 0' },
    ],
  },

  // 3. bugfix: binary search
  {
    id: 'c8-fix-binary-search',
    title: 'The search that misses the end',
    kind: 'bugfix',
    task: 'This binary search works for most inputs but returns -1 for some values that are in the vector. Find the bug and fix it.',
    introduces: [],
    refresher: [
      'With <code>lo</code> and <code>hi</code> both inclusive indexes, one item remains when <code>lo == hi</code>. That item still has to be checked.',
      'The loop must keep going while the range is not empty: <code>lo &lt;= hi</code>.',
    ],
    hints: [
      'Trace a one-item vector <code>{5}</code> searching for 5. Does the loop body run?',
      'Change the loop condition so the case <code>lo == hi</code> is checked too.',
    ],
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Index of target in the sorted vector, or -1.\nint binarySearch(const vector<int>& v, int target) {\n    int lo = 0;\n    int hi = static_cast<int>(v.size()) - 1;\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (v[mid] == target) {\n            return mid;\n        }\n        if (v[mid] < target) {\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n    return -1;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Index of target in the sorted vector, or -1.\nint binarySearch(const vector<int>& v, int target) {\n    int lo = 0;\n    int hi = static_cast<int>(v.size()) - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (v[mid] == target) {\n            return mid;\n        }\n        if (v[mid] < target) {\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n    return -1;\n}',
    harness: h([
      'cout << binarySearch(vector<int>{1, 3, 5, 7}, 3) << endl;',
      'cout << binarySearch(vector<int>{5}, 5) << endl;',
      'cout << binarySearch(vector<int>{1, 3, 5, 7}, 7) << endl;',
      'cout << binarySearch(vector<int>{1, 3, 5, 7}, 6) << endl;',
    ]),
    tests: [
      { name: 'A middle item', input: '{1,3,5,7}, 3', expected: '1' },
      { name: 'A one-item vector', input: '{5}, 5', expected: '0' },
      { name: 'The last item', input: '{1,3,5,7}, 7', expected: '3' },
      { name: 'Absent value', input: '{1,3,5,7}, 6', expected: '-1' },
    ],
  },

  // 4. insertion sort
  {
    id: 'c8-insertion-sort',
    title: 'Insertion sort',
    kind: 'implement',
    task: 'Write <code>insertionSort</code>: sort the vector in increasing order in place, using insertion sort (do not call <code>sort</code>).',
    introduces: [],
    teach: {
      body: [
        `<p>Insertion sort works like sorting playing cards in your hand. Keep the left part of the vector sorted. Take the next item (the <em>key</em>) and slide it left past every bigger item until it sits in the right spot. Then the sorted part is one longer. Start with the second item (the first alone is already sorted) and repeat to the end.</p>`,
        `<p>In code: for each <code>i</code> from 1, save <code>key = v[i]</code>, set <code>j = i - 1</code>, and while <code>j &gt;= 0</code> and <code>v[j] &gt; key</code>, copy <code>v[j]</code> one place right and step <code>j</code> down. Then drop the key into <code>v[j + 1]</code>. It does up to n² steps, so O(n²), but it is simple and quick on small or nearly sorted input. Use <code>int</code> for <code>j</code>: it goes down to -1, which an unsigned type cannot hold.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {4, 2, 5, 1};\n    for (int i = 1; i < static_cast<int>(v.size()); i++) {\n        int key = v[i];                  // the card to place\n        int j = i - 1;\n        while (j >= 0 && v[j] > key) {   // slide bigger items right\n            v[j + 1] = v[j];\n            j--;\n        }\n        v[j + 1] = key;                  // drop it in the gap\n    }\n    for (int x : v) {\n        cout << x << " ";\n    }\n    cout << endl;                        // 1 2 4 5\n    return 0;\n}',
          output: '1 2 4 5',
          caption: 'Each pass grows the sorted left part by one.',
        },
      ],
      terms: [
        { code: 'key = v[i]', meaning: 'the item being placed' },
        { code: 'v[j + 1] = v[j]', meaning: 'slide a bigger item one place right' },
        { code: 'v[j + 1] = key', meaning: 'drop the key into the gap' },
      ],
    },
    refresher: [
      'For each <code>i</code> from 1: save <code>key = v[i]</code>, shift every bigger item on the left one place right, then write the key into the gap.',
      'Keep <code>j</code> an <code>int</code> so it can reach -1. Check <code>j &gt;= 0</code> before reading <code>v[j]</code>.',
    ],
    hints: [
      'Outer loop: <code>for (int i = 1; i &lt; n; i++)</code> with <code>int n = static_cast&lt;int&gt;(v.size());</code>.',
      'Inner loop: <code>while (j &gt;= 0 &amp;&amp; v[j] &gt; key)</code> shifts items right. After it, <code>v[j + 1] = key;</code>.',
    ],
    inPython: {
      code: 'v = [4, 2, 5, 1]\nfor i in range(1, len(v)):\n    key = v[i]\n    j = i - 1\n    while j >= 0 and v[j] > key:\n        v[j + 1] = v[j]\n        j -= 1\n    v[j + 1] = key\nprint(v)',
      note: 'Line for line the same. The C++ loop variables just need their types.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Sort v in increasing order, in place, with insertion sort.\nvoid insertionSort(vector<int>& v) {\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Sort v in increasing order, in place, with insertion sort.\nvoid insertionSort(vector<int>& v) {\n    int n = static_cast<int>(v.size());\n    for (int i = 1; i < n; i++) {\n        int key = v[i];\n        int j = i - 1;\n        while (j >= 0 && v[j] > key) {\n            v[j + 1] = v[j];\n            j--;\n        }\n        v[j + 1] = key;\n    }\n}',
    harness: h([
      'vector<int> v = {4, 2, 5, 1};\ninsertionSort(v);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> v = {1, 2, 3};\ninsertionSort(v);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> v = {9, 7, 5, 3, 3, -1};\ninsertionSort(v);\nfor (int x : v) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> v = {};\ninsertionSort(v);\ncout << v.size() << endl;',
    ]),
    forbidden: [{ pattern: '(?<![.\\w])sort\\s*\\(', message: 'Write the sort yourself' }],
    tests: [
      { name: 'Mixed', input: '{4, 2, 5, 1}', expected: '1 2 4 5' },
      { name: 'Already sorted', input: '{1, 2, 3}', expected: '1 2 3' },
      { name: 'Descending with a repeat', input: '{9, 7, 5, 3, 3, -1}', expected: '-1 3 3 5 7 9' },
      { name: 'Empty', input: '{}', expected: '0' },
    ],
  },

  // 5. merge
  {
    id: 'c8-merge',
    title: 'Merging two sorted vectors',
    kind: 'drill',
    task: 'Write <code>mergeSorted</code>: given two sorted vectors, return one sorted vector with all their values. Walk both with two indexes; do not call <code>sort</code>.',
    introduces: [],
    teach: {
      body: [
        `<p>Merging is the heart of merge sort. If two vectors are already sorted, you can combine them in one pass: keep an index into each, compare the two items they point at, copy the smaller into the result and advance that index. When one vector runs out, copy whatever is left of the other. Each item is copied once, so merging n items is O(n).</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> a = {1, 4};\n    vector<int> b = {2, 3, 9};\n    vector<int> out;\n    size_t i = 0;\n    size_t j = 0;\n    while (i < a.size() && j < b.size()) {   // both still have items\n        if (a[i] <= b[j]) {\n            out.push_back(a[i]);\n            i++;\n        } else {\n            out.push_back(b[j]);\n            j++;\n        }\n    }\n    while (i < a.size()) {                    // leftovers of a\n        out.push_back(a[i]);\n        i++;\n    }\n    while (j < b.size()) {                    // leftovers of b\n        out.push_back(b[j]);\n        j++;\n    }\n    for (int x : out) {\n        cout << x << " ";\n    }\n    cout << endl;                             // 1 2 3 4 9\n    return 0;\n}',
          output: '1 2 3 4 9',
          caption: 'Take the smaller front item each time, then copy the leftovers.',
        },
      ],
      terms: [
        { code: 'i, j', meaning: 'the next unused item in a and in b' },
        { code: 'a[i] <= b[j]', meaning: 'take from a when its item is not bigger (keeps equal items in order)' },
      ],
    },
    refresher: [
      'Two indexes <code>i</code> and <code>j</code>. While both vectors have items, push the smaller front item and advance its index.',
      'Afterwards copy what is left of whichever vector is not finished.',
    ],
    hints: [
      'First loop: <code>while (i &lt; a.size() &amp;&amp; j &lt; b.size())</code>.',
      'Then two more loops copy the rest of <code>a</code> and the rest of <code>b</code>.',
    ],
    inPython: {
      code: 'def merge(a, b):\n    out, i, j = [], 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    return out + a[i:] + b[j:]\n\nprint(merge([1, 4], [2, 3, 9]))',
      note: 'Python can finish with slices <code>a[i:] + b[j:]</code>. In C++ you copy the leftovers with small loops.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Merge two sorted vectors into one sorted vector.\nvector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {\n    vector<int> out;\n    return out;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Merge two sorted vectors into one sorted vector.\nvector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {\n    vector<int> out;\n    size_t i = 0;\n    size_t j = 0;\n    while (i < a.size() && j < b.size()) {\n        if (a[i] <= b[j]) {\n            out.push_back(a[i]);\n            i++;\n        } else {\n            out.push_back(b[j]);\n            j++;\n        }\n    }\n    while (i < a.size()) {\n        out.push_back(a[i]);\n        i++;\n    }\n    while (j < b.size()) {\n        out.push_back(b[j]);\n        j++;\n    }\n    return out;\n}',
    harness: h([
      'vector<int> r = mergeSorted(vector<int>{1, 4}, vector<int>{2, 3, 9});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = mergeSorted(vector<int>{}, vector<int>{5, 6});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = mergeSorted(vector<int>{1, 1, 5}, vector<int>{1, 5, 5});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
    ]),
    forbidden: [{ pattern: '(?<![.\\w])sort\\s*\\(', message: 'Merge with two indexes, not sort' }],
    tests: [
      { name: 'Interleaved', input: '{1, 4} and {2, 3, 9}', expected: '1 2 3 4 9' },
      { name: 'One empty', input: '{} and {5, 6}', expected: '5 6' },
      { name: 'Repeats', input: '{1, 1, 5} and {1, 5, 5}', expected: '1 1 1 5 5 5' },
    ],
  },

  // 6. merge sort
  {
    id: 'c8-merge-sort',
    title: 'Merge sort',
    kind: 'implement',
    task: 'Write <code>mergeSort</code>: return a sorted copy of the vector by splitting it in half, sorting each half recursively, and merging with the given <code>mergeSorted</code>.',
    introduces: [],
    teach: {
      body: [
        `<p>Merge sort is "divide and conquer". A vector of 0 or 1 items is already sorted: that is the base case. Otherwise cut it in the middle, sort the left half and the right half by calling <code>mergeSort</code> on each (recursion), then merge the two sorted halves. Halving gives about log n levels, and every level does O(n) merging, so the total is <em>O(n log n)</em>, much better than insertion sort's O(n²) on big input.</p>`,
        `<p>To copy a part of a vector, build a new one from two iterators: <code>vector&lt;int&gt; left(v.begin(), v.begin() + mid);</code> holds the items from the start up to, not including, position <code>mid</code>, and <code>vector&lt;int&gt; right(v.begin() + mid, v.end());</code> holds the rest. This is Python's <code>v[:mid]</code> and <code>v[mid:]</code>. Here <code>mergeSorted</code> is already written for you in the starter.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {10, 20, 30, 40, 50};\n    int mid = static_cast<int>(v.size()) / 2;                 // 2\n    vector<int> left(v.begin(), v.begin() + mid);            // 10 20\n    vector<int> right(v.begin() + mid, v.end());             // 30 40 50\n    cout << left.size() << " " << right.size() << endl;      // 2 3\n    cout << left[1] << " " << right[0] << endl;              // 20 30\n    return 0;\n}',
          output: '2 3\n20 30',
          caption: 'Copying the two halves of a vector.',
        },
      ],
      terms: [
        { code: 'vector<int> left(v.begin(), v.begin() + mid)', meaning: 'a new vector holding the items before position mid' },
        { code: 'base case', meaning: 'a vector of size 0 or 1 is already sorted: return it' },
      ],
    },
    refresher: [
      'Base case: size 0 or 1, return the vector as is. Otherwise split at <code>mid = size / 2</code>, sort both halves, merge.',
      '<code>vector&lt;int&gt; left(v.begin(), v.begin() + mid);</code> copies the first half.',
    ],
    hints: [
      'Start with <code>if (v.size() &lt;= 1) return v;</code>.',
      'Make <code>left</code> and <code>right</code>, then <code>return mergeSorted(mergeSort(left), mergeSort(right));</code>.',
    ],
    inPython: {
      code: 'def merge_sort(v):\n    if len(v) <= 1:\n        return v\n    mid = len(v) // 2\n    return merge(merge_sort(v[:mid]), merge_sort(v[mid:]))',
      note: 'The same recursion. The slices <code>v[:mid]</code> and <code>v[mid:]</code> become vectors built from two iterators.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Merge two sorted vectors (already written for you).\nvector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {\n    vector<int> out;\n    size_t i = 0;\n    size_t j = 0;\n    while (i < a.size() && j < b.size()) {\n        if (a[i] <= b[j]) {\n            out.push_back(a[i]);\n            i++;\n        } else {\n            out.push_back(b[j]);\n            j++;\n        }\n    }\n    while (i < a.size()) {\n        out.push_back(a[i]);\n        i++;\n    }\n    while (j < b.size()) {\n        out.push_back(b[j]);\n        j++;\n    }\n    return out;\n}\n\n// Return a sorted copy of v using merge sort.\nvector<int> mergeSort(const vector<int>& v) {\n    return v;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Merge two sorted vectors (already written for you).\nvector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {\n    vector<int> out;\n    size_t i = 0;\n    size_t j = 0;\n    while (i < a.size() && j < b.size()) {\n        if (a[i] <= b[j]) {\n            out.push_back(a[i]);\n            i++;\n        } else {\n            out.push_back(b[j]);\n            j++;\n        }\n    }\n    while (i < a.size()) {\n        out.push_back(a[i]);\n        i++;\n    }\n    while (j < b.size()) {\n        out.push_back(b[j]);\n        j++;\n    }\n    return out;\n}\n\n// Return a sorted copy of v using merge sort.\nvector<int> mergeSort(const vector<int>& v) {\n    if (v.size() <= 1) {\n        return v;\n    }\n    int mid = static_cast<int>(v.size()) / 2;\n    vector<int> left(v.begin(), v.begin() + mid);\n    vector<int> right(v.begin() + mid, v.end());\n    return mergeSorted(mergeSort(left), mergeSort(right));\n}',
    harness: h([
      'vector<int> r = mergeSort(vector<int>{5, 2, 9, 1, 7});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = mergeSort(vector<int>{3});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = mergeSort(vector<int>{4, 4, -2, 0, 4, -2});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
      'vector<int> r = mergeSort(vector<int>{8, 7, 6, 5, 4, 3, 2, 1});\nfor (int x : r) {\n    cout << x << " ";\n}\ncout << endl;',
    ]),
    forbidden: [{ pattern: '(?<![.\\w])sort\\s*\\(', message: 'Use merge sort, not sort' }],
    require: [{ pattern: 'mergeSort\\s*\\(\\s*(?:left|right)', message: 'Call mergeSort on each half (recursion)' }],
    tests: [
      { name: 'Five numbers', input: '{5, 2, 9, 1, 7}', expected: '1 2 5 7 9' },
      { name: 'One number', input: '{3}', expected: '3' },
      { name: 'Repeats and negatives', input: '{4, 4, -2, 0, 4, -2}', expected: '-2 -2 0 4 4 4' },
      { name: 'Reversed', input: '{8, 7, 6, 5, 4, 3, 2, 1}', expected: '1 2 3 4 5 6 7 8' },
    ],
  },

  // 7. linked list
  {
    id: 'c8-linked-list',
    title: 'A linked list',
    kind: 'concept',
    task: 'Write <code>pushFront</code> (add a value at the front of the list and return the new head) and <code>printList</code> (print each value followed by <code> -&gt; </code>, then the word <code>null</code>, on one line).',
    introduces: [],
    teach: {
      body: [
        `<p>A <em>linked list</em> stores values in separate little boxes called <em>nodes</em>, each holding a value and a pointer to the next node. The last node's pointer is <code>nullptr</code>. You keep one pointer, the <em>head</em>, to the first node; an empty list is just <code>head == nullptr</code>. It is the Python class <code>class Node: def __init__(self, val): self.val = val; self.next = None</code>, with <code>None</code> written <code>nullptr</code> and the field reached with the arrow <code>-&gt;</code> that you met with pointers.</p>`,
        `<p>To add a value at the front: make a new node with <code>new</code>, point its <code>next</code> at the old head, and return the new node as the head. To walk the list, start at the head and follow <code>next</code> until you reach <code>nullptr</code>: <code>for (Node* cur = head; cur != nullptr; cur = cur-&gt;next)</code>. Adding at the front is O(1); finding an item means walking, O(n). Nodes made with <code>new</code> must be freed with <code>delete</code>; the test code does that for you here.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int val;        // the value stored here\n    Node* next;     // the next node, or nullptr at the end\n};\n\nint main() {\n    Node* head = nullptr;               // an empty list\n    for (int x = 1; x <= 3; x++) {\n        Node* n = new Node;\n        n->val = x;\n        n->next = head;                 // point at the old first node\n        head = n;                       // this node is the new head\n    }\n    for (Node* cur = head; cur != nullptr; cur = cur->next) {\n        cout << cur->val << " ";        // walk by following next\n    }\n    cout << endl;                       // 3 2 1\n    while (head != nullptr) {           // give the memory back\n        Node* next = head->next;\n        delete head;\n        head = next;\n    }\n    return 0;\n}',
          output: '3 2 1',
          caption: 'Building a list by adding at the front, then walking it.',
        },
      ],
      terms: [
        { code: 'struct Node { int val; Node* next; };', meaning: 'a node: a value and a pointer to the next node' },
        { code: 'nullptr', meaning: 'the end of the list; an empty list has head == nullptr' },
        { code: 'cur = cur->next', meaning: 'step to the next node' },
      ],
    },
    compare: {
      py: { code: 'class Node:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\nhead = Node(1, Node(2))\nprint(head.next.val)', outcome: 'Prints 2; the links are references', ok: true },
      cpp: { code: 'struct Node {\n    int val;\n    Node* next;\n};', outcome: 'A node with an explicit pointer; you manage the memory', ok: true },
      text: 'Python references are hidden and cleaned up for you. In C++ the link is a visible pointer, and a node made with <code>new</code> must be <code>delete</code>d.',
    },
    refresher: [
      'A node has a value and a <code>next</code> pointer. <code>nullptr</code> ends the list. <code>pushFront</code> makes a node pointing at the old head.',
      'Walk with <code>for (Node* cur = head; cur != nullptr; cur = cur-&gt;next)</code>.',
    ],
    hints: [
      'In <code>pushFront</code>: <code>Node* n = new Node;</code>, set <code>n-&gt;val</code> and <code>n-&gt;next = head</code>, then <code>return n;</code>.',
      'In <code>printList</code>, print <code>cur-&gt;val</code> then <code>" -&gt; "</code> for each node, and <code>"null"</code> with <code>endl</code> after the loop.',
    ],
    inPython: {
      code: 'class Node:\n    def __init__(self, val, next):\n        self.val, self.next = val, next\n\nhead = None\nfor x in [1, 2, 3]:\n    head = Node(x, head)\nprint(head.val)',
      note: 'Python builds the same chain, one node per value. C++ makes each node with <code>new</code> and keeps raw pointers.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* next;\n};\n\n// Add val at the front of the list; return the new head.\nNode* pushFront(Node* head, int val) {\n    return head;\n}\n\n// Print "v -> v -> ... -> null" on one line (an empty list prints just null).\nvoid printList(Node* head) {\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* next;\n};\n\n// Add val at the front of the list; return the new head.\nNode* pushFront(Node* head, int val) {\n    Node* n = new Node;\n    n->val = val;\n    n->next = head;\n    return n;\n}\n\n// Print "v -> v -> ... -> null" on one line (an empty list prints just null).\nvoid printList(Node* head) {\n    for (Node* cur = head; cur != nullptr; cur = cur->next) {\n        cout << cur->val << " -> ";\n    }\n    cout << "null" << endl;\n}',
    harness: h([
      'Node* head = nullptr;\nhead = pushFront(head, 1);\nhead = pushFront(head, 2);\nhead = pushFront(head, 3);\nprintList(head);\nharness_free(head);',
      'Node* head = nullptr;\nprintList(head);',
      'Node* head = nullptr;\nhead = pushFront(head, 7);\nprintList(head);\nharness_free(head);',
    ], `void harness_free(Node* head) {
    while (head != nullptr) {
        Node* next = head->next;
        delete head;
        head = next;
    }
}

`),
    require: [{ pattern: 'new\\s+Node', message: 'Make nodes with new' }],
    tests: [
      { name: 'Three pushes', input: 'push 1, 2, 3', expected: '3 -> 2 -> 1 -> null' },
      { name: 'Empty list', input: 'no pushes', expected: 'null' },
      { name: 'One node', input: 'push 7', expected: '7 -> null' },
    ],
  },

  // 8. reverse a linked list
  {
    id: 'c8-list-reverse',
    title: 'Reversing a linked list',
    kind: 'implement',
    task: 'Write <code>reverseList</code>: reverse the list by re-pointing the <code>next</code> pointers, and return the new head. Do not create new nodes.',
    introduces: [],
    teach: {
      body: [
        `<p>To reverse a list, turn every arrow around. Walk down the list with a pointer <code>cur</code> and keep another pointer <code>prev</code> for the node you just left (it starts as <code>nullptr</code>, because the old first node will become the last). At each node do three things in order: remember the next node (<code>Node* nxt = cur-&gt;next;</code>, or you lose the rest of the list), point <code>cur-&gt;next</code> back at <code>prev</code>, then step both pointers forward: <code>prev = cur; cur = nxt;</code>.</p>`,
        `<p>When <code>cur</code> becomes <code>nullptr</code>, <code>prev</code> is the old last node, which is the new head: return it. It is O(n) time and no extra memory, just three pointers. Forgetting to save <code>next</code> before overwriting it is the classic mistake.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* next;\n};\n\nint main() {\n    Node c = {3, nullptr};\n    Node b = {2, &c};\n    Node a = {1, &b};          // the list 1 -> 2 -> 3\n    Node* prev = nullptr;\n    Node* cur = &a;\n    while (cur != nullptr) {\n        Node* nxt = cur->next; // 1. remember the rest\n        cur->next = prev;      // 2. turn the arrow around\n        prev = cur;            // 3. step forward\n        cur = nxt;\n    }\n    for (Node* p = prev; p != nullptr; p = p->next) {\n        cout << p->val << " ";\n    }\n    cout << endl;              // 3 2 1\n    return 0;\n}',
          output: '3 2 1',
          caption: 'Three nodes, turned around one arrow at a time.',
        },
      ],
      terms: [
        { code: 'prev, cur, nxt', meaning: 'the node behind, the current node, and the saved next node' },
        { code: 'cur->next = prev', meaning: 'turn the arrow around' },
        { code: 'return prev', meaning: 'the old last node is the new head' },
      ],
    },
    refresher: [
      'Per node: save <code>nxt = cur-&gt;next</code>, set <code>cur-&gt;next = prev</code>, then <code>prev = cur; cur = nxt;</code>.',
      'After the loop <code>prev</code> is the new head. An empty list returns <code>nullptr</code>.',
    ],
    hints: [
      'Start with <code>Node* prev = nullptr;</code> and <code>Node* cur = head;</code>, then <code>while (cur != nullptr)</code>.',
      'Return <code>prev</code> after the loop.',
    ],
    inPython: {
      code: 'def reverse(head):\n    prev = None\n    while head:\n        nxt = head.next\n        head.next = prev\n        prev, head = head, nxt\n    return prev',
      note: 'The same three steps. C++ spells the empty pointer <code>nullptr</code> instead of <code>None</code>.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* next;\n};\n\n// Reverse the list in place; return the new head.\nNode* reverseList(Node* head) {\n    return head;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* next;\n};\n\n// Reverse the list in place; return the new head.\nNode* reverseList(Node* head) {\n    Node* prev = nullptr;\n    Node* cur = head;\n    while (cur != nullptr) {\n        Node* nxt = cur->next;\n        cur->next = prev;\n        prev = cur;\n        cur = nxt;\n    }\n    return prev;\n}',
    harness: h([
      'Node* head = harness_build(vector<int>{1, 2, 3});\nhead = reverseList(head);\nharness_print(head);\nharness_free(head);',
      'Node* head = harness_build(vector<int>{});\nhead = reverseList(head);\nharness_print(head);',
      'Node* head = harness_build(vector<int>{9});\nhead = reverseList(head);\nharness_print(head);\nharness_free(head);',
      'Node* head = harness_build(vector<int>{4, 5, 6, 7, 8});\nhead = reverseList(head);\nharness_print(head);\nharness_free(head);',
    ], LIST_HELPERS),
    tests: [
      { name: 'Three nodes', input: '1 -> 2 -> 3', expected: '3 2 1 end' },
      { name: 'Empty list', input: 'empty', expected: 'end' },
      { name: 'One node', input: '9', expected: '9 end' },
      { name: 'Five nodes', input: '4 -> 5 -> 6 -> 7 -> 8', expected: '8 7 6 5 4 end' },
    ],
  },

  // 9. adjacency list
  {
    id: 'c8-adjacency-list',
    title: 'A graph as an adjacency list',
    kind: 'implement',
    task: 'Write <code>buildGraph</code>: given <code>n</code> nodes (numbered 0 to n-1) and a list of undirected edges, return the adjacency list. Each node lists its neighbours in the order the edges were given.',
    introduces: [],
    teach: {
      body: [
        `<p>A <em>graph</em> is a set of nodes joined by edges: cities and roads, people and friendships. The usual way to store one is an <em>adjacency list</em>: for every node, a list of the nodes it is joined to. In C++ that is a vector of vectors, <code>vector&lt;vector&lt;int&gt;&gt; adj(n);</code>, where <code>adj[a]</code> is the list of neighbours of node <code>a</code>. In Python you would write a dict of lists, or a list of lists. It uses space proportional to the nodes plus the edges, and listing a node's neighbours is quick.</p>`,
        `<p>An undirected edge between <code>a</code> and <code>b</code> goes both ways, so you add it twice: <code>adj[a].push_back(b);</code> and <code>adj[b].push_back(a);</code>. Edges arrive here as a vector of pairs, <code>vector&lt;pair&lt;int, int&gt;&gt;</code>, read with <code>.first</code> and <code>.second</code>. The searches in the next lessons (BFS and DFS) run on this structure.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<vector<int>> adj(3);      // three nodes, each with an empty neighbour list\n    adj[0].push_back(1);             // edge 0 - 1: add it both ways\n    adj[1].push_back(0);\n    adj[1].push_back(2);             // edge 1 - 2\n    adj[2].push_back(1);\n    cout << adj[1].size() << endl;   // 2: node 1 has two neighbours\n    for (int nb : adj[1]) {\n        cout << nb << " ";\n    }\n    cout << endl;                    // 0 2\n    return 0;\n}',
          output: '2\n0 2',
          caption: 'Each undirected edge is stored twice.',
        },
      ],
      terms: [
        { code: 'vector<vector<int>> adj(n)', meaning: 'n nodes, each with its own list of neighbours' },
        { code: 'adj[a].push_back(b)', meaning: 'b is a neighbour of a' },
      ],
    },
    refresher: [
      '<code>vector&lt;vector&lt;int&gt;&gt; adj(n);</code> makes n empty neighbour lists. Add an undirected edge to both nodes.',
      'For an edge pair <code>e</code>: <code>e.first</code> and <code>e.second</code> are its two ends.',
    ],
    hints: [
      'Make <code>adj(n)</code>, then loop over the edges with <code>for (const pair&lt;int, int&gt;&amp; e : edges)</code>.',
      'Inside: <code>adj[e.first].push_back(e.second);</code> and <code>adj[e.second].push_back(e.first);</code>.',
    ],
    inPython: {
      code: 'n = 3\nadj = [[] for _ in range(n)]\nfor a, b in [(0, 1), (1, 2)]:\n    adj[a].append(b)\n    adj[b].append(a)\nprint(adj)',
      note: 'The same list of lists. C++ reads the edge ends as <code>.first</code> and <code>.second</code> instead of unpacking.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <utility>\nusing namespace std;\n\n// Undirected graph on nodes 0..n-1 as an adjacency list.\nvector<vector<int>> buildGraph(int n, const vector<pair<int, int>>& edges) {\n    vector<vector<int>> adj(n);\n    return adj;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <utility>\nusing namespace std;\n\n// Undirected graph on nodes 0..n-1 as an adjacency list.\nvector<vector<int>> buildGraph(int n, const vector<pair<int, int>>& edges) {\n    vector<vector<int>> adj(n);\n    for (const pair<int, int>& e : edges) {\n        adj[e.first].push_back(e.second);\n        adj[e.second].push_back(e.first);\n    }\n    return adj;\n}',
    harness: h([
      'vector<pair<int, int>> edges = {make_pair(0, 1), make_pair(0, 2), make_pair(1, 3)};\nvector<vector<int>> adj = buildGraph(4, edges);\nharness_show(adj);',
      'vector<pair<int, int>> edges;\nvector<vector<int>> adj = buildGraph(2, edges);\nharness_show(adj);',
      'vector<pair<int, int>> edges = {make_pair(2, 0), make_pair(1, 2), make_pair(0, 1)};\nvector<vector<int>> adj = buildGraph(3, edges);\nharness_show(adj);',
    ], `void harness_show(const vector<vector<int>>& adj) {
    for (size_t i = 0; i < adj.size(); i++) {
        cout << i << ":";
        for (int nb : adj[i]) {
            cout << " " << nb;
        }
        cout << endl;
    }
}

`),
    tests: [
      { name: 'A small tree', input: '4 nodes: 0-1, 0-2, 1-3', expected: '0: 1 2\n1: 0 3\n2: 0\n3: 1' },
      { name: 'No edges', input: '2 nodes, no edges', expected: '0:\n1:' },
      { name: 'A triangle', input: '3 nodes: 2-0, 1-2, 0-1', expected: '0: 2 1\n1: 2 0\n2: 0 1' },
    ],
  },

  // 10. BFS
  {
    id: 'c8-bfs',
    title: 'Breadth-first search',
    kind: 'implement',
    task: 'Write <code>bfsDistances</code>: for a graph given as an adjacency list, return for every node the fewest edges from <code>start</code>, or -1 if it cannot be reached.',
    introduces: [],
    teach: {
      body: [
        `<p>Breadth-first search (BFS) explores a graph in rings: first the start node, then everything one edge away, then everything two edges away, and so on. That is exactly what you need for the <em>fewest edges</em> between two nodes. A <code>queue</code> makes it work: take a node from the front, look at its neighbours, and put the unseen ones at the back. Because the queue is first in, first out, closer nodes are always handled before farther ones.</p>`,
        `<p>Keep a <code>dist</code> vector with one slot per node, all -1 ("not reached yet") except <code>dist[start] = 0</code>. When you meet a neighbour with <code>dist[nb] == -1</code>, set it to <code>dist[node] + 1</code> and push it. The -1 also acts as the "visited" mark, so no node is queued twice. BFS visits each node and edge once: O(nodes + edges).</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    vector<vector<int>> adj = {{1}, {0, 2}, {1}};   // a path 0 - 1 - 2\n    vector<int> dist(adj.size(), -1);                 // -1: not reached yet\n    queue<int> q;\n    dist[0] = 0;\n    q.push(0);\n    while (!q.empty()) {\n        int node = q.front();                         // the oldest waiting node\n        q.pop();\n        for (int nb : adj[node]) {\n            if (dist[nb] == -1) {                     // first time we reach nb\n                dist[nb] = dist[node] + 1;\n                q.push(nb);\n            }\n        }\n    }\n    cout << dist[0] << dist[1] << dist[2] << endl;    // 012\n    return 0;\n}',
          output: '012',
          caption: 'A queue of nodes still to explore; -1 marks the unseen.',
        },
      ],
      terms: [
        { code: 'queue<int> q', meaning: 'nodes waiting to be explored, oldest first' },
        { code: 'dist[nb] == -1', meaning: 'nb has not been reached yet' },
        { code: 'dist[nb] = dist[node] + 1', meaning: 'one more edge than the node we came from' },
      ],
    },
    refresher: [
      'BFS: push the start, then while the queue is not empty take the front, and for each unseen neighbour set its distance and push it.',
      'A node is unseen while <code>dist[nb] == -1</code>. <code>q.front()</code> then <code>q.pop()</code> takes the next node.',
    ],
    hints: [
      'Create <code>vector&lt;int&gt; dist(adj.size(), -1);</code>, set <code>dist[start] = 0</code> and push <code>start</code>.',
      'Inside the loop, for each neighbour with <code>dist[nb] == -1</code>, set <code>dist[nb] = dist[node] + 1</code> and push it. Return <code>dist</code>.',
    ],
    inPython: {
      code: 'from collections import deque\ndef bfs(adj, start):\n    dist = [-1] * len(adj)\n    dist[start] = 0\n    q = deque([start])\n    while q:\n        node = q.popleft()\n        for nb in adj[node]:\n            if dist[nb] == -1:\n                dist[nb] = dist[node] + 1\n                q.append(nb)\n    return dist\n\nprint(bfs([[1], [0, 2], [1]], 0))',
      note: 'Python uses a <code>deque</code> as the queue. C++ has <code>queue</code> with <code>front</code>, <code>pop</code> and <code>push</code>.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\n// dist[v] = fewest edges from start to v, or -1 if unreachable.\nvector<int> bfsDistances(const vector<vector<int>>& adj, int start) {\n    vector<int> dist(adj.size(), -1);\n    return dist;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\n// dist[v] = fewest edges from start to v, or -1 if unreachable.\nvector<int> bfsDistances(const vector<vector<int>>& adj, int start) {\n    vector<int> dist(adj.size(), -1);\n    queue<int> q;\n    dist[start] = 0;\n    q.push(start);\n    while (!q.empty()) {\n        int node = q.front();\n        q.pop();\n        for (int nb : adj[node]) {\n            if (dist[nb] == -1) {\n                dist[nb] = dist[node] + 1;\n                q.push(nb);\n            }\n        }\n    }\n    return dist;\n}',
    harness: h([
      'vector<vector<int>> adj = {{1, 2}, {0, 3}, {0, 3}, {1, 2}, {}};\nharness_show(bfsDistances(adj, 0));',
      'vector<vector<int>> adj = {{1}, {0, 2}, {1, 3}, {2}};\nharness_show(bfsDistances(adj, 3));',
      'vector<vector<int>> adj = {{}};\nharness_show(bfsDistances(adj, 0));',
      'vector<vector<int>> adj = {{1}, {0, 2}, {1}, {4}, {3}};\nharness_show(bfsDistances(adj, 1));',
    ], `void harness_show(const vector<int>& d) {
    for (size_t i = 0; i < d.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << d[i];
    }
    cout << endl;
}

`),
    require: [{ pattern: 'queue\\s*<', message: 'Use a queue' }],
    tests: [
      { name: 'A square plus an island', input: 'start 0', expected: '0 1 1 2 -1' },
      { name: 'A path, from the far end', input: 'start 3', expected: '3 2 1 0' },
      { name: 'One node', input: 'start 0', expected: '0' },
      { name: 'Two components', input: 'start 1', expected: '1 0 1 -1 -1' },
    ],
  },

  // 11. DFS
  {
    id: 'c8-dfs',
    title: 'Depth-first search',
    kind: 'implement',
    task: 'Write <code>dfs</code>: visit every node reachable from <code>node</code> by recursion, going as deep as possible first. Mark nodes in <code>visited</code> and add each node to <code>order</code> the first time you reach it.',
    introduces: [],
    teach: {
      body: [
        `<p>Depth-first search (DFS) explores a graph like a maze: follow one path as far as it goes, and only when you hit a dead end back up and try the next branch. Recursion does this naturally, because the function calls themselves remember where you came from. The recipe: mark this node visited, record it, then for every neighbour that has not been visited, call <code>dfs</code> on it.</p>`,
        `<p>The <code>visited</code> vector is what stops it going round in circles forever. It is passed by reference (<code>vector&lt;bool&gt;&amp;</code>) so every call shares the same marks, as does <code>order</code>. Like BFS it takes O(nodes + edges). It is the right tool for "is it connected", "count the groups" and anything that explores everything. Very deep graphs can overflow the call stack, which is one reason a BFS with a queue is sometimes used instead.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid walk(const vector<vector<int>>& adj, int node, vector<bool>& seen) {\n    seen[node] = true;                 // mark it before going deeper\n    cout << node << " ";\n    for (int nb : adj[node]) {\n        if (!seen[nb]) {\n            walk(adj, nb, seen);       // go as deep as possible first\n        }\n    }\n}\n\nint main() {\n    vector<vector<int>> adj = {{1, 2}, {0}, {0}};\n    vector<bool> seen(3, false);\n    walk(adj, 0, seen);\n    cout << endl;                      // 0 1 2\n    return 0;\n}',
          output: '0 1 2',
          caption: 'Mark, record, then recurse into each unvisited neighbour.',
        },
      ],
      terms: [
        { code: 'vector<bool>& visited', meaning: 'shared marks: which nodes were already reached' },
        { code: 'dfs(adj, nb, visited, order)', meaning: 'the recursive call for an unvisited neighbour' },
      ],
    },
    refresher: [
      'DFS: mark the node, add it to <code>order</code>, then call <code>dfs</code> for each neighbour that is not yet visited.',
      '<code>visited</code> and <code>order</code> are references, so every recursive call updates the same ones.',
    ],
    hints: [
      'First two lines: <code>visited[node] = true;</code> and <code>order.push_back(node);</code>.',
      'Then <code>for (int nb : adj[node])</code> and, if <code>!visited[nb]</code>, call <code>dfs(adj, nb, visited, order);</code>.',
    ],
    inPython: {
      code: 'def dfs(adj, node, visited, order):\n    visited[node] = True\n    order.append(node)\n    for nb in adj[node]:\n        if not visited[nb]:\n            dfs(adj, nb, visited, order)',
      note: 'The same recursion. Python lists are always passed by reference; in C++ you write <code>&amp;</code> on the parameters that must be shared.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Visit everything reachable from node, depth first; record the visit order.\nvoid dfs(const vector<vector<int>>& adj, int node, vector<bool>& visited, vector<int>& order) {\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Visit everything reachable from node, depth first; record the visit order.\nvoid dfs(const vector<vector<int>>& adj, int node, vector<bool>& visited, vector<int>& order) {\n    visited[node] = true;\n    order.push_back(node);\n    for (int nb : adj[node]) {\n        if (!visited[nb]) {\n            dfs(adj, nb, visited, order);\n        }\n    }\n}',
    harness: h([
      'vector<vector<int>> adj = {{1, 2}, {0, 3}, {0, 3}, {1, 2}};\nvector<bool> visited(adj.size(), false);\nvector<int> order;\ndfs(adj, 0, visited, order);\nharness_show(order);',
      'vector<vector<int>> adj = {{1, 2}, {3}, {}, {}};\nvector<bool> visited(adj.size(), false);\nvector<int> order;\ndfs(adj, 0, visited, order);\nharness_show(order);',
      'vector<vector<int>> adj = {{1}, {0}, {3}, {2}};\nvector<bool> visited(adj.size(), false);\nvector<int> order;\ndfs(adj, 0, visited, order);\nharness_show(order);',
    ], `void harness_show(const vector<int>& d) {
    for (size_t i = 0; i < d.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << d[i];
    }
    cout << endl;
}

`),
    tests: [
      { name: 'A square', input: '0:{1,2} 1:{0,3} 2:{0,3} 3:{1,2}', expected: '0 1 3 2' },
      { name: 'A tree', input: '0:{1,2} 1:{3}', expected: '0 1 3 2' },
      { name: 'Two components', input: 'start 0', expected: '0 1' },
    ],
  },

  // 12. grid BFS
  {
    id: 'c8-grid-bfs',
    title: 'BFS on a grid',
    kind: 'implement',
    task: 'Write <code>shortestPath</code>: a grid of <code>.</code> (open) and <code>#</code> (wall). Return the fewest moves (up, down, left, right) from the top-left to the bottom-right cell, or -1 if there is no path.',
    introduces: [],
    teach: {
      body: [
        `<p>A grid is a graph in disguise: each open cell is a node, joined to its up, down, left and right neighbours. You do not build an adjacency list; you compute the neighbours on the spot. The trick is two small arrays of steps: <code>int dr[4] = {1, -1, 0, 0};</code> for the row change and <code>int dc[4] = {0, 0, 1, -1};</code> for the column change. Loop <code>d</code> from 0 to 3 and the neighbour of <code>(r, c)</code> is <code>(r + dr[d], c + dc[d])</code>.</p>`,
        `<p>Check each neighbour is inside the grid (<code>0 &lt;= nr &lt; rows</code>, and the same for the column) <em>before</em> reading it, since an out-of-range index is undefined behaviour. Everything else is the BFS you already know, with a <code>queue&lt;pair&lt;int, int&gt;&gt;</code> of cells and a <code>vector&lt;vector&lt;int&gt;&gt;</code> of distances starting at -1.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int dr[4] = {1, -1, 0, 0};     // row steps: down, up, none, none\n    int dc[4] = {0, 0, 1, -1};     // column steps: none, none, right, left\n    int rows = 3;\n    int cols = 3;\n    int r = 0;\n    int c = 0;\n    for (int d = 0; d < 4; d++) {\n        int nr = r + dr[d];\n        int nc = c + dc[d];\n        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {\n            continue;              // outside the grid: skip before reading\n        }\n        cout << nr << "," << nc << " ";\n    }\n    cout << endl;                  // 1,0 0,1\n    return 0;\n}',
          output: '1,0 0,1',
          caption: 'The in-grid neighbours of the top-left corner.',
        },
      ],
      terms: [
        { code: 'dr[d], dc[d]', meaning: 'the row and column step for direction d' },
        { code: 'nr < 0 || nr >= rows', meaning: 'check the new row is inside the grid before using it' },
      ],
    },
    refresher: [
      'Neighbours: <code>nr = r + dr[d]</code>, <code>nc = c + dc[d]</code>. Skip out-of-range cells and <code>#</code> walls.',
      'BFS with a queue of <code>pair&lt;int, int&gt;</code>; <code>dist[nr][nc] == -1</code> means unvisited.',
    ],
    hints: [
      'If the start or the goal is a wall, return -1. Otherwise set <code>dist[0][0] = 0</code> and push <code>(0, 0)</code>.',
      'For each popped cell try the four neighbours: in range, not <code>#</code>, and <code>dist == -1</code>. Return the goal\'s distance at the end.',
    ],
    inPython: {
      code: 'from collections import deque\ngrid = ["..", "#."]\nrows, cols = len(grid), len(grid[0])\ndist = {(0, 0): 0}\nq = deque([(0, 0)])\nwhile q:\n    r, c = q.popleft()\n    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n        nr, nc = r + dr, c + dc\n        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "." and (nr, nc) not in dist:\n            dist[(nr, nc)] = dist[(r, c)] + 1\n            q.append((nr, nc))\nprint(dist.get((rows - 1, cols - 1), -1))',
      note: 'The same BFS. Python can test <code>0 &lt;= nr &lt; rows</code> in one chain; C++ needs the four comparisons spelled out.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n#include <utility>\nusing namespace std;\n\n// Fewest moves from the top-left to the bottom-right cell, or -1.\nint shortestPath(const vector<string>& grid) {\n    return -1;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <string>\n#include <queue>\n#include <utility>\nusing namespace std;\n\n// Fewest moves from the top-left to the bottom-right cell, or -1.\nint shortestPath(const vector<string>& grid) {\n    int rows = static_cast<int>(grid.size());\n    int cols = static_cast<int>(grid[0].size());\n    if (grid[0][0] == \'#\' || grid[rows - 1][cols - 1] == \'#\') {\n        return -1;\n    }\n    vector<vector<int>> dist(rows, vector<int>(cols, -1));\n    queue<pair<int, int>> q;\n    dist[0][0] = 0;\n    q.push(make_pair(0, 0));\n    int dr[4] = {1, -1, 0, 0};\n    int dc[4] = {0, 0, 1, -1};\n    while (!q.empty()) {\n        pair<int, int> cur = q.front();\n        q.pop();\n        for (int d = 0; d < 4; d++) {\n            int nr = cur.first + dr[d];\n            int nc = cur.second + dc[d];\n            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {\n                continue;\n            }\n            if (grid[nr][nc] == \'#\' || dist[nr][nc] != -1) {\n                continue;\n            }\n            dist[nr][nc] = dist[cur.first][cur.second] + 1;\n            q.push(make_pair(nr, nc));\n        }\n    }\n    return dist[rows - 1][cols - 1];\n}',
    harness: h([
      'cout << shortestPath(vector<string>{"...", ".#.", "..."}) << endl;',
      'cout << shortestPath(vector<string>{".#.", "###", "..."}) << endl;',
      'cout << shortestPath(vector<string>{"."}) << " " << shortestPath(vector<string>{"#."}) << endl;',
      'cout << shortestPath(vector<string>{"..#.", "#...", "...#", ".#.."}) << endl;',
    ]),
    require: [{ pattern: 'queue\\s*<', message: 'Use a queue' }],
    tests: [
      { name: 'Around a wall', input: '...|.#.|...', expected: '4' },
      { name: 'Blocked', input: '.#.|###|...', expected: '-1' },
      { name: 'One cell, then a wall start', input: '"." and "#."', expected: '0 -1' },
      { name: 'A winding path', input: '..#.|#...|...#|.#..', expected: '6' },
    ],
  },

  // 13. subsets / backtracking
  {
    id: 'c8-subsets',
    title: 'Backtracking: all subsets',
    kind: 'implement',
    task: 'Write <code>subsets</code>: return every subset of the numbers (including the empty one), each as a vector with the numbers in their original order. The order of the subsets does not matter.',
    introduces: [],
    teach: {
      body: [
        `<p><em>Backtracking</em> builds an answer one choice at a time, tries each option, and undoes the choice to try the next. For subsets, go through the numbers one by one and, for each, make two choices: leave it out, or put it in. A recursive function <code>build(index, current, result)</code> handles number number <code>index</code>: when <code>index</code> reaches the end, <code>current</code> is a finished subset, so copy it into <code>result</code>. Otherwise first recurse without the number, then do <code>current.push_back(nums[index])</code>, recurse again, and finally <code>current.pop_back()</code> to undo it.</p>`,
        `<p>That last <code>pop_back</code> is the "back" in backtracking: the same <code>current</code> vector is reused for every branch, so each choice must be undone before returning. There are 2ⁿ subsets, so this is O(2ⁿ); it is fine for small n. <code>current</code> and <code>result</code> are passed by reference so all the calls share them.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid build(const vector<int>& nums, int index, vector<int>& current, int& count) {\n    if (index == static_cast<int>(nums.size())) {\n        count++;                          // one finished choice sequence = one subset\n        return;\n    }\n    build(nums, index + 1, current, count);   // choice 1: leave nums[index] out\n    current.push_back(nums[index]);           // choice 2: put it in ...\n    build(nums, index + 1, current, count);\n    current.pop_back();                       // ... and undo it (backtrack)\n}\n\nint main() {\n    vector<int> nums = {1, 2, 3};\n    vector<int> current;\n    int count = 0;\n    build(nums, 0, current, count);\n    cout << count << endl;                    // 8 subsets: 2 * 2 * 2\n    return 0;\n}',
          output: '8',
          caption: 'Two choices per number: 2 to the power n subsets.',
        },
      ],
      terms: [
        { code: 'push_back, recurse, pop_back', meaning: 'choose, explore, then undo the choice' },
        { code: 'index == nums.size()', meaning: 'every number has been decided: a subset is complete' },
      ],
    },
    refresher: [
      'For each number: recurse without it, then <code>push_back</code> it, recurse, and <code>pop_back</code> to undo. At the end, copy <code>current</code> into the result.',
      'A helper function with reference parameters shares <code>current</code> and <code>result</code> across all calls.',
    ],
    hints: [
      'Write a helper <code>void build(const vector&lt;int&gt;&amp; nums, int index, vector&lt;int&gt;&amp; current, vector&lt;vector&lt;int&gt;&gt;&amp; result)</code>.',
      'Base case: <code>index == nums.size()</code> means <code>result.push_back(current);</code> and return. Then the two recursive branches. Call it from <code>subsets</code> with index 0.',
    ],
    inPython: {
      code: 'def subsets(nums):\n    result = []\n    def build(i, current):\n        if i == len(nums):\n            result.append(current[:])\n            return\n        build(i + 1, current)\n        current.append(nums[i])\n        build(i + 1, current)\n        current.pop()\n    build(0, [])\n    return result',
      note: 'Python copies with <code>current[:]</code> when saving. In C++ <code>result.push_back(current)</code> already copies the vector.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// All subsets of nums, each in the original order.\nvector<vector<int>> subsets(const vector<int>& nums) {\n    vector<vector<int>> result;\n    return result;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid build(const vector<int>& nums, int index, vector<int>& current, vector<vector<int>>& result) {\n    if (index == static_cast<int>(nums.size())) {\n        result.push_back(current);\n        return;\n    }\n    build(nums, index + 1, current, result);\n    current.push_back(nums[index]);\n    build(nums, index + 1, current, result);\n    current.pop_back();\n}\n\n// All subsets of nums, each in the original order.\nvector<vector<int>> subsets(const vector<int>& nums) {\n    vector<vector<int>> result;\n    vector<int> current;\n    build(nums, 0, current, result);\n    return result;\n}',
    harness: h([
      'harness_show(subsets(vector<int>{1, 2, 3}));',
      'harness_show(subsets(vector<int>{5}));',
      'harness_show(subsets(vector<int>{}));',
      'harness_show(subsets(vector<int>{4, 7}));',
    ], `void harness_show(vector<vector<int>> r) {
    sort(r.begin(), r.end());
    for (const vector<int>& s : r) {
        cout << "[";
        for (size_t i = 0; i < s.size(); i++) {
            if (i > 0) {
                cout << ",";
            }
            cout << s[i];
        }
        cout << "]" << endl;
    }
}

`),
    tests: [
      { name: 'Three numbers', input: '{1, 2, 3}', expected: '[]\n[1]\n[1,2]\n[1,2,3]\n[1,3]\n[2]\n[2,3]\n[3]' },
      { name: 'One number', input: '{5}', expected: '[]\n[5]' },
      { name: 'No numbers', input: '{}', expected: '[]' },
      { name: 'Two numbers', input: '{4, 7}', expected: '[]\n[4]\n[4,7]\n[7]' },
    ],
  },

  // 14. prefix sums
  {
    id: 'c8-prefix-sums',
    title: 'Prefix sums',
    kind: 'implement',
    task: 'Write <code>buildPrefix</code> (a vector of <code>n + 1</code> long long values where <code>prefix[i]</code> is the sum of the first <code>i</code> numbers) and <code>rangeSum</code> (the sum of the numbers at positions <code>l</code> up to but not including <code>r</code>).',
    introduces: [],
    teach: {
      body: [
        `<p>Suppose you must answer many questions of the form "what is the sum of the items from position <code>l</code> to <code>r</code>?" Adding them up each time is O(n) per question. A <em>prefix sum</em> array pays the cost once: <code>prefix[i]</code> holds the sum of the first <code>i</code> items, with <code>prefix[0] = 0</code>. Then any range sum is one subtraction: the sum of positions <code>l</code> to <code>r - 1</code> is <code>prefix[r] - prefix[l]</code>. Building it is one O(n) pass, and every question afterwards is O(1).</p>`,
        `<p>The totals can be much bigger than the items, so the prefix array holds <code>long long</code> values: adding ints into an <code>int</code> total can overflow, which is undefined behaviour. Adding an <code>int</code> to a <code>long long</code> is safe, because the int is first widened.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {3, 1, 4, 1, 5};\n    vector<long long> prefix(v.size() + 1, 0);        // prefix[0] = 0\n    for (size_t i = 0; i < v.size(); i++) {\n        prefix[i + 1] = prefix[i] + v[i];            // sum of the first i + 1 items\n    }\n    cout << prefix[5] << endl;                        // 14: everything\n    cout << prefix[4] - prefix[1] << endl;            // 6: positions 1, 2 and 3 (1 + 4 + 1)\n    return 0;\n}',
          output: '14\n6',
          caption: 'One pass to build, one subtraction to ask.',
        },
      ],
      terms: [
        { code: 'prefix[i + 1] = prefix[i] + v[i]', meaning: 'each prefix adds one more item' },
        { code: 'prefix[r] - prefix[l]', meaning: 'the sum of positions l up to r - 1' },
      ],
    },
    refresher: [
      '<code>prefix[0] = 0</code> and <code>prefix[i + 1] = prefix[i] + v[i]</code>. The vector has <code>n + 1</code> slots.',
      'The sum of positions <code>l</code> to <code>r - 1</code> is <code>prefix[r] - prefix[l]</code>.',
    ],
    hints: [
      'Make <code>vector&lt;long long&gt; prefix(v.size() + 1, 0);</code> and fill it in a loop over the items.',
      '<code>rangeSum</code> is one line: <code>return prefix[r] - prefix[l];</code>.',
    ],
    inPython: {
      code: 'from itertools import accumulate\nv = [3, 1, 4, 1, 5]\nprefix = [0] + list(accumulate(v))\nprint(prefix[4] - prefix[1])',
      note: 'Python has <code>accumulate</code> in <code>itertools</code> for this. In C++ a short loop builds the same array.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// prefix[i] = sum of the first i numbers; the vector has n + 1 entries.\nvector<long long> buildPrefix(const vector<int>& v) {\n    return vector<long long>(v.size() + 1, 0);\n}\n\n// Sum of the numbers at positions l, l + 1, ..., r - 1.\nlong long rangeSum(const vector<long long>& prefix, int l, int r) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// prefix[i] = sum of the first i numbers; the vector has n + 1 entries.\nvector<long long> buildPrefix(const vector<int>& v) {\n    vector<long long> prefix(v.size() + 1, 0);\n    for (size_t i = 0; i < v.size(); i++) {\n        prefix[i + 1] = prefix[i] + v[i];\n    }\n    return prefix;\n}\n\n// Sum of the numbers at positions l, l + 1, ..., r - 1.\nlong long rangeSum(const vector<long long>& prefix, int l, int r) {\n    return prefix[r] - prefix[l];\n}',
    harness: h([
      'vector<long long> p = buildPrefix(vector<int>{3, 1, 4, 1, 5});\ncout << rangeSum(p, 0, 5) << " " << rangeSum(p, 1, 4) << " " << rangeSum(p, 2, 2) << endl;',
      'vector<long long> p = buildPrefix(vector<int>{2, 2});\ncout << p.size() << " " << p[0] << " " << p[2] << endl;',
      'vector<long long> p = buildPrefix(vector<int>{2000000000, 2000000000, 2000000000});\ncout << rangeSum(p, 0, 3) << endl;',
    ]),
    tests: [
      { name: 'Several ranges', input: '{3, 1, 4, 1, 5}', expected: '14 6 0' },
      { name: 'Shape of the array', input: '{2, 2}', expected: '3 0 4' },
      { name: 'Big totals need long long', input: '{2e9, 2e9, 2e9}', expected: '6000000000' },
    ],
  },

  // 15. two pointers
  {
    id: 'c8-two-pointers',
    title: 'Two pointers',
    kind: 'implement',
    task: 'Write <code>hasPairWithSum</code>: for a <em>sorted</em> vector, return true if two different positions hold values that add up to <code>target</code>. It must run in O(n).',
    introduces: [],
    teach: {
      body: [
        `<p>The two-pointer technique uses two indexes that walk through the data instead of nested loops. On a sorted vector, put <code>lo</code> at the first item and <code>hi</code> at the last. Add the two values. If the sum is too small, the only way to grow it is to move <code>lo</code> right to a bigger value. If it is too big, move <code>hi</code> left. If it matches, you are done. Each step discards one item for good, so the loop ends after at most n steps: O(n) instead of the O(n²) of trying every pair.</p>`,
        `<p>Stop when the two meet: <code>while (lo &lt; hi)</code>, so you never add an item to itself. Keep the indexes as <code>int</code> so that <code>hi</code> can start at <code>size - 1</code> even when the vector is empty (-1).</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 3, 6, 8};\n    int target = 9;\n    int lo = 0;\n    int hi = static_cast<int>(v.size()) - 1;\n    bool found = false;\n    while (lo < hi) {\n        int sum = v[lo] + v[hi];\n        if (sum == target) {\n            found = true;\n            break;\n        } else if (sum < target) {\n            lo++;                  // too small: use a bigger left value\n        } else {\n            hi--;                  // too big: use a smaller right value\n        }\n    }\n    cout << found << endl;         // 1: 1 + 8\n    return 0;\n}',
          output: '1',
          caption: 'The two ends move toward each other.',
        },
      ],
      terms: [
        { code: 'lo, hi', meaning: 'two indexes that move toward each other' },
        { code: 'while (lo < hi)', meaning: 'stops when they meet, so no item pairs with itself' },
      ],
    },
    refresher: [
      'Sorted data: sum too small, <code>lo++</code>; sum too big, <code>hi--</code>; equal, found. Loop while <code>lo &lt; hi</code>.',
      'Use <code>int</code> indexes: <code>hi = static_cast&lt;int&gt;(v.size()) - 1</code>.',
    ],
    hints: [
      'Set <code>lo = 0</code> and <code>hi</code> to the last index. In the loop, compute <code>v[lo] + v[hi]</code>.',
      'Return true on a match. Compare the sum with <code>target</code> to decide which index moves. Return false after the loop.',
    ],
    inPython: {
      code: 'def has_pair(v, target):\n    lo, hi = 0, len(v) - 1\n    while lo < hi:\n        s = v[lo] + v[hi]\n        if s == target:\n            return True\n        if s < target:\n            lo += 1\n        else:\n            hi -= 1\n    return False\n\nprint(has_pair([1, 3, 6, 8], 9))',
      note: 'The same loop in both languages. Only the types and braces differ.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// True if two different positions of the sorted vector add up to target.\nbool hasPairWithSum(const vector<int>& v, int target) {\n    return false;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// True if two different positions of the sorted vector add up to target.\nbool hasPairWithSum(const vector<int>& v, int target) {\n    int lo = 0;\n    int hi = static_cast<int>(v.size()) - 1;\n    while (lo < hi) {\n        int sum = v[lo] + v[hi];\n        if (sum == target) {\n            return true;\n        }\n        if (sum < target) {\n            lo++;\n        } else {\n            hi--;\n        }\n    }\n    return false;\n}',
    harness: h([
      'cout << hasPairWithSum(vector<int>{1, 2, 4, 7, 11}, 9) << endl;',
      'cout << hasPairWithSum(vector<int>{1, 2, 3}, 10) << endl;',
      'cout << hasPairWithSum(vector<int>{5}, 10) << hasPairWithSum(vector<int>{}, 0) << endl;',
      'cout << hasPairWithSum(vector<int>{3, 3}, 6) << hasPairWithSum(vector<int>{-4, 0, 9}, 5) << endl;',
    ]),
    tests: [
      { name: 'Two and seven', input: '{1,2,4,7,11}, 9', expected: '1' },
      { name: 'No pair', input: '{1,2,3}, 10', expected: '0' },
      { name: 'A single item cannot pair with itself', input: '{5}, 10 and {}, 0', expected: '00' },
      { name: 'Equal values, negatives', input: '{3,3}, 6 and {-4,0,9}, 5', expected: '11' },
    ],
  },

  // 16. sliding window
  {
    id: 'c8-sliding-window',
    title: 'Sliding window',
    kind: 'implement',
    task: 'Write <code>maxWindowSum</code>: return the largest sum of any <code>k</code> neighbouring values in the vector (<code>k</code> is at least 1 and at most the size). Slide the window, do not re-add it each time.',
    introduces: [],
    teach: {
      body: [
        `<p>A <em>sliding window</em> is a block of <code>k</code> neighbouring items that moves along the data one step at a time. Adding up <code>k</code> items for every position costs O(n·k). But moving the window one step to the right only changes two items: the new item on the right enters, and the old item on the left leaves. So update the running sum with <code>sum += v[i] - v[i - k];</code> and the whole scan is O(n).</p>`,
        `<p>Compute the sum of the first window directly, then slide from <code>i = k</code> to the end, keeping the best sum seen. <code>max(a, b)</code> from <code>&lt;algorithm&gt;</code> picks the larger of two values. The same idea (add the entering item, remove the leaving one) works for counts, averages and "longest stretch with a property".</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {2, 1, 5, 1, 3};\n    int k = 2;\n    int sum = 0;\n    for (int i = 0; i < k; i++) {\n        sum += v[i];                     // the first window: 2 + 1\n    }\n    int best = sum;\n    for (int i = k; i < static_cast<int>(v.size()); i++) {\n        sum += v[i] - v[i - k];          // one in on the right, one out on the left\n        best = max(best, sum);\n    }\n    cout << best << endl;                // 6: the window 5 + 1\n    return 0;\n}',
          output: '6',
          caption: 'Each slide changes the sum by two items.',
        },
      ],
      terms: [
        { code: 'sum += v[i] - v[i - k]', meaning: 'slide the window: add the entering item, drop the leaving one' },
        { code: 'best = max(best, sum)', meaning: 'keep the largest window sum so far' },
      ],
    },
    refresher: [
      'Add the first <code>k</code> values for the first window. Then for each <code>i</code> from <code>k</code>: <code>sum += v[i] - v[i - k];</code> and update the best.',
      '<code>max(a, b)</code> returns the larger of two values.',
    ],
    hints: [
      'First loop: add <code>v[0]</code> to <code>v[k - 1]</code> into <code>sum</code>, and set <code>best = sum</code>.',
      'Second loop from <code>i = k</code>: <code>sum += v[i] - v[i - k];</code> then <code>best = max(best, sum);</code>.',
    ],
    inPython: {
      code: 'v, k = [2, 1, 5, 1, 3], 2\nsum_ = sum(v[:k])\nbest = sum_\nfor i in range(k, len(v)):\n    sum_ += v[i] - v[i - k]\n    best = max(best, sum_)\nprint(best)',
      note: 'The same update. The C++ loop needs <code>int</code> indexes compared with <code>v.size()</code> converted by a cast.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Largest sum of any k neighbouring values (1 <= k <= v.size()).\nint maxWindowSum(const vector<int>& v, int k) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Largest sum of any k neighbouring values (1 <= k <= v.size()).\nint maxWindowSum(const vector<int>& v, int k) {\n    int sum = 0;\n    for (int i = 0; i < k; i++) {\n        sum += v[i];\n    }\n    int best = sum;\n    for (int i = k; i < static_cast<int>(v.size()); i++) {\n        sum += v[i] - v[i - k];\n        best = max(best, sum);\n    }\n    return best;\n}',
    harness: h([
      'cout << maxWindowSum(vector<int>{1, 4, 2, 10, 2, 3, 1, 0, 20}, 4) << endl;',
      'cout << maxWindowSum(vector<int>{5}, 1) << endl;',
      'cout << maxWindowSum(vector<int>{-1, -2, -3}, 2) << endl;',
      'cout << maxWindowSum(vector<int>{2, 1, 5, 1, 3}, 5) << endl;',
    ]),
    tests: [
      { name: 'A window of four', input: '{1,4,2,10,2,3,1,0,20}, k = 4', expected: '24' },
      { name: 'One item', input: '{5}, k = 1', expected: '5' },
      { name: 'All negative', input: '{-1,-2,-3}, k = 2', expected: '-3' },
      { name: 'Window is the whole vector', input: '{2,1,5,1,3}, k = 5', expected: '12' },
    ],
  },

  // 17. climbing stairs
  {
    id: 'c8-climbing-stairs',
    title: 'DP: climbing stairs',
    kind: 'implement',
    task: 'Write <code>climbStairs</code>: you climb <code>n</code> stairs taking 1 or 2 steps at a time. Return how many different ways there are to reach the top (<code>n</code> is at least 1).',
    introduces: [],
    teach: {
      body: [
        `<p><em>Dynamic programming</em> (DP) solves a big problem by solving smaller versions of it first and remembering the answers, so nothing is solved twice. Take the stairs. To stand on step <code>i</code>, your last move was either from step <code>i - 1</code> (a 1-step) or from step <code>i - 2</code> (a 2-step). So the number of ways to reach step <code>i</code> is the ways to reach <code>i - 1</code> plus the ways to reach <code>i - 2</code>. That is the Fibonacci pattern.</p>`,
        `<p>Store the answers in a table, a vector <code>ways</code>: <code>ways[i]</code> is the number of ways to reach step <code>i</code>. Fill the base cases (<code>ways[1] = 1</code>, <code>ways[2] = 2</code>), then fill upward with <code>ways[i] = ways[i - 1] + ways[i - 2]</code>. It takes O(n) time. The plain recursion without the table repeats the same work and takes exponential time. In Python you could add <code>@lru_cache</code>; in C++ you fill the table yourself.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n = 4;\n    vector<int> ways(n + 1, 0);\n    ways[1] = 1;                       // one way to reach step 1\n    ways[2] = 2;                       // 1+1 or 2\n    for (int i = 3; i <= n; i++) {\n        ways[i] = ways[i - 1] + ways[i - 2];   // arrive from one step or two steps below\n    }\n    cout << ways[n] << endl;           // 5: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2\n    return 0;\n}',
          output: '5',
          caption: 'A table of answers for the smaller problems.',
        },
      ],
      terms: [
        { code: 'ways[i]', meaning: 'the answer for the smaller problem "reach step i"' },
        { code: 'ways[i] = ways[i - 1] + ways[i - 2]', meaning: 'build a bigger answer from smaller saved ones' },
      ],
    },
    refresher: [
      'DP: a table where <code>ways[i]</code> is the answer for size i. Base cases first, then each entry from earlier entries.',
      '<code>ways[i] = ways[i - 1] + ways[i - 2]</code>. Mind the table size <code>n + 1</code> and the base cases for n = 1 and 2.',
    ],
    hints: [
      'If <code>n</code> is 1 or 2, return <code>n</code> straight away. Otherwise make <code>vector&lt;int&gt; ways(n + 1, 0);</code>.',
      'Set <code>ways[1] = 1; ways[2] = 2;</code> and loop <code>i</code> from 3 to <code>n</code>.',
    ],
    inPython: {
      code: 'def climb(n):\n    ways = [0] * (n + 1)\n    ways[1] = 1\n    if n >= 2:\n        ways[2] = 2\n    for i in range(3, n + 1):\n        ways[i] = ways[i - 1] + ways[i - 2]\n    return ways[n]\n\nprint(climb(4))',
      note: 'The same table. Python integers never overflow; a C++ <code>int</code> would for large n, so tests stay small.',
    },
    starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Number of ways to climb n stairs with steps of 1 or 2 (n >= 1).\nint climbStairs(int n) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Number of ways to climb n stairs with steps of 1 or 2 (n >= 1).\nint climbStairs(int n) {\n    if (n <= 2) {\n        return n;\n    }\n    vector<int> ways(n + 1, 0);\n    ways[1] = 1;\n    ways[2] = 2;\n    for (int i = 3; i <= n; i++) {\n        ways[i] = ways[i - 1] + ways[i - 2];\n    }\n    return ways[n];\n}',
    harness: h([
      'cout << climbStairs(1) << " " << climbStairs(2) << " " << climbStairs(3) << endl;',
      'cout << climbStairs(5) << endl;',
      'cout << climbStairs(10) << endl;',
      'cout << climbStairs(30) << endl;',
    ]),
    tests: [
      { name: 'Small n', input: 'n = 1, 2, 3', expected: '1 2 3' },
      { name: 'n = 5', input: 'n = 5', expected: '8' },
      { name: 'n = 10', input: 'n = 10', expected: '89' },
      { name: 'n = 30', input: 'n = 30', expected: '1346269' },
    ],
  },

  // 18. coin change
  {
    id: 'c8-coin-change',
    title: 'DP: coin change',
    kind: 'implement',
    task: 'Write <code>minCoins</code>: given coin values (each usable any number of times) and an <code>amount</code>, return the fewest coins that add up to it, or -1 if it cannot be made.',
    introduces: [],
    teach: {
      body: [
        `<p>Another table, with a "best" answer in each cell. Let <code>best[a]</code> be the fewest coins that make exactly the amount <code>a</code>. Making 0 takes 0 coins: <code>best[0] = 0</code>. For a larger <code>a</code>, try each coin <code>c</code> that is not bigger than <code>a</code>: using it leaves <code>a - c</code> to make, which already has an answer, so the candidate is <code>best[a - c] + 1</code>. Keep the smallest candidate over all the coins.</p>`,
        `<p>Fill the table upward from 1 to <code>amount</code>. To mean "cannot be made", start every cell at a big marker, such as <code>amount + 1</code> (more coins than could ever be needed, since the smallest coin is at least 1). A cell still holding the marker at the end means impossible: return -1. The work is O(amount × number of coins).</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> coins = {1, 3};\n    int amount = 4;\n    int big = amount + 1;                         // "impossible" marker\n    vector<int> best(amount + 1, big);\n    best[0] = 0;                                  // zero coins make 0\n    for (int a = 1; a <= amount; a++) {\n        for (int c : coins) {\n            if (c <= a && best[a - c] + 1 < best[a]) {\n                best[a] = best[a - c] + 1;        // use coin c, then solve the rest\n            }\n        }\n    }\n    cout << best[4] << endl;                      // 2: 1 + 3\n    return 0;\n}',
          output: '2',
          caption: 'best[a] is built from best[a - coin] for each coin.',
        },
      ],
      terms: [
        { code: 'best[a]', meaning: 'the fewest coins that make exactly a' },
        { code: 'amount + 1', meaning: 'a marker bigger than any real answer, meaning "impossible"' },
      ],
    },
    refresher: [
      '<code>best[0] = 0</code>; for each amount <code>a</code> and coin <code>c &lt;= a</code>, <code>best[a] = min(best[a], best[a - c] + 1)</code>.',
      'Start cells at <code>amount + 1</code>. If <code>best[amount]</code> still holds it at the end, return -1.',
    ],
    hints: [
      'Make <code>vector&lt;int&gt; best(amount + 1, amount + 1);</code> and set <code>best[0] = 0</code>.',
      'Two loops: amounts <code>a</code> from 1 to <code>amount</code>, and each coin. Return <code>best[amount] &gt; amount ? -1 : best[amount]</code>.',
    ],
    inPython: {
      code: 'def min_coins(coins, amount):\n    best = [amount + 1] * (amount + 1)\n    best[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                best[a] = min(best[a], best[a - c] + 1)\n    return -1 if best[amount] > amount else best[amount]\n\nprint(min_coins([1, 3], 4))',
      note: 'Almost identical. C++ uses the conditional operator in place of Python\'s <code>x if c else y</code>.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Fewest coins that make amount, or -1.\nint minCoins(const vector<int>& coins, int amount) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Fewest coins that make amount, or -1.\nint minCoins(const vector<int>& coins, int amount) {\n    vector<int> best(amount + 1, amount + 1);\n    best[0] = 0;\n    for (int a = 1; a <= amount; a++) {\n        for (int c : coins) {\n            if (c <= a) {\n                best[a] = min(best[a], best[a - c] + 1);\n            }\n        }\n    }\n    return best[amount] > amount ? -1 : best[amount];\n}',
    harness: h([
      'cout << minCoins(vector<int>{1, 2, 5}, 11) << endl;',
      'cout << minCoins(vector<int>{2}, 3) << endl;',
      'cout << minCoins(vector<int>{1}, 0) << endl;',
      'cout << minCoins(vector<int>{2, 3}, 7) << " " << minCoins(vector<int>{1, 3, 4}, 6) << endl;',
    ]),
    tests: [
      { name: '5 + 5 + 1', input: '{1, 2, 5}, 11', expected: '3' },
      { name: 'Impossible', input: '{2}, 3', expected: '-1' },
      { name: 'Zero amount', input: '{1}, 0', expected: '0' },
      { name: 'Greedy fails here', input: '{2,3}, 7 and {1,3,4}, 6', expected: '3 2' },
    ],
  },

  // 19. LIS
  {
    id: 'c8-lis',
    title: 'DP: longest increasing subsequence',
    kind: 'implement',
    task: 'Write <code>lengthOfLIS</code>: return the length of the longest strictly increasing subsequence (items need not be neighbours, but keep their order). An O(n²) solution is expected.',
    introduces: [],
    teach: {
      body: [
        `<p>A <em>subsequence</em> keeps the original order but may skip items: in <code>{10, 9, 2, 5, 3, 7}</code> the items 2, 5, 7 form an increasing subsequence of length 3. Let <code>len[i]</code> be the length of the longest increasing subsequence that <em>ends</em> at position <code>i</code>. It is at least 1 (the item alone). To extend an earlier subsequence, look at every <code>j &lt; i</code> with <code>v[j] &lt; v[i]</code>: the subsequence ending at <code>j</code> can grow by one, giving <code>len[j] + 1</code>. Keep the largest of those.</p>`,
        `<p>The answer is the maximum over all <code>len[i]</code>, since the best subsequence may end anywhere. Two nested loops make it O(n²). (A cleverer method with binary search reaches O(n log n); you will meet it in Revise.) Start the table at 1 for every position and return 0 for an empty vector.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> v = {3, 1, 4, 5};\n    vector<int> len(v.size(), 1);               // each item alone is length 1\n    int best = 0;\n    for (size_t i = 0; i < v.size(); i++) {\n        for (size_t j = 0; j < i; j++) {\n            if (v[j] < v[i]) {\n                len[i] = max(len[i], len[j] + 1);   // extend the run ending at j\n            }\n        }\n        best = max(best, len[i]);\n    }\n    cout << best << endl;                       // 3: 3, 4, 5 or 1, 4, 5\n    return 0;\n}',
          output: '3',
          caption: 'len[i] is the best run that ends at position i.',
        },
      ],
      terms: [
        { code: 'len[i]', meaning: 'length of the longest increasing subsequence ending at i' },
        { code: 'len[i] = max(len[i], len[j] + 1)', meaning: 'extend the best run that ends at an earlier, smaller item' },
      ],
    },
    refresher: [
      '<code>len[i]</code> starts at 1. For every <code>j &lt; i</code> with <code>v[j] &lt; v[i]</code>, <code>len[i] = max(len[i], len[j] + 1)</code>. The answer is the largest <code>len</code>.',
      'Return 0 for an empty vector.',
    ],
    hints: [
      'Create <code>vector&lt;int&gt; len(v.size(), 1);</code> and track <code>best</code> as you fill it.',
      'Two loops: <code>i</code> over every position and <code>j</code> over the positions before it. Update <code>best</code> after finishing each <code>i</code>.',
    ],
    inPython: {
      code: 'def lis(v):\n    length = [1] * len(v)\n    for i in range(len(v)):\n        for j in range(i):\n            if v[j] < v[i]:\n                length[i] = max(length[i], length[j] + 1)\n    return max(length, default=0)\n\nprint(lis([3, 1, 4, 5]))',
      note: 'The same two loops. C++ keeps a running <code>best</code> instead of Python\'s <code>max(..., default=0)</code>.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Length of the longest strictly increasing subsequence.\nint lengthOfLIS(const vector<int>& v) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Length of the longest strictly increasing subsequence.\nint lengthOfLIS(const vector<int>& v) {\n    vector<int> len(v.size(), 1);\n    int best = 0;\n    for (size_t i = 0; i < v.size(); i++) {\n        for (size_t j = 0; j < i; j++) {\n            if (v[j] < v[i]) {\n                len[i] = max(len[i], len[j] + 1);\n            }\n        }\n        best = max(best, len[i]);\n    }\n    return best;\n}',
    harness: h([
      'cout << lengthOfLIS(vector<int>{10, 9, 2, 5, 3, 7, 101, 18}) << endl;',
      'cout << lengthOfLIS(vector<int>{0, 1, 0, 3, 2, 3}) << endl;',
      'cout << lengthOfLIS(vector<int>{7, 7, 7}) << " " << lengthOfLIS(vector<int>{}) << endl;',
      'cout << lengthOfLIS(vector<int>{5, 4, 3, 2, 1}) << " " << lengthOfLIS(vector<int>{1, 2, 3, 4}) << endl;',
    ]),
    tests: [
      { name: 'Classic', input: '{10,9,2,5,3,7,101,18}', expected: '4' },
      { name: 'With repeats', input: '{0,1,0,3,2,3}', expected: '4' },
      { name: 'All equal, and empty', input: '{7,7,7} and {}', expected: '1 0' },
      { name: 'Down and up', input: '{5,4,3,2,1} and {1,2,3,4}', expected: '1 4' },
    ],
  },

  // 20. practice: islands
  {
    id: 'c8-practice-islands',
    title: 'Practice: count the islands',
    kind: 'implement',
    task: 'Write <code>countIslands</code>: a grid has <code>1</code> for land and <code>0</code> for water. Count the islands, where an island is a group of land cells joined up, down, left or right.',
    introduces: [],
    refresher: [
      'Scan every cell. When you meet unvisited land, count one island and use DFS to mark all its land cells as visited (turn them into water).',
      'A recursive helper takes the grid by reference and returns at once for cells outside the grid or not land.',
    ],
    hints: [
      'Write <code>void sink(vector&lt;string&gt;&amp; grid, int r, int c)</code>: if out of range or not <code>\'1\'</code> return; set it to <code>\'0\'</code>; call itself on the 4 neighbours.',
      'In <code>countIslands</code>, loop over all cells; on a <code>\'1\'</code> do <code>count++;</code> and <code>sink(grid, r, c);</code>. The grid is passed by value, so you may change it.',
    ],
    inPython: {
      code: 'def count_islands(grid):\n    g = [list(row) for row in grid]\n    def sink(r, c):\n        if r < 0 or c < 0 or r >= len(g) or c >= len(g[0]) or g[r][c] != "1":\n            return\n        g[r][c] = "0"\n        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            sink(r + dr, c + dc)\n    count = 0\n    for r in range(len(g)):\n        for c in range(len(g[0])):\n            if g[r][c] == "1":\n                count += 1\n                sink(r, c)\n    return count\n\nprint(count_islands(["110", "001"]))',
      note: 'Same flood fill. Python needs a mutable copy of each row; a C++ <code>string</code> is already mutable.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\n// Number of islands of \'1\' cells in the grid.\nint countIslands(vector<string> grid) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nvoid sink(vector<string>& grid, int r, int c) {\n    if (r < 0 || r >= static_cast<int>(grid.size()) || c < 0 || c >= static_cast<int>(grid[0].size())) {\n        return;\n    }\n    if (grid[r][c] != \'1\') {\n        return;\n    }\n    grid[r][c] = \'0\';\n    sink(grid, r + 1, c);\n    sink(grid, r - 1, c);\n    sink(grid, r, c + 1);\n    sink(grid, r, c - 1);\n}\n\n// Number of islands of \'1\' cells in the grid.\nint countIslands(vector<string> grid) {\n    int count = 0;\n    for (int r = 0; r < static_cast<int>(grid.size()); r++) {\n        for (int c = 0; c < static_cast<int>(grid[r].size()); c++) {\n            if (grid[r][c] == \'1\') {\n                count++;\n                sink(grid, r, c);\n            }\n        }\n    }\n    return count;\n}',
    harness: h([
      'cout << countIslands(vector<string>{"11000", "11000", "00100", "00011"}) << endl;',
      'cout << countIslands(vector<string>{"111", "010", "111"}) << endl;',
      'cout << countIslands(vector<string>{"000", "000"}) << " " << countIslands(vector<string>{}) << endl;',
      'cout << countIslands(vector<string>{"101", "010", "101"}) << endl;',
    ]),
    tests: [
      { name: 'Three islands', input: '11000|11000|00100|00011', expected: '3' },
      { name: 'One big shape', input: '111|010|111', expected: '1' },
      { name: 'No land, empty grid', input: '000|000 and empty', expected: '0 0' },
      { name: 'Diagonals do not join', input: '101|010|101', expected: '5' },
    ],
  },

  // 21. practice: longest substring without repeats
  {
    id: 'c8-practice-unique-window',
    title: 'Practice: longest unique stretch',
    kind: 'implement',
    task: 'Write <code>longestUnique</code>: return the length of the longest stretch of neighbouring characters of the string that has no repeated character.',
    introduces: [],
    refresher: [
      'Sliding window over the string with a <code>start</code> index. Remember the last position of each character in an <code>unordered_map&lt;char, int&gt;</code>.',
      'When a character was seen at or after <code>start</code>, move <code>start</code> to one past that position.',
    ],
    hints: [
      'For each index <code>i</code> with character <code>c</code>: if <code>last.count(c) == 1</code> and <code>last[c] &gt;= start</code>, set <code>start = last[c] + 1</code>.',
      'Then <code>last[c] = i;</code> and <code>best = max(best, i - start + 1);</code>.',
    ],
    inPython: {
      code: 'def longest_unique(s):\n    last, start, best = {}, 0, 0\n    for i, c in enumerate(s):\n        if c in last and last[c] >= start:\n            start = last[c] + 1\n        last[c] = i\n        best = max(best, i - start + 1)\n    return best\n\nprint(longest_unique("abcabcbb"))',
      note: 'The same window. C++ asks <code>last.count(c)</code> where Python asks <code>c in last</code>.',
    },
    starter: '#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\n// Length of the longest stretch of s with no repeated character.\nint longestUnique(const string& s) {\n    return 0;\n}',
    solution: '#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\n// Length of the longest stretch of s with no repeated character.\nint longestUnique(const string& s) {\n    unordered_map<char, int> last;\n    int start = 0;\n    int best = 0;\n    for (int i = 0; i < static_cast<int>(s.size()); i++) {\n        char c = s[i];\n        if (last.count(c) == 1 && last[c] >= start) {\n            start = last[c] + 1;\n        }\n        last[c] = i;\n        best = max(best, i - start + 1);\n    }\n    return best;\n}',
    harness: h([
      'cout << longestUnique("abcabcbb") << endl;',
      'cout << longestUnique("bbbbb") << " " << longestUnique("") << endl;',
      'cout << longestUnique("pwwkew") << endl;',
      'cout << longestUnique("abba") << " " << longestUnique("abcdef") << endl;',
    ]),
    tests: [
      { name: 'abcabcbb', input: '"abcabcbb"', expected: '3' },
      { name: 'All the same, and empty', input: '"bbbbb" and ""', expected: '1 0' },
      { name: 'pwwkew', input: '"pwwkew"', expected: '3' },
      { name: 'A repeat behind the window', input: '"abba" and "abcdef"', expected: '2 6' },
    ],
  },

  // 22. wrap-up
  {
    id: 'c8-whats-next',
    title: 'Where to go from here',
    kind: 'concept',
    task: 'A last small program that uses a window. Read <code>n</code> (at least 2) and then <code>n</code> numbers. Print the largest sum of two neighbouring numbers.',
    introduces: [],
    teach: {
      body: [
        `<p>You have now gone from <code>main</code> to pointers, classes, the STL and the core algorithm ideas, in C++ and with Python as your reference. The shape of what you practised: <em>pick the data structure that makes the key operation cheap</em> (a set for "seen before?", a queue for "closest first", a prefix array for range sums), <em>estimate the Big-O</em> before you write, and <em>reuse the patterns</em>: binary search, two pointers, sliding window, BFS and DFS, backtracking and DP.</p>`,
        `<p>This path was deliberately a first pass. For more, the drawer has two places to go. <strong>Revise</strong> (the switch under the C++ and Rust tabs) is the full DSA track: many more lessons on the same topics with harder variations, trees, heaps, tries, union-find and deeper dynamic programming. It assumes the C++ you now know. <strong>Problems</strong> is a set of interview-style problems to solve with your own code and test against hidden cases. Start with the easy ones, and when you get stuck, go back to the lesson on that pattern.</p>`,
        `<p>Habits worth keeping in C++: pass big things as <code>const &amp;</code>, check an index before using it, prefer <code>vector</code> and <code>string</code> over raw arrays and <code>new</code>, and let the compiler's messages tell you what is wrong. Enjoy the speed.</p>`,
      ],
      examples: [
        {
          code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// The shape of a typical solution: a function over a vector, called from main.\nint solve(const vector<int>& v) {\n    int best = v[0];\n    for (int x : v) {\n        best = max(best, x);\n    }\n    return best;\n}\n\nint main() {\n    cout << solve(vector<int>{3, 9, 2}) << endl;   // 9\n    return 0;\n}',
          output: '9',
          caption: 'Small functions over vectors are the unit you will write most.',
        },
      ],
      terms: [
        { code: 'Revise', meaning: 'the full DSA track, with more lessons and harder variations' },
        { code: 'Problems', meaning: 'interview-style problems to solve and test' },
      ],
    },
    compare: {
      py: { code: 'v = [3, 9, 2]\nprint(max(v[i] + v[i + 1] for i in range(len(v) - 1)))', outcome: 'Prints 12', ok: true },
      cpp: { code: 'vector<int> v = {3, 9, 2};\nint best = v[0] + v[1];\nfor (size_t i = 1; i + 1 < v.size(); i++) {\n    best = max(best, v[i] + v[i + 1]);\n}\ncout << best;', outcome: 'Prints 12 with an explicit loop', ok: true },
      text: 'Python often has a one-liner where C++ has a short loop. The loop is the same idea and runs far faster on big data.',
    },
    refresher: [
      'The two-neighbour window is a sliding window with <code>k = 2</code>: compare <code>v[i] + v[i + 1]</code> for each <code>i</code>.',
      'Read with <code>cin &gt;&gt;</code> into a vector of size <code>n</code>. Keep the best sum with <code>max</code>.',
    ],
    hints: [
      'Start <code>best</code> with the first pair, <code>v[0] + v[1]</code>.',
      'Loop <code>i</code> from 1 while <code>i + 1 &lt; n</code> and update <code>best = max(best, v[i] + v[i + 1])</code>.',
    ],
    inPython: {
      code: 'v = [3, 9, 2]\nprint(max(a + b for a, b in zip(v, v[1:])))',
      note: '<code>zip(v, v[1:])</code> pairs each item with its neighbour. In C++ you index <code>v[i]</code> and <code>v[i + 1]</code> yourself.',
    },
    starter: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // read n numbers, print the largest sum of two neighbouring numbers\n    return 0;\n}',
    solution: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) {\n        cin >> v[i];\n    }\n    int best = v[0] + v[1];\n    for (int i = 1; i + 1 < n; i++) {\n        best = max(best, v[i] + v[i + 1]);\n    }\n    cout << best << endl;\n    return 0;\n}',
    tests: [
      { name: 'Three numbers', stdin: '3\n3 9 2\n', expected: '12' },
      { name: 'Two numbers', stdin: '2\n5 -1\n', expected: '4' },
      { name: 'All negative', stdin: '4\n-5 -2 -9 -1\n', expected: '-7' },
      { name: 'Best pair at the end', stdin: '5\n1 2 3 4 10\n', expected: '14' },
    ],
  },
]
