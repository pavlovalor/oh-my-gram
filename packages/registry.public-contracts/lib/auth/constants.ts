export enum ShorthandKeys {
  TimeToLive = 'ttl',
  TokenCreatedAt = 'iat',
  TokenExpiresAt = 'eat',
  TokenEncryptionAlgorithm = 'alg',
  TokenEncryptionKeyId = 'kid',
  TokenType = 'typ',
  SessionCreatedAt = 'sat',
  SessionId = 'sid',
  IdentityId = 'uid',
  ProfileId = 'pid',
  Roles = 'rls',
  Challenges = 'chl',
  Restrictions = 'rst',
  Permissions = 'prm',
}

export const JwtType = 'JWT'

export const JwtAlgorithmDigestSet = [
  'sha256',
  'sha384',
  'sha512',
  'sha512-224',
  'sha512-256',
  'sha3-256',
  'sha3-384',
  'sha3-512',
  'shake256',
  'blake2b512',
  'blake2s256'
] as const

export const roles = [
  'user',
  'moderator',
  'admin',
] as const

export const challengeTypes = [
  'profile.create',
  'profile.update',
  'settings.update',
] as const

export const clientApplicationTypes = [
  'web',
  'mobile',
  'desktop',
] as const


export type Role = typeof roles[number]
export type ChallengeType = typeof challengeTypes[number]
export type ClientApplicationType = typeof clientApplicationTypes[number]
