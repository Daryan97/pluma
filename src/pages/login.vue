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
        {{ t("auth.welcomeBack") }}
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {{ t("auth.signInContinue") }}
      </p>
    </div>

    <div
      class="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
    >
      <form @submit.prevent="login" class="space-y-5" novalidate>
        <div>
          <label
            class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            <Icon icon="mdi:email-outline" class="text-base text-blue-500" />
            {{ t("auth.email") }}
          </label>
          <input
            v-model.trim="email"
            type="email"
            autocomplete="email"
            :placeholder="t('auth.email')"
            class="w-full h-11 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 px-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            required
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label
              class="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Icon icon="mdi:lock-outline" class="text-base text-blue-500" />
              {{ t("auth.password") }}
            </label>
            <button
              type="button"
              @click="forgotPassword"
              class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              :disabled="forgotLoading || loginLoading || magicLinkLoading"
            >
              <span v-if="!forgotLoading">{{ t("auth.forgot") }}</span>
              <span v-else>{{ t("auth.sending") }}</span>
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
              :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')"
              class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              <Icon
                :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                class="text-lg"
              />
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"
          :disabled="loginLoading || magicLinkLoading || forgotLoading"
        >
          <Icon v-if="loginLoading" icon="mdi:loading" class="animate-spin" />
          <Icon v-else icon="mdi:login" class="text-lg" />
          <span>{{ loginLoading ? t("auth.loggingIn") : t("auth.login") }}</span>
        </button>
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
            magicLinkLoading ? t("auth.sendingLink") : t("auth.sendMagicLink")
          }}</span>
        </button>
        <div v-if="enabledProviders.length > 0" class="space-y-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="bg-white dark:bg-gray-800 px-3 text-[11px] font-medium text-gray-500 dark:text-gray-400">{{ t("auth.orContinueWith") }}</span>
            </div>
          </div>
          <div v-if="!smallGridMode" class="grid gap-2 text-black">
            <button
              v-for="provider in enabledProviders"
              :key="provider"
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 hover:brightness-105"
              :style="{ backgroundColor: brandBg(provider), borderColor: brandBorder(provider) }"
              @click="signInWithProvider(provider)"
              :disabled="loginLoading || magicLinkLoading || forgotLoading"
              :aria-label="t('auth.continueWith', { provider: providerLabel(provider) })"
            >
              <Icon :icon="providerIcon(provider)" class="text-base" :style="{ color: providerGlyphColor(provider) || undefined }" />
              <span>{{ providerLabel(provider) }}</span>
            </button>
          </div>
          <div v-else class="flex flex-wrap justify-center gap-2">
            <button
              v-for="provider in visibleProviders"
              :key="provider"
              type="button"
              :title="providerLabel(provider)"
              :aria-label="t('auth.continueWith', { provider: providerLabel(provider) })"
              @click="signInWithProvider(provider)"
              class="inline-flex items-center justify-center h-10 w-10 rounded-md text-gray-700 dark:text-gray-300 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none border"
              :style="{ backgroundColor: brandBg(provider), borderColor: brandBorder(provider) }"
              :disabled="loginLoading || magicLinkLoading || forgotLoading"
            >
              <Icon :icon="providerIcon(provider)" class="text-base" :style="{ color: providerGlyphColor(provider) || undefined }" />
              <span class="sr-only">{{ providerLabel(provider) }}</span>
            </button>
          </div>
          <div v-if="smallGridMode && hasOverflow" class="flex justify-center">
            <button
              type="button"
              @click="expanded = !expanded"
              class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
            >
              {{
                expanded
                  ? t('common.showLess')
                  : t('common.showMore', { count: enabledProviders.length - COLLAPSED_COUNT })
              }}
            </button>
          </div>
        </div>

        <p
          class="text-[13px] text-gray-600 dark:text-gray-400 pt-2 text-center"
        >
          {{ t("auth.noAccount") }}
          <NuxtLink
            :to="localePath('/signup')"
            class="text-blue-600 dark:text-blue-400 hover:underline"
            >{{ t("auth.signup") }}</NuxtLink
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ requireAnonymous: true, ssr: false })

import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";
import { useSettings, ALL_PROVIDERS } from "@/stores/settingsStore";
import { getBrowserOrigin } from "@/lib/utils";

const { t } = useI18n();
const localePath = useLocalePath();
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const loginLoading = ref(false);
const magicLinkLoading = ref(false);
const forgotLoading = ref(false);

const toast = useToast();
const router = useRouter();
const route = useRoute();

const { providersEnabled, providerLabel, providerIcon, brandBg, brandBorder, providerGlyphColor, fetchSettings } = useSettings();
const enabledProviders = computed(() =>
  ALL_PROVIDERS.filter((p) => providersEnabled.value?.[p] === true)
);

const COLLAPSED_COUNT = 6;
const expanded = ref(false);
const smallGridMode = computed(() => enabledProviders.value.length > 3);
const hasOverflow = computed(() => smallGridMode.value && enabledProviders.value.length > COLLAPSED_COUNT);
const visibleProviders = computed(() =>
  expanded.value || !smallGridMode.value
    ? enabledProviders.value
    : enabledProviders.value.slice(0, COLLAPSED_COUNT)
);

onMounted(async () => {
  await fetchSettings();
});

async function signInWithProvider(provider) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: getBrowserOrigin() },
  });
  if (error) toast.error(error.message);
}

const forgotPassword = async () => {
  if (!email.value) {
    toast.warning(t("auth.pleaseEnterEmail"));
    return;
  }
  forgotLoading.value = true;
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${getBrowserOrigin()}/change-password`,
  });
  forgotLoading.value = false;
  if (error) {
    toast.error(error.message);
  } else {
    toast.success(t("auth.resetLinkSent"));
  }
};

const sendMagicLink = async () => {
  if (!email.value) {
    toast.warning(t("auth.pleaseEnterEmailMagic"));
    return;
  }
  magicLinkLoading.value = true;
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: { shouldCreateUser: true, emailRedirectTo: getBrowserOrigin() },
  });
  magicLinkLoading.value = false;
  if (error) {
    toast.error(error.message);
  } else {
    toast.success(t("auth.magicLinkSent"));
  }
};

const login = async () => {
  if (!email.value || !password.value) {
    toast.warning(t("auth.pleaseEnterBoth"));
    return;
  }
  
  loginLoading.value = true;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("auth.welcomeBackToast"));
      const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "";
      if (redirect.startsWith("/") && !redirect.startsWith("//")) {
        router.push(redirect);
      } else {
        router.push(localePath("/dashboard"));
      }
    }
  } catch (err) {
    toast.error(t("common.unexpectedError"));
    console.error("Login error:", err);
  } finally {
    loginLoading.value = false;
  }
};
</script>
