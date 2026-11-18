import { useState } from 'react'
import { useWasmClang } from './runtime/useWasmClang'
import { useFoundationsStore } from './foundations/useFoundationsStore'
import Foundations from './foundations/Foundations'
import RustTrack from './rust/RustTrack'
import CppLearnTrack from './cpp-learn/CppLearnTrack'
import Problems from './problems/Problems'

const MODE_KEY = 'dsa-mode'
const TRACK_KEY = 'dsa-track'
const PATH_KEY = 'dsa-cpp-path'

function read(key) { try { return localStorage.getItem(key) } catch { return null } }
function write(key, v) { try { localStorage.setItem(key, v) } catch { /* storage blocked */ } }

// Learn | Revise inside the C++ track. With no saved choice, Learn is the default until a Revise lesson has been passed.
function initialPath() {
  const saved = read(PATH_KEY)
  if (saved === 'learn' || saved === 'revise') return saved
  try {
    const lessons = JSON.parse(read('dsa-foundations'))?.lessons ?? {}
    return Object.values(lessons).some(r => r?.passedAt) ? 'revise' : 'learn'
  } catch { return 'learn' }
}

export default function App() {
  const [mode, setMode] = useState(() => read(MODE_KEY) === 'problems' ? 'problems' : 'foundations')
  const [track, setTrack] = useState(() => read(TRACK_KEY) === 'rust' ? 'rust' : 'cpp')
  const [path, setPath] = useState(initialPath)
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

  function switchPath(next) {
    write(PATH_KEY, next)
    setPath(next)
  }

  if (mode === 'problems') return <Problems prefs={store} onMode={switchMode} />
  return track === 'rust'
    ? <RustTrack prefs={store} onMode={switchMode} onTrack={switchTrack} />
    : path === 'learn'
      ? <CppLearnTrack prefs={store} onMode={switchMode} onTrack={switchTrack} path={path} onPath={switchPath} />
      : <Foundations store={store} onMode={switchMode} onTrack={switchTrack} path={path} onPath={switchPath} />
}
