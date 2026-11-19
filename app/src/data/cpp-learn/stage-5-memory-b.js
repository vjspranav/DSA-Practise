// C++ Learn lessons: stage 5 (part 2), memory and pointers: the heap, leaks, dangling pointers, smart pointers,
// structs and ->, and the practice lessons. Part 1 is stage-5-memory-a.js; stage-5-memory.js joins the two.
// Contract: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md. Check: node scripts/verify-cpp-learn.mjs --stage 5
// Use-after-free and double delete are taught in `ub: true` predict rounds (the sanitizer build proves them). A
// returned pointer to a local and a delete / delete[] mismatch are shown only in `compare` with ok:false and an
// outcome that says "Undefined"; the sanitizers cannot see them here. Leaks are taught in prose: the checker's
// sanitizer run has leak detection off, so the leak lesson requires the matching delete[] instead.
// C++ code is written with String.raw so a C++ "\n" stays a backslash-n.
const c = String.raw

export const LESSONS = [
  // 14. the stack and the heap, new and delete
  {
    id: 'c5-new-delete',
    title: 'The heap: new and delete',
    kind: 'concept',
    task: `Read a whole number. Make a heap int with <code>new</code> that holds its square, print it, then give it back with <code>delete</code>.`,
    introduces: ['new', 'delete'],
    teach: {
      body: [
        `<p>Memory comes in two main kinds. An ordinary local variable lives on the <em>stack</em>: it is created when its block starts and vanishes at the closing brace, automatically. The <em>heap</em> is memory you ask for yourself and keep for as long as you like. In Python every object lives on a heap-like store and the garbage collector frees it when nothing refers to it any more. C++ has no garbage collector: you ask for heap memory with <code>new</code> and you must give it back with <code>delete</code>.</p>`,
        `<p><code>new int(5)</code> makes an int on the heap holding 5 and gives back a pointer to it, so you store it in an <code>int*</code>. You follow it with <code>*p</code> as usual. <code>delete p;</code> hands the memory back. The rules are strict: every <code>new</code> needs exactly one <code>delete</code>, and after <code>delete</code> the pointer is <em>dangling</em>: it still holds the old address, but the memory is no longer yours, so you must not use it. The next lessons show what goes wrong, and the habit that prevents it is to set the pointer to <code>nullptr</code> straight after the delete.</p>`,
      ],
      examples: [
        {
          code: c`int* p = new int(5);     // a heap int holding 5; p points at it
cout << *p << endl;      // 5
*p = *p * 2;             // use it like any int, through the pointer
cout << *p << endl;      // 10
delete p;                // give the memory back
p = nullptr;             // p no longer points at memory we own`,
          output: '5\n10',
          caption: 'One new, one delete.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'new int(5)', meaning: 'makes an int on the heap holding 5 and returns a pointer to it' },
        { code: 'delete p;', meaning: 'gives the heap memory back; p must not be used afterwards' },
        { code: 'stack / heap', meaning: 'stack: automatic locals; heap: memory you own until you delete it' },
      ],
    },
    compare: {
      py: { code: 'n = 5\nprint(n * 2)', outcome: 'Prints 10; memory is freed automatically', ok: true },
      cpp: { code: 'int* p = new int(5);\ncout << *p * 2 << endl;\ndelete p;', outcome: 'Prints 10; delete frees the heap int', ok: true },
      text: 'Python frees objects for you when nothing refers to them. In C++ memory from <code>new</code> stays until you <code>delete</code> it.',
    },
    refresher: [
      '<code>int* p = new int(5);</code> makes a heap int; <code>delete p;</code> gives it back. Every <code>new</code> needs exactly one <code>delete</code>.',
      'After <code>delete</code>, set the pointer to <code>nullptr</code>: the old address is dangling and must not be used.',
    ],
    hints: [
      'Read the number into an ordinary <code>int</code> first, then make the heap int with <code>new int(n * n)</code>.',
      'Print <code>*p</code>, then <code>delete p;</code>.',
    ],
    inPython: {
      code: 'n = 5\nsquare = n * n\nprint(square)',
      note: 'Python decides where the number lives and cleans up afterwards. C++ lets you choose heap memory and makes you release it.',
    },
    starter: c`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // make a heap int holding n * n, print it, then delete it
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int* p = new int(n * n);
    cout << *p << endl;
    delete p;
    p = nullptr;
    return 0;
}`,
    require: [{ pattern: 'new\\s+int', message: 'Make the int with new' }, { pattern: 'delete\\s+\\w+\\s*;', message: 'Release it with delete' }],
    tests: [
      { name: 'Five', stdin: '5\n', expected: '25' },
      { name: 'Negative', stdin: '-4\n', expected: '16' },
      { name: 'Zero', stdin: '0\n', expected: '0' },
      { name: 'Twelve', stdin: '12\n', expected: '144' },
    ],
  },

  // 15. new[] and delete[]; mismatch
  {
    id: 'c5-new-array',
    title: 'Arrays on the heap',
    kind: 'concept',
    task: `Read <code>n</code>, then <code>n</code> whole numbers. Store them in an array from <code>new int[n]</code>, print them in reverse order, one per line, then release the array with <code>delete[]</code>.`,
    introduces: [],
    teach: {
      body: [
        `<p>A plain array like <code>int a[5]</code> needs its size written into the code. When the size is only known while the program runs, for example after reading <code>n</code>, ask the heap: <code>int* a = new int[n];</code> makes <code>n</code> ints side by side and returns a pointer to the first. It works with <code>a[i]</code> just like an array. Its elements start with no defined value, as an uninitialised local does, so fill them before you read them.</p>`,
        `<p>Give it back with <code>delete[] a;</code>, with the square brackets. The two forms must match: memory from <code>new</code> goes back with <code>delete</code>, and memory from <code>new[]</code> goes back with <code>delete[]</code>. Using the wrong one is undefined behaviour: it may seem to work, corrupt memory or crash, and the compiler will not warn you. Python's <code>[0] * n</code> builds a list of any size and frees it for you; this is the manual version.</p>`,
      ],
      examples: [
        {
          code: c`int n = 4;
int* a = new int[n];              // n ints on the heap; n is a variable, not a constant
for (int i = 0; i < n; i++) {
    a[i] = i * i;                 // fill every element before reading
}
cout << a[3] << endl;             // 9
delete[] a;                       // new[] pairs with delete[]`,
          output: '9',
          caption: 'A heap array whose size is chosen at run time.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'new int[n]', meaning: 'n ints on the heap; returns a pointer to the first' },
        { code: 'delete[] a;', meaning: 'releases an array from new[]; plain delete here is undefined' },
      ],
    },
    compare: {
      py: { code: 'a = [0] * 3\nprint(len(a))', outcome: 'Prints 3; freed automatically', ok: true },
      cpp: { code: 'int* a = new int[3];\ndelete a;', outcome: 'Undefined: new[] must pair with delete[]', ok: false },
      text: 'Python never asks which kind of free to use. In C++ <code>new[]</code> must be paired with <code>delete[]</code>; mixing them is undefined behaviour.',
    },
    refresher: [
      '<code>new int[n]</code> makes n ints; free them with <code>delete[] a;</code>. Plain <code>delete</code> on an array, or <code>delete[]</code> on a single int, is undefined.',
      'The new elements hold no defined value: write before you read.',
    ],
    hints: [
      'Read <code>n</code>, make the array, then read the numbers with a loop that fills <code>a[i]</code>.',
      'Print with a loop that counts down from <code>n - 1</code> to 0, then <code>delete[] a;</code>.',
    ],
    inPython: {
      code: 'n = 3\na = [int(x) for x in "1 2 3".split()]\nfor i in range(n - 1, -1, -1):\n    print(a[i])',
      note: 'A Python list is sized and freed for you. A C++ array on the heap is sized by you and must be freed by you.',
    },
    starter: c`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // make a heap array of n ints, read n numbers, print them in reverse, free the array
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int* a = new int[n];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    for (int i = n - 1; i >= 0; i--) {
        cout << a[i] << endl;
    }
    delete[] a;
    return 0;
}`,
    require: [{ pattern: 'new\\s+int\\s*\\[', message: 'Make the array with new int[n]' }, { pattern: 'delete\\s*\\[\\s*\\]', message: 'Release it with delete[]' }],
    tests: [
      { name: 'Three numbers', stdin: '3\n1 2 3\n', expected: '3\n2\n1' },
      { name: 'One number', stdin: '1\n7\n', expected: '7' },
      { name: 'Five numbers', stdin: '5\n10 20 30 40 50\n', expected: '50\n40\n30\n20\n10' },
      { name: 'Negatives', stdin: '2\n-1 -2\n', expected: '-2\n-1' },
    ],
  },

  // 16. leaks: bugfix, checked by require
  {
    id: 'c5-leak',
    title: 'The leak',
    kind: 'bugfix',
    task: `<code>sumOfSquares</code> gets the right answers but never frees the array it made, so every call leaks memory. Add the missing release. The tests cannot see a leak, so this lesson checks for the matching <code>delete[]</code>.`,
    introduces: [],
    teach: {
      body: [
        `<p>A <em>leak</em> is heap memory you can no longer reach and never gave back. The program still prints correct answers, which is what makes leaks sneaky. But each leak keeps a piece of memory for as long as the program runs, so a program that leaks inside a loop, or in a function called a million times, grows until the machine runs out. Python programs rarely have this problem because the garbage collector frees unreachable objects.</p>`,
        `<p>There are two common ways to leak. One is forgetting the <code>delete</code> on some path, for example an early <code>return</code> before it. The other is overwriting the only pointer to a block: after <code>p = new int(2);</code> the first heap int has no pointer left, so nobody can ever free it. The rule that prevents both: whoever calls <code>new</code> decides, at that moment, where the matching <code>delete</code> will be. (The next lessons show how <code>unique_ptr</code> removes the need.) Tools such as Valgrind and LeakSanitizer find leaks by reporting every block that was still allocated when the program ended.</p>`,
      ],
      examples: [
        {
          code: c`int* p = new int(1);
p = new int(2);          // the pointer to the first int is gone: that int is leaked
cout << *p << endl;      // 2
delete p;                // frees only the second int`,
          output: '2',
          caption: 'Overwriting the only pointer leaks what it pointed at.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'leak', meaning: 'heap memory that is unreachable and never freed' },
        { code: 'delete[] a;', meaning: 'frees an array made with new[]' },
      ],
    },
    refresher: [
      'A leak is heap memory that is never freed. The answers stay correct, but memory use grows.',
      'Every <code>new[]</code> needs a <code>delete[]</code> on every path out of the function, before the <code>return</code>.',
    ],
    hints: [
      'Find the line with <code>new int[n]</code>. Something must give that block back.',
      'Add <code>delete[] a;</code> after the last use of <code>a</code> and before the <code>return</code>.',
    ],
    inPython: {
      code: 'def sum_of_squares(n):\n    a = [(i + 1) * (i + 1) for i in range(n)]\n    return sum(a)\n\nprint(sum_of_squares(3))',
      note: 'Here the list is freed automatically when the function returns. The C++ array needs an explicit <code>delete[]</code>.',
    },
    starter: c`#include <iostream>
using namespace std;

// Return 1*1 + 2*2 + ... + n*n, using a temporary heap array.
int sumOfSquares(int n) {
    int* a = new int[n];
    for (int i = 0; i < n; i++) {
        a[i] = (i + 1) * (i + 1);
    }
    int total = 0;
    for (int i = 0; i < n; i++) {
        total = total + a[i];
    }
    return total;
}`,
    solution: c`#include <iostream>
using namespace std;

// Return 1*1 + 2*2 + ... + n*n, using a temporary heap array.
int sumOfSquares(int n) {
    int* a = new int[n];
    for (int i = 0; i < n; i++) {
        a[i] = (i + 1) * (i + 1);
    }
    int total = 0;
    for (int i = 0; i < n; i++) {
        total = total + a[i];
    }
    delete[] a;
    return total;
}`,
    require: [{ pattern: 'delete\\s*\\[\\s*\\]\\s*a\\s*;', message: 'Free the array with delete[] a;' }],
    harness: c`int main() {
    cout << "\n@@TEST 1@@" << endl;
    cout << sumOfSquares(3) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << sumOfSquares(1) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << sumOfSquares(0) << endl;
    cout << "\n@@TEST 4@@" << endl;
    cout << sumOfSquares(10) << endl;
    return 0;
}`,
    tests: [
      { name: 'Three', input: 'sumOfSquares(3)', expected: '14' },
      { name: 'One', input: 'sumOfSquares(1)', expected: '1' },
      { name: 'Zero', input: 'sumOfSquares(0)', expected: '0' },
      { name: 'Ten', input: 'sumOfSquares(10)', expected: '385' },
    ],
  },

  // 17. predict: use after free, a defined safe habit
  {
    id: 'c5-predict-use-after-free',
    title: 'Using memory after delete',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then compare with the explanation.',
    introduces: [],
    teach: {
      body: [
        `<p>After <code>delete p;</code> the pointer <code>p</code> still holds the old address. That is a <em>dangling pointer</em>: it points at memory that is no longer yours. Reading or writing through it is a <em>use-after-free</em>, and it is undefined behaviour. It may print the old value, print garbage, crash, or quietly corrupt another object that now lives there. Deleting the same block twice (a <em>double delete</em>) is undefined too.</p>`,
        `<p>The fix is a habit, not a tool: set the pointer to <code>nullptr</code> right after <code>delete</code>. Deleting a null pointer is safe and does nothing, and a null check then catches any later use. This course never shows the output of a use-after-free, because there is none to learn: the honest answer is "undefined".</p>`,
      ],
      examples: [
        {
          code: c`int* p = new int(3);
delete p;
p = nullptr;                       // the habit: no dangling pointer is left
if (p == nullptr) {
    cout << "p is empty" << endl;
}
delete p;                          // deleting nullptr is allowed and does nothing`,
          output: 'p is empty',
          caption: 'Setting p to nullptr after delete.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'dangling pointer', meaning: 'a pointer to memory that has been freed or has gone out of scope' },
        { code: 'p = nullptr;', meaning: 'the habit after delete: no stale address is left in p' },
      ],
    },
    refresher: [
      'After <code>delete</code> the pointer dangles. Using it, or deleting twice, is undefined behaviour.',
      'Set the pointer to <code>nullptr</code> after <code>delete</code>; deleting a null pointer is safe.',
    ],
    rounds: [
      {
        snippet: c`#include <iostream>
using namespace std;

int main() {
    int* p = new int(7);
    delete p;
    cout << *p << endl;
    return 0;
}`,
        choices: ['7', 'Undefined: anything can happen', '0'],
        answer: 1,
        why: 'The int was given back at delete, so *p reads memory that no longer belongs to the program. It might still show 7 today, but nothing guarantees it. That is a use-after-free.',
        ub: true,
        output: 'Undefined: anything can happen (use after delete).',
      },
      {
        snippet: c`#include <iostream>
using namespace std;

int main() {
    int* p = new int(3);
    delete p;
    p = nullptr;
    delete p;
    cout << "safe" << endl;
    return 0;
}`,
        choices: ['safe', 'Undefined: anything can happen', 'A compile error'],
        answer: 0,
        why: 'After the first delete, p was set to nullptr. Deleting a null pointer is defined and does nothing, so the program reaches the print. Without that line it would be a double delete.',
        output: 'safe',
      },
    ],
  },

  // 18. returning a pointer to a local
  {
    id: 'c5-dangling-local',
    title: 'Returning a pointer',
    kind: 'concept',
    task: `Write <code>makeNumber</code>: return a pointer to a new heap int holding <code>v</code>. The caller will <code>delete</code> it.`,
    introduces: [],
    teach: {
      body: [
        `<p>A local variable lives on the stack and disappears at the closing brace of its function. A pointer to it does not disappear, so a function that returns <code>&amp;x</code> of one of its own locals hands the caller a <em>dangling pointer</em>: it points at a stack box that has already been reused. Using it is undefined behaviour. In Python this cannot happen, because returning an object keeps it alive.</p>`,
        `<p>There are two safe ways. Usually you simply return the <em>value</em> (<code>return x;</code>), and the caller gets a copy; that is the right choice for an int. If the caller really needs a pointer, the data must outlive the function, so make it on the heap with <code>new</code>. The caller then owns it and must <code>delete</code> it. A function that returns a pointer from <code>new</code> should say so in a comment, because nothing in the type tells the caller.</p>`,
      ],
      examples: [
        {
          code: c`#include <iostream>
using namespace std;

int* makeFive() {
    int* p = new int(5);     // on the heap, so it survives the return
    return p;                // the caller now owns it
}

int main() {
    int* n = makeFive();
    cout << *n << endl;
    delete n;                // the caller frees it
    return 0;
}`,
          output: '5',
          caption: 'Heap memory outlives the function that made it.',
        },
      ],
      terms: [
        { code: 'return &x;', meaning: 'on a local x, hands out a dangling pointer: undefined behaviour when used' },
        { code: 'return new int(v);', meaning: 'safe: the heap int outlives the call; the caller must delete it' },
      ],
    },
    compare: {
      py: { code: 'def good():\n    x = 5\n    return x\n\nprint(good())', outcome: 'Prints 5: returning keeps the object alive', ok: true },
      cpp: { code: 'int* bad() {\n    int x = 5;\n    return &x;\n}', outcome: 'Undefined: x is gone when bad() returns', ok: false },
      text: 'A Python object lives as long as something refers to it. A C++ local dies at the closing brace, so a pointer to it must never be returned.',
    },
    refresher: [
      'Never return a pointer to a local variable: the variable dies at the closing brace and the pointer dangles.',
      'Return by value, or put the data on the heap with <code>new</code> and let the caller <code>delete</code> it.',
    ],
    hints: [
      'Make the heap int with <code>new int(v)</code> and return that pointer.',
      'Do not <code>delete</code> it inside the function; the caller does that.',
    ],
    inPython: {
      code: 'def make_number(v):\n    return [v]\n\nbox = make_number(7)\nprint(box[0])',
      note: 'Python returns a live object whose lifetime it manages. In C++ you decide the lifetime: heap memory lasts until someone deletes it.',
    },
    starter: c`#include <iostream>
using namespace std;

// Return a pointer to a new heap int holding v. The caller deletes it.
int* makeNumber(int v) {
    return nullptr;
}`,
    solution: c`#include <iostream>
using namespace std;

// Return a pointer to a new heap int holding v. The caller deletes it.
int* makeNumber(int v) {
    int* p = new int(v);
    return p;
}`,
    require: [{ pattern: 'new\\s+int', message: 'Make the int with new' }],
    harness: c`int main() {
    cout << "\n@@TEST 1@@" << endl;
    int* harness_p = makeNumber(7);
    cout << *harness_p << endl;
    delete harness_p;
    cout << "\n@@TEST 2@@" << endl;
    int* harness_q = makeNumber(-3);
    cout << *harness_q << endl;
    delete harness_q;
    cout << "\n@@TEST 3@@" << endl;
    int* harness_r = makeNumber(0);
    cout << *harness_r << endl;
    delete harness_r;
    cout << "\n@@TEST 4@@" << endl;
    int* harness_a = makeNumber(1);
    int* harness_b = makeNumber(2);
    cout << *harness_a << " " << *harness_b << endl;
    delete harness_a;
    delete harness_b;
    return 0;
}`,
    tests: [
      { name: 'Seven', input: 'makeNumber(7)', expected: '7' },
      { name: 'Negative', input: 'makeNumber(-3)', expected: '-3' },
      { name: 'Zero', input: 'makeNumber(0)', expected: '0' },
      { name: 'Two calls stay separate', input: 'makeNumber(1) and makeNumber(2)', expected: '1 2' },
    ],
  },

  // 19. unique_ptr and RAII
  {
    id: 'c5-unique-ptr',
    title: 'unique_ptr: memory that frees itself',
    kind: 'concept',
    task: `Read <code>n</code>, then <code>n</code> whole numbers into a <code>make_unique&lt;int[]&gt;(n)</code> array, and print their sum. Do not use <code>new</code> or <code>delete</code>.`,
    introduces: ['include-memory', 'unique-ptr'],
    teach: {
      body: [
        `<p>Manual <code>new</code> and <code>delete</code> are easy to get wrong, so modern C++ avoids them. The idea behind the fix is called <em>RAII</em> (Resource Acquisition Is Initialisation, a clumsy name for a simple rule): tie the life of a resource to a variable. When the variable goes out of scope, at its closing brace, the resource is released automatically, on every path out of the block.</p>`,
        `<p>For heap memory the tool is <code>unique_ptr</code>, from <code>#include &lt;memory&gt;</code>. <code>unique_ptr&lt;int&gt; p = make_unique&lt;int&gt;(5);</code> makes a heap int holding 5 and an object <code>p</code> that <em>owns</em> it. You use it like a pointer (<code>*p</code>), and when <code>p</code> goes out of scope the int is deleted for you. For arrays, <code>unique_ptr&lt;int[]&gt; a = make_unique&lt;int[]&gt;(n);</code> gives you <code>n</code> ints, all starting at 0, that you index with <code>a[i]</code>, and it uses the right <code>delete[]</code> itself.</p>`,
        `<p>"Unique" means exactly one owner: you cannot copy a <code>unique_ptr</code>, because two owners would delete the same memory twice. So there is nothing to forget, nothing to double-delete, and nothing to leak. This is the default way to own heap memory in modern C++; use a raw pointer only to <em>look at</em> memory that someone else owns.</p>`,
      ],
      examples: [
        {
          code: c`unique_ptr<int> p = make_unique<int>(5);   // owns a heap int holding 5
cout << *p << endl;                         // 5: used like a pointer
*p = *p + 1;
cout << *p << endl;                         // 6
// no delete: p frees the int when it goes out of scope`,
          output: '5\n6',
          caption: 'A unique_ptr to one int.',
          wrap: true,
        },
        {
          code: c`int n = 3;
unique_ptr<int[]> a = make_unique<int[]>(n);   // n ints, all 0
a[1] = 40;                                     // index it like an array
cout << a[0] << " " << a[1] << " " << a[2] << endl;`,
          output: '0 40 0',
          caption: 'An array version; the right delete[] is automatic.',
          wrap: true,
        },
      ],
      terms: [
        { code: 'unique_ptr<int>', meaning: 'an owner of one heap int; frees it at the end of its scope' },
        { code: 'make_unique<int>(5)', meaning: 'makes the heap int holding 5 and the owner in one step' },
        { code: 'RAII', meaning: 'the resource lives exactly as long as the variable that owns it' },
      ],
    },
    compare: {
      py: { code: 'a = [0] * 3\na[1] = 40\nprint(a)', outcome: 'Prints [0, 40, 0]; freed automatically', ok: true },
      cpp: { code: 'unique_ptr<int[]> a = make_unique<int[]>(3);\na[1] = 40;', outcome: 'Same idea: freed automatically at scope end', ok: true },
      text: 'Python frees objects with a garbage collector at some later time. C++ with <code>unique_ptr</code> frees the memory at a fixed moment: the closing brace of the owner.',
    },
    refresher: [
      '<code>unique_ptr&lt;int[]&gt; a = make_unique&lt;int[]&gt;(n);</code> owns n ints and frees them itself. It needs <code>#include &lt;memory&gt;</code>.',
      'There is exactly one owner, so a <code>unique_ptr</code> cannot be copied. No <code>delete</code> is ever written.',
    ],
    hints: [
      'Include <code>&lt;memory&gt;</code>, read <code>n</code>, then make the array with <code>make_unique</code>.',
      'Read each number into <code>a[i]</code> in a loop, add it to a total, and print the total.',
    ],
    inPython: {
      code: 'n = 3\na = [0] * n\nfor i, x in enumerate([4, 5, 6]):\n    a[i] = x\nprint(sum(a))',
      note: 'A Python list manages its own memory. <code>unique_ptr</code> gives C++ the same comfort for a heap array, while still letting you say where the memory lives.',
    },
    starter: c`#include <iostream>
#include <memory>
using namespace std;

int main() {
    int n;
    cin >> n;
    // make a unique_ptr<int[]> of n ints, read n numbers into it, print the sum
    return 0;
}`,
    solution: c`#include <iostream>
#include <memory>
using namespace std;

int main() {
    int n;
    cin >> n;
    unique_ptr<int[]> a = make_unique<int[]>(n);
    int sum = 0;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        sum = sum + a[i];
    }
    cout << sum << endl;
    return 0;
}`,
    require: [{ pattern: 'make_unique\\s*<\\s*int\\s*\\[\\s*\\]\\s*>', message: 'Use make_unique<int[]>(n)' }],
    forbidden: [{ pattern: '\\bnew\\b|\\bdelete\\b', message: 'No manual new or delete: let unique_ptr own the memory' }],
    tests: [
      { name: 'Three numbers', stdin: '3\n1 2 3\n', expected: '6' },
      { name: 'One number', stdin: '1\n42\n', expected: '42' },
      { name: 'Negatives', stdin: '4\n-1 -2 -3 -4\n', expected: '-10' },
      { name: 'Larger', stdin: '5\n100 200 300 400 500\n', expected: '1500' },
    ],
  },

  // 20. fix: a unique_ptr cannot be copied
  {
    id: 'c5-fix-unique-copy',
    title: 'One owner only',
    kind: 'fix',
    task: `This does not compile. Fix it so it prints <em>8</em> and then <em>9</em>, without giving up the <code>unique_ptr</code>.`,
    errorMatch: 'copy constructor',
    gloss: 'A <code>unique_ptr</code> has exactly one owner, so passing it by value would need a second owner, which the compiler forbids. Pass a reference to it instead.',
    introduces: [],
    refresher: [
      'A <code>unique_ptr</code> cannot be copied: there is only ever one owner.',
      'To let a function look at it, pass a reference: <code>const unique_ptr&lt;int&gt;&amp; p</code>.',
    ],
    hints: [
      'The error talks about a copy constructor: something is being copied. Look at how <code>show</code> takes its parameter.',
      'Take the parameter by <code>const</code> reference, like a big read-only value in stage 3.',
    ],
    inPython: {
      code: 'n = [8]\n\ndef show(box):\n    print(box[0])\n\nshow(n)\nn[0] += 1\nprint(n[0])',
      note: 'Passing an object in Python shares one object between both names. A <code>unique_ptr</code> refuses to be shared, so pass it by reference.',
    },
    starter: c`#include <iostream>
#include <memory>
using namespace std;

void show(unique_ptr<int> p) {
    cout << *p << endl;
}

int main() {
    unique_ptr<int> n = make_unique<int>(8);
    show(n);
    *n = *n + 1;
    cout << *n << endl;
    return 0;
}`,
    solution: c`#include <iostream>
#include <memory>
using namespace std;

void show(const unique_ptr<int>& p) {
    cout << *p << endl;
}

int main() {
    unique_ptr<int> n = make_unique<int>(8);
    show(n);
    *n = *n + 1;
    cout << *n << endl;
    return 0;
}`,
    require: [{ pattern: 'unique_ptr\\s*<\\s*int\\s*>', message: 'Keep using unique_ptr<int>' }],
    tests: [{ name: 'Prints 8 then 9', stdin: '', expected: '8\n9' }],
  },

  // 21. struct, field access, arrow
  {
    id: 'c5-struct-arrow',
    title: 'A first struct, and ->',
    kind: 'concept',
    task: `Read <code>x</code> and <code>y</code> into the <code>Point</code> called <code>pt</code>. Through the pointer <code>p</code>, double both fields, then print them as <em>x y</em>.`,
    introduces: ['struct', 'field-access', 'arrow'],
    teach: {
      body: [
        `<p>So far a variable holds one value. A <code>struct</code> bundles several named values into one new type, the way a tiny Python class with only attributes does. <code>struct Point { int x; int y; };</code> defines a type <code>Point</code> with two <em>fields</em>, <code>x</code> and <code>y</code>. Note the semicolon after the closing brace. (A full introduction to structs and classes is the next stage; this is only enough to use them with pointers.)</p>`,
        `<p>Make one with <code>Point a = {3, 4};</code>, which fills the fields in order. Reach a field with a dot: <code>a.x</code>. Now take a pointer to the whole struct: <code>Point* p = &amp;a;</code>. To reach a field through a pointer you could write <code>(*p).x</code>: follow the pointer, then take the field. That is clumsy, so C++ has an arrow: <code>p-&gt;x</code> means exactly <code>(*p).x</code>. Rule of thumb: a dot when you have the struct itself, an arrow when you have a pointer to it.</p>`,
      ],
      examples: [
        {
          code: c`#include <iostream>
using namespace std;

struct Point {          // a new type that bundles two ints
    int x;
    int y;
};                      // note the semicolon

int main() {
    Point a = {3, 4};            // fill the fields in order
    cout << a.x << " " << a.y << endl;   // a dot: we have the struct itself
    a.x = 10;
    Point* p = &a;               // a pointer to the whole struct
    cout << p->x << endl;        // an arrow: we have a pointer; 10
    p->y = 7;                    // write through the pointer
    cout << (*p).y << endl;      // the long way to write p->y; 7
    cout << a.y << endl;         // 7: a itself changed
    return 0;
}`,
          output: '3 4\n10\n7\n7',
          caption: 'A dot on a struct, an arrow on a pointer to one.',
        },
      ],
      terms: [
        { code: 'struct Point { int x; int y; };', meaning: 'a type with two named fields; the semicolon is required' },
        { code: 'a.x', meaning: 'the field x of the struct a' },
        { code: 'p->x', meaning: 'the field x of the struct p points at; same as (*p).x' },
      ],
    },
    compare: {
      py: { code: 'class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\na = Point(3, 4)\nq = a\nq.x = 9\nprint(a.x)', outcome: 'Prints 9: q and a are one object', ok: true },
      cpp: { code: 'struct Point { int x; int y; };\nPoint a = {3, 4};\nPoint* q = &a;\nq->x = 9;\ncout << a.x << endl;', outcome: 'Prints 9: q points at a', ok: true },
      text: 'In Python every name is already a reference, so <code>q.x</code> always reaches the shared object. In C++ you choose: <code>a.x</code> on the struct, <code>q-&gt;x</code> through a pointer.',
    },
    refresher: [
      '<code>struct Point { int x; int y; };</code> defines a type. A struct variable uses a dot: <code>a.x</code>. A pointer to a struct uses an arrow: <code>p-&gt;x</code>.',
      '<code>p-&gt;x</code> is shorthand for <code>(*p).x</code>.',
    ],
    hints: [
      'Set <code>p = &amp;pt;</code> first. Then <code>p-&gt;x</code> is the same field as <code>pt.x</code>.',
      'Write <code>p-&gt;x = p-&gt;x * 2;</code> and the same for <code>y</code>. Print with <code>pt.x</code> and <code>pt.y</code>.',
    ],
    inPython: {
      code: 'class Point:\n    pass\n\npt = Point()\npt.x, pt.y = 3, 4\np = pt\np.x *= 2\np.y *= 2\nprint(pt.x, pt.y)',
      note: 'Python attributes are always reached with a dot, because every name already refers to the object. C++ distinguishes the struct (a dot) from a pointer to it (an arrow).',
    },
    starter: c`#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

int main() {
    Point pt;
    cin >> pt.x >> pt.y;
    // make a pointer p to pt, double both fields through it, print them
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

int main() {
    Point pt;
    cin >> pt.x >> pt.y;
    Point* p = &pt;
    p->x = p->x * 2;
    p->y = p->y * 2;
    cout << pt.x << " " << pt.y << endl;
    return 0;
}`,
    require: [{ pattern: 'p\\s*->\\s*x\\s*=', message: 'Write through the pointer with ->' }],
    tests: [
      { name: 'Small', stdin: '3 4\n', expected: '6 8' },
      { name: 'Zero and negative', stdin: '-1 0\n', expected: '-2 0' },
      { name: 'Mixed', stdin: '50 -25\n', expected: '100 -50' },
    ],
  },

  // 22. a chain of nodes
  {
    id: 'c5-node-walk',
    title: 'Following a chain of nodes',
    kind: 'implement',
    task: `Write <code>sumList</code>: add up the <code>value</code> of every <code>Node</code>, starting at <code>head</code> and following <code>next</code> until it is <code>nullptr</code>. An empty list (<code>head</code> is <code>nullptr</code>) sums to 0.`,
    introduces: [],
    teach: {
      body: [
        `<p>A struct may hold a pointer to another struct of its own type. <code>struct Node { int value; Node* next; };</code> is one link in a chain: its number, and a pointer to the next link. The last link's <code>next</code> is <code>nullptr</code>, which marks the end. This is a <em>linked list</em>, and the next stages build on it.</p>`,
        `<p>To visit every node, start at the first and keep following <code>next</code>: <code>for (Node* n = head; n != nullptr; n = n-&gt;next) { ... n-&gt;value ... }</code>. The loop stops exactly when the pointer becomes <code>nullptr</code>, so it also works for an empty list. You can build nodes in a variable, <code>Node b = {20, nullptr};</code>, or on the heap, <code>new Node{20, nullptr}</code> (braces right after the type fill the fields). Heap nodes must each be deleted once.</p>`,
      ],
      examples: [
        {
          code: c`#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;          // the next link, or nullptr at the end
};

int main() {
    Node c = {30, nullptr};
    Node b = {20, &c};           // b links to c
    Node a = {10, &b};           // a links to b
    for (Node* n = &a; n != nullptr; n = n->next) {
        cout << n->value << endl;
    }
    return 0;
}`,
          output: '10\n20\n30',
          caption: 'Three nodes linked by next pointers, visited from the first.',
        },
        {
          code: c`#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
};

int main() {
    Node* head = new Node{1, nullptr};   // a heap node
    head->next = new Node{2, nullptr};   // link a second heap node after it
    cout << head->next->value << endl;   // 2: arrows chain
    delete head->next;                   // each heap node is deleted once
    delete head;
    return 0;
}`,
          output: '2',
          caption: 'Heap nodes, and arrows chained.',
        },
      ],
      terms: [
        { code: 'Node* next;', meaning: 'a field that points at another Node' },
        { code: 'n = n->next', meaning: 'moves n along to the next link' },
        { code: 'new Node{1, nullptr}', meaning: 'a heap Node with its fields filled in order' },
      ],
    },
    refresher: [
      'Walk a chain with <code>for (Node* n = head; n != nullptr; n = n-&gt;next)</code>. The last node\'s <code>next</code> is <code>nullptr</code>.',
      'Read a field through the pointer with <code>n-&gt;value</code>.',
    ],
    hints: [
      'Keep a total. Start a pointer at <code>head</code> and loop while it is not <code>nullptr</code>.',
      'Add <code>n-&gt;value</code> to the total, and move on with <code>n = n-&gt;next</code>.',
    ],
    inPython: {
      code: 'class Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\nhead = Node(1, Node(2, Node(3)))\ntotal = 0\nn = head\nwhile n is not None:\n    total += n.value\n    n = n.next\nprint(total)',
      note: 'The same walk in Python, with <code>None</code> where C++ has <code>nullptr</code>. The shape of the loop does not change.',
    },
    starter: c`#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
};

// Sum the values of the chain that starts at head.
int sumList(Node* head) {
    return 0;
}`,
    solution: c`#include <iostream>
using namespace std;

struct Node {
    int value;
    Node* next;
};

// Sum the values of the chain that starts at head.
int sumList(Node* head) {
    int total = 0;
    for (Node* n = head; n != nullptr; n = n->next) {
        total = total + n->value;
    }
    return total;
}`,
    harness: c`int main() {
    Node harness_c = {3, nullptr};
    Node harness_b = {2, &harness_c};
    Node harness_a = {1, &harness_b};
    cout << "\n@@TEST 1@@" << endl;
    cout << sumList(&harness_a) << endl;
    cout << "\n@@TEST 2@@" << endl;
    cout << sumList(&harness_c) << endl;
    cout << "\n@@TEST 3@@" << endl;
    cout << sumList(nullptr) << endl;
    cout << "\n@@TEST 4@@" << endl;
    Node* harness_h = new Node{10, new Node{-4, nullptr}};
    cout << sumList(harness_h) << endl;
    delete harness_h->next;
    delete harness_h;
    return 0;
}`,
    tests: [
      { name: 'Three nodes', input: '1 -> 2 -> 3', expected: '6' },
      { name: 'One node', input: '3', expected: '3' },
      { name: 'Empty list', input: 'nullptr', expected: '0' },
      { name: 'Heap nodes with a negative', input: '10 -> -4', expected: '6' },
    ],
  },

  // 23. practice: swap through pointers
  {
    id: 'c5-practice-swap',
    title: 'Practice: swap with pointers',
    kind: 'implement',
    task: `Write <code>swapInts</code>: given two <code>int*</code>, swap the two ints they point at. It must also be harmless when both pointers point at the same int.`,
    introduces: [],
    refresher: [
      'Use a temporary: copy <code>*a</code> aside, write <code>*b</code> into <code>*a</code>, then put the saved value into <code>*b</code>.',
      'Three statements, all through the pointers. Nothing is returned.',
    ],
    hints: [
      'Start with <code>int temp = *a;</code>.',
      'Then <code>*a = *b;</code> and <code>*b = temp;</code>.',
    ],
    inPython: {
      code: 'a, b = 1, 2\na, b = b, a\nprint(a, b)',
      note: 'Python swaps with tuple assignment. C++ has no tuple here, so you swap through two pointers with a temporary.',
    },
    starter: c`#include <iostream>
using namespace std;

// Swap the ints that a and b point at.
void swapInts(int* a, int* b) {
}`,
    solution: c`#include <iostream>
using namespace std;

// Swap the ints that a and b point at.
void swapInts(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`,
    harness: c`int main() {
    int harness_x = 1, harness_y = 2, harness_p = -5, harness_q = 5, harness_s = 7;
    int harness_arr[3] = {1, 2, 3};
    cout << "\n@@TEST 1@@" << endl;
    swapInts(&harness_x, &harness_y);
    cout << harness_x << " " << harness_y << endl;
    cout << "\n@@TEST 2@@" << endl;
    swapInts(&harness_p, &harness_q);
    cout << harness_p << " " << harness_q << endl;
    cout << "\n@@TEST 3@@" << endl;
    swapInts(&harness_s, &harness_s);
    cout << harness_s << endl;
    cout << "\n@@TEST 4@@" << endl;
    swapInts(&harness_arr[0], &harness_arr[2]);
    cout << harness_arr[0] << " " << harness_arr[1] << " " << harness_arr[2] << endl;
    return 0;
}`,
    require: [{ pattern: '\\*\\s*a\\s*=', message: 'Write through the pointers' }],
    tests: [
      { name: 'Two variables', input: 'swapInts(&x, &y) with 1, 2', expected: '2 1' },
      { name: 'Negative and positive', input: 'swapInts(&p, &q) with -5, 5', expected: '5 -5' },
      { name: 'Same variable twice', input: 'swapInts(&s, &s) with 7', expected: '7' },
      { name: 'Array elements', input: 'swapInts(&arr[0], &arr[2])', expected: '3 2 1' },
    ],
  },

  // 24. practice: a pointer to the largest element
  {
    id: 'c5-practice-max',
    title: 'Practice: find the maximum',
    kind: 'implement',
    task: `Write <code>findMax</code>: return a pointer to the largest of the <code>n</code> ints that <code>a</code> points at (the first one if there is a tie), or <code>nullptr</code> when <code>n</code> is 0. Use pointers, not <code>a[i]</code>.`,
    introduces: [],
    refresher: [
      'Keep a pointer <code>best</code> to the largest so far, and walk another pointer along: <code>for (int* p = a + 1; p != a + n; p++)</code>.',
      'Compare the values with <code>*p &gt; *best</code>; return the pointer, not the value.',
    ],
    hints: [
      'Handle <code>n == 0</code> first. Otherwise start <code>best</code> at <code>a</code>.',
      'When <code>*p</code> is strictly bigger than <code>*best</code>, set <code>best = p;</code>. Strict means ties keep the first.',
    ],
    inPython: {
      code: 'a = [3, 8, 2, 8]\nbest = max(range(len(a)), key=lambda i: a[i])\nprint(best, a[best])',
      note: 'Python\'s <code>max</code> over indices returns the first maximum too. A C++ function can return the <em>address</em> of the winning element instead of an index.',
    },
    starter: c`#include <iostream>
using namespace std;

// Return a pointer to the largest of the n ints at a, or nullptr when n is 0.
int* findMax(int* a, int n) {
    return nullptr;
}`,
    solution: c`#include <iostream>
using namespace std;

// Return a pointer to the largest of the n ints at a, or nullptr when n is 0.
int* findMax(int* a, int n) {
    if (n == 0) {
        return nullptr;
    }
    int* best = a;
    for (int* p = a + 1; p != a + n; p++) {
        if (*p > *best) {
            best = p;
        }
    }
    return best;
}`,
    forbidden: [{ pattern: '\\w\\s*\\[\\s*\\w+\\s*\\]', message: 'Use pointers, not a[i]' }],
    harness: c`void harness_show(int* a, int n) {
    int* r = findMax(a, n);
    if (r == nullptr) {
        cout << "none" << endl;
    } else {
        cout << *r << " at " << (r - a) << endl;
    }
}

int main() {
    int harness_a[4] = {3, 8, 2, 8};
    int harness_b[3] = {-5, -2, -9};
    int harness_c[1] = {4};
    cout << "\n@@TEST 1@@" << endl;
    harness_show(harness_a, 4);
    cout << "\n@@TEST 2@@" << endl;
    harness_show(harness_b, 3);
    cout << "\n@@TEST 3@@" << endl;
    harness_show(harness_c, 1);
    cout << "\n@@TEST 4@@" << endl;
    harness_show(harness_c, 0);
    return 0;
}`,
    tests: [
      { name: 'A tie keeps the first', input: 'findMax({3, 8, 2, 8}, 4)', expected: '8 at 1' },
      { name: 'All negative', input: 'findMax({-5, -2, -9}, 3)', expected: '-2 at 1' },
      { name: 'One element', input: 'findMax({4}, 1)', expected: '4 at 0' },
      { name: 'Empty gives nullptr', input: 'findMax({4}, 0)', expected: 'none' },
    ],
  },

  // 25. practice: a dynamic array that grows
  {
    id: 'c5-practice-grow',
    title: 'Practice: an array that grows',
    kind: 'implement',
    task: `<code>IntList</code> holds a heap array <code>data</code>, how many ints are in use (<code>size</code>) and how many fit (<code>capacity</code>). Write <code>append</code>: when it is full, make an array twice as big, copy the ints over, free the old one, then add the value.`,
    introduces: [],
    refresher: [
      'When <code>size == capacity</code>: <code>new int[2 * capacity]</code>, copy <code>size</code> ints, <code>delete[]</code> the old array, point <code>data</code> at the new one, update <code>capacity</code>.',
      'Then store the value at <code>data[size]</code> and add 1 to <code>size</code>.',
    ],
    hints: [
      'Do the growing only inside <code>if (arr.size == arr.capacity)</code>. The store and the <code>size</code> update come after it, always.',
      'Free the old array only after the copy loop has finished.',
    ],
    inPython: {
      code: 'a = []\nfor v in range(5):\n    a.append(v)\nprint(len(a))',
      note: 'A Python list grows by the same doubling trick, hidden inside <code>append</code>. This is what <code>vector</code> will do for you in stage 7, and now you have written it once yourself.',
    },
    starter: c`#include <iostream>
using namespace std;

struct IntList {
    int* data;
    int size;
    int capacity;
};

// Add value at the end. When the array is full, grow it to twice the capacity first.
void append(IntList& arr, int value) {
    if (arr.size == arr.capacity) {
        return;   // TODO: grow instead of giving up
    }
    arr.data[arr.size] = value;
    arr.size = arr.size + 1;
}`,
    solution: c`#include <iostream>
using namespace std;

struct IntList {
    int* data;
    int size;
    int capacity;
};

// Add value at the end. When the array is full, grow it to twice the capacity first.
void append(IntList& arr, int value) {
    if (arr.size == arr.capacity) {
        int newCapacity = arr.capacity * 2;
        int* bigger = new int[newCapacity];
        for (int i = 0; i < arr.size; i++) {
            bigger[i] = arr.data[i];
        }
        delete[] arr.data;
        arr.data = bigger;
        arr.capacity = newCapacity;
    }
    arr.data[arr.size] = value;
    arr.size = arr.size + 1;
}`,
    require: [{ pattern: 'new\\s+int\\s*\\[', message: 'Allocate the bigger array with new int[...]' }, { pattern: 'delete\\s*\\[\\s*\\]', message: 'Free the old array with delete[]' }],
    harness: c`void harness_show(const IntList& arr) {
    cout << arr.size << "/" << arr.capacity << ":";
    for (int i = 0; i < arr.size; i++) {
        cout << " " << arr.data[i];
    }
    cout << endl;
}

int main() {
    cout << "\n@@TEST 1@@" << endl;
    IntList harness_a = {new int[2], 0, 2};
    for (int v = 1; v <= 5; v++) {
        append(harness_a, v);
    }
    harness_show(harness_a);
    delete[] harness_a.data;
    cout << "\n@@TEST 2@@" << endl;
    IntList harness_b = {new int[2], 0, 2};
    append(harness_b, 10);
    append(harness_b, 20);
    harness_show(harness_b);
    delete[] harness_b.data;
    cout << "\n@@TEST 3@@" << endl;
    IntList harness_c = {new int[2], 0, 2};
    for (int v = 1; v <= 3; v++) {
        append(harness_c, v * 10);
    }
    harness_show(harness_c);
    delete[] harness_c.data;
    cout << "\n@@TEST 4@@" << endl;
    IntList harness_d = {new int[1], 0, 1};
    for (int v = 0; v < 9; v++) {
        append(harness_d, v * v);
    }
    harness_show(harness_d);
    delete[] harness_d.data;
    return 0;
}`,
    tests: [
      { name: 'Grows from 2 to 8', input: 'append 1 to 5, capacity starts at 2', expected: '5/8: 1 2 3 4 5' },
      { name: 'Fits exactly, no growth', input: 'append 10, 20, capacity 2', expected: '2/2: 10 20' },
      { name: 'Grows once', input: 'append 10, 20, 30, capacity 2', expected: '3/4: 10 20 30' },
      { name: 'Many doublings', input: '9 squares, capacity starts at 1', expected: '9/16: 0 1 4 9 16 25 36 49 64' },
    ],
  },
]
