import { Bar } from './DrawerParts'

// "Where you are, and the next one" bar under the editor after a pass.
export default function Onward({ title, pct, next, onNext, last }) {
  return (
    <div className="onward">
      <span className="ms fill">check_circle</span>
      <div className="where"><b>{title}</b><Bar pct={pct} /></div>
      {next
        ? <button className="btn fill big" onClick={onNext}>Next: {next}<span className="ms">arrow_forward</span></button>
        : <b>{last}</b>}
    </div>
  )
}
