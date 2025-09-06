<template>
  <div class="max-w-md mx-auto mt-14 mb-20">
    <div class="mb-8 text-center">
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 shadow-sm mb-4"
      >
        <Icon icon="mdi:login" class="text-3xl" />
      </div>
      <h1
        class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight"
      >
        Welcome back
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Sign in to continue.
      </p>
    </div>

    <div
      class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
    >
      <form @submit.prevent="login" class="space-y-5" novalidate>
        <!-- Email -->
        <div>
          <label
            class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            <Icon icon="mdi:email-outline" class="text-base text-blue-500" />
            Email
          </label>
          <input
            v-model.trim="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label
              class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Icon icon="mdi:lock-outline" class="text-base text-blue-500" />
              Password
            </label>
            <button
              type="button"
              @click="forgotPassword"
              class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              :disabled="forgotLoading || loginLoading || magicLinkLoading"
            >
              <span v-if="!forgotLoading">Forgot?</span>
              <span v-else>Sending...</span>
            </button>
          </div>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 pr-10 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              <Icon
                :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                class="text-lg"
              />
            </button>
          </div>
        </div>

        <!-- Primary Login -->
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"
          :disabled="loginLoading || magicLinkLoading || forgotLoading"
        >
          <Icon v-if="loginLoading" icon="mdi:loading" class="animate-spin" />
          <Icon v-else icon="mdi:login" class="text-lg" />
          <span>{{ loginLoading ? "Logging in..." : "Login" }}</span>
        </button>

        <!-- Magic Link -->
        <button
          type="button"
          class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none"
          @click="sendMagicLink"
          :disabled="magicLinkLoading || loginLoading || forgotLoading"
        >
          <Icon
            v-if="magicLinkLoading"
            icon="mdi:loading"
            class="animate-spin"
          />
          <Icon v-else icon="mdi:magic-staff" class="text-lg" />
          <span>{{
            magicLinkLoading ? "Sending link..." : "Send Magic Link"
          }}</span>
        </button>

        <!-- GitHub -->
        <button
          type="button"
          @click="signInWithGithub"
          class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:pointer-events-none"
          :disabled="loginLoading || magicLinkLoading || forgotLoading"
        >
          <Icon v-if="false" icon="mdi:loading" class="animate-spin" />
          <Icon icon="mdi:github" class="text-lg" />
          <span>Continue with GitHub</span>
        </button>

        <p
          class="text-[13px] text-gray-600 dark:text-gray-400 pt-2 text-center"
        >
          Don’t have an account?
          <router-link
            to="/signup"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            >Sign up</router-link
          >
        </p>
      </form>
    </div>
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
const showPassword = ref(false);

const loginLoading = ref(false);
const magicLinkLoading = ref(false);
const forgotLoading = ref(false);

const toast = useToast();
const router = useRouter();

async function signInWithGithub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${window.location.origin}` },
  });
  if (error) toast.error(error.message);
}

const login = async () => {
  loginLoading.value = true;
  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  let userId = signInData?.user?.id;
  if (!userId) {
    // fallback: get session
    const { data: sessionData } = await supabase.auth.getSession();
    userId = sessionData?.session?.user?.id;
  }
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    if (profile?.role === "disabled") {
      await supabase.auth.signOut();
      toast.error("Your account has been disabled. Please contact support.");
      loginLoading.value = false;
      return;
    }
  }
  loginLoading.value = false;
  if (error) {
    if (error.code === "email_not_confirmed") {
      toast.error(`${error.message}.`);
      await supabase.auth.resend({ type: "signup", email: email.value });
      return;
    }
    if (error.code === "user_banned") {
      toast.error("Your account has been banned. Please contact support.");
      return;
    }
    toast.error(error.message);
  } else {
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
    options: { shouldCreateUser: true, emailRedirectTo: `${location.origin}/` },
  });
  magicLinkLoading.value = false;
  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Magic link sent! Check your email.");
  }
};
</script>
