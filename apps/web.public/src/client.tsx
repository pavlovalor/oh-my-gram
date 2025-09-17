import { OmgClient } from '@omg/public-contracts-registry'
import * as React from 'react'

export const omgClient = new OmgClient({
  baseURL: 'http://localhost:3000',
  persist: {
    storage: localStorage,
    storageKey: 'omg::session',
    version: 0.0
  }
})

const OmgClientContext = React.createContext(omgClient)


export const useOmgClient = () => React.useContext(OmgClientContext)
export const useOmgSession = () => {
  const state = React.useSyncExternalStore(
    omgClient.session.subscribe,
    omgClient.session.getState,
  )

  return [state, {
    isAuthorized: omgClient.session.isAuthorized.bind(omgClient.session),
    refresh: omgClient.session.refresh.bind(omgClient.session),
    signOut: omgClient.session.signOut.bind(omgClient.session),
    signUp: omgClient.session.signUp.bind(omgClient.session),
    signIn: omgClient.session.signIn.bind(omgClient.session),
  }] as const
}


export const OmgClientProvider: React.FC<React.PropsWithChildren> = props => (
  <OmgClientContext.Provider {...props} value={omgClient} />
)
