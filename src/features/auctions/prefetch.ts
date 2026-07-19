import type { QueryClient } from '@tanstack/react-query'
import { matchPath } from 'react-router-dom'
import { makeOrpcUtils } from '@/api/orpc'
import { bidsInfiniteOptions, PAGE_SIZE } from './queries'

// prefetch* swallows failures: if the backend is down the page still streams.
export async function prefetchAuctionsForUrl(
  queryClient: QueryClient,
  url: string,
  apiBaseUrl: string,
): Promise<void> {
  const pathname = url.split('?')[0] ?? url
  const utils = makeOrpcUtils(apiBaseUrl)

  if (matchPath('/', pathname) !== null) {
    await queryClient.prefetchQuery(
      utils.v1.auctions.get.queryOptions({
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
        utils.v1.auctions.byAuctionId.get.queryOptions({ input: { params: { auctionId } } }),
      ),
      queryClient.prefetchInfiniteQuery(bidsInfiniteOptions(utils, auctionId)),
    ])
  }
}
