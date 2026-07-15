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
            {{ localizedDescription }}
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
            >{{ t("footer.follow") }}</span
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
        &copy; {{ new Date().getFullYear() }} {{ siteTitle }}. {{ t("footer.rights") }}
      </div>
      <div
        v-if="!creditsReady"
        class="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
        aria-hidden="true"
      >
        <div class="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div class="flex items-center gap-3 ms-auto">
          <div class="h-3 w-14 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div class="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
      <div
        v-else-if="showCreditsRow"
        class="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px]"
      >
        <p
          v-if="credits.plumaWatermark"
          class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-gray-500 dark:text-gray-500"
        >
          <span>{{ t("footer.poweredBy") }}</span>
          <a
            href="https://github.com/Daryan97/pluma"
            target="_blank"
            rel="noopener"
            class="font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Pluma
          </a>
        </p>
        <div v-if="credits.rss || credits.sitemap" class="flex items-center gap-3 ms-auto">
          <a
            v-if="credits.rss"
            :href="rssFeedHref"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <Icon icon="mdi:rss" class="text-sm" />
            {{ t("footer.rss") }}
          </a>
          <a
            v-if="credits.sitemap"
            :href="sitemapFeedHref"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Icon icon="mdi:map-outline" class="text-sm" />
            {{ t("footer.sitemap") }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { projectInfo } from "@/config/projectInfo";
import { useBranding, DEFAULT_FOOTER_CREDITS } from "@/stores/brandingStore";
import { rssHref, sitemapHref } from "@/lib/feedUrls";
import { computed, onMounted } from "vue";

const { t, locale } = useI18n();
const branding = useBranding();
const siteTitle = computed(
  () => branding.resolveLocalizedSiteName(locale.value) || ""
);
const localizedDescription = computed(
  () => branding.resolveLocalizedSiteDescription(locale.value) || ""
);
const credits = computed(() => ({
  ...DEFAULT_FOOTER_CREDITS,
  ...(branding.footerCredits?.value || {}),
}));
const showCreditsRow = computed(
  () =>
    credits.value.plumaWatermark || credits.value.rss || credits.value.sitemap
);
/**
 * SSR paints the credits skeleton; reveal after mount once branding is ready
 * so powered-by / RSS / sitemap don't pop in without a placeholder.
 */
const creditsUiReady = ref(false);
const creditsReady = computed(
  () =>
    creditsUiReady.value &&
    !!branding.brandingLoaded?.value &&
    !branding.brandingLoading?.value
);
const feedOptions = computed(() => ({
  locale: locale.value,
  primaryLocale: branding.primaryLocale?.value || "en",
}));
const rssFeedHref = computed(() => rssHref(feedOptions.value));
const sitemapFeedHref = computed(() => sitemapHref(feedOptions.value));

onMounted(() => {
  const reveal = () => {
    creditsUiReady.value = true;
  };
  if (branding.brandingLoaded?.value) {
    reveal();
  } else {
    branding.fetchBranding().finally(reveal);
  }
  setTimeout(reveal, 4000);
});
</script>
