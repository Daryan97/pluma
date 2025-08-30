<template>
  <footer
    class="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-6 mt-12 text-center"
  >
    <div class="max-w-4xl mx-auto px-4">
      <p>&copy; {{ new Date().getFullYear() }} Pluma. All rights reserved.</p>
      <p class="mt-2 text-sm">
        Built with
        <a
          href="https://vuejs.org"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-900 dark:hover:text-gray-100"
          >Vue.js</a
        >
        &amp;
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-900 dark:hover:text-gray-100"
          >Supabase</a
        >, styled with
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:text-gray-900 dark:hover:text-gray-100"
          >Tailwind CSS</a
        >.
      </p>
    </div>
    <div class="mt-4">
      <span class="text-sm">Follow us on:</span>
      <div class="flex flex-wrap justify-center mt-2 gap-4 max-w-6xl mx-auto">
        <a
          v-for="(link, name) in projectInfo.socialLinks"
          :key="name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <Icon :icon="link.icon" class="w-7 h-7"></Icon>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { projectInfo } from "@/config/projectInfo";
</script>
