// Tiny C++ highlighter for the read-only answer panel. Returns an HTML string per line.
const KEYWORDS = new Set('int long short unsigned signed char double float void bool return while for do if else switch case break continue struct class const static auto new delete nullptr true false typedef template typename namespace using sizeof operator public private include define'.split(' '))
const TYPES = new Set('vector string map set multiset unordered_map unordered_set pair tuple stack queue deque priority_queue list array function size_t'.split(' '))
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const RE = /(\/\/.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(#\s*\w+)|\b([A-Za-z_]\w*)\b/g

export function highlight(src) {
  let out = '', last = 0, m
  RE.lastIndex = 0
  while ((m = RE.exec(src))) {
    out += esc(src.slice(last, m.index))
    const [txt, com, str, pre, word] = m
    if (com) out += `<span class="c">${esc(txt)}</span>`
    else if (str) out += `<span class="s">${esc(txt)}</span>`
    else if (pre) out += `<span class="k">${esc(txt)}</span>`
    else if (KEYWORDS.has(word)) out += `<span class="k">${word}</span>`
    else if (TYPES.has(word)) out += `<span class="t">${word}</span>`
    else out += esc(txt)
    last = m.index + txt.length
  }
  return out + esc(src.slice(last))
}

// Highlight a whole file, one entry per line (block comments are split per line).
export function highlightLines(src) {
  return src.split('\n').map(highlight)
}
