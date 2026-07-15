<template>
  <transition name="route-loading-overlay">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-3 text-gray-700 dark:text-gray-200">
        <span class="loader" aria-hidden="true"></span>
        <p class="text-sm font-medium tracking-wide">{{ t('common.loading') }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { storeToRefs } from 'pinia'
import { useRouteLoadingStore } from '@/stores/routeLoadingStore'

const { isLoading } = storeToRefs(useRouteLoadingStore())
</script>

<style scoped>
.loader {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgba(59, 130, 246, 0.25);
  border-top-color: #3b82f6;
  border-radius: 9999px;
  animation: route-spin 0.75s linear infinite;
}

@keyframes route-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.route-loading-overlay-enter-from,
.route-loading-overlay-leave-to {
  opacity: 0;
}

.route-loading-overlay-enter-active,
.route-loading-overlay-leave-active {
  transition: opacity 0.18s ease;
}
</style>
