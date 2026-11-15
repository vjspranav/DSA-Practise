// Stage 4, first half: STL drills. One feature each.
export const LESSONS = [
  {
    id: 's4-vector-basics',
    title: 'vector basics',
    kind: 'drill',
    task: 'Return a new <code>vector&lt;int&gt;</code> holding the square of every odd value in <code>a</code>, in the original order. Build it with <code>push_back</code> and a range-for.',
    example: { input: '1 2 3 4 5', output: '1 9 25' },
    refresher: [
      '<code>vector&lt;int&gt; out;</code> then <code>out.push_back(x);</code>. Also <code>out.size()</code>, <code>out.back()</code>, <code>out[i]</code>.',
      'Range-for: <code>for (int x : a)</code>. Add <code>const auto&amp;</code> when copying is costly.',
      'Negative odd numbers give <code>x % 2 == -1</code>, so test <code>!= 0</code>.',
    ],
    hints: [
      'Start with an empty vector, loop over <code>a</code>, return the vector.',
      'Only push when <code>x % 2 != 0</code>.',
    ],
    starter: `vector<int> oddSquares(const vector<int>& a) {
    return {};
}`,
    solution: `vector<int> oddSquares(const vector<int>& a) {
    vector<int> out;
    for (int x : a) {
        if (x % 2 != 0) out.push_back(x * x);
    }
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    if (t == 1) a = {1, 2, 3, 4, 5};
    if (t == 2) a = {};
    if (t == 3) a = {2, 4, 6};
    if (t == 4) a = {-3, 7};
    if (t == 5) a = {10, 11, 12, 13, 14, 15};
    if (t == 6) a = {5};
    vector<int> r = oddSquares(a);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < r.size(); i++) cout << (i ? " " : "") << r[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Mixed', stdin: '1', input: '1 2 3 4 5', expected: '1 9 25' },
      { name: 'Empty', stdin: '2', input: '(empty)', expected: '' },
      { name: 'All even', stdin: '3', input: '2 4 6', expected: '' },
      { name: 'Negative odd', stdin: '4', input: '-3 7', expected: '9 49' },
      { name: 'Longer', stdin: '5', input: '10 11 12 13 14 15', expected: '121 169 225' },
      { name: 'One value', stdin: '6', input: '5', expected: '25' },
    ],
  },
  {
    id: 's4-sort-lambda',
    title: 'sort with a lambda',
    kind: 'drill',
    task: 'Sort the players by <code>score</code> descending. Players with equal scores go in <code>name</code> ascending order. Pass a lambda to <code>sort</code>.',
    example: { input: 'zed 80, amy 80, max 90', output: 'max:90 amy:80 zed:80' },
    refresher: [
      '<code>sort(v.begin(), v.end(), [](const Player&amp; a, const Player&amp; b) { return ...; });</code>',
      'The lambda returns true when <code>a</code> must come before <code>b</code>. Check the tie-break only when the main keys are equal.',
    ],
    hints: [
      'Compare scores first: if they differ, return <code>a.score &gt; b.score</code>.',
      'If the scores are equal, fall through to <code>a.name &lt; b.name</code>.',
      'Never use <code>&lt;=</code> in a comparator.',
    ],
    starter: `struct Player {
    string name;
    int score;
};

void rankPlayers(vector<Player>& v) {

}`,
    solution: `struct Player {
    string name;
    int score;
};

void rankPlayers(vector<Player>& v) {
    sort(v.begin(), v.end(), [](const Player& a, const Player& b) {
        if (a.score != b.score) return a.score > b.score;
        return a.name < b.name;
    });
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<Player> v;
    if (t == 1) v = {{"ann", 50}, {"bob", 70}, {"cy", 60}};
    if (t == 2) v = {{"zed", 80}, {"amy", 80}, {"max", 90}};
    if (t == 3) v = {};
    if (t == 4) v = {{"solo", 1}};
    if (t == 5) v = {{"c", 5}, {"a", 5}, {"b", 5}};
    if (t == 6) v = {{"dan", -1}, {"eve", 0}, {"fay", -1}};
    rankPlayers(v);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i].name << ":" << v[i].score;
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Distinct scores', stdin: '1', input: 'ann 50, bob 70, cy 60', expected: 'bob:70 cy:60 ann:50' },
      { name: 'Tie on top', stdin: '2', input: 'zed 80, amy 80, max 90', expected: 'max:90 amy:80 zed:80' },
      { name: 'Empty', stdin: '3', input: '(empty)', expected: '' },
      { name: 'One player', stdin: '4', input: 'solo 1', expected: 'solo:1' },
      { name: 'All tied', stdin: '5', input: 'c 5, a 5, b 5', expected: 'a:5 b:5 c:5' },
      { name: 'Negative scores', stdin: '6', input: 'dan -1, eve 0, fay -1', expected: 'eve:0 dan:-1 fay:-1' },
    ],
  },
  {
    id: 's4-pair-tuple',
    title: 'pair and tuple',
    kind: 'drill',
    task: 'Write <code>stats</code>, returning <code>(min, max, sum)</code> of a non-empty vector as a <code>tuple</code>, and <code>best</code>, returning the <code>pair</code> with the largest <code>.second</code> (the earliest on a tie).',
    example: { input: '4 -2 9 1', output: '-2 9 12' },
    refresher: [
      '<code>pair&lt;string,int&gt; p = make_pair("a", 3);</code> read with <code>p.first</code>, <code>p.second</code>.',
      '<code>tuple&lt;int,int,int&gt; t = make_tuple(1, 2, 3);</code> read with <code>get&lt;0&gt;(t)</code>. Unpack with <code>tie(a, b, c) = t;</code>.',
    ],
    hints: [
      'Track <code>lo</code>, <code>hi</code>, <code>sum</code> in a loop and finish with <code>return make_tuple(lo, hi, sum);</code>.',
      'For <code>best</code>, keep a copy of the best pair so far. Replace it only on a strictly greater <code>.second</code>.',
    ],
    starter: `#include <tuple>

tuple<int, int, int> stats(const vector<int>& a) {
    return make_tuple(0, 0, 0);
}

pair<string, int> best(const vector<pair<string, int>>& v) {
    return make_pair(string(), 0);
}`,
    solution: `#include <tuple>

tuple<int, int, int> stats(const vector<int>& a) {
    int lo = a[0], hi = a[0], sum = 0;
    for (int x : a) {
        lo = min(lo, x);
        hi = max(hi, x);
        sum += x;
    }
    return make_tuple(lo, hi, sum);
}

pair<string, int> best(const vector<pair<string, int>>& v) {
    pair<string, int> top = v[0];
    for (const auto& p : v) {
        if (p.second > top.second) top = p;
    }
    return top;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    vector<pair<string, int>> p;
    if (t == 1) { a = {4, -2, 9, 1}; p = {{"ann", 3}, {"bob", 8}, {"cy", 5}}; }
    if (t == 2) { a = {7}; p = {{"x", 1}}; }
    if (t == 3) { a = {5, 5, 5}; p = {{"m", 4}, {"n", 4}}; }
    if (t == 4) { a = {-3, -8, -1}; p = {{"neg", -5}, {"less", -2}}; }
    if (t == 5) { a = {100, 0, 50}; p = {{"a", 1}, {"b", 2}, {"c", 3}, {"d", 3}}; }
    tuple<int, int, int> s = stats(a);
    pair<string, int> b = best(p);
    cout << "\\n@@RESULT@@\\n";
    cout << get<0>(s) << " " << get<1>(s) << " " << get<2>(s) << "\\n";
    cout << b.first << " " << b.second << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Mixed', stdin: '1', input: 'a = 4 -2 9 1; ann 3, bob 8, cy 5', expected: '-2 9 12\nbob 8' },
      { name: 'One element', stdin: '2', input: 'a = 7; x 1', expected: '7 7 7\nx 1' },
      { name: 'Ties', stdin: '3', input: 'a = 5 5 5; m 4, n 4', expected: '5 5 15\nm 4' },
      { name: 'All negative', stdin: '4', input: 'a = -3 -8 -1; neg -5, less -2', expected: '-8 -1 -12\nless -2' },
      { name: 'Tie at the max', stdin: '5', input: 'a = 100 0 50; a 1, b 2, c 3, d 3', expected: '0 100 150\nc 3' },
    ],
  },
  {
    id: 's4-string-tools',
    title: 'string tools',
    kind: 'drill',
    task: 'Given a string like <code>"count=41"</code>, return it with the number increased by one (<code>"count=42"</code>). Use <code>find</code>, <code>substr</code>, <code>stoi</code> and <code>to_string</code>.',
    example: { input: 'x=-5', output: 'x=-4' },
    refresher: [
      '<code>size_t p = s.find(\'=\');</code> returns the index, or <code>string::npos</code> when absent.',
      '<code>s.substr(pos, len)</code>; <code>s.substr(pos)</code> runs to the end. <code>stoi(str)</code> parses an int, <code>to_string(n)</code> prints one.',
    ],
    hints: [
      'The key is <code>s.substr(0, p)</code> and the number text is <code>s.substr(p + 1)</code>.',
      'Rebuild with <code>key + "=" + to_string(value + 1)</code>.',
    ],
    starter: `string increment(const string& s) {
    return s;
}`,
    solution: `string increment(const string& s) {
    size_t p = s.find('=');
    string key = s.substr(0, p);
    int value = stoi(s.substr(p + 1));
    return key + "=" + to_string(value + 1);
}`,
    harness: `int main() {
    int t; cin >> t;
    string s;
    if (t == 1) s = "count=41";
    if (t == 2) s = "x=-5";
    if (t == 3) s = "n=9";
    if (t == 4) s = "total=99";
    if (t == 5) s = "a=0";
    if (t == 6) s = "long_key_name=1000";
    cout << "\\n@@RESULT@@\\n" << increment(s) << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Plain', stdin: '1', input: 'count=41', expected: 'count=42' },
      { name: 'Negative', stdin: '2', input: 'x=-5', expected: 'x=-4' },
      { name: 'One to two digits', stdin: '3', input: 'n=9', expected: 'n=10' },
      { name: 'Two to three digits', stdin: '4', input: 'total=99', expected: 'total=100' },
      { name: 'Zero', stdin: '5', input: 'a=0', expected: 'a=1' },
      { name: 'Long key', stdin: '6', input: 'long_key_name=1000', expected: 'long_key_name=1001' },
    ],
  },
  {
    id: 's4-set',
    title: 'set',
    kind: 'drill',
    task: 'Return the distinct values of <code>a</code> in ascending order. Let a <code>set&lt;int&gt;</code> do the work: no <code>sort</code> or <code>unique</code>.',
    example: { input: '3 1 3 2 1', output: '1 2 3' },
    refresher: [
      '<code>set&lt;int&gt; s;</code> <code>s.insert(x);</code> ignores duplicates. <code>s.count(x)</code> is 0 or 1; <code>s.find(x) != s.end()</code> also tests membership.',
      'Iterating a set visits values in ascending order. Build a vector from it with <code>vector&lt;int&gt;(s.begin(), s.end())</code>.',
    ],
    hints: [
      'Insert every value of <code>a</code> into a set.',
      'Return a vector built from the set\'s two iterators.',
    ],
    forbidden: [{ pattern: '\\b(sort|unique|stable_sort)\\s*\\(', message: 'Let the set order and deduplicate: do not call sort or unique here.' }],
    starter: `vector<int> distinctSorted(const vector<int>& a) {
    return {};
}`,
    solution: `vector<int> distinctSorted(const vector<int>& a) {
    set<int> s;
    for (int x : a) s.insert(x);
    return vector<int>(s.begin(), s.end());
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    if (t == 1) a = {3, 1, 3, 2, 1};
    if (t == 2) a = {};
    if (t == 3) a = {5, 5, 5};
    if (t == 4) a = {-1, 0, -1, 10, -5};
    if (t == 5) a = {9};
    if (t == 6) a = {4, 3, 2, 1};
    vector<int> r = distinctSorted(a);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < r.size(); i++) cout << (i ? " " : "") << r[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Duplicates', stdin: '1', input: '3 1 3 2 1', expected: '1 2 3' },
      { name: 'Empty', stdin: '2', input: '(empty)', expected: '' },
      { name: 'All the same', stdin: '3', input: '5 5 5', expected: '5' },
      { name: 'Negatives', stdin: '4', input: '-1 0 -1 10 -5', expected: '-5 -1 0 10' },
      { name: 'One value', stdin: '5', input: '9', expected: '9' },
      { name: 'Descending', stdin: '6', input: '4 3 2 1', expected: '1 2 3 4' },
    ],
  },
  {
    id: 's4-multiset',
    title: 'multiset',
    kind: 'drill',
    task: 'Write <code>removeOne</code> (erase a single occurrence of <code>x</code>, if present) and <code>removeAll</code> (erase every occurrence). Load a <code>multiset</code> from <code>a</code> and return it as a sorted vector.',
    example: { input: 'a = 2 5 2 7 2, x = 2', output: 'one: 2 2 5 7\nall: 5 7' },
    refresher: [
      '<code>ms.erase(x)</code> removes <em>all</em> copies of <code>x</code>. <code>ms.erase(it)</code> removes just the one the iterator points at.',
      '<code>auto it = ms.find(x);</code> gives <code>ms.end()</code> when absent. Never erase <code>end()</code>.',
    ],
    hints: [
      '<code>removeAll</code> is a single <code>erase(x)</code> call.',
      'For <code>removeOne</code>, call <code>find(x)</code> and erase only if the result is not <code>end()</code>.',
    ],
    starter: `vector<int> removeOne(const vector<int>& a, int x) {
    return {};
}

vector<int> removeAll(const vector<int>& a, int x) {
    return {};
}`,
    solution: `vector<int> removeOne(const vector<int>& a, int x) {
    multiset<int> ms(a.begin(), a.end());
    multiset<int>::iterator it = ms.find(x);
    if (it != ms.end()) ms.erase(it);
    return vector<int>(ms.begin(), ms.end());
}

vector<int> removeAll(const vector<int>& a, int x) {
    multiset<int> ms(a.begin(), a.end());
    ms.erase(x);
    return vector<int>(ms.begin(), ms.end());
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    int x = 0;
    if (t == 1) { a = {2, 5, 2, 7, 2}; x = 2; }
    if (t == 2) { a = {1, 2, 3}; x = 9; }
    if (t == 3) { a = {4, 4}; x = 4; }
    if (t == 4) { a = {}; x = 1; }
    if (t == 5) { a = {3, 1, 3, 2}; x = 1; }
    if (t == 6) { a = {5, 5, 5, 6, 5}; x = 5; }
    vector<int> one = removeOne(a, x), all = removeAll(a, x);
    cout << "\\n@@RESULT@@\\n";
    cout << "one:";
    for (size_t i = 0; i < one.size(); i++) cout << " " << one[i];
    cout << "\\nall:";
    for (size_t i = 0; i < all.size(); i++) cout << " " << all[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Three copies', stdin: '1', input: 'a = 2 5 2 7 2, x = 2', expected: 'one: 2 2 5 7\nall: 5 7' },
      { name: 'Value absent', stdin: '2', input: 'a = 1 2 3, x = 9', expected: 'one: 1 2 3\nall: 1 2 3' },
      { name: 'Everything removed', stdin: '3', input: 'a = 4 4, x = 4', expected: 'one: 4\nall:' },
      { name: 'Empty', stdin: '4', input: 'a = (empty), x = 1', expected: 'one:\nall:' },
      { name: 'Single copy', stdin: '5', input: 'a = 3 1 3 2, x = 1', expected: 'one: 2 3 3\nall: 2 3 3' },
      { name: 'Four copies', stdin: '6', input: 'a = 5 5 5 6 5, x = 5', expected: 'one: 5 5 5 6\nall: 6' },
    ],
  },
  {
    id: 's4-map',
    title: 'map',
    kind: 'drill',
    task: 'Count how often each word appears. Return one <code>"word=count"</code> string per distinct word, in alphabetical order. Use a <code>map&lt;string,int&gt;</code>.',
    example: { input: 'pear apple pear', output: 'apple=1\npear=2' },
    refresher: [
      '<code>map&lt;string,int&gt; m;</code> <code>m[w]++;</code> creates a missing key as 0 first.',
      'Iterate in key order: <code>for (const auto&amp; kv : m)</code> with <code>kv.first</code> and <code>kv.second</code>.',
    ],
    hints: [
      'First loop: <code>m[w]++</code> for each word.',
      'Second loop over <code>m</code>: push <code>kv.first + "=" + to_string(kv.second)</code>.',
    ],
    starter: `vector<string> wordCounts(const vector<string>& words) {
    return {};
}`,
    solution: `vector<string> wordCounts(const vector<string>& words) {
    map<string, int> m;
    for (const string& w : words) m[w]++;
    vector<string> out;
    for (const auto& kv : m) {
        out.push_back(kv.first + "=" + to_string(kv.second));
    }
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<string> w;
    if (t == 1) w = {"pear", "apple", "pear", "fig", "apple", "pear"};
    if (t == 2) w = {};
    if (t == 3) w = {"a"};
    if (t == 4) w = {"b", "a", "B", "a"};
    if (t == 5) w = {"x", "x", "x"};
    if (t == 6) w = {"to", "be", "or", "not", "to", "be"};
    vector<string> r = wordCounts(w);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < r.size(); i++) cout << r[i] << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Fruit', stdin: '1', input: 'pear apple pear fig apple pear', expected: 'apple=2\nfig=1\npear=3' },
      { name: 'Empty', stdin: '2', input: '(empty)', expected: '' },
      { name: 'One word', stdin: '3', input: 'a', expected: 'a=1' },
      { name: 'Uppercase sorts first', stdin: '4', input: 'b a B a', expected: 'B=1\na=2\nb=1' },
      { name: 'Same word', stdin: '5', input: 'x x x', expected: 'x=3' },
      { name: 'Sentence', stdin: '6', input: 'to be or not to be', expected: 'be=2\nnot=1\nor=1\nto=2' },
    ],
  },
  {
    id: 's4-unordered-map',
    title: 'unordered_map',
    kind: 'drill',
    task: 'Find the indices <code>i &lt; j</code> with <code>a[i] + a[j] == target</code> in one pass. Remember earlier values in an <code>unordered_map</code>. Return <code>{i, j}</code>, or <code>{}</code> if none.',
    example: { input: 'a = 2 7 11 15, target = 9', output: '0 1' },
    refresher: [
      '<code>unordered_map&lt;int,int&gt; seen;</code> <code>seen[v] = i;</code> stores, <code>seen.find(v)</code> or <code>seen.count(v)</code> looks up in O(1).',
      'For each <code>a[j]</code>, ask whether <code>target - a[j]</code> was seen at an earlier index, then record <code>a[j]</code>.',
    ],
    hints: [
      'Check for the complement before inserting the current value. That stops an element pairing with itself.',
      '<code>auto it = seen.find(target - a[j]);</code> then <code>return {it-&gt;second, j};</code> when <code>it != seen.end()</code>.',
    ],
    starter: `vector<int> twoSum(const vector<int>& a, int target) {
    return {};
}`,
    solution: `vector<int> twoSum(const vector<int>& a, int target) {
    unordered_map<int, int> seen;
    for (int j = 0; j < (int)a.size(); j++) {
        auto it = seen.find(target - a[j]);
        if (it != seen.end()) return {it->second, j};
        seen[a[j]] = j;
    }
    return {};
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    int target = 0;
    if (t == 1) { a = {2, 7, 11, 15}; target = 9; }
    if (t == 2) { a = {3, 2, 4}; target = 6; }
    if (t == 3) { a = {3, 3}; target = 6; }
    if (t == 4) { a = {1, 2, 3}; target = 100; }
    if (t == 5) { a = {-1, -2, -3, -4, -5}; target = -8; }
    if (t == 6) { a = {}; target = 0; }
    if (t == 7) { a = {5}; target = 10; }
    vector<int> r = twoSum(a, target);
    cout << "\\n@@RESULT@@\\n";
    if (r.size() == 2) cout << r[0] << " " << r[1] << "\\n";
    else cout << "none\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: 'a = 2 7 11 15, target = 9', expected: '0 1' },
      { name: 'Middle and end', stdin: '2', input: 'a = 3 2 4, target = 6', expected: '1 2' },
      { name: 'Equal values', stdin: '3', input: 'a = 3 3, target = 6', expected: '0 1' },
      { name: 'No pair', stdin: '4', input: 'a = 1 2 3, target = 100', expected: 'none' },
      { name: 'Negatives', stdin: '5', input: 'a = -1 -2 -3 -4 -5, target = -8', expected: '2 4' },
      { name: 'Empty', stdin: '6', input: 'a = (empty), target = 0', expected: 'none' },
      { name: 'Cannot reuse an element', stdin: '7', input: 'a = 5, target = 10', expected: 'none' },
    ],
  },
  {
    id: 's4-stack-queue',
    title: 'stack and queue',
    kind: 'drill',
    task: 'Return whether a string of <code>()[]{}</code> is balanced: every bracket closes in the right order. Use a <code>stack&lt;char&gt;</code>.',
    example: { input: '([]{})', output: 'true' },
    refresher: [
      '<code>stack&lt;char&gt; st;</code> <code>st.push(c)</code>, <code>st.top()</code>, <code>st.pop()</code> (returns nothing), <code>st.empty()</code>.',
      '<code>queue&lt;T&gt;</code> is the same idea with <code>push</code>, <code>front()</code>, <code>pop()</code>. Calling <code>top()</code> on an empty stack is undefined, so test <code>empty()</code> first.',
    ],
    hints: [
      'Push every opening bracket.',
      'On a closing bracket, the stack must be non-empty and its top must be the matching opener. Pop it.',
      'At the end the stack must be empty.',
    ],
    starter: `bool balanced(const string& s) {
    return false;
}`,
    solution: `bool balanced(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char open = st.top();
            st.pop();
            if (c == ')' && open != '(') return false;
            if (c == ']' && open != '[') return false;
            if (c == '}' && open != '{') return false;
        }
    }
    return st.empty();
}`,
    harness: `int main() {
    int t; cin >> t;
    string s;
    if (t == 1) s = "()";
    if (t == 2) s = "([]{})";
    if (t == 3) s = "(]";
    if (t == 4) s = "";
    if (t == 5) s = "((";
    if (t == 6) s = "())";
    if (t == 7) s = "{[()]}";
    if (t == 8) s = "}{";
    cout << "\\n@@RESULT@@\\n" << (balanced(s) ? "true" : "false") << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Simple pair', stdin: '1', input: '()', expected: 'true' },
      { name: 'Mixed and nested', stdin: '2', input: '([]{})', expected: 'true' },
      { name: 'Wrong closer', stdin: '3', input: '(]', expected: 'false' },
      { name: 'Empty', stdin: '4', input: '(empty)', expected: 'true' },
      { name: 'Never closed', stdin: '5', input: '((', expected: 'false' },
      { name: 'Extra closer', stdin: '6', input: '())', expected: 'false' },
      { name: 'Deep nesting', stdin: '7', input: '{[()]}', expected: 'true' },
      { name: 'Closer first', stdin: '8', input: '}{', expected: 'false' },
    ],
  },
  {
    id: 's4-deque',
    title: 'deque',
    kind: 'drill',
    task: 'Check whether a string is a palindrome, ignoring case and any non-alphanumeric characters. Load the cleaned characters into a <code>deque&lt;char&gt;</code> and compare <code>front()</code> with <code>back()</code>.',
    example: { input: 'No lemon, no melon', output: 'true' },
    refresher: [
      '<code>deque&lt;char&gt; d;</code> <code>d.push_back(c)</code>, <code>d.push_front(c)</code>, <code>d.front()</code>, <code>d.back()</code>, <code>d.pop_front()</code>, <code>d.pop_back()</code>.',
      '<code>isalnum(c)</code> and <code>tolower(c)</code> clean characters. Loop while <code>d.size() &gt; 1</code>.',
    ],
    hints: [
      'First pass: push <code>tolower(c)</code> for each <code>c</code> where <code>isalnum(c)</code>.',
      'Second pass: while two or more remain, compare the ends, return false on a mismatch, then pop both.',
    ],
    forbidden: [{ pattern: '\\b(reverse|rbegin|equal)\\b', message: 'Use the deque ends: compare front() and back(), then pop both.' }],
    starter: `bool isPalindrome(const string& s) {
    return false;
}`,
    solution: `bool isPalindrome(const string& s) {
    deque<char> d;
    for (char c : s) {
        if (isalnum((unsigned char)c)) d.push_back(tolower((unsigned char)c));
    }
    while (d.size() > 1) {
        if (d.front() != d.back()) return false;
        d.pop_front();
        d.pop_back();
    }
    return true;
}`,
    harness: `int main() {
    int t; cin >> t;
    string s;
    if (t == 1) s = "racecar";
    if (t == 2) s = "A man, a plan, a canal: Panama";
    if (t == 3) s = "hello";
    if (t == 4) s = "";
    if (t == 5) s = "ab";
    if (t == 6) s = "No lemon, no melon";
    if (t == 7) s = "a.";
    cout << "\\n@@RESULT@@\\n" << (isPalindrome(s) ? "true" : "false") << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Odd length', stdin: '1', input: 'racecar', expected: 'true' },
      { name: 'Punctuation and case', stdin: '2', input: 'A man, a plan, a canal: Panama', expected: 'true' },
      { name: 'Not a palindrome', stdin: '3', input: 'hello', expected: 'false' },
      { name: 'Empty', stdin: '4', input: '(empty)', expected: 'true' },
      { name: 'Two letters', stdin: '5', input: 'ab', expected: 'false' },
      { name: 'Spaces and commas', stdin: '6', input: 'No lemon, no melon', expected: 'true' },
      { name: 'Trailing punctuation', stdin: '7', input: 'a.', expected: 'true' },
    ],
  },
  {
    id: 's4-priority-queue',
    title: 'priority_queue',
    kind: 'drill',
    task: 'Return the <code>k</code> largest values of <code>a</code> in descending order, using a <code>priority_queue&lt;int&gt;</code>. Keep <code>k</code> at most <code>a.size()</code>.',
    example: { input: 'a = 3 1 4 1 5 9 2 6, k = 3', output: '9 6 5' },
    refresher: [
      '<code>priority_queue&lt;int&gt; pq;</code> is a max-heap: <code>pq.push(x)</code>, <code>pq.top()</code> is the largest, <code>pq.pop()</code> removes it (returns nothing).',
      'Also <code>pq.empty()</code> and <code>pq.size()</code>. Duplicates are kept.',
    ],
    hints: [
      'Push every value of <code>a</code>.',
      'Pop <code>k</code> times, saving <code>top()</code> into the answer before each <code>pop()</code>.',
    ],
    forbidden: [{ pattern: '\\b(sort|stable_sort|partial_sort|nth_element|make_heap|sort_heap)\\s*\\(', message: 'Use a priority_queue instead of sorting or the heap algorithms.' }],
    starter: `vector<int> kLargest(const vector<int>& a, int k) {
    return {};
}`,
    solution: `vector<int> kLargest(const vector<int>& a, int k) {
    priority_queue<int> pq;
    for (int x : a) pq.push(x);
    vector<int> out;
    for (int i = 0; i < k; i++) {
        out.push_back(pq.top());
        pq.pop();
    }
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    int k = 0;
    if (t == 1) { a = {3, 1, 4, 1, 5, 9, 2, 6}; k = 3; }
    if (t == 2) { a = {5, 5, 5}; k = 2; }
    if (t == 3) { a = {1, 2}; k = 0; }
    if (t == 4) { a = {7}; k = 1; }
    if (t == 5) { a = {2, 8, 8, 1}; k = 3; }
    if (t == 6) { a = {-5, -1, -9}; k = 2; }
    if (t == 7) { a = {4, 3, 2, 1}; k = 4; }
    vector<int> r = kLargest(a, k);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < r.size(); i++) cout << (i ? " " : "") << r[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: 'a = 3 1 4 1 5 9 2 6, k = 3', expected: '9 6 5' },
      { name: 'All equal', stdin: '2', input: 'a = 5 5 5, k = 2', expected: '5 5' },
      { name: 'k is zero', stdin: '3', input: 'a = 1 2, k = 0', expected: '' },
      { name: 'One value', stdin: '4', input: 'a = 7, k = 1', expected: '7' },
      { name: 'Duplicates at the top', stdin: '5', input: 'a = 2 8 8 1, k = 3', expected: '8 8 2' },
      { name: 'Negatives', stdin: '6', input: 'a = -5 -1 -9, k = 2', expected: '-1 -5' },
      { name: 'k equals size', stdin: '7', input: 'a = 4 3 2 1, k = 4', expected: '4 3 2 1' },
    ],
  },
]
