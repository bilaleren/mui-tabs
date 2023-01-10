import path from 'path'
import url from 'url'

export function getWorkspaceRoot() {
  const currentDirectory = url.fileURLToPath(new URL('.', import.meta.url))
  return path.resolve(currentDirectory, '..')
}
