export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store')
  return {
    VITE_SUPABASE_URL: config.public.supabaseUrl || process.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: config.public.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY || '',
    VITE_SITE_URL: config.public.siteUrl || process.env.VITE_SITE_URL || '',
    VITE_SITE_LOCALE: config.public.siteLocale || process.env.VITE_SITE_LOCALE || 'en',
    VITE_ENV: config.public.env || process.env.VITE_ENV || 'production',
    VITE_TWITTER_SITE: config.public.twitterSite || process.env.VITE_TWITTER_SITE || '',
  }
})
