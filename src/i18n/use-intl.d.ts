import type en from './messages/en.json'

// Types t() keys against the message shape — a missing or misnamed key is a
// compile error, no codegen.
declare module 'use-intl' {
  interface AppConfig {
    Locale: 'en'
    Messages: typeof en
  }
}
