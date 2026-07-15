<template>
  <nav
    class="relative z-50 border-b border-gray-200 dark:border-gray-800"
  >
    <div class="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"
      ></div>
      <div
        class="absolute inset-0 bg-white/35 dark:bg-gray-900/55 backdrop-blur-md supports-[backdrop-filter]:bg-white/25 supports-[backdrop-filter]:dark:bg-gray-900/45"
      ></div>
      <div
        class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-200/40 blur-2xl mix-blend-multiply dark:hidden"
      ></div>
      <div
        class="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-indigo-200/40 blur-2xl mix-blend-multiply dark:hidden"
      ></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative z-10">
      <div class="flex items-center gap-2">
        <NuxtLink :to="localePath('/')" class="block max-h-10">
          <img
            v-if="
              (theme.theme === 'light' && branding.lightLogoUrl.value) ||
              (theme.theme === 'dark' && branding.darkLogoUrl.value)
            "
            :src="
              (theme.theme === 'light'
                ? branding.lightLogoUrl.value || branding.darkLogoUrl.value
                : branding.darkLogoUrl.value || branding.lightLogoUrl.value) +
              (((theme.theme === 'light'
                ? branding.lightLogoUrl.value || branding.darkLogoUrl.value
                : branding.darkLogoUrl.value || branding.lightLogoUrl.value
              )?.includes('?')
                ? '&'
                : '?') +
                'v=' +
                branding.logoVersion.value)
            "
            :alt="(branding.siteName.value || projectInfo.name) + ' logo'"
            class="h-10 w-auto object-contain select-none"
            draggable="false"
          />
          <span
            v-else
            class="text-xl font-bold text-gray-900 dark:text-gray-100"
            >{{ branding.siteName.value || projectInfo.name }}</span
          >
        </NuxtLink>
      </div>
      <div
        class="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-300"
        id="nav-links"
      >
        <NuxtLink :to="localePath('/')" class="nav-pill">
          <Icon icon="mdi:home-outline" class="text-lg" />
          {{ t("nav.home") }}
        </NuxtLink>
        <CategoriesDropdown v-if="categories.length" :categories="categories" />
        <NuxtLink :to="localePath('/archive')" class="nav-pill">
          <Icon icon="mdi:archive-outline" class="text-lg" />
          {{ t("nav.archive") }}
        </NuxtLink>
        <NuxtLink
          v-if="role === 'admin' || role === 'author'"
          :to="localePath('/dashboard')"
          class="nav-pill"
        >
          <Icon icon="mdi:view-dashboard-outline" class="text-lg" />
          {{ t("nav.dashboard") }}
        </NuxtLink>
      </div>
      <div class="hidden md:flex items-center gap-3 relative">
        <LocaleSwitcher v-if="!isInstallPage" />
        <button
          @click="showSearch = true"
          class="nav-pill bg-gray-100 dark:bg-gray-700/40 hover:bg-gray-200 dark:hover:bg-gray-700/60"
        >
          <Icon icon="mdi:magnify" class="text-xl" />
          <span
            class="hidden lg:flex items-center text-sm text-gray-500 dark:text-gray-400"
            dir="ltr"
          >
            {{ t("nav.typeSlash") }}
            <kbd
              class="ms-1 me-1 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
              >/</kbd
            >
            {{ t("nav.toSearch") }}
          </span>
        </button>
        <UserDropdown v-if="authReady" :user="user" :avatar-url="avatar_url" />
        <div
          v-else
          class="h-9 w-28 rounded-md bg-gray-200/70 dark:bg-gray-700/50 animate-pulse"
          aria-hidden="true"
        />
        <button
          @click="theme.toggleTheme()"
          class="nav-pill gap-1 bg-gray-100 dark:bg-gray-700/40 hover:bg-gray-200 dark:hover:bg-gray-700/60"
          :aria-label="
            theme.theme === 'light' ? t('nav.darkMode') : t('nav.lightMode')
          "
        >
          <Icon
            :icon="
              theme.theme === 'light'
                ? 'mdi:weather-night'
                : 'mdi:white-balance-sunny'
            "
            class="text-xl"
          />
        </button>
      </div>
      <button
        class="md:hidden flex items-center text-gray-700 dark:text-gray-300"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Icon icon="mdi:menu" class="text-2xl" />
      </button>
    </div>
    <div
      v-if="mobileMenuOpen"
      class="mobile-menu md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4 text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm"
    >
      <div
        class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 backdrop-blur shadow-sm"
      >
        <div
          class="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center"
        >
          <img
            v-if="avatar_url"
            :src="avatar_url"
            alt="avatar"
            class="w-full h-full object-cover"
          />
          <Icon v-else icon="mdi:account" class="text-2xl text-gray-500" />
        </div>
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
          >
            <template v-if="!authReady">…</template>
            <template v-else>{{ user?.display_name || user?.username || t("nav.guest") }}</template>
          </p>
          <div class="mt-1 flex flex-wrap items-center gap-1">
            <span
              v-if="!authReady"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
            >
              …
            </span>
            <span
              v-else-if="user"
              :class="roleChipClasses"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
            >
              <Icon :icon="roleChipIcon" class="text-xs" /> {{ roleLabel }}
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
            >
              <Icon icon="mdi:account-outline" class="text-xs" /> {{ t("nav.guest") }}
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <template v-if="!authReady">
            <div class="h-8 w-20 rounded-md bg-gray-200/70 dark:bg-gray-700/50 animate-pulse" />
          </template>
          <template v-else>
            <button
              v-if="!user"
              @click="go('/login')"
              class="h-8 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"
            >
              {{ t("nav.login") }}
            </button>
            <button
              v-if="!user"
              @click="go('/signup')"
              class="h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >
              {{ t("nav.signup") }}
            </button>
            <button
              v-if="user"
              @click="go('/profile')"
              class="h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >
              {{ t("nav.profile") }}
            </button>
          </template>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <NuxtLink
          :to="localePath('/')"
          class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline text-gray-700 dark:text-gray-300"
          @click="go('/')"
        >
          <Icon
            icon="mdi:home-outline"
            class="text-gray-700 dark:text-gray-300"
          />
          <span class="text-gray-700 dark:text-gray-300"> {{ t("nav.home") }} </span>
        </NuxtLink>
        <div class="relative">
          <button
            @click="mobileCategoriesOpen = !mobileCategoriesOpen"
            class="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60"
          >
            <span class="flex items-center gap-2">
              <Icon icon="mdi:tag-outline" />
              {{ t("nav.categories") }}
            </span>
            <Icon
              :icon="
                mobileCategoriesOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'
              "
              class="text-xl"
            />
          </button>

          <div
            v-if="mobileCategoriesOpen"
            class="mt-2 ml-2 flex flex-col gap-1 text-sm"
          >
            <NuxtLink
              v-for="category in categories"
              :key="category.id"
              :to="localePath(`/category/${category.slug || category.name}`)"
              class="flex items-center gap-2 h-8 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700/60"
              @click="go(`/category/${category.slug || category.name}`)"
            >
              <Icon
                icon="mdi:tag-outline"
                class="text-gray-700 dark:text-gray-300"
              />
              <span class="text-gray-700 dark:text-gray-300">
                {{ category.name }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          :to="localePath('/archive')"
          class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline text-gray-700 dark:text-gray-300"
          @click="go('/archive')"
        >
          <Icon
            icon="mdi:archive-outline"
            class="text-gray-700 dark:text-gray-300"
          />
          <span class="text-gray-700 dark:text-gray-300"> {{ t("nav.archive") }} </span>
        </NuxtLink>

        <NuxtLink
          v-if="role === 'admin' || role === 'author'"
          :to="localePath('/dashboard')"
          class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline"
          @click="go('/dashboard')"
        >
          <Icon
            icon="mdi:view-dashboard-outline"
            class="text-gray-700 dark:text-gray-300"
          />
          <span class="text-gray-700 dark:text-gray-300"> {{ t("nav.dashboard") }} </span>
        </NuxtLink>
      </div>
      <div
        class="flex flex-col gap-3 border-t pt-4 border-gray-200 dark:border-gray-700"
      >
        <button
          @click="showSearch = true"
          class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline"
        >
          <Icon icon="mdi:magnify" />
          <span>{{ t("nav.search") }}</span>
          <kbd
            class="ml-auto px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"
            >/</kbd
          >
        </button>

        <div
          v-if="!isInstallPage && mobileLocales.length > 1"
          class="relative"
        >
          <button
            type="button"
            @click="mobileLocalesOpen = !mobileLocalesOpen"
            class="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60"
          >
            <span class="flex items-center gap-2">
              <Icon icon="mdi:translate" />
              {{ t("locale.switch") }}
            </span>
            <Icon
              :icon="mobileLocalesOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="text-xl"
            />
          </button>

          <div
            v-if="mobileLocalesOpen"
            class="mt-2 ml-2 flex flex-col gap-1 text-sm"
          >
            <button
              v-for="loc in mobileLocales"
              :key="loc.code"
              type="button"
              class="flex items-center gap-2 h-8 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700/60 w-full text-start"
              @click="switchMobileLocale(loc.code)"
            >
              <Icon
                icon="mdi:translate"
                class="text-gray-700 dark:text-gray-300"
              />
              <span class="text-gray-700 dark:text-gray-300">
                {{ loc.name }}
              </span>
            </button>
          </div>
        </div>

        <button
          @click="theme.toggleTheme()"
          class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline"
        >
          <Icon
            :icon="
              theme.theme === 'light'
                ? 'mdi:weather-night'
                : 'mdi:white-balance-sunny'
            "
          />
          {{ theme.theme === "light" ? t("nav.darkMode") : t("nav.lightMode") }}
        </button>
        <button
          v-if="user"
          @click="
            logout();
            mobileMenuOpen = false;
            mobileCategoriesOpen = false;
            mobileLocalesOpen = false;
          "
          class="flex items-center gap-2 h-10 px-3 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 no-underline"
        >
          <Icon icon="mdi:logout" /> {{ t("nav.logout") }}
        </button>
      </div>
    </div>
  </nav>
  <GlobalSearch v-model="showSearch" :initial-query="initialSearchQuery" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { supabase } from "@/services/supabase";
import { useThemeStore } from "@/stores/themeStore";
import { projectInfo } from "@/config/projectInfo";
import { Icon } from "@iconify/vue";
import UserDropdown from "@/components/UserDropdown.vue";
import CategoriesDropdown from "../CategoriesDropdown.vue";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher.vue";
import { useBranding, fetchBranding } from "@/stores/brandingStore";
import GlobalSearch from "@/components/GlobalSearch.vue";
import { useRouter } from "vue-router";

const { t, locale, locales, setLocale } = useI18n();
const localePath = useLocalePath();
const { contentLocale } = useContentLocale();

const showSearch = ref(false);
const initialSearchQuery = ref("");
const theme = useThemeStore();
const user = ref(null);
const authReady = ref(false);
const mobileMenuOpen = ref(false);
const displayName = ref("");
const role = ref("");
const categories = ref([]);
const avatar_url = ref(null);
const mobileCategoriesOpen = ref(false);
const mobileLocalesOpen = ref(false);
const branding = useBranding();
const localeSettings = useState("pluma-branding-locales", () => null);

const toast = useToast();
const router = useRouter();
const route = useRoute();

const isInstallPage = computed(() => {
  const p = route.path || "";
  return p === "/install" || p.endsWith("/install") || /(^|\/)install(\/|$)/.test(p);
});

const mobileLocales = computed(() => {
  const list = unref(locales) || [];
  let enabled = null;
  if (branding.brandingLoaded?.value) {
    enabled = branding.enabledLocales?.value || [];
  } else if (localeSettings.value?.enabledLocales) {
    enabled = localeSettings.value.enabledLocales;
  }
  // null = branding not ready → hide (avoids flashing all languages)
  if (!Array.isArray(enabled) || !enabled.length) return [];
  return list
    .filter((l) => enabled.includes(l.code))
    .map((l) => ({
      code: l.code,
      name: l.name || l.code,
    }));
});

async function switchMobileLocale(code) {
  if (!code || code === unref(locale)) {
    mobileLocalesOpen.value = false;
    mobileMenuOpen.value = false;
    return;
  }
  mobileLocalesOpen.value = false;
  mobileMenuOpen.value = false;
  mobileCategoriesOpen.value = false;
  await setLocale(code);
}

async function getCategories() {
  const { data: categoriesData, error } = await supabase
    .from("categories")
    .select("id, name, slug, locale")
    .eq("locale", contentLocale.value);
  if (error) {
    categories.value = [];
  } else {
    categories.value = categoriesData.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    }));
  }
}

async function getUser() {
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (currentUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, display_name, role, avatar_url")
        .eq("id", currentUser.id)
        .single();
      user.value = profile || { username: currentUser.email };
      displayName.value = user.value.display_name || user.value.username;
      role.value = user.value.role || "reader";
      avatar_url.value = user.value.avatar_url || null;
    } else {
      user.value = null;
      displayName.value = "";
      role.value = "";
      avatar_url.value = null;
    }
  } catch (e) {
    console.warn("[nav] getUser failed", e);
    user.value = null;
  } finally {
    authReady.value = true;
  }
}

async function logout() {
  await supabase.auth.signOut();
  user.value = null;
  window.location.href = localePath("/");
}

function go(path) {
  mobileMenuOpen.value = false;
  mobileCategoriesOpen.value = false;
  mobileLocalesOpen.value = false;
  router.push(localePath(path));
}

function handleOpenGlobalSearch(e) {
  initialSearchQuery.value = e?.detail?.query || "";
  showSearch.value = true;
}

onMounted(() => {
  getUser();
  getCategories();
  fetchBranding();
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) getUser();
    else {
      user.value = null;
      displayName.value = "";
      role.value = "";
    }
  });
  window.addEventListener("keydown", (e) => {
    const isEditable = (el) => {
      if (!el) return false;
      if (el.isContentEditable) return true;
      if (el.tagName) {
        const tag = el.tagName.toUpperCase();
        if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return true;
        if (
          (tag === "DIV" || tag === "SPAN") &&
          el.getAttribute("role") === "textbox"
        )
          return true;
      }
      return false;
    };
    let cur = e.target;
    let inEditable = false;
    while (cur && cur !== document.body) {
      if (isEditable(cur)) {
        inEditable = true;
        break;
      }
      cur = cur.parentElement;
    }
    if (e.key === "/" && !inEditable && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      showSearch.value = true;
    }
  });
  window.addEventListener("profileUpdated", getUser);
  window.addEventListener("pluma:open-global-search", handleOpenGlobalSearch);
});

onUnmounted(() => {
  window.removeEventListener(
    "pluma:open-global-search",
    handleOpenGlobalSearch
  );
});

const roleLabel = computed(() => {
  switch (role.value) {
    case "admin":
      return t("roles.admin");
    case "author":
      return t("roles.author");
    case "reader":
      return t("roles.reader");
    default:
      return t("roles.guest");
  }
});
const roleChipIcon = computed(() => {
  switch (role.value) {
    case "admin":
      return "mdi:shield-crown-outline";
    case "author":
      return "mdi:pen";
    case "reader":
      return "mdi:book-open-page-variant";
    default:
      return "mdi:account-outline";
  }
});
const roleChipClasses = computed(() => {
  switch (role.value) {
    case "admin":
      return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
    case "author":
      return "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300";
    case "reader":
      return "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400";
  }
});
</script>
