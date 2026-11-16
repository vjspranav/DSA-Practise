// Rust lessons: stage 3 part A, types that replace C++ habits, taught from zero (structs, enums, Option, Result, text methods).
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end) and docs/superpowers/specs/rust-lesson-examples.js.
// Check with: RUST_MIGRATED=2 node scripts/verify-rust.mjs --stage 3
// Ids must start with r3- and be unique across the track. Every piece of syntax a lesson uses must be introduced
// (`introduces`, ids from src/rust/syntax.js) by that lesson or an earlier one; the checker enforces it.
// Stages 1 and 2 did not teach: struct, impl, enum, Option, Result, traits, generics, closures, iterators, HashMap.

export const LESSONS = [
  // ------------------------------------------------------------------------------------------
  // 1. struct
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-struct',
    title: 'Your own type: struct',
    kind: 'concept',
    introduces: ['struct'],
    teach: {
      body: [
        `<p>So far every value you made was one of the built-in types: numbers, <code>bool</code>, <code>char</code>, <code>String</code>, <code>Vec</code>, tuples. To keep several related values together under one name, C++ has <code>struct</code>, and Rust uses the same word. A <code>struct</code> is a new type made of named <em>fields</em>. You write <code>struct</code>, a name (capitalised by convention), and then, between braces, each field as <code>name: Type</code>, separated by commas. There is no semicolon after the closing brace.</p>`,
        `<p>To make a value of the struct, write the name and then give every field a value: <code>Point { x: 3, y: 4 }</code>. This is called a <em>struct literal</em>. Rust makes you give <em>every</em> field. There is no such thing as an uninitialised field (in C++ a plain <code>int</code> member left alone holds garbage), and there are no hidden default values. If a variable already has the same name as a field you may write just the name: <code>Point { x, y }</code> means <code>Point { x: x, y: y }</code>.</p>`,
        `<p>You read a field with a dot: <code>p.x</code>. You change one the same way, but only if the whole variable was declared <code>let mut</code>. Mutability belongs to the variable, never to individual fields: there is no way to mark one field as changeable and the others not.</p>`,
        `<p>A struct follows the ownership rules you already know. Assigning it moves it (unless it is <code>Copy</code>, which a later lesson shows how to arrange), and a function that only needs to look at it takes a reference, <code>&amp;Point</code>. Fields are reached through a reference without any extra syntax: <code>p.x</code> works whether <code>p</code> is a <code>Point</code> or a <code>&amp;Point</code>.</p>`,
      ],
      examples: [
        {
          code: `struct Point {          // a new type with two fields
    x: i32,
    y: i32,
}

fn main() {
    let mut p = Point { x: 3, y: 4 };   // every field gets a value
    println!("{} {}", p.x, p.y);        // read fields with a dot
    p.x = 10;                           // allowed because p is "let mut"
    println!("{}", p.x);
}`,
          output: '3 4\n10',
        },
        {
          code: `struct Rect {
    w: u32,
    h: u32,
}

fn area(r: &Rect) -> u32 {      // borrow the struct, do not take it
    r.w * r.h
}

fn main() {
    let w = 5;
    let h = 2;
    let r = Rect { w, h };      // shorthand for Rect { w: w, h: h }
    println!("{}", area(&r));
    println!("{}", r.w);        // still ours: we only lent it
}`,
          output: '10\n5',
          caption: 'Passing <code>&r</code> lends the struct, so <code>r</code> is still usable afterwards.',
        },
      ],
      terms: [
        { code: 'struct Name { field: Type, }', meaning: 'defines a new type made of named fields' },
        { code: 'Name { field: value }', meaning: 'builds a value; every field must be given' },
        { code: 'p.field', meaning: 'reads (or, with let mut, changes) one field' },
        { code: 'Name { x, y }', meaning: 'shorthand when variables x and y are named like the fields' },
      ],
    },
    task: 'The program uses a <code>Rect</code> that does not exist yet. Define <code>struct Rect</code> with two <code>u32</code> fields, <code>w</code> and <code>h</code>, so it prints <code>12</code>.',
    compare: {
      cpp: { code: `struct Rect { int w, h; };
Rect r{3, 4};
std::cout << r.w * r.h;`, outcome: 'Same shape; fields may be left unset', ok: true },
      rust: { code: `struct Rect { w: u32, h: u32 }
let r = Rect { w: 3, h: 4 };
println!("{}", r.w * r.h);`, outcome: 'Every field must be given', ok: true },
      text: 'A Rust struct looks like a C++ one, with the type after the name. The difference is that a Rust struct cannot be built with a field missing, so no field is ever garbage.',
    },
    refresher: [
      '<code>struct Name { field: Type, ... }</code> defines the type; <code>Name { field: value }</code> builds one.',
      'Fields are read with <code>p.field</code>; changing one needs <code>let mut p</code>.',
    ],
    hints: [
      'Put the <code>struct</code> definition above <code>main</code>.',
      'Each field is written as <code>name: Type</code> and followed by a comma.',
      'Both fields are <code>u32</code>.',
    ],
    inCpp: {
      code: `struct P { int x; };
P p;                 // p.x is uninitialised garbage
std::cout << p.x;    // undefined behaviour`,
      note: 'A C++ aggregate can be created without setting its members. Rust refuses to compile a struct literal that leaves a field out.',
    },
    starter: `fn main() {
    let r = Rect { w: 3, h: 4 };
    println!("{}", r.w * r.h);
}`,
    solution: `struct Rect {
    w: u32,
    h: u32,
}

fn main() {
    let r = Rect { w: 3, h: 4 };
    println!("{}", r.w * r.h);
}`,
    require: [{ pattern: 'struct\\s+Rect\\s*\\{', message: 'Define struct Rect.' }],
    tests: [{ name: 'Prints 12', expected: '12' }],
  },

  // ------------------------------------------------------------------------------------------
  // 2. impl, &self, Self, new
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-struct-impl',
    title: 'Methods: impl, &self and new',
    kind: 'concept',
    introduces: ['impl', 'self'],
    teach: {
      body: [
        `<p>In C++ a struct can hold member functions. In Rust the data lives in the <code>struct</code> and the functions live in a separate block that starts with <code>impl</code> (short for "implementation"), followed by the type name. Everything inside <code>impl Rect { ... }</code> belongs to <code>Rect</code>. You can have more than one <code>impl</code> block for a type; usually there is one.</p>`,
        `<p>A function inside <code>impl</code> that wants to work on an existing value lists it as its first parameter, named <code>self</code>. The most common spelling is <code>&amp;self</code>, which means "borrow the value, read only". It is a short form of <code>self: &amp;Rect</code>. Inside the function you reach the fields with <code>self.w</code>. There is no hidden <code>this</code>: the parameter is written out. You call such a <em>method</em> with a dot, <code>r.area()</code>, and Rust passes <code>&amp;r</code> for you.</p>`,
        `<p>A function inside <code>impl</code> with no <code>self</code> parameter is an <em>associated function</em>. It belongs to the type but does not need a value to run, like a <code>static</code> member function in C++. You call it with <code>::</code>, as you did with <code>String::from</code>. Rust has no constructors. By convention an associated function called <code>new</code> builds a value and returns it: <code>Rect::new(3, 4)</code>. It is an ordinary function with no special status; you could name it anything.</p>`,
        `<p>Inside an <code>impl</code> block, <code>Self</code> (capital S) means "the type this block is for", so <code>-&gt; Self</code> is the same as <code>-&gt; Rect</code> there. It saves retyping the name and keeps working if you rename the struct. Remember that the last expression of a function, with no semicolon, is its return value; that is how <code>new</code> below returns the struct.</p>`,
      ],
      examples: [
        {
          code: `struct Rect {
    w: u32,
    h: u32,
}

impl Rect {                         // everything in here belongs to Rect
    fn new(w: u32, h: u32) -> Self {    // no self: an associated function
        Rect { w, h }
    }

    fn area(&self) -> u32 {         // &self: borrow the Rect, read only
        self.w * self.h
    }
}

fn main() {
    let r = Rect::new(3, 4);        // called with ::
    println!("{}", r.area());       // called with a dot
}`,
          output: '12',
        },
      ],
      terms: [
        { code: 'impl Type { ... }', meaning: 'the block holding the functions that belong to Type' },
        { code: 'fn name(&self)', meaning: 'a method: borrows the value to read it; called as value.name()' },
        { code: 'self.field', meaning: 'a field of the value the method was called on' },
        { code: 'fn new(...) -> Self', meaning: 'an associated function (no self), called as Type::new(...)' },
        { code: 'Self', meaning: 'inside impl, another name for the type being implemented' },
      ],
    },
    task: 'Add a method <code>perimeter(&amp;self) -&gt; u32</code> to <code>Rect</code> so the program prints <code>12</code> and then <code>14</code>.',
    compare: {
      cpp: { code: `struct Rect {
    int w, h;
    Rect(int w, int h) : w(w), h(h) {}
    int area() const { return w * h; }
};
Rect r(3, 4);`, outcome: 'Constructor shares the type name', ok: true },
      rust: { code: `struct Rect { w: u32, h: u32 }
impl Rect {
    fn new(w: u32, h: u32) -> Rect { Rect { w, h } }
    fn area(&self) -> u32 { self.w * self.h }
}
let r = Rect::new(3, 4);
println!("{}", r.area());`, outcome: 'new is an ordinary function', ok: true },
      text: 'There are no constructors in Rust: <code>new</code> is a plain function that returns a struct. A method names its receiver as <code>&amp;self</code>, much like a <code>const</code> member function in C++.',
    },
    refresher: [
      'Data lives in the <code>struct</code>; functions live in <code>impl</code>. <code>&amp;self</code> reads, and fields are reached as <code>self.w</code>.',
      'A function without <code>self</code>, like <code>new</code>, is called as <code>Type::name(...)</code>.',
    ],
    hints: [
      'Copy the shape of <code>area</code>: same receiver, same return type.',
      'The perimeter of a rectangle is twice the sum of its two sides.',
    ],
    inCpp: {
      code: `struct Rect {
    int w, h;
    int area() const { return w * h; }
};
Rect r{3, 4};   // aggregate init, no constructor`,
      note: 'C++ can also skip constructors for a plain struct. Rust has no constructors at all, so <code>new</code> is only a naming habit.',
    },
    starter: `struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn new(w: u32, h: u32) -> Self {
        Rect { w, h }
    }

    fn area(&self) -> u32 {
        self.w * self.h
    }
}

fn main() {
    let r = Rect::new(3, 4);
    println!("{}", r.area());
    println!("{}", r.perimeter());
}`,
    solution: `struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn new(w: u32, h: u32) -> Self {
        Rect { w, h }
    }

    fn area(&self) -> u32 {
        self.w * self.h
    }

    fn perimeter(&self) -> u32 {
        2 * (self.w + self.h)
    }
}

fn main() {
    let r = Rect::new(3, 4);
    println!("{}", r.area());
    println!("{}", r.perimeter());
}`,
    require: [{ pattern: 'fn\\s+perimeter\\s*\\(\\s*&self', message: 'Define perimeter as a method taking &self.' }],
    tests: [{ name: 'Prints area and perimeter', expected: '12\n14' }],
  },

  // ------------------------------------------------------------------------------------------
  // 3. &mut self and self
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-self-receivers',
    title: '&mut self and self',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>The last lesson used <code>&amp;self</code>: a read-only borrow. A method can take its receiver in the same three ways any function parameter can, and you already know the rules for each. <code>&amp;self</code> is a shared borrow: the method may look but not change. <code>&amp;mut self</code> is an exclusive borrow: the method may change the fields. <code>self</code> with no <code>&amp;</code> takes <em>ownership</em>: the method consumes the value, and the caller can no longer use it afterwards.</p>`,
        `<p>To call a <code>&amp;mut self</code> method the variable must be declared <code>let mut</code>, for the same reason you need <code>let mut</code> to pass <code>&amp;mut x</code>. The compiler tells you if you forget (error E0596). A method that takes <code>self</code> is the right shape when the method turns the value into something else and the old value should not be used again, for example "build a finished thing from this builder".</p>`,
        `<p>Choosing between them is the same question you answer for every parameter: does this method only read, does it change the value, or does it use it up? Start with <code>&amp;self</code> and go up only when the body needs more. Most methods are <code>&amp;self</code> or <code>&amp;mut self</code>; consuming <code>self</code> is the rare one.</p>`,
      ],
      examples: [
        {
          code: `struct Counter {
    n: u32,
}

impl Counter {
    fn bump(&mut self) {            // may change the fields
        self.n += 1;
    }

    fn value(&self) -> u32 {          // only reads
        self.n
    }

    fn finish(self) -> u32 {        // takes ownership: the Counter is used up
        self.n
    }
}

fn main() {
    let mut c = Counter { n: 0 };   // mut, because bump needs &mut
    c.bump();
    c.bump();
    println!("{}", c.value());
    let total = c.finish();         // c is moved into finish
    println!("{}", total);
    // println!("{}", c.value());     // would not compile: c was consumed
}`,
          output: '2\n2',
        },
      ],
      terms: [
        { code: '&self', meaning: 'borrow to read; the caller keeps the value' },
        { code: '&mut self', meaning: 'borrow to change; the variable must be let mut' },
        { code: 'self', meaning: 'take ownership; the value is gone from the caller afterwards' },
      ],
    },
    task: 'Add a method <code>scale(&amp;mut self, k: u32)</code> that multiplies both sides of the <code>Rect</code> by <code>k</code>. After <code>scale(2)</code> on a 2 by 3 rectangle the program should print <code>24</code>.',
    compare: {
      cpp: { code: `struct Rect {
    int w, h;
    void scale(int k) { w *= k; h *= k; }   // non-const method
    int area() const { return w * h; }      // const method
};`, outcome: 'const or non-const', ok: true },
      rust: { code: `struct Rect { w: u32, h: u32 }
impl Rect {
    fn scale(&mut self, k: u32) { self.w *= k; self.h *= k; }
    fn area(&self) -> u32 { self.w * self.h }
}`, outcome: '&mut self, &self, or self', ok: true },
      text: 'C++ has two choices, a <code>const</code> method or not. Rust has three, and the third, <code>self</code>, has no C++ spelling: the method consumes the object.',
    },
    refresher: [
      '<code>&amp;self</code> reads, <code>&amp;mut self</code> changes (the variable needs <code>let mut</code>), <code>self</code> consumes.',
    ],
    hints: [
      'The method signature is <code>fn scale(&amp;mut self, k: u32)</code>.',
      'Multiply with <code>*=</code> on <code>self.w</code> and <code>self.h</code>.',
    ],
    inCpp: {
      code: `struct Counter {
    int n = 0;
    void bump() { n++; }
    int get() const { return n; }
};
const Counter c;
// c.bump();   // error: c is const`,
      note: 'The nearest C++ idea of a "consuming" method is one that takes <code>this</code> by rvalue reference. Rust makes it an ordinary receiver kind.',
    },
    starter: `struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn area(&self) -> u32 {
        self.w * self.h
    }
}

fn main() {
    let mut r = Rect { w: 2, h: 3 };
    r.scale(2);
    println!("{}", r.area());
}`,
    solution: `struct Rect {
    w: u32,
    h: u32,
}

impl Rect {
    fn area(&self) -> u32 {
        self.w * self.h
    }

    fn scale(&mut self, k: u32) {
        self.w *= k;
        self.h *= k;
    }
}

fn main() {
    let mut r = Rect { w: 2, h: 3 };
    r.scale(2);
    println!("{}", r.area());
}`,
    require: [{ pattern: 'fn\\s+scale\\s*\\(\\s*&mut\\s+self', message: 'Define scale as a method taking &mut self.' }],
    tests: [{ name: 'Prints 24', expected: '24' }],
  },

  {
    id: 'r3-self-kinds',
    title: 'Which receiver fits?',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      '<code>self</code> takes ownership, <code>&amp;self</code> borrows to read, <code>&amp;mut self</code> borrows to change.',
      'The receiver follows the same rules as any other parameter: moves, shared borrows and exclusive borrows.',
    ],
    inCpp: {
      code: `struct Door {
    bool open = false;
    Door opened() && { open = true; return std::move(*this); }
};`,
      note: 'C++ has <code>const</code> or not, plus rvalue-qualified methods that few people write. Rust spells out all three receivers, and a method that takes <code>self</code> consumes the caller\'s value.',
    },
    rounds: [
      {
        snippet: `struct Door {
    open: bool,
}

impl Door {
    fn opened(self) -> Door {
        Door { open: true }
    }
}

fn main() {
    let d = Door { open: false };
    let e = d.opened();
    println!("{} {}", e.open, d.open);
}`,
        choices: ['Prints true false', 'Error: borrow of moved value', 'Error: cannot borrow as mutable'],
        answer: 1,
        why: '<code>opened(self)</code> takes ownership of <code>d</code>, so <code>d</code> is moved on line 13 and unusable on line 14.',
        errorCode: 'E0382',
        output: `error[E0382]: borrow of moved value: \`d\`
  --> src/main.rs:14:31
   |
12 |     let d = Door { open: false };
   |         - move occurs because \`d\` has type \`Door\`, which does not implement the \`Copy\` trait
13 |     let e = d.opened();
   |               -------- \`d\` moved due to this method call
14 |     println!("{} {}", e.open, d.open);
   |                               ^^^^^^ value borrowed here after move`,
      },
      {
        snippet: `struct Counter {
    n: u32,
}

impl Counter {
    fn bump(&mut self) {
        self.n += 1;
    }
}

fn main() {
    let c = Counter { n: 0 };
    c.bump();
    println!("{}", c.n);
}`,
        choices: ['Prints 1', 'Prints 0', 'Error: c is not declared mutable'],
        answer: 2,
        why: '<code>bump</code> needs <code>&amp;mut self</code>, and a plain <code>let</code> binding cannot be borrowed mutably.',
        errorCode: 'E0596',
        output: `error[E0596]: cannot borrow \`c\` as mutable, as it is not declared as mutable
  --> src/main.rs:13:5
   |
13 |     c.bump();
   |     ^ cannot borrow as mutable
   |
help: consider changing this to be mutable
   |
12 |     let mut c = Counter { n: 0 };
   |         +++`,
      },
    ],
  },

  // ------------------------------------------------------------------------------------------
  // 4. implement: Account
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-account-methods',
    title: 'Write an Account',
    kind: 'implement',
    introduces: [],
    task: 'Fill in <code>impl Account</code>: <code>new()</code> starts at 0, <code>deposit(&amp;mut self, i64)</code> adds, <code>withdraw(&amp;mut self, i64) -&gt; bool</code> refuses (false, no change) if funds are short, <code>balance(&amp;self) -&gt; i64</code>.',
    refresher: [
      'A function with no <code>self</code> is called as <code>Account::new()</code> and returns the struct.',
      '<code>&amp;mut self</code> methods may change fields; the caller needs a <code>let mut</code> binding.',
      'A field and a method may share a name: <code>self.cents</code> versus <code>self.balance()</code>.',
    ],
    hints: [
      '<code>new</code> returns <code>Account { cents: 0 }</code>.',
      'In <code>withdraw</code>, compare first; only subtract when the amount fits.',
      'The last expression of a function is its return value: no <code>return</code> needed.',
    ],
    inCpp: {
      code: `class Account {
    long long cents = 0;
public:
    void deposit(long long a) { cents += a; }
    bool withdraw(long long a) {
        if (a > cents) return false;
        cents -= a;
        return true;
    }
    long long balance() const { return cents; }
};`,
      note: 'Fields are private in C++ by <code>private:</code>; in Rust they are private to the module by default. There is no constructor to write: <code>new</code> is an ordinary function.',
    },
    starter: `struct Account {
    cents: i64,
}

impl Account {
    // new, deposit, withdraw, balance
}`,
    solution: `struct Account {
    cents: i64,
}

impl Account {
    fn new() -> Account {
        Account { cents: 0 }
    }

    fn deposit(&mut self, amount: i64) {
        self.cents += amount;
    }

    fn withdraw(&mut self, amount: i64) -> bool {
        if amount > self.cents {
            return false;
        }
        self.cents -= amount;
        true
    }

    fn balance(&self) -> i64 {
        self.cents
    }
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    let a = Account::new();
    println!("{}", a.balance());

    println!("\\n@@TEST 2@@");
    let mut b = Account::new();
    b.deposit(50);
    b.deposit(25);
    println!("{}", b.balance());

    println!("\\n@@TEST 3@@");
    let mut c = Account::new();
    c.deposit(100);
    let ok = c.withdraw(30);
    println!("{} {}", ok, c.balance());

    println!("\\n@@TEST 4@@");
    let mut d = Account::new();
    d.deposit(100);
    let ok = d.withdraw(200);
    println!("{} {}", ok, d.balance());
}`,
    tests: [
      { name: 'New account is empty', input: 'new()', expected: '0' },
      { name: 'Two deposits', input: 'deposit 50, 25', expected: '75' },
      { name: 'Withdraw within funds', input: '100, withdraw 30', expected: 'true 70' },
      { name: 'Withdraw too much', input: '100, withdraw 200', expected: 'false 100' },
    ],
  },

  // ------------------------------------------------------------------------------------------
  // 5. struct holding a reference
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-struct-borrow',
    title: 'A struct that borrows',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Until now every field you stored was owned: numbers, or a <code>String</code>. A struct can also hold a <em>reference</em>, for example a <code>&amp;str</code> that points into text owned elsewhere. This is cheap (no copy of the text) and is exactly like a C++ struct holding a <code>std::string_view</code> or a pointer. It is also exactly as dangerous as those: if the text is destroyed first, the struct points at nothing.</p>`,
        `<p>Rust makes you say so. A struct that holds a reference needs a <em>lifetime parameter</em>, the same <code>'a</code> you met on functions in the ownership stage. You declare it after the struct name, <code>struct Excerpt&lt;'a&gt;</code>, and use it on the field, <code>text: &amp;'a str</code>. It reads: "an <code>Excerpt</code> cannot outlive the text its <code>text</code> field points to". Leave it out and the compiler stops with E0106, "missing lifetime specifier", which you have seen on functions.</p>`,
        `<p>The <code>impl</code> block repeats the parameter: <code>impl&lt;'a&gt; Excerpt&lt;'a&gt;</code>. The first <code>&lt;'a&gt;</code> declares the name, and the second says "for Excerpt with that lifetime". A method can then return a reference that carries the same <code>'a</code>, such as <code>-&gt; &amp;'a str</code>. That promises the result points into the original text, not into the <code>Excerpt</code> itself, so the result stays valid even after the <code>Excerpt</code> is gone.</p>`,
        `<p>As with functions, the compiler checks every use. If the <code>Excerpt</code> would outlive the <code>String</code> it points into, you get E0597 "borrowed value does not live long enough", at compile time. The struct is a borrow wearing a name, and it follows the borrow rules.</p>`,
      ],
      examples: [
        {
          code: `struct Excerpt<'a> {            // 'a: how long the borrowed text lives
    text: &'a str,
}

impl<'a> Excerpt<'a> {
    fn new(text: &'a str) -> Excerpt<'a> {
        Excerpt { text }
    }

    fn head(&self, n: usize) -> &'a str {   // points into the original text
        &self.text[..n]
    }
}

fn main() {
    let story = String::from("call me Ishmael");
    let ex = Excerpt::new(&story);          // ex borrows story
    println!("{}", ex.head(4));
    println!("{}", ex.text);
}`,
          output: 'call\ncall me Ishmael',
        },
      ],
      terms: [
        { code: "struct S<'a> { f: &'a str }", meaning: 'a struct that borrows; it cannot outlive what it points to' },
        { code: "impl<'a> S<'a> { ... }", meaning: 'the impl block repeats the lifetime parameter' },
        { code: "-> &'a str", meaning: 'a method result that borrows from the original text, not from self' },
      ],
    },
    task: 'This <code>struct</code> holds a <code>&amp;str</code> but has no lifetime, so it does not compile. Add the lifetime parameter wherever it is needed so the program prints <code>call</code> and then <code>me</code>.',
    compare: {
      cpp: { code: `struct Excerpt {
    std::string_view text;     // dangles if the string dies first
};
Excerpt make() {
    std::string s = "hello";
    return Excerpt{s};
}`, outcome: 'Compiles; dangling at run time', ok: true },
      rust: { code: `struct Excerpt<'a> { text: &'a str }
let ex;
{
    let s = String::from("hello");
    ex = Excerpt { text: &s };
}
println!("{}", ex.text);`, outcome: 'Error: s does not live long enough', ok: false, errorCode: 'E0597' },
      text: 'A <code>string_view</code> member dangles silently when its string dies. In Rust the lifetime parameter lets the compiler refuse the same program.',
    },
    refresher: [
      "A struct with a reference field needs <code>&lt;'a&gt;</code> on the struct, on the field (<code>&amp;'a str</code>) and on <code>impl&lt;'a&gt;</code>.",
      'The struct cannot outlive the data it borrows; the compiler checks that.',
    ],
    hints: [
      'Add <code>&lt;\'a&gt;</code> after the struct name and write <code>&amp;\'a str</code> on the field.',
      'The <code>impl</code> line needs <code>impl&lt;\'a&gt; Words&lt;\'a&gt;</code>.',
      'A method returning part of the text can say <code>-&gt; &amp;\'a str</code>.',
    ],
    inCpp: {
      code: `struct Words {
    const char* text;   // raw pointer: the same hazard
};`,
      note: 'Any C++ struct holding a view or a pointer to someone else\'s data has this contract in a comment. Rust writes it in the type.',
    },
    starter: `struct Words {
    text: &str,
}

impl Words {
    fn part(&self, from: usize, to: usize) -> &str {
        &self.text[from..to]
    }
}

fn main() {
    let line = String::from("call me Ishmael");
    let w = Words { text: &line };
    println!("{}", w.part(0, 4));
    println!("{}", w.part(5, 7));
}`,
    solution: `struct Words<'a> {
    text: &'a str,
}

impl<'a> Words<'a> {
    fn part(&self, from: usize, to: usize) -> &'a str {
        &self.text[from..to]
    }
}

fn main() {
    let line = String::from("call me Ishmael");
    let w = Words { text: &line };
    println!("{}", w.part(0, 4));
    println!("{}", w.part(5, 7));
}`,
    require: [{ pattern: "struct\\s+Words\\s*<\\s*'a\\s*>", message: "Give the struct a lifetime parameter <'a>." }],
    tests: [{ name: 'Prints call and me', expected: 'call\nme' }],
  },

  // ------------------------------------------------------------------------------------------
  // 6. derive
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-derive',
    title: 'No inheritance, derive instead',
    kind: 'concept',
    introduces: ['derive', 'attribute', 'placeholder-pretty'],
    teach: {
      body: [
        `<p>Try printing a struct with <code>{:?}</code> and the compiler refuses: the struct has no way to be printed yet. In C++ you would write <code>operator&lt;&lt;</code> by hand. Rust does not generate capabilities silently, and it has no inheritance to borrow them from. What it has is <em>traits</em>, named sets of abilities such as "can be printed with <code>{:?}</code>" (<code>Debug</code>), "can be duplicated with <code>.clone()</code>" (<code>Clone</code>) and "can be compared with <code>==</code>" (<code>PartialEq</code>). A later lesson explains traits fully; for now, treat each as a switch a type may have.</p>`,
        `<p>For the routine ones you do not write the code, you ask the compiler to. Put <code>#[derive(Debug, Clone, PartialEq)]</code> on the line directly above the struct. The <code>#[...]</code> shape is called an <em>attribute</em>: a note to the compiler about the item below it. <code>derive</code> is the attribute that says "generate the standard implementation of these traits for me". The generated code works field by field: <code>PartialEq</code> says two values are equal when every field is equal, <code>Clone</code> clones every field, <code>Debug</code> prints the name and all the fields.</p>`,
        `<p>With <code>Debug</code> a struct prints with <code>{:?}</code> on one line, like <code>Point { x: 1, y: 2 }</code>. A related placeholder, <code>{:#?}</code>, prints the same thing "pretty": one field per line, indented, which is easier to read for bigger values. You can also derive <code>Copy</code> (together with <code>Clone</code>) when every field is itself <code>Copy</code>. Such a struct then copies on assignment instead of moving, just like an <code>i32</code>.</p>`,
        `<p>Since Rust has no inheritance, how do you reuse a struct inside another? You put one in a field, which is called <em>composition</em>: <code>struct Dog { animal: Animal, tricks: u32 }</code>. A <code>Dog</code> <em>has</em> an <code>Animal</code>; it is not one. Sharing behaviour across types is the job of traits, which come soon.</p>`,
      ],
      examples: [
        {
          code: `#[derive(Debug, Clone, PartialEq)]   // ask the compiler to write these three
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = a.clone();               // needs Clone
    println!("{:?}", b);             // needs Debug
    println!("{}", a == b);          // needs PartialEq
    println!("{:#?}", a);            // the pretty, multi-line form
}`,
          output: 'Point { x: 1, y: 2 }\ntrue\nPoint {\n    x: 1,\n    y: 2,\n}',
        },
        {
          code: `#[derive(Debug, Clone, Copy)]        // Copy: assignment copies instead of moving
struct Pixel {
    r: u8,
    g: u8,
}

fn main() {
    let p = Pixel { r: 255, g: 0 };
    let q = p;                       // copied, p is still usable
    println!("{:?} {:?}", p, q);
}`,
          output: 'Pixel { r: 255, g: 0 } Pixel { r: 255, g: 0 }',
        },
      ],
      terms: [
        { code: '#[derive(Debug)]', meaning: 'generate the code so the type prints with {:?}' },
        { code: '#[derive(Clone, PartialEq)]', meaning: 'generate .clone() and == for the type (field by field)' },
        { code: '#[derive(Clone, Copy)]', meaning: 'make a small all-Copy struct copy on assignment' },
        { code: '{:#?}', meaning: 'the multi-line "pretty" debug placeholder' },
        { code: '#[ ... ]', meaning: 'an attribute: a note to the compiler about the next item' },
      ],
    },
    task: 'This does not compile. Add one <code>#[derive(...)]</code> line so it prints <code>Point { x: 1, y: 2 }</code> and then <code>true</code>.',
    compare: {
      cpp: { code: `struct P {
    int x, y;
    bool operator==(const P&) const = default;
};
// copying works; printing needs operator<<`, outcome: '== is one line; no print', ok: true },
      rust: { code: `#[derive(Debug, Clone, PartialEq)]
struct P { x: i32, y: i32 }
let a = P { x: 1, y: 2 };
let b = a.clone();
println!("{:?} {}", b, a == b);`, outcome: 'Debug, clone and == from one line', ok: true },
      text: 'Rust has no inheritance: reuse data by putting one struct inside another, and reuse behaviour with traits. <code>#[derive]</code> asks the compiler to write the routine ones.',
    },
    refresher: [
      '<code>{:?}</code> needs <code>Debug</code>, <code>.clone()</code> needs <code>Clone</code>, <code>==</code> needs <code>PartialEq</code>; derive them above the struct.',
      'Nothing is generated silently: a struct has none of these until you derive or write them.',
    ],
    hints: [
      'The compiler error names three missing capabilities.',
      'The attribute goes on the line directly above the <code>struct</code>.',
      'Derive takes a comma-separated list of trait names.',
    ],
    cppStd: 20,
    inCpp: {
      code: `struct Animal { std::string name; };
struct Dog : Animal {   // inheritance
    int tricks;
};
// Rust: struct Dog { animal: Animal, tricks: u32 }`,
      note: 'In C++ a <code>Dog</code> is-an <code>Animal</code> and can be used where one is expected. Rust has only has-a composition: <code>Dog</code> holds an <code>Animal</code> field.',
    },
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = a.clone();
    println!("{:?}", b);
    println!("{}", a == b);
}`,
    solution: `#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = a.clone();
    println!("{:?}", b);
    println!("{}", a == b);
}`,
    require: [{ pattern: 'derive\\s*\\(', message: 'Use #[derive(...)] on Point.' }],
    tests: [{ name: 'Prints the point and true', expected: 'Point { x: 1, y: 2 }\ntrue' }],
  },

  // ------------------------------------------------------------------------------------------
  // 7. enum
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-enum-basic',
    title: 'Enums: a closed set of choices',
    kind: 'concept',
    introduces: ['enum'],
    teach: {
      body: [
        `<p>A <code>struct</code> says "this value has <em>all</em> of these fields". An <code>enum</code> says "this value is <em>exactly one</em> of these choices". You write <code>enum</code>, a name, and the list of choices (called <em>variants</em>) between braces, separated by commas. A traffic light is red, yellow or green, never two at once, so <code>enum Light { Red, Yellow, Green }</code> fits.</p>`,
        `<p>You name a variant with <code>::</code>, as in <code>Light::Red</code>. The enum name is part of the path, so two enums can both have a variant called <code>Red</code> without clashing. Unlike a C++ <code>enum</code>, a Rust variant is not secretly an integer: you cannot add one to a number or compare it to <code>0</code>. (A plain variant can still be cast with <code>as</code> to get its position, <code>Light::Red as i32</code> is <code>0</code>, but that is a deliberate step, not an accident.)</p>`,
        `<p>To do something different for each variant, use the <code>match</code> you learned in stage 1, now with variants as the patterns. A <code>match</code> on an enum must cover <em>every</em> variant, or it will not compile. That is the big difference from a C++ <code>switch</code>, where a missing case silently does nothing and a missing <code>break</code> silently falls into the next one. Rust has no fall through. Each arm is an expression, and the arms must all produce the same type.</p>`,
      ],
      examples: [
        {
          code: `enum Coin {
    Penny,
    Nickel,
    Dime,
}

fn cents(c: Coin) -> u32 {
    match c {                       // one arm per variant, all of them
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
    }
}

fn main() {
    println!("{}", cents(Coin::Dime));
    println!("{}", cents(Coin::Penny));
}`,
          output: '10\n1',
        },
        {
          code: `#[derive(Debug, PartialEq)]       // Debug to print it, PartialEq to use ==
enum Mode {
    Fast,
    Slow,
}

fn main() {
    let m = Mode::Slow;
    println!("{:?}", m);
    println!("{}", m == Mode::Fast);
}`,
          output: 'Slow\nfalse',
          caption: 'An enum has no <code>==</code> or <code>{:?}</code> until you derive them, like a struct.',
        },
      ],
      terms: [
        { code: 'enum Name { A, B, C }', meaning: 'a type whose value is exactly one of the listed variants' },
        { code: 'Name::A', meaning: 'one variant; the enum name is part of the path' },
        { code: 'match x { Name::A => ..., }', meaning: 'one arm per variant; leaving one out is a compile error' },
      ],
    },
    task: 'Fill in <code>next</code> so a <code>Dir</code> turns right: North to East, East to South, South to West, West to North. The program prints <code>East</code>, <code>South</code>, <code>West</code>, <code>North</code>.',
    compare: {
      cpp: { code: `enum class Dir { North, East };
Dir d = Dir::East;
int n = static_cast<int>(d);   // explicit
switch (d) {
    case Dir::North: puts("n"); break;   // break or fall through
    case Dir::East:  puts("e"); break;
}`, outcome: 'Needs break; a missing case is silent', ok: true },
      rust: { code: `enum Dir { North, East }
let d = Dir::East;
match d {
    Dir::North => println!("n"),
    Dir::East => println!("e"),
}`, outcome: 'No fall through; all variants required', ok: true },
      text: 'A Rust <code>match</code> is like a <code>switch</code> that cannot fall through and must list every case. Like <code>enum class</code>, the variants do not convert to integers on their own.',
    },
    refresher: [
      '<code>enum E { A, B }</code> makes a type that is exactly one variant; write one as <code>E::A</code>.',
      'A <code>match</code> on an enum needs an arm for every variant.',
    ],
    hints: [
      'Use <code>match d</code> with four arms, one per variant.',
      'Each arm returns a <code>Dir</code>, written <code>Dir::East</code> and so on.',
    ],
    inCpp: {
      code: `enum Dir { North, East, South, West };   // old-style: plain ints
Dir d = North;
d = static_cast<Dir>((d + 1) % 4);      // arithmetic is allowed`,
      note: 'Old C++ enums are integers underneath, so arithmetic on them compiles. Rust enums are their own type: the only way to move to the next one is to say so with a <code>match</code>.',
    },
    starter: `#[derive(Debug)]
enum Dir {
    North,
    East,
    South,
    West,
}

fn next(d: Dir) -> Dir {
    d
}

fn main() {
    println!("{:?}", next(Dir::North));
    println!("{:?}", next(Dir::East));
    println!("{:?}", next(Dir::South));
    println!("{:?}", next(Dir::West));
}`,
    solution: `#[derive(Debug)]
enum Dir {
    North,
    East,
    South,
    West,
}

fn next(d: Dir) -> Dir {
    match d {
        Dir::North => Dir::East,
        Dir::East => Dir::South,
        Dir::South => Dir::West,
        Dir::West => Dir::North,
    }
}

fn main() {
    println!("{:?}", next(Dir::North));
    println!("{:?}", next(Dir::East));
    println!("{:?}", next(Dir::South));
    println!("{:?}", next(Dir::West));
}`,
    require: [{ pattern: '\\bmatch\\b', message: 'Use a match on the direction.' }],
    tests: [{ name: 'Turns right', expected: 'East\nSouth\nWest\nNorth' }],
  },

  {
    id: 'r3-match-exhaustive',
    title: 'A variant is missing',
    kind: 'fix',
    introduces: [],
    task: 'The compiler rejects this <code>match</code>. Make it compile and print <code>30</code>, <code>5</code>, <code>0</code> by naming the missing variant, not by using <code>_</code>.',
    errorCode: 'E0004',
    gloss: 'A <code>match</code> must cover every variant, and <code>Light::Yellow</code> has no arm.',
    refresher: [
      'Every variant needs an arm, or a catch-all <code>_</code>. Here the catch-all is off the table.',
      'Add a new variant later and every non-exhaustive <code>match</code> stops compiling: the compiler lists what to update.',
    ],
    hints: [
      'Read the error: it names the pattern that is not covered.',
      'Add one arm, written like the existing ones.',
      'Yellow waits 5 seconds.',
    ],
    inCpp: {
      code: `enum class Light { Red, Yellow, Green };
int wait(Light l) {
    switch (l) {
        case Light::Red:   return 30;
        case Light::Green: return 0;
    }
    return -1;   // Yellow lands here
}`,
      note: 'A <code>switch</code> over an enum only warns (with <code>-Wswitch</code>) and falls out the bottom. A Rust <code>match</code> that misses a variant does not compile.',
    },
    starter: `enum Light {
    Red,
    Yellow,
    Green,
}

fn wait(l: Light) -> u32 {
    match l {
        Light::Red => 30,
        Light::Green => 0,
    }
}

fn main() {
    println!("{}", wait(Light::Red));
    println!("{}", wait(Light::Yellow));
    println!("{}", wait(Light::Green));
}`,
    solution: `enum Light {
    Red,
    Yellow,
    Green,
}

fn wait(l: Light) -> u32 {
    match l {
        Light::Red => 30,
        Light::Yellow => 5,
        Light::Green => 0,
    }
}

fn main() {
    println!("{}", wait(Light::Red));
    println!("{}", wait(Light::Yellow));
    println!("{}", wait(Light::Green));
}`,
    require: [{ pattern: 'match\\s+l\\b', message: 'Keep the match on l.' }],
    forbidden: [{ pattern: '_\\s*=>', message: 'Name the missing variant instead of using _.' }],
    tests: [{ name: 'Prints 30, 5, 0', expected: '30\n5\n0' }],
  },

  // ------------------------------------------------------------------------------------------
  // 8. enums that carry data
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-enum-data',
    title: 'Enums that carry data',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Here is where a Rust enum goes far beyond a C++ one. A variant can carry data, and different variants can carry different data. <code>Circle(f64)</code> is a variant that holds one number (a radius). <code>Rect(f64, f64)</code> holds two. You build one like a function call, <code>Shape::Rect(2.0, 3.0)</code>. A variant may also have named fields like a struct, <code>Click { x: i32, y: i32 }</code>, which is handy when the position of each value is not obvious.</p>`,
        `<p>How do you get the data out? Only through <code>match</code> (or one of its shorter forms in a later lesson). A pattern like <code>Shape::Rect(w, h)</code> both checks "is it a <code>Rect</code>?" and, if so, gives the names <code>w</code> and <code>h</code> to the two numbers for use on the right of <code>=&gt;</code>. In the arm for <code>Circle</code>, there is no <code>w</code> at all. So you cannot read the wrong data. That is the safety a C++ <code>std::variant</code> only offers at run time, when <code>std::get</code> throws on the wrong alternative.</p>`,
        `<p>Enums can have <code>impl</code> blocks just like structs. A method with <code>&amp;self</code> usually starts with <code>match self</code>. Because <code>self</code> is a reference here, the names a pattern binds (like <code>r</code> below) are references to the data inside. Arithmetic with them still works, so <code>3.0 * r * r</code> is fine.</p>`,
        `<p>Since each value is exactly one variant, an enum is the natural way to model "a shape is one of these kinds" or "an event is one of these kinds". It is the replacement for the C++ habit of an <code>int kind</code> field plus a union, or a class hierarchy with <code>virtual</code> functions, when the set of kinds is closed and known.</p>`,
      ],
      examples: [
        {
          code: `enum Shape {
    Circle(f64),             // one number: the radius
    Rect(f64, f64),          // two numbers: width and height
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => 3.0 * r * r,    // r exists only in this arm
            Shape::Rect(w, h) => w * h,
        }
    }
}

fn main() {
    println!("{}", Shape::Circle(2.0).area());
    println!("{}", Shape::Rect(2.0, 3.0).area());
}`,
          output: '12\n6',
        },
        {
          code: `enum Event {
    Click { x: i32, y: i32 },      // named fields, like a struct
    Key(char),
    Quit,                          // no data at all
}

fn describe(e: &Event) -> String {
    match e {
        Event::Click { x, y } => format!("click at {} {}", x, y),
        Event::Key(c) => format!("key {}", c),
        Event::Quit => String::from("quit"),
    }
}

fn main() {
    println!("{}", describe(&Event::Click { x: 3, y: 4 }));
    println!("{}", describe(&Event::Key('q')));
    println!("{}", describe(&Event::Quit));
}`,
          output: 'click at 3 4\nkey q\nquit',
        },
      ],
      terms: [
        { code: 'Variant(T, U)', meaning: 'a variant that carries values; built like a function call' },
        { code: 'Variant { a: T }', meaning: 'a variant with named fields' },
        { code: 'Shape::Rect(w, h) =>', meaning: 'a pattern: checks the variant and names the data inside it' },
        { code: 'match self { ... }', meaning: 'the usual first line of a method on an enum' },
      ],
    },
    task: 'Add a <code>Triangle(f64, f64)</code> variant (base, height) and give <code>area</code> an arm for it. The program should print <code>3</code>, <code>6</code>, <code>6</code>.',
    compare: {
      cpp: { code: `std::variant<int, std::string> v = std::string("hi");
int n = std::get<int>(v);   // wrong alternative`, outcome: 'Compiles; throws at run time', ok: true },
      rust: { code: `enum Shape { Circle(f64), Rect(f64, f64) }
let s = Shape::Rect(2.0, 3.0);
let area = match s {
    Shape::Circle(r) => 3.0 * r * r,
    Shape::Rect(w, h) => w * h,
};
println!("{}", area);`, outcome: 'Fields only inside the matching arm', ok: true },
      text: 'Each variant carries its own fields, and <code>match</code> hands them out only inside the arm that matches. You cannot read the wrong alternative, so there is nothing to check at run time.',
    },
    refresher: [
      'Tuple variants such as <code>Rect(f64, f64)</code> are built like function calls: <code>Shape::Rect(2.0, 3.0)</code>.',
      'In a pattern, <code>Shape::Rect(w, h)</code> names the fields for use on the right of <code>=&gt;</code>.',
    ],
    hints: [
      'Two places change: the enum definition and the <code>match</code> in <code>area</code>.',
      'Write the variant with two <code>f64</code> fields, the same way as <code>Rect</code>.',
      'Triangle area is half of base times height.',
    ],
    inCpp: {
      code: `struct Circle { double r; };
struct Rect { double w, h; };
using Shape = std::variant<Circle, Rect>;
Shape s = Rect{2, 3};
double a = std::visit([](auto& x) { return 0.0; }, s);`,
      note: '<code>std::variant</code> needs a separate type per alternative and a visitor. A Rust enum declares the alternatives inline, and the compiler insists every one is handled.',
    },
    starter: `enum Shape {
    Circle(f64),
    Rect(f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => 3.0 * r * r,
            Shape::Rect(w, h) => w * h,
        }
    }
}

fn main() {
    println!("{}", Shape::Circle(1.0).area());
    println!("{}", Shape::Rect(2.0, 3.0).area());
    println!("{}", Shape::Triangle(3.0, 4.0).area());
}`,
    solution: `enum Shape {
    Circle(f64),
    Rect(f64, f64),
    Triangle(f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => 3.0 * r * r,
            Shape::Rect(w, h) => w * h,
            Shape::Triangle(b, h) => 0.5 * b * h,
        }
    }
}

fn main() {
    println!("{}", Shape::Circle(1.0).area());
    println!("{}", Shape::Rect(2.0, 3.0).area());
    println!("{}", Shape::Triangle(3.0, 4.0).area());
}`,
    require: [{ pattern: 'Triangle\\s*\\(\\s*f64\\s*,\\s*f64\\s*\\)', message: 'Declare Triangle(f64, f64) in the enum.' }],
    tests: [{ name: 'Prints three areas', expected: '3\n6\n6' }],
  },

  // ------------------------------------------------------------------------------------------
  // 9. Option
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-option-idea',
    title: 'Option instead of null or -1',
    kind: 'concept',
    introduces: ['option', 'get'],
    teach: {
      body: [
        `<p>Some operations may have no answer: the first even number in a list that has none, an element at an index past the end. C++ handles this with a sentinel (<code>-1</code>), a null pointer, an iterator equal to <code>end()</code>, or <code>std::optional</code>. All but the last are ordinary values that the caller can forget to check, and then the bug flows on silently. Rust has no null. Instead it has a type built from what you just learned: an enum with data.</p>`,
        `<p><code>Option&lt;T&gt;</code> is an enum from the standard library, always available. It has two variants: <code>Some(x)</code>, which carries a value of type <code>T</code>, and <code>None</code>, which carries nothing. A function that may have no answer returns <code>Option&lt;i32&gt;</code> instead of <code>i32</code>. The two are different types: you cannot add an <code>Option&lt;i32&gt;</code> to an <code>i32</code>, and you cannot use it as a number. To get the value out you <code>match</code>, and the compiler makes you write the <code>None</code> arm too. The check you might have forgotten is now part of the type.</p>`,
        `<p>A first source of <code>Option</code> values: <code>v.get(i)</code> on a vector (or slice) gives <code>Some(&amp;element)</code> when the index exists and <code>None</code> when it does not, where <code>v[i]</code> would panic. The element comes as a reference, <code>Option&lt;&amp;i32&gt;</code>, because <code>.get</code> only borrows. Printing it with <code>{}</code> still works, since a reference prints like the value it points to.</p>`,
        `<p>To make your own, write <code>Some(value)</code> or <code>None</code>. When you write a bare <code>None</code> the compiler needs to know <code>None</code> of what, so give a type from context, such as a function return type or <code>let x: Option&lt;i32&gt; = None;</code>. Both <code>Some</code> and <code>None</code> can be used by their bare names with no <code>Option::</code> in front.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = vec![10, 20, 30];
    match v.get(1) {                         // Some(&20)
        Some(x) => println!("got {}", x),
        None => println!("nothing there"),
    }
    match v.get(9) {                         // None: out of range, no panic
        Some(x) => println!("got {}", x),
        None => println!("nothing there"),
    }
}`,
          output: 'got 20\nnothing there',
        },
        {
          code: `fn first_even(v: &[i32]) -> Option<i32> {     // may have no answer
    for x in v {
        if *x % 2 == 0 {
            return Some(*x);                     // wrap the answer in Some
        }
    }
    None                                         // no even number found
}

fn main() {
    println!("{:?}", first_even(&[3, 5, 8, 9]));
    println!("{:?}", first_even(&[1, 3]));
}`,
          output: 'Some(8)\nNone',
          caption: '<code>{:?}</code> prints an <code>Option</code> as <code>Some(8)</code> or <code>None</code>.',
        },
      ],
      terms: [
        { code: 'Option<T>', meaning: 'either Some(a value of type T) or None; replaces null and -1' },
        { code: 'Some(x)', meaning: 'a present value; None is the absent one' },
        { code: 'v.get(i)', meaning: 'Some(&element) if the index exists, otherwise None (no panic)' },
        { code: 'match opt { Some(x) => ..., None => ... }', meaning: 'the only way to reach the value is to handle both cases' },
      ],
    },
    task: 'Fill in <code>report</code>: print <code>found N</code> for <code>Some(N)</code> and <code>none</code> for <code>None</code>.',
    compare: {
      cpp: { code: `std::vector<int> v{4, 7};
int i = -1;                      // -1 means "not found"
for (int k = 0; k < 2; k++) if (v[k] == 9) i = k;
std::cout << v[i];               // forgot to check`, outcome: 'Compiles; v[-1] is undefined', ok: true },
      rust: { code: `let v = vec![4, 7];
match v.get(5) {
    Some(n) => println!("got {}", n),
    None => println!("nothing"),
}`, outcome: 'Must say what None does', ok: true },
      text: 'Absence is a value of type <code>Option&lt;T&gt;</code>. The inside is reachable only through a <code>match</code> that also covers <code>None</code>, so there is no sentinel to forget to check.',
    },
    refresher: [
      '<code>Option&lt;T&gt;</code> is <code>Some(x)</code> or <code>None</code>. <code>v.get(i)</code> returns one instead of panicking.',
      '<code>Some(n)</code> in a pattern binds <code>n</code> to the inside; <code>None</code> has nothing inside.',
    ],
    hints: [
      'Match on <code>r</code> with two arms.',
      'The arm for <code>Some(n)</code> can use <code>n</code> in <code>println!</code>.',
    ],
    inCpp: {
      code: `std::optional<int> first_even(const std::vector<int>& v) {
    for (int x : v) if (x % 2 == 0) return x;
    return std::nullopt;
}
auto r = first_even({3, 5, 8});
std::cout << *r;   // UB if empty`,
      note: '<code>std::optional</code> is the same idea, but nothing forces you to check before <code>*r</code>. In Rust, getting the value out means passing through a <code>match</code> or a method that handles <code>None</code>.',
    },
    starter: `fn first_even(v: &[i32]) -> Option<i32> {
    for x in v {
        if *x % 2 == 0 {
            return Some(*x);
        }
    }
    None
}

fn report(r: Option<i32>) {
    // print "found N" or "none"
}

fn main() {
    report(first_even(&[3, 5, 8, 9]));
    report(first_even(&[1, 3]));
}`,
    solution: `fn first_even(v: &[i32]) -> Option<i32> {
    for x in v {
        if *x % 2 == 0 {
            return Some(*x);
        }
    }
    None
}

fn report(r: Option<i32>) {
    match r {
        Some(n) => println!("found {}", n),
        None => println!("none"),
    }
}

fn main() {
    report(first_even(&[3, 5, 8, 9]));
    report(first_even(&[1, 3]));
}`,
    tests: [{ name: 'Prints found 8 and none', expected: 'found 8\nnone' }],
  },

  {
    id: 'r3-option-find',
    title: 'Write index_of',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>index_of(v: &amp;[i32], target: i32) -&gt; Option&lt;usize&gt;</code>: the position of the first element equal to <code>target</code>, or <code>None</code>.',
    refresher: [
      'Return <code>Some(i)</code> when found and <code>None</code> when not: the caller must handle both.',
      '<code>for i in 0..v.len()</code> counts positions; <code>v[i]</code> reads the element there.',
    ],
    hints: [
      'Loop over the positions and compare <code>v[i]</code> with <code>target</code>.',
      'Return <code>Some(i)</code> as soon as you find a match.',
      'After the loop, the last expression is <code>None</code>.',
    ],
    inCpp: {
      code: `int index_of(const std::vector<int>& v, int target) {
    for (size_t i = 0; i < v.size(); i++)
        if (v[i] == target) return (int)i;
    return -1;   // sentinel the caller must remember
}`,
      note: 'A <code>-1</code> sentinel can be used as an index by mistake. <code>None</code> cannot be used as a <code>usize</code>, so the mistake does not compile.',
    },
    starter: `fn index_of(v: &[i32], target: i32) -> Option<usize> {
    None
}`,
    solution: `fn index_of(v: &[i32], target: i32) -> Option<usize> {
    for i in 0..v.len() {
        if v[i] == target {
            return Some(i);
        }
    }
    None
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{:?}", index_of(&[4, 7, 9], 9));
    println!("\\n@@TEST 2@@");
    println!("{:?}", index_of(&[4, 7, 9], 5));
    println!("\\n@@TEST 3@@");
    println!("{:?}", index_of(&[2, 2, 2], 2));
    println!("\\n@@TEST 4@@");
    println!("{:?}", index_of(&[], 1));
}`,
    tests: [
      { name: 'Found at the end', input: '[4,7,9], 9', expected: 'Some(2)' },
      { name: 'Not found', input: '[4,7,9], 5', expected: 'None' },
      { name: 'First of several', input: '[2,2,2], 2', expected: 'Some(0)' },
      { name: 'Empty slice', input: '[], 1', expected: 'None' },
    ],
  },

  // ------------------------------------------------------------------------------------------
  // 10. closures (basics), needed before Option's map
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-closure-basics',
    title: 'Closures: small unnamed functions',
    kind: 'concept',
    introduces: ['closure'],
    teach: {
      body: [
        `<p>Many methods take a small piece of behaviour as an argument: "apply this to the value", "keep items where this is true". You pass that behaviour as a <em>closure</em>, a function written inline without a name. If you know C++ lambdas, it is the same idea: <code>[](int a, int b) { return a + b; }</code> in C++ is <code>|a, b| a + b</code> in Rust.</p>`,
        `<p>The parts: the parameters go between two vertical bars, <code>|a, b|</code>, and the body follows. A one-expression body needs no braces and no <code>return</code>. If the body is longer, use braces and the last expression is the result: <code>|x| { let y = x * 2; y + 1 }</code>. A closure with no parameters is written <code>||</code>. You can give types to the parameters, <code>|x: i32| x * x</code>, but usually you do not need to. The compiler works the types out from how you use the closure, and the first call fixes them for good.</p>`,
        `<p>You can keep a closure in a variable with <code>let</code> and call it with parentheses like a function: <code>add(2, 3)</code>. Most of the time you will not store it; you will write it directly in the argument list of a method, which is what the next lessons do. Closures also have a talent that plain functions lack, remembering variables from the code around them, which gets its own lesson soon. This lesson uses only the basic shape.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let add = |a, b| a + b;                  // two parameters, one expression
    let square = |x: i32| x * x;             // parameter with a type
    let step = |x: i32| {                    // a block body: last expression is the result
        let y = x * 2;
        y + 1
    };
    let hello = || println!("hello");        // no parameters

    println!("{}", add(2, 3));
    println!("{}", square(4));
    println!("{}", step(5));
    hello();
}`,
          output: '5\n16\n11\nhello',
        },
      ],
      terms: [
        { code: '|x| x + 1', meaning: 'a closure: parameters between bars, then the body' },
        { code: '|a, b| a * b', meaning: 'several parameters, separated by commas' },
        { code: '|| expr', meaning: 'a closure with no parameters' },
        { code: '|x| { ...; y }', meaning: 'a block body; the last expression is the result' },
        { code: 'let f = |x| ...; f(1)', meaning: 'keep a closure in a variable and call it like a function' },
      ],
    },
    task: 'The program calls <code>add</code> and <code>is_even</code>, which do not exist. Define both as closures with <code>let</code> so it prints <code>5</code> and then <code>true</code>.',
    compare: {
      cpp: { code: `auto add = [](int a, int b) { return a + b; };
auto is_even = [](int n) { return n % 2 == 0; };
std::cout << add(2, 3) << is_even(4);`, outcome: 'Lambda with [] and a return', ok: true },
      rust: { code: `let add = |a, b| a + b;
let is_even = |n: i32| n % 2 == 0;
println!("{} {}", add(2, 3), is_even(4));`, outcome: 'Bars instead of []; no return needed', ok: true },
      text: 'A Rust closure is a C++ lambda with <code>| |</code> for the parameters and no <code>return</code> for a one-expression body. The part C++ writes inside <code>[]</code> is automatic in Rust.',
    },
    refresher: [
      '<code>|a, b| a + b</code> is a closure; <code>let f = |x| x + 1;</code> stores one and <code>f(2)</code> calls it.',
      'A block body <code>{ ... }</code> yields its last expression.',
    ],
    hints: [
      'Write <code>let add = |a, b| a + b;</code> above the prints.',
      '<code>is_even</code> takes one number and returns a <code>bool</code>.',
    ],
    inCpp: {
      code: `int base = 10;
auto f = [base](int x) { return x + base; };   // capture list by hand`,
      note: 'C++ makes you write the capture list <code>[...]</code> by hand. Rust works out what a closure uses from its body, which a later lesson covers.',
    },
    starter: `fn main() {
    println!("{}", add(2, 3));
    println!("{}", is_even(4));
}`,
    solution: `fn main() {
    let add = |a, b| a + b;
    let is_even = |n: i32| n % 2 == 0;
    println!("{}", add(2, 3));
    println!("{}", is_even(4));
}`,
    require: [{ pattern: 'let\\s+add\\s*=\\s*\\|', message: 'Define add as a closure with let.' }],
    tests: [{ name: 'Prints 5 and true', expected: '5\ntrue' }],
  },

  // ------------------------------------------------------------------------------------------
  // 11. Option ergonomics
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-option-ergonomics',
    title: 'if let, unwrap_or and map',
    kind: 'concept',
    introduces: ['if-let', 'unwrap-or', 'map-method', 'option-methods'],
    teach: {
      body: [
        `<p>A full <code>match</code> on an <code>Option</code> is correct but wordy when you only care about one case. Rust has short forms for the common patterns. <code>if let Some(n) = opt { ... }</code> means "if <code>opt</code> is <code>Some</code>, bind its inside to <code>n</code> and run this block; otherwise skip it". It is a <code>match</code> with a single arm you care about. You can add an <code>else { ... }</code> for the other case. Note the single <code>=</code>: it is not a comparison, it means "try to match this pattern against this value".</p>`,
        `<p>When you just want a plain value, <code>opt.unwrap_or(default)</code> returns the inside if there is one and <code>default</code> otherwise. The result is an ordinary value (an <code>i32</code>, not an <code>Option</code>), so you can use it in arithmetic immediately. <code>opt.is_some()</code> and <code>opt.is_none()</code> answer "is there a value?" with a <code>bool</code>.</p>`,
        `<p>To change the inside without unwrapping it, use <code>opt.map(|n| n * 2)</code>. You just learned closures: the closure is the function to apply. <code>map</code> runs it on the inside of a <code>Some</code> and wraps the result in a new <code>Some</code>. A <code>None</code> stays <code>None</code> and the closure never runs. Chain it with <code>unwrap_or</code> and you have "double it, or 0 if missing" in one line. C++23 added <code>std::optional::transform</code> for the same idea; Rust has had <code>map</code> from the start, and it is the usual way to work with <code>Option</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = Some(5);
    let b: Option<i32> = None;

    println!("{} {}", a.is_some(), b.is_none());
    if let Some(n) = a {                         // runs only when a is Some
        println!("got {}", n);
    }
    println!("{}", b.unwrap_or(0));              // default when None
    println!("{:?}", a.map(|n| n * 2));          // change the inside
    println!("{:?}", b.map(|n| n * 2));          // None stays None
    println!("{}", a.map(|n| n * 2).unwrap_or(0));
}`,
          output: 'true true\ngot 5\n0\nSome(10)\nNone\n10',
        },
      ],
      terms: [
        { code: 'if let Some(n) = opt { }', meaning: 'run the block only if opt is Some, naming the inside n' },
        { code: 'opt.unwrap_or(d)', meaning: 'the inside of a Some, or d when None' },
        { code: 'opt.map(|n| ...)', meaning: 'apply the closure to the inside; None stays None' },
        { code: 'opt.is_some() / .is_none()', meaning: 'a bool: is there a value?' },
      ],
    },
    task: 'Write <code>double_or_zero</code>: twice the number inside, or <code>0</code> for <code>None</code>. Use <code>if let</code>, <code>unwrap_or</code> or <code>map</code>, not <code>match</code>.',
    compare: {
      cpp: { code: `std::optional<int> o = 5;
if (o) std::cout << *o + 1;   // *o: UB if empty
std::cout << o.value_or(0);`, outcome: 'Works; unchecked * is possible', ok: true },
      rust: { code: `let o = Some(5);
if let Some(n) = o {
    println!("{}", n + 1);
}
let e: Option<i32> = None;
println!("{}", e.unwrap_or(0));`, outcome: 'Prints 6 then 0', ok: true },
      text: '<code>if let</code> runs a block for one pattern and ignores the rest, <code>unwrap_or(d)</code> supplies a default, and <code>map</code> changes the inside. Each is a shorter <code>match</code>.',
    },
    refresher: [
      '<code>o.map(|n| n * 2)</code> gives <code>Some(2n)</code> or <code>None</code>; <code>o.unwrap_or(0)</code> turns it into a plain number.',
      '<code>if let Some(n) = o { ... }</code> skips the block when <code>o</code> is <code>None</code>.',
    ],
    hints: [
      '<code>unwrap_or(0)</code> turns an <code>Option&lt;i32&gt;</code> into an <code>i32</code>.',
      'Transform first with <code>map</code>, then supply the default.',
      'Or: start with a mutable result of <code>0</code> and use <code>if let</code> to change it.',
    ],
    inCpp: {
      code: `std::optional<int> o;
int d = o ? *o * 2 : 0;
// or: o.value_or(0) for a plain default`,
      note: 'C++23 adds <code>std::optional::transform</code> for the <code>map</code> idea. In Rust <code>map</code> is the everyday way to change what is inside an <code>Option</code>.',
    },
    starter: `fn double_or_zero(o: Option<i32>) -> i32 {
    0
}

fn main() {
    println!("{}", double_or_zero(Some(4)));
    println!("{}", double_or_zero(None));
}`,
    solution: `fn double_or_zero(o: Option<i32>) -> i32 {
    o.map(|n| n * 2).unwrap_or(0)
}

fn main() {
    println!("{}", double_or_zero(Some(4)));
    println!("{}", double_or_zero(None));
}`,
    forbidden: [{ pattern: '\\bmatch\\b', message: 'Use if let, unwrap_or or map instead of match.' }],
    tests: [{ name: 'Prints 8 and 0', expected: '8\n0' }],
  },

  {
    id: 'r3-option-not-value',
    title: 'An Option is not a number',
    kind: 'fix',
    introduces: [],
    task: 'Make this compile and print <code>8</code> then <code>1</code>. The second character is not a digit, so decide what number it should stand for.',
    errorCode: 'E0308',
    gloss: '<code>parse_digit</code> returns <code>Option&lt;u32&gt;</code>, which cannot be stored in a <code>u32</code> until you say what happens for <code>None</code>.',
    refresher: [
      '<code>c.to_digit(10)</code> gives <code>Some(n)</code> for <code>\'0\'..=\'9\'</code> and <code>None</code> otherwise.',
      'An <code>Option&lt;u32&gt;</code> and a <code>u32</code> are different types; no implicit unwrapping exists.',
    ],
    hints: [
      'Keep the type annotations: you are changing the right-hand sides.',
      'You need a default for the non-digit case.',
      'One method on <code>Option</code> takes that default as its argument.',
    ],
    inCpp: {
      code: `int parse_digit(char c) {
    return (c >= '0' && c <= '9') ? c - '0' : -1;
}
int b = parse_digit('x');   // -1 flows on silently
std::cout << b + 1;         // 0`,
      note: 'The sentinel <code>-1</code> is a valid <code>int</code>, so a missed check just flows on. An <code>Option</code> is a different type, so the missed check is a compile error.',
    },
    starter: `fn parse_digit(c: char) -> Option<u32> {
    c.to_digit(10)
}

fn main() {
    let a: u32 = parse_digit('7');
    let b: u32 = parse_digit('x');
    println!("{}", a + 1);
    println!("{}", b + 1);
}`,
    solution: `fn parse_digit(c: char) -> Option<u32> {
    c.to_digit(10)
}

fn main() {
    let a: u32 = parse_digit('7').unwrap_or(0);
    let b: u32 = parse_digit('x').unwrap_or(0);
    println!("{}", a + 1);
    println!("{}", b + 1);
}`,
    require: [
      { pattern: 'let\\s+a\\s*:\\s*u32', message: 'Keep a as a u32.' },
      { pattern: "parse_digit\\(\\s*'x'\\s*\\)", message: "Keep the call parse_digit('x')." },
    ],
    tests: [{ name: 'Prints 8 and 1', expected: '8\n1' }],
  },

  // ------------------------------------------------------------------------------------------
  // 12. Box for recursive types
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-box-recursive',
    title: 'Box for recursive types',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>In the ownership stage you met <code>Box&lt;T&gt;</code> as "a value on the heap with one owner" and were promised the reason it matters. Here it is. Think of a linked list in C++: <code>struct Node { int val; Node* next; };</code>. A node holds a pointer to the next node. What if Rust let a node hold the next node directly: <code>struct Node { val: i32, next: Option&lt;Node&gt; }</code>? To know how big a <code>Node</code> is, the compiler must add up its fields, and one field is a <code>Node</code>, which contains a <code>Node</code>, forever. The size is infinite, and the compiler refuses with error E0072, "recursive type has infinite size".</p>`,
        `<p>The fix is the same as in C++: put a pointer in between. A <code>Box&lt;Node&gt;</code> has a fixed size (just a pointer), however big the <code>Node</code> it points to. So the field becomes <code>next: Option&lt;Box&lt;Node&gt;&gt;</code>: "maybe a boxed next node". <code>None</code> ends the list, as <code>nullptr</code> does in C++, but now the type forces you to handle the end. You make a box with <code>Box::new(value)</code>, so a one-node list is <code>Some(Box::new(Node { val: 1, next: None }))</code>.</p>`,
        `<p>A list is also a recursive <em>value</em>, so a recursive function is the natural way to walk it: "an empty list has sum 0; a list with a node has that node's value plus the sum of the rest". You <code>match</code> on a reference to the list. When you match on a reference, the names in the pattern become references too, so <code>node</code> below is a reference to the boxed node. You can still write <code>node.val</code> and <code>&amp;node.next</code>: field access sees through references and through the <code>Box</code> automatically.</p>`,
        `<p>The same trick builds trees: <code>struct Tree { left: Option&lt;Box&lt;Tree&gt;&gt;, right: Option&lt;Box&lt;Tree&gt;&gt;, val: i32 }</code>. In C++ you would more likely have raw pointers or <code>unique_ptr</code>; the <code>Box</code> is a <code>unique_ptr</code> that is never null, and <code>Option</code> makes the "maybe null" part explicit.</p>`,
      ],
      examples: [
        {
          code: `struct Node {
    val: i32,
    next: Option<Box<Node>>,      // maybe a boxed next node
}

fn sum(list: &Option<Box<Node>>) -> i32 {
    match list {
        None => 0,                                  // empty list
        Some(node) => node.val + sum(&node.next),   // this value + the rest
    }
}

fn main() {
    let list = Some(Box::new(Node {
        val: 1,
        next: Some(Box::new(Node { val: 2, next: None })),
    }));
    println!("{}", sum(&list));
}`,
          output: '3',
        },
      ],
      terms: [
        { code: 'Option<Box<Node>>', meaning: 'maybe a heap-allocated next node; the usual recursive field' },
        { code: 'Box::new(value)', meaning: 'puts a value on the heap and returns the Box' },
        { code: 'Some(Box::new(...))', meaning: 'a present, boxed node; None marks the end' },
        { code: 'E0072', meaning: 'recursive type has infinite size: add a Box' },
      ],
    },
    task: 'This list type is rejected. Make <code>Node</code> compile by boxing the recursive field, so the program prints <code>6</code>.',
    compare: {
      cpp: { code: `struct Node {
    int val;
    std::unique_ptr<Node> next;   // pointer breaks the recursion
};`, outcome: 'Pointer gives a fixed size', ok: true },
      rust: { code: `struct Node { val: i32, next: Option<Node> }
let n = Node { val: 1, next: None };`, outcome: 'Error: recursive type has infinite size', ok: false, errorCode: 'E0072' },
      text: 'A C++ node that contained itself would not compile either, which is why the pointer is there. In Rust the pointer is a <code>Box</code>, and <code>Option</code> stands in for <code>nullptr</code>.',
    },
    refresher: [
      'A type that contains itself needs a <code>Box</code>: <code>next: Option&lt;Box&lt;Node&gt;&gt;</code>.',
      '<code>None</code> ends the list; <code>Some(Box::new(node))</code> adds a node.',
    ],
    hints: [
      'The error is about the field <code>next</code>: it needs something of fixed size.',
      'Change the field type to <code>Option&lt;Box&lt;Node&gt;&gt;</code>.',
    ],
    inCpp: {
      code: `struct Node {
    int val;
    Node* next = nullptr;   // forget to check: crash
};`,
      note: 'With a raw pointer or a <code>unique_ptr</code> the end of the list is a null check you can forget. Here the end is <code>None</code>, and <code>match</code> makes you handle it.',
    },
    starter: `struct Node {
    val: i32,
    next: Option<Node>,
}

fn sum(list: &Option<Box<Node>>) -> i32 {
    match list {
        None => 0,
        Some(node) => node.val + sum(&node.next),
    }
}

fn main() {
    let list = Some(Box::new(Node {
        val: 1,
        next: Some(Box::new(Node {
            val: 2,
            next: Some(Box::new(Node { val: 3, next: None })),
        })),
    }));
    println!("{}", sum(&list));
}`,
    solution: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

fn sum(list: &Option<Box<Node>>) -> i32 {
    match list {
        None => 0,
        Some(node) => node.val + sum(&node.next),
    }
}

fn main() {
    let list = Some(Box::new(Node {
        val: 1,
        next: Some(Box::new(Node {
            val: 2,
            next: Some(Box::new(Node { val: 3, next: None })),
        })),
    }));
    println!("{}", sum(&list));
}`,
    require: [{ pattern: 'Option\\s*<\\s*Box\\s*<\\s*Node', message: 'Box the recursive field.' }],
    tests: [{ name: 'Prints 6', expected: '6' }],
  },

  {
    id: 'r3-box-list',
    title: 'Write length for a list',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>length(list: &amp;Option&lt;Box&lt;Node&gt;&gt;) -&gt; usize</code>: how many nodes the list has. An empty list (<code>None</code>) has length 0. Use recursion.',
    refresher: [
      'Match on the list: <code>None</code> is the base case, <code>Some(node)</code> is "one node plus the rest".',
      'The rest of the list is <code>&amp;node.next</code>.',
    ],
    hints: [
      '<code>match list { None =&gt; 0, Some(node) =&gt; ... }</code>',
      'The length of a non-empty list is <code>1 +</code> the length of <code>&amp;node.next</code>.',
    ],
    inCpp: {
      code: `struct Node {
    int val;
    std::unique_ptr<Node> next;
};
size_t length(const Node* n) {
    return n == nullptr ? 0 : 1 + length(n->next.get());
}`,
      note: 'The C++ base case is a null check. In Rust the base case is the <code>None</code> arm, and the compiler will not let you skip it.',
    },
    starter: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

fn push_front(list: Option<Box<Node>>, val: i32) -> Option<Box<Node>> {
    Some(Box::new(Node { val, next: list }))
}

fn length(list: &Option<Box<Node>>) -> usize {
    0
}`,
    solution: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

fn push_front(list: Option<Box<Node>>, val: i32) -> Option<Box<Node>> {
    Some(Box::new(Node { val, next: list }))
}

fn length(list: &Option<Box<Node>>) -> usize {
    match list {
        None => 0,
        Some(node) => 1 + length(&node.next),
    }
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    let a: Option<Box<Node>> = None;
    println!("{}", length(&a));

    println!("\\n@@TEST 2@@");
    let mut b: Option<Box<Node>> = None;
    b = push_front(b, 7);
    println!("{}", length(&b));

    println!("\\n@@TEST 3@@");
    let mut c: Option<Box<Node>> = None;
    for k in 0..3 {
        c = push_front(c, k);
    }
    println!("{}", length(&c));

    println!("\\n@@TEST 4@@");
    let mut d: Option<Box<Node>> = None;
    for k in 0..6 {
        d = push_front(d, k * 10);
    }
    println!("{}", length(&d));
}`,
    tests: [
      { name: 'Empty list', input: 'None', expected: '0' },
      { name: 'One node', input: '1 node', expected: '1' },
      { name: 'Three nodes', input: '3 nodes', expected: '3' },
      { name: 'Six nodes', input: '6 nodes', expected: '6' },
    ],
  },

  // ------------------------------------------------------------------------------------------
  // 13. text methods
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-string-methods',
    title: 'Text methods: trim, split, to_string',
    kind: 'concept',
    introduces: ['string-methods', 'to-string', 'is-empty'],
    teach: {
      body: [
        `<p>Real input is messy: spaces around words, comma separated numbers, mixed case. Rust's text types come with many methods for cleaning it up. You call them with a dot on a <code>&amp;str</code> or a <code>String</code>. The ones you need most: <code>.trim()</code> strips whitespace from both ends and gives back a <code>&amp;str</code> view of what remains (no copy). <code>.to_uppercase()</code> and <code>.to_lowercase()</code> build a new <code>String</code>. <code>.starts_with("ab")</code> and <code>.ends_with("yz")</code> return a <code>bool</code>. <code>.replace("a", "b")</code> returns a new <code>String</code> with every match replaced.</p>`,
        `<p><code>.len()</code> works on text too, counting <em>bytes</em> as you learned in stage 2, and <code>.is_empty()</code> says whether there are none, which is easier to read than <code>len() == 0</code> (it works on a <code>Vec</code> as well). <code>.to_string()</code> turns a <code>&amp;str</code> (or a number) into an owned <code>String</code>: <code>"hi".to_string()</code> does the same as <code>String::from("hi")</code>.</p>`,
        `<p>To cut text into pieces, <code>.split(',')</code> gives the pieces between each comma, and <code>.split_whitespace()</code> splits on runs of spaces. They do not return a <code>Vec</code>; they return something you can loop over with <code>for</code>, one piece at a time (that something is an <em>iterator</em>, which a later lesson explains properly). Each piece is a <code>&amp;str</code> borrowed from the original text. Note the character in <code>.split(',')</code> is a <code>char</code> in single quotes, though a <code>&amp;str</code> like <code>", "</code> works too.</p>`,
        `<p>A rule of thumb that decides what each method gives back: if the result is a part of the original text, it is a <code>&amp;str</code> view. If the text had to change, it is a new <code>String</code>. Methods that return a view need no extra memory, and the borrow rules from stage 2 apply to them as usual.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let raw = "  Hello, World  ";
    let t = raw.trim();                          // a view without the outer spaces
    println!("[{}]", t);
    println!("{}", t.to_uppercase());            // a new String
    println!("{} {}", t.starts_with("Hell"), t.ends_with("x"));
    println!("{}", t.replace("l", "L"));
    println!("{} {}", t.len(), t.is_empty());
    let owned: String = "abc".to_string();       // &str to String
    println!("{}", owned);
}`,
          output: '[Hello, World]\nHELLO, WORLD\ntrue false\nHeLLo, WorLd\n12 false\nabc',
        },
        {
          code: `fn main() {
    for part in "a,b,c".split(',') {             // loop over the pieces
        println!("{}", part);
    }
    for word in "  one   two three ".split_whitespace() {
        println!("<{}>", word);
    }
}`,
          output: 'a\nb\nc\n<one>\n<two>\n<three>',
        },
      ],
      terms: [
        { code: 's.trim()', meaning: 'a &str without leading and trailing whitespace' },
        { code: 's.to_uppercase()', meaning: 'a new String in capitals (to_lowercase likewise)' },
        { code: 's.starts_with("x") / .ends_with("x")', meaning: 'a bool' },
        { code: 's.replace("a", "b")', meaning: 'a new String with every "a" replaced' },
        { code: 's.split(\',\')', meaning: 'the pieces between commas, usable in a for loop' },
        { code: 's.split_whitespace()', meaning: 'the words, ignoring runs of spaces' },
        { code: 's.to_string()', meaning: 'an owned String copy of a &str (or a number)' },
        { code: 's.is_empty()', meaning: 'true when there are no bytes' },
      ],
    },
    task: 'Write <code>shout(s: &amp;str) -&gt; String</code>: trim the text, make it uppercase and add <code>!</code> at the end. <code>"  hello "</code> becomes <code>HELLO!</code>.',
    compare: {
      cpp: { code: `std::string s = "  hello ";
// no trim in the standard library:
auto b = s.find_first_not_of(' ');
auto e = s.find_last_not_of(' ');
s = s.substr(b, e - b + 1);
for (auto& c : s) c = toupper(c);`, outcome: 'Several steps by hand', ok: true },
      rust: { code: `let s = "  hello ";
let t = s.trim().to_uppercase();
println!("{}", t);`, outcome: 'Prints HELLO', ok: true },
      text: 'C++ has no <code>trim</code> or <code>split</code> in the standard library, so people write them by hand or reach for a library. Rust ships them as methods, and they return views where they can.',
    },
    refresher: [
      '<code>.trim()</code>, <code>.to_uppercase()</code>, <code>.replace(a, b)</code>, <code>.starts_with(x)</code>; <code>.split(c)</code> gives pieces to loop over.',
      'A view of the original text is a <code>&amp;str</code>; text that had to change is a new <code>String</code>.',
    ],
    hints: [
      'Chain the calls: <code>s.trim().to_uppercase()</code>.',
      '<code>format!("{}!", text)</code> builds the final <code>String</code>.',
    ],
    inCpp: {
      code: `std::istringstream in("a,b,c");
std::string part;
while (std::getline(in, part, ',')) { /* use part */ }`,
      note: 'Splitting in C++ usually goes through a stream and <code>getline</code>. In Rust it is one method, and each piece is a view into the original text.',
    },
    starter: `fn shout(s: &str) -> String {
    s.to_string()
}

fn main() {
    println!("{}", shout("  hello "));
    println!("{}", shout("go"));
}`,
    solution: `fn shout(s: &str) -> String {
    format!("{}!", s.trim().to_uppercase())
}

fn main() {
    println!("{}", shout("  hello "));
    println!("{}", shout("go"));
}`,
    require: [{ pattern: '\\.trim\\s*\\(', message: 'Use trim on the text.' }],
    tests: [{ name: 'Prints HELLO! and GO!', expected: 'HELLO!\nGO!' }],
  },

  // ------------------------------------------------------------------------------------------
  // 14. Result
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-result-idea',
    title: 'Result instead of exceptions',
    kind: 'concept',
    introduces: ['result', 'turbofish'],
    teach: {
      body: [
        `<p><code>Option</code> says "there may be no answer". Sometimes you also want to know <em>why</em> there is none: the text was not a number, the file was missing, the divisor was zero. C++ signals that with an exception: <code>std::stoi("abc")</code> throws, nothing in the function's signature mentions it, and the throw may fly past ten stack frames before something catches it (or the program dies). Rust has no exceptions. A function that can fail says so in its return type.</p>`,
        `<p><code>Result&lt;T, E&gt;</code> is another enum from the standard library. <code>Ok(value)</code> carries the success value of type <code>T</code>. <code>Err(error)</code> carries the error of type <code>E</code>. A function returns <code>Result&lt;i32, String&gt;</code> to say "an <code>i32</code> on success, a <code>String</code> message on failure". As with <code>Option</code>, you cannot use the value without handling the <code>Err</code>, so ignoring a failure takes a visible step.</p>`,
        `<p>A first source: a string's <code>.parse()</code> method turns text into a number. Which kind of number? You tell it with <code>.parse::&lt;i32&gt;()</code>. The <code>::&lt;i32&gt;</code> part, nicknamed the <em>turbofish</em>, fills in a type for a function that cannot guess it, here "parse into an <code>i32</code>". The result is <code>Ok(42)</code> for <code>"42"</code> and an <code>Err</code> carrying a <code>ParseIntError</code> for <code>"4x"</code>. Printing that error with <code>{}</code> gives a readable sentence.</p>`,
        `<p>To make your own, return <code>Ok(x)</code> or <code>Err(e)</code>. Nothing is thrown: <code>return Err(...)</code> is an ordinary early return, and the caller receives it as an ordinary value. Printing a whole <code>Result</code> with <code>{:?}</code> shows <code>Ok(3)</code> or <code>Err("divide by zero")</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let good = "42".parse::<i32>();       // Ok(42)
    let bad = "4x".parse::<i32>();        // Err(...)
    match good {
        Ok(n) => println!("number {}", n),
        Err(e) => println!("error: {}", e),
    }
    match bad {
        Ok(n) => println!("number {}", n),
        Err(e) => println!("error: {}", e),
    }
}`,
          output: 'number 42\nerror: invalid digit found in string',
        },
        {
          code: `fn safe_div(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err(String::from("divide by zero"));   // an ordinary early return
    }
    Ok(a / b)                                         // success
}

fn main() {
    println!("{:?}", safe_div(7, 2));
    println!("{:?}", safe_div(1, 0));
}`,
          output: 'Ok(3)\nErr("divide by zero")',
        },
      ],
      terms: [
        { code: 'Result<T, E>', meaning: 'Ok(a T) on success or Err(an E) on failure' },
        { code: 'Ok(x) / Err(e)', meaning: 'the two variants; build them and match on them' },
        { code: 's.parse::<i32>()', meaning: 'turns text into an i32; gives a Result' },
        { code: '::<T>', meaning: 'the "turbofish": names a type for a function that cannot infer it' },
      ],
    },
    task: 'Write <code>describe</code>: for text that parses as a <code>u8</code> return <code>age N</code>, otherwise <code>not a number</code>.',
    compare: {
      cpp: { code: `int n = std::stoi("abc");
// stoi throws std::invalid_argument;
// nothing in its signature says so`, outcome: 'Throws; the type hides the failure', ok: true },
      rust: { code: `let r = "abc".parse::<i32>();
match r {
    Ok(n) => println!("{}", n),
    Err(e) => println!("bad: {}", e),
}`, outcome: 'Prints bad: invalid digit found in string', ok: true },
      text: 'Failure is an ordinary value in the return type: <code>Ok</code> or <code>Err</code>. A caller has to handle the <code>Err</code> before it can touch the value.',
    },
    refresher: [
      '<code>Result&lt;T, E&gt;</code> is <code>Ok(value)</code> or <code>Err(error)</code>. <code>"7".parse::&lt;u8&gt;()</code> is one.',
      'Match both arms; <code>Err(e)</code> prints with <code>{}</code> as a short message.',
    ],
    hints: [
      'Call <code>s.parse::&lt;u8&gt;()</code> and <code>match</code> on it.',
      'In the <code>Ok(n)</code> arm build the text with <code>format!</code>.',
      'A number like 300 does not fit in a <code>u8</code>, so it is an <code>Err</code>.',
    ],
    inCpp: {
      code: `void run(const std::string& s) {
    try {
        int n = std::stoi(s);
        std::cout << n;
    } catch (const std::exception& e) {
        std::cout << e.what();
    }
}`,
      note: 'C++ separates the success path from a <code>catch</code> that may be far away. In Rust both outcomes arrive at the same place, as the two arms of a <code>match</code>.',
    },
    starter: `fn describe(s: &str) -> String {
    String::new()
}

fn main() {
    println!("{}", describe("30"));
    println!("{}", describe("abc"));
    println!("{}", describe("300"));
}`,
    solution: `fn describe(s: &str) -> String {
    match s.parse::<u8>() {
        Ok(n) => format!("age {}", n),
        Err(_) => String::from("not a number"),
    }
}

fn main() {
    println!("{}", describe("30"));
    println!("{}", describe("abc"));
    println!("{}", describe("300"));
}`,
    require: [{ pattern: 'parse', message: 'Use parse.' }],
    tests: [{ name: 'Prints age 30 and two errors', expected: 'age 30\nnot a number\nnot a number' }],
  },

  {
    id: 'r3-result-halve',
    title: 'Write halve',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>halve(s: &amp;str) -&gt; Result&lt;i32, String&gt;</code>: parse <code>s</code> as <code>i32</code> (error <code>bad number: S</code> if it fails), then return half of it, or the error <code>odd number</code> if it is odd.',
    refresher: [
      'Build errors with <code>Err(String::from("..."))</code> or <code>Err(format!("..."))</code>.',
      '<code>match s.parse::&lt;i32&gt;()</code> gives <code>Ok(n)</code> or <code>Err(_)</code>; <code>n % 2 != 0</code> means odd.',
    ],
    hints: [
      'Match the parse result first. On <code>Err(_)</code> return your own <code>Err</code>.',
      'Inside <code>Ok(n)</code> use an <code>if</code> for the odd case.',
      'The success value is <code>Ok(n / 2)</code>.',
    ],
    inCpp: {
      code: `int halve(const std::string& s) {
    int n = std::stoi(s);                      // may throw
    if (n % 2 != 0) throw std::runtime_error("odd number");
    return n / 2;
}`,
      note: 'Both failures are exceptions in C++. In Rust both are <code>Err</code> values, and the signature admits it.',
    },
    starter: `fn halve(s: &str) -> Result<i32, String> {
    Ok(0)
}`,
    solution: `fn halve(s: &str) -> Result<i32, String> {
    match s.parse::<i32>() {
        Ok(n) => {
            if n % 2 != 0 {
                Err(String::from("odd number"))
            } else {
                Ok(n / 2)
            }
        }
        Err(_) => Err(format!("bad number: {}", s)),
    }
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{:?}", halve("10"));
    println!("\\n@@TEST 2@@");
    println!("{:?}", halve("7"));
    println!("\\n@@TEST 3@@");
    println!("{:?}", halve("x"));
    println!("\\n@@TEST 4@@");
    println!("{:?}", halve("-8"));
}`,
    tests: [
      { name: 'Even', input: '"10"', expected: 'Ok(5)' },
      { name: 'Odd', input: '"7"', expected: 'Err("odd number")' },
      { name: 'Not a number', input: '"x"', expected: 'Err("bad number: x")' },
      { name: 'Negative even', input: '"-8"', expected: 'Ok(-4)' },
    ],
  },

  // ------------------------------------------------------------------------------------------
  // 15. the ? operator
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-question-mark',
    title: 'The ? operator',
    kind: 'concept',
    introduces: ['question-mark'],
    teach: {
      body: [
        `<p>When one failing step follows another, matching every <code>Result</code> gets long: parse the first, return the error if it failed, parse the second, return the error if it failed. That "pass the error up" pattern is so common that Rust gives it one character: <code>?</code>. Written right after an expression that is a <code>Result</code>, it means: "if this is <code>Ok(x)</code>, evaluate to <code>x</code> and carry on; if it is <code>Err(e)</code>, return <code>Err(e)</code> from this function right now".</p>`,
        `<p>So <code>let x = a.parse::&lt;i32&gt;()?;</code> gives you a plain <code>i32</code> in <code>x</code>, and a failure leaves the whole function early with the error. It is shorthand for the <code>match</code> with an early <code>return</code>, and it is the closest Rust comes to an exception that propagates, except that every <code>?</code> is visible in the code and the signature says <code>Result</code>. For this to type check, the function must itself return a <code>Result</code> with a compatible error type. Using <code>?</code> in a function that returns <code>()</code> or <code>i32</code> is a compile error.</p>`,
        `<p>The error type of <code>.parse::&lt;i32&gt;()</code> is <code>std::num::ParseIntError</code>. The functions below return <code>Result&lt;i32, std::num::ParseIntError&gt;</code> so the error can pass through unchanged. (A later lesson shows how to convert between error types.)</p>`,
        `<p><code>?</code> also works on <code>Option</code> inside a function that returns <code>Option</code>: a <code>None</code> returns <code>None</code> immediately, and a <code>Some(x)</code> gives you <code>x</code>.</p>`,
      ],
      examples: [
        {
          code: `fn add_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let x = a.parse::<i32>()?;      // on Err: return it from add_strs now
    let y = b.parse::<i32>()?;
    Ok(x + y)
}

fn first_plus_one(v: &[i32]) -> Option<i32> {
    let first = v.get(0)?;          // on None: return None now
    Some(*first + 1)
}

fn main() {
    println!("{:?}", add_strs("2", "40"));
    println!("{:?}", add_strs("2", "x"));
    println!("{:?}", first_plus_one(&[9, 8]));
    println!("{:?}", first_plus_one(&[]));
}`,
          output: 'Ok(42)\nErr(ParseIntError { kind: InvalidDigit })\nSome(10)\nNone',
        },
      ],
      terms: [
        { code: 'expr?', meaning: 'on Ok(x) or Some(x) give x; on Err or None return it from this function' },
        { code: 'Result<i32, std::num::ParseIntError>', meaning: 'the return type for a function that parses and uses ?' },
      ],
    },
    task: 'This <code>add_strs</code> works but spells out each early return. Rewrite it with <code>?</code> and no <code>match</code>; it should still print <code>Ok(7)</code> and then an <code>Err</code>.',
    compare: {
      cpp: { code: `int add_strs(const std::string& a, const std::string& b) {
    int x = std::stoi(a);   // throws past us, invisible here
    int y = std::stoi(b);
    return x + y;
}`, outcome: 'Failure path is implicit', ok: true },
      rust: { code: `fn add_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let x = a.parse::<i32>()?;
    let y = b.parse::<i32>()?;
    Ok(x + y)
}`, outcome: 'Each ? marks a possible early return', ok: true },
      text: 'Exceptions propagate without a mark; in Rust each <code>?</code> shows where the function may return early, and the <code>Result</code> in the signature admits it.',
    },
    refresher: [
      '<code>expr?</code> unwraps an <code>Ok</code> or returns the <code>Err</code> from the current function.',
      'The enclosing function must return a <code>Result</code> (or an <code>Option</code> for <code>?</code> on an <code>Option</code>).',
    ],
    hints: [
      'Replace each <code>match</code> with <code>a.parse::&lt;i32&gt;()?</code>.',
      'The last line is <code>Ok(x + y)</code>.',
    ],
    inCpp: {
      code: `#include <expected>
std::expected<int, std::string> parse(const std::string& s);
std::expected<int, std::string> add(const std::string& a, const std::string& b) {
    auto x = parse(a);
    if (!x) return std::unexpected(x.error());   // manual propagation
    auto y = parse(b);
    if (!y) return std::unexpected(y.error());
    return *x + *y;
}`,
      note: 'C++23 <code>std::expected</code> is the closest relative of <code>Result</code>, but it has no <code>?</code>; you write the early return yourself every time.',
    },
    cppStd: 23,
    starter: `fn add_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let x = match a.parse::<i32>() {
        Ok(n) => n,
        Err(e) => return Err(e),
    };
    let y = match b.parse::<i32>() {
        Ok(n) => n,
        Err(e) => return Err(e),
    };
    Ok(x + y)
}

fn main() {
    println!("{:?}", add_strs("3", "4"));
    println!("{:?}", add_strs("3", "four"));
}`,
    solution: `fn add_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let x = a.parse::<i32>()?;
    let y = b.parse::<i32>()?;
    Ok(x + y)
}

fn main() {
    println!("{:?}", add_strs("3", "4"));
    println!("{:?}", add_strs("3", "four"));
}`,
    require: [{ pattern: 'parse::<i32>\\(\\)\\?', message: 'Use ? after parse.' }],
    forbidden: [{ pattern: '\\bmatch\\b', message: 'Use ? instead of match.' }],
    tests: [{ name: 'Prints Ok(7) and an Err', expected: 'Ok(7)\nErr(ParseIntError { kind: InvalidDigit })' }],
  },

  // ------------------------------------------------------------------------------------------
  // 16. unwrap and expect
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-unwrap-expect',
    title: 'unwrap, expect and panics',
    kind: 'concept',
    introduces: ['unwrap', 'panic-macro'],
    teach: {
      body: [
        `<p>Sometimes you know a <code>Result</code> or <code>Option</code> cannot be the failing case, or you are writing a quick test and a crash is acceptable. For those moments there is <code>.unwrap()</code>: it gives the inside of an <code>Ok</code> or a <code>Some</code>, and <em>panics</em> on an <code>Err</code> or <code>None</code>. A panic stops the program with an error message and the line where it happened. It is Rust's "this should never happen" crash, comparable to a failed <code>assert</code> or an uncaught exception in C++.</p>`,
        `<p><code>.expect("message")</code> is <code>unwrap</code> with your own message added to the panic, which tells you later <em>why</em> you thought it could not fail: <code>"8080".parse::&lt;u16&gt;().expect("port must be a number")</code>. Prefer <code>expect</code> over <code>unwrap</code> when it can be written.</p>`,
        `<p>You can also panic on purpose with the <code>panic!</code> macro: <code>panic!("bad state: {}", x)</code> takes a message just like <code>println!</code> and stops the program. Use it for impossible situations, a bug in your own code. Do not use it for failures that can happen in normal use, such as a missing file or bad user input. For those return <code>Result</code> or <code>Option</code> and let the caller decide.</p>`,
        `<p>A rule that serves well: <code>unwrap</code> and <code>expect</code> are fine in tests, in examples, and where a bug is the only way to reach the failing case. In library-style code that other code calls, prefer <code>?</code>, <code>match</code> or <code>unwrap_or</code>. Remember that a panic is not an exception: you do not catch it in ordinary code, it ends the program.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let port: u16 = "8080".parse().unwrap();                     // would panic on bad text
    let n = "12".parse::<i32>().expect("n must be a number");    // panic message is ours
    let first = Some(3).unwrap();
    println!("{} {} {}", port, n, first);
}`,
          output: '8080 12 3',
          caption: 'Here <code>parse()</code> has no turbofish because the type annotation <code>u16</code> on the variable tells it what to parse.',
        },
      ],
      terms: [
        { code: 'x.unwrap()', meaning: 'the inside of Ok/Some; panics on Err/None' },
        { code: 'x.expect("why")', meaning: 'like unwrap, with your message in the panic' },
        { code: 'panic!("msg {}", v)', meaning: 'stop the program with a message' },
      ],
    },
    task: 'Parse <code>"8080"</code> into a <code>u16</code> called <code>port</code> using <code>expect</code> (message <code>port must be a number</code>), then print <code>port + 1</code>. Expected output: <code>8081</code>.',
    compare: {
      cpp: { code: `std::optional<int> o;
int a = o.value();     // throws bad_optional_access
int b = *o;            // undefined behaviour`, outcome: 'Throws or UB', ok: true },
      rust: { code: `let o: Option<i32> = None;
let a = o.unwrap();`, outcome: 'Panics (stops the program), never UB', ok: true },
      text: 'A failing <code>unwrap</code> is a defined, immediate stop with a message and line number. It never becomes undefined behaviour like <code>*o</code> on an empty <code>std::optional</code>.',
    },
    refresher: [
      '<code>unwrap()</code> and <code>expect("msg")</code> give the inside, or panic on <code>Err</code>/<code>None</code>.',
      '<code>panic!</code> is for bugs and impossible states, not for expected failures.',
    ],
    hints: [
      'Write <code>let port: u16 = "8080".parse().expect("...");</code>.',
      'The annotation on <code>port</code> tells <code>parse</code> which type to produce.',
    ],
    inCpp: {
      code: `void f(int* ptr) {
    assert(ptr != nullptr);        // gone under -DNDEBUG
    throw std::logic_error("bug");
}`,
      note: 'C++ <code>assert</code> vanishes in release builds and a thrown exception can be caught anywhere. A Rust panic is always on and normally ends the program.',
    },
    starter: `fn main() {
    let port = "8080";
    println!("{}", port + 1);
}`,
    solution: `fn main() {
    let port: u16 = "8080".parse().expect("port must be a number");
    println!("{}", port + 1);
}`,
    require: [{ pattern: '\\.expect\\s*\\(', message: 'Use expect.' }],
    forbidden: [{ pattern: '\\bmatch\\b', message: 'Use expect instead of match.' }],
    tests: [{ name: 'Prints 8081', expected: '8081' }],
  },

  {
    id: 'r3-unwrap-panics',
    title: 'What does unwrap do here?',
    kind: 'predict',
    introduces: [],
    task: 'For each program, pick what you expect, then compile and run it.',
    refresher: [
      '<code>unwrap()</code> on <code>None</code> or <code>Err</code> panics; <code>expect</code> adds your message.',
      'A panic message shows the text after "panicked at": the program stops there.',
    ],
    inCpp: {
      code: `std::vector<int> v;
int x = v.at(0);   // throws std::out_of_range
int y = v[0];      // undefined behaviour`,
      note: '<code>.at</code> throws and <code>[]</code> is undefined behaviour in C++. A Rust <code>.get(0).unwrap()</code> always stops cleanly with a message.',
    },
    rounds: [
      {
        snippet: `fn main() {
    let v: Vec<i32> = Vec::new();
    let first = v.get(0).unwrap();
    println!("{}", first);
}`,
        choices: ['Prints 0', 'Panics: unwrap on a None value', 'Does not compile'],
        answer: 1,
        why: 'The vector is empty, so <code>get(0)</code> is <code>None</code> and <code>unwrap</code> panics before the print.',
        panic: true,
        output: 'called `Option::unwrap()` on a `None` value',
      },
      {
        snippet: `fn main() {
    let n: i32 = "x7".parse().expect("bad number");
    println!("{}", n);
}`,
        choices: ['Prints 7', 'Panics with "bad number" and the parse error', 'Does not compile'],
        answer: 1,
        why: '<code>"x7"</code> is not a number, so <code>parse</code> gives an <code>Err</code>, and <code>expect</code> panics with your message plus the error.',
        panic: true,
        output: 'bad number: ParseIntError { kind: InvalidDigit }',
      },
    ],
  },

  {
    id: 'r3-sum-csv',
    title: 'Sum a list with ?',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>sum_csv(s: &amp;str) -&gt; Result&lt;i32, std::num::ParseIntError&gt;</code>: split <code>s</code> on commas, trim and parse each piece, and return the total, or the first parse error.',
    refresher: [
      '<code>for part in s.split(\',\')</code> loops over the pieces; <code>part.trim().parse::&lt;i32&gt;()?</code> gets a number or leaves early.',
      'Finish with <code>Ok(total)</code>.',
    ],
    hints: [
      'Keep a <code>let mut total = 0;</code> and add to it in the loop.',
      'Use <code>?</code> on the parse so a bad piece returns its error.',
      'An empty string is not a number: <code>"".parse::&lt;i32&gt;()</code> is an <code>Err</code>.',
    ],
    inCpp: {
      code: `int sum_csv(const std::string& s) {
    std::stringstream in(s);
    std::string part;
    int total = 0;
    while (std::getline(in, part, ',')) total += std::stoi(part);   // may throw
    return total;
}`,
      note: 'The C++ version throws on the first bad piece from deep inside the loop. The Rust version hands that error back to the caller as a normal value.',
    },
    starter: `fn sum_csv(s: &str) -> Result<i32, std::num::ParseIntError> {
    Ok(0)
}`,
    solution: `fn sum_csv(s: &str) -> Result<i32, std::num::ParseIntError> {
    let mut total = 0;
    for part in s.split(',') {
        total += part.trim().parse::<i32>()?;
    }
    Ok(total)
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{:?}", sum_csv("1,2,3"));
    println!("\\n@@TEST 2@@");
    println!("{:?}", sum_csv("10, 20"));
    println!("\\n@@TEST 3@@");
    println!("{:?}", sum_csv("4,x"));
    println!("\\n@@TEST 4@@");
    println!("{:?}", sum_csv(""));
}`,
    tests: [
      { name: 'Simple list', input: '"1,2,3"', expected: 'Ok(6)' },
      { name: 'Spaces around numbers', input: '"10, 20"', expected: 'Ok(30)' },
      { name: 'Bad piece', input: '"4,x"', expected: 'Err(ParseIntError { kind: InvalidDigit })' },
      { name: 'Empty text', input: '""', expected: 'Err(ParseIntError { kind: Empty })' },
    ],
  },
]
