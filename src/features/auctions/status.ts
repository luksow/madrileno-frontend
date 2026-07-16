import { useTranslations } from 'use-intl'

// Backend status enum (Cancelled | Closed | Open) → localized label; unknown
// values fall through to the raw string so nothing renders blank.
export function useAuctionStatusLabel(): (status: string) => string {
  const t = useTranslations('auction')
  return (status) => {
    switch (status) {
      case 'Open':
        return t('statusOpen')
      case 'Closed':
        return t('statusClosed')
      case 'Cancelled':
        return t('statusCancelled')
      default:
        return status
    }
  }
}
