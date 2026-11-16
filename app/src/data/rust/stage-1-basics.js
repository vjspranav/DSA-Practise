// Rust lessons: stage 1, Rust from zero (the learner knows C++ but has never written Rust).
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end) and docs/superpowers/specs/rust-lesson-examples.js.
// Check with: node scripts/verify-rust.mjs --stage 1
// Ids must start with r1- and be unique across the track. Every piece of syntax a lesson uses must be introduced
// (`introduces`, ids from src/rust/syntax.js) by that lesson or an earlier one; the checker enforces it.

export const LESSONS = [
  // 1. fn main, println!, string literals, ;, comments
  {
    id: 'r1-hello-main',
    title: 'Hello, main',
    kind: 'concept',
    introduces: ['fn-main', 'println', 'print-macro', 'string-literal', 'semicolon', 'comment'],
    teach: {
      body: [
        '<p>A Rust program is a collection of <em>functions</em>, and the one that runs first is called <code>main</code>. You write it as <code>fn main() { ... }</code>. <code>fn</code> means "function", the empty parentheses <code>()</code> mean it takes no input, and everything between the curly braces <code>{ }</code> is what it does. It is the same idea as <code>int main()</code> in C++.</p>',
        '<p>To show text on the screen, write <code>println!("some text");</code>. The text sits between double quotes, which is called a <em>string literal</em>. <code>println!</code> prints the text and then moves to a new line. There is no <code>#include</code> and no <code>std::cout</code>: it is always available.</p>',
        '<p>The <code>!</code> at the end of <code>println!</code> means it is a <em>macro</em>, not an ordinary function. For now, treat any name ending in <code>!</code> as a macro. Macros are checked while the program is being built, so a mistake in the text you give <code>println!</code> is a compile error, not a surprise when the program runs.</p>',
        '<p>Every instruction ends with a semicolon <code>;</code>, as in C++. Two slashes <code>//</code> start a comment that runs to the end of the line. The compiler ignores comments, so use them to explain your code. By convention, code inside braces is indented by four spaces.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    // this line is a comment: the compiler ignores it\n    println!("Hello, Rust!"); // print the text, then start a new line\n}',
          output: 'Hello, Rust!',
          caption: 'The smallest useful program.',
        },
        {
          code: 'fn main() {\n    print!("Hello, "); // print! does not start a new line\n    println!("Rust"); // println! does\n    println!("Two lines now"); // the next text starts on a fresh line\n}',
          output: 'Hello, Rust\nTwo lines now',
          caption: 'print! and println! differ only in the newline.',
        },
      ],
      terms: [
        { code: 'fn main() { ... }', meaning: 'the function where the program starts; the code goes between the braces' },
        { code: 'println!("text")', meaning: 'prints the text and a newline; the ! marks it as a macro' },
        { code: 'print!("text")', meaning: 'prints the text without a newline' },
        { code: '"text"', meaning: 'a string literal: text between double quotes' },
        { code: ';', meaning: 'ends an instruction' },
        { code: '// note', meaning: 'a comment: ignored by the compiler' },
      ],
    },
    task: 'Make this program print <code>Hello, Rust</code> on one line.',
    compare: {
      cpp: { code: `#include <iostream>
int main() {
    std::cout << "Hello\\n";
}`, outcome: 'Prints Hello', ok: true },
      rust: { code: `fn main() {
    println!("Hello");
}`, outcome: 'Prints Hello', ok: true },
      text: 'Execution starts at <code>fn main</code>, as in C++, and instructions end with a semicolon. Printing needs no header and no <code>std::cout</code>: call the print macro (<code>println!</code>).',
    },
    refresher: [
      '<code>fn main() { ... }</code> is the entry point. Statements end with <code>;</code>.',
      '<code>println!("text");</code> prints a line. <code>//</code> starts a comment.',
    ],
    hints: [
      'The body of <code>main</code> is empty. What prints a line?',
      'Write the macro name, then parentheses around a quoted string, then <code>;</code>.',
    ],
    inCpp: {
      code: `printf("%d\\n", "oops");   // compiles, undefined behaviour`,
      note: 'C++ does not require the compiler to check <code>printf</code> formats, and many only warn. The format macros, including <code>println!</code>, are checked as part of compilation.',
    },
    starter: `fn main() {
    // print the greeting
}`,
    solution: `fn main() {
    println!("Hello, Rust");
}`,
    require: [{ pattern: 'println!\\s*\\(', message: 'Use println!' }],
    tests: [{ name: 'Prints Hello, Rust', expected: 'Hello, Rust' }],
  },

  // 2. let and {} placeholders
  {
    id: 'r1-variables',
    title: 'Variables and printing values',
    kind: 'concept',
    introduces: ['let', 'placeholder-display'],
    teach: {
      body: [
        '<p>A <em>variable</em> gives a name to a value. In Rust you create one with <code>let</code>: <code>let x = 5;</code> reads "let x be 5". You do not write a type like <code>int</code>; Rust works out that 5 is a whole number by itself. Names use <code>lower_snake_case</code> by convention.</p>',
        '<p>To print a value, put a <code>{}</code> placeholder in the text and pass the value after the text, separated by a comma: <code>println!("x is {}", x);</code>. Each <code>{}</code> is replaced by the next value, from left to right. The number of <code>{}</code> must equal the number of values, and the compiler checks it. This does the job of <code>%d</code> in <code>printf</code> or the <code>&lt;&lt;</code> chain in <code>cout</code>, but in one place.</p>',
        '<p><code>{}</code> means "show this value the way a person would want to read it". Numbers and text work. Other kinds of values need a different placeholder, which a later lesson introduces.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let x = 5;                 // create a variable x holding 5\n    println!("x is {}", x);    // {} is replaced by the value of x\n}',
          output: 'x is 5',
        },
        {
          code: 'fn main() {\n    let name = "Ada";\n    let age = 36;\n    // two placeholders, two values: name fills the first {}, age the second\n    println!("{} is {} years old", name, age);\n}',
          output: 'Ada is 36 years old',
          caption: 'Several placeholders are filled in order.',
        },
      ],
      terms: [
        { code: 'let x = 5;', meaning: 'creates a variable named x holding 5; the type is worked out for you' },
        { code: '{}', meaning: 'a placeholder inside a println! text, replaced by the next value' },
        { code: 'println!("{}", x)', meaning: 'the values come after the text, separated by commas' },
      ],
    },
    task: 'Print both variables on one line, exactly like <code>a is 3 and b is 4</code>.',
    compare: {
      cpp: { code: `int x = 5;
std::cout << "x is " << x << "\\n";`, outcome: 'Prints x is 5', ok: true },
      rust: { code: `let x = 5;
println!("x is {}", x);`, outcome: 'Prints x is 5', ok: true },
      text: 'C++ chains the pieces together with <code>&lt;&lt;</code>. Rust writes the whole sentence once with <code>{}</code> holes and checks that holes and values match.',
    },
    refresher: [
      '<code>let a = 3;</code> creates a variable. <code>{}</code> in a <code>println!</code> text is replaced by the next value you pass.',
      'Values go after the text, separated by commas, in the order the <code>{}</code> appear.',
    ],
    hints: [
      'The text needs two <code>{}</code>, one for each number.',
      'After the text, list <code>a</code> then <code>b</code>, separated by a comma.',
    ],
    starter: `fn main() {
    let a = 3;
    let b = 4;
    // print: a is 3 and b is 4
}`,
    solution: `fn main() {
    let a = 3;
    let b = 4;
    println!("a is {} and b is {}", a, b);
}`,
    require: [{ pattern: '\\{\\}[^{]*\\{\\}', message: 'Use two {} placeholders' }],
    tests: [{ name: 'Prints a is 3 and b is 4', expected: 'a is 3 and b is 4' }],
  },

  // 3. let is immutable; mut
  {
    id: 'r1-let-mut',
    title: 'let and mut',
    kind: 'concept',
    introduces: ['mut'],
    teach: {
      body: [
        '<p>A Rust variable cannot change by default. After <code>let score = 10;</code>, writing <code>score = 20;</code> is a compile error. C++ is the other way round: variables can change unless you write <code>const</code>.</p>',
        '<p>To allow changes, add <code>mut</code> (short for "mutable"): <code>let mut score = 10;</code>. After that, <code>score = 20;</code> is allowed. Notice that the second line has no <code>let</code>: it changes the variable that already exists, it does not make a new one.</p>',
        '<p>Why does Rust do this? When you read code, every variable without <code>mut</code> is guaranteed to keep its value, so you only need to watch the ones marked <code>mut</code>. The compiler also warns you if you wrote <code>mut</code> but never changed the variable.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let mut score = 10;          // mut: this variable may change\n    println!("score is {}", score);\n    score = 20;                  // no let: change the existing variable\n    println!("score is now {}", score);\n}',
          output: 'score is 10\nscore is now 20',
        },
        {
          code: 'fn main() {\n    let mut a = 1;   // a can change\n    let b = 2;       // b cannot\n    a = b;           // copy the value of b into a\n    println!("{} {}", a, b);\n}',
          output: '2 2',
          caption: 'Assigning copies the value. Only the variable on the left needs mut.',
        },
      ],
      terms: [
        { code: 'let mut x = 1;', meaning: 'a variable that is allowed to change later' },
        { code: 'x = 2;', meaning: 'assigns a new value to an existing variable (no let, and x must be mut)' },
      ],
    },
    task: 'Swap <code>a</code> and <code>b</code> using a third variable <code>tmp</code>, then print them. It should print <code>2 1</code>.',
    compare: {
      cpp: { code: `int x = 5;
x = 6;
const int y = 5;
// y = 6;  would not compile`, outcome: 'Mutable unless you write const', ok: true },
      rust: { code: `let x = 5;
x = 6;`, outcome: 'Error: assign twice to immutable', ok: false, errorCode: 'E0384' },
      text: 'C++ variables are mutable unless you write <code>const</code>. Rust flips the default: a <code>let</code> binding is read-only until you write <code>let mut</code>.',
    },
    refresher: [
      '<code>let mut n = 0;</code> allows <code>n = 1;</code> later. Without <code>mut</code>, assignment is a compile error.',
      '<code>println!("{} {}", a, b)</code> fills two placeholders in order.',
    ],
    hints: [
      'Which variables does the swap change?',
      'Mark the ones that change with <code>mut</code>. <code>tmp</code> can be a plain <code>let</code>.',
    ],
    inCpp: {
      code: `const int limit = 10;   // opt in to read-only
int count = 0;          // mutable by default`,
      note: 'In C++ you opt in to immutability with <code>const</code>. In Rust you opt in to mutation with <code>mut</code>, so a change to a variable is visible in its declaration.',
    },
    starter: `fn main() {
    let a = 1;
    let b = 2;
    // swap a and b with a third variable
    println!("{} {}", a, b);
}`,
    solution: `fn main() {
    let mut a = 1;
    let mut b = 2;
    let tmp = a;
    a = b;
    b = tmp;
    println!("{} {}", a, b);
}`,
    require: [{ pattern: 'let\\s+mut\\s+a', message: 'Declare a with mut' }, { pattern: 'let\\s+mut\\s+b', message: 'Declare b with mut' }],
    tests: [{ name: 'Prints 2 1', expected: '2 1' }],
  },

  // 4. numbers
  {
    id: 'r1-numbers',
    title: 'Numbers and arithmetic',
    kind: 'concept',
    introduces: ['int-types', 'float', 'type-annotation', 'arithmetic'],
    teach: {
      body: [
        '<p>Whole numbers come in several sizes. The name says which: a letter for signed or unsigned, then the number of bits. <code>i32</code> is a signed 32-bit integer (it can be negative) and is what you get when you write a number without saying more. <code>i64</code> is bigger. <code>u8</code> and <code>u32</code> are unsigned (never negative). <code>usize</code> is an unsigned integer as big as a memory address; lengths and positions use it, so you will meet it constantly. In C++, <code>int</code> and <code>long</code> change size between platforms. Here the size is in the name, so there is nothing to guess.</p>',
        '<p>You can state a variable\'s type by writing a colon and the type after its name: <code>let n: i64 = 5;</code>. This is called a <em>type annotation</em>. It is often optional because Rust infers the type, but it is how you pick a non-default one.</p>',
        '<p>Decimal numbers use <code>f64</code> (a 64-bit floating-point number, like C++ <code>double</code>). A literal such as <code>3.5</code> is an <code>f64</code>, and one that should be a decimal needs the dot: write <code>7.0</code>, not <code>7</code>.</p>',
        '<p>Arithmetic is <code>+ - * / %</code>. With integers, <code>/</code> throws away the fraction (17 / 5 is 3) and <code>%</code> gives the remainder (17 % 5 is 2). Both sides of an operator must have the same type: Rust will not add an <code>i32</code> to an <code>i64</code> or to an <code>f64</code> for you. The next lessons show how to convert.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let a: i32 = 17;\n    let b: i32 = 5;\n    println!("{}", a + b);   // add: 22\n    println!("{}", a - b);   // subtract: 12\n    println!("{}", a * b);   // multiply: 85\n    println!("{}", a / b);   // divide: 3 (the fraction is dropped)\n    println!("{}", a % b);   // remainder: 2\n}',
          output: '22\n12\n85\n3\n2',
        },
        {
          code: 'fn main() {\n    let small: u8 = 200;         // unsigned 8 bits: 0 to 255\n    let big: i64 = 3000000000;   // too large for an i32, so use i64\n    let count: usize = 4;        // the type of lengths and positions\n    let ratio: f64 = 7.0 / 2.0;  // decimals use f64\n    println!("{} {} {} {}", small, big, count, ratio);\n}',
          output: '200 3000000000 4 3.5',
          caption: 'Each variable states its type after a colon.',
        },
      ],
      terms: [
        { code: 'i32, i64', meaning: 'signed integers of 32 and 64 bits; i32 is the default' },
        { code: 'u8, u32, usize', meaning: 'unsigned integers; usize is the type of lengths and positions' },
        { code: 'f64', meaning: 'a decimal number (like C++ double)' },
        { code: 'let n: i64 = 5;', meaning: 'a type annotation: the type after a colon' },
        { code: '+ - * / %', meaning: 'arithmetic; integer / drops the fraction, % is the remainder' },
      ],
    },
    task: 'Share <code>total</code> among <code>people</code> with whole-number division. Print how many each gets, then how many are left over, on one line: <code>3 2</code>.',
    compare: {
      cpp: { code: `int a = 1;
long b = 2;
// widths depend on the platform`, outcome: 'Width of int and long varies', ok: true },
      rust: { code: `let a: i32 = 1;
let b: u64 = 2;
// the width is in the name`, outcome: 'i32 is always 32 bits', ok: true },
      text: 'Rust integer types carry their size: <code>i8 i16 i32 i64 i128</code> signed and <code>u8</code> to <code>u128</code> unsigned. <code>usize</code> is pointer-sized and is the type of lengths and indices, like <code>size_t</code>.',
    },
    refresher: [
      '<code>17 / 5</code> is 3 and <code>17 % 5</code> is 2 for integers. An integer literal with no other clue is an <code>i32</code>.',
      '<code>usize</code> is for lengths and indices, <code>f64</code> for decimals.',
    ],
    hints: [
      'One <code>println!</code> with two <code>{}</code> placeholders.',
      'The first value is <code>total / people</code>, the second is <code>total % people</code>.',
    ],
    inCpp: {
      code: `std::cout << sizeof(int);   // 4 on common platforms, not guaranteed
std::cout << sizeof(long);  // 4 or 8 depending on the platform`,
      note: 'C++ has fixed-width types too, but plain <code>int</code> and <code>long</code> are what most code reaches for. In Rust only the sized names exist, so there is nothing to guess.',
    },
    starter: `fn main() {
    let total: i32 = 17;
    let people: i32 = 5;
    // print how many each person gets, then how many are left over
}`,
    solution: `fn main() {
    let total: i32 = 17;
    let people: i32 = 5;
    println!("{} {}", total / people, total % people);
}`,
    require: [{ pattern: '/', message: 'Divide' }, { pattern: '%', message: 'Take the remainder' }],
    tests: [{ name: 'Prints 3 2', expected: '3 2' }],
  },

  // 5. fix E0384
  {
    id: 'r1-fix-assign-twice',
    title: 'Assigning twice',
    kind: 'fix',
    introduces: [],
    task: 'The compiler rejects this. Change it so it prints <code>100</code> and then <code>80</code>.',
    errorCode: 'E0384',
    gloss: '<code>price</code> was declared without <code>mut</code>, so the assignment on line 4 is not allowed.',
    refresher: [
      'A <code>let</code> binding cannot be assigned to again unless it is <code>let mut</code>.',
      'Writing <code>let</code> again makes a brand-new variable; it does not assign to the old one.',
    ],
    hints: [
      'Read the compiler help: it points at the line where <code>price</code> is created.',
      'Say on that line that the variable is allowed to change.',
    ],
    inCpp: {
      code: `int price = 100;
price = price - 20;   // fine: variables are mutable`,
      note: 'The same lines are valid C++ because variables are mutable by default. Rust makes you say <code>mut</code> when you declare the variable.',
    },
    starter: `fn main() {
    let price = 100;
    println!("{}", price);
    price = price - 20;
    println!("{}", price);
}`,
    solution: `fn main() {
    let mut price = 100;
    println!("{}", price);
    price = price - 20;
    println!("{}", price);
}`,
    require: [{ pattern: 'price\\s*-\\s*20', message: 'Keep the subtraction of 20' }],
    tests: [{ name: 'Prints 100 then 80', expected: '100\n80' }],
  },

  // 6. fix E0308 + as
  {
    id: 'r1-fix-mixed-ints',
    title: 'No silent conversions',
    kind: 'fix',
    introduces: ['as-cast'],
    teach: {
      body: [
        '<p>Rust never converts between number types behind your back. C++ will quietly turn an <code>int</code> into a <code>long</code>, a <code>double</code> into an <code>int</code>, or a negative number into an unsigned one, sometimes losing information. In Rust, giving an <code>i32</code> to something that wants an <code>i64</code> is a compile error, even though every <code>i32</code> fits.</p>',
        '<p>When you want a conversion, you write it with <code>as</code>: <code>n as i64</code> means "take the value of <code>n</code> and make it an <code>i64</code>". It works between all the number types.</p>',
        '<p>Widening (a small type into a bigger one) never changes the value. Narrowing can: <code>300 as u8</code> keeps only the low 8 bits and gives 44, and <code>7.9 as i32</code> drops the fraction and gives 7 (it does not round). So whenever you see <code>as</code>, ask whether information can be lost. <code>as</code> binds tighter than <code>/</code>, so <code>a as f64 / b as f64</code> converts both first.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let small: i32 = 21;\n    let wide: i64 = small as i64;   // widening: the value stays 21\n    println!("{}", wide * 2);\n}',
          output: '42',
        },
        {
          code: 'fn main() {\n    let big: i32 = 300;\n    let small = big as u8;   // narrowing: keeps only the low 8 bits\n    let x: f64 = 7.9;\n    let y = x as i32;        // drops the fraction, does not round\n    println!("{} {}", small, y);\n}',
          output: '44 7',
          caption: 'Narrowing conversions can lose information.',
        },
        {
          code: 'fn main() {\n    let total: i32 = 7;\n    let people: i32 = 2;\n    // convert both to f64 first, so the division keeps its fraction\n    println!("{}", total as f64 / people as f64);\n}',
          output: '3.5',
        },
      ],
      terms: [
        { code: 'n as i64', meaning: 'converts the value n to type i64 (also works between integers and f64)' },
      ],
    },
    task: 'This does not compile. Change it so it prints <code>42</code>.',
    errorCode: 'E0308',
    gloss: '<code>wide</code> is an <code>i64</code> but <code>n</code> is an <code>i32</code>, and Rust never converts between integer types silently.',
    refresher: [
      '<code>value as T</code> converts a number to type <code>T</code>. Widening keeps the value; narrowing keeps only the low bits.',
      'There are no implicit numeric conversions in Rust, not even <code>i32</code> to <code>i64</code>.',
    ],
    hints: [
      'Compare the type written on the <code>wide</code> line with the type of <code>n</code>.',
      'Convert the value where it is used, with <code>as</code>.',
    ],
    inCpp: {
      code: `int n = 21;
long long wide = n;      // implicit widening
unsigned char c = 300;   // implicit narrowing`,
      note: 'C++ converts between arithmetic types implicitly, including lossy ones. In Rust every conversion is written with <code>as</code>, so it is visible in the code.',
    },
    starter: `fn main() {
    let n: i32 = 21;
    let wide: i64 = n;
    println!("{}", wide * 2);
}`,
    solution: `fn main() {
    let n: i32 = 21;
    let wide: i64 = n as i64;
    println!("{}", wide * 2);
}`,
    require: [{ pattern: 'let\\s+wide\\s*:\\s*i64', message: 'Keep wide as an i64' }],
    tests: [{ name: 'Prints 42', expected: '42' }],
  },

  // 7. overflow
  {
    id: 'r1-overflow',
    title: 'Overflow',
    kind: 'concept',
    introduces: ['path-sep', 'int-limits', 'method-call', 'int-methods'],
    teach: {
      body: [
        '<p>Every integer type has limits. A <code>u8</code> holds 0 to 255. You can ask for the limits with <code>u8::MAX</code> and <code>i8::MIN</code>. The double colon <code>::</code> reaches inside a type or module to find something that belongs to it, a bit like <code>std::numeric_limits&lt;T&gt;::max()</code> in C++.</p>',
        '<p>What happens when a result does not fit? In C++, signed overflow is undefined behaviour and unsigned overflow wraps around silently. Rust has no silent case: when the compiler can see the overflow it refuses to build the program, and otherwise a <em>debug</em> build stops the program with a message (a "panic": "attempt to add with overflow"). A release build wraps around. Panicking in debug is deliberate, because an overflow is nearly always a bug.</p>',
        '<p>When you really do want a particular behaviour, say so with a method. A method is a function that belongs to a value, called with a dot: <code>a.wrapping_add(10)</code>. <code>wrapping_add</code> wraps around past the limit. <code>saturating_add</code> stops at the limit. (There is also <code>checked_add</code>, which reports overflow with a special value called an Option. Options come later.)</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    println!("{}", u8::MAX);    // the largest u8\n    println!("{}", i8::MIN);    // the smallest i8\n    println!("{}", i16::MAX);   // the largest i16\n}',
          output: '255\n-128\n32767',
        },
        {
          code: 'fn main() {\n    let a: u8 = 250;\n    println!("{}", a.wrapping_add(10));     // 260 wraps around to 4\n    println!("{}", a.saturating_add(10));   // stops at the maximum, 255\n}',
          output: '4\n255',
          caption: 'The method name says what happens at the limit.',
        },
      ],
      terms: [
        { code: 'u8::MAX', meaning: 'the largest value of the type; :: reaches something that belongs to a type' },
        { code: 'a.wrapping_add(10)', meaning: 'a method call: adds, and wraps around at the limit' },
        { code: 'a.saturating_add(10)', meaning: 'adds, and stops at the limit instead of passing it' },
      ],
    },
    task: 'Print <code>a</code> plus 10 two ways, one per line: wrapping first, then saturating. It should print <code>4</code> then <code>255</code>.',
    compare: {
      cpp: { code: `int x = INT_MAX;
x = x + 1;   // undefined behaviour`, outcome: 'Signed overflow is undefined behaviour', ok: true },
      rust: { code: `let x: u8 = 255;
let y = x + 1;
println!("{}", y);`, outcome: 'Compile error: will overflow', ok: false },
      text: 'Signed overflow in C++ is undefined behaviour, and unsigned overflow wraps without a word. Rust is never silent: the compiler rejects overflow it can see, and a debug build panics on the rest.',
    },
    refresher: [
      '<code>wrapping_add</code> wraps around, <code>saturating_add</code> sticks at the maximum. A plain <code>+</code> that overflows panics in debug builds.',
      '<code>T::MAX</code> and <code>T::MIN</code> are the limits of an integer type.',
    ],
    hints: [
      'Each method is called on the number: <code>a.method(10)</code>.',
      'Two <code>println!</code> lines, each with one <code>{}</code>.',
    ],
    inCpp: {
      code: `unsigned char c = 250;
c += 10;        // wraps to 4, defined
int x = INT_MAX;
x += 1;         // undefined behaviour`,
      note: 'Signed overflow in C++ is undefined behaviour, so the compiler may assume it never happens; unsigned wraps. Rust has one rule, panic in debug, and a method for each intent.',
    },
    starter: `fn main() {
    let a: u8 = 250;
    // print a + 10 wrapping, then saturating
}`,
    solution: `fn main() {
    let a: u8 = 250;
    println!("{}", a.wrapping_add(10));
    println!("{}", a.saturating_add(10));
}`,
    require: [
      { pattern: 'wrapping_add', message: 'Use wrapping_add' },
      { pattern: 'saturating_add', message: 'Use saturating_add' },
    ],
    tests: [{ name: 'Prints 4 then 255', expected: '4\n255' }],
  },

  // 8. if / else, comparisons, && || !
  {
    id: 'r1-if-else',
    title: 'if, else and conditions',
    kind: 'concept',
    introduces: ['if-else', 'comparison', 'bool', 'logical-ops', 'not-op'],
    teach: {
      body: [
        '<p><code>if</code> runs a block only when a condition is true. Write the condition with no parentheses, but always use braces: <code>if x &gt; 5 { ... }</code>. Add <code>else</code> for the other case, and <code>else if</code> for more conditions. The first one that is true runs.</p>',
        '<p>Conditions are built from comparisons: <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. A comparison produces a <code>bool</code>, a value that is either <code>true</code> or <code>false</code>. You can store a bool in a variable and print it.</p>',
        '<p>Combine conditions with <code>&amp;&amp;</code> (and), <code>||</code> (or) and <code>!</code> (not). Unlike C++, the condition must really be a <code>bool</code>: <code>if n { ... }</code> with a number <code>n</code> is a compile error, so you write <code>if n != 0</code> when that is what you mean.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let temp = 25;\n    if temp > 30 {\n        println!("hot");\n    } else if temp > 15 {   // only checked when the first test was false\n        println!("warm");\n    } else {                // when nothing above was true\n        println!("cold");\n    }\n}',
          output: 'warm',
        },
        {
          code: 'fn main() {\n    let age = 20;\n    let has_ticket = true;\n    let can_enter = age >= 18 && has_ticket;   // && means "and"\n    println!("{}", can_enter);                 // a bool prints as true or false\n    if age < 13 || age > 65 {                  // || means "or"\n        println!("discount");\n    }\n    if !has_ticket {                           // ! means "not"\n        println!("no ticket");\n    }\n}',
          output: 'true',
          caption: 'Only the first println! runs: neither later condition is true.',
        },
      ],
      terms: [
        { code: 'if c { ... } else { ... }', meaning: 'runs the first block when c is true, otherwise the second; no parentheses around c' },
        { code: '== != < > <= >=', meaning: 'comparisons; each gives a bool' },
        { code: 'true, false', meaning: 'the two bool values' },
        { code: '&& || !', meaning: 'and, or, not' },
      ],
    },
    task: 'Print <code>both</code> if <code>n</code> divides by 3 and by 5, otherwise <code>three</code> if it divides by 3, otherwise <code>five</code> if it divides by 5, otherwise <code>none</code>. Here n is 30.',
    compare: {
      cpp: { code: `int n = 5;
if (n) std::cout << "yes";`, outcome: 'Compiles: any number can be a condition', ok: true },
      rust: { code: `let n = 5;
if n {
    println!("yes");
}`, outcome: 'Error: expected bool, found integer', ok: false, errorCode: 'E0308' },
      text: 'C++ treats any number as a condition, which hides mistakes such as <code>if (x = 3)</code>. Rust accepts only a <code>bool</code>, and needs no parentheses and always needs braces.',
    },
    refresher: [
      '<code>n % 3 == 0</code> tests that n divides by 3. <code>&amp;&amp;</code> means and, <code>||</code> means or.',
      '<code>if a { ... } else if b { ... } else { ... }</code> runs the first block whose condition is true.',
    ],
    hints: [
      'Test the "both" case first, with <code>&amp;&amp;</code>.',
      'Chain the other cases with <code>else if</code>, and finish with a plain <code>else</code>.',
    ],
    starter: `fn main() {
    let n = 30;
    // print both, three, five or none
}`,
    solution: `fn main() {
    let n = 30;
    if n % 3 == 0 && n % 5 == 0 {
        println!("both");
    } else if n % 3 == 0 {
        println!("three");
    } else if n % 5 == 0 {
        println!("five");
    } else {
        println!("none");
    }
}`,
    require: [
      { pattern: '&&', message: 'Combine two tests with &&' },
      { pattern: 'else\\s+if', message: 'Use else if' },
    ],
    tests: [{ name: 'Prints both', expected: 'both' }],
  },

  // 9. if is an expression
  {
    id: 'r1-if-expression',
    title: 'if is an expression',
    kind: 'concept',
    introduces: ['if-expression'],
    teach: {
      body: [
        '<p>In C++ an <code>if</code> does things, and the ternary <code>a ? b : c</code> gives a value. Rust has no ternary because <code>if</code> itself gives a value. Each branch is a block, and a block\'s value is its last line when that line has <em>no semicolon</em>. So you can put an <code>if</code> on the right side of a <code>let</code>.</p>',
        '<p>Both branches must produce the same type, and there must be an <code>else</code> (otherwise there would be no value when the condition is false). Remember the <code>;</code> after the closing brace, because the whole <code>let</code> is one instruction.</p>',
        '<p>The semicolon rule is worth pausing on. <code>a * b</code> is an <em>expression</em>: it has a value. <code>a * b;</code> turns it into a <em>statement</em>, which throws the value away. Any block <code>{ ... }</code> can be used as a value in the same way, and you will see this again with functions.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let n = 12;\n    let size = if n > 10 { 100 } else { 1 };   // each branch is a value\n    println!("{}", size);\n}',
          output: '100',
        },
        {
          code: 'fn main() {\n    let total = {\n        let a = 2;\n        let b = 3;\n        a * b   // no semicolon: this is the value of the whole block\n    };\n    println!("{}", total);\n}',
          output: '6',
          caption: 'A block is an expression too.',
        },
      ],
      terms: [
        { code: 'let x = if c { a } else { b };', meaning: 'x gets a when c is true and b otherwise; replaces the C++ ternary' },
        { code: '{ ...; value }', meaning: 'a block whose value is its last line, written without a semicolon' },
      ],
    },
    task: 'Set <code>size</code> to 100 when <code>n</code> is above 10 and to 1 otherwise, using <code>if</code> as an expression. It should print <code>100</code> then <code>1</code>.',
    compare: {
      cpp: { code: `int a = 3;
int b = 7;
int m = a > b ? a : b;`, outcome: 'm is 7', ok: true },
      rust: { code: `let a = 3;
let b = 7;
let m = if a > b { a } else { b };`, outcome: 'm is 7', ok: true },
      text: '<code>if</code> is an expression: each branch is a block whose last expression is its value, so Rust has no ternary operator. Both branches must have the same type.',
    },
    refresher: [
      '<code>{ let a = 2; a * 3 }</code> is a block expression: its value is 6, the last expression without a <code>;</code>.',
      '<code>let v = if c { x } else { y };</code> needs the <code>;</code> after the closing brace.',
    ],
    hints: [
      'Replace the <code>0</code> with an <code>if</code> and an <code>else</code>, each followed by a block.',
      'Each branch is just a number inside braces, with no <code>;</code> after it.',
    ],
    inCpp: {
      code: `int n = 12;
int size;
if (n > 10) size = 100;
else size = 1;`,
      note: 'In C++ <code>if</code> is a statement, so it assigns to a variable declared earlier, or you use <code>?:</code>. In Rust <code>if</code> produces the value directly.',
    },
    starter: `fn main() {
    let n = 12;
    let size = 0; // 100 if n is above 10, otherwise 1
    println!("{}", size);
    let n = 3;
    let size = 0; // same rule again
    println!("{}", size);
}`,
    solution: `fn main() {
    let n = 12;
    let size = if n > 10 { 100 } else { 1 };
    println!("{}", size);
    let n = 3;
    let size = if n > 10 { 100 } else { 1 };
    println!("{}", size);
}`,
    require: [{ pattern: 'let\\s+size\\s*=\\s*if', message: 'Bind size with let size = if ...' }],
    tests: [{ name: 'Prints 100 then 1', expected: '100\n1' }],
  },

  // 10. while
  {
    id: 'r1-while',
    title: 'while loops',
    kind: 'concept',
    introduces: ['while', 'compound-assign'],
    teach: {
      body: [
        '<p><code>while</code> repeats a block as long as its condition is true: <code>while i &lt; 3 { ... }</code>. As with <code>if</code>, there are no parentheses and the braces are required. The condition is checked before every pass, so it may run zero times.</p>',
        '<p>Something inside the loop must eventually make the condition false, usually by changing a variable. That variable has to be <code>mut</code>. To add to it, write <code>i += 1;</code>, which means <code>i = i + 1;</code>. The same shorthand exists for <code>-=</code>, <code>*=</code>, <code>/=</code> and <code>%=</code>. Rust has no <code>i++</code> and no <code>i--</code>.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let mut i = 0;\n    while i < 3 {\n        println!("i is {}", i);\n        i += 1;   // same as i = i + 1; Rust has no i++\n    }\n    println!("done");\n}',
          output: 'i is 0\ni is 1\ni is 2\ndone',
        },
        {
          code: 'fn main() {\n    let mut n = 5;\n    let mut total = 0;\n    while n > 0 {\n        total += n;   // add n to total\n        n -= 1;       // count down\n    }\n    println!("{}", total);\n}',
          output: '15',
          caption: 'Adds 5 + 4 + 3 + 2 + 1.',
        },
      ],
      terms: [
        { code: 'while c { ... }', meaning: 'repeats the block while c is true; no parentheses around c' },
        { code: 'x += 1;', meaning: 'shorthand for x = x + 1; also -= *= /= %=' },
      ],
    },
    task: 'Use a <code>while</code> loop to print <code>10</code>, <code>8</code>, <code>6</code>, <code>4</code>, <code>2</code>, one per line.',
    compare: {
      cpp: { code: `int i = 0;
while (i < 3) {
    i++;
}`, outcome: 'i ends at 3', ok: true },
      rust: { code: `let mut i = 0;
while i < 3 {
    i += 1;
}`, outcome: 'i ends at 3', ok: true },
      text: 'The shape is the same, minus the parentheses. Rust has no <code>++</code> or <code>--</code>, so you write <code>+= 1</code>, and the counter must be declared <code>mut</code>.',
    },
    refresher: [
      '<code>while cond { ... }</code> repeats while the condition holds. <code>n -= 2;</code> subtracts 2 from a <code>mut</code> variable.',
      'The loop variable must be <code>let mut</code>.',
    ],
    hints: [
      'Start a <code>mut</code> variable at 10 and loop while it is above 0.',
      'Print it, then subtract 2 inside the loop.',
    ],
    inCpp: {
      code: `for (int i = 10; i > 0; i -= 2)
    std::cout << i << "\\n";`,
      note: 'In C++ you would reach for a three-part <code>for</code> here. Rust has none, so the same loop is a <code>while</code> or, in the next lesson, a <code>for</code> over a range.',
    },
    starter: `fn main() {
    // print 10 8 6 4 2, one per line
}`,
    solution: `fn main() {
    let mut n = 10;
    while n > 0 {
        println!("{}", n);
        n -= 2;
    }
}`,
    require: [{ pattern: '\\bwhile\\b', message: 'Use while' }],
    tests: [{ name: 'Counts down by two', expected: '10\n8\n6\n4\n2' }],
  },

  // 11. predict overflow (needs while)
  {
    id: 'r1-predict-overflow',
    title: 'What happens at 255?',
    kind: 'predict',
    introduces: [],
    task: 'For each program, pick what you expect, then run it and compare.',
    refresher: [
      'The Playground builds in debug mode, where <code>+</code> on integers checks for overflow.',
      '<code>wrapping_add</code> wraps around at the limit and never panics.',
    ],
    inCpp: {
      code: `unsigned char x = 255;
x = x + 1;
std::cout << (int)x;   // 0`,
      note: 'The unsigned C++ version prints 0 without any complaint. Rust debug builds report the same bug as a panic.',
    },
    rounds: [
      {
        snippet: `fn main() {
    let mut x: u8 = 253;
    let mut i = 0;
    while i < 5 {
        x += 1;
        println!("{}", x);
        i += 1;
    }
}`,
        choices: ['254, 255, then 0, 1, 2', '254, 255, then a panic', 'Does not compile'],
        answer: 1,
        why: '<code>x</code> reaches 255, and the next <code>x += 1</code> does not fit in a <code>u8</code>. A debug build panics instead of wrapping.',
        panic: true,
        output: 'attempt to add with overflow',
      },
      {
        snippet: `fn main() {
    let mut x: u8 = 253;
    let mut i = 0;
    while i < 5 {
        x = x.wrapping_add(1);
        println!("{}", x);
        i += 1;
    }
}`,
        choices: ['254, 255, then 0, 1, 2', '254, 255, then a panic', 'Does not compile'],
        answer: 0,
        why: '<code>wrapping_add</code> goes from 255 around to 0 on purpose, so nothing panics.',
        output: '254\n255\n0\n1\n2',
      },
    ],
  },

  // 12. for over ranges
  {
    id: 'r1-for-ranges',
    title: 'for over ranges',
    kind: 'concept',
    introduces: ['for-in', 'range', 'range-inclusive'],
    teach: {
      body: [
        '<p>Rust has no three-part <code>for (int i = 0; i &lt; n; i++)</code>. Instead, <code>for</code> goes through a sequence of values: <code>for i in 0..5 { ... }</code> runs the block once for each value of <code>i</code>. A <em>range</em> <code>a..b</code> starts at <code>a</code> and stops <em>before</em> <code>b</code>, so <code>0..5</code> is 0, 1, 2, 3, 4. Write <code>a..=b</code> to include the end: <code>1..=5</code> is 1, 2, 3, 4, 5.</p>',
        '<p>The loop creates <code>i</code> itself, afresh on every pass, so it needs no <code>let</code> and no <code>mut</code>. Because there is no condition and no increment to write, the usual off-by-one slips (a wrong <code>&lt;=</code>, a forgotten <code>i++</code>) are gone. If you need an unusual step, a <code>while</code> loop still works.</p>',
        '<p>Later you will use the same <code>for ... in</code> to walk through collections of values, not just ranges.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    for i in 0..3 {       // i is 0, then 1, then 2\n        println!("{}", i);\n    }\n}',
          output: '0\n1\n2',
        },
        {
          code: 'fn main() {\n    for i in 1..=3 {      // ..= includes the last number\n        println!("{} squared is {}", i, i * i);\n    }\n}',
          output: '1 squared is 1\n2 squared is 4\n3 squared is 9',
        },
      ],
      terms: [
        { code: 'for i in 0..n { ... }', meaning: 'runs the block with i = 0, 1, ... n - 1' },
        { code: '0..n', meaning: 'a range that stops before n' },
        { code: '1..=n', meaning: 'a range that includes n' },
      ],
    },
    task: 'Print the squares of 1 through 5, one per line, with a <code>for</code> loop over <code>1..=5</code>.',
    compare: {
      cpp: { code: `for (int i = 0; i < 5; i++) {
    std::cout << i;
}`, outcome: 'Prints 0 to 4', ok: true },
      rust: { code: `for i in 0..5 {
    println!("{}", i);
}`, outcome: 'Prints 0 to 4', ok: true },
      text: 'Rust has no three-part <code>for</code>: it loops over a range, where <code>a..b</code> excludes <code>b</code> and <code>a..=b</code> includes it. The loop variable is created for you on each pass.',
    },
    refresher: [
      '<code>0..3</code> is 0, 1, 2. <code>0..=3</code> is 0, 1, 2, 3.',
      '<code>for i in 1..=5 { ... }</code> binds <code>i</code> afresh on each pass; no <code>mut</code> needed.',
    ],
    hints: [
      'The loop variable is a number you can multiply.',
      'One <code>println!</code> inside the loop body.',
    ],
    inCpp: {
      code: `for (int x : {3, 5, 7}) {
    std::cout << x;
}`,
      note: 'C++ has a range-based <code>for</code> too, but the three-clause counting loop is the habit. In Rust only <code>for x in</code> exists, so an off-by-one lives in the range (<code>0..n</code> or <code>0..=n</code>).',
    },
    starter: `fn main() {
    // print 1 4 9 16 25, one per line
}`,
    solution: `fn main() {
    for i in 1..=5 {
        println!("{}", i * i);
    }
}`,
    require: [{ pattern: 'for\\s+\\w+\\s+in', message: 'Use a for loop' }],
    tests: [{ name: 'Prints squares', expected: '1\n4\n9\n16\n25' }],
  },

  // 13. loop and break value
  {
    id: 'r1-loop-break-value',
    title: 'loop and break value',
    kind: 'concept',
    introduces: ['loop', 'break', 'break-value'],
    teach: {
      body: [
        '<p><code>loop { ... }</code> repeats forever, until something inside executes <code>break</code>. It is what you would write as <code>while (true)</code> in C++, and the compiler knows it only ends through a <code>break</code>. <code>continue</code> skips the rest of the current pass and starts the next one.</p>',
        '<p>Because Rust loves expressions, a <code>loop</code> can hand a value out: <code>break value;</code> ends the loop and makes the whole <code>loop</code> evaluate to that value. So <code>let found = loop { ... break n; ... };</code> stores the answer directly, with no variable declared in advance.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let mut n = 0;\n    loop {\n        n += 1;\n        if n == 2 {\n            continue;   // skip the rest of this pass\n        }\n        if n > 4 {\n            break;      // leave the loop\n        }\n        println!("n is {}", n);\n    }\n}',
          output: 'n is 1\nn is 3\nn is 4',
        },
        {
          code: 'fn main() {\n    let mut n = 50;\n    let found = loop {\n        n += 1;\n        if n % 7 == 0 {\n            break n;   // end the loop and give n as its value\n        }\n    };\n    println!("{}", found);\n}',
          output: '56',
          caption: 'The first multiple of 7 above 50.',
        },
      ],
      terms: [
        { code: 'loop { ... }', meaning: 'repeats until a break' },
        { code: 'break;', meaning: 'leaves the loop' },
        { code: 'continue;', meaning: 'skips to the next pass' },
        { code: 'break value;', meaning: 'leaves the loop and makes the loop expression equal to value' },
      ],
    },
    task: 'Use <code>loop</code> to find the first power of two that is at least 1000 and print it. It should print <code>1024</code>.',
    compare: {
      cpp: { code: `int p = 1;
while (true) {
    if (p >= 100) break;
    p *= 2;
}`, outcome: 'p ends at 128', ok: true },
      rust: { code: `let mut p = 1;
let found = loop {
    if p >= 100 { break p; }
    p *= 2;
};`, outcome: 'found is 128', ok: true },
      text: '<code>loop</code> runs until a <code>break</code>, and <code>break value</code> makes the whole loop evaluate to that value. In C++ a loop is a statement, so the result has to go into a variable declared beforehand.',
    },
    refresher: [
      '<code>loop { ... }</code> repeats until <code>break</code>. <code>let r = loop { break 7; };</code> sets <code>r</code> to 7.',
      '<code>p *= 2;</code> doubles a <code>mut</code> variable.',
    ],
    hints: [
      'Test <code>p</code> inside the loop and leave with a value.',
      'Bind the loop to a variable with <code>let</code>, then print that variable.',
    ],
    inCpp: {
      code: `int found;
int p = 1;
while (true) {
    if (p >= 1000) { found = p; break; }
    p *= 2;
}`,
      note: 'In C++ a loop is a statement, so the result goes into a variable declared beforehand. A Rust <code>loop</code> is an expression and hands the value out itself.',
    },
    starter: `fn main() {
    let mut p = 1;
    // loop until p >= 1000, then print p
}`,
    solution: `fn main() {
    let mut p = 1;
    let found = loop {
        if p >= 1000 {
            break p;
        }
        p *= 2;
    };
    println!("{}", found);
}`,
    require: [
      { pattern: '\\bloop\\s*\\{', message: 'Use loop' },
      { pattern: 'break\\s+[^;\\s]', message: 'Break with a value' },
    ],
    tests: [{ name: 'Prints 1024', expected: '1024' }],
  },

  // 14. labelled break
  {
    id: 'r1-labelled-break',
    title: 'Labelled break',
    kind: 'concept',
    introduces: ['labelled-break'],
    teach: {
      body: [
        '<p>A plain <code>break</code> only leaves the innermost loop. To leave an outer loop from inside an inner one, give the outer loop a <em>label</em>: a name that starts with an apostrophe, followed by a colon, written before the loop, like <code>\'outer: for ...</code>. Then <code>break \'outer;</code> ends that loop from anywhere inside it, and <code>continue \'outer;</code> jumps to its next pass.</p>',
        '<p>In C++ you would need a flag variable, a helper function with <code>return</code>, or <code>goto</code>. The apostrophe is only part of the label syntax here. It is not a character literal.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    \'outer: for i in 1..4 {\n        for j in 1..4 {\n            if j == 2 {\n                continue \'outer;   // jump to the next i\n            }\n            println!("{} {}", i, j);\n        }\n    }\n}',
          output: '1 1\n2 1\n3 1',
        },
        {
          code: 'fn main() {\n    \'outer: for i in 1..10 {\n        for j in 1..10 {\n            if i * j == 42 {\n                println!("{} {}", i, j);\n                break \'outer;   // leaves both loops\n            }\n        }\n    }\n}',
          output: '6 7',
        },
      ],
      terms: [
        { code: "'outer: for ...", meaning: 'puts the label outer on the loop' },
        { code: "break 'outer;", meaning: 'leaves the labelled loop, however deeply nested you are' },
        { code: "continue 'outer;", meaning: 'starts the next pass of the labelled loop' },
      ],
    },
    task: 'Stop all the searching after the first match, so the program prints only <code>6 7</code>.',
    compare: {
      cpp: { code: `bool found = false;
for (int i = 1; i < 10 && !found; i++)
    for (int j = 1; j < 10; j++)
        if (i * j == 42) { found = true; break; }`, outcome: 'Needs a flag to leave both loops', ok: true },
      rust: { code: `'outer: for i in 1..10 {
    for j in 1..10 {
        if i * j == 42 { break 'outer; }
    }
}`, outcome: "break 'outer leaves both loops", ok: true },
      text: "A label such as <code>'outer:</code> names a loop, and <code>break 'outer</code> or <code>continue 'outer</code> acts on that loop from inside a nested one. No flag variable and no <code>goto</code> needed.",
    },
    refresher: [
      "<code>'outer: for ... { ... }</code> puts a label in front of the loop.",
      "<code>break 'outer;</code> leaves the labelled loop, however deep you are.",
    ],
    hints: [
      'The inner <code>break</code> would only leave the inner loop. Which loop must end?',
      'The label is already on the outer loop. Use it with <code>break</code> after the <code>println!</code>.',
    ],
    inCpp: {
      code: `for (int i = 1; i < 10; i++)
    for (int j = 1; j < 10; j++)
        if (i * j == 42) goto done;
done:;`,
      note: 'C++ has no multi-level <code>break</code>; the usual answers are a flag, a helper function that returns, or <code>goto</code>. Rust names the loop instead.',
    },
    starter: `fn main() {
    'outer: for i in 1..10 {
        for j in 1..10 {
            if i * j == 42 {
                println!("{} {}", i, j);
                // stop all the searching here
            }
        }
    }
}`,
    solution: `fn main() {
    'outer: for i in 1..10 {
        for j in 1..10 {
            if i * j == 42 {
                println!("{} {}", i, j);
                break 'outer;
            }
        }
    }
}`,
    require: [{ pattern: "break\\s+'outer", message: "Use break 'outer" }],
    tests: [{ name: 'Prints 6 7 once', expected: '6 7' }],
  },

  // 15. arrays
  {
    id: 'r1-arrays',
    title: 'Arrays',
    kind: 'concept',
    introduces: ['array', 'indexing', 'len'],
    teach: {
      body: [
        '<p>An <em>array</em> holds a fixed number of values of the same type: <code>let a = [10, 20, 30];</code>. Its type is written <code>[i32; 3]</code>, "an array of three <code>i32</code>". The length is part of the type, so an array never grows or shrinks. It is the counterpart of <code>int a[3]</code> or <code>std::array&lt;int, 3&gt;</code> in C++.</p>',
        '<p>Read an element with <code>a[0]</code>; counting starts at 0, as in C++. The position must be a <code>usize</code>. <code>a.len()</code> gives the number of elements. To change an element, the array must be declared <code>mut</code>: <code>a[1] = 25;</code>. To build an array of the same value repeated, write <code>[0; 4]</code>, which is four zeros.</p>',
        '<p>To visit every element, use <code>for x in a { ... }</code>, which gives you each value in turn. When you also need the position, loop over the positions: <code>for i in 0..a.len() { ... a[i] ... }</code>. Asking for a position past the end is not undefined behaviour as in C++: the program stops with a clear error message. You will see that happen soon.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let a = [10, 20, 30];\n    println!("{}", a[0]);       // first element: 10\n    println!("{}", a[2]);       // last element: 30\n    println!("{}", a.len());    // how many elements: 3\n}',
          output: '10\n30\n3',
        },
        {
          code: 'fn main() {\n    let mut scores = [1, 2, 3];\n    scores[1] = 20;                 // change one element (needs mut)\n    for s in scores {               // visit each value in turn\n        println!("{}", s);\n    }\n    let zeros = [0; 4];             // value; count: four zeros\n    for i in 0..zeros.len() {       // or loop over the positions\n        println!("zero at {}", i);\n    }\n}',
          output: '1\n20\n3\nzero at 0\nzero at 1\nzero at 2\nzero at 3',
        },
      ],
      terms: [
        { code: '[10, 20, 30]', meaning: 'an array of three values; its type is [i32; 3]' },
        { code: '[0; 4]', meaning: 'an array of four copies of 0' },
        { code: 'a[i]', meaning: 'the element at position i (counting from 0)' },
        { code: 'a.len()', meaning: 'the number of elements' },
        { code: 'for x in a { ... }', meaning: 'runs the block once per element, with x set to that value' },
      ],
    },
    task: 'Change the middle element of <code>a</code> to 25, then print every element, one per line, with a <code>for</code> loop. It should print <code>10</code>, <code>25</code>, <code>30</code>.',
    compare: {
      cpp: { code: `int a[3] = {10, 20, 30};
a[1] = 25;
std::cout << a[1] << " " << sizeof(a) / sizeof(a[0]);`, outcome: 'Prints 25 3', ok: true },
      rust: { code: `let mut a = [10, 20, 30];
a[1] = 25;
println!("{} {}", a[1], a.len());`, outcome: 'Prints 25 3', ok: true },
      text: 'An array\'s length is part of its type, and <code>a.len()</code> reads it, with no <code>sizeof</code> trick. You also have to write <code>mut</code> before you may assign to an element.',
    },
    refresher: [
      '<code>a[1] = 25;</code> needs <code>let mut a</code>. <code>for x in a { ... }</code> visits each value.',
      '<code>a.len()</code> is a <code>usize</code>, and positions start at 0.',
    ],
    hints: [
      'Declare the array with <code>mut</code> so you can assign to an element.',
      'The middle position is 1. Then add a <code>for x in a</code> loop with one <code>println!</code>.',
    ],
    inCpp: {
      code: `int a[3] = {10, 20, 30};
int i = 5;
std::cout << a[i];   // undefined behaviour: reads outside the array`,
      note: 'C++ does not check the position, so an out-of-range index reads or writes whatever is in memory. Rust checks every index and stops the program with a message.',
    },
    starter: `fn main() {
    let a = [10, 20, 30];
    // change the middle element to 25, then print every element
}`,
    solution: `fn main() {
    let mut a = [10, 20, 30];
    a[1] = 25;
    for x in a {
        println!("{}", x);
    }
}`,
    require: [
      { pattern: 'a\\[1\\]\\s*=', message: 'Assign to a[1]' },
      { pattern: 'for\\s+\\w+\\s+in', message: 'Use a for loop' },
    ],
    tests: [{ name: 'Prints 10 25 30', expected: '10\n25\n30' }],
  },

  // 16. Vec
  {
    id: 'r1-arrays-vec',
    title: 'Vec: a growable array',
    kind: 'concept',
    introduces: ['vec', 'push', 'generic-args'],
    teach: {
      body: [
        '<p>When the number of values is not known in advance, use a <code>Vec</code> (short for vector), the counterpart of <code>std::vector</code>. Make one with <code>vec![1, 2, 3]</code>, or an empty one with <code>Vec::new()</code>. Add an element at the end with <code>v.push(4)</code>. Pushing changes the vector, so it must be declared <code>let mut</code>.</p>',
        '<p>A vector\'s type is written <code>Vec&lt;i32&gt;</code>: "a Vec of <code>i32</code>". The angle brackets hold the element type, like <code>std::vector&lt;int&gt;</code>. When you push values, Rust usually works the type out, but an empty <code>Vec::new()</code> with nothing pushed yet needs an annotation: <code>let v: Vec&lt;i32&gt; = Vec::new();</code>.</p>',
        '<p>Indexing and <code>.len()</code> work exactly as with arrays: <code>v[0]</code>, <code>v.len()</code>. A <code>for x in v</code> loop over a whole vector looks natural, but it has a catch that the next stage explains, so for now loop with positions: <code>for i in 0..v.len() { ... v[i] ... }</code>.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let mut v = vec![1, 2, 3];   // vec! builds a Vec from values\n    v.push(4);                   // add at the end\n    println!("{}", v.len());     // 4\n    println!("{}", v[3]);        // 4: the element we pushed\n}',
          output: '4\n4',
        },
        {
          code: 'fn main() {\n    let mut v: Vec<i32> = Vec::new();   // empty; the element type goes in <>\n    v.push(7);\n    v.push(8);\n    for i in 0..v.len() {               // loop over the positions\n        println!("v[{}] is {}", i, v[i]);\n    }\n}',
          output: 'v[0] is 7\nv[1] is 8',
        },
      ],
      terms: [
        { code: 'vec![1, 2, 3]', meaning: 'makes a Vec holding these values' },
        { code: 'Vec::new()', meaning: 'makes an empty Vec' },
        { code: 'Vec<i32>', meaning: 'the type "a Vec of i32"; the angle brackets name the element type' },
        { code: 'v.push(x)', meaning: 'adds x at the end (v must be mut)' },
      ],
    },
    task: 'Push 4 and 5 onto <code>v</code>, then print its length and then each element, one per line. It should print <code>5</code> and then <code>1</code> to <code>5</code>.',
    compare: {
      cpp: { code: `int a[3] = {1, 2, 3};
std::vector<int> v{1, 2, 3};
v.push_back(4);`, outcome: 'Array is fixed, vector grows', ok: true },
      rust: { code: `let a = [1, 2, 3];
let mut v = vec![1, 2, 3];
v.push(4);`, outcome: '[i32; 3] is fixed, Vec grows', ok: true },
      text: '<code>[i32; 3]</code> is an array: the length is part of the type. <code>Vec&lt;i32&gt;</code> is the growable one, made with <code>vec![...]</code>, and <code>.len()</code> gives either length.',
    },
    refresher: [
      '<code>v.push(x)</code> appends to a <code>Vec</code>. It changes the vector, so the binding needs <code>mut</code>.',
      '<code>v.len()</code> is the length. Loop with <code>for i in 0..v.len()</code> and read <code>v[i]</code>.',
    ],
    hints: [
      'Two <code>push</code> calls, then print <code>v.len()</code>.',
      'Then a <code>for i in 0..v.len()</code> loop that prints <code>v[i]</code>.',
    ],
    inCpp: {
      code: `std::vector<int> v{1, 2, 3};
v.push_back(4);
std::cout << v.size() << " " << v[3];`,
      note: 'A C++ <code>std::vector</code> and a Rust <code>Vec</code> are the same idea: a growable array on the heap. The length method returns a <code>usize</code>, and indexing is bounds-checked.',
    },
    starter: `fn main() {
    let v = vec![1, 2, 3];
    // push 4 and 5, then print the length and each element
}`,
    solution: `fn main() {
    let mut v = vec![1, 2, 3];
    v.push(4);
    v.push(5);
    println!("{}", v.len());
    for i in 0..v.len() {
        println!("{}", v[i]);
    }
}`,
    require: [{ pattern: '\\.push\\s*\\(', message: 'Use push' }],
    tests: [{ name: 'Prints length and elements', expected: '5\n1\n2\n3\n4\n5' }],
  },

  // 17. predict indexing
  {
    id: 'r1-predict-index',
    title: 'Indexing mistakes',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      'Indices and lengths are <code>usize</code>. A position past the end stops the program with a panic.',
      '<code>0..=n</code> includes <code>n</code>, <code>0..n</code> does not.',
    ],
    inCpp: {
      code: `std::vector<int> v{10, 20, 30};
int i = -1;
std::cout << v[i];   // i becomes a huge size_t: undefined behaviour`,
      note: 'C++ accepts any integer as an index, so a negative <code>int</code> silently becomes a huge <code>size_t</code>, and an index past the end reads random memory. Rust only indexes with <code>usize</code> and checks the range.',
    },
    rounds: [
      {
        snippet: `fn main() {
    let v = vec![10, 20, 30];
    for i in 0..=v.len() {
        println!("{}", v[i]);
    }
}`,
        choices: ['Prints 10, 20, 30', 'Prints 10, 20, 30, then a panic', 'Does not compile'],
        answer: 1,
        why: '<code>0..=v.len()</code> includes 3, but the valid positions are 0, 1 and 2. The first three lines print, then the bad index stops the program.',
        panic: true,
        output: 'index out of bounds: the len is 3 but the index is 3',
      },
      {
        snippet: `fn main() {
    let v = vec![10, 20, 30];
    let i: i32 = 1;
    println!("{}", v[i]);
}`,
        choices: ['Prints 20', 'Error: cannot index with an i32', 'Panics at run time'],
        answer: 1,
        why: 'A <code>Vec</code> is indexed by <code>usize</code> only. Rust does not convert <code>i32</code> for you; <code>i as usize</code> would.',
        errorCode: 'E0277',
        output: 'error[E0277]: the type `[{integer}]` cannot be indexed by `i32`\n --> src/main.rs:4:22\n  |\n4 |     println!("{}", v[i]);\n  |                      ^ slice indices are of type `usize` or ranges of `usize`\n  |\n  = help: the trait `SliceIndex<[{integer}]>` is not implemented for `i32`\n  = note: required for `Vec<{integer}>` to implement `Index<i32>`\n\nerror: aborting due to 1 previous error\n\nFor more information about this error, try `rustc --explain E0277`.',
      },
    ],
  },

  // 18. functions
  {
    id: 'r1-functions',
    title: 'Functions',
    kind: 'concept',
    introduces: ['fn-def', 'fn-params', 'return-type', 'return'],
    teach: {
      body: [
        '<p>You have been writing one function, <code>main</code>. To write another, use the same <code>fn</code>: <code>fn add(a: i32, b: i32) -&gt; i32 { a + b }</code>. After the name come the parameters in parentheses, and <em>every parameter needs a type</em>, written after a colon. The arrow <code>-&gt;</code> and a type say what the function gives back. A function with no <code>-&gt;</code> gives back nothing, like <code>void</code> in C++.</p>',
        '<p>The value a function returns is its <em>last expression</em>, written without a semicolon, exactly like the value of a block. So <code>a + b</code> at the end of <code>add</code> is the result, and there is no <code>return</code>. Use <code>return value;</code> only when you want to leave the function early, for example inside an <code>if</code>.</p>',
        '<p>Call a function by name with arguments: <code>add(2, 3)</code>. It does not matter whether you define a function above or below the place that calls it, so there are no prototypes. Two limits to know about, compared with C++: there is no overloading (two functions cannot share a name) and no default argument values. Give each variant its own name.</p>',
      ],
      examples: [
        {
          code: 'fn add(a: i32, b: i32) -> i32 {\n    a + b   // no semicolon: this is the value the function returns\n}\n\nfn main() {\n    let total = add(2, 3);   // call it by name, with arguments\n    println!("{}", total);\n}',
          output: '5',
        },
        {
          code: 'fn sign(n: i32) -> i32 {\n    if n < 0 {\n        return -1;   // leave the function right now\n    }\n    if n > 0 {\n        return 1;\n    }\n    0                // otherwise the last expression is the result\n}\n\nfn main() {\n    println!("{}", sign(-9));\n    println!("{}", sign(0));\n}',
          output: '-1\n0',
          caption: 'return is for leaving early.',
        },
        {
          code: 'fn greet(times: u32) {          // no arrow: returns nothing\n    for i in 0..times {\n        println!("hello {}", i);\n    }\n}\n\nfn main() {\n    greet(2);\n}',
          output: 'hello 0\nhello 1',
        },
      ],
      terms: [
        { code: 'fn name(a: T, b: U) -> R { ... }', meaning: 'defines a function; each parameter has a type, and R is the type it returns' },
        { code: 'last expression, no ;', meaning: 'the value the function returns' },
        { code: 'return x;', meaning: 'returns x immediately (early exit)' },
      ],
    },
    task: 'Write <code>perimeter</code> so it returns 2 times the sum of <code>w</code> and <code>h</code>. End the body with an expression and do not use <code>return</code>.',
    compare: {
      cpp: { code: `int area(int w, int h) { return w * h; }
int area(int s) { return s * s; }      // overload
void greet(std::string who = "you");   // default argument`, outcome: 'Overloads and defaults are allowed', ok: true },
      rust: { code: `fn area(w: i32, h: i32) -> i32 {
    w * h
}
fn area(s: i32) -> i32 {
    s * s
}`, outcome: 'Error: area defined twice', ok: false, errorCode: 'E0428' },
      text: 'Every parameter type and the return type are written out, and the last expression, with no <code>;</code>, is the return value. There is no overloading and no default arguments: use a different name for each variant.',
    },
    refresher: [
      '<code>fn name(a: u32, b: u32) -&gt; u32 { a + b }</code> returns the sum: the last line has no <code>;</code>.',
      '<code>u32</code> is an unsigned 32-bit integer.',
    ],
    hints: [
      'Replace the <code>0</code> with an expression built from <code>w</code> and <code>h</code>.',
      'Do not end the last line with <code>;</code>.',
    ],
    inCpp: {
      code: `int perimeter(int w, int h) {
    return 2 * (w + h);
}`,
      note: 'C++ needs <code>return</code> and puts the type first. Rust writes <code>-&gt; type</code> after the parameters and uses the final expression; <code>return</code> is for leaving early.',
    },
    starter: `fn perimeter(w: u32, h: u32) -> u32 {
    0
}`,
    solution: `fn perimeter(w: u32, h: u32) -> u32 {
    2 * (w + h)
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", perimeter(3, 4));
    println!("\\n@@TEST 2@@");
    println!("{}", perimeter(1, 1));
    println!("\\n@@TEST 3@@");
    println!("{}", perimeter(0, 5));
}`,
    forbidden: [{ pattern: '\\breturn\\b', message: 'End the body with an expression instead of return.' }],
    tests: [
      { name: '3 by 4', input: '3, 4', expected: '14' },
      { name: '1 by 1', input: '1, 1', expected: '4' },
      { name: '0 by 5', input: '0, 5', expected: '10' },
    ],
  },

  // 19. fix stray semicolon
  {
    id: 'r1-fix-semicolon',
    title: 'The stray semicolon',
    kind: 'fix',
    introduces: [],
    task: 'This does not compile. Change it so it prints <code>42</code>.',
    errorCode: 'E0308',
    gloss: 'A body ending in <code>;</code> has no value, so it evaluates to <code>()</code>, the unit type, not the <code>i32</code> the signature promises.',
    refresher: [
      'An expression with a <code>;</code> after it becomes a statement and produces <code>()</code>, "nothing".',
      'The last line of a function, without a <code>;</code>, is its return value.',
    ],
    hints: [
      'Look at the last line of <code>double</code>. What follows the expression?',
      'The compiler suggests which character to remove.',
    ],
    inCpp: {
      code: `int twice(int x) {
    x * 2;   // no return
}`,
      note: 'C++ lets a non-void function reach its end, which is undefined behaviour if the caller uses the result. Rust refuses to compile it.',
    },
    starter: `fn double(x: i32) -> i32 {
    x * 2;
}

fn main() {
    println!("{}", double(21));
}`,
    solution: `fn double(x: i32) -> i32 {
    x * 2
}

fn main() {
    println!("{}", double(21));
}`,
    require: [{ pattern: 'x\\s*\\*\\s*2', message: 'Keep x * 2' }],
    tests: [{ name: 'Prints 42', expected: '42' }],
  },

  // 20. implement sum_to
  {
    id: 'r1-implement-sum-to',
    title: 'Sum up to n',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>sum_to</code>: return 1 + 2 + ... + n, using a <code>for</code> loop over <code>1..=n</code>. For n = 0 the sum is 0.',
    refresher: [
      '<code>let mut total = 0;</code> then <code>total += i;</code> inside the loop adds up values.',
      'The last line of the function, with no <code>;</code>, is the result.',
    ],
    hints: [
      'Make a <code>mut</code> variable for the running total before the loop.',
      'Add <code>i</code> to it on each pass, and put the total alone on the last line.',
    ],
    inCpp: {
      code: `unsigned sum_to(unsigned n) {
    unsigned total = 0;
    for (unsigned i = 1; i <= n; i++) total += i;
    return total;
}`,
      note: 'The loop counts the same way. In Rust the range <code>1..=n</code> replaces the three-part header, and the total is returned by writing it as the last expression.',
    },
    starter: `fn sum_to(n: u32) -> u32 {
    0
}`,
    solution: `fn sum_to(n: u32) -> u32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", sum_to(0));
    println!("\\n@@TEST 2@@");
    println!("{}", sum_to(1));
    println!("\\n@@TEST 3@@");
    println!("{}", sum_to(4));
    println!("\\n@@TEST 4@@");
    println!("{}", sum_to(100));
}`,
    tests: [
      { name: 'Zero', input: '0', expected: '0' },
      { name: 'One', input: '1', expected: '1' },
      { name: 'Four', input: '4', expected: '10' },
      { name: 'Hundred', input: '100', expected: '5050' },
    ],
  },

  // 21. implement largest (array parameter)
  {
    id: 'r1-implement-largest',
    title: 'Largest of five',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>largest</code>: return the biggest of the five numbers in the array. Loop over it and keep the best so far.',
    refresher: [
      '<code>a[0]</code> is the first element. <code>for x in a { ... }</code> visits each value.',
      'For now the array is copied into the function. Stage 2 shows how to lend it instead.',
    ],
    hints: [
      'Start a <code>mut</code> variable with the first element, <code>a[0]</code>.',
      'In the loop, replace it with <code>x</code> whenever <code>x</code> is bigger, then return it.',
    ],
    inCpp: {
      code: `int largest(const int (&a)[5]) {
    int best = a[0];
    for (int x : a) if (x > best) best = x;
    return best;
}`,
      note: 'A C++ array parameter decays to a pointer unless you write a reference to the array. A Rust array parameter keeps its length in its type, <code>[i32; 5]</code>, and is copied in.',
    },
    starter: `fn largest(a: [i32; 5]) -> i32 {
    0
}`,
    solution: `fn largest(a: [i32; 5]) -> i32 {
    let mut best = a[0];
    for x in a {
        if x > best {
            best = x;
        }
    }
    best
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", largest([3, 9, 2, 7, 1]));
    println!("\\n@@TEST 2@@");
    println!("{}", largest([5, 5, 5, 5, 5]));
    println!("\\n@@TEST 3@@");
    println!("{}", largest([-5, -2, -9, -7, -3]));
    println!("\\n@@TEST 4@@");
    println!("{}", largest([8, 1, 2, 3, 4]));
}`,
    tests: [
      { name: 'Mixed', input: '[3, 9, 2, 7, 1]', expected: '9' },
      { name: 'All equal', input: '[5, 5, 5, 5, 5]', expected: '5' },
      { name: 'All negative', input: '[-5, -2, -9, -7, -3]', expected: '-2' },
      { name: 'First is largest', input: '[8, 1, 2, 3, 4]', expected: '8' },
    ],
  },

  // 22. shadowing
  {
    id: 'r1-shadowing',
    title: 'Shadowing',
    kind: 'concept',
    introduces: [],
    teach: {
      body: [
        '<p>You can write <code>let</code> again with a name that already exists. This does not change the old variable. It creates a <em>new</em> variable that happens to have the same name, and from then on the name means the new one. This is called <em>shadowing</em>.</p>',
        '<p>It differs from <code>mut</code> in two ways. First, the new variable may have a different type: you can turn a piece of text into its length and keep the name. Assignment with <code>=</code> to a <code>mut</code> variable can never change the type. Second, the result is not <code>mut</code> unless you say so, so you can transform a value step by step and then have it frozen.</p>',
        '<p>A shadow made inside a block <code>{ ... }</code> lasts only until the closing brace; after it, the outer variable is visible again. In C++ a redeclaration in the same scope is an error, and a variable never changes type.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let x = 5;\n    let x = x * 2;      // a NEW x, whose value is 10\n    println!("{}", x);\n    {\n        let x = x + 1;  // shadows x only inside these braces\n        println!("{}", x);\n    }\n    println!("{}", x);  // the braces ended: the outer x is back\n}',
          output: '10\n11\n10',
        },
        {
          code: 'fn main() {\n    let spaces = "   ";           // text\n    let spaces = spaces.len();    // .len() counts the characters: now a number, in a new variable\n    println!("{}", spaces);\n}',
          output: '3',
          caption: 'The type changed, which assignment could not do.',
        },
      ],
      terms: [
        { code: 'let x = x * 2;', meaning: 'a new variable x that hides the old one; the old value is used on the right' },
      ],
    },
    task: 'Shadow <code>digits</code> with its own length, then print it. It should print <code>3</code>.',
    compare: {
      cpp: { code: `int x = 5;
int x = x * 2;`, outcome: 'Error: redefinition of x', ok: false },
      rust: { code: `let x = 5;
let x = x * 2;
let x = "ten";`, outcome: 'Compiles: each let makes a new x', ok: true },
      text: 'A second <code>let</code> with the same name creates a new variable that hides the old one, even with a different type. Assigning with <code>=</code> changes the same variable and must keep its type.',
    },
    refresher: [
      '<code>"abc".len()</code> is the number of bytes in the text, here 3.',
      'A literal like <code>"   "</code> is text. Shadowing lets the same name hold a number afterwards.',
    ],
    hints: [
      'Add a new <code>let</code> line after the first one and before the print.',
      'Reuse the old value on the right of the new <code>let</code>.',
    ],
    inCpp: {
      code: `int x = 5;
{
    int x = 10;   // hides the outer x until the block ends
    std::cout << x;
}
std::cout << x;`,
      note: 'C++ shadows only in an inner scope, and a variable never changes type. Rust also allows it in the same scope, so a value can be transformed step by step under one name.',
    },
    starter: `fn main() {
    let digits = "   ";
    // shadow digits with its length
    println!("{}", digits);
}`,
    solution: `fn main() {
    let digits = "   ";
    let digits = digits.len();
    println!("{}", digits);
}`,
    require: [{ pattern: 'let\\s+digits\\s*=\\s*digits', message: 'Shadow digits with a new let' }],
    tests: [{ name: 'Prints 3', expected: '3' }],
  },

  // 23. predict bindings
  {
    id: 'r1-predict-bindings',
    title: 'Shadow or assign?',
    kind: 'predict',
    introduces: [],
    task: 'For each snippet, pick what you expect, then compile it and compare.',
    refresher: [
      'A shadowing <code>let</code> inside a block lasts until the block ends.',
      '<code>=</code> on a <code>mut</code> variable keeps its type.',
    ],
    inCpp: {
      code: `int x = 5;
x = 2.7;   // compiles: converts to 2
std::string s = "ab";
s = s.size();   // compiles: size_t becomes a char`,
      note: 'C++ converts silently on assignment, even when information is lost. Rust never converts a type on assignment, so only a new <code>let</code> can change it.',
    },
    rounds: [
      {
        snippet: `fn main() {
    let x = 5;
    let x = x * 2;
    {
        let x = x + 1;
        println!("{}", x);
    }
    println!("{}", x);
}`,
        choices: ['11, then 10', '11, then 11', '10, then 10'],
        answer: 0,
        why: 'The inner <code>x</code> is 11 only inside the block. After it, the outer <code>x</code> (10) is visible again.',
        output: '11\n10',
      },
      {
        snippet: `fn main() {
    let mut s = "ab";
    s = s.len();
    println!("{}", s);
}`,
        choices: ['Prints 2', 'Prints ab', 'Error: mismatched types'],
        answer: 2,
        why: '<code>s</code> holds text, and plain assignment cannot turn it into a number. A new <code>let s</code> could.',
        errorCode: 'E0308',
        output: `error[E0308]: mismatched types
 --> src/main.rs:3:9
  |
2 |     let mut s = "ab";
  |                 ---- expected due to this value
3 |     s = s.len();
  |         ^^^^^^^ expected \`&str\`, found \`usize\`

error: aborting due to 1 previous error

For more information about this error, try \`rustc --explain E0308\`.`,
      },
    ],
  },

  // 24. tuples
  {
    id: 'r1-tuples',
    title: 'Tuples',
    kind: 'concept',
    introduces: ['tuple', 'tuple-field', 'destructure', 'unit-type'],
    teach: {
      body: [
        '<p>A <em>tuple</em> groups a fixed number of values, which may have different types: <code>let p = (3, 4);</code>. Its type is written the same way, <code>(i32, i32)</code>. The C++ cousins are <code>std::pair</code> and <code>std::tuple</code>, but in Rust tuples are part of the language itself.</p>',
        '<p>Read a part with a dot and its position: <code>p.0</code> is the first, <code>p.1</code> the second. Or take the tuple apart in one go: <code>let (x, y) = p;</code> creates two variables, <code>x</code> and <code>y</code>. This is called <em>destructuring</em>, and it is like the structured bindings <code>auto [x, y] = p;</code> of C++17.</p>',
        '<p>Tuples are how a function returns several values: write the return type as <code>(i32, i32)</code> and build the result as <code>(a, b)</code>. The empty tuple <code>()</code> is called the <em>unit type</em>. It is what a function without <code>-&gt;</code> gives back: the value that means "nothing".</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let p = (3, 4);         // a tuple of two numbers\n    println!("{}", p.0);    // first part: 3\n    println!("{}", p.1);    // second part: 4\n    let (x, y) = p;         // take it apart into two variables\n    println!("{} {}", x, y);\n}',
          output: '3\n4\n3 4',
        },
        {
          code: 'fn div_rem(a: i32, b: i32) -> (i32, i32) {\n    (a / b, a % b)   // build a tuple as the last expression\n}\n\nfn main() {\n    let (q, r) = div_rem(17, 5);   // destructure the result\n    println!("{} remainder {}", q, r);\n}',
          output: '3 remainder 2',
          caption: 'A function returns two values by returning a tuple.',
        },
      ],
      terms: [
        { code: '(a, b)', meaning: 'a tuple of two values; (i32, i32) is its type' },
        { code: 'p.0, p.1', meaning: 'the parts of a tuple, by position' },
        { code: 'let (x, y) = p;', meaning: 'destructuring: takes a tuple apart into variables' },
        { code: '()', meaning: 'the unit type: the empty tuple, meaning "nothing"' },
      ],
    },
    task: 'Write <code>min_max</code> so it returns the smaller number first and the larger second, as a tuple.',
    compare: {
      cpp: { code: `std::pair<int, int> p{3, 4};
auto [x, y] = p;`, outcome: 'x is 3, y is 4', ok: true },
      rust: { code: `let p = (3, 4);
let (x, y) = p;`, outcome: 'x is 3, y is 4', ok: true },
      text: 'A tuple groups values, possibly of different types, read as <code>p.0</code> or taken apart with a pattern like <code>let (x, y) = p;</code>. The empty tuple <code>()</code> is the unit type, what a function without a return type gives back.',
    },
    refresher: [
      'A function can return <code>(i32, i32)</code>: build the value as <code>(a, b)</code>.',
      '<code>if a &lt; b { a } else { b }</code> picks the smaller of two numbers.',
    ],
    hints: [
      'The body can be a single <code>if</code> that returns one tuple in each branch.',
      'Return <code>(a, b)</code> when a is smaller and <code>(b, a)</code> otherwise.',
    ],
    inCpp: {
      code: `std::tuple<int, std::string> t{1, "a"};
auto [n, s] = t;
std::cout << std::get<0>(t);`,
      note: 'C++ needs <code>std::tuple</code>, <code>std::get</code> or structured bindings. Rust tuples are part of the language and use <code>.0</code> and <code>let (a, b)</code>.',
    },
    starter: `fn min_max(a: i32, b: i32) -> (i32, i32) {
    (a, b)
}`,
    solution: `fn min_max(a: i32, b: i32) -> (i32, i32) {
    if a < b { (a, b) } else { (b, a) }
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    let (lo, hi) = min_max(5, 2);
    println!("{} {}", lo, hi);
    println!("\\n@@TEST 2@@");
    let (lo, hi) = min_max(1, 9);
    println!("{} {}", lo, hi);
    println!("\\n@@TEST 3@@");
    let (lo, hi) = min_max(4, 4);
    println!("{} {}", lo, hi);
}`,
    tests: [
      { name: 'Out of order', input: '5, 2', expected: '2 5' },
      { name: 'In order', input: '1, 9', expected: '1 9' },
      { name: 'Equal', input: '4, 4', expected: '4 4' },
    ],
  },

  // 25. Debug printing
  {
    id: 'r1-display-debug',
    title: 'Printing whole values with {:?}',
    kind: 'concept',
    introduces: ['placeholder-debug'],
    teach: {
      body: [
        '<p>So far every <code>{}</code> printed a single number or piece of text. Try it on a tuple, an array or a <code>Vec</code> and the compiler stops you. <code>{}</code> only works for types that have one obvious way to be shown to a user (the technical name is that they implement <code>Display</code>). A tuple or an array has no single obvious look, so there is no <code>Display</code> for them.</p>',
        '<p>For those, use the other placeholder <code>{:?}</code>. It prints the value the way you would write it in code, which is made for programmers: a tuple prints as <code>(3, 4)</code> and an array as <code>[1, 2, 3]</code>. The technical name for this view is <code>Debug</code>. Most standard types support it, including tuples, arrays and <code>Vec</code>.</p>',
        '<p>Use <code>{}</code> when you want a friendly value and <code>{:?}</code> when you want to look at the whole structure. You can mix both in one <code>println!</code>. In C++ there is no such built-in view: you write the loop that prints each element yourself.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let t = (3, 4);\n    let a = [1, 2, 3];\n    let v = vec![10, 20];\n    println!("{:?}", t);                    // a tuple: (3, 4)\n    println!("{:?}", a);                    // an array: [1, 2, 3]\n    println!("{:?}", v);                    // a Vec prints the same way\n    println!("{:?} has {} elements", a, a.len());   // {:?} and {} can be mixed\n}',
          output: '(3, 4)\n[1, 2, 3]\n[10, 20]\n[1, 2, 3] has 3 elements',
        },
      ],
      terms: [
        { code: '{:?}', meaning: 'prints a value in the programmer view (Debug); works for tuples, arrays and Vec' },
        { code: '{}', meaning: 'prints in the user view (Display); only for types like numbers and text' },
      ],
    },
    task: 'This does not compile. Change it so it prints <code>(3, 4)</code> and then <code>[1, 2, 3]</code>, each on its own line.',
    compare: {
      cpp: { code: `std::pair<int, int> p{3, 4};
std::cout << p;`, outcome: 'Error: no operator<< for pair', ok: false },
      rust: { code: `let p = (3, 4);
println!("{:?}", p);`, outcome: 'Prints (3, 4)', ok: true },
      text: '<code>{}</code> needs a user-facing format, and a tuple has none. <code>{:?}</code> uses the developer view that most standard types provide.',
    },
    refresher: [
      '<code>{}</code> works for numbers and text. <code>{:?}</code> works for tuples, arrays and vectors.',
      '<code>(3, 4)</code> is a tuple and <code>[1, 2, 3]</code> is an array.',
    ],
    hints: [
      'The compiler complains about the <code>{}</code> placeholders.',
      'There is a second placeholder form that asks for the debug view.',
    ],
    inCpp: {
      code: `int a[3] = {1, 2, 3};
for (int x : a) std::cout << x << " ";`,
      note: 'C++ streams have no built-in debug view, so you write the loop for every container. In Rust most standard types print with <code>{:?}</code>.',
    },
    starter: `fn main() {
    let t = (3, 4);
    let a = [1, 2, 3];
    println!("{}", t);
    println!("{}", a);
}`,
    solution: `fn main() {
    let t = (3, 4);
    let a = [1, 2, 3];
    println!("{:?}", t);
    println!("{:?}", a);
}`,
    tests: [{ name: 'Prints both values', expected: '(3, 4)\n[1, 2, 3]' }],
  },

  // 26. implement squares (returns a Vec)
  {
    id: 'r1-implement-squares',
    title: 'Build a Vec of squares',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>squares</code> so it returns a <code>Vec</code> holding 1, 4, 9, ... up to n squared. The tests print it with <code>{:?}</code>.',
    refresher: [
      '<code>let mut v = Vec::new();</code> makes an empty vector and <code>v.push(x)</code> adds to it. The element type is inferred from what you push.',
      'Put <code>v</code> alone on the last line to return it.',
    ],
    hints: [
      'Start with an empty <code>mut</code> Vec, then loop over <code>1..=n</code>.',
      'Push <code>i * i</code> on each pass, then return the Vec.',
    ],
    inCpp: {
      code: `std::vector<unsigned> squares(unsigned n) {
    std::vector<unsigned> v;
    for (unsigned i = 1; i <= n; i++) v.push_back(i * i);
    return v;
}`,
      note: 'Returning a vector by value is normal in both languages. In Rust the vector is handed to the caller without a copy.',
    },
    starter: `fn squares(n: u32) -> Vec<u32> {
    Vec::new()
}`,
    solution: `fn squares(n: u32) -> Vec<u32> {
    let mut v = Vec::new();
    for i in 1..=n {
        v.push(i * i);
    }
    v
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{:?}", squares(0));
    println!("\\n@@TEST 2@@");
    println!("{:?}", squares(3));
    println!("\\n@@TEST 3@@");
    println!("{:?}", squares(5));
}`,
    tests: [
      { name: 'Zero', input: '0', expected: '[]' },
      { name: 'Three', input: '3', expected: '[1, 4, 9]' },
      { name: 'Five', input: '5', expected: '[1, 4, 9, 16, 25]' },
    ],
  },

  // 27. match basics
  {
    id: 'r1-match-basics',
    title: 'match',
    kind: 'concept',
    introduces: ['match', 'match-arrow', 'wildcard'],
    teach: {
      body: [
        '<p><code>match</code> compares a value with a list of <em>patterns</em>, top to bottom, and runs the first arm that fits. Each arm is <code>pattern =&gt; result,</code> with a comma after it. It looks like a C++ <code>switch</code>, with three differences: only the chosen arm runs (there is no fallthrough, so no <code>break</code>), the patterns are more powerful than constants, and the compiler checks that every possible value is covered.</p>',
        '<p>The pattern <code>_</code> (an underscore) matches anything, so it is the catch-all, like <code>default:</code>. If you leave a value uncovered, the program does not compile. That is how Rust catches the forgotten case of a <code>switch</code>.</p>',
        '<p>Like <code>if</code>, a <code>match</code> is an expression: every arm produces a value of the same type, and <code>let name = match n { ... };</code> stores the one that was chosen.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let n = 2;\n    match n {\n        1 => println!("one"),\n        2 => println!("two"),               // this arm fits, so only it runs\n        _ => println!("something else"),    // _ matches anything that is left\n    }\n}',
          output: 'two',
        },
        {
          code: 'fn main() {\n    let n = 3;\n    let name = match n {   // match gives a value, like if does\n        1 => "one",\n        2 => "two",\n        _ => "many",\n    };\n    println!("{}", name);\n}',
          output: 'many',
        },
      ],
      terms: [
        { code: 'match x { ... }', meaning: 'compares x with patterns, top to bottom; the first match runs' },
        { code: 'pattern => result,', meaning: 'one arm; arms are separated by commas' },
        { code: '_', meaning: 'the pattern that matches anything (the catch-all)' },
      ],
    },
    task: 'Write <code>describe</code> so it prints <code>zero</code> for 0, <code>pair</code> for 2 and <code>other</code> for any other number.',
    compare: {
      cpp: { code: `int n = 1;
switch (n) {
    case 1: std::cout << "one";
    case 2: std::cout << "two"; break;
    default: std::cout << "many";
}`, outcome: 'Prints onetwo: falls through', ok: true },
      rust: { code: `let n = 1;
match n {
    1 => println!("one"),
    2 => println!("two"),
    _ => println!("many"),
}`, outcome: 'Prints one', ok: true },
      text: 'Each arm runs alone: there is no fallthrough and no <code>break</code>. <code>_</code> is the catch-all, and the compiler rejects a <code>match</code> that leaves any value uncovered.',
    },
    refresher: [
      '<code>match x { 1 =&gt; ..., _ =&gt; ... }</code> compares <code>x</code> with each pattern in order. Arms are separated by commas.',
      '<code>println!</code> works as an arm.',
    ],
    hints: [
      'Match on the parameter <code>n</code>, one arm per case.',
      'The last arm is <code>_</code>, which matches whatever is left.',
    ],
    inCpp: {
      code: `enum Color { Red, Green, Blue };
const char* name(Color c) {
    switch (c) {
        case Red: return "red";
        case Green: return "green";
    }
    return "?";   // Blue forgotten: usually only a warning
}`,
      note: 'C++ compilers may only warn about an enum value left out of a <code>switch</code>, and a forgotten <code>break</code> compiles silently. In Rust a missing case is an error and each arm stands alone.',
    },
    starter: `fn describe(n: u32) {
    // print zero, pair or other
}`,
    solution: `fn describe(n: u32) {
    match n {
        0 => println!("zero"),
        2 => println!("pair"),
        _ => println!("other"),
    }
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    describe(0);
    println!("\\n@@TEST 2@@");
    describe(2);
    println!("\\n@@TEST 3@@");
    describe(1);
    println!("\\n@@TEST 4@@");
    describe(9);
}`,
    require: [{ pattern: '\\bmatch\\b', message: 'Use match' }],
    tests: [
      { name: 'Zero', input: '0', expected: 'zero' },
      { name: 'Two', input: '2', expected: 'pair' },
      { name: 'One', input: '1', expected: 'other' },
      { name: 'Nine', input: '9', expected: 'other' },
    ],
  },

  // 28. fix E0004
  {
    id: 'r1-fix-non-exhaustive',
    title: 'Every value needs an arm',
    kind: 'fix',
    introduces: [],
    task: 'This does not compile. Change it so it prints <code>many</code> for 7 and still handles 0 and 1.',
    errorCode: 'E0004',
    gloss: '<code>n</code> is a <code>u32</code> and the arms cover only 0 and 1, so the compiler stops: every possible value needs an arm.',
    refresher: [
      'A <code>match</code> must cover every possible value of the type it matches.',
      '<code>_ =&gt; ...</code> as the last arm covers everything not listed above it.',
    ],
    hints: [
      'The end of the compiler message lists the values that are not covered.',
      'Add one more arm at the bottom that matches anything.',
    ],
    inCpp: {
      code: `unsigned n = 7;
switch (n) {
    case 0: std::cout << "zero"; break;
    case 1: std::cout << "one"; break;
}   // prints nothing for 7`,
      note: 'C++ lets a <code>switch</code> skip values without a <code>default</code> and does nothing for them. Rust needs an arm for every value, so a case cannot be forgotten.',
    },
    starter: `fn main() {
    let n: u32 = 7;
    match n {
        0 => println!("zero"),
        1 => println!("one"),
    }
}`,
    solution: `fn main() {
    let n: u32 = 7;
    match n {
        0 => println!("zero"),
        1 => println!("one"),
        _ => println!("many"),
    }
}`,
    require: [{ pattern: '0\\s*=>', message: 'Keep the arm for 0' }, { pattern: '1\\s*=>', message: 'Keep the arm for 1' }],
    tests: [{ name: 'Prints many', expected: 'many' }],
  },

  // 29. match patterns
  {
    id: 'r1-match-patterns',
    title: 'Ranges, | and guards',
    kind: 'concept',
    introduces: ['char', 'or-pattern', 'match-guard'],
    teach: {
      body: [
        '<p>An arm\'s pattern can be more than one constant. A <em>range</em> such as <code>1..=9</code> matches any value from 1 to 9. A bar <code>|</code> means "or": <code>10 | 20</code> matches either. A <em>guard</em> adds a condition to a pattern with <code>if</code>: <code>x if x &lt; 0</code> gives the value the name <code>x</code> and only matches when the condition holds.</p>',
        '<p>These examples return single characters. A <code>char</code> is one character written in single quotes, like <code>\'S\'</code>. (Double quotes make text, single quotes make one <code>char</code>.) Arms are tried from the top, so the first one that fits wins, and the whole <code>match</code> must still cover every value, which the final <code>_</code> takes care of.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let n = 7;\n    let size = match n {\n        0 => \'Z\',          // single quotes make a char: one character\n        1..=9 => \'S\',      // a range of values\n        10 | 20 => \'T\',    // either value\n        _ => \'L\',          // everything else\n    };\n    println!("{}", size);\n}',
          output: 'S',
        },
        {
          code: 'fn main() {\n    let n = -4;\n    match n {\n        x if x < 0 => println!("{} is negative", x),   // x names the value; the if is the guard\n        0 => println!("zero"),\n        _ => println!("positive"),\n    }\n}',
          output: '-4 is negative',
        },
      ],
      terms: [
        { code: "'S'", meaning: 'a char: a single character in single quotes' },
        { code: '1..=9 =>', meaning: 'a range pattern: matches any value from 1 to 9' },
        { code: '10 | 20 =>', meaning: 'an or-pattern: matches either value' },
        { code: 'x if x < 0 =>', meaning: 'a guard: matches when the condition after if is true; x names the value' },
      ],
    },
    task: "Write <code>kind</code> returning <code>'N'</code> for negative numbers, <code>'Z'</code> for 0, <code>'S'</code> for 1 to 9, <code>'T'</code> for exactly 10 or 20, and <code>'L'</code> otherwise.",
    compare: {
      cpp: { code: `int n = 2;
char grade;
switch (n) {
    case 1: case 2: case 3: grade = 'C'; break;
    case 4: case 5: grade = 'B'; break;
    default: grade = 'F';
}`, outcome: 'One label per value, no ranges', ok: true },
      rust: { code: `let n = 2;
let grade = match n {
    1..=3 => 'C',
    4 | 5 => 'B',
    x if x > 9 => 'A',
    _ => 'F',
};`, outcome: 'grade is C', ok: true },
      text: 'An arm can be a range (<code>1..=3</code>), several patterns joined by <code>|</code>, or a pattern with a guard (<code>x if x &gt; 9</code>). Because <code>match</code> is an expression, it can sit on the right of <code>let</code> and gives the chosen arm\'s value.',
    },
    refresher: [
      "<code>'N'</code> is a <code>char</code>, written with single quotes.",
      '<code>n if n &lt; 0 =&gt; ...</code> binds the value to <code>n</code> and only matches when the condition holds.',
    ],
    hints: [
      'Make the whole <code>match</code> the last expression of the function, with no <code>;</code>.',
      'Arms are tried top to bottom. Put the guard for negatives before the others.',
    ],
    inCpp: {
      code: `char kind(int n) {
    if (n < 0) return 'N';
    if (n == 0) return 'Z';
    if (n >= 1 && n <= 9) return 'S';
    if (n == 10 || n == 20) return 'T';
    return 'L';
}`,
      note: 'In C++ this is an <code>if</code> chain, because <code>switch</code> takes only single values. A Rust <code>match</code> states the same ranges and alternatives as patterns, and checks they are complete.',
    },
    starter: `fn kind(n: i32) -> char {
    'L'
}`,
    solution: `fn kind(n: i32) -> char {
    match n {
        x if x < 0 => 'N',
        0 => 'Z',
        1..=9 => 'S',
        10 | 20 => 'T',
        _ => 'L',
    }
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", kind(-5));
    println!("\\n@@TEST 2@@");
    println!("{}", kind(0));
    println!("\\n@@TEST 3@@");
    println!("{}", kind(7));
    println!("\\n@@TEST 4@@");
    println!("{}", kind(10));
    println!("\\n@@TEST 5@@");
    println!("{}", kind(20));
    println!("\\n@@TEST 6@@");
    println!("{}", kind(15));
}`,
    require: [{ pattern: '\\bmatch\\b', message: 'Use match' }],
    tests: [
      { name: 'Negative', input: '-5', expected: 'N' },
      { name: 'Zero', input: '0', expected: 'Z' },
      { name: 'Small', input: '7', expected: 'S' },
      { name: 'Ten', input: '10', expected: 'T' },
      { name: 'Twenty', input: '20', expected: 'T' },
      { name: 'Large', input: '15', expected: 'L' },
    ],
  },

  // 30. implement fizz with match on tuple
  {
    id: 'r1-implement-fizz',
    title: 'Fizz code',
    kind: 'implement',
    introduces: [],
    task: "Write <code>fizz</code> returning <code>'X'</code> when n divides by both 3 and 5, <code>'F'</code> for 3 only, <code>'B'</code> for 5 only and <code>'.'</code> otherwise. Use <code>match</code> on <code>(n % 3, n % 5)</code>.",
    refresher: [
      'A <code>match</code> can take a tuple: <code>(0, _)</code> means the first is 0 and the second is anything.',
      'Arms are tried top to bottom, so put the most specific pattern first. The <code>match</code> can be the whole function body.',
    ],
    hints: [
      'Compute both remainders in the value you match: <code>match (n % 3, n % 5) { ... }</code>.',
      'The both-zero case <code>(0, 0)</code> must come before the single-zero ones.',
      'End with <code>_</code> for the default.',
    ],
    inCpp: {
      code: `char fizz(unsigned n) {
    if (n % 3 == 0 && n % 5 == 0) return 'X';
    if (n % 3 == 0) return 'F';
    if (n % 5 == 0) return 'B';
    return '.';
}`,
      note: 'In C++ this is an <code>if</code> chain with the combined test first. A Rust <code>match</code> on a tuple lists the four cases as patterns and checks that none is missing.',
    },
    starter: `fn fizz(n: u32) -> char {
    '.'
}`,
    solution: `fn fizz(n: u32) -> char {
    match (n % 3, n % 5) {
        (0, 0) => 'X',
        (0, _) => 'F',
        (_, 0) => 'B',
        _ => '.',
    }
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", fizz(30));
    println!("\\n@@TEST 2@@");
    println!("{}", fizz(9));
    println!("\\n@@TEST 3@@");
    println!("{}", fizz(10));
    println!("\\n@@TEST 4@@");
    println!("{}", fizz(7));
    println!("\\n@@TEST 5@@");
    println!("{}", fizz(15));
}`,
    require: [{ pattern: '\\bmatch\\b', message: 'Use match' }],
    tests: [
      { name: 'Both', input: '30', expected: 'X' },
      { name: 'Three only', input: '9', expected: 'F' },
      { name: 'Five only', input: '10', expected: 'B' },
      { name: 'Neither', input: '7', expected: '.' },
      { name: 'Fifteen', input: '15', expected: 'X' },
    ],
  },

  // 31. strings
  {
    id: 'r1-strings',
    title: '&str and String',
    kind: 'concept',
    introduces: ['str-type', 'string-type', 'string-from', 'format-macro', 'push-str'],
    teach: {
      body: [
        '<p>Rust has two main text types. A string literal like <code>"Hello"</code> has the type <code>&amp;str</code> ("string slice"): a read-only view of text that is stored inside the program. You cannot grow it. The <code>&amp;</code> in the name means it is a <em>borrowed</em> view, an idea that gets its own stage soon. For now, read <code>&amp;str</code> as "text that I can look at but not change".</p>',
        '<p>The second type is <code>String</code>: text that owns its characters and can grow, like <code>std::string</code>. Make one with <code>String::from("Hello")</code>. Add to it with <code>s.push_str(", Ada")</code> (more text) or <code>s.push(\'!\')</code> (one <code>char</code>), after declaring it <code>let mut</code>.</p>',
        '<p>To build a <code>String</code> out of several values, use <code>format!</code>. It takes the same text and <code>{}</code> placeholders as <code>println!</code> but returns the text instead of printing it. Roughly, <code>&amp;str</code> is like <code>std::string_view</code> and <code>String</code> is like <code>std::string</code>.</p>',
      ],
      examples: [
        {
          code: 'fn main() {\n    let a = "Hello";                  // a string literal: fixed text\n    let mut s = String::from(a);      // a String: owns its text and can grow\n    s.push_str(", Ada");              // append text\n    s.push(\'!\');                      // append one char\n    println!("{}", s);\n}',
          output: 'Hello, Ada!',
        },
        {
          code: 'fn main() {\n    let name = "Ada";\n    let age = 36;\n    let line = format!("{} is {}", name, age);   // like println!, but returns a String\n    println!("{}", line);\n}',
          output: 'Ada is 36',
        },
      ],
      terms: [
        { code: '&str', meaning: 'borrowed, read-only text; the type of a string literal' },
        { code: 'String', meaning: 'text that owns its characters and can grow' },
        { code: 'String::from("x")', meaning: 'makes a String from a literal' },
        { code: 'format!("{}", x)', meaning: 'like println! but returns a String' },
        { code: 's.push_str("x")', meaning: 'appends text to a mut String' },
      ],
    },
    task: 'Use <code>format!</code> to make the String <code>Hello, Ada</code> from <code>name</code>, then append <code>!</code> with <code>push</code> and print it.',
    compare: {
      cpp: { code: `const char* lit = "Hello";
std::string s = lit;
s += ", Ada";`, outcome: 'Literal is const char*, string owns a copy', ok: true },
      rust: { code: `let lit = "Hello";
let mut s = String::from(lit);
s.push_str(", Ada");`, outcome: 'Literal is &str, String owns and grows', ok: true },
      text: 'A string literal is a <code>&amp;str</code>, a read-only view of text stored in the program. <code>String</code> owns growable text, and you build one with <code>format!</code>, which works like <code>println!</code>.',
    },
    refresher: [
      '<code>format!("Hi {}", x)</code> returns a <code>String</code> instead of printing.',
      "<code>s.push('c')</code> adds one char and <code>s.push_str(\"text\")</code> adds text. Both need <code>let mut s</code>.",
    ],
    hints: [
      '<code>format!</code> takes the same arguments as <code>println!</code>.',
      'Declare the result with <code>let mut</code> so you can append to it.',
    ],
    inCpp: {
      code: `std::string_view v = "hi";
std::string s(v);
s += "!";
std::string t = s + " there";`,
      note: 'Roughly, <code>&amp;str</code> is <code>std::string_view</code> and <code>String</code> is <code>std::string</code>. Stage 2 covers the ownership rules that separate them.',
    },
    starter: `fn main() {
    let name = "Ada";
    // build the greeting with format!, add the ! and print it
}`,
    solution: `fn main() {
    let name = "Ada";
    let mut greeting = format!("Hello, {}", name);
    greeting.push('!');
    println!("{}", greeting);
}`,
    require: [
      { pattern: 'format!\\s*\\(', message: 'Use format!' },
      { pattern: '\\.push(_str)?\\s*\\(', message: 'Use push' },
    ],
    tests: [{ name: 'Prints Hello, Ada!', expected: 'Hello, Ada!' }],
  },

  // 32. const and static
  {
    id: 'r1-const-static',
    title: 'const and static',
    kind: 'concept',
    introduces: ['const', 'static'],
    teach: {
      body: [
        '<p>Values that never change and are known when the program is built are written with <code>const</code>: <code>const MAX_PLAYERS: u32 = 4;</code>. The type is required (unlike <code>let</code>), the name is written in <code>UPPER_CASE</code> by convention, and it can be placed outside any function, at the top of the file. It is like <code>constexpr</code> in C++, and the compiler substitutes the value wherever the name is used.</p>',
        '<p><code>static</code> looks similar, <code>static GREETING: &amp;str = "hi";</code>, but it is one fixed place in memory that lives for the whole program, like a C++ global. Use <code>const</code> for numbers and <code>static</code> mostly for fixed text or data you want a single copy of.</p>',
        '<p>A <code>static mut</code> (a global you can change) can only be touched in a special <code>unsafe</code> block. That is deliberate: Rust steers you away from global mutable state, where C++ lets any function change a global freely.</p>',
      ],
      examples: [
        {
          code: 'const MAX_PLAYERS: u32 = 4;      // a constant: the type is required\nstatic GREETING: &str = "hi";    // one fixed piece of text for the whole program\n\nfn main() {\n    println!("{} {}", GREETING, MAX_PLAYERS * 2);\n}',
          output: 'hi 8',
          caption: 'Both live outside main, at the top of the file.',
        },
      ],
      terms: [
        { code: 'const NAME: T = value;', meaning: 'a compile-time constant; the type is required' },
        { code: 'static NAME: T = value;', meaning: 'a single value that lives for the whole program' },
      ],
    },
    task: 'Add a <code>const</code> named <code>LIMIT</code> (a <code>u32</code> equal to 3) and a <code>static</code> named <code>NAME</code> (a <code>&amp;str</code> holding "rust") so the program prints <code>rust 6</code>.',
    compare: {
      cpp: { code: `constexpr int LIMIT = 3;
int counter = 0;   // global mutable: allowed anywhere`, outcome: 'Global mutable state is free', ok: true },
      rust: { code: `const LIMIT: u32 = 3;
static mut COUNTER: u32 = 0;

fn main() {
    COUNTER += 1;
}`, outcome: 'Error: mutable static needs unsafe', ok: false, errorCode: 'E0133' },
      text: '<code>const</code> is a compile-time constant that needs a type and is inlined at each use; <code>static</code> is one fixed place in memory for the whole program. A <code>static mut</code> can only be touched inside <code>unsafe</code>, which steers you away from global mutable state.',
    },
    refresher: [
      'Constants are named in <code>UPPER_CASE</code> and always need a type: <code>const MAX: u32 = 10;</code>.',
      'Both go at the top level, outside any function.',
    ],
    hints: [
      'Two new lines above <code>fn main</code>, each ending in <code>;</code>.',
      'Write the type after a colon: <code>NAME: type = value;</code>.',
    ],
    inCpp: {
      code: `static int calls = 0;
void hit() { calls++; }   // any function may change it`,
      note: 'A C++ global can be changed from any function without ceremony. Rust has no such default: shared mutable state needs <code>unsafe</code> or types you will meet later.',
    },
    starter: `fn main() {
    println!("{} {}", NAME, LIMIT * 2);
}`,
    solution: `const LIMIT: u32 = 3;
static NAME: &str = "rust";

fn main() {
    println!("{} {}", NAME, LIMIT * 2);
}`,
    require: [
      { pattern: 'const\\s+LIMIT\\s*:\\s*u32', message: 'const LIMIT: u32' },
      { pattern: 'static\\s+NAME\\s*:\\s*&', message: 'static NAME: &str' },
    ],
    tests: [{ name: 'Prints rust 6', expected: 'rust 6' }],
  },

  // 33. use
  {
    id: 'r1-use-std',
    title: 'use instead of #include',
    kind: 'concept',
    introduces: ['use'],
    teach: {
      body: [
        '<p>Rust has no header files and no preprocessor. The standard library is organised into modules, and you refer to something inside by its <em>path</em>, with <code>::</code> between the parts. For example <code>std::cmp::max</code> is the function <code>max</code> in the module <code>cmp</code> of the standard library <code>std</code>. You can always write the full path where you use it.</p>',
        '<p>To avoid repeating the path, bring the name into scope once with <code>use</code>, at the top of the file: <code>use std::cmp::max;</code>. After that, plain <code>max(3, 7)</code> works. This is closest to a C++ <code>using</code> declaration, not to <code>#include</code>, because <code>use</code> does not paste any text. Only a small set of very common names (such as <code>Vec</code>, <code>String</code> and <code>println!</code>) is available without a <code>use</code>.</p>',
        '<p>Later you will import collections such as <code>HashMap</code> the same way, and group your own code in modules, a bit like C++ namespaces.</p>',
      ],
      examples: [
        {
          code: 'use std::cmp::max;   // bring max into scope\n\nfn main() {\n    println!("{}", max(3, 7));\n}',
          output: '7',
        },
        {
          code: 'fn main() {\n    // no use line: write the full path at the call\n    println!("{}", std::cmp::min(3, 7));\n}',
          output: '3',
        },
      ],
      terms: [
        { code: 'use std::cmp::max;', meaning: 'imports max so you can write max(...) without the full path' },
        { code: 'std::cmp::min(a, b)', meaning: 'a function called by its full path, with no use needed' },
      ],
    },
    task: 'Add the missing line at the top so this program compiles and prints <code>7</code>, the smaller of the two numbers.',
    compare: {
      cpp: { code: `#include <algorithm>
int m = std::max(3, 7);`, outcome: 'The header text is pasted in', ok: true },
      rust: { code: `use std::cmp::max;
fn main() {
    println!("{}", max(3, 7));
}`, outcome: 'The name is imported by path', ok: true },
      text: 'There are no headers and no preprocessor: <code>use</code> brings a path into scope, and <code>mod</code> groups your own code the way <code>namespace</code> does. Only a small prelude (<code>Vec</code>, <code>String</code>, <code>Option</code> and a few more) is in scope without a <code>use</code>.',
    },
    refresher: [
      'Paths use <code>::</code>. The standard library is <code>std</code>, and comparison helpers live in <code>std::cmp</code>.',
      '<code>use std::cmp::min;</code> at the top of the file lets you write <code>min(a, b)</code>.',
    ],
    hints: [
      'The error says <code>min</code> cannot be found.',
      'Put a <code>use</code> line with the full path at the top of the file.',
    ],
    inCpp: {
      code: `namespace geo {
    int square(int x) { return x * x; }
}
int y = geo::square(4);`,
      note: 'A <code>namespace</code> and a <code>mod</code> look alike, but a module item is private unless marked <code>pub</code>, where every namespace member is visible.',
    },
    starter: `fn main() {
    let a = 12;
    let b = 7;
    println!("{}", min(a, b));
}`,
    solution: `use std::cmp::min;

fn main() {
    let a = 12;
    let b = 7;
    println!("{}", min(a, b));
}`,
    require: [{ pattern: 'use\\s+std::cmp::', message: 'Import from std::cmp' }],
    tests: [{ name: 'Prints 7', expected: '7' }],
  },

  // 34. implement collatz
  {
    id: 'r1-implement-collatz',
    title: 'Collatz steps',
    kind: 'implement',
    introduces: [],
    task: 'Write <code>collatz_steps</code>: count the steps needed to reach 1, where an even n becomes n / 2 and an odd n becomes 3n + 1.',
    refresher: [
      '<code>let mut n = n;</code> makes a mutable copy of an immutable parameter. <code>n % 2 == 0</code> tests for even.',
      '<code>while cond { ... }</code> repeats. <code>if</code> is an expression: <code>n = if ... { ... } else { ... };</code>.',
      'The last expression of the function, with no <code>;</code>, is returned.',
    ],
    hints: [
      'Loop while <code>n</code> is not 1, counting each step.',
      'Compute the next <code>n</code> with an <code>if</code> expression, then add 1 to the counter.',
      'Return the counter as the last line of the function.',
    ],
    inCpp: {
      code: `unsigned collatz_steps(unsigned long long n) {
    unsigned steps = 0;
    while (n != 1) {
        n = (n % 2 == 0) ? n / 2 : 3 * n + 1;
        steps++;
    }
    return steps;
}`,
      note: 'C++ changes a by-value parameter directly. A Rust parameter is immutable, so rebind it with <code>let mut n = n;</code> or declare it <code>mut n: u64</code>.',
    },
    starter: `fn collatz_steps(n: u64) -> u32 {
    0
}`,
    solution: `fn collatz_steps(n: u64) -> u32 {
    let mut n = n;
    let mut steps = 0;
    while n != 1 {
        n = if n % 2 == 0 { n / 2 } else { 3 * n + 1 };
        steps += 1;
    }
    steps
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", collatz_steps(1));
    println!("\\n@@TEST 2@@");
    println!("{}", collatz_steps(6));
    println!("\\n@@TEST 3@@");
    println!("{}", collatz_steps(7));
    println!("\\n@@TEST 4@@");
    println!("{}", collatz_steps(27));
}`,
    tests: [
      { name: 'Already 1', input: '1', expected: '0' },
      { name: 'Six', input: '6', expected: '8' },
      { name: 'Seven', input: '7', expected: '16' },
      { name: 'Twenty-seven', input: '27', expected: '111' },
    ],
  },

]
