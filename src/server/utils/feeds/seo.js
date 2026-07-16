import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_NAME,
  normalizeSiteUrl,
  stripFormatting,
} from './generator.js'
import {
  buildHreflangs,
  localizePath,
  stripLocalePrefix,
} from '../../../lib/seoPaths.js'

export { buildHreflangs, localizePath, stripLocalePrefix }

const DEFAULT_LOCALE = 'en'
const NOINDEX_PREFIXES = [
  '/dashboard',
  '/profile',
  '/login',
  '/signup',
  '/install',
  '/change-password',
  '/reset-password',
  '/test',
]

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function upsertMetaByAttr(html, attr, name, content) {
  if (content === undefined || content === null || content === '') return html
  const safeContent = escapeHtml(content)
  const re = new RegExp(`<meta[^>]*${attr}=["']${name}["'][^>]*>`, 'i')
  const tag = `<meta ${attr}="${name}" content="${safeContent}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function removeMetaByAttr(html, attr, name) {
  const re = new RegExp(`\\s*<meta[^>]*${attr}=["']${name}["'][^>]*>`, 'gi')
  return html.replace(re, '')
}

function upsertLinkCanonical(html, href) {
  if (!href) return html
  const safeHref = escapeHtml(href)
  const re = /<link[^>]*rel=["']canonical["'][^>]*>/i
  const tag = `<link rel="canonical" href="${safeHref}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function upsertHreflangs(html, hreflangs = []) {
  let out = html.replace(/\s*<link[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/gi, '')
  if (!hreflangs.length) return out
  const tags = hreflangs
    .map(
      (h) =>
        `<link rel="alternate" hreflang="${escapeHtml(h.lang)}" href="${escapeHtml(h.href)}" />`
    )
    .join('\n    ')
  return out.replace(/<\/head>/i, `    ${tags}\n  </head>`)
}

function upsertTitle(html, title) {
  const safeTitle = escapeHtml(title || DEFAULT_SITE_NAME)
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
  }
  return html.replace(/<\/head>/i, `    <title>${safeTitle}</title>\n  </head>`)
}

function upsertJsonLd(html, structuredData) {
  const re = /<script[^>]*id=["']ld-primary["'][^>]*>[\s\S]*?<\/script>/i
  if (!structuredData) return html.replace(re, '')
  const json = JSON.stringify(structuredData).replace(/</g, '\\u003c')
  const tag = `<script id="ld-primary" type="application/ld+json">${json}</script>`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function toIso(date) {
  if (!date) return null
  try {
    return new Date(date).toISOString()
  } catch (_) {
    return null
  }
}

/** Extract @handle from branding social links / twitterHandle field. */
export function twitterSiteFromBranding(branding) {
  if (!branding) return null

  if (branding.twitterHandle) {
    const cleaned = String(branding.twitterHandle).trim()
    if (cleaned) {
      if (/^https?:\/\//i.test(cleaned) || /(?:twitter\.com|x\.com)/i.test(cleaned)) {
        const fromUrl = extractTwitterHandleFromUrl(cleaned)
        if (fromUrl) return fromUrl
      } else {
        const handle = cleaned.replace(/^@/, '').replace(/\s+/g, '')
        if (/^[\w]{1,15}$/.test(handle)) return `@${handle}`
      }
    }
  }

  const links = branding.socialLinks
  if (!Array.isArray(links)) return null
  for (const link of links) {
    const label = String(link?.label || '').toLowerCase()
    const icon = String(link?.icon || '').toLowerCase()
    const url = String(link?.url || '')
    const isTwitter =
      /twitter|\bx\b/.test(label) ||
      /twitter|(^|:)x($|:)/.test(icon) ||
      /(?:twitter\.com|x\.com)/i.test(url)
    if (!isTwitter || !url) continue
    const handle = extractTwitterHandleFromUrl(url)
    if (handle) return handle
  }
  return null
}

function extractTwitterHandleFromUrl(url) {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    if (!/(^|\.)(twitter\.com|x\.com)$/i.test(u.hostname)) return null
    const screenName = u.searchParams.get('screen_name')
    if (screenName) return `@${screenName.replace(/^@/, '')}`
    const parts = u.pathname.split('/').filter(Boolean)
    if (!parts.length) return null
    const skip = new Set([
      'intent',
      'share',
      'i',
      'home',
      'explore',
      'search',
      'hashtag',
      'settings',
      'compose',
      'messages',
      'notifications',
    ])
    const first = parts[0]
    if (skip.has(first.toLowerCase())) return null
    return `@${first.replace(/^@/, '')}`
  } catch (_) {
    const m = String(url).match(/(?:twitter\.com|x\.com)\/(@?[\w]+)/i)
    if (m?.[1] && !/^(intent|share|i|home)$/i.test(m[1])) {
      return `@${m[1].replace(/^@/, '')}`
    }
  }
  return null
}

/** Prefer absolute image URL for OG/Twitter. */
export function resolveSeoImage(preferred, branding, baseUrl) {
  const candidates = [
    preferred,
    branding?.ogImageUrl,
    branding?.lightLogoUrl,
    branding?.darkLogoUrl,
    branding?.faviconUrl,
    baseUrl ? `${normalizeSiteUrl(baseUrl)}/og-default.png` : null,
  ].filter(Boolean)

  for (const raw of candidates) {
    const value = String(raw).trim()
    if (!value) continue
    if (/^https?:\/\//i.test(value)) return value
    if (value.startsWith('//')) return `https:${value}`
    if (baseUrl) {
      const base = normalizeSiteUrl(baseUrl)
      return value.startsWith('/') ? `${base}${value}` : `${base}/${value}`
    }
  }
  return null
}

export function robotsForPath(pathname = '/') {
  const raw = pathname.replace(/\/+$/, '') || '/'
  const path = stripLocalePrefix(raw)
  if (NOINDEX_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
    return 'noindex, nofollow'
  }
  return 'index, follow'
}

/**
 * Inject SEO meta tags into the SPA index.html shell.
 */
export function injectMeta(html, payload = {}) {
  const title = payload.title?.trim() || DEFAULT_SITE_NAME
  const description = payload.description?.trim() || DEFAULT_SITE_DESCRIPTION
  const type = payload.type || 'website'
  const siteName = payload.siteName || DEFAULT_SITE_NAME
  const canonical = payload.canonical || ''
  const robots = payload.robots || 'index, follow'
  const locale = payload.locale || DEFAULT_LOCALE
  const image = payload.image || null
  const publishedTime = payload.publishedTime || null
  const modifiedTime = payload.modifiedTime || null

  let out = html
  out = upsertTitle(out, title)
  out = upsertMetaByAttr(out, 'name', 'description', description)
  out = upsertMetaByAttr(out, 'name', 'robots', robots)
  out = upsertMetaByAttr(out, 'name', 'googlebot', robots)

  out = upsertMetaByAttr(out, 'property', 'og:title', title)
  out = upsertMetaByAttr(out, 'property', 'og:description', description)
  out = upsertMetaByAttr(out, 'property', 'og:type', type)
  out = upsertMetaByAttr(out, 'property', 'og:site_name', siteName)
  out = upsertMetaByAttr(out, 'property', 'og:locale', locale.replace('-', '_'))
  if (canonical) {
    out = upsertMetaByAttr(out, 'property', 'og:url', canonical)
    out = upsertLinkCanonical(out, canonical)
  }
  // og:image set below together with twitter:image

  if (type === 'article') {
    if (publishedTime) {
      out = upsertMetaByAttr(out, 'property', 'article:published_time', publishedTime)
    }
    if (modifiedTime) {
      out = upsertMetaByAttr(out, 'property', 'article:modified_time', modifiedTime)
      out = upsertMetaByAttr(out, 'property', 'og:updated_time', modifiedTime)
    }
  } else {
    out = removeMetaByAttr(out, 'property', 'article:published_time')
    out = removeMetaByAttr(out, 'property', 'article:modified_time')
    out = removeMetaByAttr(out, 'property', 'og:updated_time')
  }

  out = upsertMetaByAttr(out, 'name', 'twitter:card', payload.cardType || 'summary_large_image')
  out = upsertMetaByAttr(out, 'name', 'twitter:title', title)
  out = upsertMetaByAttr(out, 'name', 'twitter:description', description)
  if (canonical) out = upsertMetaByAttr(out, 'name', 'twitter:url', canonical)
  // Always emit twitter:image when we have any candidate (required for complete cards)
  const twitterImage = image || payload.fallbackImage || null
  if (twitterImage) {
    out = upsertMetaByAttr(out, 'property', 'og:image', twitterImage)
    out = upsertMetaByAttr(out, 'name', 'twitter:image', twitterImage)
  }
  if (payload.twitterSite) {
    out = upsertMetaByAttr(out, 'name', 'twitter:site', payload.twitterSite)
  }
  if (payload.twitterCreator) {
    out = upsertMetaByAttr(out, 'name', 'twitter:creator', payload.twitterCreator)
  }

  out = upsertHreflangs(out, payload.hreflangs || buildHreflangs(canonical, locale))
  out = upsertJsonLd(out, payload.structuredData)
  return out
}

function siteDefaults(data, baseUrl) {
  const siteName = data.branding?.siteName || DEFAULT_SITE_NAME
  const siteDescription = data.branding?.siteDescription || DEFAULT_SITE_DESCRIPTION
  const base = normalizeSiteUrl(baseUrl)
  const image = resolveSeoImage(null, data.branding, base)
  const locale = data.branding?.locale || process.env.VITE_SITE_LOCALE || DEFAULT_LOCALE
  const twitterSite =
    twitterSiteFromBranding(data.branding) ||
    (process.env.VITE_TWITTER_SITE
      ? `@${String(process.env.VITE_TWITTER_SITE).replace(/^@/, '')}`
      : null)
  return {
    siteName,
    siteDescription,
    image,
    locale,
    twitterSite,
    baseUrl: base,
  }
}

function withCommon(base, overrides) {
  const canonical = overrides.canonical || base.canonical
  const locale = overrides.locale || base.locale
  const robots = overrides.robots || robotsForPath(base.path)
  const image = resolveSeoImage(overrides.image, { lightLogoUrl: base.image }, base.baseUrl) || base.image
  const barePath = stripLocalePrefix(base.path || '/', undefined)
  return {
    siteName: base.siteName,
    locale,
    robots,
    image,
    twitterSite: overrides.twitterSite || base.twitterSite || null,
    hreflangs: buildHreflangs(canonical, locale, {
      baseUrl: base.baseUrl,
      path: barePath,
      defaultLocale: DEFAULT_LOCALE,
    }),
    cardType: 'summary_large_image',
    ...overrides,
    image,
    canonical,
  }
}

function articleJsonLd({ title, description, canonical, publishedTime, modifiedTime, author, image, keywords, siteName, baseUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author || 'Unknown',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
    },
    image: image || undefined,
    keywords: keywords || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  }
}

function collectionJsonLd({ name, description, canonical }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: canonical,
  }
}

function websiteJsonLd({ siteName, siteDescription, baseUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    description: siteDescription,
    url: `${baseUrl}/`,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
    },
  }
}

/**
 * Build SEO payload for a request pathname using feed cache data.
 */
export async function resolveSeoPayload(pathname, { generator, baseUrl } = {}) {
  const rawPath = (pathname || '/').replace(/\/+/g, '/').replace(/\/+$/, '') || '/'
  const path = stripLocalePrefix(rawPath) || '/'
  const data = await generator.getData()
  const { siteName, siteDescription, image, locale, twitterSite, baseUrl: base } = siteDefaults(
    data,
    baseUrl || generator.defaultBaseUrl
  )
  // Canonical should preserve the request locale prefix when present
  const requestLocale =
    rawPath !== path
      ? rawPath.split('/').filter(Boolean)[0]
      : locale || DEFAULT_LOCALE
  const localizedPath = localizePath(path, requestLocale, DEFAULT_LOCALE)
  const canonical = `${base}${localizedPath === '/' ? '/' : localizedPath}`
  const common = {
    siteName,
    siteDescription,
    image,
    locale: requestLocale || locale,
    twitterSite,
    path,
    canonical,
    baseUrl: base,
  }

  const findPost = (slug, includeArchived = false) => {
    const published = (data.posts || []).find((p) => p.slug === slug)
    if (published) return published
    if (includeArchived) {
      return (data.archivedPosts || []).find((p) => p.slug === slug)
    }
    return null
  }

  const postMatch = path.match(/^\/posts\/([^/]+)$/)
  if (postMatch) {
    const post = findPost(decodeURIComponent(postMatch[1]))
    if (post) {
      const excerpt = stripFormatting(post.content || '').slice(0, 160)
      const publishedTime = toIso(post.created_at)
      const modifiedTime = toIso(post.updated_at || post.created_at)
      const cover = post.cover_image_url || image
      const author = post.author?.display_name || post.author?.username || 'Unknown'
      const title = `${post.title || 'Untitled'} | ${siteName}`
      const description = excerpt || siteDescription
      return withCommon(common, {
        title,
        description,
        type: 'article',
        image: cover,
        publishedTime,
        modifiedTime,
        structuredData: articleJsonLd({
          title: post.title,
          description,
          canonical,
          publishedTime,
          modifiedTime,
          author,
          image: cover,
          keywords: (post.tags || []).join(', '),
          siteName,
          baseUrl: base,
        }),
      })
    }
  }

  const archivePostMatch = path.match(/^\/archive\/post\/([^/]+)$/)
  if (archivePostMatch) {
    const post = findPost(decodeURIComponent(archivePostMatch[1]), true)
    if (post) {
      const excerpt = stripFormatting(post.content || '').slice(0, 160)
      const publishedTime = toIso(post.created_at)
      const modifiedTime = toIso(post.updated_at || post.created_at)
      const cover = post.cover_image_url || image
      const author = post.author?.display_name || post.author?.username || 'Unknown'
      const title = `${post.title || 'Untitled'} | ${siteName}`
      const description = excerpt || siteDescription
      return withCommon(common, {
        title,
        description,
        type: 'article',
        image: cover,
        publishedTime,
        modifiedTime,
        structuredData: articleJsonLd({
          title: post.title,
          description,
          canonical,
          publishedTime,
          modifiedTime,
          author,
          image: cover,
          keywords: (post.tags || []).join(', '),
          siteName,
          baseUrl: base,
        }),
      })
    }
  }

  const categoryMatch = path.match(/^\/category\/([^/]+)$/) || path.match(/^\/archive\/category\/([^/]+)$/)
  if (categoryMatch) {
    const slug = decodeURIComponent(categoryMatch[1])
    const category = (data.categories || []).find((c) => c.slug === slug)
    const label = category?.name || slug
    const title = `${label} | ${siteName}`
    const description = `Explore posts in ${label}.`
    return withCommon(common, {
      title,
      description,
      type: 'website',
      structuredData: collectionJsonLd({ name: title, description, canonical }),
    })
  }

  const authorMatch = path.match(/^\/author\/([^/]+)$/)
  if (authorMatch) {
    const username = decodeURIComponent(authorMatch[1])
    const post = (data.posts || []).find(
      (p) => (p.author?.username || '').toLowerCase() === username.toLowerCase()
    )
    const display = post?.author?.display_name || username
    const title = `${display} | ${siteName}`
    const description = `View posts by ${display}.`
    return withCommon(common, {
      title,
      description,
      type: 'website',
      structuredData: collectionJsonLd({ name: title, description, canonical }),
    })
  }

  if (path === '/archive') {
    const title = `Archive | ${siteName}`
    const description = 'Browse archived posts.'
    return withCommon(common, {
      title,
      description,
      type: 'website',
      structuredData: collectionJsonLd({ name: title, description, canonical }),
    })
  }

  if (path === '/login' || path === '/signup' || path === '/install') {
    const titles = {
      '/login': 'Login',
      '/signup': 'Sign Up',
      '/install': 'Install',
    }
    const descriptions = {
      '/login': 'Login to your account to access more features.',
      '/signup': 'Create a new account to join our community.',
      '/install': 'Initial setup wizard.',
    }
    return withCommon(common, {
      title: `${titles[path]} | ${siteName}`,
      description: descriptions[path],
      type: 'website',
      structuredData: null,
    })
  }

  if (path === '/') {
    return withCommon(common, {
      title: siteName,
      description: siteDescription,
      canonical: `${base}/`,
      type: 'website',
      structuredData: websiteJsonLd({ siteName, siteDescription, baseUrl: base }),
    })
  }

  return withCommon(common, {
    title: siteName,
    description: siteDescription,
    type: 'website',
    structuredData: null,
  })
}
