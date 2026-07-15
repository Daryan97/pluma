export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const { $toast, $i18n } = useNuxtApp()
  const config = useRuntimeConfig()
  const localePath = useLocalePath()
  const auth = useAuthCache()
  const lp = (path, query) =>
    query ? { path: localePath(path), query } : localePath(path)

  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const requiresAuthorOrAdmin = to.meta.requiresAuthorOrAdmin
  const requireAnonymous = to.meta.requireAnonymous
  const devOnly = to.meta.devOnly
  const needsAuthGate =
    requiresAuth || requiresAdmin || requiresAuthorOrAdmin || requireAnonymous
  const needsRoleCheck = requiresAdmin || requiresAuthorOrAdmin

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

  // Install gate — cached after first successful read.
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
      try {
        const installDone = await auth.ensureInstallStatus(supabase)
        if (!installDone && !isInstallRoute) {
          return navigateTo('/install')
        }
        if (installDone && isInstallRoute) {
          return navigateTo(lp('/'))
        }
      } catch (error) {
        console.warn('[install-gate] settings read failed:', error?.message || error)
        // Fail open — do not bounce to /install
      }
    }
  } catch (e) {
    if (e?.message?.includes('JWSError')) {
      if (import.meta.server) return
      auth.clearAuthCache()
      await supabase.auth.signOut()
      return navigateTo(lp('/login'))
    }
    console.warn('[install-gate] unexpected error:', e?.message || e)
  }

  // Session is persisted in localStorage — getSession() is empty on SSR.
  if (import.meta.server) {
    if (needsAuthGate) return
    // Install gate already handled; skip session on SSR for public routes.
    return
  }

  // Warm session once; later navigations hit useState cache only.
  const user = await auth.ensureSession(supabase)
  const userId = user?.id || auth.sessionUserId.value

  if (userId && !to.path.includes('/profile')) {
    const prof = await auth.ensureProfile(supabase, userId, {
      force: needsRoleCheck && !auth.profileCache.value?.role,
    })

    if (!prof?.username || !prof?.display_name) {
      if ($toast) $toast.error($i18n.t('profile.completeBeforeProceeding'))
      return navigateTo(lp('/profile', { edit: 'true' }))
    }
    if (prof?.role === 'disabled') {
      auth.clearAuthCache()
      await supabase.auth.signOut()
      if ($toast) $toast.error($i18n.t('profile.accountDisabled'))
      return navigateTo(lp('/login'))
    }
  }

  if (requireAnonymous && userId) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : ''
    if (redirect.startsWith('/') && !redirect.startsWith('//')) {
      return navigateTo(redirect)
    }
    return navigateTo(lp('/'))
  }
  if (requiresAuth && !userId) {
    return navigateTo(lp('/login', { redirect: to.fullPath }))
  }

  if (needsRoleCheck && userId) {
    const profile = await auth.ensureProfile(supabase, userId)
    if (!profile?.role) return navigateTo(lp('/'))
    if (requiresAdmin && profile.role !== 'admin') return navigateTo(lp('/'))
    if (requiresAuthorOrAdmin && !['admin', 'author'].includes(profile.role)) {
      return navigateTo(lp('/'))
    }
  }
})