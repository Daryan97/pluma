<template>
  <div
    class="max-w-md mx-auto mt-16 p-6 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow"
  >
    <div class="flex items-center gap-2 mb-6">
      <Icon
        icon="mdi:login"
        class="text-3xl text-blue-600 dark:text-blue-400"
      />
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white leading-none">
        Login
      </h2>
    </div>

    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm text-gray-700 dark:text-gray-300">
          Email
        </label>
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

      <div>
        <label class="block mb-1 text-sm text-gray-700 dark:text-gray-300">
          Password
        </label>
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
        <div class="text-right mt-1">
          <button
            type="button"
            @click="forgotPassword"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
            :disabled="forgotLoading || loginLoading || magicLinkLoading"
          >
            <span v-if="!forgotLoading">Forgot password?</span>
            <span v-else>Sending reset link...</span>
          </button>
        </div>
      </div>

      <!-- Login Button -->
      <button
        type="submit"
        class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        :disabled="loginLoading || magicLinkLoading || forgotLoading"
      >
        <Icon icon="mdi:login" class="text-xl" />
        <span v-if="!loginLoading">Login</span>
        <span v-else>Logging in...</span>
      </button>

      <!-- Magic Link Button -->
      <button
        type="button"
        class="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500 text-white rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        @click="sendMagicLink"
        :disabled="magicLinkLoading || loginLoading || forgotLoading"
      >
        <Icon icon="mdi:magic-staff" class="text-xl" />
        <span v-if="!magicLinkLoading">Send Magic Link</span>
        <span v-else>Sending link...</span>
      </button>
    </form>
    <button
      type="button"
      @click="signInWithGithub"
      class="mt-2 w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50"
      :disabled="loginLoading || magicLinkLoading || forgotLoading"
    >
      <Icon icon="mdi:github" class="text-xl" />
      <span>Continue with GitHub</span>
    </button>
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
      Don’t have an account?
      <router-link
        to="/signup"
        class="text-blue-600 dark:text-blue-400 hover:underline"
      >
        Sign up
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";
import { useToast } from "vue-toastification";

const email = ref("");
const password = ref("");

const loginLoading = ref(false);
const magicLinkLoading = ref(false);
const forgotLoading = ref(false);

const toast = useToast();
const router = useRouter();

async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${window.location.origin}` },
  });
  if (error) toast.error(error.message);
}

const login = async () => {
  loginLoading.value = true;

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  loginLoading.value = false;

  if (error) {
    if (error.code === "email_not_confirmed") {
      toast.error(`${error.message}. We have sent a new confirmation email.`);
      await supabase.auth.resend({
        type: "signup",
        email: email.value,
      });
      return;
    }
    toast.error(error.message);
  } else {
    toast.success("Login successful!");
    router.push("/");
  }
};

const forgotPassword = async () => {
  if (!email.value) {
    toast.warning("Please enter your email address first.");
    return;
  }

  forgotLoading.value = true;

  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${location.origin}/change-password`,
  });

  forgotLoading.value = false;

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Password reset link sent to your email.");
  }
};

const sendMagicLink = async () => {
  if (!email.value) {
    toast.warning("Please enter your email to receive a magic link.");
    return;
  }

  magicLinkLoading.value = true;

  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${location.origin}/`,
    },
  });

  magicLinkLoading.value = false;

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Magic link sent! Check your email.");
  }
};
</script>
