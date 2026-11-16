import { ripple } from './motion'
import './workbench.css'

// The frame both modes live in: themed root, drawer column + main area. Collapsed state and theme come from the shared prefs.
// `className` adds a variant (the Rust track uses 'rs').
export default function Shell({ prefs, className = '', children }) {
  return (
    <div className={`fnd${prefs.state.min ? ' min' : ''}${className ? ' ' + className : ''}`} data-theme={prefs.state.theme} onPointerDown={ripple}>
      {children}
    </div>
  )
}
