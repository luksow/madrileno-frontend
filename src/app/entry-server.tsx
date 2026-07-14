import { dehydrate, QueryClientProvider, type DehydratedState } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import {
  assertIsLocale,
  baseLocale,
  cookieName,
  locales,
  overwriteGetLocale,
} from '@/paraglide/runtime'
import { App } from './App'
import { makeQueryClient } from './queryClient'
import { ssrPrefetchers } from './ssrPrefetch'

// Per-request SSR locale. The render is synchronous (data is prefetched before
// renderToPipeableStream), so a module-scoped value set immediately before the
// render is concurrency-safe — no await interleaves between the assignment and
// the synchronous shell render that reads it via getLocale().
let ssrLocale: string = baseLocale
overwriteGetLocale(() => assertIsLocale(ssrLocale))

export { cookieName }

// Resolve the request locale from the paraglide cookie, else Accept-Language,
// else the base locale. Lives here (bundled into dist/server) so server.js can
// stay paraglide-free — the prod image ships dist/, not src/paraglide.
export function detectLocale(cookieHeader?: string, acceptLanguage?: string): string {
  const supported: readonly string[] = locales
  const fromCookie = cookieHeader
    ? new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`).exec(cookieHeader)?.[1]
    : undefined
  if (fromCookie !== undefined && supported.includes(fromCookie)) return fromCookie
  for (const part of (acceptLanguage ?? '').split(',')) {
    const base = part.trim().split(';')[0]?.split('-')[0]?.toLowerCase()
    if (base !== undefined && supported.includes(base)) return base
  }
  return baseLocale
}

export interface RenderResult {
  pipe: (destination: Parameters<ReturnType<typeof renderToPipeableStream>['pipe']>[0]) => void
  abort: () => void
  dehydratedState: DehydratedState
}

// Resolves on onShellReady, rejects on shell error — the caller can pipe immediately.
export async function render(
  url: string,
  apiBaseUrl: string,
  locale: string,
): Promise<RenderResult> {
  const queryClient = makeQueryClient()
  // Prefetchers are independent — pay for the slowest, not the sum.
  await Promise.all(ssrPrefetchers.map((prefetch) => prefetch(queryClient, url, apiBaseUrl)))
  const dehydratedState = dehydrate(queryClient)
  // Set the locale right before the synchronous render (see ssrLocale note above).
  ssrLocale = locale
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
