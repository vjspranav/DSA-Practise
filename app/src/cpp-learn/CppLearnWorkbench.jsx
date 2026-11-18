import { useEffect, useRef, useState } from 'react'
import EditorCard from '../workbench/EditorCard'
import ReviewButton from '../workbench/ReviewButton'
import { buildReviewPrompt } from '../workbench/reviewPrompt'
import Onward from '../workbench/Onward'
import { Rail, SidePanel } from '../workbench/SidePanel'
import { CodeBlock } from '../foundations/HelpPanel'
import { vt } from '../workbench/motion'
import { useHelpTabs, useLessonUi } from '../workbench/useHelp'
import ConceptCard from '../rust/ConceptCard'
import { Choices, Reveal } from '../rust/PredictPanel'
import CppLearnHelp from './CppLearnHelp'
import CppLearnResults from './CppLearnResults'
import { Clang } from './ClangOutput'
import { gradeRun, forbiddenHit } from './grade'
import { attempt } from './attempt'
import { checkView, runView } from './view'
import { STAGES } from './lessons'

const KIND = {
  concept: ['school', 'Concept'], predict: ['quiz', 'Predict'], fix: ['build', 'Make it compile'], program: ['terminal', 'Write the whole program'],
  implement: ['code', 'Write the function'], drill: ['bolt', 'Quick drill'], bugfix: ['bug_report', 'Find the bug'],
}
// The comparison on a concept card is Python on the left, C++ on the right.
const BRIDGE = { title: 'Coming from Python', lang: 'cpp', panes: [['Python', 'py', 'python'], ['C++', 'cpp', 'cpp']] }

function tabsFor(lesson) {
  const tabs = [['refresher', 'menu_book', 'Refresher']]
  if (lesson.inPython) tabs.push(['py', 'compare_arrows', 'In Python'])
  if (lesson.kind !== 'predict') tabs.push(['hints', 'lightbulb', 'Hints'], ['answer', 'lock', 'Answer'])
  return tabs
}

const TITLES = { refresher: 'Refresher', py: 'In Python', hints: 'Hints', answer: 'Answer' }

// What a predict step shows after "Run it": clang's text for a compile error, a sentence for undefined behaviour
// (never a program output), the program's stdout otherwise.
function outcome(round) {
  if (round.ub) {
    return <div className="ub"><span className="ms">help</span><div><div className="lbl">What really happens</div><p>{round.output}</p></div></div>
  }
  if (round.error) return <Clang text={round.output} cap />
  return <div className="out"><div className="lbl">Compiled and ran. Printed</div><pre>{round.output === '' ? '(nothing printed)' : round.output}</pre></div>
}

// Collapsing a taught lesson's explanation is remembered per lesson, but only once the learner has passed it.
// The key starts with dsa- so export / import carries it.
const FOLD_KEY = 'dsa-cpp-learn-folded'
const readFolded = () => { try { return JSON.parse(localStorage.getItem(FOLD_KEY) ?? '[]') } catch { return [] } }
const codeHeight = lines => `clamp(300px, ${lines * 24 + 112}px, 62vh)`

export default function CppLearnWorkbench({ lesson, next, redoMode, rec, theme, store, onPick, onPassed }) {
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
  useEffect(() => { live.current = { code, u, check: () => run('check') } })

  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); live.current.check?.() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
    // Local checks first: a forbidden hit never reaches the compiler and costs nothing.
    const msg = forbiddenHit(lesson, src)
    if (msg) { patch(key, { res: { kind: 'forbidden', msg, note: 'Not counted as a miss.' }, sel: null }); return }
    patch(key, { busy: mode, nudge: false, sel: null })
    const result = await attempt(lesson, src, mode === 'run')
    if (mode === 'run') { patch(key, { busy: null, res: runView(lesson, result) }); return }

    const res = checkView(lesson, gradeRun(lesson, src, result))
    if (res.win) {
      store.recordPass(lesson.id, redoMode)
      onPassed(lesson.id, redoMode ? !rec.redoPassed : !rec.passedAt)
      const p = { busy: null, res, nudge: false, justUnlocked: true, tab: 'answer', panelTab: 'answer' }
      if (live.current.u.tab) vt(() => patch(key, p)); else patch(key, p)
      setTimeout(() => patch(key, { justUnlocked: false }), 1200)
    } else {
      // A compile failure is not a miss; a wrong answer, a crash or a timeout is.
      const miss = !res.compile
      if (miss) store.recordMiss(lesson.id, redoMode)
      const opens = miss && tries + 1 === 3
      patch(key, { busy: null, res, justUnlocked: opens })
      if (miss) setTimeout(() => patch(key, s => ({ nudge: s.tab !== 'hints' && s.tab !== 'answer' })), 700)
      if (opens) setTimeout(() => patch(key, { justUnlocked: false }), 1200)
    }
  }

  // predict: "Run it" shows the stored real result at once. Finishing the last round marks the lesson done.
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
        <span className="ms fill">play_arrow</span>Run it
      </button>
    </>
  ) : (
    <>
      <span className="note" title="Your code is compiled and run in this browser. Nothing is sent anywhere."><span className="ms">computer</span><span className="nt">Runs in your browser</span></span>
      <span className="sp" />
      <ReviewButton hasReference={unlocked && !!lesson.solution} build={preset => buildReviewPrompt({
        mode: 'cpp-learn', language: 'cpp', title: lesson.title, statement: lesson.task, kind: lesson.kind,
        code, results: u.res, reference: unlocked ? lesson.solution : null, preset,
      })} />
      <button className="btn text" onClick={() => run('run')} disabled={!!busy}><span className="ms fill">play_arrow</span><span className="lbl">Run</span></button>
      <button className="btn fill" onClick={() => run('check')} disabled={!!busy} title="Ctrl or Cmd + Enter">
        {busy ? <><span className="ms spin">progress_activity</span>Working…</> : <>Check my code<kbd>⌘↵</kbd></>}
      </button>
    </>
  )

  return (
    <>
      <div className="work rs-work" ref={work}>
        {lesson.kind === 'concept' || taught
          ? <ConceptCard lesson={lesson} open={ideaOpen} onToggle={toggleIdea} kind={KIND[lesson.kind]} bridge={BRIDGE} />
          : (
            <section className="card task">
              <div className="txt"><h2>{lesson.title}</h2><p dangerouslySetInnerHTML={{ __html: lesson.task }} /></div>
              <span className="kd"><span className="ms">{kindIcon}</span>{kindLabel}</span>
            </section>
          )}

        <EditorCard
          busy={!!busy} language="C++14" codeHeight={codeHeight(lines)} className="rs-editor"
          header={header}
          editor={predict ? undefined : { path: key, value: code, theme, language: 'cpp', onChange: v => store.setCode(lesson.id, v, redoMode), onCheck: () => live.current.check?.() }}
          viewer={predict ? <div className="viewer"><CodeBlock code={round?.snippet ?? ''} lang="cpp" numbered /></div> : undefined}
          overlay={!predict && (
            <div className={`nudge${u.nudge ? ' on' : ''}`}>
              <span className="bulb"><span className="ms">{unlocked ? 'lock_open' : 'lightbulb'}</span></span>
              <span>{unlocked ? 'Three misses. The answer is open.' : 'Stuck? A hint is ready.'}</span>
              <button className="btn text" onClick={() => showTab(unlocked ? 'answer' : 'hints')}>Show me</button>
              <button className="iconbtn" onClick={() => patch(key, { nudge: false })} aria-label="Dismiss"><span className="ms">close</span></button>
            </div>
          )}
          below={predict && round && (
            <>
              {round.stdin != null && <div className="exout exin pin"><span className="lbl">Input</span><pre>{round.stdin.replace(/\n$/, '') || '(nothing)'}</pre></div>}
              <Choices round={round} pick={u.pick} revealed={u.revealed} onPick={i => !u.revealed && patch(key, { pick: i })} />
            </>
          )}
          results={predict
            ? (u.revealed && round ? <div className="rres"><Reveal round={round} pick={u.pick} last={lastRound} outcome={outcome} onNext={() => patch(key, { round: u.round + 1, pick: null, revealed: false })} /></div> : null)
            : (u.res || busy ? <div className="rres"><CppLearnResults res={u.res} lesson={lesson} sel={u.sel} busy={busy} onSel={i => patch(key, { sel: i })} onPy={() => showTab('py')} /></div> : null)}
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
          <CppLearnHelp tab={u.panelTab} lesson={lesson} hintsShown={u.hintsShown} lastHint={u.lastHint}
            onMoreHint={moreHint} unlocked={unlocked} passed={passed} tries={tries} />
        )}
      </SidePanel>
      <Rail tabs={tabs} tab={u.tab} onToggle={toggleTab} unlocked={unlocked} justUnlocked={u.justUnlocked} nudge={u.nudge} />
    </>
  )
}
