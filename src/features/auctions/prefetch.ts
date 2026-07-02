import type { QueryClient } from '@tanstack/react-query'
import { matchPath } from 'react-router-dom'
import { makeTsr } from '../../api/tsr'
import { auctionKeys, BIDS_PAGE_SIZE, PAGE_SIZE } from './api'

// SSR prefetch for the PUBLIC pages only: the list at '/' and detail+bids at
// '/auctions/:id'. These routes are unauthenticated on the backend, so the
// server needs no token. prefetch* swallows failures — if the backend is down
// the page still streams with a client-side error state.
export async function prefetchAuctionsForUrl(
  queryClient: QueryClient,
  url: string,
  apiBaseUrl: string,
): Promise<void> {
  const pathname = url.split('?')[0] ?? url
  const tsrQueryClient = makeTsr(apiBaseUrl).initQueryClient(queryClient)

  if (matchPath('/', pathname) !== null) {
    await tsrQueryClient['v1-auctions'].get.prefetchQuery({
      queryKey: auctionKeys.list(0),
      queryData: { query: { limit: PAGE_SIZE, offset: 0 } },
    })
    return
  }

  const match = matchPath('/auctions/:auctionId', pathname)
  const auctionId = match?.params.auctionId
  if (auctionId !== undefined) {
    await Promise.all([
      tsrQueryClient['v1-auctions---auctionId'].get.prefetchQuery({
        queryKey: auctionKeys.detail(auctionId),
        queryData: { params: { auctionId } },
      }),
      tsrQueryClient['v1-auctions---auctionId-bids'].get.prefetchInfiniteQuery({
        queryKey: auctionKeys.bids(auctionId),
        queryData: {
          params: { auctionId },
          query: { limit: BIDS_PAGE_SIZE, 'after-id': undefined },
        },
        initialPageParam: undefined as string | undefined,
      }),
    ])
  }
}
