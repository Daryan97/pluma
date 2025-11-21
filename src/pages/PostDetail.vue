<template>
  <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10">
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
    <div v-else-if="!post" class="text-center py-32">
      <Icon icon="mdi:alert-circle-outline" class="text-5xl text-gray-300 dark:text-gray-600 mb-6" />
      <p class="text-sm text-gray-500 dark:text-gray-400">Post not found. Please check the URL.</p>
    </div>
    <div v-else>
      <Post :post="post" :user="user" />
      <div class="mt-14">
        <Comments
          v-if="!post.comments_disabled"
          :post-id="post.id"
          :post-author-id="post.author?.id"
        />
        <div v-else class="text-center text-gray-500 dark:text-gray-400 text-sm py-10">
          Comments are disabled for this post.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import { supabase } from "@/services/supabase";
import Post from "@/components/Post.vue";
import Comments from "@/components/Comments.vue";
import { projectInfo } from "@/config/projectInfo";

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const user = ref(null);

const slug = ref(route.params.slug);

watch(
  () => route.params.slug,
  (newSlug) => {
    slug.value = newSlug;
    fetchPost();
  },
  { immediate: true }
);

async function getUser() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (currentUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name, role, avatar_url")
      .eq("id", currentUser.id)
      .single();
    user.value = profile || null;
  }
}

async function fetchPost() {
  if (!slug.value) {
    post.value = null;
    loading.value = false;
    return;
  }

  loading.value = true;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      category:categories (
        id,
        name,
        slug
      ),
      tags,
      slug,
      comments_disabled,
      cover_image_url,
      created_at,
      status,
      updated_at,
      author:profiles (
        id,
        username,
        display_name
      )
    `
    )
    .eq("slug", slug.value)
    .single();

  if (error) {
    post.value = null;
  } else if (!data) {
    post.value = null;
  } else {
    post.value = data;
  window.__PLUMA_CURRENT_POST = data;
  }

  loading.value = false;
}

watch(
  post,
  (newPost) => {
    if (newPost !== null) {
      document.title = `${newPost.title} | ${projectInfo.name}`;
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          newPost.content.slice(0, 150) + "..."
        );
      }
    } else {
      document.title = `Post Not Found | ${projectInfo.name}`;
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          "The requested post could not be found."
        );
      }
    }
  },
  { immediate: true }
);

getUser();
</script>
