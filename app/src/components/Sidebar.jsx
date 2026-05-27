import { useState } from 'react'

export default function Sidebar({
  categories, problems, selectedId,
  onSelect, getStatus, onStatusChange,
  collapsed, onToggle,
}) {
  const [openMenu, setOpenMenu] = useState(null)

  const grouped = categories.map(cat => ({
    ...cat,
    items: problems.filter(p => p.category === cat.id),
  }))

  let globalIdx = 0

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        {!collapsed && <span className="logo-text">Practice</span>}
        <button className="sidebar-toggle" onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="problem-list">
        {grouped.map(cat => (
          <div key={cat.id} className="category-group">
            {!collapsed && (
              <div className="category-header">{cat.label}</div>
            )}
            {cat.items.map(p => {
              const idx = ++globalIdx
              const status = getStatus(p.id)
              return (
                <div
                  key={p.id}
                  className={`problem-row${selectedId === p.id ? ' active' : ''}`}
                >
                  <button
                    className="problem-item"
                    onClick={() => { onSelect(p); setOpenMenu(null) }}
                    title={collapsed ? p.title : undefined}
                  >
                    <span className="problem-number">{String(idx).padStart(2, '0')}</span>
                    {!collapsed && (
                      <span className="problem-item-content">
                        <span className="problem-item-title">{p.title}</span>
                        <span className="problem-item-meta">
                          <span className={`asked-pill ${p.askedBy}`}>
                            {p.askedBy === 'himali' ? 'H' : 'V'}
                          </span>
                          {status === 'complete' && <span className="status-icon complete">✓</span>}
                          {status === 'revise'   && <span className="status-icon revise">↩</span>}
                        </span>
                      </span>
                    )}
                    {collapsed && status && (
                      <span className={`status-dot ${status}`} />
                    )}
                  </button>

                  {!collapsed && (
                    <div className="context-wrap">
                      <button
                        className="context-btn"
                        onClick={e => {
                          e.stopPropagation()
                          setOpenMenu(openMenu === p.id ? null : p.id)
                        }}
                      >⋯</button>
                      {openMenu === p.id && (
                        <div className="context-popover">
                          <button onClick={() => {
                            onStatusChange(p.id, status === 'complete' ? null : 'complete')
                            setOpenMenu(null)
                          }}>
                            <span className="ctx-icon complete">✓</span>
                            {status === 'complete' ? 'Unmark Complete' : 'Mark Complete'}
                          </button>
                          <button onClick={() => {
                            onStatusChange(p.id, status === 'revise' ? null : 'revise')
                            setOpenMenu(null)
                          }}>
                            <span className="ctx-icon revise">↩</span>
                            {status === 'revise' ? 'Unmark Revise' : 'Mark Revise'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="footer-dot" />
        {!collapsed && <span>Runs locally · no data leaves device</span>}
      </div>
    </aside>
  )
}
