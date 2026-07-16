import { createClient } from '@supabase/supabase-js'

export const DEFAULT_SITE_NAME = 'Pluma'
export const DEFAULT_SITE_DESCRIPTION = 'A modern, open-source blogging platform.'
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/archive', priority: 0.8, changefreq: 'weekly' },
]

export function normalizeSiteUrl(url) {
  if (!url) return 'http://localhost:5173'
  return url.replace(/\/$/, '')
}

export function escapeXml(value = '') {
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

export function stripFormatting(value = '') {
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

function collectParam(searchParams, key) {
  if (!searchParams) return []
  if (typeof searchParams.getAll === 'function') {
    return searchParams.getAll(key)
  }
  const raw = searchParams[key]
  if (raw === undefined || raw === null) return []
  return Array.isArray(raw) ? raw : [raw]
}

export function parseFeedFilters(searchParams) {
  if (!searchParams) return {}
  const categories = collectParam(searchParams, 'category').map(normalizeFilterValue).filter(Boolean)
  const authors = collectParam(searchParams, 'author').map(normalizeFilterValue).filter(Boolean)
  const tags = collectParam(searchParams, 'tag').map(normalizeFilterValue).filter(Boolean)
  const localeRaw = collectParam(searchParams, 'locale')[0]
  const locale = localeRaw ? normalizeFilterValue(localeRaw) : ''
  return {
    categories,
    authors,
    tags,
    locale,
  }
}

function applyPostFilters(posts, filters = {}) {
  const hasCategory = filters.categories?.length
  const hasAuthor = filters.authors?.length
  const hasTags = filters.tags?.length
  const hasLocale = !!filters.locale
  if (!hasCategory && !hasAuthor && !hasTags && !hasLocale) return posts
  return posts.filter((post) => {
    if (hasLocale) {
      const postLocale = normalizeFilterValue(post?.locale || 'en')
      if (postLocale !== filters.locale) return false
    }
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
  if (filters.locale) chunks.push(`locale: ${filters.locale}`)
  if (filters.categories?.length) chunks.push(`categories: ${filters.categories.join(', ')}`)
  if (filters.authors?.length) chunks.push(`authors: ${filters.authors.join(', ')}`)
  if (filters.tags?.length) chunks.push(`tags: ${filters.tags.join(', ')}`)
  return chunks.length ? chunks.join(' | ') : ''
}

function buildFeedQuery(filters = {}) {
  const params = new URLSearchParams()
  if (filters.locale) params.set('locale', filters.locale)
  for (const value of filters.categories || []) params.append('category', value)
  for (const value of filters.authors || []) params.append('author', value)
  for (const value of filters.tags || []) params.append('tag', value)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

function resolveFeedBranding(branding, locale) {
  const primary = normalizeFilterValue(branding?.primaryLocale || branding?.locale || 'en')
  const code = normalizeFilterValue(locale || '')
  const primaryName = branding?.siteName || ''
  const primaryDescription = branding?.siteDescription || ''
  if (code && code !== primary) {
    const tr = branding?.metaTranslations?.[code]
    // Untranslated locales inherit primary; translated empties stay empty.
    if (!tr) {
      return {
        siteName: primaryName,
        siteDescription: primaryDescription,
        language: code,
      }
    }
    return {
      siteName: tr.siteName || '',
      siteDescription: tr.siteDescription || '',
      language: code,
    }
  }
  return {
    siteName: primaryName,
    siteDescription: primaryDescription,
    language: code || primary || 'en',
  }
}

export function getOriginFromRequest(req, fallback) {
  try {
    const host = req.headers?.host
    if (!host) return fallback
    const proto = req.headers['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http')
    return `${proto}://${host}`
  } catch (_) {
    return fallback
  }
}

export class FeedGenerator {
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

  async publishDuePosts() {
    if (!this.supabase) return 0
    try {
      const { data, error } = await this.supabase.rpc('publish_due_posts')
      if (error) return 0
      return Number(data) || 0
    } catch (_) {
      return 0
    }
  }

  async fetchRemoteData() {
    if (!this.supabase) {
      return { posts: [], archivedPosts: [], categories: [], branding: null }
    }

    await this.publishDuePosts()

    const postSelect = `
          id,
          title,
          slug,
          locale,
          content,
          tags,
          updated_at,
          created_at,
          cover_image_url,
          status,
          category:categories (
            name,
            slug,
            locale
          ),
          author:profiles (
            username,
            display_name
          )
        `

    const [posts, archived, categories, branding] = await Promise.all([
      this.supabase
        .from('posts')
        .select(postSelect)
        .eq('status', 'published')
        .order('created_at', { ascending: false }),
      this.supabase
        .from('posts')
        .select(postSelect)
        .eq('status', 'archived')
        .order('created_at', { ascending: false }),
      this.supabase
        .from('categories')
        .select('slug, name, updated_at, created_at, locale')
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
    if (archived.error) {
      console.warn('[feeds] Failed to fetch archived posts for SEO', archived.error)
    }
    if (categories.error) {
      console.warn('[feeds] Failed to fetch categories for sitemap', categories.error)
    }
    if (branding.error) {
      console.warn('[feeds] Failed to fetch branding info', branding.error)
    }

    return {
      posts: posts.data ?? [],
      archivedPosts: archived.data ?? [],
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
      this.cache = this.cache || { posts: [], archivedPosts: [], categories: [], branding: null }
    }
    this.cacheTimestamp = Date.now()
    return this.cache
  }

  async generate({ baseUrl, rssFilters, filters } = {}) {
    const effectiveBase = normalizeSiteUrl(baseUrl || this.defaultBaseUrl)
    const data = await this.getData()
    const effectiveFilters = filters || rssFilters || {}
    const sitemap = buildSitemap(effectiveBase, data, effectiveFilters)
    const rss = buildRss(effectiveBase, data, { filters: effectiveFilters })
    const robots = buildRobots(effectiveBase)
    return { sitemap, rss, robots, data, baseUrl: effectiveBase }
  }
}

function buildSitemap(baseUrl, data, filters = {}) {
  const urls = []
  const now = formatIso(Date.now())
  const hasLocale = !!filters.locale
  const posts = hasLocale ? applyPostFilters(data.posts || [], { locale: filters.locale }) : data.posts || []
  const categories = hasLocale
    ? (data.categories || []).filter(
        (category) => normalizeFilterValue(category?.locale || 'en') === filters.locale
      )
    : data.categories || []

  for (const route of STATIC_ROUTES) {
    urls.push({
      loc: `${baseUrl}${route.path}`,
      priority: route.priority.toFixed(1),
      changefreq: route.changefreq,
      lastmod: now,
    })
  }

  for (const category of categories) {
    if (!category?.slug) continue
    urls.push({
      loc: `${baseUrl}/category/${category.slug}`,
      priority: '0.6',
      changefreq: 'weekly',
      lastmod: formatIso(category.updated_at || category.created_at || Date.now()),
    })
  }

  for (const post of posts) {
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
  const filters = options.filters || {}
  const branding = resolveFeedBranding(data.branding, filters.locale)
  const siteName = branding.siteName
  const siteDescription = branding.siteDescription
  const posts = applyPostFilters(data.posts || [], filters).slice(0, 50)
  const filtersLabel = describeFilters(filters)
  const faviconUrl = data.branding?.faviconUrl || data.branding?.lightLogoUrl || data.branding?.darkLogoUrl
  const mediaNamespace = 'http://search.yahoo.com/mrss/'
  const feedDescription = filtersLabel
    ? `${siteDescription} (Filtered by ${filtersLabel})`
    : siteDescription
  const selfHref = `${baseUrl}/rss.xml${buildFeedQuery(filters)}`

  const channel = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="${mediaNamespace}">`,
    '  <channel>',
    `    <title>${escapeXml(siteName)}</title>`,
    `    <link>${escapeXml(baseUrl + '/')}</link>`,
    `    <description>${escapeXml(feedDescription)}</description>`,
    `    <atom:link href="${escapeXml(selfHref)}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${formatRssDate(posts[0]?.updated_at || Date.now())}</lastBuildDate>`,
    `    <language>${escapeXml(branding.language)}</language>`,
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
    'Disallow: /login',
    'Disallow: /signup',
    'Disallow: /install',
    'Disallow: /change-password',
    'Disallow: /reset-password',
    'Disallow: /test',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n')
}
