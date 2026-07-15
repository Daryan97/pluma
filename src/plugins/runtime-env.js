import { loadRuntimeEnv } from '@/lib/runtimeEnv'

/**
 * Load runtime VITE_* from Nitro (/env + runtimeConfig) before pages
 * use getBrowserOrigin() for magic-link / password-reset redirects.
 */
export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const seed = {
    VITE_SUPABASE_URL: config.public.supabaseUrl || '',
    VITE_SUPABASE_ANON_KEY: config.public.supabaseAnonKey || '',
    VITE_SITE_URL: config.public.siteUrl || '',
    VITE_SITE_LOCALE: config.public.siteLocale || '',
    VITE_ENV: config.public.env || '',
    VITE_TWITTER_SITE: config.public.twitterSite || '',
  }

  if (import.meta.client) {
    await loadRuntimeEnv(seed)
  } else {
    // SSR: no /env fetch; seed from runtimeConfig only.
    await loadRuntimeEnv(seed)
  }
})
