// C++ Learn lessons: stage 1, first programs (the learner knows Python and has never written C++).
// Contract and examples: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md and
// docs/superpowers/specs/cpp-learn-lesson-examples.js. Check with: node scripts/verify-cpp-learn.mjs --stage 1
// Ids must start with c1- and be unique across the track. Every piece of syntax a lesson uses must be introduced
// (`introduces`, ids from src/cpp-learn/syntax.js) by that lesson or an earlier one; the checker enforces it.
// These seven are the scaffold examples (one per kind); the stage 1 builder replaces them with the real stage.

const conceptHello = {
  id: 'c1-hello-main',
  title: 'Hello, main',
  kind: 'concept',
  task: 'This program prints a different greeting. Change the text so it prints <em>Hello, C++!</em> instead.',
  introduces: ['include-iostream', 'using-namespace-std', 'int-main', 'return-zero', 'cout', 'stream-insert', 'endl', 'string-literal', 'semicolon', 'comment'],
  teach: {
    body: [
      '<p>A C++ program is a text file with one special function called <code>main</code>. The computer starts there, runs the instructions between the curly braces <code>{ }</code> from top to bottom, and stops at the closing brace. You write it as <code>int main() { ... }</code>. The <code>int</code> says that <code>main</code> hands back a whole number when it finishes, and the empty parentheses <code>()</code> say it takes no input.</p>',
      '<p>To show text, write <code>cout &lt;&lt; "some text";</code>. <code>cout</code> is the screen (the "console output"). The arrows <code>&lt;&lt;</code> mean "send what is on the right to the screen", and the text between double quotes is called a <em>string literal</em>. You can chain several things: <code>cout &lt;&lt; "a" &lt;&lt; "b";</code>. <code>endl</code> ends the line, like the newline Python\'s <code>print</code> adds for you; C++ never adds one by itself.</p>',
      '<p><code>cout</code> and <code>endl</code> live in a part of the standard library called <code>iostream</code>, so the first line is <code>#include &lt;iostream&gt;</code>, which means "bring that part in" (it is like <code>import</code>). The line <code>using namespace std;</code> lets you write <code>cout</code> instead of <code>std::cout</code>. Use it as-is for now; stage 3 explains what it does and why.</p>',
      '<p>Every statement ends with a semicolon <code>;</code>. <code>return 0;</code> tells the system the program finished normally. Two slashes <code>//</code> start a comment that runs to the end of the line; the compiler ignores it. Unlike Python, C++ is <em>compiled</em>: a tool reads the whole file first and refuses to build the program if anything is wrong, so mistakes show up before the program ever runs.</p>',
    ],
    examples: [
      {
        code: '#include <iostream>        // bring in cout and endl\nusing namespace std;       // allow the short name cout\n\nint main() {               // the program starts here\n    // this line is a comment: the compiler ignores it\n    cout << "Hello, C++!" << endl;   // print the text, then end the line\n    return 0;              // finished normally\n}',
        output: 'Hello, C++!',
        caption: 'The smallest useful program.',
      },
      {
        code: 'cout << "Line one" << endl;          // endl ends the line\ncout << "Line " << "two" << endl;    // << can be chained\ncout << "no newline yet, ";           // without endl the next text continues the line\ncout << "now there is" << endl;',
        output: 'Line one\nLine two\nno newline yet, now there is',
        caption: 'Chaining and ending lines. The statements run inside main.',
        wrap: true,
      },
    ],
    terms: [
      { code: 'int main() { ... }', meaning: 'where the program starts; the code goes between the braces' },
      { code: '#include <iostream>', meaning: 'brings in cout and endl from the standard library' },
      { code: 'using namespace std;', meaning: 'lets you write cout instead of std::cout (explained in stage 3)' },
      { code: 'cout << "text"', meaning: 'prints the text; << sends things to the screen and can be chained' },
      { code: 'endl', meaning: 'ends the current line' },
      { code: ';', meaning: 'ends a statement' },
      { code: 'return 0;', meaning: 'main finished normally' },
      { code: '// note', meaning: 'a comment, ignored by the compiler' },
    ],
  },
  compare: {
    py: { code: 'print("Hello")', outcome: 'Prints Hello and a newline', ok: true },
    cpp: { code: 'cout << "Hello" << endl;', outcome: 'Prints Hello; endl adds the newline', ok: true },
    text: 'Python adds the newline for you and runs line by line. C++ is compiled first and only prints the newline you ask for with <code>endl</code>.',
  },
  refresher: [
    'Everything lives inside <code>int main() { ... }</code>. Statements end with <code>;</code>.',
    '<code>cout &lt;&lt; "text" &lt;&lt; endl;</code> prints text and ends the line. It needs <code>#include &lt;iostream&gt;</code>.',
  ],
  hints: [
    'Find the text between the double quotes. That is the only thing to change.',
    'Keep the quotes and the rest of the line as it is, and write the new greeting between the quotes.',
  ],
  inPython: {
    code: 'print("Hello, Python!")',
    note: 'One line in Python, because <code>print</code> is built in and adds the newline. C++ needs the <code>#include</code>, a <code>main</code>, and an explicit <code>endl</code>.',
  },
  starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Python!" << endl;\n    return 0;\n}',
  solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}',
  require: [{ pattern: 'cout\\s*<<', message: 'Print with cout <<' }],
  tests: [{ name: 'Prints the greeting', stdin: '', expected: 'Hello, C++!' }],
}

const fixSemicolon = {
  id: 'c1-fix-semicolon',
  title: 'The missing semicolon',
  kind: 'fix',
  task: 'This does not compile. Fix it so it prints <em>Almost there</em>.',
  errorMatch: "expected ';'",
  gloss: 'The compiler reached <code>return</code> while still waiting for the <code>;</code> that ends the <code>cout</code> line above it.',
  introduces: [],
  refresher: [
    'Every statement ends with <code>;</code>. The compiler often reports the error on the line AFTER the missing one.',
    'Read the first <code>error:</code> line of the compiler output; later errors are often a knock-on effect of it.',
  ],
  hints: [
    'Look at the line just above the one the compiler points to.',
    'One character is missing at the end of the <code>cout</code> line.',
  ],
  inPython: {
    code: 'print("Almost there")',
    note: 'Python ends a statement at the end of the line, so there is nothing to forget. C++ needs <code>;</code> because a statement may span several lines.',
  },
  starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Almost there" << endl\n    return 0;\n}',
  solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Almost there" << endl;\n    return 0;\n}',
  require: [{ pattern: 'cout\\s*<<\\s*"Almost there"', message: 'Keep printing Almost there' }],
  tests: [{ name: 'Prints Almost there', stdin: '', expected: 'Almost there' }],
}

const predictDivision = {
  id: 'c1-predict-division',
  title: 'Whole-number division',
  kind: 'predict',
  task: 'For each snippet, pick what you expect, then run it and compare.',
  introduces: ['arithmetic'],
  teach: {
    body: [
      '<p>C++ does arithmetic with <code>+</code>, <code>-</code>, <code>*</code> and <code>/</code>, as Python does. There is one big difference. When both numbers are whole numbers, <code>/</code> gives a whole number and drops the fraction. So <code>7 / 2</code> is <code>3</code>, not <code>3.5</code>. Python\'s <code>//</code> also gives a whole number, but it rounds down; C++ simply cuts off the part after the point, which means it rounds toward zero.</p>',
    ],
    examples: [
      {
        code: 'cout << 2 + 3 << endl;    // 5\ncout << 10 - 4 << endl;   // 6\ncout << 6 * 7 << endl;    // 42\ncout << 7 / 2 << endl;    // 3: both are whole numbers, so the fraction is dropped',
        output: '5\n6\n42\n3',
        wrap: true,
      },
    ],
    terms: [
      { code: '+ - * /', meaning: 'add, subtract, multiply, divide; whole numbers divide to a whole number' },
    ],
  },
  inPython: {
    code: 'print(7 // 2)\nprint(-7 // 2)',
    note: 'Python\'s <code>//</code> rounds down, so <code>-7 // 2</code> is <code>-4</code>. C++ drops the fraction, so <code>-7 / 2</code> is <code>-3</code>.',
  },
  refresher: [
    'Whole number divided by whole number is a whole number in C++: the fraction is dropped (toward zero).',
    'A name must be declared before use; the compiler stops with an error if it meets an unknown one.',
  ],
  rounds: [
    {
      snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << 7 / 2 << endl;\n    cout << -7 / 2 << endl;\n    return 0;\n}',
      choices: ['3.5 and -3.5', '3 and -3', '3 and -4'],
      answer: 1,
      why: 'Both numbers are whole, so the fraction is dropped toward zero: 3 and -3. Python\'s <code>//</code> would give 3 and -4.',
      output: '3\n-3',
    },
    {
      snippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << total << endl;\n    return 0;\n}',
      choices: ['Prints 0', 'Compile error: unknown name total', 'Prints nothing'],
      answer: 1,
      why: 'C++ checks every name before the program runs. <code>total</code> was never declared, so the compiler refuses to build it.',
      error: true,
      output: "main.cpp:5:13: error: use of undeclared identifier 'total'\n    5 |     cout << total << endl;\n      |             ^~~~~\n1 error generated.",
    },
  ],
}

const programSum = {
  id: 'c1-sum-two',
  title: 'Add two numbers',
  kind: 'program',
  task: 'Read two whole numbers from the input and print their sum on one line.',
  introduces: ['int', 'cin', 'stream-extract'],
  teach: {
    body: [
      '<p>A <em>variable</em> is a named box that holds a value. In C++ you must say what kind of value it holds when you create it, and the kind never changes. <code>int a;</code> makes a box named <code>a</code> that holds a whole number (an <code>int</code>). Python lets <code>a</code> hold a number now and text later; C++ does not.</p>',
      '<p><code>cin</code> is the keyboard input, the counterpart of <code>cout</code>. <code>cin &gt;&gt; a;</code> reads the next value from the input into <code>a</code>; the arrows point the other way because data now flows <em>into</em> the variable. It skips spaces and newlines between values, and you can chain it: <code>cin &gt;&gt; a &gt;&gt; b;</code> reads two numbers.</p>',
    ],
    examples: [
      {
        code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a;             // a box for a whole number\n    int b;\n    cin >> a >> b;     // read two numbers from the input\n    cout << a << " and " << b << endl;\n    return 0;\n}',
        stdin: '3 4',
        output: '3 and 4',
        caption: 'Reading two numbers.',
      },
    ],
    terms: [
      { code: 'int a;', meaning: 'creates a variable a that holds a whole number' },
      { code: 'cin >> a;', meaning: 'reads the next value of the input into a' },
    ],
  },
  refresher: [
    '<code>int a, b;</code> makes two int variables. <code>cin &gt;&gt; a &gt;&gt; b;</code> reads them in order, whatever whitespace separates them.',
    'Print the answer with <code>cout &lt;&lt; ... &lt;&lt; endl;</code>.',
  ],
  hints: [
    'You need two int variables and one statement that reads both.',
    'Add them inside the <code>cout</code> statement, or in a third variable first.',
  ],
  inPython: {
    code: 'a, b = 3, 4\nprint(a + b)',
    note: 'Python variables need no declaration and can change type. C++ needs the type up front, and reading input is <code>cin &gt;&gt; a</code> rather than <code>input()</code>.',
  },
  starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // read two numbers and print their sum\n    return 0;\n}',
  solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}',
  tests: [
    { name: 'Two small numbers', stdin: '3 4\n', expected: '7' },
    { name: 'On separate lines', stdin: '10\n-4\n', expected: '6' },
    { name: 'Zeros', stdin: '0 0\n', expected: '0' },
  ],
}

const implementAverage = {
  id: 'c1-average-two',
  title: 'Write a function',
  kind: 'implement',
  task: 'Write <code>average2</code>: it returns the average of its two whole-number arguments, as a whole number.',
  introduces: ['function-def', 'return-value'],
  teach: {
    body: [
      '<p>A <em>function</em> is a named piece of code you can run from elsewhere. You write the type of value it gives back, then its name, then its inputs (<em>parameters</em>) in parentheses with a type each, then the body in braces: <code>int triple(int x) { return x * 3; }</code>. <code>return</code> sends the answer back to whoever called it. Python\'s <code>def triple(x):</code> says none of those types.</p>',
      '<p>A function must be written above the place that calls it. Here your function goes at the top and the test code (which you cannot see yet) comes after it.</p>',
    ],
    examples: [
      {
        code: '#include <iostream>\nusing namespace std;\n\nint triple(int x) {      // gives back an int; takes one int named x\n    return x * 3;        // send the answer back to the caller\n}\n\nint main() {\n    cout << triple(4) << endl;   // call it with 4\n    return 0;\n}',
        output: '12',
      },
    ],
    terms: [
      { code: 'int triple(int x) { ... }', meaning: 'a function that takes an int and gives back an int' },
      { code: 'return value;', meaning: 'ends the function and hands the value back' },
    ],
  },
  refresher: [
    'A function is <code>type name(type param, ...) { ... }</code>. The first type is what it returns.',
    'Whole numbers divide to a whole number, with the fraction dropped toward zero.',
  ],
  hints: [
    'The body is one <code>return</code> statement.',
    'Add the two numbers first, then divide by 2. Mind the parentheses.',
  ],
  inPython: {
    code: 'def average2(a, b):\n    return (a + b) // 2\n\nprint(average2(-7, -8))',
    note: 'Python\'s <code>//</code> rounds down and gives -8 here. C++\'s <code>/</code> on ints drops the fraction toward zero and gives -7.',
  },
  starter: '#include <iostream>\nusing namespace std;\n\n// Return the average of a and b as a whole number.\nint average2(int a, int b) {\n    return 0;\n}',
  solution: '#include <iostream>\nusing namespace std;\n\n// Return the average of a and b as a whole number.\nint average2(int a, int b) {\n    return (a + b) / 2;\n}',
  harness: 'int main() {\n    cout << "\\n@@TEST 1@@" << endl;\n    cout << average2(4, 6) << endl;\n    cout << "\\n@@TEST 2@@" << endl;\n    cout << average2(7, 8) << endl;\n    cout << "\\n@@TEST 3@@" << endl;\n    cout << average2(-7, -8) << endl;\n    return 0;\n}',
  tests: [
    { name: 'Even sum', input: 'average2(4, 6)', expected: '5' },
    { name: 'Odd sum drops the fraction', input: 'average2(7, 8)', expected: '7' },
    { name: 'Negatives truncate toward zero', input: 'average2(-7, -8)', expected: '-7' },
  ],
}

const drillLastDigit = {
  id: 'c1-last-digit',
  title: 'Last digit with %',
  kind: 'drill',
  task: 'Write <code>lastDigit</code>: return the last digit of a non-negative whole number.',
  introduces: ['modulo'],
  teach: {
    body: [
      '<p><code>%</code> is the <em>remainder</em> after division: <code>17 % 5</code> is <code>2</code>, because 5 goes into 17 three times with 2 left over. Python has the same operator. With negative numbers the two languages differ, but this exercise sticks to non-negative ones.</p>',
    ],
    examples: [
      { code: 'cout << 17 % 5 << endl;   // 2: the remainder of 17 divided by 5\ncout << 20 % 5 << endl;   // 0: 5 divides 20 exactly', output: '2\n0', wrap: true },
    ],
    terms: [{ code: 'a % b', meaning: 'the remainder of a divided by b' }],
  },
  refresher: [
    '<code>n % 10</code> is the last digit of <code>n</code>; <code>n / 10</code> drops it.',
  ],
  hints: [
    'You want the remainder when dividing by 10.',
    'One <code>return</code> statement is enough.',
  ],
  starter: '#include <iostream>\nusing namespace std;\n\nint lastDigit(int n) {\n    return 0;\n}',
  solution: '#include <iostream>\nusing namespace std;\n\nint lastDigit(int n) {\n    return n % 10;\n}',
  harness: 'int main() {\n    cout << "\\n@@TEST 1@@" << endl;\n    cout << lastDigit(123) << endl;\n    cout << "\\n@@TEST 2@@" << endl;\n    cout << lastDigit(7) << endl;\n    cout << "\\n@@TEST 3@@" << endl;\n    cout << lastDigit(40) << endl;\n    cout << "\\n@@TEST 4@@" << endl;\n    cout << lastDigit(905) << endl;\n    return 0;\n}',
  require: [{ pattern: '%', message: 'Use the % operator' }],
  tests: [
    { name: 'Three digits', input: 'lastDigit(123)', expected: '3' },
    { name: 'One digit', input: 'lastDigit(7)', expected: '7' },
    { name: 'Ends in zero', input: 'lastDigit(40)', expected: '0' },
    { name: 'Zero in the middle', input: 'lastDigit(905)', expected: '5' },
  ],
}

const bugfixPercent = {
  id: 'c1-fix-percent',
  title: 'Percent is always zero',
  kind: 'bugfix',
  task: '<code>percent(1, 4)</code> should be 25 but returns 0. Fix the function.',
  introduces: [],
  refresher: [
    'Whole number divided by whole number drops the fraction at that step: <code>1 / 4</code> is <code>0</code>.',
    'Operators of the same rank run left to right, so <code>a / b * c</code> divides first.',
  ],
  hints: [
    'Work through <code>1 / 4 * 100</code> step by step with whole-number rules.',
    'Change the order so the multiplication happens first.',
  ],
  inPython: {
    code: 'print(1 / 4 * 100)\nprint(1 // 4 * 100)',
    note: 'Python\'s <code>/</code> gives 25.0, so this bug never shows up there. Its <code>//</code> behaves like C++ and gives 0.',
  },
  starter: '#include <iostream>\nusing namespace std;\n\n// Percentage of whole that part is, as a whole number: 1 of 4 is 25.\nint percent(int part, int whole) {\n    return part / whole * 100;\n}',
  solution: '#include <iostream>\nusing namespace std;\n\n// Percentage of whole that part is, as a whole number: 1 of 4 is 25.\nint percent(int part, int whole) {\n    return part * 100 / whole;\n}',
  harness: 'int main() {\n    cout << "\\n@@TEST 1@@" << endl;\n    cout << percent(1, 4) << endl;\n    cout << "\\n@@TEST 2@@" << endl;\n    cout << percent(1, 2) << endl;\n    cout << "\\n@@TEST 3@@" << endl;\n    cout << percent(3, 3) << endl;\n    cout << "\\n@@TEST 4@@" << endl;\n    cout << percent(3, 4) << endl;\n    return 0;\n}',
  tests: [
    { name: 'A quarter', input: 'percent(1, 4)', expected: '25' },
    { name: 'A half', input: 'percent(1, 2)', expected: '50' },
    { name: 'All of it', input: 'percent(3, 3)', expected: '100' },
    { name: 'Three quarters', input: 'percent(3, 4)', expected: '75' },
  ],
}

export const LESSONS = [
  conceptHello, fixSemicolon, predictDivision, programSum, implementAverage, drillLastDigit, bugfixPercent,
]
