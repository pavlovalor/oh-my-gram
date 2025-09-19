import { Injectable, Logger, type NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AuthzTokenDataKey } from './authz.constants'
import { AuthzService } from './authz.service'
import * as color from 'cli-color'


const dateFormat = 'MM/DD/YYYY, H:mm:ss A'


/**
 * Interceptor that inspects incoming HTTP requests for a Bearer token
 * and attaches decoded token data to the request if present and valid.
 * Falls back to treating the request as anonymous if no valid token is found.
 */
@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthzMiddleware.name)

  constructor(
    private readonly authzService: AuthzService,
  ) {}

  /**
   * Intercepts the incoming HTTP request, extracts a Bearer token (if any),
   * verifies it, and attaches decoded token data to the request object.
   *
   * @param context - The current request context.
   * @param next - The next handler in the interceptor chain.
   * @returns The observable stream returned by the handler.
   */
  public async use(request: Request, _response: Response, next: NextFunction) {
    this.logger.verbose('Validating authorization parameters')

    const bearerToken = this.getBearerToken(request.headers['authorization'])

    if (bearerToken)
      this.logger.verbose('Verifying applied AccessToken')
    else {
      this.logger.verbose('Embracing anonymous request')
      request[AuthzTokenDataKey] = null
      return next()
    }

    const [parsed, { isExpired: isExpiredToken }] = await this.authzService
      .verifyJwt(bearerToken, { ignoreExpired: true })
      .catch((exception: Error) => {
        this.logger.warn(`Ignoring AccessToken. Reason: ${exception.message}`)
        return []
      })

    if (isExpiredToken)
      this.logger.warn(`Got expired AccessToken`)

    if (parsed) {
      this.logger.debug(`Token summary:`)
      this.logger.debug(`Expires at:         ${parsed.headers.tokenExpiresAt.format(dateFormat)}`)
      this.logger.debug(`Signed at:          ${parsed.headers.tokenCreatedAt.format(dateFormat)}`)
      this.logger.debug(`Session started at: ${parsed.headers.sessionCreatedAt.format(dateFormat)}`)
      this.logger.debug(`Session ID:  ${color.green(parsed.headers.sessionId)}`)
      this.logger.debug(`Identity ID: ${color.green(parsed.payload.identityId)}`)
      request[AuthzTokenDataKey] = parsed
    } else {
      this.logger.verbose('Treating as an anonymous request')
      request[AuthzTokenDataKey] = null
    }

    return next()
  }


  /**
   * Extracts the Bearer token from an Authorization header.
   *
   * @param header - The Authorization header value.
   * @returns The extracted Bearer token, or null if not found.
   */
  private getBearerToken(header?: string): string | null {
    if (!header) return null

    const [type, token] = header.split(' ')
    return type === 'Bearer' ? token : null
  }
}
