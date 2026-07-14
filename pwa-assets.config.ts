import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Rasterizes public/pwa-icon.svg into the PNG set PWAs actually need — including
// the iOS apple-touch-icon that SVG can't cover. Generated during `vite build`
// (see vite.config.ts → VitePWA.pwaAssets), not committed. Regenerate a source
// change with `pnpm run generate-pwa-assets`.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: minimal2023Preset,
  images: ['public/pwa-icon.svg'],
})
