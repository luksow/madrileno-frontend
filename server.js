// SSR server — the opt-in mode (`npm run dev:ssr` / `npm run preview:ssr`).
// The default workflow is the plain SPA (`npm run dev`); this server exists for
// deployments that want server-rendered public pages. See README.
import fs from 'node:fs/promises'
import { Transform } from 'node:stream'
import express from 'express'

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT ?? 5173)
// Where the server itself fetches the API from during prefetch (server-to-server,
// so no CORS involved). The browser side keeps using VITE_API_BASE_URL.
const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:9000'
const ABORT_DELAY = 10000

const app = express()
app.disable('x-powered-by')

/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(sirv('./dist/client', { extensions: [] }))
}

const templateHtml = isProduction ? await fs.readFile('./dist/client/index.html', 'utf-8') : ''

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl

    /** @type {string} */
    let template
    /** @type {import('./src/app/entry-server.tsx').render} */
    let render
    if (!isProduction) {
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/app/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    // render() resolves once the shell is ready to stream (and rejects on a
    // shell error, landing in the catch below) — safe to pipe immediately.
    const { pipe, abort, dehydratedState } = await render(url, apiBaseUrl)

    res.status(200)
    res.set({
      'Content-Type': 'text/html',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    })

    const [htmlStart, htmlEnd] = template.split('<!--app-html-->')
    // Escape `<` so a value inside the dehydrated state can't close the
    // script tag and inject markup.
    const stateJson = JSON.stringify(dehydratedState).replace(/</g, '\\u003c')
    const stateScript = `<script>window.__RQ_STATE__=${stateJson}</script>`

    const transformStream = new Transform({
      transform(chunk, encoding, callback) {
        res.write(chunk, encoding)
        callback()
      },
    })
    transformStream.on('finish', () => {
      res.write(stateScript)
      res.end(htmlEnd)
    })

    res.write(htmlStart)
    pipe(transformStream)

    setTimeout(() => abort(), ABORT_DELAY)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(port, () => {
  console.log(`SSR server started at http://localhost:${port} (api: ${apiBaseUrl})`)
})
