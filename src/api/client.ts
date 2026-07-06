// Auth-aware fetch used by the oRPC link: bearer injection plus a single
// 401 -> refresh -> retry pass, transparent to callers. Token access goes
// through a provider registered by the auth layer (registerAuthTokenProvider),
// so the dependency points auth -> api.
export interface TokenProvider {
  jwt(): string | undefined
  refreshToken(): string | undefined
  rotated(jwt: string, refreshToken: string): void
  invalidated(): void
}

let provider: TokenProvider | null = null

export function setTokenProvider(tokenProvider: TokenProvider): void {
  provider = tokenProvider
}

async function doRefresh(baseUrl: string): Promise<string | null> {
  const p = provider
  const refreshToken = p?.refreshToken()
  if (p === null || refreshToken === undefined) return null
  const res = await globalThis.fetch(`${baseUrl}/v1/auth/refresh-token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (res.status !== 200) {
    // The refresh token itself was rejected: the session is over.
    p.invalidated()
    return null
  }
  const body = (await res.json()) as { jwt: string; refreshToken: string }
  p.rotated(body.jwt, body.refreshToken)
  return body.jwt
}

// Single-flight: concurrent 401s share one refresh. Without this, the second
// caller would present the already-rotated (single-use) token and kill the
// session.
let refreshInFlight: Promise<string | null> | null = null

function refreshOnce(baseUrl: string): Promise<string | null> {
  refreshInFlight ??= doRefresh(baseUrl).finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

export function makeAuthorizedFetch(baseUrl: string): typeof globalThis.fetch {
  return async (input, init) => {
    // Normalize to a Request so the attempt can be replayed after a refresh
    // (a consumed body can't be re-sent; clones must be taken before use).
    const request = new Request(input, init)

    const attempt = (jwt: string | undefined): Promise<Response> => {
      const clone = request.clone()
      if (jwt === undefined) return globalThis.fetch(clone)
      const headers = new Headers(clone.headers)
      headers.set('authorization', `Bearer ${jwt}`)
      return globalThis.fetch(new Request(clone, { headers }))
    }

    const sentJwt = provider?.jwt()
    const first = await attempt(sentJwt)
    if (first.status !== 401 || provider === null || provider.refreshToken() === undefined) {
      return first
    }
    // Someone else may have refreshed while our request was in flight — if the
    // current token already differs from the one we sent, just retry.
    const current = provider.jwt()
    const jwt = current !== undefined && current !== sentJwt ? current : await refreshOnce(baseUrl)
    if (jwt === null) return first
    return attempt(jwt)
  }
}
