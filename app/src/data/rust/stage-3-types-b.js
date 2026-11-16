// Rust lessons: stage 3 part B, types that replace C++ habits (traits, generics, std traits, closures, iterators, patterns).
// Check with: RUST_MIGRATED=2 node scripts/verify-rust.mjs --stage 3 (see part A for the rules).

export const LESSONS = [

  // ------------------------------------------------------------------------------------------
  // 17. traits
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-trait-define',
    title: 'Traits as interfaces',
    kind: 'concept',
    introduces: ['trait', 'trait-impl'],
    teach: {
      body: [
        `<p>You have used traits without defining one: <code>Debug</code>, <code>Clone</code>, <code>PartialEq</code>, <code>Copy</code> and <code>Drop</code> are all traits. A <em>trait</em> is a named list of methods that a type can promise to have. It is Rust's version of an interface, or of a C++ abstract base class where every function is pure virtual. You declare one with <code>trait</code>, a name, and the method <em>signatures</em> (no bodies, just the type, ending in <code>;</code>).</p>`,
        `<p>A type opts in with a separate block, <code>impl TraitName for TypeName { ... }</code>, that gives the bodies. Read it as "implement this trait for that type". Every method the trait lists must be there, with matching signatures. Afterwards you call the methods with a dot, like any other: <code>d.describe()</code>. The compiler tells you if you forget one.</p>`,
        `<p>This is different from C++ inheritance in two ways that matter. First, the relationship lives outside the type: you do not edit <code>struct Dog</code> to say it implements something, you add an <code>impl ... for Dog</code> block anywhere in the program, even for a type you did not write (you can implement your own trait for <code>i32</code>, which is impossible in C++). Second, there is no base subobject and no data inheritance: a trait is only behaviour. A type may implement as many traits as you like.</p>`,
        `<p>On its own a trait only lets you call the method on a known type. Using one trait to write code that works for many types comes next, with generics, <code>impl Trait</code> and <code>dyn Trait</code>.</p>`,
      ],
      examples: [
        {
          code: `trait Describe {                       // a promise: "I can describe myself"
    fn describe(&self) -> String;      // signature only, no body
}

struct Dog {
    name: String,
}
struct Cat {
    lives: u32,
}

impl Describe for Dog {                // Dog keeps its promise
    fn describe(&self) -> String {
        format!("dog {}", self.name)
    }
}

impl Describe for Cat {
    fn describe(&self) -> String {
        format!("cat with {} lives", self.lives)
    }
}

fn main() {
    let d = Dog { name: String::from("Rex") };
    let c = Cat { lives: 9 };
    println!("{}", d.describe());
    println!("{}", c.describe());
}`,
          output: 'dog Rex\ncat with 9 lives',
        },
      ],
      terms: [
        { code: 'trait Name { fn m(&self) -> T; }', meaning: 'declares an interface: method signatures with no bodies' },
        { code: 'impl Name for Type { ... }', meaning: 'Type promises Name and supplies the bodies' },
        { code: 'x.m()', meaning: 'calls the method, once the impl exists' },
      ],
    },
    task: '<code>Cat</code> has not kept the <code>Describe</code> promise yet. Add <code>impl Describe for Cat</code> returning <code>cat with N lives</code>, so the program prints <code>dog Rex</code> and then <code>cat with 9 lives</code>.',
    compare: {
      cpp: { code: `struct Describe {
    virtual std::string describe() const = 0;
    virtual ~Describe() = default;
};
struct Dog : Describe {
    std::string name;
    std::string describe() const override { return "dog " + name; }
};`, outcome: 'Edit the class to inherit', ok: true },
      rust: { code: `trait Describe { fn describe(&self) -> String; }
struct Dog { name: String }
impl Describe for Dog {
    fn describe(&self) -> String { format!("dog {}", self.name) }
}`, outcome: 'Separate impl block; no base class', ok: true },
      text: 'A trait is like a C++ abstract class with only pure virtual functions, except that a type joins it in a separate <code>impl</code> block rather than by inheriting. A trait carries no data and costs nothing until you ask for dynamic dispatch.',
    },
    refresher: [
      '<code>trait T { fn m(&amp;self) -&gt; String; }</code> lists methods; <code>impl T for X { ... }</code> supplies them.',
      'Every method in the trait must appear in the <code>impl</code>, with the same signature.',
    ],
    hints: [
      'Copy the <code>impl Describe for Dog</code> block and change the type and the body.',
      'Use <code>format!("cat with {} lives", self.lives)</code>.',
    ],
    inCpp: {
      code: `// C++20 concept: a compile-time interface with no base class
template <typename T>
concept Describable = requires(const T& t) { { t.describe() } -> std::convertible_to<std::string>; };`,
      note: 'The nearest C++ relatives are an abstract base class (runtime) and a C++20 concept (compile time). A Rust trait can serve both roles, as the next lessons show.',
    },
    cppStd: 20,
    starter: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}
struct Cat {
    lives: u32,
}

impl Describe for Dog {
    fn describe(&self) -> String {
        format!("dog {}", self.name)
    }
}

fn main() {
    let d = Dog { name: String::from("Rex") };
    let c = Cat { lives: 9 };
    println!("{}", d.describe());
    println!("{}", c.describe());
}`,
    solution: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}
struct Cat {
    lives: u32,
}

impl Describe for Dog {
    fn describe(&self) -> String {
        format!("dog {}", self.name)
    }
}

impl Describe for Cat {
    fn describe(&self) -> String {
        format!("cat with {} lives", self.lives)
    }
}

fn main() {
    let d = Dog { name: String::from("Rex") };
    let c = Cat { lives: 9 };
    println!("{}", d.describe());
    println!("{}", c.describe());
}`,
    require: [{ pattern: 'impl\\s+Describe\\s+for\\s+Cat', message: 'Implement Describe for Cat.' }],
    tests: [{ name: 'Prints both descriptions', expected: 'dog Rex\ncat with 9 lives' }],
  },

  {
    id: 'r3-trait-default',
    title: 'Default methods',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>A trait method may come with a body. That body is the <em>default</em>: every type that implements the trait gets it for free, and may replace it by writing its own version in the <code>impl</code>. This is how a trait offers many convenient methods while asking implementors for only one or two. In C++ the same job is done by a non-pure <code>virtual</code> function in a base class that derived classes may override.</p>`,
        `<p>Inside a default body you can call the trait's other methods through <code>self</code>, even the ones with no default, because the compiler knows any implementor must provide them. So a trait can say "give me <code>name()</code> and you get <code>greet()</code> for free", where <code>greet</code> is built on <code>name</code>.</p>`,
        `<p>Which methods have defaults and which are required is up to the trait's author. The standard library does this a lot: to implement an iterator you give one method and receive dozens (a later lesson shows it from the user's side).</p>`,
      ],
      examples: [
        {
          code: `trait Greet {
    fn name(&self) -> String;                 // required: no body
    fn greet(&self) -> String {               // default: has a body
        format!("Hello, {}!", self.name())
    }
}

struct Person {
    name: String,
}
struct Robot;

impl Greet for Person {
    fn name(&self) -> String {                // only the required method
        self.name.clone()
    }
}

impl Greet for Robot {
    fn name(&self) -> String {
        String::from("R2")
    }
    fn greet(&self) -> String {               // overrides the default
        String::from("BEEP")
    }
}

fn main() {
    let p = Person { name: String::from("Ann") };
    println!("{}", p.greet());
    println!("{}", Robot.greet());
}`,
          output: 'Hello, Ann!\nBEEP',
          caption: '<code>struct Robot;</code> is a struct with no fields; <code>Robot</code> by itself is its only value.',
        },
      ],
      terms: [
        { code: 'fn m(&self) -> T { body }', meaning: 'inside a trait: a default method every implementor gets' },
        { code: 'fn m(&self) -> T;', meaning: 'inside a trait: a required method (no body)' },
        { code: 'self.other()', meaning: 'a default body may call the trait\'s other methods' },
        { code: 'struct Robot;', meaning: 'a struct with no fields; the name Robot alone is its one value' },
      ],
    },
    task: 'Implement <code>Greet</code> for <code>Robot</code> so that <code>name()</code> is <code>R2</code> and <code>greet()</code> is overridden to return <code>BEEP R2</code>. The program prints <code>Hello, Ann!</code> then <code>BEEP R2</code>.',
    compare: {
      cpp: { code: `struct Greet {
    virtual std::string name() const = 0;
    virtual std::string greet() const { return "Hello, " + name() + "!"; }
    virtual ~Greet() = default;
};`, outcome: 'Non-pure virtual with a body', ok: true },
      rust: { code: `trait Greet {
    fn name(&self) -> String;
    fn greet(&self) -> String { format!("Hello, {}!", self.name()) }
}`, outcome: 'A trait method with a body', ok: true },
      text: 'A default method is the same as a C++ virtual function with a body. Overriding it is just writing the method again in the <code>impl</code>, and there is no <code>override</code> keyword.',
    },
    refresher: [
      'A trait method with a body is a default; an <code>impl</code> may omit it or write its own.',
      'Required methods have no body and end in <code>;</code>.',
    ],
    hints: [
      'The <code>impl Greet for Robot</code> block needs <code>name</code> and an overriding <code>greet</code>.',
      '<code>greet</code> can build its text with <code>format!("BEEP {}", self.name())</code>.',
    ],
    inCpp: {
      code: `struct Greet {
    virtual std::string name() const = 0;
    virtual std::string greet() const { return "Hello, " + name(); }
    virtual ~Greet() = default;
};
struct Robot : Greet {
    std::string name() const override { return "R2"; }
    std::string greet() const override { return "BEEP " + name(); }
};`,
      note: 'C++ marks an overriding function with <code>override</code>. Rust needs no marker because the trait is the only place the method name could come from.',
    },
    starter: `trait Greet {
    fn name(&self) -> String;
    fn greet(&self) -> String {
        format!("Hello, {}!", self.name())
    }
}

struct Person {
    name: String,
}
struct Robot;

impl Greet for Person {
    fn name(&self) -> String {
        self.name.clone()
    }
}

fn main() {
    let p = Person { name: String::from("Ann") };
    println!("{}", p.greet());
    println!("{}", Robot.greet());
}`,
    solution: `trait Greet {
    fn name(&self) -> String;
    fn greet(&self) -> String {
        format!("Hello, {}!", self.name())
    }
}

struct Person {
    name: String,
}
struct Robot;

impl Greet for Person {
    fn name(&self) -> String {
        self.name.clone()
    }
}

impl Greet for Robot {
    fn name(&self) -> String {
        String::from("R2")
    }
    fn greet(&self) -> String {
        format!("BEEP {}", self.name())
    }
}

fn main() {
    let p = Person { name: String::from("Ann") };
    println!("{}", p.greet());
    println!("{}", Robot.greet());
}`,
    require: [{ pattern: 'impl\\s+Greet\\s+for\\s+Robot', message: 'Implement Greet for Robot.' }],
    tests: [{ name: 'Default and override', expected: 'Hello, Ann!\nBEEP R2' }],
  },

  // ------------------------------------------------------------------------------------------
  // 18. generics
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-generics-intro',
    title: 'Generics: one function, many types',
    kind: 'concept',
    introduces: ['generic-params'],
    teach: {
      body: [
        `<p>Writing <code>first_i32</code>, <code>first_str</code> and <code>first_f64</code> that differ only in the type is the problem C++ solves with templates. Rust's answer is <em>generics</em>. You put a type parameter in angle brackets after the function name: <code>fn first&lt;T&gt;(v: &amp;[T]) -&gt; Option&lt;&amp;T&gt;</code>. Here <code>T</code> is a placeholder for "some type, decided by the caller". It is a convention to use single capital letters, <code>T</code> for the first. A call like <code>first(&amp;[1, 2, 3])</code> makes the compiler pick <code>T = i32</code> on its own. When it cannot decide, you name the type with the turbofish: <code>first::&lt;i32&gt;(&amp;[])</code>.</p>`,
        `<p>Structs and enums can be generic too, which you have already used without knowing it: <code>Vec&lt;T&gt;</code> and <code>Option&lt;T&gt;</code> are exactly that. For your own: <code>struct Pair&lt;T&gt; { a: T, b: T }</code>. The <code>impl</code> block repeats the parameter, <code>impl&lt;T&gt; Pair&lt;T&gt; { ... }</code>: the first <code>&lt;T&gt;</code> declares the name and the second says "Pair of that T", just like the lifetime in <code>impl&lt;'a&gt; Excerpt&lt;'a&gt;</code>.</p>`,
        `<p>Like C++ templates, generic Rust is compiled once for each concrete type used (this is called <em>monomorphisation</em>), so a generic function is as fast as one you wrote by hand for that type, and the generated code can grow. Unlike templates, a generic function is checked <em>once, when it is written</em>, against what it says <code>T</code> can do. Inside <code>first</code> above, nothing is assumed about <code>T</code>, so the body may only move, borrow or store it. It cannot compare two <code>T</code> or print one. To do more, <code>T</code> needs a <em>bound</em>, the subject of the next lesson.</p>`,
      ],
      examples: [
        {
          code: `fn first<T>(v: &[T]) -> Option<&T> {       // works for any element type
    v.get(0)
}

struct Pair<T> {
    a: T,
    b: T,
}

impl<T> Pair<T> {                          // repeat the parameter on impl
    fn new(a: T, b: T) -> Pair<T> {
        Pair { a, b }
    }
    fn swap(self) -> Pair<T> {
        Pair { a: self.b, b: self.a }
    }
}

fn main() {
    println!("{:?}", first(&[10, 20]));            // T = i32
    println!("{:?}", first(&["x", "y"]));          // T = &str
    let p = Pair::new(1, 2).swap();                // T = i32
    println!("{} {}", p.a, p.b);
    let e: Option<&i32> = first::<i32>(&[]);       // turbofish when T cannot be inferred
    println!("{:?}", e);
}`,
          output: 'Some(10)\nSome("x")\n2 1\nNone',
        },
      ],
      terms: [
        { code: 'fn name<T>(x: T) -> T', meaning: 'a generic function; T is any type the caller picks' },
        { code: 'struct Name<T> { f: T }', meaning: 'a generic struct (Vec<T> and Option<T> are generic too)' },
        { code: 'impl<T> Name<T> { }', meaning: 'the impl block repeats the parameter' },
        { code: 'name::<i32>(...)', meaning: 'name the type yourself when it cannot be inferred' },
      ],
    },
    task: 'Write <code>last&lt;T&gt;(v: &amp;[T]) -&gt; Option&lt;&amp;T&gt;</code>: the final element, or <code>None</code> for an empty slice. It should print <code>Some(3)</code>, <code>Some("b")</code> and <code>None</code>.',
    compare: {
      cpp: { code: `template <typename T>
const T* first(const std::vector<T>& v) {
    return v.empty() ? nullptr : &v[0];
}`, outcome: 'Template; checked at each use', ok: true },
      rust: { code: `fn first<T>(v: &[T]) -> Option<&T> {
    v.get(0)
}`, outcome: 'Generic; checked once, as written', ok: true },
      text: 'Both generate a copy per concrete type. A C++ template is checked when you instantiate it, which is where the long error messages come from; Rust checks the generic body once, against the bounds you declared.',
    },
    refresher: [
      '<code>fn f&lt;T&gt;(x: T)</code> takes any type; the caller\'s argument decides <code>T</code>.',
      'A generic <code>impl</code> repeats the parameter: <code>impl&lt;T&gt; Pair&lt;T&gt; { ... }</code>.',
    ],
    hints: [
      'An empty slice has no last element: check <code>v.is_empty()</code> first.',
      'The last position is <code>v.len() - 1</code>; return <code>Some(&amp;v[...])</code>.',
    ],
    inCpp: {
      code: `template <typename T>
T add(T a, T b) { return a + b; }
int main() {
    add(1, 2);           // T = int
    add<double>(1, 2);   // T named explicitly
}`,
      note: 'Naming <code>T</code> explicitly with <code>add&lt;double&gt;</code> in C++ is the same job as the Rust turbofish <code>add::&lt;f64&gt;</code>.',
    },
    starter: `fn last<T>(v: &[T]) -> Option<&T> {
    None
}

fn main() {
    println!("{:?}", last(&[1, 2, 3]));
    println!("{:?}", last(&["a", "b"]));
    println!("{:?}", last::<i32>(&[]));
}`,
    solution: `fn last<T>(v: &[T]) -> Option<&T> {
    if v.is_empty() {
        None
    } else {
        Some(&v[v.len() - 1])
    }
}

fn main() {
    println!("{:?}", last(&[1, 2, 3]));
    println!("{:?}", last(&["a", "b"]));
    println!("{:?}", last::<i32>(&[]));
}`,
    require: [{ pattern: 'fn\\s+last\\s*<\\s*T\\s*>', message: 'Keep last generic over T.' }],
    tests: [{ name: 'Prints Some(3), Some("b"), None', expected: 'Some(3)\nSome("b")\nNone' }],
  },

  {
    id: 'r3-generic-bounds',
    title: 'Generics need bounds',
    kind: 'concept',
    introduces: ['where'],
    teach: {
      body: [
        `<p>A generic function may only do what its type parameter is known to support. If you write <code>if x &gt; best</code> for a <code>T</code>, the compiler objects: not every type can be compared. You tell it what <code>T</code> must be able to do with a <em>trait bound</em>: <code>fn largest&lt;T: PartialOrd&gt;(v: &amp;[T]) -&gt; T</code> reads "for any type <code>T</code> that implements <code>PartialOrd</code>". <code>PartialOrd</code> is the trait that gives <code>&lt;</code> and <code>&gt;</code>. To ask for more than one trait, join them with <code>+</code>: <code>T: PartialOrd + Copy</code>. Here <code>Copy</code> lets the function copy an element out of the slice, as with an <code>i32</code>.</p>`,
        `<p>When the list of bounds gets long, move it to a <code>where</code> clause after the signature: <code>fn f&lt;T&gt;(x: T) where T: PartialOrd + Copy { ... }</code>. It means the same thing and keeps the signature readable. The standard library traits you will name most are <code>Debug</code> (for <code>{:?}</code>, written <code>std::fmt::Debug</code>), <code>Clone</code>, <code>Copy</code>, <code>PartialEq</code>, <code>PartialOrd</code> and <code>Display</code>.</p>`,
        `<p>Compare with C++. An unconstrained template accepts anything and fails inside the body, at the point of use, with an error that can run for pages. C++20 <em>concepts</em> (<code>template &lt;std::totally_ordered T&gt;</code>) fix that by naming the requirements up front, and a Rust bound is the same idea, except that it has been mandatory from the beginning. If the bound is satisfied, the body compiles for every possible <code>T</code>.</p>`,
      ],
      examples: [
        {
          code: `fn largest<T: PartialOrd + Copy>(v: &[T]) -> T {   // T must be comparable and copyable
    let mut best = v[0];
    for x in v {
        if *x > best {
            best = *x;
        }
    }
    best
}

fn show_max<T>(v: &[T]) -> String
where
    T: PartialOrd + Copy + std::fmt::Debug,     // the same bounds, in a where clause
{
    format!("max is {:?}", largest(v))
}

fn main() {
    println!("{}", largest(&[3, 9, 4]));
    println!("{}", largest(&[1.5, 0.5]));
    println!("{}", largest(&['a', 'z', 'c']));
    println!("{}", show_max(&[2, 8]));
}`,
          output: '9\n1.5\nz\nmax is 8',
        },
      ],
      terms: [
        { code: 'T: Trait', meaning: 'T must implement Trait; the body may then use what Trait offers' },
        { code: 'T: A + B', meaning: 'T must implement both traits' },
        { code: 'where T: A + B', meaning: 'the same bounds written after the signature' },
        { code: 'PartialOrd', meaning: 'the trait behind < > <= >=' },
      ],
    },
    task: 'The generic <code>largest</code> does not compile because it compares values of an unknown type. Add the right bounds to <code>T</code> so it prints <code>9</code> and then <code>z</code>.',
    compare: {
      cpp: { code: `template <typename T>
T largest(const std::vector<T>& v) {
    T best = v[0];
    for (const T& x : v) if (x > best) best = x;   // checked only when instantiated
    return best;
}`, outcome: 'Any T accepted; fails at the use site', ok: true },
      rust: { code: `fn largest<T>(v: &[T]) -> T {
    let mut best = v[0];
    for x in v { if *x > best { best = *x; } }
    best
}`, outcome: 'Error: binary operation > cannot be applied to T', ok: false, errorCode: 'E0369' },
      text: 'C++ templates check the body at each use, so the error appears far from the mistake. Rust checks it once, and with no bound there is no <code>&gt;</code>.',
    },
    refresher: [
      '<code>T: PartialOrd + Copy</code> allows <code>&gt;</code> and copying values out; the same bounds can go in a <code>where</code> clause.',
      'A generic body is checked once, against its bounds, so it works for every <code>T</code> that satisfies them.',
    ],
    hints: [
      'The error says <code>T</code> cannot be compared with <code>&gt;</code>. Which trait provides that?',
      '<code>best = *x</code> copies an element out of the slice, so it needs one more trait.',
      'Write the bounds as <code>T: PartialOrd + Copy</code> inside the angle brackets.',
    ],
    cppStd: 20,
    inCpp: {
      code: `template <std::totally_ordered T>
T largest(const std::vector<T>& v);   // concept: the requirement is in the signature`,
      note: 'C++20 concepts put the requirement in the signature, as a Rust bound does. Pre-C++20 templates have no way to say it.',
    },
    starter: `fn largest<T>(v: &[T]) -> T {
    let mut best = v[0];
    for x in v {
        if *x > best {
            best = *x;
        }
    }
    best
}

fn main() {
    println!("{}", largest(&[3, 9, 4]));
    println!("{}", largest(&['a', 'z', 'c']));
}`,
    solution: `fn largest<T: PartialOrd + Copy>(v: &[T]) -> T {
    let mut best = v[0];
    for x in v {
        if *x > best {
            best = *x;
        }
    }
    best
}

fn main() {
    println!("{}", largest(&[3, 9, 4]));
    println!("{}", largest(&['a', 'z', 'c']));
}`,
    require: [{ pattern: 'PartialOrd', message: 'Bound T with PartialOrd.' }],
    tests: [{ name: 'Prints 9 and z', expected: '9\nz' }],
  },

  {
    id: 'r3-trait-bound-unmet',
    title: 'A type that lacks the trait',
    kind: 'fix',
    introduces: [],
    task: '<code>largest</code> now has bounds, but <code>Score</code> does not meet them. Fix it without touching <code>largest</code> or <code>main</code>. It should print <code>Score { points: 9 }</code>.',
    errorCode: 'E0277',
    gloss: '<code>largest</code> needs <code>T: PartialOrd + Copy</code>, and <code>Score</code> implements neither trait.',
    refresher: [
      'A bound is a promise the caller\'s type must keep: <code>largest(&amp;scores)</code> only compiles if <code>Score</code> has the traits.',
      '<code>derive</code> can give a struct <code>PartialOrd</code>, which needs <code>PartialEq</code> too, and <code>Copy</code>, which needs <code>Clone</code>.',
    ],
    hints: [
      'The error names the trait bound that is not satisfied.',
      'Derive the missing traits on <code>Score</code>.',
      '<code>PartialOrd</code> needs <code>PartialEq</code> and <code>Copy</code> needs <code>Clone</code>; <code>Debug</code> is already needed by <code>{:?}</code>.',
    ],
    inCpp: {
      ok: false,
      code: `struct Score { int points; };
// std::max_element needs operator<
std::vector<Score> v{{3}, {9}};
auto it = std::max_element(v.begin(), v.end());   // error inside <algorithm>`,
      note: 'The C++ error appears deep inside the library header. The Rust error is at the call and names the missing trait.',
    },
    starter: `fn largest<T: PartialOrd + Copy>(v: &[T]) -> T {
    let mut best = v[0];
    for x in v {
        if *x > best {
            best = *x;
        }
    }
    best
}

struct Score {
    points: i32,
}

fn main() {
    let scores = [Score { points: 3 }, Score { points: 9 }];
    println!("{:?}", largest(&scores));
}`,
    solution: `fn largest<T: PartialOrd + Copy>(v: &[T]) -> T {
    let mut best = v[0];
    for x in v {
        if *x > best {
            best = *x;
        }
    }
    best
}

#[derive(Debug, PartialEq, PartialOrd, Clone, Copy)]
struct Score {
    points: i32,
}

fn main() {
    let scores = [Score { points: 3 }, Score { points: 9 }];
    println!("{:?}", largest(&scores));
}`,
    require: [{ pattern: 'fn\\s+largest\\s*<\\s*T\\s*:\\s*PartialOrd\\s*\\+\\s*Copy', message: 'Keep the bounds on largest.' }],
    tests: [{ name: 'Prints the larger score', expected: 'Score { points: 9 }' }],
  },

  // ------------------------------------------------------------------------------------------
  // 19. impl Trait
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-impl-trait',
    title: 'impl Trait in signatures',
    kind: 'concept',
    introduces: ['impl-trait'],
    teach: {
      body: [
        `<p>Writing <code>fn announce&lt;T: Describe&gt;(x: &amp;T) -&gt; String</code> just to say "give me anything that can describe itself" is a mouthful. Rust has a shorter spelling in a parameter position: <code>fn announce(x: &amp;impl Describe) -&gt; String</code>. It means exactly the same thing: a generic parameter with that bound, which the compiler fills in per call. It is a close cousin of C++20's <code>void announce(const Describable auto&amp; x)</code> and its abbreviated function templates.</p>`,
        `<p><code>impl Trait</code> also works in the <em>return</em> position: <code>fn make() -&gt; impl Describe</code> means "I return some type that implements <code>Describe</code>, and I am not telling you which". The caller can call the trait's methods on it and nothing else. It is the way to return a closure or an iterator without writing out its enormous real type. One limit: the function must return <em>one</em> concrete type. It cannot return a <code>Dog</code> on one path and a <code>Cat</code> on another. If you need that, the next lesson (<code>dyn</code>) is the tool.</p>`,
        `<p>Use <code>impl Trait</code> for a quick parameter bound when you do not need to name <code>T</code> elsewhere. Use the explicit <code>&lt;T: ...&gt;</code> form when two parameters must be the <em>same</em> type, or when a caller may want the turbofish.</p>`,
      ],
      examples: [
        {
          code: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}

impl Describe for Dog {
    fn describe(&self) -> String {
        format!("dog {}", self.name)
    }
}

fn announce(x: &impl Describe) -> String {     // any type that implements Describe
    format!("Look: {}", x.describe())
}

fn make_dog() -> impl Describe {               // some Describe type, one concrete type
    Dog { name: String::from("Fido") }
}

fn main() {
    let d = Dog { name: String::from("Rex") };
    println!("{}", announce(&d));
    println!("{}", announce(&make_dog()));
}`,
          output: 'Look: dog Rex\nLook: dog Fido',
        },
      ],
      terms: [
        { code: 'x: &impl Trait', meaning: 'a parameter of any type implementing Trait (shorthand for a bound)' },
        { code: '-> impl Trait', meaning: 'returns one concrete type, hidden from the caller, that implements Trait' },
      ],
    },
    task: 'Write <code>shout(x: &amp;impl Describe) -&gt; String</code> that returns the description in uppercase. It should print <code>DOG: REX</code>.',
    compare: {
      cpp: { code: `template <typename T>
concept Describable = requires(const T& t) { t.describe(); };
template <typename T>
void announce(const T& x) { x.describe(); }                 // classic
void announce2(const Describable auto& x) { x.describe(); } // C++20 abbreviated`, outcome: 'Template spelled shorter in C++20', ok: true },
      rust: { code: `trait Describe { fn describe(&self) -> String; }
fn announce<T: Describe>(x: &T) -> String { x.describe() }
fn announce2(x: &impl Describe) -> String { x.describe() }`, outcome: 'Same thing, two spellings', ok: true },
      text: '<code>impl Trait</code> in an argument is generic shorthand, much like a C++20 <code>auto</code> parameter with a concept. In a return type it hides the concrete type from the caller.',
    },
    cppStd: 20,
    refresher: [
      '<code>&amp;impl Trait</code> as a parameter type is a generic with that bound; <code>-&gt; impl Trait</code> returns one hidden concrete type.',
      'A function cannot return two different types behind one <code>impl Trait</code>.',
    ],
    hints: [
      'Call <code>x.describe()</code>, then <code>.to_uppercase()</code>.',
      'The parameter is written <code>x: &amp;impl Describe</code>.',
    ],
    inCpp: {
      code: `struct Dog { std::string name; };
auto make() { return Dog{"Fido"}; }   // deduced return type, one concrete type`,
      note: 'A C++ function with an <code>auto</code> return type also returns one deduced type; <code>-&gt; impl Trait</code> is the same, plus a promise about what you may call on it.',
    },
    starter: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}

impl Describe for Dog {
    fn describe(&self) -> String {
        format!("dog: {}", self.name)
    }
}

fn shout(x: &Dog) -> String {
    x.describe()
}

fn main() {
    let d = Dog { name: String::from("Rex") };
    println!("{}", shout(&d));
}`,
    solution: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}

impl Describe for Dog {
    fn describe(&self) -> String {
        format!("dog: {}", self.name)
    }
}

fn shout(x: &impl Describe) -> String {
    x.describe().to_uppercase()
}

fn main() {
    let d = Dog { name: String::from("Rex") };
    println!("{}", shout(&d));
}`,
    require: [{ pattern: 'fn\\s+shout\\s*\\(\\s*x\\s*:\\s*&\\s*impl\\s+Describe', message: 'Take x as &impl Describe.' }],
    tests: [{ name: 'Prints DOG: REX', expected: 'DOG: REX' }],
  },

  // ------------------------------------------------------------------------------------------
  // 20. dyn Trait
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-dyn-trait',
    title: 'dyn Trait and Box<dyn Trait>',
    kind: 'concept',
    introduces: ['dyn'],
    teach: {
      body: [
        `<p>Generics and <code>impl Trait</code> make the compiler stamp out one copy of the function per type, and every call site knows the exact type. Sometimes you need <em>different</em> types in one place at run time: a list holding a <code>Dog</code>, then a <code>Cat</code>, then a <code>Bird</code>. A <code>Vec&lt;Dog&gt;</code> cannot do that. The tool is a <em>trait object</em>, written <code>dyn Trait</code>: "some value of any type that implements <code>Trait</code>, found out at run time".</p>`,
        `<p>This is exactly the C++ <code>virtual</code> machinery. A trait object is held behind a pointer, which is a reference or a box, so you write <code>&amp;dyn Animal</code> or <code>Box&lt;dyn Animal&gt;</code>, never a bare <code>dyn Animal</code> (its size is unknown, as with an abstract class in C++). Such a pointer is "fat": it holds the address of the value and the address of a <em>vtable</em>, a table of that type's method implementations. A call like <code>a.legs()</code> looks up <code>legs</code> in the vtable and jumps there. It costs one indirect call, the same as <code>virtual</code> in C++.</p>`,
        `<p>The usual shape: <code>Vec&lt;Box&lt;dyn Animal&gt;&gt;</code>, a vector that owns boxed values of different types. <code>Box::new(Dog { ... })</code> is a <code>Box&lt;Dog&gt;</code>, and Rust turns it into a <code>Box&lt;dyn Animal&gt;</code> where the expected type says so. You loop with <code>for a in &amp;zoo</code> and call the trait's methods. Dropping the vector drops every boxed value with the right destructor, with no <code>virtual ~Animal()</code> to remember, as the vtable knows how to drop each type.</p>`,
        `<p>So the rule of thumb is: when all the types are known at compile time and you want speed, use generics or <code>impl Trait</code>. When a collection or field must mix types, or the set of types is open, use <code>dyn Trait</code>. For a closed set of kinds that you control, an <code>enum</code> from earlier is often the simpler choice.</p>`,
      ],
      examples: [
        {
          code: `trait Animal {
    fn name(&self) -> String;
    fn legs(&self) -> u32;
}

struct Dog;
struct Bird;

impl Animal for Dog {
    fn name(&self) -> String { String::from("dog") }
    fn legs(&self) -> u32 { 4 }
}
impl Animal for Bird {
    fn name(&self) -> String { String::from("bird") }
    fn legs(&self) -> u32 { 2 }
}

fn main() {
    let zoo: Vec<Box<dyn Animal>> = vec![Box::new(Dog), Box::new(Bird), Box::new(Dog)];
    let mut total = 0;
    for a in &zoo {                                  // each call goes through the vtable
        println!("{} has {} legs", a.name(), a.legs());
        total += a.legs();
    }
    println!("total {}", total);
}`,
          output: 'dog has 4 legs\nbird has 2 legs\ndog has 4 legs\ntotal 10',
        },
      ],
      terms: [
        { code: 'dyn Trait', meaning: 'any type implementing Trait, resolved at run time (like a virtual base)' },
        { code: 'Box<dyn Trait>', meaning: 'an owning pointer to such a value; works in a Vec' },
        { code: '&dyn Trait', meaning: 'a borrowed trait object' },
        { code: 'vtable', meaning: 'the table of method addresses a dyn pointer carries' },
      ],
    },
    task: '<code>Bird</code> is not an <code>Animal</code> yet. Implement <code>Animal</code> for <code>Bird</code> (name <code>bird</code>, 2 legs) so the zoo prints three lines and <code>total 10</code>.',
    compare: {
      cpp: { code: `struct Animal {
    virtual int legs() const = 0;
    virtual ~Animal() = default;     // do not forget
};
std::vector<std::unique_ptr<Animal>> zoo;`, outcome: 'virtual, with a virtual destructor', ok: true },
      rust: { code: `trait Animal { fn legs(&self) -> u32; }
struct Dog;
impl Animal for Dog { fn legs(&self) -> u32 { 4 } }
let zoo: Vec<Box<dyn Animal>> = vec![Box::new(Dog)];
println!("{}", zoo[0].legs());`, outcome: 'Same vtable idea; drop is automatic', ok: true },
      text: '<code>Box&lt;dyn Trait&gt;</code> is the counterpart of <code>unique_ptr&lt;Base&gt;</code> with virtual functions: dynamic dispatch through a vtable. There is no virtual destructor to forget, because the vtable always knows how to drop the value.',
    },
    refresher: [
      '<code>Vec&lt;Box&lt;dyn Trait&gt;&gt;</code> holds different types behind one trait; calls go through a vtable.',
      'Generics and <code>impl Trait</code> are resolved at compile time; <code>dyn</code> at run time.',
    ],
    hints: [
      'Copy the <code>impl Animal for Dog</code> block and change the name and legs.',
      'The zoo already contains a <code>Box::new(Bird)</code>; only the <code>impl</code> is missing.',
    ],
    inCpp: {
      code: `struct Base { virtual ~Base() {} };
struct D : Base { int big[100]; };
Base b = D{};   // slicing: copies only the Base part`,
      note: 'C++ lets you copy a derived object into a base by value and slices it. A bare <code>dyn Trait</code> has no size, so Rust forbids that mistake; you always go through a pointer.',
    },
    starter: `trait Animal {
    fn name(&self) -> String;
    fn legs(&self) -> u32;
}

struct Dog;
struct Bird;

impl Animal for Dog {
    fn name(&self) -> String {
        String::from("dog")
    }
    fn legs(&self) -> u32 {
        4
    }
}

fn main() {
    let zoo: Vec<Box<dyn Animal>> = vec![Box::new(Dog), Box::new(Bird), Box::new(Dog)];
    let mut total = 0;
    for a in &zoo {
        println!("{} has {} legs", a.name(), a.legs());
        total += a.legs();
    }
    println!("total {}", total);
}`,
    solution: `trait Animal {
    fn name(&self) -> String;
    fn legs(&self) -> u32;
}

struct Dog;
struct Bird;

impl Animal for Dog {
    fn name(&self) -> String {
        String::from("dog")
    }
    fn legs(&self) -> u32 {
        4
    }
}

impl Animal for Bird {
    fn name(&self) -> String {
        String::from("bird")
    }
    fn legs(&self) -> u32 {
        2
    }
}

fn main() {
    let zoo: Vec<Box<dyn Animal>> = vec![Box::new(Dog), Box::new(Bird), Box::new(Dog)];
    let mut total = 0;
    for a in &zoo {
        println!("{} has {} legs", a.name(), a.legs());
        total += a.legs();
    }
    println!("total {}", total);
}`,
    require: [{ pattern: 'impl\\s+Animal\\s+for\\s+Bird', message: 'Implement Animal for Bird.' }],
    tests: [{ name: 'Prints the zoo', expected: 'dog has 4 legs\nbird has 2 legs\ndog has 4 legs\ntotal 10' }],
  },

  // ------------------------------------------------------------------------------------------
  // 21. comparison traits
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-derive-compare',
    title: 'Comparing values: derive',
    kind: 'concept',
    introduces: ['cmp-ordering', 'collection-methods'],
    teach: {
      body: [
        `<p>Comparison in Rust is a family of traits, and a type has none of them until you derive them. <code>PartialEq</code> gives <code>==</code> and <code>!=</code>. <code>PartialOrd</code> gives <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> and <code>&gt;=</code> (it needs <code>PartialEq</code> too). The "partial" in those names admits that for some types not every pair of values can be compared, which is the story of <code>f64</code> in the next lesson. Their full-strength versions are <code>Eq</code> and <code>Ord</code>: "every value can be compared with every other, and the order is total". Integers, <code>char</code>, <code>String</code> and tuples of such types are <code>Ord</code>, and you ask for the same on your own types with <code>#[derive(PartialEq, Eq, PartialOrd, Ord)]</code>.</p>`,
        `<p>What order does a derived <code>Ord</code> give? It compares <em>field by field in the order you wrote them</em>, stopping at the first difference. That is lexicographic order, the same as comparing <code>std::tuple</code> or <code>std::pair</code> in C++. So a struct with <code>major</code> then <code>minor</code> sorts by <code>major</code> first. An enum compares by the order its variants are listed: with <code>enum Level { Low, Mid, High }</code>, <code>Low &lt; High</code>. Reorder the fields or variants and you change the order, so put them in the order you mean.</p>`,
        `<p>An <code>Ord</code> type has a method <code>a.cmp(&amp;b)</code> that returns an <code>Ordering</code>, an enum with three variants, <code>Less</code>, <code>Equal</code> and <code>Greater</code> (you can <code>match</code> on it like any enum). And a <code>Vec</code> of such values can be sorted in place with <code>v.sort()</code>. You wrote sorting algorithms by hand in C++; here it is one call that needs the element type to be <code>Ord</code>. That is the Rust counterpart of <code>operator&lt;=&gt;</code> and <code>= default</code> in C++20: one line that makes all the comparison operators.</p>`,
      ],
      examples: [
        {
          code: `#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Version {
    major: u32,                      // compared first
    minor: u32,                      // compared only if major is equal
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
enum Level {
    Low,                             // variants compare in the order listed
    Mid,
    High,
}

fn main() {
    let a = Version { major: 1, minor: 9 };
    let b = Version { major: 2, minor: 0 };
    println!("{}", a < b);                       // major decides
    println!("{:?}", a.cmp(&b));                 // an Ordering value
    println!("{}", Level::Low < Level::High);
    let mut v = vec![b, a];
    v.sort();                                    // needs Ord
    println!("{:?}", v);
}`,
          output: 'true\nLess\ntrue\n[Version { major: 1, minor: 9 }, Version { major: 2, minor: 0 }]',
        },
      ],
      terms: [
        { code: 'PartialEq / Eq', meaning: '== and !=; Eq promises every value equals itself' },
        { code: 'PartialOrd / Ord', meaning: '< > <= >=; Ord promises a total order (needed to sort)' },
        { code: 'a.cmp(&b)', meaning: 'returns Ordering::Less, Equal or Greater' },
        { code: 'v.sort()', meaning: 'sorts a Vec in place; needs Ord on the elements' },
        { code: '#[derive(PartialEq, Eq, PartialOrd, Ord)]', meaning: 'field-by-field (or variant-order) comparison' },
      ],
    },
    task: 'Add one <code>#[derive(...)]</code> so <code>sort()</code> works on <code>Card</code> (by <code>rank</code>, then <code>suit</code>) and the program prints the sorted cards.',
    compare: {
      cpp: { code: `struct Version {
    int major, minor;
    auto operator<=>(const Version&) const = default;   // C++20: all six operators
};`, outcome: 'One defaulted operator<=>', ok: true },
      rust: { code: `#[derive(PartialEq, Eq, PartialOrd, Ord)]
struct Version { major: u32, minor: u32 }
let a = Version { major: 1, minor: 9 };
let b = Version { major: 2, minor: 0 };
println!("{}", a < b);`, outcome: 'One derive line; field order matters', ok: true },
      text: 'C++20 <code>operator&lt;=&gt; = default</code> and a Rust derive both compare member by member in declaration order. Before C++20 you wrote up to six operators by hand.',
    },
    cppStd: 20,
    refresher: [
      '<code>derive(PartialEq, Eq, PartialOrd, Ord)</code> compares field by field, in the order written (enums: variant order).',
      '<code>v.sort()</code> needs <code>Ord</code> elements; <code>a.cmp(&amp;b)</code> gives an <code>Ordering</code>.',
    ],
    hints: [
      'The compiler says <code>Card</code> does not implement <code>Ord</code>.',
      'Derive <code>Ord</code> and the traits it is built on: <code>PartialEq</code>, <code>Eq</code>, <code>PartialOrd</code>.',
      '<code>Debug</code> is needed too, for the <code>{:?}</code> print.',
    ],
    inCpp: {
      code: `struct Card { int rank, suit; };
void sort_cards(std::vector<Card>& v) {
    std::sort(v.begin(), v.end(), [](const Card& a, const Card& b) {
        return std::tie(a.rank, a.suit) < std::tie(b.rank, b.suit);
    });
}`,
      note: 'Without C++20 you write a comparator by hand (often with <code>std::tie</code>). In Rust the ordering lives on the type, so <code>sort()</code> needs no comparator.',
    },
    starter: `struct Card {
    rank: u8,
    suit: u8,
}

fn main() {
    let mut hand = vec![
        Card { rank: 9, suit: 1 },
        Card { rank: 2, suit: 3 },
        Card { rank: 9, suit: 0 },
    ];
    hand.sort();
    println!("{:?}", hand);
}`,
    solution: `#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Card {
    rank: u8,
    suit: u8,
}

fn main() {
    let mut hand = vec![
        Card { rank: 9, suit: 1 },
        Card { rank: 2, suit: 3 },
        Card { rank: 9, suit: 0 },
    ];
    hand.sort();
    println!("{:?}", hand);
}`,
    require: [{ pattern: 'derive\\s*\\(', message: 'Use #[derive(...)] on Card.' }],
    tests: [{ name: 'Sorted by rank then suit', expected: '[Card { rank: 2, suit: 3 }, Card { rank: 9, suit: 0 }, Card { rank: 9, suit: 1 }]' }],
  },

  {
    id: 'r3-f64-total-order',
    title: 'Why f64 cannot be sorted',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Try <code>v.sort()</code> on a <code>Vec&lt;f64&gt;</code> and the compiler refuses: <code>f64</code> is not <code>Ord</code>. This is not a quirk. Floating point has a special value, NaN ("not a number"), that is not equal to anything, <em>including itself</em>, and is neither less than nor greater than any number. So for floats <code>==</code> is not even reflexive (<code>x == x</code> can be false), and sorting a list that contains NaN would have no meaningful answer. That is exactly the "partial" in <code>PartialEq</code> and <code>PartialOrd</code>: <code>f64</code> has them, but not <code>Eq</code> or <code>Ord</code>.</p>`,
        `<p>C++ lets <code>std::sort</code> run on doubles, and with a NaN in the data the result is undefined behaviour. Rust makes you decide. You sort by a comparison you pass in: <code>v.sort_by(|a, b| a.total_cmp(b))</code>. <code>sort_by</code> takes a closure that receives two elements (as references) and returns an <code>Ordering</code>. <code>total_cmp</code> is a float method that defines a complete order, where NaN sorts above everything else. Swap the two names, <code>b.total_cmp(a)</code>, and you get descending order.</p>`,
        `<p>The other comparison, <code>a.partial_cmp(b)</code>, returns an <code>Option&lt;Ordering&gt;</code>: <code>None</code> when the two cannot be compared (a NaN is involved). People write <code>a.partial_cmp(b).unwrap()</code> when they know there is no NaN. It will panic if there is one, whereas <code>total_cmp</code> never does. For the same reason a float cannot be used as a <code>HashMap</code> key, because it is not <code>Eq</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let nan = f64::NAN;
    println!("{} {} {}", nan == nan, nan < 1.0, nan > 1.0);   // all false
    let one: f64 = 1.0;
    println!("{:?}", one.partial_cmp(&nan));                  // None: cannot be ordered

    let mut v: Vec<f64> = vec![2.5, -1.0, 7.25];
    v.sort_by(|a, b| a.total_cmp(b));                         // ascending
    println!("{:?}", v);
    v.sort_by(|a, b| b.total_cmp(a));                         // descending: swap a and b
    println!("{:?}", v);
}`,
          output: 'false false false\nNone\n[-1.0, 2.5, 7.25]\n[7.25, 2.5, -1.0]',
        },
      ],
      terms: [
        { code: 'f64::NAN', meaning: 'the "not a number" value; unequal to everything, even itself' },
        { code: 'v.sort_by(|a, b| ...)', meaning: 'sort with your own comparison closure returning an Ordering' },
        { code: 'a.total_cmp(b)', meaning: 'a complete ordering for floats (NaN sorts last)' },
        { code: 'a.partial_cmp(b)', meaning: 'Option<Ordering>: None if the two cannot be compared' },
      ],
    },
    task: 'This does not compile: <code>f64</code> is not <code>Ord</code>. Sort <code>v</code> from largest to smallest with <code>sort_by</code> and <code>total_cmp</code>. It should print <code>[3.5, 2.0, 1.5]</code>.',
    compare: {
      cpp: { code: `std::vector<double> v{3.0, NAN, 1.0};
std::sort(v.begin(), v.end());   // NaN breaks the strict weak ordering: UB`, outcome: 'Compiles; undefined behaviour with NaN', ok: true },
      rust: { code: `let mut v = vec![3.0, 1.0];
v.sort();`, outcome: 'Error: f64 does not implement Ord', ok: false, errorCode: 'E0277' },
      text: 'C++ accepts <code>std::sort</code> on doubles and breaks when a NaN appears. Rust stops at compile time and asks you to say how NaN should be ordered.',
    },
    refresher: [
      '<code>f64</code> is <code>PartialOrd</code> but not <code>Ord</code>, because NaN has no place in an order. <code>v.sort_by(|a, b| a.total_cmp(b))</code> sorts floats.',
      'Swap <code>a</code> and <code>b</code> inside the closure for the reverse order.',
    ],
    hints: [
      'Replace <code>v.sort()</code> with <code>v.sort_by(...)</code> and a closure with two parameters.',
      'Inside the closure compare <code>a</code> with <code>b</code> using <code>total_cmp</code>.',
      'For descending order call it as <code>b.total_cmp(a)</code>.',
    ],
    inCpp: {
      code: `void desc(std::vector<double>& v) {
    std::sort(v.begin(), v.end(), [](double a, double b) { return a > b; });   // descending
}`,
      note: 'The C++ comparator is a closure too, but it returns a <code>bool</code>. The Rust one returns an <code>Ordering</code>, which can say "equal" or, with <code>partial_cmp</code>, "not comparable".',
    },
    starter: `fn main() {
    let mut v: Vec<f64> = vec![2.0, 3.5, 1.5];
    v.sort();
    println!("{:?}", v);
}`,
    solution: `fn main() {
    let mut v: Vec<f64> = vec![2.0, 3.5, 1.5];
    v.sort_by(|a, b| b.total_cmp(a));
    println!("{:?}", v);
}`,
    require: [{ pattern: 'sort_by', message: 'Use sort_by.' }],
    tests: [{ name: 'Sorted descending', expected: '[3.5, 2.0, 1.5]' }],
  },

  {
    id: 'r3-hash-key',
    title: 'A struct in a HashSet',
    kind: 'fix',
    introduces: ['hashmap'],
    teach: {
      body: [
        `<p>A <code>HashSet&lt;T&gt;</code> is a collection of distinct values with fast lookup, like C++ <code>std::unordered_set</code>. You bring it into scope with <code>use std::collections::HashSet;</code>, create an empty one with <code>HashSet::new()</code>, add with <code>.insert(x)</code>, test membership with <code>.contains(&amp;x)</code> and count with <code>.len()</code>. (The full collections come in stage 6. A <code>HashMap</code> works the same way for the key part of this lesson.)</p>`,
        `<p>To store a value in a hash set or use it as a map key, its type needs two traits. <code>Hash</code> says how to turn a value into a number, and <code>Eq</code> says when two values are the same (which builds on <code>PartialEq</code>). They must agree: values that are equal must produce the same hash. The compiler cannot check that for hand-written code, but derived code is always consistent, so you nearly always write <code>#[derive(PartialEq, Eq, Hash)]</code>. In C++ the equivalent is writing <code>operator==</code> and specialising <code>std::hash</code> by hand.</p>`,
        `<p>Without the derive, inserting a struct fails with error E0599: the method exists, but only for types whose "trait bounds are satisfied". That is the compiler telling you which trait is missing. (A floating-point field cannot be part of a hashed key because <code>f64</code> is not <code>Eq</code>, as the last lesson showed.)</p>`,
      ],
      examples: [
        {
          code: `use std::collections::HashSet;

#[derive(PartialEq, Eq, Hash)]
struct Tag {
    id: u32,
}

fn main() {
    let mut seen = HashSet::new();
    seen.insert(Tag { id: 7 });
    seen.insert(Tag { id: 7 });                      // equal to the first: not added again
    seen.insert(Tag { id: 9 });
    println!("{}", seen.len());
    println!("{}", seen.contains(&Tag { id: 9 }));
}`,
          output: '2\ntrue',
        },
      ],
      terms: [
        { code: 'HashSet::new()', meaning: 'an empty set (after use std::collections::HashSet;)' },
        { code: 'set.insert(x) / set.contains(&x) / set.len()', meaning: 'add, test membership, count' },
        { code: 'Hash + Eq', meaning: 'what a hashed key type needs; derive them together with PartialEq' },
      ],
    },
    task: 'This <code>HashSet</code> of <code>Point</code> does not compile. Fix it without changing <code>main</code>. It should print <code>2</code> and then <code>true</code>.',
    errorCode: 'E0599',
    gloss: '<code>HashSet</code> needs its element type to implement <code>Eq</code> and <code>Hash</code>, and <code>Point</code> implements neither.',
    refresher: [
      'A hash key needs <code>Hash</code> (to find a bucket) and <code>Eq</code> (to compare inside it); <code>Eq</code> builds on <code>PartialEq</code>.',
      'Derive all three together: <code>#[derive(PartialEq, Eq, Hash)]</code>.',
    ],
    hints: [
      'Read the "trait bounds were not satisfied" lines: they name what <code>Point</code> lacks.',
      'The missing pieces can be generated rather than written.',
      'Derive <code>Hash</code>, and the equality traits it is paired with.',
    ],
    inCpp: {
      code: `struct Point {
    int x, y;
    bool operator==(const Point& o) const { return x == o.x && y == o.y; }
};

template <> struct std::hash<Point> {
    size_t operator()(const Point& p) const { return hash<int>()(p.x) * 31 + hash<int>()(p.y); }
};

unordered_set<Point> seen;`,
      note: 'C++ needs an <code>operator==</code> and a <code>std::hash</code> specialisation before <code>unordered_set</code> accepts a struct. Rust derives both.',
    },
    starter: `use std::collections::HashSet;

struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let mut seen = HashSet::new();
    seen.insert(Point { x: 1, y: 2 });
    seen.insert(Point { x: 1, y: 2 });
    seen.insert(Point { x: 5, y: 0 });
    println!("{}", seen.len());
    println!("{}", seen.contains(&Point { x: 5, y: 0 }));
}`,
    solution: `use std::collections::HashSet;

#[derive(PartialEq, Eq, Hash)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let mut seen = HashSet::new();
    seen.insert(Point { x: 1, y: 2 });
    seen.insert(Point { x: 1, y: 2 });
    seen.insert(Point { x: 5, y: 0 });
    println!("{}", seen.len());
    println!("{}", seen.contains(&Point { x: 5, y: 0 }));
}`,
    require: [
      { pattern: 'HashSet::new\\(\\)', message: 'Keep the HashSet' },
      { pattern: 'seen\\.insert\\(\\s*Point', message: 'Keep inserting Point values' },
    ],
    tests: [{ name: 'Two distinct points, one found', expected: '2\ntrue' }],
  },

  // ------------------------------------------------------------------------------------------
  // 22. Display, Default, From
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-display',
    title: 'Display: printing with {}',
    kind: 'concept',
    introduces: ['write-macro'],
    teach: {
      body: [
        `<p>You can print a derived struct with <code>{:?}</code> (Debug), but the output is for programmers. To print it with plain <code>{}</code>, in your own wording, you implement the <code>Display</code> trait by hand. There is no derive for it, because only you know how it should look. This is Rust's version of overloading <code>operator&lt;&lt;</code> for <code>std::ostream</code>.</p>`,
        `<p>The shape never changes, so copy it: <code>impl fmt::Display for Point { fn fmt(&amp;self, f: &amp;mut fmt::Formatter) -&gt; fmt::Result { ... } }</code>, after a <code>use std::fmt;</code> at the top. <code>fmt</code> is the one required method. <code>f</code> is the output you write into, and the return type <code>fmt::Result</code> says whether writing worked. Inside, you use the <code>write!</code> macro, which is <code>println!</code> aimed at <code>f</code> instead of the screen: <code>write!(f, "({}, {})", self.x, self.y)</code>. Note there is no semicolon, so its result is returned.</p>`,
        `<p>The reward is twofold. <code>println!("{}", p)</code> now works, and so does <code>p.to_string()</code>, which gives a <code>String</code>. (<code>to_string</code> is provided to every type that implements <code>Display</code>.) The convention: <code>Display</code> is the clean, user-facing form, <code>Debug</code> is the detailed developer form.</p>`,
      ],
      examples: [
        {
          code: `use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)     // like println!, but into f
    }
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("{}", p);                            // uses our Display
    let s = p.to_string();                        // comes for free
    println!("{} chars", s.len());
}`,
          output: '(1, 2)\n6 chars',
        },
      ],
      terms: [
        { code: 'use std::fmt;', meaning: 'brings the fmt module in, so fmt::Display and fmt::Formatter can be named' },
        { code: 'impl fmt::Display for T { fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { } }', meaning: 'the fixed shape for printing a type with {}' },
        { code: 'write!(f, "...", args)', meaning: 'println!-style formatting into f; its value is the method\'s result' },
      ],
    },
    task: 'Implement <code>fmt::Display</code> for <code>Version</code> so that <code>Version { major: 1, minor: 4 }</code> prints as <code>v1.4</code>. The program prints <code>v1.4</code> twice (once via <code>{}</code>, once via <code>to_string</code>).',
    compare: {
      cpp: { code: `struct Point { int x, y; };
std::ostream& operator<<(std::ostream& os, const Point& p) {
    return os << "(" << p.x << ", " << p.y << ")";
}`, outcome: 'operator<< on ostream', ok: true },
      rust: { code: `use std::fmt;
struct Point { x: i32, y: i32 }
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}`, outcome: 'Implement the Display trait', ok: true },
      text: '<code>Display</code> plays the role of <code>operator&lt;&lt;</code>: you write one function and then <code>{}</code> works everywhere. The call goes through the trait, not a free function found by lookup.',
    },
    refresher: [
      'Implement <code>fmt::Display</code> with <code>write!(f, "...", fields)</code>; then <code>{}</code> and <code>.to_string()</code> work.',
      '<code>Debug</code> (derive) is for developers, <code>Display</code> (by hand) is for users.',
    ],
    hints: [
      'Copy the shape of the <code>impl fmt::Display for Point</code> block and change the type.',
      'The body is <code>write!(f, "v{}.{}", self.major, self.minor)</code>.',
    ],
    inCpp: {
      code: `std::string to_str(int x) {
    std::ostringstream os;
    os << x;
    return os.str();   // the C++ route to a string
}`,
      note: 'In C++ turning a user type into a string goes through a stream. In Rust <code>to_string()</code> exists for every <code>Display</code> type.',
    },
    starter: `use std::fmt;

struct Version {
    major: u32,
    minor: u32,
}

fn main() {
    let v = Version { major: 1, minor: 4 };
    println!("{}", v);
    println!("{}", v.to_string());
}`,
    solution: `use std::fmt;

struct Version {
    major: u32,
    minor: u32,
}

impl fmt::Display for Version {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "v{}.{}", self.major, self.minor)
    }
}

fn main() {
    let v = Version { major: 1, minor: 4 };
    println!("{}", v);
    println!("{}", v.to_string());
}`,
    require: [{ pattern: 'impl\\s+fmt::Display\\s+for\\s+Version', message: 'Implement fmt::Display for Version.' }],
    tests: [{ name: 'Prints v1.4 twice', expected: 'v1.4\nv1.4' }],
  },

  {
    id: 'r3-default',
    title: 'Default values',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Rust never leaves a field uninitialised, so how do you build a struct with many fields without writing every one? The <code>Default</code> trait supplies a "usual" value of a type: <code>Config::default()</code>. Derive it with <code>#[derive(Default)]</code> and every field gets its own default: <code>0</code> for numbers, <code>false</code> for <code>bool</code>, an empty <code>String</code>, an empty <code>Vec</code>, <code>None</code> for an <code>Option</code>. This is what a C++ struct with <code>int x = 0;</code> member initialisers gives you, except that you do not write them.</p>`,
        `<p>Often you want <em>most</em> defaults and a few settings of your own. For that there is <em>struct update syntax</em>: write the fields you care about, then <code>..Default::default()</code> to fill in all the rest: <code>Config { width: 80, ..Default::default() }</code>. The <code>..</code> must come last. Here <code>Default::default()</code> means "the default of whatever type is needed here", which the compiler works out from the struct being built.</p>`,
        `<p>If a field's usual value is not the zero value, write the impl yourself: <code>impl Default for Config { fn default() -&gt; Self { Config { width: 80, ... } } }</code>. Everything above works with your own version too.</p>`,
      ],
      examples: [
        {
          code: `#[derive(Debug, Default)]
struct Config {
    width: u32,
    name: String,
    verbose: bool,
}

fn main() {
    let a = Config::default();                          // every field at its default
    println!("{:?}", a);
    let b = Config { width: 80, ..Default::default() }; // 80, and defaults for the rest
    println!("{:?}", b);
}`,
          output: 'Config { width: 0, name: "", verbose: false }\nConfig { width: 80, name: "", verbose: false }',
        },
      ],
      terms: [
        { code: '#[derive(Default)]', meaning: 'every field takes its own default (0, false, "", empty Vec, None)' },
        { code: 'T::default()', meaning: 'builds the default value of T' },
        { code: 'S { a: 1, ..Default::default() }', meaning: 'set some fields, fill the rest with defaults' },
      ],
    },
    task: 'Make this compile: <code>Config</code> needs to be able to produce a default value for the fields not listed. It should print <code>Config { width: 120, name: "", verbose: false }</code>.',
    compare: {
      cpp: { code: `struct Config {
    unsigned width = 0;        // you write each default
    std::string name;
    bool verbose = false;
};
Config c{.width = 120};        // C++20 designated initialiser`,
      outcome: 'Defaults written per member', ok: true },
      rust: { code: `#[derive(Default)]
struct Config { width: u32, name: String, verbose: bool }
let c = Config { width: 120, ..Default::default() };`, outcome: 'derive(Default) plus ..Default::default()', ok: true },
      text: 'Rust does not have default member initialisers inside the struct. <code>Default</code> and <code>..Default::default()</code> play that part, the way C++20 designated initialisers do.',
    },
    cppStd: 20,
    refresher: [
      '<code>#[derive(Default)]</code> gives zeros, <code>false</code>, empty text; <code>..Default::default()</code> fills the unlisted fields.',
      'For non-zero defaults write <code>impl Default for T</code> yourself.',
    ],
    hints: [
      'The error says <code>Config</code> does not implement <code>Default</code>.',
      'Add <code>Default</code> to the derive list on <code>Config</code>.',
    ],
    inCpp: {
      code: `struct Config { int width; bool verbose; };
void f() {
    Config c;   // no initialisers: the members are indeterminate
}`,
      note: 'A C++ struct without member initialisers leaves its members indeterminate. Rust gives you either all fields explicitly or all from <code>Default</code>.',
    },
    starter: `#[derive(Debug)]
struct Config {
    width: u32,
    name: String,
    verbose: bool,
}

fn main() {
    let c = Config { width: 120, ..Default::default() };
    println!("{:?}", c);
}`,
    solution: `#[derive(Debug, Default)]
struct Config {
    width: u32,
    name: String,
    verbose: bool,
}

fn main() {
    let c = Config { width: 120, ..Default::default() };
    println!("{:?}", c);
}`,
    require: [{ pattern: 'Default', message: 'Derive Default on Config.' }],
    tests: [{ name: 'Prints the config', expected: 'Config { width: 120, name: "", verbose: false }' }],
  },

  {
    id: 'r3-from-into',
    title: 'From and Into',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Converting one type to another comes up constantly, and C++ handles it with converting constructors and <code>explicit</code> conversion operators. Rust has the <code>From</code> trait. <code>impl From&lt;Celsius&gt; for Fahrenheit</code> says "a <code>Fahrenheit</code> can be built from a <code>Celsius</code>" and requires one function, <code>fn from(c: Celsius) -&gt; Fahrenheit</code>. You call it as <code>Fahrenheit::from(c)</code>. You have already used it: <code>String::from("hi")</code> is the <code>From</code> trait for <code>String</code>.</p>`,
        `<p>Implementing <code>From</code> hands you a second spelling for free: <code>c.into()</code>. It means "convert this into whatever type is expected here", so the target type must be clear from context, such as a type annotation: <code>let f: Fahrenheit = c.into();</code>. You write <code>From</code> (the target type owns the knowledge) and callers may use either. Conversions are always explicit in Rust: nothing converts silently except in a few places like references becoming slices.</p>`,
        `<p><code>From</code> has a special role with <code>?</code>. When <code>?</code> returns an <code>Err(e)</code>, it first converts the error with <code>From</code> into the function's own error type. This is how a function that does several different kinds of failing work gets one error type: define an <code>enum</code> of your errors, implement <code>From</code> for each underlying error, and write plain <code>?</code> everywhere. The second example does this.</p>`,
      ],
      examples: [
        {
          code: `struct Celsius {
    deg: f64,
}
struct Fahrenheit {
    deg: f64,
}

impl From<Celsius> for Fahrenheit {
    fn from(c: Celsius) -> Fahrenheit {
        Fahrenheit { deg: c.deg * 9.0 / 5.0 + 32.0 }
    }
}

fn main() {
    let a = Fahrenheit::from(Celsius { deg: 100.0 });     // explicit
    let b: Fahrenheit = Celsius { deg: 0.0 }.into();      // same conversion, other spelling
    println!("{} {}", a.deg, b.deg);
}`,
          output: '212 32',
        },
        {
          code: `#[derive(Debug)]
enum AppError {
    BadNumber(std::num::ParseIntError),
}

impl From<std::num::ParseIntError> for AppError {
    fn from(e: std::num::ParseIntError) -> AppError {
        AppError::BadNumber(e)
    }
}

fn double(s: &str) -> Result<i32, AppError> {
    let n = s.parse::<i32>()?;              // ? converts ParseIntError into AppError
    Ok(n * 2)
}

fn main() {
    println!("{:?}", double("21"));
    println!("{:?}", double("x"));
}`,
          output: 'Ok(42)\nErr(BadNumber(ParseIntError { kind: InvalidDigit }))',
        },
      ],
      terms: [
        { code: 'impl From<A> for B { fn from(a: A) -> B }', meaning: 'B can be built from an A' },
        { code: 'B::from(a)', meaning: 'the explicit conversion' },
        { code: 'a.into()', meaning: 'the same conversion; the target type comes from context' },
        { code: '?', meaning: 'converts the error with From before returning it' },
      ],
    },
    task: 'Make <code>Point::from((3, 4))</code> and <code>(5, 6).into()</code> work by implementing <code>From&lt;(i32, i32)&gt;</code> for <code>Point</code>. The program prints <code>Point { x: 3, y: 4 }</code> and <code>Point { x: 5, y: 6 }</code>.',
    compare: {
      cpp: { code: `struct Point {
    int x, y;
    Point(std::pair<int, int> p) : x(p.first), y(p.second) {}   // implicit unless explicit
};
Point a = std::make_pair(3, 4);`, outcome: 'Converting constructor; may be implicit', ok: true },
      rust: { code: `struct Point { x: i32, y: i32 }
impl From<(i32, i32)> for Point {
    fn from(p: (i32, i32)) -> Point { Point { x: p.0, y: p.1 } }
}
let a = Point::from((3, 4));
let b: Point = (5, 6).into();`, outcome: 'Always a visible call', ok: true },
      text: 'A converting constructor can fire silently if you forget <code>explicit</code>. A Rust conversion is always a visible <code>from</code> or <code>into</code> call, and implementing <code>From</code> also gives you <code>into</code>.',
    },
    refresher: [
      '<code>impl From&lt;A&gt; for B</code> gives <code>B::from(a)</code> and <code>a.into()</code>. <code>?</code> uses <code>From</code> to convert errors.',
    ],
    hints: [
      'Write <code>impl From&lt;(i32, i32)&gt; for Point { fn from(p: (i32, i32)) -&gt; Point { ... } }</code>.',
      'Tuple fields are <code>p.0</code> and <code>p.1</code>.',
    ],
    inCpp: {
      code: `struct Meters { double v; explicit Meters(double v) : v(v) {} };
// Meters m = 5.0;   // error: explicit
Meters m(5.0);`,
      note: 'C++ lets you choose between implicit and <code>explicit</code> conversion. Rust has only the explicit kind: you always see <code>from</code> or <code>into</code>.',
    },
    starter: `#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let a = Point::from((3, 4));
    let b: Point = (5, 6).into();
    println!("{:?}", a);
    println!("{:?}", b);
}`,
    solution: `#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl From<(i32, i32)> for Point {
    fn from(p: (i32, i32)) -> Point {
        Point { x: p.0, y: p.1 }
    }
}

fn main() {
    let a = Point::from((3, 4));
    let b: Point = (5, 6).into();
    println!("{:?}", a);
    println!("{:?}", b);
}`,
    require: [{ pattern: 'impl\\s+From\\s*<', message: 'Implement From for Point.' }],
    tests: [{ name: 'Prints both points', expected: 'Point { x: 3, y: 4 }\nPoint { x: 5, y: 6 }' }],
  },

  // ------------------------------------------------------------------------------------------
  // 23. closures in depth
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-closure-capture',
    title: 'Closures capture by themselves',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>The power of a closure over a plain function is that it can use variables from the code around it. A C++ lambda needs a <em>capture list</em> that says how: <code>[&amp;]</code> by reference, <code>[=]</code> by copy, <code>[x]</code> one variable. A Rust closure has no capture list. The compiler reads the body, sees which outside variables it uses, and picks the gentlest way that works. If the body only reads a variable, the closure takes a shared borrow (<code>&amp;</code>). If it changes the variable, it takes an exclusive borrow (<code>&amp;mut</code>).</p>`,
        `<p>That choice is exactly the borrowing you know from stage 2, with the same rules. While a closure holds a shared borrow of <code>base</code>, you can still read <code>base</code> but not change it. While a closure holds a <code>&amp;mut</code> of <code>count</code>, nothing else may touch <code>count</code>, until the closure's last use (borrows end at the last use). A closure that changes captured state must itself be stored in a <code>let mut</code> variable to be called, because calling it changes something inside it.</p>`,
        `<p>Because the borrow is checked like any other, the dangling-capture bugs that C++ <code>[&amp;]</code> allows (a lambda that outlives the local it points at) are compile errors here. The next lessons look at how closures are passed to functions, and at how <code>move</code> changes what is captured.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let base = 10;
    let add_base = |x| x + base;       // reads base: shared borrow
    println!("{}", add_base(5));
    println!("{}", base);              // still readable

    let mut count = 0;
    let mut bump = || count += 1;      // changes count: exclusive borrow, so "let mut"
    bump();
    bump();
    println!("{}", count);             // ok: bump is not used after this
}`,
          output: '15\n10\n2',
        },
      ],
      terms: [
        { code: '|x| x + base', meaning: 'uses base from outside; captured automatically by shared borrow' },
        { code: 'let mut f = || n += 1;', meaning: 'a closure that changes a captured variable needs let mut' },
      ],
    },
    task: 'The closure ignores <code>rate</code>. Make <code>with_tax</code> add the captured <code>rate</code> to the price, so the program prints <code>120</code> and then <code>70</code>.',
    compare: {
      cpp: { code: `int rate = 20;
auto with_tax = [&rate](int price) { return price + rate; };   // you list the capture
auto by_copy  = [=](int price) { return price + rate; };`, outcome: 'Capture list chosen by hand', ok: true },
      rust: { code: `let rate = 20;
let with_tax = |price: i32| price + rate;
println!("{}", with_tax(100));`, outcome: 'Capture is inferred from the body', ok: true },
      text: 'C++ makes you write the capture list and can dangle with <code>[&amp;]</code>. Rust infers the least strong capture and checks its lifetime with the usual borrow rules.',
    },
    refresher: [
      'A closure borrows what it reads (<code>&amp;</code>) or changes (<code>&amp;mut</code>) automatically; a mutating closure needs <code>let mut</code>.',
      'The usual borrow rules apply for as long as the closure is still used.',
    ],
    hints: [
      'The body of the closure is just <code>price</code>. Add <code>rate</code> to it.',
      '<code>rate</code> is defined outside the closure; you do not need to pass it in.',
    ],
    inCpp: {
      code: `std::function<int(int)> make(int n) {
    return [&n](int x) { return x + n; };   // n dies when make returns: dangling
}`,
      note: 'A C++ <code>[&amp;]</code> lambda returned from a function holds a reference to a dead local. The equivalent Rust closure does not compile.',
    },
    starter: `fn main() {
    let rate = 20;
    let with_tax = |price: i32| price;
    println!("{}", with_tax(100));
    println!("{}", with_tax(50));
}`,
    solution: `fn main() {
    let rate = 20;
    let with_tax = |price: i32| price + rate;
    println!("{}", with_tax(100));
    println!("{}", with_tax(50));
}`,
    require: [{ pattern: '\\|\\s*price\\s*:\\s*i32\\s*\\|[^;]*\\brate\\b', message: 'Use rate inside the closure.' }],
    tests: [{ name: 'Prints 120 and 70', expected: '120\n70' }],
  },

  {
    id: 'r3-closure-fn-traits',
    title: 'Fn, FnMut, FnOnce: passing closures',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>To write a function that <em>takes</em> a closure, you need a type for it, and every closure has its own anonymous type, so you name a trait instead. There are three, from most to least restricted. <code>Fn</code>: the closure only reads what it captured, so it can be called any number of times. <code>FnMut</code>: it changes what it captured, so it can be called repeatedly but needs <code>&amp;mut</code> access to itself. <code>FnOnce</code>: it moves something out of what it captured, so it can be called only once. The compiler decides which of the three a closure implements by what its body does. You do not annotate the closure.</p>`,
        `<p>In a parameter you write the trait with the argument and result types in the shape of a function signature: <code>f: impl Fn(i32) -&gt; i32</code> ("a closure taking an <code>i32</code> and returning an <code>i32</code>"). You met <code>impl Trait</code> in a parameter already; it works the same here. The longer form is <code>fn apply&lt;F: Fn(i32) -&gt; i32&gt;(f: F, x: i32)</code>. Inside, you call <code>f(x)</code> like any function. Plain <code>fn</code> functions can be passed too, since they satisfy the same traits.</p>`,
        `<p>Which one should a function ask for? The least demanding that its body needs. If it calls the closure once, ask for <code>FnOnce</code>, and every closure is accepted. If it calls it many times, ask for <code>FnMut</code>, which accepts <code>Fn</code> and <code>FnMut</code> closures. Ask for <code>Fn</code> only if it needs to call the closure while it is shared or from several places. If the parameter is <code>FnMut</code>, declare it <code>mut f</code>, because calling it changes it.</p>`,
        `<p>In C++ the usual choices are a template parameter (<code>template &lt;class F&gt;</code>, checked at each use, like <code>impl Fn</code>) or <code>std::function&lt;int(int)&gt;</code> (type erased, with a heap allocation, closer to <code>Box&lt;dyn Fn(i32) -&gt; i32&gt;</code>). Rust's trait names add what C++ cannot say in a type: whether the closure may change its state or be called only once.</p>`,
      ],
      examples: [
        {
          code: `fn apply(f: impl Fn(i32) -> i32, x: i32) -> i32 {     // read-only closure, called as often as we like
    f(x)
}

fn apply_twice(mut f: impl FnMut()) {                    // may change its captures
    f();
    f();
}

fn run_once(f: impl FnOnce() -> String) -> String {      // may move something out
    f()
}

fn double(x: i32) -> i32 {
    x * 2
}

fn main() {
    let offset = 3;
    println!("{}", apply(|x| x + offset, 10));           // Fn: only reads offset
    println!("{}", apply(double, 4));                    // a plain function works too

    let mut n = 0;
    apply_twice(|| n += 1);                              // FnMut: changes n
    println!("{}", n);

    let s = String::from("hi");
    println!("{}", run_once(|| s));                      // FnOnce: moves s out by returning it
}`,
          output: '13\n8\n2\nhi',
        },
      ],
      terms: [
        { code: 'impl Fn(A) -> R', meaning: 'a closure (or fn) that only reads its captures; callable many times' },
        { code: 'impl FnMut(A) -> R', meaning: 'changes its captures; the parameter should be declared mut' },
        { code: 'impl FnOnce() -> R', meaning: 'may move a captured value out; callable once' },
        { code: 'f(x)', meaning: 'calling a closure parameter is just a call' },
      ],
    },
    task: 'Write <code>apply_twice(f: impl Fn(i32) -&gt; i32, x: i32) -&gt; i32</code> that applies <code>f</code> to <code>x</code>, then applies <code>f</code> to that result. It should print <code>18</code> and then <code>8</code>.',
    compare: {
      cpp: { code: `template <class F>
int apply_twice(F f, int x) { return f(f(x)); }          // template parameter

int apply_twice2(std::function<int(int)> f, int x) { return f(f(x)); }   // type-erased`, outcome: 'Template or std::function', ok: true },
      rust: { code: `fn apply_twice(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}`, outcome: 'A trait bound says what kind of closure', ok: true },
      text: '<code>impl Fn(...)</code> is like a C++ template parameter for a callable: the compiler makes a copy for each closure. The trait also records whether the closure may change its state or be called only once.',
    },
    refresher: [
      '<code>Fn</code> reads captures, <code>FnMut</code> changes them (declare <code>mut f</code>), <code>FnOnce</code> may consume them; a function asks for the weakest it needs.',
      'Write the bound like a signature: <code>impl Fn(i32) -&gt; i32</code>.',
    ],
    hints: [
      'Call the closure like a function: <code>f(x)</code>.',
      'The result of the first call is the argument to the second: <code>f(f(x))</code>.',
    ],
    inCpp: {
      code: `std::function<int(int)> f = [](int x) { return x * 3; };
// heap-allocates for big captures; one fixed signature`,
      note: '<code>std::function</code> erases the type at a cost. Rust\'s equivalent is <code>Box&lt;dyn Fn(i32) -&gt; i32&gt;</code>, used only when closures of different types must live together.',
    },
    starter: `fn apply_twice(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    x
}

fn main() {
    println!("{}", apply_twice(|v| v * 3, 2));
    println!("{}", apply_twice(|v| v - 1, 10));
}`,
    solution: `fn apply_twice(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}

fn main() {
    println!("{}", apply_twice(|v| v * 3, 2));
    println!("{}", apply_twice(|v| v - 1, 10));
}`,
    require: [{ pattern: 'f\\s*\\(\\s*f\\s*\\(', message: 'Call f on the result of calling f.' }],
    tests: [{ name: 'Prints 18 and 8', expected: '18\n8' }],
  },

  {
    id: 'r3-closure-fnmut',
    title: 'Calling a closure that mutates',
    kind: 'fix',
    introduces: [],
    task: 'This closure changes <code>total</code> but does not compile. Fix it so the program prints <code>6</code> (the closure is called three times).',
    errorCode: 'E0596',
    gloss: 'A closure that changes captured state needs <code>let mut</code> to be called, because calling it mutates the closure.',
    refresher: [
      'A closure that changes a captured variable is an <code>FnMut</code>; calling it needs <code>&amp;mut</code> access to the closure itself.',
      'So the variable holding it must be declared <code>let mut</code>.',
    ],
    hints: [
      'The error is about borrowing <code>add</code> as mutable.',
      'The closure is stored in a variable. What keyword makes a variable changeable?',
    ],
    inCpp: {
      code: `int total = 0;
auto add = [&total](int n) { total += n; };   // works: lambda's operator() is const but total is a reference
add(1);`,
      note: 'A C++ lambda capturing by reference can change the original even when the lambda is not marked mutable. In Rust the closure is a mutable borrow and must be declared as such.',
    },
    starter: `fn main() {
    let mut total = 0;
    let add = |n: i32| total += n;
    add(1);
    add(2);
    add(3);
    println!("{}", total);
}`,
    solution: `fn main() {
    let mut total = 0;
    let mut add = |n: i32| total += n;
    add(1);
    add(2);
    add(3);
    println!("{}", total);
}`,
    require: [{ pattern: '\\|n\\s*:\\s*i32\\|\\s*total\\s*\\+=\\s*n', message: 'Keep the closure that adds to total.' }],
    tests: [{ name: 'Prints 6', expected: '6' }],
  },

  {
    id: 'r3-closure-move',
    title: 'move closures',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>By default a closure only borrows. That is fine while it is used right where it was made. It breaks when the closure must <em>outlive</em> the variables it borrows. The commonest case is a function that returns a closure: <code>fn make_adder(n: i32) -&gt; impl Fn(i32) -&gt; i32</code> could return <code>|x| x + n</code>, but <code>n</code> belongs to <code>make_adder</code> and is gone when it returns. That is the same dangling reference a C++ <code>[&amp;n]</code> would have, and Rust refuses with error E0373, "closure may outlive the current function".</p>`,
        `<p>The fix is the <code>move</code> keyword before the bars: <code>move |x| x + n</code>. A <code>move</code> closure takes <em>ownership</em> of every variable it uses instead of borrowing it, like a C++ capture by copy or by move. The closure now carries <code>n</code> with it and can go anywhere. (Returning <code>impl Fn(i32) -&gt; i32</code> is the "one hidden concrete type" form of <code>impl Trait</code>, now with a closure as the type.)</p>`,
        `<p><code>move</code> follows the usual ownership rules for what it takes. A <code>Copy</code> value such as an <code>i32</code> is copied into the closure, so the original is still usable. A <code>String</code> or <code>Vec</code> is <em>moved</em> in, so the original is gone afterwards and using it is E0382. Note that <code>move</code> says how things are captured, not what the closure is allowed to do: a <code>move</code> closure may still be <code>Fn</code> or <code>FnMut</code>.</p>`,
      ],
      examples: [
        {
          code: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n                     // takes n with it; works after make_adder returns
}

fn main() {
    let add5 = make_adder(5);
    println!("{}", add5(1));

    let name = String::from("Ann");
    let greet = move || println!("hi {}", name);   // name is moved into the closure
    greet();
    greet();
}`,
          output: '6\nhi Ann\nhi Ann',
        },
      ],
      terms: [
        { code: 'move |x| ...', meaning: 'the closure takes ownership of everything it captures' },
        { code: '-> impl Fn(i32) -> i32', meaning: 'returns a closure of that shape' },
        { code: 'E0373', meaning: 'closure may outlive the borrowed variable: add move' },
      ],
    },
    task: '<code>make_adder</code> does not compile because the closure borrows <code>n</code>. Fix it with one keyword so the program prints <code>8</code>.',
    compare: {
      cpp: { code: `std::function<int(int)> make_adder(int n) {
    return [n](int x) { return x + n; };   // capture by copy: fine
    // return [&n](int x) { ... };         // dangling
}`, outcome: 'Capture by copy is safe, by reference dangles', ok: true },
      rust: { code: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    |x| x + n
}`, outcome: 'Error: closure may outlive the function', ok: false, errorCode: 'E0373' },
      text: '<code>move</code> is the Rust counterpart of capturing by value (<code>[n]</code>) in C++. The difference is that Rust refuses to compile the by-reference version, where C++ would build a dangling lambda.',
    },
    refresher: [
      '<code>move |x| ...</code> takes ownership of what it captures; needed when a closure outlives its scope.',
      'A <code>Copy</code> capture is copied (original still usable); a <code>String</code> or <code>Vec</code> is moved (original gone).',
    ],
    hints: [
      'The error says the closure may outlive <code>make_adder</code>.',
      'Put <code>move</code> in front of the closure\'s bars.',
    ],
    inCpp: {
      code: `std::string name = "Ann";
auto greet = [name = std::move(name)] { std::cout << name; };   // init-capture moves it in`,
      note: 'C++14 init-captures with <code>std::move</code> are the nearest match for a <code>move</code> closure over a <code>String</code>. In Rust you just write <code>move</code>.',
    },
    starter: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    |x| x + n
}

fn main() {
    let add5 = make_adder(5);
    println!("{}", add5(3));
}`,
    solution: `fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

fn main() {
    let add5 = make_adder(5);
    println!("{}", add5(3));
}`,
    require: [{ pattern: '\\|x\\|\\s*x\\s*\\+\\s*n', message: 'Keep the closure that adds n.' }],
    tests: [{ name: 'Prints 8', expected: '8' }],
  },

  {
    id: 'r3-closure-move-predict',
    title: 'Does move leave it usable?',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile and run it.',
    refresher: [
      '<code>move</code> moves a <code>String</code> into the closure (original gone) but copies an <code>i32</code> (original still fine).',
    ],
    inCpp: {
      code: `std::string s = "hi";
auto f = [s = std::move(s)] { std::cout << s; };
// s is now empty but still usable in C++`,
      note: 'A moved-from C++ <code>std::string</code> stays usable. A moved-from Rust <code>String</code> may not be used at all.',
    },
    rounds: [
      {
        snippet: `fn main() {
    let s = String::from("hi");
    let f = move || println!("{}", s);
    f();
    println!("{}", s);
}`,
        choices: ['Prints hi twice', 'Error: borrow of moved value', 'Error: closure may outlive'],
        answer: 1,
        why: '<code>move</code> takes ownership of <code>s</code> into the closure, so the last <code>println!</code> uses a moved value.',
        errorCode: 'E0382',
        output: `error[E0382]: borrow of moved value: \`s\`
 --> src/main.rs:5:20
  |
2 |     let s = String::from("hi");
  |         - move occurs because \`s\` has type \`String\`, which does not implement the \`Copy\` trait
3 |     let f = move || println!("{}", s);
  |             -------                - variable moved due to use in closure
  |             |
  |             value moved into closure here
4 |     f();
5 |     println!("{}", s);
  |                    ^ value borrowed here after move`,
      },
      {
        snippet: `fn main() {
    let n = 5;
    let f = move || n + 1;
    println!("{} {}", f(), n);
}`,
        choices: ['Prints 6 5', 'Error: borrow of moved value', 'Prints 6 6'],
        answer: 0,
        why: 'An <code>i32</code> is <code>Copy</code>, so <code>move</code> copies it into the closure and <code>n</code> stays usable.',
        output: '6 5',
      },
    ],
  },

  {
    id: 'r3-count-if',
    title: 'count_if with a closure',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>count_if(v: &amp;[i32], pred: impl Fn(i32) -&gt; bool) -&gt; usize</code>: how many elements make <code>pred</code> return <code>true</code>.',
    refresher: [
      'Call the closure like a function: <code>pred(*x)</code>. Elements of a slice are borrowed, so dereference with <code>*</code>.',
      'Keep a counter with <code>let mut count = 0;</code> and return it.',
    ],
    hints: [
      'Loop with <code>for x in v</code> (each <code>x</code> is a <code>&amp;i32</code>).',
      'Test with <code>pred(*x)</code>; when true, add one.',
      'The counter is a <code>usize</code>: write <code>let mut count: usize = 0;</code> or let it be inferred.',
    ],
    inCpp: {
      code: `size_t count_if(const std::vector<int>& v, std::function<bool(int)> pred) {
    return std::count_if(v.begin(), v.end(), pred);
}`,
      note: 'The standard algorithm <code>std::count_if</code> takes the same kind of predicate. You are writing its body by hand here.',
    },
    starter: `fn count_if(v: &[i32], pred: impl Fn(i32) -> bool) -> usize {
    0
}`,
    solution: `fn count_if(v: &[i32], pred: impl Fn(i32) -> bool) -> usize {
    let mut count = 0;
    for x in v {
        if pred(*x) {
            count += 1;
        }
    }
    count
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", count_if(&[1, 2, 3, 4, 5, 6], |x| x % 2 == 0));
    println!("\\n@@TEST 2@@");
    let limit = 3;
    println!("{}", count_if(&[1, 5, 2, 9, 4], |x| x > limit));
    println!("\\n@@TEST 3@@");
    println!("{}", count_if(&[1, 3, 5], |x| x % 2 == 0));
    println!("\\n@@TEST 4@@");
    println!("{}", count_if(&[], |_| true));
}`,
    tests: [
      { name: 'Count evens', input: 'even', expected: '3' },
      { name: 'Closure captures a limit', input: '> limit', expected: '3' },
      { name: 'None match', input: 'no evens', expected: '0' },
      { name: 'Empty slice', input: '[]', expected: '0' },
    ],
  },

  // ------------------------------------------------------------------------------------------
  // 24. iterators
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-iter-idea',
    title: 'Iterators: next until None',
    kind: 'concept',
    introduces: ['iter'],
    teach: {
      body: [
        `<p>You have looped with <code>for x in &amp;v</code>, and used <code>.chars()</code> and <code>.split(',')</code> in a <code>for</code>. What are they handing to <code>for</code>? An <em>iterator</em>: an object that produces a sequence of values one at a time. Its one essential method is <code>.next()</code>, which returns an <code>Option</code>: <code>Some(item)</code> for the next value, then <code>None</code> once it is used up. A <code>for</code> loop is just "call <code>next</code> until it gives <code>None</code>".</p>`,
        `<p>In C++ a range is a pair of iterators, <code>begin()</code> and <code>end()</code>, which you compare and increment. A Rust iterator is a single object that knows its own end, so you pass around one thing, and you cannot step it past the end by mistake (it just says <code>None</code>). <code>v.iter()</code> makes an iterator over a vector or slice that <em>borrows</em> it, yielding references: <code>&amp;10</code>, <code>&amp;20</code>. A range like <code>0..3</code> is an iterator too.</p>`,
        `<p>To call <code>.next()</code> by hand, the iterator variable must be <code>let mut</code>, because each call changes where it is. You rarely do this, because <code>for</code> and the methods in the next lessons do it for you, but seeing it once explains everything else: iterators are an ordinary value with one simple method.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = vec![10, 20];
    let mut it = v.iter();             // an iterator that borrows v
    println!("{:?}", it.next());       // Some(10)
    println!("{:?}", it.next());       // Some(20)
    println!("{:?}", it.next());       // None: used up

    let mut r = 0..2;                  // a range is an iterator too
    println!("{:?}", r.next());
    for x in v.iter() {                // this is what "for x in &v" does
        println!("item {}", x);
    }
}`,
          output: 'Some(10)\nSome(20)\nNone\nSome(0)\nitem 10\nitem 20',
        },
      ],
      terms: [
        { code: 'v.iter()', meaning: 'an iterator over &T items; borrows the vector or slice' },
        { code: 'it.next()', meaning: 'Some(next item), or None when finished; it must be let mut' },
        { code: 'for x in iterator { }', meaning: 'calls next until None' },
      ],
    },
    task: 'Write <code>second(v: &amp;[i32]) -&gt; Option&lt;i32&gt;</code> using an iterator: call <code>next</code> once to skip the first item, then return the next one. The program prints <code>Some(20)</code>, <code>None</code>, <code>None</code>.',
    compare: {
      cpp: { code: `std::vector<int> v{10, 20};
auto it = v.begin();
*it;                    // 10
++it;
if (it != v.end()) {}   // you must compare with end() yourself`, outcome: 'Pair of iterators; you check end()', ok: true },
      rust: { code: `let v = vec![10, 20];
let mut it = v.iter();
println!("{:?}", it.next());
println!("{:?}", it.next());
println!("{:?}", it.next());`, outcome: 'Prints Some(10), Some(20), None', ok: true },
      text: 'A C++ iterator is a position you compare with <code>end()</code>. A Rust iterator is a stream that carries its own end, and signals it with <code>None</code>.',
    },
    refresher: [
      '<code>v.iter()</code> gives an iterator of references; <code>it.next()</code> returns <code>Some(item)</code> or <code>None</code>.',
      'A <code>for</code> loop calls <code>next</code> until <code>None</code>.',
    ],
    hints: [
      'Make <code>let mut it = v.iter();</code>.',
      'Call <code>it.next();</code> once and ignore the result, then <code>it.next()</code> gives the second item.',
      'The items are <code>&amp;i32</code>; turn <code>Option&lt;&amp;i32&gt;</code> into <code>Option&lt;i32&gt;</code> with <code>.map(|x| *x)</code>.',
    ],
    inCpp: {
      code: `void f(std::vector<int>& v) {
    for (auto it = v.begin(); it != v.end(); ++it) { std::cout << *it; }
    // an iterator is invalidated if the vector grows during the loop
}`,
      note: 'C++ iterators can be invalidated by modifying the container. A Rust iterator holds a borrow, so the borrow checker stops you changing the vector while it exists.',
    },
    starter: `fn second(v: &[i32]) -> Option<i32> {
    None
}

fn main() {
    println!("{:?}", second(&[10, 20, 30]));
    println!("{:?}", second(&[5]));
    println!("{:?}", second(&[]));
}`,
    solution: `fn second(v: &[i32]) -> Option<i32> {
    let mut it = v.iter();
    it.next();
    it.next().map(|x| *x)
}

fn main() {
    println!("{:?}", second(&[10, 20, 30]));
    println!("{:?}", second(&[5]));
    println!("{:?}", second(&[]));
}`,
    require: [{ pattern: '\\.next\\s*\\(', message: 'Use next on the iterator.' }],
    tests: [{ name: 'Prints Some(20), None, None', expected: 'Some(20)\nNone\nNone' }],
  },

  {
    id: 'r3-iter-kinds',
    title: 'iter, iter_mut, into_iter',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>A collection can give out an iterator in three ways, matching the three ways you can pass it around. <code>v.iter()</code> yields <code>&amp;T</code>, shared references: you may read the items and the vector stays yours. <code>v.iter_mut()</code> yields <code>&amp;mut T</code>: you may change each item in place, through <code>*</code>. <code>v.into_iter()</code> yields <code>T</code> itself, <em>consuming</em> the vector: the items move out, and the vector is gone.</p>`,
        `<p>These are exactly the three <code>for</code> loops from stage 2. <code>for x in &amp;v</code> is <code>for x in v.iter()</code>. <code>for x in &amp;mut v</code> is <code>for x in v.iter_mut()</code>. And plain <code>for x in v</code> is <code>for x in v.into_iter()</code>, which moves the vector. The methods are what you need when the iterator is the start of a longer chain.</p>`,
        `<p>If you are not sure which to use: <code>.iter()</code> is the default. Use <code>.iter_mut()</code> to modify in place, and <code>.into_iter()</code> only when you want to take the elements away, for example to move them into another collection. Mutable iteration follows borrow rules: while the <code>iter_mut</code> exists nothing else may use the vector.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let mut v = vec![1, 2, 3];
    for x in v.iter_mut() {            // &mut i32: change each element in place
        *x *= 10;
    }
    println!("{:?}", v);

    for x in v.iter() {                // &i32: read only
        println!("{}", x);
    }

    let names = vec![String::from("a"), String::from("b")];
    for s in names.into_iter() {       // String, moved out: names is consumed
        println!("{}", s);
    }
    // println!("{:?}", names);        // would not compile: names was moved
}`,
          output: '[10, 20, 30]\n10\n20\n30\na\nb',
        },
      ],
      terms: [
        { code: 'v.iter()', meaning: 'yields &T; the vector stays usable (same as for x in &v)' },
        { code: 'v.iter_mut()', meaning: 'yields &mut T; change items with *x (same as for x in &mut v)' },
        { code: 'v.into_iter()', meaning: 'yields T and consumes v (same as for x in v)' },
      ],
    },
    task: 'This loop tries to change elements through a shared reference and does not compile. Switch the iterator so the program prints <code>[2, 4, 6]</code>.',
    compare: {
      cpp: { code: `void f(std::vector<int> v) {
    for (const int& x : v) {}   // read only
    for (int& x : v) {}         // change in place
    for (int x : v) {}          // copy of each
    auto w = std::move(v);      // the vector is moved away
}`, outcome: 'const T&, T&, T, std::move', ok: true },
      rust: { code: `let mut v = vec![1, 2, 3];
for x in v.iter_mut() { *x += 1; }
println!("{:?}", v);`, outcome: 'iter, iter_mut, into_iter', ok: true },
      text: 'The three iterators match the three C++ loop forms: read-only reference, mutable reference, and by value. <code>into_iter</code> is the move, and it consumes the vector.',
    },
    refresher: [
      '<code>iter()</code> gives <code>&amp;T</code>, <code>iter_mut()</code> gives <code>&amp;mut T</code> (change with <code>*x</code>), <code>into_iter()</code> gives <code>T</code> and consumes the collection.',
    ],
    hints: [
      'You cannot assign through a shared reference.',
      'Use <code>v.iter_mut()</code>; the loop body <code>*x *= 2</code> then works.',
    ],
    inCpp: {
      code: `void f(std::vector<int>& v) {
    for (int& x : v) v.push_back(x);   // invalidates iterators: undefined behaviour
}`,
      note: 'Changing a C++ vector while looping over it can invalidate iterators. In Rust, <code>iter_mut</code> holds the borrow, so touching the vector inside the loop does not compile.',
    },
    starter: `fn main() {
    let mut v = vec![1, 2, 3];
    for x in v.iter() {
        *x *= 2;
    }
    println!("{:?}", v);
}`,
    solution: `fn main() {
    let mut v = vec![1, 2, 3];
    for x in v.iter_mut() {
        *x *= 2;
    }
    println!("{:?}", v);
}`,
    require: [{ pattern: '\\*x\\s*\\*=\\s*2', message: 'Keep the doubling.' }],
    tests: [{ name: 'Prints [2, 4, 6]', expected: '[2, 4, 6]' }],
  },

  {
    id: 'r3-iter-adaptors',
    title: 'Adaptors and collect',
    kind: 'concept',
    introduces: ['iter-adapters', 'collect'],
    teach: {
      body: [
        `<p>An iterator can be reshaped by chaining <em>adaptors</em>, methods that take an iterator and return a new one. <code>.map(f)</code> transforms each item (the same <code>map</code> you used on <code>Option</code>). <code>.filter(f)</code> keeps only items for which the closure returns <code>true</code>. <code>.copied()</code> turns an iterator of <code>&amp;i32</code> into one of plain <code>i32</code> values, which is handy for numbers. Chains read left to right like a pipeline: <code>v.iter().copied().filter(|x| *x % 2 == 0).map(|x| x * 10)</code>.</p>`,
        `<p>Closure parameters here follow one rule: <code>map</code> hands the closure each item itself, but <code>filter</code> hands it a <em>reference</em> to the item (so that it does not use it up), which is why the filter closure above writes <code>*x</code>. After <code>.copied()</code> the items are plain numbers; straight after <code>.iter()</code> they are references, and arithmetic like <code>x * x</code> works through them. If a type error mentions <code>&amp;</code> in a closure, add or remove a <code>*</code>.</p>`,
        `<p>An adaptor chain by itself does nothing yet, since iterators are <em>lazy</em>: they only do work when something asks for the items. The most common thing that asks is <code>.collect()</code>, which runs the whole pipeline and gathers the results into a collection. You must say which collection, because <code>collect</code> can build many kinds: write it in the variable's type, <code>let w: Vec&lt;i32&gt; = ... .collect();</code>, or with the turbofish, <code>.collect::&lt;Vec&lt;i32&gt;&gt;()</code>. In a type, a lone <code>_</code> means "let the compiler fill this in", so <code>Vec&lt;_&gt;</code> is allowed when the item type is obvious. Collecting characters into a <code>String</code> works too.</p>`,
        `<p>This is C++20 ranges (<code>v | std::views::filter(...) | std::views::transform(...)</code>), and also the loop you would write by hand with a result vector and a <code>push_back</code> inside an <code>if</code>. The chain is lazy and fused: one pass over the data, no temporary vector between steps.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = vec![1, 2, 3, 4, 5, 6];
    let evens: Vec<i32> = v.iter().copied().filter(|x| *x % 2 == 0).collect();
    println!("{:?}", evens);

    let squares = v.iter().map(|x| x * x).collect::<Vec<i32>>();   // turbofish form
    println!("{:?}", squares);

    let big: Vec<_> = v.iter().copied().filter(|x| *x > 3).map(|x| x * 10).collect();
    println!("{:?}", big);

    let up = "abc".chars().map(|c| c.to_ascii_uppercase()).collect::<String>();
    println!("{}", up);
}`,
          output: '[2, 4, 6]\n[1, 4, 9, 16, 25, 36]\n[40, 50, 60]\nABC',
          caption: '<code>to_ascii_uppercase()</code> is a method on a <code>char</code> that gives the capital letter; <code>.chars()</code> yields the characters of a string.',
        },
      ],
      terms: [
        { code: '.map(|x| ...)', meaning: 'transform each item' },
        { code: '.filter(|x| ...)', meaning: 'keep items where the closure is true (it receives a reference)' },
        { code: '.copied()', meaning: 'items of &i32 become i32 (for Copy types)' },
        { code: '.collect()', meaning: 'run the chain and build a collection; the type says which' },
        { code: 'Vec<_>', meaning: 'a Vec whose item type the compiler fills in' },
      ],
    },
    task: 'Write <code>evens_squared(v: &amp;[i32]) -&gt; Vec&lt;i32&gt;</code>: the squares of the even numbers, in order, built with one iterator chain. For <code>[1, 2, 3, 4]</code> it returns <code>[4, 16]</code>.',
    compare: {
      cpp: { code: `#include <ranges>
std::vector<int> loop(const std::vector<int>& v) {
    std::vector<int> out;
    for (int x : v)
        if (x % 2 == 0) out.push_back(x * x);
    return out;
}
// C++20 ranges:
void lazy(const std::vector<int>& v) {
    auto view = v | std::views::filter([](int x) { return x % 2 == 0; })
                  | std::views::transform([](int x) { return x * x; });
}`, outcome: 'A loop, or C++20 ranges', ok: true },
      rust: { code: `let v = vec![1, 2, 3, 4];
let out: Vec<i32> = v.iter().copied()
    .filter(|x| *x % 2 == 0)
    .map(|x| x * x)
    .collect();`, outcome: 'filter, map, collect', ok: true },
      text: 'A Rust chain is C++20 ranges with method syntax. The main difference is that you finish with <code>collect()</code> to get a container, where a C++ view stays lazy until you iterate it.',
    },
    cppStd: 20,
    refresher: [
      '<code>map</code> transforms, <code>filter</code> keeps (its closure gets a reference), <code>copied</code> drops the <code>&amp;</code>; nothing runs until <code>collect</code> or similar.',
      '<code>collect</code> needs to know the target type: <code>let w: Vec&lt;i32&gt; = ... .collect();</code>.',
    ],
    hints: [
      'Start with <code>v.iter().copied()</code>.',
      'Keep evens with <code>.filter(|x| *x % 2 == 0)</code>, then square with <code>.map(|x| x * x)</code>.',
      'End with <code>.collect()</code>; the return type tells it to build a <code>Vec&lt;i32&gt;</code>.',
    ],
    inCpp: {
      code: `void evens(const std::vector<int>& v, std::vector<int>& out) {
    std::copy_if(v.begin(), v.end(), std::back_inserter(out), [](int x) { return x % 2 == 0; });
}   // algorithms fill an output`,
      note: 'Classic C++ algorithms write into an output iterator. A Rust chain returns the finished collection from <code>collect</code>.',
    },
    starter: `fn evens_squared(v: &[i32]) -> Vec<i32> {
    Vec::new()
}

fn main() {
    println!("{:?}", evens_squared(&[1, 2, 3, 4]));
    println!("{:?}", evens_squared(&[5, 7]));
}`,
    solution: `fn evens_squared(v: &[i32]) -> Vec<i32> {
    v.iter().copied().filter(|x| *x % 2 == 0).map(|x| x * x).collect()
}

fn main() {
    println!("{:?}", evens_squared(&[1, 2, 3, 4]));
    println!("{:?}", evens_squared(&[5, 7]));
}`,
    require: [{ pattern: '\\.collect\\s*\\(', message: 'Finish the chain with collect.' }],
    forbidden: [{ pattern: '\\bfor\\b', message: 'Use an iterator chain, not a loop.' }],
    tests: [{ name: 'Prints [4, 16] and []', expected: '[4, 16]\n[]' }],
  },

  {
    id: 'r3-iter-lazy',
    title: 'Iterators are lazy',
    kind: 'predict',
    introduces: [],
    task: 'For each program, pick what you expect, then compile and run it.',
    cppStd: 20,
    refresher: [
      'Adaptors like <code>map</code> and <code>filter</code> do nothing until something consumes the iterator.',
      '<code>collect</code> (or <code>sum</code>, or a <code>for</code> loop) is what runs the chain.',
    ],
    inCpp: {
      code: `#include <ranges>
void f(const std::vector<int>& v) {
    auto view = v | std::views::transform([](int x) { std::cout << x; return x; });
    // nothing printed yet: views are lazy too
}`,
      note: 'C++20 range views are lazy in the same way: nothing runs until you iterate. Rust also warns you about an adaptor chain that is never used.',
    },
    rounds: [
      {
        snippet: `fn main() {
    let v = vec![1, 2];
    let it = v.iter().map(|x| {
        println!("saw {}", x);
        x * 2
    });
    println!("done");
}`,
        choices: ['saw 1, saw 2, done', 'Only done', 'Does not compile'],
        answer: 1,
        why: '<code>map</code> only builds a new iterator. Nothing consumes it, so the closure never runs.',
        output: 'done',
      },
      {
        snippet: `fn main() {
    let v = vec![1, 2];
    let w: Vec<i32> = v.iter().map(|x| {
        println!("saw {}", x);
        x * 2
    }).collect();
    println!("{:?}", w);
}`,
        choices: ['Only [2, 4]', 'saw 1, saw 2, then [2, 4]', '[2, 4] then saw 1, saw 2'],
        answer: 1,
        why: '<code>collect</code> pulls every item through the closure, so the prints happen first, then the final line.',
        output: 'saw 1\nsaw 2\n[2, 4]',
      },
    ],
  },

  {
    id: 'r3-iter-moved',
    title: 'The loop that ate the vector',
    kind: 'fix',
    introduces: [],
    task: 'This loop moves <code>v</code> and then <code>v.len()</code> uses it. Fix it so the program prints <code>6 3</code>, keeping the vector usable after the loop.',
    errorCode: 'E0382',
    gloss: '<code>for x in v</code> calls <code>into_iter</code>, which moves the vector into the loop; afterwards <code>v</code> is gone.',
    refresher: [
      '<code>for x in v</code> consumes <code>v</code>; <code>for x in &amp;v</code> (or <code>v.iter()</code>) only borrows it.',
      'With a borrowing loop each <code>x</code> is a <code>&amp;i32</code>, and <code>total += x</code> still works.',
    ],
    hints: [
      'The error says <code>v</code> was moved by the loop.',
      'Make the loop borrow instead: <code>&amp;v</code> or <code>.iter()</code>.',
    ],
    inCpp: {
      code: `void f(std::vector<int> v) {
    int total = 0;
    for (int x : std::move(v)) total += x;   // explicit move
    std::cout << v.size();                    // allowed: valid but unspecified
}`,
      note: 'In C++ you only move a vector by writing <code>std::move</code>. A Rust <code>for x in v</code> moves it silently, which is why the compiler checks the later use.',
    },
    starter: `fn main() {
    let v = vec![1, 2, 3];
    let mut total = 0;
    for x in v {
        total += x;
    }
    println!("{} {}", total, v.len());
}`,
    solution: `fn main() {
    let v = vec![1, 2, 3];
    let mut total = 0;
    for x in &v {
        total += x;
    }
    println!("{} {}", total, v.len());
}`,
    require: [{ pattern: 'v\\.len\\(\\)', message: 'Keep using v.len() after the loop.' }],
    tests: [{ name: 'Prints 6 3', expected: '6 3' }],
  },

  {
    id: 'r3-iter-consume',
    title: 'Consumers: sum, max, position',
    kind: 'concept',
    introduces: ['iter-consumers', 'min-max'],
    teach: {
      body: [
        `<p>Adaptors reshape an iterator; <em>consumers</em> use it up and produce a single answer. The ones you will reach for most: <code>.sum()</code> adds the items (put a type on it, <code>let t: i32 = ...sum();</code> or <code>.sum::&lt;i32&gt;()</code>, since it can add into several types). <code>.count()</code> counts them. <code>.max()</code> and <code>.min()</code> give the largest and smallest. Because there may be no items at all, they return an <code>Option</code>: <code>Some(9)</code>, or <code>None</code> for an empty sequence.</p>`,
        `<p>Questions about the items have consumers too. <code>.any(|x| ...)</code> is true if the closure says yes for at least one item, and <code>.all(|x| ...)</code> if it does for every item; both stop as soon as the answer is known. <code>.position(|x| ...)</code> returns <code>Some(index)</code> of the first match, or <code>None</code>, the safe cousin of the C++ <code>std::find</code> distance plus an end check. <code>.find(|x| ...)</code> returns the item itself instead of its index. Note that these closures receive a reference (so <code>*x</code> on an <code>iter()</code>).</p>`,
        `<p>The general one is <code>.fold(start, |acc, x| ...)</code>: it keeps a running value (the accumulator). It begins with <code>start</code>, calls the closure with the accumulator and each item in turn, and uses the result as the next accumulator. It is <code>std::accumulate</code>: <code>.fold(1, |acc, x| acc * x)</code> multiplies everything. <code>.sum()</code> is a <code>fold</code> with <code>+</code>.</p>`,
        `<p>Separately, <code>a.max(b)</code> and <code>a.min(b)</code> on two plain numbers give the larger or smaller of the two, like <code>std::max</code>. The same names, a different job: on an iterator they scan, on a number they compare with one other value.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = vec![3, 9, 4];
    let total: i32 = v.iter().sum();                       // 16
    println!("{} {}", total, v.iter().count());
    println!("{:?} {:?}", v.iter().max(), v.iter().min());  // Option: Some(9) Some(3)
    println!("{}", v.iter().any(|x| *x > 8));              // true
    println!("{}", v.iter().all(|x| *x > 3));              // false
    println!("{:?}", v.iter().position(|x| *x == 4));      // Some(2)
    let product = v.iter().fold(1, |acc, x| acc * x);      // 1 * 3 * 9 * 4
    println!("{}", product);
    println!("{}", 5.max(2));                              // two numbers: 5
    let empty: Vec<i32> = Vec::new();
    println!("{:?}", empty.iter().max());                  // None
}`,
          output: '16 3\nSome(9) Some(3)\ntrue\nfalse\nSome(2)\n108\n5\nNone',
        },
      ],
      terms: [
        { code: '.sum() / .count()', meaning: 'add the items / count them (sum needs a type)' },
        { code: '.max() / .min()', meaning: 'Option of the largest / smallest item' },
        { code: '.any(f) / .all(f)', meaning: 'is f true for some / every item' },
        { code: '.position(f)', meaning: 'Some(index of the first match) or None' },
        { code: '.fold(start, |acc, x| ...)', meaning: 'running accumulator, like std::accumulate' },
        { code: 'a.max(b)', meaning: 'the larger of two numbers' },
      ],
    },
    task: 'Write <code>spread(v: &amp;[i32]) -&gt; Option&lt;i32&gt;</code>: largest minus smallest, or <code>None</code> for an empty slice. Use iterator consumers and <code>?</code>.',
    compare: {
      cpp: { code: `std::vector<int> v{3, 9, 4};
int total = std::accumulate(v.begin(), v.end(), 0);
auto mx = *std::max_element(v.begin(), v.end());   // UB if v is empty`, outcome: 'Free functions; empty input is UB', ok: true },
      rust: { code: `let v = vec![3, 9, 4];
let total: i32 = v.iter().sum();
let mx = v.iter().max();   // Option: None if empty`, outcome: 'Methods; emptiness is in the type', ok: true },
      text: 'C++ algorithms are free functions, and <code>max_element</code> on an empty range gives an iterator you must not dereference. A Rust <code>max()</code> returns an <code>Option</code>, so the empty case is handled by the type.',
    },
    refresher: [
      '<code>sum</code>, <code>count</code>, <code>max</code>/<code>min</code> (Options), <code>any</code>, <code>all</code>, <code>position</code>, <code>fold</code> end a chain with one answer.',
      '<code>?</code> on an <code>Option</code> inside a function returning <code>Option</code> returns <code>None</code> early.',
    ],
    hints: [
      '<code>v.iter().max()?</code> gives a <code>&amp;i32</code>, or returns <code>None</code> from <code>spread</code> if the slice is empty.',
      'Do the same with <code>min</code>, then <code>Some(*max - *min)</code>.',
    ],
    inCpp: {
      code: `int spread(const std::vector<int>& v) {
    auto [mn, mx] = std::minmax_element(v.begin(), v.end());
    return *mx - *mn;   // UB if v is empty
}`,
      note: 'In C++ the empty-input check is yours to remember. Here <code>max()</code> and <code>min()</code> return an <code>Option</code>, so the empty case cannot be skipped.',
    },
    starter: `fn spread(v: &[i32]) -> Option<i32> {
    None
}`,
    solution: `fn spread(v: &[i32]) -> Option<i32> {
    let max = v.iter().max()?;
    let min = v.iter().min()?;
    Some(*max - *min)
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{:?}", spread(&[3, 9, 4]));
    println!("\\n@@TEST 2@@");
    println!("{:?}", spread(&[7]));
    println!("\\n@@TEST 3@@");
    println!("{:?}", spread(&[]));
    println!("\\n@@TEST 4@@");
    println!("{:?}", spread(&[-5, 5, 0]));
}`,
    tests: [
      { name: 'Normal slice', input: '[3,9,4]', expected: 'Some(6)' },
      { name: 'One element', input: '[7]', expected: 'Some(0)' },
      { name: 'Empty slice', input: '[]', expected: 'None' },
      { name: 'Negative values', input: '[-5,5,0]', expected: 'Some(10)' },
    ],
  },

  {
    id: 'r3-iter-more',
    title: 'enumerate, zip, rev, take, skip',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>A few more adaptors cover most of what C++ people do with an index variable. <code>.enumerate()</code> pairs every item with its position, yielding tuples <code>(index, item)</code>, so <code>for (i, x) in v.iter().enumerate()</code> replaces <code>for (int i = 0; i &lt; v.size(); i++)</code> with no way to go out of range. (The <code>(i, x)</code> is a tuple pattern in the loop, as in the destructuring you saw in stage 1.) <code>.zip(other)</code> walks two iterators side by side and yields pairs, stopping at the shorter. Closure parameters may be patterns too, so <code>|(x, y)|</code> takes such a pair apart into <code>x</code> and <code>y</code>, just as <code>let (x, y) = pair;</code> does.</p>`,
        `<p><code>.rev()</code> runs a sequence backwards: <code>(0..n).rev()</code> counts down from <code>n - 1</code> to <code>0</code>, which is the safe way to loop down with an unsigned counter. <code>.take(n)</code> keeps the first <code>n</code> items and <code>.skip(n)</code> drops them, and <code>.step_by(k)</code> takes every <code>k</code>th. All of them are lazy adaptors you chain and finish with a consumer or a <code>for</code> loop.</p>`,
        `<p>Slices have two helpers worth knowing. <code>v.windows(2)</code> yields every run of 2 neighbouring items as a small slice (<code>[a, b]</code>, then <code>[b, c]</code>, ...). <code>v.chunks(2)</code> yields non-overlapping pieces. Both give <code>&amp;[T]</code> views, so you can index them as <code>w[0]</code> and <code>w[1]</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let names = vec!["ann", "bob", "cy"];
    for (i, n) in names.iter().enumerate() {            // (index, item) pairs
        println!("{}: {}", i, n);
    }

    let a = vec![1, 2, 3];
    let b = vec![10, 20, 30];
    let dots: Vec<i32> = a.iter().zip(b.iter()).map(|(x, y)| x * y).collect();
    println!("{:?}", dots);

    for i in (0..3).rev() {                             // 2, 1, 0
        print!("{} ", i);
    }
    println!();

    let firsts: Vec<i32> = a.iter().copied().skip(1).take(1).collect();
    println!("{:?}", firsts);

    for w in b.windows(2) {                             // overlapping pairs
        println!("{}", w[1] - w[0]);
    }
}`,
          output: '0: ann\n1: bob\n2: cy\n[10, 40, 90]\n2 1 0 \n[2]\n10\n10',
        },
      ],
      terms: [
        { code: '.enumerate()', meaning: 'items become (index, item) tuples' },
        { code: 'a.zip(b)', meaning: 'pairs of items from two iterators, up to the shorter' },
        { code: '(0..n).rev()', meaning: 'counts down from n - 1 to 0' },
        { code: '.take(n) / .skip(n)', meaning: 'only the first n / all but the first n' },
        { code: 'v.windows(2)', meaning: 'every overlapping run of 2 items, as slices' },
      ],
    },
    task: 'The program prints the list without positions. Use <code>enumerate</code> so each line reads <code>0: 10</code>, <code>1: 20</code>, <code>2: 30</code>.',
    compare: {
      cpp: { code: `std::vector<int> v{10, 20, 30};
for (size_t i = 0; i < v.size(); i++)
    std::cout << i << ": " << v[i] << "\\n";`, outcome: 'Manual index; v[i] can go out of range', ok: true },
      rust: { code: `let v = vec![10, 20, 30];
for (i, x) in v.iter().enumerate() {
    println!("{}: {}", i, x);
}`, outcome: 'Index and item together; no indexing', ok: true },
      text: '<code>enumerate</code> gives you the index without a counter variable and without indexing, so the loop cannot run off the end. C++23 has <code>std::views::enumerate</code> for the same purpose.',
    },
    refresher: [
      '<code>for (i, x) in v.iter().enumerate()</code> gives the position and the item; <code>zip</code>, <code>rev</code>, <code>take</code> and <code>skip</code> chain the same way.',
    ],
    hints: [
      'Change the loop to <code>for (i, x) in v.iter().enumerate()</code>.',
      'Print both: <code>println!("{}: {}", i, x)</code>.',
    ],
    inCpp: {
      code: `void f(std::vector<int>& v) {
    for (size_t i = v.size(); i-- > 0; ) std::cout << v[i];   // the unsigned down-counting trick
}`,
      note: 'Counting down with an unsigned index in C++ needs a trick to avoid underflow. <code>(0..n).rev()</code> is the same loop with no trick.',
    },
    starter: `fn main() {
    let v = vec![10, 20, 30];
    for x in v.iter() {
        println!("{}", x);
    }
}`,
    solution: `fn main() {
    let v = vec![10, 20, 30];
    for (i, x) in v.iter().enumerate() {
        println!("{}: {}", i, x);
    }
}`,
    require: [{ pattern: '\\.enumerate\\s*\\(', message: 'Use enumerate.' }],
    tests: [{ name: 'Prints the indexed list', expected: '0: 10\n1: 20\n2: 30' }],
  },

  {
    id: 'r3-iter-practice',
    title: 'Longest word length',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>longest(s: &amp;str) -&gt; usize</code>: the length (in bytes) of the longest word in <code>s</code>, where words are separated by whitespace. An empty text gives <code>0</code>. Use an iterator chain.',
    refresher: [
      '<code>s.split_whitespace()</code> is an iterator of words; <code>.map(|w| w.len())</code> gives lengths; <code>.max()</code> returns an <code>Option</code>.',
      '<code>unwrap_or(0)</code> supplies the answer for no words.',
    ],
    hints: [
      'Chain <code>s.split_whitespace().map(|w| w.len())</code>.',
      'Finish with <code>.max().unwrap_or(0)</code>.',
    ],
    inCpp: {
      code: `size_t longest(const std::string& s) {
    std::istringstream in(s);
    std::string w;
    size_t best = 0;
    while (in >> w) best = std::max(best, w.size());
    return best;
}`,
      note: 'The C++ version needs a stream, a loop and a running maximum. The Rust chain says the same thing as three steps: split, measure, take the biggest.',
    },
    starter: `fn longest(s: &str) -> usize {
    0
}`,
    solution: `fn longest(s: &str) -> usize {
    s.split_whitespace().map(|w| w.len()).max().unwrap_or(0)
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", longest("the quick brown fox"));
    println!("\\n@@TEST 2@@");
    println!("{}", longest("   "));
    println!("\\n@@TEST 3@@");
    println!("{}", longest("a bb ccc"));
    println!("\\n@@TEST 4@@");
    println!("{}", longest("one"));
}`,
    tests: [
      { name: 'Several words', input: 'the quick brown fox', expected: '5' },
      { name: 'Only spaces', input: '"   "', expected: '0' },
      { name: 'Growing lengths', input: 'a bb ccc', expected: '3' },
      { name: 'One word', input: 'one', expected: '3' },
    ],
  },

  // ------------------------------------------------------------------------------------------
  // 25. deeper patterns
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-pattern-destructure',
    title: 'Destructuring structs and nested data',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>In stage 1 you took a tuple apart with <code>let (a, b) = pair;</code>. A <em>pattern</em> is that same idea in a general form, and patterns work in <code>let</code>, in <code>match</code> arms, in <code>for</code> loops and in function parameters. A struct pattern lists its fields: <code>let Point { x, y } = p;</code> makes variables <code>x</code> and <code>y</code> from the fields. To use a different variable name, write <code>field: name</code>: <code>Point { x: a, y: b }</code>. To ignore the fields you do not need, end the pattern with <code>..</code>: <code>Point { x, .. }</code>.</p>`,
        `<p>Patterns can also contain literal values, which turns a <code>match</code> into a check of the structure. <code>Point { x: 0, y }</code> matches only points whose <code>x</code> is <code>0</code> and gives you their <code>y</code>. Patterns nest, so you can go through a tuple inside a struct inside an enum in one line. Arms are tried top to bottom, so put the specific ones first and the general one last. In a <code>match</code>, you can also build a tuple of several values and match on it: <code>match (a &gt; 0, b &gt; 0) { (true, true) =&gt; ..., _ =&gt; ... }</code>.</p>`,
        `<p>One more piece: a pattern may start with <code>&amp;</code> to take a reference apart. If <code>pairs</code> is a <code>Vec</code> of <code>(i32, char)</code>, then <code>for &amp;(n, c) in &amp;pairs</code> receives each item by reference and the pattern <code>&amp;(n, c)</code> copies the two fields out. It is the pattern form of <code>*</code>, and it works when the contents are <code>Copy</code>.</p>`,
      ],
      examples: [
        {
          code: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 3, y: -1 };
    let Point { x, y } = p;                  // two new variables
    println!("{} {}", x, y);
    let Point { x: a, .. } = p;              // rename, ignore y
    println!("{}", a);

    match p {
        Point { x: 0, y } => println!("on the y axis at {}", y),
        Point { x, y: 0 } => println!("on the x axis at {}", x),
        Point { .. } => println!("somewhere else"),
    }

    let pairs = vec![(1, 'a'), (2, 'b')];
    for &(n, c) in &pairs {                  // & takes the reference apart
        println!("{} {}", n, c);
    }
}`,
          output: '3 -1\n3\nsomewhere else\n1 a\n2 b',
        },
      ],
      terms: [
        { code: 'let Point { x, y } = p;', meaning: 'makes x and y from the fields' },
        { code: 'Point { x: a, .. }', meaning: 'rename one field; .. ignores the rest' },
        { code: 'Point { x: 0, y }', meaning: 'matches only when x is 0; names y' },
        { code: 'for &(n, c) in &pairs', meaning: 'a pattern with & copies the fields out of each reference' },
      ],
    },
    task: 'Write <code>where_is(p: Point)</code> with one <code>match</code> on struct patterns: <code>origin</code> for (0, 0), <code>y axis</code> when only <code>x</code> is 0, <code>x axis</code> when only <code>y</code> is 0, otherwise <code>elsewhere</code>.',
    compare: {
      cpp: { code: `struct Point { int x, y; };
Point p{3, -1};
auto [x, y] = p;     // C++17 structured binding: all fields, no literals`, outcome: 'Structured binding takes it all apart', ok: true },
      rust: { code: `struct Point { x: i32, y: i32 }
let p = Point { x: 0, y: 5 };
match p {
    Point { x: 0, y } => println!("y axis {}", y),
    Point { .. } => println!("other"),
}`, outcome: 'A pattern can test values and bind', ok: true },
      text: 'C++17 structured bindings unpack every field. A Rust pattern can also test literal values and nested shapes in the same step, which is what makes a <code>match</code> so expressive.',
    },
    refresher: [
      'Patterns work in <code>let</code>, <code>match</code>, <code>for</code> and parameters: <code>Point { x, y }</code>, <code>Point { x: 0, .. }</code>, <code>&amp;(a, b)</code>.',
      'Arms are tried in order; put the specific ones first.',
    ],
    hints: [
      'Write the most specific pattern first: <code>Point { x: 0, y: 0 }</code>.',
      'Use <code>Point { x: 0, .. }</code> for "x is zero, anything for y".',
      'End with <code>Point { .. }</code> for everything else.',
    ],
    inCpp: {
      code: `struct Point { int x, y; };
void f(Point p) {
    auto [x, y] = p;
    if (x == 0 && y == 0) { /* origin */ }
    else if (x == 0) { /* y axis */ }
}`,
      note: 'With a C++ binding you unpack first and test afterwards. A Rust pattern tests and unpacks together.',
    },
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn where_is(p: Point) -> &'static str {
    "elsewhere"
}

fn main() {
    println!("{}", where_is(Point { x: 0, y: 0 }));
    println!("{}", where_is(Point { x: 0, y: 4 }));
    println!("{}", where_is(Point { x: 2, y: 0 }));
    println!("{}", where_is(Point { x: 2, y: 3 }));
}`,
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn where_is(p: Point) -> &'static str {
    match p {
        Point { x: 0, y: 0 } => "origin",
        Point { x: 0, .. } => "y axis",
        Point { y: 0, .. } => "x axis",
        Point { .. } => "elsewhere",
    }
}

fn main() {
    println!("{}", where_is(Point { x: 0, y: 0 }));
    println!("{}", where_is(Point { x: 0, y: 4 }));
    println!("{}", where_is(Point { x: 2, y: 0 }));
    println!("{}", where_is(Point { x: 2, y: 3 }));
}`,
    require: [{ pattern: 'Point\\s*\\{\\s*x\\s*:\\s*0', message: 'Match with struct patterns such as Point { x: 0, .. }.' }],
    tests: [{ name: 'Classifies four points', expected: 'origin\ny axis\nx axis\nelsewhere' }],
  },

  {
    id: 'r3-while-let',
    title: 'while let',
    kind: 'concept',
    introduces: ['pop'],
    teach: {
      body: [
        `<p>You know <code>if let</code>: run a block once if a pattern matches. <code>while let</code> is its loop form: keep running the block for as long as the pattern keeps matching, and stop the first time it does not. The classic use is emptying a stack. <code>v.pop()</code> removes the last element of a <code>Vec</code> and returns it as an <code>Option</code>: <code>Some(x)</code>, or <code>None</code> when the vector is empty. So <code>while let Some(top) = stack.pop() { ... }</code> pops and processes until nothing is left.</p>`,
        `<p>The function below declares its parameter as <code>mut stack: Vec&lt;i32&gt;</code>. The <code>mut</code> makes the parameter variable changeable inside the function, which <code>pop</code> needs. It does not change what the caller sees: the vector was moved in, so this function owns it.</p>`,
        `<p>In C++ the same loop is <code>while (!s.empty()) { auto t = s.back(); s.pop_back(); ... }</code>: you check, then read, then remove, in three steps that you have to keep in order. Here the check and the removal are one operation, so you cannot read from an empty stack by mistake. The popped value is yours (owned), so the body is free to push new items onto the same vector. That is how worklist algorithms (depth first search, for example) are written.</p>`,
        `<p>It works with anything that returns an <code>Option</code> each time: <code>while let Some(x) = it.next()</code> on an iterator is what a <code>for</code> loop does for you.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let mut stack = vec![1, 2, 3];
    while let Some(top) = stack.pop() {     // stops when pop gives None
        println!("{}", top);
    }

    let mut work = vec![3];
    while let Some(n) = work.pop() {        // the body may push more work
        println!("visit {}", n);
        if n > 1 {
            work.push(n - 1);
        }
    }
}`,
          output: '3\n2\n1\nvisit 3\nvisit 2\nvisit 1',
        },
      ],
      terms: [
        { code: 'v.pop()', meaning: 'removes and returns the last item: Some(x), or None if empty' },
        { code: 'while let PATTERN = expr { }', meaning: 'repeats while the pattern matches' },
      ],
    },
    task: 'Write <code>sum_stack(mut stack: Vec&lt;i32&gt;) -&gt; i32</code> using <code>while let</code> and <code>pop</code>: add up every element. It should print <code>6</code> and then <code>0</code>.',
    compare: {
      cpp: { code: `std::vector<int> s{1, 2, 3};
while (!s.empty()) {
    int top = s.back();     // read
    s.pop_back();           // remove
    std::cout << top;
}`, outcome: 'Check, read, remove: three steps', ok: true },
      rust: { code: `let mut s = vec![1, 2, 3];
while let Some(top) = s.pop() {
    println!("{}", top);
}`, outcome: 'One step that cannot underflow', ok: true },
      text: 'C++ <code>pop_back()</code> on an empty vector is undefined behaviour, so you guard it by hand. Rust\'s <code>pop</code> returns an <code>Option</code>, and <code>while let</code> stops on <code>None</code>.',
    },
    refresher: [
      '<code>while let Some(x) = v.pop()</code> pops and processes until empty.',
      '<code>pop</code> returns an <code>Option</code>; the loop body can push more items.',
    ],
    hints: [
      'Keep <code>let mut total = 0;</code>.',
      'Loop with <code>while let Some(x) = stack.pop()</code> and add <code>x</code>.',
    ],
    inCpp: {
      code: `std::stack<int> st;
// st.top() on an empty stack: undefined behaviour`,
      note: 'The <code>empty()</code> check before <code>top()</code> or <code>pop_back()</code> is a convention. <code>Option</code> turns it into something the compiler enforces.',
    },
    starter: `fn sum_stack(mut stack: Vec<i32>) -> i32 {
    0
}

fn main() {
    println!("{}", sum_stack(vec![1, 2, 3]));
    println!("{}", sum_stack(vec![]));
}`,
    solution: `fn sum_stack(mut stack: Vec<i32>) -> i32 {
    let mut total = 0;
    while let Some(x) = stack.pop() {
        total += x;
    }
    total
}

fn main() {
    println!("{}", sum_stack(vec![1, 2, 3]));
    println!("{}", sum_stack(vec![]));
}`,
    require: [{ pattern: 'while\\s+let\\s+Some', message: 'Use while let Some(...).' }],
    tests: [{ name: 'Prints 6 and 0', expected: '6\n0' }],
  },

  {
    id: 'r3-let-else',
    title: 'let ... else',
    kind: 'concept',
    introduces: ['let-else'],
    teach: {
      body: [
        `<p>Often you want "get the value out of this <code>Option</code> or <code>Result</code>, and if that fails, leave early". With <code>if let</code> and <code>match</code> the real work ends up nested one level deeper than the check. <code>let ... else</code> keeps the happy path flat: <code>let Some(x) = opt else { return 0; };</code>. It says: "match this pattern and bring <code>x</code> into scope for the rest of the function; if the pattern does not match, run the <code>else</code> block".</p>`,
        `<p>The <code>else</code> block must not fall through. It has to leave: <code>return</code>, <code>break</code>, <code>continue</code> or a panic. That is how the compiler knows <code>x</code> is always available after the statement. Note the <code>else</code> belongs to <code>let</code> (do not confuse it with an <code>if</code>/<code>else</code>), and the whole thing ends with a semicolon. It works with any refutable pattern, including <code>Ok(n)</code> and <code>Some((a, b))</code>.</p>`,
        `<p>This is the Rust version of the C++ "guard clause": <code>if (!ptr) return;</code> at the top, then straight-line code. The difference is that the guard also unwraps the value for you.</p>`,
      ],
      examples: [
        {
          code: `fn double_first_even(v: &[i32]) -> i32 {
    let Some(x) = v.iter().find(|x| *x % 2 == 0) else {   // no even number: leave
        return -1;
    };
    *x * 2                                                  // x is available here
}

fn parse_or_zero(s: &str) -> i32 {
    let Ok(n) = s.trim().parse::<i32>() else {
        return 0;
    };
    n
}

fn main() {
    println!("{}", double_first_even(&[3, 8, 5]));
    println!("{}", double_first_even(&[3, 5]));
    println!("{} {}", parse_or_zero(" 42 "), parse_or_zero("x"));
}`,
          output: '16\n-1\n42 0',
        },
      ],
      terms: [
        { code: 'let Some(x) = opt else { return ...; };', meaning: 'bind x, or run the else block, which must leave' },
        { code: 'let Ok(n) = res else { ... };', meaning: 'the same for a Result' },
      ],
    },
    task: 'Write <code>kind(s: &amp;str) -&gt; String</code> with <code>let ... else</code>: parse <code>s</code> as a <code>u32</code> age (return <code>invalid</code> if it fails), then return <code>adult</code> for 18 or more and <code>minor</code> otherwise.',
    compare: {
      cpp: { code: `std::string kind(const std::string& s) {
    int age;
    try { age = std::stoi(s); } catch (...) { return "invalid"; }
    return age >= 18 ? "adult" : "minor";
}`, outcome: 'try/catch guard, then the main path', ok: true },
      rust: { code: `fn kind(s: &str) -> String {
    let Ok(age) = s.parse::<u32>() else {
        return String::from("invalid");
    };
    if age >= 18 { String::from("adult") } else { String::from("minor") }
}`, outcome: 'Guard clause that also unwraps', ok: true },
      text: 'A <code>let</code>-<code>else</code> is a guard clause that also binds the value. The happy path stays at the left margin instead of nesting inside <code>if let</code> or <code>match</code>.',
    },
    refresher: [
      '<code>let Pattern = expr else { return ...; };</code> binds on success and leaves on failure; the else block must return, break, continue or panic.',
    ],
    hints: [
      'Start with <code>let Ok(age) = s.parse::&lt;u32&gt;() else { ... };</code>.',
      'The else block returns <code>String::from("invalid")</code>.',
      'After it, an <code>if</code> picks <code>adult</code> or <code>minor</code>.',
    ],
    inCpp: {
      code: `void f(std::map<int, int>& m, int k) {
    if (auto it = m.find(k); it == m.end()) return;   // C++17 if-with-initialiser guard
    // it is not in scope here
}`,
      note: 'C++17 <code>if</code> with an initialiser scopes the name inside the <code>if</code>. A Rust <code>let</code>-<code>else</code> keeps the new name in scope afterwards.',
    },
    starter: `fn kind(s: &str) -> String {
    String::new()
}

fn main() {
    println!("{}", kind("30"));
    println!("{}", kind("12"));
    println!("{}", kind("abc"));
}`,
    solution: `fn kind(s: &str) -> String {
    let Ok(age) = s.parse::<u32>() else {
        return String::from("invalid");
    };
    if age >= 18 {
        String::from("adult")
    } else {
        String::from("minor")
    }
}

fn main() {
    println!("{}", kind("30"));
    println!("{}", kind("12"));
    println!("{}", kind("abc"));
}`,
    require: [{ pattern: 'let\\s+Ok\\s*\\([^)]*\\)\\s*=[^;]*else\\s*\\{', message: 'Use let Ok(..) = ... else { ... };' }],
    tests: [{ name: 'Prints adult, minor, invalid', expected: 'adult\nminor\ninvalid' }],
  },

  {
    id: 'r3-at-binding',
    title: 'Naming a matched range with @',
    kind: 'concept',
    introduces: ['at-binding'],
    teach: {
      body: [
        `<p>A <code>match</code> arm with a range, like <code>1..=9</code>, tests the value but throws it away: you cannot refer to the number inside the arm. If you need it, bind a name to the value and test it in one step with <code>@</code>: <code>small @ 1..=9</code> means "match if the value is in this range, and call the value <code>small</code>". You can use the name on the right of <code>=&gt;</code>.</p>`,
        `<p>This also gives a way to write the catch-all arm that keeps the value. A bare name as the last arm, such as <code>other =&gt; ...</code>, matches everything and names it, where <code>_</code> matches everything and throws it away. Use <code>_</code> when you do not need the value, and a name when you do. Remember that arms are tried top to bottom, so such a catch-all must come last.</p>`,
      ],
      examples: [
        {
          code: `fn classify(n: u32) -> String {
    match n {
        0 => String::from("zero"),
        small @ 1..=9 => format!("small {}", small),      // keep the value
        mid @ 10..=99 => format!("medium {}", mid),
        other => format!("huge {}", other),               // a name catches the rest
    }
}

fn main() {
    println!("{}", classify(0));
    println!("{}", classify(7));
    println!("{}", classify(42));
    println!("{}", classify(500));
}`,
          output: 'zero\nsmall 7\nmedium 42\nhuge 500',
        },
      ],
      terms: [
        { code: 'name @ 1..=9', meaning: 'matches if the value is in the range, and names the value' },
        { code: 'other =>', meaning: 'a catch-all arm that keeps the value (the _ arm throws it away)' },
      ],
    },
    task: 'Write <code>grade(score: u32) -&gt; String</code> with one <code>match</code> and <code>@</code>: <code>fail N</code> for under 50, <code>pass N</code> for 50 to 89, <code>top N</code> for 90 to 100, and <code>invalid</code> above 100 (<code>N</code> is the score).',
    compare: {
      cpp: { code: `std::string classify(unsigned n) {
    if (n == 0) return "zero";
    else if (n >= 1 && n <= 9) return "small " + std::to_string(n);
    return "other";
}`, outcome: 'Range test, then use n separately', ok: true },
      rust: { code: `let n: u32 = 7;
let s = match n {
    small @ 1..=9 => format!("small {}", small),
    _ => String::from("other"),
};`, outcome: 'Test and bind in one pattern', ok: true },
      text: 'In C++ you test a range with <code>&amp;&amp;</code> and then use the variable you already had. <code>@</code> tests the range and gives the value a name for the arm in a single pattern.',
    },
    refresher: [
      '<code>x @ 1..=9</code> matches a range and keeps the value as <code>x</code>; a final bare name catches the rest.',
    ],
    hints: [
      'Match <code>score</code> with arms like <code>low @ 0..=49</code>.',
      'Build the text with <code>format!("fail {}", low)</code>.',
      'The last arm can be <code>_ =&gt; String::from("invalid")</code>.',
    ],
    inCpp: {
      code: `void f(int n) {
    switch (n) {
        case 1 ... 9: /* GNU extension: a range of cases */ break;
    }
}`,
      note: 'Standard C++ <code>switch</code> has no case ranges, only a GNU extension. Rust ranges in patterns are standard, and <code>@</code> keeps the value.',
    },
    starter: `fn grade(score: u32) -> String {
    String::new()
}

fn main() {
    println!("{}", grade(40));
    println!("{}", grade(70));
    println!("{}", grade(95));
    println!("{}", grade(120));
}`,
    solution: `fn grade(score: u32) -> String {
    match score {
        low @ 0..=49 => format!("fail {}", low),
        mid @ 50..=89 => format!("pass {}", mid),
        high @ 90..=100 => format!("top {}", high),
        _ => String::from("invalid"),
    }
}

fn main() {
    println!("{}", grade(40));
    println!("{}", grade(70));
    println!("{}", grade(95));
    println!("{}", grade(120));
}`,
    require: [{ pattern: '\\w+\\s*@\\s*\\d', message: 'Use name @ range patterns.' }],
    tests: [{ name: 'Prints the four grades', expected: 'fail 40\npass 70\ntop 95\ninvalid' }],
  },

  // ------------------------------------------------------------------------------------------
  // 26. usize pitfalls and conversions
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-usize-underflow',
    title: 'usize minus too much',
    kind: 'concept',
    introduces: ['num-methods'],
    teach: {
      body: [
        `<p>Lengths and indices are <code>usize</code>, an <em>unsigned</em> number: it cannot be negative. So <code>v.len() - 1</code> on an empty vector is "0 minus 1", which does not exist. In a debug build Rust panics with "attempt to subtract with overflow"; in a release build it wraps around to a huge number. C++ has the same trap and fewer guards: <code>v.size() - 1</code> silently becomes about 18 quintillion, and a loop <code>for (size_t i = 0; i &lt; v.size() - 1; i++)</code> then runs off the end of an empty vector.</p>`,
        `<p>You met the tools in stage 1: <code>checked_sub</code>, <code>saturating_sub</code>, <code>wrapping_sub</code>. Used on lengths, the useful ones are these. <code>a.saturating_sub(b)</code> stops at 0 instead of going below it. <code>a.checked_sub(b)</code> returns an <code>Option</code>, <code>None</code> if the result would be negative, which is how you say "the last index, if there is one": <code>v.len().checked_sub(1)</code>. A third habit is to compare first, <code>if a &gt;= b { a - b }</code>, and a fourth is to ask for the distance directly with <code>a.abs_diff(b)</code>, which is the larger minus the smaller and cannot underflow.</p>`,
        `<p>Reaching for <code>as i32</code> to make the subtraction signed works but hides the problem; the methods above keep the intent visible. The other usual victim is counting down: <code>for i in (0..n).rev()</code>, which you saw with iterators, avoids <code>i - 1</code> altogether.</p>`,
      ],
      examples: [
        {
          code: `fn last_index(v: &[i32]) -> Option<usize> {
    v.len().checked_sub(1)             // None for an empty slice
}

fn main() {
    println!("{:?}", last_index(&[7, 8]));
    println!("{:?}", last_index(&[]));
    let a: usize = 3;
    let b: usize = 5;
    println!("{}", a.saturating_sub(b));     // 0, not -2
    println!("{}", a.abs_diff(b));           // 2: distance, no underflow
}`,
          output: 'Some(1)\nNone\n0\n2',
        },
      ],
      terms: [
        { code: 'a.checked_sub(b)', meaning: 'Some(a - b), or None if it would go below zero' },
        { code: 'a.saturating_sub(b)', meaning: 'a - b, but stops at 0' },
        { code: 'a.abs_diff(b)', meaning: 'the distance between a and b, always non-negative' },
      ],
    },
    task: '<code>gaps</code> should count the gaps between neighbouring elements: <code>len - 1</code>, but <code>0</code> for an empty slice. It panics on an empty slice now. Fix it so the program prints <code>2</code>, <code>0</code>, <code>0</code>.',
    compare: {
      cpp: { code: `void f(const std::vector<int>& v) {
    size_t gaps = v.size() - 1;   // 18446744073709551615 if v is empty: wraps silently
    for (size_t i = 0; i < gaps; i++) { /* runs off the end */ }
}`, outcome: 'Wraps to a huge number', ok: true },
      rust: { code: `let v: Vec<i32> = Vec::new();
let gaps = v.len() - 1;`, outcome: 'Debug: panics "subtract with overflow"', ok: true },
      text: 'Both languages have unsigned lengths. C++ wraps silently, Rust panics in debug builds, and in either one the fix is the same: never subtract without checking.',
    },
    refresher: [
      '<code>usize</code> cannot go below 0: use <code>saturating_sub</code>, <code>checked_sub</code> (an <code>Option</code>), a comparison first, or <code>abs_diff</code>.',
    ],
    hints: [
      'The panic comes from <code>v.len() - 1</code> when the length is 0.',
      '<code>v.len().saturating_sub(1)</code> gives 0 instead of underflowing.',
    ],
    inCpp: {
      code: `void f(const std::vector<int>& v) {
    for (size_t i = v.size(); i-- > 0; ) std::cout << v[i];   // the idiom that avoids i - 1
}`,
      note: 'C++ programmers work around unsigned subtraction with tricks like <code>i-- &gt; 0</code>. Rust gives the operation a name that says what happens at zero.',
    },
    starter: `fn gaps(v: &[i32]) -> usize {
    v.len() - 1
}

fn main() {
    println!("{}", gaps(&[1, 2, 3]));
    println!("{}", gaps(&[9]));
    println!("{}", gaps(&[]));
}`,
    solution: `fn gaps(v: &[i32]) -> usize {
    v.len().saturating_sub(1)
}

fn main() {
    println!("{}", gaps(&[1, 2, 3]));
    println!("{}", gaps(&[9]));
    println!("{}", gaps(&[]));
}`,
    require: [{ pattern: 'saturating_sub|checked_sub|is_empty', message: 'Handle the empty slice without underflow.' }],
    tests: [{ name: 'Prints 2, 0, 0', expected: '2\n0\n0' }],
  },

  {
    id: 'r3-as-try-from',
    title: 'as truncates, try_from checks',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>In stage 1 you learned that <code>as</code> converts between number types. What you need to know now is how it behaves when the value does not fit: it <em>silently</em> keeps only the low bits. <code>300_i32 as u8</code> is <code>44</code>, and a negative <code>i32</code> as <code>u32</code> becomes a huge positive number. A float cast to an integer saturates at the limits (and NaN becomes 0). Those results are well defined but rarely what you meant, and like a C++ <code>static_cast</code> they raise no alarm.</p>`,
        `<p>When you want to know whether the value fits, use <code>try_from</code>: <code>u8::try_from(big)</code> returns a <code>Result</code>. It is <code>Ok(value)</code> if the number is in range and <code>Err</code> if it is not. Its twin is <code>try_into()</code>, which needs the target type given by an annotation, <code>let r: Result&lt;u8, _&gt; = big.try_into();</code>. The error is a <code>TryFromIntError</code> that you can turn into <code>None</code> with <code>.ok()</code>, handle with <code>match</code>, or pass up with <code>?</code>.</p>`,
        `<p>Rule of thumb: use <code>as</code> when you want the wrapping or know the value fits (widening, like <code>u8</code> to <code>u32</code> or <code>i32</code> to <code>i64</code>, is always safe). Use <code>try_from</code> when the value comes from outside and might not fit. Note that safe widening conversions also have plain <code>From</code>: <code>i64::from(x)</code> for an <code>i32</code> compiles only because it can never fail.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let big: i32 = 300;
    println!("{}", big as u8);                 // 44: keeps only the low 8 bits
    println!("{}", u8::try_from(big).is_err()); // true: 300 does not fit
    let small: i32 = 200;
    println!("{:?}", u8::try_from(small));     // Ok(200)

    let n: usize = 7;
    let m: i32 = i32::try_from(n).unwrap();    // usize to i32, checked
    println!("{}", m);

    let r: Result<u8, _> = big.try_into();     // the annotation names the target type
    println!("{}", r.is_err());
    println!("{}", i64::from(m));              // widening cannot fail: plain From
}`,
          output: '44\ntrue\nOk(200)\n7\ntrue\n7',
        },
      ],
      terms: [
        { code: 'x as u8', meaning: 'converts, silently keeping only the low bits if too big' },
        { code: 'u8::try_from(x)', meaning: 'a Result: Ok(value) if it fits, Err if it does not' },
        { code: 'x.try_into()', meaning: 'the same, target type taken from an annotation' },
        { code: 'i64::from(x)', meaning: 'a conversion that can never fail (widening)' },
      ],
    },
    task: 'Write <code>to_byte(x: i32) -&gt; Option&lt;u8&gt;</code>: <code>Some</code> of the value if it fits in a <code>u8</code>, otherwise <code>None</code>. Do not use <code>as</code>.',
    compare: {
      cpp: { code: `void f(int big) {
    uint8_t a = static_cast<uint8_t>(big);   // 44, no warning
    uint8_t b = big;                         // also 44 (maybe a warning)
}`, outcome: 'Truncates silently', ok: true },
      rust: { code: `let big: i32 = 300;
let a = big as u8;
let b = u8::try_from(big);`, outcome: 'as truncates; try_from reports', ok: true },
      text: 'Rust <code>as</code> behaves like a C++ cast: it truncates without complaint. <code>try_from</code> is the checked version that C++ has no standard spelling for.',
    },
    refresher: [
      '<code>as</code> truncates silently; <code>T::try_from(x)</code> returns a <code>Result</code>, and <code>.ok()</code> turns it into an <code>Option</code>.',
    ],
    hints: [
      'Call <code>u8::try_from(x)</code>.',
      'A <code>Result</code> becomes an <code>Option</code> with <code>.ok()</code>.',
    ],
    inCpp: {
      code: `bool fits(int big) {
    return std::in_range<uint8_t>(big);   // C++20 check, then cast
}`,
      note: 'C++20 <code>std::in_range</code> tests whether a value fits. Rust folds the test and the conversion into one call.',
    },
    cppStd: 20,
    starter: `fn to_byte(x: i32) -> Option<u8> {
    None
}

fn main() {
    println!("{:?}", to_byte(200));
    println!("{:?}", to_byte(300));
    println!("{:?}", to_byte(-1));
    println!("{:?}", to_byte(0));
}`,
    solution: `fn to_byte(x: i32) -> Option<u8> {
    u8::try_from(x).ok()
}

fn main() {
    println!("{:?}", to_byte(200));
    println!("{:?}", to_byte(300));
    println!("{:?}", to_byte(-1));
    println!("{:?}", to_byte(0));
}`,
    require: [{ pattern: 'try_from|try_into', message: 'Use try_from or try_into.' }],
    forbidden: [{ pattern: '\\bas\\s+u8', message: 'Do not use as here; it truncates.' }],
    tests: [{ name: 'Prints Some(200), None, None, Some(0)', expected: 'Some(200)\nNone\nNone\nSome(0)' }],
  },

  // ------------------------------------------------------------------------------------------
  // 27. modules, visibility and tests
  // ------------------------------------------------------------------------------------------
  {
    id: 'r3-visibility',
    title: 'pub and private by default',
    kind: 'concept',
    introduces: ['mod', 'pub'],
    teach: {
      body: [
        `<p>So far every item sat at the top of one file. Bigger programs are split into <em>modules</em>: named groups of items. You write <code>mod bank { ... }</code> and put structs, functions and impls inside. Code outside reaches something inside with a path: <code>bank::Account</code>, using the same <code>::</code> you have used for <code>String::from</code>. A <code>use</code> line, such as <code>use bank::Account;</code>, lets you write the short name.</p>`,
        `<p>Everything is <em>private</em> by default: an item inside a module can only be used by code in that module (and its children). To let outside code use it, write <code>pub</code> in front: <code>pub struct</code>, <code>pub fn</code>. The rule is applied item by item, and also to fields: <code>pub struct Account { balance: i64 }</code> makes the type visible but keeps <code>balance</code> private, so outside code cannot read it or build the struct directly. You expose what you want with <code>pub</code> methods, like a getter. Reaching a private field from outside is error E0616.</p>`,
        `<p>This is the opposite default from a C++ <code>struct</code> (public) and the same as a <code>class</code> (private). A key difference: privacy in Rust is per <em>module</em>, not per type. Code anywhere in the same module may see a struct's private fields. In a one-file program everything is in the top-level module, so you only notice privacy once you write a <code>mod</code>.</p>`,
      ],
      examples: [
        {
          code: `mod bank {
    pub struct Account {          // the type is public...
        balance: i64,             // ...but this field is private
    }

    impl Account {
        pub fn new() -> Account {
            Account { balance: 0 }
        }
        pub fn deposit(&mut self, n: i64) {
            self.balance += n;
        }
        pub fn balance(&self) -> i64 {    // a public getter
            self.balance
        }
    }
}

use bank::Account;

fn main() {
    let mut a = Account::new();
    a.deposit(50);
    println!("{}", a.balance());
}`,
          output: '50',
        },
      ],
      terms: [
        { code: 'mod name { ... }', meaning: 'a named group of items' },
        { code: 'name::item', meaning: 'a path into a module' },
        { code: 'pub', meaning: 'makes an item or field visible outside its module' },
        { code: 'use path::Name;', meaning: 'lets you write Name instead of the long path' },
      ],
    },
    task: '<code>main</code> cannot read the private field <code>balance</code>. Keep the field private: add a public method <code>balance</code> and call it.',
    compare: {
      cpp: { code: `class Account {
    int balance = 0;
public:
    void deposit(int n) { balance += n; }
};`, outcome: 'public: and private: sections', ok: true },
      rust: { code: `mod bank {
    pub struct Account { balance: i64 }
    impl Account {
        pub fn new() -> Account { Account { balance: 0 } }
    }
}
let a = bank::Account::new();
println!("{}", a.balance);`, outcome: 'Error: field balance is private', ok: false, errorCode: 'E0616' },
      text: 'Everything is private unless marked <code>pub</code>, one item or field at a time. Privacy is per module, not per type: code in the same module can see private fields.',
    },
    refresher: [
      '<code>mod name { ... }</code> groups items; outside it, use a path like <code>bank::Account</code>.',
      '<code>pub struct</code> makes the type visible, but its fields stay private unless each is marked <code>pub</code>.',
    ],
    hints: [
      'Add the method inside the <code>impl</code> block, marked <code>pub</code>.',
      'It takes <code>&amp;self</code> and returns the field.',
      'In <code>main</code>, field access becomes a method call.',
    ],
    inCpp: {
      code: `struct A { int balance = 0; };   // public by default
class  B { int balance = 0; };   // private by default`,
      note: 'C++ has two defaults depending on <code>struct</code> or <code>class</code>, and the unit of privacy is the class. Rust has one rule, private unless <code>pub</code>, and the unit is the module.',
    },
    starter: `mod bank {
    pub struct Account {
        balance: i64,
    }

    impl Account {
        pub fn new() -> Account {
            Account { balance: 0 }
        }

        pub fn deposit(&mut self, n: i64) {
            self.balance += n;
        }
    }
}

fn main() {
    let mut a = bank::Account::new();
    a.deposit(50);
    println!("{}", a.balance);
}`,
    solution: `mod bank {
    pub struct Account {
        balance: i64,
    }

    impl Account {
        pub fn new() -> Account {
            Account { balance: 0 }
        }

        pub fn deposit(&mut self, n: i64) {
            self.balance += n;
        }

        pub fn balance(&self) -> i64 {
            self.balance
        }
    }
}

fn main() {
    let mut a = bank::Account::new();
    a.deposit(50);
    println!("{}", a.balance());
}`,
    require: [{ pattern: 'a\\.deposit\\(50\\)', message: 'Keep depositing 50' }],
    forbidden: [{ pattern: 'pub\\s+balance', message: 'Keep the field private.' }],
    tests: [{ name: 'Prints 50', expected: '50' }],
  },

  {
    id: 'r3-tests-assert',
    title: 'Tests and assert_eq!',
    kind: 'concept',
    introduces: ['assert-macro', 'test-attr'],
    teach: {
      body: [
        `<p>Rust has testing built into the language. The simplest tool is the <code>assert!</code> macro family. <code>assert!(cond)</code> panics if <code>cond</code> is false. <code>assert_eq!(a, b)</code> panics if <code>a != b</code> and prints both values, which is far more useful than a bare "assertion failed". <code>assert_ne!(a, b)</code> checks that they differ. You can add a message after the values, written like <code>println!</code>. Both sides need <code>PartialEq</code>, and <code>Debug</code> so they can be printed.</p>`,
        `<p>A test is a plain function marked with the attribute <code>#[test]</code>. By convention tests live in a module at the bottom of the file, marked <code>#[cfg(test)]</code> ("compile this only when testing"). Inside it <code>use super::*;</code> brings in everything from the module above, where <code>super</code> means "the parent module" and <code>*</code> means "all of its items". The command <code>cargo test</code> then finds every <code>#[test]</code> function, runs each, and reports which passed. This is the role Catch2 or GoogleTest play for C++, built into the toolchain and the language.</p>`,
        `<p>This app only runs <code>main</code>, so the exercises put the asserts inside <code>main</code>. The macros are identical either way. Unlike C++ <code>assert</code>, which vanishes when <code>NDEBUG</code> is defined, <code>assert!</code> is always on (<code>debug_assert!</code> is the one that is removed from release builds).</p>`,
      ],
      examples: [
        {
          code: `fn is_even(n: i32) -> bool {
    n % 2 == 0
}

fn main() {
    assert!(is_even(4));                                // panics if false
    assert_eq!(is_even(7), false);                      // shows both values on failure
    assert_ne!(2 + 2, 5, "arithmetic broke");           // optional message
    println!("all passed");
}

#[cfg(test)]
mod tests {
    use super::*;                    // bring in is_even from the parent module

    #[test]
    fn evens() {
        assert_eq!(is_even(4), true);
    }
}`,
          output: 'all passed',
        },
      ],
      terms: [
        { code: 'assert!(cond)', meaning: 'panics if cond is false' },
        { code: 'assert_eq!(a, b)', meaning: 'panics, printing both, if a != b' },
        { code: '#[test]', meaning: 'marks a test function that cargo test will run' },
        { code: '#[cfg(test)] mod tests { use super::*; }', meaning: 'a module compiled only for tests, seeing the code above it' },
      ],
    },
    task: 'Read the asserts in <code>main</code>: one fails, so the program panics. Fix <code>is_even</code> so they all pass and it prints <code>all passed</code>.',
    compare: {
      cpp: { code: `#include <cassert>
bool is_even(int n) { return n % 2 == 0; }

int main() {
    assert(is_even(4));
    assert(!is_even(7));
}`, outcome: 'assert disappears under -DNDEBUG', ok: true },
      rust: { code: `fn is_even(n: i32) -> bool { n % 2 == 0 }

fn main() {
    assert_eq!(is_even(4), true);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn evens() {
        assert_eq!(is_even(4), true);
    }
}`, outcome: 'cargo test runs evens; main runs the assert', ok: true },
      text: '<code>assert_eq!(a, b)</code> panics with both values when they differ. <code>cargo test</code> runs every <code>#[test]</code> function; this app runs only <code>main</code>, so here the asserts sit in <code>main</code>.',
    },
    refresher: [
      '<code>assert!</code> and <code>assert_eq!</code> panic on failure and are always on; <code>#[test]</code> functions in <code>#[cfg(test)] mod tests</code> are run by <code>cargo test</code>.',
    ],
    hints: [
      'Which assert fails? The panic message names the line.',
      'Check what <code>is_even</code> compares the remainder with.',
    ],
    inCpp: {
      code: `bool is_even(int n) {
    return n % 2 == 0;
}
// compiled out when NDEBUG is defined:
// assert(is_even(4));`,
      note: 'C++ <code>assert</code> vanishes under <code>NDEBUG</code> and has no test runner. Rust\'s <code>assert!(..)</code> always runs, and <code>cargo test</code> collects <code>#[test]</code> functions.',
    },
    starter: `fn is_even(n: i32) -> bool {
    n % 2 == 1
}

fn main() {
    assert!(is_even(4));
    assert!(!is_even(7));
    assert_eq!(is_even(0), true);
    println!("all passed");
}`,
    solution: `fn is_even(n: i32) -> bool {
    n % 2 == 0
}

fn main() {
    assert!(is_even(4));
    assert!(!is_even(7));
    assert_eq!(is_even(0), true);
    println!("all passed");
}`,
    require: [
      { pattern: 'assert!\\(\\s*is_even\\(4\\)\\s*\\)', message: 'Keep the asserts in main' },
      { pattern: 'assert_eq!\\(\\s*is_even\\(0\\)', message: 'Keep the asserts in main' },
    ],
    tests: [{ name: 'Prints all passed', expected: 'all passed' }],
  },
]
