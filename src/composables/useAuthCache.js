/**
 * Shared auth/install caches for middleware + UI.
 * Avoids re-hitting Supabase on every client navigation.
 */

function normalizeInstallFlag(raw) {
  if (raw === true || raw === 'true' || raw === 1 || raw === '1') return true
  if (raw && typeof raw === 'object' && raw !== null) {
    if (raw.complete === true || raw.complete === 'true') return true
    if (raw.installed === true || raw.installed === 'true') return true
  }
  return false
}

export function useAuthCache() {
  const installDone = useState('pluma-install-done', () => null) // null | boolean
  const installChecked = useState('pluma-install-checked', () => false)
  const sessionUserId = useState('pluma-session-user-id', () => null)
  const sessionChecked = useState('pluma-session-checked', () => false)
  const profileCache = useState('pluma-profile-cache', () => null)
  // { id, username, display_name, role } | null when logged out after check

  async function ensureInstallStatus(supabase, { force = false } = {}) {
    if (!force && installChecked.value && installDone.value !== null) {
      return installDone.value
    }

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'installation')
      .maybeSingle()

    if (error) {
      if (
        /relation .* does not exist|Could not find the table|schema cache/i.test(
          error.message || ''
        )
      ) {
        installDone.value = false
        installChecked.value = true
        return false
      }
      throw error
    }

    installDone.value = !!data && normalizeInstallFlag(data.value)
    installChecked.value = true
    return installDone.value
  }

  async function ensureSession(supabase, { force = false } = {}) {
    if (!force && sessionChecked.value) {
      return sessionUserId.value
        ? { id: sessionUserId.value }
        : null
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()
    const user = session?.user || null
    sessionUserId.value = user?.id || null
    sessionChecked.value = true

    if (!user) {
      profileCache.value = null
    } else if (profileCache.value?.id !== user.id) {
      profileCache.value = null
    }

    return user
  }

  async function ensureProfile(supabase, userId, { force = false } = {}) {
    if (!userId) {
      profileCache.value = null
      return null
    }
    if (
      !force &&
      profileCache.value &&
      profileCache.value.id === userId
    ) {
      return profileCache.value
    }

    const { data: prof, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, role')
      .eq('id', userId)
      .single()

    if (error || !prof) {
      profileCache.value = { id: userId, username: null, display_name: null, role: null }
      return profileCache.value
    }

    profileCache.value = {
      id: userId,
      username: prof.username || null,
      display_name: prof.display_name || null,
      role: prof.role || null,
    }
    return profileCache.value
  }

  function clearAuthCache() {
    sessionUserId.value = null
    sessionChecked.value = false
    profileCache.value = null
  }

  function setInstallDone(done) {
    installDone.value = !!done
    installChecked.value = true
  }

  return {
    installDone,
    installChecked,
    sessionUserId,
    sessionChecked,
    profileCache,
    ensureInstallStatus,
    ensureSession,
    ensureProfile,
    clearAuthCache,
    setInstallDone,
    normalizeInstallFlag,
  }
}
