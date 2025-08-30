<template>
  <PostForm mode="edit" :postId="route.params.id" />
</template>

<script setup>
import { useRoute } from "vue-router";
import PostForm from "@/components/PostForm.vue";

const route = useRoute();
</script>
