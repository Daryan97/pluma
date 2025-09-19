<template>
  <PostForm mode="edit" :postId="id" />
</template>

<script setup lang="ts">
import PostForm from "@/components/PostForm.vue";
const props = defineProps<{ id: string }>();
const id = props.id;
</script>
