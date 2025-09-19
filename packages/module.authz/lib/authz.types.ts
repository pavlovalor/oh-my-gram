/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ModuleMetadata } from '@nestjs/common'
import { type AuthzService } from './authz.service'
import { type Dayjs } from 'dayjs'


export type RequestAuthPartition = Awaited<ReturnType<AuthzService['verifyJwt']>>[0]

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

export interface TokenHeaders {
  sessionCreatedAt: Dayjs,
  tokenCreatedAt: Dayjs,
  timeToLive: number,
  sessionId: string,
  realm: 'public' | 'backoffice'
}

export interface TokenPayload {
  identityId: string,
  profileId?: string,
  challenges?: any[],
  restrictions?: any[],
  permissions?: any[],
}

export interface TokenValidationOptions {
  readonly ignoreExpired?: boolean;
  readonly allowAnonymous?: boolean;
}
