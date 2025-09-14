import { OmgClient } from '@omg/public-contracts-registry'
import * as React from 'react'

export const omgClient = new OmgClient({
  baseURL: 'http://localhost:3000',
  persist: {
    storage: localStorage,
    storageKey: 'client',
    version: 0.0
  }
})

const OmgClientContext = React.createContext(omgClient)


export const useOmgClient = () => React.useContext(OmgClientContext)


export const OmgClientProvider: React.FC<React.PropsWithChildren> = props => (
  <OmgClientContext.Provider {...props} value={omgClient} />
)
