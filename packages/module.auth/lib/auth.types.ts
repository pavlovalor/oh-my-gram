import type { Dayjs } from 'dayjs'
import type { JwtAuthzStrategy } from './strategies/jwt'


export type ValidationResult = Awaited<ReturnType<typeof JwtAuthzStrategy['prototype']['validate']>>

export interface TokenValidationOptions {
  readonly ignoreExpired?: boolean;
  readonly allowAnonymous?: boolean;
}

export interface TokenPairGenerationOptions {
  refreshTokenId?: string;
  timestamp?: Dayjs;
}
