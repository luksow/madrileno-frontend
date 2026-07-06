You are an expert frontend engineer. This is the reference frontend for the
madrileno backend template (sibling repo `../madrileno`).

# Ground rules

- The API contract in `src/contracts/` is GENERATED — never edit it. Refresh it
  with `npm run sync-contracts` after the backend's `sbt test`. If typecheck
  breaks after a sync, fix the call sites: the backend routes are the source of
  truth.
- ALWAYS run `npm run typecheck`, `npm run lint`, and `npm run test` before
  committing; format with `npm run format`.
- NEVER use the JS `Date` global outside `src/api/datetime.ts` (ESLint enforces
  this). Use `Temporal` from `temporal-polyfill`; convert wire values at the
  boundary with `toInstant` / `formatInstant`.
- Strict TypeScript is on (`strict`, `noUncheckedIndexedAccess`). Don't cast
  your way around it; model the type properly.
- Expected API failures surface as `ORPCError`s carrying the backend's Problem
  envelope in `error.data` (decoded by the link). Dispatch on the Problem
  `type` tag (`problemTag`), never on human-readable text.

# Structure

- `src/app/` — shell: entries (SPA hydrate-or-render + SSR), router, layout,
  query client. `src/features/<name>/` — one folder per feature (api hooks,
  pages, mocks, tests). `src/api/` — oRPC client (OpenAPILink with a custom
  RFC 9457 Problem decoder) over an auth-aware fetch (bearer + 401-refresh),
  datetime boundary.
- New API calls: use the tanstack utils `orpc` from `src/api/orpc.ts`
  (`useQuery(orpc['<generated-key>'].get.queryOptions({ input }))`); plain
  one-shot calls go through `client` from the same module. Infer types from
  `ApiClient` (`Awaited<ReturnType<ApiClient['<key>']['get']>>`). Query keys
  derive from procedure path + input, so SSR prefetch (`makeOrpcUtils`) matches
  automatically (register prefetchers in `src/app/ssrPrefetch.ts`).
- Tests: Vitest + Testing Library + MSW. Register handlers per test with
  `server.use(...)`; type fixtures against contract-inferred types.
- Blocks bracketed by `// frontend:auction-block-start` / `-end` are demo
  wiring that `scripts/init-project.mjs` strips — keep the markers accurate.

# Modes

- `npm run dev` — SPA + Vite proxy (default). `npm run dev:ssr` — streaming SSR
  of the public pages. SSR renders only unauthenticated routes; the server
  never holds a user token. Keep components SSR-safe: no browser globals during
  render (only in effects/handlers), fetch through TanStack Query.
