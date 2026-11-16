import { useCallback, useEffect, useState } from 'react'
import { STAGES, LESSONS } from './lessons'
import { blankRec, enteringRedo, withCode, withMiss, withPass } from '../workbench/progress'

// Rust progress lives under its own key, apart from the C++ track ('dsa-foundations').
// Theme and the collapsed drawer are shared prefs and stay in the C++ store.
const KEY = 'dsa-rust'
const kindOf = Object.fromEntries(LESSONS.map(l => [l.id, l.kind]))

function defaultOpen(saved) {
  const id = LESSONS.find(l => l.id === saved.last)?.id ?? LESSONS.find(l => !saved.lessons?.[l.id]?.passedAt)?.id
  const stage = STAGES.find(s => s.lessons.some(l => l.id === id))
  return stage ? { [stage.id]: true } : {}
}

function load() {
  let saved = {}
  try { saved = JSON.parse(localStorage.getItem(KEY)) ?? {} } catch { /* ignore */ }
  return {
    open: saved.open ?? defaultOpen(saved),
    last: saved.last ?? null,
    redoing: saved.redoing ?? null,
    lessons: saved.lessons ?? {},
  }
}

// `prefs` is the shared store from App; its toggleMin / min state are used when a group header is clicked.
export function useRustStore(prefs) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
  }, [state])

  const rec = useCallback(id => ({ ...blankRec(), ...state.lessons[id] }), [state.lessons])
  const upd = (id, fn) => setState(s => ({ ...s, lessons: { ...s.lessons, [id]: fn({ ...blankRec(), ...s.lessons[id] }) } }))

  return {
    state, rec,
    // A header click while the drawer is collapsed expands it and opens that group.
    toggleGroup: key => {
      if (prefs.state.min) prefs.setMin(false)
      setState(s => ({ ...s, open: { ...s.open, [key]: prefs.state.min ? true : !s.open[key] } }))
    },
    setGroup: (key, open) => setState(s => ({ ...s, open: { ...s.open, [key]: open } })),
    setLast: (id, redoing = null) => setState(s => ({ ...s, last: id, redoing })),
    setCode: (id, code, redo) => upd(id, r => withCode(r, code, redo)),
    recordMiss: (id, redo) => upd(id, r => withMiss(r, redo)),
    enterRedo: id => setState(s => ({ ...s, last: id, redoing: id, lessons: { ...s.lessons, [id]: enteringRedo({ ...blankRec(), ...s.lessons[id] }) } })),
    // Predict steps have nothing to write again, so they are marked done without a redo schedule.
    recordPass: (id, redo) => upd(id, r => withPass(r, redo, kindOf[id] !== 'predict')),
  }
}
