<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700"
  >
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div
        class="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2"
      >
        <h2
          class="text-sm font-semibold tracking-wide text-gray-900 dark:text-white flex items-center gap-2"
        >
          <Icon icon="mdi:post-outline" class="text-blue-500 text-base" />
          Posts
        </h2>
      </div>
      <slot name="filters" />
    </div>
    <div class="rounded-b-2xl overflow-x-auto">
      <table
        class="min-w-[900px] w-full text-sm text-left border-separate border-spacing-0"
      >
        <thead
          class="sticky top-0 z-10 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-gray-50/70 dark:supports-[backdrop-filter]:bg-gray-900/70 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          <tr>
            <th class="w-10 px-4 py-3 first:rounded-tl-2xl">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="emitToggleAll"
                class="accent-blue-600 w-4 h-4"
              />
            </th>
            <th class="px-4 py-3 font-medium">Title</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Author</th>
            <th class="px-4 py-3 font-medium whitespace-nowrap">Created</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium text-right last:rounded-tr-2xl">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr
            v-for="post in posts"
            :key="post.id"
            class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td class="px-4 py-3 align-top">
              <input
                type="checkbox"
                :value="post.id"
                v-model="selectedProxy"
                class="accent-blue-600 w-4 h-4 mt-0.5"
              />
            </td>
            <td
              class="px-4 py-3 font-medium text-gray-800 dark:text-gray-100 max-w-xs"
            >
              <router-link
                :to="`/posts/${post.slug}`"
                class="hover:underline line-clamp-2"
                >{{ post.title }}</router-link
              >
            </td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
              <router-link
                :to="`/category/${post.category?.slug || 'uncategorized'}`"
                class="hover:underline"
                >{{ post.category?.name || "Uncategorized" }}</router-link
              >
            </td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
              <router-link
                :to="`/author/${post.author?.username}`"
                class="hover:underline"
                >{{
                  post.author?.display_name || post.author?.username
                }}</router-link
              >
            </td>
            <td
              class="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap"
            >
              {{ formatDate(post.created_at) }}
            </td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ring-1 ring-inset"
                :class="statusClasses(post.status)"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="dotClasses(post.status)"
                ></span>
                {{ post.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div
                class="flex flex-wrap justify-end gap-2"
                v-if="post.author?.username === currentUser || role === 'admin'"
              >
                <button
                  @click="emitDelete(post.id)"
                  class="inline-flex items-center gap-1 h-8 px-2 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-[11px] font-medium hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                >
                  <Icon icon="mdi:delete-outline" class="text-sm" />Remove
                </button>
                <button
                  @click="emitEdit(post.id)"
                  class="inline-flex items-center gap-1 h-8 px-2 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  <Icon icon="mdi:pencil-outline" class="text-sm" />Edit
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="posts.length === 0">
            <td
              colspan="7"
              class="text-center py-6 text-gray-500 dark:text-gray-400"
            >
              No posts found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { computed } from "vue";
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
  () =>
    selectedProxy.value.length === props.posts.length && props.posts.length > 0
);
function emitToggleAll() {
  emit("toggleAll");
}
function emitDelete(id) {
  emit("delete", id);
}
function emitEdit(id) {
  emit("edit", id);
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function statusClasses(status) {
  return (
    {
      published:
        "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300",
      draft:
        "bg-yellow-50 text-yellow-700 ring-yellow-600/30 dark:bg-yellow-900/30 dark:text-yellow-300",
      archived:
        "bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-700/40 dark:text-gray-300",
    }[status] || ""
  );
}
function dotClasses(status) {
  return (
    {
      published: "bg-green-500",
      draft: "bg-yellow-500",
      archived: "bg-gray-400 dark:bg-gray-500",
    }[status] || ""
  );
}
</script>
