export const AuthzModuleConfigInjectionToken = Symbol('Identifies AuthzModule config in NestJS module graph')
export const AuthzTokenDataKey = Symbol('Stores parsed AccessToken data')

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
