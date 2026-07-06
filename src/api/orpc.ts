import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createContractsClient, type ContractsClient } from '../contracts/client'
import { env } from '../env'
import { makeAuthorizedFetch } from './client'

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

export const orpc = createTanstackQueryUtils(client)

export function makeOrpcUtils(baseUrl: string) {
  return createTanstackQueryUtils(makeApiClient(baseUrl))
}

export type OrpcUtils = typeof orpc
