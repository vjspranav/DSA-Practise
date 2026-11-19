// C++ Learn lessons: stage 6 (part b), copying objects, the rule of three, operators and static members.
// Part a is before it; part c (inheritance, templates, practice) after. stage-6-classes.js joins them.
// `C` is String.raw, so a C++ "\n" inside a code string stays two characters.
// A shallow copy of an owning pointer is freed twice: that is undefined behaviour, so it appears only in prose, in a
// compare marked ok: false, and in a predict round marked `ub: true`. The harness of c6-copy-ctor copies onto the
// heap with new and never deletes the copy, so a starter that copies shallowly never frees the same array twice.

const C = String.raw

export const LESSONS = [
  // 14. copy semantics: b = a copies; reference is the Python-like alias
  {
    id: 'c6-copy-semantics',
    title: 'Copies, not aliases',
    kind: 'concept',
    task: 'Read numbers into <code>a.cards</code> until the input ends. Make <code>Hand b = a;</code>, add 100 to <code>b</code> only, then print <em>a: n b: m</em> with the two sizes.',
    introduces: [],
    teach: {
      body: [
        `<p>In Python, <code>b = a</code> never copies anything. It gives the one object a second name, so changing it through <code>b</code> changes it for <code>a</code> too. In C++ an object is a value, like an <code>int</code>. Declaring a new object from an old one, <code>Hand b = a;</code>, builds a separate copy of <em>every field</em>, and from then on the two live their own lives.</p>`,
        `<p>The copy goes all the way down. If a field is a <code>string</code> or a <code>vector</code>, those copy their own contents too, so the Python trap of two "different" variables secretly sharing one list does not exist here. The same rule applies when you pass an object to a function by value (no <code>&amp;</code>) or return it. It is also the reason big objects are passed as <code>const &amp;</code>: to skip the copy.</p>`,
        `<p>When you <em>want</em> the Python behaviour, you ask for it. A reference, <code>Hand&amp; same = a;</code>, is a second name for <code>a</code> itself. A pointer, <code>Hand* p = &amp;a;</code>, holds its address. Both reach the one object; a plain declaration never does.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Hand {
    string owner;
    vector<int> cards;
};

int main() {
    Hand a = {"Ada", {5, 6}};
    Hand b = a;                   // a full, independent copy, including the vector
    b.owner = "Bo";
    b.cards.push_back(7);
    cout << a.owner << " " << a.cards.size() << endl;
    cout << b.owner << " " << b.cards.size() << endl;
    return 0;
}`,
          output: 'Ada 2\nBo 3',
          caption: 'Changing b never touches a.',
        },
        {
          code: C`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Hand {
    string owner;
    vector<int> cards;
};

int main() {
    Hand a = {"Ada", {5, 6}};
    Hand& same = a;               // not a copy: a second name for a, like Python's b = a
    same.cards.push_back(7);
    cout << a.cards.size() << endl;
    return 0;
}`,
          output: '3',
          caption: 'A reference is the Python-style alias.',
        },
      ],
      terms: [
        { code: 'Hand b = a;', meaning: 'makes b an independent copy of every field of a' },
        { code: 'Hand& same = a;', meaning: 'a second name for a itself; no copy is made' },
      ],
    },
    compare: {
      py: { code: C`a = [1, 2]
b = a
b.append(3)
print(len(a), len(b))`, outcome: 'Prints 3 3: one list, two names', ok: true },
      cpp: { code: C`vector<int> a = {1, 2};
vector<int> b = a;
b.push_back(3);
cout << a.size() << " " << b.size() << endl;`, outcome: 'Prints 2 3: b is its own copy', ok: true },
      text: 'Python assignment shares the object between names. C++ assignment or initialisation copies it, unless you ask for a reference or a pointer.',
    },
    refresher: [
      '<code>Hand b = a;</code> copies every field. Later changes to either one are invisible to the other.',
      '<code>Hand&amp; r = a;</code> is not a copy: it is another name for <code>a</code>.',
    ],
    hints: [
      'Read with <code>while (cin &gt;&gt; x)</code> and <code>push_back</code> each value into <code>a.cards</code>.',
      'After <code>Hand b = a;</code>, call <code>b.cards.push_back(100);</code> and print both <code>size()</code> values.',
    ],
    inPython: {
      code: C`import copy

a = [1, 2, 3]
b = copy.copy(a)
b.append(100)
print(len(a), len(b))`,
      note: 'Python needs an explicit <code>copy</code> to get what C++ does by default. In Python assignment shares, and in C++ it copies.',
    },
    starter: C`#include <iostream>
#include <vector>
using namespace std;

struct Hand {
    vector<int> cards;
};

int main() {
    Hand a;
    int x;
    while (cin >> x) {
        a.cards.push_back(x);
    }
    // make b a copy of a, add 100 to b only, and print both sizes
    return 0;
}`,
    solution: C`#include <iostream>
#include <vector>
using namespace std;

struct Hand {
    vector<int> cards;
};

int main() {
    Hand a;
    int x;
    while (cin >> x) {
        a.cards.push_back(x);
    }
    Hand b = a;
    b.cards.push_back(100);
    cout << "a: " << a.cards.size() << " b: " << b.cards.size() << endl;
    return 0;
}`,
    require: [{ pattern: 'Hand\\s+b\\s*=\\s*a\\s*;', message: 'Make the copy with Hand b = a;' }],
    tests: [
      { name: 'Three cards', stdin: '1 2 3\n', expected: 'a: 3 b: 4' },
      { name: 'No cards', stdin: '', expected: 'a: 0 b: 1' },
      { name: 'One card', stdin: '9\n', expected: 'a: 1 b: 2' },
    ],
  },

  // 15. copy constructor, shallow copy danger, rule of three
  {
    id: 'c6-copy-ctor',
    title: 'The copy constructor',
    kind: 'concept',
    task: '<code>IntBuffer</code> owns an array, but copying one shares the same array. Write a copy constructor that gives the copy its own array holding the same numbers.',
    introduces: ['copy-ctor'],
    teach: {
      body: [
        `<p>The step that builds a copy is a special constructor, the <em>copy constructor</em>. Its parameter is a read-only reference to an object of the same class: <code>Name(const Name&amp; other)</code>. If you do not write one, the compiler writes one that copies each field in turn. For <code>int</code>, <code>string</code> and <code>vector</code> fields, that is exactly right.</p>`,
        `<p>It goes wrong for a field that is a raw pointer, like the array pointer in <code>IntBuffer</code>. Copying a pointer copies only the <em>address</em>, not what it points at. This is a <em>shallow</em> copy: the new object and the old one now share one array. Changes through one show up in the other. Worse, when the two objects die, both destructors run <code>delete[]</code> on the same address, and freeing memory twice is <em>undefined behaviour</em>: it may crash, or silently corrupt the heap. Python never has this problem because the garbage collector owns all memory.</p>`,
        `<p>The fix is a <em>deep</em> copy: write your own copy constructor that allocates a fresh array and copies the elements across. This leads to the <em>rule of three</em>: if a class needs a custom destructor (because it owns something), it almost certainly also needs a custom copy constructor and a custom copy assignment <code>operator=</code> (for <code>b = a;</code> on an object that already exists). The three go together. The modern way out is to avoid raw pointers: a <code>vector</code> or <code>unique_ptr</code> member does all three jobs for you.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

class Table {
    int* cells;
    int n;
public:
    Table(int size) : cells(new int[size]), n(size) {
        for (int i = 0; i < n; i++) {
            cells[i] = 0;
        }
    }
    Table(const Table& other) : cells(new int[other.n]), n(other.n) {   // copy constructor
        for (int i = 0; i < n; i++) {
            cells[i] = other.cells[i];        // copy the numbers, not the pointer
        }
    }
    ~Table() {
        delete[] cells;
    }
    void put(int i, int v) { cells[i] = v; }
    int get(int i) const { return cells[i]; }
};

int main() {
    Table a(3);
    a.put(0, 5);
    Table b = a;                 // the copy constructor runs: b gets its own array
    b.put(0, 99);
    cout << a.get(0) << " " << b.get(0) << endl;
    return 0;
}`,
          output: '5 99',
          caption: 'A deep copy: two objects, two arrays.',
        },
      ],
      terms: [
        { code: 'Name(const Name& other)', meaning: 'the copy constructor: runs when an object is created from another' },
        { code: 'shallow copy', meaning: 'copies a pointer\'s address, so both objects share one array' },
        { code: 'rule of three', meaning: 'a class with a custom destructor needs a custom copy constructor and copy assignment too' },
      ],
    },
    compare: {
      py: { code: C`import copy

a = [5, 0, 0]
b = copy.deepcopy(a)
b[0] = 99
print(a[0], b[0])`, outcome: 'Prints 5 99: deepcopy gives an independent copy', ok: true },
      cpp: { code: C`class Buf {
    int* p;
public:
    Buf() : p(new int[4]) { }
    ~Buf() { delete[] p; }
};
Buf a;
Buf b = a;`, outcome: 'Undefined: both destroy the same array', ok: false },
      text: 'Python\'s <code>deepcopy</code> is an explicit request. In C++ the default copy is shallow for raw pointers, and nothing warns you when it frees the same array twice.',
    },
    refresher: [
      'A copy constructor is <code>Name(const Name&amp; other)</code>. For a class that owns a raw pointer, it must allocate new memory and copy the contents.',
      'The rule of three: a destructor, a copy constructor and a copy assignment usually come together.',
    ],
    hints: [
      'Use an initialiser list that allocates: <code>data(new int[other.len]), len(other.len)</code>.',
      'In the body, loop over <code>len</code> and copy <code>other.data[i]</code> into <code>data[i]</code>.',
    ],
    inPython: {
      code: C`import copy

a = [5, 0]
b = copy.deepcopy(a)
b[0] = 99
print(a, b)`,
      note: 'Python\'s <code>deepcopy</code> walks the whole object for you. A C++ class with a raw pointer must do that walk itself.',
    },
    starter: C`#include <iostream>
using namespace std;

class IntBuffer {
    int* data;
    int len;
public:
    IntBuffer(int n) : data(new int[n]), len(n) {
        for (int i = 0; i < len; i++) {
            data[i] = 0;
        }
    }
    // write the copy constructor here
    ~IntBuffer() {
        delete[] data;
    }

    void put(int i, int v) { data[i] = v; }
    int get(int i) const { return data[i]; }
    int size() const { return len; }
};`,
    solution: C`#include <iostream>
using namespace std;

class IntBuffer {
    int* data;
    int len;
public:
    IntBuffer(int n) : data(new int[n]), len(n) {
        for (int i = 0; i < len; i++) {
            data[i] = 0;
        }
    }
    IntBuffer(const IntBuffer& other) : data(new int[other.len]), len(other.len) {
        for (int i = 0; i < len; i++) {
            data[i] = other.data[i];
        }
    }
    ~IntBuffer() {
        delete[] data;
    }

    void put(int i, int v) { data[i] = v; }
    int get(int i) const { return data[i]; }
    int size() const { return len; }
};`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    {
        IntBuffer a(3);
        a.put(0, 5);
        IntBuffer* c = new IntBuffer(a);
        c->put(0, 99);
        cout << a.get(0) << " " << c->get(0) << endl;
    }
    cout << "\n@@TEST 2@@" << endl;
    {
        IntBuffer a(2);
        IntBuffer* c = new IntBuffer(a);
        a.put(1, 7);
        cout << c->get(1) << endl;
    }
    cout << "\n@@TEST 3@@" << endl;
    {
        IntBuffer a(6);
        a.put(5, 4);
        IntBuffer* c = new IntBuffer(a);
        cout << c->size() << " " << c->get(5) << endl;
    }
    return 0;
}`,
    require: [{ pattern: 'IntBuffer\\s*\\(\\s*const\\s+IntBuffer\\s*&', message: 'Write IntBuffer(const IntBuffer& other)' }],
    tests: [
      { name: 'Changing the copy leaves the original', input: 'copy of a; change copy', expected: '5 99' },
      { name: 'Changing the original leaves the copy', input: 'copy of a; change a', expected: '0' },
      { name: 'Size and contents are copied', input: 'copy of a', expected: '6 4' },
    ],
  },

  // 16. predict: shallow copy (undefined) vs deep copy
  {
    id: 'c6-predict-double-delete',
    title: 'Predict: two owners',
    kind: 'predict',
    task: 'For each snippet, pick what you expect. One of them is undefined behaviour and will not be run.',
    introduces: [],
    inPython: {
      code: C`class Buf:
    def __init__(self):
        self.p = [1, 2]

a = Buf()
b = a
print(a is b)`,
      note: 'Python\'s <code>b = a</code> shares the object, and the garbage collector frees it once, when nobody uses it. C++ has no such guard for raw pointers.',
    },
    refresher: [
      'A class that owns a raw pointer and has a destructor needs its own copy constructor, or two objects will free the same array.',
      'Freeing the same memory twice is undefined behaviour: it may crash, print anything, or seem to work.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

class Buf {
    int* p;
public:
    Buf() : p(new int[4]) { p[0] = 1; }
    ~Buf() { delete[] p; }
};

int main() {
    {
        Buf a;
        Buf b = a;
    }
    cout << "done" << endl;
    return 0;
}`,
        choices: ['Prints done and exits normally', 'Undefined: the array is freed twice', 'Compile error'],
        answer: 1,
        why: 'The default copy copies only the pointer, so a and b share one array. At the closing brace both destructors delete it. Freeing twice is undefined behaviour, so you cannot rely on any outcome, even "done".',
        ub: true,
        output: 'Undefined: the same array is freed twice, anything can happen.',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

class Buf {
    int* p;
public:
    Buf() : p(new int[2]) { p[0] = 1; p[1] = 2; }
    Buf(const Buf& o) : p(new int[2]) { p[0] = o.p[0]; p[1] = o.p[1]; }
    ~Buf() { delete[] p; }
    void setHead(int v) { p[0] = v; }
    int head() const { return p[0]; }
};

int main() {
    Buf a;
    Buf b = a;
    b.setHead(9);
    cout << a.head() << " " << b.head() << endl;
    return 0;
}`,
        choices: ['9 9', '1 9', '1 1'],
        answer: 1,
        why: 'This class has a copy constructor that allocates its own array, so b is a true deep copy. Changing b leaves a alone, and each destructor frees a different array.',
        output: '1 9',
      },
    ],
  },

  // 17. operator<
  {
    id: 'c6-operator-less',
    title: 'Overloading <',
    kind: 'concept',
    task: 'Write <code>operator&lt;</code> for <code>Version</code>: it is smaller when its major number is smaller, then its minor, then its patch. The program prints <em>older</em> or <em>not older</em>.',
    introduces: ['operator-overload'],
    teach: {
      body: [
        `<p>You can teach your own types to work with operators such as <code>&lt;</code>. A method whose name is literally <code>operator&lt;</code> is what the compiler runs for <code>a &lt; b</code>: it reads that as <code>a.operator&lt;(b)</code>. Python does the same with a method named <code>__lt__</code>. The usual shape is <code>bool operator&lt;(const Version&amp; other) const</code>: it returns a <code>bool</code>, takes the right-hand object by read-only reference (no copy), and is <code>const</code> because comparing must not change anything.</p>`,
        `<p>This matters later. Sorting a list of your own objects, or putting them in a <code>set</code> or <code>map</code>, needs a <code>&lt;</code> to decide the order (stage 7). The rule to keep: <code>a &lt; a</code> must be false, so use strict <code>&lt;</code> and never <code>&lt;=</code> inside it. A comparison on several fields checks the first field; only if those are equal does it look at the next.</p>`,
        `<p>The same trick works for <code>==</code>, <code>+</code>, <code>[]</code> and many more, but only define an operator when its meaning is obvious. Everything here uses <code>if</code>, <code>!=</code> and <code>&lt;</code> from earlier stages.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

struct Money {
    int dollars;
    int cents;

    bool operator<(const Money& other) const {     // a < b runs a.operator<(b)
        if (dollars != other.dollars) {
            return dollars < other.dollars;        // decided by the first field
        }
        return cents < other.cents;                // tie: look at the next field
    }
};

int main() {
    Money a = {3, 50};
    Money b = {3, 75};
    if (a < b) {
        cout << "a is cheaper" << endl;
    }
    if (!(b < a)) {
        cout << "b is not cheaper" << endl;
    }
    return 0;
}`,
          output: 'a is cheaper\nb is not cheaper',
          caption: 'Comparing two fields in order.',
        },
      ],
      terms: [
        { code: 'bool operator<(const T& other) const', meaning: 'tells the compiler what a < b means for your type' },
        { code: 'a < a is false', meaning: 'use strict &lt;, never &lt;=, so equal objects are not "less"' },
      ],
    },
    compare: {
      py: { code: C`class V:
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def __lt__(self, other):
        return (self.a, self.b) < (other.a, other.b)

print(V(1, 2) < V(1, 3))`, outcome: 'Prints True; __lt__ defines <', ok: true },
      cpp: { code: C`struct V {
    int a;
    int b;
    bool operator<(const V& o) const {
        if (a != o.a) { return a < o.a; }
        return b < o.b;
    }
};
V x = {1, 2};
V y = {1, 3};
cout << (x < y) << endl;`, outcome: 'Prints 1; operator< defines <', ok: true },
      text: 'Python\'s <code>__lt__</code> and C++\'s <code>operator&lt;</code> are the same idea. C++ spells the operator out and compares fields by hand.',
    },
    refresher: [
      '<code>bool operator&lt;(const T&amp; other) const</code> runs for <code>a &lt; b</code>. Compare the first field; only if equal, the next.',
      'Equal objects must give false, so use <code>&lt;</code> and never <code>&lt;=</code> inside it.',
    ],
    hints: [
      'If <code>major</code> differs, return <code>major &lt; other.major</code>. Do the same for <code>minor</code>.',
      'When major and minor both match, the answer is <code>patch &lt; other.patch</code>.',
    ],
    inPython: {
      code: C`class Version:
    def __init__(self, major, minor, patch):
        self.t = (major, minor, patch)

    def __lt__(self, other):
        return self.t < other.t

print(Version(1, 2, 3) < Version(1, 2, 4))`,
      note: 'Python compares tuples field by field for you. C++ has no such shortcut yet, so the comparison is written out as an <code>if</code> chain.',
    },
    starter: C`#include <iostream>
using namespace std;

struct Version {
    int major;
    int minor;
    int patch;

    bool operator<(const Version& other) const {
        return false;
    }
};

int main() {
    Version a = {};
    Version b = {};
    cin >> a.major >> a.minor >> a.patch;
    cin >> b.major >> b.minor >> b.patch;
    if (a < b) {
        cout << "older" << endl;
    } else {
        cout << "not older" << endl;
    }
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

struct Version {
    int major;
    int minor;
    int patch;

    bool operator<(const Version& other) const {
        if (major != other.major) {
            return major < other.major;
        }
        if (minor != other.minor) {
            return minor < other.minor;
        }
        return patch < other.patch;
    }
};

int main() {
    Version a = {};
    Version b = {};
    cin >> a.major >> a.minor >> a.patch;
    cin >> b.major >> b.minor >> b.patch;
    if (a < b) {
        cout << "older" << endl;
    } else {
        cout << "not older" << endl;
    }
    return 0;
}`,
    tests: [
      { name: 'Patch decides', stdin: '1 2 3 1 2 4\n', expected: 'older' },
      { name: 'Major beats the rest', stdin: '2 0 0 1 9 9\n', expected: 'not older' },
      { name: 'Equal is not older', stdin: '1 5 5 1 5 5\n', expected: 'not older' },
      { name: 'Minor decides', stdin: '1 2 3 1 3 0\n', expected: 'older' },
    ],
  },

  // 18. operator<< for printing
  {
    id: 'c6-operator-print',
    title: 'Printing with <<',
    kind: 'concept',
    task: 'Make <code>cout &lt;&lt; p</code> print a <code>Point</code> as <em>(x, y)</em>. Complete the <code>operator&lt;&lt;</code> function; <code>main</code> already uses it.',
    introduces: [],
    teach: {
      body: [
        `<p>Python's <code>print(p)</code> shows an object by calling its <code>__str__</code> method. In C++ you teach <code>cout</code> how to show your type by overloading <code>&lt;&lt;</code>, the same idea as the last lesson. The expression <code>cout &lt;&lt; p</code> becomes a call to <code>operator&lt;&lt;(cout, p)</code>.</p>`,
        `<p>The shape is always the same: <code>ostream&amp; operator&lt;&lt;(ostream&amp; out, const Point&amp; p)</code>. <code>ostream</code> is the type of <code>cout</code> (it comes with <code>iostream</code>). The stream is taken by reference because a stream cannot be copied. The point is read-only. The body writes the pieces into <code>out</code> and <em>returns <code>out</code></em>, which is what lets calls chain: <code>cout &lt;&lt; p &lt;&lt; endl</code> prints <code>p</code> and then uses the returned stream for <code>endl</code>.</p>`,
        `<p>Unlike <code>operator&lt;</code>, this one is a plain function outside the struct. The left side of <code>&lt;&lt;</code> is <code>cout</code>, not your object, so it cannot be a method of your struct.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

ostream& operator<<(ostream& out, const Point& p) {   // cout << p calls this
    out << "(" << p.x << ", " << p.y << ")";           // write the pieces into the stream
    return out;                                        // hand the stream back so << can chain
}

int main() {
    Point a = {3, 4};
    Point b = {-1, 0};
    cout << "a = " << a << endl;
    cout << a << " -> " << b << endl;
    return 0;
}`,
          output: 'a = (3, 4)\n(3, 4) -> (-1, 0)',
          caption: 'Once defined, a Point prints like any other value.',
        },
      ],
      terms: [
        { code: 'ostream& operator<<(ostream& out, const T& v)', meaning: 'teaches cout how to print a T' },
        { code: 'return out;', meaning: 'hands the stream back so that << calls can be chained' },
      ],
    },
    compare: {
      py: { code: C`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return "(" + str(self.x) + ", " + str(self.y) + ")"

print(Point(3, 4))`, outcome: 'Prints (3, 4); print calls __str__', ok: true },
      cpp: { code: C`struct Point { int x; int y; };

ostream& operator<<(ostream& out, const Point& p) {
    out << "(" << p.x << ", " << p.y << ")";
    return out;
}

Point p = {3, 4};
cout << p << endl;`, outcome: 'Prints (3, 4); cout << calls operator<<', ok: true },
      text: 'Python builds a string in <code>__str__</code> and lets <code>print</code> show it. C++ writes straight into the output stream and returns that stream.',
    },
    refresher: [
      '<code>ostream&amp; operator&lt;&lt;(ostream&amp; out, const T&amp; v) { out &lt;&lt; ...; return out; }</code> is the whole pattern.',
      'It is a free function (not a method) and must return <code>out</code> so that <code>cout &lt;&lt; a &lt;&lt; b</code> still works.',
    ],
    hints: [
      'Inside the function, write to <code>out</code> exactly as you would to <code>cout</code>.',
      'Print <code>"("</code>, then <code>p.x</code>, then <code>", "</code>, then <code>p.y</code>, then <code>")"</code>.',
    ],
    inPython: {
      code: C`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return "(" + str(self.x) + ", " + str(self.y) + ")"

print(Point(0, -2))`,
      note: 'Python returns a string and print does the output. C++ prints inside the function, so the function needs the stream it should print to.',
    },
    starter: C`#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

ostream& operator<<(ostream& out, const Point& p) {
    // print the point as (x, y)
    return out;
}

int main() {
    Point p = {};
    cin >> p.x >> p.y;
    cout << p << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

ostream& operator<<(ostream& out, const Point& p) {
    out << "(" << p.x << ", " << p.y << ")";
    return out;
}

int main() {
    Point p = {};
    cin >> p.x >> p.y;
    cout << p << endl;
    return 0;
}`,
    require: [{ pattern: 'out\\s*<<', message: 'Write to out, not cout' }],
    tests: [
      { name: 'Positive', stdin: '3 4\n', expected: '(3, 4)' },
      { name: 'Negative', stdin: '0 -2\n', expected: '(0, -2)' },
      { name: 'Both negative', stdin: '-1 -1\n', expected: '(-1, -1)' },
    ],
  },

  // 19. static members
  {
    id: 'c6-static-members',
    title: 'static members',
    kind: 'concept',
    task: 'Count how many <code>Widget</code> objects have been made. Add a <code>static</code> counter, increase it in the constructor, and make <code>Widget::made()</code> return it. The program prints <em>Made: n</em>.',
    introduces: ['static-member'],
    teach: {
      body: [
        `<p>Normally every object has its own copy of each field. A <code>static</code> data member is different: there is <em>one</em> copy shared by the whole class, whatever the number of objects. It is a field that belongs to the class itself. Python has the same thing as a class attribute: <code>made = 0</code> written in the class body and used as <code>Widget.made</code>.</p>`,
        `<p>A static variable is declared inside the class with <code>static</code>, but because it is not part of any object, it also needs one definition outside the class, with the class name and <code>::</code> in front: <code>int Widget::made = 0;</code>. Forgetting that line is a linker error. A <code>static</code> method belongs to the class too: it has no <code>this</code> and no object, so it can only use static members, and you call it as <code>Widget::made()</code>.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

class Ticket {
    static int issued;                 // one variable shared by every Ticket
    int number;
public:
    Ticket() {
        issued = issued + 1;
        number = issued;               // each ticket remembers its own number
    }
    int getNumber() const { return number; }
    static int totalIssued() {         // no object needed to call this
        return issued;
    }
};

int Ticket::issued = 0;                // the one definition, outside the class

int main() {
    Ticket a;
    Ticket b;
    Ticket c;
    cout << c.getNumber() << " " << Ticket::totalIssued() << endl;
    return 0;
}`,
          output: '3 3',
          caption: 'A shared counter and a static method.',
        },
      ],
      terms: [
        { code: 'static int x;', meaning: 'inside the class: one variable shared by all objects' },
        { code: 'int Name::x = 0;', meaning: 'outside the class: the single definition of that static' },
        { code: 'static int f() { ... }', meaning: 'a method with no object; call it as Name::f()' },
      ],
    },
    compare: {
      py: { code: C`class Widget:
    made = 0

    def __init__(self):
        Widget.made += 1

for _ in range(3):
    Widget()
print(Widget.made)`, outcome: 'Prints 3; made is a class attribute', ok: true },
      cpp: { code: C`#include <iostream>
using namespace std;

class Widget {
public:
    static int made;
    Widget() { made = made + 1; }
};
int Widget::made = 0;

int main() {
    for (int i = 0; i < 3; i++) {
        Widget w;
    }
    cout << Widget::made << endl;
    return 0;
}`, outcome: 'Prints 3; made is a static member', ok: true },
      text: 'Python writes a class attribute in the class body. C++ declares a <code>static</code> member inside the class and defines it once outside.',
    },
    refresher: [
      '<code>static int x;</code> in the class, <code>int Name::x = 0;</code> once outside it, and <code>Name::x</code> to use it.',
      'A static method has no <code>this</code>: it can only use static members, and is called as <code>Name::f()</code>.',
    ],
    hints: [
      'Add <code>static int counter;</code> to <code>Widget</code>, and define <code>int Widget::counter = 0;</code> below the class.',
      'Add 1 to the counter in the constructor, and make <code>made()</code> return it.',
    ],
    inPython: {
      code: C`class Widget:
    made = 0

    def __init__(self):
        Widget.made += 1

n = 3
for _ in range(n):
    Widget()
print("Made:", Widget.made)`,
      note: 'The class attribute is shared by every object. A C++ static member is the same idea, with a separate definition outside the class.',
    },
    starter: C`#include <iostream>
using namespace std;

class Widget {
public:
    Widget() {
    }
    static int made() {
        return 0;
    }
};

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        Widget w;
    }
    cout << "Made: " << Widget::made() << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

class Widget {
    static int counter;
public:
    Widget() {
        counter = counter + 1;
    }
    static int made() {
        return counter;
    }
};

int Widget::counter = 0;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        Widget w;
    }
    cout << "Made: " << Widget::made() << endl;
    return 0;
}`,
    require: [
      { pattern: 'static\\s+int\\s+\\w+\\s*;', message: 'Declare a static int counter in the class' },
      { pattern: 'int\\s+Widget::\\w+\\s*=', message: 'Define the static outside the class: int Widget::counter = 0;' },
    ],
    tests: [
      { name: 'Three widgets', stdin: '3\n', expected: 'Made: 3' },
      { name: 'None', stdin: '0\n', expected: 'Made: 0' },
      { name: 'Many', stdin: '10\n', expected: 'Made: 10' },
    ],
  },
]
