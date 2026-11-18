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

const UBINTRO = ['int', 'assign', 'c-array', 'indexing', 'brace-init']
const OOB = '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a[3] = {1, 2, 3};\n    int i = 5;\n    cout << a[i] << endl;\n    return 0;\n}'
// A predict lesson with one ub round; `over` overrides parts of the round.
const ubRound = (id, over) => ({
  id, title: 'Fixture', kind: 'predict', task: 'Pick what it prints.', introduces: [...INTRO, ...UBINTRO], teach: TEACH,
  refresher: ['Print with cout.'],
  rounds: [{ snippet: OOB, choices: ['0', 'A crash', 'Anything can happen'], answer: 2, why: 'Reading past the end is undefined behaviour.', ub: true, output: 'undefined: anything can happen', ...over }],
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
  // a ub round whose stored output and correct choice are a real result, not "undefined"
  ubRound('c1-bad-ub-wording', { output: '5', choices: ['5', 'a crash', 'a compile error'], answer: 0 }),
  // a ub round whose snippet is well defined: the sanitizer build reports nothing
  ubRound('c1-bad-ub-not-ub', { snippet: HELLO }),
  // a teach example that reads a[5] of int a[5]: the sanitizer build reports it
  base('c1-bad-teach-sanitizer', {
    introduces: [...INTRO, ...UBINTRO],
    teach: { ...TEACH, examples: [{ code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a[5] = {1, 2, 3, 4, 5};\n    int i = 5;\n    cout << a[i] << endl;\n    return 0;\n}' }] },
  }),
  // a non-ub round whose marked answer disagrees with the one-line output
  {
    id: 'c1-bad-choice-mismatch', title: 'Fixture', kind: 'predict', task: 'Pick what it prints.', introduces: INTRO, teach: TEACH,
    refresher: ['Print with cout.'],
    rounds: [{ snippet: HELLO, choices: ['bye', 'hi', 'nothing'], answer: 0, why: 'It prints hi.', output: 'hi' }],
  },
]
