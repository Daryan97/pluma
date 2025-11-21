<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div>
      <div class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"></div>
      <div class="max-w-6xl mx-auto px-4 pt-20 pb-16 lg:pt-28 lg:pb-24 relative">
        <div class="flex flex-col items-center text-center gap-8">
          <div class="space-y-5 max-w-3xl">
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">Archive</h1>
            <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">Browse all archived posts by category or date.</p>
          </div>
          <div v-if="showSearch" class="w-full max-w-xl">
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
              <span class="flex-1 text-left text-sm text-gray-500 dark:text-gray-400">Search articles, categories, authors...</span>
              <span class="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium pr-1">
                <kbd class="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-[10px] font-mono text-gray-600 dark:text-gray-300 shadow-sm">/</kbd>
                Open
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm sticky top-0 z-20" v-if="categoriesLoaded && categories.length">
      <div class="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-track-transparent">
        <button @click="goToCategory('all')" :class="categoryActive === 'all' ? activeCatClass : catClass" class="flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium">
          <Icon icon="mdi:infinity" class="text-sm" /> All
        </button>
        <button v-for="c in categories" :key="c.slug || 'null-' + c.id" @click="goToCategory(c.slug || 'uncategorized')" :class="categoryActive === (c.slug || 'uncategorized') ? activeCatClass : catClass" class="flex items-center gap-1 px-3 h-8 rounded-full whitespace-nowrap transition text-xs font-medium">
          <Icon icon="mdi:folder" class="text-sm" />
          {{ c.name || 'Uncategorized' }}
        </button>
      </div>
    </section>
    <main class="relative -mt-4">
      <div class="max-w-6xl mx-auto px-4 py-12">
        <h2 class="sr-only">Archived Posts</h2>
        <div v-if="posts.length === 0 && loading" class="space-y-10">
          <div v-for="n in 3" :key="n" class="animate-pulse bg-white/90 dark:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm">
            <div class="h-56 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700"></div>
            <div class="p-6 space-y-5">
              <div class="h-5 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div class="flex gap-3">
                <div class="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div class="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div class="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
              <div class="space-y-2">
                <div class="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div class="h-3 w-11/12 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div class="h-3 w-4/5 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
              <div class="h-9 w-32 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
            </div>
          </div>
        </div>

        <div v-if="posts.length === 0 && !loading" class="relative text-center py-24 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700/70 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm">
          <div class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 opacity-60"></div>
          <Icon icon="mdi:note-remove" class="block mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
          <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">No archived posts found.</p>
        </div>
        <div class="space-y-12">
          <article v-for="post in posts" :key="post.id" class="group relative bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <router-link :to="`/archive/post/${post.slug}`" class="block group">
              <div class="relative w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img v-if="post.cover_image_url && !imageErrorMap[post.id]" :src="post.cover_image_url" :alt="post.title" class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.05]" loading="lazy" draggable="false" @dragstart.prevent @error="onImageError(post.id)" />
                <div v-else class="flex items-center justify-center h-full">
                  <NoImage />
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </router-link>
            <div class="p-6 md:p-8">
              <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium mb-4">
                <router-link :to="`/archive/category/${post.category?.slug || 'uncategorized'}`" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                  <Icon icon="mdi:folder" class="text-sm" />
                  {{ getCategoryName(post.category) }}
                </router-link>
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">
                  <Icon icon="mdi:calendar" class="text-sm" />
                  {{ formatDate(post.created_at) }}
                </span>
                <router-link :to="`/author/${getAuthorUsername(post.author)}`" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60">
                  <Icon icon="mdi:account" class="text-sm" />
                  {{ getAuthorName(post.author) }}
                </router-link>
              </div>
              <router-link :to="`/archive/post/${post.slug}`" class="group/title block mb-3">
                <h2 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
                  {{ post.title }}
                </h2>
              </router-link>
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-6">
                <Markdown :source="getExcerptMarkdown(post?.content, 160)" class="markdown-content" ref="markdownContainer" />
              </div>
              <div class="flex items-center justify-between">
                <router-link :to="`/archive/post/${post.slug}`" class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500">
                  <Icon icon="mdi:arrow-right" class="text-base" />
                  Read More
                </router-link>
              </div>
            </div>
          </article>
        </div>
        <div ref="loadMoreTrigger" class="h-12"></div>
        <div v-if="loading && posts.length > 0" class="flex justify-center py-8">
          <Icon icon="mdi:loading" class="animate-spin text-blue-500" width="32" />
        </div>
        <div v-if="noMorePosts && posts.length > 0" class="text-center text-gray-500 mt-8 text-sm">No more posts.</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/services/supabase'
import { Icon } from '@iconify/vue'
import Markdown from 'vue3-markdown-it'
import NoImage from '@/components/NoImage.vue'
import { useSettings, fetchSettings } from '@/stores/settingsStore'

const router = useRouter()
function openGlobalSearch(){ const evt = new CustomEvent('pluma:open-global-search', { detail: { query: '' } }); window.dispatchEvent(evt) }

const { featuresEnabled } = useSettings();
onMounted(() => { fetchSettings() })
const showSearch = computed(() => featuresEnabled.value.search !== false)

const categories = ref([])
const categoriesLoaded = ref(false)
const categoryActive = ref('all')
const catClass = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
const activeCatClass = 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white border-blue-600 dark:border-blue-500 shadow'

async function loadCategories(){
  const { data, error } = await supabase.from('categories').select('id, name, slug').order('name')
  if(!error && data){ categories.value = data }
  categoriesLoaded.value = true
}
function goToCategory(slug){ if(slug==='all'){ categoryActive.value='all'; router.push('/archive'); return } categoryActive.value = slug; router.push(`/archive/category/${slug}`) }

const posts = ref([])
const imageErrorMap = ref({})
function onImageError(id){ imageErrorMap.value = { ...imageErrorMap.value, [id]: true } }
const loading = ref(false)
const noMorePosts = ref(false)
const pageSize = 5
let offset = 0

function getAuthorName(author){ if(!author) return 'Unknown author'; return author.display_name || author.username }
function getAuthorUsername(author){ if(!author) return 'unknown'; return author.username || author.display_name || 'Unknown' }
function getCategoryName(category){ return category ? category.name : 'Uncategorized' }
function formatDate(dateStr){ const date = new Date(dateStr); return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) }
function getExcerptMarkdown(content, maxLength=200){ if(!content) return ''; const excerpt = content.length > maxLength ? content.slice(0, maxLength) + '...' : content; return excerpt }

async function loadPosts(){
  if (loading.value || noMorePosts.value) return
  loading.value = true
  let query = supabase
    .from('posts')
    .select(`
      id,
      title,
      content,
      tags,
      slug,
      cover_image_url,
      created_at,
      category:categories ( id, name, slug ),
      author:profiles ( id, username, display_name, role )
    `)
    .eq('status', 'archived')
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  const { data, error } = await query
  if (error) { loading.value = false; return }
  if (data.length < pageSize) { noMorePosts.value = true }
  posts.value.push(...data)
  offset += pageSize
  loading.value = false
}

const loadMoreTrigger = ref(null)
function handleIntersect(entries){ if(entries[0].isIntersecting){ loadPosts() } }
let observer = null

onMounted(async () => {
  await loadCategories()
  await loadPosts()
  observer = new IntersectionObserver(handleIntersect, { root: null, rootMargin: '200px', threshold: 0 })
  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
})
onUnmounted(() => { if (observer && loadMoreTrigger.value) observer.unobserve(loadMoreTrigger.value) })
</script>
