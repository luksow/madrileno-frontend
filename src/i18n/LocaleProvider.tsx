import { type ReactNode } from 'react'
import { IntlProvider } from 'use-intl'
import { messages } from './config'

// timeZone is a deliberate SSR-safe default; our own date formatting is custom.
export function LocaleProvider({ children }: { children: ReactNode }) {
  return (
    <IntlProvider locale="en" messages={messages} timeZone="UTC">
      {children}
    </IntlProvider>
  )
}
