<template>
  <div class="space-y-4">
    <div class="flex justify-end">
      <div class="w-full sm:w-80 mb-4">
        <div
          class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition"
        >
          <Icon
            icon="mdi:magnify"
            class="ml-3 text-gray-500 dark:text-gray-300 text-base"
          />
          <input
            v-model="search"
            type="text"
            placeholder="Search comments..."
            class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
            @input="onInput"
          />
        </div>
      </div>
    </div>
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-x-auto"
    >
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700"
      >
        <div class="flex items-center gap-6">
          <h2
            class="text-sm font-semibold tracking-wide flex items-center gap-2 text-gray-900 dark:text-white"
          >
            <Icon
              icon="mdi:comment-outline"
              class="text-blue-500 dark:text-blue-400 text-base"
            />
            Comments
            <span class="text-[11px] font-normal text-gray-500 dark:text-gray-400"
              >({{ totalCount }})</span
            >
          </h2>
          <div class="flex items-center gap-1">
            <button
              v-for="f in filters"
              :key="f.value"
              @click="changeFilter(f.value)"
              class="inline-flex items-center gap-1 h-7 px-3 rounded-full text-[11px] font-medium border transition"
              :class="filter === f.value
                ? 'bg-blue-600 text-white border-blue-600 dark:border-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'"
              :aria-pressed="filter === f.value"
            >
              {{ f.label }}
              <span v-if="f.value==='pending' && pendingCount>0" class="ml-1 text-[10px] px-1 rounded bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300">{{ pendingCount }}</span>
            </button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="refresh"
            class="inline-flex items-center gap-1 h-8 px-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[11px] font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <Icon icon="mdi:refresh" class="text-sm" /> Refresh
          </button>
        </div>
      </div>
      <table class="min-w-[800px] w-full text-sm">
        <thead
          class="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
        >
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
            <td
              colspan="5"
              class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
            >
        Loading comments...
            </td>
          </tr>
          <tr v-else-if="comments.length === 0">
            <td
              colspan="5"
              class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
            >
        No comments found.
            </td>
          </tr>
          <tr
            v-for="c in comments"
            :key="c.id"
            class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td class="px-4 py-2 align-top max-w-xs">
              <div
                class="text-gray-800 dark:text-gray-100 whitespace-pre-line break-words"
              >
                {{ c.content }}
              </div>
            </td>
            <td class="px-4 py-2 align-top">
              <div class="text-gray-700 dark:text-gray-200">
                <template v-if="c.author">
                  <span class="font-medium">{{ c.author.username || 'user' }}</span>
                  <span v-if="c.author.display_name && c.author.display_name !== c.author.username" class="text-gray-500 dark:text-gray-400 ml-1">({{ c.author.display_name }})</span>
                </template>
                <template v-else>Unknown</template>
              </div>
            </td>
            <td class="px-4 py-2 align-top">
              <router-link
                :to="`/posts/${c.post?.slug}`"
                class="text-blue-600 dark:text-blue-400 hover:underline"
                >{{ c.post?.title || "Post" }}</router-link
              >
            </td>
            <td class="px-4 py-2 align-top text-gray-500 dark:text-gray-400">
              {{ formatDate(c.created_at) }}
            </td>
            <td class="px-4 py-2 align-top">
              <div class="flex justify-end gap-2">
                <template v-if="!c.approved">
                  <button
                    @click="$emit('approve', c.id)"
                    class="inline-flex items-center gap-1 h-8 px-2 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[11px] font-medium hover:bg-green-200 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  >
                    <Icon icon="mdi:check" class="text-sm" />Approve
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="$emit('unapprove', c.id)"
                    class="inline-flex items-center gap-1 h-8 px-2 rounded bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-[11px] font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/60 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <Icon icon="mdi:undo" class="text-sm" />Unapprove
                  </button>
                </template>
                <button
                  @click="$emit('delete', c.id)"
                  class="inline-flex items-center gap-1 h-8 px-2 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-[11px] font-medium hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                >
                  <Icon icon="mdi:delete" class="text-sm" />Remove
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-3 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300"
      >
        <button
          class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
          :disabled="page === 1 || loading"
          @click="$emit('change-page', page - 1)"
        >
          Prev
        </button>
        <span>Page {{ page }} / {{ totalPages }}</span>
        <button
          class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
          :disabled="page === totalPages || loading"
          @click="$emit('change-page', page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { computed } from 'vue';
const props = defineProps({
  comments: Array,
  page: Number,
  totalPages: Number,
  loading: Boolean,
  pendingCount: Number,
  totalCount: Number,
  filter: { type: String, default: 'all' }
});
const emit = defineEmits([
  'refresh','search','change-page','approve','unapprove','delete','change-filter'
]);
const search = defineModel('search');
const filters = [
  { value: 'all', label: 'All' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' }
];
function changeFilter(val){ if(val!==props.filter) emit('change-filter', val); }
function onInput(){ emit('search', search.value); }
function refresh(){ emit('refresh'); }
function formatDate(dateStr){ const d=new Date(dateStr); return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}); }
</script>
