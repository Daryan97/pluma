<template>
  <PostForm mode="edit" :postId="String(id)" />
</template>

<script setup>
definePageMeta({ requiresAuth: true, requiresAuthorOrAdmin: true, ssr: false })

import PostForm from "@/components/PostForm.vue";

const route = useRoute();
const id = computed(() => route.params.id);
</script>
