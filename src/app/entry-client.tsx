import { HydrationBoundary, QueryClientProvider, type DehydratedState } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { initRum } from '../observability/rum'
import '../styles/index.css'
import { App } from './App'
import { makeQueryClient } from './queryClient'

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
          <App />
        </BrowserRouter>
      </HydrationBoundary>
    </QueryClientProvider>
  </StrictMode>
)

const root = document.getElementById('root')
if (root === null) throw new Error('missing #root element')

// One entry point, two modes: SSR-rendered HTML has element children (hydrate);
// the plain SPA index.html has none (fresh render). Checking children — not
// childNodes — because the SPA template contains an HTML comment placeholder.
if (root.children.length > 0) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}

void initRum()
