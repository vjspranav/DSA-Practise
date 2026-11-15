import { useState } from 'react'
import ExampleViz from './ExampleViz'
import { DIFF, askedOf } from './meta'
import { CATEGORIES, vizComponents } from '../data/problems'

const html = h => ({ __html: h })

export function Tags({ problem }) {
  const [, who] = askedOf(problem)
  return (
    <div className="tags">
      <span className={`tag dif-${DIFF[problem.difficulty]}`}>{problem.difficulty}</span>
      <span className="tag">{CATEGORIES.find(c => c.id === problem.category)?.label ?? problem.category}</span>
      <span className="tag" title="Which interview list this came from"><span className="ms">person</span>Asked by {who}</span>
    </div>
  )
}

function Section({ title, sub, open, onToggle, children }) {
  return (
    <div className={`acc${open ? ' open' : ''}`}>
      <button onClick={onToggle} aria-expanded={open}>
        <span className="n">{title}</span><small>{sub}</small><span className="ms chev">expand_more</span>
      </button>
      <div className={`fold${open ? ' open' : ''}`} inert={!open}><div><div className="in">{children}</div></div></div>
    </div>
  )
}

function Examples({ problem }) {
  const Viz = vizComponents[problem.id]
  return (
    <>
      {problem.examples.map((ex, i) => (
        <div className="ex" key={i}>
          <span className="nm">Example {i + 1}</span>
          <div className="example"><div><span>Input</span><pre>{ex.input}</pre></div><div><span>Output</span><pre>{ex.output}</pre></div></div>
          {ex.explanation && <div className="why" dangerouslySetInnerHTML={html(ex.explanation)} />}
          {ex.visualization && <div className="pviz"><ExampleViz viz={ex.visualization} /></div>}
        </div>
      ))}
      {Viz && <div className="pviz">{Viz()}</div>}
    </>
  )
}

function Cases({ problem }) {
  const hidden = (problem.submitTestCount ?? problem.testCases.length) - problem.testCases.length
  return (
    <>
      <div className="cases">
        {problem.testCases.map((t, i) => (
          <div className="case" key={i}><span className="l">{t.label}</span><pre>{t.input}{'\n'}<b>expected {t.expected}</b></pre></div>
        ))}
      </div>
      {hidden > 0 && (
        <p className="note">
          Submit also runs {hidden} larger hidden test{hidden > 1 ? 's' : ''}{problem.submitTimeLimitMs ? ` with a ${problem.submitTimeLimitMs} ms time limit` : ''}.
        </p>
      )}
    </>
  )
}

function Hints({ hints, shown, onMore }) {
  return (
    <>
      <div className="hints">
        {hints.slice(0, shown).map((h, i) => <div className="hint" key={i}><b>{i + 1}</b><span dangerouslySetInnerHTML={html(h)} /></div>)}
      </div>
      {shown < hints.length
        ? <button className="btn tone hintmore" onClick={onMore}><span className="ms">lightbulb</span>Show hint {shown + 1} of {hints.length}</button>
        : <p className="note">That was the last hint.</p>}
    </>
  )
}

// Description card beside the editor: full statement, then collapsed Examples, Constraints, Test cases, Hints.
// Remount it per problem (key) so the sections start closed and hints start hidden.
export default function Description({ problem, status, onStatus, onHide }) {
  const [open, setOpen] = useState({})
  const [shown, setShown] = useState(0)
  const toggle = id => setOpen(o => ({ ...o, [id]: !o[id] }))
  const sec = (id, title, sub, body) => <Section title={title} sub={sub} open={!!open[id]} onToggle={() => toggle(id)}>{body}</Section>
  const viz = problem.examples.some(e => e.visualization) || vizComponents[problem.id]

  return (
    <>
      <div className="dh">
        <div className="dh-top">
          <h2>{problem.title}</h2>
          <button className="iconbtn" onClick={onHide} aria-label="Hide the description" title="Hide the description"><span className="ms">left_panel_close</span></button>
        </div>
        <Tags problem={problem} />
        <span className="stat">
          <button className={`btn${status === 'complete' ? ' on' : ''}`} onClick={() => onStatus(status === 'complete' ? null : 'complete')}>
            <span className="ms">check_circle</span>{status === 'complete' ? 'Done' : 'Mark done'}
          </button>
          <button className={`btn${status === 'revise' ? ' on' : ''}`} onClick={() => onStatus(status === 'revise' ? null : 'revise')}>
            <span className="ms">replay</span>{status === 'revise' ? 'To revise' : 'Revise'}
          </button>
        </span>
      </div>
      <div className="db">
        <div className="prose">{problem.description.map((d, i) => <p key={i} dangerouslySetInnerHTML={html(d)} />)}</div>
        {sec('ex', 'Examples', `${problem.examples.length}${viz ? ' · visualization' : ''}`, <Examples problem={problem} />)}
        {sec('cons', 'Constraints', String(problem.constraints.length), (
          <ul className="cons">{problem.constraints.map((c, i) => <li key={i}>{c}</li>)}</ul>
        ))}
        {sec('tests', 'Test cases', `${problem.testCases.length} visible`, <Cases problem={problem} />)}
        {sec('hints', 'Hints', `${problem.hints.length}, one at a time`, <Hints hints={problem.hints} shown={shown} onMore={() => setShown(n => n + 1)} />)}
      </div>
    </>
  )
}
