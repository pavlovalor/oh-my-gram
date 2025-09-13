import { i18n } from '@lingui/core'
import { getBrowserLanguage } from './getBrowserLanguage'
import { type StorageRecord } from '~/hooks/usePersistentState'
import { type Locale } from '../iso-codes'

/**
 * Loads and activates the locale data for the given locale.
 * @param requestedLocale
 */
export async function loadLocaleData(requestedLocale?: Locale) {
  const storedLocaleJson = localStorage.getItem('omg::state::locale')
  const { state: storedLocale } = (storedLocaleJson ? JSON.parse(storedLocaleJson) : {}) as StorageRecord<Locale>
  const locale = requestedLocale ?? storedLocale ?? getBrowserLanguage()
  const { messages } = await import(`../dictionaries/${locale}.po`)
  i18n.loadAndActivate({ locale, messages })
  console.debug(`Locale [${locale}] requested`)
}
