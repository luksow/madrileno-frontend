import { describe, expect, it } from 'vitest'
import { tokenStore } from '@/features/auth/tokenStore'

const STORAGE_KEY = 'madrileno.tokens'

// The 'storage' event only fires for writes from *other* tabs; simulate one by
// writing localStorage directly and dispatching the event ourselves.
function writeFromAnotherTab(value: string | null) {
  if (value !== null) window.localStorage.setItem(STORAGE_KEY, value)
  else window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: value }))
}

describe('tokenStore cross-tab sync', () => {
  it('adopts tokens rotated by another tab', () => {
    tokenStore.set({ jwt: 'old', refreshToken: 'old-rt', email: 'a@example.com' })
    writeFromAnotherTab(
      JSON.stringify({ jwt: 'rotated', refreshToken: 'rotated-rt', email: 'a@example.com' }),
    )
    expect(tokenStore.get()?.jwt).toBe('rotated')
    expect(tokenStore.get()?.refreshToken).toBe('rotated-rt')
  })

  it('logs out when another tab drops the session', () => {
    tokenStore.set({ jwt: 'old', refreshToken: 'old-rt', email: 'a@example.com' })
    writeFromAnotherTab(null)
    expect(tokenStore.get()).toBeNull()
  })

  it('treats persisted values with the wrong shape as logged out', () => {
    writeFromAnotherTab(JSON.stringify({ token: 'legacy-format' }))
    expect(tokenStore.get()).toBeNull()
    writeFromAnotherTab('not even json')
    expect(tokenStore.get()).toBeNull()
  })
})
