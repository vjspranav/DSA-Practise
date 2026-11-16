// Rust lessons: stage 6 part B, standard collections (BTreeMap, BTreeSet, BinaryHeap, then the iterator and
// string toolbox, grids, mem::swap/take/replace and two bugfixes).
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end). Check with: node scripts/verify-rust.mjs --stage 6
// Ids must start with r6- and be unique across the track. Each lesson teaches the collection or methods it uses
// (`teach`), lists the syntax ids it introduces, and ends in a small drill that keeps the old harness and tests.

export const LESSONS = [
  // ---------------------------------------------------------------------------------------------
  // 14. BTreeMap basics
  {
    id: 'r6-btreemap-basics',
    title: 'BTreeMap: sorted for free',
    kind: 'drill',
    introduces: ['btree'],
    teach: {
      body: [
        `<p>A <code>BTreeMap&lt;K, V&gt;</code> is a map that keeps its keys <em>sorted</em>. It is <code>std::map</code>: a balanced search tree where insert, lookup and remove take O(log n), a little slower than a <code>HashMap</code>'s O(1), in exchange for order. The key type needs <code>Ord</code> (not <code>Hash</code>), so integers, <code>char</code>, <code>String</code>, tuples of those and your own types with <code>#[derive(Ord)]</code> all work. Import it with <code>use std::collections::BTreeMap;</code>.</p>`,
        `<p>The methods you learned for <code>HashMap</code> are the same here: <code>insert</code> (which returns the old value as an <code>Option</code>), <code>get(&amp;k)</code>, <code>contains_key</code>, <code>remove</code>, <code>len</code>, and the <code>entry(k).or_insert(0)</code> family. What changes is iteration. <code>for (k, v) in &amp;m</code> visits the pairs in ascending key order every time, <code>m.keys()</code> and <code>m.values()</code> are in key order too, and <code>{:?}</code> prints the map sorted, like <code>{1: 'a', 2: 'b'}</code>. So a result built from a <code>BTreeMap</code> is deterministic and needs no sorting step.</p>`,
        `<p>Which one to pick: use a <code>HashMap</code> when you only look keys up. Use a <code>BTreeMap</code> when you want to walk the keys in order, ask for the smallest or largest key, or look at a range of keys (the next lesson). The C++ habit of reaching for <code>std::map</code> by default is not needed: <code>HashMap</code> is the default in Rust, and <code>BTreeMap</code> is a deliberate choice.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::BTreeMap;

fn main() {
    let mut m: BTreeMap<i32, &str> = BTreeMap::new();
    m.insert(30, "c");
    m.insert(10, "a");
    m.insert(20, "b");
    println!("{:?}", m);                      // always in key order
    for (k, v) in &m {                        // visits pairs in ascending key order
        println!("{} {}", k, v);
    }
    println!("{:?} {:?}", m.get(&20), m.get(&99));
}`,
          output: '{10: "a", 20: "b", 30: "c"}\n10 a\n20 b\n30 c\nSome("b") None',
        },
        {
          code: `use std::collections::BTreeMap;

fn main() {
    let mut counts: BTreeMap<char, usize> = BTreeMap::new();
    for c in "banana".chars() {
        *counts.entry(c).or_insert(0) += 1;   // the same entry idiom as HashMap
    }
    println!("{:?}", counts);                 // no sorting step needed
}`,
          output: "{'a': 3, 'b': 1, 'n': 2}",
        },
      ],
      terms: [
        { code: 'BTreeMap::new()', meaning: 'an empty map that keeps its keys sorted (needs use std::collections::BTreeMap;)' },
        { code: 'for (k, v) in &m', meaning: 'visits the pairs in ascending key order' },
        { code: 'O(log n)', meaning: 'the cost of insert, get and remove in a BTreeMap' },
      ],
    },
    task: 'Write <code>count_sorted</code>: count how often each number occurs and return <code>(number, count)</code> pairs in ascending order of the number. Use a <code>BTreeMap</code> so that you do not need to sort.',
    refresher: [
      '<code>BTreeMap</code> has the same methods as <code>HashMap</code> but iterates in key order: <code>m.into_iter().collect()</code> is already sorted.',
      '<code>*m.entry(k).or_insert(0) += 1;</code> counts, exactly as with a <code>HashMap</code>.',
    ],
    hints: [
      'Swap <code>HashMap</code> for <code>BTreeMap</code> in the counting loop.',
      '<code>m.into_iter().collect()</code> into a <code>Vec&lt;(i32, usize)&gt;</code> gives the pairs in key order.',
    ],
    inCpp: {
      code: 'std::vector<int> nums;\nstd::map<int, size_t> m;\nfor (int n : nums) m[n]++;\nfor (auto& [k, v] : m) std::cout << k << " " << v << "\\n";   // already in order',
      note: '<code>std::map</code> and <code>BTreeMap</code> both iterate in key order. The difference is that Rust makes you opt in to the tree, because a hash table is the usual choice.',
    },
    starter: 'use std::collections::BTreeMap;\n\nfn count_sorted(nums: &[i32]) -> Vec<(i32, usize)> {\n    Vec::new()\n}',
    solution: `use std::collections::BTreeMap;

fn count_sorted(nums: &[i32]) -> Vec<(i32, usize)> {
    let mut m: BTreeMap<i32, usize> = BTreeMap::new();
    for &n in nums {
        *m.entry(n).or_insert(0) += 1;
    }
    m.into_iter().collect()
}`,
    harness: `fn main() {
    let cases: Vec<Vec<i32>> = vec![
        vec![3, 1, 3, 2, 3, 1],
        vec![],
        vec![5],
        vec![2, 2, 2, 2],
        vec![-1, 1, -1],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", count_sorted(c));
    }
}`,
    require: [{ pattern: 'BTreeMap', message: 'Use a BTreeMap' }],
    forbidden: [{ pattern: '\\.sort', message: 'No sorting needed: a BTreeMap keeps its keys in order.' }],
    tests: [
      { name: 'Example', input: '3 1 3 2 3 1', expected: '[(1, 2), (2, 1), (3, 3)]' },
      { name: 'Empty', input: '(empty)', expected: '[]' },
      { name: 'One item', input: '5', expected: '[(5, 1)]' },
      { name: 'All equal', input: '2 2 2 2', expected: '[(2, 4)]' },
      { name: 'Negatives', input: '-1 1 -1', expected: '[(-1, 2), (1, 1)]' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 15. BTreeMap: first, last, range
  {
    id: 'r6-btreemap',
    title: 'BTreeMap: first, last and range',
    kind: 'drill',
    introduces: ['btree'],
    teach: {
      body: [
        `<p>Sorted keys give a <code>BTreeMap</code> three things a hash map cannot do quickly. <code>m.first_key_value()</code> and <code>m.last_key_value()</code> return the entry with the smallest or largest key as an <code>Option&lt;(&amp;K, &amp;V)&gt;</code> (<code>None</code> when the map is empty), in O(log n). <code>m.pop_first()</code> and <code>m.pop_last()</code> do the same but <em>remove</em> the entry and return an owned <code>Option&lt;(K, V)&gt;</code>, so a <code>BTreeMap</code> can serve as a priority queue with unique keys. In C++ these are <code>*m.begin()</code> and <code>*m.rbegin()</code>, which are undefined on an empty map.</p>`,
        `<p><code>m.range(a..b)</code> visits only the entries whose keys fall in a range, in order: <code>range(10..20)</code> excludes 20, <code>range(10..=20)</code> includes it, <code>range(25..)</code> means 25 and above and <code>range(..25)</code> means below 25. It costs O(log n) to find the start plus one step per entry you actually visit. This replaces the pair of iterators from <code>lower_bound</code> and <code>upper_bound</code>.</p>`,
        `<p>These calls hand back <em>references</em> to keys and values, so the items are tuples of references, like <code>(&amp;i32, &amp;i32)</code>. A closure can take a tuple apart in its parameter list, and put <code>&amp;</code> in the pattern to copy the numbers out: <code>.map(|(&amp;k, &amp;v)| (k, v))</code> turns <code>(&amp;K, &amp;V)</code> into an owned <code>(K, V)</code>. To ignore one side, write <code>_</code> for it: <code>|(_, &amp;v)| v</code>. You can also build a map directly from pairs with <code>collect()</code>: <code>let m: BTreeMap&lt;i32, i32&gt; = pairs.iter().copied().collect();</code>. If a key repeats, the later pair overwrites the earlier one.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::BTreeMap;

fn main() {
    let mut m: BTreeMap<i32, i32> = BTreeMap::new();
    m.insert(5, 50);
    m.insert(1, 10);
    m.insert(9, 90);
    println!("{:?} {:?}", m.first_key_value(), m.last_key_value());   // smallest and largest key
    println!("{:?}", m.pop_first());     // removes and returns the smallest entry
    println!("{:?}", m);
}`,
          output: 'Some((1, 10)) Some((9, 90))\nSome((1, 10))\n{5: 50, 9: 90}',
        },
        {
          code: `use std::collections::BTreeMap;

fn main() {
    let m: BTreeMap<i32, char> = vec![(10, 'a'), (20, 'b'), (30, 'c'), (40, 'd')]
        .into_iter()
        .collect();
    for (k, v) in m.range(15..=30) {            // keys from 15 to 30, inclusive
        println!("{} {}", k, v);
    }
    let big: Vec<i32> = m.range(25..).map(|(&k, _)| k).collect();   // keys 25 and above
    println!("{:?}", big);
}`,
          output: '20 b\n30 c\n[30, 40]',
        },
      ],
      terms: [
        { code: 'm.first_key_value() / m.last_key_value()', meaning: 'Some((&key, &value)) of the smallest / largest key, or None' },
        { code: 'm.pop_first() / m.pop_last()', meaning: 'removes and returns the smallest / largest entry' },
        { code: 'm.range(a..=b)', meaning: 'iterates the entries whose key is in the range, in order' },
        { code: '|(&k, &v)| ...', meaning: 'a closure that takes a tuple of references apart and copies both out' },
      ],
    },
    task: 'Write <code>summarize</code>: collect the pairs into a <code>BTreeMap</code> (a repeated key keeps its last value) and return the first entry, the last entry, and the sum of the values whose keys are in <code>10..=20</code>.',
    refresher: [
      '<code>m.first_key_value()</code> and <code>m.last_key_value()</code> return <code>Option&lt;(&amp;K, &amp;V)&gt;</code>. Iteration is always in key order.',
      '<code>m.range(10..=20)</code> yields only the entries in that key range, in order. Collecting pairs into a map: later duplicates overwrite earlier ones.',
    ],
    hints: [
      'The first and last entries hold references: copy the numbers out, for example with <code>map(|(&amp;k, &amp;v)| (k, v))</code>.',
      '<code>range</code> takes a range of keys and yields <code>(&amp;K, &amp;V)</code>; sum the values.',
      'An empty map gives <code>None</code> for both ends and a sum of 0.',
    ],
    inCpp: {
      code: 'std::map<int, int> m;\nint lo = m.begin()->first;      // UB if empty\nint hi = m.rbegin()->first;\nauto a = m.lower_bound(10);\nauto b = m.upper_bound(20);',
      note: '<code>std::map</code> returns iterators, and <code>begin()</code> on an empty map must not be dereferenced. Rust returns an <code>Option</code> for the ends, and <code>range(10..=20)</code> replaces the <code>lower_bound</code>/<code>upper_bound</code> pair.',
    },
    starter: 'use std::collections::BTreeMap;\n\nfn summarize(pairs: &[(i32, i32)]) -> (Option<(i32, i32)>, Option<(i32, i32)>, i32) {\n    (None, None, 0)\n}',
    solution: `use std::collections::BTreeMap;

fn summarize(pairs: &[(i32, i32)]) -> (Option<(i32, i32)>, Option<(i32, i32)>, i32) {
    let m: BTreeMap<i32, i32> = pairs.iter().copied().collect();
    let first = m.first_key_value().map(|(&k, &v)| (k, v));
    let last = m.last_key_value().map(|(&k, &v)| (k, v));
    let sum: i32 = m.range(10..=20).map(|(_, &v)| v).sum();
    (first, last, sum)
}`,
    harness: `fn main() {
    let cases: Vec<Vec<(i32, i32)>> = vec![
        vec![(15, 1), (3, 2), (20, 3), (40, 4), (10, 5)],
        vec![],
        vec![(12, 7)],
        vec![(5, 1), (5, 2)],
        vec![(21, 1), (9, 1), (10, 4), (20, 6)],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", summarize(c));
    }
}`,
    require: [
      { pattern: 'BTreeMap', message: 'Use a BTreeMap' },
      { pattern: '\\.range\\(', message: 'Use range' },
    ],
    tests: [
      { name: 'Example', input: '(15,1) (3,2) (20,3) (40,4) (10,5)', expected: '(Some((3, 2)), Some((40, 4)), 9)' },
      { name: 'Empty', input: '(empty)', expected: '(None, None, 0)' },
      { name: 'One entry', input: '(12,7)', expected: '(Some((12, 7)), Some((12, 7)), 7)' },
      { name: 'Repeated key', input: '(5,1) (5,2)', expected: '(Some((5, 2)), Some((5, 2)), 0)' },
      { name: 'Range edges', input: '(21,1) (9,1) (10,4) (20,6)', expected: '(Some((9, 1)), Some((21, 1)), 10)' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 16. BTreeSet
  {
    id: 'r6-btreeset',
    title: 'BTreeSet: neighbours of a value',
    kind: 'drill',
    introduces: ['btree', 'use'],
    teach: {
      body: [
        `<p>A <code>BTreeSet&lt;T&gt;</code> is a set kept in sorted order: <code>std::set</code>. It offers <code>insert</code> (returns <code>bool</code>), <code>contains</code>, <code>remove</code> and <code>len</code> like a <code>HashSet</code>, in O(log n), plus order-based questions. Iterating it, or printing it with <code>{:?}</code>, gives the items ascending (<code>{10, 20, 30}</code>). <code>s.first()</code> and <code>s.last()</code> return the smallest and largest item as <code>Option&lt;&amp;T&gt;</code>, and <code>s.pop_first()</code> removes and returns the smallest. Collecting an iterator into a <code>BTreeSet</code> sorts and de-duplicates in one go.</p>`,
        `<p>The question this lesson is about: "what is the nearest item below <code>x</code>, and the nearest above?" (the predecessor and the successor). <code>s.range(..x)</code> iterates the items below <code>x</code> in order, and <code>s.range(x..)</code> the items from <code>x</code> up. A range is a <em>double-ended</em> iterator, so <code>.next()</code> takes its smallest item and <code>.next_back()</code> takes its largest. The predecessor is therefore <code>s.range(..x).next_back()</code>, the largest item below <code>x</code>, and the result is an <code>Option</code>: <code>None</code> when nothing is smaller. In C++ you combine <code>upper_bound</code>, <code>prev</code> and a check against <code>end()</code>, and one slip dereferences the end iterator.</p>`,
        `<p>The successor needs "strictly above <code>x</code>", but <code>x..</code> includes <code>x</code> itself. For that, give <code>range</code> a pair of bounds: <code>s.range((Excluded(x), Unbounded))</code>. <code>Bound</code> is an enum with the variants <code>Included(x)</code>, <code>Excluded(x)</code> and <code>Unbounded</code> (no limit on that side). They live in <code>std::ops::Bound</code>, and <code>use std::ops::Bound::{Excluded, Unbounded};</code> imports just those two variants (braces list several names, as before), so you can write them bare. (For integers you could also write <code>range(x + 1..)</code>, but that overflows at the maximum value, and it does not work for keys that are not numbers.)</p>`,
      ],
      examples: [
        {
          code: `use std::collections::BTreeSet;

fn main() {
    let s: BTreeSet<i32> = vec![30, 10, 20, 10].into_iter().collect();
    println!("{:?}", s);                           // {10, 20, 30}: sorted, no duplicates
    println!("{:?} {:?}", s.first(), s.last());    // Some(10) Some(30)
    println!("{:?}", s.range(..25).next_back());   // Some(20): the largest item below 25
    println!("{:?}", s.range(15..).next());        // Some(20): the smallest item from 15 up
    println!("{:?}", s.range(..5).next_back());    // None: nothing below 5
}`,
          output: '{10, 20, 30}\nSome(10) Some(30)\nSome(20)\nSome(20)\nNone',
        },
        {
          code: `use std::collections::BTreeSet;
use std::ops::Bound::{Excluded, Unbounded};

fn main() {
    let s: BTreeSet<i32> = vec![10, 20, 30].into_iter().collect();
    // "strictly above 20": start after 20, no upper limit
    println!("{:?}", s.range((Excluded(20), Unbounded)).next());   // Some(30)
    println!("{:?}", s.range(20..).next());                       // Some(20): 20.. includes 20
}`,
          output: 'Some(30)\nSome(20)',
        },
      ],
      terms: [
        { code: 's.first() / s.last()', meaning: 'smallest / largest item as Option<&T>' },
        { code: 's.range(..x)', meaning: 'iterator over items below x, in order (x.. means from x up)' },
        { code: '.next() / .next_back()', meaning: 'the first / last item of an iterator, as an Option' },
        { code: '(Excluded(x), Unbounded)', meaning: 'a pair of bounds: "strictly above x, no upper limit"' },
        { code: 'use std::ops::Bound::{Excluded, Unbounded};', meaning: 'imports two enum variants so they can be written bare' },
      ],
    },
    task: 'Write <code>neighbours</code>: put the items in a <code>BTreeSet</code> and return the largest item strictly below <code>x</code> and the smallest item strictly above it. Use <code>range</code>.',
    refresher: [
      '<code>s.range(..x)</code> yields items below <code>x</code> in order; <code>.next_back()</code> takes the largest. <code>s.range(x..)</code> includes <code>x</code> itself.',
      'For "strictly above" use bounds: <code>s.range((Excluded(x), Unbounded))</code> with <code>use std::ops::Bound::{Excluded, Unbounded};</code>.',
    ],
    hints: [
      'The predecessor is the last item of <code>range(..x)</code>. Ranges over a set are double-ended iterators.',
      'The successor is the first item after <code>x</code>. Skipping <code>x</code> itself needs an excluded lower bound.',
      'Both answers are <code>Option</code>: nothing below or above gives <code>None</code>.',
    ],
    inCpp: {
      code: 'std::set<int> s{10, 20, 30};\nauto hi = s.upper_bound(25);          // first > 25\nauto lo = (hi == s.begin()) ? s.end() : std::prev(hi);',
      note: 'In C++ you combine <code>upper_bound</code>, <code>prev</code> and an <code>end()</code> check, and one slip dereferences the end iterator. In Rust a range is an iterator you ask for its first or last item, and the answer is an <code>Option</code>.',
    },
    starter: 'use std::collections::BTreeSet;\nuse std::ops::Bound::{Excluded, Unbounded};\n\nfn neighbours(items: &[i32], x: i32) -> (Option<i32>, Option<i32>) {\n    (None, None)\n}',
    solution: `use std::collections::BTreeSet;
use std::ops::Bound::{Excluded, Unbounded};

fn neighbours(items: &[i32], x: i32) -> (Option<i32>, Option<i32>) {
    let s: BTreeSet<i32> = items.iter().copied().collect();
    let below = s.range(..x).next_back().copied();
    let above = s.range((Excluded(x), Unbounded)).next().copied();
    (below, above)
}`,
    harness: `fn main() {
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![10, 20, 30], 25),
        (vec![], 5),
        (vec![5], 5),
        (vec![4, 4, 9], 4),
        (vec![10, 20, 30], 5),
        (vec![10, 20, 30], 20),
    ];
    for (i, (v, x)) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", neighbours(v, *x));
    }
}`,
    require: [
      { pattern: 'BTreeSet', message: 'Use a BTreeSet' },
      { pattern: '\\.range\\(', message: 'Use range' },
    ],
    tests: [
      { name: 'Between two items', input: '[10,20,30], x=25', expected: '(Some(20), Some(30))' },
      { name: 'Empty set', input: '[], x=5', expected: '(None, None)' },
      { name: 'x is the only item', input: '[5], x=5', expected: '(None, None)' },
      { name: 'Duplicates', input: '[4,4,9], x=4', expected: '(None, Some(9))' },
      { name: 'Below everything', input: '[10,20,30], x=5', expected: '(None, Some(10))' },
      { name: 'x is in the set', input: '[10,20,30], x=20', expected: '(Some(10), Some(30))' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 17. BinaryHeap basics
  {
    id: 'r6-binaryheap-basics',
    title: 'BinaryHeap: the largest first',
    kind: 'drill',
    introduces: ['binaryheap'],
    teach: {
      body: [
        `<p>A <code>BinaryHeap&lt;T&gt;</code> is a priority queue: it always hands you the <em>largest</em> item first. It is <code>std::priority_queue</code>, a max-heap by default, and the items need <code>Ord</code>. Import it with <code>use std::collections::BinaryHeap;</code> and make one with <code>BinaryHeap::new()</code>. The cost: <code>push</code> and <code>pop</code> take O(log n), looking at the largest takes O(1).</p>`,
        `<p>The methods: <code>h.push(x)</code> adds an item. <code>h.pop()</code> removes the largest and returns it as an <code>Option</code> (<code>None</code> when empty; C++ <code>pop()</code> returns nothing and <code>top()</code> is undefined on an empty queue). <code>h.peek()</code> looks at the largest without removing it, as an <code>Option&lt;&amp;T&gt;</code>. <code>h.len()</code> and <code>h.is_empty()</code> work as usual. To build a heap from existing items in O(n), collect into one: <code>let h: BinaryHeap&lt;i32&gt; = v.iter().copied().collect();</code>, or call <code>BinaryHeap::from(vec)</code>. <code>h.into_sorted_vec()</code> consumes the heap and returns the items in ascending order.</p>`,
        `<p>Pitfall: the heap is <em>not</em> sorted inside. Only the largest is guaranteed to be easy to reach, so iterating over a heap, or printing it with <code>{:?}</code>, gives an unspecified order. To get items in order, <code>pop</code> them one by one. Another: items already in the heap cannot be changed in place, so to "update" a priority you push a new entry and ignore the stale one later.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::BinaryHeap;

fn main() {
    let mut h: BinaryHeap<i32> = BinaryHeap::new();
    h.push(3);
    h.push(9);
    h.push(5);
    println!("{:?}", h.peek());   // Some(9): the largest, left in place
    println!("{:?}", h.pop());    // Some(9): removed
    println!("{:?}", h.pop());    // Some(5)
    println!("{}", h.len());      // 1
}`,
          output: 'Some(9)\nSome(9)\nSome(5)\n1',
        },
        {
          code: `use std::collections::BinaryHeap;

fn main() {
    let h = BinaryHeap::from(vec![4, 1, 7, 3]);   // builds the heap in O(n)
    println!("{}", h.len());
    let sorted = h.into_sorted_vec();             // ascending order
    println!("{:?}", sorted);
}`,
          output: '4\n[1, 3, 4, 7]',
        },
      ],
      terms: [
        { code: 'BinaryHeap::new()', meaning: 'an empty max-heap (needs use std::collections::BinaryHeap;)' },
        { code: 'h.push(x)', meaning: 'adds an item; O(log n)' },
        { code: 'h.pop()', meaning: 'removes and returns Some(largest), or None if empty; O(log n)' },
        { code: 'h.peek()', meaning: 'looks at the largest without removing it: Option<&T>; O(1)' },
        { code: 'h.into_sorted_vec()', meaning: 'consumes the heap and returns its items in ascending order' },
      ],
    },
    task: 'Write <code>last_stone</code>: repeatedly take the two heaviest stones. If they weigh the same both vanish; otherwise the difference goes back. Return the weight of the last stone, or 0 if none is left. Use a <code>BinaryHeap</code>.',
    refresher: [
      '<code>BinaryHeap</code> is a max-heap: <code>pop()</code> returns <code>Option&lt;T&gt;</code>, the largest first. <code>peek()</code> looks without removing.',
      '<code>let h: BinaryHeap&lt;i32&gt; = v.iter().copied().collect();</code> builds a heap. Its iteration order is not sorted.',
    ],
    hints: [
      'Build the heap from the slice, then loop <code>while h.len() &gt; 1</code>.',
      'Pop two stones with <code>h.pop().unwrap()</code>; push <code>a - b</code> back only if they differ (<code>a</code> is the larger).',
      'At the end, <code>h.pop()</code> is the last stone, or <code>None</code> when the heap is empty.',
    ],
    inCpp: {
      code: 'std::vector<int> stones;\nstd::priority_queue<int> pq(stones.begin(), stones.end());\nint a = pq.top();   // UB if empty\npq.pop();           // returns void',
      note: 'Both are max-heaps. C++ splits reading and removing into <code>top()</code> and <code>pop()</code>, while Rust\'s <code>pop()</code> returns an <code>Option</code> that already holds the item.',
    },
    starter: 'use std::collections::BinaryHeap;\n\nfn last_stone(stones: &[i32]) -> i32 {\n    0\n}',
    solution: `use std::collections::BinaryHeap;

fn last_stone(stones: &[i32]) -> i32 {
    let mut h: BinaryHeap<i32> = stones.iter().copied().collect();
    while h.len() > 1 {
        let a = h.pop().unwrap();
        let b = h.pop().unwrap();
        if a != b {
            h.push(a - b);
        }
    }
    h.pop().unwrap_or(0)
}`,
    harness: `fn main() {
    let cases: Vec<Vec<i32>> = vec![
        vec![2, 7, 4, 1, 8, 1],
        vec![],
        vec![5],
        vec![3, 3],
        vec![10, 4, 3],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", last_stone(c));
    }
}`,
    require: [
      { pattern: 'BinaryHeap', message: 'Use a BinaryHeap' },
      { pattern: '\\.pop\\(', message: 'Use pop' },
    ],
    forbidden: [{ pattern: '\\.sort|into_sorted_vec', message: 'Let the heap do the ordering: no sorting.' }],
    tests: [
      { name: 'Example', input: '[2,7,4,1,8,1]', expected: '1' },
      { name: 'No stones', input: '[]', expected: '0' },
      { name: 'One stone', input: '[5]', expected: '5' },
      { name: 'Equal pair', input: '[3,3]', expected: '0' },
      { name: 'Three stones', input: '[10,4,3]', expected: '3' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 18. BinaryHeap as a min-heap: Reverse
  {
    id: 'r6-binaryheap',
    title: 'BinaryHeap and Reverse',
    kind: 'drill',
    introduces: ['binaryheap'],
    teach: {
      body: [
        `<p>A <code>BinaryHeap</code> always gives the largest item first. For the smallest first (a min-heap, which Dijkstra's algorithm and "k smallest" problems need), wrap the items in <code>std::cmp::Reverse</code>. <code>Reverse(x)</code> is a tiny wrapper around <code>x</code> whose comparison is flipped: a bigger number inside means "smaller" outside. So a max-heap of <code>Reverse</code> values is a min-heap. Import it with <code>use std::cmp::Reverse;</code>. C++ does the same with a third template argument: <code>std::priority_queue&lt;int, std::vector&lt;int&gt;, std::greater&lt;int&gt;&gt;</code>.</p>`,
        `<p>You push <code>Reverse(x)</code> and you get <code>Reverse(x)</code> back, so unwrap it. <code>Reverse</code> is a one-field struct, and a pattern can take it apart like a tuple: <code>if let Some(Reverse(x)) = h.pop() { ... }</code> pulls out <code>x</code>. Or use <code>.0</code>, the field access you know from tuples: <code>h.pop().map(|r| r.0)</code>.</p>`,
        `<p>The usual real-world shape is a <em>tuple</em> whose first field is the priority: <code>h.push((Reverse(distance), node))</code>. Tuples compare field by field, so the heap orders by smallest distance first and breaks ties with the node. <code>Reverse</code> works anywhere an order is needed, not only in heaps: <code>v.sort_by_key(|&amp;x| Reverse(x))</code> sorts descending, which a plain <code>sort_by_key</code> cannot do on its own. (<code>sort_by_key</code> is from the sort lesson earlier in this stage.)</p>`,
      ],
      examples: [
        {
          code: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn main() {
    let mut h = BinaryHeap::new();
    h.push(Reverse(5));
    h.push(Reverse(1));
    h.push(Reverse(3));
    if let Some(Reverse(x)) = h.pop() {     // the pattern takes the wrapper apart
        println!("smallest {}", x);
    }
    println!("{:?}", h.peek());             // Some(Reverse(3))
}`,
          output: 'smallest 1\nSome(Reverse(3))',
        },
        {
          code: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn main() {
    let mut h = BinaryHeap::new();
    h.push((Reverse(7), "far"));            // (priority, payload)
    h.push((Reverse(2), "near"));
    println!("{:?}", h.pop().map(|(Reverse(d), name)| (d, name)));   // Some((2, "near"))

    let mut v = vec![2, 9, 4];
    v.sort_by_key(|&x| Reverse(x));         // descending, using the sort_by_key from before
    println!("{:?}", v);
}`,
          output: 'Some((2, "near"))\n[9, 4, 2]',
        },
      ],
      terms: [
        { code: 'Reverse(x)', meaning: 'a wrapper that flips the order, so a max-heap acts as a min-heap' },
        { code: 'use std::cmp::Reverse;', meaning: 'brings Reverse into scope' },
        { code: 'Some(Reverse(x))', meaning: 'a pattern that unwraps the popped item (or use .0)' },
        { code: '(Reverse(dist), node)', meaning: 'a tuple heap entry: ordered by smallest dist, then by node' },
      ],
    },
    task: 'Write <code>k_smallest</code>: return the <code>k</code> smallest numbers in ascending order (all of them if there are fewer than <code>k</code>). Use a <code>BinaryHeap</code> as a min-heap with <code>Reverse</code>.',
    refresher: [
      '<code>BinaryHeap</code> is a <em>max</em>-heap: <code>pop()</code> returns <code>Option&lt;T&gt;</code>, the largest first. <code>peek()</code> looks without removing.',
      'Wrap items in <code>std::cmp::Reverse</code> to flip the order: push <code>Reverse(x)</code>, and pattern-match <code>Some(Reverse(x))</code> when popping.',
    ],
    hints: [
      'Build a <code>BinaryHeap&lt;Reverse&lt;i32&gt;&gt;</code> from all the numbers.',
      'Pop at most <code>k</code> times; <code>pop</code> returns <code>None</code> when the heap runs out.',
      '<code>Reverse</code> is a tuple struct: <code>Some(Reverse(x))</code> unwraps it in one pattern.',
    ],
    inCpp: {
      code: 'std::vector<int> nums;\nstd::priority_queue<int, std::vector<int>, std::greater<int>> pq;\nfor (int x : nums) pq.push(x);\nint smallest = pq.top();   // UB if empty\npq.pop();                  // returns void',
      note: 'Both are max-heaps by default. C++ switches to a min-heap with a comparator template argument; Rust wraps the item in <code>Reverse</code>, and <code>pop</code> returns an <code>Option</code> that already holds the item.',
    },
    starter: 'use std::cmp::Reverse;\nuse std::collections::BinaryHeap;\n\nfn k_smallest(nums: &[i32], k: usize) -> Vec<i32> {\n    Vec::new()\n}',
    solution: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn k_smallest(nums: &[i32], k: usize) -> Vec<i32> {
    let mut h: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
    for &x in nums {
        h.push(Reverse(x));
    }
    let mut out = Vec::new();
    for _ in 0..k {
        match h.pop() {
            Some(Reverse(x)) => out.push(x),
            None => break,
        }
    }
    out
}`,
    harness: `fn harness_show(v: &[i32]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
}

fn main() {
    let cases: Vec<(Vec<i32>, usize)> = vec![
        (vec![5, 1, 4, 2, 3], 3),
        (vec![], 2),
        (vec![7], 1),
        (vec![2, 2, 1, 2], 3),
        (vec![3, 1], 5),
    ];
    for (i, (v, k)) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", harness_show(&k_smallest(v, *k)));
    }
}`,
    require: [
      { pattern: 'BinaryHeap', message: 'Use a BinaryHeap' },
      { pattern: 'Reverse', message: 'Use Reverse' },
    ],
    forbidden: [{ pattern: '\\.sort|into_sorted_vec|into_iter_sorted', message: 'Let the heap do the ordering: no sorting.' }],
    tests: [
      { name: 'Example', input: '[5,1,4,2,3], k=3', expected: '1 2 3' },
      { name: 'Empty', input: '[], k=2', expected: '' },
      { name: 'One item', input: '[7], k=1', expected: '7' },
      { name: 'Duplicates', input: '[2,2,1,2], k=3', expected: '1 2 2' },
      { name: 'k larger than input', input: '[3,1], k=5', expected: '1 3' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 19. strings: split, parse, chars
  {
    id: 'r6-string-processing',
    title: 'Strings: chars, split, parse',
    kind: 'drill',
    introduces: ['string-methods', 'chars-bytes'],
    teach: {
      body: [
        `<p>Most input handling is "cut a line into pieces and make sense of each one". <code>line.split_whitespace()</code> is an iterator over the words of a line, split at any run of spaces, tabs or newlines, so repeated spaces and leading or trailing spaces produce no empty pieces. Each piece is a <code>&amp;str</code> that borrows from the line. (<code>line.split(',')</code> splits at one specific character and does keep empty pieces; <code>line.trim()</code> strips surrounding whitespace.) C++ needs an <code>istringstream</code> and <code>&gt;&gt;</code> for the same job.</p>`,
        `<p><code>tok.parse::&lt;i32&gt;()</code> tries to read the text as an <code>i32</code> and returns a <code>Result</code>: <code>Ok(n)</code> when it worked and <code>Err(_)</code> when it did not (no exception, no half-read value). <code>"-5"</code> parses and <code>"apple"</code> does not. So <code>match tok.parse::&lt;i32&gt;() { Ok(n) =&gt; ..., Err(_) =&gt; ... }</code> separates numbers from words.</p>`,
        `<p>A string is UTF-8 bytes, so you do not index into it by position. To get at characters, use <code>.chars()</code>. <code>tok.chars().next()</code> is the first character as an <code>Option&lt;char&gt;</code> (<code>None</code> for an empty string), and <code>tok.chars().rev()</code> runs backwards. To build a <code>String</code> character by character, make an empty one with <code>String::new()</code> and call <code>s.push(c)</code>: <code>push</code> appends one <code>char</code>, whereas <code>push_str</code> appends a whole <code>&amp;str</code>. A <code>String</code> can also be collected straight from an iterator of characters: <code>word.chars().rev().collect::&lt;String&gt;()</code>. <code>format!("{}:{}", a, b)</code> builds a new <code>String</code> from pieces.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let line = "  3 apples 4  ";
    for tok in line.split_whitespace() {          // "3", "apples", "4"
        match tok.parse::<i32>() {                // a Result: Ok(number) or Err(_)
            Ok(n) => println!("number {}", n),
            Err(_) => println!("word {}", tok),
        }
    }
}`,
          output: 'number 3\nword apples\nnumber 4',
        },
        {
          code: `fn main() {
    let word = "rust";
    println!("{:?}", word.chars().next());          // Some('r')
    println!("{:?}", "".chars().next());            // None
    let mut s = String::new();
    s.push('a');                                    // push adds one char
    s.push_str("bc");                               // push_str adds text
    println!("{}", s);
    let rev: String = word.chars().rev().collect(); // the characters backwards
    println!("{}", rev);
}`,
          output: 'Some(\'r\')\nNone\nabc\ntsur',
        },
      ],
      terms: [
        { code: 's.split_whitespace()', meaning: 'iterator over the words, splitting at any run of whitespace' },
        { code: 'tok.parse::<i32>()', meaning: 'Ok(number) if the text is a valid i32, otherwise Err(_)' },
        { code: 's.chars().next()', meaning: 'the first character as Option<char>' },
        { code: 's.push(c)', meaning: 'appends one char to a String (push_str appends text)' },
        { code: 's.chars().rev().collect::<String>()', meaning: 'the characters in reverse order as a new String' },
      ],
    },
    task: 'Write <code>digest</code>: sum every token of the line that parses as an <code>i32</code>; build a <code>String</code> from the first character of every other token. Return <code>"sum:initials"</code>, for example <code>"7:aap"</code>.',
    refresher: [
      '<code>line.split_whitespace()</code> yields <code>&amp;str</code> tokens and skips repeated spaces. <code>tok.parse::&lt;i32&gt;()</code> returns a <code>Result</code>.',
      '<code>tok.chars().next()</code> is an <code>Option&lt;char&gt;</code>. <code>s.push(c)</code> appends a char; <code>format!</code> builds a <code>String</code>.',
    ],
    hints: [
      'Match on the parse result: <code>Ok(n)</code> adds to the sum, <code>Err(_)</code> goes to the initials.',
      'Strings are UTF-8, so take the first character with <code>chars()</code>, not by indexing.',
      'Finish with <code>format!("{}:{}", sum, initials)</code>.',
    ],
    inCpp: {
      code: 'std::string line;\nint sum = 0;\nstd::string initials;\nstd::istringstream in(line);\nstd::string tok;\nwhile (in >> tok) {\n    try { sum += std::stoi(tok); }\n    catch (...) { initials += tok[0]; }\n}',
      note: 'C++ uses a stream and an exception to tell numbers from words. Rust splits lazily and <code>parse</code> returns a <code>Result</code> you match on, so failure is an ordinary value.',
    },
    starter: 'fn digest(line: &str) -> String {\n    String::new()\n}',
    solution: `fn digest(line: &str) -> String {
    let mut sum = 0;
    let mut initials = String::new();
    for tok in line.split_whitespace() {
        match tok.parse::<i32>() {
            Ok(n) => sum += n,
            Err(_) => {
                if let Some(c) = tok.chars().next() {
                    initials.push(c);
                }
            }
        }
    }
    format!("{}:{}", sum, initials)
}`,
    harness: `fn main() {
    let cases = ["3 apples and 4 pears", "", "-5", "x x x", "  10   20  "];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", digest(c));
    }
}`,
    require: [
      { pattern: 'split_whitespace', message: 'Use split_whitespace' },
      { pattern: 'parse', message: 'Use parse' },
    ],
    tests: [
      { name: 'Example', input: '3 apples and 4 pears', expected: '7:aap' },
      { name: 'Empty line', input: '(empty)', expected: '0:' },
      { name: 'One negative number', input: '-5', expected: '-5:' },
      { name: 'Repeated words', input: 'x x x', expected: '0:xxx' },
      { name: 'Extra spaces', input: '  10   20  ', expected: '30:' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 20. byte arithmetic
  {
    id: 'r6-byte-arithmetic',
    title: 'Byte arithmetic with b\'a\'',
    kind: 'drill',
    introduces: ['byte-literal', 'chars-bytes'],
    teach: {
      body: [
        `<p>The classic "count letters" trick uses the fact that <code>a</code> to <code>z</code> have consecutive codes. <code>s.as_bytes()</code> views a string as a slice of <code>u8</code> bytes (for ASCII text, one byte per letter), and <code>b'a'</code> is the byte value of the letter <code>a</code>, which is 97, so <code>b - b'a'</code> is <code>0</code> for <code>a</code>, <code>1</code> for <code>b</code>, up to <code>25</code> for <code>z</code>. Arrays and vectors are indexed by <code>usize</code>, so cast the difference: <code>(b - b'a') as usize</code>. The counts then live in an array like <code>let mut counts: [usize; 26] = [0; 26];</code>, which is the C++ <code>int cnt[26] = {}</code>.</p>`,
        `<p>The danger: <code>u8</code> subtraction that would go below 0 <em>panics</em> in a debug build ("attempt to subtract with overflow"). C++ would compute a garbage index and read out of range silently. So test the byte first. <code>b.is_ascii_lowercase()</code> is <code>true</code> for <code>a</code> to <code>z</code> and <code>false</code> for uppercase, digits, spaces and punctuation, and it exists on <code>u8</code> and on <code>char</code>. Guard with it, and only then subtract.</p>`,
        `<p>To go back from an index to a letter, add the index to <code>b'a'</code> and cast to <code>char</code>: <code>(b'a' + i as u8) as char</code>. The cast <code>i as u8</code> comes first because <code>as</code> binds tighter than <code>+</code>. When you loop over the array with <code>counts.iter().enumerate()</code> you get <code>(index, &amp;count)</code> pairs. Add a count to a <code>String</code> with <code>s.push_str(&amp;n.to_string())</code>, where <code>n.to_string()</code> makes the number into text.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let s = "hello";
    let mut counts: [usize; 26] = [0; 26];   // one counter per letter
    for &b in s.as_bytes() {                 // each byte; &b copies it out of the reference
        let i = (b - b'a') as usize;         // 'a' is 0, 'b' is 1, ... 'z' is 25
        counts[i] += 1;
    }
    println!("{} {} {}", counts[(b'l' - b'a') as usize], counts[0], counts[25]);
}`,
          output: '2 0 0',
        },
        {
          code: `fn main() {
    println!("{}", b'z'.is_ascii_lowercase());   // true
    println!("{}", b'Z'.is_ascii_lowercase());   // false: guard before you subtract
    let i = 2;
    println!("{}", (b'a' + i as u8) as char);    // c: the letter with index 2
    // b'A' - b'a' on its own would panic in a debug build: attempt to subtract with overflow
}`,
          output: 'true\nfalse\nc',
        },
      ],
      terms: [
        { code: "b'a'", meaning: 'the byte value of the letter a (97), a u8' },
        { code: 's.as_bytes()', meaning: 'the string viewed as a slice of u8 bytes' },
        { code: "(b - b'a') as usize", meaning: 'the letter index 0..25, converted to usize for indexing' },
        { code: 'b.is_ascii_lowercase()', meaning: 'true for a to z; use it to guard the subtraction' },
        { code: "(b'a' + i as u8) as char", meaning: 'the letter with index i' },
        { code: '[0; 26]', meaning: 'an array of 26 zeros' },
      ],
    },
    task: 'Write <code>letter_counts</code>: count the lowercase letters <code>a</code> to <code>z</code> of the text, ignoring everything else, and return them in alphabetical order as letter plus count, for example <code>"a3b1n2"</code>.',
    refresher: [
      '<code>s.as_bytes()</code> is a <code>&amp;[u8]</code>; <code>b\'a\'</code> is the byte 97. <code>(b - b\'a\') as usize</code> is a 0-based index.',
      '<code>b - b\'a\'</code> panics in debug builds when <code>b</code> is below <code>b\'a\'</code>: test <code>b.is_ascii_lowercase()</code> first. <code>(b\'a\' + i as u8) as char</code> turns an index back into a letter.',
    ],
    hints: [
      'Keep <code>[usize; 26]</code> counters and add 1 at the letter\'s index.',
      'Guard the subtraction: uppercase letters and punctuation must be skipped before it happens.',
      'Walk the array with <code>enumerate()</code> and print only nonzero counts.',
    ],
    inCpp: {
      code: 'std::string s;\nint cnt[26] = {};\nfor (char c : s) {\n    if (c >= \'a\' && c <= \'z\') cnt[c - \'a\']++;\n}',
      note: 'The idea is identical, but Rust makes the types explicit: <code>u8</code> minus <code>u8</code> is checked, and the index must be cast to <code>usize</code>. An unguarded <code>c - \'a\'</code> panics in debug instead of silently indexing out of range.',
    },
    starter: 'fn letter_counts(s: &str) -> String {\n    String::new()\n}',
    solution: `fn letter_counts(s: &str) -> String {
    let mut counts: [usize; 26] = [0; 26];
    for &b in s.as_bytes() {
        if b.is_ascii_lowercase() {
            counts[(b - b'a') as usize] += 1;
        }
    }
    let mut out = String::new();
    for (i, &n) in counts.iter().enumerate() {
        if n > 0 {
            out.push((b'a' + i as u8) as char);
            out.push_str(&n.to_string());
        }
    }
    out
}`,
    harness: `fn main() {
    let cases = ["banana", "", "z", "Hello, World", "aaa"];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", letter_counts(c));
    }
}`,
    require: [
      { pattern: "b'a'", message: "Use b'a'" },
      { pattern: 'as_bytes', message: 'Use as_bytes' },
    ],
    tests: [
      { name: 'Example', input: 'banana', expected: 'a3b1n2' },
      { name: 'Empty', input: '(empty)', expected: '' },
      { name: 'One letter', input: 'z', expected: 'z1' },
      { name: 'Uppercase and punctuation', input: 'Hello, World', expected: 'd1e1l3o2r1' },
      { name: 'Repeated letter', input: 'aaa', expected: 'a3' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 21. windows, chunks, step_by, rev
  {
    id: 'r6-iterator-chains',
    title: 'windows, chunks, step_by, rev',
    kind: 'drill',
    introduces: ['iter-adapters', 'iter-consumers'],
    teach: {
      body: [
        `<p>Index loops like <code>for (size_t i = 0; i + 1 &lt; v.size(); i++)</code> are where C++ off-by-one and unsigned-underflow bugs live. Rust has methods that express the common shapes directly, and each one is safe on short or empty input. On a slice: <code>v.windows(k)</code> yields every run of <code>k</code> neighbouring items as a sub-slice, overlapping (<code>[a, b]</code>, <code>[b, c]</code>, ...), and yields nothing when the slice is shorter than <code>k</code>. <code>v.chunks(k)</code> cuts the slice into non-overlapping pieces of <code>k</code>, where the last piece may be shorter, and yields nothing for an empty slice. Both give <code>&amp;[T]</code>, so you index the pieces as <code>w[0]</code> and <code>w[1]</code>.</p>`,
        `<p>On any iterator: <code>.step_by(k)</code> takes every <code>k</code>th item starting with the first, and <code>.rev()</code> reverses the order (it works on slice iterators, ranges and <code>step_by</code> over them). Order can be combined: <code>v.iter().step_by(2).rev()</code> is every second item, backwards. Close the chain with <code>.count()</code> (how many items are left), <code>.sum()</code> (add them; give it a type when it cannot be guessed, as in <code>c.iter().sum::&lt;i32&gt;()</code>) or <code>.collect()</code> into a <code>Vec</code>. Use <code>.copied()</code> to turn <code>&amp;i32</code> items into <code>i32</code> values before collecting.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = [1, 3, 2, 4];
    let rising = v.windows(2).filter(|w| w[0] < w[1]).count();   // pairs: (1,3) (3,2) (2,4)
    println!("{}", rising);
    for w in v.windows(3) {                                       // overlapping runs of 3
        println!("{:?}", w);
    }
}`,
          output: '2\n[1, 3, 2]\n[3, 2, 4]',
        },
        {
          code: `fn main() {
    let v = [1, 2, 3, 4, 5, 6, 7];
    let sums: Vec<i32> = v.chunks(3).map(|c| c.iter().sum()).collect();   // [1,2,3] [4,5,6] [7]
    println!("{:?}", sums);
    let odd_places: Vec<i32> = v.iter().step_by(2).copied().collect();   // 1, 3, 5, 7
    println!("{:?}", odd_places);
    let back: Vec<i32> = v.iter().step_by(2).rev().copied().collect();
    println!("{:?}", back);
}`,
          output: '[6, 15, 7]\n[1, 3, 5, 7]\n[7, 5, 3, 1]',
        },
      ],
      terms: [
        { code: 'v.windows(k)', meaning: 'overlapping runs of k neighbours, as slices; none if len < k' },
        { code: 'v.chunks(k)', meaning: 'non-overlapping pieces of k; the last may be shorter' },
        { code: '.step_by(k)', meaning: 'every kth item, starting with the first' },
        { code: '.rev()', meaning: 'the items in reverse order' },
      ],
    },
    task: 'Write <code>chains</code> returning three things for the slice: the number of adjacent pairs where the second is larger, the sums of consecutive chunks of 3 (the last may be shorter), and every second item starting at index 0, in reverse order.',
    refresher: [
      '<code>v.windows(2)</code> yields overlapping <code>&amp;[T]</code> slices; <code>v.chunks(3)</code> yields non-overlapping ones, the last possibly shorter. Both are empty for an empty slice.',
      '<code>v.iter().step_by(2)</code> takes every second item; <code>.rev()</code> reverses. <code>a.iter().zip(b.iter())</code> pairs items up.',
    ],
    hints: [
      'Each window is a slice: <code>w[0]</code> and <code>w[1]</code> are the pair. Filter, then <code>count()</code>.',
      '<code>chunks(3)</code> gives slices; <code>c.iter().sum::&lt;i32&gt;()</code> adds one up.',
      'Add the type to <code>collect::&lt;Vec&lt;_&gt;&gt;()</code>, and copy items out with <code>copied()</code> where you need <code>i32</code>.',
    ],
    inCpp: {
      code: 'std::vector<int> v;\nint rising = 0;\nfor (size_t i = 0; i + 1 < v.size(); i++)\n    if (v[i] < v[i + 1]) rising++;\nfor (size_t i = 0; i < v.size(); i += 3) { /* chunk */ }',
      note: 'C++ hand-writes index loops, and <code>i + 1 &lt; v.size()</code> is easy to get wrong with unsigned sizes. Rust\'s adaptors express the window or chunk directly and are safe on empty input.',
    },
    starter: 'fn chains(v: &[i32]) -> (usize, Vec<i32>, Vec<i32>) {\n    (0, Vec::new(), Vec::new())\n}',
    solution: `fn chains(v: &[i32]) -> (usize, Vec<i32>, Vec<i32>) {
    let rising = v.windows(2).filter(|w| w[0] < w[1]).count();
    let sums: Vec<i32> = v.chunks(3).map(|c| c.iter().sum()).collect();
    let picked: Vec<i32> = v.iter().step_by(2).rev().copied().collect();
    (rising, sums, picked)
}`,
    harness: `fn main() {
    let cases: Vec<Vec<i32>> = vec![
        vec![1, 3, 2, 4, 5, 6, 7],
        vec![],
        vec![9],
        vec![2, 2, 2, 2],
        vec![5, 4, 3, 2, 1],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", chains(c));
    }
}`,
    require: [
      { pattern: '\\.(windows|zip)\\(', message: 'Use windows or zip for the pairs' },
      { pattern: '\\.chunks\\(', message: 'Use chunks' },
      { pattern: '\\.step_by\\(', message: 'Use step_by' },
    ],
    tests: [
      { name: 'Example', input: '[1,3,2,4,5,6,7]', expected: '(5, [6, 15, 7], [7, 5, 2, 1])' },
      { name: 'Empty', input: '[]', expected: '(0, [], [])' },
      { name: 'One item', input: '[9]', expected: '(0, [9], [9])' },
      { name: 'Duplicates', input: '[2,2,2,2]', expected: '(0, [6, 2], [2, 2])' },
      { name: 'Decreasing', input: '[5,4,3,2,1]', expected: '(0, [12, 3], [1, 3, 5])' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 22. fold and scan
  {
    id: 'r6-fold-scan',
    title: 'fold and scan',
    kind: 'drill',
    introduces: ['iter-adapters', 'iter-consumers'],
    teach: {
      body: [
        `<p><code>fold</code> reduces a whole iterator to one value. <code>it.fold(start, |acc, x| new_acc)</code> begins with <code>start</code> as the accumulator, then for each item calls the closure with the accumulator and the item, and the closure's result becomes the next accumulator. The last accumulator is the answer. <code>v.iter().fold(0, |acc, &amp;x| acc + x * x)</code> is the sum of squares. It is <code>std::accumulate</code>, and <code>.sum()</code> is a <code>fold</code> with <code>+</code>. The <code>&amp;x</code> in the closure copies the number out of the reference that <code>v.iter()</code> yields.</p>`,
        `<p><code>scan</code> is a <code>fold</code> that also <em>emits</em> a value for every item, so it is an adaptor (lazy, followed by <code>collect</code>) instead of a consumer. <code>it.scan(start, |state, x| ...)</code> keeps a mutable <code>state</code> between items. The closure gets <code>state</code> as a <code>&amp;mut</code> reference (change it with <code>*state += x</code>) and must return an <code>Option</code>: <code>Some(value)</code> is the item to produce, and <code>None</code> stops the whole iteration early. Running totals and running maxima are the standard uses, and it is <code>std::partial_sum</code> (but with any state and any step, and with early exit).</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = [1, 2, 3, 4];
    let total = v.iter().fold(0, |acc, &x| acc + x);    // acc: 0, 1, 3, 6, 10
    println!("{}", total);
    let prefix: Vec<i32> = v
        .iter()
        .scan(0, |sum, &x| {
            *sum += x;          // sum is a &mut i32: update the running total
            Some(*sum)          // the value to emit for this item
        })
        .collect();
    println!("{:?}", prefix);
}`,
          output: '10\n[1, 3, 6, 10]',
        },
        {
          code: `fn main() {
    let v = [1, 2, 3, 4];
    let until_over_5: Vec<i32> = v
        .iter()
        .scan(0, |sum, &x| {
            *sum += x;
            if *sum > 5 { None } else { Some(*sum) }   // None stops the iteration
        })
        .collect();
    println!("{:?}", until_over_5);
}`,
          output: '[1, 3]',
          caption: 'The running sums are 1, 3, 6: the 6 returns <code>None</code>, so it and everything after it are dropped.',
        },
      ],
      terms: [
        { code: '.fold(start, |acc, x| ...)', meaning: 'reduces to one value; the closure returns the next accumulator' },
        { code: '.scan(start, |state, x| ...)', meaning: 'like fold but emits a value per item; state is a &mut' },
        { code: 'Some(v) / None', meaning: 'the scan closure returns Some(value) to emit, None to stop' },
        { code: '*state = ...', meaning: 'changes the value a &mut reference points to' },
      ],
    },
    task: 'Write <code>stats</code>: return the prefix maxima of the slice (the largest value seen up to each position) using <code>scan</code>, and the sum of the squares using <code>fold</code>.',
    refresher: [
      '<code>it.fold(init, |acc, x| …)</code> reduces to one value; the closure returns the new accumulator.',
      '<code>it.scan(init, |state, x| { …; Some(out) })</code> keeps mutable state, yields one output per item, and stops early if the closure returns <code>None</code>.',
    ],
    hints: [
      'For <code>scan</code> start the state at <code>i32::MIN</code> and update it with <code>*state = (*state).max(x)</code>.',
      'The scan closure must return <code>Some(value)</code> to yield an item.',
      'For <code>fold</code> start at 0 and add <code>x * x</code>. Iterating <code>v.iter()</code> gives <code>&amp;i32</code>, so pattern <code>&amp;x</code>.',
    ],
    inCpp: {
      code: 'std::vector<int> v;\nstd::vector<int> pm(v.size());\nstd::partial_sum(v.begin(), v.end(), pm.begin(),\n    [](int a, int b) { return std::max(a, b); });\nint sq = std::accumulate(v.begin(), v.end(), 0,\n    [](int acc, int x) { return acc + x * x; });',
      note: '<code>accumulate</code> is <code>fold</code>, and <code>partial_sum</code> is <code>scan</code>. In Rust both are lazy iterator adaptors, so there is no output container to size in advance.',
    },
    starter: 'fn stats(v: &[i32]) -> (Vec<i32>, i32) {\n    (Vec::new(), 0)\n}',
    solution: `fn stats(v: &[i32]) -> (Vec<i32>, i32) {
    let maxima: Vec<i32> = v
        .iter()
        .scan(i32::MIN, |m, &x| {
            *m = (*m).max(x);
            Some(*m)
        })
        .collect();
    let squares = v.iter().fold(0, |acc, &x| acc + x * x);
    (maxima, squares)
}`,
    harness: `fn main() {
    let cases: Vec<Vec<i32>> = vec![
        vec![3, 1, 4, 1, 5],
        vec![],
        vec![-2],
        vec![2, 2, 2],
        vec![-3, -1, -2],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", stats(c));
    }
}`,
    require: [
      { pattern: '\\.scan\\(', message: 'Use scan' },
      { pattern: '\\.fold\\(', message: 'Use fold' },
    ],
    tests: [
      { name: 'Example', input: '[3,1,4,1,5]', expected: '([3, 3, 4, 4, 5], 52)' },
      { name: 'Empty', input: '[]', expected: '([], 0)' },
      { name: 'One negative', input: '[-2]', expected: '([-2], 4)' },
      { name: 'Duplicates', input: '[2,2,2]', expected: '([2, 2, 2], 12)' },
      { name: 'All negative', input: '[-3,-1,-2]', expected: '([-3, -1, -1], 14)' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 23. <algorithm> lookups: position, any, all, max_by_key
  {
    id: 'r6-iter-queries',
    title: 'position, any, all, max_by_key',
    kind: 'drill',
    introduces: ['iter-consumers'],
    teach: {
      body: [
        `<p>Most of <code>&lt;algorithm&gt;</code> lives on iterators in Rust. Here is the whole bridge. <code>std::find</code> and <code>find_if</code> are <code>.find(|x| ...)</code> (the item) and <code>.position(|x| ...)</code> (its index), and for a plain value <code>v.contains(&amp;x)</code>. <code>count_if</code> is <code>.filter(...).count()</code>. <code>any_of</code>, <code>all_of</code> and <code>none_of</code> are <code>.any(...)</code>, <code>.all(...)</code> and <code>!v.iter().any(...)</code>. <code>min_element</code> and <code>max_element</code> are <code>.min()</code> and <code>.max()</code>, or <code>.min_by_key(...)</code> and <code>.max_by_key(...)</code> when you compare by a computed key. <code>accumulate</code> is <code>.fold(...)</code> or <code>.sum()</code>, <code>transform</code> is <code>.map(...)</code>, <code>copy_if</code> is <code>.filter(...)</code>, <code>partial_sum</code> is <code>.scan(...)</code>, <code>iota</code> is a range <code>(0..n)</code>, <code>unique</code> is <code>dedup</code>, <code>remove_if</code> is <code>retain</code>, <code>lower_bound</code> is <code>partition_point</code>, <code>reverse</code> is <code>v.reverse()</code> and <code>rotate</code> is <code>v.rotate_left(k)</code>.</p>`,
        `<p>The ones worth practising. <code>v.iter().position(|&amp;x| x &lt; 0)</code> returns the index of the first match as an <code>Option&lt;usize&gt;</code>. <code>.any(|&amp;x| cond)</code> and <code>.all(|&amp;x| cond)</code> return <code>bool</code> and stop as soon as the answer is known; <code>all</code> on an empty iterator is <code>true</code> and <code>any</code> is <code>false</code>. <code>.find(...)</code> returns the first matching <em>item</em> as an <code>Option</code>. Its closure receives a reference to a reference, so the pattern is <code>|&amp;&amp;x|</code> on <code>v.iter()</code>, or <code>|&amp;x|</code> after <code>.copied()</code>.</p>`,
        `<p><code>.max_by_key(|x| key)</code> and <code>.min_by_key(|x| key)</code> return the item whose key is largest or smallest, as an <code>Option</code>. <code>.max()</code> is enough for plain numbers; the <code>_by_key</code> forms are for "the longest word" or "the number with the largest absolute value". Know the tie rule: when several items share the extreme key, <code>max_by_key</code> returns the <em>last</em> of them and <code>min_by_key</code> the <em>first</em>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = [4, -2, 7, -9, 6];
    println!("{:?}", v.iter().position(|&x| x < 0));    // Some(1): index of the first negative
    println!("{}", v.iter().any(|&x| x > 6));           // true: 7 is bigger than 6
    println!("{}", v.iter().all(|&x| x != 0));          // true: no zeros
    println!("{:?}", v.iter().find(|&&x| x > 5));       // Some(7): the first match, a reference
}`,
          output: 'Some(1)\ntrue\ntrue\nSome(7)',
        },
        {
          code: `fn main() {
    let v: [i32; 4] = [3, -8, 5, -8];
    let big = v.iter().max_by_key(|x| x.abs());     // largest |x|; a tie gives the LAST one
    let small = v.iter().min_by_key(|x| x.abs());   // smallest |x|; a tie gives the FIRST one
    println!("{:?} {:?}", big, small);
    let words = ["fig", "apple", "kiwi"];
    println!("{:?}", words.iter().max_by_key(|w| w.len()));
}`,
          output: 'Some(-8) Some(3)\nSome("apple")',
        },
      ],
      terms: [
        { code: '.position(|&x| cond)', meaning: 'index of the first item matching, as Option<usize>' },
        { code: '.any(|&x| cond) / .all(|&x| cond)', meaning: 'true if some / every item matches; stops early' },
        { code: '.find(|&&x| cond)', meaning: 'the first matching item as an Option (a reference on v.iter())' },
        { code: '.max_by_key(|x| key)', meaning: 'the item with the largest key; the last one on a tie' },
        { code: '.min_by_key(|x| key)', meaning: 'the item with the smallest key; the first one on a tie' },
      ],
    },
    task: 'Write <code>queries</code> returning four things: the index of the first negative number, whether any number is above 100, whether all numbers are even, and the number with the largest absolute value (the last one on a tie).',
    refresher: [
      '<code>.position(|&amp;x| c)</code> gives <code>Option&lt;usize&gt;</code>. <code>.any</code> and <code>.all</code> give <code>bool</code>; on empty input <code>any</code> is false and <code>all</code> is true.',
      '<code>.max_by_key(|x| x.abs())</code> keeps the last of equal keys; <code>.copied()</code> first gives <code>Option&lt;i32&gt;</code> instead of <code>Option&lt;&amp;i32&gt;</code>.',
    ],
    hints: [
      'Each answer is one iterator chain starting from <code>v.iter()</code>.',
      '<code>all</code> of an empty slice is true, so an empty input needs no special case.',
      'Put <code>.copied()</code> before <code>max_by_key</code> so the result is an <code>Option&lt;i32&gt;</code>.',
    ],
    inCpp: {
      code: 'std::vector<int> v{4, -2, 7};\nauto it = std::find_if(v.begin(), v.end(), [](int x) { return x < 0; });\nsize_t idx = it - v.begin();                       // v.size() if not found\nbool any = std::any_of(v.begin(), v.end(), [](int x) { return x > 100; });\nauto big = std::max_element(v.begin(), v.end(),\n    [](int a, int b) { return std::abs(a) < std::abs(b); });   // FIRST of equal maxima',
      note: 'C++ returns iterators, so "not found" is <code>end()</code>; Rust returns an <code>Option</code>. Also, <code>max_element</code> keeps the first of equal maxima while <code>max_by_key</code> keeps the last.',
    },
    starter: 'fn queries(v: &[i32]) -> (Option<usize>, bool, bool, Option<i32>) {\n    (None, false, false, None)\n}',
    solution: `fn queries(v: &[i32]) -> (Option<usize>, bool, bool, Option<i32>) {
    let first_negative = v.iter().position(|&x| x < 0);
    let any_big = v.iter().any(|&x| x > 100);
    let all_even = v.iter().all(|&x| x % 2 == 0);
    let widest = v.iter().copied().max_by_key(|x| x.abs());
    (first_negative, any_big, all_even, widest)
}`,
    harness: `fn main() {
    let cases: Vec<Vec<i32>> = vec![
        vec![4, -2, 7, -9, 6],
        vec![],
        vec![8],
        vec![2, 4, -6, 6],
        vec![150, 3],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", queries(c));
    }
}`,
    require: [
      { pattern: '\\.position\\(', message: 'Use position' },
      { pattern: '\\.any\\(', message: 'Use any' },
      { pattern: '\\.all\\(', message: 'Use all' },
      { pattern: '\\.max_by_key\\(', message: 'Use max_by_key' },
    ],
    tests: [
      { name: 'Example', input: '[4,-2,7,-9,6]', expected: '(Some(1), false, false, Some(-9))' },
      { name: 'Empty', input: '[]', expected: '(None, false, true, None)' },
      { name: 'One item', input: '[8]', expected: '(None, false, true, Some(8))' },
      { name: 'Tie on |x|', input: '[2,4,-6,6]', expected: '(Some(2), false, true, Some(6))' },
      { name: 'Big and odd', input: '[150,3]', expected: '(None, true, false, Some(150))' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 24. grids
  {
    id: 'r6-grid-2d',
    title: 'Grids as Vec<Vec<T>>',
    kind: 'drill',
    introduces: ['vec', 'as-cast'],
    teach: {
      body: [
        `<p>A grid is a vector of rows, each row a vector: <code>Vec&lt;Vec&lt;i32&gt;&gt;</code>, the C++ <code>vector&lt;vector&lt;int&gt;&gt;</code>. Build a <code>rows</code> by <code>cols</code> grid of zeros with <code>vec![vec![0; cols]; rows]</code>. <code>vec![x; n]</code> makes <code>n</code> copies of <code>x</code> (clones, so each row is its own independent vector). Read and write with <code>g[r][c]</code>, row first. <code>g.len()</code> is the number of rows and <code>g[0].len()</code> the number of columns (which panics if there are no rows, so check <code>g.is_empty()</code> first when that can happen). Indices are <code>usize</code>.</p>`,
        `<p>The classic grid chore is visiting the four (or eight) neighbours of a cell. Keep the offsets in an array of pairs, <code>let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];</code>, and loop with <code>for (dr, dc) in dirs</code>, which takes each pair apart. The trap: <code>r</code> is a <code>usize</code>, and <code>r - 1</code> at <code>r = 0</code> panics in a debug build (in C++ with <code>int</code> coordinates it is just -1). So do the arithmetic in <code>i32</code>: <code>let nr = r as i32 + dr;</code>, compare it with <code>0</code> and with <code>rows as i32</code>, and only after the check convert back with <code>nr as usize</code> to index.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let rows = 2;
    let cols = 3;
    let mut g = vec![vec![0; cols]; rows];   // 2 rows of 3 zeros
    g[1][2] = 7;                             // row 1, column 2
    println!("{:?}", g);
    println!("{} {}", g.len(), g[0].len());  // rows, then columns
}`,
          output: '[[0, 0, 0], [0, 0, 7]]\n2 3',
        },
        {
          code: `fn main() {
    let rows: i32 = 2;
    let cols: i32 = 3;
    let r: usize = 0;
    let c: usize = 2;
    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];
    let mut inside = 0;
    for (dr, dc) in dirs {
        let nr = r as i32 + dr;              // switch to i32 so that -1 can exist
        let nc = c as i32 + dc;
        if nr >= 0 && nr < rows && nc >= 0 && nc < cols {
            inside += 1;                     // only now is nr as usize a safe index
        }
    }
    println!("{}", inside);
}`,
          output: '2',
          caption: 'The corner cell (0, 2) has only two neighbours inside a 2 by 3 grid.',
        },
      ],
      terms: [
        { code: 'vec![vec![0; cols]; rows]', meaning: 'a rows by cols grid of zeros (clones the inner vector)' },
        { code: 'g[r][c]', meaning: 'row r, column c; both usize' },
        { code: 'g.len() / g[0].len()', meaning: 'number of rows / number of columns' },
        { code: 'for (dr, dc) in dirs', meaning: 'loops over an array of pairs, taking each pair apart' },
        { code: 'r as i32 + dr', meaning: 'do neighbour arithmetic in i32, check bounds, then convert back' },
      ],
    },
    task: 'Write <code>neighbour_counts</code>: build a <code>rows</code> by <code>cols</code> grid where each cell holds how many of its four neighbours (up, down, left, right) lie inside the grid.',
    refresher: [
      '<code>vec![vec![0; cols]; rows]</code> builds a grid; <code>g[r][c]</code> indexes it, with <code>usize</code> indices.',
      '<code>r - 1</code> on a <code>usize</code> 0 panics. Convert first: <code>let nr = r as i32 + dr;</code>, check <code>nr &gt;= 0 &amp;&amp; nr &lt; rows as i32</code>, then use <code>nr as usize</code>.',
    ],
    hints: [
      'Keep the four offsets in an array of <code>(i32, i32)</code> pairs and loop over it for each cell.',
      'Do the bounds check in <code>i32</code>, before any conversion back to <code>usize</code>.',
      'Edge cases: a 1 by 1 grid has no neighbours, and a grid with zero rows is empty.',
    ],
    inCpp: {
      code: 'int rows = 2, cols = 3, r = 0, c = 0, d = 0;\nstd::vector<std::vector<int>> g(rows, std::vector<int>(cols, 0));\nint dr[] = {0, 1, 0, -1}, dc[] = {1, 0, -1, 0};\nint nr = r + dr[d];   // int, so -1 is fine',
      note: 'C++ code usually uses signed <code>int</code> for coordinates, so <code>r - 1</code> is simply -1. Rust indices are <code>usize</code>, so you convert to <code>i32</code> for the check and back for the index, and an unchecked underflow panics.',
    },
    starter: 'fn neighbour_counts(rows: usize, cols: usize) -> Vec<Vec<usize>> {\n    vec![vec![0; cols]; rows]\n}',
    solution: `fn neighbour_counts(rows: usize, cols: usize) -> Vec<Vec<usize>> {
    let mut g = vec![vec![0; cols]; rows];
    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];
    for r in 0..rows {
        for c in 0..cols {
            for (dr, dc) in dirs {
                let nr = r as i32 + dr;
                let nc = c as i32 + dc;
                if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                    g[r][c] += 1;
                }
            }
        }
    }
    g
}`,
    harness: `fn main() {
    let cases = [(2, 3), (3, 3), (0, 0), (1, 1), (1, 4)];
    for (i, (r, c)) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        for row in neighbour_counts(*r, *c) {
            let line: Vec<String> = row.iter().map(|x| x.to_string()).collect();
            println!("{}", line.join(" "));
        }
    }
}`,
    tests: [
      { name: '2 by 3', input: 'rows=2, cols=3', expected: '2 3 2\n2 3 2' },
      { name: '3 by 3', input: 'rows=3, cols=3', expected: '2 3 2\n3 4 3\n2 3 2' },
      { name: 'Empty grid', input: 'rows=0, cols=0', expected: '' },
      { name: 'One cell', input: 'rows=1, cols=1', expected: '0' },
      { name: 'One row', input: 'rows=1, cols=4', expected: '1 2 2 1' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 25. mem::swap, replace, take
  {
    id: 'r6-swap-replace-take',
    title: 'swap, replace, take',
    kind: 'drill',
    introduces: ['mem-fns', 'slice-swap'],
    teach: {
      body: [
        `<p>Rust does not let you move a value out of something you only borrow, because that would leave a hole behind. Three functions in <code>std::mem</code> solve it by always leaving something valid in the place. <code>mem::swap(&amp;mut a, &amp;mut b)</code> exchanges two whole values in place, without copying their contents (swapping two big vectors just swaps a few pointers). <code>mem::replace(&amp;mut x, new)</code> puts <code>new</code> into <code>x</code> and <em>returns the old value</em>: it is <code>std::exchange</code>. <code>mem::take(&amp;mut x)</code> returns the old value and leaves the type's default (<code>0</code>, an empty <code>String</code> or <code>Vec</code>) in <code>x</code>: it is "move out, then clear", in one safe step.</p>`,
        `<p>Write them as <code>mem::swap(...)</code> after <code>use std::mem;</code>, or import the function itself with <code>use std::mem::swap;</code> and call <code>swap(&amp;mut a, &amp;mut b)</code>. If a function already has parameters of type <code>&amp;mut Vec&lt;i32&gt;</code>, you pass them as they are (<code>mem::swap(a, b)</code>), without another <code>&amp;mut</code>. Do not confuse it with <code>v.swap(i, j)</code>, the slice method from stage 2, which exchanges two <em>items</em> of one vector by index.</p>`,
        `<p>One more tool for the drill: <code>v.first_mut()</code> returns <code>Option&lt;&amp;mut T&gt;</code>, a mutable reference to the first item, or <code>None</code> for an empty vector. You can change it through the reference (<code>if let Some(first) = v.first_mut() { *first = 100; }</code>), or hand the reference to a function with <code>.map(|x| ...)</code>, as in <code>v.first_mut().map(|x| mem::replace(x, 0))</code>, which swaps in a 0 and returns the old first item, only if there is one. (<code>Option</code> has its own <code>.take()</code> as well, which leaves <code>None</code> behind; stage 5's linked lists use it.)</p>`,
      ],
      examples: [
        {
          code: `use std::mem;

fn main() {
    let mut a = vec![1, 2];
    let mut b = vec![3];
    mem::swap(&mut a, &mut b);             // exchange the whole vectors
    println!("{:?} {:?}", a, b);

    let mut name = String::from("ann");
    let old = mem::take(&mut name);        // old is "ann"; name is now empty
    println!("{:?} {:?}", old, name);

    let mut x = 5;
    let prev = mem::replace(&mut x, 9);    // returns 5; x is now 9
    println!("{} {}", prev, x);
}`,
          output: '[3] [1, 2]\n"ann" ""\n5 9',
        },
        {
          code: `fn main() {
    let mut v = vec![1, 2, 3];
    v.swap(0, 2);                          // two items of ONE vector, by index
    println!("{:?}", v);
    if let Some(first) = v.first_mut() {   // Option<&mut i32>
        *first = 100;
    }
    println!("{:?}", v);
}`,
          output: '[3, 2, 1]\n[100, 2, 1]',
        },
      ],
      terms: [
        { code: 'mem::swap(&mut a, &mut b)', meaning: 'exchanges two values in place, without copying their contents' },
        { code: 'mem::replace(&mut x, new)', meaning: 'puts new in x and returns the old value (std::exchange)' },
        { code: 'mem::take(&mut x)', meaning: 'returns the old value and leaves the default (0, empty String/Vec) in x' },
        { code: 'v.first_mut()', meaning: 'Option<&mut T> for the first item, or None if empty' },
      ],
    },
    task: 'Write <code>juggle</code>: swap the contents of <code>a</code> and <code>b</code> with <code>mem::swap</code>; move the text out of <code>name</code> with <code>mem::take</code>; overwrite the first item of <code>a</code> with 0 using <code>mem::replace</code>. Return the old name and the old first item.',
    refresher: [
      '<code>std::mem::swap(&amp;mut a, &amp;mut b)</code> exchanges two values without copying. <code>mem::take(&amp;mut x)</code> returns the value and leaves <code>Default::default()</code> behind.',
      '<code>mem::replace(&amp;mut x, new)</code> returns the old value. <code>a.first_mut()</code> is an <code>Option&lt;&amp;mut T&gt;</code>. <code>v.swap(i, j)</code> swaps two items of one slice.',
    ],
    hints: [
      'Parameters are already <code>&amp;mut</code>, so pass them straight on: <code>mem::swap(a, b)</code>.',
      'Swap first, then work on <code>a</code>: it now holds what <code>b</code> held.',
      '<code>first_mut()</code> then <code>map</code> lets you replace the item only if there is one.',
    ],
    inCpp: {
      code: 'std::vector<int> a, b;\nstd::string name;\nstd::swap(a, b);\nstd::string old = std::move(name);\nname.clear();   // moved-from: valid but unspecified\nint f = std::exchange(a[0], 0);   // UB if a is empty',
      note: '<code>mem::take</code> is the safe version of "move out, then clear", and <code>mem::replace</code> is <code>std::exchange</code>. They exist because Rust forbids moving out of a borrowed place and leaving it empty.',
    },
    starter: 'fn juggle(a: &mut Vec<i32>, b: &mut Vec<i32>, name: &mut String) -> (String, Option<i32>) {\n    (String::new(), None)\n}',
    solution: `use std::mem;

fn juggle(a: &mut Vec<i32>, b: &mut Vec<i32>, name: &mut String) -> (String, Option<i32>) {
    mem::swap(a, b);
    let old = mem::take(name);
    let first = a.first_mut().map(|x| mem::replace(x, 0));
    (old, first)
}`,
    harness: `fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>, &str)> = vec![
        (vec![1, 2], vec![3], "ann"),
        (vec![], vec![], ""),
        (vec![7], vec![], "x"),
        (vec![5, 5], vec![5, 5, 5], "z"),
        (vec![], vec![8, 9], "hi"),
    ];
    for (i, (a, b, n)) in cases.into_iter().enumerate() {
        let (mut a, mut b, mut name) = (a, b, n.to_string());
        println!("\\n@@TEST {}@@", i + 1);
        let r = juggle(&mut a, &mut b, &mut name);
        println!("{:?} {:?} {:?} {:?}", r, a, b, name);
    }
}`,
    require: [
      { pattern: '(?<![.\\w])(?:mem::)?swap\\s*\\(', message: 'Use mem::swap (or swap after use std::mem::swap)' },
      { pattern: '(?<![.\\w])(?:mem::)?take\\s*\\(', message: 'Use mem::take (or take after use std::mem::take)' },
      { pattern: '(?<![.\\w])(?:mem::)?replace\\s*\\(', message: 'Use mem::replace (or replace after use std::mem::replace)' },
    ],
    tests: [
      { name: 'Example', input: 'a=[1,2] b=[3] "ann"', expected: '("ann", Some(3)) [0] [1, 2] ""' },
      { name: 'Everything empty', input: 'a=[] b=[] ""', expected: '("", None) [] [] ""' },
      { name: 'a becomes empty', input: 'a=[7] b=[] "x"', expected: '("x", None) [] [7] ""' },
      { name: 'Duplicates', input: 'a=[5,5] b=[5,5,5] "z"', expected: '("z", Some(5)) [0, 5, 5] [5, 5] ""' },
      { name: 'Only b has items', input: 'a=[] b=[8,9] "hi"', expected: '("hi", Some(8)) [0, 9] [] ""' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    id: 'r6-bugfix-word-count',
    title: 'Bugfix: word counts stuck at 1',
    kind: 'bugfix',
    introduces: [],
    task: '<code>word_count</code> reports every word once, however often it occurs. Fix it so repeated words are counted, without changing the sorted output.',
    refresher: [
      '<code>m.insert(k, v)</code> replaces any existing value for <code>k</code>.',
      '<code>*m.entry(k).or_insert(0) += 1</code> adds to the existing count, or starts it at 0.',
    ],
    hints: [
      'Trace "a b a": what does the second <code>insert</code> of <code>a</code> do to the first?',
      'You need to read the current count and add to it: one call can do both.',
      'The <code>entry</code> API gives you a mutable reference to the count.',
    ],
    inCpp: {
      code: 'std::vector<std::string> words;\nstd::unordered_map<std::string, int> m;\nfor (auto& w : words) {\n    m[w] = 1;     // bug: overwrites\n    // m[w]++;    // fix\n}',
      note: 'The same slip exists in C++ (<code>m[w] = 1</code>), and the fix <code>m[w]++</code> hides a default insert. The entry API says it outright: look up once, insert 0 if missing, then increment.',
    },
    starter: `use std::collections::HashMap;

fn word_count(text: &str) -> Vec<(String, usize)> {
    let mut counts: HashMap<String, usize> = HashMap::new();
    for w in text.split_whitespace() {
        counts.insert(w.to_string(), 1);
    }
    let mut out: Vec<(String, usize)> = counts.into_iter().collect();
    out.sort();
    out
}`,
    solution: `use std::collections::HashMap;

fn word_count(text: &str) -> Vec<(String, usize)> {
    let mut counts: HashMap<String, usize> = HashMap::new();
    for w in text.split_whitespace() {
        *counts.entry(w.to_string()).or_insert(0) += 1;
    }
    let mut out: Vec<(String, usize)> = counts.into_iter().collect();
    out.sort();
    out
}`,
    harness: `fn main() {
    let cases = ["a b a", "", "solo", "x x x x", "to be or not to be"];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", word_count(c));
    }
}`,
    require: [{ pattern: '\\.entry\\(', message: 'Use the entry API' }],
    tests: [
      { name: 'Repeated word', input: 'a b a', expected: '[("a", 2), ("b", 1)]' },
      { name: 'Empty text', input: '(empty)', expected: '[]' },
      { name: 'One word', input: 'solo', expected: '[("solo", 1)]' },
      { name: 'All the same', input: 'x x x x', expected: '[("x", 4)]' },
      { name: 'Sentence', input: 'to be or not to be', expected: '[("be", 2), ("not", 1), ("or", 1), ("to", 2)]' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    id: 'r6-bugfix-grid-edges',
    title: 'Bugfix: grid edge underflow',
    kind: 'bugfix',
    introduces: [],
    task: '<code>mine_counts</code> panics on boards that have cells in the top row or left column. Fix it so every non-mine cell shows the number of mines among its eight neighbours.',
    refresher: [
      '<code>usize</code> cannot go below 0: <code>0usize - 1</code> panics in a debug build ("attempt to subtract with overflow").',
      '<code>r.saturating_sub(1)</code> stops at 0. An upper bound past the end is fine when you also check <code>nr &lt; len</code>.',
    ],
    hints: [
      'Run it: which line panics, and for which row and column values?',
      'The range start <code>r - 1</code> is the problem when <code>r</code> is 0. The same goes for <code>c - 1</code>.',
      'Use a subtraction that stops at zero for the lower ends; the existing bounds check handles the upper ends.',
    ],
    inCpp: {
      code: 'int r = 0, c = 0, H = 3, W = 3, n = 0;\nstd::vector<std::string> g;\nfor (int nr = r - 1; nr <= r + 1; nr++)\n    for (int nc = c - 1; nc <= c + 1; nc++)\n        if (nr >= 0 && nr < H && nc >= 0 && nc < W) n += g[nr][nc] == \'*\';',
      note: 'With <code>int</code> coordinates the bug cannot happen; with <code>size_t</code> it silently wraps to a huge index. Rust panics in debug builds right at the subtraction, so the bug shows up where it is.',
    },
    starter: `fn mine_counts(board: &[&str]) -> Vec<String> {
    let g: Vec<&[u8]> = board.iter().map(|r| r.as_bytes()).collect();
    let mut out = Vec::new();
    for r in 0..g.len() {
        let mut line = String::new();
        for c in 0..g[r].len() {
            if g[r][c] == b'*' {
                line.push('*');
                continue;
            }
            let mut n = 0;
            for nr in r - 1..=r + 1 {
                for nc in c - 1..=c + 1 {
                    if nr < g.len() && nc < g[nr].len() && g[nr][nc] == b'*' {
                        n += 1;
                    }
                }
            }
            line.push_str(&n.to_string());
        }
        out.push(line);
    }
    out
}`,
    solution: `fn mine_counts(board: &[&str]) -> Vec<String> {
    let g: Vec<&[u8]> = board.iter().map(|r| r.as_bytes()).collect();
    let mut out = Vec::new();
    for r in 0..g.len() {
        let mut line = String::new();
        for c in 0..g[r].len() {
            if g[r][c] == b'*' {
                line.push('*');
                continue;
            }
            let mut n = 0;
            for nr in r.saturating_sub(1)..=r + 1 {
                for nc in c.saturating_sub(1)..=c + 1 {
                    if nr < g.len() && nc < g[nr].len() && g[nr][nc] == b'*' {
                        n += 1;
                    }
                }
            }
            line.push_str(&n.to_string());
        }
        out.push(line);
    }
    out
}`,
    harness: `fn main() {
    let cases: Vec<Vec<&str>> = vec![
        vec!["*..", "...", ".*."],
        vec![],
        vec!["*"],
        vec!["..."],
        vec!["*.*"],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        for line in mine_counts(c) {
            println!("{}", line);
        }
    }
}`,
    tests: [
      { name: '3 by 3 board', input: '*.. / ... / .*.', expected: '*10\n221\n1*1' },
      { name: 'Empty board', input: '(empty)', expected: '' },
      { name: 'One mine', input: '*', expected: '*' },
      { name: 'One row, no mines', input: '...', expected: '000' },
      { name: 'Mines on both ends', input: '*.*', expected: '*2*' },
    ],
  },
]
