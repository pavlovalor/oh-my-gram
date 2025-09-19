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
  Realm = 'rlm',
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

export const OmgRealms = [
  'public',
  'backoffice'
] as const
