// Negative fixtures for scripts/verify-cpp-learn.mjs: one lesson per rule, each breaking EXACTLY one rule.
// Every lesson here must print FAIL, with a reason that names its rule, when checked with
//   node scripts/verify-cpp-learn.mjs --file scripts/fixtures/cpp-learn-bad.js
// (The checker exits 1.) Never import this file from the app.

const HELLO = '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "hi" << endl;\n    return 0;\n}'
const INTRO = ['include-iostream', 'using-namespace-std', 'int-main', 'cout', 'stream-insert', 'string-literal', 'endl', 'semicolon', 'return-zero']
const TEACH = {
  body: ['<p>Prints a word.</p>'],
  examples: [{ code: HELLO, output: 'hi' }],
  terms: [{ code: 'cout << "hi"', meaning: 'prints hi' }],
}
// A valid program lesson; each fixture below overrides one thing.
const base = (id, over) => ({
  id, title: 'Fixture', kind: 'program', task: 'Print hi.', introduces: INTRO, teach: TEACH,
  refresher: ['Print with cout.'], hints: ['Use cout.', 'End the line with endl.'],
  starter: '', solution: HELLO, tests: [{ name: 'Prints hi', stdin: '', expected: 'hi' }],
  ...over,
})

export const LESSONS = [
  // taught-before-used: the task mentions cout, but nothing taught it (the code itself uses printf, which the
  // registry does not track, so this is the only violation).
  {
    id: 'c1-bad-taught-before', title: 'Fixture', kind: 'program', task: 'Print hi with <code>cout</code>.',
    introduces: ['int-main', 'return-zero', 'string-literal', 'semicolon', 'newline-escape'],
    teach: { body: ['<p>Prints a word.</p>'], examples: [{ code: '#include <cstdio>\nint main() {\n    printf("hi\\n");\n    return 0;\n}', output: 'hi' }], terms: [{ code: 'main', meaning: 'where it starts' }] },
    refresher: ['Print a word.'], hints: ['Print hi.', 'Then return 0.'],
    starter: '', solution: '#include <cstdio>\nint main() {\n    printf("hi\\n");\n    return 0;\n}',
    tests: [{ name: 'Prints hi', stdin: '', expected: 'hi' }],
  },
  // a solution failing a test
  base('c1-bad-solution-fails', { tests: [{ name: 'Prints bye', stdin: '', expected: 'bye' }] }),
  // a starter that passes
  base('c1-bad-starter-passes', { starter: HELLO }),
  // a fix starter whose error does not match errorMatch (it fails with "expected ';'")
  base('c1-bad-fix-mismatch', {
    kind: 'fix', errorMatch: 'undeclared identifier', gloss: 'A semicolon is missing.',
    starter: HELLO.replace('endl;', 'endl'),
  }),
  // a predict output that is wrong (the program prints hi, not bye)
  {
    id: 'c1-bad-predict-wrong', title: 'Fixture', kind: 'predict', task: 'Pick what it prints.', introduces: INTRO, teach: TEACH,
    refresher: ['Print with cout.'],
    rounds: [{ snippet: HELLO, choices: ['hi', 'bye', 'nothing'], answer: 0, why: 'It prints hi.', output: 'bye' }],
  },
  // a Python snippet that raises
  base('c1-bad-python-raises', { inPython: { code: 'print(1 / 0)', note: 'Python raises here.' } }),
  // an unknown field
  base('c1-bad-unknown-field', { colour: 'blue' }),
  // a teach example whose output is wrong
  base('c1-bad-teach-output', { teach: { ...TEACH, examples: [{ code: HELLO, output: 'bye' }] } }),
]
