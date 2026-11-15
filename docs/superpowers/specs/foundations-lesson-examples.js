export const LESSONS = [
  {
    id: 'ex-sum-of-n',
    title: 'Sum of N numbers',
    kind: 'program',
    task: 'Read <code>n</code>, then <code>n</code> integers. Print their sum.',
    example: { input: '4\n10 20 30 40', output: '100' },
    refresher: [
      'This file starts empty. You write the <code>#include</code> lines and <code>int main()</code>.',
      '<code>cin &gt;&gt; x</code> reads the next value; <code>cout &lt;&lt; x</code> prints it.',
      'Big sums overflow <code>int</code>. Reach for <code>long long</code>.',
    ],
    hints: [
      'Get an empty <code>main</code> compiling before adding logic.',
      'Look at the largest values the input allows.',
    ],
    starter: '',
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long sum = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        sum += x;
    }
    cout << sum << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '4\n10 20 30 40\n', expected: '100' },
      { name: 'One negative value', stdin: '1\n-7\n', expected: '-7' },
      { name: 'Zero values', stdin: '0\n', expected: '0' },
      { name: 'Too big for int', stdin: '3\n2000000000 2000000000 2000000000\n', expected: '6000000000' },
    ],
  },
  {
    id: 'ex-merge-sort',
    title: 'Merge sort',
    kind: 'implement',
    task: 'Sort the vector in ascending order. <code>std::sort</code> is off the table.',
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
    forbidden: [{ pattern: '\\b(stable_)?sort\\s*\\(', message: 'Write the sort yourself: std::sort is off the table here.' }],
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
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    if (t == 1) a = {5, 2, 9, 1};
    if (t == 2) a = {};
    if (t == 3) a = {7};
    if (t == 4) a = {3, 3, 1, 3, 1};
    if (t == 5) a = {9, 8, 7, 6, 5};
    if (t == 6) { unsigned x = 12345; for (int i = 0; i < 100000; i++) { x = x * 1103515245u + 12345u; a.push_back((x >> 8) % 1000000); } }
    mergeSort(a, 0, (int)a.size());
    cout << "\\n@@RESULT@@\\n";
    if (t == 6) {
        bool ok = a.size() == 100000;
        for (size_t i = 1; i < a.size(); i++) if (a[i - 1] > a[i]) ok = false;
        cout << (ok ? "sorted" : "not sorted");
    } else {
        for (size_t i = 0; i < a.size(); i++) cout << (i ? " " : "") << a[i];
    }
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Small', stdin: '1', input: '5 2 9 1', expected: '1 2 5 9' },
      { name: 'Empty', stdin: '2', input: '(empty)', expected: '' },
      { name: 'One value', stdin: '3', input: '7', expected: '7' },
      { name: 'Duplicates', stdin: '4', input: '3 3 1 3 1', expected: '1 1 3 3 3' },
      { name: 'Descending', stdin: '5', input: '9 8 7 6 5', expected: '5 6 7 8 9' },
      { name: 'Large', stdin: '6', input: '100 000 random values', expected: 'sorted' },
    ],
  },
]
