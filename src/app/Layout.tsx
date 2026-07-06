import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

export function Layout({ children }: { children: ReactNode }) {
  const { tokens, logout } = useAuth()
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">
          madrileno
        </Link>
        <nav>
          {tokens !== null ? (
            <>
              <span className="muted">{tokens.email}</span>
              <button className="link-button" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </nav>
      </header>
      <main className="container">{children}</main>
    </>
  )
}
