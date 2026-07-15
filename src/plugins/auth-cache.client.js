/**
 * Client plugin: keep auth cache in sync with Supabase auth events
 * so middleware can skip network on subsequent navigations.
 *
 * IMPORTANT: never `await` inside onAuthStateChange — it deadlocks with
 * getSession()/getUser() (Supabase JS client).
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return

  const supabase = useSupabaseClient()
  const auth = useAuthCache()

  // Defer warm so we don't race the first getSession from middleware/nav.
  queueMicrotask(() => {
    auth.ensureSession(supabase).catch(() => {})
  })

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      auth.clearAuthCache()
      return
    }
    if (
      event === 'SIGNED_IN' ||
      event === 'TOKEN_REFRESHED' ||
      event === 'USER_UPDATED' ||
      event === 'INITIAL_SESSION'
    ) {
      const user = session?.user || null
      auth.sessionUserId.value = user?.id || null
      auth.sessionChecked.value = true
      if (!user?.id) {
        auth.profileCache.value = null
        return
      }
      // Schedule outside the auth lock to avoid getSession deadlocks.
      const userId = user.id
      setTimeout(() => {
        auth.ensureProfile(supabase, userId, { force: true }).catch(() => {})
      }, 0)
    }
  })

  nuxtApp.hook('page:finish', () => {
    if (!auth.installChecked.value) {
      auth.ensureInstallStatus(supabase).catch(() => {})
    }
  })
})
