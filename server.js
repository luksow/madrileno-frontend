import fs from 'node:fs/promises'
import { Transform } from 'node:stream'
import express from 'express'

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT ?? 5173)
// Server-side prefetch target; the browser keeps using VITE_API_BASE_URL.
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

  // Same-origin /v1 (Vite's proxy provides this in dev); without it the SSR
  // catch-all below answers API calls with rendered HTML.
  const { Readable } = await import('node:stream')
  app.use('/v1', async (req, res) => {
    try {
      const target = new URL(req.originalUrl, apiBaseUrl)
      const headers = { ...req.headers }
      delete headers.host
      delete headers.connection
      const upstream = await fetch(target, {
        method: req.method,
        headers,
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
        duplex: 'half',
        redirect: 'manual',
      })
      res.status(upstream.status)
      upstream.headers.forEach((value, key) => {
        // fetch already decompressed the body; hop-by-hop headers must not be forwarded.
        if (
          !['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key)
        ) {
          res.setHeader(key, value)
        }
      })
      if (upstream.body) Readable.fromWeb(upstream.body).pipe(res)
      else res.end()
    } catch (e) {
      console.error('API forward failed:', e)
      res.status(502).json({ type: 'about:blank', status: 502, title: 'Upstream unavailable' })
    }
  })
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

    const { pipe, abort, dehydratedState } = await render(url, apiBaseUrl)

    res.status(200)
    res.set({
      'Content-Type': 'text/html',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    })

    const [htmlStart, htmlEnd] = template.split('<!--app-html-->')
    // Escape `<` so state can't close the script tag and inject markup.
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
