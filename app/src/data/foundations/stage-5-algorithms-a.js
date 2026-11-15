// Lessons for this stage. Format: docs/superpowers/specs/2026-11-15-foundations-track-design.md
export const LESSONS = [
  {
    id: 's5-subsets',
    title: 'Subsets',
    kind: 'implement',
    task: 'Return every subset of <code>nums</code> (distinct integers), including the empty one. Order does not matter, inside a subset or between subsets.',
    example: { input: '[1, 2]', output: '[] [1] [2] [1 2]' },
    refresher: [
      'Backtracking: for each element make a choice, recurse, then undo the choice.',
      'Here the choice is take it or skip it. At the end of the array, record the current subset.',
    ],
    hints: [
      'Recurse on an index <code>i</code> with a shared <code>cur</code> vector. Base case: <code>i == n</code>.',
      'Skip <code>nums[i]</code> and recurse. Then <code>push_back</code> it, recurse, and <code>pop_back</code>.',
    ],
    starter: `vector<vector<int>> subsets(vector<int> nums) {
    return {};
}`,
    solution: `void go(const vector<int>& nums, int i, vector<int>& cur, vector<vector<int>>& out) {
    if (i == (int)nums.size()) {
        out.push_back(cur);
        return;
    }
    go(nums, i + 1, cur, out);
    cur.push_back(nums[i]);
    go(nums, i + 1, cur, out);
    cur.pop_back();
}

vector<vector<int>> subsets(vector<int> nums) {
    vector<vector<int>> out;
    vector<int> cur;
    go(nums, 0, cur, out);
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    if (t == 1) a = {1, 2, 3};
    if (t == 2) a = {};
    if (t == 3) a = {5};
    if (t == 4) a = {-1, 4};
    if (t == 5) for (int i = 1; i <= 16; i++) a.push_back(i);
    vector<vector<int>> r = subsets(a);
    for (size_t i = 0; i < r.size(); i++) sort(r[i].begin(), r[i].end());
    sort(r.begin(), r.end());
    cout << "\\n@@RESULT@@\\n";
    if (t == 5) {
        long long total = 0;
        for (size_t i = 0; i < r.size(); i++) for (size_t j = 0; j < r[i].size(); j++) total += r[i][j];
        cout << r.size() << " " << total << "\\n";
        return 0;
    }
    for (size_t i = 0; i < r.size(); i++) {
        cout << "[";
        for (size_t j = 0; j < r[i].size(); j++) cout << (j ? " " : "") << r[i][j];
        cout << "]\\n";
    }
    return 0;
}`,
    tests: [
      { name: 'Three values', stdin: '1', input: '[1, 2, 3]', expected: '[]\n[1]\n[1 2]\n[1 2 3]\n[1 3]\n[2]\n[2 3]\n[3]' },
      { name: 'Empty input', stdin: '2', input: '[]', expected: '[]' },
      { name: 'One value', stdin: '3', input: '[5]', expected: '[]\n[5]' },
      { name: 'Negative value', stdin: '4', input: '[-1, 4]', expected: '[]\n[-1]\n[-1 4]\n[4]' },
      { name: 'Sixteen values', stdin: '5', input: '1..16 (count and element total)', expected: '65536 4456448' },
    ],
  },
  {
    id: 's5-permutations',
    title: 'Permutations',
    kind: 'implement',
    task: 'Return every permutation of <code>nums</code> (distinct integers, at least one). Any order is accepted. <code>next_permutation</code> is off the table.',
    example: { input: '[1, 2, 3]', output: '123 132 213 231 312 321' },
    refresher: [
      'Build the permutation one slot at a time. At each slot try every value not yet used.',
      'Mark a value used, recurse, then unmark it. A permutation is complete when it has <code>n</code> values.',
    ],
    hints: [
      'Keep <code>cur</code> and a <code>vector&lt;bool&gt; used</code> the size of <code>nums</code>.',
      'Loop <code>i</code> over all indexes, skip the used ones, push <code>nums[i]</code>, recurse, undo both.',
    ],
    forbidden: [{ pattern: '\\bnext_permutation\\b', message: 'Write the recursion yourself: next_permutation is off the table.' }],
    starter: `vector<vector<int>> permute(vector<int> nums) {
    return {};
}`,
    solution: `void go(const vector<int>& nums, vector<bool>& used, vector<int>& cur, vector<vector<int>>& out) {
    if (cur.size() == nums.size()) {
        out.push_back(cur);
        return;
    }
    for (int i = 0; i < (int)nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        cur.push_back(nums[i]);
        go(nums, used, cur, out);
        cur.pop_back();
        used[i] = false;
    }
}

vector<vector<int>> permute(vector<int> nums) {
    vector<vector<int>> out;
    vector<bool> used(nums.size(), false);
    vector<int> cur;
    go(nums, used, cur, out);
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    if (t == 1) a = {1, 2, 3};
    if (t == 2) a = {4};
    if (t == 3) a = {2, 1};
    if (t == 4) a = {2, -1, 0};
    if (t == 5) for (int i = 1; i <= 8; i++) a.push_back(i * 3);
    vector<vector<int>> r = permute(a);
    sort(r.begin(), r.end());
    cout << "\\n@@RESULT@@\\n";
    if (t == 5) {
        vector<int> base = a;
        sort(base.begin(), base.end());
        bool ok = true;
        for (size_t i = 0; i < r.size(); i++) {
            vector<int> v = r[i];
            sort(v.begin(), v.end());
            if (v != base) ok = false;
            if (i > 0 && r[i] == r[i - 1]) ok = false;
        }
        cout << r.size() << " " << (ok ? "all valid and distinct" : "invalid") << "\\n";
        return 0;
    }
    for (size_t i = 0; i < r.size(); i++) {
        for (size_t j = 0; j < r[i].size(); j++) cout << (j ? " " : "") << r[i][j];
        cout << "\\n";
    }
    return 0;
}`,
    tests: [
      { name: 'Three values', stdin: '1', input: '[1, 2, 3]', expected: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1' },
      { name: 'One value', stdin: '2', input: '[4]', expected: '4' },
      { name: 'Two values', stdin: '3', input: '[2, 1]', expected: '1 2\n2 1' },
      { name: 'Negative and zero', stdin: '4', input: '[2, -1, 0]', expected: '-1 0 2\n-1 2 0\n0 -1 2\n0 2 -1\n2 -1 0\n2 0 -1' },
      { name: 'Eight values', stdin: '5', input: '8 distinct values (40 320 results)', expected: '40320 all valid and distinct' },
    ],
  },
  {
    id: 's5-n-queens',
    title: 'N-Queens',
    kind: 'implement',
    task: 'Return the number of ways to place <code>n</code> queens on an <code>n x n</code> board so that no two attack each other (same row, column or diagonal).',
    example: { input: 'n = 4', output: '2' },
    refresher: [
      'Place one queen per row. For each row try every column, recurse to the next row, then undo.',
      'Track taken columns and both diagonals: <code>r - c</code> is constant on one, <code>r + c</code> on the other.',
    ],
    hints: [
      'A row-by-row recursion means you never check rows. Only columns and the two diagonals can clash.',
      'Use three boolean arrays: <code>col[c]</code>, <code>d1[r + c]</code>, <code>d2[r - c + n - 1]</code>.',
      'When <code>row == n</code>, that is one solution: return 1 and sum the results of the recursive calls.',
    ],
    starter: `int totalQueens(int n) {
    return 0;
}`,
    solution: `int place(int n, int r, vector<bool>& col, vector<bool>& d1, vector<bool>& d2) {
    if (r == n) return 1;
    int count = 0;
    for (int c = 0; c < n; c++) {
        if (col[c] || d1[r + c] || d2[r - c + n - 1]) continue;
        col[c] = d1[r + c] = d2[r - c + n - 1] = true;
        count += place(n, r + 1, col, d1, d2);
        col[c] = d1[r + c] = d2[r - c + n - 1] = false;
    }
    return count;
}

int totalQueens(int n) {
    vector<bool> col(n, false), d1(2 * n, false), d2(2 * n, false);
    return place(n, 0, col, d1, d2);
}`,
    harness: `int main() {
    int n; cin >> n;
    int r = totalQueens(n);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'n = 1', stdin: '1', input: 'n = 1', expected: '1' },
      { name: 'n = 2 (none)', stdin: '2', input: 'n = 2', expected: '0' },
      { name: 'n = 3 (none)', stdin: '3', input: 'n = 3', expected: '0' },
      { name: 'n = 4', stdin: '4', input: 'n = 4', expected: '2' },
      { name: 'n = 6', stdin: '6', input: 'n = 6', expected: '4' },
      { name: 'n = 8', stdin: '8', input: 'n = 8', expected: '92' },
      { name: 'n = 9', stdin: '9', input: 'n = 9', expected: '352' },
    ],
  },
  {
    id: 's5-prefix-sums',
    title: 'Prefix sums',
    kind: 'implement',
    task: 'For each query <code>{l, r}</code> (inclusive, 0-based) return the sum of <code>a[l..r]</code>. Answer every query in O(1) after one pass over <code>a</code>. Sums need <code>long long</code>.',
    example: { input: 'a = [3 1 4 1 5], query {1, 3}', output: '6' },
    refresher: [
      '<code>pre[i]</code> = sum of the first <code>i</code> elements, so <code>pre[0] = 0</code>.',
      'Sum of <code>a[l..r]</code> = <code>pre[r + 1] - pre[l]</code>.',
    ],
    hints: [
      'Make <code>pre</code> with <code>n + 1</code> entries. The extra leading 0 removes the special case for <code>l = 0</code>.',
      'Accumulate into <code>long long</code>: five values of 10<sup>9</sup> already overflow <code>int</code>.',
    ],
    starter: `vector<long long> rangeSums(const vector<int>& a, const vector<pair<int, int>>& queries) {
    return vector<long long>(queries.size());
}`,
    solution: `vector<long long> rangeSums(const vector<int>& a, const vector<pair<int, int>>& queries) {
    vector<long long> pre(a.size() + 1, 0);
    for (size_t i = 0; i < a.size(); i++) pre[i + 1] = pre[i] + a[i];
    vector<long long> out;
    for (size_t i = 0; i < queries.size(); i++) out.push_back(pre[queries[i].second + 1] - pre[queries[i].first]);
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    vector<pair<int, int>> q;
    if (t == 1) { a = {3, 1, 4, 1, 5}; q = {{0, 4}, {1, 3}, {2, 2}, {0, 0}}; }
    if (t == 2) { a = {7}; q = {{0, 0}}; }
    if (t == 3) { a = {}; }
    if (t == 4) { a = {-5, 2, -3, 8}; q = {{0, 3}, {0, 1}, {2, 3}}; }
    if (t == 5) { a = {1000000000, 1000000000, 1000000000, 1000000000, 1000000000}; q = {{0, 4}, {1, 3}}; }
    unsigned x = 12345;
    auto next = [&]() { x = x * 1103515245u + 12345u; return (int)(x >> 8); };
    if (t == 6) {
        int n = 200000;
        for (int i = 0; i < n; i++) a.push_back(next() % 2001 - 1000);
        for (int i = 0; i < 200000; i++) {
            int l = next() % n, r = next() % n;
            if (l > r) swap(l, r);
            q.push_back({l, r});
        }
    }
    vector<long long> r = rangeSums(a, q);
    cout << "\\n@@RESULT@@\\n";
    if (t == 6) {
        long long total = 0, weighted = 0;
        for (size_t i = 0; i < r.size(); i++) { total += r[i]; weighted += r[i] * (long long)(i % 1000 + 1); }
        cout << r.size() << " " << total << " " << weighted << "\\n";
        return 0;
    }
    for (size_t i = 0; i < r.size(); i++) cout << (i ? " " : "") << r[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: 'a = 3 1 4 1 5; 4 queries', expected: '14 6 4 3' },
      { name: 'One element', stdin: '2', input: 'a = 7; query {0, 0}', expected: '7' },
      { name: 'No queries', stdin: '3', input: 'a = (empty); no queries', expected: '' },
      { name: 'Negative values', stdin: '4', input: 'a = -5 2 -3 8', expected: '2 -3 5' },
      { name: 'Too big for int', stdin: '5', input: 'five values of 1000000000', expected: '5000000000 3000000000' },
      { name: 'Large', stdin: '6', input: '200 000 values, 200 000 queries', expected: '200000 -49890471330 -24983086578757' },
    ],
  },
  {
    id: 's5-prefix-sums-2d',
    title: '2D prefix sums',
    kind: 'implement',
    task: 'For each query <code>{r1, c1, r2, c2}</code> (inclusive corners, 0-based) return the sum of that sub-rectangle of <code>g</code>. Build a 2D prefix table once; answer each query in O(1) with <code>long long</code>.',
    example: { input: 'g = [[1 2][3 4]], query {0, 1, 1, 1}', output: '6' },
    refresher: [
      '<code>P[i][j]</code> = sum of the rectangle from <code>(0,0)</code> up to but not including <code>(i,j)</code>. Fill with <code>P[i+1][j+1] = g + P[i][j+1] + P[i+1][j] - P[i][j]</code>.',
      'Query: <code>P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]</code>. The last term was subtracted twice.',
    ],
    hints: [
      'Make <code>P</code> of size <code>(rows + 1) x (cols + 1)</code> filled with 0 so the borders need no special cases.',
      'Draw the big rectangle, cut off the strip above and the strip to the left, then add back the corner both cuts removed.',
    ],
    starter: `vector<long long> rectSums(const vector<vector<int>>& g, const vector<vector<int>>& queries) {
    return vector<long long>(queries.size());
}`,
    solution: `vector<long long> rectSums(const vector<vector<int>>& g, const vector<vector<int>>& queries) {
    int rows = g.size(), cols = g.empty() ? 0 : g[0].size();
    vector<vector<long long>> P(rows + 1, vector<long long>(cols + 1, 0));
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            P[i + 1][j + 1] = g[i][j] + P[i][j + 1] + P[i + 1][j] - P[i][j];
    vector<long long> out;
    for (size_t k = 0; k < queries.size(); k++) {
        int r1 = queries[k][0], c1 = queries[k][1], r2 = queries[k][2], c2 = queries[k][3];
        out.push_back(P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]);
    }
    return out;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<vector<int>> g, q;
    if (t == 1) { g = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}; q = {{0, 0, 2, 2}, {1, 1, 2, 2}, {0, 1, 1, 2}, {1, 0, 1, 0}}; }
    if (t == 2) { g = {{5}}; q = {{0, 0, 0, 0}}; }
    if (t == 3) { g = {{1, 2, 3, 4}}; q = {{0, 1, 0, 2}, {0, 0, 0, 3}}; }
    if (t == 4) { g = {{-1, 2}, {3, -4}}; q = {{0, 0, 1, 1}, {0, 0, 0, 0}, {1, 1, 1, 1}, {0, 1, 1, 1}}; }
    if (t == 5) { g = vector<vector<int>>(3, vector<int>(3, 1000000000)); q = {{0, 0, 2, 2}, {1, 1, 2, 2}}; }
    unsigned x = 777;
    auto next = [&]() { x = x * 1103515245u + 12345u; return (int)(x >> 8); };
    if (t == 6) {
        int n = 1000;
        g = vector<vector<int>>(n, vector<int>(n));
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) g[i][j] = next() % 2001 - 1000;
        for (int k = 0; k < 100000; k++) {
            int r1 = next() % n, r2 = next() % n, c1 = next() % n, c2 = next() % n;
            if (r1 > r2) swap(r1, r2);
            if (c1 > c2) swap(c1, c2);
            q.push_back({r1, c1, r2, c2});
        }
    }
    vector<long long> r = rectSums(g, q);
    cout << "\\n@@RESULT@@\\n";
    if (t == 6) {
        long long total = 0, weighted = 0;
        for (size_t i = 0; i < r.size(); i++) { total += r[i]; weighted += r[i] * (long long)(i % 1000 + 1); }
        cout << r.size() << " " << total << " " << weighted << "\\n";
        return 0;
    }
    for (size_t i = 0; i < r.size(); i++) cout << (i ? " " : "") << r[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example grid', stdin: '1', input: '3x3 grid 1..9; 4 queries', expected: '45 28 16 4' },
      { name: 'One cell', stdin: '2', input: '1x1 grid {5}', expected: '5' },
      { name: 'Single row', stdin: '3', input: '1x4 grid 1 2 3 4', expected: '5 10' },
      { name: 'Negative values', stdin: '4', input: '2x2 grid -1 2 / 3 -4', expected: '0 -1 -4 -2' },
      { name: 'Too big for int', stdin: '5', input: '3x3 grid of 1000000000', expected: '9000000000 4000000000' },
      { name: 'Large', stdin: '6', input: '1000x1000 grid, 100 000 queries', expected: '100000 -8897894854 -4463161720357' },
    ],
  },
  {
    id: 's5-two-pointers',
    title: 'Two pointers',
    kind: 'implement',
    task: 'Given a sorted vector and a <code>target</code>, return indexes <code>{i, j}</code> with <code>i &lt; j</code> and <code>a[i] + a[j] == target</code>, or an empty vector if there is none. Any valid pair is accepted; aim for O(n).',
    example: { input: 'a = [1 3 4 6 9], target = 10', output: '{0, 4} or {2, 3}' },
    refresher: [
      'Put <code>lo</code> at the start and <code>hi</code> at the end. Look at <code>a[lo] + a[hi]</code>.',
      'Too small: only a bigger left value helps, so <code>lo++</code>. Too big: <code>hi--</code>. Stop when they meet.',
    ],
    hints: [
      'Loop while <code>lo &lt; hi</code>. An element may not pair with itself.',
      'Each step discards one index for good, which is why the whole scan is O(n).',
    ],
    starter: `vector<int> pairWithSum(const vector<int>& a, int target) {
    return {};
}`,
    solution: `vector<int> pairWithSum(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo < hi) {
        long long s = (long long)a[lo] + a[hi];
        if (s == target) return {lo, hi};
        if (s < target) lo++;
        else hi--;
    }
    return {};
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> a;
    int target = 0;
    if (t == 1) { a = {1, 3, 4, 6, 9}; target = 10; }
    if (t == 2) { a = {}; target = 5; }
    if (t == 3) { a = {3}; target = 6; }
    if (t == 4) { a = {1, 1, 1, 1}; target = 2; }
    if (t == 5) { a = {1, 3, 4}; target = 6; }
    if (t == 6) { a = {-8, -3, 0, 2, 5}; target = -3; }
    if (t == 7) { for (int i = 0; i < 300000; i++) a.push_back(2 * i); target = 599999; }
    if (t == 8) { for (int i = 0; i < 300000; i++) a.push_back(3 * i); target = 3 * 299998 + 3 * 299999; }
    vector<int> r = pairWithSum(a, target);
    cout << "\\n@@RESULT@@\\n";
    if (r.empty()) { cout << "none\\n"; return 0; }
    bool ok = r.size() == 2 && r[0] >= 0 && r[0] < r[1] && r[1] < (int)a.size() && (long long)a[r[0]] + a[r[1]] == target;
    cout << (ok ? "valid pair" : "invalid") << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: 'a = 1 3 4 6 9, target 10', expected: 'valid pair' },
      { name: 'Empty input', stdin: '2', input: 'a = (empty), target 5', expected: 'none' },
      { name: 'One element', stdin: '3', input: 'a = 3, target 6', expected: 'none' },
      { name: 'Duplicates', stdin: '4', input: 'a = 1 1 1 1, target 2', expected: 'valid pair' },
      { name: 'No reuse of one element', stdin: '5', input: 'a = 1 3 4, target 6', expected: 'none' },
      { name: 'Negative values', stdin: '6', input: 'a = -8 -3 0 2 5, target -3', expected: 'valid pair' },
      { name: 'Large, no pair', stdin: '7', input: '300 000 even numbers, odd target', expected: 'none' },
      { name: 'Large, pair at the far end', stdin: '8', input: '300 000 multiples of 3', expected: 'valid pair' },
    ],
  },
  {
    id: 's5-sliding-window',
    title: 'Sliding window',
    kind: 'implement',
    task: 'Return the length of the longest substring of <code>s</code> that contains no repeated character. Run in O(n).',
    example: { input: '"abcabcbb"', output: '3' },
    refresher: [
      'Keep a window <code>[left, right]</code> that is always valid. Grow <code>right</code> one step at a time.',
      'On a repeat, move <code>left</code> past the earlier copy. Record the window length after each step.',
    ],
    hints: [
      'Remember the last index where each character was seen, for example <code>vector&lt;int&gt; last(256, -1)</code>.',
      'If <code>last[c] &gt;= left</code>, set <code>left = last[c] + 1</code>. Never move <code>left</code> backwards: in <code>"abba"</code> the old index of <code>a</code> is stale.',
    ],
    starter: `int lengthOfLongestSubstring(const string& s) {
    return 0;
}`,
    solution: `int lengthOfLongestSubstring(const string& s) {
    vector<int> last(256, -1);
    int best = 0, left = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        unsigned char c = s[right];
        if (last[c] >= left) left = last[c] + 1;
        last[c] = right;
        best = max(best, right - left + 1);
    }
    return best;
}`,
    harness: `int main() {
    int t; cin >> t;
    string s;
    if (t == 1) s = "abcabcbb";
    if (t == 2) s = "";
    if (t == 3) s = "a";
    if (t == 4) s = "bbbbb";
    if (t == 5) s = "pwwkew";
    if (t == 6) s = "abba";
    if (t == 7) s = "tmmzuxt";
    if (t == 8) for (int i = 0; i < 1000000; i++) s += (char)('a' + i % 26);
    unsigned x = 4242;
    if (t == 9) for (int i = 0; i < 500000; i++) { x = x * 1103515245u + 12345u; s += (char)('a' + (x >> 8) % 26); }
    int r = lengthOfLongestSubstring(s);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: '"abcabcbb"', expected: '3' },
      { name: 'Empty string', stdin: '2', input: '""', expected: '0' },
      { name: 'One character', stdin: '3', input: '"a"', expected: '1' },
      { name: 'All the same', stdin: '4', input: '"bbbbb"', expected: '1' },
      { name: 'Repeat in the middle', stdin: '5', input: '"pwwkew"', expected: '3' },
      { name: 'Stale index', stdin: '6', input: '"abba"', expected: '2' },
      { name: 'Stale index, longer', stdin: '7', input: '"tmmzuxt"', expected: '5' },
      { name: 'Long repeating alphabet', stdin: '8', input: 'a..z repeated, 1 000 000 chars', expected: '26' },
      { name: 'Long random string', stdin: '9', input: '500 000 random letters', expected: '20' },
    ],
  },
  {
    id: 's5-binary-search-answer',
    title: 'Binary search on the answer',
    kind: 'implement',
    task: 'Packages with the given <code>weights</code> must ship in order within <code>days</code> days; each day carries at most <code>cap</code> weight. Return the smallest <code>cap</code> that works (as <code>long long</code>).',
    example: { input: 'weights = [1 2 3 4 5 6 7 8 9 10], days = 5', output: '15' },
    refresher: [
      'If capacity <code>c</code> works, any larger one does too. That monotone yes/no lets you binary search the answer itself.',
      'Write <code>feasible(c)</code> as one greedy pass: fill a day until the next package no longer fits, then start a new day.',
    ],
    hints: [
      'The answer lies between <code>max(weights)</code> (a package must fit) and <code>sum(weights)</code> (one day).',
      'Search <code>[lo, hi]</code>: if <code>feasible(mid)</code> then <code>hi = mid</code>, otherwise <code>lo = mid + 1</code>. Stop at <code>lo == hi</code>.',
    ],
    starter: `long long shipWithinDays(const vector<int>& weights, int days) {
    return 0;
}`,
    solution: `bool feasible(const vector<int>& weights, int days, long long cap) {
    int used = 1;
    long long load = 0;
    for (size_t i = 0; i < weights.size(); i++) {
        if (load + weights[i] > cap) {
            used++;
            load = 0;
        }
        load += weights[i];
    }
    return used <= days;
}

long long shipWithinDays(const vector<int>& weights, int days) {
    long long lo = 0, hi = 0;
    for (size_t i = 0; i < weights.size(); i++) {
        lo = max(lo, (long long)weights[i]);
        hi += weights[i];
    }
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (feasible(weights, days, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> w;
    int days = 1;
    if (t == 1) { w = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}; days = 5; }
    if (t == 2) { w = {3, 2, 2, 4, 1, 4}; days = 3; }
    if (t == 3) { w = {1, 2, 3, 1, 1}; days = 4; }
    if (t == 4) { w = {5}; days = 1; }
    if (t == 5) { w = {4, 4, 4}; days = 3; }
    if (t == 6) { w = {2, 9, 3}; days = 1; }
    unsigned x = 99;
    auto next = [&]() { x = x * 1103515245u + 12345u; return (int)(x >> 8); };
    if (t >= 7) for (int i = 0; i < 100000; i++) w.push_back(next() % 1000000 + 1);
    if (t == 7) days = 100;
    if (t == 8) days = 1;
    if (t == 9) days = 30000;
    long long r = shipWithinDays(w, days);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: '1..10, 5 days', expected: '15' },
      { name: 'Mixed weights', stdin: '2', input: '3 2 2 4 1 4, 3 days', expected: '6' },
      { name: 'Small weights, 4 days', stdin: '3', input: '1 2 3 1 1, 4 days', expected: '3' },
      { name: 'One package', stdin: '4', input: '5, 1 day', expected: '5' },
      { name: 'One package per day', stdin: '5', input: '4 4 4, 3 days', expected: '4' },
      { name: 'Everything in one day', stdin: '6', input: '2 9 3, 1 day', expected: '14' },
      { name: 'Large, 100 days', stdin: '7', input: '100 000 weights up to 1e6', expected: '494236044' },
      { name: 'Large, 1 day (sum over int)', stdin: '8', input: '100 000 weights up to 1e6', expected: '49390899229' },
      { name: 'Large, 30 000 days', stdin: '9', input: '100 000 weights up to 1e6', expected: '1966327' },
    ],
  },
  {
    id: 's5-bfs-grid',
    title: 'BFS on a grid',
    kind: 'implement',
    task: 'In a grid of 0 (open) and 1 (wall), return the fewest moves from the top-left to the bottom-right cell using up, down, left, right. Return -1 if it is unreachable.',
    example: { input: '[[0 0][1 0]]', output: '2' },
    refresher: [
      'BFS visits cells in order of distance. Queue the start with distance 0, mark cells visited when you <b>push</b> them.',
      'Pop a cell, try its 4 neighbours with <code>dr[]</code>/<code>dc[]</code>, skip out-of-bounds, walls and visited cells.',
    ],
    hints: [
      'Check the start and end cells first: a wall on either means -1. A 1x1 open grid needs 0 moves.',
      'Keep a <code>dist</code> grid filled with -1. It doubles as the visited set: <code>dist[nr][nc] = dist[r][c] + 1</code>.',
    ],
    starter: `int shortestPath(const vector<vector<int>>& grid) {
    return 0;
}`,
    solution: `int shortestPath(const vector<vector<int>>& grid) {
    int R = grid.size(), C = grid[0].size();
    if (grid[0][0] == 1 || grid[R - 1][C - 1] == 1) return -1;
    vector<vector<int>> dist(R, vector<int>(C, -1));
    queue<pair<int, int>> q;
    dist[0][0] = 0;
    q.push({0, 0});
    int dr[4] = {1, -1, 0, 0};
    int dc[4] = {0, 0, 1, -1};
    while (!q.empty()) {
        int r = q.front().first, c = q.front().second;
        q.pop();
        if (r == R - 1 && c == C - 1) return dist[r][c];
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            if (grid[nr][nc] == 1 || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;
            q.push({nr, nc});
        }
    }
    return -1;
}`,
    harness: `vector<vector<int>> parseGrid(const vector<string>& rows) {
    vector<vector<int>> g;
    for (size_t i = 0; i < rows.size(); i++) {
        vector<int> row;
        for (size_t j = 0; j < rows[i].size(); j++) row.push_back(rows[i][j] - '0');
        g.push_back(row);
    }
    return g;
}

int main() {
    int t; cin >> t;
    vector<vector<int>> g;
    if (t == 1) g = parseGrid({"000", "000", "000"});
    if (t == 2) g = parseGrid({"0"});
    if (t == 3) g = parseGrid({"1"});
    if (t == 4) g = parseGrid({"010", "010", "010"});
    if (t == 5) g = parseGrid({"00000", "11110", "00000", "01111", "00000"});
    if (t == 6) g = parseGrid({"00", "01"});
    if (t == 7) g = parseGrid({"0011", "1011", "0000"});
    if (t == 8) {
        int n = 601;
        g = vector<vector<int>>(n, vector<int>(n, 0));
        for (int i = 1; i < n; i += 2) {
            for (int j = 0; j < n; j++) g[i][j] = 1;
            g[i][(i / 2) % 2 == 0 ? n - 1 : 0] = 0;
        }
    }
    if (t == 9) {
        int n = 1000;
        unsigned x = 31337;
        g = vector<vector<int>>(n, vector<int>(n, 0));
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) { x = x * 1103515245u + 12345u; g[i][j] = ((x >> 8) % 100 < 20) ? 1 : 0; }
        g[0][0] = 0; g[n - 1][n - 1] = 0;
    }
    int r = shortestPath(g);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Open 3x3', stdin: '1', input: '3x3, no walls', expected: '4' },
      { name: 'Single open cell', stdin: '2', input: '1x1 open', expected: '0' },
      { name: 'Single wall cell', stdin: '3', input: '1x1 wall', expected: '-1' },
      { name: 'Wall column blocks the way', stdin: '4', input: '3x3, middle column walled', expected: '-1' },
      { name: 'Snake corridor', stdin: '5', input: '5x5 with long detour', expected: '16' },
      { name: 'Blocked goal', stdin: '6', input: '2x2, bottom-right is a wall', expected: '-1' },
      { name: 'Detour around walls', stdin: '7', input: '3x4 with a wall block on the right', expected: '5' },
      { name: 'Large serpentine', stdin: '8', input: '601x601 snake corridor', expected: '181200' },
      { name: 'Large random walls', stdin: '9', input: '1000x1000, about 20% walls', expected: '1998' },
    ],
  },
  {
    id: 's5-count-components',
    title: 'Count components',
    kind: 'implement',
    task: 'An undirected graph has nodes <code>0..n-1</code> and an edge list. Return the number of connected components. Edges may repeat or be self-loops; a node with no edges is its own component.',
    example: { input: 'n = 5, edges = {0,1} {1,2} {3,4}', output: '2' },
    refresher: [
      'Build adjacency lists. For each unvisited node, start a DFS or BFS that marks everything reachable, and add 1 to the count.',
      'Or union-find: start with <code>n</code> components and subtract 1 for every union that actually merges two sets.',
    ],
    hints: [
      'Edges are <code>{u, v}</code> and work in both directions: push each into both adjacency lists.',
      'The large test has chains 2000 nodes long. Recursive DFS is fine at that depth, but BFS or union-find avoid the question.',
    ],
    starter: `int countComponents(int n, const vector<vector<int>>& edges) {
    return 0;
}`,
    solution: `int countComponents(int n, const vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (size_t i = 0; i < edges.size(); i++) {
        adj[edges[i][0]].push_back(edges[i][1]);
        adj[edges[i][1]].push_back(edges[i][0]);
    }
    vector<bool> seen(n, false);
    int count = 0;
    for (int s = 0; s < n; s++) {
        if (seen[s]) continue;
        count++;
        queue<int> q;
        q.push(s);
        seen[s] = true;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (size_t k = 0; k < adj[u].size(); k++) {
                int v = adj[u][k];
                if (!seen[v]) {
                    seen[v] = true;
                    q.push(v);
                }
            }
        }
    }
    return count;
}`,
    harness: `int main() {
    int t; cin >> t;
    int n = 0;
    vector<vector<int>> e;
    if (t == 1) { n = 5; e = {{0, 1}, {1, 2}, {3, 4}}; }
    if (t == 2) { n = 0; }
    if (t == 3) { n = 1; }
    if (t == 4) { n = 5; }
    if (t == 5) { n = 4; e = {{0, 0}, {1, 2}, {2, 1}}; }
    if (t == 6) { n = 5; e = {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 0}}; }
    if (t == 7) {
        n = 200017;
        for (int c = 0; c < 100; c++)
            for (int i = 0; i < 1999; i++) e.push_back({c * 2000 + i + 1, c * 2000 + i});
    }
    int r = countComponents(n, e);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: 'n = 5, edges 0-1 1-2 3-4', expected: '2' },
      { name: 'No nodes', stdin: '2', input: 'n = 0', expected: '0' },
      { name: 'One node', stdin: '3', input: 'n = 1', expected: '1' },
      { name: 'No edges', stdin: '4', input: 'n = 5, no edges', expected: '5' },
      { name: 'Self-loop and repeat', stdin: '5', input: 'n = 4, edges 0-0 1-2 2-1', expected: '3' },
      { name: 'One ring', stdin: '6', input: 'n = 5, cycle 0-1-2-3-4-0', expected: '1' },
      { name: 'Large', stdin: '7', input: '100 chains of 2000 nodes plus 17 isolated nodes', expected: '117' },
    ],
  },
  {
    id: 's5-cycle-detection',
    title: 'Cycle detection',
    kind: 'implement',
    task: 'A <b>directed</b> graph has nodes <code>0..n-1</code>; edge <code>{u, v}</code> means <code>u -&gt; v</code>. Return <code>true</code> if it contains a cycle (a self-loop counts), otherwise <code>false</code>.',
    example: { input: 'n = 3, edges {0,1} {1,2} {2,0}', output: 'true' },
    refresher: [
      'Three-colour DFS: white = unseen, grey = on the current path, black = finished.',
      'Meeting a grey node means a back edge, so there is a cycle. Meeting a black node is safe. Turn a node black when its DFS returns.',
    ],
    hints: [
      'Two states are not enough. In a diamond <code>0-&gt;1, 0-&gt;2, 1-&gt;3, 2-&gt;3</code> node 3 is reached twice and there is no cycle.',
      'Start a DFS from every white node, since the graph may be disconnected. Kahn works too: if topological order misses a node, there is a cycle.',
    ],
    starter: `bool hasCycle(int n, const vector<vector<int>>& edges) {
    return false;
}`,
    solution: `bool dfs(int u, const vector<vector<int>>& adj, vector<int>& color) {
    color[u] = 1;
    for (size_t k = 0; k < adj[u].size(); k++) {
        int v = adj[u][k];
        if (color[v] == 1) return true;
        if (color[v] == 0 && dfs(v, adj, color)) return true;
    }
    color[u] = 2;
    return false;
}

bool hasCycle(int n, const vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (size_t i = 0; i < edges.size(); i++) adj[edges[i][0]].push_back(edges[i][1]);
    vector<int> color(n, 0);
    for (int s = 0; s < n; s++)
        if (color[s] == 0 && dfs(s, adj, color)) return true;
    return false;
}`,
    harness: `int main() {
    int t; cin >> t;
    int n = 0;
    vector<vector<int>> e;
    if (t == 1) { n = 3; e = {{0, 1}, {1, 2}, {2, 0}}; }
    if (t == 2) { n = 0; }
    if (t == 3) { n = 1; }
    if (t == 4) { n = 1; e = {{0, 0}}; }
    if (t == 5) { n = 2; e = {{0, 1}, {1, 0}}; }
    if (t == 6) { n = 4; e = {{0, 1}, {0, 2}, {1, 3}, {2, 3}}; }
    if (t == 7) { n = 6; e = {{0, 1}, {3, 4}, {4, 5}, {5, 3}}; }
    if (t == 8 || t == 9) {
        n = 1500;
        for (int i = 0; i + 1 < n; i++) e.push_back({i, i + 1});
        for (int i = 0; i + 2 < n; i++) e.push_back({i, i + 2});
        if (t == 9) e.push_back({n - 1, 0});
    }
    bool r = hasCycle(n, e);
    cout << "\\n@@RESULT@@\\n" << (r ? "cycle" : "no cycle") << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Triangle', stdin: '1', input: '0->1->2->0', expected: 'cycle' },
      { name: 'No nodes', stdin: '2', input: 'n = 0', expected: 'no cycle' },
      { name: 'One node', stdin: '3', input: 'n = 1, no edges', expected: 'no cycle' },
      { name: 'Self-loop', stdin: '4', input: 'n = 1, edge 0->0', expected: 'cycle' },
      { name: 'Two-node cycle', stdin: '5', input: '0->1, 1->0', expected: 'cycle' },
      { name: 'Diamond (no cycle)', stdin: '6', input: '0->1, 0->2, 1->3, 2->3', expected: 'no cycle' },
      { name: 'Cycle in a second component', stdin: '7', input: 'n = 6, 0->1 and 3->4->5->3', expected: 'cycle' },
      { name: 'Large DAG', stdin: '8', input: '1500 nodes, edges i->i+1 and i->i+2', expected: 'no cycle' },
      { name: 'Large with a back edge', stdin: '9', input: 'same DAG plus 1499->0', expected: 'cycle' },
    ],
  },
]
