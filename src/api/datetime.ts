// The only module allowed to touch Date (ESLint bans it elsewhere): wire values in, Temporal out.
import { Temporal } from 'temporal-polyfill'
import { useLocale } from 'use-intl'
import { useHydrated } from '@/api/hydration'

export function toInstant(value: Date | string): Temporal.Instant {
  return typeof value === 'string'
    ? Temporal.Instant.from(value)
    : Temporal.Instant.fromEpochMilliseconds(value.getTime())
}

export interface FormatInstantOptions {
  timeZone?: string
  locale?: string
}

export function formatInstant(value: Date | string, options?: FormatInstantOptions): string {
  return toInstant(value)
    .toZonedDateTimeISO(options?.timeZone ?? Temporal.Now.timeZoneId())
    .toLocaleString(options?.locale, { dateStyle: 'medium', timeStyle: 'short' })
}

// The server can't know the visitor's timezone: UTC until hydration, then theirs.
export function useInstantFormatter(): (value: Date | string) => string {
  const hydrated = useHydrated()
  const locale = useLocale()
  return (value) => formatInstant(value, { timeZone: hydrated ? undefined : 'UTC', locale })
}
