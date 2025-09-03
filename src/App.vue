<template>
  <div class="relative min-h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
</script>
