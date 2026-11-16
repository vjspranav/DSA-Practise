// Rust lessons: stage 7 part B, algorithms (shortest paths, spanning trees, dynamic programming).
// Contract and examples: docs/superpowers/specs/2026-11-15-rust-track-design.md (see "Authoring notes" and
// "Teaching fields and the taught-before-used rule" at the end). Check with: node scripts/verify-rust.mjs --stage 7
// Ids must start with r7- and be unique across the track. Every lesson teaches the algorithm idea with a worked trace,
// the complexity, and the Rust shape of the solution (`teach`), lists the syntax ids it introduces, then keeps the old
// harness and tests (including the large verified cases).

export const LESSONS = [
  {
    id: 'r7-topological-sort',
    title: 'Topological sort',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>A <strong>topological order</strong> lists the nodes of a directed graph so that every edge <code>a&rarr;b</code> has <code>a</code> before <code>b</code>: build steps, course prerequisites, anything with "this must come first". It exists exactly when there is no cycle. <strong>Kahn's algorithm</strong> builds it with a queue and one counter per node, its <em>in-degree</em> (how many edges point into it). A node with in-degree 0 has nothing it must wait for, so it can go next. Put every such node in the queue. Repeatedly take one out, append it to the order, and "remove" its outgoing edges by decreasing each neighbour's in-degree; a neighbour that reaches 0 joins the queue.</p>`,
        `<p>Trace for 0&rarr;1, 0&rarr;2, 1&rarr;3, 2&rarr;3. In-degrees: 0:0, 1:1, 2:1, 3:2. Queue: 0. Take 0: node 1 drops to 0 (queue it), node 2 drops to 0 (queue it). Take 1: node 3 drops to 1. Take 2: node 3 drops to 0 (queue it). Take 3. Order: 0 1 2 3. <strong>Cycle detection comes free</strong>: nodes on a cycle never reach in-degree 0, so they never leave the waiting state and the order ends up shorter than n. The exercise asks for an empty <code>Vec</code> in that case. Cost: O(n + e). Unlike the recursive cycle detector, it is a loop, so a huge chain cannot overflow the stack.</p>`,
        `<p>The Rust shape. Build <code>adj</code> and <code>indeg: Vec&lt;usize&gt;</code> in one pass over the edges (<code>indeg[b] += 1</code>). Seed the queue with an iterator chain: <code>(0..n).filter(|&amp;u| indeg[u] == 0).collect()</code> into a <code>VecDeque&lt;usize&gt;</code> (the type annotation tells <code>collect</code> what to build). Then the usual <code>while let Some(u) = queue.pop_front()</code>. The subtraction <code>indeg[v] -= 1</code> cannot underflow because the edge into <code>v</code> exists and was counted. At the end, a <em>conditional expression</em> chooses what to return: <code>if order.len() == n { order } else { Vec::new() }</code>. Note it moves <code>order</code> out as the result.</p>`,
      ],
      examples: [
        {
          code: `use std::collections::VecDeque;

fn main() {
    let n = 4;
    let edges = [(0, 1), (0, 2), (1, 3), (2, 3)];
    let mut adj = vec![Vec::new(); n];
    let mut indeg = vec![0; n];
    for &(a, b) in &edges {
        adj[a].push(b);
        indeg[b] += 1;                       // one more thing b must wait for
    }
    println!("in-degrees {:?}", indeg);

    let mut queue: VecDeque<usize> = (0..n).filter(|&u| indeg[u] == 0).collect();
    let mut order = Vec::new();
    while let Some(u) = queue.pop_front() {
        order.push(u);
        for &v in &adj[u] {
            indeg[v] -= 1;                   // u is done, so v waits for one less thing
            if indeg[v] == 0 {
                queue.push_back(v);
            }
        }
        println!("took {}, in-degrees now {:?}", u, indeg);
    }
    println!("order {:?}", order);
}`,
          output: `in-degrees [0, 1, 1, 2]
took 0, in-degrees now [0, 0, 0, 2]
took 1, in-degrees now [0, 0, 0, 1]
took 2, in-degrees now [0, 0, 0, 0]
took 3, in-degrees now [0, 0, 0, 0]
order [0, 1, 2, 3]`,
        },
      ],
      terms: [
        { code: 'indeg[b] += 1', meaning: 'counts the edges pointing into b' },
        {
          code: '(0..n).filter(|&u| indeg[u] == 0).collect()',
          meaning: 'all nodes with nothing to wait for, gathered into the queue',
        },
        {
          code: 'indeg[v] -= 1; if indeg[v] == 0 { ... }',
          meaning: 'a node joins the queue when its last prerequisite is taken',
        },
        { code: 'if order.len() == n { order } else { Vec::new() }', meaning: 'a short order means a cycle blocked some nodes' },
      ],
    },
    task: `Write <code>topo_sort</code>: given <code>n</code> nodes and directed edges <code>(from, to)</code>, return an order in which every edge goes left to right. Return an empty <code>Vec</code> if the graph has a cycle.`,
    refresher: [
      `Kahn's algorithm: count in-degrees, queue every node with in-degree 0, and when a node leaves the queue lower its neighbours' counts, queueing those that reach 0.`,
      `If fewer than <code>n</code> nodes were output, the rest sit on or behind a cycle. Any valid order is accepted.`,
    ],
    hints: [
      'Build neighbour lists and a count of incoming edges per node in one pass over the edges.',
      `Start the queue with every node whose count is 0. Each time you take one out, add it to the order and lower the count of every node it points to.`,
      `A node whose count hits 0 joins the queue. If the finished order has fewer than <code>n</code> nodes, a cycle blocked the rest.`,
    ],
    inCpp: {
      code: `vector<int> topo(int n, const vector<pair<int,int>>& edges) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0), order;
    for (auto [a, b] : edges) { adj[a].push_back(b); indeg[b]++; }
    queue<int> q;
    for (int u = 0; u < n; u++) if (indeg[u] == 0) q.push(u);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    if ((int)order.size() != n) order.clear();
    return order;
}`,
      note: `The same algorithm. In Rust the queue can be built straight from an iterator (<code>(0..n).filter(..).collect()</code>), and <code>indeg[v] -= 1</code> on a <code>usize</code> that is already 0 panics in a debug build, which flags a counting bug.`,
    },
    starter: `// Nodes are 0..n. Return an order of all nodes, or an empty Vec when there is a cycle.
fn topo_sort(n: usize, edges: &[(usize, usize)]) -> Vec<usize> {
    Vec::new()
}`,
    solution: `use std::collections::VecDeque;

fn topo_sort(n: usize, edges: &[(usize, usize)]) -> Vec<usize> {
    let mut adj = vec![Vec::new(); n];
    let mut indeg: Vec<usize> = vec![0; n];
    for &(a, b) in edges {
        adj[a].push(b);
        indeg[b] += 1;
    }
    let mut queue: VecDeque<usize> = (0..n).filter(|&u| indeg[u] == 0).collect();
    let mut order = Vec::with_capacity(n);
    while let Some(u) = queue.pop_front() {
        order.push(u);
        for &v in &adj[u] {
            indeg[v] -= 1;
            if indeg[v] == 0 {
                queue.push_back(v);
            }
        }
    }
    if order.len() == n {
        order
    } else {
        Vec::new()
    }
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn harness_judge(n: usize, edges: &[(usize, usize)]) {
    let order = topo_sort(n, edges);
    if order.is_empty() && n > 0 {
        println!("empty");
        return;
    }
    let mut pos = vec![usize::MAX; n];
    for (i, &u) in order.iter().enumerate() {
        if u >= n || pos[u] != usize::MAX {
            println!("invalid");
            return;
        }
        pos[u] = i;
    }
    if order.len() != n || edges.iter().any(|&(a, b)| pos[a] >= pos[b]) {
        println!("invalid");
    } else {
        println!("valid");
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    harness_judge(4, &[(0, 1), (0, 2), (1, 3), (2, 3)]);
    println!("\\n@@TEST 2@@");
    harness_judge(0, &[]);
    println!("\\n@@TEST 3@@");
    harness_judge(1, &[]);
    println!("\\n@@TEST 4@@");
    harness_judge(3, &[(0, 1), (1, 2), (2, 0)]);
    println!("\\n@@TEST 5@@");
    harness_judge(2, &[(0, 0)]);
    println!("\\n@@TEST 6@@");
    harness_judge(5, &[(3, 1), (4, 0)]);
    println!("\\n@@TEST 7@@");
    harness_judge(5, &[(0, 1), (1, 2), (2, 1), (3, 4)]);
    let n = 100_000;
    let mut rng = HarnessRng(77);
    let mut label: Vec<usize> = (0..n).collect();
    for i in (1..n).rev() {
        let j = rng.next() as usize % (i + 1);
        label.swap(i, j);
    }
    let mut edges = Vec::new();
    for i in 0..n - 1 {
        edges.push((label[i], label[i + 1]));
    }
    for _ in 0..200_000 {
        let a = rng.next() as usize % n;
        let b = rng.next() as usize % n;
        if a != b {
            edges.push((label[a.min(b)], label[a.max(b)]));
        }
    }
    println!("\\n@@TEST 8@@");
    harness_judge(n, &edges);
    edges.push((label[n - 1], label[0]));
    println!("\\n@@TEST 9@@");
    harness_judge(n, &edges);
}`,
    tests: [
      { name: 'Diamond', input: '0->1, 0->2, 1->3, 2->3', expected: 'valid' },
      { name: 'No nodes', input: 'n = 0', expected: 'valid' },
      { name: 'One node', input: 'n = 1', expected: 'valid' },
      { name: 'Triangle cycle', input: '0->1->2->0', expected: 'empty' },
      { name: 'Self-loop', input: 'n = 2, edge 0->0', expected: 'empty' },
      { name: 'Disconnected', input: 'n = 5, edges 3->1 and 4->0', expected: 'valid' },
      { name: 'Cycle next to a DAG part', input: 'n = 5, 1->2->1 and 3->4', expected: 'empty' },
      { name: 'Large DAG', input: '100 000 nodes, about 300 000 edges', expected: 'valid' },
      { name: 'Large with a cycle', input: 'same graph plus one back edge', expected: 'empty' },
    ],
  },

  {
    id: 'r7-dijkstra',
    title: 'Dijkstra',
    kind: 'implement',
    introduces: ['binaryheap'],
    teach: {
      body: [
        `<p>BFS finds shortest paths when every edge costs 1. When edges have different <em>non-negative</em> weights, use <strong>Dijkstra's algorithm</strong>: always settle the unsettled node that is closest to the source. Keep <code>dist[v]</code>, the best known distance to each node (start at "infinity", with <code>dist[src] = 0</code>), and a min-heap of <code>(distance, node)</code> candidates. Pop the smallest candidate <code>(d, u)</code>. Since all weights are non-negative, nothing found later can beat it, so <code>d</code> is final for <code>u</code>. Then try each edge <code>u&rarr;v</code> of weight <code>w</code>: if <code>d + w</code> beats <code>dist[v]</code>, record it and push the new candidate.</p>`,
        `<p>A heap cannot lower a key already inside it, so Dijkstra just pushes a better candidate and leaves the old one. The old one is now <em>stale</em>: when it is eventually popped, <code>d &gt; dist[u]</code>, and you <code>continue</code> to skip it. Trace for edges 0&rarr;1 (4), 0&rarr;2 (1), 2&rarr;1 (2), 1&rarr;3 (1), 2&rarr;3 (5). Pop (0, node 0): push (4, 1) and (1, 2). Pop (1, node 2): dist[1] improves 4 to 3 (push (3, 1)); node 3 gets 6 (push (6, 3)). Pop (3, node 1): node 3 improves 6 to 4 (push (4, 3)). Pop (4, node 1): stale (4 &gt; 3), skip. Pop (4, node 3): final. Pop (6, node 3): stale. Distances 0, 3, 1, 4. Cost: O((n + e) log n), and it is wrong with negative weights (the next lesson handles those).</p>`,
        `<p>The Rust shape. Rust's <code>BinaryHeap</code> is a <em>max</em>-heap, so wrap the entries in <code>Reverse</code> to flip it into a min-heap: <code>BinaryHeap&lt;Reverse&lt;(u64, usize)&gt;&gt;</code>. The tuple compares distance first, then node. Push with <code>heap.push(Reverse((d, v)))</code> and pop with <code>while let Some(Reverse((d, u))) = heap.pop()</code>, the pattern taking the wrapper and tuple apart in one go. Build <code>adj</code> as <code>Vec&lt;Vec&lt;(usize, u64)&gt;&gt;</code> (neighbour and weight). For "infinity" use <code>u64::MAX</code> in <code>dist</code>; since a popped <code>d</code> is always real, <code>d + w</code> cannot overflow. The result must be <code>Vec&lt;Option&lt;u64&gt;&gt;</code> with <code>None</code> for unreachable, so finish by mapping: <code>dist.iter().map(|&amp;d| if d == u64::MAX { None } else { Some(d) }).collect()</code>. Distances are <code>u64</code>: weights are non-negative, and a long path overflows <code>u32</code>.</p>`,
      ],
      examples: [
        {
          code: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn main() {
    let mut heap = BinaryHeap::new();
    heap.push(Reverse((7, 1)));              // (distance, node)
    heap.push(Reverse((3, 2)));
    heap.push(Reverse((5, 0)));
    while let Some(Reverse((d, node))) = heap.pop() {
        println!("distance {} node {}", d, node);   // smallest distance first
    }
}`,
          output: `distance 3 node 2
distance 5 node 0
distance 7 node 1`,
          caption: 'Reverse turns the max-heap into a min-heap.',
        },
        {
          code: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn main() {
    let edges = [(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)];
    let mut adj = vec![Vec::new(); 4];
    for &(a, b, w) in &edges {
        adj[a].push((b, w));
    }
    let mut dist = vec![u64::MAX; 4];        // "infinity" until reached
    let mut heap = BinaryHeap::new();
    dist[0] = 0;
    heap.push(Reverse((0, 0)));
    while let Some(Reverse((d, u))) = heap.pop() {
        if d > dist[u] {
            println!("skip stale ({}, node {})", d, u);
            continue;
        }
        println!("settle node {} at {}", u, d);
        for &(v, w) in &adj[u] {
            if d + w < dist[v] {
                dist[v] = d + w;
                heap.push(Reverse((d + w, v)));
            }
        }
    }
    println!("{:?}", dist);
}`,
          output: `settle node 0 at 0
settle node 2 at 1
settle node 1 at 3
skip stale (4, node 1)
settle node 3 at 4
skip stale (6, node 3)
[0, 3, 1, 4]`,
          caption: 'The same trace as in the text. Stale entries are skipped when they surface.',
        },
      ],
      terms: [
        { code: 'BinaryHeap<Reverse<(u64, usize)>>', meaning: 'a min-heap of (distance, node)' },
        {
          code: 'while let Some(Reverse((d, u))) = heap.pop()',
          meaning: 'takes the closest candidate; the pattern unwraps Reverse and the tuple',
        },
        {
          code: 'if d > dist[u] { continue; }',
          meaning: 'skips a stale entry that a better one already replaced',
        },
        { code: 'vec![u64::MAX; n]', meaning: '"infinity" for every node until it is reached' },
        {
          code: 'dist.iter().map(|&d| if d == u64::MAX { None } else { Some(d) }).collect()',
          meaning: 'turns the sentinel into Option<u64>',
        },
      ],
    },
    task: `Write <code>dijkstra</code>: shortest distances from <code>src</code> in a directed graph with non-negative weights. Return a <code>Vec&lt;Option&lt;u64&gt;&gt;</code> where <code>None</code> means unreachable.`,
    refresher: [
      `<code>BinaryHeap</code> is a max-heap. Push <code>Reverse((dist, node))</code> to pop the smallest distance first, and match it with <code>Reverse((d, u))</code>.`,
      `A node can be pushed several times. When you pop <code>(d, u)</code> with <code>d</code> larger than the best known distance of <code>u</code>, skip it.`,
    ],
    hints: [
      `Build neighbour lists that hold <code>(neighbour, weight)</code>. Keep a distance per node that starts at <code>u64::MAX</code>, except the source at 0.`,
      `Use a heap wrapped in <code>Reverse</code> so the smallest <code>(distance, node)</code> pops first. When a popped distance is larger than the node's recorded one, skip it.`,
      `Relax each outgoing edge: a better total updates the distance and pushes a new candidate. At the end, map unreached nodes to <code>None</code>.`,
    ],
    inCpp: {
      code: `void setup(int n, int src) {
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    pq.push({0, src});
    vector<long long> dist(n, LLONG_MAX);   // sentinel for "unreachable"
    // dist[u] + w can overflow when dist[u] is the sentinel
}`,
      note: `C++ flips the heap with <code>greater&lt;&gt;</code> and needs a sentinel like <code>LLONG_MAX</code> that overflows if you add to it. Rust flips it with the <code>Reverse</code> wrapper, and <code>Option&lt;u64&gt;</code> makes "unreachable" a value that cannot be added to by accident.`,
    },
    starter: `// Directed edges are (from, to, weight). Return the distance to every node, None if unreachable.
fn dijkstra(n: usize, edges: &[(usize, usize, u64)], src: usize) -> Vec<Option<u64>> {
    vec![None; n]
}`,
    solution: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

fn dijkstra(n: usize, edges: &[(usize, usize, u64)], src: usize) -> Vec<Option<u64>> {
    let mut adj = vec![Vec::new(); n];
    for &(a, b, w) in edges {
        adj[a].push((b, w));
    }
    let mut dist = vec![u64::MAX; n];
    let mut heap = BinaryHeap::new();
    dist[src] = 0;
    heap.push(Reverse((0, src)));
    while let Some(Reverse((d, u))) = heap.pop() {
        if d > dist[u] {
            continue;
        }
        for &(v, w) in &adj[u] {
            let nd = d + w;
            if nd < dist[v] {
                dist[v] = nd;
                heap.push(Reverse((nd, v)));
            }
        }
    }
    dist.iter().map(|&d| if d == u64::MAX { None } else { Some(d) }).collect()
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn harness_show(v: &[Option<u64>]) -> String {
    let parts: Vec<String> = v
        .iter()
        .map(|d| match d {
            Some(x) => x.to_string(),
            None => "-".to_string(),
        })
        .collect();
    parts.join(" ")
}

fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", harness_show(&dijkstra(5, &[(0, 1, 4), (0, 2, 1), (2, 1, 2), (1, 3, 1), (2, 3, 5)], 0)));
    println!("\\n@@TEST 2@@");
    println!("{}", harness_show(&dijkstra(1, &[], 0)));
    println!("\\n@@TEST 3@@");
    println!("{}", harness_show(&dijkstra(4, &[(0, 1, 1), (2, 3, 1)], 0)));
    println!("\\n@@TEST 4@@");
    println!("{}", harness_show(&dijkstra(3, &[(0, 1, 5), (0, 1, 2), (1, 2, 0)], 0)));
    println!("\\n@@TEST 5@@");
    println!("{}", harness_show(&dijkstra(3, &[(1, 0, 1), (1, 2, 1)], 0)));
    println!("\\n@@TEST 6@@");
    println!("{}", harness_show(&dijkstra(4, &[(0, 1, 10), (0, 2, 1), (2, 1, 1), (1, 3, 1)], 0)));
    println!("\\n@@TEST 7@@");
    let n = 100_000;
    let mut rng = HarnessRng(101);
    let mut edges = Vec::new();
    for _ in 0..400_000 {
        let u = rng.next() as usize % n;
        let v = rng.next() as usize % n;
        let w = rng.next() % 1000;
        edges.push((u, v, w));
    }
    let d = dijkstra(n, &edges, 0);
    let reach: Vec<u64> = d.iter().filter_map(|x| *x).collect();
    println!("{} {} {}", reach.len(), reach.iter().sum::<u64>(), reach.iter().max().unwrap());
}`,
    tests: [
      { name: 'Example', input: '5 nodes, 5 edges, node 4 unreachable', expected: '0 3 1 4 -' },
      { name: 'One node', input: 'n = 1', expected: '0' },
      { name: 'Unreachable nodes', input: '0->1 and 2->3 only', expected: '0 1 - -' },
      { name: 'Parallel and zero-weight edges', input: '0->1 (5 and 2), 1->2 (0)', expected: '0 2 2' },
      { name: 'Edges are directed', input: '1->0, 1->2, source 0', expected: '0 - -' },
      { name: 'Stale heap entries', input: 'direct edge 10, detour 2', expected: '0 2 1 3' },
      { name: 'Large', input: '100 000 nodes, 400 000 edges', expected: '97999 257798552 5613' },
    ],
  },

  {
    id: 'r7-bellman-ford',
    title: 'Bellman-Ford',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>Dijkstra breaks when an edge weight is negative: a node settled early could later be improved through a negative edge. <strong>Bellman-Ford</strong> drops the cleverness. <em>Relax</em> every edge (if <code>dist[a] + w &lt; dist[b]</code>, lower <code>dist[b]</code>), and repeat. After round k, every node whose shortest path uses at most k edges has its correct distance. A shortest path never needs more than n - 1 edges (no repeated nodes), so n - 1 rounds suffice. If a round improves something <em>again</em> after that, a negative cycle exists: going around it forever makes distances arbitrarily small. Cost: O(n &middot; e), slower than Dijkstra, but it handles negative edges and detects negative cycles. It can also stop early: a round with no change means the distances are final.</p>`,
        `<p>Trace for the chain 0&rarr;1, 1&rarr;2, 2&rarr;3 (all weight 1) with the edges listed <em>backwards</em>. Round 1: edge 2&rarr;3 and 1&rarr;2 find their source unreached, so they do nothing; edge 0&rarr;1 sets dist[1] = 1. Round 2: only 1&rarr;2 improves, to 2. Round 3: 2&rarr;3 improves to 3. Round 4: nothing changes, done. Listing order only affects how many rounds are needed, never the answer. For negative cycles: with 1&rarr;2 (-3) and 2&rarr;1 (1) the loop 1, 2, 1 lowers distances by 2 every time around, so the n-th round still changes something, and the function reports it. A negative cycle that the source cannot reach never gets touched (its nodes stay unreached), which is why the exercise says "reachable from src".</p>`,
        `<p>The Rust shape. Distances are signed, so <code>i64</code>, with <code>i64::MAX</code> as "unreached". Guard the relaxation so you never add to the sentinel: <code>if dist[a] != i64::MAX &amp;&amp; dist[a] + w &lt; dist[b]</code>. The outer loop is <code>for _ in 0..n</code> (the <code>_</code> says the loop counter is unused), with a <code>changed</code> flag: if a whole round changes nothing, return <code>Some(...)</code> right away; if all n rounds changed something, fall out of the loop and return <code>None</code> for "negative cycle". The function returns <code>Option&lt;Vec&lt;Option&lt;i64&gt;&gt;&gt;</code>: the outer option is "no negative cycle", the inner options are "reachable", which is why the finishing map turns the sentinel into <code>None</code> as in the Dijkstra lesson.</p>`,
      ],
      examples: [
        {
          code: `fn show(dist: &[i64]) -> String {
    let parts: Vec<String> = dist
        .iter()
        .map(|&d| if d == i64::MAX { "-".to_string() } else { d.to_string() })
        .collect();
    parts.join(" ")
}

fn main() {
    let edges = [(2, 3, 1), (1, 2, 1), (0, 1, 1)];      // a chain, listed backwards
    let mut dist = vec![i64::MAX; 4];                    // i64::MAX means "unreached"
    dist[0] = 0;
    for round in 1..=4 {
        let mut changed = false;
        for &(a, b, w) in &edges {
            if dist[a] != i64::MAX && dist[a] + w < dist[b] {
                dist[b] = dist[a] + w;
                changed = true;
            }
        }
        println!("round {}: {}", round, show(&dist));
        if !changed {
            break;
        }
    }
}`,
          output: `round 1: 0 1 - -
round 2: 0 1 2 -
round 3: 0 1 2 3
round 4: 0 1 2 3`,
          caption: 'One more edge becomes correct each round; the last round changes nothing.',
        },
      ],
      terms: [
        {
          code: 'dist[a] != i64::MAX && dist[a] + w < dist[b]',
          meaning: 'relax an edge, never adding to the "unreached" sentinel',
        },
        { code: 'for _ in 0..n', meaning: 'repeat n times; the loop variable is not needed' },
        {
          code: 'changed',
          meaning: 'a flag: a round that changes nothing means the answer is final',
        },
        {
          code: 'Option<Vec<Option<i64>>>',
          meaning: 'None = negative cycle; Some(list) with None inside = unreachable nodes',
        },
      ],
    },
    task: `Write <code>bellman_ford</code>: shortest distances from <code>src</code> with edge weights that may be negative. Return <code>None</code> if a negative cycle is reachable from <code>src</code>; otherwise <code>Some</code> of the distances, with <code>None</code> for unreachable nodes.`,
    refresher: [
      `Relax every edge, repeat up to <code>n</code> passes. A pass with no change means done. A change on pass <code>n</code> means a reachable negative cycle.`,
      `Only relax from nodes with a known distance: <code>if let Some(da) = dist[a]</code>. A negative cycle that <code>src</code> cannot reach does not matter.`,
    ],
    hints: [
      'Keep a signed distance per node, with a huge value meaning "unreached", and start the source at 0.',
      `One round tries every edge: skip edges whose start is unreached, and lower the end node when the path through the edge is shorter.`,
      `If a round changes nothing, return the finished distances. If you use up all <code>n</code> rounds and the last one still changed something, return <code>None</code>.`,
    ],
    inCpp: {
      code: `void relax(int n, int src, const vector<tuple<int,int,long long>>& edges) {
    const long long INF = LLONG_MAX;
    vector<long long> dist(n, INF);
    dist[src] = 0;
    for (auto& [a, b, w] : edges)
        if (dist[a] != INF && dist[a] + w < dist[b])   // forget the INF test: overflow
            dist[b] = dist[a] + w;
}`,
      note: `With a sentinel, the <code>dist[a] != INF</code> check is easy to forget, and then <code>INF + w</code> overflows or, with <code>INF/2</code> tricks, quietly produces wrong distances. <code>Option&lt;i64&gt;</code> plus <code>if let Some(da)</code> makes the check part of the syntax.`,
    },
    starter: `// Edges are (from, to, weight), weights may be negative.
// None = negative cycle reachable from src; otherwise Some(distances), None inside = unreachable.
fn bellman_ford(n: usize, edges: &[(usize, usize, i64)], src: usize) -> Option<Vec<Option<i64>>> {
    None
}`,
    solution: `fn bellman_ford(n: usize, edges: &[(usize, usize, i64)], src: usize) -> Option<Vec<Option<i64>>> {
    let mut dist = vec![i64::MAX; n];
    dist[src] = 0;
    for _ in 0..n {
        let mut changed = false;
        for &(a, b, w) in edges {
            if dist[a] != i64::MAX && dist[a] + w < dist[b] {
                dist[b] = dist[a] + w;
                changed = true;
            }
        }
        if !changed {
            return Some(dist.iter().map(|&d| if d == i64::MAX { None } else { Some(d) }).collect());
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

fn harness_show(r: Option<Vec<Option<i64>>>) -> String {
    match r {
        None => "negative cycle".to_string(),
        Some(v) => {
            let parts: Vec<String> = v
                .iter()
                .map(|d| match d {
                    Some(x) => x.to_string(),
                    None => "-".to_string(),
                })
                .collect();
            parts.join(" ")
        }
    }
}

fn harness_summary(r: Option<Vec<Option<i64>>>) -> String {
    match r {
        None => "negative cycle".to_string(),
        Some(v) => {
            let reach: Vec<i64> = v.iter().filter_map(|x| *x).collect();
            format!("{} {} {}", reach.len(), reach.iter().sum::<i64>(), reach.iter().min().unwrap())
        }
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    let e = [(0, 1, 6), (0, 2, 7), (1, 2, 8), (1, 3, 5), (1, 4, -4), (2, 3, -3), (2, 4, 9), (3, 1, -2), (4, 3, 7), (4, 0, 2)];
    println!("{}", harness_show(bellman_ford(5, &e, 0)));
    println!("\\n@@TEST 2@@");
    println!("{}", harness_show(bellman_ford(1, &[], 0)));
    println!("\\n@@TEST 3@@");
    println!("{}", harness_show(bellman_ford(3, &[(0, 1, 1), (1, 2, -3), (2, 1, 1)], 0)));
    println!("\\n@@TEST 4@@");
    println!("{}", harness_show(bellman_ford(4, &[(0, 1, 5), (2, 3, -1), (3, 2, -1)], 0)));
    println!("\\n@@TEST 5@@");
    println!("{}", harness_show(bellman_ford(3, &[(0, 1, -2)], 0)));
    println!("\\n@@TEST 6@@");
    println!("{}", harness_show(bellman_ford(4, &[(2, 3, 1), (1, 2, 1), (0, 1, 1)], 0)));
    println!("\\n@@TEST 7@@");
    println!("{}", harness_show(bellman_ford(1, &[(0, 0, -1)], 0)));
    let n = 1500;
    let mut rng = HarnessRng(202);
    let p: Vec<i64> = (0..n).map(|_| (rng.next() % 100) as i64).collect();
    let mut edges: Vec<(usize, usize, i64)> = Vec::new();
    for i in 0..n - 1 {
        let w = (rng.next() % 100) as i64;
        edges.push((i, i + 1, w + p[i] - p[i + 1]));
    }
    for _ in 0..7500 {
        let u = rng.next() as usize % n;
        let v = rng.next() as usize % n;
        let w = (rng.next() % 100) as i64;
        edges.push((u, v, w + p[u] - p[v]));
    }
    println!("\\n@@TEST 8@@");
    println!("{}", harness_summary(bellman_ford(n, &edges, 0)));
    edges.push((1, 0, -100_000));
    println!("\\n@@TEST 9@@");
    println!("{}", harness_summary(bellman_ford(n, &edges, 0)));
}`,
    tests: [
      { name: 'Textbook example', input: '5 nodes, negative edges, no negative cycle', expected: '0 2 7 4 -2' },
      { name: 'One node', input: 'n = 1', expected: '0' },
      { name: 'Reachable negative cycle', input: '1->2 (-3), 2->1 (1)', expected: 'negative cycle' },
      { name: 'Unreachable negative cycle', input: 'cycle 2<->3, source 0', expected: '0 5 - -' },
      { name: 'Negative edge, unreachable node', input: '0->1 (-2), node 2 isolated', expected: '0 -2 -' },
      { name: 'Edges listed in reverse', input: 'chain 0->1->2->3 listed backwards', expected: '0 1 2 3' },
      { name: 'Negative self-loop', input: 'n = 1, edge 0->0 (-1)', expected: 'negative cycle' },
      { name: 'Large, no negative cycle', input: '1500 nodes, 9000 edges, many negative', expected: '1500 175298 -1' },
      { name: 'Large with a negative cycle', input: 'same graph plus 1->0 (-100000)', expected: 'negative cycle' },
    ],
  },

  {
    id: 'r7-kruskal',
    title: 'Kruskal',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>A <strong>minimum spanning tree</strong> connects all nodes of an undirected graph with the cheapest set of edges (n - 1 edges, no cycles). <strong>Kruskal's algorithm</strong> is greedy: sort the edges by weight, then go through them cheapest first and take an edge unless it joins two nodes that are already connected (taking it would make a cycle). "Are these two already connected?" is exactly what union-find from stage 5 answers: give every node a <code>parent</code> link, <code>find</code> follows links to the group's root, and taking an edge <em>unites</em> two groups by pointing one root at the other.</p>`,
        `<p>Trace for 4 nodes and edges 0-1 (1), 1-2 (2), 0-2 (3), 2-3 (4), 1-3 (5), already in weight order. Take 0-1: total 1. Take 1-2: total 3. Edge 0-2: 0 and 2 are already connected through 1, skip. Take 2-3: total 7. Now 3 edges are taken, n - 1, so the tree is complete (the edge 1-3 is skipped as well). If the graph is not connected, you end with fewer than n - 1 edges: there is no spanning tree, so return <code>None</code>. A graph with 0 or 1 nodes needs 0 edges and weighs 0. Cost: O(e log e) for the sort, and the union-find steps are nearly constant.</p>`,
        `<p>The Rust shape. A function cannot sort the borrowed input slice, so make a copy: <code>let mut sorted = edges.to_vec();</code> and <code>sorted.sort_by_key(|e| e.2)</code> (<code>e.2</code> is the third tuple field, the weight). The union-find is a <code>Vec&lt;usize&gt;</code> of parents, <code>let mut parent: Vec&lt;usize&gt; = (0..n).collect();</code> (each node starts as its own root), and <code>find(parent: &amp;mut [usize], x)</code> takes it by <code>&amp;mut</code> because path compression writes shortcuts into it while reading; that is why calling it needs <code>&amp;mut parent</code> even for a "query". Loop with <code>for (a, b, w) in sorted</code>, which moves each tuple out, find both roots, and if they differ, set <code>parent[ra] = rb</code> and add the weight. The answer is <code>Some(total)</code> when <code>used + 1 &gt;= n</code> (this also covers n = 0 and n = 1), else <code>None</code>. Weights are <code>u64</code>.</p>`,
      ],
      examples: [
        {
          code: `fn find(parent: &mut [usize], x: usize) -> usize {
    let mut root = x;
    while parent[root] != root {
        root = parent[root];
    }
    let mut cur = x;
    while parent[cur] != root {              // path compression: point everything at the root
        let next = parent[cur];
        parent[cur] = root;
        cur = next;
    }
    root
}

fn main() {
    let mut edges = vec![(1, 2, 2), (0, 1, 1), (2, 3, 4), (0, 2, 3), (1, 3, 5)];
    edges.sort_by_key(|e| e.2);              // cheapest first
    let mut parent: Vec<usize> = (0..4).collect();
    let mut total = 0;
    for (a, b, w) in edges {
        let ra = find(&mut parent, a);
        let rb = find(&mut parent, b);
        if ra == rb {
            println!("skip {}-{}: already connected", a, b);
        } else {
            parent[ra] = rb;                 // unite the two groups
            total += w;
            println!("take {}-{} (weight {})", a, b, w);
        }
    }
    println!("total {}", total);
}`,
          output: `take 0-1 (weight 1)
take 1-2 (weight 2)
skip 0-2: already connected
take 2-3 (weight 4)
skip 1-3: already connected
total 7`,
        },
      ],
      terms: [
        {
          code: 'edges.to_vec()',
          meaning: 'a copy you may sort, since the input is only borrowed',
        },
        { code: 'sorted.sort_by_key(|e| e.2)', meaning: 'cheapest edge first; e.2 is the weight field' },
        {
          code: 'find(&mut parent, a)',
          meaning: 'the root of a\'s group; needs &mut because it compresses paths',
        },
        { code: 'parent[ra] = rb', meaning: 'unites two groups' },
        {
          code: 'used + 1 >= n',
          meaning: 'n - 1 edges taken: a spanning tree (also true for n = 0 and 1)',
        },
      ],
    },
    task: `Write <code>kruskal</code>: the total weight of a minimum spanning tree of an undirected graph, or <code>None</code> if the graph is not connected. A graph with 0 or 1 nodes has weight 0.`,
    refresher: [
      `Sort edges by weight, then take an edge when its endpoints are in different union-find sets. Write the find and union inline.`,
      `<code>edges</code> is a shared slice, so it cannot be sorted in place. Copy with <code>to_vec()</code> and use <code>sort_by_key(|e| e.2)</code>.`,
    ],
    hints: [
      'Sort a copy of the edges by weight. Keep a parent table where every node starts as its own root.',
      `For each edge, find the root of both ends. Equal roots mean the edge would close a cycle, so skip it.`,
      `Otherwise point one root at the other, add the weight and count the edge. After the loop, only a graph with enough edges counted is connected.`,
    ],
    inCpp: {
      code: `void order(vector<tuple<int,int,long long>>& edges) {
    sort(edges.begin(), edges.end(), [](auto& x, auto& y) { return get<2>(x) < get<2>(y); });
    // sorts the caller's vector: it was passed by non-const reference
}`,
      note: `A C++ function can sort a vector it took by value without noticing the copy, or sort the caller's data by accident. Rust's <code>&amp;[T]</code> is read-only, so you must write <code>edges.to_vec()</code> and the copy is visible.`,
    },
    starter: `// Undirected edges are (a, b, weight). Return Some(total weight) or None if not connected.
fn kruskal(n: usize, edges: &[(usize, usize, u64)]) -> Option<u64> {
    None
}`,
    solution: `fn kruskal(n: usize, edges: &[(usize, usize, u64)]) -> Option<u64> {
    fn find(parent: &mut [usize], x: usize) -> usize {
        let mut root = x;
        while parent[root] != root {
            root = parent[root];
        }
        let mut cur = x;
        while parent[cur] != root {
            let next = parent[cur];
            parent[cur] = root;
            cur = next;
        }
        root
    }
    let mut sorted = edges.to_vec();
    sorted.sort_by_key(|e| e.2);
    let mut parent: Vec<usize> = (0..n).collect();
    let mut total = 0;
    let mut used = 0;
    for (a, b, w) in sorted {
        let ra = find(&mut parent, a);
        let rb = find(&mut parent, b);
        if ra != rb {
            parent[ra] = rb;
            total += w;
            used += 1;
        }
    }
    if used + 1 >= n {
        Some(total)
    } else {
        None
    }
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn harness_show(r: Option<u64>) -> String {
    match r {
        Some(w) => w.to_string(),
        None => "None".to_string(),
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", harness_show(kruskal(4, &[(0, 1, 1), (1, 2, 2), (0, 2, 3), (2, 3, 4), (1, 3, 5)])));
    println!("\\n@@TEST 2@@");
    println!("{}", harness_show(kruskal(0, &[])));
    println!("\\n@@TEST 3@@");
    println!("{}", harness_show(kruskal(1, &[])));
    println!("\\n@@TEST 4@@");
    println!("{}", harness_show(kruskal(4, &[(0, 1, 1), (2, 3, 1)])));
    println!("\\n@@TEST 5@@");
    println!("{}", harness_show(kruskal(3, &[(0, 1, 2), (1, 2, 2), (0, 2, 2)])));
    println!("\\n@@TEST 6@@");
    println!("{}", harness_show(kruskal(2, &[(0, 0, 1), (0, 1, 9), (0, 1, 3)])));
    println!("\\n@@TEST 7@@");
    println!("{}", harness_show(kruskal(2, &[])));
    println!("\\n@@TEST 8@@");
    let n = 50_000;
    let mut rng = HarnessRng(303);
    let mut edges = Vec::new();
    for i in 0..n - 1 {
        edges.push((i, i + 1, 1 + rng.next() % 1_000_000));
    }
    for _ in 0..200_000 {
        let u = rng.next() as usize % n;
        let v = rng.next() as usize % n;
        edges.push((u, v, 1 + rng.next() % 1_000_000));
    }
    println!("{}", harness_show(kruskal(n, &edges)));
}`,
    tests: [
      { name: 'Example', input: '4 nodes, 5 edges', expected: '7' },
      { name: 'No nodes', input: 'n = 0', expected: '0' },
      { name: 'One node', input: 'n = 1', expected: '0' },
      { name: 'Disconnected', input: '0-1 and 2-3 only', expected: 'None' },
      { name: 'Ties', input: 'triangle, all weights 2', expected: '4' },
      { name: 'Self-loop and parallel edges', input: 'n = 2, 0-0 (1), 0-1 (9 and 3)', expected: '3' },
      { name: 'Two nodes, no edge', input: 'n = 2', expected: 'None' },
      { name: 'Large', input: '50 000 nodes, 250 000 edges', expected: '5934098391' },
    ],
  },

  {
    id: 'r7-climbing-stairs',
    title: 'Climbing stairs',
    kind: 'implement',
    introduces: ['tuple-assign'],
    teach: {
      body: [
        `<p><strong>Dynamic programming</strong> (DP) solves a problem by writing the answer for size n in terms of answers for smaller sizes, and making sure each smaller answer is computed <em>once</em>. Climbing stairs: to stand on step n you came from step n - 1 (one step) or step n - 2 (two steps), so <code>ways(n) = ways(n - 1) + ways(n - 2)</code>, with <code>ways(0) = ways(1) = 1</code>. This is the Fibonacci recurrence. Written as plain recursion it is correct but slow: <code>ways(5)</code> calls <code>ways(4)</code> and <code>ways(3)</code>, and <code>ways(4)</code> calls <code>ways(3)</code> again, so the same work repeats exponentially. The fix is to go <em>bottom-up</em>: fill a table from small n upward, <code>ways[i] = ways[i - 1] + ways[i - 2]</code>, O(n).</p>`,
        `<p>Trace: <code>ways[0..6] = 1, 1, 2, 3, 5, 8, 13</code>. Since each entry looks only at the previous two, you do not need the table at all: keep just two variables, <code>a = ways(i)</code> and <code>b = ways(i + 1)</code>, and slide them forward. That is O(1) memory. (This "keep only the previous rows" trick appears again in LCS and edit distance.)</p>`,
        `<p>The Rust shape has two new tools. Sliding the pair forward is a <em>destructuring assignment</em>: <code>(a, b) = (b, a + b);</code> evaluates the right side first (using the old <code>a</code> and <code>b</code>), then assigns both, with no temporary variable. (It is an assignment to existing variables, so no <code>let</code>; both must be <code>mut</code>.) And a type annotation on a tuple pattern, <code>let (mut a, mut b): (u64, u64) = (1, 1);</code>, picks the integer type for both. The size matters: <code>ways(91)</code> is 7.5 &middot; 10<sup>18</sup>, which fits <code>u64</code> but not <code>u32</code> or <code>i32</code>, and a debug build panics on overflow rather than wrapping. The loop is <code>for _ in 0..n</code>, ignoring the counter.</p>`,
      ],
      examples: [
        {
          code: `// Plain recursion: correct, but it recomputes the same sizes over and over.
fn ways(n: u32, calls: &mut u32) -> u64 {
    *calls += 1;
    if n <= 1 {
        1
    } else {
        ways(n - 1, calls) + ways(n - 2, calls)
    }
}

fn main() {
    let mut calls = 0;
    let result = ways(20, &mut calls);
    println!("ways(20) = {} using {} calls", result, calls);
}`,
          output: 'ways(20) = 10946 using 21891 calls',
          caption: 'About 22 000 calls to compute 21 numbers.',
        },
        {
          code: `fn main() {
    let n = 6;
    let mut ways: Vec<u64> = vec![1, 1];            // ways[0], ways[1]
    for i in 2..=n {
        let next = ways[i - 1] + ways[i - 2];       // each entry looks at the two before it
        ways.push(next);
    }
    println!("{:?}", ways);
}`,
          output: '[1, 1, 2, 3, 5, 8, 13]',
          caption: 'Bottom-up: each size is computed exactly once.',
        },
        {
          code: `fn main() {
    let (mut a, mut b): (u64, u64) = (1, 1);        // a = ways(i), b = ways(i + 1)
    for _ in 0..6 {
        (a, b) = (b, a + b);                         // slide both forward at once
    }
    println!("{} {}", a, b);
}`,
          output: '13 21',
          caption: 'Two variables instead of a table. After 6 slides a is ways(6) = 13.',
        },
      ],
      terms: [
        {
          code: 'ways(n) = ways(n - 1) + ways(n - 2)',
          meaning: 'the recurrence: the last move was 1 step or 2 steps',
        },
        {
          code: '(a, b) = (b, a + b);',
          meaning: 'destructuring assignment: computes the right side first, then sets both variables',
        },
        { code: 'let (mut a, mut b): (u64, u64) = (1, 1);', meaning: 'two mutable variables at once, both u64' },
        { code: 'for _ in 0..n', meaning: 'repeat n times without using the counter' },
      ],
    },
    task: `Write <code>climb_stairs</code>: how many distinct ways can you climb <code>n</code> steps taking 1 or 2 at a time? There is one way to climb 0 steps.`,
    refresher: [
      `<code>ways(n) = ways(n - 1) + ways(n - 2)</code>, with <code>ways(0) = ways(1) = 1</code>. Keep only the last two values and loop.`,
      `The count grows like Fibonacci: for <code>n = 91</code> it is about 7.5e18, which fits <code>u64</code> but not <code>i64</code>. A debug build panics on overflow.`,
    ],
    hints: [
      `The count for a size depends only on the two sizes before it, so two variables are enough. Both sizes 0 and 1 have exactly one way.`,
      'Use <code>u64</code>: the answer for 91 steps is around 7.5e18, which overflows 32-bit types.',
      `Repeat <code>n</code> times: the new pair is the old second value and the sum of both. A destructuring assignment does that in one line.`,
    ],
    inCpp: {
      code: `unsigned long long climb(int n) {
    unsigned long long a = 1, b = 1;
    for (int i = 0; i < n; i++) {
        unsigned long long next = a + b;
        a = b; b = next;
    }
    return a;
}`,
      note: `C++ unsigned overflow wraps silently, so an undersized type gives a plausible wrong answer. In a Rust debug build the same mistake panics with "attempt to add with overflow" at the exact line.`,
    },
    starter: `// Number of ways to climb n steps, 1 or 2 at a time.
fn climb_stairs(n: u32) -> u64 {
    0
}`,
    solution: `fn climb_stairs(n: u32) -> u64 {
    let (mut a, mut b): (u64, u64) = (1, 1);
    for _ in 0..n {
        (a, b) = (b, a + b);
    }
    a
}`,
    harness: `fn main() {
    for (i, n) in [0u32, 1, 2, 3, 5, 45, 90, 91].iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", climb_stairs(*n));
    }
}`,
    tests: [
      { name: 'n = 0', input: 'n = 0', expected: '1' },
      { name: 'n = 1', input: 'n = 1', expected: '1' },
      { name: 'n = 2', input: 'n = 2', expected: '2' },
      { name: 'n = 3', input: 'n = 3', expected: '3' },
      { name: 'n = 5', input: 'n = 5', expected: '8' },
      { name: 'n = 45 (too slow for plain recursion)', input: 'n = 45', expected: '1836311903' },
      { name: 'n = 90', input: 'n = 90', expected: '4660046610375530309' },
      { name: 'n = 91 (needs u64)', input: 'n = 91', expected: '7540113804746346429' },
    ],
  },

  {
    id: 'r7-house-robber',
    title: 'House robber',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>Rob houses in a row, never two neighbours, maximising the total. The DP question: let <code>best(i)</code> be the best total using only the first i houses. For house i you either <em>skip</em> it (the best is <code>best(i - 1)</code>) or <em>take</em> it (you gain its amount, but the previous house is off limits, so <code>best(i - 2) + x</code>). Pick the larger: <code>best(i) = max(best(i - 1), best(i - 2) + x)</code>. This "take it or leave it" decision is the shape of many DP problems. Each answer needs only the previous two, so two variables suffice, exactly as in climbing stairs: O(n) time, O(1) memory.</p>`,
        `<p>Trace for <code>[2, 7, 9, 3, 1]</code>, with <code>prev</code> = best two houses back and <code>best</code> = best one house back, both starting at 0. House 2: max(0, 0 + 2) = 2. House 7: max(2, 0 + 7) = 7. House 9: max(7, 2 + 9) = 11. House 3: max(11, 7 + 3) = 11. House 1: max(11, 11 + 1) = 12. The answer is 12 (houses 2, 9 and 1). Notice a greedy choice like "take the biggest" would take 9 then 2 and 1 for 12 here by luck, but fails on <code>[2, 1, 1, 2]</code>, where taking both 2s gives 4.</p>`,
        `<p>The Rust shape reuses the destructuring assignment from the last lesson: <code>(prev, best) = (best, best.max(prev + x));</code>. The right side is computed from the <em>old</em> values, then both variables change. <code>best.max(prev + x)</code> is the method form of "the larger of two" (<code>.max()</code> from stage 3). The loop is <code>for &amp;x in houses</code>: the slice yields references, and <code>&amp;x</code> copies the amount out. An empty slice never enters the loop, so it returns 0 with no special case. The amounts reach 10<sup>9</sup> over 100 000 houses, so use <code>u64</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let houses = [2, 7, 9, 3, 1];
    let (mut prev, mut best): (u64, u64) = (0, 0);   // best two houses back, best one house back
    for &x in &houses {
        (prev, best) = (best, best.max(prev + x));   // skip this house, or take it and the best from two back
        println!("after {}: best = {}", x, best);
    }
}`,
          output: `after 2: best = 2
after 7: best = 7
after 9: best = 11
after 3: best = 11
after 1: best = 12`,
        },
      ],
      terms: [
        {
          code: 'best(i) = max(best(i - 1), best(i - 2) + x)',
          meaning: 'skip this house, or take it plus the best from two back',
        },
        { code: '(prev, best) = (best, best.max(prev + x));', meaning: 'both update from the old values' },
        { code: 'for &x in houses', meaning: 'each amount, copied out of its reference' },
      ],
    },
    task: `Write <code>rob</code>: the houses hold the given amounts and you cannot take two neighbouring houses. Return the maximum total.`,
    refresher: [
      `For each house either skip it (keep the best so far) or take it (its value plus the best from two houses back). Two running variables are enough.`,
      'Amounts reach 10<sup>9</sup> and there are 100 000 houses: sum in <code>u64</code>.',
    ],
    hints: [
      `Track two numbers: the best total up to the previous house, and the best total up to the house before that. An empty row has total 0.`,
      `For each house, the new best is the larger of "skip it" (the previous best) or "take it" (this amount plus the best from two houses back).`,
      `Update both tracked numbers together; a destructuring assignment keeps the old values on the right-hand side.`,
    ],
    inCpp: {
      code: `long long rob(const vector<long long>& h) {
    long long prev = 0, best = 0;
    for (long long x : h) {
        long long t = best;
        best = max(best, prev + x);
        prev = t;
    }
    return best;
}`,
      note: `C++ needs a temporary to update two variables from each other. Rust has destructuring assignment, <code>(prev, best) = (best, best.max(prev + x));</code>, where the right side is fully evaluated before either variable changes.`,
    },
    starter: `// Maximum total with no two adjacent houses taken.
fn rob(houses: &[u64]) -> u64 {
    0
}`,
    solution: `fn rob(houses: &[u64]) -> u64 {
    let (mut prev, mut best): (u64, u64) = (0, 0);
    for &x in houses {
        (prev, best) = (best, best.max(prev + x));
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
    let small: [&[u64]; 7] = [&[], &[5], &[2, 7, 9, 3, 1], &[1, 2, 3, 1], &[2, 1, 1, 2], &[5, 1, 1, 5], &[4, 4]];
    for (i, h) in small.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", rob(h));
    }
    println!("\\n@@TEST 8@@");
    let mut rng = HarnessRng(404);
    let h: Vec<u64> = (0..100_000).map(|_| 1 + rng.next() % 1_000_000_000).collect();
    println!("{}", rob(&h));
}`,
    tests: [
      { name: 'No houses', input: '[]', expected: '0' },
      { name: 'One house', input: '[5]', expected: '5' },
      { name: 'Example', input: '[2, 7, 9, 3, 1]', expected: '12' },
      { name: 'Skip the middle', input: '[1, 2, 3, 1]', expected: '4' },
      { name: 'Both ends', input: '[2, 1, 1, 2]', expected: '4' },
      { name: 'Equal choices', input: '[5, 1, 1, 5]', expected: '10' },
      { name: 'Two equal houses', input: '[4, 4]', expected: '4' },
      { name: 'Large', input: '100 000 houses up to 1e9', expected: '28248694418287' },
    ],
  },

  {
    id: 'r7-coin-change',
    title: 'Coin change',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>Fewest coins to make an amount, using unlimited copies of each coin. Greedy ("always take the largest coin") fails: coins 1, 3, 4 and amount 6 gives 4 + 1 + 1 = three coins, but 3 + 3 is two. DP instead: let <code>dp[a]</code> be the fewest coins for amount a. The last coin used was some coin c, leaving <code>a - c</code>, so <code>dp[a] = 1 + min over coins c &lt;= a of dp[a - c]</code>, with <code>dp[0] = 0</code>. Fill amounts from 1 up to the target; every <code>dp[a - c]</code> was filled earlier. Cost: O(amount &middot; coins).</p>`,
        `<p>Trace for coins 1, 3, 4 and amount 6. <code>dp[0] = 0</code>. dp[1] = 1 (a 1). dp[2] = 2. dp[3]: coin 1 gives dp[2] + 1 = 3, coin 3 gives dp[0] + 1 = 1, so 1. dp[4] = 1 (the 4 coin). dp[5]: coin 1 gives 2, coin 3 gives dp[2] + 1 = 3, coin 4 gives dp[1] + 1 = 2, so 2. dp[6]: coin 1 gives 3, coin 3 gives dp[3] + 1 = 2, coin 4 gives dp[2] + 1 = 3, so 2. Table: <code>[0, 1, 2, 1, 1, 2, 2]</code>. Some amounts are impossible (coins [2], amount 3). Those stay at "infinity", and the answer is <code>None</code>.</p>`,
        `<p>The Rust shape. The table is <code>vec![usize::MAX; amount + 1]</code>, with <code>usize::MAX</code> as "not reachable yet", and <code>dp[0] = 0</code>. Because that sentinel is the largest number, adding 1 to it would overflow and panic in a debug build, so only extend from reachable entries: <code>if c &lt;= a &amp;&amp; dp[a - c] != usize::MAX</code> (the first test also protects <code>a - c</code> from underflow, because <code>&amp;&amp;</code> stops early). Update with <code>dp[a] = dp[a].min(dp[a - c] + 1)</code>. Loop with <code>for &amp;c in coins</code>. Finish with the "no answer" convention you have used all along: <code>if dp[amount] == usize::MAX { None } else { Some(dp[amount]) }</code>. Amount 0 never enters the loop and returns <code>Some(0)</code>, even with no coins at all.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let coins = [1, 3, 4];
    let amount = 6;
    let mut dp = vec![usize::MAX; amount + 1];       // MAX = not reachable (yet)
    dp[0] = 0;
    for a in 1..=amount {
        for &c in &coins {
            if c <= a && dp[a - c] != usize::MAX {   // c fits, and a - c is reachable
                dp[a] = dp[a].min(dp[a - c] + 1);
            }
        }
    }
    println!("{:?}", dp);
}`,
          output: '[0, 1, 2, 1, 1, 2, 2]',
          caption: 'dp[6] = 2: the coins 3 + 3. Greedy would have picked 4 first and needed three.',
        },
      ],
      terms: [
        {
          code: 'dp[a] = dp[a].min(dp[a - c] + 1)',
          meaning: 'the best of the current value and "one more coin on top of a - c"',
        },
        { code: 'vec![usize::MAX; amount + 1]', meaning: 'every amount starts as not reachable' },
        {
          code: 'c <= a && dp[a - c] != usize::MAX',
          meaning: 'safe order: no underflow, no overflow from the sentinel',
        },
        {
          code: 'if dp[amount] == usize::MAX { None } else { Some(dp[amount]) }',
          meaning: 'Option for "impossible"',
        },
      ],
    },
    task: `Write <code>coin_change</code>: the fewest coins (each denomination usable any number of times) that add up to <code>amount</code>, or <code>None</code> if it is impossible. Amount 0 needs 0 coins.`,
    refresher: [
      `<code>dp[a]</code> = fewest coins for amount <code>a</code>. For each coin <code>c &lt;= a</code>, <code>dp[a]</code> can be <code>dp[a - c] + 1</code>.`,
      `Use <code>Vec&lt;Option&lt;usize&gt;&gt;</code>: <code>None</code> is "not reachable". Greedy by largest coin is wrong (try 1, 3, 4 for 6).`,
    ],
    hints: [
      `Keep a table by amount where each entry is the fewest coins for that amount. Start the amount 0 at 0 and everything else at a huge "not reachable" value.`,
      `For each amount, try each coin that is not larger than it. If the leftover amount is reachable, one more coin is a candidate for the minimum.`,
      `Adding to the "not reachable" value would overflow, so test reachability first. At the end convert that value to <code>None</code>.`,
    ],
    inCpp: {
      code: `int coin_change(const vector<int>& coins, int amount) {
    const int INF = INT_MAX;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins)
            if (c <= a && dp[a - c] != INF) dp[a] = min(dp[a], dp[a - c] + 1);
    return dp[amount] == INF ? -1 : dp[amount];
}`,
      note: `The C++ version needs an <code>INF</code> sentinel, a guard against adding to it, and <code>-1</code> at the end. With <code>Option&lt;usize&gt;</code> the table, the guard and the return type all say "possibly impossible" in the type itself.`,
    },
    starter: `// coins are positive. Return the fewest coins for amount, or None.
fn coin_change(coins: &[usize], amount: usize) -> Option<usize> {
    None
}`,
    solution: `fn coin_change(coins: &[usize], amount: usize) -> Option<usize> {
    let mut dp: Vec<usize> = vec![usize::MAX; amount + 1];
    dp[0] = 0;
    for a in 1..=amount {
        for &c in coins {
            if c <= a && dp[a - c] != usize::MAX {
                dp[a] = dp[a].min(dp[a - c] + 1);
            }
        }
    }
    if dp[amount] == usize::MAX {
        None
    } else {
        Some(dp[amount])
    }
}`,
    harness: `fn harness_show(r: Option<usize>) -> String {
    match r {
        Some(n) => n.to_string(),
        None => "None".to_string(),
    }
}

fn main() {
    println!("\\n@@TEST 1@@");
    println!("{}", harness_show(coin_change(&[1, 2, 5], 11)));
    println!("\\n@@TEST 2@@");
    println!("{}", harness_show(coin_change(&[2], 3)));
    println!("\\n@@TEST 3@@");
    println!("{}", harness_show(coin_change(&[1], 0)));
    println!("\\n@@TEST 4@@");
    println!("{}", harness_show(coin_change(&[], 0)));
    println!("\\n@@TEST 5@@");
    println!("{}", harness_show(coin_change(&[], 5)));
    println!("\\n@@TEST 6@@");
    println!("{}", harness_show(coin_change(&[1, 3, 4], 6)));
    println!("\\n@@TEST 7@@");
    println!("{}", harness_show(coin_change(&[2, 5, 10], 27)));
    println!("\\n@@TEST 8@@");
    println!("{}", harness_show(coin_change(&[7, 13, 29, 101, 997], 100_000)));
    println!("\\n@@TEST 9@@");
    println!("{}", harness_show(coin_change(&[4, 6, 10], 99_999)));
}`,
    tests: [
      { name: 'Example', input: '[1, 2, 5], 11', expected: '3' },
      { name: 'Impossible', input: '[2], 3', expected: 'None' },
      { name: 'Amount zero', input: '[1], 0', expected: '0' },
      { name: 'No coins, amount zero', input: '[], 0', expected: '0' },
      { name: 'No coins, amount five', input: '[], 5', expected: 'None' },
      { name: 'Greedy fails', input: '[1, 3, 4], 6', expected: '2' },
      { name: 'Mixed coins', input: '[2, 5, 10], 27', expected: '4' },
      { name: 'Large amount', input: '[7, 13, 29, 101, 997], 100 000', expected: '108' },
      { name: 'Large and impossible', input: '[4, 6, 10], 99 999 (odd)', expected: 'None' },
    ],
  },

  {
    id: 'r7-knapsack',
    title: '0/1 knapsack',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>Items with a weight and a value, a bag with a capacity, each item usable <em>at most once</em>: maximise the total value. DP over capacities: <code>dp[c]</code> is the best value using weight at most c. For each item (weight w, value v), either leave it, or take it, which adds v on top of the best you could do with the remaining capacity <code>c - w</code>: <code>dp[c] = max(dp[c], dp[c - w] + v)</code>. Cost: O(items &middot; capacity).</p>`,
        `<p>One detail makes it "0/1": the capacities must be updated from <strong>high to low</strong>. When you compute <code>dp[c]</code>, the entry <code>dp[c - w]</code> must still be the value from <em>before</em> this item, otherwise the same item gets counted again (that is the "unlimited" variant, like coin change). Going downwards guarantees it, because smaller capacities have not been changed yet. Trace for weights 1, 3, 4, 5, values 1, 4, 5, 7, capacity 7. Start: <code>[0,0,0,0,0,0,0,0]</code>. After item (1, 1): <code>[0,1,1,1,1,1,1,1]</code>. After item (3, 4): <code>[0,1,1,4,5,5,5,5]</code>. After item (4, 5): <code>[0,1,1,4,5,6,6,9]</code> (capacity 7 takes the 3 and the 4: 4 + 5). After item (5, 7): <code>[0,1,1,4,5,7,8,9]</code>. The answer is <code>dp[7] = 9</code>.</p>`,
        `<p>The Rust shape. The table is a single <code>Vec&lt;u64&gt;</code> of length <code>capacity + 1</code>, all zeros (zero value fits in any bag, so no sentinel is needed). Walk the two input slices together with <code>weights.iter().zip(values)</code> and the pattern <code>for (&amp;w, &amp;v) in ...</code> (each side copies its number out of a reference). Count down with <code>(w..=capacity).rev()</code>: a range can be reversed, and if the item is heavier than the capacity the range is empty, so the item is skipped on its own, with no <code>usize</code> underflow to worry about. Inside, <code>dp[c] = dp[c].max(dp[c - w] + v)</code> is safe because <code>c &gt;= w</code>. The result is <code>dp[capacity]</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let (w, v) = (2, 3);                              // a single item: weight 2, value 3
    let cap = 6;

    let mut once = vec![0; cap + 1];                  // capacities from high to low: the item is used at most once
    for c in (w..=cap).rev() {
        once[c] = once[c].max(once[c - w] + v);
    }

    let mut again = vec![0; cap + 1];                 // from low to high: the item is reused, which is wrong here
    for c in w..=cap {
        again[c] = again[c].max(again[c - w] + v);
    }

    println!("{:?}", once);
    println!("{:?}", again);
}`,
          output: `[0, 0, 3, 3, 3, 3, 3]
[0, 0, 3, 3, 6, 6, 9]`,
          caption: 'With one item of weight 2 the bag of 6 should be worth 3, not 9.',
        },
      ],
      terms: [
        {
          code: 'dp[c] = dp[c].max(dp[c - w] + v)',
          meaning: 'leave the item, or take it on top of the best for the remaining capacity',
        },
        {
          code: '(w..=capacity).rev()',
          meaning: 'counts down from capacity to w, so each item is used at most once',
        },
        { code: 'weights.iter().zip(values)', meaning: 'walks the two slices in step' },
        { code: 'for (&w, &v) in ...', meaning: 'copies both numbers out of their references' },
      ],
    },
    task: `Write <code>knapsack</code>: each item <code>i</code> has <code>weights[i]</code> and <code>values[i]</code> and can be taken at most once. Return the largest total value with total weight at most <code>capacity</code>.`,
    refresher: [
      `1D table: <code>dp[c]</code> = best value with capacity <code>c</code>. For each item, update <code>c</code> from <code>capacity</code> down to the item weight, so the item is used once.`,
      `A reversed inclusive range does the downward loop safely on <code>usize</code>: <code>(w..=capacity).rev()</code>. It is empty when <code>w &gt; capacity</code>.`,
    ],
    hints: [
      `One table of best values by capacity is enough, starting at all zeros. Handle the items one at a time, walking both lists in step.`,
      `For one item, visit the capacities it fits in, from the largest down to its weight. Each entry is the max of itself and the entry for the remaining capacity plus the item's value.`,
      `Going downwards matters: it keeps the smaller entries unchanged until you need them, so an item cannot be used twice.`,
    ],
    inCpp: {
      code: `void fill(const vector<int>& w, const vector<long long>& v, int cap, vector<long long>& dp) {
    for (size_t i = 0; i < w.size(); i++)
        for (long long c = cap; c >= (long long)w[i]; c--)
            dp[c] = max(dp[c], dp[c - w[i]] + v[i]);
}`,
      note: `A downward loop over an unsigned index is a trap in C++: <code>c &gt;= 0</code> is always true, so people cast to signed. <code>(w..=cap).rev()</code> in Rust walks down on <code>usize</code> and simply ends.`,
    },
    starter: `// weights[i] >= 1 and values[i] are for item i. Each item at most once.
fn knapsack(weights: &[usize], values: &[u64], capacity: usize) -> u64 {
    0
}`,
    solution: `fn knapsack(weights: &[usize], values: &[u64], capacity: usize) -> u64 {
    let mut dp: Vec<u64> = vec![0; capacity + 1];
    for (&w, &v) in weights.iter().zip(values) {
        for c in (w..=capacity).rev() {
            dp[c] = dp[c].max(dp[c - w] + v);
        }
    }
    dp[capacity]
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
    println!("{}", knapsack(&[1, 3, 4, 5], &[1, 4, 5, 7], 7));
    println!("\\n@@TEST 2@@");
    println!("{}", knapsack(&[1, 3, 4, 5], &[1, 4, 5, 7], 0));
    println!("\\n@@TEST 3@@");
    println!("{}", knapsack(&[], &[], 10));
    println!("\\n@@TEST 4@@");
    println!("{}", knapsack(&[10], &[100], 5));
    println!("\\n@@TEST 5@@");
    println!("{}", knapsack(&[2], &[3], 10));
    println!("\\n@@TEST 6@@");
    println!("{}", knapsack(&[5, 4, 6, 3], &[10, 40, 30, 50], 10));
    println!("\\n@@TEST 7@@");
    let mut rng = HarnessRng(505);
    let w: Vec<usize> = (0..200).map(|_| 1 + rng.next() as usize % 100).collect();
    let v: Vec<u64> = (0..200).map(|_| 1 + rng.next() % 1000).collect();
    println!("{}", knapsack(&w, &v, 10_000));
}`,
    tests: [
      { name: 'Example', input: 'w 1 3 4 5, v 1 4 5 7, cap 7', expected: '9' },
      { name: 'Capacity zero', input: 'cap 0', expected: '0' },
      { name: 'No items', input: 'no items, cap 10', expected: '0' },
      { name: 'Item too heavy', input: 'w 10, v 100, cap 5', expected: '0' },
      { name: 'Each item once', input: 'w 2, v 3, cap 10', expected: '3' },
      { name: 'Four items', input: 'w 5 4 6 3, v 10 40 30 50, cap 10', expected: '90' },
      { name: 'Large', input: '200 items, capacity 10 000', expected: '99160' },
    ],
  },

  {
    id: 'r7-lis',
    title: 'Longest increasing subsequence',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>The longest strictly increasing subsequence (elements in order, not necessarily adjacent). The simple DP is O(n<sup>2</sup>). A cleverer method is O(n log n) and short enough to write in a few lines. Keep a vector <code>tails</code> where <code>tails[k]</code> is the <em>smallest possible last value</em> of an increasing subsequence of length k + 1 seen so far. That vector is always sorted, strictly increasing. For each new number x: find the first tail that is <em>not smaller</em> than x (a binary search: stage 6's <code>partition_point</code>). If there is none, x extends the longest subsequence, so push it. Otherwise x is a smaller (better) ending for that length, so overwrite that tail. The answer is the length of <code>tails</code>.</p>`,
        `<p>Trace for <code>[10, 9, 2, 5, 3, 7, 101, 18]</code>. 10: <code>[10]</code>. 9 replaces 10: <code>[9]</code>. 2 replaces 9: <code>[2]</code>. 5 extends: <code>[2, 5]</code>. 3 replaces 5: <code>[2, 3]</code>. 7 extends: <code>[2, 3, 7]</code>. 101 extends: <code>[2, 3, 7, 101]</code>. 18 replaces 101: <code>[2, 3, 7, 18]</code>. Length 4. Be careful: <code>tails</code> is <em>not</em> itself the subsequence (here 2, 3, 7, 18 happens to be one, but the replacements can mix elements from different candidates); only its length is meaningful. Strictness comes from the search: <code>partition_point(|&amp;t| t &lt; x)</code> stops at an equal tail, which is replaced by x (no growth), so duplicates do not count twice.</p>`,
        `<p>The Rust shape: <code>let mut tails: Vec&lt;i32&gt; = Vec::new();</code>, and for each number <code>let i = tails.partition_point(|&amp;t| t &lt; x);</code> gives the index of the first tail that is not smaller (it can be <code>tails.len()</code>, meaning "all are smaller"). Then <code>if i == tails.len() { tails.push(x); } else { tails[i] = x; }</code>. The loop is <code>for &amp;x in a</code>. There is no sentinel, no 2D table and no <code>Option</code>: an empty input gives an empty <code>tails</code>, and its length 0 is the correct answer.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = [10, 9, 2, 5, 3, 7, 101, 18];
    let mut tails: Vec<i32> = Vec::new();
    for &x in &a {
        let i = tails.partition_point(|&t| t < x);     // first tail that is not smaller than x
        if i == tails.len() {
            tails.push(x);                              // x extends the longest subsequence
        } else {
            tails[i] = x;                               // x is a smaller ending for that length
        }
        println!("after {}: {:?}", x, tails);
    }
    println!("length {}", tails.len());
}`,
          output: `after 10: [10]
after 9: [9]
after 2: [2]
after 5: [2, 5]
after 3: [2, 3]
after 7: [2, 3, 7]
after 101: [2, 3, 7, 101]
after 18: [2, 3, 7, 18]
length 4`,
        },
      ],
      terms: [
        {
          code: 'tails.partition_point(|&t| t < x)',
          meaning: 'binary search for the first tail not smaller than x',
        },
        {
          code: 'if i == tails.len() { tails.push(x) } else { tails[i] = x }',
          meaning: 'extend, or improve an ending',
        },
        { code: 'tails.len()', meaning: 'the answer: the longest length reached' },
      ],
    },
    task: `Write <code>lis</code>: the length of the longest strictly increasing subsequence of <code>a</code> (elements need not be adjacent).`,
    refresher: [
      `O(n^2): <code>dp[i]</code> = 1 + the best <code>dp[j]</code> over <code>j &lt; i</code> with <code>a[j] &lt; a[i]</code>. Fine for the tests here.`,
      `O(n log n): keep <code>tails</code>, where <code>tails[k]</code> is the smallest last value of any increasing run of length <code>k + 1</code>; it stays sorted.`,
    ],
    hints: [
      `Keep a sorted vector where entry k is the smallest last value of any increasing subsequence of length k + 1.`,
      `For each number, binary-search the first entry that is not smaller than it. That is where this number belongs.`,
      `If that position is past the end, the number extends the longest subsequence; otherwise it replaces the entry there. The answer is the vector's length.`,
    ],
    inCpp: {
      code: `int lis(const vector<int>& a) {
    vector<int> tails;
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,
      note: `C++ returns an iterator that you compare to <code>end()</code>. Rust's <code>partition_point</code> returns a plain index, so "none found" is simply <code>i == tails.len()</code> and there is no iterator to invalidate.`,
    },
    starter: `// Length of the longest strictly increasing subsequence.
fn lis(a: &[i32]) -> usize {
    0
}`,
    solution: `fn lis(a: &[i32]) -> usize {
    let mut tails: Vec<i32> = Vec::new();
    for &x in a {
        let i = tails.partition_point(|&t| t < x);
        if i == tails.len() {
            tails.push(x);
        } else {
            tails[i] = x;
        }
    }
    tails.len()
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn main() {
    let small: [&[i32]; 8] = [
        &[10, 9, 2, 5, 3, 7, 101, 18],
        &[],
        &[7],
        &[5, 5, 5],
        &[1, 2, 3, 4, 5],
        &[5, 4, 3, 2, 1],
        &[0, 1, 0, 3, 2, 3],
        &[4, 10, 4, 3, 8, 9],
    ];
    for (i, a) in small.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", lis(a));
    }
    println!("\\n@@TEST 9@@");
    let mut rng = HarnessRng(606);
    let a: Vec<i32> = (0..6000).map(|_| (rng.next() % 1_000_000) as i32).collect();
    println!("{}", lis(&a));
    println!("\\n@@TEST 10@@");
    let a: Vec<i32> = (0..6000).collect();
    println!("{}", lis(&a));
}`,
    tests: [
      { name: 'Example', input: '[10, 9, 2, 5, 3, 7, 101, 18]', expected: '4' },
      { name: 'Empty', input: '[]', expected: '0' },
      { name: 'One element', input: '[7]', expected: '1' },
      { name: 'All equal', input: '[5, 5, 5]', expected: '1' },
      { name: 'Already increasing', input: '[1, 2, 3, 4, 5]', expected: '5' },
      { name: 'Decreasing', input: '[5, 4, 3, 2, 1]', expected: '1' },
      { name: 'Mixed', input: '[0, 1, 0, 3, 2, 3]', expected: '4' },
      { name: 'Duplicates', input: '[4, 10, 4, 3, 8, 9]', expected: '3' },
      { name: 'Large random', input: '6000 random values', expected: '142' },
      { name: 'Large increasing', input: '0..5999', expected: '6000' },
    ],
  },

  {
    id: 'r7-lcs',
    title: 'Longest common subsequence',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>The longest common subsequence of two strings: the longest sequence of characters that appears, in order but not necessarily adjacent, in both. DP over prefixes. Let <code>dp[i][j]</code> be the answer for the first i characters of <code>a</code> and the first j characters of <code>b</code>. If the last characters match (<code>a[i - 1] == b[j - 1]</code>), they extend the best answer for both shorter prefixes: <code>dp[i - 1][j - 1] + 1</code>. If they differ, one of them is not used, so take the better of dropping a's last character, <code>dp[i - 1][j]</code>, or b's, <code>dp[i][j - 1]</code>. The first row and column (an empty string) are 0. Cost: O(len(a) &middot; len(b)).</p>`,
        `<p>Trace for <code>"abcde"</code> and <code>"ace"</code>. Columns: empty, a, c, e. Rows: <code>[0,0,0,0]</code> (empty), <code>[0,1,1,1]</code> (a), <code>[0,1,1,1]</code> (b matches nothing new), <code>[0,1,2,2]</code> (c extends a to "ac"), <code>[0,1,2,2]</code> (d), <code>[0,1,2,3]</code> (e extends to "ace"). The answer is the bottom-right entry, 3. Each row looks only at the row directly above, so you can keep just two rows (the previous one and the one being built): O(len(b)) memory instead of the whole table.</p>`,
        `<p>The Rust shape. First the full table, <code>vec![vec![0; m + 1]; n + 1]</code>, as in the 2D prefix lesson, to see the structure. The memory-saving version, which is the exercise: <code>prev</code> and <code>cur</code> are <code>Vec&lt;usize&gt;</code> of length <code>b.len() + 1</code>. Work on bytes (<code>a.as_bytes()</code>, ASCII input) so characters can be compared with <code>==</code> and indexed. After finishing a row, <code>prev = cur;</code> <em>moves</em> the new row into <code>prev</code> and drops the old one: no copying, and <code>cur</code> is rebuilt fresh on the next pass, which also keeps the borrow checker happy because only one row is ever being written. Index shifting: table column j+1 corresponds to character j, because column 0 is the empty prefix. The answer is <code>prev[b.len()]</code>. Lengths are <code>usize</code>.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = "abcde".as_bytes();
    let b = "ace".as_bytes();
    let mut dp = vec![vec![0; b.len() + 1]; a.len() + 1];     // row i, column j: prefixes of length i and j
    for i in 1..=a.len() {
        for j in 1..=b.len() {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1] + 1                           // last characters match: extend
            } else {
                dp[i - 1][j].max(dp[i][j - 1])                 // drop one of the two last characters
            };
        }
    }
    for row in &dp {
        println!("{:?}", row);
    }
}`,
          output: `[0, 0, 0, 0]
[0, 1, 1, 1]
[0, 1, 1, 1]
[0, 1, 2, 2]
[0, 1, 2, 2]
[0, 1, 2, 3]`,
          caption: 'The answer is the bottom-right entry.',
        },
        {
          code: `fn main() {
    let a = "abcde".as_bytes();
    let b = "ace".as_bytes();
    let mut prev = vec![0; b.len() + 1];                       // the row above
    for i in 0..a.len() {
        let mut cur = vec![0; b.len() + 1];                    // the row being built
        for j in 0..b.len() {
            cur[j + 1] = if a[i] == b[j] {
                prev[j] + 1
            } else {
                prev[j + 1].max(cur[j])
            };
        }
        prev = cur;                                            // move the new row into place
    }
    println!("{}", prev[b.len()]);
}`,
          output: '3',
          caption: `Same numbers with two rows. Here the loops run over characters 0.., so the table index is shifted by one.`,
        },
      ],
      terms: [
        {
          code: 'vec![vec![0; m + 1]; n + 1]',
          meaning: 'the full DP table, with an empty-prefix row and column',
        },
        {
          code: 'a[i - 1] == b[j - 1]',
          meaning: 'last characters of the two prefixes match, so extend the diagonal',
        },
        {
          code: 'prev = cur;',
          meaning: 'moves the finished row into prev and drops the old one',
        },
        { code: 'a.as_bytes()', meaning: 'the string as indexable bytes (ASCII input)' },
      ],
    },
    task: 'Write <code>lcs</code>: the length of the longest common subsequence of two ASCII strings.',
    refresher: [
      `<code>dp[i][j]</code> for prefixes of length <code>i</code> and <code>j</code>: equal last bytes give <code>dp[i-1][j-1] + 1</code>, otherwise the larger of <code>dp[i-1][j]</code> and <code>dp[i][j-1]</code>.`,
      `Compare bytes: <code>let a = a.as_bytes();</code>. Two rows are enough, and <code>prev = cur;</code> moves the row without copying it.`,
    ],
    hints: [
      `Work on the bytes of both strings. Keep a row for the prefix of <code>a</code> before the current character, and build a fresh row for the current one.`,
      `Each new cell depends on the cell diagonally before it (when the characters match, plus one) or on the better of its left and upper neighbours.`,
      `When a row is finished, it becomes the "previous" row. The answer is its last entry after the final character.`,
    ],
    inCpp: {
      code: `int lcs(const string& a, const string& b) {
    vector<int> prev(b.size() + 1, 0), cur(b.size() + 1, 0);
    for (size_t i = 0; i < a.size(); i++) {
        for (size_t j = 0; j < b.size(); j++)
            cur[j + 1] = a[i] == b[j] ? prev[j] + 1 : max(prev[j + 1], cur[j]);
        swap(prev, cur);
    }
    return prev[b.size()];
}`,
      note: `In C++ <code>a[i]</code> on a string is just there. Rust has no <code>s[i]</code> on <code>&amp;str</code> because text is UTF-8, so you say <code>as_bytes()</code> once and get a slice of <code>u8</code> you can index and compare.`,
    },
    starter: `// Length of the longest common subsequence of a and b.
fn lcs(a: &str, b: &str) -> usize {
    0
}`,
    solution: `fn lcs(a: &str, b: &str) -> usize {
    let (a, b) = (a.as_bytes(), b.as_bytes());
    let mut prev: Vec<usize> = vec![0; b.len() + 1];
    for i in 0..a.len() {
        let mut cur: Vec<usize> = vec![0; b.len() + 1];
        for j in 0..b.len() {
            cur[j + 1] = if a[i] == b[j] {
                prev[j] + 1
            } else {
                prev[j + 1].max(cur[j])
            };
        }
        prev = cur;
    }
    prev[b.len()]
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn main() {
    let small = [("abcde", "ace"), ("", "abc"), ("abc", "def"), ("abc", "abc"), ("AGGTAB", "GXTXAYB"), ("a", "a")];
    for (i, (a, b)) in small.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", lcs(a, b));
    }
    println!("\\n@@TEST 7@@");
    let mut rng = HarnessRng(707);
    let a: String = (0..2000).map(|_| (b'a' + (rng.next() % 4) as u8) as char).collect();
    let b: String = (0..2000).map(|_| (b'a' + (rng.next() % 4) as u8) as char).collect();
    println!("{}", lcs(&a, &b));
}`,
    tests: [
      { name: 'Example', input: '"abcde", "ace"', expected: '3' },
      { name: 'Empty first string', input: '"", "abc"', expected: '0' },
      { name: 'Nothing in common', input: '"abc", "def"', expected: '0' },
      { name: 'Identical', input: '"abc", "abc"', expected: '3' },
      { name: 'Classic', input: '"AGGTAB", "GXTXAYB"', expected: '4' },
      { name: 'One letter', input: '"a", "a"', expected: '1' },
      { name: 'Large', input: 'two random 2000-letter strings over a..d', expected: '1305' },
    ],
  },

  {
    id: 'r7-edit-distance',
    title: 'Edit distance',
    kind: 'implement',
    introduces: [],
    teach: {
      body: [
        `<p>Edit distance: the fewest single-character insertions, deletions and substitutions that turn <code>a</code> into <code>b</code>. Same table shape as LCS: <code>dp[i][j]</code> is the distance between the first i characters of <code>a</code> and the first j of <code>b</code>. Turning an empty string into j characters takes j insertions, and i characters into nothing takes i deletions, so the edges are <code>dp[0][j] = j</code> and <code>dp[i][0] = i</code>. For an inside cell, consider the last characters and take the cheapest of three: <strong>substitute</strong> (<code>dp[i-1][j-1]</code>, plus 1 unless the characters are already equal), <strong>delete</strong> a's last character (<code>dp[i-1][j] + 1</code>), or <strong>insert</strong> b's last character (<code>dp[i][j-1] + 1</code>). Cost O(len(a) &middot; len(b)).</p>`,
        `<p>Trace for <code>"sun"</code> to <code>"sat"</code>. Columns: empty, s, a, t. Rows: <code>[0,1,2,3]</code> (empty), <code>[1,0,1,2]</code> (s matches s for free), <code>[2,1,1,2]</code> (u), <code>[3,2,2,2]</code> (n). The answer is the bottom-right entry, 2: change u to a, and n to t. As in LCS, every row needs only the row above, so two rows are enough; the only new work is the first entry of each row, which is <code>i + 1</code> (the cost of deleting <code>i + 1</code> characters).</p>`,
        `<p>The Rust shape is the LCS shape with a different cell rule. <code>prev</code> starts as <code>(0..=b.len()).collect()</code>: that is the base row <code>0, 1, 2, ..., len</code> built from an inclusive range. Each new row is <code>vec![i + 1; b.len() + 1]</code>: every entry is filled with <code>i + 1</code>, which is correct for column 0 and gets overwritten for the rest. "Plus 1 unless equal" is written <code>(a[i] != b[j]) as usize</code>: a <code>bool</code> can be cast with <code>as</code> to give 0 for false and 1 for true. Take the cheapest of the three with chained <code>.min()</code> calls: <code>sub.min(prev[j + 1] + 1).min(cur[j] + 1)</code>. Finish with <code>prev = cur;</code> as before.</p>`,
      ],
      examples: [
        {
          code: `fn main() {
    let a = "sun".as_bytes();
    let b = "sat".as_bytes();
    let mut dp = vec![vec![0; b.len() + 1]; a.len() + 1];
    for i in 0..=a.len() {
        dp[i][0] = i;                                           // i deletions to reach the empty string
    }
    for j in 0..=b.len() {
        dp[0][j] = j;                                           // j insertions from the empty string
    }
    for i in 1..=a.len() {
        for j in 1..=b.len() {
            let sub = dp[i - 1][j - 1] + (a[i - 1] != b[j - 1]) as usize;   // true as usize is 1
            dp[i][j] = sub.min(dp[i - 1][j] + 1).min(dp[i][j - 1] + 1);
        }
    }
    for row in &dp {
        println!("{:?}", row);
    }
}`,
          output: `[0, 1, 2, 3]
[1, 0, 1, 2]
[2, 1, 1, 2]
[3, 2, 2, 2]`,
          caption: 'The bottom-right entry is the edit distance.',
        },
      ],
      terms: [
        { code: 'dp[0][j] = j; dp[i][0] = i', meaning: 'edges: pure insertions or pure deletions' },
        {
          code: '(a[i] != b[j]) as usize',
          meaning: '0 when the characters are equal, 1 when they differ',
        },
        { code: 'sub.min(x).min(y)', meaning: 'the cheapest of three options' },
        { code: '(0..=b.len()).collect()', meaning: 'the base row 0, 1, 2, ..., len as a Vec' },
        {
          code: 'vec![i + 1; b.len() + 1]',
          meaning: 'a fresh row; column 0 is i + 1, the rest is overwritten',
        },
      ],
    },
    task: `Write <code>edit_distance</code>: the fewest single-character insertions, deletions and substitutions that turn <code>a</code> into <code>b</code> (ASCII strings).`,
    refresher: [
      `<code>dp[i][j]</code> for prefixes: the minimum of delete (<code>dp[i-1][j] + 1</code>), insert (<code>dp[i][j-1] + 1</code>) and substitute (<code>dp[i-1][j-1] + (a[i-1] != b[j-1])</code>).`,
      `Row 0 is <code>0..=b.len()</code> and column 0 is <code>0..=a.len()</code>: turning into or from an empty string costs its length.`,
    ],
    hints: [
      `Start the "previous row" as 0, 1, 2, ... up to the length of <code>b</code>: turning nothing into a prefix of <code>b</code> is that many insertions.`,
      `Each new row starts with the next count of deletions. For the other cells, compare the three ways to fix the last characters and take the cheapest.`,
      `A bool converts to 0 or 1 with <code>as usize</code>, which is the substitution cost. Finish each row by making it the previous one.`,
    ],
    inCpp: {
      code: `void cell(const string& a, const string& b, vector<int>& prev, vector<int>& cur, int i, int j) {
    int sub = prev[j] + (a[i] != b[j]);   // bool promotes to int silently
    cur[j + 1] = min({sub, prev[j + 1] + 1, cur[j] + 1});
}`,
      note: `C++ adds a <code>bool</code> to an <code>int</code> without a word. Rust has no implicit numeric conversions, so the cast <code>(a[i] != b[j]) as usize</code> is spelled out, and the same rule is why <code>.min()</code> chains are written on values of one type.`,
    },
    starter: `// Minimum insertions, deletions and substitutions to turn a into b.
fn edit_distance(a: &str, b: &str) -> usize {
    0
}`,
    solution: `fn edit_distance(a: &str, b: &str) -> usize {
    let (a, b) = (a.as_bytes(), b.as_bytes());
    let mut prev: Vec<usize> = (0..=b.len()).collect();
    for i in 0..a.len() {
        let mut cur = vec![i + 1; b.len() + 1];
        for j in 0..b.len() {
            let sub = prev[j] + (a[i] != b[j]) as usize;
            cur[j + 1] = sub.min(prev[j + 1] + 1).min(cur[j] + 1);
        }
        prev = cur;
    }
    prev[b.len()]
}`,
    harness: `struct HarnessRng(u64);
impl HarnessRng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1442695040888963407);
        self.0 >> 33
    }
}

fn main() {
    let small = [("horse", "ros"), ("", "abc"), ("abc", ""), ("", ""), ("abc", "abc"), ("intention", "execution"), ("kitten", "sitting")];
    for (i, (a, b)) in small.iter().enumerate() {
        println!("\\n@@TEST {}@@", i + 1);
        println!("{}", edit_distance(a, b));
    }
    println!("\\n@@TEST 8@@");
    let mut rng = HarnessRng(707);
    let a: String = (0..2000).map(|_| (b'a' + (rng.next() % 4) as u8) as char).collect();
    let b: String = (0..2000).map(|_| (b'a' + (rng.next() % 4) as u8) as char).collect();
    println!("{}", edit_distance(&a, &b));
}`,
    tests: [
      { name: 'Example', input: '"horse", "ros"', expected: '3' },
      { name: 'From empty', input: '"", "abc"', expected: '3' },
      { name: 'To empty', input: '"abc", ""', expected: '3' },
      { name: 'Both empty', input: '"", ""', expected: '0' },
      { name: 'Identical', input: '"abc", "abc"', expected: '0' },
      { name: 'Longer words', input: '"intention", "execution"', expected: '5' },
      { name: 'Classic', input: '"kitten", "sitting"', expected: '3' },
      { name: 'Large', input: 'two random 2000-letter strings over a..d', expected: '1040' },
    ],
  },
]
