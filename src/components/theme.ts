import { useSyncExternalStore } from 'react'

export type ThemePref = 'light' | 'dark' | 'system'
const STORAGE_KEY = 'theme'

// The `.dark` class on <html> is the applied theme, set before paint by the inline script in
// index.html (no flash). The stored preference is light/dark/system; 'system' follows the OS.
const listeners = new Set<() => void>()

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function storedPref(): ThemePref {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* storage unavailable */
  }
  return 'system'
}

function applyPref(pref: ThemePref): void {
  const dark = pref === 'dark' || (pref === 'system' && prefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  // While following the OS, re-apply the class when the OS preference flips.
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const onMedia = () => {
    if (storedPref() === 'system') applyPref('system')
  }
  mql.addEventListener('change', onMedia)
  return () => {
    listeners.delete(onChange)
    mql.removeEventListener('change', onMedia)
  }
}

export function setTheme(pref: ThemePref): void {
  try {
    localStorage.setItem(STORAGE_KEY, pref)
  } catch {
    /* storage unavailable — still applies for this session */
  }
  applyPref(pref)
  listeners.forEach((listener) => listener())
}

export function useTheme(): { theme: ThemePref; setTheme: (pref: ThemePref) => void } {
  const theme = useSyncExternalStore<ThemePref>(subscribe, storedPref, () => 'system')
  return { theme, setTheme }
}
