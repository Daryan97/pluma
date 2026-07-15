import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

function readStoredTheme() {
  if (!import.meta.client) return null
  try {
    const fromDom = document.documentElement.getAttribute('data-theme')
    if (fromDom === 'light' || fromDom === 'dark') return fromDom
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function applyTheme(val) {
  if (!import.meta.client) return
  document.documentElement.setAttribute('data-theme', val)
  document.body?.setAttribute('data-theme', val)
  document.documentElement.style.colorScheme = val
}

export const useThemeStore = defineStore('theme', () => {
  // Cookie so SSR can match the client's preference (avoids light→dark flash + Pinia overwrite)
  const themeCookie = useCookie('pluma_theme', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    default: () => '',
  })

  const initial =
    themeCookie.value === 'dark' || themeCookie.value === 'light'
      ? themeCookie.value
      : import.meta.client
        ? readStoredTheme() || 'light'
        : 'light'

  const theme = ref(initial)

  // Skip writing until the store finished preferring localStorage over SSR 'light'
  let hydrated = false

  function persist(val) {
    themeCookie.value = val
    if (import.meta.client) {
      try {
        localStorage.setItem('theme', val)
      } catch {
        /* ignore */
      }
      applyTheme(val)
    }
  }

  watch(theme, (val) => {
    if (!import.meta.client) return
    if (!hydrated) return
    if (val !== 'light' && val !== 'dark') return
    persist(val)
  })

  /** Call once on the client after Pinia hydrates from the SSR payload. */
  function syncFromClientStorage() {
    const stored = readStoredTheme()
    hydrated = true
    if (stored && stored !== theme.value) {
      theme.value = stored
    }
    persist(theme.value)
  }

  function toggleTheme() {
    hydrated = true
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  if (import.meta.client) {
    // First paint already applied via app.html — keep DOM in sync with ref
    applyTheme(theme.value)
  }

  return { theme, toggleTheme, syncFromClientStorage }
})
