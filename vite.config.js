import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Use esbuild for minification to avoid adding terser as a dependency
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
