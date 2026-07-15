import http from 'node:http'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FeedGenerator,
  getOriginFromRequest,
  normalizeSiteUrl,
  parseFeedFilters,
} from '../scripts/feeds/generator.js'
import { injectMeta, resolveSeoPayload, robotsForPath } from '../scripts/feeds/seo.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT, 'dist')

/** Load .env for local `npm start` (Docker already injects process.env). */
function loadDotEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  const text = fs.readFileSync(envPath, 'utf8')
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    if (!key || process.env[key] !== undefined) continue
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

loadDotEnv()

// Prefer PORT from env; default 3000 for local (Docker sets PORT=80)
const PORT = Number(process.env.PORT || 3000)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

function createGenerator() {
  return new FeedGenerator({
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
    siteUrl: process.env.VITE_SITE_URL || `http://localhost:${PORT}`,
    cacheTtl: Number(process.env.FEEDS_CACHE_TTL_MS || 5 * 60 * 1000),
  })
}

const generator = createGenerator()
let indexHtmlCache = null
let indexHtmlMtime = 0

async function loadIndexHtml() {
  const indexPath = path.join(DIST_DIR, 'index.html')
  const stat = await fsp.stat(indexPath)
  if (!indexHtmlCache || stat.mtimeMs !== indexHtmlMtime) {
    indexHtmlCache = await fsp.readFile(indexPath, 'utf8')
    indexHtmlMtime = stat.mtimeMs
  }
  return indexHtmlCache
}

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0])
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  const full = path.join(root, normalized)
  if (!full.startsWith(root)) return null
  return full
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers)
  res.end(body)
}

function buildRuntimeEnvJson() {
  return `${JSON.stringify(
    {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
      VITE_ENV: process.env.VITE_ENV || 'production',
      VITE_SITE_URL: process.env.VITE_SITE_URL || '',
    },
    null,
    2
  )}\n`
}

async function serveEnv(res) {
  const envFile = path.join(DIST_DIR, 'env')
  try {
    const body = await fsp.readFile(envFile, 'utf8')
    send(res, 200, body, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    })
  } catch (_) {
    send(res, 200, buildRuntimeEnvJson(), {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    })
  }
}

async function serveFeed(req, res, pathname) {
  const baseUrl = normalizeSiteUrl(
    getOriginFromRequest(req, generator.defaultBaseUrl || process.env.VITE_SITE_URL)
  )
  const fullUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  const feedFilters = parseFeedFilters(fullUrl.searchParams)
  const { sitemap, rss, robots } = await generator.generate({ baseUrl, rssFilters: feedFilters })

  if (pathname.startsWith('/sitemap')) {
    send(res, 200, sitemap, {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    })
    return
  }
  if (pathname.startsWith('/rss')) {
    send(res, 200, rss, {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    })
    return
  }
  if (pathname === '/robots.txt') {
    send(res, 200, robots, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    })
  }
}

async function serveStatic(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  const data = await fsp.readFile(filePath)
  const cache =
    ext === '.html'
      ? 'no-cache'
      : filePath.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600'
  send(res, 200, data, {
    'Content-Type': type,
    'Cache-Control': cache,
  })
}

async function serveSpa(req, res, pathname) {
  const baseUrl = normalizeSiteUrl(
    getOriginFromRequest(req, generator.defaultBaseUrl || process.env.VITE_SITE_URL)
  )
  const html = await loadIndexHtml()
  const payload = await resolveSeoPayload(pathname, { generator, baseUrl })
  const injected = injectMeta(html, payload)
  send(res, 200, injected, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Robots-Tag': payload.robots || robotsForPath(pathname),
  })
}

function normalizePathname(urlPath) {
  const pathname = (urlPath || '/').split('?')[0].replace(/\/+/g, '/')
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1) || '/'
  }
  return pathname || '/'
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = normalizePathname(req.url)

    if (pathname === '/env') {
      await serveEnv(res)
      return
    }

    if (pathname === '/healthz') {
      send(res, 200, JSON.stringify({ ok: true }), {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      })
      return
    }

    if (pathname === '/readyz') {
      const hasEnv = !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)
      let supabaseOk = false
      if (hasEnv && generator.supabase) {
        try {
          const { error } = await generator.supabase.from('settings').select('key').limit(1)
          supabaseOk = !error
        } catch (_) {
          supabaseOk = false
        }
      }
      const ready = hasEnv && supabaseOk
      send(res, ready ? 200 : 503, JSON.stringify({ ok: ready, hasEnv, supabaseOk }), {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      })
      return
    }

    if (
      pathname === '/sitemap' ||
      pathname === '/sitemap.xml' ||
      pathname === '/rss' ||
      pathname === '/rss.xml' ||
      pathname === '/robots.txt'
    ) {
      await serveFeed(req, res, pathname)
      return
    }

    // Prefer real static files under dist (assets, favicon, etc.)
    if (pathname !== '/') {
      const filePath = safeJoin(DIST_DIR, pathname)
      if (filePath) {
        try {
          const stat = await fsp.stat(filePath)
          if (stat.isFile()) {
            // Never serve baked build-time feeds; dynamic handlers above cover those names
            const base = path.basename(filePath)
            if (!['sitemap.xml', 'rss.xml', 'robots.txt', 'index.html'].includes(base)) {
              await serveStatic(res, filePath)
              return
            }
          }
        } catch (_) {
          // fall through to SPA
        }
      }
    }

    await serveSpa(req, res, pathname)
  } catch (error) {
    console.error('[server]', error)
    send(res, 500, 'Internal Server Error', { 'Content-Type': 'text/plain; charset=utf-8' })
  }
})

if (!fs.existsSync(DIST_DIR)) {
  console.error(`[server] dist directory not found at ${DIST_DIR}. Run npm run build first.`)
  process.exit(1)
}

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '[server] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set. Feeds and SEO will be empty until env is provided (.env or container environment).'
  )
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Listening on http://localhost:${PORT}`)
  console.log(`[server] Serving ${DIST_DIR}`)
  console.log(`[server] Site URL ${generator.defaultBaseUrl}`)
  console.log(`[server] Supabase ${process.env.VITE_SUPABASE_URL || '(not set)'}`)
})
