import { getLocale } from '@/paraglide/runtime'

// Currency formatting follows the app locale; server and client agree on it via
// the cookie, so there's no hydration mismatch to defer around.
export function usePriceFormatter(): (amount: number, currency: string) => string {
  return (amount, currency) =>
    new Intl.NumberFormat(getLocale(), { style: 'currency', currency }).format(amount)
}
