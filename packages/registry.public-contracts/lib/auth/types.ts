import type { infer as Infer } from 'zod'
import type * as Schema from './schemas'


export type Credentials = Infer<typeof Schema.CredentialsSchema>
export type TokenPairResponse = Infer<typeof Schema.TokenPairResponseSchema>
export type RefreshSessionRequest = Infer<typeof Schema.RefreshSessionRequestSchema>
export type RefreshToken = Infer<typeof Schema.RefreshTokenSchema>
export type AccessToken = Infer<typeof Schema.AccessTokenSchema>
export type AccessTokenPayload = Infer<typeof Schema.AccessTokenPayloadSchema>
