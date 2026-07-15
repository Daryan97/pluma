export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const url = config.public.supabaseUrl || process.env.VITE_SUPABASE_URL
  const key = config.public.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    setResponseStatus(event, 503)
    return { ok: false, reason: 'missing_supabase_env' }
  }
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok && res.status !== 200 && res.status !== 404) {
      setResponseStatus(event, 503)
      return { ok: false, reason: 'supabase_unreachable', status: res.status }
    }
    return { ok: true }
  } catch (e) {
    setResponseStatus(event, 503)
    return { ok: false, reason: e?.message || 'supabase_error' }
  }
})
