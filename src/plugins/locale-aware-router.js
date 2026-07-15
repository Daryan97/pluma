/**
 * Keep programmatic navigation on the active UI locale prefix.
 * Avoids useI18n()/useLocalePath() — those require a Vue component setup context.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const i18n = nuxtApp.$i18n
  if (!i18n) return

  function defaultLocale() {
    return unref(i18n.defaultLocale) || 'en'
  }

  function localeCodes() {
    const list = unref(i18n.locales) || []
    return list.map((l) => (typeof l === 'string' ? l : l.code)).filter(Boolean)
  }

  function currentLocale() {
    return unref(i18n.locale) || defaultLocale()
  }

  function stripLocalePrefix(path) {
    const def = defaultLocale()
    for (const code of localeCodes()) {
      if (code === def) continue
      if (path === `/${code}`) return '/'
      if (path.startsWith(`/${code}/`)) return path.slice(code.length + 1)
    }
    return path
  }

  function alreadyLocalized(path) {
    if (!path || typeof path !== 'string' || !path.startsWith('/')) return true
    const def = defaultLocale()
    return localeCodes()
      .filter((c) => c !== def)
      .some((code) => path === `/${code}` || path.startsWith(`/${code}/`))
  }

  function localizePath(path) {
    if (!path || typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
      return path
    }
    // Static assets must not be locale-prefixed or treated as app routes.
    if (/\.[a-z0-9]{1,8}(?:\?.*)?$/i.test(path)) {
      return path
    }
    // Install wizard stays at unprefixed /install (English only).
    if (path === '/install' || path.startsWith('/install/') || path.startsWith('/install?') || path.startsWith('/install#')) {
      return path
    }
    const stripped = stripLocalePrefix(path)
    if (stripped === '/install' || stripped.startsWith('/install/') || stripped.startsWith('/install?')) {
      return stripped
    }
    if (alreadyLocalized(path)) return path
    const locale = currentLocale()
    const def = defaultLocale()
    if (!locale || locale === def) return path
    const bare = stripLocalePrefix(path)
    return bare === '/' ? `/${locale}` : `/${locale}${bare}`
  }

  function localizeTo(to) {
    if (to == null) return to
    if (typeof to === 'string') return localizePath(to)
    if (typeof to === 'object') {
      if (to.name != null) return to
      if (typeof to.path === 'string' && to.path.startsWith('/')) {
        return { ...to, path: localizePath(to.path) }
      }
    }
    return to
  }

  const originalPush = router.push.bind(router)
  const originalReplace = router.replace.bind(router)

  router.push = (to, ...args) => originalPush(localizeTo(to), ...args)
  router.replace = (to, ...args) => originalReplace(localizeTo(to), ...args)
})
