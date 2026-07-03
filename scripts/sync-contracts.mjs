#!/usr/bin/env node
// Vendor the backend-generated ts-rest contract into src/contracts/.
//
// The backend emits the contract from its router specs (`sbt test` writes
// target/baklava/tsrest/src/*.ts). The generated sources import only `zod` and
// `@ts-rest/core`, so they compile directly under Vite/tsc — no build step.
// They are committed here so the frontend builds standalone (CI needs no backend).
//
// Loop: backend `sbt test` -> `npm run sync-contracts` -> `npm run typecheck`
// (a renamed backend DTO field fails typecheck at the frontend call site).
//
// Usage: node scripts/sync-contracts.mjs [source-dir]
//        CONTRACTS_SRC=<dir> node scripts/sync-contracts.mjs
import fs from 'node:fs'
import path from 'node:path'

const source =
  process.argv[2] ??
  process.env.CONTRACTS_SRC ??
  path.join('..', 'madrileno', 'target', 'baklava', 'orpc', 'src')
const dest = path.join('src', 'contracts')

if (!fs.existsSync(path.join(source, 'contracts.ts'))) {
  console.error(`No generated contract found at '${source}' (missing contracts.ts).`)
  console.error('Generate it first: run `sbt test` in the backend repo, then re-run this script.')
  console.error(
    'Different backend location? node scripts/sync-contracts.mjs <path-to>/target/baklava/tsrest/src',
  )
  process.exit(1)
}

fs.rmSync(dest, { recursive: true, force: true })
fs.mkdirSync(dest, { recursive: true })
const files = fs.readdirSync(source).filter((f) => f.endsWith('.ts'))
for (const f of files) {
  fs.copyFileSync(path.join(source, f), path.join(dest, f))
}
fs.writeFileSync(
  path.join(dest, 'GENERATED.md'),
  '# Generated — do not edit\n\nVendored from the backend ts-rest contract' +
    ' (`target/baklava/tsrest/src`, produced by `sbt test`).\n' +
    'Refresh with `npm run sync-contracts`.\n',
)
console.log(`Synced ${files.length} contract file(s): ${source} -> ${dest}`)
