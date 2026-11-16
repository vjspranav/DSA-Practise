// Tiny C++ / Rust highlighter for the read-only answer and comparison panels. Returns an HTML string per line.
const KEYWORDS = new Set('int long short unsigned signed char double float void bool return while for do if else switch case break continue struct class const static auto new delete nullptr true false typedef template typename namespace using sizeof operator public private include define'.split(' '))
const TYPES = new Set('vector string map set multiset unordered_map unordered_set pair tuple stack queue deque priority_queue list array function size_t'.split(' '))
const RUST_KEYWORDS = new Set('as break const continue crate dyn else enum false fn for if impl in let loop match mod move mut pub ref return self Self static struct trait true type unsafe use where while'.split(' '))
const RUST_TYPES = new Set('i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str String Vec Option Result Box Rc RefCell HashMap HashSet BTreeMap BTreeSet BinaryHeap VecDeque Ordering Some None Ok Err'.split(' '))
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const RE_RUST = /(\/\/.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|b?'(?:\\.|[^'\\\n])')|(\b\w+!)|\b([A-Za-z_]\w*)\b/g
const RE = /(\/\/.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(#\s*\w+)|\b([A-Za-z_]\w*)\b/g

export function highlight(src, lang = 'cpp') {
  const rust = lang === 'rust', re = rust ? RE_RUST : RE
  let out = '', last = 0, m
  re.lastIndex = 0
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index))
    const [txt, com, str, pre, word] = m
    if (com) out += `<span class="c">${esc(txt)}</span>`
    else if (str) out += `<span class="s">${esc(txt)}</span>`
    else if (pre) out += `<span class="k">${esc(txt)}</span>`
    else if (word && (rust ? RUST_KEYWORDS : KEYWORDS).has(word)) out += `<span class="k">${word}</span>`
    else if (word && (rust ? RUST_TYPES : TYPES).has(word)) out += `<span class="t">${word}</span>`
    else out += esc(txt)
    last = m.index + txt.length
  }
  return out + esc(src.slice(last))
}

// Highlight a whole file, one entry per line (block comments are split per line).
export function highlightLines(src, lang = 'cpp') {
  return src.split('\n').map(line => highlight(line, lang))
}
