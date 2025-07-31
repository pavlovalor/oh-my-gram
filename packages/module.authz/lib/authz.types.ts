/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModuleMetadata } from '@nestjs/common'
import { AccessTokenHeaderSchema, AccessTokenPayloadSchema } from './authz.schemas'
import { infer as Infer } from 'zod'


export type AccessTokenHeader = Infer<typeof AccessTokenHeaderSchema>
export type AccessTokenPayload = Infer<typeof AccessTokenPayloadSchema>

export interface AuthzModuleOptions {
  pepper: string,
}

export interface AuthzGuardOptions {
  allowExpiredToken?: boolean,
  allowAnonymous?: boolean,
}

export interface AuthzModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  interceptHttp?: boolean,
  inject: any[],
  useFactory: (...args: any[]) => AuthzModuleOptions | Promise<AuthzModuleOptions>,
}

export interface TokenOutput {
  value: string,
  ttl: number,
}

export interface TokenMeta {
  sat: Date,
  iat: Date,
  ttl: number,
  uid: string,
  sid: string,
  rlm: 'public' | 'backoffice'
}

export interface TokenValidationOptions {
  readonly ignoreExpired?: boolean;
  readonly allowAnonymous?: boolean;
}
