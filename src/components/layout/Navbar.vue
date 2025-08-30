<template>
  <nav class="bg-gray-100 dark:bg-gray-900 shadow-md">
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <router-link to="/" class="block max-h-10">
            <img
            v-if="(theme.theme === 'light' && branding.lightLogoUrl.value) || (theme.theme === 'dark' && branding.darkLogoUrl.value)"
      :src="(theme.theme === 'light'
        ? (branding.lightLogoUrl.value || branding.darkLogoUrl.value)
        : (branding.darkLogoUrl.value || branding.lightLogoUrl.value)) + ( ( (theme.theme === 'light'
        ? (branding.lightLogoUrl.value || branding.darkLogoUrl.value)
        : (branding.darkLogoUrl.value || branding.lightLogoUrl.value))?.includes('?') ? '&' : '?' ) + 'v=' + branding.logoVersion.value )"
            :alt="projectInfo.name + ' logo'"
            class="h-10 w-auto object-contain select-none"
            draggable="false"
            />
          <span v-else class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ projectInfo.name }}</span>
        </router-link>
      </div>

      <!-- Desktop Links -->
      <div
        class="hidden md:flex items-center gap-4 text-gray-700 dark:text-gray-300"
      >
        <router-link to="/" class="flex items-center gap-1">
          <Icon icon="mdi:home-outline" class="text-lg" />
          Home
        </router-link>
        <CategoriesDropdown v-if="categories.length" :categories="categories" />
        <router-link
          v-if="role === 'admin' || role === 'author'"
          to="/dashboard"
          class="flex items-center gap-1"
        >
          <Icon icon="mdi:view-dashboard-outline" class="text-lg" />
          Dashboard
        </router-link>
      </div>

      <!-- Right Section -->
      <div class="hidden md:flex items-center gap-4 relative">
        <!-- Search Icon with Hint -->
        <button
          @click="showSearch = true"
          class="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
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
          class="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded transition-colors duration-300"
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
      class="md:hidden border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4 text-gray-700 dark:text-gray-300"
    >
      <!-- Navigation Links -->
      <div class="flex flex-col gap-3">
        <router-link
          to="/"
          class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
          @mouseup.prevent="
            mobileMenuOpen = false;
            mobileCategoriesOpen = false;
          "
        >
          <Icon icon="mdi:home-outline" /> Home
        </router-link>

        <!-- Categories Dropdown (Mobile) -->
        <div class="relative">
          <button
            @click="mobileCategoriesOpen = !mobileCategoriesOpen"
            class="w-full flex items-center justify-between gap-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
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
            class="mt-2 ml-6 flex flex-col gap-2 text-sm"
          >
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="`/category/${category.name}`"
              class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
              @mouseup.prevent="
                mobileMenuOpen = false;
                mobileCategoriesOpen = false;
              "
            >
              <Icon icon="mdi:tag-outline" />
              {{ category.name }}
            </router-link>
          </div>
        </div>

        <router-link
          v-if="role === 'admin' || role === 'author'"
          to="/dashboard"
          class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Icon icon="mdi:view-dashboard-outline" /> Dashboard
        </router-link>
      </div>

      <!-- User Links -->
      <div
        v-if="user"
        class="flex flex-col gap-3 border-t pt-4 border-gray-200 dark:border-gray-700"
      >
        <router-link
          to="/profile"
          class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
          @mouseup.prevent="
            mobileMenuOpen = false;
            mobileCategoriesOpen = false;
          "
        >
          <Icon icon="mdi:account-edit" /> Profile
        </router-link>
        <router-link
          to="/change-password"
          class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
          @mouseup.prevent="
            mobileMenuOpen = false;
            mobileCategoriesOpen = false;
          "
        >
          <Icon icon="mdi:lock-reset" /> Change Password
        </router-link>
        <button
          @click="logout"
          @mouseup.prevent="
            mobileMenuOpen = false;
            mobileCategoriesOpen = false;
          "
          class="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <Icon icon="mdi:logout" /> Logout
        </button>
      </div>

      <!-- Utilities -->
      <div
        class="flex flex-col gap-3 border-t pt-4 border-gray-200 dark:border-gray-700"
      >
        <button
          @click="showSearch = true"
          class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
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
          class="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
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
      </div>
    </div>
  </nav>
  <GlobalSearch v-model="showSearch" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/services/supabase";
import { useThemeStore } from "@/stores/themeStore";
import { projectInfo } from "@/config/projectInfo";
import { Icon } from "@iconify/vue";
import UserDropdown from "@/components/UserDropdown.vue";
import CategoriesDropdown from "../CategoriesDropdown.vue";
import { useToast } from "vue-toastification";
import { useBranding, fetchBranding } from '@/stores/brandingStore';
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
    .select("id, name, posts!inner(id)")
  if (error) {
    toast.error("Error fetching categories")
    categories.value = [];
  } else {
    categories.value = categoriesData.map(cat => ({ id: cat.id, name: cat.name }))
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
        if (['INPUT','TEXTAREA','SELECT'].includes(tag)) return true;
        if ((tag === 'DIV' || tag === 'SPAN') && (el.getAttribute('role') === 'textbox')) return true;
      }
      return false;
    };
    let cur = e.target;
    let inEditable = false;
    while (cur && cur !== document.body) {
      if (isEditable(cur)) { inEditable = true; break; }
      cur = cur.parentElement;
    }
    if (e.key === '/' && !inEditable && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      showSearch.value = true;
    }
  });
  window.addEventListener("profileUpdated", getUser);
});
</script>
