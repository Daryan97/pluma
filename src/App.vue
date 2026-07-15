<template>
  <div class="relative min-h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
    <ClientOnly>
      <RouteLoadingOverlay />
    </ClientOnly>
    <Navbar />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
import RouteLoadingOverlay from "@/components/RouteLoadingOverlay.vue";
import { useBranding } from "@/stores/brandingStore";
import { projectInfo } from "@/config/projectInfo";
import { useThemeStore } from "@/stores/themeStore";

const { locale, locales, setLocale } = useI18n();
const branding = useBranding();

// Initialize theme store on client so Pinia matches the early boot script
if (import.meta.client) {
  useThemeStore();
}

async function clampLocaleToEnabled() {
  const code = unref(locale);
  const enabled = branding.enabledLocales?.value;
  // Prefer English when the current UI locale was disabled — not branding.primaryLocale
  // (primary is for content; forcing it made Kurdish the site UI default).
  const fallback =
    Array.isArray(enabled) && enabled.includes("en")
      ? "en"
      : branding.primaryLocale?.value || "en";

  if (!Array.isArray(enabled) || !enabled.length) return;
  if (enabled.includes(code)) return;
  if (fallback && fallback !== code) {
    const cookie = useCookie("pluma_locale", { sameSite: "lax", path: "/" });
    cookie.value = fallback;
    await setLocale(fallback);
  }
}

onMounted(async () => {
  try {
    await branding.fetchBranding(true);
    projectInfo.applyBranding({
      siteName: branding.siteName.value,
      siteDescription: branding.siteDescription.value,
      socialLinks: branding.socialLinks.value,
    });
    await clampLocaleToEnabled();
  } catch (e) {
    console.warn("[app] branding fetch failed", e);
  }
  try {
    const supabase = useSupabaseClient();
    supabase.rpc("publish_due_posts").then(() => {}).catch(() => {});
  } catch {
    /* ignore */
  }
});

watch(
  () => [branding.enabledLocales?.value, branding.primaryLocale?.value],
  () => {
    if (branding.brandingLoaded?.value) clampLocaleToEnabled();
  },
  { deep: true }
);

watch(
  locale,
  (code) => {
    const meta = unref(locales)?.find?.((l) => l.code === code);
    useHead({
      htmlAttrs: {
        lang: code,
        dir: meta?.dir || "ltr",
      },
    });
  },
  { immediate: true }
);
</script>
