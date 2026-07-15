<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6 min-w-0 w-full"
  >
    <div class="flex flex-wrap items-start gap-3 mb-2 sm:flex-nowrap">
      <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
        <Icon icon="mdi:translate" class="w-6 h-6" />
      </div>
      <div class="flex-1 min-w-0">
        <h2
          class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase break-words"
        >
          {{ t("settings.locales.title") }}
        </h2>
        <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1 break-words">
          {{ t("settings.locales.description") }}
        </p>
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-8">
      <div>
        <h3
          class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2"
        >
          {{ t("settings.locales.enabledTitle") }}
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="loc in catalog"
            :key="loc.code"
            class="flex flex-wrap items-center gap-3 justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span
                class="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase flex items-center justify-center shrink-0"
              >
                {{ loc.code }}
              </span>
              <div class="flex flex-col min-w-0">
                <span class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{
                  loc.name
                }}</span>
                <span
                  class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words leading-snug"
                >
                  {{
                    localEnabled.includes(loc.code)
                      ? t("settings.locales.enabledHint")
                      : t("settings.locales.disabledHint")
                  }}
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="localEnabled.includes(loc.code)"
              :aria-label="t('settings.locales.enable', { name: loc.name })"
              @click="toggleLocale(loc.code)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ms-auto',
                localEnabled.includes(loc.code)
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-700',
                'group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400',
              ]"
            >
              <span
                :class="[
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200',
                  localEnabled.includes(loc.code) ? 'translate-x-5' : 'translate-x-1',
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <div class="pt-2">
        <h3
          class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2"
        >
          {{ t("settings.locales.primaryTitle") }}
        </h3>
        <p class="text-[12px] text-gray-500 dark:text-gray-400 mb-3 break-words">
          {{ t("settings.locales.primaryDescription") }}
        </p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            v-for="loc in enabledCatalog"
            :key="`primary-${loc.code}`"
            type="button"
            @click="setPrimary(loc.code)"
            :class="[
              'flex items-center gap-3 rounded-xl px-4 py-3 text-start border transition group',
              localPrimary === loc.code
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm'
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow',
            ]"
          >
            <span
              :class="[
                'w-7 h-7 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center shrink-0',
                localPrimary === loc.code
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',
              ]"
            >
              {{ loc.code }}
            </span>
            <div class="flex flex-col min-w-0 flex-1">
              <span class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{
                loc.name
              }}</span>
              <span
                v-if="localPrimary === loc.code"
                class="text-xs text-blue-600 dark:text-blue-300 mt-0.5"
              >
                {{ t("settings.locales.primaryBadge") }}
              </span>
              <span v-else class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {{ t("settings.locales.primary") }}
              </span>
            </div>
            <Icon
              :icon="localPrimary === loc.code ? 'mdi:check-circle' : 'mdi:circle-outline'"
              :class="[
                'w-5 h-5 shrink-0',
                localPrimary === loc.code
                  ? 'text-blue-500 dark:text-blue-300'
                  : 'text-gray-300 dark:text-gray-600',
              ]"
            />
          </button>
        </div>
      </div>

      <p v-if="validationError" class="text-amber-600 dark:text-amber-400 text-sm">
        {{ validationError }}
      </p>

      <div class="flex gap-2 pt-2 items-center justify-end">
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Icon
            :icon="saving ? 'mdi:loading' : 'mdi:content-save'"
            :class="saving ? 'animate-spin' : ''"
            class="text-base"
          />
          <span>{{ saving ? t("common.saving") : t("common.save") }}</span>
        </button>
        <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { CONTENT_LOCALES } from "@/config/contentLocales";
import {
  useBranding,
  normalizeLocaleSettings,
} from "@/stores/brandingStore";

const { t, locales } = useI18n();
const toast = useToast();
const branding = useBranding();
const { updateBranding, fetchBranding } = branding;
const saving = ref(false);
const error = ref("");
const validationError = ref("");
const localEnabled = ref([]);
const localPrimary = ref("en");
const dirty = ref(false);

const catalog = computed(() => {
  const i18nList = unref(locales) || [];
  if (i18nList.length) {
    return i18nList.map((l) => ({
      code: l.code,
      name: l.name || l.code,
    }));
  }
  return CONTENT_LOCALES;
});

const enabledCatalog = computed(() =>
  catalog.value.filter((l) => localEnabled.value.includes(l.code))
);

function syncFromStore() {
  const norm = normalizeLocaleSettings(
    branding.enabledLocales?.value,
    branding.primaryLocale?.value
  );
  localEnabled.value = [...norm.enabledLocales];
  localPrimary.value = norm.primaryLocale;
  validationError.value = "";
  dirty.value = false;
}

onMounted(async () => {
  if (!branding.brandingLoaded.value) await fetchBranding();
  syncFromStore();
});

// Only reseat local draft when store changes and the user isn't mid-edit.
// Otherwise a delayed fetchBranding() / store update snaps toggles back on.
watch(
  () => [
    ...(branding.enabledLocales?.value || []),
    branding.primaryLocale?.value,
  ],
  () => {
    if (dirty.value || saving.value) return;
    syncFromStore();
  }
);

function setPrimary(code) {
  if (!localEnabled.value.includes(code)) return;
  localPrimary.value = code;
  validationError.value = "";
  dirty.value = true;
}

function toggleLocale(code) {
  validationError.value = "";
  const enabled = localEnabled.value.includes(code);
  if (enabled) {
    if (localEnabled.value.length <= 1) {
      validationError.value = t("settings.locales.cannotDisableLast");
      toast.warning(validationError.value);
      return;
    }
    if (localPrimary.value === code) {
      const next = localEnabled.value.find((c) => c !== code);
      if (!next) {
        validationError.value = t("settings.locales.cannotDisableLast");
        toast.warning(validationError.value);
        return;
      }
      localPrimary.value = next;
    }
    localEnabled.value = localEnabled.value.filter((c) => c !== code);
    dirty.value = true;
    return;
  }
  localEnabled.value = [...localEnabled.value, code];
  dirty.value = true;
}

async function save() {
  if (saving.value) return;
  saving.value = true;
  error.value = "";
  validationError.value = "";
  try {
    const norm = normalizeLocaleSettings(localEnabled.value, localPrimary.value);
    await updateBranding({
      lightFile: null,
      darkFile: null,
      faviconFile: null,
      enabledLocales: norm.enabledLocales,
      primaryLocale: norm.primaryLocale,
    });
    localEnabled.value = [...norm.enabledLocales];
    localPrimary.value = norm.primaryLocale;
    dirty.value = false;
    toast.success(t("settings.locales.updated"));
  } catch (e) {
    error.value = e?.message || t("settings.locales.saveFailed");
    toast.error(error.value);
    dirty.value = false;
    syncFromStore();
  } finally {
    saving.value = false;
  }
}
</script>
