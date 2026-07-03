import { createORPCClient, ORPCError } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { contracts } from '../contracts/contracts'
import { env } from '../env'
import { makeAuthorizedFetch } from './client'
import { asProblem } from './problem'

// JsonifiedClient: over HTTP every value crosses a JSON boundary, so the client
// types reflect the wire truth — z.coerce.date() fields arrive (and stay) ISO
// strings. No Date instances ever enter the query cache.
export type ApiClient = JsonifiedClient<ContractRouterClient<typeof contracts>>

export function makeApiClient(baseUrl: string = env.apiBaseUrl): ApiClient {
  const url =
    baseUrl !== ''
      ? baseUrl
      : typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:9000'
  const link = new OpenAPILink(contracts, {
    url,
    fetch: makeAuthorizedFetch(url),
    // The backend speaks RFC 9457 Problem Details, not oRPC's error envelope —
    // decode it so every expected rejection surfaces as an ORPCError whose
    // `code` is the stable Problem `type` tag and `data` the full envelope.
    customErrorResponseBodyDecoder: (body, response) => {
      const problem = asProblem(body)
      if (problem === null) return null
      return new ORPCError(problem.type, {
        status: response.status,
        message: problem.title,
        data: problem,
      })
    },
  })
  return createORPCClient(link)
}

export const client: ApiClient = makeApiClient()

// TanStack Query utilities bound to the browser client. Query keys derive from
// the procedure path + input, so SSR prefetch (via makeOrpcUtils) produces
// identical keys and hydration hits the cache.
export const orpc = createTanstackQueryUtils(client)

export function makeOrpcUtils(baseUrl: string) {
  return createTanstackQueryUtils(makeApiClient(baseUrl))
}
