import BackupMenu from './BackupMenu'

// Drawer building blocks shared by the Foundations and Problems lists.

export function Bar({ pct }) {
  return <div className="bar-track"><i style={{ width: `${pct}%` }} /></div>
}

// Top of the drawer: collapse button, the Foundations | Problems switch, theme toggle.
// When the drawer is collapsed the switch folds into a small swap button so it stays reachable.
export function Brand({ mode, onMode, onMin, onTheme }) {
  const other = mode === 'foundations' ? 'problems' : 'foundations'
  return (
    <div className="brand">
      <button className="iconbtn" onClick={onMin} aria-label="Collapse or expand the list"><span className="ms">menu</span></button>
      <div className="seg2" role="tablist" aria-label="Mode">
        {[['foundations', 'Foundations'], ['problems', 'Problems']].map(([m, label]) => (
          <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'on' : ''} onClick={() => mode !== m && onMode(m)}>{label}</button>
        ))}
      </div>
      <button className="iconbtn swap" onClick={() => onMode(other)} aria-label={`Switch to ${other}`} title={`Switch to ${other === 'problems' ? 'Problems' : 'Foundations'}`}>
        <span className="ms">swap_horiz</span>
      </button>
      <BackupMenu onTheme={onTheme} />
    </div>
  )
}

export function Overall({ text, pct }) {
  return <div className="overall"><span>{text}</span><Bar pct={pct} /></div>
}

// A collapsible group of rows (stage, category). `art` is the small picture or icon.
export function Group({ id, open, art, name, count, onToggle, children }) {
  return (
    <div className={`grp${open ? ' open' : ''}`}>
      <button className="grp-h rip" onClick={() => onToggle(id)} title={name}>
        {art}<span className="n">{name}</span><small>{count}</small><span className="ms chev">expand_more</span>
      </button>
      <div className={`fold${open ? ' open' : ''}`}><div>{children}</div></div>
    </div>
  )
}

// The C++ | Rust selector under the Foundations | Problems switch.
export function TrackSwitch({ track, onTrack }) {
  return (
    <div className="trk" role="tablist" aria-label="Language track">
      {[['cpp', 'C++'], ['rust', 'Rust']].map(([t, label]) => (
        <button key={t} role="tab" aria-selected={track === t} className={track === t ? 'on' : ''} onClick={() => track !== t && onTrack(t)}>{label}</button>
      ))}
    </div>
  )
}

// One lesson row. `mark` is an optional small icon for the lesson's kind: { icon, label }.
export function Item({ title, done, current, again, due, justDone, mark, onPick }) {
  const cls = ['item', 'rip', done && 'done', current && 'on', current && justDone && 'justdone'].filter(Boolean).join(' ')
  return (
    <button className={cls} onClick={onPick}>
      <span className={`ms${done ? ' fill' : ''}`}>{again ? 'replay' : done ? 'check_circle' : 'circle'}</span>
      <span className="ttl">{title}</span>
      {mark && <span className="ms kind" title={mark.label}>{mark.icon}</span>}
      {!again && due && <span className="ms again" title="Ready to write again">replay</span>}
    </button>
  )
}
