<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
  >
    <div class="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shrink-0"
          >
            <Icon icon="mdi:post-outline" class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <h2
              class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase"
            >
              {{ t("posts.title") }}
            </h2>
            <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
              {{ t("posts.onThisPage", { count: posts.length }) }}
              <span v-if="selected.length" class="text-blue-600 dark:text-blue-400">
                · {{ t("posts.selected", { count: selected.length }) }}
              </span>
            </p>
          </div>
        </div>
        <div
          v-if="posts.length"
          class="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer select-none"
          role="button"
          tabindex="0"
          @click="emitToggleAll"
          @keydown.enter.prevent="emitToggleAll"
          @keydown.space.prevent="emitToggleAll"
        >
          <Checkbox
            :checked="allSelected"
            :indeterminate="someSelected"
            class="pointer-events-none"
            aria-label="Select all posts"
            tabindex="-1"
          />
          {{ t("posts.selectAll") }}
        </div>
      </div>
      <slot name="filters" />
    </div>

    <div v-if="!posts.length" class="px-6 py-16 text-center">
      <Icon
        icon="mdi:file-document-outline"
        class="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3"
      />
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('posts.noPosts') }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ t('posts.adjustFilters') }}
      </p>
    </div>

    <ul v-else class="divide-y divide-gray-100 dark:divide-gray-700/80">
      <li
        v-for="post in posts"
        :key="post.id"
        class="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"
      >
        <div class="flex items-start gap-3 min-w-0 flex-1">
          <input
            type="checkbox"
            :value="post.id"
            v-model="selectedProxy"
            class="mt-1"
            :aria-label="`Select ${post.title}`"
          />
          <div class="min-w-0 flex-1">
            <router-link
              :to="`/posts/${post.slug}`"
              class="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition-colors"
            >
              {{ post.title }}
            </router-link>
            <div
              class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400"
            >
              <router-link
                :to="`/category/${post.category?.slug || 'uncategorized'}`"
                class="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Icon icon="mdi:folder-outline" class="text-sm" />
                {{ post.category?.name || t('common.uncategorized') }}
              </router-link>
              <span class="text-gray-300 dark:text-gray-600">·</span>
              <router-link
                v-if="post.author?.username"
                :to="`/author/${post.author.username}`"
                class="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span
                  class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 text-[9px] font-semibold text-gray-600 dark:text-gray-200"
                >
                  {{ initials(post.author?.display_name || post.author?.username) }}
                </span>
                {{ post.author?.display_name || post.author?.username }}
              </router-link>
              <span class="text-gray-300 dark:text-gray-600">·</span>
              <span class="inline-flex items-center gap-1">
                <Icon icon="mdi:calendar-outline" class="text-sm" />
                {{ formatDate(post.created_at) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 sm:pl-2 sm:shrink-0">
          <div
            v-if="postLocales(post).length"
            class="flex flex-wrap items-center gap-1"
          >
            <span
              v-for="code in postLocales(post)"
              :key="`${post.id}-${code}`"
              class="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-medium uppercase tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              :title="localeLabel(code)"
            >
              <Icon icon="mdi:translate" class="text-sm" />
              {{ code }}
            </span>
          </div>
          <span
            class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium capitalize"
            :class="statusClasses(post.status)"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="dotClasses(post.status)" />
            {{ t(`posts.status.${post.status}`, post.status) }}
          </span>
          <div
            v-if="canManage(post)"
            class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity"
          >
            <button
              type="button"
              class="inline-flex items-center justify-center h-8 w-8 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :title="t('common.edit')"
              @click="emitEdit(post.id)"
            >
              <Icon icon="mdi:pencil-outline" class="text-lg" />
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              :title="t('common.remove')"
              @click="emitDelete(post.id)"
            >
              <Icon icon="mdi:delete-outline" class="text-lg" />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import Checkbox from "@/components/ui/Checkbox.vue";

const { t, locales } = useI18n();
const props = defineProps({
  posts: { type: Array, required: true },
  selected: { type: Array, required: true },
  currentUser: String,
  role: String,
});
const emit = defineEmits(["toggleAll", "delete", "edit", "update:selected"]);

const selectedProxy = computed({
  get: () => props.selected,
  set: (val) => emit("update:selected", val),
});
const allSelected = computed(
  () => selectedProxy.value.length === props.posts.length && props.posts.length > 0
);
const someSelected = computed(
  () => selectedProxy.value.length > 0 && !allSelected.value
);

function canManage(post) {
  return post.author?.username === props.currentUser || props.role === "admin";
}
function emitToggleAll() {
  emit("toggleAll");
}
function emitDelete(id) {
  emit("delete", id);
}
function emitEdit(id) {
  emit("edit", id);
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
function localeLabel(code) {
  const list = unref(locales) || [];
  const hit = list.find((l) => l.code === code);
  return hit?.name || code;
}
function postLocales(post) {
  if (Array.isArray(post?.locales) && post.locales.length) {
    return post.locales;
  }
  return post?.locale ? [post.locale] : [];
}
function statusClasses(status) {
  return (
    {
      published:
        "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      draft:
        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      archived:
        "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300",
    }[status] || "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
  );
}
function dotClasses(status) {
  return (
    {
      published: "bg-green-500",
      draft: "bg-amber-500",
      archived: "bg-gray-400 dark:bg-gray-500",
    }[status] || "bg-gray-400"
  );
}
</script>
