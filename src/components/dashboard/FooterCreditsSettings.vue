<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6 min-w-0 w-full"
  >
    <div class="flex flex-wrap items-start gap-3 mb-2 sm:flex-nowrap">
      <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
        <Icon icon="mdi:page-layout-footer" class="w-6 h-6" />
      </div>
      <div class="flex-1 min-w-0">
        <h2
          class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase break-words"
        >
          {{ t('settings.footerCredits.title') }}
        </h2>
        <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1 break-words">
          {{ t('settings.footerCredits.description') }}
        </p>
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-6">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          v-for="opt in options"
          :key="opt.key"
          class="flex flex-wrap items-center gap-3 justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"
        >
          <div class="flex items-center gap-3 min-w-0">
            <Icon
              :icon="opt.icon"
              class="w-7 h-7 text-blue-500 dark:text-blue-300 flex-shrink-0"
            />
            <div class="flex flex-col min-w-0">
              <span class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{
                opt.label
              }}</span>
              <span
                class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words leading-snug"
                >{{ opt.desc }}</span
              >
            </div>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="local[opt.key]"
            :aria-label="opt.label"
            @click="onToggle(opt.key)"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ms-auto',
              local[opt.key] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700',
              'group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400',
            ]"
          >
            <span
              :class="[
                'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200',
                local[opt.key] ? 'translate-x-5' : 'translate-x-1',
              ]"
            />
          </button>
        </div>
      </div>

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
          <span>{{ saving ? t('common.saving') : t('common.save') }}</span>
        </button>
        <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
      </div>
    </form>

    <ConfirmDialog
      :open="showWatermarkPrompt"
      tone="soft"
      icon="mdi:feather"
      :title="t('settings.footerCredits.watermarkPrompt.title')"
      :description="t('settings.footerCredits.watermarkPrompt.description')"
      :body="t('settings.footerCredits.watermarkPrompt.body')"
      :cancel-label="t('settings.footerCredits.watermarkPrompt.keep')"
      :confirm-label="t('settings.footerCredits.watermarkPrompt.hide')"
      @cancel="showWatermarkPrompt = false"
      @confirm="confirmHideWatermark"
    />
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { computed, onMounted, reactive, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import {
  useBranding,
  DEFAULT_FOOTER_CREDITS,
} from "@/stores/brandingStore";

const toast = useToast();
const branding = useBranding();
const { updateBranding, fetchBranding } = branding;
const saving = ref(false);
const error = ref("");
const showWatermarkPrompt = ref(false);
const local = reactive({ ...DEFAULT_FOOTER_CREDITS });

const options = computed(() => [
  {
    key: "plumaWatermark",
    label: t('settings.footerCredits.options.plumaWatermark.label'),
    icon: "mdi:feather",
    desc: t('settings.footerCredits.options.plumaWatermark.desc'),
  },
  {
    key: "rss",
    label: t('settings.footerCredits.options.rss.label'),
    icon: "mdi:rss",
    desc: t('settings.footerCredits.options.rss.desc'),
  },
  {
    key: "sitemap",
    label: t('settings.footerCredits.options.sitemap.label'),
    icon: "mdi:map-outline",
    desc: t('settings.footerCredits.options.sitemap.desc'),
  },
]);

function syncFromStore() {
  const credits = branding.footerCredits?.value || DEFAULT_FOOTER_CREDITS;
  Object.assign(local, { ...DEFAULT_FOOTER_CREDITS, ...credits });
}

onMounted(async () => {
  if (!branding.brandingLoaded.value) await fetchBranding();
  syncFromStore();
});

watch(
  () => branding.footerCredits?.value,
  () => syncFromStore(),
  { deep: true }
);

function onToggle(key) {
  const turningOff = local[key] === true;
  if (key === "plumaWatermark" && turningOff) {
    showWatermarkPrompt.value = true;
    return;
  }
  local[key] = !local[key];
}

function confirmHideWatermark() {
  showWatermarkPrompt.value = false;
  local.plumaWatermark = false;
}

async function save() {
  if (saving.value) return;
  saving.value = true;
  error.value = "";
  try {
    await updateBranding({
      lightFile: null,
      darkFile: null,
      faviconFile: null,
      footerCredits: { ...local },
    });
    toast.success(t('settings.footerCredits.updated'));
  } catch (e) {
    error.value = e?.message || t('settings.footerCredits.saveFailed');
    toast.error(error.value);
    syncFromStore();
  } finally {
    saving.value = false;
  }
}
</script>
