import { toast } from 'sonner'
import { registerSW } from 'virtual:pwa-register'

// Registers the generated service worker (client-only). Bundled rather than
// injected as an inline <script>, so the prod nonce CSP needs no exception.
// registerType is 'prompt': a new build never activates behind the user's back —
// we surface it as a toast and let them reload.
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
