// DEV ONLY. Grading fixtures for the browser self-test (copied from docs/superpowers/specs/cpp-learn-lesson-examples.js).
// One change: the loop fixture spins on a volatile, because clang turns an empty `while (true) { }` into a trap
// (no side effects is undefined), which fails at once instead of timing out.
// Imported only by selftest.js, which main.jsx loads under import.meta.env.DEV, so it never reaches the production bundle.
// Fixtures for the app's grading tests. Stage 0: exempt from `teach`. Their ids are c0-..., and they live only in
// this file (never in a shipped stage file).
//   c0-crash: the STARTER calls v.at(i) with i = 99 in test 2, which aborts the program (the browser compiler has
//             exceptions off). Test 1 passes, test 2 fails with the crash message, test 3 is "not run".
//   c0-loop:  the STARTER never returns from twice(), so test 1 times out.
// ---------------------------------------------------------------------------------------------
const fixtureCrash = {
  id: 'c0-crash',
  title: 'Crash fixture',
  kind: 'implement',
  task: 'Write <code>safeAt</code>: return the item at index i, or -1 when i is out of range.',
  introduces: ['include-vector', 'vector', 'const', 'const-ref', 'reference-param', 'at-method', 'size-method', 'comparison', 'logical-ops', 'if', 'static-cast'],
  refresher: ['<code>v.at(i)</code> stops the program when i is out of range.'],
  hints: ['Check the index before touching the vector.', 'An index is valid when it is at least 0 and below the size.'],
  starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Return v[i], or -1 when i is out of range.\nint safeAt(const vector<int>& v, int i) {\n    return v.at(i);\n}',
  solution: '#include <iostream>\n#include <vector>\nusing namespace std;\n\n// Return v[i], or -1 when i is out of range.\nint safeAt(const vector<int>& v, int i) {\n    if (i < 0 || i >= static_cast<int>(v.size())) {\n        return -1;\n    }\n    return v.at(i);\n}',
  harness: 'int main() {\n    vector<int> harness_v = {1, 2, 3};\n    cout << "\\n@@TEST 1@@" << endl;\n    cout << safeAt(harness_v, 1) << endl;\n    cout << "\\n@@TEST 2@@" << endl;\n    cout << safeAt(harness_v, 99) << endl;\n    cout << "\\n@@TEST 3@@" << endl;\n    cout << safeAt(harness_v, -1) << endl;\n    return 0;\n}',
  tests: [
    { name: 'In range', input: 'safeAt({1,2,3}, 1)', expected: '2' },
    { name: 'Too big', input: 'safeAt({1,2,3}, 99)', expected: '-1' },
    { name: 'Negative', input: 'safeAt({1,2,3}, -1)', expected: '-1' },
  ],
}

const fixtureLoop = {
  id: 'c0-loop',
  title: 'Timeout fixture',
  kind: 'implement',
  task: 'Write <code>twice</code>: return its argument doubled.',
  introduces: ['while', 'bool'],
  timeLimitMs: 500,
  refresher: ['A loop whose condition is always true never ends.'],
  hints: ['No loop is needed.', 'Multiply by 2 and return.'],
  starter: '#include <iostream>\nusing namespace std;\n\nint twice(int x) {\n    volatile int harness_spin = 0;\n    while (true) { harness_spin = harness_spin + 1; }\n    return x * 2;\n}',
  solution: '#include <iostream>\nusing namespace std;\n\nint twice(int x) {\n    return x * 2;\n}',
  harness: 'int main() {\n    cout << "\\n@@TEST 1@@" << endl;\n    cout << twice(2) << endl;\n    cout << "\\n@@TEST 2@@" << endl;\n    cout << twice(0) << endl;\n    cout << "\\n@@TEST 3@@" << endl;\n    cout << twice(-3) << endl;\n    return 0;\n}',
  tests: [
    { name: 'Positive', input: 'twice(2)', expected: '4' },
    { name: 'Zero', input: 'twice(0)', expected: '0' },
    { name: 'Negative', input: 'twice(-3)', expected: '-6' },
  ],
}

export const FIXTURES = [fixtureCrash, fixtureLoop]
