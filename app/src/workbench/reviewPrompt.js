// Builds the Markdown a learner pastes into Claude for a code review. Pure: no React, no DOM, no network.
// Each mode (Foundations, Rust, Problems) passes what it has; see the adapters in each workbench.

const MAX_VALUE = 300
const MAX_ERR_LINES = 60

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" }
const decode = s => s.replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? m)

// Lesson/problem HTML -> readable Markdown: inline code in backticks, <pre> fenced, lists as bullets.
export function htmlToMarkdown(html) {
  if (!html) return ''
  const blocks = []
  const keep = text => { blocks.push(text); return `\uE000${blocks.length - 1}\uE000` }
  let s = String(html).replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (m, inner) =>
    keep('\n\n```\n' + decode(inner.replace(/<[^>]+>/g, '')).replace(/^\n+|\s+$/g, '') + '\n```\n\n'))
  s = s
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (m, c) => keep('`' + decode(c.replace(/<[^>]+>/g, '')) + '`'))
    .replace(/<(b|strong)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(i|em)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|div|ul|ol|h\d)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
  s = decode(s).replace(/\uE000(\d+)\uE000/g, (m, i) => blocks[i])
  return s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

const clip = (v, n = MAX_VALUE) => {
  const s = String(v ?? '')
  return s.length > n ? s.slice(0, n) + `… (${s.length - n} more characters)` : s
}

// A value on one line if short, otherwise as an indented block.
function field(label, v) {
  if (v == null) return null
  const t = clip(v)
  return t.includes('\n') ? `  - ${label}:\n${t.split('\n').map(l => '    ' + l).join('\n')}` : `  - ${label}: \`${t === '' ? '(nothing)' : t}\``
}

function trimLines(text) {
  const lines = String(text ?? '').replace(/\s+$/, '').split('\n')
  return lines.length > MAX_ERR_LINES ? [...lines.slice(0, MAX_ERR_LINES), `… (${lines.length - MAX_ERR_LINES} more lines)`].join('\n') : lines.join('\n')
}

const fence = (code, tag = '') => {
  const ticks = '`'.repeat(Math.max(3, (String(code).match(/`{3,}/g) ?? []).reduce((m, x) => Math.max(m, x.length + 1), 3)))
  return `${ticks}${tag}\n${String(code).replace(/\s+$/, '')}\n${ticks}`
}

const STATUS = { ok: 'passed', fail: 'FAILED', error: 'ERROR', tle: 'TIME LIMIT EXCEEDED', skipped: 'not run' }

function testLines(res) {
  const out = []
  const tests = res.kind === 'run' ? [{ ...res.test, name: res.test?.name ?? 'Example' }] : res.tests ?? []
  const nonStatic = tests.filter(t => !t.static)
  tests.forEach((t, i) => {
    const name = t.name ?? t.label ?? `Test ${i + 1}`
    if (t.static) { out.push(`- ${name}: ${t.status === 'ok' ? 'passed' : t.status === 'skipped' ? 'not run' : 'FAILED'}`); return }
    out.push(`- ${name}: ${STATUS[t.status] ?? t.status}`)
    if (t.status === 'ok' || t.status === 'skipped') return
    for (const f of [field('input', t.input), field('expected', t.expected), t.status === 'error' ? field('error', t.message) : field('got', t.got), t.note ? field('note', t.note) : null, t.printed ? field('printed', t.printed) : null]) if (f) out.push(f)
  })
  if (!nonStatic.length && !tests.length) out.push('- (no test details)')
  return out
}

function lastRun(res) {
  if (!res) return 'Not run yet.'
  const mode = res.kind === 'check' ? 'Check/Submit (all tests)' : res.kind === 'run' ? 'Run (first example only)' : res.kind === 'custom' ? 'Run on custom input (not graded)' : null
  const head = mode ? `${mode}${res.win ? ': all passed.' : '.'}` : ''
  switch (res.kind) {
    case 'forbidden': return `Not run: ${res.msg}`
    case 'error': return `Not run: ${res.msg}`
    case 'custom': return `${head}\n\nOutput:\n${fence(clip(res.raw, 2000))}`
    default: break
  }
  if (res.kind === 'compile') return `${res.title ?? 'Compiler error'}:\n\n${fence(trimLines(res.text))}`
  const parts = [head]
  if (res.compile) parts.push(`Does not compile${res.compile.code ? ` (${res.compile.code})` : ''}:\n\n${fence(trimLines(res.compile.text))}`)
  else {
    if (res.tests || res.test) parts.push(testLines(res).join('\n'))
    if (res.kind === 'run' && (res.text != null || res.raw != null)) parts.push(`Printed:\n${fence(clip(res.text ?? res.raw, 2000))}`)
    if (res.panic) parts.push(`Panic / runtime error:\n\n${fence(trimLines(res.panic))}`)
    if (res.unmet?.length) parts.push('Unmet requirements: ' + res.unmet.join(' '))
  }
  return parts.filter(Boolean).join('\n\n')
}

const ASK = {
  better: lang => `Review this like a senior ${lang} engineer mentoring me: correctness and edge cases, time/space complexity, idiomatic use of ${lang === 'Rust' ? 'Rust idioms' : `the ${lang === 'Python' ? 'standard library' : 'STL'}`}, readability. Give the top 3 things I could do better, each with a short snippet. Don't rewrite my whole solution.`,
  'why-fail': () => 'Explain why this fails, using the run output. Guide me to the fix with hints first; show the fix only at the end, clearly marked.',
  compare: () => 'Compare my approach with the reference: what each does differently, trade-offs, and what I should take from the reference.',
}

export const PRESETS = [
  { id: 'better', label: 'What can I do better?' },
  { id: 'why-fail', label: 'Why does this fail?' },
  { id: 'compare', label: 'Compare with the answer', needsReference: true },
]

const LANG = { cpp: 'C++', rust: 'Rust', python: 'Python' }
const TAG = { cpp: 'cpp', rust: 'rust', python: 'python' }
const MODE = { foundations: 'Foundations (lessons)', rust: 'Rust track (lessons)', problems: 'Problems' }

// language: 'cpp' | 'rust' | 'python'. statement: HTML string (or array of HTML strings); constraints: string[].
// reference: the solution text, or null/undefined when it is still locked (then nothing about it appears).
export function buildReviewPrompt({ mode, language, title, statement, constraints, examples, kind, code, results, reference, preset = 'better' }) {
  const lang = LANG[language] ?? language
  const hasRef = !!reference
  const use = preset === 'compare' && !hasRef ? 'better' : preset
  const who = language === 'rust'
    ? "I'm a C++ developer learning Rust"
    : 'I\'m relearning C++ and data structures & algorithms'
  const out = []
  out.push(`I'm practising in a local app. ${who}. Mode: ${MODE[mode] ?? mode}. Language: ${lang}. ${mode === 'problems' ? 'Problem' : 'Lesson'}: ${title}${kind ? ` (${kind})` : ''}.`)
  const stmt = (Array.isArray(statement) ? statement : [statement]).map(htmlToMarkdown).filter(Boolean).join('\n\n')
  out.push(`## The task\n\n${stmt || '(no description)'}`)
  if (examples?.length) {
    out.push('Examples:\n' + examples.map((e, i) => `${i + 1}. input: \`${clip(e.input)}\` → output: \`${clip(e.output)}\`${e.explanation ? ` (${htmlToMarkdown(e.explanation)})` : ''}`).join('\n'))
  }
  if (constraints?.length) out.push('Constraints:\n' + constraints.map(c => `- ${c}`).join('\n'))
  out.push(`## My code\n\n${fence(code ?? '', TAG[language] ?? '')}`)
  out.push(`## Last run\n\n${lastRun(results)}`)
  if (hasRef) out.push(`## Reference solution\n\n${fence(reference, TAG[language] ?? '')}`)
  out.push(`## What I'd like\n\n${ASK[use](lang)}`)
  return out.join('\n\n') + '\n'
}

// Clipboard write with a textarea fallback (insecure origins, older browsers). Resolves true on success.
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch { /* fall through */ }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch { return false }
}
