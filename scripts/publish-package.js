const path = require('path')
const pkg = require('../package.json')
const { exec } = require('child_process')

const distDirectory = path.join(process.cwd(), 'dist')
const tarballPath = path.join(distDirectory, `${pkg.name}-v${pkg.version}.tgz`)

async function createTarball() {
  return new Promise((resolve, reject) => {
    exec(`cd ${distDirectory} && yarn pack`, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }

      if (stderr) {
        return reject(stderr)
      }

      return resolve(stdout)
    })
  })
}

async function publishTarball() {
  return new Promise((resolve, reject) => {
    exec(
      `yarn publish ${tarballPath} --new-version ${pkg.version}`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(error)
        }

        if (stderr) {
          return reject(stderr)
        }

        resolve(stdout)
      }
    )
  })
}

async function publishPackage() {
  try {
    console.log(await createTarball())
    console.log(await publishTarball())
    process.exit()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

publishPackage().catch()
