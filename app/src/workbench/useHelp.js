import { useState } from 'react'
import { vt } from './motion'

// Per-lesson screen state for a workbench: results, open help tab, hints shown, busy flag.
// It resets whenever `key` (lesson + mode) changes. `extra` adds fields to the initial state.
export function useLessonUi(key, extra = {}) {
  const init = k => ({
    key: k, res: null, sel: null, tab: null, panelTab: null, nudge: false,
    hintsShown: 1, lastHint: 0, busy: null, justUnlocked: false, ...extra,
  })
  const [ui, setUi] = useState(() => init(key))
  const u = ui.key === key ? ui : init(key)
  if (ui.key !== key) setUi(u)
  // Updates for a lesson that is no longer on screen (a finished request, a timer) are dropped.
  const patch = (k, p) => setUi(s => (s.key === k ? { ...s, ...(typeof p === 'function' ? p(s) : p) } : s))
  return [u, patch]
}

// Opening, switching and closing the help tabs, and revealing hints one at a time.
export function useHelpTabs(key, u, patch) {
  function toggleTab(t) {
    const was = u.tab, nextTab = was === t ? null : t
    const base = { lastHint: 0, ...(nextTab === 'hints' || nextTab === 'answer' ? { nudge: false } : {}) }
    if (was && nextTab) vt(() => patch(key, { ...base, tab: nextTab, panelTab: nextTab }))
    else if (nextTab) patch(key, { ...base, tab: nextTab, panelTab: nextTab })
    else {
      patch(key, { ...base, tab: null })
      // Keep the content while the panel slides shut.
      setTimeout(() => patch(key, s => (s.tab === null ? { panelTab: null } : {})), 450)
    }
  }
  const showTab = t => { if (u.tab !== t) toggleTab(t); else patch(key, { nudge: false }) }
  const moreHint = () => vt(() => patch(key, s => ({ lastHint: s.hintsShown, hintsShown: s.hintsShown + 1 })))
  return { toggleTab, showTab, moreHint }
}
