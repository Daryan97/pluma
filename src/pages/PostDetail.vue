<template>
  <div
    class="max-w-4xl mx-auto mt-10 border p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow border-gray-200 dark:border-gray-700"
  >
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div
        class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="!post && !loading" class="text-center text-gray-500">
      Post not found, please check the URL or try again later.
    </div>

    <div v-else-if="post" class="max-w-4xl mx-auto mt-10">
      <Post :post="post" />
      <Comments
        v-if="!post.comments_disabled"
        class="mt-10"
        :post-id="post.id"
        :post-author-id="post.author?.id"
      />
      <div v-else class="mt-10 text-center text-gray-500">
        Comments are disabled for this post.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/services/supabase";
import Post from "@/components/Post.vue";
import Comments from "@/components/Comments.vue";
import { projectInfo } from "@/config/projectInfo";

const route = useRoute();
const post = ref(null);
const loading = ref(true);

const slug = ref(route.params.slug);

watch(
  () => route.params.slug,
  (newSlug) => {
    slug.value = newSlug;
    fetchPost();
  },
  { immediate: true }
);

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
        name
      ),
      tags,
      slug,
      comments_disabled,
      cover_image_url,
      created_at,
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
</script>
