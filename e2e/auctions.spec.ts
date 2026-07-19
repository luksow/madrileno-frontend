import { expect, test } from '@playwright/test'

const API = process.env.API_BASE_URL ?? 'http://localhost:9000'

// These demo flows drive the real backend (dev auth + a seeded auction), unlike
// the backend-free smoke suite. Fail fast with an actionable message instead of a
// cryptic ECONNREFUSED deep inside a test when the API isn't up.
test.beforeAll(async () => {
  const hint = `cd ../madrileno && docker compose up -d && sbt reStart`
  try {
    const res = await fetch(`${API}/v1/health-check`)
    if (!res.ok) throw new Error(`health-check returned ${res.status}`)
  } catch (cause) {
    throw new Error(
      `Backend not reachable at ${API} (${(cause as Error).message}). ` +
        `The auction e2e tests need it running with dev auth and a seeded auction — start it with: ${hint}`,
    )
  }
})

test('server renders the public auction list (raw HTML, no JS)', async ({ request }) => {
  const res = await request.get('/')
  expect(res.status()).toBe(200)
  const html = await res.text()
  expect(html).toContain('Wine auctions')
  expect(html).toContain('__RQ_STATE__')
})

test('hydration reuses the dehydrated cache — no client refetch', async ({ page }) => {
  const apiCalls: string[] = []
  page.on('request', (req) => {
    // Path prefix, not substring — Vite serves the vendored contracts under /src/contracts/v1/.
    if (new URL(req.url()).pathname.startsWith('/v1/auctions')) apiCalls.push(req.url())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Wine auctions' })).toBeVisible()
  await expect(page.getByRole('button', { name: '← Previous' })).toBeDisabled()
  expect(apiCalls).toHaveLength(0)
})

test('login → open auction → too-low bid shows the typed rejection', async ({ page, request }) => {
  const list = (await (await request.get(`${API}/v1/auctions`)).json()) as {
    items: { id: string }[]
  }
  const auction = list.items[0]
  expect(auction).toBeDefined()

  await page.goto('/login')
  await page.getByLabel('Email').fill('e2e@example.com')
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page.getByRole('heading', { name: 'Wine auctions' })).toBeVisible()

  await page.goto(`/auctions/${auction!.id}`)
  await page.getByLabel(/your bid/i).fill('1')
  await page.getByRole('button', { name: 'Place bid' }).click()
  await expect(page.getByText(/bid too low — someone got there first/i)).toBeVisible()
})
