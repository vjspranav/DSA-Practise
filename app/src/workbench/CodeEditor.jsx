import Editor from '@monaco-editor/react'

const THEMES = {
  'fnd-light': { base: 'vs', k: '7b3fc4', s: 'b25a00', c: '8f9bb3', bg: '#ffffff', fg: '#1c2230', num: '#a7b1c4', cur: '#f1f5fc', accent: '#1a56c4', sel: '#1a56c433' },
  'fnd-dark': { base: 'vs-dark', k: 'cfa8ff', s: 'ffc078', c: '5e6a85', bg: '#12151d', fg: '#dce2ef', num: '#4b556b', cur: '#1a1f2b', accent: '#a9c6fb', sel: '#a9c6fb35' },
}

const WORDS = `auto bool break case char class const continue default delete do double else enum false float for if
int long namespace new nullptr private public return short signed sizeof static struct switch template this true typedef
unsigned using void while include iostream vector string map set unordered_map unordered_set queue stack deque
priority_queue pair tuple algorithm numeric cin cout endl getline std size_t push_back pop_back emplace_back push pop
top front back begin end rbegin rend size empty clear insert erase find count first second sort reverse swap min max
lower_bound upper_bound accumulate min_element max_element unique next_permutation make_pair greater less substr
to_string stoi length resize reserve assign`.split(/\s+/)

const PY_WORDS = `and as assert break class continue def del elif else except False finally for from global if import in is
lambda None nonlocal not or pass raise return self True try while with yield int str float bool list dict set tuple len range
enumerate zip sorted reversed min max sum abs append pop extend insert remove index count sort reverse keys values items get
heapq heappush heappop heapify deque appendleft popleft defaultdict Counter collections typing List Optional print input`.split(/\s+/)

const RUST_WORDS = `as break const continue crate else enum false fn for if impl in let loop match mod move mut pub ref return
self Self static struct trait true type unsafe use where while dyn async await i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128
usize f32 f64 bool char str String Vec Option Result Some None Ok Err Box Rc RefCell Cell HashMap HashSet BTreeMap BTreeSet
BinaryHeap VecDeque Reverse Ordering println print format panic assert assert_eq vec std collections cmp mem fmt iter
new len push pop insert remove get get_mut contains is_empty clear swap sort sort_by sort_by_key sort_unstable reverse
iter iter_mut into_iter map filter enumerate zip rev collect sum fold min max count any all position take skip chain
windows chunks to_string to_owned clone unwrap expect unwrap_or unwrap_or_else is_some is_none as_ref as_mut as_str
chars bytes lines split trim parse push_str abs pow wrapping_add checked_add saturating_sub entry or_insert or_default
Default Debug Display Clone Copy PartialEq Eq PartialOrd Ord Hash Iterator From Into`.split(/\s+/)

let completionReady = false
function defineCompletion(monaco) {
  if (completionReady) return
  completionReady = true
  for (const [lang, words] of [['cpp', WORDS], ['python', PY_WORDS], ['rust', RUST_WORDS]]) {
    monaco.languages.registerCompletionItemProvider(lang, {
      provideCompletionItems(model, position) {
        const w = model.getWordUntilPosition(position)
        const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: w.startColumn, endColumn: w.endColumn }
        // Keywords, plus the other words already in the file (not the one being typed).
        const inFile = new Set(model.getValue().match(/[A-Za-z_]\w{2,}/g) ?? [])
        inFile.delete(w.word)
        const labels = [...new Set([...words, ...inFile])]
        return { suggestions: labels.map(label => ({ label, insertText: label, kind: monaco.languages.CompletionItemKind.Keyword, range })) }
      },
    })
  }
}

function defineThemes(monaco) {
  defineCompletion(monaco)
  for (const [name, t] of Object.entries(THEMES)) {
    monaco.editor.defineTheme(name, {
      base: t.base, inherit: true,
      rules: [
        { token: 'keyword', foreground: t.k },
        { token: 'string', foreground: t.s },
        { token: 'number', foreground: t.s },
        { token: 'comment', foreground: t.c, fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': t.bg,
        'editor.foreground': t.fg,
        'editorLineNumber.foreground': t.num,
        'editorLineNumber.activeForeground': t.fg,
        'editor.lineHighlightBackground': t.cur,
        'editor.lineHighlightBorder': '#00000000',
        'editorCursor.foreground': t.accent,
        'editor.selectionBackground': t.sel,
        'editorWidget.background': t.bg,
        'scrollbarSlider.background': t.num + '55',
      },
    })
  }
}

const OPTIONS = {
  fontSize: 13.5,
  lineHeight: 24,
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  tabSize: 4,
  lineNumbers: 'on',
  lineNumbersMinChars: 3,
  lineDecorationsWidth: 12,
  glyphMargin: false,
  folding: false,
  renderLineHighlight: 'none',
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  padding: { top: 16, bottom: 80 },
  automaticLayout: true,
  fixedOverflowWidgets: true,   // popups may extend past the editor card instead of being clipped
  // Simple completion only: words already in the file plus the language's keywords and common library names.
  // No snippets, signatures or hovers: the typing is still the learner's.
  quickSuggestions: { other: true, comments: false, strings: false },
  suggestOnTriggerCharacters: false,
  acceptSuggestionOnEnter: 'off',   // Enter always makes a new line; Tab accepts a suggestion
  tabCompletion: 'on',
  wordBasedSuggestions: 'currentDocument',
  parameterHints: { enabled: false },
  inlineSuggest: { enabled: false },
  hover: { enabled: false },
  snippetSuggestions: 'none',
  suggest: { showWords: true, showSnippets: false, showIcons: false, preview: false },
}

export default function CodeEditor({ path, value, theme, language = 'cpp', onChange, onCursor, onCheck }) {
  return (
    <Editor
      height="100%"
      language={language}
      path={path}
      value={value}
      theme={theme === 'dark' ? 'fnd-dark' : 'fnd-light'}
      options={OPTIONS}
      beforeMount={defineThemes}
      onChange={v => onChange(v ?? '')}
      onMount={(editor, monaco) => {
        // Override Monaco's own Ctrl/Cmd+Enter (insert line below).
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onCheck())
        editor.onDidChangeCursorPosition(e => onCursor(e.position.lineNumber, e.position.column))
        const p = editor.getPosition()
        if (p) onCursor(p.lineNumber, p.column)
      }}
    />
  )
}
