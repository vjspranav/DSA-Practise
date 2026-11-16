// Rust lessons: stage 5, build it yourself.
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" at the end)
// and docs/superpowers/specs/rust-lesson-examples.js. Check with: node scripts/verify-rust.mjs --stage 5
// Ids must start with r5- and be unique across the track.

// Hand-rolled generator shared by the harnesses (no randomness anywhere).
const LCG = `fn harness_next(state: &mut u64) -> u64 {
    *state = state.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
    *state >> 33
}
`

const stack = {
  id: 'r5-stack',
  title: 'Stack',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Stage 5 builds the classic data structures yourself. This is where Rust's ownership rules change code you would write with pointers and <code>new</code> in C++, and where you will see what those rules buy you. Start with the simplest structure. A <em>stack</em> is a pile where you only touch the top. <code>push</code> puts an item on top, <code>pop</code> takes the top item off, and <code>peek</code> looks at the top without removing it. The last item in is the first one out ("LIFO"). Function calls, undo buttons and bracket matching all work this way.</p>`,
      `<p>A trace makes it concrete. Start empty and push 1, 2, 3: the pile is <code>[1, 2, 3]</code> with 3 on top. <code>peek</code> answers 3 and changes nothing. <code>pop</code> answers 3 and leaves <code>[1, 2]</code>. Pop twice more and you get 2, then 1, and the pile is empty. A fourth <code>pop</code> has nothing to give.</p>`,
      `<p>A <code>Vec</code> already behaves like a stack if you only use its end, so the Rust shape is a struct that <em>owns</em> a <code>Vec</code>: <code>struct Stack { items: Vec&lt;i32&gt; }</code>. Wrapping it is the point. Users of <code>Stack</code> can push, pop and peek, but they cannot index into the middle, so the "only touch the top" rule is enforced by the type. <code>Stack::new()</code> is an associated function (it has no <code>self</code>) that builds an empty one, as in the structs lessons.</p>`,
      `<p>The return types say what happens at the edges. <code>pop</code> returns <code>Option&lt;i32&gt;</code>: <code>Some(x)</code> for the item and <code>None</code> when the stack is empty. In C++ an empty <code>back()</code> is undefined behaviour, or you invent a sentinel like -1 that might be a real value. <code>peek</code> returns <code>Option&lt;&amp;i32&gt;</code>: a <em>reference</em> to the top item rather than a copy. A reference means "look, don't take", so while you hold one the compiler will not let you push or pop. <code>push</code> and <code>pop</code> take <code>&amp;mut self</code> because they change the stack, and <code>peek</code> and <code>len</code> take <code>&amp;self</code>.</p>`,
      `<p>Every method is one line that forwards to <code>Vec</code>: <code>.push(x)</code> adds at the end, <code>.pop()</code> removes the last item and returns an <code>Option</code>, and <code>.last()</code> returns the last item as an <code>Option&lt;&amp;T&gt;</code> without removing it.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let mut items: Vec<i32> = Vec::new();
    items.push(1);                      // [1]
    items.push(2);                      // [1, 2]
    items.push(3);                      // [1, 2, 3]   3 is on top
    println!("{:?}", items.last());     // look at the top without removing it
    println!("{:?}", items.pop());      // take the top off
    println!("{:?}", items);            // what is left
}`,
        output: 'Some(3)\nSome(3)\n[1, 2]',
        caption: 'A Vec used only at its end is a stack.',
      },
      {
        code: `fn main() {
    let mut items = vec![10, 20];
    let top = items.last();                 // Option<&i32>: a reference into the Vec
    println!("{:?}", top);                  // using the reference here is fine
    items.push(30);                         // allowed: top is never used again
    let copy = items.last().copied();       // copied() turns Option<&i32> into Option<i32>
    items.push(40);                         // fine: copy is a plain number, not a borrow
    println!("{:?} {:?}", copy, items);
}`,
        output: 'Some(20)\nSome(30) [10, 20, 30, 40]',
        caption: 'A peek borrows the stack; a copied value does not.',
      },
    ],
    terms: [
      { code: 'struct Stack { items: Vec<i32> }', meaning: 'a struct that owns a Vec and hides the rest of its methods' },
      { code: 'items.pop()', meaning: 'removes the last item and returns it as Option<T>; None when empty' },
      { code: 'items.last()', meaning: 'the last item as Option<&T>, without removing it' },
      { code: '.copied()', meaning: 'turns Option<&i32> into Option<i32> by copying the number out' },
    ],
  },
  task: `Finish <code>Stack</code>, backed by a <code>Vec</code>. <code>pop</code> returns <code>Option&lt;i32&gt;</code> and <code>peek</code> returns <code>Option&lt;&amp;i32&gt;</code>: <code>None</code> when the stack is empty.`,
  refresher: [
    `<code>&amp;mut self</code> methods may change the struct; <code>&amp;self</code> methods only read it.`,
    `<code>Vec</code> already has <code>push</code>, <code>pop</code> (returns <code>Option</code>), <code>last</code> (returns <code>Option&lt;&amp;T&gt;</code>), <code>len</code> and <code>is_empty</code>.`,
  ],
  hints: [
    `Each method is one line that forwards to the matching <code>Vec</code> method on <code>self.items</code>.`,
    `<code>peek</code> must not remove anything: which <code>Vec</code> method looks at the last item without popping?`,
  ],
  inCpp: {
    code: `std::vector<int> items;
void push(int x) { items.push_back(x); }
int pop() {
    int x = items.back();   // undefined behaviour when empty
    items.pop_back();
    return x;
}`,
    note: `Popping an empty <code>std::vector</code> through <code>back()</code> is undefined behaviour, and a sentinel like <code>-1</code> can be a real value. <code>Option</code> makes "nothing there" part of the type, so the caller must handle it.`,
  },
  starter: `struct Stack {
    items: Vec<i32>,
}

impl Stack {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }
    fn push(&mut self, x: i32) {}
    fn pop(&mut self) -> Option<i32> {
        None
    }
    fn peek(&self) -> Option<&i32> {
        None
    }
    fn len(&self) -> usize {
        0
    }
    fn is_empty(&self) -> bool {
        true
    }
}`,
  solution: `struct Stack {
    items: Vec<i32>,
}

impl Stack {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }
    fn push(&mut self, x: i32) {
        self.items.push(x);
    }
    fn pop(&mut self) -> Option<i32> {
        self.items.pop()
    }
    fn peek(&self) -> Option<&i32> {
        self.items.last()
    }
    fn len(&self) -> usize {
        self.items.len()
    }
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}`,
  harness: LCG + `
fn main() {
    println!("\\n@@TEST 1@@");
    let mut s = Stack::new();
    s.push(1);
    s.push(2);
    s.push(3);
    println!("{:?}", s.peek());
    let (a, b, c, d) = (s.pop(), s.pop(), s.pop(), s.pop());
    println!("{:?} {:?} {:?} {:?}", a, b, c, d);

    println!("\\n@@TEST 2@@");
    let mut s = Stack::new();
    println!("{:?} {:?} {} {}", s.pop(), s.peek(), s.len(), s.is_empty());

    println!("\\n@@TEST 3@@");
    let mut s = Stack::new();
    s.push(9);
    println!("{:?} {}", s.peek(), s.is_empty());
    println!("{:?} {}", s.pop(), s.is_empty());

    println!("\\n@@TEST 4@@");
    let mut s = Stack::new();
    for _ in 0..3 {
        s.push(4);
    }
    println!("{:?} {}", s.pop(), s.len());

    println!("\\n@@TEST 5@@");
    let mut s = Stack::new();
    for i in 0..1000 {
        s.push(i);
    }
    let mut ok = s.len() == 1000;
    for i in (0..1000).rev() {
        if s.pop() != Some(i) {
            ok = false;
        }
    }
    println!("{}", if ok && s.is_empty() { "ok" } else { "wrong" });

    println!("\\n@@TEST 6@@");
    let mut s = Stack::new();
    let mut reference: Vec<i32> = Vec::new();
    let mut state = 99u64;
    let mut ok = true;
    for step in 0..10000 {
        if harness_next(&mut state) % 3 == 2 {
            if s.pop() != reference.pop() {
                ok = false;
            }
        } else {
            s.push(step);
            reference.push(step);
        }
        if s.len() != reference.len() || s.peek() != reference.last() || s.is_empty() != reference.is_empty() {
            ok = false;
        }
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  tests: [
    { name: 'Push three, pop all', input: 'push 1 2 3', expected: 'Some(3)\nSome(3) Some(2) Some(1) None' },
    { name: 'Empty stack', input: '(empty)', expected: 'None None 0 true' },
    { name: 'One item', input: 'push 9', expected: 'Some(9) false\nSome(9) true' },
    { name: 'Duplicates and len', input: 'push 4 4 4, pop', expected: 'Some(4) 2' },
    { name: 'Growth', input: '1 000 items', expected: 'ok' },
    { name: 'Random operations', input: '10 000 steps vs Vec', expected: 'matches reference' },
  ],
}

const circularQueue = {
  id: 'r5-circular-queue',
  title: 'Circular queue',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>A <em>queue</em> is a waiting line: <code>enqueue</code> adds at the back, <code>dequeue</code> takes from the front, so the first item in is the first out ("FIFO"). A <code>Vec</code> is awkward for this. Adding at the back is cheap, but removing the front with <code>remove(0)</code> shifts every other item one place left, which costs time proportional to the length.</p>`,
      `<p>A <em>circular queue</em> (ring buffer) avoids the shifting. Take a fixed-size array and treat it as a circle: the slot after the last one is slot 0 again. Two numbers describe the queue. <code>head</code> is the index of the oldest item, and <code>len</code> is how many items there are. The next free slot is always <code>(head + len) % capacity</code>, and the <code>%</code> is what wraps around the end. Dequeuing moves <code>head</code> forward by one (with the same wrap) and subtracts one from <code>len</code>. Nothing is ever shifted.</p>`,
      `<p>In Rust the buffer is a <code>Vec&lt;i32&gt;</code> whose length is fixed at the start with <code>vec![0; capacity]</code> (a vector of <code>capacity</code> zeros; the zeros are just placeholders for unused slots). The struct has three fields: <code>buf</code>, <code>head</code> and <code>len</code>. A field and a method may share the name <code>len</code>: <code>self.len</code> is the field, <code>self.len()</code> calls the method.</p>`,
      `<p>Two things to watch. Enqueue on a full queue must not overwrite anything, so it returns <code>false</code>, and dequeue on an empty queue returns <code>None</code>. And <code>x % 0</code> panics in Rust (it is undefined behaviour in C++), so a queue of capacity 0 must answer "full" before the code reaches a <code>%</code>. All the counters are <code>usize</code>, which cannot go below 0, so only subtract from <code>len</code> after you know it is above 0.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    // capacity 4: the slots are numbered 0 1 2 3, and after 3 comes 0 again
    //
    //   after enqueue 1 2 3:      [1][2][3][ ]    head = 0, len = 3
    //   after dequeue (gives 1):  [ ][2][3][ ]    head = 1, len = 2
    //   after enqueue 4, 5:       [5][2][3][4]    head = 1, len = 4   (5 wrapped to slot 0)
    let capacity = 4;
    let head = 1;
    let len = 2;
    println!("next free slot: {}", (head + len) % capacity);
    println!("the one after that: {}", (head + len + 1) % capacity);
}`,
        output: 'next free slot: 3\nthe one after that: 0',
        caption: 'The remainder wraps the position back to the start.',
      },
      {
        code: `fn main() {
    let capacity = 4;
    let mut buf = vec![0; capacity];     // four slots, all holding the placeholder 0
    let head = 1;
    let len = 3;
    buf[(head + len) % capacity] = 9;    // (1 + 3) % 4 is 0: the write wraps to the front
    println!("{:?}", buf);
}`,
        output: '[9, 0, 0, 0]',
        caption: 'vec![0; n] makes the buffer; the modulo picks the slot.',
      },
    ],
    terms: [
      { code: 'vec![0; capacity]', meaning: 'a Vec with capacity items, all 0' },
      { code: '(head + len) % capacity', meaning: 'the slot just after the newest item, wrapping past the end' },
      { code: 'self.len / self.len()', meaning: 'the field / the method of the same name' },
    ],
  },
  task: `Finish <code>CircularQueue</code>, a fixed-capacity ring buffer. <code>enqueue</code> returns <code>false</code> when full; <code>dequeue</code> returns <code>None</code> when empty. Indices must wrap around.`,
  refresher: [
    `<code>head</code> is the index of the oldest item and <code>len</code> the item count, so the next free slot is <code>(head + len) % capacity</code>.`,
    `Capacity may be 0: check for full before using <code>%</code>, because <code>x % 0</code> panics.`,
  ],
  hints: [
    `<code>enqueue</code>: if <code>len == buf.len()</code> return <code>false</code>; otherwise write at <code>(head + len) % buf.len()</code> and add 1 to <code>len</code>.`,
    `<code>dequeue</code>: if <code>len == 0</code> return <code>None</code>; otherwise read <code>buf[head]</code>, move <code>head</code> forward with the same wrap, and subtract 1 from <code>len</code>.`,
    `Wraparound is exactly what the modulo is for: do not move items around, only the indices.`,
  ],
  inCpp: {
    code: `struct CircularQueue {
    std::vector<int> buf;
    size_t head = 0, len = 0;
    explicit CircularQueue(size_t cap) : buf(cap) {}
    bool enqueue(int x) {
        if (len == buf.size()) return false;
        buf[(head + len) % buf.size()] = x;
        len++;
        return true;
    }
};`,
    note: `Nearly the same code. The difference is failure: a <code>% 0</code> on a zero-capacity queue is undefined behaviour in C++ and a clear panic in Rust, and "empty" is <code>None</code> rather than a magic value.`,
  },
  starter: `struct CircularQueue {
    buf: Vec<i32>,
    head: usize,
    len: usize,
}

impl CircularQueue {
    fn new(capacity: usize) -> Self {
        CircularQueue { buf: vec![0; capacity], head: 0, len: 0 }
    }
    fn enqueue(&mut self, x: i32) -> bool {
        false
    }
    fn dequeue(&mut self) -> Option<i32> {
        None
    }
    fn len(&self) -> usize {
        0
    }
    fn is_full(&self) -> bool {
        false
    }
}`,
  solution: `struct CircularQueue {
    buf: Vec<i32>,
    head: usize,
    len: usize,
}

impl CircularQueue {
    fn new(capacity: usize) -> Self {
        CircularQueue { buf: vec![0; capacity], head: 0, len: 0 }
    }
    fn enqueue(&mut self, x: i32) -> bool {
        if self.len == self.buf.len() {
            return false;
        }
        let tail = (self.head + self.len) % self.buf.len();
        self.buf[tail] = x;
        self.len += 1;
        true
    }
    fn dequeue(&mut self) -> Option<i32> {
        if self.len == 0 {
            return None;
        }
        let x = self.buf[self.head];
        self.head = (self.head + 1) % self.buf.len();
        self.len -= 1;
        Some(x)
    }
    fn len(&self) -> usize {
        self.len
    }
    fn is_full(&self) -> bool {
        self.len == self.buf.len()
    }
}`,
  harness: LCG + `
fn main() {
    println!("\\n@@TEST 1@@");
    let mut q = CircularQueue::new(3);
    let r: Vec<bool> = (1..=4).map(|x| q.enqueue(x)).collect();
    println!("{:?} len={} full={}", r, q.len(), q.is_full());

    println!("\\n@@TEST 2@@");
    let mut q = CircularQueue::new(3);
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);
    let a = q.dequeue();
    let wrapped = q.enqueue(4);
    let rest = (q.dequeue(), q.dequeue(), q.dequeue(), q.dequeue());
    println!("{:?} {} {:?}", a, wrapped, rest);

    println!("\\n@@TEST 3@@");
    let mut q = CircularQueue::new(4);
    println!("{:?} len={} full={}", q.dequeue(), q.len(), q.is_full());

    println!("\\n@@TEST 4@@");
    let mut q = CircularQueue::new(1);
    let a = q.enqueue(7);
    let b = q.enqueue(8);
    let c = q.dequeue();
    let d = q.enqueue(9);
    println!("{} {} {:?} {} {:?}", a, b, c, d, q.dequeue());

    println!("\\n@@TEST 5@@");
    let mut q = CircularQueue::new(0);
    println!("{} {:?} {}", q.enqueue(1), q.dequeue(), q.is_full());

    println!("\\n@@TEST 6@@");
    let mut q = CircularQueue::new(3);
    let mut ok = true;
    for round in 0..10 {
        for k in 0..3 {
            ok &= q.enqueue(round * 10 + k);
        }
        for k in 0..3 {
            ok &= q.dequeue() == Some(round * 10 + k);
        }
    }
    println!("{}", if ok && q.len() == 0 { "ok" } else { "wrong" });

    println!("\\n@@TEST 7@@");
    let mut q = CircularQueue::new(8);
    let mut reference: std::collections::VecDeque<i32> = std::collections::VecDeque::new();
    let mut state = 31u64;
    let mut ok = true;
    for step in 0..20000 {
        if harness_next(&mut state) % 2 == 0 {
            let accepted = q.enqueue(step);
            if accepted != (reference.len() < 8) {
                ok = false;
            }
            if accepted {
                reference.push_back(step);
            }
        } else if q.dequeue() != reference.pop_front() {
            ok = false;
        }
        if q.len() != reference.len() || q.is_full() != (reference.len() == 8) {
            ok = false;
        }
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  tests: [
    { name: 'Fill past capacity', input: 'cap 3, enqueue 1 to 4', expected: '[true, true, true, false] len=3 full=true' },
    { name: 'Wraparound', input: 'cap 3, fill, dequeue, enqueue 4', expected: 'Some(1) true (Some(2), Some(3), Some(4), None)' },
    { name: 'Empty queue', input: 'cap 4, dequeue', expected: 'None len=0 full=false' },
    { name: 'Capacity one', input: 'cap 1', expected: 'true false Some(7) true Some(9)' },
    { name: 'Capacity zero', input: 'cap 0', expected: 'false None true' },
    { name: 'Many laps', input: 'cap 3, 10 rounds', expected: 'ok' },
    { name: 'Random operations', input: '20 000 steps vs VecDeque', expected: 'matches reference' },
  ],
}

const minHeap = {
  id: 'r5-min-heap',
  title: 'Min-heap',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>A <em>priority queue</em> hands you the smallest item first, whatever order the items arrived in. The standard way to build one is a <em>binary heap</em>: a tree where every parent is smaller than or equal to its children, so the smallest item is always at the top (the root). Finding the minimum is instant, and adding or removing an item takes time proportional to the tree's height, which is about log n.</p>`,
      `<p>The neat part is that this tree needs no pointers and no nodes. It is stored flat in a <code>Vec</code>, level by level, left to right. For the item at index <code>i</code>, its children are at <code>2*i + 1</code> and <code>2*i + 2</code>, and its parent is at <code>(i - 1) / 2</code> (integer division). The example below draws a heap and its flat form. The rule to keep is the <em>heap property</em>: <code>data[parent] &lt;= data[child]</code> everywhere.</p>`,
      `<p><strong>Push</strong> adds the new item at the end of the Vec (the next free spot in the bottom level), which may break the rule against its parent. So <em>sift up</em>: while the item is smaller than its parent, swap them and move up. Pushing 5, 3, 8, 1 in turn: <code>[5]</code>, then <code>[3, 5]</code> (3 swapped above 5), then <code>[3, 5, 8]</code>, then 1 arrives at index 3, swaps with its parent 5 (index 1) and then with 3 (index 0), giving <code>[1, 3, 8, 5]</code>.</p>`,
      `<p><strong>Pop</strong> must return the root. Swap the root with the last item, then <code>pop()</code> the last item off the Vec: that is the old minimum. Now the item that used to be last sits at the root, probably too big. So <em>sift down</em>: look at its two children (only those that exist, so check the index is below the current length), find the smallest of the three, and if a child is smaller swap with it and continue from there; otherwise stop.</p>`,
      `<p>Rust notes. <code>v.swap(i, j)</code> swaps two positions in one call. Indices are <code>usize</code> and cannot go below 0, so <code>(i - 1) / 2</code> is only valid when <code>i &gt; 0</code>; a <code>while i &gt; 0</code> loop guards it. <code>peek</code> uses <code>self.data.first().copied()</code>: <code>first()</code> gives an <code>Option&lt;&amp;i32&gt;</code> and <code>copied()</code> turns it into <code>Option&lt;i32&gt;</code>. The standard library has its own heap, <code>BinaryHeap</code>, which is a max-heap; you build the structure by hand here to see how it works.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    //          [0] 1
    //         /     \\
    //     [1] 3     [2] 5
    //     /   \\
    //  [3] 8   [4] 4          stored flat as [1, 3, 5, 8, 4]
    let heap = vec![1, 3, 5, 8, 4];
    let i = 1;
    println!("item {} has children {} and {}", heap[i], heap[2 * i + 1], heap[2 * i + 2]);
    println!("item {} has parent {}", heap[4], heap[(4 - 1) / 2]);
}`,
        output: 'item 3 has children 8 and 4\nitem 4 has parent 3',
        caption: 'A tree stored in a Vec, found by arithmetic on indices.',
      },
      {
        code: `fn main() {
    let mut data = vec![3, 5, 8];
    data.push(1);                    // the new item goes at the end: [3, 5, 8, 1]
    let mut i = data.len() - 1;      // its index is 3
    while i > 0 {                    // stop at the root: (0 - 1) would underflow a usize
        let parent = (i - 1) / 2;
        if data[i] < data[parent] {
            data.swap(i, parent);    // smaller than its parent: swap upward
            i = parent;
        } else {
            break;                   // it is in the right place
        }
    }
    println!("{:?}", data);
}`,
        output: '[1, 3, 8, 5]',
        caption: 'Sifting up after a push.',
      },
    ],
    terms: [
      { code: '2 * i + 1, 2 * i + 2', meaning: 'the indices of the children of the item at index i' },
      { code: '(i - 1) / 2', meaning: 'the index of the parent (only for i > 0)' },
      { code: 'v.swap(i, j)', meaning: 'swaps the items at two positions' },
      { code: 'v.first().copied()', meaning: 'the first item copied into an Option<i32> (None when empty)' },
    ],
  },
  task: `Finish <code>MinHeap</code>, a binary heap stored in a <code>Vec</code> (children of <code>i</code> at <code>2i+1</code> and <code>2i+2</code>). <code>pop</code> returns the smallest item. Do not use the standard library's heap.`,
  refresher: [
    `Parent of index <code>i</code> is <code>(i - 1) / 2</code>. Push at the end and sift up; pop by moving the last item to the root and sifting down.`,
    `<code>v.swap(0, last)</code> then <code>v.pop()</code> removes the old root and hands it back as an <code>Option</code>.`,
  ],
  hints: [
    `Sift up: while <code>i &gt; 0</code> and the item is smaller than its parent, swap them and move to the parent.`,
    `Sift down: pick the smaller of the two children that exist (check <code>&lt; len</code>); if it is smaller than the current item, swap and continue, else stop.`,
    `Pop on an empty heap returns <code>None</code>. Swap root and last <em>before</em> popping, and sift down only over the shorter length.`,
  ],
  inCpp: {
    code: `std::priority_queue<int, std::vector<int>, std::greater<int>> pq;
pq.push(3);
pq.push(1);
int top = pq.top();   // undefined behaviour when empty
pq.pop();`,
    note: `C++ needs <code>greater</code> to turn its max-heap into a min-heap, and <code>top()</code> on an empty queue is undefined. Rust's built-in heap is also a max-heap, but here you build the structure yourself and return <code>Option</code>.`,
  },
  starter: `struct MinHeap {
    data: Vec<i32>,
}

impl MinHeap {
    fn new() -> Self {
        MinHeap { data: Vec::new() }
    }
    fn push(&mut self, x: i32) {}
    fn pop(&mut self) -> Option<i32> {
        None
    }
    fn peek(&self) -> Option<i32> {
        None
    }
    fn len(&self) -> usize {
        0
    }
}`,
  solution: `struct MinHeap {
    data: Vec<i32>,
}

impl MinHeap {
    fn new() -> Self {
        MinHeap { data: Vec::new() }
    }
    fn push(&mut self, x: i32) {
        self.data.push(x);
        let mut i = self.data.len() - 1;
        while i > 0 {
            let parent = (i - 1) / 2;
            if self.data[i] < self.data[parent] {
                self.data.swap(i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }
    fn pop(&mut self) -> Option<i32> {
        if self.data.is_empty() {
            return None;
        }
        let last = self.data.len() - 1;
        self.data.swap(0, last);
        let top = self.data.pop();
        let n = self.data.len();
        let mut i = 0;
        loop {
            let (l, r) = (2 * i + 1, 2 * i + 2);
            let mut smallest = i;
            if l < n && self.data[l] < self.data[smallest] {
                smallest = l;
            }
            if r < n && self.data[r] < self.data[smallest] {
                smallest = r;
            }
            if smallest == i {
                break;
            }
            self.data.swap(i, smallest);
            i = smallest;
        }
        top
    }
    fn peek(&self) -> Option<i32> {
        self.data.first().copied()
    }
    fn len(&self) -> usize {
        self.data.len()
    }
}`,
  harness: LCG + `
fn harness_drain(h: &mut MinHeap) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(x) = h.pop() {
        out.push(x);
    }
    out
}

fn harness_show(v: &[i32]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
}

fn main() {
    println!("\\n@@TEST 1@@");
    let mut h = MinHeap::new();
    for x in [5, 3, 8, 1, 4] {
        h.push(x);
    }
    println!("{:?} {}", h.peek(), h.len());
    println!("{}", harness_show(&harness_drain(&mut h)));

    println!("\\n@@TEST 2@@");
    let mut h = MinHeap::new();
    println!("{:?} {:?} {}", h.pop(), h.peek(), h.len());

    println!("\\n@@TEST 3@@");
    let mut h = MinHeap::new();
    h.push(42);
    println!("{:?} {:?} {:?}", h.peek(), h.pop(), h.pop());

    println!("\\n@@TEST 4@@");
    let mut h = MinHeap::new();
    for x in [2, 2, 1, 2, 1] {
        h.push(x);
    }
    println!("{}", harness_show(&harness_drain(&mut h)));

    println!("\\n@@TEST 5@@");
    let mut h = MinHeap::new();
    for x in 1..=10 {
        h.push(x);
    }
    println!("{}", harness_show(&harness_drain(&mut h)));

    println!("\\n@@TEST 6@@");
    let mut h = MinHeap::new();
    for x in (1..=10).rev() {
        h.push(x);
    }
    println!("{}", harness_show(&harness_drain(&mut h)));

    println!("\\n@@TEST 7@@");
    let mut h = MinHeap::new();
    let mut reference = std::collections::BinaryHeap::new();
    let mut state = 2024u64;
    let mut ok = true;
    for _ in 0..5000 {
        let r = harness_next(&mut state);
        if r % 3 == 2 {
            if h.pop() != reference.pop().map(|std::cmp::Reverse(x)| x) {
                ok = false;
            }
        } else {
            let x = (r % 1000) as i32 - 500;
            h.push(x);
            reference.push(std::cmp::Reverse(x));
        }
        if h.len() != reference.len() || h.peek() != reference.peek().map(|std::cmp::Reverse(x)| *x) {
            ok = false;
        }
    }
    let mut rest = Vec::new();
    while let Some(std::cmp::Reverse(x)) = reference.pop() {
        rest.push(x);
    }
    if harness_drain(&mut h) != rest {
        ok = false;
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  forbidden: [{ pattern: '\\bBinaryHeap\\b', message: 'Build the heap yourself: BinaryHeap is off the table here.' }],
  tests: [
    { name: 'Five items', input: 'push 5 3 8 1 4', expected: 'Some(1) 5\n1 3 4 5 8' },
    { name: 'Empty heap', input: '(empty)', expected: 'None None 0' },
    { name: 'One item', input: 'push 42', expected: 'Some(42) Some(42) None' },
    { name: 'Duplicates', input: '2 2 1 2 1', expected: '1 1 2 2 2' },
    { name: 'Ascending input', input: '1 to 10', expected: '1 2 3 4 5 6 7 8 9 10' },
    { name: 'Descending input', input: '10 down to 1', expected: '1 2 3 4 5 6 7 8 9 10' },
    { name: 'Random operations', input: '5 000 steps vs BinaryHeap', expected: 'matches reference' },
  ],
}

const bucketIndex = {
  id: 'r5-bucket-index',
  title: 'Which bucket?',
  kind: 'drill',
  introduces: [],
  teach: {
    body: [
      `<p>The next structure is a <em>hash map</em>: it stores values under keys and finds one again almost instantly. The first step is a small one. A map keeps an array of <em>buckets</em>, and every key has to be turned into the number of one bucket. A real hash map first scrambles the key with a hash function; ours will use the key itself, which keeps the idea clear.</p>`,
      `<p>The conversion is "key modulo the number of buckets", which always gives a number from 0 up to one less than the bucket count. There is a trap, and it exists in C++ too. The <code>%</code> operator keeps the sign of the left side: <code>-7 % 3</code> is <code>-1</code>, not 2. A negative number is no use as an index, and casting it with <code>as usize</code> turns it into an enormous number that panics when you index with it.</p>`,
      `<p>Rust has the fix built in: <code>key.rem_euclid(n)</code> is the <em>Euclidean remainder</em>, which is never negative. <code>(-7).rem_euclid(3)</code> is 2. Both numbers must have the same type, but a bucket count is a <code>usize</code> and a key is an <code>i32</code>. So convert the count to <code>i32</code> with <code>as i32</code>, do the remainder, and convert the result back to <code>usize</code> with <code>as usize</code>: <code>key.rem_euclid(buckets as i32) as usize</code>. The result is non-negative and below <code>buckets</code>, so the second cast cannot misbehave.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let key: i32 = -7;
    println!("{}", key % 3);              // keeps the sign: -1
    println!("{}", key.rem_euclid(3));    // never negative: 2
    let buckets: usize = 3;
    let index = key.rem_euclid(buckets as i32) as usize;   // i32 for the maths, usize for indexing
    println!("{}", index);
}`,
        output: '-1\n2\n2',
        caption: 'rem_euclid is the remainder you want for indexing.',
      },
    ],
    terms: [
      { code: 'key.rem_euclid(n)', meaning: 'the remainder of key divided by n, never negative' },
      { code: 'buckets as i32', meaning: 'converts a usize to an i32 so the two types match' },
      { code: 'result as usize', meaning: 'converts back, so the number can be used as an index' },
    ],
  },
  task: `Write <code>bucket_of(key, buckets)</code>: the bucket index for a key, always in <code>0..buckets</code>, including for negative keys. Assume <code>buckets</code> is at least 1.`,
  refresher: [
    `<code>-7 % 3</code> is <code>-1</code>, but <code>(-7_i32).rem_euclid(3)</code> is <code>2</code>. Casting a negative number to <code>usize</code> gives a huge value.`,
    `Convert with <code>as</code> to make the types match: <code>buckets as i32</code> going in, <code>as usize</code> coming out.`,
  ],
  hints: [
    `Call <code>rem_euclid</code> on the key, not on the bucket count.`,
    `The argument to <code>rem_euclid</code> must be an <code>i32</code>, so convert <code>buckets</code> first.`,
  ],
  inCpp: {
    code: `size_t bucket_of(int key, size_t buckets) {
    int n = (int)buckets;
    return ((key % n) + n) % n;   // the double modulo fixes negatives
}`,
    note: `C++ programmers patch negative keys with a double modulo. Rust has <code>rem_euclid</code> for it, and the <code>as</code> casts are written out where C++ converts silently.`,
  },
  starter: `fn bucket_of(key: i32, buckets: usize) -> usize {
    0
}`,
  solution: `fn bucket_of(key: i32, buckets: usize) -> usize {
    key.rem_euclid(buckets as i32) as usize
}`,
  harness: `fn main() {
    println!("\\n@@TEST 1@@");
    println!("{} {} {}", bucket_of(7, 8), bucket_of(15, 8), bucket_of(8, 8));

    println!("\\n@@TEST 2@@");
    println!("{} {} {}", bucket_of(-1, 8), bucket_of(-8, 8), bucket_of(-9, 8));

    println!("\\n@@TEST 3@@");
    println!("{} {}", bucket_of(123, 1), bucket_of(-5, 1));

    println!("\\n@@TEST 4@@");
    println!("{} {}", bucket_of(i32::MAX, 5), bucket_of(i32::MIN, 5));

    println!("\\n@@TEST 5@@");
    let mut ok = true;
    for k in -1000..1000 {
        let b = bucket_of(k, 7);
        ok &= b < 7 && b as i32 == ((k % 7) + 7) % 7;
    }
    println!("{}", if ok { "ok" } else { "wrong" });
}`,
  tests: [
    { name: 'Positive keys', input: '7 15 8 into 8', expected: '7 7 0' },
    { name: 'Negative keys', input: '-1 -8 -9 into 8', expected: '7 0 7' },
    { name: 'One bucket', input: '123 -5 into 1', expected: '0 0' },
    { name: 'Extreme keys', input: 'i32::MAX, i32::MIN into 5', expected: '2 2' },
    { name: 'Every key in range', input: '-1000 to 999 into 7', expected: 'ok' },
  ],
}

const hashMap = {
  id: 'r5-hash-map-chaining',
  title: 'Hash map with chaining',
  kind: 'implement',
  introduces: ['hashmap', 'question-mark'],
  teach: {
    body: [
      `<p>A hash map stores <em>key to value</em> pairs and finds the value for a key in roughly constant time. Picture an array of <em>buckets</em>. To store a key, compute its bucket index (your <code>bucket_of</code> from the last lesson), and put the pair in that bucket. To find it again, compute the same index and look only in that bucket. No searching through everything.</p>`,
      `<p>Two different keys can land in the same bucket: with 4 buckets, keys 1 and 5 both give index 1. This is a <em>collision</em>. The simplest cure is <em>separate chaining</em>: each bucket is not one slot but a small list of pairs, and a lookup scans the few pairs in its bucket. The first example below builds exactly this by hand. If buckets stay short, everything stays fast.</p>`,
      `<p>In Rust a pair is a tuple <code>(i32, i32)</code>, a bucket is a <code>Vec&lt;(i32, i32)&gt;</code>, and the map is a <code>Vec</code> of buckets: <code>Vec&lt;Vec&lt;(i32, i32)&gt;&gt;</code>. <code>vec![Vec::new(); 8]</code> makes eight separate empty buckets (the macro clones the empty one eight times). Tuple fields are <code>.0</code> (key) and <code>.1</code> (value). The struct also keeps <code>len</code>, the number of pairs, so <code>len()</code> needs no counting.</p>`,
      `<p>The API copies the standard <code>HashMap</code>, which you can see in the second example (stage 6 covers it properly). <code>insert</code> returns the <em>old</em> value if the key was already there (<code>Some(old)</code>), else <code>None</code>. <code>get</code> returns <code>Option</code>, and <code>remove</code> returns the removed value as an <code>Option</code>. There is no "-1 means missing" anywhere.</p>`,
      `<p>Three small tools you need. To change a pair in place, loop with <code>for entry in bucket.iter_mut()</code>: each <code>entry</code> is a <code>&amp;mut (i32, i32)</code>, and <code>std::mem::replace(&amp;mut entry.1, value)</code> stores the new value and hands back the old one. To delete from a bucket, <code>swap_remove(pos)</code> moves the last pair into the hole and returns the removed pair; the bucket's order changes, which does not matter here. And the <code>?</code> you know from <code>Result</code> works on <code>Option</code> too: in a function that returns <code>Option</code>, <code>x?</code> gives the inner value of a <code>Some</code> or returns <code>None</code> from the whole function straight away, which is the third example.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    // 4 buckets; the bucket of a key is key % 4
    let mut buckets: Vec<Vec<(i32, i32)>> = vec![Vec::new(); 4];
    for (key, value) in [(1, 10), (5, 50), (2, 20)] {
        let b = (key % 4) as usize;        // keys 1 and 5 both land in bucket 1: a collision
        buckets[b].push((key, value));     // chaining: just add to that bucket's list
    }
    println!("{:?}", buckets);
}`,
        output: '[[], [(1, 10), (5, 50)], [(2, 20)], []]',
        caption: 'Buckets of pairs, built by hand.',
      },
      {
        code: `use std::collections::HashMap;   // the standard library's map, for comparison

fn main() {
    let mut ages = HashMap::new();           // an empty map
    println!("{:?}", ages.insert(7, 30));    // a new key: insert gives back None
    println!("{:?}", ages.insert(7, 31));    // an existing key: gives back the OLD value
    println!("{:?}", ages.get(&7));          // look up: Some(&value) or None
    println!("{:?}", ages.get(&8));
    println!("{:?}", ages.remove(&7));       // remove gives back the value, if there was one
    println!("{}", ages.len());
}`,
        output: 'None\nSome(30)\nSome(31)\nNone\nSome(31)\n0',
        caption: 'The API you are about to rebuild.',
      },
      {
        code: `fn first_even_doubled(v: &[i32]) -> Option<i32> {
    let pos = v.iter().position(|x| x % 2 == 0)?;   // None here ends the whole function with None
    Some(v[pos] * 2)
}

fn main() {
    println!("{:?}", first_even_doubled(&[3, 5, 6, 7]));
    println!("{:?}", first_even_doubled(&[3, 5]));
}`,
        output: 'Some(12)\nNone',
        caption: '? on an Option.',
      },
    ],
    terms: [
      { code: 'Vec<Vec<(i32, i32)>>', meaning: 'a vector of buckets, each a vector of (key, value) pairs' },
      { code: 'vec![Vec::new(); 8]', meaning: 'eight separate empty vectors' },
      { code: 'entry.0 / entry.1', meaning: 'the first and second field of a tuple' },
      { code: 'for e in bucket.iter_mut()', meaning: 'visits each item with a &mut reference so it can be changed' },
      { code: 'std::mem::replace(&mut x, new)', meaning: 'puts new in x and returns what was there' },
      { code: 'bucket.swap_remove(pos)', meaning: 'removes the item at pos by moving the last one into its place' },
      { code: 'expr?', meaning: 'in a function returning Option: the inner value, or return None right away' },
    ],
  },
  task: `Finish <code>MyMap</code>, an <code>i32</code> to <code>i32</code> hash map with separate chaining (each bucket is a <code>Vec</code> of pairs). Do not use any standard map or set. <code>bucket</code> is given.`,
  refresher: [
    `<code>bucket(key)</code> (given) turns a key into a valid bucket index, even for negative keys.`,
    `<code>std::mem::replace(&amp;mut slot, new)</code> puts in the new value and returns the old one. <code>Vec::swap_remove(i)</code> removes in O(1).`,
  ],
  hints: [
    `<code>insert</code>: look through the bucket for the key; if found, replace the value and return <code>Some(old)</code>; otherwise push the pair, add 1 to <code>len</code>, return <code>None</code>.`,
    `<code>get</code>: search the bucket with <code>iter().find(...)</code> and turn the pair it finds into just its value with <code>map</code>.`,
    `<code>remove</code>: find the position with <code>iter().position(...)</code>, then <code>swap_remove</code> it and return its value.`,
  ],
  inCpp: {
    code: `std::vector<std::list<std::pair<int, int>>> buckets(8);
// insert: scan buckets[b]; overwrite if found, else push_back
// get:    scan buckets[b]; return a pointer or a sentinel`,
    note: `C++ needs an out-parameter, a pointer or a sentinel for "not found". Rust returns <code>Option</code> from <code>get</code>, <code>insert</code> and <code>remove</code>, so the caller cannot forget the missing case.`,
  },
  starter: `struct MyMap {
    buckets: Vec<Vec<(i32, i32)>>,
    len: usize,
}

impl MyMap {
    fn new() -> Self {
        MyMap { buckets: vec![Vec::new(); 8], len: 0 }
    }
    fn bucket(&self, key: i32) -> usize {
        key.rem_euclid(self.buckets.len() as i32) as usize
    }
    // Returns the old value if the key was already present.
    fn insert(&mut self, key: i32, value: i32) -> Option<i32> {
        None
    }
    fn get(&self, key: i32) -> Option<i32> {
        None
    }
    // Returns the removed value, if there was one.
    fn remove(&mut self, key: i32) -> Option<i32> {
        None
    }
    fn len(&self) -> usize {
        0
    }
}`,
  solution: `struct MyMap {
    buckets: Vec<Vec<(i32, i32)>>,
    len: usize,
}

impl MyMap {
    fn new() -> Self {
        MyMap { buckets: vec![Vec::new(); 8], len: 0 }
    }
    fn bucket(&self, key: i32) -> usize {
        key.rem_euclid(self.buckets.len() as i32) as usize
    }
    fn insert(&mut self, key: i32, value: i32) -> Option<i32> {
        let b = self.bucket(key);
        for entry in self.buckets[b].iter_mut() {
            if entry.0 == key {
                return Some(std::mem::replace(&mut entry.1, value));
            }
        }
        self.buckets[b].push((key, value));
        self.len += 1;
        None
    }
    fn get(&self, key: i32) -> Option<i32> {
        self.buckets[self.bucket(key)].iter().find(|e| e.0 == key).map(|e| e.1)
    }
    fn remove(&mut self, key: i32) -> Option<i32> {
        let b = self.bucket(key);
        let pos = self.buckets[b].iter().position(|e| e.0 == key)?;
        self.len -= 1;
        Some(self.buckets[b].swap_remove(pos).1)
    }
    fn len(&self) -> usize {
        self.len
    }
}`,
  harness: LCG + `
fn main() {
    println!("\\n@@TEST 1@@");
    let mut m = MyMap::new();
    println!("{:?} {:?} {:?}", m.insert(1, 10), m.insert(2, 20), m.insert(1, 11));
    println!("{:?} {:?} {:?} {}", m.get(1), m.get(2), m.get(3), m.len());

    println!("\\n@@TEST 2@@");
    let mut m = MyMap::new();
    println!("{:?} {:?} {}", m.get(5), m.remove(5), m.len());

    println!("\\n@@TEST 3@@");
    let mut m = MyMap::new();
    m.insert(7, 70);
    println!("{:?} {:?} {:?} {}", m.remove(7), m.remove(7), m.get(7), m.len());

    println!("\\n@@TEST 4@@");
    let mut m = MyMap::new();
    for k in [1, 9, 17, 25, 33] {
        m.insert(k, k * 2);
    }
    println!("{:?} {:?} {:?}", m.get(17), m.remove(9), m.get(9));
    println!("{:?} {:?} {}", m.get(1), m.get(33), m.len());

    println!("\\n@@TEST 5@@");
    let mut m = MyMap::new();
    m.insert(-1, 5);
    m.insert(-9, 6);
    m.insert(0, 7);
    println!("{:?} {:?} {:?} {}", m.get(-1), m.get(-9), m.get(0), m.len());

    println!("\\n@@TEST 6@@");
    let mut m = MyMap::new();
    for k in 0..2000 {
        m.insert(k, k + 1);
    }
    let mut ok = m.len() == 2000;
    for k in 0..2000 {
        if m.get(k) != Some(k + 1) {
            ok = false;
        }
    }
    println!("{}", if ok { "ok" } else { "wrong" });

    println!("\\n@@TEST 7@@");
    let mut m = MyMap::new();
    let mut reference: std::collections::HashMap<i32, i32> = std::collections::HashMap::new();
    let mut state = 5u64;
    let mut ok = true;
    for step in 0..6000 {
        let r = harness_next(&mut state);
        let key = (r % 400) as i32 - 200;
        match (r / 400) % 3 {
            0 => ok &= m.insert(key, step) == reference.insert(key, step),
            1 => ok &= m.get(key) == reference.get(&key).copied(),
            _ => ok &= m.remove(key) == reference.remove(&key),
        }
        ok &= m.len() == reference.len();
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  forbidden: [{ pattern: '\\b(HashMap|BTreeMap|HashSet|BTreeSet)\\b', message: 'Build the map yourself: the standard maps and sets are off the table here.' }],
  tests: [
    { name: 'Insert and overwrite', input: 'insert 1, 2, 1 again', expected: 'None None Some(10)\nSome(11) Some(20) None 2' },
    { name: 'Empty map', input: '(empty)', expected: 'None None 0' },
    { name: 'Remove twice', input: 'insert 7, remove 7 twice', expected: 'Some(70) None None 0' },
    { name: 'Colliding keys', input: '1 9 17 25 33', expected: 'Some(34) Some(18) None\nSome(2) Some(66) 4' },
    { name: 'Negative keys', input: '-1 -9 0', expected: 'Some(5) Some(6) Some(7) 3' },
    { name: 'Growth', input: '2 000 keys', expected: 'ok' },
    { name: 'Random operations', input: '6 000 steps vs HashMap', expected: 'matches reference' },
  ],
}

const listShape = {
  id: 'r5-list-shape',
  title: 'A list that owns itself',
  kind: 'concept',
  introduces: ['option-take'],
  teach: {
    body: [
      `<p>A <em>linked list</em> is a chain of nodes. Each node holds a value and a link to the next node, and the list itself holds a link to the first node, the <em>head</em>. Picture <code>head -&gt; [3] -&gt; [2] -&gt; [1] -&gt; end</code>. Adding at the front is cheap because nothing else moves: make a new node and point it at the old head. In C++ the link is a raw pointer: <code>head = new Node{x, head};</code>.</p>`,
      `<p>In Rust the link is <code>Option&lt;Box&lt;Node&gt;&gt;</code>, which you met in the types stage: <code>None</code> ends the chain and <code>Some(box)</code> is "the next node, owned right here". Ownership is the difference. Each node <em>owns</em> the node after it, so the whole list is owned by <code>head</code>. When the list goes out of scope Rust frees every node by itself: no destructor loop, no <code>delete</code>, no leak. (Honest footnote: freeing is recursive, so a list of millions of nodes can overflow the stack when dropped. Real code writes a custom <code>Drop</code>; we ignore that here.)</p>`,
      `<p>That ownership creates a puzzle in the most basic operation. To push at the front you must <em>move</em> the old head into the new node's <code>next</code> field, then store the new node as the head. But a method has only <code>&amp;mut self</code>: it may change the struct, it does not own it. Writing <code>next: self.head</code> tries to move a value out from behind a reference, and the compiler refuses with E0507: "cannot move out of <code>self.head</code> which is behind a mutable reference". It is right to refuse: for a moment <code>self.head</code> would be an empty, invalid slot, and if anything panicked now the list would be corrupt when it is dropped. You may only take a value out if you leave something valid behind.</p>`,
      `<p>That is what <code>.take()</code> is for. On an <code>Option</code>, <code>opt.take()</code> moves the contents out and leaves <code>None</code> in their place, returning what was there. It is the same idea as the <code>mem::replace</code> you know, with <code>None</code> as the replacement. So <code>self.head.take()</code> detaches the whole chain and leaves a valid empty list, and the new node can own the chain. (Do not confuse it with <code>.take(n)</code> on an iterator from stage 3: this one has empty parentheses and belongs to <code>Option</code>.)</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let mut slot: Option<String> = Some(String::from("old"));
    let taken = slot.take();           // moves the String out and leaves None behind
    println!("{:?} {:?}", taken, slot);

    let mut empty: Option<i32> = None;
    println!("{:?} {:?}", empty.take(), empty);   // taking from None is fine: it gives None
}`,
        output: 'Some("old") None\nNone None',
        caption: 'take() moves the value out and leaves None.',
      },
      {
        code: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

fn main() {
    // head -> [1] -> end
    let mut head: Option<Box<Node>> = Some(Box::new(Node { val: 1, next: None }));

    // push 2 at the front: detach the old chain, then build the new head around it
    let old = head.take();                                   // head is None now
    head = Some(Box::new(Node { val: 2, next: old }));       // head -> [2] -> [1] -> end

    let first = head.as_ref().unwrap();                      // look without taking: &Box<Node>
    println!("{} then {}", first.val, first.next.as_ref().unwrap().val);
}`,
        output: '2 then 1',
        caption: 'take() to detach, a new node to wrap it. as_ref() only looks.',
      },
    ],
    terms: [
      { code: 'Option<Box<Node>>', meaning: 'a link: None ends the list, Some(box) is the next node, owned' },
      { code: 'opt.take()', meaning: 'moves the value out of an Option and leaves None in its place' },
      { code: 'opt.as_ref()', meaning: 'turns &Option<T> into Option<&T>: look at the contents without taking them' },
      { code: 'E0507', meaning: 'cannot move out of a value behind a reference' },
    ],
  },
  task: `This does not compile: <code>push_front</code> moves the old head out from behind <code>&amp;mut self</code>. Fix it so the program prints <code>3 2 1</code>.`,
  compare: {
    cpp: { code: `struct Node { int val; Node* next; };
struct List {
    Node* head = nullptr;
    void push_front(int x) { head = new Node{x, head}; }
};`, outcome: 'Fine: copying a pointer is free', ok: true },
    rust: { code: `struct Node { val: i32, next: Option<Box<Node>> }
struct List { head: Option<Box<Node>> }
impl List {
    fn push_front(&mut self, x: i32) {
        self.head = Some(Box::new(Node { val: x, next: self.head }));
    }
}`, outcome: 'Error: cannot move out of self.head', ok: false, errorCode: 'E0507' },
    text: `A C++ pointer can be copied, so two names for one node are no problem (and you must remember who deletes it). A <code>Box</code> has one owner, so the old head has to be <em>moved</em>, and <code>take()</code> is the safe way to do that from <code>&amp;mut self</code>.`,
  },
  refresher: [
    `<code>opt.take()</code> leaves <code>None</code> in <code>opt</code> and returns the old contents, so it works behind <code>&amp;mut</code>.`,
    `A <code>Box</code> has one owner: a node is owned by whichever node (or the list) holds its <code>Some(box)</code>.`,
  ],
  hints: [
    `Read the error: it says you cannot move out of <code>self.head</code> because it is behind a <code>&amp;mut</code> reference.`,
    `You need to take the old head out and leave something valid behind. Which <code>Option</code> method does that?`,
  ],
  inCpp: {
    code: `struct Node { int val; Node* next; };
Node* head = new Node{1, nullptr};
Node* old = head;          // two pointers to the same node, no problem
head = new Node{2, old};`,
    note: `Raw pointers can be shared freely, which is also why C++ lists leak and double-delete. Rust's ownership makes sharing impossible by default, so the list moves its pieces on purpose.`,
  },
  starter: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

struct List {
    head: Option<Box<Node>>,
}

impl List {
    fn new() -> Self {
        List { head: None }
    }
    fn push_front(&mut self, x: i32) {
        self.head = Some(Box::new(Node { val: x, next: self.head }));
    }
    fn to_vec(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = &self.head;
        while let Some(node) = cur {
            out.push(node.val);
            cur = &node.next;
        }
        out
    }
}

fn main() {
    let mut list = List::new();
    for x in 1..=3 {
        list.push_front(x);
    }
    let parts: Vec<String> = list.to_vec().iter().map(|x| x.to_string()).collect();
    println!("{}", parts.join(" "));
}`,
  solution: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

struct List {
    head: Option<Box<Node>>,
}

impl List {
    fn new() -> Self {
        List { head: None }
    }
    fn push_front(&mut self, x: i32) {
        self.head = Some(Box::new(Node { val: x, next: self.head.take() }));
    }
    fn to_vec(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = &self.head;
        while let Some(node) = cur {
            out.push(node.val);
            cur = &node.next;
        }
        out
    }
}

fn main() {
    let mut list = List::new();
    for x in 1..=3 {
        list.push_front(x);
    }
    let parts: Vec<String> = list.to_vec().iter().map(|x| x.to_string()).collect();
    println!("{}", parts.join(" "));
}`,
  require: [{ pattern: 'next:\\s*self\\.head\\.take\\(\\)|\\.take\\(\\)', message: 'Detach the old head with take()' }],
  tests: [{ name: 'Prints 3 2 1', expected: '3 2 1' }],
}

const linkedList = {
  id: 'r5-linked-list',
  title: 'Singly linked list',
  kind: 'implement',
  introduces: ['option-methods'],
  teach: {
    body: [
      `<p>Now the full list: <code>push_front</code>, <code>pop_front</code>, <code>peek</code>, <code>len</code> and <code>to_vec</code>. You have <code>push_front</code> from the last lesson: <code>take()</code> the old head, wrap it in a new node. The other operations use the same two ideas, <em>taking</em> a node out to own it, and <em>borrowing</em> to look without owning.</p>`,
      `<p><strong>pop_front</strong> removes the first node and returns its value. Trace <code>head -&gt; [3] -&gt; [2] -&gt; [1]</code>. First <code>self.head.take()</code>: now <code>head</code> is <code>None</code> and you own the box holding 3. That node's <code>next</code> still leads to the rest, so assign <code>self.head = node.next</code> and the list is <code>head -&gt; [2] -&gt; [1]</code> again. Return <code>node.val</code>, which is 3. The node's box is freed when it goes out of scope, which is the <code>delete</code> C++ makes you write. An empty list is <code>take()</code> giving <code>None</code>, and you return <code>None</code> too. Write it with <code>match self.head.take() { None =&gt; None, Some(node) =&gt; { ... } }</code>.</p>`,
      `<p><strong>peek</strong> returns <code>Option&lt;&amp;i32&gt;</code>, a look at the first value. You must not take anything, so you need a way to look into <code>self.head</code>, a <code>&amp;Option&lt;Box&lt;Node&gt;&gt;</code>, without moving it. <code>.as_ref()</code> converts <code>&amp;Option&lt;T&gt;</code> into <code>Option&lt;&amp;T&gt;</code>: the same <code>Some</code> or <code>None</code>, but holding a reference to the contents instead of the contents. Then <code>.map(|node| &amp;node.val)</code> turns the optional node reference into an optional reference to its value. (<code>.as_mut()</code> is the same with <code>&amp;mut</code>.)</p>`,
      `<p><strong>to_vec</strong> walks the whole list without changing it. Keep a variable <code>cur</code> that is a <em>reference</em> to a link, starting at <code>&amp;self.head</code>. Loop <code>while let Some(node) = cur</code>: use <code>node.val</code>, then move along with <code>cur = &amp;node.next</code>. The reference moves, the nodes do not, so ownership never changes. Keep a <code>len</code> field and update it, so <code>len()</code> is instant.</p>`,
    ],
    examples: [
      {
        code: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

fn main() {
    // head -> [3] -> [2] -> end
    let mut head = Some(Box::new(Node { val: 3, next: Some(Box::new(Node { val: 2, next: None })) }));

    // pop_front by hand
    match head.take() {                  // head is None now, we own the first node
        None => println!("empty"),
        Some(node) => {
            head = node.next;            // the rest of the list becomes the list
            println!("popped {}", node.val);
        }
    }
    // peek by hand: as_ref() looks without taking
    println!("{:?}", head.as_ref().map(|n| &n.val));
}`,
        output: 'popped 3\nSome(2)',
        caption: 'pop takes the node out; peek only looks.',
      },
      {
        code: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

fn main() {
    let head = Some(Box::new(Node { val: 1, next: Some(Box::new(Node { val: 2, next: None })) }));
    let mut cur = &head;                  // a reference to the first link
    while let Some(node) = cur {          // node: &Box<Node>
        println!("{}", node.val);
        cur = &node.next;                 // move the reference along, not the nodes
    }
}`,
        output: '1\n2',
        caption: 'Walking a list with a moving reference.',
      },
    ],
    terms: [
      { code: 'match self.head.take() { ... }', meaning: 'detach the first link, then handle empty and non-empty' },
      { code: 'opt.as_ref()', meaning: 'Option<&T> from &Option<T>: look at the contents without taking them' },
      { code: 'opt.map(|n| &n.val)', meaning: 'if Some, apply the closure to the contents; None stays None' },
      { code: 'let mut cur = &self.head;', meaning: 'a reference that moves along the list as you walk' },
    ],
  },
  task: `Finish <code>List</code>, a singly linked stack of <code>i32</code> built from <code>Option&lt;Box&lt;Node&gt;&gt;</code>: <code>push_front</code>, <code>pop_front</code>, <code>peek</code>, <code>len</code> and <code>to_vec</code>.`,
  refresher: [
    `<code>self.head.take()</code> moves the value out of an <code>Option</code> and leaves <code>None</code> behind: the way to detach a node from behind <code>&amp;mut self</code>.`,
    `<code>as_ref()</code> turns <code>&amp;Option&lt;Box&lt;Node&gt;&gt;</code> into <code>Option&lt;&amp;Box&lt;Node&gt;&gt;</code>. Dropping a list frees every node automatically.`,
  ],
  hints: [
    `<code>push_front</code>: build a <code>Node</code> whose <code>next</code> is <code>self.head.take()</code>, store it as the new head, and add 1 to <code>len</code>.`,
    `<code>pop_front</code>: <code>match self.head.take()</code>; in the <code>Some(node)</code> arm set <code>self.head = node.next</code>, subtract 1 from <code>len</code>, and return <code>Some(node.val)</code>.`,
    `<code>to_vec</code>: keep <code>cur = &amp;self.head</code>, loop with <code>while let Some(node) = cur</code>, push <code>node.val</code>, then <code>cur = &amp;node.next</code>.`,
  ],
  inCpp: {
    code: `struct Node { int val; Node* next; };
struct List {
    Node* head = nullptr;
    void push_front(int x) { head = new Node{x, head}; }
    ~List() {
        while (head) {
            Node* n = head;
            head = head->next;
            delete n;
        }
    }
};`,
    note: `C++ needs <code>new</code>, a hand-written destructor and (for safety) a copy policy. Rust frees every <code>Box</code> automatically when the list goes out of scope, and <code>Option</code> forces you to handle the empty case instead of a null check you might forget.`,
  },
  starter: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

struct List {
    head: Option<Box<Node>>,
    len: usize,
}

impl List {
    fn new() -> Self {
        List { head: None, len: 0 }
    }
    fn push_front(&mut self, x: i32) {}
    fn pop_front(&mut self) -> Option<i32> {
        None
    }
    fn peek(&self) -> Option<&i32> {
        None
    }
    fn len(&self) -> usize {
        0
    }
    fn to_vec(&self) -> Vec<i32> {
        Vec::new()
    }
}`,
  solution: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

struct List {
    head: Option<Box<Node>>,
    len: usize,
}

impl List {
    fn new() -> Self {
        List { head: None, len: 0 }
    }
    fn push_front(&mut self, x: i32) {
        let old = self.head.take();
        self.head = Some(Box::new(Node { val: x, next: old }));
        self.len += 1;
    }
    fn pop_front(&mut self) -> Option<i32> {
        match self.head.take() {
            None => None,
            Some(node) => {
                self.head = node.next;
                self.len -= 1;
                Some(node.val)
            }
        }
    }
    fn peek(&self) -> Option<&i32> {
        self.head.as_ref().map(|node| &node.val)
    }
    fn len(&self) -> usize {
        self.len
    }
    fn to_vec(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = &self.head;
        while let Some(node) = cur {
            out.push(node.val);
            cur = &node.next;
        }
        out
    }
}`,
  harness: LCG + `
fn main() {
    println!("\\n@@TEST 1@@");
    let mut l = List::new();
    l.push_front(1);
    l.push_front(2);
    l.push_front(3);
    println!("{:?} {:?} {}", l.peek(), l.to_vec(), l.len());

    println!("\\n@@TEST 2@@");
    let mut l = List::new();
    println!("{:?} {:?} {:?} {}", l.pop_front(), l.peek(), l.to_vec(), l.len());

    println!("\\n@@TEST 3@@");
    let mut l = List::new();
    l.push_front(8);
    println!("{:?} {:?} {:?} {}", l.pop_front(), l.pop_front(), l.peek(), l.len());

    println!("\\n@@TEST 4@@");
    let mut l = List::new();
    for x in [4, 4, 5, 4] {
        l.push_front(x);
    }
    let a = l.pop_front();
    println!("{:?} {:?} {}", a, l.to_vec(), l.len());

    println!("\\n@@TEST 5@@");
    let mut l = List::new();
    l.push_front(1);
    l.push_front(2);
    l.pop_front();
    l.push_front(3);
    l.push_front(4);
    println!("{:?}", l.to_vec());

    println!("\\n@@TEST 6@@");
    let mut l = List::new();
    let mut reference: std::collections::VecDeque<i32> = std::collections::VecDeque::new();
    let mut state = 11u64;
    let mut ok = true;
    for step in 0..3000 {
        if harness_next(&mut state) % 3 == 2 {
            ok &= l.pop_front() == reference.pop_front();
        } else {
            l.push_front(step);
            reference.push_front(step);
        }
        ok &= l.len() == reference.len() && l.peek() == reference.front();
    }
    ok &= l.to_vec() == reference.iter().copied().collect::<Vec<_>>();
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  tests: [
    { name: 'Push three', input: 'push_front 1 2 3', expected: 'Some(3) [3, 2, 1] 3' },
    { name: 'Empty list', input: '(empty)', expected: 'None None [] 0' },
    { name: 'One item', input: 'push_front 8, pop twice', expected: 'Some(8) None None 0' },
    { name: 'Duplicates', input: '4 4 5 4, pop', expected: 'Some(4) [5, 4, 4] 3' },
    { name: 'Mixed push and pop', input: '1 2 pop 3 4', expected: '[4, 3, 1]' },
    { name: 'Random operations', input: '3 000 steps vs VecDeque', expected: 'matches reference' },
  ],
}

const reverseList = {
  id: 'r5-reverse-list',
  title: 'Reverse a linked list',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Reversing a list means every link must point the other way. You do it in one pass with two variables: <code>prev</code>, the part you have already reversed (it starts empty), and the rest you have not touched yet. Each step peels the first node off the rest and glues it on the front of <code>prev</code>. Trace <code>1 -&gt; 2 -&gt; 3</code>:</p>`,
      `<p>Start: rest = <code>1 -&gt; 2 -&gt; 3</code>, prev = empty. Step 1: take node 1 off the rest (rest is now <code>2 -&gt; 3</code>), point it at prev, and it becomes prev: <code>1</code>. Step 2: take node 2, point it at prev: <code>2 -&gt; 1</code>. Step 3: take node 3: <code>3 -&gt; 2 -&gt; 1</code>. The rest is empty, so prev is the answer. The C++ version does the same with three pointers: <code>prev</code>, <code>head</code>, and a saved <code>next</code> so you do not lose the rest when you overwrite <code>head-&gt;next</code>.</p>`,
      `<p>Rust does the saving and the unlinking in one move. <code>reverse</code> takes the head <em>by value</em> (<code>Option&lt;Box&lt;Node&gt;&gt;</code>, not a reference), so you own the entire list and are allowed to take it apart. The loop is <code>while let Some(mut node) = head</code>, which moves the first node out of <code>head</code> into <code>node</code> (<code>mut</code> because you are about to change its <code>next</code>). Inside: <code>head = node.next.take()</code> puts the rest back in <code>head</code> and leaves <code>None</code> in the node, so the node is now alone. Then <code>node.next = prev</code> points it at the reversed part, and <code>prev = Some(node)</code> makes it the new front. Because <code>head</code> was moved from and then assigned again before the next turn, the compiler accepts reusing it; declare the parameter <code>mut head</code> to allow that.</p>`,
      `<p>At every moment each node has exactly one owner: the rest, or the node in your hand, or <code>prev</code>. The compiler has proved nothing is lost or linked twice.</p>`,
    ],
    examples: [
      {
        code: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

// Consumes a list and returns its values in order. Same loop shape as reverse.
fn into_vec(mut head: Option<Box<Node>>) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(mut node) = head {     // move the first node out of head into node
        head = node.next.take();          // the rest goes back into head; node is alone now
        out.push(node.val);               // use the node; it is freed at the end of this turn
    }
    out
}

fn main() {
    let list = Some(Box::new(Node { val: 1, next: Some(Box::new(Node { val: 2, next: None })) }));
    println!("{:?}", into_vec(list));
}`,
        output: '[1, 2]',
        caption: 'The loop shape reverse uses, doing a simpler job: consume the list one node at a time.',
      },
    ],
    terms: [
      { code: 'fn reverse(mut head: Option<Box<Node>>)', meaning: 'takes the whole list by value; mut lets the loop reassign head' },
      { code: 'while let Some(mut node) = head', meaning: 'moves the first node out of head into a mutable variable' },
      { code: 'node.next.take()', meaning: 'detaches the rest of the list, leaving None in the node' },
    ],
  },
  task: `Write <code>reverse</code>: take a list, relink its nodes in the opposite order and return the new head. Do it by moving nodes with <code>take()</code>; do not copy values into a new list.`,
  refresher: [
    `<code>reverse</code> takes the head <em>by value</em>, so you own the whole list and may break it apart.`,
    `<code>node.next.take()</code> detaches the rest of the list and leaves <code>None</code> in <code>node.next</code>, so you are never holding two owners of the same tail.`,
  ],
  hints: [
    `Keep a <code>prev</code> (starts as <code>None</code>) and walk with <code>while let Some(mut node) = head</code>.`,
    `Inside the loop: set <code>head = node.next.take()</code>, then <code>node.next = prev</code>, then <code>prev = Some(node)</code>.`,
    `When the loop ends, <code>prev</code> holds the old last node: that is the new head.`,
  ],
  inCpp: {
    code: `struct Node { int val; Node* next; };
Node* reverse(Node* head) {
    Node* prev = nullptr;
    while (head) {
        Node* next = head->next;   // save the rest
        head->next = prev;
        prev = head;
        head = next;
    }
    return prev;
}`,
    note: `The C++ code saves <code>next</code> in a second pointer. In Rust two owners of the tail cannot exist, so <code>take()</code> moves the link out of the node, which does the saving and the unlinking in one step.`,
  },
  starter: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

fn reverse(head: Option<Box<Node>>) -> Option<Box<Node>> {
    head
}`,
  solution: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

fn reverse(mut head: Option<Box<Node>>) -> Option<Box<Node>> {
    let mut prev = None;
    while let Some(mut node) = head {
        head = node.next.take();
        node.next = prev;
        prev = Some(node);
    }
    prev
}`,
  harness: `fn harness_build(v: &[i32]) -> Option<Box<Node>> {
    let mut head = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(Node { val: x, next: head }));
    }
    head
}

fn harness_to_vec(head: &Option<Box<Node>>) -> Vec<i32> {
    let mut out = Vec::new();
    let mut cur = head;
    while let Some(node) = cur {
        out.push(node.val);
        cur = &node.next;
    }
    out
}

fn main() {
    let cases: Vec<Vec<i32>> = vec![vec![1, 2, 3, 4], vec![], vec![5], vec![1, 2], vec![1, 1, 2, 1]];
    for (i, c) in cases.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        let r = reverse(harness_build(c));
        println!("{:?}", harness_to_vec(&r));
    }

    println!("\\n@@TEST 6@@");
    let v: Vec<i32> = (0..2000).collect();
    let r = reverse(harness_build(&v));
    let expected: Vec<i32> = (0..2000).rev().collect();
    println!("{}", if harness_to_vec(&r) == expected { "reversed" } else { "wrong" });
}`,
  require: [{ pattern: '\\.take\\(\\)', message: 'Move the links with take().' }],
  tests: [
    { name: 'Four items', input: '1 2 3 4', expected: '[4, 3, 2, 1]' },
    { name: 'Empty list', input: '(empty)', expected: '[]' },
    { name: 'One item', input: '5', expected: '[5]' },
    { name: 'Two items', input: '1 2', expected: '[2, 1]' },
    { name: 'Duplicates', input: '1 1 2 1', expected: '[1, 2, 1, 1]' },
    { name: 'Long list', input: '2 000 items', expected: 'reversed' },
  ],
}

const BST_NODE = `struct Node {
    key: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}
`

const bstRead = {
  id: 'r5-bst-read',
  title: 'Walk a binary search tree',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>A <em>binary search tree</em> (BST) keeps keys in a tree where every node has up to two children, and the rule is: everything in the <em>left</em> subtree is smaller than the node's key, everything in the <em>right</em> subtree is bigger. For the tree below, the root is 5; 3 and 1 and 4 are on its left, 8 on its right. The rule makes searching quick: at each node compare and go one way, throwing half of what is left away. An empty spot means the key is not there.</p>`,
      `<p>In Rust a node owns its children the way a list node owns its next: <code>struct Node { key: i32, left: Option&lt;Box&lt;Node&gt;&gt;, right: Option&lt;Box&lt;Node&gt;&gt; }</code>. <code>None</code> is "no child", and the tree is owned from the root down. This lesson is read-only: you walk the tree and change nothing, so every reference is a plain <code>&amp;</code> and the borrow checker stays out of your way. (To keep tests simple, the harness builds the trees; you write <code>contains</code> and <code>in_order</code>. The next lesson is <code>insert</code>.)</p>`,
      `<p>There are two shapes for walking. A <em>loop</em> with a moving reference: start with <code>let mut cur = &amp;self.root;</code>, <code>while let Some(n) = cur</code>, then set <code>cur</code> to <code>&amp;n.left</code> or <code>&amp;n.right</code>. The reference moves down the tree; no node is moved or copied. And <em>recursion</em>: a function that takes <code>&amp;Option&lt;Box&lt;Node&gt;&gt;</code> and calls itself on <code>&amp;n.left</code> and <code>&amp;n.right</code>. When you <code>match</code> on a reference, the names you bind are references too, so <code>n</code> is a <code>&amp;Box&lt;Node&gt;</code>, and <code>n.key</code> works directly because field access sees through both the reference and the <code>Box</code>.</p>`,
      `<p><code>in_order</code> returns the keys in ascending order. The trick: for any node, everything on the left is smaller and everything on the right is bigger, so visit the left subtree, then the node, then the right subtree. For the tree in the first example that gives <code>1, 3, 4, 5, 8</code>. A recursive helper that pushes into a <code>&amp;mut Vec&lt;i32&gt;</code> parameter is the natural way: the Vec is the one thing that changes, and it is passed down by exclusive reference.</p>`,
    ],
    examples: [
      {
        code: `struct Node {
    key: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn leaf(key: i32) -> Option<Box<Node>> {
    Some(Box::new(Node { key, left: None, right: None }))
}

// Recursion: add up every key.
fn sum(node: &Option<Box<Node>>) -> i32 {
    match node {
        None => 0,                                  // an empty spot adds nothing
        Some(n) => n.key + sum(&n.left) + sum(&n.right),
    }
}

fn main() {
    //        5
    //       / \\
    //      3   8
    //     / \\
    //    1   4
    let tree = Some(Box::new(Node {
        key: 5,
        left: Some(Box::new(Node { key: 3, left: leaf(1), right: leaf(4) })),
        right: leaf(8),
    }));
    println!("{}", sum(&tree));
}`,
        output: '21',
        caption: 'A tree, and a recursive walk over it.',
      },
      {
        code: `struct Node {
    key: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn main() {
    let tree = Some(Box::new(Node {
        key: 5,
        left: None,
        right: Some(Box::new(Node { key: 8, left: None, right: None })),
    }));

    // Loop: the biggest key is found by going right until there is no right child.
    let mut cur = &tree;                 // a reference to a link; the tree is not moved
    let mut biggest = None;
    while let Some(n) = cur {            // n: &Box<Node>
        biggest = Some(n.key);
        cur = &n.right;                  // step down to the right child's link
    }
    println!("{:?}", biggest);
}`,
        output: 'Some(8)',
        caption: 'A loop with a moving reference.',
      },
    ],
    terms: [
      { code: 'left < key < right', meaning: 'the BST rule: smaller keys on the left, bigger on the right' },
      { code: 'let mut cur = &self.root;', meaning: 'a reference that walks down the tree without moving any node' },
      { code: 'fn walk(node: &Option<Box<Node>>, out: &mut Vec<i32>)', meaning: 'a recursive helper: read the tree, write into a Vec' },
    ],
  },
  task: `Finish <code>contains</code> and <code>in_order</code> for <code>Bst</code> over <code>Option&lt;Box&lt;Node&gt;&gt;</code>. <code>in_order</code> returns the keys ascending. Do not use any standard tree or set.`,
  refresher: [
    `Smaller keys live in <code>left</code>, bigger in <code>right</code>; a missing child is <code>None</code>.`,
    `Matching on a reference gives references: <code>Some(n)</code> makes <code>n</code> a <code>&amp;Box&lt;Node&gt;</code>, and <code>n.key</code> works directly.`,
  ],
  hints: [
    `<code>contains</code>: start at <code>&amp;self.root</code>; at each node return <code>true</code> if equal, otherwise move to <code>&amp;n.left</code> or <code>&amp;n.right</code>; reaching <code>None</code> means <code>false</code>.`,
    `<code>in_order</code>: write a helper <code>fn collect(node: &amp;Option&lt;Box&lt;Node&gt;&gt;, out: &amp;mut Vec&lt;i32&gt;)</code> that does left, then <code>out.push(n.key)</code>, then right.`,
    `Stop the recursion at <code>None</code>. <code>in_order</code> creates the <code>Vec</code>, calls the helper once on the root and returns it.`,
  ],
  inCpp: {
    code: `struct Node { int key; Node* left; Node* right; };
bool contains(const Node* n, int key) {
    while (n) {
        if (key == n->key) return true;
        n = key < n->key ? n->left : n->right;
    }
    return false;
}`,
    note: `The C++ loop moves a pointer down the tree. The Rust loop moves a shared reference instead, and since the tree is only read, the borrow checker has nothing to complain about.`,
  },
  starter: BST_NODE + `
struct Bst {
    root: Option<Box<Node>>,
}

impl Bst {
    fn new() -> Self {
        Bst { root: None }
    }
    fn contains(&self, key: i32) -> bool {
        false
    }
    fn in_order(&self) -> Vec<i32> {
        Vec::new()
    }
}`,
  solution: BST_NODE + `
struct Bst {
    root: Option<Box<Node>>,
}

fn collect(node: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(n) = node {
        collect(&n.left, out);
        out.push(n.key);
        collect(&n.right, out);
    }
}

impl Bst {
    fn new() -> Self {
        Bst { root: None }
    }
    fn contains(&self, key: i32) -> bool {
        let mut cur = &self.root;
        while let Some(n) = cur {
            if key == n.key {
                return true;
            }
            cur = if key < n.key { &n.left } else { &n.right };
        }
        false
    }
    fn in_order(&self) -> Vec<i32> {
        let mut out = Vec::new();
        collect(&self.root, &mut out);
        out
    }
}`,
  harness: LCG + `
fn harness_insert(node: &mut Option<Box<Node>>, key: i32) -> bool {
    match node {
        None => {
            *node = Some(Box::new(Node { key, left: None, right: None }));
            true
        }
        Some(n) => {
            if key < n.key {
                harness_insert(&mut n.left, key)
            } else if key > n.key {
                harness_insert(&mut n.right, key)
            } else {
                false
            }
        }
    }
}

fn harness_tree(keys: &[i32]) -> Bst {
    let mut t = Bst::new();
    for &k in keys {
        harness_insert(&mut t.root, k);
    }
    t
}

fn main() {
    println!("\\n@@TEST 1@@");
    let t = harness_tree(&[5, 3, 8, 1, 4]);
    println!("{:?}", t.in_order());
    println!("{} {}", t.contains(4), t.contains(7));

    println!("\\n@@TEST 2@@");
    let t = Bst::new();
    println!("{:?} {}", t.in_order(), t.contains(1));

    println!("\\n@@TEST 3@@");
    let t = harness_tree(&[6]);
    println!("{:?} {} {}", t.in_order(), t.contains(6), t.contains(7));

    println!("\\n@@TEST 4@@");
    let t = harness_tree(&[5, 4, 3, 2, 1]);
    println!("{:?} {} {}", t.in_order(), t.contains(1), t.contains(0));

    println!("\\n@@TEST 5@@");
    let keys: Vec<i32> = (1..=500).collect();
    let t = harness_tree(&keys);
    println!("{}", if t.in_order() == keys && t.contains(500) && !t.contains(501) { "ok" } else { "wrong" });

    println!("\\n@@TEST 6@@");
    let mut state = 8u64;
    let mut reference = std::collections::BTreeSet::new();
    let mut keys = Vec::new();
    for _ in 0..3000 {
        let k = (harness_next(&mut state) % 5000) as i32;
        keys.push(k);
        reference.insert(k);
    }
    let t = harness_tree(&keys);
    let mut ok = t.in_order() == reference.iter().copied().collect::<Vec<_>>();
    for k in 0..5000 {
        ok &= t.contains(k) == reference.contains(&k);
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  forbidden: [{ pattern: '\\b(BTreeSet|BTreeMap)\\b', message: 'Build the tree yourself: BTreeSet and BTreeMap are off the table here.' }],
  tests: [
    { name: 'Five keys', input: 'tree of 5 3 8 1 4', expected: '[1, 3, 4, 5, 8]\ntrue false' },
    { name: 'Empty tree', input: '(empty)', expected: '[] false' },
    { name: 'One key', input: 'tree of 6', expected: '[6] true false' },
    { name: 'Left chain', input: '5 4 3 2 1', expected: '[1, 2, 3, 4, 5] true false' },
    { name: 'Right chain', input: '1 to 500', expected: 'ok' },
    { name: 'Random keys', input: '3 000 keys vs BTreeSet', expected: 'matches reference' },
  ],
}

const bstBasic = {
  id: 'r5-bst',
  title: 'Insert into a BST',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Insert follows the same walk as search, with one difference: when you fall off the tree at an empty spot, you put the new node <em>there</em>. In C++ you write <code>bool insert(Node*&amp; node, int key)</code> with a <em>reference to a pointer</em>, so that <code>node = new Node{key}</code> changes the parent's pointer. The empty spot is a place you can write into, not just a value you can read.</p>`,
      `<p>Rust has the same idea with a mutable reference to the <em>slot</em>: <code>&amp;mut Option&lt;Box&lt;Node&gt;&gt;</code>. The slot is the <code>Option</code> itself, which is either <code>None</code> (empty) or <code>Some(box)</code> (a node). Through that reference you can write a new value over it with <code>*slot = Some(...)</code> (the <code>*</code> means "write through the reference"). The first example shows the idea on plain numbers, and the second on a tree field: <code>&amp;mut root.left</code> is a reference to the left slot.</p>`,
      `<p>The helper is recursive: <code>fn insert_node(node: &amp;mut Option&lt;Box&lt;Node&gt;&gt;, key: i32) -&gt; bool</code>, and it matches on the slot. <code>None =&gt; { *node = Some(Box::new(Node { key, left: None, right: None })); true }</code> fills the empty spot. <code>Some(n) =&gt; ...</code> compares <code>key</code> with <code>n.key</code>: smaller means <code>insert_node(&amp;mut n.left, key)</code>, bigger means <code>insert_node(&amp;mut n.right, key)</code>, equal means a duplicate, so return <code>false</code> and change nothing. Because <code>node</code> is a <code>&amp;mut</code>, matching on it gives <code>n</code> as a <code>&amp;mut Box&lt;Node&gt;</code>, and <code>&amp;mut n.left</code> is a fresh mutable reference to the child slot. Only one such reference is live at a time as you go down, which is exactly what "one writer" allows.</p>`,
      `<p>Trace inserting 4 into the tree with root 5 (left child 3, no children below): the slot holding 5 is <code>Some</code>, 4 &lt; 5, go to 5's left slot. It holds 3, 4 &gt; 3, go to 3's right slot. It is <code>None</code>: write the new node there and return <code>true</code>. The recursion is as deep as the tree, so keys inserted in sorted order make a chain, which is slow but correct; keeping a tree balanced is a later topic. <code>contains</code> and <code>in_order</code> are provided from the last lesson.</p>`,
    ],
    examples: [
      {
        code: `fn fill_if_empty(slot: &mut Option<i32>, value: i32) {
    if slot.is_none() {
        *slot = Some(value);        // write THROUGH the reference into the caller's Option
    }
}

fn main() {
    let mut a: Option<i32> = None;
    let mut b: Option<i32> = Some(1);
    fill_if_empty(&mut a, 9);       // a was empty: now filled
    fill_if_empty(&mut b, 9);       // b was occupied: unchanged
    println!("{:?} {:?}", a, b);
}`,
        output: 'Some(9) Some(1)',
        caption: 'A reference to a slot lets a function fill it.',
      },
      {
        code: `struct Node {
    key: i32,
    left: Option<Box<Node>>,
}

fn main() {
    let mut root = Node { key: 5, left: None };
    let slot: &mut Option<Box<Node>> = &mut root.left;     // a reference to the left slot
    *slot = Some(Box::new(Node { key: 3, left: None }));   // fill it
    if let Some(child) = &root.left {
        println!("{} has left child {}", root.key, child.key);
    }
}`,
        output: '5 has left child 3',
        caption: 'A slot inside a node.',
      },
    ],
    terms: [
      { code: '&mut Option<Box<Node>>', meaning: 'a reference to a link (a slot) that you may overwrite' },
      { code: '*node = Some(...)', meaning: 'writes a new value through the reference into the slot' },
      { code: 'insert_node(&mut n.left, key)', meaning: 'recurses with a reference to the left child slot' },
    ],
  },
  task: `Write <code>insert_node</code> so that <code>Bst::insert</code> works: <code>false</code> for a duplicate key, otherwise add the key and return <code>true</code>. <code>contains</code> and <code>in_order</code> are given.`,
  refresher: [
    `<code>match node { None =&gt; ..., Some(n) =&gt; ... }</code> on a <code>&amp;mut Option&lt;Box&lt;Node&gt;&gt;</code> lets you either fill an empty slot with <code>*node = Some(...)</code> or recurse into <code>&amp;mut n.left</code>.`,
    `A recursive helper that takes the child slot is the usual shape; depth stays small for random keys.`,
  ],
  hints: [
    `<code>None</code> means "place the new node here": <code>*node = Some(Box::new(Node { key, left: None, right: None }));</code> then return <code>true</code>.`,
    `<code>Some(n)</code>: smaller keys recurse into <code>&amp;mut n.left</code>, larger into <code>&amp;mut n.right</code>, equal returns <code>false</code>.`,
    `Return the recursive call's result directly; only the <code>None</code> arm builds a node.`,
  ],
  inCpp: {
    code: `struct Node { int key; Node* left = nullptr; Node* right = nullptr; };
bool insert(Node*& node, int key) {
    if (!node) { node = new Node{key}; return true; }
    if (key < node->key) return insert(node->left, key);
    if (key > node->key) return insert(node->right, key);
    return false;
}`,
    note: `The C++ trick is a reference to a pointer (<code>Node*&amp;</code>) so you can assign into the empty slot. The Rust equivalent is <code>&amp;mut Option&lt;Box&lt;Node&gt;&gt;</code>, and the tree frees itself when dropped.`,
  },
  starter: BST_NODE + `
struct Bst {
    root: Option<Box<Node>>,
}

fn collect(node: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(n) = node {
        collect(&n.left, out);
        out.push(n.key);
        collect(&n.right, out);
    }
}

// Put key into the tree below this slot. Returns false if it was already there.
fn insert_node(node: &mut Option<Box<Node>>, key: i32) -> bool {
    false
}

impl Bst {
    fn new() -> Self {
        Bst { root: None }
    }
    fn insert(&mut self, key: i32) -> bool {
        insert_node(&mut self.root, key)
    }
    fn contains(&self, key: i32) -> bool {
        let mut cur = &self.root;
        while let Some(n) = cur {
            if key == n.key {
                return true;
            }
            cur = if key < n.key { &n.left } else { &n.right };
        }
        false
    }
    fn in_order(&self) -> Vec<i32> {
        let mut out = Vec::new();
        collect(&self.root, &mut out);
        out
    }
}`,
  solution: BST_NODE + `
struct Bst {
    root: Option<Box<Node>>,
}

fn collect(node: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(n) = node {
        collect(&n.left, out);
        out.push(n.key);
        collect(&n.right, out);
    }
}

// Put key into the tree below this slot. Returns false if it was already there.
fn insert_node(node: &mut Option<Box<Node>>, key: i32) -> bool {
    match node {
        None => {
            *node = Some(Box::new(Node { key, left: None, right: None }));
            true
        }
        Some(n) => {
            if key < n.key {
                insert_node(&mut n.left, key)
            } else if key > n.key {
                insert_node(&mut n.right, key)
            } else {
                false
            }
        }
    }
}

impl Bst {
    fn new() -> Self {
        Bst { root: None }
    }
    fn insert(&mut self, key: i32) -> bool {
        insert_node(&mut self.root, key)
    }
    fn contains(&self, key: i32) -> bool {
        let mut cur = &self.root;
        while let Some(n) = cur {
            if key == n.key {
                return true;
            }
            cur = if key < n.key { &n.left } else { &n.right };
        }
        false
    }
    fn in_order(&self) -> Vec<i32> {
        let mut out = Vec::new();
        collect(&self.root, &mut out);
        out
    }
}`,
  harness: LCG + `
fn main() {
    println!("\\n@@TEST 1@@");
    let mut t = Bst::new();
    for k in [5, 3, 8, 1, 4] {
        t.insert(k);
    }
    println!("{:?}", t.in_order());
    println!("{} {}", t.contains(4), t.contains(7));

    println!("\\n@@TEST 2@@");
    let t = Bst::new();
    println!("{:?} {}", t.in_order(), t.contains(1));

    println!("\\n@@TEST 3@@");
    let mut t = Bst::new();
    println!("{} {:?} {}", t.insert(6), t.in_order(), t.contains(6));

    println!("\\n@@TEST 4@@");
    let mut t = Bst::new();
    let r: Vec<bool> = [2, 1, 2, 3, 1].iter().map(|&k| t.insert(k)).collect();
    println!("{:?} {:?}", r, t.in_order());

    println!("\\n@@TEST 5@@");
    let mut t = Bst::new();
    for k in 1..=500 {
        t.insert(k);
    }
    let expected: Vec<i32> = (1..=500).collect();
    println!("{}", if t.in_order() == expected && t.contains(500) && !t.contains(501) { "ok" } else { "wrong" });

    println!("\\n@@TEST 6@@");
    let mut t = Bst::new();
    let mut reference = std::collections::BTreeSet::new();
    let mut state = 8u64;
    let mut ok = true;
    for _ in 0..3000 {
        let k = (harness_next(&mut state) % 5000) as i32;
        ok &= t.insert(k) == reference.insert(k);
    }
    ok &= t.in_order() == reference.iter().copied().collect::<Vec<_>>();
    for k in 0..5000 {
        ok &= t.contains(k) == reference.contains(&k);
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  forbidden: [{ pattern: '\\b(BTreeSet|BTreeMap)\\b', message: 'Build the tree yourself: BTreeSet and BTreeMap are off the table here.' }],
  tests: [
    { name: 'Five keys', input: 'insert 5 3 8 1 4', expected: '[1, 3, 4, 5, 8]\ntrue false' },
    { name: 'Empty tree', input: '(empty)', expected: '[] false' },
    { name: 'One key', input: 'insert 6', expected: 'true [6] true' },
    { name: 'Duplicates', input: 'insert 2 1 2 3 1', expected: '[true, true, false, true, false] [1, 2, 3]' },
    { name: 'Sorted input (a chain)', input: '1 to 500', expected: 'ok' },
    { name: 'Random keys', input: '3 000 keys vs BTreeSet', expected: 'matches reference' },
  ],
}

const fixMoveOut = {
  id: 'r5-fix-move-out-of-node',
  title: 'Moving a child out of a node',
  kind: 'fix',
  introduces: [],
  task: `The compiler rejects <code>splice_left</code>. It should replace the node by its left child when there is no right child. Fix it, keeping the assignment into <code>*node</code>.`,
  errorCode: 'E0507',
  gloss: `<code>n.left</code> is behind a mutable reference, so it cannot be moved out and left invalid. Take it with <code>take()</code>, which leaves <code>None</code> behind.`,
  refresher: [
    `You cannot move a field out from behind <code>&amp;mut</code> unless you leave something valid behind.`,
    `<code>opt.take()</code> moves the contents out of an <code>Option</code> and leaves <code>None</code>. Deleting from a tree uses this on children all the time.`,
  ],
  hints: [
    `The error is on <code>n.left</code>: it names the reference the value is behind.`,
    `You want the left child's contents and an empty slot left in <code>n.left</code>. Which <code>Option</code> method gives both?`,
  ],
  inCpp: {
    code: `struct Node { int key; Node* left; Node* right; };
void splice_left(Node*& node) {
    Node* old = node;
    node = node->left;      // copy the pointer
    old->left = nullptr;    // forget this and two owners will both delete the child
    delete old;
}`,
    note: `In C++ you null the old pointer by hand, or the node and its parent both own the child. Rust makes the leave-something-behind step part of the move.`,
  },
  starter: `struct Node {
    key: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

// If the node in this slot has no right child, replace it with its left child.
fn splice_left(node: &mut Option<Box<Node>>) {
    if let Some(n) = node {
        if n.right.is_none() {
            *node = n.left;
        }
    }
}`,
  solution: `struct Node {
    key: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

// If the node in this slot has no right child, replace it with its left child.
fn splice_left(node: &mut Option<Box<Node>>) {
    if let Some(n) = node {
        if n.right.is_none() {
            *node = n.left.take();
        }
    }
}`,
  harness: `fn harness_leaf(key: i32) -> Option<Box<Node>> {
    Some(Box::new(Node { key, left: None, right: None }))
}

fn harness_show(node: &Option<Box<Node>>) -> String {
    match node {
        None => "empty".to_string(),
        Some(n) => {
            let left = match &n.left {
                Some(l) => l.key.to_string(),
                None => "-".to_string(),
            };
            let right = match &n.right {
                Some(r) => r.key.to_string(),
                None => "-".to_string(),
            };
            format!("{} left={} right={}", n.key, left, right)
        }
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    let mut slot = Some(Box::new(Node { key: 5, left: harness_leaf(3), right: None }));
    splice_left(&mut slot);
    println!("{}", harness_show(&slot));

    println!("\\n@@TEST 2@@");
    let mut slot = Some(Box::new(Node { key: 5, left: harness_leaf(3), right: harness_leaf(8) }));
    splice_left(&mut slot);
    println!("{}", harness_show(&slot));

    println!("\\n@@TEST 3@@");
    let mut slot = harness_leaf(5);
    splice_left(&mut slot);
    println!("{}", harness_show(&slot));

    println!("\\n@@TEST 4@@");
    let mut slot: Option<Box<Node>> = None;
    splice_left(&mut slot);
    println!("{}", harness_show(&slot));

    println!("\\n@@TEST 5@@");
    let below = Some(Box::new(Node { key: 3, left: harness_leaf(1), right: harness_leaf(4) }));
    let mut slot = Some(Box::new(Node { key: 5, left: below, right: None }));
    splice_left(&mut slot);
    println!("{}", harness_show(&slot));
}`,
  require: [{ pattern: '\\*node\\s*=', message: 'Keep the assignment into *node.' }],
  tests: [
    { name: 'Only a left child', input: '5 with left 3', expected: '3 left=- right=-' },
    { name: 'Both children: unchanged', input: '5 with 3 and 8', expected: '5 left=3 right=8' },
    { name: 'No children: becomes empty', input: '5 alone', expected: 'empty' },
    { name: 'Empty slot', input: '(empty)', expected: 'empty' },
    { name: 'Child keeps its subtree', input: '5, left 3 with 1 and 4', expected: '3 left=1 right=4' },
  ],
}

const popMin = {
  id: 'r5-bst-pop-min',
  title: 'Remove the smallest key',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Deleting from a BST has a hard case, and it needs one helper that you can learn on its own: <em>remove the smallest key of a subtree</em>. The smallest key is the leftmost node: keep going left until a node has no left child. That node has at most a right child, and it is easy to remove: whatever is in its right slot (a subtree or <code>None</code>) takes the removed node's place. Example: removing 3 here moves 4 up.</p>`,
      `<p>As a recursive function on a slot, <code>fn pop_min(node: &amp;mut Option&lt;Box&lt;Node&gt;&gt;) -&gt; Option&lt;i32&gt;</code> has three cases. The slot is <code>None</code>: the subtree is empty, return <code>None</code>. The slot has a node with a left child: the minimum is further down, so recurse into <code>&amp;mut n.left</code>. Otherwise this node is the minimum: <code>node.take()</code> detaches it (the slot becomes <code>None</code> and you own the box), <code>*node = n.right</code> moves its right subtree into the empty slot, and you return <code>Some(n.key)</code>. Dropping the box frees the removed node.</p>`,
      `<p>Read the borrow shape carefully, because the delete lesson builds on it. In <code>match node { ... }</code> the arm <code>Some(n) if n.left.is_some()</code> borrows the node through <code>n</code> while it recurses. The last arm is written <code>Some(_)</code>: with <code>_</code> it binds nothing, so nothing is borrowed, and the arm is free to call <code>node.take()</code> on the whole slot. If the last arm named the node (<code>Some(n)</code>) and also used <code>node</code>, the compiler would object that the slot is borrowed twice. The rule from stage 2 still holds: a borrow lasts only until its last use, and it is not allowed to overlap a use of the slot itself. And <code>node.take()?</code> uses the <code>?</code> from the hash map lesson: it cannot really be <code>None</code> here, but the <code>?</code> avoids an <code>unwrap</code>.</p>`,
    ],
    examples: [
      {
        code: `struct Node {
    key: i32,
    right: Option<Box<Node>>,
}

fn main() {
    // The slot holds node 3, which has a right child 4:   slot -> [3] -> [4]
    let mut slot = Some(Box::new(Node { key: 3, right: Some(Box::new(Node { key: 4, right: None })) }));

    let n = slot.take().unwrap();    // slot is None; we own node 3 (a Box<Node>)
    slot = n.right;                  // move node 3's right child into the slot: slot -> [4]
    println!("removed {}, the slot now holds {}", n.key, slot.as_ref().unwrap().key);
}`,
        output: 'removed 3, the slot now holds 4',
        caption: 'Detach a node, then plug its child into the slot it left.',
      },
    ],
    terms: [
      { code: 'Some(n) if n.left.is_some() => ...', meaning: 'a match arm with a guard: only taken when the condition holds' },
      { code: 'Some(_) => ...', meaning: 'matches a node without binding it, so nothing stays borrowed' },
      { code: '*node = n.right;', meaning: 'overwrite the slot with the removed node\'s right subtree' },
    ],
  },
  task: `Write <code>pop_min(node)</code>: remove the node with the smallest key from the subtree in this slot and return its key, or <code>None</code> if the subtree is empty. Keep the rest of the tree intact.`,
  refresher: [
    `The smallest key is the leftmost node. It has no left child, so its right subtree can take its place.`,
    `<code>node.take()</code> empties the slot and gives you the node; <code>*node = n.right</code> then fills the slot with the node's right child.`,
  ],
  hints: [
    `Three cases: an empty slot returns <code>None</code>; a node with a left child recurses into <code>&amp;mut n.left</code>; a node with no left child is the minimum.`,
    `For the minimum: <code>let n = node.take()?;</code> then <code>*node = n.right;</code> then <code>Some(n.key)</code>.`,
    `Write the last arm as <code>Some(_)</code> so no borrow of the node is alive when you call <code>node.take()</code>.`,
  ],
  inCpp: {
    code: `struct Node { int key; Node* left; Node* right; };
int pop_min(Node*& node) {
    if (node->left) return pop_min(node->left);
    Node* old = node;
    int key = old->key;
    node = old->right;     // splice the right subtree in
    delete old;
    return key;
}`,
    note: `C++ reads the key and the child before the <code>delete</code>, in the right order, by hand. In Rust <code>take()</code> hands you ownership, and the node is freed when the box goes out of scope, so there is no way to use it after.`,
  },
  starter: BST_NODE + `
// Remove the smallest node of the subtree in this slot and return its key.
fn pop_min(node: &mut Option<Box<Node>>) -> Option<i32> {
    None
}`,
  solution: BST_NODE + `
// Remove the smallest node of the subtree in this slot and return its key.
fn pop_min(node: &mut Option<Box<Node>>) -> Option<i32> {
    match node {
        None => None,
        Some(n) if n.left.is_some() => pop_min(&mut n.left),
        Some(_) => {
            let n = node.take()?;
            *node = n.right;
            Some(n.key)
        }
    }
}`,
  harness: LCG + `
fn harness_insert(node: &mut Option<Box<Node>>, key: i32) -> bool {
    match node {
        None => {
            *node = Some(Box::new(Node { key, left: None, right: None }));
            true
        }
        Some(n) => {
            if key < n.key {
                harness_insert(&mut n.left, key)
            } else if key > n.key {
                harness_insert(&mut n.right, key)
            } else {
                false
            }
        }
    }
}

fn harness_tree(keys: &[i32]) -> Option<Box<Node>> {
    let mut root = None;
    for &k in keys {
        harness_insert(&mut root, k);
    }
    root
}

fn harness_collect(node: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(n) = node {
        harness_collect(&n.left, out);
        out.push(n.key);
        harness_collect(&n.right, out);
    }
}

fn harness_keys(root: &Option<Box<Node>>) -> Vec<i32> {
    let mut out = Vec::new();
    harness_collect(root, &mut out);
    out
}

fn main() {
    println!("\\n@@TEST 1@@");
    let mut t = harness_tree(&[5, 3, 8, 1, 4]);
    println!("{:?} {:?}", pop_min(&mut t), harness_keys(&t));

    println!("\\n@@TEST 2@@");
    let mut t = harness_tree(&[5, 3, 8, 4]);
    println!("{:?} {:?}", pop_min(&mut t), harness_keys(&t));

    println!("\\n@@TEST 3@@");
    let mut t: Option<Box<Node>> = None;
    println!("{:?} {:?}", pop_min(&mut t), harness_keys(&t));

    println!("\\n@@TEST 4@@");
    let mut t = harness_tree(&[7]);
    println!("{:?} {:?} {}", pop_min(&mut t), harness_keys(&t), t.is_none());

    println!("\\n@@TEST 5@@");
    let mut t = harness_tree(&[1, 2, 3]);
    println!("{:?} {:?}", pop_min(&mut t), harness_keys(&t));

    println!("\\n@@TEST 6@@");
    let keys = [50, 30, 70, 20, 40, 60, 80, 35, 45, 65];
    let mut t = harness_tree(&keys);
    let mut got = Vec::new();
    while let Some(k) = pop_min(&mut t) {
        got.push(k);
    }
    let mut sorted = keys.to_vec();
    sorted.sort();
    println!("{}", if got == sorted && t.is_none() { "ok" } else { "wrong" });

    println!("\\n@@TEST 7@@");
    let mut state = 61u64;
    let mut keys = Vec::new();
    for _ in 0..1500 {
        keys.push((harness_next(&mut state) % 3000) as i32);
    }
    let mut t = harness_tree(&keys);
    let mut reference = keys.clone();
    reference.sort();
    reference.dedup();
    let mut ok = true;
    for (i, want) in reference.iter().enumerate() {
        ok &= pop_min(&mut t) == Some(*want);
        if i % 200 == 0 {
            ok &= harness_keys(&t) == reference[i + 1..].to_vec();
        }
    }
    ok &= pop_min(&mut t).is_none();
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  tests: [
    { name: 'Leaf is the minimum', input: '5 3 8 1 4', expected: 'Some(1) [3, 4, 5, 8]' },
    { name: 'Minimum with a right child', input: '5 3 8 4', expected: 'Some(3) [4, 5, 8]' },
    { name: 'Empty tree', input: '(empty)', expected: 'None []' },
    { name: 'Only node', input: '7', expected: 'Some(7) [] true' },
    { name: 'Minimum is the root', input: '1 2 3', expected: 'Some(1) [2, 3]' },
    { name: 'Drain a tree', input: '10 keys', expected: 'ok' },
    { name: 'Random trees', input: '1 500 keys', expected: 'matches reference' },
  ],
}

const bstDelete = {
  id: 'r5-bst-delete',
  title: 'Delete from a BST',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Deleting a key from a BST is the hardest lesson in this stage, so it is split into steps. Once the key is found, the node sits in a <em>slot</em> (the <code>&amp;mut Option&lt;Box&lt;Node&gt;&gt;</code> you recursed into), and deleting means deciding what that slot holds afterwards. There are three cases. A <strong>leaf</strong> (no children): the slot becomes <code>None</code>. A node with <strong>one child</strong>: the slot gets that child, which moves up and brings its whole subtree. A node with <strong>two children</strong>: two subtrees cannot fit in one slot, so keep the node and change its key to its <em>successor</em>, the smallest key of its right subtree (the next key in sorted order), and then remove that successor node from the right subtree. </p>`,
      `<p>Removing the minimum of a subtree is exactly the <code>pop_min</code> you just wrote, so the two-children case is one line: <code>n.key = pop_min(&amp;mut n.right).unwrap()</code> (the right subtree exists, so the <code>Option</code> is <code>Some</code>). Why is this correct? The successor is bigger than everything on the left and smaller than everything else on the right, so it can take the deleted key's place without breaking the BST rule.</p>`,
      `<p>Now the borrow shape. Searching down is the insert recursion again: <code>match node { None =&gt; false, Some(n) if key &lt; n.key =&gt; remove_node(&amp;mut n.left, key), Some(n) if key &gt; n.key =&gt; remove_node(&amp;mut n.right, key), Some(n) =&gt; { found it } }</code>. In the last arm the key matches, and you need to <em>own</em> the children to decide. The previous lesson's fix showed why you cannot write <code>*node = n.left</code> (moving out from behind a reference). The answer is <code>take()</code>: <code>(n.left.take(), n.right.take())</code> moves both children out in one go and leaves the node temporarily childless. You then <code>match</code> on that pair of <code>Option</code>s. Matching on a tuple <code>match (a, b) { ... }</code> checks both values together with patterns like <code>(None, None)</code> and <code>(Some(l), None)</code>. There are four combinations, the compiler checks all four are covered, and that is the three cases above (one child splits into left-only and right-only).</p>`,
      `<p>In each arm you set the slot: <code>(None, None) =&gt; *node = None</code>, <code>(Some(l), None) =&gt; *node = Some(l)</code>, <code>(None, Some(r)) =&gt; *node = Some(r)</code>. Assigning to <code>*node</code> replaces the old <code>Option</code>, which drops the old <code>Box&lt;Node&gt;</code>: that frees the deleted node (the <code>delete</code> you would write in C++). In the two-children arm you took both children out only to look, so put them back first (<code>n.left = Some(l); n.right = Some(r);</code>) and then change the key. Why is it allowed to assign to <code>*node</code> while <code>n</code> exists? A borrow lasts only until its last use. In the three splice arms <code>n</code> is not used again, so the slot is free to be overwritten. In the two-children arm you keep using <code>n</code> and never assign to <code>*node</code>. Each arm respects the rule, and that is why the code compiles.</p>`,
      `<p>Finish by returning <code>true</code> after the inner <code>match</code>, because the key was found. A missing key reaches <code>None</code> and returns <code>false</code>. You can check your understanding with a trace. Delete 5 from the tree with 3 and 8 below it and 7 and 9 below 8: root has two children, the successor is the smallest key on the right, 7, so the root's key becomes 7 and the node 7 is removed from the right side, where it was a leaf: <code>None</code> takes its slot. In order: 3, 7, 8, 9.</p>`,
    ],
    examples: [
      {
        code: `fn describe(left: Option<i32>, right: Option<i32>) {
    // match on a pair: both values are checked together, and all 4 cases must be covered
    match (left, right) {
        (None, None) => println!("leaf: the slot becomes empty"),
        (Some(l), None) => println!("only a left child {}: it takes the slot", l),
        (None, Some(r)) => println!("only a right child {}: it takes the slot", r),
        (Some(l), Some(r)) => println!("children {} and {}: replace the key with the successor", l, r),
    }
}

fn main() {
    describe(None, None);
    describe(Some(1), None);
    describe(None, Some(2));
    describe(Some(3), Some(4));
}`,
        output: 'leaf: the slot becomes empty\nonly a left child 1: it takes the slot\nonly a right child 2: it takes the slot\nchildren 3 and 4: replace the key with the successor',
        caption: 'Matching on a pair of Options.',
      },
      {
        code: `struct Node {
    key: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

fn leaf(key: i32) -> Option<Box<Node>> {
    Some(Box::new(Node { key, left: None, right: None }))
}

fn main() {
    let mut n = Node { key: 5, left: leaf(3), right: leaf(8) };
    let (l, r) = (n.left.take(), n.right.take());     // both children moved out in one go
    println!("{} {}", n.left.is_none(), n.right.is_none());   // the node is childless now
    n.left = l;                                        // put them back
    n.right = r;
    println!("{} {}", n.left.is_some(), n.right.is_some());
}`,
        output: 'true true\ntrue true',
        caption: 'Taking both children out, and putting them back.',
      },
    ],
    terms: [
      { code: 'match (a, b) { (None, None) => ... }', meaning: 'match on a pair; each arm names a combination of both' },
      { code: '(n.left.take(), n.right.take())', meaning: 'moves both children out of the node at once' },
      { code: '*node = Some(l)', meaning: 'replaces the slot; the old node box is dropped (freed)' },
      { code: 'n.key = pop_min(&mut n.right).unwrap()', meaning: 'two children: take the successor key from the right subtree' },
    ],
  },
  task: `Write <code>remove_node</code>: delete a key and return <code>true</code>, or return <code>false</code> if it is absent. Handle a leaf, a node with one child and a node with two children. <code>pop_min</code> and the rest are given.`,
  refresher: [
    `<code>node.take()</code> on a <code>&amp;mut Option&lt;Box&lt;Node&gt;&gt;</code> removes the node and leaves <code>None</code>; assigning <code>*node = child</code> splices a child into its place.`,
    `With two children, copy the smallest key of the right subtree into the node, then remove that smallest node from the right subtree (<code>pop_min</code>).`,
  ],
  hints: [
    `Recurse down like insert: <code>None</code> is <code>false</code>; <code>Some(n)</code> with a smaller or larger key recurses into <code>&amp;mut n.left</code> or <code>&amp;mut n.right</code>; an equal key is the found case.`,
    `Found: <code>match (n.left.take(), n.right.take())</code>. Leaf: <code>*node = None</code>. One child <code>c</code>: <code>*node = Some(c)</code>. Both are taken out, so the node is childless until you decide.`,
    `Two children <code>l</code> and <code>r</code>: put them back (<code>n.left = Some(l)</code>, <code>n.right = Some(r)</code>), then <code>n.key = pop_min(&amp;mut n.right).unwrap()</code>. End with <code>true</code>.`,
  ],
  inCpp: {
    code: `struct Node { int key; Node* left; Node* right; };
Node* remove(Node* node, int key) {
    if (!node) return nullptr;
    if (key < node->key) node->left = remove(node->left, key);
    else if (key > node->key) node->right = remove(node->right, key);
    else {
        if (!node->left) { Node* r = node->right; delete node; return r; }
        if (!node->right) { Node* l = node->left; delete node; return l; }
        Node* m = node->right;
        while (m->left) m = m->left;
        node->key = m->key;
        node->right = remove(node->right, m->key);
    }
    return node;
}`,
    note: `C++ must call <code>delete</code> at exactly the right moment and read a child pointer before freeing the node. In Rust, replacing the <code>Option</code> drops the old node, and matching on the pair of children names the cases directly.`,
  },
  starter: BST_NODE + `
struct Bst {
    root: Option<Box<Node>>,
}

fn insert_node(node: &mut Option<Box<Node>>, key: i32) -> bool {
    match node {
        None => {
            *node = Some(Box::new(Node { key, left: None, right: None }));
            true
        }
        Some(n) => {
            if key < n.key {
                insert_node(&mut n.left, key)
            } else if key > n.key {
                insert_node(&mut n.right, key)
            } else {
                false
            }
        }
    }
}

fn collect(node: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(n) = node {
        collect(&n.left, out);
        out.push(n.key);
        collect(&n.right, out);
    }
}

// Removes the smallest node of a subtree and returns its key (None if the subtree is empty).
fn pop_min(node: &mut Option<Box<Node>>) -> Option<i32> {
    match node {
        None => None,
        Some(n) if n.left.is_some() => pop_min(&mut n.left),
        Some(_) => {
            let n = node.take()?;
            *node = n.right;
            Some(n.key)
        }
    }
}

// Delete key from the subtree in this slot. Returns true if it was present.
fn remove_node(node: &mut Option<Box<Node>>, key: i32) -> bool {
    false
}

impl Bst {
    fn new() -> Self {
        Bst { root: None }
    }
    fn insert(&mut self, key: i32) -> bool {
        insert_node(&mut self.root, key)
    }
    fn contains(&self, key: i32) -> bool {
        let mut cur = &self.root;
        while let Some(n) = cur {
            if key == n.key {
                return true;
            }
            cur = if key < n.key { &n.left } else { &n.right };
        }
        false
    }
    fn in_order(&self) -> Vec<i32> {
        let mut out = Vec::new();
        collect(&self.root, &mut out);
        out
    }
    fn remove(&mut self, key: i32) -> bool {
        remove_node(&mut self.root, key)
    }
}`,
  solution: BST_NODE + `
struct Bst {
    root: Option<Box<Node>>,
}

fn insert_node(node: &mut Option<Box<Node>>, key: i32) -> bool {
    match node {
        None => {
            *node = Some(Box::new(Node { key, left: None, right: None }));
            true
        }
        Some(n) => {
            if key < n.key {
                insert_node(&mut n.left, key)
            } else if key > n.key {
                insert_node(&mut n.right, key)
            } else {
                false
            }
        }
    }
}

fn collect(node: &Option<Box<Node>>, out: &mut Vec<i32>) {
    if let Some(n) = node {
        collect(&n.left, out);
        out.push(n.key);
        collect(&n.right, out);
    }
}

// Removes the smallest node of a subtree and returns its key (None if the subtree is empty).
fn pop_min(node: &mut Option<Box<Node>>) -> Option<i32> {
    match node {
        None => None,
        Some(n) if n.left.is_some() => pop_min(&mut n.left),
        Some(_) => {
            let n = node.take()?;
            *node = n.right;
            Some(n.key)
        }
    }
}

// Delete key from the subtree in this slot. Returns true if it was present.
fn remove_node(node: &mut Option<Box<Node>>, key: i32) -> bool {
    match node {
        None => false,
        Some(n) if key < n.key => remove_node(&mut n.left, key),
        Some(n) if key > n.key => remove_node(&mut n.right, key),
        Some(n) => {
            match (n.left.take(), n.right.take()) {
                (None, None) => *node = None,
                (Some(l), None) => *node = Some(l),
                (None, Some(r)) => *node = Some(r),
                (Some(l), Some(r)) => {
                    n.left = Some(l);
                    n.right = Some(r);
                    n.key = pop_min(&mut n.right).unwrap();
                }
            }
            true
        }
    }
}

impl Bst {
    fn new() -> Self {
        Bst { root: None }
    }
    fn insert(&mut self, key: i32) -> bool {
        insert_node(&mut self.root, key)
    }
    fn contains(&self, key: i32) -> bool {
        let mut cur = &self.root;
        while let Some(n) = cur {
            if key == n.key {
                return true;
            }
            cur = if key < n.key { &n.left } else { &n.right };
        }
        false
    }
    fn in_order(&self) -> Vec<i32> {
        let mut out = Vec::new();
        collect(&self.root, &mut out);
        out
    }
    fn remove(&mut self, key: i32) -> bool {
        remove_node(&mut self.root, key)
    }
}`,
  harness: LCG + `
fn harness_tree(keys: &[i32]) -> Bst {
    let mut t = Bst::new();
    for &k in keys {
        t.insert(k);
    }
    t
}

fn harness_show(t: &Bst) -> String {
    t.in_order().iter().map(|x| x.to_string()).collect::<Vec<_>>().join(" ")
}

fn main() {
    println!("\\n@@TEST 1@@");
    let mut t = harness_tree(&[5, 3, 8, 1, 4]);
    println!("{} {}", t.remove(1), harness_show(&t));

    println!("\\n@@TEST 2@@");
    let mut t = harness_tree(&[5, 3, 8, 4]);
    println!("{} {}", t.remove(3), harness_show(&t));

    println!("\\n@@TEST 3@@");
    let mut t = harness_tree(&[5, 3, 8, 1]);
    println!("{} {}", t.remove(3), harness_show(&t));

    println!("\\n@@TEST 4@@");
    let mut t = harness_tree(&[5, 3, 8, 1, 4, 7, 9]);
    println!("{} {}", t.remove(3), harness_show(&t));

    println!("\\n@@TEST 5@@");
    let mut t = harness_tree(&[5, 3, 8, 1, 4, 7, 9]);
    println!("{} {}", t.remove(5), harness_show(&t));

    println!("\\n@@TEST 6@@");
    let mut t = harness_tree(&[5]);
    println!("{} [{}] {}", t.remove(5), harness_show(&t), t.contains(5));

    println!("\\n@@TEST 7@@");
    let mut t = harness_tree(&[5, 3, 8]);
    println!("{} {}", t.remove(6), harness_show(&t));

    println!("\\n@@TEST 8@@");
    let mut t = Bst::new();
    println!("{}", t.remove(1));

    println!("\\n@@TEST 9@@");
    let mut t = harness_tree(&[5, 3, 8, 7]);
    println!("{} {} {}", t.remove(8), t.remove(8), harness_show(&t));

    println!("\\n@@TEST 10@@");
    let keys = [50, 30, 70, 20, 40, 60, 80, 35, 45, 65];
    let mut t = harness_tree(&keys);
    let mut ok = true;
    for k in keys {
        ok &= t.remove(k) && !t.contains(k);
    }
    println!("{}", if ok && t.in_order().is_empty() { "ok" } else { "wrong" });

    println!("\\n@@TEST 11@@");
    let mut t = Bst::new();
    let mut reference = std::collections::BTreeSet::new();
    let mut state = 21u64;
    let mut ok = true;
    for step in 0..4000 {
        let r = harness_next(&mut state);
        let k = (r % 300) as i32;
        if (r / 300) % 2 == 0 {
            ok &= t.insert(k) == reference.insert(k);
        } else {
            ok &= t.remove(k) == reference.remove(&k);
        }
        if step % 100 == 0 {
            ok &= t.in_order() == reference.iter().copied().collect::<Vec<_>>();
        }
    }
    ok &= t.in_order() == reference.iter().copied().collect::<Vec<_>>();
    for k in 0..300 {
        ok &= t.contains(k) == reference.contains(&k);
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  forbidden: [{ pattern: '\\b(BTreeSet|BTreeMap)\\b', message: 'Build the tree yourself: BTreeSet and BTreeMap are off the table here.' }],
  tests: [
    { name: 'Delete a leaf', input: 'remove 1', expected: 'true 3 4 5 8' },
    { name: 'One child (right)', input: 'remove 3', expected: 'true 4 5 8' },
    { name: 'One child (left)', input: 'remove 3', expected: 'true 1 5 8' },
    { name: 'Two children', input: 'remove 3', expected: 'true 1 4 5 7 8 9' },
    { name: 'Two children at the root', input: 'remove 5', expected: 'true 1 3 4 7 8 9' },
    { name: 'Only node', input: 'remove 5', expected: 'true [] false' },
    { name: 'Missing key', input: 'remove 6', expected: 'false 3 5 8' },
    { name: 'Empty tree', input: 'remove 1', expected: 'false' },
    { name: 'Remove twice', input: 'remove 8 twice', expected: 'true false 3 5 7' },
    { name: 'Remove everything', input: '10 keys', expected: 'ok' },
    { name: 'Random inserts and removes', input: '4 000 steps vs BTreeSet', expected: 'matches reference' },
  ],
}

const trie = {
  id: 'r5-trie',
  title: 'Trie',
  kind: 'implement',
  introduces: ['option-get-or-insert'],
  teach: {
    body: [
      `<p>A <em>trie</em> (pronounced "try") stores words by their letters. Each node stands for a prefix, and an edge is labelled with a letter. Words that start the same way share their path: <code>car</code>, <code>cart</code> and <code>cat</code> all start <code>c -&gt; a</code>, then split. Each node also carries a flag <code>end</code> saying "a word ends here". The example below draws the trie for those three words. To look a word up, follow its letters one step each; the time depends on the word's length, not on how many words are stored. <code>contains("car")</code> needs the node for "car" to exist and have <code>end</code> set. <code>starts_with("ca")</code> only needs the node to exist.</p>`,
      `<p>For lowercase letters each node has 26 possible children, one per letter, so the Rust node is <code>struct TrieNode { children: [Option&lt;Box&lt;TrieNode&gt;&gt;; 26], end: bool }</code>. The type <code>[T; 26]</code> is an array of exactly 26 items (you made arrays with values in stage 1; this is the same thing written as a type). Each slot is <code>None</code> or a boxed child, like the tree links you already know. <code>#[derive(Default)]</code> on the struct lets <code>TrieNode::default()</code> build a node with 26 <code>None</code>s and <code>end</code> false.</p>`,
      `<p>To turn a letter into a slot number: <code>(c as u8 - b'a') as usize</code>. <code>c as u8</code> is the letter's byte (<code>'a'</code> is 97), <code>b'a'</code> is the byte literal 97 (a byte written with a <code>b</code> before the quote), so the subtraction gives 0 for <code>a</code> up to 25 for <code>z</code>, and <code>as usize</code> makes it usable as an index. <code>for c in word.chars()</code> walks the letters.</p>`,
      `<p><strong>Insert</strong> walks down, creating nodes that are missing. Keep a <code>let mut node = &amp;mut self.root;</code> that is a mutable reference, and for each letter move it to the child: <code>node = node.children[i].get_or_insert_with(|| Box::new(TrieNode::default()));</code>. <code>get_or_insert_with(f)</code> is a method on <code>Option</code>: if it is <code>None</code>, it calls <code>f</code> to make a value and stores it, and either way it returns a <code>&amp;mut</code> to what is inside. At the end set <code>node.end = true</code>. The loop reassigns <code>node</code> each time, so only one mutable reference is live at once.</p>`,
      `<p><strong>Looking up</strong> must not create anything, so use a shared reference: <code>let mut node = &amp;self.root;</code> and, for each letter, <code>node = node.children[i].as_ref()?;</code>. <code>as_ref()</code> looks at the child without taking it, and <code>?</code> returns <code>None</code> from the function as soon as a letter has no child, which means the word or prefix is missing. Write this once as a helper <code>walk(&amp;self, s: &amp;str) -&gt; Option&lt;&amp;TrieNode&gt;</code>; then <code>contains</code> and <code>starts_with</code> differ by one check. In C++ the 26 slots are raw pointers and you need a recursive destructor to free them (or you leak); here each <code>Box</code> frees its child when dropped.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    // the trie for car, cart, cat   ("*" marks a node where a word ends)
    //
    //   root
    //    └ c
    //       └ a
    //          ├ r *      "car"
    //          │  └ t *   "cart"
    //          └ t *      "cat"
    for c in ['a', 'c', 'z'] {
        let slot = (c as u8 - b'a') as usize;     // letter -> position 0..25
        println!("{} goes in slot {}", c, slot);
    }
}`,
        output: 'a goes in slot 0\nc goes in slot 2\nz goes in slot 25',
        caption: 'The shape of a trie, and the letter-to-slot formula.',
      },
      {
        code: `fn main() {
    let mut slot: Option<i32> = None;
    let value = slot.get_or_insert_with(|| 7);   // empty: the closure runs, 7 is stored, we get a &mut to it
    *value += 1;                                 // change it through the reference
    println!("{:?}", slot);

    let again = slot.get_or_insert_with(|| 100); // already filled: the closure does not run
    *again += 1;
    println!("{:?}", slot);
}`,
        output: 'Some(8)\nSome(9)',
        caption: 'get_or_insert_with fills a None and hands back a &mut.',
      },
    ],
    terms: [
      { code: '[Option<Box<TrieNode>>; 26]', meaning: 'an array type: exactly 26 slots, each empty or a boxed child' },
      { code: '(c as u8 - b\'a\') as usize', meaning: 'the position of a lowercase letter: a is 0, z is 25' },
      { code: 'opt.get_or_insert_with(|| make())', meaning: 'if None store make(); either way return a &mut to the contents' },
      { code: 'node.children[i].as_ref()?', meaning: 'look at a child; return None from the function if it is missing' },
      { code: 'TrieNode::default()', meaning: 'a node with all children None and end false (from derive(Default))' },
    ],
  },
  task: `Finish <code>Trie</code> for lowercase ASCII words: <code>insert</code>, <code>contains</code> (whole word) and <code>starts_with</code> (prefix). Each node holds 26 optional children.`,
  refresher: [
    `<code>(c as u8 - b'a') as usize</code> maps <code>'a'..='z'</code> to <code>0..26</code>. <code>for c in word.chars()</code> walks the letters.`,
    `<code>get_or_insert_with</code> on an <code>Option&lt;Box&lt;T&gt;&gt;</code> returns the child, creating it first if it is <code>None</code>.`,
  ],
  hints: [
    `Write <code>walk</code> to follow a string from the root with <code>as_ref()?</code> and return the final node; <code>contains</code> and <code>starts_with</code> then differ in one check.`,
    `<code>insert</code>: for each letter, step into <code>children[i]</code> with <code>get_or_insert_with(|| Box::new(TrieNode::default()))</code>; set <code>end = true</code> on the last node.`,
    `<code>contains</code> needs the final node to exist <em>and</em> have <code>end</code> set (use <code>match</code> on <code>walk</code>). <code>starts_with</code> only needs it to exist.`,
  ],
  inCpp: {
    code: `struct TrieNode {
    TrieNode* next[26] = {};
    bool end = false;
};
void insert(TrieNode* root, const std::string& w) {
    TrieNode* cur = root;
    for (char c : w) {
        if (!cur->next[c - 'a']) cur->next[c - 'a'] = new TrieNode();
        cur = cur->next[c - 'a'];
    }
    cur->end = true;
}`,
    note: `C++ stores 26 raw pointers and needs a recursive destructor or leaks. Rust stores <code>Option&lt;Box&lt;TrieNode&gt;&gt;</code>, which is null-or-owned by construction and is freed when the trie is dropped.`,
  },
  starter: `#[derive(Default)]
struct TrieNode {
    children: [Option<Box<TrieNode>>; 26],
    end: bool,
}

struct Trie {
    root: TrieNode,
}

impl Trie {
    fn new() -> Self {
        Trie { root: TrieNode::default() }
    }
    fn insert(&mut self, word: &str) {}
    // Follow s from the root; the node it ends at, or None if the path is missing.
    fn walk(&self, s: &str) -> Option<&TrieNode> {
        None
    }
    fn contains(&self, word: &str) -> bool {
        false
    }
    fn starts_with(&self, prefix: &str) -> bool {
        false
    }
}`,
  solution: `#[derive(Default)]
struct TrieNode {
    children: [Option<Box<TrieNode>>; 26],
    end: bool,
}

struct Trie {
    root: TrieNode,
}

impl Trie {
    fn new() -> Self {
        Trie { root: TrieNode::default() }
    }
    fn insert(&mut self, word: &str) {
        let mut node = &mut self.root;
        for c in word.chars() {
            let i = (c as u8 - b'a') as usize;
            node = node.children[i].get_or_insert_with(|| Box::new(TrieNode::default()));
        }
        node.end = true;
    }
    // Follow s from the root; the node it ends at, or None if the path is missing.
    fn walk(&self, s: &str) -> Option<&TrieNode> {
        let mut node = &self.root;
        for c in s.chars() {
            node = node.children[(c as u8 - b'a') as usize].as_ref()?;
        }
        Some(node)
    }
    fn contains(&self, word: &str) -> bool {
        match self.walk(word) {
            Some(node) => node.end,
            None => false,
        }
    }
    fn starts_with(&self, prefix: &str) -> bool {
        self.walk(prefix).is_some()
    }
}`,
  harness: LCG + `
fn main() {
    println!("\\n@@TEST 1@@");
    let mut t = Trie::new();
    t.insert("apple");
    println!("{} {} {}", t.contains("apple"), t.contains("app"), t.starts_with("app"));

    println!("\\n@@TEST 2@@");
    let t = Trie::new();
    println!("{} {}", t.contains("a"), t.starts_with("a"));

    println!("\\n@@TEST 3@@");
    let mut t = Trie::new();
    t.insert("a");
    println!("{} {} {}", t.contains("a"), t.contains("b"), t.starts_with("a"));

    println!("\\n@@TEST 4@@");
    let mut t = Trie::new();
    t.insert("app");
    t.insert("apple");
    t.insert("app");
    println!("{} {} {} {}", t.contains("app"), t.contains("apple"), t.contains("appl"), t.starts_with("appl"));

    println!("\\n@@TEST 5@@");
    let mut t = Trie::new();
    for w in ["car", "cart", "cat", "dog"] {
        t.insert(w);
    }
    println!("{} {} {} {}", t.starts_with("ca"), t.starts_with("cb"), t.contains("do"), t.contains("dog"));

    println!("\\n@@TEST 6@@");
    let mut t = Trie::new();
    let mut words: Vec<String> = Vec::new();
    let mut state = 77u64;
    for _ in 0..2000 {
        let len = 1 + harness_next(&mut state) % 6;
        let w: String = (0..len).map(|_| (b'a' + (harness_next(&mut state) % 5) as u8) as char).collect();
        t.insert(&w);
        words.push(w);
    }
    let mut ok = true;
    for _ in 0..2000 {
        let len = 1 + harness_next(&mut state) % 7;
        let q: String = (0..len).map(|_| (b'a' + (harness_next(&mut state) % 5) as u8) as char).collect();
        ok &= t.contains(&q) == words.iter().any(|w| *w == q);
        ok &= t.starts_with(&q) == words.iter().any(|w| w.starts_with(&q));
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  tests: [
    { name: 'Word versus prefix', input: 'apple', expected: 'true false true' },
    { name: 'Empty trie', input: '(empty)', expected: 'false false' },
    { name: 'One letter', input: 'a', expected: 'true false true' },
    { name: 'Word inside a longer word', input: 'app, apple, app', expected: 'true true false true' },
    { name: 'Shared prefixes', input: 'car cart cat dog', expected: 'true false false true' },
    { name: 'Random words', input: '2 000 words and queries', expected: 'matches reference' },
  ],
}

const GRAPH_BFS_HELPERS = `fn harness_graph(n: usize, edges: &[(usize, usize)]) -> Graph {
    let mut g = Graph::new(n);
    for &(u, v) in edges {
        g.add_edge(u, v);
    }
    g
}

fn harness_dist(d: &[Option<usize>]) -> String {
    d.iter().map(|x| match x { Some(k) => k.to_string(), None => "-".to_string() }).collect::<Vec<_>>().join(" ")
}
`

const graphAdj = {
  id: 'r5-graph-adj',
  title: 'A graph as adjacency lists',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>A <em>graph</em> is a set of nodes joined by edges: cities and roads, people and friendships. Give the nodes numbers <code>0</code> to <code>n - 1</code> and an edge is a pair of numbers. The most common way to store a graph is an <em>adjacency list</em>: for each node, the list of nodes it is connected to (its <em>neighbours</em>). In the first example below, node 0 is joined to 1 and 2, so its list is <code>[1, 2]</code>.</p>`,
      `<p>In Rust that is a vector of vectors, <code>Vec&lt;Vec&lt;usize&gt;&gt;</code>. The outer index is the node, and <code>adj[u]</code> is the inner <code>Vec</code> of its neighbours. Node numbers are <code>usize</code> because they are indices. <code>vec![Vec::new(); n]</code> makes <code>n</code> separate empty lists (the macro clones the empty one <code>n</code> times). In C++ this is <code>vector&lt;vector&lt;int&gt;&gt; adj(n)</code>. Adding to a list through the outer one is <code>self.adj[u].push(v)</code>: index first, then call the method on the inner vector.</p>`,
      `<p>An <em>undirected</em> edge between <code>u</code> and <code>v</code> works in both directions, so it is stored twice: <code>v</code> goes into <code>adj[u]</code> and <code>u</code> goes into <code>adj[v]</code>. A <code>neighbors(u)</code> method can return <code>&amp;[usize]</code>, a slice that views the inner list without copying it. <code>&amp;self.adj[u]</code> is a <code>&amp;Vec&lt;usize&gt;</code>, which the compiler converts to a slice automatically, as in stage 2. The <code>degree</code> of a node is how many neighbours it has.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    // nodes 0, 1, 2 with edges 0-1, 0-2, 1-2:
    //
    //    0 --- 1
    //     \\   /
    //       2
    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); 3];   // three empty neighbour lists
    adj[0].push(1);
    adj[1].push(0);        // edge 0-1 is stored in BOTH lists
    adj[0].push(2);
    adj[2].push(0);
    adj[1].push(2);
    adj[2].push(1);
    println!("{:?}", adj);
    println!("node 0 has {} neighbours: {:?}", adj[0].len(), adj[0]);
}`,
        output: '[[1, 2], [0, 2], [0, 1]]\nnode 0 has 2 neighbours: [1, 2]',
        caption: 'A graph as a Vec of neighbour lists.',
      },
      {
        code: `fn neighbours(adj: &[Vec<usize>], u: usize) -> &[usize] {
    &adj[u]                   // &Vec<usize> becomes &[usize] automatically
}

fn main() {
    let adj = vec![vec![1, 2], vec![0], vec![0]];
    println!("{:?}", neighbours(&adj, 0));
    println!("{}", neighbours(&adj, 1).len());
}`,
        output: '[1, 2]\n1',
        caption: 'Returning a view of one list.',
      },
    ],
    terms: [
      { code: 'Vec<Vec<usize>>', meaning: 'adjacency lists: adj[u] holds the neighbours of node u' },
      { code: 'vec![Vec::new(); n]', meaning: 'n separate empty lists' },
      { code: 'self.adj[u].push(v)', meaning: 'adds v to the neighbour list of u' },
      { code: '&[usize]', meaning: 'a read-only view of a list (a slice); &Vec<usize> converts to it' },
    ],
  },
  task: `Finish <code>Graph</code>: <code>add_edge(u, v)</code> adds an undirected edge (each endpoint sees the other), <code>neighbors(u)</code> returns the neighbours in the order edges were added, and <code>degree(u)</code> counts them.`,
  refresher: [
    `An undirected edge is stored twice: <code>v</code> in <code>adj[u]</code> and <code>u</code> in <code>adj[v]</code>.`,
    `<code>&amp;self.adj[u]</code> can be returned as a <code>&amp;[usize]</code>; <code>.len()</code> of it is the degree.`,
  ],
  hints: [
    `<code>add_edge</code> is two pushes: <code>self.adj[u].push(v)</code> and <code>self.adj[v].push(u)</code>.`,
    `<code>neighbors</code> returns <code>&amp;self.adj[u]</code>; it borrows from <code>self</code>, so nothing is copied.`,
    `<code>degree</code> is the length of that list.`,
  ],
  inCpp: {
    code: `std::vector<std::vector<int>> adj(100);
void add_edge(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u);
}
const std::vector<int>& neighbors(int u) { return adj[u]; }`,
    note: `The same shape. In Rust the view you return from <code>neighbors</code> is tied to the graph by the borrow checker, so it cannot outlive the graph or survive an <code>add_edge</code> that might reallocate it.`,
  },
  starter: `struct Graph {
    adj: Vec<Vec<usize>>,
}

impl Graph {
    fn new(n: usize) -> Self {
        Graph { adj: vec![Vec::new(); n] }
    }
    // Undirected: u sees v and v sees u.
    fn add_edge(&mut self, u: usize, v: usize) {}
    fn neighbors(&self, u: usize) -> &[usize] {
        &[]
    }
    fn degree(&self, u: usize) -> usize {
        0
    }
}`,
  solution: `struct Graph {
    adj: Vec<Vec<usize>>,
}

impl Graph {
    fn new(n: usize) -> Self {
        Graph { adj: vec![Vec::new(); n] }
    }
    // Undirected: u sees v and v sees u.
    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }
    fn neighbors(&self, u: usize) -> &[usize] {
        &self.adj[u]
    }
    fn degree(&self, u: usize) -> usize {
        self.adj[u].len()
    }
}`,
  harness: `fn main() {
    println!("\\n@@TEST 1@@");
    let mut g = Graph::new(4);
    g.add_edge(0, 1);
    g.add_edge(0, 2);
    g.add_edge(2, 3);
    println!("{:?} {:?} {:?} {:?}", g.neighbors(0), g.neighbors(1), g.neighbors(2), g.neighbors(3));

    println!("\\n@@TEST 2@@");
    let g = Graph::new(3);
    println!("{:?} {:?} {}", g.neighbors(0), g.neighbors(2), g.degree(1));

    println!("\\n@@TEST 3@@");
    let mut g = Graph::new(5);
    for v in 1..5 {
        g.add_edge(0, v);
    }
    println!("{} {}", g.degree(0), g.degree(1));

    println!("\\n@@TEST 4@@");
    let mut g = Graph::new(4);
    g.add_edge(1, 0);
    g.add_edge(1, 2);
    g.add_edge(1, 3);
    println!("{:?} {:?}", g.neighbors(1), g.neighbors(0));

    println!("\\n@@TEST 5@@");
    let mut g = Graph::new(2);
    g.add_edge(0, 1);
    g.add_edge(0, 1);
    println!("{} {}", g.degree(0), g.degree(1));

    println!("\\n@@TEST 6@@");
    let mut g = Graph::new(1000);
    for u in 0..999 {
        g.add_edge(u, u + 1);
    }
    let mut ok = g.degree(0) == 1 && g.degree(999) == 1;
    for u in 1..999 {
        ok &= g.degree(u) == 2 && g.neighbors(u) == [u - 1, u + 1];
    }
    println!("{}", if ok { "ok" } else { "wrong" });
}`,
  tests: [
    { name: 'Neighbour lists', input: 'edges 0-1, 0-2, 2-3', expected: '[1, 2] [0] [0, 3] [2]' },
    { name: 'No edges', input: '3 nodes', expected: '[] [] 0' },
    { name: 'Star', input: 'node 0 joined to 1..4', expected: '4 1' },
    { name: 'Order of edges kept', input: '1-0, 1-2, 1-3', expected: '[0, 2, 3] [1]' },
    { name: 'Repeated edge', input: '0-1 twice', expected: '2 2' },
    { name: 'Long path', input: '1 000 nodes', expected: 'ok' },
  ],
}

const graphBfs = {
  id: 'r5-graph-bfs',
  title: 'Graph and BFS',
  kind: 'implement',
  introduces: ['vecdeque'],
  teach: {
    body: [
      `<p><em>Breadth-first search</em> (BFS) explores a graph in rings: first the start node, then everything one edge away, then everything two edges away, and so on. That makes it the way to find the fewest hops from the start to every other node. The data structure that gives the rings is a <em>queue</em>: items leave in the order they arrived. Take a node from the front, add its unseen neighbours to the back.</p>`,
      `<p>Trace the graph with edges 0-1, 0-2, 1-3, 2-3, 3-4, starting at 0. Queue <code>[0]</code>. Take 0, enqueue its neighbours 1 and 2: queue <code>[1, 2]</code>, both one hop away. Take 1: its neighbours 0 (already seen) and 3 (new, two hops): queue <code>[2, 3]</code>. Take 2: neighbour 3 is already seen. Take 3: new neighbour 4, three hops. Take 4. Visiting order: <code>0 1 2 3 4</code>. The key rule is to mark a node as seen when you <em>enqueue</em> it, not when you take it out, so no node is queued twice.</p>`,
      `<p>A <code>Vec</code> is a poor queue because removing the front shifts everything. The standard library has <code>VecDeque</code> (a "deque", double-ended queue, like C++ <code>std::deque</code>). You bring it in with <code>use std::collections::VecDeque;</code> and make one with <code>VecDeque::new()</code>. <code>queue.push_back(x)</code> adds at the back, <code>queue.pop_front()</code> removes from the front and returns an <code>Option</code> (<code>None</code> when empty), and <code>queue.is_empty()</code> and <code>queue.len()</code> do what you expect. Both ends are fast. The loop is <code>while let Some(u) = queue.pop_front() { ... }</code>: it runs until the queue is empty.</p>`,
      `<p>Two details. To go through a node's neighbours you write <code>for &amp;w in &amp;self.adj[u]</code>. The <code>&amp;w</code> pattern takes each reference apart and copies the number out (you saw this pattern with tuples), so <code>w</code> is a plain <code>usize</code>. And for <code>bfs_dist</code>, keep distances in a <code>Vec&lt;Option&lt;usize&gt;&gt;</code>, made with <code>vec![None; n]</code>: <code>None</code> means "not reached yet", <code>Some(d)</code> is the hop count. <code>dist[w].is_none()</code> doubles as the "not seen" test, so there is no separate seen array. C++ would store <code>-1</code> for unreachable, which is a number you can accidentally add to; here <code>None</code> cannot be used as a distance until you check it.</p>`,
    ],
    examples: [
      {
        code: `use std::collections::VecDeque;

fn main() {
    let mut queue = VecDeque::new();       // an empty queue
    queue.push_back(1);
    queue.push_back(2);
    queue.push_back(3);
    println!("{:?}", queue.pop_front());   // the first one in comes out first: Some(1)
    queue.push_back(4);
    println!("{} {:?}", queue.len(), queue);
    while let Some(x) = queue.pop_front() {   // runs until the queue is empty
        println!("got {}", x);
    }
    println!("{}", queue.is_empty());
}`,
        output: 'Some(1)\n3 [2, 3, 4]\ngot 2\ngot 3\ngot 4\ntrue',
        caption: 'VecDeque as a queue.',
      },
      {
        code: `fn main() {
    let mut dist: Vec<Option<usize>> = vec![None; 4];   // None means "not reached yet"
    dist[0] = Some(0);
    dist[2] = Some(1);
    println!("{:?}", dist);
    println!("{}", dist[1].is_none());                  // the "not seen" test
    println!("{}", dist[2].unwrap() + 1);               // a distance, once we know it is Some
}`,
        output: '[Some(0), None, Some(1), None]\ntrue\n2',
        caption: 'A distance table with room for "unreachable".',
      },
    ],
    terms: [
      { code: 'use std::collections::VecDeque;', meaning: 'brings the double-ended queue into scope' },
      { code: 'queue.push_back(x)', meaning: 'adds x at the back of the queue' },
      { code: 'queue.pop_front()', meaning: 'removes from the front: Some(x), or None when empty' },
      { code: 'while let Some(u) = queue.pop_front()', meaning: 'loops until the queue runs out' },
      { code: 'for &w in &self.adj[u]', meaning: 'visits each neighbour as a plain usize' },
      { code: 'vec![None; n]', meaning: 'n slots, all None (the item type is Option<...>)' },
    ],
  },
  task: `Finish <code>bfs_order</code> (reachable nodes in visiting order) and <code>bfs_dist</code> (hop count to every node, <code>None</code> if unreachable) on an undirected graph. Neighbours are taken in the order edges were added.`,
  refresher: [
    `<code>VecDeque</code> is a queue: <code>push_back</code> to add, <code>pop_front</code> to take (returns <code>Option</code>).`,
    `<code>vec![None; n]</code> makes a vector of <code>Option</code>s. <code>dist[w].is_none()</code> doubles as the "not visited" test, so a separate visited array is not needed.`,
  ],
  hints: [
    `Mark a node as seen when you <em>enqueue</em> it, not when you dequeue it, so it is queued only once.`,
    `Write <code>bfs_dist</code> first: <code>dist[start] = Some(0)</code>, and for each unseen neighbour <code>w</code> of <code>u</code> set <code>dist[w] = Some(d + 1)</code> where <code>d</code> is <code>dist[u].unwrap()</code>.`,
    `<code>bfs_order</code> is the same loop recording each node as you take it from the queue; use a <code>Vec&lt;bool&gt;</code> for seen.`,
  ],
  inCpp: {
    code: `std::vector<int> bfs_dist(const std::vector<std::vector<int>>& adj, int start) {
    std::vector<int> dist(adj.size(), -1);
    std::queue<int> q;
    dist[start] = 0;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int w : adj[u])
            if (dist[w] < 0) { dist[w] = dist[u] + 1; q.push(w); }
    }
    return dist;
}`,
    note: `C++ marks "unreachable" with <code>-1</code>, which is easy to add to by accident. <code>Vec&lt;Option&lt;usize&gt;&gt;</code> makes unreachable a distinct value that cannot be used as a number until you check it.`,
  },
  starter: `use std::collections::VecDeque;

struct Graph {
    adj: Vec<Vec<usize>>,
}

impl Graph {
    fn new(n: usize) -> Self {
        Graph { adj: vec![Vec::new(); n] }
    }
    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }
    fn bfs_order(&self, start: usize) -> Vec<usize> {
        Vec::new()
    }
    fn bfs_dist(&self, start: usize) -> Vec<Option<usize>> {
        Vec::new()
    }
}`,
  solution: `use std::collections::VecDeque;

struct Graph {
    adj: Vec<Vec<usize>>,
}

impl Graph {
    fn new(n: usize) -> Self {
        Graph { adj: vec![Vec::new(); n] }
    }
    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }
    fn bfs_order(&self, start: usize) -> Vec<usize> {
        let mut seen = vec![false; self.adj.len()];
        let mut order = Vec::new();
        let mut queue = VecDeque::new();
        seen[start] = true;
        queue.push_back(start);
        while let Some(u) = queue.pop_front() {
            order.push(u);
            for &w in &self.adj[u] {
                if !seen[w] {
                    seen[w] = true;
                    queue.push_back(w);
                }
            }
        }
        order
    }
    fn bfs_dist(&self, start: usize) -> Vec<Option<usize>> {
        let mut dist = vec![None; self.adj.len()];
        let mut queue = VecDeque::new();
        dist[start] = Some(0);
        queue.push_back(start);
        while let Some(u) = queue.pop_front() {
            let d = dist[u].unwrap();
            for &w in &self.adj[u] {
                if dist[w].is_none() {
                    dist[w] = Some(d + 1);
                    queue.push_back(w);
                }
            }
        }
        dist
    }
}`,
  harness: LCG + GRAPH_BFS_HELPERS + `
fn main() {
    let edges = [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4)];

    println!("\\n@@TEST 1@@");
    let g = harness_graph(6, &edges);
    println!("{:?}", g.bfs_order(0));
    println!("{}", harness_dist(&g.bfs_dist(0)));

    println!("\\n@@TEST 2@@");
    let g = harness_graph(1, &[]);
    println!("{:?} {}", g.bfs_order(0), harness_dist(&g.bfs_dist(0)));

    println!("\\n@@TEST 3@@");
    let g = harness_graph(6, &edges);
    println!("{:?}", g.bfs_order(5));
    println!("{}", harness_dist(&g.bfs_dist(5)));

    println!("\\n@@TEST 4@@");
    let g = harness_graph(3, &[(0, 2), (0, 1)]);
    println!("{:?}", g.bfs_order(0));

    println!("\\n@@TEST 5@@");
    let g = harness_graph(4, &[(0, 1), (1, 2), (2, 3), (3, 0)]);
    println!("{:?}", g.bfs_order(2));
    println!("{}", harness_dist(&g.bfs_dist(2)));

    println!("\\n@@TEST 6@@");
    let g = harness_graph(6, &edges);
    println!("{}", harness_dist(&g.bfs_dist(4)));

    println!("\\n@@TEST 7@@");
    let n = 2000;
    let mut state = 13u64;
    let mut g = Graph::new(n);
    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
    for _ in 0..3000 {
        let u = (harness_next(&mut state) % n as u64) as usize;
        let v = (harness_next(&mut state) % n as u64) as usize;
        g.add_edge(u, v);
        adj[u].push(v);
        adj[v].push(u);
    }
    let mut dist: Vec<Option<usize>> = vec![None; n];
    let mut order = Vec::new();
    let mut q = std::collections::VecDeque::new();
    dist[0] = Some(0);
    q.push_back(0usize);
    while let Some(u) = q.pop_front() {
        order.push(u);
        for &w in &adj[u] {
            if dist[w].is_none() {
                dist[w] = Some(dist[u].unwrap() + 1);
                q.push_back(w);
            }
        }
    }
    let ok = g.bfs_order(0) == order && g.bfs_dist(0) == dist;
    println!("{}", if ok { "matches reference" } else { "differs from reference" });
}`,
  tests: [
    { name: 'Small graph', input: '6 nodes, start 0', expected: '[0, 1, 2, 3, 4]\n0 1 1 2 3 -' },
    { name: 'Single node', input: '1 node', expected: '[0] 0' },
    { name: 'Isolated start', input: 'start 5', expected: '[5]\n- - - - - 0' },
    { name: 'Edge order matters', input: 'edges (0,2) then (0,1)', expected: '[0, 2, 1]' },
    { name: 'Cycle', input: '4-cycle, start 2', expected: '[2, 1, 3, 0]\n2 1 0 1' },
    { name: 'Distances from the far end', input: 'start 4', expected: '3 2 2 1 0 -' },
    { name: 'Random graph', input: '2 000 nodes, 3 000 edges', expected: 'matches reference' },
  ],
}

const graphDfs = {
  id: 'r5-graph-dfs',
  title: 'DFS with an explicit stack',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p><em>Depth-first search</em> (DFS) goes as deep as it can along one path, then backs up and tries the next branch. Where BFS uses a queue, DFS uses a <em>stack</em>, the structure from the first lesson of this stage: last in, first out. You take a node from the top, and push its neighbours on top, so the next node you visit is one of them rather than an old one.</p>`,
      `<p>Trace the graph with edges 0-1, 0-2, 1-3, 2-3, 3-4 from 0, visiting neighbours in ascending order. Stack <code>[0]</code>. Pop 0, visit it. Its neighbours are 1 and 2; to visit 1 first, push 2 and then 1 (the one pushed last is popped first): stack <code>[2, 1]</code>. Pop 1, visit. Its neighbours 0 (seen) and 3: push 3, stack <code>[2, 3]</code>. Pop 3, visit; neighbours 1 (seen), 2, 4: push 4 then 2, stack <code>[2, 4, 2]</code>. Pop 2, visit; its neighbours are all seen. Pop 4, visit. Pop the last 2: already seen, skip it. Order: <code>0 1 3 2 4</code>.</p>`,
      `<p>That last step is the rule to remember: a node can sit in the stack more than once (2 was pushed twice), so mark nodes as seen when you <em>pop</em> them and skip a popped node that is already seen. (In BFS you mark when enqueuing; marking at push time here would give a different visiting order from recursive DFS.) Why a <code>Vec</code> stack and not recursion? Recursion uses the call stack, which is small: a path of 200 000 nodes overflows it and the program crashes. A <code>Vec</code> lives on the heap and has no such limit.</p>`,
      `<p>Rust details. The neighbour list sits inside <code>&amp;self</code>, so you cannot sort it in place. <code>.clone()</code> it first, <code>sort_unstable()</code> the copy (a fast sort when equal items need no particular order), and push with <code>for &amp;w in next.iter().rev()</code> so the smallest ends on top. <code>while let Some(v) = stack.pop()</code> is the whole loop shape, and <code>continue</code> skips the rest of a turn.</p>`,
    ],
    examples: [
      {
        code: `fn main() {
    let mut stack = vec![1, 2, 3];          // pushed in this order, so 3 is on top
    while let Some(top) = stack.pop() {     // pop() is Some(top) until the stack is empty
        println!("visit {}", top);
    }
}`,
        output: 'visit 3\nvisit 2\nvisit 1',
        caption: 'A Vec as a stack: last in, first out.',
      },
      {
        code: `fn main() {
    let neighbours = vec![4, 1, 3];
    let mut sorted = neighbours.clone();    // a copy, so the original keeps its order
    sorted.sort_unstable();                 // [1, 3, 4]
    for &w in sorted.iter().rev() {         // 4, then 3, then 1: the smallest is pushed last
        println!("push {}", w);
    }
    println!("{:?}", neighbours);
}`,
        output: 'push 4\npush 3\npush 1\n[4, 1, 3]',
        caption: 'Sorting a copy and pushing it largest first.',
      },
    ],
    terms: [
      { code: 'let mut stack = vec![start];', meaning: 'a Vec used as a stack, starting with the first node' },
      { code: 'while let Some(v) = stack.pop()', meaning: 'pops until the stack is empty' },
      { code: 'if seen[v] { continue; }', meaning: 'skip a node already visited' },
      { code: 'next.sort_unstable()', meaning: 'sorts the Vec in place, fast, for items where ties need no order' },
      { code: 'next.iter().rev()', meaning: 'walks a list backwards' },
    ],
  },
  task: `Write <code>dfs_order</code>: the order in which a depth-first search first visits each reachable node, trying neighbours in ascending order. Use a <code>Vec</code> as the stack, not recursion.`,
  refresher: [
    `Recursion depth is limited by the stack: a path of 200 000 nodes overflows it. An explicit <code>Vec</code> stack lives on the heap and has no such limit.`,
    `<code>stack.pop()</code> returns an <code>Option</code>, so <code>while let Some(v) = stack.pop()</code> is the loop. The stack is last-in first-out, so the neighbour to visit first must be pushed last.`,
  ],
  hints: [
    `Mark a node as seen when you <em>pop</em> it, and skip it if it was already seen: a node can be on the stack more than once.`,
    `Sort a copy of the neighbours ascending, then push them in reverse so the smallest is popped first.`,
    `Recording the order when you pop (after the seen check) gives the same order as recursive DFS.`,
  ],
  inCpp: {
    code: `void dfs(const std::vector<std::vector<int>>& adj, int v,
         std::vector<bool>& seen, std::vector<int>& order) {
    seen[v] = true;
    order.push_back(v);
    for (int w : adj[v])
        if (!seen[w]) dfs(adj, w, seen, order);
}`,
    note: `The recursive version is shorter in both languages, and deep recursion crashes both. Rust has no guarantee that recursion is optimised, so graph code with long paths uses an explicit stack.`,
  },
  starter: `struct Graph {
    adj: Vec<Vec<usize>>,
}

impl Graph {
    fn new(n: usize) -> Self {
        Graph { adj: vec![Vec::new(); n] }
    }
    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }
    fn dfs_order(&self, start: usize) -> Vec<usize> {
        Vec::new()
    }
}`,
  solution: `struct Graph {
    adj: Vec<Vec<usize>>,
}

impl Graph {
    fn new(n: usize) -> Self {
        Graph { adj: vec![Vec::new(); n] }
    }
    fn add_edge(&mut self, u: usize, v: usize) {
        self.adj[u].push(v);
        self.adj[v].push(u);
    }
    fn dfs_order(&self, start: usize) -> Vec<usize> {
        let mut seen = vec![false; self.adj.len()];
        let mut order = Vec::new();
        let mut stack = vec![start];
        while let Some(v) = stack.pop() {
            if seen[v] {
                continue;
            }
            seen[v] = true;
            order.push(v);
            let mut next = self.adj[v].clone();
            next.sort_unstable();
            for &w in next.iter().rev() {
                if !seen[w] {
                    stack.push(w);
                }
            }
        }
        order
    }
}`,
  harness: LCG + `
fn harness_graph(n: usize, edges: &[(usize, usize)]) -> Graph {
    let mut g = Graph::new(n);
    for &(u, v) in edges {
        g.add_edge(u, v);
    }
    g
}

fn harness_recursive(adj: &Vec<Vec<usize>>, v: usize, seen: &mut Vec<bool>, order: &mut Vec<usize>) {
    seen[v] = true;
    order.push(v);
    let mut next = adj[v].clone();
    next.sort_unstable();
    for w in next {
        if !seen[w] {
            harness_recursive(adj, w, seen, order);
        }
    }
}

fn main() {
    let edges = [(0, 1), (0, 2), (1, 3), (2, 3), (3, 4)];

    println!("\\n@@TEST 1@@");
    println!("{:?}", harness_graph(5, &edges).dfs_order(0));

    println!("\\n@@TEST 2@@");
    println!("{:?}", harness_graph(4, &[(0, 3), (0, 1), (0, 2)]).dfs_order(0));

    println!("\\n@@TEST 3@@");
    println!("{:?}", harness_graph(1, &[]).dfs_order(0));

    println!("\\n@@TEST 4@@");
    println!("{:?}", harness_graph(5, &[(0, 1), (3, 4)]).dfs_order(0));

    println!("\\n@@TEST 5@@");
    println!("{:?}", harness_graph(3, &[(0, 1), (1, 2), (2, 0)]).dfs_order(0));

    println!("\\n@@TEST 6@@");
    println!("{:?}", harness_graph(6, &[(0, 1), (0, 2), (1, 3), (1, 4), (2, 5)]).dfs_order(0));

    println!("\\n@@TEST 7@@");
    println!("{:?}", harness_graph(5, &[(0, 1), (0, 2), (1, 2), (1, 3), (2, 4)]).dfs_order(0));

    println!("\\n@@TEST 8@@");
    let n = 200000;
    let mut g = Graph::new(n);
    for i in 0..n - 1 {
        g.add_edge(i, i + 1);
    }
    let order = g.dfs_order(0);
    println!("{}", if order.len() == n && order.iter().enumerate().all(|(i, &v)| i == v) { "ok" } else { "wrong" });

    println!("\\n@@TEST 9@@");
    let n = 500;
    let mut state = 3u64;
    let mut g = Graph::new(n);
    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
    for _ in 0..800 {
        let u = (harness_next(&mut state) % n as u64) as usize;
        let v = (harness_next(&mut state) % n as u64) as usize;
        g.add_edge(u, v);
        adj[u].push(v);
        adj[v].push(u);
    }
    let mut seen = vec![false; n];
    let mut order = Vec::new();
    harness_recursive(&adj, 0, &mut seen, &mut order);
    println!("{}", if g.dfs_order(0) == order { "matches reference" } else { "differs from reference" });
}`,
  forbidden: [{ pattern: 'self\\s*\\.\\s*dfs_order\\s*\\(', message: 'Use an explicit stack: do not call dfs_order recursively.' }],
  tests: [
    { name: 'Small graph', input: '0-1 0-2 1-3 2-3 3-4', expected: '[0, 1, 3, 2, 4]' },
    { name: 'Edges added out of order', input: '0-3 0-1 0-2', expected: '[0, 1, 2, 3]' },
    { name: 'Single node', input: '1 node', expected: '[0]' },
    { name: 'Disconnected graph', input: '0-1, 3-4, start 0', expected: '[0, 1]' },
    { name: 'Cycle', input: '0-1-2-0', expected: '[0, 1, 2]' },
    { name: 'Tree', input: '0-1 0-2 1-3 1-4 2-5', expected: '[0, 1, 3, 4, 2, 5]' },
    { name: 'Go deep before wide', input: '0-1 0-2 1-2 1-3 2-4', expected: '[0, 1, 2, 4, 3]' },
    { name: 'A path of 200 000 nodes', input: 'would overflow recursion', expected: 'ok' },
    { name: 'Random graph', input: '500 nodes, 800 edges', expected: 'matches reference' },
  ],
}

const unionFind = {
  id: 'r5-union-find',
  title: 'Union-find',
  kind: 'implement',
  introduces: [],
  teach: {
    body: [
      `<p>Union-find (also called a <em>disjoint-set union</em>, DSU) tracks which items belong to the same group while groups merge over time. <code>union(a, b)</code> merges the group of <code>a</code> with the group of <code>b</code>. <code>find(x)</code> returns a <em>representative</em> of the group of <code>x</code>, the same one for everyone in the group. So <code>connected(a, b)</code> is just <code>find(a) == find(b)</code>. Typical uses: "are these two computers connected?", building a minimum spanning tree.</p>`,
      `<p>The structure is a <code>parent: Vec&lt;usize&gt;</code> where <code>parent[x]</code> is the item above <code>x</code> in its group's tree. A <em>root</em> is its own parent, and the root is the representative. At the start every item is its own group: <code>parent = [0, 1, 2, 3, 4, 5]</code>. <code>find</code> follows <code>parent</code> up to a root (see the first example). To <code>union</code> two groups, find both roots; if they differ, hang one root under the other. Trace: <code>union(0, 1)</code> sets <code>parent[1] = 0</code>. <code>union(2, 3)</code> sets <code>parent[3] = 2</code>. <code>union(1, 3)</code>: the roots are 0 and 2, so hang 2 under 0 and the whole group <code>{0, 1, 2, 3}</code> has root 0.</p>`,
      `<p>Two tricks keep the trees almost flat, so each operation is nearly constant time. <em>Union by size</em>: keep <code>size[root]</code> (the number of items in that root's group) and always hang the <em>smaller</em> group under the larger; add the sizes. <em>Path compression</em>: after <code>find(x)</code> has found the root, point <code>parent[x]</code> straight at it, so the next lookup is one step. Recursion does it on the way back: <code>if parent[x] != x { let root = self.find(self.parent[x]); self.parent[x] = root; }</code> then return <code>self.parent[x]</code>. (Passing <code>self.parent[x]</code> as an argument to a <code>&amp;mut self</code> method is allowed: the compiler reads the number first, then starts the call.)</p>`,
      `<p>The Rust-specific lesson: <code>find</code> changes <code>parent</code> (compression), so it needs <code>&amp;mut self</code>. That spreads: <code>connected</code> and <code>size</code> call <code>find</code>, so they need <code>&amp;mut self</code> too, even though they only seem to read. The type signature tells the truth: asking a question here rewrites the structure, which a C++ <code>const</code> method would have to hide behind <code>mutable</code>. To choose the bigger root without swapping variables, write <code>let (big, small) = if self.size[ra] &lt; self.size[rb] { (rb, ra) } else { (ra, rb) };</code>.</p>`,
    ],
    examples: [
      {
        code: `fn root(parent: &[usize], mut x: usize) -> usize {
    while parent[x] != x {     // a root is its own parent
        x = parent[x];         // climb one level
    }
    x
}

fn main() {
    // group {0, 1, 2, 3} with root 0:      0
    //                                     / \\
    //                                    1   2
    //                                        |
    //                                        3
    let parent = vec![0, 0, 0, 2];
    println!("{} {} {}", root(&parent, 3), root(&parent, 1), root(&parent, 0));
}`,
        output: '0 0 0',
        caption: 'find without compression: climb to the root.',
      },
      {
        code: `fn main() {
    let size = vec![1, 3];       // the group rooted at 0 has 1 item, the one at 1 has 3
    let (ra, rb) = (0, 1);       // the two roots we found
    let (big, small) = if size[ra] < size[rb] { (rb, ra) } else { (ra, rb) };
    println!("attach {} under {}", small, big);
}`,
        output: 'attach 0 under 1',
        caption: 'Union by size: the smaller group goes under the larger.',
      },
    ],
    terms: [
      { code: 'parent: Vec<usize>', meaning: 'parent[x] is the item above x; a root is its own parent' },
      { code: 'size: Vec<usize>', meaning: 'size[root] is how many items are in that root\'s group' },
      { code: 'fn find(&mut self, x: usize) -> usize', meaning: 'needs &mut self because it compresses paths' },
      { code: 'let (big, small) = if ... { (rb, ra) } else { (ra, rb) };', meaning: 'picks which root goes on top; a tuple from an if' },
    ],
  },
  task: `Finish <code>Dsu</code>: <code>find</code> with path compression, <code>union</code> by size (returns <code>true</code> if two sets were merged), <code>connected</code>, and <code>size</code> of a node's set.`,
  refresher: [
    `Path compression: after finding the root, point every node on the way directly at it. A recursive <code>find</code> does this on the way back out.`,
    `<code>find</code> takes <code>&amp;mut self</code> because compression changes <code>parent</code>; so <code>connected</code> and <code>size</code> need <code>&amp;mut self</code> too.`,
  ],
  hints: [
    `<code>find(x)</code>: if <code>parent[x] != x</code>, set <code>parent[x] = self.find(self.parent[x])</code> (via a local if the compiler complains); return <code>parent[x]</code>.`,
    `<code>union</code>: find both roots, return <code>false</code> if equal. Otherwise attach the smaller set's root under the larger and add the sizes.`,
    `<code>size</code> is <code>self.size[root]</code> for <code>root = self.find(x)</code>: only the root's entry is kept up to date.`,
  ],
  inCpp: {
    code: `struct Dsu {
    std::vector<int> parent, sz;
    explicit Dsu(int n) : parent(n), sz(n, 1) {
        std::iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        return parent[x] == x ? x : parent[x] = find(parent[x]);
    }
};`,
    note: `The C++ one-liner assigns inside the return. In Rust <code>find</code> must be <code>&amp;mut self</code> because it mutates, which then spreads to <code>connected</code>: the type system shows that "read-only" queries secretly write.`,
  },
  starter: `struct Dsu {
    parent: Vec<usize>,
    size: Vec<usize>,
}

impl Dsu {
    fn new(n: usize) -> Self {
        Dsu { parent: (0..n).collect(), size: vec![1; n] }
    }
    fn find(&mut self, x: usize) -> usize {
        x
    }
    // True if a and b were in different sets and are now merged.
    fn union(&mut self, a: usize, b: usize) -> bool {
        false
    }
    fn connected(&mut self, a: usize, b: usize) -> bool {
        false
    }
    fn size(&mut self, x: usize) -> usize {
        1
    }
}`,
  solution: `struct Dsu {
    parent: Vec<usize>,
    size: Vec<usize>,
}

impl Dsu {
    fn new(n: usize) -> Self {
        Dsu { parent: (0..n).collect(), size: vec![1; n] }
    }
    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            let root = self.find(self.parent[x]);
            self.parent[x] = root;
        }
        self.parent[x]
    }
    // True if a and b were in different sets and are now merged.
    fn union(&mut self, a: usize, b: usize) -> bool {
        let (ra, rb) = (self.find(a), self.find(b));
        if ra == rb {
            return false;
        }
        let (big, small) = if self.size[ra] < self.size[rb] { (rb, ra) } else { (ra, rb) };
        self.parent[small] = big;
        self.size[big] += self.size[small];
        true
    }
    fn connected(&mut self, a: usize, b: usize) -> bool {
        self.find(a) == self.find(b)
    }
    fn size(&mut self, x: usize) -> usize {
        let root = self.find(x);
        self.size[root]
    }
}`,
  harness: LCG + `
fn main() {
    println!("\\n@@TEST 1@@");
    let mut d = Dsu::new(5);
    println!("{} {} {}", d.connected(0, 1), d.connected(2, 2), d.size(0));

    println!("\\n@@TEST 2@@");
    let mut d = Dsu::new(5);
    let merged = d.union(0, 1);
    println!("{} {} {}", merged, d.connected(0, 1), d.size(1));

    println!("\\n@@TEST 3@@");
    let mut d = Dsu::new(5);
    d.union(0, 1);
    println!("{} {} {}", d.union(1, 0), d.union(0, 1), d.size(0));

    println!("\\n@@TEST 4@@");
    let mut d = Dsu::new(5);
    d.union(0, 1);
    d.union(1, 2);
    d.union(3, 4);
    println!("{} {} {} {}", d.connected(0, 2), d.connected(2, 3), d.size(2), d.size(4));

    println!("\\n@@TEST 5@@");
    let mut d = Dsu::new(5);
    d.union(0, 1);
    d.union(1, 2);
    d.union(3, 4);
    println!("{} {} {}", d.union(2, 3), d.size(0), d.connected(0, 4));

    println!("\\n@@TEST 6@@");
    let mut d = Dsu::new(1);
    println!("{} {} {}", d.connected(0, 0), d.size(0), d.union(0, 0));

    println!("\\n@@TEST 7@@");
    let n = 2000;
    let mut d = Dsu::new(n);
    let mut label: Vec<usize> = (0..n).collect();
    let mut state = 17u64;
    let mut ok = true;
    for _ in 0..3000 {
        let a = (harness_next(&mut state) % n as u64) as usize;
        let b = (harness_next(&mut state) % n as u64) as usize;
        let same = label[a] == label[b];
        ok &= d.union(a, b) == !same;
        if !same {
            let (from, to) = (label[b], label[a]);
            for l in label.iter_mut() {
                if *l == from {
                    *l = to;
                }
            }
        }
    }
    for _ in 0..2000 {
        let a = (harness_next(&mut state) % n as u64) as usize;
        let b = (harness_next(&mut state) % n as u64) as usize;
        ok &= d.connected(a, b) == (label[a] == label[b]);
        ok &= d.size(a) == label.iter().filter(|&&l| l == label[a]).count();
    }
    println!("{}", if ok { "matches reference" } else { "differs from reference" });

    println!("\\n@@TEST 8@@");
    let n = 100000;
    let mut d = Dsu::new(n);
    for i in 0..n - 1 {
        d.union(i, i + 1);
    }
    println!("{}", if d.size(0) == n && d.connected(0, n - 1) { "ok" } else { "wrong" });
}`,
  tests: [
    { name: 'Fresh sets', input: '5 nodes', expected: 'false true 1' },
    { name: 'One union', input: 'union 0 1', expected: 'true true 2' },
    { name: 'Union twice', input: 'union 0 1, again', expected: 'false false 2' },
    { name: 'Two groups', input: '0-1-2 and 3-4', expected: 'true false 3 2' },
    { name: 'Merging groups', input: 'union 2 3', expected: 'true 5 true' },
    { name: 'Single node', input: '1 node', expected: 'true 1 false' },
    { name: 'Random unions', input: '2 000 nodes vs labels', expected: 'matches reference' },
    { name: 'Long chain', input: '100 000 nodes', expected: 'ok' },
  ],
}

const dlist = {
  id: 'r5-doubly-linked-list',
  title: 'Why doubly linked is hard',
  kind: 'concept',
  introduces: [],
  teach: {
    body: [
      `<p>A <em>doubly linked list</em> has two links per node, <code>next</code> and <code>prev</code>, so you can walk both ways and remove a node knowing only the node. In C++ it is a two-line change: add a second pointer. In Rust it is famously hard, and the reason is the ownership rule you have used all stage: a <code>Box</code> has exactly one owner. In the middle of the list, node B is pointed to by A's <code>next</code> and by C's <code>prev</code>. Which of them owns B? If A owns B through a <code>Box</code>, then C cannot also own it, and the code for "two owners" simply does not exist with <code>Box</code>. The compare section below shows the mistake as a compile error (E0382, a use of a moved value).</p>`,
      `<p>There are three honest ways out. (1) <strong>Shared ownership</strong>: <code>Rc&lt;RefCell&lt;Node&gt;&gt;</code> for the forward links and a weak reference (<code>Weak</code>) for the backward ones. It works and it is how many tutorials do it, but every access goes through run-time borrow checks and the code is full of <code>.borrow_mut()</code> and <code>.upgrade()</code>. (2) <strong><code>unsafe</code> raw pointers</strong>: what the standard library's <code>LinkedList</code> does internally, correct only because the library authors prove it by hand. (3) <strong>An arena with indices</strong>: keep every node in one <code>Vec</code>, and let <code>prev</code> and <code>next</code> be <code>Option&lt;usize&gt;</code>, positions in that Vec.</p>`,
      `<p>The arena avoids the problem rather than solving it. A <code>usize</code> is just a number, so it owns nothing: a node can be "linked" from both sides because no node owns another. The <code>Vec</code> owns all of them, and drops them all together. Following a link means indexing: <code>self.nodes[i].next</code>. This is a very common Rust pattern, used for graphs, trees with parent pointers and game entities too. The price: indices can go stale (if you remove a node, its slot needs reusing or marking as free, and nothing checks that an old index still means the same node), and you give up pointer-style speed tricks. For most programs it is the right trade. If you only need a queue, <code>VecDeque</code> is better than any linked list.</p>`,
      `<p>Your job: the list below stores <code>DNode</code>s in a <code>Vec</code>, and you write <code>push_back</code> so that <code>forward()</code> and <code>backward()</code> both work. The new node's index is the Vec's length before you push it. Its <code>prev</code> is the old <code>tail</code>. The old tail's <code>next</code> has to be updated to point at the new node, and if there was no tail the new node is also the <code>head</code>. Finally the tail becomes the new node.</p>`,
    ],
    examples: [
      {
        code: `struct DNode {
    val: i32,
    prev: Option<usize>,
    next: Option<usize>,
}

fn main() {
    // two nodes living in a Vec; the links are positions in it
    //   index 0: val 10, prev None,    next Some(1)
    //   index 1: val 20, prev Some(0), next None
    let nodes = vec![
        DNode { val: 10, prev: None, next: Some(1) },
        DNode { val: 20, prev: Some(0), next: None },
    ];
    let forward = nodes[0].next.unwrap();          // follow next from node 0: index 1
    let backward = nodes[forward].prev.unwrap();   // follow prev from node 1: back to index 0
    println!("{} {}", nodes[forward].val, nodes[backward].val);
}`,
        output: '20 10',
        caption: 'Links are indices, so both directions are fine.',
      },
    ],
    terms: [
      { code: 'prev: Option<usize>, next: Option<usize>', meaning: 'links stored as positions in a Vec, not as pointers' },
      { code: 'self.nodes[i].next', meaning: 'follow a link: index the Vec with the stored number' },
      { code: 'arena', meaning: 'one Vec that owns all the nodes of a structure' },
    ],
  },
  task: `The list below keeps its nodes in a <code>Vec</code> and links them by index. Write <code>push_back</code> so that <code>forward()</code> and <code>backward()</code> both work.`,
  compare: {
    cpp: { code: `struct Node { int val; Node* prev; Node* next; };
Node a{1, nullptr, nullptr};
Node b{2, &a, nullptr};
a.next = &b;   // each node pointed to twice`, outcome: 'Fine: raw pointers, no owner', ok: true },
    rust: { code: `struct Node { val: i32, next: Option<Box<Node>>, prev: Option<Box<Node>> }
let a = Box::new(Node { val: 1, next: None, prev: None });
let b = Box::new(Node { val: 2, next: None, prev: Some(a) });
a.next = Some(b);`, outcome: 'Error: a was moved into b', ok: false, errorCode: 'E0382' },
    text: `Every middle node is pointed to twice, but a <code>Box</code> has exactly one owner. Safe Rust offers <code>Rc&lt;RefCell&lt;Node&gt;&gt;</code> or, simpler, indices into a <code>Vec</code> (an arena).`,
  },
  refresher: [
    `An index is just a number: storing <code>Option&lt;usize&gt;</code> for <code>prev</code> and <code>next</code> creates no ownership, so a node can be linked from both sides.`,
    `<code>match self.tail { Some(t) =&gt; ..., None =&gt; ... }</code> separates "append after an existing tail" from "first node".`,
  ],
  hints: [
    `The new node's index is <code>self.nodes.len()</code> before you push it. Its <code>prev</code> is the old <code>self.tail</code>.`,
    `If there was a tail, set that node's <code>next</code> to the new index. If not, the new node is also the <code>head</code>.`,
    `Finally set <code>self.tail</code> to the new index.`,
  ],
  starter: `struct DNode {
    val: i32,
    prev: Option<usize>,
    next: Option<usize>,
}

struct DList {
    nodes: Vec<DNode>,
    head: Option<usize>,
    tail: Option<usize>,
}

impl DList {
    fn new() -> Self {
        DList { nodes: Vec::new(), head: None, tail: None }
    }
    fn push_back(&mut self, val: i32) {}
    fn forward(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = self.head;
        while let Some(i) = cur {
            out.push(self.nodes[i].val);
            cur = self.nodes[i].next;
        }
        out
    }
    fn backward(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = self.tail;
        while let Some(i) = cur {
            out.push(self.nodes[i].val);
            cur = self.nodes[i].prev;
        }
        out
    }
}`,
  solution: `struct DNode {
    val: i32,
    prev: Option<usize>,
    next: Option<usize>,
}

struct DList {
    nodes: Vec<DNode>,
    head: Option<usize>,
    tail: Option<usize>,
}

impl DList {
    fn new() -> Self {
        DList { nodes: Vec::new(), head: None, tail: None }
    }
    fn push_back(&mut self, val: i32) {
        let id = self.nodes.len();
        self.nodes.push(DNode { val, prev: self.tail, next: None });
        match self.tail {
            Some(t) => self.nodes[t].next = Some(id),
            None => self.head = Some(id),
        }
        self.tail = Some(id);
    }
    fn forward(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = self.head;
        while let Some(i) = cur {
            out.push(self.nodes[i].val);
            cur = self.nodes[i].next;
        }
        out
    }
    fn backward(&self) -> Vec<i32> {
        let mut out = Vec::new();
        let mut cur = self.tail;
        while let Some(i) = cur {
            out.push(self.nodes[i].val);
            cur = self.nodes[i].prev;
        }
        out
    }
}`,
  harness: `fn main() {
    println!("\\n@@TEST 1@@");
    let mut l = DList::new();
    for x in [1, 2, 3] {
        l.push_back(x);
    }
    println!("{:?} {:?}", l.forward(), l.backward());

    println!("\\n@@TEST 2@@");
    let l = DList::new();
    println!("{:?} {:?}", l.forward(), l.backward());

    println!("\\n@@TEST 3@@");
    let mut l = DList::new();
    l.push_back(7);
    println!("{:?} {:?}", l.forward(), l.backward());

    println!("\\n@@TEST 4@@");
    let mut l = DList::new();
    for x in [5, 5, 6] {
        l.push_back(x);
    }
    println!("{:?} {:?}", l.forward(), l.backward());

    println!("\\n@@TEST 5@@");
    let mut l = DList::new();
    for x in 0..1000 {
        l.push_back(x);
    }
    let fwd: Vec<i32> = (0..1000).collect();
    let back: Vec<i32> = (0..1000).rev().collect();
    println!("{}", if l.forward() == fwd && l.backward() == back { "ok" } else { "wrong" });
}`,
  tests: [
    { name: 'Three items', input: 'push_back 1 2 3', expected: '[1, 2, 3] [3, 2, 1]' },
    { name: 'Empty list', input: '(empty)', expected: '[] []' },
    { name: 'One item', input: 'push_back 7', expected: '[7] [7]' },
    { name: 'Duplicates', input: 'push_back 5 5 6', expected: '[5, 5, 6] [6, 5, 5]' },
    { name: 'Growth', input: '1 000 items', expected: 'ok' },
  ],
}

export const LESSONS = [
  stack, circularQueue, minHeap, bucketIndex, hashMap, listShape, linkedList, reverseList,
  bstRead, bstBasic, fixMoveOut, popMin, bstDelete, trie, graphAdj, graphBfs, graphDfs, unionFind, dlist,
]
