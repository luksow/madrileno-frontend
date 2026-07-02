import { keepPreviousData } from '@tanstack/react-query'
import type { ClientInferResponseBody } from '@ts-rest/core'
import { isFetchError } from '@ts-rest/react-query/v5'
import { asProblem, type Problem } from '../../api/problem'
import { tsr } from '../../api/tsr'
import type { v1AuctionsContract } from '../../contracts/v1-auctions.contract'
import type { v1AuctionsAuctionIdContract } from '../../contracts/v1-auctions---auctionId.contract'
import type { v1AuctionsAuctionIdBidsContract } from '../../contracts/v1-auctions---auctionId-bids.contract'

// Response types inferred straight from the generated contract — rename a field
// in a backend DTO and `npm run typecheck` fails right here or at a call site.
export type AuctionsPage = ClientInferResponseBody<typeof v1AuctionsContract.get, 200>
export type AuctionSummary = AuctionsPage['items'][number]
export type Auction = ClientInferResponseBody<typeof v1AuctionsAuctionIdContract.get, 200>
export type BidsPage = ClientInferResponseBody<typeof v1AuctionsAuctionIdBidsContract.get, 200>

export const PAGE_SIZE = 12
export const BIDS_PAGE_SIZE = 10

// Query keys are shared between the client hooks and the SSR prefetch — they
// must match exactly or hydration misses the cache.
export const auctionKeys = {
  list: (offset: number) => ['auctions', 'list', offset] as const,
  detail: (auctionId: string) => ['auctions', 'detail', auctionId] as const,
  bids: (auctionId: string) => ['auctions', 'bids', auctionId] as const,
}

export function useAuctionsPage(offset: number) {
  return tsr['v1-auctions'].get.useQuery({
    queryKey: auctionKeys.list(offset),
    queryData: { query: { limit: PAGE_SIZE, offset } },
    placeholderData: keepPreviousData,
  })
}

export function useAuction(auctionId: string) {
  return tsr['v1-auctions---auctionId'].get.useQuery({
    queryKey: auctionKeys.detail(auctionId),
    queryData: { params: { auctionId } },
  })
}

export function useBids(auctionId: string) {
  return tsr['v1-auctions---auctionId-bids'].get.useInfiniteQuery({
    queryKey: auctionKeys.bids(auctionId),
    // The adapter types pageParam as unknown (it can't see initialPageParam);
    // it is the `after-id` cursor we return from getNextPageParam below.
    queryData: ({ pageParam }) => ({
      params: { auctionId },
      query: { limit: BIDS_PAGE_SIZE, 'after-id': pageParam as string | undefined },
    }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: { body: BidsPage }) =>
      last.body.hasMore ? last.body.items.at(-1)?.id : undefined,
  })
}

export function usePlaceBid(auctionId: string) {
  const queryClient = tsr.useQueryClient()
  return tsr['v1-auctions---auctionId-bids'].post.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) })
      void queryClient.invalidateQueries({ queryKey: auctionKeys.bids(auctionId) })
    },
  })
}

// Expected rejections (401/403/404/409) arrive as typed mutation errors — turn
// them into the Problem envelope for tag-based dispatch. Anything else (network
// failure, envelope-less body) returns null and is surfaced generically.
export function bidRejection(error: unknown): Problem | null {
  if (error === null || typeof error !== 'object') return null
  if (isFetchError(error)) return null
  if (!('body' in error)) return null
  return asProblem(error.body)
}
