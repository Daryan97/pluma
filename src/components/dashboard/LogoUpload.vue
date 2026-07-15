<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full min-w-0"
  >
    <div
      class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"
    >
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
          <Icon icon="mdi:image-edit" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">
            {{ t('settings.logos.title') }}
          </h2>
          <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
            {{ t('settings.logos.description') }}
          </p>
        </div>
      </div>
    </div>
    <div class="p-5 space-y-8 flex-1 flex flex-col">
      <div class="grid sm:grid-cols-3 gap-5">
        <div>
          <label
            class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1"
            >{{ t('settings.logos.lightLogo') }}</label
          >
          <div
            class="relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-blue-500': dragLight }"
            @dragover.prevent="dragLight = true"
            @dragleave.prevent="dragLight = false"
            @drop.prevent="onDrop($event, 'light')"
            @click="onZoneClick('light', $event)"
            @keydown.enter.prevent="onZoneClick('light', $event)"
            @keydown.space.prevent="onZoneClick('light', $event)"
            role="button"
            tabindex="0"
            :aria-label="t('settings.logos.lightLogo')"
          >
            <input
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              class="hidden"
              ref="lightInput"
              @change="onFileChange('light')"
            />
            <div
              v-if="lightPreview"
              class="w-full flex flex-col items-center gap-2"
            >
              <img
                :src="lightPreview"
                :alt="t('settings.logos.lightPreviewAlt')"
                class="max-h-20 object-contain"
                loading="lazy"
              />
              <button
                type="button"
                @click.stop="clearFile('light')"
                class="text-xs text-red-600 hover:underline"
                data-remove
              >
                {{ t('common.remove') }}
              </button>
            </div>
            <template v-else>
              <Icon icon="mdi:image-outline" class="text-3xl" />
              <p class="text-xs">{{ t('settings.logos.clickOrDrop') }}</p>
            </template>
          </div>
        </div>

        <div>
          <label
            class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1"
            >{{ t('settings.logos.darkLogo') }}</label
          >
          <div
            class="relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-blue-500': dragDark }"
            @dragover.prevent="dragDark = true"
            @dragleave.prevent="dragDark = false"
            @drop.prevent="onDrop($event, 'dark')"
            @click="onZoneClick('dark', $event)"
            @keydown.enter.prevent="onZoneClick('dark', $event)"
            @keydown.space.prevent="onZoneClick('dark', $event)"
            role="button"
            tabindex="0"
            :aria-label="t('settings.logos.darkLogo')"
          >
            <input
              type="file"
              accept="image/png,image/svg+xml,image/jpeg"
              class="hidden"
              ref="darkInput"
              @change="onFileChange('dark')"
            />
            <div
              v-if="darkPreview"
              class="w-full flex flex-col items-center gap-2"
            >
              <img
                :src="darkPreview"
                :alt="t('settings.logos.darkPreviewAlt')"
                class="max-h-20 object-contain bg-gray-900 p-1 rounded"
                loading="lazy"
              />
              <button
                type="button"
                @click.stop="clearFile('dark')"
                class="text-xs text-red-600 hover:underline"
                data-remove
              >
                {{ t('common.remove') }}
              </button>
            </div>
            <template v-else>
              <Icon icon="mdi:image-outline" class="text-3xl" />
              <p class="text-xs">{{ t('settings.logos.clickOrDrop') }}</p>
            </template>
          </div>
        </div>
        <div>
          <label
            class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1"
            >{{ t('settings.logos.favicon') }}</label
          >
          <div
            class="relative flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md text-gray-500 dark:text-gray-400 hover:border-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-blue-500': dragFavicon }"
            @dragover.prevent="dragFavicon = true"
            @dragleave.prevent="dragFavicon = false"
            @drop.prevent="onDrop($event, 'favicon')"
            @click="onZoneClick('favicon', $event)"
            @keydown.enter.prevent="onZoneClick('favicon', $event)"
            @keydown.space.prevent="onZoneClick('favicon', $event)"
            role="button"
            tabindex="0"
            :aria-label="t('settings.logos.favicon')"
          >
            <input
              type="file"
              accept="image/x-icon,image/png"
              class="hidden"
              ref="faviconInput"
              @change="onFileChange('favicon')"
            />
            <div
              v-if="faviconPreview"
              class="w-full flex flex-col items-center gap-2"
            >
              <img
                :src="faviconPreview"
                :alt="t('settings.logos.faviconPreviewAlt')"
                class="h-12 w-12 object-contain bg-white dark:bg-gray-900 p-1 rounded"
                loading="lazy"
              />
              <button
                type="button"
                @click.stop="clearFile('favicon')"
                class="text-xs text-red-600 hover:underline"
                data-remove
              >
                {{ t('common.remove') }}
              </button>
            </div>
            <template v-else>
              <Icon icon="mdi:star-four-points-outline" class="text-3xl" />
              <p class="text-xs">{{ t('settings.logos.clickOrDrop') }}</p>
            </template>
          </div>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-6" :aria-label="t('settings.logos.previewsAria')">
        <div
          v-if="darkDisplaySrc && lightDisplaySrc && faviconDisplaySrc"
          class="flex justify-center md:col-span-2"
        >
          <span
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 text-[10px]"
          >
            <Icon icon="mdi:check" class="text-xs" /> {{ t('settings.logos.allAssetsSet') }}
          </span>
        </div>
        <div
          class="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-4 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <h3
              class="text-xs font-semibold uppercase tracking-wide text-gray-600"
            >
              {{ t('settings.logos.lightPreview') }}
            </h3>
            <div class="flex items-center gap-2">
              <span v-if="lightDims.w" class="text-[10px] text-gray-400"
                >{{ lightDims.w }}×{{ lightDims.h }}px</span
              >
              <button
                v-if="branding.lightLogoUrl.value"
                type="button"
                @click="remove('light')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition text-[10px]"
              >
                <Icon icon="mdi:delete" class="text-xs" /> {{ t('common.remove') }}
              </button>
              <button
                v-else-if="lightPreview"
                type="button"
                @click="clearFile('light')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700/60 text-[10px]"
              >
                <Icon icon="mdi:close" class="text-xs" /> {{ t('common.clear') }}
              </button>
            </div>
          </div>
          <div
            class="rounded-md border border-gray-200 bg-white px-3 py-2 flex items-center gap-3"
          >
            <div class="flex items-center gap-2 min-w-0">
              <template v-if="lightDisplaySrc">
                <img
                  :src="lightDisplaySrc"
                  :alt="t('settings.logos.lightLogoAlt')"
                  class="h-8 max-w-[140px] object-contain"
                  loading="lazy"
                />
              </template>
              <template v-else>
                <div
                  class="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center text-sm font-semibold"
                >
                  {{ siteInitial }}
                </div>
              </template>
              <span
                class="text-sm font-medium text-gray-700 truncate max-w-[140px]"
                >{{ branding.siteName.value || t('settings.logos.siteNameFallback') }}</span
              >
            </div>
            <div
              class="flex items-center gap-2 text-[10px] text-gray-500 ms-auto opacity-70 select-none"
            >
              <span class="hidden sm:inline">{{ t('settings.logos.navHome') }}</span>
              <span class="hidden sm:inline">{{ t('settings.logos.navPosts') }}</span>
              <span class="hidden md:inline">{{ t('settings.logos.navAbout') }}</span>
            </div>
          </div>
          <div
            class="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <div
                  class="h-4 w-4 rounded overflow-hidden flex items-center justify-center bg-gray-200"
                >
                  <img
                    v-if="faviconDisplaySrc"
                    :src="faviconDisplaySrc"
                    :alt="t('settings.logos.favAlt')"
                    class="h-4 w-4 object-contain"
                    loading="lazy"
                  />
                  <span
                    v-else
                    class="text-[8px] font-semibold text-gray-600 dark:text-gray-300"
                    >{{ siteInitial }}</span
                  >
                </div>
                <span
                  class="text-[11px] font-medium text-gray-700 truncate max-w-[130px]"
                  >{{ branding.siteName.value || t('settings.logos.siteNameFallback') }}</span
                >
              </div>
              <span class="ms-auto text-[9px] text-gray-400">{{ t('settings.logos.tab') }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                v-if="branding.faviconUrl.value"
                type="button"
                @click="remove('favicon')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition text-[10px]"
                :aria-label="t('settings.logos.removeFavicon')"
              >
                <Icon icon="mdi:delete" class="text-xs" />
              </button>
              <button
                v-else-if="faviconPreview"
                type="button"
                @click="clearFile('favicon')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700/60 text-[10px]"
                :aria-label="t('settings.logos.clearFavicon')"
              >
                <Icon icon="mdi:close" class="text-xs" />
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-1">
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px]"
              v-if="!lightDisplaySrc"
            >
              <Icon icon="mdi:alert-circle-outline" class="text-xs" />
              {{ t('settings.logos.missingLightLogo') }}
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px]"
              v-if="lightDisplaySrc"
            >
              <Icon icon="mdi:check" class="text-xs" /> {{ t('settings.logos.lightLogoSet') }}
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px]"
              v-if="faviconDisplaySrc"
            >
              <Icon icon="mdi:star-four-points" class="text-xs" /> {{ t('settings.logos.faviconSet') }}
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-[10px]"
              v-if="!faviconDisplaySrc"
            >
              <Icon icon="mdi:alert" class="text-xs" /> {{ t('settings.logos.missingFavicon') }}
            </span>
          </div>
        </div>
        <div
          class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-4 flex flex-col gap-4 relative overflow-hidden shadow-sm"
        >
          <div class="flex items-center justify-between">
            <h3
              class="text-xs font-semibold uppercase tracking-wide text-gray-300"
            >
              {{ t('settings.logos.darkPreview') }}
            </h3>
            <div class="flex items-center gap-2">
              <span v-if="darkDims.w" class="text-[10px] text-gray-500"
                >{{ darkDims.w }}×{{ darkDims.h }}px</span
              >
              <button
                v-if="branding.darkLogoUrl.value"
                type="button"
                @click="remove('dark')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/30 text-red-300 hover:bg-red-900/50 transition text-[10px]"
              >
                <Icon icon="mdi:delete" class="text-xs" /> {{ t('common.remove') }}
              </button>
              <button
                v-else-if="darkPreview"
                type="button"
                @click="clearFile('dark')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 text-[10px]"
              >
                <Icon icon="mdi:close" class="text-xs" /> {{ t('common.clear') }}
              </button>
            </div>
          </div>
          <div
            class="rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 flex items-center gap-3 backdrop-blur"
          >
            <div class="flex items-center gap-2 min-w-0">
              <template v-if="darkDisplaySrc">
                <img
                  :src="darkDisplaySrc"
                  :alt="t('settings.logos.darkLogoAlt')"
                  class="h-8 max-w-[140px] object-contain"
                  loading="lazy"
                />
              </template>
              <template v-else>
                <div
                  class="h-8 w-8 rounded-md bg-gray-700 text-gray-200 flex items-center justify-center text-sm font-semibold"
                >
                  {{ siteInitial }}
                </div>
              </template>
              <span
                class="text-sm font-medium text-gray-200 truncate max-w-[140px]"
                >{{ branding.siteName.value || t('settings.logos.siteNameFallback') }}</span
              >
            </div>
            <div
              class="flex items-center gap-2 text-[10px] text-gray-400 ms-auto opacity-70 select-none"
            >
              <span class="hidden sm:inline">{{ t('settings.logos.navHome') }}</span>
              <span class="hidden sm:inline">{{ t('settings.logos.navPosts') }}</span>
              <span class="hidden md:inline">{{ t('settings.logos.navAbout') }}</span>
            </div>
          </div>
          <div
            class="flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800/70 px-3 py-2"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div
                class="h-4 w-4 rounded overflow-hidden flex items-center justify-center bg-gray-600"
              >
                <img
                  v-if="faviconDisplaySrc"
                  :src="faviconDisplaySrc"
                  :alt="t('settings.logos.favAlt')"
                  class="h-4 w-4 object-contain"
                  loading="lazy"
                />
                <span v-else class="text-[8px] font-semibold text-gray-200">{{
                  siteInitial
                }}</span>
              </div>
              <span
                class="text-[11px] font-medium text-gray-300 truncate max-w-[130px]"
                >{{ branding.siteName.value || t('settings.logos.siteNameFallback') }}</span
              >
              <span class="ms-auto text-[9px] text-gray-500">{{ t('settings.logos.tab') }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                v-if="branding.faviconUrl.value"
                type="button"
                @click="remove('favicon')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/30 text-red-300 hover:bg-red-900/50 transition text-[10px]"
                :title="t('settings.logos.removeFavicon')"
                :aria-label="t('settings.logos.removeFavicon')"
              >
                <Icon icon="mdi:delete" class="text-xs" />
              </button>
              <button
                v-else-if="faviconPreview"
                type="button"
                @click="clearFile('favicon')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 text-[10px]"
                :title="t('settings.logos.clearFavicon')"
                :aria-label="t('settings.logos.clearFavicon')"
              >
                <Icon icon="mdi:close" class="text-xs" />
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-1">
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 text-[10px]"
              v-if="!darkDisplaySrc"
            >
              <Icon icon="mdi:alert-circle-outline" class="text-xs" />
              {{ t('settings.logos.missingDarkLogo') }}
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-900/30 text-green-300 text-[10px]"
              v-if="darkDisplaySrc"
            >
              <Icon icon="mdi:check" class="text-xs" /> {{ t('settings.logos.darkLogoSet') }}
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300 text-[10px]"
              v-if="faviconDisplaySrc"
            >
              <Icon icon="mdi:star-four-points" class="text-xs" /> {{ t('settings.logos.faviconSet') }}
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-900/30 text-rose-300 text-[10px]"
              v-if="!faviconDisplaySrc"
            >
              <Icon icon="mdi:alert" class="text-xs" /> {{ t('settings.logos.missingFavicon') }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="error" class="text-xs text-red-600">{{ error }}</div>
      <div class="mt-auto">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-2 sm:px-0"
        >
          <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
            {{ t('settings.logos.accepted') }}
          </p>
          <div class="flex items-center gap-3">
            <button
              @click="clearAll"
              :disabled="uploading || (!lightFile && !darkFile && !faviconFile)"
              class="inline-flex items-center gap-1 h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 disabled:opacity-50"
            >
              <Icon icon="mdi:backup-restore" class="text-sm" /> {{ t('common.reset') }}
            </button>
            <button
              @click="upload"
              :disabled="(!lightFile && !darkFile && !faviconFile) || uploading"
              class="inline-flex items-center gap-2 h-9 px-5 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Icon
                :icon="uploading ? 'mdi:loading' : 'mdi:upload'"
                :class="uploading ? 'animate-spin' : ''"
                class="text-base"
              />
              <span>{{ uploading ? t('common.uploading') : t('common.upload') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { ref, computed, watch } from "vue";
import { Icon } from "@iconify/vue";
import {
  useBranding,
} from "@/stores/brandingStore";
const branding = useBranding();
const { updateBranding, fetchBranding, removeBrandingVariant } = branding;
const toast = useToast();

const lightInput = ref(null);
const darkInput = ref(null);
const faviconInput = ref(null);
const lightFile = ref(null);
const darkFile = ref(null);
const faviconFile = ref(null);
const lightPreview = ref(null);
const darkPreview = ref(null);
const faviconPreview = ref(null);
const dragLight = ref(false);
const dragDark = ref(false);
const dragFavicon = ref(false);
const uploading = ref(false);
const error = ref(null);

const siteInitial = computed(() =>
  (branding.siteName.value || "S").trim().charAt(0).toUpperCase()
);

const versionSuffix = computed(() =>
  branding.logoVersion.value ? `?v=${branding.logoVersion.value}` : ""
);
const lightDisplaySrc = computed(
  () =>
    lightPreview.value ||
    (branding.lightLogoUrl.value
      ? branding.lightLogoUrl.value + versionSuffix.value
      : null)
);
const darkDisplaySrc = computed(
  () =>
    darkPreview.value ||
    (branding.darkLogoUrl.value
      ? branding.darkLogoUrl.value + versionSuffix.value
      : null)
);
const faviconDisplaySrc = computed(
  () =>
    faviconPreview.value ||
    (branding.faviconUrl.value
      ? branding.faviconUrl.value + versionSuffix.value
      : null)
);

const lightDims = ref({ w: null, h: null });
const darkDims = ref({ w: null, h: null });
const favDims = ref({ w: null, h: null });

function measure(src, target) {
  if (!src) {
    target.value = { w: null, h: null };
    return;
  }
  const img = new Image();
  img.onload = () => {
    target.value = { w: img.naturalWidth, h: img.naturalHeight };
  };
  img.src = src;
}

watch(lightDisplaySrc, (v) => measure(v, lightDims), { immediate: true });
watch(darkDisplaySrc, (v) => measure(v, darkDims), { immediate: true });
watch(faviconDisplaySrc, (v) => measure(v, favDims), { immediate: true });

function onZoneClick(variant, e) {
  if (e && e.target && e.target.closest("[data-remove]")) return;
  if (variant === "light") {
    lightInput.value && lightInput.value.click();
  } else if (variant === "dark") {
    darkInput.value && darkInput.value.click();
  } else if (variant === "favicon") {
    faviconInput.value && faviconInput.value.click();
  }
}

function validate(file, variant) {
  if (!file) return false;
  let allowed = ["image/png", "image/jpeg", "image/svg+xml"];
  if (variant === "favicon") {
    allowed = ["image/x-icon", "image/vnd.microsoft.icon", "image/png"];
  }
  if (!allowed.includes(file.type)) {
    error.value = t('settings.logos.unsupportedType');
    return false;
  }
  if (file.size > 2000 * 1024) {
    error.value = t('settings.logos.fileTooLarge');
    return false;
  }
  return true;
}

function readPreview(file, target) {
  if (!file) return;
  if (file.type === "image/svg+xml") {
    const reader = new FileReader();
    reader.onload = () => {
      target.value = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    const url = URL.createObjectURL(file);
    target.value = url;
  }
}

function onFileChange(kind) {
  const input =
    kind === "light"
      ? lightInput.value
      : kind === "dark"
      ? darkInput.value
      : faviconInput.value;
  const file = input.files[0];
  if (!validate(file, kind)) {
    input.value = "";
    return;
  }
  if (kind === "light") {
    lightFile.value = file;
    readPreview(file, lightPreview);
  } else if (kind === "dark") {
    darkFile.value = file;
    readPreview(file, darkPreview);
  } else {
    faviconFile.value = file;
    readPreview(file, faviconPreview);
  }
  error.value = null;
}

function onDrop(e, kind) {
  const dtFile = e.dataTransfer.files[0];
  if (!validate(dtFile, kind)) return;
  if (kind === "light") {
    lightFile.value = dtFile;
    readPreview(dtFile, lightPreview);
    dragLight.value = false;
  } else if (kind === "dark") {
    darkFile.value = dtFile;
    readPreview(dtFile, darkPreview);
    dragDark.value = false;
  } else {
    faviconFile.value = dtFile;
    readPreview(dtFile, faviconPreview);
    dragFavicon.value = false;
  }
  error.value = null;
}

function clearFile(kind) {
  if (kind === "light") {
    lightFile.value = null;
    lightPreview.value = null;
    lightInput.value.value = "";
  } else if (kind === "dark") {
    darkFile.value = null;
    darkPreview.value = null;
    darkInput.value.value = "";
  } else {
    faviconFile.value = null;
    faviconPreview.value = null;
    faviconInput.value.value = "";
  }
}

function clearAll() {
  clearFile("light");
  clearFile("dark");
  clearFile("favicon");
}

async function upload() {
  if (!lightFile.value && !darkFile.value && !faviconFile.value) return;
  uploading.value = true;
  error.value = null;
  try {
    await updateBranding({
      lightFile: lightFile.value,
      darkFile: darkFile.value,
      faviconFile: faviconFile.value,
    });
    await fetchBranding(true);
    toast.success(t('settings.logos.updated'));
    clearFile("light");
    clearFile("dark");
    clearFile("favicon");
  } catch (e) {
    console.error(e);
    const step = e?.step ? ` (${e.step})` : "";
    error.value = (e.message || t('settings.logos.uploadFailed')) + step;
    toast.error(e.message || t('settings.logos.uploadFailed'));
  } finally {
    uploading.value = false;
  }
}

async function remove(kind) {
  try {
    await removeBrandingVariant(kind);
    toast.success(t(`settings.logos.removed.${kind}`));
  } catch (e) {
    console.error(e);
    toast.error(t('settings.logos.removeFailed'));
  }
}
</script>

<style scoped>
button[aria-label] {
  outline: none;
}
</style>
