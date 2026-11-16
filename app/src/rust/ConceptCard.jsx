import { CodeBlock } from '../foundations/HelpPanel'

const html = h => ({ __html: h })

function Pane({ label, lang, side }) {
  return (
    <div className="pane">
      <div className="pl">{label}</div>
      <CodeBlock code={side.code} lang={lang} numbered={false} />
      <div className={`outcome ${side.ok ? 'ok' : 'bad'}`}><span className="ms fill">{side.ok ? 'check_circle' : 'cancel'}</span>{side.outcome}</div>
    </div>
  )
}

function Compare({ compare }) {
  return (
    <>
      <div className="cmp">
        <Pane label="C++" lang="cpp" side={compare.cpp} />
        <Pane label="Rust" lang="rust" side={compare.rust} />
      </div>
      {compare.text && <p className="why" dangerouslySetInnerHTML={html(compare.text)} />}
    </>
  )
}

// The teaching section of a lesson: reading text, worked examples, and the "New in this lesson" list.
function Teach({ teach }) {
  const { body = [], examples = [], terms = [] } = teach
  return (
    <div className="teach">
      {body.map((p, i) => <div className="ttext" key={i} dangerouslySetInnerHTML={html(/^\s*<p[\s>]/.test(p) ? p : `<p>${p}</p>`)} />)}
      {examples.map((ex, i) => (
        <figure className="ex" key={i}>
          {ex.caption && <figcaption dangerouslySetInnerHTML={html(ex.caption)} />}
          <div className={`exbox${ex.wrap ? ' wrap' : ''}`}>
            <CodeBlock code={ex.code.replace(/\n$/, '')} lang="rust" numbered={false} />
            {ex.output != null && (
              <div className="exout"><span className="lbl">Output</span><pre>{ex.output.replace(/\n$/, '')}</pre></div>
            )}
          </div>
        </figure>
      ))}
      {terms.length > 0 && (
        <div className="terms">
          <h3><span className="ms">fiber_new</span>New in this lesson</h3>
          <dl>
            {terms.map((t, i) => (
              <div className="term" key={i}>
                <dt><code>{t.code}</code></dt>
                <dd dangerouslySetInnerHTML={html(t.meaning)} />
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}

// A lesson's top card: title and kind, the teaching section (when the lesson has one), the C++ bridge, and the
// "Your turn" line. The card can be collapsed; the task and the editor below it stay.
export default function ConceptCard({ lesson, open, onToggle, kind = ['school', 'Concept'] }) {
  const { compare, teach } = lesson
  const label = open ? (teach ? 'Hide the explanation' : 'Hide the idea') : (teach ? 'Show the explanation' : 'Show the idea')
  return (
    <section className={`card concept${teach ? ' taught' : ''}`}>
      <div className="ch">
        <h2>{lesson.title}</h2>
        <span className="kd"><span className="ms">{kind[0]}</span>{kind[1]}</span>
        <button className="iconbtn" onClick={onToggle} aria-label={label} title={label}>
          <span className="ms">{open ? 'expand_less' : 'expand_more'}</span>
        </button>
      </div>
      <div className={`fold${open ? ' open' : ''}`}>
        <div>
          <div className="cb">
            {teach && <Teach teach={teach} />}
            {compare && (teach
              ? <div className="bridge"><h3><span className="ms">compare_arrows</span>Coming from C++</h3><Compare compare={compare} /></div>
              : <Compare compare={compare} />)}
          </div>
        </div>
      </div>
      <div className="turn"><span className="ms">edit_note</span><span><b>Your turn.</b> <span dangerouslySetInnerHTML={html(lesson.task)} /></span></div>
    </section>
  )
}
