// Shared data and helpers for the three v3 mockups. Nothing here runs real code.
const $ = id => document.getElementById(id)
const P = 'program', I = 'implement', D = 'drill', B = 'bugfix'
const KIND = { program: 'Write the whole program', implement: 'Write the function', drill: 'Quick drill', bugfix: 'Find the bug' }
const KIND_ICON = { program: 'terminal', implement: 'function', drill: 'bolt', bugfix: 'bug_report' }

const STAGES = [
  { name: 'C++ warm-up', blurb: 'Input, loops, references, structs', lessons: [
    ['Sum of N numbers', P], ['Read until the input ends', P], ['Count the vowels', P], ['Swap: value or reference', I], ['Reverse a vector', I], ['Is it a palindrome?', I],
    ['A struct of students', I], ['Pointers and arrays', I], ['Walk a 2D grid', I], ['Print a number triangle', P], ['The average is always 0', B], ['The copy that never changed', B]] },
  { name: 'Sort and search by hand', blurb: 'The classics, typed out yourself', lessons: [
    ['Bubble sort', I], ['Selection sort', I], ['Insertion sort', I], ['Merge sort', I], ['Quick sort', I], ['Counting sort', I], ['Binary search', I], ['Lower and upper bound', I], ['Binary search never ends', B], ['Sort student records', P]] },
  { name: 'Build it yourself', blurb: 'Your own vector, heap, hash map, graph', lessons: [
    ['Dynamic array', I], ['Linked list', I], ['Reverse a linked list', I], ['Stack', I], ['Circular queue', I], ['Min-heap', I], ['Hash map', I], ['Binary search tree', I], ['Delete from a BST', I], ['Graph and BFS', I], ['DFS', I], ['Union-find', I]] },
  { name: 'The standard library', blurb: 'Short STL drills, one feature each', lessons: [
    ['vector basics', D], ['sort with a lambda', D], ['pair and tuple', D], ['string tools', D], ['set', D], ['multiset', D], ['map', D], ['unordered_map', D], ['stack and queue', D], ['deque', D], ['priority_queue', D], ['priority_queue, your order', D],
    ['lower_bound', D], ['Iterators', D], ['Erase while looping', D], ['accumulate and friends', D], ['min and max element', D], ['reverse and rotate', D], ['unique', D], ['next_permutation', D], ['The iterator that went stale', B], ['The comparator that crashes sort', B]] },
  { name: 'Algorithms', blurb: 'Recursion, graphs, dynamic programming', lessons: [
    ['Subsets', I], ['Permutations', I], ['N-Queens', I], ['Prefix sums', I], ['2D prefix sums', I], ['Two pointers', I], ['Sliding window', I], ['Binary search on the answer', I], ['BFS on a grid', I], ['Count components', I], ['Cycle detection', I],
    ['Topological sort', I], ['Dijkstra', I], ['Bellman-Ford', I], ['Kruskal', I], ['Climbing stairs', I], ['House robber', I], ['Coin change', I], ['0/1 knapsack', I], ['Longest increasing subsequence', I], ['Longest common subsequence', I], ['Edit distance', I]] },
].map((s, si) => ({ ...s, i: si, lessons: s.lessons.map(([title, kind], li) => ({ id: `${si + 1}.${li + 1}`, title, kind, s: si })) }))

const ALL = STAGES.flatMap(s => s.lessons)
ALL.forEach((l, i) => { l.done = i < 15; l.redo = l.id === '1.4' || l.id === '2.3' })
const byId = id => ALL.find(l => l.id === id)
const nextLesson = () => ALL.find(l => !l.done)
const lessonAfter = l => ALL[ALL.indexOf(l) + 1]
const stageDone = s => s.lessons.filter(l => l.done).length
const totalDone = () => ALL.filter(l => l.done).length
const redoList = () => ALL.filter(l => l.redo)

// One small picture per stage, drawn from what the stage teaches.
const ART = [
  `<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="12" width="10" height="16" rx="3"/><rect x="15" y="12" width="10" height="16" rx="3"/><rect x="27" y="12" width="10" height="16" rx="3" fill="currentColor"/><rect x="39" y="12" width="10" height="16" rx="3"/><rect x="51" y="12" width="10" height="16" rx="3"/></svg>`,
  `<svg viewBox="0 0 64 40" fill="currentColor"><rect x="4" y="28" width="8" height="8" rx="2"/><rect x="16" y="22" width="8" height="14" rx="2"/><rect x="28" y="16" width="8" height="20" rx="2"/><rect x="40" y="10" width="8" height="26" rx="2"/><rect x="52" y="4" width="8" height="32" rx="2"/></svg>`,
  `<svg viewBox="0 0 64 40" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M32 7 16 20M32 7l16 13M16 20 8 33M16 20l8 13M48 20l-8 13" fill="none"/><circle cx="32" cy="7" r="4"/><circle cx="16" cy="20" r="4"/><circle cx="48" cy="20" r="4"/><circle cx="8" cy="33" r="3.5"/><circle cx="24" cy="33" r="3.5"/><circle cx="40" cy="33" r="3.5"/></svg>`,
  `<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="14" height="14" rx="4"/><rect x="25" y="4" width="14" height="14" rx="4" fill="currentColor"/><rect x="44" y="4" width="14" height="14" rx="4"/><rect x="6" y="22" width="14" height="14" rx="4" fill="currentColor"/><rect x="25" y="22" width="14" height="14" rx="4"/><rect x="44" y="22" width="14" height="14" rx="4"/></svg>`,
  `<svg viewBox="0 0 64 40" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M10 10 30 6 52 14 44 32 20 32 10 10M30 6 20 32M52 14 20 32" fill="none"/><circle cx="10" cy="10" r="4"/><circle cx="30" cy="6" r="4"/><circle cx="52" cy="14" r="4"/><circle cx="44" cy="32" r="4"/><circle cx="20" cy="32" r="4"/></svg>`,
]

const SAMPLE = {
  task: 'Sort the vector in ascending order. <code class="i">std::sort</code> is off the table.',
  refresher: ['Split the range in half and sort each half.', '<b>Merge</b> with two read pointers: always take the smaller front value, then copy whatever is left.', 'One element is already sorted.'],
  hints: ['Write <code class="i">merge</code> first and trace it on <code class="i">[2 5 | 1 9]</code>.', 'Use half-open ranges <code class="i">[lo, hi)</code> everywhere.', 'After the main loop, one half still has values in it.'],
  code: `void merge(vector<int>& a, int lo, int mid, int hi) {
    vector<int> tmp;
    int i = lo, j = mid;
    while (i < mid && j < hi) {
        if (a[i] <= a[j]) tmp.push_back(a[i++]);
        else tmp.push_back(a[j++]);
    }
    ▮
    for (int k = 0; k < (int)tmp.size(); k++) a[lo + k] = tmp[k];
}

void mergeSort(vector<int>& a, int lo, int hi) {
    if (hi - lo <= 1) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid);
    mergeSort(a, mid, hi);
    merge(a, lo, mid, hi);
}`,
  fix: ['    while (i < mid) tmp.push_back(a[i++]);', '    while (j < hi) tmp.push_back(a[j++]);'],
  answer: `void merge(vector<int>& a, int lo, int mid, int hi) {
    vector<int> tmp;
    tmp.reserve(hi - lo);
    int i = lo, j = mid;
    while (i < mid && j < hi)
        tmp.push_back(a[i] <= a[j] ? a[i++] : a[j++]);
    while (i < mid) tmp.push_back(a[i++]);
    while (j < hi) tmp.push_back(a[j++]);
    copy(tmp.begin(), tmp.end(), a.begin() + lo);
}`,
  tests: 6,
  fails: { 2: '<b>input</b>     5 2 9 1\n<b>expected</b>  1 2 5 9\n<b>got</b>       <u>1 2 9 1</u>', 4: '<b>input</b>     9 8 7 6 5\n<b>expected</b>  5 6 7 8 9\n<b>got</b>       <u>5 6 7 6 5</u>', 5: '<b>input</b>     100 000 random values\n<b>got</b>       <u>not sorted</u>' },
}
const GENERIC = {
  task: 'Placeholder lesson for the mockup. Merge sort (2.4) is the one that is filled in.',
  refresher: ['Two or three lines to jog your memory go here.'], hints: ['First nudge.', 'Second nudge.'],
  code: '▮', fix: ['// your code'], answer: '// reference answer', tests: 4, fails: { 1: '<b>expected</b>  …\n<b>got</b>       <u>…</u>' },
}
const content = l => l.id === '2.4' ? SAMPLE : GENERIC
const newState = () => ({ attempts: 0, passed: false, hints: 1, lastHint: 0 })

const hl = src => src.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/\b(int|long|void|bool|return|while|for|if|else|struct|const|auto)\b/g, '<span class="k">$1</span>')
  .replace(/\b(vector|string|copy)\b/g, '<span class="t">$1</span>')
function codeHTML(L, fixed) {
  let n = 0
  return L.code.split('\n').flatMap(line => {
    if (line.includes('▮') && fixed) return L.fix.map(f => `<div class="ln new"><span>${++n}</span><span>${hl(f)}</span></div>`)
    return [`<div class="ln"><span>${++n}</span><span>${hl(line).replace('▮', '<span class="caret"></span>')}</span></div>`]
  }).join('')
}
const plainCode = src => src.split('\n').map((l, i) => `<div class="ln"><span>${i + 1}</span><span>${hl(l)}</span></div>`).join('')

// Pretend to run the tests: the first check misses, the second passes.
function simulate(L, st) {
  const win = st.attempts >= 1
  if (win) st.passed = true; else st.attempts++
  return { win, tests: Array.from({ length: L.tests }, (_, i) => ({ ok: win || !L.fails[i], detail: L.fails[i] })) }
}
function resultsHTML(res) {
  if (!res) return ''
  const ok = res.tests.filter(t => t.ok).length
  return `<div class="tests">${res.tests.map((t, i) => `<button class="test ${t.ok ? 'ok' : 'bad'}" style="animation-delay:${i * 60}ms" ${t.ok ? 'tabindex="-1"' : `data-act="test" data-i="${i}"`}><span class="ms">${t.ok ? 'check' : 'close'}</span>Test ${i + 1}</button>`).join('')}
    <span class="summary${res.win ? ' win' : ''}">${res.win ? 'All passed' : `${ok} of ${res.tests.length} passed`}</span></div>
    <div class="fold" id="detailFold"><div><div class="detail" id="detail"></div></div></div>`
}
function toggleDetail(res, i, btn) {
  const fold = $('detailFold'), was = btn.classList.contains('sel')
  document.querySelectorAll('.test.sel').forEach(b => b.classList.remove('sel'))
  if (!was) { btn.classList.add('sel'); $('detail').innerHTML = res.tests[i].detail }
  fold.classList.toggle('open', !was)
}
const answerOpen = st => st.passed || st.attempts >= 3
function helpHTML(L, tab, st) {
  if (tab === 'refresher') return `<ul class="refresher">${L.refresher.map(r => `<li><span>${r}</span></li>`).join('')}</ul>`
  if (tab === 'hints') return `<div class="hints">${L.hints.slice(0, st.hints).map((h, i) => `<div class="hint${i === st.lastHint && i ? ' fresh' : ''}"><b>${i + 1}</b><span>${h}</span></div>`).join('')}
    ${st.hints < L.hints.length ? '<button class="btn text" data-act="hint" style="justify-self:start"><span class="ms">lightbulb</span>Show another hint</button>' : ''}</div>`
  return answerOpen(st)
    ? `<div class="answer"><div class="answer-h"><span class="ms">lock_open</span>${st.passed ? 'Unlocked. Compare it with yours.' : 'Unlocked after three misses.'}</div><div class="codeview">${plainCode(L.answer)}</div></div>`
    : `<div class="lockrow"><span class="ms">lock</span><span>Opens when you pass, or after three misses.</span><span class="tries">${[0, 1, 2].map(i => `<i class="${i < st.attempts ? 'used' : ''}"></i>`).join('')}</span></div>`
}

// Fluid transitions between screens (falls back to an instant swap).
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
function vt(fn) {
  if (!document.startViewTransition || calm) { fn(); return Promise.resolve() }
  return document.startViewTransition(fn).finished.catch(() => {})
}
// Morph one element into another across a re-render.
function morph(fromEl, render, toSel) {
  if (fromEl) fromEl.style.viewTransitionName = 'hero'
  return vt(() => { render(); const to = toSel && document.querySelector(toSel); if (to) to.style.viewTransitionName = 'hero' })
    .then(() => { const to = toSel && document.querySelector(toSel); if (to) to.style.viewTransitionName = '' })
}
function toggleTheme() { vt(() => { const h = document.documentElement; h.dataset.theme = h.dataset.theme === 'dark' ? 'light' : 'dark' }) }
const THEME_BTN = `<button class="iconbtn theme" data-act="theme" aria-label="Switch theme"><span class="ms to-dark">dark_mode</span><span class="ms to-light">light_mode</span></button>`

let snackTimer
function snack(html) { const s = $('snack'); s.innerHTML = html; s.classList.add('on'); clearTimeout(snackTimer); snackTimer = setTimeout(() => s.classList.remove('on'), 3200) }

document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn,.iconbtn,.rip'); if (!b || calm) return
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, ink = document.createElement('span')
  ink.className = 'ink'; ink.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`
  b.appendChild(ink); setTimeout(() => ink.remove(), 600)
})
if (location.hash.includes('dark')) document.documentElement.dataset.theme = 'dark'
