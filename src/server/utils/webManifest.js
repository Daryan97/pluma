import { createClient } from '@supabase/supabase-js'

const DEFAULT_NAME = 'Pluma'
const DEFAULT_DESCRIPTION =
  'A simple and modern blogging platform built with Nuxt and Supabase.'
const FALLBACK_ICON = '/favicon.png'

function absoluteUrl(siteUrl, pathOrUrl) {
  if (!pathOrUrl) return null
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const base = String(siteUrl || '').replace(/\/$/, '')
  const path = String(pathOrUrl).startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return base ? `${base}${path}` : path
}

function guessImageType(url) {
  const lower = String(url || '').toLowerCase()
  if (lower.includes('.svg')) return 'image/svg+xml'
  if (lower.includes('.ico')) return 'image/x-icon'
  if (lower.includes('.webp')) return 'image/webp'
  if (lower.includes('.jpg') || lower.includes('.jpeg')) return 'image/jpeg'
  return 'image/png'
}

async function loadBranding(event) {
  const config = useRuntimeConfig(event)
  const url = config.public.supabaseUrl || process.env.VITE_SUPABASE_URL || ''
  const key =
    config.public.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY || ''
  if (!url || !key || url.includes('placeholder.supabase')) return null

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'branding')
      .maybeSingle()
    if (error) {
      console.warn('[manifest] branding read failed:', error.message)
      return null
    }
    return data?.value && typeof data.value === 'object' ? data.value : null
  } catch (e) {
    console.warn('[manifest] branding error:', e?.message || e)
    return null
  }
}

export async function buildWebManifest(event) {
  const config = useRuntimeConfig(event)
  const siteUrl =
    config.public.siteUrl || process.env.VITE_SITE_URL || 'http://localhost:3000'
  const branding = await loadBranding(event)

  const name = (branding?.siteName || '').trim() || DEFAULT_NAME
  const description =
    (branding?.siteDescription || '').trim() || DEFAULT_DESCRIPTION
  const shortName = name.length > 12 ? name.slice(0, 12) : name

  const iconSrc =
    absoluteUrl(
      siteUrl,
      branding?.faviconUrl ||
        branding?.lightLogoUrl ||
        branding?.darkLogoUrl ||
        FALLBACK_ICON
    ) || FALLBACK_ICON

  return {
    id: '/',
    name,
    short_name: shortName,
    description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    lang: branding?.primaryLocale || branding?.locale || 'en',
    icons: [
      {
        src: iconSrc,
        sizes: 'any',
        type: guessImageType(iconSrc),
        purpose: 'any',
      },
      {
        src: iconSrc,
        sizes: '192x192',
        type: guessImageType(iconSrc),
        purpose: 'any',
      },
      {
        src: iconSrc,
        sizes: '512x512',
        type: guessImageType(iconSrc),
        purpose: 'any',
      },
    ],
  }
}

export function sendWebManifest(event, manifest) {
  setHeader(event, 'Content-Type', 'application/manifest+json; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=300')
  return manifest
}
