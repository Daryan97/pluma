import { c as defineEventHandler, u as useRuntimeConfig, e as setHeader } from '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const env_get = defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  setHeader(event, "Content-Type", "application/json; charset=utf-8");
  setHeader(event, "Cache-Control", "no-store");
  return {
    VITE_SUPABASE_URL: config.public.supabaseUrl || process.env.VITE_SUPABASE_URL || "",
    VITE_SUPABASE_ANON_KEY: config.public.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY || "",
    VITE_SITE_URL: config.public.siteUrl || process.env.VITE_SITE_URL || "",
    VITE_SITE_LOCALE: config.public.siteLocale || process.env.VITE_SITE_LOCALE || "en",
    VITE_ENV: config.public.env || process.env.VITE_ENV || "production",
    VITE_TWITTER_SITE: config.public.twitterSite || process.env.VITE_TWITTER_SITE || ""
  };
});

export { env_get as default };
//# sourceMappingURL=env.get.mjs.map
