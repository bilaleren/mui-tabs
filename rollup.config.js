import path from 'path'
import glob from 'fast-glob'
import postcss from 'postcss'
import cssnano from 'cssnano'
import copy from 'rollup-plugin-copy'
import autoprefixer from 'autoprefixer'
import cssPlugin from './plugins/css-plugin'
import typescript from 'rollup-plugin-typescript2'
import externals from 'rollup-plugin-node-externals'
import distFilesPlugin from './plugins/dist-files-plugin'

const sourceDir = path.resolve(__dirname, './src')

const entries = glob.sync(path.resolve(sourceDir, '**/*.{tsx,ts}'), {
  ignore: [
    path.resolve(sourceDir, 'test'),
    path.resolve(sourceDir, '**/*.{d,test}.{ts,tsx}')
  ]
})

const plugins = [
  externals({ deps: true, devDeps: true }),
  typescript({ tsconfig: path.resolve(__dirname, 'tsconfig.json') }),
  copy({
    targets: [{ src: 'src/styles/*', dest: 'dist/dist/scss' }]
  }),
  cssPlugin({
    input: path.join(__dirname, 'src/**/*.{css,scss}'),
    outputDir: path.join(__dirname, 'dist/dist'),
    globOptions: {
      ignore: [path.join(__dirname, 'src/styles/main-without-variables.scss')]
    },
    postcss: () => postcss([autoprefixer(), cssnano()])
  }),
  distFilesPlugin()
]

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: entries,
  plugins,
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
      globals: {
        react: 'React'
      }
    },
    {
      dir: 'dist',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
      globals: {
        react: 'React'
      }
    }
  ]
}
