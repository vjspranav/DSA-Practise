// One small picture per stage, keyed by the stage's `art` field.
const P = { viewBox: '0 0 64 40' }
export const ART = {
  row: (
    <svg {...P} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="12" width="10" height="16" rx="3" /><rect x="15" y="12" width="10" height="16" rx="3" />
      <rect x="27" y="12" width="10" height="16" rx="3" fill="currentColor" /><rect x="39" y="12" width="10" height="16" rx="3" />
      <rect x="51" y="12" width="10" height="16" rx="3" />
    </svg>
  ),
  stairs: (
    <svg {...P} fill="currentColor">
      <rect x="4" y="28" width="8" height="8" rx="2" /><rect x="16" y="22" width="8" height="14" rx="2" />
      <rect x="28" y="16" width="8" height="20" rx="2" /><rect x="40" y="10" width="8" height="26" rx="2" />
      <rect x="52" y="4" width="8" height="32" rx="2" />
    </svg>
  ),
  tree: (
    <svg {...P} fill="currentColor" stroke="currentColor" strokeWidth="2">
      <path d="M32 7 16 20M32 7l16 13M16 20 8 33M16 20l8 13M48 20l-8 13" fill="none" />
      <circle cx="32" cy="7" r="4" /><circle cx="16" cy="20" r="4" /><circle cx="48" cy="20" r="4" />
      <circle cx="8" cy="33" r="3.5" /><circle cx="24" cy="33" r="3.5" /><circle cx="40" cy="33" r="3.5" />
    </svg>
  ),
  grid: (
    <svg {...P} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="4" width="14" height="14" rx="4" /><rect x="25" y="4" width="14" height="14" rx="4" fill="currentColor" />
      <rect x="44" y="4" width="14" height="14" rx="4" /><rect x="6" y="22" width="14" height="14" rx="4" fill="currentColor" />
      <rect x="25" y="22" width="14" height="14" rx="4" /><rect x="44" y="22" width="14" height="14" rx="4" />
    </svg>
  ),
  graph: (
    <svg {...P} fill="currentColor" stroke="currentColor" strokeWidth="2">
      <path d="M10 10 30 6 52 14 44 32 20 32 10 10M30 6 20 32M52 14 20 32" fill="none" />
      <circle cx="10" cy="10" r="4" /><circle cx="30" cy="6" r="4" /><circle cx="52" cy="14" r="4" />
      <circle cx="44" cy="32" r="4" /><circle cx="20" cy="32" r="4" />
    </svg>
  ),
}
