import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { Button } from '@/ui/button'
import { ThemeToggle } from '@/ui/theme-toggle'

export function Layout({ children }: { children: ReactNode }) {
  const { tokens, logout } = useAuth()
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-primary">
            madrileno
          </Link>
          <nav className="flex items-center gap-3">
            {tokens !== null ? (
              <>
                <span className="text-sm text-muted-foreground">{tokens.email}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </>
  )
}
