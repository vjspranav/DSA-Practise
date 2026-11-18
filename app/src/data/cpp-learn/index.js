import { LESSONS as S1 } from './stage-1-first.js'
import { LESSONS as S2 } from './stage-2-control.js'
import { LESSONS as S3 } from './stage-3-functions.js'
import { LESSONS as S4A } from './stage-4-sequences-a.js'
import { LESSONS as S4B } from './stage-4-sequences-b.js'
import { LESSONS as S5 } from './stage-5-memory.js'
import { LESSONS as S6 } from './stage-6-classes.js'
import { LESSONS as S7A } from './stage-7-stl-a.js'
import { LESSONS as S7B } from './stage-7-stl-b.js'
import { LESSONS as S8 } from './stage-8-dsa.js'

// Stage order is the learning order (stage N has lesson ids c<N>-...). `art` names the drawer picture.
// Format: docs/superpowers/specs/2026-11-18-cpp-learn-path-design.md. Stage files are never edited here:
// content agents only touch their own stage-N-*.js.
export const STAGES = [
  { id: 'basics',    art: 'row',    name: 'First programs',          blurb: 'main, printing, variables, input',            lessons: S1 },
  { id: 'control',   art: 'stairs', name: 'Control flow',            blurb: 'if, switch, loops, braces',                    lessons: S2 },
  { id: 'functions', art: 'tree',   name: 'Functions',               blurb: 'Parameters, references, overloads, recursion', lessons: S3 },
  { id: 'sequences', art: 'grid',   name: 'Arrays, vectors, strings', blurb: 'vector, 2D grids, char and string work',       lessons: [...S4A, ...S4B] },
  { id: 'memory',    art: 'graph',  name: 'Memory and pointers',     blurb: 'Pointers, new and delete, smart pointers',     lessons: S5 },
  { id: 'classes',   art: 'tree',   name: 'Structs and classes',     blurb: 'Methods, constructors, operators, templates',  lessons: S6 },
  { id: 'stl',       art: 'grid',   name: 'The STL from Python',     blurb: 'map, set, sort, lambdas, queues',              lessons: [...S7A, ...S7B] },
  { id: 'dsa',       art: 'stairs', name: 'DSA basics',              blurb: 'Search, sort, lists, graphs, DP',              lessons: S8 },
]

export const LESSONS = STAGES.flatMap(s => s.lessons)
