import path from 'path'
import sass from 'sass'
import glob from 'fast-glob'
import { promises as fs } from 'fs'

/**
 * @param options {import('./css-plugin').CssPluginOptions}
 * @returns {import('rollup').Plugin}
 */
const cssPlugin = (options) => ({
  name: 'css-plugin',
  buildEnd: async (err) => {
    if (err) {
      throw err
    }

    const paths = glob
      .sync(options.input, options.globOptions)
      .filter((value) => !path.basename(value).startsWith('_'))

    const cssRecord = {}
    const postcss = options.postcss()

    await fs.mkdir(path.resolve(__dirname, options.outputDir), {
      recursive: true
    })

    for (const file of paths) {
      const { css: compiledCss } = await sass.compileAsync(file)
      const { css } = await postcss.process(compiledCss, { from: file })
      const filename = path.basename(file).replace(/\.(c|sc|sa)ss$/, '.css')
      const outputPath = path.join(options.outputDir, filename)

      await fs.writeFile(outputPath, css, 'utf8')

      cssRecord[outputPath] = css
    }

    if (options.onEnd) {
      options.onEnd(cssRecord)
    }
  }
})

export default cssPlugin
