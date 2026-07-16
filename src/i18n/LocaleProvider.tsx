import { type ReactNode } from 'react'
import { IntlProvider } from 'use-intl'
import { messages } from './config'

// Single fixed locale (English). timeZone is a deliberate SSR-safe default —
// date/number formatting is custom (see api/datetime.ts), this just keeps
// use-intl's own formatters consistent and quiet.
export function LocaleProvider({ children }: { children: ReactNode }) {
  return (
    <IntlProvider locale="en" messages={messages} timeZone="UTC">
      {children}
    </IntlProvider>
  )
}
