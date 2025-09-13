import { DEFAULT_LOCALE, LOCALES } from '../iso-codes'


/**
 * Return the browser language as IsoCode if it corresponds to a predefined value.
 * Otherwise, returns the default value {@link DEFAULT_LOCALE}.
 * @returns The browser language as IsoCode.
 */
export function getBrowserLanguage() {
  if (navigator?.language)
    for (const locale of LOCALES)
      if (navigator.language.startsWith(locale))
        return locale as typeof LOCALES[number]

  return DEFAULT_LOCALE
}
