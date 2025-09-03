<template>
  <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between w-full">
    <div class="flex-shrink-0">
      <button
        @click="onBulkDelete"
        :disabled="selectedLength === 0"
        class="inline-flex items-center gap-1 h-9 px-3 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-400/60"
      >
        <Icon icon="mdi:trash-can-outline" class="text-sm" />
        Remove Selected ({{ selectedLength }})
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
      <div class="w-full sm:col-span-1">
        <slot name="status" />
      </div>
      <div class="w-full">
        <slot name="category" />
      </div>
      <div class="w-full">
        <slot name="author" />
      </div>
      <div class="col-span-1 sm:col-span-2 xl:col-span-2">
        <slot name="date" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({ selectedLength: { type: Number, required: true } })
const emit = defineEmits(['bulkDelete'])
function onBulkDelete(){ emit('bulkDelete') }
</script>
