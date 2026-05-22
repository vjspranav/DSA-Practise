import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Required for SharedArrayBuffer (wasm threading)
      'Cross-Origin-Opener-Policy': 'same-origin',
      // credentialless allows cross-origin scripts without CORP headers
      // (unlike require-corp which blocked our CDN loads)
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  optimizeDeps: {
    // Let Vite pre-bundle JSCPP CJS → ESM
    include: ['JSCPP'],
    // Pyodide manages its own WASM loading; exclude from Rollup bundling
    exclude: ['pyodide'],
  },
})
