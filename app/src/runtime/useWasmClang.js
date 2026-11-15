import { useEffect, useState } from 'react'

// Creates the wasm-clang worker and wires up its message port.
// Returns { worker, state } where state is the { port, handlers, onWrite } shape executor.js expects.
function createClang(onError) {
  const worker = new Worker('/wasm-clang/worker.js')
  const { port1, port2 } = new MessageChannel()
  worker.postMessage({ id: 'constructor', data: port2 }, [port2])
  const state = { port: port1, handlers: {}, onWrite: null }
  port1.onmessage = ({ data: { id, responseId, data } }) => {
    if (id === 'write') state.onWrite?.(data)
    else if (id === 'compileLinkRunDone' || id === 'compileLinkOnlyDone' || id === 'runWasmDone') {
      const resolve = state.handlers[responseId]
      if (resolve) { resolve(data); delete state.handlers[responseId] }
    }
  }
  worker.onerror = onError
  return { worker, state }
}

// One shared worker for the whole app, so it lives at module level.
const host = { slot: { current: null }, counter: { current: 0 }, worker: null, onError: null }

function startWorker() {
  host.worker?.terminate()
  const { worker, state } = createClang(() => host.onError?.())
  host.worker = worker
  host.slot.current = state
}

// Shared wasm-clang worker for both Problems and Foundations.
// Returns true if the worker failed to load. Use `wasmClang` to talk to it.
// `restart` kills the worker (e.g. after an infinite loop) and starts a fresh one;
// `slot.current` always points at the live worker's state.
export function useWasmClang() {
  const [error, setError] = useState(false)

  useEffect(() => {
    host.onError = () => setError(true)
    startWorker()
    return () => { host.onError = null; host.worker?.terminate(); host.worker = null }
  }, [])

  return error
}

// Handle for code that runs things on the worker: wasmClang.slot.current is the live worker state.
export const wasmClang = { slot: host.slot, counter: host.counter, restart: startWorker }
