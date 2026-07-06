#!/usr/bin/env node
// Build the SSR image and verify the container: /healthz, SSR HTML, HEALTHCHECK.
// Needs the backend on :9000. Usage: npm run smoke:docker
import { execSync, spawnSync } from 'node:child_process'

const IMAGE = 'madrileno-frontend:smoke'
const NAME = 'fe-docker-smoke'
const PORT = 5179

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts })
const out = (cmd) => execSync(cmd, { encoding: 'utf-8' }).trim()

const fail = (msg) => {
  console.error(`\nFAIL: ${msg}`)
  spawnSync('docker', ['rm', '-f', NAME], { stdio: 'ignore' })
  process.exit(1)
}

console.log('== build image ==')
sh(`docker build -t ${IMAGE} .`)

spawnSync('docker', ['rm', '-f', NAME], { stdio: 'ignore' })
console.log('== run container ==')
sh(
  `docker run -d --name ${NAME} --network=host -e PORT=${String(PORT)} -e API_BASE_URL=http://localhost:9000 ${IMAGE}`,
)

const started = Date.now()
let healthz = false
while (Date.now() - started < 30_000) {
  try {
    const res = await fetch(`http://localhost:${String(PORT)}/healthz`)
    if (res.ok) {
      healthz = true
      break
    }
  } catch {
    /* not up yet */
  }
  await new Promise((r) => setTimeout(r, 1000))
}
if (!healthz) fail('/healthz never answered')
console.log('healthz OK')

const html = await (await fetch(`http://localhost:${String(PORT)}/`)).text()
if (!html.includes('Wine auctions')) fail('SSR HTML missing rendered content')
if (!html.includes('__RQ_STATE__')) fail('SSR HTML missing dehydrated cache script')
console.log('SSR HTML OK (rendered content + hydration state)')

let containerHealth = 'starting'
while (Date.now() - started < 90_000) {
  containerHealth = out(`docker inspect --format '{{.State.Health.Status}}' ${NAME}`)
  if (containerHealth === 'healthy' || containerHealth === 'unhealthy') break
  await new Promise((r) => setTimeout(r, 3000))
}
if (containerHealth !== 'healthy') fail(`container HEALTHCHECK is '${containerHealth}'`)
console.log('container HEALTHCHECK healthy')

sh(`docker rm -f ${NAME}`, { stdio: 'ignore' })
console.log('\nDocker smoke: PASS')
