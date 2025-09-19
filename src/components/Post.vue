<template>
  <div v-if="!post" class="text-center text-gray-500 dark:text-gray-400 py-24">
    <Icon
      icon="mdi:file-search-outline"
      class="text-5xl text-gray-300 dark:text-gray-600 mb-4"
    />
    <p class="text-sm">Post not found or is loading...</p>
  </div>

  <article
    v-else
    class="relative"
    itemscope
    itemtype="https://schema.org/Article"
  >
    <!-- Hero Cover -->
    <figure
      class="relative mb-10 group rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/60 bg-gray-100 dark:bg-gray-800"
    >
      <div
        class="relative aspect-[16/7] md:aspect-[16/5] w-full overflow-hidden"
      >
        <img
          v-if="post.cover_image_url && !coverImageError"
          :src="post.cover_image_url"
          :alt="post.title + ' cover image'"
          class="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.25,.1,.25,1)] group-hover:scale-[1.04]"
          loading="lazy"
          draggable="false"
          @dragstart.prevent
          @error="coverImageError = true"
        />
        <NoImage :plain="true" v-else />
        <!-- Gradient Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent"
        ></div>
        <!-- Top meta overlay (category) -->
        <div class="absolute top-4 left-4 flex flex-wrap gap-2">
          <router-link
            :to="`/category/${post.category?.slug || 'uncategorized'}`"
            class="inline-flex items-center gap-1 px-3 h-8 rounded-full text-[11px] font-medium bg-white/80 dark:bg-gray-900/60 text-blue-700 dark:text-blue-300 backdrop-blur hover:bg-white dark:hover:bg-gray-900 transition border border-white/60 dark:border-gray-700/60"
          >
            <Icon icon="mdi:folder" class="text-sm" />
            {{ post.category?.name || "Uncategorized" }}
          </router-link>
        </div>
        <!-- Title/Meta moved below image -->
      </div>
      <meta
        v-if="post.cover_image_url"
        itemprop="image"
        :content="post.cover_image_url"
      />
    </figure>

    <!-- Title and Meta (below image) -->
    <div class="mb-8 px-1">
      <h1
        class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-gray-100"
        itemprop="headline"
      >
        {{ post.title }}
      </h1>
      <div
        class="mt-4 flex flex-wrap items-center gap-3 text-[12px] md:text-[13px] font-medium text-gray-600 dark:text-gray-400"
      >
        <router-link
          v-if="post.author?.username"
          :to="`/author/${post.author.username}`"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Icon icon="mdi:account" class="text-sm" />
          {{ post.author?.display_name || post.author?.username }}
        </router-link>
        <span
          v-if="post.created_at"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          <Icon icon="mdi:calendar" class="text-sm" />
          {{ formatDate(post.created_at) }}
        </span>
        <span
          v-if="readingTime"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          <Icon icon="mdi:clock-outline" class="text-sm" />
          {{ readingTime }} min read
        </span>
      </div>
    </div>

    <!-- Main Body -->
    <div
      ref="markdownContainer"
      class="prose prose-lg dark:prose-invert max-w-none text-gray-900 dark:text-gray-100"
      itemprop="articleBody"
    >
      <Markdown
        :source="post.content"
        class="markdown-content"
        ref="markdownContainer"
      />
    </div>

    <!-- Tags & Share Row -->
    <div class="mt-12 flex flex-col gap-10">
      <div
        v-if="post.tags?.length"
        class="border-t border-gray-200 dark:border-gray-700 pt-8"
      >
        <h4
          class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4"
        >
          Tags
        </h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="inline-flex items-center gap-1 px-3 h-8 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
          >
            <Icon icon="mdi:tag" class="text-sm" /> {{ tag }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-t border-gray-200 dark:border-gray-700"
      >
        <div
          class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
        >
          <Icon icon="mdi:share-variant" class="text-lg text-blue-500" />
          <span class="font-medium">Share this post</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="copyLink"
            class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
          >
            <div v-if="!linkCopied" class="inline-flex items-center gap-1">
              <Icon icon="mdi:link" class="text-base" /> Copy Link
            </div>
            <div v-else class="inline-flex items-center gap-1">
              <Icon icon="mdi:check" class="text-base" /> Link Copied
            </div>
          </button>
          <a
            :href="twitterShareUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/60 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600"
          >
            <Icon icon="mdi:twitter" class="text-base" /> Tweet
          </a>
          <button
            v-if="canNativeShare"
            @click="nativeShare"
            class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
          >
            <Icon icon="mdi:share" class="text-base" /> Share
          </button>
        </div>
      </div>
    </div>
    <meta
      v-if="post.created_at"
      itemprop="datePublished"
      :content="post.created_at"
    />
    <meta
      v-if="post.updated_at"
      itemprop="dateModified"
      :content="post.updated_at || post.created_at"
    />
    <meta
      v-if="post.author?.display_name || post.author?.username"
      itemprop="author"
      :content="post.author?.display_name || post.author?.username"
    />
    <meta
      itemprop="publisher"
      :content="post.author?.display_name || post.author?.username || 'Unknown'"
    />
  </article>
</template>

<script setup>
import { ref, nextTick, watch, computed } from "vue";
import Markdown from "vue3-markdown-it";
import { Icon } from "@iconify/vue";
import NoImage from "./NoImage.vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const readingTime = computed(() => {
  if (!props.post?.content) return null;
  const text = props.post.content
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_\-`~]|!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
});

const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

const twitterShareUrl = computed(() => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(props.post?.title || "Check this out");
  return `https://x.com/intent/tweet?text=${text}&url=${url}`;
});

const linkCopied = ref(false);

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    linkCopied.value = true;
    setTimeout(() => (linkCopied.value = false), 2000);
  } catch {
    toast.error("Failed to copy link");
  }
}

async function nativeShare() {
  try {
    await navigator.share({
      title: props.post?.title,
      url: window.location.href,
    });
  } catch {
    toast.error("Share cancelled or failed");
  }
}

const markdownContainer = ref(null);
const coverImageError = ref(false);

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function addEnhancements() {
  nextTick(() => {
    const preBlocks = markdownContainer.value?.querySelectorAll("pre") || [];

    preBlocks.forEach((pre) => {
      const existing = pre.querySelector(".code-scroll");
      if (existing) return;

      const code = pre.querySelector("code");
      if (!code) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-scroll";
      code.parentNode.insertBefore(wrapper, code);
      wrapper.appendChild(code);

      const language = code.className.match(/language-(\w+)/)?.[1];
      if (language && !pre.querySelector(".language-label")) {
        const label = document.createElement("span");
        label.className = "language-label";
        label.innerText = language.toUpperCase();
        pre.appendChild(label);
      }

      if (!pre.querySelector(".copy-btn")) {
        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.innerText = "Copy";
        btn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(code.innerText);
            btn.innerText = "Copied!";
            setTimeout(() => (btn.innerText = "Copy"), 1500);
          } catch {
            btn.innerText = "Failed";
            setTimeout(() => (btn.innerText = "Copy"), 1500);
          }
        };
        pre.appendChild(btn);
      }
    });

    // If this page was opened by a dev tool, report render time back to the opener for E2E timing
    try {
      if (window.opener && window.opener.postMessage) {
        const navStart = (performance.timing && performance.timing.navigationStart) || 0;
        const renderTime = Math.round(performance.now() - navStart);
        // send only to same origin opener
        window.opener.postMessage({ __pluma_e2e_time: true, time: renderTime }, window.location.origin);
      }
    } catch (e) {
      // ignore
    }
  });
}

watch(
  () => props.post,
  () => {
    coverImageError.value = false;
    addEnhancements();
  },
  { immediate: true }
);
</script>
