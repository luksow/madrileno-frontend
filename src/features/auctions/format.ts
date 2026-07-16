import { useLocale } from 'use-intl'

// Currency formatting follows the app locale; server and client agree on it via
// the cookie, so there's no hydration mismatch to defer around.
export function usePriceFormatter(): (amount: number, currency: string) => string {
  const locale = useLocale()
  return (amount, currency) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}
