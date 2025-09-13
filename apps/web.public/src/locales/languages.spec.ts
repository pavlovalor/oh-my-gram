import { describe, expect, it } from 'vitest'
import { isoCodeToLanguage, isoWithRegionCode } from './languages'
import { type IsoCode } from './iso-codes'

describe('Language utils', () => {
  describe('isoCodeToLanguage', () => {
    it('returns correct language object for valid ISO codes present in LANGUAGES array', () => {
      expect(isoCodeToLanguage('en')).toEqual({
        isoCode: 'en',
        countryCode: 'us',
        name: 'English',
        nativeName: 'English',
        isRTL: false,
      })
      expect(isoCodeToLanguage('uk')).toEqual({
        isoCode: 'uk',
        countryCode: 'fr',
        name: 'Ukrainian',
        nativeName: 'Українська',
        isRTL: false,
      })
    })

    it('returns undefined for valid ISO codes not in LANGUAGES array', () => {
      expect(isoCodeToLanguage('zz' as IsoCode)).toBeUndefined()
    })

    it('returns undefined for invalid ISO codes', () => {
      expect(isoCodeToLanguage('123' as IsoCode)).toBeUndefined()
      expect(isoCodeToLanguage('!@#' as IsoCode)).toBeUndefined()
    })

    it('returns undefined for null and undefined inputs', () => {
      expect(isoCodeToLanguage(null as unknown as IsoCode)).toBeUndefined()
      expect(isoCodeToLanguage(undefined as unknown as IsoCode)).toBeUndefined()
    })
  })

  describe('isoWithRegionCode', () => {
    it('returns correct formatted string for valid ISO codes with default delimiter', () => {
      expect(isoWithRegionCode('en')).toBe('en-US')
      expect(isoWithRegionCode('uk')).toBe('fr-FR')
    })

    it('returns correct formatted string for valid ISO codes with various custom delimiters', () => {
      expect(isoWithRegionCode('en', '/')).toBe('en/US')
      expect(isoWithRegionCode('uk', ' ')).toBe('uk UK')
      expect(isoWithRegionCode('en', '')).toBe('enUS')
      expect(isoWithRegionCode('uk', '123')).toBe('uk123UK')
    })

    it('returns undefined for invalid ISO codes', () => {
      expect(isoWithRegionCode('123' as IsoCode)).toBeUndefined()
      expect(isoWithRegionCode('!@#' as IsoCode)).toBeUndefined()
    })

    it('returns undefined for null and undefined inputs', () => {
      expect(isoWithRegionCode(null as unknown as IsoCode)).toBeUndefined()
      expect(isoWithRegionCode(undefined as unknown as IsoCode)).toBeUndefined()
      expect(isoWithRegionCode('en', null)).toBe('en-US')
      expect(isoWithRegionCode('uk', undefined)).toBe('uk-UK')
    })
  })
})
