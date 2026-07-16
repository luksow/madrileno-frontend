import { toast } from 'sonner'
import { createTranslator } from 'use-intl/core'
import { registerSW } from 'virtual:pwa-register'
import { messages } from '@/i18n/config'

// This runs outside React (no hooks), so translate via createTranslator.
const t = createTranslator({ locale: 'en', messages, namespace: 'pwa' })

// 'prompt' registration: surface a new build as a toast instead of activating silently.
export function registerPwa(): void {
  const updateSW = registerSW({
    onNeedRefresh() {
      toast(t('updateAvailable'), {
        duration: Infinity,
        action: { label: t('reload'), onClick: () => void updateSW(true) },
      })
    },
    onOfflineReady() {
      toast.success(t('offlineReady'))
    },
  })
}
