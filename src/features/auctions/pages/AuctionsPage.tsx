import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInstantFormatter } from '@/api/datetime'
import { usePriceFormatter } from '@/features/auctions/format'
import { PAGE_SIZE, useAuctionsPage, type AuctionSummary } from '@/features/auctions/queries'

function AuctionCard({ auction }: { auction: AuctionSummary }) {
  const formatInstant = useInstantFormatter()
  const price = usePriceFormatter()
  return (
    <li className="card">
      <Link to={`/auctions/${auction.id}`}>
        <h2>
          {auction.wineName}
          {auction.vintage != null ? ` ${String(auction.vintage)}` : ''}
        </h2>
      </Link>
      <p className="muted">
        {auction.color} · {auction.region} · {auction.producerName}
      </p>
      <p>
        <strong>{price(auction.currentPrice, auction.currency)}</strong>
        <span className="muted"> · ends {formatInstant(auction.endsAt)}</span>
      </p>
      <p className="tag">{auction.status}</p>
    </li>
  )
}

export function AuctionsPage() {
  const [offset, setOffset] = useState(0)
  const { data: page, isPending, isError } = useAuctionsPage(offset)

  return (
    <section>
      <title>Auctions — madrileno</title>
      <h1>Wine auctions</h1>
      {isPending && <p className="muted">Loading auctions…</p>}
      {isError && <p className="error">Couldn’t load auctions — is the backend up?</p>}
      {page && (
        <>
          {page.items.length === 0 ? (
            <p className="muted">No auctions yet. Log in and create one via the API.</p>
          ) : (
            <>
              <ul className="card-grid">
                {page.items.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </ul>
              <nav className="pager">
                <button
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                >
                  ← Previous
                </button>
                <span className="muted">
                  {String(offset + 1)}–{String(Math.min(offset + PAGE_SIZE, page.total))} of{' '}
                  {String(page.total)}
                </span>
                <button
                  disabled={offset + PAGE_SIZE >= page.total}
                  onClick={() => setOffset(offset + PAGE_SIZE)}
                >
                  Next →
                </button>
              </nav>
            </>
          )}
        </>
      )}
    </section>
  )
}
