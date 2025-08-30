<template>
  <div>
    <h1
      class="text-3xl font-bold text-center my-8 text-gray-900 dark:text-gray-100"
    >
      <Icon icon="mdi:category" class="inline-block mr-2 text-4xl" />
      Category: {{ $route.params.slug }}
    </h1>
    <PostLoader filterBy="category" :filterValue="$route.params.slug" />
  </div>
</template>

<script setup>
import PostLoader from "@/components/PostLoader.vue";
import { Icon } from "@iconify/vue";
</script>
