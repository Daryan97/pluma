<template>
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
  <div class="mt-10 mb-12 text-center" v-if="!loading">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">
          <Icon icon="mdi:category" class="text-3xl" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {{ displayName }}
          </h1>
          <div class="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium">
            <span v-if="postCount !== null" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <Icon icon="mdi:book-open-page-variant" class="text-sm" /> {{ postCount }} {{ postCount === 1 ? 'Post' : 'Posts' }}
            </span>
            <span v-if="isUncategorized" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">
              <Icon icon="mdi:tag-off" class="text-sm" /> No category
            </span>
          </div>
          <!-- Optional description removed (column may not exist). Re-add if schema provides it. -->
        </div>
      </div>
    </div>

    <!-- Loading header skeleton -->
    <div v-if="loading" class="mt-10 mb-12 flex flex-col items-center animate-pulse">
      <div class="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-4" />
      <div class="h-7 w-56 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
      <div class="flex gap-2">
        <div class="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

  <!-- Posts -->
  <PostLoader filterBy="category" :filterValue="$route.params.slug" />
  </div>
</template>

<script setup>
import PostLoader from '@/components/PostLoader.vue'
import { Icon } from '@iconify/vue'
import { supabase } from '@/services/supabase'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const category = ref(null)
const loading = ref(false)
const postCount = ref(null)

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

onMounted(fetchCategory)
watch(() => route.params.slug, fetchCategory)
</script>
