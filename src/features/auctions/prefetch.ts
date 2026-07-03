import type { QueryClient } from '@tanstack/react-query'
import { matchPath } from 'react-router-dom'
import { makeOrpcUtils } from '../../api/orpc'
import { BIDS_PAGE_SIZE, PAGE_SIZE } from './api'

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
  const utils = makeOrpcUtils(apiBaseUrl)

  if (matchPath('/', pathname) !== null) {
    await queryClient.prefetchQuery(
      utils['v1-auctions'].get.queryOptions({
        input: { query: { limit: PAGE_SIZE, offset: 0 } },
      }),
    )
    return
  }

  const match = matchPath('/auctions/:auctionId', pathname)
  const auctionId = match?.params.auctionId
  if (auctionId !== undefined) {
    await Promise.all([
      queryClient.prefetchQuery(
        utils['v1-auctions---auctionId'].get.queryOptions({ input: { params: { auctionId } } }),
      ),
      queryClient.prefetchInfiniteQuery(
        utils['v1-auctions---auctionId-bids'].get.infiniteOptions({
          input: (pageParam: string | undefined) => ({
            params: { auctionId },
            query: { limit: BIDS_PAGE_SIZE, 'after-id': pageParam },
          }),
          initialPageParam: undefined as string | undefined,
          getNextPageParam: (last) => (last.hasMore ? last.items.at(-1)?.id : undefined),
        }),
      ),
    ])
  }
}
