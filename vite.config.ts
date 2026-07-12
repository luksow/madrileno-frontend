import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Same-origin /v1 in dev — no CORS needed on the backend. See README for production.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // The service worker is a client artifact; skip PWA generation in the SSR bundle.
    ...(isSsrBuild
      ? []
      : [
          VitePWA({
            registerType: 'prompt',
            // Registered from src/app/registerPwa.ts, so the prod nonce CSP has no
            // injected inline <script> to whitelist.
            injectRegister: null,
            includeAssets: ['favicon.svg'],
            manifest: {
              name: 'madrileno',
              short_name: 'madrileno',
              description: 'Reference frontend for the madrileno backend template',
              theme_color: '#5b21b6',
              background_color: '#5b21b6',
              display: 'standalone',
              start_url: '/',
              scope: '/',
              icons: [
                { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
                { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
              ],
            },
            workbox: {
              // Precache the built app shell (JS/CSS/HTML/fonts/icons) for offline.
              // API responses are deliberately NOT cached — see README follow-ups.
              globPatterns: ['**/*.{js,css,html,svg,woff2}'],
              navigateFallback: '/index.html',
              // Never answer API calls or health probes from the app-shell cache.
              navigateFallbackDenylist: [/^\/v1\//, /^\/healthz$/],
            },
          }),
        ]),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/v1': {
        target: process.env.API_BASE_URL ?? 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
}))
