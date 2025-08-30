<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-start pt-10 sm:pt-40"
      @click.self="close"
    >
      <div
        class="bg-white dark:bg-gray-900 w-full max-w-full sm:max-w-lg md:max-w-2xl rounded-2xl shadow-xl p-3 sm:p-3 md:p-5"
      >
        <!-- Input -->
        <div class="flex items-center relative">
          <Icon
            icon="mdi:magnify"
            class="text-gray-500 dark:text-gray-400"
            @click="searchInput.focus()"
            :width="24"
          />
          <input
            ref="searchInput"
            type="text"
            v-model="query"
            placeholder="Search anything..."
            @keydown="handleKeydown"
            class="w-full text-base sm:text-lg px-3 sm:px-4 py-2 border-gray-300 dark:border-gray-700 bg-transparent outline-none dark:text-white"
          />
        </div>

        <hr class="my-2 border-gray-200 dark:border-gray-700" />

        <!-- Results -->
        <ul
          v-if="results.length"
          class="mt-2 sm:mt-4 max-h-80 sm:max-h-96 overflow-y-auto"
        >
          <template v-for="(group, type) in groupedResults" :key="type">
            <li class="text-sm font-semibold text-gray-500 dark:text-gray-400 py-1 list-none m-0 px-2">
              {{ typeLabels[type] || type }}
            </li>
            <li
              v-for="item in group"
              :key="item.type + '-' + item.id"
              @click="navigate(item)"
              class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg cursor-pointer"
              :class="[
                selectedIndex === item.flatIndex
                  ? 'bg-gray-200 dark:bg-gray-800'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
            >
              <Icon :icon="item.icon" class="text-lg sm:text-xl text-blue-500" />
              <span class="text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                {{ item.label }}
              </span>
            </li>
          </template>
        </ul>

        <p v-else-if="query" class="mt-4 text-sm text-gray-500 text-center">
          No results found.
        </p>
        <div
          class="mt-4 text-sm text-gray-500 hidden sm:flex justify-between items-center"
        >
          <div>
            <span class="font-semibold">Keyboard Shortcuts:</span>
            <span class="ml-2">
              <kbd><Icon icon="mdi:arrow-up" class="inline" /></kbd>
              <span class="ml-1">Up</span>
            </span>
            <span class="ml-2">
              <kbd><Icon icon="mdi:arrow-down" class="inline" /></kbd>
              <span class="ml-1">Down</span>
            </span>
            <span class="ml-2">
              <kbd><Icon icon="mdi:keyboard-return" class="inline" /></kbd>
              <span class="ml-1">Select</span>
            </span>
          </div>
          <div>
            <span>Press <kbd>Esc</kbd> to close</span>
          </div>
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

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);

const query = ref("");
const results = ref([]);
const selectedIndex = ref(-1);
const searchInput = ref(null);
const router = useRouter();

const currentUser = ref(null);
const currentProfileRole = ref(null);
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
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

const typeLabels = {
  post: "Posts",
  category: "Categories",
  profile: "Profiles",
  page: "Pages",
};

const groupedResults = computed(() => {
  return results.value.reduce((acc, item, idx) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push({ ...item, flatIndex: idx });
    return acc;
  }, {});
});

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      await nextTick();
      searchInput.value?.focus();
    }
  }
);

function close() {
  emit("update:modelValue", false);
  query.value = "";
  results.value = [];
  selectedIndex.value = -1;
}

function navigate(item) {
  close();
  router.push(item.route);
}

function handleKeydown(e) {
  const total = results.value.length;

  if (e.key === "Escape") {
    close();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % total;
    scrollIntoView();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value - 1 + total) % total;
    scrollIntoView();
  } else if (e.key === "Enter" && selectedIndex.value !== -1) {
    navigate(results.value[selectedIndex.value]);
  }
}

function scrollIntoView() {
  nextTick(() => {
    const items = document.querySelectorAll("ul li.cursor-pointer");
    const el = items[selectedIndex.value];
    if (el) el.scrollIntoView({ block: "nearest" });
  });
}

watch(query, async (val) => {
  if (val.trim().length < 2) return (results.value = []);

  const search = `%${val.trim()}%`;

  const [posts, categories, profiles] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug, content")
      .or(`title.ilike.${search},content.ilike.${search}`)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("categories")
      .select("id, name")
      .ilike("name", search)
      .limit(5),

    supabase
      .from("profiles")
      .select("id, display_name, username")
      .in("role", ["author", "admin"])
      .or(`display_name.ilike.${search},username.ilike.${search}`)
      .limit(5),
  ]);

  const merged = [];

  if (posts.data) {
    merged.push(
      ...posts.data.map((p) => ({
        id: p.id,
        type: "post",
        label: p.title,
        icon: "mdi:newspaper",
        route: `/posts/${p.slug}`,
      }))
    );
  }

  if (categories.data) {
    merged.push(
      ...categories.data.map((c) => ({
        id: c.id,
        type: "category",
        label: c.name,
        icon: "mdi:category",
        route: `/category/${c.name}`,
      }))
    );
  }

  if (profiles.data) {
    merged.push(
      ...profiles.data.map((u) => ({
        id: u.id,
        type: "profile",
        label: u.display_name || u.username,
        icon: "mdi:account",
        route: `/author/${u.username}`,
      }))
    );
  }

  const pagesList = router.options.routes
    .filter(r => r.name)
    .filter(r => !r.path.includes(':'))
    .map(r => ({
      id: r.name.toLowerCase(),
      label: r.meta?.title ? r.meta.title.split('|')[0].trim() : r.name,
      route: r.path,
      meta: r.meta || {}
    }));
  const pageMatches = pagesList
    .filter(p => p.label.toLowerCase().includes(val.trim().toLowerCase()))
    .filter(p => {
      if (p.meta.requireAnonymous) return !currentUser.value;
      if (p.meta.requiresAuthorOrAdmin)
        return currentUser.value && ['admin','author'].includes(currentProfileRole.value);
      if (p.meta.requiresAuth) return !!currentUser.value;
      return true;
    })
    .slice(0, 5);
  merged.push(
    ...pageMatches.map(p => ({
      id: p.id,
      type: 'page',
      label: p.label,
      icon: 'mdi:file-document-outline',
      route: p.route
    }))
  );

  results.value = merged;
  selectedIndex.value = -1;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
