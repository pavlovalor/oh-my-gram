import { defineConfig } from '@lingui/cli'
import { LOCALES, DEFAULT_LOCALE } from './src/locales/iso-codes'


/**
 * @see https://lingui.dev/ref/conf
 */
export default defineConfig({
  locales: LOCALES,
  sourceLocale: DEFAULT_LOCALE,
  catalogs: [{
    path: '<rootDir>/src/locales/dictionaries/{locale}',
    exclude: ['**/node_modules/**'],
    include: ['src'],
  }],
})
