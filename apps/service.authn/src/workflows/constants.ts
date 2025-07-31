import * as dayjs from 'dayjs'

export const RefreshTokenLifetime = dayjs.duration(1, 'month')
export const AccessTokenLifetime = dayjs.duration(30, 'minutes')
