// Per-lesson progress rules shared by the C++ and Rust tracks (each keeps its own store).
// Pure functions: they take a lesson record and return the next one.
import { DAY, now } from '../foundations/time'

// Redo schedule: days after the first pass, then after each redo.
export const REDO_DAYS = [3, 7, 21]

export const blankRec = () => ({
  code: null, misses: 0, passedAt: null,
  redo: null,            // { dueAt, step } or null
  redoCode: null, redoMisses: 0, redoPassed: false,
})

export const isDue = rec => !!rec?.redo && rec.redo.dueAt <= now()

export const withCode = (r, code, redo) => (redo ? { ...r, redoCode: code } : { ...r, code })

export const withMiss = (r, redo) => (redo ? { ...r, redoMisses: r.redoMisses + 1 } : { ...r, misses: r.misses + 1 })

// Opening a due lesson from "Write again": a fresh buffer unless one is already in progress.
export function enteringRedo(r) {
  const fresh = r.redoPassed || r.redoCode == null
  return fresh ? { ...r, redoCode: null, redoMisses: 0, redoPassed: false } : r
}

// A pass. The first pass schedules the first redo; a redo pass schedules the next one.
// `schedule: false` marks the lesson done without scheduling redos (for steps with nothing to write).
export function withPass(r, redo, schedule = true) {
  if (redo) {
    if (r.redoPassed || !r.redo) return { ...r, redoPassed: true }
    const step = r.redo.step + 1
    return { ...r, redoPassed: true, redo: step < REDO_DAYS.length ? { dueAt: now() + REDO_DAYS[step] * DAY, step } : null }
  }
  if (r.passedAt) return r
  return { ...r, passedAt: now(), redo: schedule ? { dueAt: now() + REDO_DAYS[0] * DAY, step: 0 } : null }
}
