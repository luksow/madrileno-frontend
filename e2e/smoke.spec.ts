import { expect, test } from '@playwright/test'

const API = 'http://localhost:9000'

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
    // Path prefix, not substring: in dev Vite serves the vendored contract
    // sources under /src/contracts/v1/, which must not count as API traffic.
    if (new URL(req.url()).pathname.startsWith('/v1/auctions')) apiCalls.push(req.url())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Wine auctions' })).toBeVisible()
  // Interactivity proves hydration happened; the pager state proves React took over.
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
  // Dispatched on the stable `bid-too-low` problem tag, not response text.
  await expect(page.getByText(/bid too low — someone got there first/i)).toBeVisible()
})
