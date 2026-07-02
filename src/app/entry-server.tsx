import { dehydrate, QueryClientProvider, type DehydratedState } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import { makeQueryClient } from './queryClient'
// frontend:auction-block-start
import { prefetchAuctionsForUrl } from '../features/auctions/prefetch'
// frontend:auction-block-end

export interface RenderResult {
  pipe: (destination: Parameters<ReturnType<typeof renderToPipeableStream>['pipe']>[0]) => void
  abort: () => void
  dehydratedState: DehydratedState
}

// SSR entry: prefetch the public data for the requested URL into a fresh
// per-request QueryClient, dehydrate it for the client to hydrate, then stream.
// Auth-gated data is never fetched here — the server holds no user token.
//
// The promise resolves when the shell is ready to stream (onShellReady) and
// rejects on a shell error — so the caller can pipe immediately after awaiting,
// with no assumptions about React's callback scheduling.
//
// _apiBaseUrl is underscore-prefixed because init-project strips the demo's
// prefetch (its only consumer) and the parameter must survive as unused.
export async function render(url: string, _apiBaseUrl: string): Promise<RenderResult> {
  const queryClient = makeQueryClient()
  // frontend:auction-block-start
  await prefetchAuctionsForUrl(queryClient, url, _apiBaseUrl)
  // frontend:auction-block-end
  const dehydratedState = dehydrate(queryClient)
  return new Promise<RenderResult>((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </QueryClientProvider>
      </StrictMode>,
      {
        onShellReady() {
          resolve({ pipe, abort, dehydratedState })
        },
        onShellError(error) {
          reject(error instanceof Error ? error : new Error(String(error)))
        },
        onError(error) {
          console.error(error)
        },
      },
    )
  })
}
