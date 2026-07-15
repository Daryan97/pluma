import { createClient } from '@supabase/supabase-js'
import { getRuntimeEnvSync } from '@/lib/runtimeEnv'

let _client = null
let _clientKey = ''

function resolveUrlKey() {
  const config = useRuntimeConfig()
  let url = config.public.supabaseUrl || ''
  let key = config.public.supabaseAnonKey || ''

  if ((!url || !key) && import.meta.client) {
    const env = getRuntimeEnvSync()
    url = url || env.VITE_SUPABASE_URL || ''
    key = key || env.VITE_SUPABASE_ANON_KEY || ''
  }

  if ((!url || !key) && import.meta.server) {
    url =
      url ||
      process.env.NUXT_PUBLIC_SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      ''
    key =
      key ||
      process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      ''
  }

  return { url, key }
}

function isPlaceholder(url, key) {
  return (
    !url ||
    !key ||
    url.includes('placeholder.supabase') ||
    key === 'public-anon-key'
  )
}

/**
 * Shared Supabase browser/server client.
 * Prefers runtimeConfig (NUXT_PUBLIC_* / Docker-mapped VITE_*); avoids
 * permanently caching a placeholder client when env appears later.
 */
export function useSupabaseClient() {
  const { url: resolvedUrl, key: resolvedKey } = resolveUrlKey()
  let url = resolvedUrl
  let key = resolvedKey

  if (isPlaceholder(url, key)) {
    console.warn('[pluma] Supabase URL/key missing — client created with placeholders')
    url = url || 'https://placeholder.supabase.co'
    key = key || 'public-anon-key'
  }

  const cacheKey = `${url}::${key}`
  if (_client && _clientKey === cacheKey) return _client

  // Replace cached placeholder once real credentials are available
  if (_client && _clientKey !== cacheKey && !isPlaceholder(resolvedUrl, resolvedKey)) {
    _client = null
  }

  _clientKey = cacheKey
  _client = createClient(url, key, {
    auth: {
      persistSession: import.meta.client,
      autoRefreshToken: import.meta.client,
      detectSessionInUrl: import.meta.client,
    },
  })
  return _client
}
