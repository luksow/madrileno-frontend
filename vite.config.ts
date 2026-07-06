import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Same-origin /v1 in dev — no CORS needed on the backend. See README for production.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: process.env.API_BASE_URL ?? 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
})
