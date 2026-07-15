import {
  FeedGenerator,
  getOriginFromRequest,
  normalizeSiteUrl,
  parseFeedFilters,
} from '../scripts/feeds/generator.js'
import { injectMeta, resolveSeoPayload, robotsForPath } from '../scripts/feeds/seo.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const libDir = path.dirname(fileURLToPath(import.meta.url))

let generator
export function getGenerator() {
  if (!generator) {
    generator = new FeedGenerator({
      supabaseUrl: process.env.VITE_SUPABASE_URL,
      supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
      siteUrl: process.env.VITE_SITE_URL,
      cacheTtl: Number(process.env.VITE_FEEDS_CACHE_TTL_MS || 5 * 60 * 1000),
    })
  }
  return generator
}

export function runtimeEnvJson() {
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

export function baseUrlFromReq(req) {
  const gen = getGenerator()
  return normalizeSiteUrl(
    getOriginFromRequest(req, gen.defaultBaseUrl || process.env.VITE_SITE_URL)
  )
}

export async function buildFeedResponse(req, type) {
  const gen = getGenerator()
  const baseUrl = baseUrlFromReq(req)
  const host = req.headers?.host || 'localhost'
  const url = new URL(req.url || '/', `https://${host}`)
  const feedFilters = parseFeedFilters(url.searchParams)
  const { sitemap, rss, robots } = await gen.generate({ baseUrl, rssFilters: feedFilters })
  if (type === 'sitemap') {
    return { body: sitemap, contentType: 'application/xml; charset=utf-8' }
  }
  if (type === 'rss') {
    return { body: rss, contentType: 'application/rss+xml; charset=utf-8' }
  }
  return { body: robots, contentType: 'text/plain; charset=utf-8' }
}

function findIndexHtml() {
  const candidates = [
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'index.html'),
    path.join(libDir, '..', 'dist', 'index.html'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8')
  }
  return null
}

export async function buildDocumentResponse(req, pathname) {
  const gen = getGenerator()
  const baseUrl = baseUrlFromReq(req)
  const html = findIndexHtml()
  if (!html) {
    return { status: 500, body: 'index.html not found', contentType: 'text/plain; charset=utf-8' }
  }
  const payload = await resolveSeoPayload(pathname || '/', { generator: gen, baseUrl })
  return {
    status: 200,
    body: injectMeta(html, payload),
    contentType: 'text/html; charset=utf-8',
    robots: payload.robots || robotsForPath(pathname || '/'),
  }
}

export function vercelHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.error('[api]', error)
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end('Internal Server Error')
    }
  }
}
