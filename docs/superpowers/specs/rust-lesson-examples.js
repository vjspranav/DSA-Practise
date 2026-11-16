// Reference lessons for the Rust track: one each of concept, predict, fix and implement.
// Copy the shape, the tone and the level of detail. Contract: "Lesson data" and "Authoring notes" in
// docs/superpowers/specs/2026-11-15-rust-track-design.md. All four pass `node scripts/verify-rust.mjs`.
//
// Style rules these examples follow:
//   - Text is short. `task` says what to do, not how. Refreshers are facts, not a lecture.
//   - HTML fields (task, refresher, hints, why, gloss, notes) may use <code>, <em>; escape & < > as &amp; &lt; &gt;.
//   - Hints go from "where to look" to "what kind of change", and never print the answer.
//   - Every claim is true for rustc 1.7x or newer; the checker proves the code claims.
//   - `inCpp` shows the C++ way and ONE or TWO sentences on the instructive difference.

// ---------------------------------------------------------------------------------------------
// 1. concept: no harness, so the whole program is the test (one test, whole stdout compared).
//    `compare` shows C++ and Rust side by side; `compare.text` is the idea, at most two sentences.
//    The starter fails to compile; the learner must change it so it prints "hi hi".
// ---------------------------------------------------------------------------------------------
const conceptMoves = {
  id: 'r2-moves-not-copies',
  title: 'Moves, not copies',
  kind: 'concept',
  task: 'This does not compile. Change it so it prints <code>hi hi</code>: <code>a</code> must still be usable after <code>b</code> is created.',
  compare: {
    cpp:  { code: 'std::string a = "hi";\nstd::string b = a;   // copy\nstd::cout << a << b;', outcome: 'Both usable: two buffers', ok: true },
    rust: { code: 'let a = String::from("hi");\nlet b = a;   // move\nprintln!("{} {}", a, b);', outcome: 'Error: a was moved', ok: false, errorCode: 'E0382' },
    text: 'Rust moves by default: after <code>let b = a;</code>, <code>b</code> is the only owner and <code>a</code> is dead. Every buffer is freed exactly once, with no garbage collector and no copy you did not ask for.',
  },
  refresher: [
    '<code>let b = a;</code> on a <code>String</code> moves it. <code>a</code> cannot be used afterwards.',
    '<code>i32</code>, <code>bool</code>, <code>char</code> and other small plain types are <code>Copy</code>: <code>let y = x;</code> leaves <code>x</code> usable.',
    '<code>.clone()</code> makes an explicit deep copy, like the C++ copy constructor.',
  ],
  hints: [
    '<code>b</code> took ownership of the String. Who owns it now?',
    'Either give <code>b</code> its own copy, or let <code>b</code> only look at <code>a</code>.',
    'One method makes a copy; one operator on <code>a</code> lends it out.',
  ],
  inCpp: {
    code: 'std::string a = "hi";\nstd::string c = std::move(a);\n// a is valid but unspecified:\n// usually empty, still compiles',
    note: 'In C++ you ask for a move with <code>std::move</code> and can still touch <code>a</code> afterwards. Rust makes the move the default and rejects any later use.',
  },
  starter: 'fn main() {\n    let a = String::from("hi");\n    let b = a;\n    println!("{} {}", a, b);\n}',
  solution: 'fn main() {\n    let a = String::from("hi");\n    let b = a.clone();\n    println!("{} {}", a, b);\n}',
  // The solution may copy (a.clone()) or borrow (&a). Both keep `let b = ...;` as written.
  require: [{ pattern: 'let\\s+b\\s*=\\s*(a\\.clone\\(\\)|&\\s*a)\\s*;', message: 'Give b a copy (a.clone()) or a borrow (&a).' }],
  tests: [{ name: 'Prints hi hi', expected: 'hi hi' }],
}

// ---------------------------------------------------------------------------------------------
// 2. predict: unscored, no starter/solution/tests/hints. Each round is a whole program (with fn main).
//    `output` is exactly what rustc/the program printed. Capture it like this (details in Authoring notes):
//        mkdir -p src && cp snippet.rs src/main.rs && rustc --edition 2021 --color never src/main.rs 2>&1
//    Error rounds need `errorCode`; the stored `output` must contain the code and the first
//    `error[...]: ...` line the real compiler prints.
// ---------------------------------------------------------------------------------------------
const predictMoves = {
  id: 'r2-what-will-the-compiler-say',
  title: 'What will the compiler say?',
  kind: 'predict',
  task: 'For each snippet, pick what you expect, then compile it and compare.',
  refresher: [
    'A parameter of type <code>String</code> takes ownership: the caller\'s variable is moved.',
    '<code>&amp;s</code> lends a read-only reference. A borrow lasts until its <em>last use</em>, not until the end of the block.',
  ],
  inCpp: {
    code: 'void consume(std::string s) {\n    std::cout << s << "\\n";\n}\n\nstd::string name = "Ada";\nconsume(name);        // copy\nstd::cout << name;    // fine',
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
      snippet: 'fn main() {\n    let mut s = String::from("hi");\n    let r = &s;\n    println!("{}", r);\n    s.push(\'!\');\n    println!("{}", s);\n}',
      choices: ['Compiles and prints hi, then hi!', 'Error: borrow of moved value', 'Error: cannot borrow as mutable'],
      answer: 0,
      why: 'The borrow <code>r</code> ends after its last use on line 4, so <code>s.push</code> on line 5 is allowed.',
      output: 'hi\nhi!',
    },
  ],
}

// ---------------------------------------------------------------------------------------------
// 3. fix: the starter must fail to compile with `errorCode`. No harness: whole stdout is the one test.
//    `require` keeps the point of the exercise (the checker requires the STARTER to satisfy it too).
//    `gloss` is one plain sentence about the error, shown above the real compiler output.
// ---------------------------------------------------------------------------------------------
const fixPush = {
  id: 'r2-push-while-borrowed',
  title: 'Push while holding a reference',
  kind: 'fix',
  task: 'The borrow checker rejects this. Change it so it compiles and still prints the first item.',
  errorCode: 'E0502',
  gloss: '<code>first</code> still points into <code>v</code> on line 5, so <code>v</code> cannot change on line 4.',
  refresher: [
    'Many readers (<code>&amp;</code>) <em>or</em> one writer (<code>&amp;mut</code>), never both at once.',
    '<code>Vec::push</code> needs <code>&amp;mut self</code>, so it counts as a writer.',
    'A borrow lasts until its last use. Finish using the reference and the writer is allowed.',
  ],
  hints: [
    'Which line uses <code>first</code> last? Does <code>v</code> have to change before that?',
    'Either let the borrow finish before pushing, or stop borrowing: take the number out of the vector.',
    'A borrow ends after its last use. An <code>i32</code> is <code>Copy</code>, so reading it leaves nothing borrowed.',
  ],
  inCpp: {
    code: 'std::vector<int> v{1, 2, 3};\nint& first = v[0];\nv.push_back(4);   // may reallocate\nstd::cout << first;  // dangling',
    note: 'This compiles in C++, but if <code>push_back</code> reallocates, <code>first</code> dangles and reading it is undefined behaviour. Rust turns that bug into a compile error.',
  },
  starter: 'fn main() {\n    let mut v = vec![1, 2, 3];\n    let first = &v[0];\n    v.push(4);\n    println!("{}", first);\n}',
  solution: 'fn main() {\n    let mut v = vec![1, 2, 3];\n    let first = &v[0];\n    println!("{}", first);\n    v.push(4);\n}',
  require: [{ pattern: 'v\\.push\\(4\\)', message: 'Keep v.push(4)' }],
  tests: [{ name: 'Prints 1', expected: '1' }],
}

// ---------------------------------------------------------------------------------------------
// 4. implement: learner writes a function; the harness (appended after their code) owns fn main and
//    prints println!("\n@@TEST n@@") before each test. tests[n-1].expected is compared with what follows.
//    `input` is only the label shown in the test list. Empty input is a test of its own.
//    `forbidden` blocks shortcuts (the standard library sort here).
// ---------------------------------------------------------------------------------------------
const implementInsertion = {
  id: 'r4-insertion-sort',
  title: 'Insertion sort',
  kind: 'implement',
  task: 'Write <code>insertion_sort</code> so it sorts the slice in place, smallest first.',
  refresher: [
    '<code>&amp;mut [i32]</code> is a mutable borrow of a run of integers: it works for a <code>Vec</code> or an array and cannot change its length.',
    '<code>for i in 1..v.len()</code> excludes the end. <code>v.swap(a, b)</code> swaps two elements.',
    'Indexes are <code>usize</code>, which cannot go below 0: guard with <code>j &gt; 0</code> before using <code>j - 1</code>.',
  ],
  hints: [
    'Start the outer loop at index 1: everything left of <code>i</code> is already sorted.',
    'Swap item <code>j</code> leftward while the one before it is larger.',
    'Check <code>j &gt; 0</code> first. In a debug build <code>0usize - 1</code> panics instead of wrapping.',
  ],
  inCpp: {
    code: 'void insertion_sort(std::vector<int>& v) {\n    for (size_t i = 1; i < v.size(); i++) {\n        size_t j = i;\n        while (j > 0 && v[j - 1] > v[j]) {\n            std::swap(v[j - 1], v[j]);\n            j--;\n        }\n    }\n}',
    note: 'Same loops. Two Rust differences: the parameter is a slice (<code>&amp;mut [i32]</code>) rather than a vector reference, and <code>0usize - 1</code> panics in a debug build where C++ silently wraps to 18446744073709551615.',
  },
  starter: 'fn insertion_sort(v: &mut [i32]) {\n    // sort v in place\n}',
  solution: 'fn insertion_sort(v: &mut [i32]) {\n    for i in 1..v.len() {\n        let mut j = i;\n        while j > 0 && v[j - 1] > v[j] {\n            v.swap(j - 1, j);\n            j -= 1;\n        }\n    }\n}',
  // Helpers in a harness get a harness_ prefix so they cannot collide with the learner's names.
  harness: `fn harness_show(v: &[i32]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
}

fn main() {
    let mut cases: Vec<Vec<i32>> = vec![
        vec![5, 2, 9, 1],
        vec![],
        vec![7],
        vec![3, 3, 1, 3, 1],
        vec![1, 2, 3, 4, 5],
        vec![9, 8, 7, 6, 5],
    ];
    for (i, v) in cases.iter_mut().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        insertion_sort(v);
        println!("{}", harness_show(v));
    }
}`,
  forbidden: [{ pattern: '\\.sort(_unstable)?(_by(_key)?)?\\s*\\(', message: 'Write the sort yourself: the standard library sort is off the table here.' }],
  tests: [
    { name: 'Example', input: '5 2 9 1', expected: '1 2 5 9' },
    { name: 'Empty list', input: '(empty)', expected: '' },
    { name: 'One item', input: '7', expected: '7' },
    { name: 'Duplicates', input: '3 3 1 3 1', expected: '1 1 3 3 3' },
    { name: 'Already sorted', input: '1 2 3 4 5', expected: '1 2 3 4 5' },
    { name: 'Reversed', input: '9 8 7 6 5', expected: '5 6 7 8 9' },
  ],
}

export const EXAMPLES = [conceptMoves, predictMoves, fixPush, implementInsertion]
