import { LESSONS as S1 } from './stage-1-warmup.js'
import { LESSONS as S2 } from './stage-2-sorting.js'
import { LESSONS as S3 } from './stage-3-build.js'
import { LESSONS as S4A } from './stage-4-stl-a.js'
import { LESSONS as S4B } from './stage-4-stl-b.js'
import { LESSONS as S5A } from './stage-5-algorithms-a.js'
import { LESSONS as S5B } from './stage-5-algorithms-b.js'

// Stage order is the learning order. `art` names the small stage picture in the drawer.
export const STAGES = [
  { id: 'warmup',     art: 'row',    name: 'C++ warm-up',             blurb: 'Input, loops, references, structs',        lessons: S1 },
  { id: 'sorting',    art: 'stairs', name: 'Sort and search by hand', blurb: 'The classics, typed out yourself',         lessons: S2 },
  { id: 'build',      art: 'tree',   name: 'Build it yourself',       blurb: 'Your own vector, heap, hash map, graph',   lessons: S3 },
  { id: 'stl',        art: 'grid',   name: 'The standard library',    blurb: 'Short STL drills, one feature each',       lessons: [...S4A, ...S4B] },
  { id: 'algorithms', art: 'graph',  name: 'Algorithms',              blurb: 'Recursion, graphs, dynamic programming',   lessons: [...S5A, ...S5B] },
]

export const LESSONS = STAGES.flatMap(s => s.lessons)
