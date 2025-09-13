import { type AliasOptions } from 'vite'
import path from 'node:path'

interface TsConfigMinimals {
  compilerOptions?: {
    paths?: Record<string, string[]>,
  },
}

export function tsConfig2ViteAliasTransfer(tsconfig: TsConfigMinimals): AliasOptions {
  const aliases = Object.entries(tsconfig.compilerOptions?.paths ?? {})
  return aliases.map(([alias, template]) => ({
    replacement: path.resolve(__dirname, '../', template[0].replace(/\/\*$/, '')),
    find: alias.replace(/\/\*$/, ''),
  }))
}