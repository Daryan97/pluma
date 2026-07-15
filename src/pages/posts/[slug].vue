<template>
  <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10">
    <div
      v-if="isPreview"
      class="mb-6 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-700 px-4 py-2 text-sm text-amber-800 dark:text-amber-200"
    >
      {{ t('posts.previewMode') }}
    </div>
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
    <div v-else-if="!post" class="text-center py-32">
      <Icon icon="mdi:alert-circle-outline" class="text-5xl text-gray-300 dark:text-gray-600 mb-6" />
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('posts.notFound') }}</p>
    </div>
    <div v-else>
      <Post :post="post" :user="user" />
      <SeriesNav
        v-if="seriesMeta"
        :series="seriesMeta"
        :posts="seriesPosts"
        :current-id="post.id"
      />
      <div class="mt-14">
        <Comments
          v-if="!post.comments_disabled && !isPreview"
          :post-id="post.id"
          :post-author-id="post.author?.id"
        />
        <div v-else-if="post.comments_disabled" class="text-center text-gray-500 dark:text-gray-400 text-sm py-10">
          {{ t('posts.commentsDisabled') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { ref, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import { supabase } from "@/services/supabase";
import Post from "@/components/Post.vue";
import Comments from "@/components/Comments.vue";
import SeriesNav from "@/components/SeriesNav.vue";
import { projectInfo } from "@/config/projectInfo";

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const user = ref(null);
const seriesPosts = ref([]);

const slug = ref(route.params.slug);
const isPreview = computed(() => Boolean(route.query.preview));
const seriesMeta = computed(() => post.value?.series || null);

watch(
  () => [route.params.slug, route.query.preview],
  ([newSlug]) => {
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

async function loadSeriesPosts(seriesId) {
  if (!seriesId) {
    seriesPosts.value = [];
    return;
  }
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, series_order")
    .eq("series_id", seriesId)
    .eq("status", "published")
    .order("series_order", { ascending: true, nullsFirst: false });
  seriesPosts.value = data || [];
}

async function fetchPost() {
  if (!slug.value) {
    post.value = null;
    loading.value = false;
    return;
  }

  loading.value = true;
  seriesPosts.value = [];

  const previewToken = typeof route.query.preview === "string" ? route.query.preview : null;

  if (previewToken) {
    const { data, error } = await supabase.rpc("get_post_by_preview_token", {
      p_token: previewToken,
    });
    if (error || !data) {
      post.value = null;
    } else {
      post.value = data;
      if (import.meta.client) window.__PLUMA_CURRENT_POST = data;
      if (data.series_id) await loadSeriesPosts(data.series_id);
    }
    loading.value = false;
    return;
  }

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
      series_id,
      series_order,
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

  if (error || !data) {
    post.value = null;
  } else {
    if (data.series_id) {
      const { data: seriesRow } = await supabase
        .from("series")
        .select("id, name, slug")
        .eq("id", data.series_id)
        .maybeSingle();
      data.series = seriesRow || null;
      await loadSeriesPosts(data.series_id);
    }
    post.value = data;
    if (import.meta.client) window.__PLUMA_CURRENT_POST = data;
  }

  loading.value = false;
}

watch(
  post,
  (newPost) => {
    if (!import.meta.client) return;
    if (newPost !== null) {
      document.title = `${newPost.title} | ${projectInfo.name}`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          (newPost.content || "").slice(0, 150) + "..."
        );
      }
    } else {
      document.title = `${t('posts.notFoundTitle')} | ${projectInfo.name}`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          t('posts.notFoundMeta')
        );
      }
    }
  },
  { immediate: true }
);

getUser();
</script>
