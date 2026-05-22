const DIFF_COLOR = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }

export default function Sidebar({ problems, selectedId, onSelect, collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        {!collapsed && <span className="logo-text">Practice</span>}
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {!collapsed && <div className="sidebar-section-label">Sliding Window · Two Pointers</div>}

      <nav className="problem-list">
        {problems.map((p, i) => (
          <button
            key={p.id}
            className={`problem-item${selectedId === p.id ? ' active' : ''}`}
            onClick={() => onSelect(p)}
            title={collapsed ? p.title : undefined}
          >
            <span className="problem-number">{String(i + 1).padStart(2, '0')}</span>
            {!collapsed && (
              <span className="problem-item-content">
                <span className="problem-item-title">{p.title}</span>
                <span className={`diff-badge ${DIFF_COLOR[p.difficulty]}`}>{p.difficulty}</span>
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="footer-dot" />
        {!collapsed && <span>Runs locally · no data leaves device</span>}
      </div>
    </aside>
  )
}
