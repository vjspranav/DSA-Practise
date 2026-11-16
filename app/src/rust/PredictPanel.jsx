import { Rustc } from './RustcOutput'

const html = h => ({ __html: h })

// The pick-one part of a predict step: three choices under the snippet, then the stored real output.
// Nothing here touches the network: each round carries the output captured from a real compiler.
export function Choices({ round, pick, revealed, onPick }) {
  return (
    <div className="predict">
      <div className="pt">{revealed ? 'Your prediction' : 'What will happen? Pick one, then compile it.'}</div>
      <div className="choices">
        {round.choices.map((text, i) => {
          let cls = '', icon = pick === i ? 'radio_button_checked' : 'radio_button_unchecked'
          if (revealed) {
            cls = ' locked'
            if (i === round.answer) { cls += ' right'; icon = 'check_circle' } else if (i === pick) { cls += ' wrong'; icon = 'cancel' } else cls += ' faded'
          } else if (pick === i) cls = ' sel'
          return (
            <button key={i} className={`choice${cls}`} onClick={() => onPick(i)}>
              <span className={`ms${cls.includes('right') || cls.includes('wrong') ? ' fill' : ''}`}>{icon}</span>{text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Reveal({ round, pick, last, onNext }) {
  const good = pick === round.answer
  return (
    <>
      <div className={`verdict ${good ? 'ok' : 'bad'}`}>
        <span className="ms fill">{good ? 'check_circle' : 'cancel'}</span>
        <span>
          {good ? <b>Right.</b> : <><b>Not quite.</b> You said “{round.choices[pick]}”; the answer is “{round.choices[round.answer]}”.</>}
          {' '}<span dangerouslySetInnerHTML={html(round.why)} />
        </span>
      </div>
      {round.errorCode
        ? <Rustc text={round.output} cap code={round.errorCode} />
        : <div className="out"><div className="lbl">{round.panic ? 'Compiled, then panicked with' : 'Compiled and ran. Printed'}</div><pre>{round.output === '' ? '(nothing printed)' : round.output}</pre></div>}
      {!last && <div className="nextrow"><button className="btn tone" onClick={onNext}>Next snippet<span className="ms">arrow_forward</span></button></div>}
    </>
  )
}
