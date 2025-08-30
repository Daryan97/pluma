<template>
  <div
    v-if="post"
    ref="markdownContainer"
    class="prose prose-lg max-w-none text-gray-900 dark:text-gray-100 dark:prose-invert"
  >
    <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>

    <!-- Post Meta Info -->
    <div class="text-sm text-gray-500 mb-6">
      <span class="inline-flex items-center">
        <Icon icon="mdi:account" class="mr-1" />
        <span class="mr-1">By</span>
        <router-link
          :to="`/author/${post.author?.username}`"
          class="hover:underline"
        >
          {{
            post.author?.display_name ||
            post.author?.username ||
            "Unknown author"
          }}
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
          :to="`/category/${post.category?.name}`"
          class="hover:underline"
        >
          {{ post.category?.name || "Uncategorized" }}
        </router-link>
        {{ post.status }}
      </span>
    </div>

    <!-- Cover Image with fallback -->
    <div
      class="w-full max-h-[400px] rounded mb-6 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800"
    >
      <img
        v-if="post.cover_image_url && !coverImageError"
        :src="post.cover_image_url"
        alt="Cover image"
        class="w-full h-full object-cover"
        loading="lazy"
        draggable="false"
        @dragstart.prevent
        @error="coverImageError = true"
      />
      <NoImage v-else />
    </div>

    <!-- Markdown Content -->
    <Markdown
      :source="post.content"
      class="markdown-content mb-6"
      ref="markdownContainer"
    />

    <!-- Tags -->
    <div v-if="post.tags?.length" class="mt-6">
      <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags:</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="bg-gray-200 dark:bg-gray-700 px-2 py-1 text-sm rounded text-gray-800 dark:text-gray-200 inline-flex items-center"
        >
          <Icon icon="mdi:tag" class="mr-1" />
          {{ tag }}
        </span>
      </div>
    </div>
  </div>

  <!-- Fallback -->
  <div v-else class="text-center text-gray-500 dark:text-gray-400">
    <p>Post not found or is loading...</p>
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
  },
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
