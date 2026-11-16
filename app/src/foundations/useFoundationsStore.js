import { useCallback, useEffect, useState } from 'react'
import { STAGES, LESSONS } from '../data/foundations'
import { blankRec, enteringRedo, withCode, withMiss, withPass } from '../workbench/progress'

// Besides lesson progress this holds the prefs both modes share: theme, collapsed drawer, open groups.
const KEY = 'dsa-foundations'

// First visit: open the stage the app will land on.
function defaultOpen(saved) {
  const id = LESSONS.find(l => l.id === saved.last)?.id ?? LESSONS.find(l => !saved.lessons?.[l.id]?.passedAt)?.id
  const stage = STAGES.find(s => s.lessons.some(l => l.id === id))
  return stage ? { [stage.id]: true } : {}
}

function load() {
  let saved = {}
  try { saved = JSON.parse(localStorage.getItem(KEY)) ?? {} } catch { /* ignore */ }
  return {
    theme: saved.theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    min: !!saved.min,
    open: saved.open ?? defaultOpen(saved),
    last: saved.last ?? null,
    redoing: saved.redoing ?? null,
    lessons: saved.lessons ?? {},
  }
}

export function useFoundationsStore() {
  const [state, setState] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
  }, [state])

  const rec = useCallback(id => ({ ...blankRec(), ...state.lessons[id] }), [state.lessons])

  const upd = (id, fn) => setState(s => ({
    ...s, lessons: { ...s.lessons, [id]: fn({ ...blankRec(), ...s.lessons[id] }) },
  }))

  const actions = {
    setTheme: theme => setState(s => ({ ...s, theme })),
    toggleMin: () => setState(s => ({ ...s, min: !s.min })),
    setMin: min => setState(s => ({ ...s, min })),
    // A header click while the drawer is collapsed expands it and opens that group.
    toggleGroup: key => setState(s => (s.min
      ? { ...s, min: false, open: { ...s.open, [key]: true } }
      : { ...s, open: { ...s.open, [key]: !s.open[key] } })),
    setGroup: (key, open) => setState(s => ({ ...s, open: { ...s.open, [key]: open } })),
    setLast: (id, redoing = null) => setState(s => ({ ...s, last: id, redoing })),
    setCode: (id, code, redo) => upd(id, r => withCode(r, code, redo)),
    recordMiss: (id, redo) => upd(id, r => withMiss(r, redo)),
    enterRedo: id => setState(s => {
      const r = enteringRedo({ ...blankRec(), ...s.lessons[id] })
      return { ...s, last: id, redoing: id, lessons: { ...s.lessons, [id]: r } }
    }),
    recordPass: (id, redo) => upd(id, r => withPass(r, redo)),
  }

  return { state, rec, ...actions }
}
