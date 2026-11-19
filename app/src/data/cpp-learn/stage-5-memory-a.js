// C++ Learn lessons: stage 5 (part 1), memory and pointers: sizeof, addresses, pointers, null, arrays and pointers.
// Part 2 (the heap, smart pointers, structs, practice) is stage-5-memory-b.js; stage-5-memory.js joins the two.
// Contract: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md. Check: node scripts/verify-cpp-learn.mjs --stage 5
// Undefined behaviour (null dereference, reading past the end) is taught in prose and in `ub: true` predict rounds;
// its output is never stored. Raw addresses are never printed: pointers are compared (p == &x) or subtracted instead.
// C++ code is written with String.raw so a C++ "\n" stays a backslash-n.
const c = String.raw

export const LESSONS = [
  // 1. what Python hides: variables are boxes with a size
  {
    id: 'c5-sizeof',
    title: 'Variables are boxes in memory',
    kind: 'concept',
    task: `Print how many bytes a <code>char</code>, an <code>int</code>, a <code>double</code> and a <code>long long</code> take, one per line as <em>name: bytes</em>, in that order. Use <code>sizeof</code>, do not type the numbers.`,
    introduces: ['sizeof'],
    teach: {
      body: [
        `<p>Python hides where your data lives. When you write <code>x = 5</code>, Python builds an object somewhere, and the name <code>x</code> refers to it. C++ is closer to the machine. The computer's memory is a very long row of numbered cells called <em>bytes</em>. A variable is a named stretch of that row with a <em>fixed size</em> that depends on its type. <code>int x = 5;</code> reserves a box of 4 bytes (on the computers this course targets) and puts 5 in it.</p>`,
        `<p><code>sizeof</code> tells you how many bytes a type or a variable takes: <code>sizeof(int)</code> or <code>sizeof(x)</code>. The compiler works the answer out before the program runs. A <code>char</code> is 1 byte, an <code>int</code> is 4, a <code>double</code> is 8 and a <code>long long</code> is 8. The sizes are why <code>int</code> overflows (stage 1): there are only so many bits in the box.</p>`,
        `<p>This matters for the rest of the stage, because every variable has a place in the row, and C++ lets you ask for that place and work with it directly. Python gives you no way to do that; <code>sys.getsizeof</code> is the nearest thing, and it measures a whole Python object, not a box.</p>`,
      ],
      examples: [
        {
          code: c`int a = 7;
double d = 2.5;
char ch = 'x';
cout << sizeof(a) << " " << sizeof(d) << " " << sizeof(ch) << endl;   // bytes of each variable
cout << sizeof(int) << endl;                                            // or ask about a type`,
          output: '4 8 1\n4',
          caption: 'sizeof works on a variable or a type.',
          wrap: true,
        },
        {
          code: c`int arr[10];                                  // ten ints side by side
cout << sizeof(arr) << endl;                  // 40: ten boxes of 4 bytes
cout << sizeof(arr) / sizeof(arr[0]) << endl; // 10: total bytes divided by one element`,
          output: '40\n10',
          caption: 'An array is one block of boxes; this trick counts them.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'sizeof(x)', meaning: 'the number of bytes the variable x or the type takes' },
        { code: 'byte', meaning: 'one numbered cell of memory; a char is exactly one' },
      ],
    },
    compare: {
      py: { code: 'import sys\nprint(sys.getsizeof(5))', outcome: 'Prints the size of a whole Python object', ok: true },
      cpp: { code: 'cout << sizeof(int) << endl;', outcome: 'Prints 4: the size of the box, fixed up front', ok: true },
      text: 'A Python int is an object that grows as needed. A C++ <code>int</code> is a fixed box, and <code>sizeof</code> tells you its size.',
    },
    refresher: [
      'A variable is a box of a fixed number of bytes. <code>sizeof(int)</code> is 4, <code>double</code> and <code>long long</code> are 8, <code>char</code> is 1.',
      '<code>sizeof</code> is worked out by the compiler, before the program runs. It needs no <code>#include</code>.',
    ],
    hints: [
      'Print a label, then <code>sizeof(type)</code>, then end the line. Do that four times.',
      'For example <code>cout &lt;&lt; "int: " &lt;&lt; sizeof(int) &lt;&lt; endl;</code>.',
    ],
    inPython: {
      code: 'import sys\nprint(sys.getsizeof(5))\nprint(sys.getsizeof(5.0))',
      note: 'Python can only tell you the size of a whole object. C++ tells you the size of a plain box, and that box never changes size.',
    },
    starter: c`#include <iostream>
using namespace std;

int main() {
    cout << "char: " << sizeof(char) << endl;
    // print the other three the same way
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

int main() {
    cout << "char: " << sizeof(char) << endl;
    cout << "int: " << sizeof(int) << endl;
    cout << "double: " << sizeof(double) << endl;
    cout << "long long: " << sizeof(long long) << endl;
    return 0;
}`,
    require: [{ pattern: 'sizeof\\s*\\(\\s*long\\s+long', message: 'Use sizeof(long long)' }],
    tests: [{ name: 'Four sizes', stdin: '', expected: 'char: 1\nint: 4\ndouble: 8\nlong long: 8' }],
  },

  // 2. addresses, pointers, dereference
  {
    id: 'c5-address-deref',
    title: 'Addresses and pointers',
    kind: 'concept',
    task: `Read a whole number into <code>x</code>. Make an <code>int*</code> named <code>p</code> that points at it. Add 100 to <code>x</code> by writing through <code>*p</code>, then print <code>x</code>.`,
    introduces: ['address-of', 'pointer-decl', 'deref'],
    teach: {
      body: [
        `<p>Every byte of memory has a number, its <em>address</em>. Writing <code>&amp;x</code> gives the address of the variable <code>x</code>: "where does x live?". A <em>pointer</em> is a variable whose value is an address. Its type says what lives there: <code>int*</code> means "pointer to an int". So <code>int* p = &amp;x;</code> makes a box named <code>p</code>, and puts the address of <code>x</code> in it.</p>`,
        `<p>To follow the address you <em>dereference</em> it with a star in front: <code>*p</code> means "the int that p points at". You can read it (<code>cout &lt;&lt; *p;</code>) and you can write it (<code>*p = 25;</code>), and writing changes <code>x</code> itself, because <code>*p</code> and <code>x</code> are the same box. The star appears in two jobs: after a type in a declaration (<code>int* p</code>) it means "pointer to", and in front of a pointer in an expression (<code>*p</code>) it means "follow it".</p>`,
        `<p>This course never prints an address. The number is different on every run and tells you nothing useful. To check that a pointer holds a variable's address you compare them: <code>p == &amp;x</code> is true (printed as 1).</p>`,
      ],
      examples: [
        {
          code: c`int x = 10;
int* p = &x;                  // p holds the address of x
cout << *p << endl;           // 10: follow the address and read
*p = 25;                      // follow the address and write
cout << x << endl;            // 25: x itself changed
cout << (p == &x) << endl;    // 1: p holds exactly x's address`,
          output: '10\n25\n1',
          caption: 'p and x reach the same box.',
          wrap: true,
        },
      ],
      terms: [
        { code: '&x', meaning: 'the address of the variable x' },
        { code: 'int* p', meaning: 'p is a pointer to an int: a variable that holds an address' },
        { code: '*p', meaning: 'the int that p points at; can be read or written' },
      ],
    },
    compare: {
      py: { code: 'a = [1]\nb = a\nb.append(2)\nprint(a)', outcome: 'Prints [1, 2]: two names, one list', ok: true },
      cpp: { code: 'int x = 5;\nint* p = &x;\n*p = 25;\ncout << x << endl;', outcome: 'Prints 25: p and x reach one box', ok: true },
      text: 'Python names always refer to objects, and you never see an address. A C++ pointer is that idea made visible: you hold an address and decide when to follow it.',
    },
    refresher: [
      '<code>&amp;x</code> is the address of x. <code>int* p = &amp;x;</code> stores it. <code>*p</code> follows it, to read or to write.',
      'Never print an address: it changes on every run. Compare pointers with <code>==</code> instead.',
    ],
    hints: [
      'Read <code>x</code> first, then declare <code>int* p = &amp;x;</code>.',
      'Write <code>*p = *p + 100;</code>, then print <code>x</code> (not <code>p</code>).',
    ],
    inPython: {
      code: 'x = [10]\np = x\np[0] = 25\nprint(x[0])',
      note: 'Python has no pointers: <code>p = x</code> makes a second name for the same list. A C++ pointer is an explicit address you follow with <code>*</code>.',
    },
    starter: c`#include <iostream>
using namespace std;

int main() {
    int x;
    cin >> x;
    // make a pointer to x, add 100 through it, print x
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

int main() {
    int x;
    cin >> x;
    int* p = &x;
    *p = *p + 100;
    cout << x << endl;
    return 0;
}`,
    require: [{ pattern: '\\*\\s*p\\s*(=|\\+=)', message: 'Write through the pointer: *p = ...' }],
    tests: [
      { name: 'Positive', stdin: '5\n', expected: '105' },
      { name: 'Negative', stdin: '-100\n', expected: '0' },
      { name: 'Zero', stdin: '0\n', expected: '100' },
    ],
  },

  // 3. fix: pointer needs an address
  {
    id: 'c5-fix-pointer-type',
    title: 'A pointer needs an address',
    kind: 'fix',
    task: `This does not compile. Fix it so it prints <em>42</em> by making the pointer hold the address of <code>score</code>.`,
    errorMatch: 'cannot initialize a variable of type',
    gloss: 'An <code>int*</code> holds an address, but <code>score</code> is a plain int, so the compiler refuses to put a number where an address belongs.',
    introduces: [],
    refresher: [
      'A pointer is set from an address: <code>int* p = &amp;score;</code>. A plain int is not an address.',
      'Read the type names in the error: it says an <code>int *</code> cannot be made from an <code>int</code>.',
    ],
    hints: [
      'The error names the two types that do not match. Look at the line that creates <code>p</code>.',
      'Put the address-of operator in front of <code>score</code>.',
    ],
    inPython: {
      code: 'score = 42\nref = score\nprint(ref)',
      note: 'Python assignment never mixes a value with an address. C++ keeps them as different types, so mixing them is a compile error.',
    },
    starter: c`#include <iostream>
using namespace std;

int main() {
    int score = 42;
    int* p = score;
    cout << *p << endl;
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

int main() {
    int score = 42;
    int* p = &score;
    cout << *p << endl;
    return 0;
}`,
    require: [{ pattern: 'int\\s*\\*\\s*p\\s*=', message: 'Keep int* p and set it from the address of score' }],
    tests: [{ name: 'Prints 42', stdin: '', expected: '42' }],
  },

  // 4. predict: two pointers, one box
  {
    id: 'c5-predict-aliasing',
    title: 'Two pointers, one box',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    refresher: [
      'Copying a pointer copies the address: both pointers then reach the same variable.',
      'Assigning to a pointer (<code>p = q;</code>) re-aims it. Assigning to <code>*p</code> changes the box it points at.',
    ],
    rounds: [
      {
        snippet: c`#include <iostream>
using namespace std;

int main() {
    int a = 5;
    int* p = &a;
    int* q = p;
    *q = 9;
    cout << a << " " << *p << endl;
    return 0;
}`,
        choices: ['5 9', '9 9', '5 5'],
        answer: 1,
        why: 'q = p copied the address, so p and q both point at a. Writing 9 through q changes a, and reading through p sees the same box.',
        output: '9 9',
      },
      {
        snippet: c`#include <iostream>
using namespace std;

int main() {
    int a = 5;
    int b = 7;
    int* p = &a;
    int* q = &b;
    p = q;
    *p = 1;
    cout << a << " " << b << endl;
    return 0;
}`,
        choices: ['1 7', '5 1', '1 1'],
        answer: 1,
        why: 'p = q re-aims p at b; a is never touched. Then *p = 1 writes into b, so the output is 5 and 1.',
        output: '5 1',
      },
    ],
  },

  // 5. drill: write through a pointer parameter
  {
    id: 'c5-write-through',
    title: 'Change a variable through a pointer',
    kind: 'drill',
    task: `Write <code>addTen</code>: it takes an <code>int*</code> and adds 10 to the int it points at. It returns nothing.`,
    introduces: [],
    refresher: [
      'A pointer parameter receives an address, so the function can change the caller\'s variable: <code>*p = *p + 10;</code>.',
      'The caller passes the address with <code>&amp;</code>, for example <code>addTen(&amp;n)</code>.',
    ],
    hints: [
      'The body is one statement that writes through the pointer.',
      'Read <code>*p</code>, add 10, and store the result back in <code>*p</code>.',
    ],
    inPython: {
      code: 'def add_ten(box):\n    box[0] += 10\n\nn = [5]\nadd_ten(n)\nprint(n[0])',
      note: 'Python changes a caller\'s value only through a mutable object such as a list. C++ passes an address, and the function writes to whatever it points at.',
    },
    starter: c`#include <iostream>
using namespace std;

// Add 10 to the int that p points at.
void addTen(int* p) {
}`,
    solution: c`#include <iostream>
using namespace std;

// Add 10 to the int that p points at.
void addTen(int* p) {
    *p = *p + 10;
}`,
    harness: c`int main() {
    int harness_a = 5, harness_b = -10, harness_c = 0, harness_u = 1, harness_v = 2;
    cout << "\n@@TEST 1@@" << endl;
    addTen(&harness_a);
    cout << harness_a << endl;
    cout << "\n@@TEST 2@@" << endl;
    addTen(&harness_b);
    cout << harness_b << endl;
    cout << "\n@@TEST 3@@" << endl;
    addTen(&harness_c);
    addTen(&harness_c);
    cout << harness_c << endl;
    cout << "\n@@TEST 4@@" << endl;
    addTen(&harness_u);
    cout << harness_u << " " << harness_v << endl;
    return 0;
}`,
    require: [{ pattern: '\\*\\s*p\\s*(=|\\+=)', message: 'Write through the pointer: *p = ...' }],
    tests: [
      { name: 'Positive', input: 'addTen(&a) with a = 5', expected: '15' },
      { name: 'Negative', input: 'addTen(&b) with b = -10', expected: '0' },
      { name: 'Twice on one variable', input: 'addTen(&c) two times, c = 0', expected: '20' },
      { name: 'Only the target changes', input: 'addTen(&u), v = 2 nearby', expected: '11 2' },
    ],
  },

  // 6. nullptr and the null check
  {
    id: 'c5-nullptr',
    title: 'A pointer to nothing',
    kind: 'concept',
    task: `Write <code>valueOr</code>: return the int that <code>p</code> points at, or <code>fallback</code> when <code>p</code> is <code>nullptr</code>.`,
    introduces: ['nullptr'],
    teach: {
      body: [
        `<p>Python has <code>None</code> for "no object". A C++ pointer has <code>nullptr</code>: the pointer that points at nothing. <code>int* p = nullptr;</code> is a valid pointer that is deliberately empty. You test for it like any other comparison: <code>p == nullptr</code> or <code>p != nullptr</code>.</p>`,
        `<p>This is the single most important habit with pointers: <em>check before you follow</em>. Dereferencing a null pointer is undefined behaviour. In Python, <code>None.something</code> stops with a clear <code>AttributeError</code>. In C++ nothing promises a clear message: the program usually crashes, but the rules say anything may happen. The same goes for a pointer you never set: <code>int* p;</code> holds garbage, so always start with an address or with <code>nullptr</code>.</p>`,
      ],
      examples: [
        {
          code: c`int* p = nullptr;                  // points at nothing
if (p == nullptr) { cout << "points at nothing" << endl; }
int n = 4;
p = &n;                            // now it points at n
if (p != nullptr) { cout << *p << endl; }   // safe: checked first`,
          output: 'points at nothing\n4',
          caption: 'Check, then follow.',
          wrap: true,
        },
        {
          code: c`int n = 3;
int* a = &n;
int* b = nullptr;
cout << (a != nullptr) << " " << (b != nullptr) << endl;   // 1 0`,
          output: '1 0',
          caption: 'A null check is an ordinary comparison.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'nullptr', meaning: 'a pointer value that points at nothing' },
        { code: 'p != nullptr', meaning: 'true when p points at something, so *p is safe to follow' },
      ],
    },
    compare: {
      py: { code: 'p = None\nprint(p.bit_length())', outcome: 'AttributeError: a clear stop', ok: false },
      cpp: { code: 'int* p = nullptr;\ncout << *p << endl;', outcome: 'Undefined: it usually crashes, with no clear message', ok: false },
      text: 'Python stops with a clear error on <code>None</code>. C++ does not check for you, so the check is your job, and skipping it is undefined behaviour.',
    },
    refresher: [
      '<code>nullptr</code> means "points at nothing". Compare with <code>p == nullptr</code> or <code>p != nullptr</code>.',
      'Following a null pointer with <code>*p</code> is undefined behaviour. Check first. An unset pointer holds garbage, so start it at <code>nullptr</code>.',
    ],
    hints: [
      'Test <code>p == nullptr</code> first and return <code>fallback</code> in that case.',
      'Only after that check do you read <code>*p</code>. A stored 0 is a real value, not "missing".',
    ],
    inPython: {
      code: 'def value_or(p, fallback):\n    return fallback if p is None else p\n\nprint(value_or(None, -1))',
      note: 'Python tests <code>is None</code> for the same reason. In C++ the test is <code>p == nullptr</code>, and the value is read with <code>*p</code>.',
    },
    starter: c`#include <iostream>
using namespace std;

// Return *p, or fallback when p is nullptr.
int valueOr(int* p, int fallback) {
    return fallback;
}`,
    solution: c`#include <iostream>
using namespace std;

// Return *p, or fallback when p is nullptr.
int valueOr(int* p, int fallback) {
    if (p == nullptr) {
        return fallback;
    }
    return *p;
}`,
    harness: c`int main() {
    int harness_x = 7, harness_zero = 0;
    int* harness_none = nullptr;
    cout << "\n@@TEST 1@@" << endl;
    cout << valueOr(&harness_x, -1) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << valueOr(nullptr, -1) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << valueOr(&harness_zero, 5) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << valueOr(harness_none, 99) << endl;
    return 0;
}`,
    require: [{ pattern: 'nullptr', message: 'Check the pointer against nullptr' }],
    tests: [
      { name: 'Points at 7', input: 'valueOr(&x, -1) with x = 7', expected: '7' },
      { name: 'Null gives the fallback', input: 'valueOr(nullptr, -1)', expected: '-1' },
      { name: 'A stored zero is a real value', input: 'valueOr(&zero, 5)', expected: '0' },
      { name: 'A null pointer variable', input: 'valueOr(none, 99)', expected: '99' },
    ],
  },

  // 7. predict: null dereference is UB
  {
    id: 'c5-predict-null',
    title: 'Following a null pointer',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    refresher: [
      'Dereferencing <code>nullptr</code> is undefined behaviour: it may crash, print garbage, or seem to work.',
      'A null check before the dereference makes the code defined again.',
    ],
    rounds: [
      {
        snippet: c`#include <iostream>
using namespace std;

int main() {
    int* p = nullptr;
    cout << *p << endl;
    return 0;
}`,
        choices: ['Prints 0', 'Undefined: anything can happen', 'Prints nothing'],
        answer: 1,
        why: 'There is no int at a null address, and C++ does not check. It usually crashes, but the language promises nothing, so the only honest answer is that it is undefined.',
        ub: true,
        output: 'Undefined: anything can happen (a null pointer was followed).',
      },
      {
        snippet: c`#include <iostream>
using namespace std;

int main() {
    int n = 8;
    int* p = &n;
    int* q = nullptr;
    if (q != nullptr) {
        cout << "q" << endl;
    }
    if (p != nullptr) {
        cout << "p " << *p << endl;
    }
    return 0;
}`,
        choices: ['q', 'p 8', 'q and then p 8'],
        answer: 1,
        why: 'q is null, so its check fails and nothing is followed. p holds the address of n, so the second block prints p and the value 8.',
        output: 'p 8',
      },
    ],
  },

  // 8. pointers versus references
  {
    id: 'c5-pointer-or-reference',
    title: 'Pointer or reference?',
    kind: 'concept',
    task: `Write two functions. <code>bumpRef</code> takes an <code>int&amp;</code> and adds 1 to it. <code>bumpPtr</code> takes an <code>int*</code> and adds 1 to the int it points at, but does nothing when the pointer is <code>nullptr</code>.`,
    introduces: [],
    teach: {
      body: [
        `<p>You already know a reference parameter (<code>int&amp; r</code>, stage 3): another name for the caller's variable. A pointer parameter reaches the same variable in a different way, so you have two tools for one job. A reference is declared with <code>&amp;</code> in the type and used like a plain variable: <code>int&amp; r = x;</code> makes <code>r</code> a second name for <code>x</code>. A pointer is its own variable that holds an address and needs <code>*</code> to follow it.</p>`,
        `<p>They differ in three ways. A reference must refer to something from the moment it exists; it can never be null. A reference can never be re-aimed: it names the same variable for life. A pointer may be <code>nullptr</code>, and <code>p = &amp;b;</code> re-aims it. So the rule of thumb is: use a <em>reference</em> when the thing must exist and you just want to work on it; use a <em>pointer</em> when "nothing" is a valid answer, when you must re-aim, or when you are dealing with arrays and heap memory (coming next).</p>`,
      ],
      examples: [
        {
          code: c`int x = 5;
int& r = x;        // r is another name for x: no star, no address
int* p = &x;       // p holds x's address
r = 6;
*p = *p + 1;
cout << x << endl; // 7: r, p and x all reach one box`,
          output: '7',
          caption: 'Two ways to reach the same variable.',
          wrap: true,
        },
        {
          code: c`int a = 1;
int b = 2;
int* p = &a;
p = &b;            // a pointer can be re-aimed
*p = 20;
cout << a << " " << b << endl;   // 1 20`,
          output: '1 20',
          caption: 'Re-aiming is something only a pointer can do.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'int& r = x;', meaning: 'r is a second name for x; never null, never re-aimed' },
        { code: 'p = &b;', meaning: 're-aims the pointer p at b' },
      ],
    },
    compare: {
      py: { code: 'def bump(box):\n    box[0] += 1\n\nn = [4]\nbump(n)\nprint(n[0])', outcome: 'Prints 5: a list stands in for a box', ok: true },
      cpp: { code: 'void bump(int& r) { r = r + 1; }', outcome: 'A reference gives direct access to the int', ok: true },
      text: 'Python changes a caller\'s value only through a mutable object. In C++ you choose: a reference when the value must exist, a pointer when it may be missing.',
    },
    refresher: [
      'A reference never is null and never re-aims. A pointer may be <code>nullptr</code> and may be re-aimed. Both let a function change the caller\'s variable.',
      'Use a reference when the value must exist; use a pointer when "no value" is allowed.',
    ],
    hints: [
      '<code>bumpRef</code> is one line: <code>r = r + 1;</code>.',
      '<code>bumpPtr</code> must check <code>p != nullptr</code> before it writes <code>*p</code>.',
    ],
    inPython: {
      code: 'def bump(box):\n    if box is not None:\n        box[0] += 1\n\nbump(None)\nprint("fine")',
      note: 'A Python function can be handed <code>None</code> and check for it. A pointer parameter works the same way, and a reference cannot.',
    },
    starter: c`#include <iostream>
using namespace std;

// Add 1 to the caller's int.
void bumpRef(int& r) {
}

// Add 1 to the int p points at; do nothing when p is nullptr.
void bumpPtr(int* p) {
}`,
    solution: c`#include <iostream>
using namespace std;

// Add 1 to the caller's int.
void bumpRef(int& r) {
    r = r + 1;
}

// Add 1 to the int p points at; do nothing when p is nullptr.
void bumpPtr(int* p) {
    if (p != nullptr) {
        *p = *p + 1;
    }
}`,
    harness: c`int main() {
    int harness_a = 4, harness_b = 4, harness_c = 0;
    cout << "\n@@TEST 1@@" << endl;
    bumpRef(harness_a);
    cout << harness_a << endl;
    cout << "\n@@TEST 2@@" << endl;
    bumpPtr(&harness_b);
    cout << harness_b << endl;
    cout << "\n@@TEST 3@@" << endl;
    bumpPtr(nullptr);
    cout << "still running" << endl;
    cout << "\n@@TEST 4@@" << endl;
    bumpRef(harness_c);
    bumpPtr(&harness_c);
    cout << harness_c << endl;
    return 0;
}`,
    require: [{ pattern: 'nullptr', message: 'bumpPtr must check for nullptr' }],
    tests: [
      { name: 'bumpRef', input: 'bumpRef(a) with a = 4', expected: '5' },
      { name: 'bumpPtr', input: 'bumpPtr(&b) with b = 4', expected: '5' },
      { name: 'bumpPtr with nullptr', input: 'bumpPtr(nullptr)', expected: 'still running' },
      { name: 'Both on one variable', input: 'bumpRef(c), then bumpPtr(&c)', expected: '2' },
    ],
  },

  // 9. arrays decay to pointers; pointer arithmetic
  {
    id: 'c5-array-decay',
    title: 'Arrays and pointers',
    kind: 'concept',
    task: `Read 5 whole numbers into an array <code>a</code>. Set <code>int* p = a;</code> and print the sum of the numbers by adding <code>*(p + i)</code> for each <code>i</code> from 0 to 4.`,
    introduces: ['pointer-arith'],
    teach: {
      body: [
        `<p>An array is a block of boxes side by side in memory. The name of an array can be used as a pointer to its first element, so <code>int* p = a;</code> is allowed and means the same as <code>int* p = &amp;a[0];</code>. This is called <em>decay</em>: the array "decays" into a plain address, and the information about how long it was is lost.</p>`,
        `<p>Adding to a pointer moves it by whole elements, not bytes. <code>p + 1</code> points at the next int, <code>p + 2</code> at the one after that. So <code>*(p + 2)</code> follows the pointer two elements along, and that is exactly what <code>a[2]</code> means: the compiler treats <code>a[i]</code> as <code>*(a + i)</code>. The brackets are only a friendlier way to write it. The parentheses in <code>*(p + i)</code> matter, because <code>*p + i</code> means "read what p points at, then add i".</p>`,
      ],
      examples: [
        {
          code: c`int a[3] = {10, 20, 30};
int* p = a;                          // the array name decays to the address of a[0]
cout << *p << endl;                  // 10
cout << *(p + 2) << endl;            // 30: two ints along
cout << (p + 1 == &a[1]) << endl;    // 1: the same address as a[1]
cout << (a[2] == *(a + 2)) << endl;  // 1: a[i] is *(a + i)`,
          output: '10\n30\n1\n1',
          caption: 'Pointer arithmetic steps by elements.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'int* p = a;', meaning: 'the array name becomes the address of its first element' },
        { code: 'p + i', meaning: 'the address i elements after p' },
        { code: '*(p + i)', meaning: 'the element i places after p, the same as p[i]' },
      ],
    },
    compare: {
      py: { code: 'a = [10, 20, 30]\nprint(a[2])', outcome: 'Prints 30: indexing a list', ok: true },
      cpp: { code: 'int a[3] = {10, 20, 30};\ncout << *(a + 2) << endl;', outcome: 'Prints 30: a[2] is *(a + 2)', ok: true },
      text: 'Python indexing is a method call on a list object. In C++ <code>a[2]</code> is just "start at the address, move two elements, follow it".',
    },
    refresher: [
      'An array name decays to a pointer to its first element. <code>p + i</code> moves by whole elements, and <code>a[i]</code> means <code>*(a + i)</code>.',
      'Keep the parentheses: <code>*(p + i)</code> follows the moved pointer, while <code>*p + i</code> adds to the value.',
    ],
    hints: [
      'Fill the array with a loop that reads <code>cin &gt;&gt; a[i]</code>, then set up <code>p</code>.',
      'In a second loop, add <code>*(p + i)</code> to a running total, and print the total.',
    ],
    inPython: {
      code: 'a = [1, 2, 3, 4, 5]\ntotal = 0\nfor i in range(5):\n    total += a[i]\nprint(total)',
      note: 'The same loop in Python hides the address step. In C++ you can see it: <code>a[i]</code> is a start address plus <code>i</code> elements.',
    },
    starter: c`#include <iostream>
using namespace std;

int main() {
    int a[5];
    for (int i = 0; i < 5; i++) {
        cin >> a[i];
    }
    // set p to the array and sum the numbers with *(p + i)
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

int main() {
    int a[5];
    for (int i = 0; i < 5; i++) {
        cin >> a[i];
    }
    int* p = a;
    int sum = 0;
    for (int i = 0; i < 5; i++) {
        sum = sum + *(p + i);
    }
    cout << sum << endl;
    return 0;
}`,
    require: [{ pattern: '\\*\\s*\\(\\s*p\\s*\\+', message: 'Add up *(p + i)' }],
    tests: [
      { name: 'Small numbers', stdin: '1 2 3 4 5\n', expected: '15' },
      { name: 'Negative numbers', stdin: '-1 -2 -3 -4 -5\n', expected: '-15' },
      { name: 'Mixed', stdin: '10 0 -4 0 9\n', expected: '15' },
      { name: 'Larger', stdin: '100 200 300 400 500\n', expected: '1500' },
    ],
  },

  // 10. walking a pointer; begin/end pointers; const int*
  {
    id: 'c5-pointer-walk',
    title: 'Walking a pointer along an array',
    kind: 'drill',
    task: `Write <code>sumRange</code>: add up the ints from <code>start</code> up to, but not including, <code>stop</code>. Walk a pointer from <code>start</code> until it equals <code>stop</code>.`,
    introduces: [],
    teach: {
      body: [
        `<p>A pointer can be moved with <code>p++</code>, which means "step to the next element". Two pointers into the same array can be subtracted: <code>stop - start</code> is the number of elements between them, not bytes. A common way to describe a range is a pair of pointers: <em>start</em> points at the first element, and <em>stop</em> points at the position <em>one past the last</em> element. That one-past position is allowed to exist and to be compared, but it must never be read.</p>`,
        `<p>So a walk looks like <code>for (int* q = start; q != stop; q++) { ... *q ... }</code>. Use <code>!=</code>, not <code>&lt;</code>, so the loop ends exactly at <code>stop</code>. If a function only reads the numbers, write <code>const int*</code>, "pointer to a const int": you can read through it, but the compiler refuses a write. That is the pointer version of the <code>const &amp;</code> you met in stage 3. Moving a pointer further than one past the end, or before the start, is undefined behaviour even if you never read it.</p>`,
      ],
      examples: [
        {
          code: c`int a[5] = {2, 4, 6, 8, 10};
int* p = a;
p++;                           // step to the next element
cout << *p << endl;            // 4
int* end = a + 5;              // one past the last element: never read it
cout << (end - p) << endl;     // 4 elements from p up to end
int sum = 0;
for (int* q = a; q != end; q++) {
    sum = sum + *q;
}
cout << sum << endl;           // 30`,
          output: '4\n4\n30',
          caption: 'p++, a pointer difference, and a walk to the end pointer.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'p++', meaning: 'moves the pointer to the next element' },
        { code: 'stop - start', meaning: 'the number of elements between two pointers into one array' },
        { code: 'const int*', meaning: 'a pointer you can read through but not write through' },
      ],
    },
    refresher: [
      'A range is a start pointer and a stop pointer one past the end. Walk with <code>for (const int* p = start; p != stop; p++)</code>.',
      '<code>stop - start</code> counts elements. The one-past pointer may be compared but never read.',
    ],
    hints: [
      'Keep a running <code>total</code> and a loop that starts at <code>start</code> and ends when the pointer equals <code>stop</code>.',
      'Inside the loop add <code>*p</code> to the total, then <code>p++</code> moves on.',
    ],
    inPython: {
      code: 'a = [3, 1, 4, 1, 5]\nprint(sum(a[1:4]))',
      note: 'A Python slice <code>a[1:4]</code> also stops one before its end. A C++ range is a pair of addresses with the same "up to but not including" rule.',
    },
    starter: c`#include <iostream>
using namespace std;

// Sum the ints from start up to, but not including, stop.
int sumRange(const int* start, const int* stop) {
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

// Sum the ints from start up to, but not including, stop.
int sumRange(const int* start, const int* stop) {
    int total = 0;
    for (const int* p = start; p != stop; p++) {
        total = total + *p;
    }
    return total;
}`,
    harness: c`int main() {
    int harness_a[5] = {3, 1, 4, 1, 5};
    cout << "\n@@TEST 1@@" << endl;
    cout << sumRange(harness_a, harness_a + 5) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << sumRange(harness_a + 1, harness_a + 4) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << sumRange(harness_a, harness_a) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << sumRange(harness_a + 4, harness_a + 5) << endl;
    return 0;
}`,
    require: [{ pattern: 'p\\+\\+|\\+\\+\\s*p|p\\s*=\\s*p\\s*\\+\\s*1', message: 'Move the pointer along the array' }],
    tests: [
      { name: 'Whole array', input: 'sumRange(a, a + 5)', expected: '14' },
      { name: 'Middle part', input: 'sumRange(a + 1, a + 4)', expected: '6' },
      { name: 'Empty range', input: 'sumRange(a, a)', expected: '0' },
      { name: 'One element', input: 'sumRange(a + 4, a + 5)', expected: '5' },
    ],
  },

  // 11. predict: reading past the end is UB; pointer difference is defined
  {
    id: 'c5-predict-past-end',
    title: 'Past the end of an array',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    refresher: [
      'Reading or writing outside an array through a pointer is undefined behaviour. Python would raise <code>IndexError</code>; C++ does not check.',
      'Subtracting two pointers into the same array gives the number of elements between them.',
    ],
    rounds: [
      {
        snippet: c`#include <iostream>
using namespace std;

int main() {
    int a[3] = {1, 2, 3};
    int* p = a;
    cout << *(p + 3) << endl;
    return 0;
}`,
        choices: ['0', 'Undefined: anything can happen', '3'],
        answer: 1,
        why: 'a has elements 0, 1 and 2. p + 3 is one past the end, and following it reads a box that is not part of the array. Nothing says what is there, so it is undefined.',
        ub: true,
        output: 'Undefined: anything can happen (read past the end of an array).',
      },
      {
        snippet: c`#include <iostream>
using namespace std;

int main() {
    int a[4] = {5, 6, 7, 8};
    int* p = a + 1;
    int* q = a + 3;
    cout << (q - p) << " " << *q << endl;
    return 0;
}`,
        choices: ['3 8', '2 8', '2 7'],
        answer: 1,
        why: 'p is at index 1 and q at index 3, so q - p is 2 elements. q points at a[3], which holds 8.',
        output: '2 8',
      },
    ],
  },

  // 12. passing arrays with a size
  {
    id: 'c5-array-param',
    title: 'Passing an array with its size',
    kind: 'implement',
    task: `Write <code>doubleAll</code>: given a pointer to the first element of an array and the number of elements, double every element in place.`,
    introduces: [],
    teach: {
      body: [
        `<p>When you pass an array to a function, the array decays: the function receives only a pointer to the first element, not a copy of the array. Two things follow. First, the function works on the <em>caller's own</em> elements, so changes show up in the caller, like a Python list and unlike a plain <code>int</code> argument. Second, the function cannot tell how long the array is, so you pass the length as a second parameter. <code>int* a, int n</code> is the standard pair; <code>int a[]</code> in a parameter list means exactly the same as <code>int* a</code>.</p>`,
        `<p>Inside the function use <code>a[i]</code> for <code>i</code> from 0 to <code>n - 1</code>. Never write <code>sizeof(a) / sizeof(a[0])</code> inside the function: there <code>a</code> is only a pointer, so that is the size of a pointer divided by the size of an int, which is wrong. The size trick only works on a real array in the same scope where it was declared.</p>`,
      ],
      examples: [
        {
          code: c`#include <iostream>
using namespace std;

void zeroOut(int* a, int n) {        // a points at the first element, n is the length
    for (int i = 0; i < n; i++) {
        a[i] = 0;                    // this changes the caller's array
    }
}

int main() {
    int nums[3] = {4, 5, 6};
    zeroOut(nums, 3);                // the name decays to a pointer
    cout << nums[0] << nums[1] << nums[2] << endl;
    return 0;
}`,
          output: '000',
          caption: 'The function changed the caller\'s array.',
        },
      ],
      terms: [
        { code: 'int* a, int n', meaning: 'how an array is passed: first-element pointer plus length' },
        { code: 'a[i]', meaning: 'works on a pointer parameter just as on an array' },
      ],
    },
    refresher: [
      'An array argument arrives as a pointer to its first element: the function edits the caller\'s array. Pass the length separately.',
      'Never use <code>sizeof</code> on a pointer parameter to find the length.',
    ],
    hints: [
      'Loop with <code>i</code> from 0 while <code>i &lt; n</code>.',
      'Replace <code>a[i]</code> with <code>a[i] * 2</code>.',
    ],
    inPython: {
      code: 'def double_all(a):\n    for i in range(len(a)):\n        a[i] *= 2\n\nnums = [1, 2, 3]\ndouble_all(nums)\nprint(nums)',
      note: 'A Python list knows its own length and is changed in place. A C++ array does not, so the length travels as a second argument.',
    },
    starter: c`#include <iostream>
using namespace std;

// Double each of the n elements that a points at.
void doubleAll(int* a, int n) {
}`,
    solution: c`#include <iostream>
using namespace std;

// Double each of the n elements that a points at.
void doubleAll(int* a, int n) {
    for (int i = 0; i < n; i++) {
        a[i] = a[i] * 2;
    }
}`,
    harness: c`void harness_print(const int* a, int n) {
    for (int i = 0; i < n; i++) {
        cout << a[i] << (i + 1 < n ? " " : "");
    }
    cout << endl;
}

int main() {
    int harness_a[4] = {1, 2, 3, 4};
    int harness_b[3] = {1, 2, 3};
    int harness_c[1] = {5};
    int harness_d[3] = {-1, 0, 7};
    cout << "\n@@TEST 1@@" << endl;
    doubleAll(harness_a, 4);
    harness_print(harness_a, 4);
    cout << "\n@@TEST 2@@" << endl;
    doubleAll(harness_b, 2);
    harness_print(harness_b, 3);
    cout << "\n@@TEST 3@@" << endl;
    doubleAll(harness_c, 0);
    harness_print(harness_c, 1);
    cout << "\n@@TEST 4@@" << endl;
    doubleAll(harness_d, 3);
    harness_print(harness_d, 3);
    return 0;
}`,
    tests: [
      { name: 'Four elements', input: 'doubleAll({1, 2, 3, 4}, 4)', expected: '2 4 6 8' },
      { name: 'Only the first n', input: 'doubleAll({1, 2, 3}, 2)', expected: '2 4 3' },
      { name: 'Empty count', input: 'doubleAll({5}, 0)', expected: '5' },
      { name: 'Negatives and zero', input: 'doubleAll({-1, 0, 7}, 3)', expected: '-2 0 14' },
    ],
  },

  // 13. bugfix: sizeof on a pointer parameter
  {
    id: 'c5-fix-sizeof-param',
    title: 'The wrong length',
    kind: 'bugfix',
    task: `<code>countEvens</code> should count the even numbers among the first <code>n</code> elements, but it works out the length with <code>sizeof</code> and gets it wrong. Fix it.`,
    introduces: [],
    refresher: [
      'Inside a function, a pointer parameter is only an address. <code>sizeof(a)</code> is the size of that address, not of the array.',
      'The length is the parameter <code>n</code> the caller passed.',
    ],
    hints: [
      'What does <code>sizeof(a)</code> measure when <code>a</code> is a <code>const int*</code>?',
      'Delete the <code>sizeof</code> line and loop up to <code>n</code> instead.',
    ],
    inPython: {
      code: 'def count_evens(a):\n    return len([x for x in a if x % 2 == 0])\n\nprint(count_evens([2, 4, 5]))',
      note: 'Python\'s <code>len</code> always knows the length. In C++ the length must be passed by hand, and <code>sizeof</code> on a pointer parameter silently gives the wrong number.',
    },
    starter: c`#include <iostream>
using namespace std;

// Count the even numbers among the first n elements of a.
int countEvens(const int* a, int n) {
    int total = sizeof(a) / sizeof(a[0]);
    int evens = 0;
    for (int i = 0; i < total; i++) {
        if (a[i] % 2 == 0) {
            evens = evens + 1;
        }
    }
    return evens;
}`,
    solution: c`#include <iostream>
using namespace std;

// Count the even numbers among the first n elements of a.
int countEvens(const int* a, int n) {
    int evens = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] % 2 == 0) {
            evens = evens + 1;
        }
    }
    return evens;
}`,
    forbidden: [{ pattern: 'sizeof', message: 'Do not use sizeof on a pointer parameter' }],
    harness: c`int main() {
    int harness_a[6] = {2, 4, 6, 8, 10, 12};
    int harness_b[3] = {1, 3, 5};
    int harness_c[4] = {2, 4, 5, 6};
    cout << "\n@@TEST 1@@" << endl;
    cout << countEvens(harness_a, 6) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << countEvens(harness_b, 3) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << countEvens(harness_c, 2) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << countEvens(harness_c, 0) << endl;
    return 0;
}`,
    tests: [
      { name: 'All even', input: 'countEvens({2, 4, 6, 8, 10, 12}, 6)', expected: '6' },
      { name: 'None even', input: 'countEvens({1, 3, 5}, 3)', expected: '0' },
      { name: 'Only the first two count', input: 'countEvens({2, 4, 5, 6}, 2)', expected: '2' },
      { name: 'Count zero', input: 'countEvens({2, 4, 5, 6}, 0)', expected: '0' },
    ],
  },
]
