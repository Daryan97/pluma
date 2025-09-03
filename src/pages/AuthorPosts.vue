<template>
  <div class="max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mt-10 mb-12 text-center" v-if="!loading && author">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="relative">
          <div class="w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-sm">
            <img
              v-if="author.avatar_url"
              :src="author.avatar_url"
              :alt="author.display_name || author.username"
              class="w-full h-full object-cover"
              loading="lazy"
              draggable="false"
              @dragstart.prevent
              @error="onAvatarError"
            />
            <span v-else class="text-3xl font-semibold text-gray-500 dark:text-gray-400 select-none">
              {{ (author.display_name || author.username || '?').charAt(0).toUpperCase() }}
            </span>
          </div>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {{ author.display_name || author.username }}
          </h1>
          <div class="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">
              <Icon icon="mdi:at" class="text-sm" />@{{ author.username }}
            </span>
            <span v-if="postCount !== null" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <Icon icon="mdi:book-open-variant" class="text-sm" /> {{ postCount }} {{ postCount === 1 ? 'Post' : 'Posts' }}
            </span>
            <span v-if="author.role" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 capitalize">
              <Icon icon="mdi:shield-account" class="text-sm" /> {{ author.role }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading header skeleton -->
    <div v-if="loading" class="mt-10 mb-12 flex flex-col items-center animate-pulse">
      <div class="w-28 h-28 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-4" />
      <div class="h-7 w-48 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
      <div class="flex gap-2">
        <div class="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <!-- Not found state -->
    <div v-if="!loading && !author" class="text-center my-24">
      <Icon icon="mdi:account-off" class="text-5xl text-gray-400 mb-4" />
      <p class="text-sm text-gray-600 dark:text-gray-400">Author not found.</p>
    </div>

    <!-- Posts -->
    <PostLoader v-if="author" filterBy="author" :filterValue="$route.params.username" />
  </div>
</template>

<script setup>
import PostLoader from '@/components/PostLoader.vue'
import { Icon } from '@iconify/vue'
import { supabase } from '@/services/supabase'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const author = ref(null)
const loading = ref(false)
const postCount = ref(null)

async function fetchAuthor() {
  loading.value = true
  author.value = null
  postCount.value = null
  const username = route.params.username
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, role')
    .eq('username', username)
    .single()
  if (!error && data) {
    author.value = data
    const { count } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('author_id', data.id)
    postCount.value = typeof count === 'number' ? count : 0
  }
  loading.value = false
}

function onAvatarError(e) {
  if (author.value) author.value.avatar_url = null
}

onMounted(fetchAuthor)
watch(() => route.params.username, fetchAuthor)
</script>
