import path from 'path'
import fs from 'fs/promises'

const IGNORE_FILES = ['LICENCE', 'README.md', 'package.json']

const distPath = path.join(process.cwd(), 'dist')
const readmePath = path.join(process.cwd(), 'README.md')
const licencePath = path.join(process.cwd(), 'LICENCE')
const packageJsonPath = path.join(process.cwd(), 'package.json')

async function getPackageJson(removePrivate = false) {
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))

  if (removePrivate) {
    delete packageJson.private
  }

  return packageJson
}

async function copyFiles() {
  await Promise.all([
    fs.copyFile(licencePath, path.join(distPath, 'LICENCE')),
    fs.copyFile(readmePath, path.join(distPath, 'README.md')),
    fs.writeFile(
      path.join(distPath, 'package.json'),
      JSON.stringify(await getPackageJson(true), null, 2)
    )
  ])
}

async function getDistFiles() {
  const files = await fs.readdir(distPath, 'utf8')

  return files.filter(
    (file) => !(IGNORE_FILES.includes(file) || file.endsWith('.tgz'))
  )
}

async function writeFilesToPackageJson() {
  const packageJson = await getPackageJson()

  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(
      {
        ...packageJson,
        files: await getDistFiles()
      },
      null,
      2
    ),
    'utf8'
  )
}

async function generatePackageJson() {
  await writeFilesToPackageJson()
  await copyFiles()
}

generatePackageJson().catch()
