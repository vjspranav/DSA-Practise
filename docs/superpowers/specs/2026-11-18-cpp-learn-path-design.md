# C++ Learn path — design

**Date:** 2026-11-18. Approved by the owner in conversation ("apvd").

## Why

The owner's friend wants to learn C++ "the way we did Rust": teaching from zero, with every piece of syntax explained
before an exercise uses it. The friend is good at Python, so the bridge is Python, the way the Rust track's bridge is
C++. The owner asked for a **Learn | Revise** toggle in the C++ track:

- **Revise** is the current 78-lesson Foundations track and must stay exactly as it is, with no data or behaviour
  change.
- **Learn** is a new path.

The friend learns the algorithms too, but the emphasis is C++ fundamentals; DSA is the lighter, later part. The owner
asked for a proper review, as for Rust: a checker, a taught-before-used rule, browser self-tests, and a lead review of
each stage.

## Goals, non-goals, anti-goals

- **Goals**
  - A Python programmer with no C++ can go from `main` to classes, pointers, the STL and basic DSA.
  - Every symbol is explained in plain words before it is used.
  - Python parallels appear wherever a Python habit breaks in C++.
- **Non-goals**
  - Re-teaching DSA at the depth of Revise. Learn ends by pointing to Revise and Problems.
  - C++17 or C++20 features.
  - Exceptions.
  - Any server.
- **Anti-goals**
  - Changing Revise lessons, their progress data, or how they look.
  - Breaking the Rust track.
  - Sending C++ code off the device. Learn runs locally, like Revise.
  - Using syntax before teaching it.

## Approaches considered

1. **A new lesson set that reuses the Rust track's teach-first UI and runs on the existing local wasm-clang runner.**
   Chosen.
2. Adding teaching text to the 78 Revise lessons. Rejected: it changes Revise, and those lessons assume C++ from the
   first one, so they cannot teach from zero.
3. Generalising the Rust track into a language-agnostic engine first. Rejected: a large refactor that puts the Rust
   track at risk with no gain for the learner. Small, targeted sharing is fine; see below.

## Hard constraints

- **The in-browser compiler is clang 8.0.1.** Its default standard is C++14, with no `-std` flag passed and exceptions
  off (`public/wasm-clang/shared.js`).
  - Lessons must compile under `clang++ -std=c++14 -fno-exceptions`, exactly as `scripts/verify-foundations.mjs`
    already does.
  - This means no structured bindings, no `std::optional`, no `<bits/stdc++.h>`, and no `try`/`throw`.
  - Explicit includes only.
  - `.at()` out of range aborts the program; it does not throw.
- **Local tools.** The local toolchain is Apple clang 21 and Python 3.9.6. Python snippets must run on 3.9, so no
  `match` statement.
- **No undefined behaviour in stored outputs.** Never store the output of undefined behaviour (an out-of-bounds read,
  an uninitialised variable, a dangling pointer, signed overflow) as an expected output or a predict answer.
  - Teach these in prose, in `compare` with `ok: false` plus an outcome such as "undefined: may print anything", and in
    predict rounds whose correct answer is "anything can happen; this is undefined behaviour".
  - Signed overflow is UB in C++. Show wrap-around with `unsigned`, and say plainly that `int` overflow is undefined.
- **Stdin works.** C++ runs locally, so `program` lessons that read stdin are allowed, as in Revise.

## What the learner sees

- **Drawer.** In the C++ track, a segmented **Learn | Revise** switch sits directly under the existing C++ | Rust
  switch (`app/src/workbench/DrawerParts.jsx`). It does not appear in the Rust track or in Problems.
  - The choice is stored in a new localStorage key, `dsa-cpp-path` (`'learn'` | `'revise'`).
  - When the key is absent, the default is `'learn'` if there is no Revise progress (the `dsa-foundations` per-lesson
    records are empty), else `'revise'`.
  - Last-opened lesson memory is separate per path.
- **Revise** renders today's `Foundations` component unchanged.
- **Learn** renders a new track, built on the shared `Track` frame (`app/src/workbench/Track.jsx`) the way
  `RustTrack.jsx` is.
  - The drawer title is "C++ · n of N done".
  - Stage icons and legend marks follow the Rust track.
- **Lesson screen.** It works like the Rust workbench:
  - a teaching card (open by default; folding is remembered only after a pass, as in `RustWorkbench.jsx`);
  - the task;
  - the editor, then results;
  - a side rail with the tabs **Refresher**, **In Python** (when the lesson has `inPython`), **Hints** and **Answer**.
    The Answer tab unlocks after a pass or 3 misses, as in both existing tracks.
- **The Python bridge.** `compare` shows a Python snippet and a C++ snippet side by side. Each has a one-line outcome
  and an ok/error mark (in the Rust track's `compare`, the `cpp` slot becomes `py` and the `rust` slot becomes `cpp`).
  - The **In Python** tab shows the Python way plus one sentence on the difference.
- **Compiler output.** Shown in full, as clang prints it, with a one-line plain gloss above it for `fix` lessons.
  - A compile failure is not a miss; a wrong answer, a crash or a timeout is.
- **Copy for review.** Works here too (`ReviewButton`, mode `'cpp'`). The prompt should mention that the learner
  comes from Python.
- **Owner's taste, unchanged.**
  - White cards and the blue palette, with green only for pass/done. 8px corners.
  - Little text by default, apart from the teaching card.
  - No cross-fades or slide-ins on content change.
  - Light and dark of equal quality.

## Progress

- A separate store under localStorage key `dsa-cpp-learn`, with the same record shape as `useRustStore.js`
  (`passedAt`, `misses`, `code`, redo fields).
- The `dsa-` prefix means export/import (`app/src/workbench/backup.js`) covers it with no change. Verify this.

## Lesson data

- **Files.**
  - Lessons: `app/src/data/cpp-learn/index.js` (`STAGES`, `LESSONS`) and `stage-N-*.js` (plain JS, no imports, each
    exports `LESSONS`).
  - Ids: `c<stage>-slug`, unique across the track.
- **Shape.** The same as the Rust track's (Rust spec, sections "Shape", "Contract details", "Teaching fields"), with
  these changes:
  - `kind`: `'concept' | 'predict' | 'fix' | 'program' | 'implement' | 'drill' | 'bugfix'`.
  - `program`: the learner writes the whole file. Tests are `{ name, stdin, expected }`, judged like Revise's
    `program` lessons (`app/src/foundations/grade.js`).
  - `implement`/`drill`/`bugfix` (and `concept`/`fix` with a harness): the learner writes functions or types, and a
    C++ `harness` defines `main()`.
    - The harness prints `@@TEST n@@` on its own line before each test, as the Rust harness convention does.
    - Grade per test exactly as `app/src/rust/evaluate.js` does. A crash ends the run: later tests are "not run" and
      stderr or the exit status is shown.
    - Programs never see the Revise `CPP_DSA_PREAMBLE`. The learner writes their own `#include`s and
      `using namespace std;`, because those are taught.
    - A harness is appended after the learner's code, so its line numbers match compiler output.
    - Name harness helpers with a `harness_` prefix.
  - `inPython: { code, note }` replaces `inCpp`. `compare: { py: {code, outcome, ok}, cpp: {code, outcome, ok}, text }`.
  - `fix`:
    - `errorMatch` is a regex source string that the first `error:` line of the compiler output must match, in place of
      Rust's `errorCode`. Example: `'use of undeclared identifier'`. Pick wording that is the same in clang 8 and clang
      21; when unsure, match a short stable phrase.
    - `gloss` is one plain sentence.
  - `predict` rounds:
    - `{ snippet, choices[3], answer, why, output, error?: true, stdin? }`.
    - `output` is the program's stdout, or for an error round the local clang error text with the file shown as
      `main.cpp`.
  - `teach`, `introduces`, `refresher`, `hints`, `require`, `forbidden`, the text limits and `timeLimitMs` are as in the
    Rust track and Revise.
- **Teaching rules.** These are the same as the Rust track's "Teaching fields and the taught-before-used rule", word for
  word, with C++ in place of Rust and Python in place of C++:
  - teach first, in plain words; define every symbol;
  - 1 to 3 examples with every line commented;
  - examples must compile and run, and their `output` must match;
  - one new idea per exercise;
  - say honestly when something is used "for now" (for example `using namespace std;` in lesson 1, explained properly
    in stage 3).
- **Syntax registry.**
  - `app/src/cpp-learn/syntax.js` holds C++ syntax ids, in the same format as `app/src/rust/syntax.js`.
    - Examples: `include-iostream`, `cout`, `stream-insert`, `endl`, `cin`, `int`, `double`, `string-type`, `if`,
      `for-classic`, `range-for`, `reference-param`, `pointer-decl`, `address-of`, `deref`, `new`, `class`, `vector`,
      `map`, `lambda`, `template`.
  - The rule is applied in track order to the learner-facing C++ code: teach examples, `compare.cpp`, starter,
    solution, predict snippets, and `<code>` spans in task and hints.
  - Python code is not checked against the registry.
  - All stages are under the rule from the start; there is no migration set.

## Checker: `app/scripts/verify-cpp-learn.mjs`

For every lesson it checks the following.

- **Shape and text.** Shape and text limits; unknown fields are rejected.
- **Solution.** It compiles with `clang++ -std=c++14 -fno-exceptions -O1 -w` and passes every test.
- **Starter.**
  - `fix`: the starter fails to compile with the first error matching `errorMatch`, and meets every `require`.
  - Other kinds: the starter does not pass.
- **require and forbidden.** The solution meets every `require` and hits no `forbidden`.
- **Predict rounds.** Each round behaves as claimed:
  - an error round fails to compile and its first `error:` line appears in `output`;
  - otherwise the round exits 0 and stdout equals `output`.
- **Teach examples.** They compile and run, with `output` matching. Fragments with `wrap: true` are placed inside
  `int main() { ... }` after the common includes and `using namespace std;`.
- **compare.cpp.** It compiles or fails as its `ok` flag says.
- **Python snippets.** Every `compare.py.code` and `inPython.code` with `ok !== false` runs under `python3 -I` with exit
  0 within 2 seconds (no stdin). A `pyUnchecked: true` flag exists for the rare fragment that cannot run.
- **Taught-before-used rule.** Failures read `uses cout (cout) before it is taught`. Every `introduces` id must exist.
- **Determinism.** No randomness, time, threads or file I/O. A program that prints the iteration order of an
  `unordered_map` or `unordered_set` is run twice and rejected if the two outputs differ. Better: sort before
  printing.
- **Command line.** Usage is `--stage N` and `--only id`. It exits non-zero on any failure.

The checker reuses `app/src/foundations/grade.js` helpers where they fit (`normalise`, `forbiddenHit`) and adds a pure
`app/src/cpp-learn/grade.js` for the marker-based harness grading, shared by the app and the checker (no browser
imports).

**Browser self-test.** `app/scripts/browser-selftest-cpp-learn.mjs` runs the reference solution of a sample of lessons
(at least one per kind per stage, plus `--limit`) through the real in-browser compiler (headless Chrome over CDP, as
`browser-selftest-rust.mjs` does), and requires a pass. This catches clang 8 versus clang 21 differences. Run it over
every lesson once before deploy.

## Curriculum (about 175 lessons)

Teaching stages (1 to 6) are mostly `concept`, `predict` and `fix` steps, each followed by a small task, with `program`
lessons that read input. Stages 7 and 8 are mostly `implement`, `drill` and `bugfix`. Each stage ends with 2 to 3
practice lessons that combine its ideas. Each bullet below must be covered by at least one lesson.

### 1. First programs (~25), file `stage-1-first.js`, id `basics`

- **What compiling means.** Compare running a `.py` file with compiling a C++ file and then running it. Errors come
  before the program runs.
- **The parts of a file.**
  - `int main() { ... }`, and `return 0;` (optional in `main`).
  - `#include <iostream>`.
  - `using namespace std;`, used "for now" and explained in stage 3.
  - `std::` written out.
- **Printing.** `cout << ... ;` and chaining `<<`. `"\n"` versus `endl`. Semicolons. Comments `//` and `/* */`.
- **Variables.**
  - Variables have a fixed type: `int`, `double`, `bool`, `char`, `string` (`#include <string>`).
  - Declare before use, and assign versus initialise.
  - Compare with Python's dynamic types: reassigning a different type is a compile error.
- **Arithmetic.**
  - `+ - * / %`.
  - **Integer division truncates toward zero**: compare Python's `//`, which floors, e.g. `-7 / 2`. Same for `%` with
    negatives.
  - Mixing `int` and `double`, and casts with `static_cast<double>(x)`.
- **Integer limits.**
  - `int` is fixed size, unlike Python's unlimited int. `long long`.
  - Overflow is undefined behaviour (taught in prose and predict only; see the hard constraints). `INT_MAX` from
    `<climits>`.
- **Input.** `cin >> x`, which reads whitespace-separated values. Reading several values.
- **More arithmetic.** `+=`, `++`, `--`. `const`. `auto` for simple cases. `<cmath>`: `sqrt`, `pow`, `abs`.
- **Output formatting.** `fixed << setprecision(2)` from `<iomanip>`, compared with Python f-strings.
- **Practice.** Programs that read numbers and print computed results.

### 2. Control flow (~22), file `stage-2-control.js`, id `control`

- **Blocks.**
  - Braces, not indentation, make blocks. Indentation means nothing to the compiler.
  - The dangling-`if` trap without braces.
  - Parentheses around conditions.
- **Conditions.**
  - `if` / `else if` / `else`. Comparisons. `&&`, `||` and `!` versus `and`, `or` and `not`.
  - `bool`. Truthiness of ints. `=` versus `==` in a condition (a predict lesson).
- **switch.** `switch` with `case`, `break` and `default`. Fallthrough as a trap.
- **Loops.**
  - `while`.
  - The C-style `for (int i = 0; i < n; i++)` versus `for i in range(n)`: counting down and step 2.
  - `break`, `continue`, `do ... while`.
  - Nested loops. Loop variables scoped to the loop.
- **Other.**
  - The ternary `?:` versus Python's `x if c else y`.
  - Reading until the input ends: `while (cin >> x)`.
- **Practice.** FizzBuzz, digit sums, primes, patterns of stars, a number-guessing check.

### 3. Functions (~18), file `stage-3-functions.js`, id `functions`

- **Writing functions.**
  - Return type and parameter types. `void`.
  - Defining a function before use, or declaring a prototype.
  - Local scope.
- **Passing values.**
  - **Pass by value copies**. Compare Python, where a function can mutate a list you pass in.
  - Pass by reference `&` to modify the caller's variable (swap).
  - `const &` for big read-only values.
  - Returning several values through references (since there are no tuples yet).
- **Overloading and defaults.** Overloading by parameter types. Default arguments.
- **Recursion.** Factorial, Fibonacci, power. Say that there is a stack and that it can overflow.
- **Namespaces.** `using namespace std;` properly explained, and why headers exist.
- **Practice.**

### 4. Arrays, vectors and strings (~25), file `stage-4-sequences.js` (split -a/-b if over ~900 lines), id `sequences`

- **C arrays.** `int a[5]`, a fixed size, and no `len()`. Out-of-bounds access is undefined behaviour, where Python
  would raise `IndexError` (prose, compare and predict).
- **vector.**
  - `vector<int>` (`#include <vector>`) as the C++ list: `push_back`, `pop_back`, `size()`, `[]` versus `.at()`,
    `back()`, `empty()`, `clear()`.
  - Building with `vector<int> v(n, 0)`.
  - The `size_t` type, and the `i < v.size() - 1` trap when the vector is empty.
- **Loops over vectors.**
  - Range-for: `for (int x : v)` copies; `for (int& x : v)` modifies.
  - Passing vectors to functions: copy versus `&` versus `const &`.
- **2D.** 2D grids as `vector<vector<int>>`. Compare the Python trap `[[0]*m]*n`, which C++ does not have.
- **string.**
  - Indexing, `size()`, `+`, `substr`, `find`, comparison, mutability (unlike Python's immutable `str`).
  - `char` versus `string`: `'a'` versus `"a"`.
  - `char` arithmetic, as in `c - 'a'` and `ord`/`chr`. `isdigit`, `isalpha` and `toupper` from `<cctype>`.
  - `getline(cin, line)` and mixing it with `cin >>`.
  - `to_string` and `stoi`.
- **Practice.** Reverse, palindrome, counts, matrix sums, word stats.

### 5. Memory and pointers (~22), file `stage-5-memory.js` (split if long), id `memory`

- **What Python hides.** Variables are boxes in memory. `sizeof`.
- **Pointers.**
  - Addresses with `&x`. A pointer stores an address: `int* p`. Dereference with `*p`.
  - `nullptr`, and checking for null.
  - Pointers versus references, and when to use which.
- **Arrays and pointers.** Arrays decay to pointers. Pointer arithmetic over an array. Passing arrays with a size.
- **The heap.**
  - Stack versus heap.
  - `new` and `delete`, `new[]` and `delete[]`.
  - Leaks. Dangling pointers and use-after-free as undefined behaviour (prose, compare and predict only).
- **Smart pointers.** `unique_ptr` and `make_unique` are C++14 and available. RAII as the idea that ends manual
  `delete`.
- **Pointers to structs.** `->` is introduced with a minimal `struct` defined in the lesson, which is the first
  appearance of `struct`.
- **Practice.** Swap via pointers, find max via pointers, a dynamic array that grows.

### 6. Structs and classes (~22), file `stage-6-classes.js` (split if long), id `classes`

- **Structs.** `struct` with fields, and aggregate initialisation. Compare a Python class used as a record.
- **Methods.** Member functions. `this`. `const` member functions.
- **Classes.**
  - `class` with `public` and `private`; private is the default for `class`. Compare Python's "_name" convention.
  - Constructors, member initialiser lists, and default constructors.
- **Destructors.** Destructors and RAII: a class that owns memory.
- **Copying.**
  - Copy semantics: `b = a` copies the object, unlike Python, where both names point at one object.
  - Shallow-copy danger with raw pointers, and the rule of three (named, briefly).
- **Operators.**
  - Overloading `<` (needed later for sorting) and `<<` for printing. Compare `__lt__` and `__str__`.
  - `static` members.
- **Inheritance, briefly.** Inheritance and `virtual` for one override. Compare Python inheritance. Keep it to 2
  lessons.
- **Templates, a first look.** A generic `maxOf<T>`. Compare duck typing.
- **Practice.** A `Point`, a `BankAccount`, and a `Stack` class over `vector`.

### 7. The STL, mapped from Python (~22), file `stage-7-stl.js` (split -a/-b), id `stl`

- **pair and tuple.** `pair` and `make_pair`, `.first` and `.second`. `tuple` and `get<0>` (no structured bindings in
  C++14).
- **Sorting.** `sort(v.begin(), v.end())`. Iterators as positions.
- **Lambdas.** Syntax and captures. `sort` with a lambda, compared with `key=`. Sorting by several keys.
- **Maps.**
  - `map` as an ordered `dict`, versus `unordered_map`.
  - `m[k]` inserts a default; Python raises `KeyError`. `count` and `find`.
  - Iterating with `it->first`.
- **Sets.** `set` and `unordered_set` compared with `set`. `multiset`.
- **Containers.**
  - `stack`, `queue` and `deque` compared with list and `collections.deque`.
  - `priority_queue` is a max-heap; `heapq` is a min-heap. Use `greater<int>` for a min-heap.
- **Algorithms.**
  - `lower_bound` and `upper_bound` compared with `bisect`.
  - From `<algorithm>` and `<numeric>`: `reverse`, `min_element`, `max_element`, `accumulate`, `count`, `find`,
    `unique` and `erase`.
- **Bugfixes.** Iterator invalidation (erase while iterating). A bad comparator using `<=`.

### 8. DSA basics (~20), file `stage-8-dsa.js`, id `dsa`

- **Big-O** in one concept step.
- **Searching and sorting.** Binary search by hand. Insertion sort. Merge sort.
- **Linked lists.** A singly linked list with `struct Node*`: push, print and reverse.
- **Graphs.**
  - A graph as an adjacency list.
  - BFS with a `queue`. DFS with recursion. BFS on a grid.
- **Recursion.** Recursion and backtracking (subsets).
- **Patterns.** Prefix sums. Two pointers. Sliding window.
- **DP.** Three intro DP problems: climbing stairs, coin change, LIS (O(n²)).
- **Wrap-up.** A last concept step points to Revise and Problems for more.

### What each stage introduces (the taught set)

The registry and this list are fixed by the stage 1 builder and recorded here after stage 1 is approved (as "What
stage 1 taught"). Stages 2 to 8 may be written in parallel only after that. Each stage builder:

- uses only ids introduced by earlier stages per this curriculum;
- introduces its own ids;
- adds registry patterns it needs, in its own section of `syntax.js`.

The lead merges any registry conflicts.

## Build order

1. **Scaffold** (one agent):
   - the `cpp-learn` data folder;
   - `grade.js`, `syntax.js` and `verify-cpp-learn.mjs`;
   - the app: path toggle, track, workbench, In Python tab, store, Copy-for-review mode;
   - the browser self-test;
   - one verified example lesson of each kind.
2. **Stage 1** (one agent): written and checked. The lead reviews it, then the owner looks at it in the browser.
3. **Stages 2 to 8.** Sonnet agents, about two stages each, in parallel. Each stage must pass the checker. The lead
   reviews each stage (teaching quality, Python parallels, no UB in stored output).
4. **Final.**
   - The full checker; lint and build; `verify-foundations.mjs` and `verify-rust.mjs` still pass.
   - The browser self-test over every Learn lesson.
   - A manual pass: toggle, fold, unlock, and export/import.
   - Deploy on the owner's say.

## Settled after the builder check (lead's calls)

1. **The curriculum is authoritative.** The concept-to-stage assignment above is fixed.
   - The scaffold agent writes registry ids for every stage's concepts up front, each in a section of `syntax.js`
     marked with its stage.
   - The stage 1 gate is only for the owner to judge teaching style. Once the owner approves stage 1, stages 2 to 8 run
     in parallel.
   - A stage builder may add ids to its own section. It may not use ids from a later stage.
2. **No runner or executor changes.** Learn uses `compile` and `runTest` from `app/src/workbench/runner.js` as they are.
   - `runTest` returns `status: 'error'` (with any stdout so far and a message) on a crash or a nonzero exit.
   - Learn grades the markers present in that stdout: tests whose markers completed before the crash are graded, the
     running one fails with the message, and later ones are "not run".
   - Harness `main` returns 0.
   - Revise is untouched.
3. **The browser self-test also exercises compiler errors under clang 8.**
   - It compiles each `fix` starter and requires the first error to match `errorMatch`; a mismatch is a hard failure.
   - It compiles each predict error round and checks that the round fails to compile. A clang 8 wording difference
     from the stored `output` is only reported as a warning.
   - Stored predict `output` uses local clang 21 text.
4. **The default path rule.** The default is `'learn'` when no Revise lesson has ever passed. Use the field the
   Foundations store sets on a pass, as read through `useFoundationsStore.js`. The resolved default is saved to
   `dsa-cpp-path` the first time it is resolved, so later progress in the other path does not flip it.
5. **Learn is entirely separate.** It has its own counts and Onward panel, shares no global progress or streaks with
   Revise or Rust, and needs no `progress.js` changes beyond what the shared `Track` frame already supports.
6. **Stage 3 also ends with 2 to 3 practice lessons**, like every stage.

## Left to the builder

- Component structure: how much of `RustWorkbench.jsx`, `ConceptCard.jsx` and `PredictPanel.jsx` to share or copy.
  Small parameterisation is preferred over copy-paste, but the Rust track must not change visibly.
- Exact registry ids and patterns.
- Lesson wording and exact counts within about ±20% per stage.

## What stage 1 taught

Stage 1 is 30 lessons (`app/src/data/cpp-learn/stage-1-first.js`): 10 concept, 10 program (4 are the closing practice lessons), 6 fix, 4 predict. Only whole programs with `main`; no functions. Ids taught, with what "for now" means:

- `include-iostream`, `int-main`, `return-zero`, `cout`, `stream-insert`, `endl`, `string-literal`, `semicolon`, `comment` (c1-hello-main): compile-then-run, the skeleton of a file.
- `using-namespace-std` (c1-hello-main): used "for now"; stage 3 explains it. `std-qualified` (c1-std-qualified): `std::cout` written out, `::` read as "inside".
- `newline-escape` (c1-lines): `"\n"` versus `endl` (endl also flushes). `block-comment` (c1-block-comment).
- `int`, `assign` (c1-int-variables): declare with a type, assign without; an uninitialised read is UB, taught in prose and a `ub: true` predict round (c1-predict-uninit).
- `double`, `bool`, `char` (c1-double-bool-char): bool prints as 1/0; single quotes make a char. `include-string`, `string-type` (c1-string): double-quoted text only; joining is by `<<` chain (no `+` on strings yet).
- `arithmetic` (c1-arithmetic): int / int drops the fraction toward zero. `modulo` (c1-predict-modulo): `%` takes the sign of the left operand.
- `static-cast` (c1-cast-double): `static_cast<double>(x)`; casting before dividing, not after.
- `cin`, `stream-extract` (c1-sum-two): whitespace-separated reads, no prompt; `cin >> string` reads one word (c1-read-mixed).
- `compound-assign`, `incr-decr` (c1-compound-assign): used only as statements; `++` is not an expression yet.
- `const` (c1-const), `auto` (c1-auto): auto only for simple numbers; `auto s = "hi"` is warned against.
- `include-climits`, `int-max`, `long-long`, `unsigned` (c1-int-limits): int is fixed size; signed overflow is UB (prose, compare with `ok: false`, and a `ub: true` predict round c1-predict-overflow); unsigned wrap is shown as defined.
- `include-cmath`, `math-functions` (c1-math): `sqrt`, `pow`, `abs`, default 6 significant digits (c1-predict-doubles). `include-iomanip`, `setprecision` (c1-setprecision): `fixed << setprecision(n)` as a sticky stream setting, versus an f-string.

Not taught in stage 1 (left for later stages): `if`/comparison (stage 2), functions and references (3), `vector`, `getline`, `char` arithmetic and string operations such as `+`/`substr` (4).

## What stage 5 taught

Stage 5 is 25 lessons, split across `stage-5-memory-a.js` (c5-sizeof to c5-fix-sizeof-param) and `stage-5-memory-b.js` (the rest); `stage-5-memory.js` joins them, so `index.js` is unchanged. Kinds: 6 concept (plus 4 more teach-bearing implement, drill and bugfix lessons), 4 predict, 2 fix, 2 bugfix, 3 drill/implement before the heap, and 3 closing practice lessons. No registry ids were added: every id used was already in the stage 5 section. Ids taught:

- `sizeof` (c5-sizeof): a variable is a fixed-size box; `sizeof(type)` / `sizeof(x)`; the `sizeof(arr) / sizeof(arr[0])` trick on a real array. Pointer size is never printed (4 in the browser, 8 locally).
- `address-of`, `pointer-decl`, `deref` (c5-address-deref): `&x`, `int* p`, `*p` to read and write; addresses are never printed, pointers are compared with `==`. c5-predict-aliasing, c5-write-through, c5-fix-pointer-type practise it.
- `nullptr` (c5-nullptr): `p == nullptr` checks, "check before you follow"; null dereference is UB (c5-predict-null, `ub: true`). Pointers versus references: c5-pointer-or-reference (no new id; a reference variable `int& r = x;` appears here for the first time).
- `pointer-arith` (c5-array-decay): an array name decays to `&a[0]`; `p + i` steps by elements; `a[i]` is `*(a + i)`. c5-pointer-walk teaches `p++`, pointer difference and start/stop ranges with `const int*`; c5-predict-past-end (`ub: true`) covers reading one past the end. c5-array-param and c5-fix-sizeof-param: arrays are passed as pointer plus length, never `sizeof` on a parameter.
- `new`, `delete` (c5-new-delete): stack versus heap; every `new` has one `delete`; set the pointer to `nullptr` afterwards. `new[]` / `delete[]` and the mismatch are in c5-new-array (the mismatch is `compare` with `ok: false`, because the sanitizers do not report it on macOS). c5-leak: leaks in prose, the lesson `require`s the `delete[]` since the sanitizer run has leak detection off. c5-predict-use-after-free (`ub: true`, the sanitizer proves use-after-free) and c5-dangling-local (a returned `&local` is `compare` with `ok: false`).
- `include-memory`, `unique-ptr` (c5-unique-ptr): RAII, `unique_ptr<int>`, `unique_ptr<int[]>` and `make_unique` (C++14); one owner only. c5-fix-unique-copy: a copy of a `unique_ptr` fails with "copy constructor", fixed with a `const` reference.
- `struct`, `field-access`, `arrow` (c5-struct-arrow): `struct Point { int x; int y; };`, `Point a = {3, 4};`, `a.x`, `p->x` as `(*p).x`. c5-node-walk: `struct Node { int value; Node* next; };`, walking with `for (Node* n = head; n != nullptr; n = n->next)`, and `new Node{1, nullptr}`.
- Practice: c5-practice-swap (`swapInts(int*, int*)`), c5-practice-max (`int* findMax(int*, int)`), c5-practice-grow (an `IntList` struct with an `append` that doubles its heap array, a reference parameter to a struct).

Not taught in stage 5 (left for later stages): constructors, methods, `class`, destructors and the rule of three (stage 6); `vector` is introduced in stage 4 and used as the safe default; `shared_ptr` and `std::move` are not taught.
