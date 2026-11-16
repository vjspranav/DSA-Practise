import { useEffect, useRef, useState } from 'react'
import { PRESETS, copyText } from './reviewPrompt'

// "Copy for review": copies a ready-to-paste prompt for Claude. Nothing leaves the device from here.
// `build(preset)` returns the Markdown; `hasReference` offers the compare preset once the answer is unlocked.
export default function ReviewButton({ build, hasReference }) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState('idle') // idle | copied | failed
  const box = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = e => { if (!box.current?.contains(e.target)) setOpen(false) }
    const esc = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [open])
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy(preset) {
    setOpen(false)
    const ok = await copyText(build(preset))
    setState(ok ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2000)
  }

  const label = state === 'copied' ? 'Copied — paste it into Claude' : state === 'failed' ? 'Could not copy' : 'Copy for review'
  const icon = state === 'copied' ? 'check' : state === 'failed' ? 'error' : 'content_copy'
  return (
    <div className={`rv${state === 'idle' ? '' : ' ' + state}`} ref={box}>
      <button className="btn text rv-main" onClick={() => copy('better')} title="Copy your code, the task and the last run, ready to paste into Claude" aria-label={label}>
        <span className="ms">{icon}</span><span className="lbl">{label}</span>
      </button>
      <button className="btn text rv-caret" onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open} aria-label="Choose what to ask">
        <span className="ms">arrow_drop_down</span>
      </button>
      <span className="sr-only" role="status">{state === 'copied' ? 'Copied. Paste it into Claude.' : ''}</span>
      {open && (
        <div className="rv-menu" role="menu">
          {PRESETS.filter(p => !p.needsReference || hasReference).map(p => (
            <button key={p.id} role="menuitem" onClick={() => copy(p.id)}>{p.label}</button>
          ))}
        </div>
      )}
    </div>
  )
}
