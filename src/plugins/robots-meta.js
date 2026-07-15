import { robotsForClientPath } from '@/lib/seoMeta'

/**
 * Ensure noindex routes always emit robots meta (even without page-level SEO).
 */
export default defineNuxtPlugin(() => {
  const route = useRoute()

  useHead(() => ({
    meta: [
      {
        name: 'robots',
        content: robotsForClientPath(String(route.path || '/')),
        key: 'robots',
      },
      {
        name: 'googlebot',
        content: robotsForClientPath(String(route.path || '/')),
        key: 'googlebot',
      },
    ],
  }))
})
