import { alignResponse, OmgResponse } from '../utils'
import { type OmgClient, type OmgRequestOptions } from '../client'
import * as Types from './types'


export class AuthRoutes {
  constructor(private readonly client: OmgClient) {}

  public signUp = (
    credentials: Types.Credentials,
    options?: OmgRequestOptions,
  ) => this.client.agent
    .post('/auth/sign-up', credentials, options)
    .then(...alignResponse) as Promise<OmgResponse<Types.TokenPairResponse>>

  public signIn = (
    credentials: Types.Credentials,
    options?: OmgRequestOptions,
  ) => this.client.agent
    .post('/auth/sign-in', credentials, options)
    .then(...alignResponse) as Promise<OmgResponse<Types.TokenPairResponse>>


  public getNextTokenPair = (
    refreshToken: Types.RefreshToken,
    options?: OmgRequestOptions,
  ) => this.client.agent
    .post('/auth/refresh', refreshToken, options)
    .then(...alignResponse) as Promise<OmgResponse<Types.TokenPairResponse>>


  // TODO
  // public signOut = (
  //   options?: OmgRequestOptions,
  // ) => this.client.agent
  //   .get('/auth/sign-out', options)
  //   .then(...alignResponse)
}
