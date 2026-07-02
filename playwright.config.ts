import { defineConfig, devices } from '@playwright/test'

// E2E against the SSR server — one suite covers server-rendering, hydration,
// and the interactive flows. Needs the backend running with dev auth enabled
// and at least one auction (see README); deliberately not part of CI.
export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:5177' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node server.js',
    port: 5177,
    env: { PORT: '5177', API_BASE_URL: 'http://localhost:9000' },
    reuseExistingServer: true,
  },
})
