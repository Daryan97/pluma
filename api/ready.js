import { getGenerator, vercelHandler } from './_lib.js'

export default vercelHandler(async (_req, res) => {
  const gen = getGenerator()
  const hasEnv = !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)
  let supabaseOk = false
  if (hasEnv && gen.supabase) {
    try {
      const { error } = await gen.supabase.from('settings').select('key').limit(1)
      supabaseOk = !error
    } catch (_) {
      supabaseOk = false
    }
  }
  const ready = hasEnv && supabaseOk
  res.statusCode = ready ? 200 : 503
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify({ ok: ready, hasEnv, supabaseOk }))
})
