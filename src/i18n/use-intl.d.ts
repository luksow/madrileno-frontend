import type en from './messages/en.json'
import type { Locale } from './config'

// Types t() keys and useLocale() against the message shape — a missing or
// misnamed key is a compile error, no codegen.
declare module 'use-intl' {
  interface AppConfig {
    Locale: Locale
    Messages: typeof en
  }
}
