// Lessons for this stage. Format: docs/superpowers/specs/2026-11-15-foundations-track-design.md
export const LESSONS = [
  {
    id: 's1-sum-of-n',
    title: 'Sum of N numbers',
    kind: 'program',
    task: 'Read <code>n</code>, then <code>n</code> integers. Print their sum on one line.',
    example: { input: '3\n5 -2 8', output: '11' },
    refresher: [
      'The file starts empty. You write the <code>#include</code> lines, <code>using namespace std;</code> and <code>int main()</code>.',
      '<code>cin &gt;&gt; x</code> reads the next whitespace-separated value; <code>cout &lt;&lt; x</code> prints it.',
      'Sums of many large values overflow <code>int</code>. <code>long long</code> holds about 9e18.',
    ],
    hints: [
      'Get an empty <code>main</code> compiling before adding logic.',
      'Loop <code>n</code> times, reading one value per iteration into a running total.',
      'Check the types: what happens when three values near two billion are added?',
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
      { name: 'Example', stdin: '3\n5 -2 8\n', expected: '11' },
      { name: 'One negative value', stdin: '1\n-7\n', expected: '-7' },
      { name: 'Zero values', stdin: '0\n', expected: '0' },
      { name: 'Values on separate lines', stdin: '4\n1\n2\n3\n4', expected: '10' },
      { name: 'Too big for int', stdin: '3\n2000000000 2000000000 2000000000\n', expected: '6000000000' },
      { name: 'Cancels out', stdin: '4\n-1000000000 1000000000 -5 5\n', expected: '0' },
    ],
  },
  {
    id: 's1-read-until-eof',
    title: 'Read until the input ends',
    kind: 'program',
    task: 'The input is a list of integers with no count in front. Print how many there are and the largest one, separated by a space. If there are none, print just <code>0</code>.',
    example: { input: '4 9 -2 7', output: '4 9' },
    refresher: [
      '<code>while (cin &gt;&gt; x)</code> keeps reading until the input ends or a read fails.',
      'Do not start the maximum at <code>0</code>: all values may be negative. Start from the first value, or from <code>LLONG_MIN</code>.',
      'Track whether you have seen any value yet; an empty input must not print a maximum.',
    ],
    hints: [
      'The loop condition itself performs the read.',
      'Keep a counter and a <code>best</code> value; update <code>best</code> only when the value is larger or the counter is 0.',
      'After the loop, branch on the counter being 0.',
    ],
    starter: '',
    solution: `#include <iostream>
using namespace std;

int main() {
    long long x, best = 0;
    int count = 0;
    while (cin >> x) {
        if (count == 0 || x > best) best = x;
        count++;
    }
    if (count == 0) {
        cout << 0 << "\\n";
    } else {
        cout << count << " " << best << "\\n";
    }
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '4 9 -2 7\n', expected: '4 9' },
      { name: 'Empty input', stdin: '', expected: '0' },
      { name: 'Only a newline', stdin: '\n', expected: '0' },
      { name: 'All negative', stdin: '-5 -3 -9\n', expected: '3 -3' },
      { name: 'No trailing newline', stdin: '10 20 30', expected: '3 30' },
      { name: 'Several lines and blank lines', stdin: '1 2\n\n3\n  8\n\n', expected: '4 8' },
      { name: 'One value', stdin: '42\n', expected: '1 42' },
    ],
  },
  {
    id: 's1-count-vowels',
    title: 'Count the vowels',
    kind: 'program',
    task: 'Read one whole line (it may contain spaces). Print how many of its characters are vowels: <code>a e i o u</code>, upper or lower case.',
    example: { input: 'Hello World', output: '3' },
    refresher: [
      '<code>getline(cin, s)</code> reads up to the end of the line, spaces included. <code>cin &gt;&gt; s</code> stops at the first space.',
      '<code>for (char c : s)</code> walks the characters. <code>tolower(c)</code> comes from <code>&lt;cctype&gt;</code>.',
      'Include <code>&lt;string&gt;</code> for <code>string</code> and <code>getline</code>.',
    ],
    hints: [
      'Read the line first and print it back to check you got all of it.',
      'Lower-case each character, then compare it against the five vowels.',
    ],
    starter: '',
    solution: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string line;
    getline(cin, line);
    int count = 0;
    for (char c : line) {
        char l = tolower(c);
        if (l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u') count++;
    }
    cout << count << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: 'Hello World\n', expected: '3' },
      { name: 'Upper case', stdin: 'AEIOU aeiou\n', expected: '10' },
      { name: 'No vowels', stdin: 'rhythm myth\n', expected: '0' },
      { name: 'Empty line', stdin: '\n', expected: '0' },
      { name: 'No input at all', stdin: '', expected: '0' },
      { name: 'Digits and punctuation', stdin: 'R2-D2, C-3PO!\n', expected: '1' },
      { name: 'No trailing newline', stdin: 'Education', expected: '5' },
    ],
  },
  {
    id: 's1-swap-ref',
    title: 'Swap: value or reference',
    kind: 'implement',
    task: 'Make <code>swapInts(x, y)</code> exchange the caller\'s two variables. The starter signature compiles but changes nothing visible to the caller. Fix that. <code>std::swap</code> is off the table.',
    refresher: [
      'Parameters are copies by default. Changing a copy never touches the caller\'s variable.',
      '<code>int&amp; a</code> makes <code>a</code> another name for the caller\'s variable. The call site stays <code>swapInts(x, y)</code>.',
      'Swapping needs a temporary: save one value, overwrite it, then write the saved value back.',
    ],
    hints: [
      'Run it first and look at which values come back.',
      'Only the parameter list needs to change, plus the body that swaps.',
      'It also has to work for two elements of the same vector, such as <code>v[0]</code> and <code>v[2]</code>.',
    ],
    forbidden: [{ pattern: '\\bswap\\s*\\(', message: 'Write the swap yourself: std::swap is off the table here.' }],
    starter: `// After swapInts(x, y), x holds the old y and y holds the old x.
void swapInts(int a, int b) {

}`,
    solution: `void swapInts(int& a, int& b) {
    int tmp = a;
    a = b;
    b = tmp;
}`,
    harness: `int main() {
    int t; cin >> t;
    int x = 3, y = 8;
    vector<int> v = {1, 2, 3};
    if (t == 2) { x = -5; y = 5; }
    if (t == 3) { x = 4; y = 4; }
    if (t == 5) { x = 0; y = INT_MAX; }
    if (t == 4) swapInts(v[0], v[2]); else swapInts(x, y);
    cout << "\\n@@RESULT@@\\n";
    if (t == 4) cout << v[0] << " " << v[1] << " " << v[2];
    else cout << x << " " << y;
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Two variables', stdin: '1', input: 'x = 3, y = 8', expected: '8 3' },
      { name: 'Negative and positive', stdin: '2', input: 'x = -5, y = 5', expected: '5 -5' },
      { name: 'Equal values', stdin: '3', input: 'x = 4, y = 4', expected: '4 4' },
      { name: 'Vector elements', stdin: '4', input: 'v = [1 2 3], swap v[0] and v[2]', expected: '3 2 1' },
      { name: 'Extreme values', stdin: '5', input: 'x = 0, y = INT_MAX', expected: '2147483647 0' },
    ],
  },
  {
    id: 's1-reverse-vector',
    title: 'Reverse a vector',
    kind: 'implement',
    task: 'Reverse <code>v</code> in place using two indices that move toward each other. Do not build a second vector and do not call <code>std::reverse</code>.',
    refresher: [
      'Take <code>i = 0</code> and <code>j = size - 1</code>; swap <code>v[i]</code> and <code>v[j]</code>, then <code>i++</code>, <code>j--</code>.',
      'Stop when <code>i &gt;= j</code>. The middle element of an odd length stays where it is.',
      '<code>v.size()</code> is unsigned: <code>v.size() - 1</code> on an empty vector wraps around. Cast to <code>int</code>.',
    ],
    hints: [
      'Trace <code>[1 2 3 4]</code> and <code>[1 2 3]</code> on paper to see when to stop.',
      'Convert the size to <code>int</code> before subtracting one.',
    ],
    forbidden: [{ pattern: '\\breverse\\s*\\(', message: 'Write the loop yourself: std::reverse is off the table here.' }],
    starter: `// Reverse v in place.
void reverseVec(vector<int>& v) {

}`,
    solution: `void reverseVec(vector<int>& v) {
    int i = 0, j = (int)v.size() - 1;
    while (i < j) {
        int tmp = v[i];
        v[i] = v[j];
        v[j] = tmp;
        i++;
        j--;
    }
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v;
    if (t == 1) v = {1, 2, 3, 4};
    if (t == 2) v = {1, 2, 3};
    if (t == 3) v = {};
    if (t == 4) v = {9};
    if (t == 5) v = {5, 5, 1, -2};
    if (t == 6) { for (int i = 0; i < 100000; i++) v.push_back(i); }
    reverseVec(v);
    cout << "\\n@@RESULT@@\\n";
    if (t == 6) {
        bool ok = v.size() == 100000;
        for (int i = 0; ok && i < (int)v.size(); i++) if (v[i] != 99999 - i) ok = false;
        cout << (ok ? "reversed" : "wrong");
    } else {
        for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i];
    }
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Even length', stdin: '1', input: '1 2 3 4', expected: '4 3 2 1' },
      { name: 'Odd length', stdin: '2', input: '1 2 3', expected: '3 2 1' },
      { name: 'Empty', stdin: '3', input: '(empty)', expected: '' },
      { name: 'One value', stdin: '4', input: '9', expected: '9' },
      { name: 'Duplicates and negatives', stdin: '5', input: '5 5 1 -2', expected: '-2 1 5 5' },
      { name: 'Large', stdin: '6', input: '0 .. 99999', expected: 'reversed' },
    ],
  },
  {
    id: 's1-palindrome',
    title: 'Is it a palindrome?',
    kind: 'implement',
    task: 'Return <code>true</code> if <code>s</code> reads the same forwards and backwards. Compare exactly: case matters, and the empty string counts as a palindrome.',
    refresher: [
      'Compare <code>s[i]</code> with <code>s[n - 1 - i]</code> for <code>i</code> up to the middle, or walk two indices inward.',
      'Return <code>false</code> at the first mismatch; return <code>true</code> only after the loop.',
      '<code>const string&amp; s</code> avoids copying the string.',
    ],
    hints: [
      'You only need to check half of the string.',
      'Use <code>int n = s.size();</code> so that an empty string does not underflow.',
    ],
    forbidden: [{ pattern: '\\breverse\\s*\\(|\\brbegin\\b', message: 'Compare characters with indices; do not reverse the string or use reverse iterators.' }],
    starter: `// True if s reads the same in both directions (case-sensitive).
bool isPalindrome(const string& s) {

}`,
    solution: `bool isPalindrome(const string& s) {
    int i = 0, j = (int)s.size() - 1;
    while (i < j) {
        if (s[i] != s[j]) return false;
        i++;
        j--;
    }
    return true;
}`,
    harness: `int main() {
    int t; cin >> t;
    string words[] = {"", "racecar", "abba", "a", "ab", "Aba", "abca", "xyyx"};
    string s = words[t];
    bool r = isPalindrome(s);
    cout << "\\n@@RESULT@@\\n" << (r ? "true" : "false") << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Odd palindrome', stdin: '1', input: 'racecar', expected: 'true' },
      { name: 'Even palindrome', stdin: '2', input: 'abba', expected: 'true' },
      { name: 'Empty string', stdin: '0', input: '(empty)', expected: 'true' },
      { name: 'One character', stdin: '3', input: 'a', expected: 'true' },
      { name: 'Two different', stdin: '4', input: 'ab', expected: 'false' },
      { name: 'Case matters', stdin: '5', input: 'Aba', expected: 'false' },
      { name: 'Mismatch in the middle', stdin: '6', input: 'abca', expected: 'false' },
    ],
  },
  {
    id: 's1-struct-students',
    title: 'A struct of students',
    kind: 'implement',
    task: 'Define <code>struct Student</code> with <code>string name</code> and <code>int score</code>. Then write <code>topScorer</code>: the name of the highest scorer, the earliest one on ties, or <code>""</code> for an empty list.',
    refresher: [
      '<code>struct Student { string name; int score; };</code> and the trailing semicolon is required.',
      'Access fields with a dot: <code>s.score</code>. Loop with <code>for (const Student&amp; s : v)</code> to avoid copying.',
      'Replace the best only when strictly greater, so the earliest keeps a tie.',
    ],
    hints: [
      'Define the struct first; the harness fills in <code>name</code> and <code>score</code> by field name.',
      'Do not start the best score at 0: scores can be negative. Remember the best index or pointer instead.',
    ],
    starter: `// Define struct Student here (name, score).

// Name of the highest scorer; earliest on ties; "" if v is empty.
string topScorer(const vector<Student>& v) {

}`,
    solution: `struct Student {
    string name;
    int score;
};

string topScorer(const vector<Student>& v) {
    if (v.empty()) return "";
    int best = 0;
    for (int i = 1; i < (int)v.size(); i++) {
        if (v[i].score > v[best].score) best = i;
    }
    return v[best].name;
}`,
    harness: `void add(vector<Student>& v, const string& name, int score) {
    Student s;
    s.name = name;
    s.score = score;
    v.push_back(s);
}

int main() {
    int t; cin >> t;
    vector<Student> v;
    if (t == 1) { add(v, "Ann", 70); add(v, "Bob", 95); add(v, "Cy", 82); }
    if (t == 3) { add(v, "Solo", 10); }
    if (t == 4) { add(v, "Ann", 80); add(v, "Bob", 80); add(v, "Cy", 60); }
    if (t == 5) { add(v, "Ann", -5); add(v, "Bob", -2); add(v, "Cy", -9); }
    if (t == 6) { add(v, "Ann", 1); add(v, "Bob", 2); add(v, "Cy", 3); }
    if (t == 7) { add(v, "Ann", 100); add(v, "Bob", 0); }
    string r = topScorer(v);
    cout << "\\n@@RESULT@@\\n" << "[" << r << "]" << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Best in the middle', stdin: '1', input: 'Ann 70, Bob 95, Cy 82', expected: '[Bob]' },
      { name: 'Empty list', stdin: '2', input: '(empty)', expected: '[]' },
      { name: 'One student', stdin: '3', input: 'Solo 10', expected: '[Solo]' },
      { name: 'Tie keeps the first', stdin: '4', input: 'Ann 80, Bob 80, Cy 60', expected: '[Ann]' },
      { name: 'All negative', stdin: '5', input: 'Ann -5, Bob -2, Cy -9', expected: '[Bob]' },
      { name: 'Best is last', stdin: '6', input: 'Ann 1, Bob 2, Cy 3', expected: '[Cy]' },
      { name: 'Best is first', stdin: '7', input: 'Ann 100, Bob 0', expected: '[Ann]' },
    ],
  },
  {
    id: 's1-pointer-sum',
    title: 'Pointers and arrays',
    kind: 'implement',
    task: 'Return the sum of the ints in the half-open range <code>[begin, end)</code>. Walk it with pointer arithmetic: no <code>[ ]</code> indexing and no <code>accumulate</code>.',
    refresher: [
      'An array name decays to a pointer to its first element; <code>p + 1</code> is the next element, <code>*p</code> is the value.',
      '<code>for (const int* p = begin; p != end; p++)</code> walks a half-open range. <code>end</code> is one past the last element and is never dereferenced.',
      'An empty range has <code>begin == end</code>.',
    ],
    hints: [
      'Copy <code>begin</code> into a loop pointer and compare it with <code>end</code>.',
      'Dereference with <code>*p</code> to read the current value; add it to a <code>long long</code>.',
    ],
    forbidden: [
      { pattern: '\\[', message: 'Use pointer arithmetic (*p, p++), not [ ] indexing.' },
      { pattern: '\\baccumulate\\b', message: 'Write the loop yourself: accumulate is off the table here.' },
    ],
    starter: `// Sum of the values in [begin, end).
long long sumRange(const int* begin, const int* end) {

}`,
    solution: `long long sumRange(const int* begin, const int* end) {
    long long sum = 0;
    for (const int* p = begin; p != end; p++) {
        sum += *p;
    }
    return sum;
}`,
    harness: `int main() {
    int t; cin >> t;
    int a[] = {4, -1, 7, 3, 10};
    int big[] = {2000000000, 2000000000, 2000000000};
    long long r = -1;
    if (t == 1) r = sumRange(a, a + 5);
    if (t == 2) r = sumRange(a, a);
    if (t == 3) r = sumRange(a + 2, a + 3);
    if (t == 4) r = sumRange(a + 1, a + 4);
    if (t == 5) r = sumRange(big, big + 3);
    if (t == 6) r = sumRange(a + 5, a + 5);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Whole array', stdin: '1', input: '{4 -1 7 3 10}, all', expected: '23' },
      { name: 'Empty range at the start', stdin: '2', input: 'begin == end', expected: '0' },
      { name: 'One element', stdin: '3', input: 'only the 7', expected: '7' },
      { name: 'Middle part', stdin: '4', input: '-1 7 3', expected: '9' },
      { name: 'Overflows int', stdin: '5', input: '3 values of 2e9', expected: '6000000000' },
      { name: 'Empty range at the end', stdin: '6', input: 'begin == end == one past the last', expected: '0' },
    ],
  },
  {
    id: 's1-grid-peaks',
    title: 'Walk a 2D grid',
    kind: 'implement',
    task: 'Count the cells that are strictly greater than every neighbour above, below, left and right. Edge cells have fewer neighbours. The grid may be empty.',
    refresher: [
      '<code>g[r][c]</code> is row <code>r</code>, column <code>c</code>. <code>g.size()</code> is the row count, <code>g[0].size()</code> the column count.',
      'Use <code>int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};</code> and check <code>0 &lt;= nr &lt; rows</code> before reading a neighbour.',
      'Check <code>g.empty()</code> before touching <code>g[0]</code>.',
    ],
    hints: [
      'Write the double loop and bounds check first; count every cell and confirm you get rows times columns.',
      'For each cell, assume it is a peak and clear that flag when any in-bounds neighbour is greater than or equal to it.',
    ],
    starter: `// Number of cells strictly greater than all their in-bounds neighbours (up, down, left, right).
int countPeaks(const vector<vector<int>>& g) {

}`,
    solution: `int countPeaks(const vector<vector<int>>& g) {
    int rows = g.size();
    if (rows == 0) return 0;
    int cols = g[0].size();
    int dr[] = {-1, 1, 0, 0};
    int dc[] = {0, 0, -1, 1};
    int count = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            bool peak = true;
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                if (g[nr][nc] >= g[r][c]) peak = false;
            }
            if (peak) count++;
        }
    }
    return count;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<vector<int>> g;
    if (t == 1) g = {{1, 2, 1}, {2, 9, 2}, {1, 2, 1}};
    if (t == 2) g = {};
    if (t == 3) g = {{7}};
    if (t == 4) g = {{3, 1, 4, 1, 5}};
    if (t == 5) g = {{2, 2, 2}, {2, 2, 2}, {2, 2, 2}};
    if (t == 6) g = {{5, 1, 1, 6}, {1, 1, 1, 1}};
    if (t == 7) g = {{1}, {3}, {2}, {5}};
    cout << "\\n@@RESULT@@\\n" << countPeaks(g) << "\\n";
    return 0;
}`,
    tests: [
      { name: 'One peak in the centre', stdin: '1', input: '[[1 2 1] [2 9 2] [1 2 1]]', expected: '1' },
      { name: 'Empty grid', stdin: '2', input: '(empty)', expected: '0' },
      { name: 'Single cell', stdin: '3', input: '[[7]]', expected: '1' },
      { name: 'Single row', stdin: '4', input: '[[3 1 4 1 5]]', expected: '3' },
      { name: 'All equal', stdin: '5', input: '3x3 of 2', expected: '0' },
      { name: 'Peaks in the corners', stdin: '6', input: '[[5 1 1 6] [1 1 1 1]]', expected: '2' },
      { name: 'Single column', stdin: '7', input: '[[1] [3] [2] [5]]', expected: '2' },
    ],
  },
  {
    id: 's1-number-triangle',
    title: 'Print a number triangle',
    kind: 'program',
    task: 'Read <code>n</code>. Print <code>n</code> lines; line <code>i</code> holds the numbers <code>1</code> to <code>i</code> separated by single spaces. For <code>n = 0</code>, print nothing.',
    example: { input: '4', output: '1\n1 2\n1 2 3\n1 2 3 4' },
    refresher: [
      'An outer loop for the line number and an inner loop for the numbers on that line.',
      'Print a space before every number except the first on a line, then <code>"\\n"</code> after the inner loop.',
      '<code>cout &lt;&lt; "\\n"</code> avoids the flush that <code>endl</code> forces.',
    ],
    hints: [
      'The inner loop bound depends on the outer loop variable.',
      'Use <code>if (j &gt; 1) cout &lt;&lt; " ";</code> to avoid a trailing space.',
    ],
    starter: '',
    solution: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            if (j > 1) cout << " ";
            cout << j;
        }
        cout << "\\n";
    }
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '4\n', expected: '1\n1 2\n1 2 3\n1 2 3 4' },
      { name: 'One line', stdin: '1\n', expected: '1' },
      { name: 'Zero lines', stdin: '0\n', expected: '' },
      { name: 'Two digit numbers', stdin: '11', expected: '1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5\n1 2 3 4 5 6\n1 2 3 4 5 6 7\n1 2 3 4 5 6 7 8\n1 2 3 4 5 6 7 8 9\n1 2 3 4 5 6 7 8 9 10\n1 2 3 4 5 6 7 8 9 10 11' },
    ],
  },
  {
    id: 's1-average-bug',
    title: 'The average that rounds down',
    kind: 'bugfix',
    task: '<code>average</code> returns whole numbers only: the average of <code>{0, 1}</code> comes out as <code>0</code> instead of <code>0.5</code>. Find the bug and fix it with the smallest change.',
    refresher: [
      'In C++, <code>int / int</code> is integer division and drops the fraction, even if the result is stored in a <code>double</code>.',
      'Convert one operand before dividing: <code>(double)sum / n</code>.',
    ],
    hints: [
      'Where does the fraction disappear: at the division, or at the return?',
      'The conversion to <code>double</code> has to happen before the <code>/</code>, not after.',
    ],
    starter: `// Average of the values; 0 for an empty vector.
double average(const vector<int>& v) {
    if (v.empty()) return 0;
    int sum = 0;
    for (int x : v) sum += x;
    int n = v.size();
    return sum / n;
}`,
    solution: `double average(const vector<int>& v) {
    if (v.empty()) return 0;
    int sum = 0;
    for (int x : v) sum += x;
    int n = v.size();
    return (double)sum / n;
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v;
    if (t == 1) v = {2, 4, 6};
    if (t == 2) v = {0, 1};
    if (t == 3) v = {};
    if (t == 4) v = {-3, -4};
    if (t == 5) v = {1, 2, 2};
    if (t == 6) v = {10};
    cout << "\\n@@RESULT@@\\n" << fixed << setprecision(2) << average(v) << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Divides evenly', stdin: '1', input: '2 4 6', expected: '4.00' },
      { name: 'Half', stdin: '2', input: '0 1', expected: '0.50' },
      { name: 'Empty', stdin: '3', input: '(empty)', expected: '0.00' },
      { name: 'Negatives', stdin: '4', input: '-3 -4', expected: '-3.50' },
      { name: 'Repeating fraction', stdin: '5', input: '1 2 2', expected: '1.67' },
      { name: 'One value', stdin: '6', input: '10', expected: '10.00' },
    ],
  },
  {
    id: 's1-copy-bug',
    title: 'The copy that never changed',
    kind: 'bugfix',
    task: '<code>curve</code> should add 5 to every score, capped at 100, but the vector comes back unchanged. Find the bug and fix it with the smallest change.',
    refresher: [
      '<code>for (int s : v)</code> gives <code>s</code> a copy of each element. Assigning to <code>s</code> never changes <code>v</code>.',
      '<code>for (int&amp; s : v)</code> makes <code>s</code> a reference to the element itself.',
    ],
    hints: [
      'The loop runs and the arithmetic is right. Ask what <code>s</code> actually is.',
      'One character in the loop header fixes it.',
    ],
    starter: `// Add 5 to every score, capped at 100.
void curve(vector<int>& scores) {
    for (int s : scores) {
        s = min(100, s + 5);
    }
}`,
    solution: `void curve(vector<int>& scores) {
    for (int& s : scores) {
        s = min(100, s + 5);
    }
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> v;
    if (t == 1) v = {50, 60, 70};
    if (t == 2) v = {96, 100, 99};
    if (t == 3) v = {};
    if (t == 4) v = {0};
    if (t == 5) v = {95, 20, 100, 1};
    curve(v);
    cout << "\\n@@RESULT@@\\n";
    for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "") << v[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Plain scores', stdin: '1', input: '50 60 70', expected: '55 65 75' },
      { name: 'Hits the cap', stdin: '2', input: '96 100 99', expected: '100 100 100' },
      { name: 'Empty', stdin: '3', input: '(empty)', expected: '' },
      { name: 'Zero', stdin: '4', input: '0', expected: '5' },
      { name: 'Mixed', stdin: '5', input: '95 20 100 1', expected: '100 25 100 6' },
    ],
  },
]
