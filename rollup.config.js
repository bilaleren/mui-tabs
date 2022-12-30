import path from 'path'
import glob from 'fast-glob'
import postcss from 'postcss'
import cssnano from 'cssnano'
import pkg from './package.json'
import copy from 'rollup-plugin-copy'
import autoprefixer from 'autoprefixer'
import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import cssPlugin from './plugins/css-plugin'
import tsDeclaration from './plugins/tsDeclaration'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodeExternals from 'rollup-plugin-node-externals'

const external = [/@babel\/runtime/]
const extensions = ['.js', '.jsx', '.ts', '.tsx']

const distDir = path.join(__dirname, 'dist')
const packagesDir = path.join(__dirname, 'packages')
const webSourceDir = path.resolve(packagesDir, 'web/src')
const utilsSourceDir = path.resolve(packagesDir, 'utils/src')
const nativeSourceDir = path.resolve(packagesDir, 'native/src')

function getEntries(sourceDir) {
  return glob.sync(path.resolve(sourceDir, '**/*.{tsx,ts}'), {
    ignore: [
      path.resolve(sourceDir, 'test'),
      path.resolve(sourceDir, '**/types.ts'),
      path.resolve(sourceDir, '**/*.d.{ts,tsx}'),
      path.resolve(sourceDir, '**/*.test.{ts,tsx}')
    ]
  })
}

function getAliases(esModules = false) {
  return alias({
    entries: [
      {
        find: '@mui-tabs/utils/src',
        replacement: esModules ? '../../utils/esm' : '../utils'
      }
    ],
    customResolver: (id) => ({
      id: `${id}.js`,
      external: 'relative'
    })
  })
}

function getExternals(sourceDir) {
  return nodeExternals({
    deps: true,
    devDeps: true,
    peerDeps: true,
    packagePath: path.resolve(sourceDir, '..', 'package.json')
  })
}

function getBabelConfig(options = {}) {
  const { sourceDir, targets = 'defaults', useESModules = false } = options

  return babel({
    extensions,
    babelHelpers: 'runtime',
    include: [path.resolve(sourceDir, '**/*')],
    presets: [
      [
        '@babel/preset-env',
        {
          targets
        }
      ],
      '@babel/preset-flow',
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: true,
          regenerator: true,
          version: '7.0.0-beta.0',
          useESModules
        }
      ]
    ]
  })
}

function getTsConfigPath(sourceDir) {
  return path.resolve(sourceDir, '..', 'tsconfig.json')
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [
  // Utils cjs
  {
    input: getEntries(utilsSourceDir),
    external: [...external, 'react'],
    plugins: [
      nodeResolve({ extensions }),
      getBabelConfig({
        sourceDir: utilsSourceDir,
        targets: pkg.browserslist
      }),
      tsDeclaration({
        tsconfig: getTsConfigPath(utilsSourceDir),
        outputPath: path.join(distDir, 'utils')
      })
    ],
    output: {
      dir: 'dist/utils',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
      globals: {}
    }
  },
  // Utils esm
  {
    input: getEntries(utilsSourceDir),
    external: [...external, 'react'],
    plugins: [
      getExternals(webSourceDir),
      nodeResolve({ extensions }),
      getBabelConfig({
        sourceDir: utilsSourceDir,
        targets: ['node 14'],
        useESModules: true
      }),
      tsDeclaration({
        tsconfig: getTsConfigPath(utilsSourceDir),
        outputPath: path.join(distDir, 'utils/esm')
      })
    ],
    output: {
      dir: 'dist/utils/esm',
      format: 'esm',
      exports: 'named',
      preserveModules: true,
      globals: {}
    }
  },
  // Web cjs
  {
    input: getEntries(webSourceDir),
    external,
    plugins: [
      getAliases(),
      getExternals(webSourceDir),
      nodeResolve({ extensions }),
      getBabelConfig({
        sourceDir: webSourceDir,
        targets: pkg.browserslist,
        useESModules: false
      }),
      tsDeclaration({
        tsconfig: getTsConfigPath(webSourceDir),
        outputPath: path.join(__dirname, 'dist')
      })
    ],
    output: {
      dir: 'dist',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
      globals: {}
    }
  },
  // Web esm
  {
    input: getEntries(webSourceDir),
    external,
    plugins: [
      getAliases(true),
      getExternals(webSourceDir),
      nodeResolve({ extensions }),
      getBabelConfig({
        sourceDir: webSourceDir,
        targets: ['node 14'],
        useESModules: true
      }),
      copy({
        targets: [
          {
            src: path.join(webSourceDir, 'styles/*'),
            dest: 'dist/dist/scss'
          }
        ]
      }),
      cssPlugin({
        input: path.join(webSourceDir, '**/*.{css,scss}'),
        outputDir: path.join(__dirname, 'dist/dist'),
        postcss: () => postcss([autoprefixer(), cssnano()])
      }),
      tsDeclaration({
        tsconfig: getTsConfigPath(webSourceDir),
        outputPath: path.join(__dirname, 'dist/esm')
      })
    ],
    output: {
      dir: 'dist/esm',
      format: 'esm',
      exports: 'named',
      preserveModules: true,
      globals: {}
    }
  },
  // Native
  {
    input: getEntries(nativeSourceDir),
    external,
    plugins: [
      getAliases(true),
      getExternals(nativeSourceDir),
      nodeResolve({ extensions }),
      getBabelConfig({
        sourceDir: nativeSourceDir,
        targets: ['node 14'],
        useESModules: true
      }),
      tsDeclaration({
        tsconfig: getTsConfigPath(nativeSourceDir),
        outputPath: path.join(__dirname, 'dist', 'native')
      })
    ],
    output: {
      dir: 'dist/native',
      format: 'esm',
      preserveModules: true,
      globals: {}
    }
  }
]
