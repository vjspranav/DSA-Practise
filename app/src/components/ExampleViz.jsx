// Per-problem static visualizations embedded in example explanations.
// Each viz type renders differently based on the problem's structure.

const C = {
  teal:  { bg: 'rgba(148,226,213,.18)', color: '#94e2d5', border: 'rgba(148,226,213,.4)' },
  blue:  { bg: 'rgba(137,180,250,.18)', color: '#89b4fa', border: 'rgba(137,180,250,.4)' },
  mauve: { bg: 'rgba(203,166,247,.18)', color: '#cba6f7', border: 'rgba(203,166,247,.4)' },
  peach: { bg: 'rgba(250,179,135,.18)', color: '#fab387', border: 'rgba(250,179,135,.4)' },
  green: { bg: 'rgba(166,227,161,.18)', color: '#a6e3a1', border: 'rgba(166,227,161,.4)' },
}

const DIM = { bg: 'rgba(49,50,68,.6)', color: '#585b70', border: '#313244' }

function Cell({ value, color }) {
  const s = color ? C[color] : DIM
  return (
    <span
      className="viz-cell"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {value}
    </span>
  )
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
  if (!viz) return null
  if (viz.type === 'array-windows') return <ArrayWindowsViz {...viz} />
  if (viz.type === 'array-ends')   return <ArrayEndsViz {...viz} />
  if (viz.type === 'string-window') return <StringWindowViz {...viz} />
  return null
}
