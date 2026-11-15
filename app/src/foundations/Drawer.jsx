import { ART } from './art'

function Bar({ pct }) {
  return <div className="bar-track"><i style={{ width: `${pct}%` }} /></div>
}

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

function Group({ id, open, art, name, count, onToggle, children }) {
  return (
    <div className={`grp${open ? ' open' : ''}`}>
      <button className="grp-h rip" onClick={() => onToggle(id)} title={name}>
        {art}<span className="n">{name}</span><small>{count}</small><span className="ms chev">expand_more</span>
      </button>
      <div className={`fold${open ? ' open' : ''}`}><div>{children}</div></div>
    </div>
  )
}

export default function Drawer({ stages, total, doneCount, againList, isDone, isDue, currentId, inRedo, justDone, open, onToggleGroup, onPick, onMin, onTheme, onSwitch }) {
  const inAgainNow = inRedo && againList.some(a => a.id === currentId)
  return (
    <aside className="drawer">
      <div className="brand">
        <button className="iconbtn" onClick={onMin} aria-label="Collapse or expand the lesson list"><span className="ms">menu</span></button>
        <b>Foundations</b>
        <button className="iconbtn theme" onClick={onTheme} aria-label="Switch theme">
          <span className="ms to-dark">dark_mode</span><span className="ms to-light">light_mode</span>
        </button>
      </div>
      <div className="overall"><span>{doneCount} of {total} lessons done</span><Bar pct={total ? doneCount / total * 100 : 0} /></div>
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
      <div className="drawer-foot">
        <button className="grp-h rip" onClick={onSwitch} title="Problem bank">
          <span className="art ic"><span className="ms">checklist</span></span>
          <span className="n">Problem bank</span><span className="ms chev go">arrow_forward</span>
        </button>
      </div>
    </aside>
  )
}
