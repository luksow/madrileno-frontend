import en from './messages/en.json'
import es from './messages/es.json'

export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const localeCookie = 'LOCALE'

// Recursively widen leaf string literals so a translation with different text
// still satisfies the shape — but any locale missing a key, at any depth, is a
// compile error.
type WidenLeaves<T> = T extends string ? string : { [K in keyof T]: WidenLeaves<T[K]> }
type Messages = WidenLeaves<typeof en>
export const messagesByLocale = { en, es } satisfies Record<Locale, Messages>

// Language names are shown in their own language, not translated.
export const localeNames: Record<Locale, string> = { en: 'English', es: 'Español' }

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

// Cookie → Accept-Language → default. Pure, so both server.js and the client
// resolve the locale the same way (no hydration mismatch).
export function detectLocale(cookieHeader?: string, acceptLanguage?: string): Locale {
  const fromCookie = cookieHeader
    ? new RegExp(`(?:^|;\\s*)${localeCookie}=([^;]+)`).exec(cookieHeader)?.[1]
    : undefined
  if (fromCookie !== undefined && isLocale(fromCookie)) return fromCookie
  for (const part of (acceptLanguage ?? '').split(',')) {
    const base = part.trim().split(';')[0]?.split('-')[0]?.toLowerCase()
    if (base !== undefined && isLocale(base)) return base
  }
  return defaultLocale
}
