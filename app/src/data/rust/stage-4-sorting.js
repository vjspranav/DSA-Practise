// Rust lessons: stage 4, sort and search by hand, taught from zero (in-place sorting on slices, recursion on
// sub-slices, sort_by/sort_by_key, binary search). Starts from what stages 1-3 taught.
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end) and docs/superpowers/specs/rust-lesson-examples.js.
// Check with: RUST_MIGRATED=3 node scripts/verify-rust.mjs --stage 4
// Ids must start with r4- and be unique across the track. Every piece of syntax a lesson uses must be introduced
// (`introduces`, ids from src/rust/syntax.js) by that lesson or an earlier one; the checker enforces it.

// Shared harness for the hand-written sorts. `fn` is the learner's function, `n` the size of the large case,
// `modulus` the range of the generated values (counting sort needs a small range).
const sortHarness = (fn, n, modulus) => `fn harness_show(v: &[i32]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
}

fn harness_next(state: &mut u64) -> i32 {
    *state = state.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
    ((*state >> 33) % ${modulus}) as i32
}

fn harness_sums(v: &[i32]) -> (i64, i64) {
    (v.iter().map(|&x| x as i64).sum(), v.iter().map(|&x| (x as i64) * (x as i64)).sum())
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
        ${fn}(v);
        println!("{}", harness_show(v));
    }

    println!("\\n@@TEST 7@@");
    let mut state = 12345u64;
    let mut v: Vec<i32> = (0..${n}).map(|_| harness_next(&mut state)).collect();
    let before = harness_sums(&v);
    ${fn}(&mut v);
    let sorted = v.windows(2).all(|w| w[0] <= w[1]);
    if !sorted {
        println!("not sorted");
    } else if v.len() != ${n} || harness_sums(&v) != before {
        println!("sorted, but elements were lost or changed");
    } else {
        println!("sorted");
    }
}`

const sortTests = bigLabel => [
  { name: 'Example', input: '5 2 9 1', expected: '1 2 5 9' },
  { name: 'Empty list', input: '(empty)', expected: '' },
  { name: 'One item', input: '7', expected: '7' },
  { name: 'Duplicates', input: '3 3 1 3 1', expected: '1 1 3 3 3' },
  { name: 'Already sorted', input: '1 2 3 4 5', expected: '1 2 3 4 5' },
  { name: 'Reversed', input: '9 8 7 6 5', expected: '5 6 7 8 9' },
  { name: 'Large generated input', input: bigLabel, expected: 'sorted' },
]

const noStdSort = [{ pattern: '\\.sort(_unstable)?(_by(_key)?)?\\s*\\(', message: 'Write the sort yourself: the standard library sort is off the table here.' }]
const noStdSearch = [{ pattern: '\\.(binary_search(_by(_key)?)?|partition_point)\\s*\\(', message: 'Write the search yourself: the standard library search is off the table here.' }]

// ------------------------------------------------------------------------------------------
// 1. Sorting in place: &mut [i32] and swap
// ------------------------------------------------------------------------------------------
const inPlace = {
  id: 'r4-in-place',
  title: 'Sorting in place: &mut [i32] and swap',
  kind: 'concept',
  introduces: [],
  teach: {
    body: [
      `<p>This stage builds sorting and searching by hand, the way you would in a C++ interview. Every sorting function in it has the same shape: <code>fn name(v: &amp;mut [i32])</code>. From stage 2 you know that <code>&amp;mut [i32]</code> is a mutable borrow of a run of integers: the function may change the items but not the length, and it works on a <code>Vec</code> or an array. The function returns nothing. It rearranges the caller's data <em>in place</em>, so after the call the caller's own vector is sorted. To call it you lend the vector out: <code>bubble_sort(&amp;mut v)</code>, with <code>v</code> declared <code>let mut</code>.</p>`,
      `<p>The one move every simple sort is built from is the swap. <code>v.swap(i, j)</code> exchanges the items at positions <code>i</code> and <code>j</code> (you met it in stage 2). It replaces the three-line <code>tmp</code> dance from stage 1, and it is the form to prefer: it works for any item type, and it does not need two <code>&amp;mut</code> into the same slice at once, which Rust would refuse.</p>`,
      `<p>Positions are <code>usize</code>, an unsigned number that cannot go below 0. So <code>v.len() - 1</code> on an empty slice is "0 minus 1", and in a debug build that panics with "attempt to subtract with overflow" (stage 3 showed this). Sorting code is full of "the item before this one" and "up to the last item", so you will write it with this in mind: either check the length first, or choose a loop range that cannot need the subtraction. A range such as <code>1..n</code> is simply empty when <code>n</code> is 0, which is exactly what you want.</p>`,
      `<p>To understand any sort, trace it: write the array down after every step and watch what changes. Every lesson here gives a small trace, and you should do the same on paper when your code misbehaves.</p>`,
    ],
    examples: [
      {
        code: `fn swap_ends(v: &mut [i32]) {
    if v.len() < 2 {
        return;                 // nothing to swap; also keeps v.len() - 1 safe
    }
    let last = v.len() - 1;     // index of the last item
    v.swap(0, last);            // exchange first and last, in place
}

fn main() {
    let mut a = vec![1, 2, 3, 4];
    swap_ends(&mut a);          // lend a out mutably
    println!("{:?}", a);
    let mut b: Vec<i32> = vec![];
    swap_ends(&mut b);          // an empty slice is fine: we returned early
    println!("{:?}", b);
}`,
        output: '[4, 2, 3, 1]\n[]',
        caption: 'The caller\'s vector <code>a</code> changed even though the function returned nothing.',
      },
      {
        code: `fn main() {
    let mut v = vec![5, 2, 9];
    v.swap(0, 1);               // [2, 5, 9]
    println!("{:?}", v);
    let n = v.len();
    for i in 1..n {             // 1..3 gives i = 1 and 2
        println!("compare {} with {}", v[i - 1], v[i]);   // i - 1 is safe: i starts at 1
    }
    for i in 1..0 {             // an empty range: the body never runs
        println!("never {}", i);
    }
}`,
        output: '[2, 5, 9]\ncompare 2 with 5\ncompare 5 with 9',
      },
    ],
    terms: [
      { code: 'v: &mut [i32]', meaning: 'a mutable borrow of a run of integers; the function may change the items, not the length' },
      { code: 'f(&mut v)', meaning: 'lends the vector v out mutably; v must be declared let mut' },
      { code: 'v.swap(i, j)', meaning: 'exchanges the items at positions i and j in place' },
      { code: 'v.len() - 1', meaning: 'panics in a debug build when the slice is empty (usize cannot go below 0)' },
      { code: '1..n', meaning: 'a range that is empty when n is 1 or less, so the loop body never runs' },
    ],
  },
  task: 'Write <code>first_to_end</code>: move the first item to the end and shift the rest one place left, using only <code>swap</code> on neighbours. <code>[1, 2, 3, 4]</code> becomes <code>[2, 3, 4, 1]</code>.',
  compare: {
    cpp: { code: `void first_to_end(std::vector<int>& v) {
    for (size_t i = 1; i < v.size(); i++)
        std::swap(v[i - 1], v[i]);
}
std::vector<int> a = {1, 2, 3, 4};
first_to_end(a);`, outcome: 'Same loop; a is now 2 3 4 1', ok: true },
    rust: { code: `fn first_to_end(v: &mut [i32]) {
    for i in 1..v.len() {
        v.swap(i - 1, i);
    }
}
let mut a = vec![1, 2, 3, 4];
first_to_end(&mut a);
println!("{:?}", a);`, outcome: 'Prints [2, 3, 4, 1]', ok: true },
    text: 'C++ passes <code>std::vector&lt;int&gt;&amp;</code> and sees the change through the reference. Rust passes a slice, <code>&amp;mut [i32]</code>, and the caller writes <code>&amp;mut a</code> so the lending is visible.',
  },
  refresher: [
    '<code>fn f(v: &amp;mut [i32])</code> changes the caller\'s items in place; call it as <code>f(&amp;mut v)</code> with <code>let mut v</code>.',
    '<code>v.swap(i, j)</code> swaps two items. <code>1..n</code> is empty when <code>n</code> is 0.',
  ],
  hints: [
    'Swap each item with the one before it, moving from the left: first item 0 and 1, then 1 and 2, and so on.',
    'Loop <code>for i in 1..v.len()</code> and call <code>v.swap(i - 1, i)</code>. The loop never runs for an empty or one-item slice.',
  ],
  inCpp: {
    code: `void f(std::vector<int>& v) { v[0] = 99; }
int main() {
    std::vector<int> a = {1, 2};
    f(a);               // the caller does not show that a can change
}`,
    note: 'In C++ nothing at the call site tells you that <code>f</code> can change <code>a</code>. Rust makes the caller write <code>&amp;mut a</code>.',
  },
  starter: `fn first_to_end(v: &mut [i32]) {
    // move the first item to the end by swapping neighbours
}

fn main() {
    let mut a = vec![1, 2, 3, 4];
    first_to_end(&mut a);
    println!("{:?}", a);
    let mut b: Vec<i32> = vec![];
    first_to_end(&mut b);
    println!("{:?}", b);
    let mut c = vec![7];
    first_to_end(&mut c);
    println!("{:?}", c);
}`,
  solution: `fn first_to_end(v: &mut [i32]) {
    for i in 1..v.len() {
        v.swap(i - 1, i);
    }
}

fn main() {
    let mut a = vec![1, 2, 3, 4];
    first_to_end(&mut a);
    println!("{:?}", a);
    let mut b: Vec<i32> = vec![];
    first_to_end(&mut b);
    println!("{:?}", b);
    let mut c = vec![7];
    first_to_end(&mut c);
    println!("{:?}", c);
}`,
  require: [{ pattern: '\\.swap\\s*\\(', message: 'Use swap on neighbouring items.' }],
  tests: [{ name: 'Prints the three results', expected: '[2, 3, 4, 1]\n[]\n[7]' }],
}

// ------------------------------------------------------------------------------------------
// 2. Bubble sort
// ------------------------------------------------------------------------------------------
const bubbleSort = {
  id: 'r4-bubble-sort',
  title: 'Bubble sort',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Bubble sort is built on one simple pass. Walk along the slice from left to right, and at every step compare an item with its right-hand neighbour. If they are in the wrong order (the left one is bigger), swap them. By the end of the pass the largest item has been carried all the way to the right end, like a bubble rising, and it is now in its final place.</p>`,
      `<p>Then you repeat the pass, but you can stop one place earlier each time, because the end of the slice is already settled. After <em>n</em> passes everything is in place. Here is <code>[5, 2, 9, 1]</code>. Pass 1 compares 5 and 2 (swap: <code>[2, 5, 9, 1]</code>), 5 and 9 (fine), 9 and 1 (swap: <code>[2, 5, 1, 9]</code>), so 9 is home. Pass 2 looks at the first three items: 2 and 5 (fine), 5 and 1 (swap: <code>[2, 1, 5, 9]</code>). Pass 3 looks at the first two: 2 and 1 (swap: <code>[1, 2, 5, 9]</code>). Done.</p>`,
      `<p>In Rust the shape is an outer loop that shrinks <code>end</code>, the number of items still unsettled, and an inner <code>for</code> over the neighbour pairs. A pair at <code>i</code> and <code>i + 1</code> needs <code>i + 1 &lt; end</code>, so the inner range is <code>0..end - 1</code>. That subtraction is safe only when <code>end</code> is at least 1; the outer <code>while end &gt; 1</code> guarantees it, and it also means an empty or one-item slice does no work at all. The example below is a single pass; your job is to repeat it.</p>`,
    ],
    examples: [
      {
        code: `fn one_pass(v: &mut [i32], end: usize) {
    // only the first "end" items are still unsettled; end is at least 2 here
    for i in 0..end - 1 {
        if v[i] > v[i + 1] {        // neighbours out of order?
            v.swap(i, i + 1);       // then swap them
        }
    }
}

fn main() {
    let mut v = vec![5, 2, 9, 1];
    one_pass(&mut v, 4);
    println!("{:?}", v);            // the largest item, 9, is now last
}`,
        output: '[2, 5, 1, 9]',
        caption: 'Exactly pass 1 of the trace above.',
      },
    ],
    terms: [
      { code: 'for i in 0..end - 1', meaning: 'visits every position i that has a right-hand neighbour inside the first end items' },
      { code: 'if v[i] > v[i + 1] { v.swap(i, i + 1); }', meaning: 'swaps a neighbour pair that is out of order' },
      { code: 'while end > 1 { ...; end -= 1; }', meaning: 'repeat passes, each one covering one item fewer' },
    ],
  },
  task: 'Write <code>bubble_sort</code> so it sorts the slice in place, smallest first, by repeating passes that swap neighbours that are out of order.',
  compare: {
    cpp: { code: `void bubble_sort(std::vector<int>& v) {
    for (size_t end = v.size(); end > 1; end--)
        for (size_t i = 0; i + 1 < end; i++)
            if (v[i] > v[i + 1]) std::swap(v[i], v[i + 1]);
}`, outcome: 'Same loops with size_t', ok: true },
    rust: { code: `fn bubble_sort(v: &mut [i32]) {
    let mut end = v.len();
    while end > 1 {
        for i in 0..end - 1 {
            if v[i] > v[i + 1] {
                v.swap(i, i + 1);
            }
        }
        end -= 1;
    }
}
let mut v = vec![3, 1, 2];
bubble_sort(&mut v);
println!("{:?}", v);`, outcome: 'Prints [1, 2, 3]', ok: true },
    text: 'The loops are the same as in C++. The Rust version calls <code>v.swap</code> on the slice, and the <code>while end &gt; 1</code> guard also keeps <code>end - 1</code> from underflowing.',
  },
  refresher: [
    '<code>&amp;mut [i32]</code> is a mutable borrow of a run of integers; <code>v.swap(i, j)</code> swaps two items.',
    'After each pass the largest unsettled item is at the end, so the next pass stops one place earlier.',
  ],
  hints: [
    'Keep a variable <code>end</code> starting at <code>v.len()</code>; run passes while <code>end &gt; 1</code> and do <code>end -= 1</code> after each pass.',
    'Compare <code>v[i]</code> with <code>v[i + 1]</code> for <code>i</code> in <code>0..end - 1</code>.',
    'The <code>while end &gt; 1</code> test is what keeps <code>end - 1</code> from underflowing on an empty slice.',
  ],
  inCpp: {
    code: `std::vector<int> v;                                // empty
for (size_t i = 0; i < v.size() - 1; i++) { }   // size() - 1 wraps`,
    note: 'On an empty vector this C++ loop runs about 18 quintillion times and reads past the end. The same expression in Rust panics in a debug build, so the first empty test shows you.',
  },
  starter: 'fn bubble_sort(v: &mut [i32]) {\n    // sort v in place\n}',
  solution: 'fn bubble_sort(v: &mut [i32]) {\n    let mut end = v.len();\n    while end > 1 {\n        for i in 0..end - 1 {\n            if v[i] > v[i + 1] {\n                v.swap(i, i + 1);\n            }\n        }\n        end -= 1;\n    }\n}',
  harness: sortHarness('bubble_sort', 2000, 100000),
  forbidden: noStdSort,
  tests: sortTests('2 000 numbers'),
}

// ------------------------------------------------------------------------------------------
// 3. Selection sort
// ------------------------------------------------------------------------------------------
const selectionSort = {
  id: 'r4-selection-sort',
  title: 'Selection sort',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Selection sort works like picking a team: for the first place, search the whole slice for the smallest item and swap it into position 0. For the second place, search what is left (position 1 onwards) for the smallest and swap it into position 1. Carry on until the end. After step <em>i</em> the first <em>i + 1</em> positions hold their final values.</p>`,
      `<p>Trace of <code>[5, 2, 9, 1]</code>. Step 0: the smallest of everything is 1, at position 3. Swap it with position 0: <code>[1, 2, 9, 5]</code>. Step 1: the smallest of <code>[2, 9, 5]</code> is 2, already at position 1, so the swap does nothing. Step 2: the smallest of <code>[9, 5]</code> is 5, at position 3. Swap: <code>[1, 2, 5, 9]</code>. Step 3: a single item is trivially smallest.</p>`,
      `<p>Finding the smallest item means remembering <em>where</em> it is, not just its value, because you need the position to swap. So keep a <code>let mut min = i;</code> holding the index of the best item so far, scan the rest with an inner loop, and whenever <code>v[j] &lt; v[min]</code> set <code>min = j</code>. The inner range is <code>i + 1..v.len()</code>, which starts after <code>i</code> and is empty on the last step. Because the outer loop can simply be <code>0..v.len()</code>, there is no <code>len() - 1</code> to underflow on an empty slice. Swap once per step, after the scan.</p>`,
    ],
    examples: [
      {
        code: `fn index_of_min(v: &[i32], from: usize) -> usize {
    let mut min = from;                 // index of the smallest seen so far
    for j in from + 1..v.len() {        // scan everything after "from"
        if v[j] < v[min] {
            min = j;                    // remember the position, not the value
        }
    }
    min
}

fn main() {
    let v = [5, 2, 9, 1];
    println!("{}", index_of_min(&v, 0));   // 1 is at index 3
    println!("{}", index_of_min(&v, 1));   // among [2, 9, 1] the smallest is at index 3
    println!("{}", index_of_min(&v, 2));   // among [9, 1] it is at index 3
}`,
        output: '3\n3\n3',
        caption: 'Reading only. Selection sort swaps <code>v[i]</code> with the item at this index, once per step.',
      },
    ],
    terms: [
      { code: 'let mut min = i;', meaning: 'the index of the smallest item seen so far, starting with the first candidate' },
      { code: 'for j in i + 1..v.len()', meaning: 'visits every position after i (i + 1 is worked out before the range is built)' },
      { code: 'v.swap(i, min)', meaning: 'puts the smallest item into position i; swapping an item with itself is harmless' },
    ],
  },
  task: 'Write <code>selection_sort</code>: for each position, find the smallest item to its right and swap it into place. Sort in place, smallest first.',
  compare: {
    cpp: { code: `void selection_sort(std::vector<int>& v) {
    for (size_t i = 0; i + 1 < v.size(); i++) {
        size_t m = i;
        for (size_t j = i + 1; j < v.size(); j++)
            if (v[j] < v[m]) m = j;
        std::swap(v[i], v[m]);
    }
}`, outcome: 'Same algorithm', ok: true },
    rust: { code: `fn selection_sort(v: &mut [i32]) {
    for i in 0..v.len() {
        let mut min = i;
        for j in i + 1..v.len() {
            if v[j] < v[min] {
                min = j;
            }
        }
        v.swap(i, min);
    }
}
let mut v = vec![3, 1, 2];
selection_sort(&mut v);
println!("{:?}", v);`, outcome: 'Prints [1, 2, 3]', ok: true },
    text: 'The algorithm is the same. Rust\'s <code>for</code> over a range replaces the three-part C++ loop, and looping <code>0..v.len()</code> removes the <code>size() - 1</code> trap.',
  },
  refresher: [
    '<code>for j in i + 1..v.len()</code> is a range loop; <code>v.swap(a, b)</code> swaps two items.',
    'Keep the <em>index</em> of the smallest item in a <code>mut</code> variable and update it while scanning.',
  ],
  hints: [
    'Outer loop over every position <code>i</code>; inner loop over <code>i + 1..v.len()</code>.',
    'Track the index of the smallest value seen so far, then swap it with <code>v[i]</code> once, after the inner loop.',
    '<code>0..v.len()</code> for the outer loop avoids <code>v.len() - 1</code>, which panics on an empty slice.',
  ],
  inCpp: {
    code: `std::vector<int> v;                                // empty
for (size_t i = 0; i < v.size() - 1; i++) { }   // runs off the end`,
    note: 'In C++ the unsigned subtraction wraps and the loop runs off the end of an empty vector. The same expression in Rust panics in a debug build, so you notice at the first empty test.',
  },
  starter: 'fn selection_sort(v: &mut [i32]) {\n    // sort v in place\n}',
  solution: 'fn selection_sort(v: &mut [i32]) {\n    for i in 0..v.len() {\n        let mut min = i;\n        for j in i + 1..v.len() {\n            if v[j] < v[min] {\n                min = j;\n            }\n        }\n        v.swap(i, min);\n    }\n}',
  harness: sortHarness('selection_sort', 2000, 100000),
  forbidden: noStdSort,
  tests: sortTests('2 000 numbers'),
}

// ------------------------------------------------------------------------------------------
// 4. Insertion sort
// ------------------------------------------------------------------------------------------
const insertionSort = {
  id: 'r4-insertion-sort',
  title: 'Insertion sort',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Insertion sort is how most people sort a hand of playing cards. Keep the left part of the slice sorted. Take the next item and slide it leftwards, past every bigger item, until it reaches its place. Then the sorted part is one item longer. A single item on its own is already sorted, so you start with the item at position 1.</p>`,
      `<p>Trace of <code>[5, 2, 9, 1]</code>. The sorted part is <code>[5]</code>. Take 2: it is smaller than 5, swap, giving <code>[2, 5, 9, 1]</code>; it has reached the left end. Take 9: not smaller than 5, so it stays. Take 1: swap with 9, then with 5, then with 2, giving <code>[1, 2, 5, 9]</code>.</p>`,
      `<p>Sliding left means going <em>down</em> an index, and that is where <code>usize</code> bites. Keep <code>let mut j = i;</code> and loop while the item before <code>j</code> is bigger: <code>while j &gt; 0 &amp;&amp; v[j - 1] &gt; v[j]</code>. The order of the two tests matters. <code>&amp;&amp;</code> stops as soon as its left side is false (called short-circuiting), so when <code>j</code> is 0 the test <code>j &gt; 0</code> fails and <code>v[j - 1]</code> is never evaluated. Swap the two sides round and you compute <code>0 - 1</code> and panic. Inside the loop, swap and step down with <code>j -= 1</code>.</p>`,
    ],
    examples: [
      {
        code: `fn sink(v: &mut [i32], i: usize) {
    // the part before position i is sorted; slide v[i] left into place
    let mut j = i;
    while j > 0 && v[j - 1] > v[j] {    // j > 0 is checked first, so j - 1 is safe
        v.swap(j - 1, j);               // move the item one place left
        j -= 1;                         // follow it
    }
}

fn main() {
    let mut v = vec![2, 5, 9, 1];       // the first three items are sorted
    sink(&mut v, 3);                    // slide the 1 left to its place
    println!("{:?}", v);
}`,
        output: '[1, 2, 5, 9]',
        caption: 'The last step of the trace. Insertion sort calls this for <code>i = 1, 2, 3, ...</code>.',
      },
    ],
    terms: [
      { code: 'let mut j = i;', meaning: 'a second index that walks left while the item at i is slid into place' },
      { code: 'j > 0 && v[j - 1] > v[j]', meaning: 'keep going only if there is an item to the left and it is bigger; && skips the right side when the left is false' },
      { code: 'j -= 1;', meaning: 'steps the index down by one (safe here because j > 0 held)' },
    ],
  },
  task: 'Write <code>insertion_sort</code> so it sorts the slice in place, smallest first: slide each item left past every bigger one.',
  compare: {
    cpp: { code: `void insertion_sort(std::vector<int>& v) {
    for (size_t i = 1; i < v.size(); i++) {
        size_t j = i;
        while (j > 0 && v[j - 1] > v[j]) {
            std::swap(v[j - 1], v[j]);
            j--;
        }
    }
}`, outcome: 'Same loops', ok: true },
    rust: { code: `fn insertion_sort(v: &mut [i32]) {
    for i in 1..v.len() {
        let mut j = i;
        while j > 0 && v[j - 1] > v[j] {
            v.swap(j - 1, j);
            j -= 1;
        }
    }
}
let mut v = vec![3, 1, 2];
insertion_sort(&mut v);
println!("{:?}", v);`, outcome: 'Prints [1, 2, 3]', ok: true },
    text: 'The loops match the C++ version, including the order of the two tests. The Rust difference is what happens if you get it wrong: <code>0 - 1</code> on a <code>usize</code> panics in a debug build instead of wrapping.',
  },
  refresher: [
    '<code>for i in 1..v.len()</code> starts at the second item and is empty for a slice of 0 or 1 items.',
    '<code>a &amp;&amp; b</code> skips <code>b</code> when <code>a</code> is false: put <code>j &gt; 0</code> before <code>v[j - 1]</code>.',
  ],
  hints: [
    'Start the outer loop at index 1: everything left of <code>i</code> is already sorted.',
    'Swap item <code>j</code> leftwards while the one before it is larger, with <code>j -= 1</code> after each swap.',
    'Test <code>j &gt; 0</code> first. In a debug build <code>j - 1</code> panics when <code>j</code> is 0.',
  ],
  inCpp: {
    code: `size_t j = 0;
size_t before = j - 1;   // wraps to 18446744073709551615, no error`,
    note: 'A C++ <code>size_t</code> silently wraps below zero, so a wrong test order reads garbage. Rust panics in a debug build and points at the line.',
  },
  starter: 'fn insertion_sort(v: &mut [i32]) {\n    // sort v in place\n}',
  solution: 'fn insertion_sort(v: &mut [i32]) {\n    for i in 1..v.len() {\n        let mut j = i;\n        while j > 0 && v[j - 1] > v[j] {\n            v.swap(j - 1, j);\n            j -= 1;\n        }\n    }\n}',
  harness: sortHarness('insertion_sort', 2000, 100000),
  forbidden: noStdSort,
  tests: sortTests('2 000 numbers'),
}

// ------------------------------------------------------------------------------------------
// 5. Predict: usize going downward
// ------------------------------------------------------------------------------------------
const predictDown = {
  id: 'r4-predict-usize-down',
  title: 'Going below zero',
  kind: 'predict',
  introduces: [],
  task: 'Decide what each program does, then run it and compare. Both involve a <code>usize</code> that is asked to go below 0.',
  refresher: [
    '<code>usize</code> cannot be negative: <code>0 - 1</code> panics with "attempt to subtract with overflow" in a debug build.',
    '<code>a &amp;&amp; b</code> evaluates <code>b</code> only when <code>a</code> is true.',
  ],
  inCpp: {
    code: `std::vector<int> v;
for (size_t i = 0; i < v.size() - 1; i++) { }   // size() - 1 wraps; runs far past the end`,
    note: 'C++ has no panic here: the unsigned value wraps, the loop bound becomes enormous, and the program reads out of bounds.',
  },
  rounds: [
    {
      snippet: 'fn main() {\n    let v: Vec<i32> = Vec::new();\n    for i in 0..v.len() - 1 {\n        println!("{}", i);\n    }\n}',
      choices: ['Prints nothing and exits normally', 'Panics: attempt to subtract with overflow', 'Error: mismatched types'],
      answer: 1,
      why: '<code>v.len()</code> is 0, and <code>0 - 1</code> is evaluated before the range is even built. The loop never gets a chance to be empty.',
      panic: true,
      output: 'attempt to subtract with overflow',
    },
    {
      snippet: 'fn main() {\n    let v = vec![3, 1];\n    let mut j: usize = 0;\n    while v[j - 1] > v[j] && j > 0 {\n        j -= 1;\n    }\n    println!("{}", j);\n}',
      choices: ['Prints 0', 'Panics: attempt to subtract with overflow', 'Panics: index out of bounds'],
      answer: 1,
      why: 'The tests are in the wrong order. <code>v[j - 1]</code> is evaluated first and <code>0 - 1</code> panics; <code>j &gt; 0</code> was meant to stop that.',
      panic: true,
      output: 'attempt to subtract with overflow',
    },
  ],
}

// ------------------------------------------------------------------------------------------
// 6. Merging two sorted slices
// ------------------------------------------------------------------------------------------
const mergeTwo = {
  id: 'r4-merge-two',
  title: 'Merge two sorted slices',
  kind: 'implement',
  introduces: ['vec-bulk'],
  teach: {
    body: [
      `<p>Merge sort rests on one small operation: given two slices that are each already sorted, produce one sorted result. Look at the front of both. Take the smaller of the two front items, put it in the output, and move on in that slice. When one slice runs out, whatever remains of the other goes straight on the end. Merging <code>[2, 5, 9]</code> and <code>[1, 7]</code>: fronts 2 and 1, take 1; fronts 2 and 7, take 2; fronts 5 and 7, take 5; fronts 9 and 7, take 7; the second slice is empty, so append 9. Result <code>[1, 2, 5, 7, 9]</code>.</p>`,
      `<p>You track the front of each slice with an index: <code>i</code> for <code>a</code>, <code>j</code> for <code>b</code>. The output is a new <code>Vec</code>, because the answer is a different length from either input. Three <code>Vec</code> tools are new here. <code>Vec::with_capacity(n)</code> makes an empty <code>Vec</code> with room reserved for <code>n</code> items, so pushing never has to reallocate (C++ <code>reserve</code>); its length is still 0. <code>out.push(x)</code> you know. <code>out.extend_from_slice(&amp;a[i..])</code> appends a whole slice of items at once; <code>&amp;a[i..]</code> is the borrowed view from <code>i</code> to the end, from stage 2.</p>`,
      `<p>When the two fronts are equal, take from the left one (<code>a</code>). That keeps equal items in their original order, which is called a <em>stable</em> merge. Use <code>&lt;=</code> for the comparison. After the main loop one of the two slices is used up, so you can append the rest of <em>both</em>: the leftovers of the empty one are an empty slice and add nothing.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let a = [1, 2, 3];
    let mut out = Vec::with_capacity(5);   // empty, with room for 5 items
    out.push(10);                          // length 1
    out.extend_from_slice(&a[1..]);        // append 2 and 3 in one go
    println!("{:?} {}", out, out.len());
}`,
        output: '[10, 2, 3] 3',
        caption: 'The compiler works out that <code>out</code> holds <code>i32</code> from the <code>push</code>.',
      },
    ],
    terms: [
      { code: 'Vec::with_capacity(n)', meaning: 'an empty Vec with room reserved for n items (length stays 0)' },
      { code: 'out.extend_from_slice(&a[i..])', meaning: 'appends every item of the slice to the end of out' },
      { code: 'a[i] <= b[j]', meaning: 'on a tie take the left item, which keeps equal items in order (a stable merge)' },
    ],
  },
  task: 'Write <code>merge(a, b)</code>: both slices are sorted; return a new sorted <code>Vec&lt;i32&gt;</code> with all their items. On a tie take from <code>a</code>.',
  compare: {
    cpp: { code: `std::vector<int> merge(const std::vector<int>& a, const std::vector<int>& b) {
    std::vector<int> out;
    out.reserve(a.size() + b.size());
    std::merge(a.begin(), a.end(), b.begin(), b.end(), std::back_inserter(out));
    return out;
}`, outcome: 'std::merge does the whole job', ok: true },
    rust: { code: `fn merge_demo(a: &[i32]) -> Vec<i32> {
    let mut out = Vec::with_capacity(a.len() + 1);
    out.push(0);
    out.extend_from_slice(a);
    out
}
println!("{:?}", merge_demo(&[1, 2]));`, outcome: 'Prints [0, 1, 2]', ok: true },
    text: 'C++ has <code>std::merge</code>; here you write the loop yourself. <code>with_capacity</code> is Rust\'s <code>reserve</code> and <code>extend_from_slice</code> is the single call that replaces <code>insert(end, first, last)</code>.',
  },
  refresher: [
    '<code>Vec::with_capacity(n)</code> reserves room; <code>out.extend_from_slice(&amp;a[i..])</code> appends the rest of a slice.',
    'Two indexes, one per slice; take the smaller front; on a tie take the left one.',
  ],
  hints: [
    'Loop <code>while i &lt; a.len() &amp;&amp; j &lt; b.len()</code>: push the smaller of <code>a[i]</code> and <code>b[j]</code> and advance that index.',
    'Compare with <code>a[i] &lt;= b[j]</code> so ties come from <code>a</code>.',
    'After the loop append what is left of both: <code>extend_from_slice(&amp;a[i..])</code> and <code>extend_from_slice(&amp;b[j..])</code>.',
  ],
  inCpp: {
    code: `std::vector<int> a = {1, 2, 3}, out;
size_t i = 1;
out.insert(out.end(), a.begin() + i, a.end());   // append the rest of a`,
    note: 'C++ appends a range with <code>insert</code> and an iterator pair. Rust appends a borrowed slice, <code>&amp;a[i..]</code>, which carries its own start and length.',
  },
  starter: 'fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {\n    // return a new sorted Vec holding every item of a and b\n    Vec::new()\n}',
  solution: 'fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {\n    let mut out = Vec::with_capacity(a.len() + b.len());\n    let (mut i, mut j) = (0, 0);\n    while i < a.len() && j < b.len() {\n        if a[i] <= b[j] {\n            out.push(a[i]);\n            i += 1;\n        } else {\n            out.push(b[j]);\n            j += 1;\n        }\n    }\n    out.extend_from_slice(&a[i..]);\n    out.extend_from_slice(&b[j..]);\n    out\n}',
  harness: `fn harness_show(v: &[i32]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
}

fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>)> = vec![
        (vec![2, 5, 9], vec![1, 7]),
        (vec![], vec![3, 4]),
        (vec![1, 2], vec![]),
        (vec![], vec![]),
        (vec![1, 3, 3], vec![3, 4]),
    ];
    for (i, (a, b)) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", harness_show(&merge(a, b)));
    }

    println!("\\n@@TEST 6@@");
    let a: Vec<i32> = (0..50000).map(|i| i * 3).collect();
    let b: Vec<i32> = (0..30000).map(|i| i * 5 + 1).collect();
    let m = merge(&a, &b);
    let sum: i64 = m.iter().map(|&x| x as i64).sum();
    let want: i64 = a.iter().chain(b.iter()).map(|&x| x as i64).sum();
    let sorted = m.windows(2).all(|w| w[0] <= w[1]);
    println!("{}", if sorted && m.len() == 80000 && sum == want { "merged" } else { "wrong" });
}`,
  tests: [
    { name: 'Interleaved', input: '[2 5 9] + [1 7]', expected: '1 2 5 7 9' },
    { name: 'Empty left', input: '[] + [3 4]', expected: '3 4' },
    { name: 'Empty right', input: '[1 2] + []', expected: '1 2' },
    { name: 'Both empty', input: '[] + []', expected: '' },
    { name: 'Ties', input: '[1 3 3] + [3 4]', expected: '1 3 3 3 4' },
    { name: 'Large slices', input: '50 000 + 30 000 items', expected: 'merged' },
  ],
}

// ------------------------------------------------------------------------------------------
// 7. Merge sort
// ------------------------------------------------------------------------------------------
const mergeSort = {
  id: 'r4-merge-sort',
  title: 'Merge sort',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Merge sort uses divide and conquer. Split the slice in half, sort each half (by calling yourself on it), then <code>merge</code> the two sorted halves. A slice of 0 or 1 items is already sorted, which is the base case that stops the recursion. Trace of <code>[5, 2, 9, 1]</code>: split into <code>[5, 2]</code> and <code>[9, 1]</code>; sorting those gives <code>[2, 5]</code> and <code>[1, 9]</code> (each after splitting into single items and merging); merging them gives <code>[1, 2, 5, 9]</code>. Work is about <em>n</em> times log <em>n</em>, so 100 000 items is fast where the earlier sorts would crawl.</p>`,
      `<p>Rust slices make the recursion tidy. <code>&amp;mut v[..mid]</code> is a mutable view of the left half and <code>&amp;mut v[mid..]</code> of the right half; each is itself a <code>&amp;mut [i32]</code>, so you can pass it straight to <code>merge_sort</code>. You need no <code>lo</code> and <code>hi</code> parameters like the C++ version: a sub-slice knows its own start and length, and its indexes start at 0. Use the two halves one after the other: the first borrow ends when the call returns, so the second is allowed. (<code>split_at_mut</code> from stage 2 is for when you need both halves at the same time.)</p>`,
      `<p>The merge gives you a new <code>Vec</code> holding the sorted result, but the caller wants <code>v</code> itself sorted. <code>v.copy_from_slice(&amp;merged)</code> copies every item of <code>merged</code> over the items of <code>v</code>. The two must have the same length, or it panics. The <code>merge</code> from the last lesson is already in your file.</p>`,
    ],
    examples: [
      {
        code: `fn double_all(v: &mut [i32]) {
    if v.len() == 0 {
        return;
    }
    if v.len() == 1 {
        v[0] *= 2;                   // base case: one item
        return;
    }
    let mid = v.len() / 2;
    double_all(&mut v[..mid]);       // left half, borrowed mutably
    double_all(&mut v[mid..]);       // right half, after the first borrow ended
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    double_all(&mut v);
    println!("{:?}", v);
    let mut w = [0; 3];
    w.copy_from_slice(&[7, 8, 9]);   // lengths match: 3 and 3
    println!("{:?}", w);
}`,
        output: '[2, 4, 6, 8, 10]\n[7, 8, 9]',
        caption: 'Recursion on halves changes the original vector, because a sub-slice is a view, not a copy.',
      },
    ],
    terms: [
      { code: '&mut v[..mid]', meaning: 'a mutable view of the first mid items; pass it to a recursive call' },
      { code: '&mut v[mid..]', meaning: 'a mutable view of the items from mid to the end' },
      { code: 'v.copy_from_slice(&merged)', meaning: 'overwrites v with the items of merged; panics if the lengths differ' },
    ],
  },
  task: 'Write <code>merge_sort</code>: if there are fewer than 2 items return; otherwise sort each half recursively, <code>merge</code> them, and copy the result back into <code>v</code>.',
  compare: {
    cpp: { code: `void merge_sort(std::vector<int>& v, size_t lo, size_t hi) {
    if (hi - lo < 2) return;
    size_t mid = lo + (hi - lo) / 2;
    merge_sort(v, lo, mid);
    merge_sort(v, mid, hi);
    std::inplace_merge(v.begin() + lo, v.begin() + mid, v.begin() + hi);
}`, outcome: 'Recursion on index ranges', ok: true },
    rust: { code: `fn merge_sort(v: &mut [i32]) {
    if v.len() < 2 {
        return;
    }
    let mid = v.len() / 2;
    merge_sort(&mut v[..mid]);
    merge_sort(&mut v[mid..]);
}
let mut v = vec![2, 1];
merge_sort(&mut v);
println!("{:?}", v);`, outcome: 'Halves, no lo or hi', ok: true },
    text: 'C++ recurses on index ranges and passes <code>lo</code> and <code>hi</code> everywhere. A Rust sub-slice carries its own start and length, so the recursion needs no extra parameters.',
  },
  refresher: [
    '<code>&amp;mut v[..mid]</code> and <code>&amp;mut v[mid..]</code> are mutable sub-slices; use them one after the other.',
    '<code>v.copy_from_slice(&amp;merged)</code> copies a same-length slice over <code>v</code>.',
  ],
  hints: [
    'Base case first: <code>if v.len() &lt; 2 { return; }</code>.',
    'Let <code>mid = v.len() / 2</code>, then <code>merge_sort(&amp;mut v[..mid]);</code> and <code>merge_sort(&amp;mut v[mid..]);</code>.',
    'Then <code>let merged = merge(&amp;v[..mid], &amp;v[mid..]);</code> and <code>v.copy_from_slice(&amp;merged);</code>.',
  ],
  inCpp: {
    code: `void merge_sort(std::vector<int>& v, size_t lo, size_t hi);
void halves(std::vector<int>& v, size_t lo, size_t mid, size_t hi) {
    merge_sort(v, lo, mid);      // two extra arguments on every call
    merge_sort(v, mid, hi);
}`,
    note: 'Passing the whole vector plus bounds lets the C++ callee touch items outside its range by mistake. A Rust sub-slice can only reach its own items.',
  },
  starter: 'fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {\n    let mut out = Vec::with_capacity(a.len() + b.len());\n    let (mut i, mut j) = (0, 0);\n    while i < a.len() && j < b.len() {\n        if a[i] <= b[j] {\n            out.push(a[i]);\n            i += 1;\n        } else {\n            out.push(b[j]);\n            j += 1;\n        }\n    }\n    out.extend_from_slice(&a[i..]);\n    out.extend_from_slice(&b[j..]);\n    out\n}\n\nfn merge_sort(v: &mut [i32]) {\n    // sort v in place, using merge\n}',
  solution: 'fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {\n    let mut out = Vec::with_capacity(a.len() + b.len());\n    let (mut i, mut j) = (0, 0);\n    while i < a.len() && j < b.len() {\n        if a[i] <= b[j] {\n            out.push(a[i]);\n            i += 1;\n        } else {\n            out.push(b[j]);\n            j += 1;\n        }\n    }\n    out.extend_from_slice(&a[i..]);\n    out.extend_from_slice(&b[j..]);\n    out\n}\n\nfn merge_sort(v: &mut [i32]) {\n    if v.len() < 2 {\n        return;\n    }\n    let mid = v.len() / 2;\n    merge_sort(&mut v[..mid]);\n    merge_sort(&mut v[mid..]);\n    let merged = merge(&v[..mid], &v[mid..]);\n    v.copy_from_slice(&merged);\n}',
  harness: sortHarness('merge_sort', 100000, 100000),
  forbidden: noStdSort,
  tests: sortTests('100 000 numbers'),
}

// ------------------------------------------------------------------------------------------
// 8. Partition
// ------------------------------------------------------------------------------------------
const partitionLesson = {
  id: 'r4-partition',
  title: 'Partition around a pivot',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Quick sort rests on a different small operation, <em>partition</em>. Pick one item, the <em>pivot</em> (here, the last one). Rearrange the slice so every item smaller than the pivot comes before it and every other item after it. The pivot then sits exactly where it will be in the final sorted slice, and the function returns that position. The two sides are still jumbled, but each only has to be sorted on its own.</p>`,
      `<p>The classic way (Lomuto) keeps a <code>store</code> index: the place where the next small item should go. Scan every item before the pivot. When <code>v[i]</code> is smaller than the pivot, swap it into <code>store</code> and move <code>store</code> up by one. At the end, swap the pivot into <code>store</code>. Trace for <code>[5, 2, 9, 1, 4]</code> with pivot 4: 5 is not smaller; 2 is, swap with position 0, <code>[2, 5, 9, 1, 4]</code>, store 1; 9 is not; 1 is, swap with position 1, <code>[2, 1, 9, 5, 4]</code>, store 2. Finally swap the pivot with position 2: <code>[2, 1, 4, 5, 9]</code>, and return 2.</p>`,
      `<p>The function changes the slice and also returns a value, so its signature is <code>fn partition(v: &amp;mut [i32]) -&gt; usize</code>. It needs at least one item to have a last item; the sort that calls it checks the length first, so here <code>v.len() - 1</code> is safe. The example uses the same <code>store</code> idea on an easier question: move all even numbers to the front and return how many there are.</p>`,
    ],
    examples: [
      {
        code: `fn evens_first(v: &mut [i32]) -> usize {
    let mut store = 0;                  // where the next even number belongs
    for i in 0..v.len() {
        if v[i] % 2 == 0 {
            v.swap(i, store);           // bring it forward
            store += 1;
        }
    }
    store                               // how many evens there are
}

fn main() {
    let mut v = vec![3, 2, 5, 4, 1];
    let n = evens_first(&mut v);
    println!("{} {:?}", n, v);
}`,
        output: '2 [2, 4, 5, 3, 1]',
        caption: 'Same <code>store</code> idea as partition. The two sides keep no particular order.',
      },
    ],
    terms: [
      { code: 'fn partition(v: &mut [i32]) -> usize', meaning: 'rearranges v and returns where the pivot ended up' },
      { code: 'store', meaning: 'the index where the next small item goes; items before it are all smaller than the pivot' },
      { code: 'v.swap(store, last)', meaning: 'the final step: the pivot moves to its sorted position' },
    ],
  },
  task: 'Write <code>partition</code> with the last item as pivot: smaller items end up before it, the rest after it. Return the pivot\'s final index. The slice is never empty.',
  compare: {
    cpp: { code: `int partition(std::vector<int>& v, int lo, int hi) {
    int pivot = v[hi], store = lo;
    for (int i = lo; i < hi; i++)
        if (v[i] < pivot) std::swap(v[i], v[store++]);
    std::swap(v[store], v[hi]);
    return store;
}`, outcome: 'Lomuto partition on a range', ok: true },
    rust: { code: `fn partition(v: &mut [i32]) -> usize {
    let last = v.len() - 1;
    let pivot = v[last];
    let mut store = 0;
    for i in 0..last {
        if v[i] < pivot {
            v.swap(i, store);
            store += 1;
        }
    }
    v.swap(store, last);
    store
}
let mut v = vec![5, 2, 9, 1, 4];
println!("{} {:?}", partition(&mut v), v);`, outcome: 'Prints 2 [2, 1, 4, 5, 9]', ok: true },
    text: 'The Rust version works on the whole slice from index 0 instead of a <code>lo..hi</code> range, and it returns the index as a <code>usize</code>. <code>store++</code> becomes a separate <code>store += 1;</code> because Rust has no <code>++</code>.',
  },
  refresher: [
    'Keep a <code>store</code> index; whenever <code>v[i]</code> is smaller than the pivot, swap it to <code>store</code> and advance it.',
    'Finish with <code>v.swap(store, last)</code> and return <code>store</code>.',
  ],
  hints: [
    '<code>let last = v.len() - 1;</code> and <code>let pivot = v[last];</code> (the slice is never empty).',
    'Loop <code>i</code> over <code>0..last</code>, so the pivot itself is not scanned.',
    'After the loop swap the pivot into place with <code>v.swap(store, last)</code>, then give back <code>store</code>.',
  ],
  inCpp: {
    code: `std::vector<int> v = {1, 2, 3};
size_t store = 0, i = 1;
std::swap(v[i], v[store++]);   // two things happen in one expression`,
    note: 'Rust has no <code>++</code> and no assignment-as-expression, so the increment is its own statement. That is a few more lines, but there is nothing to misread.',
  },
  starter: 'fn partition(v: &mut [i32]) -> usize {\n    // pivot = last item; return its final index\n    0\n}',
  solution: 'fn partition(v: &mut [i32]) -> usize {\n    let last = v.len() - 1;\n    let pivot = v[last];\n    let mut store = 0;\n    for i in 0..last {\n        if v[i] < pivot {\n            v.swap(i, store);\n            store += 1;\n        }\n    }\n    v.swap(store, last);\n    store\n}',
  harness: `fn harness_sums(v: &[i32]) -> (i64, i64) {
    (v.iter().map(|&x| x as i64).sum(), v.iter().map(|&x| (x as i64) * (x as i64)).sum())
}

fn harness_check(v: &mut Vec<i32>) -> String {
    let pivot = v[v.len() - 1];
    let smaller = v.iter().filter(|&&x| x < pivot).count();
    let before = harness_sums(v);
    let p = partition(v);
    let fine = p == smaller
        && v[p] == pivot
        && v[..p].iter().all(|&x| x < pivot)
        && v[p + 1..].iter().all(|&x| x >= pivot)
        && harness_sums(v) == before;
    if fine { format!("pivot at {}", p) } else { "bad partition".to_string() }
}

fn main() {
    let cases: Vec<Vec<i32>> = vec![
        vec![5, 2, 9, 1, 4],
        vec![7],
        vec![3, 3, 3],
        vec![1, 2, 3, 4, 5],
        vec![5, 4, 3, 2, 1],
        vec![2, 1],
        vec![1, 2],
    ];
    for (i, mut v) in cases.into_iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", harness_check(&mut v));
    }

    println!("\\n@@TEST 8@@");
    let mut state = 99u64;
    let mut v: Vec<i32> = (0..20000)
        .map(|_| {
            state = state.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
            ((state >> 33) % 1000) as i32
        })
        .collect();
    let r = harness_check(&mut v);
    println!("{}", if r.starts_with("pivot at") { "partitioned" } else { "bad partition" });
}`,
  tests: [
    { name: 'Example', input: '5 2 9 1 4', expected: 'pivot at 2' },
    { name: 'One item', input: '7', expected: 'pivot at 0' },
    { name: 'All equal', input: '3 3 3', expected: 'pivot at 0' },
    { name: 'Already sorted', input: '1 2 3 4 5', expected: 'pivot at 4' },
    { name: 'Reversed', input: '5 4 3 2 1', expected: 'pivot at 0' },
    { name: 'Two items, pivot smaller', input: '2 1', expected: 'pivot at 0' },
    { name: 'Two items, pivot larger', input: '1 2', expected: 'pivot at 1' },
    { name: 'Large generated input', input: '20 000 numbers', expected: 'partitioned' },
  ],
}

// ------------------------------------------------------------------------------------------
// 9. Quick sort
// ------------------------------------------------------------------------------------------
const quickSort = {
  id: 'r4-quick-sort',
  title: 'Quick sort',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>With <code>partition</code> in hand, quick sort is short. Partition the slice; the pivot is now in its final place at index <code>p</code>. Everything before it is smaller and everything after it is not, so sort the left part <code>[..p]</code> and the right part <code>[p + 1..]</code> by calling yourself, and you are done. The pivot itself is left out of both calls. Slices of 0 or 1 items are already sorted, so that is the base case. Trace of <code>[5, 2, 9, 1, 4]</code>: partition gives <code>[2, 1, 4, 5, 9]</code> with <code>p = 2</code>; sort <code>[2, 1]</code> (partition around 1 gives <code>[1, 2]</code>) and <code>[5, 9]</code> (already fine).</p>`,
      `<p>Rust fits well. <code>&amp;mut v[..p]</code> and <code>&amp;mut v[p + 1..]</code> are two mutable views that never overlap, and because you use them one after the other, each borrow has ended before the next starts. <code>p + 1</code> is at most <code>v.len()</code>, so the right slice may be empty but never out of range. You could also use <code>v.split_at_mut(p)</code> from stage 2 to get both halves in one go; that matters only when both must be alive at the same time.</p>`,
      `<p>One honest caveat: with the last item as the pivot, an already-sorted input is the worst case (each partition peels off just one item, so the recursion goes <em>n</em> deep). Real libraries pick the pivot more carefully. The tests here use random data, where this simple choice is fine. Your <code>partition</code> from the last lesson is already in the file.</p>`,
    ],
    examples: [
      {
        code: `fn double_all(v: &mut [i32]) {
    for i in 0..v.len() {
        v[i] *= 2;
    }
}

fn double_except(v: &mut [i32], keep: usize) {
    double_all(&mut v[..keep]);         // everything before keep
    double_all(&mut v[keep + 1..]);     // everything after keep; v[keep] is left alone
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    double_except(&mut v, 2);
    println!("{:?}", v);
}`,
        output: '[2, 4, 3, 8, 10]',
        caption: 'The shape of the quick sort recursion: two views that skip one position.',
      },
    ],
    terms: [
      { code: '&mut v[..p]', meaning: 'the items before the pivot, as a mutable view' },
      { code: '&mut v[p + 1..]', meaning: 'the items after the pivot (empty if the pivot is last)' },
      { code: 'if v.len() < 2 { return; }', meaning: 'the base case: nothing to sort' },
    ],
  },
  task: 'Write <code>quick_sort</code> using the provided <code>partition</code>: if there are fewer than 2 items return; otherwise partition, then sort the part before the pivot and the part after it.',
  compare: {
    cpp: { code: `void quick_sort(std::vector<int>& v, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(v, lo, hi);
    quick_sort(v, lo, p - 1);
    quick_sort(v, p + 1, hi);
}`, outcome: 'Signed bounds so p - 1 may be -1', ok: true },
    rust: { code: `fn quick_sort(v: &mut [i32]) {
    if v.len() < 2 {
        return;
    }
    let last = v.len() - 1;
    let pivot = v[last];
    let mut store = 0;
    for i in 0..last {
        if v[i] < pivot {
            v.swap(i, store);
            store += 1;
        }
    }
    v.swap(store, last);
    quick_sort(&mut v[..store]);
    quick_sort(&mut v[store + 1..]);
}
let mut v = vec![3, 1, 2];
quick_sort(&mut v);
println!("{:?}", v);`, outcome: 'Prints [1, 2, 3]', ok: true },
    text: 'C++ uses signed <code>int</code> bounds so <code>p - 1</code> can be -1. Recursing on slices needs no subtraction at all, which is why <code>usize</code> is comfortable here.',
  },
  refresher: [
    '<code>&amp;mut v[..p]</code> and <code>&amp;mut v[p + 1..]</code> are non-overlapping sub-slices; use them one after the other.',
    'A slice of 0 or 1 items is sorted: return early before calling <code>partition</code>.',
  ],
  hints: [
    '<code>if v.len() &lt; 2 { return; }</code> first: <code>partition</code> needs at least one item.',
    '<code>let p = partition(v);</code> then the pivot is at index <code>p</code> and stays there.',
    'Recurse on <code>&amp;mut v[..p]</code> and on <code>&amp;mut v[p + 1..]</code>.',
  ],
  inCpp: {
    code: `void quick_sort(std::vector<int>& v, size_t lo, size_t hi);
void left_part(std::vector<int>& v, size_t lo, size_t p) {
    quick_sort(v, lo, p - 1);   // with size_t bounds and p == 0, p - 1 wraps
}`,
    note: 'Using unsigned bounds in the C++ version makes <code>p - 1</code> wrap when the pivot lands at 0. Sub-slices in Rust avoid the whole class of bug.',
  },
  starter: 'fn partition(v: &mut [i32]) -> usize {\n    let last = v.len() - 1;\n    let pivot = v[last];\n    let mut store = 0;\n    for i in 0..last {\n        if v[i] < pivot {\n            v.swap(i, store);\n            store += 1;\n        }\n    }\n    v.swap(store, last);\n    store\n}\n\nfn quick_sort(v: &mut [i32]) {\n    // sort v in place, using partition\n}',
  solution: 'fn partition(v: &mut [i32]) -> usize {\n    let last = v.len() - 1;\n    let pivot = v[last];\n    let mut store = 0;\n    for i in 0..last {\n        if v[i] < pivot {\n            v.swap(i, store);\n            store += 1;\n        }\n    }\n    v.swap(store, last);\n    store\n}\n\nfn quick_sort(v: &mut [i32]) {\n    if v.len() < 2 {\n        return;\n    }\n    let p = partition(v);\n    quick_sort(&mut v[..p]);\n    quick_sort(&mut v[p + 1..]);\n}',
  harness: sortHarness('quick_sort', 100000, 100000),
  forbidden: noStdSort,
  tests: sortTests('100 000 numbers'),
}

// ------------------------------------------------------------------------------------------
// 10. Counting sort
// ------------------------------------------------------------------------------------------
const countingSort = {
  id: 'r4-counting-sort',
  title: 'Counting sort',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>The earlier sorts compare items. When the values are whole numbers in a small known range you can do better by not comparing at all. Make a table with one counter per possible value. Pass over the data once and add 1 to the counter of every value you meet. Then walk the table in order and write each value out as many times as its counter says. For values in <code>0..=3</code>, the data <code>[2, 0, 2, 1, 2]</code> gives counters <code>[1, 1, 3, 0]</code>, and writing them out gives <code>[0, 1, 2, 2, 2]</code>.</p>`,
      `<p>In Rust the table is an array: <code>[0; 101]</code> is an array of 101 zeros (you saw <code>[value; count]</code> in stage 1). The value itself is the index, so <code>counts[v[i] as usize] += 1</code> counts one occurrence. An index must be a <code>usize</code>, and the items are <code>i32</code>, so <code>as usize</code> converts. Careful with that conversion: a negative <code>i32</code> turns into a gigantic <code>usize</code>, and the bounds check then panics. This lesson promises all values are in <code>0..=100</code>, so it is safe here.</p>`,
      `<p>To walk the table with its positions, use <code>counts.iter().enumerate()</code> from stage 3: it yields <code>(value, count)</code> pairs, where <code>value</code> is the index and <code>count</code> is a reference to the counter, so use <code>*count</code> to get the number. To write back, keep a running position <code>k</code> and for each value do <code>v[k] = value as i32; k += 1;</code>, <code>count</code> times. <code>for _ in 0..*count</code> repeats a body without needing the loop variable (the <code>_</code> means "I am not using it").</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let data: [usize; 5] = [2, 0, 2, 1, 2];
    let mut counts = [0; 3];                    // one counter per value 0, 1, 2
    for i in 0..data.len() {
        counts[data[i]] += 1;                   // the value is the index
    }
    for (value, count) in counts.iter().enumerate() {
        println!("{} appears {} times", value, count);
    }
}`,
        output: '0 appears 1 times\n1 appears 1 times\n2 appears 3 times',
        caption: 'The counting half. Sorting writes each value back <code>count</code> times.',
      },
    ],
    terms: [
      { code: '[0; 101]', meaning: 'an array of 101 zeros: one counter for each value 0 to 100' },
      { code: 'counts[v[i] as usize] += 1', meaning: 'converts the value to a usize index and bumps its counter' },
      { code: 'for (value, count) in counts.iter().enumerate()', meaning: 'walks the counters with their positions; count is a reference, so use *count' },
      { code: 'for _ in 0..*count', meaning: 'repeats count times without naming the loop variable' },
    ],
  },
  task: 'Write <code>counting_sort</code> for a slice whose values are all in <code>0..=100</code>: count how often each value occurs, then write the values back in order.',
  compare: {
    cpp: { code: `void counting_sort(std::vector<int>& v) {
    int counts[101] = {};
    for (int x : v) counts[x]++;
    size_t k = 0;
    for (int value = 0; value <= 100; value++)
        for (int c = 0; c < counts[value]; c++) v[k++] = value;
}`, outcome: 'Same two passes', ok: true },
    rust: { code: `fn counting_sort(v: &mut [i32]) {
    let mut counts = [0; 101];
    for i in 0..v.len() {
        counts[v[i] as usize] += 1;
    }
    let mut k = 0;
    for (value, count) in counts.iter().enumerate() {
        for _ in 0..*count {
            v[k] = value as i32;
            k += 1;
        }
    }
}
let mut v = vec![3, 0, 3];
counting_sort(&mut v);
println!("{:?}", v);`, outcome: 'Prints [0, 3, 3]', ok: true },
    text: 'The two passes are the same. A negative value would index outside the array: undefined behaviour in C++, a loud panic in Rust, because every index is bounds-checked.',
  },
  refresher: [
    '<code>[0; 101]</code> is an array of 101 zeros; index it with a <code>usize</code>: <code>x as usize</code> converts an <code>i32</code>.',
    '<code>counts.iter().enumerate()</code> yields <code>(index, &amp;counter)</code>; use <code>*count</code> for the number.',
  ],
  hints: [
    'First pass: <code>counts[v[i] as usize] += 1</code> for every position <code>i</code>.',
    'Second pass: for each <code>(value, count)</code>, write <code>value as i32</code> into <code>v[k]</code> <code>*count</code> times, bumping <code>k</code>.',
    'The array index is the value, so converting back needs <code>value as i32</code>.',
  ],
  inCpp: {
    code: `int counts[101] = {};
counts[-1]++;   // out of bounds: undefined behaviour, often silent`,
    note: 'C++ lets a bad index scribble on neighbouring memory. Rust checks every index and stops the program with a clear message.',
  },
  starter: 'fn counting_sort(v: &mut [i32]) {\n    // every value is in 0..=100\n}',
  solution: 'fn counting_sort(v: &mut [i32]) {\n    let mut counts = [0; 101];\n    for i in 0..v.len() {\n        counts[v[i] as usize] += 1;\n    }\n    let mut k = 0;\n    for (value, count) in counts.iter().enumerate() {\n        for _ in 0..*count {\n            v[k] = value as i32;\n            k += 1;\n        }\n    }\n}',
  harness: sortHarness('counting_sort', 100000, 101),
  forbidden: noStdSort,
  tests: sortTests('100 000 numbers, 0 to 100'),
}

// ------------------------------------------------------------------------------------------
// 11. sort_by_key
// ------------------------------------------------------------------------------------------
const sortByKey = {
  id: 'r4-sort-by-key',
  title: 'sort_by_key and stable sorts',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Now that you have written the sorts by hand, here is what real code does: call the standard library. In stage 3 you used <code>v.sort()</code> for types with a built-in order and <code>v.sort_by(|a, b| ...)</code> with a closure that compares two items. A third form is often shorter. <code>v.sort_by_key(|item| key)</code> takes a closure that turns one item into a <em>key</em>, and sorts by comparing the keys. The key can be anything ordered: a number, a <code>String</code>, a tuple. So sorting players by score is <code>players.sort_by_key(|p| p.score)</code>, and sorting words by length is <code>words.sort_by_key(|w| w.len())</code>.</p>`,
      `<p><code>sort</code>, <code>sort_by</code> and <code>sort_by_key</code> are <em>stable</em>: items whose keys are equal stay in the order they had before. That is why sorting by length leaves two same-length words in their original order. There are <code>sort_unstable</code>, <code>sort_unstable_by</code> and <code>sort_unstable_by_key</code> too: they may reorder equal items, in exchange for being a little faster and using no extra memory. If equal items are indistinguishable (plain numbers), use the unstable ones; otherwise keep the default. C++ has the same split in <code>std::stable_sort</code> versus <code>std::sort</code>, but the C++ default is the unstable one.</p>`,
      `<p>One limit: the key closure returns an owned value, so <code>|p| &amp;p.name</code> (a borrow of the item) is refused. Return a number, or clone the data if you must, or use <code>sort_by</code> and compare the references directly.</p>`,
    ],
    examples: [
      {
        code: `struct Player {
    name: String,
    score: u32,
}

fn main() {
    let mut v = vec![
        Player { name: String::from("bo"), score: 5 },
        Player { name: String::from("al"), score: 9 },
        Player { name: String::from("cy"), score: 5 },
    ];
    v.sort_by_key(|p| p.score);          // key = the score; equal keys keep their order
    for p in &v {
        println!("{} {}", p.name, p.score);
    }
}`,
        output: 'bo 5\ncy 5\nal 9',
        caption: '<code>bo</code> and <code>cy</code> both have score 5 and stay in their original order.',
      },
    ],
    terms: [
      { code: 'v.sort_by_key(|x| key)', meaning: 'sorts by a key computed from each item; stable' },
      { code: 'v.sort_unstable()', meaning: 'may reorder equal items; slightly faster, no extra memory' },
      { code: 'stable sort', meaning: 'items with equal keys keep their original relative order' },
    ],
  },
  task: 'Write <code>by_length</code>: sort the words shortest first with <code>sort_by_key</code>. Words of equal length must keep their original order.',
  compare: {
    cpp: { code: `void by_length(std::vector<std::string>& w) {
    std::stable_sort(w.begin(), w.end(),
        [](const std::string& a, const std::string& b) { return a.size() < b.size(); });
}`, outcome: 'Comparator; stable_sort for stability', ok: true },
    rust: { code: `fn by_length(w: &mut [String]) {
    w.sort_by_key(|s| s.len());
}
let mut w = vec![String::from("kiwi"), String::from("fig")];
by_length(&mut w);
println!("{:?}", w);`, outcome: 'Prints ["fig", "kiwi"]', ok: true },
    text: 'C++ needs a two-argument comparator and <code>std::stable_sort</code> to be sure of stability. Rust\'s default sorts are stable, and <code>sort_by_key</code> only asks for the key.',
  },
  refresher: [
    '<code>v.sort_by_key(|x| key)</code> sorts by the key each closure call returns; the default sorts are stable.',
    '<code>w.len()</code> on a <code>String</code> is its length in bytes.',
  ],
  hints: [
    'Call <code>words.sort_by_key(...)</code> on the slice; it is already a mutable slice.',
    'The closure takes one word and returns its length: <code>|w| w.len()</code>.',
  ],
  inCpp: {
    code: `std::vector<int> w = {3, 1, 3};
std::sort(w.begin(), w.end(), [](int a, int b) { return a < b; });   // equal items may swap places`,
    note: 'C++ <code>std::sort</code> is not stable. Rust\'s <code>sort_by_key</code> is stable and <code>sort_unstable_by_key</code> is the opt-out.',
  },
  starter: 'fn by_length(words: &mut [String]) {\n    // shortest first, equal lengths keep their order\n}',
  solution: 'fn by_length(words: &mut [String]) {\n    words.sort_by_key(|w| w.len());\n}',
  harness: `fn harness_show(v: &[String]) -> String {
    v.join(" ")
}

fn harness_words(s: &str) -> Vec<String> {
    s.split_whitespace().map(|w| w.to_string()).collect()
}

fn main() {
    let cases = ["pear fig apple kiwi plum", "", "solo", "bb aa dd cc", "ccc a bb"];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        let mut v = harness_words(c);
        by_length(&mut v);
        println!("{}", harness_show(&v));
    }
}`,
  require: [{ pattern: '\\.sort_by_key\\s*\\(', message: 'Use sort_by_key.' }],
  tests: [
    { name: 'Mixed lengths, stable', input: 'pear fig apple kiwi plum', expected: 'fig pear kiwi plum apple' },
    { name: 'Empty list', input: '(empty)', expected: '' },
    { name: 'One word', input: 'solo', expected: 'solo' },
    { name: 'All the same length', input: 'bb aa dd cc', expected: 'bb aa dd cc' },
    { name: 'Descending lengths', input: 'ccc a bb', expected: 'a bb ccc' },
  ],
}

// ------------------------------------------------------------------------------------------
// 12. sort_by with then
// ------------------------------------------------------------------------------------------
const sortRecords = {
  id: 'r4-sort-records',
  title: 'Sort records with a tie-break',
  kind: 'implement',
  introduces: ['ordering-chain'],
  teach: {
    body: [
      `<p>Sometimes one key is not enough: sort by score, and when scores tie, by name. For that you write the whole comparison with <code>sort_by</code>. Its closure takes two items <code>a</code> and <code>b</code> and returns an <code>Ordering</code> (<code>Less</code>, <code>Equal</code> or <code>Greater</code>, from stage 3). You get one from <code>x.cmp(&amp;y)</code>. To sort from largest to smallest, swap the two sides: <code>b.score.cmp(&amp;a.score)</code> is <code>Less</code> when <code>b</code> has the smaller score, which puts the bigger one first.</p>`,
      `<p>To add a tie-break, chain with <code>.then(...)</code>: <code>first.then(second)</code> is <code>first</code> unless that is <code>Equal</code>, in which case it is <code>second</code>. So <code>b.score.cmp(&amp;a.score).then(a.name.cmp(&amp;b.name))</code> means "highest score first; for equal scores, name A to Z". You can chain as many as you like. <code>.then</code> computes its argument every time; <code>.then_with(|| ...)</code> takes a closure and only runs it when needed, which matters for an expensive comparison. In C++ you write the same thing as an <code>if</code> chain returning a <code>bool</code>; here each comparison is a value you can combine.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let mut words = vec!["pear", "fig", "apple", "kiwi", "plum"];
    // shortest first; equal lengths in alphabetical order
    words.sort_by(|a, b| a.len().cmp(&b.len()).then(a.cmp(b)));
    println!("{:?}", words);
    // longest first: swap a and b in the first comparison
    words.sort_by(|a, b| b.len().cmp(&a.len()).then(a.cmp(b)));
    println!("{:?}", words);
}`,
        output: '["fig", "kiwi", "pear", "plum", "apple"]\n["apple", "kiwi", "pear", "plum", "fig"]',
      },
    ],
    terms: [
      { code: 'x.cmp(&y)', meaning: 'compares two values and gives Less, Equal or Greater' },
      { code: 'b.cmp(&a)', meaning: 'the same comparison with the sides swapped: sorts largest first' },
      { code: 'first.then(second)', meaning: 'uses second only when first says Equal: a tie-break' },
    ],
  },
  task: 'Write <code>rank</code> so players are ordered by score, highest first, and players with equal scores by name, A to Z. Use <code>sort_by</code> with a comparator.',
  compare: {
    cpp: { code: `struct Player { std::string name; int score; };

void rank(std::vector<Player>& p) {
    std::sort(p.begin(), p.end(), [](const Player& a, const Player& b) {
        if (a.score != b.score) return a.score > b.score;
        return a.name < b.name;
    });
}`, outcome: 'Comparator returns bool', ok: true },
    rust: { code: `struct Player { name: String, score: u32 }

fn rank(p: &mut [Player]) {
    p.sort_by(|a, b| b.score.cmp(&a.score).then(a.name.cmp(&b.name)));
}`, outcome: 'Comparator returns an Ordering', ok: true },
    text: 'A C++ comparator returns a <code>bool</code>, so a tie-break is an <code>if</code>. A Rust comparator returns an <code>Ordering</code>, so <code>cmp</code> and <code>then</code> chain together.',
  },
  refresher: [
    '<code>v.sort_by(|a, b| ...)</code> takes a closure returning an <code>Ordering</code>; <code>x.cmp(&amp;y)</code> compares two values.',
    '<code>first.then(second)</code> uses <code>second</code> only when <code>first</code> is <code>Equal</code>.',
  ],
  hints: [
    'Compare the scores of <code>b</code> and <code>a</code> (reversed order) to get highest first.',
    'Chain the name comparison with <code>.then(...)</code>.',
    'Names are <code>String</code>s: <code>a.name.cmp(&amp;b.name)</code> compares them alphabetically.',
  ],
  inCpp: {
    code: `struct P { int score; std::string name; };
bool before(const P& a, const P& b) {
    if (a.score != b.score) return a.score > b.score;
    return a.name < b.name;   // forget the first line and ties are ordered wrongly
}`,
    note: 'A bool comparator that is not a strict ordering is undefined behaviour in <code>std::sort</code>. An <code>Ordering</code> chain has no such trap.',
  },
  starter: 'struct Player {\n    name: String,\n    score: u32,\n}\n\nfn rank(players: &mut [Player]) {\n    // highest score first, ties by name\n}',
  solution: 'struct Player {\n    name: String,\n    score: u32,\n}\n\nfn rank(players: &mut [Player]) {\n    players.sort_by(|a, b| b.score.cmp(&a.score).then(a.name.cmp(&b.name)));\n}',
  harness: `fn harness_player(name: &str, score: u32) -> Player {
    Player { name: name.to_string(), score }
}

fn harness_show(v: &[Player]) -> String {
    v.iter().map(|p| format!("{}:{}", p.name, p.score)).collect::<Vec<_>>().join(" ")
}

fn main() {
    let cases: Vec<Vec<Player>> = vec![
        vec![harness_player("bo", 5), harness_player("al", 9), harness_player("cy", 7)],
        vec![],
        vec![harness_player("zed", 1)],
        vec![harness_player("mia", 5), harness_player("ann", 5), harness_player("kit", 5)],
        vec![harness_player("b", 3), harness_player("a", 3), harness_player("c", 8), harness_player("d", 3)],
    ];
    for (i, mut v) in cases.into_iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        rank(&mut v);
        println!("{}", harness_show(&v));
    }

    println!("\\n@@TEST 6@@");
    let mut state = 4242u64;
    let mut v: Vec<Player> = (0..500)
        .map(|i| {
            state = state.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
            let score = ((state >> 33) % 20) as u32;
            harness_player(&format!("p{:03}", (i * 37) % 500), score)
        })
        .collect();
    rank(&mut v);
    let ordered = v.windows(2).all(|w| w[0].score > w[1].score || (w[0].score == w[1].score && w[0].name < w[1].name));
    println!("{}", if ordered && v.len() == 500 { "ordered" } else { "not ordered" });
}`,
  require: [{ pattern: '\\.sort_by\\s*\\(', message: 'Use sort_by with a comparator.' }],
  tests: [
    { name: 'Distinct scores', input: 'bo 5, al 9, cy 7', expected: 'al:9 cy:7 bo:5' },
    { name: 'Empty list', input: '(empty)', expected: '' },
    { name: 'One player', input: 'zed 1', expected: 'zed:1' },
    { name: 'All scores equal', input: 'mia 5, ann 5, kit 5', expected: 'ann:5 kit:5 mia:5' },
    { name: 'Mixed ties', input: 'b 3, a 3, c 8, d 3', expected: 'c:8 a:3 b:3 d:3' },
    { name: 'Large generated list', input: '500 players', expected: 'ordered' },
  ],
}

// ------------------------------------------------------------------------------------------
// 13. Binary search
// ------------------------------------------------------------------------------------------
const binarySearchLesson = {
  id: 'r4-binary-search',
  title: 'Binary search',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>If a slice is sorted you can find an item without looking at all of them. Look at the middle item. If it is the target, done. If it is smaller than the target, the target can only be in the right half; if bigger, only in the left half. Throw the wrong half away and repeat. Each step halves the search, so a million items take about twenty steps. The slice <em>must</em> be sorted, or the answer is meaningless.</p>`,
      `<p>The classic bug is in how you describe "the part still to search". Use a <em>half-open</em> range <code>lo..hi</code>: it includes <code>lo</code> and excludes <code>hi</code>, like <code>0..v.len()</code>. Start with <code>lo = 0</code> and <code>hi = v.len()</code>, and loop while <code>lo &lt; hi</code> (the range is not empty). The middle is <code>mid = lo + (hi - lo) / 2</code>. If <code>v[mid]</code> is too small, the target is at <code>mid + 1</code> or later, so <code>lo = mid + 1</code>. If it is too big, <code>mid</code> is already outside what could hold the target, so <code>hi = mid</code> (the range excludes <code>hi</code>, so no <code>- 1</code> is needed, and none can underflow).</p>`,
      `<p>Trace on <code>[1, 3, 5, 7, 9]</code> looking for 7: <code>lo = 0, hi = 5</code>, mid is 2 and <code>v[2] = 5</code> is too small, so <code>lo = 3</code>; mid is 4, <code>v[4] = 9</code> is too big, so <code>hi = 4</code>; mid is 3, <code>v[3] = 7</code>: found at index 3. Looking for 4 instead: mid 2 (5, too big) gives <code>hi = 2</code>; mid 1 (3, too small) gives <code>lo = 2</code>; now <code>lo == hi</code>, the range is empty, the answer is "not found".</p>`,
      `<p>The result type says exactly that: <code>Option&lt;usize&gt;</code>, <code>Some(index)</code> when found and <code>None</code> when not, instead of the C++ habit of returning -1. The example below plays the same halving game on a plain number range: guessing a secret number between 0 and 99.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let secret = 37;
    let (mut lo, mut hi) = (0, 100);       // the half-open range 0..100
    let mut guesses = 0;
    while lo < hi {                        // while the range is not empty
        let mid = lo + (hi - lo) / 2;
        guesses += 1;
        if mid == secret {
            break;
        } else if mid < secret {
            lo = mid + 1;                  // too small: look right of mid
        } else {
            hi = mid;                      // too big: mid itself is excluded
        }
    }
    println!("found after {} guesses", guesses);
}`,
        output: 'found after 6 guesses',
        caption: 'About log2(100) steps. Searching a sorted slice is the same loop with <code>v[mid]</code> instead of <code>mid</code>.',
      },
    ],
    terms: [
      { code: 'lo..hi', meaning: 'a half-open range: includes lo, excludes hi; empty when lo == hi' },
      { code: 'mid = lo + (hi - lo) / 2', meaning: 'the middle of the range, written so lo + hi can never overflow' },
      { code: 'Option<usize>', meaning: 'Some(index) when found, None when absent' },
    ],
  },
  task: 'Write <code>binary_search</code>: return <code>Some(index)</code> of <code>target</code> in a sorted slice, or <code>None</code> when it is absent. If it occurs several times, any index will do.',
  compare: {
    cpp: { code: `int binary_search_idx(const std::vector<int>& v, int target) {
    int lo = 0, hi = (int)v.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (v[mid] == target) return mid;
        if (v[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}`, outcome: 'Inclusive range, -1 for absent', ok: true },
    rust: { code: `fn find(v: &[i32], target: i32) -> Option<usize> {
    let (mut lo, mut hi) = (0, v.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if v[mid] == target {
            return Some(mid);
        } else if v[mid] < target {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    None
}
println!("{:?}", find(&[1, 3, 5], 3));`, outcome: 'Prints Some(1)', ok: true },
    text: 'The C++ version uses an inclusive <code>[lo, hi]</code> range and signed <code>hi - 1</code>, which would break with <code>size_t</code>. The Rust version uses a half-open range and <code>Option</code> instead of <code>-1</code>.',
  },
  refresher: [
    '<code>Some(i)</code> for found and <code>None</code> for not found replaces returning <code>-1</code>.',
    'A half-open range <code>lo..hi</code> never needs <code>hi - 1</code>, so a <code>usize</code> cannot underflow.',
  ],
  hints: [
    'Start with <code>lo = 0</code> and <code>hi = v.len()</code>; loop while <code>lo &lt; hi</code>.',
    'Probe <code>mid = lo + (hi - lo) / 2</code>. If it is too small move <code>lo</code> to <code>mid + 1</code>, otherwise set <code>hi = mid</code>.',
    'Return <code>Some(mid)</code> on a match. When the loop ends without one, the answer is <code>None</code>.',
  ],
  inCpp: {
    code: `std::vector<int> v;                 // empty
size_t lo = 0, hi = v.size() - 1;     // hi wraps to a huge number
while (lo <= hi) { break; }`,
    note: 'The inclusive style needs <code>size() - 1</code>, which wraps on an empty vector and sends the C++ search off the end. Half-open ranges avoid it.',
  },
  starter: 'fn binary_search(v: &[i32], target: i32) -> Option<usize> {\n    None\n}',
  solution: 'fn binary_search(v: &[i32], target: i32) -> Option<usize> {\n    let (mut lo, mut hi) = (0, v.len());\n    while lo < hi {\n        let mid = lo + (hi - lo) / 2;\n        if v[mid] == target {\n            return Some(mid);\n        } else if v[mid] < target {\n            lo = mid + 1;\n        } else {\n            hi = mid;\n        }\n    }\n    None\n}',
  harness: `fn harness_show(v: &[i32], target: i32) -> String {
    match binary_search(v, target) {
        Some(i) if v[i] == target => format!("Some({})", i),
        Some(_) => "Some(wrong index)".to_string(),
        None => "None".to_string(),
    }
}

fn main() {
    let v = [1, 3, 5, 7, 9];
    let one = [4];
    let queries: Vec<(&[i32], i32)> = vec![
        (&v, 7),
        (&[], 4),
        (&one, 4),
        (&one, 1),
        (&v, 1),
        (&v, 9),
        (&v, 4),
        (&v, 10),
        (&v, 0),
    ];
    for (i, (s, t)) in queries.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", harness_show(s, *t));
    }

    println!("\\n@@TEST 10@@");
    let dup = [1, 2, 2, 2, 3];
    match binary_search(&dup, 2) {
        Some(i) if dup[i] == 2 => println!("found"),
        other => println!("wrong: {:?}", other),
    }

    println!("\\n@@TEST 11@@");
    let big: Vec<i32> = (0..50000).map(|i| i * 2).collect();
    let mut ok = true;
    for t in -3..100004 {
        let expect = if t >= 0 && t % 2 == 0 && t < 100000 { Some((t / 2) as usize) } else { None };
        if binary_search(&big, t) != expect {
            ok = false;
        }
    }
    println!("{}", if ok { "all correct" } else { "some answers wrong" });
}`,
  forbidden: noStdSearch,
  tests: [
    { name: 'Found in the middle', input: '[1 3 5 7 9], 7', expected: 'Some(3)' },
    { name: 'Empty slice', input: '[], 4', expected: 'None' },
    { name: 'One item, found', input: '[4], 4', expected: 'Some(0)' },
    { name: 'One item, too small', input: '[4], 1', expected: 'None' },
    { name: 'First item', input: '[1 3 5 7 9], 1', expected: 'Some(0)' },
    { name: 'Last item', input: '[1 3 5 7 9], 9', expected: 'Some(4)' },
    { name: 'Missing, in between', input: '[1 3 5 7 9], 4', expected: 'None' },
    { name: 'Missing, above all', input: '[1 3 5 7 9], 10', expected: 'None' },
    { name: 'Missing, below all', input: '[1 3 5 7 9], 0', expected: 'None' },
    { name: 'Duplicates', input: '[1 2 2 2 3], 2', expected: 'found' },
    { name: 'Large sorted slice', input: '50 000 even numbers', expected: 'all correct' },
  ],
}

// ------------------------------------------------------------------------------------------
// 14. Lower and upper bound
// ------------------------------------------------------------------------------------------
const lowerUpper = {
  id: 'r4-lower-upper-bound',
  title: 'Lower and upper bound',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Plain binary search answers "is it there?". Often you want to know <em>where it belongs</em>, or how many copies there are. Two answers cover it. <code>lower_bound(target)</code> is the first index whose value is <code>&gt;= target</code>. <code>upper_bound(target)</code> is the first index whose value is <code>&gt; target</code>. Both can be <code>v.len()</code> when no such item exists. They are plain <code>usize</code> positions, so they never need an <code>Option</code>.</p>`,
      `<p>Another way to see them: <code>lower_bound</code> is the <em>number of items smaller than</em> <code>target</code>, and <code>upper_bound</code> is the number of items smaller than or equal to it. In <code>[1, 2, 2, 2, 4, 4, 7]</code> with target 2, lower is 1 (one item below 2) and upper is 4 (four items up to and including 2), so there are <code>4 - 1 = 3</code> copies. For a target that is missing, such as 3, both give 4, the position where 3 would be inserted to keep the slice sorted.</p>`,
      `<p>The search is the same halving loop on <code>lo..hi</code>, but it never stops early on a match. It keeps shrinking until <code>lo == hi</code> and returns <code>lo</code>. The two functions differ in a single comparison. For lower bound, an item <code>&lt; target</code> is "too small, go right": <code>lo = mid + 1</code>, otherwise <code>hi = mid</code>. For upper bound, an item <code>&lt;= target</code> counts as too small.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let v = [1, 2, 2, 2, 4, 4, 7];
    let mut below = 0;                      // items < 2: this is lower_bound(2)
    let mut up_to = 0;                      // items <= 2: this is upper_bound(2)
    for i in 0..v.len() {
        if v[i] < 2 {
            below += 1;
        }
        if v[i] <= 2 {
            up_to += 1;
        }
    }
    println!("{} {} copies: {}", below, up_to, up_to - below);
}`,
        output: '1 4 copies: 3',
        caption: 'A slow way to get the same numbers. Your loop must find them by halving, not counting.',
      },
    ],
    terms: [
      { code: 'lower_bound(t)', meaning: 'first index with value >= t; the count of items below t' },
      { code: 'upper_bound(t)', meaning: 'first index with value > t; the count of items up to and including t' },
      { code: 'upper - lower', meaning: 'how many copies of t the slice holds' },
    ],
  },
  task: 'Write <code>lower_bound</code> (first index with value <code>&gt;= target</code>) and <code>upper_bound</code> (first index with value <code>&gt; target</code>) on a sorted slice. Return <code>v.len()</code> if none.',
  compare: {
    cpp: { code: `size_t lower_bound_idx(const std::vector<int>& v, int target) {
    return std::lower_bound(v.begin(), v.end(), target) - v.begin();
}
size_t upper_bound_idx(const std::vector<int>& v, int target) {
    return std::upper_bound(v.begin(), v.end(), target) - v.begin();
}`, outcome: 'Iterators, subtracted from begin()', ok: true },
    rust: { code: `fn lower_bound(v: &[i32], target: i32) -> usize {
    let (mut lo, mut hi) = (0, v.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if v[mid] < target {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    lo
}
println!("{}", lower_bound(&[1, 2, 2, 4], 2));`, outcome: 'Prints 1', ok: true },
    text: 'C++ returns iterators that you subtract from <code>begin()</code> to get an index. In Rust the answer is the index itself, and the standard library calls the general form <code>partition_point</code>.',
  },
  refresher: [
    'Both answers are insertion points: plain <code>usize</code> values, never an <code>Option</code>.',
    'The two functions differ only in the comparison: <code>&lt;</code> versus <code>&lt;=</code> against the target.',
  ],
  hints: [
    'Search the half-open range <code>lo..hi</code> starting from <code>0..v.len()</code>, and shrink it until <code>lo == hi</code>.',
    'For lower bound: if <code>v[mid] &lt; target</code>, everything up to <code>mid</code> is too small, so <code>lo = mid + 1</code>; otherwise <code>hi = mid</code>.',
    'Return <code>lo</code>. For upper bound change the test so equal values also count as "too small".',
  ],
  inCpp: {
    code: `std::vector<int> v = {1, 2, 4};
auto it = std::lower_bound(v.begin(), v.end(), 5);
std::cout << *it;   // it == end(): undefined behaviour`,
    note: 'Dereferencing a C++ iterator that equals <code>end()</code> is undefined behaviour. A Rust index of <code>v.len()</code> panics when used, and the code reads like a position.',
  },
  starter: 'fn lower_bound(v: &[i32], target: i32) -> usize {\n    0\n}\n\nfn upper_bound(v: &[i32], target: i32) -> usize {\n    0\n}',
  solution: 'fn lower_bound(v: &[i32], target: i32) -> usize {\n    let (mut lo, mut hi) = (0, v.len());\n    while lo < hi {\n        let mid = lo + (hi - lo) / 2;\n        if v[mid] < target {\n            lo = mid + 1;\n        } else {\n            hi = mid;\n        }\n    }\n    lo\n}\n\nfn upper_bound(v: &[i32], target: i32) -> usize {\n    let (mut lo, mut hi) = (0, v.len());\n    while lo < hi {\n        let mid = lo + (hi - lo) / 2;\n        if v[mid] <= target {\n            lo = mid + 1;\n        } else {\n            hi = mid;\n        }\n    }\n    lo\n}',
  harness: `fn harness_pair(v: &[i32], t: i32) -> String {
    format!("{} {}", lower_bound(v, t), upper_bound(v, t))
}

fn main() {
    let v = [1, 2, 2, 2, 4, 4, 7];
    let queries: Vec<(&[i32], i32)> = vec![
        (&v, 2),
        (&v, 3),
        (&v, 0),
        (&v, 8),
        (&v, 7),
        (&v, 4),
        (&[], 5),
        (&[5, 5, 5], 5),
    ];
    for (i, (s, t)) in queries.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", harness_pair(s, *t));
    }

    println!("\\n@@TEST 9@@");
    let mut state = 777u64;
    let mut big: Vec<i32> = (0..20000)
        .map(|_| {
            state = state.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
            ((state >> 33) % 5000) as i32
        })
        .collect();
    big.sort();
    let mut ok = true;
    let mut t = -2;
    while t < 5003 {
        let lo = big.iter().filter(|&&x| x < t).count();
        let up = big.iter().filter(|&&x| x <= t).count();
        if lower_bound(&big, t) != lo || upper_bound(&big, t) != up {
            ok = false;
        }
        t += 7;
    }
    println!("{}", if ok { "all correct" } else { "some answers wrong" });
}`,
  forbidden: noStdSearch,
  tests: [
    { name: 'Value that repeats', input: '[1 2 2 2 4 4 7], 2', expected: '1 4' },
    { name: 'Value that is missing', input: '[1 2 2 2 4 4 7], 3', expected: '4 4' },
    { name: 'Below every item', input: '[1 2 2 2 4 4 7], 0', expected: '0 0' },
    { name: 'Above every item', input: '[1 2 2 2 4 4 7], 8', expected: '7 7' },
    { name: 'The last item', input: '[1 2 2 2 4 4 7], 7', expected: '6 7' },
    { name: 'Another repeat', input: '[1 2 2 2 4 4 7], 4', expected: '4 6' },
    { name: 'Empty slice', input: '[], 5', expected: '0 0' },
    { name: 'All items equal', input: '[5 5 5], 5', expected: '0 3' },
    { name: 'Large sorted slice', input: '20 000 numbers', expected: 'all correct' },
  ],
}

// ------------------------------------------------------------------------------------------
// 15. Bugfix: binary search underflow
// ------------------------------------------------------------------------------------------
const bugfixSearch = {
  id: 'r4-bugfix-binary-search-underflow',
  title: 'Fix the search that panics',
  kind: 'bugfix',
  introduces: [],
  task: 'This binary search panics with "attempt to subtract with overflow" on some inputs and misses items on others. Fix <code>find</code> without changing its signature.',
  refresher: [
    '<code>usize</code> cannot be negative: in a debug build <code>0 - 1</code> on a <code>usize</code> panics instead of wrapping.',
    'A range is either <em>half-open</em> (<code>lo..hi</code>, <code>hi</code> excluded) or <em>inclusive</em> (<code>lo..=hi</code>). Mixing the two conventions is the classic bug.',
  ],
  hints: [
    'Here <code>hi</code> starts at <code>v.len()</code>, which is one past the last item. Which convention is that?',
    'With that convention, when <code>v[mid]</code> is too big, <code>mid</code> itself is already excluded: <code>hi</code> can simply become <code>mid</code>.',
    'The change is on one line, and it also removes the subtraction that panics.',
  ],
  inCpp: {
    code: 'int find(const std::vector<int>& v, int target) {\n    size_t lo = 0, hi = v.size();\n    while (lo < hi) {\n        size_t mid = lo + (hi - lo) / 2;\n        if (v[mid] == target) return (int)mid;\n        if (v[mid] < target) lo = mid + 1; else hi = mid - 1;\n    }\n    return -1;\n}',
    note: 'The same bug in C++ with <code>size_t</code> does not panic: <code>mid - 1</code> wraps to a huge number and the loop quietly goes wrong or reads out of bounds.',
  },
  starter: 'fn find(v: &[i32], target: i32) -> Option<usize> {\n    let mut lo = 0;\n    let mut hi = v.len();\n    while lo < hi {\n        let mid = lo + (hi - lo) / 2;\n        if v[mid] == target {\n            return Some(mid);\n        } else if v[mid] < target {\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n    None\n}',
  solution: 'fn find(v: &[i32], target: i32) -> Option<usize> {\n    let mut lo = 0;\n    let mut hi = v.len();\n    while lo < hi {\n        let mid = lo + (hi - lo) / 2;\n        if v[mid] == target {\n            return Some(mid);\n        } else if v[mid] < target {\n            lo = mid + 1;\n        } else {\n            hi = mid;\n        }\n    }\n    None\n}',
  harness: `fn main() {
    let v = [10, 20, 30, 40, 50];
    let one = [10];
    let queries: Vec<(&[i32], i32)> = vec![
        (&v, 40),
        (&v, 50),
        (&v, 10),
        (&v, 25),
        (&[], 3),
        (&one, 5),
    ];
    for (i, (s, t)) in queries.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", find(s, *t));
    }
}`,
  forbidden: [{ pattern: '\\.(binary_search(_by(_key)?)?|partition_point)\\s*\\(', message: 'Fix the loop; do not replace it with the standard library search.' }],
  tests: [
    { name: 'Found near the end', input: '[10 20 30 40 50], 40', expected: 'Some(3)' },
    { name: 'Last item', input: '[10 20 30 40 50], 50', expected: 'Some(4)' },
    { name: 'First item', input: '[10 20 30 40 50], 10', expected: 'Some(0)' },
    { name: 'Missing, in between', input: '[10 20 30 40 50], 25', expected: 'None' },
    { name: 'Empty slice', input: '[], 3', expected: 'None' },
    { name: 'One item, too small', input: '[10], 5', expected: 'None' },
  ],
}

// ------------------------------------------------------------------------------------------
// 16. The standard library's binary_search
// ------------------------------------------------------------------------------------------
const stdSearch = {
  id: 'r4-std-search',
  title: 'The standard library search',
  kind: 'concept',
  introduces: [],
  teach: {
    body: [
      `<p>Having written binary search by hand, you can now meet the library version. <code>v.binary_search(&amp;x)</code> searches a sorted slice and returns a <code>Result&lt;usize, usize&gt;</code> (from stage 3). <code>Ok(i)</code> means "found at index <code>i</code>" (with duplicates it may be any of them). <code>Err(i)</code> means "not found, but <code>i</code> is where it would have to be inserted to keep the slice sorted". Using <code>Result</code> here is a bit unusual: neither side is an error. It is simply two different answers, and <code>match</code> forces you to handle both.</p>`,
      `<p>That insertion point is what makes the function useful beyond lookup. To keep a <code>Vec</code> sorted as you add items, find the position and call <code>v.insert(pos, x)</code>, which puts <code>x</code> at position <code>pos</code> and shifts the later items one place right (like C++ <code>v.insert(v.begin() + pos, x)</code>). Whether the item was found or not, the right position is the number inside <code>Ok</code> or <code>Err</code>, so a <code>match</code> with two arms that both give back <code>i</code> does the job. The other library tool is <code>v.partition_point(|x| *x &lt; t)</code>: it returns the first index where the closure turns false, which is your <code>lower_bound</code> from the last lessons.</p>`,
      `<p>A reminder that goes for every one of these: the slice must already be sorted. Called on unsorted data, <code>binary_search</code> still returns an answer; it is just a wrong one, and nothing warns you.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let v = vec![1, 3, 5, 7, 9];
    match v.binary_search(&7) {
        Ok(i) => println!("found at {}", i),
        Err(i) => println!("not found, insert at {}", i),
    }
    match v.binary_search(&4) {
        Ok(i) => println!("found at {}", i),
        Err(i) => println!("not found, insert at {}", i),
    }
    println!("{}", v.partition_point(|x| *x < 5));   // the lower_bound of 5
}`,
        output: 'found at 3\nnot found, insert at 2\n2',
      },
    ],
    terms: [
      { code: 'v.binary_search(&x)', meaning: 'Ok(index) if found, Err(insertion point) if not; the slice must be sorted' },
      { code: 'v.partition_point(|x| *x < t)', meaning: 'the first index where the closure is false: a general lower_bound' },
      { code: 'v.insert(pos, x)', meaning: 'puts x at position pos, shifting later items right' },
    ],
  },
  task: 'Write <code>insert_sorted(v, x)</code>: put <code>x</code> into the sorted <code>Vec</code> at the right place using <code>binary_search</code>, so the vector stays sorted.',
  compare: {
    cpp: { code: `void insert_sorted(std::vector<int>& v, int x) {
    auto pos = std::lower_bound(v.begin(), v.end(), x);
    v.insert(pos, x);
}`, outcome: 'lower_bound gives the insert position', ok: true },
    rust: { code: `fn insert_sorted(v: &mut Vec<i32>, x: i32) {
    let pos = match v.binary_search(&x) {
        Ok(i) => i,
        Err(i) => i,
    };
    v.insert(pos, x);
}
let mut v = vec![1, 5];
insert_sorted(&mut v, 3);
println!("{:?}", v);`, outcome: 'Prints [1, 3, 5]', ok: true },
    text: 'C++ <code>std::binary_search</code> only returns a <code>bool</code>, so you use <code>lower_bound</code> for the position. Rust\'s version hands back the found index or the insertion point in one call.',
  },
  refresher: [
    '<code>v.binary_search(&amp;x)</code> gives <code>Ok(i)</code> when found and <code>Err(i)</code> with the insertion point when not.',
    '<code>v.insert(pos, x)</code> inserts at a position, shifting the rest right.',
  ],
  hints: [
    'Match on <code>v.binary_search(&amp;x)</code>: both <code>Ok(i)</code> and <code>Err(i)</code> give a usable position <code>i</code>.',
    'Then call <code>v.insert(pos, x)</code> with that position.',
  ],
  inCpp: {
    code: `std::vector<int> v = {1, 3, 5};
bool found = std::binary_search(v.begin(), v.end(), 4);   // only true or false`,
    note: 'C++ <code>binary_search</code> says whether the item exists, not where it is or belongs. You reach for <code>lower_bound</code> for that.',
  },
  starter: `fn insert_sorted(v: &mut Vec<i32>, x: i32) {
    v.push(x);
}

fn main() {
    let mut v = vec![1, 3, 5, 9];
    insert_sorted(&mut v, 4);
    insert_sorted(&mut v, 0);
    insert_sorted(&mut v, 9);
    println!("{:?}", v);
}`,
  solution: `fn insert_sorted(v: &mut Vec<i32>, x: i32) {
    let pos = match v.binary_search(&x) {
        Ok(i) => i,
        Err(i) => i,
    };
    v.insert(pos, x);
}

fn main() {
    let mut v = vec![1, 3, 5, 9];
    insert_sorted(&mut v, 4);
    insert_sorted(&mut v, 0);
    insert_sorted(&mut v, 9);
    println!("{:?}", v);
}`,
  require: [{ pattern: '\\.binary_search\\s*\\(', message: 'Use binary_search.' }],
  tests: [{ name: 'Stays sorted', expected: '[0, 1, 3, 4, 5, 9, 9]' }],
}

export const LESSONS = [
  inPlace, bubbleSort, selectionSort, insertionSort, predictDown,
  mergeTwo, mergeSort, partitionLesson, quickSort, countingSort,
  sortByKey, sortRecords,
  binarySearchLesson, lowerUpper, bugfixSearch, stdSearch,
]
