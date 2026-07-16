import { describe, expect, it } from 'vitest'
import { detectLocale } from '@/i18n/config'

describe('detectLocale', () => {
  it('prefers a valid LOCALE cookie over Accept-Language', () => {
    expect(detectLocale('LOCALE=es', 'en-US,en;q=0.9')).toBe('es')
    expect(detectLocale('foo=1; LOCALE=en; bar=2', 'es-ES')).toBe('en')
  })

  it('falls back to Accept-Language when there is no cookie', () => {
    expect(detectLocale(undefined, 'es-ES,es;q=0.9,en;q=0.8')).toBe('es')
    expect(detectLocale('', 'en-GB,en')).toBe('en')
  })

  it('ignores an unsupported cookie and unsupported languages', () => {
    // Invalid cookie value → fall through to Accept-Language.
    expect(detectLocale('LOCALE=fr', 'es')).toBe('es')
    // Nothing supported → default locale.
    expect(detectLocale(undefined, 'fr-FR,de;q=0.9')).toBe('en')
  })

  it('defaults to en with no signals', () => {
    expect(detectLocale(undefined, undefined)).toBe('en')
    expect(detectLocale('', '')).toBe('en')
  })
})
