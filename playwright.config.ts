import { defineConfig, devices } from '@playwright/test'

// E2E against the SSR server — one suite covers server-rendering, hydration,
// and the interactive flows. Needs the backend running with dev auth enabled
// and at least one auction (see README); deliberately not part of CI.
//
// Two modes, same tests:
//   npm run e2e       — dev SSR (Vite middleware), port 5177
//   npm run e2e:prod  — the built production bundle (dist/), port 5178
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
