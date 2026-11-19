// C++ Learn lessons: stage 5, memory and pointers. The stage is long, so it lives in two files that this one joins
// (index.js imports only this file): stage-5-memory-a.js (sizeof, pointers, null, arrays) and stage-5-memory-b.js
// (the heap, smart pointers, structs and arrows, practice). Check: node scripts/verify-cpp-learn.mjs --stage 5
import { LESSONS as A } from './stage-5-memory-a.js'
import { LESSONS as B } from './stage-5-memory-b.js'

export const LESSONS = [...A, ...B]
