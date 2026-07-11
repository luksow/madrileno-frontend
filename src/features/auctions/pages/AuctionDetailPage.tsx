import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { z } from 'zod'
import { useInstantFormatter } from '@/api/datetime'
import { problemFrom, problemTag, type Problem } from '@/api/problem'
import { useAuth } from '@/features/auth/useAuth'
import { usePriceFormatter } from '@/features/auctions/format'
import { useAuction, useBids, usePlaceBid, type Auction } from '@/features/auctions/queries'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Field } from '@/ui/field'
import { Input } from '@/ui/input'

const bidSchema = z.object({
  amount: z.coerce.number().positive('Bid must be a positive amount'),
})
type BidFormInput = z.input<typeof bidSchema>
type BidForm = z.output<typeof bidSchema>

function rejectionMessage(problem: Problem): string {
  switch (problemTag(problem)) {
    case 'bid-too-low':
      return 'Bid too low — someone got there first. The current price has moved.'
    case 'already-highest-bidder':
      return 'You already hold the highest bid.'
    case 'cannot-bid-on-own-auction':
      return 'You can’t bid on your own auction.'
    case 'auction-not-open':
      return 'This auction is no longer open for bids.'
    case 'authentication-failed':
      return 'Your session expired — log in again to bid.'
    default:
      return problem.detail ?? problem.title
  }
}

function PlaceBidForm({ auction }: { auction: Auction }) {
  const { tokens } = useAuth()
  const placeBid = usePlaceBid(auction.id)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BidFormInput, unknown, BidForm>({ resolver: zodResolver(bidSchema) })

  if (tokens === null) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link to="/login" className="text-primary underline-offset-4 hover:underline">
          Log in
        </Link>{' '}
        to place a bid.
      </p>
    )
  }

  const onSubmit = handleSubmit(({ amount }) => {
    placeBid.mutate(
      { params: { auctionId: auction.id }, body: { amount } },
      { onSuccess: () => reset() },
    )
  })

  const rejection = placeBid.error !== null ? problemFrom(placeBid.error) : null

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="flex max-w-xs flex-col gap-3" noValidate>
      <Field label={`Your bid (${auction.currency})`} error={errors.amount?.message}>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder={String(auction.currentPrice)}
          {...register('amount')}
        />
      </Field>
      <Button type="submit" disabled={placeBid.isPending || auction.status !== 'Open'}>
        {placeBid.isPending ? 'Placing…' : 'Place bid'}
      </Button>
      {rejection !== null && (
        <p className="text-sm text-destructive">{rejectionMessage(rejection)}</p>
      )}
      {placeBid.isError && rejection === null && (
        <p className="text-sm text-destructive">Couldn’t place the bid — try again.</p>
      )}
      {placeBid.isSuccess && <p className="text-sm text-primary">Bid placed.</p>}
    </form>
  )
}

function BidHistory({ auctionId }: { auctionId: string }) {
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBids(auctionId)
  const formatInstant = useInstantFormatter()
  const price = usePriceFormatter()
  if (isPending) return <p className="text-muted-foreground">Loading bids…</p>
  if (isError) return <p className="text-destructive">Couldn’t load the bid history.</p>
  const bids = data.pages.flatMap((page) => page.items)
  return (
    <div className="flex flex-col gap-3">
      {bids.length === 0 ? (
        <p className="text-muted-foreground">No bids yet — be the first.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {bids.map((bid) => (
            <li key={bid.id} className="py-2 text-sm">
              <strong>{price(bid.amount, bid.currency)}</strong>
              <span className="text-muted-foreground">
                {' '}
                by {bid.bidderRef} · {formatInstant(bid.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {hasNextPage && (
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => void fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading…' : 'Load more bids'}
        </Button>
      )}
    </div>
  )
}

export function AuctionDetailPage() {
  const { auctionId } = useParams()
  // The '/auctions/:auctionId' route guarantees the param; guarding here keeps
  // the query below from ever firing with a bogus id.
  if (auctionId === undefined) return <p className="text-destructive">Missing auction id.</p>
  return <AuctionDetail auctionId={auctionId} />
}

function AuctionDetail({ auctionId }: { auctionId: string }) {
  const { data: auction, isPending, isError } = useAuction(auctionId)
  const formatInstant = useInstantFormatter()
  const price = usePriceFormatter()

  if (isPending) return <p className="text-muted-foreground">Loading auction…</p>
  if (isError)
    return <p className="text-destructive">Couldn’t load this auction — does it exist?</p>

  return (
    <section className="flex flex-col gap-4">
      <title>{`${auction.wineName} — madrileno`}</title>
      <p>
        <Link to="/" className="text-sm text-primary underline-offset-4 hover:underline">
          ← All auctions
        </Link>
      </p>
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          {auction.wineName}
          {auction.vintage != null ? ` ${String(auction.vintage)}` : ''}
        </h1>
        <Badge variant={auction.status === 'Open' ? 'accent' : 'default'}>{auction.status}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        {auction.color} · {auction.region} · {auction.appellation} · {auction.producerName} ·{' '}
        {auction.bottleCount}× {auction.bottleSize}
      </p>
      {auction.description != null && <p>{auction.description}</p>}
      <p>
        <strong className="text-lg">{price(auction.currentPrice, auction.currency)}</strong>
        <span className="text-sm text-muted-foreground">
          {' '}
          (started at {price(auction.startingPrice, auction.currency)}) · ends{' '}
          {formatInstant(auction.endsAt)}
        </span>
      </p>
      <PlaceBidForm auction={auction} />
      <h2 className="mt-2 text-lg font-semibold">Bid history</h2>
      <BidHistory auctionId={auction.id} />
    </section>
  )
}
