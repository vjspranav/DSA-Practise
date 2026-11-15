import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)

// Dev-only self-test of every lesson in the real in-browser compiler (see scripts/browser-selftest.mjs).
if (import.meta.env.DEV && new URLSearchParams(location.search).has('fndSelfTest')) {
  import('./foundations/selftest.js').then(m => m.runSelfTest())
}
