// Per-problem static visualizations embedded in example explanations.
// Each viz type renders differently based on the problem's structure.

// Cell colours are classes (c-teal ...), styled in problems.css with theme tokens.
function Cell({ value, color }) {
  return <span className={`viz-cell${color ? ` c-${color}` : ''}`}>{value}</span>
}

// Stacked rows — each row shows the full array with one window lit up
function ArrayWindowsViz({ array, windows, caption }) {
  return (
    <div className="example-viz">
      {windows.map((w, i) => (
        <div key={i} className="viz-row">
          <div className="viz-cells">
            {array.map((val, idx) => (
              <Cell
                key={idx}
                value={val}
                color={idx >= w.range[0] && idx <= w.range[1] ? w.color : null}
              />
            ))}
          </div>
          {w.label && <span className="viz-row-label">{w.label}</span>}
        </div>
      ))}
      {caption && <p className="viz-caption">{caption}</p>}
    </div>
  )
}

// Single row — left and right ends selected, middle dimmed
function ArrayEndsViz({ array, leftCount, rightCount, caption }) {
  return (
    <div className="example-viz">
      <div className="viz-row">
        <div className="viz-cells">
          {array.map((val, idx) => {
            const isLeft  = idx < leftCount
            const isRight = idx >= array.length - rightCount
            return <Cell key={idx} value={val} color={isLeft ? 'teal' : isRight ? 'peach' : null} />
          })}
        </div>
      </div>
      {caption && <p className="viz-caption">{caption}</p>}
    </div>
  )
}

// Two rows (s / t) — window highlighted in s, matched chars in teal
function StringWindowViz({ s, t, window: win, matches, caption }) {
  return (
    <div className="example-viz">
      <div className="viz-row">
        <span className="viz-seq-label">s</span>
        <div className="viz-cells">
          {s.split('').map((ch, idx) => {
            const inWindow = idx >= win.start && idx <= win.end
            const isMatch  = matches.includes(idx)
            return <Cell key={idx} value={ch} color={isMatch ? 'teal' : inWindow ? 'blue' : null} />
          })}
        </div>
      </div>
      <div className="viz-row">
        <span className="viz-seq-label">t</span>
        <div className="viz-cells">
          {t.split('').map((ch, idx) => (
            <Cell key={idx} value={ch} color="teal" />
          ))}
        </div>
      </div>
      {caption && <p className="viz-caption">{caption}</p>}
    </div>
  )
}

export default function ExampleViz({ viz }) {
  if (viz.type === 'array-windows') return <ArrayWindowsViz {...viz} />
  if (viz.type === 'array-ends')   return <ArrayEndsViz {...viz} />
  if (viz.type === 'string-window') return <StringWindowViz {...viz} />
  return null
}
