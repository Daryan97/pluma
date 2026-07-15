/**
 * Locale-aware path helpers for canonical / hreflang URLs.
 * Safe for both client and Nitro (no Nuxt auto-imports).
 */

const DEFAULT_LOCALE = 'en'
const KNOWN_LOCALES = ['en', 'ku', 'ar', 'es', 'fr', 'de']

export function normalizeSiteOrigin(url = '') {
  return String(url || '').replace(/\/$/, '')
}

/**
 * Strip a leading locale prefix (`/ku`, `/ar`, …). Default locale has no prefix.
 */
export function stripLocalePrefix(pathname = '/', locales = KNOWN_LOCALES) {
  const path = String(pathname || '/').replace(/\/+/g, '/') || '/'
  const codes = (locales || KNOWN_LOCALES).filter((c) => c && c !== DEFAULT_LOCALE)
  for (const code of codes) {
    if (path === `/${code}`) return '/'
    if (path.startsWith(`/${code}/`)) {
      const rest = path.slice(code.length + 1)
      return rest.startsWith('/') ? rest : `/${rest}`
    }
  }
  return path === '' ? '/' : path
}

/**
 * Build a locale-prefixed path (`prefix_except_default` strategy).
 */
export function localizePath(pathname = '/', locale = DEFAULT_LOCALE, defaultLocale = DEFAULT_LOCALE) {
  const bare = pathname.startsWith('/') ? pathname : `/${pathname}`
  const normalized = bare.replace(/\/+/g, '/') || '/'
  if (!locale || locale === defaultLocale) {
    return normalized === '/' ? '/' : normalized.replace(/\/$/, '') || '/'
  }
  if (normalized === '/') return `/${locale}`
  return `/${locale}${normalized}`.replace(/\/$/, '')
}

/**
 * Build hreflang alternate links for all enabled locales + x-default.
 *
 * @param {string|null} canonical unused when options.path + options.baseUrl provided
 * @param {string} locale current locale (kept for API compat)
 * @param {object} options
 * @param {string} options.baseUrl site origin without trailing slash
 * @param {string} options.path locale-stripped pathname
 * @param {string[]} options.locales enabled locale codes
 * @param {string} [options.defaultLocale]
 */
export function buildHreflangs(canonical, locale = DEFAULT_LOCALE, options = {}) {
  const baseUrl = normalizeSiteOrigin(options.baseUrl || '')
  const locales = Array.isArray(options.locales) && options.locales.length
    ? options.locales
    : KNOWN_LOCALES
  const defaultLocale = options.defaultLocale || DEFAULT_LOCALE

  let path = options.path
  if (!path && canonical && baseUrl) {
    try {
      const u = new URL(canonical)
      path = stripLocalePrefix(u.pathname, locales)
    } catch {
      path = '/'
    }
  }
  if (!path && canonical && !baseUrl) {
    // Legacy fallback: same URL twice (avoid empty hreflang)
    return [
      { lang: locale || defaultLocale, href: canonical },
      { lang: 'x-default', href: canonical },
    ]
  }
  if (!baseUrl || path == null) return []

  const bare = stripLocalePrefix(path, locales)
  const out = []
  for (const code of locales) {
    const localized = localizePath(bare, code, defaultLocale)
    out.push({
      lang: code,
      href: `${baseUrl}${localized === '/' ? '/' : localized}`,
    })
  }
  const defaultHref = `${baseUrl}${localizePath(bare, defaultLocale, defaultLocale) === '/' ? '/' : localizePath(bare, defaultLocale, defaultLocale)}`
  out.push({ lang: 'x-default', href: defaultHref })
  return out
}

export { DEFAULT_LOCALE, KNOWN_LOCALES }
