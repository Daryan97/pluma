<template>
  <div v-bind="$attrs">
    <button
      @click="isOpen = true"
      class="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
    >
      <Icon icon="mdi:bookshelf" class="text-base" />
      <span>{{ t('series.manage') }}</span>
    </button>

    <Dialog :open="isOpen" @close="() => (isOpen = false)" class="relative z-50">
      <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          class="w-full max-w-sm sm:max-w-md overflow-auto rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left shadow-xl"
        >
          <div class="flex items-center justify-between mb-4">
            <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Icon icon="mdi:bookshelf" class="inline-block mr-2 text-gray-600 dark:text-gray-400" />
              {{ t('series.manage') }}
            </DialogTitle>
            <button
              @click="isOpen = false"
              class="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60"
            >
              <Icon icon="mdi:close" class="text-base" />
            </button>
          </div>

          <div class="flex flex-col gap-2 mb-4">
            <input
              v-model="newName"
              @keydown.enter="addSeries"
              :placeholder="t('series.newName')"
              class="h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              @click="addSeries"
              class="inline-flex items-center justify-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
            >
              <Icon icon="mdi:plus" class="text-base" />
              {{ t('series.add') }}
            </button>
          </div>

          <ul class="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
            <li
              v-for="item in series"
              :key="item.id"
              class="flex items-center justify-between py-2 gap-2"
            >
              <div class="min-w-0 flex-1">
                <div class="truncate text-gray-900 dark:text-gray-100">{{ item.name }}</div>
                <div class="truncate text-[11px] text-gray-500">{{ item.slug }}</div>
              </div>
              <button
                @click="removeSeries(item.id)"
                class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
              >
                <Icon icon="mdi:delete-outline" class="text-sm" />
              </button>
            </li>
          </ul>
          <p v-if="error" class="mt-3 text-xs text-amber-600 dark:text-amber-400">{{ error }}</p>
        </DialogPanel>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
const { t } = useI18n()
const localePath = useLocalePath()

import { onMounted, ref } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import { supabase } from "@/services/supabase";
const emit = defineEmits(["changed"]);
const toast = useToast();
const isOpen = ref(false);
const series = ref([]);
const newName = ref("");
const error = ref("");

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function load() {
  error.value = "";
  const { data, error: err } = await supabase
    .from("series")
    .select("id, name, slug")
    .order("name");
  if (err) {
    error.value =
      err.message?.includes("does not exist") || err.code === "42P01"
        ? t('series.installHint')
        : err.message;
    series.value = [];
    return;
  }
  series.value = data || [];
}

async function addSeries() {
  const name = newName.value.trim();
  if (!name) return;
  const slug = slugify(name);
  const { error: err } = await supabase.from("series").insert([{ name, slug }]);
  if (err) {
    toast.error(err.message);
    return;
  }
  newName.value = "";
  await load();
  emit("changed");
  toast.success(t('series.created'));
}

async function removeSeries(id) {
  const { error: err } = await supabase.from("series").delete().eq("id", id);
  if (err) {
    toast.error(err.message);
    return;
  }
  await load();
  emit("changed");
  toast.success(t('series.removed'));
}

onMounted(load);
defineExpose({ load, series });
</script>
