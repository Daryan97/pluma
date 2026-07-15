<template>
  <div v-bind="$attrs">
    <button
      type="button"
      @click="isOpen = true"
      class="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
    >
      <Icon icon="mdi:bookshelf" class="text-base" />
      <span>{{ t("series.manage") }}</span>
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
                icon="mdi:bookshelf"
                class="inline-block me-2 text-gray-600 dark:text-gray-400"
              />
              {{ t("series.manage") }}
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
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              "
              @click="manageLocale = loc.code"
            >
              {{ loc.code }}
            </button>
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
            {{ t("series.manageLocaleHint") }}
          </p>

          <div class="flex flex-col sm:flex-row gap-2 mb-4">
            <div
              class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition"
            >
              <Icon
                icon="mdi:bookshelf"
                class="ms-3 text-gray-500 dark:text-gray-400 text-base"
              />
              <input
                v-model="newName"
                @keydown.enter.prevent="addSeries"
                :placeholder="t('series.newName')"
                class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              @click="addSeries"
              class="w-full sm:w-auto inline-flex items-center gap-1 h-9 px-4 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Icon icon="mdi:plus" class="text-base" />
              <span>{{ t("series.add") }}</span>
            </button>
          </div>

          <div class="mb-4 relative">
            <div
              class="flex items-center h-9 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition"
            >
              <Icon
                icon="mdi:magnify"
                class="ms-3 text-gray-500 dark:text-gray-400 text-base"
              />
              <input
                v-model="searchTerm"
                :placeholder="t('series.searchPlaceholder')"
                class="flex-1 h-full bg-transparent px-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div
            class="divide-y divide-gray-200 dark:divide-gray-700 max-h-[50vh] overflow-y-auto"
          >
            <div
              v-if="!filteredGroups.length"
              class="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              {{ error || t("series.empty") }}
            </div>
            <div
              v-for="group in filteredGroups"
              :key="group.key"
              class="py-3 space-y-2"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <template
                    v-if="editingId && group.rows.some((r) => r.id === editingId)"
                  >
                    <input
                      v-model="editingName"
                      @keydown.enter.prevent="updateSeries(editingId)"
                      class="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white text-sm"
                    />
                  </template>
                  <template v-else>
                    <span
                      class="text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      {{ groupDisplayName(group) }}
                    </span>
                    <span class="ms-2 text-[11px] text-gray-400"
                      >/{{ group.slug }}</span
                    >
                  </template>
                </div>
                <div
                  v-if="editingId && group.rows.some((r) => r.id === editingId)"
                  class="flex gap-1 shrink-0"
                >
                  <button
                    type="button"
                    @click="updateSeries(editingId)"
                    class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  >
                    <Icon icon="mdi:check" />
                    {{ t("common.save") }}
                  </button>
                  <button
                    type="button"
                    @click="cancelEdit"
                    class="inline-flex items-center gap-1 h-8 px-2 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300"
                  >
                    <Icon icon="mdi:close" />
                    {{ t("common.cancel") }}
                  </button>
                </div>
                <div v-else class="flex gap-1 shrink-0">
                  <button
                    v-if="group.rows.find((r) => r.locale === manageLocale)"
                    type="button"
                    @click="
                      startEdit(group.rows.find((r) => r.locale === manageLocale))
                    "
                    class="inline-flex items-center justify-center h-8 w-8 rounded-md text-amber-600 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                    :title="t('common.edit')"
                  >
                    <Icon icon="mdi:pencil-outline" class="text-base" />
                  </button>
                  <button
                    v-if="group.rows.find((r) => r.locale === manageLocale)"
                    type="button"
                    @click="
                      askDeleteLocale(
                        group.rows.find((r) => r.locale === manageLocale)
                      )
                    "
                    class="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                    :title="t('series.deleteLocale')"
                  >
                    <Icon icon="mdi:delete-outline" class="text-base" />
                  </button>
                  <button
                    type="button"
                    @click="askDeleteAllLanguages(group)"
                    class="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40"
                    :title="t('series.deleteAllLanguages')"
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
                    :icon="hasLocale(group, loc.code) ? 'mdi:check' : 'mdi:plus'"
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
                  :placeholder="
                    t('series.translationName', { locale: translateFor.code })
                  "
                  @keydown.enter.prevent="saveTranslation"
                />
                <div class="flex gap-1">
                  <button
                    type="button"
                    class="h-8 px-3 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                    :disabled="translating || !translateName.trim()"
                    @click="saveTranslation"
                  >
                    {{ t("series.addTranslation") }}
                  </button>
                  <button
                    type="button"
                    class="h-8 px-3 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300"
                    @click="cancelTranslation"
                  >
                    {{ t("common.cancel") }}
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
              <span>{{ t("common.close") }}</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

    <ConfirmDialog
      :open="!!deleteLocaleRow"
      :title="t('series.deleteLocaleTitle')"
      :description="
        deleteLocaleRow
          ? t('series.deleteLocaleDescription', {
              name: deleteLocaleRow.name,
              locale: deleteLocaleRow.locale,
            })
          : ''
      "
      :body="t('series.deleteLocaleBody')"
      :confirm-label="t('series.deleteLocale')"
      @confirm="confirmDeleteLocale"
      @cancel="deleteLocaleRow = null"
    />

    <ConfirmDialog
      :open="!!deleteAllGroup"
      :title="t('series.deleteAllTitle')"
      :description="
        deleteAllGroup
          ? t('series.deleteAllDescription', {
              name: groupDisplayName(deleteAllGroup),
            })
          : ''
      "
      :body="t('series.deleteAllBody')"
      :confirm-label="t('series.deleteAllLanguages')"
      @confirm="confirmDeleteAllLanguages"
      @cancel="deleteAllGroup = null"
    />
  </div>
</template>

<script setup>
const { t } = useI18n();

import { ref, watch, computed, onMounted } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { Icon } from "@iconify/vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { supabase } from "@/services/supabase";
import { useContentLocale } from "@/composables/useContentLocale";
import { useBranding } from "@/stores/brandingStore";

const { locales: enabledLocales, contentLocale } = useContentLocale();
const { primaryLocale } = useBranding();

const isOpen = ref(false);
const series = ref([]);
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
const error = ref("");

const toast = useToast();
const emit = defineEmits(["changed"]);

function onManageClose() {
  if (deleteLocaleRow.value || deleteAllGroup.value) return;
  isOpen.value = false;
}

const groups = computed(() => {
  const map = new Map();
  for (const s of series.value) {
    const key = s.translation_group_id || s.id;
    if (!map.has(key)) {
      map.set(key, {
        key,
        slug: s.slug,
        translation_group_id: s.translation_group_id || s.id,
        rows: [],
      });
    }
    const g = map.get(key);
    g.rows.push(s);
    if (!g.slug && s.slug) g.slug = s.slug;
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
      ? "bg-indigo-600 text-white"
      : "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
  }
  return "bg-gray-100 text-gray-500 dark:bg-gray-700/40 dark:text-gray-400 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/30 dark:hover:text-green-300 border border-dashed border-gray-300 dark:border-gray-600";
}

function localeChipTitle(group, code) {
  if (hasLocale(group, code)) {
    const row = group.rows.find((r) => r.locale === code);
    return row?.name || code;
  }
  return t("series.addTranslationFor", { locale: code });
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
  translating.value = true;
  try {
    const { group, code } = translateFor.value;
    let groupId = group.translation_group_id;
    const first = group.rows[0];
    if (!first.translation_group_id) {
      groupId = crypto.randomUUID();
      await supabase
        .from("series")
        .update({ translation_group_id: groupId })
        .eq("id", first.id);
    }
    const slug = group.slug || slugify(name) || Date.now().toString();
    const { error: err } = await supabase.from("series").insert({
      name,
      slug,
      locale: code,
      translation_group_id: groupId,
    });
    if (err) throw err;
    cancelTranslation();
    await load();
    emit("changed");
    toast.success(t("series.translationAdded"));
  } catch (e) {
    toast.error(e?.message || t("series.translationFailed"));
  } finally {
    translating.value = false;
  }
}

async function load() {
  error.value = "";
  const { data, error: err } = await supabase
    .from("series")
    .select("id, name, slug, locale, translation_group_id")
    .order("name", { ascending: true });
  if (err) {
    error.value =
      err.message?.includes("does not exist") || err.code === "42P01"
        ? t("series.installHint")
        : err.message;
    series.value = [];
    return;
  }
  series.value = data || [];
}

watch(isOpen, (open) => {
  if (open) {
    manageLocale.value = contentLocale.value || primaryLocale.value || "en";
    load();
  }
});

function slugify(raw) {
  return String(raw || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .slice(0, 80);
}

async function addSeries() {
  const name = newName.value.trim();
  if (!name) return;
  const loc = manageLocale.value || "en";
  if (
    series.value.some(
      (s) => s.locale === loc && s.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    toast.error(t("series.exists"));
    return;
  }
  let baseSlug = slugify(name);
  if (!baseSlug) baseSlug = Date.now().toString();
  let uniqueSlug = baseSlug;
  let i = 1;
  while (series.value.some((s) => s.locale === loc && s.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${i++}`;
    if (i > 100) break;
  }
  const { error: err } = await supabase.from("series").insert({
    name,
    slug: uniqueSlug,
    locale: loc,
    translation_group_id: crypto.randomUUID(),
  });
  if (err) {
    toast.error(err.message);
    return;
  }
  newName.value = "";
  await load();
  emit("changed");
  toast.success(t("series.created"));
}

function startEdit(item) {
  if (!item) return;
  editingId.value = item.id;
  editingName.value = item.name;
  manageLocale.value = item.locale || manageLocale.value;
}

function cancelEdit() {
  editingId.value = null;
  editingName.value = "";
}

async function updateSeries(id) {
  const name = editingName.value.trim();
  if (!name) return;
  const existing = series.value.find((s) => s.id === id);
  if (
    series.value.some(
      (s) =>
        s.id !== id &&
        s.locale === existing?.locale &&
        s.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    toast.error(t("series.exists"));
    return;
  }
  const { error: err } = await supabase
    .from("series")
    .update({ name })
    .eq("id", id);
  if (err) {
    toast.error(err.message);
    return;
  }
  cancelEdit();
  await load();
  emit("changed");
  toast.success(t("series.updated"));
}

async function removeSeries(id) {
  const { error: err } = await supabase.from("series").delete().eq("id", id);
  if (err) {
    toast.error(err.message);
    return;
  }
  await load();
  emit("changed");
  toast.success(t("series.removed"));
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
    await removeSeries(row.id);
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
    const { error: err } = await supabase.from("series").delete().in("id", ids);
    if (err) {
      toast.error(err.message);
      return;
    }
    deleteAllGroup.value = null;
    if (translateFor.value?.groupKey === group.key) cancelTranslation();
    cancelEdit();
    await load();
    emit("changed");
    toast.success(t("series.deletedAll"));
  } finally {
    deletingAll.value = false;
  }
}

onMounted(load);
defineExpose({ load, series });
</script>
