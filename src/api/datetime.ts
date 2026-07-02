// The wire boundary for time. The generated contract parses timestamps with
// z.coerce.date(), producing JS Date at the edge; everything past this module
// uses Temporal. ESLint bans the Date global everywhere else (the frontend
// echo of the backend's noRandomUuid scalafix rule).
import { Temporal } from 'temporal-polyfill'

// Cached query data crosses the SSR dehydrate/hydrate boundary as JSON, so a
// value that was a Date on the server arrives as an ISO string in the browser.
// Accept both.
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

// For test fixtures: contract response types carry Date fields (z.coerce.date),
// and this is the only module allowed to construct one.
export function wireDate(iso: string): Date {
  return new Date(iso)
}
