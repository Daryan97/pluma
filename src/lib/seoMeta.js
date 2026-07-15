/**
 * Client-side DOM SEO helpers — keep in sync with scripts/feeds/seo.js injectMeta.
 */
import { stripLocalePrefix } from '@/lib/seoPaths'

function ensureMeta(name, attr = 'property') {
  const selector = attr === 'name' ? `meta[name="${name}"]` : `meta[property="${name}"]`
  let el = document.head?.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head?.appendChild(el)
  }
  return el
}

function removeMeta(name, attr = 'property') {
  const selector = attr === 'name' ? `meta[name="${name}"]` : `meta[property="${name}"]`
  document.head?.querySelectorAll(selector).forEach((el) => el.remove())
}

function setCanonical(href) {
  if (!href) return
  let canonical = document.head?.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head?.appendChild(canonical)
  }
  canonical.setAttribute('href', href)
}

function setHreflangs(hreflangs = []) {
  document.head
    ?.querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((el) => el.remove())
  for (const h of hreflangs) {
    if (!h?.lang || !h?.href) continue
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = h.lang
    link.href = h.href
    document.head?.appendChild(link)
  }
}

function setJsonLd(structuredData) {
  let script = document.getElementById('ld-primary')
  if (!structuredData) {
    script?.remove()
    return
  }
  if (!script) {
    script = document.createElement('script')
    script.id = 'ld-primary'
    script.type = 'application/ld+json'
    document.head?.appendChild(script)
  }
  script.textContent = JSON.stringify(structuredData)
}

export function robotsForClientPath(path = '/') {
  const raw = path.replace(/\/+$/, '') || '/'
  const p = stripLocalePrefix(raw)
  const noindex = [
    '/dashboard',
    '/profile',
    '/login',
    '/signup',
    '/install',
    '/change-password',
    '/test',
  ]
  if (noindex.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))) {
    return 'noindex, nofollow'
  }
  return 'index, follow'
}

export function twitterHandleFromSocialLinks(socialLinks = []) {
  if (!Array.isArray(socialLinks)) return null
  for (const link of socialLinks) {
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

/** Normalize @handle from branding field, social links, or env. */
export function resolveTwitterSite({
  twitterHandle = null,
  socialLinks = [],
  envHandle = null,
} = {}) {
  const candidates = [
    twitterHandle,
    twitterHandleFromSocialLinks(socialLinks),
    envHandle,
  ]
  for (const raw of candidates) {
    if (!raw) continue
    const cleaned = String(raw).trim()
    if (!cleaned) continue
    // Accept bare handle, @handle, or a profile URL
    if (/^https?:\/\//i.test(cleaned) || /(?:twitter\.com|x\.com)/i.test(cleaned)) {
      const fromUrl = extractTwitterHandleFromUrl(cleaned)
      if (fromUrl) return fromUrl
      continue
    }
    const handle = cleaned.replace(/^@/, '').replace(/\s+/g, '')
    if (/^[\w]{1,15}$/.test(handle)) return `@${handle}`
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
    const m = url.match(/(?:twitter\.com|x\.com)\/(@?[\w]+)/i)
    if (m?.[1] && !/^(intent|share|i|home)$/i.test(m[1])) {
      return `@${m[1].replace(/^@/, '')}`
    }
  }
  return null
}

export function absoluteAssetUrl(url, origin = typeof window !== 'undefined' ? window.location.origin : '') {
  if (!url) return null
  const value = String(url).trim()
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  if (value.startsWith('//')) return `https:${value}`
  if (!origin) return value
  return value.startsWith('/') ? `${origin.replace(/\/$/, '')}${value}` : `${origin.replace(/\/$/, '')}/${value}`
}

/** Prefer absolute image URL for OG/Twitter (shared with server seo.js). */
export function resolveSeoImage(preferred, branding, baseUrl) {
  const base = baseUrl ? String(baseUrl).replace(/\/$/, '') : ''
  const candidates = [
    preferred,
    branding?.ogImageUrl,
    branding?.lightLogoUrl,
    branding?.darkLogoUrl,
    branding?.faviconUrl,
    base ? `${base}/og-default.png` : '/og-default.png',
  ].filter(Boolean)

  for (const raw of candidates) {
    const value = String(raw).trim()
    if (!value) continue
    if (/^https?:\/\//i.test(value)) return value
    if (value.startsWith('//')) return `https:${value}`
    if (base) {
      return value.startsWith('/') ? `${base}${value}` : `${base}/${value}`
    }
    return value
  }
  return null
}

export function applySeoToDocument(payload = {}) {
  if (typeof document === 'undefined') return

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const title = payload.title?.trim()
  const description = payload.description?.trim()
  const type = payload.type || 'website'
  const siteName = payload.siteName
  const canonical = payload.canonical
  const robots = payload.robots || robotsForClientPath(payload.path || '/')
  const locale = (payload.locale || 'en').replace('-', '_')
  const image =
    absoluteAssetUrl(payload.image, origin) ||
    absoluteAssetUrl(payload.fallbackImage, origin) ||
    absoluteAssetUrl('/og-default.png', origin)
  const publishedTime = payload.publishedTime || null
  const modifiedTime = payload.modifiedTime || null
  const twitterSite = payload.twitterSite || null
  const twitterCreator = payload.twitterCreator || null

  if (title) document.title = title

  const metaDesc = document.head?.querySelector('meta[name="description"]')
  if (metaDesc && description) metaDesc.setAttribute('content', description)

  ensureMeta('robots', 'name').setAttribute('content', robots)
  ensureMeta('googlebot', 'name').setAttribute('content', robots)

  if (title) ensureMeta('og:title').setAttribute('content', title)
  if (description) ensureMeta('og:description').setAttribute('content', description)
  ensureMeta('og:type').setAttribute('content', type)
  if (siteName) ensureMeta('og:site_name').setAttribute('content', siteName)
  ensureMeta('og:locale').setAttribute('content', locale)
  if (canonical) {
    ensureMeta('og:url').setAttribute('content', canonical)
    setCanonical(canonical)
  }
  if (image) {
    ensureMeta('og:image').setAttribute('content', image)
    ensureMeta('twitter:image', 'name').setAttribute('content', image)
  }

  if (type === 'article') {
    if (publishedTime) {
      ensureMeta('article:published_time').setAttribute('content', publishedTime)
    }
    if (modifiedTime) {
      ensureMeta('article:modified_time').setAttribute('content', modifiedTime)
      ensureMeta('og:updated_time').setAttribute('content', modifiedTime)
    }
  } else {
    removeMeta('article:published_time')
    removeMeta('article:modified_time')
    removeMeta('og:updated_time')
  }

  ensureMeta('twitter:card', 'name').setAttribute('content', payload.cardType || 'summary_large_image')
  if (title) ensureMeta('twitter:title', 'name').setAttribute('content', title)
  if (description) ensureMeta('twitter:description', 'name').setAttribute('content', description)
  if (canonical) ensureMeta('twitter:url', 'name').setAttribute('content', canonical)
  if (twitterSite) ensureMeta('twitter:site', 'name').setAttribute('content', twitterSite)
  else removeMeta('twitter:site', 'name')
  if (twitterCreator) ensureMeta('twitter:creator', 'name').setAttribute('content', twitterCreator)
  else removeMeta('twitter:creator', 'name')

  const hreflangs =
    payload.hreflangs ||
    (canonical
      ? [
          { lang: payload.locale || 'en', href: canonical },
          { lang: 'x-default', href: canonical },
        ]
      : [])
  setHreflangs(hreflangs)
  setJsonLd(payload.structuredData || null)
}
