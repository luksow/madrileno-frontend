import { Check, Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'use-intl'
import { localeNames, locales } from '@/i18n/config'
import { useSetLocale } from '@/i18n/locale-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageToggle() {
  const t = useTranslations('language')
  const current = useLocale()
  const setLocale = useSetLocale()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={t('label')} />}>
        <Languages />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} onClick={() => setLocale(locale)}>
            <Check className={locale === current ? 'opacity-100' : 'opacity-0'} />
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
