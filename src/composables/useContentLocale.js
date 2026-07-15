import { CONTENT_LOCALES } from '@/config/contentLocales'
import { useBranding, isLocaleEnabled } from '@/stores/brandingStore'

export { CONTENT_LOCALES }

/** Content locale for posts/categories — mirrors UI locale by default. */
export function useContentLocale() {
  const { locale } = useI18n()
  const branding = useBranding()

  const enabledContentLocales = computed(() => {
    const enabled = branding.enabledLocales?.value
    if (!Array.isArray(enabled) || !enabled.length) return CONTENT_LOCALES
    return CONTENT_LOCALES.filter((l) => enabled.includes(l.code))
  })

  const contentLocale = computed(() => {
    const ui = locale.value || 'en'
    if (isLocaleEnabled(ui)) return ui
    return branding.primaryLocale?.value || 'en'
  })

  function withLocale(queryBuilder) {
    return queryBuilder.eq('locale', contentLocale.value)
  }

  return {
    contentLocale,
    locales: enabledContentLocales,
    withLocale,
  }
}
