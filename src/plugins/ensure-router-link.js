import { RouterLink } from 'vue-router'

/**
 * NuxtLink depends on a globally registered RouterLink.
 * Some setups (HMR / plugin order) miss that registration during SSR.
 */
export default defineNuxtPlugin({
  name: 'ensure-router-link',
  enforce: 'pre',
  setup(nuxtApp) {
    if (!nuxtApp.vueApp.component('RouterLink')) {
      nuxtApp.vueApp.component('RouterLink', RouterLink)
    }
  },
})
