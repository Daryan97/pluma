<template>
  <PostForm mode="create" />
</template>

<script setup>
definePageMeta({ requiresAuth: true, requiresAuthorOrAdmin: true, ssr: false })

import PostForm from "@/components/PostForm.vue";
</script>
