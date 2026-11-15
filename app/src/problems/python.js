// Pyodide, loaded the first time Problems mode needs it (Foundations never does).
let loading = null

export function loadPython() {
  loading ??= import('pyodide')
    .then(({ loadPyodide }) => loadPyodide({ indexURL: '/node_modules/pyodide/' }))
    .catch(err => { loading = null; throw err })
  return loading
}

// Drop Pyodide's own frames so a traceback starts at the learner's code.
const tidy = msg => {
  const at = msg.indexOf('  File "<exec>"')
  return at >= 0 ? 'Traceback (most recent call last):\n' + msg.slice(at) : msg
}

// Runs `code` in a fresh namespace. Resolves { lines: [{ text, cls }], error } where `error` is the traceback or null.
export async function runPython(code) {
  const py = await loadPython()
  const lines = []
  py.setStdout({ batched: s => lines.push({ text: s + '\n', cls: 'stdout' }) })
  py.setStderr({ batched: s => lines.push({ text: s + '\n', cls: 'stderr' }) })
  const globals = py.globals.get('dict')()
  try {
    await py.runPythonAsync(code, { globals })
    return { lines, error: null }
  } catch (err) {
    return { lines, error: tidy((err.message || String(err)).trim()) }
  } finally {
    globals.destroy()
  }
}
