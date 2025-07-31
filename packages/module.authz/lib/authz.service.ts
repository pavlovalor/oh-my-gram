import { AccessTokenHeaderSchema, AccessTokenPayloadSchema } from './authz.schemas'
import { AuthzModuleConfigInjectionToken, JwtAlgorithmDigestSet } from './authz.constants'
import { JwtRedisRepository } from './repositories/jwt.repository'
import { JwkData, JwkRedisRepository } from './repositories/jwk.repository'
import { Injectable, Inject } from '@nestjs/common'
import { randomArrayItem } from '@omg/utils-module'
import * as Types from './authz.types'
import * as crypto from 'node:crypto'
import * as dayjs from 'dayjs'


@Injectable()
export class AuthzService {
  constructor(
    @Inject(AuthzModuleConfigInjectionToken)
    private readonly authzModuleOptions: Types.AuthzModuleOptions,
    private readonly jwtRepository: JwtRedisRepository,
    private readonly jwkRepository: JwkRedisRepository,
  ) {}

  public async encodeJWT(meta: Types.TokenMeta, _payload?: object): Promise<string> {
    const [, type] = randomArrayItem(JwtAlgorithmDigestSet)
    const encryptionKey = await this.jwkRepository.getLatest()
    const sat = dayjs(meta.sat)
    const iat = dayjs(meta.iat)
    const eat = iat.add(meta.ttl, 'seconds')

    const tokenHeader: Types.AccessTokenHeader = {
      alg: type,
      typ: 'JWT',
    }

    const tokenPayload: Types.AccessTokenPayload = {
      eat: eat.unix(),
      sat: sat.unix(),
      iat: iat.unix(),
      uid: meta.uid,
      sid: meta.sid,
      kid: encryptionKey.id,
      // add more payload here
    }

    const encodedHeader = this.encodeTokenPart(tokenHeader)
    const encodedPayload = this.encodeTokenPart(tokenPayload)
    const signature = crypto
      .createHmac(type, this.getCombinedBufferKey(encryptionKey))
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    return `${encodedHeader}.${encodedPayload}.${signature}`
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
  public async verifyJwt(token: string, options?: Types.TokenValidationOptions) {
    // Step 1: Split the token into header, payload, and signature
    const [encodedHeader, encodePayload, receivedSignature] = token.split('.')
    let header: Types.AccessTokenHeader, payload: Types.AccessTokenPayload

    if (!encodedHeader || !encodePayload || !receivedSignature)
      throw new Error('Invalid token format')

    // Step 2: Decode and parse the header and payload
    try {
      const unsafeHeader = this.decodeTokenPart(encodedHeader)
      const unsafePayload = this.decodeTokenPart(encodePayload)

      ;[header, payload] = await Promise.all([
        AccessTokenHeaderSchema.parseAsync(unsafeHeader),
        AccessTokenPayloadSchema.parseAsync(unsafePayload),
      ])
    } catch (_exception: unknown) {
      throw new Error('Corrupted token payload')
    }

    const encryptionKey = await this.jwkRepository.getById(payload.kid)

    if (!encryptionKey)
      throw new Error('Encryption key not found')

    // Step 3: Verify the signature
    const expectedSignature = crypto
      .createHmac(header.alg, this.getCombinedBufferKey(encryptionKey))
      .update(`${encodedHeader}.${encodePayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    if (expectedSignature !== receivedSignature)
      throw new Error('Invalid token signature')

    // Step 4: Checking expiration date if required
    const isExpired = Boolean(!options?.ignoreExpired && payload.eat && dayjs(payload.eat * 1000).isBefore())

    // Step 5: If everything good, just return the payload
    return [payload, isExpired] as const
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
