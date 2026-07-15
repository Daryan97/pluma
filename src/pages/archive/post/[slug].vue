<template>
  <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10">
    <PostPageSkeleton v-if="pending" />
    <div v-else-if="!post" class="text-center py-32">
      <Icon icon="mdi:alert-circle-outline" class="text-5xl text-gray-300 dark:text-gray-600 mb-6" />
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('posts.notFound') }}</p>
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
          {{ t('posts.commentsDisabled') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const { contentLocale } = useContentLocale()

import { ref, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import { supabase } from "@/services/supabase";
import Post from "@/components/Post.vue";
import Comments from "@/components/Comments.vue";
import PostPageSkeleton from "@/components/PostPageSkeleton.vue";
import { projectInfo } from "@/config/projectInfo";
import { useBranding } from "@/stores/brandingStore";
import { usePageSeo, articleSeoFromPost } from "@/composables/usePageSeo";

const route = useRoute();
const branding = useBranding();
const user = ref(null);

const POST_SELECT = `
  id,
  title,
  content,
  locale,
  category:categories (
    id,
    name,
    locale
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
`;

const slug = computed(() => route.params.slug);

const { data: post, pending } = await useLazyAsyncData(
  () => `archive-post-${slug.value}-${contentLocale.value}`,
  async () => {
    if (!slug.value) return null;
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("slug", slug.value)
      .eq("locale", contentLocale.value)
      .maybeSingle();
    if (error || !data) return null;
    return data;
  },
  { watch: [slug, contentLocale], server: true }
);

watch(
  post,
  (data) => {
    if (import.meta.client && data) {
      window.__PLUMA_CURRENT_POST = data;
    }
  },
  { immediate: true }
);

const siteName = computed(
  () =>
    branding.resolveLocalizedSiteName?.(locale.value) ||
    projectInfo.name ||
    "Pluma"
);

usePageSeo(
  computed(() => {
    if (post.value) {
      return articleSeoFromPost(post.value, siteName.value);
    }
    if (!pending.value) {
      return {
        title: `${t("posts.notFoundTitle")} | ${siteName.value}`,
        description: t("posts.notFoundMeta"),
        type: "website",
        robots: "noindex, follow",
      };
    }
    return { title: siteName.value, type: "website" };
  })
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

if (import.meta.client) {
  getUser();
}
</script>
