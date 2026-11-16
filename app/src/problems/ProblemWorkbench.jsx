import { useEffect, useRef, useState } from 'react'
import EditorCard from '../workbench/EditorCard'
import ReviewButton from '../workbench/ReviewButton'
import { buildReviewPrompt } from '../workbench/reviewPrompt'
import Onward from '../workbench/Onward'
import { ResultsBody } from '../workbench/Results'
import Description from './Description'
import { runProblem } from './runProblem'

const LANGS = [['cpp', 'C++'], ['python', 'Python']]
const LANG_NAME = { cpp: 'C++14', python: 'Python 3 (Pyodide)' }
const initUi = key => ({ key, res: null, sel: null, busy: null, custom: false })

// The Problems view: description card beside the editor card (Layout B). The card can be hidden to give the editor the full width.
export default function ProblemWorkbench({
  problem, language, onLanguage, code, onCode, theme, status, onStatus, onDone,
  progress, next, onNext, hidden, onToggleHidden,
}) {
  const key = `${problem.id}:${language}`
  const [ui, setUi] = useState(() => initUi(key))
  const u = ui.key === key ? ui : initUi(key)
  if (ui.key !== key) setUi(u)
  const [customText, setCustomText] = useState({})
  const custom = customText[problem.id] ?? problem.defaultCustomInput ?? ''

  const patch = (k, p) => setUi(s => (s.key === k ? { ...s, ...p } : s))
  const live = useRef({})
  useEffect(() => { live.current = { code, u, custom, submit: () => run('submit') } })

  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); live.current.submit?.() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function run(mode) {
    const cur = live.current.u
    if (cur.busy || cur.key !== key) return
    patch(key, { busy: mode, sel: null })
    const res = await runProblem({ problem, language, mode, code: live.current.code, customInput: live.current.custom })
    if (res.kind === 'check') {
      const bad = res.tests.findIndex(t => t.status !== 'ok' && t.status !== 'skipped')
      if (res.win) onDone(problem.id)
      patch(key, { busy: null, res, sel: bad >= 0 ? bad : null })
    } else {
      patch(key, { busy: null, res, sel: null })
    }
  }

  const res = u.res
  const showNext = !!res?.win || status === 'complete'
  const busy = u.busy ? ' busy' : ''

  return (
    <div className={`work b${hidden ? ' nodesc' : ''}`}>
      <section className="card descard" inert={hidden}>
        <div className="desc-in">
          <Description key={problem.id} problem={problem} status={status} onStatus={onStatus} onHide={onToggleHidden} />
        </div>
      </section>
      <div className="editor-col">
        <EditorCard
          busy={u.busy} language={LANG_NAME[language]}
          header={<>
            {hidden && (
              <>
                <button className="btn text" onClick={onToggleHidden} title="Show the description" aria-label="Show the description">
                  <span className="ms">left_panel_open</span><span className="lbl">Description</span>
                </button>
                <span className="ed-title" title={problem.title}>{problem.title}</span>
              </>
            )}
            <div className="lang" role="tablist" aria-label="Language">
              {LANGS.map(([l, name]) => (
                <button key={l} role="tab" aria-selected={language === l} className={language === l ? 'on' : ''} onClick={() => !u.busy && onLanguage(l)}>{name}</button>
              ))}
            </div>
            <span className="sp" />
            <button className={`btn text${u.custom ? ' sel' : ''}`} onClick={() => patch(key, { custom: !u.custom })} title="Custom input" aria-expanded={u.custom}>
              <span className="ms">edit_note</span><span className="lbl">Custom input</span>
            </button>
            <ReviewButton hasReference={false} build={preset => buildReviewPrompt({
              mode: 'problems', language, title: problem.title, statement: problem.description, constraints: problem.constraints,
              examples: problem.examples, kind: problem.difficulty, code, results: res, reference: null, preset,
            })} />
            <button className={`btn text${busy}`} onClick={() => run('run')} title="Run the first example"><span className="ms fill">play_arrow</span>Run</button>
            <button className={`btn fill${busy}`} onClick={() => run('submit')} title="Ctrl or Cmd + Enter">Submit<kbd>⌘↵</kbd></button>
          </>}
          editor={{ path: key, value: code, theme, language, onChange: onCode, onCheck: () => live.current.submit?.() }}
          below={
            <div className={`fold${u.custom ? ' open' : ''}`} inert={!u.custom}>
              <div>
                <div className="cin">
                  <div className="row">
                    <b>Custom input</b><span>{problem.inputFormat}</span><span className="sp" />
                    <button className={`btn tone${busy}`} onClick={() => run('custom')}><span className="ms fill">play_arrow</span>Run this input</button>
                  </div>
                  <textarea value={custom} spellCheck={false} aria-label="Custom input"
                    onChange={e => setCustomText(t => ({ ...t, [problem.id]: e.target.value }))} />
                </div>
              </div>
            </div>
          }
          results={res ? <ResultsBody res={res} sel={u.sel} onSel={i => patch(key, { sel: i })} /> : null}
          onward={showNext && (
            <Onward
              title={`${progress.done === progress.total ? `${progress.label} complete` : `${progress.done} of ${progress.total} done in ${progress.label}`}`}
              pct={progress.total ? progress.done / progress.total * 100 : 0}
              next={next?.title} onNext={() => onNext(next)} last="That was the last problem."
            />
          )}
        />
      </div>
    </div>
  )
}
