<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        :disabled="selectedLength === 0"
        class="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-40"
        :class="
          selectedLength
            ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50'
            : 'bg-gray-100 dark:bg-gray-700/40 text-gray-500 dark:text-gray-400'
        "
        @click="onBulkDelete"
      >
        <Icon icon="mdi:trash-can-outline" class="text-base" />
        Remove
        <span
          v-if="selectedLength"
          class="min-w-[1.15rem] h-4 px-1 rounded-full bg-red-100 dark:bg-red-900/50 text-[10px] leading-4 text-center tabular-nums"
        >
          {{ selectedLength }}
        </span>
      </button>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        @click="$emit('clearFilters')"
      >
        <Icon icon="mdi:filter-off-outline" class="text-base" />
        {{ t('common.clearFilters') }}
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <div class="w-full sm:w-[9.75rem] grow sm:grow-0">
        <slot name="status" />
      </div>
      <div class="w-full sm:w-[9.75rem] grow sm:grow-0">
        <slot name="locale" />
      </div>
      <div class="w-full sm:w-[11rem] grow sm:grow-0">
        <slot name="category" />
      </div>
      <div class="w-full sm:w-[11rem] grow sm:grow-0">
        <slot name="author" />
      </div>
      <div class="w-full sm:min-w-[17rem] sm:flex-1">
        <slot name="date" />
      </div>
    </div>
  </div>
</template>
<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { Icon } from "@iconify/vue";
defineProps({
  selectedLength: { type: Number, required: true },
  hasActiveFilters: { type: Boolean, default: false },
});
const emit = defineEmits(["bulkDelete", "clearFilters"]);
function onBulkDelete() {
  emit("bulkDelete");
}
</script>
