<template>
  <div class="max-w-4xl mx-auto mt-10">
    <div v-if="posts.length === 0 && loading" class="flex justify-center">
      <Icon icon="mdi:loading" class="animate-spin text-blue-500" width="48" />
    </div>

    <div
      v-if="posts.length === 0 && !loading"
      class="text-center text-gray-500"
    >
      No posts found.
    </div>

    <div
      v-for="post in posts"
      :key="post.id"
      class="rounded-lg p-4 mb-10 border pb-6 border-gray-200 dark:border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
    >
      <!-- Cover Image with fallback -->
      <router-link :to="`/posts/${post.slug}`" class="block">
        <div
          class="w-full h-64 rounded-t-lg mb-4 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
          <img
            v-if="post.cover_image_url && !imageErrorMap[post.id]"
            :src="post.cover_image_url"
            alt="Cover image"
            class="w-full h-full object-cover"
            loading="lazy"
            draggable="false"
            @dragstart.prevent
            @error="onImageError(post.id)"
          />
          <NoImage v-else />
        </div>
      </router-link>

      <router-link :to="`/posts/${post.slug}`" class="block hover:underline">
        <h2 class="text-2xl font-bold mb-1">{{ post.title }}</h2>
      </router-link>
      <div class="text-sm text-gray-500 mb-6">
        <span class="inline-flex items-center">
          <Icon icon="mdi:account" class="mr-1" />
          <span class="mr-1">By</span>
          <router-link
            :to="`/author/${getAuthorUsername(post.author)}`"
            class="hover:underline"
          >
            {{ getAuthorName(post.author) }}
          </router-link>
        </span>
        <span class="mx-2">|</span>
        <span class="inline-flex items-center">
          <Icon icon="mdi:calendar" class="mr-1" />
          {{ formatDate(post.created_at) }}
        </span>
        <span class="mx-2">|</span>
        <span class="inline-flex items-center">
          <Icon icon="mdi:folder" class="mr-1" />
          <router-link
            :to="`/category/${getCategoryName(post.category)}`"
            class="hover:underline"
          >
            {{ getCategoryName(post.category) }}
          </router-link>
        </span>
      </div>
      <p class="text-gray-700 dark:text-gray-300 mb-2">
        <Markdown
          :source="getExcerptMarkdown(post?.content, 100)"
          class="markdown-content mb-6"
          ref="markdownContainer"
        />
      </p>
      <router-link
        :to="`/posts/${post.slug}`"
        class="text-blue-600 hover:underline"
      >
        Read more
      </router-link>
    </div>

    <!-- This div will be observed for intersection to trigger loading more -->
    <div ref="loadMoreTrigger" class="h-10"></div>

    <div v-if="loading && posts.length > 0" class="flex justify-center">
      <Icon icon="mdi:loading" class="animate-spin text-blue-500" width="32" />
    </div>

    <div
      v-if="noMorePosts && posts.length > 0"
      class="text-center text-gray-500 mt-4"
    >
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

  if (
    props.filterBy === "category" &&
    props.filterValue &&
    props.filterValue !== "Uncategorized"
  ) {
    const { data: cat, error: catErr } = await supabase
      .from("categories")
      .select("id")
      .eq("name", props.filterValue)
      .single();

    if (catErr) {
      loading.value = false;
      return;
    }
    cat_id = cat ? cat.id : null;
  } else if (props.filterBy === "author" && props.filterValue) {
    const { data: author, error: authorErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", props.filterValue)
      .single();

    if (authorErr) {
      loading.value = false;
      return;
    }
    author_id = author ? author.id : null;
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
    category:categories ( id, name ),
    author:profiles ( id, username, display_name, role )
  `
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (props.filterBy === "category" && cat_id !== null) {
    query.eq("category_id", cat_id);
  } else if (props.filterBy === "author") {
    query.eq("author_id", author_id);
  } else if (
    (props.filterBy === "category" && props.filterValue === "Uncategorized") ||
    (props.filterBy === "category" && cat_id === null)
  ) {
    query.is("category_id", null);
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
  if (props.filterBy === "author") {
    const { data: authorProfile, error: authorErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("username", props.filterValue)
      .single();
    if (authorErr || !["admin", "author"].includes(authorProfile?.role)) {
      toast.error("Author not found or not authorized");
      router.back();
      return;
    }
  }
  loadPosts();

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
