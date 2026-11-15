// Lessons for this stage. Format: docs/superpowers/specs/2026-11-15-foundations-track-design.md

const NO_SORT = [{ pattern: '\\b(stable_)?sort\\s*\\(', message: 'Write the sort yourself: std::sort is off the table here.' }]
const NO_BOUNDS = [{ pattern: '\\b(lower_bound|upper_bound|equal_range|binary_search)\\s*\\(', message: 'Write the search yourself: the standard library versions are off the table here.' }]

// Shared harness for the sorting lessons that take a vector (and optionally lo, hi).
// `call` is the C++ statement that sorts `a`; `extra` adds more cases after test 7.
const sortHarness = (call, bigN, extra = '') => `int main() {
    int t; cin >> t;
    vector<int> a;
    if (t == 1) a = {5, 2, 9, 1};
    if (t == 2) a = {};
    if (t == 3) a = {7};
    if (t == 4) a = {3, 3, 1, 3, 1};
    if (t == 5) a = {1, 2, 3, 4, 5};
    if (t == 6) a = {9, 8, 7, 6, 5};
    if (t == 7) { unsigned x = 12345; for (int i = 0; i < ${bigN}; i++) { x = x * 1103515245u + 12345u; a.push_back((x >> 8) % 1000000); } }
${extra}    size_t count = a.size();
    long long before = 0;
    for (size_t i = 0; i < a.size(); i++) before += a[i];
    ${call}
    cout << "\\n@@RESULT@@\\n";
    if (t >= 7) {
        long long after = 0;
        bool ok = a.size() == count;
        for (size_t i = 0; i < a.size(); i++) after += a[i];
        for (size_t i = 1; i < a.size(); i++) if (a[i - 1] > a[i]) ok = false;
        if (after != before) ok = false;
        cout << (ok ? "sorted" : "not sorted");
    } else {
        for (size_t i = 0; i < a.size(); i++) cout << (i ? " " : "") << a[i];
    }
    cout << "\\n";
    return 0;
}`

const smallTests = bigLabel => [
  { name: 'Small', stdin: '1', input: '5 2 9 1', expected: '1 2 5 9' },
  { name: 'Empty', stdin: '2', input: '(empty)', expected: '' },
  { name: 'One value', stdin: '3', input: '7', expected: '7' },
  { name: 'Duplicates', stdin: '4', input: '3 3 1 3 1', expected: '1 1 3 3 3' },
  { name: 'Already sorted', stdin: '5', input: '1 2 3 4 5', expected: '1 2 3 4 5' },
  { name: 'Descending', stdin: '6', input: '9 8 7 6 5', expected: '5 6 7 8 9' },
  { name: 'Large', stdin: '7', input: bigLabel, expected: 'sorted' },
]

// Shared harness for the binary search lesson and its bugfix twin.
const SEARCH_HARNESS = `int main() {
    int t; cin >> t;
    vector<int> a = {1, 3, 5, 7, 9, 11};
    int target = 0;
    if (t == 1) target = 7;
    if (t == 2) target = 1;
    if (t == 3) target = 11;
    if (t == 4) target = 4;
    if (t == 5) target = 0;
    if (t == 6) target = 12;
    if (t == 7) { a = {}; target = 3; }
    if (t == 8) { a = {4}; target = 4; }
    if (t == 9) { a = {4}; target = 5; }
    if (t == 10) { a.clear(); for (int i = 0; i < 100000; i++) a.push_back(2 * i); }
    cout << "\\n@@RESULT@@\\n";
    if (t == 10) {
        bool ok = true;
        for (int i = 0; i < 100000; i++) {
            if (binarySearch(a, 2 * i) != i) ok = false;
            if (binarySearch(a, 2 * i + 1) != -1) ok = false;
        }
        cout << (ok ? "ok" : "wrong");
    } else {
        cout << binarySearch(a, target);
    }
    cout << "\\n";
    return 0;
}`

// Stdin and expected output for the records lesson, computed deterministically.
const recordsLarge = (() => {
  const recs = []
  for (let i = 0; i < 2000; i++) recs.push({ name: 'p' + ((i * 7919) % 1000), score: (i * 31) % 50 })
  const stdin = recs.length + '\n' + recs.map(r => r.name + ' ' + r.score).join('\n') + '\n'
  const sorted = recs.slice().sort((a, b) => (a.score !== b.score ? b.score - a.score : a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  return { stdin, expected: sorted.map(r => r.name + ' ' + r.score).join('\n') }
})()

export const LESSONS = [
  {
    id: 's2-bubble-sort',
    title: 'Bubble sort',
    kind: 'implement',
    task: 'Sort the vector in ascending order with bubble sort. <code>std::sort</code> is off the table.',
    refresher: [
      'Sweep the array and swap neighbours that are out of order. After each sweep the largest unsorted value sits at the end.',
      'If a sweep makes no swap, the array is sorted and you can stop.',
    ],
    hints: [
      'Two loops: an outer one counting sweeps, an inner one comparing <code>a[j]</code> with <code>a[j + 1]</code>.',
      'The tail is already placed, so the inner loop can stop earlier on each sweep.',
      'Track a <code>swapped</code> flag to leave early.',
    ],
    forbidden: NO_SORT,
    starter: `void bubbleSort(vector<int>& a) {

}`,
    solution: `void bubbleSort(vector<int>& a) {
    int n = a.size();
    for (int pass = 0; pass < n - 1; pass++) {
        bool swapped = false;
        for (int j = 0; j + 1 < n - pass; j++) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    harness: sortHarness('bubbleSort(a);', 2000),
    tests: smallTests('2 000 random values'),
  },
  {
    id: 's2-selection-sort',
    title: 'Selection sort',
    kind: 'implement',
    task: 'Sort the vector in ascending order with selection sort. <code>std::sort</code> is off the table.',
    refresher: [
      'For each position <code>i</code>, find the smallest value in <code>a[i..n)</code> and swap it into place.',
      'The left part grows by one finished element per round.',
    ],
    hints: [
      'Inner loop: remember the <i>index</i> of the smallest value, not the value itself.',
      'Swap once per round, after the inner loop ends.',
    ],
    forbidden: NO_SORT,
    starter: `void selectionSort(vector<int>& a) {

}`,
    solution: `void selectionSort(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i + 1 < n; i++) {
        int best = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[best]) best = j;
        }
        swap(a[i], a[best]);
    }
}`,
    harness: sortHarness('selectionSort(a);', 2000),
    tests: smallTests('2 000 random values'),
  },
  {
    id: 's2-insertion-sort',
    title: 'Insertion sort',
    kind: 'implement',
    task: 'Sort the vector in ascending order with insertion sort. <code>std::sort</code> is off the table.',
    refresher: [
      'Keep <code>a[0..i)</code> sorted. Take <code>a[i]</code>, shift larger values one step right, and drop it into the gap.',
      'Shifting is cheaper than swapping each step.',
    ],
    hints: [
      'Copy <code>a[i]</code> into a local variable before you start shifting.',
      'Shift while the previous element is larger than the saved value and you have not run off the left edge.',
      'Write the saved value into the gap after the loop.',
    ],
    forbidden: NO_SORT,
    starter: `void insertionSort(vector<int>& a) {

}`,
    solution: `void insertionSort(vector<int>& a) {
    int n = a.size();
    for (int i = 1; i < n; i++) {
        int v = a[i];
        int j = i;
        while (j > 0 && a[j - 1] > v) {
            a[j] = a[j - 1];
            j--;
        }
        a[j] = v;
    }
}`,
    harness: sortHarness('insertionSort(a);', 2000),
    tests: smallTests('2 000 random values'),
  },
  {
    id: 's2-merge-sort',
    title: 'Merge sort',
    kind: 'implement',
    task: 'Sort the vector in ascending order with merge sort. <code>std::sort</code> is off the table.',
    refresher: [
      'Split the range in half and sort each half.',
      '<b>Merge</b> with two read pointers: always take the smaller front value, then copy whatever is left.',
      'One element is already sorted.',
    ],
    hints: [
      'Write <code>merge</code> first and trace it on <code>[2 5 | 1 9]</code>.',
      'Use half-open ranges <code>[lo, hi)</code> everywhere.',
      'After the main loop, one half still has values in it.',
    ],
    forbidden: NO_SORT,
    starter: `// Sort a[lo, hi) in place.
void mergeSort(vector<int>& a, int lo, int hi) {

}`,
    solution: `void merge(vector<int>& a, int lo, int mid, int hi) {
    vector<int> tmp;
    tmp.reserve(hi - lo);
    int i = lo, j = mid;
    while (i < mid && j < hi) tmp.push_back(a[i] <= a[j] ? a[i++] : a[j++]);
    while (i < mid) tmp.push_back(a[i++]);
    while (j < hi) tmp.push_back(a[j++]);
    for (int k = 0; k < (int)tmp.size(); k++) a[lo + k] = tmp[k];
}

void mergeSort(vector<int>& a, int lo, int hi) {
    if (hi - lo <= 1) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid);
    mergeSort(a, mid, hi);
    merge(a, lo, mid, hi);
}`,
    harness: sortHarness('mergeSort(a, 0, (int)a.size());', 100000),
    tests: smallTests('100 000 random values'),
  },
  {
    id: 's2-quick-sort',
    title: 'Quick sort',
    kind: 'implement',
    task: 'Sort the vector in ascending order with quick sort: write the partition step and the recursion. <code>std::sort</code> is off the table.',
    refresher: [
      'Pick a pivot, partition so smaller values go left and larger go right, then sort both sides. The pivot lands in its final place.',
      'Average <code>O(n log n)</code>. A bad pivot choice makes it <code>O(n&sup2;)</code>.',
    ],
    hints: [
      'Use half-open <code>[lo, hi)</code>. Move the pivot out of the way (to the end), partition the rest, then swap it into its final position.',
      'A first-element pivot degrades to <code>O(n&sup2;)</code> on sorted input, and the large sorted test will time out. Pick the middle element or a median of three.',
      'Recurse on <code>[lo, p)</code> and <code>[p + 1, hi)</code>, where <code>p</code> is the pivot position.',
    ],
    forbidden: NO_SORT,
    starter: `// Sort a[lo, hi) in place.
void quickSort(vector<int>& a, int lo, int hi) {

}`,
    solution: `void quickSort(vector<int>& a, int lo, int hi) {
    if (hi - lo <= 1) return;
    int mid = lo + (hi - lo) / 2;
    swap(a[mid], a[hi - 1]);
    int pivot = a[hi - 1];
    int p = lo;
    for (int i = lo; i < hi - 1; i++) {
        if (a[i] < pivot) swap(a[i], a[p++]);
    }
    swap(a[p], a[hi - 1]);
    quickSort(a, lo, p);
    quickSort(a, p + 1, hi);
}`,
    harness: sortHarness(
      'quickSort(a, 0, (int)a.size());',
      100000,
      `    if (t == 8) { for (int i = 0; i < 100000; i++) a.push_back(i); }
    if (t == 9) a.assign(5000, 42);
`
    ),
    tests: [
      ...smallTests('100 000 random values'),
      { name: 'Large, already sorted', stdin: '8', input: '100 000 values, 0 to 99 999 in order', expected: 'sorted' },
      { name: 'All equal', stdin: '9', input: '5 000 copies of 42', expected: 'sorted' },
    ],
  },
  {
    id: 's2-counting-sort',
    title: 'Counting sort',
    kind: 'implement',
    task: 'Every value is in <code>[0, maxValue]</code>. Sort the vector in ascending order without comparing elements to each other. <code>std::sort</code> is off the table.',
    refresher: [
      'Count how often each value occurs in an array indexed by value, then write the values back in order, each as many times as counted.',
      'Time <code>O(n + maxValue)</code>, extra memory <code>O(maxValue)</code>.',
    ],
    hints: [
      'You need a counts vector of size <code>maxValue + 1</code>.',
      'Rebuild <code>a</code> by walking the counts from 0 upward with a write index.',
    ],
    forbidden: NO_SORT,
    starter: `// Every value of a is in [0, maxValue].
void countingSort(vector<int>& a, int maxValue) {

}`,
    solution: `void countingSort(vector<int>& a, int maxValue) {
    vector<int> cnt(maxValue + 1, 0);
    for (size_t i = 0; i < a.size(); i++) cnt[a[i]]++;
    size_t w = 0;
    for (int v = 0; v <= maxValue; v++) {
        for (int k = 0; k < cnt[v]; k++) a[w++] = v;
    }
}`,
    harness: sortHarness('countingSort(a, maxv);', 100000, '').replace(
      'int t; cin >> t;',
      'int t; cin >> t;\n    int maxv = 9;'
    ).replace(
      'a.push_back((x >> 8) % 1000000);',
      'a.push_back((x >> 8) % 1001);'
    ).replace(
      'if (t >= 7) {',
      'if (t == 7) {'
    ).replace(
      '    size_t count = a.size();',
      '    if (t == 7) maxv = 1000;\n    if (t == 8) { a = {0, 0, 0}; maxv = 0; }\n    size_t count = a.size();'
    ),
    tests: [
      ...smallTests('100 000 random values in 0 to 1000'),
      { name: 'Only zeros', stdin: '8', input: '0 0 0, maxValue 0', expected: '0 0 0' },
    ],
  },
  {
    id: 's2-binary-search',
    title: 'Binary search',
    kind: 'implement',
    task: 'Return the index of <code>target</code> in the sorted vector <code>a</code> (all values distinct), or <code>-1</code> if it is not there. Do not use the standard library search functions.',
    refresher: [
      'Keep a window <code>[lo, hi]</code> that could still hold the target. Look at the middle: go left or right, and shrink the window every step.',
      'Each step halves the window, so <code>O(log n)</code>.',
    ],
    hints: [
      'Compute <code>mid = lo + (hi - lo) / 2</code>.',
      'Decide first whether <code>hi</code> is inclusive or exclusive, then make the loop condition and both updates agree with that.',
      'Every update must move <code>lo</code> or <code>hi</code> past <code>mid</code>.',
    ],
    forbidden: NO_BOUNDS,
    starter: `// a is sorted ascending with distinct values.
// Return the index of target, or -1.
int binarySearch(const vector<int>& a, int target) {
    return -1;
}`,
    solution: `int binarySearch(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    harness: SEARCH_HARNESS,
    tests: [
      { name: 'Middle', stdin: '1', input: '[1 3 5 7 9 11], find 7', expected: '3' },
      { name: 'First element', stdin: '2', input: '[1 3 5 7 9 11], find 1', expected: '0' },
      { name: 'Last element', stdin: '3', input: '[1 3 5 7 9 11], find 11', expected: '5' },
      { name: 'Missing, in between', stdin: '4', input: '[1 3 5 7 9 11], find 4', expected: '-1' },
      { name: 'Missing, too small', stdin: '5', input: '[1 3 5 7 9 11], find 0', expected: '-1' },
      { name: 'Missing, too large', stdin: '6', input: '[1 3 5 7 9 11], find 12', expected: '-1' },
      { name: 'Empty', stdin: '7', input: '[], find 3', expected: '-1' },
      { name: 'One value, hit', stdin: '8', input: '[4], find 4', expected: '0' },
      { name: 'One value, miss', stdin: '9', input: '[4], find 5', expected: '-1' },
      { name: 'Large', stdin: '10', input: '100 000 even numbers, every present and absent value', expected: 'ok' },
    ],
  },
  {
    id: 's2-lower-upper-bound',
    title: 'Lower and upper bound',
    kind: 'implement',
    task: 'In a sorted vector (duplicates allowed), <code>lowerBound</code> returns the first index with <code>a[i] &gt;= x</code> and <code>upperBound</code> the first index with <code>a[i] &gt; x</code>. Both return <code>a.size()</code> if none.',
    example: { input: '[1 2 2 2 5 8], x = 2', output: 'lowerBound 1, upperBound 4' },
    refresher: [
      'Binary search for the first position where a condition turns true: keep <code>lo</code> at a position that may be the answer, and <code>hi</code> at one that is.',
      'The two functions differ only in the condition: <code>&gt;=</code> versus <code>&gt;</code>.',
    ],
    hints: [
      'Use <code>lo = 0</code>, <code>hi = a.size()</code> and loop while <code>lo &lt; hi</code>.',
      'If the condition holds at <code>mid</code>, the answer is <code>mid</code> or earlier: <code>hi = mid</code>. Otherwise <code>lo = mid + 1</code>.',
      'The count of elements equal to x is <code>upperBound - lowerBound</code>.',
    ],
    forbidden: NO_BOUNDS,
    starter: `// First index i with a[i] >= x, or a.size() if none.
int lowerBound(const vector<int>& a, int x) {
    return 0;
}

// First index i with a[i] > x, or a.size() if none.
int upperBound(const vector<int>& a, int x) {
    return 0;
}`,
    solution: `int lowerBound(const vector<int>& a, int x) {
    int lo = 0, hi = (int)a.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] >= x) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

int upperBound(const vector<int>& a, int x) {
    int lo = 0, hi = (int)a.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] > x) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a = {1, 2, 2, 2, 5, 8};
    int x = 0;
    if (t == 1) x = 2;
    if (t == 2) x = 0;
    if (t == 3) x = 9;
    if (t == 4) x = 3;
    if (t == 5) x = 5;
    if (t == 6) x = 1;
    if (t == 7) { a = {}; x = 1; }
    if (t == 8) { a = {4, 4, 4, 4}; x = 4; }
    cout << "\\n@@RESULT@@\\n";
    if (t == 9) {
        int n = 100000;
        a.clear();
        for (int i = 0; i < n; i++) a.push_back(i / 3);
        bool ok = true;
        for (int v = -2; v <= 33336; v++) {
            int lo, up;
            if (v < 0) { lo = 0; up = 0; }
            else if (v > 33333) { lo = n; up = n; }
            else { lo = 3 * v; up = min(3 * v + 3, n); }
            if (lowerBound(a, v) != lo || upperBound(a, v) != up) ok = false;
        }
        cout << (ok ? "ok" : "wrong");
    } else {
        cout << lowerBound(a, x) << " " << upperBound(a, x);
    }
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Duplicates', stdin: '1', input: '[1 2 2 2 5 8], x = 2', expected: '1 4' },
      { name: 'Below everything', stdin: '2', input: '[1 2 2 2 5 8], x = 0', expected: '0 0' },
      { name: 'Above everything', stdin: '3', input: '[1 2 2 2 5 8], x = 9', expected: '6 6' },
      { name: 'Missing, in between', stdin: '4', input: '[1 2 2 2 5 8], x = 3', expected: '4 4' },
      { name: 'Single match', stdin: '5', input: '[1 2 2 2 5 8], x = 5', expected: '4 5' },
      { name: 'First element', stdin: '6', input: '[1 2 2 2 5 8], x = 1', expected: '0 1' },
      { name: 'Empty', stdin: '7', input: '[], x = 1', expected: '0 0' },
      { name: 'All equal', stdin: '8', input: '[4 4 4 4], x = 4', expected: '0 4' },
      { name: 'Large', stdin: '9', input: '100 000 values with runs of three, 33 339 queries', expected: 'ok' },
    ],
  },
  {
    id: 's2-binary-search-bug',
    title: 'Binary search never ends',
    kind: 'bugfix',
    task: 'This binary search hangs on some inputs and misses elements on others. Fix it so it returns the index of <code>target</code> in the sorted vector, or <code>-1</code>.',
    refresher: [
      'Every iteration must shrink the window. If an update can leave <code>lo</code> and <code>hi</code> unchanged, the loop never ends.',
      'With an inclusive <code>[lo, hi]</code> window, a window of one element is still a window to check.',
    ],
    hints: [
      'Trace <code>[1 3 5 7 9 11]</code> with target 11 on paper and watch <code>lo</code> and <code>hi</code>.',
      'One line never moves <code>lo</code> past <code>mid</code>.',
      'There is a second bug: look at the loop condition and try a vector with a single element.',
    ],
    forbidden: NO_BOUNDS,
    timeLimitMs: 2000,
    starter: `// a is sorted ascending with distinct values.
// Return the index of target, or -1.
int binarySearch(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid;
        else hi = mid - 1;
    }
    return -1;
}`,
    solution: `// a is sorted ascending with distinct values.
// Return the index of target, or -1.
int binarySearch(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    harness: SEARCH_HARNESS,
    tests: [
      { name: 'One value, hit', stdin: '8', input: '[4], find 4', expected: '0' },
      { name: 'First element', stdin: '2', input: '[1 3 5 7 9 11], find 1', expected: '0' },
      { name: 'Middle', stdin: '1', input: '[1 3 5 7 9 11], find 7', expected: '3' },
      { name: 'Last element', stdin: '3', input: '[1 3 5 7 9 11], find 11', expected: '5' },
      { name: 'Missing, in between', stdin: '4', input: '[1 3 5 7 9 11], find 4', expected: '-1' },
      { name: 'Missing, too small', stdin: '5', input: '[1 3 5 7 9 11], find 0', expected: '-1' },
      { name: 'Missing, too large', stdin: '6', input: '[1 3 5 7 9 11], find 12', expected: '-1' },
      { name: 'Empty', stdin: '7', input: '[], find 3', expected: '-1' },
      { name: 'One value, miss', stdin: '9', input: '[4], find 5', expected: '-1' },
      { name: 'Large', stdin: '10', input: '100 000 even numbers, every present and absent value', expected: 'ok' },
    ],
  },
  {
    id: 's2-sort-records',
    title: 'Sort student records',
    kind: 'program',
    task: 'Read <code>n</code>, then <code>n</code> records of a name and an integer score. Print them sorted by score, highest first, ties by name in ascending order. <code>std::sort</code> with a comparator is allowed.',
    example: { input: '4\nalice 90\nbob 85\ncarol 90\ndave 70', output: 'alice 90\ncarol 90\nbob 85\ndave 70' },
    refresher: [
      'Store records in a <code>struct</code> inside a <code>vector</code>. <code>sort(v.begin(), v.end(), cmp)</code> orders them by your comparator.',
      'A comparator returns <code>true</code> when its first argument must come before the second. Compare scores first, and names only when scores are equal.',
    ],
    hints: [
      'Read names as <code>string</code> with <code>cin &gt;&gt;</code>; the names have no spaces.',
      'A lambda <code>[](const Rec&amp; a, const Rec&amp; b) { ... }</code> works as the comparator.',
      'Inside it: if the scores differ, return which score is higher; otherwise return which name is smaller.',
    ],
    starter: '',
    solution: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

struct Rec {
    string name;
    int score;
};

int main() {
    int n;
    cin >> n;
    vector<Rec> v(n);
    for (int i = 0; i < n; i++) cin >> v[i].name >> v[i].score;
    sort(v.begin(), v.end(), [](const Rec& a, const Rec& b) {
        if (a.score != b.score) return a.score > b.score;
        return a.name < b.name;
    });
    for (int i = 0; i < n; i++) cout << v[i].name << " " << v[i].score << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '4\nalice 90\nbob 85\ncarol 90\ndave 70\n', expected: 'alice 90\ncarol 90\nbob 85\ndave 70' },
      { name: 'One record', stdin: '1\nzed 5\n', expected: 'zed 5' },
      { name: 'No records', stdin: '0\n', expected: '' },
      { name: 'All the same score', stdin: '4\nmia 50\nabe 50\nzoe 50\nkai 50\n', expected: 'abe 50\nkai 50\nmia 50\nzoe 50' },
      { name: 'Negative scores', stdin: '3\nann -4\nben 0\ncy -10\n', expected: 'ben 0\nann -4\ncy -10' },
      { name: 'Already in order', stdin: '3\nann 9\nben 8\ncy 7\n', expected: 'ann 9\nben 8\ncy 7' },
      { name: '2 000 records', stdin: recordsLarge.stdin, input: '2 000 records, scores 0 to 49', expected: recordsLarge.expected },
    ],
  },
]
