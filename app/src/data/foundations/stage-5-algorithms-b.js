// Lessons for this stage. Format: docs/superpowers/specs/2026-11-15-foundations-track-design.md
export const LESSONS = [
  {
    id: 's5-topological-sort',
    title: 'Topological sort',
    kind: 'implement',
    task: 'Return an order of the nodes <code>0..n-1</code> so every edge <code>u -&gt; v</code> has <code>u</code> before <code>v</code>. If the graph has a cycle, return an empty vector.',
    example: { input: 'n = 4, edges = 0-&gt;1, 0-&gt;2, 1-&gt;3, 2-&gt;3', output: '0 1 2 3 (or 0 2 1 3)' },
    refresher: [
      'Kahn: count in-degrees, queue every node with in-degree 0, pop one, append it to the order, and decrement its neighbours.',
      'If fewer than <code>n</code> nodes were output, the rest sit on a cycle.',
    ],
    hints: [
      'Build an adjacency list and an <code>indeg</code> array from the edges first.',
      'Push all nodes with <code>indeg == 0</code>; every time a neighbour drops to 0, push it.',
      'Compare the size of your order with <code>n</code> at the end.',
    ],
    starter: `// edges[i] = {u, v} means u -> v, nodes are 0..n-1
vector<int> topoSort(int n, vector<vector<int>>& edges) {
    return {};
}`,
    solution: `vector<int> topoSort(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0);
    for (size_t i = 0; i < edges.size(); i++) {
        adj[edges[i][0]].push_back(edges[i][1]);
        indeg[edges[i][1]]++;
    }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (size_t k = 0; k < adj[u].size(); k++) {
            int v = adj[u][k];
            if (--indeg[v] == 0) q.push(v);
        }
    }
    if ((int)order.size() != n) return {};
    return order;
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    int n = 0;
    vector<vector<int>> e;
    bool cyc = false;
    if (t == 1) { n = 4; e = {{0, 1}, {0, 2}, {1, 3}, {2, 3}}; }
    if (t == 2) { n = 1; }
    if (t == 3) { n = 5; }
    if (t == 4) { n = 3; e = {{0, 1}, {1, 2}, {2, 0}}; cyc = true; }
    if (t == 5) { n = 5; e = {{0, 1}, {1, 2}, {2, 1}, {3, 4}}; cyc = true; }
    if (t == 6) { n = 6; e = {{5, 2}, {5, 0}, {4, 0}, {4, 1}, {2, 3}, {3, 1}}; }
    if (t == 7) {
        n = 5000;
        vector<int> p(n);
        for (int i = 0; i < n; i++) p[i] = i;
        for (int i = n - 1; i > 0; i--) swap(p[i], p[lcgNext() % (i + 1)]);
        for (int i = 0; i + 1 < n; i++) e.push_back({p[i], p[i + 1]});
        for (int k = 0; k < 20000; k++) {
            int i = lcgNext() % n, j = lcgNext() % n;
            if (i == j) continue;
            if (i > j) swap(i, j);
            e.push_back({p[i], p[j]});
        }
    }
    vector<int> r = topoSort(n, e);
    bool ok = true;
    if (cyc) {
        ok = r.empty();
    } else {
        vector<int> pos(n, -1);
        if ((int)r.size() != n) ok = false;
        for (size_t i = 0; ok && i < r.size(); i++) {
            if (r[i] < 0 || r[i] >= n || pos[r[i]] != -1) ok = false;
            else pos[r[i]] = (int)i;
        }
        for (size_t i = 0; ok && i < e.size(); i++) if (pos[e[i][0]] > pos[e[i][1]]) ok = false;
    }
    cout << "\\n@@RESULT@@\\n" << (ok ? "valid" : "invalid") << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Diamond', stdin: '1', input: 'n=4: 0>1 0>2 1>3 2>3', expected: 'valid' },
      { name: 'Single node', stdin: '2', input: 'n=1, no edges', expected: 'valid' },
      { name: 'No edges', stdin: '3', input: 'n=5, no edges', expected: 'valid' },
      { name: 'Cycle of three', stdin: '4', input: 'n=3: 0>1 1>2 2>0 (return empty)', expected: 'valid' },
      { name: 'Cycle beside a valid part', stdin: '5', input: 'n=5: 0>1 1>2 2>1 3>4 (return empty)', expected: 'valid' },
      { name: 'Several sources', stdin: '6', input: 'n=6: 5>2 5>0 4>0 4>1 2>3 3>1', expected: 'valid' },
      { name: 'Large DAG', stdin: '7', input: '5 000 nodes, about 25 000 edges', expected: 'valid' },
    ],
  },
  {
    id: 's5-dijkstra',
    title: 'Dijkstra',
    kind: 'implement',
    task: 'Return the shortest distance from <code>src</code> to every node in a directed graph with non-negative weights. Unreachable nodes get <code>-1</code>. Distances are <code>long long</code>.',
    example: { input: 'n = 3, edges = {0,1,4} {0,2,1} {2,1,2}, src = 0', output: '0 3 1' },
    refresher: [
      'Keep a min-heap of (dist, node). Pop the smallest; if it is stale (dist larger than the best known), skip it.',
      'Otherwise relax each outgoing edge and push any improved distance. Weights must not be negative.',
    ],
    hints: [
      'Start with <code>dist</code> all set to a huge value, <code>dist[src] = 0</code>, and push <code>(0, src)</code>.',
      'Use <code>priority_queue&lt;pair&lt;long long,int&gt;, vector&lt;pair&lt;long long,int&gt;&gt;, greater&lt;pair&lt;long long,int&gt;&gt;&gt;</code> for a min-heap.',
      'Convert the huge value to <code>-1</code> only at the very end.',
    ],
    starter: `// edges[i] = {u, v, w}: directed edge u -> v with weight w, nodes are 0..n-1
vector<long long> dijkstra(int n, vector<vector<int>>& edges, int src) {
    return {};
}`,
    solution: `vector<long long> dijkstra(int n, vector<vector<int>>& edges, int src) {
    typedef pair<long long, int> P;
    vector<vector<pair<int, int>>> adj(n);
    for (size_t i = 0; i < edges.size(); i++)
        adj[edges[i][0]].push_back(make_pair(edges[i][1], edges[i][2]));
    const long long INF = LLONG_MAX;
    vector<long long> dist(n, INF);
    priority_queue<P, vector<P>, greater<P>> pq;
    dist[src] = 0;
    pq.push(P(0, src));
    while (!pq.empty()) {
        P top = pq.top(); pq.pop();
        long long d = top.first;
        int u = top.second;
        if (d > dist[u]) continue;
        for (size_t k = 0; k < adj[u].size(); k++) {
            int v = adj[u][k].first;
            long long nd = d + adj[u][k].second;
            if (nd < dist[v]) {
                dist[v] = nd;
                pq.push(P(nd, v));
            }
        }
    }
    for (int i = 0; i < n; i++) if (dist[i] == INF) dist[i] = -1;
    return dist;
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    int n = 1, src = 0;
    vector<vector<int>> e;
    if (t == 1) { n = 5; e = {{0, 1, 4}, {0, 2, 1}, {2, 1, 2}, {1, 3, 1}, {2, 3, 5}}; }
    if (t == 2) { n = 1; }
    if (t == 3) { n = 4; src = 1; e = {{1, 2, 5}, {2, 3, 1}, {0, 1, 1}}; }
    if (t == 4) { n = 3; e = {{0, 1, 0}, {0, 1, 7}, {1, 2, 0}}; }
    if (t == 5) { n = 4; e = {{0, 1, 2000000000}, {1, 2, 2000000000}, {2, 3, 2000000000}}; }
    if (t == 6) {
        n = 20000;
        for (int i = 0; i + 1 < 19000; i++) e.push_back({i, i + 1, (int)(lcgNext() % 1000000) + 1});
        for (int k = 0; k < 100000; k++) {
            int u = lcgNext() % n, v = lcgNext() % n;
            e.push_back({u, v, (int)(lcgNext() % 1000000) + 1});
        }
    }
    vector<long long> d = dijkstra(n, e, src);
    cout << "\\n@@RESULT@@\\n";
    if (t == 6) {
        // independent check: queue-based relaxation (SPFA)
        vector<vector<pair<int, int>>> adj(n);
        for (size_t i = 0; i < e.size(); i++) adj[e[i][0]].push_back(make_pair(e[i][1], e[i][2]));
        vector<long long> ref(n, -1);
        vector<char> inq(n, 0);
        queue<int> q;
        ref[src] = 0; q.push(src);
        while (!q.empty()) {
            int u = q.front(); q.pop(); inq[u] = 0;
            for (size_t k = 0; k < adj[u].size(); k++) {
                int v = adj[u][k].first;
                long long nd = ref[u] + adj[u][k].second;
                if (ref[v] < 0 || nd < ref[v]) { ref[v] = nd; if (!inq[v]) { inq[v] = 1; q.push(v); } }
            }
        }
        cout << (d == ref ? "match" : "mismatch") << "\\n";
        return 0;
    }
    for (size_t i = 0; i < d.size(); i++) cout << (i ? " " : "") << d[i];
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Small graph', stdin: '1', input: '5 nodes, src 0, node 4 unreachable', expected: '0 3 1 4 -1' },
      { name: 'Single node', stdin: '2', input: 'n=1, no edges', expected: '0' },
      { name: 'Source in the middle', stdin: '3', input: 'src 1, node 0 cannot be reached', expected: '-1 0 5 6' },
      { name: 'Zero weights and parallel edges', stdin: '4', input: '0>1 w0, 0>1 w7, 1>2 w0', expected: '0 0 0' },
      { name: 'Needs long long', stdin: '5', input: 'chain of 3 edges, each 2 000 000 000', expected: '0 2000000000 4000000000 6000000000' },
      { name: 'Large graph', stdin: '6', input: '20 000 nodes, about 119 000 edges', expected: 'match' },
    ],
  },
  {
    id: 's5-bellman-ford',
    title: 'Bellman-Ford',
    kind: 'implement',
    task: 'Shortest distances from <code>src</code> in a directed graph that may have negative edges. Unreachable nodes get <code>LLONG_MAX</code>. If a negative cycle is reachable from <code>src</code>, return an empty vector.',
    example: { input: 'n = 3, edges = {0,1,4} {0,2,5} {1,2,-2}, src = 0', output: '0 4 2' },
    refresher: [
      'Relax every edge, <code>n - 1</code> times. After round k, every shortest path of at most k edges is correct.',
      'One more round: if any reachable edge still improves, a negative cycle is reachable. Skip edges whose start is unreachable.',
    ],
    hints: [
      'Do not relax from a node whose distance is still <code>LLONG_MAX</code>, or the addition overflows.',
      'Stop early if a full round changes nothing.',
      'The extra round after <code>n - 1</code> rounds only needs to detect one improvement.',
    ],
    starter: `// edges[i] = {u, v, w}: directed edge u -> v with weight w (may be negative)
// unreachable = LLONG_MAX, reachable negative cycle = return {}
vector<long long> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    return {};
}`,
    solution: `vector<long long> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    const long long INF = LLONG_MAX;
    vector<long long> dist(n, INF);
    dist[src] = 0;
    for (int round = 0; round < n; round++) {
        bool changed = false;
        for (size_t i = 0; i < edges.size(); i++) {
            int u = edges[i][0], v = edges[i][1];
            if (dist[u] == INF) continue;
            if (dist[u] + edges[i][2] < dist[v]) {
                if (round == n - 1) return {};
                dist[v] = dist[u] + edges[i][2];
                changed = true;
            }
        }
        if (!changed) break;
    }
    return dist;
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    int n = 1, src = 0;
    vector<vector<int>> e;
    vector<int> h;
    if (t == 1) { n = 5; e = {{0, 1, 6}, {0, 2, 7}, {1, 2, 8}, {1, 3, 5}, {1, 4, -4}, {2, 3, -3}, {2, 4, 9}, {3, 1, -2}, {4, 0, 2}, {4, 3, 7}}; }
    if (t == 2) { n = 1; }
    if (t == 3) { n = 3; e = {{0, 1, 1}, {1, 2, -3}, {2, 1, 1}}; }
    if (t == 4) { n = 4; e = {{0, 1, 5}, {2, 3, -1}, {3, 2, -1}}; }
    if (t == 5) { n = 3; e = {{0, 1, -4}}; }
    if (t == 6) { n = 3; e = {{0, 1, 2}, {1, 2, -2}, {2, 1, 2}}; }
    if (t == 7) {
        n = 2000;
        h.resize(n);
        for (int i = 0; i < n; i++) h[i] = lcgNext() % 1000;
        for (int i = 0; i + 1 < n; i++) e.push_back({i, i + 1, (int)(lcgNext() % 1000) + h[i] - h[i + 1]});
        for (int k = 0; k < 8000; k++) {
            int u = lcgNext() % n, v = lcgNext() % n;
            e.push_back({u, v, (int)(lcgNext() % 1000) + h[u] - h[v]});
        }
    }
    if (t == 8) {
        n = 2000;
        for (int i = 0; i + 1 < n; i++) e.push_back({i, i + 1, 1});
        e.push_back({1999, 1000, -1000});
    }
    vector<long long> d = bellmanFord(n, e, src);
    cout << "\\n@@RESULT@@\\n";
    if (d.empty()) { cout << "negative cycle\\n"; return 0; }
    if (t == 7) {
        // independent check: Dijkstra on the re-weighted (non-negative) graph, then undo the shift
        typedef pair<long long, int> P;
        vector<vector<pair<int, int>>> adj(n);
        for (size_t i = 0; i < e.size(); i++) adj[e[i][0]].push_back(make_pair(e[i][1], e[i][2] - h[e[i][0]] + h[e[i][1]]));
        const long long INF = LLONG_MAX;
        vector<long long> ref(n, INF);
        priority_queue<P, vector<P>, greater<P>> pq;
        ref[src] = 0; pq.push(P(0, src));
        while (!pq.empty()) {
            P top = pq.top(); pq.pop();
            if (top.first > ref[top.second]) continue;
            for (size_t k = 0; k < adj[top.second].size(); k++) {
                int v = adj[top.second][k].first;
                long long nd = top.first + adj[top.second][k].second;
                if (nd < ref[v]) { ref[v] = nd; pq.push(P(nd, v)); }
            }
        }
        for (int i = 0; i < n; i++) if (ref[i] != INF) ref[i] += h[src] - h[i];
        cout << (d == ref ? "match" : "mismatch") << "\\n";
        return 0;
    }
    for (size_t i = 0; i < d.size(); i++) {
        if (i) cout << " ";
        if (d[i] == LLONG_MAX) cout << "INF"; else cout << d[i];
    }
    cout << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Negative edges', stdin: '1', input: '5 nodes with negative edges, no negative cycle', expected: '0 2 7 4 -2' },
      { name: 'Single node', stdin: '2', input: 'n=1, no edges', expected: '0' },
      { name: 'Reachable negative cycle', stdin: '3', input: '0>1 w1, 1>2 w-3, 2>1 w1', expected: 'negative cycle' },
      { name: 'Unreachable negative cycle', stdin: '4', input: 'cycle on nodes 2,3 cannot be reached from 0', expected: '0 5 INF INF' },
      { name: 'Unreachable node', stdin: '5', input: '0>1 w-4, node 2 isolated', expected: '0 -4 INF' },
      { name: 'Zero-weight cycle', stdin: '6', input: '0>1 w2, 1>2 w-2, 2>1 w2', expected: '0 2 0' },
      { name: 'Large graph', stdin: '7', input: '2 000 nodes, 10 000 edges, negatives', expected: 'match' },
      { name: 'Large negative cycle', stdin: '8', input: 'chain of 2 000 with a back edge of -1000', expected: 'negative cycle' },
    ],
  },
  {
    id: 's5-kruskal',
    title: 'Kruskal',
    kind: 'implement',
    task: 'Return the total weight of a minimum spanning tree of an undirected weighted graph. If the graph is not connected, return <code>-1</code>. A single node has weight 0.',
    example: { input: 'n = 3, edges = {0,1,1} {1,2,2} {0,2,3}', output: '3' },
    refresher: [
      'Sort edges by weight. Take an edge only if its endpoints are in different union-find sets, then union them.',
      'A spanning tree has exactly <code>n - 1</code> edges; fewer means the graph is disconnected.',
    ],
    hints: [
      'Write a tiny <code>find</code> with path compression and a <code>parent</code> vector inside the function or as a helper.',
      'Self-loops and parallel edges need no special case: the union-find rejects them.',
      'Count accepted edges and compare with <code>n - 1</code>. The total can exceed <code>int</code>.',
    ],
    starter: `// edges[i] = {u, v, w}: undirected edge with weight w, nodes are 0..n-1
long long kruskal(int n, vector<vector<int>>& edges) {
    return 0;
}`,
    solution: `int findRoot(vector<int>& parent, int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}

long long kruskal(int n, vector<vector<int>>& edges) {
    vector<vector<int>> sorted = edges;
    sort(sorted.begin(), sorted.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[2] < b[2];
    });
    vector<int> parent(n);
    for (int i = 0; i < n; i++) parent[i] = i;
    long long total = 0;
    int used = 0;
    for (size_t i = 0; i < sorted.size(); i++) {
        int a = findRoot(parent, sorted[i][0]);
        int b = findRoot(parent, sorted[i][1]);
        if (a == b) continue;
        parent[a] = b;
        total += sorted[i][2];
        used++;
    }
    return used == n - 1 ? total : -1;
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    int n = 1;
    vector<vector<int>> e;
    if (t == 1) { n = 4; e = {{0, 1, 1}, {1, 2, 2}, {0, 2, 3}, {2, 3, 4}, {1, 3, 5}}; }
    if (t == 2) { n = 1; }
    if (t == 3) { n = 4; e = {{0, 1, 1}, {2, 3, 1}}; }
    if (t == 4) { n = 3; e = {{0, 0, 1}, {0, 1, 5}, {0, 1, 2}, {1, 2, 2}, {0, 2, 2}}; }
    if (t == 5) { n = 2; }
    if (t == 6) {
        n = 20000;
        for (int i = 0; i + 1 < n; i++) e.push_back({i, i + 1, (int)(lcgNext() % 1000000) + 1});
        for (int k = 0; k < 100000; k++) {
            int u = lcgNext() % n, v = lcgNext() % n;
            e.push_back({u, v, (int)(lcgNext() % 1000000) + 1});
        }
    }
    long long r = kruskal(n, e);
    cout << "\\n@@RESULT@@\\n";
    if (t == 6) {
        // independent check: Prim with a priority_queue
        typedef pair<int, int> P;
        vector<vector<P>> adj(n);
        for (size_t i = 0; i < e.size(); i++) {
            adj[e[i][0]].push_back(P(e[i][2], e[i][1]));
            adj[e[i][1]].push_back(P(e[i][2], e[i][0]));
        }
        vector<char> seen(n, 0);
        priority_queue<P, vector<P>, greater<P>> pq;
        pq.push(P(0, 0));
        long long total = 0;
        int cnt = 0;
        while (!pq.empty()) {
            P top = pq.top(); pq.pop();
            if (seen[top.second]) continue;
            seen[top.second] = 1; total += top.first; cnt++;
            for (size_t k = 0; k < adj[top.second].size(); k++) if (!seen[adj[top.second][k].second]) pq.push(adj[top.second][k]);
        }
        cout << (cnt == n && r == total ? "match" : "mismatch") << "\\n";
        return 0;
    }
    cout << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Small graph', stdin: '1', input: '4 nodes, 5 edges', expected: '7' },
      { name: 'Single node', stdin: '2', input: 'n=1, no edges', expected: '0' },
      { name: 'Disconnected', stdin: '3', input: '0-1 and 2-3 only', expected: '-1' },
      { name: 'Ties, self-loop, parallel edges', stdin: '4', input: 'n=3 with 0-0, two 0-1 edges, equal weights', expected: '4' },
      { name: 'Two nodes, no edge', stdin: '5', input: 'n=2, no edges', expected: '-1' },
      { name: 'Large graph', stdin: '6', input: '20 000 nodes, about 120 000 edges', expected: 'match' },
    ],
  },
  {
    id: 's5-climbing-stairs',
    title: 'Climbing stairs',
    kind: 'implement',
    task: 'Count the ways to climb <code>n</code> steps taking 1 or 2 steps at a time. There is 1 way to climb 0 steps. Return a <code>long long</code>; <code>n</code> is at most 90.',
    example: { input: 'n = 4', output: '5' },
    refresher: [
      'The last move was a 1-step or a 2-step, so ways(n) = ways(n-1) + ways(n-2).',
      'Only the previous two values matter, so two variables are enough. Base cases: ways(0) = 1, ways(1) = 1.',
    ],
    hints: [
      'Write out ways for n = 0..5 by hand; the pattern shows up immediately.',
      'Loop from 2 to <code>n</code> keeping <code>prev</code> and <code>cur</code>; handle <code>n</code> of 0 and 1 without entering the loop.',
    ],
    starter: `long long climbStairs(int n) {
    return 0;
}`,
    solution: `long long climbStairs(int n) {
    long long prev = 1, cur = 1;
    for (int i = 2; i <= n; i++) {
        long long next = prev + cur;
        prev = cur;
        cur = next;
    }
    return cur;
}`,
    harness: `int main() {
    int t; cin >> t;
    int ns[] = {0, 0, 1, 2, 5, 10, 50, 90};
    long long r = climbStairs(ns[t]);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Zero steps', stdin: '1', input: 'n = 0', expected: '1' },
      { name: 'One step', stdin: '2', input: 'n = 1', expected: '1' },
      { name: 'Two steps', stdin: '3', input: 'n = 2', expected: '2' },
      { name: 'Five steps', stdin: '4', input: 'n = 5', expected: '8' },
      { name: 'Ten steps', stdin: '5', input: 'n = 10', expected: '89' },
      { name: 'Past int', stdin: '6', input: 'n = 50', expected: '20365011074' },
      { name: 'Near the long long limit', stdin: '7', input: 'n = 90', expected: '4660046610375530309' },
    ],
  },
  {
    id: 's5-house-robber',
    title: 'House robber',
    kind: 'implement',
    task: 'Each house holds a non-negative amount of money. Return the largest total you can take without robbing two adjacent houses. An empty street gives 0.',
    example: { input: '[2, 7, 9, 3, 1]', output: '12' },
    refresher: [
      'best(i) is the larger of: skip house i (best(i-1)), or rob it (a[i] + best(i-2)).',
      'Only the last two values are needed. Greedy picks like "take the biggest" fail.',
    ],
    hints: [
      'Try <code>[2, 1, 1, 2]</code> by hand: the answer is not what taking the largest gives you.',
      'Keep two variables, the best up to the previous house and the best up to the one before it.',
    ],
    starter: `int rob(vector<int>& a) {
    return 0;
}`,
    solution: `int rob(vector<int>& a) {
    int skip = 0, take = 0;
    for (size_t i = 0; i < a.size(); i++) {
        int now = max(take, skip + a[i]);
        skip = take;
        take = now;
    }
    return take;
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    vector<int> a;
    if (t == 1) a = {2, 7, 9, 3, 1};
    if (t == 2) a = {};
    if (t == 3) a = {5};
    if (t == 4) a = {1, 2, 3, 1};
    if (t == 5) a = {2, 1, 1, 2};
    if (t == 6) a = {4, 4, 4, 4};
    if (t == 7) a = {0, 0, 0};
    if (t == 8) for (int i = 0; i < 100000; i++) a.push_back(lcgNext() % 1000);
    int r = rob(a);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: '2 7 9 3 1', expected: '12' },
      { name: 'Empty street', stdin: '2', input: '(empty)', expected: '0' },
      { name: 'One house', stdin: '3', input: '5', expected: '5' },
      { name: 'Small', stdin: '4', input: '1 2 3 1', expected: '4' },
      { name: 'Greedy trap', stdin: '5', input: '2 1 1 2', expected: '4' },
      { name: 'Ties', stdin: '6', input: '4 4 4 4', expected: '8' },
      { name: 'All zeros', stdin: '7', input: '0 0 0', expected: '0' },
      { name: 'Large', stdin: '8', input: '100 000 values below 1000', expected: '29327632' },
    ],
  },
  {
    id: 's5-coin-change',
    title: 'Coin change',
    kind: 'implement',
    task: 'Return the fewest coins that add up to <code>amount</code>, using any coin value any number of times. Return <code>-1</code> if it is impossible. Amount 0 needs 0 coins.',
    example: { input: 'coins = [1, 2, 5], amount = 11', output: '3' },
    refresher: [
      'fewest(x) = 1 + the smallest fewest(x - c) over coins c with c &lt;= x. fewest(0) = 0.',
      'Mark unreachable amounts with a large sentinel and never build on it. Greedy (biggest coin first) can be wrong.',
    ],
    hints: [
      'Fill a table <code>dp[0..amount]</code> from small to large amounts; start with <code>dp[0] = 0</code>.',
      'For <code>coins = [1, 3, 4]</code> and amount 6 the answer is 2, not 3.',
      'Pick a sentinel like <code>amount + 1</code> so adding 1 cannot overflow.',
    ],
    starter: `int coinChange(vector<int>& coins, int amount) {
    return 0;
}`,
    solution: `int coinChange(vector<int>& coins, int amount) {
    const int INF = amount + 1;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++) {
        for (size_t i = 0; i < coins.size(); i++) {
            int c = coins[i];
            if (c <= x && dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1;
        }
    }
    return dp[amount] >= INF ? -1 : dp[amount];
}`,
    harness: `int main() {
    int t; cin >> t;
    vector<int> coins;
    int amount = 0;
    if (t == 1) { coins = {1, 2, 5}; amount = 11; }
    if (t == 2) { coins = {2}; amount = 3; }
    if (t == 3) { coins = {5}; amount = 0; }
    if (t == 4) { coins = {1, 3, 4}; amount = 6; }
    if (t == 5) { coins = {}; amount = 7; }
    if (t == 6) { coins = {186, 419, 83, 408}; amount = 6249; }
    if (t == 7) { coins = {3, 7, 11, 13, 17, 101}; amount = 100000; }
    if (t == 8) { coins = {5}; amount = 3; }
    int r = coinChange(coins, amount);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: 'coins 1 2 5, amount 11', expected: '3' },
      { name: 'Impossible', stdin: '2', input: 'coins 2, amount 3', expected: '-1' },
      { name: 'Amount zero', stdin: '3', input: 'coins 5, amount 0', expected: '0' },
      { name: 'Greedy fails', stdin: '4', input: 'coins 1 3 4, amount 6', expected: '2' },
      { name: 'No coins', stdin: '5', input: 'coins (none), amount 7', expected: '-1' },
      { name: 'Awkward coins', stdin: '6', input: 'coins 186 419 83 408, amount 6249', expected: '20' },
      { name: 'Coin bigger than amount', stdin: '8', input: 'coins 5, amount 3', expected: '-1' },
      { name: 'Large amount', stdin: '7', input: 'six coins, amount 100 000', expected: '992' },
    ],
  },
  {
    id: 's5-knapsack',
    title: '0/1 knapsack',
    kind: 'implement',
    task: 'Each item <code>i</code> has weight <code>w[i]</code> and value <code>v[i]</code> and can be taken at most once. Return the largest total value whose total weight is at most <code>cap</code>.',
    example: { input: 'w = [1, 3, 4, 5], v = [1, 4, 5, 7], cap = 7', output: '9' },
    refresher: [
      'best(i, c) = the better of skipping item i, or taking it: v[i] + best(i-1, c - w[i]) when w[i] &lt;= c.',
      'With a 1D table over capacities, loop the capacity downward so each item is used once.',
    ],
    hints: [
      'Start from <code>dp[c] = 0</code> for every capacity, then process items one at a time.',
      'Inner loop: <code>c</code> from <code>cap</code> down to <code>w[i]</code>. Going upward would reuse the item.',
      'Picking by value-per-weight is wrong: try weights 10, 20, 30 with values 60, 100, 120 and cap 50.',
    ],
    starter: `int knapsack(vector<int>& w, vector<int>& v, int cap) {
    return 0;
}`,
    solution: `int knapsack(vector<int>& w, vector<int>& v, int cap) {
    vector<int> dp(cap + 1, 0);
    for (size_t i = 0; i < w.size(); i++) {
        for (int c = cap; c >= w[i]; c--) {
            dp[c] = max(dp[c], dp[c - w[i]] + v[i]);
        }
    }
    return dp[cap];
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    vector<int> w, v;
    int cap = 0;
    if (t == 1) { w = {1, 3, 4, 5}; v = {1, 4, 5, 7}; cap = 7; }
    if (t == 2) { cap = 10; }
    if (t == 3) { w = {1, 2}; v = {5, 6}; cap = 0; }
    if (t == 4) { w = {10}; v = {100}; cap = 5; }
    if (t == 5) { w = {10, 20, 30}; v = {60, 100, 120}; cap = 50; }
    if (t == 6) { w = {2, 2, 2}; v = {3, 3, 3}; cap = 5; }
    if (t == 7) {
        cap = 5000;
        for (int i = 0; i < 200; i++) {
            int wi = lcgNext() % 100 + 1;
            int vi = lcgNext() % 1000 + 1;
            w.push_back(wi); v.push_back(vi);
        }
    }
    int r = knapsack(w, v, cap);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: 'w 1 3 4 5, v 1 4 5 7, cap 7', expected: '9' },
      { name: 'No items', stdin: '2', input: 'cap 10, no items', expected: '0' },
      { name: 'Capacity zero', stdin: '3', input: 'two items, cap 0', expected: '0' },
      { name: 'Item too heavy', stdin: '4', input: 'w 10, v 100, cap 5', expected: '0' },
      { name: 'Value-per-weight trap', stdin: '5', input: 'w 10 20 30, v 60 100 120, cap 50', expected: '220' },
      { name: 'Equal items, odd capacity', stdin: '6', input: 'three items w 2 v 3, cap 5', expected: '6' },
      { name: 'Large', stdin: '7', input: '200 items, capacity 5000', expected: '79356' },
    ],
  },
  {
    id: 's5-lis',
    title: 'Longest increasing subsequence',
    kind: 'implement',
    task: 'Return the length of the longest strictly increasing subsequence of <code>a</code>. A subsequence keeps the order but may skip elements. Empty input gives 0.',
    example: { input: '[10, 9, 2, 5, 3, 7, 101, 18]', output: '4' },
    refresher: [
      'O(n^2): len[i] = 1 + the largest len[j] over earlier j with a[j] &lt; a[i]. The answer is the maximum len.',
      'Equal values do not extend a strictly increasing run.',
    ],
    hints: [
      'Start every <code>len[i]</code> at 1, then scan all <code>j &lt; i</code>.',
      'The answer is the maximum over all <code>len[i]</code>, not <code>len.back()</code>.',
      'Faster: keep a vector <code>tails</code> where <code>tails[k]</code> is the smallest tail of any increasing run of length k+1. For each value, <code>lower_bound</code> it: replace that slot, or append if it is past the end.',
    ],
    starter: `int lis(vector<int>& a) {
    return 0;
}`,
    solution: `int lis(vector<int>& a) {
    vector<int> tails;
    for (size_t i = 0; i < a.size(); i++) {
        vector<int>::iterator it = lower_bound(tails.begin(), tails.end(), a[i]);
        if (it == tails.end()) tails.push_back(a[i]);
        else *it = a[i];
    }
    return (int)tails.size();
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    vector<int> a;
    if (t == 1) a = {10, 9, 2, 5, 3, 7, 101, 18};
    if (t == 2) a = {};
    if (t == 3) a = {7};
    if (t == 4) a = {5, 5, 5, 5};
    if (t == 5) a = {5, 4, 3, 2, 1};
    if (t == 6) a = {0, 1, 0, 3, 2, 3};
    if (t == 7) a = {-3, -1, -2, 0};
    if (t == 8) for (int i = 0; i < 5000; i++) a.push_back(i);
    if (t == 9) for (int i = 0; i < 5000; i++) a.push_back(lcgNext() % 100000);
    int r = lis(a);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: '10 9 2 5 3 7 101 18', expected: '4' },
      { name: 'Empty', stdin: '2', input: '(empty)', expected: '0' },
      { name: 'One value', stdin: '3', input: '7', expected: '1' },
      { name: 'All equal', stdin: '4', input: '5 5 5 5', expected: '1' },
      { name: 'Descending', stdin: '5', input: '5 4 3 2 1', expected: '1' },
      { name: 'Repeats', stdin: '6', input: '0 1 0 3 2 3', expected: '4' },
      { name: 'Negatives', stdin: '7', input: '-3 -1 -2 0', expected: '3' },
      { name: 'Already sorted, large', stdin: '8', input: '0 1 2 ... 4999', expected: '5000' },
      { name: 'Random, large', stdin: '9', input: '5 000 random values', expected: '133' },
    ],
  },
  {
    id: 's5-lcs',
    title: 'Longest common subsequence',
    kind: 'implement',
    task: 'Return the length of the longest common subsequence of strings <code>a</code> and <code>b</code>. A subsequence keeps the order but may skip characters.',
    example: { input: '"abcde", "ace"', output: '3' },
    refresher: [
      'dp[i][j] is the answer for the first i characters of a and first j of b.',
      'If a[i-1] equals b[j-1], extend the diagonal: dp[i-1][j-1] + 1. Otherwise take the larger of dp[i-1][j] and dp[i][j-1].',
    ],
    hints: [
      'Make the table <code>(a.size() + 1) x (b.size() + 1)</code>; row 0 and column 0 stay 0.',
      'Fill row by row; each cell reads only its top, left and top-left neighbours.',
      'The answer is the bottom-right cell.',
    ],
    starter: `int lcs(const string& a, const string& b) {
    return 0;
}`,
    solution: `int lcs(const string& a, const string& b) {
    int n = a.size(), m = b.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n][m];
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    string a, b;
    if (t == 1) { a = "abcde"; b = "ace"; }
    if (t == 2) { a = ""; b = "abc"; }
    if (t == 3) { a = ""; b = ""; }
    if (t == 4) { a = "banana"; b = "banana"; }
    if (t == 5) { a = "abc"; b = "xyz"; }
    if (t == 6) { a = "AGGTAB"; b = "GXTXAYB"; }
    if (t == 7) { a = "abcba"; b = "abcbcba"; }
    if (t == 8) {
        for (int i = 0; i < 2000; i++) a += (char)('a' + lcgNext() % 4);
        for (int i = 0; i < 1800; i++) b += (char)('a' + lcgNext() % 4);
    }
    int r = lcs(a, b);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: '"abcde", "ace"', expected: '3' },
      { name: 'One empty', stdin: '2', input: '"", "abc"', expected: '0' },
      { name: 'Both empty', stdin: '3', input: '"", ""', expected: '0' },
      { name: 'Identical', stdin: '4', input: '"banana", "banana"', expected: '6' },
      { name: 'Nothing in common', stdin: '5', input: '"abc", "xyz"', expected: '0' },
      { name: 'Classic', stdin: '6', input: '"AGGTAB", "GXTXAYB"', expected: '4' },
      { name: 'Repeated letters', stdin: '7', input: '"abcba", "abcbcba"', expected: '5' },
      { name: 'Large', stdin: '8', input: '2 000 and 1 800 random letters a-d', expected: '1752' },
    ],
  },
  {
    id: 's5-edit-distance',
    title: 'Edit distance',
    kind: 'implement',
    task: 'Return the fewest single-character insertions, deletions and replacements that turn string <code>a</code> into string <code>b</code>.',
    example: { input: '"horse", "ros"', output: '3' },
    refresher: [
      'dp[i][j] is the distance between the first i characters of a and first j of b.',
      'Equal last characters: copy dp[i-1][j-1]. Otherwise 1 + the smallest of delete (dp[i-1][j]), insert (dp[i][j-1]), replace (dp[i-1][j-1]).',
    ],
    hints: [
      'Base cases: <code>dp[i][0] = i</code> and <code>dp[0][j] = j</code>, since an empty string needs that many inserts or deletes.',
      'Fill the table row by row, the same shape as longest common subsequence.',
      'The answer is <code>dp[a.size()][b.size()]</code>.',
    ],
    starter: `int editDistance(const string& a, const string& b) {
    return 0;
}`,
    solution: `int editDistance(const string& a, const string& b) {
    int n = a.size(), m = b.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min(dp[i - 1][j - 1], min(dp[i - 1][j], dp[i][j - 1]));
        }
    }
    return dp[n][m];
}`,
    harness: `static unsigned lcgX = 12345;
static unsigned lcgNext() { lcgX = lcgX * 1103515245u + 12345u; return lcgX >> 8; }

int main() {
    int t; cin >> t;
    string a, b;
    if (t == 1) { a = "horse"; b = "ros"; }
    if (t == 2) { a = "intention"; b = "execution"; }
    if (t == 3) { a = ""; b = "abc"; }
    if (t == 4) { a = "abc"; b = ""; }
    if (t == 5) { a = ""; b = ""; }
    if (t == 6) { a = "same"; b = "same"; }
    if (t == 7) { a = "kitten"; b = "sitting"; }
    if (t == 8) {
        for (int i = 0; i < 2000; i++) a += (char)('a' + lcgNext() % 4);
        for (int i = 0; i < 1800; i++) b += (char)('a' + lcgNext() % 4);
    }
    int r = editDistance(a, b);
    cout << "\\n@@RESULT@@\\n" << r << "\\n";
    return 0;
}`,
    tests: [
      { name: 'Example', stdin: '1', input: '"horse", "ros"', expected: '3' },
      { name: 'Longer words', stdin: '2', input: '"intention", "execution"', expected: '5' },
      { name: 'Empty to word', stdin: '3', input: '"", "abc"', expected: '3' },
      { name: 'Word to empty', stdin: '4', input: '"abc", ""', expected: '3' },
      { name: 'Both empty', stdin: '5', input: '"", ""', expected: '0' },
      { name: 'Equal', stdin: '6', input: '"same", "same"', expected: '0' },
      { name: 'Classic', stdin: '7', input: '"kitten", "sitting"', expected: '3' },
      { name: 'Large', stdin: '8', input: '2 000 and 1 800 random letters a-d', expected: '296' },
    ],
  },
]
