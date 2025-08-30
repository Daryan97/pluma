<template>
  <div>
    <h1
      class="text-3xl font-bold text-center my-8 text-gray-900 dark:text-gray-100"
    >
      <Icon icon="mdi:newspaper" class="inline-block mr-2 text-4xl" />
      Latest posts from {{ projectInfo.name }}
    </h1>
    <PostLoader filterBy="home" />
  </div>
</template>

<script setup>
import PostLoader from "@/components/PostLoader.vue";
import { projectInfo } from "@/config/projectInfo";
import { Icon } from "@iconify/vue";
</script>
