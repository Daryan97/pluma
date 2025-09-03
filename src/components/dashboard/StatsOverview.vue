<template>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    <div
      v-for="m in metrics"
      :key="m.key"
      class="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 flex flex-col"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-gray-500 dark:text-gray-400 text-[13px] font-medium">{{ m.label }}</p>
        </div>
        <Icon :icon="m.icon" :class="m.iconClass + ' text-xl'" />
      </div>
      <div class="mt-3 flex items-end gap-2">
        <h2 :class="'text-3xl font-semibold ' + m.valueClass">{{ formatNumber(m.value) }}</h2>
        <span v-if="m.sublabel" class="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">{{ m.sublabel }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

function formatNumber(val){
  if(val === null || val === undefined) return '0'
  if(val > 999) return Intl.NumberFormat('en',{ notation:'compact' }).format(val)
  return val
}

const metrics = computed(()=>[
  { key:'totalPosts', label:'Total Posts', value: props.stats.totalPosts || 0, icon:'mdi:note-multiple-outline', iconClass:'text-blue-500 dark:text-blue-400', valueClass:'text-blue-600 dark:text-blue-400' },
  { key:'publishedPosts', label:'Published', value: props.stats.publishedPosts || 0, icon:'mdi:check-circle-outline', iconClass:'text-green-500 dark:text-green-400', valueClass:'text-green-600 dark:text-green-400' },
  { key:'draftPosts', label:'Drafts', value: props.stats.draftPosts || 0, icon:'mdi:file-document-edit-outline', iconClass:'text-purple-500 dark:text-purple-400', valueClass:'text-purple-600 dark:text-purple-400' },
  { key:'pendingComments', label:'Pending Comments', value: props.stats.pendingComments || 0, icon:'mdi:comment-alert-outline', iconClass:'text-yellow-500 dark:text-yellow-400', valueClass:'text-yellow-500 dark:text-yellow-400' },
  { key:'categories', label:'Categories', value: props.stats.categories || 0, icon:'mdi:folder-outline', iconClass:'text-indigo-500 dark:text-indigo-400', valueClass:'text-indigo-600 dark:text-indigo-400' },
  { key:'authors', label:'Authors', value: props.stats.authors || 0, icon:'mdi:account-edit-outline', iconClass:'text-cyan-500 dark:text-cyan-400', valueClass:'text-cyan-600 dark:text-cyan-400' },
  { key:'members', label:'Members', value: props.stats.members || 0, icon:'mdi:account-multiple-outline', iconClass:'text-teal-500 dark:text-teal-400', valueClass:'text-teal-600 dark:text-teal-400' },
])
</script>
