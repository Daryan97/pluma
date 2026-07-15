<template>
  <div class="animate-pulse space-y-6" aria-busy="true" aria-live="polite">
    <div class="flex items-start justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <div class="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div class="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
      <div class="h-9 w-32 rounded-md bg-gray-200 dark:bg-gray-700" />
    </div>

    <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-0 overflow-x-auto">
      <div
        v-for="n in 6"
        :key="n"
        class="h-11 w-24 shrink-0 rounded-t-md bg-gray-200 dark:bg-gray-700/70"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="n in 4"
        :key="'stat-' + n"
        class="rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-3"
      >
        <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <div
      class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div class="h-12 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 flex items-center gap-4">
        <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div
        v-for="n in 5"
        :key="'row-' + n"
        class="h-14 border-b border-gray-100 dark:border-gray-800 px-4 flex items-center gap-4"
      >
        <div class="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="ms-auto h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <span class="sr-only">{{ t('dashboard.gathering') }}</span>
  </div>
</template>

<script setup>
const { t } = useI18n()
</script>
