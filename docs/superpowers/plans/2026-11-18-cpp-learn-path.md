# C++ Learn Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Learn | Revise switch to the C++ track. Learn is a new, teach-from-zero path of about 175 lessons with
Python parallels; Revise stays the current Foundations track, untouched.

**Architecture:**
- **Data.** A new lesson set in `app/src/data/cpp-learn/`.
- **App code.** A new track folder `app/src/cpp-learn/`, built on the shared `Track` frame and modelled on
  `app/src/rust/`.
- **Runner.** Lessons run on the existing local wasm-clang runner (`app/src/workbench/runner.js`, unchanged).
- **Checks.** A Node checker compiles everything with local `clang++` and runs Python snippets with `python3`. A
  headless-Chrome self-test runs samples through the real in-browser clang 8.

**Tech Stack:** React/Vite, wasm-clang (clang 8.0.1, C++14, no exceptions), Node scripts, local clang++ 21,
Python 3.9.6.

**Spec:** `docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md` (read it in full). Also read the Rust spec it
builds on: `docs/superpowers/specs/2026-11-15-rust-track-design.md`, the sections "Lesson data" and "Teaching fields
and the taught-before-used rule".

## Global Constraints

- Revise must not change. No edits to these:
  - `app/src/data/foundations/**`
  - `app/src/foundations/grade.js` behaviour
  - `app/src/runtime/**`
  - `app/src/workbench/runner.js`
  - the `dsa-foundations` storage shape
- The Rust track must not change visibly. `node scripts/verify-rust.mjs` and `node scripts/verify-foundations.mjs`
  must still pass.
- Lesson C++ compiles under `clang++ -std=c++14 -fno-exceptions -O1 -w`. Explicit includes only. No structured
  bindings, `std::optional`, `<bits/stdc++.h>`, `try` or `throw`.
- Python snippets run on Python 3.9 (no `match`).
- Never store the output of undefined behaviour as an expected output or a predict answer.
- Storage keys: `dsa-cpp-path` (`'learn' | 'revise'`) and `dsa-cpp-learn` (progress, same record shape as `dsa-rust`).
- Lesson ids are `c<stage>-slug`. Stage ids: `basics`, `control`, `functions`, `sequences`, `memory`, `classes`,
  `stl`, `dsa`.
- UI: white cards, the blue palette with green only for pass/done, 8px corners, no cross-fades or slide-ins, and light
  and dark of equal quality.
- Every Learn lesson is under the taught-before-used rule; there is no migration set.
- Do not commit or push. The lead commits after review.

## Review Focus

1. **An infinite loop in learner code.** It ends as a time-limit result and the page stays usable. Task 2's self-test
   includes the fixture `c0-loop` (the reference solution is fine; the self-test also runs a `while (true) {}` body
   and expects `tle`).
2. **A crash mid-harness**, for example `.at()` out of range in test 2. Test 1 shows as passed, test 2 fails with the
   crash message, and test 3 shows "not run". Task 1 unit-checks `gradeRun` with this exact stdout; Task 2's self-test
   runs the fixture `c0-crash`.
3. **A missing `#include` or `main` in learner code.** The full clang error shows and it is not counted as a miss.
   Covered by Task 2's self-test, which feeds `c0-fix`'s starter.
4. **Using Learn never alters Revise.** After a Learn pass and a Learn/Revise toggle, `localStorage['dsa-foundations']`
   is byte-identical to before. The self-test in Task 2 asserts this.
5. **Default path and backup.**
   - A browser with a passed Revise lesson opens Revise; an empty browser opens Learn.
   - Export/import round-trips `dsa-cpp-learn` and `dsa-cpp-path`.
   - Task 2's self-test asserts all three.

---

### Task 1: Data, grading, syntax registry, checker, example lessons

**Files:**
- Create: `app/src/data/cpp-learn/index.js`. It exports `STAGES` (8 entries, shape as in `app/src/data/rust/index.js`)
  and `LESSONS`.
- Create the stage files, each `export const LESSONS = []` for now (stage 1 gets the examples):
  - `stage-1-first.js`, `stage-2-control.js`, `stage-3-functions.js`
  - `stage-4-sequences-a.js`, `stage-4-sequences-b.js`
  - `stage-5-memory.js`, `stage-6-classes.js`
  - `stage-7-stl-a.js`, `stage-7-stl-b.js`, `stage-8-dsa.js`
  - `index.js` imports all of them, so later agents never touch `index.js`.
- Create: `app/src/cpp-learn/grade.js` (pure; no browser or React imports).
- Create: `app/src/cpp-learn/syntax.js`, with one commented section per stage (`// ── stage 1: basics ──` …).
- Create: `app/scripts/verify-cpp-learn.mjs`.
- Create: `docs/superpowers/specs/cpp-learn-lesson-examples.js`. It holds one verified lesson per kind, plus the
  fixtures `c0-crash` (an implement lesson whose harness test 2 calls `.at(99)`) and `c0-loop`.

**Interfaces (produces):**
- `assembleSource(lesson, code) -> string`:
  - `program`: `code + '\n' + CPP_WASM_SHIM`;
  - with a harness: `code + '\n' + lesson.harness + '\n' + CPP_WASM_SHIM`;
  - no preamble.
  - Import `CPP_WASM_SHIM` from `../runtime/executor.js`.
- `gradeRun(lesson, code, result) -> { compile?: string, tests: [{ name, status: 'pass'|'fail'|'notrun', expected, got, printed?, message? }], win: boolean, missing: string[] }`.
  - The `result` argument is `{ compileError?: string }` or `{ runs: [runTest result per test] }` for `program`, or
    one `runTest` result for harness lessons.
  - Marker handling, `require` (in `missing`) and `forbidden` follow `app/src/rust/evaluate.js`.
  - `win` means every test passes and nothing is missing.
- Re-exported from `../foundations/grade.js`: `normalise`, `forbiddenHit`.
- `SYNTAX`, `syntaxIds()`, `syntaxLabel(id)`, `detectSyntax(code)`, `codeSpans(html)`, with the same semantics as
  `app/src/rust/syntax.js`.
  - The ids cover every stage's curriculum bullets, so stage agents mostly only use them.
  - Each entry also has `stage: 1..8`.

**Steps:**

- [ ] **Step 1: Write the example lessons.** Write one lesson each of `concept` (with `teach`, `compare.py` and
  `compare.cpp`), `predict` (one output round and one error round), `fix` (with `errorMatch`), `program` (stdin
  tests), `implement` (harness), `drill` and `bugfix`, plus the fixtures. Then write a negative fixture file
  `app/scripts/fixtures/cpp-learn-bad.js` with one lesson per rule, each breaking exactly one rule:
  - a solution failing a test;
  - a starter that passes;
  - a fix starter whose error does not match;
  - a predict output that is wrong;
  - a Python snippet that raises;
  - `cout` used in the task before it is introduced;
  - an unknown field;
  - a teach example whose output is wrong.
- [ ] **Step 2: Run the checker on both files and see it fail.** Run:
  - `node scripts/verify-cpp-learn.mjs --file ../docs/superpowers/specs/cpp-learn-lesson-examples.js`
  - `node scripts/verify-cpp-learn.mjs --file scripts/fixtures/cpp-learn-bad.js`
  - Expected: the script does not exist yet.
- [ ] **Step 3: Implement `grade.js`, `syntax.js` and `verify-cpp-learn.mjs` per the spec's "Checker" section.**
  - Options: `--stage N`, `--only id`, `--file path` (a module exporting `LESSONS`).
  - The clang flags are `-std=c++14 -fno-exceptions -O1 -w`.
  - Python runs as `python3 -I` with a 2 s timeout.
  - A `gradeRun` self-check runs on startup with a synthetic crash stdout `"\n@@TEST 1@@\n5\n\n@@TEST 2@@\n"` and a
    status of `error`. The expected statuses are `['pass', 'fail', 'notrun']`.
  - Predict error rounds compile `main.cpp` in a scratch directory, so paths read `main.cpp`.
  - The environment variable `CPP_LEARN_ASSUME=K` treats every registry id with `stage <= K` as taught before
    stage 1. Tasks 4–8 use it when they run in parallel.
- [ ] **Step 4: Run the checker again and see both outcomes.**
  - Expected: the examples print `ok` for every lesson and exit 0.
  - The bad fixtures print `FAIL` for every lesson, each with the reason naming its broken rule, and exit 1.
- [ ] **Step 5: Copy the non-fixture examples into `stage-1-first.js`**, so the app has something to render.
  - Then run `node scripts/verify-cpp-learn.mjs`. Expected: all `ok`, exit 0.
  - Also run `npm run lint`. Expected: clean.

### Task 2: App — path switch, Learn track, workbench, store, review mode, browser self-test

**Files:**
- Modify: `app/src/App.jsx`. Add `path` state from `dsa-cpp-path`. The default rule is in spec point 4 under
  "Settled": `'learn'` when no `dsa-foundations` lesson has `passedAt`. For the C++ track, render `<CppLearnTrack>`
  or `<Foundations>`.
- Modify: `app/src/workbench/DrawerParts.jsx`. Add `PathSwitch({ path, onPath })`, styled like `TrackSwitch`. It is
  rendered under `TrackSwitch` only when `track === 'cpp'`, in both the Foundations and Learn drawers, via a new
  optional `path`/`onPath` drawer prop.
  - Grep how `TrackSwitch` is placed and passed: `grep -rn "TrackSwitch\|onTrack" app/src`.
- Create in `app/src/cpp-learn/`:
  - `CppLearnTrack.jsx`, mirroring `RustTrack.jsx`.
  - `useCppLearnStore.js`, mirroring `useRustStore.js` with `KEY = 'dsa-cpp-learn'`.
  - `lessons.js`.
  - `CppLearnWorkbench.jsx`, modelled on `RustWorkbench.jsx`. It uses `exclusive`, `compile`, `runTest` and
    `limitFor` from `../workbench/runner.js`, and `assembleSource`/`gradeRun` from Task 1. The fold rule, unlock rule
    and miss rule are the same as Rust. Compiler output is shown in full, with `gloss` above it for `fix` lessons.
  - `CppLearnHelp.jsx`, with the tabs `refresher`, `py` ("In Python"), `hints` and `answer`.
  - `cpp-learn.css`.
- Share, don't copy, where a prop is enough. `ConceptCard.jsx` and `PredictPanel.jsx` get label props (for example
  `compareLabels={['Python', 'C++']}`, code languages `python`/`cpp`). The Rust defaults stay as they are today.
- Modify: `app/src/workbench/reviewPrompt.js`. Add mode `'cpp-learn'`: "learning C++ from scratch, strong in Python;
  relate advice to Python where useful".
- Create: `app/scripts/browser-selftest-cpp-learn.mjs`, modelled on `browser-selftest-rust.mjs`, against
  `npm run dev`. It runs these cases:
  1. Each requested lesson's reference solution, through the real UI or the real `runner.js` path, must pass.
     Options: `--limit N`, `--stage N`, `--all`.
  2. The `fix` starters must fail with `errorMatch` (a hard failure if not). Predict error rounds must fail to compile;
     a wording mismatch is only a warning.
  3. Review Focus 1–3: an infinite loop gives `tle`; `c0-crash` gives pass/fail/notrun; a starter missing its include
     shows a compile error and the miss count is unchanged.
  4. Review Focus 4: snapshot `localStorage['dsa-foundations']`, pass a Learn lesson, toggle Revise→Learn, and assert
     the snapshot is byte-identical.
  5. Review Focus 5: an empty storage opens Learn; seeding a passed Revise lesson opens Revise; export, clear and
     import restore `dsa-cpp-learn` and `dsa-cpp-path`.

**Interfaces:**
- Consumes: Task 1's `assembleSource`, `gradeRun`, `STAGES` and `LESSONS`.
- Produces: `CppLearnTrack({ prefs, onMode, onTrack, path, onPath })`, the `PathSwitch` export, and the
  `dsa-cpp-path` semantics.

**Steps:**

- [ ] **Step 1: Write `browser-selftest-cpp-learn.mjs` with cases 1–5 above.** Run it against the dev server
  (`node scripts/browser-selftest-cpp-learn.mjs --all`). Expected: it fails, because there is no Learn UI yet.
- [ ] **Step 2: Implement the files above.**
- [ ] **Step 3: Run the Learn self-test again.** Run `node scripts/browser-selftest-cpp-learn.mjs --all`. Expected:
  all cases pass.
- [ ] **Step 4: Check that nothing regressed.** Run these from `app/`:
  - `node scripts/browser-selftest.mjs`, the existing Revise self-test, using its usual options.
  - `node scripts/browser-selftest-rust.mjs r --limit 5`.
  - `node scripts/verify-foundations.mjs` and `node scripts/verify-rust.mjs`.
  - `npm run lint` and `npm run build`.
  - Expected: all pass.
- [ ] **Step 5: Take screenshots** (headless, via CDP) of the Learn lesson screen in light and dark, the In Python
  tab, and the drawer with both switches. Save them to the session scratchpad for the lead.

### Task 3: Stage 1 content (gate: lead review, then the owner)

**Files:** `app/src/data/cpp-learn/stage-1-first.js` (replaces the examples; keep none of the `c0-` fixtures).
Optionally, append ids to the stage 1 section of `app/src/cpp-learn/syntax.js`.

- [ ] **Step 1: Write about 25 lessons covering every stage 1 bullet in the spec.** Teaching first, Python bridges,
  and each lesson's `introduces` uses stage 1 registry ids. The Rust track's `app/src/data/rust/stage-1-basics.js` is
  the style reference for depth of teaching.
- [ ] **Step 2: Run the checker on stage 1.** Run `node scripts/verify-cpp-learn.mjs --stage 1`. Expected: all `ok`,
  exit 0.
- [ ] **Step 3: Run the browser self-test on stage 1.** Run
  `node scripts/browser-selftest-cpp-learn.mjs --stage 1`. Expected: all pass.
- [ ] **Step 4: Append "What stage 1 taught" to the spec.** List the ids and one line on what was taught "for now".

### Tasks 4–8: Stages 2–8 content (in parallel, after the owner approves stage 1)

One agent per group. Each agent edits only its own stage files and its own stage section(s) of `syntax.js`:

| Task | Stages | Files |
|---|---|---|
| 4 | 2 and 3 | `stage-2-control.js`, `stage-3-functions.js` |
| 5 | 4 | `stage-4-sequences-a.js`, `stage-4-sequences-b.js` |
| 6 | 5 | `stage-5-memory.js` |
| 7 | 6 | `stage-6-classes.js` |
| 8 | 7 and 8 | `stage-7-stl-a.js`, `stage-7-stl-b.js`, `stage-8-dsa.js` |

For each agent:

- [ ] **Step 1: Write the lessons.** Cover every bullet of the stage in the spec. Use only ids from earlier stages'
  sections plus your own. Each stage ends with 2–3 practice lessons.
- [ ] **Step 2: Run the checker on each stage.** Run `node scripts/verify-cpp-learn.mjs --stage N`. Expected: all `ok`.
  - Earlier stages may still be empty while agents run in parallel. Run with `CPP_LEARN_ASSUME=<N-1>`, which makes the
    checker treat every registry id of stages 1..N-1 as taught. Task 1 implements that environment variable.
- [ ] **Step 3: Run the browser self-test on each stage.** Run
  `node scripts/browser-selftest-cpp-learn.mjs --stage N`. Expected: all pass.
- [ ] **Step 4: Append "What stage N taught" to the spec.**

### Task 9: Final verification and deploy (lead)

- [ ] **Step 1: Run every check.** Run `node scripts/verify-cpp-learn.mjs` (no assume env). Also run
  `node scripts/browser-selftest-cpp-learn.mjs --all`, `verify-foundations.mjs`, `verify-rust.mjs`, `npm run lint` and
  `npm run build`. Expected: all pass.
- [ ] **Step 2: Lead review.** Sample 3 lessons per stage for teaching quality, Python parallels and no undefined
  behaviour in stored outputs, and fix what's found.
- [ ] **Step 3: Commit, push and deploy.**
  - Commit as `feat: C++ Learn path (teach-from-zero, Python parallels) with Learn | Revise switch`.
  - Push.
  - Watch the deploy with `gh run watch`.
  - Confirm the live bundle contains "In Python".
