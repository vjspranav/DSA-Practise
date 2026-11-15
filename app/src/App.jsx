import { useState } from 'react'
import { useWasmClang } from './runtime/useWasmClang'
import { useFoundationsStore } from './foundations/useFoundationsStore'
import Foundations from './foundations/Foundations'
import Problems from './problems/Problems'

const MODE_KEY = 'dsa-mode'

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem(MODE_KEY) === 'problems' ? 'problems' : 'foundations')
  // One compiler worker and one set of shared prefs (theme, collapsed drawer, open groups) for both modes.
  useWasmClang()
  const store = useFoundationsStore()

  function switchMode(next) {
    localStorage.setItem(MODE_KEY, next)
    setMode(next)
  }

  return mode === 'problems'
    ? <Problems prefs={store} onMode={switchMode} />
    : <Foundations store={store} onMode={switchMode} />
}
