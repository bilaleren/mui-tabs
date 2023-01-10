import path from 'path'
import { promisify } from 'util'
import { program } from 'commander'
import childProcess from 'child_process'
import { getWorkspaceRoot } from './utils.mjs'

const execAsync = promisify(childProcess.exec)
const workspaceRoot = getWorkspaceRoot()

const ignore = [
  '**/test',
  '**/*.test.js',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/*.d.ts'
]
const extensions = ['.js', '.ts', '.tsx']

const distDir = path.resolve(workspaceRoot, 'dist')
const babelConfigPath = path.resolve(workspaceRoot, 'babel.config.js')

async function build(args) {
  const babelEnv = args.env
  const outDir = args.outDir
  const srcDir = path.resolve('./src')

  const env = {
    NODE_ENV: 'production',
    BABEL_ENV: babelEnv
  }

  const babelArgs = [
    '--config-file',
    babelConfigPath,
    '--extensions',
    `"${extensions.join(',')}"`,
    srcDir,
    '--out-dir',
    path.resolve(distDir, outDir),
    '--ignore',
    // Need to put these patterns in quotes otherwise they might be evaluated by the used terminal.
    `"${ignore.join('","')}"`
  ]

  const command = `babel ${babelArgs.join(' ')}`

  const { stdout, stderr } = await execAsync(command, {
    env: { ...process.env, ...env }
  })

  if (stderr) {
    throw new Error(`'${command}' failed with\n${stderr}`)
  }

  console.log(stdout)
}

program
  .name(path.basename(import.meta.url))
  .requiredOption('-e, --env <env>', 'environment for `Browserslist`')
  .requiredOption('-o, --out-dir <outDir>', undefined, '.')
  .action(build)
  .parse()
