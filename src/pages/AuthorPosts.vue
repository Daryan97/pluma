<template>
  <div>
    <h1
      class="text-3xl font-bold text-center my-8 text-gray-900 dark:text-gray-100"
    >
      <Icon icon="mdi:account-box" class="inline-block mr-2 text-4xl" />
      Author: {{  $route.params.username }}
    </h1>
    <PostLoader filterBy="author" :filterValue="$route.params.username" />
  </div>
</template>

<script setup>
import PostLoader from "@/components/PostLoader.vue";
import { Icon } from "@iconify/vue";
</script>
