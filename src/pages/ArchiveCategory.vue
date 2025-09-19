<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div>
      <div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div>
      <div class="max-w-6xl mx-auto px-4 pt-20 pb-14 lg:pt-28 lg:pb-20 relative">
        <div class="flex flex-col items-center text-center gap-8" v-if="!loading">
          <div class="inline-flex flex-col items-center gap-5">
            <div class="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">
              <Icon :icon="isUncategorized ? 'mdi:tag-off' : 'mdi:tag'" class="text-3xl" />
            </div>
            <div class="space-y-5 max-w-3xl">
              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                Archive · {{ displayName }}
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
        </div>
      </div>
    </section>

    <!-- Category Pills Navigation (Archive) -->
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
        <h2 class="sr-only">Archived Category Posts</h2>
        <div v-if="posts.length === 0 && !loading" class="relative text-center py-24 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm">
          <div class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 opacity-60"></div>
          <Icon icon="mdi:note-remove" class="block mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
          <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">No archived posts in this category.</p>
        </div>
        <div class="space-y-12">
          <article v-for="p in posts" :key="p.id" class="group relative bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <router-link :to="`/archive/post/${p.slug}`" class="block group">
              <div class="relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img v-if="p.cover_image_url && !imageErrorMap[p.id]" :src="p.cover_image_url" :alt="p.title" class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]" loading="lazy" draggable="false" @dragstart.prevent @error="onImageError(p.id)" />
                <div v-else class="flex items-center justify-center h-full">
                  <NoImage />
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </router-link>
            <div class="p-6 md:p-8">
              <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium mb-4">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">
                  <Icon icon="mdi:calendar" class="text-sm" />
                  {{ formatDate(p.created_at) }}
                </span>
              </div>
              <router-link :to="`/archive/post/${p.slug}`" class="group/title block mb-3">
                <h2 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">{{ p.title }}</h2>
              </router-link>
              <div class="flex items-center justify-between">
                <router-link :to="`/archive/post/${p.slug}`" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">
                  <Icon icon="mdi:arrow-right" class="text-base" />
                  Read More
                </router-link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import NoImage from '@/components/NoImage.vue'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug
const loading = ref(true)
const error = ref('')
const category = ref(null)
const posts = ref([])
const postCount = ref(null)
const imageErrorMap = ref({})
function onImageError(id){ imageErrorMap.value = { ...imageErrorMap.value, [id]: true } }

const isUncategorized = computed(() => slug === 'uncategorized')
const displayName = computed(() => isUncategorized.value ? 'Uncategorized' : (category.value?.name || slug))

// pills
const categories = ref([])
const categoriesLoaded = ref(false)
const categoryActive = ref(slug || 'all')
const catClass = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
const activeCatClass = 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-blue-600 dark:border-blue-500 shadow'
function goToCategory(sl){ if(sl==='all'){ categoryActive.value='all'; router.push('/archive'); return } categoryActive.value=sl; router.push(`/archive/category/${sl}`) }
async function loadCategories(){ const { data, error } = await supabase.from('categories').select('id,name,slug').order('name'); if(!error && data){ categories.value = data } categoriesLoaded.value = true }

function formatDate(d){ try { return new Date(d).toLocaleDateString() } catch { return '' } }

async function fetchCategory(){
  if (isUncategorized.value) { category.value = null; return { id: null } }
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .or(`slug.eq.${slug},name.eq.${slug}`)
    .maybeSingle()
  if (error || !data) { return null }
  category.value = data
  return data
}

async function fetchPosts(cat){
  let query = supabase
    .from('posts')
    .select('id, title, slug, created_at, cover_image_url')
    .eq('status', 'archived')
    .order('created_at', { ascending: false })
  if (isUncategorized.value) { query.is('category_id', null) }
  else if (cat?.id) { query.eq('category_id', cat.id) }
  const { data, error } = await query
  if (error) { error.value = 'Failed to load archive' }
  posts.value = data || []
  postCount.value = posts.value.length
}

onMounted(async () => {
  await loadCategories()
  const cat = await fetchCategory()
  if (!cat && !isUncategorized.value) { error.value = 'Category not found'; loading.value = false; return }
  await fetchPosts(cat)
  loading.value = false
})
</script>
