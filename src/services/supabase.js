import { createClient } from '@supabase/supabase-js'
import { getRuntimeEnvSync } from '@/lib/runtimeEnv'

let _client = null

function resolveCredentials() {
  let url = ''
  let key = ''
  try {
    const config = useRuntimeConfig()
    url = config.public.supabaseUrl || ''
    key = config.public.supabaseAnonKey || ''
  } catch {
    /* not in Nuxt setup */
  }
  if (!url || !key) {
    const env = getRuntimeEnvSync()
    url = url || env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
    key = key || env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
  }
  if (!url || !key) {
    console.warn('[pluma] Supabase credentials missing — using placeholders')
    url = 'https://placeholder.supabase.co'
    key = 'public-anon-key'
  }
  return { url, key }
}

export function getSupabase() {
  if (_client) return _client
  const { url, key } = resolveCredentials()
  _client = createClient(url, key, {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
      detectSessionInUrl: typeof window !== 'undefined',
    },
  })
  return _client
}

/** Lazy proxy so existing `import { supabase }` keeps working under Nuxt SSR. */
export const supabase = new Proxy(
  {},
  {
    get(_t, prop) {
      const client = getSupabase()
      const value = client[prop]
      return typeof value === 'function' ? value.bind(client) : value
    },
  }
)
