import { toast } from 'sonner'
import { createTranslator } from 'use-intl/core'
import { registerSW } from 'virtual:pwa-register'
import { detectLocale, messagesByLocale } from '@/i18n/config'

// This runs outside React (no hooks), so translate via createTranslator. Resolve
// the locale at toast time so it reflects the current cookie.
function pwaTranslator() {
  const locale = detectLocale(document.cookie, navigator.languages.join(','))
  return createTranslator({ locale, messages: messagesByLocale[locale], namespace: 'pwa' })
}

// 'prompt' registration: surface a new build as a toast instead of activating silently.
export function registerPwa(): void {
  const updateSW = registerSW({
    onNeedRefresh() {
      const t = pwaTranslator()
      toast(t('updateAvailable'), {
        duration: Infinity,
        action: { label: t('reload'), onClick: () => void updateSW(true) },
      })
    },
    onOfflineReady() {
      toast.success(pwaTranslator()('offlineReady'))
    },
  })
}
