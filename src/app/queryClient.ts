import { QueryClient } from '@tanstack/react-query'

// Fresh client per SSR request; staleTime > 0 so hydrated data isn't refetched immediately.
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
    },
  })
}
