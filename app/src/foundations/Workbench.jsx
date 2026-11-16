import { useEffect, useRef } from 'react'
import EditorCard from '../workbench/EditorCard'
import ReviewButton from '../workbench/ReviewButton'
import { buildReviewPrompt } from '../workbench/reviewPrompt'
import Onward from '../workbench/Onward'
import HelpPanel from './HelpPanel'
import { Rail, SidePanel } from '../workbench/SidePanel'
import { ResultsBody } from '../workbench/Results'
import { assembleSource, forbiddenHit, judge, splitOutput } from './grade'
import { compile, exclusive, limitFor, runTest } from '../workbench/runner'
import { vt } from '../workbench/motion'
import { useHelpTabs, useLessonUi } from '../workbench/useHelp'
import { STAGES } from '../data/foundations/index.js'

const KIND = { program: 'Write the whole program', implement: 'Write the function', drill: 'Quick drill', bugfix: 'Find the bug' }
const KIND_ICON = { program: 'terminal', implement: 'function', drill: 'bolt', bugfix: 'bug_report' }
const TABS = [['refresher', 'menu_book', 'Refresher'], ['hints', 'lightbulb', 'Hints'], ['answer', 'lock', 'Answer']]

// Compiler errors refer to the assembled source; point them at the learner's own lines.
function mapErrors(lesson, text) {
  if (lesson.kind === 'program') return text
  const MARK = '\u0001'
  const before = assembleSource(lesson, MARK).split(MARK)[0]
  const offset = before.split('\n').length - 1
  return text.replace(/(^|\n)[^\s:]*?:(\d+):(\d+):/g, (m, nl, line, col) => {
    const n = Number(line) - offset
    return n >= 1 ? `${nl}line ${n}, col ${col}:` : m
  })
}

export default function Workbench({ lesson, next, redoMode, rec, theme, store, onPick, onPassed }) {
  const key = `${lesson.id}:${redoMode ? 'redo' : 'main'}`
  const [u, patch] = useLessonUi(key)

  const starter = lesson.starter ?? ''
  const code = redoMode ? (rec.redoCode ?? starter) : (rec.code ?? starter)
  const tries = redoMode ? rec.redoMisses : rec.misses
  const passed = redoMode ? rec.redoPassed : !!rec.passedAt
  const unlocked = passed || tries >= 3

  const live = useRef({})

  useEffect(() => { live.current = { code, u, check: () => run('check') } })

  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); live.current.check?.() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function run(mode) {
    const cur = live.current.u
    if (cur.busy || cur.key !== key) return
    const src = live.current.code
    const msg = forbiddenHit(lesson, src)
    if (msg) { patch(key, { res: { kind: 'forbidden', msg, note: 'Not counted as a miss.' }, sel: null }); return }
    patch(key, { busy: mode, nudge: false, sel: null })

    const tests = mode === 'run' ? lesson.tests.slice(0, 1) : lesson.tests
    const outcome = await exclusive(async () => {
      const c = await compile(assembleSource(lesson, src))
      if (!c.ok) return { compileError: mapErrors(lesson, c.error) }
      const results = []
      let dead = false
      for (const t of tests) {
        const base = {
          name: t.name, expected: t.expected,
          input: (t.input ?? (lesson.kind === 'program' ? t.stdin : undefined))?.replace(/\n+$/, ''),
        }
        if (dead) { results.push({ ...base, status: 'skipped' }); continue }
        const r = await runTest(t.stdin ?? '', limitFor(lesson))
        if (r.status === 'tle') { dead = true; results.push({ ...base, status: 'tle' }) }
        else if (r.status === 'error') results.push({ ...base, status: 'error', message: r.message })
        else {
          const j = judge(lesson, t, r.stdout)
          const raw = lesson.kind === 'program' ? r.stdout : splitOutput(lesson, r.stdout).printed
          results.push({ ...base, status: j.pass ? 'ok' : 'fail', got: j.got, printed: j.printed, raw: raw.trim() })
        }
      }
      return { results }
    })

    if (outcome.compileError != null) {
      patch(key, { busy: null, res: { kind: 'compile', text: outcome.compileError, note: 'Not counted as a miss.' } })
      return
    }
    const results = outcome.results
    if (mode === 'run') {
      patch(key, { busy: null, res: { kind: 'run', test: results[0], raw: results[0].raw ?? results[0].message ?? '' } })
      return
    }
    const win = results.every(t => t.status === 'ok')
    const hadSide = !!live.current.u.tab
    if (win) {
      store.recordPass(lesson.id, redoMode)
      onPassed(lesson.id, redoMode ? !rec.redoPassed : !rec.passedAt)
      const p = { busy: null, res: { kind: 'check', tests: results, win }, nudge: false, justUnlocked: true, tab: 'answer', panelTab: 'answer' }
      if (hadSide) vt(() => patch(key, p)); else patch(key, p)
      setTimeout(() => patch(key, { justUnlocked: false }), 1200)
    } else {
      store.recordMiss(lesson.id, redoMode)
      patch(key, { busy: null, res: { kind: 'check', tests: results, win }, justUnlocked: tries + 1 === 3 })
      setTimeout(() => patch(key, s => ({ nudge: s.tab !== 'hints' && s.tab !== 'answer' })), 700)
      if (tries + 1 === 3) setTimeout(() => patch(key, { justUnlocked: false }), 1200)
    }
  }

  const { toggleTab, showTab, moreHint } = useHelpTabs(key, u, patch)

  const res = u.res
  // Once a lesson is passed, always offer the way forward with the stage's progress.
  const showNext = !!res?.win || (!redoMode && passed)
  const stage = STAGES.find(st => st.lessons.includes(lesson)) ?? { name: '', lessons: [lesson] }
  const stageDone = stage.lessons.filter(l => store.rec(l.id).passedAt).length
  const kindLabel = redoMode ? 'Write it again from scratch' : KIND[lesson.kind]
  const kindIcon = redoMode ? 'replay' : KIND_ICON[lesson.kind]
  const panelName = u.panelTab && TABS.find(t => t[0] === u.panelTab)[2]

  return (
    <>
      <div className="work">
        <section className="card task">
          <div className="txt">
            <h2>{lesson.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: lesson.task }} />
          </div>
          <span className="kd"><span className="ms">{kindIcon}</span>{kindLabel}</span>
        </section>

        <EditorCard
          busy={u.busy} language="C++14"
          header={<>
            <span className="sp" />
            <ReviewButton hasReference={unlocked && !!lesson.solution} build={preset => buildReviewPrompt({
              mode: 'foundations', language: 'cpp', title: lesson.title, statement: lesson.task, kind: lesson.kind,
              code, results: res, reference: unlocked ? lesson.solution : null, preset,
            })} />
            <button className={`btn text${u.busy ? ' busy' : ''}`} onClick={() => run('run')}><span className="ms fill">play_arrow</span>Run</button>
            <button className={`btn fill${u.busy ? ' busy' : ''}`} onClick={() => run('check')} title="Ctrl or Cmd + Enter">
              Check my code<kbd>⌘↵</kbd>
            </button>
          </>}
          editor={{ path: key, value: code, theme, onChange: v => store.setCode(lesson.id, v, redoMode), onCheck: () => live.current.check?.() }}
          overlay={
            <div className={`nudge${u.nudge ? ' on' : ''}`}>
              <span className="bulb"><span className="ms">{unlocked ? 'lock_open' : 'lightbulb'}</span></span>
              <span>{unlocked ? 'Three misses. The answer is open.' : 'Stuck? A hint is ready.'}</span>
              <button className="btn text" onClick={() => showTab(unlocked ? 'answer' : 'hints')}>Show me</button>
              <button className="iconbtn" onClick={() => patch(key, { nudge: false })} aria-label="Dismiss"><span className="ms">close</span></button>
            </div>
          }
          results={res ? <ResultsBody res={res} sel={u.sel} onSel={i => patch(key, { sel: i })} /> : null}
          onward={showNext && (
            <Onward
              title={stageDone === stage.lessons.length ? `${stage.name} complete` : `${stageDone} of ${stage.lessons.length} done in ${stage.name}`}
              pct={stageDone / stage.lessons.length * 100}
              next={next?.title} onNext={() => onPick(next.id)} last="That was the last lesson."
            />
          )}
        />
      </div>

      <SidePanel open={!!u.tab} title={panelName} onClose={() => u.tab && toggleTab(u.tab)}>
        {u.panelTab && (
          <HelpPanel tab={u.panelTab} lesson={lesson} hintsShown={u.hintsShown} lastHint={u.lastHint}
            onMoreHint={moreHint} unlocked={unlocked} passed={passed} tries={tries} />
        )}
      </SidePanel>
      <Rail tabs={TABS} tab={u.tab} onToggle={toggleTab} unlocked={unlocked} justUnlocked={u.justUnlocked} nudge={u.nudge} />
    </>
  )
}
