import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { ORPCError } from '@orpc/client'
import { asProblem, type Problem } from '../../api/problem'
import { orpc, type ApiClient } from '../../api/orpc'

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

export function useBids(auctionId: string) {
  return useInfiniteQuery(
    bidsRoute.get.infiniteOptions({
      input: (pageParam: string | undefined) => ({
        params: { auctionId },
        query: { limit: BIDS_PAGE_SIZE, 'after-id': pageParam },
      }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (last) => (last.hasMore ? last.items.at(-1)?.id : undefined),
    }),
  )
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

// Expected rejections (401/403/404/409) surface as thrown ORPCError whose
// `data` is the backend's RFC 9457 Problem envelope (the generated
// `<name>Errors` maps in src/contracts describe the per-status shapes).
// Anything else returns null and is surfaced generically.
export function bidRejection(error: unknown): Problem | null {
  if (!(error instanceof ORPCError)) return null
  return asProblem(error.data)
}
