import Track from '../workbench/Track'
import RustWorkbench from './RustWorkbench'
import { STAGES, LESSONS } from './lessons'
import { useRustStore } from './useRustStore'
import './rust.css'

const STAGE_ICON = {
  basics: 'rocket_launch', ownership: 'key', types: 'category', sorting: 'swap_vert',
  build: 'construction', collections: 'inventory_2', algorithms: 'route',
}
const MARKS = { concept: { icon: 'school', label: 'Idea' }, predict: { icon: 'quiz', label: 'Predict' }, fix: { icon: 'build', label: 'Fix' } }

const legend = (
  <div className="legend">
    {Object.values(MARKS).map(m => <span key={m.label}><span className="ms">{m.icon}</span>{m.label}</span>)}
    <span>No mark: write the code</span>
  </div>
)

// The Rust track: its own progress store, the shared Track frame, the Rust workbench.
export default function RustTrack({ prefs, onMode, onTrack }) {
  const store = useRustStore(prefs)
  const done = LESSONS.filter(l => store.rec(l.id).passedAt).length
  const drawerProps = {
    track: 'rust', onTrack, className: 'wrap', legend, emptyText: 'Lessons are on the way',
    overall: `Rust · ${done} of ${LESSONS.length} done`,
    stageArt: s => <span className="art ic"><span className="ms">{STAGE_ICON[s.id] ?? 'code'}</span></span>,
    markOf: l => MARKS[l.kind],
  }
  return (
    <Track prefs={prefs} store={store} stages={STAGES} lessons={LESSONS} Workbench={RustWorkbench}
      shellClass="rs" drawerProps={drawerProps} onMode={onMode} />
  )
}
