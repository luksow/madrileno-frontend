import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { ORPCError } from '@orpc/client'
import { asProblem, type Problem } from '../../api/problem'
import { orpc, type ApiClient, type OrpcUtils } from '../../api/orpc'

// Response types inferred straight from the generated contract via the client —
// rename a field in a backend DTO and `npm run typecheck` fails right here or
// at a call site. JsonifiedClient keeps them wire-true (timestamps are strings).
export type AuctionsPage = Awaited<ReturnType<ApiClient['v1-auctions']['get']>>
export type AuctionSummary = AuctionsPage['items'][number]
export type Auction = Awaited<ReturnType<ApiClient['v1-auctions---auctionId']['get']>>
export type BidsPage = Awaited<ReturnType<ApiClient['v1-auctions---auctionId-bids']['get']>>

export const PAGE_SIZE = 12
export const BIDS_PAGE_SIZE = 10

// The generated dash-keys, aliased once — call sites below read naturally.
const auctionsRoute = orpc['v1-auctions']
const auctionRoute = orpc['v1-auctions---auctionId']
const bidsRoute = orpc['v1-auctions---auctionId-bids']

export function useAuctionsPage(offset: number) {
  return useQuery(
    auctionsRoute.get.queryOptions({
      input: { query: { limit: PAGE_SIZE, offset } },
      placeholderData: keepPreviousData,
    }),
  )
}

export function useAuction(auctionId: string) {
  return useQuery(auctionRoute.get.queryOptions({ input: { params: { auctionId } } }))
}

// One definition for the bids cursor query, shared by the browser hook and the
// SSR prefetch: oRPC derives query keys from procedure path + input, so the
// two sides MUST build identical inputs or hydration misses the cache.
export function bidsInfiniteOptions(utils: OrpcUtils, auctionId: string) {
  return utils['v1-auctions---auctionId-bids'].get.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      params: { auctionId },
      query: { limit: BIDS_PAGE_SIZE, 'after-id': pageParam },
    }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.items.at(-1)?.id : undefined),
  })
}

export function useBids(auctionId: string) {
  return useInfiniteQuery(bidsInfiniteOptions(orpc, auctionId))
}

export function usePlaceBid(auctionId: string) {
  const queryClient = useQueryClient()
  return useMutation(
    bidsRoute.post.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: auctionRoute.get.key({ input: { params: { auctionId } } }),
        })
        void queryClient.invalidateQueries({
          queryKey: bidsRoute.get.key(),
        })
      },
    }),
  )
}

// Expected rejections surface as DEFINED ORPCErrors: the contract declares
// them under their Problem `type` codes, and the link's decoder marks decoded
// Problems defined (isDefinedError's runtime check, spelled out here because
// the guard can't narrow from `unknown`). Anything else — network failure,
// undeclared status — returns null and is surfaced generically.
export function bidRejection(error: unknown): Problem | null {
  if (!(error instanceof ORPCError) || !error.defined) return null
  return asProblem(error.data)
}
