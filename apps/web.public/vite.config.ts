// Core
import { defineConfig } from 'vite'
import { lingui as LinguiCorePlugin } from '@lingui/vite-plugin'

// Extensions
import { tsConfig2ViteAliasTransfer } from './extensions/tsConfig2ViteAliasTransfer.helper'
import LinguiAutoCompilePlugin from './extensions/lingui-autocompile.plugin'
import ReactPlugin from '@vitejs/plugin-react-swc'

// Local
import { version, author, description } from './package.json'
import tsconfig from './tsconfig.app.json'


/**
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [
    ReactPlugin({ 
      plugins: [["@lingui/swc-plugin", {}]]
    }),
    LinguiCorePlugin(),
    LinguiAutoCompilePlugin(),
  ],
  define: {
    __APP_DESCRIPTION: JSON.stringify(description),
    __APP_VERSION__: JSON.stringify(version),
    __APP_AUTHOR__: JSON.stringify(author),
  },
  resolve: {
    alias: tsConfig2ViteAliasTransfer(tsconfig),
  },
})
