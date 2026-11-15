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
