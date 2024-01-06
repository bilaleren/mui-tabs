import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  base: '',
  resolve: {
    alias: [
      {
        find: /^@utils\/(.*)$/,
        replacement: path.resolve('../../src/utils/$1')
      },
      {
        find: /^mui-tabs\/styles\/(.*)$/,
        replacement: path.resolve('../../src/styles/$1')
      },
      {
        find: /^mui-tabs\/?(.*)?$/,
        replacement: path.resolve('../../src/web/$1')
      }
    ]
  }
})
