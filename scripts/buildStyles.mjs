import path from 'path'
import sass from 'sass'
import glob from 'fast-glob'
import postcss from 'postcss'
import cssnano from 'cssnano'
import fs from 'fs/promises'
import { program } from 'commander'
import autoprefixer from 'autoprefixer'
import { getWorkspaceRoot } from './utils.mjs'

const workspaceRoot = getWorkspaceRoot()
const distDir = path.resolve(workspaceRoot, 'dist')

const Postcss = postcss([
  cssnano(),
  autoprefixer({ env: 'postcss' })
])

async function buildStyles(args) {
  const outDir = args.outDir
  const sourceDir = args.sourceDir
  const copySourceTo = args.copySourceTo
  const outputPath = path.resolve(distDir, outDir)
  const sourcePath = path.resolve('./src', sourceDir)

  const files = glob
    .sync(path.join(sourcePath, '*.scss'))
    .filter((value) => !path.basename(value).startsWith('_'))

  await fs.mkdir(outputPath, {
    recursive: true
  })

  if (copySourceTo) {
    await fs.cp(
      sourcePath,
      path.join(outputPath, copySourceTo),
      { recursive: true }
    )
  }

  for (const file of files) {
    const { css: compliedCss } = await sass.compileAsync(file)
    const { css } = await Postcss.process(compliedCss, { from: file })
    const filename = path.basename(file).replace(/\.(c|sc|sa)ss$/, '.css')
    const outputFilePath = path.join(outputPath, filename)

    await fs.writeFile(outputFilePath, css, 'utf8')
  }
}

program
  .name(path.basename(import.meta.url))
  .option('--copy-source-to <copySourceTo>')
  .requiredOption('-s, --source-dir <sourceDir>')
  .requiredOption('-o, --out-dir <outDir>')
  .action(buildStyles)
  .parse()
