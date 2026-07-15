import Toast, { POSITION, useToast } from 'vue-toastification'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
  })

  return {
    provide: {
      toast: useToast(),
    },
  }
})
