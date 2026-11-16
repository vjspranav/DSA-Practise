import { errorCodeOf } from './evaluate'

const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

// Colour the marker characters under source lines the way rustc does: ^ main, - secondary, + suggestion.
function marks(rest) {
  let out = '', last = 0, m
  const re = /(\^+|-+|\++)([^^\-+]*)/g
  while ((m = re.exec(rest))) {
    out += esc(rest.slice(last, m.index))
    out += `<span class="${m[1][0] === '^' ? 'pr' : m[1][0] === '-' ? 'sc' : 'ad'}">${esc(m[0])}</span>`
    last = re.lastIndex
  }
  return out + esc(rest.slice(last))
}

function line(l) {
  let m
  if (/^error: aborting/.test(l) || /^For more information/.test(l)) return `<span class="dm">${esc(l)}</span>`
  if ((m = l.match(/^(error(?:\[E\d+\])?)(:.*)$/))) return `<span class="er">${esc(m[1])}</span><span class="em">${esc(m[2])}</span>`
  if ((m = l.match(/^(warning)(:.*)$/))) return `<span class="wr">${esc(m[1])}</span><span class="em">${esc(m[2])}</span>`
  if ((m = l.match(/^(\s*)-->(.*)$/))) return `${m[1]}<span class="sc">--&gt;</span>${esc(m[2])}`
  if ((m = l.match(/^(note|help)(:.*)$/))) return `<span class="${m[1] === 'help' ? 'hp' : 'nt'}">${m[1]}</span>${esc(m[2])}`
  if ((m = l.match(/^(\s*\d*\s*\|)(.*)$/))) return `<span class="dm">${esc(m[1])}</span>${/\d/.test(m[1]) ? esc(m[2]) : marks(m[2])}`
  return esc(l)
}

// Link to the official long explanation of an error code.
export function ErrorCode({ code }) {
  if (!code) return null
  return (
    <a className="ecode" href={`https://doc.rust-lang.org/error_codes/${code}.html`} target="_blank" rel="noopener noreferrer" title={`Open the long explanation of ${code}`}>
      <span>{code}</span><span className="ms">open_in_new</span>
    </a>
  )
}

// rustc's text, exactly as printed: alignment kept, scrolls sideways, closing lines dimmed.
export function Rustc({ text, label = 'rustc says', cap, code }) {
  const html = text.split('\n').map(line).join('\n')
  return (
    <div>
      <div className="rerr-h">{label}{code !== null && <ErrorCode code={code ?? errorCodeOf(text)} />}</div>
      <div className={`rerr${cap ? ' cap' : ''}`} tabIndex={0} role="region" aria-label="Compiler output" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
