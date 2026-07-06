// The wire boundary for time. Over the oRPC OpenAPI link, timestamps arrive
// (and stay) ISO strings — JsonifiedClient types them that way — and this
// module converts them to Temporal. ESLint bans the Date global everywhere
// else (the frontend echo of the backend's noRandomUuid scalafix rule).
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
