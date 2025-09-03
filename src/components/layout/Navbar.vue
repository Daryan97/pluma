<template>
  <nav
    class="backdrop-blur bg-white/80 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800"
  >
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <router-link to="/" class="block max-h-10">
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
        </router-link>
      </div>

      <!-- Desktop Links -->
      <div
        class="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-300"
        id="nav-links"
      >
        <router-link to="/" class="nav-pill">
          <Icon icon="mdi:home-outline" class="text-lg" />
          Home
        </router-link>
        <CategoriesDropdown v-if="categories.length" :categories="categories" />
        <router-link
          v-if="role === 'admin' || role === 'author'"
          to="/dashboard"
          class="nav-pill"
        >
          <Icon icon="mdi:view-dashboard-outline" class="text-lg" />
          Dashboard
        </router-link>
      </div>

      <!-- Right Section -->
      <div class="hidden md:flex items-center gap-3 relative">
        <!-- Search Icon with Hint -->
        <button
          @click="showSearch = true"
          class="nav-pill bg-gray-100 dark:bg-gray-700/40 hover:bg-gray-200 dark:hover:bg-gray-700/60"
        >
          <Icon icon="mdi:magnify" class="text-xl" />
          <span
            class="hidden lg:flex items-center text-sm text-gray-500 dark:text-gray-400"
          >
            Type
            <kbd
              class="ml-1 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm mr-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              >/</kbd
            >
            to search
          </span>
        </button>

        <!-- User Dropdown -->
        <UserDropdown :user="user" :avatar-url="avatar_url" />

        <!-- Theme Toggle -->
        <button
          @click="theme.toggleTheme()"
          class="nav-pill gap-1 bg-gray-100 dark:bg-gray-700/40 hover:bg-gray-200 dark:hover:bg-gray-700/60"
          :aria-label="
            theme.theme === 'light'
              ? 'Switch to dark mode'
              : 'Switch to light mode'
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

      <!-- Mobile Menu Toggle -->
      <button
        class="md:hidden flex items-center text-gray-700 dark:text-gray-300"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Icon icon="mdi:menu" class="text-2xl" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-menu md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4 text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm"
    >
      <!-- User / Guest Summary -->
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
            {{ user?.display_name || user?.username || "Guest" }}
          </p>
          <div class="mt-1 flex flex-wrap items-center gap-1">
            <span
              v-if="user"
              :class="roleChipClasses"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
            >
              <Icon :icon="roleChipIcon" class="text-xs" /> {{ roleLabel }}
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
            >
              <Icon icon="mdi:account-outline" class="text-xs" /> Guest
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button
            v-if="!user"
            @click="go('/login')"
            class="h-8 px-3 rounded-md text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"
          >
            Login
          </button>
          <button
            v-if="!user"
            @click="go('/signup')"
            class="h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
          >
            Signup
          </button>
          <button
            v-if="user"
            @click="go('/profile')"
            class="h-8 px-3 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
          >
            Profile
          </button>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex flex-col gap-3">
        <router-link
          to="/"
          class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline text-gray-700 dark:text-gray-300"
          @mouseup.prevent="
            mobileMenuOpen = false;
            mobileCategoriesOpen = false;
          "
        >
          <Icon
            icon="mdi:home-outline"
            class="text-gray-700 dark:text-gray-300"
          />
          <span class="text-gray-700 dark:text-gray-300"> Home </span>
        </router-link>

        <!-- Categories Dropdown (Mobile) -->
        <div class="relative">
          <button
            @click="mobileCategoriesOpen = !mobileCategoriesOpen"
            class="w-full flex items-center justify-between gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60"
          >
            <span class="flex items-center gap-2">
              <Icon icon="mdi:tag-outline" />
              Categories
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
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="`/category/${category.slug || category.name}`"
              class="flex items-center gap-2 h-8 px-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700/60"
              @mouseup.prevent="
                mobileMenuOpen = false;
                mobileCategoriesOpen = false;
              "
            >
              <Icon
                icon="mdi:tag-outline"
                class="text-gray-700 dark:text-gray-300"
              />
              <span class="text-gray-700 dark:text-gray-300">
                {{ category.name }}
              </span>
            </router-link>
          </div>
        </div>

        <router-link
          v-if="role === 'admin' || role === 'author'"
          to="/dashboard"
          class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline"
        >
          <Icon
            icon="mdi:view-dashboard-outline"
            class="text-gray-700 dark:text-gray-300"
          />
          <span class="text-gray-700 dark:text-gray-300"> Dashboard </span>
        </router-link>
      </div>

      <!-- Utilities -->
      <div
        class="flex flex-col gap-3 border-t pt-4 border-gray-200 dark:border-gray-700"
      >
        <button
          @click="showSearch = true"
          class="flex items-center gap-2 h-10 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700/60 no-underline"
        >
          <Icon icon="mdi:magnify" />
          <span>Search</span>
          <kbd
            class="ml-auto px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"
            >/</kbd
          >
        </button>

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
          {{ theme.theme === "light" ? "Dark Mode" : "Light Mode" }}
        </button>
        <button
          v-if="user"
          @click="
            logout();
            mobileMenuOpen = false;
            mobileCategoriesOpen = false;
          "
          class="flex items-center gap-2 h-10 px-3 rounded-md text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 no-underline"
        >
          <Icon icon="mdi:logout" /> Logout
        </button>
      </div>
    </div>
  </nav>
  <GlobalSearch v-model="showSearch" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/services/supabase";
import { useThemeStore } from "@/stores/themeStore";
import { projectInfo } from "@/config/projectInfo";
import { Icon } from "@iconify/vue";
import UserDropdown from "@/components/UserDropdown.vue";
import CategoriesDropdown from "../CategoriesDropdown.vue";
import { useToast } from "vue-toastification";
import { useBranding, fetchBranding } from "@/stores/brandingStore";
import GlobalSearch from "@/components/GlobalSearch.vue";
import { useRouter } from "vue-router";

const showSearch = ref(false);
const theme = useThemeStore();
const user = ref(null);
const mobileMenuOpen = ref(false);
const displayName = ref("");
const role = ref("");
const categories = ref([]);
const avatar_url = ref(null);
const mobileCategoriesOpen = ref(false);
const branding = useBranding();

const toast = useToast();
const router = useRouter();

async function getCategories() {
  const { data: categoriesData, error } = await supabase
    .from("categories")
    .select("id, name, slug, posts!inner(id)");
  if (error) {
    toast.error("Error fetching categories");
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
  }
}

async function logout() {
  await supabase.auth.signOut();
  user.value = null;
  window.location.href = "/";
}

function go(path) {
  mobileMenuOpen.value = false;
  mobileCategoriesOpen.value = false;
  router.push(path);
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
});

const roleLabel = computed(() => {
  switch (role.value) {
    case "admin":
      return "Admin";
    case "author":
      return "Author";
    case "reader":
      return "Reader";
    default:
      return "User";
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
