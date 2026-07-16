import { createContext, useContext } from 'react'
import type { Locale } from './config'

export const SetLocaleContext = createContext<(locale: Locale) => void>(() => {})

export function useSetLocale(): (locale: Locale) => void {
  return useContext(SetLocaleContext)
}
