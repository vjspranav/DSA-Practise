// C++ Learn lessons (stage-3-functions). Contract: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md
// Check with: node scripts/verify-cpp-learn.mjs --stage 3
// Functions arrive in this stage, so from here lessons can use a harness (a main() appended after the learner's code).
// C is String.raw: backslashes in C++ and Python code stay as written, so "\n" in code is written "\n".
const C = String.raw

export const LESSONS = [
  // 1. first function
  {
    id: 'c3-first-function',
    title: 'Your first function',
    kind: 'concept',
    task: 'Write <code>cube</code>: it takes one whole number and returns that number multiplied by itself twice (n times n times n).',
    introduces: ['function-def', 'return-value'],
    teach: {
      body: [
        `<p>A <em>function</em> is a named piece of code that you can run from many places. You have already written one: <code>main</code>. The general form is <code>type name(type param, ...) { ... }</code>. The first <code>type</code> is what the function gives back (its <em>return type</em>), then comes its name, then its inputs (the <em>parameters</em>) in parentheses with a type for each, then the body in braces. <code>return value;</code> ends the function and hands the value to whoever called it.</p>`,
        `<p>Python's <code>def cube(n):</code> says none of those types. In C++ every parameter and the return value has a fixed type, and the compiler checks every call against them: <code>cube("hi")</code> is an error, not a surprise at run time. Calling looks the same as in Python: <code>cube(3)</code> is an expression whose value is what the function returned.</p>`,
        `<p>The compiler reads the file from the top, so a function has to be written <em>above</em> the code that calls it (a later lesson shows the other option). In this exercise your function sits at the top and a test program, which you cannot see yet, comes after it.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

int triple(int x) {          // returns an int; takes one int called x
    return x * 3;            // hand the answer back to the caller
}

int main() {
    cout << triple(4) << endl;       // call it: the call is worth 12
    int y = triple(10) + 1;          // a call can sit inside bigger expressions
    cout << y << endl;
    return 0;
}`,
          output: '12\n31',
          caption: 'Define above, call below.',
        },
      ],
      terms: [
        { code: 'int triple(int x) { ... }', meaning: 'a function that takes an int named x and gives back an int' },
        { code: 'return value;', meaning: 'ends the function and hands the value back to the caller' },
        { code: 'triple(4)', meaning: 'a call; it runs the function and is worth whatever it returns' },
      ],
    },
    compare: {
      py: { code: 'def triple(x):\n    return x * 3\n\nprint(triple(4))', outcome: 'Prints 12', ok: true },
      cpp: { code: C`int triple(int x) {
    return x * 3;
}

int main() {
    cout << triple(4) << endl;
    return 0;
}`, outcome: 'Prints 12', ok: true },
      text: 'Python\'s <code>def</code> becomes the return type, then the name, with a type on every parameter. The compiler checks every call against those types.',
    },
    refresher: [
      'A function is <code>type name(type param, ...) { ... }</code>; the first type is what it returns.',
      'Write the function above the code that calls it. <code>return</code> sends the answer back.',
    ],
    hints: [
      'The body is one <code>return</code> statement.',
      'Multiply <code>n * n * n</code> and return the result.',
    ],
    inPython: {
      code: 'def cube(n):\n    return n * n * n\n\nprint(cube(3))',
      note: 'Python needs no types. C++ spells the types of the parameter and of the result in the first line.',
    },
    starter: C`#include <iostream>
using namespace std;

// Return n * n * n.
int cube(int n) {
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

// Return n * n * n.
int cube(int n) {
    return n * n * n;
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << cube(3) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << cube(-2) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << cube(0) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << cube(10) << endl;
    return 0;
}`,
    tests: [
      { name: 'Three', input: 'cube(3)', expected: '27' },
      { name: 'A negative cubes negative', input: 'cube(-2)', expected: '-8' },
      { name: 'Zero', input: 'cube(0)', expected: '0' },
      { name: 'Ten', input: 'cube(10)', expected: '1000' },
    ],
  },

  // 2. void
  {
    id: 'c3-void',
    title: 'Functions that return nothing',
    kind: 'concept',
    task: 'Write <code>printStars</code>: it takes a count and prints that many stars on one line, followed by a newline. It returns nothing.',
    introduces: ['void'],
    teach: {
      body: [
        `<p>Not every function has an answer to hand back. Some just <em>do</em> something, such as printing. For those the return type is <code>void</code>, which means "nothing". A <code>void</code> function has no <code>return value;</code>, though a bare <code>return;</code> may leave it early. You call it as a statement of its own: <code>printStars(3);</code>.</p>`,
        `<p>In Python a function without a <code>return</code> quietly returns <code>None</code>. C++ makes the difference visible in the type: a <code>void</code> function cannot be used inside an expression like <code>int x = printStars(3);</code>. The compiler rejects that.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

void sayHi(int times) {            // void: nothing is returned
    for (int i = 0; i < times; i++) {
        cout << "hi ";
    }
    cout << endl;
}

int main() {
    sayHi(3);                      // a call used as a statement
    return 0;
}`,
          output: 'hi hi hi',
          caption: 'A function that acts instead of answering.',
        },
      ],
      terms: [
        { code: 'void name(...) { ... }', meaning: 'a function that returns nothing' },
        { code: 'return;', meaning: 'leaves a void function early' },
      ],
    },
    compare: {
      py: { code: 'def say_hi(times):\n    for i in range(times):\n        print("hi", end=" ")\n    print()\n\nsay_hi(3)', outcome: 'Prints hi hi hi', ok: true },
      cpp: { code: C`void sayHi(int times) {
    for (int i = 0; i < times; i++) {
        cout << "hi ";
    }
    cout << endl;
}

int main() {
    sayHi(3);
    return 0;
}`, outcome: 'Prints hi hi hi', ok: true },
      text: 'Both functions only act, with no <code>return</code> value. C++ says so in the type, <code>void</code>; Python implies it with <code>None</code>.',
    },
    refresher: [
      '<code>void</code> means a function returns nothing. Call it as a statement, like <code>printStars(3);</code>.',
      'Printing from a function needs <code>cout</code> there too, with <code>#include &lt;iostream&gt;</code> above.',
    ],
    hints: [
      'A <code>for</code> loop that runs count times, printing <code>"*"</code> each pass.',
      'After the loop, print <code>endl</code> to end the line.',
    ],
    inPython: {
      code: 'def print_stars(n):\n    print("*" * n)\n\nprint_stars(3)',
      note: 'Python repeats the string; C++ uses a loop for now. The function returns <code>None</code> in Python and <code>void</code> in C++.',
    },
    starter: C`#include <iostream>
using namespace std;

// Print n stars on one line, then a newline.
void printStars(int n) {
}`,
    solution: C`#include <iostream>
using namespace std;

// Print n stars on one line, then a newline.
void printStars(int n) {
    for (int i = 0; i < n; i++) {
        cout << "*";
    }
    cout << endl;
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    printStars(3);
    cout << "\n@@TEST 2@@" << endl;
    printStars(1);
    cout << "\n@@TEST 3@@" << endl;
    printStars(5);
    cout << "\n@@TEST 4@@" << endl;
    printStars(2);
    printStars(2);
    return 0;
}`,
    tests: [
      { name: 'Three stars', input: 'printStars(3)', expected: '***' },
      { name: 'One star', input: 'printStars(1)', expected: '*' },
      { name: 'Five stars', input: 'printStars(5)', expected: '*****' },
      { name: 'Called twice', input: 'printStars(2) twice', expected: '**\n**' },
    ],
  },

  // 3. predict: local scope
  {
    id: 'c3-predict-scope',
    title: 'Variables stay inside their function',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    teach: {
      body: [
        `<p>A variable created inside a function is <em>local</em>: it exists only while that function runs, and no other function can see it. Two functions can each have a variable called <code>x</code>, and they are two separate boxes. The same rule you met for loop variables applies to every pair of braces: a name lives from its declaration to the closing brace of its block.</p>`,
        `<p>Python works the same way for names created in a function, so this should feel familiar. The difference is that C++ finds mistakes when compiling: reaching for another function's variable is an error before the program runs.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

void show() {
    int count = 1;                 // local to show
    cout << "show: " << count << endl;
}

int main() {
    int count = 7;                 // a different box, local to main
    show();
    cout << "main: " << count << endl;
    return 0;
}`,
          output: 'show: 1\nmain: 7',
          caption: 'Two variables that share a name and nothing else.',
        },
      ],
      terms: [
        { code: 'local variable', meaning: 'exists only inside the block where it is declared' },
      ],
    },
    refresher: [
      'A variable declared in a function is invisible outside it. Same names in two functions are different variables.',
      'Using a name from another function is a compile error: use of undeclared identifier.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

void bump() {
    int x = 100;
    x++;
    cout << "in bump: " << x << endl;
}

int main() {
    int x = 5;
    bump();
    cout << "in main: " << x << endl;
    return 0;
}`,
        choices: ['in bump: 101, in main: 101', 'in bump: 101, in main: 5', 'in bump: 6, in main: 6'],
        answer: 1,
        why: 'Each function has its own <code>x</code>. <code>bump</code> changes only its local box, so main\'s <code>x</code> is still 5.',
        output: 'in bump: 101\nin main: 5',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

void setup() {
    int total = 10;
}

int main() {
    setup();
    cout << total << endl;
    return 0;
}`,
        choices: ['Prints 10', 'Compile error: total is unknown in main', 'Prints 0'],
        answer: 1,
        why: '<code>total</code> lives only inside <code>setup</code>. Once that function ends it is gone, and main never knew the name, so the compiler refuses the program.',
        error: true,
        output: "main.cpp:10:13: error: use of undeclared identifier 'total'\n   10 |     cout << total << endl;\n      |             ^~~~~\n1 error generated.",
      },
    ],
  },

  // 4. fix: define before use
  {
    id: 'c3-fix-order',
    title: 'Define it before you call it',
    kind: 'fix',
    task: 'This does not compile. Fix it so it prints <em>25</em>.',
    errorMatch: 'use of undeclared identifier',
    gloss: 'The compiler reads top to bottom, so when <code>main</code> calls <code>square</code> it has not seen that function yet.',
    introduces: [],
    refresher: [
      'The compiler only knows what it has already read. A function must appear above its first call.',
      'Python looks names up when the line runs; C++ checks them while reading the file, top to bottom.',
    ],
    hints: [
      'Find the call to <code>square</code> and the place where <code>square</code> is defined. Which comes first?',
      'Move the whole <code>square</code> function above <code>main</code>.',
    ],
    inPython: {
      code: 'def main():\n    print(square(5))\n\ndef square(n):\n    return n * n\n\nmain()',
      note: 'Python only looks up <code>square</code> when <code>main()</code> runs, after both functions exist. C++ needs it declared earlier in the file.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    cout << square(5) << endl;
    return 0;
}

int square(int n) {
    return n * n;
}`,
    solution: C`#include <iostream>
using namespace std;

int square(int n) {
    return n * n;
}

int main() {
    cout << square(5) << endl;
    return 0;
}`,
    tests: [{ name: 'Prints 25', stdin: '', expected: '25' }],
  },

  // 5. prototype
  {
    id: 'c3-prototype',
    title: 'Prototypes: declare now, define later',
    kind: 'concept',
    task: 'Read two whole numbers and print the bigger one with <code>bigger</code>. Keep <code>main</code> at the top: add a prototype for <code>bigger</code> above it, so the program compiles.',
    introduces: ['prototype'],
    teach: {
      body: [
        `<p>Moving every function above <code>main</code> works, but programs read best with <code>main</code> first. A <em>prototype</em> lets you do that. It is the first line of the function, with a <code>;</code> instead of the body: <code>int bigger(int a, int b);</code>. It tells the compiler "a function with this name and these types exists, you will see its body later". After that the calls compile, and the real definition can sit anywhere below.</p>`,
        `<p>The names of the parameters in a prototype are optional (<code>int bigger(int, int);</code> is fine), but the types must match the definition. Prototypes are also why header files exist: a header such as <code>iostream</code> is, in large part, a list of prototypes and declarations, so that your file can call <code>cout</code> without seeing how it works.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

int twice(int n);              // prototype: signature only, ends with ;

int main() {
    cout << twice(21) << endl; // fine: the compiler knows twice exists
    return 0;
}

int twice(int n) {             // the definition comes later
    return n * 2;
}`,
          output: '42',
          caption: 'main on top, definition below, prototype in between.',
        },
      ],
      terms: [
        { code: 'int f(int a);', meaning: 'a prototype: promises the function exists and tells the compiler its types' },
      ],
    },
    compare: {
      py: { code: 'def main():\n    print(twice(21))\n\ndef twice(n):\n    return n * 2\n\nmain()', outcome: 'Prints 42', ok: true },
      cpp: { code: C`int twice(int n);

int main() {
    cout << twice(21) << endl;
    return 0;
}

int twice(int n) {
    return n * 2;
}`, outcome: 'Prints 42', ok: true },
      text: 'Python needs no promise because it looks names up when the call runs. In C++ the prototype is that promise, made before the first call.',
    },
    refresher: [
      'A prototype is a function\'s first line followed by <code>;</code>. It must match the later definition.',
      'Put prototypes above <code>main</code> and the definitions below it.',
    ],
    hints: [
      'Copy the first line of <code>bigger</code> and put it above <code>main</code>, ending with a semicolon.',
      'The line to add is <code>int bigger(int a, int b);</code>.',
    ],
    inPython: {
      code: 'def bigger(a, b):\n    return a if a > b else b\n\nprint(bigger(3, 8))',
      note: 'Python needs nothing like a prototype. The idea only exists because C++ checks names as it reads.',
    },
    starter: C`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << bigger(a, b) << endl;
    return 0;
}

int bigger(int a, int b) {
    return a > b ? a : b;
}`,
    solution: C`#include <iostream>
using namespace std;

int bigger(int a, int b);

int main() {
    int a, b;
    cin >> a >> b;
    cout << bigger(a, b) << endl;
    return 0;
}

int bigger(int a, int b) {
    return a > b ? a : b;
}`,
    require: [{ pattern: 'int\\s+bigger\\s*\\([^)]*\\)\\s*;', message: 'Add the prototype int bigger(int a, int b);' }],
    tests: [
      { name: 'Second is bigger', stdin: '3 8\n', expected: '8' },
      { name: 'First is bigger', stdin: '10 2\n', expected: '10' },
      { name: 'Equal', stdin: '5 5\n', expected: '5' },
      { name: 'Negatives', stdin: '-4 -9\n', expected: '-4' },
    ],
  },

  // 6. predict: pass by value
  {
    id: 'c3-predict-by-value',
    title: 'Arguments are copied',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    teach: {
      body: [
        `<p>When you call <code>addTen(x)</code>, C++ makes a <em>copy</em> of <code>x</code> and hands the copy to the function. The parameter is a brand-new variable that starts with the same value. Changing it inside the function changes only the copy; the caller's variable is untouched. This is called <em>pass by value</em>, and it is the default for every type.</p>`,
        `<p>This differs from what you may expect in Python. There, a function receives the very same object, so it can change a list you pass in (numbers and strings cannot be changed in place, so they seem copied). In C++ even a big collection is copied unless you ask otherwise. The next lessons show how to ask.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

void reset(int n) {
    n = 0;                    // changes the copy only
}

int main() {
    int score = 9;
    reset(score);             // the function receives a copy of 9
    cout << score << endl;    // the original is untouched
    return 0;
}`,
          output: '9',
          caption: 'The caller\'s variable never changes.',
        },
      ],
      terms: [
        { code: 'pass by value', meaning: 'the function gets a copy; changes to it do not reach the caller' },
      ],
    },
    refresher: [
      'By default a function works on a copy of each argument. Assigning to a parameter does not change the caller\'s variable.',
      'To get the changed value back, <code>return</code> it and store the result.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

void addTen(int n) {
    n = n + 10;
    cout << "inside: " << n << endl;
}

int main() {
    int x = 5;
    addTen(x);
    cout << "outside: " << x << endl;
    return 0;
}`,
        choices: ['inside: 15, outside: 15', 'inside: 15, outside: 5', 'inside: 5, outside: 5'],
        answer: 1,
        why: '<code>n</code> is a copy of <code>x</code>. Adding to the copy shows 15 inside the function, and <code>x</code> in main stays 5.',
        output: 'inside: 15\noutside: 5',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

int doubled(int n) {
    n = n * 2;
    return n;
}

int main() {
    int a = 4;
    int b = doubled(a);
    cout << a << " " << b << endl;
    return 0;
}`,
        choices: ['8 8', '4 8', '4 4'],
        answer: 1,
        why: 'The copy is doubled and returned, and the result goes into <code>b</code>. The original <code>a</code> is not touched, so it prints 4 and 8.',
        output: '4 8',
      },
    ],
  },

  // 7. reference: swap
  {
    id: 'c3-reference-swap',
    title: 'References: change the caller\'s variable',
    kind: 'concept',
    task: 'Write <code>swapInts</code>: it takes two whole numbers by reference and swaps their values, so the caller\'s variables end up exchanged.',
    introduces: ['reference-param'],
    teach: {
      body: [
        `<p>Sometimes a function <em>should</em> change the caller's variable. Put an <code>&amp;</code> after the parameter's type: <code>void addTen(int&amp; n)</code>. Now <code>n</code> is not a copy but a <em>reference</em>: a second name for the caller's own variable. Whatever the function does to <code>n</code> happens to the original. The call looks unchanged, <code>addTen(x);</code>, so you only see the <code>&amp;</code> in the function's first line.</p>`,
        `<p>Swapping two values is the classic case. Copy one into a spare variable, then shuffle: <code>int temp = a; a = b; b = temp;</code>. With copies this would swap only the copies; with references it swaps the caller's variables. A reference must be given a real variable to refer to, so <code>addTen(5)</code> would be an error. (C++ also has a ready-made swap in its library; you will meet it later, and writing it yourself first is the point here.)</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

void addTen(int& n) {         // n is another name for the caller's variable
    n = n + 10;
}

int main() {
    int x = 5;
    addTen(x);                // no & at the call: it is only in the function
    cout << x << endl;
    return 0;
}`,
          output: '15',
          caption: 'The & makes the change visible to the caller.',
        },
      ],
      terms: [
        { code: 'int& n', meaning: 'a reference parameter: another name for the caller\'s variable' },
        { code: 'int temp = a;', meaning: 'a spare box for holding one value while swapping' },
      ],
    },
    compare: {
      py: { code: 'a, b = 1, 2\na, b = b, a\nprint(a, b)', outcome: 'Prints 2 1', ok: true },
      cpp: { code: C`int a = 1;
int b = 2;
int temp = a;
a = b;
b = temp;
cout << a << " " << b << endl;`, outcome: 'Prints 2 1', ok: true },
      text: 'Python swaps in one line with tuple unpacking. C++ needs a spare variable, and a function that swaps for its caller needs reference parameters.',
    },
    refresher: [
      '<code>int&amp; a</code> makes <code>a</code> a second name for the caller\'s variable; changes stick.',
      'Swap through a third variable: <code>temp = a; a = b; b = temp;</code>.',
    ],
    hints: [
      'The function is <code>void</code>: it changes its arguments and returns nothing.',
      'Save <code>a</code> in a spare variable, copy <code>b</code> into <code>a</code>, then put the saved value into <code>b</code>.',
    ],
    inPython: {
      code: 'def swap_pair(pair):\n    pair[0], pair[1] = pair[1], pair[0]\n\np = [1, 2]\nswap_pair(p)\nprint(p)',
      note: 'Python can only change a list passed in (a mutable object). A C++ reference changes a plain number, which Python cannot do.',
    },
    starter: C`#include <iostream>
using namespace std;

// Swap the values of a and b in the caller.
void swapInts(int& a, int& b) {
}`,
    solution: C`#include <iostream>
using namespace std;

// Swap the values of a and b in the caller.
void swapInts(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}`,
    harness: C`int main() {
    int harness_x = 0;
    int harness_y = 0;
    cout << "\n@@TEST 1@@" << endl;
    harness_x = 1; harness_y = 2;
    swapInts(harness_x, harness_y);
    cout << harness_x << " " << harness_y << endl;
    cout << "\n@@TEST 2@@" << endl;
    harness_x = -5; harness_y = 9;
    swapInts(harness_x, harness_y);
    cout << harness_x << " " << harness_y << endl;
    cout << "\n@@TEST 3@@" << endl;
    harness_x = 7; harness_y = 7;
    swapInts(harness_x, harness_y);
    cout << harness_x << " " << harness_y << endl;
    cout << "\n@@TEST 4@@" << endl;
    harness_x = 0; harness_y = 100;
    swapInts(harness_x, harness_y);
    swapInts(harness_x, harness_y);
    cout << harness_x << " " << harness_y << endl;
    return 0;
}`,
    require: [{ pattern: 'swapInts\\s*\\(\\s*int\\s*&', message: 'Keep the reference parameters (int&)' }],
    tests: [
      { name: 'Different values', input: 'swap 1 and 2', expected: '2 1' },
      { name: 'Negative and positive', input: 'swap -5 and 9', expected: '9 -5' },
      { name: 'Equal values', input: 'swap 7 and 7', expected: '7 7' },
      { name: 'Swapping twice undoes it', input: 'swap 0 and 100 twice', expected: '0 100' },
    ],
  },

  // 8. bugfix: missing &
  {
    id: 'c3-bugfix-ordered',
    title: 'The values never change',
    kind: 'bugfix',
    task: '<code>orderPair</code> should leave the smaller number in <code>lo</code> and the larger in <code>hi</code>, but the caller\'s variables never change. Fix it.',
    introduces: [],
    refresher: [
      'Without <code>&amp;</code> a parameter is a copy. Swapping copies changes nothing for the caller.',
      'Reference parameters are written <code>int&amp; name</code> in the function\'s first line.',
    ],
    hints: [
      'The logic is right. Think about what each parameter is: the caller\'s variable, or a copy?',
      'Add <code>&amp;</code> after <code>int</code> on both parameters.',
    ],
    inPython: {
      code: 'def order_pair(lo, hi):\n    if lo > hi:\n        lo, hi = hi, lo\n    return lo, hi\n\nprint(order_pair(5, 3))',
      note: 'Python usually returns the new pair. In C++ you can instead change the caller\'s variables through references.',
    },
    starter: C`#include <iostream>
using namespace std;

// Put the smaller value in lo and the larger in hi.
void orderPair(int lo, int hi) {
    if (lo > hi) {
        int temp = lo;
        lo = hi;
        hi = temp;
    }
}`,
    solution: C`#include <iostream>
using namespace std;

// Put the smaller value in lo and the larger in hi.
void orderPair(int& lo, int& hi) {
    if (lo > hi) {
        int temp = lo;
        lo = hi;
        hi = temp;
    }
}`,
    harness: C`int main() {
    int harness_a = 0;
    int harness_b = 0;
    cout << "\n@@TEST 1@@" << endl;
    harness_a = 5; harness_b = 3;
    orderPair(harness_a, harness_b);
    cout << harness_a << " " << harness_b << endl;
    cout << "\n@@TEST 2@@" << endl;
    harness_a = 1; harness_b = 2;
    orderPair(harness_a, harness_b);
    cout << harness_a << " " << harness_b << endl;
    cout << "\n@@TEST 3@@" << endl;
    harness_a = 9; harness_b = -4;
    orderPair(harness_a, harness_b);
    cout << harness_a << " " << harness_b << endl;
    cout << "\n@@TEST 4@@" << endl;
    harness_a = 6; harness_b = 6;
    orderPair(harness_a, harness_b);
    cout << harness_a << " " << harness_b << endl;
    return 0;
}`,
    tests: [
      { name: 'Out of order', input: 'orderPair(5, 3)', expected: '3 5' },
      { name: 'Already ordered', input: 'orderPair(1, 2)', expected: '1 2' },
      { name: 'Negative', input: 'orderPair(9, -4)', expected: '-4 9' },
      { name: 'Equal', input: 'orderPair(6, 6)', expected: '6 6' },
    ],
  },

  // 9. const reference
  {
    id: 'c3-const-ref',
    title: 'const &: look, do not copy',
    kind: 'concept',
    task: 'Write <code>printTwice</code>: it takes a string by <code>const</code> reference and prints it two times on one line, separated by a space, then a newline.',
    introduces: ['const-ref'],
    teach: {
      body: [
        `<p>Passing by value copies the argument. For an <code>int</code> that costs nothing, but for something big, like a long string or, later, a whole list of numbers, copying on every call is wasteful. A reference avoids the copy. But a plain reference lets the function change the caller's data, which is dangerous when it only wants to look.</p>`,
        `<p>The fix is <code>const &amp;</code>: <code>void show(const string&amp; s)</code>. It reads "a reference to a string that I promise not to change". No copy is made, and the compiler refuses any line in the function that tries to modify <code>s</code>. This is the standard way to pass anything big and read-only. For small values like <code>int</code> and <code>double</code>, plain pass by value is still best.</p>`,
        `<p>A <code>const &amp;</code> parameter also accepts a temporary value such as the text <code>"abc"</code>, which an ordinary reference would reject.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
#include <string>
using namespace std;

void shout(const string& s) {     // no copy, and s cannot be changed
    cout << s << "!" << endl;
}

int main() {
    string word = "hello";
    shout(word);
    shout("bye");                 // a literal is fine for const &
    return 0;
}`,
          output: 'hello!\nbye!',
          caption: 'Read-only access without a copy.',
        },
      ],
      terms: [
        { code: 'const string& s', meaning: 'a reference to the caller\'s string: no copy, and it cannot be changed' },
      ],
    },
    compare: {
      py: { code: 'def shout(s):\n    print(s + "!")\n\nshout("hello")', outcome: 'Prints hello!', ok: true },
      cpp: { code: C`void shout(const string& s) {
    cout << s << "!" << endl;
}

int main() {
    shout("hello");
    return 0;
}`, outcome: 'Prints hello!', ok: true },
      text: 'Python always passes a reference to the object and never copies it. C++ copies by default, so <code>const &amp;</code> is how you get the same cheap, read-only access.',
    },
    refresher: [
      '<code>const T&amp; x</code> passes without copying and forbids changing x. Use it for big read-only values.',
      'Small values like <code>int</code> are passed by plain value.',
    ],
    hints: [
      'Print the string, a space, the string again, then <code>endl</code>.',
      'One <code>cout</code> chain does it: <code>cout &lt;&lt; s &lt;&lt; " " &lt;&lt; s &lt;&lt; endl;</code>.',
    ],
    inPython: {
      code: 'def print_twice(s):\n    print(s, s)\n\nprint_twice("go")',
      note: 'Python\'s <code>print</code> puts a space between arguments for you. In C++ you write the space yourself.',
    },
    starter: C`#include <iostream>
#include <string>
using namespace std;

// Print s twice on one line, separated by a space.
void printTwice(const string& s) {
}`,
    solution: C`#include <iostream>
#include <string>
using namespace std;

// Print s twice on one line, separated by a space.
void printTwice(const string& s) {
    cout << s << " " << s << endl;
}`,
    harness: C`int main() {
    string harness_word = "hi";
    cout << "\n@@TEST 1@@" << endl;
    printTwice(harness_word);
    cout << "\n@@TEST 2@@" << endl;
    printTwice("abc");
    cout << "\n@@TEST 3@@" << endl;
    printTwice("x");
    cout << "\n@@TEST 4@@" << endl;
    printTwice("hello world");
    return 0;
}`,
    require: [{ pattern: 'const\\s+string\\s*&', message: 'Keep the const string& parameter' }],
    tests: [
      { name: 'A variable', input: 'printTwice(word)', expected: 'hi hi' },
      { name: 'A literal', input: 'printTwice("abc")', expected: 'abc abc' },
      { name: 'One letter', input: 'printTwice("x")', expected: 'x x' },
      { name: 'Contains a space', input: 'printTwice("hello world")', expected: 'hello world hello world' },
    ],
  },

  // 10. fix: assigning through const &
  {
    id: 'c3-fix-const-ref',
    title: 'A promise not to change',
    kind: 'fix',
    task: 'This does not compile. <code>addTax</code> should raise the caller\'s price by 25 percent. Fix the parameter so the change reaches the caller.',
    errorMatch: 'cannot assign to variable',
    gloss: 'The parameter is declared <code>const</code>, which promises not to change it, so the assignment on the next line is refused.',
    introduces: [],
    refresher: [
      '<code>const &amp;</code> forbids changing the value. To modify the caller\'s variable use a plain reference, <code>double&amp; price</code>.',
      'Use <code>const &amp;</code> only when the function merely reads the value.',
    ],
    hints: [
      'The function wants to change <code>price</code>, which a <code>const</code> parameter forbids.',
      'Remove the word <code>const</code> and keep the <code>&amp;</code>.',
    ],
    inPython: {
      code: 'def add_tax(price):\n    return price * 1.25\n\nprint(add_tax(100.0))',
      note: 'Python numbers cannot be changed in place, so the function returns the new value. A C++ reference lets the function change the caller\'s variable directly.',
    },
    starter: C`#include <iostream>
using namespace std;

// Raise price by 25 percent, in the caller's variable.
void addTax(const double& price) {
    price = price * 1.25;
}`,
    solution: C`#include <iostream>
using namespace std;

// Raise price by 25 percent, in the caller's variable.
void addTax(double& price) {
    price = price * 1.25;
}`,
    harness: C`int main() {
    double harness_p = 0;
    cout << "\n@@TEST 1@@" << endl;
    harness_p = 100;
    addTax(harness_p);
    cout << harness_p << endl;
    cout << "\n@@TEST 2@@" << endl;
    harness_p = 80;
    addTax(harness_p);
    cout << harness_p << endl;
    cout << "\n@@TEST 3@@" << endl;
    harness_p = 0;
    addTax(harness_p);
    cout << harness_p << endl;
    cout << "\n@@TEST 4@@" << endl;
    harness_p = 10;
    addTax(harness_p);
    cout << harness_p << endl;
    return 0;
}`,
    tests: [
      { name: '100 becomes 125', input: 'addTax(100)', expected: '125' },
      { name: '80 becomes 100', input: 'addTax(80)', expected: '100' },
      { name: 'Zero stays zero', input: 'addTax(0)', expected: '0' },
      { name: '10 becomes 12.5', input: 'addTax(10)', expected: '12.5' },
    ],
  },

  // 11. several results through references
  {
    id: 'c3-multi-return',
    title: 'Returning several values',
    kind: 'drill',
    task: 'Write <code>divmod</code>: it takes <code>a</code> and <code>b</code> and stores the whole-number quotient in <code>q</code> and the remainder in <code>r</code>. Both are references.',
    introduces: [],
    teach: {
      body: [
        `<p>A function can return only one value. Python gets around this by returning a tuple: <code>q, r = divmod(17, 5)</code>. C++ has no tuples yet in this course, so the usual way is <em>output parameters</em>: you pass in extra variables by reference, and the function fills them in. The caller declares the variables, passes them, and reads them after the call.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

void minMax(int a, int b, int& lo, int& hi) {   // a and b go in, lo and hi come out
    if (a < b) {
        lo = a;
        hi = b;
    } else {
        lo = b;
        hi = a;
    }
}

int main() {
    int small = 0;
    int big = 0;
    minMax(8, 3, small, big);
    cout << small << " " << big << endl;
    return 0;
}`,
          output: '3 8',
          caption: 'Two results through two references.',
        },
      ],
      terms: [
        { code: 'int& out', meaning: 'an output parameter: the function stores its result into the caller\'s variable' },
      ],
    },
    refresher: [
      'Inputs are plain parameters; results go into reference parameters that the caller declared.',
      '<code>a / b</code> is the whole-number quotient and <code>a % b</code> the remainder, for non-negative numbers.',
    ],
    hints: [
      'No <code>return</code> is needed: assign to <code>q</code> and to <code>r</code>.',
      '<code>q = a / b;</code> and <code>r = a % b;</code>.',
    ],
    inPython: {
      code: 'q, r = divmod(17, 5)\nprint(q, r)',
      note: 'Python returns both values as a tuple. C++ fills in variables the caller passes by reference.',
    },
    starter: C`#include <iostream>
using namespace std;

// Store the quotient of a / b in q and the remainder in r.
void divmod(int a, int b, int& q, int& r) {
}`,
    solution: C`#include <iostream>
using namespace std;

// Store the quotient of a / b in q and the remainder in r.
void divmod(int a, int b, int& q, int& r) {
    q = a / b;
    r = a % b;
}`,
    harness: C`int main() {
    int harness_q = 0;
    int harness_r = 0;
    cout << "\n@@TEST 1@@" << endl;
    divmod(17, 5, harness_q, harness_r);
    cout << harness_q << " " << harness_r << endl;
    cout << "\n@@TEST 2@@" << endl;
    divmod(20, 4, harness_q, harness_r);
    cout << harness_q << " " << harness_r << endl;
    cout << "\n@@TEST 3@@" << endl;
    divmod(3, 7, harness_q, harness_r);
    cout << harness_q << " " << harness_r << endl;
    cout << "\n@@TEST 4@@" << endl;
    divmod(100, 9, harness_q, harness_r);
    cout << harness_q << " " << harness_r << endl;
    return 0;
}`,
    tests: [
      { name: '17 by 5', input: 'divmod(17, 5)', expected: '3 2' },
      { name: 'Divides exactly', input: 'divmod(20, 4)', expected: '5 0' },
      { name: 'Smaller than divisor', input: 'divmod(3, 7)', expected: '0 3' },
      { name: '100 by 9', input: 'divmod(100, 9)', expected: '11 1' },
    ],
  },

  // 12. overloading
  {
    id: 'c3-overloading',
    title: 'Same name, different types',
    kind: 'concept',
    task: 'The starter has <code>half</code> for whole numbers. Add a second <code>half</code> that takes a <code>double</code> and returns half of it as a <code>double</code>.',
    introduces: [],
    teach: {
      body: [
        `<p>C++ lets several functions share one name, as long as their parameter types differ. This is called <em>overloading</em>. When you call the name, the compiler looks at the types of the arguments and picks the matching version: <code>half(7)</code> goes to the <code>int</code> one, <code>half(7.0)</code> to the <code>double</code> one. Using the same name for the same idea means you only need to remember one.</p>`,
        `<p>The parameter types (or how many there are) must differ; a different return type alone is not enough. Python has no overloading: a second <code>def half</code> would replace the first, and one function handles any type by looking at it as it runs. C++ chooses before the program runs.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

int twice(int n) {             // chosen for whole-number arguments
    return n * 2;
}

double twice(double x) {       // chosen for decimal arguments
    return x * 2;
}

int main() {
    cout << twice(4) << endl;      // calls the int version
    cout << twice(1.5) << endl;    // calls the double version
    return 0;
}`,
          output: '8\n3',
          caption: 'The compiler picks by argument type.',
        },
      ],
      terms: [
        { code: 'overloading', meaning: 'several functions with one name and different parameter types' },
      ],
    },
    compare: {
      py: { code: 'def half(x):\n    return x / 2\n\nprint(half(7))\nprint(half(7.0))', outcome: 'One function handles both: 3.5 and 3.5', ok: true },
      cpp: { code: C`int half(int n) { return n / 2; }
double half(double x) { return x / 2; }

int main() {
    cout << half(7) << endl;
    cout << half(7.0) << endl;
    return 0;
}`, outcome: 'Two functions: prints 3 and 3.5', ok: true },
      text: 'Python has one flexible function. C++ has one function per type combination, and the compiler selects the right one from the arguments.',
    },
    refresher: [
      'Functions may share a name when their parameter types differ. The arguments decide which one runs.',
      'Whole-number <code>/</code> drops the fraction; with a <code>double</code> it keeps it.',
    ],
    hints: [
      'Write another function named <code>half</code>, with a <code>double</code> parameter and a <code>double</code> return type.',
      'Its body is <code>return x / 2;</code>.',
    ],
    inPython: {
      code: 'def half(x):\n    return x / 2\n\nprint(half(7))',
      note: 'Python\'s <code>/</code> always gives a decimal result, so it never needs a second version.',
    },
    starter: C`#include <iostream>
using namespace std;

int half(int n) {
    return n / 2;
}

// Add a half(double) that keeps the fraction.`,
    solution: C`#include <iostream>
using namespace std;

int half(int n) {
    return n / 2;
}

double half(double x) {
    return x / 2;
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << half(8) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << half(7) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << half(7.0) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << half(2.5) << endl;
    return 0;
}`,
    require: [{ pattern: 'double\\s+half\\s*\\(\\s*double', message: 'Add double half(double x)' }],
    tests: [
      { name: 'Even int', input: 'half(8)', expected: '4' },
      { name: 'Odd int drops the fraction', input: 'half(7)', expected: '3' },
      { name: 'Double keeps the fraction', input: 'half(7.0)', expected: '3.5' },
      { name: 'Another double', input: 'half(2.5)', expected: '1.25' },
    ],
  },

  // 13. default arguments
  {
    id: 'c3-default-args',
    title: 'Default arguments',
    kind: 'concept',
    task: 'Give <code>boxVolume</code> default values: <code>h</code> and <code>d</code> should default to 1, so <code>boxVolume(5)</code> is 5 and <code>boxVolume(5, 2)</code> is 10.',
    introduces: ['default-arg'],
    teach: {
      body: [
        `<p>As in Python's <code>def f(a, b=1)</code>, a C++ parameter can have a default value. Write it in the parameter list: <code>int boxVolume(int w, int h = 1, int d = 1)</code>. A call may then leave off the trailing arguments, and the defaults fill in: <code>boxVolume(5)</code> uses <code>h = 1</code> and <code>d = 1</code>.</p>`,
        `<p>Two rules. Defaults go on the <em>rightmost</em> parameters, with no required parameter after a defaulted one. And you write the default in one place only: in the prototype if there is one, otherwise in the definition. You may leave off arguments only from the right, so <code>boxVolume(5, 2)</code> sets <code>h</code> and keeps <code>d</code>; you cannot skip <code>h</code> and give <code>d</code>. Python lets you pass by name to skip; C++ does not.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

int add(int a, int b = 10) {      // b defaults to 10
    return a + b;
}

int main() {
    cout << add(1) << endl;       // b is 10
    cout << add(1, 2) << endl;    // b is 2
    return 0;
}`,
          output: '11\n3',
          caption: 'Leave off arguments from the right.',
        },
      ],
      terms: [
        { code: 'int b = 10', meaning: 'a default: used when the caller leaves this argument out' },
      ],
    },
    compare: {
      py: { code: 'def add(a, b=10):\n    return a + b\n\nprint(add(1))', outcome: 'Prints 11', ok: true },
      cpp: { code: C`int add(int a, int b = 10) {
    return a + b;
}

int main() {
    cout << add(1) << endl;
    return 0;
}`, outcome: 'Prints 11', ok: true },
      text: 'The syntax is the same idea. C++ cannot pass arguments by name, so you can only drop arguments from the right.',
    },
    refresher: [
      'A default goes after the parameter: <code>int h = 1</code>. Defaults must be the rightmost parameters.',
      'Callers may leave off arguments from the right only.',
    ],
    hints: [
      'Edit the first line of <code>boxVolume</code>: add <code>= 1</code> after <code>h</code> and after <code>d</code>.',
      '<code>int boxVolume(int w, int h = 1, int d = 1)</code>.',
    ],
    inPython: {
      code: 'def box_volume(w, h=1, d=1):\n    return w * h * d\n\nprint(box_volume(5))',
      note: 'Identical idea. Python also lets you write <code>box_volume(5, d=3)</code>; C++ cannot skip a middle argument.',
    },
    starter: C`#include <iostream>
using namespace std;

int boxVolume(int w, int h, int d) {
    return w * h * d;
}`,
    solution: C`#include <iostream>
using namespace std;

int boxVolume(int w, int h = 1, int d = 1) {
    return w * h * d;
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << boxVolume(5) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << boxVolume(5, 2) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << boxVolume(2, 3, 4) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << boxVolume(7, 1, 3) << endl;
    return 0;
}`,
    require: [{ pattern: 'h\\s*=\\s*1', message: 'Give h a default of 1' }, { pattern: 'd\\s*=\\s*1', message: 'Give d a default of 1' }],
    tests: [
      { name: 'Width only', input: 'boxVolume(5)', expected: '5' },
      { name: 'Width and height', input: 'boxVolume(5, 2)', expected: '10' },
      { name: 'All three', input: 'boxVolume(2, 3, 4)', expected: '24' },
      { name: 'Explicit ones', input: 'boxVolume(7, 1, 3)', expected: '21' },
    ],
  },

  // 14. recursion
  {
    id: 'c3-recursion',
    title: 'A function that calls itself',
    kind: 'concept',
    task: 'Write <code>factorial</code> recursively: <code>factorial(n)</code> is n times (n minus 1) times ... times 1, and <code>factorial(0)</code> is 1. Use <code>long long</code>.',
    introduces: [],
    teach: {
      body: [
        `<p>A function may call itself. This is <em>recursion</em>, and it works like in Python. A recursive function needs two parts: a <em>base case</em> that answers directly without calling itself (here <code>n == 0</code> gives 1), and a <em>recursive case</em> that solves a slightly smaller problem and builds on it: <code>n * factorial(n - 1)</code>. Each step must move toward the base case, or the calls never stop.</p>`,
        `<p>How does it run? Every call gets its own copy of <code>n</code>, kept on a region of memory called the <em>call stack</em>. A call that is waiting for the one below it stays on the stack until that one returns. The stack has a limited size. If recursion never reaches its base case, or goes millions deep, the stack overflows and the program crashes. Python stops earlier with a <code>RecursionError</code> after about 1000 calls; C++ simply crashes.</p>`,
        `<p>The numbers grow quickly: 20! is about 2.4 times ten to the 18th, which still fits in a <code>long long</code> but not in an <code>int</code>.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

long long sumTo(int n) {
    if (n == 0) {                 // base case: no more work
        return 0;
    }
    return n + sumTo(n - 1);      // recursive case: a smaller problem
}

int main() {
    cout << sumTo(4) << endl;     // 4 + 3 + 2 + 1 + 0
    return 0;
}`,
          output: '10',
          caption: 'A base case and a step toward it.',
        },
      ],
      terms: [
        { code: 'base case', meaning: 'the input the function answers directly, without calling itself' },
        { code: 'recursive case', meaning: 'a call on a smaller input, whose answer is built upon' },
        { code: 'call stack', meaning: 'the limited memory where each active call keeps its variables' },
      ],
    },
    compare: {
      py: { code: 'def forever(n):\n    return forever(n + 1)\n\ntry:\n    forever(0)\nexcept RecursionError:\n    print("RecursionError")', outcome: 'Python stops it: RecursionError', ok: true },
      cpp: { code: C`int forever(int n) {
    return forever(n + 1);
}`, outcome: 'No base case: crashes when the stack overflows', ok: false },
      text: 'Python raises <code>RecursionError</code> at about 1000 levels. C++ has no such guard: the stack runs out and the program crashes.',
    },
    refresher: [
      'A recursive function needs a base case and a call on a smaller input. <code>factorial(0)</code> is 1.',
      'Each call has its own variables on the stack; very deep or endless recursion overflows it and crashes.',
    ],
    hints: [
      'If <code>n</code> is 0, return 1.',
      'Otherwise return <code>n * factorial(n - 1)</code>. Both parts return a <code>long long</code>.',
    ],
    inPython: {
      code: 'def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))',
      note: 'The same function. Python ints never overflow, so it also works for huge n; C++ needs <code>long long</code>, and 21 is already too big.',
    },
    starter: C`#include <iostream>
using namespace std;

// Return n * (n-1) * ... * 1, with factorial(0) = 1.
long long factorial(int n) {
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

// Return n * (n-1) * ... * 1, with factorial(0) = 1.
long long factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << factorial(0) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << factorial(1) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << factorial(5) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << factorial(10) << endl;
    cout << "\n@@TEST 5@@" << endl;
    cout << factorial(20) << endl;
    return 0;
}`,
    require: [{ pattern: 'factorial\\s*\\(\\s*n\\s*-\\s*1', message: 'Call factorial on a smaller number' }],
    tests: [
      { name: 'Base case', input: 'factorial(0)', expected: '1' },
      { name: 'One', input: 'factorial(1)', expected: '1' },
      { name: 'Five', input: 'factorial(5)', expected: '120' },
      { name: 'Ten', input: 'factorial(10)', expected: '3628800' },
      { name: 'Twenty needs long long', input: 'factorial(20)', expected: '2432902008176640000' },
    ],
  },

  // 15. predict: recursion order
  {
    id: 'c3-predict-recursion-order',
    title: 'Before or after the call?',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    refresher: [
      'Code before the recursive call runs on the way in; code after it runs on the way out, in reverse order.',
      '<code>return;</code> in a <code>void</code> function leaves it at once; here it ends the recursion.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

void countdown(int n) {
    if (n == 0) {
        return;
    }
    cout << n << " ";
    countdown(n - 1);
}

int main() {
    countdown(3);
    cout << endl;
    return 0;
}`,
        choices: ['3 2 1', '1 2 3', '3 3 3'],
        answer: 0,
        why: 'Each call prints its own n first and only then calls the smaller one, so the numbers appear on the way in: 3, then 2, then 1.',
        output: '3 2 1',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

void show(int n) {
    if (n == 0) {
        return;
    }
    show(n - 1);
    cout << n << " ";
}

int main() {
    show(3);
    cout << endl;
    return 0;
}`,
        choices: ['3 2 1', '1 2 3', '3 1 2'],
        answer: 1,
        why: 'Now the print comes after the recursive call, so it happens on the way out. The deepest call (n = 1) finishes first, then 2, then 3.',
        output: '1 2 3',
      },
    ],
  },

  // 16. fibonacci
  {
    id: 'c3-fibonacci',
    title: 'Fibonacci, recursively',
    kind: 'drill',
    task: 'Write <code>fib</code> recursively: <code>fib(0)</code> is 0, <code>fib(1)</code> is 1, and every other value is the sum of the two before it.',
    introduces: [],
    teach: {
      body: [
        `<p>Some problems call themselves more than once. The Fibonacci numbers 0, 1, 1, 2, 3, 5, 8, ... follow the rule "each is the sum of the previous two", so <code>fib(n)</code> is <code>fib(n - 1) + fib(n - 2)</code>. This time there are <em>two</em> base cases, <code>fib(0)</code> and <code>fib(1)</code>.</p>`,
        `<p>Each call spawns two more, so the number of calls roughly doubles every step up. <code>fib(30)</code> already makes over a million calls, and <code>fib(50)</code> would take hours. This simple version is fine for learning; later stages show how to avoid the repeated work.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

int triangle(int n) {              // 0, 1, 3, 6, 10, ...
    if (n <= 1) {
        return n;                  // base cases 0 and 1
    }
    return n + triangle(n - 1);
}

int main() {
    cout << triangle(4) << endl;
    return 0;
}`,
          output: '10',
          caption: 'Base cases first, then the recursive step.',
        },
      ],
      terms: [
        { code: 'fib(n - 1) + fib(n - 2)', meaning: 'two recursive calls, each on a smaller input' },
      ],
    },
    refresher: [
      'Two base cases: <code>fib(0)</code> is 0 and <code>fib(1)</code> is 1. Otherwise add the two previous results.',
      'Test <code>n &lt; 2</code> and return n to cover both base cases at once.',
    ],
    hints: [
      'If n is less than 2, the answer is n itself.',
      'Otherwise return <code>fib(n - 1) + fib(n - 2)</code>.',
    ],
    inPython: {
      code: 'def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(10))',
      note: 'Identical in Python. Both languages repeat a lot of work here, so neither handles a large n well.',
    },
    starter: C`#include <iostream>
using namespace std;

// fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2).
int fib(int n) {
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

// fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2).
int fib(int n) {
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << fib(0) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << fib(1) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << fib(2) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << fib(10) << endl;
    cout << "\n@@TEST 5@@" << endl;
    cout << fib(15) << endl;
    return 0;
}`,
    tests: [
      { name: 'fib(0)', input: 'fib(0)', expected: '0' },
      { name: 'fib(1)', input: 'fib(1)', expected: '1' },
      { name: 'fib(2)', input: 'fib(2)', expected: '1' },
      { name: 'fib(10)', input: 'fib(10)', expected: '55' },
      { name: 'fib(15)', input: 'fib(15)', expected: '610' },
    ],
  },

  // 17. power
  {
    id: 'c3-power',
    title: 'Power, recursively',
    kind: 'drill',
    task: 'Write <code>power</code> recursively: <code>power(base, n)</code> is base multiplied by itself n times, and <code>power(base, 0)</code> is 1. Return a <code>long long</code>.',
    introduces: [],
    teach: {
      body: [
        `<p>Raising to a power is repeated multiplication, so it has a recursive shape: <code>base^n = base * base^(n-1)</code>, and <code>base^0 = 1</code> is the base case. That takes n calls. A smarter version halves the problem: <code>base^n</code> is <code>(base^(n/2))^2</code>, with one extra <code>base</code> when n is odd. That needs only about log n calls, and it is a pattern you will see again in DSA.</p>`,
        `<p>Either works for this exercise. The result can get large, so the function returns a <code>long long</code>.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

long long times(int a, int n) {      // a * n by repeated addition
    if (n == 0) {
        return 0;                    // base case
    }
    return a + times(a, n - 1);      // one fewer step each call
}

int main() {
    cout << times(6, 4) << endl;
    return 0;
}`,
          output: '24',
          caption: 'The same shape with addition instead of multiplication.',
        },
      ],
      terms: [
        { code: 'base * power(base, n - 1)', meaning: 'one multiplication plus a smaller power' },
      ],
    },
    refresher: [
      '<code>power(base, 0)</code> is 1. Otherwise multiply base by <code>power(base, n - 1)</code>.',
      'Use <code>long long</code> for the result so larger powers fit.',
    ],
    hints: [
      'Base case first: n equal to 0 returns 1.',
      'The recursive case is <code>base * power(base, n - 1)</code>. Make sure the return type is <code>long long</code>.',
    ],
    inPython: {
      code: 'def power(base, n):\n    if n == 0:\n        return 1\n    return base * power(base, n - 1)\n\nprint(power(2, 10))',
      note: 'The same recursion. Python also has <code>**</code>, and its ints never overflow.',
    },
    starter: C`#include <iostream>
using namespace std;

// Return base raised to the power n (n is zero or more).
long long power(int base, int n) {
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

// Return base raised to the power n (n is zero or more).
long long power(int base, int n) {
    if (n == 0) {
        return 1;
    }
    return base * power(base, n - 1);
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << power(2, 10) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << power(5, 0) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << power(3, 4) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << power(2, 40) << endl;
    cout << "\n@@TEST 5@@" << endl;
    cout << power(-2, 3) << endl;
    return 0;
}`,
    tests: [
      { name: '2 to the 10', input: 'power(2, 10)', expected: '1024' },
      { name: 'Anything to the 0', input: 'power(5, 0)', expected: '1' },
      { name: '3 to the 4', input: 'power(3, 4)', expected: '81' },
      { name: 'Too big for an int', input: 'power(2, 40)', expected: '1099511627776' },
      { name: 'Negative base', input: 'power(-2, 3)', expected: '-8' },
    ],
  },

  // 18. namespaces
  {
    id: 'c3-namespaces',
    title: 'Namespaces and using namespace std',
    kind: 'concept',
    task: 'This program must compile <em>without</em> <code>using namespace std;</code>. Add <code>using</code> declarations for the two names it needs from <code>std</code>.',
    introduces: ['using-declaration', 'namespace-def', 'scope-resolution'],
    teach: {
      body: [
        `<p>A big program has thousands of names, and two libraries may both want the name <code>count</code> or <code>sort</code>. C++ solves this with <em>namespaces</em>: named groups of names. Everything in the standard library lives in the namespace <code>std</code>, so its real name is <code>std::cout</code>, where <code>::</code> means "the name inside this namespace". You wrote that in stage 1. The line <code>using namespace std;</code> that you have typed since lesson 1 means "treat every name in <code>std</code> as if it were written without the <code>std::</code>". It is handy in small programs.</p>`,
        `<p>Its cost is that it pulls in <em>everything</em>, so your own names can silently collide with a library name, and big projects avoid it. A tighter tool is a <em>using declaration</em>: <code>using std::cout;</code> brings in just that one name. You can also make your own namespace, <code>namespace geometry { int area(int w, int h) { ... } }</code>, and call it as <code>geometry::area(3, 4)</code>. Python's <code>import math</code> and <code>math.sqrt</code> play the same role.</p>`,
        `<p>This is also why header files exist. <code>#include &lt;iostream&gt;</code> pastes in a file full of <em>declarations</em> (prototypes and namespaces), so the compiler knows what <code>std::cout</code> is before it reaches your code. The bodies are compiled elsewhere and joined to your program afterwards.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>

namespace geometry {                     // a namespace of our own
    int area(int w, int h) {
        return w * h;
    }
}

int main() {
    std::cout << geometry::area(3, 4) << std::endl;   // :: picks the name inside
    return 0;
}`,
          output: '12',
          caption: 'Full names, no using namespace.',
        },
        {
          code: C`#include <iostream>
using std::cout;                 // bring in just these two names
using std::endl;

int main() {
    cout << "short names, safely" << endl;
    return 0;
}`,
          output: 'short names, safely',
          caption: 'A using declaration imports one name at a time.',
        },
      ],
      terms: [
        { code: 'std::cout', meaning: 'the name cout inside the namespace std' },
        { code: 'using namespace std;', meaning: 'every name in std can be written without std::' },
        { code: 'using std::cout;', meaning: 'only cout can be written without std::' },
        { code: 'namespace name { ... }', meaning: 'your own named group of names, used as name::item' },
      ],
    },
    compare: {
      py: { code: 'import math\nprint(math.sqrt(16))', outcome: 'Prints 4.0: the name is math.sqrt', ok: true },
      cpp: { code: C`std::cout << std::sqrt(16.0) << std::endl;`, outcome: 'Prints 4: the name is std::sqrt', ok: true },
      text: 'A C++ namespace is like a Python module: names are qualified as <code>std::sqrt</code> or <code>math.sqrt</code> unless you import them.',
    },
    refresher: [
      '<code>using std::cout;</code> lets you write <code>cout</code> alone; <code>using namespace std;</code> does it for every name in <code>std</code>.',
      'Your own namespace is used as <code>geometry::area(...)</code>.',
    ],
    hints: [
      'The error names a missing identifier. Which two names from <code>std</code> does <code>main</code> use?',
      'Add <code>using std::cout;</code> and <code>using std::endl;</code> below the include line.',
    ],
    inPython: {
      code: 'from math import sqrt\nprint(sqrt(16))',
      note: 'Python\'s <code>from math import sqrt</code> is the counterpart of a using declaration. <code>import math</code> alone matches writing <code>std::</code> every time.',
    },
    starter: C`#include <iostream>

namespace geometry {
    int area(int w, int h) {
        return w * h;
    }
}

int main() {
    int w, h;
    std::cin >> w >> h;
    cout << geometry::area(w, h) << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using std::cout;
using std::endl;

namespace geometry {
    int area(int w, int h) {
        return w * h;
    }
}

int main() {
    int w, h;
    std::cin >> w >> h;
    cout << geometry::area(w, h) << endl;
    return 0;
}`,
    require: [{ pattern: 'geometry::area', message: 'Keep calling geometry::area' }],
    forbidden: [{ pattern: 'using\\s+namespace\\s+std', message: 'Do not use using namespace std; here' }],
    tests: [
      { name: 'Three by four', stdin: '3 4\n', expected: '12' },
      { name: 'Square', stdin: '5 5\n', expected: '25' },
      { name: 'Zero width', stdin: '0 7\n', expected: '0' },
    ],
  },

  // 19. practice: primes with functions
  {
    id: 'c3-practice-primes',
    title: 'Practice: prime helpers',
    kind: 'implement',
    task: 'Write <code>isPrime</code>, which returns true for a prime number and false otherwise, and <code>nextPrime</code>, which returns the smallest prime that is greater than its argument. Let <code>nextPrime</code> call <code>isPrime</code>.',
    introduces: [],
    refresher: [
      'A number below 2 is not prime. Otherwise try divisors d while <code>d * d &lt;= n</code>; any divisor means not prime.',
      '<code>nextPrime</code> can count upward from <code>n + 1</code> until <code>isPrime</code> says yes.',
    ],
    hints: [
      'Write <code>isPrime</code> first: return false for n below 2, loop over divisors, return true at the end.',
      'For <code>nextPrime</code>: <code>int k = n + 1;</code> then <code>while (!isPrime(k)) { k++; }</code> and return k.',
    ],
    inPython: {
      code: 'def is_prime(n):\n    if n < 2:\n        return False\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            return False\n        d += 1\n    return True\n\nprint(is_prime(97))',
      note: 'Same logic. C++ writes <code>bool</code>, <code>true</code> and <code>false</code> in lowercase, and the helper must be defined before <code>nextPrime</code> uses it.',
    },
    starter: C`#include <iostream>
using namespace std;

// True when n is prime (n below 2 is not).
bool isPrime(int n) {
    return false;
}

// The smallest prime greater than n.
int nextPrime(int n) {
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

// True when n is prime (n below 2 is not).
bool isPrime(int n) {
    if (n < 2) {
        return false;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}

// The smallest prime greater than n.
int nextPrime(int n) {
    int k = n + 1;
    while (!isPrime(k)) {
        k++;
    }
    return k;
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << (isPrime(2) ? "yes" : "no") << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << (isPrime(1) ? "yes" : "no") << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << (isPrime(15) ? "yes" : "no") << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << (isPrime(97) ? "yes" : "no") << endl;
    cout << "\n@@TEST 5@@" << endl;
    cout << nextPrime(14) << endl;
    cout << "\n@@TEST 6@@" << endl;
    cout << nextPrime(1) << endl;
    return 0;
}`,
    tests: [
      { name: '2 is prime', input: 'isPrime(2)', expected: 'yes' },
      { name: '1 is not', input: 'isPrime(1)', expected: 'no' },
      { name: '15 is not', input: 'isPrime(15)', expected: 'no' },
      { name: '97 is prime', input: 'isPrime(97)', expected: 'yes' },
      { name: 'After 14', input: 'nextPrime(14)', expected: '17' },
      { name: 'After 1', input: 'nextPrime(1)', expected: '2' },
    ],
  },

  // 20. practice: gcd and lcm
  {
    id: 'c3-practice-gcd',
    title: 'Practice: gcd and lcm',
    kind: 'implement',
    task: 'Write <code>gcd</code> recursively (Euclid: <code>gcd(a, b)</code> is <code>a</code> when <code>b</code> is 0, else <code>gcd(b, a % b)</code>) and <code>lcm</code>, which uses <code>gcd</code>.',
    introduces: [],
    refresher: [
      'Euclid: <code>gcd(a, 0)</code> is <code>a</code>; otherwise <code>gcd(b, a % b)</code>.',
      'The least common multiple is <code>a / gcd(a, b) * b</code>. Divide first so the product stays small.',
    ],
    hints: [
      'The base case is <code>b == 0</code>: return a. The recursive call swaps the arguments and takes a remainder.',
      '<code>lcm</code> is one <code>return</code>: <code>a / gcd(a, b) * b</code>.',
    ],
    inPython: {
      code: 'import math\nprint(math.gcd(12, 18))\nprint(12 * 18 // math.gcd(12, 18))',
      note: 'Python ships <code>math.gcd</code>. In C++ you write it yourself, and it is a classic recursive function.',
    },
    starter: C`#include <iostream>
using namespace std;

// Greatest common divisor of a and b.
int gcd(int a, int b) {
    return 0;
}

// Least common multiple of a and b (both above 0).
int lcm(int a, int b) {
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

// Greatest common divisor of a and b.
int gcd(int a, int b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

// Least common multiple of a and b (both above 0).
int lcm(int a, int b) {
    return a / gcd(a, b) * b;
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << gcd(12, 18) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << gcd(7, 13) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << gcd(0, 5) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << lcm(4, 6) << endl;
    cout << "\n@@TEST 5@@" << endl;
    cout << lcm(3, 7) << endl;
    return 0;
}`,
    tests: [
      { name: 'gcd(12, 18)', input: 'gcd(12, 18)', expected: '6' },
      { name: 'Coprime', input: 'gcd(7, 13)', expected: '1' },
      { name: 'One argument is zero', input: 'gcd(0, 5)', expected: '5' },
      { name: 'lcm(4, 6)', input: 'lcm(4, 6)', expected: '12' },
      { name: 'lcm of coprimes', input: 'lcm(3, 7)', expected: '21' },
    ],
  },

  // 21. practice: split seconds
  {
    id: 'c3-practice-split',
    title: 'Practice: split seconds',
    kind: 'implement',
    task: 'Write <code>splitSeconds</code>: given a total number of seconds, store the whole hours in <code>h</code>, the leftover minutes in <code>m</code> and the leftover seconds in <code>s</code>. The three outputs are references.',
    introduces: [],
    refresher: [
      'Hours are <code>total / 3600</code>. The rest is <code>total % 3600</code>; minutes are that rest <code>/ 60</code> and seconds are the rest <code>% 60</code>.',
      'Assign to the reference parameters; the function returns nothing.',
    ],
    hints: [
      'Compute <code>h</code> first, then the remaining seconds in a local variable.',
      'From the remaining seconds, <code>m = rest / 60</code> and <code>s = rest % 60</code>.',
    ],
    inPython: {
      code: 'h, rest = divmod(3661, 3600)\nm, s = divmod(rest, 60)\nprint(h, m, s)',
      note: 'Python returns the three parts as a tuple. In C++ you fill three variables that the caller passed by reference.',
    },
    starter: C`#include <iostream>
using namespace std;

// Split total seconds into hours, minutes and seconds.
void splitSeconds(int total, int& h, int& m, int& s) {
}`,
    solution: C`#include <iostream>
using namespace std;

// Split total seconds into hours, minutes and seconds.
void splitSeconds(int total, int& h, int& m, int& s) {
    h = total / 3600;
    int rest = total % 3600;
    m = rest / 60;
    s = rest % 60;
}`,
    harness: C`int main() {
    int harness_h = 0;
    int harness_m = 0;
    int harness_s = 0;
    cout << "\n@@TEST 1@@" << endl;
    splitSeconds(3661, harness_h, harness_m, harness_s);
    cout << harness_h << " " << harness_m << " " << harness_s << endl;
    cout << "\n@@TEST 2@@" << endl;
    splitSeconds(45, harness_h, harness_m, harness_s);
    cout << harness_h << " " << harness_m << " " << harness_s << endl;
    cout << "\n@@TEST 3@@" << endl;
    splitSeconds(7200, harness_h, harness_m, harness_s);
    cout << harness_h << " " << harness_m << " " << harness_s << endl;
    cout << "\n@@TEST 4@@" << endl;
    splitSeconds(86399, harness_h, harness_m, harness_s);
    cout << harness_h << " " << harness_m << " " << harness_s << endl;
    return 0;
}`,
    tests: [
      { name: 'One of each', input: 'splitSeconds(3661)', expected: '1 1 1' },
      { name: 'Under a minute', input: 'splitSeconds(45)', expected: '0 0 45' },
      { name: 'Exact hours', input: 'splitSeconds(7200)', expected: '2 0 0' },
      { name: 'Last second of a day', input: 'splitSeconds(86399)', expected: '23 59 59' },
    ],
  },
]
