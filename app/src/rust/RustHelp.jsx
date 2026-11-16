import HelpPanel, { CodeBlock } from '../foundations/HelpPanel'

const html = h => ({ __html: h })

// Side-panel content for the Rust track: the C++ comparison tab, everything else as in the C++ track.
export default function RustHelp({ tab, lesson, ...rest }) {
  if (tab === 'cpp') {
    return (
      <div className="pair">
        <div className="box">
          <div className="pl"><span>The C++ way</span><span className="tag">C++</span></div>
          <CodeBlock code={lesson.inCpp.code} lang="cpp" numbered={false} />
        </div>
        <div className="note-t" dangerouslySetInnerHTML={html(lesson.inCpp.note)} />
      </div>
    )
  }
  return <HelpPanel lang="rust" tab={tab} lesson={lesson} {...rest} />
}
