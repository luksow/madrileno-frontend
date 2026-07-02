import { setTokenProvider } from '../api/client'

// Token storage: in-memory source of truth, persisted to localStorage in the
// browser, absent on the server. SSR renders only public pages, so the server
// never needs (or sees) a token.
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

// Arrow-function properties (not methods) so they can be passed around freely —
// useSyncExternalStore receives them detached from the object.
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

// Wire this store into the api layer's client as its token source. Importing
// any auth module (the shell always does, via useAuth) activates bearer
// injection and the 401-refresh flow.
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
