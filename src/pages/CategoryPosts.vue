<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div>
      <div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div>
      <div class="max-w-6xl mx-auto px-4 pt-20 pb-14 lg:pt-28 lg:pb-20 relative">
        <!-- Loading Skeleton -->
        <div v-if="loading" class="flex flex-col items-center text-center gap-8 animate-pulse">
          <div class="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700" />
          <div class="space-y-4 max-w-2xl w-full">
            <div class="h-10 w-64 mx-auto rounded bg-gray-200 dark:bg-gray-700" />
            <div class="flex justify-center gap-3">
              <div class="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <div class="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div class="w-full max-w-xl h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
        </div>

        <!-- Content -->
        <div v-else class="flex flex-col items-center text-center gap-8">
          <div class="inline-flex flex-col items-center gap-5">
            <div class="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">
              <Icon :icon="isUncategorized ? 'mdi:tag-off' : 'mdi:tag'" class="text-3xl" />
            </div>
            <div class="space-y-5 max-w-3xl">
              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                {{ displayName }}
              </h1>
              <div class="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium">
                <span v-if="postCount !== null" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Icon icon="mdi:book-open-page-variant" class="text-sm" /> {{ postCount }} {{ postCount === 1 ? 'Post' : 'Posts' }}
                </span>
                <span v-if="isUncategorized" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">
                  <Icon icon="mdi:alert-circle-outline" class="text-sm" /> No category assigned
                </span>
              </div>
            </div>
          </div>

          <!-- Global Search Trigger -->
          <div v-if="featuresEnabled.search" class="w-full max-w-xl">
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
                Search anywhere...
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

    <!-- Category Pills Navigation -->
    <section class="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm sticky top-0 z-20" v-if="categoriesLoaded && categories.length">
      <div class="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-track-transparent">
        <button @click="goToCategory('all')" :class="categoryActive === 'all' ? activeCatClass : catClass" class="flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium">
          <Icon icon="mdi:infinity" class="text-sm" /> All
        </button>
        <button v-for="c in categories" :key="c.slug || ('null-'+c.id)" @click="goToCategory(c.slug || 'uncategorized')" :class="categoryActive === (c.slug || 'uncategorized') ? activeCatClass : catClass" class="flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium">
          <Icon icon="mdi:folder" class="text-sm" /> {{ c.name || 'Uncategorized' }}
        </button>
      </div>
    </section>

    <!-- Feed -->
    <main class="relative -mt-4">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <h2 class="sr-only">Category Posts</h2>
        <PostLoader filterBy="category" :filterValue="$route.params.slug" />
      </div>
    </main>
  </div>
</template>

<script setup>

import PostLoader from '@/components/PostLoader.vue'
import { Icon } from '@iconify/vue'
import { supabase } from '@/services/supabase'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettings } from '@/stores/settingsStore'

const route = useRoute()
const router = useRouter()
const category = ref(null)
const loading = ref(false)
const postCount = ref(null)

// categories for pill nav
const categories = ref([])
const categoriesLoaded = ref(false)
const categoryActive = ref(route.params.slug || 'all')
const catClass = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
const activeCatClass = 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-blue-600 dark:border-blue-500 shadow'

function openGlobalSearch(){
  const evt = new CustomEvent('pluma:open-global-search', { detail: { query: '' } })
  window.dispatchEvent(evt)
}


const { featuresEnabled } = useSettings();
const isUncategorized = computed(() => route.params.slug === 'uncategorized')
const displayName = computed(() => isUncategorized.value ? 'Uncategorized' : (category.value?.name || route.params.slug))

async function fetchCategory() {
  loading.value = true
  category.value = null
  postCount.value = null
  if (!isUncategorized.value) {
    let { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('slug', route.params.slug)
      .single()
    if (error || !data) {
      const fallback = await supabase
        .from('categories')
        .select('id, name, slug')
        .ilike('slug', route.params.slug)
        .maybeSingle()
      if (!fallback.error && fallback.data) {
        data = fallback.data
        error = null
      }
    }
    if (!error && data) {
      category.value = data
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .eq('category_id', data.id)
      postCount.value = typeof count === 'number' ? count : 0
    }
  } else {
    const { count } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')
      .is('category_id', null)
    postCount.value = typeof count === 'number' ? count : 0
  }
  loading.value = false
}

async function loadCategories(){
  const { data, error } = await supabase.from('categories').select('id,name,slug').order('name')
  if(!error && data){ categories.value = data }
  categoriesLoaded.value = true
}
function goToCategory(slug){
  if(slug==='all'){ categoryActive.value='all'; router.push('/'); return; }
  categoryActive.value = slug
  router.push(`/category/${slug}`)
}

onMounted(()=>{ fetchCategory(); loadCategories(); })
watch(() => route.params.slug, (val)=>{ categoryActive.value = val || 'all'; fetchCategory(); })
</script>
