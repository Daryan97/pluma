<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-28"
      @click.self="close"
    >
      <div
        class="w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/50 backdrop-blur p-3 sm:p-4 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-gray-100/70 dark:bg-gray-800/50 focus-within:ring-2 focus-within:ring-blue-500 transition"
        >
          <Icon
            icon="mdi:magnify"
            class="text-gray-500 dark:text-gray-400"
            :width="22"
          />
          <input
            ref="searchInput"
            type="text"
            v-model="query"
            :placeholder="t('search.placeholder')"
            @keydown="handleKeydown"
            class="w-full bg-transparent text-sm sm:text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 outline-none py-1.5"
            :aria-label="t('search.title')"
          />
          <button
            v-if="query"
            @click="clearQuery"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition rounded-full p-1"
            :aria-label="t('search.clear')"
          >
            <Icon icon="mdi:close-circle" :width="20" />
          </button>
          <button
            class="hidden sm:inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            @click="deleteLastChar"
          >
            <Icon icon="mdi:backspace" class="text-lg" />
          </button>
        </div>
        <div
          class="mt-3 relative flex-1 min-h-[180px] max-h-[480px] overflow-y-auto overscroll-contain"
          role="listbox"
          :aria-activedescendant="activeId"
        >
          <div v-if="!query && quickLinks.length" class="pb-2">
            <div
              class="sticky top-0 z-10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              {{ t("search.quickLinks") }}
            </div>
            <ul class="mt-1 space-y-0.5">
              <li
                v-for="item in quickLinks"
                :key="'quick-' + item.id"
                :id="'quick-' + item.id"
                @click="navigate(item)"
                class="group cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                :class="
                  selectedIndex === item.flatIndex
                    ? 'bg-blue-50 dark:bg-blue-600/20 ring-1 ring-blue-200 dark:ring-blue-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                "
              >
                <Icon :icon="item.icon" class="text-blue-500" />
                <span
                  class="text-gray-800 dark:text-gray-200"
                  v-html="item.highlightedLabel || sanitize(item.label)"
                ></span>
              </li>
            </ul>
          </div>
          <div
            v-if="loading"
            class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 px-4 py-6"
          >
            <Icon icon="mdi:progress-clock" class="animate-spin" /> {{ t("search.searching") }}
          </div>
          <template v-else>
            <div
              v-for="group in displayGroups"
              :key="group.type"
              class="mb-4 last:mb-2"
            >
              <div
                class="sticky top-0 z-10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-white/90 dark:bg-gray-900/90 backdrop-blur"
              >
                {{ typeLabels[group.type] || group.type }}
              </div>
              <ul class="mt-1 space-y-0.5">
                <li
                  v-for="item in group.items"
                  :key="item.type + '-' + item.id"
                  :id="item.domId"
                  @click="navigate(item)"
                  class="group cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                  :class="
                    selectedIndex === item.flatIndex
                      ? 'bg-blue-50 dark:bg-blue-600/20 ring-1 ring-blue-200 dark:ring-blue-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  "
                >
                  <Icon :icon="item.icon" class="text-blue-500" />
                  <span
                    class="text-gray-800 dark:text-gray-200"
                    v-html="item.highlightedLabel || sanitize(item.label)"
                  ></span>
                </li>
              </ul>
            </div>
            <p
              v-if="query && !results.length && !loading"
              class="px-4 py-8 text-center text-sm text-gray-500"
            >
              {{ t("search.noResults") }}
            </p>
          </template>
        </div>
        <div
          class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400"
        >
          <div class="hidden sm:flex items-center gap-3">
            <span class="flex items-center gap-1"
              ><kbd class="shortcut">↑</kbd><kbd class="shortcut">↓</kbd
              ><span class="hidden md:inline">{{ t("search.navigate") }}</span></span
            >
            <span class="flex items-center gap-1"
              ><kbd class="shortcut">Enter</kbd
              ><span class="hidden md:inline">{{ t("common.open") }}</span></span
            >
            <span class="flex items-center gap-1"
              ><kbd class="shortcut">Esc</kbd
              ><span class="hidden md:inline">{{ t("search.close") }}</span></span
            >
          </div>
          <span class="ml-auto text-[10px] font-medium tracking-wide"
            >{{ t("search.title") }}</span
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/services/supabase";
import { Icon } from "@iconify/vue";

const { t } = useI18n();
const localePath = useLocalePath();
const { contentLocale } = useContentLocale();
const props = defineProps({
  modelValue: Boolean,
  initialQuery: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);
const query = ref("");
const results = ref([]);
const selectedIndex = ref(-1);
const searchInput = ref(null);
const loading = ref(false);
const router = useRouter();
const currentUser = ref(null);
const currentProfileRole = ref(null);
const debounceMs = 260;
let debounceTimer = null;
let lastIssued = 0;

/** Curated in-app pages — never scrape i18n-generated route names (dashboard___ar). */
const searchablePages = computed(() => [
  { id: "home", label: t("nav.home"), route: "/", icon: "mdi:home" },
  { id: "archive", label: t("nav.archive"), route: "/archive", icon: "mdi:archive-outline" },
  {
    id: "dashboard",
    label: t("nav.dashboard"),
    route: "/dashboard",
    icon: "mdi:view-dashboard",
    requiresAuthorOrAdmin: true,
  },
  {
    id: "new-post",
    label: t("posts.newPost"),
    route: "/dashboard/new-post",
    icon: "mdi:plus-box",
    requiresAuthorOrAdmin: true,
  },
  {
    id: "profile",
    label: t("nav.profile"),
    route: "/profile",
    icon: "mdi:account",
    requiresAuth: true,
  },
  {
    id: "login",
    label: t("nav.login"),
    route: "/login",
    icon: "mdi:login",
    requireAnonymous: true,
  },
  {
    id: "signup",
    label: t("nav.signup"),
    route: "/signup",
    icon: "mdi:account-plus",
    requireAnonymous: true,
  },
]);

function pageVisible(p) {
  if (p.requireAnonymous) return !currentUser.value;
  if (p.requiresAuthorOrAdmin) {
    return (
      !!currentUser.value &&
      ["admin", "author"].includes(currentProfileRole.value)
    );
  }
  if (p.requiresAuth) return !!currentUser.value;
  return true;
}

onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) {
    currentUser.value = session.user;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();
    if (profile) currentProfileRole.value = profile.role;
  }
});

const typeLabels = computed(() => ({
  post: t("posts.title"),
  category: t("nav.categories"),
  profile: t("authors.title"),
  page: t("pages.title"),
}));

watch(
  () => props.modelValue,
  async (v) => {
    if (v) {
      if (props.initialQuery) {
        query.value = props.initialQuery;
      }
      await nextTick();
      searchInput.value?.focus();
    } else clearQuery();
  }
);

function close() {
  emit("update:modelValue", false);
  clearQuery();
}
function clearQuery() {
  query.value = "";
  results.value = [];
  selectedIndex.value = -1;
  loading.value = false;
}
function sanitize(str) {
  return String(str).replace(
    /[&<>"']/g,
    (s) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        s
      ])
  );
}

function deleteLastChar() {
  if (query.value) query.value = query.value.slice(0, -1);
}

function highlight(label, q) {
  if (!q) return sanitize(label);
  const re = new RegExp(
    "(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
    "ig"
  );
  return sanitize(label).replace(
    re,
    '<mark class="bg-yellow-200 dark:bg-yellow-600/60 text-gray-900 dark:text-yellow-50 rounded px-0.5">$1</mark>'
  );
}

const displayGroups = computed(() => {
  const grouped = {};
  results.value.forEach((item, idx) => {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push({
      ...item,
      flatIndex: idx,
      domId: "res-" + item.type + "-" + item.id,
    });
  });
  return Object.keys(grouped).map((type) => ({ type, items: grouped[type] }));
});
const activeId = computed(() => {
  if (!query.value) {
    const item = quickLinks.value[selectedIndex.value];
    return item ? "quick-" + item.id : null;
  }
  const item = results.value[selectedIndex.value];
  return item ? "res-" + item.type + "-" + item.id : null;
});

function navigate(item) {
  close();
  const route = item.route?.startsWith("/")
    ? localePath(item.route)
    : localePath(`/${item.route}`);
  router.push(route);
}
function handleKeydown(e) {
  const list = query.value ? results.value : quickLinks.value;
  const total = list.length;
  if (e.key === "Escape") close();
  else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!total) return;
    selectedIndex.value = (selectedIndex.value + 1) % total;
    scrollIntoView();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!total) return;
    selectedIndex.value = (selectedIndex.value - 1 + total) % total;
    scrollIntoView();
  } else if (e.key === "Enter" && selectedIndex.value !== -1)
    navigate(list[selectedIndex.value]);
}
function scrollIntoView() {
  nextTick(() => {
    const el = document.getElementById(activeId.value);
    if (el) el.scrollIntoView({ block: "nearest" });
  });
}

async function runSearch(term) {
  if (term.trim().length < 2) {
    results.value = [];
    selectedIndex.value = -1;
    loading.value = false;
    return;
  }
  const stamp = Date.now();
  lastIssued = stamp;
  loading.value = true;
  const search = `%${term.trim()}%`;
  const [posts, categories, profiles] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug")
      .eq("locale", contentLocale.value)
      .eq("status", "published")
      .or(`title.ilike.${search}`)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("categories")
      .select("id, name, slug")
      .eq("locale", contentLocale.value)
      .ilike("name", search)
      .limit(5),
    supabase
      .from("profiles")
      .select("id, display_name, username")
      .in("role", ["author", "admin"])
      .or(`display_name.ilike.${search},username.ilike.${search}`)
      .limit(5),
  ]);
  if (lastIssued !== stamp) return;
  const merged = [];
  if (posts.data)
    merged.push(
      ...posts.data.map((p) => ({
        id: p.id,
        type: "post",
        label: p.title,
        icon: "mdi:newspaper",
        route: `/posts/${p.slug}`,
        highlightedLabel: highlight(p.title, term),
      }))
    );
  if (categories.data)
    merged.push(
      ...categories.data.map((c) => ({
        id: c.id,
        type: "category",
        label: c.name,
        icon: "mdi:shape-outline",
        route: `/category/${c.slug || c.name}`,
        highlightedLabel: highlight(c.name, term),
      }))
    );
  if (profiles.data)
    merged.push(
      ...profiles.data.map((u) => ({
        id: u.id,
        type: "profile",
        label: u.display_name || u.username,
        icon: "mdi:account",
        route: `/author/${u.username}`,
        highlightedLabel: highlight(u.display_name || u.username, term),
      }))
    );
  const needle = term.trim().toLowerCase();
  const pageMatches = searchablePages.value
    .filter(pageVisible)
    .filter((p) => p.label.toLowerCase().includes(needle))
    .slice(0, 5);
  merged.push(
    ...pageMatches.map((p) => ({
      id: p.id,
      type: "page",
      label: p.label,
      icon: p.icon || "mdi:file-document-outline",
      route: p.route,
      highlightedLabel: highlight(p.label, term),
    }))
  );
  results.value = merged;
  selectedIndex.value = -1;
  loading.value = false;
}

watch(query, (val) => {
  clearTimeout(debounceTimer);
  if (!val) {
    selectedIndex.value = quickLinks.value.length ? 0 : -1;
    results.value = [];
    loading.value = false;
    return;
  }
  debounceTimer = setTimeout(() => runSearch(val), debounceMs);
});

const quickLinks = computed(() => {
  if (query.value) return [];
  const base = [
    { id: "home", type: "page", label: t("nav.home"), icon: "mdi:home", route: "/" },
  ];
  if (currentUser.value)
    base.push({
      id: "dashboard",
      type: "page",
      label: t("nav.dashboard"),
      icon: "mdi:view-dashboard",
      route: "/dashboard",
    });
  if (
    currentUser.value &&
    ["admin", "author"].includes(currentProfileRole.value)
  )
    base.push({
      id: "new-post",
      type: "page",
      label: t("posts.newPost"),
      icon: "mdi:plus-box",
      route: "/dashboard/new-post",
    });
  base.forEach((b, i) => {
    b.flatIndex = i;
  });
  return base;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
kbd.shortcut {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  font-family: ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) {
  kbd.shortcut {
    background: rgba(255, 255, 255, 0.12);
  }
}
</style>
