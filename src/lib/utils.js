import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getRuntimeEnvSync, ensureRuntimeEnv } from "@/lib/runtimeEnv";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function stripTrailingSlash(url) {
  return String(url || "").replace(/\/+$/, "");
}

/**
 * Public site origin for canonical links and auth redirects.
 * Prefers configured VITE_SITE_URL (runtime /env or Nuxt runtimeConfig)
 * so Docker/local port-forwards don't send magic links to localhost.
 */
export function getBrowserOrigin() {
  const configuredSiteUrl = getRuntimeEnvSync()?.VITE_SITE_URL?.trim();
  if (configuredSiteUrl) {
    return stripTrailingSlash(configuredSiteUrl);
  }

  try {
    const config = useRuntimeConfig();
    const siteUrl = config.public?.siteUrl?.trim();
    if (siteUrl) return stripTrailingSlash(siteUrl);
  } catch {
    /* outside Nuxt setup */
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

/** Await runtime env, then resolve origin (use before auth email redirects). */
export async function resolveSiteOrigin() {
  try {
    const config = useRuntimeConfig();
    await ensureRuntimeEnv({
      VITE_SITE_URL: config.public?.siteUrl || "",
      VITE_SUPABASE_URL: config.public?.supabaseUrl || "",
      VITE_SUPABASE_ANON_KEY: config.public?.supabaseAnonKey || "",
    });
  } catch {
    await ensureRuntimeEnv();
  }
  return getBrowserOrigin();
}

export function getBrowserUrl() {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return "";
}
