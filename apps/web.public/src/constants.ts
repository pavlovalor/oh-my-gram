export const cssViewportUnits = ['vw', 'vh', 'dvw', 'dvh', 'vmin', 'vmax', 'vb', 'vi', 'svw', 'svh', 'lvw', 'lvh'] as const
export const cssRelativeUnits = ['em', 'ex', 'ch', 'rem', 'lh', 'rlh', '%'] as const
export const cssAbsoluteUnits = ['cm', 'mm', 'Q', 'in', 'pc', 'pt', 'px'] as const
export const cssTemporalUnits = ['s', 'ms'] as const
export const cssUnits = [
  ...cssViewportUnits,
  ...cssRelativeUnits,
  ...cssAbsoluteUnits,
  ...cssTemporalUnits,
] as const
