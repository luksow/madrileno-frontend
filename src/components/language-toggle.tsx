import { Check, Languages } from 'lucide-react'
import { m } from '@/paraglide/messages'
import { getLocale, locales, setLocale } from '@/paraglide/runtime'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Language names are shown in their own language, not translated.
const localeNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
}

export function LanguageToggle() {
  const current = getLocale()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label={m.language_label()} />}
      >
        <Languages />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          // setLocale persists the choice (cookie) and reloads so SSR re-renders in the new language.
          <DropdownMenuItem key={locale} onClick={() => void setLocale(locale)}>
            <Check className={locale === current ? 'opacity-100' : 'opacity-0'} />
            {localeNames[locale] ?? locale}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
