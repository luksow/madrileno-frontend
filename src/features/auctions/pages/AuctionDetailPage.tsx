import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { useInstantFormatter } from '@/api/datetime'
import { problemFrom, problemTag, type Problem } from '@/api/problem'
import { m } from '@/paraglide/messages'
import { useAuth } from '@/features/auth/useAuth'
import { usePriceFormatter } from '@/features/auctions/format'
import { useAuction, useBids, usePlaceBid, type Auction } from '@/features/auctions/queries'
import { auctionStatusLabel } from '@/features/auctions/status'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const bidSchema = z.object({
  amount: z.coerce.number().positive(m.auction_bid_amount_positive()),
})
type BidFormInput = z.input<typeof bidSchema>
type BidForm = z.output<typeof bidSchema>

function rejectionMessage(problem: Problem): string {
  switch (problemTag(problem)) {
    case 'bid-too-low':
      return m.auction_reject_bid_too_low()
    case 'already-highest-bidder':
      return m.auction_reject_already_highest()
    case 'cannot-bid-on-own-auction':
      return m.auction_reject_own_auction()
    case 'auction-not-open':
      return m.auction_reject_not_open()
    case 'authentication-failed':
      return m.auction_reject_auth_expired()
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
          {m.nav_log_in()}
        </Link>
        {m.auction_bid_login_suffix()}
      </p>
    )
  }

  const onSubmit = handleSubmit(({ amount }) => {
    placeBid.mutate(
      { params: { auctionId: auction.id }, body: { amount } },
      {
        onSuccess: () => {
          reset()
          toast.success(m.auction_bid_placed())
        },
        onError: (error) => {
          const rejection = problemFrom(error)
          toast.error(rejection ? rejectionMessage(rejection) : m.auction_bid_failed())
        },
      },
    )
  })

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="flex max-w-xs flex-col gap-3" noValidate>
      <Field data-invalid={errors.amount !== undefined}>
        <FieldLabel htmlFor="bid-amount">
          {m.auction_bid_amount_label({ currency: auction.currency })}
        </FieldLabel>
        <Input
          id="bid-amount"
          type="number"
          step="0.01"
          min="0"
          placeholder={String(auction.currentPrice)}
          aria-invalid={errors.amount !== undefined}
          {...register('amount')}
        />
        {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
      </Field>
      <Button type="submit" disabled={placeBid.isPending || auction.status !== 'Open'}>
        {placeBid.isPending ? m.auction_bid_placing() : m.auction_bid_place()}
      </Button>
    </form>
  )
}

function BidHistory({ auctionId }: { auctionId: string }) {
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBids(auctionId)
  const formatInstant = useInstantFormatter()
  const price = usePriceFormatter()
  if (isPending) return <p className="text-muted-foreground">{m.auction_bid_loading()}</p>
  if (isError) return <p className="text-destructive">{m.auction_bid_error()}</p>
  const bids = data.pages.flatMap((page) => page.items)
  return (
    <div className="flex flex-col gap-3">
      {bids.length === 0 ? (
        <p className="text-muted-foreground">{m.auction_bid_none()}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {bids.map((bid) => (
            <li key={bid.id} className="py-2 text-sm">
              <strong>{price(bid.amount, bid.currency)}</strong>
              <span className="text-muted-foreground">
                {' '}
                {m.auction_bid_by({ bidder: bid.bidderRef, when: formatInstant(bid.createdAt) })}
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
          {isFetchingNextPage ? m.auction_bid_loading_more() : m.auction_bid_load_more()}
        </Button>
      )}
    </div>
  )
}

export function AuctionDetailPage() {
  const { auctionId } = useParams()
  // The '/auctions/:auctionId' route guarantees the param; guarding here keeps
  // the query below from ever firing with a bogus id.
  if (auctionId === undefined) return <p className="text-destructive">{m.auction_missing_id()}</p>
  return <AuctionDetail auctionId={auctionId} />
}

function AuctionDetail({ auctionId }: { auctionId: string }) {
  const { data: auction, isPending, isError } = useAuction(auctionId)
  const formatInstant = useInstantFormatter()
  const price = usePriceFormatter()

  if (isPending) return <p className="text-muted-foreground">{m.auction_detail_loading()}</p>
  if (isError) return <p className="text-destructive">{m.auction_detail_error()}</p>

  return (
    <section className="flex flex-col gap-4">
      <title>{`${auction.wineName} — madrileno`}</title>
      <p>
        <Link to="/" className="text-sm text-primary underline-offset-4 hover:underline">
          {m.auction_detail_back()}
        </Link>
      </p>
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          {auction.wineName}
          {auction.vintage != null ? ` ${String(auction.vintage)}` : ''}
        </h1>
        <Badge variant={auction.status === 'Open' ? 'default' : 'secondary'}>
          {auctionStatusLabel(auction.status)}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        {auction.color} · {auction.region} · {auction.appellation} · {auction.producerName} ·{' '}
        {auction.bottleCount}× {auction.bottleSize}
      </p>
      {auction.description != null && <p>{auction.description}</p>}
      <p>
        <strong className="text-lg">{price(auction.currentPrice, auction.currency)}</strong>
        <span className="text-sm text-muted-foreground">
          {' ('}
          {m.auction_started_at({ price: price(auction.startingPrice, auction.currency) })}
          {') · '}
          {m.auction_ends({ when: formatInstant(auction.endsAt) })}
        </span>
      </p>
      <PlaceBidForm auction={auction} />
      <h2 className="mt-2 text-lg font-semibold">{m.auction_bid_history()}</h2>
      <BidHistory auctionId={auction.id} />
    </section>
  )
}
