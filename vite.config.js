import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: false,
    sourcemap: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  cacheDir: '.vite-cache',
})
