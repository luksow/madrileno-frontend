import { useSyncExternalStore } from 'react'

const subscribeNever = () => () => {}

// false during SSR and the hydration render, true from the first client render
// after mount (immediately true in the SPA, which never hydrates). Use it to
// defer anything the server can't know — visitor timezone, locale — so the
// hydration render reproduces the server markup exactly.
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )
}
