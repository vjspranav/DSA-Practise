import { useEffect, useRef, useState } from 'react'
import { exportProgress, readBackup, applyBackup } from './backup'

// Small "more" menu in the drawer header: theme switch, export progress to a file, or import one (with a confirm step).
export default function BackupMenu({ onTheme }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(null)   // a validated backup waiting for confirmation
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btn = useRef(null), root = useRef(null), file = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = e => { if (!root.current?.contains(e.target)) close() }
    const esc = e => { if (e.key === 'Escape') close() }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [open])

  function close() { setOpen(false); setPending(null); setError(''); setNote('') }
  function toggle() {
    if (open) return close()
    const r = btn.current.getBoundingClientRect()
    setPos({ top: r.bottom + 4, left: Math.max(8, Math.min(r.left, window.innerWidth - 288)) })
    setOpen(true)
  }
  function doExport() {
    const n = exportProgress()
    setNote(`Saved ${n} item${n === 1 ? '' : 's'} to a file.`)
    setError('')
  }
  async function picked(e) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setNote('')
    try { setPending(await readBackup(f)); setError('') } catch (err) { setPending(null); setError(err.message) }
  }
  function doImport() {
    try { applyBackup(pending) } catch (err) { setPending(null); setError(err.message) }
  }
  const when = pending ? new Date(pending.exportedAt).toLocaleString() : ''

  return (
    <span className="bk" ref={root}>
      <button ref={btn} className="iconbtn" onClick={toggle} aria-label="Theme and progress" aria-haspopup="menu" aria-expanded={open} title="Theme, export and import">
        <span className="ms">more_vert</span>
      </button>
      <input ref={file} type="file" accept=".json,application/json" hidden onChange={picked} data-testid="backup-file" />
      {open && (
        <div className="bk-menu card" role="menu" style={pos}>
          {pending ? (
            <div className="bk-confirm">
              <p>Replace progress in this browser with the file from <b>{when}</b>?</p>
              <div className="bk-row">
                <button className="btn text" onClick={() => setPending(null)}>Cancel</button>
                <button className="btn fill" onClick={doImport}>Import</button>
              </div>
            </div>
          ) : (
            <>
              <button role="menuitem" className="bk-item theme" onClick={() => { onTheme(); close() }}>
                <span className="to-dark"><span className="ms">dark_mode</span>Dark theme</span>
                <span className="to-light"><span className="ms">light_mode</span>Light theme</span>
              </button>
              <button role="menuitem" className="bk-item" onClick={doExport}><span className="ms">download</span>Export progress</button>
              <button role="menuitem" className="bk-item" onClick={() => file.current.click()}><span className="ms">upload</span>Import progress…</button>
              {error && <p className="bk-err" role="alert">{error}</p>}
              {note && <p className="bk-note" role="status">{note}</p>}
            </>
          )}
        </div>
      )}
    </span>
  )
}
