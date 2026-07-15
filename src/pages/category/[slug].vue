<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div>
      <div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div>
      <div class="max-w-6xl mx-auto px-4 pt-20 pb-14 lg:pt-28 lg:pb-20 relative">
        <div class="flex flex-col items-center text-center gap-8">
          <div
            v-if="headerLoading"
            class="inline-flex flex-col items-center gap-5 animate-pulse"
            aria-hidden="true"
          >
            <div class="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700" />
            <div class="h-9 w-40 rounded bg-gray-200 dark:bg-gray-700" />
            <div class="flex flex-wrap items-center justify-center gap-2">
              <div class="h-6 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
              <div class="h-6 w-28 rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div v-else class="inline-flex flex-col items-center gap-5">
            <div class="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">
              <Icon :icon="isUncategorized ? 'mdi:tag-off' : 'mdi:tag'" class="text-3xl" />
            </div>
            <div class="space-y-5 max-w-3xl">
              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                {{ displayName }}
              </h1>
              <div class="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium">
                <span
                  v-if="postCount !== null"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  <Icon icon="mdi:book-open-page-variant" class="text-sm" /> {{ postCount }} {{ postCount === 1 ? t('posts.post') : t('posts.posts') }}
                </span>
                <span v-if="isUncategorized" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">
                  <Icon icon="mdi:alert-circle-outline" class="text-sm" /> {{ t('category.noCategory') }}
                </span>
                <a
                  v-if="rssHref"
                  :href="rssHref"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[11px] font-semibold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition"
                >
                  <Icon icon="mdi:rss" class="text-sm" />
                  {{ t('category.followRss') }}
                </a>
              </div>
            </div>
          </div>
          <div v-if="featuresSettingsLoaded && featuresEnabled.search" class="w-full max-w-xl">
            <div
              role="button"
              tabindex="0"
              aria-label="Open global search"
              @click="openGlobalSearch"
              @keydown.enter.prevent="openGlobalSearch"
              @keydown.space.prevent="openGlobalSearch"
              class="group flex items-center h-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm ring-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none px-4 gap-3"
            >
              <Icon icon="mdi:magnify" class="text-gray-500 dark:text-gray-400 text-xl" />
              <span class="flex-1 text-left text-sm text-gray-500 dark:text-gray-400">
                {{ t('category.searchAnywhere') }}
              </span>
              <span class="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium pr-1">
                <kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-300 shadow-sm">/</kbd>
                Open
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm sticky top-0 z-20" v-if="!categoriesLoaded || categories.length">
      <div class="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-track-transparent">
        <template v-if="!categoriesLoaded">
          <div
            v-for="n in 4"
            :key="'cat-chip-sk-' + n"
            class="animate-pulse h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"
            aria-hidden="true"
          />
        </template>
        <template v-else>
          <button @click="goToCategory('all')" :class="categoryActive === 'all' ? activeCatClass : catClass" class="flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium">
            <Icon icon="mdi:infinity" class="text-sm" /> {{ t('common.all') }}
          </button>
          <button v-for="c in categories" :key="c.slug || ('null-'+c.id)" @click="goToCategory(c.slug || 'uncategorized')" :class="categoryActive === (c.slug || 'uncategorized') ? activeCatClass : catClass" class="flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium">
            <Icon icon="mdi:folder" class="text-sm" /> {{ c.name || 'Uncategorized' }}
          </button>
        </template>
      </div>
    </section>
    <main class="relative -mt-4">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <h2 class="sr-only">Category Posts</h2>
        <PostLoader filterBy="category" :filterValue="$route.params.slug" />
      </div>
    </main>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { contentLocale } = useContentLocale()

import PostLoader from '@/components/PostLoader.vue'
import { Icon } from '@iconify/vue'
import { supabase } from '@/services/supabase'
import { countLogicalPosts } from '@/lib/postCount'
import { rssHref as buildRssHref } from '@/lib/feedUrls'
import {
  resolveCategoryFilter,
  loadCategoriesForLocale,
} from '@/lib/categoryScope'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettings } from '@/stores/settingsStore'
import { useBranding } from '@/stores/brandingStore'
import { usePageSeo } from '@/composables/usePageSeo'
import { projectInfo } from '@/config/projectInfo'

const route = useRoute()
const router = useRouter()
const branding = useBranding()
const category = ref(null)
const countLoading = ref(true)
const headerLoading = ref(true)
const postCount = ref(null)
let fetchSeq = 0

const categories = ref([])
const categoriesLoaded = ref(false)
const categoryActive = ref(route.params.slug || 'all')
const catClass = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
const activeCatClass = 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-blue-600 dark:border-blue-500 shadow'

function openGlobalSearch(){
  const evt = new CustomEvent('pluma:open-global-search', { detail: { query: '' } })
  window.dispatchEvent(evt)
}

const { featuresEnabled, featuresSettingsLoaded } = useSettings();
const isUncategorized = computed(() => route.params.slug === 'uncategorized')
const displayName = computed(() => {
  if (isUncategorized.value) return t('common.uncategorized')
  return category.value?.name || route.params.slug
})
const rssHref = computed(() => {
  if (typeof window === 'undefined') return ''
  const slug = route.params.slug
  const path = buildRssHref({
    locale: contentLocale.value,
    primaryLocale: branding.primaryLocale?.value || 'en',
    category: !slug || slug === 'all' ? undefined : slug,
  })
  return `${window.location.origin}${path}`
})

function applyKnownCategory(slug) {
  if (!slug || slug === 'uncategorized') {
    category.value = null
    return
  }
  const known = categories.value.find((c) => c.slug === slug)
  if (known) category.value = known
}

async function fetchCategory() {
  const seq = ++fetchSeq
  const slug = route.params.slug
  countLoading.value = true
  headerLoading.value = true
  postCount.value = null
  applyKnownCategory(slug)

  if (!isUncategorized.value) {
    const { category: resolved, categoryIds } = await resolveCategoryFilter(
      supabase,
      slug,
      contentLocale.value
    )
    if (seq !== fetchSeq) return
    if (resolved) {
      category.value = resolved
    }
    if (categoryIds?.length) {
      const { count } = await countLogicalPosts(supabase, (q) =>
        q
          .eq('status', 'published')
          .eq('locale', contentLocale.value)
          .in('category_id', categoryIds)
      )
      if (seq !== fetchSeq) return
      postCount.value = typeof count === 'number' ? count : 0
    } else {
      postCount.value = 0
    }
  } else {
    category.value = null
    const { count } = await countLogicalPosts(supabase, (q) =>
      q
        .eq('status', 'published')
        .eq('locale', contentLocale.value)
        .is('category_id', null)
    )
    if (seq !== fetchSeq) return
    postCount.value = typeof count === 'number' ? count : 0
  }
  countLoading.value = false
  headerLoading.value = false
}

async function loadCategories(){
  categories.value = await loadCategoriesForLocale(supabase, contentLocale.value)
  categoriesLoaded.value = true
  applyKnownCategory(route.params.slug)
}
function goToCategory(slug){
  if(slug==='all'){ categoryActive.value='all'; router.push(localePath('/')); return; }
  categoryActive.value = slug
  router.push(localePath(`/category/${slug}`))
}

onMounted(()=>{ fetchCategory(); loadCategories(); })
watch(() => route.params.slug, (val)=>{
  categoryActive.value = val || 'all'
  applyKnownCategory(val)
  fetchCategory()
})
watch(contentLocale, () => {
  loadCategories()
  fetchCategory()
})

const siteName = computed(
  () =>
    branding.resolveLocalizedSiteName?.(locale.value) ||
    projectInfo.name ||
    'Pluma'
)

usePageSeo(
  computed(() => ({
    title: `${displayName.value} | ${siteName.value}`,
    description: `Explore posts in ${displayName.value}.`,
    type: 'website',
    collection: true,
  }))
)
</script>
