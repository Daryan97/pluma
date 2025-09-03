<template>
  <div class="min-h-screen">
    <!-- Hero -->
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
            <span
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              <Icon icon="mdi:lightning-bolt" class="text-base" /> Welcome
            </span>
            <h1
              class="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white"
            >
              {{ projectInfo.name }}
            </h1>
            <p
              class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              {{
                projectInfo.description ||
                "Discover insightful articles, tutorials and stories."
              }}
            </p>
          </div>
          <!-- Search Trigger (non-editable) -->
          <div class="w-full max-w-xl">
            <div
              role="button"
              tabindex="0"
              aria-label="Open global search"
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
                Search articles, categories, authors...
              </span>
              <span
                class="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium pr-1"
              >
                <kbd
                  class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-300 shadow-sm"
                  >/</kbd
                >
                Open
              </span>
            </div>
          </div>
          <!-- Quick Stats -->
          <div
            class="grid grid-cols-3 gap-6 max-w-2xl w-full pt-4"
            v-if="statsLoaded"
          >
            <div v-for="s in stats" :key="s.key" class="text-center">
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
    </section>

    <!-- Categories -->
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
          <Icon icon="mdi:infinity" class="text-sm" /> All
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
          {{ c.name || "Uncategorized" }}
        </button>
      </div>
    </section>

    <!-- Feed -->
    <main class="relative -mt-4">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <h2 class="sr-only">Latest Posts</h2>
        <PostLoader filterBy="home" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/services/supabase";
import PostLoader from "@/components/PostLoader.vue";
import { projectInfo } from "@/config/projectInfo";
import { Icon } from "@iconify/vue";

const router = useRouter();
function openGlobalSearch() {
  const evt = new CustomEvent("pluma:open-global-search", {
    detail: { query: "" },
  });
  window.dispatchEvent(evt);
}

// Categories
const categories = ref([]);
const categoriesLoaded = ref(false);
const categoryActive = ref("all");
const catClass =
  "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700";
const activeCatClass =
  "bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-blue-600 dark:border-blue-500 shadow";

async function loadCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");
  if (!error && data) {
    categories.value = data;
  }
  categoriesLoaded.value = true;
}
function goToCategory(slug) {
  if (slug === "all") {
    categoryActive.value = "all";
    router.push("/");
    return;
  }
  categoryActive.value = slug;
  router.push(`/category/${slug}`);
}

// Quick stats (counts)
const stats = ref([
  { key: "posts", label: "Posts", value: "—" },
  { key: "categories", label: "Categories", value: "—" },
  { key: "authors", label: "Authors", value: "—" },
]);
const statsLoaded = ref(false);
async function loadStats() {
  const [{ count: postsCount }, { count: catCount }, { count: authorCount }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .in("role", ["author", "admin"]),
    ]);
  stats.value = [
    { key: "posts", label: "Posts", value: postsCount || 0 },
    { key: "categories", label: "Categories", value: catCount || 0 },
    { key: "authors", label: "Authors", value: authorCount || 0 },
  ];
  statsLoaded.value = true;
}

onMounted(() => {
  loadCategories();
  loadStats();
});
</script>
