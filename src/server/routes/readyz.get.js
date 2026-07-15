export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const url = config.public.supabaseUrl || process.env.VITE_SUPABASE_URL
  const key = config.public.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    setResponseStatus(event, 503)
    return { ok: false, reason: 'missing_supabase_env' }
  }
  try {
    // Prefer Auth health: `/rest/v1/` OpenAPI root requires a secret key and
    // returns 401 for publishable/anon keys (sb_publishable_* / legacy anon JWT).
    const res = await fetch(`${url.replace(/\/$/, '')}/auth/v1/health`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) {
      setResponseStatus(event, 503)
      return { ok: false, reason: 'supabase_unreachable', status: res.status }
    }
    return { ok: true }
  } catch (e) {
    setResponseStatus(event, 503)
    return { ok: false, reason: e?.message || 'supabase_error' }
  }
})
