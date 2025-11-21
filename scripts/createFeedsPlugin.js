import { createClient } from '@supabase/supabase-js'

const DEFAULT_SITE_NAME = 'Pluma'
const DEFAULT_SITE_DESCRIPTION = 'A modern, open-source blogging platform.'
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/archive', priority: 0.8, changefreq: 'weekly' },
  { path: '/login', priority: 0.4, changefreq: 'monthly' },
  { path: '/signup', priority: 0.6, changefreq: 'monthly' },
]

function normalizeSiteUrl(url) {
  if (!url) return 'http://localhost:5173'
  return url.replace(/\/$/, '')
}

function escapeXml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toCData(value = '') {
  const safe = value.replace(/]]>/g, ']]]]><![CDATA[>')
  return `<![CDATA[${safe}]]>`
}

function stripFormatting(value = '') {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_#>\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatIso(date) {
  return new Date(date || Date.now()).toISOString().split('T')[0]
}

function formatRssDate(date) {
  return new Date(date || Date.now()).toUTCString()
}

function detectMimeType(url) {
  if (!url) return null
  const clean = url.split('?')[0]
  const ext = clean.includes('.') ? clean.split('.').pop().toLowerCase() : ''
  const map = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    avif: 'image/avif',
  }
  return map[ext] || null
}

function normalizeFilterValue(value) {
  if (value === undefined || value === null) return ''
  return value.toString().trim().toLowerCase()
}

function parseFeedFilters(searchParams) {
  if (!searchParams) return {}
  const categories = searchParams.getAll('category').map(normalizeFilterValue).filter(Boolean)
  const authors = searchParams.getAll('author').map(normalizeFilterValue).filter(Boolean)
  const tags = searchParams.getAll('tag').map(normalizeFilterValue).filter(Boolean)
  return {
    categories,
    authors,
    tags,
  }
}

function applyPostFilters(posts, filters = {}) {
  const hasCategory = filters.categories?.length
  const hasAuthor = filters.authors?.length
  const hasTags = filters.tags?.length
  if (!hasCategory && !hasAuthor && !hasTags) return posts
  return posts.filter((post) => {
    if (hasCategory) {
      const slug = normalizeFilterValue(post?.category?.slug)
      const name = normalizeFilterValue(post?.category?.name)
      if (!filters.categories.some((value) => value === slug || value === name)) {
        return false
      }
    }
    if (hasAuthor) {
      const username = normalizeFilterValue(post?.author?.username)
      const display = normalizeFilterValue(post?.author?.display_name)
      if (!filters.authors.some((value) => value === username || value === display)) {
        return false
      }
    }
    if (hasTags) {
      const postTags = (post?.tags || []).map(normalizeFilterValue)
      if (!filters.tags.some((value) => postTags.includes(value))) {
        return false
      }
    }
    return true
  })
}

function describeFilters(filters = {}) {
  const chunks = []
  if (filters.categories?.length) chunks.push(`categories: ${filters.categories.join(', ')}`)
  if (filters.authors?.length) chunks.push(`authors: ${filters.authors.join(', ')}`)
  if (filters.tags?.length) chunks.push(`tags: ${filters.tags.join(', ')}`)
  return chunks.length ? chunks.join(' | ') : ''
}

function getOriginFromRequest(req, fallback) {
  try {
    const host = req.headers?.host
    if (!host) return fallback
    const proto = req.headers['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http')
    return `${proto}://${host}`
  } catch (error) {
    return fallback
  }
}

class FeedGenerator {
  constructor(options = {}) {
    this.supabaseUrl = options.supabaseUrl
    this.supabaseAnonKey = options.supabaseAnonKey
    this.defaultBaseUrl = normalizeSiteUrl(options.siteUrl)
    this.supabase = this.supabaseUrl && this.supabaseAnonKey
      ? createClient(this.supabaseUrl, this.supabaseAnonKey)
      : null
    this.cacheTtl = options.cacheTtl ?? 60 * 1000
    this.cache = null
    this.cacheTimestamp = 0
  }

  async fetchRemoteData() {
    if (!this.supabase) {
      return { posts: [], categories: [], branding: null }
    }

    const [posts, categories, branding] = await Promise.all([
      this.supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          content,
          tags,
          updated_at,
          created_at,
          cover_image_url,
          category:categories (
            name,
            slug
          ),
          author:profiles (
            username,
            display_name
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false }),
      this.supabase
        .from('categories')
        .select('slug, updated_at, created_at')
        .order('name', { ascending: true }),
      this.supabase
        .from('settings')
        .select('value')
        .eq('key', 'branding')
        .maybeSingle(),
    ])

    if (posts.error) {
      console.warn('[feeds] Failed to fetch posts for RSS', posts.error)
    }
    if (categories.error) {
      console.warn('[feeds] Failed to fetch categories for sitemap', categories.error)
    }
    if (branding.error) {
      console.warn('[feeds] Failed to fetch branding info', branding.error)
    }

    return {
      posts: posts.data ?? [],
      categories: categories.data ?? [],
      branding: branding.data?.value || null,
    }
  }

  async getData() {
    const now = Date.now()
    if (this.cache && now - this.cacheTimestamp < this.cacheTtl) {
      return this.cache
    }
    try {
      this.cache = await this.fetchRemoteData()
    } catch (error) {
      console.warn('[feeds] Failed to fetch Supabase data, falling back to cached data.', error)
      this.cache = this.cache || { posts: [], categories: [], branding: null }
    }
    this.cacheTimestamp = Date.now()
    return this.cache
  }

  async generate({ baseUrl, rssFilters } = {}) {
    const effectiveBase = normalizeSiteUrl(baseUrl || this.defaultBaseUrl)
    const data = await this.getData()
    const sitemap = buildSitemap(effectiveBase, data)
    const rss = buildRss(effectiveBase, data, { filters: rssFilters })
    const robots = buildRobots(effectiveBase)
    return { sitemap, rss, robots }
  }
}

function buildSitemap(baseUrl, data) {
  const urls = []
  const now = formatIso(Date.now())

  for (const route of STATIC_ROUTES) {
    urls.push({
      loc: `${baseUrl}${route.path}`,
      priority: route.priority.toFixed(1),
      changefreq: route.changefreq,
      lastmod: now,
    })
  }

  for (const category of data.categories || []) {
    if (!category?.slug) continue
    urls.push({
      loc: `${baseUrl}/category/${category.slug}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: formatIso(category.updated_at || category.created_at || Date.now()),
    })
  }

  for (const post of data.posts || []) {
    if (!post?.slug) continue
    urls.push({
      loc: `${baseUrl}/posts/${post.slug}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: formatIso(post.updated_at || post.created_at || Date.now()),
    })
  }

  const xml = [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`]
  for (const entry of urls) {
    xml.push('  <url>')
    xml.push(`    <loc>${escapeXml(entry.loc)}</loc>`)
    xml.push(`    <lastmod>${entry.lastmod}</lastmod>`)
    xml.push(`    <changefreq>${entry.changefreq}</changefreq>`)
    xml.push(`    <priority>${entry.priority}</priority>`)
    xml.push('  </url>')
  }
  xml.push('</urlset>')
  return xml.join('\n')
}

function buildRss(baseUrl, data, options = {}) {
  const siteName = data.branding?.siteName || DEFAULT_SITE_NAME
  const siteDescription = data.branding?.siteDescription || DEFAULT_SITE_DESCRIPTION
  const filters = options.filters || {}
  const posts = applyPostFilters(data.posts || [], filters).slice(0, 50)
  const filtersLabel = describeFilters(filters)
  const faviconUrl = data.branding?.faviconUrl || data.branding?.lightLogoUrl || data.branding?.darkLogoUrl
  const mediaNamespace = 'http://search.yahoo.com/mrss/'
  const feedDescription = filtersLabel
    ? `${siteDescription} (Filtered by ${filtersLabel})`
    : siteDescription

  const channel = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="${mediaNamespace}">`,
    '  <channel>',
    `    <title>${escapeXml(siteName)}</title>`,
    `    <link>${escapeXml(baseUrl + '/')}</link>`,
    `    <description>${escapeXml(feedDescription)}</description>`,
    `    <atom:link href="${escapeXml(baseUrl + '/rss.xml')}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${formatRssDate(posts[0]?.updated_at || Date.now())}</lastBuildDate>`,
    `    <language>en</language>`,
  ]

  if (faviconUrl) {
    channel.push('    <image>')
    channel.push(`      <url>${escapeXml(faviconUrl)}</url>`)
    channel.push(`      <title>${escapeXml(siteName)}</title>`)
    channel.push(`      <link>${escapeXml(baseUrl + '/')}</link>`)
    channel.push('    </image>')
  }

  if (filtersLabel) {
    channel.push(`    <category>${escapeXml(filtersLabel)}</category>`)
  }

  for (const post of posts) {
    const postUrl = `${baseUrl}/posts/${post.slug}`
    const excerptSource = post.excerpt || post.content || ''
    const excerpt = stripFormatting(excerptSource).slice(0, 280)
  const thumbnailUrl = post.cover_image_url
  const thumbnailType = detectMimeType(thumbnailUrl)
    channel.push('    <item>')
    channel.push(`      <title>${toCData(post.title || 'Untitled')}</title>`)
    channel.push(`      <link>${escapeXml(postUrl)}</link>`)
    channel.push(`      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>`)
    channel.push(`      <pubDate>${formatRssDate(post.created_at)}</pubDate>`)
    channel.push(`      <description>${toCData(excerpt)}</description>`)
    if (post.category?.name) {
      channel.push(`      <category domain="category">${escapeXml(post.category.name)}</category>`)
    }
    if (post.tags && Array.isArray(post.tags)) {
      for (const tag of post.tags) {
        if (!tag) continue
        channel.push(`      <category domain="tag">${escapeXml(tag)}</category>`)
      }
    }
    if (post.author?.display_name || post.author?.username) {
      channel.push(`      <author>${escapeXml(post.author.display_name || post.author.username)}</author>`)
    }
    if (thumbnailUrl) {
      const typeAttr = thumbnailType ? ` type="${thumbnailType}"` : ''
      channel.push(`      <enclosure url="${escapeXml(thumbnailUrl)}"${typeAttr} />`)
      channel.push(`      <media:content url="${escapeXml(thumbnailUrl)}" medium="image"${typeAttr} />`)
      channel.push(`      <media:thumbnail url="${escapeXml(thumbnailUrl)}" />`)
    }
    channel.push('    </item>')
  }

  channel.push('  </channel>')
  channel.push('</rss>')
  return channel.join('\n')
}

function buildRobots(baseUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dashboard',
    'Disallow: /profile',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n')
}

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
        const isFeedPath = ['/sitemap', '/sitemap.xml', '/rss', '/rss.xml', '/robots.txt'].includes(normalizedPath)
        if (!isFeedPath) {
          return next()
        }
        try {
          const baseUrl = getOriginFromRequest(req, generator.defaultBaseUrl)
          const fullUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
          const rssFilters = normalizedPath.startsWith('/rss') ? parseFeedFilters(fullUrl.searchParams) : undefined
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
