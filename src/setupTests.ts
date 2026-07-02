import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './testing/mswServer'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  // RTL's automatic cleanup needs vitest globals, which we keep off — unmount
  // explicitly so DOM doesn't leak between tests.
  cleanup()
  server.resetHandlers()
  window.localStorage.clear()
})

afterAll(() => {
  server.close()
})
