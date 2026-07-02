import { initTsrReactQuery } from '@ts-rest/react-query/v5'
import { contracts } from '../contracts/contracts'
import { env } from '../env'
import { authorizedApi } from './client'

// The canonical @ts-rest/react-query client, built from the FULL generated
// contract so this file never references a feature. Endpoints are addressed by
// the generated dash-keys, e.g. tsr['v1-auctions'].get.useQuery(...).
//
// makeTsr exists for the SSR server, which prefetches against a per-request
// base URL; the browser uses the `tsr` singleton below.
export function makeTsr(baseUrl: string = env.apiBaseUrl) {
  return initTsrReactQuery(contracts, {
    baseUrl,
    baseHeaders: {},
    api: authorizedApi(baseUrl),
  })
}

export const tsr = makeTsr()
