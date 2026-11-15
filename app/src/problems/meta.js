// Small lookups shared by the drawer and the description card.
export const CAT_ICON = {
  'binary-search': 'search', greedy: 'bolt', 'binary-trees': 'account_tree', heap: 'stacked_bar_chart',
  'sliding-window': 'width', 'stacks-queues': 'layers', 'bit-manipulation': 'memory',
}
export const DIFF = { Easy: 'E', Medium: 'M', Hard: 'H' }
export const ASKED = { himali: ['H', 'Himali'], vjs: ['V', 'VJS'], bonus: ['★', 'Bonus pick'] }
export const askedOf = p => ASKED[p.askedBy] ?? ASKED.bonus
