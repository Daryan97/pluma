<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
  >
    <div class="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shrink-0"
          >
            <Icon icon="mdi:comment-multiple-outline" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <h2
              class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"
            >
              {{ t('comments.title') }}
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
              {{ t('comments.total', { count: totalCount }) }}
              <span v-if="pendingCount" class="text-amber-600 dark:text-amber-400">
                · {{ t('comments.pendingCount', { count: pendingCount }) }}
              </span>
            </p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <div
            class="flex items-center h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 p-0.5"
            role="tablist"
          >
            <button
              v-for="f in filters"
              :key="f.value"
              type="button"
              role="tab"
              :aria-selected="filter === f.value"
              class="inline-flex items-center gap-1 h-8 px-3 rounded text-[11px] font-medium transition"
              :class="
                filter === f.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60'
              "
              @click="changeFilter(f.value)"
            >
              {{ f.label }}
              <span
                v-if="f.value === 'pending' && pendingCount > 0"
                class="ms-0.5 min-w-[1.1rem] h-4 px-1 rounded-full text-[10px] leading-4 text-center"
                :class="
                  filter === f.value
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                "
              >
                {{ pendingCount }}
              </span>
            </button>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            :title="t('common.refresh')"
            @click="refresh"
          >
            <Icon icon="mdi:refresh" class="text-lg" />
          </button>
        </div>
      </div>

      <div
        class="flex items-center h-9 w-full sm:max-w-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 focus-within:ring-2 focus-within:ring-blue-500"
      >
        <Icon icon="mdi:magnify" class="ms-3 text-gray-400 text-base shrink-0" />
        <input
          v-model="search"
          type="text"
          :placeholder="t('comments.searchPlaceholder')"
          class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
          @input="onInput"
        />
      </div>
    </div>

    <div v-if="loading" class="px-6 py-16 text-center">
      <Icon icon="mdi:loading" class="mx-auto animate-spin text-3xl text-blue-500 mb-3" />
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('comments.loading') }}</p>
    </div>

    <div v-else-if="!comments.length" class="px-6 py-16 text-center">
      <Icon
        icon="mdi:comment-off-outline"
        class="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3"
      />
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('comments.empty') }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ t('comments.nothingMatches') }}
      </p>
    </div>

    <ul v-else class="divide-y divide-gray-100 dark:divide-gray-700/80">
      <li
        v-for="c in comments"
        :key="c.id"
        class="group flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"
      >
        <div class="min-w-0 flex-1 space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-semibold uppercase tracking-wide"
              :class="
                c.approved
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
              "
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="c.approved ? 'bg-green-500' : 'bg-amber-500'"
              />
              {{ c.approved ? t('comments.approved') : t('comments.pendingLabel') }}
            </span>
            <span class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ formatDate(c.created_at) }}
            </span>
          </div>
          <p
            class="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-line break-words leading-relaxed"
          >
            {{ c.content }}
          </p>
          <div
            class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400"
          >
            <span class="inline-flex items-center gap-1.5">
              <span
                class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 text-[10px] font-semibold text-gray-600 dark:text-gray-200"
              >
                {{ initials(c.author?.display_name || c.author?.username) }}
              </span>
              {{
                c.author
                  ? c.author.display_name || c.author.username || t('comments.userFallback')
                  : t('common.unknown')
              }}
            </span>
            <span class="text-gray-300 dark:text-gray-600">·</span>
            <router-link
              :to="localePath(`/posts/${c.post?.slug}`)"
              class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[16rem]"
            >
              <Icon icon="mdi:file-document-outline" class="text-sm shrink-0" />
              {{ c.post?.title || t('posts.post') }}
            </router-link>
          </div>
        </div>

        <div
          class="flex items-center gap-1 lg:shrink-0 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100 transition-opacity"
        >
          <button
            v-if="!c.approved"
            type="button"
            class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            @click="$emit('approve', c.id)"
          >
            <Icon icon="mdi:check" class="text-base" />
            {{ t('comments.approve') }}
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            @click="$emit('unapprove', c.id)"
          >
            <Icon icon="mdi:undo" class="text-base" />
            {{ t('comments.unapprove') }}
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            :title="t('common.remove')"
            @click="$emit('delete', c.id)"
          >
            <Icon icon="mdi:delete-outline" class="text-lg" />
          </button>
        </div>
      </li>
    </ul>

    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300"
    >
      <button
        type="button"
        class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        :disabled="page === 1 || loading"
        @click="$emit('change-page', page - 1)"
      >
        <Icon icon="mdi:chevron-left" class="text-base" />
        {{ t('common.prev') }}
      </button>
      <span class="font-medium tabular-nums">{{ t('common.page', { current: page, total: totalPages }) }}</span>
      <button
        type="button"
        class="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        :disabled="page === totalPages || loading"
        @click="$emit('change-page', page + 1)"
      >
        {{ t('common.next') }}
        <Icon icon="mdi:chevron-right" class="text-base" />
      </button>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  comments: Array,
  page: Number,
  totalPages: Number,
  loading: Boolean,
  pendingCount: Number,
  totalCount: Number,
  filter: { type: String, default: "all" },
});
const emit = defineEmits([
  "refresh",
  "search",
  "change-page",
  "approve",
  "unapprove",
  "delete",
  "change-filter",
]);
const search = defineModel("search");
const filters = computed(() => [
  { value: "all", label: t("comments.all") },
  { value: "approved", label: t("comments.approved") },
  { value: "pending", label: t("comments.pendingLabel") },
]);

function changeFilter(val) {
  if (val !== props.filter) emit("change-filter", val);
}
function onInput() {
  emit("search", search.value);
}
function refresh() {
  emit("refresh");
}
function initials(name) {
  const s = String(name || "?").trim();
  return (s.charAt(0) || "?").toUpperCase();
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

