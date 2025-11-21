<template>
  <div
    class="relative flex flex-col items-center justify-center w-full h-full select-none overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-950 text-gray-500 dark:text-gray-300"
    aria-hidden="true"
  >
    <div
      class="pointer-events-none absolute -top-12 -right-10 w-48 h-48 rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-2xl"
    />
    <div
      class="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-indigo-200/30 dark:bg-indigo-600/10 blur-2xl"
    />
    <div
      class="relative z-10 flex flex-col items-center gap-3"
      v-if="plain !== true"
    >
      <div
        class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/70 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <Icon
          icon="mdi:image-off"
          class="text-3xl text-blue-500 dark:text-blue-400"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  plain: {
    type: Boolean,
    default: false,
  },
});
</script>
