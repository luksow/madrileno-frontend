import { m } from '@/paraglide/messages'

// Backend status enum (Cancelled | Closed | Open) → localized label; unknown
// values fall through to the raw string so nothing renders blank.
export function auctionStatusLabel(status: string): string {
  switch (status) {
    case 'Open':
      return m.auction_status_open()
    case 'Closed':
      return m.auction_status_closed()
    case 'Cancelled':
      return m.auction_status_cancelled()
    default:
      return status
  }
}
