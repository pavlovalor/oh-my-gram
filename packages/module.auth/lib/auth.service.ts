import * as Contracts from '@exo/contracts'
import * as Identity from '../identity'
import * as Database from '~/infrastructure/database'
import * as crypto from 'node:crypto'
import * as Types from './auth.types'
import dayjs from 'dayjs'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PermissionInspector } from '../permission/inspector'
import { GetIdentityByIdFlow } from '../identity/flows/get-entity-by-id'
import { EnvironmentService } from '~/infrastructure/environment/service'
import { randomArrayItem } from '@omg/u'
import { packRules } from '@casl/ability/extra'


@Injectable()
export class AuthzService {
  static secret = 'xaIg3t2wwox7QT904uDjzvqIzOvUVOkt' // TODO: Should be rotated
  static refreshTokenLifetime = dayjs.duration({ days: 2 }) // TODO: Should be stored in the db
  static accessTokenLifetime = dayjs.duration({ minutes: 30 }) // TODO: Should be stored in the db

  constructor(
    // private readonly databaseService: Database.Service,
    private readonly environmentService: EnvironmentService,
    private readonly permissionFactory: PermissionInspector,
    private readonly getIdentityById: GetIdentityByIdFlow,
  ) {}


  // /**
  //  * Refreshes the token pair (access and refresh tokens) for a given identity if
  //  * the current refresh token is valid.
  //  *
  //  * @param refreshToken - The current refresh token provided by the client, used for validation.
  //  * @param identity - The identity object representing the user requesting token refresh.
  //  * @returns A promise resolving to a new token pair containing a refreshed access token and refresh token.
  //  * @throws An error if the provided refresh token is invalid, expired, or does not match the identity.
  //  */
  // public async refreshTokens(refreshToken: string, identity: Identity.Types.State) { // TODO: transaction support
  //   const [tokenPair, payload] = await this.generateTokenPair(identity)
  //   const timestamp = dayjs(payload.iat)

  //   const [nextRecord] = await this.databaseService
  //     .update(Database.Schema.refreshTokenTable)
  //     .set({
  //       expiresAt: timestamp.add(AuthzService.refreshTokenLifetime).toDate(),
  //       value: tokenPair.refreshToken,
  //     })
  //     .where(Database.operators.and(
  //       Database.operators.eq(Database.Schema.refreshTokenTable.identityId, identity.id),
  //       Database.operators.eq(Database.Schema.refreshTokenTable.value, refreshToken),
  //     ))
  //     .returning()

  //   if (!nextRecord)
  //     throw new Error('Refresh token was not found')

  //   return tokenPair
  // }


  /**
   * Composes a new token pair (access and refresh tokens) for a given identity and stores the refresh
   * token in the database.
   *
   * @param identity - The identity object representing the user or application for which the tokens are generated.
   * @param timestamp - The timestamp to be used for token creation, defaulting to the current time.
   * @returns A token pair containing the access token and refresh token.
   */
  public async composeTokens(identity: Identity.Types.State, timestamp = dayjs()) {
    const [tokenPair, payload] = await this.generateTokenPair(identity, { timestamp })

    await this.databaseService
      .insert(Database.Schema.refreshTokenTable)
      .values({
        id: payload.sid,
        identityId: identity.id,
        createdAt: timestamp.toDate(),
        expiresAt: timestamp.add(AuthzService.refreshTokenLifetime).toDate(),
        value: tokenPair.refreshToken,
      })

    return tokenPair
  }


  // /**
  //  * Registers a new session by validating user credentials and generating access tokens.
  //  *
  //  * @param payload - An object containing the user's email and password credentials.
  //  * @param timestamp - Optional timestamp for session creation, defaulting to the current time.
  //  * @returns A promise resolving to an object containing the generated access token and refresh token.
  //  * @throws An error if the provided password is incorrect or the identity does not exist.
  //  */
  // public async registerSession(payload: Contracts.Credentials, timestamp = dayjs()) { // TODO: add transaction support
  //   const loginField = payload.login.includes('@') ? 'email' : 'userName'

  //   const [expectedRecord] = await this.databaseService
  //     .select()
  //     .from(Database.Schema.identityTable)
  //     .innerJoin(Database.Schema.passwordHashTable, Database.operators.and(
  //       Database.operators.eq(Database.Schema.passwordHashTable.identityId, Database.Schema.identityTable.id),
  //       Database.operators.eq(Database.Schema.passwordHashTable.hash, this.generateHash(payload.password)),
  //     ))
  //     .where(Database.operators.eq(Database.Schema.identityTable[loginField], payload.login))
  //     .orderBy(Database.operators.desc(Database.Schema.passwordHashTable.createdAt))
  //     .limit(1)

  //   if (!expectedRecord)
  //     throw new UnauthorizedException('Password is wrong or such identity does not exist') // TODO: proper issue

  //   // TODO: expired password flow here

  //   const [identity] = await this.getIdentityById.execute(expectedRecord.identity.id, {
  //     resolve: { teams: true },
  //     throwIfNotFound: true,
  //   })

  //   return this.composeTokens(identity, timestamp)
  // }


  // /**
  //  * Revokes a session by deleting the specified refresh token from the database.
  //  * @param refreshToken - The refresh token identifying the session to be revoked.
  //  * @returns A promise that resolves when the session has been successfully revoked.
  //  */
  // public async invalidateRefreshToken(refreshToken: string, identity: Identity.Types.State) {
  //   await this.databaseService
  //     .delete(Database.Schema.refreshTokenTable)
  //     .where(Database.operators.and(
  //       Database.operators.eq(Database.Schema.refreshTokenTable.value, refreshToken),
  //       Database.operators.eq(Database.Schema.refreshTokenTable.identityId, identity.id),
  //     ))
  // }


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
  public async parseAccessToken(token: string, options?: Types.TokenValidationOptions) {
    // Step 1: Split the token into header, payload, and signature
    const [encodedHeader, encodePayload, receivedSignature] = token.split('.')
    let header: Contracts.AccessTokenHeader, payload: Contracts.AccessTokenPayload

    if (!encodedHeader || !encodePayload || !receivedSignature)
      throw new Error('Invalid token format')

    // Step 2: Decode and parse the header and payload
    try {
      const unsafeHeader = this.decodeTokenPart(encodedHeader)
      const unsafePayload = this.decodeTokenPart(encodePayload)

      ;[header, payload] = await Promise.all([
        Contracts.AccessTokenHeaderSchema.parseAsync(unsafeHeader),
        Contracts.AccessTokenPayloadSchema.parseAsync(unsafePayload),
      ])
    } catch (exception: unknown) {
      throw new Error('Corrupted token payload')
    }

    // Step 3: Verify the signature
    const expectedSignature = crypto
      .createHmac(header.alg, AuthzService.secret) // TODO: Both secret and alg should be dynamic and rotated
      .update(`${encodedHeader}.${encodePayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    if (expectedSignature !== receivedSignature)
      throw new Error('Invalid token signature')

    // Step 4: Checking expiration date if required
    const isExpired = Boolean(!options?.ignoreExpired && payload.exp && dayjs(payload.exp * 1000).isBefore())

    // Step 5: If everything good, just return the payload
    return [payload, isExpired] as const
  }


  /**
   * Generates a secure, predictable hash for a given password string.
   *
   * @param password - The password string to be hashed.
   * @returns The SHA-256 hash of the combined salt, password, and pepper.
   *  This hash is represented as a hexadecimal string.
   */
  public generateHash(password: string) {
    const pepper = this.environmentService.get('PASSWORD_PEPPER')
    const salt = 'slH54Sf5xMdxa6OpkmofOzVdN001MODl'

    return crypto.createHash('sha256')
      .update(salt + password + pepper)
      .digest('hex')
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


  /**
   * Generates a pair of tokens: an access token and a refresh token.
   *
   * @param identity - The identity object containing user details, used to populate token payload.
   * @param timestamp - The timestamp to be used for token issuance and expiration times.
   * @returns An object containing the generated access token (JWT format) and a secure refresh token.
   */
  private async generateTokenPair(
    identity: Identity.Types.State,
    options: Types.TokenPairGenerationOptions = {},
  ) {
    // Step 1: Randomly select the encryption algorithm
    const [, randomEncryptionAlgorithmKey] = randomArrayItem(Contracts.JwtAlgorithmDigestSet)
    const timestamp = options.timestamp ?? dayjs()

    // Step 2.1: Assemble the JWT header with a randomly selected algorithm variant
    const header: Contracts.AccessTokenHeader = {
      alg: randomEncryptionAlgorithmKey,
      typ: 'JWT',
    }

    const ability = await this.permissionFactory.inspectFor(identity.id)

    // Step 2.2: Assemble the JWT payload with user claims and set issuance and expiration times
    const payload: Contracts.AccessTokenPayload = {
      iat: timestamp.unix(),
      exp: timestamp.add(AuthzService.accessTokenLifetime).unix(),
      sid: options.refreshTokenId ?? crypto.randomUUID(),
      uid: identity.id,
      properties: {
        email: identity.email || undefined,
        displayName: identity.displayName || undefined,
        userName: identity.userName,
      },
      permissions: packRules(ability.rules),
    }

    // Step 3: Encode the JWT header and payload
    const encodeHeader = this.encodeTokenPart(header)
    const encodePayload = this.encodeTokenPart(payload)

    // Step 4: Generate the JWT signature using HMAC-SHA256 with a secret
    const signature = crypto
      .createHmac(randomEncryptionAlgorithmKey, AuthzService.secret)
      .update(`${encodeHeader}.${encodePayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    // Step 5: Compose token pair
    const tokenPair = {
      refreshToken: crypto.randomBytes(16).toString('hex').slice(0, 32),
      accessToken: `${encodeHeader}.${encodePayload}.${signature}`,
    }

    return [tokenPair, payload] as const
  }

  /** Removes expired refresh tokens */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async refreshTokenCleanup() {
    await this.databaseService
      .delete(Database.Schema.refreshTokenTable)
      .where(Database.operators.lte(Database.Schema.refreshTokenTable.expiresAt, new Date))
  }
}
