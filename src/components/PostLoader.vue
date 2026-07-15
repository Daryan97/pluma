<template>
  <div :class="rootMaxClass">
    <!-- Skeletons matching active layout -->
    <div v-if="showListSkeleton">
      <div v-if="layout === 'magazine'" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div
          v-for="n in 3"
          :key="n"
          :class="[
            'bg-white/90 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/60 rounded-2xl overflow-hidden',
            n === 1 ? 'md:col-span-2' : '',
          ]"
        >
          <div
            :class="[
              'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700',
              n === 1 ? 'aspect-[16/7]' : 'aspect-[16/10]',
            ]"
          />
          <div class="p-5 space-y-3">
            <div class="h-3 w-24 rounded bg-gray-200 dark:bg-gray-600" />
            <div class="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-600" />
            <div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-600" />
          </div>
        </div>
      </div>
      <div v-else-if="layout === 'compact'" class="space-y-3 animate-pulse">
        <div
          v-for="n in 5"
          :key="n"
          class="flex gap-4 items-center rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/70 p-3"
        >
          <div class="h-16 w-24 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-600" />
          <div class="flex-1 space-y-2 min-w-0">
            <div class="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-600" />
            <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-600" />
          </div>
        </div>
      </div>
      <div v-else class="space-y-10 animate-pulse">
        <div
          v-for="n in 3"
          :key="n"
          class="bg-white/90 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm"
        >
          <div
            class="aspect-[16/8] md:aspect-[16/6] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700"
          />
          <div class="p-6 md:p-8 space-y-5">
            <div class="flex flex-wrap gap-3">
              <div class="h-6 w-28 bg-gray-200 dark:bg-gray-600 rounded-md" />
              <div class="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded-md" />
              <div class="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded-md" />
            </div>
            <div class="h-7 w-3/4 bg-gray-200 dark:bg-gray-600 rounded" />
            <div class="space-y-2">
              <div class="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded" />
              <div class="h-3 w-11/12 bg-gray-200 dark:bg-gray-600 rounded" />
              <div class="h-3 w-4/5 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
            <div class="h-9 w-32 bg-gray-200 dark:bg-gray-600 rounded-md" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="showEmptyState"
      class="relative text-center py-24 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm"
    >
      <div
        class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 opacity-60"
      />
      <Icon
        icon="mdi:note-remove"
        class="block mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4"
      />
      <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {{ t("posts.noPosts") }}
      </p>
    </div>

    <!-- Classic stacked cards -->
    <div
      v-else-if="layout === 'classic'"
      class="space-y-12 transition-opacity duration-200"
      :class="{ 'opacity-50 pointer-events-none': refreshing && posts.length > 0 }"
    >
      <article
        v-for="post in posts"
        :key="post.id"
        class="group relative bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      >
        <router-link :to="localePath(`/posts/${post.slug}`)" class="block group">
          <div
            class="relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700"
          >
            <img
              v-if="post.cover_image_url && !imageErrorMap[post.id]"
              :src="post.cover_image_url"
              :alt="post.title"
              width="1200"
              height="675"
              class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]"
              loading="lazy"
              decoding="async"
              draggable="false"
              @dragstart.prevent
              @error="onImageError(post.id)"
            />
            <div v-else class="flex items-center justify-center h-full">
              <NoImage />
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </router-link>

        <div class="p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium mb-4">
            <router-link
              :to="localePath(`/category/${post.category?.slug || 'uncategorized'}`)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <Icon icon="mdi:folder" class="text-sm" />
              {{ getCategoryName(post.category) }}
            </router-link>
            <span
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400"
            >
              <Icon icon="mdi:calendar" class="text-sm" />
              {{ formatDate(post.created_at) }}
            </span>
            <router-link
              :to="localePath(`/author/${getAuthorUsername(post.author)}`)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >
              <Icon icon="mdi:account" class="text-sm" />
              {{ getAuthorName(post.author) }}
            </router-link>
          </div>
          <router-link
            :to="localePath(`/posts/${post.slug}`)"
            class="group/title block mb-3"
          >
            <h2
              class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors"
            >
              {{ post.title }}
            </h2>
          </router-link>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
            {{ getPlainExcerpt(post?.content, 160) }}
          </p>
          <div class="flex items-center justify-between">
            <router-link
              :to="localePath(`/posts/${post.slug}`)"
              class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              <Icon icon="mdi:arrow-right" class="text-base" />
              {{ t("common.readMore") }}
            </router-link>
          </div>
        </div>
      </article>
    </div>

    <!-- Magazine grid -->
    <div
      v-else-if="layout === 'magazine'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-200"
      :class="{ 'opacity-50 pointer-events-none': refreshing && posts.length > 0 }"
    >
      <article
        v-for="(post, index) in posts"
        :key="post.id"
        :class="[
          'group relative bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300',
          index === 0 ? 'md:col-span-2' : '',
        ]"
      >
        <router-link :to="localePath(`/posts/${post.slug}`)" class="block">
          <div
            :class="[
              'relative w-full overflow-hidden bg-gray-100 dark:bg-gray-700',
              index === 0 ? 'aspect-[16/7]' : 'aspect-[16/10]',
            ]"
          >
            <img
              v-if="post.cover_image_url && !imageErrorMap[post.id]"
              :src="post.cover_image_url"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
              draggable="false"
              @dragstart.prevent
              @error="onImageError(post.id)"
            />
            <div v-else class="flex items-center justify-center h-full">
              <NoImage />
            </div>
          </div>
        </router-link>
        <div :class="index === 0 ? 'p-6 md:p-8' : 'p-5'">
          <div class="flex flex-wrap items-center gap-2 text-[11px] font-medium mb-2">
            <router-link
              :to="localePath(`/category/${post.category?.slug || 'uncategorized'}`)"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            >
              <Icon icon="mdi:folder" class="text-sm" />
              {{ getCategoryName(post.category) }}
            </router-link>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400"
            >
              <Icon icon="mdi:calendar" class="text-sm" />
              {{ formatDate(post.created_at) }}
            </span>
            <router-link
              :to="localePath(`/author/${getAuthorUsername(post.author)}`)"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300"
            >
              <Icon icon="mdi:account" class="text-sm" />
              {{ getAuthorName(post.author) }}
            </router-link>
          </div>
          <router-link :to="localePath(`/posts/${post.slug}`)" class="block mb-2">
            <h2
              :class="[
                'font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
                index === 0 ? 'text-xl md:text-2xl' : 'text-lg',
              ]"
            >
              {{ post.title }}
            </h2>
          </router-link>
          <p
            v-if="index === 0"
            class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2"
          >
            {{ getPlainExcerpt(post?.content, 140) }}
          </p>
        </div>
      </article>
    </div>

    <!-- Compact list -->
    <div
      v-else
      class="space-y-2 transition-opacity duration-200"
      :class="{ 'opacity-50 pointer-events-none': refreshing && posts.length > 0 }"
    >
      <article
        v-for="post in posts"
        :key="post.id"
        class="group flex gap-4 items-stretch rounded-xl border border-gray-200/80 dark:border-gray-700/70 bg-white/95 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors overflow-hidden"
      >
        <router-link
          :to="localePath(`/posts/${post.slug}`)"
          class="shrink-0 w-24 sm:w-32 self-stretch bg-gray-100 dark:bg-gray-700"
        >
          <img
            v-if="post.cover_image_url && !imageErrorMap[post.id]"
            :src="post.cover_image_url"
            :alt="post.title"
            class="w-full h-full min-h-[4.5rem] object-cover"
            loading="lazy"
            decoding="async"
            draggable="false"
            @dragstart.prevent
            @error="onImageError(post.id)"
          />
          <div v-else class="flex items-center justify-center h-full min-h-[4.5rem]">
            <NoImage />
          </div>
        </router-link>
        <div class="flex-1 min-w-0 py-3 pe-4 flex flex-col justify-center gap-1">
          <router-link :to="localePath(`/posts/${post.slug}`)">
            <h2
              class="text-base font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              {{ post.title }}
            </h2>
          </router-link>
          <div
            class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400"
          >
            <router-link
              :to="localePath(`/category/${post.category?.slug || 'uncategorized'}`)"
              class="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {{ getCategoryName(post.category) }}
            </router-link>
            <span>{{ formatDate(post.created_at) }}</span>
            <router-link
              :to="localePath(`/author/${getAuthorUsername(post.author)}`)"
              class="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {{ getAuthorName(post.author) }}
            </router-link>
          </div>
        </div>
      </article>
    </div>

    <div ref="loadMoreTrigger" class="h-12"></div>

    <div v-if="loading && posts.length > 0" class="mt-8" aria-hidden="true">
      <div v-if="layout === 'compact'" class="space-y-3 animate-pulse">
        <div
          class="flex gap-4 items-center rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/70 p-3"
        >
          <div class="h-16 w-24 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-600" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-600" />
            <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-600" />
          </div>
        </div>
      </div>
      <div
        v-else
        class="animate-pulse bg-white/90 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/60 rounded-2xl overflow-hidden"
      >
        <div
          class="aspect-[16/8] md:aspect-[16/6] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700"
        />
        <div class="p-6 space-y-4">
          <div class="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-600" />
          <div class="h-3 w-full rounded bg-gray-200 dark:bg-gray-600" />
        </div>
      </div>
    </div>

    <div
      v-if="noMorePosts && posts.length > 0"
      class="text-center text-gray-500 mt-8 text-sm"
    >
      {{ t("posts.noMore") }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";
import { resolveCategoryFilter } from "@/lib/categoryScope";
import { useSiteLayout } from "@/stores/siteLayoutStore";
import NoImage from "./NoImage.vue";

const { t } = useI18n();
const localePath = useLocalePath();
const { contentLocale } = useContentLocale();
const { postListLayout, fetchSiteLayout } = useSiteLayout();

// Do not await — layout can resolve after posts; default is classic.
useLazyAsyncData("site-layout", () => fetchSiteLayout(), {
  server: true,
});

const layout = computed(() => postListLayout.value || "classic");
const rootMaxClass = computed(() =>
  layout.value === "magazine" ? "max-w-6xl mx-auto" : "max-w-5xl mx-auto"
);

const posts = ref([]);
const imageErrorMap = ref({});
function onImageError(id) {
  imageErrorMap.value = { ...imageErrorMap.value, [id]: true };
}
const loading = ref(false);
/** Soft reload: keep previous posts visible while the new filter loads. */
const refreshing = ref(false);
const noMorePosts = ref(false);
const pageSize = 5;
let offset = 0;
let loadSeq = 0;
let skipNextClientReset = false;

const loadMoreTrigger = ref(null);

const toast = useToast();

const props = defineProps({
  filterBy: {
    type: String,
    default: "home",
  },
  filterValue: {
    type: String,
    default: "",
  },
});

function getAuthorName(author) {
  if (!author) return t("common.unknownAuthor");
  return author.display_name || author.username;
}

function getAuthorUsername(author) {
  if (!author) return "unknown";
  return author.username || author.display_name || "Unknown";
}

function getCategoryName(category) {
  return category ? category.name : t("common.uncategorized");
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Plain-text excerpt — avoids vue3-markdown-it cost on list cards. */
function getPlainExcerpt(content, maxLength = 200) {
  if (!content) return "";
  const plain = String(content)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLength ? plain.slice(0, maxLength) + "…" : plain;
}

async function queryPostsPage({ from, to, locale }) {
  let cat_ids = null;
  let author_id = null;

  if (props.filterBy === "category" && props.filterValue) {
    if (props.filterValue.toLowerCase() !== "uncategorized") {
      const { categoryIds, error: catErr } = await resolveCategoryFilter(
        supabase,
        props.filterValue,
        locale
      );
      if (catErr || !categoryIds?.length) {
        return { rows: [], exhausted: true };
      }
      cat_ids = categoryIds;
    }
  } else if (props.filterBy === "author" && props.filterValue) {
    const { data: author, error: authorErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", props.filterValue)
      .maybeSingle();
    if (authorErr || !author) {
      return { rows: [], exhausted: true };
    }
    author_id = author.id;
  }

  let query = supabase
    .from("posts")
    .select(
      `
    id,
    title,
    content,
    tags,
    slug,
    locale,
    cover_image_url,
    created_at,
  category:categories ( id, name, slug, locale ),
    author:profiles ( id, username, display_name, role )
  `
    )
    .eq("status", "published")
    .eq("locale", locale)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (
    props.filterBy === "category" &&
    props.filterValue &&
    props.filterValue.toLowerCase() !== "uncategorized"
  ) {
    if (cat_ids?.length) {
      query = query.in("category_id", cat_ids);
    }
  } else if (props.filterBy === "author") {
    if (author_id) {
      query = query.eq("author_id", author_id);
    }
  } else if (
    props.filterBy === "category" &&
    props.filterValue.toLowerCase() === "uncategorized"
  ) {
    query = query.is("category_id", null);
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = data || [];
  return { rows, exhausted: rows.length < pageSize };
}

const {
  data: initialPage,
  pending: initialPending,
  status: initialStatus,
  refresh: refreshInitialPage,
  error: initialError,
} = await useLazyAsyncData(
  () =>
    `posts-${props.filterBy}-${props.filterValue || "all"}-${contentLocale.value}`,
  async () => {
    const { rows, exhausted } = await queryPostsPage({
      from: 0,
      to: pageSize - 1,
      locale: contentLocale.value,
    });
    return { rows: rows || [], exhausted: !!exhausted };
  },
  {
    watch: [() => props.filterBy, () => props.filterValue, contentLocale],
    server: true,
  }
);

/** True once we have a definitive first-page result (including zero posts). */
const initialSettled = ref(false);

const showListSkeleton = computed(() => {
  if (posts.value.length > 0) return false;
  if (initialSettled.value) return false;
  if (initialPending.value || initialStatus.value === "pending") return true;
  // Data already present (payload / completed fetch) — don't skeleton.
  if (initialPage.value != null) return false;
  if (initialStatus.value === "success" || initialStatus.value === "error") {
    return false;
  }
  // idle without data: brief wait only; onMounted refresh settles it.
  return !initialSettled.value && initialPage.value == null;
});

const showEmptyState = computed(
  () =>
    posts.value.length === 0 &&
    initialSettled.value &&
    !showListSkeleton.value &&
    !loading.value
);

function applyInitialPage(page) {
  if (!page) {
    posts.value = [];
    noMorePosts.value = true;
    offset = 0;
  } else {
    const rows = page.rows || [];
    posts.value = rows;
    noMorePosts.value = !!page.exhausted || rows.length === 0;
    offset = rows.length;
    skipNextClientReset = true;
  }
  loading.value = false;
  refreshing.value = false;
  initialSettled.value = true;
}

watch(
  [initialPage, initialPending, initialStatus, initialError],
  () => {
    if (initialPending.value || initialStatus.value === "pending") return;

    if (initialStatus.value === "error" || initialError.value) {
      applyInitialPage({ rows: [], exhausted: true });
      return;
    }

    if (initialPage.value != null) {
      applyInitialPage(initialPage.value);
      return;
    }

    if (initialStatus.value === "success") {
      applyInitialPage({ rows: [], exhausted: true });
    }
  },
  { immediate: true }
);

async function loadPosts({ reset = false } = {}) {
  if (!reset && (loading.value || noMorePosts.value)) return;

  const seq = ++loadSeq;
  if (reset) {
    offset = 0;
    noMorePosts.value = false;
    refreshing.value = posts.value.length > 0;
  }

  loading.value = true;

  try {
    const { rows, exhausted } = await queryPostsPage({
      from: offset,
      to: offset + pageSize - 1,
      locale: contentLocale.value,
    });
    if (seq !== loadSeq) return;

    if (exhausted) {
      noMorePosts.value = true;
    }
    if (reset) {
      posts.value = rows;
    } else {
      posts.value.push(...rows);
    }
    offset += pageSize;
  } catch (error) {
    if (seq !== loadSeq) return;
    toast.error(
      error?.message
        ? t("posts.loadFailed", { message: error.message })
        : t("posts.loadError")
    );
    if (reset) posts.value = [];
  } finally {
    if (seq === loadSeq) {
      loading.value = false;
      refreshing.value = false;
    }
  }
}

function handleIntersect(entries) {
  if (entries[0].isIntersecting) {
    loadPosts();
  }
}

let observer = null;

onMounted(() => {
  // Recover when SSR payload missed hydrate or status stuck idle/pending.
  if (!initialSettled.value) {
    if (initialPage.value != null) {
      applyInitialPage(initialPage.value);
    } else if (!initialPending.value) {
      refreshInitialPage().finally(() => {
        if (!initialSettled.value && !initialPending.value) {
          applyInitialPage({ rows: [], exhausted: true });
        }
      });
    } else {
      // Pending stuck: hard timeout so we never spin forever.
      const stuckAt = Date.now();
      const timer = setInterval(() => {
        if (initialSettled.value) {
          clearInterval(timer);
          return;
        }
        if (initialPage.value != null) {
          clearInterval(timer);
          applyInitialPage(initialPage.value);
          return;
        }
        if (!initialPending.value || Date.now() - stuckAt > 8000) {
          clearInterval(timer);
          refreshInitialPage().finally(() => {
            if (!initialSettled.value) {
              applyInitialPage({ rows: [], exhausted: true });
            }
          });
        }
      }, 400);
    }
  }

  observer = new IntersectionObserver(handleIntersect, {
    root: null,
    rootMargin: "200px",
    threshold: 0,
  });

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
});

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value);
  }
});

watch(
  [() => props.filterBy, () => props.filterValue, contentLocale],
  () => {
    if (skipNextClientReset) {
      skipNextClientReset = false;
      return;
    }
    initialSettled.value = false;
    posts.value = [];
    noMorePosts.value = false;
    offset = 0;
  }
);
</script>
