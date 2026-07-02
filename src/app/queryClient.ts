import { QueryClient } from '@tanstack/react-query'

// A factory, not a singleton: the SSR server needs a fresh client per request
// (no cross-request cache bleed), the browser creates one at startup.
// staleTime > 0 so SSR-dehydrated data isn't refetched the moment it hydrates.
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
    },
  })
}
