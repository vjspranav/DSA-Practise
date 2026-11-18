const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

// Colour the ^~~~ markers under a source line the way clang does.
const marks = rest => esc(rest).replace(/(\^[~]*)/g, '<span class="pr">$1</span>')

function line(l) {
  let m
  if ((m = l.match(/^(.*?:\d+:\d+:\s*)(fatal error|error|warning|note)(:)(.*)$/))) {
    const cls = m[2] === 'note' ? 'nt' : m[2] === 'warning' ? 'wr' : 'er'
    return `<span class="dm">${esc(m[1])}</span><span class="${cls}">${m[2]}</span><span class="em">${esc(m[3] + m[4])}</span>`
  }
  if (/^\d+ (errors?|warnings?)( and \d+ \w+)? generated/.test(l)) return `<span class="dm">${esc(l)}</span>`
  if ((m = l.match(/^(\s*\d*\s*\|)(.*)$/))) return `<span class="dm">${esc(m[1])}</span>${/\d/.test(m[1]) ? esc(m[2]) : marks(m[2])}`
  return esc(l)
}

// clang's text, exactly as printed: alignment kept, scrolls sideways. Styled with the same classes as rustc's.
export function Clang({ text, label = 'clang says', cap }) {
  const html = String(text || 'The compiler gave no message.').split('\n').map(line).join('\n')
  return (
    <div>
      <div className="rerr-h">{label}</div>
      <div className={`rerr${cap ? ' cap' : ''}`} tabIndex={0} role="region" aria-label="Compiler output" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
