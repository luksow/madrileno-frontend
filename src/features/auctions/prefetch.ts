import type { QueryClient } from '@tanstack/react-query'
import { matchPath } from 'react-router-dom'
import { auctionKeys, fetchAuction, fetchAuctionsPage, fetchBidsPage } from './api'

// SSR prefetch for the public pages only: the list at '/' and detail+bids at
// '/auctions/:id'. These routes are unauthenticated on the backend, so the
// server needs no token. prefetchQuery swallows failures — if the backend is
// down the page still streams with a client-side error state.
export async function prefetchAuctionsForUrl(
  queryClient: QueryClient,
  url: string,
  apiBaseUrl: string,
): Promise<void> {
  const pathname = url.split('?')[0] ?? url

  if (matchPath('/', pathname) !== null) {
    await queryClient.prefetchQuery({
      queryKey: auctionKeys.list(0),
      queryFn: () => fetchAuctionsPage(0, apiBaseUrl),
    })
    return
  }

  const match = matchPath('/auctions/:auctionId', pathname)
  const auctionId = match?.params.auctionId
  if (auctionId !== undefined) {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: auctionKeys.detail(auctionId),
        queryFn: () => fetchAuction(auctionId, apiBaseUrl),
      }),
      queryClient.prefetchInfiniteQuery({
        queryKey: auctionKeys.bids(auctionId),
        queryFn: () => fetchBidsPage(auctionId, undefined, apiBaseUrl),
        initialPageParam: undefined as string | undefined,
      }),
    ])
  }
}
