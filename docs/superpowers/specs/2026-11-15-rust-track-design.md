# Rust track — design

**Date:** 2026-11-15 · Do not commit; the owner decides when to commit and deploy.

## Why

The owner knows C++ and has never written Rust. They want a Rust track in the same app that is "more teaching heavy,
then followed by the same constructs" as the C++ Foundations track, and that lets them "appreciate any specific Rust
things" through C++ comparisons.

## Approved look and decisions

- The approved look is the mockup `docs/mockups/v5/rust.html` (four step types A–D, C++ | Rust selector under the
  Foundations | Problems switch, "In C++" tab in the rail, Playground notice and waiting state). Treat it as the
  visual and behavioural reference, within the existing Workbench (`app/src/workbench/`, `app/src/foundations/`).
- Concept steps: idea and task on one screen; the idea card can be collapsed.
- Prediction steps: unscored; a wrong pick just reveals the real output and the reason.
- Compiler output is always shown in full, exactly as rustc prints it (trailing lines dimmed), with a one-line gloss above.
- Rust progress is separate from C++ progress.
- Standalone but brisk: the track does not require the C++ one, but does not re-teach what an algorithm is; later
  stages focus on how to say it in Rust.
- Owner's taste (unchanged): white cards, blue palette (green only for pass/done), 8px corners, little text by default,
  no cross-fades or slide-ins on content change, no file tab, no current-line highlight, light and dark of equal quality.

## How Rust runs

- Code is sent to the free official Rust Playground: `POST https://play.rust-lang.org/execute` with JSON
  `{channel:"stable", mode:"debug", edition:"2021", crateType:"bin", tests:false, backtrace:false, code}`; the reply is
  `{success, exitDetail, stdout, stderr}`. Verified 2026-11-15: CORS is open (`access-control-allow-origin: *`).
  The owner accepted code leaving the device for Rust only; say so quietly in the UI.
- The Playground has **no stdin**. Rust lessons never read input; every test is built into the lesson.
- **One request per Check or Run.** Requests are serialised, never sent on keystrokes, and a failed or rate-limited
  request shows a plain retry message. Debug mode is deliberate: integer overflow panics, which is teaching material.
- Content is verified locally with the owner's installed `rustc` (edition 2021), never against the Playground.

## Lesson data

Files: `app/src/data/rust/index.js` (`STAGES`, `LESSONS`) and `app/src/data/rust/stage-N-*.js` (plain JS, no imports).
Pure helpers shared by app and checker: `app/src/rust/grade.js`. Checker: `app/scripts/verify-rust.mjs`.

### Shape (all kinds)

```js
{
  id: 'r2-moves-not-copies',     // unique slug, prefixed r1-…r7-
  title: 'Moves, not copies',    // ≤ 40 chars
  kind: 'concept',               // 'concept' | 'predict' | 'fix' | 'implement' | 'drill' | 'bugfix'
  task: '…',                     // HTML, ≤ 240 chars of text (the "Your turn" line for concept steps)
  refresher: ['…'],              // 1–3 HTML items, ≤ 200 chars each
  hints: ['…', '…'],             // 2–3, never the full answer (not for 'predict')
  inCpp: { code: '…', note: '…' }, // optional "In C++" tab: the C++ way and one sentence on the difference
  starter: '…', solution: '…',   // Rust; not for 'predict'
  harness: '…',                  // optional Rust appended after the learner's code; defines fn main()
  tests: [{ name, expected, input? }], // see grading
  require:   [{ pattern, message }], // optional regex checks the learner's code must satisfy (shown as chips)
  forbidden: [{ pattern, message }], // optional regex checks that block the check
}
```

Extra fields by kind:

- `concept`: `compare: { cpp: { code, outcome, ok }, rust: { code, outcome, ok }, text }` — two short snippets side by
  side, each with a one-line outcome (`ok: true` = works, `false` = error), and `text` of at most two sentences.
- `predict`: `rounds: [{ snippet, choices: ['…','…','…'], answer: 0, why: '…', output: '…' }]` (1–2 rounds).
  `output` is the real rustc error text (file name shown as `src/main.rs`) or the program's stdout; it is stored in the
  lesson so the reveal is instant and needs no network. For error rounds also give `errorCode: 'E0382'`.
- `fix`: `starter` must fail to compile; give `errorCode` (e.g. `'E0502'`) and `gloss` (one plain sentence explaining
  the error). `require` keeps the learner from deleting the point of the exercise.

### Grading

- With a `harness`: source = learner code + harness. The harness `main()` runs every test in order and, before each,
  prints a marker line `@@TEST n@@` (n from 1); what follows until the next marker is that test's output and is
  compared, whitespace-normalised, with `tests[n-1].expected`. A panic ends the run: later tests are "not run" and the
  panic message (stderr) is shown.
- Without a `harness`: the learner's code is the whole program; there is exactly one test and the whole stdout must
  equal `tests[0].expected`.
- A compile failure shows the full compiler output and is not counted as a miss (as in C++).

### Checker requirements (`verify-rust.mjs`, local rustc)

For every lesson: fields and text limits; `solution` compiles without errors and passes every test; `starter` does not
pass (for `fix`: fails to compile with `errorCode`; otherwise fails a test or fails to compile); `require`/`forbidden`
are satisfied by the solution; every `predict` round really behaves as claimed (compiles and prints `output`, or fails
with `errorCode`); every `compare.rust` snippet compiles or fails as its `ok` flag says; every `compare.cpp` and
`inCpp.code` snippet with `ok !== false` at least passes `clang++ -std=c++17 -fsyntax-only` when wrapped as needed.
Warnings are allowed. No lesson may use external crates, stdin, threads, time or randomness.

## Curriculum and concept coverage

Teaching stages (1–3) are mostly `concept`, `predict` and `fix` steps, each followed by a small task; every concept
listed below must be covered by at least one step, and each step teaches one idea. Later stages are `implement`,
`drill` and `bugfix` like the C++ track, with an `inCpp` tab wherever the C++ version differs in an instructive way.

### 1. Rust for C++ people (~15)

- `fn main`, `println!` and why macros end in `!`; `{}` vs `{:?}` (Display vs Debug)
- `let` is immutable by default; `mut`; contrast with `const` in C++
- Shadowing vs reassignment
- Integer types with explicit sizes; `usize` for lengths and indices; no implicit numeric conversions; `as`
- Overflow: panics in debug instead of wrapping or UB; `wrapping_*`, `checked_*`, `saturating_*`
- Everything is an expression: `if` and blocks produce values; no ternary; statements vs expressions and the `;`
- Functions: annotated parameters and return type, last expression returns, no overloading, no default arguments
- Tuples and destructuring; the unit type `()`
- Arrays, `Vec` and slices at first sight; indexing is bounds-checked (panic, not UB); `.get()` returns an `Option`
- Loops: `loop` with `break value`, `while`, `for` over ranges and collections; no C-style `for`; labelled breaks
- `match`: exhaustive, no fallthrough, ranges, multiple patterns, guards, `_`; compared with `switch`
- `const` and `static`; no global mutable state without effort
- Modules and `use` instead of headers and `#include`; `std::collections`
- Strings at first sight: string literals are `&str`, growable text is `String`, `format!`

### 2. Ownership and borrowing (~18)

- Assignment moves: `let b = a;` invalidates `a` (C++ copies)
- `Copy` types (integers, bool, char, tuples of them) vs move types
- `.clone()` is the explicit deep copy (C++ copy constructors run silently)
- Passing to a function moves; returning hands ownership back
- Scope ends → value dropped: RAII without writing destructors; `drop()`; `Drop` exists
- Shared borrow `&T`: read without taking ownership
- Mutable borrow `&mut T`: exclusive access
- The rule: many readers or one writer, never both (E0502, E0499); the C++ iterator-invalidation bug it prevents
- Borrows end at their last use, not at the closing brace
- Dangling references are compile errors (E0515, E0106); the same code compiles in C++ and is undefined behaviour
- Slices `&[T]` and `&mut [T]` as borrowed views (compare `std::span`)
- `String` vs `&str` properly (compare `std::string` vs `std::string_view`); UTF-8; why `s[i]` does not compile;
  `chars()`, `bytes()`, `as_bytes()`
- Lifetimes: what elision does for you, and when you must write `'a` (the `longest` example)
- A struct that holds a reference needs a lifetime
- Mutating while iterating: `iter_mut`, index loops, `swap`, `split_at_mut`; indices instead of references
- You cannot move out of a `Vec` by index: `std::mem::take`, `mem::replace`, `Option::take`, `swap_remove`
- `Box<T>`: one owner on the heap (compare `unique_ptr`); needed for recursive types
- `Rc<T>` and `RefCell<T>`: shared ownership and checked-at-runtime mutation (compare `shared_ptr`); when a graph or
  tree needs them and what it costs

### 3. Types that replace C++ habits (~18)

- Structs, `impl` blocks, `&self` / `&mut self` / `self`; associated functions like `new` instead of constructors
- No inheritance; `#[derive(Debug, Clone, PartialEq, …)]` instead of hand-written boilerplate
- Enums that carry data, matched exhaustively (compare tagged unions and `std::variant`)
- `Option<T>` instead of null pointers and sentinel values like `-1`: `match`, `if let`, `unwrap_or`, `map`, `?`
- `Result<T, E>` and `?` instead of exceptions; `panic!` vs recoverable errors; `unwrap` / `expect`
- Traits as interfaces: defining one, implementing it for a type, default methods
- Generics with trait bounds, checked where they are defined (compare templates and concepts); `impl Trait`
- `dyn Trait` and `Box<dyn Trait>` for runtime dispatch (compare virtual functions)
- Comparison and hashing traits: `PartialEq`/`Eq`, `PartialOrd`/`Ord`, `Hash`; `Ordering` and `cmp`;
  why `f64` is not `Ord` (`partial_cmp`, `total_cmp`)
- `Display`, `Default`, `From`/`Into`
- Closures and what they capture: `Fn`, `FnMut`, `FnOnce`, `move` (compare lambda capture lists)
- Iterators are lazy: `iter` vs `iter_mut` vs `into_iter`; `map`, `filter`, `enumerate`, `zip`, `rev`, `collect`
- Consuming iterators: `sum`, `fold`, `min`/`max`, `any`/`all`, `position`, `count`
- Deeper patterns: destructuring structs and tuples, `while let`, `let … else`, slice patterns, `@` bindings
- `usize` arithmetic pitfalls: subtracting past zero, `saturating_sub`, `checked_sub`, casting with `as` vs `try_from`
- Visibility and modules: `pub`, private by default
- Tests: `#[test]` and `assert_eq!`, shown so the learner can read them

### 4. Sort and search by hand (~10)

Bubble, selection, insertion, merge and quick sort on `&mut [i32]`; counting sort; binary search; lower and upper
bound; a bugfix (binary search that never ends or underflows `usize`); sort records with `sort_by` (bridge to stage 6).

### 5. Build it yourself (~13)

Stack; circular queue; min-heap; hash map with chaining; singly linked list with `Option<Box<Node>>`; reverse a linked
list with `take()`; binary search tree (insert, contains, in-order); delete from a BST; trie; graph with adjacency
lists and BFS; DFS (iterative, with a note on recursion depth); union-find; and one concept step on why a doubly
linked list is hard in safe Rust.

### 6. Standard collections (~18 drills)

`Vec` essentials; `sort`, `sort_unstable`, `sort_by`, `sort_by_key`, `Reverse`; `binary_search` and
`partition_point`; `dedup`, `retain`, `drain`; `VecDeque`; `HashMap` and the entry API; `HashSet`; `BTreeMap` (ordered
iteration, `range`, first/last); `BTreeSet`; `BinaryHeap` and `Reverse` for a min-heap; string processing (`chars`,
`bytes`, `split_whitespace`, `parse`); byte arithmetic (`b'a'`); iterator chains with `windows`, `chunks`, `zip`,
`step_by`; `fold` and `scan`; 2D grids as `Vec<Vec<T>>`; `swap`, `mem::swap`, `mem::replace`; two bugfixes.

### 7. Algorithms (~22)

The same list as the C++ track: subsets, permutations, N-Queens, prefix sums, 2D prefix sums, two pointers, sliding
window, binary search on the answer, BFS on a grid, count components, cycle detection, topological sort, Dijkstra,
Bellman-Ford, Kruskal, climbing stairs, house robber, coin change, 0/1 knapsack, LIS, LCS, edit distance.

## Build order

1. Scaffold: data files, `grade.js`, `verify-rust.mjs`, and one verified example lesson of each kind.
2. Lessons, one subagent per stage, each passing the checker.
3. App: Playground runner, the three new step types, the "In C++" tab, the track selector, separate Rust progress,
   and a browser self-test that runs every reference solution through the real Playground path sparingly.
4. Lead verifies; owner reviews; deploy on the owner's say.

## Authoring notes

Reference lessons (one per kind, all verified): `docs/superpowers/specs/rust-lesson-examples.js`. Copy their shape.
Files: stage 1 `stage-1-basics.js`; 2 `stage-2-ownership-a|b.js`; 3 `stage-3-types-a|b.js`; 4 `stage-4-sorting.js`;
5 `stage-5-build.js`; 6 `stage-6-collections-a|b.js`; 7 `stage-7-algorithms-a|b.js`. Each exports
`LESSONS = [...]` (plain objects, no imports). Ids are `r<stage>-slug` and unique across the track.

### Contract details beyond the shape above

- **Kinds.** `concept`/`fix`: at least 1 test; `implement`/`drill`/`bugfix`: at least 3. A lesson without a `harness`
  has exactly one test. `predict` has no `starter`, `solution`, `harness`, `tests` or `hints`; every other kind has
  2 to 3 `hints`. Unknown fields are rejected (catches typos). `test.input` is only the label shown in the UI.
- **Text limits** (HTML tags and entities not counted): title 40; task 240; refresher 1 to 3 items of 200; hints 200;
  `inCpp.note` at most 2 sentences and 300; `compare.text` at most 2 sentences and 300; `compare.*.outcome` 60;
  `gloss` 200 and 2 sentences; predict `choices` exactly 3 of at most 60, `why` 240.
- **fix.** The starter must fail to compile with `errorCode` and must itself satisfy every `require` (so the learner
  cannot "fix" it by deleting the point). The solution compiles and passes the test.
- **concept.** `compare.rust.code` is wrapped in `fn main() { ... }` when it has no `fn main`; `ok` says whether
  it compiles; optional `compare.rust.errorCode` is then enforced. `compare.cpp` is only checked when `ok !== false`.
- **predict.** Each round is a whole program (it needs `fn main`). A round either fails to compile (give `errorCode`)
  or runs to completion with exit 0. Optional `panic: true` is also supported: `output` is then the panic message
  (the text after the `panicked at <location>:` line). Prefer snippets without warnings so `output` stays small.
- **Determinism.** No stdin, external crates, threads, time, randomness or env/fs/net/process. Programs that
  mention `HashMap`/`HashSet` are run twice; printing in map order is rejected. Sort keys before printing.
- **Optional lesson fields.** `cppUnchecked: true` skips C++ checking for snippets that cannot be wrapped (listed
  as a count at the end of the run). `cppStd: 20` raises the language level for the lesson's C++ snippets (e.g. `std::span`).

### Harness conventions

The harness is Rust appended after the learner's code (`learner code + "\n" + harness`), so their line numbers match
the compiler output. The learner writes only the function(s); the harness defines `fn main`, calls them once per
test and prints a marker line first. Print the marker as `println!("\n@@TEST n@@")` (the `\n` guarantees the marker
starts a line), n from 1, in the order of `tests`. The text after a marker, up to the next marker, is compared with
`tests[n-1].expected` after whitespace normalisation (trailing spaces per line and outer blank lines are ignored).
Anything printed before `@@TEST 1@@` is shown to the learner but not graded. Name harness helpers with a
`harness_` prefix so they cannot collide with the learner's functions. Minimal harness:

```rust
fn main() {
    println!("\n@@TEST 1@@");
    println!("{}", add(2, 3));      // expected "5"
    println!("\n@@TEST 2@@");
    println!("{}", add(-1, 1));     // expected "0"
}
```

Panics: a panic ends the process. The test that was running is reported as failed with the panic message shown
(`grade.js` `panicMessage`), and every later test is "not run". So an overflow or out-of-bounds in test 3 never
hides that tests 1 and 2 passed. The checker also fails a solution whose harness prints fewer or more markers than
there are tests.

### require and forbidden

Both are `[{ pattern, message }]` where `pattern` is a JS RegExp source string without flags (so backslashes are
doubled in a normal string: `'\\.sort\\s*\\('`). They are matched against the learner's code with comments removed
(string literals are kept). `require` chips must all be met to pass; a `forbidden` hit blocks the check and shows its
message. The checker enforces that the solution meets every `require` and hits no `forbidden`; the starter of a
`fix` lesson must also meet every `require`; for other kinds the starter counts as passing only if it compiles,
passes all tests, meets `require` and avoids `forbidden`.

### Capturing predict output

Write the snippet to `src/main.rs` in a scratch directory and run from that directory so paths read `src/main.rs`:

```sh
mkdir -p src && cp snippet.rs src/main.rs
rustc --edition 2021 --color never -C debuginfo=0 -o main src/main.rs 2>&1   # error rounds: paste this as `output`
./main                                                                          # ok rounds: paste stdout as `output`
```

The checker compiles the same way and requires, for error rounds, that `output` contains the error code and the
real compiler's first `error[...]: ...` line (not a byte-exact diagnostic, since rustc versions differ).

### Wrapping rule for C++ snippets

`compare.cpp.code` and `inCpp.code` are checked with `clang++ -std=c++17 -fsyntax-only` after a prelude of common
standard headers and `using namespace std;`. The snippet passes if ANY of three attempts passes: (1) as is (own
`main`, or only functions and types); (2) the whole snippet inside `int main() { ... }`; (3) everything up to the last
line that is exactly `}` or `};` at column 0 kept at file scope, the rest inside `int main()`. If none fits, shorten
the snippet or set `cppUnchecked: true`.

### Running the checker

From `app/` (uses the installed `rustc`, edition 2021, debug build, and `clang++`):

```sh
node scripts/verify-rust.mjs                      # everything
node scripts/verify-rust.mjs --stage 2            # one stage (counts both -a and -b files)
node scripts/verify-rust.mjs --only r2-moves-not-copies
```

Prints `ok` or `FAIL` plus reasons per lesson; exits non-zero on any failure or when no lesson was checked.

## Teaching fields and the taught-before-used rule

Added after the first review ("I don't know what `println!` is, how to iterate, or how indexing works"). The track is
teaching heavy: a lesson must explain every new symbol in plain words, in a track the learner reads from zero. The old
2-sentence cap applied to a memory-jog track; it now applies only to side notes. Stage 1 (`stage-1-basics.js`) is the
reference; read the first five lessons before rewriting a stage.

### New fields

```js
teach: {
  body: ['<p>html paragraph</p>', ...],      // 1-5 short paragraphs, no length cap; plain words, define every term
  examples: [{ code, output?, caption?, wrap? }],   // 1-3 small examples, every line explained by a // comment
  terms: [{ code: 'println!("...")', meaning: 'prints a line of text and a newline' }],  // "New in this lesson"
},
introduces: ['println', 'placeholder-display'],     // ids from src/rust/syntax.js
```

- `teach` is required for every `concept` lesson in a migrated stage and for any lesson whose `introduces` is non-empty
  (also a `fix` lesson that teaches something new, such as `as`). Practice lessons (predict, fix, implement) that
  introduce nothing omit it and write `introduces: []`. Every lesson in a migrated stage needs `introduces` (maybe `[]`).
- `compare` stays, but as the bridge AFTER the teaching. Limits unchanged for `compare.text`, `inCpp.note` and `gloss`
  (at most 2 sentences and 300 characters; the splitter counts `! ` and `... ` as sentence ends, so write
  `<code>println!</code>,` or reword). `refresher` stays a short recap. `teach` has no such limits.
- Order of a teaching lesson: `teach` (what it is, how to write it, why Rust does it this way), `terms`, then the task,
  then `compare` and `inCpp` for C++ readers. Teach what the symbols mean before showing how C++ differs.
- Keep exercises to one new idea. Say honestly when something is used "for now" (for example `&str` before borrowing).
- `teach.examples[].code` must compile and run as a full program, and `output` (if given) must match stdout exactly
  (trimmed). Use `wrap: true` for a fragment; the checker wraps it in `fn main() { ... }`. An example cannot panic.
  Show errors and panics in `compare` or a `predict` lesson instead.

### Syntax registry and the rule

`app/src/rust/syntax.js` exports `SYNTAX`, a list of `{ id, label, patterns, strings?, raw? }` for the Rust syntax a
beginner meets across the whole track (printing, placeholders, `let`/`mut`, types, operators, control flow, functions,
tuples, arrays/Vec, match, strings, references, structs, traits, generics, Option/Result, closures, iterators, ...).
Patterns run on code with comments removed and string contents blanked; `strings` patterns see string contents (for
`{}`, `{:?}`); `raw` sees the untouched source (comments). `detectSyntax(code)` and `codeSpans(html)` are exported.

The checker (`verify-rust.mjs`) applies the rule in track order (`index.js` order): every id detected in a lesson's
learner-facing Rust code, namely `teach.examples` code, `compare.rust.code`, `starter`, `solution`, predict round
snippets and the `<code>` spans in `task` and `hints`, must be in the union of `introduces` of that lesson and all
earlier lessons. Failures read `uses {:?} (placeholder-debug) before it is taught`. Also checked: every `introduces` id
exists in the registry, `terms` entries are non-empty, examples compile and print `output`.

Only migrated lessons are checked: those with a `teach` field, and every lesson of a stage listed in `MIGRATED_STAGES`
in the checker (index 0 = stage 1). Un-migrated lessons contribute nothing to the taught set. To migrate a stage: add
its index to `MIGRATED_STAGES`, give each lesson `introduces` (and `teach` where required), and run
`node scripts/verify-rust.mjs --stage N`. Stage 2 starts with stage 1's taught set, so `&`, `.clone()`, `Box` and
friends are the ids to introduce there (`reference`, `ref-mut`, `clone`, `box`, `rc`, `refcell`, `lifetime`, ...).

When a rewrite needs syntax the registry cannot see or sees wrongly, fix the pattern in `syntax.js` (add ids freely;
keep patterns specific enough to ignore comments, strings and generics). What stage 1 taught: `fn main`, `println!`,
`print!`, string literals, `;`, comments, `{}` and `{:?}`, `let`, `mut`, integer types, `f64`, type annotations,
arithmetic, `as`, `::` paths and `T::MAX`, method calls, `wrapping_*`/`saturating_*`, `if`/`else`, comparisons,
`bool`, `&& || !`, `if` as expression, `while`, `+=`, `for` over ranges, `loop`/`break`/`continue`/labelled break,
arrays and indexing and `.len()`, `Vec`/`vec!`/`push`/`Vec<T>`, function definitions with parameters, `->` and
`return`, tuples and destructuring and `()`, `match` with `_`, `|`, ranges and guards, `char`, `&str`/`String`/
`String::from`/`format!`/`push_str`, `const`, `static`, `use`. NOT taught (stage 2+ introduces them): `&`/`&mut`
borrowing, `.clone()`, slices `&[T]`, `.get()`, `Option`/`Some`/`None`, `Result`, `?`, structs, enums, traits,
generics, closures, iterators, `HashMap`.

### What stage 2 taught (the starting set for stage 3)

Stage 2 (`stage-2-ownership-a|b.js`, 33 lessons, migrated) is checked with `MIGRATED_STAGES` containing index 1. Set
`RUST_MIGRATED=2,3` (0-based, comma-separated) to verify later stages as migrated without editing the checker.

Ids introduced (registry): `clone`, `drop`, `reference` (`&x`, `&String`), `ref-mut` (`&mut`), `deref` (`*x`),
`slice-ref` (`&[T]`, `&mut [T]`), `slice-range` (`&v[a..b]`, `..b`, `a..`, `..`), `chars-bytes` (`.chars()`,
`.bytes()`, `.as_bytes()`), `count-method` (`.count()`), `byte-literal` (`b'a'`), `lifetime` (`'a`, `<'a>`, `&'a`,
`'static`), `slice-swap` (`.swap()`, `.split_at_mut()`), `mem-fns` (`mem::take`/`replace`), `vec-remove` (`.remove()`,
`.swap_remove()`), `box`, `rc`, `refcell`. New registry ids added for this: `chars-bytes`, `count-method`,
`slice-swap`, `vec-remove`; `string-methods` no longer includes them, and `generic-params` no longer matches `<'a>`.

What the learner now knows in words: one owner and drop at scope end; assignment and argument passing move
`String`/`Vec`/`Box`; `Copy` types (integers, floats, bool, char, `&str`, tuples/arrays of them) copy; `Copy` and `Drop`
are named as traits only (stage 3 teaches traits); `.clone()` deep copy; `drop(x)`; `&` read-only borrows, `&mut`
exclusive borrows, "many readers or one writer", borrows end at last use (E0382, E0499, E0502, E0596, E0515, E0597,
E0106, E0507, E0277 for `s[0]`); `for x in v` moves, `for x in &v`, `for x in &mut v`; slices and `&str` as views
with automatic `&String`/`&Vec<T>` to `&str`/`&[T]` coercion at calls (explained, not named); UTF-8 bytes versus
`char`s; `fn f<'a>` lifetimes and elision for one input; `split_at_mut`; `Box<T>` and `*b`; `Rc`/`Rc::clone`/
`Rc::strong_count`; `RefCell` with `.borrow()`/`.borrow_mut()` and the run-time "already borrowed" panic; the word
"iterator" is mentioned once (for `.chars()`/`.bytes()`) with a promise that stage 3 explains it.

NOT taught in stage 2 (stage 3 must teach): `struct`, `impl`, `self`, `Option`/`Some`/`None`, `Result`, `?`, enums,
traits, generics (`fn f<T>`), closures, iterator methods (`.iter()`, `.map()`, `.sum()`, ...), `.unwrap()`, `.get()`,
`.is_empty()`, `.to_string()`, `.trim()`/`.split()`/`.parse()`, `.contains()`, `HashMap`. Deliberately deferred to
stage 3 because they need struct and `Option`: a struct that holds a reference (`struct View<'a>`), and the recursive
`Option<Box<Node>>` list (old `r2-fix-recursive-type` and `r2-box-list` were removed). Stage 3 should therefore teach
`Box` for recursive types (the stage 2 Box lesson only promises it) and `struct` with a lifetime parameter.


### What stage 3 taught (the starting set for stage 4)

Stage 3 (`stage-3-types-a|b.js`, 59 lessons, migrated) is verified with `MIGRATED_STAGES` containing index 2 (now
permanent in the checker). Order and ids, grouped: structs `r3-struct`, `r3-struct-impl`, `r3-self-receivers`,
`r3-self-kinds`, `r3-account-methods`, `r3-struct-borrow` (struct with `<'a>`), `r3-derive`; enums `r3-enum-basic`,
`r3-match-exhaustive`, `r3-enum-data`; Option `r3-option-idea`, `r3-option-find`, then `r3-closure-basics` (closures come
before Option's `map`), `r3-option-ergonomics`, `r3-option-not-value`; `Box` recursion `r3-box-recursive`, `r3-box-list`;
text `r3-string-methods`; Result `r3-result-idea`, `r3-result-halve`, `r3-question-mark`, `r3-unwrap-expect`,
`r3-unwrap-panics`, `r3-sum-csv`; traits `r3-trait-define`, `r3-trait-default`, `r3-generics-intro`, `r3-generic-bounds`,
`r3-trait-bound-unmet`, `r3-impl-trait`, `r3-dyn-trait`; std traits `r3-derive-compare`, `r3-f64-total-order`,
`r3-hash-key`, `r3-display`, `r3-default`, `r3-from-into`; closures `r3-closure-capture`, `r3-closure-fn-traits`,
`r3-closure-fnmut`, `r3-closure-move`, `r3-closure-move-predict`, `r3-count-if`; iterators `r3-iter-idea`, `r3-iter-kinds`,
`r3-iter-adaptors`, `r3-iter-lazy`, `r3-iter-moved`, `r3-iter-consume`, `r3-iter-more`, `r3-iter-practice`; patterns
`r3-pattern-destructure`, `r3-while-let`, `r3-let-else`, `r3-at-binding`; numbers `r3-usize-underflow`,
`r3-as-try-from`; modules and tests `r3-visibility`, `r3-tests-assert`.

Registry ids introduced (in addition to stages 1 and 2): `struct`, `impl`, `self` (`self`, `&self`, `&mut self`, `Self`),
`derive`, `attribute`, `placeholder-pretty` (`{:#?}`), `enum`, `option` (`Option`/`Some`/`None`), `get` (`.get()`),
`closure`, `if-let` (`if let` and `while let`), `unwrap-or`, `map-method` (`.map()`), `option-methods` (`.is_some()`,
`.is_none()`, `.is_ok()`, `.is_err()`, `.ok()`, `.ok_or()`, `.map_err()`, `.and_then()`, `.as_ref()`, `.as_mut()`),
`string-methods` (`.trim()`, `.split*()`, `.parse()`, `.replace()`, `.starts_with()`, `.to_uppercase()`, `.lines()`...),
`to-string` (`.to_string()`, `.to_owned()`), `is-empty`, `result` (`Result`/`Ok`/`Err`), `turbofish` (`::<T>`),
`question-mark`, `unwrap` (`.unwrap()`, `.expect()`), `panic-macro`, `trait`, `trait-impl` (`impl Trait for Type`),
`generic-params` (`fn f<T>`, `struct S<T>`, `impl<T>`), `where`, `impl-trait` (`&impl Trait`, `-> impl Trait`), `dyn`,
`cmp-ordering` (`Ordering`, `.cmp()`, `.partial_cmp()`, `.total_cmp()`), `collection-methods` (`.sort()`, `.sort_by()`,
`.insert()`, `.contains()`, `.first()`, `.join()`, ...), `hashmap` (`HashSet`/`HashMap`, only `new`, `insert`, `contains`,
`len` shown, stage 6 teaches them properly), `write-macro` (`write!`), `iter` (`.iter()`, `.iter_mut()`, `.into_iter()`),
`iter-adapters` (`.filter`, `.enumerate`, `.zip`, `.rev`, `.take`, `.skip`, `.step_by`, `.copied`, `.windows`, `.chunks`...),
`collect` (`.collect()`), `iter-consumers` (`.sum`, `.product`, `.fold`, `.any`, `.all`, `.find`, `.position`...),
`min-max` (`.min()`, `.max()`, `.clamp()`), `pop` (`.pop()`), `let-else`, `at-binding` (`x @ 1..=9`), `num-methods`
(`.abs_diff()`, `.pow()`, `.abs()`, `.sqrt()`...), `mod`, `pub`, `assert-macro`, `test-attr`. Registry changes made for
this: `impl-trait` was split into `trait-impl` and `impl-trait`; `unwrap` was split into `unwrap`, `unwrap-or`,
`option-methods`; `.map(` moved out of `iter-adapters` into `map-method`; `.collect(` moved out of `iter-consumers`
into `collect`; `write!`/`writeln!` moved out of `other-macro` into `write-macro`; `let-else` is new.

NOT taught in stage 3 (later stages must introduce them): `HashMap` beyond `HashSet::new/insert/contains/len` (`entry`,
`get`, indexing a map), `BTreeMap`/`VecDeque`/`BinaryHeap`, `unsafe`, `type` aliases, `1_000`/`5u8` literal forms,
`{name}` / `{:>5}` / `{0}` placeholders and `{{ }}`, `todo!`/`unreachable!`/`matches!`/`eprintln!`, `Rc<RefCell<..>>` with
structs (stage 2's `Rc`/`RefCell` are only the plain forms), `impl Iterator for`, `dyn Fn` / `Box<dyn Fn>` beyond a passing
mention, `Cow`, `Iterator` as a named trait, tuple structs (`struct Meters(f64)`), `where` on impls, `Option::take`,
`as_deref`, `split_once`, `char::is_*` methods (only `to_digit` and `to_ascii_uppercase` appear, each explained once).
Facts the learner now has: unit structs (`struct Robot;`) were shown once in `r3-trait-default` and used in
`r3-dyn-trait`; `use std::fmt;` and `std::collections::HashSet` are the only `use` forms shown; `cmp`/`sort` need `Ord`,
floats are sorted with `sort_by(|a, b| a.total_cmp(b))`; `Result<_, std::num::ParseIntError>` is the error type of
`parse::<i32>()`; `?` converts errors with `From` (shown in `r3-from-into`). Stage 4 (sorting) may use: `&mut [i32]`,
`.len()`, `.swap()`, `usize` subtraction pitfalls (`saturating_sub`, `checked_sub`), `Vec`, `Option`, `if let`,
`while let`, closures, iterators and `.sort()`/`.sort_by()`, tuples, `assert_eq!`, structs and `impl`.

### What stage 4 taught (the starting set for stage 5)

Stage 4 (`stage-4-sorting.js`, 16 lessons, rewritten with `teach`; verify with `RUST_MIGRATED=3`) adds no new syntax beyond
two registry ids, `vec-bulk` (`Vec::with_capacity`, `.extend_from_slice`, `.copy_from_slice`, `.to_vec`) and
`ordering-chain` (`.then`, `.then_with`). Order: `r4-in-place` (`&mut [i32]` in-place shape, `swap`, `1..n` empty range,
`usize` underflow), `r4-bubble-sort`, `r4-selection-sort`, `r4-insertion-sort` (`while j > 0 && v[j - 1] > v[j]`,
short-circuit `&&`), `r4-predict-usize-down` (panic predict), `r4-merge-two` (`vec-bulk`), `r4-merge-sort` (recursion on
`&mut v[..mid]` / `&mut v[mid..]`, `copy_from_slice`; starter gives `merge`), `r4-partition` (Lomuto, `store` index),
`r4-quick-sort` (starter gives `partition`; sequential sub-slice borrows, `split_at_mut` only mentioned),
`r4-counting-sort` (`[0; 101]`, `as usize` indexing, `enumerate`, `*count`), `r4-sort-by-key` (stable vs unstable),
`r4-sort-records` (`sort_by` + `.then`, `ordering-chain`), `r4-binary-search` (half-open `lo..hi`, `Option<usize>`),
`r4-lower-upper-bound`, `r4-bugfix-binary-search-underflow`, `r4-std-search` (`binary_search` giving `Ok`/`Err`,
`partition_point`, `Vec::insert`). Not taught: `std::cmp::Reverse` (id `binaryheap`), `sort_unstable_*` only named,
`&x` patterns in `for` and closures (avoided in stage 4 code), literal suffixes such as `0usize` (avoided).

### What stage 6 taught (the starting set for stage 7)

Stage 6 (`stage-6-collections-a|b.js`, 27 lessons, migrated; verify with `RUST_MIGRATED=5`) is the Rust equivalent of the
STL stage. Every lesson has `teach` (purpose, the handful of methods that matter with output, complexity, pitfalls and the
STL equivalent in words), and no registry ids were added. Order: `r6-collections-tour` (concept: STL-to-Rust map,
`use std::collections::{A, B}`, `::new()`, `insert`/`push_back`; introduces `hashmap`, `btree`, `vecdeque`),
`r6-vec-essentials` (push/pop/insert/remove/`extend_from_slice`/`is_empty`), `r6-vec-look` (`first`/`last`/`.copied()` on
`Option`/`contains`/`truncate`/`reverse`/`clear`), `r6-sort-family` (`sort` is stable = `stable_sort`, `sort_unstable` =
`std::sort`, `sort_by`, `then_with`, `sort_by_key`; `Reverse` deliberately left to the heap lesson because the registry
id `binaryheap` covers it), `r6-binary-search` (`Ok`/`Err` positions, `partition_point`, `|&v|`), `r6-dedup-retain-drain`,
`r6-vecdeque-basics` (queue loop with `while let Some(x) = q.pop_front()`), `r6-vecdeque` (monotonic deque, `Some(&b)`),
`r6-hashmap-basics` (`insert` returns the old value, `get` gives `Option<&V>`, `contains_key`, `remove`, `m[&k]` panics,
`values`, `into_iter().collect()` then sort), `r6-hashmap-entry` (`entry`/`or_insert`/`or_default`/`and_modify`, `*` on
the returned `&mut`), `r6-hashmap-group` (`entry(k).or_default().push(x)`, `or_insert_with(Vec::new)`),
`r6-hashset-basics` (`insert` returns `bool`), `r6-hashset` (`intersection`/`union`/`difference`/`symmetric_difference`/
`is_subset`/`is_disjoint`), `r6-btreemap-basics` (sorted iteration), `r6-btreemap` (`first_key_value`/`last_key_value`/
`pop_first`/`range`, `|(&k, &v)|`), `r6-btreeset` (`first`/`last`, `range(..x).next_back()`, `Excluded`/`Unbounded` with
`use std::ops::Bound::{Excluded, Unbounded}`), `r6-binaryheap-basics` (max-heap: `push`/`pop`/`peek`/`from`/
`into_sorted_vec`, order inside is unspecified), `r6-binaryheap` (`Reverse`, `Some(Reverse(x))`, tuple entries,
`sort_by_key(|&x| Reverse(x))`), `r6-string-processing` (`split_whitespace`, `parse::<i32>()`, `chars().next()`,
`String::push`, `chars().rev().collect::<String>()`), `r6-byte-arithmetic` (`as_bytes`, `b'a'`, `is_ascii_lowercase`,
`[usize; 26]`, `(b'a' + i as u8) as char`), `r6-iterator-chains` (`windows`/`chunks`/`step_by`/`rev`), `r6-fold-scan`,
`r6-iter-queries` (the full `<algorithm>` to Rust table; `position`/`any`/`all`/`find`/`max_by_key`/`min_by_key`, tie
rules), `r6-grid-2d` (`vec![vec![0; c]; r]`, direction pairs, `as i32` arithmetic), `r6-swap-replace-take`
(`mem::swap`/`take`/`replace`, `first_mut`; the `require` patterns use `(?<![.\w])(?:mem::)?swap\s*\(` so both `mem::swap(a, b)`
and `use std::mem::swap; swap(a, b)` pass while the method `v.swap(i, j)` does not), `r6-bugfix-word-count`,
`r6-bugfix-grid-edges`. Not taught: `BTreeMap::entry` APIs beyond what HashMap showed, `retain` on maps, `sort_by_cached_key`
(only named), `Vec::splice`, `chunks_exact`, `binary_search_by`. Literal suffixes such as `0usize` are avoided (use
`let x: usize = 0` or `[usize; 26]`).

### What stage 5 taught (the starting set for stage 6 and 7)

Stage 5 (`stage-5-build.js`, 19 lessons, verify with `RUST_MIGRATED=4`) builds data structures by hand. Order: `r5-stack`,
`r5-circular-queue`, `r5-min-heap`, `r5-bucket-index` (`rem_euclid` with `as` casts), `r5-hash-map-chaining`, `r5-list-shape`
(concept, E0507 and `.take()`), `r5-linked-list`, `r5-reverse-list`, `r5-bst-read` (`contains`, `in_order`), `r5-bst` (insert
through `&mut Option<Box<Node>>`), `r5-fix-move-out-of-node` (fix, E0507), `r5-bst-pop-min`, `r5-bst-delete`, `r5-trie`,
`r5-graph-adj`, `r5-graph-bfs`, `r5-graph-dfs`, `r5-union-find`, `r5-doubly-linked-list` (concept, arena of indices).

Registry ids added to `syntax.js`: `option-take` (`.take()` with empty parentheses; `iter-adapters` now ignores `.take()`
with no argument so the two methods are told apart) and `option-get-or-insert` (`.get_or_insert_with()`). `vecdeque`,
`hashmap`, `question-mark` and `option-methods` already existed and are re-introduced by the lessons that first teach them
properly. A `match-tuple` id was tried and dropped: stage 1's FizzBuzz solution already matches on a tuple.

What the learner now knows in words: a struct wrapping a `Vec` as a stack (`pop` is `Option<T>`, `peek` is
`Option<&T>`); ring buffer with `(head + len) % capacity`; a binary heap stored flat with parent `(i - 1) / 2` and children
`2i + 1`, `2i + 2`, sift up and sift down; `rem_euclid` and `as i32` / `as usize` for bucket indices; separate chaining with
`Vec<Vec<(i32, i32)>>`, `iter_mut`, `mem::replace`, `swap_remove`, and the std `HashMap` shown once (`new`, `insert` returning
the old value, `get(&k)`, `remove(&k)`, `len`); `?` on `Option` in a function returning `Option`; why `Option<Box<Node>>`
cannot be moved out from behind `&mut self` (E0507) and `.take()` as the fix; `.as_ref()` and `.as_ref().map(...)` for
peeking; walking a list or tree with a moving shared reference (`let mut cur = &self.head`); consuming a list with
`while let Some(mut node) = head { head = node.next.take(); ... }`; a reference to a slot, `&mut Option<Box<Node>>`, written
through with `*slot = Some(...)`; recursive helpers over slots; match guards on `Some(n) if ...`; `Some(_)` so nothing is
borrowed; `match (a.take(), b.take())` on a pair of `Option`s; BST deletion (leaf, one child, two children via the
successor and `pop_min`); `[Option<Box<T>>; 26]` arrays with `#[derive(Default)]`, `get_or_insert_with`, `as_ref()?` for a
read-only walk; `Vec<Vec<usize>>` adjacency lists and `&[usize]` views; `VecDeque` (`new`, `push_back`, `pop_front`,
`is_empty`, `len`) and `Vec<Option<usize>>` distance tables; BFS marks at enqueue, DFS with a `Vec` stack marks at pop;
`.clone()` plus `sort_unstable()` plus `.iter().rev()`; union-find with path compression and union by size, and why `find`
and the queries on top of it need `&mut self`; the three ways out of the doubly linked list problem (`Rc`/`Weak`, raw
pointers, an index arena), with only the arena written.

Still NOT taught (stage 6 or later): `BTreeMap`/`BTreeSet`/`BinaryHeap` (only named in prose), `HashMap::entry`, iterating a
`HashMap`, `Rc<RefCell<Node>>` with `Weak` (named, not coded), custom `Drop`, `as_deref`, `Option::map_or`.
Diagrams in the teach text live in the `teach.examples` code as comments, because the UI renders `teach.body` as paragraphs
only.

### What stage 7 taught (the last stage)

Stage 7 (`stage-7-algorithms-a|b.js`, 22 lessons, all with `teach`; verify with `RUST_MIGRATED=6`) keeps the old algorithms,
harnesses and verified large expected values and rewrites the teaching: every lesson has the idea in plain words, a worked
trace, the cost, and the Rust shape. Order and the Rust shape each one stresses: `r7-subsets` (choose/explore/un-choose,
nested `fn` that cannot see outer variables, `&mut Vec` passed on without `&mut` again, `out.push(cur.clone())`),
`r7-permutations` (`used: &mut Vec<bool>`), `r7-n-queens` (three flag tables, diagonal numbers, counting by returning),
`r7-prefix-sums` and `r7-prefix-sums-2d` (`vec![0; n + 1]`, `vec![vec![0; c + 1]; r + 1]`, `|&(l, r)|`, `i64`),
`r7-two-pointers` (half-open `hi`, `Option<(usize, usize)>`), `r7-sliding-window` (`as_bytes`, `[usize; 256]`, `start.max`),
`r7-binary-search-answer` (nested feasibility fn, `*iter().max().unwrap()`), `r7-bfs-grid` (`VecDeque` of `(r, c, d)`, `seen`
table, signed `as i32` bounds then `as usize`), `r7-count-components` (adjacency from edges, explicit `Vec` stack and why),
`r7-cycle-detection` (three colours, `(0..n).any`, recursion-depth honesty), `r7-topological-sort` (Kahn, `indeg`,
`collect()` into `VecDeque`), `r7-dijkstra` (`BinaryHeap<Reverse<(u64, usize)>>`, stale entries, `u64::MAX` sentinel mapped to
`Option`), `r7-bellman-ford` (relax rounds, `changed` flag, `Option<Vec<Option<i64>>>`), `r7-kruskal` (`to_vec`, `sort_by_key(|e|
e.2)`, `find(&mut parent, x)` with path compression), `r7-climbing-stairs` (naive recursion call count, table, two variables,
destructuring assignment), `r7-house-robber`, `r7-coin-change` (sentinel `usize::MAX`, check before `+ 1`), `r7-knapsack`
(`(w..=capacity).rev()`, zip), `r7-lis` (`partition_point`), `r7-lcs` and `r7-edit-distance` (full table, then two rows and
`prev = cur`, `(a != b) as usize`).

New registry id: `tuple-assign` (`(a, b) = (b, a + b);`, taught in `r7-climbing-stairs`). `binaryheap` and `vecdeque` are
re-introduced by the Dijkstra and BFS lessons. Solutions avoid `map_or`, literal suffixes (`0usize`, `1_000`) and `isize`;
the only suffixes left are in harnesses, which the rule does not scan. "Infinity" is a typed sentinel (`u64::MAX`,
`i64::MAX`, `usize::MAX`) converted to `Option` at the end, with the check done before any `+`.
