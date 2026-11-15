import { useCallback, useEffect, useState } from 'react'
import { STAGES, LESSONS } from '../data/foundations'
import { DAY, now } from './time'

// Besides lesson progress this holds the prefs both modes share: theme, collapsed drawer, open groups.
const KEY = 'dsa-foundations'
// Redo schedule: days after the first pass, then after each redo.
export const REDO_DAYS = [3, 7, 21]

export const blankRec = () => ({
  code: null, misses: 0, passedAt: null,
  redo: null,            // { dueAt, step } or null
  redoCode: null, redoMisses: 0, redoPassed: false,
})

export const isDue = rec => !!rec?.redo && rec.redo.dueAt <= now()

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
    setCode: (id, code, redo) => upd(id, r => (redo ? { ...r, redoCode: code } : { ...r, code })),
    recordMiss: (id, redo) => upd(id, r => (redo ? { ...r, redoMisses: r.redoMisses + 1 } : { ...r, misses: r.misses + 1 })),
    // Opening a due lesson from "Write again": fresh buffer unless one is already in progress.
    enterRedo: id => setState(s => {
      const r = { ...blankRec(), ...s.lessons[id] }
      const fresh = r.redoPassed || r.redoCode == null
      const next = fresh ? { ...r, redoCode: null, redoMisses: 0, redoPassed: false } : r
      return { ...s, last: id, redoing: id, lessons: { ...s.lessons, [id]: next } }
    }),
    recordPass: (id, redo) => upd(id, r => {
      if (redo) {
        if (r.redoPassed || !r.redo) return { ...r, redoPassed: true }
        const step = r.redo.step + 1
        return { ...r, redoPassed: true, redo: step < REDO_DAYS.length ? { dueAt: now() + REDO_DAYS[step] * DAY, step } : null }
      }
      if (r.passedAt) return r
      return { ...r, passedAt: now(), redo: { dueAt: now() + REDO_DAYS[0] * DAY, step: 0 } }
    }),
  }

  return { state, rec, ...actions }
}
