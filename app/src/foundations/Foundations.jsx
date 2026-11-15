import { useEffect, useRef, useState } from 'react'
import { STAGES, LESSONS } from '../data/foundations'
import Drawer from './Drawer'
import Workbench from './Workbench'
import { isDue } from './useFoundationsStore'
import Shell from '../workbench/Shell'
import { vt } from '../workbench/motion'
import './foundations.css'

const byId = Object.fromEntries(LESSONS.map(l => [l.id, l]))
const stageOf = id => STAGES.find(s => s.lessons.some(l => l.id === id))

// `store` is the shared state from App: lessons, plus the theme / collapsed drawer / open groups both modes use.
export default function Foundations({ store, onMode }) {
  const { state } = store
  const [justDone, setJustDone] = useState(null)
  const [snack, setSnack] = useState({ on: false, text: '' })
  const timers = useRef({})
  const [firstOpen] = useState(() => LESSONS.find(l => !store.rec(l.id).passedAt)?.id)

  const isDone = id => !!store.rec(id).passedAt
  const current = byId[state.last] ?? byId[firstOpen] ?? LESSONS[0]
  const rec = current ? store.rec(current.id) : null
  const redoMode = !!current && state.redoing === current.id && (rec.redoPassed || isDue(rec))
  const againList = LESSONS.filter(l => isDue(store.rec(l.id)))
  const open = state.open

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])
  // Remember the lesson we landed on, so leaving for Problems and coming back returns to it.
  useEffect(() => { if (!state.last && current) store.setLast(current.id) }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  function pick(id, fromAgain = false) {
    vt(() => {
      if (fromAgain) { store.enterRedo(id); store.setGroup('again', true) }
      else store.setLast(id)
      const s = stageOf(id)
      if (s) store.setGroup(s.id, true)
    })
  }

  function passed(id, first) {
    if (first) {
      setJustDone(id)
      clearTimeout(timers.current.done)
      timers.current.done = setTimeout(() => setJustDone(null), 1200)
    }
    setSnack({ on: true, text: 'Passed. The answer is unlocked.' })
    clearTimeout(timers.current.snack)
    timers.current.snack = setTimeout(() => setSnack(s => ({ ...s, on: false })), 3200)
  }

  const nextLesson = current ? LESSONS[LESSONS.indexOf(current) + 1] : null
  const doneCount = LESSONS.filter(l => isDone(l.id)).length

  return (
    <Shell prefs={store}>
      <Drawer
        stages={STAGES} total={LESSONS.length} doneCount={doneCount} againList={againList}
        isDone={isDone} isDue={id => isDue(store.rec(id))} currentId={current?.id} inRedo={redoMode}
        justDone={justDone} open={open} onToggleGroup={store.toggleGroup} onPick={pick}
        onMin={store.toggleMin} onMode={onMode}
        onTheme={() => vt(() => store.setTheme(state.theme === 'dark' ? 'light' : 'dark'))}
      />
      <div className="main">
        {current ? (
          <Workbench
            lesson={current} next={nextLesson} redoMode={redoMode} rec={rec} theme={state.theme}
            store={store} onPick={id => pick(id)} onPassed={passed}
          />
        ) : (
          <div className="card empty">No lessons yet.</div>
        )}
      </div>
      <div className={`snack${snack.on ? ' on' : ''}`}><span className="ms fill">check_circle</span>{snack.text}</div>
    </Shell>
  )
}
