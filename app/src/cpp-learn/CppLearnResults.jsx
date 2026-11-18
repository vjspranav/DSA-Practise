import { ResultsBody } from '../workbench/Results'
import { errorMatches } from './grade'
import { Clang } from './ClangOutput'

const html = h => ({ __html: h })

const Notice = ({ icon = 'info', bad, children }) => <div className={`notice${bad ? ' bad' : ''}`}><span className="ms">{icon}</span><span>{children}</span></div>

// Shown while the program compiles and runs. It happens in this browser, so there is no network wording.
function Wait({ what }) {
  return (
    <div className="wait">
      <span className="big"><span className="ms spin">progress_activity</span></span>
      <div><div className="t">{what}…</div><div className="s">Compiling in your browser. The first run can take a few seconds.</div></div>
    </div>
  )
}

// A fix lesson explains its first error in one plain sentence above clang's own words.
function Gloss({ lesson, text, onPy }) {
  if (!lesson.gloss || !errorMatches(lesson, text)) return null
  return (
    <div className="gloss">
      <span className="ms">info</span><span dangerouslySetInnerHTML={html(lesson.gloss)} />
      {lesson.inPython && <button className="lk" onClick={onPy} title="See the same idea in Python"><span className="ms">compare_arrows</span>In Python</button>}
    </div>
  )
}

// Everything under the editor after a Run or Check in the C++ Learn track.
export default function CppLearnResults({ res, lesson, sel, onSel, busy, onPy }) {
  if (busy) return <Wait what={busy === 'run' ? 'Compiling and running' : 'Compiling and checking'} />
  if (!res) return null
  if (res.kind === 'forbidden') return <Notice icon="block">{res.msg}<small> {res.note}</small></Notice>
  if (res.compile) {
    return (
      <>
        <Notice icon="error" bad>Does not compile<small> Not counted as a miss.</small></Notice>
        <Gloss lesson={lesson} text={res.compile.text} onPy={onPy} />
        <Clang text={res.compile.text} />
      </>
    )
  }
  if (res.kind === 'run') {
    return (
      <>
        {res.problem && <Notice icon="error" bad>{res.problem}</Notice>}
        <div className="out"><div className="lbl">Printed</div><pre>{res.raw === '' ? '(nothing printed)' : res.raw}</pre></div>
      </>
    )
  }
  return (
    <>
      <ResultsBody res={res} sel={sel} onSel={onSel} />
      {res.missing?.length > 0 && !res.win && <Notice icon="info" bad>{res.missing.join(' ')}</Notice>}
    </>
  )
}
