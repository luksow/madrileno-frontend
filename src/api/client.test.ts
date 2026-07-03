import { http, HttpResponse } from 'msw'
import { beforeAll, describe, expect, it } from 'vitest'
import { registerAuthTokenProvider, tokenStore } from '../auth/tokenStore'
import { v1UsersMeContract } from '../contracts/v1-users-me.contract'
import { server } from '../testing/mswServer'
import { makeClient } from './client'

beforeAll(() => {
  registerAuthTokenProvider()
})

const BASE = 'http://api.test'
const USER = { id: '019ed9bb-0000-7000-8000-000000000042', emailVerified: true }
const REFRESHED = {
  jwt: 'fresh-jwt',
  refreshToken: '22222222-2222-4222-8222-222222222222',
  userCreated: false,
}

function loggedIn() {
  tokenStore.set({
    jwt: 'stale-jwt',
    refreshToken: '11111111-1111-4111-8111-111111111111',
    email: 'test@example.com',
  })
}

describe('makeClient', () => {
  it('injects the bearer token, refreshes once on 401, and retries', async () => {
    loggedIn()
    let refreshCalls = 0
    server.use(
      http.get(`${BASE}/v1/users/me`, ({ request }) => {
        if (request.headers.get('authorization') === 'Bearer fresh-jwt') {
          return HttpResponse.json(USER)
        }
        return HttpResponse.json(
          { type: 'rejection:authentication-failed', status: 401, title: 'Could not authorize' },
          { status: 401 },
        )
      }),
      http.post(`${BASE}/v1/auth/refresh-token`, () => {
        refreshCalls += 1
        return HttpResponse.json(REFRESHED)
      }),
    )

    const res = await makeClient(v1UsersMeContract, BASE).get()

    expect(res.status).toBe(200)
    expect(refreshCalls).toBe(1)
    expect(tokenStore.get()?.jwt).toBe('fresh-jwt')
    expect(tokenStore.get()?.refreshToken).toBe(REFRESHED.refreshToken)
  })

  it('deduplicates concurrent 401s into a single refresh (token rotation safety)', async () => {
    loggedIn()
    let refreshCalls = 0
    server.use(
      http.get(`${BASE}/v1/users/me`, ({ request }) => {
        if (request.headers.get('authorization') === 'Bearer fresh-jwt') {
          return HttpResponse.json(USER)
        }
        return HttpResponse.json(
          { type: 'rejection:authentication-failed', status: 401, title: 'Could not authorize' },
          { status: 401 },
        )
      }),
      http.post(`${BASE}/v1/auth/refresh-token`, async () => {
        refreshCalls += 1
        // Delay so the second 401 arrives while the first refresh is in flight.
        await new Promise((r) => setTimeout(r, 25))
        return HttpResponse.json(REFRESHED)
      }),
    )

    const client = makeClient(v1UsersMeContract, BASE)
    const [a, b] = await Promise.all([client.get(), client.get()])

    // Without single-flight the second refresh would present the already-used
    // (rotated) token and kill the session.
    expect(refreshCalls).toBe(1)
    expect(a.status).toBe(200)
    expect(b.status).toBe(200)
    expect(tokenStore.get()?.jwt).toBe('fresh-jwt')
  })

  it('logs out when the refresh token is rejected', async () => {
    loggedIn()
    server.use(
      http.get(`${BASE}/v1/users/me`, () =>
        HttpResponse.json(
          { type: 'rejection:authentication-failed', status: 401, title: 'Could not authorize' },
          { status: 401 },
        ),
      ),
      http.post(`${BASE}/v1/auth/refresh-token`, () =>
        HttpResponse.json(
          { type: 'rejection:authentication-failed', status: 401, title: 'Could not authorize' },
          { status: 401 },
        ),
      ),
    )

    const res = await makeClient(v1UsersMeContract, BASE).get()

    expect(res.status).toBe(401)
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

    const res = await makeClient(v1UsersMeContract, BASE).get()

    expect(res.status).toBe(200)
    expect(sawAuthHeader).toBeNull()
  })
})
