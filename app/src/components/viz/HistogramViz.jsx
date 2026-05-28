export default function HistogramViz({ heights, highlight = [], waterFill = false, label = '' }) {
  const max = Math.max(...heights, 1)
  const barW = 36
  const barGap = 4
  const svgH = 160
  const svgW = heights.length * (barW + barGap) + barGap

  let water = []
  if (waterFill) {
    const leftMax = Array(heights.length).fill(0)
    const rightMax = Array(heights.length).fill(0)
    leftMax[0] = heights[0]
    for (let i = 1; i < heights.length; i++) leftMax[i] = Math.max(leftMax[i - 1], heights[i])
    rightMax[heights.length - 1] = heights[heights.length - 1]
    for (let i = heights.length - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], heights[i])
    water = heights.map((h, i) => Math.max(0, Math.min(leftMax[i], rightMax[i]) - h))
  }

  const highlightSet = new Set(highlight)
  const scale = (h) => (h / max) * (svgH - 24)

  return (
    <div className="viz-histogram-wrap">
      {label && <div className="viz-label">{label}</div>}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="viz-histogram">
        {heights.map((h, i) => {
          const x = barGap + i * (barW + barGap)
          const barH = scale(h)
          const waterH = waterFill ? scale(water[i]) : 0
          const isHL = highlightSet.has(i)
          return (
            <g key={i}>
              <rect
                x={x} y={svgH - 20 - barH} width={barW} height={barH}
                fill={isHL ? 'var(--green)' : 'var(--blue)'}
                rx={3}
              />
              {waterH > 0 && (
                <rect
                  x={x} y={svgH - 20 - barH - waterH} width={barW} height={waterH}
                  fill="var(--sapphire)" opacity={0.5}
                  rx={3}
                />
              )}
              <text x={x + barW / 2} y={svgH - 4} textAnchor="middle" fontSize={11} fill="var(--subtext0)" fontFamily="monospace">
                {h}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
