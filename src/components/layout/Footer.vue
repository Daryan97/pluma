<template>
  <footer
    class="relative mt-20 border-t border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <div
      class="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"
    ></div>
    <div
      class="absolute inset-0 z-0 bg-white/40 dark:bg-gray-900/55 backdrop-blur-md supports-[backdrop-filter]:bg-white/25 supports-[backdrop-filter]:dark:bg-gray-900/45"
    ></div>
    <div
      class="pointer-events-none absolute -top-16 -right-24 w-72 h-72 rounded-full bg-blue-200/35 blur-3xl mix-blend-multiply dark:hidden"
    ></div>
    <div
      class="pointer-events-none absolute -bottom-24 -left-32 w-80 h-80 rounded-full bg-indigo-200/40 blur-3xl mix-blend-multiply dark:hidden"
    ></div>
    <div class="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <h2
            class="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"
          >
            <Icon icon="mdi:feather" class="text-blue-500" /> {{ siteTitle }}
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-sm">
            {{ branding.siteDescription.value || projectInfo.description }}
          </p>
        </div>
        <div
          class="md:text-right"
          v-if="
            (branding.socialLinks.value && branding.socialLinks.value.length) ||
            Object.keys(projectInfo.socialLinks || {}).length
          "
        >
          <span class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500"
            >Follow</span
          >
          <div class="mt-3 flex flex-wrap md:justify-end gap-3">
            <template v-if="(branding.socialLinks.value || []).length">
              <a
                v-for="sl in branding.socialLinks.value"
                :key="sl.label + sl.url"
                :href="sl.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition"
                :title="sl.label"
              >
                <Icon :icon="sl.icon || 'mdi:link-variant'" class="w-5 h-5"></Icon>
              </a>
            </template>
            <template v-else>
              <a
                v-for="(link, name) in projectInfo.socialLinks"
                :key="name"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 transition"
                :title="name"
              >
                <Icon :icon="link.icon" class="w-5 h-5"></Icon>
              </a>
            </template>
          </div>
        </div>
      </div>
      <div
        class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-[12px] text-gray-500 dark:text-gray-500"
      >
        &copy; {{ new Date().getFullYear() }} {{ siteTitle }}. All rights reserved.
      </div>
      <div
        class="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-gray-500 dark:text-gray-400"> Powered by: </span>
          <a
            href="https://github.com/Daryan97/pluma"
            target="_blank"
            rel="noopener"
            class="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >Pluma</a
          >
          <a
            href="https://vuejs.org"
            target="_blank"
            rel="noopener"
            class="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
            >Vue</a
          >
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener"
            class="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
            >Supabase</a
          >
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener"
            class="px-2 py-1 rounded-md bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/50"
            >Tailwind</a
          >
        </div>
        <div class="flex items-center gap-2">
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[11px] font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition"
          >
            <Icon icon="mdi:rss" class="text-sm" />
            RSS
          </a>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
          >
            <Icon icon="mdi:map-outline" class="text-sm" />
            Sitemap
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { projectInfo } from "@/config/projectInfo";
import { useBranding, fetchBranding } from "@/stores/brandingStore";
import { computed, onMounted } from "vue";
const branding = useBranding();
const siteTitle = computed(() => branding.siteName.value || projectInfo.name);
onMounted(() => {
  if (!branding.brandingLoaded.value) fetchBranding();
});
</script>
