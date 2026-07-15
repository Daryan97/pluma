/**
 * After Pinia rehydrates SSR state (theme: "light"), restore the real
 * preference from localStorage / the early boot script so reloads keep dark mode.
 */
export default defineNuxtPlugin({
  name: 'theme-sync',
  enforce: 'post',
  setup() {
    const store = useThemeStore()
    store.syncFromClientStorage()
  },
})
