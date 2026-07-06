// The only module allowed to touch Date (ESLint bans it elsewhere): wire values in, Temporal out.
import { Temporal } from 'temporal-polyfill'

export function toInstant(value: Date | string): Temporal.Instant {
  return typeof value === 'string'
    ? Temporal.Instant.from(value)
    : Temporal.Instant.fromEpochMilliseconds(value.getTime())
}

export function formatInstant(value: Date | string): string {
  return toInstant(value)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
