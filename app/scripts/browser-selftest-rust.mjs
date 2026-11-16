#!/usr/bin/env node
// Runs a small sample of Rust reference solutions through the real Rust Playground (headless Chrome), politely:
// one request at a time, 1.5 s apart. Usage: node scripts/browser-selftest-rust.mjs [id-prefix] [--limit N]  (default 8)
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const args = process.argv.slice(2)
const li = args.indexOf('--limit'), limit = li >= 0 ? args.splice(li, 2)[1] : '8'
const PORT = 5198, DBG = 9378, prefix = args[0] ?? '1'
const sleep = ms => new Promise(r => setTimeout(r, ms))

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'rust-chrome-'))}`,
  '--no-first-run', `http://localhost:${PORT}/?rustSelfTest=${prefix}&limit=${limit}`], { stdio: 'ignore' })
const stop = code => { vite.kill(); chrome.kill(); process.exit(code) }

await sleep(4000)
let page
for (let i = 0; i < 20 && !page; i++) {
  try { page = (await (await fetch(`http://127.0.0.1:${DBG}/json`)).json()).find(p => p.type === 'page' && p.url.includes(String(PORT))) } catch { /* not up yet */ }
  if (!page) await sleep(1000)
}
if (!page) { console.error('Could not reach Chrome or the dev server'); stop(1) }

const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(r => (ws.onopen = r))
let id = 0
const evaluate = expression => new Promise(resolve => {
  const mine = ++id
  const on = e => { const m = JSON.parse(e.data); if (m.id === mine) { ws.removeEventListener('message', on); resolve(m.result?.result?.value) } }
  ws.addEventListener('message', on)
  ws.send(JSON.stringify({ id: mine, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }))
})
await evaluate('location.reload()')   // make sure the page loaded after the dev server was ready

let state, seen = 0
for (let i = 0; i < 300; i++) {
  await sleep(2000)
  state = JSON.parse((await evaluate('JSON.stringify(window.__rustSelfTest ?? null)')) ?? 'null')
  if (!state) continue
  for (const r of state.results.slice(seen)) console.log(`${r.fails.length ? 'FAIL' : 'ok  '}  ${r.id}  ${r.ms}ms${r.fails.length ? '\n      ' + r.fails.join('\n      ') : ''}`)
  seen = state.results.length
  if (state.done) break
}
const bad = state?.results.filter(r => r.fails.length).length ?? -1
console.log(state?.done ? `\n${state.results.length - bad} of ${state.results.length} Rust lessons ok on the Playground` : '\nTimed out')
stop(state?.done && !bad ? 0 : 1)
