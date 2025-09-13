import packageJson from '../package.json'
import childProcess from 'node:child_process'
import fs from 'node:fs/promises'
import { type Plugin } from 'vite'


function executeExtraction() {
  childProcess.exec(packageJson.scripts['lingui:extract'], (_, _output, error) => {
    if (error) console.log(error)
  })
}

/**
 * While watching for lingui dictionary updates, triggers their compilation
 * @returns Vite plugin
 */
export default function linguiAutoCompile(): Plugin {
  const THROTTLE_TIMEOUT = 500
  let isThrottled = false

  return {
    name: 'watch-lingui-dictionaries',
    buildStart() {
      this.info('Checking lingui dictionaries')
      executeExtraction()
    },
    async handleHotUpdate({ file: fileName }) {
      if (isThrottled) return

      isThrottled = true
      setTimeout(() => (isThrottled = false), THROTTLE_TIMEOUT)

      const file = await fs.readFile(fileName)

      if (file.includes('<Trans') || file.includes('t(')) {
        this.info('Lingui-related files detected')
        executeExtraction()
      }
    }
  }
}
