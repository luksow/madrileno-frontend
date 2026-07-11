import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
const STORAGE_KEY = 'theme'

// Source of truth is the `.dark` class on <html>, set before paint by the inline script in
// index.html (so there's no flash). We read it through useSyncExternalStore — SSR-safe (the server
// snapshot is 'light') and free of the setState-in-effect antipattern.
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
