import { LESSONS as S1 } from './stage-1-basics.js'
import { LESSONS as S2A } from './stage-2-ownership-a.js'
import { LESSONS as S2B } from './stage-2-ownership-b.js'
import { LESSONS as S3A } from './stage-3-types-a.js'
import { LESSONS as S3B } from './stage-3-types-b.js'
import { LESSONS as S4 } from './stage-4-sorting.js'
import { LESSONS as S5 } from './stage-5-build.js'
import { LESSONS as S6A } from './stage-6-collections-a.js'
import { LESSONS as S6B } from './stage-6-collections-b.js'
import { LESSONS as S7A } from './stage-7-algorithms-a.js'
import { LESSONS as S7B } from './stage-7-algorithms-b.js'

// Stage order is the learning order (stage N has lesson ids r<N>-...). `art` names the drawer picture.
// Format: docs/superpowers/specs/2026-11-15-rust-track-design.md
export const STAGES = [
  { id: 'basics',      art: 'row',    name: 'Rust for C++ people',      blurb: 'Syntax, types, loops, match, strings',      lessons: S1 },
  { id: 'ownership',   art: 'tree',   name: 'Ownership and borrowing',  blurb: 'Moves, references, lifetimes, smart pointers', lessons: [...S2A, ...S2B] },
  { id: 'types',       art: 'grid',   name: 'Types that replace habits', blurb: 'Structs, enums, Option, traits, iterators', lessons: [...S3A, ...S3B] },
  { id: 'sorting',     art: 'stairs', name: 'Sort and search by hand',  blurb: 'The classics on &mut [i32]',                lessons: S4 },
  { id: 'build',       art: 'graph',  name: 'Build it yourself',        blurb: 'Stack, heap, hash map, lists, trees, graphs', lessons: S5 },
  { id: 'collections', art: 'grid',   name: 'Standard collections',     blurb: 'Short drills, one feature each',            lessons: [...S6A, ...S6B] },
  { id: 'algorithms',  art: 'graph',  name: 'Algorithms',               blurb: 'Recursion, graphs, dynamic programming',    lessons: [...S7A, ...S7B] },
]

export const LESSONS = STAGES.flatMap(s => s.lessons)
