<template>
  <div class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10">
    <div
      v-if="isPreview"
      class="mb-6 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-700 px-4 py-2 text-sm text-amber-800 dark:text-amber-200"
    >
      {{ t('posts.previewMode') }}
    </div>
    <PostPageSkeleton v-if="pending" />
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
const { t, locale } = useI18n()
const { contentLocale } = useContentLocale()

import { ref, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import { supabase } from "@/services/supabase";
import Post from "@/components/Post.vue";
import Comments from "@/components/Comments.vue";
import SeriesNav from "@/components/SeriesNav.vue";
import PostPageSkeleton from "@/components/PostPageSkeleton.vue";
import { projectInfo } from "@/config/projectInfo";
import { useBranding } from "@/stores/brandingStore";
import { usePageSeo, articleSeoFromPost } from "@/composables/usePageSeo";

const route = useRoute();
const branding = useBranding();
const user = ref(null);
const seriesPosts = ref([]);

const isPreview = computed(() => Boolean(route.query.preview));

const POST_SELECT = `
  id,
  title,
  content,
  locale,
  category:categories (
    id,
    name,
    slug,
    locale
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
`;

async function loadSeriesPosts(seriesId) {
  if (!seriesId) {
    seriesPosts.value = [];
    return;
  }
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, series_order, locale")
    .eq("series_id", seriesId)
    .eq("status", "published")
    .eq("locale", contentLocale.value)
    .order("series_order", { ascending: true, nullsFirst: false });
  seriesPosts.value = data || [];
}

async function fetchPostPayload(slug, previewToken, locale) {
  if (!slug) return null;

  if (previewToken) {
    const { data, error } = await supabase.rpc("get_post_by_preview_token", {
      p_token: previewToken,
    });
    if (error || !data) return null;
    if (data.series_id) {
      const { data: seriesRow } = await supabase
        .from("series")
        .select("id, name, slug")
        .eq("id", data.series_id)
        .maybeSingle();
      data.series = seriesRow || null;
    }
    return data;
  }

  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("locale", locale)
    .maybeSingle();

  if (error || !data) return null;

  if (data.series_id) {
    const { data: seriesRow } = await supabase
      .from("series")
      .select("id, name, slug")
      .eq("id", data.series_id)
      .maybeSingle();
    data.series = seriesRow || null;
  }
  return data;
}

const slug = computed(() => route.params.slug);
const previewToken = computed(() =>
  typeof route.query.preview === "string" ? route.query.preview : null
);

const { data: post, pending } = await useLazyAsyncData(
  () => `post-${slug.value}-${contentLocale.value}-${previewToken.value || "pub"}`,
  async () => {
    const data = await fetchPostPayload(
      slug.value,
      previewToken.value,
      contentLocale.value
    );
    return data;
  },
  { watch: [slug, contentLocale, previewToken], server: true }
);

const seriesMeta = computed(() => post.value?.series || null);

watch(
  post,
  async (data) => {
    if (import.meta.client && data) {
      window.__PLUMA_CURRENT_POST = data;
    }
    if (data?.series_id) {
      await loadSeriesPosts(data.series_id);
    } else {
      seriesPosts.value = [];
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
    return {
      title: siteName.value,
      type: "website",
    };
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
