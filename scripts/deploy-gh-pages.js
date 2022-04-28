require('dotenv/config')

const path = require('path')
const ghPages = require('gh-pages')
const pkg = require('../package.json')

const repoPath = pkg.repository.split('/').slice(-2).join('/')
const basePath = path.join(process.cwd(), 'example/build')

ghPages.clean()

ghPages.publish(
  basePath,
  {
    branch: 'example',
    repo: `https://${process.env.GH_TOKEN}@github.com/${repoPath}`
  },
  (err) => {
    if (err) {
      throw err
    }
    process.exit()
  }
)
