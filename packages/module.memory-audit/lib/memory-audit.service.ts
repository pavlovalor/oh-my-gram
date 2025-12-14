import { Inject, Injectable, Logger } from '@nestjs/common'
import { type MemoryAuditModuleOptions } from './memory-audit.types'
import {
  DEFAULT_INTERVAL_DURATION, DEFAULT_GROWTH_THRESHOLD, DEFAULT_SNAPSHOTS_LIMIT,
  MAXIMAL_VIABLE_INTERVAL_DURATION, MINIMAL_VIABLE_INTERVAL_DURATION,
  MemoryAuditConfigInjectionToken,
} from './memory-audit.constants'
import dayjs from 'dayjs'


@Injectable()
export class MemoryAuditService {
  private readonly logger = new Logger(MemoryAuditService.name)
  private readonly traceMaturityThreshold: number
  private readonly snapshots: number[] = []
  private interval?: NodeJS.Timeout


  constructor(
    @Inject(MemoryAuditConfigInjectionToken)
    private readonly config: Required<MemoryAuditModuleOptions>
  ) {
    this.config.intervalDuration ??= DEFAULT_INTERVAL_DURATION
    this.config.growthThreshold ??= DEFAULT_GROWTH_THRESHOLD
    this.config.snapshotsLimit ??= DEFAULT_SNAPSHOTS_LIMIT
    this.traceMaturityThreshold = Math.floor(this.config.snapshotsLimit / 2)
  }


  public start() {
    this.logger.log('Initializing memory audit service...')

    const duration = typeof this.config.intervalDuration === 'number'
      ? dayjs.duration(this.config.intervalDuration, 'milliseconds')
      : this.config.intervalDuration

    const formattedDuration = duration.format('HH:mm:ss')
    const formattedMinimalDuration = MINIMAL_VIABLE_INTERVAL_DURATION.format('HH:mm:ss')
    const formattedMaximalDuration = MAXIMAL_VIABLE_INTERVAL_DURATION.format('HH:mm:ss')

    const isViableDuration = duration < MINIMAL_VIABLE_INTERVAL_DURATION
      || duration > MAXIMAL_VIABLE_INTERVAL_DURATION

    if (isViableDuration) {
      this.logger.warn(`Interval duration is not viable, using ${formattedDuration}`)
      this.logger.warn(`We suggest for interval between ${formattedMinimalDuration} and ${formattedMaximalDuration}`)
    }

    this.logger.log(`Setting audit interval as ${formattedDuration}`)
    this.interval = setInterval(this.audit.bind(this), duration.asMilliseconds())
  }


  public stop(): void {
    clearInterval(this.interval)
  }


  private audit(): void {
    const heapUsed = process.memoryUsage().heapUsed / 1024 / 1024

    this.snapshots.push(heapUsed)

    // Keep last 10 snapshots
    if (this.snapshots.length > this.config.snapshotsLimit)
      this.snapshots.shift()

    // Detect continuous growth
    if (this.isConsumptionAccumulating())
      this.logger.warn('Detecting accumulating memory consumption', {
        trend: this.snapshots,
        current: heapUsed,
      })
  }


  private isConsumptionAccumulating(): boolean {
    // Skip consumption check for immature traces
    if (this.snapshots.length < this.traceMaturityThreshold)
      return false

    const recent = this.snapshots.slice(-this.traceMaturityThreshold)

    // Check if each snapshot is higher than the previous
    for (let i = 1; i < recent.length; i++)
      if (recent[i] <= recent[i - 1])
        return false

    const firstSnapshot = recent[0]
    const lastSnapshot = recent.at(-1)!

    // Check if growth is significant (>10%)
    const growthPercentage = ((lastSnapshot - firstSnapshot) / firstSnapshot) * 100

    return growthPercentage > this.config.growthThreshold
  }
}
