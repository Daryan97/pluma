<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"
      ></div>
      <div
        class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"
      ></div>
      <div
        class="max-w-6xl mx-auto px-4 pt-20 pb-16 lg:pt-28 lg:pb-24 relative"
      >
        <div class="flex flex-col items-center text-center gap-8">
          <div class="space-y-5 max-w-3xl">
            <div v-if="showWelcome" class="w-full flex justify-center">
              <button
                v-if="latestPost"
                type="button"
                @click="openLatestPost"
                @keydown.enter.prevent="openLatestPost"
                @keydown.space.prevent="openLatestPost"
                class="group flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-4 py-2 w-full max-w-lg sm:w-auto sm:max-w-none rounded-full text-[11px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition text-center"
                :aria-label="'Open latest post: ' + latestPost.title"
              >
                <Icon icon="mdi:star-four-points" class="text-base shrink-0 mx-auto sm:mx-0" />
                <span class="flex-1 text-center sm:text-left leading-snug break-words" :title="latestPost.title">{{ latestPost.title }}</span>
                <Icon
                  icon="mdi:arrow-right"
                  class="text-sm shrink-0 mx-auto sm:mx-0 opacity-60 group-hover:translate-x-0.5 transition-transform"
                />
              </button>
              <span
                v-else
                class="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                <Icon icon="mdi:lightning-bolt" class="text-base" /> {{ t("home.welcome") }}
              </span>
            </div>
            <h1
              v-if="showSiteName"
              class="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white"
            >
              {{ localizedSiteName }}
            </h1>
            <p
              v-if="showSiteDescription"
              class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              {{ localizedSiteDescription }}
            </p>
          </div>
          <div v-if="showSearch" class="w-full max-w-xl">
            <div
              role="button"
              tabindex="0"
              :aria-label="t('nav.search')"
              @click="openGlobalSearch"
              @keydown.enter.prevent="openGlobalSearch"
              @keydown.space.prevent="openGlobalSearch"
              class="group flex items-center h-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm ring-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none px-4 gap-3"
            >
              <Icon
                icon="mdi:magnify"
                class="text-gray-500 dark:text-gray-400 text-xl"
              />
              <span
                class="flex-1 text-left text-sm text-gray-500 dark:text-gray-400"
              >
                {{ t("home.searchPlaceholder") }}
              </span>
              <span
                class="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium pr-1"
              >
                <kbd
                  class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-300 shadow-sm"
                  >/</kbd
                >
                {{ t("common.open") }}
              </span>
            </div>
          </div>
          <div
            class="max-w-2xl w-full pt-4"
            v-if="statsLoaded && enabledStats.length > 0"
          >
            <div class="grid gap-6" :style="statsGridStyle">
              <div v-for="s in enabledStats" :key="s.key" class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {{ s.value }}
                </div>
                <div
                  class="mt-1 text-[11px] uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400"
                >
                  {{ s.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      class="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm sticky top-0 z-20"
      v-if="categoriesLoaded && categories.length"
    >
      <div
        class="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-track-transparent"
      >
        <button
          @click="goToCategory('all')"
          :class="categoryActive === 'all' ? activeCatClass : catClass"
          class="flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium"
        >
          <Icon icon="mdi:infinity" class="text-sm" /> {{ t("common.all") }}
        </button>
        <button
          v-for="c in categories"
          :key="c.slug || 'null-' + c.id"
          @click="goToCategory(c.slug || 'uncategorized')"
          :class="
            categoryActive === (c.slug || 'uncategorized')
              ? activeCatClass
              : catClass
          "
          class="flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium"
        >
          <Icon icon="mdi:folder" class="text-sm" />
          {{ c.name || t("common.uncategorized") }}
        </button>
      </div>
    </section>
    <main class="relative -mt-4">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <h2 class="sr-only">{{ t("home.latestPosts") }}</h2>
        <PostLoader filterBy="home" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/services/supabase";
import { countLogicalPosts } from "@/lib/postCount";
import { loadCategoriesForLocale } from "@/lib/categoryScope";
import PostLoader from "@/components/PostLoader.vue";
import { Icon } from "@iconify/vue";
import { useStatsSettings, fetchStatsSettings } from '@/stores/statsSettingsStore';
import { useSettings, fetchSettings } from '@/stores/settingsStore';
import { useBranding } from "@/stores/brandingStore";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { contentLocale } = useContentLocale();
const branding = useBranding();
const localizedSiteName = computed(
  () => branding.resolveLocalizedSiteName(locale.value) || ""
);
const localizedSiteDescription = computed(
  () => branding.resolveLocalizedSiteDescription(locale.value) || ""
);
const router = useRouter();
function openGlobalSearch() {
  const evt = new CustomEvent("pluma:open-global-search", {
    detail: { query: "" },
  });
  window.dispatchEvent(evt);
}

const categories = ref([]);
const categoriesLoaded = ref(false);
const categoryActive = ref("all");
const catClass =
  "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700";
const activeCatClass =
  "bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-blue-600 dark:border-blue-500 shadow";

async function loadCategories() {
  categories.value = await loadCategoriesForLocale(
    supabase,
    contentLocale.value
  );
  categoriesLoaded.value = true;
}
function goToCategory(slug) {
  if (slug === "all") {
    categoryActive.value = "all";
    router.push(localePath("/"));
    return;
  }
  categoryActive.value = slug;
  router.push(localePath(`/category/${slug}`));
}

const stats = ref([
  { key: "posts", label: t("home.stats.posts"), value: "—" },
  { key: "categories", label: t("home.stats.categories"), value: "—" },
  { key: "authors", label: t("home.stats.authors"), value: "—" },
]);
const statsLoaded = ref(false);
const { statsEnabled } = useStatsSettings();
const { featuresEnabled } = useSettings();
const enabledStats = computed(() => stats.value.filter(s => statsEnabled.value[s.key]));
const statsGridStyle = computed(() => ({
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
}));

async function loadStats() {
  await fetchStatsSettings();
  const [{ count: postsCount }, { count: catCount }, { count: authorCount }] =
    await Promise.all([
      statsEnabled.value.posts
        ? countLogicalPosts(supabase, (q) =>
            q.eq("status", "published").eq("locale", contentLocale.value)
          )
        : Promise.resolve({ count: null }),
      statsEnabled.value.categories
        ? supabase
            .from("categories")
            .select("id", { count: "exact", head: true })
            .eq("locale", contentLocale.value)
        : Promise.resolve({ count: null }),
      statsEnabled.value.authors
        ? supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .in("role", ["author", "admin"])
        : Promise.resolve({ count: null }),
    ]);
  stats.value = [
    { key: "posts", label: t("home.stats.posts"), value: postsCount ?? "—" },
    { key: "categories", label: t("home.stats.categories"), value: catCount ?? "—" },
    { key: "authors", label: t("home.stats.authors"), value: authorCount ?? "—" },
  ];
  statsLoaded.value = true;
}

onMounted(() => {
  loadCategories();
  loadStats();
  fetchLatestPost();
  fetchSettings();
});

watch(contentLocale, () => {
  loadCategories();
  fetchLatestPost();
  loadStats();
});

const latestPost = ref(null);
async function fetchLatestPost() {
  const { data, error } = await supabase
    .from("posts")
    .select("title, slug, created_at")
    .eq("status", "published")
    .eq("locale", contentLocale.value)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!error && data) {
    latestPost.value = data;
  }
}
function openLatestPost() {
  if (latestPost.value?.slug) {
    router.push(localePath(`/posts/${latestPost.value.slug}`));
  }
}

const showWelcome = computed(() => featuresEnabled.value.welcome !== false);
const showSiteName = computed(() => featuresEnabled.value.siteName !== false);
const showSiteDescription = computed(() => featuresEnabled.value.siteDescription !== false);
const showSearch = computed(() => featuresEnabled.value.search !== false);
</script>
