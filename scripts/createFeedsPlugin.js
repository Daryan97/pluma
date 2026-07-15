import {
  FeedGenerator,
  getOriginFromRequest,
  parseFeedFilters,
} from './feeds/generator.js'

export function createFeedsPlugin(options = {}) {
  const generator = new FeedGenerator({
    supabaseUrl: options.supabaseUrl,
    supabaseAnonKey: options.supabaseAnonKey,
    siteUrl: options.siteUrl,
    cacheTtl: options.cacheTtl,
  })

  return {
    name: 'pluma-feeds',
    async generateBundle() {
      const { sitemap, rss, robots } = await generator.generate()
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({ type: 'asset', fileName: 'rss.xml', source: rss })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next()
        const [rawPath] = req.url.split('?')
        const pathname = rawPath?.replace(/\/+/g, '/') || '/'
        const normalizedPath = pathname.replace(/\/+$/, '') || '/'
        const isFeedPath = [
          '/sitemap',
          '/sitemap.xml',
          '/rss',
          '/rss.xml',
          '/robots.txt',
        ].includes(normalizedPath)
        if (!isFeedPath) {
          return next()
        }
        try {
          const baseUrl = getOriginFromRequest(req, generator.defaultBaseUrl)
          const fullUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
          const rssFilters = normalizedPath.startsWith('/rss')
            ? parseFeedFilters(fullUrl.searchParams)
            : undefined
          const { sitemap, rss, robots } = await generator.generate({ baseUrl, rssFilters })
          if (normalizedPath.startsWith('/sitemap')) {
            res.setHeader('Content-Type', 'application/xml; charset=utf-8')
            res.end(sitemap)
            return
          }
          if (normalizedPath.startsWith('/rss')) {
            res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
            res.end(rss)
            return
          }
          if (normalizedPath === '/robots.txt') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.end(robots)
            return
          }
        } catch (error) {
          console.error('[feeds] Failed to serve dynamic feed', error)
          res.statusCode = 500
          res.end('Feed unavailable')
        }
      })
    },
  }
}
