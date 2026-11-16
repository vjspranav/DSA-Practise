// Registry of Rust syntax a beginner meets across the whole track. Lessons list the ids they teach in `introduces`;
// scripts/verify-rust.mjs fails a lesson whose learner-facing code uses an id before some lesson taught it.
// Pure JS, no browser imports (the checker loads it in Node).
//
// Each entry: { id, label, patterns, strings?, raw? }
//   patterns: RegExps run on the code with comments removed and string/char literal contents blanked
//             (a string becomes "" and a char becomes '~', so nothing inside a literal can match).
//   strings:  RegExps run on the CONTENTS of string literals (format placeholders live there), and, for a
//             <code> span from a task or hint, on the whole span text.
//   raw:      RegExps run on the untouched source (comments are detected here).
// Add ids as later stages need them; patterns only need to be good enough to catch honest mistakes.
import { stripComments } from './grade.js'

export const SYNTAX = [
  // ---- program shape and printing ----
  { id: 'fn-main', label: 'fn main', patterns: [/\bfn\s+main\b/] },
  { id: 'println', label: 'println!', patterns: [/\bprintln!/] },
  { id: 'print-macro', label: 'print!', patterns: [/\bprint!/] },
  { id: 'string-literal', label: 'string literal "..."', patterns: [/"/] },
  { id: 'semicolon', label: ';', patterns: [/;/] },
  { id: 'comment', label: '// comment', patterns: [], raw: [/\/\/|\/\*/] },
  { id: 'placeholder-display', label: '{} placeholder', patterns: [], strings: [/\{\}/] },
  { id: 'placeholder-debug', label: '{:?} placeholder', patterns: [], strings: [/\{(?:\w+)?:\?\}/] },
  { id: 'placeholder-pretty', label: '{:#?} placeholder', patterns: [], strings: [/\{(?:\w+)?:#\?\}/] },
  { id: 'placeholder-inline', label: '{name} placeholder', patterns: [], strings: [/\{[A-Za-z_]\w*\}/] },
  { id: 'placeholder-positional', label: '{0} placeholder', patterns: [], strings: [/\{\d+\}/] },
  { id: 'placeholder-format', label: '{:>5} / {:.2} format spec', patterns: [], strings: [/\{\w*:[^{}?#]*[<>^.\d+][^{}]*\}/] },
  { id: 'brace-escape', label: '{{ }} literal braces', patterns: [], strings: [/\{\{|\}\}/] },
  { id: 'panic-macro', label: 'panic!', patterns: [/\bpanic!/] },
  { id: 'assert-macro', label: 'assert!', patterns: [/\b(?:debug_)?assert(?:_eq|_ne)?!/] },
  { id: 'write-macro', label: 'write! / writeln!', patterns: [/\b(?:write|writeln)!/] },
  { id: 'other-macro', label: 'unreachable!/todo!/matches!', patterns: [/\b(?:unreachable|todo|unimplemented|matches|eprintln|eprint)!/] },

  // ---- bindings and types ----
  { id: 'let', label: 'let', patterns: [/\blet\b/] },
  { id: 'mut', label: 'mut', patterns: [/\bmut\b/] },
  { id: 'type-annotation', label: 'let x: T', patterns: [/\blet\s+(?:mut\s+)?\w+\s*:/] },
  { id: 'int-types', label: 'integer types (i32, u8, usize ...)', patterns: [/\b[iu](?:8|16|32|64|128|size)\b/] },
  { id: 'int-limits', label: 'T::MAX / T::MIN', patterns: [/\b[iuf]\w+::(?:MAX|MIN)\b/] },
  { id: 'float', label: 'f64 / f32 / 1.5', patterns: [/\bf(?:32|64)\b/, /\b\d+\.\d+\b/] },
  { id: 'bool', label: 'bool, true, false', patterns: [/\b(?:bool|true|false)\b/] },
  { id: 'char', label: "char and 'c'", patterns: [/\bchar\b/, /'~'/] },
  { id: 'as-cast', label: 'as', patterns: [/\bas\s+[a-z]\w*/] },
  { id: 'literal-suffix', label: '5u8 / 1_i32', patterns: [/\d_?[iuf](?:8|16|32|64|128|size)\b/] },
  { id: 'numeric-separator', label: '1_000', patterns: [/\d_\d/] },
  { id: 'path-sep', label: '::', patterns: [/\w::\w/] },
  { id: 'turbofish', label: '::<T>', patterns: [/::</] },
  { id: 'const', label: 'const', patterns: [/\bconst\b/] },
  { id: 'static', label: 'static', patterns: [/\bstatic\b/] },
  { id: 'use', label: 'use', patterns: [/\buse\s/] },
  { id: 'mod', label: 'mod', patterns: [/\bmod\b/] },
  { id: 'pub', label: 'pub', patterns: [/\bpub\b/] },
  { id: 'type-alias', label: 'type X = ...', patterns: [/\btype\s+\w+\s*=/] },

  // ---- operators ----
  { id: 'arithmetic', label: '+ - * / %', patterns: [/[\w)\]]\s*[-+*/%]\s*[\w(]/] },
  { id: 'compound-assign', label: '+= -= *= ...', patterns: [/[-+*/%]=(?!=)/] },
  { id: 'comparison', label: '== != < > <= >=', patterns: [/==|!=|(?:^|\s)[<>]=?(?:\s|$)/] },
  { id: 'logical-ops', label: '&& ||', patterns: [/&&|\|\|/] },
  { id: 'not-op', label: '! (not)', patterns: [/(?<![\w)\]'"])!(?!=)\s*[\w(]/] },
  { id: 'deref', label: '*x (dereference)', patterns: [/(?:^|[=(,{;]|\s)\*(?=[A-Za-z_(])/] },

  // ---- control flow ----
  { id: 'if-else', label: 'if / else', patterns: [/\bif\b/, /\belse\b/] },
  { id: 'if-expression', label: 'let x = if ...', patterns: [/(?:=|=>|return)\s*if\b/] },
  { id: 'while', label: 'while', patterns: [/\bwhile\b/] },
  { id: 'loop', label: 'loop', patterns: [/\bloop\b/] },
  { id: 'for-in', label: 'for x in ...', patterns: [/\bfor\s+[\w(_,\s&]+?\s+in\b/] },
  { id: 'range', label: 'a..b', patterns: [/\.\./] },
  { id: 'range-inclusive', label: 'a..=b', patterns: [/\.\.=/] },
  { id: 'break', label: 'break / continue', patterns: [/\bbreak\b/, /\bcontinue\b/] },
  { id: 'break-value', label: 'break value', patterns: [/\bbreak\s+(?!')[\w([-]/] },
  { id: 'labelled-break', label: "'label: and break 'label", patterns: [/'\w+\s*:\s*(?:for|while|loop)\b/, /\b(?:break|continue)\s+'\w/] },
  { id: 'if-let', label: 'if let / while let', patterns: [/\b(?:if|while)\s+let\b/] },
  { id: 'match', label: 'match', patterns: [/\bmatch\b/] },
  { id: 'match-arrow', label: '=>', patterns: [/=>/] },
  { id: 'wildcard', label: '_', patterns: [/(?<![\w])_(?![\w])/] },
  { id: 'or-pattern', label: 'a | b pattern', patterns: [/[\w'")\]]\s*\|(?!\|)\s*[\w'"([]/] },
  { id: 'match-guard', label: 'x if cond =>', patterns: [/\w\s+if\s+[^{\n]*=>/] },
  { id: 'at-binding', label: 'x @ pattern', patterns: [/\w\s*@\s*[\w([]/] },

  // ---- functions ----
  { id: 'fn-def', label: 'fn name', patterns: [/\bfn\s+(?!main\b)\w+/] },
  { id: 'fn-params', label: 'fn f(a: T)', patterns: [/\bfn\s+\w+\s*(?:<[^>]*>)?\(\s*(?:mut\s+)?\w+\s*:/] },
  { id: 'return-type', label: '-> T', patterns: [/\)\s*->\s*\S/] },
  { id: 'return', label: 'return', patterns: [/\breturn\b/] },
  { id: 'closure', label: '|x| closure', patterns: [/(?:[(=,]|\bmove)\s*\|[^|\n]*\|/, /(?:[(=,]|\bmove)\s*\|\|/] },
  { id: 'method-call', label: 'x.method()', patterns: [/[\w)\]]\.[a-z_]\w*\s*\(/] },

  // ---- data ----
  { id: 'tuple', label: '(a, b) tuple', patterns: [/(?<![\w!])\(\s*[^()\n]*,[^()\n]*\)/] },
  { id: 'tuple-field', label: 'p.0', patterns: [/[A-Za-z_)\]]\.\d+\b/] },
  { id: 'unit-type', label: '() unit', patterns: [/(?<![\w!>])\(\s*\)/] },
  { id: 'destructure', label: 'let (a, b) = ...', patterns: [/\blet\s+(?:mut\s+)?[([]/, /\bfor\s+\(/] },
  { id: 'tuple-assign', label: '(a, b) = (b, a + b)', patterns: [/(?:^|[;{}])\s*\(\s*\w+(?:\s*,\s*\w+)+\s*\)\s*=(?![=>])/] },
  { id: 'array', label: '[1, 2, 3] / [T; N]', patterns: [/(?<![!\w\])])\[[^\]\n]*[,;][^\]\n]*\]/, /=\s*\[/] },
  { id: 'indexing', label: 'a[i]', patterns: [/[\w)\]]\[(?![^\]\n]*\.\.)[^\]\n]*\]/] },
  { id: 'slice-range', label: 'v[a..b]', patterns: [/[\w)\]]\[[^\]\n]*\.\.[^\]\n]*\]/] },
  { id: 'slice-ref', label: '&[T]', patterns: [/&\s*(?:mut\s+)?\[/] },
  { id: 'len', label: '.len()', patterns: [/\.len\s*\(\s*\)/] },
  { id: 'is-empty', label: '.is_empty()', patterns: [/\.is_empty\s*\(/] },
  { id: 'vec', label: 'Vec / vec!', patterns: [/\bVec\b/, /\bvec!/] },
  { id: 'push', label: '.push()', patterns: [/\.push\s*\(/] },
  { id: 'pop', label: '.pop()', patterns: [/\.pop\s*\(/] },
  { id: 'int-methods', label: 'wrapping_/saturating_/checked_', patterns: [/\.(?:wrapping|saturating|checked|overflowing)_\w+\s*\(/] },
  { id: 'num-methods', label: '.pow() .abs() ...', patterns: [/\.(?:pow|abs|signum|rem_euclid|sqrt|powi|powf|floor|ceil|round|abs_diff|is_positive|is_negative)\s*\(/] },
  { id: 'min-max', label: '.min() .max()', patterns: [/\.(?:min|max|clamp)\s*\(/] },
  { id: 'get', label: '.get()', patterns: [/\.get(?:_mut)?\s*\(/] },
  { id: 'collection-methods', label: '.insert .remove .contains .sort ...', patterns: [/\.(?:insert|contains|contains_key|extend|truncate|clear|reverse|dedup|retain|drain|first|last|split_at|join|concat|sort\w*|binary_search\w*|resize|entry|or_insert\w*|append|front|back|push_back|push_front|pop_back|pop_front)\s*\(/] },
  { id: 'vec-bulk', label: 'Vec::with_capacity / extend_from_slice / copy_from_slice / to_vec', patterns: [/\bVec::with_capacity\b/, /\.(?:extend_from_slice|copy_from_slice|clone_from_slice|to_vec)\s*\(/] },
  { id: 'hashmap', label: 'HashMap / HashSet', patterns: [/\bHash(?:Map|Set)\b/] },
  { id: 'btree', label: 'BTreeMap / BTreeSet', patterns: [/\bBTree(?:Map|Set)\b/] },
  { id: 'vecdeque', label: 'VecDeque', patterns: [/\bVecDeque\b/] },
  { id: 'binaryheap', label: 'BinaryHeap / Reverse', patterns: [/\bBinaryHeap\b/, /\bReverse\b/] },

  // ---- strings ----
  { id: 'string-type', label: 'String', patterns: [/\bString\b/] },
  { id: 'str-type', label: '&str', patterns: [/&\s*(?:'\w+\s+)?str\b/, /\bstr\b/] },
  { id: 'string-from', label: 'String::from / String::new', patterns: [/\bString::(?:from|new|with_capacity)\b/] },
  { id: 'format-macro', label: 'format!', patterns: [/\bformat!/] },
  { id: 'push-str', label: '.push_str()', patterns: [/\.push_str\s*\(/] },
  { id: 'to-string', label: '.to_string()', patterns: [/\.to_string\s*\(/, /\.to_owned\s*\(/] },
  { id: 'chars-bytes', label: '.chars() .bytes() .as_bytes()', patterns: [/\.(?:chars|bytes|as_bytes|char_indices)\s*\(/] },
  { id: 'count-method', label: '.count()', patterns: [/\.count\s*\(/] },
  { id: 'string-methods', label: '.trim() .split() .parse() ...', patterns: [/\.(?:trim\w*|split(?!_at)\w*|parse|to_uppercase|to_lowercase|starts_with|ends_with|lines|repeat|replace|as_str|into_bytes)\s*\(/] },
  { id: 'byte-literal', label: "b'a'", patterns: [/\bb'~'/, /\bb"/] },

  // ---- ownership and references ----
  { id: 'reference', label: '&x', patterns: [/(?:^|[=(,:\s{|])&(?!&|\s)(?!mut\b|str\b|\[)/] },
  { id: 'ref-mut', label: '&mut', patterns: [/&\s*mut\b/] },
  { id: 'clone', label: '.clone()', patterns: [/\.clone\s*\(/] },
  { id: 'lifetime', label: "'a lifetime", patterns: [/&'\w+/, /<'\w+/, /'static\b/] },
  { id: 'slice-swap', label: '.swap() / .split_at_mut()', patterns: [/\.(?:swap|split_at_mut|split_at)\s*\(/] },
  { id: 'vec-remove', label: '.remove() / .swap_remove()', patterns: [/\.(?:swap_remove|remove)\s*\(/] },
  { id: 'box', label: 'Box', patterns: [/\bBox\b/] },
  { id: 'rc', label: 'Rc / Arc', patterns: [/\b(?:Rc|Arc|Weak)\b/] },
  { id: 'refcell', label: 'RefCell / Cell', patterns: [/\b(?:RefCell|Cell)\b/] },
  { id: 'drop', label: 'drop()', patterns: [/\bdrop\s*\(/, /\bimpl\s+Drop\b/] },
  { id: 'mem-fns', label: 'std::mem::swap/take/replace', patterns: [/\bmem::\w+/] },
  { id: 'unsafe', label: 'unsafe', patterns: [/\bunsafe\b/] },

  // ---- user types, traits, generics ----
  { id: 'struct', label: 'struct', patterns: [/\bstruct\b/] },
  { id: 'impl', label: 'impl', patterns: [/\bimpl\b/] },
  { id: 'self', label: 'self / Self', patterns: [/\bself\b/, /\bSelf\b/] },
  { id: 'enum', label: 'enum', patterns: [/\benum\b/] },
  { id: 'derive', label: '#[derive(...)]', patterns: [/#\[\s*derive/] },
  { id: 'attribute', label: '#[...]', patterns: [/#!?\[/] },
  { id: 'trait', label: 'trait', patterns: [/\btrait\b/] },
  { id: 'dyn', label: 'dyn', patterns: [/\bdyn\b/] },
  { id: 'trait-impl', label: 'impl Trait for Type', patterns: [/\bimpl\s+(?:<[^>]*>\s*)?[A-Za-z_][\w:]*(?:<[^>]*>)?\s+for\b/] },
  { id: 'impl-trait', label: 'impl Trait (argument or return type)', patterns: [/(?::|->|&|<)\s*(?:mut\s+)?impl\s+[A-Z]/] },
  { id: 'generic-args', label: 'Type<Arg>', patterns: [/\b[A-Z]\w*<[^<>\n]*>/] },
  { id: 'generic-params', label: 'fn f<T>', patterns: [/\b(?:fn|struct|enum|impl|trait)\s*\w*\s*<\s*(?:'\w+\s*,\s*)?[A-Z]\w*/] },
  { id: 'where', label: 'where', patterns: [/\bwhere\b/] },
  { id: 'option', label: 'Option / Some / None', patterns: [/\b(?:Option|Some|None)\b/] },
  { id: 'result', label: 'Result / Ok / Err', patterns: [/\b(?:Result|Ok|Err)\b/] },
  { id: 'question-mark', label: '?', patterns: [/[\w)\]]\?(?!\w)/] },
  { id: 'unwrap', label: '.unwrap() / .expect()', patterns: [/\.(?:unwrap|expect)\s*\(/] },
  { id: 'unwrap-or', label: '.unwrap_or() / .unwrap_or_else()', patterns: [/\.unwrap_or\w*\s*\(/] },
  { id: 'option-methods', label: '.is_some() .ok_or() .map_err() ...', patterns: [/\.(?:is_some|is_none|is_ok|is_err|ok_or|ok_or_else|map_err|and_then|ok|as_ref|as_mut)\s*\(/] },
  { id: 'map-method', label: '.map()', patterns: [/\.map\s*\(/] },
  { id: 'option-take', label: '.take() on an Option', patterns: [/\.take\s*\(\s*\)/] },
  { id: 'option-get-or-insert', label: '.get_or_insert_with()', patterns: [/\.get_or_insert_with\s*\(/] },
  { id: 'let-else', label: 'let Some(x) = ... else { }', patterns: [/\blet\s+(?:Some|Ok|Err|[A-Z]\w*)\s*[({][^=;]*[)}]\s*=[^;]*?\belse\s*\{/] },
  { id: 'iter', label: '.iter() / .into_iter()', patterns: [/\.(?:iter|iter_mut|into_iter)\s*\(\s*\)/] },
  { id: 'iter-adapters', label: '.map .filter .enumerate .zip .rev ...', patterns: [/\.(?:filter|enumerate|zip|rev|take(?!\s*\(\s*\))|skip|step_by|chain|windows|chunks|flat_map|filter_map|take_while|skip_while|peekable|cloned|copied|scan|inspect)\s*\(/] },
  { id: 'collect', label: '.collect()', patterns: [/\.collect\s*\(/] },
  { id: 'iter-consumers', label: '.sum .fold .any .position ...', patterns: [/\.(?:sum|product|fold|any|all|find|position|nth|for_each|min_by_key|max_by_key|min_by|max_by)\s*\(/] },
  { id: 'cmp-ordering', label: 'Ordering / cmp', patterns: [/\bOrdering\b/, /\.(?:cmp|partial_cmp|total_cmp)\s*\(/] },
  { id: 'ordering-chain', label: 'a.cmp(&b).then(...)', patterns: [/\.then(?:_with)?\s*\(/] },
  { id: 'test-attr', label: '#[test]', patterns: [/#\[\s*test\s*\]/, /#\[\s*cfg\s*\(\s*test/] },
]

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
    if (c === 'r' && (code[i + 1] === '"' || code[i + 1] === '#') && !/[A-Za-z0-9_]/.test(code[i - 1] ?? '')) {
      const m = /^r(#*)"/.exec(code.slice(i, i + 40))
      if (m) {
        const close = '"' + m[1], end = code.indexOf(close, i + m[0].length)
        const stop = end < 0 ? n : end
        strings.push(code.slice(i + m[0].length, stop)); view += '""'; i = end < 0 ? n : end + close.length; continue
      }
    }
    if (c === '"') {
      let j = i + 1
      while (j < n && code[j] !== '"') { if (code[j] === '\\') j++; j++ }
      strings.push(code.slice(i + 1, j)); view += '""'; i = j + 1; continue
    }
    if (c === "'") {
      const m = /^'(?:\\(?:x[0-9a-fA-F]{2}|u\{[0-9a-fA-F_]+\}|.)|[^\\'])'/.exec(code.slice(i, i + 14))
      if (m) { view += "'~'"; i += m[0].length; continue }
    }
    view += c; i++
  }
  return { view, strings }
}

// Which registry ids does this learner-facing Rust code use? Returns Map(id -> first matched text).
// `span: true` is for a short <code>...</code> fragment from a task or hint: the whole text also counts as
// string content, so a bare {} or {:?} is recognised as a placeholder.
export function detectSyntax(code, { span = false } = {}) {
  const found = new Map()
  const { view, strings } = blank(stripComments(code))
  const strText = span ? [...strings, code] : strings
  for (const s of SYNTAX) {
    let hit = null
    for (const re of s.patterns ?? []) { const m = re.exec(view); if (m) { hit = m[0].trim() || m[0]; break } }
    if (!hit) for (const re of s.strings ?? []) { for (const t of strText) { const m = re.exec(t); if (m) { hit = m[0]; break } } if (hit) break }
    if (!hit) for (const re of s.raw ?? []) { const m = re.exec(code); if (m) { hit = m[0]; break } }
    if (hit) found.set(s.id, hit)
  }
  return found
}

const unescape = h => h.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
// Text of every <code>...</code> span in an HTML string.
export const codeSpans = html => [...String(html ?? '').matchAll(/<code>([\s\S]*?)<\/code>/g)].map(m => unescape(m[1].replace(/<[^>]+>/g, '')))
