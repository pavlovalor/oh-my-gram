import { Reflector } from '@nestjs/core'
import { type AuthzGuardOptions, AccessTokenPayload } from './authz.types'
import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { AuthzTokenDataKey } from './authz.constants'


export const AuthzCheck = Reflector.createDecorator<AuthzGuardOptions>()


export interface AuthzPayload {
  identityId: AccessTokenPayload['uid'],
  sessionId: AccessTokenPayload['sid'],
}


export const AuthzData = createParamDecorator(
  (_: void, context: ExecutionContext): AuthzPayload | null => {
    const request = context.switchToHttp().getRequest()
    const payload = request[AuthzTokenDataKey] as AccessTokenPayload

    return payload ? {
      identityId: payload.uid,
      sessionId: payload.sid,
    } : null
  },
)
