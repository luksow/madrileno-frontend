import { initClient, tsRestFetchApi, type ApiFetcherArgs, type AppRouter } from '@ts-rest/core'
import { tokenStore } from '../auth/tokenStore'
import { env } from '../env'
import { v1AuthRefreshTokenContract } from '../contracts/v1-auth-refresh-token.contract'

function withBearer(args: ApiFetcherArgs, jwt: string | undefined): ApiFetcherArgs {
  if (jwt === undefined) return args
  return { ...args, headers: { ...args.headers, authorization: `Bearer ${jwt}` } }
}

async function refresh(baseUrl: string): Promise<string | null> {
  const tokens = tokenStore.get()
  if (tokens === null) return null
  const client = initClient(v1AuthRefreshTokenContract, { baseUrl, baseHeaders: {} })
  const res = await client.post({ body: { refreshToken: tokens.refreshToken } })
  if (res.status === 200) {
    tokenStore.set({ ...tokens, jwt: res.body.jwt, refreshToken: res.body.refreshToken })
    return res.body.jwt
  }
  // The refresh token itself was rejected: the session is over.
  tokenStore.set(null)
  return null
}

// Every feature builds its typed client through here: bearer injection plus a
// single 401 -> refresh -> retry pass. This runs below the contract types (it
// sees raw statuses), so the retry is invisible to callers.
export function makeClient<T extends AppRouter>(contract: T, baseUrl: string = env.apiBaseUrl) {
  return initClient(contract, {
    baseUrl,
    baseHeaders: {},
    api: async (args: ApiFetcherArgs) => {
      const first = await tsRestFetchApi(withBearer(args, tokenStore.get()?.jwt))
      if (first.status !== 401 || tokenStore.get() === null) return first
      const jwt = await refresh(baseUrl)
      if (jwt === null) return first
      return tsRestFetchApi(withBearer(args, jwt))
    },
  })
}
