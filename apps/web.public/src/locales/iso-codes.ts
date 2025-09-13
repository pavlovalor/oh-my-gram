
/**
 * All available language codes in this app.
 * Suffices with the ISO 639-1 standard.
 *
 * Note: These are not the translations, but the languages that are available in the game. (When filtering lobbies etc.)
 * If you need the translations, use the `LOCALES` constant.
 */
export const ISO_CODES = [
  'ar',
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'fi',
  'fr',
  'he',
  'hi',
  'hr',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'lt',
  'nl',
  'no',
  'pl',
  'pt',
  'ro',
  'ru',
  'sk',
  'sr',
  'sv',
  'tr',
  'uk',
  'zh',
] as const

/**
 * Available ISO codes as type alias.
 */
export type IsoCode = typeof ISO_CODES[number]
export type Locale = typeof LOCALES[number]

/**
 * All available translations in the game.
 * Note: This is not to be confused with the languages that are available in the game. (When filtering lobbies etc.)
 * If you need the languages, use the `LANGUAGES` constant instead.
 */
export const LOCALES = ['en', 'uk'] as const satisfies IsoCode[]

/**
 * The default locale. (Default language)
 */
export const DEFAULT_LOCALE = LOCALES[0]
