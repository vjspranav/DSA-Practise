import { ripple } from './motion'
import './workbench.css'

// The frame both modes live in: themed root, drawer column + main area. Collapsed state and theme come from the shared prefs.
export default function Shell({ prefs, children }) {
  return (
    <div className={`fnd${prefs.state.min ? ' min' : ''}`} data-theme={prefs.state.theme} onPointerDown={ripple}>
      {children}
    </div>
  )
}
