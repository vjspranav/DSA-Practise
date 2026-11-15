import { useState } from 'react'
import CodeEditor from './CodeEditor'

// The editor card: header row, busy line, Monaco, optional extra rows, results, onward bar, status line.
// `editor` holds the CodeEditor props (path, value, theme, language, onChange, onCheck).
export default function EditorCard({ header, busy, editor, overlay, below, results, onward, language }) {
  const [cursor, setCursor] = useState([1, 1])
  return (
    <section className="card editor">
      <div className="ed-h-wrap"><div className="ed-h">{header}</div></div>
      <div className={`busyline${busy ? ' on' : ''}`}><i /></div>
      <div className="code-wrap">
        <div className="cm"><CodeEditor {...editor} onCursor={(l, c) => setCursor([l, c])} /></div>
        {overlay}
      </div>
      {below}
      <div className={`fold${results ? ' open' : ''}`}>
        <div><div className="res"><div className="pad"><div style={{ flex: 1, minWidth: 0 }}>{results}</div></div></div></div>
      </div>
      {onward}
      <div className="status"><span>Ln {cursor[0]}, Col {cursor[1]}</span><span className="sp" /><span>{language}</span></div>
    </section>
  )
}
