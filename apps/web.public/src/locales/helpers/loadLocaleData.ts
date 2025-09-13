import { i18n } from '@lingui/core'
import { getBrowserLanguage } from './getBrowserLanguage'

/**
 * Loads and activates the locale data for the given locale.
 * @param locale
 */
export async function loadLocaleData(locale = getBrowserLanguage()) {
  const { messages } = await import(`../dictionaries/${locale}.po`)
  i18n.loadAndActivate({ locale, messages })
  console.debug(`Locale [${locale}] requested`)
}
