/** Content / UI locale catalog — keep in sync with nuxt.config i18n.locales. */
export const CONTENT_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'ku', name: 'کوردی' },
  { code: 'ar', name: 'العربية' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

export function allConfiguredLocaleCodes() {
  return CONTENT_LOCALES.map((l) => l.code);
}
