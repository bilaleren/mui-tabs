import { exec } from 'child_process'

/**
 * @param options {Record<string, any>}
 * @return {import('rollup').Plugin}
 */
function tsDeclaration(options) {
  const { tsconfig, outputPath } = options

  return {
    name: 'declaration-plugin',
    closeBundle() {
      const command = `tsc -p "${tsconfig}" --declaration --emitDeclarationOnly --declarationDir "${outputPath}" --noEmit false`

      exec(command, (error, stdout) => {
        if (error) {
          console.error('declaration plugin error:', error)
          return
        }

        console.log(stdout)
      })
    }
  }
}

export default tsDeclaration
