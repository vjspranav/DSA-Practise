// C++ Learn lessons: stage 6 (part c), inheritance, virtual, templates and the closing practice lessons.
// Parts a and b come before it. stage-6-classes.js joins them.
// `C` is String.raw, so a C++ "\n" inside a code string stays two characters.
// Practice harnesses never copy objects (the classes here own no raw pointers), so no undefined behaviour is stored.

const C = String.raw

export const LESSONS = [
  // 20. inheritance
  {
    id: 'c6-inheritance',
    title: 'Inheritance',
    kind: 'concept',
    task: 'Write <code>class Dog</code> so that it inherits from <code>Animal</code>, passes its name to the base constructor, and has its own <code>fetch</code> method that prints <em>NAME fetches</em>. Then make a Dog and call both methods.',
    introduces: ['inheritance'],
    teach: {
      body: [
        `<p><em>Inheritance</em> lets a new class start from an existing one and add to it. Write the new class's name, a colon, <code>public</code>, and the base class: <code>class Dog : public Animal</code>. A <code>Dog</code> then has everything an <code>Animal</code> has (its fields and its methods) plus whatever you add. Python writes the same relation as <code>class Dog(Animal):</code>.</p>`,
        `<p>Building a <code>Dog</code> first builds its <code>Animal</code> part, so the base constructor must run. You choose its arguments in the initialiser list: <code>Dog(string n) : Animal(n) { }</code>, the counterpart of <code>super().__init__(n)</code>. If you say nothing, the compiler tries the base's default constructor, and fails if it has none.</p>`,
        `<p>One more label: <code>protected:</code>. A protected member is private to the outside world but visible to derived classes. A field marked <code>private</code> in <code>Animal</code> would be hidden even from <code>Dog</code>, so a field that subclasses need goes under <code>protected:</code>. (The <code>public</code> in <code>: public Animal</code> says the base's public methods stay public in the derived class; it is what you want almost always.)</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
#include <string>
using namespace std;

class Animal {
protected:                                   // visible to Animal and to classes derived from it
    string name;
public:
    Animal(string n) : name(n) { }
    void eat() const { cout << name << " eats" << endl; }
};

class Cat : public Animal {                  // a Cat is an Animal plus more
public:
    Cat(string n) : Animal(n) { }            // build the Animal part first
    void purr() const { cout << name << " purrs" << endl; }   // name is protected: allowed here
};

int main() {
    Cat c("Tom");
    c.eat();                                 // inherited from Animal
    c.purr();
    return 0;
}`,
          output: 'Tom eats\nTom purrs',
          caption: 'Cat gets eat() for free and adds purr().',
        },
      ],
      terms: [
        { code: 'class B : public A', meaning: 'B inherits everything public or protected from A' },
        { code: 'B(...) : A(args) { }', meaning: 'the base constructor is called in the initialiser list' },
        { code: 'protected:', meaning: 'visible inside the class and its derived classes, hidden outside' },
      ],
    },
    compare: {
      py: { code: C`class Animal:
    def __init__(self, name):
        self.name = name

    def eat(self):
        print(self.name, "eats")

class Cat(Animal):
    def __init__(self, name):
        super().__init__(name)

    def purr(self):
        print(self.name, "purrs")

c = Cat("Tom")
c.eat()
c.purr()`, outcome: 'Prints Tom eats, then Tom purrs', ok: true },
      cpp: { code: C`class Animal {
protected:
    string name;
public:
    Animal(string n) : name(n) { }
    void eat() const { cout << name << " eats" << endl; }
};
class Cat : public Animal {
public:
    Cat(string n) : Animal(n) { }
    void purr() const { cout << name << " purrs" << endl; }
};
Cat c("Tom");
c.eat();
c.purr();`, outcome: 'Same output; base called by name in the list', ok: true },
      text: 'Python lists the base in parentheses and calls <code>super().__init__</code>. C++ lists it after a colon and calls the base constructor in the initialiser list.',
    },
    refresher: [
      '<code>class Dog : public Animal</code> gives Dog all of Animal. Call the base constructor in the list: <code>Dog(string n) : Animal(n) { }</code>.',
      'A <code>protected:</code> field is hidden from outside code but visible in derived classes.',
    ],
    hints: [
      'Write <code>class Dog : public Animal { public: ... };</code> with a constructor and <code>fetch</code> inside.',
      '<code>name</code> is <code>protected</code>, so <code>fetch</code> can print it. In <code>main</code>, make <code>Dog d(name);</code> and call <code>d.speak();</code> then <code>d.fetch();</code>.',
    ],
    inPython: {
      code: C`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(self.name, "makes a sound")

class Dog(Animal):
    def fetch(self):
        print(self.name, "fetches")

d = Dog("Rex")
d.speak()
d.fetch()`,
      note: 'Python\'s <code>Dog</code> needs no <code>__init__</code> because it inherits the base one. In C++ constructors are not inherited, so <code>Dog</code> declares its own.',
    },
    starter: C`#include <iostream>
#include <string>
using namespace std;

class Animal {
protected:
    string name;
public:
    Animal(string n) : name(n) { }
    void speak() const {
        cout << name << " makes a sound" << endl;
    }
};

// write class Dog here

int main() {
    string name;
    cin >> name;
    // make a Dog and call speak() and fetch()
    return 0;
}`,
    solution: C`#include <iostream>
#include <string>
using namespace std;

class Animal {
protected:
    string name;
public:
    Animal(string n) : name(n) { }
    void speak() const {
        cout << name << " makes a sound" << endl;
    }
};

class Dog : public Animal {
public:
    Dog(string n) : Animal(n) { }
    void fetch() const {
        cout << name << " fetches" << endl;
    }
};

int main() {
    string name;
    cin >> name;
    Dog d(name);
    d.speak();
    d.fetch();
    return 0;
}`,
    require: [{ pattern: 'class\\s+Dog\\s*:\\s*public\\s+Animal', message: 'Write class Dog : public Animal' }],
    tests: [
      { name: 'Rex', stdin: 'Rex\n', expected: 'Rex makes a sound\nRex fetches' },
      { name: 'Another name', stdin: 'Fido\n', expected: 'Fido makes a sound\nFido fetches' },
      { name: 'Short name', stdin: 'Al\n', expected: 'Al makes a sound\nAl fetches' },
    ],
  },

  // 21. virtual and override
  {
    id: 'c6-virtual',
    title: 'virtual and override',
    kind: 'concept',
    task: 'The program should print <em>area: 12</em> and <em>area: 9</em> for a 3 by 4 rectangle and a square of side 3, but it prints 0 twice. Make <code>area</code> work through the <code>Shape&amp;</code> parameter.',
    introduces: ['virtual'],
    teach: {
      body: [
        `<p>A function that takes <code>const Animal&amp;</code> accepts a <code>Dog</code> too, because a Dog is an Animal. But which <code>speak</code> should run when the parameter's type is <code>Animal</code> and the object really is a <code>Dog</code>? By default, C++ decides from the <em>declared</em> type, so it runs the Animal version, even for a Dog. This is the opposite of Python, where the object's real class always decides.</p>`,
        `<p>To get Python's behaviour, mark the base method <code>virtual</code>. Then the choice is made when the program runs, from the real type of the object, and a derived class's own version wins. In the derived class, write <code>override</code> after the parameter list to say "I mean to replace a virtual method": the compiler then reports a mistake if nothing matches, for instance a typo or a missing <code>const</code>. Without <code>virtual</code> the method in Dog merely hides the Animal one.</p>`,
        `<p>One extra rule: a class meant to be a base for others should have a <code>virtual</code> destructor, <code>virtual ~Animal() { }</code>, so that deleting a Dog through an Animal pointer cleans up the whole Dog. We only pass references here, so it does not bite yet, but it is the habit to form.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
using namespace std;

class Animal {
public:
    virtual void speak() const {              // virtual: the real type decides at run time
        cout << "..." << endl;
    }
    virtual ~Animal() { }
};

class Dog : public Animal {
public:
    void speak() const override {             // override: check that this replaces a virtual method
        cout << "Woof" << endl;
    }
};

void talk(const Animal& a) {
    a.speak();                                // runs the Dog version for a Dog
}

int main() {
    Dog d;
    talk(d);
    return 0;
}`,
          output: 'Woof',
          caption: 'The Dog version runs through an Animal reference.',
        },
        {
          code: C`#include <iostream>
using namespace std;

class Plain {
public:
    void who() const { cout << "base" << endl; }      // not virtual
};

class Derived : public Plain {
public:
    void who() const { cout << "derived" << endl; }
};

void ask(const Plain& p) {
    p.who();
}

int main() {
    Derived d;
    ask(d);                                          // the declared type Plain decides
    return 0;
}`,
          output: 'base',
          caption: 'Without virtual, the declared type wins.',
        },
      ],
      terms: [
        { code: 'virtual void f() const', meaning: 'in the base class: derived versions are chosen by the real type at run time' },
        { code: 'void f() const override', meaning: 'in the derived class: replaces a virtual method, checked by the compiler' },
        { code: 'virtual ~Base() { }', meaning: 'a virtual destructor, for any class meant to be inherited from' },
      ],
    },
    compare: {
      py: { code: C`class Animal:
    def speak(self):
        print("...")

class Dog(Animal):
    def speak(self):
        print("Woof")

def talk(a):
    a.speak()

talk(Dog())`, outcome: 'Prints Woof; every method is virtual', ok: true },
      cpp: { code: C`class Animal {
public:
    virtual void speak() const { cout << "..." << endl; }
};
class Dog : public Animal {
public:
    void speak() const override { cout << "Woof" << endl; }
};
void talk(const Animal& a) {
    a.speak();
}
Dog d;
talk(d);`, outcome: 'Prints Woof, but only because of virtual', ok: true },
      text: 'In Python the real class of the object always picks the method. In C++ you opt in with <code>virtual</code>; without it the declared type picks.',
    },
    refresher: [
      'Mark the base method <code>virtual</code> so a call through a base reference runs the derived version.',
      'Write <code>override</code> after the parameter list in the derived class; the compiler then checks the signatures match.',
    ],
    hints: [
      'The base class <code>Shape</code> has <code>area()</code>, but without <code>virtual</code>, so <code>report</code> always runs that one.',
      'Add <code>virtual</code> in front of <code>int area() const</code> in <code>Shape</code>.',
    ],
    inPython: {
      code: C`class Shape:
    def area(self):
        return 0

class Rect(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h

    def area(self):
        return self.w * self.h

def report(s):
    print("area:", s.area())

report(Rect(3, 4))`,
      note: 'Python always uses the real type, so there is no keyword for this. C++ needs <code>virtual</code> on the base method.',
    },
    starter: C`#include <iostream>
using namespace std;

class Shape {
public:
    int area() const {
        return 0;
    }
};

class Rect : public Shape {
    int w;
    int h;
public:
    Rect(int w_, int h_) : w(w_), h(h_) { }
    int area() const {
        return w * h;
    }
};

class Square : public Shape {
    int side;
public:
    Square(int s) : side(s) { }
    int area() const {
        return side * side;
    }
};

void report(const Shape& sh) {
    cout << "area: " << sh.area() << endl;
}

int main() {
    int w, h;
    cin >> w >> h;
    Rect r(w, h);
    Square q(w);
    report(r);
    report(q);
    return 0;
}`,
    solution: C`#include <iostream>
using namespace std;

class Shape {
public:
    virtual int area() const {
        return 0;
    }
};

class Rect : public Shape {
    int w;
    int h;
public:
    Rect(int w_, int h_) : w(w_), h(h_) { }
    int area() const override {
        return w * h;
    }
};

class Square : public Shape {
    int side;
public:
    Square(int s) : side(s) { }
    int area() const override {
        return side * side;
    }
};

void report(const Shape& sh) {
    cout << "area: " << sh.area() << endl;
}

int main() {
    int w, h;
    cin >> w >> h;
    Rect r(w, h);
    Square q(w);
    report(r);
    report(q);
    return 0;
}`,
    require: [{ pattern: 'virtual\\s+int\\s+area', message: 'Mark Shape::area as virtual' }],
    tests: [
      { name: '3 by 4', stdin: '3 4\n', expected: 'area: 12\narea: 9' },
      { name: '5 by 1', stdin: '5 1\n', expected: 'area: 5\narea: 25' },
      { name: 'Side 6', stdin: '6 2\n', expected: 'area: 12\narea: 36' },
    ],
  },

  // 22. templates
  {
    id: 'c6-templates',
    title: 'Templates, a first look',
    kind: 'concept',
    task: 'Replace the int-only <code>maxOf</code> with a template, so the same function returns the larger of two ints, two doubles and two strings.',
    introduces: ['template', 'template-args'],
    teach: {
      body: [
        `<p>In Python, <code>def max_of(a, b)</code> works on numbers, strings or anything that supports <code>&lt;</code>, because Python never checks types before running (<em>duck typing</em>). A C++ function names its types, so <code>int maxOf(int a, int b)</code> works only for ints. Writing a copy per type would be silly, so C++ has <em>templates</em>: a function written once with a type placeholder.</p>`,
        `<p>Write <code>template &lt;typename T&gt;</code> above the function, then use <code>T</code> wherever the type goes: <code>T maxOf(T a, T b) { return a &lt; b ? b : a; }</code>. The compiler looks at each call and writes a real version for it: <code>maxOf(3, 9)</code> makes an <code>int</code> version, <code>maxOf(2.5, 1.5)</code> a <code>double</code> one. T is worked out from the arguments, or you can state it: <code>maxOf&lt;double&gt;(3, 4.5)</code>.</p>`,
        `<p>Everything is still checked, but at compile time rather than run time. Both arguments must give the same <code>T</code>, so <code>maxOf(1, 2.5)</code> is an error. A type with no <code>&lt;</code> is rejected the moment you call <code>maxOf</code> on it, instead of crashing in the middle of a run as it would in Python. You have already used templates: <code>vector&lt;int&gt;</code> is the template <code>vector</code> with <code>T</code> set to <code>int</code>. Classes can be templates as well.</p>`,
      ],
      examples: [
        {
          code: C`#include <iostream>
#include <string>
using namespace std;

template <typename T>              // T stands for "some type, chosen at each call"
T maxOf(T a, T b) {
    return a < b ? b : a;          // needs the type to support <
}

int main() {
    cout << maxOf(3, 9) << endl;                     // T is int
    cout << maxOf(2.5, 1.5) << endl;                 // T is double
    cout << maxOf(string("ant"), string("bee")) << endl;   // T is string
    cout << maxOf<double>(3, 4.5) << endl;           // T stated explicitly
    return 0;
}`,
          output: '9\n2.5\nbee\n4.5',
          caption: 'One function, written once, used with several types.',
        },
        {
          code: C`#include <iostream>
#include <string>
using namespace std;

template <typename T>
struct Box {                       // a template struct: a container for any one type
    T value;
    T twice() const { return value + value; }
};

int main() {
    Box<int> a = {21};
    Box<string> s = {"ab"};
    cout << a.twice() << " " << s.twice() << endl;
    return 0;
}`,
          output: '42 abab',
          caption: 'A template type: Box<int> and Box<string> are different types.',
        },
      ],
      terms: [
        { code: 'template <typename T>', meaning: 'the next function or class is written for any type T' },
        { code: 'T maxOf(T a, T b)', meaning: 'T is replaced by the real type at each call' },
        { code: 'maxOf<double>(a, b)', meaning: 'chooses T yourself instead of letting the compiler work it out' },
      ],
    },
    compare: {
      py: { code: C`def max_of(a, b):
    return b if a < b else a

print(max_of(3, 9), max_of("a", "b"))`, outcome: 'Prints 9 b; types are checked only while running', ok: true },
      cpp: { code: C`template <typename T>
T maxOf(T a, T b) {
    return a < b ? b : a;
}

cout << maxOf(3, 9) << " " << maxOf(string("a"), string("b")) << endl;`, outcome: 'Prints 9 b; each type is checked by the compiler', ok: true },
      text: 'Python\'s duck typing accepts anything that has <code>&lt;</code> and fails at run time if it does not. A template accepts the same types but fails at compile time.',
    },
    refresher: [
      '<code>template &lt;typename T&gt;</code> above a function lets you use <code>T</code> as a type; the compiler writes a version for each type you call it with.',
      'Both arguments must have the same <code>T</code>. State it yourself with <code>f&lt;double&gt;(...)</code> when it cannot be worked out.',
    ],
    hints: [
      'Put <code>template &lt;typename T&gt;</code> on the line above, then replace each <code>int</code> in the signature with <code>T</code>.',
      'The body <code>a &lt; b ? b : a</code> already works for any type that has <code>&lt;</code>.',
    ],
    inPython: {
      code: C`def max_of(a, b):
    return b if a < b else a

print(max_of(3, 9))
print(max_of(2.5, 1.5))
print(max_of("apple", "pear"))`,
      note: 'One Python function serves every type with no extra syntax. C++ gets the same reuse from a template, and checks the types before the program runs.',
    },
    starter: C`#include <iostream>
#include <string>
using namespace std;

int maxOf(int a, int b) {
    return a < b ? b : a;
}

int main() {
    int i1, i2;
    double d1, d2;
    string s1, s2;
    cin >> i1 >> i2 >> d1 >> d2 >> s1 >> s2;
    cout << maxOf(i1, i2) << endl;
    cout << maxOf(d1, d2) << endl;
    cout << maxOf(s1, s2) << endl;
    return 0;
}`,
    solution: C`#include <iostream>
#include <string>
using namespace std;

template <typename T>
T maxOf(T a, T b) {
    return a < b ? b : a;
}

int main() {
    int i1, i2;
    double d1, d2;
    string s1, s2;
    cin >> i1 >> i2 >> d1 >> d2 >> s1 >> s2;
    cout << maxOf(i1, i2) << endl;
    cout << maxOf(d1, d2) << endl;
    cout << maxOf(s1, s2) << endl;
    return 0;
}`,
    require: [{ pattern: 'template\\s*<\\s*typename\\s+T\\s*>', message: 'Write template <typename T>' }],
    tests: [
      { name: 'Larger of each pair', stdin: '3 9 2.5 1.5 apple pear\n', expected: '9\n2.5\npear' },
      { name: 'Negatives and reversed order', stdin: '-4 -9 0.25 0.5 zebra ant\n', expected: '-4\n0.5\nzebra' },
      { name: 'Equal values', stdin: '5 5 1 1 a a\n', expected: '5\n1\na' },
    ],
  },

  // 23. practice: Point
  {
    id: 'c6-practice-point',
    title: 'Practice: Point',
    kind: 'implement',
    task: 'Write class <code>Point</code> with private coordinates; constructors <code>Point()</code> (the origin) and <code>Point(x, y)</code>; <code>move(dx, dy)</code>; <code>distSq(other)</code> (squared distance); <code>operator&lt;</code> by x then y; getters <code>getX</code> and <code>getY</code>; and <code>cout &lt;&lt;</code> printing <em>(x, y)</em>.',
    introduces: [],
    refresher: [
      'Keep the fields private and give them initialiser-list constructors. Mark methods that only read as <code>const</code>.',
      '<code>operator&lt;&lt;</code> is a free function returning the stream, so it prints through the public getters.',
    ],
    hints: [
      'Squared distance is <code>dx * dx + dy * dy</code>, where <code>dx</code> and <code>dy</code> are the coordinate differences.',
      '<code>operator&lt;</code> compares x first; only when the xs are equal does it compare y.',
      'The free function <code>operator&lt;&lt;</code> cannot see private fields, so call <code>p.getX()</code> and <code>p.getY()</code>.',
    ],
    inPython: {
      code: C`class Point:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

    def move(self, dx, dy):
        self.x += dx
        self.y += dy

    def dist_sq(self, o):
        return (self.x - o.x) ** 2 + (self.y - o.y) ** 2

    def __lt__(self, o):
        return (self.x, self.y) < (o.x, o.y)

    def __str__(self):
        return "(" + str(self.x) + ", " + str(self.y) + ")"

print(Point(1, 2), Point(1, 2) < Point(1, 3))`,
      note: 'One <code>__init__</code> with defaults replaces both constructors, and <code>__str__</code> and <code>__lt__</code> map to <code>operator&lt;&lt;</code> and <code>operator&lt;</code>.',
    },
    starter: C`#include <iostream>
using namespace std;

class Point {
    int px;
    int py;
public:
    // Point() and Point(int x, int y)
    // move(dx, dy), distSq(other), operator<, getX, getY
};

// operator<< to print a Point as (x, y)`,
    solution: C`#include <iostream>
using namespace std;

class Point {
    int px;
    int py;
public:
    Point() : px(0), py(0) { }
    Point(int x, int y) : px(x), py(y) { }

    void move(int dx, int dy) {
        px = px + dx;
        py = py + dy;
    }
    int distSq(const Point& o) const {
        int dx = px - o.px;
        int dy = py - o.py;
        return dx * dx + dy * dy;
    }
    bool operator<(const Point& o) const {
        if (px != o.px) {
            return px < o.px;
        }
        return py < o.py;
    }
    int getX() const { return px; }
    int getY() const { return py; }
};

ostream& operator<<(ostream& out, const Point& p) {
    out << "(" << p.getX() << ", " << p.getY() << ")";
    return out;
}`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    {
        Point a;
        Point b(3, 4);
        cout << a << " " << b << endl;
    }
    cout << "\n@@TEST 2@@" << endl;
    {
        Point b(3, 4);
        b.move(-1, 2);
        cout << b << endl;
    }
    cout << "\n@@TEST 3@@" << endl;
    {
        Point p(0, 0);
        Point q(3, 4);
        cout << p.distSq(q) << " " << q.distSq(q) << endl;
    }
    cout << "\n@@TEST 4@@" << endl;
    {
        cout << (Point(1, 5) < Point(2, 0)) << (Point(2, 0) < Point(2, 0)) << (Point(1, 9) < Point(1, 10)) << endl;
    }
    return 0;
}`,
    require: [
      { pattern: 'operator\\s*<\\s*\\(', message: 'Write operator<' },
      { pattern: 'operator\\s*<<', message: 'Write operator<< for printing' },
    ],
    tests: [
      { name: 'Constructors and printing', input: 'Point a; Point b(3, 4)', expected: '(0, 0) (3, 4)' },
      { name: 'move', input: 'Point(3, 4).move(-1, 2)', expected: '(2, 6)' },
      { name: 'distSq', input: 'distSq((0,0), (3,4))', expected: '25 0' },
      { name: 'operator<', input: 'compare three pairs', expected: '101' },
    ],
  },

  // 24. practice: BankAccount
  {
    id: 'c6-practice-account',
    title: 'Practice: BankAccount',
    kind: 'implement',
    task: 'Write class <code>Account</code>: constructor <code>Account(start)</code>, <code>deposit(n)</code>, <code>withdraw(n)</code> (returns <code>false</code> and changes nothing if the balance is too small), <code>balance()</code>, and a static <code>alive()</code> that counts the accounts that currently exist.',
    introduces: [],
    refresher: [
      'A static counter goes up in the constructor and down in the destructor, so it counts live objects. It needs its definition outside the class.',
      '<code>withdraw</code> must check the balance first and leave it unchanged when it returns <code>false</code>.',
    ],
    hints: [
      'Declare <code>static int live;</code> in the class and <code>int Account::live = 0;</code> after it.',
      'Add 1 to <code>live</code> in the constructor and subtract 1 in <code>~Account()</code>.',
    ],
    inPython: {
      code: C`class Account:
    alive_count = 0

    def __init__(self, start):
        self.money = start
        Account.alive_count += 1

    def deposit(self, n):
        self.money += n

    def withdraw(self, n):
        if n > self.money:
            return False
        self.money -= n
        return True

a = Account(30)
print(a.withdraw(20), a.withdraw(20), a.money)`,
      note: 'Python has no destructor to rely on, so a live-object count cannot be kept reliably. In C++ the destructor runs at a known moment, so it can.',
    },
    starter: C`#include <iostream>
using namespace std;

class Account {
    int money;
public:
    // Account(int start), deposit, withdraw, balance
    // plus a static alive() that counts the accounts that exist right now
};`,
    solution: C`#include <iostream>
using namespace std;

class Account {
    int money;
    static int live;
public:
    Account(int start) : money(start) {
        live = live + 1;
    }
    ~Account() {
        live = live - 1;
    }
    void deposit(int n) {
        money = money + n;
    }
    bool withdraw(int n) {
        if (n > money) {
            return false;
        }
        money = money - n;
        return true;
    }
    int balance() const {
        return money;
    }
    static int alive() {
        return live;
    }
};

int Account::live = 0;`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    {
        Account a(100);
        a.deposit(50);
        cout << a.balance() << endl;
    }
    cout << "\n@@TEST 2@@" << endl;
    {
        Account a(30);
        bool first = a.withdraw(20);
        bool second = a.withdraw(20);
        cout << first << second << " " << a.balance() << endl;
    }
    cout << "\n@@TEST 3@@" << endl;
    {
        cout << Account::alive() << " ";
        {
            Account a(1);
            Account b(2);
            cout << Account::alive() << " ";
        }
        cout << Account::alive() << endl;
    }
    return 0;
}`,
    require: [
      { pattern: '~\\s*Account\\s*\\(\\s*\\)', message: 'Write a destructor ~Account()' },
      { pattern: 'static\\s+int\\s+alive\\s*\\(', message: 'Write a static method alive()' },
    ],
    tests: [
      { name: 'Deposit', input: 'Account(100); deposit(50)', expected: '150' },
      { name: 'Withdraw refused when too large', input: 'withdraw(20) twice from 30', expected: '10 10' },
      { name: 'Live accounts', input: 'alive() before, during, after', expected: '0 2 0' },
    ],
  },

  // 25. practice: a Stack class over vector
  {
    id: 'c6-practice-stack',
    title: 'Practice: a Stack class',
    kind: 'implement',
    task: 'Write class <code>IntStack</code> around a private <code>vector&lt;int&gt;</code>: <code>push(v)</code>, <code>pop()</code> (returns the removed top, or -1 when empty), <code>top()</code> (-1 when empty), <code>empty()</code> and <code>size()</code>.',
    introduces: [],
    refresher: [
      'A class can hold a <code>vector</code> in a private field and expose only the operations that make sense. The vector frees itself.',
      '<code>back()</code> reads the last element and <code>pop_back()</code> removes it; both need a non-empty vector.',
    ],
    hints: [
      'Check <code>items.empty()</code> first in <code>pop</code> and <code>top</code> and return -1 when it is true.',
      'In <code>pop</code>, save <code>items.back()</code> in a variable, call <code>items.pop_back()</code>, then return the saved value.',
    ],
    inPython: {
      code: C`class IntStack:
    def __init__(self):
        self.items = []

    def push(self, v):
        self.items.append(v)

    def pop(self):
        if not self.items:
            return -1
        return self.items.pop()

s = IntStack()
s.push(1)
s.push(2)
print(s.pop(), s.pop(), s.pop())`,
      note: 'The Python class wraps a list the same way. In C++ the <code>vector</code> is private, so outside code can only use the methods you give it.',
    },
    starter: C`#include <iostream>
#include <vector>
using namespace std;

class IntStack {
    vector<int> items;
public:
    // push, pop, top, empty, size
};`,
    solution: C`#include <iostream>
#include <vector>
using namespace std;

class IntStack {
    vector<int> items;
public:
    void push(int v) {
        items.push_back(v);
    }
    int pop() {
        if (items.empty()) {
            return -1;
        }
        int v = items.back();
        items.pop_back();
        return v;
    }
    int top() const {
        if (items.empty()) {
            return -1;
        }
        return items.back();
    }
    bool empty() const {
        return items.empty();
    }
    int size() const {
        return static_cast<int>(items.size());
    }
};`,
    harness: C`int main() {
    cout << "\n@@TEST 1@@" << endl;
    {
        IntStack s;
        s.push(1);
        s.push(2);
        s.push(3);
        cout << s.pop() << " " << s.top() << endl;
    }
    cout << "\n@@TEST 2@@" << endl;
    {
        IntStack s;
        cout << s.empty() << " ";
        s.push(5);
        cout << s.empty() << " " << s.size() << endl;
    }
    cout << "\n@@TEST 3@@" << endl;
    {
        IntStack s;
        cout << s.pop() << " ";
        s.push(4);
        cout << s.pop() << " " << s.pop() << endl;
    }
    cout << "\n@@TEST 4@@" << endl;
    {
        IntStack s;
        for (int i = 1; i <= 4; i++) {
            s.push(i);
        }
        while (!s.empty()) {
            cout << s.pop();
        }
        cout << endl;
    }
    return 0;
}`,
    require: [{ pattern: 'vector\\s*<\\s*int\\s*>\\s+\\w+\\s*;', message: 'Keep the items in a private vector<int>' }],
    tests: [
      { name: 'pop and top', input: 'push 1, 2, 3', expected: '3 2' },
      { name: 'empty and size', input: 'empty, push, empty, size', expected: '1 0 1' },
      { name: 'Empty stack gives -1', input: 'pop, push 4, pop, pop', expected: '-1 4 -1' },
      { name: 'Last in, first out', input: 'push 1..4, pop all', expected: '4321' },
    ],
  },
]
