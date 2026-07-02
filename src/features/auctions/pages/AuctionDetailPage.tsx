import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { z } from 'zod'
import { formatInstant } from '../../../api/datetime'
import { problemTag, type Problem } from '../../../api/problem'
import { useAuth } from '../../../auth/useAuth'
import { bidRejection, useAuction, useBids, usePlaceBid, type Auction } from '../api'

function price(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
}

const bidSchema = z.object({
  amount: z.coerce.number().positive('Bid must be a positive amount'),
})
type BidForm = z.infer<typeof bidSchema>

function rejectionMessage(problem: Problem): string {
  // Dispatch on the stable error tag, not the human-readable text.
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
  } = useForm<BidForm>({ resolver: zodResolver(bidSchema) })

  if (tokens === null) {
    return (
      <p>
        <Link to="/login">Log in</Link> to place a bid.
      </p>
    )
  }

  const onSubmit = handleSubmit(({ amount }) => {
    placeBid.mutate(
      { params: { auctionId: auction.id }, body: { amount } },
      { onSuccess: () => reset() },
    )
  })

  // Expected rejections (bid too low, not open, …) arrive as typed mutation
  // errors carrying the Problem envelope; anything else is surfaced generically.
  const rejection = placeBid.error !== null ? bidRejection(placeBid.error) : null

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="bid-form" noValidate>
      <label htmlFor="amount">Your bid ({auction.currency})</label>
      <input
        id="amount"
        type="number"
        step="0.01"
        min="0"
        placeholder={String(auction.currentPrice)}
        {...register('amount')}
      />
      <button type="submit" disabled={placeBid.isPending || auction.status !== 'Open'}>
        {placeBid.isPending ? 'Placing…' : 'Place bid'}
      </button>
      {errors.amount && <p className="error">{errors.amount.message}</p>}
      {rejection !== null && <p className="error">{rejectionMessage(rejection)}</p>}
      {placeBid.isError && rejection === null && (
        <p className="error">Couldn’t place the bid — try again.</p>
      )}
      {placeBid.isSuccess && <p className="success">Bid placed.</p>}
    </form>
  )
}

function BidHistory({ auctionId }: { auctionId: string }) {
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBids(auctionId)
  if (isPending) return <p className="muted">Loading bids…</p>
  if (isError) return <p className="error">Couldn’t load the bid history.</p>
  const bids = data.pages.flatMap((page) => page.body.items)
  return (
    <>
      {bids.length === 0 ? (
        <p className="muted">No bids yet — be the first.</p>
      ) : (
        <ul className="bid-list">
          {bids.map((bid) => (
            <li key={bid.id}>
              <strong>{price(bid.amount, bid.currency)}</strong>
              <span className="muted">
                {' '}
                by {bid.bidderRef} · {formatInstant(bid.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {hasNextPage && (
        <button onClick={() => void fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading…' : 'Load more bids'}
        </button>
      )}
    </>
  )
}

export function AuctionDetailPage() {
  const { auctionId } = useParams()
  const { data, isPending, isError } = useAuction(auctionId ?? '')

  if (auctionId === undefined) return <p className="error">Missing auction id.</p>
  if (isPending) return <p className="muted">Loading auction…</p>
  if (isError) return <p className="error">Couldn’t load this auction — does it exist?</p>

  const auction = data.body
  return (
    <section>
      <title>{`${auction.wineName} — madrileno`}</title>
      <p>
        <Link to="/">← All auctions</Link>
      </p>
      <h1>
        {auction.wineName}
        {auction.vintage != null ? ` ${String(auction.vintage)}` : ''}
      </h1>
      <p className="muted">
        {auction.color} · {auction.region} · {auction.appellation} · {auction.producerName} ·{' '}
        {auction.bottleCount}× {auction.bottleSize}
      </p>
      {auction.description != null && <p>{auction.description}</p>}
      <p>
        <strong>{price(auction.currentPrice, auction.currency)}</strong>
        <span className="muted">
          {' '}
          (started at {price(auction.startingPrice, auction.currency)}) · {auction.status} · ends{' '}
          {formatInstant(auction.endsAt)}
        </span>
      </p>
      <PlaceBidForm auction={auction} />
      <h2>Bid history</h2>
      <BidHistory auctionId={auction.id} />
    </section>
  )
}
