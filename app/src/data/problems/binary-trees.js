import TreeViz from '../../components/viz/TreeViz'

const treeBuilderCpp = `
TreeNode* buildTree(vector<int> a) {
    if(a.empty()||a[0]==-1) return nullptr;
    auto root=new TreeNode(a[0]);
    queue<TreeNode*> q; q.push(root);
    for(int i=1;i<(int)a.size();){
        auto node=q.front(); q.pop();
        if(i<(int)a.size()&&a[i]!=-1){node->left=new TreeNode(a[i]);q.push(node->left);}i++;
        if(i<(int)a.size()&&a[i]!=-1){node->right=new TreeNode(a[i]);q.push(node->right);}i++;
    }
    return root;
}
TreeNode* findNode(TreeNode* root,int val){
    if(!root)return nullptr;
    if(root->val==val)return root;
    auto l=findNode(root->left,val);
    return l?l:findNode(root->right,val);
}`

const treeBuilderPy = `
from collections import deque
def buildTree(a):
    if not a or a[0] is None: return None
    root=TreeNode(a[0]); q=deque([root]); i=1
    while q and i<len(a):
        node=q.popleft()
        if i<len(a) and a[i] is not None: node.left=TreeNode(a[i]); q.append(node.left)
        i+=1
        if i<len(a) and a[i] is not None: node.right=TreeNode(a[i]); q.append(node.right)
        i+=1
    return root
def findNode(root,val):
    if not root: return None
    if root.val==val: return root
    return findNode(root.left,val) or findNode(root.right,val)`

// ── 1. LCA in Binary Tree ────────────────────────────────────────────────
const lcaBT = {
  id: 'lca-binary-tree',
  title: 'Lowest Common Ancestor of a Binary Tree',
  difficulty: 'Medium',
  category: 'binary-trees',
  askedBy: 'himali',
  description: [
    'Given a binary tree and two nodes <code>p</code> and <code>q</code>, return their lowest common ancestor (LCA).',
    'The LCA is the deepest node that has both <code>p</code> and <code>q</code> as descendants (a node is a descendant of itself).',
  ],
  examples: [
    { input: 'root=[3,5,1,6,2,0,8,-1,-1,7,4], p=5, q=1', output: '3' },
    { input: 'root=[3,5,1,6,2,0,8,-1,-1,7,4], p=5, q=4', output: '5', explanation: 'Node 5 is an ancestor of 4.' },
  ],
  constraints: ['2 ≤ nodes ≤ 10⁵', 'All node values are unique', 'p ≠ q', 'Both p and q exist in the tree'],
  hints: [
    'Recurse: if root is null, return null. If root equals p or q, return root.',
    'Recurse left and right. If both return non-null, root is the LCA.',
    'Otherwise return whichever subtree returned non-null.',
  ],
  inputFormat: 'Conceptual — use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'Root LCA',   input: 'tree=[3,5,1,6,2,0,8], p=5, q=1', expected: '3' },
    { label: 'Ancestor',   input: 'tree=[3,5,1,6,2,0,8], p=5, q=6', expected: '5' },
    { label: 'Simple',     input: 'tree=[1,2,3], p=2, q=3',          expected: '1' },
    { label: 'Deep',       input: 'tree=[1,2,3,4,5], p=4, q=5',      expected: '2' },
  ],
  cppStarter: `struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {

    }
};`,
  pythonStarter: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def lowestCommonAncestor(self, root, p, q):
        `,
  buildCppHarness(mode, customInput = '') {
    const helper = treeBuilderCpp
    if (mode === 'run') return `
${helper}
int main() {
    Solution sol;
    auto root=buildTree({3,5,1,6,2,0,8,-1,-1,7,4});
    auto p=findNode(root,5), q=findNode(root,1);
    auto got=sol.lowestCommonAncestor(root,p,q);
    cout<<"\\n---RESULT---\\n";
    if(got&&got->val==3) cout<<"RESULT:PASS:3:"<<got->val<<"\\n";
    else cout<<"RESULT:FAIL:3:"<<(got?to_string(got->val):"-1")<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
${helper}
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,int pv,int qv,int exp,int n){
        auto root=buildTree(a);
        auto p=findNode(root,pv),q=findNode(root,qv);
        auto got=sol.lowestCommonAncestor(root,p,q);
        int gv=got?got->val:-1; bool ok=gv==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(gv));
    };
    chk({3,5,1,6,2,0,8,-1,-1,7,4},5,1,3,1);
    chk({3,5,1,6,2,0,8,-1,-1,7,4},5,6,5,2);
    chk({1,2,3},2,3,1,3);
    chk({1,2,3,4,5},4,5,2,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') return `
int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    const helper = treeBuilderPy
    if (mode === 'run') return `
${helper}
sol = Solution()
root=buildTree([3,5,1,6,2,0,8,None,None,7,4])
p=findNode(root,5); q=findNode(root,1)
got=sol.lowestCommonAncestor(root,p,q)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got and got.val==3 else 'FAIL'}:3:{got.val if got else -1}")`
    if (mode === 'submit') return `
${helper}
sol = Solution()
passed=0; res=[]
def chk(n,a,pv,qv,exp):
    global passed
    root=buildTree(a); p=findNode(root,pv); q=findNode(root,qv)
    got=sol.lowestCommonAncestor(root,p,q)
    gv=got.val if got else -1; ok=gv==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{gv}")
chk(1,[3,5,1,6,2,0,8,None,None,7,4],5,1,3)
chk(2,[3,5,1,6,2,0,8,None,None,7,4],5,6,5)
chk(3,[1,2,3],2,3,1)
chk(4,[1,2,3,4,5],4,5,2)
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 2. Burn Binary Tree ──────────────────────────────────────────────────
const burnBT = {
  id: 'burn-binary-tree',
  title: 'Burn Binary Tree',
  difficulty: 'Hard',
  category: 'binary-trees',
  askedBy: 'himali',
  description: [
    'Given a binary tree and a target leaf node, fire starts at the target. Each second, fire spreads to parent, left child, and right child.',
    'Return the number of seconds to burn the entire tree.',
  ],
  examples: [
    { input: 'root=[1,2,3,4,5,6,7], target=5', output: '3', explanation: 'Sec 0: {5}. Sec 1: {2}. Sec 2: {1,4}. Sec 3: {3}. Fully burned at sec 3.' },
  ],
  constraints: ['1 ≤ nodes ≤ 10⁵', 'All node values unique', 'target is a leaf'],
  hints: [
    'Build a parent-pointer map via BFS.',
    'Multi-source BFS from target: each level = 1 second. Spread to left, right, parent.',
    'Use a visited set. The answer is the number of BFS levels − 1.',
  ],
  inputFormat: 'Conceptual — use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'Example',   input: 'tree=[1,2,3,4,5,6,7], target=5',     expected: '3' },
    { label: 'Root leaf', input: 'tree=[1], target=1',                  expected: '0' },
    { label: 'Deep right',input: 'tree=[1,2,3,-1,-1,-1,4], target=4',  expected: '3' },
    { label: 'Left chain',input: 'tree=[1,2,-1,3,-1], target=3',       expected: '2' },
  ],
  cppStarter: `struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    int timeToBurn(TreeNode* root, int target) {

    }
};`,
  pythonStarter: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def timeToBurn(self, root, target: int) -> int:
        `,
  buildCppHarness(mode, customInput = '') {
    const helper = treeBuilderCpp
    if (mode === 'run') return `
${helper}
int main() {
    Solution sol;
    auto root=buildTree({1,2,3,4,5,6,7});
    int got=sol.timeToBurn(root,5);
    cout<<"\\n---RESULT---\\n";
    if(got==3) cout<<"RESULT:PASS:3:"<<got<<"\\n";
    else       cout<<"RESULT:FAIL:3:"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
${helper}
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,int t,int exp,int n){
        int got=sol.timeToBurn(buildTree(a),t); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+to_string(exp)+":"+to_string(got));
    };
    chk({1,2,3,4,5,6,7},5,3,1);
    chk({1},1,0,2);
    chk({1,2,3,-1,-1,-1,4},4,3,3);
    chk({1,2,-1,3,-1},3,2,4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    const helper = treeBuilderPy
    if (mode === 'run') return `
${helper}
sol = Solution()
got=sol.timeToBurn(buildTree([1,2,3,4,5,6,7]),5)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==3 else 'FAIL'}:3:{got}")`
    if (mode === 'submit') return `
${helper}
sol = Solution()
passed=0; res=[]
def chk(n,a,t,exp):
    global passed
    got=sol.timeToBurn(buildTree(a),t); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[1,2,3,4,5,6,7],5,3)
chk(2,[1],1,0)
chk(3,[1,2,3,None,None,None,4],4,3)
chk(4,[1,2,None,3,None],3,2)
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 3. Morris Preorder / Inorder Traversal ───────────────────────────────
const morrisTraversal = {
  id: 'morris-traversal',
  title: 'Morris Preorder / Inorder Traversal',
  difficulty: 'Hard',
  category: 'binary-trees',
  askedBy: 'himali',
  description: [
    'Traverse a binary tree in <strong>preorder</strong> and <strong>inorder</strong> using <strong>O(1) extra space</strong> (Morris Traversal — no stack, no recursion).',
    'Return both traversals.',
  ],
  examples: [
    { input: 'root=[1,2,3,4,5,6,7]', output: 'preorder=[1,2,4,5,3,6,7], inorder=[4,2,5,1,6,3,7]' },
  ],
  constraints: ['0 ≤ nodes ≤ 10⁵'],
  hints: [
    'Morris uses threaded binary trees. For inorder: find the inorder predecessor of current node; if its right is null, thread it to current and move left. Else unthread it, visit current, move right.',
    'For preorder: visit current before moving left (instead of after unthreading).',
    'No additional data structures needed beyond a few pointers.',
  ],
  inputFormat: 'Conceptual — use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'Full tree',   input: 'tree=[1,2,3,4,5,6,7]', expected: 'pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7' },
    { label: 'Single',      input: 'tree=[1]',              expected: 'pre:1|in:1'                         },
    { label: 'Left skew',   input: 'tree=[3,2,-1,1,-1]',   expected: 'pre:3,2,1|in:1,2,3'                },
    { label: 'Right skew',  input: 'tree=[1,-1,2,-1,3]',   expected: 'pre:1,2,3|in:1,2,3'                },
  ],
  cppStarter: `struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    vector<int> morrisPreorder(TreeNode* root) {

    }

    vector<int> morrisInorder(TreeNode* root) {

    }
};`,
  pythonStarter: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def morrisPreorder(self, root) -> list:


    def morrisInorder(self, root) -> list:
        `,
  buildCppHarness(mode, customInput = '') {
    const helper = treeBuilderCpp
    const fmtV = `auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`
    if (mode === 'run') return `
${helper}
int main() {
    Solution sol; ${fmtV}
    auto root=buildTree({1,2,3,4,5,6,7});
    string pre=fmtV(sol.morrisPreorder(root));
    string in_=fmtV(sol.morrisInorder(buildTree({1,2,3,4,5,6,7})));
    string got="pre:"+pre+"|in:"+in_;
    string exp="pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
${helper}
int main() {
    Solution sol; ${fmtV}
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,string exp,int n){
        string pre=fmtV(sol.morrisPreorder(buildTree(a)));
        string in_=fmtV(sol.morrisInorder(buildTree(a)));
        string got="pre:"+pre+"|in:"+in_;
        bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({1,2,3,4,5,6,7},"pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7",1);
    chk({1},"pre:1|in:1",2);
    chk({3,2,-1,1,-1},"pre:3,2,1|in:1,2,3",3);
    chk({1,-1,2,-1,3},"pre:1,2,3|in:1,2,3",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    const helper = treeBuilderPy
    if (mode === 'run') return `
${helper}
sol = Solution()
pre=",".join(map(str,sol.morrisPreorder(buildTree([1,2,3,4,5,6,7]))))
in_=",".join(map(str,sol.morrisInorder(buildTree([1,2,3,4,5,6,7]))))
got=f"pre:{pre}|in:{in_}"; exp="pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
${helper}
sol = Solution()
passed=0; res=[]
def chk(n,a,exp):
    global passed
    pre=",".join(map(str,sol.morrisPreorder(buildTree(a))))
    in_=",".join(map(str,sol.morrisInorder(buildTree(a))))
    got=f"pre:{pre}|in:{in_}"; ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[1,2,3,4,5,6,7],"pre:1,2,4,5,3,6,7|in:4,2,5,1,6,3,7")
chk(2,[1],"pre:1|in:1")
chk(3,[3,2,None,1,None],"pre:3,2,1|in:1,2,3")
chk(4,[1,None,2,None,3],"pre:1,2,3|in:1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 4. Children Sum Property ─────────────────────────────────────────────
const childrenSum = {
  id: 'children-sum-property',
  title: 'Children Sum Property in Binary Tree',
  difficulty: 'Medium',
  category: 'binary-trees',
  askedBy: 'vjs',
  description: [
    'Given a binary tree, change node values so that every non-leaf node equals the sum of its children.',
    'You may only <strong>increase</strong> node values (not decrease). Return the modified tree\'s root.',
    'The property must hold for all non-leaf nodes.',
  ],
  examples: [
    { input: 'root=[2,35,10,2,3,5,2]', output: 'root=[45,35,10,2,3,5,2] (or any valid result)' },
  ],
  constraints: ['1 ≤ nodes ≤ 10⁵', '1 ≤ node.val ≤ 10⁴'],
  hints: [
    'DFS: at each node, set it to max(node.val, left.val + right.val) first, then propagate updates downward.',
    'After setting children, recurse into children, then update parent to children sum on the way back up.',
    'Two-pass approach: first pass pushes larger values down, second pass pushes sums back up.',
  ],
  inputFormat: 'Conceptual — use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'GFG ex',   input: 'tree=[2,35,10,2,3,5,2]', expected: 'valid' },
    { label: 'Single',   input: 'tree=[5]',                expected: 'valid' },
    { label: 'Two nodes',input: 'tree=[1,2]',              expected: 'valid' },
    { label: 'Already',  input: 'tree=[10,4,6,1,3,2,4]',  expected: 'valid' },
  ],
  cppStarter: `struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    void changeTree(TreeNode* root) {

    }
};`,
  pythonStarter: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def changeTree(self, root) -> None:
        `,
  buildCppHarness(mode, customInput = '') {
    const helper = treeBuilderCpp
    const verify = `
bool verify(TreeNode* root){
    if(!root||(!root->left&&!root->right)) return true;
    int s=0; if(root->left)s+=root->left->val; if(root->right)s+=root->right->val;
    return root->val==s && verify(root->left) && verify(root->right);
}`
    if (mode === 'run') return `
${helper}${verify}
int main() {
    Solution sol;
    auto root=buildTree({2,35,10,2,3,5,2});
    sol.changeTree(root);
    int ok=verify(root)?1:0;
    cout<<"\\n---RESULT---\\n";
    if(ok) cout<<"RESULT:PASS:valid:valid\\n";
    else   cout<<"RESULT:FAIL:valid:invalid\\n";
    return 0;
}`
    if (mode === 'submit') return `
${helper}${verify}
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,int n){
        auto root=buildTree(a); sol.changeTree(root);
        bool ok=verify(root); passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:valid:valid":":FAIL:valid:invalid"));
    };
    chk({2,35,10,2,3,5,2},1);
    chk({5},2);
    chk({1,2},3);
    chk({10,4,6,1,3,2,4},4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    const helper = treeBuilderPy
    if (mode === 'run') return `
${helper}
def verify(root):
    if not root or (not root.left and not root.right): return True
    s=(root.left.val if root.left else 0)+(root.right.val if root.right else 0)
    return root.val==s and verify(root.left) and verify(root.right)
sol = Solution()
root=buildTree([2,35,10,2,3,5,2]); sol.changeTree(root)
ok=verify(root)
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if ok else 'FAIL'}:valid:{'valid' if ok else 'invalid'}")`
    if (mode === 'submit') return `
${helper}
def verify(root):
    if not root or (not root.left and not root.right): return True
    s=(root.left.val if root.left else 0)+(root.right.val if root.right else 0)
    return root.val==s and verify(root.left) and verify(root.right)
sol = Solution()
passed=0; res=[]
def chk(n,a):
    global passed
    root=buildTree(a); sol.changeTree(root); ok=verify(root); passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:valid:{'valid' if ok else 'invalid'}")
chk(1,[2,35,10,2,3,5,2]); chk(2,[5]); chk(3,[1,2]); chk(4,[10,4,6,1,3,2,4])
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 5. Zig-Zag Level Order ───────────────────────────────────────────────
const zigzagLevelOrder = {
  id: 'zigzag-level-order',
  title: 'Binary Tree Zigzag Level Order Traversal',
  difficulty: 'Medium',
  category: 'binary-trees',
  askedBy: 'vjs',
  description: [
    'Given a binary tree, return the zigzag level order traversal of its node values.',
    'Even levels (0-indexed) go left-to-right; odd levels go right-to-left.',
  ],
  examples: [
    { input: 'root=[3,9,20,-1,-1,15,7]', output: '[[3],[20,9],[15,7]]' },
    { input: 'root=[1]',                  output: '[[1]]' },
  ],
  constraints: ['0 ≤ nodes ≤ 2000', '-100 ≤ node.val ≤ 100'],
  hints: [
    'Standard BFS level-order traversal.',
    'After collecting each level, reverse it if the level index is odd (0-indexed).',
    'Use a deque or just reverse the level vector on alternating levels.',
  ],
  inputFormat: 'Conceptual — use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'Example 1', input: 'tree=[3,9,20,-1,-1,15,7]',    expected: '[[3],[20,9],[15,7]]'         },
    { label: 'Single',    input: 'tree=[1]',                     expected: '[[1]]'                      },
    { label: '2 levels',  input: 'tree=[1,2,3]',                 expected: '[[1],[3,2]]'                },
    { label: '3 levels',  input: 'tree=[1,2,3,4,5,6,7]',        expected: '[[1],[3,2],[4,5,6,7]]'      },
  ],
  cppStarter: `struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {

    }
};`,
  pythonStarter: `from typing import List

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def zigzagLevelOrder(self, root) -> List[List[int]]:
        `,
  buildCppHarness(mode, customInput = '') {
    const helper = treeBuilderCpp
    const fmt = `auto fmtR=[](vector<vector<int>> v){string s="[";for(int i=0;i<(int)v.size();i++){s+="[";for(int j=0;j<(int)v[i].size();j++){if(j)s+=",";s+=to_string(v[i][j]);}s+="]";if(i+1<(int)v.size())s+=",";}return s+"]";};`
    if (mode === 'run') return `
${helper}
int main() {
    Solution sol; ${fmt}
    string got=fmtR(sol.zigzagLevelOrder(buildTree({3,9,20,-1,-1,15,7})));
    string exp="[[3],[20,9],[15,7]]";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
${helper}
int main() {
    Solution sol; ${fmt}
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,string exp,int n){
        string got=fmtR(sol.zigzagLevelOrder(buildTree(a))); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({3,9,20,-1,-1,15,7},"[[3],[20,9],[15,7]]",1);
    chk({1},"[[1]]",2);
    chk({1,2,3},"[[1],[3,2]]",3);
    chk({1,2,3,4,5,6,7},"[[1],[3,2],[4,5,6,7]]",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    const helper = treeBuilderPy
    if (mode === 'run') return `
${helper}
sol = Solution()
got=str(sol.zigzagLevelOrder(buildTree([3,9,20,None,None,15,7]))).replace(" ","")
exp="[[3],[20,9],[15,7]]"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
${helper}
sol = Solution()
passed=0; res=[]
def chk(n,a,exp):
    global passed
    got=str(sol.zigzagLevelOrder(buildTree(a))).replace(" ",""); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[3,9,20,None,None,15,7],"[[3],[20,9],[15,7]]")
chk(2,[1],"[[1]]")
chk(3,[1,2,3],"[[1],[3,2]]")
chk(4,[1,2,3,4,5,6,7],"[[1],[3,2],[4,5,6,7]]")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 6. Construct BT from Preorder + Inorder ──────────────────────────────
const constructBT = {
  id: 'construct-bt-preorder-inorder',
  title: 'Construct Binary Tree from Preorder and Inorder',
  difficulty: 'Medium',
  category: 'binary-trees',
  askedBy: 'vjs',
  description: [
    'Given <code>preorder</code> and <code>inorder</code> traversal arrays of a binary tree, construct and return the tree.',
  ],
  examples: [
    { input: 'preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]', output: '[3,9,20,-1,-1,15,7]' },
  ],
  constraints: ['1 ≤ n ≤ 3000', 'All values are unique'],
  hints: [
    'The first element of preorder is always the root.',
    'Find the root in inorder — elements to its left form the left subtree, right form the right subtree.',
    'Use a hashmap for O(1) inorder index lookup. Recurse with adjusted index ranges.',
  ],
  inputFormat: 'Conceptual — use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'Example',  input: 'pre=[3,9,20,15,7], in=[9,3,15,20,7]', expected: '[3,9,20,-1,-1,15,7]' },
    { label: 'Single',   input: 'pre=[1], in=[1]',                      expected: '[1]'                 },
    { label: 'Two nodes',input: 'pre=[1,2], in=[2,1]',                  expected: '[1,2,-1]'            },
    { label: 'Right skew',input:'pre=[1,2,3], in=[1,2,3]',              expected: '[1,-1,2,-1,3]'       },
  ],
  cppStarter: `struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {

    }
};`,
  pythonStarter: `from typing import List

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]):
        `,
  buildCppHarness(mode, customInput = '') {
    if (mode === 'run') return `
int main() {
    Solution sol;
    vector<int> pre={3,9,20,15,7}, in_={9,3,15,20,7};
    auto root=sol.buildTree(pre,in_);
    function<void(TreeNode*,vector<int>&)> inord=[&](TreeNode* r,vector<int>& v){if(!r)return;inord(r->left,v);v.push_back(r->val);inord(r->right,v);};
    vector<int> result; inord(root,result);
    string got="",exp="9,3,15,20,7";
    for(int i=0;i<(int)result.size();i++){if(i)got+=",";got+=to_string(result[i]);}
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
int main() {
    Solution sol;
    int passed=0,total=4; vector<string> res;
    function<void(TreeNode*,vector<int>&)> inord=[&](TreeNode* r,vector<int>& v){if(!r)return;inord(r->left,v);v.push_back(r->val);inord(r->right,v);};
    auto joinV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};
    auto chk=[&](vector<int> pre,vector<int> in_,string expIn,int n){
        auto root=sol.buildTree(pre,in_);
        vector<int> gi; inord(root,gi);
        string gis=joinV(gi);
        bool ok=(gis==expIn); passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+expIn+":"+gis);
    };
    chk({3,9,20,15,7},{9,3,15,20,7},"9,3,15,20,7",1);
    chk({1},{1},"1",2);
    chk({1,2},{2,1},"2,1",3);
    chk({1,2,3},{1,2,3},"1,2,3",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    if (mode === 'run') return `
sol = Solution()
pre=[3,9,20,15,7]; in_=[9,3,15,20,7]
root=sol.buildTree(pre,in_)
def inorder(r):
    if not r: return []
    return inorder(r.left)+[r.val]+inorder(r.right)
got=",".join(map(str,inorder(root))); exp="9,3,15,20,7"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
sol = Solution()
passed=0; res=[]
def inorder(r):
    if not r: return []
    return inorder(r.left)+[r.val]+inorder(r.right)
def chk(n,pre,in_,expIn):
    global passed
    root=sol.buildTree(pre,in_)
    got=",".join(map(str,inorder(root))); ok=got==expIn; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{expIn}:{got}")
chk(1,[3,9,20,15,7],[9,3,15,20,7],"9,3,15,20,7")
chk(2,[1],[1],"1")
chk(3,[1,2],[2,1],"2,1")
chk(4,[1,2,3],[1,2,3],"1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

// ── 7. Boundary Traversal of Binary Tree ────────────────────────────────
const boundaryTraversal = {
  id: 'boundary-traversal-bt',
  title: 'Boundary Traversal of Binary Tree',
  difficulty: 'Medium',
  category: 'binary-trees',
  askedBy: 'vjs',
  description: [
    'Return the boundary nodes of a binary tree in anti-clockwise order starting from the root.',
    'Boundary = left boundary (top to bottom, excluding leaf) + all leaf nodes (left to right) + right boundary (bottom to top, excluding leaf).',
  ],
  examples: [
    { input: 'root=[1,2,3,4,5,6,7]', output: '[1,2,4,5,6,7,3]' },
  ],
  constraints: ['1 ≤ nodes ≤ 10⁵'],
  hints: [
    'Split into three parts: left boundary (go left when possible, else right; stop at leaf), leaves (DFS collect all leaves), right boundary (go right when possible, else left; collect in reverse).',
    'Exclude the root from left/right boundary traversal (add it separately at the start).',
    'Combine: root + left boundary + leaves + reversed right boundary.',
  ],
  inputFormat: 'Conceptual — use run/submit modes',
  defaultCustomInput: '',
  testCases: [
    { label: 'Full tree',   input: 'tree=[1,2,3,4,5,6,7]', expected: '1,2,4,5,6,7,3'   },
    { label: 'Single',      input: 'tree=[1]',              expected: '1'                },
    { label: 'Left skew',   input: 'tree=[1,2,-1,3,-1]',   expected: '1,2,3'            },
    { label: 'Two children',input: 'tree=[1,2,3]',          expected: '1,2,3'            },
  ],
  cppStarter: `struct TreeNode {
    int val; TreeNode* left; TreeNode* right;
    TreeNode(int x):val(x),left(nullptr),right(nullptr){}
};

class Solution {
public:
    vector<int> boundaryOfBinaryTree(TreeNode* root) {

    }
};`,
  pythonStarter: `from typing import List

class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def boundaryOfBinaryTree(self, root) -> List[int]:
        `,
  buildCppHarness(mode, customInput = '') {
    const helper = treeBuilderCpp
    const fmtV = `auto fmtV=[](vector<int> v){string s;for(int i=0;i<(int)v.size();i++){if(i)s+=",";s+=to_string(v[i]);}return s;};`
    if (mode === 'run') return `
${helper}
int main() {
    Solution sol; ${fmtV}
    string got=fmtV(sol.boundaryOfBinaryTree(buildTree({1,2,3,4,5,6,7})));
    string exp="1,2,4,5,6,7,3";
    cout<<"\\n---RESULT---\\n";
    if(got==exp) cout<<"RESULT:PASS:"<<exp<<":"<<got<<"\\n";
    else         cout<<"RESULT:FAIL:"<<exp<<":"<<got<<"\\n";
    return 0;
}`
    if (mode === 'submit') return `
${helper}
int main() {
    Solution sol; ${fmtV}
    int passed=0,total=4; vector<string> res;
    auto chk=[&](vector<int> a,string exp,int n){
        string got=fmtV(sol.boundaryOfBinaryTree(buildTree(a))); bool ok=got==exp; passed+=ok;
        res.push_back("TEST:"+to_string(n)+(ok?":PASS:":":FAIL:")+exp+":"+got);
    };
    chk({1,2,3,4,5,6,7},"1,2,4,5,6,7,3",1);
    chk({1},"1",2);
    chk({1,2,-1,3,-1},"1,2,3",3);
    chk({1,2,3},"1,2,3",4);
    cout<<"\\n---RESULT---\\n";
    for(auto& s:res) cout<<s<<"\\n";
    cout<<"SUMMARY:"<<passed<<":"<<total<<"\\n";
    return passed==total?0:1;
}`
    if (mode === 'custom') return `int main(){cout<<"Use run/submit mode\\n";return 0;}`
  },
  buildPythonHarness(mode, customInput = '') {
    const helper = treeBuilderPy
    if (mode === 'run') return `
${helper}
sol = Solution()
got=",".join(map(str,sol.boundaryOfBinaryTree(buildTree([1,2,3,4,5,6,7]))))
exp="1,2,4,5,6,7,3"
print("\\n---RESULT---")
print(f"RESULT:{'PASS' if got==exp else 'FAIL'}:{exp}:{got}")`
    if (mode === 'submit') return `
${helper}
sol = Solution()
passed=0; res=[]
def chk(n,a,exp):
    global passed
    got=",".join(map(str,sol.boundaryOfBinaryTree(buildTree(a)))); ok=got==exp; passed+=ok
    res.append(f"TEST:{n}:{'PASS' if ok else 'FAIL'}:{exp}:{got}")
chk(1,[1,2,3,4,5,6,7],"1,2,4,5,6,7,3")
chk(2,[1],"1")
chk(3,[1,2,None,3,None],"1,2,3")
chk(4,[1,2,3],"1,2,3")
print("\\n---RESULT---")
for r in res: print(r)
print(f"SUMMARY:{passed}:4")`
    if (mode === 'custom') return `print("Use run/submit mode")`
  },
}

export const PROBLEMS = [lcaBT, burnBT, morrisTraversal, childrenSum, zigzagLevelOrder, constructBT, boundaryTraversal]

function LCAViz() {
  const nodes = [
    { val: 3, left: 1, right: 2 },
    { val: 5, left: 3, right: 4 },
    { val: 1, left: 5, right: 6 },
    { val: 6, left: null, right: null },
    { val: 2, left: 7, right: 8 },
    { val: 0, left: null, right: null },
    { val: 8, left: null, right: null },
    { val: 7, left: null, right: null },
    { val: 4, left: null, right: null },
  ]
  return <TreeViz nodes={nodes} root={0} highlight={new Set([3, 5, 6, 4])} highlightColor="var(--teal)" label="LCA(6, 4) = 3 — highlighted path" />
}

function BurnViz() {
  const nodes = [
    { val: 1, left: 1, right: 2 },
    { val: 2, left: 3, right: 4 },
    { val: 3, left: null, right: null },
    { val: 4, left: null, right: null },
    { val: 5, left: null, right: null },
  ]
  return <TreeViz nodes={nodes} root={0} highlight={new Set([1])} highlightColor="var(--red)" label="Fire starts at node 1" />
}

function ZigZagViz() {
  const nodes = [
    { val: 3, left: 1, right: 2 },
    { val: 9, left: null, right: null },
    { val: 20, left: 3, right: 4 },
    { val: 15, left: null, right: null },
    { val: 7, left: null, right: null },
  ]
  return <TreeViz nodes={nodes} root={0} highlight={new Set([])} label="Zig-zag: [[3],[20,9],[15,7]]" />
}

export const VIZ = {
  'lca-binary-tree': () => <LCAViz />,
  'burn-binary-tree': () => <BurnViz />,
  'zigzag-level-order': () => <ZigZagViz />,
}
