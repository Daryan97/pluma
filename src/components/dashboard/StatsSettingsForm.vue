<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6"
  >
    <div class="flex items-start gap-3 mb-6">
      <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
        <Icon icon="mdi:chart-bar" class="w-6 h-6" />
      </div>
      <div class="flex-1">
        <h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">
          Homepage Features & Stats
        </h2>
        <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
          Enable or disable homepage sections and stats below.
        </p>
      </div>
    </div>
    <form @submit.prevent="save" class="space-y-8">
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Homepage Features</h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="feature in featureOptions"
            :key="feature.key"
            class="flex items-center justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"
          >
            <div class="flex items-center gap-3 min-w-0">
              <Icon
                :icon="feature.icon"
                class="w-7 h-7 text-blue-500 dark:text-blue-300 flex-shrink-0"
              />
              <div class="flex flex-col min-w-0">
                <span class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ feature.label }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words leading-snug">{{ feature.desc }}</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="localFeatures[feature.key]"
              :aria-label="feature.label"
              @click="localFeatures[feature.key] = !localFeatures[feature.key]"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ml-4',
                localFeatures[feature.key]
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-700',
                'group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400',
              ]"
            >
              <span
                :class="[
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200',
                  localFeatures[feature.key] ? 'translate-x-5' : 'translate-x-1',
                ]"
              ></span>
            </button>
          </div>
        </div>
      </div>
      <div class="pt-4">
        <h3 class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">Homepage Stats</h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="stat in statOptions"
            :key="stat.key"
            class="flex items-center justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"
          >
            <div class="flex items-center gap-3 min-w-0">
              <Icon
                :icon="stat.icon"
                class="w-7 h-7 text-blue-500 dark:text-blue-300 flex-shrink-0"
              />
              <div class="flex flex-col min-w-0">
                <span class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ stat.label }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words leading-snug">{{ stat.desc }}</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="localEnabled[stat.key]"
              :aria-label="stat.label"
              @click="localEnabled[stat.key] = !localEnabled[stat.key]"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ml-4',
                localEnabled[stat.key]
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-700',
                'group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400',
              ]"
            >
              <span
                :class="[
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200',
                  localEnabled[stat.key] ? 'translate-x-5' : 'translate-x-1',
                ]"
              ></span>
            </button>
          </div>
        </div>
      </div>
      <div class="flex gap-2 pt-4 items-center justify-end">
        <button
          type="submit"
          class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Icon icon="mdi:content-save" class="text-base" />
          <span>Save Changes</span>
        </button>
        <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { supabase } from "@/services/supabase";
import {
  useStatsSettings,
  fetchStatsSettings,
} from "@/stores/statsSettingsStore";
import { useSettings, fetchSettings } from "@/stores/settingsStore";
import { Icon } from "@iconify/vue";
import { useToast } from "vue-toastification";

const { statsEnabled } = useStatsSettings();
const { featuresEnabled } = useSettings();
const toast = useToast();

const featureOptions = [
  {
    key: "welcome",
    label: "Welcome/Latest Post",
    icon: "mdi:star-four-points",
    desc: "Show the welcome banner or latest post at the top.",
  },
  {
    key: "siteName",
    label: "Site Name",
    icon: "mdi:format-title",
    desc: "Display your site name prominently.",
  },
  {
    key: "siteDescription",
    label: "Site Description",
    icon: "mdi:card-text-outline",
    desc: "Show your site tagline or description.",
  },
  {
    key: "search",
    label: "Search Bar",
    icon: "mdi:magnify",
    desc: "Enable the homepage search bar.",
  },
];
const statOptions = [
  {
    key: "posts",
    label: "Posts",
    icon: "mdi:post-outline",
    desc: "Show the total number of published posts.",
  },
  {
    key: "categories",
    label: "Categories",
    icon: "mdi:folder-outline",
    desc: "Show the total number of categories.",
  },
  {
    key: "authors",
    label: "Authors",
    icon: "mdi:account-multiple-outline",
    desc: "Show the total number of authors/admins.",
  },
];
const localEnabled = ref({ posts: true, categories: true, authors: true });
const localFeatures = ref({
  welcome: true,
  siteName: true,
  siteDescription: true,
  search: true,
});
const error = ref("");

onMounted(async () => {
  await fetchStatsSettings();
  await fetchSettings();
  localEnabled.value = { ...statsEnabled.value };
  localFeatures.value = { ...featuresEnabled.value };
});

watch(statsEnabled, (val) => {
  localEnabled.value = { ...val };
});
watch(featuresEnabled, (val) => {
  localFeatures.value = { ...val };
});

async function save() {
  error.value = "";
  const { error: statsErr } = await supabase
    .from("settings")
    .upsert({ key: "stats_home_enabled", value: localEnabled.value });
  const { error: featuresErr } = await supabase
    .from("settings")
    .upsert({ key: "features_home_enabled", value: localFeatures.value });
  if (statsErr || featuresErr) {
    error.value =
      statsErr?.message || featuresErr?.message || "Failed to save.";
    toast.error(error.value);
    return;
  }
  await fetchStatsSettings();
  await fetchSettings();
  toast.success("Homepage settings updated");
}
</script>
