# Foundations track — design

**Date:** 2026-11-15 · **Branch:** `foundations-track` · Do not commit; the owner commits.

## Why

The owner wants to rebuild hands-on C++ and DSA skill after long reliance on AI tools: typing nearly everything
themselves, with only enough theory to jog memory, in the order C++ basics → sorting/searching by hand → building
data structures → STL → algorithms → the existing problem bank. The existing app is a flat LeetCode-style problem
list that hides includes, `main()` and input handling.

## Goals / non-goals

- Goals: an ordered Foundations track of ~78 short, code-first lessons; little text on screen; a Material-style,
  white, card-based "Workbench" UI with fluid transitions, light and dark themes.
- Non-goals: restyling the existing Problems UI (it stays as is), Python lessons, accounts/sync, three.js,
  per-lesson visualisations (later), new problem-bank categories.
- Anti-goals: dense text-heavy panels; navigation where lesson names are not readable at a glance; anything that
  leaks answers before the learner has tried.

## Approaches considered

1. Dense three-panel layout in the old app style — rejected by the owner as cluttered.
2. three.js "path" of glowing nodes — rejected as unusable (lessons not scannable).
3. Three Material mockups (stage cards / workbench / journey). **Chosen: Workbench**, then enhanced.

**The approved look is the mockup `docs/mockups/v3/workbench-2.html` (+ `shared.css`, `shared.js`). Treat it as the
visual and behavioural reference: layout, colours, type, spacing, wording and motion.** Open it in a browser.

## Lesson data (already scaffolded)

- `app/src/data/foundations/index.js` — `STAGES` (5 stages, each with `lessons`) and `LESSONS`.
- `app/src/data/foundations/stage-N-*.js` — `export const LESSONS = [...]`, plain JS (no JSX, no imports).
- `app/src/foundations/grade.js` — pure helpers used by app and checker: `assembleSource`, `judge`, `splitOutput`,
  `forbiddenHit`, `RESULT_MARK`.
- `app/scripts/verify-foundations.mjs` — content checker (`node scripts/verify-foundations.mjs [--stage N] [--only id]`).
- Two complete, verified example lessons: `docs/superpowers/specs/foundations-lesson-examples.js`.

### Lesson shape

```js
{
  id: 's2-merge-sort',        // unique lowercase slug, prefixed s1-…s5- by stage
  title: 'Merge sort',        // ≤ 40 chars
  kind: 'implement',          // 'program' | 'implement' | 'drill' | 'bugfix'
  task: '…',                  // HTML, ≤ 240 chars of text, 1–2 sentences. Use <code> for identifiers.
  example: { input, output }, // optional, short
  refresher: ['…'],           // 1–3 HTML items, each ≤ 200 chars: the 30-second memory jog
  hints: ['…', '…'],          // 2–3 HTML items, increasing in strength; never the full answer
  forbidden: [{ pattern, message }], // optional regex source strings checked against the learner's code
  starter: '…',               // what the editor starts with ('' for a blank file)
  solution: '…',              // reference answer in the same form as the starter (what the learner would type)
  harness: '…',               // not for 'program': C++ appended after the learner's code, defines main()
  tests: [{ name, stdin, expected, input? }], // ≥ 3; `input` is a short human description shown on failure
  timeLimitMs: 4000,          // optional per-test limit
}
```

### How a lesson is compiled and graded

- `program`: the learner's code is compiled untouched (they write includes and `main()`). Each test feeds `stdin`;
  the whole stdout, whitespace-normalised (trailing spaces per line, leading/trailing blank lines), must equal `expected`.
- `implement` / `drill` / `bugfix`: source = `CPP_DSA_PREAMBLE` (standard includes + `using namespace std;`)
  + learner code + `harness`. The harness `main()` reads the test selector from stdin (usually the test number),
  runs that case, prints `\n@@RESULT@@\n`, then prints the result. Only text after the last `@@RESULT@@` is graded;
  anything the learner printed before it is shown to them as their own output.
- `bugfix`: `starter` is working-looking code with a real bug; tests must fail on it.
- Kinds in the UI: program = "Write the whole program", implement = "Write the function", drill = "Quick drill",
  bugfix = "Find the bug".

### Compiler constraints (the in-browser compiler is clang 8, default C++14, exceptions off)

- C++14 only: no structured bindings, no `if (init; cond)`, no `std::optional`/`string_view`/`variant`,
  no class template argument deduction, no `.contains()`, no ranges, no `<bits/stdc++.h>`.
- No `try` / `throw` / `catch`.
- The checker compiles with `clang++ -std=c++14 -fno-exceptions` to mirror this.
- Harness inputs must be deterministic (no `rand()` without a fixed hand-rolled generator, no time).
- Keep each test fast: well under 1 s natively (the browser is several times slower).

### Curriculum (titles are the agreed outline; small adjustments are fine)

1. **C++ warm-up (12)**: Sum of N numbers (program), Read until the input ends (program), Count the vowels (program),
   Swap: value or reference, Reverse a vector, Is it a palindrome?, A struct of students, Pointers and arrays,
   Walk a 2D grid, Print a number triangle (program), The average is always 0 (bugfix), The copy that never changed (bugfix).
2. **Sort and search by hand (10)**: Bubble sort, Selection sort, Insertion sort, Merge sort, Quick sort, Counting sort,
   Binary search, Lower and upper bound, Binary search never ends (bugfix), Sort student records (program).
3. **Build it yourself (12)**: Dynamic array, Linked list, Reverse a linked list, Stack, Circular queue, Min-heap,
   Hash map, Binary search tree, Delete from a BST, Graph and BFS, DFS, Union-find.
4. **The standard library (22, drills unless noted)**: vector basics, sort with a lambda, pair and tuple, string tools,
   set, multiset, map, unordered_map, stack and queue, deque, priority_queue, priority_queue with your order,
   lower_bound, Iterators, Erase while looping, accumulate and friends, min and max element, reverse and rotate,
   unique, next_permutation, The iterator that went stale (bugfix), The comparator that crashes sort (bugfix).
5. **Algorithms (22)**: Subsets, Permutations, N-Queens, Prefix sums, 2D prefix sums, Two pointers, Sliding window,
   Binary search on the answer, BFS on a grid, Count components, Cycle detection, Topological sort, Dijkstra,
   Bellman-Ford, Kruskal, Climbing stairs, House robber, Coin change, 0/1 knapsack, Longest increasing subsequence,
   Longest common subsequence, Edit distance.

## App behaviour

- Two modes: **Foundations** (new Workbench UI) and **Problems** (existing UI, unchanged apart from a way to switch).
  Remember the last mode and last lesson in localStorage.
- Drawer: overall progress, a "Write again" group (lessons whose redo is due), stage groups with lesson rows by name,
  collapsible to an icon strip. Nothing is locked; the first unfinished lesson is where the app opens.
- Lesson: task strip, editor (Monaco, C++ only, autocomplete/suggestions off, light and dark themes matching the
  mockup), Run and "Check my code" (Ctrl/Cmd+Enter).
  - Run: compile and run the first test's stdin, show the learner's output.
  - Check: compile once, run every test, show one chip per test; a failing chip expands to input / expected / got.
    Compiler errors are shown in the results area in plain monospace.
  - A forbidden pattern blocks the check with its message (counts as nothing; not a miss).
- Help rail: Refresher, Hints (revealed one at a time), Answer.
  - Answer is locked until the lesson is passed or there have been **3 failed checks**; show the three try dots.
  - After a failed check a floating "Stuck? A hint is ready." card appears; after the third miss it offers the answer.
- Passing: lesson auto-marks done, drawer tick animates, answer unlocks and opens, "Next: …" button appears,
  a redo is scheduled.
- Redo ("write again from scratch"): due 3 days after a pass, then 7, then 21, then never. A due lesson appears in the
  "Write again" group. Opening it there starts from the starter in a separate saved buffer (the original passing code
  is kept), with the answer locked again until pass / 3 misses. Passing advances the schedule.
- Time limits: an infinite loop must not hang the app. If a test exceeds the limit, terminate the compiler worker,
  recreate it, report "Time limit exceeded" for that test and mark the rest as not run.
- Persistence: localStorage only (code per lesson, misses, passedAt, redo schedule, theme, drawer state).
- Motion: sliding drawer highlight and cross-fades via the View Transitions API where available (instant fallback),
  CSS transitions elsewhere; honour `prefers-reduced-motion`.
- All CSS for the new UI is scoped (e.g. under a `.fnd` root) so the old Problems UI is untouched.

## Verification

- `node scripts/verify-foundations.mjs` passes for all lessons.
- `npm run lint` and `npm run build` pass in `app/`.
- In the browser: one lesson of each kind end to end; three misses unlock the answer; pass schedules a redo; an
  infinite loop reports a time limit and the app recovers; existing Problems still run in C++ and Python.
