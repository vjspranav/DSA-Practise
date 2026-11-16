import { useState } from 'react'
import { useWasmClang } from './runtime/useWasmClang'
import { useFoundationsStore } from './foundations/useFoundationsStore'
import Foundations from './foundations/Foundations'
import RustTrack from './rust/RustTrack'
import Problems from './problems/Problems'

const MODE_KEY = 'dsa-mode'
const TRACK_KEY = 'dsa-track'

function read(key) { try { return localStorage.getItem(key) } catch { return null } }
function write(key, v) { try { localStorage.setItem(key, v) } catch { /* storage blocked */ } }

export default function App() {
  const [mode, setMode] = useState(() => read(MODE_KEY) === 'problems' ? 'problems' : 'foundations')
  const [track, setTrack] = useState(() => read(TRACK_KEY) === 'rust' ? 'rust' : 'cpp')
  // One compiler worker and one set of shared prefs (theme, collapsed drawer, open groups) for both modes.
  useWasmClang()
  const store = useFoundationsStore()

  function switchMode(next) {
    write(MODE_KEY, next)
    setMode(next)
  }
  function switchTrack(next) {
    write(TRACK_KEY, next)
    setTrack(next)
  }

  if (mode === 'problems') return <Problems prefs={store} onMode={switchMode} />
  return track === 'rust'
    ? <RustTrack prefs={store} onMode={switchMode} onTrack={switchTrack} />
    : <Foundations store={store} onMode={switchMode} onTrack={switchTrack} />
}
