import { IdentifierSchema } from '../common/schemas'
import * as zod from 'zod'


export const RefreshTokenSchema = zod.object({
  value: zod.string().length(32)
    .describe('Token string'),
  ttl: zod.number().int().positive()
    .describe('The amount of time the refresh token would remain valid'),
})

export const AccessTokenSchema = zod.object({
  value: zod.string().jwt()
    .describe('Token string'),
  ttl: zod.number().int().positive()
    .describe('The amount of time the access token would remain valid'),
})

export const AccessTokenPayloadSchema = zod.object({
  ttl: zod.number()
    .describe('Token lifetime in seconds'),
  iat: zod.string().datetime()
    .describe('Token creation date'),
  sat: zod.string().datetime()
    .describe('Session creation date'),
  sid: IdentifierSchema
    .describe('Session identifier'),
  uid: IdentifierSchema
    .describe('Identity identifier'),
  pid: IdentifierSchema.optional()
    .describe('Profile id on behalf of which an action is being performed'),
  rlm: zod.enum(['public', 'backoffice'])
    .describe('The realm a token belongs to'),
})

export const CredentialsSchema = zod.object({
  password: zod.string().min(8).max(64),
  login: zod.union([
    zod.string().regex(/^\+\d{7,15}$/, 'Use E.164 format like +380771234567'),
    zod.string().email(),
  ]).describe('Email of phone number'),
})

export const TokenPairResponseSchema = zod.object({
  refreshToken: RefreshTokenSchema,
  accessToken: AccessTokenSchema,
})

export const RefreshSessionRequestSchema = zod.object({
  refreshToken: RefreshTokenSchema.shape.value,
})

export const SignUpWithCredentialsRequestSchema = CredentialsSchema
export const SignInWithCredentialsRequestSchema = CredentialsSchema
