import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cp, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

// Copy Pyodide runtime files to dist so they're served from the same origin.
// Vite doesn't bundle node_modules that are excluded from optimizeDeps (WASM).
function copyPyodide() {
  return {
    name: 'copy-pyodide',
    async writeBundle(options) {
      const dest = join(options.dir, 'node_modules', 'pyodide')
      await mkdir(dest, { recursive: true })
      const files = [
        'pyodide-lock.json',
        'pyodide.asm.js',
        'pyodide.asm.wasm',
        'python_stdlib.zip',
      ]
      await Promise.all(
        files.map(f => cp(
          join('node_modules', 'pyodide', f),
          join(dest, f),
          { force: true }
        ))
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), copyPyodide()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  optimizeDeps: {
    include: ['JSCPP'],
    exclude: ['pyodide'],
  },
})
