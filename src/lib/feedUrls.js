/**
 * Build RSS / sitemap URLs with optional locale and content filters.
 * Omits locale when it matches the branding primary locale (cleaner default URLs).
 */
export function buildFeedSearchParams({
  locale,
  primaryLocale = 'en',
  category,
  author,
  tag,
  alwaysIncludeLocale = false,
} = {}) {
  const params = new URLSearchParams()
  const code = typeof locale === 'string' ? locale.trim().toLowerCase() : ''
  const primary = typeof primaryLocale === 'string' ? primaryLocale.trim().toLowerCase() : 'en'
  if (code && (alwaysIncludeLocale || code !== primary)) {
    params.set('locale', code)
  }
  if (category) params.set('category', category)
  if (author) params.set('author', author)
  if (tag) params.set('tag', tag)
  return params
}

export function feedHref(path, options = {}) {
  const params = buildFeedSearchParams(options)
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export function rssHref(options = {}) {
  return feedHref('/rss.xml', options)
}

export function sitemapHref(options = {}) {
  return feedHref('/sitemap.xml', options)
}
