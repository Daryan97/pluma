import { applySeoToDocument, robotsForClientPath, resolveTwitterSite, absoluteAssetUrl } from '@/lib/seoMeta'
import { projectInfo } from '@/config/projectInfo'
import { useBranding } from '@/stores/brandingStore'

/**
 * Client-side SEO refresh after branding changes (SPA navigation fallback).
 * Under Nuxt SSR, prefer useSeoMeta / useHead on pages; this keeps older call sites working.
 */
export function refreshDocumentSeo() {
  if (typeof window === 'undefined') return

  let route
  try {
    route = useRoute()
  } catch {
    return
  }
  if (!route) return

  const branding = useBranding()
  const base = route.meta?.baseTitle
  const title = base ? `${base} | ${projectInfo.name}` : projectInfo.name
  const descRaw = route.meta?.description
  const desc = typeof descRaw === 'function' ? descRaw() : descRaw || projectInfo.description
  const canonicalHref = window.location.origin + String(route.fullPath || '/').split('?')[0]
  const pathName = String(route.path || '/')
  const isArticle = pathName.includes('/posts/') || pathName.includes('/archive/post/')
  const post = window.__PLUMA_CURRENT_POST
  const fallbackImage =
    branding.lightLogoUrl?.value ||
    branding.darkLogoUrl?.value ||
    branding.faviconUrl?.value ||
    '/favicon.png'
  const image = absoluteAssetUrl(
    (isArticle && post?.cover_image_url) || fallbackImage,
    window.location.origin
  )
  const twitterSite = resolveTwitterSite({
    twitterHandle: branding.twitterHandle?.value,
    socialLinks: branding.socialLinks?.value || [],
    envHandle: import.meta.env.VITE_TWITTER_SITE,
  })

  let ld = null
  if (pathName === '/' || pathName.match(/^\/(ar|es|fr|de)\/?$/)) {
    ld = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: projectInfo.name,
      description: desc,
      url: canonicalHref,
      publisher: { '@type': 'Organization', name: projectInfo.name, url: window.location.origin },
    }
  } else if (isArticle && post) {
    ld = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: desc,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      image,
      author: post.author
        ? { '@type': 'Person', name: post.author.display_name || post.author.username }
        : undefined,
      url: canonicalHref,
    }
  }

  const snapshot = {
    title: isArticle && post?.title ? `${post.title} | ${projectInfo.name}` : title,
    description: desc,
    canonical: canonicalHref,
    robots: robotsForClientPath(pathName),
    locale: document.documentElement.lang || 'en',
    ogType: isArticle ? 'article' : 'website',
    image,
    twitterSite,
    publishedTime: isArticle ? post?.created_at : null,
    modifiedTime: isArticle ? post?.updated_at || post?.created_at : null,
    structuredData: ld,
  }

  applySeoToDocument(snapshot)
  window.__PLUMA_META_SNAPSHOT = snapshot
  try {
    window.localStorage?.setItem('pluma:metaSnapshot', JSON.stringify(snapshot))
  } catch (_) {
    /* ignore */
  }
}
