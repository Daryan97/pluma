<template>
  <div>
    <button
      @click="isOpen = true"
      class="inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Icon icon="mdi:format-list-bulleted" class="text-base" />
      <span>Manage Categories</span>
    </button>

    <Dialog :open="isOpen" @close="() => (isOpen = false)" class="relative z-50">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          class="w-full max-w-sm sm:max-w-md overflow-auto rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left shadow-xl"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Icon
                icon="mdi:format-list-bulleted"
                class="inline-block mr-2 text-gray-600 dark:text-gray-400"
              />
              Manage Categories
            </DialogTitle>
            <button
              @click="isOpen = false"
              class="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Icon icon="mdi:close" class="text-base" />
            </button>
          </div>

          <!-- Add Category -->
          <div class="flex flex-col sm:flex-row gap-2 mb-4">
            <div class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition">
              <Icon icon="mdi:format-list-bulleted" class="ml-3 text-gray-500 dark:text-gray-400 text-base" />
              <input
                v-model="newName"
                @keydown.enter="addCategory"
                placeholder="New category name"
                class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
              />
            </div>
            <button
              @click="addCategory"
              class="w-full sm:w-auto inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Icon icon="mdi:plus" class="text-base" />
              <span>Add</span>
            </button>
          </div>

          <!-- Search Categories -->
          <div class="mb-4 relative">
            <div class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Icon icon="mdi:magnify" class="ml-3 text-gray-500 dark:text-gray-400 text-base" />
              <input
                v-model="searchTerm"
                placeholder="Search categories..."
                class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- List Categories -->
          <ul
            class="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto"
          >
            <li
              v-for="cat in filteredCategories"
              :key="cat.id"
              class="flex items-center justify-between py-2"
            >
              <!-- Category Name / Edit Input -->
              <div class="flex-1 pr-2">
                <template v-if="editingId === cat.id">
                  <input
                    v-model="editingName"
                    @keydown.enter="updateCategory(editingId)"
                    class="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </template>
                <template v-else>
                  <span class="text-gray-900 dark:text-gray-100">{{ cat.name }}</span>
                </template>
              </div>
              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-2">
                <template v-if="editingId === cat.id">
                  <button
                    @click="updateCategory(cat.id)"
                    class="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Icon icon="mdi:check" class="text-base" />
                    <span>Save</span>
                  </button>
                  <button
                    @click="cancelEdit"
                    class="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <Icon icon="mdi:close" class="text-base" />
                    <span>Cancel</span>
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="startEdit(cat)"
                    class="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <Icon icon="mdi:pencil-outline" class="text-base" />
                    <span>Edit</span>
                  </button>
                  <button
                    @click="deleteCategory(cat.id)"
                    class="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <Icon icon="mdi:delete-outline" class="text-base" />
                    <span>Delete</span>
                  </button>
                </template>
              </div>
            </li>
          </ul>

          <!-- Footer -->
          <div class="mt-4 text-right">
            <button
              @click="isOpen = false"
              class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Icon icon="mdi:close" class="text-base" />
              <span>Close</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import { supabase } from "@/services/supabase";
import { useToast } from "vue-toastification";

const isOpen = ref(false);
const categories = ref([]);
const newName = ref("");
const editingId = ref(null);
const editingName = ref("");
const searchTerm = ref("");

const toast = useToast();

const reservedCategoryNames = ["uncategorized"];

const filteredCategories = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  return term
    ? categories.value.filter(c => c.name.toLowerCase().includes(term))
    : categories.value;
});

async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });
  if (!error) categories.value = data;
}

watch(isOpen, (open) => {
  if (open) fetchCategories();
});

function slugify(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function addCategory() {
  const name = newName.value.trim();
  if (!name) return;
  if (reservedCategoryNames.includes(name.toLowerCase())) {
    toast.error("That name is reserved");
    return;
  }
  if (categories.value.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    toast.error("Category already exists");
    return;
  }
  let baseSlug = slugify(name);
  if (!baseSlug) baseSlug = Date.now().toString();
  let uniqueSlug = baseSlug;
  let i = 1;
  while (categories.value.some(c => c.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${i++}`;
    if (i > 100) break;
  }
  await supabase.from("categories").insert({ name, slug: uniqueSlug });
  newName.value = "";
  fetchCategories();
  toast.success("Category added");
}

function startEdit(cat) {
  editingId.value = cat.id;
  editingName.value = cat.name;
}

function cancelEdit() {
  editingId.value = null;
  editingName.value = "";
}

async function updateCategory(id) {
  const name = editingName.value.trim();
  if (!name) return;
  if (reservedCategoryNames.includes(name.toLowerCase())) {
    toast.error("That name is reserved");
    return;
  }
  if (categories.value.some(c => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
    toast.error("Category already exists");
    return;
  }

  const existing = categories.value.find(c => c.id === id);
  let updatePayload = { name };
  if (existing && !existing.slug) {
    let baseSlug = slugify(name);
    if (!baseSlug) baseSlug = Date.now().toString();
    let uniqueSlug = baseSlug;
    let i = 1;
    while (categories.value.some(c => c.slug === uniqueSlug && c.id !== id)) {
      uniqueSlug = `${baseSlug}-${i++}`;
      if (i > 100) break;
    }
    updatePayload.slug = uniqueSlug;
  }
  await supabase
    .from("categories")
    .update(updatePayload)
    .eq("id", id);
  cancelEdit();
  fetchCategories();
  toast.success("Category updated");
}

async function deleteCategory(id) {
  await supabase.from("categories").delete().eq("id", id);
  fetchCategories();
  toast.success("Category deleted");
}
</script>
