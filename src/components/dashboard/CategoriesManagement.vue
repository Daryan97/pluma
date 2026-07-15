<template>
  <div v-bind="$attrs">
    <button
      type="button"
      @click="isOpen = true"
      class="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
    >
      <Icon icon="mdi:format-list-bulleted" class="text-base" />
      <span>{{ t('categories.manage') }}</span>
    </button>

    <Dialog :open="isOpen" @close="onManageClose" class="relative z-50">
      <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          class="w-full max-w-lg overflow-auto rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-start shadow-xl max-h-[90vh]"
        >
          <div class="flex items-center justify-between mb-4">
            <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Icon
                icon="mdi:format-list-bulleted"
                class="inline-block me-2 text-gray-600 dark:text-gray-400"
              />
              {{ t('categories.manage') }}
            </DialogTitle>
            <button
              type="button"
              @click="isOpen = false"
              class="inline-flex items-center justify-center h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Icon icon="mdi:close" class="text-base" />
            </button>
          </div>

          <div class="mb-4 flex flex-wrap gap-1.5">
            <button
              v-for="loc in enabledLocales"
              :key="loc.code"
              type="button"
              class="inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-[11px] font-medium uppercase tracking-wide transition"
              :class="
                manageLocale === loc.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              "
              @click="manageLocale = loc.code"
            >
              {{ loc.code }}
            </button>
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
            {{ t('categories.manageLocaleHint') }}
          </p>

          <div class="flex flex-col sm:flex-row gap-2 mb-4">
            <div class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition">
              <Icon icon="mdi:format-list-bulleted" class="ms-3 text-gray-500 dark:text-gray-400 text-base" />
              <input
                v-model="newName"
                @keydown.enter.prevent="addCategory"
                :placeholder="t('categories.newName')"
                class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              @click="addCategory"
              class="w-full sm:w-auto inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Icon icon="mdi:plus" class="text-base" />
              <span>{{ t('categories.add') }}</span>
            </button>
          </div>

          <div class="mb-4 relative">
            <div class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Icon icon="mdi:magnify" class="ms-3 text-gray-500 dark:text-gray-400 text-base" />
              <input
                v-model="searchTerm"
                :placeholder="t('categories.searchPlaceholder')"
                class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-700 max-h-[50vh] overflow-y-auto">
            <div
              v-if="!filteredGroups.length"
              class="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              {{ t('categories.empty') }}
            </div>
            <div
              v-for="group in filteredGroups"
              :key="group.key"
              class="py-3 space-y-2"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <template v-if="editingId && group.rows.some((r) => r.id === editingId)">
                    <input
                      v-model="editingName"
                      @keydown.enter.prevent="updateCategory(editingId)"
                      class="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white text-sm"
                    />
                  </template>
                  <template v-else>
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ groupDisplayName(group) }}
                    </span>
                    <span class="ms-2 text-[11px] text-gray-400">/{{ group.slug }}</span>
                  </template>
                </div>
                <div
                  v-if="editingId && group.rows.some((r) => r.id === editingId)"
                  class="flex gap-1 shrink-0"
                >
                  <button
                    type="button"
                    @click="updateCategory(editingId)"
                    class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                  >
                    <Icon icon="mdi:check" />
                    {{ t('common.save') }}
                  </button>
                  <button
                    type="button"
                    @click="cancelEdit"
                    class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300"
                  >
                    <Icon icon="mdi:close" />
                    {{ t('common.cancel') }}
                  </button>
                </div>
                <div v-else class="flex gap-1 shrink-0">
                  <button
                    v-if="group.rows.find((r) => r.locale === manageLocale)"
                    type="button"
                    @click="startEdit(group.rows.find((r) => r.locale === manageLocale))"
                    class="inline-flex items-center justify-center h-8 w-8 rounded-md text-amber-600 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                    :title="t('common.edit')"
                  >
                    <Icon icon="mdi:pencil-outline" class="text-base" />
                  </button>
                  <button
                    v-if="group.rows.find((r) => r.locale === manageLocale)"
                    type="button"
                    @click="askDeleteLocale(group.rows.find((r) => r.locale === manageLocale))"
                    class="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                    :title="t('categories.deleteLocale')"
                  >
                    <Icon icon="mdi:delete-outline" class="text-base" />
                  </button>
                  <button
                    type="button"
                    @click="askDeleteAllLanguages(group)"
                    class="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40"
                    :title="t('categories.deleteAllLanguages')"
                  >
                    <Icon icon="mdi:delete-sweep-outline" class="text-base" />
                  </button>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-1.5">
                <button
                  v-for="loc in enabledLocales"
                  :key="`${group.key}-${loc.code}`"
                  type="button"
                  class="inline-flex items-center gap-1 h-7 px-2 rounded-full text-[10px] font-semibold uppercase tracking-wide transition"
                  :class="localeChipClass(group, loc.code)"
                  :disabled="translating"
                  :title="localeChipTitle(group, loc.code)"
                  @click="onLocaleChip(group, loc.code)"
                >
                  <Icon
                    :icon="
                      hasLocale(group, loc.code)
                        ? 'mdi:check'
                        : 'mdi:plus'
                    "
                    class="text-sm"
                  />
                  {{ loc.code }}
                </button>
              </div>

              <div
                v-if="translateFor?.groupKey === group.key"
                class="flex flex-col sm:flex-row gap-2 pt-1"
              >
                <input
                  v-model="translateName"
                  type="text"
                  class="flex-1 h-8 rounded-md px-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  :placeholder="t('categories.translationName', { locale: translateFor.code })"
                  @keydown.enter.prevent="saveTranslation"
                />
                <div class="flex gap-1">
                  <button
                    type="button"
                    class="h-8 px-3 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                    :disabled="translating || !translateName.trim()"
                    @click="saveTranslation"
                  >
                    {{ t('categories.addTranslation') }}
                  </button>
                  <button
                    type="button"
                    class="h-8 px-3 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300"
                    @click="cancelTranslation"
                  >
                    {{ t('common.cancel') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 text-end">
            <button
              type="button"
              @click="isOpen = false"
              class="inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Icon icon="mdi:close" class="text-base" />
              <span>{{ t('common.close') }}</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

    <ConfirmDialog
      :open="!!deleteLocaleRow"
      :title="t('categories.deleteLocaleTitle')"
      :description="
        deleteLocaleRow
          ? t('categories.deleteLocaleDescription', {
              name: deleteLocaleRow.name,
              locale: deleteLocaleRow.locale,
            })
          : ''
      "
      :body="t('categories.deleteLocaleBody')"
      :confirm-label="t('categories.deleteLocale')"
      @confirm="confirmDeleteLocale"
      @cancel="deleteLocaleRow = null"
    />

    <ConfirmDialog
      :open="!!deleteAllGroup"
      :title="t('categories.deleteAllTitle')"
      :description="
        deleteAllGroup
          ? t('categories.deleteAllDescription', {
              name: groupDisplayName(deleteAllGroup),
            })
          : ''
      "
      :body="t('categories.deleteAllBody')"
      :confirm-label="t('categories.deleteAllLanguages')"
      @confirm="confirmDeleteAllLanguages"
      @cancel="deleteAllGroup = null"
    />
  </div>
</template>

<script setup>
const { t } = useI18n();

import { ref, watch, computed } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { supabase } from "@/services/supabase";
import { useContentLocale } from "@/composables/useContentLocale";
import { useBranding } from "@/stores/brandingStore";

const { locales: enabledLocales, contentLocale } = useContentLocale();
const { primaryLocale } = useBranding();

const isOpen = ref(false);
const categories = ref([]);
const newName = ref("");
const editingId = ref(null);
const editingName = ref("");
const searchTerm = ref("");
const manageLocale = ref("en");
const translateFor = ref(null);
const translateName = ref("");
const translating = ref(false);
const deleteAllGroup = ref(null);
const deleteLocaleRow = ref(null);
const deletingAll = ref(false);
const deletingLocale = ref(false);

const toast = useToast();
const emit = defineEmits(["changed"]);

const reservedCategoryNames = ["uncategorized"];

function onManageClose() {
  // Nested confirm dialogs share the close stack; ignore while a confirm is open.
  if (deleteLocaleRow.value || deleteAllGroup.value) return;
  isOpen.value = false;
}

const groups = computed(() => {
  const map = new Map();
  for (const c of categories.value) {
    const key = c.translation_group_id || c.id;
    if (!map.has(key)) {
      map.set(key, {
        key,
        slug: c.slug,
        translation_group_id: c.translation_group_id || c.id,
        rows: [],
      });
    }
    const g = map.get(key);
    g.rows.push(c);
    if (!g.slug && c.slug) g.slug = c.slug;
  }
  return [...map.values()].sort((a, b) =>
    groupDisplayName(a).localeCompare(groupDisplayName(b))
  );
});

const filteredGroups = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  if (!term) return groups.value;
  return groups.value.filter((g) =>
    g.rows.some(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        (r.slug || "").toLowerCase().includes(term)
    )
  );
});

function groupDisplayName(group) {
  const preferred =
    group.rows.find((r) => r.locale === manageLocale.value) ||
    group.rows.find((r) => r.locale === primaryLocale.value) ||
    group.rows[0];
  return preferred?.name || group.slug || "—";
}

function hasLocale(group, code) {
  return group.rows.some((r) => r.locale === code);
}

function localeChipClass(group, code) {
  if (hasLocale(group, code)) {
    return code === manageLocale.value
      ? "bg-blue-600 text-white"
      : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  }
  return "bg-gray-100 text-gray-500 dark:bg-gray-700/40 dark:text-gray-400 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/30 dark:hover:text-green-300 border border-dashed border-gray-300 dark:border-gray-600";
}

function localeChipTitle(group, code) {
  if (hasLocale(group, code)) {
    const row = group.rows.find((r) => r.locale === code);
    return row?.name || code;
  }
  return t("categories.addTranslationFor", { locale: code });
}

function onLocaleChip(group, code) {
  if (hasLocale(group, code)) {
    manageLocale.value = code;
    cancelEdit();
    cancelTranslation();
    return;
  }
  translateFor.value = { groupKey: group.key, code, group };
  translateName.value = groupDisplayName(group);
}

function cancelTranslation() {
  translateFor.value = null;
  translateName.value = "";
}

async function saveTranslation() {
  if (!translateFor.value || translating.value) return;
  const name = translateName.value.trim();
  if (!name) return;
  if (reservedCategoryNames.includes(name.toLowerCase())) {
    toast.error(t("categories.reserved"));
    return;
  }
  translating.value = true;
  try {
    const { group, code } = translateFor.value;
    let groupId = group.translation_group_id;
    const first = group.rows[0];
    if (!first.translation_group_id) {
      groupId = crypto.randomUUID();
      await supabase
        .from("categories")
        .update({ translation_group_id: groupId })
        .eq("id", first.id);
    }
    const slug = group.slug || slugify(name) || Date.now().toString();
    const { error } = await supabase.from("categories").insert({
      name,
      slug,
      locale: code,
      translation_group_id: groupId,
    });
    if (error) throw error;
    cancelTranslation();
    await fetchCategories();
    emit("changed");
    toast.success(t("categories.translationAdded"));
  } catch (e) {
    toast.error(e?.message || t("categories.translationFailed"));
  } finally {
    translating.value = false;
  }
}

async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, locale, translation_group_id")
    .order("name", { ascending: true });
  if (!error) categories.value = data || [];
}

watch(isOpen, (open) => {
  if (open) {
    manageLocale.value =
      contentLocale.value || primaryLocale.value || "en";
    fetchCategories();
  }
});

function slugify(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function addCategory() {
  const name = newName.value.trim();
  if (!name) return;
  if (reservedCategoryNames.includes(name.toLowerCase())) {
    toast.error(t("categories.reserved"));
    return;
  }
  const loc = manageLocale.value || "en";
  if (
    categories.value.some(
      (c) => c.locale === loc && c.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    toast.error(t("categories.exists"));
    return;
  }
  let baseSlug = slugify(name);
  if (!baseSlug) baseSlug = Date.now().toString();
  let uniqueSlug = baseSlug;
  let i = 1;
  while (
    categories.value.some((c) => c.locale === loc && c.slug === uniqueSlug)
  ) {
    uniqueSlug = `${baseSlug}-${i++}`;
    if (i > 100) break;
  }
  const { error } = await supabase.from("categories").insert({
    name,
    slug: uniqueSlug,
    locale: loc,
    translation_group_id: crypto.randomUUID(),
  });
  if (error) {
    toast.error(error.message);
    return;
  }
  newName.value = "";
  await fetchCategories();
  emit("changed");
  toast.success(t("categories.added"));
}

function startEdit(cat) {
  if (!cat) return;
  editingId.value = cat.id;
  editingName.value = cat.name;
  manageLocale.value = cat.locale || manageLocale.value;
}

function cancelEdit() {
  editingId.value = null;
  editingName.value = "";
}

async function updateCategory(id) {
  const name = editingName.value.trim();
  if (!name) return;
  if (reservedCategoryNames.includes(name.toLowerCase())) {
    toast.error(t("categories.reserved"));
    return;
  }
  const existing = categories.value.find((c) => c.id === id);
  if (
    categories.value.some(
      (c) =>
        c.id !== id &&
        c.locale === existing?.locale &&
        c.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    toast.error(t("categories.exists"));
    return;
  }

  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id);
  if (error) {
    toast.error(error.message);
    return;
  }
  cancelEdit();
  await fetchCategories();
  emit("changed");
  toast.success(t("categories.updated"));
}

async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    toast.error(error.message);
    return;
  }
  await fetchCategories();
  emit("changed");
  toast.success(t("categories.deleted"));
}

function askDeleteLocale(row) {
  if (!row?.id) return;
  deleteLocaleRow.value = row;
}

async function confirmDeleteLocale() {
  const row = deleteLocaleRow.value;
  if (!row?.id || deletingLocale.value) return;
  deletingLocale.value = true;
  try {
    await deleteCategory(row.id);
    deleteLocaleRow.value = null;
    if (editingId.value === row.id) cancelEdit();
  } finally {
    deletingLocale.value = false;
  }
}

function askDeleteAllLanguages(group) {
  deleteAllGroup.value = group;
}

async function confirmDeleteAllLanguages() {
  const group = deleteAllGroup.value;
  if (!group || deletingAll.value) return;
  deletingAll.value = true;
  try {
    const ids = group.rows.map((r) => r.id);
    if (!ids.length) return;
    const { error } = await supabase.from("categories").delete().in("id", ids);
    if (error) {
      toast.error(error.message);
      return;
    }
    deleteAllGroup.value = null;
    if (translateFor.value?.groupKey === group.key) {
      cancelTranslation();
    }
    cancelEdit();
    await fetchCategories();
    emit("changed");
    toast.success(t("categories.deletedAll"));
  } finally {
    deletingAll.value = false;
  }
}
</script>
