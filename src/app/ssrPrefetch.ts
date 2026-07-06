import type { QueryClient } from '@tanstack/react-query'
// frontend:auction-block-start
import { prefetchAuctionsForUrl } from '../features/auctions/prefetch'
// frontend:auction-block-end

export type Prefetcher = (
  queryClient: QueryClient,
  url: string,
  apiBaseUrl: string,
) => Promise<void>

// Public pages only — the server holds no user token.
export const ssrPrefetchers: Prefetcher[] = [
  // frontend:auction-block-start
  prefetchAuctionsForUrl,
  // frontend:auction-block-end
]
