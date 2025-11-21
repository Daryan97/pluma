let cachedEnv = null

async function fetchRuntimeEnv() {
  try {
    const response = await fetch('/env', { cache: 'no-store' })
    if (!response.ok) {
      console.warn(`[runtime-env] Failed to load /env (${response.status})`)
      return {}
    }
    const data = await response.json()
    return data ?? {}
  } catch (error) {
    console.warn('[runtime-env] Unable to load /env file.', error)
    return {}
  }
}

export async function loadRuntimeEnv() {
  if (cachedEnv) {
    return cachedEnv
  }

  const bundleEnv = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_ENV: import.meta.env.VITE_ENV,
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  }

  const runtimeOverrides = await fetchRuntimeEnv()
  cachedEnv = {
    ...bundleEnv,
    ...Object.fromEntries(
      Object.entries(runtimeOverrides).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ),
  }

  return cachedEnv
}
