/**
 * Nuxt SSR-friendly page SEO via useSeoMeta / useHead.
 * Shared helpers live in server/utils/feeds/seo.js and lib/seoMeta.js.
 */
import {
  absoluteAssetUrl,
  resolveTwitterSite,
  robotsForClientPath,
  resolveSeoImage,
} from '@/lib/seoMeta'
import {
  buildHreflangs,
  localizePath,
  stripLocalePrefix,
} from '@/lib/seoPaths'
import { useBranding } from '@/stores/brandingStore'
import { projectInfo } from '@/config/projectInfo'
import { allConfiguredLocaleCodes } from '@/config/contentLocales'

function toIso(date) {
  if (!date) return null
  try {
    return new Date(date).toISOString()
  } catch {
    return null
  }
}

function stripFormatting(value = '') {
  return String(value)
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_#>\-\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function pathWithoutLocale(fullPath, locales) {
  const path = String(fullPath || '/')
    .split('?')[0]
    .split('#')[0]
  return stripLocalePrefix(path, locales)
}

function resolveSiteOrigin(config, requestOrigin = '') {
  const configured = String(config?.public?.siteUrl || '').replace(/\/$/, '')
  if (configured) return configured
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.origin
  }
  return requestOrigin || ''
}

/**
 * Apply SEO for the current page.
 * @param {import('vue').MaybeRefOrGetter<object>} source reactive payload
 */
export function usePageSeo(source) {
  const route = useRoute()
  const { locale, locales } = useI18n()
  const branding = useBranding()
  // Capture Nuxt composables during setup — never call them inside computed().
  const config = useRuntimeConfig()
  let requestOrigin = ''
  try {
    requestOrigin = useRequestURL().origin
  } catch {
    requestOrigin = ''
  }

  const resolved = computed(() => {
    const raw = typeof source === 'function' ? source() : unref(source)
    return raw && typeof raw === 'object' ? raw : {}
  })

  const localeCodes = computed(() => {
    const enabled = branding.enabledLocales?.value
    if (Array.isArray(enabled) && enabled.length) return enabled
    const fromI18n = (unref(locales) || []).map((l) => l.code).filter(Boolean)
    return fromI18n.length ? fromI18n : allConfiguredLocaleCodes()
  })

  const defaultLocale = 'en'
  const origin = computed(() => resolveSiteOrigin(config, requestOrigin))

  const siteName = computed(() => {
    const fromPage = resolved.value.siteName
    if (fromPage) return fromPage
    const fromBranding =
      branding.resolveLocalizedSiteName?.(unref(locale)) ||
      branding.siteName?.value
    if (fromBranding) return fromBranding
    // Wait for branding before falling back to the product name "Pluma".
    if (!branding.brandingLoaded?.value) return fromBranding || ''
    return projectInfo.name || 'Pluma'
  })

  const siteDescription = computed(
    () =>
      resolved.value.siteDescription ||
      branding.resolveLocalizedSiteDescription?.(unref(locale)) ||
      branding.siteDescription?.value ||
      projectInfo.description ||
      'A modern, open-source blogging platform.'
  )

  const title = computed(() => {
    const t = resolved.value.title?.trim()
    if (t) return t
    return siteName.value
  })

  const description = computed(() => {
    const d = resolved.value.description?.trim()
    if (d) return d
    return siteDescription.value
  })

  const type = computed(() => resolved.value.type || 'website')

  const canonical = computed(() => {
    if (resolved.value.canonical) return resolved.value.canonical
    const base = origin.value
    if (!base) return ''
    const bare = pathWithoutLocale(route.fullPath || route.path || '/', localeCodes.value)
    const localized = localizePath(bare, unref(locale) || defaultLocale, defaultLocale)
    return `${base}${localized === '/' ? '/' : localized}`
  })

  const image = computed(() => {
    const brandingBag = {
      ogImageUrl: branding.ogImageUrl?.value,
      lightLogoUrl: branding.lightLogoUrl?.value,
      darkLogoUrl: branding.darkLogoUrl?.value,
      faviconUrl: branding.faviconUrl?.value,
    }
    const preferred = resolved.value.image || null
    const resolvedImg =
      resolveSeoImage(preferred, brandingBag, origin.value) ||
      (origin.value ? `${origin.value}/og-default.png` : '/og-default.png')
    return absoluteAssetUrl(resolvedImg, origin.value) || resolvedImg
  })

  const robots = computed(
    () =>
      resolved.value.robots ||
      robotsForClientPath(String(route.path || '/'))
  )

  const twitterSite = computed(() => {
    if (resolved.value.twitterSite) return resolved.value.twitterSite
    return resolveTwitterSite({
      twitterHandle: branding.twitterHandle?.value,
      socialLinks: branding.socialLinks?.value || [],
      envHandle: config.public.twitterSite || '',
    })
  })

  const hreflangs = computed(() => {
    if (Array.isArray(resolved.value.hreflangs) && resolved.value.hreflangs.length) {
      return resolved.value.hreflangs
    }
    const base = origin.value
    if (!base) return []
    const bare = pathWithoutLocale(route.fullPath || route.path || '/', localeCodes.value)
    return buildHreflangs(null, unref(locale) || defaultLocale, {
      baseUrl: base,
      path: bare,
      locales: localeCodes.value,
      defaultLocale,
    })
  })

  const structuredData = computed(() => {
    if (resolved.value.structuredData !== undefined) {
      return resolved.value.structuredData
    }
    if (type.value === 'article' && resolved.value.article) {
      const a = resolved.value.article
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.headline || title.value,
        description: description.value,
        datePublished: toIso(a.datePublished),
        dateModified: toIso(a.dateModified || a.datePublished),
        author: {
          '@type': 'Person',
          name: a.author || 'Unknown',
        },
        publisher: {
          '@type': 'Organization',
          name: siteName.value,
          url: origin.value || undefined,
        },
        image: image.value || undefined,
        keywords: a.keywords || undefined,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical.value,
        },
      }
    }
    if (type.value === 'website' && (route.path === '/' || bareIsHome(route.path, localeCodes.value))) {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName.value,
        description: description.value,
        url: `${origin.value}/`,
        publisher: {
          '@type': 'Organization',
          name: siteName.value,
          url: origin.value || undefined,
        },
      }
    }
    if (resolved.value.collection) {
      return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title.value,
        description: description.value,
        url: canonical.value,
      }
    }
    return null
  })

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    robots: () => robots.value,
    googlebot: () => robots.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogType: () => type.value,
    ogSiteName: () => siteName.value,
    ogUrl: () => canonical.value || undefined,
    ogImage: () => image.value || undefined,
    ogLocale: () => String(unref(locale) || 'en').replace('-', '_'),
    twitterCard: () => resolved.value.cardType || 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: () => image.value || undefined,
    twitterSite: () => twitterSite.value || undefined,
    twitterCreator: () => resolved.value.twitterCreator || undefined,
    articlePublishedTime: () =>
      type.value === 'article' ? toIso(resolved.value.publishedTime) : undefined,
    articleModifiedTime: () =>
      type.value === 'article'
        ? toIso(resolved.value.modifiedTime || resolved.value.publishedTime)
        : undefined,
  })

  useHead(() => {
    const links = []
    if (canonical.value) {
      links.push({ rel: 'canonical', href: canonical.value, key: 'canonical' })
    }
    for (const h of hreflangs.value) {
      if (!h?.lang || !h?.href) continue
      links.push({
        rel: 'alternate',
        hreflang: h.lang,
        href: h.href,
        key: `hreflang-${h.lang}`,
      })
    }
    const scripts = []
    if (structuredData.value) {
      scripts.push({
        id: 'ld-primary',
        type: 'application/ld+json',
        key: 'ld-primary',
        children: JSON.stringify(structuredData.value),
      })
    }
    return { link: links, script: scripts }
  })
}

function bareIsHome(path, locales) {
  return stripLocalePrefix(String(path || '/'), locales) === '/'
}

/**
 * Build a concise article SEO payload from a post row.
 */
export function articleSeoFromPost(post, siteName) {
  if (!post) return { title: siteName || 'Pluma', type: 'website' }
  const excerpt = stripFormatting(post.content || '').slice(0, 160)
  const name = siteName || projectInfo.name || 'Pluma'
  return {
    title: `${post.title || 'Untitled'} | ${name}`,
    description: excerpt || undefined,
    type: 'article',
    image: post.cover_image_url || null,
    publishedTime: post.created_at,
    modifiedTime: post.updated_at || post.created_at,
    article: {
      headline: post.title,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: post.author?.display_name || post.author?.username || 'Unknown',
      keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined,
    },
  }
}

export { stripFormatting, toIso, resolveSiteOrigin }
