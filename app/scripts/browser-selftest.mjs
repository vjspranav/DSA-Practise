#!/usr/bin/env node
// Runs every lesson's reference solution in the real in-browser compiler (headless Chrome).
// Usage: node scripts/browser-selftest.mjs [id-prefix]   (needs Google Chrome installed)
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 5199, DBG = 9377, prefix = process.argv[2] ?? '1'
const sleep = ms => new Promise(r => setTimeout(r, ms))

const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'fnd-chrome-'))}`,
  '--no-first-run', `http://localhost:${PORT}/?fndSelfTest=${prefix}`], { stdio: 'ignore' })
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
for (let i = 0; i < 900; i++) {
  await sleep(2000)
  state = JSON.parse((await evaluate('JSON.stringify(window.__fndSelfTest ?? null)')) ?? 'null')
  if (!state) continue
  for (const r of state.results.slice(seen)) console.log(`${r.fails.length ? 'FAIL' : 'ok  '}  ${r.id}  slowest ${r.slowestMs}ms${r.fails.length ? '\n      ' + r.fails.join('\n      ') : ''}`)
  seen = state.results.length
  if (state.done) break
}
const bad = state?.results.filter(r => r.fails.length).length ?? -1
console.log(state?.done ? `\n${state.results.length - bad} of ${state.results.length} lessons ok in the browser` : '\nTimed out')
stop(state?.done && !bad ? 0 : 1)
