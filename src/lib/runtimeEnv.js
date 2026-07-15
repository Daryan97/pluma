let cachedEnv = null
let loadPromise = null
let warnedInvalidEnv = false

function getBundleEnv() {
  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_ENV: import.meta.env.VITE_ENV,
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  }
}

function warnInvalidEnv(reason) {
  if (warnedInvalidEnv) return
  warnedInvalidEnv = true
  console.warn(`[runtime-env] ${reason}`)
}

function mergeEnv(...parts) {
  const out = {}
  for (const part of parts) {
    if (!part || typeof part !== 'object') continue
    for (const [key, value] of Object.entries(part)) {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        out[key] = value
      }
    }
  }
  return out
}

async function fetchRuntimeEnv() {
  // Always try /env on the client so Docker/runtime VITE_* apply even when
  // the Nitro image was built without those values baked in.
  if (!import.meta.client) return {}

  try {
    const response = await fetch('/env', { cache: 'no-store' })
    if (!response.ok) {
      warnInvalidEnv(`Failed to load /env (${response.status})`)
      return {}
    }

    const raw = await response.text()
    const trimmed = raw.trim()
    if (!trimmed) return {}

    try {
      return JSON.parse(trimmed)
    } catch (_) {
      const snippet = trimmed.slice(0, 30).replace(/\s+/g, ' ')
      if (/^<!doctype/i.test(trimmed)) {
        warnInvalidEnv(
          'Received HTML when requesting /env. The runtime env endpoint must return JSON.'
        )
      } else {
        warnInvalidEnv(
          `/env response is not valid JSON (${snippet || 'empty response'})`
        )
      }
      return {}
    }
  } catch (error) {
    warnInvalidEnv(
      `Unable to load /env (${error?.message || 'unknown error'})`
    )
    return {}
  }
}

/**
 * @param {Record<string, string>} [seed] Extra values (e.g. Nuxt runtimeConfig)
 */
export async function loadRuntimeEnv(seed = {}) {
  if (cachedEnv && !Object.keys(seed || {}).length) {
    return cachedEnv
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      const bundleEnv = getBundleEnv()
      const runtimeOverrides = await fetchRuntimeEnv()
      cachedEnv = mergeEnv(bundleEnv, seed, runtimeOverrides)
      return cachedEnv
    })()
  } else if (Object.keys(seed || {}).length) {
    // Merge late seed into in-flight / existing cache
    const current = await loadPromise
    cachedEnv = mergeEnv(current, seed)
    return cachedEnv
  }

  return loadPromise
}

export function getRuntimeEnvSync() {
  return cachedEnv || getBundleEnv()
}

/** Ensure /env (and optional seed) are loaded before reading site URL for auth redirects. */
export async function ensureRuntimeEnv(seed = {}) {
  return loadRuntimeEnv(seed)
}
