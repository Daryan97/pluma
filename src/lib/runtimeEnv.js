const SHOULD_FETCH_RUNTIME_ENV = !import.meta.env?.DEV || import.meta.env?.VITE_RUNTIME_ENV_IN_DEV === 'true'

let cachedEnv = null
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

async function fetchRuntimeEnv() {
  if (!SHOULD_FETCH_RUNTIME_ENV) {
    return {}
  }
  try {
    const response = await fetch('/env', { cache: 'no-store' })
    if (!response.ok) {
      warnInvalidEnv(`Failed to load /env (${response.status})`)
      return {}
    }

    const raw = await response.text()
    const trimmed = raw.trim()
    if (!trimmed) {
      return {}
    }

    try {
      return JSON.parse(trimmed)
    } catch (_) {
      const snippet = trimmed.slice(0, 30).replace(/\s+/g, ' ')
      if (/^<!doctype/i.test(trimmed)) {
        warnInvalidEnv('Received HTML when requesting /env. The runtime env endpoint must return JSON.')
      } else {
        warnInvalidEnv(`/env response is not valid JSON (${snippet || 'empty response'})`)
      }
      return {}
    }
  } catch (error) {
    warnInvalidEnv(`Unable to load /env file (${error?.message || 'unknown error'})`)
    return {}
  }
}

export async function loadRuntimeEnv() {
  if (cachedEnv) {
    return cachedEnv
  }

  const bundleEnv = getBundleEnv()

  const runtimeOverrides = await fetchRuntimeEnv()
  cachedEnv = {
    ...bundleEnv,
    ...Object.fromEntries(
      Object.entries(runtimeOverrides).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ),
  }

  return cachedEnv
}

export function getRuntimeEnvSync() {
  return cachedEnv || getBundleEnv()
}
