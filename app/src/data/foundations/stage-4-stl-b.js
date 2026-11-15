// Lessons for this stage. Format: docs/superpowers/specs/2026-11-15-foundations-track-design.md
export const LESSONS = [
  {
    id: 's4-pq-order',
    title: 'priority_queue with your order',
    kind: 'drill',
    task: 'Write <code>ascending</code> (ints, smallest first) and <code>order</code> (task names: lowest <code>pri</code> first, ties by name A to Z). Use a <code>priority_queue</code> for both.',
    example: { input: '(3,write) (1,plan) (2,test)', output: 'plan test write' },
    refresher: [
      'Min-heap of ints: <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; pq;</code>',
      'Custom order: <code>auto cmp = [](const T&amp; a, const T&amp; b) { ... }; priority_queue&lt;T, vector&lt;T&gt;, decltype(cmp)&gt; pq(cmp);</code>',
      'The comparator reads backwards compared with <code>sort</code>: return true when <code>a</code> should come out AFTER <code>b</code>.',
    ],
    hints: [
      'For <code>ascending</code>, you only need the third template argument <code>greater&lt;int&gt;</code>.',
      'For <code>order</code>, if <code>a.pri != b.pri</code> then "a comes later" means <code>a.pri &gt; b.pri</code>.',
      'The name tie-break is also flipped: <code>a.name &gt; b.name</code> means a comes later.',
    ],
    starter: `struct Task { int pri; string name; };

// The ints, smallest first.
vector<int> ascending(const vector<int>& v) {
    return {};
}

// Task names in the order they leave the queue.
vector<string> order(const vector<Task>& tasks) {
    return {};
}`,
    solution: `struct Task { int pri; string name; };

vector<int> ascending(const vector<int>& v) {
    priority_queue<int, vector<int>, greater<int>> pq(v.begin(), v.end());
    vector<int> out;
    while (!pq.empty()) {
        out.push_back(pq.top());
        pq.pop();
    }
    return out;
}

vector<string> order(const vector<Task>& tasks) {
    auto cmp = [](const Task& a, const Task& b) {
        if (a.pri != b.pri) return a.pri > b.pri;
        return a.name > b.name;
    };
    priority_queue<Task, vector<Task>, decltype(cmp)> pq(cmp);
    for (const Task& t : tasks) pq.push(t);
    vector<string> out;
    while (!pq.empty()) {
        out.push_back(pq.top().name);
        pq.pop();
    }
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v;
    vector<Task> ts;
    if (t == 1) v = {5, 1, 4, 1, 3};
    if (t == 2) v = {};
    if (t == 3) ts = {{3, "write"}, {1, "plan"}, {2, "test"}};
    if (t == 4) ts = {{2, "b"}, {1, "z"}, {2, "a"}, {1, "y"}};
    if (t == 5) ts = {{7, "solo"}};
    if (t == 6) ts = {{5, "b"}, {5, "a"}, {5, "c"}, {1, "d"}};
    vector<string> out;
    if (t <= 2) { for (int x : ascending(v)) out.push_back(to_string(x)); }
    else out = order(ts);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < out.size(); i++) cout << (i ? " " : "") << out[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Ints with a duplicate', stdin: '1', input: 'ascending 5 1 4 1 3', expected: '1 1 3 4 5' },
      { name: 'No ints', stdin: '2', input: 'ascending (empty)', expected: '' },
      { name: 'Distinct priorities', stdin: '3', input: '(3,write) (1,plan) (2,test)', expected: 'plan test write' },
      { name: 'Ties by name', stdin: '4', input: '(2,b) (1,z) (2,a) (1,y)', expected: 'y z a b' },
      { name: 'One task', stdin: '5', input: '(7,solo)', expected: 'solo' },
      { name: 'Same priority', stdin: '6', input: '(5,b) (5,a) (5,c) (1,d)', expected: 'd a b c' },
    ],
  },
  {
    id: 's4-lower-bound',
    title: 'lower_bound',
    kind: 'drill',
    task: 'On a sorted vector, write <code>firstAtLeast</code> (index of the first value &ge; <code>x</code>, or <code>size()</code> if none) and <code>countInRange</code> (how many values lie in <code>[lo, hi]</code>).',
    example: { input: '1 3 3 5 8 8 8 10, range [3, 8]', output: '6' },
    refresher: [
      '<code>lower_bound(a.begin(), a.end(), x)</code> returns an iterator to the first value &ge; x. <code>upper_bound</code> returns the first value &gt; x.',
      'Iterator minus <code>a.begin()</code> gives the index. If nothing qualifies you get <code>a.end()</code>, which is index <code>size()</code>.',
    ],
    hints: [
      '<code>firstAtLeast</code> is one <code>lower_bound</code> call minus <code>begin()</code>.',
      'Count of values in <code>[lo, hi]</code> = (first index &gt; hi) - (first index &ge; lo).',
      'Which of the two bounds gives "first index &gt; hi"?',
    ],
    starter: `// Index of the first value >= x in sorted a, or a.size() if none.
int firstAtLeast(const vector<int>& a, int x) {
    return 0;
}

// How many values v in sorted a satisfy lo <= v <= hi.
int countInRange(const vector<int>& a, int lo, int hi) {
    return 0;
}`,
    solution: `int firstAtLeast(const vector<int>& a, int x) {
    return lower_bound(a.begin(), a.end(), x) - a.begin();
}

int countInRange(const vector<int>& a, int lo, int hi) {
    auto first = lower_bound(a.begin(), a.end(), lo);
    auto last = upper_bound(a.begin(), a.end(), hi);
    return last - first;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a = {1, 3, 3, 5, 8, 8, 8, 10};
    int r = -1;
    if (t == 1) r = countInRange(a, 3, 8);
    if (t == 2) r = countInRange(a, 4, 7);
    if (t == 3) r = countInRange(a, 11, 20);
    if (t == 4) r = firstAtLeast(a, 8);
    if (t == 5) r = firstAtLeast(a, 11);
    if (t == 6) { vector<int> e; r = firstAtLeast(e, 5) + countInRange(e, 0, 9); }
    if (t == 7) r = countInRange(a, -5, 0);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Range with duplicates', stdin: '1', input: 'count in [3, 8]', expected: '6' },
      { name: 'Range between values', stdin: '2', input: 'count in [4, 7]', expected: '1' },
      { name: 'Range above everything', stdin: '3', input: 'count in [11, 20]', expected: '0' },
      { name: 'Range below everything', stdin: '7', input: 'count in [-5, 0]', expected: '0' },
      { name: 'First index of a repeated value', stdin: '4', input: 'firstAtLeast 8', expected: '4' },
      { name: 'Nothing is big enough', stdin: '5', input: 'firstAtLeast 11', expected: '8' },
      { name: 'Empty vector', stdin: '6', input: 'firstAtLeast + count on empty', expected: '0' },
    ],
  },
  {
    id: 's4-iterators',
    title: 'Iterators',
    kind: 'drill',
    task: 'Write <code>sumRange</code>: sum the elements at positions <code>[from, to)</code> of a <code>list</code>. Write <code>kthLargest</code>: the k-th largest value of a <code>set</code> (k = 1 is the largest).',
    example: { input: 'list 4 8 15 16 23 42, from 1, to 4', output: '39' },
    refresher: [
      '<code>begin()</code> points at the first element, <code>end()</code> one past the last. Dereference with <code>*it</code>, step with <code>++it</code>. Loop until <code>it != end</code>.',
      'A list or set has no <code>[i]</code>. Jump with <code>next(it, n)</code> or <code>advance(it, n)</code>. <code>rbegin()</code> walks backwards from the last element.',
    ],
    hints: [
      '<code>next(l.begin(), from)</code> gives you the start iterator without indexing.',
      'Build a second iterator for <code>to</code> the same way, then loop <code>for (; it != stop; ++it)</code>.',
      'For <code>kthLargest</code>, start at <code>s.rbegin()</code> and move it <code>k - 1</code> steps.',
    ],
    starter: `#include <iterator>

// Sum of the elements at positions from .. to-1 (0-based). 0 <= from <= to <= size.
long long sumRange(const list<int>& l, int from, int to) {
    return 0;
}

// The k-th largest value (k = 1 is the largest). 1 <= k <= size.
int kthLargest(const set<int>& s, int k) {
    return 0;
}`,
    solution: `#include <iterator>

long long sumRange(const list<int>& l, int from, int to) {
    auto it = next(l.begin(), from);
    auto stop = next(l.begin(), to);
    long long sum = 0;
    for (; it != stop; ++it) sum += *it;
    return sum;
}

int kthLargest(const set<int>& s, int k) {
    auto it = s.rbegin();
    advance(it, k - 1);
    return *it;
}`,
    harness: `int main() {
    int t; cin >> t;
    list<int> l = {4, 8, 15, 16, 23, 42};
    set<int> s = {10, 20, 30, 40};
    long long r = -1;
    if (t == 1) r = sumRange(l, 1, 4);
    if (t == 2) r = sumRange(l, 0, 6);
    if (t == 3) r = sumRange(l, 3, 3);
    if (t == 4) r = sumRange(l, 5, 6);
    if (t == 5) r = kthLargest(s, 1);
    if (t == 6) r = kthLargest(s, 3);
    if (t == 7) r = kthLargest(s, 4);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Middle of the list', stdin: '1', input: 'list 4 8 15 16 23 42, [1, 4)', expected: '39' },
      { name: 'Whole list', stdin: '2', input: 'list, [0, 6)', expected: '108' },
      { name: 'Empty range', stdin: '3', input: 'list, [3, 3)', expected: '0' },
      { name: 'Last element only', stdin: '4', input: 'list, [5, 6)', expected: '42' },
      { name: 'Largest in the set', stdin: '5', input: 'set 10 20 30 40, k = 1', expected: '40' },
      { name: 'Third largest', stdin: '6', input: 'set, k = 3', expected: '20' },
      { name: 'Smallest as k-th', stdin: '7', input: 'set, k = 4', expected: '10' },
    ],
  },
  {
    id: 's4-erase-loop',
    title: 'Erase while looping',
    kind: 'drill',
    task: 'Write <code>removeEvens</code> (erase every even value from a vector) and <code>dropBelow</code> (erase every map entry whose value is below <code>limit</code>).',
    example: { input: '1 2 3 4 5 6', output: '1 3 5' },
    refresher: [
      'Vector: <code>v.erase(remove_if(v.begin(), v.end(), pred), v.end());</code> <code>remove_if</code> only shuffles; <code>erase</code> shrinks.',
      'Map, set or list: <code>erase(it)</code> returns the next valid iterator. Loop with <code>it = c.erase(it)</code> or <code>++it</code>, never both.',
    ],
    hints: [
      'Vector: pass a lambda <code>[](int x) { return x % 2 == 0; }</code> to <code>remove_if</code>.',
      'Map: use a <code>for</code> loop with no step expression and advance inside the body.',
      'Inside the body: if the entry should go, <code>it = m.erase(it)</code>, otherwise <code>++it</code>.',
    ],
    starter: `// Remove every even value from v.
void removeEvens(vector<int>& v) {

}

// Remove every entry of m whose value is < limit.
void dropBelow(map<string, int>& m, int limit) {

}`,
    solution: `void removeEvens(vector<int>& v) {
    v.erase(remove_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; }), v.end());
}

void dropBelow(map<string, int>& m, int limit) {
    for (auto it = m.begin(); it != m.end();) {
        if (it->second < limit) it = m.erase(it);
        else ++it;
    }
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v;
    map<string, int> m;
    if (t == 1) v = {1, 2, 3, 4, 5, 6};
    if (t == 2) v = {2, 4, 6, 8};
    if (t == 3) v = {};
    if (t == 4) m = {{"a", 5}, {"b", 1}, {"c", 2}, {"d", 9}};
    if (t == 5) m = {{"x", 1}, {"y", 2}, {"z", 0}};
    if (t == 6) m = {{"p", 3}, {"q", 4}};
    if (t <= 3) removeEvens(v);
    else dropBelow(m, t == 6 ? 0 : 3);
    cout << "\\n@@RESULT@@\\n";
    if (t <= 3) { for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i]; }
    else { bool first = true; for (auto& kv : m) { cout << (first ? "" : " ") << kv.first << "=" << kv.second; first = false; } }
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Mixed vector', stdin: '1', input: '1 2 3 4 5 6', expected: '1 3 5' },
      { name: 'Only evens', stdin: '2', input: '2 4 6 8', expected: '' },
      { name: 'Empty vector', stdin: '3', input: '(empty)', expected: '' },
      { name: 'Some entries dropped', stdin: '4', input: 'a=5 b=1 c=2 d=9, limit 3', expected: 'a=5 d=9' },
      { name: 'Every entry dropped', stdin: '5', input: 'x=1 y=2 z=0, limit 3', expected: '' },
      { name: 'Nothing dropped', stdin: '6', input: 'p=3 q=4, limit 0', expected: 'p=3 q=4' },
    ],
  },
  {
    id: 's4-accumulate',
    title: 'accumulate and friends',
    kind: 'drill',
    task: 'Use <code>accumulate</code> to write <code>sumAll</code> (sum of the ints) and <code>sumOfSquares</code> (sum of each value squared, with a lambda). Both return <code>long long</code>.',
    example: { input: '2000000000 2000000000 2000000000', output: '6000000000' },
    refresher: [
      '<code>accumulate(first, last, init)</code>. The type of <code>init</code> is the type of the running total: <code>0</code> is an int and overflows, <code>0LL</code> is safe.',
      'With an operation: <code>accumulate(first, last, 0LL, [](long long acc, int x) { return acc + x; })</code>. Related: <code>partial_sum</code>, <code>count_if</code>.',
    ],
    hints: [
      'Pass <code>0LL</code> as the third argument.',
      'For squares, the lambda takes the running total first and the next element second.',
      'Cast before multiplying: <code>(long long)x * x</code>.',
    ],
    starter: `long long sumAll(const vector<int>& v) {
    return 0;
}

long long sumOfSquares(const vector<int>& v) {
    return 0;
}`,
    solution: `long long sumAll(const vector<int>& v) {
    return accumulate(v.begin(), v.end(), 0LL);
}

long long sumOfSquares(const vector<int>& v) {
    return accumulate(v.begin(), v.end(), 0LL, [](long long acc, int x) {
        return acc + (long long)x * x;
    });
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v;
    long long r = 0;
    if (t == 1) { v = {1, 2, 3}; r = sumAll(v); }
    if (t == 2) { v = {}; r = sumAll(v); }
    if (t == 3) { v = {2000000000, 2000000000, 2000000000}; r = sumAll(v); }
    if (t == 4) { v = {-5, 3, -1}; r = sumAll(v); }
    if (t == 5) { v = {1, 2, 3}; r = sumOfSquares(v); }
    if (t == 6) { v = {100000, 100000, -3}; r = sumOfSquares(v); }
    if (t == 7) { v = {}; r = sumOfSquares(v); }
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Small sum', stdin: '1', input: 'sumAll 1 2 3', expected: '6' },
      { name: 'Empty sum', stdin: '2', input: 'sumAll (empty)', expected: '0' },
      { name: 'Sum too big for int', stdin: '3', input: 'sumAll 3 x 2000000000', expected: '6000000000' },
      { name: 'Negatives', stdin: '4', input: 'sumAll -5 3 -1', expected: '-3' },
      { name: 'Small squares', stdin: '5', input: 'sumOfSquares 1 2 3', expected: '14' },
      { name: 'Squares too big for int', stdin: '6', input: 'sumOfSquares 100000 100000 -3', expected: '20000000009' },
      { name: 'Empty squares', stdin: '7', input: 'sumOfSquares (empty)', expected: '0' },
    ],
  },
  {
    id: 's4-minmax',
    title: 'min and max element',
    kind: 'drill',
    task: 'Write <code>indexOfMax</code> (index of the first largest value, -1 if empty) and <code>shortest</code> (the first shortest word, "" if empty). Use <code>max_element</code> and <code>min_element</code>.',
    example: { input: '3 9 2 9', output: '1' },
    refresher: [
      '<code>max_element(first, last)</code> and <code>min_element</code> return an ITERATOR to the first extreme. Value: <code>*it</code>. Index: <code>it - v.begin()</code>.',
      'On an empty range they return <code>end()</code>, which must not be dereferenced. A third argument is a comparator: <code>min_element(b, e, [](const string&amp; a, const string&amp; b) { ... })</code>.',
    ],
    hints: [
      'Check <code>empty()</code> first, then one call plus a subtraction for the index.',
      'For <code>shortest</code>, the comparator returns true when <code>a</code> is shorter than <code>b</code>.',
      '<code>min_element</code> keeps the first of equal elements as long as your comparator is strict (<code>&lt;</code>).',
    ],
    starter: `int indexOfMax(const vector<int>& v) {
    return 0;
}

string shortest(const vector<string>& w) {
    return "";
}`,
    solution: `int indexOfMax(const vector<int>& v) {
    if (v.empty()) return -1;
    return max_element(v.begin(), v.end()) - v.begin();
}

string shortest(const vector<string>& w) {
    if (w.empty()) return "";
    auto it = min_element(w.begin(), w.end(), [](const string& a, const string& b) {
        return a.size() < b.size();
    });
    return *it;
}`,
    harness: `int main() {
    int t; cin >> t;
    cout << "\\n@@RESULT@@\\n";
    if (t == 1) cout << indexOfMax({3, 9, 2, 9});
    if (t == 2) cout << indexOfMax({});
    if (t == 3) cout << indexOfMax({-4, -2, -9});
    if (t == 4) cout << shortest({"pear", "fig", "kiwi", "plum"});
    if (t == 5) cout << shortest({"ab", "cd", "e", "f"});
    if (t == 6) cout << "[" << shortest({}) << "]";
    if (t == 7) cout << indexOfMax({7});
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'First of two maxima', stdin: '1', input: '3 9 2 9', expected: '1' },
      { name: 'Empty vector', stdin: '2', input: '(empty)', expected: '-1' },
      { name: 'All negative', stdin: '3', input: '-4 -2 -9', expected: '1' },
      { name: 'One value', stdin: '7', input: '7', expected: '0' },
      { name: 'Shortest word', stdin: '4', input: 'pear fig kiwi plum', expected: 'fig' },
      { name: 'Tie: first one wins', stdin: '5', input: 'ab cd e f', expected: 'e' },
      { name: 'No words', stdin: '6', input: '(empty)', expected: '[]' },
    ],
  },
  {
    id: 's4-reverse-rotate',
    title: 'reverse and rotate',
    kind: 'drill',
    task: 'Write <code>rotateLeft</code> (shift the vector left by <code>k</code>, wrapping around; <code>k</code> may exceed the size) and <code>reverseRange</code> (reverse positions <code>i..j</code> inclusive).',
    example: { input: '1 2 3 4 5, k = 2', output: '3 4 5 1 2' },
    refresher: [
      '<code>reverse(first, last)</code> works on a half-open range, so positions <code>i..j</code> inclusive are <code>v.begin() + i, v.begin() + j + 1</code>.',
      '<code>rotate(first, middle, last)</code> makes <code>middle</code> the new first element. Reduce <code>k</code> with <code>%</code> and guard against an empty vector.',
    ],
    hints: [
      'For <code>rotateLeft</code>: <code>k %= size</code>, then <code>middle</code> is <code>v.begin() + k</code>.',
      'If the vector is empty, return before the <code>%</code>.',
      'For <code>reverseRange</code>, the end iterator is one past <code>j</code>.',
    ],
    starter: `// Shift left by k, wrapping around. k >= 0 and may exceed size.
void rotateLeft(vector<int>& v, int k) {

}

// Reverse positions i..j (inclusive).
void reverseRange(vector<int>& v, int i, int j) {

}`,
    solution: `void rotateLeft(vector<int>& v, int k) {
    if (v.empty()) return;
    k %= (int)v.size();
    rotate(v.begin(), v.begin() + k, v.end());
}

void reverseRange(vector<int>& v, int i, int j) {
    reverse(v.begin() + i, v.begin() + j + 1);
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v = {1, 2, 3, 4, 5};
    if (t == 1) rotateLeft(v, 2);
    if (t == 2) rotateLeft(v, 0);
    if (t == 3) rotateLeft(v, 7);
    if (t == 4) { vector<int> e; rotateLeft(e, 3); v = e; }
    if (t == 5) reverseRange(v, 1, 3);
    if (t == 6) reverseRange(v, 2, 2);
    if (t == 7) reverseRange(v, 0, 4);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Rotate by 2', stdin: '1', input: '1 2 3 4 5, k = 2', expected: '3 4 5 1 2' },
      { name: 'Rotate by 0', stdin: '2', input: '1 2 3 4 5, k = 0', expected: '1 2 3 4 5' },
      { name: 'k bigger than size', stdin: '3', input: '1 2 3 4 5, k = 7', expected: '3 4 5 1 2' },
      { name: 'Rotate an empty vector', stdin: '4', input: '(empty), k = 3', expected: '' },
      { name: 'Reverse the middle', stdin: '5', input: '1 2 3 4 5, i = 1, j = 3', expected: '1 4 3 2 5' },
      { name: 'Reverse one position', stdin: '6', input: '1 2 3 4 5, i = 2, j = 2', expected: '1 2 3 4 5' },
      { name: 'Reverse everything', stdin: '7', input: '1 2 3 4 5, i = 0, j = 4', expected: '5 4 3 2 1' },
    ],
  },
  {
    id: 's4-unique',
    title: 'unique',
    kind: 'drill',
    task: 'Write <code>dedupe</code>: return the values of <code>v</code> in ascending order with each value appearing once. Use <code>sort</code>, <code>unique</code> and <code>erase</code>.',
    example: { input: '4 1 4 2 1', output: '1 2 4' },
    refresher: [
      '<code>unique(first, last)</code> only removes ADJACENT duplicates, so sort first. It returns the new logical end but does not shrink the vector.',
      'The idiom: <code>sort(v.begin(), v.end()); v.erase(unique(v.begin(), v.end()), v.end());</code>',
    ],
    hints: [
      'Order matters: sort first, then <code>unique</code>, then <code>erase</code>.',
      '<code>erase(from, v.end())</code> where <code>from</code> is what <code>unique</code> returned.',
    ],
    starter: `vector<int> dedupe(vector<int> v) {
    return {};
}`,
    solution: `vector<int> dedupe(vector<int> v) {
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
    return v;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v;
    if (t == 1) v = {4, 1, 4, 2, 1};
    if (t == 2) v = {7, 7, 7, 7};
    if (t == 3) v = {};
    if (t == 4) v = {1, 2, 3};
    if (t == 5) v = {1, 2, 1};
    if (t == 6) v = {5, -1, 5, -1, 0, 0};
    v = dedupe(v);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Unsorted with repeats', stdin: '1', input: '4 1 4 2 1', expected: '1 2 4' },
      { name: 'All the same', stdin: '2', input: '7 7 7 7', expected: '7' },
      { name: 'Empty', stdin: '3', input: '(empty)', expected: '' },
      { name: 'Already distinct', stdin: '4', input: '1 2 3', expected: '1 2 3' },
      { name: 'Repeat that is not adjacent', stdin: '5', input: '1 2 1', expected: '1 2' },
      { name: 'Negatives and zero', stdin: '6', input: '5 -1 5 -1 0 0', expected: '-1 0 5' },
    ],
  },
  {
    id: 's4-next-permutation',
    title: 'next_permutation',
    kind: 'drill',
    task: 'Write <code>allPerms</code>: return every distinct permutation of the string <code>s</code> in sorted order. The input may be in any order.',
    example: { input: 'aab', output: 'aab aba baa' },
    refresher: [
      '<code>next_permutation(first, last)</code> rearranges into the next larger permutation and returns <code>true</code>, or <code>false</code> after the last one.',
      'It only visits permutations AFTER the current one, so sort first. Use <code>do { ... } while (next_permutation(...));</code> so the starting one is not skipped.',
    ],
    hints: [
      'Sort the string before anything else.',
      'Record the string, then ask for the next permutation, inside a <code>do ... while</code>.',
    ],
    starter: `vector<string> allPerms(string s) {
    return {};
}`,
    solution: `vector<string> allPerms(string s) {
    sort(s.begin(), s.end());
    vector<string> out;
    do {
        out.push_back(s);
    } while (next_permutation(s.begin(), s.end()));
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    string s;
    if (t == 1) s = "abc";
    if (t == 2) s = "cba";
    if (t == 3) s = "aab";
    if (t == 4) s = "x";
    if (t == 5) s = "2121";
    if (t == 6) s = "bca";
    vector<string> out = allPerms(s);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < out.size(); i++) cout << (i ? " " : "") << out[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Sorted input', stdin: '1', input: 'abc', expected: 'abc acb bac bca cab cba' },
      { name: 'Reverse sorted input', stdin: '2', input: 'cba', expected: 'abc acb bac bca cab cba' },
      { name: 'Repeated letter', stdin: '3', input: 'aab', expected: 'aab aba baa' },
      { name: 'One character', stdin: '4', input: 'x', expected: 'x' },
      { name: 'Two pairs', stdin: '5', input: '2121', expected: '1122 1212 1221 2112 2121 2211' },
      { name: 'Shuffled input', stdin: '6', input: 'bca', expected: 'abc acb bac bca cab cba' },
    ],
  },
  {
    id: 's4-stale-iterator',
    title: 'The erase that skips',
    kind: 'bugfix',
    task: '<code>removeNegatives</code> should erase every negative value, but some negatives survive. Find the bug and fix it with the smallest change.',
    example: { input: '-1 -2 -3 4', output: '4' },
    refresher: [
      '<code>erase</code> shifts later elements left, so the position you just looked at now holds the NEXT element.',
      'After an erase, do not advance. Move on only when you keep the element.',
    ],
    hints: [
      'Run it on <code>-1 -2 -3</code> and trace the index by hand.',
      'Which element is at position <code>i</code> right after the erase, and does the loop look at it?',
      'The <code>i++</code> in the for header runs even after an erase.',
    ],
    starter: `void removeNegatives(vector<int>& v) {
    for (size_t i = 0; i < v.size(); i++) {
        if (v[i] < 0) {
            v.erase(v.begin() + i);
        }
    }
}`,
    solution: `void removeNegatives(vector<int>& v) {
    for (size_t i = 0; i < v.size();) {
        if (v[i] < 0) {
            v.erase(v.begin() + i);
        } else {
            i++;
        }
    }
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v;
    if (t == 1) v = {1, -2, 3, -4, 5};
    if (t == 2) v = {-1, -2, -3, 4};
    if (t == 3) v = {};
    if (t == 4) v = {-5, -5};
    if (t == 5) v = {3, 2, 1};
    if (t == 6) v = {1, -1, -1, -1, 2};
    removeNegatives(v);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Negatives apart', stdin: '1', input: '1 -2 3 -4 5', expected: '1 3 5' },
      { name: 'Negatives in a row', stdin: '2', input: '-1 -2 -3 4', expected: '4' },
      { name: 'Empty', stdin: '3', input: '(empty)', expected: '' },
      { name: 'Only negatives', stdin: '4', input: '-5 -5', expected: '' },
      { name: 'No negatives', stdin: '5', input: '3 2 1', expected: '3 2 1' },
      { name: 'Run in the middle', stdin: '6', input: '1 -1 -1 -1 2', expected: '1 2' },
    ],
  },
  {
    id: 's4-bad-comparator',
    title: 'The comparator that crashes sort',
    kind: 'bugfix',
    task: '<code>rankPlayers</code> should sort players by score (highest first), ties by name A to Z. The order is wrong, and the comparator is not valid for <code>sort</code>. Fix it.',
    example: { input: 'bo:5 al:5 cy:9', output: 'cy:9 al:5 bo:5' },
    refresher: [
      'A comparator must return <code>false</code> for equal elements. <code>&lt;=</code> and <code>&gt;=</code> break this rule, and <code>std::sort</code> may then crash or misorder.',
      'Use strict <code>&lt;</code> or <code>&gt;</code> only. Compare the primary key first; only on a tie compare the next key, in the direction you want.',
    ],
    hints: [
      'Strict comparisons only: look for <code>&gt;=</code> or <code>&lt;=</code>.',
      'Look at the tie-break: A to Z means the smaller name comes first.',
      'Scores differ: return <code>a.score &gt; b.score</code>. Scores equal: return a strict name comparison.',
    ],
    starter: `struct Player { string name; int score; };

void rankPlayers(vector<Player>& v) {
    sort(v.begin(), v.end(), [](const Player& a, const Player& b) {
        if (a.score != b.score) return a.score > b.score;
        return a.name >= b.name;
    });
}`,
    solution: `struct Player { string name; int score; };

void rankPlayers(vector<Player>& v) {
    sort(v.begin(), v.end(), [](const Player& a, const Player& b) {
        if (a.score != b.score) return a.score > b.score;
        return a.name < b.name;
    });
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<Player> v;
    if (t == 1) v = {{"bo", 5}, {"al", 5}, {"cy", 9}};
    if (t == 2) v = {{"dee", 1}, {"cat", 1}, {"bob", 1}, {"ann", 1}};
    if (t == 3) v = {};
    if (t == 4) v = {{"zed", 3}};
    if (t == 5) v = {{"a", 1}, {"b", 2}, {"c", 3}};
    if (t == 6) v = {{"m", 4}, {"k", 7}, {"j", 4}, {"l", 7}, {"i", 1}};
    rankPlayers(v);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i].name << ":" << v[i].score;
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Tie on score', stdin: '1', input: 'bo:5 al:5 cy:9', expected: 'cy:9 al:5 bo:5' },
      { name: 'All equal scores', stdin: '2', input: 'dee cat bob ann, all 1', expected: 'ann:1 bob:1 cat:1 dee:1' },
      { name: 'Empty', stdin: '3', input: '(empty)', expected: '' },
      { name: 'One player', stdin: '4', input: 'zed:3', expected: 'zed:3' },
      { name: 'No ties', stdin: '5', input: 'a:1 b:2 c:3', expected: 'c:3 b:2 a:1' },
      { name: 'Two ties', stdin: '6', input: 'm:4 k:7 j:4 l:7 i:1', expected: 'k:7 l:7 j:4 m:4 i:1' },
    ],
  },
]
