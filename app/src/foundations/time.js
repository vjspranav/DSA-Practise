// "Now" for scheduling redos. Dev/testing hook: open the app with ?fndNow=2026-12-01T09:00:00Z
// to pretend it is that moment (a fixed instant) without waiting days.
const override = Date.parse(new URLSearchParams(window.location.search).get('fndNow') ?? '')
export const now = () => (Number.isFinite(override) ? override : Date.now())
export const DAY = 24 * 60 * 60 * 1000
