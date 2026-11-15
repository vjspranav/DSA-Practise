import { useEffect, useState } from 'react'
import { PROBLEMS, CATEGORIES } from '../data/problems'
import { usePracticeStore } from '../hooks/usePracticeStore'
import Shell from '../workbench/Shell'
import ProblemsDrawer from './ProblemsDrawer'
import ProblemWorkbench from './ProblemWorkbench'
import { loadPython } from './python'
import './problems.css'

const LAST_KEY = 'dsa-last-problem'
const HIDE_KEY = 'dsa-desc-hidden'

function read(key) { try { return localStorage.getItem(key) } catch { return null } }
function write(key, v) { try { localStorage.setItem(key, v) } catch { /* storage blocked */ } }

// `prefs` is the shared state from App: theme, collapsed drawer, open groups.
export default function Problems({ prefs, onMode }) {
  const [current, setCurrent] = useState(() => PROBLEMS.find(p => p.id === read(LAST_KEY)) ?? PROBLEMS[0])
  const [language, setLanguage] = useState('cpp')
  const [hidden, setHidden] = useState(() => read(HIDE_KEY) === '1')
  const { getCode, saveCode, getStatus, setStatus } = usePracticeStore()
  const { state, setGroup } = prefs

  useEffect(() => { loadPython().catch(() => {}) }, [])
  useEffect(() => { setGroup(current.category, true) }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  function pick(p) {
    write(LAST_KEY, p.id)
    setCurrent(p)
    setGroup(p.category, true)
  }
  function toggleHidden() {
    write(HIDE_KEY, hidden ? '0' : '1')
    setHidden(!hidden)
  }

  const inCat = PROBLEMS.filter(p => p.category === current.category)
  const progress = {
    label: CATEGORIES.find(c => c.id === current.category)?.label ?? '',
    total: inCat.length,
    done: inCat.filter(p => getStatus(p.id) === 'complete').length,
  }

  return (
    <Shell prefs={prefs}>
      <ProblemsDrawer
        categories={CATEGORIES} problems={PROBLEMS} getStatus={getStatus} currentId={current.id}
        open={state.open} onToggleGroup={prefs.toggleGroup} onPick={pick}
        onMin={prefs.toggleMin} onMode={onMode}
        onTheme={() => prefs.setTheme(state.theme === 'dark' ? 'light' : 'dark')}
      />
      <div className="main pmain">
        <ProblemWorkbench
          problem={current} language={language} onLanguage={setLanguage}
          code={getCode(current.id, language)} onCode={v => saveCode(current.id, language, v)}
          theme={state.theme} status={getStatus(current.id)}
          onStatus={s => setStatus(current.id, s)}
          onDone={id => setStatus(id, 'complete')}
          progress={progress} next={PROBLEMS[PROBLEMS.indexOf(current) + 1]} onNext={pick}
          hidden={hidden} onToggleHidden={toggleHidden}
        />
      </div>
    </Shell>
  )
}
