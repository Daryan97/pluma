<template>
  <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 space-y-6">
    <div class="flex items-start gap-3 mb-6">
      <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
        <Icon icon="mdi:lock-open-variant-outline" class="w-6 h-6" />
      </div>
      <div class="flex-1">
        <h2 class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">
          Authentication Providers
        </h2>
        <p class="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
          Enable or disable third-party login providers for your site. Only enabled providers will appear on the login and profile pages.
        </p>
      </div>
    </div>
    <form @submit.prevent="save" class="space-y-8">
      <div class="rounded-lg border border-amber-200/70 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 p-3 text-amber-800 dark:text-amber-200 text-[12px] flex items-start gap-2">
        <Icon icon="mdi:alert-circle-outline" class="text-amber-600 dark:text-amber-300 mt-0.5" />
        <div>
          <p class="font-semibold">Important</p>
          <p class="mt-0.5">
            Enabling a provider here only controls visibility in the UI. You must also configure the provider in your Supabase project (Auth → Providers) and whitelist the redirect URLs below, otherwise sign-in/linking will fail.
          </p>
          <ul class="mt-2 space-y-1 list-disc list-inside">
            <li>Sign in redirect: <code class="px-1 py-0.5 rounded bg-amber-100/60 dark:bg-amber-900/40">{{ appOrigin }}</code></li>
            <li>Link accounts redirect: <code class="px-1 py-0.5 rounded bg-amber-100/60 dark:bg-amber-900/40">{{ appOrigin + '/profile' }}</code></li>
          </ul>
        </div>
      </div>
      <div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div
            v-for="provider in ALL_PROVIDERS"
            :key="provider"
            class="flex items-center justify-between group rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow transition"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: brandBg(provider), borderColor: brandBorder(provider) }"
              >
                <Icon :icon="providerIcon(provider)" class="w-5 h-5" :style="{ color: providerGlyphColor(provider) || undefined }" />
              </div>
              <div class="flex flex-col min-w-0">
                <span class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ providerLabel(provider) }}</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="localProviders[provider]"
              :aria-label="providerLabel(provider)"
              @click="localProviders[provider] = !localProviders[provider]"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none duration-200 ml-4',
                localProviders[provider]
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-700',
                'group-hover:ring-2 group-hover:ring-blue-300 group-focus:ring-2 group-focus:ring-blue-400',
              ]"
            >
              <span
                :class="[
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition duration-200',
                  localProviders[provider] ? 'translate-x-5' : 'translate-x-1',
                ]"
              ></span>
            </button>
          </div>
        </div>
      </div>
      <div class="flex gap-2 pt-4 items-center justify-end">
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50 border border-blue-200/70 dark:border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Icon v-if="saving" icon="mdi:loading" class="animate-spin text-base" />
          <Icon v-else icon="mdi:content-save" class="text-base" />
          <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
        </button>
        <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<script setup>


import { ref, watch, computed, onMounted } from 'vue';
import { useSettings, fetchSettings } from '@/stores/settingsStore';
import { Icon } from '@iconify/vue';
import { useToast } from 'vue-toastification';
import { getBrowserOrigin } from '@/lib/utils';

onMounted(async () => {
  await fetchSettings();
});

const appOrigin = getBrowserOrigin();

const { providersEnabled, ALL_PROVIDERS, saveProvidersEnabled, providerLabel, providerIcon, brandBg, brandBorder, providerGlyphColor } = useSettings();
const toast = useToast();

const localProviders = ref({});
const saving = ref(false);
const error = ref("");

watch(
  () => providersEnabled.value,
  (val) => {
    localProviders.value = { ...val };
  },
  { immediate: true }
);


async function save() {
  saving.value = true;
  error.value = "";
  try {
    await saveProvidersEnabled(localProviders.value);
    toast.success('Provider settings updated!');
  } catch (e) {
    error.value = 'Failed to save provider settings';
    toast.error(error.value);
  } finally {
    saving.value = false;
  }
}
</script>
