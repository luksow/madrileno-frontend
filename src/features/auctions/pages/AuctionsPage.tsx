import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInstantFormatter } from '@/api/datetime'
import { usePriceFormatter } from '@/features/auctions/format'
import { PAGE_SIZE, useAuctionsPage, type AuctionSummary } from '@/features/auctions/queries'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'

function AuctionCard({ auction }: { auction: AuctionSummary }) {
  const formatInstant = useInstantFormatter()
  const price = usePriceFormatter()
  return (
    <li>
      <Card className="flex h-full flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/auctions/${auction.id}`}
            className="text-lg font-semibold text-primary underline-offset-4 hover:underline"
          >
            {auction.wineName}
            {auction.vintage != null ? ` ${String(auction.vintage)}` : ''}
          </Link>
          <Badge variant={auction.status === 'Open' ? 'accent' : 'default'}>{auction.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {auction.color} · {auction.region} · {auction.producerName}
        </p>
        <p className="mt-auto text-sm">
          <strong className="text-base">{price(auction.currentPrice, auction.currency)}</strong>
          <span className="text-muted-foreground"> · ends {formatInstant(auction.endsAt)}</span>
        </p>
      </Card>
    </li>
  )
}

export function AuctionsPage() {
  const [offset, setOffset] = useState(0)
  const { data: page, isPending, isError } = useAuctionsPage(offset)

  return (
    <section className="flex flex-col gap-6">
      <title>Auctions — madrileno</title>
      <h1 className="text-2xl font-semibold">Wine auctions</h1>
      {isPending && <p className="text-muted-foreground">Loading auctions…</p>}
      {isError && <p className="text-destructive">Couldn’t load auctions — is the backend up?</p>}
      {page &&
        (page.items.length === 0 ? (
          <p className="text-muted-foreground">No auctions yet. Log in and create one via the API.</p>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.items.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </ul>
            <nav className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                ← Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {String(offset + 1)}–{String(Math.min(offset + PAGE_SIZE, page.total))} of{' '}
                {String(page.total)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={offset + PAGE_SIZE >= page.total}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next →
              </Button>
            </nav>
          </>
        ))}
    </section>
  )
}
