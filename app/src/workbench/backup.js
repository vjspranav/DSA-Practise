// Export / import of everything the app keeps in localStorage (code, progress, prefs), so it can move between browsers.
// A key is part of a backup if it starts with one of BACKUP_PREFIXES (so future dsa-* / rust-* keys are included
// automatically) or is listed in BACKUP_EXTRA_KEYS (none today: every key the app uses already matches a prefix).
//   dsa-code, dsa-status, dsa-last-problem, dsa-desc-hidden, dsa-foundations (also holds theme/drawer prefs),
//   dsa-rust, dsa-mode, dsa-track, dsa-cpp-learn, dsa-cpp-path, dsa-cpp-learn-folded, rust-teach-folded
export const BACKUP_PREFIXES = ['dsa-', 'rust-']
export const BACKUP_EXTRA_KEYS = []
export const BACKUP_APP = 'dsa-practice'
export const BACKUP_VERSION = 1

export const isBackupKey = key =>
  BACKUP_EXTRA_KEYS.includes(key) || BACKUP_PREFIXES.some(p => key.startsWith(p))

export const NOT_A_BACKUP = "This isn't a DSA progress file."

export function buildBackup() {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && isBackupKey(k)) data[k] = localStorage.getItem(k)
  }
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data }
}

export function exportProgress() {
  const backup = buildBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dsa-progress-${backup.exportedAt.slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return Object.keys(backup.data).length
}

// Reads and validates a file; resolves to the parsed backup or throws Error(message).
export async function readBackup(file) {
  let b
  try { b = JSON.parse(await file.text()) } catch { throw new Error(NOT_A_BACKUP) }
  const ok = b && typeof b === 'object' && b.app === BACKUP_APP && b.version === BACKUP_VERSION
    && b.data && typeof b.data === 'object' && !Array.isArray(b.data)
    && Object.entries(b.data).every(([k, v]) => typeof v === 'string' && isBackupKey(k))
  if (!ok) throw new Error(NOT_A_BACKUP)
  return b
}

// Writes the keys present in the backup (others stay) and reloads so every store re-reads.
export function applyBackup(backup) {
  try {
    for (const [k, v] of Object.entries(backup.data)) localStorage.setItem(k, v)
  } catch {
    throw new Error("Couldn't write to this browser's storage.")
  }
  location.reload()
}

export async function importProgress(file) {
  applyBackup(await readBackup(file))
}
