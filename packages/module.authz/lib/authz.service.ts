import { ShorthandKeys, AccessTokenPayload, AccessTokenHeaders, AccessTokenHeadersSchema, AccessTokenPayloadSchema } from '@omg/public-contracts-registry'
import { AuthzModuleOptions, TokenHeaders, TokenPayload, TokenValidationOptions } from './authz.types'
import { AuthzModuleConfigInjectionToken, JwtAlgorithmDigestSet } from './authz.constants'
import { JwtRedisRepository } from './repositories/jwt.repository'
import { JwkData, JwkRedisRepository } from './repositories/jwk.repository'
import { Injectable, Inject } from '@nestjs/common'
import { randomArrayItem } from '@omg/utils-module'
import * as crypto from 'node:crypto'
import * as dayjs from 'dayjs'


@Injectable()
export class AuthzService {
  constructor(
    @Inject(AuthzModuleConfigInjectionToken)
    private readonly authzModuleOptions: AuthzModuleOptions,
    private readonly jwtRepository: JwtRedisRepository,
    private readonly jwkRepository: JwkRedisRepository,
  ) {}

  /**
   * Converts meta and payload into a valid JWT
   * @param meta
   * @param payload
   * @returns JWT string in format `<header[base64].payload[pase64].signature>`
   */
  public async encodeJWT(meta: TokenHeaders, payload: TokenPayload): Promise<string> {
    const [, type] = randomArrayItem(JwtAlgorithmDigestSet)
    const encryptionKey = await this.jwkRepository.getLatest()

    const tokenHeaders: AccessTokenHeaders = {
      [ShorthandKeys.TokenType]: 'JWT',
      [ShorthandKeys.TokenCreatedAt]: meta.tokenCreatedAt.unix(),
      [ShorthandKeys.TokenExpiresAt]: meta.sessionCreatedAt.add(meta.timeToLive, 'seconds').unix(),
      [ShorthandKeys.TokenEncryptionAlgorithm]: type,
      [ShorthandKeys.TokenEncryptionKeyId]: encryptionKey.id,
      [ShorthandKeys.SessionCreatedAt]: meta.sessionCreatedAt.unix(),
      [ShorthandKeys.SessionId]: meta.sessionId,
      [ShorthandKeys.Realm]: 'public',
    }

    const tokenPayload: AccessTokenPayload = {
      [ShorthandKeys.IdentityId]: payload.identityId,
      [ShorthandKeys.ProfileId]: payload.profileId,
      [ShorthandKeys.Challenges]: payload.challenges,
      [ShorthandKeys.Permissions]: payload.permissions,
      [ShorthandKeys.Restrictions]: payload.restrictions,
    }

    const encodedHeaders = this.encodeTokenPart(tokenHeaders)
    const encodedPayload = this.encodeTokenPart(tokenPayload)
    const signature = crypto
      .createHmac(type, this.getCombinedBufferKey(encryptionKey))
      .update(`${encodedHeaders}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    return `${encodedHeaders}.${encodedPayload}.${signature}`
  }


  /**
   * Validates and decodes a provided access token, returning the payload if valid.
   *
   * @param token - The JWT access token to validate
   * @param options - Allows to specify behavior such as: ignoring expiration date, ...
   * @returns A promise that resolves to the decoded payload
   *  of the valid token, which includes user identity claims and metadata.
   * @throws If the token is invalid, expired, or fails to meet the validation
   *  criteria specified in the options.
   */
  public async verifyJwt(token: string, options?: TokenValidationOptions) {
    // Step 1: Split the token into header, payload, and signature
    const [encodedHeader, encodePayload, receivedSignature] = token.split('.')
    const raw: {headers?: AccessTokenHeaders, payload?: AccessTokenPayload} = {}

    if (!encodedHeader || !encodePayload || !receivedSignature)
      throw new Error('Invalid token format')

    // Step 2: Decode and parse the header and payload
    try {
      const unsafeHeader = this.decodeTokenPart(encodedHeader)
      const unsafePayload = this.decodeTokenPart(encodePayload)

      ;[raw.headers, raw.payload] = await Promise.all([
        AccessTokenHeadersSchema.parseAsync(unsafeHeader),
        AccessTokenPayloadSchema.parseAsync(unsafePayload),
      ])
    } catch (exception: unknown) {
      throw new Error('Corrupted token payload', { cause: exception })
    }

    const headers = {
      realm: raw.headers[ShorthandKeys.Realm],
      sessionId: raw.headers[ShorthandKeys.SessionId],
      sessionCreatedAt: dayjs.unix(raw.headers[ShorthandKeys.SessionCreatedAt]),
      tokenCreatedAt: dayjs.unix(raw.headers[ShorthandKeys.TokenCreatedAt]),
      tokenExpiresAt: dayjs.unix(raw.headers[ShorthandKeys.TokenExpiresAt]),
    }

    const payload = {
      identityId: raw.payload[ShorthandKeys.IdentityId],
      profileId: raw.payload[ShorthandKeys.ProfileId] ?? undefined,
      challenges: raw.payload[ShorthandKeys.Challenges],
      permissions: raw.payload[ShorthandKeys.Permissions],
      restrictions: raw.payload[ShorthandKeys.Restrictions],
    }

    const encryptionAlgorithm = headers[ShorthandKeys.TokenEncryptionAlgorithm]
    const encryptionKeyId = headers[ShorthandKeys.TokenEncryptionKeyId]
    const encryptionKey = await this.jwkRepository.getById(encryptionKeyId)

    if (!encryptionKey)
      throw new Error('Encryption key not found')

    // Step 3: Verify the signature
    const expectedSignature = crypto
      .createHmac(encryptionAlgorithm, this.getCombinedBufferKey(encryptionKey))
      .update(`${encodedHeader}.${encodePayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    if (expectedSignature !== receivedSignature)
      throw new Error('Invalid token signature')

    // Step 4: Checking expiration date if required
    const isExpired = Boolean(!options?.ignoreExpired && headers.tokenExpiresAt.isBefore())

    // Step 5: If everything good, just return the payload
    return [{ headers, payload }, { isExpired }] as const
  }


  public revokeJWT(signature: string) {
    // TODO
  }


  /**
   * Encodes a JWT token part (header or payload) into a URL-safe Base64 string.
   * Used to assemble JWT token
   *
   * @param part - The object to be encoded, representing either the header or payload of the token.
   * @returns A URL-safe Base64 encoded string representation of the input object.
   */
  private encodeTokenPart(part: object) {
    return Buffer.from(JSON.stringify(part))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }


  /**
   * Decodes a Base64-encoded JWT token part (header or payload) into an object.
   *
   * @param part - The Base64-encoded string representing a JWT header or payload.
   * @returns  The decoded object containing the parsed data from the token part.
   */
  private decodeTokenPart(part: string) {
    return JSON.parse(Buffer
      .from(part, 'base64')
      .toString('utf-8'),
    )
  }


  private getCombinedBufferKey(baseKey: JwkData) {
    return Buffer.concat([
      Buffer.from(baseKey.value, 'base64'),
      Buffer.from(this.authzModuleOptions.pepper, 'base64'),
      Buffer.from(baseKey.id, 'base64'),
    ])
  }
}
