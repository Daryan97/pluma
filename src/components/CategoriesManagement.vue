<template>
  <div>
    <button
      @click="isOpen = true"
      class="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-900 text-white rounded-md new-post-button"
    >
      <Icon icon="mdi:format-list-bulleted" class="inline-block mr-2" />
      Manage Categories
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
              class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Icon icon="mdi:close" class="text-xl" />
            </button>
          </div>

          <!-- Add Category -->
          <div class="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              v-model="newName"
              @keydown.enter="addCategory"
              placeholder="New category name"
              class="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              @click="addCategory"
              class="w-full sm:w-auto px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Icon icon="mdi:plus" class="inline-block mr-1" />
              Add
            </button>
          </div>

          <!-- Search Categories -->
          <div class="mb-4">
            <input
              v-model="searchTerm"
              placeholder="Search categories..."
              class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
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
                    class="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Icon icon="mdi:check" class="inline-block mr-1" />
                    Save
                  </button>
                  <button
                    @click="cancelEdit"
                    class="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    <Icon icon="mdi:close" class="inline-block mr-1" />
                    Cancel
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="startEdit(cat)"
                    class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    <Icon icon="mdi:pencil-outline" class="inline-block mr-1" />
                    Edit
                  </button>
                  <button
                    @click="deleteCategory(cat.id)"
                    class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Icon icon="mdi:delete-outline" class="inline-block mr-1" />
                    Delete
                  </button>
                </template>
              </div>
            </li>
          </ul>

          <!-- Footer -->
          <div class="mt-4 text-right">
            <button
              @click="isOpen = false"
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <Icon icon="mdi:close" class="inline-block mr-1" />
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
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

const filteredCategories = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  return term
    ? categories.value.filter(c => c.name.toLowerCase().includes(term))
    : categories.value;
});

async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });
  if (!error) categories.value = data;
}

watch(isOpen, (open) => {
  if (open) fetchCategories();
});

async function addCategory() {
  const name = newName.value.trim();
  if (!name) return;
  if (categories.value.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    toast.error("Category already exists");
    return;
  }
  await supabase.from("categories").insert({ name });
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
  if (categories.value.some(c => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
    toast.error("Category already exists");
    return;
  }
  await supabase
    .from("categories")
    .update({ name })
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

<style scoped>
.new-post-button {
  transition: background-color 0.3s;
}

.new-post-button:hover {
  background-color: #2563eb;
}
</style>
