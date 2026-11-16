// The help column: a side panel that opens beside the editor, and the rail of tabs that drives it.

export function SidePanel({ open, title, onClose, children }) {
  return (
    <div className={`card side${open ? ' open' : ''}`}>
      <div className="side-in">
        <div className="side-h">
          <span>{title || ''}</span>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><span className="ms">close</span></button>
        </div>
        <div className="side-b">{children}</div>
      </div>
    </div>
  )
}

// tabs: [[id, icon, name]]. The 'answer' tab shows a lock until `unlocked`; 'hints' gets a badge while `nudge`.
export function Rail({ tabs, tab, onToggle, unlocked, justUnlocked, nudge }) {
  return (
    <div className="rail">
      {tabs.map(([t, icon, name]) => (
        <button key={t} className={`rip${tab === t ? ' on' : ''}${t === 'answer' && justUnlocked ? ' unlocked' : ''}`} onClick={() => onToggle(t)}>
          <span className="ms">{t === 'answer' && unlocked ? 'lock_open' : icon}</span>{name}
          {t === 'hints' && nudge && !unlocked && <i className="badge" />}
        </button>
      ))}
    </div>
  )
}
