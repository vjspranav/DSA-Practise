import HelpPanel, { CodeBlock } from '../foundations/HelpPanel'

const html = h => ({ __html: h })

// Side-panel content for the C++ Learn track: the In Python tab, everything else as in the other tracks.
export default function CppLearnHelp({ tab, lesson, ...rest }) {
  if (tab === 'py') {
    return (
      <div className="pair">
        <div className="box">
          <div className="pl"><span>The Python way</span><span className="tag">Python</span></div>
          <CodeBlock code={lesson.inPython.code} lang="python" numbered={false} />
        </div>
        <div className="note-t" dangerouslySetInnerHTML={html(lesson.inPython.note)} />
      </div>
    )
  }
  return <HelpPanel lang="cpp" tab={tab} lesson={lesson} {...rest} />
}
