import { PROBLEMS as BINARY_SEARCH  } from './binary-search'
import { PROBLEMS as GREEDY         } from './greedy'
import { PROBLEMS as BINARY_TREES, VIZ as BINARY_TREES_VIZ } from './binary-trees'
import { PROBLEMS as HEAP           } from './heap'
import { PROBLEMS as SLIDING_WINDOW, VIZ as SLIDING_WINDOW_VIZ } from './sliding-window'
import { PROBLEMS as STACKS_QUEUES, VIZ as STACKS_QUEUES_VIZ  } from './stacks-queues'

export const CATEGORIES = [
  { id: 'binary-search',  label: 'Binary Search' },
  { id: 'greedy',         label: 'Greedy' },
  { id: 'binary-trees',   label: 'Binary Trees' },
  { id: 'heap',           label: 'Heap' },
  { id: 'sliding-window', label: 'Sliding Window & Two Pointers' },
  { id: 'stacks-queues',  label: 'Stacks & Queues' },
]

export const PROBLEMS = [
  ...BINARY_SEARCH,
  ...GREEDY,
  ...BINARY_TREES,
  ...HEAP,
  ...SLIDING_WINDOW,
  ...STACKS_QUEUES,
]

export const vizComponents = {
  ...BINARY_TREES_VIZ,
  ...SLIDING_WINDOW_VIZ,
  ...STACKS_QUEUES_VIZ,
}
