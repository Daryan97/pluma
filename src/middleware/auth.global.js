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
      if (import.meta.client) {
        window.location.assign(localePath('/login'))
        return abortNavigation()
      }
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

  const isResetPasswordRoute =
    to.path.includes('/reset-password') || to.name?.toString?.().includes('reset-password')

  // Recovery flow: allow password reset without profile/role gates.
  if (isResetPasswordRoute) {
    return
  }

  // If recovery tokens landed on Site URL (/), send user to reset page.
  // Skip after a successful reset (?reset=1) or when recovery was completed.
  if (import.meta.client) {
    let recoveryDone = false
    try {
      recoveryDone = sessionStorage.getItem('pluma-password-recovery-done') === '1'
    } catch {
      /* ignore */
    }
    if (to.query.reset === '1' || recoveryDone) {
      // fall through — allow login/home after password update
    } else {
      let recoveryPending = useState('password-recovery-pending', () => false).value
      if (!recoveryPending) {
        try {
          recoveryPending = sessionStorage.getItem('pluma-password-recovery') === '1'
        } catch {
          /* ignore */
        }
      }
      if (!recoveryPending) {
        try {
          const hash = (window.location.hash || '').replace(/^#/, '')
          const search = (window.location.search || '').replace(/^\?/, '')
          const type =
            new URLSearchParams(hash).get('type') ||
            new URLSearchParams(search).get('type')
          recoveryPending = type === 'recovery'
        } catch {
          /* ignore */
        }
      }
      if (recoveryPending) {
        useState('password-recovery-pending', () => false).value = true
        try {
          sessionStorage.setItem('pluma-password-recovery', '1')
        } catch {
          /* ignore */
        }
        return navigateTo(lp('/reset-password'))
      }
    }
  }

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
      if (import.meta.client) {
        window.location.assign(localePath('/login'))
        return abortNavigation()
      }
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
    // Full page load — client navigations into /login were leaving auth
    // pages with a broken (left-aligned) layout after dashboard/logout.
    if (import.meta.client) {
      const loginPath = localePath('/login')
      const dest = `${loginPath}?redirect=${encodeURIComponent(to.fullPath)}`
      window.location.assign(dest)
      return abortNavigation()
    }
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