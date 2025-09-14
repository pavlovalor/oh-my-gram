import { alignResponse } from '../utils'
import { type OmgClient, type OmgRequestOptions } from '../client'
import * as Types from './types'


export class AuthRoutes {
  constructor(private readonly client: OmgClient) {}

  public signUp = (
    credentials: Types.Credentials,
    options?: OmgRequestOptions,
  ) => this.client.agent
    .post<Types.TokenPairResponse>('/auth/sign-up', credentials, options)
    .then(alignResponse)

  public signIn = (
    credentials: Types.Credentials,
    options?: OmgRequestOptions,
  ) => this.client.agent
    .post<Types.TokenPairResponse>('/auth/sign-in', credentials, options)
    .then(alignResponse)


  public getNextTokenPair = (
    refreshToken: Types.RefreshToken,
    options?: OmgRequestOptions,
  ) => this.client.agent
    .post<Types.TokenPairResponse>('/auth/refresh', refreshToken, options)
    .then(alignResponse)


  public signOut = (
    options?: OmgRequestOptions,
  ) => this.client.agent
    .get('/auth/sign-out', options)
    .then(alignResponse)
}
