// Runs Rust on the official Rust Playground. One request at a time, never on keystrokes or page load.
// run() resolves { success, compiled, stdout, stderr } or rejects PlaygroundError with a plain message.

const URL = 'https://play.rust-lang.org/execute'
export const TIMEOUT_MS = 40000

export class PlaygroundError extends Error {
  constructor(kind, message) { super(message); this.kind = kind }   // kind: offline | timeout | busy | down | aborted
}

const MESSAGES = {
  offline: 'Could not reach the Rust Playground. Check your connection and try again.',
  timeout: 'The Rust Playground took too long to answer. Try again.',
  busy: 'The Rust Playground is busy right now (too many requests). Wait a moment and try again.',
  down: 'The Rust Playground did not answer. Try again.',
}
const fail = kind => new PlaygroundError(kind, MESSAGES[kind] ?? 'Cancelled.')

const body = code => JSON.stringify({ channel: 'stable', mode: 'debug', edition: '2021', crateType: 'bin', tests: false, backtrace: false, code })

async function request(code, signal) {
  const ctl = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; ctl.abort() }, TIMEOUT_MS)
  const onAbort = () => ctl.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    const res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body(code), signal: ctl.signal })
    if (res.status === 429) throw fail('busy')
    if (!res.ok) throw fail('down')
    let json
    try { json = await res.json() } catch { throw fail('down') }
    if (typeof json?.stderr !== 'string' && typeof json?.stdout !== 'string') throw fail('down')
    return json
  } catch (e) {
    if (e instanceof PlaygroundError) throw e
    if (signal?.aborted) throw fail('aborted')
    if (timedOut) throw fail('timeout')
    throw fail('offline')   // fetch rejects (TypeError) when the network is down or the request is blocked
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}

// Requests are chained: a second call waits for the first to finish, so two are never in flight.
let chain = Promise.resolve()
export function run(code, signal) {
  const p = chain.then(() => {
    if (signal?.aborted) throw fail('aborted')
    return request(code, signal)
  })
  chain = p.catch(() => {})
  return p.then(json => normalise(json))
}

// cargo prints "Running `target/debug/playground`" on stderr only once the program has started,
// so a failure without it is a compile error.
function normalise(r) {
  const stderr = String(r.stderr ?? '').replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g'), '')
  const started = /^\s*Running `target\/debug\/playground`/m.test(stderr)
  const ranOut = !r.success && started && /timed out|time limit|Killed/i.test(`${r.exitDetail ?? ''}\n${stderr}`) && !/panicked at/.test(stderr)
  return { success: !!r.success, compiled: !!r.success || started, timedOut: ranOut, stdout: String(r.stdout ?? ''), stderr }
}

// What the learner sees of a compile failure or warning: rustc's own text, minus cargo's lines.
const CARGO = [
  /^\s*(Compiling|Finished|Running|Blocking|Downloaded|Updating) /,
  /^error: could not compile `playground`/,
  /^warning: `playground` \(bin "playground"\)/,
]
export function rustcText(stderr) {
  return stderr.split('\n').filter(l => !CARGO.some(re => re.test(l))).join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
