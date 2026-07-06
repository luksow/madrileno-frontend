# madrileno-frontend

The reference frontend for the [madrileno](../madrileno) backend template: a
React SPA (with SSR as a working opt-in) built against the backend's
**generated oRPC contract** (baklava's `orpc` output), so the Scala routes are
the single source of truth and drift is a compile error.

Stack: Vite + React 19 + TypeScript (strict) + TanStack Query + oRPC
(`@orpc/openapi-client` + `@orpc/tanstack-query`) + zod + react-router +
react-hook-form + Temporal.
Tests: Vitest + Testing Library + MSW, plus a Playwright e2e smoke. No
component framework — plain CSS; bring your own design system.

## The contract loop (the whole point)

```
Scala router specs ──sbt test──▶ target/baklava/orpc/src/*.ts
                                        │  npm run sync-contracts
                                        ▼
                              src/contracts/ (vendored, committed)
                                        │  typed clients + hooks
                                        ▼
                         npm run typecheck  ← fails on contract drift
```

Rename a field in a backend DTO, run `sbt test` + `npm run sync-contracts`,
and `npm run typecheck` fails at the exact frontend call site. The contract is
committed, so CI and fresh clones need no backend checkout.

## Quick start

You need Node 22+ (Node ≥20.19 works) and the backend running
([backend README](../madrileno)):

```bash
npm install
npm run dev          # SPA on http://localhost:5173, /v1 proxied to :9000
```

The Vite proxy makes API calls same-origin, so the backend needs **no CORS
config in dev**. Log in on `/login` (any email — the backend's dev auth), then
browse, bid, and watch the typed error envelope when a bid is too low.

Refreshing the contract after backend changes:

```bash
(cd ../madrileno && sbt test)   # regenerates target/baklava/orpc
npm run sync-contracts
npm run typecheck               # surfaces any drift as compile errors
```

## SPA by default, SSR when you want it

`npm run dev` / `npm run build` is a plain SPA — static files, any web server.
That's the default and the cheapest thing to operate.

The **SSR opt-in** (`server.js` + `src/app/entry-server.tsx`) server-renders
the _public_ pages — auction list and detail/bids — with TanStack Query
prefetch + dehydrate, streaming the HTML and hydrating on the client:

```bash
npm run dev:ssr                       # dev SSR (Vite middleware mode)
npm run build:ssr && npm run preview:ssr   # production SSR
curl -s localhost:5173 | grep card    # server-rendered auction HTML
```

Design notes:

- **Only unauthenticated routes render on the server.** Auth is a JWT in
  localStorage; the server never sees it, and doesn't need to — logged-in
  actions (bidding) are client-side interactions anyway. If you need
  authenticated SSR, switch to cookie-based sessions first.
- Components are **SSR-safe by construction**: no browser globals during
  render, data via TanStack Query, tokens behind an environment guard. Keep
  new code that way (CI builds the SSR bundle so regressions surface) and the
  SPA→SSR switch stays an afternoon of plumbing, not a rewrite.
- The SSR server (Express, `/healthz`, `Dockerfile`) is a second deployable.
  `API_BASE_URL` tells it where the backend is for server-side prefetch.

## Production

- **SPA**: `npm run build`, serve `dist/`. Set `VITE_API_BASE_URL` to the API
  origin at build time and add that frontend origin to the backend's
  `CORS_ALLOWED_ORIGINS`.
- **SSR**: `docker build .` (multi-stage, healthcheck on `/healthz`), run with
  `PORT` and `API_BASE_URL`. The production server forwards `/v1` to
  `API_BASE_URL` (same-origin for browsers, mirroring the dev proxy), so no
  CORS and no `VITE_API_BASE_URL` are needed unless you deliberately serve
  the API from a different origin.

## Observability (opt-in)

OpenObserve RUM pairs with the backend's OpenObserve instance: set the
`VITE_OPENOBSERVE_RUM_*` variables (see `.env.sample`; client token from
OpenObserve → Ingestion) and sessions, replays, and browser errors land next
to the backend traces. Unset = the SDK never loads (it's a lazy chunk).

## Conventions

- **Types from the contract**: `Awaited<ReturnType<ApiClient['<key>']['get']>>`
  — never hand-written DTOs. `JsonifiedClient` keeps them wire-true
  (timestamps are ISO strings, matching what actually crosses HTTP).
- **Errors are declared and typed end to end**: the generated contracts declare
  errors under the backend's stable Problem `type` codes (extracted from the
  captured examples), the link's `customErrorResponseBodyDecoder` lifts RFC
  9457 responses into defined `ORPCError`s under the same codes, and
  `isDefinedError` narrows to the declared union. UI dispatches on the code,
  never on display text.
- **Temporal, not Date**: ESLint bans the `Date` global everywhere except
  `src/api/datetime.ts`, the wire boundary that converts ISO strings to
  `Temporal`.
- **Feature folders**: `src/features/<name>/` holds api hooks, pages, mocks,
  tests. The shell (`src/app/`, `src/auth/`, `src/api/`) stays feature-free.
- **MSW handlers are typed against the contract** — the frontend's echo of the
  backend's router specs.

## Starting a real project

```bash
node scripts/init-project.mjs my-project
```

Deletes the auction demo (`src/features/auctions/` + every
`frontend:auction-block-*` marker block), leaving a runnable shell: login,
typed client, routing, tests, SSR opt-in. After running the backend's own
`init-project.scala`, regenerate + resync the contract.

## Scripts

| Script                                   | What                                                                                          |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `dev` / `build` / `preview`              | SPA (default)                                                                                 |
| `dev:ssr` / `build:ssr` / `preview:ssr`  | SSR opt-in                                                                                    |
| `typecheck` / `lint` / `format` / `test` | the gate (all run in CI)                                                                      |
| `e2e` / `e2e:prod`                       | Playwright smoke vs the dev / built production SSR server (needs the live backend; not in CI) |
| `smoke:docker`                           | build + run the SSR image, verify healthz, SSR HTML and the container healthcheck             |
| `sync-contracts`                         | vendor the backend-generated contract                                                         |
| `init-project`                           | strip the demo for a fresh project                                                            |
