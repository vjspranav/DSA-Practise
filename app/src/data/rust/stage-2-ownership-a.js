// Rust lessons: stage 2 part A, ownership and borrowing from zero (owners, moves, clones, drop, borrowing).
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end) and docs/superpowers/specs/rust-lesson-examples.js.
// Check with: node scripts/verify-rust.mjs --stage 2
// Ids must start with r2- and be unique across the track. Every piece of syntax a lesson uses must be introduced
// (`introduces`, ids from src/rust/syntax.js) by that lesson or an earlier one; the checker enforces it.
// Stage 1 did not teach: references, .clone(), slices, Option, structs, impl, closures or iterators.

export const LESSONS = [
  // 1. Owners and scope
  {
    id: 'r2-owners',
    title: 'Who owns it?',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>In C++ you decide who frees memory: a destructor, <code>delete</code>, or a smart pointer like <code>unique_ptr</code>. Rust asks the same question, but answers it with a few rules that the compiler checks for you. The idea at the centre is <em>ownership</em>. Every value has exactly one <em>owner</em>, which is a variable. When the owner goes out of scope, the value is cleaned up. The compiler adds that cleanup for you; you never write <code>free</code>, and there is no garbage collector running behind your back.</p>`,
        `<p>A <em>scope</em> is the region between a pair of curly braces <code>{ }</code>. A variable lives from its <code>let</code> to the closing brace of the block it was made in. When that brace is reached the variable is gone, and Rust <em>drops</em> its value, which means it runs the cleanup (for a <code>String</code>, freeing its characters). This is exactly what C++ does with a local <code>std::string</code>, whose destructor runs at the closing brace. The pattern is called RAII, and in Rust it is not an option you opt into: every type works this way.</p>`,
        `<p>A <code>String</code> is a small handle stored in the variable (where the text is, how long it is) plus the characters themselves, which sit elsewhere in memory, on the <em>heap</em>. A number like <code>5</code> sits entirely inside its variable. "Owner" means: this handle is responsible for freeing those characters.</p>`,
        `<p>These are the rules, and the whole stage is about what follows from them. One: each value has an owner. Two: there is only one owner at a time. Three: when the owner goes out of scope, the value is dropped. They sound small, but they are the reason a Rust program cannot free something twice, use something after it was freed, or leak it by forgetting a <code>delete</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let outer = String::from("outer");   // outer owns this text
    {
        let inner = String::from("inner"); // inner owns this text
        println!("{} and {}", outer, inner);
    } // inner goes out of scope here, so its text is dropped
    println!("{}", outer);                 // outer is still alive
}`,
          output: 'outer and inner\nouter',
          caption: 'A bare pair of braces makes a scope. Each variable is dropped at its own closing brace.',
        },
      ],
      terms: [
        { code: 'owner', meaning: 'the one variable responsible for a value; there is only ever one' },
        { code: 'scope', meaning: 'the code between { and }; variables made inside end at the closing brace' },
        { code: 'drop', meaning: 'cleaning a value up (freeing its memory) when its owner goes out of scope' },
      ],
    },
    task: 'This does not compile: <code>inner</code> is used after the braces that contain it. Move the line so the program prints <code>inner</code> and then <code>outer</code>.',
    compare: {
      cpp: { code: `{
    std::string inner = "inner";
    std::cout << inner;
}   // the destructor runs here`, outcome: 'Freed at the closing brace', ok: true },
      rust: { code: `{
    let inner = String::from("inner");
    println!("{}", inner);
}   // dropped here`, outcome: 'Dropped at the closing brace', ok: true },
      text: 'The cleanup timing is the same as a C++ destructor. What is new is that every type works this way, and that the compiler also tracks which variable is the one owner.',
    },
    refresher: [
      'Each value has one owner. When the owner leaves its scope (the closing brace), the value is dropped.',
      'A variable cannot be used outside the braces it was created in.',
    ],
    hints: [
      'The error says <code>inner</code> cannot be found. Where does <code>inner</code> exist?',
      'Print it before the closing brace of its block.',
    ],
    inCpp: {
      code: `std::string* p = new std::string("x");
// forget delete: a leak
// delete it twice: undefined behaviour`,
      note: 'Raw <code>new</code> and <code>delete</code> let you leak or double free. With one owner and an automatic drop, Rust has neither problem.',
    },
    starter: `fn main() {
    let outer = String::from("outer");
    {
        let inner = String::from("inner");
    }
    println!("{}", inner);
    println!("{}", outer);
}`,
    solution: `fn main() {
    let outer = String::from("outer");
    {
        let inner = String::from("inner");
        println!("{}", inner);
    }
    println!("{}", outer);
}`,
    require: [{ pattern: 'let\\s+inner\\s*=', message: 'Keep inner declared inside the braces' }],
    tests: [{ name: 'Prints inner then outer', expected: 'inner\nouter' }],
  },

  // 2. Assignment moves
  {
    id: 'r2-moves-not-copies',
    title: 'Assignment moves',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>What should <code>let b = a;</code> do when <code>a</code> is a <code>String</code>? In C++, <code>std::string b = a;</code> runs the copy constructor: a second buffer is allocated and every character is copied, so you now have two independent strings. That is safe but silent, and for a large container it can be expensive. Rust follows its second rule, <em>one owner at a time</em>, and does something else.</p>`,
        `<p>Rust <em>moves</em> the value. Ownership passes from <code>a</code> to <code>b</code>. Only the small handle is copied, not the characters, so a move is cheap. From then on <code>b</code> is the owner, and <code>a</code> is dead: trying to use it is a compile error that says "borrow of moved value". Because the compiler knows <code>a</code> no longer owns anything, only <code>b</code> is dropped at the end of its scope, so the text is freed exactly once.</p>`,
        `<p>You may know <code>std::move</code> from C++. After <code>std::string b = std::move(a);</code> the variable <code>a</code> is still a valid object in an unspecified state (usually empty), and the compiler lets you read it, which hides bugs. In Rust a moved-from variable cannot be used at all, until it is given a new value. There is no "valid but unspecified" leftover to forget about.</p>`,
        `<p>Moves are not only for <code>String</code>. A <code>Vec</code> moves too, and so does anything else that owns something on the heap.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = String::from("hi");
    let b = a;                 // the String moves from a to b
    println!("{}", b);         // fine: b is the owner now
    // println!("{}", a);      // would not compile: a was moved
}`,
          output: 'hi',
        },
        {
          code: `fn main() {
    let v = vec![1, 2, 3];
    let w = v;                 // a Vec moves as well
    println!("{:?}", w);
}`,
          output: '[1, 2, 3]',
          caption: 'Only the handle moves; the three numbers stay where they are.',
        },
      ],
      terms: [
        { code: 'let b = a;', meaning: 'for a String or Vec, moves ownership to b; a can no longer be used' },
        { code: 'moved value', meaning: 'a variable whose owner changed; the compiler rejects any later use' },
      ],
    },
    task: 'The String moved from <code>a</code> into <code>b</code>, so <code>a</code> is dead. Change the last line so the program prints <code>hi</code>.',
    compare: {
      cpp: { code: `std::string a = "hi";
std::string b = a;   // copy: two buffers
std::cout << a << b;`, outcome: 'Both usable: two buffers', ok: true },
      rust: { code: `let a = String::from("hi");
let b = a;   // move
println!("{} {}", a, b);`, outcome: 'Error: a was moved', ok: false, errorCode: 'E0382' },
      text: 'C++ copies by default and Rust moves by default. Every buffer is freed exactly once, and no copy happens unless you ask for one.',
    },
    refresher: [
      '<code>let b = a;</code> on a <code>String</code> or <code>Vec</code> moves it. <code>a</code> cannot be used afterwards.',
      'Only the new owner is dropped at the end of its scope.',
    ],
    hints: [
      '<code>b</code> took ownership of the String. Who can still use it?',
      'Change the variable named in the last <code>println!</code>.',
    ],
    inCpp: {
      code: `std::string a = "hi";
std::string c = std::move(a);
// a is valid but unspecified:
// usually empty, still compiles`,
      note: 'After <code>std::move</code>, C++ lets you keep using <code>a</code> and you must remember what state it is in. Rust makes the moved-from variable unusable.',
    },
    starter: `fn main() {
    let a = String::from("hi");
    let b = a;
    println!("{}", a);
}`,
    solution: `fn main() {
    let a = String::from("hi");
    let b = a;
    println!("{}", b);
}`,
    require: [{ pattern: 'let\\s+b\\s*=\\s*a\\s*;', message: 'Keep the move: let b = a;' }],
    tests: [{ name: 'Prints hi', expected: 'hi' }],
  },

  // 3. Copy types
  {
    id: 'r2-copy-types',
    title: 'Copy types',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>If every assignment moved, <code>let b = a;</code> with numbers would kill <code>a</code> too, and that would be silly. A number lives entirely inside its variable, so duplicating it costs nothing and shares nothing. For types like that, Rust <em>copies</em> instead of moving, and both variables stay usable. Such a type is called a <code>Copy</code> type.</p>`,
        `<p>The <code>Copy</code> types you have already met are all the integer types, <code>f64</code>, <code>bool</code> and <code>char</code>. A tuple or an array is <code>Copy</code> when everything inside it is. A string literal of type <code>&amp;str</code> is also <code>Copy</code>: it is only a read-only view of text that lives in the program, so duplicating the view duplicates nothing important.</p>`,
        `<p>The rule of thumb: a type that owns something on the heap, such as <code>String</code> or <code>Vec</code>, moves. A type that is just plain data copies. You do not choose per assignment; the type decides. The word "Copy" is a <em>trait</em>, a capability a type can have. Traits get a full lesson in stage 3, so for now just read "Copy" as "assignment duplicates it".</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = 7;
    let b = a;                // an integer is Copy: b gets its own 7
    println!("{} {}", a, b);  // both are usable
}`,
          output: '7 7',
        },
        {
          code: `fn main() {
    let pair = (3, 4);        // a tuple of integers is Copy
    let other = pair;
    let word = "hi";          // a &str is Copy too
    let again = word;
    println!("{:?} {:?} {} {}", pair, other, word, again);
}`,
          output: '(3, 4) (3, 4) hi hi',
        },
      ],
      terms: [
        { code: 'Copy type', meaning: 'a plain-data type; assignment copies it and the original stays usable' },
        { code: 'integers, f64, bool, char, &str', meaning: 'Copy; tuples and arrays of Copy types are Copy' },
        { code: 'String, Vec', meaning: 'not Copy: they move' },
      ],
    },
    task: 'Make <code>b</code> a copy of <code>a</code> (it is already written) and print both on one line: <code>7 7</code>.',
    compare: {
      cpp: { code: `int a = 7;
int b = a;   // copy
std::cout << a << " " << b;`, outcome: 'Prints 7 7', ok: true },
      rust: { code: `let a = 7;
let b = a;   // Copy: both usable
println!("{} {}", a, b);`, outcome: 'Prints 7 7', ok: true },
      text: 'Plain data copies in both languages. The difference is for types with a destructor: C++ copies them unless you write <code>std::move</code>, and Rust moves them unless they are <code>Copy</code>.',
    },
    refresher: [
      'Integers, <code>f64</code>, <code>bool</code>, <code>char</code> and <code>&amp;str</code> are <code>Copy</code>: <code>let b = a;</code> leaves <code>a</code> usable.',
      '<code>String</code> and <code>Vec</code> own heap data, so they move.',
    ],
    hints: [
      'Both variables are still alive after the copy. Print them in one <code>println!</code>.',
      'Two <code>{}</code> placeholders, then <code>a</code> and <code>b</code>.',
    ],
    starter: `fn main() {
    let a = 7;
    let b = a;
    // print a and b on one line
}`,
    solution: `fn main() {
    let a = 7;
    let b = a;
    println!("{} {}", a, b);
}`,
    require: [{ pattern: '\\{\\}[^{]*\\{\\}', message: 'Use two {} placeholders' }],
    tests: [{ name: 'Prints 7 7', expected: '7 7' }],
  },

  // 4. clone
  {
    id: 'r2-clone-is-explicit',
    title: 'Clone is explicit',
    kind: 'concept',
    introduces: ['clone'],
    teach: {
      body: [
        `<p>Sometimes you really do want two independent copies of a <code>String</code>. Ask for it by name with the <code>.clone()</code> method: <code>let b = a.clone();</code>. It allocates new memory and copies the characters, so <code>b</code> and <code>a</code> each own their own text. Afterwards both are usable and changing one does not change the other.</p>`,
        `<p>This is exactly what the C++ copy constructor does, with one difference: in C++ it happens silently on every <code>=</code>, argument pass and return. In Rust the expensive operation has a name you can see and search for. When you read a Rust program, each <code>.clone()</code> marks a place where memory is allocated and bytes are copied.</p>`,
        `<p>A warning for the lessons ahead: <code>.clone()</code> makes the compiler's error go away, but it is not always the right fix. Very often the better answer is to <em>borrow</em> the value instead of copying it, and the next lessons show how. Reach for <code>.clone()</code> when you truly need two owners.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = String::from("hi");
    let mut b = a.clone();   // a new String with its own copy of the text
    b.push('!');             // changing b does not touch a
    println!("{} {}", a, b);
}`,
          output: 'hi hi!',
        },
      ],
      terms: [
        { code: 'a.clone()', meaning: 'makes a full independent copy; the original stays usable' },
      ],
    },
    task: 'This does not compile because <code>a</code> moved into <code>b</code>. Keep both prints and make it print <code>hi hi</code>.',
    compare: {
      cpp: { code: `std::string a = "hi";
std::string b = a;   // implicit deep copy`, outcome: 'Copies silently', ok: true },
      rust: { code: `let a = String::from("hi");
let b = a.clone();   // explicit deep copy`, outcome: 'Copies, and says so', ok: true },
      text: 'Rust has no implicit deep copies: you write <code>.clone()</code> when you want one. That makes allocation and copying visible in the code.',
    },
    refresher: [
      '<code>a.clone()</code> makes an independent deep copy, like the C++ copy constructor.',
      'After a clone both variables own their own data and are usable.',
    ],
    hints: [
      'Which variable needs its own copy of the text?',
      'Ask for the copy on the right of the <code>=</code>.',
    ],
    inCpp: {
      code: `void take(std::string s);
void demo(std::string name) {
    take(name);   // the caller's string is copied; nothing shows it
}`,
      note: 'C++ can copy at any call or assignment without a visible sign. In Rust a deep copy is always spelled out.',
    },
    starter: `fn main() {
    let a = String::from("hi");
    let b = a;
    println!("{} {}", a, b);
}`,
    solution: `fn main() {
    let a = String::from("hi");
    let b = a.clone();
    println!("{} {}", a, b);
}`,
    require: [{ pattern: '\\.clone\\s*\\(', message: 'Use .clone()' }],
    tests: [{ name: 'Prints hi hi', expected: 'hi hi' }],
  },

  // 5. Passing to a function moves
  {
    id: 'r2-pass-and-return',
    title: 'Passing moves, returning gives back',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Calling a function with an argument works like assignment: the argument is moved into the parameter. In <code>fn shout(s: String)</code> the parameter <code>s</code> becomes the new owner. When the function ends, <code>s</code> goes out of scope and the String is dropped, unless the function hands it on. The caller's variable is dead after the call, just like <code>a</code> after <code>let b = a;</code>.</p>`,
        `<p>A function can give ownership back by returning the value. The value of the last expression moves out to whoever called the function, so <code>let b = add_bang(a);</code> sends <code>a</code> in and receives a String back in <code>b</code>. A parameter is a local variable, and like any variable it needs <code>mut</code> if the function wants to change it: <code>fn add_bang(mut s: String) -> String</code>. That <code>mut</code> belongs to the function's own variable and does not affect the caller.</p>`,
        `<p>In C++, passing a <code>std::string</code> by value silently copies it. Here nothing is copied; the String is handed over. The price is that sending a value in and back out just to look at it is clumsy. The next lessons fix that with borrowing.</p>`,
      ],
      examples: [
        {
          code: `fn shout(s: String) {          // s takes ownership of the String
    println!("{}!", s);
}                                   // s is dropped here

fn main() {
    let name = String::from("ada");
    shout(name);                    // name moves into the function
    // println!("{}", name);        // would not compile: name was moved
}`,
          output: 'ada!',
        },
        {
          code: `fn add_bang(mut s: String) -> String {   // mut: s may change; returns a String
    s.push('!');
    s                                      // no ;, so this is the result: ownership goes back out
}

fn main() {
    let a = String::from("hi");
    let b = add_bang(a);                   // a goes in, a new owner comes out
    println!("{}", b);
}`,
          output: 'hi!',
          caption: 'Ownership goes in with the argument and comes out with the return value.',
        },
      ],
      terms: [
        { code: 'fn f(s: String)', meaning: 'takes ownership of the argument; the caller\'s variable is moved' },
        { code: 'fn f(mut s: String)', meaning: 'the parameter variable may be changed inside the function' },
        { code: '-> String', meaning: 'returns a String, which moves ownership back to the caller' },
      ],
    },
    task: 'Finish <code>add_bang</code>: append <code>!</code> to <code>s</code> with <code>push</code> and give <code>s</code> back. The program should print <code>hi!</code>.',
    compare: {
      cpp: { code: `void consume(std::string s) {
    std::cout << s;
}
std::string name = "Ada";
consume(name);        // copy
std::cout << name;    // fine`, outcome: 'Copy: name still usable', ok: true },
      rust: { code: `fn consume(s: String) {
    println!("{}", s);
}
let name = String::from("Ada");
consume(name);        // move
println!("{}", name);`, outcome: 'Error: name was moved', ok: false, errorCode: 'E0382' },
      text: 'The same shape compiles in C++ because the argument is copied. In Rust the argument is moved, so the caller cannot use it afterwards.',
    },
    refresher: [
      'A parameter of type <code>String</code> takes ownership. The caller\'s variable is moved.',
      'Return the value (last expression, no <code>;</code>) to hand ownership back.',
    ],
    hints: [
      'Add the character with <code>s.push(\'!\');</code>. The parameter is already <code>mut</code>.',
      'The last line of the function should be just <code>s</code>, with no semicolon.',
    ],
    starter: `fn add_bang(mut s: String) -> String {
    // add a ! to the end of s, then give s back
}

fn main() {
    let a = String::from("hi");
    let b = add_bang(a);
    println!("{}", b);
}`,
    solution: `fn add_bang(mut s: String) -> String {
    s.push('!');
    s
}

fn main() {
    let a = String::from("hi");
    let b = add_bang(a);
    println!("{}", b);
}`,
    require: [{ pattern: '\\.push\\s*\\(', message: 'Use push' }],
    tests: [{ name: 'Prints hi!', expected: 'hi!' }],
  },

  // 6. predict moves
  {
    id: 'r2-what-will-the-compiler-say',
    title: 'What will the compiler say?',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      'A parameter of type <code>String</code> takes ownership: the caller\'s variable is moved.',
      'Plain types like <code>i32</code> are <code>Copy</code>: passing one leaves the original usable.',
    ],
    inCpp: {
      code: 'void consume(std::string s) {\n    std::cout << s << std::endl;\n}\n\nstd::string name = "Ada";\nconsume(name);        // copy\nstd::cout << name;    // fine',
      note: 'The same shape compiles in C++ because the argument is copied. In Rust the argument is moved.',
    },
    rounds: [
      {
        snippet: 'fn consume(s: String) {\n    println!("{}", s);\n}\n\nfn main() {\n    let name = String::from("Ada");\n    consume(name);\n    println!("{}", name);\n}',
        choices: ['Compiles and prints Ada twice', 'Error: borrow of moved value', 'Error: cannot borrow as mutable'],
        answer: 1,
        why: '<code>consume(name)</code> moved the String into the function, so <code>name</code> is gone on line 8.',
        errorCode: 'E0382',
        output: 'error[E0382]: borrow of moved value: `name`\n --> src/main.rs:8:20\n  |\n6 |     let name = String::from("Ada");\n  |         ---- move occurs because `name` has type `String`, which does not implement the `Copy` trait\n7 |     consume(name);\n  |             ---- value moved here\n8 |     println!("{}", name);\n  |                    ^^^^ value borrowed here after move\n  |\nnote: consider changing this parameter type in function `consume` to borrow instead if owning the value isn\'t necessary\n --> src/main.rs:1:15\n  |\n1 | fn consume(s: String) {\n  |    -------    ^^^^^^ this parameter takes ownership of the value\n  |    |\n  |    in this function\nhelp: consider cloning the value if the performance cost is acceptable\n  |\n7 |     consume(name.clone());\n  |                 ++++++++\n\nerror: aborting due to 1 previous error\n\nFor more information about this error, try `rustc --explain E0382`.',
      },
      {
        snippet: 'fn double(n: i32) -> i32 {\n    n * 2\n}\n\nfn main() {\n    let n = 21;\n    let d = double(n);\n    println!("{} {}", n, d);\n}',
        choices: ['Compiles and prints 21 42', 'Error: borrow of moved value', 'Error: mismatched types'],
        answer: 0,
        why: '<code>i32</code> is <code>Copy</code>, so <code>double(n)</code> passes a copy and <code>n</code> stays usable.',
        output: '21 42',
      },
    ],
  },

  // 7. fix: moved in loop
  {
    id: 'r2-fix-moved-in-loop',
    title: 'Moved in the previous iteration',
    kind: 'fix',
    introduces: [],
    task: 'This should print <code>go</code> twice but does not compile. Fix it without changing the loop.',
    errorCode: 'E0382',
    gloss: 'The first pass of the loop moves <code>s</code> into <code>show</code>, so the second pass has nothing left to pass.',
    refresher: [
      'A call that takes an owned <code>String</code> moves it, and a loop body runs again with the same variable.',
      'Give the call its own copy with <code>.clone()</code>. A later lesson shows how to lend instead.',
    ],
    hints: [
      'Read the compiler note: it names the call that moved the value.',
      'Each pass needs a String it can give away. Where does it get one?',
    ],
    inCpp: {
      code: 'void show(std::string s) {\n    std::cout << s << std::endl;\n}\n\nstd::string s = "go";\nfor (int i = 0; i < 2; i++) show(s);   // copies every pass',
      note: 'C++ silently copies the string on each pass. Rust stops you and makes you choose: copy on purpose, or borrow.',
    },
    starter: 'fn show(s: String) {\n    println!("{}", s);\n}\n\nfn main() {\n    let s = String::from("go");\n    for _ in 0..2 {\n        show(s);\n    }\n}',
    solution: 'fn show(s: String) {\n    println!("{}", s);\n}\n\nfn main() {\n    let s = String::from("go");\n    for _ in 0..2 {\n        show(s.clone());\n    }\n}',
    require: [
      { pattern: 'for\\s+_\\s+in\\s+0\\.\\.2', message: 'Keep the loop for _ in 0..2' },
      { pattern: 'show\\s*\\(', message: 'Keep calling show inside the loop' },
    ],
    tests: [{ name: 'Prints go twice', expected: 'go\ngo' }],
  },

  // 8. drop
  {
    id: 'r2-drop-at-scope-end',
    title: 'Dropping early',
    kind: 'concept',
    introduces: ['drop'],
    teach: {
      body: [
        `<p>Values are dropped when their owner goes out of scope, and several variables in one scope are dropped in reverse order of creation, the same order C++ destroys locals. Usually that is exactly right. Sometimes you are finished with something big long before the closing brace and want its memory back now.</p>`,
        `<p>For that, call <code>drop(x)</code>. It is a plain function from the standard library, and it does almost nothing: it takes its argument by value, so the value <em>moves in</em>, and then the function ends and drops it like any parameter. That is all <code>drop</code> is. It also means that after <code>drop(s)</code> the variable <code>s</code> is a moved value, so the compiler forbids any later use. A use after free is impossible to write.</p>`,
        `<p>A type can also run its own cleanup code when dropped, for example to close a file, by implementing a trait named <code>Drop</code>. It is the Rust version of a destructor. Traits come in stage 3, so for now you only need to know that the compiler calls it for you at the right moment.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let big = String::from("a long piece of text");
    println!("{}", big.len());   // use it
    drop(big);                   // done with it: free it now, not at the closing brace
    println!("big is gone");
}`,
          output: '20\nbig is gone',
        },
      ],
      terms: [
        { code: 'drop(x)', meaning: 'takes x by value and drops it right away; x cannot be used afterwards' },
        { code: 'Drop', meaning: 'the trait for custom cleanup code, like a C++ destructor (stage 3)' },
      ],
    },
    task: 'Print the length of <code>s</code>, then release it early with <code>drop</code>, then print <code>released</code>. Expected output: <code>9</code> and <code>released</code>.',
    compare: {
      cpp: { code: `std::string s = "temporary";
std::cout << s.size();
s = std::string();   // old buffer freed here
std::cout << "released";`, outcome: 'Memory freed early; s still usable', ok: true },
      rust: { code: `let s = String::from("temporary");
drop(s);
println!("{}", s);`, outcome: 'Error: s was moved by drop', ok: false, errorCode: 'E0382' },
      text: 'C++ can release a string early only by overwriting it, and the variable stays usable. In Rust <code>drop(s)</code> consumes the variable, so the compiler guarantees nobody touches it again.',
    },
    refresher: [
      '<code>drop(x)</code> moves <code>x</code> into a function that ends immediately, so <code>x</code> is freed at once.',
      'Locals are normally dropped at the closing brace, in reverse order of creation.',
    ],
    hints: [
      'Put <code>drop(s);</code> on its own line after the length is printed.',
      'Do not use <code>s</code> after the drop. The last line only prints a fixed word.',
    ],
    starter: `fn main() {
    let s = String::from("temporary");
    println!("{}", s.len());
    // release s here, then print "released"
}`,
    solution: `fn main() {
    let s = String::from("temporary");
    println!("{}", s.len());
    drop(s);
    println!("released");
}`,
    require: [{ pattern: 'drop\\s*\\(\\s*s\\s*\\)', message: 'Call drop(s)' }],
    tests: [{ name: 'Prints 9 and released', expected: '9\nreleased' }],
  },

  // 9. Shared borrow
  {
    id: 'r2-shared-borrow',
    title: 'Borrowing to read: &',
    kind: 'concept',
    introduces: ['reference'],
    teach: {
      body: [
        `<p>Moving a value in and out of every function is clumsy. Most of the time a function only wants to <em>look</em> at something. For that Rust lets you <em>borrow</em>: lend the value without giving up ownership. You write <code>&amp;name</code> (read "a reference to name"). The result is a <em>reference</em>, a value that points at the original. The owner stays the owner; the reference just borrows the use of it for a while.</p>`,
        `<p>The type of a reference to a <code>String</code> is written <code>&amp;String</code>. A function that wants to read a String takes <code>s: &amp;String</code>, and the caller passes <code>&amp;name</code>. When the function ends, nothing is dropped, because the function never owned the String. The caller can use <code>name</code> again immediately.</p>`,
        `<p>A plain <code>&amp;</code> reference is <em>read-only</em>: you can look at the value, call methods that only read (like <code>.len()</code>), and print it with <code>{}</code>, but you cannot change it. You can have as many <code>&amp;</code> references to one value as you like at the same time, since readers cannot disturb each other. A reference is like a C++ <code>const std::string&amp;</code> or a pointer to const, except that the compiler also guarantees it never points at something that has been freed.</p>`,
        `<p>You have seen this symbol before: stage 1 said a string literal has the type <code>&amp;str</code>, a borrowed view of text. The <code>&amp;</code> there means exactly this.</p>`,
      ],
      examples: [
        {
          code: `fn text_len(s: &String) -> usize {   // s is a reference to a String: it only borrows
    s.len()
}                                     // nothing is dropped: s never owned the text

fn main() {
    let name = String::from("Ada");
    let n = text_len(&name);          // & lends name to the function
    println!("{} has {} letters", name, n);   // name is still ours
}`,
          output: 'Ada has 3 letters',
        },
        {
          code: `fn main() {
    let name = String::from("Ada");
    let r1 = &name;                   // two readers at the same time are fine
    let r2 = &name;
    println!("{} {} {}", name, r1, r2);
}`,
          output: 'Ada Ada Ada',
          caption: 'Any number of shared references can exist together.',
        },
      ],
      terms: [
        { code: '&x', meaning: 'borrows x: a read-only reference; the owner keeps ownership' },
        { code: '&String', meaning: 'the type "reference to a String"' },
        { code: 'fn f(s: &String)', meaning: 'a function that borrows its argument; the caller passes &name' },
      ],
    },
    task: '<code>text_len</code> takes ownership of the String, so <code>name</code> cannot be printed afterwards. Make it borrow instead; the program should print <code>Ada 3</code>.',
    compare: {
      cpp: { code: `size_t text_len(const std::string& s) {
    return s.size();
}
std::string name = "Ada";
text_len(name);`, outcome: 'name still usable', ok: true },
      rust: { code: `fn text_len(s: &String) -> usize {
    s.len()
}
let name = String::from("Ada");
text_len(&name);`, outcome: 'name still usable', ok: true },
      text: 'A <code>&amp;String</code> parameter is the counterpart of <code>const std::string&amp;</code>, with the borrow written at the call site as <code>&amp;name</code> so you can see it.',
    },
    refresher: [
      '<code>&amp;x</code> lends <code>x</code> read-only. The type is <code>&amp;String</code> and the owner keeps ownership.',
      'Many <code>&amp;</code> references to one value can exist at once.',
    ],
    hints: [
      'Two places need a change: the parameter type and the call.',
      'The parameter becomes <code>&amp;String</code> and the call passes <code>&amp;name</code>.',
    ],
    inCpp: {
      code: `const std::string& longest_lived() {
    std::string tmp = "x";
    return tmp;   // compiles: a dangling reference
}`,
      note: 'C++ lets a reference outlive what it points to. In Rust that is a compile error, as a later lesson shows.',
    },
    starter: `fn text_len(s: String) -> usize {
    s.len()
}

fn main() {
    let name = String::from("Ada");
    let n = text_len(name);
    println!("{} {}", name, n);
}`,
    solution: `fn text_len(s: &String) -> usize {
    s.len()
}

fn main() {
    let name = String::from("Ada");
    let n = text_len(&name);
    println!("{} {}", name, n);
}`,
    require: [{ pattern: 'text_len\\s*\\(\\s*&\\s*name\\s*\\)', message: 'Call text_len(&name)' }],
    tests: [{ name: 'Prints Ada 3', expected: 'Ada 3' }],
  },

  // 10. Mutable borrow
  {
    id: 'r2-mutable-borrow',
    title: 'Borrowing to write: &mut',
    kind: 'concept',
    introduces: ['ref-mut', 'deref'],
    teach: {
      body: [
        `<p>A plain <code>&amp;</code> reference is read-only. To let a function change the caller's value in place, lend it with <code>&amp;mut</code>: a <em>mutable reference</em>. The call is <code>add_bang(&amp;mut s)</code> and the parameter type is <code>&amp;mut String</code>. Because writing needs permission, the variable itself must have been declared <code>let mut</code>. You cannot take <code>&amp;mut</code> of something that is read-only.</p>`,
        `<p>Through an <code>&amp;mut String</code> you can call methods like <code>push_str</code> directly; Rust follows the reference for you. For a plain number there are no methods to call, so you must reach through the reference yourself with <code>*</code>, called <em>dereferencing</em>. If <code>n</code> is an <code>&amp;mut i32</code>, then <code>*n</code> means "the number it points at", and <code>*n += 1;</code> adds one to the caller's variable. It is the same <code>*</code> as in C++ pointers.</p>`,
        `<p>The key rule: while a <code>&amp;mut</code> reference exists, it is the <em>only</em> way to touch the value. No other reference, read or write, can exist at the same time. The next lessons show why that matters. A C++ <code>T&amp;</code> parameter is mutable and unrestricted; Rust splits that into <code>&amp;</code> (look) and <code>&amp;mut</code> (change, exclusively).</p>`,
      ],
      examples: [
        {
          code: `fn add_bang(s: &mut String) {   // borrows the String and may change it
    s.push('!');                // method calls follow the reference automatically
}

fn main() {
    let mut word = String::from("hi");   // must be mut to lend it as &mut
    add_bang(&mut word);                 // lend it for writing
    add_bang(&mut word);
    println!("{}", word);
}`,
          output: 'hi!!',
        },
        {
          code: `fn bump(n: &mut i32) {
    *n += 1;                    // * follows the reference to the number itself
}

fn main() {
    let mut count = 0;
    bump(&mut count);
    bump(&mut count);
    println!("{}", count);
}`,
          output: '2',
          caption: 'For a number you write the * yourself.',
        },
      ],
      terms: [
        { code: '&mut x', meaning: 'a mutable reference: lets the receiver change x; x must be declared mut' },
        { code: '&mut String', meaning: 'the type "mutable reference to a String"' },
        { code: '*n', meaning: 'dereference: the value the reference n points at' },
      ],
    },
    task: 'Finish <code>double</code> so that it doubles the number it is given in place. The program should print <code>42</code>.',
    compare: {
      cpp: { code: `void bump(int& n) {
    n += 1;
}
int count = 0;
bump(count);   // the call does not show it can change count`, outcome: 'Prints nothing; count becomes 1', ok: true },
      rust: { code: `fn bump(n: &mut i32) {
    *n += 1;
}
let mut count = 0;
bump(&mut count);`, outcome: 'count becomes 1; call shows &mut', ok: true },
      text: 'C++ passes by <code>T&amp;</code> without any sign at the call. In Rust you write <code>&amp;mut</code> at the call too, so every place that may change a variable is visible.',
    },
    refresher: [
      '<code>&amp;mut x</code> needs <code>let mut x</code>. Inside, <code>*n</code> is the value behind the reference.',
      'While a <code>&amp;mut</code> exists, nothing else may use the value.',
    ],
    hints: [
      'Inside <code>double</code>, <code>n</code> is a reference. What follows it to the number?',
      'Write <code>*n *= 2;</code>.',
    ],
    starter: `fn double(n: &mut i32) {
    // double the number n points at
}

fn main() {
    let mut x = 21;
    double(&mut x);
    println!("{}", x);
}`,
    solution: `fn double(n: &mut i32) {
    *n *= 2;
}

fn main() {
    let mut x = 21;
    double(&mut x);
    println!("{}", x);
}`,
    require: [{ pattern: '\\*\\s*n', message: 'Dereference n with *' }],
    tests: [{ name: 'Prints 42', expected: '42' }],
  },

  // 11. fix: borrow an immutable binding
  {
    id: 'r2-fix-immutable-binding',
    title: 'Borrowing an immutable binding',
    kind: 'fix',
    introduces: [],
    task: 'The function is right but the call is rejected. Fix the program so it prints <code>[1, 5]</code>, keeping the <code>&amp;mut</code> call.',
    errorCode: 'E0596',
    gloss: '<code>&amp;mut v</code> asks for write access, but <code>v</code> was declared without <code>mut</code>.',
    refresher: [
      'Bindings are read-only unless declared <code>let mut</code>.',
      'You can only take <code>&amp;mut x</code> from a variable that is itself <code>mut</code>.',
    ],
    hints: [
      'Read the help line under the error: it points at the declaration of <code>v</code>.',
      'The permission to write belongs to the variable, not to the call.',
    ],
    inCpp: {
      code: 'std::vector<int> v{1};         // mutable by default\nconst std::vector<int> w{1};   // read-only only if you ask',
      note: 'C++ variables are writable unless marked <code>const</code>. Rust variables are read-only unless marked <code>mut</code>.',
    },
    starter: 'fn add_five(v: &mut Vec<i32>) {\n    v.push(5);\n}\n\nfn main() {\n    let v = vec![1];\n    add_five(&mut v);\n    println!("{:?}", v);\n}',
    solution: 'fn add_five(v: &mut Vec<i32>) {\n    v.push(5);\n}\n\nfn main() {\n    let mut v = vec![1];\n    add_five(&mut v);\n    println!("{:?}", v);\n}',
    require: [{ pattern: 'add_five\\s*\\(\\s*&\\s*mut\\s+v\\s*\\)', message: 'Keep the call add_five(&mut v)' }],
    tests: [{ name: 'Prints [1, 5]', expected: '[1, 5]' }],
  },

  // 12. Many readers or one writer
  {
    id: 'r2-readers-or-writer',
    title: 'Many readers or one writer',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Now the rule that makes Rust, Rust. At any moment, a value may have <em>either</em> any number of <code>&amp;</code> readers <em>or</em> exactly one <code>&amp;mut</code> writer, but never both at once. Two readers are fine. One writer alone is fine. A writer together with any other reference, reader or writer, is a compile error.</p>`,
        `<p>Why? A reader assumes the value stays put while it looks. If someone else can change the value in the meantime, the reader may see half-updated data, or a pointer that no longer points anywhere. You know the classic case from C++: you keep a pointer or iterator into a <code>std::vector</code>, call <code>push_back</code>, the vector grows and moves to a new buffer, and your pointer now dangles. That is undefined behaviour and the compiler says nothing. In Rust the reference counts as a reader, <code>push</code> needs a writer, and the compiler rejects the program before it runs. The check costs nothing at run time.</p>`,
        `<p>One detail makes this practical: a borrow lasts only until its <em>last use</em>, not until the closing brace. Once you have finished using a reference, the compiler treats it as gone, and a writer may start. So you fix most errors by finishing with one reference before the next starts.</p>`,
        `<p>The two errors you will meet are <code>E0499</code> (two writers: "cannot borrow as mutable more than once") and <code>E0502</code> (a reader and a writer: "cannot borrow as mutable because it is also borrowed as immutable").</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let mut s = String::from("a");
    let r = &s;                // a reader
    println!("{}", r);         // last use of r: the borrow ends here
    s.push('b');               // allowed: no reader is left
    let w = &mut s;            // a writer
    w.push('c');               // last use of w
    println!("{}", s);         // fine: the writer is finished
}`,
          output: 'a\nabc',
          caption: 'Each borrow ends at its last use, so they never overlap.',
        },
      ],
      terms: [
        { code: 'many & or one &mut', meaning: 'the rule: any number of readers, or one writer, never both' },
        { code: 'E0499 / E0502', meaning: 'two writers / a reader and a writer alive together' },
      ],
    },
    task: 'This does not compile: two <code>&amp;mut s</code> are alive at once. Keep both pushes and both references, and make it print <code>axy</code>.',
    compare: {
      cpp: { code: 'std::string s = "a";\nstd::string& r1 = s;\nstd::string& r2 = s;\nr1 += "x";\nr2 += "y";', outcome: 'Compiles: two writers alias s', ok: true },
      rust: { code: 'let mut s = String::from("a");\nlet r1 = &mut s;\nlet r2 = &mut s;\nr1.push(\'x\');\nr2.push(\'y\');', outcome: 'Error: two &mut at once', ok: false, errorCode: 'E0499' },
      text: 'C++ lets any number of references write to one object. Rust allows one writer at a time, which also rejects the code behind C++ iterator invalidation.',
    },
    refresher: [
      'Two <code>&amp;</code> at once are fine. <code>&amp;mut</code> must be alone, and cannot coexist with any <code>&amp;</code>.',
      'A borrow ends after its last use, so one writer can finish before the next begins.',
    ],
    hints: [
      'The error says where the first borrow is used later. Which line is that?',
      'Make the first writer finish before the second one starts.',
    ],
    inCpp: {
      code: 'std::vector<int> v{1, 2, 3};\nfor (int x : v) {\n    if (x == 2) v.push_back(9);   // invalidates the loop\'s iterators\n}',
      note: 'This compiles in C++ and is undefined behaviour once <code>push_back</code> reallocates. The matching Rust code is rejected with E0502, as a later lesson shows.',
    },
    starter: 'fn main() {\n    let mut s = String::from("a");\n    let r1 = &mut s;\n    let r2 = &mut s;\n    r1.push(\'x\');\n    r2.push(\'y\');\n    println!("{}", s);\n}',
    solution: 'fn main() {\n    let mut s = String::from("a");\n    let r1 = &mut s;\n    r1.push(\'x\');\n    let r2 = &mut s;\n    r2.push(\'y\');\n    println!("{}", s);\n}',
    require: [
      { pattern: 'r1\\.push\\s*\\(', message: 'Keep the push through r1' },
      { pattern: 'r2\\.push\\s*\\(', message: 'Keep the push through r2' },
    ],
    tests: [{ name: 'Prints axy', expected: 'axy' }],
  },

  // 13. fix: push while borrowed
  {
    id: 'r2-push-while-borrowed',
    title: 'Push while holding a reference',
    kind: 'fix',
    introduces: [],
    task: 'The borrow checker rejects this. Change it so it compiles and still prints the first item.',
    errorCode: 'E0502',
    gloss: '<code>first</code> still points into <code>v</code> on line 5, so <code>v</code> cannot change on line 4.',
    refresher: [
      'Many readers (<code>&amp;</code>) <em>or</em> one writer (<code>&amp;mut</code>), never both at once.',
      '<code>Vec::push</code> needs a writer. A borrow lasts until its last use.',
    ],
    hints: [
      'Which line uses <code>first</code> last? Does <code>v</code> have to change before that?',
      'Let the borrow finish before pushing, or stop borrowing by copying the number out of the vector.',
      'An <code>i32</code> is <code>Copy</code>, so <code>let first = v[0];</code> borrows nothing.',
    ],
    inCpp: {
      code: 'std::vector<int> v{1, 2, 3};\nint& first = v[0];\nv.push_back(4);      // may reallocate\nstd::cout << first;  // dangling',
      note: 'This compiles in C++, but if <code>push_back</code> reallocates, <code>first</code> dangles and reading it is undefined behaviour. Rust turns that bug into a compile error.',
    },
    starter: 'fn main() {\n    let mut v = vec![1, 2, 3];\n    let first = &v[0];\n    v.push(4);\n    println!("{}", first);\n}',
    solution: 'fn main() {\n    let mut v = vec![1, 2, 3];\n    let first = &v[0];\n    println!("{}", first);\n    v.push(4);\n}',
    require: [{ pattern: 'v\\.push\\(4\\)', message: 'Keep v.push(4)' }],
    tests: [{ name: 'Prints 1', expected: '1' }],
  },

  // 14. predict: borrow lifetime
  {
    id: 'r2-how-long-does-a-borrow-last',
    title: 'How long does a borrow last?',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      'A borrow lasts from where it is created to its <em>last use</em>, not to the closing brace.',
      'While a borrow will still be used later, a writer may not touch the value.',
    ],
    inCpp: {
      code: 'std::string s = "hi";\nstd::string& r = s;\ns += "!";\nr += "?";   // both write through aliases',
      note: 'C++ lets <code>s</code> and <code>r</code> write interleaved. Rust only allows it once the earlier borrow is no longer used.',
    },
    rounds: [
      {
        snippet: 'fn main() {\n    let mut s = String::from("hi");\n    let r = &s;\n    println!("{}", r);\n    s.push(\'!\');\n    println!("{}", s);\n}',
        choices: ['Compiles and prints hi, then hi!', 'Error: borrow of moved value', 'Error: cannot borrow as mutable'],
        answer: 0,
        why: 'The borrow <code>r</code> ends after its last use on line 4, so <code>s.push</code> on line 5 is allowed.',
        output: 'hi\nhi!',
      },
      {
        snippet: 'fn main() {\n    let mut s = String::from("hi");\n    let r = &mut s;\n    s.push(\'!\');\n    r.push(\'?\');\n    println!("{}", s);\n}',
        choices: ['Compiles and prints hi!?', 'Error: cannot borrow as mutable more than once', 'Error: borrow of moved value'],
        answer: 1,
        why: '<code>r</code> is used again on line 5, so its borrow is still alive on line 4 when <code>s.push</code> needs it.',
        errorCode: 'E0499',
        output: 'error[E0499]: cannot borrow `s` as mutable more than once at a time\n --> src/main.rs:4:5\n  |\n3 |     let r = &mut s;\n  |             ------ first mutable borrow occurs here\n4 |     s.push(\'!\');\n  |     ^ second mutable borrow occurs here\n5 |     r.push(\'?\');\n  |     - first borrow later used here\n\nerror: aborting due to 1 previous error\n\nFor more information about this error, try `rustc --explain E0499`.',
      },
    ],
  },

  // 15. Looping over a borrowed Vec
  {
    id: 'r2-iter-mut',
    title: 'Looping over a Vec',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Stage 1 warned that <code>for x in v</code> over a <code>Vec</code> has a catch. Here it is: that loop <em>moves</em> the Vec into the loop. Ownership of every element is handed out one at a time, and after the loop the Vec is gone. Using <code>v</code> afterwards is the same "moved value" error you already know. (An array of numbers is <code>Copy</code>, so that loop was harmless.)</p>`,
        `<p>Usually you want to look at the elements and keep the Vec, so you loop over a borrow: <code>for x in &amp;v { ... }</code>. Now <code>x</code> is a reference to each element, of type <code>&amp;i32</code> for a <code>Vec&lt;i32&gt;</code>. Printing it with <code>{}</code> and doing arithmetic with it just work; to get the plain number out, write <code>*x</code>. When the loop is over, the borrow is over, and <code>v</code> is yours again.</p>`,
        `<p>To change the elements in place, loop over a mutable borrow: <code>for x in &amp;mut v { *x *= 2; }</code>. Each <code>x</code> is a <code>&amp;mut i32</code>, so you assign through it with <code>*</code>.</p>`,
        `<p>While the loop runs, <code>v</code> is borrowed, by the rule from the last lesson. So you cannot push to or remove from <code>v</code> inside a loop over <code>&amp;v</code>: that is C++'s "modify the container while iterating" bug, caught at compile time. You can still change the elements through <code>&amp;mut v</code>, and you can still loop with positions (<code>for i in 0..v.len()</code>) which borrows nothing between passes.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = vec![1, 2, 3];
    let mut total = 0;
    for x in &v {              // x is a reference to each element
        total += *x;           // *x is the number itself
    }
    println!("{} {:?}", total, v);   // v is still ours
}`,
          output: '6 [1, 2, 3]',
        },
        {
          code: `fn main() {
    let mut v = vec![1, 2, 3];
    for x in &mut v {          // x is a mutable reference to each element
        *x *= 2;               // change the element in place
    }
    println!("{:?}", v);
}`,
          output: '[2, 4, 6]',
        },
      ],
      terms: [
        { code: 'for x in v', meaning: 'moves the Vec into the loop; v cannot be used afterwards' },
        { code: 'for x in &v', meaning: 'x is a reference to each element; v stays usable' },
        { code: 'for x in &mut v', meaning: 'x is a mutable reference; change elements with *x' },
      ],
    },
    task: 'This fails to compile. Make it double every item in place so it prints <code>[2, 4, 6]</code>.',
    compare: {
      cpp: { code: `std::vector<int> v{1, 2, 3};
for (int x : v) {
    if (x == 2) v.push_back(9);
}`, outcome: 'Compiles; push_back invalidates the loop', ok: true },
      rust: { code: `let mut v = vec![1, 2, 3];
for x in &v {
    if *x == 2 { v.push(9); }
}`, outcome: 'Error: cannot borrow v as mutable', ok: false, errorCode: 'E0502' },
      text: 'The loop holds a borrow of <code>v</code>, so <code>v</code> cannot grow inside it. To change the items themselves, loop over <code>&amp;mut v</code>.',
    },
    refresher: [
      '<code>for x in &amp;v</code> reads, <code>for x in &amp;mut v</code> writes with <code>*x</code>. A plain <code>for x in v</code> moves the Vec.',
      'An index loop, <code>for i in 0..v.len()</code>, borrows nothing between iterations.',
    ],
    hints: [
      'A plain <code>&amp;v</code> loop only reads. Which borrow allows writing?',
      'Keep <code>*x *= 2</code>; change what the loop iterates over.',
    ],
    inCpp: {
      code: `void doubled(std::vector<int>& v) {
    for (int& x : v) x *= 2;   // fine
    for (size_t i = 0; i < v.size(); i++)
        v[i] *= 2;             // also fine
}`,
      note: 'Editing items through a reference is fine in both languages. Only changing the vector\'s length inside the loop differs: undefined behaviour in C++, a compile error in Rust.',
    },
    starter: `fn main() {
    let mut v = vec![1, 2, 3];
    for x in &v {
        *x *= 2;
    }
    println!("{:?}", v);
}`,
    solution: `fn main() {
    let mut v = vec![1, 2, 3];
    for x in &mut v {
        *x *= 2;
    }
    println!("{:?}", v);
}`,
    require: [{ pattern: '\\*\\s*x\\s*\\*=\\s*2|v\\[\\s*i\\s*\\]\\s*\\*=\\s*2', message: 'Keep doubling each item.' }],
    tests: [{ name: 'Prints [2, 4, 6]', expected: '[2, 4, 6]' }],
  },

  // 16. implement: signatures
  {
    id: 'r2-borrow-signatures',
    title: 'Choose the right signatures',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>total</code> (reads a vector), <code>append_total</code> (pushes the sum onto it) and <code>join</code> (consumes two Strings, returns one). Choose each parameter as <code>&amp;T</code>, <code>&amp;mut T</code> or owned.',
    refresher: [
      'Read only: <code>&amp;Vec&lt;i32&gt;</code>. Modify in place: <code>&amp;mut Vec&lt;i32&gt;</code>. Take over: <code>Vec&lt;i32&gt;</code> or <code>String</code>.',
      'The caller of <code>total</code> uses its vector again afterwards, so <code>total</code> must not take it.',
      '<code>a.push_str(&amp;b)</code> appends the text of String <code>b</code> to a <code>mut</code> String <code>a</code>. Rust converts <code>&amp;b</code> to the text view <code>push_str</code> wants; a later lesson explains it.',
    ],
    hints: [
      'Think about how the caller uses each value afterwards: still needed, changed, or given away?',
      '<code>join</code> owns its first String: declare the parameter <code>mut a: String</code>, push onto it, and return it.',
      'Inside <code>append_total</code>, <code>total(v)</code> works on a <code>&amp;mut Vec</code>: it lends a read-only view for the call.',
    ],
    inCpp: {
      code: 'int total(const std::vector<int>& v);\nvoid append_total(std::vector<int>& v);\nstd::string join(std::string a, std::string b);',
      note: 'The three C++ signatures map to <code>&amp;Vec</code>, <code>&amp;mut Vec</code> and owned <code>String</code>. In Rust the choice also decides what the caller may do afterwards.',
    },
    starter: 'fn total(v: Vec<i32>) -> i32 {\n    0\n}\n\nfn append_total(v: Vec<i32>) {\n}\n\nfn join(a: String, b: String) -> String {\n    String::new()\n}',
    solution: 'fn total(v: &Vec<i32>) -> i32 {\n    let mut sum = 0;\n    for x in v {\n        sum += *x;\n    }\n    sum\n}\n\nfn append_total(v: &mut Vec<i32>) {\n    let t = total(v);\n    v.push(t);\n}\n\nfn join(mut a: String, b: String) -> String {\n    a.push_str(&b);\n    a\n}',
    harness: `fn main() {
    let mut v = vec![1, 2, 3];
    println!("\\n@@TEST 1@@");
    println!("{}", total(&v));
    println!("\\n@@TEST 2@@");
    append_total(&mut v);
    println!("{:?}", v);
    println!("\\n@@TEST 3@@");
    println!("{}", total(&v));
    println!("\\n@@TEST 4@@");
    let a = String::from("ab");
    let b = String::from("cd");
    println!("{}", join(a, b));
    println!("\\n@@TEST 5@@");
    let empty: Vec<i32> = Vec::new();
    println!("{}", total(&empty));
}`,
    forbidden: [{ pattern: '\\.clone\\s*\\(', message: 'Borrow or move instead of copying.' }],
    tests: [
      { name: 'total reads', input: 'total(&[1, 2, 3])', expected: '6' },
      { name: 'append_total writes', input: 'append_total(&mut v)', expected: '[1, 2, 3, 6]' },
      { name: 'v still usable', input: 'total(&v)', expected: '12' },
      { name: 'join consumes', input: 'join("ab", "cd")', expected: 'abcd' },
      { name: 'Empty vector', input: 'total(&[])', expected: '0' },
    ],
  },
]
