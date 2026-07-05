import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createContractsClient, type ContractsClient } from '../contracts/client'
import { env } from '../env'
import { makeAuthorizedFetch } from './client'

// The generated client factory (src/contracts/client.ts) ships the OpenAPILink
// pre-wired with the error decoder: RFC 9457 bodies become defined ORPCErrors
// under the contract-declared codes, so isDefinedError narrows end to end.
// Types are wire-true (timestamps are ISO strings). We only add our auth-aware
// fetch (bearer + single-flight 401 refresh).
export type ApiClient = ContractsClient

export function makeApiClient(baseUrl: string = env.apiBaseUrl): ApiClient {
  const url =
    baseUrl !== ''
      ? baseUrl
      : typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:9000'
  return createContractsClient(url, { fetch: makeAuthorizedFetch(url) })
}

export const client: ApiClient = makeApiClient()

// TanStack Query utilities bound to the browser client. Query keys derive from
// the procedure path + input, so SSR prefetch (via makeOrpcUtils) produces
// identical keys and hydration hits the cache.
export const orpc = createTanstackQueryUtils(client)

export function makeOrpcUtils(baseUrl: string) {
  return createTanstackQueryUtils(makeApiClient(baseUrl))
}

export type OrpcUtils = typeof orpc
