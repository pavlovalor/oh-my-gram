import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AuthzCheck } from './authz.decorator'
import { AccessTokenPayload } from './authz.types'
import * as dayjs from 'dayjs'
import { AuthzTokenDataKey } from './authz.constants'


@Injectable()
export class AuthzGuard implements CanActivate {
  private logger = new Logger(AuthzGuard.name)

  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.verbose('Checking')

    const request = context.switchToHttp().getRequest()
    const options = this.reflector.get(AuthzCheck, context.getHandler()) ?? {}
    const tokenData = request[AuthzTokenDataKey] as AccessTokenPayload | null
    const isExpiredToken = tokenData && dayjs(tokenData.eat * 1000).isBefore()
    const isAnonymous = !tokenData

    this.logger.verbose('Applying guard rules')

    if (isAnonymous && !options.allowAnonymous) {
      console.log(isAnonymous, options.allowAnonymous)
      this.logger.warn('Anonymous users not allowed')
      return false
    }

    if (isExpiredToken && !options.allowExpiredToken) {
      this.logger.warn('Expired tokens not allowed')
      return false
    }

    this.logger.verbose('Allowing to proceed')
    return true
  }
}
