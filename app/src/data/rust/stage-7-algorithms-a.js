// Rust lessons: stage 7 part A, algorithms (recursion, windows, graphs).
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end). Check with: node scripts/verify-rust.mjs --stage 7
// Ids must start with r7- and be unique across the track. Every lesson teaches the algorithm idea with a worked trace,
// the complexity, and the Rust shape of the solution (`teach`), lists the syntax ids it introduces, then keeps the old
// harness and tests (including the large verified cases).

export const LESSONS = [
  {
    id: 'r7-subsets',
    title: 'Subsets',
    kind: 'implement',
    introduces: ['ref-mut', 'clone'],
    teach: {
      body: [
        `<p>Stage 7 is where the data structures from stages 5 and 6 get used to solve problems. Each lesson has the same three parts: the <strong>idea</strong> in plain words with a small worked trace, the <strong>cost</strong>, and the <strong>Rust shape</strong> of the code (which types, which borrows, which collections). You write C++ versions of all of these in the C++ track, so the idea is a refresher, and the Rust shape is the new part.</p>`,
        `<p><strong>Backtracking</strong> builds an answer one choice at a time. You keep a <em>current partial answer</em>, and a recursive function does three things around each choice: <strong>choose</strong> (add the item to the partial answer), <strong>explore</strong> (recurse to build everything that starts with that choice), <strong>un-choose</strong> (remove the item again so the partial answer is back exactly as it was). Because every call leaves the state as it found it, one shared partial answer is enough. For subsets: the partial answer <code>cur</code> is itself a valid subset at every moment, so record it first, then try adding each later number in turn. Trace for <code>[1, 2]</code>: record <code>[]</code>; choose 1 and recurse; record <code>[1]</code>; choose 2 and recurse; record <code>[1, 2]</code>; un-choose 2; un-choose 1; choose 2 and recurse; record <code>[2]</code>; un-choose 2. Result: <code>[] [1] [1, 2] [2]</code>. Looping only over indices <em>after</em> <code>start</code> is what stops the same subset appearing twice in a different order. There are 2<sup>n</sup> subsets and each copy costs up to n, so the cost is O(n &middot; 2<sup>n</sup>).</p>`,
        `<p>The Rust shape. A function declared <em>inside</em> another function (<code>fn go(...)</code> written in the body of <code>subsets</code>) is private to it, which keeps the helper next to the only code that calls it. But a nested function cannot see the outer function's variables, so everything it needs travels as a parameter: the input as <code>&amp;[i32]</code>, the partial answer as <code>&amp;mut Vec&lt;i32&gt;</code> and the results as <code>&amp;mut Vec&lt;Vec&lt;i32&gt;&gt;</code>. (C++ would often use a lambda or a global here.) When you hand your own <code>&amp;mut</code> parameter to the recursive call, write just <code>cur</code>, not <code>&amp;mut cur</code>: Rust lends it for the call and you get it back afterwards. Recording the result needs <code>out.push(cur.clone())</code> with a <code>.clone()</code>: pushing <code>cur</code> itself would not compile (it is only borrowed, so you cannot move it away), and it would be wrong anyway, since <code>cur</code> keeps changing after you record it. At the top level, <code>&amp;mut Vec::new()</code> creates a temporary empty vector and lends it to the call.</p>`,
      ],
      examples: [
        {
          code: `// All 2-digit binary strings, by choose / explore / un-choose.
fn go(len: usize, cur: &mut Vec<u8>, out: &mut Vec<Vec<u8>>) {
    if cur.len() == len {
        out.push(cur.clone());      // a snapshot; cur keeps changing afterwards
        return;
    }
    for bit in 0..2 {
        cur.push(bit);              // choose
        go(len, cur, out);          // explore (cur is passed on as it is)
        cur.pop();                  // un-choose
    }
}

fn main() {
    let mut out = Vec::new();
    go(2, &mut Vec::new(), &mut out);
    println!("{:?}", out);
}`,
          output: '[[0, 0], [0, 1], [1, 0], [1, 1]]',
          caption: 'The same three beats as subsets, with a different way to decide what to try and when to record.',
        },
      ],
      terms: [
        {
          code: 'fn go(...) { ... } inside a fn',
          meaning: 'a helper private to the outer function; it cannot see the outer variables',
        },
        {
          code: 'cur: &mut Vec<i32>',
          meaning: 'the one shared partial answer, lent mutably to every recursive call',
        },
        {
          code: 'go(nums, i + 1, cur, out)',
          meaning: 'passes your own &mut on without writing &mut again',
        },
        { code: 'out.push(cur.clone())', meaning: 'records a copy; the original keeps changing' },
        { code: 'go(nums, 0, &mut Vec::new(), &mut out)', meaning: 'lends a temporary empty Vec for the whole call' },
      ],
    },
    task: `Write <code>subsets</code>: return every subset of <code>nums</code> (distinct values), including the empty one. Any order is accepted.`,
    refresher: [
      'Backtracking: at each index choose to take the value or skip it, recurse, then undo the choice.',
      `Pass one <code>&amp;mut Vec</code> down the recursion for the current subset and another for the results. <code>cur.clone()</code> snapshots it.`,
    ],
    hints: [
      `A nested helper cannot see the outer variables, so give it parameters for the numbers, where to start, the partial subset and the results.`,
      `Every state of the walk is itself a subset: record a copy of it at the very top of the helper, before any loop.`,
      `Then loop over the positions from <code>start</code> on: choose one, recurse past it, and undo the choice so the next iteration starts clean.`,
    ],
    inCpp: {
      code: `void go(const vector<int>& nums, size_t start, vector<int>& cur, vector<vector<int>>& out) {
    out.push_back(cur);
    for (size_t i = start; i < nums.size(); i++) {
        cur.push_back(nums[i]);
        go(nums, i + 1, cur, out);
        cur.pop_back();
    }
}`,
      note: `The shape is the same, but a Rust helper cannot quietly share state through a member or a global. Every piece of mutable state travels as an explicit <code>&amp;mut</code> parameter, and <code>out.push(cur.clone())</code> shows where the copy happens.`,
    },
    starter: `// nums holds distinct values. Return all 2^n subsets, each as a Vec.
fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    Vec::new()
}`,
    solution: `fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    fn go(nums: &[i32], start: usize, cur: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        out.push(cur.clone());
        for i in start..nums.len() {
            cur.push(nums[i]);
            go(nums, i + 1, cur, out);
            cur.pop();
        }
    }
    let mut out = Vec::new();
    go(nums, 0, &mut Vec::new(), &mut out);
    out
}`,
    harness: `fn harness_show(v: &[i32]) -> String {
    let parts: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    format!("[{}]", parts.join(" "))
}

fn harness_run(nums: &[i32]) {
    let mut r = subsets(nums);
    r.sort();
    for s in &r {
        println!("{}", harness_show(s));
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    harness_run(&[1, 2, 3]);
    println!("\\n@@TEST 2@@");
    harness_run(&[]);
    println!("\\n@@TEST 3@@");
    harness_run(&[5]);
    println!("\\n@@TEST 4@@");
    harness_run(&[-1, 4]);
    println!("\\n@@TEST 5@@");
    let nums: Vec<i32> = (1..=16).collect();
    let mut r = subsets(&nums);
    let count = r.len();
    let total: i64 = r.iter().flat_map(|s| s.iter()).map(|&x| x as i64).sum();
    r.sort();
    r.dedup();
    let distinct = if r.len() == count { "distinct" } else { "duplicates" };
    println!("{} {} {}", count, total, distinct);
}`,
    tests: [
      {
        name: 'Three values',
        input: '[1, 2, 3]',
        expected: `[]
[1]
[1 2]
[1 2 3]
[1 3]
[2]
[2 3]
[3]`,
      },
      { name: 'Empty input', input: '[]', expected: '[]' },
      {
        name: 'One value',
        input: '[5]',
        expected: `[]
[5]`,
      },
      {
        name: 'Negative value',
        input: '[-1, 4]',
        expected: `[]
[-1]
[-1 4]
[4]`,
      },
      { name: 'Sixteen values', input: '1..16 (count, element total)', expected: '65536 4456448 distinct' },
    ],
  },

  {
    id: 'r7-permutations',
    title: 'Permutations',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>A permutation uses every number once, in some order. The backtracking is the same choose / explore / un-choose, with two changes. First, the partial answer is only a result when it is <em>full</em> (<code>cur.len() == nums.len()</code>), so that is where you record. Second, each step may pick <em>any</em> number that is not in the partial answer yet, from the whole input, not only from later positions. To know what is already used, keep a parallel <code>Vec&lt;bool&gt;</code> with one flag per index: set <code>used[i] = true</code> when you choose <code>nums[i]</code>, and set it back to <code>false</code> when you un-choose.</p>`,
        `<p>Trace for <code>[1, 2, 3]</code>, the first level only. Pick 1: now choose among 2 and 3. Pick 2, then 3 is the only one left: record <code>[1, 2, 3]</code>. Back up, pick 3 instead, then 2: record <code>[1, 3, 2]</code>. Back up to the top, pick 2 first (<code>[2, 1, 3]</code>, <code>[2, 3, 1]</code>), then 3 first (<code>[3, 1, 2]</code>, <code>[3, 2, 1]</code>). There are n! orderings (3 &middot; 2 &middot; 1 = 6 here, 40 320 for 8), and each costs O(n) to copy, so O(n &middot; n!). This grows so fast that n above 10 or 11 is out of reach for any language.</p>`,
        `<p>The Rust shape: four parameters (input, <code>used</code>, <code>cur</code>, <code>out</code>), and the loop skips used items with <code>continue</code>. <code>vec![false; nums.len()]</code> builds the flags, and passing <code>&amp;mut vec![false; nums.len()]</code> in the first call lends a temporary to the whole recursion. Indexing a <code>&amp;mut Vec&lt;bool&gt;</code> parameter just works: <code>used[i] = true</code>, no <code>*</code> needed. The pitfall is an un-choose you forget: if <code>used[i]</code> is never reset, later branches think the value is gone, and you silently get too few results.</p>`,
      ],
      examples: [
        {
          code: `// All orderings of the letters, by choose / explore / un-choose with a used flag per letter.
fn go(letters: &[char], used: &mut Vec<bool>, cur: &mut String, out: &mut Vec<String>) {
    if cur.len() == letters.len() {
        out.push(cur.clone());
        return;
    }
    for i in 0..letters.len() {
        if used[i] {
            continue;                // this letter is already in cur
        }
        used[i] = true;              // choose
        cur.push(letters[i]);
        go(letters, used, cur, out); // explore
        cur.pop();                   // un-choose
        used[i] = false;
    }
}

fn main() {
    let letters = ['a', 'b', 'c'];
    let mut out = Vec::new();
    go(&letters, &mut vec![false; 3], &mut String::new(), &mut out);
    println!("{:?}", out);
}`,
          output: '["abc", "acb", "bac", "bca", "cab", "cba"]',
        },
      ],
      terms: [
        {
          code: 'used: &mut Vec<bool>',
          meaning: 'one flag per input index: is it in the partial answer?',
        },
        { code: 'if used[i] { continue; }', meaning: 'skip values already chosen' },
        {
          code: '&mut vec![false; n]',
          meaning: 'a temporary all-false vector, lent to the recursion',
        },
        { code: 'cur.len() == nums.len()', meaning: 'the partial answer is full, so record it' },
      ],
    },
    task: `Write <code>permutations</code>: return every ordering of <code>nums</code> (distinct values). Any order is accepted.`,
    refresher: [
      `Backtracking again: build the permutation one slot at a time, using a <code>used</code> flag per index so no value is picked twice.`,
      `A permutation is complete when <code>cur.len() == nums.len()</code>. Push a clone of it, then return.`,
    ],
    hints: [
      `Record only when the partial permutation is as long as the input, then <code>return</code> so the loop below does not run.`,
      `Every call loops over all indices <code>0..nums.len()</code> and skips the ones whose flag says they are taken.`,
      'Choosing sets the flag and pushes; un-choosing must undo both, in the reverse order.',
    ],
    inCpp: {
      code: `void go(const vector<int>& nums, vector<bool>& used, vector<int>& cur, vector<vector<int>>& out) {
    if (cur.size() == nums.size()) { out.push_back(cur); return; }
    for (size_t i = 0; i < nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true; cur.push_back(nums[i]);
        go(nums, used, cur, out);
        cur.pop_back(); used[i] = false;
    }
}`,
      note: `Both languages pass the scratch state by reference. In Rust the reference is spelled <code>&amp;mut</code> at the call site too, so you can see which calls may change what.`,
    },
    starter: `// nums holds distinct values. Return all n! orderings.
fn permutations(nums: &[i32]) -> Vec<Vec<i32>> {
    Vec::new()
}`,
    solution: `fn permutations(nums: &[i32]) -> Vec<Vec<i32>> {
    fn go(nums: &[i32], used: &mut Vec<bool>, cur: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if cur.len() == nums.len() {
            out.push(cur.clone());
            return;
        }
        for i in 0..nums.len() {
            if used[i] {
                continue;
            }
            used[i] = true;
            cur.push(nums[i]);
            go(nums, used, cur, out);
            cur.pop();
            used[i] = false;
        }
    }
    let mut out = Vec::new();
    go(nums, &mut vec![false; nums.len()], &mut Vec::new(), &mut out);
    out
}`,
    harness: `fn harness_show(v: &[i32]) -> String {
    let parts: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    parts.join(" ")
}

fn harness_run(nums: &[i32]) {
    let mut r = permutations(nums);
    r.sort();
    for p in &r {
        println!("{}", harness_show(p));
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    harness_run(&[1, 2, 3]);
    println!("\\n@@TEST 2@@");
    harness_run(&[4]);
    println!("\\n@@TEST 3@@");
    harness_run(&[2, 1]);
    println!("\\n@@TEST 4@@");
    harness_run(&[2, -1, 0]);
    println!("\\n@@TEST 5@@");
    let nums = [5, 3, 8, 1, 7, 2, 6, 4];
    let mut sorted = nums.to_vec();
    sorted.sort();
    let mut r = permutations(&nums);
    let count = r.len();
    let all_valid = r.iter().all(|p| {
        let mut q = p.clone();
        q.sort();
        q == sorted
    });
    r.sort();
    r.dedup();
    if count == 40320 && all_valid && r.len() == count {
        println!("40320 all valid and distinct");
    } else {
        println!("{} results, valid: {}, distinct: {}", count, all_valid, r.len() == count);
    }
}`,
    tests: [
      {
        name: 'Three values',
        input: '[1, 2, 3]',
        expected: `1 2 3
1 3 2
2 1 3
2 3 1
3 1 2
3 2 1`,
      },
      { name: 'One value', input: '[4]', expected: '4' },
      {
        name: 'Two values',
        input: '[2, 1]',
        expected: `1 2
2 1`,
      },
      {
        name: 'Negative and zero',
        input: '[2, -1, 0]',
        expected: `-1 0 2
-1 2 0
0 -1 2
0 2 -1
2 -1 0
2 0 -1`,
      },
      { name: 'Eight values', input: '8 distinct values (40 320 results)', expected: '40320 all valid and distinct' },
    ],
  },

  {
    id: 'r7-n-queens',
    title: 'N-Queens',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>Place n queens on an n x n board so that no two share a row, a column or a diagonal. Backtracking fits: since each row holds exactly one queen, place them <em>row by row</em>. At row <code>r</code>, try every column <code>c</code>; if the square is not attacked, put a queen there, recurse into row <code>r + 1</code>, then remove it. Reaching row n means all n queens fit: that is one solution, so return 1. Every other call returns the sum of what its children returned. Counting by returning a number up the recursion means you need no counter variable to share.</p>`,
        `<p>"Is this square attacked?" must be O(1), so keep three <code>bool</code> tables. <code>cols[c]</code>: a queen already stands in column c. Diagonals running down-left share the same <code>r + c</code>, and diagonals running down-right share the same <code>r - c</code>. A <code>usize</code> cannot be negative, so shift: use <code>r + n - 1 - c</code>, which is always between 0 and 2n - 2. Number the squares of a 4 x 4 board and you can see it in the example below. Trace for n = 4: a queen at (0,0) leaves only column 2 or 3 in row 1. Try (1,2): row 2 has every column attacked (column 0 and 2 by column, 1 by a diagonal, 3 by the other diagonal), so backtrack. Try (1,3): then (2,1) fits, and row 3 has no free square. Back at row 0, a queen at (0,1) leads to the solution columns 1, 3, 0, 2, and (0,2) to the mirror image 2, 0, 3, 1. So the answer for 4 is 2.</p>`,
        `<p>The cost is far below n<sup>n</sup> because attacked squares are pruned immediately, but it is still exponential: n = 8 gives 92 and n = 9 gives 352, instantly; n = 14 already takes a noticeable time. The Rust shape: the three tables as <code>&amp;mut [bool]</code> parameters (a slice is enough, you only index it), created in the first call with <code>&amp;mut vec![false; n]</code>. The return type <code>u32</code> carries the count.</p>`,
      ],
      examples: [
        {
          code: `// The two diagonal numbers for each square of a 4 x 4 board.
fn main() {
    let n = 4;
    for r in 0..n {
        let mut down_left = Vec::new();
        let mut down_right = Vec::new();
        for c in 0..n {
            down_left.push(r + c);              // same number = same "/" diagonal
            down_right.push(r + n - 1 - c);     // same number = same "\\" diagonal
        }
        println!("{:?}  {:?}", down_left, down_right);
    }
}`,
          output: `[0, 1, 2, 3]  [3, 2, 1, 0]
[1, 2, 3, 4]  [4, 3, 2, 1]
[2, 3, 4, 5]  [5, 4, 3, 2]
[3, 4, 5, 6]  [6, 5, 4, 3]`,
          caption: 'Two squares attack each other along a diagonal exactly when one of these two numbers matches.',
        },
      ],
      terms: [
        {
          code: 'row + col',
          meaning: 'identifies a "/" diagonal; all its squares share the sum',
        },
        { code: 'row + n - 1 - col', meaning: 'identifies a "\\" diagonal without going negative' },
        { code: 'cols: &mut [bool]', meaning: 'a flag table taken as a slice; you only index it' },
        {
          code: 'count += place(row + 1, ...)',
          meaning: 'each call returns how many solutions lie below it; no shared counter',
        },
      ],
    },
    task: `Write <code>count_queens</code>: how many ways can <code>n</code> queens be placed on an <code>n</code> x <code>n</code> board so none attack each other?`,
    refresher: [
      `Place one queen per row. A column, a diagonal <code>row + col</code> and an anti-diagonal <code>row + n - 1 - col</code> may each hold only one queen.`,
      `Keep three <code>Vec&lt;bool&gt;</code> flag arrays. Place, recurse, un-place, and add up what the recursion returns.`,
    ],
    hints: [
      `Count solutions by returning a number: a full board returns 1, and every other call returns the sum of its children.`,
      `You need three flag tables: columns, the sum <code>row + col</code>, and a shifted difference that never goes below 0.`,
      `For each column that is free in all three tables, set the flags, recurse into the next row, then clear the same flags.`,
    ],
    inCpp: {
      code: `int place(int row, int n, vector<bool>& cols, vector<bool>& d1, vector<bool>& d2) {
    if (row == n) return 1;
    int count = 0;
    for (int c = 0; c < n; c++) {
        if (cols[c] || d1[row + c] || d2[row - c + n - 1]) continue;
        cols[c] = d1[row + c] = d2[row - c + n - 1] = true;
        count += place(row + 1, n, cols, d1, d2);
        cols[c] = d1[row + c] = d2[row - c + n - 1] = false;
    }
    return count;
}`,
      note: `In C++ <code>row - c + n - 1</code> works because the indices are <code>int</code>. With <code>usize</code>, <code>row - c</code> would panic when <code>c &gt; row</code>, so write the anti-diagonal as <code>row + n - 1 - c</code>: add first, subtract last.`,
    },
    starter: `// Count the placements for an n x n board (n >= 1).
fn count_queens(n: usize) -> u32 {
    0
}`,
    solution: `fn count_queens(n: usize) -> u32 {
    fn place(row: usize, n: usize, cols: &mut [bool], d1: &mut [bool], d2: &mut [bool]) -> u32 {
        if row == n {
            return 1;
        }
        let mut count = 0;
        for c in 0..n {
            let a = row + c;
            let b = row + n - 1 - c;
            if cols[c] || d1[a] || d2[b] {
                continue;
            }
            cols[c] = true;
            d1[a] = true;
            d2[b] = true;
            count += place(row + 1, n, cols, d1, d2);
            cols[c] = false;
            d1[a] = false;
            d2[b] = false;
        }
        count
    }
    place(0, n, &mut vec![false; n], &mut vec![false; 2 * n], &mut vec![false; 2 * n])
}`,
    harness: `fn main() {
    for (i, n) in [1usize, 2, 3, 4, 6, 8, 9].iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", count_queens(*n));
    }
}`,
    tests: [
      { name: 'n = 1', input: 'n = 1', expected: '1' },
      { name: 'n = 2 (none)', input: 'n = 2', expected: '0' },
      { name: 'n = 3 (none)', input: 'n = 3', expected: '0' },
      { name: 'n = 4', input: 'n = 4', expected: '2' },
      { name: 'n = 6', input: 'n = 6', expected: '4' },
      { name: 'n = 8', input: 'n = 8', expected: '92' },
      { name: 'n = 9', input: 'n = 9', expected: '352' },
    ],
  },

  {
    id: 'r7-prefix-sums',
    title: 'Prefix sums',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>"What is the sum of <code>a[l..=r]</code>?" is easy to answer by looping, in O(n). With many queries that costs O(n &middot; q), too slow for 200 000 values and 200 000 queries (40 billion steps). A <strong>prefix sum</strong> array pays O(n) once and then answers every query in O(1). Define <code>p[i]</code> as the sum of the <em>first i</em> values, so <code>p[0] = 0</code> (the empty prefix) and <code>p[i + 1] = p[i] + a[i]</code>. The array has <code>len + 1</code> entries. The sum of <code>a[l..=r]</code> is everything up to and including r, minus everything before l: <code>p[r + 1] - p[l]</code>. The extra leading 0 is what makes l = 0 work with no special case.</p>`,
        `<p>Trace for <code>[3, 1, 4, 1, 5]</code>: <code>p = [0, 3, 4, 8, 9, 14]</code>. Query (1, 3) means 1 + 4 + 1 = 6, and <code>p[4] - p[1] = 9 - 3 = 6</code>. Query (0, 4) is <code>p[5] - p[0] = 14</code>. Total cost: O(n + q).</p>`,
        `<p>The Rust shape. Build with <code>let mut p: Vec&lt;i64&gt; = vec![0; a.len() + 1];</code> and fill in a loop. Use <code>i64</code>: the sums reach 2 &middot; 10<sup>11</sup>, far past <code>i32</code>'s 2.1 billion, and a debug build <em>panics</em> on overflow instead of wrapping silently like C++ often does. For the answers, <code>queries.iter().map(...).collect()</code> turns each query into a number and gathers them into a <code>Vec</code> (the return type tells <code>collect</code> what to build). The closure's parameter is a pattern, <code>|&amp;(l, r)|</code>: <code>.iter()</code> hands out references to tuples, and <code>&amp;(l, r)</code> takes the reference apart and copies the two numbers out, like <code>for &amp;(a, b) in ...</code> in earlier stages.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = [2, 5, 1, 4];
    let mut p = vec![0; a.len() + 1];       // p[0] = 0: the empty prefix
    for i in 0..a.len() {
        p[i + 1] = p[i] + a[i];             // p[i + 1] = sum of the first i + 1 values
    }
    println!("{:?}", p);
    println!("sum of a[1..=2] = {}", p[3] - p[1]);
}`,
          output: `[0, 2, 7, 8, 12]
sum of a[1..=2] = 6`,
        },
        {
          code: `fn main() {
    let p = [0, 2, 7, 8, 12];
    let queries = [(0, 3), (1, 2), (3, 3)];
    let answers: Vec<i32> = queries.iter().map(|&(l, r)| p[r + 1] - p[l]).collect();
    println!("{:?}", answers);
}`,
          output: '[12, 6, 4]',
          caption: 'One closure turns each query into its answer; collect gathers them into a Vec.',
        },
      ],
      terms: [
        {
          code: 'vec![0; a.len() + 1]',
          meaning: 'one more entry than the input: the leading 0 is the empty prefix',
        },
        { code: 'p[r + 1] - p[l]', meaning: 'the sum of a[l..=r], whatever l is' },
        {
          code: '|&(l, r)|',
          meaning: 'closure pattern: copies the two numbers out of a reference to a tuple',
        },
        {
          code: 'i64',
          meaning: 'wide enough for big sums; i32 would panic on overflow in a debug build',
        },
      ],
    },
    task: `Write <code>range_sums</code>: for each query <code>(l, r)</code> (inclusive) return the sum of <code>a[l..=r]</code>. There are many queries, so build a prefix array once.`,
    refresher: [
      `<code>p[i]</code> = sum of the first <code>i</code> values, so <code>p</code> has <code>len + 1</code> entries and the answer is <code>p[r + 1] - p[l]</code>.`,
      `Values reach 10<sup>9</sup> and sums exceed <code>i32</code>. Use <code>i64</code>; a debug build panics on overflow rather than wrapping.`,
    ],
    hints: [
      `The prefix vector needs one more slot than the input. Make it <code>i64</code>, since sums outgrow <code>i32</code>.`,
      'Fill it left to right: each entry is the previous entry plus the matching input value.',
      `Each query answer is the prefix just after <code>r</code> minus the prefix just before <code>l</code>. Map the queries and collect.`,
    ],
    inCpp: {
      code: `long long prefix(const vector<long long>& a) {
    vector<long long> p(a.size() + 1, 0);
for (size_t i = 0; i < a.size(); i++)
    p[i + 1] = p[i] + a[i];
    return p.back();   // with int instead of long long the sum can silently overflow
}`,
      note: `In C++ a signed overflow is undefined behaviour and nothing warns you. Rust makes the width explicit (<code>i64</code>) and a debug build panics if you were wrong, instead of giving a wrong answer.`,
    },
    starter: `// Queries are (l, r) with l <= r < a.len(), both inclusive.
fn range_sums(a: &[i64], queries: &[(usize, usize)]) -> Vec<i64> {
    Vec::new()
}`,
    solution: `fn range_sums(a: &[i64], queries: &[(usize, usize)]) -> Vec<i64> {
    let mut p: Vec<i64> = vec![0; a.len() + 1];
    for i in 0..a.len() {
        p[i + 1] = p[i] + a[i];
    }
    queries.iter().map(|&(l, r)| p[r + 1] - p[l]).collect()
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn harness_show(v: &[i64]) -> String {
    let parts: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    parts.join(" ")
}

fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", harness_show(&range_sums(&[3, 1, 4, 1, 5], &[(0, 4), (1, 3), (2, 2), (1, 1)])));
    println!("\\n@@TEST 2@@");
    println!("{}", harness_show(&range_sums(&[7], &[(0, 0)])));
    println!("\\n@@TEST 3@@");
    println!("{}", harness_show(&range_sums(&[], &[])));
    println!("\\n@@TEST 4@@");
    println!("{}", harness_show(&range_sums(&[-5, 2, -3, 8], &[(0, 1), (1, 2), (1, 3)])));
    println!("\\n@@TEST 5@@");
    let big = [1_000_000_000i64; 5];
    println!("{}", harness_show(&range_sums(&big, &[(0, 4), (1, 3)])));
    println!("\\n@@TEST 6@@");
    let mut rng = HarnessRng(11);
    let n = 200_000usize;
    let a: Vec<i64> = (0..n).map(|_| (rng.next() % 2_000_001) as i64 - 1_000_000).collect();
    let mut queries = Vec::with_capacity(200_000);
    for _ in 0..200_000 {
        let x = rng.next() as usize % n;
        let y = rng.next() as usize % n;
        queries.push((x.min(y), x.max(y)));
    }
    let r = range_sums(&a, &queries);
    let total: i64 = r.iter().sum();
    println!("{} {} {}", r.len(), total, r[r.len() - 1]);
}`,
    tests: [
      { name: 'Example', input: 'a = 3 1 4 1 5; 4 queries', expected: '14 6 4 1' },
      { name: 'One element', input: 'a = 7; query (0, 0)', expected: '7' },
      { name: 'No queries', input: 'a = (empty); no queries', expected: '' },
      { name: 'Negative values', input: 'a = -5 2 -3 8', expected: '-3 -1 7' },
      { name: 'Too big for i32', input: 'five values of 1000000000', expected: '5000000000 3000000000' },
      { name: 'Large', input: '200 000 values, 200 000 queries', expected: '200000 -2196220889554 -56755792' },
    ],
  },

  {
    id: 'r7-prefix-sums-2d',
    title: '2D prefix sums',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>The same trick works on a grid. Let <code>p[i][j]</code> be the sum of the rectangle from the top-left corner down to row <code>i - 1</code> and column <code>j - 1</code> (the first <code>i</code> rows and first <code>j</code> columns), so row 0 and column 0 of <code>p</code> are all zeros. Each entry combines three neighbours: <code>p[i+1][j+1] = g[i][j] + p[i][j+1] + p[i+1][j] - p[i][j]</code>. Picture it: the area above, plus the area to the left, counts the overlap (the rectangle up and to the left) twice, so subtract it once; then add the cell itself.</p>`,
        `<p>Trace for the grid 1 2 3 / 4 5 6 / 7 8 9. The table <code>p</code> has 4 rows and 4 columns: <code>[0,0,0,0]</code>, <code>[0,1,3,6]</code>, <code>[0,5,12,21]</code>, <code>[0,12,27,45]</code>. Check <code>p[2][2] = 5 + p[1][2] + p[2][1] - p[1][1] = 5 + 3 + 5 - 1 = 12</code>, which is 1 + 2 + 4 + 5. A query rectangle from (r1, c1) to (r2, c2), corners included, is the big prefix minus the strip above and the strip to the left, plus the corner you subtracted twice: <code>p[r2+1][c2+1] - p[r1][c2+1] - p[r2+1][c1] + p[r1][c1]</code>. For rows 1..2 and columns 1..2: 45 - 6 - 12 + 1 = 28, which is 5 + 6 + 8 + 9. Building costs O(rows &middot; cols), every query O(1).</p>`,
        `<p>The Rust shape: a 2D table is a vector of vectors, <code>let mut p: Vec&lt;Vec&lt;i64&gt;&gt; = vec![vec![0; cols + 1]; rows + 1];</code> (the same <code>vec![vec![..]; ..]</code> from the grid lesson in stage 6; the inner vector is cloned for every row). Index it as <code>p[i][j]</code>. The grid arrives as <code>&amp;[Vec&lt;i64&gt;]</code>, so <code>g.len()</code> is the number of rows and <code>g[0].len()</code> the number of columns, but <code>g[0]</code> panics if there are no rows: read the width with <code>if rows == 0 { 0 } else { g[0].len() }</code>. Use <code>i64</code> again: 10<sup>6</sup> cells of up to 1000 add up beyond comfortable <code>i32</code> range in the large test.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let g = vec![vec![1, 2, 3], vec![4, 5, 6]];
    let rows = g.len();
    let cols = g[0].len();
    let mut p = vec![vec![0; cols + 1]; rows + 1];     // a zero row on top, a zero column on the left
    for i in 0..rows {
        for j in 0..cols {
            p[i + 1][j + 1] = g[i][j] + p[i][j + 1] + p[i + 1][j] - p[i][j];
        }
    }
    for row in &p {
        println!("{:?}", row);
    }
}`,
          output: `[0, 0, 0, 0]
[0, 1, 3, 6]
[0, 5, 12, 21]`,
          caption: 'The bottom-right entry, 21, is the sum of the whole grid.',
        },
      ],
      terms: [
        { code: 'vec![vec![0; cols + 1]; rows + 1]', meaning: 'a (rows+1) x (cols+1) table of zeros' },
        {
          code: 'p[i + 1][j + 1] = g[i][j] + p[i][j + 1] + p[i + 1][j] - p[i][j]',
          meaning: 'cell + above + left - overlap',
        },
        {
          code: 'if rows == 0 { 0 } else { g[0].len() }',
          meaning: 'reads the width without panicking on an empty grid',
        },
        {
          code: 'p[r2+1][c2+1] - p[r1][c2+1] - p[r2+1][c1] + p[r1][c1]',
          meaning: 'whole prefix, minus two strips, plus the doubly removed corner',
        },
      ],
    },
    task: `Write <code>region_sums</code>: for each query <code>(r1, c1, r2, c2)</code> (inclusive corners) return the sum of that rectangle of <code>g</code>. Build a prefix grid once.`,
    refresher: [
      `<code>p[i][j]</code> = sum of the rectangle from the top-left corner to (<code>i - 1</code>, <code>j - 1</code>), in a <code>(R + 1) x (C + 1)</code> grid.`,
      `Fill: <code>p[i+1][j+1] = g[i][j] + p[i][j+1] + p[i+1][j] - p[i][j]</code>. Query: <code>p[r2+1][c2+1] - p[r1][c2+1] - p[r2+1][c1] + p[r1][c1]</code>.`,
    ],
    hints: [
      'Make the prefix table one row and one column bigger than the grid. Row 0 and column 0 stay zero.',
      `Each filled cell is the grid cell plus the prefix above plus the prefix to the left, minus the overlap counted twice.`,
      `A query is the large prefix at the far corner, minus the strip above, minus the strip to the left, plus the corner that was removed twice.`,
    ],
    inCpp: {
      code: `void build(const vector<vector<long long>>& g, int R, int C) {
    vector<vector<long long>> p(R + 1, vector<long long>(C + 1, 0));
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            p[i + 1][j + 1] = g[i][j] + p[i][j + 1] + p[i + 1][j] - p[i][j];
}`,
      note: `The shape is identical. <code>vec![vec![0; c]; r]</code> clones the inner row for you, and every <code>g[i][j]</code> is bounds-checked, so an off-by-one is a panic with a line number rather than a silent read of nearby memory.`,
    },
    starter: `// Queries are (r1, c1, r2, c2) with r1 <= r2 and c1 <= c2, all inside the grid.
fn region_sums(g: &[Vec<i64>], queries: &[(usize, usize, usize, usize)]) -> Vec<i64> {
    Vec::new()
}`,
    solution: `fn region_sums(g: &[Vec<i64>], queries: &[(usize, usize, usize, usize)]) -> Vec<i64> {
    let rows = g.len();
    let cols = if rows == 0 { 0 } else { g[0].len() };
    let mut p: Vec<Vec<i64>> = vec![vec![0; cols + 1]; rows + 1];
    for i in 0..rows {
        for j in 0..cols {
            p[i + 1][j + 1] = g[i][j] + p[i][j + 1] + p[i + 1][j] - p[i][j];
        }
    }
    queries
        .iter()
        .map(|&(r1, c1, r2, c2)| p[r2 + 1][c2 + 1] - p[r1][c2 + 1] - p[r2 + 1][c1] + p[r1][c1])
        .collect()
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn harness_show(v: &[i64]) -> String {
    let parts: Vec<String> = v.iter().map(|x| x.to_string()).collect();
    parts.join(" ")
}

fn main() {
    println!("\\n@@TEST 1@@");
    let g: Vec<Vec<i64>> = vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]];
    println!("{}", harness_show(&region_sums(&g, &[(0, 0, 2, 2), (1, 1, 2, 2), (0, 0, 1, 1), (1, 1, 1, 1)])));
    println!("\\n@@TEST 2@@");
    println!("{}", harness_show(&region_sums(&[vec![5]], &[(0, 0, 0, 0)])));
    println!("\\n@@TEST 3@@");
    println!("{}", harness_show(&region_sums(&[vec![1, 2, 3, 4]], &[(0, 0, 0, 1), (0, 1, 0, 3)])));
    println!("\\n@@TEST 4@@");
    let g = vec![vec![-1, 2], vec![3, -4]];
    println!("{}", harness_show(&region_sums(&g, &[(0, 0, 1, 1), (0, 0, 0, 0), (1, 1, 1, 1), (0, 1, 1, 1)])));
    println!("\\n@@TEST 5@@");
    let g = vec![vec![1_000_000_000i64; 3]; 3];
    println!("{}", harness_show(&region_sums(&g, &[(0, 0, 2, 2), (1, 1, 2, 2)])));
    println!("\\n@@TEST 6@@");
    let mut rng = HarnessRng(22);
    let n = 1000usize;
    let mut g = vec![vec![0i64; n]; n];
    for i in 0..n {
        for j in 0..n {
            g[i][j] = (rng.next() % 2001) as i64 - 1000;
        }
    }
    let mut queries = Vec::with_capacity(100_000);
    for _ in 0..100_000 {
        let r1 = rng.next() as usize % n;
        let r2 = rng.next() as usize % n;
        let c1 = rng.next() as usize % n;
        let c2 = rng.next() as usize % n;
        queries.push((r1.min(r2), c1.min(c2), r1.max(r2), c1.max(c2)));
    }
    let r = region_sums(&g, &queries);
    let total: i64 = r.iter().sum();
    println!("{} {} {}", r.len(), total, r[r.len() - 1]);
}`,
    tests: [
      { name: 'Example grid', input: '3x3 grid 1..9; 4 queries', expected: '45 28 12 5' },
      { name: 'One cell', input: '1x1 grid {5}', expected: '5' },
      { name: 'Single row', input: '1x4 grid 1 2 3 4', expected: '3 9' },
      { name: 'Negative values', input: '2x2 grid -1 2 / 3 -4', expected: '0 -1 -4 -2' },
      { name: 'Too big for i32', input: '3x3 grid of 1000000000', expected: '9000000000 4000000000' },
      { name: 'Large', input: '1000x1000 grid, 100 000 queries', expected: '100000 -8774560619 271882' },
    ],
  },

  {
    id: 'r7-two-pointers',
    title: 'Two pointers',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>Find two numbers in a <em>sorted</em> slice that add up to a target. Trying every pair is O(n<sup>2</sup>). Sortedness lets you do it in O(n) with <strong>two pointers</strong>, one at each end. Look at <code>a[lo] + a[hi]</code>. If it is too small, nothing paired with <code>a[lo]</code> can reach the target, because <code>a[hi]</code> is already the largest candidate left, so <code>a[lo]</code> is useless: move <code>lo</code> right. If it is too big, <code>a[hi]</code> is useless even with the smallest partner: move <code>hi</code> left. Each step throws away one element, so the loop runs at most n times.</p>`,
        `<p>Trace for <code>[1, 3, 4, 6, 9]</code>, target 8. 1 + 9 = 10 is too big, drop 9. 1 + 6 = 7 is too small, drop 1. 3 + 6 = 9 is too big, drop 6. 3 + 4 = 7 is too small, drop 3. Only 4 is left, and one element cannot pair with itself: no answer. (For target 9 the third step finds 3 + 6.)</p>`,
        `<p>The Rust shape. The answer is <code>Option&lt;(usize, usize)&gt;</code>: <code>Some((i, j))</code> when found, <code>None</code> when not. Returning an <code>Option</code> is Rust's replacement for the C++ habit of returning <code>{-1, -1}</code> or an empty vector. The two pointers are <code>usize</code>, and <code>hi - 1</code> with <code>hi = 0</code> would underflow and panic in a debug build. The robust way is a <em>half-open</em> <code>hi</code>: start with <code>hi = a.len()</code>, treat the last candidate as <code>a[hi - 1]</code>, and loop while <code>hi &gt; lo + 1</code> (at least two elements remain, so <code>hi</code> is at least 2 and the subtraction is safe). This also handles the empty and one-element slices without a special case. Return early with <code>return Some((lo, hi - 1));</code> and fall through to <code>None</code> at the end.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = [1, 3, 4, 6, 9];
    let target = 8;
    let mut lo = 0;
    let mut hi = a.len();               // half-open: the last candidate is a[hi - 1]
    while hi > lo + 1 {
        let s = a[lo] + a[hi - 1];
        println!("a[{}] + a[{}] = {}", lo, hi - 1, s);
        if s == target {
            println!("found");
            break;
        } else if s < target {
            lo += 1;
        } else {
            hi -= 1;
        }
    }
}`,
          output: `a[0] + a[4] = 10
a[0] + a[3] = 7
a[1] + a[3] = 9
a[1] + a[2] = 7`,
          caption: 'Each line discards one element; the loop ends when fewer than two remain.',
        },
      ],
      terms: [
        { code: 'Option<(usize, usize)>', meaning: 'Some((i, j)) for a found pair, None for no pair' },
        {
          code: 'hi = a.len()',
          meaning: 'half-open upper end: the last candidate sits at hi - 1',
        },
        {
          code: 'while hi > lo + 1',
          meaning: 'keep going while two or more candidates remain; hi - 1 is then safe',
        },
        { code: 'return Some((lo, hi - 1));', meaning: 'leaves the function early with the answer' },
      ],
    },
    task: `Write <code>pair_with_sum</code>: in a sorted slice, find indices <code>i &lt; j</code> with <code>a[i] + a[j] == target</code>. Return <code>None</code> if there is no such pair; any valid pair is accepted.`,
    refresher: [
      `Start with <code>lo = 0</code> and <code>hi = len - 1</code>. A sum too small moves <code>lo</code> up, too large moves <code>hi</code> down, so the scan is O(n).`,
      `<code>len - 1</code> on an empty slice panics in a debug build. Handle empty input first, or use a half-open <code>hi = len</code>.`,
    ],
    hints: [
      `Keep <code>lo</code> at 0 and a half-open <code>hi</code> at the length, so the last candidate is <code>a[hi - 1]</code> and an empty slice needs no special case.`,
      `Compare the sum with the target: a small sum moves the left pointer up, a big sum moves the right pointer down.`,
      `Loop while at least two candidates remain. Return <code>Some</code> inside the loop on a match, and <code>None</code> after it.`,
    ],
    inCpp: {
      code: `pair<int,int> pair_with_sum(const vector<int>& a, long long target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo < hi) {
        long long s = (long long)a[lo] + a[hi];
        if (s == target) return {lo, hi};
        if (s < target) lo++; else hi--;
    }
    return {-1, -1};   // sentinel
}`,
      note: `The sentinel <code>{-1, -1}</code> is a convention the caller can forget to check. <code>Option&lt;(usize, usize)&gt;</code> makes "no pair" a different type, so the compiler forces the caller to handle it.`,
    },
    starter: `// a is sorted ascending. Return Some((i, j)) with i < j and a[i] + a[j] == target, or None.
fn pair_with_sum(a: &[i64], target: i64) -> Option<(usize, usize)> {
    None
}`,
    solution: `fn pair_with_sum(a: &[i64], target: i64) -> Option<(usize, usize)> {
    let mut lo = 0;
    let mut hi = a.len();
    while hi > lo + 1 {
        let s = a[lo] + a[hi - 1];
        if s == target {
            return Some((lo, hi - 1));
        } else if s < target {
            lo += 1;
        } else {
            hi -= 1;
        }
    }
    None
}`,
    harness: `fn harness_judge(a: &[i64], target: i64) {
    match pair_with_sum(a, target) {
        None => println!("none"),
        Some((i, j)) => {
            if i < j && j < a.len() && a[i] + a[j] == target {
                println!("valid pair");
            } else {
                println!("invalid pair");
            }
        }
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    harness_judge(&[1, 3, 4, 6, 9], 10);
    println!("\\n@@TEST 2@@");
    harness_judge(&[], 5);
    println!("\\n@@TEST 3@@");
    harness_judge(&[3], 6);
    println!("\\n@@TEST 4@@");
    harness_judge(&[1, 1, 1, 1], 2);
    println!("\\n@@TEST 5@@");
    harness_judge(&[1, 3, 4], 6);
    println!("\\n@@TEST 6@@");
    harness_judge(&[-8, -3, 0, 2, 5], -3);
    println!("\\n@@TEST 7@@");
    let a: Vec<i64> = (0..300_000).map(|k| 2 * k).collect();
    harness_judge(&a, 400_001);
    println!("\\n@@TEST 8@@");
    let a: Vec<i64> = (0..300_000).map(|k| 3 * k).collect();
    harness_judge(&a, 3 * 599_997);
}`,
    tests: [
      { name: 'Example', input: 'a = 1 3 4 6 9, target 10', expected: 'valid pair' },
      { name: 'Empty input', input: 'a = (empty), target 5', expected: 'none' },
      { name: 'One element', input: 'a = 3, target 6', expected: 'none' },
      { name: 'Duplicates', input: 'a = 1 1 1 1, target 2', expected: 'valid pair' },
      { name: 'No reuse of one element', input: 'a = 1 3 4, target 6', expected: 'none' },
      { name: 'Negative values', input: 'a = -8 -3 0 2 5, target -3', expected: 'valid pair' },
      { name: 'Large, no pair', input: '300 000 even numbers, odd target', expected: 'none' },
      { name: 'Large, pair at the far end', input: '300 000 multiples of 3, one pair', expected: 'valid pair' },
    ],
  },

  {
    id: 'r7-sliding-window',
    title: 'Sliding window',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>A <strong>sliding window</strong> keeps a stretch of the input (here a substring) between two indices and moves both ends forward only, never back. That is what makes it O(n) instead of checking every substring. For "longest substring with no repeated byte": the window <code>[start, i]</code> always has no repeats. When the next byte <code>c</code> arrives, if it already occurs inside the window, slide <code>start</code> to just past that earlier occurrence; then the window is clean again, and its length is a candidate for the best.</p>`,
        `<p>To find "where did I last see this byte?" in O(1), keep a table <code>last</code> indexed by the byte value (a byte is 0..=255, so 256 entries), and store the position <em>plus one</em>, so 0 means "never seen" and doubles as a start of 0. Then the rule is one line: <code>start = start.max(last[c as usize])</code>. The <code>max</code> matters: an old occurrence that is <em>before</em> <code>start</code> is stale and must not drag the window backwards. Trace for <code>"abba"</code>: <code>a</code> at 0: window <code>a</code>, length 1. <code>b</code> at 1: <code>ab</code>, 2. <code>b</code> at 2: last <code>b</code> was at 1, so start becomes 2, window <code>b</code>, 1. <code>a</code> at 3: last <code>a</code> was at 0, stored 1, but start is already 2, so <code>max</code> keeps 2; window <code>ba</code>, 2. Best: 2. Without the <code>max</code> you would wrongly get 3.</p>`,
        `<p>The Rust shape. A <code>&amp;str</code> cannot be indexed, so take its bytes with <code>s.as_bytes()</code>, a <code>&amp;[u8]</code> slice (input is ASCII). <code>for (i, &amp;c) in b.iter().enumerate()</code> walks index and byte together; the <code>&amp;c</code> copies the byte out of the reference. Convert the byte to an index with <code>c as usize</code>. The table is <code>let mut last: [usize; 256] = [0; 256];</code>, a fixed-size array on the stack (<code>[value; length]</code>, as in the counting-sort lesson), and <code>start</code> and <code>best</code> are plain <code>usize</code> counters.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let b = "abba".as_bytes();
    let mut last: [usize; 256] = [0; 256];      // position + 1 of the last time each byte was seen
    let mut start = 0;
    for (i, &c) in b.iter().enumerate() {
        start = start.max(last[c as usize]);
        last[c as usize] = i + 1;
        println!("i={} start={} window length={}", i, start, i + 1 - start);
    }
}`,
          output: `i=0 start=0 window length=1
i=1 start=0 window length=2
i=2 start=2 window length=1
i=3 start=2 window length=2`,
          caption: 'At i=3 the table says "a was seen, position 1", but start is already 2, so max keeps it.',
        },
      ],
      terms: [
        { code: 's.as_bytes()', meaning: 'the string as a &[u8] slice you can index' },
        { code: 'for (i, &c) in b.iter().enumerate()', meaning: 'index and byte together; &c copies the byte out' },
        { code: 'c as usize', meaning: 'turns a byte into a table index' },
        { code: '[usize; 256] = [0; 256]', meaning: 'a fixed table, one slot per possible byte' },
        {
          code: 'start.max(x)',
          meaning: 'the larger of two numbers: never moves start backwards',
        },
      ],
    },
    task: `Write <code>longest_unique</code>: the length of the longest substring of <code>s</code> with no repeated byte. Input is ASCII.`,
    refresher: [
      `Keep a window <code>[start, i]</code>. When byte <code>i</code> was last seen inside the window, move <code>start</code> just past that earlier position.`,
      `<code>s[i]</code> does not exist for <code>&amp;str</code>. Use <code>let b = s.as_bytes();</code> (a <code>&amp;[u8]</code>) and index <code>b</code>; a byte works as an index with <code>c as usize</code>.`,
    ],
    hints: [
      `Work on <code>s.as_bytes()</code>. Keep a table with one slot per possible byte value that remembers where that byte was last seen, shifted by one so 0 means never.`,
      `On each byte, move <code>start</code> forward to the table entry, but never backwards: a stale entry must not shrink the window.`,
      `After updating the table, the window length is <code>i + 1 - start</code>. Keep the largest one seen.`,
    ],
    inCpp: {
      code: `int longest_unique(const string& s) {
    int last[256] = {};
    int start = 0, best = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        unsigned char c = s[i];
        start = max(start, last[c]);
        last[c] = i + 1;
        best = max(best, i + 1 - start);
    }
    return best;
}`,
      note: `C++ lets you write <code>s[i]</code> on a string, and <code>char</code> may be signed (a negative array index is a classic bug). Rust has no <code>s[i]</code> on <code>&amp;str</code> because text is UTF-8; you choose bytes explicitly with <code>as_bytes()</code>, and <code>u8</code> is always unsigned.`,
    },
    starter: `// Return the length of the longest substring without a repeated byte.
fn longest_unique(s: &str) -> usize {
    0
}`,
    solution: `fn longest_unique(s: &str) -> usize {
    let b = s.as_bytes();
    let mut last: [usize; 256] = [0; 256];
    let mut start = 0;
    let mut best = 0;
    for (i, &c) in b.iter().enumerate() {
        start = start.max(last[c as usize]);
        last[c as usize] = i + 1;
        best = best.max(i + 1 - start);
    }
    best
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn main() {
    let small = ["abcabcbb", "", "a", "bbbbb", "pwwkew", "abba", "tmmzuxt"];
    for (i, s) in small.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", longest_unique(s));
    }
    println!("\\n@@TEST 8@@");
    let s: String = (0..1_000_000).map(|i| (b'a' + (i % 26) as u8) as char).collect();
    println!("{}", longest_unique(&s));
    println!("\\n@@TEST 9@@");
    let mut rng = HarnessRng(33);
    let s: String = (0..500_000).map(|_| (b'a' + (rng.next() % 26) as u8) as char).collect();
    println!("{}", longest_unique(&s));
}`,
    tests: [
      { name: 'Example', input: '"abcabcbb"', expected: '3' },
      { name: 'Empty string', input: '""', expected: '0' },
      { name: 'One character', input: '"a"', expected: '1' },
      { name: 'All the same', input: '"bbbbb"', expected: '1' },
      { name: 'Repeat in the middle', input: '"pwwkew"', expected: '3' },
      { name: 'Stale index', input: '"abba"', expected: '2' },
      { name: 'Stale index, longer', input: '"tmmzuxt"', expected: '5' },
      { name: 'Long repeating alphabet', input: 'a..z repeated, 1 000 000 chars', expected: '26' },
      { name: 'Long random string', input: '500 000 random letters', expected: '22' },
    ],
  },

  {
    id: 'r7-binary-search-answer',
    title: 'Binary search on the answer',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>Stage 4 binary-searched a sorted array. The same idea works on <em>answers</em>. If you can write a yes/no question "does value <code>x</code> work?" whose answers look like <code>no no no yes yes yes</code> (once it works, anything bigger also works), the smallest working value is a boundary you can find in O(log range) questions. Here: packages ship in order over <code>days</code> days, and a ship of capacity <code>cap</code> works if you need at most <code>days</code> days. A bigger ship never needs more days, so the question is monotone.</p>`,
        `<p>Bounds: the capacity must be at least the heaviest package (or that one cannot ship at all), and the sum of all weights always works (one day). Search the half-open boundary: <code>while lo &lt; hi</code>, take <code>mid = lo + (hi - lo) / 2</code>; if <code>mid</code> works, the answer is <code>mid</code> or lower, so <code>hi = mid</code>; otherwise <code>lo = mid + 1</code>. The loop ends with <code>lo == hi</code>, the smallest working value. The feasibility check is a greedy pass: load packages in order, and when the next one would overflow <code>cap</code>, start a new day. Trace for weights 1..10 and 5 days: lo = 10, hi = 55. mid = 32 works (2 days) so hi = 32; mid = 21 works (3 days) so hi = 21; mid = 15 works (exactly 5 days) so hi = 15; mid = 12 needs 6 days so lo = 13; mid = 14 needs 6 so lo = 15. lo == hi: the answer is 15. Cost: O(n log(sum)).</p>`,
        `<p>The Rust shape. A <em>check</em> function nested inside the main one keeps the two ideas apart: <code>days_needed(weights, cap)</code> is the greedy count and the search loop only asks it questions. The heaviest weight is <code>*weights.iter().max().unwrap()</code>: <code>max()</code> gives an <code>Option</code> of a reference (it could be empty), <code>unwrap()</code> says "there is at least one", and <code>*</code> copies the number out. The total is <code>weights.iter().sum()</code> with a type annotation so Rust knows what to add up in. Use <code>u64</code> because the total of 100 000 weights of a million overflows <code>u32</code>. Write the midpoint as <code>lo + (hi - lo) / 2</code>, the habit that cannot overflow.</p>`,
      ],
      examples: [
        {
          code: `// Smallest x with x * x >= 50, found by asking "does x work?" about a monotone question.
fn main() {
    let mut lo = 0;
    let mut hi = 50;                        // 50 certainly works
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if mid * mid >= 50 {
            hi = mid;                       // mid works: the answer is mid or smaller
        } else {
            lo = mid + 1;                   // mid fails: the answer is bigger
        }
        println!("lo={} hi={}", lo, hi);
    }
    println!("answer {}", lo);
}`,
          output: `lo=0 hi=25
lo=0 hi=12
lo=7 hi=12
lo=7 hi=9
lo=7 hi=8
lo=8 hi=8
answer 8`,
        },
      ],
      terms: [
        {
          code: 'while lo < hi',
          meaning: 'narrows [lo, hi] until it is one value, the smallest that works',
        },
        { code: 'if works(mid) { hi = mid } else { lo = mid + 1 }', meaning: 'keep the half that still contains the boundary' },
        {
          code: '*weights.iter().max().unwrap()',
          meaning: 'the largest item: max gives Option<&u64>, unwrap and * extract the number',
        },
        { code: 'let hi: u64 = weights.iter().sum();', meaning: 'the annotation tells sum what type to add up in' },
      ],
    },
    task: `Write <code>ship_capacity</code>: packages must ship in the given order, and you have <code>days</code> days. Return the smallest ship capacity that fits everything in time.`,
    refresher: [
      `The answer lies in <code>[max weight, total weight]</code>. "Can it be done with capacity <code>cap</code>?" is monotone, so binary search the capacity.`,
      `The feasibility check is a greedy pass: load packages until the next would overflow, then start a new day. Count days.`,
    ],
    hints: [
      `Search over the capacity itself. It can be no smaller than the heaviest package and never needs to exceed the total weight.`,
      `A helper that counts days for a given capacity is a greedy pass: when the next package would overflow, start a new day with an empty load.`,
      `If the middle capacity needs few enough days, the answer is at or below it; otherwise it is above. Loop until the two ends meet.`,
    ],
    inCpp: {
      code: `long long days_needed(const vector<long long>& w, long long cap);
long long search(const vector<long long>& w, long long days) {
    long long lo = *max_element(w.begin(), w.end());
    long long hi = accumulate(w.begin(), w.end(), 0LL);   // 0, not 0LL: int overflow
    while (lo < hi) {
        long long mid = lo + (hi - lo) / 2;
        if (days_needed(w, mid) <= days) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
      note: `The classic C++ trap is <code>accumulate(..., 0)</code>, which sums in <code>int</code> and overflows without a sound. In Rust <code>iter().sum()</code> takes its type from the target, so <code>let hi: u64 = w.iter().sum();</code> cannot silently narrow.`,
    },
    starter: `// weights is non-empty and days >= 1. Return the smallest capacity that works.
fn ship_capacity(weights: &[u64], days: u64) -> u64 {
    0
}`,
    solution: `fn ship_capacity(weights: &[u64], days: u64) -> u64 {
    fn days_needed(weights: &[u64], cap: u64) -> u64 {
        let mut days = 1;
        let mut load = 0;
        for &w in weights {
            if load + w > cap {
                days += 1;
                load = 0;
            }
            load += w;
        }
        days
    }
    let mut lo = *weights.iter().max().unwrap();
    let mut hi: u64 = weights.iter().sum();
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if days_needed(weights, mid) <= days {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    lo
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", ship_capacity(&[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5));
    println!("\\n@@TEST 2@@");
    println!("{}", ship_capacity(&[3, 2, 2, 4, 1, 4], 3));
    println!("\\n@@TEST 3@@");
    println!("{}", ship_capacity(&[1, 2, 3, 1, 1], 4));
    println!("\\n@@TEST 4@@");
    println!("{}", ship_capacity(&[5], 1));
    println!("\\n@@TEST 5@@");
    println!("{}", ship_capacity(&[4, 4, 4], 3));
    println!("\\n@@TEST 6@@");
    println!("{}", ship_capacity(&[2, 9, 3], 1));
    let mut rng = HarnessRng(44);
    let w: Vec<u64> = (0..100_000).map(|_| 1 + rng.next() % 1_000_000).collect();
    println!("\\n@@TEST 7@@");
    println!("{}", ship_capacity(&w, 100));
    println!("\\n@@TEST 8@@");
    println!("{}", ship_capacity(&w, 1));
    println!("\\n@@TEST 9@@");
    println!("{}", ship_capacity(&w, 30_000));
}`,
    tests: [
      { name: 'Example', input: '1..10, 5 days', expected: '15' },
      { name: 'Mixed weights', input: '3 2 2 4 1 4, 3 days', expected: '6' },
      { name: 'Small weights, 4 days', input: '1 2 3 1 1, 4 days', expected: '3' },
      { name: 'One package', input: '5, 1 day', expected: '5' },
      { name: 'One package per day', input: '4 4 4, 3 days', expected: '4' },
      { name: 'Everything in one day', input: '2 9 3, 1 day', expected: '14' },
      { name: 'Large, 100 days', input: '100 000 weights up to 1e6', expected: '500819309' },
      { name: 'Large, 1 day (sum over u32)', input: '100 000 weights up to 1e6', expected: '50051105488' },
      { name: 'Large, 30 000 days', input: '100 000 weights up to 1e6', expected: '1991756' },
    ],
  },

  {
    id: 'r7-bfs-grid',
    title: 'BFS on a grid',
    kind: 'implement',
    introduces: ['vecdeque'],
    teach: {
      body: [
        `<p>Fewest steps from one cell to another where every step costs the same: that is <strong>breadth-first search</strong>. It explores in <em>layers</em>: first the start, then every cell one step away, then every cell two steps away, and so on. A queue produces exactly that order, because cells enter at the back and leave from the front: everything at distance d is in the queue before anything at distance d + 1. The first time the search reaches the goal, no shorter path exists. (Depth-first search with a stack dives down one path and gives no such guarantee.)</p>`,
        `<p>Trace on an open 3 x 3 grid from the top-left corner. Layer 0: (0,0). Layer 1: (1,0) and (0,1). Layer 2: (2,0), (1,1), (0,2). Layer 3: (2,1), (1,2). Layer 4: (2,2): the goal, so the answer is 4. Mark a cell <code>seen</code> when you <em>put it in the queue</em>, not when you take it out, or the same cell can be queued many times. Each cell is queued at most once and each does four neighbour checks, so the cost is O(rows &middot; cols).</p>`,
        `<p>The Rust shape. The queue is the <code>VecDeque</code> from stage 6 (<code>push_back</code>, and <code>while let Some(x) = queue.pop_front()</code> as the loop). Store the distance <em>in the queue entry</em>: <code>(r, c, d)</code> tuples, so no separate distance table is needed. <code>seen</code> is a <code>vec![vec![false; cols]; rows]</code>. The four moves are an array of <code>(dr, dc)</code> pairs you loop over. Here is the trap: <code>r</code> and <code>c</code> are <code>usize</code>, and <code>r - 1</code> at row 0 panics in a debug build. So convert to <code>i32</code> first, add the step, test the bounds as signed numbers, and only then convert back with <code>as usize</code>. Return <code>Option&lt;usize&gt;</code>: <code>Some(d)</code> when the goal is dequeued, <code>None</code> when the queue empties first. Check the start and goal for walls, and for an empty grid, before the loop.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    // Which neighbours of the top-right cell of a 3 x 3 grid are inside the board?
    let rows = 3;
    let cols = 3;
    let r = 0;
    let c = 2;
    for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
        let nr = r as i32 + dr;             // signed, so -1 is allowed to exist for a moment
        let nc = c as i32 + dc;
        if nr < 0 || nc < 0 || nr >= rows as i32 || nc >= cols as i32 {
            continue;                       // off the board
        }
        println!("neighbour ({}, {})", nr, nc);
    }
}`,
          output: `neighbour (1, 2)
neighbour (0, 1)`,
          caption: 'Only two of the four moves stay on the board.',
        },
        {
          code: `use std::collections::VecDeque;

fn main() {
    let rows = 2;
    let cols = 3;
    let mut seen = vec![vec![false; cols]; rows];
    let mut queue = VecDeque::new();
    seen[0][0] = true;                       // marked when queued
    queue.push_back((0, 0, 0));              // (row, col, distance)
    while let Some((r, c, d)) = queue.pop_front() {
        println!("({}, {}) at distance {}", r, c, d);
        for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
            let nr = r as i32 + dr;
            let nc = c as i32 + dc;
            if nr < 0 || nc < 0 || nr >= rows as i32 || nc >= cols as i32 {
                continue;
            }
            let (nr, nc) = (nr as usize, nc as usize);
            if seen[nr][nc] {
                continue;
            }
            seen[nr][nc] = true;
            queue.push_back((nr, nc, d + 1));
        }
    }
}`,
          output: `(0, 0) at distance 0
(1, 0) at distance 1
(0, 1) at distance 1
(1, 1) at distance 2
(0, 2) at distance 2
(1, 2) at distance 3`,
          caption: 'Cells come out in distance order: 0, then both 1s, then both 2s, then 3.',
        },
      ],
      terms: [
        { code: 'queue.push_back((r, c, d))', meaning: 'queue entries carry their own distance' },
        {
          code: 'while let Some((r, c, d)) = queue.pop_front()',
          meaning: 'loops until the queue is empty, taking from the front',
        },
        {
          code: 'for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)]',
          meaning: 'the four moves as data to loop over',
        },
        {
          code: 'r as i32 + dr',
          meaning: 'goes signed so a step off the edge is -1 instead of an underflow panic',
        },
        { code: 'seen[nr][nc] = true;', meaning: 'marked when queued, so no cell is queued twice' },
      ],
    },
    task: `Write <code>shortest_path</code>: the grid holds <code>0</code> (open) and <code>1</code> (wall). Return the fewest steps from top-left to bottom-right moving up, down, left, right, or <code>None</code> if there is no path.`,
    refresher: [
      `BFS with a <code>VecDeque</code> of cells and a <code>dist</code> grid (or a visited grid) finds shortest paths on an unweighted graph.`,
      `Row and column are <code>usize</code>, so <code>r - 1</code> panics at 0. Use <code>checked_sub(1)</code>, or convert to <code>i32</code>/<code>isize</code> for the neighbour offsets.`,
    ],
    hints: [
      `Use a queue of <code>(row, col, distance)</code> and a <code>seen</code> table. Return <code>None</code> early for an empty grid or a wall at the start or the goal.`,
      'Mark a cell as seen when you push it, and return <code>Some(d)</code> the moment you pop the goal.',
      `For the four moves, compute the new row and column as signed numbers, skip anything off the board or a wall, then convert back to <code>usize</code>.`,
    ],
    inCpp: {
      code: `int step(int r, int c, int R, int C) {
    int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
    for (int k = 0; k < 4; k++) {
        int nr = r + dr[k], nc = c + dc[k];
        if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
    }
    return -1;   // no path
}`,
      note: `With <code>usize</code> coordinates <code>r - 1</code> panics at 0 (C++ unsigned would wrap), so use <code>checked_sub(1)</code> or signed offsets. No path is <code>None</code>, not <code>-1</code>.`,
    },
    starter: `// grid[r][c] is 0 (open) or 1 (wall). Return the number of steps, or None.
fn shortest_path(grid: &[Vec<u8>]) -> Option<usize> {
    None
}`,
    solution: `use std::collections::VecDeque;

fn shortest_path(grid: &[Vec<u8>]) -> Option<usize> {
    let rows = grid.len();
    if rows == 0 || grid[0].is_empty() {
        return None;
    }
    let cols = grid[0].len();
    if grid[0][0] == 1 || grid[rows - 1][cols - 1] == 1 {
        return None;
    }
    let mut seen = vec![vec![false; cols]; rows];
    let mut queue = VecDeque::new();
    seen[0][0] = true;
    queue.push_back((0, 0, 0));
    while let Some((r, c, d)) = queue.pop_front() {
        if r == rows - 1 && c == cols - 1 {
            return Some(d);
        }
        for (dr, dc) in [(1, 0), (-1, 0), (0, 1), (0, -1)] {
            let nr = r as i32 + dr;
            let nc = c as i32 + dc;
            if nr < 0 || nc < 0 || nr >= rows as i32 || nc >= cols as i32 {
                continue;
            }
            let (nr, nc) = (nr as usize, nc as usize);
            if grid[nr][nc] == 1 || seen[nr][nc] {
                continue;
            }
            seen[nr][nc] = true;
            queue.push_back((nr, nc, d + 1));
        }
    }
    None
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn harness_grid(rows: &[&str]) -> Vec<Vec<u8>> {
    rows.iter().map(|r| r.bytes().map(|b| if b == b'#' { 1 } else { 0 }).collect()).collect()
}

fn harness_show(r: Option<usize>) -> String {
    match r {
        Some(d) => d.to_string(),
        None => "None".to_string(),
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", harness_show(shortest_path(&harness_grid(&["...", "...", "..."]))));
    println!("\\n@@TEST 2@@");
    println!("{}", harness_show(shortest_path(&harness_grid(&["."]))));
    println!("\\n@@TEST 3@@");
    println!("{}", harness_show(shortest_path(&harness_grid(&["#"]))));
    println!("\\n@@TEST 4@@");
    println!("{}", harness_show(shortest_path(&harness_grid(&[".#.", ".#.", ".#."]))));
    println!("\\n@@TEST 5@@");
    println!("{}", harness_show(shortest_path(&harness_grid(&[".....", "####.", ".....", ".####", "....."]))));
    println!("\\n@@TEST 6@@");
    println!("{}", harness_show(shortest_path(&harness_grid(&["..", ".#"]))));
    println!("\\n@@TEST 7@@");
    println!("{}", harness_show(shortest_path(&harness_grid(&[".#...", ".#.#.", "...#."]))));
    println!("\\n@@TEST 8@@");
    let n = 601;
    let mut g = vec![vec![0u8; n]; n];
    for i in (1..n).step_by(2) {
        for j in 0..n {
            g[i][j] = 1;
        }
        let gap = if (i / 2) % 2 == 0 { n - 1 } else { 0 };
        g[i][gap] = 0;
    }
    println!("{}", harness_show(shortest_path(&g)));
    println!("\\n@@TEST 9@@");
    let n = 1000;
    let mut rng = HarnessRng(55);
    let mut g = vec![vec![0u8; n]; n];
    for i in 0..n {
        for j in 0..n {
            g[i][j] = if rng.next() % 100 < 20 { 1 } else { 0 };
        }
    }
    g[0][0] = 0;
    g[n - 1][n - 1] = 0;
    println!("{}", harness_show(shortest_path(&g)));
}`,
    tests: [
      { name: 'Open 3x3', input: '3x3, no walls', expected: '4' },
      { name: 'Single open cell', input: '1x1 open', expected: '0' },
      { name: 'Single wall cell', input: '1x1 wall', expected: 'None' },
      { name: 'Wall column blocks the way', input: '3x3, middle column walled', expected: 'None' },
      { name: 'Snake corridor', input: '5x5 with a long detour', expected: '16' },
      { name: 'Blocked goal', input: '2x2, bottom-right is a wall', expected: 'None' },
      { name: 'Detour around walls', input: '3x5 with a wall column', expected: '10' },
      { name: 'Large serpentine', input: '601x601 snake corridor', expected: '181200' },
      { name: 'Large random walls', input: '1000x1000, about 20% walls', expected: '1998' },
    ],
  },

  {
    id: 'r7-count-components',
    title: 'Count components',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>A <strong>connected component</strong> is a group of nodes that can all reach each other through edges. To count them, walk through the nodes in order; each time you meet a node you have not seen yet, you have found a new component, so add one and <em>flood</em> from that node, marking everything it can reach. Later nodes of that component are already marked and are skipped. Isolated nodes count too (they are components of size 1). Cost: every node and edge is touched a constant number of times, O(n + e).</p>`,
        `<p>Trace for 5 nodes and edges 0-1, 1-2, 3-4. Start at 0, unseen: count 1; flood marks 0, 1, 2. Nodes 1 and 2 are seen, skip. Node 3 unseen: count 2; flood marks 3 and 4. Node 4 is seen. The answer is 2. The flood is a depth-first search with a stack: push the start, then repeatedly pop a node and push each unseen neighbour (marking it as you push).</p>`,
        `<p>The Rust shape. The graph arrives as an edge list, so first build adjacency lists as in the stage 5 graph lessons: <code>let mut adj = vec![Vec::new(); n];</code> and, because the edges are undirected, push in both directions. Walk the edges with <code>for &amp;(a, b) in edges</code> (the <code>&amp;</code> pattern copies the tuple out). Use an <em>explicit stack</em>, a plain <code>Vec</code> with <code>push</code> and <code>pop</code>, rather than a recursive function. Recursion would also work for small graphs, but each call uses stack memory, and a chain of 100 000 nodes makes the recursion overflow the program's stack and crash. A <code>Vec</code> lives on the heap and has no such limit, which is why the loop is <code>while let Some(u) = stack.pop()</code>. Edges may repeat or be self-loops; marking as seen makes both harmless. Union-find from stage 5 is another way to count components.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let edges = [(0, 1), (1, 2), (3, 4)];
    let mut adj = vec![Vec::new(); 5];
    for &(a, b) in &edges {
        adj[a].push(b);                      // undirected: record both directions
        adj[b].push(a);
    }
    println!("{:?}", adj);

    let mut seen = vec![false; 5];
    let mut stack = vec![0];                 // flood from node 0 with an explicit stack
    seen[0] = true;
    while let Some(u) = stack.pop() {
        println!("visit {}", u);
        for &v in &adj[u] {
            if !seen[v] {
                seen[v] = true;              // marked when pushed
                stack.push(v);
            }
        }
    }
}`,
          output: `[[1], [0, 2], [1], [4], [3]]
visit 0
visit 1
visit 2`,
          caption: 'The flood from 0 never reaches 3 or 4: they belong to another component.',
        },
      ],
      terms: [
        { code: 'vec![Vec::new(); n]', meaning: 'n empty neighbour lists' },
        {
          code: 'for &(a, b) in edges',
          meaning: 'copies each (usize, usize) pair out of its reference',
        },
        { code: 'stack.pop()', meaning: 'Some(node) while the stack has items, then None' },
        {
          code: 'count += 1',
          meaning: 'one per unseen start node: each is a new component',
        },
      ],
    },
    task: `Write <code>count_components</code>: given <code>n</code> nodes (0..n) and undirected edges, return how many connected components there are. Isolated nodes count.`,
    refresher: [
      `Build adjacency lists <code>Vec&lt;Vec&lt;usize&gt;&gt;</code>, then start a search from every unvisited node and count the starts. Union-find works equally well.`,
      `Use an explicit stack: <code>while let Some(u) = stack.pop()</code>. Edges may repeat or be self-loops, and components can be thousands of nodes long.`,
    ],
    hints: [
      `Build neighbour lists first. The edges are undirected, so each edge adds one entry to both of its endpoints.`,
      `Loop over every node as a possible start. If it is already seen, skip it; otherwise count it and flood from it.`,
      `Flood with a <code>Vec</code> used as a stack and mark a node the moment you push it, so it is never pushed twice.`,
    ],
    inCpp: {
      code: `void f(int n, const vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }
    vector<int> st;
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
    }
}`,
      note: `C++ needs <code>back()</code> then <code>pop_back()</code>, and <code>back()</code> on an empty vector is undefined. Rust's <code>pop()</code> returns an <code>Option</code>, so <code>while let Some(u) = stack.pop()</code> is the loop and the empty case cannot be misused.`,
    },
    starter: `// Nodes are 0..n. Edges are undirected (a, b) pairs and may repeat.
fn count_components(n: usize, edges: &[(usize, usize)]) -> usize {
    0
}`,
    solution: `fn count_components(n: usize, edges: &[(usize, usize)]) -> usize {
    let mut adj = vec![Vec::new(); n];
    for &(a, b) in edges {
        adj[a].push(b);
        adj[b].push(a);
    }
    let mut seen = vec![false; n];
    let mut count = 0;
    for start in 0..n {
        if seen[start] {
            continue;
        }
        count += 1;
        seen[start] = true;
        let mut stack = vec![start];
        while let Some(u) = stack.pop() {
            for &v in &adj[u] {
                if !seen[v] {
                    seen[v] = true;
                    stack.push(v);
                }
            }
        }
    }
    count
}`,
    harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", count_components(5, &[(0, 1), (1, 2), (3, 4)]));
    println!("\\n@@TEST 2@@");
    println!("{}", count_components(0, &[]));
    println!("\\n@@TEST 3@@");
    println!("{}", count_components(1, &[]));
    println!("\\n@@TEST 4@@");
    println!("{}", count_components(5, &[]));
    println!("\\n@@TEST 5@@");
    println!("{}", count_components(4, &[(0, 0), (1, 2), (2, 1)]));
    println!("\\n@@TEST 6@@");
    println!("{}", count_components(5, &[(0, 1), (1, 2), (2, 3), (3, 4), (4, 0)]));
    println!("\\n@@TEST 7@@");
    let mut edges = Vec::new();
    for chain in 0..100 {
        for k in 0..999 {
            edges.push((chain * 1000 + k, chain * 1000 + k + 1));
        }
    }
    println!("{}", count_components(100_017, &edges));
}`,
    tests: [
      { name: 'Example', input: 'n = 5, edges 0-1 1-2 3-4', expected: '2' },
      { name: 'No nodes', input: 'n = 0', expected: '0' },
      { name: 'One node', input: 'n = 1', expected: '1' },
      { name: 'No edges', input: 'n = 5, no edges', expected: '5' },
      { name: 'Self-loop and repeat', input: 'n = 4, edges 0-0 1-2 2-1', expected: '3' },
      { name: 'One ring', input: 'n = 5, cycle 0-1-2-3-4-0', expected: '1' },
      { name: 'Large', input: '100 chains of 1000 nodes plus 17 isolated', expected: '117' },
    ],
  },

  {
    id: 'r7-cycle-detection',
    title: 'Cycle detection (directed)',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>In a <em>directed</em> graph, a cycle means you can follow edges and return to where you started. Depth-first search finds one with three colours per node: <strong>0 white</strong> (not visited), <strong>1 grey</strong> (on the current path, still being explored), <strong>2 black</strong> (finished, everything reachable from it explored). Following an edge to a <em>grey</em> node means the edge points back into the current path: a cycle. Following an edge to a black node is fine; it only means two paths meet (a diamond). That is why a plain "seen" flag is not enough for directed graphs: it cannot tell "I am still inside this node" from "I finished it long ago".</p>`,
        `<p>Trace for 0&rarr;1, 1&rarr;2, 2&rarr;0. Enter 0 (grey), go to 1 (grey), go to 2 (grey), look at the edge 2&rarr;0: node 0 is grey, so there is a cycle. Compare the diamond 0&rarr;1, 0&rarr;2, 1&rarr;3, 2&rarr;3: node 3 is finished (black) by the time the path through 2 reaches it, so no cycle is reported. The cost is O(n + e). A self-loop is a cycle: the edge from a node to itself finds a grey node.</p>`,
        `<p>The Rust shape: a recursive <code>dfs(u, adj, state) -&gt; bool</code> nested in the function, with <code>state: &amp;mut [u8]</code> holding the colours, created as <code>let mut state: Vec&lt;u8&gt; = vec![0; n];</code>. The function returns <code>true</code> as soon as any branch finds a cycle: <code>if state[v] == 0 &amp;&amp; dfs(v, adj, state)</code> uses short-circuit <code>&amp;&amp;</code> so it only recurses into white nodes. Because the graph may have several parts, start a search from every white node: <code>(0..n).any(|u| state[u] == 0 &amp;&amp; dfs(u, &amp;adj, &amp;mut state))</code> stops at the first <code>true</code>. Honest limit: recursion depth equals the length of the path, so a graph that is one huge chain (100 000 nodes) can crash a recursive version; the next lesson shows a loop-based method (Kahn's algorithm) that detects cycles with no recursion at all.</p>`,
      ],
      examples: [
        {
          code: `fn dfs(u: usize, adj: &[Vec<usize>], state: &mut [u8]) {
    state[u] = 1;                            // grey: on the current path
    println!("enter {}", u);
    for &v in &adj[u] {
        println!("  edge {} -> {} (colour {})", u, v, state[v]);
        if state[v] == 0 {
            dfs(v, adj, state);
        }
    }
    state[u] = 2;                            // black: finished
    println!("exit {}", u);
}

fn main() {
    let adj = vec![vec![1, 2], vec![3], vec![3], vec![]];   // the diamond
    let mut state: Vec<u8> = vec![0; 4];
    dfs(0, &adj, &mut state);
}`,
          output: `enter 0
  edge 0 -> 1 (colour 0)
enter 1
  edge 1 -> 3 (colour 0)
enter 3
exit 3
exit 1
  edge 0 -> 2 (colour 0)
enter 2
  edge 2 -> 3 (colour 2)
exit 2
exit 0`,
          caption: 'Edge 2 -> 3 meets colour 2 (black): two paths merge, which is not a cycle. A colour 1 would be.',
        },
      ],
      terms: [
        {
          code: 'state: &mut [u8]',
          meaning: 'colour per node: 0 not visited, 1 on the current path, 2 finished',
        },
        { code: 'if state[v] == 1 { return true; }', meaning: 'an edge back into the current path is a cycle' },
        { code: 'state[v] == 0 && dfs(v, adj, state)', meaning: 'only recurse into unvisited nodes; && stops early' },
        {
          code: '(0..n).any(|u| ...)',
          meaning: 'tries every start node and stops at the first true',
        },
      ],
    },
    task: `Write <code>has_cycle</code>: given <code>n</code> nodes and directed edges <code>(from, to)</code>, return <code>true</code> if the graph contains a cycle. A self-loop is a cycle.`,
    refresher: [
      `DFS with three states per node: 0 = unvisited, 1 = on the current path, 2 = finished. Reaching a node in state 1 means a cycle.`,
      `Pass the graph as <code>&amp;[Vec&lt;usize&gt;]</code> and the states as <code>&amp;mut [u8]</code>: the recursion borrows, it never copies. Test graphs recurse at most 1 500 deep.`,
    ],
    hints: [
      `Give every node a colour: unvisited, on the current path, or finished. Mark a node on the path when you enter it and finished when you leave.`,
      `An edge to a node that is on the current path means a cycle. An edge to a finished node means nothing. Only unvisited nodes need a recursive call.`,
      `A graph can have several separate parts, so try every unvisited node as a start, and return true as soon as one search does.`,
    ],
    inCpp: {
      code: `bool dfs(int u, const vector<vector<int>>& adj, vector<int>& state) {
    state[u] = 1;
    for (int v : adj[u]) {
        if (state[v] == 1) return true;
        if (state[v] == 0 && dfs(v, adj, state)) return true;
    }
    state[u] = 2;
    return false;
}`,
      note: `C++ makes you remember <code>const &amp;</code> to avoid copying the graph on every call; forget it and each recursive call copies every list. In Rust <code>adj: &amp;[Vec&lt;usize&gt;]</code> is a borrow by default, and passing a <code>Vec</code> by value would visibly move it.`,
    },
    starter: `// Nodes are 0..n; edges are directed (from, to) pairs.
fn has_cycle(n: usize, edges: &[(usize, usize)]) -> bool {
    false
}`,
    solution: `fn has_cycle(n: usize, edges: &[(usize, usize)]) -> bool {
    fn dfs(u: usize, adj: &[Vec<usize>], state: &mut [u8]) -> bool {
        state[u] = 1;
        for &v in &adj[u] {
            if state[v] == 1 {
                return true;
            }
            if state[v] == 0 && dfs(v, adj, state) {
                return true;
            }
        }
        state[u] = 2;
        false
    }
    let mut adj = vec![Vec::new(); n];
    for &(a, b) in edges {
        adj[a].push(b);
    }
    let mut state: Vec<u8> = vec![0; n];
    (0..n).any(|u| state[u] == 0 && dfs(u, &adj, &mut state))
}`,
    harness: `fn harness_show(b: bool) -> &'static str {
    if b { "cycle" } else { "no cycle" }
}

fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", harness_show(has_cycle(3, &[(0, 1), (1, 2), (2, 0)])));
    println!("\\n@@TEST 2@@");
    println!("{}", harness_show(has_cycle(0, &[])));
    println!("\\n@@TEST 3@@");
    println!("{}", harness_show(has_cycle(1, &[])));
    println!("\\n@@TEST 4@@");
    println!("{}", harness_show(has_cycle(1, &[(0, 0)])));
    println!("\\n@@TEST 5@@");
    println!("{}", harness_show(has_cycle(2, &[(0, 1), (1, 0)])));
    println!("\\n@@TEST 6@@");
    println!("{}", harness_show(has_cycle(4, &[(0, 1), (0, 2), (1, 3), (2, 3)])));
    println!("\\n@@TEST 7@@");
    println!("{}", harness_show(has_cycle(6, &[(0, 1), (3, 4), (4, 5), (5, 3)])));
    let mut edges = Vec::new();
    for i in 0..1499 {
        edges.push((i, i + 1));
        if i + 2 < 1500 {
            edges.push((i, i + 2));
        }
    }
    println!("\\n@@TEST 8@@");
    println!("{}", harness_show(has_cycle(1500, &edges)));
    edges.push((1499, 0));
    println!("\\n@@TEST 9@@");
    println!("{}", harness_show(has_cycle(1500, &edges)));
}`,
    tests: [
      { name: 'Triangle', input: '0->1->2->0', expected: 'cycle' },
      { name: 'No nodes', input: 'n = 0', expected: 'no cycle' },
      { name: 'One node', input: 'n = 1, no edges', expected: 'no cycle' },
      { name: 'Self-loop', input: 'n = 1, edge 0->0', expected: 'cycle' },
      { name: 'Two-node cycle', input: '0->1, 1->0', expected: 'cycle' },
      { name: 'Diamond (no cycle)', input: '0->1, 0->2, 1->3, 2->3', expected: 'no cycle' },
      { name: 'Cycle in a second component', input: 'n = 6, 0->1 and 3->4->5->3', expected: 'cycle' },
      { name: 'Large DAG', input: '1500 nodes, edges i->i+1 and i->i+2', expected: 'no cycle' },
      { name: 'Large with a back edge', input: 'same DAG plus 1499->0', expected: 'cycle' },
    ],
  },
]
