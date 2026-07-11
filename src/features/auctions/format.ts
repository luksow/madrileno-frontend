import { useHydrated } from '@/api/hydration'

// Same hydration contract as useInstantFormatter: a fixed locale until the
// client takes over, the visitor's ambient locale after.
export function usePriceFormatter(): (amount: number, currency: string) => string {
  const hydrated = useHydrated()
  const locale = hydrated ? undefined : 'en-US'
  return (amount, currency) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}
