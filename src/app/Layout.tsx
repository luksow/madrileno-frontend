import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { m } from '@/paraglide/messages'
import { useAuth } from '@/features/auth/useAuth'
import { Button, buttonVariants } from '@/components/ui/button'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'

export function Layout({ children }: { children: ReactNode }) {
  const { tokens, logout } = useAuth()
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        {m.skip_to_content()}
      </a>
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
                  {m.nav_log_out()}
                </Button>
              </>
            ) : (
              <Link to="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                {m.nav_log_in()}
              </Link>
            )}
            <LanguageToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-8 outline-none">
        {children}
      </main>
    </>
  )
}
