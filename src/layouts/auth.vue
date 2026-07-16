<template>
  <div
    class="relative min-h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 flex flex-col"
  >
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      aria-hidden="true"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"
      />
    </div>
    <main class="flex-1 w-full px-4 py-10 flex items-center justify-center">
      <div class="w-full" style="max-width: 28rem">
        <slot />
      </div>
    </main>
  </div>
</template>
