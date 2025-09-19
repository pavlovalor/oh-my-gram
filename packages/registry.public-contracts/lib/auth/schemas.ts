import { IdentifierSchema, IntentDefinitionSchema, UnixTimeSchema } from '../common/schemas'
import { ShorthandKeys, JwtAlgorithmDigestSet, JwtType, OmgRealms } from './constants'
import * as zod from 'zod'


export const RefreshTokenSchema = zod.object({
  value: zod.string().length(32)
    .describe('Token string'),
  [ShorthandKeys.TimeToLive]: zod.number().int().positive()
    .describe('The amount of time the refresh token would remain valid'),
})

export const AccessTokenSchema = zod.object({
  value: zod.string().jwt()
    .describe('Token string'),
  [ShorthandKeys.TimeToLive]: zod.number().int().positive()
    .describe('The amount of time the access token would remain valid'),
})

export const AccessTokenHeadersSchema = zod.object({
  [ShorthandKeys.SessionCreatedAt]: UnixTimeSchema
    .describe('Session creation unix time'),
  [ShorthandKeys.SessionId]: IdentifierSchema
    .describe('Session identifier'),
  [ShorthandKeys.TokenCreatedAt]: UnixTimeSchema
    .describe('Token creation unix time'),
  [ShorthandKeys.TokenExpiresAt]: UnixTimeSchema
    .describe('Token expiration unix time'),
  [ShorthandKeys.TokenEncryptionKeyId]: IdentifierSchema
    .describe('Contains encryption key identifier'),
  [ShorthandKeys.TokenEncryptionAlgorithm]: zod.enum(JwtAlgorithmDigestSet)
    .describe('Encryption algorithm in use'),
  [ShorthandKeys.TokenType]: zod.literal(JwtType)
    .describe('Token type'),
  [ShorthandKeys.Realm]: zod.enum(OmgRealms)
    .describe('The realm a token belongs to'),
})

export const AccessTokenPayloadSchema = zod.object({
  [ShorthandKeys.IdentityId]: IdentifierSchema
    .describe('Identity identifier'),
  [ShorthandKeys.ProfileId]: IdentifierSchema.nullish()
    .describe('Profile id on behalf of which an action is being performed'),
  [ShorthandKeys.Challenges]: zod.array(IntentDefinitionSchema).optional()
    .describe('Challenges a user suppose to perform before continue activity'),
  [ShorthandKeys.Restrictions]: zod.array(IntentDefinitionSchema).optional()
    .describe('Restricts a user from performing specified activity'),
  [ShorthandKeys.Permissions]: zod.array(zod.unknown()).optional() // TODO
    .describe('CASL serialized permissions'),
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
