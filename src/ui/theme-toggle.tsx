import { Moon, Sun } from 'lucide-react'
import { Button } from '@/ui/button'
import { useTheme } from '@/ui/theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  )
}
