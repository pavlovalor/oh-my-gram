import { object, string, number } from 'zod'


const RefreshTokenSchema = object({
  value: string().length(64),
  ttl: number().int().positive(),
})

const AccessTokenSchema = object({
  value: string().jwt(),
  ttl: number().int().positive(),
})

const CredentialsSchema = object({
  password: string().min(8).max(64),
  phoneNumber: string().regex(/^\+\d{7,15}$/, 'use E.164 format like +380771234567').optional(),
  email: string().email().optional(),
})

export const TokenPairResponseSchema = object({
  refreshToken: RefreshTokenSchema,
  accessToken: AccessTokenSchema,
})

export const SignUpWithCredentialsRequestSchema = CredentialsSchema

export const SignInWithCredentialsRequestSchema = CredentialsSchema

export const RefreshSessionRequestSchema = object({
  refreshToken: RefreshTokenSchema.shape.value,
})
