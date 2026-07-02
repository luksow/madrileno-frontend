import type { QueryClient } from '@tanstack/react-query'
// frontend:auction-block-start
import { prefetchAuctionsForUrl } from '../features/auctions/prefetch'
// frontend:auction-block-end

export type Prefetcher = (
  queryClient: QueryClient,
  url: string,
  apiBaseUrl: string,
) => Promise<void>

// Features that want their public pages server-rendered register a prefetcher
// here; the SSR entry runs each one for the requested URL. Auth-gated data
// never belongs here — the server holds no user token.
export const ssrPrefetchers: Prefetcher[] = [
  // frontend:auction-block-start
  prefetchAuctionsForUrl,
  // frontend:auction-block-end
]
