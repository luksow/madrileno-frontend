import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
const STORAGE_KEY = 'theme'

// The `.dark` class on <html> is the source of truth, set before paint by the inline script in
// index.html (no flash). useSyncExternalStore keeps the read SSR-safe.
const listeners = new Set<() => void>()

function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function toggleTheme(): void {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
  document.documentElement.classList.toggle('dark', next === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* storage unavailable — theme still applies for this session */
  }
  listeners.forEach((listener) => listener())
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore<Theme>(subscribe, currentTheme, () => 'light')
  return { theme, toggle: toggleTheme }
}
