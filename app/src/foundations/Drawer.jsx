import { ART } from './art'
import { Brand, Group, Overall } from '../workbench/DrawerParts'

function Item({ lesson, done, current, again, due, justDone, onPick }) {
  const cls = ['item', 'rip', done && 'done', current && 'on', current && justDone && 'justdone'].filter(Boolean).join(' ')
  return (
    <button className={cls} onClick={() => onPick(lesson.id, again)}>
      <span className={`ms${done ? ' fill' : ''}`}>{again ? 'replay' : done ? 'check_circle' : 'circle'}</span>
      <span className="ttl">{lesson.title}</span>
      {!again && due && <span className="ms again" title="Ready to write again">replay</span>}
    </button>
  )
}

export default function Drawer({ stages, total, doneCount, againList, isDone, isDue, currentId, inRedo, justDone, open, onToggleGroup, onPick, onMin, onTheme, onMode }) {
  const inAgainNow = inRedo && againList.some(a => a.id === currentId)
  return (
    <aside className="drawer">
      <Brand mode="foundations" onMode={onMode} onMin={onMin} onTheme={onTheme} />
      <Overall text={`${doneCount} of ${total} lessons done`} pct={total ? doneCount / total * 100 : 0} />
      <nav className="nav">
        {againList.length > 0 && (
          <Group id="again" open={open.again} name="Write again" count={againList.length} onToggle={onToggleGroup}
            art={<span className="art ic"><span className="ms">replay</span></span>}>
            {againList.map(l => (
              <Item key={l.id} lesson={l} again done onPick={onPick} current={inAgainNow && l.id === currentId} />
            ))}
          </Group>
        )}
        {stages.map(s => {
          const done = s.lessons.filter(l => isDone(l.id)).length
          return (
            <Group key={s.id} id={s.id} open={open[s.id]} name={s.name} count={`${done}/${s.lessons.length}`}
              onToggle={onToggleGroup} art={<span className="art">{ART[s.art]}</span>}>
              {s.lessons.map(l => (
                <Item key={l.id} lesson={l} done={isDone(l.id)} due={isDue(l.id)} current={!inAgainNow && l.id === currentId}
                  justDone={justDone === l.id} onPick={onPick} />
              ))}
            </Group>
          )
        })}
      </nav>
    </aside>
  )
}
