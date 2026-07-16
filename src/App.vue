<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useBranding } from "@/stores/brandingStore";
import { projectInfo } from "@/config/projectInfo";
import { useThemeStore } from "@/stores/themeStore";

const { locale, locales, setLocale } = useI18n();
const branding = useBranding();

if (import.meta.client) {
  useThemeStore().syncFromClientStorage?.();
}

await useLazyAsyncData(
  "site-branding",
  async () => {
    await branding.fetchBranding(true);
    return true;
  },
  { server: true }
);

applyLocalizedBranding();

useHead(() => {
  const href = branding.faviconUrl?.value;
  const links = [
    { rel: "manifest", href: "/manifest.webmanifest", key: "web-manifest" },
  ];
  if (href) {
    links.push(
      { rel: "icon", href, key: "site-favicon" },
      { rel: "apple-touch-icon", href, key: "apple-touch-icon" }
    );
  }
  return { link: links };
});

async function clampLocaleToEnabled() {
  const code = unref(locale);
  const enabled = branding.enabledLocales?.value;
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
    if (!branding.brandingLoaded?.value) {
      await branding.fetchBranding(true);
    }
    applyLocalizedBranding();
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

function applyLocalizedBranding() {
  projectInfo.applyBranding({
    siteName: branding.resolveLocalizedSiteName(unref(locale)),
    siteDescription: branding.resolveLocalizedSiteDescription(unref(locale)),
    socialLinks: branding.socialLinks.value,
  });
}

watch(
  () => [
    unref(locale),
    branding.siteName?.value,
    branding.siteDescription?.value,
    branding.metaTranslations?.value,
    branding.socialLinks?.value,
  ],
  () => {
    if (branding.brandingLoaded?.value) applyLocalizedBranding();
  },
  { deep: true }
);

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
