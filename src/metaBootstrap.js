import { projectInfo } from './config/projectInfo.js'

const STORAGE_KEY = 'pluma:metaSnapshot'
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

function readSnapshot() {
  if (!isBrowser) return null
  const existing = window.__PLUMA_META_SNAPSHOT
  if (existing && typeof existing === 'object') {
    return existing
  }
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch (error) {
    console.warn('[meta-bootstrap] Unable to read cached snapshot', error)
    return null
  }
}

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

function applyStructuredData(payload) {
  if (!payload?.structuredData) return
  try {
    let script = document.getElementById('ld-primary')
    if (!script) {
      script = document.createElement('script')
      script.id = 'ld-primary'
      script.type = 'application/ld+json'
      document.head?.appendChild(script)
    }
    script.textContent = JSON.stringify(payload.structuredData)
  } catch (error) {
    console.warn('[meta-bootstrap] Failed to apply structured data', error)
  }
}

function applyMeta(payload = {}) {
  const title = payload.title?.trim() || projectInfo.name
  const description = payload.description?.trim() || projectInfo.description
  if (title) {
    document.title = title
  }

  const metaDesc = document.head?.querySelector('meta[name="description"]')
  if (metaDesc && description) {
    metaDesc.setAttribute('content', description)
  }

  const canonicalHref = payload.canonical || (window.location?.origin && window.location?.pathname
    ? `${window.location.origin}${window.location.pathname}`
    : window.location?.href)
  if (canonicalHref) {
    let canonical = document.head?.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head?.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalHref)
  }

  ensureMeta('og:title').setAttribute('content', title)
  ensureMeta('og:description').setAttribute('content', description)
  ensureMeta('og:type').setAttribute('content', payload.type || 'website')
  ensureMeta('og:site_name').setAttribute('content', payload.siteName || projectInfo.name)
  if (canonicalHref) {
    ensureMeta('og:url').setAttribute('content', canonicalHref)
  }

  ensureMeta('twitter:card', 'name').setAttribute('content', payload.cardType || 'summary_large_image')
  ensureMeta('twitter:title', 'name').setAttribute('content', title)
  ensureMeta('twitter:description', 'name').setAttribute('content', description)
  if (canonicalHref) {
    ensureMeta('twitter:url', 'name').setAttribute('content', canonicalHref)
  }

  if (payload.image) {
    ensureMeta('og:image').setAttribute('content', payload.image)
    ensureMeta('twitter:image', 'name').setAttribute('content', payload.image)
  }

  applyStructuredData(payload)
}

if (isBrowser) {
  const snapshot = readSnapshot()
  applyMeta(snapshot || {})
  if (!window.__PLUMA_META_SNAPSHOT) {
    window.__PLUMA_META_SNAPSHOT = snapshot || {
      title: projectInfo.name,
      description: projectInfo.description,
      siteName: projectInfo.name,
      type: 'website',
    }
  }
}
