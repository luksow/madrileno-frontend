import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      include: ['test/**/*.test.{ts,tsx}'],
      // '' would mean same-origin, but Node fetch rejects relative URLs.
      env: { VITE_API_BASE_URL: 'http://localhost:9000' },
    },
  }),
)
