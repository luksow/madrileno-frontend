# Security

This documents the deliberate security tradeoffs of the starter so you can accept or change them
before shipping. None of these are accidental.

## Token storage — localStorage (XSS-exposed by design)

The JWT + refresh token are kept in `localStorage` (`src/features/auth/tokenStore.ts`).

**The tradeoff:** `localStorage` is readable by any JavaScript running on the page, so a
successful XSS attack can exfiltrate the tokens. In exchange it is SSR-safe (the server never
touches it), immune to CSRF (nothing is sent automatically by the browser), and simple — the
auth-aware fetch attaches the bearer token explicitly.

**Why it's acceptable here:** the CSP below makes XSS substantially harder (no inline scripts
without the per-request nonce), and this is a starter meant to be adapted. For a low-to-moderate
risk app it's a reasonable, common choice.

**When to change it:** if you handle sensitive data or need defense-in-depth, move to
**httpOnly, Secure, SameSite cookies** so tokens are unreadable by JavaScript. That shifts token
handling to the backend (set-cookie on login/refresh; the browser sends them automatically) and
requires CSRF protection (SameSite=Lax/Strict plus a CSRF token for state-changing requests). The
SSR `/v1` forwarder already passes `Set-Cookie` through, so the backend can own the cookie.

## Content Security Policy

The production SSR server (`server.js`) sets a strict CSP on HTML responses:

- `script-src 'self' 'nonce-…'` — **no `unsafe-inline` for scripts.** The two inline scripts (the
  pre-paint theme setter and the dehydrated-state script) are authorized by a fresh per-request
  nonce; injected `<script>` markup without the nonce won't execute.
- `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`.
- `style-src` keeps `'unsafe-inline'` — inline-style injection is far lower risk than script, and
  some UI libraries set inline styles.

Notes:

- **Dev has no CSP** — Vite's HMR needs inline/eval. CSP applies only when `NODE_ENV=production`.
- **Static SPA deploys** (no SSR server) must set the CSP at the CDN/host, and allow the pre-paint
  theme script via its hash instead of a nonce.
- Enabling **OpenObserve RUM** requires adding its host to `connect-src`.

## Other posture

- **No dev auth in production** — the demo login (`/v1/auth/dev`) is gated by the backend's
  `DEV_AUTH_ENABLED`; keep it off in production.
- **SSR server** disables `x-powered-by`, sends `X-Content-Type-Options: nosniff` and
  `Referrer-Policy: strict-origin-when-cross-origin`, strips hop-by-hop headers on the `/v1`
  forward, and never leaks stack traces to production visitors.
- **CORS** — in dev the Vite proxy makes the API same-origin (no CORS). A separately-deployed
  frontend sets the backend's `CORS_ALLOWED_ORIGINS`.

## Reporting

Report vulnerabilities privately to the maintainer rather than opening a public issue.
