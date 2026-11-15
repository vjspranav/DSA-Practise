import { useEffect, useRef, useState } from 'react'
import { STAGES, LESSONS } from '../data/foundations'
import Drawer from './Drawer'
import Workbench from './Workbench'
import { useFoundationsStore, isDue } from './useFoundationsStore'
import { ripple, vt } from './motion'
import './foundations.css'

const byId = Object.fromEntries(LESSONS.map(l => [l.id, l]))
const stageOf = id => STAGES.find(s => s.lessons.some(l => l.id === id))

export default function Foundations({ onSwitch }) {
  const store = useFoundationsStore()
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

  function pick(id, fromAgain = false) {
    vt(() => {
      if (fromAgain) { store.enterRedo(id); store.setGroup('again', true) }
      else store.setLast(id)
      const s = stageOf(id)
      if (s) store.setGroup(s.id, true)
    })
  }

  function toggleGroup(id) {
    if (state.min) { store.setMin(false); store.setGroup(id, true); return }
    store.setGroup(id, !open[id])
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
    <div className={`fnd${state.min ? ' min' : ''}`} data-theme={state.theme} onPointerDown={ripple}>
      <Drawer
        stages={STAGES} total={LESSONS.length} doneCount={doneCount} againList={againList}
        isDone={isDone} isDue={id => isDue(store.rec(id))} currentId={current?.id} inRedo={redoMode}
        justDone={justDone} open={open} onToggleGroup={toggleGroup} onPick={pick}
        onMin={store.toggleMin} onSwitch={onSwitch}
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
    </div>
  )
}
