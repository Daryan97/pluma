import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouteLoadingStore = defineStore('routeLoading', () => {
  const isLoading = ref(false)
  let hideTimeout = null

  function start() {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
    isLoading.value = true
  }

  function stop() {
    hideTimeout = setTimeout(() => {
      isLoading.value = false
      hideTimeout = null
    }, 180)
  }

  return {
    isLoading,
    start,
    stop,
  }
})
