import { HydrationBoundary, QueryClientProvider, type DehydratedState } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerAuthTokenProvider } from '@/features/auth/tokenStore'
import { detectLocale } from '@/i18n/config'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { initRum } from '@/observability/rum'
import '../styles/tailwind.css'
import { App } from './App'
import { makeQueryClient } from './queryClient'
import { registerPwa } from './registerPwa'

registerAuthTokenProvider()

// Same resolution as the server (cookie → navigator), so hydration matches; the
// static SPA index.html ships lang="en", so reflect the real locale here.
const clientLocale = detectLocale(document.cookie, navigator.languages.join(','))
document.documentElement.lang = clientLocale

declare global {
  interface Window {
    // Written by server.js on SSR responses: the serialized TanStack Query cache.
    __RQ_STATE__?: DehydratedState
  }
}

const queryClient = makeQueryClient()

const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={window.__RQ_STATE__}>
        <BrowserRouter>
          <LocaleProvider initialLocale={clientLocale}>
            <App />
          </LocaleProvider>
        </BrowserRouter>
      </HydrationBoundary>
    </QueryClientProvider>
  </StrictMode>
)

const root = document.getElementById('root')
if (root === null) throw new Error('missing #root element')

// SSR HTML has element children (hydrate); the SPA template has only a comment node.
if (root.children.length > 0) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}

void initRum()
registerPwa()
