<template>
  <DropdownMenuRoot
    v-if="availableLocales.length > 1"
    v-model:open="open"
  >
    <DropdownMenuTrigger
      class="nav-pill data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-gray-700/60"
      :aria-label="t('locale.switch')"
    >
      <Icon icon="mdi:translate" class="text-base" />
      <span class="hidden md:inline uppercase tracking-wide">{{ locale }}</span>
      <Icon icon="mdi:chevron-down" class="text-base opacity-70" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[220px] max-h-[60vh] overflow-auto p-1.5 rounded-xl bg-white/95 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700/30 shadow-lg focus:outline-none origin-top-right data-[side=bottom]:animate-slideUpAndFade data-[side=top]:animate-slideDownAndFade z-[200]"
        :side-offset="8"
        align="end"
      >
        <div
          class="px-2 pb-1 pt-1.5 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md mb-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400"
        >
          <Icon icon="mdi:translate" class="text-sm" />
          {{ t("locale.switch") }}
        </div>
        <DropdownMenuItem
          v-for="loc in availableLocales"
          :key="loc.code"
          class="menu-item"
          :class="loc.code === locale ? 'font-semibold text-blue-600 dark:text-blue-400' : ''"
          @select="switchLocale(loc.code)"
        >
          <span class="uppercase text-[10px] opacity-60 w-6 shrink-0">{{ loc.code }}</span>
          <span class="truncate flex-1">{{ loc.name }}</span>
          <Icon
            v-if="loc.code === locale"
            icon="mdi:check"
            class="text-base opacity-80"
          />
          <Icon
            v-else
            icon="mdi:chevron-right"
            class="text-xs opacity-40"
          />
        </DropdownMenuItem>
        <DropdownMenuArrow class="fill-white dark:fill-gray-800" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "radix-vue";

import { useBranding } from "@/stores/brandingStore";

const { locale, locales, t, setLocale } = useI18n();
const branding = useBranding();
// Filled by primary-locale middleware / shared across SSR→client
const localeSettings = useState("pluma-branding-locales", () => null);

const open = ref(false);

const resolvedEnabled = computed(() => {
  if (branding.brandingLoaded?.value) {
    return branding.enabledLocales?.value || [];
  }
  // Prefer middleware payload so we don't briefly treat "all locales" as enabled
  return localeSettings.value?.enabledLocales || null;
});

const availableLocales = computed(() => {
  const enabled = resolvedEnabled.value;
  // null = not ready yet → hide switcher (prevents single-lang flash)
  if (!Array.isArray(enabled)) return [];
  if (!enabled.length) return [];
  const list = unref(locales) || [];
  return list
    .filter((l) => enabled.includes(l.code))
    .map((l) => ({
      code: l.code,
      name: l.name || l.code,
    }));
});

async function switchLocale(code) {
  open.value = false;
  if (!code || code === unref(locale)) return;
  if (!branding.isLocaleEnabled(code)) return;
  const cookie = useCookie("pluma_locale", { sameSite: "lax", path: "/" });
  cookie.value = code;
  await setLocale(code);
}
</script>
