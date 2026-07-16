import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useTranslations } from 'use-intl'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { useSetLocale } from '@/i18n/locale-context'

function Probe() {
  const t = useTranslations('nav')
  const setLocale = useSetLocale()
  return (
    <>
      <span data-testid="label">{t('logIn')}</span>
      <button onClick={() => setLocale('es')}>switch</button>
    </>
  )
}

describe('LocaleProvider', () => {
  it('renders the initial locale, then switches in place and persists a cookie', async () => {
    render(
      <LocaleProvider initialLocale="en">
        <Probe />
      </LocaleProvider>,
    )
    expect(screen.getByTestId('label')).toHaveTextContent('Log in')

    await userEvent.click(screen.getByText('switch'))

    expect(screen.getByTestId('label')).toHaveTextContent('Iniciar sesión')
    expect(document.cookie).toContain('LOCALE=es')
    expect(document.documentElement.lang).toBe('es')
  })
})
