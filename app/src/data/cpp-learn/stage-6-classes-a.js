// C++ Learn lessons: stage 6 (part a), structs, methods, classes, constructors, destructors, copying.
// Part b continues with operators, static, inheritance, templates and practice. stage-6-classes.js joins the two.
// Contract and examples: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md and
// docs/superpowers/specs/cpp-learn-lesson-examples.js. Check with: node scripts/verify-cpp-learn.mjs --stage 6
// The learner knows Python and stages 1 to 5 (including a minimal struct, pointers, new and delete).
// `C` is String.raw, so a C++ "\n" inside a code string stays two characters.
// Undefined behaviour (a shallow copy freed twice) is taught in prose, in a compare marked ok: false, and in a
// predict round marked `ub: true`; its output is never stored. The harnesses copy objects onto the heap with new
// and never delete the copy, so even a starter that copies shallowly never frees the same array twice.

const C = String.raw

export const LESSONS = [
  // 1. struct as a record, aggregate initialisation
  {
    id: 'c6-struct-fields',
    title: 'Structs as records',
    kind: 'concept',
    task: 'Define a <code>struct Rect</code> with two <code>int</code> fields, <code>w</code> and <code>h</code>. Read two numbers into one <code>Rect</code> and print its area.',
    introduces: [],
    teach: {
      body: [
        `<p>In stage 5 you used a small <code>struct</code> to hold a node. A struct is C++'s plain record: a bundle of named variables, called <em>fields</em>, that travel together. You write the shape once, then make as many values of it as you like. In Python you might write a class whose <code>__init__</code> only sets a few attributes; a struct is that, except that the fields and their types are fixed the moment you write it, and nobody can add a new one later.</p>`,
        `<p>Define it with the word <code>struct</code>, a name, and the fields between braces. <em>The closing brace is followed by a semicolon</em>, and forgetting it is a classic early mistake. A value is made by using the struct name as a type: <code>Student s = {"Mia", 20, 3.5};</code>. The braces fill the fields in the order they were declared; this is called <em>aggregate initialisation</em>. Fields you leave out become zero (or an empty string). A field is read and written with a dot: <code>s.age</code>.</p>`,
        `<p>Be careful with a struct made with no braces at all: <code>Student s;</code> leaves number fields holding whatever garbage was in memory, exactly like a plain <code>int</code>. Writing <code>= {}</code> starts every field at zero. Fields can have any type, including <code>string</code>, <code>vector</code> or another struct.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
#include <string>
using namespace std;

struct Student {          // a new type with three fields
    string name;
    int age;
    double gpa;
};                        // note the semicolon after the closing brace

int main() {
    Student s = {"Mia", 20, 3.5};   // fields are filled in the order they were declared
    cout << s.name << " " << s.age << endl;
    s.age = 21;                     // a field is an ordinary variable inside the struct
    cout << s.age << " " << s.gpa << endl;
    return 0;
}`,
          output: 'Mia 20\n21 3.5',
          caption: 'Defining a struct, filling it and changing a field.',
        },
        {
          code: C`#include <iostream>
using namespace std;

struct Pair {
    int a;
    int b;
};

int main() {
    Pair p = {7};     // a is 7; b was left out, so it becomes 0
    Pair q = {};      // empty braces: every field starts at 0
    cout << p.a << " " << p.b << " " << q.a << endl;
    return 0;
}`,
          output: '7 0 0',
          caption: 'Missing values become zero; empty braces zero everything.',
        },
      ],
      terms: [
        { code: 'struct Name { ... };', meaning: 'defines a record type with fixed fields; the semicolon after the brace is required' },
        { code: 'Name v = {a, b};', meaning: 'makes a value, filling the fields in declaration order' },
        { code: 'Name v = {};', meaning: 'makes a value with every field zero' },
        { code: 'v.field', meaning: 'reads or writes one field of v' },
      ],
    },
    compare: {
      py: { code: C`class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h

r = Rect(3, 4)
r.depth = 5          # Python lets you add attributes any time
print(r.w * r.h)`, outcome: 'Prints 12; attributes can be added later', ok: true },
      cpp: { code: C`struct Rect { int w; int h; };
Rect r = {3, 4};
cout << r.w * r.h << endl;`, outcome: 'Prints 12; the fields are fixed in the struct', ok: true },
      text: 'A Python object can grow new attributes whenever you like. A C++ struct has exactly the fields written in its definition, with fixed types.',
    },
    refresher: [
      '<code>struct Name { int a; int b; };</code> needs the semicolon after the brace. Make one with <code>Name v = {1, 2};</code>.',
      'Use <code>= {}</code> to start every field at zero, and a dot to reach a field: <code>v.a</code>.',
    ],
    hints: [
      'Write the struct above <code>main</code>, with the two fields inside its braces.',
      'Make <code>Rect r = {};</code>, then <code>cin &gt;&gt; r.w &gt;&gt; r.h;</code> reads straight into the fields.',
    ],
    inPython: {
      code: C`class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h

r = Rect(3, 4)
print(r.w * r.h)`,
      note: 'Python builds the object through <code>__init__</code>. A C++ struct has no such code to write: the braces fill its fields directly.',
    },
    starter: C`#include <iostream>
using namespace std;

// define struct Rect here

int main() {
    // read w and h into a Rect and print its area
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

struct Rect {
    int w;
    int h;
};

int main() {
    Rect r = {};
    cin >> r.w >> r.h;
    cout << r.w * r.h << endl;
    return 0;
}`,
    require: [{ pattern: 'struct\\s+Rect', message: 'Define struct Rect' }],
    tests: [
      { name: '3 by 4', stdin: '3 4\n', expected: '12' },
      { name: 'Square', stdin: '5 5\n', expected: '25' },
      { name: 'Zero side', stdin: '0 9\n', expected: '0' },
    ],
  },

  // 2. predict: struct copies
  {
    id: 'c6-predict-struct-copy',
    title: 'Copies, not shared names',
    kind: 'predict',
    task: 'For each snippet, pick what you expect, then run it and compare.',
    introduces: [],
    inPython: {
      code: C`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

a = Point(1, 2)
b = a
b.x = 9
print(a.x, b.x)`,
      note: 'In Python <code>b = a</code> gives the one object a second name, so both print 9. In C++ <code>b = a</code> builds a separate copy of every field.',
    },
    refresher: [
      'Assigning one struct to another copies all of its fields into a new, independent value.',
      'A function that takes a struct by value (no <code>&amp;</code>) works on its own copy and cannot change the caller\'s.',
    ],
    rounds: [
      {
        snippet: C`#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

int main() {
    Point a = {1, 2};
    Point b = a;
    b.x = 9;
    cout << a.x << " " << b.x << endl;
    return 0;
}`,
        choices: ['9 9', '1 9', '1 1'],
        answer: 1,
        why: 'b = a copied both fields into a new Point. Changing b.x leaves a alone, so it prints 1 and 9. In Python both names would show 9.',
        output: '1 9',
      },
      {
        snippet: C`#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;
};

void shift(Point p) {
    p.x = p.x + 10;
}

int main() {
    Point a = {1, 2};
    shift(a);
    cout << a.x << endl;
    return 0;
}`,
        choices: ['11', '1', 'Compile error'],
        answer: 1,
        why: 'shift received a copy of a, because the parameter has no &. It changed its own copy and the original is untouched, so a.x is still 1. A Python function would have changed the shared object.',
        output: '1',
      },
    ],
  },

  // 3. member functions and this
  {
    id: 'c6-methods-this',
    title: 'Methods and this',
    kind: 'concept',
    task: '<code>setWidth</code> is meant to change the rectangle\'s width, but the program still prints the old area. The parameter hides the field. Fix <code>setWidth</code> with <code>this</code>.',
    introduces: ['this'],
    teach: {
      body: [
        `<p>A struct can hold functions as well as fields. A function inside a struct is called a <em>member function</em> or <em>method</em>, as in Python. Write it inside the braces like any function, and call it with a dot: <code>r.area()</code>. Inside the method, the field names refer to the object the method was called on, with no <code>self.</code> needed: in <code>int area() { return w * h; }</code>, <code>w</code> and <code>h</code> are the fields of <code>r</code> when you call <code>r.area()</code>.</p>`,
        `<p>How does <code>area</code> know which object? Python passes it as the visible first parameter <code>self</code>. C++ passes it secretly, as a pointer named <code>this</code> that holds the address of the object the method was called on. <code>this-&gt;w</code> means "the <code>w</code> of the object I was called on" (the arrow is the pointer arrow from stage 5), and plain <code>w</code> is a short way of writing the same thing.</p>`,
        `<p>You need <code>this</code> when a parameter has the same name as a field. The parameter wins inside the method, so <code>w = w;</code> assigns the parameter to itself and the field never changes, and no error warns you. Writing <code>this-&gt;w = w;</code> says "the field gets the parameter". Renaming the parameter also works, but <code>this-&gt;</code> is the common habit.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

struct Rect {
    int w;
    int h;

    int area() {              // a method: runs on one particular Rect
        return w * h;         // w and h are that Rect's own fields
    }

    void grow(int by) {
        w = w + by;
        h = h + by;
    }
};

int main() {
    Rect r = {2, 3};
    cout << r.area() << endl;   // 6
    r.grow(1);                  // changes r itself
    cout << r.area() << endl;   // 3 * 4 = 12
    return 0;
}`,
          output: '6\n12',
          caption: 'Methods read and change the object they are called on.',
        },
        {
          code: C`#include <iostream>
using namespace std;

struct Box {
    int size;

    void bad(int size) {
        size = size;           // the parameter is assigned to itself; the field is untouched
    }
    void good(int size) {
        this->size = size;     // the field of this object gets the parameter
    }
};

int main() {
    Box b = {1};
    b.bad(5);
    cout << b.size << endl;    // still 1
    b.good(9);
    cout << b.size << endl;    // 9
    return 0;
}`,
          output: '1\n9',
          caption: 'Why this is sometimes needed.',
        },
      ],
      terms: [
        { code: 'int area() { ... }', meaning: 'a method: a function written inside the struct' },
        { code: 'r.area()', meaning: 'calls the method on the object r' },
        { code: 'this', meaning: 'a pointer to the object the method was called on' },
        { code: 'this->w', meaning: 'the field w of that object; plain w means the same unless a parameter hides it' },
      ],
    },
    compare: {
      py: { code: C`class Box:
    def __init__(self, size):
        self.size = size

    def set_size(self, size):
        self.size = size

b = Box(1)
b.set_size(9)
print(b.size)`, outcome: 'Prints 9; self is written out every time', ok: true },
      cpp: { code: C`struct Box {
    int size;
    void setSize(int size) { this->size = size; }
};
Box b = {1};
b.setSize(9);
cout << b.size << endl;`, outcome: 'Prints 9; this is passed in secretly', ok: true },
      text: 'Python makes you write <code>self</code> as a parameter and in front of every field. C++ passes <code>this</code> invisibly and lets plain field names work.',
    },
    refresher: [
      'A method is a function inside the struct, called as <code>obj.method()</code>. Plain field names inside it mean the fields of that object.',
      '<code>this-&gt;name</code> is the field <code>name</code> of the current object. Use it when a parameter has the same name.',
    ],
    hints: [
      'In <code>setWidth</code>, the left side of <code>w = w;</code> is the parameter, not the field.',
      'Change the left side to <code>this-&gt;w</code>.',
    ],
    inPython: {
      code: C`class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def set_width(self, w):
        self.w = w

    def area(self):
        return self.w * self.h

r = Rect(3, 4)
r.set_width(10)
print(r.area())`,
      note: 'In Python <code>self.w</code> and <code>w</code> are always different things, so the mix-up cannot happen. In C++ an unqualified name can silently pick the parameter.',
    },
    starter: C`#include <iostream>
using namespace std;

struct Rect {
    int w;
    int h;

    int area() {
        return w * h;
    }

    void setWidth(int w) {
        w = w;   // bug: both sides are the parameter
    }
};

int main() {
    Rect r = {};
    int newWidth;
    cin >> r.w >> r.h >> newWidth;
    r.setWidth(newWidth);
    cout << r.area() << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

struct Rect {
    int w;
    int h;

    int area() {
        return w * h;
    }

    void setWidth(int w) {
        this->w = w;
    }
};

int main() {
    Rect r = {};
    int newWidth;
    cin >> r.w >> r.h >> newWidth;
    r.setWidth(newWidth);
    cout << r.area() << endl;
    return 0;
}`,
    require: [{ pattern: 'this\\s*->\\s*w\\s*=', message: 'Assign to this->w' }],
    tests: [
      { name: 'Wider rectangle', stdin: '3 4 10\n', expected: '40' },
      { name: 'Narrower', stdin: '5 5 1\n', expected: '5' },
      { name: 'Same width', stdin: '2 7 2\n', expected: '14' },
    ],
  },

  // 4. const member functions
  {
    id: 'c6-const-methods',
    title: 'const methods',
    kind: 'concept',
    task: 'Add a <code>perimeter</code> method to <code>Rect</code>, marked <code>const</code>, and use it in <code>describe</code> to print <em>Perimeter: ...</em> after the area line.',
    introduces: ['const-method'],
    teach: {
      body: [
        `<p>Writing <code>const</code> after a method's parameter list, as in <code>int area() const { ... }</code>, is a promise: "this method only looks at the object and never changes it". The compiler holds you to it. Assigning to a field inside a const method is a compile error.</p>`,
        `<p>The promise matters because of stage 3's <code>const &amp;</code>. A function that takes <code>const Rect&amp; r</code> has been told it may not change <code>r</code>, so it is only allowed to call methods that carry the same promise. A method without <code>const</code> might change the object, so the compiler refuses the call. The habit is simple: <em>any method that only reads should be <code>const</code></em>. Python has nothing like this; every method may change <code>self</code>.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

struct Rect {
    int w;
    int h;
    int area() const {            // promises not to change the Rect
        return w * h;
    }
    void grow() {                 // changes the Rect, so no const
        w = w + 1;
        h = h + 1;
    }
};

void show(const Rect& r) {        // r may not be changed here
    cout << r.area() << endl;     // fine: area is const
    // r.grow();                  // would not compile: grow is not const
}

int main() {
    Rect r = {2, 3};
    show(r);
    r.grow();
    show(r);
    return 0;
}`,
          output: '6\n12',
          caption: 'A const method can be called through a const reference.',
        },
      ],
      terms: [
        { code: 'int area() const { ... }', meaning: 'a method that promises not to change the object' },
        { code: 'const Rect& r', meaning: 'a read-only view of a Rect; only const methods may be called on it' },
      ],
    },
    compare: {
      py: { code: C`class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def area(self):
        self.w = 0          # a sneaky change; Python allows it
        return self.w * self.h

r = Rect(3, 4)
print(r.area(), r.w)`, outcome: 'Prints 0 0; area() quietly broke the object', ok: true },
      cpp: { code: C`struct Rect {
    int w;
    int h;
    int area() const {
        w = 0;
        return w * h;
    }
};`, outcome: 'Compile error: a const method cannot change a field', ok: false, errorMatch: 'within const member function' },
      text: 'Python trusts every method not to change the object. C++ lets you mark a method <code>const</code> and then checks the promise for you.',
    },
    refresher: [
      '<code>int area() const { ... }</code> may read fields but not assign to them. Add it to every method that only reads.',
      'Only <code>const</code> methods can be called on a <code>const Rect&amp;</code> or a <code>const</code> object.',
    ],
    hints: [
      'Copy the shape of <code>area</code>: its <code>const</code> sits between the parentheses and the opening brace.',
      'A rectangle\'s perimeter is <code>2 * (w + h)</code>. Then print it in <code>describe</code>.',
    ],
    inPython: {
      code: C`class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def perimeter(self):
        return 2 * (self.w + self.h)

print(Rect(3, 4).perimeter())`,
      note: 'Python methods have no <code>const</code>, so nothing records which ones only read. In C++ the keyword is part of the method\'s signature.',
    },
    starter: C`#include <iostream>
using namespace std;

struct Rect {
    int w;
    int h;
    int area() const {
        return w * h;
    }
    // add a const method perimeter here
};

void describe(const Rect& r) {
    cout << "Area: " << r.area() << endl;
    // print the perimeter on the next line
}

int main() {
    Rect r = {};
    cin >> r.w >> r.h;
    describe(r);
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

struct Rect {
    int w;
    int h;
    int area() const {
        return w * h;
    }
    int perimeter() const {
        return 2 * (w + h);
    }
};

void describe(const Rect& r) {
    cout << "Area: " << r.area() << endl;
    cout << "Perimeter: " << r.perimeter() << endl;
}

int main() {
    Rect r = {};
    cin >> r.w >> r.h;
    describe(r);
    return 0;
}`,
    require: [{ pattern: 'perimeter\\s*\\(\\s*\\)\\s*const', message: 'Mark perimeter as const' }],
    tests: [
      { name: '3 by 4', stdin: '3 4\n', expected: 'Area: 12\nPerimeter: 14' },
      { name: 'Square', stdin: '5 5\n', expected: 'Area: 25\nPerimeter: 20' },
      { name: 'Thin', stdin: '1 9\n', expected: 'Area: 9\nPerimeter: 20' },
    ],
  },

  // 5. fix: calling a non-const method through const&
  {
    id: 'c6-fix-const-method',
    title: 'A method that is not const',
    kind: 'fix',
    task: 'This does not compile. Fix it so it prints <em>Count: 2</em>. Keep <code>report</code> taking a <code>const Counter&amp;</code>.',
    errorMatch: 'argument to member function',
    gloss: '<code>report</code> only has a read-only view of the counter, but <code>value</code> has not promised to leave it alone, so the compiler refuses the call.',
    introduces: [],
    refresher: [
      'A <code>const &amp;</code> parameter can only call methods that are marked <code>const</code>.',
      'Put <code>const</code> after the parameter list of every method that only reads: <code>int value() const { ... }</code>.',
    ],
    hints: [
      'The error says which method is "not marked const". Find it in the struct.',
      'Add <code>const</code> between the closing parenthesis of <code>value()</code> and its opening brace.',
    ],
    inPython: {
      code: C`class Counter:
    def __init__(self):
        self.n = 0

    def bump(self):
        self.n += 1

    def value(self):
        return self.n

c = Counter()
c.bump()
c.bump()
print("Count:", c.value())`,
      note: 'Python has no read-only views, so any method can be called anywhere. C++ lets <code>const</code> separate the methods that read from those that change.',
    },
    starter: C`#include <iostream>
using namespace std;

struct Counter {
    int n;
    int value() { return n; }
    void bump() { n = n + 1; }
};

void report(const Counter& c) {
    cout << "Count: " << c.value() << endl;
}

int main() {
    Counter c = {0};
    c.bump();
    c.bump();
    report(c);
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

struct Counter {
    int n;
    int value() const { return n; }
    void bump() { n = n + 1; }
};

void report(const Counter& c) {
    cout << "Count: " << c.value() << endl;
}

int main() {
    Counter c = {0};
    c.bump();
    c.bump();
    report(c);
    return 0;
}`,
    require: [{ pattern: 'report\\s*\\(\\s*const\\s+Counter\\s*&', message: 'Keep report taking const Counter&' }],
    tests: [{ name: 'Prints Count: 2', stdin: '', expected: 'Count: 2' }],
  },

  // 6. class, public and private
  {
    id: 'c6-class-private',
    title: 'class, public and private',
    kind: 'concept',
    task: 'A <code>Volume</code> must stay between 0 and 10. Make <code>setLevel</code> clamp the value it is given, so every level the program prints is within that range.',
    introduces: ['class', 'access-spec'],
    teach: {
      body: [
        `<p>A <code>class</code> is a struct with one difference: in a struct everything is <em>public</em>, so any code can touch any field; in a class everything is <em>private</em> by default, so only the class's own methods can. Everything else works the same, with fields, methods and <code>const</code> methods.</p>`,
        `<p>You open up what should be visible with a label: <code>public:</code> switches to public, and everything after it stays public until another label. <code>private:</code> switches back. The point is protection. If <code>level</code> is private, the only way to change it is through a method such as <code>setLevel</code>, and that method can refuse bad values. The object keeps its own rules.</p>`,
        `<p>Python has the same idea as a polite request: a name starting with <code>_</code>, as in <code>self._level</code>, means "please do not touch". Nothing enforces it. C++ does: touching a private field from outside the class is a compile error. The usual style is a <code>struct</code> for a plain bundle of data and a <code>class</code> when the type has rules to protect.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

class Thermostat {
    int target;                 // private: a class starts out private
public:                         // everything below is open to everyone
    void setTarget(int t) {
        if (t < 10) {           // the class enforces its own rule
            t = 10;
        }
        target = t;
    }
    int getTarget() const {
        return target;
    }
};

int main() {
    Thermostat t;
    t.setTarget(3);
    cout << t.getTarget() << endl;   // 10, not 3
    return 0;
}`,
          output: '10',
          caption: 'A private field changed only through a method that checks it.',
        },
        {
          code: C`#include <iostream>
using namespace std;

class Door {
private:                        // you may also write the label out loud
    bool locked;
public:
    void lock() { locked = true; }
    void unlock() { locked = false; }
    bool isLocked() const { return locked; }
};

int main() {
    Door d;
    d.lock();
    cout << d.isLocked() << endl;
    return 0;
}`,
          output: '1',
          caption: 'Both labels written out.',
        },
      ],
      terms: [
        { code: 'class Name { ... };', meaning: 'like a struct, but everything is private until you say otherwise' },
        { code: 'public:', meaning: 'the members after this label can be used from anywhere' },
        { code: 'private:', meaning: 'the members after this label can only be used by the class\'s own methods' },
      ],
    },
    compare: {
      py: { code: C`class Volume:
    def __init__(self):
        self._level = 0

v = Volume()
v._level = 99        # the underscore is only a request
print(v._level)`, outcome: 'Prints 99; nothing stops you', ok: true },
      cpp: { code: C`class Volume {
    int level;
};
Volume v;
v.level = 99;`, outcome: 'Compile error: level is private', ok: false, errorMatch: 'is a private member' },
      text: 'Python\'s leading underscore is a convention that anyone can ignore. C++ makes the compiler refuse access to private members.',
    },
    refresher: [
      'In a <code>class</code> everything is private until a <code>public:</code> label; in a <code>struct</code> everything is public.',
      'Keep fields private and let public methods check any value before storing it.',
    ],
    hints: [
      'The rule is 0 at the lowest and 10 at the highest. Change the value before storing it.',
      'Two <code>if</code> statements on <code>v</code> (below 0, above 10) before <code>level = v;</code> do it.',
    ],
    inPython: {
      code: C`class Volume:
    def __init__(self):
        self._level = 0

    def set_level(self, v):
        self._level = max(0, min(10, v))

    def get_level(self):
        return self._level

vol = Volume()
vol.set_level(12)
print(vol.get_level())`,
      note: 'The same clamping method works in Python, but the leading underscore alone cannot stop outside code from writing <code>vol._level = 99</code>.',
    },
    starter: C`#include <iostream>
using namespace std;

class Volume {
    int level;
public:
    void setLevel(int v) {
        level = v;
    }
    int getLevel() const {
        return level;
    }
};

int main() {
    Volume vol;
    int x;
    while (cin >> x) {
        vol.setLevel(x);
        cout << vol.getLevel() << endl;
    }
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

class Volume {
    int level;
public:
    void setLevel(int v) {
        if (v < 0) {
            v = 0;
        }
        if (v > 10) {
            v = 10;
        }
        level = v;
    }
    int getLevel() const {
        return level;
    }
};

int main() {
    Volume vol;
    int x;
    while (cin >> x) {
        vol.setLevel(x);
        cout << vol.getLevel() << endl;
    }
    return 0;
}`,
    require: [{ pattern: 'class\\s+Volume', message: 'Keep Volume a class' }],
    tests: [
      { name: 'Too high and too low', stdin: '5 12 -3\n', expected: '5\n10\n0' },
      { name: 'Edges stay as they are', stdin: '0 10\n', expected: '0\n10' },
      { name: 'Way over', stdin: '10 11 500\n', expected: '10\n10\n10' },
    ],
  },

  // 7. fix: private access
  {
    id: 'c6-fix-private',
    title: 'Reaching a private field',
    kind: 'fix',
    task: 'This does not compile. It should print <em>15</em>. Fix it without making <code>coins</code> public.',
    errorMatch: 'is a private member',
    gloss: 'The line <code>j.coins = ...</code> is outside the class, and <code>coins</code> is private, so only the class\'s own methods may touch it.',
    introduces: [],
    refresher: [
      'Private members can only be used inside the class\'s own methods. Outside code must go through a public method.',
      'The error names the private member and the class that owns it.',
    ],
    hints: [
      'The class already offers a public method that adds to the coins.',
      'Replace the whole assignment with a call to <code>add</code>.',
    ],
    inPython: {
      code: C`class Jar:
    def __init__(self):
        self.coins = 0

    def load(self, n):
        self.coins = n

    def add(self, n):
        self.coins += n

j = Jar()
j.load(10)
j.add(5)
print(j.coins)`,
      note: 'Python would let any code write <code>j.coins</code> directly. C++ refuses when the member is private, which forces the public methods to be used.',
    },
    starter: C`#include <iostream>
using namespace std;

class Jar {
    int coins;
public:
    void load(int n) { coins = n; }
    void add(int n) { coins = coins + n; }
    int total() const { return coins; }
};

int main() {
    Jar j;
    j.load(10);
    j.coins = j.coins + 5;
    cout << j.total() << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

class Jar {
    int coins;
public:
    void load(int n) { coins = n; }
    void add(int n) { coins = coins + n; }
    int total() const { return coins; }
};

int main() {
    Jar j;
    j.load(10);
    j.add(5);
    cout << j.total() << endl;
    return 0;
}`,
    require: [{ pattern: 'j\\.load\\(10\\)', message: 'Keep loading the jar with 10' }],
    forbidden: [{ pattern: 'public:\\s*int\\s+coins', message: 'Do not make coins public' }],
    tests: [{ name: 'Prints 15', stdin: '', expected: '15' }],
  },

  // 8. constructors
  {
    id: 'c6-constructors',
    title: 'Constructors',
    kind: 'concept',
    task: 'Give <code>Player</code> a constructor that takes a name and a starting health. Read both from the input, make a <code>Player</code> with them, and call <code>print</code>.',
    introduces: ['constructor'],
    teach: {
      body: [
        `<p>A <em>constructor</em> is the code that runs when an object is created, like Python's <code>__init__</code>. It is a method with the <em>same name as the class</em> and <em>no return type</em>, not even <code>void</code>. You pass its arguments in parentheses where you declare the object: <code>Account a(100);</code> creates an <code>Account</code> and runs the constructor with 100.</p>`,
        `<p>Why bother? Without a constructor, a new object's number fields hold garbage until you set them. A constructor makes it impossible to create a half-built object: if every constructor needs a name, nobody can make a <code>Player</code> without one. The constructor also runs <em>before</em> anyone can call a method on the object, so methods can rely on the fields being ready.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

class Account {
    int balance;
public:
    Account(int start) {          // the constructor: class name, no return type
        balance = start;
    }
    void deposit(int n) { balance = balance + n; }
    int getBalance() const { return balance; }
};

int main() {
    Account a(100);               // the constructor runs here with start = 100
    a.deposit(25);
    cout << a.getBalance() << endl;
    return 0;
}`,
          output: '125',
          caption: 'A constructor with one parameter.',
        },
        {
          code: C`#include <iostream>
#include <string>
using namespace std;

class Greeter {
    string name;
public:
    Greeter(string n) {
        name = n;
    }
    void hello() const {
        cout << "Hi, " << name << endl;
    }
};

int main() {
    Greeter g("Ada");
    g.hello();
    return 0;
}`,
          output: 'Hi, Ada',
          caption: 'The argument can be any type, such as a string.',
        },
      ],
      terms: [
        { code: 'Name(params) { ... }', meaning: 'a constructor: same name as the class, no return type' },
        { code: 'Name obj(args);', meaning: 'creates an object and runs the constructor with those arguments' },
      ],
    },
    compare: {
      py: { code: C`class Account:
    def __init__(self, start):
        self.balance = start

a = Account(100)
print(a.balance)`, outcome: 'Prints 100', ok: true },
      cpp: { code: C`class Account {
    int balance;
public:
    Account(int start) { balance = start; }
    int getBalance() const { return balance; }
};
Account a(100);
cout << a.getBalance() << endl;`, outcome: 'Prints 100; the constructor has no return type', ok: true },
      text: 'Python\'s <code>__init__</code> is an ordinary method with a special name. A C++ constructor is named after the class and has no return type.',
    },
    refresher: [
      'A constructor has the class\'s name and no return type: <code>Player(string n, int h) { ... }</code>. Create with <code>Player p(name, hp);</code>.',
      'It runs once, when the object is created, before any method.',
    ],
    hints: [
      'Inside <code>public:</code>, write <code>Player(string n, int h)</code> and assign <code>name</code> and <code>hp</code> in its body.',
      'In <code>main</code>, declare <code>Player p(name, hp);</code> and then call <code>p.print();</code>.',
    ],
    inPython: {
      code: C`class Player:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def print(self):
        print(self.name, "has", self.hp, "hp")

Player("Ada", 30).print()`,
      note: 'Same shape as <code>__init__</code>. C++ calls the constructor by the class name and gives it no <code>self</code> and no return type.',
    },
    starter: C`#include <iostream>
#include <string>
using namespace std;

class Player {
    string name;
    int hp;
public:
    // write a constructor taking a name and a starting health

    void print() const {
        cout << name << " has " << hp << " hp" << endl;
    }
};

int main() {
    string name;
    int hp;
    cin >> name >> hp;
    // make a Player from them and print it
    return 0;
}`,
    solution: C`#include <iostream>
#include <string>
using namespace std;

class Player {
    string name;
    int hp;
public:
    Player(string n, int h) {
        name = n;
        hp = h;
    }

    void print() const {
        cout << name << " has " << hp << " hp" << endl;
    }
};

int main() {
    string name;
    int hp;
    cin >> name >> hp;
    Player p(name, hp);
    p.print();
    return 0;
}`,
    require: [{ pattern: 'Player\\s*\\(\\s*string\\s+\\w+\\s*,\\s*int\\s+\\w+\\s*\\)', message: 'Write the constructor Player(string, int)' }],
    tests: [
      { name: 'Ada', stdin: 'Ada 30\n', expected: 'Ada has 30 hp' },
      { name: 'Zero health', stdin: 'Bo 0\n', expected: 'Bo has 0 hp' },
      { name: 'Another name', stdin: 'Grace 100\n', expected: 'Grace has 100 hp' },
    ],
  },

  // 9. member initialiser lists
  {
    id: 'c6-init-list',
    title: 'Member initialiser lists',
    kind: 'concept',
    task: 'This does not compile: <code>maxHp</code> is a <code>const</code> member and cannot be assigned in the body. Rewrite the constructor with an initialiser list that sets <code>name</code>, <code>hp</code> and <code>maxHp</code> (always 100).',
    introduces: ['init-list'],
    teach: {
      body: [
        `<p>When a constructor starts, every field of the object <em>already exists</em>, created in the order the fields are declared. Assigning in the body, as in the last lesson, creates each field with a leftover value and then overwrites it. A <em>member initialiser list</em> sets each field directly as it is created. It goes between the parentheses and the body: <code>Player(string n, int h) : name(n), hp(h) { }</code>. After the colon you write <code>field(value)</code> for each field, separated by commas. The body can then be empty.</p>`,
        `<p>Sometimes the list is not just tidier but required. A <code>const</code> field must be given its value at the moment it is created, and an assignment in the body is too late, so the compiler rejects it. The same goes for reference fields. One more detail: the fields are always initialised in the order they are <em>declared</em> in the class, whatever order you list them, so list them in declaration order to avoid surprises.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

class Account {
    int balance;
public:
    Account(int start) : balance(start) { }   // balance is set as it is created
    int getBalance() const { return balance; }
};

int main() {
    Account a(40);
    cout << a.getBalance() << endl;
    return 0;
}`,
          output: '40',
          caption: 'The same as assigning in the body, written as a list.',
        },
        {
          code: C`#include <iostream>
using namespace std;

class Ticket {
    const int id;                 // a const field: it can never be assigned
    int price;
public:
    Ticket(int i, int p) : id(i), price(p) { }   // the only way to give id a value
    int getId() const { return id; }
    int getPrice() const { return price; }
};

int main() {
    Ticket t(7, 20);
    cout << t.getId() << " " << t.getPrice() << endl;
    return 0;
}`,
          output: '7 20',
          caption: 'A const field must be set in the list.',
        },
      ],
      terms: [
        { code: 'Name(...) : a(x), b(y) { }', meaning: 'a constructor with an initialiser list: each field is set as it is created' },
        { code: 'const int id;', meaning: 'a field that can only get its value in the initialiser list' },
      ],
    },
    compare: {
      py: { code: C`class Ticket:
    def __init__(self, i, p):
        self.id = i
        self.price = p

t = Ticket(7, 20)
print(t.id, t.price)`, outcome: 'Prints 7 20; assigned in the body', ok: true },
      cpp: { code: C`class Ticket {
    const int id;
    int price;
public:
    Ticket(int i, int p) : id(i), price(p) { }
    int getId() const { return id; }
    int getPrice() const { return price; }
};
Ticket t(7, 20);
cout << t.getId() << " " << t.getPrice() << endl;`, outcome: 'Prints 7 20; set in the initialiser list', ok: true },
      text: 'Python builds the object and then assigns attributes in the body. C++ can set each field as it is created, which const and reference fields need.',
    },
    refresher: [
      '<code>Name(int a) : x(a), y(0) { }</code>: after the colon, <code>field(value)</code> for each field, in declaration order.',
      'A <code>const</code> field can only be given its value in the initialiser list.',
    ],
    hints: [
      'Put a colon after the closing parenthesis of the constructor and list all three fields.',
      'The body becomes empty: <code>: name(n), hp(h), maxHp(100) { }</code>.',
    ],
    inPython: {
      code: C`class Player:
    MAX_HP = 100

    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

p = Player("Ada", 30)
print(p.name, str(p.hp) + "/" + str(Player.MAX_HP))`,
      note: 'Python has no way to forbid reassigning an attribute, so it has nothing like a const field that must be set at creation.',
    },
    starter: C`#include <iostream>
#include <string>
using namespace std;

class Player {
    string name;
    int hp;
    const int maxHp;
public:
    Player(string n, int h) {
        name = n;
        hp = h;
        // maxHp is const: it cannot be assigned here
    }

    void print() const {
        cout << name << " " << hp << "/" << maxHp << endl;
    }
};

int main() {
    string name;
    int hp;
    cin >> name >> hp;
    Player p(name, hp);
    p.print();
    return 0;
}`,
    solution: C`#include <iostream>
#include <string>
using namespace std;

class Player {
    string name;
    int hp;
    const int maxHp;
public:
    Player(string n, int h) : name(n), hp(h), maxHp(100) {
    }

    void print() const {
        cout << name << " " << hp << "/" << maxHp << endl;
    }
};

int main() {
    string name;
    int hp;
    cin >> name >> hp;
    Player p(name, hp);
    p.print();
    return 0;
}`,
    require: [{ pattern: '\\)\\s*:\\s*name\\s*\\(', message: 'Use an initialiser list starting with name(...)' }],
    tests: [
      { name: 'Ada', stdin: 'Ada 30\n', expected: 'Ada 30/100' },
      { name: 'Full health', stdin: 'Bo 100\n', expected: 'Bo 100/100' },
      { name: 'Zero', stdin: 'Cy 0\n', expected: 'Cy 0/100' },
    ],
  },

  // 10. default constructors
  {
    id: 'c6-default-ctor',
    title: 'Default constructors',
    kind: 'concept',
    task: 'The program makes <code>Score total(0);</code>. Add a constructor with no parameters that starts the score at 0, and change <code>main</code> to simply write <code>Score total;</code>.',
    introduces: [],
    teach: {
      body: [
        `<p>A constructor that takes no arguments is the <em>default constructor</em>. It is the one that runs for <code>Score total;</code>, an object declared with no parentheses and no values. Python gets the same effect with default arguments, such as <code>def __init__(self, start=0)</code>.</p>`,
        `<p>Here is the catch. If you write <em>no</em> constructors, the compiler supplies a default one that does nothing, which leaves number fields as garbage. But the moment you write <em>any</em> constructor, the compiler stops supplying it. A class with only <code>Score(int start)</code> then has no way to build <code>Score total;</code>, and you get a "no matching constructor" error. Add your own: <code>Score() : value(0) { }</code>.</p>`,
        `<p>A class can have several constructors, told apart by their parameters, just like overloaded functions from stage 3. One trap: write <code>Score total;</code>, <em>without</em> empty parentheses. <code>Score total();</code> does not make an object; the compiler reads it as the declaration of a function named <code>total</code>.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

class Light {
    int level;
public:
    Light() : level(0) { }              // default constructor: no parameters
    Light(int l) : level(l) { }         // another constructor, picked when you pass an int
    int get() const { return level; }
};

int main() {
    Light a;                            // runs Light()
    Light b(7);                         // runs Light(int)
    cout << a.get() << " " << b.get() << endl;
    return 0;
}`,
          output: '0 7',
          caption: 'Two constructors; the arguments pick which one runs.',
        },
      ],
      terms: [
        { code: 'Name() : x(0) { }', meaning: 'the default constructor, used for Name obj;' },
        { code: 'Name obj;', meaning: 'creates an object with the default constructor (no parentheses)' },
      ],
    },
    compare: {
      py: { code: C`class Score:
    def __init__(self, start=0):
        self.value = start

a = Score()
b = Score(5)
print(a.value, b.value)`, outcome: 'Prints 0 5; one __init__ with a default', ok: true },
      cpp: { code: C`class Score {
    int value;
public:
    Score() : value(0) { }
    Score(int start) : value(start) { }
    int get() const { return value; }
};
Score a;
Score b(5);
cout << a.get() << " " << b.get() << endl;`, outcome: 'Prints 0 5; two constructors', ok: true },
      text: 'Python covers both calls with one <code>__init__</code> and a default argument. C++ usually writes two constructors, and the one with no parameters is the default.',
    },
    refresher: [
      'The default constructor has no parameters, runs for <code>Name obj;</code>, and is only provided for you while you write no constructors.',
      'Write <code>Name obj;</code> without parentheses; <code>Name obj();</code> declares a function instead.',
    ],
    hints: [
      'Add <code>Score() : value(0) { }</code> next to the other constructor.',
      'Then change the declaration in <code>main</code> to <code>Score total;</code>.',
    ],
    inPython: {
      code: C`class Score:
    def __init__(self, start=0):
        self.value = start

    def add(self, n):
        self.value += n

total = Score()
for x in [1, 2, 3]:
    total.add(x)
print(total.value)`,
      note: 'One <code>__init__</code> with <code>start=0</code> serves both <code>Score()</code> and <code>Score(5)</code>. C++ writes a separate default constructor.',
    },
    starter: C`#include <iostream>
using namespace std;

class Score {
    int value;
public:
    Score(int start) : value(start) { }
    void add(int n) { value = value + n; }
    int get() const { return value; }
};

int main() {
    Score total(0);
    int x;
    while (cin >> x) {
        total.add(x);
    }
    cout << total.get() << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

class Score {
    int value;
public:
    Score() : value(0) { }
    Score(int start) : value(start) { }
    void add(int n) { value = value + n; }
    int get() const { return value; }
};

int main() {
    Score total;
    int x;
    while (cin >> x) {
        total.add(x);
    }
    cout << total.get() << endl;
    return 0;
}`,
    require: [
      { pattern: 'Score\\s*\\(\\s*\\)', message: 'Write a constructor Score() with no parameters' },
      { pattern: 'Score\\s+total\\s*;', message: 'Declare the score as Score total;' },
    ],
    tests: [
      { name: 'Three numbers', stdin: '1 2 3\n', expected: '6' },
      { name: 'No numbers', stdin: '', expected: '0' },
      { name: 'Negative', stdin: '10 -4\n', expected: '6' },
    ],
  },

  // 11. fix: no default constructor
  {
    id: 'c6-fix-no-default',
    title: 'No default constructor',
    kind: 'fix',
    task: 'This does not compile. It should print <em>7</em>. Fix it.',
    errorMatch: 'no matching constructor',
    gloss: '<code>Pair</code> has a constructor that needs two numbers, so the compiler no longer provides one that takes none, and <code>Pair p;</code> has nothing to call.',
    introduces: [],
    refresher: [
      'As soon as a class has any constructor, the compiler stops writing a default one for you.',
      'Either give the object the arguments its constructor needs, or write a constructor with no parameters.',
    ],
    hints: [
      'Look at the constructor <code>Pair</code> has, and at how <code>p</code> is declared in <code>main</code>.',
      'Pass 3 and 4 when you declare <code>p</code>: <code>Pair p(3, 4);</code>.',
    ],
    inPython: {
      code: C`class Pair:
    def __init__(self, x, y):
        self.a = x
        self.b = y

    def total(self):
        return self.a + self.b

p = Pair(3, 4)
print(p.total())`,
      note: 'Python raises a <code>TypeError</code> only when <code>Pair()</code> runs. C++ finds the missing constructor before the program is built.',
    },
    starter: C`#include <iostream>
using namespace std;

class Pair {
    int a;
    int b;
public:
    Pair(int x, int y) : a(x), b(y) { }
    int total() const { return a + b; }
};

int main() {
    Pair p;
    cout << p.total() << endl;
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

class Pair {
    int a;
    int b;
public:
    Pair(int x, int y) : a(x), b(y) { }
    int total() const { return a + b; }
};

int main() {
    Pair p(3, 4);
    cout << p.total() << endl;
    return 0;
}`,
    require: [{ pattern: 'class\\s+Pair', message: 'Keep the class Pair' }],
    tests: [{ name: 'Prints 7', stdin: '', expected: '7' }],
  },

  // 12. destructors
  {
    id: 'c6-destructors',
    title: 'Destructors',
    kind: 'concept',
    task: '<code>Guard</code> prints <em>open ...</em> when it is made. Add a destructor that prints <em>close ...</em> with the same name, and watch the order in which the two guards close.',
    introduces: ['destructor'],
    teach: {
      body: [
        `<p>A <em>destructor</em> is the mirror image of a constructor: code that runs automatically when an object is destroyed. It has the class's name with a tilde in front, <code>~Guard()</code>, and no parameters and no return type. C++ destroys an object <em>exactly</em> when the scope it was declared in ends, which means at the closing brace <code>}</code> of that block, and it destroys the objects of a scope in <em>reverse</em> order of creation, last made, first destroyed.</p>`,
        `<p>Python has <code>__del__</code>, but it runs when the garbage collector gets round to it, and that is not guaranteed to be at a predictable moment. In C++ the moment is fixed and visible in the code. That is the whole point: a destructor is the place to <em>give things back</em>, such as closing a connection or freeing memory (the next lesson).</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
#include <string>
using namespace std;

class Noisy {
    string name;
public:
    Noisy(string n) : name(n) { cout << "make " << name << endl; }
    ~Noisy() { cout << "drop " << name << endl; }     // runs when the object dies
};

int main() {
    Noisy a("A");
    {
        Noisy b("B");
        cout << "inside" << endl;
    }                               // b dies here
    cout << "after" << endl;
    return 0;
}                                   // a dies here`,
          output: 'make A\nmake B\ninside\ndrop B\nafter\ndrop A',
          caption: 'Each object is dropped at the end of its own block.',
        },
      ],
      terms: [
        { code: '~Name() { ... }', meaning: 'the destructor: runs automatically when the object goes out of scope' },
        { code: 'reverse order', meaning: 'objects in one scope are destroyed last-made first' },
      ],
    },
    compare: {
      py: { code: C`class Guard:
    def __init__(self, name):
        self.name = name
        print("open", name)

    def __del__(self):
        print("close", self.name)

def work():
    g = Guard("a")
    print("work")

work()
print("done")`, outcome: 'CPython closes at once; other runtimes may not', ok: true },
      cpp: { code: C`class Guard {
    string name;
public:
    Guard(string n) : name(n) { cout << "open " << n << endl; }
    ~Guard() { cout << "close " << name << endl; }
};
void work() {
    Guard g("a");
    cout << "work" << endl;
}
int main() {
    work();
    cout << "done" << endl;
    return 0;
}`, outcome: 'Always closes at the end of work()', ok: true },
      text: 'Python\'s <code>__del__</code> depends on the interpreter\'s memory management. A C++ destructor is guaranteed to run at the closing brace of the scope.',
    },
    refresher: [
      '<code>~Name() { ... }</code> runs when the object leaves its scope. Objects of one scope are destroyed in reverse order of creation.',
      'A destructor takes no parameters and has no return type.',
    ],
    hints: [
      'The destructor sits next to the constructor, with a <code>~</code> before the class name.',
      'Print <code>"close "</code>, then the name, then <code>endl</code>.',
    ],
    inPython: {
      code: C`class Guard:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print("open", self.name)
        return self

    def __exit__(self, *args):
        print("close", self.name)

with Guard("x"):
    print("work")`,
      note: 'Python\'s <code>with</code> block gives the same guaranteed cleanup, but you must ask for it each time. A C++ destructor runs for every object, always.',
    },
    starter: C`#include <iostream>
#include <string>
using namespace std;

class Guard {
    string name;
public:
    Guard(string n) : name(n) {
        cout << "open " << name << endl;
    }
    // add a destructor that prints "close " and the name
};

int main() {
    string a, b;
    cin >> a >> b;
    Guard g1(a);
    {
        Guard g2(b);
        cout << "work" << endl;
    }
    cout << "done" << endl;
    return 0;
}`,
    solution: C`#include <iostream>
#include <string>
using namespace std;

class Guard {
    string name;
public:
    Guard(string n) : name(n) {
        cout << "open " << name << endl;
    }
    ~Guard() {
        cout << "close " << name << endl;
    }
};

int main() {
    string a, b;
    cin >> a >> b;
    Guard g1(a);
    {
        Guard g2(b);
        cout << "work" << endl;
    }
    cout << "done" << endl;
    return 0;
}`,
    require: [{ pattern: '~\\s*Guard\\s*\\(\\s*\\)', message: 'Write the destructor ~Guard()' }],
    tests: [
      { name: 'x and y', stdin: 'x y\n', expected: 'open x\nopen y\nwork\nclose y\ndone\nclose x' },
      { name: 'Other names', stdin: 'db log\n', expected: 'open db\nopen log\nwork\nclose log\ndone\nclose db' },
      { name: 'Same name twice', stdin: 'a a\n', expected: 'open a\nopen a\nwork\nclose a\ndone\nclose a' },
    ],
  },

  // 13. RAII: a class that owns memory
  {
    id: 'c6-raii-buffer',
    title: 'A class that owns memory',
    kind: 'concept',
    task: 'Finish <code>IntBuffer</code>. Its constructor must allocate <code>n</code> ints with <code>new</code> and set every one to 0, and a destructor must release them with <code>delete[]</code>.',
    introduces: [],
    teach: {
      body: [
        `<p>In stage 5 you paired every <code>new</code> with a <code>delete</code> by hand, and forgetting one leaks memory. Constructors and destructors remove the chore. If the constructor does the <code>new</code> and the destructor does the <code>delete</code>, the memory is released automatically, exactly when the object goes out of scope, on every path out of the block. This idea is called <em>RAII</em> (Resource Acquisition Is Initialisation): an object <em>owns</em> a resource, acquires it when it is built and releases it when it dies.</p>`,
        `<p>Python needs none of this because the garbage collector frees memory when nothing refers to it. C++ has no collector, so RAII is how well-written C++ stays safe. You have already been using it: <code>vector</code> and <code>string</code> are classes that allocate in their constructors and free in their destructors, and so is <code>unique_ptr</code> from stage 5.</p>`,
        `<p>The tests for this lesson cannot see a leak, so the checker looks for the <code>delete[]</code> in your code. The class below also holds a raw pointer, x: copying such an object.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

class Table {
    int* cells;                               // points at an array on the heap
    int n;
public:
    Table(int size) : cells(new int[size]), n(size) {   // acquire in the constructor
        for (int i = 0; i < n; i++) {
            cells[i] = i * i;
        }
    }
    ~Table() {
        delete[] cells;                       // release in the destructor
    }
    int get(int i) const { return cells[i]; }
};

int main() {
    long long total = 0;
    for (int round = 0; round < 3; round++) {
        Table t(100);                         // allocated here
        total = total + t.get(9);
    }                                         // freed here, automatically, every round
    cout << total << endl;
    return 0;
}`,
          output: '243',
          caption: 'The constructor allocates; the destructor frees.',
        },
      ],
      terms: [
        { code: 'Name(int n) : p(new int[n])', meaning: 'the constructor acquires the memory' },
        { code: '~Name() { delete[] p; }', meaning: 'the destructor releases it when the object dies' },
        { code: 'RAII', meaning: 'the object owns a resource: acquire in the constructor, release in the destructor' },
      ],
    },
    compare: {
      py: { code: C`def make():
    data = [0] * 1000
    return len(data)

print(make())`, outcome: 'Memory is freed by the garbage collector', ok: true },
      cpp: { code: C`class Buffer {
    int* data;
public:
    Buffer(int n) : data(new int[n]) { }
    ~Buffer() { delete[] data; }
};
Buffer b(1000);`, outcome: 'Freed when b goes out of scope (RAII)', ok: true },
      text: 'Python frees memory with a garbage collector that you cannot see. C++ frees it in a destructor that you wrote, at a moment you can read off the code.',
    },
    refresher: [
      'Allocate with <code>new int[n]</code> in the constructor, release with <code>delete[]</code> in the destructor.',
      'A new array of ints is not zeroed: set each element to 0 with a loop.',
    ],
    hints: [
      'The starter allocates the array but never fills it, and has no destructor.',
      'Loop <code>i</code> from 0 to <code>len - 1</code> setting <code>data[i] = 0;</code>, and add <code>~IntBuffer() { delete[] data; }</code>.',
    ],
    inPython: {
      code: C`class IntBuffer:
    def __init__(self, n):
        self.data = [0] * n

    def put(self, i, v):
        self.data[i] = v

    def get(self, i):
        return self.data[i]

b = IntBuffer(4)
b.put(1, 7)
print(b.get(1))`,
      note: 'The Python list owns and frees its own memory. In C++ the class owns the array, so it must write the cleanup itself.',
    },
    starter: C`#include <iostream>
using namespace std;

class IntBuffer {
    int* data;
    int len;
public:
    IntBuffer(int n) : data(new int[n]), len(n) {
        // set every element to 0
    }
    // add a destructor that frees the array

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
        IntBuffer b(4);
        cout << b.size() << " " << b.get(3) << endl;
    }
    cout << "\n@@TEST 2@@" << endl;
    {
        IntBuffer b(5);
        b.put(1, 7);
        b.put(4, 9);
        cout << b.get(1) + b.get(4) << endl;
    }
    cout << "\n@@TEST 3@@" << endl;
    {
        IntBuffer a(2);
        IntBuffer b(3);
        a.put(0, 1);
        b.put(0, 2);
        cout << a.get(0) << b.get(0) << a.size() << b.size() << endl;
    }
    return 0;
}`,
    require: [
      { pattern: '~\\s*IntBuffer\\s*\\(\\s*\\)', message: 'Write the destructor ~IntBuffer()' },
      { pattern: 'delete\\s*\\[\\s*\\]\\s*data', message: 'Release the array with delete[] data' },
    ],
    tests: [
      { name: 'Size and zero fill', input: 'IntBuffer b(4)', expected: '4 0' },
      { name: 'Set and get', input: 'b.put(1, 7); b.put(4, 9)', expected: '16' },
      { name: 'Two independent buffers', input: 'IntBuffer a(2), b(3)', expected: '1223' },
    ],
  },
]
