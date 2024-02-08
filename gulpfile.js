const gulp = require('gulp')
const path = require('path')
const sass = require('sass')
const ghPages = require('gh-pages')
const through = require('through2')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const shell = require('gulp-shell')
const pkg = require('./package.json')

require('dotenv/config')

/**
 * @param outDir {string}
 * @return {string}
 */
function tsc(outDir) {
  const tsconfigPath = path.resolve('./tsconfig.build.json')

  const args = [
    '--project',
    `"${tsconfigPath}"`,
    '--declaration',
    '--emitDeclarationOnly',
    '--declarationDir',
    `"${outDir}"`,
    '--noEmit false'
  ]

  return `tsc ${args.join(' ')}`
}

/**
 * @typedef {object} BabelConfig
 * @property {string} sourceDir
 * @property {string} outDir
 * @property {string} configFile
 * @property {boolean} [watch]
 */

/**
 * @param config {BabelConfig}
 * @return string
 */
function babel(config) {
  const ignore = [
    '**/test',
    '**/*.d.ts',
    '**/__tests__',
    '**/types.{ts,tsx}',
    '**/*.{test,spec}.{ts,tsx}'
  ]
  const extensions = ['.js', '.ts', '.tsx']
  const { sourceDir, outDir, configFile, watch = false } = config

  const args = [
    '--config-file',
    path.resolve(configFile),
    '--extensions',
    `"${extensions.join(',')}"`,
    sourceDir,
    '--out-dir',
    outDir,
    '--ignore',
    `"${ignore.join('","')}"`,
    '--no-comments'
  ]

  if (watch) {
    args.push('--watch')
  }

  return `babel ${args.join(' ')}`
}

gulp.task('build-web-example', shell.task('yarn build-web-example'))

gulp.task(
  'deploy-gh-pages',
  gulp.series('build-web-example', function deploy(done) {
    const GH_TOKEN = process.env.GH_TOKEN
    const GH_PAGES_BRANCH = process.env.GH_PAGES_BRANCH

    if (!GH_TOKEN) {
      throw new Error(
        'The GH_TOKEN environment variable could not be provided. Check the .env file.'
      )
    }

    if (!GH_PAGES_BRANCH) {
      throw new Error(
        'The GH_PAGES_BRANCH environment variable could not be provided. Check the .env file.'
      )
    }

    const repoPath = pkg.repository.split('/').slice(-2).join('/')
    const repo = `https://${GH_TOKEN}@github.com/${repoPath}`
    const basePath = path.resolve('./examples/web-example/dist')

    ghPages
      .publish(basePath, {
        repo,
        branch: GH_PAGES_BRANCH
      })
      .then(() => done())
      .catch((error) => done(error))
  })
)

gulp.task(
  'build-esm',
  shell.task(
    babel({
      sourceDir: './src',
      outDir: './lib/esm',
      configFile: '.babelrc.esm.json'
    })
  )
)

gulp.task(
  'build-cjs',
  shell.task(
    babel({
      sourceDir: './src',
      outDir: './lib/cjs',
      configFile: '.babelrc.cjs.json'
    })
  )
)

gulp.task('build-types', shell.task(tsc('./lib/types')))

gulp.task('build-styles', () => {
  return gulp
    .src('./src/styles/*.scss', {
      ignore: ['./src/styles/_*.scss']
    })
    .pipe(
      through.obj((chunk, enc, callback) => {
        sass
          .compileAsync(chunk.path, {
            style: 'compressed'
          })
          .then((value) => value.css)
          .then((css) => {
            return postcss([autoprefixer({ env: 'postcss' })])
              .process(css)
              .then((result) => result.css)
          })
          .then((css) => {
            chunk.path = chunk.path.replace(/\.scss$/, '.css')
            chunk.contents = Buffer.from(css)
            callback(null, chunk)
          })
          .catch((error) => callback(error))
      })
    )
    .pipe(gulp.dest('./lib/styles'))
})

gulp.task('copy-styles', () => {
  return gulp.src('./src/styles/*').pipe(gulp.dest('./lib/styles/scss'))
})

gulp.task(
  'build',
  gulp.series(
    'build-esm',
    'build-cjs',
    'build-types',
    'build-styles',
    'copy-styles'
  )
)
