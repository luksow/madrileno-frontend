import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { tokenStore } from '@/features/auth/tokenStore'
import { server } from './mswServer'

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
