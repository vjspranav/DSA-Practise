const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Apply a state update. Content changes are instant by design: the owner found page
// cross-fades and slide-ins distracting.
export function vt(update) { update() }

// Material-style ripple on buttons, attached to the .fnd root's onPointerDown.
export function ripple(e) {
  const b = e.target.closest?.('.btn,.iconbtn,.rip')
  if (!b || calm()) return
  const r = b.getBoundingClientRect()
  const d = Math.max(r.width, r.height) * 2.2
  const ink = document.createElement('span')
  ink.className = 'ink'
  ink.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`
  b.appendChild(ink)
  setTimeout(() => ink.remove(), 600)
}
