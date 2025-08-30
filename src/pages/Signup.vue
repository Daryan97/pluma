<template>
  <div
    class="max-w-md mx-auto mt-16 p-6 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 mb-6">
      <Icon
        icon="mdi:account-plus"
        class="text-3xl text-blue-600 dark:text-blue-400"
      />
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white leading-none">
        Sign Up
      </h2>
    </div>

    <!-- Single-step Sign Up Form -->
    <form @submit.prevent="handleSignup" class="space-y-4">
      <!-- Email -->
      <div>
        <label class="block mb-1 text-sm text-gray-700 dark:text-gray-300"
          >Email</label
        >
        <div class="relative">
          <Icon
            icon="mdi:email-outline"
            class="absolute left-3 top-3.5 text-gray-400"
          />
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full pl-10 p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="block mb-1 text-sm text-gray-700 dark:text-gray-300"
          >Password</label
        >
        <div class="relative">
          <Icon
            icon="mdi:lock-outline"
            class="absolute left-3 top-3.5 text-gray-400"
          />
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full pl-10 p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <!-- Username -->
      <div>
        <label class="block mb-1 text-sm text-gray-700 dark:text-gray-300"
          >Username</label
        >
        <div class="relative">
          <Icon
            icon="mdi:account-circle"
            class="absolute left-3 top-3.5 text-gray-400"
          />
          <input
            v-model="username"
            type="text"
            placeholder="yourusername"
            class="w-full pl-10 p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <!-- Display Name -->
      <div>
        <label class="block mb-1 text-sm text-gray-700 dark:text-gray-300"
          >Display Name</label
        >
        <div class="relative">
          <Icon
            icon="mdi:card-account-details-outline"
            class="absolute left-3 top-3.5 text-gray-400"
          />
          <input
            v-model="displayName"
            type="text"
            placeholder="Your Name"
            class="w-full pl-10 p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Icon icon="mdi:account-plus" class="text-xl" />
        <span>Sign Up</span>
      </button>

      <p class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
        Already have an account?
        <router-link
          to="/login"
          class="text-blue-600 dark:text-blue-400 hover:underline"
          >Login</router-link
        >
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/services/supabase";
import { useToast } from "vue-toastification";
import { Icon } from "@iconify/vue";

const toast = useToast();
const email = ref("");
const password = ref("");
const username = ref("");
const displayName = ref("");
const router = useRouter();

async function handleSignup() {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        username: username.value,
        display_name: displayName.value,
      },
    },
  });
  if (error) {
    toast.error(error.message);
    return;
  }
  toast.success("Account created! Please check your email to confirm.");
  router.push("/");
}
</script>
