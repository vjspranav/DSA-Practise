import { useState } from 'react'
import CodeEditor from './CodeEditor'

// The editor card: header row, busy line, Monaco, optional extra rows, results, onward bar, status line.
// `editor` holds the CodeEditor props (path, value, theme, language, onChange, onCheck).
// Optional: `viewer` shows a read-only node instead of Monaco; `codeHeight` fixes the code area's height
// (the card then grows with its results and the page scrolls); `className` adds a variant to the card.
export default function EditorCard({ header, busy, editor, viewer, codeHeight, className = '', overlay, below, results, onward, language }) {
  const [cursor, setCursor] = useState([1, 1])
  return (
    <section className={`card editor${codeHeight ? ' grow' : ''}${className ? ' ' + className : ''}`}>
      <div className="ed-h-wrap"><div className="ed-h">{header}</div></div>
      <div className={`busyline${busy ? ' on' : ''}`}><i /></div>
      <div className="code-wrap" style={codeHeight ? { height: codeHeight, flex: 'none' } : undefined}>
        <div className="cm">{viewer ?? <CodeEditor {...editor} onCursor={(l, c) => setCursor([l, c])} />}</div>
        {overlay}
      </div>
      {below}
      <div className={`fold${results ? ' open' : ''}`}>
        <div><div className="res"><div className="pad"><div style={{ flex: 1, minWidth: 0 }}>{results}</div></div></div></div>
      </div>
      {onward}
      <div className="status">{viewer ? null : <span>Ln {cursor[0]}, Col {cursor[1]}</span>}<span className="sp" /><span>{language}</span></div>
    </section>
  )
}
