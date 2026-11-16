import { useEffect, useState } from 'react'
import { ResultsBody } from '../workbench/Results'
import { ErrorCode, Rustc } from './RustcOutput'

const html = h => ({ __html: h })

// Shown while the Playground works. The three steps are an estimate of the usual pace, not live progress.
export function Wait({ what }) {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    const a = setTimeout(() => setStage(1), 700), b = setTimeout(() => setStage(2), 1700)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  return (
    <div className="wait">
      <span className="big"><span className="ms spin">progress_activity</span></span>
      <div><div className="t">{what} on the Rust Playground…</div><div className="s">Usually two to five seconds. Your code stays here.</div></div>
      <div className="steps">
        {['Sent', 'Compiling', 'Running'].map((l, i) => (
          <span key={l} className={i < stage ? 'done' : i === stage ? 'on' : ''}>{i < stage && <span className="ms">check</span>}{l}</span>
        ))}
      </div>
    </div>
  )
}

function Gloss({ lesson, code, onCpp }) {
  if (!lesson.gloss || !code || code !== lesson.errorCode) return null
  return (
    <div className="gloss">
      <span className="ms">info</span><span dangerouslySetInnerHTML={html(lesson.gloss)} />
      {lesson.inCpp && <button className="lk" onClick={onCpp} title="See the same code in C++"><span className="ms">compare_arrows</span>In C++</button>}
    </div>
  )
}

const Notice = ({ icon = 'info', bad, children }) => <div className={`notice${bad ? ' bad' : ''}`}><span className="ms">{icon}</span><span>{children}</span></div>

// Everything under the editor after a Run, Check or Compile, in the Rust track.
export default function RustResults({ res, lesson, sel, onSel, busy, onCpp }) {
  if (busy) return <Wait what={busy === 'run' ? 'Compiling and running' : 'Compiling and checking'} />
  if (!res) return null
  if (res.kind === 'forbidden') return <Notice icon="block">{res.msg}<small> {res.note}</small></Notice>
  if (res.kind === 'error') return <Notice icon="cloud_off" bad>{res.msg}<small> Not counted as a miss.</small></Notice>
  const c = res.compile
  if (res.kind === 'run') {
    if (c) return <><Notice icon="error" bad>Does not compile</Notice><Rustc text={c.text} /></>
    return (
      <>
        {res.panic && <Notice icon="error" bad>The program panicked</Notice>}
        <div className="out"><div className="lbl">Printed</div><pre>{res.text === '' ? '(nothing printed)' : res.text}</pre></div>
        {res.panic && <pre className="rerr cap">{res.panic}</pre>}
      </>
    )
  }
  // kind 'check'
  const chipExtra = c?.code && res.tests ? <ErrorCode code={c.code} /> : null
  return (
    <>
      {res.tests
        ? <ResultsBody res={{ ...res, chipExtra }} sel={sel} onSel={onSel} />
        : <Notice icon="error" bad>Does not compile<small> Not counted as a miss.</small></Notice>}
      {c && <><Gloss lesson={lesson} code={c.code} onCpp={onCpp} /><Rustc text={c.text} code={res.tests ? null : undefined} /></>}
      {!c && res.panic && <Notice icon="error" bad>The program panicked<small> Later tests were not run.</small></Notice>}
      {!c && res.unmet?.length > 0 && !res.win && <Notice icon="info" bad>{res.unmet.join(' ')}</Notice>}
    </>
  )
}
