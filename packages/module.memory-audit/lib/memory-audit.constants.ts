import * as dayjs from 'dayjs'


export const MemoryAuditConfigInjectionToken = Symbol('Identifies MemoryAuditConfig in NestJS module graph')

export const MINIMAL_VIABLE_INTERVAL_DURATION = dayjs.duration(20, 'seconds')
export const MAXIMAL_VIABLE_INTERVAL_DURATION = dayjs.duration(20, 'minutes')

export const DEFAULT_INTERVAL_DURATION = dayjs.duration(1, 'minute')
export const DEFAULT_GROWTH_THRESHOLD = 10
export const DEFAULT_SNAPSHOTS_LIMIT = 10
