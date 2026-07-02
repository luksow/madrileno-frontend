import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The dev proxy makes the browser see the API as same-origin, so the backend
// needs no CORS configuration in development. Production is different: a
// separately-deployed frontend sets VITE_API_BASE_URL and the backend's
// CORS_ALLOWED_ORIGINS. See README.
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
