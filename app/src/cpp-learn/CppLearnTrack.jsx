import Track from '../workbench/Track'
import CppLearnWorkbench from './CppLearnWorkbench'
import { STAGES, LESSONS } from './lessons'
import { useCppLearnStore } from './useCppLearnStore'
import '../rust/rust.css'
import './cpp-learn.css'

const STAGE_ICON = {
  basics: 'rocket_launch', control: 'alt_route', functions: 'function', sequences: 'data_array',
  memory: 'memory', classes: 'deployed_code', stl: 'inventory_2', dsa: 'route',
}
const MARKS = {
  concept: { icon: 'school', label: 'Idea' }, predict: { icon: 'quiz', label: 'Predict' }, fix: { icon: 'build', label: 'Fix' },
}

const legend = (
  <div className="legend">
    {Object.values(MARKS).map(m => <span key={m.label}><span className="ms">{m.icon}</span>{m.label}</span>)}
    <span>No mark: write the code</span>
  </div>
)

// The Learn path of the C++ track: its own progress store, the shared Track frame, the Learn workbench.
// It reuses the Rust track's look (shell class `rs`), so the two teach-first tracks stay one design.
export default function CppLearnTrack({ prefs, onMode, onTrack, path, onPath }) {
  const store = useCppLearnStore(prefs)
  const done = LESSONS.filter(l => store.rec(l.id).passedAt).length
  const drawerProps = {
    track: 'cpp', onTrack, path, onPath, className: 'wrap', legend, emptyText: 'Lessons are on the way',
    overall: `C++ · ${done} of ${LESSONS.length} done`,
    stageArt: s => <span className="art ic"><span className="ms">{STAGE_ICON[s.id] ?? 'code'}</span></span>,
    markOf: l => MARKS[l.kind],
  }
  return (
    <Track prefs={prefs} store={store} stages={STAGES} lessons={LESSONS} Workbench={CppLearnWorkbench}
      shellClass="rs cl" drawerProps={drawerProps} onMode={onMode} />
  )
}
