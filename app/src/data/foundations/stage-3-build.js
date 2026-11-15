// Lessons for this stage. Format: docs/superpowers/specs/2026-11-15-foundations-track-design.md
export const LESSONS = [
  {
    id: 's3-dynamic-array',
    title: 'Dynamic array',
    kind: 'implement',
    task: 'Build <code>IntArray</code> on a raw <code>int*</code>. It grows by doubling and frees its memory in the destructor. <code>std::vector</code> is off the table.',
    refresher: [
      'Keep <code>size_</code> (used) and <code>cap_</code> (allocated). When they are equal, allocate <code>2 * cap_</code>, copy, <code>delete[]</code> the old block.',
      'Every <code>new[]</code> needs exactly one <code>delete[]</code>, including in the destructor.',
    ],
    hints: [
      'Write the constructor first: capacity 1, size 0, one <code>new int[1]</code>.',
      'Grow before writing the new element, not after.',
      'Copy with a loop over the old <code>size_</code> elements, delete the old block, then swap in the new pointer.',
    ],
    forbidden: [{ pattern: '\\bvector\\b', message: 'Build it yourself: std::vector is off the table here.' }],
    starter: `class IntArray {
    int* data_;
    int size_;
    int cap_;
public:
    IntArray() { }                       // capacity starts at 1
    ~IntArray() { }
    IntArray(const IntArray&) = delete;
    IntArray& operator=(const IntArray&) = delete;

    void push_back(int v) { }            // doubles the capacity when full
    void pop_back() { }                  // does nothing when empty; never shrinks
    int& operator[](int i) { return data_[i]; }   // unchecked
    int at(int i) const { return -1; }   // -1 when i is out of range
    int size() const { return 0; }
    int capacity() const { return 0; }
    bool empty() const { return true; }
};`,
    solution: `class IntArray {
    int* data_;
    int size_;
    int cap_;
public:
    IntArray() : data_(new int[1]), size_(0), cap_(1) {}
    ~IntArray() { delete[] data_; }
    IntArray(const IntArray&) = delete;
    IntArray& operator=(const IntArray&) = delete;

    void push_back(int v) {
        if (size_ == cap_) {
            int* bigger = new int[cap_ * 2];
            for (int i = 0; i < size_; i++) bigger[i] = data_[i];
            delete[] data_;
            data_ = bigger;
            cap_ *= 2;
        }
        data_[size_++] = v;
    }
    void pop_back() { if (size_ > 0) size_--; }
    int& operator[](int i) { return data_[i]; }
    int at(int i) const { return (i >= 0 && i < size_) ? data_[i] : -1; }
    int size() const { return size_; }
    int capacity() const { return cap_; }
    bool empty() const { return size_ == 0; }
};`,
    harness: `static string dump(IntArray& a) {
    string s = "[";
    for (int i = 0; i < a.size(); i++) { if (i) s += " "; s += to_string(a[i]); }
    return s + "]";
}

int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        IntArray a;
        vector<int> m;
        unsigned seed = 12345;
        int maxCap = 0;
        string bad;
        for (int op = 0; op < 60000 && bad.empty(); op++) {
            seed = seed * 1103515245u + 12345u;
            unsigned r = (seed >> 8) & 0xFFFFFF;
            int kind = r % 10;
            if (kind < 6) { int v = (r >> 4) % 1000; a.push_back(v); m.push_back(v); }
            else if (kind < 8) { a.pop_back(); if (!m.empty()) m.pop_back(); }
            else if (!m.empty()) { int i = (r >> 4) % m.size(); int v = (r >> 8) % 1000; a[i] = v; m[i] = v; }
            int c = a.capacity();
            if (a.size() != (int)m.size() || a.empty() != m.empty()) bad = "size at op " + to_string(op);
            else if (c < a.size() || c < maxCap || (c & (c - 1)) != 0) bad = "capacity at op " + to_string(op);
            else if (!m.empty() && (a[m.size() - 1] != m.back() || a.at(m.size() - 1) != m.back())) bad = "back at op " + to_string(op);
            else if (op % 1000 == 0) { for (size_t i = 0; i < m.size(); i++) if (a[i] != m[i]) { bad = "content at op " + to_string(op); break; } }
            if (c > maxCap) maxCap = c;
        }
        long long sum = 0;
        for (size_t i = 0; i < m.size(); i++) { sum += m[i]; if (bad.empty() && a[i] != m[i]) bad = "final content"; }
        if (bad.empty()) out << "ok size=" << m.size() << " sum=" << sum;
        else out << "bad: " << bad;
    } else {
        IntArray a;
        istringstream in(line);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            if (tok.compare(0, 4, "push") == 0) { a.push_back(stoi(tok.substr(4))); continue; }
            else if (tok == "pop") { a.pop_back(); continue; }
            else if (tok.compare(0, 3, "set") == 0) { size_t c = tok.find(':'); a[stoi(tok.substr(3, c - 3))] = stoi(tok.substr(c + 1)); continue; }
            else if (tok.compare(0, 3, "get") == 0) r = to_string(a[stoi(tok.substr(3))]);
            else if (tok.compare(0, 2, "at") == 0) r = to_string(a.at(stoi(tok.substr(2))));
            else if (tok == "size") r = to_string(a.size());
            else if (tok == "cap") r = to_string(a.capacity());
            else if (tok == "empty") r = a.empty() ? "T" : "F";
            else if (tok == "dump") r = dump(a);
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Five pushes', stdin: 'push1 push2 push3 push4 push5 size cap dump', input: 'push 1..5, size, capacity, dump', expected: '5 8 [1 2 3 4 5]' },
      { name: 'Empty array', stdin: 'size cap empty pop at0 size', input: 'size, capacity, empty, pop_back, at(0), size', expected: '0 1 T -1 0' },
      { name: 'Single element', stdin: 'push42 get0 at0 pop empty cap size', input: 'push 42, [0], at(0), pop, empty, capacity, size', expected: '42 42 T 1 0' },
      { name: 'Capacity doubles', stdin: 'push1 cap push1 cap push1 cap push1 cap push1 cap push1 cap push1 cap push1 cap push1 cap', input: 'push 9 times, capacity after each', expected: '1 2 4 4 8 8 8 8 16' },
      { name: 'Write and bounds', stdin: 'push1 push2 push3 set1:20 get1 at1 at3 at-1 at2 dump', input: 'a[1] = 20, then get, at in and out of range', expected: '20 20 -1 -1 3 [1 20 3]' },
      { name: 'Pop past empty, refill', stdin: 'push1 push2 push3 pop pop pop pop empty push9 dump cap', input: 'push 3, pop 4 times, push 9, dump, capacity', expected: 'T [9] 4' },
      { name: 'Stress', stdin: 'stress', input: '60 000 random push / pop / write operations', expected: 'ok size=24014 sum=11991224' },
    ],
  },
  {
    id: 's3-linked-list',
    title: 'Linked list',
    kind: 'implement',
    task: 'Build a singly linked <code>LinkedList</code> of ints from your own nodes. <code>std::list</code> is off the table.',
    refresher: [
      'A node holds a value and a <code>next</code> pointer; the list holds <code>head_</code>. <code>nullptr</code> ends the chain.',
      'To remove, walk with a <code>prev</code> pointer and re-link around the match. Removing the head is its own case.',
    ],
    hints: [
      '<code>pushFront</code>: the new node points at the old head, then it becomes the head.',
      'In <code>remove</code>, stop after the first match; later duplicates stay.',
      'If you keep a tail pointer, update it when the last node is removed or the list becomes empty.',
    ],
    forbidden: [{ pattern: '\\b(forward_)?list\\s*<', message: 'Build it yourself: std::list is off the table here.' }],
    starter: `class LinkedList {
    struct Node {
        int val;
        Node* next;
    };
    Node* head_;
    int size_;
public:
    LinkedList() { }
    ~LinkedList() { }                    // free every node
    LinkedList(const LinkedList&) = delete;
    LinkedList& operator=(const LinkedList&) = delete;

    void pushFront(int v) { }
    void pushBack(int v) { }
    bool contains(int v) const { return false; }
    bool remove(int v) { return false; }  // first match only; true if removed
    int size() const { return 0; }
    vector<int> toVector() const { return {}; }   // head to tail
};`,
    solution: `class LinkedList {
    struct Node {
        int val;
        Node* next;
    };
    Node* head_;
    Node* tail_;
    int size_;
public:
    LinkedList() : head_(nullptr), tail_(nullptr), size_(0) {}
    ~LinkedList() {
        while (head_) {
            Node* next = head_->next;
            delete head_;
            head_ = next;
        }
    }
    LinkedList(const LinkedList&) = delete;
    LinkedList& operator=(const LinkedList&) = delete;

    void pushFront(int v) {
        Node* n = new Node{v, head_};
        head_ = n;
        if (!tail_) tail_ = n;
        size_++;
    }
    void pushBack(int v) {
        Node* n = new Node{v, nullptr};
        if (tail_) tail_->next = n;
        else head_ = n;
        tail_ = n;
        size_++;
    }
    bool contains(int v) const {
        for (Node* p = head_; p; p = p->next)
            if (p->val == v) return true;
        return false;
    }
    bool remove(int v) {
        Node* prev = nullptr;
        for (Node* p = head_; p; prev = p, p = p->next) {
            if (p->val != v) continue;
            if (prev) prev->next = p->next;
            else head_ = p->next;
            if (p == tail_) tail_ = prev;
            delete p;
            size_--;
            return true;
        }
        return false;
    }
    int size() const { return size_; }
    vector<int> toVector() const {
        vector<int> out;
        for (Node* p = head_; p; p = p->next) out.push_back(p->val);
        return out;
    }
};`,
    harness: `static string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) { if (i) s += " "; s += to_string(v[i]); }
    return s + "]";
}

int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        LinkedList l;
        vector<int> m;
        unsigned seed = 4242;
        string bad;
        long long sum = 0;
        for (int op = 0; op < 20000 && bad.empty(); op++) {
            seed = seed * 1103515245u + 12345u;
            unsigned r = (seed >> 8) & 0xFFFFFF;
            int kind = r % 10, v = (r >> 4) % 60;
            if (kind < 3) { l.pushFront(v); m.insert(m.begin(), v); }
            else if (kind < 6) { l.pushBack(v); m.push_back(v); }
            else if (kind < 9) {
                bool want = false;
                for (size_t i = 0; i < m.size(); i++) if (m[i] == v) { m.erase(m.begin() + i); want = true; break; }
                if (l.remove(v) != want) bad = "remove at op " + to_string(op);
            } else {
                bool want = find(m.begin(), m.end(), v) != m.end();
                if (l.contains(v) != want) bad = "contains at op " + to_string(op);
            }
            if (bad.empty() && l.size() != (int)m.size()) bad = "size at op " + to_string(op);
            if (bad.empty() && op % 500 == 0 && l.toVector() != m) bad = "order at op " + to_string(op);
        }
        if (bad.empty() && l.toVector() != m) bad = "final order";
        for (size_t i = 0; i < m.size(); i++) sum += m[i] * (long long)(i + 1);
        if (bad.empty()) out << "ok size=" << m.size() << " checksum=" << sum;
        else out << "bad: " << bad;
    } else {
        LinkedList l;
        istringstream in(line);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            char c = tok[0];
            if (tok == "size") r = to_string(l.size());
            else if (tok == "dump") r = show(l.toVector());
            else if (c == 'f') { l.pushFront(stoi(tok.substr(1))); continue; }
            else if (c == 'b') { l.pushBack(stoi(tok.substr(1))); continue; }
            else if (c == 'c') r = l.contains(stoi(tok.substr(1))) ? "T" : "F";
            else if (c == 'r') r = l.remove(stoi(tok.substr(1))) ? "T" : "F";
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'pushFront order', stdin: 'f1 f2 f3 dump', input: 'pushFront 1, 2, 3, dump', expected: '[3 2 1]' },
      { name: 'pushBack order', stdin: 'b1 b2 b3 dump', input: 'pushBack 1, 2, 3, dump', expected: '[1 2 3]' },
      { name: 'Mixed pushes', stdin: 'f2 b3 f1 b4 dump size', input: 'pushFront 2, pushBack 3, pushFront 1, pushBack 4, dump, size', expected: '[1 2 3 4] 4' },
      { name: 'Empty list', stdin: 'dump size c5 r5', input: 'dump, size, contains 5, remove 5', expected: '[] 0 F F' },
      { name: 'contains', stdin: 'b4 b8 b15 c4 c15 c8 c16', input: 'pushBack 4 8 15, contains 4 15 8 16', expected: 'T T T F' },
      { name: 'Remove head, tail, middle', stdin: 'b1 b2 b3 b4 r1 dump r4 dump r3 dump', input: 'list 1 2 3 4: remove 1, 4, 3 with dump after each', expected: 'T [2 3 4] T [2 3] T [2]' },
      { name: 'Duplicates: first match only', stdin: 'b7 b1 b7 b2 b7 r7 dump r7 dump r7 dump r7 dump', input: 'list 7 1 7 2 7: remove 7 four times', expected: 'T [1 7 2 7] T [1 2 7] T [1 2] F [1 2]' },
      { name: 'Missing value', stdin: 'b1 b2 r9 dump size', input: 'list 1 2: remove 9, dump, size', expected: 'F [1 2] 2' },
      { name: 'Drain, then reuse', stdin: 'b1 r1 dump size b2 f3 dump b4 r4 b5 dump', input: 'remove the only node, push again, remove the tail, pushBack', expected: 'T [] 0 [3 2] T [3 2 5]' },
      { name: 'Stress', stdin: 'stress', input: '20 000 random operations against a vector model', expected: 'ok size=6075 checksum=535491053' },
    ],
  },
  {
    id: 's3-reverse-list',
    title: 'Reverse a linked list',
    kind: 'implement',
    task: 'Reverse the list in place and return the new head. Reuse the existing nodes: do not allocate new ones.',
    refresher: [
      'Walk once with <code>prev</code>, <code>cur</code> and a saved <code>next</code>. Flip <code>cur-&gt;next</code> to point at <code>prev</code>, then advance all three.',
      'An empty list and a single node are already reversed.',
    ],
    hints: [
      'Save <code>cur-&gt;next</code> before you overwrite it, or you lose the rest of the list.',
      'Start with <code>prev = nullptr</code>. When <code>cur</code> becomes null, <code>prev</code> is the new head.',
    ],
    starter: `struct Node {
    int val;
    Node* next;
};

// Reverse the list in place; return the new head.
Node* reverseList(Node* head) {
    return head;
}`,
    solution: `struct Node {
    int val;
    Node* next;
};

Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* cur = head;
    while (cur) {
        Node* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
    harness: `int main() {
    string line;
    getline(cin, line);
    vector<int> vals;
    bool stress = (line == "stress");
    if (stress) {
        unsigned seed = 777;
        for (int i = 0; i < 10000; i++) { seed = seed * 1103515245u + 12345u; vals.push_back((seed >> 8) % 100000); }
    } else {
        istringstream in(line);
        int v;
        while (in >> v) vals.push_back(v);
    }
    int n = (int)vals.size();
    Node* head = nullptr;
    for (int i = n - 1; i >= 0; i--) { Node* x = new Node(); x->val = vals[i]; x->next = head; head = x; }
    vector<Node*> orig;
    for (Node* p = head; p; p = p->next) orig.push_back(p);

    Node* r = reverseList(head);

    vector<Node*> after;
    int steps = 0;
    for (Node* p = r; p && steps <= n; p = p->next, steps++) after.push_back(p);
    ostringstream out;
    bool cycle = steps > n;
    bool sameNodes = !cycle && (int)after.size() == n;
    for (int i = 0; sameNodes && i < n; i++) if (after[i] != orig[n - 1 - i]) sameNodes = false;
    if (stress) {
        out << (sameNodes ? "ok " + to_string(n) : "bad");
    } else if (cycle) {
        out << "cycle in result";
    } else {
        out << "[";
        for (size_t i = 0; i < after.size(); i++) out << (i ? " " : "") << after[i]->val;
        out << "]";
        if (!sameNodes) out << " (not the same nodes reversed)";
    }
    for (size_t i = 0; i < orig.size(); i++) delete orig[i];
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Five nodes', stdin: '1 2 3 4 5', input: '1 2 3 4 5', expected: '[5 4 3 2 1]' },
      { name: 'Empty list', stdin: '', input: '(empty)', expected: '[]' },
      { name: 'Single node', stdin: '9', input: '9', expected: '[9]' },
      { name: 'Two nodes', stdin: '4 7', input: '4 7', expected: '[7 4]' },
      { name: 'Even length, repeats', stdin: '3 3 1 1 2 2', input: '3 3 1 1 2 2', expected: '[2 2 1 1 3 3]' },
      { name: 'Large list', stdin: 'stress', input: '10 000 nodes, must reuse the same nodes', expected: 'ok 10000' },
    ],
  },
  {
    id: 's3-stack',
    title: 'Stack',
    kind: 'implement',
    task: 'Build <code>IntStack</code> with push, pop, top, size and empty. Use your own array or a <code>vector</code>; <code>std::stack</code> is off the table.',
    refresher: [
      'Last in, first out: push and pop both work at the same end.',
      'Back it with a <code>vector&lt;int&gt;</code> and treat its end as the top, or keep an array plus a size counter.',
    ],
    hints: [
      'The top is the last stored element. <code>pop</code> just shrinks the stored size by one.',
      'Check <code>empty()</code> before reading or removing anything.',
    ],
    forbidden: [{ pattern: '\\bstack\\s*<', message: 'Build it yourself: std::stack is off the table here.' }],
    starter: `class IntStack {
    // your storage here
public:
    void push(int v) { }
    void pop() { }                // does nothing when empty
    int top() const { return -1; } // -1 when empty
    int size() const { return 0; }
    bool empty() const { return true; }
};`,
    solution: `class IntStack {
    vector<int> data_;
public:
    void push(int v) { data_.push_back(v); }
    void pop() { if (!data_.empty()) data_.pop_back(); }
    int top() const { return data_.empty() ? -1 : data_.back(); }
    int size() const { return (int)data_.size(); }
    bool empty() const { return data_.empty(); }
};`,
    harness: `int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        IntStack s;
        stack<int> m;
        unsigned seed = 99;
        string bad;
        long long sum = 0;
        for (int op = 0; op < 50000 && bad.empty(); op++) {
            seed = seed * 1103515245u + 12345u;
            unsigned r = (seed >> 8) & 0xFFFFFF;
            int kind = r % 10;
            if (kind < 5) { int v = (int)((r >> 4) % 2001) - 1000; s.push(v); m.push(v); }
            else if (kind < 8) { s.pop(); if (!m.empty()) m.pop(); }
            int want = m.empty() ? -1 : m.top();
            if (s.top() != want) bad = "top at op " + to_string(op);
            else if (s.size() != (int)m.size() || s.empty() != m.empty()) bad = "size at op " + to_string(op);
            sum += want;
        }
        if (bad.empty()) out << "ok size=" << m.size() << " checksum=" << sum;
        else out << "bad: " << bad;
    } else {
        IntStack s;
        istringstream in(line);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            if (tok.compare(0, 4, "push") == 0) { s.push(stoi(tok.substr(4))); continue; }
            else if (tok == "pop") { s.pop(); continue; }
            else if (tok == "top") r = to_string(s.top());
            else if (tok == "size") r = to_string(s.size());
            else if (tok == "empty") r = s.empty() ? "T" : "F";
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Push and top', stdin: 'push5 push3 push8 top size', input: 'push 5 3 8, top, size', expected: '8 3' },
      { name: 'Last in, first out', stdin: 'push1 push2 push3 top pop top pop top pop empty', input: 'push 1 2 3, then top and pop three times, empty', expected: '3 2 1 T' },
      { name: 'Empty stack', stdin: 'empty top size pop top size', input: 'empty, top, size, pop, top, size on a new stack', expected: 'T -1 0 -1 0' },
      { name: 'Single element', stdin: 'push7 top pop empty push4 top size', input: 'push 7, top, pop, empty, push 4, top, size', expected: '7 T 4 1' },
      { name: 'Interleaved', stdin: 'push1 push2 pop push3 push4 pop pop top size', input: 'push 1 2, pop, push 3 4, pop, pop, top, size', expected: '1 1' },
      { name: 'Value -1 is a real value', stdin: 'push-1 top empty pop empty', input: 'push -1, top, empty, pop, empty', expected: '-1 F T' },
      { name: 'Stress', stdin: 'stress', input: '50 000 random operations against std::stack', expected: 'ok size=10225 checksum=248201' },
    ],
  },
  {
    id: 's3-circular-queue',
    title: 'Circular queue',
    kind: 'implement',
    task: 'Build <code>RingQueue</code>, a fixed-capacity queue on a ring buffer. A full queue refuses new values. <code>std::queue</code> and <code>std::deque</code> are off the table.',
    refresher: [
      'Keep <code>head_</code> (index of the front) and <code>count_</code>. The next free slot is <code>(head_ + count_) % cap</code>.',
      'Moving an index forward is <code>i = (i + 1) % cap</code>. That is the wraparound.',
    ],
    hints: [
      'Track <code>count_</code> rather than comparing head and tail; it removes the full-or-empty ambiguity.',
      'Dequeue moves <code>head_</code> forward and decrements <code>count_</code>. It does not need to erase anything.',
      'Capacity 1 is legal. Trace it by hand.',
    ],
    forbidden: [{ pattern: '\\b(queue|deque|list)\\s*<', message: 'Build it yourself: std::queue and std::deque are off the table here.' }],
    starter: `class RingQueue {
    // your storage here
public:
    RingQueue(int capacity) { }       // capacity >= 1
    bool enqueue(int v) { return false; }  // false (and no change) when full
    bool dequeue() { return false; }       // false when empty
    int front() const { return -1; }       // -1 when empty
    bool isFull() const { return false; }
    bool isEmpty() const { return true; }
    int size() const { return 0; }
};`,
    solution: `class RingQueue {
    vector<int> buf_;
    int head_;
    int count_;
public:
    RingQueue(int capacity) : buf_(capacity), head_(0), count_(0) {}
    bool enqueue(int v) {
        if (isFull()) return false;
        buf_[(head_ + count_) % (int)buf_.size()] = v;
        count_++;
        return true;
    }
    bool dequeue() {
        if (isEmpty()) return false;
        head_ = (head_ + 1) % (int)buf_.size();
        count_--;
        return true;
    }
    int front() const { return count_ ? buf_[head_] : -1; }
    bool isFull() const { return count_ == (int)buf_.size(); }
    bool isEmpty() const { return count_ == 0; }
    int size() const { return count_; }
};`,
    harness: `int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        string bad;
        long long sum = 0;
        int caps[3] = {1, 7, 64};
        unsigned seed = 2024;
        for (int ci = 0; ci < 3 && bad.empty(); ci++) {
            int cap = caps[ci];
            RingQueue q(cap);
            deque<int> m;
            for (int op = 0; op < 20000 && bad.empty(); op++) {
                seed = seed * 1103515245u + 12345u;
                unsigned r = (seed >> 8) & 0xFFFFFF;
                int kind = r % 10;
                if (kind < 5) {
                    int v = (r >> 4) % 1000;
                    bool ok = (int)m.size() < cap;
                    if (ok) m.push_back(v);
                    if (q.enqueue(v) != ok) bad = "enqueue, cap " + to_string(cap);
                } else if (kind < 9) {
                    bool ok = !m.empty();
                    if (ok) { sum += m.front(); m.pop_front(); }
                    if (q.dequeue() != ok) bad = "dequeue, cap " + to_string(cap);
                }
                if (!bad.empty()) break;
                if (q.front() != (m.empty() ? -1 : m.front())) bad = "front, cap " + to_string(cap);
                else if (q.size() != (int)m.size() || q.isEmpty() != m.empty() || q.isFull() != ((int)m.size() == cap)) bad = "state, cap " + to_string(cap);
            }
        }
        if (bad.empty()) out << "ok sum=" << sum;
        else out << "bad: " << bad;
    } else {
        istringstream in(line);
        int cap;
        in >> cap;
        RingQueue q(cap);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            if (tok.compare(0, 3, "enq") == 0) r = q.enqueue(stoi(tok.substr(3))) ? "T" : "F";
            else if (tok == "deq") r = q.dequeue() ? "T" : "F";
            else if (tok == "front") r = to_string(q.front());
            else if (tok == "full") r = q.isFull() ? "T" : "F";
            else if (tok == "empty") r = q.isEmpty() ? "T" : "F";
            else if (tok == "size") r = to_string(q.size());
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Fill and overflow', stdin: '3 enq1 enq2 enq3 full enq4 front size', input: 'capacity 3: enqueue 1 2 3, isFull, enqueue 4, front, size', expected: 'T T T T F 1 3' },
      { name: 'Wraparound', stdin: '3 enq1 enq2 enq3 deq deq enq4 enq5 front deq front deq front deq front empty', input: 'capacity 3: fill, dequeue twice, enqueue 4 5, drain with front', expected: 'T T T T T T T 3 T 4 T 5 T -1 T' },
      { name: 'Empty queue', stdin: '2 empty front deq size full', input: 'capacity 2: isEmpty, front, dequeue, size, isFull', expected: 'T -1 F 0 F' },
      { name: 'Capacity 1', stdin: '1 enq5 full enq6 front deq empty enq7 front', input: 'capacity 1: enqueue 5, isFull, enqueue 6, front, dequeue, isEmpty, enqueue 7, front', expected: 'T T F 5 T T T 7' },
      { name: 'Many laps', stdin: '4 enq1 enq2 enq3 deq deq enq4 enq5 enq6 enq7 full front deq deq deq deq empty', input: 'capacity 4: several fills and drains around the ring', expected: 'T T T T T T T T F T 3 T T T T T' },
      { name: 'Dequeue frees a slot', stdin: '2 enq1 enq2 enq3 deq enq3 front deq front size', input: 'capacity 2: full, enqueue refused, dequeue, enqueue 3', expected: 'T T F T T 2 T 3 1' },
      { name: 'Stress', stdin: 'stress', input: '3 queues (capacity 1, 7, 64), 20 000 operations each, against std::deque', expected: 'ok sum=10063004' },
    ],
  },
  {
    id: 's3-min-heap',
    title: 'Min-heap',
    kind: 'implement',
    task: 'Build <code>MinHeap</code> on a vector with sift-up and sift-down. No <code>priority_queue</code>, no heap functions from <code>&lt;algorithm&gt;</code>, no sorting.',
    refresher: [
      'Parent of <code>i</code> is <code>(i-1)/2</code>; children are <code>2i+1</code> and <code>2i+2</code>. Every parent is &lt;= its children.',
      'Push: append, then swap upward while smaller than the parent. Pop: move the last element to the root, shrink, then swap downward with the smaller child.',
    ],
    hints: [
      'Write <code>siftUp</code> and test push plus top before touching pop.',
      'In sift-down, pick the smaller child, and only if it exists.',
      'A heap of one element must be empty after pop. Check the move-last-to-root step.',
    ],
    forbidden: [
      { pattern: '\\b(priority_queue|make_heap|push_heap|pop_heap|sort_heap)\\b', message: 'Build it yourself: the STL heap is off the table here.' },
      { pattern: '\\b((stable_)?sort\\s*\\(|(multi)?set\\s*<)', message: 'Build it yourself: keep a real heap, not a sorted container.' },
    ],
    starter: `class MinHeap {
    vector<int> a_;
public:
    void push(int v) { }
    void pop() { }                // removes the smallest; does nothing when empty
    int top() const { return -1; } // smallest value; -1 when empty
    int size() const { return 0; }
    bool empty() const { return true; }
};`,
    solution: `class MinHeap {
    vector<int> a_;

    void siftUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (a_[p] <= a_[i]) break;
            swap(a_[p], a_[i]);
            i = p;
        }
    }
    void siftDown(int i) {
        int n = (int)a_.size();
        while (true) {
            int l = 2 * i + 1, r = l + 1, s = i;
            if (l < n && a_[l] < a_[s]) s = l;
            if (r < n && a_[r] < a_[s]) s = r;
            if (s == i) break;
            swap(a_[i], a_[s]);
            i = s;
        }
    }
public:
    void push(int v) {
        a_.push_back(v);
        siftUp((int)a_.size() - 1);
    }
    void pop() {
        if (a_.empty()) return;
        a_[0] = a_.back();
        a_.pop_back();
        if (!a_.empty()) siftDown(0);
    }
    int top() const { return a_.empty() ? -1 : a_[0]; }
    int size() const { return (int)a_.size(); }
    bool empty() const { return a_.empty(); }
};`,
    harness: `int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        MinHeap h;
        priority_queue<int, vector<int>, greater<int> > m;
        unsigned seed = 31337;
        string bad;
        long long sum = 0;
        for (int op = 0; op < 50000 && bad.empty(); op++) {
            seed = seed * 1103515245u + 12345u;
            unsigned r = (seed >> 8) & 0xFFFFFF;
            int kind = r % 10;
            if (kind < 6) { int v = (int)((r >> 4) % 2001) - 1000; h.push(v); m.push(v); }
            else { h.pop(); if (!m.empty()) m.pop(); }
            if (h.size() != (int)m.size() || h.empty() != m.empty()) bad = "size at op " + to_string(op);
            else if (!m.empty() && h.top() != m.top()) bad = "top at op " + to_string(op);
            if (!m.empty()) sum += m.top();
        }
        while (bad.empty() && !m.empty()) {
            if (h.top() != m.top()) bad = "drain";
            h.pop(); m.pop();
        }
        if (bad.empty() && !h.empty()) bad = "not empty after drain";
        if (bad.empty()) out << "ok checksum=" << sum;
        else out << "bad: " << bad;
    } else {
        MinHeap h;
        istringstream in(line);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            if (tok.compare(0, 4, "push") == 0) { h.push(stoi(tok.substr(4))); continue; }
            else if (tok == "pop") { h.pop(); continue; }
            else if (tok == "top") r = to_string(h.top());
            else if (tok == "size") r = to_string(h.size());
            else if (tok == "empty") r = h.empty() ? "T" : "F";
            else if (tok == "drain") {
                r = "[";
                bool f = true;
                while (!h.empty()) { if (!f) r += " "; r += to_string(h.top()); h.pop(); f = false; }
                r += "]";
            }
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Smallest comes out first', stdin: 'push5 push3 push8 top pop top pop top pop empty', input: 'push 5 3 8, top and pop three times, empty', expected: '3 5 8 T' },
      { name: 'Empty heap', stdin: 'top pop size empty', input: 'top, pop, size, empty on a new heap', expected: '-1 0 T' },
      { name: 'Single element', stdin: 'push42 top size pop empty top', input: 'push 42, top, size, pop, empty, top', expected: '42 1 T -1' },
      { name: 'Duplicates', stdin: 'push2 push2 push1 push2 push1 size drain', input: 'push 2 2 1 2 1, size, drain', expected: '5 [1 1 2 2 2]' },
      { name: 'Descending input', stdin: 'push10 push9 push8 push7 push6 push5 push4 push3 push2 push1 top drain', input: 'push 10 down to 1, top, drain', expected: '1 [1 2 3 4 5 6 7 8 9 10]' },
      { name: 'Ascending input', stdin: 'push1 push2 push3 push4 push5 push6 push7 top drain', input: 'push 1 to 7, top, drain', expected: '1 [1 2 3 4 5 6 7]' },
      { name: 'Negatives and interleaving', stdin: 'push-3 push7 push0 top pop push-10 push4 top drain', input: 'push -3 7 0, top, pop, push -10 4, top, drain', expected: '-3 -10 [-10 0 4 7]' },
      { name: 'Stress', stdin: 'stress', input: '50 000 random push / pop operations against priority_queue', expected: 'ok checksum=-16675111' },
    ],
  },
  {
    id: 's3-hash-map',
    title: 'Hash map',
    kind: 'implement',
    task: 'Build <code>HashMap</code> from <code>int</code> to <code>int</code> using separate chaining. <code>unordered_map</code> and <code>map</code> are off the table.',
    refresher: [
      'Keep an array of buckets. The key picks a bucket; each bucket holds the entries whose keys landed there.',
      'Negative keys give negative remainders: use <code>((k % B) + B) % B</code>.',
    ],
    hints: [
      'Inside a bucket, search for the key first: <code>put</code> on an existing key overwrites its value.',
      'Removing erases only the matching entry from its bucket; keep <code>size_</code> in step.',
      'Start with 16 buckets. Rehashing when <code>size_</code> passes a few times the bucket count is optional.',
    ],
    forbidden: [{ pattern: '\\b(unordered_map|unordered_set|map|set|multimap|multiset)\\s*<', message: 'Build it yourself: std::map and std::unordered_map are off the table here.' }],
    starter: `class HashMap {
    // your buckets here
    int size_;
public:
    HashMap() { }
    void put(int key, int value) { }   // insert, or overwrite an existing key
    int get(int key) const { return -1; }  // -1 when missing (values are never negative)
    bool remove(int key) { return false; } // true if the key was present
    int size() const { return 0; }
};`,
    solution: `class HashMap {
    vector<vector<pair<int, int> > > buckets_;
    int size_;

    int slot(int key) const {
        int b = (int)buckets_.size();
        return ((key % b) + b) % b;
    }
    void grow() {
        vector<vector<pair<int, int> > > old;
        old.swap(buckets_);
        buckets_.assign(old.size() * 2, vector<pair<int, int> >());
        for (size_t i = 0; i < old.size(); i++)
            for (size_t j = 0; j < old[i].size(); j++)
                buckets_[slot(old[i][j].first)].push_back(old[i][j]);
    }
public:
    HashMap() : buckets_(16), size_(0) {}

    void put(int key, int value) {
        vector<pair<int, int> >& b = buckets_[slot(key)];
        for (size_t i = 0; i < b.size(); i++) {
            if (b[i].first == key) { b[i].second = value; return; }
        }
        b.push_back(make_pair(key, value));
        size_++;
        if (size_ > 4 * (int)buckets_.size()) grow();
    }
    int get(int key) const {
        const vector<pair<int, int> >& b = buckets_[slot(key)];
        for (size_t i = 0; i < b.size(); i++)
            if (b[i].first == key) return b[i].second;
        return -1;
    }
    bool remove(int key) {
        vector<pair<int, int> >& b = buckets_[slot(key)];
        for (size_t i = 0; i < b.size(); i++) {
            if (b[i].first == key) {
                b.erase(b.begin() + i);
                size_--;
                return true;
            }
        }
        return false;
    }
    int size() const { return size_; }
};`,
    harness: `int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        HashMap h;
        map<int, int> m;
        unsigned seed = 555;
        string bad;
        long long sum = 0;
        for (int op = 0; op < 40000 && bad.empty(); op++) {
            seed = seed * 1103515245u + 12345u;
            unsigned r = (seed >> 8) & 0xFFFFFF;
            int kind = r % 10;
            int key = (int)((r >> 4) % 6001) - 3000;
            if (kind < 5) { int v = (r >> 12) % 1000; h.put(key, v); m[key] = v; }
            else if (kind < 7) {
                map<int, int>::iterator it = m.find(key);
                int want = it == m.end() ? -1 : it->second;
                int got = h.get(key);
                if (got != want) bad = "get at op " + to_string(op);
                sum += got;
            } else if (kind < 9) {
                bool want = m.erase(key) > 0;
                if (h.remove(key) != want) bad = "remove at op " + to_string(op);
            }
            if (bad.empty() && h.size() != (int)m.size()) bad = "size at op " + to_string(op);
        }
        for (map<int, int>::iterator it = m.begin(); bad.empty() && it != m.end(); ++it)
            if (h.get(it->first) != it->second) bad = "final content";
        if (bad.empty()) out << "ok size=" << m.size() << " checksum=" << sum;
        else out << "bad: " << bad;
    } else {
        HashMap h;
        istringstream in(line);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            if (tok.compare(0, 3, "put") == 0) { size_t c = tok.find(':'); h.put(stoi(tok.substr(3, c - 3)), stoi(tok.substr(c + 1))); continue; }
            else if (tok.compare(0, 4, "fill") == 0) { int n = stoi(tok.substr(4)); for (int i = 0; i < n; i++) h.put(i, i * 3); continue; }
            else if (tok.compare(0, 3, "get") == 0) r = to_string(h.get(stoi(tok.substr(3))));
            else if (tok.compare(0, 3, "del") == 0) r = h.remove(stoi(tok.substr(3))) ? "T" : "F";
            else if (tok == "size") r = to_string(h.size());
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Put and get', stdin: 'put1:10 put2:20 get1 get2 get3 size', input: 'put 1:10 2:20, get 1 2 3, size', expected: '10 20 -1 2' },
      { name: 'Empty map', stdin: 'get0 del0 size', input: 'get 0, remove 0, size on a new map', expected: '-1 F 0' },
      { name: 'Overwrite', stdin: 'put5:1 put5:2 get5 size', input: 'put 5:1, put 5:2, get 5, size', expected: '2 1' },
      { name: 'Colliding keys', stdin: 'put1:1 put17:2 put33:3 put49:4 put64:5 put128:6 get1 get17 get33 get49 get64 get128 size', input: 'keys 1 17 33 49 64 128 (many share buckets), get each, size', expected: '1 2 3 4 5 6 6' },
      { name: 'Remove from a chain', stdin: 'put1:1 put17:2 put33:3 put49:4 del17 get17 get1 get33 get49 del1 del49 get33 size del17', input: 'colliding keys 1 17 33 49: remove middle, first, last, then a missing key', expected: 'T -1 1 3 4 T T 3 1 F' },
      { name: 'Negative keys', stdin: 'put-1:5 put-16:6 put-17:7 put15:8 get-1 get-16 get-17 get15 del-1 get-1 size', input: 'put keys -1 -16 -17 15, get each, remove -1, size', expected: '5 6 7 8 T -1 3' },
      { name: 'Remove, then put again', stdin: 'put3:1 del3 get3 put3:9 get3 size', input: 'put 3:1, remove 3, get 3, put 3:9, get 3, size', expected: 'T -1 9 1' },
      { name: 'Growth past the first buckets', stdin: 'fill500 get0 get250 get499 get500 size del250 get250 size', input: 'put keys 0..499 with value 3k; get 0 250 499 500; remove 250', expected: '0 750 1497 -1 500 T -1 499' },
      { name: 'Stress', stdin: 'stress', input: '40 000 random put / get / remove operations against std::map', expected: 'ok size=4229 checksum=2132618' },
    ],
  },
  {
    id: 's3-bst',
    title: 'Binary search tree',
    kind: 'implement',
    task: 'Build <code>BST</code> with insert, contains, size and an in-order traversal into a vector. Duplicates are ignored. <code>set</code> and <code>map</code> are off the table.',
    refresher: [
      'Left subtree holds smaller values, right subtree larger. Insert and search both walk a single path down.',
      'An in-order walk (left, node, right) visits the values in ascending order.',
    ],
    hints: [
      'Recursion fits: insert into a subtree and return its (possibly new) root.',
      'Compare before descending. Equal means stop and change nothing.',
      'The destructor must free both children before the node itself.',
    ],
    forbidden: [{ pattern: '\\b(set|map|multiset|multimap|unordered_set|unordered_map)\\s*<', message: 'Build it yourself: std::set and std::map are off the table here.' }],
    starter: `class BST {
    struct Node {
        int val;
        Node* left;
        Node* right;
    };
    Node* root_;
    int size_;
public:
    BST() { }
    ~BST() { }                          // free every node
    BST(const BST&) = delete;
    BST& operator=(const BST&) = delete;

    void insert(int v) { }              // duplicates are ignored
    bool contains(int v) const { return false; }
    int size() const { return 0; }
    vector<int> inorder() const { return {}; }   // ascending
};`,
    solution: `class BST {
    struct Node {
        int val;
        Node* left;
        Node* right;
        Node(int v) : val(v), left(nullptr), right(nullptr) {}
    };
    Node* root_;
    int size_;

    void destroy(Node* n) {
        if (!n) return;
        destroy(n->left);
        destroy(n->right);
        delete n;
    }
    void walk(const Node* n, vector<int>& out) const {
        if (!n) return;
        walk(n->left, out);
        out.push_back(n->val);
        walk(n->right, out);
    }
public:
    BST() : root_(nullptr), size_(0) {}
    ~BST() { destroy(root_); }
    BST(const BST&) = delete;
    BST& operator=(const BST&) = delete;

    void insert(int v) {
        Node** link = &root_;
        while (*link) {
            if (v == (*link)->val) return;
            link = v < (*link)->val ? &(*link)->left : &(*link)->right;
        }
        *link = new Node(v);
        size_++;
    }
    bool contains(int v) const {
        const Node* n = root_;
        while (n) {
            if (v == n->val) return true;
            n = v < n->val ? n->left : n->right;
        }
        return false;
    }
    int size() const { return size_; }
    vector<int> inorder() const {
        vector<int> out;
        walk(root_, out);
        return out;
    }
};`,
    harness: `static string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) { if (i) s += " "; s += to_string(v[i]); }
    return s + "]";
}

int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        BST t;
        set<int> m;
        unsigned seed = 8080;
        string bad;
        for (int op = 0; op < 30000 && bad.empty(); op++) {
            seed = seed * 1103515245u + 12345u;
            unsigned r = (seed >> 8) & 0xFFFFFF;
            int v = (r >> 4) % 20000;
            if (r % 4 < 3) { t.insert(v); m.insert(v); }
            else if (t.contains(v) != (m.count(v) > 0)) bad = "contains at op " + to_string(op);
            if (bad.empty() && t.size() != (int)m.size()) bad = "size at op " + to_string(op);
        }
        vector<int> want(m.begin(), m.end());
        if (bad.empty() && t.inorder() != want) bad = "inorder";
        long long sum = 0;
        for (size_t i = 0; i < want.size(); i++) sum += want[i] * (long long)(i % 7 + 1);
        if (bad.empty()) out << "ok size=" << want.size() << " checksum=" << sum;
        else out << "bad: " << bad;
    } else {
        BST t;
        istringstream in(line);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            if (tok.compare(0, 3, "ins") == 0) { t.insert(stoi(tok.substr(3))); continue; }
            else if (tok.compare(0, 3, "has") == 0) r = t.contains(stoi(tok.substr(3))) ? "T" : "F";
            else if (tok == "size") r = to_string(t.size());
            else if (tok == "inorder") r = show(t.inorder());
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Small tree', stdin: 'ins5 ins3 ins8 ins1 ins4 inorder size', input: 'insert 5 3 8 1 4, inorder, size', expected: '[1 3 4 5 8] 5' },
      { name: 'Empty tree', stdin: 'inorder size has1', input: 'inorder, size, contains 1 on a new tree', expected: '[] 0 F' },
      { name: 'Single value', stdin: 'ins7 inorder size has7 has8', input: 'insert 7, inorder, size, contains 7 and 8', expected: '[7] 1 T F' },
      { name: 'Duplicates ignored', stdin: 'ins2 ins2 ins2 ins1 ins1 size inorder', input: 'insert 2 2 2 1 1, size, inorder', expected: '2 [1 2]' },
      { name: 'contains', stdin: 'ins50 ins30 ins70 ins20 ins40 ins60 ins80 has40 has60 has50 has45 has10 has90', input: 'balanced tree of 7, contains 40 60 50 45 10 90', expected: 'T T T F F F' },
      { name: 'Ascending inserts', stdin: 'ins1 ins2 ins3 ins4 ins5 ins6 ins7 ins8 has8 has0 inorder', input: 'insert 1..8 in order (a chain), contains 8 and 0, inorder', expected: 'T F [1 2 3 4 5 6 7 8]' },
      { name: 'Negative values', stdin: 'ins0 ins-5 ins5 ins-10 ins-1 inorder has-1 has-2', input: 'insert 0 -5 5 -10 -1, inorder, contains -1 and -2', expected: '[-10 -5 -1 0 5] T F' },
      { name: 'Stress', stdin: 'stress', input: '30 000 random insert / contains operations against std::set', expected: 'ok size=13476 checksum=539578465' },
    ],
  },
  {
    id: 's3-bst-erase',
    title: 'Delete from a BST',
    kind: 'implement',
    task: 'Implement <code>erase(v)</code> in the <code>BST</code> below. Return true if the value was present. Handle a leaf, one child, and two children.',
    refresher: [
      'Leaf: remove it. One child: replace the node with that child.',
      'Two children: copy in the smallest value of the right subtree (the in-order successor), then erase that value from the right subtree.',
    ],
    hints: [
      'A helper <code>Node* eraseAt(Node* n, int v, bool&amp; removed)</code> that returns the new root of the subtree keeps the re-linking simple.',
      'Find the node first. Only then decide which of the three cases applies.',
      'The successor is found by going left as far as possible from <code>n-&gt;right</code>.',
    ],
    starter: `class BST {
    struct Node {
        int val;
        Node* left;
        Node* right;
        Node(int v) : val(v), left(nullptr), right(nullptr) {}
    };
    Node* root_;

    Node* insertAt(Node* n, int v) {
        if (!n) return new Node(v);
        if (v < n->val) n->left = insertAt(n->left, v);
        else if (v > n->val) n->right = insertAt(n->right, v);
        return n;
    }
    void walk(const Node* n, vector<int>& out) const {
        if (!n) return;
        walk(n->left, out);
        out.push_back(n->val);
        walk(n->right, out);
    }
    void destroy(Node* n) {
        if (!n) return;
        destroy(n->left);
        destroy(n->right);
        delete n;
    }
public:
    BST() : root_(nullptr) {}
    ~BST() { destroy(root_); }
    BST(const BST&) = delete;
    BST& operator=(const BST&) = delete;

    void insert(int v) { root_ = insertAt(root_, v); }   // duplicates ignored
    bool contains(int v) const {
        const Node* n = root_;
        while (n) {
            if (v == n->val) return true;
            n = v < n->val ? n->left : n->right;
        }
        return false;
    }
    vector<int> inorder() const {
        vector<int> out;
        walk(root_, out);
        return out;
    }

    // Remove v. Return true if it was present.
    bool erase(int v) {
        return false;
    }
};`,
    solution: `class BST {
    struct Node {
        int val;
        Node* left;
        Node* right;
        Node(int v) : val(v), left(nullptr), right(nullptr) {}
    };
    Node* root_;

    Node* insertAt(Node* n, int v) {
        if (!n) return new Node(v);
        if (v < n->val) n->left = insertAt(n->left, v);
        else if (v > n->val) n->right = insertAt(n->right, v);
        return n;
    }
    void walk(const Node* n, vector<int>& out) const {
        if (!n) return;
        walk(n->left, out);
        out.push_back(n->val);
        walk(n->right, out);
    }
    void destroy(Node* n) {
        if (!n) return;
        destroy(n->left);
        destroy(n->right);
        delete n;
    }
    Node* eraseAt(Node* n, int v, bool& removed) {
        if (!n) return nullptr;
        if (v < n->val) {
            n->left = eraseAt(n->left, v, removed);
            return n;
        }
        if (v > n->val) {
            n->right = eraseAt(n->right, v, removed);
            return n;
        }
        removed = true;
        if (!n->left || !n->right) {
            Node* child = n->left ? n->left : n->right;
            delete n;
            return child;
        }
        Node* succ = n->right;
        while (succ->left) succ = succ->left;
        n->val = succ->val;
        bool ignored = false;
        n->right = eraseAt(n->right, succ->val, ignored);
        return n;
    }
public:
    BST() : root_(nullptr) {}
    ~BST() { destroy(root_); }
    BST(const BST&) = delete;
    BST& operator=(const BST&) = delete;

    void insert(int v) { root_ = insertAt(root_, v); }
    bool contains(int v) const {
        const Node* n = root_;
        while (n) {
            if (v == n->val) return true;
            n = v < n->val ? n->left : n->right;
        }
        return false;
    }
    vector<int> inorder() const {
        vector<int> out;
        walk(root_, out);
        return out;
    }

    bool erase(int v) {
        bool removed = false;
        root_ = eraseAt(root_, v, removed);
        return removed;
    }
};`,
    harness: `static string show(const vector<int>& v) {
    string s = "[";
    for (size_t i = 0; i < v.size(); i++) { if (i) s += " "; s += to_string(v[i]); }
    return s + "]";
}

int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        BST t;
        set<int> m;
        unsigned seed = 6061;
        string bad;
        for (int op = 0; op < 30000 && bad.empty(); op++) {
            seed = seed * 1103515245u + 12345u;
            unsigned r = (seed >> 8) & 0xFFFFFF;
            int v = (r >> 4) % 2000;
            int kind = r % 10;
            if (kind < 5) { t.insert(v); m.insert(v); }
            else if (kind < 9) { if (t.erase(v) != (m.erase(v) > 0)) bad = "erase at op " + to_string(op); }
            else if (t.contains(v) != (m.count(v) > 0)) bad = "contains at op " + to_string(op);
            if (bad.empty() && op % 1000 == 0 && t.inorder() != vector<int>(m.begin(), m.end())) bad = "inorder at op " + to_string(op);
        }
        vector<int> want(m.begin(), m.end());
        if (bad.empty() && t.inorder() != want) bad = "final inorder";
        for (size_t i = 0; bad.empty() && i < 2000; i++)
            if (t.contains((int)i) != (m.count((int)i) > 0)) bad = "final contains";
        if (bad.empty()) out << "ok size=" << want.size();
        else out << "bad: " << bad;
    } else {
        BST t;
        istringstream in(line);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            if (tok.compare(0, 3, "ins") == 0) { t.insert(stoi(tok.substr(3))); continue; }
            else if (tok.compare(0, 3, "del") == 0) r = t.erase(stoi(tok.substr(3))) ? "T" : "F";
            else if (tok.compare(0, 3, "has") == 0) r = t.contains(stoi(tok.substr(3))) ? "T" : "F";
            else if (tok == "inorder") r = show(t.inorder());
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Erase a leaf', stdin: 'ins50 ins30 ins70 ins20 ins40 del20 inorder has20', input: 'tree 50 30 70 20 40: erase leaf 20', expected: 'T [30 40 50 70] F' },
      { name: 'One child (left only)', stdin: 'ins50 ins30 ins70 ins20 del30 inorder has20 has30', input: 'tree 50 30 70 20: erase 30 (only a left child)', expected: 'T [20 50 70] T F' },
      { name: 'One child (right only)', stdin: 'ins50 ins30 ins70 ins80 del70 inorder has80 has70', input: 'tree 50 30 70 80: erase 70 (only a right child)', expected: 'T [30 50 80] T F' },
      { name: 'Two children', stdin: 'ins50 ins30 ins70 ins20 ins40 ins60 ins80 del30 inorder del70 inorder has60 has80', input: 'full tree of 7: erase 30, then erase 70', expected: 'T [20 40 50 60 70 80] T [20 40 50 60 80] T T' },
      { name: 'Erase the root', stdin: 'ins50 ins30 ins70 ins60 ins80 del50 inorder has60 has30 del60 del70 inorder', input: 'tree 50 30 70 60 80: erase root 50, then 60 and 70', expected: 'T [30 60 70 80] T T T T [30 80]' },
      { name: 'Missing and empty', stdin: 'del5 ins5 del6 del5 del5 inorder', input: 'erase from an empty tree, a missing value, then 5 twice', expected: 'F F T F []' },
      { name: 'Root with one child', stdin: 'ins1 ins2 ins3 del1 inorder del2 inorder del3 inorder', input: 'chain 1 2 3: erase 1, 2, 3 in turn', expected: 'T [2 3] T [3] T []' },
      { name: 'Successor with a right child', stdin: 'ins10 ins5 ins20 ins15 ins30 ins17 del10 inorder has17 has15 del20 inorder', input: 'tree 10 5 20 15 30 17: erase 10, then 20', expected: 'T [5 15 17 20 30] T T T [5 15 17 30]' },
      { name: 'Stress', stdin: 'stress', input: '30 000 random insert / erase / contains operations against std::set', expected: 'ok size=1091' },
    ],
  },
  {
    id: 's3-graph-bfs',
    title: 'Graph and BFS',
    kind: 'implement',
    task: 'Build an adjacency list from an undirected edge list, then run BFS from a source. Visit neighbours in ascending order. <code>queue</code> and <code>vector</code> are allowed.',
    refresher: [
      '<code>g[u]</code> holds every neighbour of <code>u</code>. An undirected edge <code>(a, b)</code> adds <code>b</code> to <code>g[a]</code> and <code>a</code> to <code>g[b]</code>.',
      'BFS: queue the source, mark nodes visited when queued, pop in order. A new node is one hop further than the node that reached it.',
    ],
    hints: [
      'Mark a node visited when you push it, not when you pop it, or it can enter the queue twice.',
      'Sort each adjacency list once after building, so every traversal sees neighbours in ascending order.',
      'Unreachable nodes keep distance -1 and do not appear in the order.',
    ],
    starter: `// Nodes are 0..n-1. Each edge is undirected. Self-loops and repeated edges may appear.
vector<vector<int>> buildGraph(int n, const vector<pair<int, int>>& edges) {
    return {};
}

// Nodes in the order BFS visits them, trying neighbours in ascending order.
vector<int> bfsOrder(const vector<vector<int>>& g, int src) {
    return {};
}

// dist[v] = fewest edges from src to v, or -1 if unreachable.
vector<int> hopDistances(const vector<vector<int>>& g, int src) {
    return {};
}`,
    solution: `vector<vector<int>> buildGraph(int n, const vector<pair<int, int>>& edges) {
    vector<vector<int>> g(n);
    for (size_t i = 0; i < edges.size(); i++) {
        g[edges[i].first].push_back(edges[i].second);
        g[edges[i].second].push_back(edges[i].first);
    }
    for (int u = 0; u < n; u++) sort(g[u].begin(), g[u].end());
    return g;
}

vector<int> bfsOrder(const vector<vector<int>>& g, int src) {
    vector<int> order;
    vector<bool> seen(g.size(), false);
    queue<int> q;
    seen[src] = true;
    q.push(src);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (size_t i = 0; i < g[u].size(); i++) {
            int v = g[u][i];
            if (!seen[v]) {
                seen[v] = true;
                q.push(v);
            }
        }
    }
    return order;
}

vector<int> hopDistances(const vector<vector<int>>& g, int src) {
    vector<int> dist(g.size(), -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (size_t i = 0; i < g[u].size(); i++) {
            int v = g[u][i];
            if (dist[v] < 0) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}`,
    harness: `static string join(const vector<int>& v) {
    string s;
    for (size_t i = 0; i < v.size(); i++) { if (i) s += " "; s += to_string(v[i]); }
    return s;
}

int main() {
    string first;
    cin >> first;
    bool stress = (first == "stress");
    int n, src = 0;
    vector<pair<int, int> > edges;
    if (stress) {
        n = 20000;
        unsigned seed = 4711;
        for (int i = 0; i < 40000; i++) {
            seed = seed * 1103515245u + 12345u;
            int a = (seed >> 8) % n;
            seed = seed * 1103515245u + 12345u;
            int b = (seed >> 8) % n;
            edges.push_back(make_pair(a, b));
        }
    } else {
        n = stoi(first);
        int m;
        cin >> m >> src;
        for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; edges.push_back(make_pair(a, b)); }
    }
    vector<vector<int> > g = buildGraph(n, edges);
    vector<int> order = bfsOrder(g, src);
    vector<int> dist = hopDistances(g, src);
    ostringstream out;
    if (stress) {
        vector<vector<int> > ref(n);
        for (size_t i = 0; i < edges.size(); i++) { ref[edges[i].first].push_back(edges[i].second); ref[edges[i].second].push_back(edges[i].first); }
        for (int u = 0; u < n; u++) sort(ref[u].begin(), ref[u].end());
        vector<int> rd(n, -1), ro;
        queue<int> q;
        rd[src] = 0; q.push(src);
        while (!q.empty()) {
            int u = q.front(); q.pop(); ro.push_back(u);
            for (size_t i = 0; i < ref[u].size(); i++) if (rd[ref[u][i]] < 0) { rd[ref[u][i]] = rd[u] + 1; q.push(ref[u][i]); }
        }
        int maxd = 0;
        for (int i = 0; i < n; i++) maxd = max(maxd, rd[i]);
        if (order != ro) out << "bad: order";
        else if (dist != rd) out << "bad: distances";
        else out << "ok reached=" << ro.size() << " maxdist=" << maxd;
    } else {
        out << "order: " << join(order) << endl << "dist: " << join(dist);
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Diamond plus a tail', stdin: '5 5 0\n0 1\n0 2\n1 3\n2 3\n3 4\n', input: '5 nodes, edges 0-1 0-2 1-3 2-3 3-4, source 0', expected: 'order: 0 1 2 3 4\ndist: 0 1 1 2 3' },
      { name: 'Single node', stdin: '1 0 0\n', input: '1 node, no edges, source 0', expected: 'order: 0\ndist: 0' },
      { name: 'Disconnected', stdin: '6 3 0\n0 1\n1 2\n4 5\n', input: '6 nodes, edges 0-1 1-2 4-5, source 0', expected: 'order: 0 1 2\ndist: 0 1 2 -1 -1 -1' },
      { name: 'Neighbours in ascending order', stdin: '5 4 2\n2 4\n2 0\n2 3\n0 1\n', input: 'edges 2-4 2-0 2-3 0-1 (given out of order), source 2', expected: 'order: 2 0 3 4 1\ndist: 1 2 0 1 1' },
      { name: 'Self-loop and repeated edges', stdin: '4 6 1\n1 2\n2 1\n1 1\n1 0\n0 1\n2 3\n', input: 'edges 1-2 2-1 1-1 1-0 0-1 2-3, source 1', expected: 'order: 1 0 2 3\ndist: 1 0 1 2' },
      { name: 'Shortcut across a cycle', stdin: '6 7 0\n0 1\n1 2\n2 3\n3 4\n4 5\n5 0\n0 3\n', input: 'ring of 6 plus chord 0-3, source 0', expected: 'order: 0 1 3 5 2 4\ndist: 0 1 2 1 2 1' },
      { name: 'Large random graph', stdin: 'stress', input: '20 000 nodes, 40 000 random edges, source 0, compared with a reference', expected: 'ok reached=19585 maxdist=10' },
    ],
  },
  {
    id: 's3-dfs',
    title: 'DFS',
    kind: 'implement',
    task: 'Return the order in which a recursive DFS first visits each node reachable from <code>src</code>, trying neighbours in the stored (ascending) order. The graph may be directed.',
    refresher: [
      'DFS goes as deep as it can before backing up. Mark a node when you enter it, then recurse into each unvisited neighbour.',
      'Iteratively: use an explicit stack, push neighbours in reverse so the smallest pops first, and check <code>visited</code> when you pop.',
    ],
    hints: [
      'Pass <code>visited</code> and the output vector by reference into a recursive helper.',
      'Skipping already visited neighbours is what makes cycles safe.',
      'Iterative version: a node can be pushed more than once, so test <code>visited</code> again after popping.',
    ],
    starter: `// g[u] lists the neighbours of u in ascending order (directed or undirected).
// Return nodes in the order a recursive DFS from src first visits them.
vector<int> dfsOrder(const vector<vector<int>>& g, int src) {
    return {};
}`,
    solution: `static void visit(const vector<vector<int>>& g, int u, vector<bool>& seen, vector<int>& order) {
    seen[u] = true;
    order.push_back(u);
    for (size_t i = 0; i < g[u].size(); i++) {
        int v = g[u][i];
        if (!seen[v]) visit(g, v, seen, order);
    }
}

vector<int> dfsOrder(const vector<vector<int>>& g, int src) {
    vector<int> order;
    vector<bool> seen(g.size(), false);
    visit(g, src, seen, order);
    return order;
}`,
    harness: `static string join(const vector<int>& v) {
    string s;
    for (size_t i = 0; i < v.size(); i++) { if (i) s += " "; s += to_string(v[i]); }
    return s;
}

static vector<vector<int> > makeGraph(int n, const vector<pair<int, int> >& e, bool directed) {
    vector<vector<int> > g(n);
    for (size_t i = 0; i < e.size(); i++) {
        g[e[i].first].push_back(e[i].second);
        if (!directed) g[e[i].second].push_back(e[i].first);
    }
    for (int u = 0; u < n; u++) {
        sort(g[u].begin(), g[u].end());
        g[u].erase(unique(g[u].begin(), g[u].end()), g[u].end());
    }
    return g;
}

static vector<int> refDfs(const vector<vector<int> >& g, int src) {
    vector<int> order;
    vector<char> seen(g.size(), 0);
    vector<pair<int, int> > st;
    seen[src] = 1; order.push_back(src); st.push_back(make_pair(src, 0));
    while (!st.empty()) {
        int u = st.back().first;
        int i = st.back().second++;
        if (i == (int)g[u].size()) { st.pop_back(); continue; }
        int v = g[u][i];
        if (!seen[v]) { seen[v] = 1; order.push_back(v); st.push_back(make_pair(v, 0)); }
    }
    return order;
}

int main() {
    string first;
    cin >> first;
    ostringstream out;
    if (first == "stress" || first == "chain") {
        int n = first == "chain" ? 3000 : 2000;
        vector<pair<int, int> > edges;
        bool directed = first == "stress";
        if (first == "chain") {
            for (int i = 0; i + 1 < n; i++) edges.push_back(make_pair(i, i + 1));
        } else {
            unsigned seed = 1234;
            for (int i = 0; i < 3000; i++) {
                seed = seed * 1103515245u + 12345u;
                int a = (seed >> 8) % n;
                seed = seed * 1103515245u + 12345u;
                int b = (seed >> 8) % n;
                edges.push_back(make_pair(a, b));
            }
        }
        vector<vector<int> > g = makeGraph(n, edges, directed);
        vector<int> got = dfsOrder(g, 0);
        vector<int> want = refDfs(g, 0);
        if (got == want) out << "ok visited=" << want.size();
        else out << "bad: order";
    } else {
        bool directed = first == "d";
        int n, m, src;
        cin >> n >> m >> src;
        vector<pair<int, int> > edges;
        for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; edges.push_back(make_pair(a, b)); }
        vector<vector<int> > g = makeGraph(n, edges, directed);
        out << "order: " << join(dfsOrder(g, src));
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'Tree', stdin: 'u 7 6 0\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n', input: 'undirected tree: 0-1 0-2 1-3 1-4 2-5 2-6, source 0', expected: 'order: 0 1 3 4 2 5 6' },
      { name: 'Diamond (not BFS order)', stdin: 'u 4 4 0\n0 1\n0 2\n1 3\n2 3\n', input: 'undirected: 0-1 0-2 1-3 2-3, source 0', expected: 'order: 0 1 3 2' },
      { name: 'Directed with a cycle', stdin: 'd 5 6 0\n0 2\n0 1\n1 3\n3 0\n2 3\n3 4\n', input: 'directed: 0>2 0>1 1>3 3>0 2>3 3>4, source 0', expected: 'order: 0 1 3 4 2' },
      { name: 'Single node', stdin: 'u 1 0 0\n', input: '1 node, no edges, source 0', expected: 'order: 0' },
      { name: 'Unreachable nodes are skipped', stdin: 'u 6 3 1\n1 0\n0 2\n4 5\n', input: 'undirected: 1-0 0-2 4-5, source 1', expected: 'order: 1 0 2' },
      { name: 'Directed edges only go one way', stdin: 'd 4 3 2\n0 1\n1 2\n2 3\n', input: 'directed: 0>1 1>2 2>3, source 2', expected: 'order: 2 3' },
      { name: 'Long chain', stdin: 'chain', input: 'path of 3000 nodes, source 0 (deep recursion)', expected: 'ok visited=3000' },
      { name: 'Random directed graph', stdin: 'stress', input: '2000 nodes, 3000 random directed edges, compared with a reference', expected: 'ok visited=1264' },
    ],
  },
  {
    id: 's3-union-find',
    title: 'Union-find',
    kind: 'implement',
    task: 'Build <code>DSU</code> over <code>n</code> elements with path compression and union by size. <code>unite</code> returns true only when it merges two different sets.',
    refresher: [
      'Each element points to a parent; a root points to itself. <code>find</code> follows parents up to the root.',
      'Compression: after finding the root, point the nodes on the path at it. Union by size: hang the smaller tree under the larger.',
      'Components start at <code>n</code> and drop by one per successful merge.',
    ],
    hints: [
      '<code>unite</code> works on roots: compare <code>find(a)</code> and <code>find(b)</code>. Equal roots mean nothing to do.',
      'One recursive line in <code>find</code> can both locate the root and compress the path.',
      'The last test builds very long chains. Without both tricks it is slow or overflows the stack.',
    ],
    starter: `class DSU {
    vector<int> parent_;
    vector<int> size_;
    int comps_;
public:
    DSU(int n) { }                       // n singleton sets: 0..n-1
    int find(int x) { return x; }        // root of x's set (with path compression)
    bool unite(int a, int b) { return false; }   // true if a and b were in different sets
    bool connected(int a, int b) { return false; }
    int components() const { return 0; }
};`,
    solution: `class DSU {
    vector<int> parent_;
    vector<int> size_;
    int comps_;
public:
    DSU(int n) : parent_(n), size_(n, 1), comps_(n) {
        for (int i = 0; i < n; i++) parent_[i] = i;
    }
    int find(int x) {
        if (parent_[x] != x) parent_[x] = find(parent_[x]);
        return parent_[x];
    }
    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (size_[ra] < size_[rb]) swap(ra, rb);
        parent_[rb] = ra;
        size_[ra] += size_[rb];
        comps_--;
        return true;
    }
    bool connected(int a, int b) { return find(a) == find(b); }
    int components() const { return comps_; }
};`,
    harness: `static void twoInts(const string& tok, size_t skip, int& a, int& b) {
    size_t c = tok.find(',');
    a = stoi(tok.substr(skip, c - skip));
    b = stoi(tok.substr(c + 1));
}

int main() {
    string line;
    getline(cin, line);
    ostringstream out;
    if (line == "stress") {
        int n = 5000;
        DSU d(n);
        vector<int> label(n);
        for (int i = 0; i < n; i++) label[i] = i;
        int comps = n;
        unsigned seed = 909;
        string bad;
        for (int op = 0; op < 9000 && bad.empty(); op++) {
            seed = seed * 1103515245u + 12345u;
            unsigned r = (seed >> 8) & 0xFFFFFF;
            int a = r % n, b = (r >> 11) % n;
            if (op % 3 != 2) {
                bool merged = label[a] != label[b];
                if (merged) {
                    int from = label[b], to = label[a];
                    for (int i = 0; i < n; i++) if (label[i] == from) label[i] = to;
                    comps--;
                }
                if (d.unite(a, b) != merged) bad = "unite at op " + to_string(op);
            } else if (d.connected(a, b) != (label[a] == label[b])) bad = "connected at op " + to_string(op);
            if (bad.empty() && d.components() != comps) bad = "components at op " + to_string(op);
            if (bad.empty() && op % 100 == 0) { int f = d.find(a); if (d.find(f) != f) bad = "find at op " + to_string(op); }
        }
        if (bad.empty()) out << "ok components=" << comps;
        else out << "bad: " << bad;
    } else if (line == "chain") {
        int n = 50000;
        DSU up(n), down(n);
        for (int i = 0; i + 1 < n; i++) { up.unite(i, i + 1); down.unite(i + 1, i); }
        int hits = 0;
        for (int k = 0; k < 50000; k++) {
            if (up.connected(0, n - 1)) hits++;
            if (down.connected(n - 1, 0)) hits++;
        }
        out << "components " << up.components() << " " << down.components() << " hits " << hits;
    } else {
        istringstream in(line);
        int n;
        in >> n;
        DSU d(n);
        string tok;
        bool first = true;
        while (in >> tok) {
            string r;
            int a = 0, b = 0;
            if (tok.compare(0, 5, "unite") == 0) { twoInts(tok, 5, a, b); r = d.unite(a, b) ? "T" : "F"; }
            else if (tok.compare(0, 4, "conn") == 0) { twoInts(tok, 4, a, b); r = d.connected(a, b) ? "T" : "F"; }
            else if (tok.compare(0, 4, "same") == 0) { twoInts(tok, 4, a, b); r = d.find(a) == d.find(b) ? "T" : "F"; }
            else if (tok == "cnt") r = to_string(d.components());
            if (!first) out << " ";
            out << r;
            first = false;
        }
    }
    cout << endl << "@@RESULT@@" << endl << out.str() << endl;
    return 0;
}`,
    tests: [
      { name: 'All separate at first', stdin: '5 cnt conn0,0 conn0,1 same0,0 same0,1', input: '5 elements: components, connected(0,0), connected(0,1), same root', expected: '5 T F T F' },
      { name: 'Merge two groups', stdin: '6 unite0,1 unite2,3 cnt conn0,1 conn1,2 unite1,2 conn0,3 cnt same0,3', input: '6 elements: unite 0,1 and 2,3, query, unite 1,2, query', expected: 'T T 4 T F T T 3 T' },
      { name: 'Repeated and self unions', stdin: '4 unite0,1 unite1,0 unite0,1 cnt unite2,2 cnt', input: '4 elements: unite 0,1 three times, unite 2,2', expected: 'T F F 3 F 3' },
      { name: 'Transitive chains', stdin: '8 unite0,1 unite1,2 unite2,3 unite4,5 unite6,7 unite5,6 cnt conn0,3 conn3,4 unite3,4 conn0,7 cnt same0,7', input: '8 elements: chains 0-3 and 4-7, then bridge 3,4', expected: 'T T T T T T 2 T F T T 1 T' },
      { name: 'One element', stdin: '1 cnt conn0,0 unite0,0 cnt', input: '1 element: components, connected(0,0), unite(0,0)', expected: '1 T F 1' },
      { name: 'Random operations', stdin: 'stress', input: '5000 elements, 9000 random unite / connected calls against a brute-force model', expected: 'ok components=509' },
      { name: 'Long chains', stdin: 'chain', input: '50 000 elements united in a line, both directions, then 100 000 connected queries', expected: 'components 1 1 hits 100000' },
    ],
  },
]
