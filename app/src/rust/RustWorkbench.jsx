import { useEffect, useRef, useState } from 'react'
import EditorCard from '../workbench/EditorCard'
import ReviewButton from '../workbench/ReviewButton'
import { buildReviewPrompt } from '../workbench/reviewPrompt'
import Onward from '../workbench/Onward'
import { Rail, SidePanel } from '../workbench/SidePanel'
import { CodeBlock } from '../foundations/HelpPanel'
import { vt } from '../workbench/motion'
import { useHelpTabs, useLessonUi } from '../workbench/useHelp'
import ConceptCard from './ConceptCard'
import { Choices, Reveal } from './PredictPanel'
import RustHelp from './RustHelp'
import RustResults from './RustResults'
import { assembleSource, forbiddenHit } from './grade'
import { gradeReply, runOutput } from './evaluate'
import { PlaygroundError, run as playground } from './playground'
import { STAGES } from './lessons'

const KIND = {
  concept: ['school', 'Concept'], predict: ['quiz', 'Predict'], fix: ['build', 'Make it compile'],
  implement: ['code', 'Write the function'], drill: ['bolt', 'Quick drill'], bugfix: ['bug_report', 'Find the bug'],
}

function tabsFor(lesson) {
  const tabs = [['refresher', 'menu_book', 'Refresher']]
  if (lesson.inCpp) tabs.push(['cpp', 'compare_arrows', 'In C++'])
  if (lesson.kind !== 'predict') tabs.push(['hints', 'lightbulb', 'Hints'], ['answer', 'lock', 'Answer'])
  return tabs
}

const TITLES = { refresher: 'Refresher', cpp: 'In C++', hints: 'Hints', answer: 'Answer' }

// Collapsing a taught lesson's explanation is remembered per lesson, but only once the learner has passed it.
const FOLD_KEY = 'rust-teach-folded'
const readFolded = () => { try { return JSON.parse(localStorage.getItem(FOLD_KEY) ?? '[]') } catch { return [] } }
const codeHeight = lines => `clamp(300px, ${lines * 24 + 112}px, 62vh)`

export default function RustWorkbench({ lesson, next, redoMode, rec, theme, store, onPick, onPassed }) {
  const key = `${lesson.id}:${redoMode ? 'redo' : 'main'}`
  const predict = lesson.kind === 'predict'
  const [u, patch] = useLessonUi(key, { ideaOpen: true, round: 0, pick: null, revealed: false })
  const { toggleTab, showTab, moreHint } = useHelpTabs(key, u, patch)

  const [folded, setFolded] = useState(readFolded)
  const taught = !!lesson.teach
  const passedOnce = !!rec.passedAt
  // Before a pass the fold lasts for this visit only; after a pass it is remembered.
  const remember = taught && passedOnce
  const ideaOpen = remember ? !folded.includes(lesson.id) : u.ideaOpen
  function toggleIdea() {
    if (!remember) { patch(key, { ideaOpen: !u.ideaOpen }); return }
    const next = ideaOpen ? [...folded, lesson.id] : folded.filter(id => id !== lesson.id)
    setFolded(next)
    try { localStorage.setItem(FOLD_KEY, JSON.stringify(next)) } catch { /* storage blocked: stays for this visit */ }
  }

  const starter = lesson.starter ?? ''
  const code = redoMode ? (rec.redoCode ?? starter) : (rec.code ?? starter)
  const tries = redoMode ? rec.redoMisses : rec.misses
  const passed = redoMode ? rec.redoPassed : !!rec.passedAt
  const unlocked = passed || tries >= 3

  const live = useRef({})
  const work = useRef(null)
  const abort = useRef(null)
  useEffect(() => { live.current = { code, u, check: () => run('check') } })

  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); live.current.check?.() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  // Leaving the lesson (or the page) abandons a request still in flight.
  useEffect(() => () => abort.current?.abort(), [key])

  // After a result appears, bring it into view (instantly; the panel itself opens smoothly).
  useEffect(() => {
    if (!u.res && !u.busy && !u.revealed) return
    const go = () => { if (work.current) work.current.scrollTop = work.current.scrollHeight }
    const a = setTimeout(go, 60), b = setTimeout(go, 500)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [u.res, u.busy, u.revealed])

  async function run(mode) {
    const cur = live.current.u
    if (predict || cur.busy || cur.key !== key) return
    const src = live.current.code
    // Local checks first: a forbidden hit never reaches the network and costs nothing.
    const msg = forbiddenHit(lesson, src)
    if (msg) { patch(key, { res: { kind: 'forbidden', msg, note: 'Not counted as a miss.' }, sel: null }); return }
    patch(key, { busy: mode, nudge: false, sel: null })
    const ctl = abort.current = new AbortController()
    let reply
    try {
      reply = await playground(assembleSource(lesson, src), ctl.signal)
    } catch (e) {
      if (e instanceof PlaygroundError && e.kind === 'aborted') return
      patch(key, { busy: null, res: { kind: 'error', msg: e instanceof PlaygroundError ? e.message : 'Something went wrong. Try again.' } })
      return
    }
    if (mode === 'run') { patch(key, { busy: null, res: runOutput(lesson, reply) }); return }

    const res = gradeReply(lesson, src, reply)
    if (res.win) {
      store.recordPass(lesson.id, redoMode)
      onPassed(lesson.id, redoMode ? !rec.redoPassed : !rec.passedAt)
      const p = { busy: null, res, nudge: false, justUnlocked: true, tab: 'answer', panelTab: 'answer' }
      if (live.current.u.tab) vt(() => patch(key, p)); else patch(key, p)
      setTimeout(() => patch(key, { justUnlocked: false }), 1200)
    } else {
      // A compile failure is not a miss; a wrong answer or a panic is.
      const miss = !res.compile
      if (miss) store.recordMiss(lesson.id, redoMode)
      const opens = miss && tries + 1 === 3
      patch(key, { busy: null, res, justUnlocked: opens })
      if (miss) setTimeout(() => patch(key, s => ({ nudge: s.tab !== 'hints' && s.tab !== 'answer' })), 700)
      if (opens) setTimeout(() => patch(key, { justUnlocked: false }), 1200)
    }
  }

  // predict: "Compile it" shows the stored real output at once. Finishing the last round marks the lesson done.
  const rounds = lesson.rounds ?? []
  const round = rounds[u.round]
  const lastRound = u.round === rounds.length - 1
  function reveal() {
    if (u.pick == null || u.revealed) return
    patch(key, { revealed: true })
    if (lastRound) { store.recordPass(lesson.id, redoMode); onPassed(lesson.id, redoMode ? !rec.redoPassed : !rec.passedAt, 'Marked as done.') }
  }

  const stage = STAGES.find(st => st.lessons.includes(lesson)) ?? { name: '', lessons: [lesson] }
  const stageDone = stage.lessons.filter(l => store.rec(l.id).passedAt).length
  const showNext = predict ? (u.revealed && lastRound) || (!redoMode && passed) : !!u.res?.win || (!redoMode && passed)
  const [kindIcon, kindLabel] = redoMode ? ['replay', 'Write it again from scratch'] : KIND[lesson.kind]
  const tabs = tabsFor(lesson)
  const busy = u.busy
  const lines = (predict ? round?.snippet ?? '' : code).split('\n').length

  const header = predict ? (
    <>
      <span className="rounds">
        <span>Snippet {u.round + 1} of {rounds.length}</span>
        {rounds.map((_, i) => <i key={i} className={i === u.round ? (u.revealed ? 'done' : 'on') : i < u.round ? 'done' : ''} />)}
      </span>
      <span className="sp" />
      <button className="btn fill" onClick={reveal} disabled={u.pick == null || u.revealed}>
        <span className="ms fill">play_arrow</span>Compile it
      </button>
    </>
  ) : (
    <>
      <span className="note" title="Your code is sent to play.rust-lang.org to be compiled and run"><span className="ms">cloud</span><span className="nt">Runs on the Rust Playground</span></span>
      <span className="sp" />
      <ReviewButton hasReference={unlocked && !!lesson.solution} build={preset => buildReviewPrompt({
        mode: 'rust', language: 'rust', title: lesson.title, statement: lesson.task,
        kind: u.res?.compile?.code ? `${lesson.kind}: ${u.res.compile.code}` : lesson.kind,
        code, results: u.res, reference: unlocked ? lesson.solution : null, preset,
      })} />
      <button className="btn text" onClick={() => run('run')} disabled={!!busy}><span className="ms fill">play_arrow</span><span className="lbl">Run</span></button>
      <button className="btn fill" onClick={() => run('check')} disabled={!!busy} title="Ctrl or Cmd + Enter">
        {busy ? <><span className="ms spin">progress_activity</span>Compiling…</> : <>Check my code<kbd>⌘↵</kbd></>}
      </button>
    </>
  )

  return (
    <>
      <div className="work rs-work" ref={work}>
        {lesson.kind === 'concept' || taught
          ? <ConceptCard lesson={lesson} open={ideaOpen} onToggle={toggleIdea} kind={KIND[lesson.kind]} />
          : (
            <section className="card task">
              <div className="txt"><h2>{lesson.title}</h2><p dangerouslySetInnerHTML={{ __html: lesson.task }} /></div>
              <span className="kd"><span className="ms">{kindIcon}</span>{kindLabel}</span>
            </section>
          )}

        <EditorCard
          busy={!!busy} language="Rust (edition 2021)" codeHeight={codeHeight(lines)} className="rs-editor"
          header={header}
          editor={predict ? undefined : { path: key, value: code, theme, language: 'rust', onChange: v => store.setCode(lesson.id, v, redoMode), onCheck: () => live.current.check?.() }}
          viewer={predict ? <div className="viewer"><CodeBlock code={round?.snippet ?? ''} lang="rust" numbered /></div> : undefined}
          overlay={!predict && (
            <div className={`nudge${u.nudge ? ' on' : ''}`}>
              <span className="bulb"><span className="ms">{unlocked ? 'lock_open' : 'lightbulb'}</span></span>
              <span>{unlocked ? 'Three misses. The answer is open.' : 'Stuck? A hint is ready.'}</span>
              <button className="btn text" onClick={() => showTab(unlocked ? 'answer' : 'hints')}>Show me</button>
              <button className="iconbtn" onClick={() => patch(key, { nudge: false })} aria-label="Dismiss"><span className="ms">close</span></button>
            </div>
          )}
          below={predict && round && <Choices round={round} pick={u.pick} revealed={u.revealed} onPick={i => !u.revealed && patch(key, { pick: i })} />}
          results={predict
            ? (u.revealed && round ? <div className="rres"><Reveal round={round} pick={u.pick} last={lastRound} onNext={() => patch(key, { round: u.round + 1, pick: null, revealed: false })} /></div> : null)
            : (u.res || busy ? <div className="rres"><RustResults res={u.res} lesson={lesson} sel={u.sel} busy={busy} onSel={i => patch(key, { sel: i })} onCpp={() => showTab('cpp')} /></div> : null)}
          onward={showNext && (
            <Onward
              title={stageDone === stage.lessons.length ? `${stage.name} complete` : `${stageDone} of ${stage.lessons.length} done in ${stage.name}`}
              pct={stageDone / stage.lessons.length * 100}
              next={next?.title} onNext={() => onPick(next.id)} last="That was the last lesson."
            />
          )}
        />
      </div>

      <SidePanel open={!!u.tab} title={TITLES[u.panelTab]} onClose={() => u.tab && toggleTab(u.tab)}>
        {u.panelTab && (
          <RustHelp tab={u.panelTab} lesson={lesson} hintsShown={u.hintsShown} lastHint={u.lastHint}
            onMoreHint={moreHint} unlocked={unlocked} passed={passed} tries={tries} />
        )}
      </SidePanel>
      <Rail tabs={tabs} tab={u.tab} onToggle={toggleTab} unlocked={unlocked} justUnlocked={u.justUnlocked} nudge={u.nudge} />
    </>
  )
}
