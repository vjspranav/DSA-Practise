import { STAGES, LESSONS } from '../data/foundations'
import Workbench from './Workbench'
import Track from '../workbench/Track'
import './foundations.css'

// The C++ track. `store` is the shared state from App: lessons, plus the theme / collapsed drawer / open groups
// both modes use. `onTrack` switches to the Rust track.
export default function Foundations({ store, onMode, onTrack }) {
  return (
    <Track
      prefs={store} store={store} stages={STAGES} lessons={LESSONS} Workbench={Workbench} onMode={onMode}
      drawerProps={{ track: 'cpp', onTrack }}
    />
  )
}
