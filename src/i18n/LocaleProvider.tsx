import { useCallback, useState, type ReactNode } from 'react'
import { IntlProvider } from 'use-intl'
import { localeCookie, messagesByLocale, type Locale } from './config'
import { SetLocaleContext } from './locale-context'

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: ReactNode
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  // Switch in place (both catalogs are already loaded) and persist the choice.
  // Guarded to the browser — never runs during SSR render.
  const changeLocale = useCallback((next: Locale) => {
    document.cookie = `${localeCookie}=${next}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = next
    setLocale(next)
  }, [])

  return (
    <SetLocaleContext.Provider value={changeLocale}>
      {/* Deliberate default: date/number formatting is custom (see api/datetime.ts),
          but a fixed timeZone keeps use-intl's own formatters SSR-safe and silences
          its ENVIRONMENT_FALLBACK warning. */}
      <IntlProvider locale={locale} messages={messagesByLocale[locale]} timeZone="UTC">
        {children}
      </IntlProvider>
    </SetLocaleContext.Provider>
  )
}
