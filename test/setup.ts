import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { tokenStore } from '@/features/auth/tokenStore'
import { server } from './mswServer'

// jsdom has no matchMedia; the theme (and sonner) read it.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  // Vitest globals are off, so RTL auto-cleanup doesn't run — unmount explicitly.
  cleanup()
  server.resetHandlers()
  // tokenStore caches in memory; clearing localStorage alone would leak auth
  // state between tests.
  tokenStore.set(null)
  window.localStorage.clear()
})

afterAll(() => {
  server.close()
})
