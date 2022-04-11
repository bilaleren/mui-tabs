const { promises: fs } = require('fs')
const path = require('path')

const IGNORE_FILES = ['LICENCE', 'README.md', 'package.json']

const dist = path.join(process.cwd(), 'dist')
const readme = path.join(process.cwd(), 'README.md')
const licence = path.join(process.cwd(), 'LICENCE')
const packageJson = path.join(process.cwd(), 'package.json')

async function copyFiles() {
  await Promise.all([
    fs.copyFile(licence, path.join(dist, 'LICENCE')),
    fs.copyFile(readme, path.join(dist, 'README.md')),
    fs.copyFile(packageJson, path.join(dist, 'package.json'))
  ])
}

async function getDistFiles() {
  const files = await fs.readdir(dist, 'utf8')
  return files.filter(
    (file) => !(IGNORE_FILES.includes(file) || file.endsWith('.tgz'))
  )
}

async function writeFilesToPackageJson() {
  const packageJsonContent = JSON.parse(await fs.readFile(packageJson, 'utf8'))

  await fs.writeFile(
    packageJson,
    JSON.stringify(
      {
        ...packageJsonContent,
        files: await getDistFiles()
      },
      null,
      2
    ),
    'utf8'
  )
}

/**
 * @returns {import('rollup').Plugin}
 */
const distFilesPlugin = () => ({
  name: 'dist-files',
  closeBundle: async () => {
    await copyFiles()
    await writeFilesToPackageJson()
  }
})

export default distFilesPlugin
