import zod from 'zod'
import { JwtAlgorithmDigestSet } from './authz.constants'


export const AccessTokenPayloadSchema = zod.object({
  eat: zod
    .number()
    .describe('UNIX-time format expiration date'),
  iat: zod
    .number()
    .describe('UNIX-time format token sign date'),
  sat: zod
    .number()
    .describe('UNIX-time format session opening date'),
  uid: zod
    .string()
    .uuid()
    .describe('Contains user identifier'),
  sid: zod
    .string()
    .uuid()
    .describe('Contains session identifier'),
  kid: zod
    .string()
    .uuid()
    .describe('Contains encryption key identifier'),
})


export const AccessTokenHeaderSchema = zod.object({
  alg: zod
    .enum(JwtAlgorithmDigestSet)
    .describe('Encryption algorithm in use'),
  typ: zod
    .literal('JWT')
    .describe('Token type'),
})
