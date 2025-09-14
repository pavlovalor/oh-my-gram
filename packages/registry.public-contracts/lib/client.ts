import axios, { type AxiosInstance, type CreateAxiosDefaults, type AxiosRequestConfig } from 'axios'
import { type PersistenceConfig } from './utils/store'

import { AuthRoutes } from './auth/routes'
import { SessionManager } from './session'


export interface ExoClientOptions extends CreateAxiosDefaults {
  persist: PersistenceConfig
}


export interface OmgRequestOptions extends Omit<AxiosRequestConfig, 'method'> {}
export interface OmgRequestDetails<
  $Query extends object | undefined = undefined,
  $Payload extends object | undefined = undefined,
> {
  query: $Query,
  payload: $Payload
}

export class OmgClient {
  public readonly agent: AxiosInstance
  public readonly session: SessionManager

  public readonly auth: AuthRoutes

  constructor(public readonly config: ExoClientOptions) {
    const { headers, ...rest } = config
    this.agent = axios.create({
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    })

    /** Session setup */
    this.session = new SessionManager(this)

    /** Routes setup */
    this.auth = new AuthRoutes(this)
  }
}
