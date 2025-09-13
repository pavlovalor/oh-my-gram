import { ISO_CODES, type IsoCode } from './iso-codes'
import { DEFAULT_LOCALE } from './iso-codes'

/**
 * A language with its ISO code, region code, name, native name and RTL flag.
 */
export interface Language {
  isoCode: IsoCode,
  flag: string,
  countryCode: string,
  name: string,
  nativeName: string,
  isRTL: boolean,
}

/**
 * All available languages in the game.
 * Note: These are not the translations, but the languages that are available in the game. (When filtering lobbies etc.)
 * If you need the translations, use the `LOCALES` constant.
 */
export const LANGUAGES: Language[] = [
  { isoCode: 'ar', countryCode: 'eg', flag: '🇦🇪', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  { isoCode: 'bg', countryCode: 'bg', flag: '🇧🇬', name: 'Bulgarian', nativeName: 'Български Език', isRTL: false },
  { isoCode: 'cs', countryCode: 'cz', flag: '🇨🇿', name: 'Czech', nativeName: 'Čeština', isRTL: false },
  { isoCode: 'da', countryCode: 'dk', flag: '🇩🇰', name: 'Danish', nativeName: 'Dansk', isRTL: false },
  { isoCode: 'de', countryCode: 'de', flag: '🇩🇪', name: 'German', nativeName: 'Deutsch', isRTL: false },
  { isoCode: 'el', countryCode: 'gr', flag: '🇬🇷', name: 'Greek', nativeName: 'Ελληνικά', isRTL: false },
  { isoCode: 'en', countryCode: 'us', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'English', nativeName: 'English', isRTL: false },
  { isoCode: 'es', countryCode: 'es', flag: '🇪🇸', name: 'Spanish', nativeName: 'Español', isRTL: false },
  { isoCode: 'fi', countryCode: 'fi', flag: '🇫🇮', name: 'Finnish', nativeName: 'Suomi', isRTL: false },
  { isoCode: 'fr', countryCode: 'fr', flag: '🇫🇷', name: 'French', nativeName: 'Français', isRTL: false },
  { isoCode: 'he', countryCode: 'il', flag: '🇮🇱', name: 'Hebrew', nativeName: 'עברית', isRTL: true },
  { isoCode: 'hi', countryCode: 'in', flag: '🇮🇳', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false },
  { isoCode: 'hr', countryCode: 'hr', flag: '🇭🇷', name: 'Croatian', nativeName: 'Hrvatski', isRTL: false },
  { isoCode: 'hu', countryCode: 'hu', flag: '🇭🇺', name: 'Hungarian', nativeName: 'Magyar', isRTL: false },
  { isoCode: 'id', countryCode: 'id', flag: '🇮🇩', name: 'Indonesian', nativeName: 'Bahasa Indonesia', isRTL: false },
  { isoCode: 'it', countryCode: 'it', flag: '🇮🇹', name: 'Italian', nativeName: 'Italiano', isRTL: false },
  { isoCode: 'ja', countryCode: 'jp', flag: '🇯🇵', name: 'Japanese', nativeName: '日本語', isRTL: false },
  { isoCode: 'ko', countryCode: 'kp', flag: '🇰🇷', name: 'Korean', nativeName: '한국어', isRTL: false },
  { isoCode: 'lt', countryCode: 'lt', flag: '🇱🇹', name: 'Lithuanian', nativeName: 'Lietuvių Kalba', isRTL: false },
  { isoCode: 'nl', countryCode: 'nl', flag: '🇳🇱', name: 'Dutch', nativeName: 'Nederlands', isRTL: false },
  { isoCode: 'no', countryCode: 'no', flag: '🇳🇴', name: 'Norwegian', nativeName: 'Norsk', isRTL: false },
  { isoCode: 'pl', countryCode: 'pl', flag: '🇵🇱', name: 'Polish', nativeName: 'Polski', isRTL: false },
  { isoCode: 'pt', countryCode: 'br', flag: '🇵🇹', name: 'Portuguese', nativeName: 'Português', isRTL: false },
  { isoCode: 'ro', countryCode: 'ro', flag: '🇷🇴', name: 'Romanian', nativeName: 'Română', isRTL: false },
  { isoCode: 'ru', countryCode: 'ru', flag: '🏳️‍🌈', name: 'Mucovian', nativeName: 'Кацапский', isRTL: false },
  { isoCode: 'sk', countryCode: 'sk', flag: '🇸🇰', name: 'Slovak', nativeName: 'Slovenčina', isRTL: false },
  { isoCode: 'sr', countryCode: 'rs', flag: '🇷🇸', name: 'Serbian', nativeName: 'Srpski', isRTL: false },
  { isoCode: 'sv', countryCode: 'se', flag: '🇸🇪', name: 'Swedish', nativeName: 'Svenska', isRTL: false },
  { isoCode: 'tr', countryCode: 'tr', flag: '🇹🇷', name: 'Turkish', nativeName: 'Türkçe', isRTL: false },
  { isoCode: 'uk', countryCode: 'ua', flag: '🇺🇦', name: 'Ukrainian', nativeName: 'Українська', isRTL: false },
  { isoCode: 'zh', countryCode: 'cn', flag: '🇨🇳', name: 'Chinese', nativeName: '简体中文', isRTL: false },
] as const

const languageMap: Map<IsoCode, Language> = new Map(LANGUAGES.map((value) => [value.isoCode, value]))
export const DEFAULT_LANGUAGE: Language = isoCodeToLanguage(DEFAULT_LOCALE) ?? LANGUAGES[0]

/**
 * Returns the language for the given ISO code.
 * @param isoCode
 */
export function isoCodeToLanguage(isoCode: Nullable<IsoCode>): Language | undefined {
  if (!isoCode) return undefined
  return ISO_CODES.includes(isoCode as IsoCode) ? languageMap.get(isoCode as IsoCode) : undefined
}

/**
 * Returns the country code for the given ISO code.
 * @param isoCode
 */
export function isoCodeToCountryCode(isoCode: Nullable<IsoCode>): string | undefined {
  if (!isoCode) return undefined
  const language = isoCodeToLanguage(isoCode)
  return language ? language.countryCode : undefined
}

/**
 * Returns the ISO code with region code in the format of `en-US`.
 * @param isoCode The ISO code.
 * @param delimiter The delimiter between the ISO code and the region code. Defaults to `-`.
 */
export function isoWithRegionCode(isoCode: IsoCode, delimiter?: string | null): string | undefined {
  const language = isoCodeToLanguage(isoCode)
  return language ? `${language.isoCode}${delimiter ?? '-'}${language.countryCode.toUpperCase()}` : undefined
}

/**
 * Returns all available languages sorted by native name. The preferred language is moved to the top.
 * @param preferredLanguage
 * @param withoutAllOption
 */
export const getLanguagesSorted = (preferredLanguage?: IsoCode): Language[] => {
  const filtered = LANGUAGES
    .filter((lang) => preferredLanguage ? lang.isoCode !== preferredLanguage : true)
    .sort((a, b) => a.nativeName.localeCompare(b.nativeName))

  if (preferredLanguage) {
    const language = isoCodeToLanguage(preferredLanguage)
    if (language) filtered.unshift(language)
  }

  return filtered
}
