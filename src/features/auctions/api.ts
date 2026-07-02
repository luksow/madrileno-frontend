import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { ClientInferResponseBody } from '@ts-rest/core'
import { makeClient } from '../../api/client'
import { ApiError, asProblem, type Problem } from '../../api/problem'
import { v1AuctionsContract } from '../../contracts/v1-auctions.contract'
import { v1AuctionsAuctionIdContract } from '../../contracts/v1-auctions---auctionId.contract'
import { v1AuctionsAuctionIdBidsContract } from '../../contracts/v1-auctions---auctionId-bids.contract'

// Response types inferred straight from the generated contract — rename a field
// in a backend DTO and `npm run typecheck` fails right here or at a call site.
export type AuctionsPage = ClientInferResponseBody<typeof v1AuctionsContract.get, 200>
export type AuctionSummary = AuctionsPage['items'][number]
export type Auction = ClientInferResponseBody<typeof v1AuctionsAuctionIdContract.get, 200>
export type BidsPage = ClientInferResponseBody<typeof v1AuctionsAuctionIdBidsContract.get, 200>
export type PlacedBid = ClientInferResponseBody<typeof v1AuctionsAuctionIdBidsContract.post, 201>

export const PAGE_SIZE = 12
export const BIDS_PAGE_SIZE = 10

const listClient = (baseUrl?: string) => makeClient(v1AuctionsContract, baseUrl)
const detailClient = (baseUrl?: string) => makeClient(v1AuctionsAuctionIdContract, baseUrl)
const bidsClient = (baseUrl?: string) => makeClient(v1AuctionsAuctionIdBidsContract, baseUrl)

// Query keys are shared between the client hooks and the SSR prefetch — they
// must match exactly or hydration misses the cache.
export const auctionKeys = {
  list: (offset: number) => ['auctions', 'list', offset] as const,
  detail: (auctionId: string) => ['auctions', 'detail', auctionId] as const,
  bids: (auctionId: string) => ['auctions', 'bids', auctionId] as const,
}

export async function fetchAuctionsPage(offset: number, baseUrl?: string): Promise<AuctionsPage> {
  const res = await listClient(baseUrl).get({ query: { limit: PAGE_SIZE, offset } })
  if (res.status === 200) return res.body
  throw new ApiError(res.status, asProblem(res.body))
}

export async function fetchAuction(auctionId: string, baseUrl?: string): Promise<Auction> {
  const res = await detailClient(baseUrl).get({ params: { auctionId } })
  if (res.status === 200) return res.body
  throw new ApiError(res.status, asProblem(res.body))
}

export async function fetchBidsPage(
  auctionId: string,
  afterId: string | undefined,
  baseUrl?: string,
): Promise<BidsPage> {
  const res = await bidsClient(baseUrl).get({
    params: { auctionId },
    query: { limit: BIDS_PAGE_SIZE, 'after-id': afterId },
  })
  if (res.status === 200) return res.body
  throw new ApiError(res.status, asProblem(res.body))
}

export function useAuctionsPage(offset: number) {
  return useQuery({
    queryKey: auctionKeys.list(offset),
    queryFn: () => fetchAuctionsPage(offset),
    placeholderData: keepPreviousData,
  })
}

export function useAuction(auctionId: string) {
  return useQuery({
    queryKey: auctionKeys.detail(auctionId),
    queryFn: () => fetchAuction(auctionId),
  })
}

export function useBids(auctionId: string) {
  return useInfiniteQuery({
    queryKey: auctionKeys.bids(auctionId),
    queryFn: ({ pageParam }) => fetchBidsPage(auctionId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.items.at(-1)?.id : undefined),
  })
}

// The domain outcome travels as a value, not an exception — the frontend echo
// of the backend's sealed-result convention. Only unexpected statuses throw.
export type PlaceBidOutcome =
  { kind: 'placed'; bid: PlacedBid } | { kind: 'rejected'; problem: Problem }

export function usePlaceBid(auctionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (amount: number): Promise<PlaceBidOutcome> => {
      const res = await bidsClient().post({ params: { auctionId }, body: { amount } })
      if (res.status === 201) return { kind: 'placed', bid: res.body }
      const problem = asProblem(res.body)
      if (problem !== null && [401, 403, 404, 409].includes(res.status)) {
        return { kind: 'rejected', problem }
      }
      throw new ApiError(res.status, problem)
    },
    onSuccess: (outcome) => {
      if (outcome.kind === 'placed') {
        void queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) })
        void queryClient.invalidateQueries({ queryKey: auctionKeys.bids(auctionId) })
      }
    },
  })
}
