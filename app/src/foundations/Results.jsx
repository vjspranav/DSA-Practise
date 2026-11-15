// Results area under the editor: chips per test, expandable details, compile errors, run output.
const ind = v => String(v).split('\n').join('\n' + ' '.repeat(10))

function Detail({ test, hideGot }) {
  const gotText = test.status === 'error' ? test.message : test.got === '' ? '(nothing)' : ind(test.got)
  return (
    <div className="detail">
      {test.input != null && <>{'input     '}<b>{ind(test.input)}</b>{'\n'}</>}
      {test.status === 'tle' ? <u>Time limit exceeded</u> : (
        <>
          {test.expected != null && <>{'expected  '}<b>{ind(test.expected) || '(nothing)'}</b>{'\n'}</>}
          {!hideGot && <>{'got       '}<u>{gotText}</u></>}
        </>
      )}
      {test.printed ? <>{'\n\nYour output\n'}<b>{test.printed}</b></> : null}
    </div>
  )
}

function Output({ label, text }) {
  return <div className="outbox"><span className="lbl">{label}</span><pre>{text === '' ? '(nothing printed)' : text}</pre></div>
}

export function ResultsBody({ res, sel, onSel }) {
  if (!res) return null
  if (res.kind === 'forbidden') {
    return <div className="notice"><span className="ms">block</span><span>{res.msg}<small> Not counted as a miss.</small></span></div>
  }
  if (res.kind === 'compile') {
    return (
      <div>
        <div className="notice bad"><span className="ms">error</span><span>Compiler error<small> Not counted as a miss.</small></span></div>
        <pre className="errtext">{res.text || 'The compiler reported an error but printed nothing.'}</pre>
      </div>
    )
  }
  if (res.kind === 'run') {
    const t = res.test
    return (
      <div>
        <div className="tests">
          <span className={`test ${t.status === 'ok' ? 'ok' : 'bad'}`}>
            <span className="ms">{t.status === 'ok' ? 'check' : 'close'}</span>Test 1
          </span>
          <span className="summary">
            {t.status === 'ok' ? 'Output matches' : t.status === 'tle' ? 'Time limit exceeded' : t.status === 'error' ? 'Runtime error' : 'Output differs'}
          </span>
        </div>
        {res.raw != null && <Output label="Your output" text={res.raw} />}
        {t.status !== 'ok' && <Detail test={{ ...t, printed: '' }} hideGot={t.status === 'fail'} />}
      </div>
    )
  }
  const ok = res.tests.filter(t => t.status === 'ok').length
  const tle = res.tests.some(t => t.status === 'tle')
  const skipped = res.tests.filter(t => t.status === 'skipped').length
  const chosen = sel != null ? res.tests[sel] : null
  return (
    <>
      <div className="tests">
        {res.tests.map((t, i) => {
          const good = t.status === 'ok', skip = t.status === 'skipped'
          const icon = good ? 'check' : skip ? 'remove' : t.status === 'tle' ? 'schedule' : 'close'
          const cls = `test ${good ? 'ok' : skip ? 'skip' : 'bad'}${sel === i ? ' sel' : ''}`
          return good || skip
            ? <span key={i} className={cls} style={{ animationDelay: `${i * 60}ms` }} title={t.name}><span className="ms">{icon}</span>Test {i + 1}</span>
            : <button key={i} className={cls} style={{ animationDelay: `${i * 60}ms` }} title={t.name} onClick={() => onSel(sel === i ? null : i)}><span className="ms">{icon}</span>Test {i + 1}</button>
        })}
        <span className={`summary${res.win ? ' win' : ''}`}>
          {res.win ? 'All passed' : `${ok} of ${res.tests.length} passed${tle ? ' · time limit exceeded' : ''}${skipped ? ` · ${skipped} not run` : ''}`}
        </span>
      </div>
      <div className={`fold${chosen ? ' open' : ''}`}><div>{chosen && <Detail test={chosen} />}</div></div>
    </>
  )
}
