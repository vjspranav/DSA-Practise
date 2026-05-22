const DIFF_COLOR = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }

export default function Sidebar({ problems, selectedId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">◈</span>
        <span className="logo-text">AlgoBench</span>
      </div>

      <div className="sidebar-section-label">Sliding Window · Two Pointers</div>

      <nav className="problem-list">
        {problems.map((p, i) => (
          <button
            key={p.id}
            className={`problem-item ${selectedId === p.id ? 'active' : ''}`}
            onClick={() => onSelect(p)}
          >
            <span className="problem-number">{String(i + 1).padStart(2, '0')}</span>
            <span className="problem-item-content">
              <span className="problem-item-title">{p.title}</span>
              <span className={`diff-badge ${DIFF_COLOR[p.difficulty]}`}>{p.difficulty}</span>
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="footer-dot" />
        <span>Runs locally · no data leaves device</span>
      </div>
    </aside>
  )
}
