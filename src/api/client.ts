import { initClient, tsRestFetchApi, type ApiFetcherArgs, type AppRouter } from '@ts-rest/core'
import { env } from '../env'
import { v1AuthRefreshTokenContract } from '../contracts/v1-auth-refresh-token.contract'

// The api layer knows how to talk to the backend (including how to refresh a
// session); it does not know where tokens live. The auth layer registers a
// provider at startup — the dependency points auth -> api, never the reverse.
export interface TokenProvider {
  jwt(): string | undefined
  refreshToken(): string | undefined
  rotated(jwt: string, refreshToken: string): void
  invalidated(): void
}

let provider: TokenProvider | null = null

export function setTokenProvider(p: TokenProvider): void {
  provider = p
}

function withBearer(args: ApiFetcherArgs, jwt: string | undefined): ApiFetcherArgs {
  if (jwt === undefined) return args
  return { ...args, headers: { ...args.headers, authorization: `Bearer ${jwt}` } }
}

async function doRefresh(baseUrl: string): Promise<string | null> {
  const refreshToken = provider?.refreshToken()
  if (provider === null || refreshToken === undefined) return null
  const client = initClient(v1AuthRefreshTokenContract, { baseUrl, baseHeaders: {} })
  const res = await client.post({ body: { refreshToken } })
  if (res.status === 200) {
    provider.rotated(res.body.jwt, res.body.refreshToken)
    return res.body.jwt
  }
  // The refresh token itself was rejected: the session is over.
  provider.invalidated()
  return null
}

// Single-flight: the backend ROTATES refresh tokens, so two concurrent 401s
// must not both call refresh — the second would present an already-used token
// and get the session killed. All concurrent callers share one refresh.
let refreshInFlight: Promise<string | null> | null = null

function refreshOnce(baseUrl: string): Promise<string | null> {
  refreshInFlight ??= doRefresh(baseUrl).finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

// The shared fetcher: bearer injection plus a single 401 -> refresh -> retry
// pass. Runs below the contract types (it sees raw statuses), so the retry is
// invisible to callers. Used by both the plain clients and the react-query tsr.
export function authorizedApi(baseUrl: string) {
  return async (args: ApiFetcherArgs) => {
    const sentJwt = provider?.jwt()
    const first = await tsRestFetchApi(withBearer(args, sentJwt))
    if (first.status !== 401 || provider === null || provider.refreshToken() === undefined) {
      return first
    }
    // Someone else may have refreshed while our request was in flight — if
    // the current token already differs from the one we sent, just retry.
    const current = provider.jwt()
    const jwt = current !== undefined && current !== sentJwt ? current : await refreshOnce(baseUrl)
    if (jwt === null) return first
    return tsRestFetchApi(withBearer(args, jwt))
  }
}

export function makeClient<T extends AppRouter>(contract: T, baseUrl: string = env.apiBaseUrl) {
  return initClient(contract, {
    baseUrl,
    baseHeaders: {},
    api: authorizedApi(baseUrl),
  })
}
