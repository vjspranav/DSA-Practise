// Registry of the C++ syntax a Python programmer meets across the whole Learn path (all 8 stages).
// Lessons list the ids they teach in `introduces`; scripts/verify-cpp-learn.mjs fails a lesson whose learner-facing
// C++ code uses an id before some lesson taught it. Pure JS, no browser imports (the checker loads it in Node).
//
// Each entry: { id, stage, label, patterns?, strings?, raw?, headers? }
//   stage:    the curriculum stage (1..8) that introduces it; CPP_LEARN_ASSUME=K treats stage <= K as taught.
//   patterns: RegExps run on the code with comments removed, #include lines reduced to "#include", and string and
//             char literal contents blanked (a string becomes "" and a char becomes '~'), so nothing inside a
//             literal can match.
//   strings:  RegExps run on the CONTENTS of string literals (escapes like \n live there) and, for a <code> span
//             from a task or hint, on the whole span text.
//   raw:      RegExps run on the untouched source.
//   comment:  'line' | 'block': a real // or /* */ comment exists (not one inside a string or char literal).
//   headers:  header names that count as a hit when `#include <name>` appears.
// Stages add ids to their own section freely; patterns only need to be good enough to catch honest mistakes.
//
// Known limits (regexes cannot parse C++):
//   - `<` and `>` count as comparison only when spaced (`i < n`) or next to a digit; `vector<int>` is never one.
//     `>>` is "extract" only inside a statement that starts with cin; the closer of `vector<vector<int>>` is not.
//   - `*` is multiplication only when spaced (`a * b`) or next to a digit; `int *p` / `Node* p` are declarations.
//     Unspaced `a*b` between plain names is invisible, and `int * p` with spaces reads as a declaration.
//   - `&` is a reference when a type word (int, string, vector<..>, a Capitalised type) sits before it, an address
//     when it follows `= ( , return`, and `&&` is logical-and. A user type with a lowercase name is not recognised.
//   - Calls of user-defined methods (`obj.area()`) are not tracked; calls of the std methods listed here are.
//   - Function definitions are recognised at the start of a line as `type name(...) {`; constructors are
//     `Capitalised(...) {` or `... : init(...) {` at the start of a line.
//   - Names a learner defines themselves (a function called `max` or `sort`) trip the matching id.
import { stripComments } from './grade.js'

const inc = (h, stage) => ({ id: `include-${h}`, stage, label: `#include <${h}>`, headers: [h] })
// Types and keywords that can stand before a pointer star or a reference ampersand in a declaration.
const TYPE_WORD = String.raw`(?:int|double|float|char|bool|long|short|unsigned|void|auto|string|size_t|T|[A-Z]\w*)`
const STD_TEMPLATES = 'static_cast|make_unique|make_pair|make_tuple|make_shared|get|vector|deque|queue|stack|set|multiset|map|multimap|unordered_map|unordered_set|priority_queue|pair|tuple|unique_ptr|array|list|greater|less'

export const SYNTAX = [
  // ── stage 1: basics ──
  inc('iostream', 1), inc('string', 1), inc('cmath', 1), inc('climits', 1), inc('iomanip', 1),
  { id: 'int-main', stage: 1, label: 'int main()', patterns: [/\bint\s+main\s*\(/] },
  { id: 'return-zero', stage: 1, label: 'return 0;', patterns: [/\breturn\s+0\s*;/] },
  { id: 'using-namespace-std', stage: 1, label: 'using namespace std;', patterns: [/\busing\s+namespace\s+std\b/] },
  { id: 'std-qualified', stage: 1, label: 'std::name', patterns: [/\bstd\s*::/] },
  { id: 'cout', stage: 1, label: 'cout', patterns: [/\bcout\b/] },
  { id: 'stream-insert', stage: 1, label: '<<', patterns: [/<</] },
  { id: 'endl', stage: 1, label: 'endl', patterns: [/\bendl\b/] },
  { id: 'newline-escape', stage: 1, label: '"\\n"', patterns: [], strings: [/\\n/] },
  { id: 'string-literal', stage: 1, label: 'string literal "..."', patterns: [/"/] },
  { id: 'cin', stage: 1, label: 'cin', patterns: [/\bcin\b/] },
  { id: 'stream-extract', stage: 1, label: 'cin >> x', patterns: [/\bcin\b[^;]*>>/] },
  { id: 'semicolon', stage: 1, label: ';', patterns: [/;/] },
  { id: 'comment', stage: 1, label: '// comment', patterns: [], comment: 'line' },
  { id: 'block-comment', stage: 1, label: '/* comment */', patterns: [], comment: 'block' },
  { id: 'int', stage: 1, label: 'int', patterns: [/\bint\b(?!\s+main\b)/] },
  { id: 'double', stage: 1, label: 'double / float / 1.5', patterns: [/\b(?:double|float)\b/, /(?<![\w.])\d+\.\d+/] },
  { id: 'bool', stage: 1, label: 'bool, true, false', patterns: [/\b(?:bool|true|false)\b/] },
  { id: 'char', stage: 1, label: "char and 'c'", patterns: [/\bchar\b/, /'~'/] },
  { id: 'string-type', stage: 1, label: 'string', patterns: [/\bstring\b/] },
  { id: 'assign', stage: 1, label: '= (assign / initialise)', patterns: [/(?<![=!<>+\-*/%&|^])=(?!=)/] },
  { id: 'auto', stage: 1, label: 'auto', patterns: [/\bauto\b/] },
  { id: 'const', stage: 1, label: 'const', patterns: [/\bconst\b/] },
  { id: 'arithmetic', stage: 1, label: '+ - * /',
    patterns: [/[\w)\]](?<!\b(?:return|case))\s*[-+/]\s*[\w(]/, /[\w)\]]\s+\*\s+[\w(]/, /\d\s*\*\s*[\w(]/] },
  { id: 'modulo', stage: 1, label: '%', patterns: [/[\w)\]]\s*%\s*[\w(]/] },
  { id: 'compound-assign', stage: 1, label: '+= -= *= ...', patterns: [/(?:[-+*/%&|^]|<<|>>)=(?!=)/] },
  { id: 'incr-decr', stage: 1, label: '++ --', patterns: [/\+\+|--/] },
  { id: 'static-cast', stage: 1, label: 'static_cast<T>(x)', patterns: [/\bstatic_cast\s*</] },
  { id: 'long-long', stage: 1, label: 'long long', patterns: [/\blong\s+long\b/] },
  { id: 'unsigned', stage: 1, label: 'unsigned', patterns: [/\bunsigned\b/] },
  { id: 'int-max', stage: 1, label: 'INT_MAX / INT_MIN', patterns: [/\b(?:INT_MAX|INT_MIN|LLONG_MAX|LLONG_MIN|UINT_MAX)\b/] },
  { id: 'math-functions', stage: 1, label: 'sqrt, pow, abs, floor ...', patterns: [/\b(?:sqrt|pow|abs|fabs|floor|ceil|round|log|exp|sin|cos|hypot)\s*\(/] },
  { id: 'setprecision', stage: 1, label: 'fixed << setprecision(2)', patterns: [/\b(?:fixed|setprecision|setw|setfill)\b/] },

  // ── stage 2: control flow ──
  { id: 'comparison', stage: 2, label: '== != < > <= >=', patterns: [/==|!=|<=|>=/, /(?<=\s)[<>](?=\s)/, /[\w)\]]\s*[<>]\s*\d/, /\d\s*[<>]\s*[\w(]/] },
  { id: 'logical-ops', stage: 2, label: '&& ||', patterns: [/&&|\|\|/] },
  { id: 'not-op', stage: 2, label: '! (not)', patterns: [/(?<![\w)\]])!(?!=)/] },
  { id: 'alt-operators', stage: 2, label: 'and / or / not', patterns: [/\b(?:and|or|not)\b/] },
  { id: 'if', stage: 2, label: 'if', patterns: [/\bif\b/] },
  { id: 'else', stage: 2, label: 'else / else if', patterns: [/\belse\b/] },
  { id: 'assign-in-condition', stage: 2, label: 'if (x = 5)', patterns: [/\b(?:if|while)\s*\([^()=!<>]*[^=!<>\s]\s*=\s*[^=]/] },
  { id: 'switch', stage: 2, label: 'switch / case / default', patterns: [/\bswitch\b/, /\bcase\b/, /\bdefault\s*:/] },
  { id: 'while', stage: 2, label: 'while', patterns: [/\bwhile\b/] },
  { id: 'while-cin', stage: 2, label: 'while (cin >> x)', patterns: [/\bwhile\s*\(\s*cin\b/] },
  { id: 'for-classic', stage: 2, label: 'for (int i = 0; ...; ...)', patterns: [/\bfor\s*\([^;)]*;/] },
  { id: 'break-continue', stage: 2, label: 'break / continue', patterns: [/\b(?:break|continue)\b/] },
  { id: 'do-while', stage: 2, label: 'do { } while', patterns: [/\bdo\b/] },
  { id: 'ternary', stage: 2, label: 'c ? a : b', patterns: [/\?[^?;:]*:(?!:)/] },

  // ── stage 3: functions ──
  { id: 'function-def', stage: 3, label: 'type name(params) { }',
    patterns: [/^[ \t]*(?!(?:else|return|new|delete|case|goto|typedef|using|struct|class|namespace|do)\b)(?:(?:const|static|inline|unsigned)\s+)*[A-Za-z_][\w:]*(?:<[^()\n]*>)?[ \t]*[&*]*[ \t]+[&*]*(?!(?:if|for|while|switch|main|return)\b)[A-Za-z_]\w*\s*\([^;{}]*\)\s*(?:const\s*)?\{/m] },
  { id: 'void', stage: 3, label: 'void', patterns: [/\bvoid\b/] },
  { id: 'return-value', stage: 3, label: 'return value;', patterns: [/\breturn\b(?!\s*0\s*;)/] },
  { id: 'prototype', stage: 3, label: 'type name(params);', patterns: [/^[ \t]*(?!(?:return|else|delete|case|new|throw|using|goto)\b)[A-Za-z_][\w:<>&*]*[ \t]+[&*]*[A-Za-z_]\w*\s*\(\s*(?:\)|(?:const\s+)?[A-Za-z_][\w:<>,]*[\s&*]+\w+[^;{}()]*\))\s*;/m] },
  { id: 'reference-param', stage: 3, label: 'int& x (reference)', patterns: [new RegExp(String.raw`(?:\b${TYPE_WORD}|>)\s*&(?!&)\s*\w+`)] },
  { id: 'const-ref', stage: 3, label: 'const T& x', patterns: [/\bconst\s+[\w:<>,\s]*?&(?!&)/] },
  { id: 'default-arg', stage: 3, label: 'int x = 5 in a parameter list', patterns: [/[(,]\s*(?:const\s+)?[\w:<>]+[\s&*]+\w+\s*=\s*[^=,;()]+[,)]/] },
  { id: 'min-max', stage: 3, label: 'min(a, b) / max(a, b)', patterns: [/(?<![.\w])(?:min|max)\s*\(/] },
  { id: 'using-declaration', stage: 3, label: 'using std::cout;', patterns: [/\busing\s+(?!namespace\b)\w+(?:::\w+)+\s*;/] },
  { id: 'namespace-def', stage: 3, label: 'namespace name { }', patterns: [/\bnamespace\s+\w+\s*\{/] },
  { id: 'scope-resolution', stage: 3, label: 'Name::member', patterns: [/\b(?!std\b)\w+\s*::\s*\w/] },

  // ── stage 4: arrays, vectors and strings ──
  inc('vector', 4), inc('cctype', 4),
  { id: 'c-array', stage: 4, label: 'int a[5]', patterns: [new RegExp(String.raw`(?:\b${TYPE_WORD}|>)\s+\w+\s*\[`)] },
  { id: 'indexing', stage: 4, label: 'a[i]', patterns: [/[\w)\]]\[[^\]\n]*\]/] },
  { id: 'brace-init', stage: 4, label: '{1, 2, 3} initialiser', patterns: [/=\s*\{/, /(?:>|\b(?:int|double|char|bool|string|auto))\s+\w+\s*\{[^{}]*\}\s*;/, /\b[A-Z]\w*\s+\w+\s*\{[^{}]*\}\s*;/] },
  { id: 'size-t', stage: 4, label: 'size_t', patterns: [/\bsize_t\b/] },
  { id: 'vector', stage: 4, label: 'vector<T>', patterns: [/\bvector\b/] },
  { id: 'vector-sized', stage: 4, label: 'vector<int> v(n, 0)', patterns: [/\bvector\s*<[^;{}()]*>\s*\w+\s*\(\s*[\w.]+(?:\s*[-+*/]\s*[\w.]+)*(?:\s*,\s*[\w.]+(?:\s*[-+*/]\s*[\w.]+)*)?\s*\)\s*;/] },
  { id: 'vector-2d', stage: 4, label: 'vector<vector<int>>', patterns: [/\bvector\s*<\s*vector\b/] },
  { id: 'push-back', stage: 4, label: '.push_back()', patterns: [/\.push_back\s*\(/] },
  { id: 'pop-back', stage: 4, label: '.pop_back()', patterns: [/\.pop_back\s*\(/] },
  { id: 'size-method', stage: 4, label: '.size() / .length()', patterns: [/\.(?:size|length)\s*\(/] },
  { id: 'at-method', stage: 4, label: '.at()', patterns: [/\.at\s*\(/] },
  { id: 'back-front', stage: 4, label: '.back() / .front()', patterns: [/\.(?:back|front)\s*\(/] },
  { id: 'empty-method', stage: 4, label: '.empty()', patterns: [/\.empty\s*\(/] },
  { id: 'clear-method', stage: 4, label: '.clear()', patterns: [/\.clear\s*\(/] },
  { id: 'range-for', stage: 4, label: 'for (auto x : v)', patterns: [/\bfor\s*\((?:[^;:)]|::)*(?<!:):(?!:)[^;)]*\)/] },
  { id: 'substr', stage: 4, label: '.substr()', patterns: [/\.substr\s*\(/] },
  { id: 'find-method', stage: 4, label: '.find()', patterns: [/\.find\s*\(/] },
  { id: 'npos', stage: 4, label: 'string::npos', patterns: [/\bnpos\b/] },
  { id: 'cctype-fns', stage: 4, label: 'isdigit, isalpha, toupper ...', patterns: [/\b(?:isdigit|isalpha|isalnum|isupper|islower|isspace|toupper|tolower)\s*\(/] },
  { id: 'getline', stage: 4, label: 'getline(cin, line)', patterns: [/\bgetline\s*\(/] },
  { id: 'cin-ignore', stage: 4, label: 'cin.ignore()', patterns: [/\.ignore\s*\(/] },
  { id: 'to-string', stage: 4, label: 'to_string()', patterns: [/\bto_string\s*\(/] },
  { id: 'stoi', stage: 4, label: 'stoi / stod', patterns: [/\b(?:stoi|stol|stoll|stod)\s*\(/] },

  // ── stage 5: memory and pointers ──
  inc('memory', 5),
  { id: 'sizeof', stage: 5, label: 'sizeof', patterns: [/\bsizeof\b/] },
  { id: 'address-of', stage: 5, label: '&x (address of)', patterns: [/(?:[=(,]|\breturn)\s*&\s*[A-Za-z_]/] },
  { id: 'pointer-decl', stage: 5, label: 'int* p', patterns: [
    /\b(?:int|char|double|float|bool|long|unsigned|void|auto|string|T)\s*\*+\s*(?:const\s+)?[A-Za-z_]/,
    /[A-Z]\w*\*+\s*[A-Za-z_]/, /[A-Z]\w*\s+\*+[A-Za-z_]/, /\w\*+\s*>/] },
  { id: 'deref', stage: 5, label: '*p (dereference)', patterns: [/(?:^|[=(,{;!&|+\-*/<>?:]|\breturn\b)\s*\*+(?=[A-Za-z_(])/m] },
  { id: 'nullptr', stage: 5, label: 'nullptr', patterns: [/\b(?:nullptr|NULL)\b/] },
  { id: 'pointer-arith', stage: 5, label: '*(p + 1)', patterns: [/\*\s*\(\s*\w+\s*[-+]/] },
  { id: 'new', stage: 5, label: 'new', patterns: [/\bnew\b/] },
  { id: 'delete', stage: 5, label: 'delete / delete[]', patterns: [/\bdelete\b/] },
  { id: 'unique-ptr', stage: 5, label: 'unique_ptr / make_unique', patterns: [/\b(?:unique_ptr|make_unique)\b/] },
  { id: 'struct', stage: 5, label: 'struct', patterns: [/\bstruct\b/] },
  { id: 'arrow', stage: 5, label: 'p->field', patterns: [/->/] },
  { id: 'field-access', stage: 5, label: 'obj.field', patterns: [/[\w)\]]\.[A-Za-z_]\w*(?!\s*\()(?![\w])/] },

  // ── stage 6: structs and classes ──
  { id: 'class', stage: 6, label: 'class', patterns: [/\bclass\b/] },
  { id: 'access-spec', stage: 6, label: 'public: / private:', patterns: [/\b(?:public|private|protected)\s*:/] },
  { id: 'this', stage: 6, label: 'this', patterns: [/\bthis\b/] },
  { id: 'const-method', stage: 6, label: 'f() const { }', patterns: [/\)\s*const\s*[{;]/] },
  { id: 'constructor', stage: 6, label: 'Name(params) { }', patterns: [/^[ \t]*(?:explicit\s+)?[A-Z]\w*\s*\([^)]*\)\s*(?::[^{;]*)?\{/m] },
  { id: 'init-list', stage: 6, label: 'Name(...) : x(x) { }', patterns: [/\)\s*:\s*[A-Za-z_]\w*\s*[({]/] },
  { id: 'destructor', stage: 6, label: '~Name()', patterns: [/~\s*[A-Z]\w*\s*\(/] },
  { id: 'copy-ctor', stage: 6, label: 'Name(const Name&)', patterns: [/\b([A-Z]\w*)\s*\(\s*const\s+\1\s*&/] },
  { id: 'operator-overload', stage: 6, label: 'operator<, operator<<', patterns: [/\boperator\s*(?:<<|>>|[-+*/%<>=!]=?|\[\]|\(\))/] },
  { id: 'static-member', stage: 6, label: 'static', patterns: [/\bstatic\b/] },
  { id: 'inheritance', stage: 6, label: 'class B : public A', patterns: [/\b(?:class|struct)\s+\w+\s*:\s*(?:public|private|protected)?\s*\w+/] },
  { id: 'virtual', stage: 6, label: 'virtual / override', patterns: [/\b(?:virtual|override)\b/] },
  { id: 'template', stage: 6, label: 'template <typename T>', patterns: [/\btemplate\s*</, /\btypename\b/] },
  { id: 'template-args', stage: 6, label: 'f<int>(x)', patterns: [new RegExp(String.raw`\b(?!(?:${STD_TEMPLATES})\b)\w+\s*<\s*[\w:]+\s*>\s*\(`)] },

  // ── stage 7: the STL ──
  inc('algorithm', 7), inc('numeric', 7), inc('map', 7), inc('set', 7), inc('unordered_map', 7), inc('unordered_set', 7),
  inc('queue', 7), inc('stack', 7), inc('deque', 7), inc('utility', 7), inc('tuple', 7), inc('functional', 7),
  { id: 'pair', stage: 7, label: 'pair / make_pair', patterns: [/\b(?:pair|make_pair)\b/] },
  { id: 'pair-fields', stage: 7, label: '.first / .second', patterns: [/\.(?:first|second)\b/] },
  { id: 'tuple', stage: 7, label: 'tuple / get<0>', patterns: [/\b(?:tuple|make_tuple|tie)\b/, /\bget\s*<\s*\d+/] },
  { id: 'sort', stage: 7, label: 'sort(v.begin(), v.end())', patterns: [/\b(?:stable_)?sort\s*\(/] },
  { id: 'iterator-begin-end', stage: 7, label: '.begin() / .end()', patterns: [/\.(?:begin|end|rbegin|rend)\s*\(/] },
  { id: 'lambda', stage: 7, label: '[](int x) { ... }', patterns: [/(?<![\w)\]])\[[^\]\n]*\]\s*\([^)\n]*\)\s*(?:mutable\s*)?(?:->\s*[\w:<>&\s]+?)?\s*\{/] },
  { id: 'lambda-capture', stage: 7, label: '[&] / [x] capture', patterns: [/(?<![\w)\]])\[\s*[&=\w][^\]\n]*\]\s*\(/] },
  { id: 'map', stage: 7, label: 'map<K, V>', patterns: [/\b(?:map|multimap)\b/] },
  { id: 'unordered-map', stage: 7, label: 'unordered_map', patterns: [/\bunordered_map\b/] },
  { id: 'set', stage: 7, label: 'set<T>', patterns: [/\bset\b/] },
  { id: 'unordered-set', stage: 7, label: 'unordered_set', patterns: [/\bunordered_set\b/] },
  { id: 'multiset', stage: 7, label: 'multiset', patterns: [/\bmultiset\b/] },
  { id: 'count-method', stage: 7, label: '.count()', patterns: [/\.count\s*\(/] },
  { id: 'erase-method', stage: 7, label: '.erase()', patterns: [/\.erase\s*\(/] },
  { id: 'insert-method', stage: 7, label: '.insert() / .emplace()', patterns: [/\.(?:insert|emplace|emplace_back)\s*\(/] },
  { id: 'stack', stage: 7, label: 'stack', patterns: [/\bstack\b/] },
  { id: 'queue', stage: 7, label: 'queue', patterns: [/\bqueue\b/] },
  { id: 'deque', stage: 7, label: 'deque', patterns: [/\bdeque\b/] },
  { id: 'priority-queue', stage: 7, label: 'priority_queue', patterns: [/\bpriority_queue\b/] },
  { id: 'greater', stage: 7, label: 'greater<int>', patterns: [/\b(?:greater|less)\b/] },
  { id: 'stack-ops', stage: 7, label: '.push() .pop() .top()', patterns: [/\.(?:push|pop|top|push_front|pop_front)\s*\(/] },
  { id: 'lower-bound', stage: 7, label: 'lower_bound / upper_bound', patterns: [/\b(?:lower_bound|upper_bound|binary_search)\b/] },
  { id: 'reverse', stage: 7, label: 'reverse(v.begin(), v.end())', patterns: [/(?<![.\w])reverse\s*\(/] },
  { id: 'min-max-element', stage: 7, label: 'min_element / max_element', patterns: [/\b(?:min_element|max_element)\b/] },
  { id: 'accumulate', stage: 7, label: 'accumulate', patterns: [/\baccumulate\b/] },
  { id: 'count-algo', stage: 7, label: 'count(begin, end, x)', patterns: [/(?<![.\w])count\s*\(/] },
  { id: 'find-algo', stage: 7, label: 'find(begin, end, x)', patterns: [/(?<![.\w])find\s*\(/] },
  { id: 'unique-algo', stage: 7, label: 'unique(begin, end)', patterns: [/(?<![.\w])unique\s*\(/] },
  { id: 'numeric-limits', stage: 7, label: 'numeric_limits<T>::max()', patterns: [/\bnumeric_limits\b/] },

  // ── stage 8: DSA basics ──
  { id: 'fill-algo', stage: 8, label: 'fill / iota / memset', patterns: [/(?<![.\w])(?:fill|iota|memset)\s*\(/] },
  { id: 'type-alias', stage: 8, label: 'using ll = long long;', patterns: [/\busing\s+\w+\s*=/, /\btypedef\b/] },
]

// Which kinds of comment does the code really contain? (A // inside a string literal does not count.)
function commentKinds(code) {
  const kinds = new Set()
  let i = 0
  const n = code.length
  while (i < n) {
    const c = code[i], d = code[i + 1]
    if (c === '/' && d === '/') { kinds.add('line'); while (i < n && code[i] !== '\n') i++; continue }
    if (c === '/' && d === '*') { kinds.add('block'); i += 2; while (i < n && !(code[i] === '*' && code[i + 1] === '/')) i++; i += 2; continue }
    if (c === '"') { i++; while (i < n && code[i] !== '"' && code[i] !== '\n') { if (code[i] === '\\') i++; i++ } i++; continue }
    if (c === "'") { const m = /^'(?:\\.|[^\\'\n])'/.exec(code.slice(i, i + 6)); i += m ? m[0].length : 1; continue }
    i++
  }
  return kinds
}

const BY_ID = new Map(SYNTAX.map(s => [s.id, s]))
export const syntaxIds = () => new Set(SYNTAX.map(s => s.id))
export const syntaxLabel = id => BY_ID.get(id)?.label ?? id

// Replace string-literal contents with nothing and char literals with '~'. Returns { view, strings }.
function blank(code) {
  let view = '', i = 0
  const strings = []
  const n = code.length
  while (i < n) {
    const c = code[i]
    if (c === 'R' && code[i + 1] === '"' && !/[A-Za-z0-9_]/.test(code[i - 1] ?? '')) {
      const m = /^R"([^()\\\s]{0,16})\(/.exec(code.slice(i, i + 24))
      if (m) {
        const close = ')' + m[1] + '"', end = code.indexOf(close, i + m[0].length)
        strings.push(code.slice(i + m[0].length, end < 0 ? n : end)); view += '""'; i = end < 0 ? n : end + close.length; continue
      }
    }
    if (c === '"') {
      let j = i + 1
      while (j < n && code[j] !== '"' && code[j] !== '\n') { if (code[j] === '\\') j++; j++ }
      strings.push(code.slice(i + 1, j)); view += '""'; i = j + 1; continue
    }
    if (c === "'") {
      const m = /^'(?:\\(?:x[0-9a-fA-F]+|[0-7]{1,3}|.)|[^\\'\n])'/.exec(code.slice(i, i + 12))
      if (m) { view += "'~'"; i += m[0].length; continue }
    }
    view += c; i++
  }
  return { view, strings }
}

// Which registry ids does this learner-facing C++ code use? Returns Map(id -> first matched text).
// `span: true` is for a short <code>...</code> fragment from a task or hint: the whole text also counts as
// string content, so a bare \n is recognised as a newline escape.
export function detectSyntax(code, { span = false } = {}) {
  const found = new Map()
  const headers = []
  const bare = stripComments(code).replace(/^[ \t]*#[ \t]*include[ \t]*[<"]([^>"\n]*)[>"]/gm, (_, h) => { headers.push(h.trim()); return '#include' })
  const { view, strings } = blank(bare)
  const comments = commentKinds(code)
  const strText = span ? [...strings, code] : strings
  for (const s of SYNTAX) {
    let hit = null
    for (const h of s.headers ?? []) if (headers.includes(h)) { hit = `#include <${h}>`; break }
    if (!hit) for (const re of s.patterns ?? []) { const m = re.exec(view); if (m) { hit = m[0].trim() || m[0]; break } }
    if (!hit) for (const re of s.strings ?? []) { for (const t of strText) { const m = re.exec(t); if (m) { hit = m[0]; break } } if (hit) break }
    if (!hit && s.comment && comments.has(s.comment)) hit = s.comment === 'line' ? '//' : '/*'
    if (!hit) for (const re of s.raw ?? []) { const m = re.exec(code); if (m) { hit = m[0]; break } }
    if (hit) found.set(s.id, hit)
  }
  return found
}

const unescape = h => h.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
// Text of every <code>...</code> span in an HTML string.
export const codeSpans = html => [...String(html ?? '').matchAll(/<code>([\s\S]*?)<\/code>/g)].map(m => unescape(m[1].replace(/<[^>]+>/g, '')))
