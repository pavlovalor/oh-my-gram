import dayjs from 'dayjs'
import Duration, { type DurationUnitType } from 'dayjs/plugin/duration'

dayjs.extend(Duration)

/**
 * Creates delay in async flows
 * @param callback get's triggered after specified period of time
 * @param value amount of time
 * @param unit unit of time, defaults to milliseconds
 *
 * @example
 * ```ts
 * await delay(2, 'seconds')
 * await delay(42, 'years') // Nobody is going to wait so long obviously, but we still can do so
 * await delay(() => console.log('test'), 2, 'minutes')
 * ```
 */
export function delay(
  callback: () => unknown,
  value: number,
  unit?: DurationUnitType
): Promise<void>

export function delay(
  value: number,
  unit: DurationUnitType
): Promise<void>

export function delay(
  arg1: number | (() => unknown),
  arg2: number | DurationUnitType,
  arg3?: DurationUnitType,
): Promise<void> {
  const callback = typeof arg1 === 'function' ? arg1 : null
  const value = (typeof arg2 === 'number' ? arg2 : arg1) as number
  const unit = (typeof arg3 === 'string' ? arg3 : arg2) as DurationUnitType

  const milliseconds = dayjs.duration(value, unit).asMilliseconds()

  return new Promise(resolve => {
    setTimeout(() => {
      callback?.()
      resolve()
    }, milliseconds)
  })
}
