/**
 * Do not force UI locale from branding.primaryLocale.
 * primaryLocale is for content defaults; the UI default is Nuxt `defaultLocale` (en).
 * Preference is only via `pluma_locale` cookie (set by LocaleSwitcher / i18n).
 *
 * Kept as a no-op so older deploys that expected this middleware still load cleanly.
 * useState key remains shared with LocaleSwitcher for enabled-locale list if set elsewhere.
 */
export default defineNuxtRouteMiddleware(() => {});
