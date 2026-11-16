import { highlightLines } from './highlight'

const html = h => ({ __html: h })

// Read-only highlighted code with line numbers (`numbered={false}` leaves the number column empty).
export function CodeBlock({ code, lang = 'cpp', numbered = true }) {
  return (
    <div className="codeview">
      {highlightLines(code, lang).map((h, i) => (
        <div className="ln" key={i}><span>{numbered ? i + 1 : ''}</span><span dangerouslySetInnerHTML={html(h)} /></div>
      ))}
    </div>
  )
}

// Content of the side panel: refresher, hints (one at a time) or answer.
export default function HelpPanel({ lang = 'cpp', tab, lesson, hintsShown, lastHint, onMoreHint, unlocked, passed, tries }) {
  if (tab === 'refresher') {
    return (
      <>
        {lesson.example && (
          <div className="example">
            <div><span>Input</span><pre>{lesson.example.input}</pre></div>
            <div><span>Output</span><pre>{lesson.example.output}</pre></div>
          </div>
        )}
        <ul className="refresher">
          {(lesson.refresher ?? []).map((r, i) => <li key={i}><span dangerouslySetInnerHTML={html(r)} /></li>)}
        </ul>
      </>
    )
  }
  if (tab === 'hints') {
    const hints = lesson.hints ?? []
    return (
      <div className="hints">
        {hints.slice(0, hintsShown).map((h, i) => (
          <div className={`hint${i === lastHint && i ? ' fresh' : ''}`} key={i}>
            <b>{i + 1}</b><span dangerouslySetInnerHTML={html(h)} />
          </div>
        ))}
        {hintsShown < hints.length && (
          <button className="btn text" onClick={onMoreHint} style={{ justifySelf: 'start' }}>
            <span className="ms">lightbulb</span>Show another hint
          </button>
        )}
      </div>
    )
  }
  if (!unlocked) {
    return (
      <div className="lockrow">
        <span className="ms">lock</span><span>Opens when you pass, or after three misses.</span>
        <span className="tries">{[0, 1, 2].map(i => <i key={i} className={i < tries ? 'used' : ''} />)}</span>
      </div>
    )
  }
  return (
    <div className="answer">
      <div className="answer-h"><span className="ms">lock_open</span>{passed ? 'Unlocked. Compare it with yours.' : 'Unlocked after three misses.'}</div>
      <CodeBlock code={lesson.solution ?? ''} lang={lang} />
    </div>
  )
}
