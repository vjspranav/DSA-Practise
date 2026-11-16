// Rust lessons: stage 2 part B, ownership and borrowing from zero (dangling references, slices, strings, lifetimes,
// Vec element moves, Box, Rc, RefCell).
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end) and docs/superpowers/specs/rust-lesson-examples.js.
// Check with: node scripts/verify-rust.mjs --stage 2
// Ids must start with r2- and be unique across the track. Every piece of syntax a lesson uses must be introduced
// (`introduces`, ids from src/rust/syntax.js) by that lesson or an earlier one; the checker enforces it.
// Stage 3 teaches structs, Option and traits, so no lesson here uses them (recursive Box types wait for stage 3).

export const LESSONS = [
  // 17. Dangling references (E0106)
  {
    id: 'r2-dangling-refs',
    title: 'References cannot outlive their data',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>A reference points at a value owned by someone else. So what if the owner is dropped while the reference is still around? The reference would point at freed memory: a <em>dangling</em> reference. In C++ this is easy to write and the compiler usually accepts it. A classic case is a function that returns a reference to its own local variable. The local dies at the closing brace, and the caller receives a reference to a dead object. Reading it is undefined behaviour.</p>`,
        `<p>Rust makes this impossible. The rule is that a reference can never outlive the value it points to, and the compiler checks it. Writing <code>fn make() -&gt; &amp;String</code> and returning <code>&amp;s</code> of a local is rejected. The error for this particular shape is "missing lifetime specifier" (<code>E0106</code>): the function returns a reference but receives nothing to borrow from, so the only thing it could point at is its own locals. The word <em>lifetime</em> means "how long a reference stays valid". Later lessons name lifetimes explicitly; for now, treat the error as "this reference would outlive its owner".</p>`,
        `<p>The usual fix is to return the value itself. Returning moves ownership out to the caller, so nothing is left behind to dangle, and with a move no copy is made.</p>`,
        `<p>Returning a reference is fine when it points into something the <em>caller</em> still owns. If exactly one reference goes into a function and one comes out, Rust understands that the output points into that input, and it is valid because the caller owns the input for at least the length of the call.</p>`,
      ],
      examples: [
        {
          code: `fn make() -> String {          // return the value itself, not a reference to it
    let s = String::from("hi");
    s                           // ownership moves out to the caller
}

fn main() {
    println!("{}", make());
}`,
          output: 'hi',
        },
        {
          code: `fn pick(s: &String) -> &String {   // one reference in, one reference out
    s                               // it points into the caller's String: fine
}

fn main() {
    let name = String::from("Ada");
    let r = pick(&name);
    println!("{}", r);
}`,
          output: 'Ada',
          caption: 'The result borrows from the argument, which the caller still owns.',
        },
      ],
      terms: [
        { code: 'dangling reference', meaning: 'a reference to something that has already been dropped; Rust rejects it at compile time' },
        { code: 'lifetime', meaning: 'how long a reference stays valid (named explicitly in a later lesson)' },
        { code: 'E0106', meaning: 'missing lifetime specifier: the compiler cannot tell what a returned reference points into' },
      ],
    },
    task: 'This does not compile. Change <code>make</code> so the program prints <code>hi</code>.',
    compare: {
      cpp: {
        code: `const std::string& make() {
    std::string s = "hi";
    return s;   // reference to a local
}`,
        outcome: 'Compiles; using it is undefined behaviour',
        ok: true,
      },
      rust: {
        code: `fn make() -> &String {
    let s = String::from("hi");
    &s
}`,
        outcome: 'Error: missing lifetime specifier',
        ok: false,
        errorCode: 'E0106',
      },
      text: 'A reference must not outlive what it points to, and Rust checks that at compile time. The C++ version is accepted (usually with a warning) and fails only when you read the dead object.',
    },
    refresher: [
      'A local variable is dropped when its function returns, so a reference to it would point at freed memory.',
      'Return the value itself to hand ownership to the caller: <code>fn make() -&gt; String</code>.',
    ],
    hints: [
      'The reference would point at <code>s</code>, which dies at the closing brace. What can the caller own instead?',
      'Change the return type so it no longer borrows, then change what the last line returns.',
    ],
    inCpp: {
      code: `std::string make() {
    std::string s = "hi";
    return s;   // moved or elided, no copy
}`,
      note: 'The safe C++ version also returns by value, and the cost is the same. Rust simply refuses the unsafe version.',
    },
    starter: `fn make() -> &String {
    let s = String::from("hi");
    &s
}

fn main() {
    println!("{}", make());
}`,
    solution: `fn make() -> String {
    let s = String::from("hi");
    s
}

fn main() {
    println!("{}", make());
}`,
    require: [{ pattern: 'fn\\s+make\\(\\s*\\)\\s*->\\s*String', message: 'make() should return an owned String.' }],
    tests: [{ name: 'Prints hi', expected: 'hi' }],
  },

  // 18. predict: dangling
  {
    id: 'r2-predict-dangling',
    title: 'Which reference is allowed?',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      'A function that takes one reference and returns one reference is assumed to return a reference into that argument.',
      'The caller owns the data behind its arguments, so that data outlives the call.',
    ],
    inCpp: {
      code: `const std::string& shout(const std::string& s) {
    std::string up = s + "!";
    return up;   // compiles, dangles
}`,
      note: 'C++ accepts this and returns a dead object. Rust traces where the returned reference points and rejects it.',
    },
    rounds: [
      {
        snippet: `fn shout(s: &str) -> &str {
    let up = format!("{}!", s);
    &up
}

fn main() {
    println!("{}", shout("hi"));
}`,
        choices: ['Prints hi!', 'Error: returns a reference to a local', 'Error: missing lifetime specifier'],
        answer: 1,
        why: 'With one input reference the return type is tied to it, so there is no lifetime to add. The code returns <code>&amp;up</code>, which dies with the function.',
        errorCode: 'E0515',
        output: `error[E0515]: cannot return reference to local variable \`up\`
 --> src/main.rs:3:5
  |
3 |     &up
  |     ^^^ returns a reference to data owned by the current function

error: aborting due to 1 previous error

For more information about this error, try \`rustc --explain E0515\`.`,
      },
      {
        snippet: `fn first(v: &Vec<i32>) -> &i32 {
    &v[0]
}

fn main() {
    let v = vec![4, 5];
    println!("{}", first(&v));
}`,
        choices: ['Prints 4', 'Error: returns a reference to a local', 'Error: missing lifetime specifier'],
        answer: 0,
        why: 'The returned reference points into the caller\'s vector, which outlives the call. Only references to the function\'s own locals are rejected.',
        output: '4',
      },
    ],
  },

  // 19. Slices
  {
    id: 'r2-slices',
    title: 'Slices: borrowed views',
    kind: 'concept',
    introduces: ['slice-ref', 'slice-range'],
    teach: {
      body: [
        `<p>A <em>slice</em> is a borrowed view of a run of elements inside an array or a <code>Vec</code>. Its type is <code>&amp;[i32]</code>, read "a reference to a slice of <code>i32</code>". It remembers where the run starts and how long it is, and it owns nothing. It is Rust's counterpart of C++20 <code>std::span</code>, or the old pair of a pointer and a length.</p>`,
        `<p>You make a slice by borrowing with a range of positions: <code>&amp;v[1..4]</code> is the elements at positions 1, 2 and 3 (the end is excluded, as in the ranges from stage 1). You can leave a side open: <code>&amp;v[..2]</code> runs from the start up to position 2, <code>&amp;v[3..]</code> runs from position 3 to the end, and <code>&amp;v[..]</code> is the whole thing. A range that reaches past the end panics instead of reading memory it should not.</p>`,
        `<p>A slice supports <code>.len()</code>, indexing <code>xs[0]</code> counted from 0 inside the slice, and <code>for x in xs</code>, which gives references just like <code>for x in &amp;v</code>. The best part is for function parameters: write <code>xs: &amp;[i32]</code> and the function accepts a whole <code>Vec</code> (<code>&amp;v</code>), a whole array (<code>&amp;a</code>) or any part (<code>&amp;v[1..3]</code>). Rust converts <code>&amp;Vec&lt;i32&gt;</code> to <code>&amp;[i32]</code> automatically at the call. That is why Rust code prefers <code>&amp;[T]</code> over <code>&amp;Vec&lt;T&gt;</code> for parameters that only read.</p>`,
        `<p>There is a mutable form, <code>&amp;mut [i32]</code>, which lets the function change the elements it can see but not the length. The borrow rule applies as usual: while a slice of <code>v</code> is in use, <code>v</code> cannot be changed.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = vec![10, 20, 30, 40, 50];
    let middle = &v[1..4];    // positions 1, 2, 3
    let start = &v[..2];      // from the beginning up to position 2
    let end = &v[3..];        // from position 3 to the end
    let all = &v[..];         // everything
    println!("{:?} {:?} {:?} {}", middle, start, end, all.len());
}`,
          output: '[20, 30, 40] [10, 20] [40, 50] 5',
        },
        {
          code: `fn sum(xs: &[i32]) -> i32 {      // accepts a view of any run of i32
    let mut total = 0;
    for x in xs {                // x is a reference to each element
        total += *x;
    }
    total
}

fn main() {
    let v = vec![1, 2, 3, 4];
    let a = [10, 20, 30];
    println!("{} {} {}", sum(&v), sum(&a), sum(&v[1..3]));   // Vec, array, part of a Vec
}`,
          output: '10 60 5',
          caption: 'One function serves a Vec, an array and a part of either.',
        },
      ],
      terms: [
        { code: '&[i32]', meaning: 'a slice: a borrowed view of a run of i32 values' },
        { code: '&mut [i32]', meaning: 'a mutable slice: elements may change, the length may not' },
        { code: '&v[1..4]', meaning: 'a slice of positions 1, 2 and 3' },
        { code: '&v[..2], &v[3..], &v[..]', meaning: 'open-ended ranges: from the start, to the end, everything' },
      ],
    },
    task: 'Print the sum of the middle three elements of <code>v</code> (2, 3 and 4) using <code>sum</code> on a slice. It should print <code>9</code>.',
    cppStd: 20,
    compare: {
      cpp: { code: `#include <span>
int sum_middle(const std::vector<int>& v) {
    std::span<const int> middle(v.data() + 1, 3);
    int total = 0;
    for (int x : middle) total += x;
    return total;
}`, outcome: 'A span views 3 ints', ok: true },
      rust: { code: `let v = vec![1, 2, 3, 4, 5];
let middle = &v[1..4];
let mut total = 0;
for x in middle { total += *x; }`, outcome: 'A slice views 3 i32', ok: true },
      text: 'A slice is a <code>std::span</code> with the range written in the borrow. Unlike a span, the compiler guarantees the vector stays alive and unchanged while the slice is in use.',
    },
    refresher: [
      '<code>&amp;v[a..b]</code> borrows positions a up to b-1 as a <code>&amp;[T]</code>. <code>&amp;v[..]</code> is all of it.',
      'Take <code>&amp;[T]</code> instead of <code>&amp;Vec&lt;T&gt;</code>: it accepts vectors, arrays and parts of them.',
    ],
    hints: [
      'Positions 1, 2 and 3 hold 2, 3 and 4.',
      'Pass <code>&amp;v[1..4]</code> to <code>sum</code> and print the result.',
    ],
    starter: `fn sum(xs: &[i32]) -> i32 {
    let mut total = 0;
    for x in xs {
        total += *x;
    }
    total
}

fn main() {
    let v = vec![1, 2, 3, 4, 5];
    // print the sum of the middle three elements
}`,
    solution: `fn sum(xs: &[i32]) -> i32 {
    let mut total = 0;
    for x in xs {
        total += *x;
    }
    total
}

fn main() {
    let v = vec![1, 2, 3, 4, 5];
    println!("{}", sum(&v[1..4]));
}`,
    require: [{ pattern: '&\\s*v\\s*\\[\\s*1\\s*\\.\\.\\s*4\\s*\\]', message: 'Pass the slice &v[1..4]' }],
    tests: [{ name: 'Prints 9', expected: '9' }],
  },

  // 20. implement: slice functions
  {
    id: 'r2-slice-functions',
    title: 'Functions over slices',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>max_gap</code>: the largest difference between neighbouring items of a slice (0 if fewer than two). Write <code>double_all</code>: double every item of a mutable slice in place.',
    refresher: [
      'Parameters borrow: <code>v: &amp;[i32]</code> reads, <code>xs: &amp;mut [i32]</code> writes with <code>*x</code> in <code>for x in xs</code>.',
      '<code>for i in 1..v.len()</code> is empty when the slice has fewer than 2 items. The bigger of two numbers minus the smaller is their gap.',
    ],
    hints: [
      'Keep a running best and compare each item with the one before it: <code>v[i]</code> and <code>v[i - 1]</code>.',
      'An <code>if ... else ...</code> expression can pick the larger one first, so the subtraction is never negative.',
      'In <code>double_all</code>, <code>for x in xs</code> gives mutable references: use <code>*x *= 2</code>.',
    ],
    inCpp: {
      code: `#include <span>
int max_gap(std::span<const int> v);
void double_all(std::span<int> xs);`,
      note: 'The signatures match the C++ idiom of <code>span</code>. In Rust the borrow checker also guarantees the caller\'s data outlives the call.',
    },
    cppStd: 20,
    starter: `fn max_gap(v: &[i32]) -> i32 {
    // largest difference between neighbours
    0
}

fn double_all(xs: &mut [i32]) {
    // double every item in place
}`,
    solution: `fn max_gap(v: &[i32]) -> i32 {
    let mut best = 0;
    for i in 1..v.len() {
        let gap = if v[i] > v[i - 1] { v[i] - v[i - 1] } else { v[i - 1] - v[i] };
        if gap > best {
            best = gap;
        }
    }
    best
}

fn double_all(xs: &mut [i32]) {
    for x in xs {
        *x *= 2;
    }
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", max_gap(&[1, 5, 2]));
    println!("\\n@@TEST 2@@");
    let empty: Vec<i32> = Vec::new();
    println!("{}", max_gap(&empty));
    println!("\\n@@TEST 3@@");
    let arr = [9, 1, 2, 4, 3];
    println!("{}", max_gap(&arr[1..]));
    println!("\\n@@TEST 4@@");
    let mut v = vec![1, 2, 3, 4];
    double_all(&mut v[1..3]);
    println!("{:?}", v);
    println!("\\n@@TEST 5@@");
    double_all(&mut v);
    println!("{:?}", v);
}`,
    tests: [
      { name: 'Slice of an array literal', input: '[1, 5, 2]', expected: '4' },
      { name: 'Empty vector', input: '(empty)', expected: '0' },
      { name: 'Part of an array', input: '&arr[1..]', expected: '2' },
      { name: 'Double part of a vector', input: '&mut v[1..3]', expected: '[1, 4, 6, 4]' },
      { name: 'Double the whole vector', input: '&mut v', expected: '[2, 8, 12, 8]' },
    ],
  },

  // 21. String versus &str
  {
    id: 'r2-string-vs-str',
    title: 'String and &str, properly',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        `<p>Stage 1 said that <code>&amp;str</code> is "text I can look at but not change" and <code>String</code> is text that owns its characters. Now the details make sense. A <code>String</code> is the <em>owner</em> of heap text and frees it when dropped. A <code>&amp;str</code> is a <em>slice of text</em>: a borrowed view, just a position and a length, into text owned by someone else. A string literal such as <code>"hello"</code> is a <code>&amp;str</code> that views text stored inside the program itself, which lives for the whole run.</p>`,
        `<p>You can borrow a view of a <code>String</code> the same way you slice a <code>Vec</code>: <code>&amp;s[0..5]</code> is a <code>&amp;str</code> of the first five bytes. And <code>&amp;s</code>, a <code>&amp;String</code>, converts automatically to <code>&amp;str</code> when passed to a function that expects one, the same trick that turns <code>&amp;Vec&lt;i32&gt;</code> into <code>&amp;[i32]</code>.</p>`,
        `<p>So write read-only text parameters as <code>&amp;str</code>, not <code>&amp;String</code>. A <code>&amp;str</code> parameter accepts a literal, a whole String (<code>&amp;name</code>) and part of one (<code>&amp;name[0..3]</code>). A <code>&amp;String</code> parameter refuses literals. The relationship is the same as <code>std::string_view</code> against <code>const std::string&amp;</code> in C++.</p>`,
        `<p>Because a <code>&amp;str</code> view borrows, all the borrow rules apply: while you hold a view into a String, the String cannot be changed or dropped. That is the guarantee <code>string_view</code> does not give you, and the reason a dangling <code>string_view</code> is a classic C++ bug.</p>`,
      ],
      examples: [
        {
          code: `fn text_len(s: &str) -> usize {          // &str accepts all three callers below
    s.len()
}

fn main() {
    let owned = String::from("hello world");
    println!("{}", text_len("literal"));       // a literal is already a &str
    println!("{}", text_len(&owned));          // &String converts to &str
    println!("{}", text_len(&owned[0..5]));    // a view of part of the String
}`,
          output: '7\n11\n5',
        },
        {
          code: `fn main() {
    let owned = String::from("hello world");
    let word = &owned[6..];          // a &str viewing "world"; owned is borrowed
    println!("{}", word);
    println!("{}", owned);           // reading owned again is fine: both are readers
}`,
          output: 'world\nhello world',
        },
      ],
      terms: [
        { code: 'String', meaning: 'owns heap text and frees it when dropped' },
        { code: '&str', meaning: 'a borrowed view of text: a position and a length' },
        { code: '&s[0..5]', meaning: 'a &str viewing bytes 0 to 4 of s' },
        { code: 'fn f(s: &str)', meaning: 'the right type for read-only text: takes literals, &String and views' },
      ],
    },
    task: '<code>count_letters</code> takes a <code>&amp;String</code>, so the call with a literal is rejected. Change the parameter type so the program prints <code>5</code> twice.',
    cppStd: 17,
    compare: {
      cpp: { code: `size_t count(std::string_view s) {
    return s.size();
}
std::string owned = "hello";
count("world");
count(owned);`, outcome: 'Accepts literals and strings', ok: true },
      rust: { code: `fn count(s: &str) -> usize {
    s.len()
}
let owned = String::from("hello");
count("world");
count(&owned);`, outcome: 'Accepts literals and Strings', ok: true },
      text: 'The pairing is <code>&amp;str</code> with <code>std::string_view</code> and <code>String</code> with <code>std::string</code>. A <code>&amp;str</code> cannot dangle, because the compiler keeps the viewed String alive and unchanged.',
    },
    refresher: [
      '<code>String</code> owns text; <code>&amp;str</code> is a borrowed view. <code>&amp;s</code> and <code>&amp;s[a..b]</code> both give a <code>&amp;str</code>.',
      'Write read-only text parameters as <code>&amp;str</code>.',
    ],
    hints: [
      'A string literal has the type <code>&amp;str</code>. Which parameter type accepts both a literal and a <code>&amp;String</code>?',
      'Change <code>&amp;String</code> to <code>&amp;str</code> in the function signature.',
    ],
    inCpp: {
      code: `std::string_view v;
{
    std::string tmp = "short-lived";
    v = tmp;
}   // v now dangles`,
      note: 'C++ lets a <code>string_view</code> outlive its string. Rust refuses that at compile time.',
    },
    starter: `fn count_letters(s: &String) -> usize {
    s.len()
}

fn main() {
    let owned = String::from("hello");
    println!("{}", count_letters(&owned));
    println!("{}", count_letters("world"));
}`,
    solution: `fn count_letters(s: &str) -> usize {
    s.len()
}

fn main() {
    let owned = String::from("hello");
    println!("{}", count_letters(&owned));
    println!("{}", count_letters("world"));
}`,
    require: [{ pattern: 'count_letters\\s*\\(\\s*"world"\\s*\\)', message: 'Keep the call with the literal "world"' }],
    tests: [{ name: 'Prints 5 twice', expected: '5\n5' }],
  },

  // 22. Bytes and characters
  {
    id: 'r2-utf8-chars',
    title: 'Bytes and characters',
    kind: 'concept',
    introduces: ['chars-bytes', 'count-method', 'byte-literal'],
    teach: {
      body: [
        `<p>Rust text is always UTF-8, the same encoding most C++ programs use for <code>std::string</code>. Each character takes one to four bytes: English letters take one, <code>é</code> takes two, and an emoji takes four. So the number of bytes and the number of characters can differ. <code>s.len()</code>, which you have used, counts <em>bytes</em>.</p>`,
        `<p>To walk through characters, use <code>s.chars()</code>: <code>for c in s.chars() { ... }</code> gives each character as a <code>char</code>. To count them, write <code>s.chars().count()</code>. To walk through the raw bytes, use <code>s.bytes()</code>, which gives each one as a <code>u8</code>. <code>s.as_bytes()</code> borrows all the bytes at once as a slice <code>&amp;[u8]</code>, which you can index like any slice: <code>bytes[0]</code>. (<code>.chars()</code> and <code>.bytes()</code> produce something you can loop over, called an <em>iterator</em>. Stage 3 explains iterators properly. Here, only use them in a <code>for</code> loop or with <code>.count()</code>.)</p>`,
        `<p>A byte value like 97 is not pleasant to write, so Rust has <em>byte literals</em>: <code>b'a'</code> is the <code>u8</code> value of the ASCII letter a (97). You compare bytes with them: <code>bytes[i] == b' '</code> asks whether a byte is a space.</p>`,
        `<p>Slicing text, <code>&amp;s[a..b]</code>, uses <em>byte</em> positions, and both ends must fall between characters. Cutting in the middle of a character panics at run time, with a message that says so. That is also why Rust has no <code>s[0]</code>: the next lessons come back to it.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let s = String::from("héllo");        // é takes two bytes
    println!("{} {}", s.len(), s.chars().count());   // bytes, then characters
    for c in s.chars() {                  // one char per pass
        println!("{}", c);
    }
}`,
          output: '6 5\nh\né\nl\nl\no',
        },
        {
          code: `fn main() {
    let word = "abc";
    let bytes = word.as_bytes();          // a &[u8] view of the bytes
    println!("{} {}", bytes[0], bytes[0] == b'a');   // b'a' is the byte value 97
    for b in word.bytes() {               // one u8 per pass
        println!("{}", b);
    }
}`,
          output: '97 true\n97\n98\n99',
        },
      ],
      terms: [
        { code: 's.len()', meaning: 'the number of bytes in the text' },
        { code: 's.chars()', meaning: 'the characters in order; loop over them, or add .count()' },
        { code: 's.bytes()', meaning: 'the bytes in order, each a u8' },
        { code: 's.as_bytes()', meaning: 'a borrowed slice &[u8] of all the bytes, indexable' },
        { code: "b'a'", meaning: 'a byte literal: the u8 value of an ASCII character' },
      ],
    },
    task: 'Print the number of bytes and the number of characters of <code>s</code> on one line. It should print <code>6 5</code>.',
    compare: {
      cpp: { code: `std::string s = "h\\xc3\\xa9llo";   // héllo in UTF-8
std::cout << s.size();            // 6 bytes`, outcome: 'size() counts bytes only', ok: true },
      rust: { code: `let s = String::from("héllo");
println!("{} {}", s.len(), s.chars().count());`, outcome: 'Prints 6 5', ok: true },
      text: '<code>std::string</code> is a byte array in C++ and knows nothing about characters. Rust keeps <code>len</code> as bytes and gives you <code>chars()</code> for characters.',
    },
    refresher: [
      '<code>s.len()</code> counts bytes. <code>s.chars().count()</code> counts characters.',
      '<code>b\'a\'</code> is a byte literal (a <code>u8</code>). <code>s.as_bytes()</code> is a <code>&amp;[u8]</code> you can index.',
    ],
    hints: [
      'One <code>println!</code> with two <code>{}</code> placeholders.',
      'The second value is <code>s.chars().count()</code>.',
    ],
    inCpp: {
      code: `std::string s = "h\\xc3\\xa9llo";
char c = s[1];   // half of a character`,
      note: 'C++ indexing gives you a byte, even in the middle of a character. Rust makes you choose bytes or characters explicitly.',
    },
    starter: `fn main() {
    let s = String::from("héllo");
    println!("{}", s.len());
}`,
    solution: `fn main() {
    let s = String::from("héllo");
    println!("{} {}", s.len(), s.chars().count());
}`,
    require: [{ pattern: 'chars\\s*\\(\\s*\\)', message: 'Use chars()' }],
    tests: [{ name: 'Prints 6 5', expected: '6 5' }],
  },

  // 23. predict utf8
  {
    id: 'r2-predict-utf8',
    title: 'Bytes versus characters',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      'Rust strings are UTF-8. <code>len()</code> counts bytes; <code>chars()</code> walks characters.',
      '<code>&amp;s[a..b]</code> slices by byte positions. The ends must fall between characters.',
    ],
    inCpp: {
      code: `std::string s = "héllo";
std::cout << s.size();   // 6
std::cout << s[1];       // half of é`,
      note: '<code>std::string</code> is a byte array too, but nothing stops you from indexing into the middle of a character. Rust checks the boundary and panics.',
    },
    rounds: [
      {
        snippet: `fn main() {
    let s = String::from("héllo");
    println!("{} {}", s.len(), s.chars().count());
}`,
        choices: ['5 5', '6 5', '6 6'],
        answer: 1,
        why: '<code>é</code> takes two bytes in UTF-8, so there are 6 bytes and 5 characters.',
        output: '6 5',
      },
      {
        snippet: `fn main() {
    let s = String::from("héllo");
    println!("{}", &s[0..1]);
    println!("{}", &s[0..2]);
}`,
        choices: ['Prints h then hé', 'Prints h, then panics', 'Compile error'],
        answer: 1,
        why: 'Bytes 0..1 are the whole letter <code>h</code>. Byte 2 is in the middle of <code>é</code>, which is a run-time panic, not a compile error.',
        panic: true,
        output: 'end byte index 2 is not a char boundary; it is inside \'é\' (bytes 1..3 of string)',
      },
    ],
  },

  // 24. fix: string index
  {
    id: 'r2-fix-string-index',
    title: 'Why word[0] does not compile',
    kind: 'fix',
    introduces: [],
    task: 'Change the code so it prints the first character, <code>r</code>.',
    errorCode: 'E0277',
    gloss: 'A <code>String</code> cannot be indexed by a single integer, because one position may be only part of a character.',
    refresher: [
      'A range is allowed: <code>&amp;word[0..1]</code> is a <code>&amp;str</code> of the first byte, which is the whole letter for ASCII text.',
      '<code>for c in word.chars()</code> walks the characters one at a time.',
    ],
    hints: [
      'The error names the problem: a single integer is not allowed as a String index. What is?',
      'Borrow a slice of one byte instead: a range from 0 up to 1.',
    ],
    inCpp: {
      code: `std::string word = "rust";
char first = word[0];   // a byte`,
      note: 'In C++ <code>word[0]</code> is always a byte. Rust makes you choose between a byte slice and characters.',
    },
    starter: `fn main() {
    let word = String::from("rust");
    let first = word[0];
    println!("{}", first);
}`,
    solution: `fn main() {
    let word = String::from("rust");
    let first = &word[0..1];
    println!("{}", first);
}`,
    require: [{ pattern: 'String::from\\(\\s*"rust"\\s*\\)', message: 'Keep the String "rust".' }],
    forbidden: [{ pattern: '["\']r["\']', message: 'Take the letter from word instead of typing it.' }],
    tests: [{ name: 'Prints r', expected: 'r' }],
  },

  // 25. implement: first_word and vowels
  {
    id: 'r2-str-functions',
    title: 'Functions over &str',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>first_word</code>: the part of the text before the first space (all of it if there is none). Write <code>vowels</code>: how many of <code>a e i o u</code> the text contains.',
    refresher: [
      '<code>let bytes = s.as_bytes();</code> then <code>bytes[i] == b\' \'</code> finds a space. <code>&amp;s[..i]</code> is the text before position <code>i</code>.',
      'A function that takes one <code>&amp;str</code> may return a <code>&amp;str</code> that views the same text. <code>for c in s.chars()</code> walks characters.',
      'A match arm can list options: <code>\'a\' | \'e\' =&gt; ...</code>, with <code>_ =&gt; {}</code> for the rest.',
    ],
    hints: [
      'Loop over the positions of <code>bytes</code>. At the first space, <code>return &amp;s[..i]</code>.',
      'If the loop finds no space, the whole text is the first word: end the function with <code>s</code>.',
      'In <code>vowels</code>, count only lowercase ASCII vowels. A <code>match</code> on each character is enough.',
    ],
    cppStd: 17,
    inCpp: {
      code: `std::string_view first_word(std::string_view s);
size_t vowels(std::string_view s);`,
      note: 'Both take a <code>string_view</code> in C++ and a <code>&amp;str</code> in Rust. In Rust the returned view is checked to stay inside the caller\'s text.',
    },
    starter: `fn first_word(s: &str) -> &str {
    // the text before the first space
    s
}

fn vowels(s: &str) -> usize {
    // number of a, e, i, o, u
    0
}`,
    solution: `fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for i in 0..bytes.len() {
        if bytes[i] == b' ' {
            return &s[..i];
        }
    }
    s
}

fn vowels(s: &str) -> usize {
    let mut n = 0;
    for c in s.chars() {
        match c {
            'a' | 'e' | 'i' | 'o' | 'u' => n += 1,
            _ => {}
        }
    }
    n
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", first_word("hello world"));
    println!("\\n@@TEST 2@@");
    println!("{}", first_word("single"));
    println!("\\n@@TEST 3@@");
    let owned = String::from("ab cd ef");
    println!("{}", first_word(&owned));
    println!("\\n@@TEST 4@@");
    println!("{}", vowels("education"));
    println!("\\n@@TEST 5@@");
    println!("{}", vowels("rhythm"));
    println!("\\n@@TEST 6@@");
    println!("{}", vowels("héllo wörld"));
}`,
    tests: [
      { name: 'Two words', input: 'hello world', expected: 'hello' },
      { name: 'One word', input: 'single', expected: 'single' },
      { name: 'Owned String', input: '&owned', expected: 'ab' },
      { name: 'Vowels in a word', input: 'education', expected: '5' },
      { name: 'No vowels', input: 'rhythm', expected: '0' },
      { name: 'Non-ASCII letters', input: 'héllo wörld', expected: '1' },
    ],
  },

  // 26. Lifetimes
  {
    id: 'r2-lifetime-longest',
    title: 'When you must write \'a',
    kind: 'concept',
    introduces: ['lifetime'],
    teach: {
      body: [
        `<p>Every reference has a <em>lifetime</em>: the stretch of the program during which it is valid. The compiler tracks it for every reference, and usually you never see it. It only asks for your help in one situation: a function returns a reference, and there is more than one reference parameter, so it cannot tell which input the result points into. That was the <code>E0106</code> "missing lifetime specifier" error.</p>`,
        `<p>The fix is to write the relationship down using a <em>lifetime parameter</em>. A lifetime name starts with an apostrophe, by convention <code>'a</code>. Declare it in angle brackets after the function name, <code>fn longest&lt;'a&gt;</code>, and use it after the <code>&amp;</code> of the references it connects: <code>&amp;'a str</code>. The signature <code>fn longest&lt;'a&gt;(x: &amp;'a str, y: &amp;'a str) -&gt; &amp;'a str</code> reads: "the result lives no longer than both <code>x</code> and <code>y</code>". The compiler then checks every call: the result must not be used after either input is gone.</p>`,
        `<p>Lifetime labels change nothing about what the program does at run time. They are a description of how inputs and outputs relate, so the compiler can check the callers. A label only on some parameters makes a statement too: if the result comes from <code>x</code> only, tie the result to <code>x</code> and leave <code>y</code> alone. For a single reference in and a single reference out, Rust fills the label in for you, which is why you could write <code>fn first_word(s: &amp;str) -&gt; &amp;str</code> without one.</p>`,
        `<p>There is one special lifetime, <code>'static</code>, for references that are valid for the whole run, such as string literals. You may see <code>&amp;'static str</code> in the wild.</p>`,
      ],
      examples: [
        {
          code: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {   // result lives as long as both inputs
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let a = String::from("short");
    let b = String::from("longer");
    println!("{}", longest(&a, &b));
}`,
          output: 'longer',
        },
        {
          code: `fn first<'a>(x: &'a str, y: &str) -> &'a str {   // the result is tied to x only
    println!("ignoring {}", y);
    x
}

fn main() {
    println!("{}", first("abc", "zz"));
}`,
          output: 'ignoring zz\nabc',
          caption: 'y has no label, because the result never points into it.',
        },
      ],
      terms: [
        { code: "'a", meaning: 'a lifetime name: a label for how long some references are valid' },
        { code: "fn f<'a>(...)", meaning: 'declares a lifetime parameter named a' },
        { code: "&'a str", meaning: 'a reference whose lifetime is a' },
        { code: "'static", meaning: 'valid for the whole run, like a string literal' },
      ],
    },
    task: 'Make this compile and print <code>longer</code>, by naming a lifetime on <code>longest</code>.',
    compare: {
      cpp: {
        code: `const std::string& longest(const std::string& a,
                           const std::string& b) {
    return a.size() > b.size() ? a : b;
}`,
        outcome: 'Compiles; the caller must keep both alive',
        ok: true,
      },
      rust: {
        code: `fn longest(a: &str, b: &str) -> &str {
    if a.len() > b.len() { a } else { b }
}`,
        outcome: 'Error: which input does it borrow from?',
        ok: false,
        errorCode: 'E0106',
      },
      text: 'With one input reference Rust infers the output\'s lifetime; with two it cannot tell which one you return. <code>\'a</code> says that the result is valid only while both inputs are.',
    },
    refresher: [
      'A lifetime is a label on a reference: <code>fn f&lt;\'a&gt;(x: &amp;\'a str) -&gt; &amp;\'a str</code>.',
      'It changes nothing at run time. It tells the compiler how the output relates to the inputs.',
    ],
    hints: [
      'Declare a lifetime name in angle brackets after the function name.',
      'Put the same label after the <code>&amp;</code> on both parameters and on the return type.',
    ],
    inCpp: {
      code: `const std::string& longest(const std::string& a, const std::string& b) {
    return a.size() > b.size() ? a : b;
}
std::string_view bad() {
    return longest(std::string("short"), std::string("longer"));
}   // the temporaries are already dead`,
      note: 'C++ trusts the caller to keep the arguments alive, so this compiles. Rust turns that trust into a compile-time rule through <code>\'a</code>.',
    },
    starter: `fn longest(a: &str, b: &str) -> &str {
    if a.len() > b.len() { a } else { b }
}

fn main() {
    println!("{}", longest("short", "longer"));
}`,
    solution: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

fn main() {
    println!("{}", longest("short", "longer"));
}`,
    require: [{ pattern: 'longest\\s*<\\s*\'a\\s*>', message: 'Declare the lifetime: longest<\'a>' }],
    tests: [{ name: 'Prints longer', expected: 'longer' }],
  },

  // 27. predict: lifetimes
  {
    id: 'r2-predict-lifetimes',
    title: 'Does the result live long enough?',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      'With <code>\'a</code> on both inputs, the result must not be used after either input is dropped.',
      'Two reference inputs and a reference output need a written lifetime; one input does not.',
    ],
    inCpp: {
      code: `const std::string& longest(const std::string& a, const std::string& b);
std::string first = "long string";
const std::string* result;
{
    std::string second = "short";
    result = &longest(first, second);
}   // result may now point at a dead string`,
      note: 'C++ compiles this and leaves the bug to run time. Rust refuses to compile the matching program.',
    },
    rounds: [
      {
        snippet: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

fn main() {
    let first = String::from("long string");
    let result = {
        let second = String::from("short");
        longest(&first, &second)
    };
    println!("{}", result);
}`,
        choices: ['Prints long string', 'Error: second does not live long enough', 'Error: missing lifetime specifier'],
        answer: 1,
        why: '<code>result</code> may point at either input, so it must not outlive <code>second</code>. Here <code>second</code> is dropped at the inner brace but <code>result</code> is used after it.',
        errorCode: 'E0597',
        output: `error[E0597]: \`second\` does not live long enough
  --> src/main.rs:9:25
   |
 7 |     let result = {
   |         ------ borrow later stored here
 8 |         let second = String::from("short");
   |             ------ binding \`second\` declared here
 9 |         longest(&first, &second)
   |                         ^^^^^^^ borrowed value does not live long enough
10 |     };
   |     - \`second\` dropped here while still borrowed

error: aborting due to 1 previous error

For more information about this error, try \`rustc --explain E0597\`.`,
      },
      {
        snippet: `fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

fn main() {
    let first = String::from("long string");
    let second = String::from("short");
    let result = longest(&first, &second);
    println!("{}", result);
}`,
        choices: ['Prints long string', 'Error: second does not live long enough', 'Error: missing lifetime specifier'],
        answer: 0,
        why: 'Both inputs live until the end of <code>main</code>, which is longer than the last use of <code>result</code>, so the borrow checker is satisfied.',
        output: 'long string',
      },
    ],
  },

  // 28. Two mutable parts at once
  {
    id: 'r2-split-at-mut',
    title: 'Two mutable parts at once',
    kind: 'concept',
    introduces: ['slice-swap'],
    teach: {
      body: [
        `<p>Suppose you want to read one element of a vector and write another. You might try <code>let a = &amp;mut v[0]; let b = &amp;mut v[2];</code>. The compiler rejects it with the two-writers error. It cannot see that position 0 and position 2 are different elements; to it, both borrow all of <code>v</code> mutably. The rule "one writer at a time" is checked on whole variables, not on indices it would have to compute.</p>`,
        `<p>There are tools for this. <code>v.swap(i, j)</code> swaps the elements at two positions in one call. And <code>v.split_at_mut(mid)</code> hands you two <em>non-overlapping</em> mutable slices at once: <code>left</code> holds the elements before position <code>mid</code>, <code>right</code> holds the rest. Since the two slices cover different elements, there are two writers but no overlap, and the compiler accepts it because the library function proves it. Each slice is indexed from 0 on its own.</p>`,
        `<p>The function returns the two slices as a tuple, which you take apart with <code>let (left, right) = ...</code> exactly as you did with tuples in stage 1.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let mut v = vec![1, 2, 3, 4];
    v.swap(0, 3);                            // swap the elements at positions 0 and 3
    println!("{:?}", v);
    let (left, right) = v.split_at_mut(2);   // left is [4, 2], right is [3, 1]
    left[0] = right[0];                      // v[0] = v[2], through two separate slices
    println!("{:?}", v);                     // the slices are finished, so v is usable
}`,
          output: '[4, 2, 3, 1]\n[3, 2, 3, 1]',
        },
      ],
      terms: [
        { code: 'v.swap(i, j)', meaning: 'swaps the elements at positions i and j' },
        { code: 'v.split_at_mut(mid)', meaning: 'two non-overlapping mutable slices: positions before mid, and from mid on' },
        { code: 'let (a, b) = ...', meaning: 'takes the two slices out of the returned tuple' },
      ],
    },
    task: 'Copy the first item of the right half into the first slot of the left half, so it prints <code>[3, 2, 3, 4]</code>. Use <code>split_at_mut</code>.',
    compare: {
      cpp: {
        code: `std::vector<int> v{1, 2, 3, 4};
int* a = &v[0];
int* b = &v[2];
*a = *b;   // fine, no check`,
        outcome: 'Compiles; you vouch for no overlap',
        ok: true,
      },
      rust: {
        code: `let mut v = vec![1, 2, 3, 4];
let a = &mut v[0];
let b = &mut v[2];
*a = *b;`,
        outcome: 'Error: second mutable borrow of v',
        ok: false,
        errorCode: 'E0499',
      },
      text: 'The compiler cannot see that <code>v[0]</code> and <code>v[2]</code> are different items. <code>split_at_mut</code> hands out two non-overlapping halves, which is proof it can check.',
    },
    refresher: [
      '<code>let (left, right) = v.split_at_mut(2);</code> splits at index 2: <code>left</code> is <code>v[..2]</code>, <code>right</code> is <code>v[2..]</code>.',
      'Both halves are <code>&amp;mut [i32]</code> and are indexed from 0. <code>v.swap(i, j)</code> swaps two elements.',
    ],
    hints: [
      'Split the vector first, then index each half separately.',
      '<code>right[0]</code> is <code>v[2]</code>, and <code>left[0]</code> is <code>v[0]</code>.',
    ],
    inCpp: {
      code: `void f(std::vector<int>& v) {
    std::swap(v[0], v[2]);   // two references into one vector
}`,
      note: 'C++ lets two references into one vector coexist. Rust offers <code>v.swap(0, 2)</code> and <code>split_at_mut</code> for the cases the compiler cannot verify itself.',
    },
    starter: `fn main() {
    let mut v = vec![1, 2, 3, 4];
    let a = &mut v[0];
    let b = &mut v[2];
    *a = *b;
    println!("{:?}", v);
}`,
    solution: `fn main() {
    let mut v = vec![1, 2, 3, 4];
    let (left, right) = v.split_at_mut(2);
    left[0] = right[0];
    println!("{:?}", v);
}`,
    require: [
      { pattern: 'vec!\\s*\\[\\s*1\\s*,\\s*2\\s*,\\s*3\\s*,\\s*4\\s*\\]', message: 'Keep the vector [1, 2, 3, 4].' },
      { pattern: 'split_at_mut', message: 'Use split_at_mut.' },
    ],
    tests: [{ name: 'Prints [3, 2, 3, 4]', expected: '[3, 2, 3, 4]' }],
  },

  // 29. Cannot move out of a Vec by index (E0507)
  {
    id: 'r2-fix-move-out-of-vec',
    title: 'Taking a String out of a Vec',
    kind: 'fix',
    introduces: ['mem-fns', 'vec-remove'],
    teach: {
      body: [
        `<p>With a <code>Vec&lt;String&gt;</code>, <code>let first = names[0];</code> does not compile: "cannot move out of index of <code>Vec</code>" (<code>E0507</code>). Indexing gives you a place <em>inside</em> the vector, and moving the String out of it would leave a hole: a slot with no valid String in it. When the vector is later dropped it would try to free that slot again. Rust refuses, where C++ would let you <code>std::move</code> the element and leave an empty-but-valid string behind.</p>`,
        `<p>You have several honest options. Borrow it: <code>&amp;names[0]</code> only looks. Clone it: <code>names[0].clone()</code> makes a copy. Or take it out and say what takes its place. <code>std::mem::take(&amp;mut names[0])</code> moves the value out and leaves the type's empty default behind (an empty String, an empty Vec, or 0). <code>std::mem::replace(&amp;mut names[0], other)</code> does the same but leaves the value you choose. Both need a <code>&amp;mut</code>, so the vector must be <code>let mut</code>. They live in the module <code>std::mem</code>; <code>use std::mem;</code> lets you write just <code>mem::take</code>.</p>`,
        `<p>If you want the element out of the vector for good, use <code>names.swap_remove(0)</code>: it removes the item at position 0 and returns it, filling the gap by moving the <em>last</em> item into it (fast, but the order changes). <code>names.remove(0)</code> shifts everything after it left by one (order kept, but slower for large vectors).</p>`,
      ],
      examples: [
        {
          code: `use std::mem;

fn main() {
    let mut names = vec![String::from("ada"), String::from("bob")];
    let first = mem::take(&mut names[0]);   // moves "ada" out, leaves an empty String
    println!("{:?} {:?}", first, names);
}`,
          output: '"ada" ["", "bob"]',
        },
        {
          code: `fn main() {
    let mut names = vec![String::from("ada"), String::from("bob"), String::from("cy")];
    let removed = names.swap_remove(0);   // the last item fills the gap
    println!("{} {:?}", removed, names);
    let next = names.remove(0);           // the rest shift left
    println!("{} {:?}", next, names);
}`,
          output: 'ada ["cy", "bob"]\ncy ["bob"]',
        },
      ],
      terms: [
        { code: 'mem::take(&mut x)', meaning: 'moves the value out of x and leaves its empty default behind' },
        { code: 'mem::replace(&mut x, y)', meaning: 'moves the value out of x and puts y in its place' },
        { code: 'v.swap_remove(i)', meaning: 'removes and returns item i; the last item fills the gap' },
        { code: 'v.remove(i)', meaning: 'removes and returns item i; later items shift left' },
      ],
    },
    task: 'Make it compile and print <code>ada</code>. Try to take the String out of the vector rather than copy it.',
    errorCode: 'E0507',
    gloss: 'Indexing a vector gives a place inside it, and you cannot move out of that place without leaving a hole.',
    refresher: [
      '<code>std::mem::take(&amp;mut v[0])</code> moves the value out and leaves a default (here an empty String) in its place.',
      '<code>v.swap_remove(0)</code> removes the item by moving the last one into the gap. <code>.clone()</code> also compiles, but it copies the text.',
    ],
    hints: [
      'The vector must stay valid, so something has to be left in slot 0 or the slot must be removed.',
      'Look at the refresher: two functions each take an item out. Which one needs the least change to this code?',
      'These functions take <code>&amp;mut</code>, so the vector has to be declared mutable.',
    ],
    inCpp: {
      code: `std::vector<std::string> names{"ada", "bob"};
std::string first = std::move(names[0]);
// names[0] is valid but empty`,
      note: 'C++ moves out of an element and leaves it in a valid-but-unspecified state, which you must remember. Rust makes you say what replaces it.',
    },
    starter: `fn main() {
    let mut names = vec![String::from("ada"), String::from("bob")];
    let first = names[0];
    names.push(String::from("cy"));
    println!("{}", first);
}`,
    solution: `fn main() {
    let mut names = vec![String::from("ada"), String::from("bob")];
    let first = std::mem::take(&mut names[0]);
    names.push(String::from("cy"));
    println!("{}", first);
}`,
    require: [
      { pattern: 'String::from\\(\\s*"ada"\\s*\\)', message: 'Keep "ada" in the vector.' },
      { pattern: 'names\\.push\\(', message: 'Keep the push.' },
    ],
    tests: [{ name: 'Prints ada', expected: 'ada' }],
  },

  // 30. Box
  {
    id: 'r2-box',
    title: 'Box: one owner on the heap',
    kind: 'concept',
    introduces: ['box'],
    teach: {
      body: [
        `<p>A <code>Box</code> puts one value on the heap and owns it. <code>Box::new(5)</code> allocates space for the number 5 on the heap and gives you a box that points at it. It is Rust's <code>std::unique_ptr</code> (made with <code>std::make_unique</code>): one owner, freed when the owner goes out of scope, never null. The type is written <code>Box&lt;i32&gt;</code>.</p>`,
        `<p>To reach the value inside, dereference with <code>*</code>, as with a pointer: <code>*a + 1</code>. Printing with <code>{}</code> and calling methods work through the box without writing the star. A <code>Box</code> follows the ownership rules like any other owner. In particular it <em>moves</em> on assignment, even though a plain <code>i32</code> would be copied: the box owns heap memory, so there must be only one owner.</p>`,
        `<p>You will not need <code>Box</code> often at first, since plain values and <code>Vec</code> already live where they should. Its famous job is making <em>recursive types</em>: a type that contains itself, like a list node that holds the next node. Without a pointer in between, such a type would have infinite size. A <code>Box</code> has a fixed size (one pointer), so it breaks the cycle. Stage 3 teaches the pieces you need for that, and stage 5 builds a linked list and trees with it.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = Box::new(5);        // the number 5 lives on the heap; a owns it
    println!("{}", *a + 1);     // * reaches the value inside the box
    let b = a;                  // a Box moves, unlike a plain i32
    println!("{}", b);
}`,
          output: '6\n5',
        },
      ],
      terms: [
        { code: 'Box::new(x)', meaning: 'puts x on the heap and returns the owner, a Box' },
        { code: 'Box<i32>', meaning: 'the type "box holding an i32"' },
        { code: '*b', meaning: 'the value inside the box' },
      ],
    },
    task: 'This does not compile. Add the two boxed numbers by dereferencing them, so it prints <code>7</code>.',
    compare: {
      cpp: {
        code: `auto a = std::make_unique<int>(5);
auto b = std::move(a);   // a is now null
std::cout << *b;`,
        outcome: 'Prints 5; using a would crash',
        ok: true,
      },
      rust: {
        code: `let a = Box::new(5);
let b = a;
println!("{}", a);`,
        outcome: 'Error: a was moved',
        ok: false,
        errorCode: 'E0382',
      },
      text: 'After a move, a <code>unique_ptr</code> is null and still usable, so a bad dereference is a run-time crash. In Rust a moved <code>Box</code> cannot be used at all.',
    },
    refresher: [
      '<code>Box::new(x)</code> puts <code>x</code> on the heap. <code>*b</code> reads through it, as with a pointer.',
      'A <code>Box</code> moves instead of copying, as in <code>unique_ptr</code>.',
    ],
    hints: [
      'Arithmetic is defined for <code>i32</code> and not for <code>Box&lt;i32&gt;</code>.',
      'Use the dereference operator on each box before adding.',
    ],
    starter: `fn main() {
    let a = Box::new(3);
    let b = Box::new(4);
    let total: i32 = a + b;
    println!("{}", total);
}`,
    solution: `fn main() {
    let a = Box::new(3);
    let b = Box::new(4);
    let total: i32 = *a + *b;
    println!("{}", total);
}`,
    require: [{ pattern: '\\*\\s*a\\s*\\+\\s*\\*\\s*b', message: 'Add the dereferenced values: *a + *b' }],
    tests: [{ name: 'Prints 7', expected: '7' }],
  },

  // 31. Rc
  {
    id: 'r2-rc',
    title: 'Rc: shared ownership',
    kind: 'concept',
    introduces: ['rc'],
    teach: {
      body: [
        `<p>Rule two says one value has one owner. Occasionally that is wrong for the problem: in a graph, several nodes may point to the same node, and none of them is "the" owner. For that, Rust offers <code>Rc</code>, a reference-counted pointer, the same idea as <code>std::shared_ptr</code>. Bring it in with <code>use std::rc::Rc;</code>.</p>`,
        `<p><code>Rc::new(x)</code> wraps a value and starts a counter at 1. <code>Rc::clone(&amp;a)</code> makes another handle to the <em>same</em> value and adds 1 to the counter. It does not copy the data, so it is cheap, unlike <code>.clone()</code> on a String. Each handle is an owner. When a handle is dropped the counter goes down, and when it reaches zero the value is dropped. <code>Rc::strong_count(&amp;a)</code> tells you the current count.</p>`,
        `<p>There is a catch: an <code>Rc</code> only hands out shared, read-only access. Many owners and mutation together would break the one-writer rule. You can read through it (<code>a.len()</code>, printing with <code>{}</code>) but not change it. The next lesson shows the tool for that. Also, <code>Rc</code> is for one thread only; sharing across threads uses <code>Arc</code>, which is out of scope here.</p>`,
      ],
      examples: [
        {
          code: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    println!("{}", Rc::strong_count(&a));            // one owner
    let b = Rc::clone(&a);                           // a second owner of the same String
    println!("{} {}", b, Rc::strong_count(&a));
    {
        let c = Rc::clone(&a);                       // a third owner, inside these braces
        println!("{} {}", c, Rc::strong_count(&a));
    }                                                // c is dropped here: the count falls
    println!("{}", Rc::strong_count(&a));
}`,
          output: '1\nshared 2\nshared 3\n2',
        },
      ],
      terms: [
        { code: 'use std::rc::Rc;', meaning: 'makes the name Rc available' },
        { code: 'Rc::new(x)', meaning: 'wraps x in a counted pointer; the count starts at 1' },
        { code: 'Rc::clone(&a)', meaning: 'another handle to the same value; the count goes up, no data is copied' },
        { code: 'Rc::strong_count(&a)', meaning: 'how many handles exist right now' },
      ],
    },
    task: 'Make <code>b</code> a second owner of the same String as <code>a</code>, so the program prints <code>shared 2</code>.',
    compare: {
      cpp: {
        code: `auto a = std::make_shared<std::string>("x");
a->push_back('y');   // shared_ptr lets anyone write`,
        outcome: 'Compiles; any holder may mutate',
        ok: true,
      },
      rust: {
        code: `use std::rc::Rc;
let a = Rc::new(String::from("x"));
a.push('y');`,
        outcome: 'Error: cannot mutate inside an Rc',
        ok: false,
        errorCode: 'E0596',
      },
      text: '<code>Rc</code> is shared ownership by counting, like <code>shared_ptr</code> but single-threaded, and it only hands out read access. A <code>shared_ptr</code> lets every holder write, which is a data race waiting to happen.',
    },
    refresher: [
      '<code>Rc::clone(&amp;a)</code> copies the pointer and bumps the count, not the data.',
      'Use <code>Rc</code> only when one owner will not do. It costs a counter.',
    ],
    hints: [
      'The print uses a variable <code>b</code> that does not exist yet.',
      'Create it with <code>Rc::clone(&amp;a)</code>.',
    ],
    starter: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    // make a second owner b
    println!("{} {}", b, Rc::strong_count(&a));
}`,
    solution: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    let b = Rc::clone(&a);
    println!("{} {}", b, Rc::strong_count(&a));
}`,
    require: [{ pattern: 'Rc::clone\\(\\s*&\\s*a\\s*\\)', message: 'Use Rc::clone(&a)' }],
    tests: [{ name: 'Prints shared 2', expected: 'shared 2' }],
  },

  // 32. RefCell
  {
    id: 'r2-refcell',
    title: 'RefCell: checked at run time',
    kind: 'concept',
    introduces: ['refcell'],
    teach: {
      body: [
        `<p>A <code>Rc</code> shares a value but never lets you change it. <code>RefCell</code> is the missing piece: it lets you change a value that you only hold through a shared handle. The borrow rule still applies (many readers or one writer), but <code>RefCell</code> checks it while the program runs instead of while compiling. Make one with <code>RefCell::new(value)</code> after <code>use std::cell::RefCell;</code>.</p>`,
        `<p>To read, call <code>.borrow()</code>. To write, call <code>.borrow_mut()</code> and dereference the result: <code>*c.borrow_mut() += 1;</code>. Each call hands out a temporary guard that gives the borrow back when it goes out of scope. If you break the rule, for example by holding two <code>borrow_mut()</code> guards at once, the program panics with "already borrowed". The mistake is not caught early; it becomes a crash at run time. That is the price.</p>`,
        `<p>The usual combination is <code>Rc&lt;RefCell&lt;T&gt;&gt;</code>: many owners, each able to change the value. Use it only when the shape of your data really needs it, such as graphs where many nodes share one node. Most code needs neither, because plain ownership and borrowing are checked for free at compile time.</p>`,
      ],
      examples: [
        {
          code: `use std::cell::RefCell;

fn main() {
    let c = RefCell::new(5);        // no mut needed: the RefCell allows the change
    *c.borrow_mut() += 1;           // write through a temporary guard
    println!("{}", c.borrow());     // read through another
}`,
          output: '6',
        },
        {
          code: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let list = Rc::new(RefCell::new(vec![1]));
    let other = Rc::clone(&list);       // two owners of one Vec
    other.borrow_mut().push(2);         // either owner may change it
    list.borrow_mut().push(3);
    println!("{:?} {}", list.borrow(), Rc::strong_count(&list));
}`,
          output: '[1, 2, 3] 2',
          caption: 'Two owners, both writing, one after the other.',
        },
      ],
      terms: [
        { code: 'RefCell::new(x)', meaning: 'a cell that allows changing x through a shared handle' },
        { code: 'c.borrow()', meaning: 'a read guard; checked at run time' },
        { code: 'c.borrow_mut()', meaning: 'a write guard; panics if another guard is alive' },
        { code: 'Rc<RefCell<T>>', meaning: 'many owners, each able to change the value' },
      ],
    },
    task: 'Add 5 to the shared number through <code>b</code> so the program prints <code>5 2</code>.',
    compare: {
      cpp: {
        code: `auto a = std::make_shared<int>(0);
auto b = a;   // count is now 2
*b += 5;
std::cout << *a << " " << a.use_count();`,
        outcome: 'Prints 5 2',
        ok: true,
      },
      rust: {
        code: `use std::cell::RefCell;
use std::rc::Rc;
let a = Rc::new(RefCell::new(0));
let b = Rc::clone(&a);
*b.borrow_mut() += 5;
println!("{} {}", a.borrow(), Rc::strong_count(&a));`,
        outcome: 'Prints 5 2',
        ok: true,
      },
      text: 'A <code>shared_ptr</code> hands out mutable access freely, and two writers are your problem. <code>RefCell</code> turns that into a checked borrow that panics instead of corrupting data.',
    },
    refresher: [
      '<code>c.borrow()</code> reads and <code>*c.borrow_mut() += n</code> writes. Two live <code>borrow_mut()</code> guards panic with <code>RefCell already borrowed</code>.',
      'A guard is released when it goes out of scope, which for a one-line use is the end of the statement.',
    ],
    hints: [
      '<code>b</code> is an <code>Rc</code> of a <code>RefCell</code>. Which <code>RefCell</code> method gives write access?',
      'The result of that method is a guard; dereference it with <code>*</code> to add.',
    ],
    starter: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let a = Rc::new(RefCell::new(0));
    let b = Rc::clone(&a);
    println!("{} {}", a.borrow(), Rc::strong_count(&a));
}`,
    solution: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let a = Rc::new(RefCell::new(0));
    let b = Rc::clone(&a);
    *b.borrow_mut() += 5;
    println!("{} {}", a.borrow(), Rc::strong_count(&a));
}`,
    require: [{ pattern: 'Rc::clone\\(\\s*&\\s*a\\s*\\)', message: 'Keep b as a clone of the Rc.' }],
    tests: [{ name: 'Prints 5 2', expected: '5 2' }],
  },

  // 33. predict: RefCell and Rc
  {
    id: 'r2-predict-refcell',
    title: 'Rc and RefCell at run time',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      '<code>RefCell</code> checks the borrow rule at run time: a second <code>borrow_mut()</code> while a guard is alive panics.',
      'Dropping an <code>Rc</code> handle lowers the count by one.',
    ],
    inCpp: {
      code: `auto c = std::make_shared<int>(1);
int& a = *c;
int& b = *c;   // two writers: compiles and runs`,
      note: 'C++ accepts two writers without any check. <code>RefCell</code> checks at run time and stops the program with a clear message.',
    },
    rounds: [
      {
        snippet: `use std::cell::RefCell;

fn main() {
    let c = RefCell::new(1);
    let a = c.borrow_mut();
    let b = c.borrow_mut();
    println!("{} {}", a, b);
}`,
        choices: ['Prints 1 1', 'Does not compile', 'Panics at run time'],
        answer: 2,
        why: 'The compiler cannot see the problem. At run time the second <code>borrow_mut()</code> finds the first guard still alive and panics.',
        panic: true,
        output: 'RefCell already borrowed',
      },
      {
        snippet: `use std::rc::Rc;

fn main() {
    let a = Rc::new(10);
    let b = Rc::clone(&a);
    drop(b);
    println!("{}", Rc::strong_count(&a));
}`,
        choices: ['2', '1', 'Does not compile'],
        answer: 1,
        why: '<code>drop(b)</code> drops that handle, so the count goes back from 2 to 1.',
        output: '1',
      },
    ],
  },
]
