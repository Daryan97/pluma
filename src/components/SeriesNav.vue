<template>
  <section
    v-if="series && posts.length"
    class="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40 p-5"
  >
    <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
      <Icon icon="mdi:bookshelf" class="text-base text-indigo-500" />
      {{ t("series.label", { name: series.name }) }}
    </h2>
    <ol class="list-none space-y-2 p-0 m-0">
      <li v-for="p in posts" :key="p.id" class="list-none">
        <NuxtLink
          :to="localePath(`/posts/${p.slug}`)"
          class="flex items-center gap-2 text-sm rounded-md px-2 py-1.5 transition"
          :class="
            p.id === currentId
              ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
          "
        >
          <span class="text-[11px] text-gray-400 w-5 shrink-0 tabular-nums">{{ p.series_order ?? "·" }}</span>
          <span class="truncate">{{ p.title }}</span>
        </NuxtLink>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const { t } = useI18n();
const localePath = useLocalePath();

defineProps({
  series: { type: Object, default: null },
  posts: { type: Array, default: () => [] },
  currentId: { type: String, default: null },
});
</script>
