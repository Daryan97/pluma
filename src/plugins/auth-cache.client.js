/**
 * Client plugin: keep auth cache in sync with Supabase auth events
 * so middleware can skip network on subsequent navigations.
 *
 * IMPORTANT: never `await` inside onAuthStateChange — it deadlocks with
 * getSession()/getUser() (Supabase JS client).
 *
 * Password recovery often lands on Site URL (/) when redirect_to is not
 * allow-listed. Capture type=recovery from the URL *before* the client
 * consumes the hash, then force navigation to /reset-password.
 */
const RECOVERY_STORAGE_KEY = 'pluma-password-recovery'

function readUrlRecoveryType() {
  if (typeof window === 'undefined') return false
  try {
    const hash = (window.location.hash || '').replace(/^#/, '')
    const search = (window.location.search || '').replace(/^\?/, '')
    const type =
      new URLSearchParams(hash).get('type') ||
      new URLSearchParams(search).get('type')
    return type === 'recovery'
  } catch {
    return false
  }
}

function markRecoveryPending() {
  try {
    if (sessionStorage.getItem('pluma-password-recovery-done') === '1') return
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(RECOVERY_STORAGE_KEY, '1')
  } catch {
    /* private mode */
  }
  useState('password-recovery-pending', () => false).value = true
}

function isRecoveryPending() {
  try {
    if (sessionStorage.getItem('pluma-password-recovery-done') === '1') return false
  } catch {
    /* ignore */
  }
  if (useState('password-recovery-pending', () => false).value) return true
  try {
    return sessionStorage.getItem(RECOVERY_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function clearPasswordRecoveryPending() {
  try {
    sessionStorage.removeItem(RECOVERY_STORAGE_KEY)
  } catch {
    /* ignore */
  }
  try {
    useState('password-recovery-pending', () => false).value = false
  } catch {
    /* outside Nuxt */
  }
}

export default defineNuxtPlugin({
  name: 'auth-cache',
  enforce: 'pre',
  setup() {
    if (!import.meta.client) return

    // Capture recovery hint before createClient/getSession strips the hash.
    if (readUrlRecoveryType()) {
      markRecoveryPending()
    }

    const supabase = useSupabaseClient()
    const auth = useAuthCache()
    const localePath = useLocalePath()
    const router = useRouter()

    function goToResetPassword() {
      try {
        if (sessionStorage.getItem('pluma-password-recovery-done') === '1') return
      } catch {
        /* ignore */
      }
      markRecoveryPending()
      const target = localePath('/reset-password')
      setTimeout(() => {
        const path = router.currentRoute.value?.path || ''
        if (!path.includes('reset-password')) {
          navigateTo(target)
        }
      }, 0)
    }

    if (isRecoveryPending()) {
      goToResetPassword()
    }

    // Defer warm so we don't race the first getSession from middleware/nav.
    queueMicrotask(() => {
      auth.ensureSession(supabase).catch(() => {})
    })

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        auth.clearAuthCache()
        clearPasswordRecoveryPending()
        return
      }

      if (event === 'PASSWORD_RECOVERY') {
        auth.sessionUserId.value = session?.user?.id || null
        auth.sessionChecked.value = true
        goToResetPassword()
        return
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED' ||
        event === 'INITIAL_SESSION'
      ) {
        // Recovery may only emit SIGNED_IN (esp. if hash is cleared mid-flight).
        if (
          event === 'SIGNED_IN' ||
          event === 'INITIAL_SESSION'
        ) {
          if (readUrlRecoveryType() || isRecoveryPending()) {
            auth.sessionUserId.value = session?.user?.id || null
            auth.sessionChecked.value = true
            goToResetPassword()
            return
          }
        }

        const user = session?.user || null
        auth.sessionUserId.value = user?.id || null
        auth.sessionChecked.value = true
        if (!user?.id) {
          auth.profileCache.value = null
          return
        }
        const userId = user.id
        setTimeout(() => {
          auth.ensureProfile(supabase, userId, { force: true }).catch(() => {})
        }, 0)
      }
    })

    const nuxtApp = useNuxtApp()
    nuxtApp.hook('page:finish', () => {
      if (!auth.installChecked.value) {
        auth.ensureInstallStatus(supabase).catch(() => {})
      }
      // Hash may appear after first paint on some navigations.
      if (readUrlRecoveryType() || isRecoveryPending()) {
        goToResetPassword()
      }
    })
  },
})
