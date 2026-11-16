import { useEffect, useRef, useState } from 'react'
import Drawer from '../foundations/Drawer'
import Shell from './Shell'
import { vt } from './motion'
import { isDue } from './progress'

// A lesson track (C++ Foundations or Rust): drawer + workbench around one lesson store.
// `prefs` holds theme / collapsed drawer; `store` holds this track's lessons; `Workbench` renders one lesson.
export default function Track({ prefs, store, stages, lessons, Workbench, drawerProps, shellClass, onMode }) {
  const state = store.state
  const byId = Object.fromEntries(lessons.map(l => [l.id, l]))
  const stageOf = id => stages.find(s => s.lessons.some(l => l.id === id))
  const [justDone, setJustDone] = useState(null)
  const [snack, setSnack] = useState({ on: false, text: '' })
  const timers = useRef({})
  const [firstOpen] = useState(() => lessons.find(l => !store.rec(l.id).passedAt)?.id)

  const isDone = id => !!store.rec(id).passedAt
  const current = byId[state.last] ?? byId[firstOpen] ?? lessons[0]
  const rec = current ? store.rec(current.id) : null
  const redoMode = !!current && state.redoing === current.id && (rec.redoPassed || isDue(rec))
  const againList = lessons.filter(l => isDue(store.rec(l.id)))

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

  function passed(id, first, text = 'Passed. The answer is unlocked.') {
    if (first) {
      setJustDone(id)
      clearTimeout(timers.current.done)
      timers.current.done = setTimeout(() => setJustDone(null), 1200)
    }
    setSnack({ on: true, text })
    clearTimeout(timers.current.snack)
    timers.current.snack = setTimeout(() => setSnack(s => ({ ...s, on: false })), 3200)
  }

  const nextLesson = current ? lessons[lessons.indexOf(current) + 1] : null
  const doneCount = lessons.filter(l => isDone(l.id)).length

  return (
    <Shell prefs={prefs} className={shellClass}>
      <Drawer
        stages={stages} total={lessons.length} doneCount={doneCount} againList={againList}
        isDone={isDone} isDue={id => isDue(store.rec(id))} currentId={current?.id} inRedo={redoMode}
        justDone={justDone} open={state.open} onToggleGroup={store.toggleGroup} onPick={pick}
        onMin={prefs.toggleMin} onMode={onMode}
        onTheme={() => vt(() => prefs.setTheme(prefs.state.theme === 'dark' ? 'light' : 'dark'))}
        {...drawerProps}
      />
      <div className="main">
        {current ? (
          <Workbench
            lesson={current} next={nextLesson} redoMode={redoMode} rec={rec} theme={prefs.state.theme}
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
