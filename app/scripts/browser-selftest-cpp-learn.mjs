#!/usr/bin/env node
// Browser self-test for the C++ Learn path: real in-browser clang 8, real UI, headless Chrome over CDP.
// Usage: node scripts/browser-selftest-cpp-learn.mjs [--all | --stage N] [--limit N]
//   default sample: the first lesson of each kind in each stage; --limit N adds N more; --all runs every lesson.
// Uses the dev server already on :5173 when there is one, otherwise starts its own on :5197.
// Cases: 1 solutions pass, 2 fix starters / predict error rounds, 3 tle + crash + include-missing (miss count),
//        4 Revise storage untouched by Learn, 5 default path + export/import round trip.
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { LESSONS } from '../src/data/cpp-learn/index.js'
import { LESSONS as REVISE } from '../src/data/foundations/index.js'

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const args = process.argv.slice(2)
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null }
const DBG = 9379
const sleep = ms => new Promise(r => setTimeout(r, ms))
const failures = []
const check = (name, ok, detail = '') => { console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${ok || !detail ? '' : '\n      ' + detail}`); if (!ok) failures.push(name) }

let BASE = 'http://localhost:5173', vite = null
try { await fetch(BASE) } catch { BASE = 'http://localhost:5197'; vite = spawn('npx', ['vite', '--port', '5197', '--strictPort'], { stdio: 'ignore' }); await sleep(4000) }
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cl-chrome-'))}`,
  '--no-first-run', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' })
const stop = code => { vite?.kill(); chrome.kill(); process.exit(code) }

let page
for (let i = 0; i < 20 && !page; i++) {
  try { page = (await (await fetch(`http://127.0.0.1:${DBG}/json`)).json()).find(p => p.type === 'page') } catch { /* not up yet */ }
  if (!page) await sleep(1000)
}
if (!page) { console.error('Could not reach Chrome'); stop(1) }
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(r => (ws.onopen = r))
let nid = 0
const send = (method, params = {}) => new Promise(resolve => {
  const mine = ++nid
  const on = e => { const m = JSON.parse(e.data); if (m.id === mine) { ws.removeEventListener('message', on); resolve(m.result) } }
  ws.addEventListener('message', on)
  ws.send(JSON.stringify({ id: mine, method, params }))
})
const ev = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }))?.result?.value
const nav = async url => { await send('Page.navigate', { url }); await sleep(1500) }
async function waitFor(expr, ms = 60000) {
  const end = Date.now() + ms
  while (Date.now() < end) { if (await ev(expr)) return true; await sleep(400) }
  return false
}
// Fresh page with these localStorage entries, then the app opened (compiler ready) in 'ui' mode.
async function openWith(entries) {
  await nav(`${BASE}/?blank`)
  await ev(`localStorage.clear(); ${Object.entries(entries).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(typeof v === 'string' ? v : JSON.stringify(v))})`).join(';')}; 0`)
  await nav(`${BASE}/?cppLearnSelfTest=ui`)
  await waitFor('window.__cppLearnSelfTest?.ready === true', 90000)
}
const store = key => ev(`localStorage.getItem(${JSON.stringify(key)})`)
const rec = async id => JSON.parse((await store('dsa-cpp-learn')) ?? '{}').lessons?.[id] ?? {}
const pathTab = () => ev(`document.querySelector('.trk[aria-label="Learn or Revise"] [aria-selected="true"]')?.textContent ?? null`)
const clickText = (sel, text) => ev(`(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find(x => x.textContent.includes(${JSON.stringify(text)})); b?.click(); return !!b })()`)
const clickCheck = () => clickText('.ed-h .btn.fill', 'Check my code')
const resultsText = () => ev(`document.querySelector('.fold.open .res')?.textContent ?? ''`)

const sum = LESSONS.find(l => l.kind === 'program')
const REVISE_PASSED = { theme: 'light', lessons: { [REVISE[0].id]: { passedAt: 1700000000000, misses: 0, code: null } }, last: REVISE[1].id, open: {} }

// ---- Cases 1, 2, 3 (runner level), inside the page ----
const q = args.includes('--all') ? 'all=1' : `limit=${opt('--limit') ?? 0}${opt('--stage') ? `&stage=${opt('--stage')}` : ''}`
await nav(`${BASE}/?cppLearnSelfTest=run&${q}`)
let state, seen = 0
for (let i = 0; i < 900; i++) {
  await sleep(2000)
  state = JSON.parse((await ev('JSON.stringify(window.__cppLearnSelfTest ?? null)')) ?? 'null')
  if (!state) { if (i > 25) break; continue }   // the page never set up its results: stop waiting
  for (const r of state.results.slice(seen)) {
    check(r.id, !r.fails.length, r.fails.join('\n      '))
    for (const w of r.warns) console.log(`warn  ${r.id}: ${w}`)
  }
  seen = state.results.length
  if (state.done) break
}
if (!state?.done) check('in-page cases finished', false, 'timed out or the page did not load (is the Learn UI in place?)')

// ---- Case 3 (UI): a starter missing its include shows a compile error and the miss count is unchanged ----
if (state?.done) {
  const noInclude = sum.solution.replace(/#include <iostream>\n?/, '')
  await openWith({ 'dsa-cpp-learn': { last: sum.id, lessons: { [sum.id]: { code: noInclude } } }, 'dsa-cpp-path': 'learn' })
  const clicked = await clickCheck()
  const shown = await waitFor(`/Does not compile/.test(document.querySelector('.fold.open .res')?.textContent ?? '')`, 60000)
  const r = await rec(sum.id)
  check('missing include: compile error shown', clicked && shown, await resultsText())
  check('missing include: miss count unchanged', !r.misses && !r.passedAt, JSON.stringify(r))
  // and a wrong answer IS a miss
  await openWith({ 'dsa-cpp-learn': { last: sum.id, lessons: { [sum.id]: { code: '#include <iostream>\nint main() { std::cout << "wrong"; return 0; }' } } }, 'dsa-cpp-path': 'learn' })
  await clickCheck()
  await waitFor(`/passed|Output|expected/i.test(document.querySelector('.fold.open .res')?.textContent ?? '')`, 60000)
  await waitFor(`JSON.parse(localStorage.getItem('dsa-cpp-learn') ?? '{}').lessons?.['${sum.id}']?.misses === 1`, 10000)
  check('wrong answer: counted as one miss', (await rec(sum.id)).misses === 1, JSON.stringify(await rec(sum.id)))

  // ---- Case 5a: default path ----
  await openWith({})
  check('empty storage opens Learn and saves it', (await pathTab()) === 'Learn' && (await store('dsa-cpp-path')) === 'learn', `${await pathTab()} / ${await store('dsa-cpp-path')}`)
  await openWith({ 'dsa-foundations': REVISE_PASSED })
  check('a passed Revise lesson (no saved path) opens Revise and saves it', (await pathTab()) === 'Revise' && (await store('dsa-cpp-path')) === 'revise', `${await pathTab()} / ${await store('dsa-cpp-path')}`)

  // ---- Case 4: Revise storage is byte-identical after passing a Learn lesson ----
  await openWith({ 'dsa-foundations': REVISE_PASSED, 'dsa-cpp-path': 'revise', 'dsa-cpp-learn': { last: sum.id, lessons: { [sum.id]: { code: sum.solution } } } })
  const before = await store('dsa-foundations')
  await clickText('.trk[aria-label="Learn or Revise"] button', 'Learn')
  await waitFor(`!!document.querySelector('.ed-h .btn.fill')`, 15000)
  await clickCheck()
  const passed = await waitFor(`!!JSON.parse(localStorage.getItem('dsa-cpp-learn') ?? '{}').lessons?.['${sum.id}']?.passedAt`, 60000)
  check('Learn: the reference solution passes in the UI', passed, await resultsText())
  await clickText('.trk[aria-label="Learn or Revise"] button', 'Revise')
  await waitFor(`!document.querySelector('.fnd.rs')`, 10000)
  await clickText('.trk[aria-label="Learn or Revise"] button', 'Learn')
  await waitFor(`!!document.querySelector('.fnd.rs')`, 10000)
  check('Revise storage (dsa-foundations) byte-identical after Learn', (await store('dsa-foundations')) === before, 'it changed')

  // ---- Case 5c: export, clear, import restores dsa-cpp-learn and dsa-cpp-path ----
  const learn = await store('dsa-cpp-learn'), pathKey = await store('dsa-cpp-path')
  const cleared = await ev(`(async () => {
    const b = await import('/src/workbench/backup.js')
    const backup = await b.readBackup(new File([JSON.stringify(b.buildBackup())], 'backup.json'))
    localStorage.clear()
    const empty = localStorage.length === 0
    b.applyBackup(backup)
    return empty
  })()`)
  await sleep(2500)
  check('export, clear, import: storage was cleared first', cleared === true)
  check('import restores dsa-cpp-learn', (await store('dsa-cpp-learn')) === learn, 'differs')
  check('import restores dsa-cpp-path', (await store('dsa-cpp-path')) === pathKey && pathKey === 'learn', `${pathKey} -> ${await store('dsa-cpp-path')}`)
}

console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nAll C++ Learn browser checks passed')
stop(failures.length ? 1 : 0)
