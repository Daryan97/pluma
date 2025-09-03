<template>
  <!-- Post Content -->
  <div v-if="post" ref="markdownContainer" class="max-w-none">
    <!-- Cover Image -->
    <div
      class="w-full mb-8 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center aspect-[16/7] md:aspect-[16/6]"
    >
      <img
        v-if="post.cover_image_url && !coverImageError"
        :src="post.cover_image_url"
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-700"
        loading="lazy"
        draggable="false"
        @dragstart.prevent
        @error="coverImageError = true"
      />
      <NoImage v-else />
    </div>

    <!-- Title -->
    <h1
      class="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-5 leading-tight"
    >
      {{ post.title }}
    </h1>

    <!-- Meta Chips -->
    <div
      class="flex flex-wrap items-center gap-2 mb-10 text-[11px] font-medium"
    >
      <router-link
        :to="`/category/${post.category?.slug || 'uncategorized'}`"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
      >
        <Icon icon="mdi:folder" class="text-sm" />
        {{ post.category?.name || "Uncategorized" }}
      </router-link>
      <router-link
        v-if="post.author?.username"
        :to="`/author/${post.author.username}`"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
      >
        <Icon icon="mdi:account" class="text-sm" />
        {{ post.author?.display_name || post.author?.username }}
      </router-link>
      <span
        v-if="post.created_at"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400"
      >
        <Icon icon="mdi:calendar" class="text-sm" />
        {{ formatDate(post.created_at) }}
      </span>
    </div>

    <!-- Content -->
    <div
      class="prose prose-lg dark:prose-invert max-w-none text-gray-900 dark:text-gray-100"
    >
      <Markdown
        :source="post.content"
        class="markdown-content"
        ref="markdownContainer"
      />
    </div>

    <!-- Tags -->
    <div
      v-if="post.tags?.length"
      class="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6"
    >
      <h4
        class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3"
      >
        Tags
      </h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-medium"
        >
          <Icon icon="mdi:tag" class="text-sm" />
          {{ tag }}
        </span>
      </div>
    </div>
  </div>

  <div v-else class="text-center text-gray-500 dark:text-gray-400 py-20">
    <Icon
      icon="mdi:file-search-outline"
      class="text-5xl text-gray-300 dark:text-gray-600 mb-4"
    />
    <p class="text-sm">Post not found or is loading...</p>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import Markdown from "vue3-markdown-it";
import { Icon } from "@iconify/vue";
import NoImage from "./NoImage.vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  }
});

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
