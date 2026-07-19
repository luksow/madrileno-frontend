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
