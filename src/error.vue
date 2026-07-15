<template>
  <div class="relative min-h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
    <Navbar />
    <main>
      <section class="relative overflow-hidden min-h-[70vh] flex items-center">
        <div
          class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"
        />
        <div
          class="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"
        />
        <div
          class="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-indigo-200/30 dark:bg-indigo-500/10 blur-3xl"
        />

        <div class="max-w-3xl mx-auto px-4 py-20 lg:py-28 w-full text-center">
          <p
            class="text-7xl md:text-8xl font-extrabold tracking-tight tabular-nums bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white"
            aria-hidden="true"
          >
            {{ statusCode }}
          </p>
          <div
            class="mx-auto mt-4 mb-8 w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm"
          >
            <Icon :icon="icon" class="text-3xl" />
          </div>
          <h1
            class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
          >
            {{ title }}
          </h1>
          <p class="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
            {{ description }}
          </p>
          <p
            v-if="devDetail"
            class="mt-4 text-left text-xs font-mono text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2 max-w-xl mx-auto break-words"
          >
            {{ devDetail }}
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              class="inline-flex items-center gap-2 h-10 px-5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition"
              @click="goHome"
            >
              <Icon icon="mdi:home-outline" class="text-lg" />
              {{ t("error.goHome") }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 h-10 px-5 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              @click="goBack"
            >
              <Icon icon="mdi:arrow-left" class="text-lg" />
              {{ t("error.goBack") }}
            </button>
            <button
              v-if="statusCode >= 500"
              type="button"
              class="inline-flex items-center gap-2 h-10 px-5 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              @click="retry"
            >
              <Icon icon="mdi:refresh" class="text-lg" />
              {{ t("error.tryAgain") }}
            </button>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";
import { projectInfo } from "@/config/projectInfo";

const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const { t } = useI18n();
const localePath = useLocalePath();

const statusCode = computed(() => Number(props.error?.statusCode) || 500);

const kind = computed(() => {
  const code = statusCode.value;
  if (code === 404) return "404";
  if (code === 401 || code === 403) return "403";
  if (code >= 500) return "500";
  return "generic";
});

const title = computed(() => t(`error.${kind.value}.title`));
const description = computed(() => {
  const custom = props.error?.statusMessage || props.error?.message;
  // Prefer i18n copy for common codes; show custom only when it isn't the Nuxt default noise.
  if (kind.value === "generic" && custom && !/^Page not found$/i.test(custom)) {
    return custom;
  }
  return t(`error.${kind.value}.description`);
});

const icon = computed(() => {
  switch (kind.value) {
    case "404":
      return "mdi:map-search-outline";
    case "403":
      return "mdi:lock-outline";
    case "500":
      return "mdi:server-network-off";
    default:
      return "mdi:alert-circle-outline";
  }
});

const devDetail = computed(() => {
  if (!import.meta.dev) return "";
  const msg = props.error?.message || props.error?.statusMessage || "";
  if (!msg || msg === title.value || msg === description.value) return "";
  return msg;
});

useHead(() => ({
  title: `${statusCode.value} · ${title.value} | ${projectInfo.name}`,
  meta: [{ name: "robots", content: "noindex" }],
}));

function goHome() {
  clearError({ redirect: localePath("/") });
}

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    clearError();
    window.history.back();
    return;
  }
  goHome();
}

function retry() {
  clearError();
  if (import.meta.client) {
    window.location.reload();
  }
}
</script>
