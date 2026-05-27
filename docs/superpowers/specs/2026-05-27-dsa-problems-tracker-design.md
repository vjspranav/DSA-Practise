# DSA Problems Tracker — Design Spec
**Date:** 2026-05-27

## Overview

Expand the DSA compiler env from 4 problems to ~46, add category-based sidebar organisation, persist user code and problem status in localStorage, and track which problems Himali asked VJS vs VJS asked Himali.

---

## 1. Data Layer

### Directory structure

```
src/data/problems/
  binary-search.js
  greedy.js
  binary-trees.js
  heap.js
  sliding-window.js      ← existing 4 VJS problems move here
  stacks-queues.js
  index.js               ← assembles all, exports PROBLEMS + CATEGORIES
```

### Problem shape

Each problem object keeps the existing shape (id, title, difficulty, category, description, examples, constraints, hints, inputFormat, defaultCustomInput, testCases, cppStarter, pythonStarter, buildCppHarness, buildPythonHarness) and gains one new field:

```js
askedBy: 'himali' | 'vjs'
```

### CATEGORIES export

Drives sidebar ordering:

```js
export const CATEGORIES = [
  { id: 'binary-search',  label: 'Binary Search' },
  { id: 'greedy',         label: 'Greedy' },
  { id: 'binary-trees',   label: 'Binary Trees' },
  { id: 'heap',           label: 'Heap' },
  { id: 'sliding-window', label: 'Sliding Window & Two Pointers' },
  { id: 'stacks-queues',  label: 'Stacks & Queues' },
]
```

### Full problem list

**Binary Search**
| # | Title | Difficulty | Asked by |
|---|-------|-----------|----------|
| 1 | Koko Eating Bananas | Medium | Himali |
| 2 | Aggressive Cows | Medium | Himali |
| 3 | Find Peak Element | Medium | Himali |
| 4 | Search in Rotated Sorted Array | Medium | VJS |
| 5 | Painters Partition Problem | Hard | VJS |
| 6 | Magic Powder | Medium | VJS |

**Greedy**
| # | Title | Difficulty | Asked by |
|---|-------|-----------|----------|
| 1 | Fractional Knapsack | Easy | Himali |
| 2 | Minimum Coins | Easy | Himali |
| 3 | Minimum Platforms (Railway) | Medium | Himali |
| 4 | Candy | Hard | Himali |
| 5 | Jump Game | Medium | VJS |
| 6 | LRU Cache | Medium | VJS |
| 7 | Merge Intervals | Medium | VJS |
| 8 | Valid Parentheses | Easy | VJS |

**Binary Trees**
| # | Title | Difficulty | Asked by |
|---|-------|-----------|----------|
| 1 | LCA in Binary Tree | Medium | Himali |
| 2 | Burn Binary Tree | Hard | Himali |
| 3 | Morris Preorder / Inorder Traversal | Hard | Himali |
| 4 | Children Sum Property in BT | Medium | VJS |
| 5 | Zig-Zag Level Order Traversal | Medium | VJS |
| 6 | Construction of BT from Preorder+Inorder | Medium | VJS |
| 7 | Boundary Traversal of BT | Medium | VJS |

**Heap**
| # | Title | Difficulty | Asked by |
|---|-------|-----------|----------|
| 1 | Minimum Cost to Connect Sticks | Medium | Himali |
| 2 | Find Median from Data Stream | Hard | Himali |
| 3 | Merge K Sorted Lists | Hard | Himali |
| 4 | Hand of Straights | Medium | Himali |
| 5 | Task Scheduler | Medium | VJS |
| 6 | Kth Largest Element in a Stream | Medium | VJS |
| 7 | Design Twitter | Medium | VJS |
| 8 | Maximum Sum Combination | Medium | VJS |

**Sliding Window & Two Pointers**
| # | Title | Difficulty | Asked by |
|---|-------|-----------|----------|
| 1 | Fruit Into Baskets | Medium | Himali |
| 2 | Count Number of Nice Subarrays | Medium | Himali |
| 3 | Number of Substrings Containing All Three Characters | Medium | Himali |
| 4 | Minimum Window Substring | Hard | Himali |
| 5 | Binary Subarrays With Sum | Medium | VJS |
| 6 | Maximum Points You Can Obtain from Cards | Medium | VJS |
| 7 | Subarrays with K Different Integers | Hard | VJS |
| 8 | Minimum Window Subsequence | Hard | VJS |

**Stacks & Queues**
| # | Title | Difficulty | Asked by |
|---|-------|-----------|----------|
| 1 | Trapping Rain Water | Hard | Himali |
| 2 | Asteroid Collision | Medium | Himali |
| 3 | Celebrity Problem | Medium | Himali |
| 4 | LFU Cache | Hard | Himali |
| 5 | Stock Span | Medium | VJS |
| 6 | Largest Rectangle in a Histogram | Hard | VJS |
| 7 | Sum of Subarray Minimums | Medium | VJS |
| 8 | Maximum Rectangle | Hard | VJS |

---

## 2. Persistence

A `usePracticeStore` hook handles all localStorage I/O.

### localStorage keys

```
dsa-code    → { [problemId]: { cpp: string, python: string } }
dsa-status  → { [problemId]: "complete" | "revise" | null }
```

### Behaviour

- `getCode(problemId, lang)` — returns saved code or falls back to `cppStarter` / `pythonStarter`
- `saveCode(problemId, lang, code)` — debounced 500ms, writes to localStorage
- `getStatus(problemId)` — returns current status or null
- `setStatus(problemId, status)` — immediate write

`App.jsx` replaces the current in-memory `userCode` state with this hook.

---

## 3. Sidebar

### Layout

Category groups with a sticky section header label. Problems are numbered sequentially within each category.

### Per-problem row (expanded)

```
[01] Koko Eating Bananas         H ●
[04] Search in Rotated Array     V ↩
```

- **H / V pill**: teal background for H (Himali asked), purple for V (VJS asked)
- **Status icon**: `●` green = complete, `↩` orange = to revise, nothing = untouched
- Active problem row is highlighted

### Collapsed sidebar

Shows only the problem number + a small status-coloured dot. H/V pill hidden (too small to be useful).

### Category headers

Always visible, non-collapsible. 6 categories — collapsing adds friction for no benefit.

---

## 4. Workspace Status Controls

### Button placement

```
[ ▶ Run ]  [ ✓ Submit ]  │  [ ✓ Complete ]  [ ↩ Revise ]
```

- Both status buttons are toggles — clicking an active one clears status back to null
- Mutually exclusive — setting one clears the other
- Active state: Complete = filled green, Revise = filled orange

### Sidebar context button

Each sidebar problem row shows a `⋯` button on hover. Clicking opens a small popover with "Mark Complete" and "Mark Revise" options — same toggle behaviour. Lets you update status without navigating away from the current problem.

---

## 5. Visualizations

### Principle

Every visualization is a proper visual component — SVG, canvas, or DOM-rendered. No ASCII art, no generic fallback.

### Existing viz types (keep)

- `array-windows` — coloured range highlights on an array
- `array-ends` — left/right selection on array ends
- `string-window` — sliding window over a string

### New viz types by category

| Problem type | Visualization approach |
|---|---|
| Binary trees | SVG tree renderer — nodes, edges, path/burn highlights per problem |
| Histograms | SVG bar chart — Largest Rectangle, Trapping Rain Water |
| Greedy / Platforms | Timeline or bar chart as appropriate |
| Heap | Array + implicit tree dual view where helpful |
| Graph / grid problems | SVG or canvas, drawn per-problem |
| Simple array/string | Extend existing array-windows style or text-only if clearest |

Each problem's visualization component lives alongside or within its category file. If a problem's example is clearest as text, no visualization is added — visual only where it genuinely helps.

---

## Out of scope

- Filtering / sorting problems by status or attribution
- Notes / comments per problem
- Progress statistics / charts
- Any backend or sync — runs fully locally
