function layoutTree(nodes, root) {
  if (root == null || !nodes[root]) return { positions: {}, edges: [], items: [], svgW: 300, svgH: 94 }
  const W = 36, H = 64
  const queue = [{ idx: root, depth: 0, offset: 0, span: 1 }]
  const positions = {}
  const edges = []
  const depthCounts = {}
  const items = []
  while (queue.length) {
    const { idx, depth, offset, span } = queue.shift()
    if (!nodes[idx]) continue
    depthCounts[depth] = (depthCounts[depth] || 0) + 1
    items.push({ idx, depth, offset, span })
    const node = nodes[idx]
    if (node.left != null) queue.push({ idx: node.left, depth: depth + 1, offset, span: span / 2 })
    if (node.right != null) queue.push({ idx: node.right, depth: depth + 1, offset: offset + span / 2, span: span / 2 })
  }
  const maxDepth = Math.max(...items.map(i => i.depth))
  const svgW = Math.max(300, (2 ** maxDepth) * W)
  items.forEach(({ idx, depth, offset, span }) => {
    positions[idx] = {
      x: (offset + span / 2) * svgW,
      y: depth * H + 30,
    }
  })
  items.forEach(({ idx }) => {
    const node = nodes[idx]
    if (node.left != null && positions[node.left]) {
      edges.push({ x1: positions[idx].x, y1: positions[idx].y, x2: positions[node.left].x, y2: positions[node.left].y })
    }
    if (node.right != null && positions[node.right]) {
      edges.push({ x1: positions[idx].x, y1: positions[idx].y, x2: positions[node.right].x, y2: positions[node.right].y })
    }
  })
  const svgH = (maxDepth + 1) * H + 30
  return { positions, edges, svgW, svgH, items }
}

export default function TreeViz({ nodes, root = 0, highlight = new Set(), highlightColor = 'var(--warn)', label = '' }) {
  const { positions, edges, svgW, svgH, items } = layoutTree(nodes, root)
  if (!items || items.length === 0) return null
  return (
    <div className="viz-tree-wrap">
      {label && <div className="viz-label">{label}</div>}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="viz-tree">
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="var(--border-bright)" strokeWidth={2} />
        ))}
        {items.map(({ idx }) => {
          const { x, y } = positions[idx]
          const val = nodes[idx].val
          const isHighlit = highlight.has(val)
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r={16}
                fill={isHighlit ? highlightColor : 'var(--surface-3)'}
                stroke={isHighlit ? highlightColor : 'var(--border-bright)'}
                strokeWidth={2}
              />
              <text x={x} y={y + 5} textAnchor="middle" fontSize={12} fill="var(--text)" fontFamily="monospace">
                {val}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
