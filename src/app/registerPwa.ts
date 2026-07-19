import { toast } from 'sonner'
import { registerSW } from 'virtual:pwa-register'

// 'prompt' registration: surface a new build as a toast instead of activating silently.
export function registerPwa(): void {
  const updateSW = registerSW({
    onNeedRefresh() {
      toast('A new version is available.', {
        duration: Infinity,
        action: { label: 'Reload', onClick: () => void updateSW(true) },
      })
    },
    onOfflineReady() {
      toast.success('Ready to work offline.')
    },
  })
}
