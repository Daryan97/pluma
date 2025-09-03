<template>
  <div class="max-w-5xl mx-auto">
    <!-- Empty & Loading States -->
    <div v-if="posts.length === 0 && loading" class="space-y-8">
      <div v-for="n in 3" :key="n" class="animate-pulse bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <div class="h-56 bg-gray-100 dark:bg-gray-700"></div>
        <div class="p-6 space-y-4">
          <div class="h-6 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
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
          <div class="h-8 w-28 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>

    <div v-if="posts.length === 0 && !loading" class="text-center text-gray-500 py-20">
      <Icon icon="mdi:note-remove" class="block mx-auto text-4xl text-gray-400 mb-3" />
      <p class="text-sm">No posts found.</p>
    </div>

    <!-- Posts List -->
    <div class="space-y-12">
      <article
        v-for="post in posts"
        :key="post.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <!-- Media -->
        <router-link :to="`/posts/${post.slug}`" class="block group">
          <div class="w-full aspect-[16/8] md:aspect-[16/6] overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              v-if="post.cover_image_url && !imageErrorMap[post.id]"
              :src="post.cover_image_url"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              draggable="false"
              @dragstart.prevent
              @error="onImageError(post.id)"
            />
            <div v-else class="flex items-center justify-center h-full">
              <NoImage />
            </div>
          </div>
        </router-link>

        <!-- Content -->
        <div class="p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium mb-4">
            <router-link
              :to="`/category/${post.category?.slug || 'uncategorized'}`"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <Icon icon="mdi:folder" class="text-sm" />
              {{ getCategoryName(post.category) }}
            </router-link>
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400">
              <Icon icon="mdi:calendar" class="text-sm" /> {{ formatDate(post.created_at) }}
            </span>
            <router-link
              :to="`/author/${getAuthorUsername(post.author)}`"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >
              <Icon icon="mdi:account" class="text-sm" /> {{ getAuthorName(post.author) }}
            </router-link>
          </div>
          <router-link :to="`/posts/${post.slug}`" class="group/title block mb-3">
            <h2 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
              {{ post.title }}
            </h2>
          </router-link>
          <div class="text-sm text-gray-600 dark:text-gray-300 mb-6">
            <Markdown
              :source="getExcerptMarkdown(post?.content, 160)"
              class="markdown-content"
              ref="markdownContainer"
            />
          </div>
          <div class="flex items-center justify-between">
            <router-link
              :to="`/posts/${post.slug}`"
              class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              <Icon icon="mdi:arrow-right" class="text-base" />
              Read More
            </router-link>
          </div>
        </div>
      </article>
    </div>

    <!-- Intersection trigger -->
    <div ref="loadMoreTrigger" class="h-12"></div>

    <!-- Loading more indicator -->>
    <div v-if="loading && posts.length > 0" class="flex justify-center py-8">
      <Icon icon="mdi:loading" class="animate-spin text-blue-500" width="32" />
    </div>

    <div v-if="noMorePosts && posts.length > 0" class="text-center text-gray-500 mt-8 text-sm">
      No more posts.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";
import Markdown from "vue3-markdown-it";
import { projectInfo } from "@/config/projectInfo";
import { useToast } from "vue-toastification";
import NoImage from "./NoImage.vue";

const posts = ref([]);
const imageErrorMap = ref({});
function onImageError(id) {
  imageErrorMap.value = { ...imageErrorMap.value, [id]: true };
}
const loading = ref(false);
const noMorePosts = ref(false);
const pageSize = 5;
let offset = 0;

const loadMoreTrigger = ref(null);

const toast = useToast();
const router = useRouter();

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
  if (!author) return "Unknown author";
  return author.display_name || author.username;
}

function getAuthorUsername(author) {
  if (!author) return "unknown";
  return author.username || author.display_name || "Unknown";
}

function getCategoryName(category) {
  return category ? category.name : "Uncategorized";
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getExcerptMarkdown(content, maxLength = 200) {
  if (!content) return "";
  const excerpt =
    content.length > maxLength ? content.slice(0, maxLength) + "..." : content;
  return excerpt;
}

async function loadPosts() {
  if (loading.value || noMorePosts.value) return;

  loading.value = true;

  var cat_id = null;
  var author_id = null;

  if (props.filterBy === 'category' && props.filterValue) {
    if (props.filterValue.toLowerCase() === 'uncategorized') {
      cat_id = null;
    } else {
      const { data: cat, error: catErr } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', props.filterValue)
        .single();
      if (catErr) {
        loading.value = false;
        return;
      }
      cat_id = cat ? cat.id : null;
    }
  } else if (props.filterBy === "author" && props.filterValue) {
    const { data: author, error: authorErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", props.filterValue)
      .single();
    if (authorErr || !author) {
      noMorePosts.value = true;
      loading.value = false;
      return;
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
    cover_image_url,
    created_at,
  category:categories ( id, name, slug ),
    author:profiles ( id, username, display_name, role )
  `
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (props.filterBy === 'category' && props.filterValue && props.filterValue.toLowerCase() !== 'uncategorized' && cat_id !== null) {
    query.eq('category_id', cat_id);
  } else if (props.filterBy === 'author') {
    if (author_id) {
      query.eq('author_id', author_id);
    }
  } else if (props.filterBy === 'category' && (props.filterValue.toLowerCase() === 'uncategorized' || cat_id === null)) {
    query.is('category_id', null);
  }

  const { data, error } = await query;

  if (error) {
    toast.error("Failed to load posts: " + (error.message || "Unknown error"));
    loading.value = false;
    return;
  } else {
    if (data.length < pageSize) {
      noMorePosts.value = true;
    }
    posts.value.push(...data);
    offset += pageSize;
  }

  loading.value = false;
}

function handleIntersect(entries) {
  if (entries[0].isIntersecting) {
    loadPosts();
  }
}

let observer = null;

onMounted(async () => {
  await loadPosts();

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
  [() => props.filterBy, () => props.filterValue],
  ([newFilterBy, newFilterValue]) => {
    posts.value = [];
    offset = 0;
    noMorePosts.value = false;
    loadPosts();
  }
);

onMounted(() => {
  document.title = `${
    props.filterBy.charAt(0).toUpperCase() + props.filterBy.slice(1)
  }: ${props.filterValue || "All"} | ${projectInfo.name}`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      `Explore ${props.filterBy} posts${
        props.filterValue ? ` on ${props.filterValue}` : ""
      } at ${projectInfo.name}.`
    );
  }
});
</script>
