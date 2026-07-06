import { defineConfig, devices } from '@playwright/test'

// Needs the backend running with dev auth and one auction; not part of CI.
// npm run e2e — dev SSR (:5177); npm run e2e:prod — built bundle (:5178).
const prod = process.env.E2E_PROD === '1'
const port = prod ? 5178 : 5177

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: `http://localhost:${String(port)}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node server.js',
    port,
    env: {
      PORT: String(port),
      API_BASE_URL: 'http://localhost:9000',
      ...(prod ? { NODE_ENV: 'production' } : {}),
    },
    reuseExistingServer: !prod,
  },
})
