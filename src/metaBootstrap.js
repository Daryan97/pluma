import { projectInfo } from './config/projectInfo.js'
import { applySeoToDocument, resolveTwitterSite } from './lib/seoMeta.js'

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

if (isBrowser) {
  const snapshot = readSnapshot()
  const fallback = {
    title: projectInfo.name,
    description: projectInfo.description,
    siteName: projectInfo.name,
    type: 'website',
    path: window.location?.pathname || '/',
    canonical: window.location?.origin
      ? `${window.location.origin}${window.location.pathname || '/'}`
      : undefined,
  }
  const merged = { ...(snapshot || fallback) }
  // Do not invent twitter:site — only keep if snapshot already had a real handle
  if (!merged.twitterSite) {
    delete merged.twitterSite
  } else {
    merged.twitterSite = resolveTwitterSite({ twitterHandle: merged.twitterSite })
    if (!merged.twitterSite) delete merged.twitterSite
  }
  applySeoToDocument(merged)
  if (!window.__PLUMA_META_SNAPSHOT) {
    window.__PLUMA_META_SNAPSHOT = merged
  }
}
