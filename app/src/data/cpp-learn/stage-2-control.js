// C++ Learn lessons (stage-2-control). Contract: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md
// Check with: node scripts/verify-cpp-learn.mjs --stage 2
// Stage 2 has no functions yet, so every lesson is a whole program (concept, predict, fix or program).
// C is String.raw: backslashes in C++ and Python code stay as written, so "\n" in code is written "\n".
const C = String.raw

export const LESSONS = [
  // 1. if / else, comparisons
  {
    id: 'c2-if-else',
    title: 'if and else',
    kind: 'concept',
    task: 'Read a whole number. Print <em>positive</em> if it is greater than zero, otherwise print <em>not positive</em>.',
    introduces: ['comparison', 'if', 'else'],
    teach: {
      body: [
        `<p>So far every program ran its lines straight down, once. An <code>if</code> lets the program choose. You write <code>if (condition) { ... }</code>, and the code between the braces runs only when the condition is true. Two differences from Python: the condition <em>must</em> sit inside parentheses, and there is no colon. The braces <code>{ }</code> mark where the block starts and ends.</p>`,
        `<p>Conditions are built from comparisons, which are the same ones Python has: <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> and <code>&gt;=</code>. Watch the first one: equality is <em>two</em> equals signs, because a single <code>=</code> already means "store a value". Add <code>else { ... }</code> after the block to say what to do when the condition is false.</p>`,
      ],
      examples: [
        {
          code: C`int age = 20;
if (age >= 18) {            // the condition is in parentheses, no colon
    cout << "adult" << endl;
} else {                    // runs when the condition is false
    cout << "minor" << endl;
}`,
          output: 'adult',
          caption: 'One branch runs, the other is skipped.',
          wrap: true,
        },
        {
          code: C`int a = 3;
int b = 3;
if (a == b) {               // == compares, = would store
    cout << "same" << endl;
}
if (a != b) {
    cout << "different" << endl;
}`,
          output: 'same',
          caption: 'Comparing with == and !=.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'if (cond) { ... }', meaning: 'runs the block only when the condition is true; the parentheses are required' },
        { code: 'else { ... }', meaning: 'runs when the if condition was false' },
        { code: '== != < > <= >=', meaning: 'the comparisons; equality is two equals signs' },
      ],
    },
    compare: {
      py: { code: 'n = 5\nif n > 0:\n    print("positive")\nelse:\n    print("not positive")', outcome: 'Prints positive', ok: true },
      cpp: { code: C`int n = 5;
if (n > 0) {
    cout << "positive" << endl;
} else {
    cout << "not positive" << endl;
}`, outcome: 'Prints positive', ok: true },
      text: 'C++ puts the condition in parentheses and the block in braces, with no colon. Python uses the colon and the indentation instead.',
    },
    refresher: [
      '<code>if (cond) { ... } else { ... }</code>: the condition needs parentheses, the blocks need braces.',
      'Compare with <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. A single <code>=</code> stores a value.',
    ],
    hints: [
      'Read the number into an <code>int</code> first, as in stage 1.',
      'The condition is <code>n &gt; 0</code>. Put the <em>positive</em> print in the if block and the other in the else block.',
    ],
    inPython: {
      code: 'n = 5\nif n > 0:\n    print("positive")\nelse:\n    print("not positive")',
      note: 'Same shape. Python marks the block with a colon and indentation; C++ marks it with braces.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // print positive or not positive
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n > 0) {
        cout << "positive" << endl;
    } else {
        cout << "not positive" << endl;
    }
    return 0;
}`,
    require: [{ pattern: 'if\\s*\\(', message: 'Use an if with the condition in parentheses' }],
    tests: [
      { name: 'Positive', stdin: '5\n', expected: 'positive' },
      { name: 'Zero is not positive', stdin: '0\n', expected: 'not positive' },
      { name: 'Negative', stdin: '-3\n', expected: 'not positive' },
      { name: 'Large', stdin: '100000\n', expected: 'positive' },
    ],
  },

  // 2. else if
  {
    id: 'c2-else-if',
    title: 'Chains with else if',
    kind: 'concept',
    task: 'Read a score from 0 to 100. Print <em>A</em> for 90 or more, <em>B</em> for 80 or more, <em>C</em> for 70 or more, otherwise <em>F</em>.',
    introduces: [],
    teach: {
      body: [
        `<p>When there are more than two choices, chain them: <code>if (...) { ... } else if (...) { ... } else { ... }</code>. Python spells the middle part <code>elif</code>; C++ writes it as two words, <code>else if</code>. The conditions are tried from the top, the first true one runs, and everything below it is skipped. The final <code>else</code> is optional and catches whatever is left.</p>`,
        `<p>Because the first match wins, order matters. If you test <code>score &gt;= 70</code> before <code>score &gt;= 90</code>, a score of 95 would stop at the first branch. Put the strictest test first.</p>`,
      ],
      examples: [
        {
          code: C`int temp = 25;
if (temp >= 30) {
    cout << "hot" << endl;
} else if (temp >= 20) {    // only checked when temp < 30
    cout << "warm" << endl;
} else {
    cout << "cold" << endl;
}`,
          output: 'warm',
          caption: 'The first true branch runs; the rest are skipped.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'else if (cond) { ... }', meaning: 'another test, tried only when every test above it was false' },
      ],
    },
    compare: {
      py: { code: 'n = 0\nif n > 0:\n    print("positive")\nelif n < 0:\n    print("negative")\nelse:\n    print("zero")', outcome: 'Prints zero', ok: true },
      cpp: { code: C`int n = 0;
if (n > 0) {
    cout << "positive" << endl;
} else if (n < 0) {
    cout << "negative" << endl;
} else {
    cout << "zero" << endl;
}`, outcome: 'Prints zero', ok: true },
      text: 'Python\'s <code>elif</code> is two words in C++: <code>else if</code>. Everything else about the chain works the same.',
    },
    refresher: [
      'Chain with <code>else if (cond) { ... }</code>. The first true condition runs and the rest are skipped.',
      'Test the strictest condition first.',
    ],
    hints: [
      'Start with the 90 test, then 80, then 70, then a final <code>else</code>.',
      'Each branch prints one letter. Use <code>&gt;=</code> so that exactly 90 counts as an A.',
    ],
    inPython: {
      code: 'score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("F")',
      note: '<code>elif</code> becomes <code>else if</code>, and braces replace the indentation.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int score;
    cin >> score;
    // print the letter grade
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int score;
    cin >> score;
    if (score >= 90) {
        cout << "A" << endl;
    } else if (score >= 80) {
        cout << "B" << endl;
    } else if (score >= 70) {
        cout << "C" << endl;
    } else {
        cout << "F" << endl;
    }
    return 0;
}`,
    require: [{ pattern: 'else\\s+if', message: 'Use else if' }],
    tests: [
      { name: 'High A', stdin: '95\n', expected: 'A' },
      { name: 'Exactly 90', stdin: '90\n', expected: 'A' },
      { name: 'A B', stdin: '85\n', expected: 'B' },
      { name: 'Exactly 70', stdin: '70\n', expected: 'C' },
      { name: 'Just below', stdin: '69\n', expected: 'F' },
      { name: 'Zero', stdin: '0\n', expected: 'F' },
    ],
  },

  // 3. fix: parentheses
  {
    id: 'c2-fix-if-parens',
    title: 'The missing parentheses',
    kind: 'fix',
    task: 'This does not compile. Fix it so that 12 prints <em>big</em> and 3 prints <em>small</em>.',
    errorMatch: "expected '\\('",
    gloss: 'After <code>if</code> the compiler expects an opening parenthesis, because the condition must always be inside parentheses.',
    introduces: [],
    refresher: [
      'In C++ the condition of an <code>if</code> always needs parentheses: <code>if (n &gt; 5) { ... }</code>.',
      'The first <code>error:</code> line is the one to read; the lines after it are often knock-on effects.',
    ],
    hints: [
      'Look at the line with <code>if</code>. What surrounds the condition in Python, and what does C++ want?',
      'Put <code>(</code> before the condition and <code>)</code> after it, before the brace.',
    ],
    inPython: {
      code: 'n = 12\nif n > 5:\n    print("big")\nelse:\n    print("small")',
      note: 'Python ends the condition with a colon. C++ has no colon: the parentheses and the braces do that job.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if n > 5 {
        cout << "big" << endl;
    } else {
        cout << "small" << endl;
    }
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n > 5) {
        cout << "big" << endl;
    } else {
        cout << "small" << endl;
    }
    return 0;
}`,
    tests: [
      { name: 'Big', stdin: '12\n', expected: 'big' },
      { name: 'Small', stdin: '3\n', expected: 'small' },
      { name: 'Edge', stdin: '5\n', expected: 'small' },
    ],
  },

  // 4. braces make blocks
  {
    id: 'c2-braces',
    title: 'Braces make the block',
    kind: 'concept',
    task: 'Read a number. If it is negative, print <em>negative</em> and then <em>check the sign</em>, on two lines. After that, whatever the number, print <em>done</em>. The starter is misleading: fix it.',
    introduces: [],
    teach: {
      body: [
        `<p>In Python, indentation <em>is</em> the block. In C++ the compiler ignores indentation completely: only braces count. If you leave the braces off an <code>if</code>, the <code>if</code> controls <em>exactly one</em> following statement and nothing more, however the lines are indented.</p>`,
        `<p>That makes a nasty trap. The second line below is indented like part of the <code>if</code>, but it is not: the compiler reads it as a separate statement that always runs. The same blindness makes an <code>else</code> attach to the nearest <code>if</code> above it, whatever the layout suggests (the "dangling else"). The cure is a habit: always write the braces, even for one line.</p>`,
      ],
      examples: [
        {
          code: C`int n = 5;
if (n < 0)
    cout << "negative" << endl;
    cout << "indented, but not controlled" << endl;   // always runs!`,
          output: 'indented, but not controlled',
          caption: 'Without braces only the first line belongs to the if.',
          wrap: true,
        },
        {
          code: C`int n = 5;
if (n < 0) {
    cout << "negative" << endl;
    cout << "both lines belong to the if" << endl;
}
cout << "after the block" << endl;`,
          output: 'after the block',
          caption: 'With braces the block is exactly what you see.',
          wrap: true,
        },
      ],
      terms: [
        { code: '{ ... }', meaning: 'the block: everything between the braces belongs together' },
        { code: 'if (c) stmt;', meaning: 'without braces the if controls only the one statement after it' },
      ],
    },
    compare: {
      py: { code: 'n = 5\nif n < 0:\n    print("negative")\n    print("check the sign")\nprint("done")', outcome: 'Prints only done: indentation is the block', ok: true },
      cpp: { code: C`int n = 5;
if (n < 0)
    cout << "negative" << endl;
    cout << "check the sign" << endl;
cout << "done" << endl;`, outcome: 'Prints check the sign, then done', ok: true },
      text: 'Python\'s indentation decides the block. C++ ignores it, so a second line without braces is outside the <code>if</code> even when it looks inside.',
    },
    refresher: [
      'Only braces make a block in C++. Without braces an <code>if</code> controls just the next statement.',
      'Write the braces every time, even around one line.',
    ],
    hints: [
      'Count which lines the <code>if</code> controls in the starter. Which line runs even for a positive number?',
      'Wrap the two prints that belong to the if in braces.',
    ],
    inPython: {
      code: 'n = 7\nif n < 0:\n    print("negative")\n    print("check the sign")\nprint("done")',
      note: 'The indentation alone keeps the second print inside the <code>if</code>. C++ would need braces to say the same.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n < 0)
        cout << "negative" << endl;
        cout << "check the sign" << endl;
    cout << "done" << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n < 0) {
        cout << "negative" << endl;
        cout << "check the sign" << endl;
    }
    cout << "done" << endl;
    return 0;
}`,
    require: [{ pattern: '\\{[\\s\\S]*check the sign[\\s\\S]*\\}', message: 'Put the two prints inside braces' }],
    tests: [
      { name: 'Negative prints both', stdin: '-4\n', expected: 'negative\ncheck the sign\ndone' },
      { name: 'Positive prints only done', stdin: '7\n', expected: 'done' },
      { name: 'Zero', stdin: '0\n', expected: 'done' },
    ],
  },

  // 5. predict: braces trap
  {
    id: 'c2-predict-braces',
    title: 'What does the compiler see?',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    refresher: [
      'Without braces an <code>if</code> controls one statement. An <code>else</code> belongs to the nearest <code>if</code> above it.',
      'The compiler ignores indentation; read the braces, not the layout.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

int main() {
    int n = 3;
    if (n > 5)
        cout << "big" << endl;
        cout << "really big" << endl;
    return 0;
}`,
        choices: ['big', 'Nothing', 'really big'],
        answer: 2,
        why: 'Only the first print belongs to the if, and n is not above 5, so it is skipped. The second print is a separate statement and always runs.',
        output: 'really big',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

int main() {
    int a = 1;
    int b = 5;
    cout << "start" << endl;
    if (a > 3)
        if (b > 3)
            cout << "X" << endl;
    else
        cout << "Y" << endl;
    cout << "end" << endl;
    return 0;
}`,
        choices: ['start, Y, end', 'start, end', 'start, X, end'],
        answer: 1,
        why: 'The else belongs to the inner if, not the outer one, whatever the indentation suggests. The outer test fails, so both inner parts are skipped.',
        output: 'start\nend',
      },
    ],
  },

  // 6. logical operators
  {
    id: 'c2-logical',
    title: 'and, or, not',
    kind: 'concept',
    task: 'Read a year. Print <em>leap</em> if it is divisible by 4 but not by 100, or if it is divisible by 400. Otherwise print <em>not leap</em>.',
    introduces: ['logical-ops', 'not-op', 'alt-operators'],
    teach: {
      body: [
        `<p>To combine conditions, Python uses the words <code>and</code>, <code>or</code> and <code>not</code>. C++ uses symbols: <code>&amp;&amp;</code> (and), <code>||</code> (or) and <code>!</code> (not). <code>a &amp;&amp; b</code> is true only if both are true; <code>a || b</code> is true if at least one is; <code>!a</code> flips true and false. The test <code>x == 0 || x == 1</code> reads "x is 0 or x is 1".</p>`,
        `<p>A condition produces a <code>bool</code>, which you can also store: <code>bool adult = age &gt;= 18;</code>. And a surprise for Python programmers: C++ does accept the words <code>and</code>, <code>or</code> and <code>not</code> as spare spellings of the symbols, but almost all C++ code uses the symbols, so learn to read them. Use parentheses to group, for example <code>(a &amp;&amp; b) || c</code>. Both <code>&amp;&amp;</code> and <code>||</code> stop early: the right side is not evaluated when the left side already decides the answer.</p>`,
      ],
      examples: [
        {
          code: C`int age = 25;
bool member = false;
if (age >= 18 && !member) {      // adult AND not a member
    cout << "pay full price" << endl;
}
bool child = age < 13;           // a condition can be stored in a bool
if (child || age > 65) {         // child OR senior
    cout << "discount" << endl;
} else {
    cout << "no discount" << endl;
}`,
          output: 'pay full price\nno discount',
          caption: 'The three operators, and a stored bool.',
          wrap: true,
        },
        {
          code: C`int x = 4;
if (x > 0 and x < 10) {          // the word form works too
    cout << "single digit" << endl;
}`,
          output: 'single digit',
          caption: 'The words are legal spellings, but rare in real code.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'a && b', meaning: 'true only when both are true (Python: and)' },
        { code: 'a || b', meaning: 'true when at least one is true (Python: or)' },
        { code: '!a', meaning: 'flips true and false (Python: not)' },
        { code: 'and, or, not', meaning: 'legal spellings of the symbols; the symbols are what you will read' },
      ],
    },
    compare: {
      py: { code: 'age = 25\nif age >= 18 and not age > 65:\n    print("working age")', outcome: 'Prints working age', ok: true },
      cpp: { code: C`int age = 25;
if (age >= 18 && !(age > 65)) {
    cout << "working age" << endl;
}`, outcome: 'Prints working age', ok: true },
      text: 'The words <code>and</code>, <code>or</code> and <code>not</code> become <code>&amp;&amp;</code>, <code>||</code> and <code>!</code>. A condition that is not a single comparison needs parentheses around the part you negate.',
    },
    refresher: [
      '<code>&amp;&amp;</code> is and, <code>||</code> is or, <code>!</code> is not. Group with parentheses.',
      '<code>y % 4 == 0</code> tests divisibility: the remainder is zero.',
    ],
    hints: [
      'Two ways to be a leap year: <code>(divisible by 4 and not by 100)</code> or <code>divisible by 400</code>.',
      'Write it as one condition: <code>(y % 4 == 0 &amp;&amp; y % 100 != 0) || y % 400 == 0</code>.',
    ],
    inPython: {
      code: 'y = 2024\nif (y % 4 == 0 and y % 100 != 0) or y % 400 == 0:\n    print("leap")\nelse:\n    print("not leap")',
      note: 'Python\'s <code>and</code>/<code>or</code> become <code>&amp;&amp;</code>/<code>||</code>; the structure is identical.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int y;
    cin >> y;
    // print leap or not leap
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int y;
    cin >> y;
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
        cout << "leap" << endl;
    } else {
        cout << "not leap" << endl;
    }
    return 0;
}`,
    require: [{ pattern: '&&|\\band\\b', message: 'Combine the conditions with && or ||' }],
    tests: [
      { name: 'Ordinary leap year', stdin: '2024\n', expected: 'leap' },
      { name: 'Century is not leap', stdin: '1900\n', expected: 'not leap' },
      { name: 'Divisible by 400', stdin: '2000\n', expected: 'leap' },
      { name: 'Odd year', stdin: '2023\n', expected: 'not leap' },
    ],
  },

  // 7. predict: truthiness and = vs ==
  {
    id: 'c2-truthiness',
    title: 'Numbers as conditions, and = vs ==',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: ['assign-in-condition'],
    teach: {
      body: [
        `<p>A condition does not have to be a comparison. C++ treats the number <code>0</code> as false and every other number as true, so <code>if (n)</code> means "n is not zero". Python does the same for numbers (it also treats an empty list or string as false, which C++ does not; that comes later).</p>`,
        `<p>This leads to the most famous C++ slip. <code>=</code> stores a value and <em>gives that value back</em>, so <code>if (x = 5)</code> is legal: it stores 5 in <code>x</code>, then tests 5, which is not zero, so the condition is always true. Python refuses this (a syntax error), but C++ just runs it. Compilers often warn about it; the habit is to write <code>==</code> to compare, and to read any lone <code>=</code> inside a condition as a bug.</p>`,
      ],
      examples: [
        {
          code: C`int stock = 0;
if (stock) {                         // 0 is false
    cout << "in stock" << endl;
} else {
    cout << "sold out" << endl;
}`,
          output: 'sold out',
          caption: 'Zero is false; anything else is true.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'if (n)', meaning: 'true when n is not zero' },
        { code: 'if (x = 5)', meaning: 'a bug: stores 5 in x, then tests 5, so it is always true' },
      ],
    },
    refresher: [
      'In a condition, 0 is false and any other number is true. <code>!</code> flips it.',
      '<code>=</code> stores, <code>==</code> compares. <code>if (x = 5)</code> overwrites x and is always true.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

int main() {
    int a = 7;
    int b = 0;
    if (a) { cout << "a is true" << endl; }
    if (b) { cout << "b is true" << endl; }
    if (!b) { cout << "b is false" << endl; }
    return 0;
}`,
        choices: ['Only: a is true', 'a is true, then b is false', 'Compile error: needs a bool'],
        answer: 1,
        why: 'Any non-zero number counts as true, so a passes. b is 0, which is false, so its if is skipped, and <code>!b</code> is true.',
        output: 'a is true\nb is false',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

int main() {
    int x = 3;
    if (x = 5) {
        cout << "yes " << x << endl;
    } else {
        cout << "no " << x << endl;
    }
    return 0;
}`,
        choices: ['no 3', 'yes 5', 'yes 3'],
        answer: 1,
        why: 'x = 5 stores 5 in x and the condition then sees 5, which is true. So it prints yes, and x is now 5.',
        output: 'yes 5',
      },
    ],
  },

  // 8. switch
  {
    id: 'c2-switch',
    title: 'switch',
    kind: 'concept',
    task: 'Read one character. For <em>R</em> print <em>stop</em>, for <em>Y</em> print <em>wait</em>, for <em>G</em> print <em>go</em>, and for anything else print <em>unknown</em>.',
    introduces: ['switch', 'break-continue'],
    teach: {
      body: [
        `<p>When one value decides between many branches, <code>switch</code> is tidier than a long <code>else if</code> chain. You write <code>switch (value) { case 1: ... break; case 2: ... break; default: ... }</code>. The program jumps to the <code>case</code> that equals the value, runs from there, and <code>break;</code> leaves the switch. <code>default:</code> catches everything else. The value must be a whole number or a <code>char</code> (not a string), and each case label must be a fixed value.</p>`,
        `<p>Python has no <code>switch</code> (a dictionary or an <code>if</code>/<code>elif</code> chain does the job). A case that declares a variable needs its own braces: <code>case 1: { int d = n * 2; ... break; }</code>. Cases do not stop by themselves: forgetting <code>break</code> is a classic trap that the next lesson shows.</p>`,
      ],
      examples: [
        {
          code: C`int day = 3;
switch (day) {
    case 1:
        cout << "Monday" << endl;
        break;                      // leave the switch
    case 3:
        cout << "Wednesday" << endl;
        break;
    default:                        // nothing above matched
        cout << "some other day" << endl;
}`,
          output: 'Wednesday',
          caption: 'Jump to the matching case, then break.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'switch (v) { ... }', meaning: 'jumps to the case that equals v' },
        { code: 'case 1:', meaning: 'a label; the value must be a fixed whole number or char' },
        { code: 'break;', meaning: 'leaves the switch' },
        { code: 'default:', meaning: 'runs when no case matched' },
      ],
    },
    compare: {
      py: { code: 'c = "G"\nif c == "R":\n    print("stop")\nelif c == "G":\n    print("go")\nelse:\n    print("unknown")', outcome: 'Prints go', ok: true },
      cpp: { code: C`char c = 'G';
switch (c) {
    case 'R':
        cout << "stop" << endl;
        break;
    case 'G':
        cout << "go" << endl;
        break;
    default:
        cout << "unknown" << endl;
}`, outcome: 'Prints go', ok: true },
      text: 'Python spells this as an <code>elif</code> chain (there is no <code>match</code> before 3.10). C++ jumps straight to the matching <code>case</code> and needs <code>break</code> to stop.',
    },
    refresher: [
      '<code>switch (v) { case X: ...; break; default: ...; }</code>. Each case ends with <code>break;</code>.',
      'A <code>char</code> case label is written in single quotes: <code>case \'R\':</code>.',
    ],
    hints: [
      'Read the character into a <code>char</code>, then switch on it.',
      'Three cases with their <code>break</code> and a <code>default</code> for unknown.',
    ],
    inPython: {
      code: 'c = "Y"\nif c == "R":\n    print("stop")\nelif c == "Y":\n    print("wait")\nelif c == "G":\n    print("go")\nelse:\n    print("unknown")',
      note: 'An <code>if</code>/<code>elif</code> chain does the same job in Python. C++ <code>switch</code> is a jump table on a number or a char.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    char c;
    cin >> c;
    // print stop, wait, go or unknown
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    char c;
    cin >> c;
    switch (c) {
        case 'R':
            cout << "stop" << endl;
            break;
        case 'Y':
            cout << "wait" << endl;
            break;
        case 'G':
            cout << "go" << endl;
            break;
        default:
            cout << "unknown" << endl;
    }
    return 0;
}`,
    require: [{ pattern: 'switch\\s*\\(', message: 'Use a switch' }],
    tests: [
      { name: 'Red', stdin: 'R\n', expected: 'stop' },
      { name: 'Yellow', stdin: 'Y\n', expected: 'wait' },
      { name: 'Green', stdin: 'G\n', expected: 'go' },
      { name: 'Other letter', stdin: 'X\n', expected: 'unknown' },
      { name: 'Case matters', stdin: 'g\n', expected: 'unknown' },
    ],
  },

  // 9. predict: fallthrough
  {
    id: 'c2-predict-fallthrough',
    title: 'Falling through',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    teach: {
      body: [
        `<p>A <code>case</code> is only a label that says where to start. Once the program jumps in, it keeps running down through the following cases until it meets a <code>break</code> or reaches the closing brace. This is called <em>fallthrough</em>. Forgetting a <code>break</code> is a classic bug: two cases run when you wanted one.</p>`,
        `<p>Fallthrough can be useful on purpose. Several labels in a row with no code between them share one block: <code>case 'a': case 'e': ...</code> means "a or e".</p>`,
      ],
      examples: [
        {
          code: C`int n = 1;
switch (n) {
    case 1:
        cout << "one" << endl;
    case 2:                        // no break above: execution runs on into here
        cout << "two" << endl;
        break;
    case 3:
        cout << "three" << endl;
}`,
          output: 'one\ntwo',
          caption: 'Starting at case 1 also runs case 2 until the break.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'case A: case B:', meaning: 'two labels sharing one block' },
        { code: 'no break', meaning: 'execution falls through into the next case' },
      ],
    },
    refresher: [
      'Without <code>break</code>, execution runs on into the next case, whether or not its label matches.',
      'Labels stacked with no code between them share one block.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

int main() {
    int n = 2;
    switch (n) {
        case 1:
            cout << "one" << endl;
            break;
        case 2:
            cout << "two" << endl;
        case 3:
            cout << "three" << endl;
            break;
        default:
            cout << "other" << endl;
    }
    return 0;
}`,
        choices: ['two', 'two, then three', 'two, three, other'],
        answer: 1,
        why: 'Case 2 has no break, so execution falls into case 3, which prints three and breaks. The default is never reached.',
        output: 'two\nthree',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

int main() {
    char c = 'e';
    switch (c) {
        case 'a':
        case 'e':
        case 'i':
            cout << "vowel" << endl;
            break;
        default:
            cout << "consonant" << endl;
    }
    return 0;
}`,
        choices: ['consonant', 'vowel', 'vowel, then consonant'],
        answer: 1,
        why: 'The labels a, e and i share one block. Jumping to e lands on the print, and break leaves the switch before the default.',
        output: 'vowel',
      },
    ],
  },

  // 10. fix: jump past a declaration
  {
    id: 'c2-fix-switch-decl',
    title: 'A variable inside a case',
    kind: 'fix',
    task: 'This does not compile. Fix it so that 1 prints <em>2</em>, 2 prints <em>two</em> and anything else prints <em>other</em>.',
    errorMatch: 'cannot jump from switch statement to this case label',
    gloss: 'A <code>case</code> that declares a variable must have its own braces, otherwise the other cases would jump past the declaration.',
    introduces: [],
    refresher: [
      'All cases share one scope, so a variable declared in a case needs braces: <code>case 1: { int d = 1; ... break; }</code>.',
      'Read the first <code>error:</code> line; the notes after it point at the declaration.',
    ],
    hints: [
      'The error is at <code>case 2:</code>, but the trouble is the variable declared inside case 1.',
      'Put braces around the body of case 1, so the variable lives only there.',
    ],
    inPython: {
      code: 'n = 1\nif n == 1:\n    doubled = n * 2\n    print(doubled)\nelif n == 2:\n    print("two")',
      note: 'Python has no block scope here, so this is never a problem. A C++ switch is one single block unless you add braces.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    switch (n) {
        case 1:
            int doubled = n * 2;
            cout << doubled << endl;
            break;
        case 2:
            cout << "two" << endl;
            break;
        default:
            cout << "other" << endl;
    }
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    switch (n) {
        case 1: {
            int doubled = n * 2;
            cout << doubled << endl;
            break;
        }
        case 2:
            cout << "two" << endl;
            break;
        default:
            cout << "other" << endl;
    }
    return 0;
}`,
    require: [{ pattern: 'switch\\s*\\(', message: 'Keep using the switch' }],
    tests: [
      { name: 'Case 1', stdin: '1\n', expected: '2' },
      { name: 'Case 2', stdin: '2\n', expected: 'two' },
      { name: 'Default', stdin: '9\n', expected: 'other' },
    ],
  },

  // 11. while
  {
    id: 'c2-while',
    title: 'while',
    kind: 'concept',
    task: 'Read a positive number n. Print n, n-1, ... down to 1, each on its own line, then print <em>Liftoff!</em>.',
    introduces: ['while'],
    teach: {
      body: [
        `<p><code>while (condition) { ... }</code> repeats the block for as long as the condition is true. The condition is checked before every pass, so it may run zero times. As in Python, something inside the loop has to change the condition, or the loop never ends. The only differences are the parentheses and the braces.</p>`,
        `<p>To add one to a variable, write <code>i++;</code> or <code>i = i + 1;</code>, as you saw in stage 1. Most <code>while</code> loops follow one pattern: set up a counter, test it, do the work, update the counter.</p>`,
      ],
      examples: [
        {
          code: C`int i = 1;                 // set up
while (i <= 3) {           // test before each pass
    cout << i << endl;     // work
    i++;                   // update, or the loop would never end
}`,
          output: '1\n2\n3',
          caption: 'The counter pattern.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'while (cond) { ... }', meaning: 'repeats the block while the condition is true' },
      ],
    },
    compare: {
      py: { code: 'i = 1\nwhile i <= 3:\n    print(i)\n    i += 1', outcome: 'Prints 1, 2, 3', ok: true },
      cpp: { code: C`int i = 1;
while (i <= 3) {
    cout << i << endl;
    i++;
}`, outcome: 'Prints 1, 2, 3', ok: true },
      text: 'Python\'s <code>while</code> takes a colon and indentation; C++ takes parentheses and braces. For the update, C++ also has the short form <code>i++</code>.',
    },
    refresher: [
      '<code>while (cond) { ... }</code> checks the condition before each pass. Change something inside so it can become false.',
      '<code>i--;</code> subtracts one, <code>i++;</code> adds one.',
    ],
    hints: [
      'Read n, then loop while n is at least 1, printing it and then subtracting 1.',
      'After the loop ends, print the final line once.',
    ],
    inPython: {
      code: 'n = 3\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("Liftoff!")',
      note: 'Same loop. C++ writes <code>n--;</code> or <code>n -= 1;</code> for the update.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // count down, then print Liftoff!
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    while (n >= 1) {
        cout << n << endl;
        n--;
    }
    cout << "Liftoff!" << endl;
    return 0;
}`,
    require: [{ pattern: 'while\\s*\\(', message: 'Use a while loop' }],
    tests: [
      { name: 'From 3', stdin: '3\n', expected: '3\n2\n1\nLiftoff!' },
      { name: 'From 1', stdin: '1\n', expected: '1\nLiftoff!' },
      { name: 'From 5', stdin: '5\n', expected: '5\n4\n3\n2\n1\nLiftoff!' },
    ],
  },

  // 12. for
  {
    id: 'c2-for',
    title: 'The classic for loop',
    kind: 'concept',
    task: 'Read n. Print the squares 1, 4, 9, ... up to n squared on one line, separated by spaces.',
    introduces: ['for-classic'],
    teach: {
      body: [
        `<p>C++'s <code>for</code> has three parts in the parentheses, separated by semicolons: <code>for (int i = 0; i &lt; n; i++) { ... }</code>. First the <em>start</em> (<code>int i = 0</code>) runs once. Then, before every pass, the <em>test</em> (<code>i &lt; n</code>) is checked. After every pass the <em>update</em> (<code>i++</code>) runs. This is exactly the <code>while</code> counter pattern, folded onto one line. It matches Python's <code>for i in range(n)</code>: it runs with i = 0, 1, ..., n-1.</p>`,
        `<p>Python's <code>range</code> has options, and so does the C++ loop, because you write the three parts yourself. Counting down: <code>for (int i = 5; i &gt;= 1; i--)</code>. Step of two: <code>for (int i = 0; i &lt; 10; i += 2)</code>. The variable <code>i</code> exists only inside the loop; using it after the closing brace is an error. (Python's loop variable stays alive afterwards; C++'s does not.)</p>`,
      ],
      examples: [
        {
          code: C`for (int i = 0; i < 3; i++) {       // like: for i in range(3)
    cout << i << " ";
}
cout << endl;`,
          output: '0 1 2',
          caption: 'Counting up: start, test, update.',
          wrap: true,
        },
        {
          code: C`for (int i = 5; i >= 1; i--) {      // counting down
    cout << i << " ";
}
cout << endl;
for (int j = 0; j < 10; j += 2) {   // step of two
    cout << j << " ";
}
cout << endl;`,
          output: '5 4 3 2 1\n0 2 4 6 8',
          caption: 'Counting down, and counting by twos.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'for (start; test; update)', meaning: 'start runs once; test is checked before each pass; update runs after each pass' },
        { code: 'i < n', meaning: 'the usual test: i takes the values 0 to n-1, like range(n)' },
        { code: 'int i inside for', meaning: 'the variable exists only inside the loop' },
      ],
    },
    compare: {
      py: { code: 'for i in range(0, 10, 2):\n    print(i, end=" ")\nprint()', outcome: 'Prints 0 2 4 6 8', ok: true },
      cpp: { code: C`for (int i = 0; i < 10; i += 2) {
    cout << i << " ";
}
cout << endl;`, outcome: 'Prints 0 2 4 6 8', ok: true },
      text: '<code>range(start, stop, step)</code> becomes the three parts of the <code>for</code>. The stop value is written as a test, so you pick <code>&lt;</code> or <code>&lt;=</code> yourself.',
    },
    refresher: [
      '<code>for (int i = 0; i &lt; n; i++)</code> runs i = 0 to n-1. For 1 to n write <code>i = 1; i &lt;= n</code>.',
      'The loop variable is local to the loop; it does not exist after the closing brace.',
    ],
    hints: [
      'Loop i from 1 up to and including n.',
      'Print <code>i * i</code> followed by a space each pass, and one <code>endl</code> after the loop.',
    ],
    inPython: {
      code: 'n = 5\nfor i in range(1, n + 1):\n    print(i * i, end=" ")\nprint()',
      note: 'Python needs <code>n + 1</code> to include n; the C++ test <code>i &lt;= n</code> says it directly.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // print 1 4 9 ... n*n on one line
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cout << i * i << " ";
    }
    cout << endl;
    return 0;
}`,
    require: [{ pattern: 'for\\s*\\(', message: 'Use a for loop' }],
    tests: [
      { name: 'Five squares', stdin: '5\n', expected: '1 4 9 16 25' },
      { name: 'One', stdin: '1\n', expected: '1' },
      { name: 'Three', stdin: '3\n', expected: '1 4 9' },
      { name: 'Ten', stdin: '10\n', expected: '1 4 9 16 25 36 49 64 81 100' },
    ],
  },

  // 13. predict: loop bounds
  {
    id: 'c2-predict-for-bounds',
    title: 'Where does the loop stop?',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    refresher: [
      '<code>i &lt; n</code> stops before n; <code>i &lt;= n</code> includes n. The test is checked before every pass.',
      'The update (<code>i -= 3</code>, <code>i--</code>) runs after each pass, before the next test.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i <= 3; i++) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}`,
        choices: ['0 1 2', '0 1 2 3', '1 2 3'],
        answer: 1,
        why: 'The test is <code>i &lt;= 3</code>, so 3 still passes and is printed. With <code>i &lt; 3</code> it would stop at 2.',
        output: '0 1 2 3',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

int main() {
    for (int i = 10; i > 0; i -= 3) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}`,
        choices: ['10 7 4 1', '10 7 4', '10 7 4 1 -2'],
        answer: 0,
        why: 'The loop subtracts 3 each pass: 10, 7, 4, 1. Next would be -2, which fails <code>i &gt; 0</code>, so the loop stops.',
        output: '10 7 4 1',
      },
    ],
  },

  // 14. for counting down by two
  {
    id: 'c2-for-countdown',
    title: 'Count down by twos',
    kind: 'program',
    task: 'Read n. Print n, n-2, n-4, ... down to the last value that is not below 0, on one line separated by spaces.',
    introduces: [],
    refresher: [
      'A countdown loop: <code>for (int i = n; i &gt;= 0; i -= 2)</code>.',
      'Print each value followed by a space, then one <code>endl</code> at the end.',
    ],
    hints: [
      'Start the loop at n and subtract 2 in the update part.',
      'Keep going while i is at least 0.',
    ],
    inPython: {
      code: 'n = 9\nfor i in range(n, -1, -2):\n    print(i, end=" ")\nprint()',
      note: 'Python\'s stop value <code>-1</code> is exclusive. In C++ you write the test <code>i &gt;= 0</code> yourself.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // print n, n-2, n-4 ... down to 0 or 1
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = n; i >= 0; i -= 2) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}`,
    require: [{ pattern: 'for\\s*\\(', message: 'Use a for loop' }],
    tests: [
      { name: 'Odd start ends at 1', stdin: '9\n', expected: '9 7 5 3 1' },
      { name: 'Even start ends at 0', stdin: '10\n', expected: '10 8 6 4 2 0' },
      { name: 'Zero', stdin: '0\n', expected: '0' },
      { name: 'One', stdin: '1\n', expected: '1' },
    ],
  },

  // 15. fix: loop variable scope
  {
    id: 'c2-fix-loop-scope',
    title: 'The loop variable is local',
    kind: 'fix',
    task: 'This does not compile. It should print 1, 2, 3 on separate lines and then <em>after: 4</em>, where the counter ended up. Fix it.',
    errorMatch: 'use of undeclared identifier',
    gloss: 'The variable <code>i</code> was created inside the <code>for</code> parentheses, so it ceases to exist after the loop. The last line cannot see it.',
    introduces: [],
    refresher: [
      'A variable declared in the <code>for</code> parentheses lives only inside that loop.',
      'To use the counter afterwards, declare it before the loop and leave the start part as just <code>i = 1</code>.',
    ],
    hints: [
      'Which line mentions <code>i</code> after the loop has ended?',
      'Declare <code>int i;</code> above the loop and remove the <code>int</code> from inside the parentheses.',
    ],
    inPython: {
      code: 'for i in range(1, 4):\n    print(i)\nprint("after:", i + 1)',
      note: 'Python\'s loop variable survives the loop (it stays 3). C++ drops it at the closing brace unless you declared it outside.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 3; i++) {
        cout << i << endl;
    }
    cout << "after: " << i << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int i;
    for (i = 1; i <= 3; i++) {
        cout << i << endl;
    }
    cout << "after: " << i << endl;
    return 0;
}`,
    tests: [{ name: 'Counter ends at 4', stdin: '', expected: '1\n2\n3\nafter: 4' }],
  },

  // 16. break and continue
  {
    id: 'c2-break-continue',
    title: 'break and continue',
    kind: 'concept',
    task: 'Read n. Print the numbers from 1 to n on one line, skipping multiples of 3 and stopping completely before any number above 10.',
    introduces: [],
    teach: {
      body: [
        `<p><code>break;</code> leaves the nearest loop at once. <code>continue;</code> skips the rest of the current pass and jumps to the next one (in a <code>for</code>, the update still runs). Both work exactly as in Python. A common pattern is <code>while (true) { ... if (done) { break; } }</code>: a loop that stops from the inside.</p>`,
        `<p>In a nested loop they affect only the innermost one. <code>break</code> inside a <code>switch</code> leaves the switch, not the loop around it, which sometimes surprises people.</p>`,
      ],
      examples: [
        {
          code: C`for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;            // skip even numbers
    }
    if (i > 7) {
        break;               // stop the whole loop
    }
    cout << i << " ";
}
cout << endl;`,
          output: '1 3 5 7',
          caption: 'continue skips one pass; break ends the loop.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'break;', meaning: 'leaves the nearest loop (or switch)' },
        { code: 'continue;', meaning: 'skips to the next pass of the loop' },
      ],
    },
    compare: {
      py: { code: 'for i in range(1, 11):\n    if i % 2 == 0:\n        continue\n    if i > 7:\n        break\n    print(i, end=" ")\nprint()', outcome: 'Prints 1 3 5 7', ok: true },
      cpp: { code: C`for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue;
    }
    if (i > 7) {
        break;
    }
    cout << i << " ";
}
cout << endl;`, outcome: 'Prints 1 3 5 7', ok: true },
      text: '<code>break</code> and <code>continue</code> mean the same in both languages. Only the loop and condition syntax differ.',
    },
    refresher: [
      '<code>continue;</code> jumps to the next pass; <code>break;</code> ends the loop.',
      'Put the <code>break</code> test before the print so that a number above 10 is never shown.',
    ],
    hints: [
      'Loop i from 1 to n. Inside, first check whether to stop, then whether to skip.',
      '<code>i &gt; 10</code> triggers the break; <code>i % 3 == 0</code> triggers the continue.',
    ],
    inPython: {
      code: 'n = 12\nfor i in range(1, n + 1):\n    if i > 10:\n        break\n    if i % 3 == 0:\n        continue\n    print(i, end=" ")\nprint()',
      note: 'Identical logic. Only the loop header and the braces change in C++.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // print 1..n, skipping multiples of 3, stopping above 10
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        if (i > 10) {
            break;
        }
        if (i % 3 == 0) {
            continue;
        }
        cout << i << " ";
    }
    cout << endl;
    return 0;
}`,
    require: [{ pattern: '\\bbreak\\b', message: 'Use break' }, { pattern: '\\bcontinue\\b', message: 'Use continue' }],
    tests: [
      { name: 'Small n', stdin: '5\n', expected: '1 2 4 5' },
      { name: 'Reaches the break', stdin: '12\n', expected: '1 2 4 5 7 8 10' },
      { name: 'Very large n', stdin: '20\n', expected: '1 2 4 5 7 8 10' },
      { name: 'Tiny', stdin: '3\n', expected: '1 2' },
    ],
  },

  // 17. do ... while
  {
    id: 'c2-do-while',
    title: 'do ... while',
    kind: 'concept',
    task: 'Read a whole number n (zero or more). Print how many digits it has. Zero has one digit.',
    introduces: ['do-while'],
    teach: {
      body: [
        `<p>A <code>while</code> loop may run zero times. <code>do { ... } while (condition);</code> runs the block first and checks the condition <em>afterwards</em>, so the body always runs at least once. Note the semicolon after the closing parenthesis; it is required here and nowhere else in loops. Python has no <code>do ... while</code>; you imitate it with <code>while True:</code> and a <code>break</code> at the bottom.</p>`,
        `<p>It fits tasks where the first pass must happen anyway. Counting digits is one: dividing a number by 10 repeatedly until nothing is left, where 0 still counts as one digit.</p>`,
      ],
      examples: [
        {
          code: C`int n = 305;
int steps = 0;
do {
    n = n / 10;            // drop the last digit
    steps++;
} while (n > 0);           // checked after the body; note the semicolon
cout << steps << endl;`,
          output: '3',
          caption: 'The body runs first, then the test.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'do { ... } while (cond);', meaning: 'runs the block, then repeats while the condition holds; always at least once' },
      ],
    },
    compare: {
      py: { code: 'n = 0\nsteps = 0\nwhile True:\n    n //= 10\n    steps += 1\n    if n == 0:\n        break\nprint(steps)', outcome: 'Prints 1, imitating do ... while', ok: true },
      cpp: { code: C`int n = 0;
int steps = 0;
do {
    n = n / 10;
    steps++;
} while (n > 0);
cout << steps << endl;`, outcome: 'Prints 1', ok: true },
      text: 'Python has to fake this with <code>while True</code> and a <code>break</code>. C++ has it built in.',
    },
    refresher: [
      '<code>do { ... } while (cond);</code> checks after the body, so the body runs at least once. Keep the final semicolon.',
      '<code>n / 10</code> drops the last digit of a whole number.',
    ],
    hints: [
      'Each pass divides n by 10 and counts one digit.',
      'Repeat while n is still above 0 after dividing. For n = 0 the first pass already counts one digit.',
    ],
    inPython: {
      code: 'print(len(str(305)))',
      note: 'Python can count characters of the text. In C++ you do it with arithmetic, since strings are not covered yet.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // print the number of digits in n
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int digits = 0;
    do {
        n = n / 10;
        digits++;
    } while (n > 0);
    cout << digits << endl;
    return 0;
}`,
    require: [{ pattern: '\\bdo\\b', message: 'Use do ... while' }],
    tests: [
      { name: 'Five digits', stdin: '12345\n', expected: '5' },
      { name: 'Zero has one digit', stdin: '0\n', expected: '1' },
      { name: 'Single digit', stdin: '7\n', expected: '1' },
      { name: 'Ends in zeros', stdin: '100\n', expected: '3' },
    ],
  },

  // 18. nested loops
  {
    id: 'c2-nested',
    title: 'Loops inside loops',
    kind: 'concept',
    task: 'Read n. Print a triangle of n rows of stars: row 1 has one star, row 2 has two, and so on.',
    introduces: [],
    teach: {
      body: [
        `<p>A loop can sit inside another loop. For every pass of the outer loop the inner loop runs completely. A common use is rows and columns: the outer loop walks the rows, the inner loop walks the cells in a row, and an <code>endl</code> after the inner loop ends the row. Give each loop its own variable (<code>i</code> for rows, <code>j</code> for columns); the inner variable exists only inside the inner loop.</p>`,
        `<p>The inner loop's limit may depend on the outer variable. That is what makes a triangle: in row <code>i</code> the inner loop runs <code>i</code> times.</p>`,
      ],
      examples: [
        {
          code: C`for (int i = 1; i <= 3; i++) {        // rows
    for (int j = 1; j <= 4; j++) {    // cells in the row
        cout << i * j << " ";
    }
    cout << endl;                     // end the row
}`,
          output: '1 2 3 4\n2 4 6 8\n3 6 9 12',
          caption: 'A multiplication table: 3 rows of 4 cells.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'nested for', meaning: 'the inner loop runs fully for each pass of the outer loop' },
      ],
    },
    compare: {
      py: { code: 'for i in range(1, 4):\n    for j in range(1, 5):\n        print(i * j, end=" ")\n    print()', outcome: 'Prints a 3 by 4 table', ok: true },
      cpp: { code: C`for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 4; j++) {
        cout << i * j << " ";
    }
    cout << endl;
}`, outcome: 'Prints a 3 by 4 table', ok: true },
      text: 'The structure is identical. Python\'s <code>print()</code> that ends the row becomes an <code>endl</code> after the inner loop.',
    },
    refresher: [
      'The outer loop picks the row; the inner loop prints the cells; <code>endl</code> after the inner loop ends the row.',
      'For a triangle, make the inner loop run <code>i</code> times in row <code>i</code>.',
    ],
    hints: [
      'Outer loop: row i from 1 to n. Inner loop: j from 1 to i, printing one star each time.',
      'After the inner loop, print <code>endl</code>. Do not put a space between stars.',
    ],
    inPython: {
      code: 'n = 3\nfor i in range(1, n + 1):\n    print("*" * i)',
      note: 'Python repeats a string with <code>*</code>. C++ has no such shortcut yet, so you use an inner loop.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // print a triangle of stars
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}`,
    require: [{ pattern: 'for[\\s\\S]*for', message: 'Use two nested loops' }],
    tests: [
      { name: 'One row', stdin: '1\n', expected: '*' },
      { name: 'Three rows', stdin: '3\n', expected: '*\n**\n***' },
      { name: 'Five rows', stdin: '5\n', expected: '*\n**\n***\n****\n*****' },
    ],
  },

  // 19. ternary
  {
    id: 'c2-ternary',
    title: 'The ternary operator',
    kind: 'concept',
    task: 'Read two whole numbers. Print the larger one, using <code>?:</code> in a single expression.',
    introduces: ['ternary'],
    teach: {
      body: [
        `<p>C++ has a one-line choice that produces a value: <code>condition ? a : b</code>. If the condition is true the result is <code>a</code>, otherwise it is <code>b</code>. Python writes the same idea with the pieces in a different order: <code>a if condition else b</code>. Read the C++ form as "condition? yes-value : no-value".</p>`,
        `<p>Inside a <code>cout</code> chain wrap the whole thing in parentheses: <code>cout &lt;&lt; (a &gt; b ? a : b);</code>. Without them the operators pull against each other and the line stops compiling or means something else. Use the ternary for short choices; an <code>if</code> reads better for anything long.</p>`,
      ],
      examples: [
        {
          code: C`int age = 20;
string label = age >= 18 ? "adult" : "minor";   // picks one of two values
cout << label << endl;
int a = 4;
int b = 9;
cout << (a > b ? a : b) << endl;                // parentheses inside cout`,
          output: 'adult\n9',
          caption: 'A value chosen by a condition.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'c ? a : b', meaning: 'a if c is true, otherwise b (Python: a if c else b)' },
      ],
    },
    compare: {
      py: { code: 'a, b = 4, 9\nprint(a if a > b else b)', outcome: 'Prints 9', ok: true },
      cpp: { code: C`int a = 4;
int b = 9;
cout << (a > b ? a : b) << endl;`, outcome: 'Prints 9', ok: true },
      text: 'The order differs: Python says <code>a if c else b</code>, C++ says <code>c ? a : b</code>.',
    },
    refresher: [
      '<code>cond ? a : b</code> is <code>a</code> when the condition is true, else <code>b</code>.',
      'Put parentheses around a ternary that sits inside a <code>cout</code> chain.',
    ],
    hints: [
      'The condition is <code>a &gt; b</code>. The results are <code>a</code> and <code>b</code>.',
      'Write <code>cout &lt;&lt; (a &gt; b ? a : b) &lt;&lt; endl;</code>.',
    ],
    inPython: {
      code: 'a, b = 4, 9\nprint(a if a > b else b)',
      note: 'Python\'s conditional expression puts the value first; C++ puts the condition first.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    // print the larger of a and b
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << (a > b ? a : b) << endl;
    return 0;
}`,
    require: [{ pattern: '\\?[^;]*:', message: 'Use the ternary operator ?:' }],
    tests: [
      { name: 'Second is larger', stdin: '4 9\n', expected: '9' },
      { name: 'First is larger', stdin: '12 3\n', expected: '12' },
      { name: 'Equal', stdin: '5 5\n', expected: '5' },
      { name: 'Negatives', stdin: '-7 -2\n', expected: '-2' },
    ],
  },

  // 20. while (cin >> x)
  {
    id: 'c2-while-cin',
    title: 'Read until the input ends',
    kind: 'concept',
    task: 'Read whole numbers until the input ends. Print <em>Sum: S</em> and then <em>Count: N</em>, on two lines.',
    introduces: ['while-cin'],
    teach: {
      body: [
        `<p>You often do not know how many numbers the input holds. The pattern is <code>while (cin &gt;&gt; x) { ... }</code>. The read <code>cin &gt;&gt; x</code> is itself the condition: it succeeds (true) while a value was read into <code>x</code>, and fails (false) when the input has ended or the next thing is not a number. The loop body runs once per value read.</p>`,
        `<p>Declare <code>x</code> before the loop. This is like Python's <code>for line in sys.stdin</code>, with the difference that <code>cin &gt;&gt;</code> splits on spaces and newlines for you. If the input is empty the body never runs, so a sum stays at its starting value.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

int main() {
    int x;
    int total = 0;
    while (cin >> x) {         // true while a number was read
        total += x;
    }
    cout << total << endl;
    return 0;
}`,
          stdin: '4 5\n6',
          output: '15',
          caption: 'Summing however many numbers there are.',
        },
      ],
      terms: [
        { code: 'while (cin >> x)', meaning: 'loops once per value read; stops when the input ends' },
      ],
    },
    compare: {
      py: { code: 'nums = [4, 5, 6]\ntotal = 0\nfor x in nums:\n    total += x\nprint(total)', outcome: 'Sums every number in the list', ok: true },
      cpp: { code: C`int x;
int total = 0;
while (cin >> x) {
    total += x;
}
cout << total << endl;`, outcome: 'Sums every number in the input', ok: true },
      text: 'Python loops over a list that already exists. C++ reads each value as the loop condition, so no list is needed.',
    },
    refresher: [
      '<code>while (cin &gt;&gt; x) { ... }</code> runs once for every value read and stops when the input ends.',
      'Set the sum and the count to 0 before the loop, so empty input prints zeros.',
    ],
    hints: [
      'Two counters before the loop: a running sum and a count of values.',
      'Inside the loop, add x to the sum and add one to the count. Print after the loop.',
    ],
    inPython: {
      code: 'import sys\nnums = [int(t) for t in sys.stdin.read().split()]\nprint("Sum:", sum(nums))\nprint("Count:", len(nums))',
      note: 'Python collects everything into a list first. In C++ the loop updates the totals as each value arrives.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    // read numbers until the input ends
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int x;
    int sum = 0;
    int count = 0;
    while (cin >> x) {
        sum += x;
        count++;
    }
    cout << "Sum: " << sum << endl;
    cout << "Count: " << count << endl;
    return 0;
}`,
    require: [{ pattern: 'while\\s*\\(\\s*cin', message: 'Read with while (cin >> x)' }],
    tests: [
      { name: 'Three numbers', stdin: '3 4 5\n', expected: 'Sum: 12\nCount: 3' },
      { name: 'Over several lines', stdin: '10\n20\n-5\n', expected: 'Sum: 25\nCount: 3' },
      { name: 'Empty input', stdin: '', expected: 'Sum: 0\nCount: 0' },
      { name: 'One number', stdin: '42\n', expected: 'Sum: 42\nCount: 1' },
    ],
  },

  // 21. practice: FizzBuzz
  {
    id: 'c2-practice-fizzbuzz',
    title: 'Practice: FizzBuzz',
    kind: 'program',
    task: 'Read n. For each number from 1 to n print <em>FizzBuzz</em> if it is divisible by both 3 and 5, <em>Fizz</em> if by 3 only, <em>Buzz</em> if by 5 only, otherwise the number itself. One per line.',
    introduces: [],
    refresher: [
      'Test the "both" case first, or a multiple of 15 would stop at Fizz.',
      '<code>i % 3 == 0</code> means i is divisible by 3.',
    ],
    hints: [
      'A for loop from 1 to n, with an if / else if chain inside.',
      'The first test is <code>i % 15 == 0</code> (or both remainders zero), then 3, then 5, then the plain number.',
    ],
    inPython: {
      code: 'n = 15\nfor i in range(1, n + 1):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
      note: 'The same chain. In C++ the braces replace the indentation and <code>elif</code> becomes <code>else if</code>.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // FizzBuzz from 1 to n
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            cout << "FizzBuzz" << endl;
        } else if (i % 3 == 0) {
            cout << "Fizz" << endl;
        } else if (i % 5 == 0) {
            cout << "Buzz" << endl;
        } else {
            cout << i << endl;
        }
    }
    return 0;
}`,
    tests: [
      { name: 'Up to 5', stdin: '5\n', expected: '1\n2\nFizz\n4\nBuzz' },
      { name: 'Up to 15', stdin: '15\n', expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' },
      { name: 'Just 1', stdin: '1\n', expected: '1' },
      { name: 'Up to 3', stdin: '3\n', expected: '1\n2\nFizz' },
    ],
  },

  // 22. practice: digit sum
  {
    id: 'c2-practice-digit-sum',
    title: 'Practice: digit sum',
    kind: 'program',
    task: 'Read a whole number (zero or more). Print <em>Sum: S</em>, where S is the sum of its digits. On a second line print <em>Divisible by 3</em> if S is divisible by 3; otherwise print nothing more.',
    introduces: [],
    refresher: [
      '<code>n % 10</code> is the last digit and <code>n / 10</code> drops it. Loop while n is above 0.',
      'Add each last digit to a total before dropping it.',
    ],
    hints: [
      'A while loop that adds <code>n % 10</code> to the sum and then does <code>n = n / 10</code>.',
      'After the loop, print the sum, then use an if on <code>sum % 3 == 0</code>.',
    ],
    inPython: {
      code: 'n = 1234\ntotal = 0\nwhile n > 0:\n    total += n % 10\n    n //= 10\nprint("Sum:", total)\nif total % 3 == 0:\n    print("Divisible by 3")',
      note: 'The same loop works in both languages. Python could also add up <code>str(n)</code> character by character; C++ strings come in stage 4.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // sum the digits of n
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n = n / 10;
    }
    cout << "Sum: " << sum << endl;
    if (sum % 3 == 0) {
        cout << "Divisible by 3" << endl;
    }
    return 0;
}`,
    tests: [
      { name: 'Four digits', stdin: '1234\n', expected: 'Sum: 10' },
      { name: 'Divisible by 3', stdin: '999\n', expected: 'Sum: 27\nDivisible by 3' },
      { name: 'Zero', stdin: '0\n', expected: 'Sum: 0\nDivisible by 3' },
      { name: 'One digit', stdin: '5\n', expected: 'Sum: 5' },
      { name: 'Ends in zeros', stdin: '1200\n', expected: 'Sum: 3\nDivisible by 3' },
    ],
  },

  // 23. practice: primes
  {
    id: 'c2-practice-primes',
    title: 'Practice: primes up to n',
    kind: 'program',
    task: 'Read n (at least 2). Print every prime number from 2 to n on one line, separated by spaces.',
    introduces: [],
    refresher: [
      'A number is prime if no d from 2 up to d * d &lt;= number divides it. Use a bool flag and <code>break</code> when you find a divisor.',
      'Reset the flag at the start of each candidate.',
    ],
    hints: [
      'Outer loop over each candidate from 2 to n; inner loop over possible divisors d.',
      'Start with <code>bool prime = true;</code>. If <code>i % d == 0</code> set it to false and break. Print i if it is still true.',
    ],
    inPython: {
      code: 'n = 10\nfor i in range(2, n + 1):\n    prime = True\n    d = 2\n    while d * d <= i:\n        if i % d == 0:\n            prime = False\n            break\n        d += 1\n    if prime:\n        print(i, end=" ")\nprint()',
      note: 'Python could use <code>all(...)</code> in one line. In C++ a flag and a <code>break</code> are the usual tools.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // print the primes up to n
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 2; i <= n; i++) {
        bool prime = true;
        for (int d = 2; d * d <= i; d++) {
            if (i % d == 0) {
                prime = false;
                break;
            }
        }
        if (prime) {
            cout << i << " ";
        }
    }
    cout << endl;
    return 0;
}`,
    tests: [
      { name: 'Up to 10', stdin: '10\n', expected: '2 3 5 7' },
      { name: 'Just 2', stdin: '2\n', expected: '2' },
      { name: 'Up to 30', stdin: '30\n', expected: '2 3 5 7 11 13 17 19 23 29' },
      { name: 'Ends on a prime', stdin: '13\n', expected: '2 3 5 7 11 13' },
    ],
  },

  // 24. practice: hollow box
  {
    id: 'c2-practice-box',
    title: 'Practice: a hollow box',
    kind: 'program',
    task: 'Read a width w and a height h (both at least 2). Print a box of stars with that size: stars on the border, spaces inside.',
    introduces: [],
    refresher: [
      'Use nested loops: rows r from 0 to h-1, columns c from 0 to w-1.',
      'A cell is a star on the first or last row, or the first or last column; otherwise a space.',
    ],
    hints: [
      'Inside the inner loop, test <code>r == 0 || r == h - 1 || c == 0 || c == w - 1</code>.',
      'Print <code>"*"</code> when the test is true, <code>" "</code> otherwise. End each row with <code>endl</code>.',
    ],
    inPython: {
      code: 'w, h = 4, 3\nfor r in range(h):\n    row = ""\n    for c in range(w):\n        edge = r in (0, h - 1) or c in (0, w - 1)\n        row += "*" if edge else " "\n    print(row)',
      note: 'The same border test in Python; here the row is built as a string, which C++ cannot do yet.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int w, h;
    cin >> w >> h;
    // print the hollow box
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int w, h;
    cin >> w >> h;
    for (int r = 0; r < h; r++) {
        for (int c = 0; c < w; c++) {
            if (r == 0 || r == h - 1 || c == 0 || c == w - 1) {
                cout << "*";
            } else {
                cout << " ";
            }
        }
        cout << endl;
    }
    return 0;
}`,
    tests: [
      { name: 'Four by three', stdin: '4 3\n', expected: '****\n*  *\n****' },
      { name: 'Smallest', stdin: '2 2\n', expected: '**\n**' },
      { name: 'Square', stdin: '5 5\n', expected: '*****\n*   *\n*   *\n*   *\n*****' },
      { name: 'Wide', stdin: '6 2\n', expected: '******\n******' },
    ],
  },

  // 25. practice: guessing check
  {
    id: 'c2-practice-guess',
    title: 'Practice: guessing check',
    kind: 'program',
    task: 'The first number is a secret; every number after it is a guess. For each guess print <em>Too low</em> or <em>Too high</em>. On the right guess print <em>Correct! Tries: N</em> and stop. If the guesses run out, print <em>Gave up</em>.',
    introduces: [],
    refresher: [
      'Read the secret first, then loop with <code>while (cin &gt;&gt; guess)</code> and count each try.',
      'Use <code>break</code> when the guess is correct, and a bool flag to know afterwards whether it was found.',
    ],
    hints: [
      'Keep a <code>tries</code> counter and a <code>bool found</code> that starts false.',
      'Inside the loop: add one try, then if / else if / else on guess against secret. After the loop, print Gave up when found is still false.',
    ],
    inPython: {
      code: 'nums = [7, 3, 9, 7]\nsecret = nums[0]\ntries = 0\nfound = False\nfor g in nums[1:]:\n    tries += 1\n    if g < secret:\n        print("Too low")\n    elif g > secret:\n        print("Too high")\n    else:\n        print("Correct! Tries:", tries)\n        found = True\n        break\nif not found:\n    print("Gave up")',
      note: 'Python slices a list; C++ reads values one by one with <code>cin</code> and decides as it goes.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int secret;
    cin >> secret;
    // read the guesses and answer each one
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

int main() {
    int secret;
    cin >> secret;
    int guess;
    int tries = 0;
    bool found = false;
    while (cin >> guess) {
        tries++;
        if (guess < secret) {
            cout << "Too low" << endl;
        } else if (guess > secret) {
            cout << "Too high" << endl;
        } else {
            cout << "Correct! Tries: " << tries << endl;
            found = true;
            break;
        }
    }
    if (!found) {
        cout << "Gave up" << endl;
    }
    return 0;
}`,
    tests: [
      { name: 'Third time lucky', stdin: '7\n3 9 7\n', expected: 'Too low\nToo high\nCorrect! Tries: 3' },
      { name: 'First try', stdin: '5\n5\n', expected: 'Correct! Tries: 1' },
      { name: 'Runs out of guesses', stdin: '7\n1 2\n', expected: 'Too low\nToo low\nGave up' },
      { name: 'Stops at the right guess', stdin: '4\n9 4 100\n', expected: 'Too high\nCorrect! Tries: 2' },
    ],
  },
]
