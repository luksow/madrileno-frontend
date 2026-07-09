import { setTokenProvider } from '@/api/client'

const STORAGE_KEY = 'madrileno.tokens'

export interface Tokens {
  jwt: string
  refreshToken: string
  email: string
}

type Listener = () => void

const isBrowser = typeof window !== 'undefined'

function load(): Tokens | null {
  if (!isBrowser) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw !== null ? (JSON.parse(raw) as Tokens) : null
  } catch {
    return null
  }
}

let current: Tokens | null = load()
const listeners = new Set<Listener>()

// Arrow properties: useSyncExternalStore calls them detached from the object.
export const tokenStore = {
  get: (): Tokens | null => current,
  set: (tokens: Tokens | null): void => {
    current = tokens
    if (isBrowser) {
      if (tokens !== null) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
      else window.localStorage.removeItem(STORAGE_KEY)
    }
    listeners.forEach((listener) => listener())
  },
  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function registerAuthTokenProvider(): void {
  setTokenProvider({
    jwt: () => tokenStore.get()?.jwt,
    refreshToken: () => tokenStore.get()?.refreshToken,
    rotated: (jwt, refreshToken) => {
      const tokens = tokenStore.get()
      if (tokens !== null) tokenStore.set({ ...tokens, jwt, refreshToken })
    },
    invalidated: () => {
      tokenStore.set(null)
    },
  })
}
