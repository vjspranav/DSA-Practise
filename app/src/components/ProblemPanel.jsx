import { useState } from 'react'
import ExampleViz from './ExampleViz'
import { CATEGORIES } from '../data/problems'

const DIFF_COLOR = { Easy: 'easy', Medium: 'medium', Hard: 'hard' }

function HintAccordion({ hints }) {
  const [revealed, setRevealed] = useState(0)

  return (
    <div className="hints-section">
      <div className="section-label">Hints</div>
      <div className="hints-list">
        {hints.map((hint, i) => {
          const isUnlocked = i < revealed
          const isNext = i === revealed
          return (
            <div key={i} className={`hint-item ${isUnlocked ? 'unlocked' : ''}`}>
              {isUnlocked ? (
                <p dangerouslySetInnerHTML={{ __html: hint }} />
              ) : isNext ? (
                <button className="unlock-hint-btn" onClick={() => setRevealed(i + 1)}>
                  Reveal Hint {i + 1}
                </button>
              ) : (
                <span className="hint-locked">— Hint {i + 1} locked</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProblemPanel({ problem }) {
  if (!problem) return null

  return (
    <div className="problem-panel">
      {/* Header */}
      <div className="problem-header">
        <h1 className="problem-title">{problem.title}</h1>
        <div className="problem-meta">
          <span className={`diff-badge ${DIFF_COLOR[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <span className="category-tag">
            {CATEGORIES.find(c => c.id === problem.category)?.label ?? problem.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="problem-body">
        <div className="problem-description">
          {problem.description.map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>

        {/* Examples */}
        <div className="section-label">Examples</div>
        {problem.examples.map((ex, i) => (
          <div key={i} className="example-block">
            <div className="example-num">Example {i + 1}</div>
            <div className="example-io">
              <div className="io-row">
                <span className="io-label">Input</span>
                <code className="io-value">{ex.input}</code>
              </div>
              <div className="io-row">
                <span className="io-label">Output</span>
                <code className="io-value io-value-output">{ex.output}</code>
              </div>
            </div>
            {ex.explanation && (
              <p
                className="example-explanation"
                dangerouslySetInnerHTML={{ __html: ex.explanation }}
              />
            )}
            {ex.visualization && <ExampleViz viz={ex.visualization} />}
          </div>
        ))}

        {/* Constraints */}
        <div className="section-label">Constraints</div>
        <ul className="constraints-list">
          {problem.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>

        {/* Test Cases */}
        <div className="section-label">
          Test Cases
          <span className="section-sublabel">all visible</span>
        </div>
        <div className="test-cases-grid">
          {problem.testCases.map((tc, i) => (
            <div key={i} className="tc-card">
              <div className="tc-card-header">
                <span className="tc-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="tc-label">{tc.label}</span>
              </div>
              <div className="tc-card-body">
                <span className="tc-field-label">Input</span>
                <code className="tc-input">{tc.input}</code>
              </div>
              <div className="tc-card-footer">
                <span className="tc-expected-label">Expected</span>
                <span className="tc-expected">{tc.expected}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Hints */}
        <HintAccordion key={problem.id} hints={problem.hints} />
      </div>
    </div>
  )
}
