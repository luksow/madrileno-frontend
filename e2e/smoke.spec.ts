import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('server renders public HTML with the dehydrated cache script', async ({ request }) => {
  const res = await request.get('/')
  expect(res.status()).toBe(200)
  const html = await res.text()
  expect(html).toMatch(/<h1[\s>]/)
  expect(html).toContain('__RQ_STATE__')
})

test('healthz answers', async ({ request }) => {
  const res = await request.get('/healthz')
  expect(res.status()).toBe(200)
})

// Enforce accessibility in CI: the login page is fully backend-free, so this
// runs without a running API. Fails the build on any WCAG A/AA violation.
test('login page has no accessibility violations', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('heading', { name: 'Log in' }).waitFor()
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  expect(results.violations).toEqual([])
})
