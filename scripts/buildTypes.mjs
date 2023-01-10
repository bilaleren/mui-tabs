import path from 'path'
import { promisify } from 'util'
import { program } from 'commander'
import childProcess from 'child_process'
import { getWorkspaceRoot } from './utils.mjs'

const execAsync = promisify(childProcess.exec)
const workspaceRoot = getWorkspaceRoot()
const distDir = path.resolve(workspaceRoot, 'dist')

async function buildTypes(args) {
  const outDir = args.outDir
  const tsconfigPath = path.resolve('./tsconfig.json')
  const declarationDir = path.resolve(distDir, outDir)

  const buildTypesArgs = [
    '--project',
    `"${tsconfigPath}"`,
    '--declaration',
    '--emitDeclarationOnly',
    '--declarationDir',
    `"${declarationDir}"`,
    '--noEmit false'
  ]

  const command = `tsc ${buildTypesArgs.join(' ')}`

  const { stdout, stderr } = await execAsync(command)

  if (stderr) {
    throw new Error(`'${command}' failed with\n${stderr}`)
  }

  console.log(stdout)
}

program
  .name(path.basename(import.meta.url))
  .requiredOption('-o, --out-dir <outDir>')
  .action(buildTypes)
  .parse()
