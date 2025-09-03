<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <div class="relative w-full sm:w-80">
        <input v-model="search" type="text" placeholder="Search pending comments..." class="w-full h-9 px-3 pl-10 rounded-md text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400" @input="onInput" />
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 text-lg" />
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-x-auto">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h2 class="text-sm font-semibold tracking-wide flex items-center gap-2 text-gray-900 dark:text-white">
          <Icon icon="mdi:comment-alert-outline" class="text-yellow-500 text-base" />
          Pending Comments <span class="text-[11px] font-normal text-gray-500 dark:text-gray-400">({{ pendingCount }})</span>
        </h2>
        <button @click="refresh" class="inline-flex items-center gap-1 h-8 px-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[11px] font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50">
          <Icon icon="mdi:refresh" class="text-sm" /> Refresh
        </button>
      </div>
      <table class="min-w-[800px] w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
          <tr>
            <th class="px-4 py-2 text-left">Comment</th>
            <th class="px-4 py-2 text-left">User</th>
            <th class="px-4 py-2 text-left">Post</th>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Loading pending comments...</td>
          </tr>
          <tr v-else-if="comments.length===0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No pending comments.</td>
          </tr>
          <tr v-for="c in comments" :key="c.id" class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td class="px-4 py-2 align-top max-w-xs"><div class="text-gray-800 dark:text-gray-100 whitespace-pre-line break-words">{{ c.content }}</div></td>
            <td class="px-4 py-2 align-top"><div class="text-gray-700 dark:text-gray-200">{{ c.author?.display_name || c.author?.username || 'Unknown' }}</div></td>
            <td class="px-4 py-2 align-top"><router-link :to="`/posts/${c.post?.slug}`" class="text-blue-600 dark:text-blue-400 hover:underline">{{ c.post?.title || 'Post' }}</router-link></td>
            <td class="px-4 py-2 align-top text-gray-500 dark:text-gray-400">{{ formatDate(c.created_at) }}</td>
            <td class="px-4 py-2 align-top">
              <div class="flex justify-end gap-2">
                <button @click="$emit('approve', c.id)" class="inline-flex items-center gap-1 h-8 px-2 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[11px] font-medium hover:bg-green-200 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"><Icon icon="mdi:check" class="text-sm" />Approve</button>
                <button @click="$emit('delete', c.id)" class="inline-flex items-center gap-1 h-8 px-2 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-[11px] font-medium hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-400/50"><Icon icon="mdi:delete" class="text-sm" />Remove</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
        <button class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700" :disabled="page===1 || loading" @click="$emit('change-page', page-1)">Prev</button>
        <span>Page {{ page }} / {{ totalPages }}</span>
        <button class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700" :disabled="page===totalPages || loading" @click="$emit('change-page', page+1)">Next</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({
  comments: Array,
  page: Number,
  totalPages: Number,
  loading: Boolean,
  pendingCount: Number
})
const emit = defineEmits(['refresh','search','change-page','approve','delete'])
const search = defineModel('search')
function onInput(){ emit('search', search.value) }
function refresh(){ emit('refresh') }
function formatDate(dateStr){ const d=new Date(dateStr); return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}) }
</script>
