/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Auth from './auth'
import { IssueSchema } from './common/schemas'
import { Store } from './utils/store'
import { type OmgClient } from './client'
import { type InternalAxiosRequestConfig, type AxiosError } from 'axios'


const RETRY_FLAG = Symbol('Request retry indicator')

/**
 * Represents the session state, including authentication tokens, user permissions,
 * properties, and session details.
 */
export interface SessionState {
  refreshToken: Auth.TokenPairResponse['refreshToken'],
  accessToken: Auth.TokenPairResponse['accessToken'],
  // permissions: Auth.AccessTokenPayload['permissions'],
  // properties: Auth.AccessTokenPayload['properties'],
  identityId: Auth.AccessTokenPayload['uid'],
  profileId: Auth.AccessTokenPayload['pid'],
  sessionId: Auth.AccessTokenPayload['sid'],
}

/**
 * SessionManager is responsible for managing the user session, including sign-in,
 * sign-out, refreshing tokens, and storing session-related information.
 */
export class SessionManager {
  private store: Store<SessionState | null>
  private interceptorPairId: number | null = null

  get subscribe() { return this.store.subscribe.bind(this.store) }

  get getState() { return this.store.getState.bind(this.store) }

  /**
   * Creates an instance of the SessionManager.
   *
   * @param client - The client instance used for authentication and requests.
   */
  constructor(private readonly client: OmgClient) {
    /** Initializing session state management */
    this.store = new Store(null, this.client.config.persist)
  }

  /**
   * Checks if the current session is authorized by verifying the presence of a valid
   * refresh token in the session state.
   *
   * @returns `true` if the session is authorized, `false` otherwise.
   */
  public isAuthorized(): boolean {
    return Boolean(this.store.getState()?.refreshToken)
  }

  /**
   * Signs the user in with the provided credentials, consumes the token pair
   * from the response, and configures the client to include the access token
   * in subsequent requests.
   *
   * @param credentials - The credentials to authenticate the user.
   * @returns A promise that resolves when the sign-in process is complete.
   */
  public async signIn(credentials: Auth.Credentials): Promise<void> {
    const response = await this.client.auth.signIn(credentials)
    if (!response.isResolved) throw Error('Failed to sign in')

    this.consumeTokenPair(response.payload)
    this.applyInterceptors()
  }

  /**
   * Signs up the user in with the provided credentials, consumes the token pair
   * from the response, and configures the client to include the access token
   * in subsequent requests.
   *
   * @param credentials - The credentials to authenticate the user.
   * @returns A promise that resolves when the sign-in process is complete.
   */
  public async signUp(credentials: Auth.Credentials): Promise<void> {
    const response = await this.client.auth.signUp(credentials)
    if (!response.isResolved) throw Error('Failed to sign up')

    this.consumeTokenPair(response.payload)
    this.applyInterceptors()
  }

  /**
   * Refreshes the session by using the stored refresh token to obtain a new token pair.
   *
   * @throws If no refresh token is available in the session state.
   * @returns A promise that resolves when the token pair is refreshed.
   */
  public async refresh(): Promise<void> {
    const state = this.store.getState()
    if (!state?.refreshToken) throw new Error('Unable to refresh session. No refresh token present')

    const response = await this.client.auth.getNextTokenPair(state.refreshToken)
    if (response.isResolved) this.consumeTokenPair(response.payload)
    else throw new Error('Unable to refresh session')
  }

  /**
   * Signs the user out, invalidating the session, clearing the session state, and
   * removing the authorization header interceptor.
   *
   * @returns A promise that resolves when the sign-out process is complete.
   */
  public async signOut(): Promise<void> {
    // await this.client.auth.signOut()
    this.store.setState(null)

    /** Patching client to use linked Authorization header */
    this.client.agent.interceptors.request.eject(this.interceptorPairId!)
  }


  /**
   * Consumes the token pair (refresh and access tokens), parses the access token payload,
   * and updates the session state in the store.
   *
   * @param tokenPair - The pair of tokens (refresh and access) to be consumed.
   */
  private consumeTokenPair(tokenPair: Auth.TokenPairResponse): void {
    const accessTokenBody = atob(tokenPair.accessToken.value.split('.')[1]!)
    const accessTokenPayload: Auth.AccessTokenPayload = JSON.parse(accessTokenBody)
    this.store.setState({
      refreshToken: tokenPair.refreshToken,
      accessToken: tokenPair.accessToken,
      // permissions: accessTokenPayload.permissions,
      // properties: accessTokenPayload.properties,
      profileId: accessTokenPayload.pid,
      identityId: accessTokenPayload.uid,
      sessionId: accessTokenPayload.sid,
    })
  }


  /** Includes Authorization header with access token from the store */
  protected includeAuthHeadersInterceptor = (config: InternalAxiosRequestConfig<unknown>) => {
    const { accessToken } = this.store.getState() ?? {}
    const isSignInRequest = config.url?.includes('sign-in')
    const isRetryAttempt = config[RETRY_FLAG as never]

    if (accessToken && !isRetryAttempt && !isSignInRequest)
      config.headers['Authorization'] = `Bearer ${accessToken}`

    return config
  }


  /** If 401 received, attempts to refreshes session and tries again */
  protected sessionRefreshInterceptor = (error: AxiosError) => {
    const isUnauthorizedCode = error.response?.status === 401
    const isAuthzRoute = error.config?.url?.includes('/authz/')
    const originalRequest = error.config!

    /** Early exit, irrelevant response/route */
    if (!isUnauthorizedCode || isAuthzRoute) return error

    /** Parsing response shape */
    const parsedErrorState = IssueSchema.safeParse(error.response?.data)

    /** Terminate session if there is no clear reason */
    if (!parsedErrorState.success || !parsedErrorState.data.reason || parsedErrorState.data?.reason === 'Unknown')
      return this.store.setState(null)

    /** Refresh session and retry otherwise */
    try {
      const { accessToken } = this.store.getState() ?? {}

      ;(originalRequest as any)[RETRY_FLAG] = true
      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return this.client.agent(originalRequest)
    } catch (refreshError: unknown) {
      console.warn('RefreshError', refreshError)
    }

    return this.store.setState(null)
  }


  private applyInterceptors() {
    this.interceptorPairId = this.client.agent.interceptors.request.use(
      this.includeAuthHeadersInterceptor,
      this.sessionRefreshInterceptor,
    )
  }
}
