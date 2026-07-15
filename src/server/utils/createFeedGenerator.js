import { FeedGenerator } from './feeds/generator.js'

export function createFeedGenerator(event) {
  const config = useRuntimeConfig(event)
  return new FeedGenerator({
    supabaseUrl: config.public.supabaseUrl || process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: config.public.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY,
    siteUrl: config.public.siteUrl || process.env.VITE_SITE_URL || 'http://localhost:3000',
    cacheTtl: config.feedsCacheTtlMs || Number(process.env.FEEDS_CACHE_TTL_MS || 5 * 60 * 1000),
  })
}
