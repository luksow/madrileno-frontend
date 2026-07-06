import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './mswServer'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  // Vitest globals are off, so RTL auto-cleanup doesn't run — unmount explicitly.
  cleanup()
  server.resetHandlers()
  window.localStorage.clear()
})

afterAll(() => {
  server.close()
})
