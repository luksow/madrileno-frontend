import { http, HttpResponse } from 'msw'
import { beforeAll, describe, expect, it } from 'vitest'
import { registerAuthTokenProvider, tokenStore } from '../auth/tokenStore'
import { server } from '../testing/mswServer'
import { makeApiClient } from './orpc'

const BASE = 'http://api.test'
const USER = { id: '019ed9bb-0000-7000-8000-000000000042', emailVerified: true }
const REFRESHED = {
  jwt: 'fresh-jwt',
  refreshToken: '22222222-2222-4222-8222-222222222222',
  userCreated: false,
}

beforeAll(() => {
  registerAuthTokenProvider()
})

function loggedIn() {
  tokenStore.set({
    jwt: 'stale-jwt',
    refreshToken: '11111111-1111-4111-8111-111111111111',
    email: 'test@example.com',
  })
}

function usersMe401Until(fresh: string) {
  return http.get(`${BASE}/v1/users/me`, ({ request }) => {
    if (request.headers.get('authorization') === `Bearer ${fresh}`) {
      return HttpResponse.json(USER)
    }
    return HttpResponse.json(
      { type: 'rejection:authentication-failed', status: 401, title: 'Could not authorize' },
      { status: 401 },
    )
  })
}

describe('the authorized fetch behind the oRPC client', () => {
  it('injects the bearer token, refreshes once on 401, and retries', async () => {
    loggedIn()
    let refreshCalls = 0
    server.use(
      usersMe401Until('fresh-jwt'),
      http.post(`${BASE}/v1/auth/refresh-token`, () => {
        refreshCalls += 1
        return HttpResponse.json(REFRESHED)
      }),
    )

    const user = await makeApiClient(BASE)['v1-users-me'].get()

    expect(user.id).toBe(USER.id)
    expect(refreshCalls).toBe(1)
    expect(tokenStore.get()?.jwt).toBe('fresh-jwt')
    expect(tokenStore.get()?.refreshToken).toBe(REFRESHED.refreshToken)
  })

  it('deduplicates concurrent 401s into a single refresh (token rotation safety)', async () => {
    loggedIn()
    let refreshCalls = 0
    server.use(
      usersMe401Until('fresh-jwt'),
      http.post(`${BASE}/v1/auth/refresh-token`, async () => {
        refreshCalls += 1
        // Delay so the second 401 arrives while the first refresh is in flight.
        await new Promise((r) => setTimeout(r, 25))
        return HttpResponse.json(REFRESHED)
      }),
    )

    const client = makeApiClient(BASE)
    const [a, b] = await Promise.all([client['v1-users-me'].get(), client['v1-users-me'].get()])

    // Without single-flight the second refresh would present the already-used
    // (rotated) token and kill the session.
    expect(refreshCalls).toBe(1)
    expect(a.id).toBe(USER.id)
    expect(b.id).toBe(USER.id)
    expect(tokenStore.get()?.jwt).toBe('fresh-jwt')
  })

  it('logs out when the refresh token is rejected (the 401 propagates as an error)', async () => {
    loggedIn()
    const reject401 = () =>
      HttpResponse.json(
        { type: 'rejection:authentication-failed', status: 401, title: 'Could not authorize' },
        { status: 401 },
      )
    server.use(
      http.get(`${BASE}/v1/users/me`, reject401),
      http.post(`${BASE}/v1/auth/refresh-token`, reject401),
    )

    await expect(makeApiClient(BASE)['v1-users-me'].get()).rejects.toThrow()
    expect(tokenStore.get()).toBeNull()
  })

  it('sends no bearer header when logged out', async () => {
    tokenStore.set(null)
    let sawAuthHeader: string | null = 'unset'
    server.use(
      http.get(`${BASE}/v1/users/me`, ({ request }) => {
        sawAuthHeader = request.headers.get('authorization')
        return HttpResponse.json(USER)
      }),
    )

    const user = await makeApiClient(BASE)['v1-users-me'].get()

    expect(user.id).toBe(USER.id)
    expect(sawAuthHeader).toBeNull()
  })
})
