// Rust lessons: stage 6 part A, standard collections (the tour, Vec, sorting and searching, VecDeque, HashMap, HashSet).
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end). Check with: node scripts/verify-rust.mjs --stage 6
// Ids must start with r6- and be unique across the track. Each lesson teaches the collection or methods it uses
// (`teach`), lists the syntax ids it introduces, and ends in a small drill that keeps the old harness and tests.

export const LESSONS = [
  // ---------------------------------------------------------------------------------------------
  // 1. the tour: which Rust type replaces which STL container
  {
    id: 'r6-collections-tour',
    title: 'Your STL, in Rust',
    kind: 'concept',
    introduces: ['hashmap', 'btree', 'vecdeque'],
    teach: {
      body: [
        `<p>In C++ you reach for the STL: <code>std::vector</code>, <code>std::deque</code>, <code>std::unordered_map</code>, <code>std::map</code>, <code>std::set</code>, <code>std::priority_queue</code>, and the functions of <code>&lt;algorithm&gt;</code>. Rust's standard library has the same toolbox under different names. <code>Vec</code> you already use. The others live in the module <code>std::collections</code>, so you write <code>use std::collections::HashMap;</code> once at the top of the file (the <code>use</code> from stage 1 brings a path into scope) and then <code>HashMap</code> works as a plain name. Braces import several at once: <code>use std::collections::{HashMap, HashSet};</code>.</p>`,
        `<p>The mapping: <code>std::vector</code> is <code>Vec</code>; <code>std::deque</code> (and <code>std::queue</code>) is <code>VecDeque</code>; <code>std::unordered_map</code> is <code>HashMap</code>; <code>std::map</code> is <code>BTreeMap</code>; <code>std::unordered_set</code> is <code>HashSet</code>; <code>std::set</code> is <code>BTreeSet</code>; <code>std::priority_queue</code> is <code>BinaryHeap</code>; <code>std::stack</code> is just a <code>Vec</code> (<code>push</code> and <code>pop</code>). The functions of <code>&lt;algorithm&gt;</code> (<code>sort</code>, <code>binary_search</code>, <code>find</code>, <code>accumulate</code>, <code>unique</code> and friends) become methods on <code>Vec</code>, on slices and on iterators, so you write <code>v.sort()</code> instead of <code>std::sort(v.begin(), v.end())</code>. There are no begin and end iterator pairs to pass around.</p>`,
        `<p>Two name parts tell you how a type works. <strong>Hash</strong> means a hash table: lookups take O(1) on average and the items come out in no particular order. <strong>BTree</strong> means a balanced search tree, like the red-black tree behind <code>std::map</code>: operations take O(log n) and the items always come out sorted. The method names are shared across both, so switching from one to the other is usually a change of one word.</p>`,
        `<p>To make one, call <code>Type::new()</code>. The element types are usually worked out from the first insertion, or you state them: <code>let m: HashMap&lt;String, i32&gt; = HashMap::new();</code>. To add an item, maps and sets use <code>insert</code> (a map takes a key and a value, a set takes one item) and a <code>VecDeque</code> uses <code>push_back</code>. <code>{:?}</code> prints any of them: a map as <code>{key: value}</code>, a set as <code>{a, b}</code>, a deque as <code>[a, b]</code>. A <code>HashMap</code> or <code>HashSet</code> prints in an arbitrary order that can change between runs, so from here on we sort before printing anything with more than one item. The next lessons teach each collection in turn.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::{BTreeMap, HashMap, HashSet, VecDeque};

fn main() {
    let mut ages: HashMap<String, i32> = HashMap::new();   // key -> value, no order
    ages.insert(String::from("ann"), 30);

    let mut seen: HashSet<i32> = HashSet::new();           // distinct items, no order
    seen.insert(7);

    let mut sorted: BTreeMap<i32, char> = BTreeMap::new(); // key -> value, sorted by key
    sorted.insert(2, 'b');
    sorted.insert(1, 'a');

    let mut line: VecDeque<i32> = VecDeque::new();         // add and remove at both ends
    line.push_back(5);

    println!("{:?}", ages);
    println!("{:?}", seen);
    println!("{:?}", sorted);
    println!("{:?}", line);
}`,
          output: '{"ann": 30}\n{7}\n{1: \'a\', 2: \'b\'}\n[5]',
          caption: 'One of each. The BTreeMap prints in key order even though 2 went in first.',
        },
      ],
      terms: [
        { code: 'use std::collections::HashMap;', meaning: 'brings a collection into scope; Vec needs no import' },
        { code: 'use std::collections::{A, B};', meaning: 'braces import several names from one path' },
        { code: 'HashMap::new()', meaning: 'an empty map; HashSet, BTreeMap, BTreeSet and VecDeque have ::new() too' },
        { code: 'm.insert(k, v)', meaning: 'adds a pair to a map (a set takes one item: s.insert(x))' },
        { code: 'q.push_back(x)', meaning: 'adds an item at the back of a VecDeque' },
        { code: 'Hash... / BTree...', meaning: 'hash table (fast, no order) versus sorted tree (always in order)' },
      ],
    },
    task: 'Make a <code>HashMap</code> with <code>"a"</code> mapped to 1, a <code>HashSet</code> holding 7, a <code>BTreeMap</code> with 2 mapped to 20 and a <code>VecDeque</code> holding 5. Print each one with <code>{:?}</code>.',
    compare: {
      cpp: { code: `std::unordered_map<std::string, int> m;
m["a"] = 1;
std::set<int> s;
s.insert(7);
std::deque<int> d;
d.push_back(5);`, outcome: 'One header per container', ok: true },
      rust: { code: `use std::collections::{HashMap, BTreeSet, VecDeque};
let mut m: HashMap<String, i32> = HashMap::new();
m.insert(String::from("a"), 1);
let mut s: BTreeSet<i32> = BTreeSet::new();
s.insert(7);
let mut d: VecDeque<i32> = VecDeque::new();
d.push_back(5);`, outcome: 'One use line, then the same shape', ok: true },
      text: 'The shape is the same: pick a container, create it, <code>insert</code> or <code>push_back</code>. The difference is the names, and that <code>m.insert(k, v)</code> replaces the C++ <code>m[k] = v</code>.',
    },
    refresher: [
      '<code>Vec</code>, <code>VecDeque</code>, <code>HashMap</code>/<code>BTreeMap</code>, <code>HashSet</code>/<code>BTreeSet</code>, <code>BinaryHeap</code> are the STL containers; <code>&lt;algorithm&gt;</code> becomes methods.',
      'Hash types: O(1) average, no order. BTree types: O(log n), sorted. Import with <code>use std::collections::...;</code>.',
    ],
    hints: [
      'Start with a <code>use std::collections::{...};</code> line naming the four types you need.',
      'Create each with <code>Type::new()</code>, then call <code>insert</code> (the map takes a key and a value) or <code>push_back</code>.',
    ],
    inCpp: {
      code: `std::map<int, int> m;
m[2] = 20;
for (auto& [k, v] : m) std::cout << k << ": " << v << "\\n";`,
      note: '<code>std::map</code> corresponds to <code>BTreeMap</code>, and the sorted traversal is the same. Rust\'s <code>HashMap</code> and <code>HashSet</code> are deliberately randomised, so never rely on their order.',
    },
    starter: `use std::collections::{BTreeMap, HashMap, HashSet, VecDeque};

fn main() {
    // build the four collections, then print each with {:?}
}`,
    solution: `use std::collections::{BTreeMap, HashMap, HashSet, VecDeque};

fn main() {
    let mut m: HashMap<String, i32> = HashMap::new();
    m.insert(String::from("a"), 1);
    let mut s: HashSet<i32> = HashSet::new();
    s.insert(7);
    let mut t: BTreeMap<i32, i32> = BTreeMap::new();
    t.insert(2, 20);
    let mut d: VecDeque<i32> = VecDeque::new();
    d.push_back(5);
    println!("{:?}", m);
    println!("{:?}", s);
    println!("{:?}", t);
    println!("{:?}", d);
}`,
    require: [
      { pattern: 'HashMap\\s*::\\s*new', message: 'Create a HashMap' },
      { pattern: 'HashSet\\s*::\\s*new', message: 'Create a HashSet' },
      { pattern: 'BTreeMap\\s*::\\s*new', message: 'Create a BTreeMap' },
      { pattern: 'VecDeque\\s*::\\s*new', message: 'Create a VecDeque' },
    ],
    tests: [{ name: 'Prints the four collections', expected: '{"a": 1}\n{7}\n{2: 20}\n[5]' }],
  },

  // ---------------------------------------------------------------------------------------------
  // 2. Vec: adding and removing
  {
    id: 'r6-vec-essentials',
    title: 'Vec: add and remove',
    kind: 'drill',
    introduces: [],
    teach: {
      body: [
        `<p><code>Vec&lt;T&gt;</code> is the growable array you have used since stage 1: one block of memory holding the items side by side, exactly like <code>std::vector</code>. It is the default collection. If you have no reason to choose another one, use a <code>Vec</code>. Reading <code>v[i]</code> is O(1), and so is adding or removing at the <em>end</em>.</p>`,
        `<p>At the end: <code>v.push(x)</code> adds, and <code>v.pop()</code> removes the last item and returns it as an <code>Option</code>: <code>Some(x)</code>, or <code>None</code> when the vector is empty. (C++ <code>pop_back()</code> returns nothing, and calling it on an empty vector is undefined behaviour.) In the middle or at the front: <code>v.insert(i, x)</code> puts <code>x</code> at position <code>i</code> and shifts everything after it one place right, and <code>v.remove(i)</code> takes out the item at <code>i</code>, shifts the rest left and <em>returns</em> the removed item. Both are O(n) because of the shifting. Both <em>panic</em> if <code>i</code> is out of range (for <code>insert</code>, <code>i</code> may equal the length, which means "at the end"). So <code>remove(0)</code> on an empty vector panics: check <code>is_empty()</code> first.</p>`,
        `<p>To add a whole slice, use <code>v.extend_from_slice(&amp;other)</code>. It copies every item of a slice (<code>&amp;[T]</code>, which a <code>&amp;Vec&lt;T&gt;</code> or a <code>&amp;[1, 2]</code> converts into) onto the end. <code>v.len()</code> is the number of items and <code>v.is_empty()</code> is <code>true</code> when there are none. Both need only a shared borrow.</p>`,
        `<p>Pitfall: removing from the front of a big vector over and over is O(n) each time, so a loop of <code>remove(0)</code> is O(n²). If you want a queue, use <code>VecDeque</code> (two lessons ahead). The C++ names, for the record: <code>push_back</code> is <code>push</code>, <code>pop_back</code> is <code>pop</code>, <code>insert(begin() + i, x)</code> is <code>insert(i, x)</code>, <code>erase(begin() + i)</code> is <code>remove(i)</code>, appending a range is <code>extend_from_slice</code>, <code>size()</code> is <code>len()</code> and <code>empty()</code> is <code>is_empty()</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let mut v = vec![10, 20, 30];
    v.push(40);                      // [10, 20, 30, 40]
    println!("{:?}", v.pop());       // Some(40): removed from the end
    v.insert(1, 15);                 // 15 goes to index 1: [10, 15, 20, 30]
    let gone = v.remove(0);          // removes and returns 10: [15, 20, 30]
    println!("{} {:?}", gone, v);
}`,
          output: 'Some(40)\n10 [15, 20, 30]',
        },
        {
          code: `fn main() {
    let mut v = vec![1, 2];
    let more = vec![3, 4, 5];
    v.extend_from_slice(&more);      // copies 3, 4, 5 onto the end
    println!("{:?} {}", v, v.len());

    let mut empty: Vec<i32> = Vec::new();
    println!("{:?} {}", empty.pop(), empty.is_empty());   // None true: no panic
}`,
          output: '[1, 2, 3, 4, 5] 5\nNone true',
          caption: '<code>pop</code> on an empty vector is just <code>None</code>. <code>remove(0)</code> there would panic.',
        },
      ],
      terms: [
        { code: 'v.pop()', meaning: 'removes the last item and returns Some(item), or None if empty' },
        { code: 'v.insert(i, x)', meaning: 'puts x at position i and shifts the tail right; O(n); panics if i > len' },
        { code: 'v.remove(i)', meaning: 'removes and returns the item at i, shifting the tail left; O(n); panics if out of range' },
        { code: 'v.extend_from_slice(&other)', meaning: 'appends a copy of every item of a slice' },
        { code: 'v.is_empty()', meaning: 'true when there are no items' },
      ],
    },
    task: 'Write <code>trim_ends</code>: append <code>extra</code> to <code>v</code>, remove the first item (if there is one), pop the last, then insert <code>0</code> at the front. Return the removed first, the popped last, and the sum of <code>v</code> at the end.',
    refresher: [
      '<code>v.remove(i)</code> returns the item and panics if <code>i</code> is out of range. <code>v.pop()</code> returns an <code>Option</code>. <code>v.insert(i, x)</code> shifts the tail right.',
      '<code>v.extend_from_slice(&amp;extra)</code> appends a slice. <code>v.is_empty()</code> guards <code>remove(0)</code>.',
    ],
    hints: [
      '<code>remove(0)</code> on an empty vector panics. Check <code>is_empty()</code> first and build the <code>Option</code> yourself.',
      'Take the first item before you pop the last one: a one-item vector gives <code>Some</code> then <code>None</code>.',
      'For the sum, <code>let total: i32 = v.iter().sum();</code> works on a <code>&amp;mut Vec</code> too.',
    ],
    inCpp: {
      code: 'std::vector<int> v{1, 2, 3};\nv.insert(v.begin(), 0);\nint last = v.back();   // UB if empty\nv.pop_back();          // returns void\nv.erase(v.begin());\nint sum = 0;\nfor (int x : v) sum += x;',
      note: '<code>pop_back</code> returns nothing and <code>back()</code> on an empty vector is undefined, while Rust\'s <code>pop()</code> returns an <code>Option</code> and an out-of-range <code>remove</code> panics with a message.',
    },
    starter: 'fn trim_ends(v: &mut Vec<i32>, extra: &[i32]) -> (Option<i32>, Option<i32>, i32) {\n    (None, None, 0)\n}',
    solution: `fn trim_ends(v: &mut Vec<i32>, extra: &[i32]) -> (Option<i32>, Option<i32>, i32) {
    v.extend_from_slice(extra);
    let first = if v.is_empty() { None } else { Some(v.remove(0)) };
    let last = v.pop();
    v.insert(0, 0);
    let total: i32 = v.iter().sum();
    (first, last, total)
}`,
    harness: `fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>)> = vec![
        (vec![1, 2, 3], vec![4, 5]),
        (vec![], vec![]),
        (vec![7], vec![]),
        (vec![2, 2], vec![2]),
        (vec![], vec![9, 8]),
    ];
    for (i, (v, extra)) in cases.into_iter().enumerate() {
        let mut v = v;
        println!("\\n@@TEST {}@@", i + 1);
        let r = trim_ends(&mut v, &extra);
        println!("{:?} {:?}", r, v);
    }
}`,
    require: [
      { pattern: '\\.extend_from_slice\\(', message: 'Use extend_from_slice' },
      { pattern: '\\.remove\\(', message: 'Use remove' },
      { pattern: '\\.pop\\(', message: 'Use pop' },
      { pattern: '\\.insert\\(', message: 'Use insert' },
    ],
    tests: [
      { name: 'Example', input: '[1,2,3] + [4,5]', expected: '(Some(1), Some(5), 9) [0, 2, 3, 4]' },
      { name: 'Both empty', input: '[] + []', expected: '(None, None, 0) [0]' },
      { name: 'One item', input: '[7] + []', expected: '(Some(7), None, 0) [0]' },
      { name: 'Duplicates', input: '[2,2] + [2]', expected: '(Some(2), Some(2), 2) [0, 2]' },
      { name: 'Only extra', input: '[] + [9,8]', expected: '(Some(9), Some(8), 0) [0]' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 3. Vec: looking and trimming
  {
    id: 'r6-vec-look',
    title: 'Vec: first, last, truncate, reverse',
    kind: 'drill',
    introduces: [],
    teach: {
      body: [
        `<p>Peeking at the ends without removing anything: <code>v.first()</code> and <code>v.last()</code> return an <code>Option&lt;&amp;T&gt;</code>, which is <code>Some(reference to the item)</code>, or <code>None</code> for an empty vector. That replaces C++ <code>front()</code> and <code>back()</code>, which are undefined on an empty vector. Because the item is a <em>reference</em>, an <code>Option&lt;&amp;i32&gt;</code> is not an <code>Option&lt;i32&gt;</code>. Call <code>.copied()</code> on the option to copy the number out: <code>v.first().copied()</code> is an <code>Option&lt;i32&gt;</code> (it works for any <code>Copy</code> type).</p>`,
        `<p><code>v.contains(&amp;x)</code> answers "is this value in the vector?" by comparing every item, so it is O(n). It is fine for short vectors; for many lookups, a <code>HashSet</code> (later in this stage) is the right tool. It is the same job as <code>std::find(...) != v.end()</code>.</p>`,
        `<p>Shrinking and reordering in place: <code>v.truncate(n)</code> keeps only the first <code>n</code> items and drops the rest (it does nothing if the vector is already shorter than <code>n</code>, and never panics). <code>v.clear()</code> removes everything. <code>v.reverse()</code> reverses the order in place (<code>std::reverse</code>). <code>v.swap(i, j)</code> exchanges two items (you saw it in stage 2) and panics if either index is out of range. All of these need the vector to be <code>mut</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let v = vec![4, 8, 15];
    println!("{:?} {:?}", v.first(), v.last());      // Some(4) Some(15): references
    let empty: Vec<i32> = Vec::new();
    println!("{:?}", empty.first());                  // None: no crash
    let a: Option<i32> = v.first().copied();         // copy the number out of the reference
    println!("{:?} {}", a, v.contains(&8));          // Some(4) true
}`,
          output: 'Some(4) Some(15)\nNone\nSome(4) true',
        },
        {
          code: `fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    v.reverse();                    // [5, 4, 3, 2, 1]
    v.truncate(3);                  // keep the first three: [5, 4, 3]
    println!("{:?}", v);
    v.swap(0, 2);                   // [3, 4, 5]
    println!("{:?}", v);
    v.clear();
    println!("{} {}", v.len(), v.is_empty());   // 0 true
}`,
          output: '[5, 4, 3]\n[3, 4, 5]\n0 true',
        },
      ],
      terms: [
        { code: 'v.first() / v.last()', meaning: 'Some(&item) at either end, or None if empty' },
        { code: 'opt.copied()', meaning: 'turns Option<&i32> into Option<i32> (for Copy types)' },
        { code: 'v.contains(&x)', meaning: 'true if some item equals x; O(n)' },
        { code: 'v.truncate(n)', meaning: 'keeps the first n items; does nothing if already shorter' },
        { code: 'v.reverse()', meaning: 'reverses the vector in place' },
        { code: 'v.clear()', meaning: 'removes every item' },
      ],
    },
    task: 'Write <code>tidy</code>: reverse <code>v</code> in place, keep only the first 3 items, then return the first item, the last item (both as <code>Option&lt;i32&gt;</code>) and whether <code>target</code> is still in <code>v</code>.',
    refresher: [
      '<code>v.first()</code> and <code>v.last()</code> give <code>Option&lt;&amp;T&gt;</code>; <code>.copied()</code> makes it <code>Option&lt;T&gt;</code>. <code>v.truncate(n)</code> never panics.',
      '<code>v.reverse()</code> works in place. <code>v.contains(&amp;x)</code> is an O(n) scan.',
    ],
    hints: [
      'Reverse first, then truncate: the kept items are the last three of the original.',
      'Compute the results after the changes, so they describe the vector as it is at the end.',
      '<code>v.first().copied()</code> gives the <code>Option&lt;i32&gt;</code> you need to return.',
    ],
    inCpp: {
      code: 'std::vector<int> v{1, 2, 3, 4, 5};\nstd::reverse(v.begin(), v.end());\nif (v.size() > 3) v.resize(3);\nint first = v.front();   // UB if empty\nbool has = std::find(v.begin(), v.end(), 4) != v.end();',
      note: '<code>truncate(3)</code> is the "only if longer" resize in one call, and <code>first()</code> returns an <code>Option</code> instead of being undefined on an empty vector.',
    },
    starter: 'fn tidy(v: &mut Vec<i32>, target: i32) -> (Option<i32>, Option<i32>, bool) {\n    (None, None, false)\n}',
    solution: `fn tidy(v: &mut Vec<i32>, target: i32) -> (Option<i32>, Option<i32>, bool) {
    v.reverse();
    v.truncate(3);
    (v.first().copied(), v.last().copied(), v.contains(&target))
}`,
    harness: `fn main() {
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![1, 2, 3, 4, 5], 4),
        (vec![], 1),
        (vec![7], 7),
        (vec![1, 2, 3, 4, 5, 6], 1),
        (vec![2, 2], 2),
    ];
    for (i, (v, target)) in cases.into_iter().enumerate() {
        let mut v = v;
        println!("\\n@@TEST {}@@", i + 1);
        let r = tidy(&mut v, target);
        println!("{:?} {:?}", r, v);
    }
}`,
    require: [
      { pattern: '\\.reverse\\(', message: 'Use reverse' },
      { pattern: '\\.truncate\\(', message: 'Use truncate' },
      { pattern: '\\.first\\(', message: 'Use first' },
      { pattern: '\\.last\\(', message: 'Use last' },
      { pattern: '\\.contains\\(', message: 'Use contains' },
    ],
    tests: [
      { name: 'Example', input: '[1,2,3,4,5], target 4', expected: '(Some(5), Some(3), true) [5, 4, 3]' },
      { name: 'Empty', input: '[], target 1', expected: '(None, None, false) []' },
      { name: 'One item', input: '[7], target 7', expected: '(Some(7), Some(7), true) [7]' },
      { name: 'Target cut off', input: '[1..6], target 1', expected: '(Some(6), Some(4), false) [6, 5, 4]' },
      { name: 'Duplicates', input: '[2,2], target 2', expected: '(Some(2), Some(2), true) [2, 2]' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 4. sorting
  {
    id: 'r6-sort-family',
    title: 'The sort family',
    kind: 'drill',
    introduces: [],
    teach: {
      body: [
        `<p>You wrote sorting algorithms by hand in stage 4. In practice you call a method. <code>v.sort()</code> sorts a <code>Vec</code> or slice in place, smallest first, and needs the items to be <code>Ord</code> (numbers, <code>char</code>, <code>String</code>, tuples of those, ...). It runs in O(n log n) and is <em>stable</em>: items that compare equal keep their original order. That makes it the counterpart of C++ <code>std::stable_sort</code>, not of <code>std::sort</code>. The counterpart of <code>std::sort</code> is <code>v.sort_unstable()</code>: it may reorder equal items, uses no extra memory and is usually a bit faster. For plain numbers, equal items are indistinguishable, so <code>sort_unstable</code> is a fine default.</p>`,
        `<p>For any other order, <code>v.sort_by(|a, b| ...)</code> takes a closure that receives two <em>references</em> and returns an <code>Ordering</code> (<code>Less</code>, <code>Equal</code> or <code>Greater</code>). <code>a.cmp(b)</code> gives the natural order, and swapping the two, <code>b.cmp(a)</code>, gives descending order. This replaces the C++ comparator that returns <code>bool</code>. To break ties, chain <code>.then_with(|| ...)</code>: it keeps the first <code>Ordering</code> unless it is <code>Equal</code>, in which case it runs the closure to get the second one. (<code>||</code> with nothing between the bars is a closure that takes no parameters.) So <code>a.len().cmp(&amp;b.len()).then_with(|| a.cmp(b))</code> means "shorter first, and alphabetical among equals".</p>`,
        `<p><code>v.sort_by_key(|x| key)</code> is the short form when each item has one sort key: the closure gets a reference to an item and returns the key to compare. A tuple works as a key, since tuples compare field by field, so <code>|p| (p.age, p.name.len())</code> sorts by age and then by name length. Limits: the key may not borrow from the item (returning a <code>&amp;String</code> from the closure is a compile error; clone it or use <code>sort_by</code>), and it cannot descend by itself (a later lesson shows <code>Reverse</code> for that). Floats are not <code>Ord</code>, so for them use <code>sort_by(|a, b| a.total_cmp(b))</code> as in stage 3.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let mut v = vec![3, 1, 2];
    v.sort();                              // ascending: [1, 2, 3]
    println!("{:?}", v);
    v.sort_by(|a, b| b.cmp(a));            // swap a and b: descending
    println!("{:?}", v);
    let mut w = vec!["pear", "fig", "apple"];
    w.sort_by_key(|s| s.len());            // by length: fig(3) pear(4) apple(5)
    println!("{:?}", w);
}`,
          output: '[1, 2, 3]\n[3, 2, 1]\n["fig", "pear", "apple"]',
        },
        {
          code: `fn main() {
    let mut w = vec!["bb", "a", "cc", "aa"];
    // longer first; when two lengths are equal, alphabetical
    w.sort_by(|x, y| y.len().cmp(&x.len()).then_with(|| x.cmp(y)));
    println!("{:?}", w);
}`,
          output: '["aa", "bb", "cc", "a"]',
          caption: '<code>y.len().cmp(&amp;x.len())</code> has the two sides swapped, so longer comes first.',
        },
        {
          code: `fn main() {
    let mut p = vec![("b", 1), ("a", 1), ("c", 0)];
    p.sort_by_key(|t| t.1);                // sort by the second field only
    println!("{:?}", p);                   // stable: "b" stays before "a"
}`,
          output: '[("c", 0), ("b", 1), ("a", 1)]',
        },
      ],
      terms: [
        { code: 'v.sort()', meaning: 'sorts in place, ascending, stable; needs Ord (like std::stable_sort)' },
        { code: 'v.sort_unstable()', meaning: 'sorts in place; equal items may swap places (like std::sort)' },
        { code: 'v.sort_by(|a, b| a.cmp(b))', meaning: 'sorts with a closure returning an Ordering; b.cmp(a) is descending' },
        { code: '.then_with(|| ...)', meaning: 'on an Equal result, falls back to a second comparison' },
        { code: 'v.sort_by_key(|x| key)', meaning: 'sorts by a key computed from each item (tuples work as keys)' },
      ],
    },
    task: 'Write <code>rank</code>: sort the words by length, longest first, and alphabetically when the lengths tie. Use <code>sort_by</code> with <code>then_with</code>.',
    refresher: [
      '<code>v.sort_by(|a, b| a.cmp(b))</code>; <code>cmp</code> returns an <code>Ordering</code>, and <code>.then_with(|| ...)</code> breaks ties. <code>b.cmp(a)</code> reverses the order.',
      '<code>sort</code> is stable; <code>sort_unstable</code> is faster and may reorder equal items; <code>sort_by_key</code> takes a key closure.',
    ],
    hints: [
      'Compare lengths with the arguments swapped to get longest first.',
      'The comparator is a closure that returns an <code>Ordering</code>; chain the alphabetical comparison after the length one.',
      'The sort is in place, so make the vector <code>mut</code> and return it at the end.',
    ],
    inCpp: {
      code: 'std::vector<std::string> w;\nstd::sort(w.begin(), w.end(), [](const std::string& a, const std::string& b) {\n    if (a.size() != b.size()) return a.size() > b.size();\n    return a < b;\n});',
      note: 'C++ comparators return a <code>bool</code> and tie-breaking is a hand-written <code>if</code> chain. Rust\'s <code>cmp</code> returns an <code>Ordering</code> that you chain with <code>then_with</code>.',
    },
    starter: 'fn rank(mut words: Vec<String>) -> Vec<String> {\n    words\n}',
    solution: `fn rank(mut words: Vec<String>) -> Vec<String> {
    words.sort_by(|a, b| b.len().cmp(&a.len()).then_with(|| a.cmp(b)));
    words
}`,
    harness: `fn main() {
    let cases: Vec<Vec<&str>> = vec![
        vec!["pear", "fig", "apple", "kiwi", "date"],
        vec![],
        vec!["solo"],
        vec!["b", "a", "b", "a"],
        vec!["bb", "a", "cc", "aa"],
    ];
    for (i, c) in cases.into_iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        let words: Vec<String> = c.iter().map(|s| s.to_string()).collect();
        println!("{}", rank(words).join(" "));
    }
}`,
    require: [
      { pattern: '\\.sort_by\\s*\\(', message: 'Use sort_by' },
      { pattern: 'then_with', message: 'Break ties with then_with' },
    ],
    tests: [
      { name: 'Example', input: 'pear fig apple kiwi date', expected: 'apple date kiwi pear fig' },
      { name: 'Empty list', input: '(empty)', expected: '' },
      { name: 'One word', input: 'solo', expected: 'solo' },
      { name: 'Duplicates', input: 'b a b a', expected: 'a a b b' },
      { name: 'Ties by length', input: 'bb a cc aa', expected: 'aa bb cc a' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 5. binary search
  {
    id: 'r6-binary-search',
    title: 'binary_search and partition_point',
    kind: 'drill',
    introduces: [],
    teach: {
      body: [
        `<p>You wrote binary search by hand in stage 4. The standard library has it built in for any <em>sorted</em> slice (a <code>Vec</code> converts automatically). It takes O(log n). If the data is not sorted, the answer is meaningless, but there is no panic and no warning, so keep the sorted-ness in mind.</p>`,
        `<p><code>s.binary_search(&amp;x)</code> returns a <code>Result&lt;usize, usize&gt;</code>. <code>Ok(i)</code> means "found, at index <code>i</code>". <code>Err(i)</code> means "not found, and <code>i</code> is the position where <code>x</code> would have to be inserted to keep the slice sorted". Both carry a position, so you usually <code>match</code> on it, or call <code>.is_ok()</code> for a plain yes or no. When the value occurs several times, you get <em>some</em> matching index, not necessarily the first one.</p>`,
        `<p>To ask "how many items are smaller than <code>x</code>", or to find the first item that is not, use <code>s.partition_point(|&amp;v| v &lt; x)</code>. It requires the slice to be <em>partitioned</em> by the closure (every item for which it is <code>true</code> comes before every item for which it is <code>false</code>, which sorted data and a test like <code>v &lt; x</code> satisfy), and it returns the index of the first item where the closure is <code>false</code>. The closure receives a reference to an item, and the pattern <code>|&amp;v|</code> copies the number out of it, as <code>for &amp;n in</code> did earlier. The C++ counterparts: <code>std::binary_search</code> is <code>.binary_search(&amp;x).is_ok()</code>, <code>lower_bound</code> is <code>partition_point(|&amp;v| v &lt; x)</code> and <code>upper_bound</code> is <code>partition_point(|&amp;v| v &lt;= x)</code>. You get an index, not an iterator, so there is no <code>end()</code> to compare with.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let s = [1, 3, 5, 7];
    println!("{:?}", s.binary_search(&5));   // Ok(2): found at index 2
    println!("{:?}", s.binary_search(&4));   // Err(2): would be inserted at index 2
    println!("{:?}", s.binary_search(&9));   // Err(4): past the end
    match s.binary_search(&3) {
        Ok(i) => println!("found at {}", i),
        Err(i) => println!("insert at {}", i),
    }
}`,
          output: 'Ok(2)\nErr(2)\nErr(4)\nfound at 1',
        },
        {
          code: `fn main() {
    let s = [1, 2, 2, 2, 5];
    let lower = s.partition_point(|&v| v < 2);    // items below 2
    let upper = s.partition_point(|&v| v <= 2);   // items up to and including 2
    println!("{} {} {}", lower, upper, upper - lower);   // how many 2s there are
}`,
          output: '1 4 3',
          caption: 'The two calls are <code>lower_bound</code> and <code>upper_bound</code>; their difference counts the 2s.',
        },
      ],
      terms: [
        { code: 's.binary_search(&x)', meaning: 'Ok(index) if found, Err(insert position) if not; the slice must be sorted' },
        { code: 's.partition_point(|&v| v < x)', meaning: 'index of the first item for which the closure is false (here: how many are below x)' },
        { code: '|&v|', meaning: 'a closure parameter that copies the number out of a reference' },
        { code: 'Ok(i) / Err(i)', meaning: 'the two cases of a Result; here both hold a position' },
      ],
    },
    task: 'In a sorted slice, <code>search</code> returns <code>"found"</code> or <code>"insert at i"</code> using <code>binary_search</code>. <code>count_less</code> returns how many items are below <code>x</code> using <code>partition_point</code>; it must work with duplicates.',
    refresher: [
      '<code>s.binary_search(&amp;x)</code> returns <code>Ok(index)</code> if found, or <code>Err(index)</code> where <code>x</code> would be inserted to keep the slice sorted.',
      '<code>s.partition_point(|&amp;v| v &lt; x)</code> returns the index of the first item for which the predicate is false.',
    ],
    hints: [
      '<code>binary_search</code> returns a <code>Result</code>: match on both arms.',
      'With duplicates, <code>binary_search</code> may return any matching index. Count items below <code>x</code> with the other method.',
      'The predicate for <code>partition_point</code> is true for every item below <code>x</code>, then false.',
    ],
    inCpp: {
      code: 'std::vector<int> s{1, 3, 5, 7};\nbool found = std::binary_search(s.begin(), s.end(), 5);\nauto it = std::lower_bound(s.begin(), s.end(), 4);\nsize_t pos = it - s.begin();   // insert position',
      note: 'C++ splits "is it there" (<code>binary_search</code>, a bool) from "where does it go" (<code>lower_bound</code>). Rust\'s <code>binary_search</code> answers both: <code>Ok</code> with the index, or <code>Err</code> with the insert position.',
    },
    starter: 'fn search(sorted: &[i32], x: i32) -> String {\n    String::new()\n}\n\nfn count_less(sorted: &[i32], x: i32) -> usize {\n    0\n}',
    solution: `fn search(sorted: &[i32], x: i32) -> String {
    match sorted.binary_search(&x) {
        Ok(_) => "found".to_string(),
        Err(i) => format!("insert at {}", i),
    }
}

fn count_less(sorted: &[i32], x: i32) -> usize {
    sorted.partition_point(|&v| v < x)
}`,
    harness: `fn main() {
    let cases: Vec<(Vec<i32>, i32)> = vec![
        (vec![1, 3, 5, 7], 5),
        (vec![1, 3, 5, 7], 4),
        (vec![], 3),
        (vec![1, 2, 2, 2, 5], 2),
        (vec![1, 2, 2, 2, 5], 9),
        (vec![4], 1),
    ];
    for (i, (s, x)) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", search(s, *x));
        println!("{}", count_less(s, *x));
    }
}`,
    require: [
      { pattern: '\\.binary_search\\(', message: 'Use binary_search' },
      { pattern: '\\.partition_point\\(', message: 'Use partition_point' },
    ],
    tests: [
      { name: 'Present', input: '[1,3,5,7], 5', expected: 'found\n2' },
      { name: 'Absent, middle', input: '[1,3,5,7], 4', expected: 'insert at 2\n2' },
      { name: 'Empty slice', input: '[], 3', expected: 'insert at 0\n0' },
      { name: 'Duplicates present', input: '[1,2,2,2,5], 2', expected: 'found\n1' },
      { name: 'Larger than all', input: '[1,2,2,2,5], 9', expected: 'insert at 5\n5' },
      { name: 'Smaller than all', input: '[4], 1', expected: 'insert at 0\n0' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 6. retain, dedup, drain
  {
    id: 'r6-dedup-retain-drain',
    title: 'retain, dedup, drain',
    kind: 'drill',
    introduces: [],
    teach: {
      body: [
        `<p>Three methods remove items from a vector in place. <code>v.retain(|&amp;x| x &gt; 0)</code> keeps the items for which the closure returns <code>true</code> and drops the rest, preserving the order. It takes one pass, O(n). The closure receives a reference to each item, which is why the pattern <code>|&amp;x|</code> copies the number out. This is the C++ erase-remove idiom, <code>v.erase(std::remove_if(...), v.end())</code>, in one call.</p>`,
        `<p><code>v.dedup()</code> removes <em>consecutive</em> equal items, leaving the first of each run (O(n); the items must support <code>==</code>). It does not find duplicates that are far apart, so to remove all duplicates, <code>sort()</code> first and then <code>dedup()</code>. That is <code>std::sort</code> plus <code>std::unique</code> plus <code>erase</code>, without having to erase the leftover tail yourself.</p>`,
        `<p><code>v.drain(range)</code> removes the items in a range and hands them to you as an iterator. The ranges are the ones from slicing: <code>..n</code> for the first <code>n</code> items, <code>a..b</code> for the items from <code>a</code> up to (not including) <code>b</code>, and <code>..</code> for everything. Finish with <code>.collect()</code> to keep them: <code>let front: Vec&lt;i32&gt; = v.drain(..2).collect();</code>. The remaining items shift down, so it is O(n), and it <em>panics</em> if the range reaches past the end, so limit it with <code>v.len().min(n)</code>. Even if you ignore the returned items, the range is removed.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let mut v = vec![3, -1, 4, -1, 5];
    v.retain(|&x| x > 0);          // keep only the positive ones, in order
    println!("{:?}", v);
}`,
          output: '[3, 4, 5]',
        },
        {
          code: `fn main() {
    let mut v = vec![1, 1, 2, 2, 1];
    v.dedup();                     // only neighbours merge: [1, 2, 1]
    println!("{:?}", v);

    let mut w = vec![3, 1, 3, 2, 1];
    w.sort();                      // [1, 1, 2, 3, 3]
    w.dedup();                     // now every duplicate is a neighbour: [1, 2, 3]
    println!("{:?}", w);
}`,
          output: '[1, 2, 1]\n[1, 2, 3]',
        },
        {
          code: `fn main() {
    let mut v = vec![10, 20, 30, 40, 50];
    let front: Vec<i32> = v.drain(..2).collect();   // removes 10 and 20, gives them to you
    println!("{:?} {:?}", front, v);
    let mid: Vec<i32> = v.drain(1..2).collect();    // removes the item at index 1
    println!("{:?} {:?}", mid, v);
}`,
          output: '[10, 20] [30, 40, 50]\n[40] [30, 50]',
        },
      ],
      terms: [
        { code: 'v.retain(|&x| cond)', meaning: 'keeps the items for which cond is true, in order' },
        { code: 'v.dedup()', meaning: 'removes consecutive duplicates (sort first to remove all)' },
        { code: 'v.drain(..n)', meaning: 'removes the first n items and yields them; panics if n > len' },
        { code: 'v.drain(a..b)', meaning: 'removes the items from a up to b; collect() keeps them' },
      ],
    },
    task: 'Write <code>clean</code>: use <code>drain</code> to remove the first two items of <code>v</code> (fewer if it is shorter) and return them; then <code>retain</code> only the positive numbers; then <code>dedup</code> the rest.',
    refresher: [
      '<code>v.drain(..n)</code> removes a range and yields the removed items; it panics if the range is out of bounds. Collect it into a <code>Vec</code>.',
      '<code>v.retain(|&amp;x| x &gt; 0)</code> keeps matching items. <code>v.dedup()</code> removes only <em>consecutive</em> equal items.',
    ],
    hints: [
      'The drain range must not go past <code>v.len()</code>: take the smaller of 2 and the length.',
      'Order matters: drain first, then filter, then dedup. Removing negatives can make equal items neighbours.',
      '<code>retain</code> takes a closure that gets a reference to each item.',
    ],
    inCpp: {
      code: 'std::vector<int> v{1, 1, 2, -5, 2};\nv.erase(std::remove_if(v.begin(), v.end(),\n    [](int x) { return x <= 0; }), v.end());\nv.erase(std::unique(v.begin(), v.end()), v.end());',
      note: 'C++ needs the erase-remove idiom: <code>remove_if</code> and <code>unique</code> only move items and you must erase the leftover tail yourself. <code>retain</code> and <code>dedup</code> do the whole job in one call.',
    },
    starter: 'fn clean(v: &mut Vec<i32>) -> Vec<i32> {\n    Vec::new()\n}',
    solution: `fn clean(v: &mut Vec<i32>) -> Vec<i32> {
    let n = v.len().min(2);
    let removed: Vec<i32> = v.drain(..n).collect();
    v.retain(|&x| x > 0);
    v.dedup();
    removed
}`,
    harness: `fn main() {
    let cases: Vec<Vec<i32>> = vec![
        vec![1, 1, 2, -5, 2, 2, 7],
        vec![],
        vec![4],
        vec![3, 3, 3, 3, 3],
        vec![-1, -2, -3, 5],
    ];
    for (i, c) in cases.into_iter().enumerate() {
        let mut v = c;
        println!("\\n@@TEST {}@@", i + 1);
        let removed = clean(&mut v);
        println!("{:?} {:?}", removed, v);
    }
}`,
    require: [
      { pattern: '\\.drain\\(', message: 'Use drain' },
      { pattern: '\\.retain\\(', message: 'Use retain' },
      { pattern: '\\.dedup\\(', message: 'Use dedup' },
    ],
    tests: [
      { name: 'Example', input: '[1,1,2,-5,2,2,7]', expected: '[1, 1] [2, 7]' },
      { name: 'Empty', input: '[]', expected: '[] []' },
      { name: 'One item', input: '[4]', expected: '[4] []' },
      { name: 'All duplicates', input: '[3,3,3,3,3]', expected: '[3, 3] [3]' },
      { name: 'Negatives', input: '[-1,-2,-3,5]', expected: '[-1, -2] [5]' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 7. VecDeque basics
  {
    id: 'r6-vecdeque-basics',
    title: 'VecDeque: a queue with two ends',
    kind: 'drill',
    introduces: ['vecdeque'],
    teach: {
      body: [
        `<p>A <code>Vec</code> is fast at the back and slow at the front: <code>insert(0, x)</code> and <code>remove(0)</code> shift every item, O(n). A <code>VecDeque</code> (say "vec-deck", a double-ended queue) fixes that. It stores its items in a ring buffer, so adding and removing at <em>both</em> ends is O(1). Use it for queues (breadth-first search, scheduling, simulations) and for sliding windows. Bring it in with <code>use std::collections::VecDeque;</code>.</p>`,
        `<p>The methods: <code>push_back(x)</code> and <code>push_front(x)</code> add at the two ends. <code>pop_front()</code> and <code>pop_back()</code> remove from them and return an <code>Option</code> (<code>None</code> when empty). <code>front()</code> and <code>back()</code> look without removing and return <code>Option&lt;&amp;T&gt;</code>. <code>len()</code>, <code>is_empty()</code> and <code>iter()</code> work as on a <code>Vec</code>, and <code>d[i]</code> reads position <code>i</code> (index 0 is the front) in O(1), panicking when out of range. Make one with <code>VecDeque::new()</code>, or from a vector with <code>VecDeque::from(vec![1, 2, 3])</code>. <code>{:?}</code> prints it as <code>[1, 2, 3]</code>.</p>`,
        `<p>The queue loop is the idiom you will write again and again: <code>while let Some(x) = q.pop_front() { ... q.push_back(y); ... }</code>. It takes items from the front until the queue is empty, and the body may add new work at the back. In C++ this is <code>std::queue</code> (<code>push</code>, <code>front</code>, <code>pop</code>), or <code>std::deque</code> if you need both ends. The difference: <code>front()</code> on an empty C++ queue is undefined behaviour, while <code>pop_front()</code> here is just <code>None</code>, and it also returns the item, so you do not need a separate <code>front()</code> and <code>pop()</code>.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::VecDeque;

fn main() {
    let mut d: VecDeque<i32> = VecDeque::new();
    d.push_back(2);                         // [2]
    d.push_back(3);                         // [2, 3]
    d.push_front(1);                        // [1, 2, 3]
    println!("{:?} len {}", d, d.len());
    println!("{:?} {:?}", d.front(), d.back());   // Some(1) Some(3)
    println!("{:?}", d.pop_front());        // Some(1): removed from the front
    println!("{:?} {}", d, d[0]);           // [2, 3] 2
}`,
          output: '[1, 2, 3] len 3\nSome(1) Some(3)\nSome(1)\n[2, 3] 2',
        },
        {
          code: `use std::collections::VecDeque;

fn main() {
    let mut q = VecDeque::from(vec![1, 2, 3]);
    while let Some(x) = q.pop_front() {     // take from the front until empty
        println!("{}", x);
        if x == 1 {
            q.push_back(10);                // new work goes to the back
        }
    }
}`,
          output: '1\n2\n3\n10',
          caption: 'The 10 is handled last because it joined the back of the line.',
        },
      ],
      terms: [
        { code: 'VecDeque::new()', meaning: 'an empty double-ended queue (needs use std::collections::VecDeque;)' },
        { code: 'q.push_back(x) / q.push_front(x)', meaning: 'add at the back / front, O(1)' },
        { code: 'q.pop_front() / q.pop_back()', meaning: 'remove from an end and return Some(item), or None if empty' },
        { code: 'q.front() / q.back()', meaning: 'look at an end without removing: Option<&T>' },
        { code: 'VecDeque::from(vec)', meaning: 'builds a deque from a Vec' },
      ],
    },
    task: 'Write <code>serve</code>: person <code>i</code> needs <code>counts[i]</code> turns. Everyone waits in a queue. Serve the front person one turn, and send them to the back if they still need more. Return the ids in the order they are served.',
    refresher: [
      '<code>use std::collections::VecDeque;</code> Both ends are O(1): <code>push_back</code>, <code>push_front</code>, <code>pop_back</code>, <code>pop_front</code> (the pops return <code>Option</code>).',
      '<code>while let Some(x) = q.pop_front() { ... }</code> is the queue loop; <code>q.push_back(y)</code> inside it adds work.',
    ],
    hints: [
      'Put pairs <code>(id, turns_left)</code> in the queue. A person who needs 0 turns never joins it.',
      'Pop the front pair, record the id, and push <code>(id, left - 1)</code> to the back only when more turns are needed.',
      'Loop with <code>while let Some((id, left)) = q.pop_front()</code>.',
    ],
    inCpp: {
      code: 'std::queue<std::pair<int, int>> q;\nq.push({0, 2});\nwhile (!q.empty()) {\n    auto [id, left] = q.front();\n    q.pop();\n    if (left > 1) q.push({id, left - 1});\n}',
      note: 'C++ needs <code>empty()</code>, <code>front()</code> and <code>pop()</code> as three steps. <code>while let Some(x) = q.pop_front()</code> does all three and cannot touch an empty queue.',
    },
    starter: 'use std::collections::VecDeque;\n\nfn serve(counts: &[usize]) -> Vec<usize> {\n    Vec::new()\n}',
    solution: `use std::collections::VecDeque;

fn serve(counts: &[usize]) -> Vec<usize> {
    let mut q: VecDeque<(usize, usize)> = VecDeque::new();
    for (i, &c) in counts.iter().enumerate() {
        if c > 0 {
            q.push_back((i, c));
        }
    }
    let mut order = Vec::new();
    while let Some((id, left)) = q.pop_front() {
        order.push(id);
        if left > 1 {
            q.push_back((id, left - 1));
        }
    }
    order
}`,
    harness: `fn harness_show(v: &[usize]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
}

fn main() {
    let cases: Vec<Vec<usize>> = vec![
        vec![2, 1, 3],
        vec![],
        vec![1],
        vec![0, 2],
        vec![3, 3],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", harness_show(&serve(c)));
    }
}`,
    require: [
      { pattern: 'VecDeque', message: 'Use a VecDeque' },
      { pattern: '\\.pop_front\\(', message: 'Use pop_front' },
      { pattern: '\\.push_back\\(', message: 'Use push_back' },
    ],
    tests: [
      { name: 'Example', input: '[2,1,3]', expected: '0 1 2 0 2 2' },
      { name: 'Nobody waiting', input: '[]', expected: '' },
      { name: 'One person, one turn', input: '[1]', expected: '0' },
      { name: 'Someone needs nothing', input: '[0,2]', expected: '1 1' },
      { name: 'Alternating', input: '[3,3]', expected: '0 1 0 1 0 1' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 8. VecDeque: sliding window maximum
  {
    id: 'r6-vecdeque',
    title: 'VecDeque: sliding window maximum',
    kind: 'drill',
    introduces: [],
    teach: {
      body: [
        `<p>The classic use of a deque that is not a plain queue: the maximum of every window of <code>k</code> consecutive items, in O(n) overall. The idea is to keep a deque of <em>indices</em> whose values go down from front to back. The front is always the index of the largest value in the current window.</p>`,
        `<p>For each new index <code>i</code>: first, while the value at the <em>back</em> of the deque is not larger than the new value, pop the back, because those items can never be a maximum again (the new item is at least as big and stays in the window longer). Then push <code>i</code> at the back. Finally, if the index at the <em>front</em> has fallen out of the window (it is at most <code>i - k</code>), pop it from the front. Once the first full window exists, <code>nums[front]</code> is its maximum.</p>`,
        `<p>Peeking at the back is <code>dq.back()</code>, an <code>Option&lt;&amp;usize&gt;</code> (a reference to an index). The loop <code>while let Some(&amp;b) = dq.back() { ... }</code> uses the pattern <code>&amp;b</code> to copy the index out of that reference, so <code>b</code> is a plain <code>usize</code>. Copying it out also ends the borrow of <code>dq</code>, which is why <code>dq.pop_back()</code> is allowed inside the loop body.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::VecDeque;

fn main() {
    let nums = [1, 3, 2, 5];
    let mut dq: VecDeque<usize> = VecDeque::new();   // indices; their values decrease
    for i in 0..nums.len() {
        while let Some(&b) = dq.back() {             // b: the index at the back
            if nums[b] <= nums[i] {
                dq.pop_back();                       // too small to matter any more
            } else {
                break;
            }
        }
        dq.push_back(i);
        println!("after {}: {:?}", nums[i], dq);
    }
}`,
          output: 'after 1: [0]\nafter 3: [1]\nafter 2: [1, 2]\nafter 5: [3]',
          caption: 'The values at the stored indices always decrease from front to back, and a big value clears the smaller ones behind it.',
        },
      ],
      terms: [
        { code: 'while let Some(&b) = dq.back()', meaning: 'peek at the back; &b copies the index out of the reference' },
        { code: 'dq[0]', meaning: 'the front item of a VecDeque, by position' },
      ],
    },
    task: 'Write <code>window_max</code>: the maximum of every window of <code>k</code> consecutive items (k is at least 1). Keep a <code>VecDeque</code> of indices whose values decrease from front to back.',
    refresher: [
      '<code>use std::collections::VecDeque;</code> Both ends are O(1): <code>push_back</code>, <code>push_front</code>, <code>pop_back</code>, <code>pop_front</code>.',
      '<code>front()</code> and <code>back()</code> return an <code>Option&lt;&amp;T&gt;</code>; <code>dq[0]</code> indexes directly.',
    ],
    hints: [
      'For each new index, pop from the back while its value is not larger than the new value, then push the new index.',
      'If the index at the front has left the window (<code>i + 1 - k</code> is the window start), pop it from the front.',
      'Record <code>nums[front]</code> once the first full window exists, that is when <code>i + 1 &gt;= k</code>.',
    ],
    inCpp: {
      code: 'std::deque<int> dq;\ndq.push_back(1);\ndq.push_front(0);\nint f = dq.front();   // UB if empty\ndq.pop_back();',
      note: '<code>std::deque</code> and <code>VecDeque</code> have the same operations. Rust\'s <code>front()</code> and <code>back()</code> return an <code>Option</code> instead of undefined behaviour on an empty queue.',
    },
    starter: 'use std::collections::VecDeque;\n\nfn window_max(nums: &[i32], k: usize) -> Vec<i32> {\n    Vec::new()\n}',
    solution: `use std::collections::VecDeque;

fn window_max(nums: &[i32], k: usize) -> Vec<i32> {
    let mut dq: VecDeque<usize> = VecDeque::new();
    let mut out = Vec::new();
    for i in 0..nums.len() {
        while let Some(&b) = dq.back() {
            if nums[b] <= nums[i] {
                dq.pop_back();
            } else {
                break;
            }
        }
        dq.push_back(i);
        if let Some(&f) = dq.front() {
            if f + k <= i {
                dq.pop_front();
            }
        }
        if i + 1 >= k {
            out.push(nums[dq[0]]);
        }
    }
    out
}`,
    harness: `fn harness_show(v: &[i32]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
}

fn main() {
    let cases: Vec<(Vec<i32>, usize)> = vec![
        (vec![1, 3, -1, -3, 5, 3, 6, 7], 3),
        (vec![], 3),
        (vec![4], 1),
        (vec![2, 2, 2], 2),
        (vec![9, 8, 7, 6], 2),
        (vec![1, 2, 3], 5),
    ];
    for (i, (v, k)) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", harness_show(&window_max(v, *k)));
    }
}`,
    require: [{ pattern: 'VecDeque', message: 'Use a VecDeque' }],
    tests: [
      { name: 'Example', input: '[1,3,-1,-3,5,3,6,7], k=3', expected: '3 3 5 5 6 7' },
      { name: 'Empty', input: '[], k=3', expected: '' },
      { name: 'One item', input: '[4], k=1', expected: '4' },
      { name: 'Duplicates', input: '[2,2,2], k=2', expected: '2 2' },
      { name: 'Decreasing', input: '[9,8,7,6], k=2', expected: '9 8 7' },
      { name: 'Window too large', input: '[1,2,3], k=5', expected: '' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 9. HashMap basics
  {
    id: 'r6-hashmap-basics',
    title: 'HashMap: insert, get, remove',
    kind: 'drill',
    introduces: ['hashmap'],
    teach: {
      body: [
        `<p>A <code>HashMap&lt;K, V&gt;</code> stores key-value pairs and finds a value by its key in O(1) on average. It is <code>std::unordered_map</code>. The key type must be hashable and comparable with <code>==</code> (<code>Hash</code> and <code>Eq</code>, from stage 3). Integers, <code>bool</code>, <code>char</code>, <code>String</code>, <code>&amp;str</code> and tuples of those all work. <code>f64</code> does not. Bring it in with <code>use std::collections::HashMap;</code> and make one with <code>HashMap::new()</code>.</p>`,
        `<p>The four operations. <code>m.insert(k, v)</code> adds the pair, or replaces the value if the key is already there, and it <em>returns</em> an <code>Option</code>: <code>None</code> for a new key, <code>Some(old_value)</code> when it replaced one. <code>m.get(&amp;k)</code> looks a key up and returns <code>Option&lt;&amp;V&gt;</code>: <code>Some</code> with a <em>reference</em> to the value, or <code>None</code>. It never inserts anything. <code>m.contains_key(&amp;k)</code> returns <code>bool</code>. <code>m.remove(&amp;k)</code> deletes the pair and returns the old value as an <code>Option</code>. <code>m.len()</code> and <code>m.is_empty()</code> work as usual. You can also read with <code>m[&amp;k]</code>, but that <em>panics</em> when the key is missing, so use it only when the key is certain.</p>`,
        `<p>Because <code>get</code> gives a reference, you usually convert it: <code>m.get(&amp;k).copied()</code> turns <code>Option&lt;&amp;i32&gt;</code> into <code>Option&lt;i32&gt;</code>, and <code>.unwrap_or(0)</code> then supplies a default. Or match it: <code>if let Some(v) = m.get(&amp;k) { ... }</code>. In C++, <code>m[k]</code> <em>inserts</em> a default-constructed value when the key is missing, even if you only meant to read; <code>m.at(k)</code> throws; <code>m.find(k) != m.end()</code> is the careful way. In Rust, reading never changes the map.</p>`,
        `<p>Iteration: <code>for (k, v) in &amp;m</code> visits every pair, but in an arbitrary order that is different from run to run (on purpose, to resist attacks on the hash function). Never print or compare a map in iteration order. To get a stable result, collect the pairs into a vector and sort it: <code>let mut pairs: Vec&lt;(i32, i32)&gt; = m.into_iter().collect(); pairs.sort();</code>. <code>into_iter()</code> consumes the map and yields owned <code>(key, value)</code> tuples, and tuples sort by their first field, then the second. <code>m.keys()</code> and <code>m.values()</code> iterate over just one side, and <code>m.values().sum()</code> adds all the values.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::HashMap;

fn main() {
    let mut ages: HashMap<&str, i32> = HashMap::new();
    println!("{:?}", ages.insert("ann", 30));   // None: a new key
    println!("{:?}", ages.insert("ann", 31));   // Some(30): replaced, old value returned
    ages.insert("bob", 25);
    println!("{:?}", ages.get("ann"));          // Some(31)
    println!("{:?}", ages.get("zed"));          // None: nothing inserted
    println!("{} {}", ages.contains_key("bob"), ages.len());   // true 2
    println!("{:?}", ages.remove("bob"));       // Some(25)
    println!("{}", ages.len());                 // 1
}`,
          output: 'None\nSome(30)\nSome(31)\nNone\ntrue 2\nSome(25)\n1',
        },
        {
          code: `use std::collections::HashMap;

fn main() {
    let mut m: HashMap<i32, i32> = HashMap::new();
    m.insert(3, 30);
    m.insert(1, 10);
    m.insert(2, 20);
    let a: i32 = m.get(&1).copied().unwrap_or(0);   // Some(&10) -> Some(10) -> 10
    let b: i32 = m.get(&9).copied().unwrap_or(0);   // None -> the default 0
    println!("{} {}", a, b);
    if let Some(v) = m.get(&2) {                    // v is a &i32
        println!("two maps to {}", v);
    }
    let total: i32 = m.values().sum();              // add up every value
    println!("{}", total);
    let mut pairs: Vec<(i32, i32)> = m.into_iter().collect();   // map order is random...
    pairs.sort();                                   // ...so sort before printing
    println!("{:?}", pairs);
}`,
          output: '10 0\ntwo maps to 20\n60\n[(1, 10), (2, 20), (3, 30)]',
        },
      ],
      terms: [
        { code: 'm.insert(k, v)', meaning: 'adds or replaces; returns None, or Some(old value) if the key existed' },
        { code: 'm.get(&k)', meaning: 'Some(&value) or None; never changes the map' },
        { code: 'm.contains_key(&k)', meaning: 'true if the key is present' },
        { code: 'm.remove(&k)', meaning: 'deletes the pair and returns Some(old value), or None' },
        { code: 'm.values() / m.keys()', meaning: 'iterate over just the values / just the keys (random order)' },
        { code: 'm.into_iter().collect()', meaning: 'turns the map into a Vec of (key, value) tuples, ready to sort' },
      ],
    },
    task: 'Write <code>phonebook</code>: put the (name, number) pairs into a <code>HashMap</code> (a repeated name keeps the later number). Return how many inserts replaced an existing name, and each query\'s number, or -1 for an unknown name.',
    refresher: [
      '<code>m.insert(k, v)</code> returns <code>Some(old)</code> if the key was present. <code>m.get(&amp;k)</code> returns <code>Option&lt;&amp;V&gt;</code>; <code>.copied().unwrap_or(d)</code> gives a plain value.',
      'Map order is random: collect the pairs into a <code>Vec</code> and sort before returning or printing.',
    ],
    hints: [
      '<code>insert</code> tells you whether it replaced something: <code>is_some()</code> on its result.',
      'Loop over the entries with <code>for &amp;(name, number) in entries</code> to copy the pair out.',
      'For each query, <code>book.get(q).copied().unwrap_or(-1)</code> gives the number or -1.',
    ],
    inCpp: {
      code: 'std::unordered_map<std::string, int> book;\nbook["ann"] = 5;\nint a = book["zed"];     // inserts zed -> 0 as a side effect!\nauto it = book.find("zed");\nint b = (it == book.end()) ? -1 : it->second;',
      note: 'In C++ the short form <code>book["zed"]</code> changes the map. In Rust <code>get</code> only reads and returns an <code>Option</code>, and <code>insert</code> hands back the old value, so you do not need a separate lookup.',
    },
    starter: 'use std::collections::HashMap;\n\nfn phonebook(entries: &[(&str, i32)], queries: &[&str]) -> (usize, Vec<i32>) {\n    (0, Vec::new())\n}',
    solution: `use std::collections::HashMap;

fn phonebook(entries: &[(&str, i32)], queries: &[&str]) -> (usize, Vec<i32>) {
    let mut book: HashMap<&str, i32> = HashMap::new();
    let mut replaced = 0;
    for &(name, number) in entries {
        if book.insert(name, number).is_some() {
            replaced += 1;
        }
    }
    let mut answers = Vec::new();
    for q in queries {
        answers.push(book.get(q).copied().unwrap_or(-1));
    }
    (replaced, answers)
}`,
    harness: `fn main() {
    let cases: Vec<(Vec<(&str, i32)>, Vec<&str>)> = vec![
        (vec![("ann", 5), ("bob", 7), ("ann", 9)], vec!["ann", "zed", "bob"]),
        (vec![], vec![]),
        (vec![("x", 1)], vec!["x"]),
        (vec![("a", 1), ("a", 2), ("a", 3)], vec!["a"]),
        (vec![("k", 4)], vec!["j"]),
    ];
    for (i, (entries, queries)) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", phonebook(entries, queries));
    }
}`,
    require: [
      { pattern: 'HashMap', message: 'Use a HashMap' },
      { pattern: '\\.insert\\(', message: 'Use insert' },
      { pattern: '\\.get\\(', message: 'Use get' },
    ],
    tests: [
      { name: 'Example', input: 'ann=5 bob=7 ann=9; ask ann zed bob', expected: '(1, [9, -1, 7])' },
      { name: 'Nothing at all', input: '(empty)', expected: '(0, [])' },
      { name: 'One entry', input: 'x=1; ask x', expected: '(0, [1])' },
      { name: 'Same name three times', input: 'a=1 a=2 a=3; ask a', expected: '(2, [3])' },
      { name: 'Unknown name', input: 'k=4; ask j', expected: '(0, [-1])' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 10. HashMap entry: counting
  {
    id: 'r6-hashmap-entry',
    title: 'HashMap: counting with entry',
    kind: 'drill',
    introduces: ['hashmap', 'deref'],
    teach: {
      body: [
        `<p>One job comes up constantly: "find this key; if it is missing, create it; then change its value". Counting is the standard case. With only <code>get</code> and <code>insert</code> you would look the key up twice and fight the borrow checker. The <code>entry</code> API does it in one lookup. <code>m.entry(k)</code> finds the slot for key <code>k</code> and returns an <em>entry</em>, a handle that says "this slot is either filled or empty". You finish it with a method that settles the empty case.</p>`,
        `<p>The most common finisher is <code>or_insert(default)</code>: if the slot is empty it stores <code>default</code>, and either way it returns a <em>mutable reference</em> to the value now in the map (a <code>&amp;mut V</code>). To count, add one to what that reference points at, and the <code>*</code> (dereference, from stage 2) follows the reference to the number: <code>*m.entry(k).or_insert(0) += 1;</code>. Read it right to left in the head: "find k's slot, start it at 0 if it was empty, then add 1".</p>`,
        `<p>Two more finishers. <code>or_default()</code> stores the type's default (<code>0</code> for numbers, an empty <code>String</code> or <code>Vec</code>, <code>false</code>), so <code>*m.entry(k).or_default() += 1;</code> counts without naming the 0. <code>and_modify(|v| ...).or_insert(x)</code> means "if the key exists, run the closure on its value; otherwise insert <code>x</code>". The C++ <code>m[k]++</code> works only because <code>operator[]</code> inserts a default when the key is missing. <code>entry</code> says that outright. After counting, you typically collect into a vector and sort, since the map's own order is random.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::HashMap;

fn main() {
    let mut counts: HashMap<char, i32> = HashMap::new();
    for c in "hello".chars() {
        *counts.entry(c).or_insert(0) += 1;   // missing: start at 0, then add 1
    }
    let mut pairs: Vec<(char, i32)> = counts.into_iter().collect();
    pairs.sort();                             // map order is random: sort to print
    println!("{:?}", pairs);
}`,
          output: "[('e', 1), ('h', 1), ('l', 2), ('o', 1)]",
        },
        {
          code: `use std::collections::HashMap;

fn main() {
    let mut m: HashMap<&str, i32> = HashMap::new();
    *m.entry("a").or_default() += 5;                    // or_default starts at 0
    m.entry("a").and_modify(|v| *v *= 2).or_insert(1);  // present: doubled to 10
    m.entry("b").and_modify(|v| *v *= 2).or_insert(1);  // missing: inserted as 1
    println!("{} {}", m["a"], m["b"]);                  // m["a"] reads, panics if missing
}`,
          output: '10 1',
        },
      ],
      terms: [
        { code: 'm.entry(k)', meaning: 'finds the slot for key k, filled or empty, with one lookup' },
        { code: '.or_insert(x)', meaning: 'stores x if the slot was empty; returns &mut V to the value' },
        { code: '*m.entry(k).or_insert(0) += 1', meaning: 'the counting idiom: * follows the reference, then adds 1' },
        { code: '.or_default()', meaning: 'like or_insert but with the type\'s default (0, empty String, empty Vec)' },
        { code: '.and_modify(|v| ...)', meaning: 'runs the closure on the value if the key exists' },
      ],
    },
    task: 'Write <code>count_values</code>: count how often each number occurs and return <code>(number, count)</code> pairs sorted by number. Count with <code>entry</code>.',
    refresher: [
      '<code>*m.entry(k).or_insert(0) += 1;</code> looks the key up once and gives <code>&amp;mut V</code>. <code>or_default()</code> inserts <code>V::default()</code>.',
      'Map order is random. Collect with <code>m.into_iter().collect::&lt;Vec&lt;_&gt;&gt;()</code> and sort before returning.',
    ],
    hints: [
      '<code>or_insert</code> returns a mutable reference: dereference it with <code>*</code> to add.',
      'Tuples sort by their first field, so sorting the collected pairs gives the order you need.',
      'The map type is <code>HashMap&lt;i32, usize&gt;</code>, imported from <code>std::collections</code>.',
    ],
    inCpp: {
      code: 'std::vector<int> nums;\nstd::unordered_map<int, size_t> m;\nfor (int n : nums) {\n    m[n]++;   // inserts 0 if missing\n}',
      note: '<code>m[n]++</code> works in C++ because <code>operator[]</code> default-inserts, even on a plain read. Rust\'s <code>entry</code> makes that intent explicit and does one lookup for both the check and the update.',
    },
    starter: 'use std::collections::HashMap;\n\nfn count_values(nums: &[i32]) -> Vec<(i32, usize)> {\n    Vec::new()\n}',
    solution: `use std::collections::HashMap;

fn count_values(nums: &[i32]) -> Vec<(i32, usize)> {
    let mut m: HashMap<i32, usize> = HashMap::new();
    for &n in nums {
        *m.entry(n).or_insert(0) += 1;
    }
    let mut out: Vec<(i32, usize)> = m.into_iter().collect();
    out.sort();
    out
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
        println!("{:?}", count_values(c));
    }
}`,
    require: [{ pattern: '\\.entry\\(', message: 'Use the entry API' }],
    tests: [
      { name: 'Example', input: '3 1 3 2 3 1', expected: '[(1, 2), (2, 1), (3, 3)]' },
      { name: 'Empty', input: '(empty)', expected: '[]' },
      { name: 'One item', input: '5', expected: '[(5, 1)]' },
      { name: 'All equal', input: '2 2 2 2', expected: '[(2, 4)]' },
      { name: 'Negatives', input: '-1 1 -1', expected: '[(-1, 2), (1, 1)]' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 11. HashMap of Vecs: grouping
  {
    id: 'r6-hashmap-group',
    title: 'HashMap of Vecs: grouping',
    kind: 'drill',
    introduces: ['hashmap'],
    teach: {
      body: [
        `<p>A map's values can be collections too. <code>HashMap&lt;usize, Vec&lt;String&gt;&gt;</code> maps a number to a list of strings, which is how you <em>group</em> things: all words of one length, all numbers with one remainder, all nodes at one depth. The grouping idiom is <code>m.entry(key).or_default().push(item);</code>. <code>entry(key)</code> finds the slot, <code>or_default()</code> creates an empty <code>Vec</code> when the key is new and returns <code>&amp;mut Vec</code>, and <code>push</code> adds to it. No <code>*</code> is needed this time, because method calls look through a reference automatically.</p>`,
        `<p>When the default is not what you want, use <code>or_insert_with(Vec::new)</code>. It takes a <em>function</em>, written without parentheses (<code>Vec::new</code> is the function itself, not a call), and runs it only when the key is missing. <code>or_insert(Vec::new())</code> would build a throwaway vector every time, even when the key exists. For a <code>Vec</code> the two forms behave the same, so <code>or_default()</code> is the shorter choice.</p>`,
        `<p>To read the groups afterwards, <code>m[&amp;k]</code> gives the vector for a key you know exists. To visit all groups in a fixed order, collect the keys with <code>m.keys().copied().collect()</code>, sort them, and look each one up. Or convert the whole map to a vector of pairs and sort it, as in the previous lesson (a tuple whose second field is a <code>Vec</code> sorts fine: only the first field differs between groups). The C++ version is <code>std::unordered_map&lt;int, std::vector&lt;std::string&gt;&gt; m; m[len].push_back(w);</code>, again relying on <code>operator[]</code> to create the empty vector.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::HashMap;

fn main() {
    let mut by_rem: HashMap<i32, Vec<i32>> = HashMap::new();
    for n in 1..=7 {
        by_rem.entry(n % 3).or_default().push(n);   // new key: an empty Vec appears first
    }
    let mut keys: Vec<i32> = by_rem.keys().copied().collect();
    keys.sort();                                    // fixed order for printing
    for k in keys {
        println!("{} -> {:?}", k, by_rem[&k]);
    }
}`,
          output: '0 -> [3, 6]\n1 -> [1, 4, 7]\n2 -> [2, 5]',
        },
        {
          code: `use std::collections::HashMap;

fn main() {
    let mut m: HashMap<&str, Vec<i32>> = HashMap::new();
    m.entry("a").or_insert_with(Vec::new).push(1);   // Vec::new runs only if "a" is missing
    m.entry("a").or_insert_with(Vec::new).push(2);
    println!("{:?}", m["a"]);
}`,
          output: '[1, 2]',
        },
      ],
      terms: [
        { code: 'm.entry(k).or_default().push(x)', meaning: 'the grouping idiom: create an empty Vec for a new key, then add x to it' },
        { code: '.or_insert_with(Vec::new)', meaning: 'like or_default; passes the function to run only if the key is missing' },
        { code: 'm.keys()', meaning: 'iterator over the keys, in random order' },
      ],
    },
    task: 'Write <code>group_by_len</code>: group the words by their length. Return <code>(length, words)</code> pairs sorted by length; inside a group the words keep their original order.',
    refresher: [
      '<code>m.entry(k).or_default().push(x)</code> creates the group when needed and adds to it; no <code>*</code> is needed before a method call.',
      'Collect the map into a <code>Vec</code> of pairs and <code>sort()</code> it to get a fixed order.',
    ],
    hints: [
      'The map type is <code>HashMap&lt;usize, Vec&lt;String&gt;&gt;</code>; the key is <code>w.len()</code>.',
      'Store <code>w.to_string()</code>, because the map must own its strings.',
      'Finish with <code>into_iter().collect()</code> into a vector and <code>sort()</code> it.',
    ],
    inCpp: {
      code: 'std::vector<std::string> words;\nstd::unordered_map<size_t, std::vector<std::string>> m;\nfor (auto& w : words) {\n    m[w.size()].push_back(w);\n}',
      note: 'Same idea, and again C++ relies on <code>operator[]</code> creating the empty vector. Rust names that step: <code>or_default()</code>.',
    },
    starter: 'use std::collections::HashMap;\n\nfn group_by_len(words: &[&str]) -> Vec<(usize, Vec<String>)> {\n    Vec::new()\n}',
    solution: `use std::collections::HashMap;

fn group_by_len(words: &[&str]) -> Vec<(usize, Vec<String>)> {
    let mut groups: HashMap<usize, Vec<String>> = HashMap::new();
    for w in words {
        groups.entry(w.len()).or_default().push(w.to_string());
    }
    let mut out: Vec<(usize, Vec<String>)> = groups.into_iter().collect();
    out.sort();
    out
}`,
    harness: `fn main() {
    let cases: Vec<Vec<&str>> = vec![
        vec!["a", "bb", "c", "dd", "eee"],
        vec![],
        vec!["x"],
        vec!["bb", "a", "bb"],
        vec!["abc", "de", "fgh", "ij"],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", group_by_len(c));
    }
}`,
    require: [
      { pattern: '\\.entry\\(', message: 'Use the entry API' },
      { pattern: '\\.push\\(', message: 'Push each word onto its group' },
    ],
    tests: [
      { name: 'Example', input: 'a bb c dd eee', expected: '[(1, ["a", "c"]), (2, ["bb", "dd"]), (3, ["eee"])]' },
      { name: 'Empty', input: '(empty)', expected: '[]' },
      { name: 'One word', input: 'x', expected: '[(1, ["x"])]' },
      { name: 'Repeated word', input: 'bb a bb', expected: '[(1, ["a"]), (2, ["bb", "bb"])]' },
      { name: 'Two groups', input: 'abc de fgh ij', expected: '[(2, ["de", "ij"]), (3, ["abc", "fgh"])]' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 12. HashSet basics
  {
    id: 'r6-hashset-basics',
    title: 'HashSet: have I seen this?',
    kind: 'drill',
    introduces: ['hashmap'],
    teach: {
      body: [
        `<p>A <code>HashSet&lt;T&gt;</code> is a collection of <em>distinct</em> values with O(1) average membership tests: <code>std::unordered_set</code>. Think of it as a <code>HashMap</code> that keeps only the keys. The element type needs <code>Hash</code> and <code>Eq</code>, like a map key. It has no order and no indexing. Import it with <code>use std::collections::HashSet;</code> and create one with <code>HashSet::new()</code>.</p>`,
        `<p><code>s.insert(x)</code> adds <code>x</code> and returns a <code>bool</code>: <code>true</code> if the value was new, <code>false</code> if it was already there (and nothing changed). That one call both tests and adds, which is exactly what "have I seen this before?" needs. <code>s.contains(&amp;x)</code> tests membership, <code>s.remove(&amp;x)</code> removes and returns whether it was there, and <code>s.len()</code> counts. The C++ <code>insert</code> returns a <code>pair</code> of an iterator and a bool, and you ask <code>count(x)</code> for membership. Rust's returns are simpler.</p>`,
        `<p>To build a set from existing data, collect an iterator: <code>let s: HashSet&lt;i32&gt; = v.iter().copied().collect();</code>. Duplicates vanish on the way in, so <code>s.len()</code> is the number of distinct values. The next lesson covers combining two sets.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::HashSet;

fn main() {
    let mut seen: HashSet<i32> = HashSet::new();
    println!("{}", seen.insert(4));      // true: 4 was not there
    println!("{}", seen.insert(4));      // false: already there
    seen.insert(9);
    println!("{} {}", seen.contains(&9), seen.contains(&1));   // true false
    println!("{}", seen.remove(&4));     // true: it was there
    println!("{}", seen.len());          // 1
}`,
          output: 'true\nfalse\ntrue false\ntrue\n1',
        },
        {
          code: `use std::collections::HashSet;

fn main() {
    let v = vec![3, 1, 3, 2, 1];
    let unique: HashSet<i32> = v.iter().copied().collect();   // duplicates disappear
    println!("{} distinct of {}", unique.len(), v.len());
}`,
          output: '3 distinct of 5',
        },
      ],
      terms: [
        { code: 'HashSet::new()', meaning: 'an empty set (after use std::collections::HashSet;)' },
        { code: 's.insert(x)', meaning: 'adds x; returns true if it was new, false if already present' },
        { code: 's.contains(&x)', meaning: 'true if x is in the set; O(1) on average' },
        { code: 's.remove(&x)', meaning: 'removes x; returns whether it was there' },
        { code: 'iter.collect::<HashSet<_>>()', meaning: 'builds a set from an iterator, dropping duplicates' },
      ],
    },
    task: 'Write <code>first_repeat</code>: return the first value, scanning left to right, that has already appeared earlier in the slice, or <code>None</code> if all values are distinct. Use a <code>HashSet</code> and the result of <code>insert</code>.',
    refresher: [
      '<code>s.insert(x)</code> returns <code>false</code> if <code>x</code> was already in the set. <code>s.contains(&amp;x)</code> tests membership.',
      '<code>let s: HashSet&lt;i32&gt; = v.iter().copied().collect();</code> builds a set of the distinct values.',
    ],
    hints: [
      'Walk the slice with <code>for &amp;x in v</code>.',
      '<code>!seen.insert(x)</code> is true exactly when <code>x</code> was seen before: return <code>Some(x)</code> then.',
      'After the loop, nothing repeated: return <code>None</code>.',
    ],
    inCpp: {
      code: 'std::vector<int> v;\nstd::unordered_set<int> seen;\nfor (int x : v) {\n    if (!seen.insert(x).second) {   // .second is the "was new" flag\n        break;\n    }\n}',
      note: 'The same trick exists in C++ but hides in <code>.second</code> of a returned pair. Rust\'s <code>insert</code> returns the flag directly.',
    },
    starter: 'use std::collections::HashSet;\n\nfn first_repeat(v: &[i32]) -> Option<i32> {\n    None\n}',
    solution: `use std::collections::HashSet;

fn first_repeat(v: &[i32]) -> Option<i32> {
    let mut seen = HashSet::new();
    for &x in v {
        if !seen.insert(x) {
            return Some(x);
        }
    }
    None
}`,
    harness: `fn main() {
    let cases: Vec<Vec<i32>> = vec![
        vec![2, 5, 1, 2, 3, 5],
        vec![],
        vec![1, 2, 3],
        vec![7, 7],
        vec![1, 2, 1, 2],
    ];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{:?}", first_repeat(c));
    }
}`,
    require: [
      { pattern: 'HashSet', message: 'Use a HashSet' },
      { pattern: '\\.insert\\(', message: 'Use insert' },
    ],
    tests: [
      { name: 'Example', input: '2 5 1 2 3 5', expected: 'Some(2)' },
      { name: 'Empty', input: '(empty)', expected: 'None' },
      { name: 'All distinct', input: '1 2 3', expected: 'None' },
      { name: 'Adjacent repeat', input: '7 7', expected: 'Some(7)' },
      { name: 'Two repeats', input: '1 2 1 2', expected: 'Some(1)' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  // 13. HashSet algebra
  {
    id: 'r6-hashset',
    title: 'HashSet: intersection and union',
    kind: 'drill',
    introduces: ['hashmap'],
    teach: {
      body: [
        `<p>Sets combine. For two sets <code>a</code> and <code>b</code>: <code>a.intersection(&amp;b)</code> gives the items in both, <code>a.union(&amp;b)</code> the items in either, <code>a.difference(&amp;b)</code> the items in <code>a</code> but not in <code>b</code>, and <code>a.symmetric_difference(&amp;b)</code> the items in exactly one of them. Each takes a reference to the other set, and each returns a lazy <em>iterator</em> of references (<code>&amp;T</code>), not a new set. To use the result, finish the chain: <code>.copied().collect()</code> into a <code>Vec</code> (or <code>HashSet</code>).</p>`,
        `<p>The iterators come out in random order, so sort the vector before you print or return it. Two yes/no questions have their own methods: <code>a.is_subset(&amp;b)</code> (everything in <code>a</code> is also in <code>b</code>) and <code>a.is_disjoint(&amp;b)</code> (they share nothing). Each operation costs about O(the size of the smaller set) for <code>intersection</code> and O(both sizes) for the rest.</p>`,
        `<p>The STL has no such methods on <code>unordered_set</code>. You write the loop <code>for (x : a) if (b.count(x)) ...</code>, or you sort both ranges and call <code>std::set_intersection</code>, which wants sorted input and an output iterator. The Rust methods are the readable replacement.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::HashSet;

fn main() {
    let a: HashSet<i32> = vec![1, 2, 3].into_iter().collect();
    let b: HashSet<i32> = vec![2, 3, 4].into_iter().collect();

    let mut both: Vec<i32> = a.intersection(&b).copied().collect();
    both.sort();                                   // random order: sort it
    println!("{:?}", both);

    let mut only_a: Vec<i32> = a.difference(&b).copied().collect();   // in a, not in b
    only_a.sort();
    println!("{:?}", only_a);

    println!("{} {}", a.is_subset(&b), a.is_disjoint(&b));
}`,
          output: '[2, 3]\n[1]\nfalse false',
        },
        {
          code: `use std::collections::HashSet;

fn main() {
    let a: HashSet<i32> = vec![1, 2, 3].into_iter().collect();
    let b: HashSet<i32> = vec![2, 3, 4].into_iter().collect();
    let mut either: Vec<i32> = a.union(&b).copied().collect();
    either.sort();
    println!("{:?}", either);                      // [1, 2, 3, 4]
    let mut one_side: Vec<i32> = a.symmetric_difference(&b).copied().collect();
    one_side.sort();
    println!("{:?}", one_side);                    // [1, 4]
}`,
          output: '[1, 2, 3, 4]\n[1, 4]',
        },
      ],
      terms: [
        { code: 'a.intersection(&b)', meaning: 'iterator over items in both sets' },
        { code: 'a.union(&b)', meaning: 'iterator over items in either set, each once' },
        { code: 'a.difference(&b)', meaning: 'iterator over items in a but not in b' },
        { code: 'a.symmetric_difference(&b)', meaning: 'iterator over items in exactly one of the two' },
        { code: 'a.is_subset(&b) / a.is_disjoint(&b)', meaning: 'yes/no questions about two sets' },
      ],
    },
    task: 'Write <code>overlap</code>: return the numbers present in both slices and the numbers present in either, each as a sorted <code>Vec</code> without duplicates. Use <code>HashSet</code>.',
    refresher: [
      '<code>a.intersection(&amp;b)</code> and <code>a.union(&amp;b)</code> yield <code>&amp;T</code> in random order: <code>.copied().collect()</code>, then <code>sort</code>.',
      '<code>let s: HashSet&lt;i32&gt; = v.iter().copied().collect();</code> builds a set; duplicates disappear.',
    ],
    hints: [
      'Build one set from each slice. Duplicates disappear on their own.',
      'The set operations are methods that take a reference to the other set.',
      'Iteration order is random, so sort each result vector before returning it.',
    ],
    inCpp: {
      code: 'std::unordered_set<int> a{1, 2, 3}, b{2, 3, 4};\nstd::vector<int> both;\nfor (int x : a) {\n    if (b.count(x)) both.push_back(x);\n}',
      note: 'The STL has no set algebra on unordered sets: you write the loop, or sort and use <code>std::set_intersection</code>. Rust gives <code>intersection</code>, <code>union</code>, <code>difference</code> and <code>symmetric_difference</code> as lazy iterators.',
    },
    starter: 'use std::collections::HashSet;\n\nfn overlap(a: &[i32], b: &[i32]) -> (Vec<i32>, Vec<i32>) {\n    (Vec::new(), Vec::new())\n}',
    solution: `use std::collections::HashSet;

fn overlap(a: &[i32], b: &[i32]) -> (Vec<i32>, Vec<i32>) {
    let sa: HashSet<i32> = a.iter().copied().collect();
    let sb: HashSet<i32> = b.iter().copied().collect();
    let mut both: Vec<i32> = sa.intersection(&sb).copied().collect();
    both.sort();
    let mut either: Vec<i32> = sa.union(&sb).copied().collect();
    either.sort();
    (both, either)
}`,
    harness: `fn main() {
    let cases: Vec<(Vec<i32>, Vec<i32>)> = vec![
        (vec![1, 2, 3], vec![2, 3, 4]),
        (vec![], vec![]),
        (vec![5], vec![5]),
        (vec![1, 1, 2], vec![2, 2, 3]),
        (vec![1, 2], vec![3, 4]),
    ];
    for (i, (a, b)) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        let (x, y) = overlap(a, b);
        println!("{:?} {:?}", x, y);
    }
}`,
    require: [
      { pattern: '\\.intersection\\(', message: 'Use intersection' },
      { pattern: '\\.union\\(', message: 'Use union' },
    ],
    tests: [
      { name: 'Example', input: '[1,2,3] and [2,3,4]', expected: '[2, 3] [1, 2, 3, 4]' },
      { name: 'Both empty', input: '[] and []', expected: '[] []' },
      { name: 'One item each', input: '[5] and [5]', expected: '[5] [5]' },
      { name: 'Duplicates', input: '[1,1,2] and [2,2,3]', expected: '[2] [1, 2, 3]' },
      { name: 'Disjoint', input: '[1,2] and [3,4]', expected: '[] [1, 2, 3, 4]' },
    ],
  },
]
