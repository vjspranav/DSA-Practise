import { ART } from './art'
import { Brand, Group, Item, Overall, PathSwitch, TrackSwitch } from '../workbench/DrawerParts'

// The lesson list for a track. Optional extras (the Rust track uses them): `track`/`onTrack` for the C++ | Rust
// selector, `path`/`onPath` for the Learn | Revise selector under it (C++ track only), `stageArt(stage)` for a custom stage icon, `markOf(lesson)` for a per-kind marker, `legend`, `className`.
export default function Drawer({
  stages, total, doneCount, againList, isDone, isDue, currentId, inRedo, justDone, open, onToggleGroup, onPick, onMin, onTheme, onMode,
  overall = `${doneCount} of ${total} lessons done`, track, onTrack, path, onPath, stageArt, markOf, legend, className = '', emptyText = 'No lessons yet',
}) {
  const inAgainNow = inRedo && againList.some(a => a.id === currentId)
  return (
    <aside className={`drawer ${className}`.trim()}>
      <Brand mode="foundations" onMode={onMode} onMin={onMin} onTheme={onTheme} />
      {onTrack && <TrackSwitch track={track} onTrack={onTrack} />}
      {onPath && track === 'cpp' && <PathSwitch path={path} onPath={onPath} />}
      <Overall text={overall} pct={total ? doneCount / total * 100 : 0} />
      <nav className="nav">
        {againList.length > 0 && (
          <Group id="again" open={open.again} name="Write again" count={againList.length} onToggle={onToggleGroup}
            art={<span className="art ic"><span className="ms">replay</span></span>}>
            {againList.map(l => (
              <Item key={l.id} title={l.title} again done mark={markOf?.(l)} onPick={() => onPick(l.id, true)} current={inAgainNow && l.id === currentId} />
            ))}
          </Group>
        )}
        {stages.map(s => {
          const done = s.lessons.filter(l => isDone(l.id)).length
          return (
            <Group key={s.id} id={s.id} open={open[s.id]} name={s.name} count={`${done}/${s.lessons.length}`}
              onToggle={onToggleGroup} art={stageArt ? stageArt(s) : <span className="art">{ART[s.art]}</span>}>
              {s.lessons.length === 0 && <div className="item dim"><span className="ttl">{emptyText}</span></div>}
              {s.lessons.map(l => (
                <Item key={l.id} title={l.title} done={isDone(l.id)} due={isDue(l.id)} current={!inAgainNow && l.id === currentId}
                  justDone={justDone === l.id} mark={markOf?.(l)} onPick={() => onPick(l.id, false)} />
              ))}
            </Group>
          )
        })}
      </nav>
      {legend}
    </aside>
  )
}
