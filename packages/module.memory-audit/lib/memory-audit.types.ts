import { type Duration } from 'dayjs/plugin/duration'
import { type ModuleMetadata } from '@nestjs/common'


export interface MemoryAuditModuleOptions {
  intervalDuration?: number | Duration,
  growthThreshold?: number,
  snapshotsLimit?: number,
}


export interface MemoryAuditModuleAsyncOptions
extends Pick<ModuleMetadata, 'imports'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject: any[],
  useFactory: (...args: any[]) => MemoryAuditModuleOptions | Promise<MemoryAuditModuleOptions>,
}
