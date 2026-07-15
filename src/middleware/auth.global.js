export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const { $toast, $i18n } = useNuxtApp()
  const config = useRuntimeConfig()
  const localePath = useLocalePath()
  const lp = (path, query) =>
    query ? { path: localePath(path), query } : localePath(path)

  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const requiresAuthorOrAdmin = to.meta.requiresAuthorOrAdmin
  const requireAnonymous = to.meta.requireAnonymous
  const devOnly = to.meta.devOnly
  const needsAuthGate =
    requiresAuth || requiresAdmin || requiresAuthorOrAdmin || requireAnonymous

  if (devOnly && config.public.env !== 'development') {
    return navigateTo(lp('/'))
  }

  const isInstallRoute =
    to.name === 'install' ||
    to.path === '/install' ||
    to.path.endsWith('/install') ||
    /(^|\/)install(\/|$)/.test(to.path)

  // Localized /ku/install etc. → canonical English /install
  if (isInstallRoute && to.path !== '/install') {
    return navigateTo({ path: '/install', query: to.query, hash: to.hash })
  }

  function normalizeInstallFlag(raw) {
    if (raw === true || raw === 'true' || raw === 1 || raw === '1') return true
    if (raw && typeof raw === 'object' && raw !== null) {
      if (raw.complete === true || raw.complete === 'true') return true
      if (raw.installed === true || raw.installed === 'true') return true
    }
    return false
  }

  // Install gate — fail open on config/network errors so a bad SSR client
  // cannot lock everyone into /install forever.
  try {
    const url = config.public.supabaseUrl || ''
    const key = config.public.supabaseAnonKey || ''
    const credsMissing =
      !url ||
      !key ||
      url.includes('placeholder.supabase') ||
      key === 'public-anon-key'

    if (credsMissing) {
      console.warn('[install-gate] Supabase credentials missing; skipping gate')
    } else {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'installation')
        .maybeSingle()

      if (error) {
        // Missing schema → genuinely not installed
        if (
          /relation .* does not exist|Could not find the table|schema cache/i.test(
            error.message || ''
          )
        ) {
          if (!isInstallRoute) return navigateTo('/install')
        } else {
          console.warn('[install-gate] settings read failed:', error.message)
        }
      } else {
        const installDone = !!data && normalizeInstallFlag(data.value)

        if (!installDone && !isInstallRoute) {
          return navigateTo('/install')
        }
        if (installDone && isInstallRoute) {
          return navigateTo(lp('/'))
        }
      }
    }
  } catch (e) {
    if (e?.message?.includes('JWSError')) {
      if (import.meta.server) return
      await supabase.auth.signOut()
      return navigateTo(lp('/login'))
    }
    console.warn('[install-gate] unexpected error:', e?.message || e)
    // Fail open — do not bounce to /install
  }

  // Session is persisted in localStorage — getSession() is empty on SSR.
  if (import.meta.server && needsAuthGate) {
    return
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (user && !to.path.includes('/profile')) {
    const { data: prof, error: profErr } = await supabase
      .from('profiles')
      .select('username, display_name, role')
      .eq('id', user.id)
      .single()
    if (!profErr && (!prof?.username || !prof?.display_name)) {
      if (import.meta.client && $toast) {
        $toast.error($i18n.t('profile.completeBeforeProceeding'))
      }
      return navigateTo(lp('/profile', { edit: 'true' }))
    }
    if (!profErr && prof?.role === 'disabled') {
      await supabase.auth.signOut()
      if (import.meta.client && $toast) {
        $toast.error($i18n.t('profile.accountDisabled'))
      }
      return navigateTo(lp('/login'))
    }
  }

  if (requireAnonymous && user) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : ''
    if (redirect.startsWith('/') && !redirect.startsWith('//')) {
      return navigateTo(redirect)
    }
    return navigateTo(lp('/'))
  }
  if (requiresAuth && !user) {
    return navigateTo(lp('/login', { redirect: to.fullPath }))
  }

  if ((requiresAdmin || requiresAuthorOrAdmin) && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (!profile?.role) return navigateTo(lp('/'))
    if (requiresAdmin && profile.role !== 'admin') return navigateTo(lp('/'))
    if (requiresAuthorOrAdmin && !['admin', 'author'].includes(profile.role)) {
      return navigateTo(lp('/'))
    }
  }
})
