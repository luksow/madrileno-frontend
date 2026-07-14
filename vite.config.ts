import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Manifest name follows the package name, so `init-project` renaming package.json
// re-brands the installed app too — no separate manifest edit needed.
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as {
  name: string
}
const appName = pkg.name.replace(/-frontend$/, '')

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
            // Rasterize the icon set (incl. the iOS apple-touch-icon) at build time
            // from pwa-assets.config.ts, and inject the head links / manifest icons.
            pwaAssets: { config: true, overrideManifestIcons: true },
            manifest: {
              name: appName,
              short_name: appName,
              description: 'Frontend built against the generated API contract',
              theme_color: '#5b21b6',
              background_color: '#5b21b6',
              display: 'standalone',
              start_url: '/',
              scope: '/',
            },
            workbox: {
              // Precache the built app shell (JS/CSS/HTML/fonts/icons) for offline.
              // API responses are deliberately NOT cached — see README follow-ups.
              globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
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
