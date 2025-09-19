import { Reflector } from '@nestjs/core'
import { RequestAuthPartition, TokenHeaders, TokenPayload, type AuthzGuardOptions } from './authz.types'
import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { AuthzTokenDataKey } from './authz.constants'


export const AuthzCheck = Reflector.createDecorator<AuthzGuardOptions>()

export type AuthzPayload
  = Pick<TokenPayload, 'identityId'>
  & Pick<TokenHeaders, 'sessionId'>


/** Extracts auth information based on applied access token */
export const AuthzData = createParamDecorator(
  (_: void, context: ExecutionContext): AuthzPayload | null => {
    const request = context.switchToHttp().getRequest()
    const tokenData = request[AuthzTokenDataKey] as RequestAuthPartition | null

    return tokenData ? {
      ...tokenData.headers,
      ...tokenData.payload,
    } : null
  },
)
