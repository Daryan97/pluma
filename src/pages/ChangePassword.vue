<template>
  <div
    v-if="authenticated"
    class="max-w-md mx-auto mt-16 p-6 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow"
  >
    <div class="mb-6">
      <h2
        class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2"
      >
        <Icon
          icon="mdi:lock-reset"
          class="text-3xl text-blue-600 dark:text-blue-400"
        />
        Change Password
      </h2>
    </div>

    <form @submit.prevent="handleReset" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm text-gray-700 dark:text-gray-300"
          >New Password</label
        >
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-md font-medium flex items-center justify-center gap-2"
        :disabled="loading"
      >
        <Icon icon="mdi:check" class="text-xl" />
        <span v-if="!loading">Reset Password</span>
        <span v-else>Updating...</span>
      </button>
    </form>

    <p v-if="errorMsg" class="text-red-500 text-sm mt-4 text-center">
      {{ errorMsg }}
    </p>
    <p v-if="success" class="text-green-600 text-sm mt-4 text-center">
      Password reset successful. You can now log in.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";

const password = ref("");
const errorMsg = ref(null);
const success = ref(false);
const loading = ref(false);
const authenticated = ref(false);

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const { error_code, error_description } = route.query;

  if (error_code || error_description) {
    const errorMessage = decodeURIComponent(
      error_description || "An error occurred."
    );
    router.push({ path: "/login", query: { error: errorMessage } });
    return;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.replace("/login");
  } else {
    authenticated.value = true;
  }
});

const handleReset = async () => {
  loading.value = true;
  errorMsg.value = null;

  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });

  if (error) {
    errorMsg.value = error.message;
  } else {
    success.value = true;
    setTimeout(() => router.push("/login"), 2000);
  }

  loading.value = false;
};
</script>
