import { useState, useCallback, useRef } from 'react'
import { PROBLEMS } from '../data/problems'

const CODE_KEY   = 'dsa-code'
const STATUS_KEY = 'dsa-status'

function readJSON(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? {} }
  catch { return {} }
}

export function usePracticeStore() {
  const [statusMap, setStatusMap] = useState(() => readJSON(STATUS_KEY))
  const codeMapRef  = useRef(readJSON(CODE_KEY))
  const debounceRef = useRef({})

  const getCode = useCallback((problemId, lang) => {
    const saved = codeMapRef.current[problemId]?.[lang]
    if (saved !== undefined) return saved
    const p = PROBLEMS.find(x => x.id === problemId)
    return p?.[`${lang}Starter`] ?? ''
  }, [])

  const saveCode = useCallback((problemId, lang, code) => {
    codeMapRef.current = {
      ...codeMapRef.current,
      [problemId]: { ...codeMapRef.current[problemId], [lang]: code },
    }
    clearTimeout(debounceRef.current[problemId])
    debounceRef.current[problemId] = setTimeout(() => {
      localStorage.setItem(CODE_KEY, JSON.stringify(codeMapRef.current))
    }, 500)
  }, [])

  const getStatus = useCallback((problemId) =>
    statusMap[problemId] ?? null,
  [statusMap])

  const setStatus = useCallback((problemId, newStatus) => {
    setStatusMap(prev => {
      const next = { ...prev, [problemId]: newStatus }
      localStorage.setItem(STATUS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { getCode, saveCode, getStatus, setStatus }
}
