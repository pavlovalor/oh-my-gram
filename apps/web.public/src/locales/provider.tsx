// Core
import { I18nProvider } from '@lingui/react'
import { i18n } from '@lingui/core'
import * as React from 'react'

// Local
import { type Locale } from './iso-codes'
import { usePersistentState } from '../hooks/usePersistantState'
import { loadLocaleData } from './helpers/loadLocaleData'


await loadLocaleData()


export const LocalesContext = React.createContext({} as {
  isLoading: boolean,
  currentLocale: Locale,
  setNextLocale(nextLocale: Locale): void,
})


export const LocalesProvider: React.FC<React.PropsWithChildren> = props => {
  const [isLoading, setLoadingState] = React.useState(false)
  const [currentLocale, setCurrentLocale] = usePersistentState(i18n.locale as Locale, {
    storageKey: 'locale',
    storage: localStorage,
  })

  const setNextLocale = React.useCallback((requestedLocale: Locale) => {
    setLoadingState(true)
    loadLocaleData(requestedLocale)
      .then(() => setCurrentLocale(requestedLocale))
      .catch(console.error)
      .finally(() => setLoadingState(false))
  }, [setCurrentLocale, setLoadingState])

  return (
    <LocalesContext.Provider value={{ isLoading, currentLocale, setNextLocale }}>
      <I18nProvider i18n={i18n}>
        {props.children}
      </I18nProvider>
    </LocalesContext.Provider>
  )
}