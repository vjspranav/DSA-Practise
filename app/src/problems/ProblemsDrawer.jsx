import { Brand, Group, Overall } from '../workbench/DrawerParts'
import { CAT_ICON, DIFF, askedOf } from './meta'

function Item({ problem, status, current, onPick }) {
  const cls = ['item', 'prob', 'rip', status === 'complete' && 'done', status === 'revise' && 'rev', current && 'on'].filter(Boolean).join(' ')
  const icon = status === 'complete' ? 'check_circle' : status === 'revise' ? 'replay' : 'circle'
  const state = status === 'complete' ? 'done' : status === 'revise' ? 'to revise' : 'not started'
  return (
    <button className={cls} onClick={() => onPick(problem)} title={`${problem.title} · ${problem.difficulty} · ${state} · asked by ${askedOf(problem)[1]}`}>
      <span className={`ms${status ? ' fill' : ''}`}>{icon}</span>
      <span className="ttl">{problem.title}</span>
      <span className={`dif ${DIFF[problem.difficulty]}`} aria-label={problem.difficulty}>{DIFF[problem.difficulty]}</span>
      <span className="ask">{askedOf(problem)[0]}</span>
    </button>
  )
}

export default function ProblemsDrawer({ categories, problems, getStatus, currentId, open, onToggleGroup, onPick, onMin, onTheme, onMode }) {
  const done = problems.filter(p => getStatus(p.id) === 'complete').length
  return (
    <aside className="drawer">
      <Brand mode="problems" onMode={onMode} onMin={onMin} onTheme={onTheme} />
      <Overall text={`${done} of ${problems.length} problems done`} pct={problems.length ? done / problems.length * 100 : 0} />
      <nav className="nav">
        {categories.map(c => {
          const list = problems.filter(p => p.category === c.id)
          const n = list.filter(p => getStatus(p.id) === 'complete').length
          return (
            <Group key={c.id} id={c.id} open={open[c.id]} name={c.label} count={`${n}/${list.length}`} onToggle={onToggleGroup}
              art={<span className="art ic"><span className="ms">{CAT_ICON[c.id] ?? 'folder'}</span></span>}>
              {list.map(p => <Item key={p.id} problem={p} status={getStatus(p.id)} current={p.id === currentId} onPick={onPick} />)}
            </Group>
          )
        })}
      </nav>
      <div className="legend">
        <span><span className="ms fill ok">check_circle</span>done</span>
        <span><span className="ms fill pri">replay</span>to revise</span>
        <span>E M H = difficulty</span>
        <span>H / V / ★ = asked by Himali / VJS / bonus</span>
      </div>
    </aside>
  )
}
