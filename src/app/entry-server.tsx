import { dehydrate, QueryClientProvider, type DehydratedState } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import { makeQueryClient } from './queryClient'
import { ssrPrefetchers } from './ssrPrefetch'

export interface RenderResult {
  pipe: (destination: Parameters<ReturnType<typeof renderToPipeableStream>['pipe']>[0]) => void
  abort: () => void
  dehydratedState: DehydratedState
}

// Resolves on onShellReady, rejects on shell error — the caller can pipe immediately.
export async function render(url: string, apiBaseUrl: string): Promise<RenderResult> {
  const queryClient = makeQueryClient()
  for (const prefetch of ssrPrefetchers) {
    await prefetch(queryClient, url, apiBaseUrl)
  }
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
