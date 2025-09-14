export const sortDirectionSimplified = ['asc', 'desc'] as const
export const sortDirectionExtended = [
  ...sortDirectionSimplified,
  '_asc', 'asc_', '_desc', 'desc_'
] as const
